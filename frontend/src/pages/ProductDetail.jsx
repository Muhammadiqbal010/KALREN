import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';

export const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setSelectedImage(0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Product not found</h2>
          <Link to="/collection" className="text-primary hover:underline">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Product Name */}
      <section className="bg-navy py-20 lg:py-24 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-6">
            <Link
              to="/collection"
              className="text-white/70 hover:text-white text-sm transition-colors duration-300"
            >
              ← Back to Collection
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {product.name}
          </h1>
          <p className="text-xl text-white/70 mt-4">{product.category}</p>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted shadow-soft">
                {!imageLoaded && (
                  <div className="w-full h-full bg-muted animate-pulse" />
                )}
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setImageLoaded(false);
                      setSelectedImage(index);
                    }}
                    className={`aspect-square rounded-2xl overflow-hidden bg-muted border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-navy shadow-soft'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8">
              {/* Product Story */}
              <div>
                <h2 className="text-3xl font-semibold mb-4 text-foreground">
                  The Story
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.story}
                </p>
              </div>

              {/* Material */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Material
                </h3>
                <p className="text-base text-muted-foreground">
                  {product.material}
                </p>
              </div>

              {/* Size Chart */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <div
                      key={size}
                      className="px-6 py-3 bg-muted rounded-xl text-foreground font-medium"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Instructions */}
              <div className="bg-section-bg p-6 rounded-3xl">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Care Instructions
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Machine wash cold, gentle cycle</li>
                  <li>• Tumble dry low or hang to dry</li>
                  <li>• Iron on low heat if needed</li>
                  <li>• Do not bleach</li>
                </ul>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
  <h3 className="text-xl font-semibold text-foreground">
    Available At
  </h3>

  <div className="flex flex-col sm:flex-row gap-4">
    {product.links?.shopee && (
      <Button
        asChild
        className="flex-1 h-14 text-base bg-navy text-white hover:bg-navy/90 rounded-2xl"
      >
        <a
          href={product.links.shopee}
          target="_blank"
          rel="noopener noreferrer"
        >
          Shop on Shopee
        </a>
      </Button>
    )}

    {product.links?.tiktok && (
      <Button
        asChild
        className="flex-1 h-14 text-base bg-navy text-white hover:bg-navy/90 rounded-2xl"
      >
        <a
          href={product.links.tiktok}
          target="_blank"
          rel="noopener noreferrer"
        >
          Shop on TikTok
        </a>
      </Button>
    )}
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* More from Collection */}
      <section className="py-16 lg:py-24 bg-section-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-semibold mb-12 text-foreground">
            More from the Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group block"
                >
                  <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover-lift">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover hover-zoom"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.category}
                      </p>
                      <h3 className="text-xl font-semibold text-foreground">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
