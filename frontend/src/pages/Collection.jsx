import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurImage } from '@/components/ui/BlurImage';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';

const categoriesList = ['SEMUA', ...new Set(products.map(p => p.category.toUpperCase()))];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
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
    <div className="min-h-screen bg-white font-body selection:bg-navy selection:text-white">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-navy py-32 mt-20 text-center overflow-hidden">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-8xl font-heading font-bold text-white tracking-tightest"
        >
          THE LINEUP
        </motion.h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-luxury mt-4 font-bold">
          {selectedCategory} / {filteredProducts.length} PIECES
        </p>
      </section>

      {/* FILTER CATEGORY - Font Balik ke Awal & Tanpa Magnetic */}
      <section className="py-12 border-b border-gray-200 sticky top-[80px] bg-white z-20">
        <div className="flex justify-center gap-6 md:gap-10 uppercase tracking-luxury text-[10px] md:text-xs font-bold">
          {categoriesList.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative pb-2 transition-colors duration-300 ${
                selectedCategory === category ? 'text-navy' : 'text-gray-400 hover:text-navy'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <motion.span 
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-[2px] bg-navy" 
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            key={selectedCategory} 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  layout 
                >
                  <Link to={`/product/${product.slug}`} className="group block">
                    <div className="rounded-[2rem] overflow-hidden bg-muted shadow-soft hover-lift transition-all duration-500 border border-transparent hover:border-gray-100">
                      {/* Ratio Balik 1:1 (Aspect Square) */}
                      <div className="aspect-square overflow-hidden relative">
                        <BlurImage
                          src={product.images[0]}
                          alt={product.name}
                          className="group-hover:scale-110 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="p-8 bg-white text-center sm:text-left">
                        <p className="text-[10px] text-gray-400 uppercase tracking-luxury mb-2 font-bold">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-heading font-bold text-navy group-hover:text-primary transition-colors uppercase">
                          {product.name}
                        </h3>
                        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold text-gray-500 tracking-luxury group-hover:text-navy transition-colors">
                          EXPLORE PIECE <span>→</span>
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