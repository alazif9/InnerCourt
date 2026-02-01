import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TreeOfLife({ archetypeScores = {}, onSelectArchetype }) {
  const navigate = useNavigate();

  // Arquétipos na geometria correta da Árvore da Vida
  const archetypes = {
    SOL: { 
      x: 50, y: 12, 
      symbol: '☉', 
      sephira: 'TIPHARETH',
      archetype: 'The Self',
      nodeId: '0x06'
    },
    HERO: { 
      x: 25, y: 30, 
      symbol: '♂', 
      sephira: 'CHOKMAH',
      archetype: 'The Hero',
      nodeId: '0x02'
    },
    SAGE: { 
      x: 75, y: 30, 
      symbol: '☿', 
      sephira: 'BINAH',
      archetype: 'The Sage',
      nodeId: '0x03'
    },
    MOTHER: { 
      x: 15, y: 48, 
      symbol: '♀', 
      sephira: 'CHESED',
      archetype: 'The Mother',
      nodeId: '0x04'
    },
    SHADOW: { 
      x: 85, y: 48, 
      symbol: '♄',
      sephira: 'GEBURAH',
      archetype: 'The Shadow',
      nodeId: '0x05'
    },
    ANIMA: { 
      x: 30, y: 66, 
      symbol: '♃',
      sephira: 'NETZACH',
      archetype: 'The Anima',
      nodeId: '0x07'
    },
    TRICKSTER: { 
      x: 70, y: 66, 
      symbol: '☾',
      sephira: 'HOD',
      archetype: 'The Trickster',
      nodeId: '0x08'
    },
    CHILD: { 
      x: 50, y: 84, 
      symbol: '☽', 
      sephira: 'YESOD',
      archetype: 'The Child',
      nodeId: '0x09'
    },
  };

  // Paths conectando os sephiroth
  const paths = [
    ['SOL', 'HERO'],
    ['SOL', 'SAGE'],
    ['HERO', 'MOTHER'],
    ['SAGE', 'SHADOW'],
    ['MOTHER', 'SHADOW'],
    ['MOTHER', 'ANIMA'],
    ['SHADOW', 'TRICKSTER'],
    ['ANIMA', 'CHILD'],
    ['TRICKSTER', 'CHILD'],
    ['ANIMA', 'TRICKSTER'],
    ['SOL', 'ANIMA'],
    ['SOL', 'TRICKSTER'],
  ];

  const handleClick = (name) => {
    if (onSelectArchetype) {
      onSelectArchetype(name);
    } else {
      navigate(createPageUrl('ArchetypeChat') + `?archetype=${name}`);
    }
  };

  return (
    <div className="relative w-full h-[420px]">
      {/* Linhas conectando os arquétipos */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>
        {paths.map(([from, to], idx) => (
          <motion.line
            key={idx}
            x1={`${archetypes[from].x}%`}
            y1={`${archetypes[from].y}%`}
            x2={`${archetypes[to].x}%`}
            y2={`${archetypes[to].y}%`}
            stroke="url(#beamGradient)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          />
        ))}
      </svg>

      {/* Círculos dos arquétipos */}
      {Object.entries(archetypes).map(([key, data]) => {
        const activation = archetypeScores[key] || Math.floor(Math.random() * 40 + 50);
        const isActive = key === 'SOL' || activation > 50;
        const isCentral = key === 'SOL';
        
        // Position text labels based on node position
        const isLeftSide = data.x < 40;
        const isRightSide = data.x > 60;
        
        return (
          <motion.div
            key={key}
            className="absolute cursor-pointer group"
            style={{
              left: `${data.x}%`,
              top: `${data.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(key)}
          >
            {/* Container for orb and labels */}
            <div className="relative flex items-center gap-2">
              {/* Left-side labels */}
              {isLeftSide && (
                <div className="flex flex-col items-end mr-1 min-w-[60px]">
                  <div className="font-data text-[10px] text-white/70 tracking-wider">
                    {data.sephira}
                  </div>
                  <div className="font-data text-[8px] text-white/40">
                    {key}
                  </div>
                </div>
              )}

              {/* Orb container */}
              <div className="relative flex flex-col items-center">
                {/* Percentage badge */}
                <div className="absolute -top-3 font-data text-[10px] text-white/60">
                  {activation}%
                </div>

                {/* Círculo principal */}
                <div
                  className={`${isCentral ? 'w-14 h-14' : 'w-12 h-12'} rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:border-white/60`}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    boxShadow: '0 0 20px rgba(255,255,255,0.15), inset 0 0 10px rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Inner ring */}
                  <div className="absolute inset-1.5 rounded-full border border-white/15" />
                  
                  {/* Símbolo */}
                  <span className={`${isCentral ? 'text-xl' : 'text-lg'} font-data text-white/90`}>
                    {data.symbol}
                  </span>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1 mt-1">
                  <div 
                    className="w-1 h-1 rounded-full bg-white/50"
                    style={{ 
                      boxShadow: isActive ? '0 0 4px rgba(255,255,255,0.5)' : 'none'
                    }}
                  />
                  <span className="font-data text-[7px] text-white/40">
                    {isActive ? 'ACTIVE' : data.nodeId}
                  </span>
                </div>
              </div>

              {/* Right-side or center labels */}
              {(isRightSide || (!isLeftSide && !isRightSide)) && (
                <div className={`flex flex-col ${isRightSide ? 'items-start ml-1' : 'items-start ml-1'} min-w-[60px]`}>
                  <div className="font-data text-[10px] text-white/70 tracking-wider">
                    {data.sephira}
                  </div>
                  <div className="font-data text-[8px] text-white/40">
                    {key}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* SOL central glow */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '12%',
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}