import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TreeOfLife from '@/components/tree/TreeOfLife';
import StatusOverlay from '@/components/hud/StatusOverlay';
import TechGrid from '@/components/hud/TechGrid';

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

  return (
    <div className="relative min-h-[85vh]">
      {/* Tech Grid Background */}
      <TechGrid />
      
      {/* HUD Status Overlays */}
      <StatusOverlay />

      {/* Main Content */}
      <div className="relative z-10 pt-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-4"
        >
          <div className="font-data text-[10px] text-[#00cccc]/60 uppercase tracking-[0.3em]">
            ◈ Intelligence Interface Active ◈
          </div>
          <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
            The Great Work
          </h1>
          <div className="font-data text-[10px] text-white/40 uppercase tracking-[0.2em]">
            Archetypal Matrix Online
          </div>
          <div className="font-data text-[9px] text-white/25 tracking-wider">
            SYSTEM STATUS: <span className="text-[#00ff41]">OPERATIONAL</span> • ACTIVE NODES: <span className="text-[#00cccc]">7</span> • SYNC: <span className="text-[#d4af37]">98.7%</span>
          </div>
        </motion.div>

        {/* Tree of Life Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TreeOfLife archetypeScores={archetypeScores} />
        </motion.div>

        {/* Bottom Status Panels */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-3 mt-4 px-2"
        >
          {/* Mini Activity Graph */}
          <div className="flex-1 max-w-[100px] px-2 py-1.5 rounded bg-black/40 border border-[#00cccc]/20">
            <div className="font-data text-[7px] text-[#00cccc]/60 uppercase mb-1">Activity</div>
            <div className="flex items-end gap-0.5 h-4">
              {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
                <div key={i} className="flex-1 bg-[#00cccc]/40" style={{ height: `${h * 12}%` }} />
              ))}
            </div>
          </div>

          {/* Circular Progress */}
          <div className="px-3 py-1.5 rounded bg-black/40 border border-[#d4af37]/20 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.2" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="70 30" strokeLinecap="round" transform="rotate(-90 18 18)" />
            </svg>
            <div>
              <div className="font-data text-[7px] text-[#d4af37]/60 uppercase">Daily</div>
              <div className="font-data text-[10px] text-[#d4af37]">70%</div>
            </div>
          </div>

          {/* Alert Count */}
          <div className="flex-1 max-w-[100px] px-2 py-1.5 rounded bg-black/40 border border-white/10">
            <div className="font-data text-[7px] text-white/40 uppercase mb-1">Insights</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="font-data text-[10px] text-white/60">3 new</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}