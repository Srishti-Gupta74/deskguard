import React from 'react';

export const AmbientBackground: React.FC<{ variant?: 'student' | 'admin' | 'landing' }> = ({
  variant = 'student',
}) => {
  const isStudent = variant === 'student';

  // For the starry background in student mode
  const renderStars = () => {
    if (!isStudent) return null;
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() > 0.8 ? 3 : 1.5,
              height: Math.random() > 0.8 ? 3 : 1.5,
              opacity: Math.random() * 0.8 + 0.2,
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              animation: `pulse-dot ${2 + Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, background: isStudent ? 'linear-gradient(135deg, #13072e 0%, #090514 100%)' : '' }}>
      {/* Stars */}
      {renderStars()}

      {/* Ambient animated orbs */}
      <div className={`bg-orb ${isStudent ? 'orb-student-1' : 'orb-admin-1'}`} />
      <div className={`bg-orb ${isStudent ? 'orb-student-2' : 'orb-admin-2'}`} />
      {isStudent && <div className="bg-orb orb-student-3" />}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isStudent 
            ? 'radial-gradient(ellipse at center, transparent 20%, rgba(9, 5, 20, 0.7) 100%)'
            : 'radial-gradient(ellipse at center, transparent 30%, rgba(5, 3, 17, 0.6) 100%)',
        }}
      />
    </div>
  );
};
