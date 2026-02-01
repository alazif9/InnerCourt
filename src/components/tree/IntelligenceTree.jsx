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