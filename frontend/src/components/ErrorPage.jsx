import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiLock,
  FiAlertTriangle,
  FiServer,
} from 'react-icons/fi';

export const ErrorPage = ({ code = 404 }) => {
  const errorConfig = {
    403: {
      title: 'Access Denied',
      message:
        'anda tidak memiliki izin untuk mengakses halaman ini.',
      icon: <FiLock size={40} />,
      glow: 'from-yellow-500/20 to-orange-500/20',
    },

    404: {
      title: 'Page Not Found',
      message:
        'halaman yang anda cari tidak ditemukan atau telah dipindahkan.',
      icon: <FiAlertTriangle size={40} />,
      glow: 'from-blue-500/20 to-cyan-500/20',
    },

    500: {
      title: 'Internal Server Error',
      message:
        'terjadi kesalahan pada server. silakan coba kembali beberapa saat lagi.',
      icon: <FiServer size={40} />,
      glow: 'from-red-500/20 to-pink-500/20',
    },
  };

  const current =
    errorConfig[code] || errorConfig[404];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6 text-white">

      {/* Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-radial ${current.glow} blur-[180px] opacity-70`}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-xl text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
            {current.icon}
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-[7rem] md:text-[10rem] font-black tracking-[-0.08em] leading-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent">
          {code}
        </h1>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto my-6" />

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em]">
          {current.title}
        </h2>

        {/* Message */}
        <p className="mt-5 text-gray-400 leading-relaxed">
          {current.message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

          <Link
            to="/"
            className="
              px-8 py-4
              rounded-full
              bg-white
              text-black
              text-xs
              font-semibold
              uppercase
              tracking-widest
              transition-all
              hover:scale-105
            "
          >
            back to home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="
              flex items-center justify-center gap-2
              px-8 py-4
              rounded-full
              border border-white/10
              bg-white/5
              backdrop-blur-xl
              text-xs
              font-semibold
              uppercase
              tracking-widest
              hover:bg-white/10
              transition-all
            "
          >
            <FiArrowLeft />
            go back
          </button>

        </div>

        {/* Footer */}
        <div className="mt-16 text-[10px] uppercase tracking-[0.35em] text-gray-600">
          error handling system v1.0
        </div>

      </div>
    </div>
  );
};