import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import { FiTrash2, FiPlus, FiImage, FiHash, FiEdit2, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

// Core library image cropper
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// =========================================================
// 🔔 MINI COMPONENT: PREMIUM MINIMALIST POPUP MODAL
// =========================================================
const NotificationPopup = ({ isOpen, type, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-[#121212] border border-white/10 p-6 rounded-[1.8rem] max-w-sm w-full space-y-5 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
// MINI COMPONENT: LOOKBOOK STUDIO CROP SYSTEM (4:5 LOCK)
// =========================================================
const LookbookCropperModal = ({ src, onCropComplete, onCancel, onErrorTrigger }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = makeAspectCrop({ unit: '%', width: 90 }, 4 / 5, width, height);
    setCrop(centerCrop(initialCrop, width, height));
  };

  const handleSave = () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      onErrorTrigger("Silakan pilih area potong terlebih dahulu dengan menggeser kotak seleksi.");
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], 'cropped_lookbook.jpg', { type: 'image/jpeg' });
      onCropComplete(croppedFile);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[99999] p-4">
      <div className="bg-[#121212] border border-white/10 p-5 rounded-[2rem] max-w-sm md:max-w-md w-full space-y-4 shadow-2xl">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-white">Lookbook 4:5 Precision Crop</h3>
          <p className="text-gray-500 text-[8px] uppercase tracking-widest mt-0.5">Locks visual drop image to match editorial standards</p>
        </div>

        {/* Responsive constraints container for mobile views */}
        <div className="w-full aspect-square max-w-[340px] max-h-[320px] overflow-auto border border-white/5 rounded-xl bg-black flex items-center justify-center p-2 mx-auto">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={4 / 5} keepSelection>
            <img ref={imgRef} src={src} alt="Source pipeline crop" onLoad={onImageLoad} className="max-w-[260px] max-h-[260px] w-auto h-auto object-contain rounded-md" />
          </ReactCrop>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onCancel} className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer">
            Batal
          </button>
          <button type="button" onClick={handleSave} className="flex-1 py-3 bg-white text-black rounded-xl font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all cursor-pointer">
            POTONG GAMBAR
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Component ---
const AdminLookbook = () => {
  const { user } = useAuth(); 
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [activeCropSrc, setActiveCropSrc] = useState(null);
  const [cropMode, setCropMode] = useState(null);

  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '', onConfirm: null });

  const [formData, setFormData] = useState({ title: '', sort_order: 0, imageFile: null });

  const [editData, setEditData] = useState({ id: '', title: '', sort_order: 0, is_active: true, imageFile: null, currentImageUrl: '' });

  const triggerPopup = (type, message, onConfirm = null) => {
    setPopup({ isOpen: true, type, message, onConfirm });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const fetchLookbooks = async () => {
    try {
      const res = await api.get('/api/lookbook');
      setLookbooks(res.data);
    } catch (err) {
      console.error("Gagal memuat manajemen data lookbook:", err);
    }
  };

  useEffect(() => {
    fetchLookbooks();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActiveCropSrc(URL.createObjectURL(file));
      setCropMode('create');
    }
    e.target.value = '';
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActiveCropSrc(URL.createObjectURL(file));
      setCropMode('edit');
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedFile) => {
    if (cropMode === 'create') {
      setFormData(prev => ({ ...prev, imageFile: croppedFile }));
      setPreviewUrl(URL.createObjectURL(croppedFile));
    } else if (cropMode === 'edit') {
      setEditData(prev => ({ ...prev, imageFile: croppedFile }));
    }
    setActiveCropSrc(null);
    setCropMode(null);
  };

  const handleCancelCrop = () => {
    setActiveCropSrc(null);
    setCropMode(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageFile) {
      triggerPopup('error', 'Wajib memilih minimal satu foto untuk meluncurkan campaign baru.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('sort_order', formData.sort_order);
    
    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      await api.post('/api/admin/lookbook', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      await api.post('/api/admin/create-log', {
        username: user?.username || 'Unknown Admin',
        role: user?.role || 'admin',
        action: 'ADD LOOKBOOK',
        target: formData.title.trim().toUpperCase(),
        detail: `Berhasil menerbitkan visualisasi campaign baru ke dalam urutan ke-${formData.sort_order}`
      }).catch(err => console.error("Log bypass:", err));

      setFormData({ title: '', sort_order: 0, imageFile: null });
      setPreviewUrl(null);
      fetchLookbooks();
      triggerPopup('success', 'Campaign baru berhasil ditambahkan ke halaman lookbook.');
    } catch (err) {
      triggerPopup('error', 'Gagal memproses unggahan data campaign baru.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item) => {
    setEditData({
      id: item._id, 
      title: item.title,
      sort_order: item.sort_order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true,
      imageFile: null,
      currentImageUrl: item.image_url
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', editData.title);
    data.append('sort_order', editData.sort_order);
    data.append('is_active', editData.is_active);
    if (editData.imageFile) {
      data.append('image', editData.imageFile);
    }

    try {
      await api.put(`/api/admin/lookbook/${editData.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.post('/api/admin/create-log', {
        username: user?.username || 'Unknown Admin',
        role: user?.role || 'admin',
        action: 'EDIT LOOKBOOK',
        target: editData.title.trim().toUpperCase(),
        detail: `Berhasil mengubah struktur teks judul/urutan posisi katalog campaign`
      }).catch(err => console.error("Log bypass:", err));

      setEditModalOpen(false);
      fetchLookbooks();
      triggerPopup('success', 'Perubahan data campaign berhasil diperbarui.');
    } catch (err) {
      triggerPopup('error', 'Gagal memperbarui data perubahan campaign.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLookbook = (id, title) => {
    triggerPopup(
      'confirm',
      `Apakah kamu yakin ingin menghapus campaign "${title.toUpperCase()}" secara permanen dari katalog lookbook?`,
      async () => {
        closePopup();
        try {
          await api.delete(`/api/lookbook/${id}`);

          await api.post('/api/admin/create-log', {
            username: user?.username || 'Unknown Admin',
            role: user?.role || 'admin',
            action: 'DELETE LOOKBOOK',
            target: title.trim().toUpperCase(),
            detail: `Menghapus aset gambar berkas campaign secara permanen dari sistem`
          }).catch(err => console.error("Log bypass:", err));

          triggerPopup('success', 'Campaign berhasil dihapus dari halaman lookbook.');
          fetchLookbooks();
        } catch (err) {
          triggerPopup('error', 'Gagal mengeksekusi penghapusan item campaign.');
        }
      }
    );
  };

  return (
    <div className="space-y-6 md:space-y-10 font-['Inter'] bg-black text-white p-2 min-h-screen antialiased overflow-x-hidden">
      <div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Lookbook Engine</h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mt-1">Core database matrix table layout control panel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* PANEL LEFT: ADD FORM */}
        <div className="lg:col-span-4 bg-[#121212] border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <h2 className="text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-4 text-gray-300">
            <FiPlus className="text-blue-400 stroke-[3]" /> Add Campaign Article
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Campaign Title</label>
              <input 
                type="text"
                placeholder="e.g. KALREN HEAVYWEIGHT DROP 01"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Sort Order Position</label>
              <div className="relative">
                <FiHash className="absolute left-4 top-3.5 md:top-4 text-gray-600 text-sm" />
                <input 
                  type="number"
                  placeholder="0"
                  value={formData.sort_order}
                  onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  className="w-full bg-black border border-white/5 pl-12 pr-4 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Campaign Image Asset (4:5 Locked)</label>
              <div className="relative border border-dashed border-white/10 hover:border-white/20 rounded-2xl p-4 bg-black text-center transition-all">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview" className="max-h-52 md:max-h-64 aspect-[4/5] mx-auto object-cover rounded-xl" />
                    <p className="text-[9px] md:text-[10px] text-gray-400 truncate font-mono">{formData.imageFile?.name}</p>
                  </div>
                ) : (
                  <div className="py-6 md:py-8 space-y-2 flex flex-col items-center">
                    <FiImage className="text-2xl md:text-3xl text-gray-700" />
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Select Campaign Photo</p>
                  </div>
                )}
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-3.5 md:py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all disabled:opacity-40 cursor-pointer"
            >
              {loading ? 'PUBLISHING ASSET...' : 'PUBLISH TO LOOKBOOK'}
            </button>
          </form>
        </div>

        {/* PANEL RIGHT: LIVE TABLE DATA VIEW */}
        <div className="lg:col-span-8 bg-[#121212] border border-white/10 rounded-2xl md:rounded-[2rem] p-4 md:p-7 shadow-xl overflow-hidden">
          <div className="mb-5">
            <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-300">Live Visual Campaign Matrix</h2>
            <p className="text-[11px] md:text-xs text-gray-500 mt-1">Data table synchronizing what active customers view on lookbook stream</p>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-3 pl-2">Campaign Title</th>
                  <th className="pb-3 font-mono">Position</th>
                  <th className="pb-3">Asset Preview</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {lookbooks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center font-mono text-zinc-600 tracking-wider">
                      NO ACTIVE CAMPAIGNS FOUND IN DATABASE
                    </td>
                  </tr>
                ) : (
                  lookbooks.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 md:p-4 font-bold text-white uppercase">{item.title}</td>
                      <td className="p-3 md:p-4 font-mono text-zinc-400">{item.sort_order}</td>
                      <td className="p-3 md:p-4">
                        <img src={item.image_url} alt={item.title} className="w-10 md:w-12 aspect-[4/5] object-cover rounded-lg border border-white/10" />
                      </td>
                      <td className="p-3 md:p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => openEditModal(item)} 
                            className="p-2 bg-white/5 border border-white/5 hover:border-white/20 text-white rounded-lg transition-all inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <FiEdit2 size={11} /> Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteLookbook(item._id, item.title)} 
                            className="p-2 bg-red-900/20 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 rounded-lg transition-all inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            <FiTrash2 size={11} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* OVERLAY POP-UP MODAL: EDIT HUB PIPELINE */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl md:rounded-[2rem] w-full max-w-sm md:max-w-md p-6 md:p-8 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={() => setEditModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>

              <div>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider">Update Campaign</h3>
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-0.5">ID: {editData.id}</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1.5">Change Title</label>
                  <input 
                    type="text"
                    value={editData.title}
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    required
                    className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1.5">Change Sort Order</label>
                  <input 
                    type="number"
                    value={editData.sort_order}
                    onChange={e => setEditData({...editData, sort_order: parseInt(e.target.value) || 0})}
                    required
                    className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Replace Image (Optional)</label>
                  <div className="flex items-center gap-3 bg-black border border-white/5 p-3 rounded-xl">
                    <img src={editData.imageFile ? URL.createObjectURL(editData.imageFile) : editData.currentImageUrl} alt="Current" className="w-10 aspect-[4/5] rounded-lg object-cover" />
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="text-[10px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 bg-white/5 border border-white/5 text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer"
                  >
                    BATAL
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    {loading ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC STUDIO PRECISION CROPPER OVERLAY */}
      {activeCropSrc && (
        <LookbookCropperModal
          src={activeCropSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
          onErrorTrigger={(msg) => triggerPopup('error', msg)}
        />
      )}

      {/* RENDER POPUP NOTIFIKASI PREMIUM */}
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

export default AdminLookbook;