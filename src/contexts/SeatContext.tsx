import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type {
  Seat,
  SeatLog,
  WaitlistEntry,
  SeatHeatStat,
} from '../types';
import {
  mockGetSeats,
  mockCheckIn,
  mockCheckOut,
  mockSetAway,
  mockSetReturn,
  mockAutoRelease,
  mockUpdateLastActivity,
  mockGetLogs,
  mockGetWaitlist,
  mockJoinWaitlist,
  mockRemoveFromWaitlist,
  mockAdminReleaseSeat,
  mockInsertLog,
  subscribeToTable,
} from '../lib/mockDb';
import { useAuth } from './AuthContext';
import { useDemoMode } from './DemoContext';

interface SeatContextValue {
  seats: Seat[];
  logs: SeatLog[];
  waitlist: WaitlistEntry[];
  heatStats: SeatHeatStat[];
  myActiveSeat: Seat | null;
  myWaitlistEntry: WaitlistEntry | null;
  showStillHerePrompt: boolean;
  checkIn: (seatCode: string) => Promise<void>;
  checkOut: () => Promise<void>;
  setAway: () => Promise<void>;
  setReturn: () => Promise<void>;
  confirmStillHere: () => Promise<void>;
  joinWaitlist: () => Promise<void>;
  leaveWaitlist: () => Promise<void>;
  adminRelease: (seatId: string, seatCode: string) => Promise<void>;
  refreshAll: () => void;
}

const SeatContext = createContext<SeatContextValue>({} as SeatContextValue);

