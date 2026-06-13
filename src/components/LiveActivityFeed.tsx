import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeat } from '../contexts/SeatContext';
import type { SeatLog, LogAction } from '../types';
import {
  LogIn, LogOut, Clock, RotateCcw, Zap, AlertOctagon, Users, UserCheck
} from 'lucide-react';

const ACTION_CONFIG: Record<LogAction, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  CHECK_IN: { icon: <LogIn size={13} />, bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  CHECK_OUT: { icon: <LogOut size={13} />, bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
  AWAY: { icon: <Clock size={13} />, bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
  RETURN: { icon: <RotateCcw size={13} />, bg: 'rgba(14,165,233,0.1)', text: '#38bdf8', border: 'rgba(14,165,233,0.2)' },
  AUTO_RELEASE: { icon: <Zap size={13} />, bg: 'rgba(236,72,153,0.1)', text: '#f472b6', border: 'rgba(236,72,153,0.2)' },
  ABANDONED: { icon: <AlertOctagon size={13} />, bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  WAITLIST_JOIN: { icon: <Users size={13} />, bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
  WAITLIST_ASSIGNED: { icon: <UserCheck size={13} />, bg: 'rgba(16,185,129,0.1)', text: '#34d399', border: 'rgba(16,185,129,0.2)' },
};

function formatActionText(log: SeatLog): string {
  const name = (log.metadata as { student_name?: string })?.student_name?.split(' ')[0] ?? 'Someone';
  const seat = log.seat_code ? `Seat ${log.seat_code}` : '';
  switch (log.action) {
    case 'CHECK_IN': return `${name} checked into ${seat}`;
    case 'CHECK_OUT': return `${name} left ${seat}`;
    case 'AWAY': return `${name} took a break from ${seat}`;
    case 'RETURN': return `${name} returned to ${seat}`;
    case 'AUTO_RELEASE': return `${seat} was auto-released`;
    case 'ABANDONED': return `${seat} marked abandoned`;
    case 'WAITLIST_JOIN': return `${name} joined waitlist`;
    case 'WAITLIST_ASSIGNED': return `${name} assigned to ${seat}`;
    default: return log.action;
  }
}

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

export const LiveActivityFeed: React.FC<{ maxItems?: number; compact?: boolean }> = ({ maxItems = 50, compact = false }) => {
  const { logs } = useSeat();
  const displayLogs = logs.slice(0, maxItems);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.6)' }} className="pulse-dot" />
          <h3 style={{ fontSize: compact ? 13 : 15, fontWeight: 800, color: '#f8fafc' }}>Live Activity</h3>
        </div>
      </div>

      <div className="scrollbar-thin" style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: compact ? 6 : 8 }}>
        <AnimatePresence initial={false}>
          {displayLogs.map((log) => {
            const cfg = ACTION_CONFIG[log.action as LogAction] || { icon: <Zap size={13} />, bg: 'rgba(255,255,255,0.1)', text: '#fff', border: 'rgba(255,255,255,0.2)' };
            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: compact ? '8px 12px' : '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{
                  width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: 10,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  color: cfg.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatActionText(log)}
                  </div>
                </div>
                <div style={{ fontSize: compact ? 10 : 11, color: 'rgba(148,163,184,0.5)', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 500 }}>
                  {timeAgo(log.timestamp)}
                </div>
              </motion.div>
            );
          })}
          {displayLogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(148,163,184,0.4)', fontSize: 13 }}>
              No activity yet today
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
