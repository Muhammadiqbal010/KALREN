/**
 * inventoryMaster.js
 *
 * Master Inventory sekarang bersifat dinamis dan seluruh data
 * berasal dari database melalui endpoint /api/master.
 *
 * Struktur response backend:
 *
 * {
 *   kategori: [
 *     { id, nama }
 *   ],
 *   subKategori: [
 *     { id, kategori_id, nama }
 *   ],
 *   satuan: [
 *     { id, nama }
 *   ]
 * }
 *
 * File ini hanya menyediakan helper agar seluruh halaman
 * menggunakan satu cara yang sama saat mengambil master data.
 */

import api from "../services/api";

/**
 * Mengambil seluruh master data inventory
 */
export const getMasterData = async () => {
  const { data } = await api.get("/api/master");

  return {
    kategori: data.kategori ?? [],
    subKategori: data.subKategori ?? [],
    satuan: data.satuan ?? [],
  };
};

/**
 * Mengambil daftar kategori
 */
export const getKategori = async () => {
  const { kategori } = await getMasterData();
  return kategori;
};

/**
 * Mengambil daftar sub kategori
 */
export const getSubKategori = async () => {
  const { subKategori } = await getMasterData();
  return subKategori;
};

/**
 * Mengambil daftar satuan
 */
export const getSatuan = async () => {
  const { satuan } = await getMasterData();
  return satuan;
};

/**
 * Filter sub kategori berdasarkan kategori_id
 */
export const getSubKategoriByKategori = async (kategoriId) => {
  const { subKategori } = await getMasterData();

  return subKategori.filter(
    (item) => String(item.kategori_id) === String(kategoriId)
  );
};