export const SeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { awayTimeoutMs, stillHereIntervalMs, stillHereGraceMs, waitlistTimeoutMs } = useDemoMode();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [logs, setLogs] = useState<SeatLog[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [heatStats, setHeatStats] = useState<SeatHeatStat[]>([]);
  const [showStillHerePrompt, setShowStillHerePrompt] = useState(false);

  const stillHereTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitlistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived state ──────────────────────────────────────────────────────────
  const myActiveSeat =
    user?.role === 'student' && user.student
      ? (seats.find(
          s =>
            s.occupied_by === user.student!.id &&
            (s.status === 'occupied' || s.status === 'away')
        ) ?? null)
      : null;

  const myWaitlistEntry =
    user?.role === 'student' && user.student
      ? (waitlist.find(
          w => w.student_id === user.student!.id && (w.status === 'WAITING' || w.status === 'ASSIGNED')
        ) ?? null)
      : null;

  // ── Loaders ────────────────────────────────────────────────────────────────
  const refreshAll = useCallback(() => {
    setSeats(mockGetSeats());
    setLogs(mockGetLogs(100));
    setWaitlist(mockGetWaitlist());
    computeHeatStats();
  }, []);

  function computeHeatStats() {
    const allLogs = mockGetLogs(500);
    const countMap: Record<string, number> = {};
    allLogs.forEach(l => {
      if (l.seat_code && l.action === 'CHECK_IN') {
        countMap[l.seat_code] = (countMap[l.seat_code] ?? 0) + 1;
      }
    });
    const max = Math.max(...Object.values(countMap), 1);
    const stats: SeatHeatStat[] = mockGetSeats().map(s => ({
      seat_code: s.seat_code,
      checkins: countMap[s.seat_code] ?? 0,
      intensity: (countMap[s.seat_code] ?? 0) / max,
    }));
    setHeatStats(stats);
  }

  useEffect(() => {
    refreshAll();

    const unsubs = [
      subscribeToTable<Seat>('seats', () => {
        setSeats(mockGetSeats());
      }),
      subscribeToTable<SeatLog>('seat_logs', () => {
        setLogs(mockGetLogs(100));
        computeHeatStats();
      }),
      subscribeToTable<WaitlistEntry>('waitlist', () => {
        setWaitlist(mockGetWaitlist());
      }),
    ];

    return () => unsubs.forEach(u => u());
  }, []);

  // ── Away Auto-Release Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (awayTimerRef.current) clearTimeout(awayTimerRef.current);

    if (myActiveSeat?.status === 'away' && myActiveSeat.away_start_time && user?.student) {
      const elapsed = Date.now() - new Date(myActiveSeat.away_start_time).getTime();
      const remaining = awayTimeoutMs - elapsed;

      if (remaining <= 0) {
        // Already expired
        triggerAwayAutoRelease();
      } else {
        awayTimerRef.current = setTimeout(() => {
          triggerAwayAutoRelease();
        }, remaining);
      }
    }

    return () => {
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    };
  }, [myActiveSeat?.status, myActiveSeat?.away_start_time, awayTimeoutMs]);

  function triggerAwayAutoRelease() {
    if (!myActiveSeat || !user?.student) return;
    mockAutoRelease(myActiveSeat.id, myActiveSeat.seat_code, user.student.name, false);
    refreshAll();
  }

  // ── Still Here Timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (stillHereTimerRef.current) clearTimeout(stillHereTimerRef.current);
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    setShowStillHerePrompt(false);

    if (myActiveSeat?.status === 'occupied' && myActiveSeat.last_activity && user?.student) {
      const elapsed = Date.now() - new Date(myActiveSeat.last_activity).getTime();
      const remaining = stillHereIntervalMs - elapsed;

      const schedulePrompt = (delay: number) => {
        stillHereTimerRef.current = setTimeout(() => {
          setShowStillHerePrompt(true);
          graceTimerRef.current = setTimeout(() => {
            // User ignored prompt – auto-release
            setShowStillHerePrompt(false);
            if (myActiveSeat && user?.student) {
              mockAutoRelease(myActiveSeat.id, myActiveSeat.seat_code, user.student.name, true);
              refreshAll();
            }
          }, stillHereGraceMs);
        }, delay);
      };

      if (remaining <= 0) {
        schedulePrompt(0);
      } else {
        schedulePrompt(remaining);
      }
    }

    return () => {
      if (stillHereTimerRef.current) clearTimeout(stillHereTimerRef.current);
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, [myActiveSeat?.status, myActiveSeat?.last_activity, stillHereIntervalMs, stillHereGraceMs]);

  // ── Waitlist Expiration Timer ──────────────────────────────────────────────
  useEffect(() => {
    if (waitlistTimerRef.current) clearTimeout(waitlistTimerRef.current);

    if (myWaitlistEntry?.status === 'ASSIGNED' && myWaitlistEntry?.assigned_at) {
      const elapsed = Date.now() - new Date(myWaitlistEntry.assigned_at).getTime();
      const remaining = waitlistTimeoutMs - elapsed;
      if (remaining <= 0) {
        leaveWaitlist();
      } else {
        waitlistTimerRef.current = setTimeout(() => {
          leaveWaitlist();
        }, remaining);
      }
    }

    return () => {
      if (waitlistTimerRef.current) clearTimeout(waitlistTimerRef.current);
    };
  }, [myWaitlistEntry?.status, myWaitlistEntry?.assigned_at, waitlistTimeoutMs]);

  // ── Operations ────────────────────────────────────────────────────────────────
  const checkIn = useCallback(async (seatCode: string) => {
    if (!user?.student) throw new Error('Not logged in');
    const allSeats = mockGetSeats();
    const seat = allSeats.find(s => s.seat_code === seatCode);
    if (!seat) throw new Error(`Seat ${seatCode} not found.`);
    mockCheckIn(seat.id, seatCode, user.student.id, user.student.name);
    refreshAll();
  }, [user, refreshAll]);

  const checkOut = useCallback(async () => {
    if (!myActiveSeat || !user?.student) throw new Error('No active seat');
    mockCheckOut(myActiveSeat.id, myActiveSeat.seat_code, user.student.name);
    setShowStillHerePrompt(false);
    refreshAll();
  }, [myActiveSeat, user, refreshAll]);

  const setAway = useCallback(async () => {
    if (!myActiveSeat || !user?.student) throw new Error('No active seat');
    if (myActiveSeat.status !== 'occupied') throw new Error('Can only go away from occupied seat');
    mockSetAway(myActiveSeat.id, myActiveSeat.seat_code, user.student.name);
    refreshAll();
  }, [myActiveSeat, user, refreshAll]);

  const setReturn = useCallback(async () => {
    if (!myActiveSeat || !user?.student) throw new Error('No active seat');
    if (myActiveSeat.status !== 'away') throw new Error('Not in away mode');
    mockSetReturn(myActiveSeat.id, myActiveSeat.seat_code, user.student.name);
    refreshAll();
  }, [myActiveSeat, user, refreshAll]);

  const confirmStillHere = useCallback(async () => {
    if (!myActiveSeat || !user?.student) return;
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    setShowStillHerePrompt(false);
    mockUpdateLastActivity(myActiveSeat.id);
    refreshAll();
  }, [myActiveSeat, user, refreshAll]);

  const joinWaitlist = useCallback(async () => {
    if (!user?.student) throw new Error('Not logged in');
    mockJoinWaitlist(user.student.id);
    // Log a WAITLIST_JOIN event
    const allSeats = mockGetSeats();
    mockInsertLog(allSeats[0]?.id ?? 'wl', 'WAITLIST', 'WAITLIST_JOIN', { student_id: user.student.id }, user.student.name);
    refreshAll();
  }, [user, refreshAll]);

  const leaveWaitlist = useCallback(async () => {
    if (!user?.student) return;
    mockRemoveFromWaitlist(user.student.id);
    refreshAll();
  }, [user, refreshAll]);

  const adminRelease = useCallback(async (seatId: string, seatCode: string) => {
    mockAdminReleaseSeat(seatId, seatCode);
    refreshAll();
  }, [refreshAll]);

  return (
    <SeatContext.Provider value={{
      seats,
      logs,
      waitlist,
      heatStats,
      myActiveSeat,
      myWaitlistEntry,
      showStillHerePrompt,
      checkIn,
      checkOut,
      setAway,
      setReturn,
      confirmStillHere,
      joinWaitlist,
      leaveWaitlist,
      adminRelease,
      refreshAll,
    }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);
