import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Guest } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { getSampleGuests } from '../lib/sampleData';
import { INTERESTS_STRUCTURE } from '../lib/constants';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip } from '../components/Chip';
import { UserProfileModal } from '../components/UserProfileModal';

const CATEGORY_CONFIG: Record<string, { title: string; icon: string }> = {
  "Ramadan Series": { title: "Ramadan Series Crew", icon: "🌙" },
  "Music": { title: "Music Lovers", icon: "🎧" },
  "Movies & TV": { title: "Screen Night People", icon: "🎬" },
  "Books & Writing": { title: "Bookish Crowd", icon: "📚" },
  "Career & Business": { title: "Builders & Biz", icon: "🧠" },
  "Tech & AI": { title: "Tech & AI Curious", icon: "🤖" },
  "Fitness & Sports": { title: "Sports & Fitness", icon: "🏃" },
  "Food & Coffee": { title: "Foodies & Coffee", icon: "☕" },
  "Travel & Adventure": { title: "Travel Enthusiasts", icon: "🧳" },
  "Art & Culture": { title: "Arts & Culture", icon: "🎨" },
  "Games & Fun": { title: "Games & Fun", icon: "🎲" }
};

export function GroupDetail() {
  const { eventId, categorySlug } = useParams<{ eventId: string; categorySlug: string }>();
  const navigate = useNavigate();
  const token = useGuestToken();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [currentUser, setCurrentUser] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const categoryName = decodeURIComponent(categorySlug || '');
  const config = CATEGORY_CONFIG[categoryName] || { title: categoryName, icon: "📁" };
  const categoryTags = INTERESTS_STRUCTURE[categoryName as keyof typeof INTERESTS_STRUCTURE] || [];

  useEffect(() => {
    if (!eventId) return;
    Promise.all([
      db.getGuests(eventId),
      token ? db.getGuest(eventId, token) : Promise.resolve(null)
    ]).then(([data, me]) => {
      if (data.length > 0) {
        setGuests(data);
      } else {
        setGuests(getSampleGuests(eventId));
      }
      setCurrentUser(me);
      setLoading(false);
    });
  }, [eventId, token]);

  const members = guests.filter(guest => 
    guest.interests?.some(interest => (categoryTags as readonly string[]).includes(interest))
  );

  // Get tags that are actually used by members in this group
  const activeTags = categoryTags.filter(tag => 
    members.some(m => m.interests?.includes(tag))
  );

  const filteredMembers = selectedTag
    ? members.filter(m => m.interests?.includes(selectedTag))
    : members;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F5F5F7]/95 backdrop-blur-md pb-4 -mx-4 px-4 pt-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1F]">{config.title}</h1>
            <p className="text-stone-500 font-medium">{filteredMembers.length} people</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-right mt-4">
          <button
            onClick={() => setSelectedTag(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedTag === null
                ? 'bg-[#1D1D1F] text-white shadow-md'
                : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            All
          </button>
          {activeTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-[#1D1D1F] text-white shadow-md'
                  : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid gap-3 mt-2">
        {filteredMembers.map((member, index) => {
          // Get member's tags specifically for this category
          const memberCategoryTags = member.interests?.filter(t => (categoryTags as readonly string[]).includes(t)).slice(0, 3) || [];

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedGuest(member)}
              className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    {member.name[0]}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[#1D1D1F] truncate">{member.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {memberCategoryTags.map(tag => (
                    <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p>No members found with this tag.</p>
          </div>
        )}
      </div>

      <UserProfileModal 
        guest={selectedGuest}
        currentUser={currentUser}
        isOpen={!!selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
    </div>
  );
}
