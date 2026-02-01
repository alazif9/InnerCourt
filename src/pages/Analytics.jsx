import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import PentagonRadar from '@/components/analytics/PentagonRadar';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell
} from 'recharts';

const archetypeSymbols = {
  SHADOW: '♄', HERO: '♂', SAGE: '☿', CHILD: '☆',
  MOTHER: '☽', TRICKSTER: '☌', ANIMA: '♀', SOL: '☉',
};

export default function Analytics() {
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

  const archetypeData = Object.keys(archetypeSymbols).map(arch => ({
    name: arch,
    symbol: archetypeSymbols[arch],
    value: userProfile?.archetype_scores?.[arch] || Math.floor(Math.random() * 60 + 20),
  }));

  const growthDimensions = ['social', 'physical', 'spiritual', 'economic', 'technical']
    .map(k => userProfile?.growth_dimensions?.[k] || Math.floor(Math.random() * 40 + 40));
  const overallScore = Math.round(growthDimensions.reduce((a, b) => a + b, 0) / growthDimensions.length);
  
  const totalArchetypeScore = archetypeData.reduce((a, b) => a + b.value, 0);
  const avgArchetype = Math.round(totalArchetypeScore / archetypeData.length);

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          Intelligence Report
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Archetypal Matrix Analysis
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>SCAN MODE:</span>
          <span className="text-white">DEEP</span>
          <span className="text-white/20">•</span>
          <span>VECTORS:</span>
          <span className="text-white">{archetypeData.length}</span>
          <span className="text-white/20">•</span>
          <span>AVG:</span>
          <span className="text-white">{avgArchetype}%</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Wheel of Life - 3D Topographic Sphere */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest">
                ┌─ MODULE_01 ─┐
              </div>
              <h2 className="font-occult text-white font-medium text-sm">
                Growth Dimensions
              </h2>
              <div className="font-data text-[9px] text-white/30 uppercase tracking-wider">
                Pentagon Balance Matrix
              </div>
            </div>
            <div className="text-right font-data text-[9px]">
              <div className="text-white/40">HARMONY_IDX</div>
              <div className="text-white text-lg">{overallScore}%</div>
            </div>
          </div>
          
          <PentagonRadar 
            data={userProfile?.growth_dimensions || {}}
            overallScore={overallScore}
          />
        </GlassCard>
      </motion.div>

      {/* Archetype Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest">
                ┌─ MODULE_02 ─┐
              </div>
              <h2 className="font-occult text-white font-medium text-sm">
                Archetypal Distribution
              </h2>
              <div className="font-data text-[9px] text-white/30 uppercase tracking-wider">
                Hermetic Power Levels
              </div>
            </div>
            <div className="text-right font-data text-[9px]">
              <div className="text-white/40">TOTAL_PWR</div>
              <div className="text-white text-lg">{totalArchetypeScore}</div>
            </div>
          </div>
          
          {/* Custom Bar Display */}
          <div className="space-y-2">
            {archetypeData.map((arch, i) => (
              <motion.div 
                key={arch.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="w-4 text-white/50 text-sm">{arch.symbol}</span>
                <span className="w-16 font-data text-[9px] text-white/60 uppercase">{arch.name}</span>
                <div className="flex-1 h-3 bg-white/5 border border-white/10 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-white/60 to-white/30"
                    initial={{ width: 0 }}
                    animate={{ width: `${arch.value}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  />
                  {/* Scan line effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                       style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
                </div>
                <span className="w-8 font-data text-[10px] text-white text-right">{arch.value}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom micro-text */}
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between font-data text-[8px] text-white/30">
            <span>ANALYSIS: COMPLETE</span>
            <span>VARIANCE: ±{Math.round(Math.random() * 5 + 2)}%</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-2">
          ┌─ METRICS_GRID ─┐
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GlassCard className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-data text-[8px] text-white/40 uppercase tracking-wider mb-1">
                  Journal Ops
                </div>
                <p className="text-white font-data text-2xl">23</p>
              </div>
              <span className="text-white/30 text-lg">◐</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex-1 h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-white/60" 
                  initial={{ width: 0 }}
                  animate={{ width: '76%' }}
                  transition={{ delay: 0.5 }}
                />
              </div>
              <span className="font-data text-[8px] text-white/40">76%</span>
            </div>
          </GlassCard>
          
          <GlassCard className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-data text-[8px] text-white/40 uppercase tracking-wider mb-1">
                  Chat Sessions
                </div>
                <p className="text-white font-data text-2xl">47</p>
              </div>
              <span className="text-white/30 text-lg">◎</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex-1 h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-white/60" 
                  initial={{ width: 0 }}
                  animate={{ width: '89%' }}
                  transition={{ delay: 0.55 }}
                />
              </div>
              <span className="font-data text-[8px] text-white/40">89%</span>
            </div>
          </GlassCard>
          
          <GlassCard className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-data text-[8px] text-white/40 uppercase tracking-wider mb-1">
                  Streak Counter
                </div>
                <p className="text-white font-data text-2xl">12</p>
              </div>
              <span className="text-white/30 text-lg">✦</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex-1 h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-white/60" 
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ delay: 0.6 }}
                />
              </div>
              <span className="font-data text-[8px] text-white/40">40%</span>
            </div>
          </GlassCard>
          
          <GlassCard className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-data text-[8px] text-white/40 uppercase tracking-wider mb-1">
                  Dominant Node
                </div>
                <p className="text-white font-occult text-xl">
                  {userProfile?.dominant_archetype || 'Hero'}
                </p>
              </div>
              <span className="text-white/30 text-lg">
                {archetypeSymbols[userProfile?.dominant_archetype] || '♂'}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-white"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-data text-[8px] text-white/40">ACTIVE</span>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        REPORT_ID: ANA-{user?.id?.slice(0,6) || '000000'} • GENERATED: {new Date().toISOString().split('T')[0]} • CIPHER: ACTIVE
      </div>
    </div>
  );
}