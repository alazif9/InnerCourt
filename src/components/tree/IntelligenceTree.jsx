import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import IntelligenceNode from './IntelligenceNode';

// Tree of Life layout - SOL as Keter at top
const positions = {
  SOL: { top: '5%', left: '50%' },         // Keter - crown (top center)
  HERO: { top: '20%', left: '22%' },       // Chokmah - top left
  SAGE: { top: '20%', left: '78%' },       // Binah - top right
  MOTHER: { top: '42%', left: '22%' },     // Chesed - left
  SHADOW: { top: '42%', left: '78%' },     // Geburah - right
  ANIMA: { top: '64%', left: '22%' },      // Netzach - left
  TRICKSTER: { top: '64%', left: '78%' },  // Hod - right
  CHILD: { top: '88%', left: '50%' },      // Yesod - bottom center
};

// Tree of Life paths
const connections = [
  // From Keter (SOL) down
  { from: 'SOL', to: 'HERO' },
  { from: 'SOL', to: 'SAGE' },
  
  // Horizontal connections
  { from: 'HERO', to: 'SAGE' },
  { from: 'MOTHER', to: 'SHADOW' },
  { from: 'ANIMA', to: 'TRICKSTER' },
  
  // Left pillar
  { from: 'HERO', to: 'MOTHER' },
  { from: 'MOTHER', to: 'ANIMA' },
  { from: 'ANIMA', to: 'CHILD' },
  
  // Right pillar
  { from: 'SAGE', to: 'SHADOW' },
  { from: 'SHADOW', to: 'TRICKSTER' },
  { from: 'TRICKSTER', to: 'CHILD' },
  
  // Diagonal crosses
  { from: 'HERO', to: 'SHADOW' },
  { from: 'SAGE', to: 'MOTHER' },
  { from: 'MOTHER', to: 'TRICKSTER' },
  { from: 'SHADOW', to: 'ANIMA' },
];

export default function IntelligenceTree({ archetypeScores = {} }) {
  const navigate = useNavigate();
  const containerRef = React.useRef(null);
  const [containerSize, setContainerSize] = React.useState({ width: 100, height: 380 });

  React.useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const handleNodeClick = (name) => {
    navigate(createPageUrl(`ArchetypeChat?archetype=${name}`));
  };

  // Convert percentage positions to actual coordinates
  const getCoords = (pos) => ({
    x: (parseFloat(pos.left) / 100) * containerSize.width,
    y: (parseFloat(pos.top) / 100) * containerSize.height
  });

  return (
    <div ref={containerRef} className="relative w-full h-[380px]">

      {/* Connection lines between spheres - neon beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          {/* Neon glow filter */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines between spheres */}
        {connections.map((conn, i) => {
          const from = getCoords(positions[conn.from]);
          const to = getCoords(positions[conn.to]);
          
          return (
            <motion.line
              key={`conn-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
              filter="url(#neonGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          );
        })}
        
        {/* Lines from each sphere to center */}
        {(() => {
          // Center point: horizontal center (50%) and vertical middle of the tree (~46.5% between top 5% and bottom 88%)
          const centerX = containerSize.width * 0.50;
          const centerY = containerSize.height * 0.465;
          
          return (
            <>
              {Object.entries(positions).map(([name, pos], i) => {
                const coords = getCoords(pos);
                
                return (
                  <motion.line
                    key={`center-${name}`}
                    x1={coords.x}
                    y1={coords.y}
                    x2={centerX}
                    y2={centerY}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                    filter="url(#neonGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.05 }}
                  />
                );
              })}
              
              {/* Center convergence point */}
              <motion.circle
                cx={centerX}
                cy={centerY}
                r="4"
                fill="rgba(255,255,255,0.9)"
                filter="url(#neonGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              />
            </>
          );
        })()}
      </svg>

      {/* Intelligence Nodes */}
      {Object.entries(positions).map(([name, pos]) => (
        <motion.div
          key={name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: pos.top, left: pos.left, zIndex: 10 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <IntelligenceNode
            name={name}
            size={name === 'SOL' ? 'lg' : 'md'}
            activationLevel={archetypeScores[name] || 0}
            onClick={() => handleNodeClick(name)}
          />
        </motion.div>
      ))}

      {/* Floating data particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}