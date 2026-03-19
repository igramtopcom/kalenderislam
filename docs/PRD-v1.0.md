
PRODUCT REQUIREMENTS DOCUMENT
KalenderIslam.id
Kalender Hijriah, Masehi & Jawa untuk Muslim Indonesia


Field
Detail
Dokumen
Product Requirements Document (PRD)
Versi
v1.0 — Initial Release
Tanggal
Maret 2026
Penulis
R&D Agent / Product Team
Ditujukan Untuk
PM Agent — untuk dieksekusi bersama Dev Agent (Claude CLI)
Domain
KalenderIslam.id
Framework
Astro v4+ + Cloudflare Pages + Supabase
Status
Approved for Development

Catatan untuk PM Agent
Dokumen ini berisi seluruh user stories, acceptance criteria, dan spesifikasi fitur yang dibutuhkan untuk membangun KalenderIslam.id. Gunakan dokumen ini sebagai single source of truth saat berkoordinasi dengan Dev Agent (Claude CLI). Setiap feature memiliki ID unik (US-XXX) yang harus direferensikan dalam setiap task dan commit.

1. Ringkasan Produk

1.1 Problem Statement
Muslim Indonesia (248 juta orang) tidak memiliki satu platform web yang menyediakan ketiga sistem penanggalan yang digunakan sehari-hari — Hijriah, Masehi, dan Jawa — secara terintegrasi, akurat, cepat, dan berbahasa Indonesia. Platform global (IslamicFinder, MuslimPro) memiliki UI bahasa Inggris yang dominan, tidak memahami konteks lokal (sidang isbat Kemenag, kalender Jawa/weton), dan performa mobile yang buruk.

1.2 Solusi
Website kalender Islam evergreen yang:
Menggabungkan Hijriah + Masehi + Jawa dalam satu tampilan (seperti kalender dinding Indonesia)
100% berbahasa Indonesia native, bukan terjemahan
Berbasis algoritma — semua kalender dihitung otomatis, tidak perlu update konten per tahun
Core Web Vitals 95+ untuk performa mobile Indonesia (4G)
Sinkron resmi dengan Kemenag RI untuk tanggal hari besar

1.3 Target Pengguna
Persona
Deskripsi
Kebutuhan Utama
Frekuensi
Muslim Dewasa Indonesia
18–45 tahun, mobile Android, urban/semi-urban
Tanggal Hijri hari ini, jadwal sholat, jadwal Ramadan
Harian
Orang Jawa
25–60 tahun, Jawa Tengah/Timur/Yogyakarta
Weton, neptu, pasaran, hari baik pernikahan
Mingguan
Pengelola Masjid / Lembaga
Pengurus masjid, yayasan Islam, pesantren
Widget kalender untuk website, API untuk sistem
Bulanan

1.4 Prinsip Produk
Evergreen — kalender 2030 bekerja sempurna dari hari pertama deploy, tanpa input konten manual
Accurate First — kesalahan tanggal Idul Fitri = hilang kepercayaan komunitas selamanya
Indonesia First — desain, bahasa, dan fitur dioptimalkan untuk Muslim Indonesia, bukan adaptasi global
Performance First — LCP <1.5 detik, zero JS di halaman statis, Core Web Vitals hijau semua


2. Scope & Milestone

2.1 In Scope — MVP (Sprint 1–8)
Feature ID
Nama Fitur
Keterangan
Sprint
F-01
Kalender Utama 3 Sistem
Tampilan Hijriah+Masehi+Jawa per bulan dan tahun
1–3
F-02
Widget Tanggal Hari Ini
Real-time Hijri+Jawa hari ini, otomatis update tengah malam
1–2
F-03
Kalender Ramadan & Imsakiyah
Halaman Ramadan + imsakiyah 100+ kota
4–6
F-04
Jadwal Sholat Per Kota
Waktu sholat 5 waktu, 100+ kota, geolocation
5–6
F-05
Konverter Tiga Kalender
Konversi Masehi↔Hijri↔Jawa interaktif, URL shareable
3–4
F-06
Kalkulator Weton
Input tanggal lahir → weton, neptu, share card
3–4
F-07
Halaman Hari Besar Islam
8 hari besar, countdown, tanggal Kemenag+Muhammadiyah
4–5
F-08
Halaman Hari Libur Nasional
Daftar libur + cuti bersama dari SKB 3 Menteri
4
F-09
Download Kalender PDF
Download kalender bulanan/tahunan siap cetak A4
5
F-10
SEO & Structured Data
Metadata dinamis, JSON-LD, sitemap, OG image
2–8

