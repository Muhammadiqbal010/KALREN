/**
 * inventoryMaster.js
 *
 * File ini adalah satu-satunya sumber kebenaran (single source of truth)
 * untuk data master Inventory: kategori, sub-item per kategori, dan satuan.
 *
 * CARA MENAMBAH DATA:
 *  - Kategori baru  → tambah key baru di KATEGORI_DATA
 *  - Sub-item baru  → tambah string di array kategori yang sesuai
 *  - Satuan baru    → tambah string di array SATUAN
 *
 * File ini di-import oleh:
 *  - Inventory.jsx        (tabel utama)
 *  - InventoryMaster.jsx  (halaman kelola master data)
 *
 * Jika backend sudah siap, ganti export ini dengan API call dari
 * useMasterData() hook agar data tersimpan di database.
 */

export const KATEGORI_DATA = {
  Kain: [
    "Boxy",
    "Reguler",
    "Cotton Combed 24s",
    "Heavyweight 16s",
    "Kain Rib",
  ],
  Aksesoris: [
    "Hangtag",
    "Label Baju / Woven",
    "Ziplock / Packaging",
    "Stiker Packing",
  ],
  Consumables: [
    "Polyflex Foam",
    "Polyflex Silicone",
    "Film DTF",
    "Tinta Sablon",
    "Benang",
  ],
};

export const SATUAN = ["meter", "pcs", "roll", "liter", "cone", "Kg"];

/* ─── derived helpers (jangan edit manual, otomatis dari atas) ─── */

/** List nama kategori saja → ["Kain", "Aksesoris", "Consumables"] */
export const KATEGORI_LIST = Object.keys(KATEGORI_DATA);

/** Sub-item dari satu kategori → ["Boxy", "Reguler", ...] */
export const getSubItems = (kategori) => KATEGORI_DATA[kategori] ?? [];

/** Semua sub-item flat dengan label kategorinya (untuk search global) */
export const ALL_ITEMS = Object.entries(KATEGORI_DATA).flatMap(
  ([kategori, items]) => items.map((nama) => ({ nama, kategori }))
);

