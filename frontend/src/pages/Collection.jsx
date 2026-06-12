import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

// Komponen Skeleton untuk transisi yang elegan
const ProductSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 md:gap-20">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-[4/5] rounded-[1.2rem] md:rounded-[2.2rem] bg-neutral-200 mb-6" />
        <div className="h-4 w-1/3 bg-neutral-200 rounded mx-auto mb-3" />
        <div className="h-6 w-3/4 bg-neutral-200 rounded mx-auto" />
      </div>
    ))}
  </div>
);

export const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['SEMUA']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category = searchParams.get('category') || 'SEMUA';
        const search = searchParams.get('search') || '';

        const res = await api.get('/api/admin/public/list');
        const allProducts = res.data || [];

        const activeProductsOnly = allProducts.filter((item) => item.is_active !== false);
        const uniqueCategories = [
          'SEMUA',
          ...new Set(activeProductsOnly.map((item) => item.series?.toUpperCase()).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        let filteredResult = [...activeProductsOnly];

        if (category !== 'SEMUA') {
          filteredResult = filteredResult.filter(
            (item) => item.series?.toUpperCase() === category.toUpperCase()
          );
        }

        if (search) {
          filteredResult = filteredResult.filter((item) =>
            item.name?.toLowerCase().includes(search.toLowerCase())
          );
        }

        setProducts(filteredResult);
      } catch (err) {
        console.error('Gagal memuat katalog produk:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    const currentSearch = searchParams.get('search');
    const params = category === 'SEMUA' ? {} : { category };
    if (currentSearch) params.search = currentSearch;
    setSearchParams(params);
  };

  const selectedCategory = searchParams.get('category')?.toUpperCase() || 'SEMUA';

  return (
    <div className="min-h-screen bg-navy text-white font-['Inter'] antialiased">
      <Navigation />
      
      <section className="relative h-[60vh] md:h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-[12vw] md:text-[9rem] font-black uppercase tracking-tighter text-white leading-none">
          THE LINEUP
        </h1>
        <p className="text-slate-400 text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase mt-4">
          {products.length} Pieces In Archive
        </p>
      </section>

      <section className="sticky top-[64px] md:top-[80px] z-30 bg-white border-b border-gray-200 py-4 md:py-8 overflow-x-auto no-scrollbar">
        <div className="flex justify-center items-center gap-6 md:gap-12 px-6 mx-auto w-full max-w-7xl">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => handleCategoryChange(cat)} 
              className={`uppercase text-[10px] font-black tracking-[0.25em] md:tracking-[0.4em] transition-colors duration-300 whitespace-nowrap ${
                selectedCategory === cat ? 'text-black font-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 md:py-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          {loading ? (
            <ProductSkeleton />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 md:gap-20"
            >
              {products.map((product) => {
                const hasDiscount = product.is_discount === true && product.compare_price > product.price;
                const cover = product.image_urls?.[0] || "https://res.cloudinary.com/ddxplesul/image/upload/v1778695884/placeholder.jpg";

                return (
                  <Link key={product.slug} to={`/product/${product.slug}`} className="group block">
                    <div className="rounded-[1.2rem] md:rounded-[2.2rem] bg-neutral-50 overflow-hidden relative shadow-xs">
                      {hasDiscount && (
                        <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10 bg-red-600 text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 md:px-4 md:py-1.5 rounded-full shadow-md">
                          Sale
                        </div>
                      )}
                      <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
                        <img 
                          src={cover} 
                          alt={product.name} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <div className="p-3 md:p-8 text-center text-neutral-900">
                        <p className="text-[8px] md:text-[9px] font-bold tracking-[0.25em] md:tracking-[0.35em] text-neutral-400 uppercase mb-1 md:mb-2">
                          {product.series}
                        </p>
                        <h3 className="text-xs md:text-xl font-black uppercase mb-2 md:mb-4 h-10 md:h-14 flex items-center justify-center line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex flex-col items-center justify-center min-h-[36px] md:min-h-[52px]">
                          {hasDiscount ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] md:text-[12px] text-red-500 font-bold line-through tracking-wider opacity-70">
                                IDR {Number(product.compare_price).toLocaleString('id-ID')}
                              </span>
                              <span className="text-sm md:text-lg font-black font-mono text-black">
                                IDR {Number(product.price).toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm md:text-lg font-black font-mono text-neutral-900">
                              IDR {Number(product.price).toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Collection;