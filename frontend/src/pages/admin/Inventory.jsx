import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiPlus, FiMinus, FiTrash2, FiX, FiSearch, FiTag, FiChevronDown,
} from "react-icons/fi";
import api from "../../api/axios";

/* ─────────────────────────────────── badge color (dynamic, cycled) ── */
const BADGE_COLORS = [
  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "bg-amber-500/10   text-amber-400   border-amber-500/20",
  "bg-sky-500/10     text-sky-400     border-sky-500/20",
  "bg-violet-500/10  text-violet-400  border-violet-500/20",
  "bg-rose-500/10    text-rose-400    border-rose-500/20",
  "bg-teal-500/10    text-teal-400    border-teal-500/20",
];

function getBadgeStyle(kategori, kategoriList) {
  const idx = kategoriList.indexOf(kategori);
  return BADGE_COLORS[(idx >= 0 ? idx : 0) % BADGE_COLORS.length];
}

/* ─────────────────────────────────── helpers ── */
function levelInfo(stok, min_stok) {
  if (stok <= 0)        return { label: "Habis",  bar: "bg-red-500",     text: "text-red-400",     pct: 0 };
  if (stok <= min_stok) return { label: "Rendah", bar: "bg-amber-400",   text: "text-amber-400",   pct: Math.round((stok / (min_stok * 2)) * 100) };
  return                       { label: "Normal", bar: "bg-emerald-500", text: "text-emerald-400", pct: Math.min(100, Math.round((stok / (min_stok * 2)) * 100)) };
}

/* ─────────────────────────────────── Toast ── */
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2200);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 right-6 z-[999] bg-white text-black text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-2xl"
    >
      {message}
    </motion.div>
  );
}

