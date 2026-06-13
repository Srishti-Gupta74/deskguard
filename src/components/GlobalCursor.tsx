import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const GlobalCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Primary soft dot
  const springConfig = { damping: 25, stiffness: 500, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Trailing bubble
  const trailX = useSpring(cursorX, { damping: 30, stiffness: 200, mass: 0.8 });
  const trailY = useSpring(cursorY, { damping: 30, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      if (!isVisible) setIsVisible(true);
    };
    
    // Hide when mouse leaves window
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          x: smoothX,
          y: smoothY,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          boxShadow: '0 0 16px rgba(168, 85, 247, 0.6), 0 0 4px rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <motion.div
        style={{
          position: 'fixed',
          x: trailX,
          y: trailY,
          width: 32,
          height: 32,
          marginLeft: -10, // offset difference
          marginTop: -10,
          borderRadius: '50%',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          boxShadow: '0 0 24px rgba(168, 85, 247, 0.15)',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
    </>
  );
};
