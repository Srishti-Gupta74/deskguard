import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CursorTrail: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add particle occasionally
      if (Math.random() > 0.8) {
        setParticles((prev) => [
          ...prev.slice(-15), // Keep only last 15 particles
          { id: Date.now(), x: e.clientX, y: e.clientY },
        ]);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], input, select, textarea, .cursor-pointer')) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Auto-clear particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: 0, y: p.y, x: p.x }}
            animate={{ opacity: 0, scale: 1.5, y: p.y - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#d946ef',
              boxShadow: '0 0 10px #d946ef',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Main glowing cursor follower */}
      <motion.div
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHoveringClickable ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: '50%',
          border: '1px solid rgba(168,85,247,0.4)',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
          boxShadow: '0 0 20px rgba(168,85,247,0.3)',
        }}
      />
    </div>
  );
};
