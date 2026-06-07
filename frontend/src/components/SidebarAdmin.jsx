import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiAlertCircle, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import LogoKalren from '../assets/logo/logokalren.png';

const SidebarAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State manajemen kontrol menu mobile dan modal logout
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const executeLogout = () => {
    logout();
    setLogoutModalOpen(false);
    setMobileMenuOpen(false);
    navigate('/khususorangdalam');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Inventory / Product', path: '/admin/products', icon: '👕' },
    { name: 'CMS Settings', path: '/admin/cms', icon: '🏠' },
    { name: 'Lookbook Panel', path: '/admin/lookbook', icon: '📸' },
    { name: 'Analytics Data', path: '/admin/stats', icon: '📈' },
    { name: 'Profile', path: '/admin/profile', icon: '👤' },
  ];

  return (
    <>
      {/* =========================================================
          TOMBOL FLOATING BURGER MENU DI MOBILE (HANYA MUNCUL DI HP)
      ========================================================= */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-5 left-4 z-[60] p-3 rounded-xl bg-[#0a0a0a] text-white shadow-2xl md:hidden flex items-center justify-center border border-white/10 cursor-pointer"
      >
        {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* =========================================================
          SIDEBAR DRAWER COMPONENT
      ========================================================= */}
      <aside 
        className={`w-64 bg-[#0a0a0a] text-white flex flex-col fixed left-0 top-0 h-screen z-50 shadow-[4px_0_30px_rgba(0,0,0,0.5)] border-r border-white/5 transition-transform duration-300 md:translate-x-0 shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* BRAND LOGO INTEGRASI DENGAN ASET LOKAL */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5 mb-6 shrink-0">
          <img 
            src={LogoKalren} 
            alt="Logo Kalren" 
            className="w-7 h-7 object-contain rounded-md select-none shrink-0" 
          />
          <div className="min-w-0">
            <h1 className="text-sm font-black tracking-widest text-white uppercase font-mono truncate">
              KALREN ADMIN
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Control Hub Panel</p>
          </div>
        </div>

        {/* ACTIVE USER PROFILE DIRECTORY */}
        <div className="px-6 mb-6 shrink-0">
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <img 
              src={user?.avatar || '/default-avatar.png'} 
              alt=""
              className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-white text-xs truncate">{user?.name || 'Admin'}</p>
              <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5 tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                {user?.role?.toUpperCase() || 'STAFF'}
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="flex-grow px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? 'bg-white text-black font-bold shadow-md' : 'hover:bg-white/[0.03] text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-wider font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* SECURITY LOGOUT EMISSION ACCESS */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button 
            type="button"
            onClick={() => setLogoutModalOpen(true)} 
            className="w-full py-3 bg-white/[0.02] border border-white/5 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiLogOut /> Logout System
          </button>
        </div>
      </aside>

      {/* OVERLAY BACKGROUND MOBILE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI LOGOUT */}
      <AnimatePresence>
        {logoutModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-[2rem] p-6 text-center shadow-2xl z-10 space-y-5 text-white"
            >
              <div className="w-11 h-11 bg-white/5 border border-white/10 text-white rounded-full mx-auto flex items-center justify-center">
                <FiAlertCircle size={20} className="text-neutral-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Konfirmasi Keluar</h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed px-2">
                  Apakah kamu yakin ingin keluar dari panel admin? Sesi aktif akan diakhiri dan kamu harus login kembali untuk masuk.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button 
                  type="button"
                  onClick={() => setLogoutModalOpen(false)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={executeLogout}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-xl cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarAdmin;