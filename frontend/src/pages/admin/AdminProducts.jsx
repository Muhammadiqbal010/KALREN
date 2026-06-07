import React, { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../api/axios';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiUploadCloud, FiTrash2, FiPercent, FiEdit2, FiShoppingBag, FiCrop, FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '../../context/AuthContext';
import { getCroppedImg } from '../../utils/cropImage';

// =========================================================
// 🔔 MINI COMPONENT: PREMIUM MINIMALIST POPUP MODAL
// =========================================================
const NotificationPopup = ({ isOpen, type, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[1.8rem] max-w-sm w-full space-y-5 text-center shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-2">
          {type === 'success' ? (
            <FiCheckCircle className="text-emerald-400 text-3xl animate-pulse" />
          ) : (
            <FiAlertTriangle className="text-red-400 text-3xl animate-bounce" />
          )}
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {type === 'confirm' ? 'KONFIRMASI TINDAKAN' : type === 'success' ? 'PROSES BERHASIL' : 'SISTEM EROR'}
          </h3>
          <p className="text-gray-400 text-xs tracking-wide leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          {type === 'confirm' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl font-bold text-[11px] tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[11px] tracking-wider uppercase hover:bg-red-700 transition-all cursor-pointer"
              >
                HAPUS
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-white text-black rounded-xl font-black text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Siap, Dimengerti
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 🎯 MINI COMPONENT: STUDIO CROP SYSTEM (RESPONSIVE BOX)
// =========================================================
const ImageCropperModal = ({ src, onCropComplete, onCancel, onErrorTrigger }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = makeAspectCrop({ unit: '%', width: 90 }, 4 / 5, width, height);
    setCrop(centerCrop(initialCrop, width, height));
  };

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      onErrorTrigger("Silakan pilih area potong terlebih dahulu dengan menggeser kotak seleksi.");
      return;
    }

    try {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY
      };

      const croppedBlob = await getCroppedImg(src, pixelCrop);
      
      if (croppedBlob) {
        const croppedFile = new File([croppedBlob], 'cropped_image.jpg', { type: 'image/jpeg' });
        onCropComplete(croppedFile);
      }
    } catch (error) {
      console.error("Gagal memproses sinkronisasi pemotongan gambar:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-[99999] p-4 font-['Inter']">
      <div className="bg-[#0a0a0a] border border-white/10 p-4 md:p-6 rounded-[2rem] max-w-sm md:max-w-md w-full space-y-4 shadow-2xl flex flex-col items-center">
        
        <div className="w-full flex justify-between items-center border-b border-white/5 pb-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">4:5 Studio Precision</h3>
            <p className="text-gray-500 text-[8px] uppercase tracking-widest mt-0.5">Locks catalog grid consistency</p>
          </div>
          <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider">
            Studio View
          </span>
        </div>

        {/* 🎯 RESPONSIVE CONTAINER FIX: Mengikuti aspect-square fleksibel maksimal 340px di mobile */}
        <div className="w-full aspect-square max-w-[340px] max-h-[340px] flex items-center justify-center bg-[#050505] rounded-xl border border-white/5 overflow-hidden relative mx-auto p-2">
          <ReactCrop 
            crop={crop} 
            onChange={(c) => setCrop(c)} 
            onComplete={(c) => setCompletedCrop(c)} 
            aspect={4 / 5} 
            keepSelection
          >
            <img 
              ref={imgRef} 
              src={src} 
              alt="Source pipeline crop" 
              onLoad={onImageLoad} 
              crossOrigin="anonymous"
              className="max-w-[280px] max-h-[280px] w-auto h-auto object-contain select-none rounded-md block mx-auto"
            />
          </ReactCrop>
        </div>

        <div className="w-full flex gap-3 pt-1">
          <button type="button" onClick={onCancel} className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer">
            Lewati
          </button>
          <button type="button" onClick={handleSave} className="flex-1 py-3 bg-white text-black rounded-xl font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all cursor-pointer">
            POTONG FOTO
          </button>
        </div>

      </div>
    </div>
  );
};

// =========================================================
// 🎮 MINI COMPONENT: SORTABLE PHOTO CATALOG TILE
// =========================================================
const SortablePhoto = ({ id, url, index, onDelete, onRecrop }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative group aspect-[4/5] bg-[#111] rounded-xl overflow-hidden border border-white/5 shadow-md">
      <div className="w-full h-full cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <img src={url} className="w-full h-full object-cover pointer-events-none" alt={`preview ${index}`} />
      </div>
      
      <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider select-none pointer-events-none">
        {index === 0 ? "MAIN" : `IMG ${index + 1}`}
      </div>

      {/* Kontrol aksi otomatis muncul di mobile, dan via hover di desktop */}
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-30">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRecrop(id, url); }}
          className="bg-white hover:bg-zinc-200 text-black w-6 h-6 rounded-full flex items-center justify-center shadow-md transition cursor-pointer"
          title="Crop Ulang"
        >
          <FiCrop size={11} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(id); }}
          className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md transition cursor-pointer"
          title="Hapus"
        >
          <FiTrash2 size={11} />
        </button>
      </div>
    </div>
  );
};

