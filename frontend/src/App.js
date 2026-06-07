import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';

// Import Context
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import Lookbook from "./pages/Lookbook";
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Core Dashboard Workspace
import AdminDashboard from './pages/admin/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('kalren_token');
  return token ? children : <Navigate to="/khususorangdalam" replace />;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ReactLenis root options={{ lerp: 0.1 }}>
          <BrowserRouter>
            <ScrollToTop />
            <AnimatePresence mode="wait">
              <Routes>
                {/* =========================================================
                    PUBLIC ROUTES
                ========================================================= */}
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/lookbook" element={<Lookbook />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Autentikasi Masuk */}
                <Route path="/khususorangdalam" element={<Login />} />
                <Route path="/maujadiorangdalam" element={<Register />} />

                {/* =========================================================
                    ADMIN PROTECTED ROUTES
                ========================================================= */}
                {/* Tanda "/*" di ujung rute memastikan sub-routing halaman admin
                    di dalam file AdminDashboard berjalan dengan sinkron */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </ReactLenis>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;