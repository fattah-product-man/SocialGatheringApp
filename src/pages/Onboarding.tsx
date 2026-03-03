import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Guest } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { Button } from '../components/Button';
import { INTERESTS_STRUCTURE, QUESTIONS } from '../lib/constants';
import { Search, Check, ChevronDown, Moon, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Onboarding() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const token = useGuestToken();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Guest>>({
    name: '',
    avatar_url: '',
    instagram: '',
    interests: [],
    goals: ['Just vibes'],
    energy_level: 'Balanced',
    answers: {}
  });

  const updateData = (key: keyof Guest, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        alert("File too large. Please choose an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData('avatar_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!eventId || !token) return;
    setLoading(true);
    try {
      await db.createGuest({
        event_id: eventId,
        guest_token: token,
        name: formData.name!,
        avatar_url: formData.avatar_url,
        instagram: formData.instagram,
        interests: formData.interests!,
        goals: formData.goals!,
        energy_level: formData.energy_level!,
        answers: formData.answers!
      });
      setStep(6); // Go to celebration
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Step1Name = () => (
    <div className="space-y-8 flex-1 flex flex-col">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">What should people call you?</h2>
        <p className="text-slate-400 font-medium">This is how you'll appear to others.</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="relative">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="Your name"
            className="w-full text-4xl font-bold border-b-2 border-slate-700 focus:border-yellow-400 outline-none py-4 bg-transparent placeholder-slate-700 transition-colors text-center text-white"
            autoFocus
          />
        </div>
        
        <AnimatePresence>
          {formData.name && formData.name.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl shadow-inner border border-indigo-400">
                🌙
              </div>
              <p className="text-white font-medium">
                Ahlannn, <span className="text-yellow-400 font-bold">{formData.name}</span> — Hashem here 😄
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button 
        size="lg"
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all" 
        onClick={handleNext} 
        disabled={!formData.name?.trim()}
      >
        CONTINUE
      </Button>
    </div>
  );

  const Step2Avatar = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white">Add a profile picture</h2>
      <p className="text-slate-400">Optional, but helps people find you.</p>
      
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="relative w-40 h-40 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-center justify-center shadow-2xl">
          {formData.avatar_url ? (
            <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl text-slate-600">📷</span>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="absolute bottom-2 right-2 bg-yellow-400 p-2 rounded-full shadow-lg pointer-events-none">
            <Sparkles className="w-4 h-4 text-yellow-900" />
          </div>
        </div>
        
        <Button variant="outline" className="relative bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
          Choose Photo
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white hover:bg-slate-800">Back</Button>
        <div className="flex-1 flex gap-2">
          {!formData.avatar_url && (
            <Button 
              variant="ghost" 
              onClick={handleNext} 
              className="flex-1 text-slate-500 hover:text-slate-400 font-medium"
            >
              Skip
            </Button>
          )}
          <Button 
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-emerald-700/50" 
            onClick={handleNext}
            disabled={!formData.avatar_url}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  const Step3Instagram = () => (
    <div className="space-y-8 flex-1 flex flex-col">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">What's your Instagram?</h2>
        <p className="text-slate-400 font-medium">So people can connect with you.</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-500">@</span>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => updateData('instagram', e.target.value)}
            placeholder="username"
            className="w-full text-4xl font-bold border-b-2 border-slate-700 focus:border-pink-500 outline-none py-4 pl-12 bg-transparent placeholder-slate-700 transition-colors text-white"
            autoFocus
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white hover:bg-slate-800">Back</Button>
        <div className="flex-1 flex gap-2">
          {!formData.instagram && (
            <Button 
              variant="ghost" 
              onClick={handleNext} 
              className="flex-1 text-slate-500 hover:text-slate-400 font-medium"
            >
              Skip
            </Button>
          )}
          <Button 
            size="lg"
            className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl border-b-4 border-pink-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-pink-800/50" 
            onClick={handleNext} 
            disabled={!formData.instagram}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  const Step3Interests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, number>>({});
    const [activeCategory, setActiveCategory] = useState(Object.keys(INTERESTS_STRUCTURE)[0]);
    
    useEffect(() => {
      const initial: Record<string, number> = {};
      Object.keys(INTERESTS_STRUCTURE).forEach(cat => {
        initial[cat] = 10;
      });
      setExpandedCategories(initial);
    }, []);

    const totalSelected = (formData.interests || []).length;
    const isSearchActive = searchQuery.trim().length > 0;

    const toggleInterest = (interest: string) => {
      const current = formData.interests || [];
      let next;
      if (current.includes(interest)) {
        next = current.filter(i => i !== interest);
      } else {
        next = [...current, interest];
      }
      updateData('interests', next);
    };

    const scrollToCategory = (cat: string) => {
      setActiveCategory(cat);
      const el = document.getElementById(`cat-${cat}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const CATEGORY_EMOJIS: Record<string, string> = {
      "Ramadan Series": "📺",
      "Music": "🎵",
      "Movies & TV": "🎬",
      "Books & Writing": "📚",
      "Career & Business": "💼",
      "Tech & AI": "🤖",
      "Fitness & Sports": "💪",
      "Food & Coffee": "☕",
      "Travel & Adventure": "✈️",
      "Art & Culture": "🎨",
      "Games & Fun": "🎮"
    };

    return (
      <div className="flex flex-col h-full -mx-4 px-4">
        {/* Header Section */}
        <div className="space-y-4 mb-4 bg-slate-900/0 backdrop-blur-xl sticky top-0 z-20 pb-4 pt-2 border-b border-white/10">
          <div className="flex justify-between items-center px-1">
            <div>
              <h2 className="text-2xl font-black text-white">What are you into?</h2>
              <p className="text-indigo-200 text-sm font-medium">Pick your top vibes</p>
            </div>
            <Button 
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all" 
              onClick={handleNext}
              disabled={(formData.interests?.length || 0) < 3}
            >
              Next ({totalSelected})
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
            <input
              type="text"
              placeholder="Search interests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl border border-white/10 focus:border-yellow-400 outline-none shadow-sm transition-colors text-white placeholder-indigo-300/50"
            />
          </div>

          {/* Sticky Categories */}
          {!isSearchActive && (
            <div 
              className="flex gap-2 overflow-x-auto pb-2 mask-gradient-right"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {Object.keys(INTERESTS_STRUCTURE).map(cat => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-white text-indigo-900 border-white shadow-lg shadow-white/20'
                      : 'bg-white/10 text-indigo-200 border-white/5 hover:bg-white/20'
                  }`}
                >
                  {CATEGORY_EMOJIS[cat]} {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-y-auto pb-24 space-y-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          {totalSelected > 25 && (
            <div className="bg-yellow-500/10 text-yellow-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-yellow-500/20">
              <Sparkles className="w-4 h-4" /> Tip: pick your top vibes so matching stays sharp
            </div>
          )}

          {Object.entries(INTERESTS_STRUCTURE).map(([category, tags]) => {
            const filteredTags = isSearchActive
              ? tags.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
              : tags;

            if (isSearchActive && filteredTags.length === 0) return null;

            const limit = expandedCategories[category] || 10;
            const visibleTags = isSearchActive ? filteredTags : filteredTags.slice(0, limit);
            const hasMore = !isSearchActive && limit < tags.length;

            return (
              <div key={category} id={`cat-${category}`} className="space-y-3 scroll-mt-48">
                <h3 className="text-lg font-bold text-white sticky top-0 flex items-center gap-2 drop-shadow-md">
                  <span className="text-2xl">{CATEGORY_EMOJIS[category]}</span> {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(tag => {
                    const isSelected = (formData.interests || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`group relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 border-b-4 active:border-b-0 active:translate-y-1 ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-purple-700 shadow-lg shadow-purple-500/30'
                            : 'bg-white/10 text-indigo-100 border-white/5 hover:bg-white/20'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                
                {hasMore && (
                  <button
                    onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: prev[category] + 10 }))}
                    className="w-full py-2 text-sm font-bold text-indigo-300 hover:text-white flex items-center justify-center gap-1"
                  >
                    Show more <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}

          {isSearchActive && Object.values(INTERESTS_STRUCTURE).flat().filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="text-center py-10 text-indigo-300 font-medium">
              No matches. Try a different keyword.
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-emerald-700/50" 
              onClick={handleNext}
              disabled={(formData.interests?.length || 0) < 3}
            >
              Done ({totalSelected})
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const Step4Questions = () => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(formData.answers || {});
    const [customAnswer, setCustomAnswer] = useState('');

    const currentQ = QUESTIONS[currentQIndex];
    // const isLastQ = currentQIndex === QUESTIONS.length - 1; // REMOVED: Only one question now
    
    const showFollowUp = currentQ.id === 'hashem_connection' && localAnswers['hashem_connection'] === "First time meeting you tonight (brave 😅)";

    const handleAnswer = (answer: string) => {
      const newAnswers = { ...localAnswers, [currentQ.id]: answer };
      setLocalAnswers(newAnswers);
      updateData('answers', newAnswers);
    };

    const handleCustomSubmit = () => {
      const newAnswers = { ...localAnswers, ['ask_hashem']: customAnswer };
      setLocalAnswers(newAnswers);
      updateData('answers', newAnswers);
      handleSubmit(); // Finish after custom answer
    };

    return (
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Mascot Header */}
        <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-700 w-fit">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm shadow-inner border border-indigo-400">
            🌙
          </div>
          <p className="text-white font-bold text-sm">Hashem</p>
        </div>

        <div className="space-y-6 flex-1">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-white leading-tight">
              Where do we know eachother from?
            </h2>

            <div className="space-y-3">
              {currentQ.choices?.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  className={`w-full p-4 rounded-xl text-left border-b-4 font-bold transition-all duration-200 active:scale-[0.98] active:border-b-0 active:translate-y-1 ${
                    localAnswers[currentQ.id] === choice
                      ? 'border-indigo-800 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>

            {showFollowUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 space-y-3 border-t border-slate-800"
              >
                <p className="font-bold text-white">Love that. What do you want to ask me tonight?</p>
                <textarea
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder="Ask me anything..."
                  maxLength={140}
                  className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-yellow-400 outline-none min-h-[100px] text-white placeholder-slate-500"
                />
                <Button 
                  size="sm" 
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
                  onClick={handleCustomSubmit}
                  disabled={!customAnswer.trim()}
                >
                  Finish
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex gap-4 pt-4 sticky bottom-0 bg-slate-900 pb-4 z-10 border-t border-slate-800 mt-auto">
          <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white hover:bg-slate-800">Back</Button>
          
          {!showFollowUp && (
            <Button 
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all" 
              onClick={handleSubmit}
              disabled={loading || !localAnswers[currentQ.id]}
            >
              {loading ? 'Saving...' : 'Finish'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const Celebration = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-500">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-40 h-40 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30 border-4 border-slate-800 overflow-hidden"
      >
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hashem&backgroundColor=b6e3f4" 
          alt="Hashem" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white">You're in!</h1>
        <p className="text-xl text-slate-400 font-medium max-w-xs mx-auto">
          Hashem and the crew are waiting for you.
        </p>
      </div>

      <Button 
        size="lg" 
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-lg py-4 rounded-2xl shadow-xl shadow-yellow-500/20 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all"
        onClick={() => setStep(7)}
      >
        One last thing...
      </Button>
    </div>
  );

  const Step6Hype = () => {
    const [message, setMessage] = useState('');
    const [selectedGif, setSelectedGif] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const GIF_LIBRARY = [
      { url: "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif", tags: ["excited"] }, // Office Excited
      { url: "https://media.giphy.com/media/Ge86XF8AVY1KE/giphy.gif", tags: ["dance"] }, // Fresh Prince Dance
      { url: "https://media.giphy.com/media/3o6UB3VhArvomJHtdK/giphy.gif", tags: ["hungry"] }, // Hungry
      { url: "https://media.giphy.com/media/KD8Ldwzx90X9fSPXV3/giphy.gif", tags: ["sleepy"] }, // Sleepy (New)
      { url: "https://media.giphy.com/media/l41Yh18f5TmadWDPi/giphy.gif", tags: ["cool"] }, // Obama Mic Drop
      { url: "https://media.giphy.com/media/blSTtZbddai8D2qhah/giphy.gif", tags: ["yes"] }, // Dog Yes
      { url: "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif", tags: ["party"] }, // Homer Party
      { url: "https://media.giphy.com/media/IwAZ6dvvvaTtdI8rIn/giphy.gif", tags: ["panic"] }, // Office Panic
      { url: "https://media.giphy.com/media/me0z5b1L6QoB8l5U5N/giphy.gif", tags: ["vibe"] }, // Cat Vibe
      { url: "https://media.giphy.com/media/26FxsYeQvGcaMPlqU/giphy.gif", tags: ["cheers"] }, // Cheers
      { url: "https://media.giphy.com/media/l2JIdnF6aJcNqaeng/giphy.gif", tags: ["ramadan"] }, // Ramadan
      { url: "https://media.giphy.com/media/artj9zpVs60k8/giphy.gif", tags: ["confused"] }, // Minion Confused
    ];

    const QUICK_REPLIES = ["Yalla beena!", "Hungryyy", "Waiting for basboosa", "Raye2", "Let's gooo"];

    const handlePost = async () => {
      if (!eventId || !token || !message || !selectedGif) return;
      setSubmitting(true);
      try {
        await db.createWallPost({
          event_id: eventId,
          guest_token: token,
          guest_name: formData.name!,
          message,
          gif_url: selectedGif
        });
        navigate(`/e/${eventId}/wall`, { state: { showWelcomeModal: true } });
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="space-y-6 flex-1 flex flex-col h-full">
        <div className="space-y-2 flex-shrink-0 pt-4">
          <h2 className="text-3xl font-black text-[#1D1D1F]">Post a message on the Wall to Enter</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pb-32" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          
          {/* Message Input Top */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Your Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Can't wait to see everyone! 🌙"
              className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200 focus:border-indigo-500 outline-none transition-all text-[#1D1D1F] placeholder-stone-400 font-medium text-lg shadow-sm"
            />
            
            {/* Quick Replies */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {QUICK_REPLIES.map(reply => (
                <button
                  key={reply}
                  onClick={() => setMessage(reply)}
                  className="whitespace-nowrap px-5 py-3 rounded-full bg-white border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* GIF Selection Bottom */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pick a Vibe</label>
            
            <div className="grid grid-cols-3 gap-3">
              {GIF_LIBRARY.map((gif) => (
                <button
                  key={gif.url}
                  onClick={() => setSelectedGif(gif.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-200 ${
                    selectedGif === gif.url 
                      ? 'border-indigo-500 scale-95 shadow-xl shadow-indigo-500/20' 
                      : 'border-transparent hover:border-stone-200'
                  }`}
                >
                  <img src={gif.url} alt="GIF option" className="w-full h-full object-cover" />
                  {selectedGif === gif.url && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <div className="bg-indigo-500 rounded-full p-1.5 shadow-lg">
                        <Check className="w-5 h-5 text-white" strokeWidth={4} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <AnimatePresence>
          {message && selectedGif && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-4 right-4 z-50"
            >
              <Button 
                className="w-full bg-[#1D1D1F] hover:bg-stone-800 text-white font-black text-lg py-5 rounded-2xl shadow-2xl shadow-black/20 border-none transform transition-transform active:scale-95" 
                onClick={handlePost}
                disabled={submitting}
              >
                {submitting ? 'Posting...' : 'Post & Enter 🚀'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Skip button for fallback */}
        <div className="fixed top-4 right-4 z-50">
             <button onClick={() => navigate(`/e/${eventId}/wall`, { state: { showWelcomeModal: true } })} className="text-stone-400 font-bold text-sm hover:text-stone-600">Skip</button>
        </div>
      </div>
    );
  };

  return (
    <div className={`pt-12 min-h-screen flex flex-col transition-colors duration-500 ${step === 7 ? 'bg-[#F5F5F7]' : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 stars-bg'}`}>
      {step < 6 && (
        <div className="mb-8 px-4">
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 flex flex-col px-4"
        >
          {step === 1 && <Step1Name />}
          {step === 2 && <Step2Avatar />}
          {step === 3 && <Step3Instagram />}
          {step === 4 && <Step3Interests />}
          {step === 5 && <Step4Questions />}
          {step === 6 && <Celebration />}
          {step === 7 && <Step6Hype />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
