-- FarmLink `saved_products` table — one row per (user, saved product).
-- Read and written by wishlist.js (the heart icon + "Saved" page).
-- Run this once in the Supabase SQL Editor.

create table if not exists public.saved_products (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_key)
);

-- Row Level Security: each user can only see / change their own saved items.
alter table public.saved_products enable row level security;

create policy "Users can view their own saved products"
  on public.saved_products for select
  using (auth.uid() = user_id);

create policy "Users can save products for themselves"
  on public.saved_products for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave their own products"
  on public.saved_products for delete
  using (auth.uid() = user_id);


  /*keep this to run on supabase for output 
  select table_name from information_schema.tables where table_schema = 'public' order by table_name;

  */
  