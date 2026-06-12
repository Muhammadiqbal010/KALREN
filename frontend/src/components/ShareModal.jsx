import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";

export const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href; // Ambil URL saat modal dibuka

  const handleCopy = async (e) => {
    e.stopPropagation(); // Biar nggak bentrok dengan event parent
    try {
      // Prioritas 1: Clipboard API (Modern & Aman)
      await navigator.clipboard.writeText(shareUrl);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Prioritas 2: Fallback ke cara lama kalau gagal
      console.error('Gagal copy otomatis, mencoba cara manual...');
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Copy gagal total:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const socialLinks = [
    { name: 'WhatsApp', url: `https://wa.me/?text=Cek produk ini: ${encodeURIComponent(product.name)} - ${shareUrl}` },
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${shareUrl}` },
    { name: 'Telegram', url: `https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent(product.name)}` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-black uppercase tracking-widest">Bagikan Produk</DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">Share ke teman atau media sosial.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <img src={product.image_urls[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex flex-col justify-center">
              <p className="font-bold text-sm text-white">{product.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{product.series}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" 
                 className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-[10px] font-bold uppercase tracking-wider">
                {link.name}
              </a>
            ))}
          </div>

          <button onClick={handleCopy} className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-xl text-xs font-mono text-gray-300 hover:border-white/30 transition">
            {shareUrl.substring(0, 35)}...
            {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};