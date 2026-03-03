import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, Event, Guest } from '../lib/db';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Lock, Unlock, Users, CheckCircle } from 'lucide-react';

export function Admin() {
  const { eventId } = useParams<{ eventId: string }>();
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId && isAuthenticated) {
      db.getEvent(eventId).then(setEvent);
      db.getGuests(eventId).then(setGuests);
    }
  }, [eventId, isAuthenticated]);

  const handleLogin = async () => {
    const e = await db.getEvent(eventId!);
    if (e && e.admin_passcode === passcode) {
      setEvent(e);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode');
    }
  };

  const toggleReveal = async () => {
    if (!event) return;
    const updated = await db.toggleRevealMatches(event.id, !event.reveal_matches);
    if (updated) setEvent(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-stone-500" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800">Host Access</h1>
        <div className="w-full max-w-xs space-y-4">
          <input
            type="password"
            placeholder="Enter passcode"
            className="w-full p-3 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none text-center text-2xl tracking-widest"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button className="w-full" onClick={handleLogin}>Unlock</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-800">Admin Panel</h1>
        <div className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">
          {event?.id}
        </div>
      </header>

      <Card className="p-6 flex items-center justify-between bg-stone-900 text-white">
        <div>
          <h3 className="font-bold text-lg">Reveal Matches</h3>
          <p className="text-stone-400 text-sm">
            {event?.reveal_matches ? 'Visible to all guests' : 'Hidden from guests'}
          </p>
        </div>
        <button
          onClick={toggleReveal}
          className={`p-3 rounded-full transition-colors ${
            event?.reveal_matches ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-stone-400'
          }`}
        >
          {event?.reveal_matches ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-stone-500">
            <Users className="w-4 h-4" /> Total Guests
          </div>
          <div className="text-3xl font-bold">{guests.length}</div>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-stone-500">
            <CheckCircle className="w-4 h-4" /> Completed
          </div>
          <div className="text-3xl font-bold">
            {guests.filter(g => Object.keys(g.answers).length === 3).length}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-stone-800">Guest List</h3>
        <div className="space-y-2">
          {guests.map(g => (
            <div key={g.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-stone-100">
              <span className="font-medium">{g.name}</span>
              <span className="text-xs text-stone-400">{g.energy_level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
