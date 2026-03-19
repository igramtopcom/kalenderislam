-- ============================================================
-- KalenderIslam.id — Supabase Setup SQL
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

-- TABEL 1: Tanggal resmi hasil sidang isbat Kemenag
CREATE TABLE official_dates (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event                text NOT NULL,
  tahun_masehi         integer NOT NULL,
  tanggal_resmi        date,
  tanggal_muhammadiyah date,
  tanggal_perkiraan    date,
  catatan              text,
  updated_at           timestamptz DEFAULT now(),
  UNIQUE(event, tahun_masehi)
);

-- TABEL 2: Hari libur nasional dari SKB 3 Menteri
CREATE TABLE national_holidays (
  tanggal    date PRIMARY KEY,
  nama       text NOT NULL,
  tipe       text NOT NULL CHECK (tipe IN ('libur_nasional', 'cuti_bersama')),
  agama      text CHECK (agama IN ('islam', 'kristen', 'hindu', 'nasional') OR agama IS NULL),
  created_at timestamptz DEFAULT now()
);

-- TABEL 3: Push notification subscribers
CREATE TABLE push_subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fcm_token  text UNIQUE NOT NULL,
  events     text[] DEFAULT '{}',
  kota_slug  text,
  created_at timestamptz DEFAULT now()
);

-- ROW LEVEL SECURITY
ALTER TABLE official_dates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE national_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscribers  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_official_dates"
  ON official_dates FOR SELECT USING (true);

CREATE POLICY "public_read_national_holidays"
  ON national_holidays FOR SELECT USING (true);

CREATE POLICY "self_insert_push_subscribers"
  ON push_subscribers FOR INSERT WITH CHECK (true);

-- ============================================================
-- SEED: official_dates 2025 (Kemenag resmi)
-- ============================================================
INSERT INTO official_dates
  (event, tahun_masehi, tanggal_resmi, tanggal_muhammadiyah, tanggal_perkiraan, catatan)
VALUES
  ('ramadan_start', 2025, '2025-03-01', '2025-03-01', '2025-03-01', 'Resmi Kemenag: 1 Maret 2025'),
  ('idul_fitri',    2025, '2025-03-30', '2025-03-30', '2025-03-30', 'Resmi Kemenag: 30 Maret 2025'),
  ('idul_adha',     2025, '2025-06-06', '2025-06-06', '2025-06-07', 'Resmi Kemenag: 6 Juni 2025'),
  ('muharram',      2025, '2025-06-26', '2025-06-26', '2025-06-26', '1 Muharram 1447 H'),
  ('maulid_nabi',   2025, '2025-09-04', '2025-09-04', '2025-09-05', 'Maulid Nabi 1447 H'),
  ('isra_miraj',    2025, '2026-01-27', '2026-01-27', '2026-01-27', 'Isra Miraj 1447 H (jatuh di 2026 Masehi)');

-- SEED: official_dates 2026 (perkiraan, tanggal_resmi NULL)
INSERT INTO official_dates
  (event, tahun_masehi, tanggal_resmi, tanggal_muhammadiyah, tanggal_perkiraan, catatan)
VALUES
  ('ramadan_start', 2026, NULL, '2026-02-18', '2026-02-18', 'Menunggu sidang isbat'),
  ('idul_fitri',    2026, NULL, '2026-03-20', '2026-03-20', 'Menunggu sidang isbat'),
  ('idul_adha',     2026, NULL, '2026-05-27', '2026-05-27', 'Perkiraan: 27 Mei 2026'),
  ('muharram',      2026, NULL, '2026-06-16', '2026-06-16', '1 Muharram 1448 H'),
  ('maulid_nabi',   2026, NULL, '2026-08-25', '2026-08-25', 'Maulid Nabi 1448 H'),
  ('isra_miraj',    2026, NULL, '2027-01-17', '2027-01-17', 'Isra Miraj 1448 H');

-- SEED: official_dates 2027 (semua perkiraan)
INSERT INTO official_dates
  (event, tahun_masehi, tanggal_resmi, tanggal_muhammadiyah, tanggal_perkiraan, catatan)
