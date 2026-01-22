import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ 
  children, 
  className,
  variant = 'default',
  ...props 
}) {
  const variants = {
    default: 'border-green-500/50 shadow-[0_0_10px_rgba(0,255,0,0.2)]',
    terminal: 'border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.3)] bg-black/90',
    dungeon: 'border-amber-600/50 shadow-[0_0_10px_rgba(217,119,6,0.2)]',
  };

  return (
    <div
      className={cn(
        "relative rounded-none border-2 bg-black",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-400" />
      
      {children}
    </div>
  );
}