import React from 'react';
import { motion } from 'framer-motion';
import ArchetypeOrb from './ArchetypeOrb';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const connections = [
  { from: 'SOL', to: 'SAGE' },
  { from: 'SOL', to: 'HERO' },
  { from: 'SOL', to: 'MOTHER' },
  { from: 'SAGE', to: 'SHADOW' },
  { from: 'HERO', to: 'SHADOW' },
  { from: 'HERO', to: 'ANIMA' },
  { from: 'MOTHER', to: 'ANIMA' },
  { from: 'SHADOW', to: 'CHILD' },
  { from: 'ANIMA', to: 'TRICKSTER' },
  { from: 'CHILD', to: 'TRICKSTER' },
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

  const positions = {
    SOL: { top: '5%', left: '50%' },
    SAGE: { top: '22%', left: '20%' },
    HERO: { top: '22%', left: '50%' },
    MOTHER: { top: '22%', left: '80%' },
    SHADOW: { top: '48%', left: '30%' },
    ANIMA: { top: '48%', left: '70%' },
    CHILD: { top: '72%', left: '35%' },
    TRICKSTER: { top: '72%', left: '65%' },
  };

  return (
    <div className="relative w-full h-[500px] mt-4">
      {/* Sacred geometry background pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 500">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Connection lines */}
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
              y1={`${fromY + 5}%`}
              x2={`${toX}%`}
              y2={`${toY + 5}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Archetype Orbs */}
      {Object.entries(positions).map(([name, pos]) => (
        <motion.div
          key={name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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

      {/* Ethereal glow behind SOL */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}