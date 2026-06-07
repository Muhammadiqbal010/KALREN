import React, { useState, useEffect } from 'react';
import { FiSave, FiMonitor, FiInfo, FiPhoneCall, FiPlus, FiTrash2, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// =========================================================
// 🔔 MINI COMPONENT: PREMIUM MINIMALIST POPUP MODAL (BAHASA SANTAI)
// =========================================================
const NotificationPopup = ({ isOpen, type, message, onClose }) => {
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
            {type === 'success' ? 'PROSES BERHASIL' : 'SISTEM EROR'}
          </h3>
          <p className="text-gray-400 text-xs tracking-wide leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-white text-black rounded-xl font-black text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all cursor-pointer"
        >
          Siap, Mengerti
        </button>
      </div>
    </div>
  );
};

// =========================================================
// ⚡ MAIN CORE HUB COMPONENT
// =========================================================
const AdminCMS = () => {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [loading, setLoading] = useState(false);

  const [cmsData, setCmsData] = useState({
    hero_title: '',
    hero_title_gradient: '',
    hero_subtitle: '',
    hero_cta_text: '',
    running_text: '',
    manifesto_title: '',
    manifesto_title_italic: '',
    manifesto_description: '',
    missions: [''],
    cta_title: '',
    cta_title_gradient: '',
    cta_button_text: '',
    shopee_url: '',
    tiktok_url: ''
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    message: ''
  });

  const triggerPopup = (type, message) => {
    setPopup({ isOpen: true, type, message });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // TARIK DATA DARI PIPELINE MASTER SAKRAL /api/cms
  useEffect(() => {
    const fetchCMSMasterData = async () => {
      try {
        const res = await api.get('/api/cms');
        if (res.data) {
          setCmsData({
            hero_title: res.data.hero_title || '',
            hero_title_gradient: res.data.hero_title_gradient || '',
            hero_subtitle: res.data.hero_subtitle || '',
            hero_cta_text: res.data.hero_cta_text || '',
            running_text: res.data.running_text || '',
            manifesto_title: res.data.manifesto_title || '',
            manifesto_title_italic: res.data.manifesto_title_italic || '',
            manifesto_description: res.data.manifesto_description || '',
            missions: res.data.missions && res.data.missions.length > 0 ? res.data.missions : [''],
            cta_title: res.data.cta_title || '',
            cta_title_gradient: res.data.cta_title_gradient || '',
            cta_button_text: res.data.cta_button_text || '',
            shopee_url: res.data.shopee_url || '',
            tiktok_url: res.data.tiktok_url || ''
          });
        }
      } catch (err) {
        // 🎯 BYPASS ALERT: Alihkan kegagalan load database ke Popup Premium
        triggerPopup('error', 'Gagal terkoneksi ke database Mongo Atlas, Bal. Coba cek jaringan backend lo.');
      }
    };

    fetchCMSMasterData();
  }, []);

  const handleInputChange = (field, value) => {
    setCmsData(prev => ({ ...prev, [field]: value }));
  };

  // HANDLER SIMPAN UNTUK INTEGRASI SINGLE-ENDPOINT SAKRAL BAL
  const handleSaveCMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/admin/cms', cmsData);

      await api.post('/api/admin/create-log', {
        username: user?.username || 'Unknown Admin',
        role: user?.role || 'admin',
        action: 'UPDATE CMS',
        target: `${activeTab.toUpperCase()} PAGE CONFIG`,
        detail: `Berhasil mengubah struktur teks tipografi interface komponen halaman ${activeTab}`
      }).catch(err => console.error("Log bypass:", err));

      // 🎯 MODIFIKASI BAHASA: Ubah jadi santai gampang dicerna
      triggerPopup('success', `Mantap, Bal! Pengaturan teks di halaman ${activeTab.toUpperCase()} web KALREN lo udah berhasil diperbarui.`);
    } catch (err) {
      // 🎯 MODIFIKASI BAHASA: Ubah alert eror jadi santai
      triggerPopup('error', 'Aksi dibatalkan. Gagal mengirimkan data matriks konten terbaru ke database server, Bal.');
    } finally {
      setLoading(false);
    }
  };

  const handleMissionChange = (index, value) => {
    const updatedMissions = [...cmsData.missions];
    updatedMissions[index] = value;
    setCmsData(prev => ({ ...prev, missions: updatedMissions }));
  };

  const addMissionField = () => {
    setCmsData(prev => ({ ...prev, missions: [...prev.missions, ''] }));
  };

  const removeMissionField = (index) => {
    const updatedMissions = cmsData.missions.filter((_, i) => i !== index);
    setCmsData(prev => ({ 
      ...prev, 
      missions: updatedMissions.length ? updatedMissions : [''] 
    }));
  };

  return (
    /* 🎯 RESPONSIVE CARD CONTAINER: p-4 di HP, md:p-6 di desktop monitor */
    <div className="space-y-6 md:space-y-10 bg-black text-white p-2 min-h-screen font-['Inter'] antialiased overflow-x-hidden">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">CMS Core Editor</h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mt-1">Live interface typography & content management panel</p>
      </div>

      {/* TABS NAVIGATION (Responsive scrollbar ke samping pas di HP) */}
      <div className="flex border-b border-white/5 gap-2 text-[10px] md:text-xs font-black tracking-widest uppercase pb-1 overflow-x-auto no-scrollbar -mx-2 px-2 whitespace-nowrap">
        {['home', 'about', 'contact'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-t-xl transition-all duration-300 cursor-pointer ${
              activeTab === tab 
                ? 'bg-[#0a0a0a] text-white border-t border-x border-white/10 relative z-10' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab} Page
          </button>
        ))}
      </div>

      {/* CORE INTEGRATED CMS FORM */}
      <form onSubmit={handleSaveCMS} className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] max-w-4xl space-y-6 md:space-y-8">
        
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-base md:text-lg font-black uppercase tracking-wider flex items-center gap-2 text-blue-500">
              <FiMonitor /> Landing Page Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Hero Title Plain</label>
                <input type="text" value={cmsData.hero_title} onChange={e => handleInputChange('hero_title', e.target.value)} placeholder="Contoh: STYLE IT YOUR WAY," className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Hero Title Gradient</label>
                <input type="text" value={cmsData.hero_title_gradient} onChange={e => handleInputChange('hero_title_gradient', e.target.value)} placeholder="Contoh: COMFORT TANPA KOMPROMI." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Hero Subtitle</label>
                <input type="text" value={cmsData.hero_subtitle} onChange={e => handleInputChange('hero_subtitle', e.target.value)} placeholder="Contoh: BUILT FOR YOUR HANGOUT." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Hero Button CTA Text</label>
                <input type="text" value={cmsData.hero_cta_text} onChange={e => handleInputChange('hero_cta_text', e.target.value)} placeholder="Contoh: Jelajahi Koleksi" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Infinite Marquee Ticker Text (Running Text)</label>
              <input type="text" value={cmsData.running_text} onChange={e => handleInputChange('running_text', e.target.value)} placeholder="Contoh: WELCOME TO KALREN — BUILDING THE CIRCLE —" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-white/5">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Manifesto Title Plain</label>
                <input type="text" value={cmsData.manifesto_title} onChange={e => handleInputChange('manifesto_title', e.target.value)} placeholder="Contoh: Building the" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Manifesto Title Italic</label>
                <input type="text" value={cmsData.manifesto_title_italic} onChange={e => handleInputChange('manifesto_title_italic', e.target.value)} placeholder="Contoh: Perfect Circle." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Manifesto Core Description Text</label>
              <textarea rows="3" value={cmsData.manifesto_description} onChange={e => handleInputChange('manifesto_description', e.target.value)} placeholder="Tulis esensi brand manifesto..." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Final CTA Title</label>
                <input type="text" value={cmsData.cta_title} onChange={e => handleInputChange('cta_title', e.target.value)} placeholder="Contoh: SIAP UNTUK" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Final CTA Title Gradient</label>
                <input type="text" value={cmsData.cta_title_gradient} onChange={e => handleInputChange('cta_title_gradient', e.target.value)} placeholder="Contoh: LEVEL UP?" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Final CTA Button Text</label>
                <input type="text" value={cmsData.cta_button_text} onChange={e => handleInputChange('cta_button_text', e.target.value)} placeholder="Contoh: Explore Shop" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-base md:text-lg font-black uppercase tracking-wider flex items-center gap-2 text-yellow-500">
              <FiInfo /> Brand Manifesto & Culture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">About Hero Title Plain</label>
                <input type="text" value={cmsData.manifesto_title} onChange={e => handleInputChange('manifesto_title', e.target.value)} placeholder="Contoh: BUILDING THE PERFECT" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">About Hero Title Italic</label>
                <input type="text" value={cmsData.manifesto_title_italic} onChange={e => handleInputChange('manifesto_title_italic', e.target.value)} placeholder="Contoh: CIRCLE SYSTEM" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">About Core Philosophy Quotes</label>
              <textarea rows="3" value={cmsData.manifesto_description} onChange={e => handleInputChange('manifesto_description', e.target.value)} placeholder="Write the brand core philosophy..." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 resize-none" />
            </div>
            
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Daftar Poin Pernyataan Misi Brand</label>
              {cmsData.missions.map((mission, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-gray-600">0{index + 1}</span>
                  <input type="text" value={mission} onChange={e => handleMissionChange(index, e.target.value)} required placeholder={`Tulis poin misi lo disini 0${index + 1}`} className="flex-1 bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
                  <button type="button" onClick={() => removeMissionField(index)} className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs cursor-pointer" >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addMissionField} className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer" >
                <FiPlus /> Tambah Baris Misi
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-base md:text-lg font-black uppercase tracking-wider flex items-center gap-2 text-pink-500">
              <FiPhoneCall /> Store Redirect Links & Gateway
            </h2>

            <div>
              <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Connect Gateway Subtitle Message</label>
              <textarea rows="3" value={cmsData.hero_subtitle} onChange={e => handleInputChange('hero_subtitle', e.target.value)} placeholder="Tulis sub-pesan ajakan toko..." className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Official Shopee Store Link</label>
                <input type="url" value={cmsData.shopee_url} onChange={e => handleInputChange('shopee_url', e.target.value)} placeholder="https://shopee.co.id/kalren.official" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">Official TikTok Shop Link</label>
                <input type="url" value={cmsData.tiktok_url} onChange={e => handleInputChange('tiktok_url', e.target.value)} placeholder="https://tiktok.com/@kalren.official" className="w-full bg-black border border-white/5 p-3 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20" />
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON BLOCK */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-white text-black rounded-xl font-black text-[11px] md:text-xs tracking-widest uppercase hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            <FiSave /> {loading ? 'SEDANG MENYIMPAN...' : `SIMPAN PERUBAHAN ${activeTab.toUpperCase()}`}
          </button>
        </div>

      </form>

      {/* MODAL POPUP NOTIFIKASI PREMIUM */}
      <NotificationPopup 
        isOpen={popup.isOpen}
        type={popup.type}
        message={popup.message}
        onClose={closePopup}
      />
    </div>
  );
};

export default AdminCMS;