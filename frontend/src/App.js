import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis'; // <-- Import Lenis
import Home from '@/pages/Home';
import About from '@/pages/About';
import Collection from '@/pages/Collection';
import ProductDetail from '@/pages/ProductDetail';
import Contact from '@/pages/Contact';

// --- KOMPONEN SCROLL TO TOP (GLOBAL) ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    const appContainer = document.querySelector('.App');
    if (appContainer) {
      appContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        {/* --- Bungkus dengan Lenis untuk Smooth Scroll --- */}
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
          <BrowserRouter>
            <ScrollToTop /> 
            <AnimatePresence mode="wait">
              <Routes>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="collection" element={<Collection />} />
                {/* UBAH DI SINI: id -> slug */}
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="contact" element={<Contact />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </ReactLenis>
      </HelmetProvider>
    </div>
  );
}

export default App;