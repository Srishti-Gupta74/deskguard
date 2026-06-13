import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Seat } from '../types';
import { useSeat } from '../contexts/SeatContext';
import { Wind, Zap } from 'lucide-react';

interface LibraryMapProps {
  onSeatClick?: (seat: Seat) => void;
  adminMode?: boolean;
}

const STATUS_CONFIG = {
  available: {
    bg: '#22c55e',
    border: '#15803d',
    text: '#86efac',
    glowClass: 'glow-seat-available',
  },
  occupied: {
    bg: '#ef4444',
    border: '#b91c1c',
    text: '#fca5a5',
    glowClass: 'glow-seat-occupied',
  },
  away: {
    bg: '#fcd34d',
    border: '#d97706',
    text: '#fde68a',
    glowClass: 'glow-seat-away'
  },
  awaiting_claim: {
    bg: '#f97316',
    border: '#c2410c',
    text: '#fdba74',
    glowClass: 'glow-seat-away'
  }
} as const;

// 3 rows layout exactly like the image
const SPATIAL_LAYOUT: Record<string, { x: number; y: number }> = {
  // Zone A - Top row
  'A1': { x: 12, y: 30 },
  'A2': { x: 20, y: 30 },
  'A3': { x: 28, y: 30 },
  'A4': { x: 36, y: 30 },
  'A5': { x: 44, y: 30 },
  'A6': { x: 52, y: 30 },
  'A7': { x: 60, y: 30 },
  'A8': { x: 68, y: 30 },
  'A9': { x: 76, y: 30 },
  'A10': { x: 84, y: 30 },

  // Zone B - Middle row
  'B1': { x: 16, y: 56 },
  'B2': { x: 24, y: 56 },
  'B3': { x: 32, y: 56 },
  'B4': { x: 40, y: 56 },
  'B5': { x: 48, y: 56 },
  'B6': { x: 56, y: 56 },
  'B7': { x: 64, y: 56 },
  'B8': { x: 72, y: 56 },
  'B9': { x: 80, y: 56 },
  'B10': { x: 88, y: 56 },

  // Zone C - Bottom row
  'C1': { x: 12, y: 82 },
  'C2': { x: 20, y: 82 },
  'C3': { x: 28, y: 82 },
  'C4': { x: 36, y: 82 },
  'C5': { x: 44, y: 82 },
  'C6': { x: 52, y: 82 },
  'C7': { x: 60, y: 82 },
  'C8': { x: 68, y: 82 },
  'C9': { x: 76, y: 82 },
  'C10': { x: 84, y: 82 },
};

