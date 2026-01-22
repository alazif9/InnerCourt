import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ 
  children, 
  className,
  ...props 
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-white/20 bg-black",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}