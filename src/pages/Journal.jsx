import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { Plus, Calendar, ChevronRight, Book } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const archetypes = ['SOL', 'SAGE', 'HERO', 'MOTHER', 'SHADOW', 'ANIMA', 'CHILD', 'TRICKSTER'];
const archetypeSymbols = {
  SOL: '☉', SAGE: '☿', HERO: '♂', MOTHER: '☽', 
  SHADOW: '♄', ANIMA: '♀', CHILD: '☆', TRICKSTER: '☌'
};
const moods = [
  { value: 'transcendent', label: 'Transcendent', symbol: '△', color: '#ffffff' },
  { value: 'peaceful', label: 'Peaceful', symbol: '◯', color: '#cccccc' },
  { value: 'curious', label: 'Curious', symbol: '◈', color: '#aaaaaa' },
  { value: 'challenged', label: 'Challenged', symbol: '⬡', color: '#888888' },
  { value: 'struggling', label: 'Struggling', symbol: '◐', color: '#666666' },
  { value: 'transforming', label: 'Transforming', symbol: '∞', color: '#dddddd' },
];

export default function Journal() {
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    archetype: '',
    mood: '',
  });
  
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      const results = await base44.entities.JournalEntry.filter(
        { created_by: user?.email },
        '-created_date',
        20
      );
      return results;
    },
    enabled: !!user?.email,
  });

  const createMutation = useMutation({
    mutationFn: (entry) => base44.entities.JournalEntry.create(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      setShowForm(false);
      setNewEntry({ title: '', content: '', archetype: '', mood: '' });
    },
  });

  const handleSubmit = () => {
    if (!newEntry.content.trim()) return;
    createMutation.mutate(newEntry);
  };

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
          Soul Chronicle
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Consciousness Archive
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>ENTRIES:</span>
          <span className="text-white">{entries.length}</span>
          <span className="text-white/20">•</span>
          <span>PROTOCOL:</span>
          <span className="text-white">HERMETIC_LOG</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* New Entry Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-black/60 hover:bg-black/80 text-white border border-white/40 font-data text-xs tracking-wider"
          style={{ boxShadow: '0 0 15px rgba(255,255,255,0.15)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          NEW TRANSMISSION
        </Button>
      </motion.div>

      {/* New Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard glowColor="gold" className="p-4 space-y-4">
              <div className="font-data text-[8px] text-white/70/60 uppercase tracking-widest mb-2">
                ┌─ NEW ENTRY PROTOCOL ─┐
              </div>
              
              <Input
                placeholder="TRANSMISSION TITLE (OPTIONAL)"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="bg-black/40 border-white/30 text-white placeholder-white/30 font-data text-xs"
              />
              
              <Textarea
                placeholder="Record consciousness data..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="bg-black/40 border-white/30 text-white placeholder-white/30 min-h-[100px] resize-none font-data text-xs"
              />
              
              <div className="flex gap-3">
                <Select
                  value={newEntry.archetype}
                  onValueChange={(value) => setNewEntry({ ...newEntry, archetype: value })}
                >
                  <SelectTrigger className="bg-black/40 border-white/30 text-white font-data text-xs">
                    <SelectValue placeholder="NODE" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/30">
                    {archetypes.map((arch) => (
                      <SelectItem key={arch} value={arch} className="text-white hover:bg-white/10 font-data text-xs">
                        <span className="text-white mr-2">{archetypeSymbols[arch]}</span>
                        {arch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                >
                  <SelectTrigger className="bg-black/40 border-white/30 text-white font-data text-xs">
                    <SelectValue placeholder="STATE" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/30">
                    {moods.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value} className="text-white hover:bg-white/10 font-data text-xs">
                        <span style={{ color: mood.color }} className="mr-2">{mood.symbol}</span>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="text-white/40 hover:text-white hover:bg-white/5 font-data text-xs"
                >
                  ABORT
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!newEntry.content.trim() || createMutation.isPending}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-data text-xs"
                >
                  {createMutation.isPending ? 'ENCODING...' : 'TRANSMIT'}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-3 mt-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        ) : entries.length === 0 ? (
          <GlassCard glowColor="gold" className="p-8 text-center">
            <div className="text-3xl text-white/30 mb-3">◈</div>
            <p className="text-white/50 font-data text-xs uppercase tracking-wider">Archive Empty</p>
            <p className="text-white/30 font-data text-[10px] mt-1">Initialize first transmission</p>
          </GlassCard>
        ) : (
          entries.map((entry, i) => {
            const moodData = moods.find(m => m.value === entry.mood);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard glowColor="gold" className="p-3 hover:border-white/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    {/* Archetype Symbol */}
                    <div 
                      className="w-10 h-10 rounded border border-white/30 bg-black/40 flex items-center justify-center flex-shrink-0"
                      style={{ boxShadow: '0 0 10px rgba(255,255,255,0.1)' }}
                    >
                      <span className="text-white text-lg font-occult">
                        {entry.archetype ? archetypeSymbols[entry.archetype] : '◇'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex items-center gap-2 mb-1">
                        {entry.title ? (
                          <h3 className="text-white/90 font-occult text-sm truncate">
                            {entry.title}
                          </h3>
                        ) : (
                          <span className="text-white/50 font-data text-[10px] uppercase">
                            Untitled Entry
                          </span>
                        )}
                        {moodData && (
                          <span 
                            className="text-sm"
                            style={{ color: moodData.color }}
                          >
                            {moodData.symbol}
                          </span>
                        )}
                      </div>
                      
                      {/* Content preview */}
                      <p className="text-white/50 font-data text-[11px] line-clamp-2 mb-2 leading-relaxed">
                        {entry.content}
                      </p>
                      
                      {/* Meta row */}
                      <div className="flex items-center gap-3 font-data text-[9px] text-white/30">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.created_date), 'yyyy.MM.dd')}
                        </span>
                        <span className="text-white/20">•</span>
                        <span>{format(new Date(entry.created_date), 'HH:mm')}</span>
                        {entry.archetype && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-white/60">{entry.archetype}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 group-hover:text-white/60 transition-colors" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Bottom micro-text */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        CHRONICLE_ID: SOL-{user?.id?.slice(0,8) || '00000000'} • CIPHER: ACTIVE
      </div>
    </div>
  );
}