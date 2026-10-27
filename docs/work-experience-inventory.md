# Inventaris Pekerjaan — `E:\dev\projects`

> Disusun 2026-10-27 dari riwayat git tiap repo (commit atas nama `fadjardev <irfanrafi021@gmail.com>` dan `fadjarrafi / dev <dark.fir21@gmail.com>`), ditambah `BRIEF.md` / `README.md` / `docs/` tiap project.
> Ini bahan mentah untuk update CV & portfolio, belum versi final.

**Catatan akurasi:** commit lewat akun bersama `QHomemart` (merge PR / edit via GitHub web) tidak dihitung karena tidak bisa dipastikan siapa yang mengerjakan. Jadi angka di bawah adalah batas bawah.

---

## Ringkasan

| Project | Peran Anda | Stack | Commit Anda | Periode |
| --- | --- | --- | --- | --- |
| **HRIS** (`hris.qhomedata.id`) | Backend + API mobile, bug fixing, security | CodeIgniter 3, MySQL, Node.js Socket.io, FCM, JWT | 117 | Mar – Okt 2026 |
| **ASM — Asset & Inventory Management** (`asm.qhomemart.cloud`) | Kontributor utama; bangun modul Arsip & Gudang | CodeIgniter 3, MySQL, Bootstrap, PhpSpreadsheet, PDF | 128 | Jun – Okt 2026 |
| **QLearning** (`qlearning.qhomeapps.id`) | Fitur video, bulk module, pretest | CodeIgniter 4, AdminLTE 4, MySQL 8, ffmpeg | 43 | Mar – Agu 2026 |
| **QLearning API** (`api-qlearning.qhomeapps.id`) | REST API video & pretest | CodeIgniter 4, OpenAPI/Swagger | 14 | Mar – Jul 2026 |
| **QHOMEPRO V2** (ERP retail) | Fitur PO, Setting Harga, Laporan, Promo | CodeIgniter 2 HMVC (~90 modul), MySQL | 38 | Sep – Okt 2026 |
| **Supplier Portal** (`supplier.qhomemart.cloud`) | Modul Tagihan, stabilisasi, dokumentasi | CodeIgniter 3, mPDF, integrasi API internal | 38 | Jun – Sep 2026 |
| **ic-stokdigital** | Laporan stok, fix kartu stok, UI | CodeIgniter 3 HMVC | 15 | Mei – Jun 2026 |
| **devcrate** (`E:\dev`, open source) | Pembuat tunggal | Rust (TUI), nginx, multi-PHP, MariaDB, mkcert | ~88 (repo pribadi) | Jul – Okt 2026 |
| **devflow** | Pembuat tunggal | Python, Telegram Bot, Claude Code, opencode, MCP, git worktree | 5 | Okt 2026 |
| **Docs Verification Landing Page** | Revisi tampilan validasi | PHP, Tailwind | 1 | Okt 2026 |
| **vite-spike** | Eksperimen Laravel + Vite untuk devcrate | Laravel, Vite | — | Okt 2026 |

**Tidak ada commit atas nama Anda** (kemungkinan milik rekan / akun bersama): `api.qhomeapps.id`, `api-qsales`, `qsales.qhomeapps`, `bbmi`, `referral-landing-page`, `odoo-boilerplate`, `apijogja`, `supplier.qhomedata.id`, `kepuasan-pelanggan` (hanya dump SQL).

**Konteks perusahaan:** semua project kecuali devcrate/devflow adalah sistem internal grup **Qhomemart / PT QSA** (retail bahan bangunan & home improvement) — ERP, HRIS, e-learning, aset, portal supplier.

---

## Detail per Project

### 1. HRIS — Human Resource Information System
Sistem HR untuk seluruh karyawan grup: absensi (web + mobile), izin/cuti, approval berjenjang, kontrak, data karyawan. Backend juga melayani aplikasi mobile.

Yang Anda kerjakan:
- **Approval engine**: batch approval multi-item untuk semua jenis izin, bulk approval cuti full-chain untuk approver multi-level, endpoint badge pending-count, perbaikan resolusi `hak_akses` / role (IA, HEAD, EXECUTIVE, DIRECTUR, HRD).
- **Absensi & konkurensi**: `SELECT ... FOR UPDATE` pada clock-in/out untuk cegah duplikasi, fix race condition `absen3()`, retry deadlock pada `Log_model`, handling shift lintas tengah malam, fix io_mode finger di hari Sabtu.
- **Security hardening**: sentralisasi validasi API key (hapus key hardcoded), parameterisasi query `IN()` untuk tutup SQL injection, gate foto karyawan di balik key, berhenti tracking log query yang bocor, fix session logout akibat AJAX paralel.
- **API v2 (mobile)**: endpoint kartu keluarga, kontak darurat, master pendidikan, self-update data karyawan + approval HR, upload webp/heic, error JSON yang konsisten.
- **Push notification (FCM)**: timeout, logging kegagalan, trace token, nama pemohon di judul notifikasi izin terlambat.
- **Fitur HR**: jenis cuti Keguguran, cuti melahirkan, periode & sisa cuti di laporan, kontrak/mutasi (nomor kontrak, upload PDF), import shift via Excel dengan validasi.
- **Dokumentasi**: Swagger UI `/apidocs` dengan OpenAPI spec API v1 & v2, dokumentasi alur izin, write-up investigasi insiden (tile peta OSM diblokir, fix SQL injection).

