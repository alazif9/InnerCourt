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
    gold: 'border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]',
    silver: 'border-[#c0c0c0]/30 shadow-[0_0_20px_rgba(192,192,192,0.1)]',
    cyan: 'border-[#00cccc]/30 shadow-[0_0_20px_rgba(0,204,204,0.1)]',
    purple: 'border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.1)]',
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