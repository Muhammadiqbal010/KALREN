import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BlurImage } from '@/components/ui/BlurImage';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import churchTexture from '@/assets/textures/church.png';

export const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    setSelectedImage(0);
    window.scrollTo(0, 0);

    if (product) {
      const shuffled = [...products]
        .filter(p => p.slug !== product.slug)
        .sort(() => Math.random() - 0.5)   
        .slice(0, 3);                      
      
      setSuggestedProducts(shuffled);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-body">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-6 text-navy tracking-tighter uppercase italic">Piece Not Found</h2>
          <Link to="/collection" className="px-8 py-3 bg-navy text-white text-xs font-black tracking-widest uppercase rounded-full hover:bg-blue-600 transition-all">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      key={slug} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white font-body selection:bg-navy selection:text-white overflow-x-hidden"
    >
      <Helmet>
        <title>{product.name} | KALREN</title>
        <meta name="description" content={product.story} />
      </Helmet>

      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url(${churchTexture})`, backgroundSize: '250px' }}
      />

      <Navigation />

      {/* 1. MINIMAL HERO */}
      <section className="bg-navy pt-32 pb-12 mt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <Link
              to="/collection"
              className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 inline-flex items-center gap-2 group w-fit"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              Back to Collection
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                  {product.name}
                </h1>
                <p className="text-[20px] text-blue-400 uppercase tracking-[0.5em] font-bold mt-2">
                  {product.category} — 2026 Edition
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT CONTENT */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            
            {/* Left: Gallery with Smart Arrows */}
            <div className="space-y-8">
              <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <BlurImage
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Smart Navigation - Area Kiri */}
                <div 
                  className="absolute left-0 top-0 w-1/2 h-full z-20 flex items-center justify-start pl-8 cursor-pointer group/left"
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="bg-navy/80 backdrop-blur-md p-4 rounded-full text-white shadow-xl border border-white/10"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </motion.div>
                </div>

                {/* Smart Navigation - Area Kanan */}
                <div 
                  className="absolute right-0 top-0 w-1/2 h-full z-20 flex items-center justify-end pr-8 cursor-pointer group/right"
                  onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="bg-navy/80 backdrop-blur-md p-4 rounded-full text-white shadow-xl border border-white/10"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-navy scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <BlurImage src={image} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-[20px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-4">The Story</h3>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal italic bg-slate-50 p-6 rounded-2xl border-l-4 border-navy">
                  "{product.story}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h3 className="text-[20px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-2">Material</h3>
                  <p className="text-sm font-semibold text-navy uppercase">{product.material}</p>
                </div>
                <div>
                  <h3 className="text-[20px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="px-3 py-1 bg-slate-100 text-navy text-[10px] font-bold rounded-md border border-slate-200">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Care Instructions Removed per request */}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild className="flex-1 h-14 bg-navy text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                  <a href={product.links?.shopee} target="_blank" rel="noreferrer">Order via Shopee</a>
                </Button>
                <Button asChild className="flex-1 h-14 bg-white text-navy border-2 border-navy text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-slate-50 transition-all">
                  <a href={product.links?.tiktok} target="_blank" rel="noreferrer">Order via TikTok</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SUGGESTED PRODUCTS */}
{/* 3. SUGGESTED PRODUCTS - Updated: No Zoom Effect */}
<section className="py-24 bg-gray-50/50">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">
    <div className="flex justify-between items-end mb-16 px-2">
      <div>
        <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black mb-2 block">DISCOVER MORE</span>
        <h2 className="text-4xl font-black text-navy uppercase tracking-tighter italic">THE ARCHIVE</h2>
      </div>
      <Link 
        to="/collection" 
        className="text-[10px] font-black text-navy uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all border-b-2 border-navy pb-1 italic"
      >
        ALL PIECES →
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {suggestedProducts.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={`/product/${item.slug}`} className="group block h-full">
            {/* Card Pop Up Effect (Translate & Shadow Only) */}
            <div className="h-full bg-white rounded-[2rem] overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] group-hover:-translate-y-3">
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {/* Image: scale-105 removed to stop zooming */}
                <BlurImage 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8 text-center">
                <p className="text-[9px] text-blue-500 uppercase tracking-[0.3em] font-black mb-2">{item.category}</p>
                <h3 className="text-xl font-black text-navy uppercase tracking-tight">{item.name}</h3>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <Footer />
    </motion.div>
  );
};

export default ProductDetail;