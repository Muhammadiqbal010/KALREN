import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tighter">KALREN</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Process over trend.<br />
              Built quietly. Worn with purpose.
            </p>
          </div>

          {/* Navigate Section with Micro-Interactions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
              Navigate
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Collection', path: '/collection' },
                { name: 'Connect', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center text-white/70 hover:text-white text-sm transition-all duration-300"
                  >
                    {/* Dot indicator yang muncul saat hover */}
                    <span className="w-0 h-0 bg-white rounded-full transition-all duration-300 group-hover:w-1.5 group-hover:h-1.5 group-hover:mr-3" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section with Arrow Slide Interaction */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/50">
              Connect
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/kalrenclothing' },
                { name: 'TikTok', url: 'https://www.tiktok.com/@kalrenclothing' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between max-w-[150px] text-white/70 hover:text-white text-sm transition-all duration-300 border-b border-white/5 pb-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {social.name}
                  </span>
                  {/* Icon panah geser */}
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">
              © {currentYear} KALREN. Every piece tells a story.
            </p>
            <p className="text-white/30 text-[11px] uppercase tracking-[0.15em] font-light">
              Designed with intention. Built with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};