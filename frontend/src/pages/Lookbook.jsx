import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Lookbook = () => {
  const [lookbookData, setLookbookData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        const res = await api.get('/api/lookbook');
        const activeCampaigns = (res.data || []).filter(item => item.is_active !== false);
        setLookbookData(activeCampaigns);
      } catch (err) {
        console.error('gagal mengambil data lookbook:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLookbook();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center font-['Inter']">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-[1px] bg-white/20 animate-width" />
          <p className="text-[9px] tracking-[0.6em] uppercase text-slate-500 animate-pulse font-light">
            SINKRONISASI ARSIP...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-white font-['Inter'] antialiased selection:bg-blue-900 selection:text-white">
      <Navigation />

      {/* ==========================================
          EDITORIAL HEADER SECTION - GACOR EDITION
          ========================================== */}
      <section className="relative pt-36 md:pt-48 pb-12 md:pb-20 px-4 md:px-16 lg:px-24">
        <div className="absolute top-0 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-950/[0.15] rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-2 mb-2 md:mb-4">
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] md:tracking-[0.7em] text-blue-400 font-bold">
              ESTABLISHED AREA // ARCHIVE
            </p>
          </div>

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.5rem] sm:text-[6rem] lg:text-[7.5rem] font-black tracking-[0.15em] md:tracking-[0.25em] leading-[0.95] md:leading-[0.9] uppercase text-white"
            >
              LOOKBOOK
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-start justify-between gap-6 border-t border-white/10 pt-6 md:pt-8"
          >
            <div className="max-w-xl">
              <p className="text-[11px] md:text-sm leading-relaxed text-slate-400 font-light tracking-wide">
                Koleksi dokumentasi visual berkala yang merangkum esensi pergerakan gaya jalanan premium. Setiap potret merepresentasikan konsistensi material, struktur potongan kain terbaik, dan narasi campaign eksklusif kami.
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-1 whitespace-nowrap">
              <span className="text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase">
                SELECTION PICS
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-blue-400 font-bold">
                {lookbookData.length} CAMPAIGNS REGISTERED
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          GALLERY GRID SECTION - 2 COLUMNS MOBILE
          ========================================== */}
      <section className="px-4 md:px-16 lg:px-24 pb-32 md:pb-40">
        <div className="max-w-7xl mx-auto">
          {lookbookData.length === 0 ? (
            <div className="border border-white/5 rounded-3xl bg-black/20 py-24 text-center backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-light">
                belum ada katalog arsip yang dirilis.
              </p>
            </div>
          ) : (
            /* 🎯 CORE FIX RESPONSIVE GRID 2 KOLOM:
               - Di HP/Mobile: Dikunci kaku 'grid-cols-2' jahar berdua kesamping.
               - Jarak sela grid menyempit jadi 'gap-3' di HP biar gak makan space, dan auto 'lg:gap-10' di laptop. */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10 w-full">
              {lookbookData.map((item, index) => (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                  viewport={{ once: true, margin: "-30px" }}
                  className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-white/[0.05] hover:border-blue-500/30 bg-[#0c1220] aspect-[4/5] w-full flex flex-col justify-end shadow-xl md:shadow-2xl transition-all duration-500"
                >
                  {/* Pojok Kiri Atas: Index Number (Dikecilkan 'text-[7px]' pas mobile biar proporsional) */}
                  <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[7px] md:text-[9px] font-mono tracking-widest text-slate-300">
                    C-{String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Image Container with High-End Filter */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-[1s] ease-[0.16, 1, 0.3, 1] group-hover:scale-[1.05] filter brightness-[0.70] contrast-[1.05] group-hover:brightness-[0.85]"
                    />
                  </div>

                  {/* Gradient Background Overlay Smooth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-black/10 z-10" />

                  {/* Text Container: Floating Elegant Effect 
                     Padding disempitkan jadi 'p-3' di mobile dan 'md:p-8' di desktop */}
                  <div className="relative p-3 md:p-8 z-20 w-full">
                    <div className="overflow-hidden">
                      {/* Judul Campaign diturunkan ukurannya jadi 'text-xs' di mobile agar muat 2 baris */}
                      <h2 className="text-xs md:text-lg font-black uppercase tracking-wide md:tracking-[0.1em] text-white drop-shadow-md line-clamp-2 leading-tight">
                        {item.title}
                      </h2>
                    </div>
                    
                    {/* Garis Aksen Bawah (Disembunyikan di mobile, hanya aktif di desktop pas hover) */}
                    <div className="hidden md:block w-0 group-hover:w-full h-[1px] bg-blue-400/60 mt-3 transition-all duration-500 ease-[0.16, 1, 0.3, 1]" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lookbook;