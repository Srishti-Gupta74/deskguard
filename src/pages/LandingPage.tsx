import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSeat } from '../contexts/SeatContext';
import { LibraryMap } from '../components/LibraryMap';
import { AmbientBackground } from '../components/AmbientBackground';
import { CursorGlow } from '../components/CursorGlow';
import {
  Shield, QrCode, Map, BarChart2, Clock, Users,
  CheckCircle, ArrowRight, Coffee, RefreshCw, Lock,
  BookOpen, Sparkles, ChevronRight,
} from 'lucide-react';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }> = ({
  children, delay = 0, className = '', style,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const features = [
  { icon: <QrCode size={20} />, title: 'QR-Based Check-In', desc: 'Every seat has a unique QR code. Scan and check in instantly — no app needed.', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
  { icon: <Map size={20} />, title: 'Live Library Map', desc: 'Real-time visual map of all 30 seats across 3 zones, color-coded by availability.', color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', border: 'rgba(79,70,229,0.2)' },
  { icon: <Clock size={20} />, title: 'Smart Away Mode', desc: 'Going for coffee? Reserve your spot for 20 minutes with one tap.', color: '#d97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.2)' },
  { icon: <Users size={20} />, title: 'Waitlist System', desc: 'FCFS queue that auto-assigns freed seats. Fair and transparent.', color: '#059669', bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.2)' },
  { icon: <BarChart2 size={20} />, title: 'Usage Analytics', desc: 'Occupancy trends, peak hours, zone utilization, and predictive forecasting.', color: '#0284c7', bg: 'rgba(2,132,199,0.1)', border: 'rgba(2,132,199,0.2)' },
  { icon: <Shield size={20} />, title: 'Admin Control', desc: 'Full monitoring dashboard. Release seats, view logs, manage waitlists.', color: '#db2777', bg: 'rgba(219,39,119,0.1)', border: 'rgba(219,39,119,0.2)' },
];

const steps = [
  { n: '01', title: 'Login', desc: 'Enter roll number and name — your profile is created automatically.', icon: <BookOpen size={18} /> },
  { n: '02', title: 'Scan QR Code', desc: 'Point your camera at any seat\'s QR code, or click a seat on the live map.', icon: <QrCode size={18} /> },
  { n: '03', title: 'Check In', desc: 'One tap reserves your seat. The map updates instantly for everyone.', icon: <CheckCircle size={18} /> },
  { n: '04', title: 'Go Away Safely', desc: 'Need a break? Tap "Take a Break" — your seat stays reserved for 20 minutes.', icon: <Coffee size={18} /> },
  { n: '05', title: 'Auto-Release', desc: 'Expired timer or abandoned seat? It\'s freed and the next person in line is notified.', icon: <RefreshCw size={18} /> },
];

export const LandingPage: React.FC = () => {
  const { seats } = useSeat();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  const occupied = seats.filter(s => s.status === 'occupied').length;
  const away = seats.filter(s => s.status === 'away').length;
  const available = seats.filter(s => s.status === 'available').length;

  return (
    <div style={{ minHeight: '100vh', background: '#050311', color: '#f8fafc', overflowX: 'hidden' }}>
      <AmbientBackground variant="landing" />
      <CursorGlow />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', position: 'relative' }}>
        <motion.div style={{ y: heroY, maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#c4b5fd', fontSize: 12, fontWeight: 700,
              marginBottom: 28,
            }}
          >
            <Sparkles size={12} />
            University Library Management System
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.7)' }} className="pulse-dot" />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 24,
            }}
          >
            End Library Seat{' '}
            <span className="text-gradient">Hoarding</span>
            <br />
            <span style={{ color: 'rgba(248,250,252,0.6)' }}>Forever.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: 18, color: 'rgba(148,163,184,0.8)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}
          >
            DeskGuard uses QR codes, real-time tracking, and smart automation to ensure
            every student gets a fair chance at a study space.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}
          >
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(124,58,237,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: '#fff', fontWeight: 800, fontSize: 15,
                  boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
                  cursor: 'pointer',
                }}
              >
                Get Started
                <ArrowRight size={16} />
              </motion.div>
            </Link>
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0', fontWeight: 700, fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                <Shield size={15} style={{ color: '#a78bfa' }} />
                Admin Panel
              </motion.div>
            </Link>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 28,
              padding: '14px 28px', borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {[
              { value: available, label: 'Available', color: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
              { value: occupied, label: 'Occupied', color: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
              { value: away, label: 'Away', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
              { value: seats.length, label: 'Total', color: '#94a3b8', glow: 'rgba(148,163,184,0.3)' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, textShadow: `0 0 12px ${s.glow}`, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(148,163,184,0.4)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} className="pulse-dot" />
              Live
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── LIVE MAP PREVIEW ──────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <FadeIn style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
              The Library, <span className="text-gradient">Live</span>
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 15 }}>
              Real-time seat status updating as students check in and out
            </p>
          </div>
          <motion.div
            whileHover={{ boxShadow: '0 24px 80px rgba(124,58,237,0.15)' }}
            style={{
              padding: 28, borderRadius: 24,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
            }}
          >
            <LibraryMap />
          </motion.div>
        </FadeIn>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Built for Real Libraries
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 15 }}>Every feature designed to solve a real problem</p>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4, boxShadow: `0 12px 40px ${f.bg}` }}
                  style={{
                    padding: 24, borderRadius: 18, height: '100%',
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    cursor: 'default',
                    transition: 'box-shadow 0.25s ease',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${f.bg}`,
                    border: `1px solid ${f.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: f.color, marginBottom: 16,
                    boxShadow: `0 0 20px ${f.bg}`,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', lineHeight: 1.65 }}>{f.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Seat Secured in <span className="text-gradient">10 Seconds</span>
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 15 }}>No downloads. No complicated setup.</p>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.07}>
                <motion.div
                  whileHover={{ x: 4, borderColor: 'rgba(124,58,237,0.3)' }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 18,
                    padding: '18px 22px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))',
                    border: '1px solid rgba(124,58,237,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#a78bfa',
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#7c3aed', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Step {step.n}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)', lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'rgba(100,116,139,0.4)', marginTop: 14, flexShrink: 0 }} />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 2 }}>
        <FadeIn style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -40,
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
            <motion.div
              whileHover={{ boxShadow: '0 24px 80px rgba(124,58,237,0.2)' }}
              style={{
                position: 'relative', textAlign: 'center',
                padding: '48px 40px', borderRadius: 28,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.06))',
                border: '1px solid rgba(124,58,237,0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))',
                border: '1px solid rgba(124,58,237,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Shield size={24} style={{ color: '#a78bfa' }} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>
                Ready to Transform<br />Your Library?
              </h2>
              <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                Deploy DeskGuard and give every student a fair chance at a study space.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '13px 24px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#fff', fontWeight: 800, fontSize: 14,
                      boxShadow: '0 4px 20px rgba(124,58,237,0.4)', cursor: 'pointer',
                    }}
                  >
                    Student Login
                    <ArrowRight size={15} />
                  </motion.div>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '13px 24px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e2e8f0', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    <Lock size={13} />
                    Admin Access
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={13} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc' }}>
              Desk<span style={{ color: '#a78bfa' }}>Guard</span>
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(100,116,139,0.5)' }}>© 2024 DeskGuard. Built for university libraries.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(100,116,139,0.5)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} className="pulse-dot" />
            System operational
          </div>
        </div>
      </footer>
    </div>
  );
};
