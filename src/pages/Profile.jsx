import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { 
  User, Settings, Moon, Bell, Shield, LogOut, 
  ChevronRight, Star, Calendar, Sparkles 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: User, label: 'Edit Profile', action: 'profile' },
  { icon: Bell, label: 'Notifications', action: 'notifications' },
  { icon: Moon, label: 'Appearance', action: 'appearance' },
  { icon: Shield, label: 'Privacy', action: 'privacy' },
  { icon: Settings, label: 'Settings', action: 'settings' },
];

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

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/30 to-purple-500/30 border-2 border-white/20 flex items-center justify-center mx-auto overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white/60" />
            )}
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 10px rgba(251, 191, 36, 0.3)',
                '0 0 20px rgba(251, 191, 36, 0.5)',
                '0 0 10px rgba(251, 191, 36, 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">☀️</span>
          </motion.div>
        </div>
        
        <h1 className="font-['Cinzel',serif] text-xl font-semibold text-white mt-4">
          {user?.full_name || 'Seeker'}
        </h1>
        <p className="text-white/50 text-sm">
          {user?.email}
        </p>
        
        {userProfile?.dominant_archetype && (
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-purple-300 text-sm">
              {userProfile.dominant_archetype} Path
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <GlassCard className="p-3 text-center">
          <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-white font-bold">Level 7</p>
          <p className="text-white/40 text-xs">Awareness</p>
        </GlassCard>
        
        <GlassCard className="p-3 text-center">
          <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-white font-bold">45</p>
          <p className="text-white/40 text-xs">Days Active</p>
        </GlassCard>
        
        <GlassCard className="p-3 text-center">
          <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-white font-bold">12</p>
          <p className="text-white/40 text-xs">Insights</p>
        </GlassCard>
      </motion.div>

      {/* Birth Chart Info */}
      {userProfile?.birth_date && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard glowColor="purple" className="p-4">
            <h3 className="font-['Cinzel',serif] text-purple-400 font-medium mb-3">
              Soul Origins
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Birth Date</span>
                <span className="text-white">
                  {format(new Date(userProfile.birth_date), 'MMMM d, yyyy')}
                </span>
              </div>
              {userProfile.birth_location && (
                <div className="flex justify-between">
                  <span className="text-white/50">Location</span>
                  <span className="text-white">{userProfile.birth_location}</span>
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
        <GlassCard className="divide-y divide-white/5">
          {menuItems.map((item, i) => (
            <button
              key={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-white/50" />
                <span className="text-white/80">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" />
            </button>
          ))}
        </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>

      {/* Version */}
      <p className="text-center text-white/20 text-xs pb-4">
        SOL System v1.0 • Crafted with 🌟
      </p>
    </div>
  );
}