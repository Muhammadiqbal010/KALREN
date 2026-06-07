import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from "react-fast-marquee";
import api from '../api/axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

export const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // State CMS & State Produk Database
  const [products, setProducts] = useState([]);
  const [cms, setCms] = useState({
    hero_title: '',
    hero_title_gradient: '',
    hero_subtitle: '',
    hero_cta_text: '',
    running_text: '',
    manifesto_title: '',
    manifesto_title_italic: '',
    manifesto_description: '',
    core_section_title: '',
    edge_section_title: '',
    cta_title: '',
    cta_title_gradient: '',
    cta_button_text: ''
  });

  const xRight = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    // Tarik data CMS
    api.get('/api/cms')
      .then(res => {
        if(res.data) setCms(res.data);
      })
      .catch(err => console.error("Gagal sinkronisasi pipeline CMS:", err));

    // 🎯 FIX MUTLAK JALUR API: Samakan endpoint-nya dengan halaman Collection (/api/admin/list)
    // 🎯 TARIK DATA KATALOG UNTUK SIGNATURE SECTION (OPSI B: TRENDING ENGINE)
    api.get('/api/admin/list')
      .then(res => {
        let fetchedProducts = res.data || [];
        // Filter murni barang yang statusnya aktif di database Atlas
        fetchedProducts = fetchedProducts.filter(item => item.is_active !== false);
        
        // 📈 TRENDING HUB AUTOMATION:
        // Urutkan dari produk dengan 'views' terbanyak ke terkecil.
        // Jika nilai 'views' sama-sama 0 di awal rilis, otomatis fallback ikut urutan upload asli database!
        const trendingProducts = fetchedProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
        
        setProducts(trendingProducts);
      })
      .catch(err => console.error("Gagal memuat katalog signature produk:", err));
    
    return () => clearTimeout(timer);
  }, []);

  const coreItems = [
    { name: 'Hitam', image: "https://via.placeholder.com/800x400/000000/FFFFFF?text=KALREN+BLACK", hex: '#000000' },
    { name: 'Maroon', image: "https://via.placeholder.com/800x400/800000/FFFFFF?text=KALREN+MAROON", hex: '#800000' },
    { name: 'Navy', image: "https://via.placeholder.com/800x400/0d0d45/FFFFFF?text=KALREN+NAVY", hex: '#0d0d45' },
    { name: 'Putih', image: "https://via.placeholder.com/800x400/FFFFFF/000000?text=KALREN+WHITE", hex: '#FFFFFF' },
  ];

  const edgeItems = [
    { name: 'Einstein E = MC²', image: "https://via.placeholder.com/800x400/111111/FFFFFF?text=EINSTEIN+SERIES" },
    { name: 'Street Crown', image: "https://via.placeholder.com/800x400/111111/FFFFFF?text=STREET+CROWN" },
    { name: 'Island Guardian', image: "https://via.placeholder.com/800x400/111111/FFFFFF?text=ISLAND+GUARDIAN" },
    { name: 'Fortune Daruma', image: "https://via.placeholder.com/800x400/111111/FFFFFF?text=FORTUNE+DARUMA" },
  ];

  const [activeCore, setActiveCore] = useState(coreItems[0]);
  const [activeEdge, setActiveEdge] = useState(edgeItems[0]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url(${churchTexture})`, backgroundSize: '250px' }}
      />
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center pt-32 pb-12">
        <div className={`relative z-10 text-center px-6 mt-8 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter uppercase text-white mb-6 md:mb-8">
            {/* 🎯 PENANDA CMS HERO TITLE */}
            {cms?.hero_title || "STYLE IT YOUR WAY,"}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              {/* 🎯 PENANDA CMS HERO GRADIENT */}
              {cms?.hero_title_gradient || "COMFORT TANPA KOMPROMI."}
            </span>
          </h1>
          <div className="max-w-md mx-auto mb-6 md:mb-8">
            <p className="text-xs md:text-sm font-light tracking-widest uppercase text-slate-400 leading-relaxed italic">
              {/* 🎯 PENANDA CMS HERO SUBTITLE */}
              {cms?.hero_subtitle || "BUILT FOR YOUR HANGOUT."}
            </p>
          </div>
          <Link to="/collection" className="group relative inline-flex items-center px-10 py-4 bg-transparent border-2 border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-navy">
              {/* 🎯 PENANDA CMS HERO CTA TEXT */}
              {cms?.hero_cta_text || "Jelajahi Koleksi"}
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 ml-4 group-hover:text-navy group-hover:translate-x-2 transition-all">→</span>
          </Link>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <section className="w-full bg-white py-12 md:py-20 border-y border-navy/10 relative z-10 overflow-hidden">
        <Marquee speed={100} gradient={false}>
          <span className="text-[3.5rem] md:text-[5rem] font-black uppercase text-navy/5 tracking-tighter mx-10">
            {/* 🎯 PENANDA CMS RUNNING TEXT */}
            {cms?.running_text || "WELCOME TO KALREN — BUILDING THE CIRCLE —"}
          </span>
          <span className="text-[3.5rem] md:text-[5rem] font-black uppercase text-navy tracking-tighter mx-10">
            {/* 🎯 PENANDA CMS RUNNING TEXT */}
            {cms?.running_text || "WELCOME TO KALREN — BUILDING THE CIRCLE —"}
          </span>
        </Marquee>
      </section>

      {/* 3. MANIFESTO */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <h2 className="text-4xl md:text-6xl font-black text-navy uppercase leading-none tracking-tighter mb-12">
                {/* 🎯 PENANDA CMS MANIFESTO TITLE */}
                {cms?.manifesto_title || "Building the"} <br />
                <span className="italic font-light text-slate-400">
                  {/* 🎯 PENANDA CMS MANIFESTO TITLE ITALIC */}
                  {cms?.manifesto_title_italic || "Perfect Circle."}
                </span>
              </h2>
              <p className="text-xl md:text-3xl text-gray-700 font-light leading-tight">
                {/* 🎯 PENANDA CMS MANIFESTO DESCRIPTION */}
                {cms?.manifesto_description || "Kami membangun dengan ritme yang kami percaya. Bukan sekadar pakaian, KALREN adalah manifestasi dari kendali penuh atas gaya hidup lo."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE SERIES */}
      <section className="py-16 md:py-28 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy">
              Signature Series
            </h2>
            <p className="mt-4 text-sm md:text-lg text-gray-600 max-w-lg mx-auto">
              Koleksi terbaik kami. Dirancang dengan detail dan kenyamanan maksimal dari katalog arsip KALREN.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest animate-pulse">
                Syncing items directly from pipeline...
              </p>
            </div>
          ) : (
            /* 🎯 CORE FIX GRID 3 KOLOM MOBILE:
               - Di HP (paling kecil sekalipun): Dipaksa 'grid grid-cols-3' berjajar langsung 3 item ke samping.
               - Gap (jarak antar baju) disempitkan jadi 'gap-2' di HP agar muat, dan melebar otomatis jadi 'md:gap-10' di PC.
               - Menghapus 'overflow-x-auto' bawaan slider kemarin biar gak melar ke kanan Bal! */
            <div className="grid grid-cols-3 gap-2 md:gap-10 w-full">
              {products.slice(0, 3).map((product) => {
                const productID = product.id || product._id;
                const coverImage = product.image_urls?.[0] || "https://res.cloudinary.com/ddxplesul/image/upload/v1778695884/placeholder.jpg";
                const seriesLabel = product.series || "KALREN ARTICLE";
                const productName = product.name || "Untitled Piece";

                return (
                  <Link 
                    to={`/product/${productID}`} 
                    key={productID} 
                    className="group block w-full"
                  >
                    {/* Mengurangi radius border di mobile (rounded-xl) biar frame-nya proporsional pas menciut */}
                    <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-3xl shadow-md bg-zinc-100">
                      <img 
                        src={coverImage} 
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      
                      {/* GRADIENT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* CONTENT TEXT CONTAINER 
                         Padding mengecil di mobile (p-2) dan membesar di laptop (md:p-5) */}
                      <div className="absolute bottom-2 left-2 right-2 md:bottom-5 md:left-5 md:right-5 text-white">
                        
                        {/* 1. SERIES BADGE (Micro font size di HP) */}
                        <span className="uppercase text-[6px] md:text-[9px] font-bold tracking-wider opacity-60 font-mono block mb-0.5">
                          {seriesLabel}
                        </span>
                        
                        {/* 2. PRODUCT NAME 
                           Font diturunkan jadi 'text-[9px]' di HP biar nama panjang gak tumpah merusak frame.
                           Ditahan 'line-clamp-2' dan tinggi dinamis agar grid tetep sejajar rapi, Bal! */}
                        <h3 className="text-[9px] md:text-lg font-black uppercase tracking-tight leading-tight line-clamp-2 h-6 md:h-12 flex items-center justify-start mb-0.5">
                          {productName}
                        </h3>
                        
                        {/* 3. PRICE TAG */}
                        <p className="text-[8px] md:text-xs font-mono tracking-tighter md:tracking-tight opacity-90 font-bold">
                          IDR {Number(product.price || 0).toLocaleString('id-ID')}
                        </p>

                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12 md:mt-16">
            <Link 
              to="/collection" 
              className="inline-flex items-center gap-3 px-12 py-5 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-full font-bold tracking-widest uppercase transition-all"
            >
              Jelajahi Signature Series →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="relative py-60 bg-navy overflow-hidden text-white mt-20 border-t border-white/5 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate-900 to-black z-0" />
        <motion.div style={{ x: xRight }} className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
          <h2 className="text-[4rem] md:text-[20vw] font-black text-white leading-none text-center uppercase tracking-tighter">
            KLRN
          </h2>
        </motion.div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-[6.5rem] font-black text-white leading-[0.95] md:leading-[0.85] uppercase tracking-tighter mb-12">
            {/* 🎯 PENANDA CMS CTA TITLE */}
            {cms?.cta_title || "SIAP UNTUK"} <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white pr-4 md:pr-10">
              {/* 🎯 PENANDA CMS CTA TITLE GRADIENT */}
              {cms?.cta_title_gradient || "LEVEL UP?"}
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/collection" className="w-full sm:w-auto px-16 py-7 bg-white text-navy text-sm font-black tracking-[0.4em] uppercase rounded-full hover:scale-105 transition-all">
              {/* 🎯 PENANDA CMS CTA BUTTON TEXT */}
              {cms?.cta_button_text || "Explore Shop"}
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-navy border-t border-white/5 relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;