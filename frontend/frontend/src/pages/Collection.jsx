import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';

export const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');

  const categories = [
    'SEMUA',
    ...new Set(products.map(p => p.category.toUpperCase()))
  ];

  // 🔥 AUTO FILTER DARI URL
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');

    if (categoryFromUrl) {
      const normalized = categoryFromUrl.toUpperCase();

      if (categories.includes(normalized)) {
        setSelectedCategory(normalized);
      } else {
        setSelectedCategory('SEMUA');
      }
    } else {
      setSelectedCategory('SEMUA');
    }
  }, [searchParams, categories]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === 'SEMUA') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredProducts =
    selectedCategory === 'SEMUA'
      ? products
      : products.filter(
          p => p.category.toUpperCase() === selectedCategory
        );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="bg-navy py-32 mt-20 text-center">
        <h1 className="text-6xl font-bold text-white">THE LINEUP</h1>
      </section>

      {/* FILTER */}
      <section className="py-12 border-b border-gray-200">
        <div className="flex justify-center gap-10 uppercase tracking-widest">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative pb-2 ${
                selectedCategory === category
                  ? 'text-navy font-semibold'
                  : 'text-gray-500 hover:text-navy'
              }`}
            >
              {category}

              {selectedCategory === category && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-navy" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="border rounded-3xl overflow-hidden hover:shadow-2xl transition">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-semibold mt-2">
                    {product.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collection;