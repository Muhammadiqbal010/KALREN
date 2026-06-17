import requests

# URL endpoint API Inventory lo
URL = "http://localhost:8000/api/inventory/" 

# Data manual dari catatan lo
DATA_INVENTORY = [
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 3, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Hitam"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 1, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Hitam"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Hitam"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 3, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Hitam"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 3, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Putih"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Putih"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 3, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Putih"},
    {"nama_bahan": "Boxy", "kategori": "Baju", "stok": 3, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Putih"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 4, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Hitam"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 0, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Hitam"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 0, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Hitam"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 0, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Hitam"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Maroon"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 0, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Maroon"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 1, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Maroon"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Maroon"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Navy"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 0, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Navy"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 1, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Navy"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Navy"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "M", "warna": "Putih"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "L", "warna": "Putih"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 1, "satuan": "pcs", "min_stok": 3, "ukuran": "XL", "warna": "Putih"},
    {"nama_bahan": "Reguler", "kategori": "Baju", "stok": 2, "satuan": "pcs", "min_stok": 3, "ukuran": "XXL", "warna": "Putih"}
]

def seed():
    print(f"Memulai input {len(DATA_INVENTORY)} item ke Inventory API...")
    for item in DATA_INVENTORY:
        try:
            # Menggunakan API POST seperti modul Finance
            response = requests.post(URL, json=item)
            if response.status_code == 201:
                print(f"✅ Sukses: {item['nama_bahan']} ({item['warna']} {item['ukuran']})")
            else:
                print(f"❌ Gagal {item['nama_bahan']}: {response.text}")
        except Exception as e:
            print(f"⚠️ Error koneksi: {e}")

if __name__ == "__main__":
    seed()