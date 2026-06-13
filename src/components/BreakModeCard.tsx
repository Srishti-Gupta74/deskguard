import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSeat } from '../contexts/SeatContext';
import { useDemoMode } from '../contexts/DemoContext';
import { RotateCcw, LogOut, Loader2 } from 'lucide-react';

const MICRO_COPY = [
  "We've got your seat. ☕",
  "Stretch your legs.",
  "Your desk is waiting.",
  "Take a breather.",
];

interface BreakModeCardProps {
  onCheckOut: () => Promise<void>;
  onReturn: () => Promise<void>;
}

export const BreakModeCard: React.FC<BreakModeCardProps> = ({ onCheckOut, onReturn }) => {
  const { myActiveSeat } = useSeat();
  const { awayTimeoutMs } = useDemoMode();
  const [remaining, setRemaining] = useState(0);
  const [returnLoading, setReturnLoading] = useState(false);
  const [outLoading, setOutLoading] = useState(false);
  const [micro] = useState(() => MICRO_COPY[Math.floor(Math.random() * MICRO_COPY.length)]);

  useEffect(() => {
    if (!myActiveSeat?.away_start_time) return;
    const update = () => {
      const elapsed = Date.now() - new Date(myActiveSeat.away_start_time!).getTime();
      setRemaining(Math.max(0, awayTimeoutMs - elapsed));
    };
    update();
    const t = setInterval(update, 250);
    return () => clearInterval(t);
  }, [myActiveSeat?.away_start_time, awayTimeoutMs]);

  const progress = remaining / awayTimeoutMs;
  const totalSecs = Math.round(remaining / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `0:${String(secs).padStart(2, '0')}`;

  // Ring
  const size = 160;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  const urgentColor = remaining < awayTimeoutMs * 0.2;

  const handleReturn = async () => {
    setReturnLoading(true);
    try { await onReturn(); } finally { setReturnLoading(false); }
  };

  const handleCheckOut = async () => {
    setOutLoading(true);
    try { await onCheckOut(); } finally { setOutLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass-card rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: '0 0 40px rgba(245,158,11,0.08), 0 4px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top status bar */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.12)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.6)' }}
        />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fcd34d', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Break Mode Active
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(148,163,184,0.6)', fontWeight: 600 }}>
          Seat {myActiveSeat?.seat_code}
        </span>
      </div>

      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* Countdown ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={stroke}
              />
              {/* Progress */}
              <motion.circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none"
                stroke={urgentColor ? '#ef4444' : '#f59e0b'}
                strokeWidth={stroke}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                animate={{
                  stroke: urgentColor ? '#ef4444' : '#f59e0b',
                  filter: urgentColor
                    ? 'drop-shadow(0 0 6px rgba(239,68,68,0.7))'
                    : 'drop-shadow(0 0 6px rgba(245,158,11,0.6))',
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            {/* Center text */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 26, fontWeight: 900, color: urgentColor ? '#fca5a5' : '#fcd34d',
                fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                {timeStr}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', marginTop: 3, fontWeight: 600 }}>remaining</span>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginBottom: 4, lineHeight: 1.3 }}>
              Your seat is<br />reserved.
            </p>
            <p style={{ fontSize: 13, color: '#fcd34d', fontWeight: 600, marginBottom: 16, opacity: 0.9 }}>
              {micro}
            </p>

            {/* Progress bar */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress * 100}%` }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: urgentColor ? '#ef4444' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  boxShadow: `0 0 8px ${urgentColor ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'}`,
                }}
                transition={{ duration: 0.25 }}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReturn}
                disabled={returnLoading}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '11px 0',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: 13,
                  border: 'none',
                  cursor: returnLoading ? 'not-allowed' : 'pointer',
                  opacity: returnLoading ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
                }}
              >
                {returnLoading ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                Back Already?
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckOut}
                disabled={outLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 16px',
                  borderRadius: 12,
                  background: 'rgba(239,68,68,0.1)',
                  color: '#fca5a5',
                  fontWeight: 700,
                  fontSize: 12,
                  border: '1px solid rgba(239,68,68,0.25)',
                  cursor: outLoading ? 'not-allowed' : 'pointer',
                  opacity: outLoading ? 0.7 : 1,
                }}
              >
                {outLoading ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                Free Seat
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