/* ─────────────────────────────────── Modal Tambah ── */
function AddModal({ onClose, onSave, kategoriList, kategoriData, satuan }) {
  const defaultKat  = kategoriList[0] ?? "Kain";
  const defaultSat  = satuan[0] ?? "pcs";
  const [form, setForm] = useState({
    nama_bahan: "", kategori: defaultKat, sub_item: "",
    stok: 0, satuan: defaultSat, min_stok: 3,
    ukuran: "", warna: "", keterangan: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setKategori = (v) => setForm(p => ({ ...p, kategori: v, sub_item: "" }));
  const subItems = kategoriData[form.kategori] ?? [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: .95, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        exit={{    opacity: 0, scale: .95, y: 20 }}
        transition={{ type: "spring", duration: .4 }}
        className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-[1.75rem] p-6 shadow-2xl z-10 text-white space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
          <FiX size={14} />
        </button>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-white font-mono">Tambah Bahan Baru</p>
          <p className="text-[9px] text-neutral-500 mt-1 uppercase tracking-wider">Isi semua kolom dengan benar</p>
        </div>

        {/* Kategori */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">Kategori</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 pr-8 text-xs text-white outline-none focus:border-white/20 transition-all cursor-pointer"
              value={form.kategori}
              onChange={e => setKategori(e.target.value)}
            >
              {kategoriList.map(k => <option key={k} value={k} className="bg-[#111]">{k}</option>)}
            </select>
            <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
        </div>

        {/* Nama Bahan */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">
            Nama Bahan
            {subItems.length > 0 && <span className="text-neutral-700 ml-1 normal-case">(pilih atau ketik manual)</span>}
          </label>
          {subItems.length > 0 ? (
            <div className="relative">
              <select
                className="w-full appearance-none bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 pr-8 text-xs text-white outline-none focus:border-white/20 transition-all cursor-pointer"
                value={form.sub_item || "__manual__"}
                onChange={e => {
                  if (e.target.value === "__manual__") set("sub_item", "");
                  else { set("sub_item", e.target.value); set("nama_bahan", e.target.value); }
                }}
              >
                <option value="__manual__" className="bg-[#111]">— Ketik manual —</option>
                {subItems.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
              </select>
              <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>
          ) : null}
          <input
            className="w-full bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all"
            placeholder="cth: Cotton Combed 30s"
            value={form.nama_bahan}
            onChange={e => { set("nama_bahan", e.target.value); set("sub_item", ""); }}
          />
        </div>

        {/* Ukuran & Warna — BARU */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">
              Ukuran <span className="text-neutral-700 normal-case">(opsional)</span>
            </label>
            <input
              className="w-full bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all"
              placeholder="cth: 150cm"
              value={form.ukuran}
              onChange={e => set("ukuran", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">
              Warna <span className="text-neutral-700 normal-case">(opsional)</span>
            </label>
            <input
              className="w-full bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all"
              placeholder="cth: Hitam"
              value={form.warna}
              onChange={e => set("warna", e.target.value)}
            />
          </div>
        </div>

        {/* Satuan */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">Satuan</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 pr-8 text-xs text-white outline-none focus:border-white/20 transition-all cursor-pointer"
              value={form.satuan}
              onChange={e => set("satuan", e.target.value)}
            >
              {satuan.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
            <FiChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
        </div>

        {/* Stok */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Stok Awal",    key: "stok"     },
            { label: "Stok Minimum", key: "min_stok" },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">{label}</label>
              <input
                type="number" min="0"
                className="w-full bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white/20 transition-all"
                value={form[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Keterangan — BARU */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[.12em] text-neutral-500">
            Keterangan <span className="text-neutral-700 normal-case">(opsional)</span>
          </label>
          <textarea
            rows={2}
            className="w-full bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all resize-none"
            placeholder="cth: simpan di rak B2, batch lama"
            value={form.keterangan}
            onChange={e => set("keterangan", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button onClick={onClose} className="py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer">
            Batal
          </button>
          <button
            onClick={() => form.nama_bahan.trim() && onSave({
              ...form,
              stok: Number(form.stok),
              min_stok: Number(form.min_stok),
              ukuran: form.ukuran.trim() || undefined,
              warna: form.warna.trim() || undefined,
              keterangan: form.keterangan.trim() || undefined,
            })}
            disabled={!form.nama_bahan.trim()}
            className="py-3 bg-white hover:opacity-85 disabled:opacity-30 text-black rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────── Modal Konfirmasi Hapus ── */
function DeleteModal({ item, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: .95, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        exit={{    opacity: 0, scale: .95, y: 20 }}
        transition={{ type: "spring", duration: .4 }}
        className="relative w-full max-w-xs bg-[#0d0d0d] border border-white/10 rounded-[1.75rem] p-6 z-10 text-white text-center space-y-4"
      >
        <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-full mx-auto flex items-center justify-center">
          <FiTrash2 size={18} className="text-red-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest">Hapus Item?</p>
          <p className="text-[11px] text-neutral-400 mt-1">
            <span className="text-white font-semibold">{item.nama_bahan}</span> akan dihapus secara permanen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer">
            Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────── Main Page ── */
export default function Inventory() {
  const [items,        setItems]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [adjusting,    setAdjusting]    = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const [filter,       setFilter]       = useState("all");
  const [search,       setSearch]       = useState("");

  // Master data — reload tiap kali modal tambah dibuka agar selalu sinkron dengan InventoryMaster
  const [master, setMaster] = useState({
  kategoriData: {},
  satuan: [],
});

  const kategoriList = Object.keys(master.kategoriData);
  const FILTERS = [
    { key: "all", label: "Semua" },
    ...kategoriList.map(k => ({ key: k, label: k })),
    { key: "low", label: "\u26a0 Stok Rendah" },
  ];

  /* ── fetch ── */
  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/inventory");
      setItems(res.data);
    } catch {
      setToast("Gagal memuat data inventori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  load();
  loadMaster();
}, []);

const loadMaster = async () => {
  try {
    const res = await api.get("/api/master");

    setMaster({
      kategoriData: res.data.kategoriData || {},
      satuan: res.data.satuan || [],
    });
  } catch (err) {
    console.error("gagal mengambil master inventory", err);

    setMaster({
      kategoriData: {},
      satuan: [],
    });
  }
};
    
    const openAddModal = async () => {
  await loadMaster();
  setShowAdd(true);
};

  /* ── adjust stok ── */
  const adjust = async (item, delta) => {
    if (item.stok + delta < 0) { setToast("Stok tidak bisa minus!"); return; }
    setAdjusting(item.id);
    try {
      await api.patch(`/api/inventory/${item.id}/adjust`, { delta });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, stok: i.stok + delta } : i));
      setToast(delta > 0 ? "Stok ditambah +1" : "Stok dikurang −1");
    } catch {
      setToast("Gagal memperbarui stok");
    } finally {
      setAdjusting(null);
    }
  };

  /* ── tambah item ── */
const addItem = async (form) => {
  try {
    const res = await api.post("/api/inventory/", form);
    // PASTIKAN res.data.id ADA sebelum dimasukkan ke state
    if (res.data && res.data.id) {
       setItems(prev => [res.data, ...prev]);
       setShowAdd(false);
       setToast("Bahan berhasil ditambahkan!");
    }
  } catch (err) {
    console.error(err.response?.data); // Lihat detail error di sini
    setToast("Gagal menambah item");
  }
};

  /* ── hapus item ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/inventory/${deleteTarget.id}`);
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      setToast("Item berhasil dihapus");
    } catch {
      setToast("Gagal menghapus item");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ── stats ── */
  const stats = useMemo(() => ({
    total: items.length,
    cats:  [...new Set(items.map(i => i.kategori))].length,
    low:   items.filter(i => i.stok > 0 && i.stok <= i.min_stok).length,
    habis: items.filter(i => i.stok <= 0).length,
  }), [items]);

  /* ── filtered rows ── */
const rows = useMemo(() => items.filter(i => {
  const matchFilter =
    filter === "all" ? true :
    filter === "low" ? i.stok <= i.min_stok :
    i.kategori === filter;
  const q = search.toLowerCase();
  const matchSearch =
    i.nama_bahan.toLowerCase().includes(q) ||
    (i.warna ?? "").toLowerCase().includes(q) ||
    (i.ukuran ?? "").toLowerCase().includes(q);
  return matchFilter && matchSearch;
}), [items, filter, search]);

  /* ── render ── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-sm font-black tracking-[.2em] uppercase font-mono text-white">📦 Inventory Management</h1>
          <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-wider">Kelola stok bahan baku produksi</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:opacity-85 transition-all cursor-pointer"
        >
          <FiPlus size={13} /> Bahan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Item",  value: stats.total, sub: "jenis bahan",  warn: false            },
          { label: "Kategori",    value: stats.cats,  sub: "tipe material",warn: false            },
          { label: "Stok Rendah", value: stats.low,   sub: "perlu restock",warn: stats.low  > 0  },
          { label: "Habis",       value: stats.habis, sub: "stok nol",     warn: stats.habis > 0 },
        ].map(s => (
          <div key={s.label} className="bg-white/[.02] border border-white/5 rounded-2xl p-4">
            <p className="text-[9px] uppercase tracking-[.15em] text-neutral-600">{s.label}</p>
            <p className={`text-2xl font-black font-mono mt-1 ${s.warn ? "text-amber-400" : "text-white"}`}>{s.value}</p>
            <p className="text-[9px] text-neutral-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-[.1em] transition-all cursor-pointer ${
              filter === f.key
                ? "bg-white/[.05] border-white/15 text-white"
                : "border-white/[.06] bg-transparent text-neutral-600 hover:text-white hover:bg-white/[.03] hover:border-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-white/[.03] border border-white/[.06] rounded-xl px-3 py-2">
          <FiSearch size={11} className="text-neutral-600 shrink-0" />
          <input
            type="text"
            placeholder="Cari bahan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[11px] text-white placeholder:text-neutral-600 outline-none w-36"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[.02] border-b border-white/5">
                {["Nama Bahan", "Kategori", "Stok (Quick Adjust)", "Min Stok", "Level", ""].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[9px] font-bold uppercase tracking-[.15em] text-neutral-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-[10px] text-neutral-600 uppercase tracking-wider">Memuat data...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-[10px] text-neutral-600 uppercase tracking-wider">Tidak ada item ditemukan</td></tr>
              ) : rows.map((item, idx) => {
                const info = levelInfo(item.stok, item.min_stok);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * .03 }}
                    className="border-b border-white/[.03] last:border-b-0 hover:bg-white/[.015] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-[240px]">
  <p className="font-bold text-[12px] text-white leading-tight">
    {item.nama_bahan}
  </p>

  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
    <span className="text-[9px] text-neutral-600 uppercase tracking-wider font-mono">
      SKU-{String(item.id).padStart(4, "0")}
    </span>

    {item.ukuran && (
      <span className="text-[9px] text-neutral-400 bg-white/[.05] px-1.5 py-0.5 rounded-md">
        {item.ukuran}
      </span>
    )}

    {item.warna && (
      <span className="text-[9px] text-neutral-400 bg-white/[.05] px-1.5 py-0.5 rounded-md">
        {item.warna}
      </span>
    )}
  </div>

  {item.keterangan && (
    <p
      className="text-[9px] text-neutral-600 mt-1 truncate"
      title={item.keterangan}
    >
      {item.keterangan}
    </p>
  )}
</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-[.08em] ${getBadgeStyle(item.kategori, kategoriList)}`}>
                        <FiTag size={9} /> {item.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          disabled={adjusting === item.id || item.stok <= 0}
                          onClick={() => adjust(item, -1)}
                          className="w-7 h-7 rounded-lg border border-white/[.08] bg-transparent text-neutral-600 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        >
                          <FiMinus size={11} />
                        </button>
                        <span className={`w-16 text-center font-mono font-bold text-sm ${info.text}`}>
                          {item.stok} <span className="text-[9px] text-neutral-600 font-normal">{item.satuan}</span>
                        </span>
                        <button
                          disabled={adjusting === item.id}
                          onClick={() => adjust(item, 1)}
                          className="w-7 h-7 rounded-lg border border-white/[.08] bg-transparent text-neutral-600 hover:bg-emerald-500/10 hover:border-emerald-500/25 hover:text-emerald-400 disabled:opacity-30 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        >
                          <FiPlus size={11} />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[10px] text-neutral-600 font-mono">{item.min_stok} {item.satuan}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1 bg-white/[.06] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${info.bar}`} style={{ width: `${info.pct}%` }} />
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-[.08em] ${info.text}`}>{info.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-500/40 hover:border-red-500/25 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-5 py-3 border-t border-white/5 text-[9px] text-neutral-600 uppercase tracking-wider">
            Menampilkan {rows.length} dari {items.length} item
          </div>
        )}
      </div>

      {/* Modals & Toast */}
      <AnimatePresence>
        {showAdd      && <AddModal    onClose={() => setShowAdd(false)} onSave={addItem} kategoriList={kategoriList} kategoriData={master.kategoriData} satuan={master.satuan} />}
        {deleteTarget && <DeleteModal item={deleteTarget} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} />}
        {toast        && <Toast message={toast} onHide={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
