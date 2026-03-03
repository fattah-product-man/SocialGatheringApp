import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const HASHEM_FACE_URL = "https://api.dicebear.com/7.x/avataaars/svg?seed=Hashem&backgroundColor=b6e3f4";

export function FaceTapperGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const velocityRef = useRef({ x: 2, y: 2 });
  const positionRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isPlaying, timeLeft]);

  const updatePosition = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const faceSize = 80; // approximate size of the face button
    
    let newX = positionRef.current.x + velocityRef.current.x;
    let newY = positionRef.current.y + velocityRef.current.y;

    // Bounce logic
    if (newX <= 0 || newX >= container.width - faceSize) {
      velocityRef.current.x *= -1;
      newX = Math.max(0, Math.min(newX, container.width - faceSize));
    }
    if (newY <= 0 || newY >= container.height - faceSize) {
      velocityRef.current.y *= -1;
      newY = Math.max(0, Math.min(newY, container.height - faceSize));
    }

    positionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
    
    requestRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updatePosition);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const handleTap = () => {
    if (!isPlaying) return;
    setScore(s => s + 1);
    // Speed up slightly on every tap
    velocityRef.current.x *= 1.1;
    velocityRef.current.y *= 1.1;
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    positionRef.current = { x: 50, y: 50 };
    velocityRef.current = { x: 2, y: 2 };
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-xs font-bold uppercase block">Time</span>
          <span className={`font-mono text-2xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-xs font-bold uppercase block">Score</span>
          <span className="font-mono text-2xl font-bold text-yellow-400">{score}</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 relative bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden"
      >
        {!isPlaying && timeLeft === 30 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Catch Hashem!</h2>
            <p className="text-slate-300 mb-6 text-center max-w-xs">
              Tap the bouncing face as many times as you can in 30 seconds.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              <Play className="w-5 h-5" /> Start Game
            </button>
          </div>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">Time's Up!</h2>
            <p className="text-xl text-slate-300 mb-8">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-8 rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}

        {isPlaying && (
          <motion.button
            style={{ 
              position: 'absolute', 
              left: position.x, 
              top: position.y,
              width: 80,
              height: 80
            }}
            whileTap={{ scale: 0.8 }}
            onClick={handleTap}
            className="rounded-full overflow-hidden shadow-xl border-4 border-white active:border-yellow-400 transition-colors"
          >
            <img 
              src={HASHEM_FACE_URL} 
              alt="Hashem" 
              className="w-full h-full object-cover pointer-events-none"
            />
          </motion.button>
        )}
      </div>
    </div>
  );
}
