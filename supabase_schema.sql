-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Create Restaurants Table
create table public.restaurants (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    address text not null,
    city text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Reviews Table
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    restaurant_id uuid references public.restaurants(id) on delete cascade not null,
    content text not null,
    image_url text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    vibe_tags text[] default array[]::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Set up Row Level Security (RLS)

-- Restaurants: anyone can read, authenticated users can insert
alter table public.restaurants enable row level security;

create policy "Restaurants are viewable by everyone" 
on public.restaurants for select using (true);

create policy "Authenticated users can insert restaurants" 
on public.restaurants for insert with check (auth.role() = 'authenticated');

-- Reviews: anyone can read, authenticated users can insert and update their own
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone" 
on public.reviews for select using (true);

create policy "Users can insert their own reviews" 
on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews" 
on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews" 
on public.reviews for delete using (auth.uid() = user_id);

-- 4. Storage Bucket Setup (Execute via Dashboard Storage UI or SQL if superuser)
-- Create a new public bucket named "reviews-images"
insert into storage.buckets (id, name, public) values ('reviews-images', 'reviews-images', true);

-- Storage Policies
create policy "Images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'reviews-images' );

create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'reviews-images' and auth.role() = 'authenticated' );

create policy "Users can update their own images"
on storage.objects for update
using ( bucket_id = 'reviews-images' and auth.uid() = owner);

create policy "Users can delete their own images"
on storage.objects for delete
using ( bucket_id = 'reviews-images' and auth.uid() = owner);
