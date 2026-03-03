import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Guest } from '../lib/db';
import { useGuestToken } from '../lib/hooks';
import { Button } from '../components/Button';
import { User, Camera, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTERESTS_STRUCTURE } from '../lib/constants';

export function Profile() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const token = useGuestToken();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  useEffect(() => {
    if (eventId && token) {
      db.getGuest(eventId, token).then(data => {
        if (data) {
          setGuest(data);
          setName(data.name);
          setInstagram(data.instagram || '');
          setAvatarUrl(data.avatar_url || '');
          setSelectedInterests(data.interests || []);
        }
        setLoading(false);
      });
    }
  }, [eventId, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        alert("File too large. Please choose an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!eventId || !token || !guest) return;
    setSaving(true);
    try {
      await db.updateGuest(eventId, token, {
        name,
        instagram,
        avatar_url: avatarUrl,
        interests: selectedInterests
      });
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
      setIsEditingInterests(false);
    }
  };

  const handleDeleteAccount = () => {
    // Fake deletion process
    setShowDeleteModal(false);
    setShowDeleteSuccess(true);
    // In a real app, we would actually delete the user here
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-400">Loading profile...</div>;
  if (!guest) return <div className="p-8 text-center text-stone-400">Guest not found</div>;

  return (
    <div className="pb-24 px-4 pt-6 space-y-8 max-w-md mx-auto">
      <header>
        <h1 className="text-3xl font-black text-stone-800">My Profile</h1>
        <p className="text-stone-500 font-medium">Edit how you appear to others</p>
      </header>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full bg-stone-200 border-4 border-white shadow-xl overflow-hidden group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-stone-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <Button variant="outline" className="relative bg-white border-stone-200 text-stone-600 hover:bg-stone-50 text-sm py-1 px-3 h-auto">
            Change Photo
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-indigo-500 outline-none font-bold text-stone-800"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Instagram</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">@</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username"
                className="w-full p-3 pl-8 rounded-xl bg-stone-50 border border-stone-200 focus:border-indigo-500 outline-none font-bold text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">My Vibes</label>
            <button 
              onClick={() => setIsEditingInterests(!isEditingInterests)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              {isEditingInterests ? 'Done' : 'Edit'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map(interest => (
              <span key={interest} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100 flex items-center gap-1">
                {interest}
                {isEditingInterests && (
                  <button onClick={() => toggleInterest(interest)} className="hover:text-indigo-900">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {selectedInterests.length === 0 && (
              <span className="text-stone-400 text-sm italic">No vibes selected yet</span>
            )}
          </div>

          {isEditingInterests && (
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <p className="text-sm font-medium text-stone-500">Add more vibes:</p>
              <div className="h-64 overflow-y-auto space-y-4 pr-2">
                {Object.entries(INTERESTS_STRUCTURE).map(([category, tags]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const isSelected = selectedInterests.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleInterest(tag)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>

        {/* Delete Account */}
        <div className="pt-8 border-t border-stone-200 text-center">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl z-10 p-6 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-800">Are you sure?</h3>
                <p className="text-stone-500 font-medium">
                  This will remove you from the event and delete your data. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fake Success Modal */}
      <AnimatePresence>
        {showDeleteSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl z-10 p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-800">Request Sent</h3>
                <p className="text-stone-500 font-medium text-lg">
                  The Host has been notified to remove your account.
                </p>
              </div>
              <Button 
                className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl"
                onClick={() => {
                  setShowDeleteSuccess(false);
                  navigate(`/e/${eventId}/join`); // Redirect to join page effectively "logging out"
                }}
              >
                Okay, got it
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