2.2 Extended Scope (Pasca-MVP, Bulan 3–6)
F-11: PWA — installable dari browser, offline mode untuk kalender bulan ini
F-12: Push Notification — pengingat hari besar via Firebase Cloud Messaging
F-13: Widget Embed — script JavaScript untuk disematkan di website masjid/lembaga
F-14: Public REST API — endpoint /api/hijri, /api/sholat, /api/hari-besar
F-15: Sync Google Calendar & Apple Calendar — export .ics semua hari besar

2.3 Out of Scope (Versi 1)
Aplikasi native Android/iOS
Forum, komentar, atau fitur komunitas
Konten artikel/blog
Peta masjid atau pencarian masjid terdekat
Quran reader
Multi-bahasa (selain Bahasa Indonesia)


3. User Stories & Acceptance Criteria

Konvensi
Format: "Sebagai [persona], saya ingin [aksi], agar [manfaat]". Setiap US harus memiliki Acceptance Criteria yang terukur dan testable.

3.1 F-01 — Kalender Utama 3 Sistem
ID
User Story
Priority
Sprint
US-001
Sebagai Muslim Indonesia, saya ingin melihat kalender bulan ini dengan tanggal Hijriah dan Jawa di setiap hari, agar tidak perlu membuka beberapa sumber terpisah
P0
Sprint 1
US-002
Sebagai pengguna, saya ingin navigasi prev/next bulan yang cepat, agar bisa cek tanggal bulan lain dengan mudah
P0
Sprint 1
US-003
Sebagai pengguna, saya ingin melihat highlight hari ini, hari libur, dan hari Jumat dengan warna berbeda di kalender, agar mudah diidentifikasi
P0
Sprint 2
US-004
Sebagai pengguna, saya ingin URL /kalender/2027 langsung berfungsi tanpa perlu ada halaman yang dibuat manual, agar bisa bookmark dan bagikan link kalender tahun tertentu
P0
Sprint 1
US-005
Sebagai pengguna, saya ingin klik pada tanggal tertentu untuk melihat detail lengkap (Hijri, Jawa, neptu, hari besar jika ada), agar mendapat informasi lengkap dengan cepat
P1
Sprint 2

Acceptance Criteria — US-001
Acceptance Criteria
Detail
Tampilan 3 kalender
Setiap hari di grid menampilkan: angka Masehi (besar), angka Hijri (kecil di bawah), nama pasaran Jawa (terkecil di bawah)
Akurasi Hijri
Tanggal Hijri yang ditampilkan cocok dengan referensi Kemenag.go.id ±0 hari
Akurasi Jawa
Hari pasaran (Pon/Wage/Kliwon/Legi/Pahing) cocok dengan kalender Jawa fisik referensi
Semua tahun berfungsi
URL /kalender/[2024..2032] semua render benar tanpa error
Mobile responsive
Tampilan kalender tidak overflow pada layar 360px (Android entry-level)
Performa
LCP halaman /kalender/[tahun] < 1.5 detik pada simulasi 4G mobile

3.2 F-02 — Widget Tanggal Hari Ini
ID
User Story
Priority
Sprint
US-006
Sebagai pengguna yang buka homepage, saya ingin langsung melihat tanggal Hijri hari ini tanpa scroll, agar informasi paling penting langsung tersedia
P0
Sprint 1
US-007
Sebagai pengguna, saya ingin widget tanggal otomatis berubah di tengah malam tanpa refresh halaman, agar selalu akurat
P1
Sprint 2
US-008
Sebagai pengguna, saya ingin melihat weton hari ini (hari + pasaran) di homepage, agar tidak perlu menghitung sendiri
P1
Sprint 1

Acceptance Criteria — US-006
Acceptance Criteria
Detail
Above the fold
Widget tanggal hari ini visible tanpa scroll pada viewport 375px (iPhone SE)
Konten lengkap
Menampilkan: tanggal Masehi lengkap, nama hari, tanggal+bulan Hijri, tahun Hijri, weton (hari+pasaran), neptu
Featured snippet ready
Halaman memiliki structured data (speakable / FAQ) yang menjawab "tanggal hijriah hari ini"
Update otomatis
Widget berubah tepat pukul 00:00 WIB tanpa user perlu refresh