VALUES
  ('ramadan_start', 2027, NULL, '2027-02-07', '2027-02-07', 'Proyeksi Umm al-Qura'),
  ('idul_fitri',    2027, NULL, '2027-03-09', '2027-03-09', 'Proyeksi Umm al-Qura'),
  ('idul_adha',     2027, NULL, '2027-05-16', '2027-05-16', 'Proyeksi Umm al-Qura'),
  ('muharram',      2027, NULL, '2027-06-06', '2027-06-06', 'Proyeksi Umm al-Qura'),
  ('maulid_nabi',   2027, NULL, '2027-08-14', '2027-08-14', 'Proyeksi Umm al-Qura');

-- ============================================================
-- SEED: national_holidays 2025 (SKB 3 Menteri resmi)
-- ============================================================
INSERT INTO national_holidays (tanggal, nama, tipe, agama) VALUES
  ('2025-01-01', 'Tahun Baru Masehi',              'libur_nasional', 'nasional'),
  ('2025-01-27', 'Isra Mi''raj 1446 H',             'libur_nasional', 'islam'),
  ('2025-01-28', 'Cuti Bersama Isra Mi''raj',        'cuti_bersama',   'islam'),
  ('2025-01-29', 'Tahun Baru Imlek 2576',           'libur_nasional', NULL),
  ('2025-03-29', 'Hari Suci Nyepi 1947 Saka',       'libur_nasional', 'hindu'),
  ('2025-03-30', 'Idul Fitri 1446 H',               'libur_nasional', 'islam'),
  ('2025-03-31', 'Idul Fitri 1446 H (Hari Kedua)',  'libur_nasional', 'islam'),
  ('2025-04-18', 'Wafat Isa Al Masih',              'libur_nasional', 'kristen'),
  ('2025-05-01', 'Hari Buruh Internasional',        'libur_nasional', 'nasional'),
  ('2025-05-12', 'Hari Raya Waisak 2569 BE',        'libur_nasional', NULL),
  ('2025-05-29', 'Kenaikan Isa Al Masih',           'libur_nasional', 'kristen'),
  ('2025-06-01', 'Hari Lahir Pancasila',            'libur_nasional', 'nasional'),
  ('2025-06-06', 'Idul Adha 1446 H',               'libur_nasional', 'islam'),
  ('2025-06-26', 'Tahun Baru Islam 1447 H',         'libur_nasional', 'islam'),
  ('2025-08-17', 'HUT Kemerdekaan RI ke-80',        'libur_nasional', 'nasional'),
  ('2025-09-04', 'Maulid Nabi Muhammad SAW',        'libur_nasional', 'islam'),
  ('2025-12-25', 'Hari Raya Natal',                 'libur_nasional', 'kristen'),
  ('2025-12-26', 'Cuti Bersama Natal',              'cuti_bersama',   'kristen');

-- SEED: national_holidays 2026 (perkiraan tanggal Islam)
INSERT INTO national_holidays (tanggal, nama, tipe, agama) VALUES
  ('2026-01-01', 'Tahun Baru Masehi',              'libur_nasional', 'nasional'),
  ('2026-01-27', 'Isra Mi''raj 1447 H',             'libur_nasional', 'islam'),
  ('2026-02-17', 'Tahun Baru Imlek 2577',          'libur_nasional', NULL),
  ('2026-03-19', 'Hari Suci Nyepi 1948 Saka',      'libur_nasional', 'hindu'),
  ('2026-03-20', 'Idul Fitri 1447 H',              'libur_nasional', 'islam'),
  ('2026-03-21', 'Idul Fitri 1447 H (Hari Kedua)', 'libur_nasional', 'islam'),
  ('2026-04-03', 'Wafat Isa Al Masih',             'libur_nasional', 'kristen'),
  ('2026-05-01', 'Hari Buruh Internasional',       'libur_nasional', 'nasional'),
  ('2026-05-14', 'Kenaikan Isa Al Masih',          'libur_nasional', 'kristen'),
  ('2026-05-27', 'Hari Raya Waisak 2570 BE',       'libur_nasional', NULL),
  ('2026-05-27', 'Idul Adha 1447 H',              'libur_nasional', 'islam'),
  ('2026-06-01', 'Hari Lahir Pancasila',           'libur_nasional', 'nasional'),
  ('2026-06-16', 'Tahun Baru Islam 1448 H',        'libur_nasional', 'islam'),
  ('2026-08-17', 'HUT Kemerdekaan RI ke-81',       'libur_nasional', 'nasional'),
  ('2026-08-25', 'Maulid Nabi Muhammad SAW',       'libur_nasional', 'islam'),
  ('2026-12-25', 'Hari Raya Natal',                'libur_nasional', 'kristen');
