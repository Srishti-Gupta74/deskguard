import type { Seat, Student, SeatLog, WaitlistEntry, SeatStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

// ─── Seat Codes ──────────────────────────────────────────────────────────────────
const ALL_SEATS: Array<{ seat_code: string; zone: 'A' | 'B' | 'C' }> = [
  ...Array.from({ length: 10 }, (_, i) => ({ seat_code: `A${i + 1}`, zone: 'A' as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ seat_code: `B${i + 1}`, zone: 'B' as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ seat_code: `C${i + 1}`, zone: 'C' as const })),
];

function now() {
  return new Date().toISOString();
}

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const KEYS = {
  seats: 'dg_seats',
  students: 'dg_students',
  logs: 'dg_logs',
  waitlist: 'dg_waitlist',
};

// ─── Listeners (simulated realtime) ────────────────────────────────────────────
type Listener<T> = (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; new: T; old?: T }) => void;

const listeners: Record<string, Listener<unknown>[]> = {};

function emit(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRow: unknown, oldRow?: unknown) {
  (listeners[table] || []).forEach(fn => fn({ eventType, new: newRow as never, old: oldRow as never }));
}

export function subscribeToTable<T>(table: string, fn: Listener<T>): () => void {
  if (!listeners[table]) listeners[table] = [];
  listeners[table].push(fn as Listener<unknown>);
  return () => {
    listeners[table] = listeners[table].filter(l => l !== fn);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEYS.seats) emit('seats', 'UPDATE', null);
    if (e.key === KEYS.logs) emit('seat_logs', 'UPDATE', null);
    if (e.key === KEYS.waitlist) emit('waitlist', 'UPDATE', null);
  });
}

// ─── Seats ────────────────────────────────────────────────────────────────────
function getSeats(): Seat[] {
  const raw = localStorage.getItem(KEYS.seats);
  if (raw) return JSON.parse(raw) as Seat[];
  // Seed
  const seats: Seat[] = ALL_SEATS.map(s => ({
    id: uuidv4(),
    seat_code: s.seat_code,
    zone: s.zone,
    status: 'available',
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: null,
  }));
  localStorage.setItem(KEYS.seats, JSON.stringify(seats));
  return seats;
}

function saveSeats(seats: Seat[]) {
  localStorage.setItem(KEYS.seats, JSON.stringify(seats));
}

export function mockGetSeats(): Seat[] {
  return getSeats();
}

export function mockGetSeatByCode(seatCode: string): Seat | null {
  return getSeats().find(s => s.seat_code === seatCode) ?? null;
}

export function mockUpdateSeat(id: string, updates: Partial<Seat>): Seat {
  const seats = getSeats();
  const idx = seats.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Seat not found');
  const old = seats[idx];
  seats[idx] = { ...old, ...updates };
  saveSeats(seats);
  emit('seats', 'UPDATE', seats[idx], old);
  return seats[idx];
}

// ─── Students ─────────────────────────────────────────────────────────────────
function getStudents(): Student[] {
  const raw = localStorage.getItem(KEYS.students);
  return raw ? (JSON.parse(raw) as Student[]) : [];
}

function saveStudents(students: Student[]) {
  localStorage.setItem(KEYS.students, JSON.stringify(students));
}

