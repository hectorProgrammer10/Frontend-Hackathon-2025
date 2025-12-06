'use client';

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number | string;
  y: number | string;
}

export default function ScrollDvdAnimation() {
  const { scrollYProgress } = useScroll();

  const dvdX = useTransform(scrollYProgress, [0, 1], ['3vw', '45vw']);
  const dvdY = useTransform(scrollYProgress, [0, 1], ['90vh', '90vh']);
  const dvdScale = useTransform(scrollYProgress, [0, 1], [0.9, 0.6]);
  const dvdRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const lectorX = useTransform(scrollYProgress, [0, 1], ['87vw', '45vw']);
  const lectorY = useTransform(scrollYProgress, [0, 1], ['90vh', '90vh']);
  const lectorScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.3]);

  // Glow effect at the end
  const glowOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const glowFilter = useTransform(scrollYProgress, [0.9, 1], [
    'drop-shadow(0 0 0px rgba(236, 72, 153, 0))',
    'drop-shadow(0 0 20px rgba(236, 72, 153, 0.7))'
  ]);

  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticleTime = useRef(0);

  useMotionValueEvent(dvdX, "change", (latest) => {
    const now = Date.now();
    if (now - lastParticleTime.current > 50) { // Emit particle every 50ms
      const yVal = dvdY.get();

      const newParticle = {
        id: now,
        x: latest,
        y: yVal,
      };

      setParticles(prev => [...prev.slice(-10), newParticle]);
      lastParticleTime.current = now;
    }
  });

  // Limpiar partículas viejas
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Particulas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: particle.x,
            y: particle.y,
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: 'rgba(236, 72, 153, 0.6)',
            boxShadow: '0 0 35px 3px rgba(236, 72, 153, 0.9)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-30">
        {/* DVD Image */}
        <motion.img
          src="/dvd.svg"
          alt="DVD"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0.6, scale: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: dvdX,
            y: dvdY,
            scale: dvdScale,
            rotate: dvdRotate,
            width: '100px',
            height: 'auto',
            filter: glowFilter,
          }}
        />

        {/* Lector DVD Image */}
        <motion.img
          src="/lectorDvd.svg"
          alt="Lector DVD"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0.6, scale: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: lectorX,
            y: lectorY,
            scale: lectorScale,
            width: '150px',
            height: 'auto',
            filter: glowFilter,
          }}
        />
      </div>
    </div>
  );
}
