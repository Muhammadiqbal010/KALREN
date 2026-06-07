import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import api from "../api/axios";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlurImage } from "@/components/ui/BlurImage";
import { Button } from "@/components/ui/button";

import churchTexture from "@/assets/textures/church.png";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [hoverSide, setHoverSide] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);

        const detailRes = await api.get(`/api/admin/detail/${id}`);

        setProduct(detailRes.data);
        setActiveImage(0);

        const allRes = await api.get("/api/admin/list");

        const recommendations =
          allRes.data
            ?.filter((item) => item._id !== id)
            ?.sort(() => Math.random() - 0.5)
            ?.slice(0, 6) || [];

        setSuggestedProducts(recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const recommendations = useMemo(() => {
    return suggestedProducts;
  }, [suggestedProducts]);

  const handleTrackClick = async (platform) => {
    try {
      await api.post(`/api/track-click/${id}`, null, {
        params: { platform },
      });
    } catch (err) {
      console.error(err);
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
        <h1 className="font-black text-2xl uppercase">
          Product Not Found
        </h1>
      </div>
    );
  }

  const images = product.image_urls || [];
  const shopeeUrl = product.links?.shopee;
  const tiktokUrl = product.links?.tiktok;

  return (
    <>
      <Helmet>
        <title>{product.name} | KALREN</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white overflow-x-hidden"
      >
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]"
          style={{
            backgroundImage: `url(${churchTexture})`,
            backgroundSize: "250px",
          }}
        />

        <Navigation />

        {/* HERO */}
        <section className="bg-navy pt-32 md:pt-40 pb-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">

            <Link
              to="/collection"
              className="inline-flex mb-8 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white transition"
            >
              ← Back to Collection
            </Link>

            <div className="border-b border-white/10 pb-10">
              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-black
                  uppercase
                  text-white
                  leading-none
                  tracking-tight
                "
              >
                {product.name}
              </h1>

              <p
                className="
                  mt-4
                  text-xs
                  sm:text-sm
                  tracking-[0.4em]
                  uppercase
                  font-bold
                  text-blue-400
                "
              >
                {product.series}
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCT */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">

            <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">

              {/* GALLERY */}

<div className="space-y-4">

  <div
  className="
    relative
    aspect-[4/5]
    rounded-[2rem]
    overflow-hidden
    bg-slate-100
  "
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    setHoverSide(
      x < rect.width / 2 ? "left" : "right"
    );
  }}
  onMouseLeave={() => setHoverSide(null)}
  onTouchStart={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;

    if (x < rect.width / 2) {
      setActiveImage((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setActiveImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  }}
>
    <BlurImage
      src={images[activeImage]}
      className="w-full h-full object-cover"
    />

    {/* PREVIOUS */}
    {images.length > 1 && (
      <button
        type="button"
        onClick={() =>
          setActiveImage((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          )
        }
        className={`
  absolute
  left-4
  top-1/2
  -translate-y-1/2
  w-11
  h-11
  rounded-full
  bg-white/80
  backdrop-blur-md
  border
  border-white/30
  shadow-lg
  flex
  items-center
  justify-center
  z-20
  transition-all
  duration-200

  ${
    hoverSide === "left"
      ? "opacity-100 scale-100"
      : "opacity-0 scale-90 pointer-events-none"
  }
`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 18L9 12L15 6"
          />
        </svg>
      </button>
    )}

    {/* NEXT */}
    {images.length > 1 && (
      <button
        type="button"
        onClick={() =>
          setActiveImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          )
        }
        className={`
  absolute
  right-4
  top-1/2
  -translate-y-1/2
  w-11
  h-11
  rounded-full
  bg-white/80
  backdrop-blur-md
  border
  border-white/30
  shadow-lg
  flex
  items-center
  justify-center
  z-20
  transition-all
  duration-200

  ${
    hoverSide === "right"
      ? "opacity-100 scale-100"
      : "opacity-0 scale-90 pointer-events-none"
  }
`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18L15 12L9 6"
          />
        </svg>
      </button>
    )}

    {/* COUNTER */}
    {images.length > 1 && (
      <div
        className="
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          px-3
          py-1
          rounded-full
          bg-black/60
          backdrop-blur-md
          text-white
          text-xs
          font-semibold
          z-20
        "
      >
        {activeImage + 1} / {images.length}
      </div>
    )}
  </div>

  <div
    className="
      grid
      grid-cols-4
      sm:grid-cols-5
      gap-3
    "
  >
    {images.map((img, index) => (
      <button
        key={index}
        onClick={() => setActiveImage(index)}
        className={`
          overflow-hidden
          rounded-xl
          border
          transition-all
          duration-300
          ${
            activeImage === index
              ? "border-navy ring-2 ring-navy/20"
              : "border-gray-200 hover:border-navy/40"
          }
        `}
      >
        <img
          src={img}
          alt=""
          className="aspect-square object-cover w-full"
        />
      </button>
    ))}
  </div>

</div>

              {/* INFO */}

              <div className="space-y-10">

                <div>
                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.3em]
                      text-blue-500
                      font-black
                      mb-4
                    "
                  >
                    Description
                  </p>

                  <div
                    className="
                      bg-slate-50
                      rounded-[2rem]
                      p-6
                      md:p-8
                      border-l-[6px]
                      border-navy
                    "
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {product.description || ""}
                    </ReactMarkdown>
                  </div>
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                      mb-4
                      font-black
                    "
                  >
                    Available Sizes
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {product.available_sizes?.map((size) => (
                      <div
                        key={size}
                        className="
                          w-12
                          h-12
                          rounded-xl
                          border-2
                          border-navy
                          flex
                          items-center
                          justify-center
                          font-black
                          text-navy
                        "
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-4
                  "
                >
                  {shopeeUrl && (
                    <Button
                      asChild
                      className="
                        flex-1
                        h-14
                        bg-navy
                        text-white
                        rounded-xl
                        font-black
                      "
                    >
                      <a
                        href={shopeeUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          handleTrackClick("shopee")
                        }
                      >
                        Order via Shopee
                      </a>
                    </Button>
                  )}

                  {tiktokUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="
                        flex-1
                        h-14
                        rounded-xl
                        border-2
                        border-navy
                        text-navy
                        font-black
                      "
                    >
                      <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          handleTrackClick("tiktok")
                        }
                      >
                        Order via TikTok
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}

        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                uppercase
                text-navy
                mb-10
              "
            >
              Explore More
            </h2>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >
              {recommendations.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="
                    bg-white
                    rounded-[1.5rem]
                    overflow-hidden
                    border
                    border-gray-100
                    hover:shadow-xl
                    transition
                  "
                >
                  <div className="aspect-[4/5]">
                    <img
                      src={item.image_urls?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase text-gray-400 mb-2">
                      {item.series}
                    </p>

                    <h3 className="font-black text-navy uppercase">
                      {item.name}
                    </h3>

                    <p className="mt-3 font-bold text-navy">
                      IDR{" "}
                      {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </motion.div>
    </>
  );
}