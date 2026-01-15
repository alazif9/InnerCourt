import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/ui/GlassCard';
import StarField from '@/components/ui/StarField';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles, MapPin, Calendar, Loader2 } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome, Seeker',
    subtitle: 'Your journey of self-discovery begins',
    icon: '🌟',
  },
  {
    id: 'birth',
    title: 'When did your soul arrive?',
    subtitle: 'Your birth moment holds cosmic significance',
    icon: '🌙',
    field: 'birth_date',
  },
  {
    id: 'location',
    title: 'Where did you first see light?',
    subtitle: 'Your birth location shapes your chart',
    icon: '🌍',
    field: 'birth_location',
  },
  {
    id: 'intention',
    title: 'What brings you here?',
    subtitle: 'Set your intention for this journey',
    icon: '🔮',
    field: 'intention',
  },
  {
    id: 'complete',
    title: 'Your path awaits',
    subtitle: 'The Tree of Life is ready to reveal itself',
    icon: '☀️',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    birth_date: '',
    birth_location: '',
    intention: '',
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.UserProfile.create({
        ...data,
        onboarding_completed: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      navigate(createPageUrl('Home'));
    },
  });

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      createProfileMutation.mutate(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    if (step.field) {
      return formData[step.field]?.trim().length > 0;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <StarField />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Progress Dots */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep 
                  ? 'bg-amber-400' 
                  : i < currentStep 
                    ? 'bg-purple-500' 
                    : 'bg-white/20'
              }`}
              animate={i === currentStep ? {
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0 rgba(251, 191, 36, 0)',
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                  '0 0 0 rgba(251, 191, 36, 0)',
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Background decoration */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          <svg className="w-full h-full" viewBox="0 0 400 800">
            <circle cx="200" cy="400" r="150" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
            <circle cx="200" cy="400" r="200" stroke="#7C3AED" strokeWidth="0.5" fill="none" />
            <circle cx="200" cy="400" r="250" stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeDasharray="5 5" />
          </svg>
        </motion.div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <GlassCard glowColor={currentStep === steps.length - 1 ? 'gold' : 'purple'} className="p-8">
              {/* Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.2)',
                    '0 0 40px rgba(124, 58, 237, 0.3)',
                    '0 0 20px rgba(212, 175, 55, 0.2)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-4xl">{step.icon}</span>
              </motion.div>

              {/* Text */}
              <h2 className="font-['Cinzel',serif] text-xl text-white text-center font-semibold mb-2">
                {step.title}
              </h2>
              <p className="text-white/60 text-sm text-center mb-6">
                {step.subtitle}
              </p>

              {/* Input Fields */}
              {step.id === 'birth' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      type="datetime-local"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="bg-white/5 border-white/10 text-white pl-10 [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}

              {step.id === 'location' && (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="City, Country"
                    value={formData.birth_location}
                    onChange={(e) => setFormData({ ...formData, birth_location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder-white/40 pl-10"
                  />
                </div>
              )}

              {step.id === 'intention' && (
                <div className="relative">
                  <Sparkles className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <textarea
                    placeholder="I seek to understand..."
                    value={formData.intention}
                    onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 pl-10 pr-4 py-3 rounded-md min-h-[100px] resize-none outline-none focus:border-white/20"
                  />
                </div>
              )}

              {/* Complete state */}
              {step.id === 'complete' && (
                <div className="py-4">
                  <motion.div
                    className="w-32 h-32 mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.3" />
                      <circle cx="50" cy="20" r="8" fill="#D4AF37" opacity="0.6" />
                      <circle cx="25" cy="40" r="6" fill="#8B4513" opacity="0.6" />
                      <circle cx="75" cy="40" r="6" fill="#DC2626" opacity="0.6" />
                      <circle cx="35" cy="65" r="5" fill="#374151" opacity="0.6" />
                      <circle cx="65" cy="65" r="5" fill="#7C3AED" opacity="0.6" />
                      <circle cx="50" cy="80" r="4" fill="#FBBF24" opacity="0.6" />
                    </svg>
                  </motion.div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-4">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || createProfileMutation.isPending}
            className="bg-gradient-to-r from-amber-500 to-purple-500 text-white px-8 hover:opacity-90 disabled:opacity-50"
          >
            {createProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentStep === steps.length - 1 ? (
              <>
                Begin Journey
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}