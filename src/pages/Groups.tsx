import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Guest } from '../lib/db';
import { getSampleGuests } from '../lib/sampleData';
import { INTERESTS_STRUCTURE } from '../lib/constants';
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_CONFIG: Record<string, { title: string; icon: string; gradient: string }> = {
  "Ramadan Series": { title: "Ramadan Series Crew", icon: "🌙", gradient: "from-indigo-100 to-purple-100" },
  "Music": { title: "Music Lovers", icon: "🎧", gradient: "from-pink-100 to-rose-100" },
  "Movies & TV": { title: "Screen Night People", icon: "🎬", gradient: "from-blue-100 to-cyan-100" },
  "Books & Writing": { title: "Bookish Crowd", icon: "📚", gradient: "from-amber-100 to-orange-100" },
  "Career & Business": { title: "Builders & Biz", icon: "🧠", gradient: "from-slate-100 to-gray-200" },
  "Tech & AI": { title: "Tech & AI Curious", icon: "🤖", gradient: "from-violet-100 to-fuchsia-100" },
  "Fitness & Sports": { title: "Sports & Fitness", icon: "🏃", gradient: "from-emerald-100 to-teal-100" },
  "Food & Coffee": { title: "Foodies & Coffee", icon: "☕", gradient: "from-yellow-100 to-amber-100" },
  "Travel & Adventure": { title: "Travel Enthusiasts", icon: "🧳", gradient: "from-sky-100 to-blue-100" },
  "Art & Culture": { title: "Arts & Culture", icon: "🎨", gradient: "from-red-100 to-pink-100" },
  "Games & Fun": { title: "Games & Fun", icon: "🎲", gradient: "from-lime-100 to-green-100" }
};

export function Groups() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!eventId) return;
    db.getGuests(eventId).then(data => {
      if (data.length > 0) {
        setGuests(data);
      } else {
        setGuests(getSampleGuests(eventId));
      }
      setLoading(false);
    });
  }, [eventId]);

  const getGroupMembers = (category: string) => {
    const categoryTags = INTERESTS_STRUCTURE[category as keyof typeof INTERESTS_STRUCTURE] || [];
    return guests.filter(guest => 
      guest.interests?.some(interest => (categoryTags as readonly string[]).includes(interest))
    );
  };

  const filteredGroups = Object.keys(INTERESTS_STRUCTURE).map(category => {
    const members = getGroupMembers(category);
    // Filter members by search query if active
    const matchingMembers = searchQuery 
      ? members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : members;
      
    return {
      category,
      config: CATEGORY_CONFIG[category] || { title: category, icon: "📁", gradient: "from-stone-100 to-stone-200" },
      members: matchingMembers,
      totalCount: members.length
    };
  }).filter(group => group.members.length > 0); // Hide empty groups

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2">Explore Groups</h1>
        <p className="text-stone-500 font-medium">Find your people by interest</p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
        {!searchQuery && (
          <p className="text-sm text-stone-500 font-medium ml-1">
            Explore the room by vibe. Tap a folder.
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {filteredGroups.map((group, index) => (
          <motion.button
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/e/${eventId}/groups/${encodeURIComponent(group.category)}`)}
            className={`w-full bg-gradient-to-br ${group.config.gradient} p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-left group relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-6xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                {group.config.icon}
              </div>
              <div className="bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 shadow-sm">
                {group.totalCount} people
              </div>
            </div>
            
            <h3 className="text-xl font-black text-[#1D1D1F] mb-2 tracking-tight">
              {group.config.title}
            </h3>
            
            <div className="flex flex-wrap gap-1">
              {group.members.slice(0, 3).map((member, i) => (
                <span key={member.id} className="text-xs text-stone-600 font-semibold bg-white/40 px-2 py-1 rounded-lg">
                  {member.name.split(' ')[0]}
                </span>
              ))}
              {group.members.length > 3 && (
                <span className="text-xs text-stone-500 font-semibold bg-white/40 px-2 py-1 rounded-lg">
                  + {group.members.length - 3} more
                </span>
              )}
            </div>

            <ChevronRight className="absolute right-4 bottom-6 w-6 h-6 text-stone-400/50 group-hover:text-stone-600 transition-colors" />
          </motion.button>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p>No groups found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
