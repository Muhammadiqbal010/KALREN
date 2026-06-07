export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Biar gak kena block CORS Cloudinary
    image.src = url;
  });

export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set ukuran kanvas kotak 1:1 sesuai pixel crop pilihan lu
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Gambar citra foto ke dalam area koordinat kanvas lokal
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 🎯 FIX SAKRAL: Pastikan pemanggilan toBlob dibungkus Promise milik elemen canvas murni!
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (!file) {
        reject(new Error('Canvas is empty atau gagal diekstrak'));
        return;
      }
      resolve(file);
    }, 'image/jpeg');
  });
}