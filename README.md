# KarirKu AI - Sistem Rekomendasi Pekerjaan Berbasis AI 

Aplikasi web untuk menganalisis CV dan memberikan rekomendasi pekerjaan menggunakan kecerdasan buatan.

## Tech Stack

- **Frontend**: React.js, Vite 
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Supabase) 
- **AI/ML**: Python (model terpisah)
- **Queue**: Bull + Redis
- **Storage**: Multer (file upload)
- **Deploy**: Varcel (frontend), Railway(backend)

## Tech Stack

- Register & Login dengan JWT
- Upload CV (PDF/DOCX)
- Analisis CV otomatis oleh AI
- Rekomendasi pekerjaan berdasarkan skill
- Analisis gap skill
- Simpan pekerjaan yang diminati 
- Edit profil pengguna 

---

## Cara Menjalankan Lokal

### 1. Clone repository

```bash
git clone https://github.com/leoeka/capstone_projek
cd repo-name
```

### 2. Setup Backend (Server)

```bash
cd Server
npm install
```

Buat file `.env` di folder `Server`:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=karirai_db
DB_USER=postgres
DB_PASSWORD=password_anda
JWT_SECRET=secret_key_anda
DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/karirai_db
```

Jalankan migration:

```bash
npm run migrate:up
```

Jalankan server:

```bash
npm start
```

### 3. Setup Frontend (Client)

```bash
cd Client
npm install
```

Buat file `.env` di folder `Client`:

```
VITE_API_URL=http://localhost:5000
```

Jalankan frontend:

```bash
npm run dev
```

### 4. Jalankan Redis

Pastikan Redis sudah terinstall dan berjalan:

```bash
redis-server
```

### 5. Jalankan AI Service

Pastikan model AI dari tim AI Engineer sudah berjalan di `http://localhost:8000`

### Struktur Folder 

```

Capstone_projek/
|--- Client/
|    |--src/
|    | |--components/
|    | |--pages/
|    | |--context/
|--- Server/
|    |--src/
|    | |--config/
|    | |--controllers/
|    | |--middleware/
|    | |--routes/
|    | |--services/
|    |--migrations/
|    |--uploads/
```

---

## Environment Variables

## Server
| Variable | Keterangan |
|---|---|
| PORT | Port server (default:5000) |
| DB_HOST | Host database PostgreSQL |
| DB_NAME | Nama database |
| DB_USER | Username database |
| DB_PASSWORD | Password database |
| JWT_SECRET | Secret key untuk JWT |
| DATABASE_URL | Connection string PostgreSQL |

### Client
| Variable | Keterangan |
|---|---|
| VITE_API_URL | URL backend API |