import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSeat } from '../contexts/SeatContext';
import { useDemoMode } from '../contexts/DemoContext';
import { LibraryMap } from '../components/LibraryMap';
import { AmbientBackground } from '../components/AmbientBackground';
import {
  Bell, Shield, Flame, LogOut, QrCode, ChevronDown, Coffee, Users, CheckCircle2, Clock, MapPin, Play, Pause, Moon
} from 'lucide-react';
import type { Seat } from '../types';
import { QRCodeModal } from '../components/QRCodeModal';
import { CursorTrail } from '../components/CursorTrail';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { seats, myActiveSeat, setAway, setReturn, checkOut, waitlist, leaveWaitlist, joinWaitlist, checkIn, showStillHerePrompt, confirmStillHere } = useSeat();
  const { isDemoMode, toggleDemoMode, awayTimeoutMs, waitlistTimeoutMs, stillHereGraceMs } = useDemoMode();
  const navigate = useNavigate();

  const [sessionDuration, setSessionDuration] = useState(0);
  const [breakRemaining, setBreakRemaining] = useState(awayTimeoutMs / 1000);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [qrSeat, setQrSeat] = useState<string | null>(null);
  const [breakMsgIndex, setBreakMsgIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string, read: boolean}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifiedBreak, setHasNotifiedBreak] = useState(false);
  const [graceRemaining, setGraceRemaining] = useState(stillHereGraceMs / 1000);

  useEffect(() => {
    if (showStillHerePrompt) {
      setGraceRemaining(stillHereGraceMs / 1000);
      const t = setInterval(() => {
        setGraceRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(t);
    }
  }, [showStillHerePrompt, stillHereGraceMs]);

  const breakMessages = [
    "☕ Taking a quick break?",
    "📚 Your study session is paused.",
    "🌿 Stretch your legs.",
    "✨ Time to recharge.",
    "☕ Grab some water and come back refreshed.",
    "🌙 Small break, big focus."
  ];

  useEffect(() => {
    if (myActiveSeat?.status === 'away') {
      const interval = setInterval(() => {
        setBreakMsgIndex(prev => (prev + 1) % breakMessages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [myActiveSeat?.status, breakMessages.length]);

  useEffect(() => {
    if (!user) navigate('/login');
    if (user?.role === 'admin') navigate('/admin');
  }, [user, navigate]);

  useEffect(() => {
    const update = () => setSessionDuration(myActiveSeat?.check_in_time ? Date.now() - new Date(myActiveSeat.check_in_time).getTime() : 0);
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [myActiveSeat?.check_in_time]);

  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (sessionDuration >= 60000 && !hasNotifiedBreak) {
      setNotifications(prev => [{
        id: Date.now().toString(),
        text: "You've been studying continuously for a while! How about a quick break to touch some grass? 🌿",
        time: 'Just now',
        read: false
      }, ...prev]);
      setHasNotifiedBreak(true);
    }
  }, [sessionDuration, hasNotifiedBreak]);

  // Break mode true timer sync
  useEffect(() => {
    if (myActiveSeat?.status === 'away' && myActiveSeat?.away_start_time) {
      const start = new Date(myActiveSeat.away_start_time).getTime();
      const t = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, Math.floor((awayTimeoutMs - elapsed) / 1000));
        setBreakRemaining(remaining);
      }, 100);
      return () => clearInterval(t);
    } else {
      setBreakRemaining(awayTimeoutMs / 1000);
    }
  }, [myActiveSeat?.status, myActiveSeat?.away_start_time, awayTimeoutMs]);

  const firstName = user?.student?.name?.split(' ')[0] ?? 'Aurora';
  const isAway = myActiveSeat?.status === 'away';
  const isUrgent = isAway && breakRemaining <= 5;
  
  // Waitlist processing
  const studentId = user?.student?.id;
  const myWaitlistEntry = waitlist.find(w => w.student_id === studentId);
  const displayWaitlist = waitlist.slice(0, 5).map((w, i) => ({
    pos: i + 1,
    name: w.student_id === studentId ? 'You' : `Student ${w.student_id.substring(0,4)}`,
    wait: `${(i + 1) * 5} mins`,
    active: w.student_id === studentId
  }));

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen relative" style={{ padding: '24px 32px' }}>
      {qrSeat && <QRCodeModal seatCode={qrSeat} onClose={() => setQrSeat(null)} />}
      <CursorTrail />
      <AmbientBackground variant="student" />
      {/* FLOATING DEMO TOGGLE */}
      <div style={{ position: 'fixed', bottom: 120, right: 24, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(15, 10, 30, 0.9)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 100, backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.2) inset' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: isDemoMode ? '#f59e0b' : '#64748b' }}>Demo Mode</span>
        <div 
          onClick={() => {
            toggleDemoMode();
            window.location.reload();
          }}
          style={{ width: 50, height: 26, borderRadius: 13, background: isDemoMode ? '#f59e0b' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          <div style={{ position: 'absolute', top: 3, left: isDemoMode ? 27 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
      
      {/* STILL HERE PROMPT */}
      <AnimatePresence>
        {showStillHerePrompt && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="companion-card" style={{ position: 'relative', width: 400, padding: 32, textAlign: 'center', background: 'linear-gradient(180deg, rgba(30, 20, 60, 0.95) 0%, rgba(15, 10, 30, 0.95) 100%)', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 20px 60px rgba(245,158,11,0.2)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)' }}>
                <Clock size={40} style={{ color: '#fcd34d' }} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Still here?</h2>
              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 24 }}>Checking in on you! Please confirm you're still using this seat, otherwise it will be released for others in <strong style={{ color: '#fca5a5' }}>{graceRemaining}s</strong>.</p>
              <button onClick={confirmStillHere} style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.4)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
                Yes, I'm still here!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 10, height: 'calc(100vh - 48px)' }}>
        
        {/* TOP NAVBAR CAPSULE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
              <Shield style={{ color: '#fff' }} size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>DeskGuard</div>
              <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 500 }}>Find a seat. <strong style={{color:'#fff'}}>Focus</strong> better.</div>
            </div>
          </div>

          <div className="companion-card card-lift" style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', borderRadius: 99 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: isDemoMode ? '#f59e0b' : '#64748b' }}>Demo Mode</span>
              <div 
                onClick={() => {
                  toggleDemoMode();
                  // Force a hard reload so intervals restart with new timings
                  window.location.reload();
                }}
                style={{ width: 40, height: 20, borderRadius: 10, background: isDemoMode ? '#f59e0b' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
              >
                <div style={{ position: 'absolute', top: 2, left: isDemoMode ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', padding: '10px 16px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }} 
                onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'} 
                onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
              >
                <Bell size={20} style={{ color: '#cbd5e1' }} />
                {notifications.some(n => !n.read) && (
                  <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                )}
              </div>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{ position: 'absolute', top: 56, right: -60, width: 320, background: 'rgba(15, 10, 30, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 16, backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', zIndex: 100, overflow: 'hidden' }}
                  >
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Notifications</span>
                      <span 
                        onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                        style={{ fontSize: 12, color: '#a855f7', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark all as read
                      </span>
                    </div>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', background: n.read ? 'transparent' : 'rgba(168, 85, 247, 0.05)', display: 'flex', gap: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : '#a855f7', marginTop: 6, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5, fontWeight: n.read ? 500 : 600 }}>{n.text}</div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{n.time}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{firstName}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{user?.student?.roll_number ?? '23BCS045'}</div>
              </div>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', padding: 2, boxShadow: '0 0 20px rgba(168,85,247,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)' }}>
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&backgroundColor=transparent&textColor=e0e7ff&fontWeight=800`} alt="avatar" style={{ width: '70%', height: '70%' }} />
                </div>
              </div>
              <ChevronDown size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setShowProfileMenu(!showProfileMenu)} />

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div style={{ position: 'absolute', top: 60, right: 0, width: 240, background: 'rgba(15, 10, 35, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 16, padding: '16px', backdropFilter: 'blur(16px)', boxShadow: '0 12px 40px rgba(0,0,0,0.8)', zIndex: 100 }}>
                  
                  {/* Student profile */}
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)' }}>
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&backgroundColor=transparent&textColor=e0e7ff&fontWeight=800`} alt="avatar" style={{ width: '70%', height: '70%' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{user?.student?.name}</div>
                      <div style={{ fontSize: 11, color: '#a78bfa' }}>{user?.student?.roll_number ?? '23BCS045'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {/* Study streak */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Flame size={14} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>Study streak</span>
                      </div>
                      <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 800 }}>3 days</span>
                    </div>

                    {/* Hours studied */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={14} style={{ color: '#38bdf8' }} />
                        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>Hours studied</span>
                      </div>
                      <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 800 }}>42h</span>
                    </div>

                    {/* Current seat */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={14} style={{ color: '#34d399' }} />
                        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>Current seat</span>
                      </div>
                      <span style={{ fontSize: 13, color: myActiveSeat ? '#34d399' : '#94a3b8', fontWeight: 800 }}>{myActiveSeat?.seat_code || 'None'}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                    <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fca5a5', textAlign: 'left', padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div style={{ display: 'flex', gap: 32, flex: 1, minHeight: 0 }}>
          
          {/* LEFT COLUMN (Header + Map) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            {/* Hero Header */}
            <div>
              <h2 style={{ fontSize: 24, color: '#e9d5ff', fontWeight: 600, marginBottom: 8, textShadow: '0 0 15px rgba(233, 213, 255, 0.4)' }}>✨ Hello, {firstName}</h2>
              <h1 style={{ fontSize: 48, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 12, textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                Find your perfect{' '}
                <span style={{ 
                  color: 'transparent', 
                  backgroundImage: 'linear-gradient(90deg, #f0abfc, #d946ef, #8b5cf6, #3b82f6)', 
                  WebkitBackgroundClip: 'text', 
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(217, 70, 239, 0.8)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.5))'
                }}>
                  study spot
                </span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.6)' }} />
                Radcliffe Library • Floor 3 • <span style={{ color: '#cbd5e1' }}>Live Updates</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {myActiveSeat && (
                <button onClick={() => setQrSeat(myActiveSeat.seat_code)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#d8b4fe', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}>
                  <QrCode size={16} /> My QR
                </button>
              )}
            </div>

            {/* The Map */}
            <div 
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              style={{ flex: 1, position: 'relative', minHeight: 400, paddingBottom: 100, borderRadius: 24, border: '1px solid rgba(217, 70, 239, 0.3)', background: 'rgba(15, 10, 30, 0.4)', boxShadow: '0 0 50px rgba(168, 85, 247, 0.15) inset' }}
            >
              {/* High-end Ambient Light Leaks & Grid */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24, pointerEvents: 'none' }}>
                {/* Cozy Dot Grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(217, 70, 239, 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

                {/* Interactive Mouse Spotlight */}
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15), transparent 40%)`, transition: 'background 0.1s ease' }} />

                {/* Soft Aurora / Nebula Lights */}
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)', filter: 'blur(40px)' }} />
                
                <motion.div animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} style={{ position: 'absolute', bottom: '-20%', right: '0%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 60%)', filter: 'blur(50px)' }} />

                <motion.div animate={{ opacity: [0.1, 0.3, 0.1], x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }} style={{ position: 'absolute', top: '30%', right: '20%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)', filter: 'blur(40px)' }} />

                {/* Glassmorphism subtle overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }} />
              </div>
              
              <LibraryMap 
                onSeatClick={(seat: Seat) => setQrSeat(seat.seat_code)} 
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Stats + Active Session + Waitlist) */}
          <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0 }}>
            
            {!myActiveSeat && (
              <div className="companion-card" style={{ padding: 24, textAlign: 'center', background: 'linear-gradient(180deg, rgba(30, 20, 50, 0.8) 0%, rgba(15, 10, 30, 0.8) 100%)', borderTop: '2px solid rgba(52, 211, 153, 0.4)', borderLeft: '1px solid rgba(168, 85, 247, 0.2)', borderRight: '1px solid rgba(168, 85, 247, 0.2)', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(52, 211, 153, 0.1) inset' }}>
                {seats.filter(s => s.status === 'available').length > 0 ? (
                  <>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(52, 211, 153, 0.3)', boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)' }}>
                      <Shield size={32} color="#34d399" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(255,255,255,0.2)' }}>Seats Available</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, lineHeight: 1.5 }}>No waitlist required. Tap a green seat on the map to claim it instantly.</div>
                  </>
                ) : (
                  <>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(248, 113, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(248, 113, 113, 0.3)', boxShadow: '0 0 20px rgba(248, 113, 113, 0.2)' }}>
                      <Users size={32} color="#fca5a5" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>Library is Full</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, lineHeight: 1.5 }}>Join the waitlist to be notified when a seat becomes available.</div>
                  </>
                )}
                
                {!myWaitlistEntry && (
                  <button onClick={joinWaitlist} style={{ marginTop: 24, width: '100%', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(168,85,247,0.4)' }}>
                    Join Waitlist
                  </button>
                )}
              </div>
            )}

            {myActiveSeat && (
              <div className="companion-card" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(20, 10, 40, 0.6) 0%, rgba(15, 10, 30, 0.8) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: isAway ? '#fcd34d' : '#a855f7', fontWeight: 700, letterSpacing: '0.02em' }}>
                    {isAway ? breakMessages[breakMsgIndex] : (sessionDuration > 7200000 ? "Time to stretch your legs! 🌿" : sessionDuration > 3600000 ? "You're in the zone! 🔥" : "Focus mode active ✨")}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>Desk {myActiveSeat?.seat_code ?? 'A3'}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>
                    Started {new Date(myActiveSeat?.check_in_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                  <span style={{ fontSize: 10, color: '#86efac', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE</span>
                </div>
              </div>

              {/* Rainbow Progress Ring & Decorative Layers */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 12 }}>
                <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* Decorative Outer Spinning Rings */}
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed rgba(168, 85, 247, 0.3)' }} />
                  <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '2px dotted rgba(56, 189, 248, 0.4)', opacity: 0.7 }} />

                  {/* Ambient orbiting glow when active */}
                  {isAway && (
                    <motion.div 
                      animate={isUrgent ? { opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] } : { opacity: 0.8 }} 
                      transition={{ repeat: Infinity, duration: isUrgent ? 1 : 4 }} 
                      className="ambient-orbit" 
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 0deg, transparent 70%, ${isUrgent ? 'rgba(245,158,11,0.6)' : 'rgba(168,85,247,0.4)'})`, filter: 'blur(15px)', pointerEvents: 'none' }} 
                    />
                  )}

                  <div className={`rainbow-ring-container ${isUrgent ? 'urgent' : ''}`} style={{ width: 150, height: 150, position: 'relative' }}>
                    <svg className="rainbow-ring-svg" width="150" height="150" viewBox="0 0 150 150">
                      <defs>
                        <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="50%" stopColor="#c084fc" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#fcd34d" />
                        </linearGradient>
                      </defs>
                      <circle className="rainbow-ring-bg" cx="75" cy="75" r="68" />
                      <circle 
                        className="rainbow-ring-progress" 
                        cx="75" cy="75" r="68" 
                        style={{
                          stroke: isUrgent ? 'url(#urgentGradient)' : 'url(#rainbowGradient)',
                          strokeDasharray: 2 * Math.PI * 68,
                          strokeDashoffset: isAway ? (2 * Math.PI * 68) * (1 - breakRemaining / (awayTimeoutMs / 1000)) : 0
                        }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: isUrgent ? '#fcd34d' : '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1, textShadow: isUrgent ? '0 0 15px rgba(245,158,11,0.5)' : 'none' }}>
                        {isAway ? `${Math.floor(breakRemaining/60)}:${(breakRemaining%60).toString().padStart(2,'0')}` : formatDuration(sessionDuration)}
                      </div>
                      <div style={{ fontSize: 12, color: isUrgent ? '#fbbf24' : '#94a3b8', fontWeight: 600, marginTop: 4 }}>
                        {isAway ? 'remaining' : 'elapsed'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {isAway ? (
                  <>
                    <button onClick={() => setReturn()} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}>
                      I'm Back
                    </button>
                    <button onClick={() => checkOut()} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      🔴 Leave Seat
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setAway()} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Coffee size={16} /> Break Mode
                    </button>
                    <button onClick={() => checkOut()} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      🔴 Leave Seat
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Stats */}
              <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Total Today</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>{formatDuration(sessionDuration + 7200000)}</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Study Streak</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Flame size={16} style={{ color: '#f59e0b' }} /> 3 days
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Live Waitlist Panel */}
            <div className="companion-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={16} style={{ color: '#cbd5e1' }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Live Waitlist</span>
                </div>
                {myWaitlistEntry && (
                  <div style={{ background: 'rgba(168,85,247,0.15)', color: '#e9d5ff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>
                    You're in queue
                  </div>
                )}
              </div>

              {waitlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: 13 }}>Waitlist is currently empty.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {displayWaitlist.map(item => (
                    <div key={item.pos} className="card-lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: item.active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.02)', border: `1px solid ${item.active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: item.active ? '#e9d5ff' : '#94a3b8', width: 12 }}>{item.pos}</span>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.name}&backgroundColor=transparent`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: item.active ? '#f8fafc' : '#cbd5e1' }}>{item.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: item.active ? '#a78bfa' : '#64748b' }}>Est. wait: {item.wait}</span>
                        {item.active && <CheckCircle2 size={12} style={{ color: '#d946ef' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {myWaitlistEntry && (
                <button onClick={() => leaveWaitlist()} style={{ width: '100%', padding: '12px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  Leave Waitlist
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── Floating Decorative Elements (Mockup Style) ── */}
        
        {/* Hidden Audio Player */}
        <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" preload="auto" loop />

        {/* Library Vibes Player */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ position: 'fixed', bottom: 32, left: 32, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', background: 'rgba(20, 10, 40, 0.85)', border: '1px solid rgba(217, 70, 239, 0.4)', borderRadius: 24, backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(217, 70, 239, 0.2), 0 0 20px rgba(168, 85, 247, 0.1) inset', zIndex: 50 }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc', textShadow: '0 2px 10px rgba(255,255,255,0.2)' }}>Library Vibes</div>
            <div style={{ fontSize: 12, color: '#e9d5ff', fontWeight: 500 }}>Lo-fi Focus Mix</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 20, margin: '0 12px' }}>
            {[0.4, 0.8, 0.6, 1, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
              <motion.div key={i} animate={{ scaleY: isPlayingLofi ? [h, h * 0.4, h] : 0.2 }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} style={{ width: 3, height: '100%', background: '#c084fc', borderRadius: 2, transformOrigin: 'center' }} />
            ))}
          </div>
          <div 
            onClick={() => {
              if (isPlayingLofi) audioRef.current?.pause();
              else audioRef.current?.play();
              setIsPlayingLofi(!isPlayingLofi);
            }}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 15px rgba(168,85,247,0.4)', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlayingLofi ? <Pause size={16} color="#fff" fill="#fff" /> : <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />}
          </div>
        </motion.div>

        {/* Shhh Quiet Hours Banner */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 32px 12px 16px', background: 'rgba(20, 10, 40, 0.85)', border: '1px solid rgba(217, 70, 239, 0.4)', borderRadius: 100, backdropFilter: 'blur(20px)', boxShadow: '0 10px 40px rgba(217, 70, 239, 0.3), 0 0 20px rgba(168, 85, 247, 0.2) inset', zIndex: 50 }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', overflow: 'hidden', border: '2px solid rgba(217, 70, 239, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.2), 0 0 15px rgba(217,70,239,0.5)' }}>
            <Moon size={22} color="#e9d5ff" fill="rgba(233,213,255,0.2)" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#f0abfc', textShadow: '0 0 10px rgba(240, 171, 252, 0.5)' }}>Shhh! Quiet hours in Zone C</div>
            <div style={{ fontSize: 12, color: '#e9d5ff', fontWeight: 500 }}>Keep the library peaceful for everyone.</div>
          </div>
        </motion.div>

      </div>

      {/* CLAIM MODAL */}
      {myWaitlistEntry?.status === 'ASSIGNED' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-lift" style={{ width: 400, background: 'rgba(15, 10, 35, 0.95)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 24, padding: 32, textAlign: 'center', boxShadow: '0 20px 60px rgba(168,85,247,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={32} color="#4ade80" />
              </div>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Seat Available!</h2>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>
              Seat <strong>{myWaitlistEntry.assigned_seat}</strong> has been reserved for you.
            </p>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#fca5a5', marginBottom: 24 }}>
              {Math.max(0, Math.floor((waitlistTimeoutMs - (nowTs - new Date(myWaitlistEntry.assigned_at!).getTime())) / 1000))}s
            </div>
            <button onClick={() => checkIn(myWaitlistEntry.assigned_seat!)} style={{ width: '100%', padding: 16, borderRadius: 16, background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(168,85,247,0.4)' }}>
              Claim Seat Now
            </button>
            <button onClick={() => leaveWaitlist()} style={{ width: '100%', padding: 16, marginTop: 12, borderRadius: 16, background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Release Seat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
