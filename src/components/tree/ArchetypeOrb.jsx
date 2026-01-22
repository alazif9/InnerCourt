import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const archetypeConfig = {
  SOL: { color: '#d4af37', symbol: '☉', sigil: '◉', name: 'Kether' },
  SAGE: { color: '#8B7355', symbol: '☿', sigil: '▽', name: 'Binah' },
  HERO: { color: '#C0C0C0', symbol: '♂', sigil: '△', name: 'Chokmah' },
  MOTHER: { color: '#EC4899', symbol: '♀', sigil: '◇', name: 'Chesed' },
  SHADOW: { color: '#DC2626', symbol: '♄', sigil: '◆', name: 'Geburah' },
  ANIMA: { color: '#7C3AED', symbol: '♃', sigil: '◈', name: 'Tiphareth' },
  CHILD: { color: '#FBBF24', symbol: '☽', sigil: '○', name: 'Yesod' },
  TRICKSTER: { color: '#00FFFF', symbol: '☾', sigil: '◐', name: 'Hod' },
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        {/* Main sigil container */}
        <div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-black/60 backdrop-blur-sm",
            "border flex items-center justify-center",
            "transition-all duration-300"
          )}
          style={{ 
            borderColor: `${config.color}40`,
            boxShadow: isActive ? `0 0 20px ${config.color}60, inset 0 0 15px ${config.color}20` : 'none'
          }}
        >
          {/* Alchemical symbol */}
          <span 
            className={cn(iconSizes[size], "relative z-10 font-bold font-occult")}
            style={{ color: config.color }}
          >
            {config.symbol}
          </span>
          
          {/* Activation hexagram */}
          {activationLevel > 0 && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <polygon
                points="50,15 65,35 85,35 70,50 85,65 65,65 50,85 35,65 15,65 30,50 15,35 35,35"
                fill="none"
                stroke={config.color}
                strokeWidth="1"
                opacity={activationLevel / 100}
              />
            </svg>
          )}
        </div>

        {/* Orbital ring for active state */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: `${config.color}30` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      
      {showLabel && (
        <span 
          className={cn(textSizes[size], "font-data tracking-wider uppercase text-xs")}
          style={{ color: `${config.color}cc` }}
        >
          {config.name}
        </span>
      )}
    </motion.button>
  );
}