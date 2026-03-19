
DESIGN SYSTEM
KalenderIslam.id
Panduan Desain untuk Dev Agent — Tanpa Perlu Designer Tersendiri


Tujuan
Dokumen ini adalah satu-satunya sumber kebenaran desain saat Dev Agent (Claude CLI) membangun KalenderIslam.id. Semua keputusan tentang warna, font, spacing, dan komponen sudah didefinisikan di sini — tidak perlu menebak, tidak perlu bertanya ulang.

Dokumen
Detail
Versi
v1.0 — diekstrak dari Homepage Mockup yang sudah disetujui
Baca Bersama
PRD v1.0 + Tech Spec v1.0
Sumber kebenaran
File KalenderIslam-Homepage-Mockup.html (sudah dikirimkan bersama)
Framework
Tailwind CSS v3 + CSS Variables (cho các giá trị custom)
Arah Estetika
Islamic Modernism — hangat, elegan, terpercaya, mobile-first

1. Color System

Seluruh palette dideklarasikan via CSS custom properties di :root{}. Tailwind config akan meng-extend variabel-variabel ini.

1.1 Green Palette — Warna Utama
Tên biến
HEX
Màu swatch
Digunakan untuk
--green-900
#062917
  ████  
Background footer, hero pattern overlay
--green-800
#0D3D22
  ████  
Hero card background, dark sections
--green-700
#155232
  ████  
Tombol primary, highlight hari ini, nav logo
--green-600
#1D6B42
  ████  
Link hover, icon accent
--green-500
#1D9E75
  ████  
Active state, live badge, tool card border top
--green-400
#2EC98F
  ████  
Live dot animation, active prayer time
--green-200
#9FE1CB
  ████  
Teks di atas background gelap, subtitle di dark bg
--green-100
#D4F4EA
  ████  
Background badge puasa
--green-50
#F0FAF5
  ████  
Surface terang, input bg, calendar header, icon bg

1.2 Gold Palette — Warna Aksen
Tên biến
HEX
Màu swatch
Digunakan untuk
--gold-600
#A07820
  ████  
Teks di badge libur, gold text tebal
--gold-500
#C9A227
  ████  
Titik hari libur, Ramadan CTA, nilai weton
--gold-400
#E2BC45
  ████  
Teks logo icon, angka countdown Ramadan, aksen emas
--gold-100
#FBF3D5
  ████  
Background badge libur

1.3 Warna Netral & Teks
Tên biến
HEX
Màu swatch
Digunakan untuk
--cream
#FDFAF4
  ████  
Background seluruh halaman (jangan gunakan putih murni)
--ink
#141C14
  ████  
Teks utama — body, heading. Jangan gunakan #000
--ink-muted
#3D4A3D
  ████  
Nav links, teks sekunder
--ink-light
#6B7A6B
  ████  
Placeholder, metadata, subtitle kecil
--border
#D6E8DC
  ████  
Border gunakan rgba(29,107,66,.12) — hijau transparan, terasa alami

Aturan Border
JANGAN gunakan border: 1px solid #ccc atau border-color: gray. Selalu gunakan rgba(29,107,66,.12) — ini adalah green-600 dengan opacity 12%, terasa hijau alami bukan abu-abu dingin.

