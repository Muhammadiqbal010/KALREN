import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logoKalren from '@/assets/logo/logokalren.png';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collection', path: '/collection' },
    { name: 'Connect', path: '/contact' }
  ];

  return (
    <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    isScrolled 
      ? 'bg-navy/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-xl' 
      : 'bg-navy py-6'
  }`}
>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* 2. LOGO PNG */}
            <img 
              src={logoKalren} 
              alt="KALREN Logo" 
              className="h-7 md:h-8 w-auto object-contain"
            />
            
            {/* Logo Text */}
            <span className="text-3xl md:text-3xl font-bold text-white tracking-tighter uppercase leading-none">
              KALREN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-navy border-navy-foreground/10">
              <div className="flex flex-col space-y-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xl font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
