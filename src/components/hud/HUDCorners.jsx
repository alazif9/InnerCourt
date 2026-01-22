import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HUDCorners() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => d.toTimeString().split(' ')[0];

  return (
    <>
      {/* Top Left HUD */}
      <div className="fixed top-20 left-4 z-20 font-data text-[9px] leading-tight">
        <div className="text-white/20 mb-1">┌─────────────</div>
        <div className="text-[#ffffff]/60">│ RESONANCE</div>
        <div className="flex items-center gap-1 text-[#ffffff]/80">
          │ <span className="text-[#ffffff]">████████</span><span className="text-white/20">░░</span> 87%
        </div>
        <div className="text-[#ffffff]/60">│ COHERENCE</div>
        <div className="flex items-center gap-1 text-[#ffffff]/80">
          │ <span className="text-[#ffffff]">██████</span><span className="text-white/20">░░░░</span> 63%
        </div>
        <div className="text-white/20">└─────────────</div>
      </div>

      {/* Top Right HUD */}
      <div className="fixed top-20 right-4 z-20 font-data text-[9px] text-right leading-tight">
        <div className="text-white/30">{formatTime(time)} GMT-3</div>
        <div className="text-[#ffffff]/50 mt-1">LAST SYNC: <span className="text-[#ffffff]">2m ago</span></div>
        <div className="text-white/30">SESSIONS: <span className="text-[#ffffff]">3 active</span></div>
        <div className="flex items-center justify-end gap-1 text-white/30">
          BANDWIDTH: <span className="text-[#ffffff]">████</span><span className="text-white/20">░</span>
        </div>
      </div>

      {/* Bottom Left Mini Graph */}
      <motion.div 
        className="fixed bottom-24 left-4 z-20 p-2 rounded bg-black/40 backdrop-blur-sm border border-[#ffffff]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="font-data text-[8px] text-[#ffffff]/50 mb-1">ACTIVITY_LOG</div>
        <div className="flex items-end gap-0.5 h-4">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-[#ffffff]/60 to-[#ffffff]/60"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Center Progress */}
      <motion.div 
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <svg width="40" height="40" className="transform -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <circle 
            cx="20" cy="20" r="16" fill="none" 
            stroke="#ffffff" strokeWidth="2"
            strokeDasharray="75 100"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-data text-[8px] text-[#ffffff]">
          75%
        </div>
      </motion.div>

      {/* Bottom Right Alerts */}
      <motion.div 
        className="fixed bottom-24 right-4 z-20 p-2 rounded bg-black/40 backdrop-blur-sm border border-[#ffffff]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="font-data text-[8px] text-[#ffffff]/50">ALERTS</div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffffff] animate-pulse" />
          <span className="font-data text-[9px] text-white/40">3 pending</span>
        </div>
      </motion.div>

      {/* Scan line effect */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0,204,204,0.01) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ y: [0, 4] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />
    </>
  );
}