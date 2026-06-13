import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDemoMode } from '../contexts/DemoContext';
import { Shield, Zap, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  if (location.pathname === '/dashboard') return null;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(5, 3, 17, 0.7)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}
          >
            <Shield size={15} style={{ color: '#fff' }} />
          </motion.div>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Desk<span style={{ color: '#a78bfa' }}>Guard</span>
          </span>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Demo mode toggle */}
          <motion.button
            onClick={toggleDemoMode}
            whileTap={{ scale: 0.95 }}
            title={isDemoMode ? 'Demo Mode ON – faster timers' : 'Enable Demo Mode'}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 999,
              background: isDemoMode ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isDemoMode ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: isDemoMode ? '#fcd34d' : 'rgba(148,163,184,0.6)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Zap size={11} />
            {isDemoMode ? 'Demo ON' : 'Demo Mode'}
          </motion.button>

          {user ? (
            <>
              {/* User pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 12px 4px 6px', borderRadius: 999,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                {user.role === 'admin' ? (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={12} style={{ color: '#a78bfa' }} />
                  </div>
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)' }}>
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.student?.name?.split(' ')[0]}&backgroundColor=transparent&textColor=e0e7ff&fontWeight=800`} alt="avatar" style={{ width: '70%', height: '70%' }} />
                  </div>
                )}
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>
                  {user.role === 'admin' ? 'Admin' : user.student?.name?.split(' ')[0]}
                </span>
              </div>

              {/* Dashboard link */}
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: user.role === 'admin'
                      ? 'rgba(124,58,237,0.15)'
                      : 'rgba(14,165,233,0.15)',
                    border: `1px solid ${user.role === 'admin' ? 'rgba(124,58,237,0.3)' : 'rgba(14,165,233,0.3)'}`,
                    color: user.role === 'admin' ? '#c4b5fd' : '#7dd3fc',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {user.role === 'admin' ? 'Dashboard' : 'My Session'}
                </motion.div>
              </Link>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 999,
                  background: 'transparent',
                  border: '1px solid transparent',
                  color: 'rgba(148,163,184,0.5)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(148,163,184,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <LogOut size={12} />
                <span style={{ display: 'none' }} className="sm:inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '6px 16px', borderRadius: 999,
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(124,58,237,0.3)',
                }}
              >
                Login
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
