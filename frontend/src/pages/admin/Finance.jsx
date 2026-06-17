import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";
import api from "../../api/axios";
import FinanceForm from "./FinanceForm";

// =========================================================
// POPUP COMPONENTS
// =========================================================

// 1. CONFIRM POPUP — untuk konfirmasi hapus
const ConfirmPopup = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-[2rem] p-6 text-center shadow-2xl z-10 space-y-5 text-white"
    >
      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full mx-auto flex items-center justify-center">
        <FiTrash2 size={20} className="text-red-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-white">Konfirmasi Hapus</h3>
        <p className="text-xs text-neutral-400 font-medium leading-relaxed px-2">{message}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-white/5 cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-xl cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </motion.div>
  </div>
);

// 2. ALERT POPUP — untuk error / success
const AlertPopup = ({ type, message, onClose }) => {
  const isError = type === "error";
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-[2rem] p-6 text-center shadow-2xl z-10 space-y-5 text-white"
      >
        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
          isError ? "bg-red-500/10 border border-red-500/20" : "bg-emerald-500/10 border border-emerald-500/20"
        }`}>
          {isError
            ? <FiXCircle size={20} className="text-red-400" />
            : <FiCheckCircle size={20} className="text-emerald-400" />
          }
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {isError ? "Terjadi Kesalahan" : "Berhasil"}
          </h3>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed px-2">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:bg-neutral-200 cursor-pointer"
        >
          Oke
        </button>
      </motion.div>
    </div>
  );
};

// =========================================================
// FINANCE MAIN COMPONENT
// =========================================================

export default function Finance() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0 });

  // Filter States
  const [search, setSearch] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  // Export States
  const [exportMonth, setExportMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
  const [exportYear, setExportYear] = useState(String(new Date().getFullYear()));

  // Popup States
  const [confirmPopup, setConfirmPopup] = useState({ open: false, message: "", onConfirm: null });
  const [alertPopup, setAlertPopup] = useState({ open: false, type: "error", message: "" });

  // Helper: tampilkan alert popup
  const showAlert = (type, message) => setAlertPopup({ open: true, type, message });

  // Helper: tampilkan confirm popup
  const showConfirm = (message, onConfirm) => setConfirmPopup({ open: true, message, onConfirm });

  const loadData = async () => {
    try {
      const res = await api.get("/finance/transaksi", {
        params: { page, limit, search, bulan: bulan || null, tahun: tahun || null },
      });
      setData(res.data.data);
      setPages(res.data.pages);
    } catch (err) {
      console.error("Load Data Error:", err);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await api.get("/finance/transaksi/summary");
      setSummary(res.data.data);
    } catch (err) {
      console.error("Summary Error:", err);
    }
  };

  useEffect(() => {
    loadData();
    loadSummary();
  }, [page, search, bulan, tahun]);

  const handleDelete = (id) => {
    showConfirm("Yakin ingin menghapus transaksi ini? Tindakan ini tidak bisa dibatalkan.", async () => {
      setConfirmPopup({ open: false, message: "", onConfirm: null });
      try {
        await api.delete(`/finance/transaksi/${id}`);
        loadData();
        loadSummary();
        showAlert("success", "Transaksi berhasil dihapus.");
      } catch (err) {
        showAlert("error", "Gagal menghapus transaksi. Coba lagi.");
      }
    });
  };

  const downloadFile = async (type) => {
    try {
      const res = await api.get(`/finance/export/${type}`, {
        params: { month: exportMonth, year: exportYear },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const ext = type === "excel" ? "xlsx" : "pdf";
      link.setAttribute("download", `laporan-keuangan-${exportYear}-${exportMonth}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export Error:", err);
      showAlert("error", `Gagal mengekspor laporan ${type.toUpperCase()}. Pastikan data tersedia untuk bulan yang dipilih.`);
    }
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">KALREN FINANCE</h1>
          <p className="text-neutral-500 text-sm">Financial Management Dashboard</p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowForm(true); }}
          className="px-5 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition"
        >
          + INPUT TRANSAKSI
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Income",     val: summary.income,  color: "text-green-500" },
          { label: "Expense",    val: summary.expense, color: "text-red-500" },
          { label: "Net Profit", val: summary.profit,  color: summary.profit >= 0 ? "text-white" : "text-red-500" },
        ].map((item) => (
          <div key={item.label} className="bg-[#111] border border-white/10 rounded-xl p-6">
            <p className="text-xs uppercase text-neutral-500">{item.label}</p>
            <h2 className={`text-3xl font-black mt-2 ${item.color}`}>Rp {formatRupiah(item.val)}</h2>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-8 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Cari keterangan..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="bg-black border border-white/10 rounded-lg px-4 py-2 w-full md:w-64"
        />
        <select value={bulan} onChange={e => { setBulan(e.target.value); setPage(1); }} className="bg-black border border-white/10 rounded-lg px-4 py-2">
          <option value="">Semua Bulan</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{String(i + 1).padStart(2, "0")}</option>
          ))}
        </select>
        <select value={tahun} onChange={e => { setTahun(e.target.value); setPage(1); }} className="bg-black border border-white/10 rounded-lg px-4 py-2">
          <option value="">Semua Tahun</option>
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* FILTER EKSPOR */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-bold mb-3 text-neutral-400 uppercase">Ekspor Laporan</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <select value={exportMonth} onChange={e => setExportMonth(e.target.value)} className="bg-black border border-white/10 rounded-lg px-4 py-2">
            {[...Array(12)].map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
            ))}
          </select>
          <input
            value={exportYear}
            onChange={e => setExportYear(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-4 py-2 w-24"
          />
          <button onClick={() => downloadFile("excel")} className="px-5 py-2 bg-green-600 rounded-lg font-bold text-sm hover:bg-green-700 transition">Download Excel</button>
          <button onClick={() => downloadFile("pdf")}   className="px-5 py-2 bg-red-600 rounded-lg font-bold text-sm hover:bg-red-700 transition">Download PDF</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto bg-[#111] rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 text-neutral-500 uppercase text-xs">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Flow</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Sub Kategori</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((trx) => (
              <tr key={trx.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">{new Date(trx.tanggal).toLocaleDateString("id-ID")}</td>
                <td className={`p-4 font-bold ${trx.flow === "Income" ? "text-green-500" : "text-red-500"}`}>{trx.flow}</td>
                <td className="p-4">{trx.kategori}</td>
                <td className="p-4">{trx.sub_kategori || "-"}</td>
                <td className="p-4">{trx.keterangan}</td>
                <td className="p-4 text-right font-mono">Rp {formatRupiah(trx.net_amount)}</td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button onClick={() => { setEditData(trx); setShowForm(true); }} className="text-blue-400 font-bold hover:text-blue-300 transition">Edit</button>
                  <button onClick={() => handleDelete(trx.id)} className="text-red-500 font-bold hover:text-red-400 transition">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-black border border-white/10 rounded-lg font-bold disabled:opacity-30">Prev</button>
        <span className="text-sm text-neutral-500">Halaman {page} dari {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-black border border-white/10 rounded-lg font-bold disabled:opacity-30">Next</button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
          <div className="w-full max-w-lg">
            <FinanceForm
              editData={editData}
              onSuccess={() => { loadData(); loadSummary(); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* CONFIRM POPUP */}
      <AnimatePresence>
        {confirmPopup.open && (
          <ConfirmPopup
            message={confirmPopup.message}
            onConfirm={confirmPopup.onConfirm}
            onCancel={() => setConfirmPopup({ open: false, message: "", onConfirm: null })}
          />
        )}
      </AnimatePresence>

      {/* ALERT POPUP */}
      <AnimatePresence>
        {alertPopup.open && (
          <AlertPopup
            type={alertPopup.type}
            message={alertPopup.message}
            onClose={() => setAlertPopup({ open: false, type: "error", message: "" })}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
