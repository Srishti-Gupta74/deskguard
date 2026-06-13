import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';


const PanelTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(to bottom, #a855f7, #3b82f6)', boxShadow: '0 0 10px rgba(168,85,247,0.5)' }} />
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
    </div>
    {subtitle && <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 500, paddingLeft: 16 }}>{subtitle}</div>}
  </div>
);



const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15, 10, 30, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: 16, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(168, 85, 247, 0.1) inset' }}>
      <div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>{p.name}:</span> {p.value}
        </div>
      ))}
    </div>
  );
};

const GradientDefs = () => (
  <defs>
    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
    </linearGradient>
    <linearGradient id="gradPink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
      <stop offset="100%" stopColor="#db2777" stopOpacity={0.8} />
    </linearGradient>
    <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
    </linearGradient>
    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
      <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
    </linearGradient>
    <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
      <stop offset="100%" stopColor="#c2410c" stopOpacity={0.8} />
    </linearGradient>
    <linearGradient id="gradYellow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fcd34d" stopOpacity={1} />
      <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
    </linearGradient>
  </defs>
);

export const AnalyticsDashboard: React.FC = () => {

  // ── 2. Zone Utilization (Bar) ────────────────────────────────────────────────
  const zoneUtilizationData = [
    { zone: 'Zone A', occupancy: 78, duration: 120 },
    { zone: 'Zone B', occupancy: 92, duration: 95 },
    { zone: 'Zone C', occupancy: 45, duration: 180 },
  ];

  // ── 3. Peak Hours (Line) ───────────────────────────────────────────────────
  const peakHoursData = [
    { hour: '08:00', usage: 120 }, { hour: '10:00', usage: 350 },
    { hour: '12:00', usage: 500 }, { hour: '14:00', usage: 800 },
    { hour: '16:00', usage: 720 }, { hour: '18:00', usage: 450 },
    { hour: '20:00', usage: 300 }, { hour: '22:00', usage: 150 },
  ];

  // ── 4. Waitlist Demand (Bar) ───────────────────────────────────────────────
  const waitlistDemandData = [
    { day: 'Monday', joins: 45, waitTime: 12 },
    { day: 'Tuesday', joins: 52, waitTime: 15 },
    { day: 'Wednesday', joins: 86, waitTime: 25 },
    { day: 'Thursday', joins: 64, waitTime: 18 },
    { day: 'Friday', joins: 32, waitTime: 8 },
    { day: 'Weekend', joins: 95, waitTime: 35 },
  ];

  // ── 5. Auto Release Activity (Bar) ─────────────────────────────────────────
  const autoReleaseData = [
    { name: 'Auto Releases', value: 145 },
    { name: 'Break Mode', value: 380 },
    { name: 'Manual', value: 85 },
  ];

  // ── 6. Top Seats (Horizontal Bar) ──────────────────────────────────────────
  const topSeatsData = [
    { seat: 'A3', reservations: 142, hours: 320 },
    { seat: 'B4', reservations: 128, hours: 280 },
    { seat: 'C2', reservations: 115, hours: 410 },
    { seat: 'A8', reservations: 98, hours: 190 },
    { seat: 'B1', reservations: 85, hours: 160 },
  ].reverse(); // Reverse for bottom-up horizontal bar rendering

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ── Charts Grid ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Chart 2: Zone Utilization */}
        <div style={{ background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.4) 0%, rgba(15, 10, 30, 0.6) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(168,85,247,0.1)' }}>
          <PanelTitle title="Zone Utilization" subtitle="Average occupancy vs session duration by zone" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneUtilizationData}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `${val}%`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={10} tickFormatter={(val) => `${val}m`} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, paddingTop: 20 }} />
                <Bar yAxisId="left" dataKey="occupancy" name="Avg Occupancy" fill="url(#gradGreen)" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar yAxisId="right" dataKey="duration" name="Avg Duration (mins)" fill="url(#gradPink)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Peak Hours */}
        <div style={{ background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.4) 0%, rgba(15, 10, 30, 0.6) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(168,85,247,0.1)' }}>
          <PanelTitle title="Historical Peak Hours" subtitle="Spikes in seating demand over historical data" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ stroke: 'rgba(168,85,247,0.2)', strokeWidth: 2 }} content={<CustomTooltip />} />
                <Line type="monotone" dataKey="usage" name="Seat Claims" stroke="#fbbf24" strokeWidth={4} dot={false} activeDot={{ r: 8, fill: '#fbbf24', stroke: '#0f111a', strokeWidth: 3 }} style={{ filter: 'drop-shadow(0px 8px 12px rgba(251, 191, 36, 0.4))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Waitlist Demand */}
        <div style={{ background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.4) 0%, rgba(15, 10, 30, 0.6) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(168,85,247,0.1)' }}>
          <PanelTitle title="Waitlist Demand" subtitle="Joins and average wait times by day" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitlistDemandData}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={10} tickFormatter={(val) => `${val}m`} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, paddingTop: 20 }} />
                <Bar yAxisId="left" dataKey="joins" name="Waitlist Joins" fill="url(#gradPurple)" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar yAxisId="right" dataKey="waitTime" name="Avg Wait (mins)" fill="url(#gradBlue)" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Auto Release Activity */}
        <div style={{ background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.4) 0%, rgba(15, 10, 30, 0.6) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(168,85,247,0.1)' }}>
          <PanelTitle title="Auto Release Activity" subtitle="Effectiveness of DeskGuard automations" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={autoReleaseData}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                <Bar dataKey="value" name="Occurrences" fill="url(#gradOrange)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Top Seats */}
        <div style={{ background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.4) 0%, rgba(15, 10, 30, 0.6) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 10px rgba(168,85,247,0.1)' }}>
          <PanelTitle title="Top 5 Seats" subtitle="Seat popularity by total reservations" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topSeatsData} margin={{ left: 0 }}>
                <GradientDefs />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis dataKey="seat" type="category" stroke="#f8fafc" fontWeight={800} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, paddingTop: 20 }} />
                <Bar dataKey="reservations" name="Reservations" fill="url(#gradBlue)" radius={[0, 6, 6, 0]} barSize={12} />
                <Bar dataKey="hours" name="Total Study Hours" fill="url(#gradPurple)" radius={[0, 6, 6, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
