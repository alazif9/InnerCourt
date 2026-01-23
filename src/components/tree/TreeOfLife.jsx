import React from 'react';
import { motion } from 'framer-motion';
import ArchetypeOrb from './ArchetypeOrb';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Kabbalistic Tree of Life connections (22 paths)
const connections = [
  // From Kether (SOL at top) - traditional positioning
  { from: 'HERO', to: 'SOL' },      // Chokmah to Tiphareth
  { from: 'SAGE', to: 'SOL' },      // Binah to Tiphareth
  { from: 'MOTHER', to: 'SOL' },    // Chesed to Tiphareth
  { from: 'SHADOW', to: 'SOL' },    // Geburah to Tiphareth
  { from: 'HERO', to: 'SAGE' },     // Across the top
  { from: 'HERO', to: 'MOTHER' },   // Chokmah to Chesed
  { from: 'SAGE', to: 'SHADOW' },   // Binah to Geburah
  { from: 'MOTHER', to: 'SHADOW' }, // Chesed to Geburah
  { from: 'MOTHER', to: 'ANIMA' },  // Chesed to Netzach
  { from: 'SHADOW', to: 'TRICKSTER' }, // Geburah to Hod
  { from: 'SOL', to: 'ANIMA' },     // Tiphareth to Netzach
  { from: 'SOL', to: 'TRICKSTER' }, // Tiphareth to Hod
  { from: 'SOL', to: 'CHILD' },     // Tiphareth to Yesod
  { from: 'ANIMA', to: 'TRICKSTER' }, // Netzach to Hod
  { from: 'ANIMA', to: 'CHILD' },   // Netzach to Yesod
  { from: 'TRICKSTER', to: 'CHILD' }, // Hod to Yesod
];

export default function TreeOfLife({ archetypeScores = {}, onSelectArchetype }) {
  const navigate = useNavigate();

  const handleArchetypeClick = (name) => {
    if (onSelectArchetype) {
      onSelectArchetype(name);
    } else {
      navigate(createPageUrl('ArchetypeChat') + `?archetype=${name}`);
    }
  };

  // Proper Kabbalistic Tree of Life positions
  // Traditional layout: 3 pillars (left, middle, right)
  const positions = {
    // Row 1 - Top (Supernal Triad area)
    HERO: { top: '8%', left: '25%' },      // Chokmah (right pillar top)
    SAGE: { top: '8%', left: '75%' },      // Binah (left pillar top)
    
    // Row 2 - Upper middle
    MOTHER: { top: '28%', left: '20%' },   // Chesed (right pillar)
    SHADOW: { top: '28%', left: '80%' },   // Geburah (left pillar)
    
    // Row 3 - Center (Heart)
    SOL: { top: '48%', left: '50%' },      // Tiphareth (middle pillar - center)
    
    // Row 4 - Lower middle
    ANIMA: { top: '68%', left: '25%' },    // Netzach (right pillar)
    TRICKSTER: { top: '68%', left: '75%' }, // Hod (left pillar)
    
    // Row 5 - Bottom
    CHILD: { top: '88%', left: '50%' },    // Yesod (middle pillar)
  };

  return (
    <div className="relative w-full h-[450px]">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 450">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>
        
        {connections.map((conn, i) => {
          const fromPos = positions[conn.from];
          const toPos = positions[conn.to];
          const fromX = parseFloat(fromPos.left);
          const fromY = parseFloat(fromPos.top);
          const toX = parseFloat(toPos.left);
          const toY = parseFloat(toPos.top);
          
          return (
            <motion.line
              key={i}
              x1={`${fromX}%`}
              y1={`${fromY}%`}
              x2={`${toX}%`}
              y2={`${toY}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
            />
          );
        })}

        {/* Central vertical pillar line */}
        <line
          x1="50%" y1="48%"
          x2="50%" y2="88%"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          strokeDasharray="4 2"
        />
      </svg>

      {/* Archetype Nodes */}
      {Object.entries(positions).map(([name, pos]) => (
        <motion.div
          key={name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ArchetypeOrb
            name={name}
            size={name === 'SOL' ? 'lg' : 'md'}
            isActive={name === 'SOL' || (archetypeScores[name] || 0) > 50}
            activationLevel={archetypeScores[name] || 0}
            onClick={() => handleArchetypeClick(name)}
          />
        </motion.div>
      ))}

      {/* SOL central glow */}
      <div 
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}