# 3Jobs — Aplikasi Rekomendasi Pekerjaan

Aplikasi web yang membantu pengguna menemukan lowongan kerja yang sesuai berdasarkan analisis CV menggunakan teknologi AI.

---

## Prasyarat — Install Ini Dulu Sebelum Mulai

Pastikan semua tools berikut sudah terinstall di komputer kamu:

### 1. Node.js (wajib, minimal v20.19.0)
- Download di: https://nodejs.org → pilih **LTS**
- Setelah install, cek versi di terminal:
  ```bash
  node -v
  npm -v
  ```

### 2. Git
- Download di: https://git-scm.com/downloads
- Setelah install, cek:
  ```bash
  git --version
  ```

### 3. Visual Studio Code
- Download di: https://code.visualstudio.com

### 4. Ekstensi VS Code yang Direkomendasikan
Buka VS Code → tekan `Ctrl+Shift+X` → cari dan install:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**

---

## Cara Clone Project

### 1. Buka terminal di VS Code
Tekan `` Ctrl+` `` (backtick) untuk membuka terminal

### 2. Clone repository
```bash
git clone https://github.com/username/nama-repo.git
```

### 3. Masuk ke folder project
```bash
cd nama-repo
```

### 4. Buka di VS Code
```bash
code .
```

---

## Instalasi & Menjalankan Project

Project ini terdiri dari 2 bagian: **Client** (frontend) dan **Server** (backend).  
Keduanya harus dijalankan **secara bersamaan di terminal yang berbeda**.

---

### Terminal 1 — Client (Frontend)

Di VS Code, buka terminal baru dengan `` Ctrl+` `` lalu jalankan:

```bash
# Masuk ke folder Client
cd Client

# Install semua package yang dibutuhkan
npm install

# Jalankan aplikasi
npm run dev
```

✅ Buka browser → **http://localhost:5173**

---

### Terminal 2 — Server (Backend)

Buka terminal **baru lagi** di VS Code dengan klik tombol **+** di pojok kanan atas panel terminal, lalu jalankan:

```bash
# Masuk ke folder Server
cd Server

# Install semua package yang dibutuhkan
npm install

# Jalankan server
npm run dev
```

✅ Server berjalan di **http://localhost:5000**

> 💡 Cara buka 2 terminal sekaligus di VS Code:
> Klik ikon **+** di panel terminal, atau tekan `Ctrl+Shift+5`

---

### Setup File .env untuk Server

Buat file `.env` di dalam folder `Server/`:

```bash
# Buat file .env di folder Server
cd Server
```

Isi file `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/3jobs
```

> ⚠️ File `.env` tidak boleh di-commit ke Git. Pastikan sudah ada di `.gitignore`

---

## Struktur Folder

```
Capstone_Test/
├── Client/                  # Frontend React + Vite
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── styles/          # CSS per komponen
│       │   │   ├── Sidebar.css
│       │   │   ├── Dashboard.css
│       │   │   ├── UploadCV.css
│       │   │   ├── JobRecommendations.css
│       │   │   └── JobDetail.css
│       │   ├── Sidebar.jsx
│       │   ├── Dashboard.jsx
│       │   ├── UploadCV.jsx
│       │   ├── JobRecommendations.jsx
│       │   └── JobDetail.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       └── index.css
└── Server/                  # Backend Express
    ├── .env                 # konfigurasi (buat manual, jangan di-commit)
    ├── index.js
    └── package.json
```

---

## Halaman Aplikasi

| Halaman | URL | Keterangan |
|---|---|---|
| Dashboard | `/dashboard` | Ringkasan skill & lowongan cocok |
| Rekomendasi | `/rekomendasi` | Daftar pekerjaan yang direkomendasikan |
| Upload CV | `/upload-cv` | Upload file CV format PDF/DOCX |
| Detail Pekerjaan | `/job/:id` | Detail lowongan & persentase kecocokan |

---

## Perintah Berguna

```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview

# Cek error kode
npm run lint
```

---

## Troubleshooting

**❌ Error: Node.js version tidak sesuai**
```bash
node -v
# Jika di bawah v20.19.0, update Node.js di https://nodejs.org
```

**❌ Error: Cannot find module / Module not found**
```bash
# Hapus node_modules dan install ulang
cd Client
rmdir /s /q node_modules   # Windows
npm install
```

**❌ Port 5173 atau 5000 sudah dipakai**
```bash
# Jalankan Client di port lain
npm run dev -- --port 3000
```

**❌ npm run dev tidak ditemukan**
```bash
# Pastikan kamu berada di folder yang benar
cd Client   # untuk frontend
cd Server   # untuk backend
```
