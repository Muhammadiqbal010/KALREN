import { useState, useEffect } from "react";
import api from "../../api/axios";

const BUCKET_MAP = {
  Produksi: { icon: "🧵", subs: ["Jahit Woven", "Lainnya"] },
  Pembelian: { icon: "🛒", subs: ["Baju Reguler", "Baju Boxy", "Hangtag", "Ziplock", "Label Baju", "Bahan Baku", "Lainnya"] },
  Marketing: { icon: "📣", subs: ["Iklan TikTok", "Iklan Meta/FB", "Iklan Google", "Endorse", "Lainnya"] },
  Gaji: { icon: "💰", subs: ["Gaji Karyawan", "Gaji Freelance", "Bonus", "THR", "Komisi", "Lainnya"] },
  "Lain-lain": { icon: "📎", subs: ["Admin Bank", "Ongkir", "Operasional", "Listrik", "Internet", "Transport", "Lainnya"] },
};

const INCOME_SUBS = ["Penjualan", "Modal", "Investasi", "Refund/Retur"];

const getDefaultForm = () => ({
  tanggal: new Date().toISOString().split("T")[0],
  flow: "Expense",
  kategori: "Produksi",
  sub_kategori: "",
  keterangan: "",
  gross_amount: "",
  potongan: "",
  metode: "Transfer",
});

const rupiah = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
const formatInput = (val) => val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const parseNumber = (val) => Number(String(val).replace(/\./g, "").replace(/\D/g, "")) || 0;

export default function FinanceForm({ editData, onSuccess, onCancel }) {
  const isEdit = !!editData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getDefaultForm());
  const [grossDisplay, setGrossDisplay] = useState("");
  const [potDisplay, setPotDisplay] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({ ...editData, tanggal: editData.tanggal?.split("T")[0] });
      setGrossDisplay(formatInput(String(editData.gross_amount || 0)));
      setPotDisplay(formatInput(String(editData.potongan || 0)));
    }
  }, [editData]);

  const isIncome = form.flow === "Income";
  const subOptions = isIncome ? INCOME_SUBS : (BUCKET_MAP[form.kategori]?.subs || []);
  const net = parseNumber(form.gross_amount) - parseNumber(form.potongan);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Pastikan pakai parseNumber yang sudah ada
    const gross = parseNumber(form.gross_amount);
    const pot = parseNumber(form.potongan);

    const payload = {
      ...form,
      gross_amount: gross,
      potongan: pot,
      sub_kategori: form.sub_kategori || null,
      // Pydantic butuh tanggal dalam format string YYYY-MM-DD
      tanggal: form.tanggal, 
    };

    let response;
    if (isEdit) {
      response = await api.patch(`/finance/transaksi/${editData.id}`, payload);
    } else {
      response = await api.post("/finance/transaksi", payload);
    }

    if (onSuccess) onSuccess(response.data);
  } catch (err) {
    // Logika error lo sudah bagus, tetap pertahankan
    const detail = err?.response?.data?.detail;
    setError(Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : (detail || "Gagal menyimpan"));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 w-full max-w-xl mx-auto text-white shadow-2xl">
      <h2 className="text-lg font-black mb-4 uppercase">{isEdit ? "Edit Transaksi" : "Input Transaksi"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Flow Toggle */}
        <div className="md:col-span-2 flex bg-black p-1 rounded-xl border border-white/5">
          {["Income", "Expense"].map((type) => (
            <button key={type} type="button" onClick={() => setForm({ ...form, flow: type, kategori: type === "Income" ? "Income" : "Produksi", sub_kategori: "" })}
              className={`flex-1 py-2 rounded-lg font-bold text-sm ${form.flow === type ? "bg-white text-black" : "text-neutral-500"}`}>
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <input type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} className="bg-black p-3 rounded-lg border border-white/10 text-sm" />
        <select value={form.metode} onChange={e => setForm({...form, metode: e.target.value})} className="bg-black p-3 rounded-lg border border-white/10 text-sm">
          {["Transfer", "Cash", "QRIS"].map(m => <option key={m}>{m}</option>)}
        </select>

        {!isIncome && (
          <div className="md:col-span-2 grid grid-cols-5 gap-2">
            {Object.entries(BUCKET_MAP).map(([k, v]) => (
              <button key={k} type="button" onClick={() => setForm({...form, kategori: k, sub_kategori: ""})} 
                className={`p-2 rounded-lg border text-[10px] font-bold ${form.kategori === k ? "border-white bg-white/10" : "border-white/5"}`}>
                {v.icon} {k}
              </button>
            ))}
          </div>
        )}

        <select value={form.sub_kategori} onChange={e => setForm({...form, sub_kategori: e.target.value})} className="md:col-span-2 bg-black p-3 rounded-lg border border-white/10 text-sm">
          <option value="">Pilih Sub Kategori</option>
          {subOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <textarea value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} placeholder="Keterangan..." className="md:col-span-2 bg-black p-3 rounded-lg border border-white/10 text-sm h-20" />

        <input type="text" placeholder="Total Harga" value={grossDisplay} onChange={e => {setGrossDisplay(formatInput(e.target.value)); setForm({...form, gross_amount: e.target.value})}} className="bg-black p-3 rounded-lg border border-white/10 text-sm" />
        <input type="text" placeholder="Potongan" value={potDisplay} onChange={e => {setPotDisplay(formatInput(e.target.value)); setForm({...form, potongan: e.target.value})}} className="bg-black p-3 rounded-lg border border-white/10 text-sm" />

        <div className="md:col-span-2 bg-black p-4 rounded-lg border border-white/10 flex justify-between items-center">
          <span className="text-xs text-neutral-500 uppercase font-bold">Net Amount</span>
          <span className="text-xl font-black">{rupiah(net)}</span>
        </div>

        {error && <p className="md:col-span-2 text-red-500 text-xs text-center font-bold">{error}</p>}
        
        <div className="md:col-span-2 flex gap-2">
          {isEdit && <button type="button" onClick={onCancel} className="flex-1 py-3 border border-white/10 rounded-lg text-sm font-bold">Batal</button>}
          <button type="submit" className="flex-[2] py-3 bg-white text-black font-black rounded-lg text-sm">{loading ? "..." : isEdit ? "UPDATE" : "SIMPAN"}</button>
        </div>
      </form>
    </div>
  );
}