const SeatTile: React.FC<{
  seat: Seat;
  isMyActiveSeat: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({ seat, isMyActiveSeat, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const layout = SPATIAL_LAYOUT[seat.seat_code] || { x: 0, y: 0 };
  const cfg = STATUS_CONFIG[seat.status];

  const scale = hovered ? 1.05 : 1;
  const isTargetSeat = isMyActiveSeat; 

  return (
    <motion.div
      layout
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cfg.glowClass}
      style={{
        position: 'absolute',
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: 44,
        height: 38,
        background: cfg.bg,
        border: `2px solid ${isTargetSeat ? '#d946ef' : cfg.border}`,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isTargetSeat ? '0 0 0 2px rgba(217, 70, 239, 0.5), inset 0 0 20px rgba(0,0,0,0.5)' : undefined,
        transformOrigin: 'center',
        zIndex: hovered || isTargetSeat ? 20 : 1,
      }}
    >
      <span style={{
        fontSize: 13,
        fontWeight: 900,
        color: '#ffffff',
        letterSpacing: '0.02em',
        userSelect: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
      }}>
        {seat.seat_code}
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 10, 35, 0.95)',
              border: `1px solid ${isTargetSeat ? '#d946ef' : cfg.border}`,
              borderRadius: 12,
              padding: '12px',
              width: 140,
              zIndex: 100,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)',
              marginTop: 10,
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', marginBottom: 6 }}>Desk {seat.seat_code}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: isTargetSeat ? '#22c55e' : cfg.border, boxShadow: `0 0 8px ${cfg.border}` }} />
              <span style={{ fontSize: 11, color: isTargetSeat ? '#86efac' : cfg.text, fontWeight: 700, textTransform: 'uppercase' }}>
                {seat.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>
                <Wind size={12} /> Window Seat
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>
                <Zap size={12} /> Power Outlet
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const LibraryMap: React.FC<LibraryMapProps> = ({
  onSeatClick,
  adminMode = false
}) => {
  const { seats, myActiveSeat } = useSeat();
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [selectedSeatCode, setSelectedSeatCode] = useState<string | null>(null);
  const [localFilter, setLocalFilter] = useState<'all' | 'window' | 'power' | 'quiet'>('all');

  const handleSeatClick = (e: React.MouseEvent, seat: Seat) => {
    e.stopPropagation(); // prevent clicking map background from immediately closing it
    setSelectedSeatCode(prev => prev === seat.seat_code ? null : seat.seat_code);
    if (onSeatClick) onSeatClick(seat);
  };

  const handleMapClick = () => {
    setSelectedSeatCode(null);
  };

  // Helper to determine if a seat passes the active filter
  const passesFilter = (seat: Seat) => {
    if (localFilter === 'all') return true;
    if (localFilter === 'window') return seat.zone === 'A';
    if (localFilter === 'power') return seat.zone === 'B' || parseInt(seat.seat_code.slice(1)) % 2 === 0;
    if (localFilter === 'quiet') return seat.zone === 'C';
    return true;
  };

  const getFilterStyle = (f: string) => {
    if (localFilter === f) {
      return { background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.5)', color: '#e9d5ff', padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(139, 92, 246, 0.3)', transition: 'all 0.2s' };
    }
    return { background: 'transparent', border: '1px solid transparent', color: '#94a3b8', padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' };
  };

  return (
    <div className="neon-border-box" onClick={handleMapClick} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, padding: '2px', overflow: 'hidden', background: 'transparent' }}>
      
      {/* Header Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); setLocalFilter('all') }} style={getFilterStyle('all')}>All Seats</button>
            <button onClick={(e) => { e.stopPropagation(); setLocalFilter('window') }} style={getFilterStyle('window')}>Window Seats</button>
            <button onClick={(e) => { e.stopPropagation(); setLocalFilter('power') }} style={getFilterStyle('power')}>Power Outlets</button>
            <button onClick={(e) => { e.stopPropagation(); setLocalFilter('quiet') }} style={getFilterStyle('quiet')}>Quiet Zone</button>
          </div>
        
          <div style={{ display: 'flex', gap: 16, fontSize: 11, justifyContent: 'flex-end' }}>
            {[
              { color: '#22c55e', label: `Available`, glow: 'rgba(34,197,94,0.6)' },
              { color: '#ef4444', label: `Occupied`, glow: 'rgba(239,68,68,0.6)' },
              { color: '#f59e0b', label: `Away`, glow: 'rgba(245,158,11,0.6)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.glow}` }} />
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>



      {/* Spatial Map Canvas */}
      <div 
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          background: 'transparent',
          overflow: 'hidden',
        }}
      >
        {/* Magical sweeping light trails (SVG) - only visible gently on hover */}
        <AnimatePresence>
          {isMapHovered && (
            <motion.svg 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
            >
              <defs>
                <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                  <stop offset="30%" stopColor="rgba(56, 189, 248, 0.2)" />
                  <stop offset="70%" stopColor="rgba(217, 70, 239, 0.3)" />
                  <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <path 
                d="M -100 250 C 150 150, 250 100, 400 150 C 550 200, 650 100, 900 80" 
                fill="none" stroke="url(#trailGrad)" strokeWidth="6" filter="url(#glow)" 
                opacity="0.6"
              />
              <path 
                d="M 50 350 C 200 450, 300 200, 500 250 C 700 300, 800 200, 1000 250" 
                fill="none" stroke="url(#trailGrad)" strokeWidth="3" filter="url(#glow)" 
                opacity="0.4"
              />
              
              {/* Subtle sparkles along the trail */}
              <circle cx="280" cy="130" r="2" fill="rgba(255,255,255,0.5)" filter="url(#glow)" />
              <circle cx="350" cy="180" r="1.5" fill="rgba(255,255,255,0.5)" filter="url(#glow)" />
              <circle cx="500" cy="130" r="2.5" fill="rgba(255,255,255,0.5)" filter="url(#glow)" />
              <circle cx="650" cy="180" r="1" fill="rgba(255,255,255,0.5)" filter="url(#glow)" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Map Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Zone Labels */}
        <div style={{ position: 'absolute', width: '100%', top: '20%', textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#818cf8', letterSpacing: '0.05em' }}>Zone A - Window Area</span>
          {adminMode && <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{Math.round((seats.filter(s => s.zone === 'A' && s.status !== 'available').length / 10) * 100)}% Occupied</span>}
        </div>
        <div style={{ position: 'absolute', width: '100%', top: '46%', textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#c084fc', letterSpacing: '0.05em' }}>Zone B - Central Area</span>
          {adminMode && <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{Math.round((seats.filter(s => s.zone === 'B' && s.status !== 'available').length / 10) * 100)}% Occupied</span>}
        </div>
        <div style={{ position: 'absolute', width: '100%', top: '72%', textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em' }}>Zone C - Quiet Area</span>
          {adminMode && <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>{Math.round((seats.filter(s => s.zone === 'C' && s.status !== 'available').length / 10) * 100)}% Occupied</span>}
        </div>

        {/* Inner frame styling mimicking the image's structure */}
        <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(139,92,246,0.15)', borderRadius: 16, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -5, left: '10%', width: 40, height: 10, background: 'var(--neon-bg)', borderLeft: '1px solid rgba(139,92,246,0.3)', borderRight: '1px solid rgba(139,92,246,0.3)' }} />
          <div style={{ position: 'absolute', bottom: -5, right: '20%', width: 60, height: 10, background: 'var(--neon-bg)', borderLeft: '1px solid rgba(139,92,246,0.3)', borderRight: '1px solid rgba(139,92,246,0.3)' }} />
        </div>

        {/* Seats */}
        {seats.map((seat) => {
          const isSelected = selectedSeatCode === seat.seat_code;
          const isFaded = !passesFilter(seat);

          return (
            <div key={seat.id} style={{ opacity: isFaded ? 0.1 : 1, transition: 'opacity 0.3s', pointerEvents: isFaded ? 'none' : 'auto' }}>
              <SeatTile
                seat={seat}
                isMyActiveSeat={myActiveSeat?.id === seat.id || isSelected}
                onClick={(e) => handleSeatClick(e, seat)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
