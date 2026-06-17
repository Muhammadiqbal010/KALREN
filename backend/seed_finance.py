import requests
from datetime import datetime

# URL endpoint FastAPI lo
URL = "http://localhost:8000/finance/transaksi"

data_mentah = [
    ("04/09/2025", "Expense", "Pembelian", "Baju 4", 137000, "Transfer"),
    ("05/09/2025", "Expense", "Pembelian", "Woven 330", 91600, "Transfer"),
    ("05/09/2025", "Expense", "Pembelian", "Tali hangtag 100", 19300, "Transfer"),
    ("05/09/2025", "Expense", "Pembelian", "Ziplock 50", 126000, "Transfer"),
    ("06/09/2025", "Expense", "Pembelian", "Plastik Packing 100", 21400, "Transfer"),
    ("08/09/2025", "Expense", "Pembelian", "Sablon Dtf 1 meter", 150000, "Transfer"),
    ("14/09/2025", "Expense", "Produksi", "Jahit Woven 4", 20000, "Cash"),
    ("16/09/2025", "Expense", "Pembelian", "Sablon Dtf 5 meter", 470000, "Transfer"),
    ("17/09/2025", "Expense", "Pembelian", "Cetak Stiker 1", 11000, "Transfer"),
    ("20/09/2025", "Expense", "Pembelian", "Baju 19", 637000, "Transfer"),
    ("20/09/2025", "Expense", "Pembelian", "Mesin Sablon 1", 280600, "Transfer"),
    ("21/09/2025", "Expense", "Pembelian", "DTF remover 1", 34000, "Transfer"),
    ("22/09/2025", "Income", "Income", "Modal rendi", 2000000, "Transfer"),
    ("23/09/2025", "Expense", "Produksi", "Jahit Woven 16", 57000, "Transfer"),
    ("03/10/2025", "Income", "Income", "Penjualan baju 1", 100000, "Transfer"),
    ("04/10/2025", "Expense", "Pembelian", "Baju 3", 109000, "Transfer"),
    ("08/10/2025", "Expense", "Pembelian", "Gantungan 3", 30000, "Transfer"),
    ("08/10/2025", "Expense", "Pembelian", "Baju 3", 101000, "Transfer"),
    ("08/10/2025", "Expense", "Pembelian", "Sablon Dtf 1 meter", 140000, "Transfer"),
    ("08/10/2025", "Expense", "Pembelian", "Canva 1", 28000, "Transfer"),
    ("14/10/2025", "Income", "Income", "Penjualan baju 2", 100000, "Transfer"),
    ("14/10/2025", "Income", "Income", "Modal iqbal", 1400000, "Transfer"),
    ("14/10/2025", "Income", "Income", "Modal iqbal", 600000, "Cash"),
    ("14/10/2025", "Income", "Income", "Penjualan baju 1", 100000, "Transfer"),
    ("16/10/2025", "Expense", "Pembelian", "Gantungan dan hanger 12 pcs", 119399, "Transfer"),
    ("16/10/2025", "Expense", "Produksi", "Jahit Woven 6 pcs", 18000, "Transfer"),
    ("17/10/2025", "Expense", "Lain-lain", "Admin bank", 14000, "Transfer"),
    ("18/10/2025", "Expense", "Pembelian", "Sambungan 6", 17538, "Transfer"),
    ("19/10/2025", "Expense", "Pembelian", "Wifi reapeter 1", 76300, "Transfer"),
    ("21/10/2025", "Expense", "Pembelian", "Perlengkapan live", 409070, "Transfer"),
    ("11/11/2025", "Expense", "Pembelian", "Baju 24", 838000, "Transfer"),
    ("15/11/2025", "Income", "Income", "Penjualan baju 1", 65000, "Transfer"),
    ("17/11/2025", "Expense", "Pembelian", "Baju 4", 149000, "Transfer"),
    ("24/11/2025", "Expense", "Produksi", "Jahit Woven", 84000, "Transfer"),
    ("28/11/2025", "Income", "Income", "Baju 3", 182200, "Transfer"),
    ("28/11/2025", "Expense", "Pembelian", "Baju", 389000, "Transfer"),
    ("30/01/2026", "Income", "Income", "Baju", 130000, "Transfer"),
    ("26/01/2026", "Income", "Income", "Baju", 100000, "Cash"),
    ("03/02/2026", "Income", "Income", "Baju", 100000, "Transfer"),
    ("09/02/2026", "Expense", "Marketing", "Iklan tiktok", 111000, "Transfer"),
    ("28/02/2026", "Income", "Income", "Baju", 100000, "Transfer"),
    ("18/03/2026", "Income", "Income", "Baju", 50000, "Cash"),
    ("08/04/2026", "Income", "Income", "Baju", 100000, "Transfer"),
    ("10/04/2026", "Expense", "Pembelian", "Baju", 306000, "Transfer"),
    ("14/04/2026", "Expense", "Pembelian", "Polyflex", 182000, "Transfer"),
    ("14/04/2026", "Income", "Income", "Baju", 147117, "Transfer"),
    ("17/04/2026", "Income", "Income", "Investasi iqbal", 1050000, "Transfer"),
    ("17/04/2026", "Expense", "Pembelian", "Baju boxy", 1050000, "Transfer"),
    ("21/04/2026", "Expense", "Produksi", "Jahit Woven", 108000, "Transfer"),
    ("01/05/2026", "Expense", "Pembelian", "Polyflex", 60500, "Transfer"),
    ("01/05/2026", "Expense", "Pembelian", "Polyflex", 398000, "Transfer"),
    ("01/05/2026", "Expense", "Pembelian", "Hangtag", 356000, "Transfer"),
    ("01/05/2026", "Income", "Income", "Investasi rendi", 814500, "Transfer"),
    ("14/05/2026", "Expense", "Pembelian", "Wallpaper", 145000, "Transfer"),
    ("03/05/2026", "Income", "Income", "Baju 1 pcs", 60000, "Cash"),
    ("03/05/2026", "Income", "Income", "Baju 1 pcs", 50000, "Transfer"),
    ("14/06/2026", "Income", "Income", "Baju 2 pcs", 100000, "Cash")
]

def seed():
    print(f"Memulai input {len(data_mentah)} transaksi...")
    for row in data_mentah:
        payload = {
            "tanggal": datetime.strptime(row[0], "%d/%m/%Y").strftime("%Y-%m-%d"),
            "flow": row[1],
            "kategori": row[2],
            "keterangan": row[3],
            "gross_amount": float(row[4]),
            "potongan": 0.0,
            "metode": row[5].capitalize()
        }
        
        try:
            response = requests.post(URL, json=payload)
            if response.status_code == 201:
                print(f"✅ Sukses: {row[3]}")
            else:
                print(f"❌ Gagal {row[3]}: {response.text}")
        except Exception as e:
            print(f"⚠️ Error: {e}")

if __name__ == "__main__":
    seed()