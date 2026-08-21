# Bahan Materi dari Project Knowledge Vault

Sumber: `E:\dev\projects\1-project-knowledge` (Obsidian vault, second brain lintas-project
untuk semua yang ada di `E:\dev\projects\`). Dibaca penuh pada 2026-08-21 — 11 project note,
1 ecosystem note, 3 note lepas, plus 1 PRD.

Dokumen ini **bukan** artikel jadi — ini daftar bahan mentah (teknis + naratif) yang layak
diangkat jadi Case Study, Writing (artikel/tutorial), atau Garden (thought pendek), dipetakan
ke schema konten situs ini (lihat `docs/structure-content.md`). Tiap butir ditandai format
yang paling cocok, sudut pandang (angle), dan level generalisasi yang dibutuhkan sebelum
publish.

## ⚠️ Sebelum publish: anonymisasi

Vault sumber menyebut nama klien/brand asli (Qhomemart, QSA, BBMI, domain `*.qhomeapps.id`
dst.), struktur organisasi, dan detail bisnis (harga hadiah, database prod). Untuk konten
publik di portfolio ini:

- Ganti nama brand/domain jadi deskriptif generik ("platform e-learning korporat", "sistem
  HRIS internal") kecuali user secara eksplisit mau menyebut nama klien.
- Jangan pernah publish kredensial, nama host/IP internal (`10.15.1.10`), atau path server.
- Angle teknis (pola desain, keputusan arsitektur, trade-off) aman untuk digeneralisasi dan
  dipublish — itu justru yang paling reusable sebagai artikel.

---

## Ringkasan cepat

| # | Bahan | Format terbaik | Kenapa menarik |
|---|---|---|---|
| 1 | Signed-URL/HMAC video streaming (qlearning + api-qlearning) | **Case Study** + **Writing (tutorial)** | Arsitektur konkret, ada trade-off jelas, dua service yang saling terkait |
| 2 | Membuktikan dependency produksi lewat log, bukan asumsi (apijogja ↔ supplier.qhomemart.cloud) | **Writing (essay)** | Cerita investigatif, generalizable ke "jangan percaya nama file" |
| 3 | Access control rework: hardcoded username → mapping table (ASM) | **Writing (tutorial/essay)** | Refactor konkret, before/after jelas |
| 4 | Matching antar sistem pakai nama, bukan ID (ASM ↔ HRIS) | **Garden (sapling)** → bisa naik ke **Writing** | Trade-off data-quality yang relevan lintas domain |
| 5 | Auth token opaque vs JWT (dua pilihan berbeda dalam satu ecosystem) | **Writing (essay)** | Perbandingan langsung, dua project nyata sebagai studi kasus |
| 6 | JWT check yang di-skip diam-diam (HRIS v2) | **Garden (seed)** — hati-hati publish | Pelajaran keamanan, generalisasi jadi "opt-in auth checks are a trap" |
| 7 | Webhook connection-less + idempotent (PRD Referral Karyawan) | **Writing (tutorial)** | Pola desain webhook yang applicable di mana saja |
| 8 | Regex/pattern extraction dari free-text field (kode referral di note POS) | **Garden (seed/sapling)** | Trik kecil tapi konkret |
| 9 | Membangun "second brain" lintas-project sendiri (vault ini) | **Writing (essay)** + **Case Study** | Meta — proses & konvensi vault ini sendiri layak jadi tulisan |
| 10 | Hidup dengan campuran CI2/CI3/CI4 dalam satu ecosystem | **Writing (essay)** | Realita legacy stack, relatable buat banyak dev |
| 11 | `devcrate` — CLI custom untuk local dev stack (nginx+PHP-FastCGI+MariaDB) | **Case Study** atau **Writing (tutorial)** | Tooling yang dibangun sendiri, ada keputusan desain (pre-check `nginx -t`, graceful reload) |
| 12 | "Confirmed / Structural / Debunked" — framework kepercayaan saat memetakan sistem tak terdokumentasi | **Garden (seed)** | Framework mini yang portable ke situasi lain |
| 13 | Known quirks yang sengaja tidak "diperbaiki" (typo kolom DB, unhashed static password) | **Garden (seed)** | Renungan singkat: bug vs. documented quirk |
| 14 | PRD Referral Karyawan (belum dibangun) sebagai studi desain produk | **Writing (essay)** | Proses berpikir merancang program insentif + anti-fraud |

---

## 1. Signed-URL video streaming untuk platform e-learning

**Sumber:** `qlearning.qhomeapps.id` ↔ `api-qlearning.qhomeapps.id`

Dua service terpisah sengaja dipecah tanggung jawabnya: API menentukan file video asli
(`e_video`) secara server-side dan menerbitkan token HMAC-SHA256 berumur pendek; web app
(bukan API) yang benar-benar men-stream file dari luar webroot lewat `GET /video/{token}`.
Kedua sisi berbagi satu secret (`VIDEO_TOKEN_SECRET`) — kopling erat yang disengaja, dengan
konsekuensi eksplisit: ganti algoritma token butuh deploy terkoordinasi di dua sisi.

**Angle artikel:** "Kenapa video course-mu tidak boleh punya URL langsung" — jelaskan pola
signed URL, kenapa dipisah jadi dua service (issuer vs server), trade-off shared-secret
coupling vs asymmetric signing (JWT/RSA) sebagai alternatif yang bisa dibahas.

**Angle case study:** Struktur `client / role / duration / liveUrl` cocok — ceritakan
requirement asli (video course korporat, tidak boleh didownload langsung), opsi yang
dipertimbangkan, kenapa HMAC symmetric dipilih di atas signed cloud-storage URL (mis. S3
presigned), dan kompromi yang diterima (kopling deploy).

---

## 2. Membuktikan dependency produksi dari log, bukan dari nama

**Sumber:** `02-Ecosystems/Qhome Ecosystem.md`, `apijogja.md`, `supplier.qhomemart.cloud.md`

Cerita nyata: dua project bernama mirip (`supplier.qhomedata.id` vs `supplier.qhomemart.cloud`)
ternyata **tidak berhubungan** meski nama sama persis — dicek lewat referensi kode, nihil.
Sebaliknya, `apijogja` (repo single-commit, tanpa dokumentasi, tanpa history) ternyata
**benar-benar backend produksi aktif** untuk `supplier.qhomemart.cloud` — dibuktikan dengan
mencocokkan setiap endpoint yang dipanggil (`qhomeprov2/supplier/login`, dst.) satu-satu ke
method controller yang persis sama namanya, lalu dikonfirmasi lewat log HTTP 200 di
`application/logs/api-*.php` sampai tanggal terakhir traffic tercatat.

**Angle artikel:** Metodologi tiga-tingkat kepercayaan yang dipakai vault ini —
**Confirmed** (tertulis di dokumentasi kedua sisi), **Structural** (cocok dari kode tapi
tidak tertulis), **Debunked** (nama mirip tapi terbukti tidak berhubungan) — sebagai
framework umum untuk audit dependency di codebase legacy tanpa dokumentasi. Bagus untuk
tulisan gaya "detective work" — nama sistem menipu, log tidak.

---

## 3. Refactor access control: hardcoded username → mapping table

**Sumber:** `asm.qhomemart.cloud.md` (Decisions: "Access control rework")

`M_arsip_akses` menggantikan skema lama yang mem-hardcode username langsung di kode, dengan
tabel mapping akses yang proper — didokumentasikan sebagai perbaikan yang disengaja, bukan
sekadar refactor kosmetik.

**Angle artikel:** Tutorial/essay tentang tanda-tanda kapan sebuah "if username == 'x'" perlu
naik jadi tabel akses, dan cara migrasi bertahap tanpa downtime pada sistem yang masih dipakai
harian.

---

## 4. Matching entitas antar-sistem pakai nama, bukan ID

**Sumber:** `asm.qhomemart.cloud.md`, `hris.qhomedata.id.md`

ASM mencocokkan data karyawan dari HRIS eksternal **lewat string nama**, bukan ID stabil —
keputusan yang didokumentasikan sadar, dengan catatan trade-off eksplisit di
`docs/feat/README.md`: nama duplikat dan mismatch kosakata antar sistem diterima sebagai
risiko, bukan bug.

**Angle:** Mulai sebagai **Garden seed** ("integrasi via nama itu utang teknis yang sadar
diambil, bukan kecelakaan") — bisa berkembang jadi Writing yang lebih panjang membahas
kapan integrasi loose-by-name masuk akal dibanding investasi bikin ID bersama/master data
management.

---

## 5. Dua pilihan auth token berbeda dalam satu ecosystem

**Sumber:** `api-qlearning.qhomeapps.id.md`, `hris.qhomedata.id.md`

Dalam ecosystem yang sama: `api-qlearning` pakai token opaque (`bin2hex(random_bytes(32))`,
tidak disimpan di session store — pilihan yang didokumentasikan, bukan kelalaian), sedangkan
`hris.qhomedata.id` pakai JWT (HS256) via `firebase/php-jwt`.

**Angle artikel:** Perbandingan langsung opaque token vs JWT dengan dua sistem nyata sebagai
studi kasus — kapan stateless JWT masuk akal (skala, tidak perlu revoke instan), kapan
opaque-random lebih simpel (tidak perlu decode/verify library, revoke = hapus baris DB).

---

## 6. Auth check yang opt-in — jebakan keamanan diam-diam

**Sumber:** `hris.qhomedata.id.md` (Decisions: dokumentasi risiko keamanan)

Didokumentasikan eksplisit di README project asli: `BD_Controller::auth()` (pengecekan JWT)
bersifat opt-in dan ternyata **tidak dipanggil oleh satupun controller v2** — rekomendasi
tertulis: "perlakukan setiap endpoint v2 sebagai publicly reachable sampai diperbaiki."

**Angle:** Ini isu keamanan nyata pada sistem yang masih aktif — **jangan publish detail
yang bisa dieksploitasi** (nama endpoint, domain). Tapi pelajarannya sendiri aman dan
berharga sebagai **Garden seed**: "auth middleware yang opt-in per-controller adalah bug
menunggu terjadi — defaultnya harus deny, bukan allow." Generalisasikan sepenuhnya, tanpa
menyebut sistem asli.

---

## 7. Webhook connection-less + idempotent

**Sumber:** `03-Notes/PRD - Program Referral Karyawan Qhomemart (Phase 1).md`

PRD (belum dibangun per 2026-08-19) mendesain webhook `POST /qhomepro/pos/transaction` yang
harus merespons `{status:ok}` secepatnya lalu lanjut proses di background (NFR: tidak boleh
menghambat submit POS), dan harus idempotent berdasar ID transaksi unik supaya retry/duplikat
tidak menggandakan omzet. Wajib logging ke file **sebelum** proses jalan, bukan sesudah.

**Angle artikel/tutorial:** Pola desain webhook receiver yang generik dan sangat reusable:
(1) respons cepat lalu proses async, (2) idempotency key, (3) log-before-process untuk
auditability. Tidak perlu nama klien sama sekali — ini murni pola arsitektur.

---

## 8. Ekstraksi pola dari free-text field

**Sumber:** PRD yang sama — kasir mencatat kode referral (`KRY-XXX-000`) di field catatan
bebas transaksi POS; sistem mendeteksi pola kode di dalam teks bebas tersebut, dengan aturan
tie-break eksplisit (jika ada >1 kode dalam satu catatan, hanya kode pertama yang valid yang
dihitung).

**Angle:** **Garden seed/sapling** ringan — trik regex-in-freetext sebagai workaround murah
ketika tidak ada field terstruktur khusus, plus catatan tentang aturan tie-break yang perlu
dipikirkan di awal (bukan ditambal belakangan).

---

## 9. Membangun second brain lintas-project sendiri

**Sumber:** seluruh struktur vault — `Conventions.md`, template, cara linking, skema
`Confirmed/Structural/Debunked`, dan `03-Notes/Saving a Claude Code Session.md`.

Ini meta, tapi justru berharga: dev yang mengelola 11 project legacy (campuran CI2/CI3/CI4,
sebagian tanpa README sama sekali) membangun vault Obsidian dengan konvensi eksplisit —
frontmatter schema per tipe note, aturan linking in-vault vs out-of-vault, dan level
kepercayaan berjenjang untuk klaim yang tidak terverifikasi ("structural" vs "confirmed").
Juga ada catatan eksplisit soal batas antara memory Claude Code (otomatis, tidak masuk vault)
vs menulis eksplisit ke `## Decisions` (yang jadi bagian second brain permanen).

**Angle artikel (kuat):** "Cara saya mendokumentasikan 11 project legacy yang setengahnya
tidak punya README" — proses membangun vault, kenapa levelling kepercayaan penting saat
banyak yang harus diinferensi dari kode, dan bagaimana ini beririsan dengan pakai AI
assistant (Claude Code) untuk riset lintas-codebase. Cocok jadi Case Study juga (subjek =
proses kerja sendiri, bukan project klien) atau Writing/essay yang lebih reflektif.

---

## 10. Hidup dengan campuran versi framework

**Sumber:** ringkasan tech stack di seluruh `01-Projects/`

Dalam satu ecosystem yang sama: `supplier.qhomedata.id` di CodeIgniter **2.1.4**, lima
project di CodeIgniter 3, tiga di CodeIgniter 4 — beberapa pasangan project (mis. HRIS ↔ ASM)
saling terintegrasi meski beda generasi framework total.

**Angle artikel:** Realita kerja di perusahaan dengan software estate yang tumbuh organik
selama bertahun-tahun — strategi bertahan (jangan migrasi semua sekaligus, integrasi via API
bukan shared codebase, dokumentasikan versi per project) dan kapan migrasi benar-benar worth
it vs dibiarkan.

---

## 11. `devcrate` — CLI custom untuk local dev stack

**Sumber:** `03-Notes/Adding a New Site on Devcrate.md`

Tooling internal (nginx + PHP-FastCGI + MariaDB, per-project `.test` vhost via HTTPS) dengan
CLI sendiri (`devcrate site add`, `set-php`, TUI wizard). Detail desain yang menarik: `nginx
-t` dijalankan **sebelum** reload karena nginx me-load seluruh `sites/` sebagai satu dokumen
— satu conf rusak bisa menggagalkan reload untuk *semua* vhost tanpa indikasi jelas kenapa.
Reload bersifat graceful (request in-flight selesai dengan config lama). Refuse overwrite
kecuali `--force`.

**Angle:** Kalau `devcrate` ini project buatan sendiri (bukan tool pihak ketiga), ini bahan
**Case Study** yang bagus — masalah nyata (banyak project lokal, tiap project butuh vhost +
PHP version berbeda), solusi (CLI + TUI), keputusan desain kecil yang penting (validate-
before-reload, graceful reload, overwrite guard). Kalau bukan buatan sendiri, tetap bisa jadi
**Writing (tutorial)**: "Pelajaran desain CLI dari tool internal ini" — validate-before-apply
sebagai pola umum untuk config reload di sistem apapun (nginx, k8s, dsb).

---

## 12. Framework "Confirmed / Structural / Debunked"

**Sumber:** `02-Ecosystems/Qhome Ecosystem.md`

Cara memberi label kepercayaan pada klaim hubungan antar-sistem yang tidak (atau belum)
terverifikasi penuh: **Confirmed** = tertulis di dokumentasi kedua sisi, **Structural** =
cocok dari pola kode tapi tak tertulis, **Debunked** = mirip nama tapi terbukti salah setelah
dicek.

**Angle:** **Garden seed** murni framework/mental model — tidak butuh konteks project sama
sekali, portable ke domain apapun (audit kode, riset, bahkan non-teknis): beri label eksplisit
pada tingkat kepercayaan sebuah klaim alih-alih menyamaratakan semua "saya pikir X terhubung
ke Y" jadi satu level keyakinan.

---

## 13. Known quirks yang sengaja dibiarkan

**Sumber:** `qlearning.qhomeapps.id.md` (Decisions: "Other documented quirks")

Dua contoh: kolom database bernama typo (`tr_attepmpt`) sengaja **tidak** diperbaiki karena
konvensi sudah terlanjur dipakai di banyak tempat; dan partisipan e-learning login dengan
password statis tidak di-hash — didokumentasikan sebagai quirk auth yang disadari, bukan
kecelakaan.

**Angle:** **Garden seed** — renungan pendek tentang batas antara "bug yang harus diperbaiki"
vs "quirk yang harganya memperbaiki lebih mahal dari membiarkannya," dan pentingnya menulis
eksplisit *"ini disengaja"* di kode/dokumentasi supaya dev berikutnya tidak menghabiskan waktu
mencoba "memperbaikinya".

---

## 14. PRD Referral Karyawan sebagai studi desain produk

**Sumber:** `03-Notes/PRD - Program Referral Karyawan Qhomemart (Phase 1).md` (lengkap)

PRD utuh untuk program insentif karyawan-membawa-customer, dengan detail desain yang matang:
kode referral permanen format `KRY-XXX-000`, tier hadiah akumulatif (bukan reset per
transaksi), constraint eksplisit "hanya transaksi offline," dan — paling menarik — motivasi
desainnya secara eksplisit adalah **menghindari kelemahan program referral customer
sebelumnya** (self-referral pakai customer lama, voucher hunter) dengan memindahkan insentif
ke sisi karyawan.

**Angle artikel:** Bagaimana desain produk/insentif belajar dari kegagalan versi sebelumnya —
bahas requirement anti-fraud yang eksplisit ditulis di awal (bukan ditambal setelah abuse
terjadi), dan bagaimana keputusan teknis (kode referral, deteksi pola, idempotent webhook)
diturunkan langsung dari requirement bisnis anti-fraud tersebut. Bisa jadi essay reflektif
tentang requirement gathering, terlepas dari sistemnya sudah dibangun atau belum.

---

## Catatan tambahan

- Beberapa project (`api-qsales`, `qsales.qhomeapps`, `supplier.qhomedata.id`) nyaris tanpa
  dokumentasi sama sekali — bahan materi darinya tipis, tapi *ketiadaan dokumentasi itu
  sendiri* adalah observasi yang konsisten dengan poin #9 dan #10 di atas.
- `kepuasan-pelanggan` belum ada kode sama sekali (folder kosong) — tidak ada bahan materi
  saat ini.
- `ic-stokdigital` punya isu keamanan terdokumentasi (kredensial hardcoded, CSRF/XSS
  dimatikan) — sama seperti poin #6, pelajarannya aman dipublish setelah digeneralisasi penuh
  (tanpa nama sistem/domain), tapi detail spesifiknya tidak boleh dipublikasikan selama masih
  berjalan di produksi.
