import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ 
  children, 
  className, 
  glowColor = 'white',
  intensity = 'normal',
  ...props 
}) {
  const glowStyles = {
    white: 'shadow-white/5',
    gold: 'shadow-amber-500/20 border-amber-500/20',
    purple: 'shadow-purple-500/20 border-purple-500/20',
    cyan: 'shadow-cyan-500/20 border-cyan-500/20',
  };

  const intensityStyles = {
    subtle: 'bg-white/[0.03]',
    normal: 'bg-white/[0.05]',
    strong: 'bg-white/[0.08]',
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10",
        "backdrop-blur-xl",
        intensityStyles[intensity],
        glowStyles[glowColor],
        "shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}