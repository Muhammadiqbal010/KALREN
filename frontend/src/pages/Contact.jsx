import { useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import api from '../api/axios'; 
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

// Import logo marketplace KALREN
import SHOPEE_LOGO from '@/assets/logo/shopee-logo.png';
import TIKTOK_SHOP_LOGO from '@/assets/logo/tiktok-logo.png';
import INSTAGRAM_LOGO from '@/assets/logo/instagram.png';
import TIKTOK_LOGO from '@/assets/logo/tiktok.png';

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const fetchCmsData = async () => {
      try {
        const res = await api.get('/api/cms');
        setCmsData(res.data);
      } catch (err) {
        console.error("Gagal load data matrix CMS Contact:", err);
      }
    };

    fetchCmsData();
    return () => clearTimeout(timer);
  }, []);

  const handleMarketplaceClick = async (platform) => {
    try {
      await api.post('/api/track-click', null, { 
        params: { product_id: "OFFICIAL_STORE", platform: platform } 
      });
    } catch (err) {
      console.error("Tracking failed");
    }
  };

  // 🎯 SINKRONISASI PENANDA PENAMAAN FIELD CMS DARI MONGO UNTUK HALAMAN HUBUNG KAMI
  const shopeeUrl = cmsData?.shopee_url || "https://id.shp.ee/xW8uH6S4";
  const tiktokUrl = cmsData?.tiktok_url || "https://vt.tiktok.com/ZSQ8X4LsV/?page=Mall";
  const brandMessage = cmsData?.hero_subtitle || "BUILT FOR YOUR HANGOUT. WE ARE HERE TO CONNECT AND EXPAND THE CIRCLE.";

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <div className="relative min-h-screen w-full bg-white text-gray-900 overflow-x-hidden antialiased font-['Inter']">
        <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: `url(${churchTexture})`, backgroundSize: '300px' }}
        />

        <Navigation />

        {/* =========================================================
            1. HERO SECTION - EDITORIAL STYLE OVERLAY
        ========================================================= */}
        <section className="relative h-screen bg-navy overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div className="text-white text-[22vw] font-black select-none opacity-[0.02] tracking-tighter uppercase">CONTACT</div>
          </div>
          
          <div className="absolute w-[80vh] h-[80vh] border border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[50vh] h-[50vh] border border-white/[0.05] rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          
          <div className={`relative z-10 text-center px-6 transition-all duration-[1500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h1 className="text-6xl md:text-[8rem] font-black text-white leading-none tracking-tighter uppercase">
              GET IN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">THE CIRCLE.</span>
            </h1>
            <p className="text-slate-400 tracking-[0.5em] uppercase text-[10px] mt-10">
              Let's talk about style, community, and the next drop.
            </p>
          </div>
        </section>

        {/* =========================================================
            2. BRAND MESSAGE SECTION
        ========================================================= */}
        <section className="py-32 md:py-40 bg-white border-t border-gray-100/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-2xl md:text-4xl font-light leading-tight text-gray-800 italic">
              "{brandMessage}"
            </p>
          </div>
        </section>

        {/* =========================================================
            3. OFFICIAL BUYING GATEWAYS
        ========================================================= */}
        <section className="py-32 bg-gray-50/70">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy text-center mb-20">Official Online Store</h2>
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Shopee Gateway */}
              <a href={shopeeUrl} target="_blank" rel="noopener noreferrer" 
                onClick={() => handleMarketplaceClick('shopee')}
                className="group p-12 bg-white border border-gray-200/70 rounded-[2.5rem] hover:border-navy hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center text-center">
                <img src={SHOPEE_LOGO} className="h-20 object-contain mb-6 group-hover:scale-105 transition-transform duration-500" alt="Shopee KALREN" />
                <h3 className="text-3xl font-black uppercase text-navy tracking-tight">Shopee</h3>
                <p className="mt-4 text-sm text-gray-500 max-w-sm leading-relaxed">Official store KALREN untuk pengiriman cepat ke seluruh Indonesia.</p>
              </a>

              {/* TikTok Gateway */}
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => handleMarketplaceClick('tiktok')}
                className="group p-12 bg-white border border-gray-200/70 rounded-[2.5rem] hover:border-navy hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center text-center">
                <img src={TIKTOK_SHOP_LOGO} className="h-20 object-contain mb-6 group-hover:scale-105 transition-transform duration-500" alt="TikTok KALREN" />
                <h3 className="text-3xl font-black uppercase text-navy tracking-tight">TikTok Shop</h3>
                <p className="mt-4 text-sm text-gray-500 max-w-sm leading-relaxed">Temukan drop artikel t-shirt terbatas melalui sesi live stream kami.</p>
              </a>

            </div>
          </div>
        </section>

        {/* =========================================================
            4. SOCIAL CORE DIRECTORY
        ========================================================= */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-8">Follow Our Registry</h3>
            <div className="flex justify-center gap-12 items-center">
              <a href="https://www.instagram.com/kalrenclothing/" target="_blank" rel="noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                <img src={INSTAGRAM_LOGO} className="h-7 w-auto object-contain" alt="Instagram" />
              </a>
              <a href="https://www.tiktok.com/@kalrenclothing?_r=1&_t=ZS-96xkYO34O8q" target="_blank" rel="noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                <img src={TIKTOK_LOGO} className="h-7 w-auto object-contain" alt="TikTok" />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Contact;