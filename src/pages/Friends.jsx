import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, UserCheck, Clock, X } from 'lucide-react';

const archetypeSymbols = {
  SOL: '☉', SAGE: '☿', HERO: '♂', MOTHER: '☽',
  SHADOW: '♄', ANIMA: '♀', CHILD: '☆', TRICKSTER: '☌'
};

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.email],
    queryFn: async () => {
      const sent = await base44.entities.Friend.filter({ user_email: user?.email, status: 'accepted' });
      const received = await base44.entities.Friend.filter({ friend_email: user?.email, status: 'accepted' });
      return [...sent, ...received];
    },
    enabled: !!user?.email,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', user?.email],
    queryFn: async () => {
      return base44.entities.Friend.filter({ friend_email: user?.email, status: 'pending' });
    },
    enabled: !!user?.email,
  });

  const sendRequestMutation = useMutation({
    mutationFn: async (targetUser) => {
      return base44.entities.Friend.create({
        user_email: user.email,
        friend_email: targetUser.email,
        friend_name: targetUser.full_name,
        friend_handle: targetUser.handle,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      setSearchResults([]);
      setSearchQuery('');
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (request) => {
      return base44.entities.Friend.update(request.id, { status: 'accepted' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  const declineRequestMutation = useMutation({
    mutationFn: async (request) => {
      return base44.entities.Friend.delete(request.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    const query = searchQuery.startsWith('@') ? searchQuery.slice(1) : searchQuery;
    const isEmail = query.includes('@');
    
    let results = [];
    if (isEmail) {
      results = await base44.entities.User.filter({ email: query });
    } else {
      results = await base44.entities.User.filter({ handle: query });
    }
    
    // Filter out current user and existing friends
    const friendEmails = friends.map(f => f.friend_email === user?.email ? f.user_email : f.friend_email);
    results = results.filter(r => r.email !== user?.email && !friendEmails.includes(r.email));
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const getFriendDisplay = (friend) => {
    if (friend.user_email === user?.email) {
      return { email: friend.friend_email, name: friend.friend_name, handle: friend.friend_handle };
    }
    return { email: friend.user_email, name: friend.friend_name, handle: friend.friend_handle };
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
          Social Nexus
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Connection Resonance Network
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>CONNECTIONS:</span>
          <span className="text-white">{friends.length}</span>
          <span className="text-white/20">•</span>
          <span>PENDING:</span>
          <span className="text-white">{pendingRequests.length}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-2">
            ┌─ OPERATOR_SEARCH ─┐
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="@handle or email..."
                className="bg-black/60 border-white/20 text-white font-data text-sm pl-8 placeholder:text-white/30"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-white/10 border border-white/30 hover:bg-white/20 text-white font-data text-xs uppercase"
            >
              {isSearching ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
          
          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                <div className="font-data text-[8px] text-white/40 uppercase">
                  {searchResults.length} RESULT(S) FOUND
                </div>
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between p-3 border border-white/10 bg-black/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-white/30 bg-black/60 flex items-center justify-center">
                        <span className="text-white/60">
                          {archetypeSymbols[result.dominant_archetype] || '◈'}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-data text-sm">{result.full_name}</div>
                        <div className="font-data text-[10px] text-white/40">
                          @{result.handle || result.email?.split('@')[0]}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => sendRequestMutation.mutate(result)}
                      size="sm"
                      className="bg-white/10 border border-white/30 hover:bg-white/20 text-white"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard className="p-4">
            <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
              ┌─ INCOMING_REQUESTS ─┐
            </div>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border border-white/20 bg-black/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/30 bg-black/60 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <div className="text-white font-data text-sm">{request.friend_name || 'Unknown'}</div>
                      <div className="font-data text-[10px] text-white/40">{request.user_email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => acceptRequestMutation.mutate(request)}
                      size="sm"
                      className="bg-white/20 border border-white/40 hover:bg-white/30 text-white"
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => declineRequestMutation.mutate(request)}
                      size="sm"
                      variant="ghost"
                      className="text-white/40 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Friends List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ CONNECTED_OPERATORS ─┐
          </div>
          
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-white/30 text-2xl mb-2">◎</div>
              <div className="font-data text-xs text-white/40">NO CONNECTIONS ESTABLISHED</div>
              <div className="font-data text-[10px] text-white/30 mt-1">
                Use search to find operators
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => {
                const display = getFriendDisplay(friend);
                return (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 border border-white/10 bg-black/40 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-white/30 bg-black/60 flex items-center justify-center">
                        <span className="text-white/60">◈</span>
                      </div>
                      <div>
                        <div className="text-white font-data text-sm">{display.name || 'Operator'}</div>
                        <div className="font-data text-[10px] text-white/40">
                          @{display.handle || display.email?.split('@')[0]}
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-white/60"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Footer */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        NETWORK_ID: SOC-{user?.id?.slice(0,6) || '000000'} • PROTOCOL: P2P_V1 • ENCRYPTION: ACTIVE
      </div>
    </div>
  );
}