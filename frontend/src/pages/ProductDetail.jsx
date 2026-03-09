import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BlurImage } from '@/components/ui/BlurImage';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';

export const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    setSelectedImage(0);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4 text-navy">Product not found</h2>
          <Link to="/collection" className="text-primary hover:underline">
            Back to Collection
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
      className="min-h-screen bg-background"
    >
      <Helmet>
        <title>{product.name} | KALREN</title>
        <meta name="description" content={product.story} />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="bg-navy py-20 lg:py-24 mt-20 overflow-hidden">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 lg:px-12"
        >
          <div className="mb-6">
            <Link
              to="/collection"
              className="text-white/70 hover:text-white text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collection
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tighter">
            {product.name}
          </h1>
          <p className="text-xl text-white/70 mt-4 uppercase tracking-[0.3em] font-light">
            {product.category}
          </p>
        </motion.div>
      </section>

      {/* Product Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="group relative aspect-square rounded-[2rem] overflow-hidden bg-muted shadow-soft">
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
                      alt={`${product.name} - View ${selectedImage + 1}`}
                      className="w-full h-full"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div 
                  className="absolute left-0 top-0 w-1/4 h-full z-10 flex items-center justify-start pl-4 cursor-pointer"
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </motion.div>
                </div>

                <div 
                  className="absolute right-0 top-0 w-1/4 h-full z-10 flex items-center justify-end pr-4 cursor-pointer"
                  onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={index}
                    onClick={() => {
                      if (selectedImage !== index) {
                        setSelectedImage(index);
                      }
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden bg-muted border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-navy shadow-lg'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <BlurImage
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-semibold">
                  The Story
                </h2>
                <p className="text-xl text-foreground/90 leading-relaxed whitespace-pre-line font-light">
                  {product.story}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-bold mb-3">Material</h3>
                  <p className="text-muted-foreground">{product.material}</p>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-bold mb-3">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="px-4 py-1.5 bg-muted rounded-full text-sm font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50">
                <h3 className="text-sm uppercase tracking-widest font-bold mb-4">Care Instructions</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span>•</span> Machine wash cold</li>
                  <li className="flex items-center gap-2"><span>•</span> Tumble dry low</li>
                  <li className="flex items-center gap-2"><span>•</span> Iron on low heat</li>
                  <li className="flex items-center gap-2"><span>•</span> Do not bleach</li>
                </ul>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/50">
                <h3 className="text-sm uppercase tracking-widest font-bold">Secure Your Piece</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {product.links?.shopee && (
                    <Button asChild className="flex-1 h-16 text-lg bg-navy text-white hover:bg-navy/90 rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                      <a href={product.links.shopee} target="_blank" rel="noopener noreferrer">
                        Shop on Shopee
                      </a>
                    </Button>
                  )}
                  {product.links?.tiktok && (
                    <Button asChild className="flex-1 h-16 text-lg bg-white text-navy border-2 border-navy hover:bg-navy/5 rounded-2xl transition-all hover:-translate-y-1">
                      <a href={product.links.tiktok} target="_blank" rel="noopener noreferrer">
                        Shop on TikTok
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 lg:py-24 bg-section-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
              More from the Collection
            </h2>
            <Link 
              to="/collection" 
              className="text-navy font-medium hover:underline underline-offset-4 transition-all"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/product/${item.slug}`}
                  className="group block"
                >
                  <div className="bg-card rounded-3xl overflow-hidden shadow-soft transition-all duration-500">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <BlurImage
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground mb-2 uppercase tracking-widest font-light">
                        {item.category}
                      </p>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-navy transition-colors">
                        {item.name}
                      </h3>
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