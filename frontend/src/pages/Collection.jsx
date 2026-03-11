import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurImage } from '@/components/ui/BlurImage';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import churchTexture from '@/assets/textures/church.png';

const categoriesList = ['SEMUA', ...new Set(products.map(p => p.category.toUpperCase()))];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');

  useEffect(() => {
    const cat = searchParams.get('category')?.toUpperCase();
    setSelectedCategory(categoriesList.includes(cat) ? cat : 'SEMUA');
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams(category === 'SEMUA' ? {} : { category });
  };

  const filteredProducts = selectedCategory === 'SEMUA' 
    ? products 
    : products.filter(p => p.category.toUpperCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-white font-body selection:bg-navy selection:text-white overflow-x-hidden">
      
      {/* 0. GLOBAL TEXTURE Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url(${churchTexture})`,
          backgroundSize: '250px',
        }}
      />

      <Navigation />

{/* 1. HERO SECTION */}
<section className="relative h-screen bg-navy flex items-center justify-center overflow-hidden">
  {/* Decorative Background Circles */}
  <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      <div className="w-[120vh] h-[120vh] border border-white/[0.03] rounded-full absolute" />
      <div className="w-[80vh] h-[80vh] border border-white/[0.05] rounded-full absolute" />
      <div className="text-white text-[20vw] font-black opacity-[0.02] tracking-tighter absolute uppercase">
        {/* Sesuaikan teks background-nya: LINEUP atau ABOUT */}
        LINEUP 
      </div>
  </div>

  {/* Main Content Wrapper - Fokus di Tengah */}
  <div className="relative z-10 text-center px-6">
      <motion.h1 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase"
      >
        {/* Ganti teks sesuai halaman */}
        THE <br /> LINEUP
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[10px] md:text-xs text-blue-400 uppercase tracking-[1em] mt-12 font-black"
      >
        {/* Teks Subtitle */}
        {selectedCategory} — {filteredProducts.length} PIECES AVAILABLE
      </motion.p>
  </div>

  {/* Scroll Indicator - SEKARANG DI LUAR WRAPPER TEKS */}
  <div className="absolute bottom-12 left-0 w-full z-20 flex flex-col items-center gap-3 pointer-events-none">
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="text-[8px] text-white/30 uppercase tracking-[0.5em] font-bold"
    >
      Scroll Down
    </motion.span>
    <motion.div 
      initial={{ height: 0 }}
      animate={{ height: 48 }}
      transition={{ delay: 1.2, duration: 1 }}
      className="w-[1px] bg-gradient-to-b from-blue-500/50 to-transparent" 
    />
  </div>
</section>

      {/* 2. FILTER CATEGORY - Sticky & Minimalist */}
      <section className="py-10 border-b border-gray-100 sticky top-[80px] bg-white/80 backdrop-blur-xl z-20">
        <div className="flex justify-center flex-wrap gap-8 md:gap-14 uppercase tracking-[0.4em] text-[10px] font-black">
          {categoriesList.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative pb-3 transition-all duration-500 ${
                selectedCategory === category ? 'text-navy scale-110' : 'text-gray-300 hover:text-navy'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <motion.span 
                  layoutId="underline_collection"
                  className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 bg-navy rounded-full" 
                />
              )}
            </button>
          ))}
        </div>
      </section>

{/* 3. PRODUCTS GRID */}
<section className="py-32 bg-gray-50/50">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div 
      key={selectedCategory} 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 items-stretch" // Tambahin items-stretch
    >
      <AnimatePresence mode="popLayout">
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id} 
            className="h-full" // Paksa wrapper motion punya tinggi penuh
          >
            <Link to={`/product/${product.slug}`} className="group block h-full">
              <div className="flex flex-col h-full relative rounded-[2rem] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 transition-all duration-500 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] group-hover:-translate-y-4">
                
                {/* 1. Gambar - Fixed Aspect Ratio */}
                <div className="aspect-square overflow-hidden relative bg-slate-100 flex-shrink-0">
                  <BlurImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* 2. Info - Flex Grow biar rata bawah */}
                <div className="p-10 text-center flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[10px] text-blue-500 uppercase tracking-[0.4em] mb-3 block font-black">
                      {product.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight mb-6 min-h-[3.5rem] flex items-center justify-center">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Interactive Explore Line - Bakal selalu nempel di paling bawah info */}
                  <div className="flex items-center justify-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500 mt-auto">
                      <div className="h-[1.5px] w-6 bg-navy/20 group-hover:w-10 group-hover:bg-navy transition-all duration-700" />
                      <span className="text-[10px] font-black text-navy tracking-[0.3em] uppercase">
                          Details
                      </span>
                      <div className="h-[1.5px] w-6 bg-navy/20 group-hover:w-10 group-hover:bg-navy transition-all duration-700" />
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default Collection;