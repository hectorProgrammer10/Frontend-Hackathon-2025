'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useRef, useEffect, memo } from 'react';

interface PaperBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function PaperBackground({ className, style, children, ...props }: PaperBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<{ x: number; y: number; baseX: number; baseY: number; color: string; draw: (ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) => void }[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Configuration
    const spacing = 12;
    const radius = 1.5;
    const interactionRadius = 100;
    const liftFactor = 8;

    class Particle {
      x: number;
      y: number;
      color: string;
      baseX: number;
      baseY: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.color = color;
      }

      draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
        // Calcular la distancia al ratón
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let lift = 0;
        let scale = 1;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          // "Ascenso": subir (Y negativo) y escalar hacia arriba
          lift = -force * liftFactor;
          scale = 1 + force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y + lift, radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      // Manejar DPI altos
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      particlesRef.current = [];

      for (let i = 0; i < width; i += spacing) {
        for (let j = 0; j < height; j += spacing) {
          particlesRef.current.push(new Particle(i, j, 'rgba(6, 182, 212, 0.2)'));
        }
      }

      for (let i = 6; i < width; i += spacing) {
        for (let j = 6; j < height; j += spacing) {
          particlesRef.current.push(new Particle(i, j, 'rgba(236, 72, 153, 0.2)'));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rect = canvas.getBoundingClientRect();
      const relativeMouseX = mouseRef.current.x - rect.left;
      const relativeMouseY = mouseRef.current.y - rect.top;

      particlesRef.current.forEach(particle => {
        particle.draw(ctx, relativeMouseX, relativeMouseY);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      className={`relative perspective-1000 ${className || ''}`}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          ...style,
          x,
          y,
        }}
        drag
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        whileTap={{ cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
        />
      </motion.div>

      <div className="relative z-10 pointer-events-none h-full">
        {children}
      </div>
    </div>
  );
}

export default memo(PaperBackground);
