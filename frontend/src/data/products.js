// src/data/products.js

// ================= IMPORT ASSETS =================

// ===== CORE =====
import hitam from '@/assets/cover/HITAM.png';
import hitam1 from '@/assets/hitam/hitam1.png';
import hitam2 from '@/assets/hitam/hitam2.png';
import hitam3 from '@/assets/hitam/hitam3.png';
import hitam4 from '@/assets/hitam/hitam4.png';

import navy from '@/assets/cover/NAVY.png';
import navy1 from '@/assets/navy/navy1.png';
import navy2 from '@/assets/navy/navy2.png';
import navy3 from '@/assets/navy/navy3.png';

import marun from '@/assets/cover/MAROON.png';
import marun1 from '@/assets/maroon/maron1.png';
import marun2 from '@/assets/maroon/maron2.png';
import marun3 from '@/assets/maroon/maron3.png';
import marun4 from '@/assets/maroon/maron4.png';

import putih from '@/assets/cover/PUTIH.png';
import putih1 from '@/assets/putih/putih1.png';
import putih2 from '@/assets/putih/putih2.png';
import putih3 from '@/assets/putih/putih3.png';
import putih4 from '@/assets/putih/putih4.png';

// ===== EDGE =====
import albert from '@/assets/cover/ALBERT.png';
import albert1 from '@/assets/albert/albert1.png';
import albert2 from '@/assets/albert/albert2.png';
import albert3 from '@/assets/albert/albert3.png';
import albert4 from '@/assets/albert/albert4.png';

import street from '@/assets/cover/STREET.png';
import street1 from '@/assets/street/street1.png';
import street2 from '@/assets/street/street2.png';
import street3 from '@/assets/street/street3.png';
import street4 from '@/assets/street/street4.png';

import bali from '@/assets/cover/ISLAND GUARDIAN.png';
import bali1 from '@/assets/bali/bali1.png';
import bali2 from '@/assets/bali/bali2.png';
import bali3 from '@/assets/bali/bali3.png';
import bali4 from '@/assets/bali/bali4.png';

import daruma from '@/assets/cover/DARUMA.png';
import daruma1 from '@/assets/daruma/daruma1.png';
import daruma2 from '@/assets/daruma/daruma2.png';
import daruma3 from '@/assets/daruma/daruma3.png';
import daruma4 from '@/assets/daruma/daruma4.png';

// ================= SHARED CONFIG =================

const baseSizes = ['M', 'L', 'XL', 'XXL'];

const coreStory = `
Core Essential adalah fondasi dari setiap wardrobe modern. 
Dirancang untuk kamu yang menghargai kualitas, kenyamanan, dan tampilan clean tanpa berlebihan.

Menggunakan cotton combed 24s dengan keseimbangan ketebalan yang ideal —
tidak terlalu tipis, tidak terlalu berat. Lembut di kulit, breathable,
menyerap keringat dengan baik, dan tetap mempertahankan bentuk setelah
pemakaian berulang.

Ini bukan sekadar kaos basic.
Ini adalah standar.
`;

// ================= PRODUCTS =================

