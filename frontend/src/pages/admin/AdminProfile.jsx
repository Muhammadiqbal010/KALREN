import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Cropper from 'react-easy-crop';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCamera, FiLock, FiSave, FiUser, FiMail, FiEdit3, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { getCroppedImg } from '../../utils/cropImage';

// =========================================================
// 🔔 MINI COMPONENT: CUSTOM NOTIFICATION POPUP
// =========================================================
const NotificationPopup = ({ isOpen, type, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[1.8rem] max-w-sm w-full space-y-5 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center justify-center space-y-2">
          {type === 'success' ? (
            <FiCheckCircle className="text-emerald-400 text-3xl animate-pulse" />
          ) : (
            <FiAlertTriangle className="text-red-400 text-3xl animate-bounce" />
          )}
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {type === 'success' ? 'BERHASIL' : 'PROSES GAGAL'}
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
          Siap, Dimengerti
        </button>
      </div>
    </div>
  );
};

// =========================================================
// ⚡ MAIN CORE HUB COMPONENT
// =========================================================
const AdminProfile = () => {
  const { user, loading: authLoading, fetchCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Custom State Notification Hub
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '' }));
      setPreviewUrl(user.avatar || '');
    }
  }, [user]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsCropping(true);
  };

  const handleApplyCrop = async () => {
    if (!avatarFile || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(URL.createObjectURL(avatarFile), croppedAreaPixels);
      setCroppedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setIsCropping(false);
    } catch (e) {
      setPopup({ isOpen: true, type: 'error', message: 'Gagal memotong area gambar.' });
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setAvatarFile(null);
    setCroppedBlob(null);
    setPreviewUrl(user?.avatar || '');
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // =====================================================
  // EXECUTE ACTIONS (PENGALIHAN ALERT KE NOTIFICATION POPUP)
  // =====================================================
  const executeSaveProfile = async () => {
    setLoading(true);
    closeConfirm();
    try {
      const form = new FormData();
      form.append('name', formData.name);
      if (croppedBlob) {
        form.append('avatar', croppedBlob, 'avatar.jpg');
      }

      const response = await api.put('/api/user/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.user?.avatar) {
        setPreviewUrl(response.data.user.avatar);
        const stored = localStorage.getItem('kalren_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.avatar = response.data.user.avatar;
          parsed.name = response.data.user.name;
          localStorage.setItem('kalren_user', JSON.stringify(parsed));
        }
      }

      await fetchCurrentUser();
      setAvatarFile(null);
      setCroppedBlob(null);
      setPopup({ isOpen: true, type: 'success', message: 'Profil dan foto avatar baru berhasil diperbarui.' });
    } catch (err) {
      setPopup({ isOpen: true, type: 'error', message: err?.response?.data?.detail || 'Gagal menyimpan perubahan identitas profil.' });
    } finally {
      setLoading(false);
    }
  };

  const executeChangePassword = async () => {
    setPasswordLoading(true);
    closeConfirm();
    try {
      await api.put('/api/user/password', {
        old_password: formData.currentPassword,
        new_password: formData.newPassword
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setPopup({ isOpen: true, type: 'success', message: 'Password akses akun berhasil diubah.' });
    } catch (err) {
      setPopup({ isOpen: true, type: 'error', message: err?.response?.data?.detail || 'Gagal memperbarui password akun.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const triggerSaveProfile = (e) => {
    e.preventDefault();
    showConfirm('Simpan Profil?', 'Apakah data nama dan foto profil baru sudah sesuai?', executeSaveProfile);
  };

  const triggerChangePassword = (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword) {
      return setPopup({ isOpen: true, type: 'error', message: 'Semua kolom input password wajib diisi.' });
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return setPopup({ isOpen: true, type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
    }
    showConfirm('Ubah Password?', 'Sesi masuk akan diperbarui dengan kunci sandi yang baru.', executeChangePassword);
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-zinc-500 font-mono text-xs tracking-widest px-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-white animate-ping" />
          <span>SYNCHRONIZING KALREN CORE AUTHORITIES...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500 font-mono text-xs tracking-widest px-4 text-center">
        <span>❌ ACCESS DENIED: UNVERIFIED CREDENTIALS</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 font-['Inter'] antialiased text-white max-w-5xl mx-auto p-2 relative overflow-x-hidden">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">KALREN STAFF</h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mt-1">
          Manage credentials and visual core authority profiles
        </p>
      </div>

      {/* BILLBOARD */}
      <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 md:gap-8 shadow-2xl text-center sm:text-left">
        <div className="absolute top-0 right-0 p-10 pointer-events-none select-none opacity-[0.01] hidden md:block">
          <h2 className="text-[12vw] font-black tracking-tighter">ADMIN</h2>
        </div>

        {/* Avatar */}
        <div className="relative group w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-900 flex-shrink-0 shadow-xl transition-all duration-500">
          <img src={previewUrl || '/default-avatar.png'} alt="Avatar" className="w-full h-full object-cover" />
          <label htmlFor="avatar-upload-top" className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 sm:group-hover:opacity-100 flex flex-col items-center justify-center gap-1 cursor-pointer transition-opacity duration-300">
            <FiCamera className="text-xl" />
            <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
          </label>
          <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" id="avatar-upload-top" />
        </div>

        {/* Info */}
        <div className="space-y-1.5 md:space-y-2 min-w-0 w-full">
          {user?.role && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {user.role}
            </div>
          )}
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight truncate">{user?.name}</h2>
          {user?.email && (
            <p className="text-gray-500 text-xs font-mono flex items-center justify-center sm:justify-start gap-2 truncate">
              <FiMail className="text-gray-600 shrink-0" /> {user.email}
            </p>
          )}
        </div>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

        {/* FORM IDENTITAS */}
        <form onSubmit={triggerSaveProfile} className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem] space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center gap-2">
            <FiEdit3 className="text-gray-500" />
            <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-300">Change Account Identity</h3>
          </div>

          <div>
            <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-4 text-gray-600" />
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Update account name" required className="w-full bg-black border border-white/5 pl-12 pr-4 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" id="avatar-upload-body" />
            <label htmlFor="avatar-upload-body" className="w-full flex items-center justify-center gap-3 p-3.5 md:p-4 bg-black border border-dashed border-white/10 hover:border-white/20 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all">
              <FiCamera size={14} /> Upload Portrait Asset
            </label>

            {/* Cropper Handler Section */}
            {isCropping && avatarFile && (
              <div className="mt-4 space-y-3 p-3 md:p-4 bg-black border border-white/5 rounded-xl">
                <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-500">Sesuaikan area potret:</p>
                <div className="relative h-48 md:h-64 w-full bg-zinc-950 rounded-xl overflow-hidden border border-white/5">
                  <Cropper image={URL.createObjectURL(avatarFile)} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={handleCancelCrop} className="px-3 py-1.5 bg-white/5 text-white rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer">
                    Batal
                  </button>
                  <button type="button" onClick={handleApplyCrop} className="px-3 py-1.5 bg-white text-black rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider hover:bg-zinc-200 transition-all cursor-pointer">
                    Potong Gambar
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black py-3.5 md:py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-neutral-200 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <FiSave size={13} /> {loading ? 'SAVING...' : 'SAVE PROFILE IDENTITY'}
          </button>
        </form>

        {/* FORM PASSWORD */}
        <form onSubmit={triggerChangePassword} className="lg:col-span-5 bg-[#0a0a0a] border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2rem] space-y-5">
          <div className="border-b border-white/5 pb-4 flex items-center gap-2">
            <FiLock className="text-gray-500" />
            <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-300">Secure Access Control</h3>
          </div>

          {[
            { name: 'currentPassword', label: 'Current Password' },
            { name: 'newPassword',     label: 'New Password' },
            { name: 'confirmPassword', label: 'Confirm New Password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-2">{field.label}</label>
              <input type="password" name={field.name} placeholder="••••••••••••" value={formData[field.name]} onChange={handleInputChange} className="w-full bg-black border border-white/5 p-3.5 md:p-4 rounded-xl text-white text-xs md:text-sm outline-none focus:border-white/20 transition-all font-mono" />
            </div>
          ))}

          <button type="submit" disabled={passwordLoading} className="w-full bg-red-600/10 border border-red-500/20 text-red-400 py-3.5 md:py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 cursor-pointer">
            {passwordLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>

      {/* CONFIRMATION DRAWER/MODAL INTERFACE */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeConfirm} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', duration: 0.4 }} className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 text-center shadow-2xl z-10 space-y-5" >
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full mx-auto flex items-center justify-center">
                <FiAlertCircle size={22} className="text-neutral-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black uppercase tracking-wider text-white">{confirmModal.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed px-2">{confirmModal.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button type="button" onClick={closeConfirm} className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-white/5 cursor-pointer">
                  Batal
                </button>
                <button type="button" onClick={confirmModal.onConfirm} className="py-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer">
                  Konfirmasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL POPUP CONFIGURATION NOTIFICATION */}
      <NotificationPopup isOpen={popup.isOpen} type={popup.type} message={popup.message} onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))} />

    </div>
  );
};

export default AdminProfile;