3.3 F-03 — Kalender Ramadan & Imsakiyah
ID
User Story
Priority
Sprint
US-009
Sebagai Muslim yang ingin bersiap Ramadan, saya ingin melihat countdown hari menuju Ramadan di homepage dan halaman dedicated, agar bisa mempersiapkan diri
P0
Sprint 4
US-010
Sebagai pengguna di Jakarta, saya ingin melihat jadwal imsak, sahur, subuh, dan buka puasa untuk kota saya selama 30 hari Ramadan, agar tidak salah waktu
P0
Sprint 5
US-011
Sebagai pengguna, saya ingin download imsakiyah dalam format PDF siap cetak, agar bisa dipasang di rumah atau masjid
P0
Sprint 5
US-012
Sebagai pengguna, saya ingin melihat imsakiyah untuk kota saya melalui URL /ramadan/2026/jakarta, agar bisa bookmark dan bagikan ke keluarga
P1
Sprint 6
US-013
Sebagai pengguna, saya ingin melihat perbedaan tanggal Ramadan versi Kemenag dan Muhammadiyah secara jelas, agar tidak bingung
P0
Sprint 4

Acceptance Criteria — US-010
Acceptance Criteria
Detail
Cakupan kota
Minimal 100 kota Indonesia tersedia di /ramadan/[tahun]/[kota]
Akurasi waktu
Waktu imsak, subuh, dzuhur, ashar, maghrib, isya akurat ±2 menit vs sumber Kemenag untuk kota tersebut
Metode kalkulasi
Menggunakan metode Kemenag Indonesia (Fajr 20°, Isha 18°) sebagai default
Format PDF
PDF download: layout A4 portrait, 30 baris (30 hari), 6 kolom waktu, header nama kota dan bulan, footer logo KalenderIslam.id
Fallback kota tidak ditemukan
Jika kota tidak ada di database, redirect ke /ramadan/[tahun] dengan pesan "Pilih kota Anda"

3.4 F-04 — Jadwal Sholat Per Kota
ID
User Story
Priority
Sprint
US-014
Sebagai pengguna, saya ingin melihat jadwal sholat hari ini untuk kota saya saat membuka /sholat/jakarta, agar langsung dapat informasi yang relevan
P0
Sprint 5
US-015
Sebagai pengguna mobile, saya ingin website mendeteksi lokasi saya otomatis dan menampilkan jadwal sholat yang tepat, agar tidak perlu pilih kota manual
P1
Sprint 6
US-016
Sebagai pengguna, saya ingin melihat waktu sholat berikutnya di-highlight, agar mudah tahu sholat apa yang harus dilakukan sekarang
P1
Sprint 5

3.5 F-05 — Konverter Tiga Kalender
ID
User Story
Priority
Sprint
US-017
Sebagai pengguna, saya ingin input tanggal Masehi dan langsung melihat padanannya dalam Hijri dan Jawa, agar bisa konversi tanggal penting seperti tanggal lahir
P0
Sprint 3
US-018
Sebagai pengguna, saya ingin URL hasil konversi dapat dibagikan via WhatsApp (misal: /konversi?tanggal=1990-05-17), agar bisa share ke keluarga
P1
Sprint 3
US-019
Sebagai pengguna, saya ingin tombol "Bagikan" yang membuat gambar card hasil konversi siap upload ke Instagram/WhatsApp
P2
Sprint 4

Acceptance Criteria — US-017
Acceptance Criteria
Detail
Tiga arah konversi
Mendukung konversi: Masehi→Hijri+Jawa, Hijri→Masehi+Jawa, tanggal Jawa (dengan pasaran)→Masehi+Hijri
Akurasi
Hasil konversi identik dengan output gregorianToHijri() dan getJawa() dari algoritma yang telah diverifikasi
Real-time
Hasil muncul saat user selesai input tanggal (onchange), tanpa perlu klik tombol
Range valid
Mendukung rentang 1 Januari 1900 — 31 Desember 2099
URL shareable
Parameter ?tanggal=YYYY-MM-DD di URL langsung menampilkan hasil konversi tanpa interaksi user

