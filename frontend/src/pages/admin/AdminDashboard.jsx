import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

// Import Seluruh Sub-Halaman Admin
import AdminDashboardHome from './AdminDashboardHome';
import AdminProducts from './AdminProducts';
import AdminCMS from './AdminCMS';
import AdminStats from './AdminStats';
import AdminLookbook from './AdminLookbook';
import AdminProfile from './AdminProfile';

const AdminDashboard = () => {
  const userRole = localStorage.getItem('kalren_role') || 'admin';

  return (
    /* h-screen dilepas agar tinggi halaman bebas mengikuti panjang konten */
    <div className="flex min-h-screen bg-black text-white w-full relative overflow-x-hidden">
      
      {/* 1. SIDEBAR HUB UTAMA (Fixed posisi melayang di kiri, lebar terkunci 64 / 256px) */}
      <SidebarAdmin />

      {/* 2. AREA KONTEN UTAMA
          - flex-1 min-w-0: Otomatis menghitung sisa ruang monitor secara dinamis (tidak akan jebol ke kanan).
          - md:ml-64: SOLUSI UTAMA! Memaksa bodi halaman memulai titik awalnya tepat di sebelah kanan setelah batas sidebar selesai.
          - pt-24: Menjaga jarak aman atas agar tidak terselip di bawah Topbar Header transparan. */}
      <main
        className="
          flex-1
          min-w-0
          md:ml-64
          pt-24
          p-4
          sm:p-6
          md:p-8
          lg:p-12
          text-white
          font-['Inter']
          antialiased
          h-auto
        "
      >
        <Routes>
          {/* Default Redirect */}
          <Route index element={<AdminDashboardHome />} />

          {/* Rute Navigasi Internal Panel */}
          <Route path="products" element={<AdminProducts />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="lookbook" element={<AdminLookbook />} />
          <Route path="profile" element={<AdminProfile />} />

          {/* Validasi Hak Akses Metriks Analytics */}
          {userRole === 'owner' && (
            <Route path="stats" element={<AdminStats />} />
          )}

          {/* Fallback Rute Izin Ditolak */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-[65vh] text-center px-4">
                <h3 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight">
                  Akses Ditolak
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed">
                  Halaman tidak tersedia atau jenis akun kamu tidak memiliki izin akses untuk melihat data ini.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;