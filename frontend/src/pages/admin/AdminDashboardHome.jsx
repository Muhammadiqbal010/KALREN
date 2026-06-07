import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  FiPackage, 
  FiActivity, 
  FiEye, 
  FiExternalLink, 
  FiShoppingBag, 
  FiLayers 
} from 'react-icons/fi';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [analyticsTimeline, setAnalyticsTimeline] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const reqProducts = api.get('/api/admin/list').catch(() => ({ data: [] }));
        const reqAnalytics = api.get('/api/admin/analytics').catch(() => ({ data: [] }));
        const reqLogs = api.get('/api/admin/logs').catch(() => ({ data: [] }));

        const [productsRes, analyticsRes, logsRes] = await Promise.all([
          reqProducts, reqAnalytics, reqLogs
        ]);

        setProducts(productsRes.data || []);
        setAnalyticsTimeline(analyticsRes.data || []);
        setActivities(logsRes.data || []);
      } catch (err) {
        console.error("Gagal sinkronisasi dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const todayMetrics = useMemo(() => {
    const latestDayData = analyticsTimeline[analyticsTimeline.length - 1] || {};

    return {
      totalProducts: products.length,
      shopee: latestDayData.shopee_clicks || 0,
      tiktok: latestDayData.tiktok_shop_clicks || 0,
      instagram: latestDayData.instagram_clicks || 0,
      profile: latestDayData.tiktok_profile_clicks || 0
    };
  }, [products, analyticsTimeline]);

  const chartData = useMemo(() => {
    const dataset = {
      labels: ['-', '-', '-', '-', '-', '-', '-'],
      shopee: [0, 0, 0, 0, 0, 0, 0],
      tkShop: [0, 0, 0, 0, 0, 0, 0],
      instagram: [0, 0, 0, 0, 0, 0, 0],
      tkProfile: [0, 0, 0, 0, 0, 0, 0],
    };

    if (Array.isArray(analyticsTimeline) && analyticsTimeline.length > 0) {
      analyticsTimeline.forEach((day, idx) => {
        if (idx < 7) {
          dataset.labels[idx] = day.label || '-';
          dataset.shopee[idx] = day.shopee_clicks || 0;
          dataset.tkShop[idx] = day.tiktok_shop_clicks || 0;
          dataset.instagram[idx] = day.instagram_clicks || 0;
          dataset.tkProfile[idx] = day.tiktok_profile_clicks || 0;
        }
      });
    }
    return dataset;
  }, [analyticsTimeline]);

  const topProducts = useMemo(() => {
    return [...products]
      .filter((p) => (p?.views || 0) > 0)
      .sort((a, b) => (b?.views || 0) - (a?.views || 0))
      .slice(0, 5);
  }, [products]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000] text-gray-500 font-mono tracking-widest text-xs">
        <span className="animate-pulse">SLIDING TIMELINE INTEGRATION ENGINE...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 md:space-y-8 text-white font-['Inter'] antialiased overflow-x-hidden">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          Dashboard Overview
        </h1>
        <p className="text-zinc-500 mt-1 text-xs md:text-sm font-medium">
          Selamat datang kembali, <span className="text-white font-extrabold capitalize">{user?.username || ''}</span>
        </p>
      </div>

      {/* CARD ROW 1 */}
      <div className="space-y-2">
        <p className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 pl-1">Social Interaction Volume</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <MetricCard title="Total Produk Aktif" value={todayMetrics.totalProducts} icon={<FiPackage />} />
          <MetricCard title="Klik Shopee (Hari Ini)" value={todayMetrics.shopee.toLocaleString('id-ID')} icon={<FiExternalLink />} color="text-orange-400" />
          <MetricCard title="Klik TikTok (Hari Ini)" value={todayMetrics.tiktok.toLocaleString('id-ID')} icon={<FiShoppingBag />} color="text-pink-400" />
        </div>
      </div>

      {/* SOSMED STATS DETAILS */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <MetricCard title="Klik Instagram" value={todayMetrics.instagram.toLocaleString('id-ID')} icon={<FiEye />} color="text-purple-400" />
          <MetricCard title="Klik TikTok Profile" value={todayMetrics.profile.toLocaleString('id-ID')} icon={<FiLayers />} color="text-cyan-400" />
        </div>
      </div>

      {/* DYNAMIC SCROLLING MULTI-LINE GRAPH CHART */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl md:rounded-[2.2rem] p-4 md:p-7 shadow-xl flex flex-col justify-between min-h-[380px] md:min-h-[440px] w-full overflow-hidden">
        <div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Realtime Sliding Analytics</p>
          <h3 className="text-sm md:text-base font-black mt-1 uppercase tracking-wide">Outbound Link Performance (7-Day Rolling Window)</h3>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[9px] md:text-[10px] font-mono uppercase font-bold text-gray-400">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded bg-[#ff6b21]" /> Shopee</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded bg-[#ff3b30]" /> TikTok Shop</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded bg-[#af52de]" /> Instagram</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded bg-[#5ac8fa]" /> TikTok Profile</div>
          </div>
        </div>
        
        <div className="relative pt-6 flex-grow flex items-end w-full">
          <MultiLineChart datasets={chartData} />
        </div>
      </div>

      {/* LOWER TABLES ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6 pt-1">
        <div className="xl:col-span-7 bg-[#121212] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-7 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <FiActivity className="text-emerald-400" size={18} />
            <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-300">Riwayat Aktivitas</h2>
          </div>
          <div className="space-y-3 max-h-[320px] md:max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {activities.length > 0 ? (
              activities.map((act, i) => <ActivityItem key={act._id || act.id || i} {...act} />)
            ) : (
              <p className="text-center py-12 text-xs text-gray-600 font-mono">BELUM ADA LOG AKTIVITAS</p>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 bg-[#121212] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-7 shadow-xl">
          <div>
            <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-300">Top Products</h2>
            <p className="text-[11px] md:text-xs text-gray-500 mt-1 font-medium">Produk paling banyak diminati pengunjung</p>
          </div>
          <div className="space-y-2.5 mt-5">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <TopProductItem key={product._id} rank={index + 1} product={product} />
              ))
            ) : (
              <p className="text-center py-12 text-xs text-gray-500 uppercase tracking-widest font-mono">BELUM ADA DATA VIEW</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// =========================================================
// SUB-COMPONENTS ENGINE
// =========================================================
const MetricCard = ({ title, value, icon, color = 'text-white' }) => (
  <div className="bg-[#121212] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-300 shadow-sm group">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-gray-500 text-[10px] md:text-[11px] font-black uppercase tracking-widest">{title}</p>
        <h3 className={`text-2xl md:text-3xl font-black font-mono tracking-tight pt-2 transition-transform group-hover:scale-[1.02] ${color}`}>
          {value}
        </h3>
      </div>
      <div className="text-lg opacity-40 group-hover:opacity-80 transition-opacity">{icon}</div>
    </div>
  </div>
);

const ActivityItem = ({ username, role, action, target, detail, time, date }) => {
  const roleBadgeColor = role === 'owner' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  let actionColor = 'text-amber-400';
  if (action?.includes('ADD')) actionColor = 'text-emerald-400';
  if (action?.includes('DELETE')) actionColor = 'text-red-400';

  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-200">
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-white font-black text-xs capitalize tracking-wide">{username || 'System'}</span>
          <span className={`text-[8px] font-mono font-bold px-1 py-0.2 border rounded uppercase tracking-wider ${roleBadgeColor}`}>
            {role || 'admin'}
          </span>
          <span className="text-gray-600 text-xs">•</span>
          <span className={`text-[9px] md:text-[10px] font-mono font-black ${actionColor}`}>{action}</span>
        </div>
        <p className="text-[11px] md:text-xs font-bold text-gray-200 uppercase truncate tracking-wide">Target: <span className="text-gray-400 font-medium">{target || 'N/A'}</span></p>
        <p className="text-[10px] md:text-[11px] text-zinc-500 font-medium truncate">{detail}</p>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
        <p className="text-[8px] md:text-[9px] text-white font-mono font-black bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">{time || 'Live'}</p>
        {date && <p className="text-[8px] text-zinc-600 font-mono font-medium tracking-tight">{date}</p>}
      </div>
    </div>
  );
};

const TopProductItem = ({ rank, product }) => (
  <div className="flex items-center justify-between bg-zinc-900/30 border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
    <div className="flex items-center gap-3 min-w-0">
      <div className="text-sm font-black text-gray-600 w-4 font-mono text-center shrink-0">{rank}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-200 truncate uppercase tracking-wide">{product.name || 'Untitled Piece'}</p>
        <p className="text-[9px] text-zinc-500 font-medium mt-0.5 capitalize">{product.series || 'KALREN CORE'}</p>
      </div>
    </div>
    <div className="text-right shrink-0 pl-1">
      <p className="text-emerald-400 font-mono font-black text-xs">{(product.views || 0).toLocaleString('id-ID')}</p>
      <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold font-mono">clicks</p>
    </div>
  </div>
);

// =========================================================
// 📈 ENGINE CHART MULTI-LINE: FIX TEGAK LURUS & TOUCH SWIPE
// =========================================================
const MultiLineChart = ({ datasets }) => {
  const [activeDayIdx, setActiveDayIdx] = useState(null);
  const svgRef = useRef(null);

  const allValues = [
    ...datasets.shopee, ...datasets.tkShop, ...datasets.instagram, ...datasets.tkProfile
  ];
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min;

  const generatePoints = (dataArray) => {
    return dataArray.map((value, index) => {
      const x = (index * 100) / (dataArray.length - 1 || 1);
      const y = 80 - ((value - min) / range) * 65; // Menaikkan basis kurva agar tidak memotong label bawah
      return `${x},${y}`;
    }).join(' ');
  };

  const lines = [
    { key: 'shopee', color: '#ff6b21', label: 'Shopee' },
    { key: 'tkShop', color: '#ff3b30', label: 'TikTok Shop' },
    { key: 'instagram', color: '#af52de', label: 'Instagram' },
    { key: 'tkProfile', color: '#5ac8fa', label: 'TikTok Profile' },
  ];

  // Fungsi kalkulasi koordinat sentuhan jari di layar HP
  const handleTouchMove = (e) => {
    if (!svgRef.current || e.touches.length === 0) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    
    let percentage = touchX / rect.width;
    if (percentage < 0) percentage = 0;
    if (percentage > 1) percentage = 1;
    
    const index = Math.round(percentage * 6);
    if (index >= 0 && index <= 6) {
      setActiveDayIdx(index);
    }
  };

  return (
    /* pb-8 dan touch-none ditambahkan untuk menahan tanggal bawah dan mengaktifkan swipe gesture kustom */
    <div className="h-[220px] md:h-[260px] w-full relative group/chart pb-8 select-none touch-none">
      {activeDayIdx !== null && (
        <div className="absolute top-0 right-0 bg-[#161616]/95 border border-white/10 p-2.5 rounded-xl shadow-2xl z-20 font-mono text-[9px] space-y-1 min-w-[125px] pointer-events-none">
          <p className="text-zinc-500 font-bold border-b border-white/5 pb-0.5 uppercase truncate">{datasets.labels[activeDayIdx]} Metrics</p>
          {lines.map((l) => (
            <div key={l.key} className="flex justify-between items-center gap-2">
              <span className="flex items-center gap-1 text-zinc-400 truncate">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                {l.label}:
              </span>
              <span className="font-bold text-white text-right shrink-0">{datasets[l.key][activeDayIdx]} klik</span>
            </div>
          ))}
        </div>
      )}

      <div className="absolute left-0 top-0 text-[9px] font-mono text-zinc-700 space-y-12 pointer-events-none hidden sm:block">
        <div>{max} Max</div>
        <div>0 Min</div>
      </div>
      
      <svg 
        ref={svgRef}
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible pl-0 sm:pl-16" 
        preserveAspectRatio="none"
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setActiveDayIdx(null)}
      >
        <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        <line x1="0" y1="47.5" x2="100" y2="47.5" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

        {/* FIX TEGAK LURUS: Mengunci nilai y1 dan y2 sejajar pada sumbu vertikal */}
        {activeDayIdx !== null && (
          <line
            x1={(activeDayIdx * 100) / 6}
            y1="5"
            x2={(activeDayIdx * 100) / 6}
            y2="80"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.6"
            strokeDasharray="2"
          />
        )}

        {lines.map((line) => (
          <polyline
            key={line.key}
            fill="none"
            stroke={line.color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={generatePoints(datasets[line.key])}
            className="transition-all duration-200"
          />
        ))}

        {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
          const width = 100 / 6;
          const x = (dayIdx * 100) / 6 - width / 2;
          return (
            <rect
              key={dayIdx}
              x={dayIdx === 0 ? 0 : x}
              y="0"
              width={dayIdx === 0 || dayIdx === 6 ? width / 2 : width}
              height="85"
              fill="transparent"
              className="cursor-pointer hidden md:block"
              onMouseEnter={() => setActiveDayIdx(dayIdx)}
              onMouseLeave={() => setActiveDayIdx(null)}
              onClick={() => setActiveDayIdx(dayIdx)}
            />
          );
        })}
      </svg>
      
      {/* TIMELINE LABELS: Presisi dan diberi tanda khusus warna putih terang jika sedang aktif disentuh */}
      <div className="flex justify-between w-full text-[8px] font-mono text-zinc-600 pt-4 pl-0 sm:pl-16 uppercase tracking-wider select-none">
        {datasets.labels.map((lbl, i) => (
          <span 
            key={i} 
            className={`truncate text-center w-8 block ${
              activeDayIdx === i ? 'text-white font-black transition-colors' : ''
            }`}
          >
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardHome;