-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Events Table
create table events (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  host_name text not null,
  reveal_matches boolean default false,
  admin_passcode text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  start_time timestamp with time zone
);

-- Guests Table
create table guests (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  guest_token text not null,
  name text not null,
  avatar_url text,
  energy_level text not null,
  goals text[] default '{}',
  interests text[] default '{}',
  answers jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Feedback Table
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  guest_token text not null,
  responses jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wall Posts Table
create table wall_posts (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  guest_token text not null,
  guest_name text not null,
  message text not null,
  gif_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Scores Table
create table scores (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  guest_token text not null,
  guest_name text not null,
  game_id text not null,
  score integer not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index guests_event_id_idx on guests(event_id);
create index guests_token_idx on guests(guest_token);
create index wall_posts_event_id_idx on wall_posts(event_id);
create index scores_event_id_game_id_idx on scores(event_id, game_id);

-- RLS Policies (Optional but recommended)
alter table events enable row level security;
alter table guests enable row level security;
alter table feedback enable row level security;
alter table wall_posts enable row level security;
alter table scores enable row level security;

-- Allow public read access (since we are doing client-side logic for this simple app)
create policy "Public events are viewable by everyone" on events for select using (true);
create policy "Guests can view other guests" on guests for select using (true);
create policy "Guests can insert themselves" on guests for insert with check (true);
create policy "Guests can update themselves" on guests for update using (true);
create policy "Feedback is insertable" on feedback for insert with check (true);
create policy "Wall posts are viewable by everyone" on wall_posts for select using (true);
create policy "Guests can insert wall posts" on wall_posts for insert with check (true);
create policy "Scores are viewable by everyone" on scores for select using (true);
create policy "Guests can insert scores" on scores for insert with check (true);
