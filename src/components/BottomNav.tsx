import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '../lib/constants';

export function BottomNav() {
  const { eventId } = useParams();
  
  const navItems = [
    { to: `/e/${eventId}/matches`, emoji: '✨', label: 'Matches' },
    { to: `/e/${eventId}/people`, emoji: '👥', label: 'People' },
    { to: `/e/${eventId}/groups`, emoji: '💬', label: 'Groups' },
    { to: `/e/${eventId}/wall`, emoji: '📣', label: 'Wall' },
    { to: `/e/${eventId}/profile`, emoji: '👤', label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-2 shadow-2xl z-50 max-w-md mx-auto ring-1 ring-white/10">
      <div className="flex justify-around items-center">
        {navItems.map(({ to, emoji, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 relative group',
                isActive 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 scale-110 -translate-y-2' 
                  : 'hover:bg-white/10'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'opacity-80 grayscale-[0.5]'}`}>
                  {emoji}
                </span>
                {isActive && (
                  <span className="absolute -bottom-6 text-[10px] font-bold text-white/90 tracking-wide animate-in fade-in slide-in-from-top-1">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
