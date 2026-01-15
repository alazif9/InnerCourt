import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const archetypeConfig = {
  SOL: { color: '#D4AF37', glow: 'amber', icon: '☀️', bgGlow: 'from-amber-500/40' },
  SAGE: { color: '#8B4513', glow: 'amber', icon: '🦉', bgGlow: 'from-amber-700/30' },
  HERO: { color: '#DC2626', glow: 'red', icon: '⚔️', bgGlow: 'from-red-500/30' },
  MOTHER: { color: '#EC4899', glow: 'pink', icon: '🌸', bgGlow: 'from-pink-500/30' },
  SHADOW: { color: '#374151', glow: 'slate', icon: '🌑', bgGlow: 'from-slate-500/30' },
  ANIMA: { color: '#7C3AED', glow: 'purple', icon: '🔮', bgGlow: 'from-purple-500/30' },
  CHILD: { color: '#FBBF24', glow: 'yellow', icon: '✨', bgGlow: 'from-yellow-400/30' },
  TRICKSTER: { color: '#10B981', glow: 'emerald', icon: '🃏', bgGlow: 'from-emerald-500/30' },
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
        {/* Outer glow */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity",
            `bg-gradient-radial ${config.bgGlow} to-transparent`
          )}
          style={{ transform: 'scale(1.5)' }}
          animate={isActive ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Main orb */}
        <motion.div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-gradient-to-br from-white/10 to-white/5",
            "border border-white/20",
            "backdrop-blur-md",
            "flex items-center justify-center",
            "shadow-lg shadow-black/30",
            "overflow-hidden"
          )}
          animate={isActive ? { 
            boxShadow: [
              `0 0 20px ${config.color}40`,
              `0 0 40px ${config.color}60`,
              `0 0 20px ${config.color}40`,
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Inner color glow */}
          <div 
            className="absolute inset-2 rounded-full opacity-30"
            style={{ backgroundColor: config.color }}
          />
          
          {/* Activation ring */}
          {activationLevel > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke={config.color}
                strokeWidth="2"
                strokeDasharray={`${activationLevel * 2.83} 283`}
                className="opacity-60"
              />
            </svg>
          )}
          
          {/* Icon */}
          <span className={cn(iconSizes[size], "relative z-10 filter drop-shadow-lg")}>
            {config.icon}
          </span>
        </motion.div>

        {/* Connection point indicator */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: config.color, opacity: 0.6 }}
        />
      </div>
      
      {showLabel && (
        <span className={cn(
          textSizes[size],
          "font-medium tracking-wider text-white/80",
          "font-['Cinzel',serif]"
        )}>
          {name}
        </span>
      )}
    </motion.button>
  );
}