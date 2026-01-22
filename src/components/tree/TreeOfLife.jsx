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
    <div className="relative w-full h-[420px]">
      {/* Connection lines with data flow effect */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 420">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00cccc" stopOpacity="0.2" />
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
              y1={`${fromY + 5}%`}
              x2={`${toX}%`}
              y2={`${toY + 5}%`}
              stroke="url(#pathGradient)"
              strokeWidth="0.5"
              strokeDasharray="4 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          );
        })}
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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />
    </div>
  );
}