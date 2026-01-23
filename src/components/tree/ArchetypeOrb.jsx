import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const archetypeConfig = {
  SOL: { symbol: '☉', sephira: 'TIPHARETH', archetype: 'The Self', nodeId: '0x06' },
  SAGE: { symbol: '☿', sephira: 'BINAH', archetype: 'The Sage', nodeId: '0x03' },
  HERO: { symbol: '♂', sephira: 'CHOKMAH', archetype: 'The Hero', nodeId: '0x02' },
  MOTHER: { symbol: '♀', sephira: 'CHESED', archetype: 'The Mother', nodeId: '0x04' },
  SHADOW: { symbol: '♄', sephira: 'GEBURAH', archetype: 'The Shadow', nodeId: '0x05' },
  ANIMA: { symbol: '♃', sephira: 'NETZACH', archetype: 'The Anima', nodeId: '0x07' },
  CHILD: { symbol: '☽', sephira: 'YESOD', archetype: 'The Child', nodeId: '0x09' },
  TRICKSTER: { symbol: '☾', sephira: 'HOD', archetype: 'The Trickster', nodeId: '0x08' },
};

export default function ArchetypeOrb({ 
  name, 
  isActive = false, 
  size = 'md',
  onClick,
  showLabel = true,
  activationLevel = 0,
}) {
  const config = archetypeConfig[name] || archetypeConfig.SOL;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const displayActivation = activationLevel || Math.floor(Math.random() * 40 + 50);
  
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-[-3px] rounded-full border border-white/20"
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Main node container */}
        <div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-black/80 backdrop-blur-sm",
            "border border-white/30 flex items-center justify-center",
            "transition-all duration-300 group-hover:border-white/50"
          )}
          style={{ 
            boxShadow: isActive 
              ? '0 0 20px rgba(255,255,255,0.2), inset 0 0 15px rgba(255,255,255,0.05)' 
              : '0 0 10px rgba(255,255,255,0.1)'
          }}
        >
          {/* Inner circle decoration */}
          <div className="absolute inset-2 rounded-full border border-white/10" />
          
          {/* Symbol */}
          <span 
            className={cn(iconSizes[size], "relative z-10 font-data text-white/80")}
            style={{ 
              textShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
            }}
          >
            {config.symbol}
          </span>
        </div>

        {/* Percentage indicator */}
        <div 
          className="absolute -top-1 -right-1 font-data text-[7px] px-1 rounded bg-black/80 border border-white/20 text-white/60"
        >
          {displayActivation}%
        </div>
      </div>
      
      {showLabel && (
        <div className="flex flex-col items-center mt-1">
          <span className={cn(textSizes[size], "font-data tracking-widest text-white/70 uppercase")}>
            {config.sephira}
          </span>
          <span className="font-data text-[7px] text-white/40">
            {config.archetype}
          </span>
        </div>
      )}
    </motion.button>
  );
}