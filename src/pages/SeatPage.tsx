import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSeat } from '../contexts/SeatContext';
import { AmbientBackground } from '../components/AmbientBackground';
import { MapPin, ArrowLeft, CheckCircle2, Shield, Loader2, AlertTriangle } from 'lucide-react';

export const SeatPage: React.FC = () => {
  const { seatCode } = useParams();
  const { user } = useAuth();
  const { seats, myActiveSeat, checkIn, adminRelease } = useSeat();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const seat = seats.find(s => s.seat_code === seatCode);

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('dg_redirect', `/seat/${seatCode}`);
      navigate('/login');
    }
  }, [user, seatCode, navigate]);

  if (!seat) {
    return (
      <div style={{ minHeight: '100vh', background: '#050311', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(148,163,184,0.6)' }}>
          <AlertTriangle size={48} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
          <h2>Seat Not Found</h2>
        </div>
      </div>
    );
  }

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');
    try {
      await checkIn(seat.seat_code);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRelease = async () => {
    setLoading(true);
    try {
      await adminRelease(seat.id, seat.seat_code);
      navigate('/admin');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isAvailable = seat.status === 'available';
  const isMine = myActiveSeat?.id === seat.id;
  const statusColors = {
    available: { color: '#34d399', text: 'Available', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.2)' },
    occupied: { color: '#f87171', text: 'Occupied', bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.2)' },
    away: { color: '#fbbf24', text: 'On Break', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)' },
    awaiting_claim: { color: '#fb923c', text: 'Reserved', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.2)' }
  };
  const sc = statusColors[seat.status as keyof typeof statusColors] || { color: '#94a3b8', text: 'Unknown', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' };

  return (
    <div style={{ minHeight: '100vh', background: '#050311', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <AmbientBackground variant={user?.role === 'admin' ? 'admin' : 'student'} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
            background: 'transparent', border: 'none', color: 'rgba(148,163,184,0.6)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(30px)', borderRadius: 28, padding: 36,
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>Seat Reserved!</h2>
              <p style={{ color: 'rgba(148,163,184,0.6)' }}>Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'rgba(148,163,184,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Zone {seat.zone}
                  </div>
                  <h1 style={{ fontSize: 48, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {seat.seat_code}
                  </h1>
                </div>
                <div style={{
                  padding: '8px 16px', borderRadius: 999,
                  background: sc.bg, border: `1px solid ${sc.border}`,
                  color: sc.color, fontSize: 12, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.color, boxShadow: `0 0 8px ${sc.color}` }} className={seat.status !== 'available' ? 'pulse-dot' : ''} />
                  {sc.text}
                </div>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#fca5a5', fontSize: 13, marginBottom: 24 }}>
                  {error}
                </div>
              )}

              {user?.role === 'student' && (
                <div style={{ marginTop: 10 }}>
                  {isAvailable ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckIn}
                      disabled={loading || !!myActiveSeat}
                      style={{
                        width: '100%', padding: 16, borderRadius: 16,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none', color: '#fff', fontSize: 16, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        cursor: loading || !!myActiveSeat ? 'not-allowed' : 'pointer',
                        opacity: myActiveSeat ? 0.5 : 1,
                        boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
                      }}
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : (
                        <>Check In Here <MapPin size={18} /></>
                      )}
                    </motion.button>
                  ) : isMine ? (
                    <div style={{ padding: 16, borderRadius: 16, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#c4b5fd', textAlign: 'center', fontWeight: 600 }}>
                      This is your active seat.
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#a78bfa', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }}>Go to Dashboard</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.6)', textAlign: 'center', fontSize: 14 }}>
                      This seat is currently {seat.status}.<br/>Please find an available seat.
                    </div>
                  )}
                  {myActiveSeat && isAvailable && (
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#fca5a5', marginTop: 12 }}>
                      You already have an active seat ({myActiveSeat.seat_code}).
                    </p>
                  )}
                </div>
              )}

              {user?.role === 'admin' && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ padding: 16, borderRadius: 16, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} /> Admin Controls</div>
                    <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)' }}>You are viewing this seat as an admin.</p>
                  </div>
                  {!isAvailable && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAdminRelease}
                      disabled={loading}
                      style={{
                        width: '100%', padding: 16, borderRadius: 16,
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#fca5a5', fontSize: 15, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : 'Force Release Seat'}
                    </motion.button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