export const products = [

  // ================= CORE COLLECTION =================

  {
    id: 1,
    name: 'Core Essential Tee — Black',
    category: 'core',
    description:
      'Clean. Bold. Timeless. Hitam adalah definisi kepercayaan diri yang tidak perlu banyak bicara.',
    material: 'Cotton Combed 24s',
    sizes: baseSizes,
    story: `
Hitam adalah standar mutlak dalam berpakaian. 

Bukan sekadar warna, melainkan simbol otoritas dan kemudahan dalam memadupadankan gaya. Menggunakan Cotton Combed 24s yang solid namun tetap breathable, kaos ini dirancang untuk kamu yang menghargai tampilan tajam tanpa usaha berlebih. 

Satu kaos untuk segala situasi—dari hangout santai hingga layer untuk tampilan formal.
Hitam tidak akan pernah salah.
    `,
    images: [hitam, hitam1, hitam2, hitam3, hitam4],
    color: 'Hitam',
    links: {
      shopee: 'https://id.shp.ee/YDseN2d',
      tiktok: 'https://vt.tokopedia.com/t/ZS919ng7srGXD-K9wnP/',
    },
  },

  {
    id: 2,
    name: 'Core Essential Tee — Navy',
    category: 'core',
    description:
      'Elegan dan refined. Navy menghadirkan kesan tenang namun tetap berkarakter.',
    material: 'Cotton Combed 24s',
    sizes: baseSizes,
    story: `
Navy hadir untuk kamu yang mencari kedalaman karakter. 

Warna ini membawa nuansa yang tenang namun menyimpan kekuatan besar. Dibuat dengan konstruksi kain yang lembut dan potongan yang presisi, Navy memberikan alternatif bagi mereka yang ingin tampil berkelas tanpa harus selalu menggunakan warna hitam. 

Elegan, cerdas, dan selalu bisa diandalkan dalam setiap langkahmu.
    `,
    images: [navy, navy1, navy2, navy3, navy4],
    color: 'Navy',
    links: {
      shopee: 'https://id.shp.ee/LAi4GmQ',
      tiktok: 'https://vt.tokopedia.com/t/ZS919nqCChR2D-vBtjf/',
    },
  },

  {
    id: 3,
    name: 'Core Essential Tee — Maroon',
    category: 'core',
    description:
      'Bold dengan sentuhan sophisticated. Warna untuk kamu yang berani tampil berbeda tanpa kehilangan kelas.',
    material: 'Cotton Combed 24s',
    sizes: baseSizes,
    story: `
Maroon adalah perpaduan antara gairah dan eksklusivitas. 

Dipilih khusus untuk kamu yang ingin mencuri perhatian secara halus. Tekstur Cotton Combed 24s yang premium memastikan warna ini terlihat kaya dan berdimensi, memberikan kesan hangat sekaligus dominan di saat yang bersamaan. 

Bukan hanya sekadar kaos polos, ini adalah pernyataan bahwa kamu berani tampil beda.
    `,
    images: [marun, marun1, marun2, marun3, marun4],
    color: 'Maroon',
    links: {
      shopee: 'https://id.shp.ee/Hrmjbtv',
      tiktok: 'https://vt.tokopedia.com/t/ZS919nCqgXF6v-Om7I1/',
    },
  },

  {
    id: 4,
    name: 'Core Essential Tee — White',
    category: 'core',
    description:
      'Versatile dan effortless. Putih yang bersih untuk tampilan minimal yang selalu relevan.',
    material: 'Cotton Combed 24s',
    sizes: baseSizes,
    story: `
Warna putih yang bersih adalah kanvas kosong untuk kreativitasmu. 

Ia mencerminkan kejujuran dan kesederhanaan yang sempurna. Dengan ketebalan 24s yang pas, kaos ini tidak menerawang namun tetap dingin saat bersentuhan dengan kulit. Sebuah pondasi wajib bagi siapapun yang ingin membangun gaya minimalis yang kuat. 

Tetap relevan di masa lalu, masa kini, hingga masa depan.
    `,
    images: [putih, putih1, putih2, putih3, putih4],
    color: 'White',
    links: {
      shopee: 'https://id.shp.ee/muuE6cR',
      tiktok: 'https://vt.tokopedia.com/t/ZS919nmy7VAHN-znWqY/',
    },
  },

  // ================= EDGE COLLECTION =================

  {
    id: 5,
    name: 'Edge Tee — Albert',
    category: 'edge',
    description:
      'Representasi keberanian berpikir berbeda. Inspirasi dari sosok visioner yang mengubah cara dunia melihat realita.',
    material: 'Cotton Combed 24s + Premium DTF Print',
    sizes: baseSizes,
    story: `
Edge adalah ekspresi. 

Albert edition membawa pesan bahwa ide besar lahir dari keberanian untuk
tidak selalu mengikuti arus. Dibuat dengan cotton combed 24s yang lembut
dan breathable, dipadukan dengan sablon DTF premium dengan detail tajam,
fleksibel, dan tahan lama.

Dirancang untuk kamu yang tidak sekadar mengikuti tren —
kamu menciptakannya.
    `,
    images: [albert, albert1, albert2, albert3, albert4],
    links: {
      shopee: 'https://id.shp.ee/2pBqHyT',
      tiktok: 'https://vt.tokopedia.com/t/ZS919n7oAKgHg-BWLaH/',
    },
  },

  {
    id: 6,
    name: 'Edge Tee — Street Crown',
    category: 'edge',
    description:
      'Energi urban yang mentah dan autentik. Street bukan gaya, ini attitude.',
    material: 'Cotton Combed 24s + Premium DTF Print',
    sizes: baseSizes,
    story: `
Street Crown adalah simbol dominasi dalam ruangmu sendiri.

Menggabungkan kenyamanan premium dengan artwork berkarakter kuat,
kaos ini dirancang untuk mereka yang hidup dengan ritme kota —
cepat, berani, dan penuh determinasi.

Detail sablon DTF premium memastikan visual tetap tajam dan tahan lama,
bahkan dalam pemakaian intens.
    `,
    images: [street, street1, street2, street3, street4],
    links: {
      shopee: 'https://id.shp.ee/9trX6UP',
      tiktok: 'https://vt.tokopedia.com/t/ZS919nWwu5uyq-5hUAB/',
    },
  },

  {
    id: 7,
    name: 'Edge Tee — Island Guardian',
    category: 'edge',
    description:
      'Perpaduan heritage dan street modern. Kuat, simbolik, dan penuh makna.',
    material: 'Cotton Combed 24s + Premium DTF Print',
    sizes: baseSizes,
    story: `
Island Guardian terinspirasi dari simbol perlindungan dan kekuatan.

Menghadirkan visual yang tegas namun tetap refined,
diproduksi dengan cotton combed 24s berkualitas dan DTF premium
yang menjaga detail tetap hidup dalam setiap gerakan.

Ini bukan hanya graphic tee.
Ini statement.
    `,
    images: [bali, bali1, bali2, bali3, bali4],
    links: {
      shopee: 'https://id.shp.ee/fw8XXhX',
      tiktok: 'https://vt.tokopedia.com/t/ZS919no7uLXya-HNyRj/',
    },
  },

  {
    id: 8,
    name: 'Edge Tee — Fortune Daruma',
    category: 'edge',
    description:
      'Simbol tekad, konsistensi, dan fokus pada tujuan. Dirancang untuk mereka yang tidak mudah menyerah.',
    material: 'Cotton Combed 24s + Premium DTF Print',
    sizes: baseSizes,
    story: `
Fortune Daruma adalah representasi dari persistence.

Setiap detail artwork membawa pesan tentang komitmen terhadap tujuan.
Dipadukan dengan material premium dan sablon berkualitas tinggi,
kaos ini nyaman dipakai sekaligus kuat secara visual.

Untuk kamu yang percaya —
proses tidak pernah mengkhianati hasil.
    `,
    images: [daruma, daruma1, daruma2, daruma3, daruma4],
    links: {
      shopee: 'https://id.shp.ee/XoXakTP',
      tiktok: 'https://vt.tokopedia.com/t/ZS919nGF4s9fH-z428h/',
    },
  },
];