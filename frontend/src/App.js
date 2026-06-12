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

import { ErrorPage } from './components/ErrorPage';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import Lookbook from './pages/Lookbook';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader">
        Loading Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/khususorangdalam" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loader">
        Loading Session...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* AUTH */}
          <Route path="/khususorangdalam" element={<Login />} />
          <Route path="/maujadiorangdalam" element={<Register />} />

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ERROR PAGES */}
          <Route
            path="/forbidden"
            element={<ErrorPage code={403} />}
          />

          <Route
            path="/server-error"
            element={<ErrorPage code={500} />}
          />

          {/* 404 HARUS PALING BAWAH */}
          <Route
            path="*"
            element={<ErrorPage code={404} />}
          />

        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ReactLenis root options={{ lerp: 0.1 }}>
          <AppRoutes />
        </ReactLenis>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;