### 2. ASM — Asset & Inventory Management
Aplikasi aset perusahaan: inventaris, armada kendaraan, permohonan aset, arsip dokumen. Anda kontributor terbanyak (128 commit).

Yang Anda kerjakan:
- **Form Archiver (modul baru, dari nol)**: 7 jenis permintaan arsip fisik & digital, approval berjenjang (Admin Arsip → SPV → Executive Manager) dengan role-gating, penomoran otomatis bulan Romawi, tanda tangan digital dari data HRIS, cetak PDF, laporan Excel bulanan, notifikasi bell dengan deep-link, jatuh tempo peminjaman + peringatan.
- **Modul Gudang (baru)**: register box arsip, alur Mutasi Dokumen antar lokasi, riwayat mutasi per dokumen, import data dari workbook.
- **Integrasi HRIS**: nama pemohon, jabatan, grup requester, dan tanda tangan diambil dari API HRIS.
- **Inventaris**: riwayat siklus lengkap aset (Barang Masuk → mutasi → Barang Keluar), auto-kondisi RUSAK saat mutasi ke gudang rusak, server-side pagination untuk listing besar (cegah freeze DataTables).
- **Transportasi**: export Excel data kendaraan, PR/PO & part list servis.
- **Role & akses**: pengetatan hak akses Requester per modul, menu user.
- **Dokumentasi**: rombak struktur dokumentasi (ADR, MODULES, DATABASE, PRD per fitur).

### 3. QLearning — Corporate E-Learning
Platform training internal: modul, materi PDF + video, tes, progress per hierarki organisasi.

Yang Anda kerjakan:
- **Video pipeline**: modul video, multi-video per materi, chunked upload + progress bar, ganti video in-place, pipeline kompresi ffmpeg via cron yang melapor status lewat API, streaming aman dengan **signed token** (bukan akses filename terbuka).
- **Bulk create module** lintas divisi dengan materi bersama.
- **Pretest**: authoring, preview, export, skor terpisah di laporan training.
- Sinkronisasi peserta (skip duplikat NIK), fix laporan lintas divisi.
- Dokumentasi arsitektur, database, routes, access control, deployment.

### 4. QLearning API
REST API untuk aplikasi mobile QLearning.
- Endpoint video token dengan kontrol akses berbasis divisi/subdivisi, multi-video per materi, endpoint pretest non-graded.
- Swagger UI + OpenAPI 3.0 untuk seluruh route (dev-only).
- Base URL berbasis env, dokumentasi lengkap (API reference, auth, database).

### 5. QHOMEPRO V2 — ERP Retail
Monolith ERP internal (~90 modul HMVC): pembelian, penjualan, stok, keuangan, laporan.
- **Purchase Order**: booking date jadi rentang tanggal (dengan backward compatibility + backfill data lama), status Express Urgent PO, sembunyikan kolom harga di cetak Memo untuk 4 varian PO, sort detail produk berdasarkan kode produk.
- **Setting Harga**: auto-lock rencana H+1 via lazy check.
- **Laporan Umur Produk**: kolom analisis penjualan & margin, growth %, perhitungan umur stok 30/360, threshold aging.
- **Promo & Master Produk**: panel contoh diskon dinamis, toggle New Post.
- **Performa**: percepat query kandidat Finalize Otomatis.
- Menulis PRD batch request dan menjaga PRD tetap sinkron dengan kode.

### 6. Supplier Portal
Portal untuk supplier mengelola katalog, foto produk, tagihan, laporan penjualan.
- **Modul Tagihan**: validasi dokumen wajib per tipe PO (4 tipe), generate PDF PO konsinyasi & titik, batas upload 2 MB, simpan dokumen atomik, log riwayat upload, mode test dengan dummy PO generator.
- **Stabilisasi**: kompatibilitas mPDF vendored dengan PHP baru (`each()`, curly-brace offset), guard null di login, logging request API dengan retensi 3 bulan.
- Dokumentasi project, PRD, test plan issue, diagram alur (SVG).

### 7. ic-stokdigital — Inventori Multi-Gudang
- Laporan posisi stok di kartu + filter level stok, join mutasi blok ke laporan.
- Fix saldo kartu stok (urutan transaksi, double-count union), fix SQL injection di modul blok.
- Sidebar & layout form seragam, toast menggantikan `alert()`, dokumentasi frontend & arsitektur.

