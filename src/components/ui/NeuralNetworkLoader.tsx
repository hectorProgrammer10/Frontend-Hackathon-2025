'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

// Generate random points
const POINTS_COUNT = 20;
const CONNECTIONS_COUNT = 15;

interface Point {
  id: number;
  x: number;
  y: number;
}

interface Connection {
  id: number;
  start: Point;
  end: Point;
  delay: number;
}

// Helper function to generate points
const generatePoints = (): Point[] => {
  const newPoints: Point[] = [];
  for (let i = 0; i < POINTS_COUNT; i++) {
    newPoints.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }
  return newPoints;
};

// Helper function to generate connections
const generateConnections = (points: Point[]): Connection[] => {
  const newConnections: Connection[] = [];
  for (let i = 0; i < CONNECTIONS_COUNT; i++) {
    const start = points[Math.floor(Math.random() * points.length)];
    let end = points[Math.floor(Math.random() * points.length)];
    while (start.id === end.id) {
      end = points[Math.floor(Math.random() * points.length)];
    }
    newConnections.push({
      id: i,
      start,
      end,
      delay: Math.random() * 2,
    });
  }
  return newConnections;
};

export default function NeuralNetworkLoader() {
  // Generate points and connections once using useMemo
  const points = useMemo(() => generatePoints(), []);
  const connections = useMemo(() => generateConnections(points), [points]);

  const [activePoint, setActivePoint] = useState<number | null>(null);

  useEffect(() => {
    // Simulate "thinking" by activating random points
    const interval = setInterval(() => {
      setActivePoint(Math.floor(Math.random() * POINTS_COUNT));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 relative overflow-hidden bg-transparent">
      <svg className="w-full h-full absolute inset-0">
        {/* Connections */}
        {connections.map((conn) => (
          <motion.line
            key={conn.id}
            x1={`${conn.start.x}%`}
            y1={`${conn.start.y}%`}
            x2={`${conn.end.x}%`}
            y2={`${conn.end.y}%`}
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: conn.delay,
            }}
          />
        ))}

        {/* Points */}
        {points.map((point) => (
          <motion.circle
            key={point.id}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="3"
            fill="rgba(168, 85, 247, 0.3)"
            animate={{
              scale: activePoint === point.id ? [1, 2, 1] : 1,
              opacity: activePoint === point.id ? [0.3, 1, 0.3] : 0.3,
              fill: activePoint === point.id ? "rgba(236, 72, 153, 1)" : "rgba(168, 85, 247, 0.6)",
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-purple-300 font-medium text-lg bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-500/30"
        >
          Analizando patrones...
        </motion.div>
      </div>
    </div>
  );
}