3.6 F-06 — Kalkulator Weton
ID
User Story
Priority
Sprint
US-020
Sebagai orang Jawa, saya ingin input tanggal lahir saya dan mengetahui weton (hari + pasaran) dan neptu saya, agar bisa mengetahui informasi Jawa tentang diri saya
P0
Sprint 3
US-021
Sebagai pengguna, saya ingin tombol share yang menghasilkan gambar weton saya yang menarik untuk dibagikan ke media sosial, agar viral
P1
Sprint 4
US-022
Sebagai pengguna return, saya ingin website mengingat weton saya sehingga langsung tampil saat kembali, agar tidak perlu input ulang
P2
Sprint 5

3.7 F-07 — Halaman Hari Besar Islam
ID
User Story
Priority
Sprint
US-023
Sebagai pengguna, saya ingin halaman /hari-besar/idul-fitri/2026 yang menampilkan tanggal resmi Kemenag dan tanggal Muhammadiyah secara berdampingan, agar tidak bingung
P0
Sprint 4
US-024
Sebagai pengguna, saya ingin melihat countdown hari menuju setiap hari besar di halaman masing-masing, agar bisa bersiap
P1
Sprint 4
US-025
Sebagai pengguna, saya ingin semua hari besar tersedia untuk 2024–2030 (misal /hari-besar/idul-adha/2028), agar bisa cek tanggal di masa depan
P0
Sprint 4

Acceptance Criteria — US-023
Acceptance Criteria
Detail
Dua sumber tanggal
Halaman selalu menampilkan: (1) Tanggal perkiraan berdasarkan algoritma Hijri, (2) Tanggal resmi Kemenag setelah sidang isbat (dari Supabase, nullable), (3) Tanggal Muhammadiyah (dari data statis)
Disclaimer
Jika tanggal resmi Kemenag belum tersedia (null), tampilkan badge "Menunggu Sidang Isbat" berwarna kuning
8 hari besar minimum
Ramadan, Idul Fitri, Idul Adha, Isra Miraj, Maulid Nabi, 1 Muharram, Nuzulul Quran, Lailatul Qadar
Programmatic generation
getStaticPaths() menghasilkan halaman untuk semua kombinasi event × tahun (2024–2030) = minimal 56 halaman

3.8 F-08 — Hari Libur Nasional
ID
User Story
Priority
Sprint
US-026
Sebagai pengguna, saya ingin melihat daftar hari libur nasional dan cuti bersama 2026 berdasarkan SKB 3 Menteri resmi, agar bisa merencanakan cuti
P0
Sprint 4
US-027
Sebagai pengguna, saya ingin semua hari libur ditandai di kalender utama, agar terlihat saat browsing kalender
P0
Sprint 2

3.9 F-09 — Download Kalender PDF
ID
User Story
Priority
Sprint
US-028
Sebagai pengguna, saya ingin download kalender bulan ini dalam format PDF siap cetak A4, agar bisa ditempel di rumah
P1
Sprint 5
US-029
Sebagai pengelola masjid, saya ingin download kalender tahunan 2026 yang mencakup semua bulan Hijri + Jawa + hari libur dalam satu file PDF
P2
Sprint 6

3.10 F-10 — SEO & Structured Data
ID
User Story
Priority
Sprint
US-030
Sebagai product owner, saya ingin setiap halaman memiliki title, description, dan OG image yang unik dan mengandung keyword target, agar Google mengindeks dengan benar
P0
Sprint 2
US-031
Sebagai product owner, saya ingin structured data JSON-LD tipe Event untuk setiap hari besar, agar muncul sebagai rich result di Google
P0
Sprint 4
US-032
Sebagai product owner, saya ingin sitemap.xml otomatis mencakup semua 1000+ halaman dengan priority yang tepat, agar semua halaman terindex
P0
Sprint 2
US-033
Sebagai product owner, saya ingin semua halaman mendapat skor Core Web Vitals "Good" di Google Search Console, agar tidak ada penalti SEO
P0
Sprint 8


4. Non-Functional Requirements

