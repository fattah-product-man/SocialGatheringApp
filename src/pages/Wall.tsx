import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { db, WallPost } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { getSampleWallPosts } from '../lib/sampleData';
import { Button } from '../components/Button';
import { Plus, MessageSquare, Sparkles, Users, Gamepad2, Grid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Avatar } from '../components/Avatar';

const GIF_OPTIONS = [
  "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif", // The Office excited
  "https://media.giphy.com/media/TdfyKrN7hXjpW/giphy.gif", // Minions cheering
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif", // Clapping
  "https://media.giphy.com/media/l41Yh18f5TmadWDPi/giphy.gif", // Obama mic drop
  "https://media.giphy.com/media/artj9zpVs60k8/giphy.gif", // Minion what?
  "https://media.giphy.com/media/blSTtZbddai8D2qhah/giphy.gif", // Excited dog
  "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif", // Minions Whaaa
  "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif", // Homer Simpson
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Excited guy
  "https://media.giphy.com/media/IwAZ6dvvvaTtdI8rIn/giphy.gif", // The Office It's Happening
  "https://media.giphy.com/media/me0z5b1L6QoB8l5U5N/giphy.gif", // Cat vibing
  "https://media.giphy.com/media/Ge86XF8AVY1KE/giphy.gif", // Fresh Prince
];

export function Wall() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useGuestToken();
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Compose state
  const [message, setMessage] = useState('');
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [me, setMe] = useState<{ name: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    if (location.state?.showWelcomeModal) {
      setShowWelcome(true);
      // Clear state so it doesn't show on refresh
      window.history.replaceState({}, document.title);
      
      // Massive Confetti (Toned down)
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 1, // Reduced from 2
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
        });
        confetti({
          particleCount: 1, // Reduced from 2
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [location]);

  useEffect(() => {
    if (eventId) {
      loadPosts();
      if (token) {
        db.getGuest(eventId, token).then(setMe);
      }
    }
  }, [eventId, token]);

  const loadPosts = () => {
    if (!eventId) return;
    db.getWallPosts(eventId).then(data => {
      if (data.length > 0) {
        setPosts(data);
      } else {
        setPosts(getSampleWallPosts(eventId));
      }
      setLoading(false);
    });
  };

  const handleSubmit = async () => {
    if (!eventId || !token || !me || !message || !selectedGif) return;
    
    setSubmitting(true);
    try {
      await db.createWallPost({
        event_id: eventId,
        guest_token: token,
        guest_name: me.name,
        message,
        gif_url: selectedGif
      });
      setShowCompose(false);
      setMessage('');
      setSelectedGif(null);
      loadPosts();
      
      // Trigger confetti on post
      confetti({
        particleCount: 25, // Reduced from 50
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-400">Loading the hype...</div>;

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 animate-gradient-xy text-white overflow-hidden fixed inset-0 z-0 overflow-y-auto">
      <header className="flex justify-between items-center mb-6 max-w-md mx-auto relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Hype Wall</h1>
          <p className="text-white/60 font-medium">Leave a mark on the room</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setShowCompose(true)}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white border-none"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No hype yet. Be the first!</p>
          </div>
        ) : (
          posts.map((post, idx) => {
            // Deterministic rotation based on index
            const rotation = idx % 2 === 0 ? 'rotate-1' : '-rotate-1';
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? 2 : -2 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all mb-6 border border-stone-100`}
                style={{ transformOrigin: 'top center' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={post.guest_name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-[#1D1D1F]">
                      {post.guest_name}
                    </p>
                    <p className="text-xs text-stone-400 font-medium">
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden bg-stone-50 mb-3 border border-stone-100">
                  <img 
                    src={post.gif_url} 
                    alt="Reaction" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <p className="text-[#1D1D1F] font-bold text-lg leading-snug px-1">
                  "{post.message}"
                </p>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowWelcome(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 overflow-hidden relative"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <span className="text-4xl">🎉</span>
                </div>
                
                <div>
                  <h2 className="text-3xl font-black text-[#1D1D1F] mb-2">You're In!</h2>
                  <p className="text-stone-500 font-medium">Welcome to the party. Here's what you can do now:</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/e/${eventId}/matches`)}
                    className="w-full p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center gap-4 transition-colors group text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      ✨
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1D1D1F]">Reveal My Matches</h3>
                      <p className="text-xs text-stone-500 font-medium">See who you vibe with</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate(`/e/${eventId}/people`)}
                    className="w-full p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center gap-4 transition-colors group text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      👥
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1D1D1F]">Browse People</h3>
                      <p className="text-xs text-stone-500 font-medium">Find old friends & new faces</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate(`/e/${eventId}/groups`)}
                    className="w-full p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center gap-4 transition-colors group text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      📂
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1D1D1F]">Find Groups</h3>
                      <p className="text-xs text-stone-500 font-medium">Join your tribe</p>
                    </div>
                  </button>
                </div>

                <Button 
                  className="w-full bg-[#1D1D1F] text-white font-bold py-4 rounded-xl shadow-lg shadow-black/10"
                  onClick={() => setShowWelcome(false)}
                >
                  Let's Go!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompose(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Add to Wall</h3>
                <button onClick={() => setShowCompose(false)} className="text-stone-400 hover:text-stone-600">
                  Close
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Your Message</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="So excited for this! 🌙"
                    className="w-full p-4 rounded-xl bg-stone-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700">Pick a Vibe</label>
                  <div className="grid grid-cols-3 gap-2">
                    {GIF_OPTIONS.map((gif) => (
                      <button
                        key={gif}
                        onClick={() => setSelectedGif(gif)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedGif === gif 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-95' 
                            : 'border-transparent hover:border-stone-200'
                        }`}
                      >
                        <img src={gif} alt="GIF option" className="w-full h-full object-cover" />
                        {selectedGif === gif && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={!message || !selectedGif || submitting}
                >
                  {submitting ? 'Posting...' : 'Post to Wall'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
