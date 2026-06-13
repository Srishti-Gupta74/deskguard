import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeat } from '../contexts/SeatContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, Clock, ArrowRight, Star, UserPlus, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';

export const WaitlistPanel: React.FC<{ showJoinButton?: boolean }> = ({ showJoinButton = true }) => {
  const { waitlist, myWaitlistEntry, myActiveSeat, joinWaitlist, leaveWaitlist } = useSeat();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trigger confetti when assigned a seat
  useEffect(() => {
    if (myWaitlistEntry?.status === 'ASSIGNED') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [myWaitlistEntry?.status]);

  const handleJoin = async () => {
    setLoading(true);
    try { await joinWaitlist(); } finally { setLoading(false); }
  };

  const handleLeave = async () => {
    setLoading(true);
    try { await leaveWaitlist(); } finally { setLoading(false); }
  };

  const activeWaitlist = waitlist.filter(w => w.status === 'WAITING').sort((a, b) => a.position - b.position);
  const myPos = myWaitlistEntry?.status === 'WAITING' ? myWaitlistEntry.position : null;
  const isAssigned = myWaitlistEntry?.status === 'ASSIGNED';

  if (user?.role === 'admin') {
    // Admin View
    return (
      <div className="glass-card" style={{ padding: 24, borderRadius: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Waitlist Queue</div>
              <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)' }}>{activeWaitlist.length} students waiting</div>
            </div>
          </div>
        </div>
        
        {activeWaitlist.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px dashed rgba(255,255,255,0.05)' }}>
            <Users size={24} style={{ color: 'rgba(148,163,184,0.3)', margin: '0 auto 10px' }} />
            <div style={{ fontSize: 13, color: 'rgba(148,163,184,0.5)', fontWeight: 600 }}>Queue is currently empty</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeWaitlist.map((entry, i) => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(79,70,229,0.2)', color: '#818cf8', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Student ID: {entry.student_id.substring(0, 8)}...</div>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)' }}>Joined {new Date(entry.joined_at).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Student View
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ padding: 24, borderRadius: 20, position: 'relative', overflow: 'hidden' }}
    >
      {showConfetti && <Confetti width={400} height={300} recycle={false} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />}
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} style={{ color: '#34d399' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>Waitlist</div>
            <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)' }}>{activeWaitlist.length} in queue</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAssigned ? (
          <motion.div
            key="assigned"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.1)' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <Star size={24} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#6ee7b7', marginBottom: 4 }}>Seat Assigned!</h3>
            <p style={{ fontSize: 13, color: '#a7f3d0', marginBottom: 16 }}>You have been assigned Seat <strong style={{ color: '#fff' }}>{myWaitlistEntry.assigned_seat}</strong>.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLeave}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Dismiss
            </motion.button>
          </motion.div>
        ) : myPos !== null ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Your Position</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>#{myPos}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} style={{ color: '#60a5fa' }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.6)', marginBottom: 20, lineHeight: 1.5 }}>
              We'll automatically assign you the next available seat. Hold tight!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLeave}
              disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontWeight: 700, fontSize: 12, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
            >
              {loading && <Loader2 size={12} className="animate-spin" />}
              Leave Waitlist
            </motion.button>
          </motion.div>
        ) : showJoinButton && !myActiveSeat ? (
          <motion.div
            key="join"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '24px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UserPlus size={18} style={{ color: '#94a3b8' }} />
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>Library Full?</h4>
            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', marginBottom: 20, lineHeight: 1.5 }}>Join the waitlist and we'll reserve the next free seat for you.</p>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(16,185,129,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleJoin}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', border: 'none' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              Join Waitlist
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
