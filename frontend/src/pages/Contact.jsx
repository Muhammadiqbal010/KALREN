import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

// Import semua logo
import SHOPEE_LOGO from '@/assets/logo/shopee-logo.png';
import TIKTOK_SHOP_LOGO from '@/assets/logo/tiktok-logo.png'; // atau tiktok-logo.png
import INSTAGRAM_LOGO from '@/assets/logo/instagram.png';
import TIKTOK_LOGO from '@/assets/logo/tiktok.png'; // untuk social section

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased">
      {/* Global texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[-2]"
        style={{
          backgroundImage: `url(${churchTexture})`,
          opacity: 0.05,
          backgroundSize: '1400px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply',
          backgroundAttachment: 'fixed',
          filter: 'blur(1.8px) grayscale(45%)',
        }}
      />

      <Navigation />

      {/* HERO */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center bg-navy overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${churchTexture})`,
            opacity: 0.06,
            backgroundSize: '1600px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply',
            filter: 'blur(2.5px)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-16 text-center z-10">
          <div
            className={`transition-[opacity,transform] duration-[2400ms] ease-out ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-16"
            }`}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.98] md:leading-[1.02] tracking-[-0.04em] uppercase text-white">
              LET’S TALK.
              <br className="hidden sm:block" />
              ABOUT THE DETAILS.
            </h1>

            <p className="mt-8 md:mt-10 text-lg sm:text-xl md:text-2xl lg:text-2xl font-light tracking-[0.20em] uppercase text-slate-200/85">
              Tanya stok. Bahas size. Atau sekadar ngobrol soal style.
            </p>
          </div>
        </div>
      </section>

      {/* BRAND MESSAGE */}
      <section className="py-32 md:py-40 lg:py-48 bg-white border-t border-gray-100/50">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-gray-800">
  Kami membangun dengan ritme yang kami percaya.
</p>

<p className="mt-8 md:mt-10 text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
  Bukan produksi cepat. Bukan kompromi bahan.
  Setiap piece melalui proses yang sama disiplin, presisi, dan kontrol kualitas.
</p>

<p className="mt-6 text-lg md:text-xl text-gray-500 leading-relaxed">
  Website ini hadir untuk memperkenalkan nilai dan pendekatan kami.
  Seluruh transaksi dilakukan melalui official online store.
</p>
        </div>
      </section>

      {/* WHERE TO BUY – pakai import logo */}
      <section className="py-32 md:py-40 lg:py-48 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] uppercase text-navy text-center mb-16 md:mb-20">
            Official Online Store
          </h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                platform: 'Shopee',
                desc: 'Platform resmi untuk transaksi terverifikasi dan pengiriman terintegrasi.',
                url: 'https://id.shp.ee/ck2XBp1L', // update kalau ada link spesifik
                logo: SHOPEE_LOGO,
              },
              {
                platform: 'TikTok Shop',
                desc: 'Akses langsung melalui konten, live session, dan drop terbaru.',
                url: ' https://vt.tiktok.com/ZSmv4mcrG/?page=Mall', // update kalau ada
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

      {/* SOCIAL – full gambar mengisi circle */}
<section className="py-24 md:py-32 bg-white border-t border-gray-100/50">
  <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 text-center">
    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10">
      Ikuti perkembangan drop terbaru dan<br className="hidden sm:block" />
      dokumentasi proses produksi melalui kanal resmi berikut.
    </p>

    <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-24">
      {[
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/kalrenclothing',
          logo: INSTAGRAM_LOGO,  // sudah di-import
        },
        {
          name: 'TikTok',
          url: 'https://www.tiktok.com/@kalrenclothing',
          logo: TIKTOK_LOGO,  // sudah di-import
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
              className="w-full h-full object-cover"  // <-- KUNCI: object-cover + full size
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
            Setiap produk KALREN dibuat dengan kontrol penuh.<br />
            <span className="font-semibold tracking-[-0.015em]">Itu standar kami.</span>
          </p>
        </div>
      </section>

      <div className="bg-navy text-white/90">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;