import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    display_name: '',
    about: '',
    birth_date: '',
    birth_location: '',
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        about: userProfile.about || '',
        birth_date: userProfile.birth_date ? userProfile.birth_date.split('T')[0] : '',
        birth_location: userProfile.birth_location || '',
      });
    }
  }, [userProfile]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (userProfile?.id) {
        return base44.entities.UserProfile.update(userProfile.id, data);
      } else {
        return base44.entities.UserProfile.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      navigate(createPageUrl('Profile'));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      display_name: formData.display_name || null,
      about: formData.about || null,
      birth_date: formData.birth_date ? new Date(formData.birth_date).toISOString() : null,
      birth_location: formData.birth_location || null,
    });
  };

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Link 
          to={createPageUrl('Profile')} 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-data text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO PROFILE
        </Link>
        
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide text-center">
          Edit Profile
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase text-center">
          Soul Configuration
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◇ ✦ ◇ ⟩
        </div>
      </motion.div>

      {profileLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                ┌─ OPERATOR IDENTITY ─┐
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="font-data text-[10px] text-white/60 uppercase tracking-wider">
                    Display Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="mt-1.5 bg-black/40 border-white/20 text-white font-data text-sm placeholder:text-white/30 focus:border-white/50"
                  />
                  <p className="font-data text-[9px] text-white/30 mt-1">
                    How the system will address you
                  </p>
                </div>
                <div>
                  <Label className="font-data text-[10px] text-white/60 uppercase tracking-wider">
                    About You
                  </Label>
                  <Textarea
                    placeholder="Tell us about yourself - your goals, challenges, what you're working on..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="mt-1.5 bg-black/40 border-white/20 text-white font-data text-sm placeholder:text-white/30 focus:border-white/50 min-h-[100px]"
                  />
                  <p className="font-data text-[9px] text-white/30 mt-1">
                    This information helps the archetypes guide you better
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Birth Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="p-4">
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                ┌─ TEMPORAL ORIGIN ─┐
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="font-data text-[10px] text-white/60 uppercase tracking-wider">
                    Birth Date & Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="mt-1.5 bg-black/40 border-white/20 text-white font-data text-sm focus:border-white/50"
                  />
                  <p className="font-data text-[9px] text-white/30 mt-1">
                    Required for accurate celestial calculations
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Birth Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-4">
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                ┌─ SPATIAL ORIGIN ─┐
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="font-data text-[10px] text-white/60 uppercase tracking-wider">
                    Birth Location
                  </Label>
                  <Input
                    type="text"
                    placeholder="City, Country"
                    value={formData.birth_location}
                    onChange={(e) => setFormData({ ...formData, birth_location: e.target.value })}
                    className="mt-1.5 bg-black/40 border-white/20 text-white font-data text-sm placeholder:text-white/30 focus:border-white/50"
                  />
                  <p className="font-data text-[9px] text-white/30 mt-1">
                    Used for house calculations and ascendant
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full border border-white/30 bg-white/10 text-white hover:bg-white/20 font-data text-xs uppercase tracking-wider"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </motion.div>
        </form>
      )}

      {/* Footer */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-4">
        PROFILE_EDITOR • CIPHER: ACTIVE
      </div>
    </div>
  );
}