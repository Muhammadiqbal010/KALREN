import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from "react-fast-marquee";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

// ===== ASSETS IMPORT =====
import hitam from '@/assets/card/Black.png';
import navy from '@/assets/card/Navy.png';
import marun from '@/assets/card/Maroon.png';
import putih from '@/assets/card/Putih.png';
import albert from '@/assets/card/Albert.png';
import street from '@/assets/card/Street.png';
import bali from '@/assets/card/Bali.png';
import daruma from '@/assets/card/Daruma.png';

export const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const xRight = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // DATA OBJECTS (Hanya Core & Edge)
  const coreItems = [
    { name: 'Hitam', image: hitam, hex: '#000000' },
    { name: 'Maroon', image: marun, hex: '#800000' },
    { name: 'Navy', image: navy, hex: '#0d0d45' },
    { name: 'Putih', image: putih, hex: '#FFFFFF' },
  ];

  const edgeItems = [
    { name: 'Einstein E = MC²', image: albert },
    { name: 'Street Crown', image: street },
    { name: 'Island Guardian', image: bali },
    { name: 'Fortune Daruma', image: daruma },
  ];

  const [activeCore, setActiveCore] = useState(coreItems[0]);
  const [activeEdge, setActiveEdge] = useState(edgeItems[0]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">

      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url(${churchTexture})`,
          backgroundSize: '250px',
          backgroundRepeat: 'repeat',
        }}
      />

      <Navigation />

<section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center pt-32 pb-12">
  {/* Background & Decor tetap sama */}
  
  <div className={`relative z-10 text-center px-6 mt-8 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
    
    <h1 className="text-4xl md:text-6xl lg:text-[7.5rem] font-black leading-[0.9] tracking-tighter uppercase text-white mb-6 md:mb-8">
      STYLE IT YOUR WAY,<br />
      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
        COMFORT TANPA KOMPROMI.
      </span>
    </h1>

    {/* Jarak MB dikurangi dari 10 jadi 6 atau 8 agar lebih rapat ke tombol */}
    <div className="max-w-md mx-auto mb-6 md:mb-8">
      <p className="text-[10px] md:text-xs font-light tracking-[0.2em] uppercase text-slate-400 leading-relaxed italic">
        BUILT FOR YOUR HANGOUT.
      </p>
    </div>

    <Link
      to="/collection"
      className="group relative inline-flex items-center px-10 py-4 bg-transparent border-2 border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
    >
      <span className="relative z-10 transition-colors duration-500 group-hover:text-navy">Jelajahi Koleksi</span>
      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <span className="relative z-10 ml-4 group-hover:text-navy group-hover:translate-x-2 transition-all">→</span>
    </Link>
  </div>
</section>

{/* 2. INFINITE MARQUEE - Fixed Version */}
      <section className="w-full bg-white py-8 md:py-14 border-y border-navy/10 overflow-hidden relative z-10">
        <Marquee 
          speed={window.innerWidth < 768 ? 40 : 60} 
          gradient={false}
        >
          <div className="flex items-center whitespace-nowrap">
            {["KALREN", "PRECISE CONTROL", "QUALITY OVER EVERYTHING", "BUILT FOR YOUR HANGOUT", "BORN IN INDONESIA"].map((text, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-16 px-4 md:px-8">
                {/* Text: Responsive size via Tailwind classes */}
                <span className="text-navy font-black text-lg md:text-5xl uppercase tracking-[0.1em] md:tracking-[0.15em]">
                  {text}
                </span>
                {/* Bullet: Responsive size via Tailwind classes */}
                <span className="text-blue-500/30 font-black text-xl md:text-4xl">●</span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* 3. MANIFESTO SECTION - CLEAN VERSION */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-8xl font-black text-navy uppercase leading-none tracking-tighter mb-12">
                Building the <br /> 
                <span className="italic font-light text-slate-400">Perfect Circle.</span>
              </h2>
              <p className="text-2xl md:text-4xl text-gray-700 font-light leading-tight">
                Kami membangun dengan ritme yang kami percaya. Bukan sekadar pakaian, KALREN adalah manifestasi dari kendali penuh atas gaya hidup lo. Fokus pada kualitas, bukan sekadar tren sesaat.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

{/* 4. FEATURED COLLECTION - Ultra Compact Mobile Version */}
<section className="py-16 md:py-40 bg-gray-50 border-y border-gray-200 relative z-10">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-24 gap-4">
      <div>
        <h2 className="text-3xl md:text-8xl font-black uppercase tracking-tight text-navy">Built Different</h2>
        <div className="h-1 md:h-2 w-16 md:w-40 bg-navy mt-2 md:mt-4" />
      </div>
    </div>

    <div className="space-y-16 md:space-y-24">
      {/* CORE CARD CONTAINER */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-[5/2] rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-lg bg-slate-200">
          <motion.div 
            key={activeCore.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${activeCore.image})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/40 to-transparent" />
          
          {/* Overlay Text - Diperkecil lagi (Super Slim) */}
          <div className="absolute bottom-3 left-4 md:bottom-8 md:left-10 text-white">
            <span className="text-[6px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-60 block">Core Collection</span>
            <h3 className="text-lg md:text-4xl font-black uppercase italic leading-none">{activeCore.name}</h3>
          </div>
        </div>

        {/* Nav Buttons - Dibuat Ramping (Pendek) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {coreItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveCore(item)}
              className={`py-2 md:py-6 rounded-lg md:rounded-2xl flex flex-col items-center justify-center transition-all border ${
                activeCore.name === item.name 
                ? 'bg-navy border-navy text-white' 
                : 'bg-white border-gray-100 text-navy'
              }`}
            >
              <span className="text-[7px] md:text-[10px] font-black tracking-widest uppercase mb-0.5">{item.name}</span>
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full border border-black/5" style={{ backgroundColor: item.hex }} />
            </button>
          ))}
        </div>
      </div>

      {/* EDGE CARD CONTAINER */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-[5/2] rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-lg bg-slate-200">
          <motion.div 
            key={activeEdge.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${activeEdge.image})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-black/60 to-transparent" />
          
          <div className="absolute bottom-3 left-4 md:bottom-8 md:left-10 text-white">
            <span className="text-[6px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-60 block">Edge Series</span>
            <h3 className="text-lg md:text-4xl font-black uppercase italic leading-none">{activeEdge.name}</h3>
          </div>
        </div>

        {/* Edge Nav Buttons - Dibuat Ramping (Pendek) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {edgeItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveEdge(item)}
              className={`py-2.5 md:py-8 rounded-lg md:rounded-2xl text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] transition-all border ${
                activeEdge.name === item.name 
                ? 'bg-navy border-navy text-white' 
                : 'bg-white border-gray-100 text-navy'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* 7. FINAL CTA */}
      <section className="relative py-60 bg-navy overflow-hidden text-white mt-20 border-t border-white/5 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate-900 to-black z-0" />
        <motion.div 
  style={{ x: xRight }} 
  className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0"
>
  {/* PENGATURAN TOTAL FIX:
    - text-[4.5rem]: Ukuran fix buat HP (sekitar 72px), ini ukuran aman buat 6 huruf di layar terkecil sekalipun.
    - md:text-[25vw]: Ukuran raksasa buat Desktop.
    - tracking-tight: Biar antar huruf agak rapet, jadi makin susah buat "tumpah" ke samping.
  */}
  <h2 className="text-[4.5rem] md:text-[25vw] font-black text-white leading-none text-center uppercase tracking-tighter">
    KRLN
  </h2>
</motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-[10rem] font-black text-white leading-[0.9] md:leading-[0.8] uppercase tracking-tighter mb-12">
  SIAP UNTUK <br />
  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white pr-4 md:pr-10">
    LEVEL UP? 
  </span>
</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/collection" className="w-full sm:w-auto px-16 py-7 bg-white text-navy text-sm font-black tracking-[0.4em] uppercase rounded-full hover:scale-105 transition-all">Explore Shop</Link>
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