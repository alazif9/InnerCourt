import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const archetypeConfig = {
  SOL: { color: '#d4af37', symbol: '☉', name: 'Tiphareth', nodeId: '0x01' },
  SAGE: { color: '#8b4789', symbol: '☿', name: 'Binah', nodeId: '0x03' },
  HERO: { color: '#6b8cce', symbol: '♂', name: 'Chokmah', nodeId: '0x02' },
  MOTHER: { color: '#ff69b4', symbol: '♀', name: 'Chesed', nodeId: '0x04' },
  SHADOW: { color: '#cc0000', symbol: '♄', name: 'Geburah', nodeId: '0x05' },
  ANIMA: { color: '#7C3AED', symbol: '♃', name: 'Netzach', nodeId: '0x07' },
  CHILD: { color: '#FBBF24', symbol: '☽', name: 'Yesod', nodeId: '0x09' },
  TRICKSTER: { color: '#00cccc', symbol: '☾', name: 'Hod', nodeId: '0x08' },
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
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const displayActivation = activationLevel || Math.floor(Math.random() * 40 + 50);
  
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative">
        {/* Outer technical ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full border"
          style={{ borderColor: `${config.color}30` }}
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Data orbit ring with mini metrics */}
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Mini bar graphs in orbit */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <div 
              key={i}
              className="absolute w-1 bg-gradient-to-t from-transparent"
              style={{ 
                height: `${8 + i * 2}px`,
                left: '50%',
                top: '0',
                transform: `rotate(${deg}deg) translateX(-50%)`,
                transformOrigin: '50% 50px',
                backgroundColor: `${config.color}60`
              }}
            />
          ))}
        </motion.div>

        {/* Main node container */}
        <div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-black/80 backdrop-blur-sm",
            "border flex items-center justify-center",
            "transition-all duration-300"
          )}
          style={{ 
            borderColor: `${config.color}50`,
            boxShadow: isActive 
              ? `0 0 25px ${config.color}40, inset 0 0 20px ${config.color}15` 
              : `0 0 10px ${config.color}20`
          }}
        >
          {/* Hexagonal grid behind */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke={config.color} strokeWidth="0.5" />
            <polygon points="50,25 75,37 75,63 50,75 25,63 25,37" fill="none" stroke={config.color} strokeWidth="0.3" />
          </svg>
          
          {/* Alchemical symbol */}
          <span 
            className={cn(iconSizes[size], "relative z-10 font-occult")}
            style={{ 
              color: config.color,
              textShadow: `0 0 10px ${config.color}80`
            }}
          >
            {config.symbol}
          </span>
        </div>

        {/* Percentage indicator (top-right) */}
        <div 
          className="absolute -top-1 -right-2 font-data text-[8px] px-1 rounded"
          style={{ 
            color: config.color,
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: `1px solid ${config.color}40`
          }}
        >
          {displayActivation}%
        </div>

        {/* Status indicator (bottom-left) */}
        <div 
          className="absolute -bottom-1 -left-1 font-data text-[6px] px-1"
          style={{ color: isActive ? '#00ff41' : '#666' }}
        >
          {isActive ? 'ACTIVE' : config.nodeId}
        </div>
      </div>
      
      {showLabel && (
        <span 
          className={cn(textSizes[size], "font-data tracking-wider uppercase")}
          style={{ color: `${config.color}aa` }}
        >
          {config.name}
        </span>
      )}
    </motion.button>
  );
}