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

  const [products, setProducts] = useState([]);
  const [cms, setCms] = useState({
    hero_title: '', hero_title_gradient: '', hero_subtitle: '', hero_cta_text: '',
    running_text: '', manifesto_title: '', manifesto_title_italic: '',
    manifesto_description: '', cta_title: '', cta_title_gradient: '', cta_button_text: ''
  });

  const xRight = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    // Sinkronisasi CMS
    api.get('/api/cms').then(res => res.data && setCms(res.data)).catch(console.error);

    // Sinkronisasi Katalog Produk (Trending Engine)
    api.get('/api/admin/list').then(res => {
      const active = (res.data || []).filter(item => item.is_active !== false);
      const trending = active.sort((a, b) => (b.views || 0) - (a.views || 0));
      setProducts(trending);
    }).catch(console.error);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url(${churchTexture})`, backgroundSize: '250px' }}
      />
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen bg-navy flex flex-col items-center justify-center pt-32 pb-12">
        <div className={`relative z-10 text-center px-6 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tighter uppercase text-white mb-8">
            {cms?.hero_title || "STYLE IT YOUR WAY,"}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              {cms?.hero_title_gradient || "COMFORT TANPA KOMPROMI."}
            </span>
          </h1>
          <p className="text-xs md:text-sm font-light tracking-widest uppercase text-slate-400 mb-8 italic">
            {cms?.hero_subtitle || "BUILT FOR YOUR HANGOUT."}
          </p>
          <Link to="/collection" className="group relative inline-flex items-center px-10 py-4 bg-transparent border-2 border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-navy">{cms?.hero_cta_text || "Jelajahi Koleksi"}</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 ml-4 group-hover:text-navy transition-all">→</span>
          </Link>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <section className="w-full bg-white py-12 md:py-20 border-b border-navy/10 overflow-hidden">
        <Marquee speed={100} gradient={false}>
          <span className="text-4xl md:text-6xl font-black uppercase text-navy/5 tracking-tighter mx-10">
            {cms?.running_text || "WELCOME TO KALREN — BUILDING THE CIRCLE —"}
          </span>
        </Marquee>
      </section>

      {/* 3. MANIFESTO */}
      <section className="py-24 md:py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase leading-none tracking-tighter mb-12">
              {cms?.manifesto_title || "Building the"} <br />
              <span className="italic font-light text-slate-400">{cms?.manifesto_title_italic || "Perfect Circle."}</span>
            </h2>
            <p className="text-lg md:text-3xl text-gray-700 font-light max-w-3xl leading-tight">
              {cms?.manifesto_description || "Kami membangun dengan ritme yang kami percaya. Bukan sekadar pakaian, KALREN adalah manifestasi dari kendali penuh atas gaya hidup lo."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. SIGNATURE SERIES */}
      <section className="py-16 md:py-28 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-navy text-center mb-16">Signature Series</h2>

          {products.length === 0 ? (
            <p className="text-center text-gray-400 text-xs font-mono uppercase tracking-widest animate-pulse">Syncing pipeline...</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:gap-10">
              {products.slice(0, 3).map((product) => (
                <Link to={`/product/${product.slug}`} key={product.slug} className="group block w-full">
                  <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-3xl bg-zinc-100">
                    <img 
                      src={product.image_urls?.[0] || "/placeholder.jpg"} 
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 md:p-5 flex flex-col justify-end">
                      <span className="uppercase text-[6px] md:text-[9px] font-bold opacity-60 font-mono text-white">{product.series || "ARTICLE"}</span>
                      <h3 className="text-[9px] md:text-lg font-black uppercase tracking-tight leading-tight text-white line-clamp-2 h-6 md:h-12 flex items-center">{product.name}</h3>
                      <p className="text-[8px] md:text-xs font-mono text-white opacity-90 font-bold">IDR {Number(product.price || 0).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/collection" className="inline-flex items-center gap-3 px-10 py-4 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-full font-bold tracking-widest uppercase transition-all">
              Jelajahi Signature Series →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
<section className="relative py-40 overflow-hidden text-white mt-20 border-t border-white/5">
  {/* Layer Background Gradient agar tidak hitam polos */}
  <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0a0f1d] to-black z-0" />
  
  {/* Elemen dekoratif biar gak kosong */}
  <motion.div style={{ x: xRight }} className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none z-0">
    <h2 className="text-[10rem] md:text-[20vw] font-black uppercase tracking-tighter">KLRN</h2>
  </motion.div>

  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-5xl md:text-[6.5rem] font-black uppercase tracking-tighter mb-12 leading-[0.9]">
      {cms?.cta_title || "SIAP UNTUK"} <br />
      <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
        {cms?.cta_title_gradient || "LEVEL UP?"}
      </span>
    </h2>
    
    <Link to="/collection" className="px-16 py-6 bg-white text-navy font-black tracking-[0.4em] uppercase rounded-full hover:scale-105 transition-transform inline-block">
      {cms?.cta_button_text || "Explore Shop"}
    </Link>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default Home;