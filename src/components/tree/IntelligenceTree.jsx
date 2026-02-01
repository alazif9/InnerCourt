import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import IntelligenceNode from './IntelligenceNode';

const positions = {
  SOL: { top: '8%', left: '50%' },
  HERO: { top: '22%', left: '25%' },
  SAGE: { top: '22%', left: '75%' },
  MOTHER: { top: '42%', left: '18%' },
  SHADOW: { top: '42%', left: '82%' },
  ANIMA: { top: '58%', left: '30%' },
  TRICKSTER: { top: '58%', left: '70%' },
  CHILD: { top: '78%', left: '50%' },
};

const connections = [
  { from: 'SOL', to: 'HERO' },
  { from: 'SOL', to: 'SAGE' },
  { from: 'HERO', to: 'MOTHER' },
  { from: 'SAGE', to: 'SHADOW' },
  { from: 'MOTHER', to: 'ANIMA' },
  { from: 'SHADOW', to: 'TRICKSTER' },
  { from: 'ANIMA', to: 'CHILD' },
  { from: 'TRICKSTER', to: 'CHILD' },
  { from: 'HERO', to: 'SAGE' },
  { from: 'ANIMA', to: 'TRICKSTER' },
];

export default function IntelligenceTree({ archetypeScores = {} }) {
  const navigate = useNavigate();

  const handleNodeClick = (name) => {
    navigate(createPageUrl(`ArchetypeChat?archetype=${name}`));
  };

  return (
    <div className="relative w-full h-[420px]">
      {/* Sacred geometry paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 420">
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>
        
        {/* Connection lines - beams between spheres */}
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
              x1={`${x1}%`}
              y1={`${y1 + 3}%`}
              x2={`${x2}%`}
              y2={`${y2 + 3}%`}
              stroke="url(#beamGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

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