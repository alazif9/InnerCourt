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

  const handleNodeClick = (name) => {
    navigate(createPageUrl(`ArchetypeChat?archetype=${name}`));
  };

  return (
    <div className="relative w-full h-[380px]">

      {/* Intelligence Nodes */}
      {Object.entries(positions).map(([name, pos]) => (
        <motion.div
          key={name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: pos.top, left: pos.left }}
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

      {/* Connection lines between spheres - rendered on top */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>
        
        {connections.map((conn, i) => {
          const from = positions[conn.from];
          const to = positions[conn.to];
          const x1 = parseFloat(from.left);
          const y1 = parseFloat(from.top);
          const x2 = parseFloat(to.left);
          const y2 = parseFloat(to.top);
          
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#beamGradient)"
              strokeWidth="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          );
        })}
      </svg>

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