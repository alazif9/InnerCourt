import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ 
  children, 
  className, 
  glowColor = 'gold',
  variant = 'default',
  ...props 
}) {
  const glowStyles = {
    gold: 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    silver: 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    cyan: 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    purple: 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-black/40 backdrop-blur-md",
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}