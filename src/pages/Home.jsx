import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import IntelligenceTree from '@/components/tree/IntelligenceTree';
import HUDCorners from '@/components/hud/HUDCorners';

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  const archetypeScores = userProfile?.archetype_scores || {};
  const activeNodes = Object.keys(archetypeScores).filter(k => archetypeScores[k] > 30).length || 7;

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        {/* Title */}
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          The Great Work
        </h1>
        
        {/* Subtitle */}
        <div className="font-data text-xs text-[#00cccc] tracking-[0.2em] uppercase">
          Archetypal Matrix Online
        </div>
        
        {/* Status line */}
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>SYSTEM STATUS:</span>
          <span className="text-[#00ff41]">OPERATIONAL</span>
          <span className="text-white/20">•</span>
          <span>ACTIVE NODES:</span>
          <span className="text-[#00cccc]">{activeNodes}</span>
          <span className="text-white/20">•</span>
          <span>SYNC:</span>
          <span className="text-[#00ff41]">98.7%</span>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-2 text-[#d4af37]/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Tree of Life */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <IntelligenceTree archetypeScores={archetypeScores} />
      </motion.div>

      {/* Bottom micro-text */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest">
        MATRIX_ID: SOL-{user?.id?.slice(0,8) || '00000000'} • PROTOCOL: HERMETIC_V2.1 • CIPHER: ACTIVE
      </div>
    </div>
  );
}