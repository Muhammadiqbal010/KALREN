import { useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis'; // Tambahan Lenis
import Marquee from "react-fast-marquee"; // Tambahan Marquee
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

// Import semua logo
import SHOPEE_LOGO from '@/assets/logo/shopee-logo.png';
import TIKTOK_SHOP_LOGO from '@/assets/logo/tiktok-logo.png';
import INSTAGRAM_LOGO from '@/assets/logo/instagram.png';
import TIKTOK_LOGO from '@/assets/logo/tiktok.png';

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <div className="relative min-h-screen w-full bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
        
        {/* 0. GLOBAL TEXTURE OVERLAY */}
        <div 
          className="fixed inset-0 z-[50] pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{ 
            backgroundImage: `url(${churchTexture})`,
            backgroundSize: '300px',
            backgroundRepeat: 'repeat'
          }}
        />

        <Navigation />

        {/* 1. HERO SECTION - Match dengan style About */}
        <section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center">
          
          {/* Background Decor - KALREN Giant Text */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div className="text-white text-[22vw] font-black select-none opacity-[0.02] tracking-tighter uppercase">
              CONTACT
            </div>
          </div>
          
          {/* Lingkaran Animasi Dinamis */}
          <div className="absolute w-[85vh] h-[85vh] border border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite] z-0" />
          <div className="absolute w-[65vh] h-[65vh] border border-white/[0.05] rounded-full animate-[spin_40s_linear_infinite_reverse] z-0" />
          <div className="absolute w-[45vh] h-[45vh] border border-white/[0.02] rounded-full z-0" />

          {/* Main Content */}
          <div className={`relative z-10 text-center px-6 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase text-white mb-10">
              CONNECT WITH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                THE CIRCLE.
              </span>
            </h1>

            <div className="max-w-xl mx-auto">
              <p className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-slate-400 leading-relaxed italic">
                Tanya stok, pilih size, atau ngobrol soal style bersama circle KALREN.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Marquee dengan ukuran lebih proporsional */}
<section className="w-full bg-navy py-8 border-y border-white/5 overflow-x-hidden">
  <div className="w-full overflow-hidden">
      <Marquee
    speed={50}
    gradient={false}
    pauseOnHover={false}
    style={{ overflow: "hidden" }}
  >
      <div className="flex items-center gap-12 px-12 whitespace-nowrap">
        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          KALREN CLOTHING
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          ●
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          BUILT FOR YOUR CIRCLE
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          PREMIUM STREETWEAR
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          BORN IN INDONESIA
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em]">
          EST. 2025
        </span>

        <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.15em] ">
          ●
        </span>

      </div>
    </Marquee>
  </div>
</section>

        {/* BRAND MESSAGE */}
        <section className="py-32 md:py-40 lg:py-48 bg-white border-t border-gray-100/50">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-gray-800">
              Kami membangun dengan ritme yang kami percaya.
            </p>

            <p className="mt-8 md:mt-10 text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Bukan sekadar mengikuti tren.
              Setiap piece dibuat dengan fokus pada kenyamanan, kualitas material, dan karakter desain
            </p>

            <p className="mt-6 text-lg md:text-xl text-gray-500 leading-relaxed">
              Website ini hadir untuk memperkenalkan KALREN dan nilai yang kami bawa 
              Seluruh pembelian dapat dilakukan melalui official online store kami
            </p>
          </div>
        </section>

        {/* WHERE TO BUY */}
        <section className="py-32 md:py-40 lg:py-48 bg-gray-50/70">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] uppercase text-navy text-center mb-16 md:mb-20">
              Official Online Store
            </h2>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[
                {
                  platform: 'Shopee',
                  desc: 'Official store KALREN untuk pembelian mudah, aman, dan pengiriman ke seluruh Indonesia',
                  url: 'https://id.shp.ee/ck2XBp1L',
                  logo: SHOPEE_LOGO,
                },
                {
                  platform: 'TikTok Shop',
                  desc: 'Temukan drop terbaru KALREN melalui konten, live session, dan update produk',
                  url: ' https://vt.tiktok.com/ZSmv4mcrG/?page=Mall',
                  logo: TIKTOK_SHOP_LOGO,
                },
              ].map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group p-10 md:p-12 lg:p-14 
                    bg-white border border-gray-200/70 rounded-3xl 
                    hover:border-navy/40 hover:shadow-2xl hover:shadow-navy/10 
                    transition-all duration-700 ease-out flex flex-col items-center text-center
                  "
                >
                  <img
                    src={item.logo}
                    alt={`${item.platform} Logo`}
                    className="h-20 md:h-24 lg:h-28 object-contain mb-6 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <h3 className="text-4xl md:text-5xl font-black uppercase tracking-[-0.02em] text-navy group-hover:text-navy-dark">
                    {item.platform}
                  </h3>
                  <p className="mt-6 text-lg md:text-xl text-gray-600 group-hover:text-gray-800 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-navy font-medium tracking-wide uppercase text-sm">
                      Kunjungi sekarang →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL */}
        <section className="py-24 md:py-32 bg-white border-t border-gray-100/50">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 text-center">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10">
              Ikuti perjalanan KALREN, update drop terbaru,<br className="hidden sm:block" />
              dan inspirasi style melalui kanal resmi kami.
            </p>

            <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-24">
              {[
                {
                  name: 'Instagram',
                  url: 'https://www.instagram.com/kalrenclothing',
                  logo: INSTAGRAM_LOGO,
                },
                {
                  name: 'TikTok',
                  url: 'https://www.tiktok.com/@kalrenclothing',
                  logo: TIKTOK_LOGO,
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4"
                >
                  <div
                    className="
                      w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 
                      rounded-full overflow-hidden border-2 border-navy/30 
                      bg-navy/10 transition-all duration-500 
                      group-hover:scale-110 group-hover:border-navy/60 group-hover:shadow-lg
                    "
                  >
                    <img
                      src={social.logo}
                      alt={`${social.name} Logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="
                      text-xl md:text-2xl font-bold uppercase tracking-wide 
                      text-navy group-hover:text-navy-dark transition-colors
                    "
                  >
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="py-32 lg:py-40 bg-navy text-white/95">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <p className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              KALREN dibuat untuk kenyamanan, style, dan<br />
              <span className="font-semibold tracking-[-0.015em]">circle yang bergerak bersama</span>
            </p>
          </div>
        </section>

        <div className="bg-navy text-white/90">
          <Footer />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Contact;