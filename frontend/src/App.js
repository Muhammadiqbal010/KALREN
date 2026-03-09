import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Pasang di sini agar aktif di setiap perpindahan rute */}
        <ScrollToTop /> 
        
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="collection" element={<Collection />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;