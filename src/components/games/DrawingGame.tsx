import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Send, Trash2, Undo, Loader2 } from 'lucide-react';
import { db } from '../../lib/db';
import { useGuestToken } from '../../lib/hooks';
import { useParams } from 'react-router-dom';
import { Leaderboard } from '../Leaderboard';

const COLORS = [
  '#000000', // Black
  '#EF4444', // Red
  '#F59E0B', // Orange
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#FFFFFF', // White (Eraser)
];

export function DrawingGame() {
  const { eventId } = useParams<{ eventId: string }>();
  const token = useGuestToken();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; comment: string } | null>(null);
  const [guestName, setGuestName] = useState('Guest');

  useEffect(() => {
    if (eventId && token) {
      db.getGuest(eventId, token).then(g => {
        if (g) setGuestName(g.name);
      });
    }
  }, [eventId, token]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState(); // Save initial blank state
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (feedback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || feedback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
    }
  };

  const undo = () => {
    if (history.length <= 1 || feedback) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current state
    const previousState = newHistory[newHistory.length - 1];
    
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistory(newHistory);
      }
    };
  };

  const clearCanvas = () => {
    if (feedback) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const submitDrawing = async () => {
    if (!canvasRef.current) return;
    setIsSubmitting(true);

    try {
      const base64Image = canvasRef.current.toDataURL('image/png').split(',')[1];
      
      const res = await fetch('/api/judge-drawing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (!res.ok) throw new Error('Failed to submit drawing');
      
      const data = await res.json();
      
      setFeedback(data);

      if (eventId && token) {
        await db.saveScore({
          event_id: eventId,
          guest_token: token,
          guest_name: guestName,
          game_id: 'drawing',
          score: data.score
        });
      }

    } catch (error) {
      console.error("Error submitting drawing:", error);
      setFeedback({ score: 0, comment: "Hashem is sleeping. Try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-inner border-4 border-slate-200 relative touch-none">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="font-bold text-slate-800">Hashem is judging you...</p>
            </div>
          </div>
        )}

        {feedback && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-md p-6 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-3xl text-center max-w-sm shadow-2xl border-4 border-yellow-400 w-full"
            >
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-600 shadow-inner">
                <span className="text-4xl font-black text-yellow-900">{feedback.score}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Hashem says:</h3>
              <p className="text-slate-600 font-medium mb-6 italic">"{feedback.comment}"</p>
              <button 
                onClick={() => {
                  setFeedback(null);
                  clearCanvas();
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-indigo-700 transition-colors mb-4"
              >
                Draw Again
              </button>
              
              <div className="border-t border-slate-200 pt-4">
                <Leaderboard gameId="drawing" />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {/* Colors */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setLineWidth(c === '#FFFFFF' ? 20 : 5);
              }}
              className={`w-10 h-10 rounded-full border-2 flex-shrink-0 transition-transform ${
                color === c ? 'scale-110 border-slate-900 shadow-lg' : 'border-transparent opacity-80'
              }`}
              style={{ backgroundColor: c }}
            >
              {c === '#FFFFFF' && <Eraser className="w-5 h-5 text-slate-400 mx-auto" />}
            </button>
          ))}
        </div>

        {/* Tools */}
        <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700">
          <div className="flex gap-2">
            <button 
              onClick={undo}
              className="p-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600 active:scale-95 transition-all"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button 
              onClick={clearCanvas}
              className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 active:scale-95 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={submitDrawing}
            disabled={isSubmitting || feedback !== null}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" /> Submit Art
          </button>
        </div>
      </div>
    </div>
  );
}
