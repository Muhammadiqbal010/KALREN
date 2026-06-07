import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axios';
import { FiShoppingBag, FiActivity, FiLayers, FiDownload, FiFolder, FiCalendar, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';

// =========================================================
// 🔔 MINI COMPONENT: PREMIUM MINIMALIST POPUP MODAL
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
          Siap, Dimengerti
        </button>
      </div>
    </div>
  );
};

// =========================================================
// ⚡ MAIN COMPONENT HUB
// =========================================================
const AdminStats = () => {
  const { user } = useAuth();
  const [analyticsTimeline, setAnalyticsTimeline] = useState([]); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const reqAnalytics = api.get('/api/admin/analytics').catch(() => ({ data: [] }));
        const reqProducts = api.get('/api/admin/list').catch(() => ({ data: [] }));

        const [analyticsRes, productsRes] = await Promise.all([
          reqAnalytics, 
          reqProducts
        ]);

        setAnalyticsTimeline(analyticsRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const timelineArray = useMemo(() => {
    return Array.isArray(analyticsTimeline) ? analyticsTimeline : [];
  }, [analyticsTimeline]);

  const summaryMetrics = useMemo(() => {
    let totalShopee = 0, totalTiktok = 0, totalInsta = 0, totalProfile = 0;

    timelineArray.forEach(day => {
      totalShopee += day.shopee_clicks || 0;
      totalTiktok += day.tiktok_shop_clicks || 0;
      totalInsta += day.instagram_clicks || 0;
      totalProfile += day.tiktok_profile_clicks || 0;
    });

    return {
      totalProducts: products.length,
      shopee: totalShopee,
      tiktok: totalTiktok,
      instagram: totalInsta,
      profile: totalProfile,
      grandTotal: totalShopee + totalTiktok + totalInsta + totalProfile
    };
  }, [timelineArray, products]);

  const exportMultiSheetExcel = (fileNameCustom) => {
    try {
      const today = new Date();
      const currentMonthName = today.toLocaleString('id-ID', { month: 'long' }).toUpperCase();
      const currentYearNum = today.getFullYear();

      const workbook = XLSX.utils.book_new();

      if (fileNameCustom === 'catalog_closing') {
        const productRows = timelineArray.map(day => ({
          "TANGGAL LOG": (day.label || "N/A").toUpperCase(),
          "KLIK SHOPEE": day.shopee_clicks || 0,
          "KLIK TIKTOK SHOP": day.tiktok_shop_clicks || 0,
          "TOTAL CONVERSION CLICKS": (day.shopee_clicks || 0) + (day.tiktok_shop_clicks || 0)
        }));

        productRows.push({
          "TANGGAL LOG": "TOTAL REKAP AKUMULASI",
          "KLIK SHOPEE": summaryMetrics.shopee,
          "KLIK TIKTOK SHOP": summaryMetrics.tiktok,
          "TOTAL CONVERSION CLICKS": summaryMetrics.shopee + summaryMetrics.tiktok
        });

        const productWorksheet = XLSX.utils.json_to_sheet(productRows);
        XXLSX.utils.book_append_sheet(workbook, productWorksheet, "PERFORMA E-COMMERCE");
      } 
      else if (fileNameCustom === 'master_outbound') {
        const socialRows = timelineArray.map(day => ({
          "TANGGAL LOG": (day.label || "N/A").toUpperCase(),
          "KLIK INSTAGRAM": day.instagram_clicks || 0,
          "KLIK TIKTOK PROFILE": day.tiktok_profile_clicks || 0,
          "TOTAL BRANDING CLICKS": (day.instagram_clicks || 0) + (day.tiktok_profile_clicks || 0)
        }));

        socialRows.push({
          "TANGGAL LOG": "TOTAL REKAP AKUMULASI",
          "KLIK INSTAGRAM": summaryMetrics.instagram,
          "KLIK TIKTOK PROFILE": summaryMetrics.profile,
          "TOTAL BRANDING CLICKS": summaryMetrics.instagram + summaryMetrics.profile
        });

        const socialWorksheet = XLSX.utils.json_to_sheet(socialRows);
        XXLSX.utils.book_append_sheet(workbook, socialWorksheet, "PERFORMA BRANDING SOSMED");
      }

      XXLSX.writeFile(workbook, `KALREN_REPORT_${fileNameCustom.toUpperCase()}_${currentMonthName}_${currentYearNum}.xlsx`);
      
      setPopup({
        isOpen: true,
        type: 'success',
        message: 'Berkas laporan Excel berhasil dibuat dan diunduh.'
      });
    } catch (err) {
      setPopup({
        isOpen: true,
        type: 'error',
        message: 'Gagal mengekspor data laporan ke dalam format spreadsheet.'
      });
    }
  };

  const currentMonthLabel = new Date().toLocaleString('id-ID', { month: 'long' });
  const currentYearLabel = new Date().getFullYear().toString();

  const mockExportHistory = [
    { id: 'h-1', fileName: 'Laporan_Analitik_Bulanan', month: currentMonthLabel, year: currentYearLabel, actionKey: 'master_outbound' },
    { id: 'h-2', fileName: 'Laporan_Konversi_Link_Toko', month: currentMonthLabel, year: currentYearLabel, actionKey: 'catalog_closing' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-500 font-mono text-xs uppercase tracking-widest">
        ⚡ MENYINKRONKAN DATA STATISTIK MASTER KALREN...
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-12 bg-black text-white p-4 md:p-6 min-h-screen font-['Inter'] antialiased overflow-x-hidden">
      
      {/* TITLE TOP BAR HUB */}
      <div className="border-b border-white/5 pb-4 md:pb-6">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
          Analytics Data Kalren
        </h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mt-1">Real-time engagement analysis & checkout redirect history</p>
      </div>

      {/* 3 GRID MINI KELOLA RINGKASAN AKUMULASI 7 HARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl md:rounded-[1.8rem] flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Total Akumulasi Trafik</p>
            <h3 className="text-xl md:text-3xl font-black font-mono text-blue-400 mt-1">{summaryMetrics.grandTotal} CLKS</h3>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl text-blue-500"><FiActivity size={18} /></div>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl md:rounded-[1.8rem] flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Shopee Outbound Volume</p>
            <h3 className="text-xl md:text-3xl font-black font-mono text-orange-400 mt-1">{summaryMetrics.shopee} CLKS</h3>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl text-orange-500"><FiShoppingBag size={18} /></div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl md:rounded-[1.8rem] flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">TikTok Shop Traffic</p>
            <h3 className="text-xl md:text-3xl font-black font-mono text-pink-400 mt-1">{summaryMetrics.tiktok} CLKS</h3>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl text-pink-500"><FiActivity size={18} /></div>
        </div>
      </div>

      {/*🛒 TABEL 1: COMMERCE PRODUCT STREAM LOGS */}
      <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] space-y-4 md:space-y-6">
        <h2 className="text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-orange-400">
          <FiShoppingBag /> E-Commerce Conversion Streams (Per Hari)
        </h2>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                <th className="pb-3 md:pb-4">Tanggal Log</th>
                <th className="pb-3 md:pb-4 text-center">Shopee Clicks</th>
                <th className="pb-3 md:pb-4 text-center">TikTok Shop</th>
                <th className="pb-3 md:pb-4 text-center">Total Clicks</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm text-gray-300 divide-y divide-white/5 font-medium">
              {timelineArray.map((day, index) => {
                const shopee = day.shopee_clicks || 0;
                const tiktok = day.tiktok_shop_clicks || 0;
                const total = shopee + tiktok;
                return (
                  <tr key={`stream-${day.label || index}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 md:py-4 font-black text-white uppercase text-xs tracking-wide flex items-center gap-2">
                      <FiCalendar className="text-gray-600" /> {day.label || "Timeline Day"}
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      <span className="px-2 py-0.5 md:py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-[9px] md:text-[10px] font-black font-mono">{shopee} CLKS</span>
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      <span className="px-2 py-0.5 md:py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-md text-[9px] md:text-[10px] font-black font-mono">{tiktok} CLKS</span>
                    </td>
                    <td className="py-3 md:py-4 text-center font-bold font-mono text-xs text-white">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 TABEL 2: SOCIAL ENGAGEMENT LOGS */}
      <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] space-y-4 md:space-y-6">
        <h2 className="text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-purple-400">
          <FiLayers /> Social Media Engagement (Awareness Per Hari)
        </h2>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                <th className="pb-3 md:pb-4">Tanggal Log</th>
                <th className="pb-3 md:pb-4 text-center">Instagram</th>
                <th className="pb-3 md:pb-4 text-center">TikTok Profile</th>
                <th className="pb-3 md:pb-4 text-center">Total Clicks</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm text-gray-300 divide-y divide-white/5 font-medium">
              {timelineArray.map((day, index) => {
                const instagram = day.instagram_clicks || 0;
                const profile = day.tiktok_profile_clicks || 0;
                const total = instagram + profile;
                return (
                  <tr key={`social-${day.label || index}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 md:py-4 font-black text-white uppercase text-xs tracking-wide flex items-center gap-2">
                      <FiCalendar className="text-gray-600" /> {day.label || "Timeline Day"}
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      <span className="px-2 py-0.5 md:py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md text-[9px] md:text-[10px] font-black font-mono">{instagram} CLKS</span>
                    </td>
                    <td className="py-3 md:py-4 text-center">
                      <span className="px-2 py-0.5 md:py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md text-[9px] md:text-[10px] font-black font-mono">{profile} CLKS</span>
                    </td>
                    <td className="py-3 md:py-4 text-center font-bold font-mono text-xs text-white">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📂 TABEL 3: REKAP EXPORT MANAGER */}
      <div className="bg-[#0a0a0a] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[1.8rem] space-y-4 md:space-y-6">
        <h2 className="text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 text-emerald-400">
          <FiFolder /> Master Data Spreadsheet Reporting Hub
        </h2>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                <th className="pb-3 md:pb-4">Nama File</th>
                <th className="pb-3 md:pb-4 text-center">Bulan</th>
                <th className="pb-3 md:pb-4 text-center">Tahun</th>
                <th className="pb-3 md:pb-4 text-right">Export</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-white/5 font-mono">
              {mockExportHistory.map((report) => (
                <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 font-black text-white font-sans uppercase text-xs tracking-wider">
                    📊 {report.fileName}
                  </td>
                  <td className="py-4 text-center text-zinc-400 uppercase font-bold text-xs">{report.month}</td>
                  <td className="py-4 text-center text-zinc-400 font-bold text-xs">{report.year}</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => exportMultiSheetExcel(report.actionKey)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer font-sans shadow-md"
                    >
                      <FiDownload size={11} /> Download Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotificationPopup 
        isOpen={popup.isOpen}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AdminStats;