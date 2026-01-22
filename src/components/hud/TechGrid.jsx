import React from 'react';

export default function TechGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Technical Blueprint Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="techGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00cccc" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#techGrid)" />
      </svg>

      {/* Constellation Layer */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 400 600">
        {/* Tree of Life subtle paths */}
        <g stroke="#d4af37" strokeWidth="0.3" fill="none" opacity="0.4">
          <circle cx="200" cy="50" r="25" />
          <circle cx="120" cy="130" r="20" />
          <circle cx="280" cy="130" r="20" />
          <circle cx="200" cy="130" r="20" />
          <circle cx="140" cy="240" r="20" />
          <circle cx="260" cy="240" r="20" />
          <circle cx="160" cy="350" r="20" />
          <circle cx="240" cy="350" r="20" />
          <circle cx="200" cy="460" r="20" />
          <line x1="200" y1="75" x2="120" y2="110" />
          <line x1="200" y1="75" x2="280" y2="110" />
          <line x1="200" y1="75" x2="200" y2="110" />
          <line x1="120" y1="150" x2="140" y2="220" />
          <line x1="280" y1="150" x2="260" y2="220" />
          <line x1="140" y1="260" x2="160" y2="330" />
          <line x1="260" y1="260" x2="240" y2="330" />
          <line x1="160" y1="370" x2="200" y2="440" />
          <line x1="240" y1="370" x2="200" y2="440" />
        </g>
        
        {/* Scattered constellation dots */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={50 + Math.random() * 300}
            cy={50 + Math.random() * 500}
            r="1"
            fill="#fff"
            opacity={0.2 + Math.random() * 0.3}
          />
        ))}
      </svg>

      {/* Hexagram pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 200 200">
        <polygon 
          points="100,20 140,80 180,80 150,110 160,170 100,140 40,170 50,110 20,80 60,80" 
          fill="none" 
          stroke="#d4af37" 
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}