import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INTERESTS_STRUCTURE = {
  "Ramadan Series": [
    "Iftar vibes", "Suhoor crew", "Taraweeh enjoyer", "Qur’an reflections",
    "Charity & giving", "Community nights", "Deep conversations", "Hosting energy",
    "Dessert hunter", "Coffee after iftar", "Night walks", "Spiritual growth",
    "New traditions", "Family-style gatherings", "Board games after iftar",
    "Quiet corner person", "Photos & memories", "Food recommendations",
    "Volunteering", "Mosque-hopper"
  ],
  "Music": [
    "Arabic classics", "Indie", "Hip-hop", "Rap", "Pop", "EDM", "Jazz",
    "Lo-fi", "Rock", "Metal", "Film scores", "Afrobeats", "Amapiano",
    "House", "Techno", "Mahraganat", "Khaleeji", "Live concerts",
    "Vinyl nerd", "Playlists curator"
  ],
  "Movies & TV": [
    "Sci-Fi", "Documentaries", "K-Drama", "Anime", "Comedy", "Thriller",
    "Indie films", "Reality TV", "Classics", "Horror"
  ],
  "Books & Writing": [
    "Fiction", "Non-fiction", "Poetry", "Philosophy", "History",
    "Sci-Fi/Fantasy", "Biographies", "Journaling", "Screenwriting"
  ],
  "Career & Business": [
    "Startups", "Tech", "Marketing", "Finance", "Creative",
    "Freelancing", "Leadership", "Networking", "Remote work"
  ],
  "Tech & AI": [
    "Coding", "AI/ML", "Gadgets", "Crypto", "Design",
    "Gaming", "VR/AR", "Open Source", "Cybersecurity"
  ],
  "Fitness & Sports": [
    "Gym", "Running", "Yoga", "Football", "Basketball",
    "Hiking", "Swimming", "Martial Arts", "Cycling"
  ],
  "Food & Coffee": [
    "Specialty Coffee", "Cooking", "Baking", "Foodie", "Vegan",
    "Street Food", "Fine Dining", "Brunch", "Tea"
  ],
  "Travel & Adventure": [
    "Backpacking", "Luxury", "Road trips", "Solo travel", "Camping",
    "City breaks", "Nature", "Photography", "Culture"
  ],
  "Art & Culture": [
    "Museums", "Theater", "Painting", "Photography", "Architecture",
    "Fashion", "History", "Languages", "Design"
  ],
  "Games & Fun": [
    "Board games", "Video games", "Trivia", "Escape rooms", "Karaoke",
    "Bowling", "Card games", "Puzzles"
  ]
} as const;

// Flattened list for backward compatibility or easy searching
export const INTERESTS = Object.values(INTERESTS_STRUCTURE).flat();

export const QUESTIONS = [
  {
    id: "hashem_connection",
    text: "Since we all somehow ended up in my orbit 😄 — what’s your ‘Hashem connection’?",
    choices: [
      "Friend from way back",
      "Work / startup world",
      "Family / family friend",
      "Met recently",
      "First time meeting you tonight (brave 😅)"
    ]
  },
  {
    id: "talk_trigger",
    text: "Pick a topic you’d LOVE someone to pull you into tonight.",
    choices: [
      "A life decision I’m thinking about",
      "A project I’m building",
      "A book / show that changed me",
      "Money / career move",
      "Faith / meaning / habits",
      "Fun chaos / funny stories"
    ]
  }
];

export const BINGO_COLORS = [
  { name: "Red", bg: "bg-red-500", text: "text-white" },
  { name: "Blue", bg: "bg-blue-500", text: "text-white" },
  { name: "Green", bg: "bg-green-500", text: "text-white" },
  { name: "Yellow", bg: "bg-yellow-400", text: "text-black" },
  { name: "Purple", bg: "bg-purple-500", text: "text-white" }
];

export const CONVERSATION_STARTERS = [
  "What’s something you changed your mind about recently?",
  "What are you building that no one knows about?",
  "What’s your Ramadan highlight so far?",
  "What’s the best book you’ve read this year?",
  "If you could have dinner with anyone, living or dead, who would it be?",
  "What’s a skill you’d love to learn?"
];
