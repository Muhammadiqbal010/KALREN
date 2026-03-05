import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">KALREN</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Process over trend.<br />
              Built quietly. Worn with purpose.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Connect
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/kalrenclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/70 hover:text-white text-sm transition-colors duration-300"
              >
                <span>Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@kalrenclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/70 hover:text-white text-sm transition-colors duration-300"
              >
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/50 text-sm">
              © {currentYear} KALREN. Every piece tells a story.
            </p>
            <p className="text-white/50 text-sm">
              Designed with intention. Built with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