### 8. devcrate — Portable Multi-PHP Dev Stack (proyek pribadi, open source)
Alternatif XAMPP/Laragon untuk Windows, repo `github.com/fadjardev/devcrate-stack`, sudah rilis sampai **v0.3.0**.
- CLI + TUI dashboard ditulis dalam **Rust**.
- Nginx dengan vhost `.test` per project via HTTPS (mkcert, cek & reissue sertifikat), tiap vhost dipin ke versi PHP tertentu lewat FastCGI.
- Kelola banyak versi PHP + extension + Xdebug yang cocok build-nya, MariaDB, PostgreSQL, Redis, RabbitMQ, Node, Bun, Python.
- One-command setup, autostart, release zip + checksum, proxy vhost untuk app non-PHP, supervisi `npm run dev`, quick-create Laravel/WordPress.
- Dipakai sendiri sebagai lingkungan dev harian untuk semua project di atas.

### 9. devflow — AI Dev Workflow via Telegram (proyek pribadi)
Orkestrasi agen AI: Claude Code merencanakan & mereview, opencode menulis kode, developer menyetujui dari Telegram.
- Pipeline plan → gate 1 → code → verify → review → gate 2 → close.
- Satu git worktree + branch per task, vhost devcrate sementara, verifikasi otomatis (HTTP check, `php -l`, phpunit, screenshot headless Playwright).
- MCP server sebagai satu-satunya jalur tulis ke vault Obsidian, permission ruleset + watchdog untuk agen.

### 10. Lain-lain
- **Docs Verification Landing Page** — revisi tampilan halaman validasi keaslian dokumen Qhomemart.
- **1-project-knowledge** — vault Obsidian berisi catatan tiap project, peta ekosistem Qhome, request & task. Menunjukkan kebiasaan dokumentasi.
- **vite-spike** — spike Laravel + Vite untuk memvalidasi dukungan devcrate (kesimpulan: tidak perlu HMR proxy).

---

## Tema yang Menonjol (untuk CV / portfolio)

1. **Full-stack PHP di sistem internal produksi**: CodeIgniter 2, 3, dan 4 sekaligus, termasuk legacy monolith ERP ~90 modul.
2. **Workflow approval & dokumen**: approval berjenjang di HRIS, Form Archiver, Tagihan supplier.
3. **Keandalan & konkurensi**: row locking, retry deadlock, upsert, transaksi atomik.
4. **Security**: tutup SQL injection, hapus API key hardcoded, gate akses file sensitif.
5. **Integrasi antar sistem**: HRIS ↔ ASM, QLearning web ↔ API (signed token), Supplier Portal ↔ API ERP, FCM ke aplikasi mobile.
6. **Media pipeline**: chunked upload, kompresi video ffmpeg, streaming dengan signed token.
7. **Dokumentasi & API design**: OpenAPI/Swagger di 2 project, ADR, PRD, write-up insiden.
8. **Developer tooling & AI engineering**: devcrate (Rust) dan devflow (Python + agen AI + MCP).

---

## Draft Bullet CV (English)

**Software Engineer — Qhomemart (PT QSA)** · 2026 – sekarang *(sesuaikan tanggal mulai; commit pertama yang tercatat Mar 2026)*

- Maintained and extended 7 internal production systems (HRIS, ERP, e-learning, asset management, supplier portal, inventory) on CodeIgniter 2/3/4 and MySQL, shipping 390+ commits across them.
- Built the Form Archiver and Warehouse modules in the asset management system from scratch: 7 request types, multi-tier approval, HRIS-sourced digital signatures, PDF printing, and Excel reporting.
- Designed batch and multi-level leave approval for the HRIS mobile API and eliminated duplicate clock-ins with row-level locking and deadlock retries.
- Hardened the HRIS API by centralizing API-key checks, removing hardcoded keys, and parameterizing queries vulnerable to SQL injection.
- Built the e-learning video pipeline: chunked uploads, ffmpeg compression via cron, and signed-token streaming shared between the web app and REST API.
- Documented 2 REST APIs with OpenAPI 3.0 / Swagger UI and maintained ADRs and PRDs alongside code changes.

**Personal projects**

- **devcrate** (Rust): portable multi-PHP development stack for Windows with per-project HTTPS vhosts, version-pinned PHP, and a TUI dashboard; released v0.3.0.
- **devflow** (Python): Telegram-driven AI development workflow that orchestrates Claude Code and opencode with per-task git worktrees, automated verification, and human approval gates.

---

## Yang Perlu Anda Konfirmasi Sendiri

- **Tanggal mulai kerja & jabatan resmi** — git hanya menunjukkan commit pertama Anda Mar 2026 (HRIS).
- **Angka dampak bisnis** (jumlah karyawan pengguna HRIS, jumlah supplier, jumlah modul training, dsb.) — tidak ada di kode; angka seperti ini membuat bullet CV jauh lebih kuat.
- **Kontribusi lewat akun `QHomemart`** — jika sebagian commit akun bersama itu milik Anda, angka commit di atas bisa lebih besar.
- **Apakah devcrate repo publik** — kalau ya, cantumkan link GitHub-nya di CV & portfolio.
- **Kerahasiaan** — semua sistem Qhomemart adalah internal; pastikan boleh menyebut nama sistem / domain di portfolio publik, atau samarkan (mis. "HRIS untuk grup retail").
