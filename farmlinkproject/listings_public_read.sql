-- Lets buyers (and guests) see listings from APPROVED sellers only.
-- Run once in Supabase > SQL Editor. Safe to re-run.

-- Helper: is this user an approved seller? (security definer, because the
-- profiles table only lets each user read their own row.)
create or replace function public.is_approved_seller(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'seller' and verification_status = 'approved'
  );
$$;

grant execute on function public.is_approved_seller(uuid) to anon, authenticated;

alter table public.products  enable row level security;
alter table public.livestock enable row level security;

drop policy if exists "Public can view approved sellers products" on public.products;
create policy "Public can view approved sellers products"
  on public.products for select
  using (public.is_approved_seller(seller_id));

drop policy if exists "Public can view approved sellers livestock" on public.livestock;
create policy "Public can view approved sellers livestock"
  on public.livestock for select
  using (public.is_approved_seller(seller_id));

notify pgrst, 'reload schema';
