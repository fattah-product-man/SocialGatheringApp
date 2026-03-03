import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BINGO_COLORS, CONVERSATION_STARTERS } from '../lib/constants';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export function Bingo() {
  const { eventId } = useParams<{ eventId: string }>();
  const [color, setColor] = useState<typeof BINGO_COLORS[0] | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const handleSpin = () => {
    const randomColor = BINGO_COLORS[Math.floor(Math.random() * BINGO_COLORS.length)];
    const randomPrompt = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];
    
    setColor(randomColor);
    setPrompt(randomPrompt);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [randomColor.bg.replace('bg-', '')] // This might not work directly with Tailwind classes, but confetti defaults are fine
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 pb-20">
      <AnimatePresence mode="wait">
        {!color ? (
          <motion.div
            key="start"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold text-stone-800">Ready to mingle?</h1>
            <p className="text-stone-500">Get a color group and a conversation starter.</p>
            <Button 
              size="lg" 
              className="w-64 h-64 rounded-full text-2xl font-bold shadow-xl bg-gradient-to-br from-emerald-400 to-cyan-500 hover:scale-105 transition-transform"
              onClick={handleSpin}
            >
              Tap to Play
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl ${color.bg} ${color.text} space-y-6 relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 pointer-events-none" />
            
            <h2 className="text-2xl font-bold opacity-80 uppercase tracking-widest">Your Color</h2>
            <div className="text-6xl font-black tracking-tighter">{color.name}</div>
            
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm font-medium opacity-70 uppercase mb-2">Icebreaker</p>
              <p className="text-xl font-medium leading-relaxed">"{prompt}"</p>
            </div>

            <Button 
              variant="ghost" 
              className="mt-8 bg-white/20 hover:bg-white/30 text-current w-full"
              onClick={() => setColor(null)}
            >
              Spin Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
