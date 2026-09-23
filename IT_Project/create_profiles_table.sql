-- FarmLink `profiles` table — one row per Supabase Auth user,
-- holding the fields login_register.js / dashboard.js / account-panel.js
-- all read and write.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text default 'buyer',
  avatar_url text,
  verification_status text default 'pending',

  -- seller-only fields
  seller_id text,
  farm_location text,

  -- driver-only fields
  vehicle_make_model text,
  vehicle_year text,
  vehicle_plate text,
  driver_area text,
  driving_experience text,
  bank_account_details text,
  tax_number text,

  created_at timestamptz not null default now()
);

-- Row Level Security: each user can only read/write their own row.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
