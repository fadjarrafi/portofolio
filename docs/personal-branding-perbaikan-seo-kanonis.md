---
status: draft
nama-kerja: Personal Branding
dibuat: 2026-11-23
tags:
  - seo
  - personal-branding
---

# Perbaikan SEO: canonical, hreflang, redirect, dan sitemap fadjarrafi.my.id

Hasil cek 2026-11-23 pada beranda, `/garden/thoughts/en/base-cases-for-life/`, dan
`/writing/{en,id}/activation-function-in-deep-learning/`.

Tag canonical sudah benar di semua halaman yang dicek: absolute, HTTPS, self-referencing, dan
sama dengan `og:url`. URL tanpa trailing slash sudah 301 ke versi dengan slash.

## Yang perlu diperbaiki

- [ ] **Redirect HTTP ke HTTPS.** `http://fadjarrafi.my.id/` dan semua halaman lain menjawab 200
  tanpa redirect. Pasang 301 ke HTTPS di level server atau host agar berlaku untuk semua path.
- [x] **`x-default` hreflang tidak konsisten.** Halaman EN menunjuk `x-default` ke URL EN, halaman
  ID menunjuk ke URL ID. Semua halaman dalam satu grup hreflang harus menyatakan `x-default` yang
  sama. Pilih satu bahasa, misalnya EN, lalu perbaiki di template artikel `writing`.
- [x] **Canonical di halaman 404 (prioritas rendah).** Path yang tidak ada menampilkan 404 dengan
  `<link rel="canonical" href="https://fadjarrafi.my.id/404/">`. Halaman ini sudah memakai
  `noindex,nofollow`, jadi dampaknya kecil. Hapus canonical saja agar sinyalnya tidak bertentangan.
- [ ] **`www.fadjarrafi.my.id` menjawab 404.** Arahkan dengan 301 ke domain tanpa `www`.
  Ini butuh DNS record untuk `www` dan aturan redirect.

## Sitemap

Hasil cek 2026-11-23 pada `sitemap-index.xml` dan `sitemap-0.xml`.

Yang sudah benar: kedua file menjawab 200 dengan `application/xml`, `robots.txt` menunjuk ke
`sitemap-index.xml`, dan ke-63 URL di sitemap menjawab 200, memakai trailing slash, punya canonical
yang menunjuk ke dirinya sendiri, dan tidak ada yang `noindex`. Tidak ada URL ganda.

- [x] **12 link internal rusak (404), semuanya dari `/garden/thoughts/en/recursion/`.** Halaman
  tujuannya belum ada:
  - `/garden/concepts/`: `abstraction`, `base-case`, `complexity`, `emergence`, `iteration`,
    `mental-model`, `second-order-thinking`, `systems-thinking`
  - `/garden/thoughts/en/`: `iteration-vs-recursion`, `learning-queue`, `patterns-in-nature`,
    `problem-solving-patterns`

  Buat halamannya, atau ubah link menjadi teks biasa sampai halamannya siap.
- [x] **Link internal tanpa trailing slash.** 68 dari 131 link internal ditulis tanpa `/` di akhir
  (contoh `/writing/en/caching`), jadi setiap klik dan crawl melewati 301 lebih dulu. Samakan
  link di komponen dan konten dengan format URL canonical (pakai `/` di akhir).
- [ ] **`hreflang` belum ada di sitemap.** Artikel `writing` punya 23 pasangan EN/ID, tapi sitemap
  tidak memuat `xhtml:link`. Ini opsional karena hreflang sudah ada di `<head>`. Bila ingin
  ditambahkan, pakai opsi `i18n` di `@astrojs/sitemap`. `x-default` di poin atas tetap harus
  diperbaiki dulu.
- [ ] **`lastmod` kosong di 6 halaman indeks** (`/`, `/case-studies/`, `/writing/`,
  `/garden/concepts/`, `/garden/library/`, `/garden/thoughts/`). Opsional. Isi dengan tanggal
  konten terbaru di bagian tersebut lewat `serialize` di config sitemap.

## Laporan Google Search Console (2026-11-23)

| Status GSC | URL | Penyebab | Tindakan |
| --- | --- | --- | --- |
| Kesalahan pengalihan (11) | `/writing/en/*` tanpa `/`, di-crawl 27–28 Agu | nginx dulu me-redirect `https` ke `http://` (absolute redirect di belakang Cloudflare). Sudah diperbaiki di `9bc1dce` (2026-09-15); sekarang 301 ke path relatif lalu 200. Data GSC belum di-crawl ulang. | Tunggu validasi. Perbaiki link internal tanpa `/` agar Google tidak terus menemukan URL itu. |
| Halaman alternatif dengan tag kanonis yang tepat (1) | `http://fadjarrafi.my.id/` | Bukan error: Google memilih versi HTTPS sesuai canonical. Validasi "gagal" karena memang tidak ada yang diperbaiki. | Abaikan, atau aktifkan Always Use HTTPS di Cloudflare. |
| Tidak ditemukan 404 (1) | `https://www.fadjarrafi.my.id/` | `www` belum diarahkan. | Redirect 301 `www` ke domain utama. |
| Di-crawl, saat ini tidak diindeks (2) | `/writing/en/caching/`, `/writing/en/activation-function-in-deep-learning/` | Bukan masalah teknis: Googlebot berhasil mengambil halaman tapi memilih belum mengindeks. Umum untuk situs baru dengan sedikit backlink. | Request indexing, tambah link internal dan backlink. |

Sitemap kemungkinan gagal dibaca karena header `Content-Type` ganda dari nginx sebelum `9bc1dce`.
Sekarang `sitemap-index.xml` menjawab 200 dengan satu `Content-Type: application/xml`.

### Langkah di GSC

- [ ] Sitemaps: hapus entri lama, lalu kirim ulang `https://fadjarrafi.my.id/sitemap-index.xml`
  (dan `sitemap-0.xml` bila index tetap gagal). Pastikan property-nya Domain atau
  `https://fadjarrafi.my.id/`, bukan `http://` atau `www`.
- [ ] URL Inspection → Test Live URL → Request Indexing untuk artikel terpenting, dengan URL
  persis seperti di sitemap (HTTPS, pakai `/` di akhir). Kuota harian terbatas, sekitar 10 URL.
- [ ] Kesalahan pengalihan: klik Validasi Perbaikan lagi bila validasi lama sudah selesai/gagal.

## Cara cek ulang

```bash
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" http://fadjarrafi.my.id/
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.fadjarrafi.my.id/
curl -sSL https://fadjarrafi.my.id/writing/id/activation-function-in-deep-learning/ | grep -oiE '<link[^>]*hreflang[^>]*>'
# Link internal di halaman recursion yang masih 404
curl -sSL https://fadjarrafi.my.id/garden/thoughts/en/recursion/ | grep -oE 'href="/garden/[^"]*"' | sort -u
```
