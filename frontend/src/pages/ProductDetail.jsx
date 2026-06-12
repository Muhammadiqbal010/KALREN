import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShareModal } from "@/components/ShareModal";

import api from "../api/axios";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlurImage } from "@/components/ui/BlurImage";
import { Button } from "@/components/ui/button";
import churchTexture from "@/assets/textures/church.png";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [hoverSide, setHoverSide] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/admin/detail-by-slug/${slug}`);
        setProduct(res.data);
        setActiveImage(0);

        const allRes = await api.get("/api/admin/public/list");
        const recommendations =
          allRes.data
            ?.filter((item) => item.slug !== slug)
            ?.sort(() => Math.random() - 0.5)
            ?.slice(0, 6) || [];

        setSuggestedProducts(recommendations);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleTrackClick = async (platform) => {
    try {
      if (product) {
        await api.post(`/api/track-click/${product._id}`, null, {
          params: { platform },
        });
      }
    } catch (err) {
      console.error("Gagal tracking:", err);
    }
  };

const handleShare = async () => {
  const shareData = {
    title: product.name,
    text: `Cek produk keren dari KALREN: ${product.name}`,
    url: window.location.href,
  };

  try {
    // 1. Coba Native Share API
    if (navigator.share) {
      await navigator.share(shareData);
    } 
    // 2. Coba Clipboard API dengan pengecekan safety
    else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link produk berhasil disalin!");
    } 
    // 3. Fallback manual (kalau keduanya gak jalan)
    else {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert("Link produk berhasil disalin!");
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error("Gagal share:", err);
    }
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-40">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-[500px] bg-gray-200 rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="font-black text-2xl uppercase">Product Not Found</h1>
      </div>
    );
  }

  const images = product.image_urls || [];
  const shopeeUrl = product.links?.shopee;
  const tiktokUrl = product.links?.tiktok;

  return (
    <>
      <Helmet>
  {/* Basic Meta */}
  <title>{product.name} | KALREN</title>
  <meta name="description" content={product.description.substring(0, 150)} />

  {/* Open Graph (Facebook, WhatsApp, Telegram, LinkedIn, Discord) */}
  <meta property="og:title" content={product.name} />
  <meta property="og:description" content="Pakaian streetwear premium untuk gaya lo." />
  <meta property="og:image" content={product.image_urls[0]} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content={window.location.href} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="KALREN" />

  {/* Twitter / X Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={product.name} />
  <meta name="twitter:description" content="Pakaian streetwear premium untuk gaya lo." />
  <meta name="twitter:image" content={product.image_urls[0]} />
  
  {/* Meta tag tambahan biar gak kena cache terus */}
  <meta http-equiv="Cache-Control" content="max-age=3600" />
</Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white overflow-x-hidden"
      >
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]"
          style={{ backgroundImage: `url(${churchTexture})`, backgroundSize: "250px" }}
        />
        <Navigation />

        {/* HEADER */}
        <section className="bg-navy pt-32 md:pt-40 pb-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
            <Link
              to="/collection"
              className="inline-flex mb-8 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white transition"
            >
              ← Back to Collection
            </Link>
            <div className="border-b border-white/10 pb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-none tracking-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-xs sm:text-sm tracking-[0.4em] uppercase font-bold text-blue-400">
                {product.series}
              </p>
            </div>
          </div>
        </section>

        {/* DETAIL */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">

              {/* GALLERY */}
              <div className="space-y-4">
                <div
                  className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoverSide(e.clientX - rect.left < rect.width / 2 ? "left" : "right");
                  }}
                  onMouseLeave={() => setHoverSide(null)}
                  onTouchStart={(e) => {
                    if (images.length === 0) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    setActiveImage((prev) =>
                      x < rect.width / 2
                        ? prev === 0 ? images.length - 1 : prev - 1
                        : prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  {/* Gambar utama — HANYA SATU */}
                  {images.length > 0 && (
                    <BlurImage
                      src={images[activeImage]}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Tombol navigasi kiri/kanan */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                        }
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center z-20 transition-all ${
                          hoverSide === "left" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18L9 12L15 6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                        }
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center z-20 transition-all ${
                          hoverSide === "right" ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18L15 12L9 6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail — HANYA SATU, di dalam kolom gallery */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-xl border transition-all ${
                        activeImage === index
                          ? "border-navy ring-2 ring-navy/20"
                          : "border-gray-200"
                      }`}
                    >
                      <img src={img} alt="" className="aspect-square object-cover w-full" />
                    </button>
                  ))}
                </div>
              </div>

              {/* INFO */}
              <div className="space-y-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500 font-black mb-4">
                    Description
                  </p>
                  <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border-l-[6px] border-navy">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {product.description || ""}
                    </ReactMarkdown>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-4 font-black">
                    Available Sizes
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.available_sizes?.map((size) => (
                      <div
                        key={size}
                        className="w-12 h-12 rounded-xl border-2 border-navy flex items-center justify-center font-black text-navy"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
  {shopeeUrl && (
    <Button asChild className="flex-1 h-14 bg-navy text-white rounded-xl font-black shadow-lg hover:shadow-xl transition-all">
      <a href={shopeeUrl} target="_blank" rel="noreferrer" onClick={() => handleTrackClick("shopee")}>Order via Shopee</a>
    </Button>
  )}
  {tiktokUrl && (
    <Button asChild variant="outline" className="flex-1 h-14 rounded-xl border-2 border-navy text-navy font-black hover:bg-navy hover:text-white transition-all">
      <a href={tiktokUrl} target="_blank" rel="noreferrer" onClick={() => handleTrackClick("tiktok")}>Order via TikTok</a>
    </Button>
  )}
  
  {/* Tombol Share Baru (Hitam Bold biar kontras) */}
  <Button 
  onClick={() => setIsShareOpen(true)}
  className="h-14 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800"
>
  SHARE PRODUK
</Button>
</div>
              </div>

            </div>
          </div>
        </section>

        {/* REKOMENDASI */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-navy mb-10">
              Explore More
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {suggestedProducts.map((item) => (
                // ✅ Pakai item.slug — BUKAN item._id
                <Link
                  key={item.slug}
                  to={`/product/${item.slug}`}
                  className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 hover:shadow-xl transition"
                >
                  <div className="aspect-[4/5]">
                    <img src={item.image_urls?.[0]} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase text-gray-400 mb-2">{item.series}</p>
                    <h3 className="font-black text-navy uppercase">{item.name}</h3>
                    <p className="mt-3 font-bold text-navy">
                      IDR {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        
        <ShareModal 
  isOpen={isShareOpen} 
  onClose={() => setIsShareOpen(false)} 
  product={product} 
/>
      </motion.div>
    </>
  );
}