export function mockUpsertStudent(rollNumber: string, name: string): Student {
  const students = getStudents();
  const existing = students.find(s => s.roll_number === rollNumber);
  if (existing) {
    return existing;
  }
  const newStudent: Student = {
    id: uuidv4(),
    roll_number: rollNumber,
    name,
    created_at: now(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

export function mockGetStudentById(id: string): Student | null {
  return getStudents().find(s => s.id === id) ?? null;
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
function getLogs(): SeatLog[] {
  const raw = localStorage.getItem(KEYS.logs);
  return raw ? (JSON.parse(raw) as SeatLog[]) : [];
}

function saveLogs(logs: SeatLog[]) {
  localStorage.setItem(KEYS.logs, JSON.stringify(logs));
}

export function mockInsertLog(seatId: string, seatCode: string, action: SeatLog['action'], metadata: Record<string, unknown> = {}, studentName?: string): SeatLog {
  const logs = getLogs();
  const log: SeatLog = {
    id: uuidv4(),
    seat_id: seatId,
    seat_code: seatCode,
    action,
    timestamp: now(),
    metadata,
    student_name: studentName,
  };
  logs.unshift(log);
  if (logs.length > 500) logs.splice(500);
  saveLogs(logs);
  emit('seat_logs', 'INSERT', log);
  return log;
}

export function mockGetLogs(limit = 50): SeatLog[] {
  return getLogs().slice(0, limit);
}

// ─── Waitlist ──────────────────────────────────────────────────────────────────
function getWaitlist(): WaitlistEntry[] {
  const raw = localStorage.getItem(KEYS.waitlist);
  return raw ? (JSON.parse(raw) as WaitlistEntry[]) : [];
}

function saveWaitlist(wl: WaitlistEntry[]) {
  localStorage.setItem(KEYS.waitlist, JSON.stringify(wl));
}

export function mockGetWaitlist(): WaitlistEntry[] {
  const wl = getWaitlist();
  const students = getStudents();
  return wl.map(e => ({ ...e, student: students.find(s => s.id === e.student_id) }));
}

export function mockJoinWaitlist(studentId: string): WaitlistEntry {
  const wl = getWaitlist();
  // Check duplicate
  const existing = wl.find(e => e.student_id === studentId && e.status === 'WAITING');
  if (existing) throw new Error('Already in waitlist');
  const position = wl.filter(e => e.status === 'WAITING').length + 1;
  const entry: WaitlistEntry = {
    id: uuidv4(),
    student_id: studentId,
    position,
    joined_at: now(),
    assigned_seat: null,
    status: 'WAITING',
  };
  wl.push(entry);
  saveWaitlist(wl);
  emit('waitlist', 'INSERT', entry);
  mockInsertLog('system', 'system', 'WAITLIST_JOIN', { student_id: studentId }, 'Student');
  return entry;
}

export function mockAssignWaitlistSeat(seatCode: string): WaitlistEntry | null {
  const wl = getWaitlist();
  const waiting = wl.filter(e => e.status === 'WAITING').sort((a, b) => a.position - b.position);
  if (waiting.length === 0) return null;

  const first = waiting[0];
  const idx = wl.findIndex(e => e.id === first.id);
  const old = wl[idx];
  wl[idx] = { ...first, assigned_seat: seatCode, status: 'ASSIGNED', assigned_at: now() };
  // Recompute positions for remaining WAITING entries
  let pos = 1;
  wl.forEach((e, i) => {
    if (e.status === 'WAITING') {
      wl[i] = { ...e, position: pos++ };
    }
  });
  saveWaitlist(wl);
  emit('waitlist', 'UPDATE', wl[idx], old);

  const seats = getSeats();
  const seatToAssign = seats.find(s => s.seat_code === seatCode);
  if (seatToAssign) {
    mockUpdateSeat(seatToAssign.id, { 
      status: 'awaiting_claim' as SeatStatus, 
      occupied_by: first.student_id 
    });
  }

  return wl[idx];
}

export function mockRemoveFromWaitlist(studentId: string) {
  const wl = getWaitlist();
  const idx = wl.findIndex(e => e.student_id === studentId && (e.status === 'WAITING' || e.status === 'ASSIGNED'));
  if (idx !== -1) {
    const old = wl[idx];
    wl.splice(idx, 1);
    // Recompute positions
    let pos = 1;
    wl.forEach((e, i) => {
      if (e.status === 'WAITING') wl[i] = { ...e, position: pos++ };
    });
    saveWaitlist(wl);
    emit('waitlist', 'DELETE', old);

    if (old.status === 'ASSIGNED' && old.assigned_seat) {
      const seats = getSeats();
      const seat = seats.find(s => s.seat_code === old.assigned_seat);
      if (seat) {
        mockUpdateSeat(seat.id, { status: 'available' as SeatStatus, occupied_by: null });
        const nextAssigned = mockAssignWaitlistSeat(seat.seat_code);
        if (nextAssigned) {
          const student = mockGetStudentById(nextAssigned.student_id);
          mockInsertLog(seat.id, seat.seat_code, 'WAITLIST_ASSIGNED', { waitlist_entry_id: nextAssigned.id }, student?.name);
        }
      }
    }
  }
}

export function mockCheckIn(seatId: string, seatCode: string, studentId: string, studentName: string): Seat {
  // Check student doesn't already have an occupied seat
  const seats = getSeats();
  const alreadyOccupied = seats.find(s => s.occupied_by === studentId && (s.status === 'occupied' || s.status === 'away'));
  if (alreadyOccupied) throw new Error(`You already have seat ${alreadyOccupied.seat_code} reserved.`);
  const seat = seats.find(s => s.id === seatId);
  if (!seat) throw new Error('Seat not found');
  
  if (seat.status !== 'available') {
    if (seat.status === 'awaiting_claim' && seat.occupied_by === studentId) {
      // Allowed to claim
    } else {
      throw new Error(`Seat ${seatCode} is currently ${seat.status}.`);
    }
  }

  const updated = mockUpdateSeat(seatId, {
    status: 'occupied' as SeatStatus,
    occupied_by: studentId,
    check_in_time: now(),
    away_start_time: null,
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'CHECK_IN', { student_id: studentId }, studentName);

  const wl = getWaitlist();
  const wlIdx = wl.findIndex(e => e.student_id === studentId && e.status === 'ASSIGNED');
  if (wlIdx !== -1) {
    const oldWl = wl[wlIdx];
    wl.splice(wlIdx, 1);
    saveWaitlist(wl);
    emit('waitlist', 'DELETE', oldWl);
  }

  return updated;
}

export function mockCheckOut(seatId: string, seatCode: string, studentName: string): Seat {
  const seat = getSeats().find(s => s.id === seatId);
  if (!seat) throw new Error('Seat not found');
  const updated = mockUpdateSeat(seatId, {
    status: 'available' as SeatStatus,
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'CHECK_OUT', {}, studentName);
  // Check waitlist
  const assigned = mockAssignWaitlistSeat(seatCode);
  if (assigned) {
    const student = mockGetStudentById(assigned.student_id);
    mockInsertLog(seatId, seatCode, 'WAITLIST_ASSIGNED', { waitlist_entry_id: assigned.id }, student?.name);
  }
  return updated;
}

export function mockSetAway(seatId: string, seatCode: string, studentName: string): Seat {
  const updated = mockUpdateSeat(seatId, {
    status: 'away' as SeatStatus,
    away_start_time: now(),
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'AWAY', {}, studentName);
  return updated;
}

export function mockSetReturn(seatId: string, seatCode: string, studentName: string): Seat {
  const updated = mockUpdateSeat(seatId, {
    status: 'occupied' as SeatStatus,
    away_start_time: null,
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'RETURN', {}, studentName);
  return updated;
}

export function mockAutoRelease(seatId: string, seatCode: string, studentName: string, isAbandon: boolean): Seat {
  if (isAbandon) {
    mockInsertLog(seatId, seatCode, 'ABANDONED', {}, studentName);
  }
  const updated = mockUpdateSeat(seatId, {
    status: 'available' as SeatStatus,
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'AUTO_RELEASE', {}, studentName);
  // Check waitlist
  const assigned = mockAssignWaitlistSeat(seatCode);
  if (assigned) {
    const student = mockGetStudentById(assigned.student_id);
    mockInsertLog(seatId, seatCode, 'WAITLIST_ASSIGNED', { waitlist_entry_id: assigned.id }, student?.name);
  }
  return updated;
}

export function mockUpdateLastActivity(seatId: string): void {
  const seats = getSeats();
  const seat = seats.find(s => s.id === seatId);
  if (seat) mockUpdateSeat(seatId, { last_activity: now() });
}

export function mockAdminReleaseSeat(seatId: string, seatCode: string): Seat {
  const seat = getSeats().find(s => s.id === seatId);
  if (!seat) throw new Error('Seat not found');
  const updated = mockUpdateSeat(seatId, {
    status: 'available' as SeatStatus,
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: now(),
  });
  mockInsertLog(seatId, seatCode, 'AUTO_RELEASE', { admin_action: true });
  const assigned = mockAssignWaitlistSeat(seatCode);
  if (assigned) {
    const student = mockGetStudentById(assigned.student_id);
    mockInsertLog(seatId, seatCode, 'WAITLIST_ASSIGNED', { waitlist_entry_id: assigned.id }, student?.name);
  }
  return updated;
}

export function mockResetAll() {
  localStorage.removeItem(KEYS.seats);
  localStorage.removeItem(KEYS.students);
  localStorage.removeItem(KEYS.logs);
  localStorage.removeItem(KEYS.waitlist);
}
