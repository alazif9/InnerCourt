import React from 'react';
import { motion } from 'framer-motion';
import ArchetypeOrb from './ArchetypeOrb';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Kabbalistic Tree of Life connections
const connections = [
  // From Tiphareth (center)
  { from: 'SOL', to: 'HERO' },      // Tiphareth to Chokmah
  { from: 'SOL', to: 'SAGE' },      // Tiphareth to Binah
  
  // Pillars
  { from: 'HERO', to: 'MOTHER' },   // Chokmah to Chesed
  { from: 'SAGE', to: 'SHADOW' },   // Binah to Geburah
  
  // Cross connections
  { from: 'MOTHER', to: 'SHADOW' }, // Chesed to Geburah
  { from: 'MOTHER', to: 'ANIMA' },  // Chesed to Netzach
  { from: 'SHADOW', to: 'TRICKSTER' }, // Geburah to Hod
  
  // Lower connections
  { from: 'ANIMA', to: 'TRICKSTER' }, // Netzach to Hod
  { from: 'ANIMA', to: 'CHILD' },   // Netzach to Yesod
  { from: 'TRICKSTER', to: 'CHILD' }, // Hod to Yesod
  
  // Central pillar hints
  { from: 'SOL', to: 'ANIMA' },     // Tiphareth to Netzach
  { from: 'SOL', to: 'TRICKSTER' }, // Tiphareth to Hod
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
  // Traditional layout: 3 pillars
  // Left pillar (Severity): Binah, Geburah, Hod
  // Middle pillar: Tiphareth, Yesod
  // Right pillar (Mercy): Chokmah, Chesed, Netzach
  const positions = {
    // Top center - Tiphareth (Beauty/Heart)
    SOL: { top: '8%', left: '50%' },        // Tiphareth (6) - center top
    
    // Row 2 - Chokmah (right) and Binah (left)
    HERO: { top: '25%', left: '25%' },      // Chokmah (2) - left side
    SAGE: { top: '25%', left: '75%' },      // Binah (3) - right side
    
    // Row 3 - Chesed (right) and Geburah (left)
    MOTHER: { top: '42%', left: '15%' },    // Chesed (4) - left side
    SHADOW: { top: '42%', left: '85%' },    // Geburah (5) - right side
    
    // Row 4 - Netzach (right) and Hod (left)
    ANIMA: { top: '62%', left: '35%' },     // Netzach (7) - left side
    TRICKSTER: { top: '62%', left: '65%' }, // Hod (8) - right side
    
    // Bottom center - Yesod (Foundation)
    CHILD: { top: '82%', left: '50%' },     // Yesod (9) - center bottom
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