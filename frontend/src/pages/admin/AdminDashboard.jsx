import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

import { useAuth } from '../../context/AuthContext';
import Finance from './Finance';
import Inventory from './Inventory';
import InventoryMaster from "./InventoryMaster"; // 1. Import komponen Inventory

import AdminDashboardHome from './AdminDashboardHome';
import AdminProducts from './AdminProducts';
import AdminCMS from './AdminCMS';
import AdminStats from './AdminStats';
import AdminLookbook from './AdminLookbook';
import AdminProfile from './AdminProfile';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-black text-white w-full relative overflow-x-hidden">

      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* AREA KONTEN UTAMA */}
      <main
        className="flex-1 min-w-0 md:ml-64 pt-24 p-4 sm:p-6 md:p-8 lg:p-12 text-white font-['Inter'] antialiased h-auto"
      >
        <Routes>
          <Route index element={<AdminDashboardHome />} />

          {/* Akses Umum */}
          <Route path="products"  element={<AdminProducts />} />
          <Route path="cms"       element={<AdminCMS />} />
          <Route path="lookbook"  element={<AdminLookbook />} />
          <Route path="profile"   element={<AdminProfile />} />
          <Route path="stats"     element={<AdminStats />} />

          {/* Hanya Owner yang bisa akses Finance & Inventory */}
          <Route
            path="finance"
            element={
              user?.role === 'owner'
                ? <Finance />
                : <Navigate to="/admin" replace />
            }
          />
          
          <Route
            path="inventory"
            element={
              user?.role === 'owner'
                ? <Inventory />
                : <Navigate to="/admin" replace />
            }
          />

          <Route
  path="inventory/master"
  element={
    user?.role === 'owner'
      ? <InventoryMaster />
      : <Navigate to="/admin" replace />
  }
/>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-[65vh] text-center px-4">
                <h3 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight">
                  Akses Ditolak
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed">
                  Halaman tidak tersedia atau jenis akun kamu tidak memiliki izin akses.
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