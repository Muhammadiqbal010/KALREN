import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion} from 'framer-motion'; // Tambahkan useScroll & useTransform
import Marquee from "react-fast-marquee"; //import { ReactLenis } from '@studio-freight/react-lenis'; // Tambahan Lenis
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';


// ===== CORE IMAGES =====
import hitam from '@/assets/card/Black.png';
import navy from '@/assets/card/Navy.png';
import marun from '@/assets/card/Maroon.png';
import putih from '@/assets/card/Putih.png';

// ===== EDGE IMAGES =====
import albert from '@/assets/card/Albert.png';
import street from '@/assets/card/Street.png';
import bali from '@/assets/card/Bali.png';
import daruma from '@/assets/card/Daruma.png';

export const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // ===== DATA =====
  const coreItems = [
    { name: 'Hitam', image: hitam },
    { name: 'Maroon', image: marun },
    { name: 'Navy', image: navy },
    { name: 'Putih', image: putih },
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* GLOBAL TEXTURE */}
      <div
        className="fixed inset-0 pointer-events-none z-[-2]"
        style={{
          backgroundImage: `url(${churchTexture})`,
          opacity: 0.05,
          backgroundSize: '1400px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply',
          backgroundAttachment: 'fixed',
          filter: 'grayscale(40%)',
        }}
      />

      <Navigation />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-navy overflow-hidden pt-24">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <div
            className={`transition-[opacity,transform] duration-[2000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-[-0.03em] uppercase text-white">
              STYLE IT YOUR WAY,
              <br />
              COMFORT TANPA KOMPROMI.
            </h1>

            <p className="mt-8 text-lg md:text-2xl font-light tracking-[0.2em] uppercase text-slate-300/90">
              KALREN — BUILT FOR YOUR HANGOUT.
            </p>

            <div className="mt-10">
              <Link
                to="/collection"
                className="inline-flex items-center px-10 py-5 border-2 border-slate-200/60 text-white text-lg font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-white/10 transition-all duration-500"
              >
                Jelajahi Koleksi
                <span className="ml-4 text-2xl transition-transform duration-500 group-hover:translate-x-3">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-8 border-y border-navy/10 overflow-x-hidden">
  <div className="w-full overflow-hidden">
    <Marquee
      speed={50}
      gradient={false}
      pauseOnHover={false}
      style={{ overflow: "hidden" }}
    >
      <div className="flex items-center gap-16 px-12 whitespace-nowrap">

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          KALREN
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          PRECISE CONTROL
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          QUALITY OVER EVERYTHING
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          BUILT FOR YOUR HANGOUT
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          BORN IN INDONESIA
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          EST. 2025
        </span>

        <span className="text-navy font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

      </div>
    </Marquee>
  </div>
</section>

      <section className="py-40 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight">
              Kami membangun dengan ritme yang <span className="italic font-bold">kami percaya.</span>
            </h3>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Bukan sekadar pakaian, KALREN adalah manifestasi dari kendali penuh atas gaya hidup lo. 
              Dirancang untuk kenyamanan maksimal saat nongkrong.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED COLLECTION ================= */}
      <section className="py-40 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <h2 className="text-6xl font-bold uppercase tracking-tight text-navy">
              Built Different
            </h2>
            <p className="mt-4 md:mt-0 text-gray-500 tracking-widest uppercase text-sm">
              Designed For Youth Culture • 2026
            </p>
          </div>

          <div className="space-y-32">

            {/* ===== CORE CARD ===== */}
            <div className="relative rounded-3xl overflow-hidden group">

              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${activeCore.image})` }}
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[160px] font-black uppercase text-white opacity-[0.05]">
                  CORE
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
                {coreItems.map((item) => (
                  <Link
                    key={item.name}
                    to="/collection?category=CORE"
                    onMouseEnter={() => setActiveCore(item)}
                    className="h-56 flex items-center justify-center text-2xl font-semibold uppercase tracking-widest text-white hover:bg-white/10 transition-all duration-500"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ===== EDGE CARD ===== */}
            <div className="relative rounded-3xl overflow-hidden group">

              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${activeEdge.image})` }}
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[160px] font-black uppercase text-white opacity-[0.05]">
                  EDGE
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
                {edgeItems.map((item) => (
                  <Link
                    key={item.name}
                    to="/collection?category=EDGE"
                    onMouseEnter={() => setActiveEdge(item)}
                    className="h-56 flex items-center justify-center text-2xl font-semibold uppercase tracking-widest text-white hover:bg-white/10 transition-all duration-500"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CLOSING STATEMENT / CALL TO ACTION ================= */}
      <section className="relative py-60 bg-navy overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[30vw] font-black text-white leading-none">KALREN</h2>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              SIAP UNTUK <br />
              <span className="italic text-slate-400">LEVEL UP</span> NONGKRONG LO?
            </h2>
            
            <p className="text-xl text-slate-300 font-light tracking-[0.2em] uppercase max-w-2xl mx-auto leading-relaxed">
              Jangan cuma jadi penonton. Ambil kendali gaya lo sekarang dengan koleksi terbaru kami.
            </p>

            <div className="pt-8">
              <Link
                to="/collection"
                className="group relative inline-flex items-center px-12 py-6 bg-white text-navy text-xl font-bold tracking-[0.3em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
              >
                <span className="relative z-10">Ambil Sekarang</span>
                <div className="absolute inset-0 bg-slate-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-navy border-t border-white/5">
        <Footer />
      </div>
    </div>
  );
};

export default Home;