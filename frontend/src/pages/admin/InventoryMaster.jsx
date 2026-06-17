/**
 * InventoryMaster.jsx
 *
 * Halaman untuk Owner mengelola data master inventori:
 *  - Tambah / hapus Kategori
 *  - Tambah / hapus Sub-item per Kategori
 *  - Tambah / hapus Satuan
 *
 * Data disimpan di localStorage (key: "inventory_master") sehingga
 * perubahan bertahan antar sesi tanpa perlu backend.
 *
 * Ketika backend tersedia, ganti loadMaster() & saveMaster() dengan
 * API call ke endpoint /api/inventory/master.
 */

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiTrash2, FiX, FiChevronDown, FiChevronRight, FiSave } from "react-icons/fi";
import {
  KATEGORI_DATA as DEFAULT_KATEGORI,
  SATUAN as DEFAULT_SATUAN,
} from "../../config/inventoryMaster";

const STORAGE_KEY = "inventory_master";

/* ── persistence ── */
function loadMaster() {
  try {
    const raw = localStorage.getItem("/api/master/");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { kategoriData: DEFAULT_KATEGORI, satuan: DEFAULT_SATUAN };
}

function saveMaster(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ── small reusable pieces ── */
function Tag({ label, onRemove, colorClass = "bg-white/5 border-white/10 text-white" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-semibold ${colorClass}`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer ml-0.5"
          aria-label={`Hapus ${label}`}
        >
          <FiX size={10} />
        </button>
      )}
    </span>
  );
}

function InlineAdd({ placeholder, onAdd }) {
  const [val, setVal] = useState("");
  const commit = () => {
    const v = val.trim();
    if (v) { onAdd(v); setVal(""); }
  };
  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && commit()}
        placeholder={placeholder}
        className="flex-1 bg-white/[.03] border border-white/[.06] rounded-lg px-3 py-1.5 text-[11px] text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all"
      />
      <button
        onClick={commit}
        disabled={!val.trim()}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-black disabled:opacity-30 hover:opacity-85 transition-all cursor-pointer shrink-0"
      >
        <FiPlus size={12} />
      </button>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2000);
    return () => clearTimeout(t);
  }, [message]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 right-6 z-[999] bg-white text-black text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-2xl"
    >
      {message}
    </motion.div>
  );
}

/* ── Konfirmasi hapus kategori ── */
function ConfirmModal({ label, onConfirm, onClose }) {
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
          <p className="text-[10px] font-black uppercase tracking-widest">Hapus Kategori?</p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Kategori <span className="text-white font-semibold">"{label}"</span> dan semua sub-itemnya akan dihapus.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer">Batal</button>
          <button onClick={onConfirm} className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer">Hapus</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── BADGE COLOR per kategori (cycled) ── */
const BADGE_COLORS = [
  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  "bg-amber-500/10   border-amber-500/20   text-amber-400",
  "bg-sky-500/10     border-sky-500/20     text-sky-400",
  "bg-violet-500/10  border-violet-500/20  text-violet-400",
  "bg-rose-500/10    border-rose-500/20    text-rose-400",
  "bg-teal-500/10    border-teal-500/20    text-teal-400",
];
const badgeColor = (idx) => BADGE_COLORS[idx % BADGE_COLORS.length];

/* ══════════════════════════════════════════════════════════════ MAIN ══ */
export default function InventoryMaster() {
  const [master,         setMaster]         = useState(loadMaster);
  const [expanded,       setExpanded]       = useState({});      // { [kategori]: bool }
  const [confirmDelete,  setConfirmDelete]  = useState(null);    // kategori name
  const [toast,          setToast]          = useState(null);
  const [dirty,          setDirty]          = useState(false);

  const { kategoriData, satuan } = master;

  /* ── helpers ── */
  const update = (next) => { setMaster(next); setDirty(true); };
  const showToast = (msg) => setToast(msg);

  const save = () => {
    saveMaster(master);
    setDirty(false);
    showToast("Master data tersimpan!");
  };

  /* ── kategori ── */
  const addKategori = (nama) => {
    if (kategoriData[nama]) { showToast("Kategori sudah ada!"); return; }
    update({ ...master, kategoriData: { ...kategoriData, [nama]: [] } });
    setExpanded(p => ({ ...p, [nama]: true }));
  };

  const deleteKategori = (nama) => {
    const next = { ...kategoriData };
    delete next[nama];
    update({ ...master, kategoriData: next });
    setConfirmDelete(null);
    showToast(`Kategori "${nama}" dihapus`);
  };

  /* ── sub-item ── */
  const addSubItem = (kategori, nama) => {
    const list = kategoriData[kategori] ?? [];
    if (list.includes(nama)) { showToast("Sub-item sudah ada!"); return; }
    update({ ...master, kategoriData: { ...kategoriData, [kategori]: [...list, nama] } });
  };

  const removeSubItem = (kategori, nama) => {
    update({
      ...master,
      kategoriData: {
        ...kategoriData,
        [kategori]: kategoriData[kategori].filter(i => i !== nama),
      },
    });
  };

  /* ── satuan ── */
  const addSatuan = (nama) => {
    if (satuan.includes(nama)) { showToast("Satuan sudah ada!"); return; }
    update({ ...master, satuan: [...satuan, nama] });
  };

  const removeSatuan = (nama) => {
    update({ ...master, satuan: satuan.filter(s => s !== nama) });
  };

  /* ── toggle expand ── */
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));

  /* ────────────────────────────── render ── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-sm font-black tracking-[.2em] uppercase font-mono text-white">🗂 Master Data Inventori</h1>
          <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-wider">Kelola kategori, sub-item, dan satuan bahan</p>
        </div>
        <button
          onClick={save}
          disabled={!dirty}
          className="flex items-center gap-2 bg-white disabled:opacity-30 text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:opacity-85 transition-all cursor-pointer"
        >
          <FiSave size={13} /> Simpan Perubahan
        </button>
      </div>

      {/* unsaved banner */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-400 font-bold uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Ada perubahan yang belum disimpan
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── KOLOM KIRI: Kategori & Sub-item ── */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-[9px] uppercase tracking-[.15em] text-neutral-600 font-bold">Kategori &amp; Sub-item</p>

          {Object.entries(kategoriData).map(([kat, items], idx) => (
            <div key={kat} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">

              {/* Kategori header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/[.015] transition-colors select-none"
                onClick={() => toggle(kat)}
              >
                <div className="flex items-center gap-3">
                  {expanded[kat]
                    ? <FiChevronDown size={13} className="text-neutral-500 shrink-0" />
                    : <FiChevronRight size={13} className="text-neutral-500 shrink-0" />
                  }
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-[.1em] ${badgeColor(idx)}`}>
                    {kat}
                  </span>
                  <span className="text-[10px] text-neutral-600">{items.length} item</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setConfirmDelete(kat); }}
                  className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-500/40 hover:border-red-500/25 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <FiTrash2 size={11} />
                </button>
              </div>

              {/* Sub-items (collapsible) */}
              <AnimatePresence initial={false}>
                {expanded[kat] && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-5 pb-4 pt-1 border-t border-white/5 space-y-3">
                      <div className="flex flex-wrap gap-2 min-h-[28px]">
                        {items.length === 0
                          ? <span className="text-[10px] text-neutral-700 italic">Belum ada sub-item</span>
                          : items.map(item => (
                            <Tag
                              key={item}
                              label={item}
                              colorClass={badgeColor(idx)}
                              onRemove={() => removeSubItem(kat, item)}
                            />
                          ))
                        }
                      </div>
                      <InlineAdd
                        placeholder={`Tambah sub-item ${kat}...`}
                        onAdd={(v) => addSubItem(kat, v)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Tambah kategori baru */}
          <div className="bg-white/[.02] border border-dashed border-white/10 rounded-2xl px-5 py-4">
            <p className="text-[9px] uppercase tracking-[.12em] text-neutral-600 mb-2">Tambah Kategori Baru</p>
            <InlineAdd placeholder="Nama kategori baru..." onAdd={addKategori} />
          </div>
        </div>

        {/* ── KOLOM KANAN: Satuan ── */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[.15em] text-neutral-600 font-bold">Satuan</p>

          <div className="bg-[#111] border border-white/5 rounded-2xl px-5 py-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {satuan.map(s => (
                <Tag
                  key={s}
                  label={s}
                  colorClass="bg-white/5 border-white/10 text-white"
                  onRemove={() => removeSatuan(s)}
                />
              ))}
            </div>
            <InlineAdd placeholder="Tambah satuan baru..." onAdd={addSatuan} />
          </div>

          {/* Info card */}
          <div className="bg-white/[.02] border border-white/5 rounded-2xl px-5 py-4 space-y-2">
            <p className="text-[9px] uppercase tracking-[.12em] text-neutral-500 font-bold">Tentang halaman ini</p>
            <p className="text-[10px] text-neutral-600 leading-relaxed">
              Perubahan di sini akan langsung tersedia di form tambah bahan baru pada halaman Inventory.
              Tekan <span className="text-white font-semibold">Simpan Perubahan</span> agar data tersimpan secara permanen.
            </p>
          </div>

          {/* Stats ringkas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[.02] border border-white/5 rounded-xl p-3">
              <p className="text-[9px] uppercase tracking-[.1em] text-neutral-600">Kategori</p>
              <p className="text-xl font-black font-mono text-white mt-1">{Object.keys(kategoriData).length}</p>
            </div>
            <div className="bg-white/[.02] border border-white/5 rounded-xl p-3">
              <p className="text-[9px] uppercase tracking-[.1em] text-neutral-600">Total Item</p>
              <p className="text-xl font-black font-mono text-white mt-1">
                {Object.values(kategoriData).reduce((a, b) => a + b.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Toast */}
      <AnimatePresence>
        {confirmDelete && (
          <ConfirmModal
            label={confirmDelete}
            onConfirm={() => deleteKategori(confirmDelete)}
            onClose={() => setConfirmDelete(null)}
          />
        )}
        {toast && <Toast message={toast} onHide={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}