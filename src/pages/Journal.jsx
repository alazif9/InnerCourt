import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { Plus, Calendar, ChevronRight, Sparkles, Book } from 'lucide-react';
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
const moods = [
  { value: 'transcendent', label: '✨ Transcendent', color: 'amber' },
  { value: 'peaceful', label: '🌸 Peaceful', color: 'pink' },
  { value: 'curious', label: '🔮 Curious', color: 'purple' },
  { value: 'challenged', label: '⚔️ Challenged', color: 'red' },
  { value: 'struggling', label: '🌑 Struggling', color: 'slate' },
  { value: 'transforming', label: '🦋 Transforming', color: 'emerald' },
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-['Cinzel',serif] text-2xl font-semibold text-white">
            Soul Journal
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Record your inner journey
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
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
            <GlassCard className="p-5 space-y-4">
              <Input
                placeholder="Title (optional)"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder-white/40"
              />
              
              <Textarea
                placeholder="What's arising in your consciousness today?"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder-white/40 min-h-[120px] resize-none"
              />
              
              <div className="flex gap-3">
                <Select
                  value={newEntry.archetype}
                  onValueChange={(value) => setNewEntry({ ...newEntry, archetype: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Archetype" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    {archetypes.map((arch) => (
                      <SelectItem key={arch} value={arch} className="text-white hover:bg-white/10">
                        {arch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Mood" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    {moods.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value} className="text-white hover:bg-white/10">
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!newEntry.content.trim() || createMutation.isPending}
                  className="bg-gradient-to-r from-amber-500 to-purple-500 text-white hover:opacity-90"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-amber-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        ) : entries.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Book className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Your journal awaits its first entry</p>
            <p className="text-white/40 text-sm mt-1">Start documenting your inner journey</p>
          </GlassCard>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-4 hover:bg-white/[0.08] transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.title && (
                        <h3 className="text-white font-medium truncate">
                          {entry.title}
                        </h3>
                      )}
                      {entry.mood && (
                        <span className="text-sm">
                          {moods.find(m => m.value === entry.mood)?.label.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-white/60 text-sm line-clamp-2 mb-2">
                      {entry.content}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(entry.created_date), 'MMM d, yyyy')}
                      </span>
                      {entry.archetype && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10">
                          {entry.archetype}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}