1.4 Semantic Colors (status)
Status
Warna Latar
Warna Teks
Digunakan Saat
Success / libur Islam
--gold-100 (#FBF3D5)
--gold-600 (#A07820)
Badge "Hari Libur"
Info / puasa
--green-100 (#D4F4EA)
--green-700 (#155232)
Badge "Puasa Wajib"
Warning / perkiraan
--amberLt (#FEF3C7)
#92400E
Label "Menunggu Isbat"
Error / belum ada data
#FEE2E2
#991B1B
Tanggal belum dikonfirmasi
Highlight hari ini
--green-700 (#155232)
#FFFFFF
Sel hari ini di kalender

2. Typography System

2.1 Keluarga Font
Variabel
Font
Dimuat dari
Digunakan untuk
--serif
Lora
Google Fonts
Judul section, nama bulan, tanggal hero, teks logo, judul Ramadan
--sans
Plus Jakarta Sans
Google Fonts
Teks body, tombol, label, nav, semua teks UI
--arabic
Amiri
Google Fonts
Bismillah di hero, nama Allah dalam aksara Arab

Import
Paste link ini ke <head> — sudah mencakup semua weights yang dibutuhkan:
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Amiri:wght@400;700&display=swap" rel="stylesheet">

2.2 Skala Tipografi
Token
Size (rem)
Weight
Line-height
Digunakan untuk
hero-date
clamp(2rem,4vw,2.8rem)
700
1.1
Tanggal besar di hero card
h1-serif
1.4rem
600
1.3
Judul section (Lora)
h2-section
1.05rem
600
1.3
Label bulan kalender (Lora)
h3-card
0.92rem
600
1.4
Judul card, nama tool
body
1rem (16px)
400
1.6
Teks body default
body-sm
0.85rem
400–500
1.5
Teks sekunder, deskripsi tool
label
0.78rem
400–500
1.5
Metadata, tanggal, subtitle kecil
caption
0.72rem
500–600
1.4
Label huruf besar, badge, nav links
micro
0.65–0.68rem
600
1.3
Teks badge, sub-teks hari kalender

2.3 Tipografi Sel Kalender — Kasus Khusus
Penting
Sel kalender harus menampilkan 3 baris teks dalam ruang kecil. Ini adalah spec yang tepat, tidak boleh diubah sembarangan.

Element CSS class
Size
Weight
Color (state: default)
Color (state: today)
.d-masehi
0.85rem
600
--ink (#141C14)
#FFFFFF
.d-hijri
0.58rem
400
--green-600 (#1D6B42)
--green-200 (#9FE1CB)
.d-jawa
0.55rem
400
--ink-light (#6B7A6B)
rgba(255,255,255,.65)
.d-masehi (Jumat)
0.85rem
600
--green-700 (#155232)
#FFFFFF

3. Spacing & Layout

3.1 Spacing Scale
Gunakan kelipatan 4px. Tailwind classes yang sesuai dicantumkan bersama.

Value
px
Tailwind
Digunakan untuk
2px
2
gap-0.5
Gap antar sel calendar grid
4px
4
p-1
Badge padding vertical
8px
8
p-2, gap-2
Badge padding horizontal, micro gap
10px
10
gap-2.5
Triple date grid gap, prayer bar gap
12px
12
p-3
Prayer item padding, nav logo gap
16px
16
p-4
Nav button padding, section gap nhỏ
20px
20
p-5
7 kolom, gap 2px, padding .8rem padding
24px
24
p-6
Padding hero card (gunakan 2.5rem = 40px aktual)
32px
32
p-8
Padding section besar
40px
40
p-10
Padding hero card aktual (2.5rem)

3.2 Border Radius Scale
Value
Digunakan untuk
6px (rounded-md)
Tombol tab kalender, badge kecil
8px (rounded-lg)
Nav logo icon, nav CTA button, cal nav button, countdown unit
10px (rounded-xl)
Calendar day cell (.cal-day)
12px (rounded-xl)
Date pill (hero), hari besar item, prayer bar item
16px (rounded-2xl)
Tool card
20px (rounded-2xl)
Calendar card, ramadan banner
24px (rounded-3xl)
Hero left card
999px (rounded-full)
Pill badge, live badge, prayer item, weton badge

3.3 Breakpoints & Layout
Breakpoint
Width
Perubahan Layout
Mobile (default)
< 700px
Grid 1 kolom, tools-grid 1 kolom, font clamp kecil
Tablet
700px–900px
Tools-grid 2 kolom, hero tetap 1 kolom
Desktop
> 900px
Hero: 2 kolom (1fr 440px), max-width 1200px centered

Nilai Responsif Aktual
Formula
Hasil
Page padding
clamp(1rem,4vw,3rem)
Min 16px, max 48px
Hero padding top
clamp(2rem,5vw,4rem)
Min 32px, max 64px
Hero date size
clamp(2rem,4vw,2.8rem)
Min 32px, max 45px
Calendar column width
440px fixed
Hanya di desktop, stack di mobile

4. Component Specifications

4.1 Navigation Bar
Property
Value
Height
60px tetap
Background
rgba(253,250,244,.92) + backdrop-filter: blur(12px)
Border bottom
1px solid rgba(29,107,66,.12)
Position
sticky top-0, z-index 100
Logo icon size
34×34px, border-radius 8px, bg --green-700
Logo text
Lora 1.05rem/600, color --green-800
Logo .id text
color --green-500 (hijau muda)
Nav link
Plus Jakarta Sans 0.82rem/500, color --ink-muted, hover --green-600
CTA button
bg --green-700, color white, 7px 16px padding, 8px radius, 0.8rem/600
CTA hover
bg --green-600

4.2 Prayer Times Bar
Property
Value
Background
--green-900 (#062917)
Height
auto (wrap jika mobile)
Prayer item (default)
bg rgba(255,255,255,.06), border rgba(255,255,255,.09), radius 999px, 5px 12px padding
Prayer item (active)
bg rgba(29,158,117,.25), border rgba(29,158,117,.5)
Prayer name
0.7rem/500, rgba(255,255,255,.5) — default; --green-200 — active
Prayer time
0.82rem/600, white — default; --green-400 — active
City label
0.72rem/600, --green-200, uppercase, letter-spacing .08em

4.3 Hero — Today Card (background hijau gelap)
Property
Value
Background
--green-800
Border radius
24px
Padding
2.5rem 2.5rem 2rem
Pattern overlay
SVG hexagon tileble, opacity stroke rgba(255,255,255,0.06)
Bismillah text
Amiri 1.6rem, rgba(229,188,69,.7)
Section label
0.72rem/600, --green-200 opacity .7, uppercase, letter-spacing .1em
Main date
Lora clamp(2rem,4vw,2.8rem)/700, white, line-height 1.1
Day text
1rem/400, --green-200

Date Pills (date-pill):
Variant
Background
Border
Value text
Default (Hijri/Jawa)
rgba(255,255,255,.07)
rgba(255,255,255,.12)
white, 1.05rem/600
Hover state
rgba(255,255,255,.12)
—
—
Gold (Weton)
rgba(201,162,39,.15)
rgba(201,162,39,.3)
--gold-400, Lora 1.2rem/600
Full-width
grid-column: span 2
—
—

4.4 Calendar Card
Property
Value
Container
bg white, border-radius 20px, border rgba(29,107,66,.12), box-shadow 0 4px 24px rgba(13,61,34,.06)
Header
bg --green-50, border-bottom rgba(29,107,66,.12), padding 1rem 1.2rem
Month label
Lora 1.05rem/600, --ink
Hijri sub-label
0.78rem, --ink-light
Nav button
30×30px, radius 8px, border rgba(29,107,66,.12), bg white; hover: bg --green-50, border --green-500
Tab (active)
bg --green-700, color white, 0.7rem/600, radius 6px, 4px 10px padding
Tab (inactive)
bg transparent, --ink-light; hover: bg --green-50, --green-700
7 kolom, gap 2px, padding .8rem
7 kolom, gap 2px, padding .8rem
Day cell size
aspect-ratio 1:1, radius 10px
Day cell hover
bg --green-50
Today cell
bg --green-700
Other-month cell
opacity .3
Friday cell .d-masehi
color --green-700 (menggantikan --ink)
Holiday dot
4×4px, radius 50%, bg --gold-500, absolute bottom 3px
Days header
0.68rem/600, --ink-light, uppercase, letter-spacing .04em
Days header (Jumat)
color --green-600
Footer
border-top rgba(29,107,66,.12), padding .7rem 1rem

4.5 Tool Card
Property
Value
Container
bg white, border rgba(29,107,66,.12), radius 16px, padding 1.2rem 1.3rem
Top accent bar
height 3px, bg --green-500, transform scaleX(0) → scaleX(1) on hover, origin left
Hover state
border-color --green-200, box-shadow 0 6px 20px rgba(13,61,34,.08), translateY(-1px)
Icon container
38×38px, radius 10px, bg --green-50
Card title
0.92rem/600, --ink
Card description
0.78rem, --ink-light, line-height 1.5
Arrow (→)
Absolute right 1.1rem top 1.1rem, opacity 0 → 1 on hover, --green-300
Transition
all .2s ease

4.6 Hari Besar Item
Property
Value
Container
bg white, border rgba(29,107,66,.12), radius 12px, padding .8rem 1rem, flex row
Hover
border-color --green-200
Countdown box
min-width 72px, bg --green-50, radius 8px, padding .4rem .5rem, text-align center
Countdown number
1.3rem/700, --green-700
Countdown label
0.62rem, --ink-light, uppercase, letter-spacing .06em
Event name
0.9rem/600, --ink
Event date
0.78rem, --ink-light
Badge "Hari Libur"
bg --gold-100 (#FBF3D5), color --gold-600 (#A07820), 0.65rem/600, radius 999px, 3px 8px
Badge "Puasa Wajib"
bg --green-100 (#D4F4EA), color --green-700 (#155232), spec sama

4.7 Ramadan Countdown Banner
Property
Value
Background
linear-gradient(135deg, --green-800 0%, --green-900 100%)
Border radius
20px
Padding
1.8rem 2rem
Layout
2 cột: 1fr auto
Title
Lora 1.5rem/700, white
Section label
0.7rem/600, --green-200 opacity .7, uppercase, letter-spacing .1em
Date text
0.85rem, --green-200
Countdown number
Lora 1.6rem/700, --gold-400
Countdown label
0.62rem, --green-200, uppercase
Separator (:)
1.4rem, --gold-400 opacity .4
CTA button
bg --gold-500, color --green-900, radius 10px, .7rem 1.4rem padding, 0.85rem/700
CTA hover
bg --gold-400
Pattern overlay
SVG circles, rgba(255,255,255,0.05), absolute right -20px top -20px, 200×200px

5. Motion & Animasi

Animation
Keyframe
Duration
Digunakan untuk
pulse
opacity 1→.5→1, scale 1→.8→1
2s infinite
Live dot di badge hero
fadeUp
opacity 0→1, translateY 16px→0
0.5s ease
Hero card dan calendar card saat load
fadeUp (delay)
Như trên
0.5s 0.08s ease
Calendar card dengan delay .08s setelah hero
scaleX
scaleX 0→1
0.25s ease
Garis aksen atas tool card saat hover
translateY
translateY 0→-1px
0.2s ease
Tool card terangkat saat hover
color transition
color change
0.15–0.2s ease
Nav links, tombol, border saat hover

Prinsip
Hanya animate: opacity, transform (translate, scale). JANGAN animate: background-color langsung (gunakan transition), width/height, border. Semua transition gunakan ease atau cubic-bezier, bukan linear kecuali loading spinner.

6. Tailwind Configuration

Tambahkan ke tailwind.config.mjs untuk extend color palette. Setelah itu bisa gunakan class seperti bg-green-700, text-gold-500, dll.

  // tailwind.config.mjs  export default {    theme: {      extend: {        colors: {          green: {            50:  '#F0FAF5',            100: '#D4F4EA',            200: '#9FE1CB',            400: '#2EC98F',            500: '#1D9E75',            600: '#1D6B42',            700: '#155232',            800: '#0D3D22',            900: '#062917',          },          gold: {            100: '#FBF3D5',            400: '#E2BC45',            500: '#C9A227',            600: '#A07820',          },          cream:  '#FDFAF4',          ink:    { DEFAULT:'#141C14', muted:'#3D4A3D', light:'#6B7A6B' },        },        fontFamily: {          serif:  ['Lora', 'Georgia', 'serif'],          sans:   ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],          arabic: ['Amiri', 'serif'],        },        borderRadius: {          'pill': '999px',        },        maxWidth: {          'site': '1200px',        },      },    },  }

7. Do & Don't — Aturan Desain

Kategori
✅ DO
❌ DON'T
Background trang
bg-cream (#FDFAF4)
bg-white (#fff) untuk body
Border color
rgba(29,107,66,.12) — xanh mờ
#ccc, #e5e5e5, hay gray thuần
Heading font
Lora serif cho section title, month label
Plus Jakarta Sans cho heading
Button primary
bg-green-700, hover bg-green-600
bg-blue, bg-teal, atau warna lain
Text trên nền đậm
white hoặc --green-200
--ink hay màu tối khác
Calendar today
bg-green-700 (xanh rừng đậm)
bg-blue, bg-red, hay highlight màu khác
Jumat highlight
text-green-700 trên cell bình thường
Warna Merah (không phù hợp UX Islamic)
Holiday dot
--gold-500 (vàng)
Đỏ hay cam
Badge pills
radius 999px, padding 3px 8px
Box vuông hay radius nhỏ cho badge
Hover animation
translateY(-1px) nhẹ + shadow
Scale up lớn, bounce, hay rotation

Về màu đỏ
Website ini TIDAK menggunakan warna merah untuk UI biasa. Merah hanya untuk error states nyata (validasi form). Kalender, badge, highlight semua menggunakan palette green + gold. Kesan hangat namun tidak agresif.

8. Checklist Desain Saat Membuat Halaman Baru

Setiap kali Dev Agent membuat halaman/komponen baru, periksa daftar berikut:

#
Checklist item
Tingkat
1
Font utama adalah Plus Jakarta Sans, heading gunakan Lora
Wajib
2
Background halaman adalah #FDFAF4 (--cream), bukan putih murni
Wajib
3
Border gunakan rgba(29,107,66,.12), jangan gunakan gray
Wajib
4
Tombol primary gunakan --green-700 (#155232)
Wajib
5
Max-width container adalah 1200px, dengan padding clamp(1rem,4vw,3rem)
Wajib
6
Mobile-first — test di 375px sebelum test desktop
Wajib
7
Hari ini di kalender = bg-green-700, titik hari libur = gold-500
Wajib
8
Semua hover memiliki transition 0.15–0.2s ease
Dianjurkan
9
Card memiliki border-radius ≥ 12px (jangan gunakan radius kecil atau sudut tajam)
Dianjurkan
10
Teks di atas latar gelap: gunakan white atau --green-200, jangan gunakan ink
Wajib
11
Badge/pill selalu gunakan radius 999px
Dianjurkan
12
Spacing section konsisten: margin-top 2.5rem untuk section baru
Dianjurkan



KalenderIslam.id — Design System v1.0
Setiap perubahan desain harus dicatat di dokumen ini untuk menjaga konsistensi.