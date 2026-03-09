import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Setiap kali path/rute berubah, jalankan scroll ke atas

  return null; // Komponen ini gak nampilin apa-apa di layar
};

export default ScrollToTop;