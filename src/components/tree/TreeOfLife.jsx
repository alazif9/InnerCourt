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
      {/* Tree of Life background image */}
      <div 
        className="absolute inset-0 opacity-20 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23666' fill='none' stroke-width='2'%3E%3Ccircle cx='200' cy='50' r='30'/%3E%3Ccircle cx='120' cy='130' r='25'/%3E%3Ccircle cx='280' cy='130' r='25'/%3E%3Ccircle cx='200' cy='130' r='25'/%3E%3Ccircle cx='150' cy='250' r='25'/%3E%3Ccircle cx='250' cy='250' r='25'/%3E%3Ccircle cx='175' cy='370' r='25'/%3E%3Ccircle cx='225' cy='370' r='25'/%3E%3Ccircle cx='200' cy='480' r='25'/%3E%3Cline x1='200' y1='80' x2='120' y2='105'/%3E%3Cline x1='200' y1='80' x2='280' y2='105'/%3E%3Cline x1='200' y1='80' x2='200' y2='105'/%3E%3Cline x1='120' y1='155' x2='150' y2='225'/%3E%3Cline x1='280' y1='155' x2='250' y2='225'/%3E%3Cline x1='150' y1='275' x2='175' y2='345'/%3E%3Cline x1='250' y1='275' x2='225' y2='345'/%3E%3Cline x1='175' y1='395' x2='200' y2='455'/%3E%3Cline x1='225' y1='395' x2='200' y2='455'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 500">
        {connections.map((conn, i) => {
          const fromPos = positions[conn.from];
          const toPos = positions[conn.to];
          const fromX = parseFloat(fromPos.left);
          const fromY = parseFloat(fromPos.top);
          const toX = parseFloat(toPos.left);
          const toY = parseFloat(toPos.top);
          
          return (
            <line
              key={i}
              x1={`${fromX}%`}
              y1={`${fromY + 5}%`}
              x2={`${toX}%`}
              y2={`${toY + 5}%`}
              stroke="#fff"
              strokeWidth="1"
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
    </div>
  );
}