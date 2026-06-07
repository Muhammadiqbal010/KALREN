import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Utilitas pembantu untuk menggambar ulang biner gambar 4:5 di canvas HTML5 Bal
function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas kosong Bal!'));
        return;
      }
      blob.name = 'cropped_article.jpg';
      resolve(blob);
    }, 'image/jpeg', 0.95); // High quality compressed JPEG
  });
}

export const ImageCropper = ({ src, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  // Otomatis mengunci rasio 4:5 pas gambar pertama kali dimuat di layar Bal
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const aspect = 4 / 5; // RASIO DIKUNCI 4:5
    
    const initialCrop = makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      width,
      height
    );

    setCrop(centerCrop(initialCrop, width, height));
  };

  const handleSave = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
        // Lempar balik objek file biner Blob yang udah terpotong 4:5 ke form state utama Bal
        onCropComplete(croppedBlob);
      } catch (e) {
        console.error('Gagal memotong asset gambar:', e);
        alert('Gagal memotong gambar, coba ulangi');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[99999] p-6 font-['Inter']">
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[2rem] max-w-lg w-full space-y-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">4:5 Studio Precision Crop</h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">Adjust container matrix constraints safely</p>
        </div>

        <div className="max-h-[60vh] overflow-auto border border-white/5 rounded-xl bg-black flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={4 / 5} // HARUS KUNCI 4:5 BAL
            keepSelection
          >
            <img
              ref={imgRef}
              src={src}
              alt="Source pipeline crop"
              onLoad={onImageLoad}
              className="max-w-full max-h-[50vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-white text-black rounded-xl font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all"
          >
            APPLY 4:5 CROP
          </button>
        </div>
      </div>
    </div>
  );
};