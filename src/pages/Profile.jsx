import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { 
  User, Settings, LogOut, 
  ChevronRight, Sparkles, HelpCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: User, label: 'EDIT PROFILE', action: 'profile', symbol: '◇', page: 'EditProfile' },
  { icon: Settings, label: 'SETTINGS', action: 'settings', symbol: '⚙', page: 'Settings' },
];

const archetypeSymbols = {
  SOL: '☉', SAGE: '☿', HERO: '♂', MOTHER: '☽', 
  SHADOW: '♄', ANIMA: '♀', CHILD: '☆', TRICKSTER: '☌'
};

export default function Profile() {
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

  const handleLogout = () => {
    base44.auth.logout();
  };

  const dominantSymbol = userProfile?.dominant_archetype 
    ? archetypeSymbols[userProfile.dominant_archetype] || '◈' 
    : '◈';

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          Operator Profile
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Identity Matrix
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>STATUS:</span>
          <span className="text-white">ACTIVE</span>
          <span className="text-white/20">•</span>
          <span>CLEARANCE:</span>
          <span className="text-white">LEVEL 7</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="relative">
          {/* Outer ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ width: 104, height: 104, top: -4, left: -4 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Avatar container */}
          <div 
            className="w-24 h-24 rounded-full border-2 border-white/30 bg-black/60 flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(255,255,255,0.1)' }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/80 text-3xl font-occult">{dominantSymbol}</span>
            )}
          </div>
          
          {/* Status indicator */}
          <div 
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-white/50 bg-black flex items-center justify-center"
            style={{ boxShadow: '0 0 10px rgba(255,255,255,0.3)' }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center space-y-1"
      >
        <h2 className="font-occult text-xl text-white">
          {user?.full_name || 'Seeker'}
        </h2>
        <p className="font-data text-[10px] text-white/40 tracking-wider">
          {user?.email}
        </p>
        
        {userProfile?.dominant_archetype && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 border border-white/30 bg-black/40">
            <span className="text-white font-occult">{dominantSymbol}</span>
            <span className="font-data text-[10px] text-white/70 uppercase tracking-wider">
              {userProfile.dominant_archetype} Path
            </span>
          </div>
        )}
      </motion.div>

      {/* About You Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <Link to={createPageUrl('AboutYou')}>
          <GlassCard className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/30 bg-black/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="font-data text-[11px] text-white/80 uppercase tracking-wider">About You</p>
                  <p className="font-data text-[9px] text-white/40">Astral Intelligence Report</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <GlassCard className="p-3 text-center cursor-help relative">
                  <HelpCircle className="w-3 h-3 text-white/30 absolute top-2 right-2" />
                  <div className="text-white/50 text-lg mb-1">✦</div>
                  <p className="text-white font-occult text-2xl">?</p>
                  <p className="font-data text-[8px] text-white/40 uppercase tracking-wider">Rank</p>
                </GlassCard>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] bg-black/90 border-white/20 text-white/80">
              <p className="font-data text-[10px]">Rank is measured by daily use and progress in your growth objectives (C → S)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <GlassCard className="p-3 text-center">
          <div className="text-white/50 text-lg mb-1">◎</div>
          <p className="text-white font-data text-lg">45</p>
          <p className="font-data text-[8px] text-white/40 uppercase tracking-wider">Days</p>
        </GlassCard>
        
        <GlassCard className="p-3 text-center">
          <div className="text-white/50 text-lg mb-1">◈</div>
          <p className="text-white font-data text-lg">12</p>
          <p className="font-data text-[8px] text-white/40 uppercase tracking-wider">Insights</p>
        </GlassCard>
      </motion.div>

      {/* Birth Chart Info */}
      {userProfile?.birth_date && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="p-4">
            <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
              ┌─ SOUL ORIGINS ─┐
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-data text-[10px] text-white/50 uppercase">Birth Date</span>
                <span className="font-data text-xs text-white">
                  {format(new Date(userProfile.birth_date), 'yyyy.MM.dd')}
                </span>
              </div>
              {userProfile.birth_location && (
                <div className="flex justify-between items-center">
                  <span className="font-data text-[10px] text-white/50 uppercase">Location</span>
                  <span className="font-data text-xs text-white">{userProfile.birth_location}</span>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="divide-y divide-white/10">
            {menuItems.map((item) => {
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm">{item.symbol}</span>
                    <span className="font-data text-[11px] text-white/70 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                </>
              );

              if (item.page) {
                return (
                  <Link
                    key={item.action}
                    to={createPageUrl(item.page)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.action}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
                >
                  {content}
                </button>
              );
            })}
          </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full border border-white/20 bg-black/40 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/40 font-data text-xs uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Terminate Session
        </Button>
      </motion.div>

      {/* Version */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        OPERATOR_ID: {user?.id?.slice(0,8) || '00000000'} • SYSTEM v2.1 • CIPHER: ACTIVE
      </div>
    </div>
  );
}