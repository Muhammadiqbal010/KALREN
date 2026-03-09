import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BlurImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 1. Placeholder / Blurred Background */}
      <div 
        className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
      />

      {/* 2. Main Image */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.05 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
};