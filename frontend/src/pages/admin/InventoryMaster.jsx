import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiTrash2, FiX, FiChevronDown, FiChevronRight, FiSave } from "react-icons/fi";
import { KATEGORI_DATA as DEFAULT_KATEGORI, SATUAN as DEFAULT_SATUAN } from "../../config/inventoryMaster";

const BACKEND_URL = "https://backend-kalren.vercel.app";

/* ── API CALLS (Tanpa butuh variabel 'api') ── */
async function loadMaster() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/master/`);
    if (!response.ok) throw new Error("Gagal ambil data");
    return await response.json();
  } catch (err) {
    console.error("Gagal load dari server:", err);
    return { kategoriData: DEFAULT_KATEGORI, satuan: DEFAULT_SATUAN };
  }
}

async function saveMaster(data) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/master/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal simpan");
  } catch (err) {
    console.error("Gagal simpan ke server:", err);
    throw err;
  }
}

/* ── COMPONENTS ── */
function Tag({ label, onRemove, colorClass = "bg-white/5 border-white/10 text-white" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-semibold ${colorClass}`}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer ml-0.5">
          <FiX size={10} />
        </button>
      )}
    </span>
  );
}

function InlineAdd({ placeholder, onAdd }) {
  const [val, setVal] = useState("");
  const commit = () => { const v = val.trim(); if (v) { onAdd(v); setVal(""); } };
  return (
    <div className="flex items-center gap-2 mt-2">
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && commit()} placeholder={placeholder} className="flex-1 bg-white/[.03] border border-white/[.06] rounded-lg px-3 py-1.5 text-[11px] text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-all" />
      <button onClick={commit} disabled={!val.trim()} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-black disabled:opacity-30 hover:opacity-85 transition-all cursor-pointer shrink-0">
        <FiPlus size={12} />
      </button>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function InventoryMaster() {
  const [master, setMaster] = useState({ kategoriData: {}, satuan: [] });
  const [expanded, setExpanded] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaster().then(data => { setMaster(data); setLoading(false); });
  }, []);

  const update = (next) => { setMaster(next); setDirty(true); };
  const showToast = (msg) => setToast(msg);

  const save = async () => {
    try {
      await saveMaster(master);
      setDirty(false);
      showToast("Master data tersimpan di database!");
    } catch {
      showToast("Gagal menyimpan ke server!");
    }
  };

  const { kategoriData, satuan } = master;

  if (loading) return <div className="text-white text-center p-10">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-sm font-black tracking-[.2em] uppercase text-white">🗂 Master Data</h1>
        </div>
        <button onClick={save} disabled={!dirty} className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase disabled:opacity-30 hover:opacity-85 transition-all cursor-pointer">
           Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {Object.entries(kategoriData || {}).map(([kat, items], idx) => (
            <div key={kat} className="bg-[#111] border border-white/5 rounded-2xl p-5">
              <div className="flex justify-between mb-4">
                <span className="text-white font-bold">{kat}</span>
                <button onClick={() => setConfirmDelete(kat)} className="text-red-500"><FiTrash2 size={14}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(item => <Tag key={item} label={item} onRemove={() => {
                   const newKategoriData = {...kategoriData, [kat]: items.filter(i => i !== item)};
                   update({...master, kategoriData: newKategoriData});
                }} />)}
              </div>
              <InlineAdd placeholder={`Tambah ${kat}...`} onAdd={(v) => {
                 const newKategoriData = {...kategoriData, [kat]: [...items, v]};
                 update({...master, kategoriData: newKategoriData});
              }} />
            </div>
          ))}
          <InlineAdd placeholder="Tambah kategori baru..." onAdd={(v) => update({...master, kategoriData: {...kategoriData, [v]: []}})} />
        </div>
        
        {/* Satuan section */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 h-fit">
          <p className="text-white font-bold mb-4">Satuan</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {satuan.map(s => <Tag key={s} label={s} onRemove={() => update({...master, satuan: satuan.filter(i => i !== s)})} />)}
          </div>
          <InlineAdd placeholder="Tambah satuan..." onAdd={(v) => update({...master, satuan: [...satuan, v]})} />
        </div>
      </div>
      
      {toast && <div className="fixed bottom-6 right-6 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase">{toast}</div>}
    </div>
  );
}