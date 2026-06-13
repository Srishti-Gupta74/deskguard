import { supabase } from './supabase';
import type { Seat, Student, SeatLog, WaitlistEntry } from '../types';

export async function getSeats(): Promise<Seat[]> {
  const { data, error } = await supabase.from('seats').select('*').order('seat_code');
  if (error) throw error;
  return data as Seat[];
}

export async function upsertStudent(rollNumber: string, name: string): Promise<Student> {
  const { data: existing } = await supabase.from('students').select('*').eq('roll_number', rollNumber).single();
  if (existing) return existing as Student;

  const { data, error } = await supabase.from('students').insert({ roll_number: rollNumber, name }).select().single();
  if (error) throw error;
  return data as Student;
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
  if (error) return null;
  return data as Student;
}

export async function updateSeat(id: string, updates: Partial<Seat>): Promise<Seat> {
  const { data, error } = await supabase.from('seats').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Seat;
}

export async function insertLog(seatId: string, eventType: string, action: string, metadata: any, studentName?: string) {
  const { error } = await supabase.from('seat_logs').insert({
    seat_id: seatId !== 'wl' ? seatId : null,
    event_type: eventType,
    action: action,
    student_id: metadata?.student_id,
    student_name: studentName,
  });
  if (error) console.error("Error inserting log", error);
}

export async function checkIn(seatId: string, _seatCode: string, studentId: string, studentName: string) {
  await updateSeat(seatId, {
    status: 'occupied',
    occupied_by: studentId as any,
    check_in_time: new Date().toISOString(),
    away_start_time: null,
    last_activity: new Date().toISOString()
  });
  await insertLog(seatId, 'CHECK_IN', 'Student checked in', { student_id: studentId }, studentName);
}

export async function checkOut(seatId: string, _seatCode: string, studentName: string) {
  await updateSeat(seatId, {
    status: 'available',
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: null
  });
  await insertLog(seatId, 'CHECK_OUT', 'Student left seat', {}, studentName);
}

export async function setAway(seatId: string, _seatCode: string, studentName: string) {
  await updateSeat(seatId, {
    status: 'away',
    away_start_time: new Date().toISOString(),
    last_activity: new Date().toISOString()
  });
  await insertLog(seatId, 'AWAY', 'Student took a break', {}, studentName);
}

export async function setReturn(seatId: string, _seatCode: string, studentName: string) {
  await updateSeat(seatId, {
    status: 'occupied',
    away_start_time: null,
    last_activity: new Date().toISOString()
  });
  await insertLog(seatId, 'RETURN', 'Student returned from break', {}, studentName);
}

export async function autoRelease(seatId: string, _seatCode: string, studentName: string, isAwayTimeout: boolean) {
  await updateSeat(seatId, {
    status: 'available',
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: null
  });
  const action = isAwayTimeout ? 'Auto-released (Away timeout)' : 'Auto-released (No response)';
  await insertLog(seatId, 'AUTO_RELEASE', action, {}, studentName);
}

export async function updateLastActivity(seatId: string) {
  await updateSeat(seatId, {
    last_activity: new Date().toISOString()
  });
}

export async function getLogs(limit: number = 100): Promise<SeatLog[]> {
  const { data, error } = await supabase.from('seat_logs').select('*').order('timestamp', { ascending: false }).limit(limit);
  if (error) return [];
  // map database snake_case to the app's types if necessary, though they match here
  return data.map((d: any) => ({
    id: d.id,
    seat_id: d.seat_id,
    event_type: d.event_type as any,
    action: d.action,
    metadata: d.student_id ? { student_id: d.student_id, student_name: d.student_name } : {},
    timestamp: d.timestamp
  })) as SeatLog[];
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const { data, error } = await supabase.from('waitlist').select('*, students(name)').order('joined_at');
  if (error) return [];
  return data.map((d: any, index: number) => ({
    id: d.id,
    student_id: d.student_id,
    student_name: d.students?.name,
    joined_at: d.joined_at,
    position: index + 1,
    assigned_seat: null,
    status: 'WAITING' as any
  }));
}

export async function joinWaitlist(studentId: string) {
  const { error } = await supabase.from('waitlist').insert({ student_id: studentId });
  if (error && error.code !== '23505') throw error; // Ignore unique constraint if already in
}

export async function removeFromWaitlist(studentId: string) {
  await supabase.from('waitlist').delete().eq('student_id', studentId);
}

export async function adminReleaseSeat(seatId: string, _seatCode: string) {
  await updateSeat(seatId, {
    status: 'available',
    occupied_by: null,
    check_in_time: null,
    away_start_time: null,
    last_activity: null
  });
  await insertLog(seatId, 'ADMIN_OVERRIDE', 'Admin force released seat', {}, 'Admin');
}

export function subscribeToTable(table: string, callback: () => void) {
  const channel = supabase.channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
