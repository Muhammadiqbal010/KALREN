import { useEffect, useState } from 'react';
import api from '../api/axios'; 
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/white-linen.png';

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    const fetchCmsData = async () => {
      try {
        const res = await api.get('/api/cms');
        setCmsData(res.data);
      } catch (err) {
        console.error('Gagal load sinkronisasi data matrix CMS:', err);
      }
    };

    fetchCmsData();

    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      t: 'Comfort',
      d: 'Kenyamanan selalu menjadi prioritas utama dalam setiap produk KALREN.',
      detail:
        'Material yang dipilih dirancang untuk dipakai sepanjang hari, dari aktivitas santai hingga nongkrong bersama circle.',
    },
    {
      t: 'Community',
      d: 'KALREN tumbuh dari culture kebersamaan dan circle anak muda.',
      detail:
        'Kami percaya streetwear bukan hanya tentang pakaian, tapi tentang komunitas, cerita, dan pengalaman yang dibangun bersama.',
    },
    {
      t: 'Quality',
      d: 'Detail produksi selalu dijaga agar setiap produk memiliki standar tinggi.',
      detail:
        'Mulai dari jahitan yang rapi hingga sablon raster premium, semuanya dibuat untuk memberikan kualitas yang terasa.',
    },
  ];

  const milestones = [
    {
      year: '2025',
      title: 'The Beginning',
      desc: 'KALREN lahir sebagai brand streetwear lokal yang berangkat dari semangat anak muda untuk menciptakan pakaian yang nyaman, berkarakter, dan cocok untuk lifestyle nongkrong.',
    },
    {
      year: '2026',
      title: 'Building The Circle',
      desc: 'Mulai membangun komunitas KALREN dengan menghadirkan desain yang relevan bagi anak muda serta memperluas circle melalui berbagai aktivitas dan interaksi.',
    },
  ];

  const defaultMissions = [
    "Menghadirkan produk streetwear berkualitas tinggi dengan material premium yang menjamin kenyamanan maksimal.",
    "Membangun ekosistem fashion anak muda yang jujur, independen, dan berkarakter kuat.",
    "Memberikan pelayanan terbaik dan konsisten menjaga standar detail di setiap artikel pakaian yang dirilis."
  ];

  const heroTitle = cmsData?.manifesto_title || "BUILDING THE PERFECT";
  const heroTitleItalic = cmsData?.manifesto_title_italic || "CIRCLE SYSTEM";
  const philosophyText = cmsData?.manifesto_description || "Kami membangun dengan ritme yang kami percaya. Bukan sekadar pakaian, KALREN adalah manifestasi dari kendali penuh atas gaya hidup lo.";

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url(${churchTexture})`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
        }}
      />

      <Navigation />

      {/* ==========================================
          1. HERO SECTION (RESPONSIVE TYPOGRAPHY)
          ========================================== */}
      <section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="text-white text-[22vw] font-black select-none opacity-[0.02] tracking-tighter uppercase">
            KLRN
          </div>
        </div>

        <div className="absolute w-[50vh] md:w-[85vh] h-[50vh] md:h-[85vh] border border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite] z-0" />
        <div className="absolute w-[35vh] md:w-[65vh] h-[35vh] md:h-[65vh] border border-white/[0.05] rounded-full animate-[spin_40s_linear_infinite_reverse] z-0" />

        <div
          className={`relative z-10 text-center px-4 transition-all duration-[1500ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* ⚡ Ganti text-[8rem] jadi text-4xl di mobile, naik bertahap ke md:[8rem] */}
          <h1 className="text-3xl sm:text-5xl md:text-[6rem] lg:text-[7.5rem] font-black leading-[1] md:leading-[0.85] tracking-tighter uppercase text-white mb-6 md:mb-10">
            {heroTitle}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              {heroTitleItalic}
            </span>
          </h1>

          <div className="max-w-md mx-auto">
            <p className="text-xs md:text-base font-light tracking-[0.2em] uppercase text-slate-400 leading-relaxed italic">
              Streetwear built for comfort, style, and the circle you move with.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. PHILOSOPHY SECTION (FIXED TYPO & COLLISION BAL)
          ========================================== */}
      <section className="py-20 md:py-32 lg:py-40 bg-slate-50 relative border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* 🎯 CORE GRID RE-ALIGN: 
              Kita gunakan md:grid-cols-12 (Sistem 12 Kolom standar Bootstrap/Tailwind) 
              Biar porsi kiri dan kanan terbagi presisi tanpa aksi tabrakan konyol Bal! */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
            
            {/* COLUMN KIRI: AREA JUDUL (Porsi: 5 dari 12 Kolom) */}
            <div className="relative md:col-span-5 w-full">
              {/* Angka background 01 diatur opacity dan posisinya biar gak numpuk brutal */}
              <span className="text-gray-200/40 text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black absolute -top-12 md:-top-24 -left-2 md:-left-6 select-none z-0 font-sans">
                01
              </span>
              
              {/* ⚡ CRITICAL FIX: 
                  - Ukuran font diturunkan jadi text-3xl di mobile, md:text-5xl di tablet, dan maksimal lg:text-6xl di desktop.
                  - Ditambahkan tracking-tighter dan leading-none agar teks "THE CORE PHILOSOPHY" mengunci padat ke dalam containernya. */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-navy relative z-10 leading-[0.95] max-w-full break-words">
                The Core
                <br />
                Philosophy.
              </h2>
            </div>

            {/* COLUMN KANAN: AREA DESKRIPSI TEKS (Porsi: 7 dari 12 Kolom) */}
            {/* md:mt-0 memberikan reset margin pas masuk ke mode horizontal desktop */}
            <div className="md:col-span-7 space-y-6 md:space-y-8 mt-4 md:mt-0 w-full z-10">
              {/* Quote Manifesto */}
              <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-800 leading-snug font-light italic text-justify md:text-left">
                "{philosophyText}"
              </p>

              {/* Paragraf Pendukung (Ukurannya disesuaikan text-xs s.d text-base agar nyaman dibaca) */}
              <div className="space-y-4 text-xs sm:text-sm md:text-base text-gray-600 font-light leading-relaxed text-justify md:text-left">
                <p>
                  KALREN lahir dari keresahan akan dominasi tren cepat (fast fashion) yang seringkali mengabaikan aspek kenyamanan jangka panjang. Kami percaya bahwa setiap artikel pakaian harus memiliki jiwa dan daya tahan.
                </p>
                <p>
                  Nama <strong className="font-bold text-navy">KALREN</strong> diambil sebagai nama brand spesifik yang mewakili lingkaran pertemanan, tempat di mana ide-ide paling jujur biasanya lahir.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          3. CRAFTMANSHIP SECTION (GRID 4 KOLOM DESKTOP)
          ========================================== */}
      <section className="py-24 md:py-40 bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 md:mb-32 gap-6 md:gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-8">
                Precision in
                <br />
                Every Stitch.
              </h2>
            </div>
            <div className="w-full md:w-1/2 border-l border-white/10 pl-6 md:pl-12">
              <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed">
                Kami percaya kualitas tidak boleh dikompromikan. Dari pemilihan cotton combed 24s hingga proses sablon raster premium, setiap detail dipastikan memberikan kenyamanan, ketahanan, dan tampilan yang maksimal.
              </p>
            </div>
          </div>

          {/* ⚡ DISINI JUGA SUDAH FIX: 1 kolom di HP, langsung 2 kolom di tablet, dan 4 kolom ke samping di laptop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Cotton Combed 24s Fabric',
              'Premium DTF Printing',
              'Regular Fit Silhouette',
              'Clean & Durable Stitching',
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 md:p-10 border border-white/5 hover:bg-white hover:text-navy transition-all duration-700 aspect-square flex flex-col justify-end"
              >
                <span className="text-3xl md:text-4xl font-black mb-2 md:mb-4 opacity-20 group-hover:opacity-100">
                  0{i + 1}
                </span>
                <h4 className="text-base md:text-xl font-bold uppercase tracking-widest">
                  {feature}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. VALUES CARD SECTION (FIX JALUR KE SAMPING)
          ========================================== */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* 🎯 CORE FIX: Ganti 'lg:grid-cols-3' menjadi 'md:grid-cols-3' */}
          {/* Sekarang di layar laptop/tablet, card Comfort, Community, Quality dijamin langsung berjejer ke samping! */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {values.map((val, idx) => (
              <div
                key={val.t}
                className="group p-8 md:p-12 bg-slate-50 border border-gray-100 transition-all duration-500 rounded-[2rem] md:rounded-[3rem] hover:bg-navy cursor-default"
              >
                <div className="mb-6 md:mb-12 w-12 md:w-16 h-12 md:h-16 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-500 group-hover:bg-white group-hover:text-navy group-hover:rotate-[360deg]">
                  {idx + 1}
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase mb-4 md:mb-6 tracking-tight text-navy transition-colors duration-500 group-hover:text-white">
                  {val.t}
                </h3>
                <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 font-light leading-relaxed transition-colors duration-500 group-hover:text-white/80">
                  {val.d}
                </p>
                <div className="pt-4 md:pt-8 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:border-white/10">
                  <p className="text-xs md:text-sm text-gray-400 italic leading-relaxed group-hover:text-white/40">
                    {val.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. VISI & MISI SECTION (1 COL MOBILE)
          ========================================== */}
      <section className="py-24 md:py-64 bg-[#F2F6FA] relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 relative z-10">
    <div className="flex flex-col gap-16 md:gap-32">
      
      {/* SUB-BLOCK VISI */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-4 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter">
            Visi.
          </h2>
        </div>
        <div className="md:col-span-8">
          <p className="text-xl md:text-4xl font-light text-gray-700 leading-tight">
            Menjadi standar baru streetwear lokal yang memadukan{' '}
            <span className="font-bold text-navy">
              kenyamanan esensial dengan estetika premium
            </span>, menciptakan pakaian yang relevan secara timeless bagi generasi muda.
          </p>
        </div>
      </div>

      {/* SUB-BLOCK MISI */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-4 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter">
            Misi.
          </h2>
        </div>
        <div className="md:col-span-8 space-y-8 w-full">
          {[
            { title: "Material Excellence", desc: "Mengutamakan kualitas material pilihan yang memberikan kenyamanan tanpa kompromi, memastikan setiap jahitan dan bahan terasa superior saat digunakan." },
            { title: "Refined Aesthetics", desc: "Menghadirkan desain yang minimalis, elegan, dan berkelas, dirancang khusus bagi mereka yang menghargai detail dalam setiap potongan pakaian." },
            { title: "Effortless Style", desc: "Menyediakan koleksi yang mudah dipadupadankan, memberikan solusi berpakaian yang praktis namun tetap terlihat menonjol di segala situasi." },
            { title: "Sustainable Quality", desc: "Menjaga standar produksi yang konsisten dan tahan lama, karena produk premium adalah investasi bagi gaya hidup penggunanya." }
          ].map((misi, i) => (
            <div key={i} className="flex items-start gap-4 md:gap-8 group">
              <span className="text-xl md:text-4xl font-black text-navy/20 group-hover:text-navy transition-colors">
                0{i + 1}
              </span>
              <div className="border-b border-gray-200 pb-4 md:pb-8 w-full group-hover:border-navy transition-colors">
                <h4 className="text-lg md:text-2xl font-bold text-navy mb-1 uppercase tracking-wider">
                  {misi.title}
                </h4>
                <p className="text-sm md:text-lg text-gray-600 font-light leading-relaxed">
                  {misi.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

      {/* ==========================================
          6. THE JOURNEY TIMELINE (RESPONSIVE ALIGN)
          ========================================== */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-28">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-black tracking-tighter font-mono">
              The Journey.
            </h2>
            <div className="mt-3 flex justify-center items-center gap-4">
              <div className="h-px w-10 bg-white/20" />
              <p className="text-zinc-600 tracking-[0.3em] uppercase text-[9px] md:text-[10px] font-black font-mono">
                Step by Step Build
              </p>
              <div className="h-px w-10 bg-white/20" />
            </div>
          </div>

          {/* 🎯 CORE FIX TIMELINE MOBILE: 
             Ganti garis tengah 'before:left-6' murni kaku di sebelah kiri pas HP, baru 'md:before:left-1/2' di laptop */}
          <div className="space-y-20 md:space-y-40 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-px before:bg-navy/5">
            {milestones.map((m, i) => (
              /* Mengubah arah layout item: di HP selalu rata kiri 'pl-10 md:pl-0' */
              <div key={i} className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-16 group pl-10 md:pl-0 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} group-hover:scale-102 transition-transform duration-700`}>
                  <h3 className="text-4xl md:text-6xl font-black text-navy/5 group-hover:text-navy/10 transition-colors datetime-none">
                    {m.year}
                  </h3>
                  <h4 className="text-xl md:text-3xl font-bold text-navy uppercase mt-1 md:mt-4">
                    {m.title}
                  </h4>
                  <p className="mt-2 md:mt-6 text-gray-500 text-sm md:text-lg leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>
                {/* Posisi bulatan timeline bergeser ke kiri pas di layar HP */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-navy ring-[8px] md:ring-[12px] ring-white shadow-xl z-10" />
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. QUOTE SECTION (TYPO CALIBRATION)
          ========================================== */}
      <section className="py-32 md:py-64 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="text-navy/5 text-[10rem] md:text-[20rem] font-serif absolute -top-24 md:—top-48 left-1/2 -translate-x-1/2 select-none z-0">
            “
          </span>
          <p className="text-xl md:text-6xl font-light text-navy leading-snug tracking-tight relative z-10 italic">
            Kami tidak hanya membuat pakaian. Kami{' '}
            <span className="font-black not-italic border-b-4 md:border-b-8 border-navy/10">
              menciptakan streetwear
            </span>{' '}
            yang nyaman dipakai, berkarakter, dan menjadi bagian dari circle Anda.
          </p>
        </div>
      </section>

      {/* ==========================================
          8. CTA BUY BUFFER HOOK
          ========================================== */}
      <section className="py-24 md:py-40 bg-navy relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate-900 to-black z-0" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-9xl font-black uppercase tracking-tighter mb-6 md:mb-12 leading-[0.9] md:leading-[0.8]">
            GET INTO
            <br />
            THE CIRCLE.
          </h2>
          <p className="text-slate-400 text-sm md:text-xl font-light mb-10 md:mb-20 max-w-xl mx-auto leading-relaxed">
            Jadilah bagian dari circle KALREN dan temukan koleksi streetwear yang dibuat untuk kenyamanan, style, dan ekspresi diri.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/collection" className="px-12 md:px-16 py-4 md:py-6 bg-white text-navy font-black uppercase tracking-widest text-xs md:text-sm hover:bg-slate-200 transition-all hover:scale-105 shadow-2xl text-center">
              Explore Collection
            </Link>
            <Link to="/Contact" className="px-12 md:px-16 py-4 md:py-6 border border-white/20 text-white font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white/10 transition-all hover:scale-105 text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;