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
        {/* Main orb */}
        <div
          className={cn(
            sizeClasses[size],
            "relative rounded-full",
            "bg-black",
            "border-2 border-white",
            "flex items-center justify-center"
          )}
        >
          {/* Icon */}
          <span className={cn(iconSizes[size], "relative z-10 text-white")}>
            {config.icon}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span className={cn(
          textSizes[size],
          "font-mono uppercase text-white tracking-wider"
        )}>
          {name}
        </span>
      )}
    </motion.button>
  );
}