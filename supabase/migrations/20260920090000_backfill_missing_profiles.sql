-- NI Bikes — backfill any auth.users row that doesn't yet have a
-- matching profiles row.
--
-- The handle_new_user() trigger (see 20260919120000_initial_schema.sql)
-- already creates a profile automatically for every new signup — this
-- migration does not duplicate or replace that. It's a one-time,
-- idempotent catch-up for any account that could exist without a
-- profile (e.g. created before this project's auth flow was fully
-- wired up, or added directly via the Supabase dashboard rather than
-- through signUp()).
--
-- Safe to run more than once: it only inserts a row for a user that
-- is still missing one, and never touches a profile that already
-- exists.

insert into public.profiles (id, display_name, account_type)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'display_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data ->> 'account_type', 'private')
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
