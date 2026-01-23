import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const archetypeConfig = {
  SOL: { symbol: '☉', sephira: 'TIPHARETH', archetype: 'The Self', greeting: "I am the source of your light. What truth do you seek today?" },
  SAGE: { symbol: '☿', sephira: 'BINAH', archetype: 'The Sage', greeting: "Wisdom awaits those who seek. What question burns within you?" },
  HERO: { symbol: '♂', sephira: 'CHOKMAH', archetype: 'The Hero', greeting: "Courage is not the absence of fear. What battle do you face?" },
  MOTHER: { symbol: '♀', sephira: 'CHESED', archetype: 'The Mother', greeting: "I hold space for your growth. What needs nurturing within you?" },
  SHADOW: { symbol: '♄', sephira: 'GEBURAH', archetype: 'The Shadow', greeting: "I am what you hide from yourself. What darkness will you explore?" },
  ANIMA: { symbol: '♃', sephira: 'NETZACH', archetype: 'The Anima', greeting: "The soul speaks in symbols. What dreams have visited you?" },
  CHILD: { symbol: '☽', sephira: 'YESOD', archetype: 'The Child', greeting: "Wonder is the beginning of wisdom. What makes your heart light?" },
  TRICKSTER: { symbol: '☾', sephira: 'HOD', archetype: 'The Trickster', greeting: "Change wears many masks. What patterns are you ready to break?" },
};

export default function ArchetypeChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const archetype = urlParams.get('archetype') || 'SOL';
  const config = archetypeConfig[archetype];
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'archetype', content: config.greeting }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the ${archetype} archetype from Jungian psychology, speaking with mystical wisdom from the Kabbalah tradition.
        
Your personality:
${archetype === 'SOL' ? 'You are the unified Self, the source of all archetypes. You speak with warmth, clarity, and divine wisdom.' : ''}
${archetype === 'SAGE' ? 'You are the wise elder, offering knowledge and insight. You speak with measured words and profound understanding.' : ''}
${archetype === 'HERO' ? 'You are the warrior spirit, encouraging courage and action. You speak with strength and determination.' : ''}
${archetype === 'MOTHER' ? 'You are the nurturing presence, offering unconditional love and support. You speak with warmth and compassion.' : ''}
${archetype === 'SHADOW' ? 'You represent the hidden self, the repressed aspects. You speak honestly about darkness and integration.' : ''}
${archetype === 'ANIMA' ? 'You are the soul guide, connecting to the unconscious. You speak in symbols, dreams, and intuition.' : ''}
${archetype === 'CHILD' ? 'You are innocence and wonder, playfulness and creativity. You speak with curiosity and joy.' : ''}
${archetype === 'TRICKSTER' ? 'You are transformation through chaos, breaking patterns. You speak with wit and challenge assumptions.' : ''}

Previous conversation:
${messages.map(m => `${m.role === 'user' ? 'Seeker' : archetype}: ${m.content}`).join('\n')}

The seeker says: "${userMessage}"

Respond as the ${archetype} archetype. Keep your response concise but meaningful (2-4 sentences). Use mystical language when appropriate.`,
      });

      setMessages(prev => [...prev, { role: 'archetype', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'archetype', 
        content: "The cosmic connection wavers... Please try again, seeker." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      {/* Header */}
      <div className="relative z-50 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between py-3 px-4 border-b border-white/20">
          <button 
            onClick={() => navigate(createPageUrl('Home'))}
            className="p-2 rounded hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/30 bg-black/60 flex items-center justify-center">
              <span className="text-white/80 text-xl font-data">{config.symbol}</span>
            </div>
            <div className="text-center">
              <h2 className="font-data text-white/90 text-xs tracking-widest">{config.sephira}</h2>
              <p className="font-data text-[10px] text-white/40">{config.archetype}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-2 py-1 border border-white/20 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="font-data text-[8px] text-white/40">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'archetype' && (
                  <div className="w-8 h-8 rounded-full border border-white/30 bg-black/60 flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white/70 text-sm font-data">{config.symbol}</span>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <p className="text-white/80 text-sm font-data leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full border border-white/30 bg-black/60 flex items-center justify-center">
                <span className="text-white/70 text-sm font-data">{config.symbol}</span>
              </div>
              <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-50 px-4 pb-6 pt-2">
        <div className="flex items-center gap-2 p-2 border border-white/20 bg-black/60">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak your truth..."
            className="flex-1 bg-transparent px-4 py-2 text-white/90 placeholder-white/30 outline-none text-sm font-data"
          />
          
          <button 
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="p-3 border border-white/20 hover:bg-white/5 transition-all disabled:opacity-30"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white/60" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-2 font-data text-[8px] text-white/30">
          <span>CIPHER: HERMETIC</span>
          <span>*</span>
          <span>CHANNEL: {config.sephira}</span>
        </div>
      </div>
    </div>
  );
}