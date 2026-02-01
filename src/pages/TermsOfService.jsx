import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using The Great Work application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, please discontinue use immediately.'
  },
  {
    title: 'Use of Service',
    content: 'The Great Work is a personal development tool designed for self-reflection and growth. You agree to use this service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account.'
  },
  {
    title: 'User Content',
    content: 'You retain ownership of all content you create, including journal entries, insights, and personal data. By using our service, you grant us a limited license to store and process this data solely for the purpose of providing our services to you.'
  },
  {
    title: 'Privacy & Data',
    content: 'Your privacy is sacred to us. We collect only the data necessary to provide our services. Your personal reflections, journal entries, and insights are encrypted and never shared with third parties without your explicit consent.'
  },
  {
    title: 'Intellectual Property',
    content: 'The Great Work, including its design, archetypes, and methodology, is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.'
  },
  {
    title: 'Disclaimer',
    content: 'The Great Work is a tool for self-exploration and is not a substitute for professional mental health services. If you are experiencing a mental health crisis, please seek help from a qualified professional.'
  },
  {
    title: 'Modifications',
    content: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of significant changes.'
  },
];

export default function TermsOfService() {
  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Link 
          to={createPageUrl('Settings')}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-data text-[10px] uppercase tracking-wider">Back to Settings</span>
        </Link>
        
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide text-center">
          Terms of Service
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase text-center">
          Sacred Contract
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Terms Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {sections.map((section, index) => (
          <GlassCard key={index} className="p-4">
            <div className="font-data text-[10px] text-white/70 uppercase tracking-widest mb-2">
              {section.title}
            </div>
            <p className="font-data text-[10px] text-white/50 leading-relaxed">
              {section.content}
            </p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        LAST UPDATED: FEBRUARY 2026 • VERSION 2.1
      </div>
    </div>
  );
}