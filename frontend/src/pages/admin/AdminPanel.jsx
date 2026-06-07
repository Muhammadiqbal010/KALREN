import React, { useState } from 'react';
import api from '../../api/axios';
import { FiUploadCloud, FiSave, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

// =========================================================
// 🔔 MINI COMPONENT: PRESET COMPACT NOTIFICATION POPUP
// =========================================================
const LightNotificationPopup = ({ isOpen, type, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999999] p-4 font-['Inter']">
      <div className="bg-[#1e1e1e] border border-zinc-800 p-6 rounded-2xl max-w-sm w-full space-y-5 text-center shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-2">
          {type === 'success' ? (
            <FiCheckCircle className="text-emerald-400 text-3xl animate-pulse" />
          ) : (
            <FiAlertTriangle className="text-red-400 text-3xl animate-bounce" />
          )}
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {type === 'success' ? 'BERHASIL' : 'SISTEM ERROR'}
          </h3>
          <p className="text-zinc-400 text-xs tracking-wide leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-white text-black rounded-lg font-black text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};

// =========================================================
// ⚡ MAIN HUB COMPONENT
// =========================================================
const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    series: 'Core',
    shopee_link: '',
    tiktok_link: ''
  });

  // State Notifikasi Pengganti Alert Browser
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('series', formData.series);
    data.append('shopee_link', formData.shopee_link);
    data.append('tiktok_link', formData.tiktok_link);
    data.append('image', image);

    try {
      const res = await api.post('/api/admin/add-product', data);
      if (res.data.status === "success" || res.status === 200) {
        setPopup({
          isOpen: true,
          type: 'success',
          message: 'Produk baru berhasil diarsipkan ke database.'
        });
        setFormData({ name: '', series: 'Core', shopee_link: '', tiktok_link: '' });
        setImage(null);
        setImagePreview('');
      }
    } catch (err) {
      setPopup({
        isOpen: true,
        type: 'error',
        message: err.response?.data?.detail || 'Gagal menambahkan produk baru.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#1a1a1a] text-white min-h-screen font-['Inter'] antialiased flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#222] p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-800 space-y-6">
        
        <h2 className="text-xl font-black uppercase tracking-tight border-b border-zinc-700 pb-3">
          KALREN ADMIN ARCHIVE
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Nama Produk</label>
            <input 
              type="text"
              placeholder="Masukkan nama produk..." 
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-[#333] text-white border border-transparent rounded-lg outline-none text-sm focus:border-zinc-600 transition-all"
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Koleksi / Seri Line</label>
            <select 
              value={formData.series} 
              onChange={(e) => setFormData({...formData, series: e.target.value})}
              className="w-full p-3 bg-[#333] text-white border border-transparent rounded-lg outline-none text-sm focus:border-zinc-600 transition-all cursor-pointer"
            >
              <option value="Core">Core Collection</option>
              <option value="Edge">Edge Series</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Shopee Link (Opsional)</label>
            <input 
              type="url"
              placeholder="https://shopee.co.id/..." 
              value={formData.shopee_link}
              onChange={(e) => setFormData({...formData, shopee_link: e.target.value})}
              className="w-full p-3 bg-[#333] text-white border border-transparent rounded-lg outline-none text-sm focus:border-zinc-600 transition-all font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">TikTok Shop Link (Opsional)</label>
            <input 
              type="url"
              placeholder="https://tiktok.com/..." 
              value={formData.tiktok_link}
              onChange={(e) => setFormData({...formData, tiktok_link: e.target.value})}
              className="w-full p-3 bg-[#333] text-white border border-transparent rounded-lg outline-none text-sm focus:border-zinc-600 transition-all font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Foto Produk</label>
            <label className="w-full flex flex-col items-center justify-center gap-2 p-5 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg cursor-pointer transition-all bg-[#2a2a2a]/40 group">
              <FiUploadCloud className="text-xl text-zinc-500 group-hover:text-white transition-colors" />
              <span className="text-xs text-zinc-400 group-hover:text-white transition-colors font-bold uppercase tracking-wider">Pilih Berkas Gambar</span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" required={!imagePreview} />
            </label>
            
            {imagePreview && (
              <div className="mt-3 relative w-20 aspect-[4/5] rounded-lg overflow-hidden border border-zinc-700">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview Asset" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-white text-black rounded-lg font-black text-xs tracking-widest uppercase hover:bg-zinc-200 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-md"
          >
            <FiSave /> {loading ? "SEDANG MENGUNGGAH..." : "UNGGAH KE DATABASE"}
          </button>
        </form>

      </div>

      <LightNotificationPopup 
        isOpen={popup.isOpen} 
        type={popup.type} 
        message={popup.message} 
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
};

export default AdminPanel;