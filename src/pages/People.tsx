import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db, Guest } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { getSampleGuests } from '../lib/sampleData';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Search, User } from 'lucide-react';
import { UserProfileModal } from '../components/UserProfileModal';

export function People() {
  const { eventId } = useParams<{ eventId: string }>();
  const token = useGuestToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [currentUser, setCurrentUser] = useState<Guest | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (eventId) {
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
    }
  }, [eventId, token]);

  // Update URL when search changes
  useEffect(() => {
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  // Handle initial search param for opening modal (e.g. from GroupDetail navigation)
  useEffect(() => {
    const searchName = searchParams.get('search');
    // Only auto-select if we haven't selected one yet and we have guests loaded
    if (searchName && guests.length > 0 && !selectedGuest) {
        const found = guests.find(g => g.name === searchName);
        if (found) setSelectedGuest(found);
    }
  }, [searchParams, guests]);

  const allInterests = Array.from(new Set(guests.flatMap(g => g.interests)));

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? g.interests.includes(filter) : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-8 text-center text-stone-400">Loading directory...</div>;

  return (
    <div className="space-y-6 pb-20">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-stone-800">People</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-emerald-500 outline-none shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Chip 
            selected={filter === null} 
            onClick={() => setFilter(null)}
            className="whitespace-nowrap"
          >
            All
          </Chip>
          {allInterests.map(i => (
            <Chip
              key={i}
              selected={filter === i}
              onClick={() => setFilter(filter === i ? null : i)}
              className="whitespace-nowrap"
            >
              {i}
            </Chip>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredGuests.map(guest => (
          <Card 
            key={guest.id} 
            className="p-6 flex flex-col gap-4 cursor-pointer hover:bg-stone-50 transition-colors active:scale-[0.99]"
            onClick={() => setSelectedGuest(guest)}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                {guest.avatar_url ? (
                  <img src={guest.avatar_url} alt={guest.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200">
                    <User className="w-8 h-8 text-stone-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-stone-900 truncate">{guest.name}</h3>
                {guest.answers && guest.answers['hashem_connection'] && (
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    Knows Hashem from: <span className="text-stone-700">{guest.answers['hashem_connection']}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {guest.interests.map(i => (
                <span key={i} className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg font-medium">
                  {i}
                </span>
              ))}
            </div>
          </Card>
        ))}

        {/* Big Promo Card */}
        <div className="relative mt-12 mb-8 mx-4 transform rotate-3 hover:rotate-0 transition-all duration-500 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[32px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
            
            <div className="relative z-10 space-y-6 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 border border-white/10 text-white/90 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Built by Bub AI 🫧
              </div>
              
              <h3 className="text-2xl font-black text-stone-800 leading-tight drop-shadow-sm">
                This Social Web-App was built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mo Fattah</span>, CEO of Bub AI
              </h3>
              
              <div className="space-y-3 pt-2">
                <p className="text-stone-600 font-bold text-lg">
                  Want a FREE one for your next social gathering or Event?
                </p>
                <div className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl font-black text-lg shadow-lg transform group-hover:scale-105 transition-transform">
                  Ask Hashem! 👇
                </div>
              </div>
            </div>
          </div>
        </div>
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
