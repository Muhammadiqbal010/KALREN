import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from "react-fast-marquee"; 
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/white-linen.png';

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Timer sedikit dipercepat agar feel interaksinya lebih responsif
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      t: 'Comfort',
      d: 'Kenyamanan selalu menjadi prioritas utama dalam setiap produk KALREN.',
      detail: 'Material yang dipilih dirancang untuk dipakai sepanjang hari, dari aktivitas santai hingga nongkrong bersama circle.'
    },
    {
      t: 'Community',
      d: 'KALREN tumbuh dari culture kebersamaan dan circle anak muda.',
      detail: 'Kami percaya streetwear bukan hanya tentang pakaian, tapi tentang komunitas, cerita, dan pengalaman yang dibangun bersama.'
    },
    {
      t: 'Quality',
      d: 'Detail produksi selalu dijaga agar setiap produk memiliki standar tinggi.',
      detail: 'Mulai dari jahitan yang rapi hingga sablon raster premium, semuanya dibuat untuk memberikan kualitas yang terasa.'
    }
  ];

  const milestones = [
  { 
    year: '2025', 
    title: 'The Beginning', 
    desc: 'KALREN lahir sebagai brand streetwear lokal yang berangkat dari semangat anak muda untuk menciptakan pakaian yang nyaman, berkarakter, dan cocok untuk lifestyle nongkrong.' 
  },
  { 
    year: '2026', 
    title: 'Building The Circle', 
    desc: 'Mulai membangun komunitas KALREN dengan menghadirkan desain yang relevan bagi anak muda serta memperluas circle melalui berbagai aktivitas dan interaksi.' 
  },
];

  const missions = [
    'Menghadirkan bahan berkualitas yang nyaman dipakai sehari-hari.',
    'Menawarkan produk dengan harga terjangkau tanpa mengorbankan kualitas.',
    'Menjaga detail produksi seperti jahitan rapi dan sablon raster premium.',
    'Menciptakan desain streetwear yang unik dan berkarakter.'
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
      
      {/* 0. OVERLAY NOISE TEXTURE - Z-index diturunkan agar tidak menghalangi klik */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ 
          backgroundImage: `url(${churchTexture})`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat'
        }}
      />

      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="text-white text-[22vw] font-black select-none opacity-[0.02] tracking-tighter uppercase">
            KALREN
          </div>
        </div>
        
        {/* Lingkaran Animasi */}
        <div className="absolute w-[85vh] h-[85vh] border border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite] z-0" />
        <div className="absolute w-[65vh] h-[65vh] border border-white/[0.05] rounded-full animate-[spin_40s_linear_infinite_reverse] z-0" />
        <div className="absolute w-[45vh] h-[45vh] border border-white/[0.02] rounded-full z-0" />

        <div className={`relative z-10 text-center px-6 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase text-white mb-10">
            WE ARE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              THE CIRCLE.
            </span>
          </h1>
          <div className="max-w-md mx-auto">
            <p className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-slate-400 leading-relaxed italic">
              Streetwear built for comfort, style, and the circle you move with.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section className="py-40 md:py-64 bg-slate-50 relative border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="relative">
              <span className="text-gray-200/50 text-[10rem] md:text-[15rem] font-black absolute -top-32 -left-12 select-none z-0">01</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-navy relative z-10 leading-none">
                The Core<br />Philosophy.
              </h2>
            </div>
            <div className="space-y-12">
              <p className="text-3xl md:text-4xl text-gray-800 leading-tight font-light italic">
                " Streetwear bukan hanya tentang terlihat keren, tapi tentang bagaimana rasanya saat dipakai di kehidupan nyata. "
              </p>
              <div className="space-y-6 text-xl text-gray-600 font-light leading-relaxed">
                <p>
                  KALREN lahir dari keresahan akan dominasi tren cepat (fast fashion) yang seringkali mengabaikan aspek kenyamanan jangka panjang. Kami percaya bahwa setiap artikel pakaian harus memiliki jiwa dan daya tahan.
                </p>
                <p>
                  Nama <strong>KALREN</strong> diambil sebagai simbol dari circle atau lingkaran pertemanan, tempat di mana ide-ide paling jujur biasanya lahir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CRAFTMANSHIP SECTION */}
      <section className="py-40 bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-32 gap-12">
            <div className="md:w-1/2">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
                Precision in<br />Every Stitch.
              </h2>
            </div>
            <div className="md:w-1/2 border-l border-white/10 pl-12">
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Kami percaya kualitas tidak boleh dikompromikan. Dari pemilihan cotton combed 24s hingga proses sablon raster premium, setiap detail dipastikan memberikan kenyamanan, ketahanan, dan tampilan yang maksimal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Cotton Combed 24s Fabric', 'Premium DTF Printing', 'Regular Fit Silhouette', 'Clean & Durable Stitching'].map((feature, i) => (
              <div key={i} className="group p-10 border border-white/5 hover:bg-white hover:text-navy transition-all duration-700 aspect-square flex flex-col justify-end">
                <span className="text-4xl font-black mb-4 opacity-20 group-hover:opacity-100">0{i+1}</span>
                <h4 className="text-xl font-bold uppercase tracking-widest">{feature}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE VALUES */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((val, idx) => (
              <div 
                key={val.t} 
                className="group relative p-12 bg-slate-50 border border-gray-100 transition-all duration-500 rounded-[3rem] hover:bg-navy cursor-default"
              >
                <div className="mb-12 w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 group-hover:bg-white group-hover:text-navy group-hover:rotate-[360deg]">
                  {idx + 1}
                </div>
                <h3 className="text-4xl font-black uppercase mb-6 tracking-tight text-navy transition-colors duration-500 group-hover:text-white">
                  {val.t}
                </h3>
                <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed transition-colors duration-500 group-hover:text-white/80">
                  {val.d}
                </p>
                <div className="pt-8 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:border-white/10">
                  <p className="text-sm text-gray-400 italic leading-relaxed group-hover:text-white/40">
                    {val.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VISI & MISI - Fixed Map logic */}
      <section className="py-40 md:py-64 bg-[#F2F6FA] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-32">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
              <div className="md:col-span-4">
                <h2 className="text-7xl font-black text-navy uppercase tracking-tighter">Visi.</h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-3xl md:text-5xl font-light text-gray-700 leading-tight">
                  Menjadi brand streetwear lokal <span className="font-bold text-navy">yang menghadirkan pakaian nyaman </span> dengan desain berkarakter untuk menemani gaya hidup anak muda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
              <div className="md:col-span-4">
                <h2 className="text-7xl font-black text-navy uppercase tracking-tighter">Misi.</h2>
              </div>
              <div className="md:col-span-8 space-y-8">
                {missions.map((misi, i) => (
                  <div key={i} className="flex items-start gap-8 group">
                    <span className="text-4xl font-black text-navy/20 group-hover:text-navy transition-colors">0{i+1}</span>
                    <p className="text-2xl text-gray-600 font-light border-b border-gray-200 pb-4 w-full group-hover:border-navy transition-colors">
                      {misi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. JOURNEY */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-40">
            <h2 className="text-6xl md:text-8xl font-black uppercase text-navy tracking-tighter">The Journey.</h2>
            <div className="mt-4 flex justify-center items-center gap-4">
              <div className="h-px w-20 bg-navy" />
              <p className="text-gray-400 tracking-[0.4em] uppercase text-xs font-bold">Step by Step</p>
              <div className="h-px w-20 bg-navy" />
            </div>
          </div>
          
          <div className="space-y-40 relative before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-px before:bg-navy/5">
            {milestones.map((m, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center gap-16 group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} group-hover:scale-105 transition-transform duration-700`}>
                  <h3 className="text-6xl font-black text-navy/5 group-hover:text-navy/10 transition-colors leading-none">{m.year}</h3>
                  <h4 className="text-3xl font-bold text-navy uppercase mt-4">{m.title}</h4>
                  <p className="mt-6 text-gray-500 text-lg leading-relaxed font-light">{m.desc}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-navy ring-[12px] ring-white shadow-xl z-10" />
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MARQUEE */}
      <section className="py-20 bg-navy overflow-hidden border-y border-white/5">
        <Marquee speed={80} gradient={false}>
          <h2 className="text-[12vw] font-black uppercase text-white/5 leading-none tracking-tighter px-8 whitespace-nowrap">
            KALREN — BUILT FOR YOUR CIRCLE — HIGH QUALITY GOODS —
          </h2>
        </Marquee>
      </section>

      {/* 8. QUOTE */}
      <section className="py-64 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="text-navy/10 text-[20rem] font-serif absolute -top-48 left-1/2 -translate-x-1/2 select-none z-0">“</span>
          <p className="text-4xl md:text-6xl font-light text-navy leading-tight tracking-tight relative z-10 italic">
            Kami tidak hanya membuat pakaian. Kami <span className="font-black not-italic border-b-8 border-navy/10"> menciptakan streetwear</span> yang nyaman dipakai, berkarakter, dan menjadi bagian dari circle Anda.
          </p>
        </div>
      </section>

      {/* 9. CTA SECTION - Refined buttons */}
      <section className="py-40 bg-navy relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate-900 to-black z-0" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-12 leading-[0.8]">
            GET INTO<br />THE CIRCLE.
          </h2>
          <p className="text-slate-400 text-xl font-light mb-20 max-w-xl mx-auto leading-relaxed">
            Jadilah bagian dari circle KALREN dan temukan koleksi streetwear yang dibuat untuk kenyamanan, style, dan ekspresi diri.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/collection"
              className="px-16 py-6 bg-white text-navy font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all hover:scale-105 shadow-2xl"
            >
              Explore Collection
            </Link>
            <Link
              to="/Contact"
              className="px-16 py-6 border border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all hover:scale-105"
            >
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