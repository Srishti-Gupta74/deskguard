import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSeat } from '../contexts/SeatContext';
import { useDemoMode } from '../contexts/DemoContext';
import { LibraryMap } from '../components/LibraryMap';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { WaitlistPanel } from '../components/WaitlistPanel';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import {
  LayoutDashboard, Activity, Users,
  Shield, Zap, TrendingUp, AlertTriangle, RefreshCw,
  MapPin
} from 'lucide-react';

const GlassStatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  accent: string; icon: React.ReactNode;
}> = ({ label, value, sub, accent, icon }) => (
  <div
    style={{
      padding: '16px 18px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginTop: 2, border: '1px solid rgba(255,255,255,0.04)'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const PanelTitle: React.FC<{ title: string; icon: React.ReactNode; right?: React.ReactNode }> = ({ title, icon, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      <span style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{title}</span>
    </div>
    {right}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { seats, logs, waitlist, refreshAll } = useSeat();
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, navigate]);

  const total = seats.length;
  const occupied = seats.filter(s => s.status === 'occupied').length;
  const away = seats.filter(s => s.status === 'away').length;
  const available = seats.filter(s => s.status === 'available').length;
  const occupancyPct = Math.round(((occupied + away) / total) * 100);
  const waitingCount = waitlist.filter(w => w.status === 'WAITING').length;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(l => new Date(l.timestamp) >= today);
  const abandonsToday = todayLogs.filter(l => l.action === 'ABANDONED').length;
  const autoReleasesToday = todayLogs.filter(l => l.action === 'AUTO_RELEASE').length;

  const stats = [
    { label: 'Total Seats', value: total, accent: 'rgba(255,255,255,0.05)', icon: <LayoutDashboard size={16} style={{ color: '#94a3b8' }} /> },
    { label: 'Occupied', value: occupied, accent: 'rgba(239,68,68,0.1)', icon: <AlertTriangle size={16} style={{ color: '#fca5a5' }} /> },
    { label: 'Available', value: available, accent: 'rgba(34,197,94,0.1)', icon: <Shield size={16} style={{ color: '#86efac' }} /> },
    { label: 'Away', value: away, accent: 'rgba(245,158,11,0.1)', icon: <Zap size={16} style={{ color: '#fcd34d' }} /> },
    { label: 'Occupancy', value: `${occupancyPct}%`, accent: 'rgba(124,58,237,0.1)', icon: <TrendingUp size={16} style={{ color: '#c4b5fd' }} /> },
    { label: 'Waitlist', value: waitingCount, accent: 'rgba(79,70,229,0.1)', icon: <Users size={16} style={{ color: '#a5b4fc' }} /> },
    { label: 'Abandonments', value: abandonsToday, sub: 'Today', accent: 'rgba(234,88,12,0.1)', icon: <AlertTriangle size={16} style={{ color: '#fdba74' }} /> },
    { label: 'Auto-Releases', value: autoReleasesToday, sub: 'Today', accent: 'rgba(236,72,153,0.1)', icon: <RefreshCw size={16} style={{ color: '#f9a8d4' }} /> },
  ];

  const occupancyTrendData = [
    { time: '8 AM', occupancy: 15 },
    { time: '10 AM', occupancy: 42 },
    { time: '12 PM', occupancy: 78 },
    { time: '2 PM', occupancy: 91 },
    { time: '4 PM', occupancy: 87 },
    { time: '7 PM', occupancy: 54 },
    { time: '9 PM', occupancy: 22 },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0c', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '32px 32px' }}>

        {/* ── Header ─────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} style={{ color: '#e2e8f0' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>DeskGuard Command Center</h1>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Operations & Live Monitoring</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: isDemoMode ? '#f59e0b' : '#64748b' }}>Demo Mode</span>
              <div 
                onClick={() => {
                  toggleDemoMode();
                  window.location.reload();
                }}
                style={{ width: 40, height: 20, borderRadius: 10, background: isDemoMode ? '#f59e0b' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
              >
                <div style={{ position: 'absolute', top: 2, left: isDemoMode ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <button onClick={refreshAll} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = '#1e293b'}>
              <RefreshCw size={14} /> Refresh Data
            </button>
          </div>
        </div>

        {/* ── Top Row: Stats Grid ───────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map((s) => <GlassStatCard key={s.label} {...s} />)}
        </div>

        {/* ── Middle Row: Bento Grid ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, marginBottom: 24 }}>
          
          {/* Occupancy Trend */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Occupancy Trend</h3>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Daily library occupancy throughout the day</div>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `${val}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="occupancy" name="Occupancy %" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#0f111a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#818cf8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column (Waitlist + Activity Feed) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, flex: 1 }}>
              <PanelTitle title="Live Activity Feed" icon={<Activity size={16} style={{ color: '#94a3b8' }} />} />
              <div style={{ height: '300px', overflowY: 'auto' }}>
                <LiveActivityFeed />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
              <PanelTitle title="Current Waitlist" icon={<Users size={16} style={{ color: '#94a3b8' }} />} />
              <WaitlistPanel />
            </div>

          </div>
        </div>

        {/* ── Lower Section: Analytics ──────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <AnalyticsDashboard />
        </div>

        {/* ── Bottom Section: Admin Operations Map ────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
          <PanelTitle title="Operations Floor Map" icon={<MapPin size={16} style={{ color: '#94a3b8' }} />} />
          <div style={{ position: 'relative', height: 450 }}>
            <LibraryMap />
          </div>
        </div>

      </div>
    </div>
  );
};
