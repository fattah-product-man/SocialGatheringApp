import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Guest } from '../lib/db';
import { Sparkles, ChevronDown, Instagram, User } from 'lucide-react';

interface UserProfileModalProps {
  guest: Guest | null;
  currentUser?: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  matchData?: {
    score?: number;
    reason?: string;
    commonInterests?: string[];
    conversationStarters?: string[];
  };
}

export function UserProfileModal({ guest, currentUser, isOpen, onClose, matchData }: UserProfileModalProps) {
  if (!isOpen || !guest) return null;

  // Calculate shared interests if not provided in matchData
  const sharedInterests = matchData?.commonInterests || (currentUser?.interests?.filter(i => guest.interests?.includes(i)) || []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 overflow-hidden relative max-h-[90vh] flex flex-col"
          >
            <div className="relative h-48 bg-stone-100">
              {guest.avatar_url ? (
                <img src={guest.avatar_url} alt={guest.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                  <User className="w-24 h-24 text-stone-400" />
                </div>
              )}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
                <h2 className="text-3xl font-black text-white">{guest.name}</h2>
                {guest.instagram && (
                  <a 
                    href={`https://instagram.com/${guest.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 font-bold mt-1 hover:text-white transition-colors w-fit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-4 h-4" />
                    @{guest.instagram.replace('@', '')}
                  </a>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Connection to Hashem */}
              {guest.answers && guest.answers['hashem_connection'] && (
                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Knows Hashem from</p>
                  <p className="text-indigo-900 font-bold text-lg">
                    {guest.answers['hashem_connection']}
                  </p>
                </div>
              )}

              {/* Common Interests */}
              {sharedInterests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Common Vibe
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sharedInterests.map((interest: string) => (
                      <span key={interest} className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* All Interests */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">All Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {guest.interests.map((interest: string) => (
                    <span 
                      key={interest} 
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
                        sharedInterests.includes(interest)
                          ? 'hidden' // Already shown above
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Data / Conversation Starters */}
              {matchData?.conversationStarters && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Conversation Starters</h3>
                  <div className="space-y-2">
                    {matchData.conversationStarters.map((point, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-stone-50 rounded-xl">
                        <span className="text-lg">💬</span>
                        <p className="text-sm text-stone-700 font-medium">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
