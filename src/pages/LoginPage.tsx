import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, BookOpen, ArrowRight, Loader2, Sparkles, TrendingUp, Users, LampDesk } from 'lucide-react';

const StudentMarketing = () => (
  <motion.div 
    key="student-marketing"
    initial={{ opacity: 0, x: -30 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, #a855f7, #6366f1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(168,85,247,0.5)',
      }}>
        <Shield size={24} style={{ color: '#fff' }} />
      </div>
      <span style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
        Desk<span style={{ color: '#c084fc' }}>Guard</span>
      </span>
    </div>

    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, textShadow: '0 4px 40px rgba(192, 132, 252, 0.4)' }}>
      <span className="text-glow-shimmer" style={{ backgroundImage: 'linear-gradient(120deg, #f8fafc 20%, #c084fc 40%, #f8fafc 60%, #f8fafc 80%)' }}>Find Your Spot.</span><br/>
      <span className="text-glow-shimmer" style={{ backgroundImage: 'linear-gradient(120deg, #c084fc 20%, #818cf8 40%, #e879f9 60%, #c084fc 80%)' }}>
        Master Your Time.
      </span>
    </h1>

    <p style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.6, maxWidth: 460, marginBottom: 40, fontWeight: 500 }}>
      Your personal library companion. Discover the perfect study space, track your focus streaks, and elevate your daily productivity.
    </p>
    
    {/* Subtle illustration / live seat preview */}
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e9d5ff', fontWeight: 700, fontSize: 14 }}>
          <LampDesk size={18} /> Quiet Zone 
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 36, height: 32, borderRadius: 8, background: '#22c55e', border: '2px solid #15803d', boxShadow: '0 0 16px rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800 }}>A1</div>
          <div style={{ width: 36, height: 32, borderRadius: 8, background: '#ef4444', border: '2px solid #b91c1c', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5', fontSize: 11, fontWeight: 800 }}>A2</div>
          <div style={{ width: 36, height: 32, borderRadius: 8, background: '#ef4444', border: '2px solid #b91c1c', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5', fontSize: 11, fontWeight: 800 }}>A3</div>
        </div>
      </div>
      <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Study Streak</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
          <Sparkles size={16} style={{ color: '#f59e0b' }} /> 5 Days
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminMarketing = () => (
  <motion.div 
    key="admin-marketing"
    initial={{ opacity: 0, x: 30 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: 30 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '1px solid #334155',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
      }}>
        <Shield size={24} style={{ color: '#818cf8' }} />
      </div>
      <span style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
        Desk<span style={{ color: '#818cf8' }}>Guard</span>
      </span>
    </div>

    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, textShadow: '0 4px 40px rgba(99, 102, 241, 0.4)' }}>
      <span className="text-glow-shimmer" style={{ backgroundImage: 'linear-gradient(120deg, #f8fafc 20%, #818cf8 40%, #f8fafc 60%, #f8fafc 80%)' }}>Operations</span> <br/>
      <span className="text-glow-shimmer" style={{ backgroundImage: 'linear-gradient(120deg, #6366f1 20%, #818cf8 40%, #6366f1 60%, #4f46e5 80%)' }}>Command Center.</span>
    </h1>

    <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, maxWidth: 460, marginBottom: 40, fontWeight: 500 }}>
      Data-driven facility management. Monitor real-time occupancy, analyze demand trends, and automate seat allocation seamlessly.
    </p>
    
    {/* Mini Analytics Preview */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 460 }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          <TrendingUp size={14} style={{ color: '#818cf8' }} /> Live Occupancy
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc' }}>84%</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 30, marginTop: 12, opacity: 0.6 }}>
          {[30, 45, 60, 40, 75, 84].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: '#6366f1', borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
          <Users size={14} style={{ color: '#fca5a5' }} /> Waitlist Demand
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc' }}>High</div>
        <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 600, marginTop: 4 }}>12 students waiting</div>
      </div>
    </div>
  </motion.div>
);

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const { loginStudent, loginAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else {
        const redirect = sessionStorage.getItem('dg_redirect');
        if (redirect) { sessionStorage.removeItem('dg_redirect'); navigate(redirect); }
        else navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'student') await loginStudent(roll, name);
      else await loginAdmin(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt (max 10 degrees)
    setRotateX(-((y - centerY) / 20));
    setRotateY((x - centerX) / 20);

    // Glare position (percentage)
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  const inputStyle = {
    width: '100%', padding: '16px 20px', borderRadius: 16,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#f8fafc', fontSize: 15, outline: 'none', transition: 'all 0.3s',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      
      {/* ── Dynamic Background Atmosphere ── */}
      <AnimatePresence>
        {role === 'student' ? (
          <motion.div key="bg-student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            <div className="library-bg" />
            <div className="library-overlay" />
            {/* Dynamic moving orbs for student */}
            <div className="bg-orb orb-student-1" />
            <div className="bg-orb orb-student-2" />
            <div className="bg-orb orb-student-3" />
            
            <div className="particles-container">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`, animationDuration: `${Math.random() * 15 + 10}s`, animationDelay: `${Math.random() * 5}s` }} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="bg-admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' }} />
            {/* Dynamic moving orbs for admin */}
            <div className="bg-orb orb-admin-1" />
            <div className="bg-orb orb-admin-2" />
            
            {/* Subtle grid for admin */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left Side: Cinematic Marketing ── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, padding: '0 8%', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {role === 'student' ? <StudentMarketing key="student" /> : <AdminMarketing key="admin" />}
        </AnimatePresence>
      </div>

      {/* ── Right Side: Floating Login Card ── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4%', perspective: 1200 }}>
        
        <motion.div 
          className="login-card-float"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, rotateX, rotateY }}
          transition={{ rotateX: { type: 'spring', stiffness: 300, damping: 30 }, rotateY: { type: 'spring', stiffness: 300, damping: 30 }, default: { duration: 0.8, delay: 0.2 } }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', maxWidth: 460, transformStyle: 'preserve-3d' }}
        >
          {/* Floating Glow Behind Card */}
          <div style={{ position: 'absolute', inset: -20, background: role === 'student' ? 'radial-gradient(circle at center, rgba(168,85,247,0.2) 0%, transparent 70%)' : 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1, transform: 'translateZ(-50px)' }} />

          <div style={{
            background: role === 'student' ? 'rgba(20, 15, 35, 0.6)' : 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px)', 
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: 32, 
            padding: 40,
            boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateZ(0)' // Keep it flat inside
          }}>
            
            {/* Interactive Glare overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
              opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }} />

            {/* Subtle top glare */}
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Welcome Back</h2>
              <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Select your portal to continue</p>
            </div>

            {/* Role tabs */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 18, padding: 6, marginBottom: 32, border: '1px solid rgba(255,255,255,0.03)' }}>
              <button
                onClick={() => setRole('student')}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 14,
                  background: role === 'student' ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))' : 'transparent',
                  color: role === 'student' ? '#e9d5ff' : '#64748b',
                  border: `1px solid ${role === 'student' ? 'rgba(168,85,247,0.4)' : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: role === 'student' ? '0 4px 12px rgba(168,85,247,0.2)' : 'none'
                }}
              >
                <BookOpen size={16} /> Student
              </button>
              <button
                onClick={() => setRole('admin')}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 14,
                  background: role === 'admin' ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.2))' : 'transparent',
                  color: role === 'admin' ? '#c7d2fe' : '#64748b',
                  border: `1px solid ${role === 'admin' ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: role === 'admin' ? '0 4px 12px rgba(99,102,241,0.2)' : 'none'
                }}
              >
                <Shield size={16} /> Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <AnimatePresence mode="wait">
                {role === 'student' ? (
                  <motion.div key="student" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8, paddingLeft: 4 }}>Roll Number</label>
                      <input
                        required type="text" value={roll} onChange={e => setRoll(e.target.value.toUpperCase())}
                        placeholder="e.g. 23BCS045"
                        style={{ ...inputStyle, textTransform: 'uppercase' }}
                        onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8, paddingLeft: 4 }}>Full Name</label>
                      <input
                        required type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="e.g. Alex"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="admin" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8, paddingLeft: 4 }}>Admin Username</label>
                      <input
                        required type="text" value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="admin"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 8, paddingLeft: 4 }}>Password</label>
                      <input
                        required type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#fca5a5', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={16} /> {error}
                </motion.div>
              )}

              {/* Personality Greeting */}
              <AnimatePresence>
                {role === 'student' && name && name.trim().length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ textAlign: 'center', marginTop: 12, marginBottom: -4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#e9d5ff' }}>Hello, {name}</span>
                    <Sparkles size={18} style={{ color: '#d8b4fe' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                style={{
                  marginTop: 12, width: '100%', padding: 18, borderRadius: 16,
                  background: role === 'student' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none', color: '#fff', fontSize: 16, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: role === 'student' ? '0 8px 30px rgba(168,85,247,0.4)' : '0 8px 30px rgba(99,102,241,0.4)',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>Continue <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
