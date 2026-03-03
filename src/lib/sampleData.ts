import { Guest, WallPost } from './db';

export const SAMPLE_GUESTS: Guest[] = [
  {
    id: 'sample_1',
    event_id: 'demo',
    guest_token: 'token_1',
    name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Social butterfly',
    goals: ['Make new friends', 'Find collaborators'],
    interests: ['Coding', 'AI/ML', 'Fiction', 'Backpacking'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-purple-500'
  },
  {
    id: 'sample_2',
    event_id: 'demo',
    guest_token: 'token_2',
    name: 'Marcus Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    energy_level: 'Balanced',
    goals: ['Just vibe', 'Explore ideas'],
    interests: ['Hip-hop', 'Gym', 'Specialty Coffee'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-blue-500'
  },
  {
    id: 'sample_3',
    event_id: 'demo',
    guest_token: 'token_3',
    name: 'Emily Davis',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Chill',
    goals: ['Meet mentors'],
    interests: ['Museums', 'Poetry', 'Iftar vibes'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-green-500'
  },
  {
    id: 'sample_4',
    event_id: 'demo',
    guest_token: 'token_4',
    name: 'Michael Brown',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Social butterfly',
    goals: ['Make new friends'],
    interests: ['Startups', 'Gadgets', 'Video games'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-yellow-500'
  },
  {
    id: 'sample_5',
    event_id: 'demo',
    guest_token: 'token_5',
    name: 'Jessica Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Balanced',
    goals: ['Find collaborators'],
    interests: ['Baking', 'Solo travel', 'Indie'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-pink-500'
  },
  {
    id: 'sample_6',
    event_id: 'demo',
    guest_token: 'token_6',
    name: 'David Lee',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Chill',
    goals: ['Just vibe'],
    interests: ['Board games', 'Sci-Fi', 'Coding'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-indigo-500'
  },
  {
    id: 'sample_7',
    event_id: 'demo',
    guest_token: 'token_7',
    name: 'Sophia Martinez',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Social butterfly',
    goals: ['Explore ideas'],
    interests: ['Painting', 'Suhoor crew', 'Fine Dining'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-red-500'
  },
  {
    id: 'sample_8',
    event_id: 'demo',
    guest_token: 'token_8',
    name: 'James Taylor',
    avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Balanced',
    goals: ['Make new friends'],
    interests: ['Running', 'Camping', 'Marketing'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-orange-500'
  },
  {
    id: 'sample_9',
    event_id: 'demo',
    guest_token: 'token_9',
    name: 'Olivia Anderson',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Chill',
    goals: ['Just vibe'],
    interests: ['Non-fiction', 'Jazz', 'Documentaries'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-teal-500'
  },
  {
    id: 'sample_10',
    event_id: 'demo',
    guest_token: 'token_10',
    name: 'Daniel Thomas',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Social butterfly',
    goals: ['Find collaborators'],
    interests: ['Crypto', 'Finance', 'Trivia'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-cyan-500'
  },
  {
    id: 'sample_11',
    event_id: 'demo',
    guest_token: 'token_11',
    name: 'Isabella Hernandez',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Balanced',
    goals: ['Explore ideas'],
    interests: ['Fashion', 'Street Food', 'Community nights'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-rose-500'
  },
  {
    id: 'sample_12',
    event_id: 'demo',
    guest_token: 'token_12',
    name: 'William Moore',
    avatar_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    energy_level: 'Chill',
    goals: ['Meet mentors'],
    interests: ['Football', 'Road trips', 'Rock'],
    answers: {},
    created_at: new Date().toISOString(),
    color: 'bg-lime-500'
  }
];

export const SAMPLE_WALL_POSTS: WallPost[] = [
  {
    id: 'post_1',
    event_id: 'demo',
    guest_token: 'token_1',
    guest_name: 'Sarah Chen',
    message: 'So excited to meet everyone! 🌙',
    gif_url: 'https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'post_2',
    event_id: 'demo',
    guest_token: 'token_4',
    guest_name: 'Michael Brown',
    message: 'Who else is here for the Tech talk? 🤖',
    gif_url: 'https://media.giphy.com/media/TdfyKrN7hXjpW/giphy.gif',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'post_3',
    event_id: 'demo',
    guest_token: 'token_7',
    guest_name: 'Sophia Martinez',
    message: 'The food looks amazing! 🍲',
    gif_url: 'https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'post_4',
    event_id: 'demo',
    guest_token: 'token_2',
    guest_name: 'Marcus Johnson',
    message: 'Ready to vibe! 🎧',
    gif_url: 'https://media.giphy.com/media/l41Yh18f5TmadWDPi/giphy.gif',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'post_5',
    event_id: 'demo',
    guest_token: 'token_10',
    guest_name: 'Daniel Thomas',
    message: 'Let’s connect! 🤝',
    gif_url: 'https://media.giphy.com/media/artj9zpVs60k8/giphy.gif',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];

export const getSampleGuests = (eventId: string): Guest[] => {
  return SAMPLE_GUESTS.map(g => ({ ...g, event_id: eventId }));
};

export const getSampleWallPosts = (eventId: string): WallPost[] => {
  return SAMPLE_WALL_POSTS.map(p => ({ ...p, event_id: eventId }));
};
