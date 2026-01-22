import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const nodeConfig = {
  SOL: { color: '#d4af37', symbol: '☉', name: 'TIPHARETH', hex: '0x6A3F' },
  SAGE: { color: '#8b4789', symbol: '☿', name: 'BINAH', hex: '0x3B21' },
  HERO: { color: '#4a9eff', symbol: '♂', name: 'CHOKMAH', hex: '0x2C15' },
  MOTHER: { color: '#ff69b4', symbol: '♀', name: 'CHESED', hex: '0x4D28' },
  SHADOW: { color: '#cc0000', symbol: '♄', name: 'GEBURAH', hex: '0x5E37' },
  ANIMA: { color: '#7C3AED', symbol: '♃', name: 'NETZACH', hex: '0x7F4A' },
  CHILD: { color: '#FBBF24', symbol: '☽', name: 'YESOD', hex: '0x8G52' },
  TRICKSTER: { color: '#00cccc', symbol: '☊', name: 'HOD', hex: '0x1A09' },
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

  const miniBarHeights = [60, 80, 45, 90, 70];

  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer technical ring with rotation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          border: `1px solid ${config.color}40`,
          transform: 'scale(1.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Data orbit with mini bars */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ transform: 'scale(1.5)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {miniBarHeights.map((h, i) => (
          <div
            key={i}
            className="absolute w-0.5 origin-bottom"
            style={{
              height: `${h * 0.15}px`,
              backgroundColor: `${config.color}80`,
              left: '50%',
              bottom: '50%',
              transform: `rotate(${i * 72}deg) translateY(-${size === 'lg' ? 35 : 28}px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Hexagonal grid pattern */}
      <div 
        className={cn(sizeClasses[size], "absolute inset-0 rounded-full opacity-10")}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(config.color)}' fill-opacity='0.4'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Main node circle */}
      <div
        className={cn(
          sizeClasses[size],
          "relative rounded-full bg-black/80 backdrop-blur-sm",
          "border flex items-center justify-center",
          "transition-all duration-300"
        )}
        style={{ 
          borderColor: `${config.color}60`,
          boxShadow: `0 0 20px ${config.color}40, inset 0 0 15px ${config.color}15`
        }}
      >
        {/* Central symbol */}
        <span 
          className="text-xl font-occult relative z-10"
          style={{ color: config.color, textShadow: `0 0 10px ${config.color}` }}
        >
          {config.symbol}
        </span>
      </div>

      {/* Percentage indicator (top-right) */}
      <div 
        className="absolute -top-1 -right-1 font-data text-[8px] px-1 rounded bg-black/60"
        style={{ color: config.color }}
      >
        {percentage}%
      </div>

      {/* Status indicator (bottom-left) */}
      <div className="absolute -bottom-1 -left-1 flex items-center gap-0.5">
        <div 
          className="w-1 h-1 rounded-full animate-pulse"
          style={{ backgroundColor: '#00ff41' }}
        />
        <span className="font-data text-[7px] text-[#00cccc]/60">ACTIVE</span>
      </div>

      {/* Node ID (bottom) */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-data text-[7px] text-white/20">
        {config.hex}
      </div>

      {/* Label */}
      <div 
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-data text-[8px] tracking-wider whitespace-nowrap"
        style={{ color: `${config.color}99` }}
      >
        {config.name}
      </div>
    </motion.button>
  );
}