4.1 Performance
Metrik
Target
Kondisi Pengukuran
Tool
LCP (Largest Contentful Paint)
< 1.5 detik
4G mobile, Chrome DevTools throttling
PageSpeed Insights + Lighthouse CI
INP (Interaction to Next Paint)
< 100ms
Interaksi pada konverter & kalender
Web Vitals extension
CLS (Cumulative Layout Shift)
< 0.05
Scroll full page, semua gambar loaded
Lighthouse
Lighthouse Performance Score
≥ 95
Desktop dan Mobile
Lighthouse CI dalam pipeline
TTFB (Time to First Byte)
< 200ms
Dari Jakarta, Cloudflare edge
GTmetrix
Build time (1000+ pages)
< 5 menit
Astro build di Cloudflare Pages
Build logs

4.2 Accuracy
Komponen
Standar Akurasi
Metode Verifikasi
Konversi Hijri↔Masehi
±0 hari untuk 1900–2099
Crosscheck vs 100 tanggal random dari Kemenag.go.id
Kalender Jawa (pasaran)
±0 hari untuk rentang yang sama
Crosscheck vs kalender Jawa fisik Primbon referensi
Waktu Sholat
±2 menit vs Kemenag
Crosscheck 10 kota × 10 tanggal vs jadwal-sholat.kemenag.go.id
Tanggal Hari Besar
Selalu tampilkan "perkiraan" + update setelah isbat
Admin update Supabase dalam 2 jam setelah pengumuman resmi

4.3 Availability & Reliability
Uptime target: 99.9% (Cloudflare Pages SLA)
Halaman statis harus tetap serve dari CDN cache meski Supabase down (data isbat nullable)
Zero downtime deployment — Cloudflare Pages atomic deploy
Rollback dalam < 5 menit jika deploy bermasalah

