import React, { useEffect, useState } from 'react';
import { db, Score } from '../lib/db';
import { useParams } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export function Leaderboard({ gameId }: { gameId: string }) {
  const { eventId } = useParams<{ eventId: string }>();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      db.getLeaderboard(eventId, gameId).then(data => {
        setScores(data);
        setLoading(false);
      });
    }
  }, [eventId, gameId]);

  if (loading) return <div className="text-center text-slate-400 text-sm">Loading leaderboard...</div>;

  if (scores.length === 0) return <div className="text-center text-slate-500 text-sm">No scores yet. Be the first!</div>;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 w-full max-w-sm mx-auto mt-6">
      <div className="flex items-center gap-2 mb-4 text-yellow-400 font-bold uppercase text-xs tracking-wider">
        <Trophy className="w-4 h-4" /> Leaderboard
      </div>
      <div className="space-y-2">
        {scores.map((score, index) => (
          <div key={score.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-lg">
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold w-6 text-center ${
                index === 0 ? 'text-yellow-400' : 
                index === 1 ? 'text-slate-300' : 
                index === 2 ? 'text-amber-600' : 'text-slate-500'
              }`}>
                #{index + 1}
              </span>
              <span className="text-white font-medium text-sm truncate max-w-[120px]">
                {score.guest_name}
              </span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">
              {score.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
