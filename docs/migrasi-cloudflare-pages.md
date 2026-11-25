---
status: draft
nama-kerja: Migrasi ke Cloudflare Pages
dibuat: 2026-11-25
tags:
  - infra
  - cloudflare
  - migrasi
---

# Runbook migrasi fadjarrafi.my.id ke Cloudflare Pages

Dari: GitHub Actions → image GHCR → container nginx `portfolio` di homeserver → Cloudflare Tunnel
(akun teman). Ke: Cloudflare Pages di akun sendiri, project `portofolio`.

Tanda di dokumen ini:

- **[MANUAL]** langkah yang hanya bisa dikerjakan pemilik akun/domain.
- **[JANGAN]** hal yang tidak boleh dilakukan sebelum waktunya.

Status persiapan di repo: `public/_headers` dan dokumen ini. Build dan deploy dilakukan oleh
**integrasi Git Cloudflare Pages** (tanpa workflow GitHub Actions, tanpa API token). Deploy lama
(`deploy.yml`) tidak diubah dan tetap jalan sampai Pages stabil.

## 1. Keputusan dan batasan yang sudah diverifikasi

Dicek di dokumentasi resmi Cloudflare pada 2026-11-25.

| Batasan | Isi | Akibat |
| --- | --- | --- |
| Pages vs Workers | Halaman `/pages/` menyarankan "Start new projects with Workers". Pages belum dinyatakan deprecated. | Dipilih Pages sesuai keputusan. Bila nanti pindah ke Workers Static Assets, `_headers`/`_redirects` bisa dipakai ulang, tetapi `wrangler.jsonc`, penanganan 404, dan perintah lokal (`wrangler dev`) berubah. Workers tidak mendukung domain yang nameserver-nya bukan Cloudflare. |
| Apex domain di Pages | "that custom domain must be a zone on the Cloudflare account you have created your Pages project on." | `fadjarrafi.my.id` (apex) hanya bisa dipasang bila zone-nya ada di **akun Anda**. Zone di akun teman = apex Pages mustahil. |
| Subdomain di Pages | Tidak wajib zone Cloudflare; cukup CNAME ke `<project>.pages.dev`. Tambahkan dulu di dashboard Pages, baru CNAME, kalau tidak 522. | Hanya relevan untuk subdomain, bukan apex. |
| Tunnel lintas akun | "The cfargotunnel.com subdomain only proxies traffic for DNS records in the same Cloudflare account." | Tunnel teman hanya bisa melayani hostname di zone akun teman. Setelah zone pindah ke akun Anda, `personal.` butuh tunnel baru di akun Anda. |
| Pindah zone | DNSSEC dan zone hold harus dilepas sebelum pindah. Ekspor record dulu; bila tidak, Cloudflare mengimpor record proxied yang bisa menyebabkan error 1000. Domain di Cloudflare Registrar dipindah lewat permintaan terpisah (diterima akun tujuan maks. 5 hari). | Lihat jalur B. |

