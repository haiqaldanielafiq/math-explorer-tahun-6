# Math Explorer Tahun 6 📐

**Pembelajaran Matematik Interaktif - DSKP KSSR Semakan Tahun 6**

"Math Explorer Tahun 6" ialah platform pembelajaran Matematik interaktif moden yang direka khas untuk murid-murid Tahun 6 sekolah rendah di Malaysia. Platform ini menggabungkan nota visual, simulasi interaktif carta pai, latihan manipulasi sudut (45°, 90°, 180°), kuiz pentaksiran kendiri, dan portal pengurusan kandungan (CMS) khas untuk guru.

---

## 🌟 Ciri-ciri Utama

### 1. Bahagian Murid (Read-Only)
- **Utama (`/`)**: Halaman pendaratan menarik dengan pengenalan topik DSKP pilihan, kad aktiviti interaktif, dan navigasi mesra murid.
- **Topik Matematik (`/topik`)**: Perpustakaan topik modul pembelajaran dengan tag status terbitan/draf.
- **Nota & Pembelajaran (`/topik/[slug]`)**: Nota terstruktur dengan pengenalan, bahagian carta pai, nilai sudut (45°, 90°, 180°), dan panduan mentafsir data.
- **Aktiviti Interaktif (`/topik/[slug]/aktiviti`)**: Simulasi visual SVG carta pai interaktif dengan pengawal sudut (45°, 90°, 180°), peluncur kuantiti data, dan latihan mentafsir data secara dinamik.
- **Kuiz Pentaksiran (`/topik/[slug]/kuiz`)**: Kuiz pelbagai bentuk (soalan pilihan, tafsiran data) dengan maklum balas serta-merta, pecahan peratusan, dan sambutan confetti.
- **Pencapaian & Kemajuan (`/kemajuan`)**: Laporan simpanan kemajuan murid berasaskan `localStorage` tanpa memerlukan pendaftaran akaun.
- **Mengenai (`/mengenai`)**: Maklumat penjajaran kurikulum DSKP KPM.

### 2. Bahagian Guru / Pentadbir (Admin CMS)
- **Akses Pentadbir Selamat (`/admin/login`)**: Sistem log masuk berasaskan JWT cookie HTTP-only untuk seorang guru/admin authorized. Tiada pendaftaran awam bagi menjamin keselamatan kandungan.
- **Papan Pemuka (`/admin/dashboard`)**: Metrik ringkasan (Jumlah Topik, Diterbitkan vs Draf, Aktiviti, Soalan Kuiz) dan jadual pengurusan kandungan.
- **Pengurus Topik (`/admin/topik`)**: Cipta, sunting, padam, dan ubah status terbitan topik.
- **Editor Kandungan Blok Visual (`/admin/editor/[id]`)**: Editor blok visual modular (Tajuk, Perenggan, Tips/Callout, Formula, Contoh Pengiraan) untuk kemaskini kandungan tanpa menyunting kod sumber.
- **Pengurus Aktiviti & Kuiz (`/admin/aktiviti`, `/admin/kuiz`)**: Kawalan khusus untuk mengemaskini soalan aktiviti dan soalan kuiz.
- **Pratonton & Terbit (`/admin/preview/[id]`)**: Pratonton draf secara langsung sebelum diterbitkan kepada murid.

---

## 🛠️ Persediaan & Menjalankan Projek Secara Tempatan

### Keperluan Asas
- Node.js v18.x / v20.x / v22.x
- npm atau yarn

### Langkah Pemasangan
1. Klon repositori ini atau navigasi ke folder projek:
   ```bash
   cd math-explorer-tahun-6
   ```

2. Pasang kebergantungan (dependencies):
   ```bash
   npm install
   ```

3. Jalankan pelayan pembangunan (development server):
   ```bash
   npm run dev
   ```

4. Buka pelayar web dan layari `http://localhost:3000`.

---

## 🔑 Konfigurasi Kunci & Pentadbir (Admin Authentication)

Akaun guru secara lalai (default):
- **Nama Pengguna (Username):** `cikgu`
- **Kata Laluan (Password):** `cikgu123`

### Menyesuaikan Kredential Dalam Pengeluaran (Production)
Sediakan fail `.env.local` di direktori utama projek dengan pembolehubah persekitaran (environment variables) berikut:

```env
ADMIN_USERNAME=cikgu_utama
ADMIN_PASSWORD=KatalaluanRahsiaPilihanKorang2025!
ADMIN_JWT_SECRET=super-secret-jwt-key-custom-tahun-6
```

---

## 💾 Penyimpanan Data & Kelestarian (Persistence)

1. Kandungan modul disimpan dalam bentuk JSON terstruktur di `data/topics.json`.
2. Lapisan storan `src/lib/storage.ts` menguruskan bacaan/tulisan ke fail tempatan dan menyokong simpanan ingatan (memory fallback) apabila berada dalam persekitaran *read-only serverless* seperti Vercel.

---

## 🚀 Panduan Penyebaran (Deployment to Vercel)

1. Muat naik repositori ini ke GitHub / GitLab.
2. Log masuk ke akaun Vercel anda dan klik **"Add New Project"**.
3. Pilih repositori `math-explorer-tahun-6`.
4. Dalam tetapan **Environment Variables**, masukkan:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_JWT_SECRET`
5. Klik **Deploy**. Vercel akan membina aplikasi ini secara automatik.

---

## 📖 Panduan Guru: Cara Mengurus & Menerbit Kandungan

1. Pergi ke pautan **Portal Cikgu** di bahagian navigasi atau terus ke `http://localhost:3000/admin/login`.
2. Masukkan ID Guru (`cikgu`) dan kata laluan (`cikgu123`).
3. Di **Papan Pemuka Pentadbir**, anda boleh:
   - Menambah topik baharu (contohnya: Nombor dan Operasi, Pecahan, Peratus, Nisbah).
   - Menambah atau menyusun semula bahagian nota menggunakan **Editor Kandungan Blok**.
   - Menyimpan sebagai **Draf** atau menekan butang **Terbitkan Modul** untuk memaparkan kandungan secara langsung kepada murid.
   - Menekan **Pratonton** untuk menyemak paparan draf terlebih dahulu.
