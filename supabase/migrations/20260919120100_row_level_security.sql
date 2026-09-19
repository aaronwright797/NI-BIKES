-- NI Bikes — Row Level Security policies.
-- Enables RLS on every table and defines who can read/write what,
-- for a marketplace where auth isn't wired into the frontend yet
-- but the rules should already be correct once it is.

alter table categories enable row level security;
alter table dealers enable row level security;
alter table profiles enable row level security;
alter table listings enable row level security;
alter table listing_photos enable row level security;
alter table saved_listings enable row level security;

-- ---------------------------------------------------------------
-- categories — static reference data, world-readable, admin-only
-- to write (no policy is granted for insert/update/delete, so only
-- the service role can change it).
-- ---------------------------------------------------------------
create policy "categories are publicly readable"
  on categories for select
  using (true);

-- ---------------------------------------------------------------
-- dealers — public business directory. A dealer's own linked staff
-- profile (profiles.dealer_id) can update its details; creating or
-- removing a dealer business is left to the service role for now
-- (onboarding a dealer isn't a self-serve flow yet).
-- ---------------------------------------------------------------
create policy "dealers are publicly readable"
  on dealers for select
  using (true);

create policy "dealer staff can update their own dealer profile"
  on dealers for update
  to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.dealer_id = dealers.id
    )
  )
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.dealer_id = dealers.id
    )
  );

-- ---------------------------------------------------------------
-- profiles — display_name/town/verified/account_type need to be
-- publicly readable (they're shown on listing cards and dealer
-- pages), so SELECT is public. Only the owner can create/edit their
-- own row. Note: `phone` is included in this public read for now —
-- revisit with a narrower column-level policy before it's ever
-- populated for private sellers.
-- ---------------------------------------------------------------
create policy "profiles are publicly readable"
  on profiles for select
  using (true);

create policy "users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------
-- listings — anyone can read active listings; a seller can also
-- read their own listings regardless of status (drafts, sold).
-- Only a signed-in user can create one, only the owning seller can
-- edit or delete it, and a listing can only be tagged with the
-- dealer_id that its own profile is actually linked to.
-- ---------------------------------------------------------------
create policy "active listings are publicly readable"
  on listings for select
  using (status = 'active');

create policy "sellers can read their own listings"
  on listings for select
  to authenticated
  using (seller_id = auth.uid());

create policy "sellers can insert their own listings"
  on listings for insert
  to authenticated
  with check (
    seller_id = auth.uid()
    and (
      dealer_id is null
      or dealer_id = (select dealer_id from profiles where id = auth.uid())
    )
  );

create policy "sellers can update their own listings"
  on listings for update
  to authenticated
  using (seller_id = auth.uid())
  with check (
    seller_id = auth.uid()
    and (
      dealer_id is null
      or dealer_id = (select dealer_id from profiles where id = auth.uid())
    )
  );

create policy "sellers can delete their own listings"
  on listings for delete
  to authenticated
  using (seller_id = auth.uid());

-- ---------------------------------------------------------------
-- listing_photos — visible wherever the parent listing is visible
-- (active, or owned by you); only the owning seller can manage them.
-- ---------------------------------------------------------------
create policy "listing photos follow listing visibility"
  on listing_photos for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_photos.listing_id
        and (l.status = 'active' or l.seller_id = auth.uid())
    )
  );

create policy "sellers can insert photos on their own listings"
  on listing_photos for insert
  to authenticated
  with check (
    exists (
      select 1 from listings l
      where l.id = listing_photos.listing_id and l.seller_id = auth.uid()
    )
  );

create policy "sellers can update photos on their own listings"
  on listing_photos for update
  to authenticated
  using (
    exists (
      select 1 from listings l
      where l.id = listing_photos.listing_id and l.seller_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from listings l
      where l.id = listing_photos.listing_id and l.seller_id = auth.uid()
    )
  );

create policy "sellers can delete photos on their own listings"
  on listing_photos for delete
  to authenticated
  using (
    exists (
      select 1 from listings l
      where l.id = listing_photos.listing_id and l.seller_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------
-- saved_listings — private to each user; nothing here is ever
-- visible to, or writable by, anyone else.
-- ---------------------------------------------------------------
create policy "users can read their own saved listings"
  on saved_listings for select
  to authenticated
  using (user_id = auth.uid());

create policy "users can save listings for themselves"
  on saved_listings for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can remove their own saved listings"
  on saved_listings for delete
  to authenticated
  using (user_id = auth.uid());
