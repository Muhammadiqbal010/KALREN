import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import churchTexture from '@/assets/textures/church.png';

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600); // mirip home, sedikit lebih lambat aja
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden antialiased">
      {/* Global texture – disamakan dengan Home */}
      <div
        className="fixed inset-0 pointer-events-none z-[-2]"
        style={{
          backgroundImage: `url(${churchTexture})`,
          opacity: 0.05,
          backgroundSize: '1400px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply',
          backgroundAttachment: 'fixed',
          filter: 'blur(1.5px) grayscale(40%)',
        }}
      />

      <Navigation />

      {/* Hero – hampir identik struktur & scale dengan Home */}
      <section
        className="
          relative min-h-screen 
          flex flex-col items-center justify-center 
          bg-navy overflow-hidden
          pt-20 sm:pt-24 md:pt-28 lg:pt-32
        "
      >
        {/* Radial glow – disesuaikan mirip Home */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Texture hero – hampir sama */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${churchTexture})`,
            opacity: 0.055,
            backgroundSize: '1600px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply',
            filter: 'blur(2.2px)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-16 text-center z-10 w-full">
          <div
            className={`transition-all duration-[2200ms] ease-out transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <h1 className="
              text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
              font-black leading-[1.05] tracking-[-0.035em] uppercase text-white
            ">
              KALREN.
              <br className="hidden sm:block" />
              BUILT FOR YOUR CIRCLE.
            </h1>

            <p className="
              mt-6 md:mt-7 lg:mt-8 
              text-lg sm:text-xl md:text-2xl 
              font-light tracking-[0.20em] uppercase text-slate-300/90
            ">
              COMFORT. QUALITY. CHARACTER.
            </p>
          </div>
        </div>
      </section>

      {/* Kisah Kami – disederhanakan typography & spacing mirip section Home */}
      <section className="py-32 md:py-40 lg:py-48 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-navy">
              Kisah Kami
            </h2>
            <div className="mt-8 h-1 w-24 bg-navy mx-auto rounded-full" />
          </div>

          <div className="space-y-8 md:space-y-10 text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-light">
            <p>
              Kalren lahir dari kebiasaan sederhana: nongkrong, ngobrol, dan pengen tampil beda tanpa harus ribet. Kita lihat banyak brand cuma kejar tren. Cepat naik, cepat hilang.
            </p>
            <p>
              Kalren beda. Kita fokus ke kenyamanan, detail, dan desain yang punya karakter. Bukan cuma buat dipakai foto. Tapi dipakai hidup.
            </p>
          </div>
        </div>
      </section>

      {/* Filosofi – card style mirip philosophy di Home */}
      <section className="py-32 md:py-40 lg:py-48 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-navy">
              Filosofi Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {[
              {
                title: 'Comfort First',
                desc: 'Streetwear harus enak dipakai seharian. Nongkrong lama? Tetap adem.',
              },
              {
                title: 'Detail Matters',
                desc: 'Sablon raster premium, jahitan rapi, finishing proper. Detail kecil tetap kita jaga.',
              },
              {
                title: 'Built For Circle',
                desc: 'Kalren dibuat buat nemenin momen bareng. Dari sore sampai malam.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="
                  p-8 md:p-10 lg:p-12 
                  bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl 
                  hover:border-navy/50 hover:shadow-xl transition-all duration-500 group
                "
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-navy group-hover:text-navy-dark">
                  {item.title}
                </h3>
                <p className="mt-5 md:mt-6 text-gray-600 leading-relaxed group-hover:text-gray-800">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi – layout & typography disesuaikan */}
      <section className="py-32 md:py-40 lg:py-48 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-navy mb-8">
                Visi Kami
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Menjadi brand streetwear lokal yang dikenal karena kenyamanan, karakter desain, dan kedekatannya dengan culture anak muda.
              </p>
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-navy mb-8">
                Misi Kami
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Menghadirkan streetwear berkualitas dengan harga yang tetap masuk akal.
Menjaga detail produksi.
Membangun komunitas yang tumbuh bareng Kalren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Penutup – lebih sederhana & mirip brand statement di Home */}
      <section className="py-40 lg:py-48 bg-navy text-white/95">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <p className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Bukan Ikut Tren.<br className="hidden sm:block" />
            <span className="font-semibold">Bikin Gaya Sendiri.</span>
          </p>
        </div>
      </section>

      <div className="bg-navy text-white/90">
        <Footer />
      </div>
    </div>
  );
};

export default About;