Sumber:
[Pages](https://developers.cloudflare.com/pages/),
[migrasi Pages→Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/),
[custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
[routing tunnel](https://developers.cloudflare.com/tunnel/concepts/routing/),
[pindah domain antar akun](https://developers.cloudflare.com/fundamentals/manage-domains/move-domain/),
[registrar antar akun](https://developers.cloudflare.com/registrar/account-options/inter-account-transfer/),
[`_headers`](https://developers.cloudflare.com/pages/configuration/headers/),
[`_redirects`](https://developers.cloudflare.com/pages/configuration/redirects/).

## 2. Dua jalur

Keadaan sekarang: zone di akun teman (nameserver `lola`/`valentin.ns.cloudflare.com`; pemilik
**[MANUAL]** perlu dipastikan di dashboard akun teman). Rencana Anda: zone dipindah ke akun Anda,
yaitu jalur B.

| | Jalur A: zone tetap di akun teman | Jalur B: zone pindah ke akun Anda (rencana) |
| --- | --- | --- |
| Apex ke Pages | Tidak bisa. | Bisa. |
| Yang mungkin | `www.` atau subdomain lain lewat CNAME; apex tetap di tunnel lama. | Apex + `www.` ke Pages. |
| `personal.` | Tidak berubah. | Wajib dipindah ke tunnel baru di akun Anda. |
| Risiko | Hampir nol, tetapi tujuan migrasi tidak tercapai untuk apex. | Gangguan DNS singkat; `personal.` harus diuji sebelum tunnel lama dimatikan. |

Pilih A hanya bila teman menolak memindahkan zone. Sisa dokumen ini menuliskan jalur B; jalur A
cukup langkah 3.1 (buat project) dan 6 (pakai subdomain, mis. `www.`).

## 3. Persiapan (tidak mengubah produksi)

### 3.1 Project Pages

1. **[MANUAL]** Di akun Anda: Workers & Pages → Create → Pages → **Connect to Git**. Pasang GitHub
   App Cloudflare dan batasi aksesnya ke repo `fadjarrafi/portofolio` saja. Nama project
   `portofolio` (bila terpakai, kabari).
2. **[MANUAL]** Pengaturan build:
   - Framework preset: Astro, atau None dengan isian di bawah.
   - Build command: `bun install --frozen-lockfile && bun run build`
   - Build output directory: `dist`
   - Environment variables (Production dan Preview): `SKIP_DEPENDENCY_INSTALL=1`,
     `BUN_VERSION=1.3.7`, `NODE_ENV=production`, `PUBLIC_GA_ID=<nilai yang sama dengan deploy lama>`.
   - Alasan: dokumen Cloudflare tidak menyebut perintah install bawaan untuk `bun.lock`, dan
     Bun default di build image adalah 1.4.4. `SKIP_DEPENDENCY_INSTALL=1` plus perintah install
     eksplisit memastikan lockfile beku, dan `BUN_VERSION` menyamakan versi dengan Dockerfile.
     Bun tidak dibaca dari `package.json`. Nilai `PUBLIC_GA_ID` jangan ditulis di repo.
3. **[MANUAL]** Settings → Builds & deployments → Production branch: `main`. Branch control
   preview: All non-Production branches (bawaan). Preview otomatis per branch dan per PR dari
   repo yang sama; Cloudflare menambah `X-Robots-Tag: noindex` pada preview, dan `_headers`
   menambahkannya untuk semua host `*.pages.dev`, termasuk alias produksi.
4. Branch yang sudah di-push (`dev`, `build/cloudflare-pages`) langsung menghasilkan preview
   setelah koneksi dibuat. Merge ke `main` menghasilkan deploy produksi di `portofolio.pages.dev`
   saja; domain kustom belum tersentuh.
5. Integrasi Git tidak bisa dialihkan ke Direct Upload nanti. Itu tidak masalah untuk situs ini.
   Kedua mode tidak saling konversi, jadi pilihan ini tetap.
6. Riwayat clone di build image tidak didokumentasikan. `lastmod` sitemap dibaca dari
   frontmatter (`astro.config.mjs`), bukan dari git, jadi tidak bergantung pada kedalaman clone.

### 3.2 Uji di `*.pages.dev` (hal yang belum bisa diuji lokal)

- [ ] Header `X-Robots-Tag: noindex` muncul di `portofolio.pages.dev` dan di alias branch.
- [ ] Domain kustom nanti **tidak** mengirim `X-Robots-Tag` (cek setelah cutover, langkah 7).
- [ ] 404 asli: `curl -I https://portofolio.pages.dev/tidak-ada/` → `404`.
- [ ] Semua uji di bagian 8 diulang terhadap `portofolio.pages.dev` (sitemap-nya masih berisi
      URL `https://fadjarrafi.my.id/...`, jadi bandingkan path dan canonical, bukan host).
- [ ] Log build Cloudflare memakai Bun 1.3.7 dan `bun install --frozen-lockfile` berhasil.
- [ ] Header cache (`/_astro/*` immutable, lainnya 1 hari) dan `Content-Type` XML.
- [ ] Perilaku `HEAD`/`gzip`/`brotli` dan HTTP/2 (Pages memampatkan otomatis; nginx dulu hanya gzip).

### 3.3 Inventaris sebelum menyentuh zone

Kerjakan di dashboard akun teman (atau minta teman mengirim ekspor). **[MANUAL]**

1. **Record DNS.** Ekspor BIND (`GET /zones/{id}/dns_records/export`, token DNS Read, atau
   Dashboard → DNS → Records → Export). Simpan ekspor di luar repo. Catat tiap record:

   | Tipe | Nama | Isi | Proxied? | TTL | Catatan |
   | --- | --- | --- | --- | --- | --- |
   | CNAME/A | `@` | tunnel teman `<uuid>.cfargotunnel.com` | ya | auto | situs ini |
   | CNAME | `www` | ? (404 sekarang, mungkin belum ada) | ? | | |
   | CNAME | `personal` | tunnel teman | ya | auto | **harus tetap hidup** |
   | MX | `@` | ? | tidak (MX tak bisa proxied) | | surat; hilang = email mati |
   | TXT | `@` | SPF `v=spf1 ...` | | | |
   | TXT | `_dmarc`, `*._domainkey` | ? | | | |
   | TXT | `@` / CNAME | verifikasi GSC (`google-site-verification=...`) | | | **jangan hilang** |
   | CAA, SRV, NS sub-delegasi | | ? | | | bila ada |
   | Lainnya | | ? | | | ditemukan saat ekspor |

   Kolom "?" diisi dari ekspor. Saya tidak punya akses ke zone, jadi tabel ini bukan data nyata.
2. **DNSSEC.** Status di DNS → Settings. Bila aktif, catat DS record dan di registrar mana ia
   dipasang. DNSSEC harus **dimatikan** sebelum zone pindah, dan DS di registrar dihapus dulu
   (tunggu TTL DS, biasanya sampai 24 jam) agar resolver tidak menolak domain (SERVFAIL).
3. **Redirect dan aturan.** Rules → Redirect Rules, Page Rules, Bulk Redirects, Transform Rules,
   WAF custom rules, Rate limiting, Configuration Rules, Cache Rules, Workers Routes. Foto layar atau
   ekspor tiap aturan. Aturan yang menyentuh `fadjarrafi.my.id` harus dibuat ulang di akun Anda.
4. **Pengaturan SSL/TLS.** Mode enkripsi, Always Use HTTPS, HSTS, minimum TLS, Authenticated
   Origin Pulls. Catat nilainya.
5. **Registrar.** Di mana domain terdaftar? Bila Cloudflare Registrar, perlu transfer
   antar akun terpisah. Bila registrar lain, cukup ganti nameserver.
6. **GSC.** Jenis property (Domain atau URL-prefix) dan metode verifikasi. Bila Domain +
   TXT, TXT harus ikut pindah. Catat juga akun Google pemilik property.
7. **Email routing / Zero Trust / Access** pada hostname terkait, bila ada.

## 4. Siapkan zone di akun Anda (jalur B), tanpa mengubah nameserver

1. **[MANUAL]** Cuplikan keadaan sekarang untuk pembanding rollback:
   ```bash
   dig +short NS fadjarrafi.my.id
   dig +short MX fadjarrafi.my.id
   dig +short TXT fadjarrafi.my.id
   dig +short DS fadjarrafi.my.id
   curl -sSI https://fadjarrafi.my.id/ | head -20
   curl -sSI https://personal.fadjarrafi.my.id/ | head -20
   ```
2. **[MANUAL]** Koordinasi dengan teman. Cloudflare memperlakukan zone sebagai satu akun
   pada satu waktu, jadi alur resmi di halaman "Move a domain between Cloudflare accounts"
   harus diikuti (hapus DNSSEC, lepas zone hold, ekspor record, tambahkan zone di akun
   tujuan, impor record, ganti nameserver). Baca halaman itu saat eksekusi; urutannya
   dapat berubah.
3. **[MANUAL]** Impor record ke akun Anda dari ekspor BIND. **Periksa proxied vs DNS-only**:
   record yang menunjuk `*.cfargotunnel.com` milik teman tidak boleh dibawa apa adanya
   (lihat bagian 5), karena akan berhenti bekerja di akun lain.
4. **[MANUAL]** Samakan pengaturan SSL/TLS, Always Use HTTPS (lihat bagian 6), dan aturan dari
   inventaris sebelum nameserver diganti.

## 5. Menjaga `personal.fadjarrafi.my.id` (tunnel baru di akun Anda)

Tunnel teman tidak bisa melayani hostname di zone akun Anda. Karena itu `personal.` dipindah dulu
ke tunnel baru, **diuji, dan baru** tunnel lama dimatikan.

1. **[MANUAL]** Di akun Anda: Zero Trust → Networks → Tunnels → buat tunnel baru, mis.
   `homeserver-personal`. Pasang `cloudflared` di homeserver sebagai **instans terpisah** dari
   instans milik teman (token berbeda). **[JANGAN]** menghentikan atau mengubah instans/tunnel lama.
2. **[MANUAL]** Tambah dua public hostname di tunnel baru: `personal.fadjarrafi.my.id` → layanan
   lokal yang sama dengan tunnel lama (catat URL dari konfigurasi lama), dan `fadjarrafi.my.id`
   → `http://localhost:3000` (container `portfolio`). Yang kedua menjaga apex hidup saat zone
   pindah dan menjadi jalur rollback (bagian 9).
   Ini membuat CNAME `personal` → `<uuid-baru>.cfargotunnel.com` di zone **akun Anda**. Selama
   zone belum pindah, record ini belum dipakai publik; itu yang membuat pengujian aman.
3. Uji sebelum cutover tanpa mengubah DNS publik, lewat resolusi paksa:
   ```bash
   # setelah nameserver zone berpindah ke akun Anda (langkah 6.4), sebelum tunnel lama dimatikan:
   curl -sSI https://personal.fadjarrafi.my.id/
   ```
   Bila ingin menguji sebelum nameserver pindah, tambahkan hostname uji sementara
   (mis. `personal-test.<domain-lain-di-akun-Anda>`) ke tunnel baru dan pastikan layanan terbuka.
4. Pastikan kedua tunnel (lama dan baru) hidup bersamaan di homeserver tanpa saling mengganggu
   (port lokal sama tidak masalah; keduanya hanya klien keluar).
5. Matikan tunnel lama hanya setelah `personal.` terbukti lewat tunnel baru **dan** seluruh
   cutover stabil (bagian 9). Itu keputusan teman.

## 6. Pengaturan di akun Anda sebelum cutover

- **Always Use HTTPS.** **[MANUAL]** SSL/TLS → Edge Certificates → Always Use HTTPS = On. Ini
  menutup temuan "HTTP menjawab 200" di
  `docs/personal-branding-perbaikan-seo-kanonis.md`. Mode enkripsi: Full (strict) tidak
  masalah untuk Pages; untuk `personal.` ikuti nilai lama dari inventaris.
- **Redirect `www`.** **[MANUAL]** Pages tidak bisa me-redirect host lain lewat `_redirects`
  (hanya path di host yang sama). Cara yang disarankan:
  1. DNS: record `www` (CNAME ke `fadjarrafi.my.id`, **Proxied**) agar request sampai ke edge Cloudflare.
  2. Rules → Redirect Rules → Single Redirect: bila hostname sama dengan `www.fadjarrafi.my.id`
     → dinamis `concat("https://fadjarrafi.my.id", http.request.uri.path)` (pertahankan query),
     status 301.
  3. Uji: `curl -sSI https://www.fadjarrafi.my.id/writing/` harus `301` ke `https://fadjarrafi.my.id/writing/`.
- **Apex di Pages.** **[MANUAL]** Pages project → Custom domains → Set up a custom domain →
  `fadjarrafi.my.id`. Cloudflare membuat/mengubah record `@` otomatis. Lakukan ini pada langkah
  cutover (bagian 7), bukan sebelumnya.
- **Jangan** menambahkan `X-Robots-Tag` atau `noindex` pada domain produksi. Aturan di
  `public/_headers` hanya cocok dengan host `*.pages.dev`.

## 7. Urutan cutover

Jalankan di jam sepi. Siapkan jendela pantau 1 jam. Semua langkah **[MANUAL]**.

1. Prasyarat lengkap: bagian 3 selesai, uji `*.pages.dev` lulus, inventaris DNS terisi,
   tunnel baru untuk `personal.` terpasang dan teruji (bagian 5), teman setuju.
2. Turunkan TTL record yang akan berubah (`@`, `www`) ke 300 detik, 24 jam sebelumnya.
3. DNSSEC: hapus DS di registrar, tunggu, lalu nonaktifkan di akun asal (bila aktif).
4. Pindah zone ke akun Anda (alur resmi, bagian 4.2). Ganti nameserver di registrar bila berubah.
   Agar apex tidak mati selama jendela ini, tunnel baru (bagian 5) sudah punya public hostname
   `fadjarrafi.my.id` → `http://localhost:3000` (container lama), sehingga record `@` di akun Anda
   menunjuk tunnel baru sejak zone aktif. Record yang menunjuk tunnel teman tidak boleh diimpor
   karena berhenti bekerja lintas akun.
5. Verifikasi zone aktif di akun Anda: MX, TXT (SPF/DKIM/DMARC/GSC) identik dengan ekspor.
   ```bash
   dig +short MX fadjarrafi.my.id
   dig +short TXT fadjarrafi.my.id
   ```
6. `personal.` → uji lewat tunnel baru (bagian 5.3). Jangan lanjut bila gagal.
7. Pasang custom domain `fadjarrafi.my.id` di project Pages (menggantikan record `@`).
   Tunggu status Active dan sertifikat terbit.
8. Pasang `www` + redirect (bagian 6) dan Always Use HTTPS.
9. Aktifkan lagi DNSSEC di akun Anda dan pasang DS baru di registrar (opsional, setelah stabil).
10. Verifikasi (bagian 8, terhadap domain produksi).

## 8. Verifikasi pasca-cutover

```bash
curl -sSI http://fadjarrafi.my.id/            # 301 ke https
curl -sSI https://www.fadjarrafi.my.id/       # 301 ke https://fadjarrafi.my.id/
curl -sSI https://fadjarrafi.my.id/writing/en/caching       # 1 redirect ke ...caching/
curl -sSI https://fadjarrafi.my.id/tidak-ada/ # 404, noindex di body, tanpa canonical
curl -sSI https://fadjarrafi.my.id/sitemap-index.xml        # 200, satu Content-Type: application/xml
curl -sSI https://fadjarrafi.my.id/ | grep -i x-robots-tag  # harus kosong
curl -sSI https://portofolio.pages.dev/ | grep -i x-robots-tag  # harus noindex
curl -sSI https://personal.fadjarrafi.my.id/  # sama seperti sebelum migrasi
```

- [ ] Semua URL di `sitemap-0.xml` menjawab 200 dengan canonical sama persis dengan URL sitemap.
- [ ] MX/TXT sama dengan cuplikan sebelum pindah; kirim dan terima satu email uji.
- [ ] GA menerima data (`PUBLIC_GA_ID` ada di hasil build).
- [ ] `/garden/concepts/#concept-base-case` terbuka dan menggulir ke kartu.

Catatan: Pages merespons redirect trailing slash dengan **308** (bukan 301 seperti nginx). 308
juga permanen dan diperlakukan Google setara 301.

## 9. Rollback

Container `portfolio` di homeserver **tetap hidup** dan deploy lama tetap aktif sampai Pages
stabil **7 hari** tanpa masalah (tanpa 5xx, sitemap terbaca GSC, email normal). Baru setelah itu
container, image GHCR, dan `deploy.yml` boleh dipensiunkan (commit terpisah, atas persetujuan).

Rollback cepat (selama zone masih bisa dikelola):
1. Di zone (akun Anda), ubah record `@` kembali ke tunnel yang melayani container `portfolio`.
   Karena tunnel teman tidak bisa dipakai lintas akun, **tunnel baru Anda harus punya public hostname
   `fadjarrafi.my.id` → `http://localhost:3000`** (port container lama). Siapkan hostname ini
   di tunnel baru **sebelum** cutover agar rollback tinggal mengganti record. **[MANUAL]**
2. Hapus custom domain dari project Pages bila perlu.
3. Pulihkan aturan/redirect dari foto inventaris bila ada yang berubah.
4. Rollback penuh ke akun teman (zone dikembalikan) hanya bila tunnel baru bermasalah; ikuti
   alur pindah zone di arah sebaliknya, termasuk DNSSEC.

Rollback deploy saja (kode, bukan DNS): Pages → Deployments → pilih deployment sebelumnya →
Rollback to this deployment.

## 10. Google Search Console setelah cutover

**[MANUAL]**, mengikuti `docs/personal-branding-perbaikan-seo-kanonis.md`.

- [ ] Pastikan property masih terverifikasi (TXT/CNAME verifikasi ikut pindah). Bila gagal,
      verifikasi ulang dengan metode DNS.
- [ ] Sitemaps: hapus entri lama, kirim ulang `https://fadjarrafi.my.id/sitemap-index.xml`
      (dan `sitemap-0.xml` bila index gagal).
- [ ] URL Inspection → Test Live URL pada beranda dan beberapa artikel; Request Indexing untuk
      yang terpenting.
- [ ] Laporan "Kesalahan pengalihan": Validasi Perbaikan ulang.
- [ ] "Tidak ditemukan 404" (`www`): validasi setelah redirect `www` aktif.
- [ ] "Halaman alternatif dengan tag kanonis" (`http://`): akan hilang sendiri setelah
      Always Use HTTPS aktif; validasi bila ingin.
- [ ] Pantau Crawl stats dan Pages (Indexing) selama 7–14 hari; pastikan tidak ada URL
      `*.pages.dev` yang terindeks (`site:pages.dev portofolio`).

## 11. Hasil uji lokal (2026-11-25)

Dijalankan dengan `wrangler@4.168.0 pages dev dist` pada hasil `bun run build` (64 halaman, Bun 1.4.4
lokal; CI memakai 1.3.7 sesuai `package.json`).

| Uji | Hasil |
| --- | --- |
| 63 URL di `sitemap-0.xml` → status dan canonical | 63/63 status 200, canonical sama dengan URL sitemap, 0 selisih |
| URL tanpa slash (`/writing/en/caching`, `/garden/concepts`, `/case-studies/devflow`) | 308 sekali ke versi dengan slash, lalu 200 |
| `/index.html` | 308 ke `/` |
| URL tidak ada (`/tidak-ada/`, `/a/b/c.html`) | 404 asli; `meta robots noindex,nofollow`; tanpa `<link rel="canonical">` |
| `robots.txt` | 200, `text/plain; charset=utf-8` |
| `rss.xml`, `sitemap-index.xml`, `sitemap-0.xml` | 200, satu `Content-Type: application/xml` |
| `x-default` EN/ID | 23 grup hreflang, 0 grup tidak konsisten |
| Link internal | 98 target unik, 0 rusak, 0 tanpa slash |
| `/_astro/*.js` | `public, max-age=31536000, immutable` |
| `/favicon.ico`, `/og-image.png` | `public, max-age=86400` (tanpa immutable) |
| `/data/*.json` | `public, max-age=3600` |
| Halaman HTML | `public, max-age=0, must-revalidate` (default Pages) |
| `X-Robots-Tag: noindex` | ada untuk Host `portofolio.pages.dev` dan `abc.portofolio.pages.dev`; kosong untuk Host `fadjarrafi.my.id` (disimulasikan lewat header `Host`) |
| `/garden/concepts/#concept-base-case` di Chrome headless | halaman 200, elemen ada, `<details>` terbuka, tampil di viewport |

Belum bisa diuji lokal (ditandai di bagian 3.2): perilaku host `*.pages.dev` sungguhan,
sertifikat, HTTP→HTTPS, redirect `www`, kompresi di edge, serta build di Cloudflare (versi Bun, `PUBLIC_GA_ID`, perintah install).
Chrome via ekstensi tidak tersedia di sesi ini, jadi uji browser memakai Chrome headless
(DevTools Protocol), bukan tampilan visual manual.

## 12. Perilaku nginx yang dipindahkan

| nginx | Pages |
| --- | --- |
| `try_files $uri $uri/ $uri.html` + redirect slash | Bawaan Pages (308); terbukti di uji |
| `absolute_redirect off` | Tidak perlu: redirect Pages memakai host asli |
| `error_page 404 /404.html` | Bawaan: `404.html` disajikan dengan status 404 |
| `expires 1y; immutable` untuk semua aset | `public/_headers`: immutable hanya `/_astro/*` (berhash); file `public/` 1 hari |
| `.xml` → `application/xml` | Bawaan Pages (satu header); tidak perlu aturan |
| gzip | Otomatis di edge |
| (baru) cegah `*.pages.dev` terindeks | `X-Robots-Tag: noindex` pada `https://:project.pages.dev/*` |
| (baru) HTTP→HTTPS dan `www` | Pengaturan Cloudflare, bagian 6 (bukan file repo) |

`_redirects` sengaja tidak dibuat: tidak ada redirect path yang perlu dibawa, dan redirect
`www` tidak bisa dibuat di sana.