// =========================================================
// ⚡ MAIN COMPONENT CORE HUB
// =========================================================
const AdminProducts = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', fit: 'Regular Fit', series: 'KALREN', description: '',
    material: '', status_tag: 'New Arrival', price_actual: '',
    price_strike: '', shopee_link: '', tiktok_link: '', is_discount: false,
  });

  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]); 
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L', 'XL']);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [cropQueue, setCropQueue] = useState([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [recropTargetId, setRecropTargetId] = useState(null);

  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '', onConfirm: null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ isOpen: true, type, message, onConfirm });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/admin/list');
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal load katalog produk:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDiscount = () => {
    setFormData(prev => ({ ...prev, is_discount: !prev.is_discount }));
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const queueItems = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setCropQueue(prev => [...prev, ...queueItems]);
    setCurrentCropIndex(0);
    e.target.value = '';
  };

  const handleCropComplete = (croppedFile) => {
    const uniqueId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newImageObj = { 
      id: uniqueId, 
      file: croppedFile, 
      preview: URL.createObjectURL(croppedFile),
      isExisting: false
    };
    
    setImages(prev => {
      if (recropTargetId) {
        return prev.map(img => img.id === recropTargetId ? newImageObj : img);
      }
      return [...prev, newImageObj];
    });
    
    setRecropTargetId(null);
    moveToNextInQueue();
  };

  const moveToNextInQueue = () => {
    if (currentCropIndex + 1 < cropQueue.length) {
      setCurrentCropIndex(currentCropIndex + 1);
    } else {
      setCropQueue([]);
      setCurrentCropIndex(null);
    }
  };

  const handleDeleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleTriggerRecropExisting = (id, url) => {
    setRecropTargetId(id);
    setCropQueue([{ file: null, previewUrl: url }]);
    setCurrentCropIndex(0);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditingProductId(product._id);
    setFormData({
      name: product.name || '',
      fit: product.fit || 'Regular Fit',
      series: product.series || 'KALREN',
      description: product.description || '',
      material: product.material || '',
      price_actual: product.price || '',
      price_strike: product.compare_price || '',
      shopee_link: product.links?.shopee || '',
      tiktok_link: product.links?.tiktok || '',
      is_discount: product.is_discount || false
    });
    setSelectedSizes(product.available_sizes || []);
    
    if (product.image_urls && Array.isArray(product.image_urls)) {
      const existingImages = product.image_urls.map((url, idx) => ({
        id: `existing-node-${idx}`, 
        file: null, 
        preview: url,
        isExisting: true
      }));
      setImages(existingImages);
    } else {
      setImages([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingProductId(null);
    setFormData({
      name: '', fit: 'Regular Fit', series: 'KALREN', description: '',
      material: '', status_tag: 'New Arrival', price_actual: '',
      price_strike: '', shopee_link: '', tiktok_link: '', is_discount: false
    });
    setSelectedSizes(['M', 'L', 'XL']);
    setImages([]);
  };

  const handleDeleteProduct = (productId, productName) => {
    triggerPopup(
      'confirm',
      `Apakah kamu yakin ingin menghapus "${productName.toUpperCase()}" secara permanen dari katalog aktif?`,
      async () => {
        closePopup();
        try {
          await api.delete(`/api/admin/delete-product/${productId}`);

          await api.post('/api/admin/create-log', {
            username: user?.username || 'Unknown Admin',
            role: user?.role || 'admin',
            action: 'DELETE PRODUCT',
            target: productName.trim().toUpperCase(),
            detail: `Menghapus berkas produk aktif dari cluster database MongoDB Atlas.`
          }).catch(err => console.error("Log bypass:", err));

          triggerPopup('success', 'Produk berhasil dihapus dari katalog utama.');
          fetchProducts(); 
        } catch (err) {
          triggerPopup('error', err.response?.data?.detail || 'Gagal menghapus data produk.');
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      triggerPopup('error', 'Wajib mengunggah minimal 1 foto produk.');
      return;
    }

    setLoading(true);
    const data = new FormData();

    data.append('name', formData.name.trim());
    data.append('fit', formData.fit);
    data.append('series', formData.series);
    data.append('price_actual', String(formData.price_actual));
    
    if (formData.is_discount && formData.price_strike) {
      data.append('price_strike', String(formData.price_strike));
    } else {
      data.append('price_strike', ''); 
    }

    data.append('material', formData.material ? formData.material.trim() : '');
    data.append('description', formData.description ? formData.description.trim() : '');
    data.append('shopee_link', formData.shopee_link ? formData.shopee_link.trim() : '');
    data.append('tiktok_link', formData.tiktok_link ? formData.tiktok_link.trim() : '');
    data.append('is_discount', formData.is_discount ? "true" : "false");
    data.append('available_sizes', selectedSizes.join(','));

    images.forEach((img, index) => {
      if (img.file && img.file instanceof File) {
        data.append('images', img.file, `product_${index}.jpg`);
      } else if (img.isExisting && typeof img.preview === 'string') {
        data.append('images', img.preview);
      }
    });

    try {
      if (isEditing) {
        await api.put(`/api/admin/edit-product/${editingProductId}`, data);

        await api.post('/api/admin/create-log', {
          username: user?.username || 'Unknown Admin',
          role: user?.role || 'admin',
          action: 'EDIT PRODUCT',
          target: formData.name.trim().toUpperCase(),
          detail: `Berhasil memperbarui data spesifikasi material/harga artikel katalog.`
        }).catch(err => console.error("Log bypass:", err));

        triggerPopup('success', 'Data produk berhasil diperbarui.');
      } else {
        await api.post('/api/admin/add-product', data); 

        await api.post('/api/admin/create-log', {
          username: user?.username || 'Unknown Admin',
          role: user?.role || 'admin',
          action: 'ADD PRODUCT',
          target: formData.name.trim().toUpperCase(),
          detail: `Berhasil mengarsipkan pakaian seri ${formData.series} baru ke sistem.`
        }).catch(err => console.error("Log bypass:", err));

        triggerPopup('success', 'Produk baru berhasil ditambahkan ke katalog.');
      }

      cancelEditing();
      fetchProducts();
    } catch (err) {
      let errorMessage = 'Gagal memproses data produk.';
      if (err.response?.data) {
        const errorData = err.response.data;
        if (Array.isArray(errorData.detail)) {
          const firstError = errorData.detail[0];
          errorMessage = `Error field ${firstError.loc?.join(' -> ')}: ${firstError.msg}`;
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      }
      triggerPopup('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 bg-black text-white p-4 md:p-6 min-h-screen font-['Inter'] antialiased overflow-x-hidden">
      <div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
          {isEditing ? "⚙️ Matrix Editor Hub" : "Product Archiver"}
        </h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mt-1">
          {isEditing ? `Modifying active document ID: ${editingProductId}` : "Add items and manage active archive database"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* FORM KIRI */}
        <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] space-y-6 lg:col-span-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Article Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Einstein Boxy Tee" className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" required />
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Fit Style</label>
                <select name="fit" value={formData.fit} onChange={handleChange} className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20">
                  <option value="Regular Fit">Regular Fit</option>
                  <option value="Boxy Fit">Boxy Fit</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Series Line</label>
                <select name="series" value={formData.series} onChange={handleChange} className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20">
                  <option value="KALREN">KALREN</option>
                  <option value="KLRN">KLRN</option>
                  <option value="LOGO">LOGO</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Actual Price (IDR)</label>
              <input type="number" name="price_actual" value={formData.price_actual} onChange={handleChange} placeholder="185000" className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" required />
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Strike Price (Optional)</label>
              <input type="number" name="price_strike" value={formData.price_strike} onChange={handleChange} placeholder="249000" disabled={!formData.is_discount} className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-mono" />
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Discount Status</label>
              <button type="button" onClick={toggleDiscount} className={`w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${formData.is_discount ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-black border-white/5 text-gray-500 hover:border-white/10'}`}>
                <span className="flex items-center gap-2"><FiPercent size={14} /> {formData.is_discount ? "SALE ON" : "SALE OFF"}</span>
                <span className={`w-2 h-2 rounded-full ${formData.is_discount ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`} />
              </button>
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Material / Fabric</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="Heavyweight 16s" className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3">Available Sizes</label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {sizes.map(sz => (
                <button type="button" key={sz} onClick={() => handleSizeChange(sz)} className={`w-10 h-10 md:w-12 md:h-12 border rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${selectedSizes.includes(sz) ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white hover:border-white/30'}`}>{sz}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                Description & Specifications (Supports Markdown)
              </label>
            </div>
            
            {/* Tata Letak Fleksibel: Atas-Bawah di HP, Kiri-Kanan di Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="5" 
                placeholder="Gunakan format Markdown standar untuk deskripsi..." 
                className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 resize-none font-mono leading-relaxed" 
              />

              <div className="w-full bg-[#050505] border border-white/5 p-3 md:p-4 rounded-xl text-zinc-400 text-xs overflow-y-auto h-[124px] md:h-auto max-h-[148px] custom-scrollbar leading-relaxed">
                {formData.description ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0 text-zinc-400" {...props} />,
                        ul: ({node, ...props}) => <ul className="space-y-0.5 my-1 list-none pl-0" {...props} />,
                        li: ({node, ...props}) => (
                          <li className="flex items-start gap-1.5" {...props}>
                            <span className="text-white font-bold">•</span>
                            <span>{props.children}</span>
                          </li>
                        ),
                        strong: ({node, ...props}) => <strong className="font-black text-white" {...props} />
                      }}
                    >
                      {formData.description}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-zinc-600 italic font-mono flex items-center justify-center h-full select-none text-[10px] uppercase tracking-wider">
                    Pratinjau Markdown Kosong...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Shopee Link</label>
              <input type="text" name="shopee_link" value={formData.shopee_link} onChange={handleChange} placeholder="https://shopee.co.id/..." className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">TikTok Shop Link</label>
              <input type="text" name="tiktok_link" value={formData.tiktok_link} onChange={handleChange} placeholder="https://tiktok.com/..." className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isEditing && (
              <button type="button" onClick={cancelEditing} className="w-full sm:flex-1 bg-zinc-900 border border-white/10 text-white py-3.5 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all cursor-pointer">
                Batal Edit
              </button>
            )}
            <button type="submit" disabled={loading} className="w-full sm:flex-[2] bg-white text-black py-3.5 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-neutral-200 disabled:opacity-40 transition-all cursor-pointer">
              {loading ? "PROSES..." : isEditing ? "SIMPAN PERUBAHAN" : "PUBLIKASIKAN PRODUK"}
            </button>
          </div>
        </div>

        {/* MEDIA KANAN */}
        <div className="space-y-4 lg:col-span-1 w-full">
          <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl md:rounded-[1.8rem] space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Product Imagery</p>
              <p className="text-gray-600 text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">Drag tiles to reorder sequence</p>
            </div>

            {images.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                    {images.map((img, index) => (
                      <SortablePhoto 
                        key={img.id} 
                        id={img.id} 
                        url={img.preview} 
                        index={index} 
                        onDelete={handleDeleteImage} 
                        onRecrop={handleTriggerRecropExisting} 
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <label className="flex flex-col justify-center items-center text-center p-6 md:p-8 border border-dashed border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 cursor-pointer group bg-black/40">
              <FiUploadCloud className="text-2xl text-gray-600 mb-2 group-hover:text-white transition-colors" />
              <p className="text-[11px] font-bold uppercase tracking-wider">Upload Images</p>
              <p className="text-gray-600 text-[8px] uppercase tracking-widest mt-1 max-w-[180px] mx-auto leading-relaxed">Supports multi-file select. Locked to 4:5 layout.</p>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImagesChange} />
            </label>
          </div>
        </div>
      </form>

      {/* REPOSITORI DATA BAWAH */}
      <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] space-y-4 md:space-y-6">
        <div>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <FiShoppingBag size={18} /> Active Product Repositories
          </h2>
          <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">Daftar item katalog produk aktif yang terbaca di database</p>
        </div>

        <div className="overflow-x-auto border border-white/5 rounded-xl bg-black -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/5 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500 bg-zinc-950">
                <th className="p-3 md:p-4">Article</th>
                <th className="p-3 md:p-4">Series</th>
                <th className="p-3 md:p-4">Actual Price</th>
                <th className="p-3 md:p-4">Discount Status</th>
                <th className="p-3 md:p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center font-mono text-zinc-600 tracking-wider">NO ACTIVE PRODUCTS FOUND IN DATABASE</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 md:p-4 font-bold text-white uppercase">{prod.name}<span className="text-[9px] text-zinc-500 lowercase font-light block">{prod.fit}</span></td>
                    <td className="p-3 md:p-4 font-mono text-zinc-400">{prod.series}</td>
                    <td className="p-3 md:p-4 font-bold">Rp {prod.price?.toLocaleString('id-ID')}</td>
                    <td className="p-3 md:p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${prod.is_discount ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-800 text-zinc-400'}`}>{prod.is_discount ? "SALE" : "NORMAL"}</span></td>
                    <td className="p-3 md:p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button type="button" onClick={() => openEditModal(prod)} className="p-2 bg-white/5 border border-white/5 hover:border-white/20 text-white rounded-lg transition-all inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider cursor-pointer"><FiEdit2 size={11} /> Edit</button>
                        <button type="button" onClick={() => handleDeleteProduct(prod._id, prod.name)} className="p-2 bg-red-900/20 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 rounded-lg transition-all inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider cursor-pointer"><FiTrash2 size={11} /> Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {currentCropIndex !== null && cropQueue[currentCropIndex] && (
        <ImageCropperModal 
          src={cropQueue[currentCropIndex].previewUrl} 
          onCropComplete={handleCropComplete} 
          onCancel={moveToNextInQueue} 
          onErrorTrigger={(msg) => triggerPopup('error', msg)}
        />
      )}

      <NotificationPopup 
        isOpen={popup.isOpen}
        type={popup.type}
        message={popup.message}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
      />
    </div>
  );
};

export default AdminProducts;