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

  // DVD: Bottom-Left -> Center/Target Position
  // Starts at bottom: 0, left: 0
  // Ends at bottom: 0, left: 50% (minus half width)
  // Actually user said: "se juntan ambas imagenes hasta llegar al fin de la pagina donde por fin se encuentran y se pone una sobre otra"
  // So they should meet at the bottom of the page.

  // Let's assume they meet at the center horizontally, and stay at the bottom vertically?
  // User said: "dvd.svg" debe de ir a la izquierada inferior de la pagina
  // "lectorDvd.svg" debe ir a la derecha superior de la pagina
  // "cuando se escrollea la pagina, más se juntan ambas imagenes hasta llegar al fin de la pagina donde por fin se encuentran y se pone una sobre otra"

  // Interpretation:
  // Start:
  // DVD: Bottom Left (fixed)
  // Lector: Top Right (fixed)

  // End (Scroll = 1):
  // They meet. Where? "se pone una sobre otra".
  // Let's make them meet at the center of the screen, or bottom center?
  // "llegar al fin de la pagina donde por fin se encuentran" -> implies they meet when scroll is at the bottom.
  // Let's make them meet at the bottom-center of the viewport? Or maybe center-center?
  // Given "dvd" starts bottom-left, it probably stays bottom and moves right.
  // "lector" starts top-right, it probably moves down and left.
  // Meeting point: Bottom-Center seems logical for "fin de la pagina" context, or maybe Center-Center if they "meet".
  // Let's try meeting at the center of the viewport, but fixed position.

  // Actually, if they are "fixed" position, they are always visible.
  // Scroll 0:
  // DVD: x: 0, y: 100vh (minus height) -> Bottom Left
  // Lector: x: 100vw (minus width), y: 0 -> Top Right

  // Scroll 1:
  // Both at same position. Let's say center of viewport.
  // x: 50vw, y: 50vh.

  // Let's refine:
  // DVD: x: 0 -> 50vw, y: 100vh -> 50vh
  // Lector: x: 100vw -> 50vw, y: 0 -> 50vh

  // Wait, "una capa arriba de el fondo".

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
      // Convert string values (vw/vh) to approximate pixels or keep as string if possible, 
      // but for particles we might need absolute positioning or relative to a container.
      // Since dvdX/dvdY are strings like '3vw', we can just use them directly if we position particles similarly.
      // However, to animate them "staying behind" or drifting, it's easier if we just spawn them at current position.

      // Let's try to parse the current computed value if possible, or just use the latest value.
      // The `latest` from useMotionValueEvent is the value of dvdX.

      const newParticle = {
        id: now,
        x: latest, // This is a string like "12.5vw" or number
        y: yVal,   // This is a string like "90vh"
      };

      setParticles(prev => [...prev.slice(-10), newParticle]); // Keep last 20
      lastParticleTime.current = now;
    }
  });

  // Cleanup old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Particles (Trail) */}
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
            backgroundColor: 'rgba(236, 72, 153, 0.6)', // Pink color
            boxShadow: '0 0 35px 3px rgba(236, 72, 153, 0.9)', // Glow effect
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
            width: '100px', // Adjust size as needed
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
            width: '150px', // Adjust size as needed
            height: 'auto',
            filter: glowFilter,
          }}
        />
      </div>
    </div>
  );
}
