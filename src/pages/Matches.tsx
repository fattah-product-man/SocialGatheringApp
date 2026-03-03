import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, Event, Guest } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { getSampleGuests } from '../lib/sampleData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { UserProfileModal } from '../components/UserProfileModal';
import { Avatar } from '../components/Avatar';

interface MatchExplanation {
  common: string[];
  why_short: string;
  more: string[];
}

export function Matches() {
  const { eventId } = useParams<{ eventId: string }>();
  const token = useGuestToken();
  const [event, setEvent] = useState<Event | null>(null);
  const [matches, setMatches] = useState<Guest[]>([]);
  const [me, setMe] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [explanations, setExplanations] = useState<Record<string, MatchExplanation>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<Guest | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (eventId && token) {
      Promise.all([
        db.getEvent(eventId),
        db.getGuests(eventId),
        db.getGuest(eventId, token)
      ]).then(([e, guests, myself]) => {
        setEvent(e);
        setMe(myself);
        setIsRevealed(e?.reveal_matches || false);
        
        if (myself) {
          let potentialMatches = guests.filter(g => g.guest_token !== token);
          
          if (potentialMatches.length === 0) {
            potentialMatches = getSampleGuests(eventId);
          }

          const scored = potentialMatches
            .map(g => {
              let score = 0;
              const sharedInterests = g.interests.filter(i => myself.interests.includes(i));
              const sharedGoals = g.goals.filter(gl => myself.goals.includes(gl));
              
              score += sharedInterests.length * 3;
              score += sharedGoals.length * 2;
              if (g.energy_level === myself.energy_level) score += 1;
              score += Math.random(); // Tie-breaker

              return { ...g, score, sharedInterests, sharedGoals };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
          
          setMatches(scored);
        }
        setLoading(false);
      });
    }
  }, [eventId, token]);

  const fetchExplanation = async (match: Guest) => {
    if (explanations[match.id] || generating[match.id] || !me || !event) return;

    setGenerating(prev => ({ ...prev, [match.id]: true }));
    try {
      const res = await fetch('/api/explain-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viewer: me,
          match: match,
          hostName: event.host_name
        })
      });
      const data = await res.json();
      setExplanations(prev => ({ ...prev, [match.id]: data }));
    } catch (err) {
      console.error("Failed to explain match", err);
    } finally {
      setGenerating(prev => ({ ...prev, [match.id]: false }));
    }
  };

  useEffect(() => {
    if (isRevealed && matches.length > 0 && me) {
      matches.forEach(m => fetchExplanation(m));
    }
  }, [isRevealed, matches, me]);

  if (loading) return <div className="p-8 text-center text-stone-400">Finding your tribe...</div>;

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-2 pt-4">
        <h1 className="text-4xl font-bold text-[#1D1D1F] tracking-tight">Your Matches</h1>
        <p className="text-[#86868b] font-medium text-lg">Based on your vibe & interests</p>
      </header>

      <div className="space-y-6 relative">
        {/* Unlock Button if not revealed */}
        {!isRevealed && (
          <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center text-center p-6 rounded-3xl border border-white/50 shadow-xl">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Locked until Hashem reveals 👀</h2>
            <p className="text-[#86868b] mb-6">Wait for the signal!</p>
            <Button 
              onClick={() => setIsRevealed(true)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30"
            >
              Unlock Matches 🔓
            </Button>
          </div>
        )}

        {matches.map((match, idx) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
          >
            <Card 
              className="p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group bg-white rounded-3xl"
              onClick={() => setSelectedMatch(match)}
            >
              {/* Header Gradient */}
              <div className="h-24 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative">
                 <div className="absolute -bottom-10 left-6 border-4 border-white rounded-full overflow-hidden w-20 h-20 shadow-md bg-white">
                    <Avatar src={match.avatar_url} name={match.name} size="full" className="w-full h-full rounded-none" />
                 </div>
              </div>

              <div className="pt-12 px-6 pb-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-stone-800">{match.name}</h3>
                  {match.answers && match.answers['hashem_connection'] && (
                    <p className="text-sm font-medium text-stone-500 flex items-center gap-1">
                      <span className="text-stone-400">Knows Hashem from:</span>
                      <span className="text-stone-700">{match.answers['hashem_connection']}</span>
                    </p>
                  )}
                </div>

                {/* Common Interests */}
                {(match as any).sharedInterests && (match as any).sharedInterests.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">You both love</p>
                    <div className="flex flex-wrap gap-2">
                      {(match as any).sharedInterests.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold border border-violet-100">
                          {tag}
                        </span>
                      ))}
                      {(match as any).sharedInterests.length > 3 && (
                        <span className="bg-stone-50 text-stone-500 px-3 py-1 rounded-full text-xs font-bold border border-stone-100">
                          +{(match as any).sharedInterests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Explanation (if revealed) */}
                {isRevealed && explanations[match.id] ? (
                  <div className="bg-stone-50 rounded-xl p-3 text-sm text-stone-600 leading-relaxed border border-stone-100">
                    {explanations[match.id].why_short}
                  </div>
                ) : isRevealed ? (
                   <div className="h-16 flex items-center justify-center text-stone-400 text-xs">
                     Loading vibe check...
                   </div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <UserProfileModal 
        guest={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchData={selectedMatch && explanations[selectedMatch.id] ? {
            commonInterests: (selectedMatch as any).sharedInterests,
            conversationStarters: explanations[selectedMatch.id].more
        } : undefined}
      />
    </div>
  );
}
