// ─── Seat Types ────────────────────────────────────────────────────────────────
export type SeatStatus = 'available' | 'occupied' | 'away' | 'awaiting_claim';
export type SeatZone = 'A' | 'B' | 'C';

export interface Seat {
  id: string;
  seat_code: string;
  zone: SeatZone;
  status: SeatStatus;
  occupied_by: string | null; // student id
  check_in_time: string | null;
  away_start_time: string | null;
  last_activity: string | null;
}

// ─── Student Types ──────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  roll_number: string;
  name: string;
  created_at: string;
}

// ─── Log Types ──────────────────────────────────────────────────────────────────
export type LogAction =
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'AWAY'
  | 'RETURN'
  | 'AUTO_RELEASE'
  | 'ABANDONED'
  | 'WAITLIST_ASSIGNED'
  | 'WAITLIST_JOIN';

export interface SeatLog {
  id: string;
  seat_id: string;
  seat_code?: string;
  action: LogAction;
  timestamp: string;
  metadata: Record<string, unknown>;
  student_name?: string;
}

// ─── Waitlist Types ─────────────────────────────────────────────────────────────
export type WaitlistStatus = 'WAITING' | 'ASSIGNED' | 'EXPIRED';

export interface WaitlistEntry {
  id: string;
  student_id: string;
  position: number;
  joined_at: string;
  assigned_seat: string | null;
  assigned_at?: string;
  status: WaitlistStatus;
  student?: Student;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'admin';

export interface AuthUser {
  role: UserRole;
  student?: Student;
  isAdmin?: boolean;
}

// ─── Analytics Types ────────────────────────────────────────────────────────────
export interface OccupancySnapshot {
  hour: string;
  occupancy: number;
  away: number;
}

export interface ZoneStats {
  zone: string;
  checkins: number;
  available: number;
  occupied: number;
  away: number;
}

export interface SeatHeatStat {
  seat_code: string;
  checkins: number;
  intensity: number; // 0-1
}
