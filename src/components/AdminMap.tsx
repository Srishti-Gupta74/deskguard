import React, { useMemo } from 'react';
import type { Seat } from '../types';
import { useSeat } from '../contexts/SeatContext';

const StatusColors: Record<string, string> = {
  available: '#22c55e', // Solid Green
  occupied: '#ef4444',  // Solid Red
  away: '#eab308',      // Solid Yellow
  awaiting_claim: '#f97316' // Solid Orange
};

const SeatBlock: React.FC<{ seat: Seat; onClick?: (seat: Seat) => void }> = ({ seat, onClick }) => {
  return (
    <button
      onClick={() => onClick?.(seat)}
      style={{
        background: StatusColors[seat.status] || '#334155',
        border: 'none',
        borderRadius: 4,
        padding: '6px 0',
        width: 48,
        color: '#fff',
        fontSize: 12,
        fontWeight: 800,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'opacity 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
    >
      {seat.seat_code}
    </button>
  );
};

export const AdminMap: React.FC<{ onSeatClick?: (seat: Seat) => void }> = ({ onSeatClick }) => {
  const { seats } = useSeat();

  const seatsByZone = useMemo(() => {
    const zones: Record<string, Seat[]> = { A: [], B: [], C: [] };
    seats.forEach(s => {
      if (zones[s.zone]) zones[s.zone].push(s);
    });
    // Sort seats by seat_code (e.g. A1, A2...)
    Object.values(zones).forEach(list => list.sort((a, b) => a.seat_code.localeCompare(b.seat_code, undefined, { numeric: true })));
    return zones;
  }, [seats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0' }}>
      
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Available', color: StatusColors.available },
          { label: 'Occupied', color: StatusColors.occupied },
          { label: 'Away', color: StatusColors.away },
          { label: 'Awaiting Claim', color: StatusColors.awaiting_claim },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {Object.entries(seatsByZone).map(([zone, zoneSeats]) => (
          <div key={zone} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, flex: 1, minWidth: 250 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
              Zone {zone}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {zoneSeats.map(seat => (
                <SeatBlock key={seat.id} seat={seat} onClick={onSeatClick} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
