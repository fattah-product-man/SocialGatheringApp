import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Event } from '../lib/db';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Star, X } from 'lucide-react';

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-emerald-400 font-bold text-xl animate-pulse">Event has started! 🌙</div>;
  }

  return (
    <div className="flex gap-3 justify-center text-slate-400">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="text-2xl font-bold text-white bg-slate-800/80 backdrop-blur-md w-14 h-14 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-center font-mono">
            {value}
          </div>
          <span className="text-[10px] uppercase tracking-widest mt-2 font-bold text-slate-500">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export function Landing() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (eventId) {
      db.getEvent(eventId).then((e) => {
        setEvent(e);
        setLoading(false);
      });
    }
  }, [eventId]);

  const handleLogin = async () => {
    if (!eventId || !loginName.trim()) return;
    setLoggingIn(true);
    setLoginError('');
    
    try {
      const guest = await db.findGuestByName(eventId, loginName.trim());
      if (guest) {
        // Found them! Save their token to local storage
        localStorage.setItem('guest_token', guest.guest_token);
        navigate(`/e/${eventId}/wall`);
      } else {
        setLoginError("Couldn't find anyone with that exact name. Try joining instead!");
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-slate-400">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center mt-20 text-slate-400">Event not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="space-y-8 relative"
      >
        {/* Decorative elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-12 -right-12 text-yellow-500/20"
        >
          <Star className="w-24 h-24" />
        </motion.div>
        
        <div className="w-40 h-40 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 border-4 border-slate-800 relative z-10 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hashem&backgroundColor=b6e3f4" 
            alt="Hashem" 
            className="w-full h-full object-cover"
          />
          <Sparkles className="w-8 h-8 text-white absolute top-6 right-6 animate-pulse drop-shadow-md" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
            Ramadan Social Suhoor 2026
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Hosted by</span>
              <span className="text-yellow-400 font-bold">HASHEM</span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 backdrop-blur-sm">
              <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Created by Bub AI</span>
            </div>
          </div>
        </div>
        
        {event.start_time && (
          <div className="pt-4">
            <Countdown targetDate={event.start_time} />
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs space-y-6"
      >
        <Button
          size="lg"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-lg"
          onClick={() => navigate(`/e/${eventId}/join`)}
        >
          Join the Gathering
        </Button>
        <div className="space-y-2">
          <p className="text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            No account required. Just vibes.
          </p>
          <button 
            onClick={() => setShowLogin(true)}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium w-full text-center"
          >
            Already joined? Log back in
          </button>
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl z-10 p-6 space-y-6 border border-slate-800 relative"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Welcome back!</h3>
                <p className="text-slate-400 text-sm">Enter the exact name you used to join.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500 font-medium"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                
                {loginError && (
                  <p className="text-red-400 text-sm font-medium">{loginError}</p>
                )}

                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all"
                  onClick={handleLogin}
                  disabled={loggingIn || !loginName.trim()}
                >
                  {loggingIn ? 'Finding you...' : 'Log In'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
