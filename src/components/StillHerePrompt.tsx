import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeat } from '../contexts/SeatContext';
import { useDemoMode } from '../contexts/DemoContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const StillHerePrompt: React.FC = () => {
  const { showStillHerePrompt, confirmStillHere, myActiveSeat } = useSeat();
  const { awayTimeoutMs } = useDemoMode(); // Using away timeout as the countdown duration
  const [timeLeft, setTimeLeft] = useState(awayTimeoutMs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showStillHerePrompt) {
      setTimeLeft(awayTimeoutMs);
      const start = Date.now();
      const t = setInterval(() => {
        const elapsed = Date.now() - start;
        setTimeLeft(Math.max(0, awayTimeoutMs - elapsed));
      }, 100);
      return () => clearInterval(t);
    }
  }, [showStillHerePrompt, awayTimeoutMs]);

  const handleConfirm = async () => {
    setLoading(true);
    try { await confirmStillHere(); } finally { setLoading(false); }
  };

  const progress = timeLeft / awayTimeoutMs;
  const isUrgent = progress < 0.25;

  return (
    <AnimatePresence>
      {showStillHerePrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(5, 3, 17, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '100%', maxWidth: 400,
              background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(153,27,27,0.1) 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 24, padding: 32,
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(239,68,68,0.2)',
            }}
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              style={{
                width: 64, height: 64, borderRadius: 20,
                background: 'rgba(239,68,68,0.2)', color: '#fca5a5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 0 30px rgba(239,68,68,0.4)',
              }}
            >
              <AlertTriangle size={32} />
            </motion.div>

            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Are you still at Seat {myActiveSeat?.seat_code}?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(248,250,252,0.7)', marginBottom: 24, lineHeight: 1.6 }}>
              We need to confirm you're still using this seat. If you don't respond, it will be automatically freed for others.
            </p>

            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: isUrgent ? '#ef4444' : '#f59e0b', borderRadius: 99 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirm}
              disabled={loading}
              style={{
                width: '100%', padding: '16px', borderRadius: 14,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: '#fff', fontSize: 16, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
              }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <CheckCircle size={20} />
                  Yes, I'm still here
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
