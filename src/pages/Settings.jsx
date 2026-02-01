import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { 
  ArrowLeft, Download, HelpCircle, Info, 
  ChevronRight, FileText, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const settingsItems = [
  { icon: Download, label: 'EXPORT DATA', action: 'export', symbol: '⬡', description: 'Download your journal & insights' },
  { icon: FileText, label: 'TERMS OF SERVICE', action: 'terms', symbol: '◈', description: 'Legal documentation', page: 'TermsOfService' },
  { icon: HelpCircle, label: 'HELP & SUPPORT', action: 'help', symbol: '?', description: 'FAQs and contact', page: 'HelpSupport' },
  { icon: Info, label: 'ABOUT', action: 'about', symbol: 'ℹ', description: 'App version and credits' },
];

export default function Settings() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const handleExportData = async () => {
    // Placeholder for data export functionality
    alert('Data export feature coming soon');
  };

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Link 
          to={createPageUrl('Profile')}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-data text-[10px] uppercase tracking-wider">Back to Profile</span>
        </Link>
        
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide text-center">
          Settings
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase text-center">
          System Configuration
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ⚙ ✦ ⚙ ⟩
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="divide-y divide-white/10">
          {settingsItems.map((item) => {
            const content = (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm">{item.symbol}</span>
                  <div className="text-left">
                    <span className="font-data text-[11px] text-white/70 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className="font-data text-[9px] text-white/40">
                      {item.description}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </>
            );

            if (item.page) {
              return (
                <Link
                  key={item.action}
                  to={createPageUrl(item.page)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.action}
                onClick={item.action === 'export' ? handleExportData : undefined}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
              >
                {content}
              </button>
            );
          })}
        </GlassCard>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ SYSTEM INFO ─┐
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-data text-[10px] text-white/50 uppercase">Version</span>
              <span className="font-data text-xs text-white">2.1.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-data text-[10px] text-white/50 uppercase">Protocol</span>
              <span className="font-data text-xs text-white">HERMETIC_V2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-data text-[10px] text-white/50 uppercase">Operator</span>
              <span className="font-data text-xs text-white">{user?.email || 'Unknown'}</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Footer */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        THE GREAT WORK • EST. MMXXVI • ALL RIGHTS RESERVED
      </div>
    </div>
  );
}