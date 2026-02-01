import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const nodeConfig = {
  SOL: { symbol: '☉', sephira: 'TIPHARETH', archetype: 'SOL', hex: '0x6A3F' },
  SAGE: { symbol: '☿', sephira: 'BINAH', archetype: 'SAGE', hex: '0x3B21' },
  HERO: { symbol: '♂', sephira: 'CHOKMAH', archetype: 'HERO', hex: '0x2C15' },
  MOTHER: { symbol: '♀', sephira: 'CHESED', archetype: 'MOTHER', hex: '0x4D28' },
  SHADOW: { symbol: '♄', sephira: 'GEBURAH', archetype: 'SHADOW', hex: '0x5E37' },
  ANIMA: { symbol: '♃', sephira: 'NETZACH', archetype: 'ANIMA', hex: '0x7F4A' },
  CHILD: { symbol: '☽', sephira: 'YESOD', archetype: 'CHILD', hex: '0x8G52' },
  TRICKSTER: { symbol: '☊', sephira: 'HOD', archetype: 'TRICKSTER', hex: '0x1A09' },
};

export default function IntelligenceNode({ 
  name, 
  size = 'md', 
  activationLevel = 0,
  onClick 
}) {
  const config = nodeConfig[name] || nodeConfig.SOL;
  const percentage = activationLevel || Math.floor(Math.random() * 40 + 50);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };



  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer technical ring with rotation */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        style={{ transform: 'scale(1.3)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Main node circle */}
      <div
        className={cn(
          sizeClasses[size],
          "relative rounded-full bg-black/80 backdrop-blur-sm",
          "border border-white/40 flex items-center justify-center",
          "transition-all duration-300 group-hover:border-white/60"
        )}
        style={{ 
          boxShadow: '0 0 20px rgba(255,255,255,0.15), inset 0 0 15px rgba(255,255,255,0.05)'
        }}
      >
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border border-white/10" />
        
        {/* Central symbol */}
        <span className="text-xl font-occult relative z-10 text-white/90">
          {config.symbol}
        </span>
      </div>

      {/* Percentage indicator (top-right) */}
      <div className="absolute -top-1 -right-1 font-data text-[8px] px-1 rounded bg-black/60 text-white/70">
        {percentage}%
      </div>

      {/* Status indicator (bottom-left) */}
      <div className="absolute -bottom-1 -left-1 flex items-center gap-0.5">
        <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse" />
        <span className="font-data text-[7px] text-white/50">ACTIVE</span>
      </div>

      {/* Node ID (bottom) */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-data text-[7px] text-white/30">
        {config.hex}
      </div>

      {/* Sephira Label */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-data text-[9px] tracking-wider whitespace-nowrap text-white/70">
        {config.sephira}
      </div>
      
      {/* Archetype Label */}
      <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 font-data text-[7px] tracking-wider whitespace-nowrap text-white/40">
        {config.archetype}
      </div>
    </motion.button>
  );
}