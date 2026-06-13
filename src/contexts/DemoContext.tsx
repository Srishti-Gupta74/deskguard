import React, { createContext, useContext, useState, useCallback } from 'react';

interface DemoContextValue {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  awayTimeoutMs: number;
  stillHereIntervalMs: number;
  stillHereGraceMs: number;
  waitlistTimeoutMs: number;  // ms user has to claim assigned seat
}

const NORMAL_AWAY_MS = 20 * 60 * 1000;        // 20 minutes
const DEMO_AWAY_MS   = 20 * 1000;              // 20 seconds
const NORMAL_STILL_HERE_MS = 2 * 60 * 60 * 1000; // 2 hours
const DEMO_STILL_HERE_MS   = 60 * 1000;          // 60 seconds
const NORMAL_WAITLIST_MS = 60 * 1000;      // 60 seconds
const DEMO_WAITLIST_MS   = 60 * 1000;      // 60 seconds
const STILL_HERE_GRACE_MS  = 30 * 1000;          // 30 seconds to respond
const DEMO_STILL_HERE_GRACE_MS = 10 * 1000;      // 10 seconds to respond

const DemoContext = createContext<DemoContextValue>({
  isDemoMode: false,
  toggleDemoMode: () => {},
  awayTimeoutMs: NORMAL_AWAY_MS,
  stillHereIntervalMs: NORMAL_STILL_HERE_MS,
  stillHereGraceMs: STILL_HERE_GRACE_MS,
  waitlistTimeoutMs: NORMAL_WAITLIST_MS,
});

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('dg_demo_mode') === 'true';
  });

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const next = !prev;
      localStorage.setItem('dg_demo_mode', String(next));
      return next;
    });
  }, []);

  const awayTimeoutMs = isDemoMode ? DEMO_AWAY_MS : NORMAL_AWAY_MS;
  const stillHereIntervalMs = isDemoMode ? DEMO_STILL_HERE_MS : NORMAL_STILL_HERE_MS;
  const waitlistTimeoutMs = isDemoMode ? DEMO_WAITLIST_MS : NORMAL_WAITLIST_MS;
  const stillHereGraceMs = isDemoMode ? DEMO_STILL_HERE_GRACE_MS : STILL_HERE_GRACE_MS;

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, awayTimeoutMs, stillHereIntervalMs, stillHereGraceMs, waitlistTimeoutMs }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => useContext(DemoContext);
