import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Brain, Zap, Bomb, Palette, ArrowLeft } from 'lucide-react';
import { TriviaGame } from '../components/games/TriviaGame';
import { FaceTapperGame } from '../components/games/FaceTapperGame';
import { MinesweeperGame } from '../components/games/MinesweeperGame';
import { DrawingGame } from '../components/games/DrawingGame';

type GameType = 'trivia' | 'tapper' | 'minesweeper' | 'drawing' | null;

export function MiniGames() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const games = [
    {
      id: 'trivia',
      title: 'Hashem Trivia',
      description: 'How well do you know Hashem?',
      icon: <Brain className="w-8 h-8 text-yellow-400" />,
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-800'
    },
    {
      id: 'tapper',
      title: 'Catch Hashem',
      description: 'Tap the bouncing face!',
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      color: 'bg-purple-600',
      borderColor: 'border-purple-800'
    },
    {
      id: 'minesweeper',
      title: 'Hashem Sweeper',
      description: 'Don\'t click the wrong face!',
      icon: <Bomb className="w-8 h-8 text-red-400" />,
      color: 'bg-slate-600',
      borderColor: 'border-slate-800'
    },
    {
      id: 'drawing',
      title: 'Draw Hashem',
      description: 'AI judges your art skills',
      icon: <Palette className="w-8 h-8 text-green-400" />,
      color: 'bg-emerald-600',
      borderColor: 'border-emerald-800'
    }
  ];

  if (activeGame) {
    return (
      <div className="min-h-screen bg-slate-900 stars-bg p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveGame(null)}
            className="p-2 rounded-xl bg-slate-800 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all mr-4"
          >
            <ArrowLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {games.find(g => g.id === activeGame)?.title}
          </h1>
        </div>
        
        <div className="flex-1 bg-slate-800/50 backdrop-blur-md rounded-3xl border-2 border-slate-700 p-4 overflow-hidden relative">
          {activeGame === 'trivia' && <TriviaGame />}
          {activeGame === 'tapper' && <FaceTapperGame />}
          {activeGame === 'minesweeper' && <MinesweeperGame />}
          {activeGame === 'drawing' && <DrawingGame />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 stars-bg p-6 pb-24">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Hashem's <span className="text-yellow-400">Arcade</span>
        </h1>
        <p className="text-slate-400 font-medium">
          Compete for the ultimate leaderboard glory!
        </p>
      </header>

      <div className="grid gap-4">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveGame(game.id as GameType)}
            className={`w-full p-4 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-4 text-left ${game.color} ${game.borderColor}`}
          >
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              {game.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">{game.title}</h3>
              <p className="text-white/80 text-sm font-medium">{game.description}</p>
            </div>
            <div className="ml-auto bg-white/20 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
