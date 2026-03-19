-- ============================================================
-- Seed Muhammadiyah dates 2025-2030
-- Run this in Supabase SQL Editor
-- ============================================================

-- 2025 (sudah resmi)
UPDATE official_dates SET tanggal_muhammadiyah = '2025-03-01' WHERE event = 'ramadan_start' AND tahun_masehi = 2025;
UPDATE official_dates SET tanggal_muhammadiyah = '2025-03-30' WHERE event = 'idul_fitri' AND tahun_masehi = 2025;
UPDATE official_dates SET tanggal_muhammadiyah = '2025-06-06' WHERE event = 'idul_adha' AND tahun_masehi = 2025;
UPDATE official_dates SET tanggal_muhammadiyah = '2025-06-26' WHERE event = 'muharram' AND tahun_masehi = 2025;
UPDATE official_dates SET tanggal_muhammadiyah = '2025-09-04' WHERE event = 'maulid_nabi' AND tahun_masehi = 2025;

-- 2026
UPDATE official_dates SET tanggal_muhammadiyah = '2026-02-18' WHERE event = 'ramadan_start' AND tahun_masehi = 2026;
UPDATE official_dates SET tanggal_muhammadiyah = '2026-03-20' WHERE event = 'idul_fitri' AND tahun_masehi = 2026;
UPDATE official_dates SET tanggal_muhammadiyah = '2026-05-27' WHERE event = 'idul_adha' AND tahun_masehi = 2026;
UPDATE official_dates SET tanggal_muhammadiyah = '2026-06-16' WHERE event = 'muharram' AND tahun_masehi = 2026;
UPDATE official_dates SET tanggal_muhammadiyah = '2026-08-25' WHERE event = 'maulid_nabi' AND tahun_masehi = 2026;

-- 2027-2030 (upsert)
INSERT INTO official_dates (event, tahun_masehi, tanggal_muhammadiyah, tanggal_perkiraan, catatan) VALUES
  ('ramadan_start', 2028, '2028-01-27', '2028-01-27', 'Proyeksi'),
  ('idul_fitri',    2028, '2028-02-26', '2028-02-26', 'Proyeksi'),
  ('idul_adha',     2028, '2028-05-04', '2028-05-04', 'Proyeksi'),
  ('muharram',      2028, '2028-05-25', '2028-05-25', 'Proyeksi'),
  ('maulid_nabi',   2028, '2028-08-02', '2028-08-02', 'Proyeksi'),
  ('ramadan_start', 2029, '2029-01-15', '2029-01-15', 'Proyeksi'),
  ('idul_fitri',    2029, '2029-02-14', '2029-02-14', 'Proyeksi'),
  ('idul_adha',     2029, '2029-04-23', '2029-04-23', 'Proyeksi'),
  ('muharram',      2029, '2029-05-14', '2029-05-14', 'Proyeksi'),
  ('maulid_nabi',   2029, '2029-07-22', '2029-07-22', 'Proyeksi'),
  ('ramadan_start', 2030, '2030-01-04', '2030-01-04', 'Proyeksi'),
  ('idul_fitri',    2030, '2030-02-03', '2030-02-03', 'Proyeksi'),
  ('idul_adha',     2030, '2030-04-12', '2030-04-12', 'Proyeksi'),
  ('muharram',      2030, '2030-05-03', '2030-05-03', 'Proyeksi'),
  ('maulid_nabi',   2030, '2030-07-11', '2030-07-11', 'Proyeksi')
ON CONFLICT (event, tahun_masehi) DO UPDATE SET
  tanggal_muhammadiyah = EXCLUDED.tanggal_muhammadiyah,
  tanggal_perkiraan = EXCLUDED.tanggal_perkiraan,
  catatan = EXCLUDED.catatan;