4.4 Security
Tidak menyimpan data personal pengguna (tanggal lahir di weton calculator hanya diproses client-side, tidak dikirim ke server)
Push notification token tersimpan di Supabase dengan row-level security
API endpoint /api/* menggunakan rate limiting Cloudflare (100 req/menit per IP)
Content Security Policy (CSP) header untuk mencegah XSS

4.5 SEO Requirements
Setiap halaman memiliki unique <title> mengandung keyword target + tahun + "KalenderIslam.id"
Meta description 150–160 karakter, mengandung primary keyword
Canonical URL pada setiap halaman untuk mencegah duplicate content
hreflang="id" pada semua halaman
robots.txt: allow semua halaman konten, disallow /api/, /admin/
Sitemap.xml otomatis, submit ke Google Search Console Indonesia
JSON-LD structured data: WebPage, Event, BreadcrumbList, FAQPage (untuk hari besar)


5. URL Architecture & Page Inventory

Catatan
Semua URL menggunakan huruf kecil, tanda hubung (-) sebagai pemisah kata, tanpa trailing slash. Halaman bertanda * dihasilkan secara programmatic oleh Astro getStaticPaths().

URL Pattern
Tipe
Jumlah Halaman
Keyword Target Utama
Priority Sitemap
/
Homepage
1
kalender islam hari ini, tanggal hijriah hari ini
1.0
/kalender/[tahun] *
Kalender tahunan
9 (2024–2032)
kalender islam 2026, kalender hijriah 2026
0.9
/kalender/[tahun]/[bulan] *
Kalender bulanan
108
kalender islam januari 2026
0.8
/ramadan/[tahun] *
Halaman Ramadan
9
jadwal ramadan 2026, imsakiyah ramadan
0.9
/ramadan/[tahun]/[kota] *
Imsakiyah per kota
900 (100 kota × 9 thn)
imsakiyah ramadan 2026 jakarta
0.7
/sholat/[kota] *
Jadwal sholat
100+
jadwal sholat jakarta hari ini
0.7
/hari-besar/[event]/[tahun] *
Halaman hari besar
63 (9 event × 7 thn)
idul fitri 2026 tanggal berapa
0.8
/kalender-jawa/[tahun] *
Kalender Jawa
9
kalender jawa 2026
0.8
/konversi
Triple date converter
1
konversi tanggal hijriyah ke masehi
0.7
/weton
Kalkulator weton
1
weton hari ini, kalkulator weton
0.7
/libur-nasional/[tahun] *
Hari libur nasional
9
hari libur nasional 2026, tanggal merah
0.7
/api/hijri
API docs
1
hijri calendar API Indonesia
0.4


6. Content & Data Requirements

6.1 Konten Statis (dalam repository — tidak perlu CMS)
Data 100+ kota Indonesia: nama, lat/lng, timezone (WIB/WITA/WIT), metode sholat
Daftar 9 hari besar Islam: slug, bulan Hijri, hari Hijri, deskripsi singkat, amalan utama
Daftar 34 provinsi dan kota-kota utama
Teks UI semua halaman dalam Bahasa Indonesia

6.2 Konten Dynamic (Supabase — update admin)
Tabel
Kapan Diupdate
Siapa
Frekuensi
official_dates
Setelah sidang isbat Kemenag diumumkan
Admin (non-developer)
4–6x/tahun
national_holidays
Setelah SKB 3 Menteri terbit (biasanya September)
Admin (non-developer)
1x/tahun
push_subscribers
Otomatis saat user subscribe notifikasi
Sistem (tidak perlu manual)
Berkelanjutan

6.3 Konten yang Dihitung Otomatis (tidak perlu input manual)
Kalender Hijriah semua tahun — algoritma Umm al-Qura
Kalender Jawa semua tahun — algoritma pasaran + neptu
Waktu sholat semua kota semua tanggal — adhan-js dengan koordinat kota
Countdown ke hari besar — JavaScript Date() real-time
OG image per halaman — Astro endpoint generatif


7. Admin Workflow

Admin tidak perlu kemampuan teknis. Semua update dilakukan melalui Supabase Table Editor (antarmuka seperti Google Sheets).

7.1 SOP Update Sidang Isbat
Kemenag mengumumkan hasil sidang isbat (biasanya H-1 Ramadan, H-1 Idul Fitri, dll.)
Admin login ke Supabase Dashboard (dashboard.supabase.com)
Buka tabel official_dates
Cari row dengan event = "ramadan_start" (atau "idul_fitri", dll.) dan tahun yang sesuai
Update kolom tanggal_resmi dengan tanggal resmi hasil isbat
Klik Save — website otomatis terupdate dalam <5 menit (Astro ISR revalidation)
Verifikasi halaman /hari-besar/[event]/[tahun] sudah menampilkan tanggal yang benar

Target SLA
Update tanggal resmi ke website dalam maksimal 2 jam setelah pengumuman sidang isbat Kemenag.


8. Definition of Done

Sebuah user story dianggap DONE jika semua kriteria berikut terpenuhi:

Kriteria
Detail
Acceptance Criteria
Semua AC yang tercantum di dokumen ini lulus
Tidak ada bug kritis
Tidak ada error console, tidak ada layout break di Chrome mobile 375px
Core Web Vitals
Halaman baru mendapat skor ≥ 90 di Lighthouse Mobile
SEO
Title, description, canonical, structured data terpasang dan valid di Rich Results Test
Cross-browser
Berfungsi di Chrome Android (primary), Safari iOS, Chrome Desktop
Accessibility
Semua form input memiliki label, semua gambar memiliki alt text
Code review
Claude CLI melakukan self-review sebelum commit ke main


9. Risiko & Mitigasi

Risiko
Dampak
Mitigasi
Tanggal isbat salah ditampilkan
KRITIS — hilang kepercayaan komunitas
Selalu tampilkan label "perkiraan"; update <2 jam setelah pengumuman; disclaimer di setiap halaman hari besar
Algoritma Jawa tidak akurat
Tinggi — user melaporkan weton salah
Unit test 200+ kasus; crosscheck vs 3 referensi kalender Jawa fisik; tombol "Laporkan kesalahan"
Google AI Overview mengurangi traffic
Sedang — query sederhana terjawab di SERP
Fokus pada interactive tools yang tidak bisa diganti AI; optimasi untuk featured snippet
Domain authority baru sulit rank keyword KD>40
Tinggi — traffic lambat datang
Prioritas 60 hari pertama: hanya keyword KD≤25; widget embed masjid untuk backlink organik
Supabase down saat update isbat
Rendah — site tetap serve dari CDN
Kolom tanggal_resmi nullable; fallback ke tanggal_perkiraan; Supabase 99.9% uptime SLA



KalenderIslam.id — PRD v1.0
Dokumen ini harus dibaca bersama Tech Spec sebelum memulai development.