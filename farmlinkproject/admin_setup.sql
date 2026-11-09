-- FarmLink admin setup. Run ONCE in Supabase > SQL Editor. Safe to re-run.

-- 1. Admin can read every profile (admin.js lists all sellers).
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 2. The function admin.js calls when you press Approve / Reject.
create or replace function public.admin_set_seller_status(
  seller_user_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Not authorised';
  end if;
  if new_status not in ('approved', 'rejected', 'pending') then
    raise exception 'Invalid status: %', new_status;
  end if;
  update public.profiles
     set verification_status = new_status
   where id = seller_user_id
     and role = 'seller';
end;
$$;

revoke all on function public.admin_set_seller_status(uuid, text) from public, anon;
grant execute on function public.admin_set_seller_status(uuid, text) to authenticated;

-- 3. Stop sellers approving themselves: the "update own profile" policy would
--    otherwise let them set verification_status = 'approved' from the browser.
create or replace function public.protect_verification_status()
returns trigger
language plpgsql
as $$
begin
  if new.verification_status is distinct from old.verification_status
     and auth.uid() is not null
     and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    new.verification_status := old.verification_status;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_verification_status on public.profiles;
create trigger protect_verification_status
  before update on public.profiles
  for each row execute function public.protect_verification_status();

-- 4. Make PostgREST see the new function immediately.
notify pgrst, 'reload schema';
