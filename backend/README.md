# KALREN Backend API

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
python run.py
```

uvicorn app.main:app --reload

# 1. Masuk ke folder backend KALREN
cd "F:\KALREN\KALREN V2 WEB\KALREN\backend"

# 2. Aktifkan virtual environment (Wajib agar library core/security dll kebaca)
.\venv\Scripts\activate

# 3. Jalankan server 
uvicorn app.main:app --reload
 

# 1. Masuk ke folder frontend KALREN
cd "F:\KALREN\KALREN V2 WEB\KALREN\frontend"

# 2. Jalankan server development React
npm start