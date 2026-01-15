import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function StarField() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#0A0A0F]" />
      
      {/* Aurora effects */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-purple-900/20 via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-amber-900/10 via-transparent to-transparent blur-3xl" />
      
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}