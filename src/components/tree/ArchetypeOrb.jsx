import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const archetypeConfig = {
  SOL: { color: '#00ff00', icon: '♔', symbol: 'KETHER' },
  SAGE: { color: '#d97706', icon: '◉', symbol: 'BINAH' },
  HERO: { color: '#00ff00', icon: '◆', symbol: 'CHOKMAH' },
  MOTHER: { color: '#00ff00', icon: '♥', symbol: 'CHESED' },
  SHADOW: { color: '#666666', icon: '◉', symbol: 'NETZACH' },
  ANIMA: { color: '#00ff00', icon: '✦', symbol: 'HOD' },
  CHILD: { color: '#00ff00', icon: '⚙', symbol: 'YESOD' },
  TRICKSTER: { color: '#00ff00', icon: '⚡', symbol: 'GEBURAH' },
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

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Main orb */}
        <div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-black",
            "border-2",
            "flex items-center justify-center",
            "transition-all duration-300"
          )}
          style={{ 
            borderColor: config.color,
            boxShadow: `0 0 15px ${config.color}80`
          }}
        >
          {/* Icon */}
          <span 
            className={cn(iconSizes[size], "relative z-10 font-bold")}
            style={{ color: config.color }}
          >
            {config.icon}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span 
          className={cn(textSizes[size], "font-mono uppercase tracking-wider")}
          style={{ color: config.color }}
        >
          {config.symbol}
        </span>
      )}
    </motion.button>
  );
}