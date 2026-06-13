-- DeskGuard Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your tables

-- ─── Enable UUID extension ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Students ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roll_number TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seats ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seats (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seat_code      TEXT UNIQUE NOT NULL,
  zone           TEXT NOT NULL CHECK (zone IN ('A', 'B', 'C')),
  status         TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'away')),
  occupied_by    UUID REFERENCES students(id) ON DELETE SET NULL,
  check_in_time  TIMESTAMPTZ,
  away_start_time TIMESTAMPTZ,
  last_activity  TIMESTAMPTZ
);

-- ─── Seed Seats ────────────────────────────────────────────────────────────────
INSERT INTO seats (seat_code, zone) VALUES
  ('A1','A'),('A2','A'),('A3','A'),('A4','A'),('A5','A'),
  ('A6','A'),('A7','A'),('A8','A'),('A9','A'),('A10','A'),
  ('B1','B'),('B2','B'),('B3','B'),('B4','B'),('B5','B'),
  ('B6','B'),('B7','B'),('B8','B'),('B9','B'),('B10','B'),
  ('C1','C'),('C2','C'),('C3','C'),('C4','C'),('C5','C'),
  ('C6','C'),('C7','C'),('C8','C'),('C9','C'),('C10','C')
ON CONFLICT (seat_code) DO NOTHING;

-- ─── Seat Logs ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seat_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seat_id     UUID REFERENCES seats(id) ON DELETE CASCADE,
  action      TEXT NOT NULL CHECK (action IN (
    'CHECK_IN','CHECK_OUT','AWAY','RETURN',
    'AUTO_RELEASE','ABANDONED','WAITLIST_ASSIGNED','WAITLIST_JOIN'
  )),
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  metadata    JSONB DEFAULT '{}'::jsonb
);

-- ─── Waitlist ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS waitlist (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  position      INT NOT NULL,
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  assigned_seat TEXT,
  status        TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING','ASSIGNED','EXPIRED'))
);

-- ─── Enable Realtime ───────────────────────────────────────────────────────────
-- Run these in Supabase Dashboard → Database → Replication
ALTER PUBLICATION supabase_realtime ADD TABLE seats;
ALTER PUBLICATION supabase_realtime ADD TABLE seat_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist;

-- ─── Row Level Security (optional, disable for demo) ──────────────────────────
-- For demo purposes, disable RLS:
ALTER TABLE students   DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats      DISABLE ROW LEVEL SECURITY;
ALTER TABLE seat_logs  DISABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist   DISABLE ROW LEVEL SECURITY;
