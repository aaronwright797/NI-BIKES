-- NI Bikes — seed the 12 demo listings from lib/data.js's SEED_LISTINGS
-- into public.listings.
--
-- Every listing's seller_id is set to the one real account currently
-- in profiles (display_name 'Aaron Wright') — listings.seller_id is
-- NOT NULL and no fake users are being created, so this is the only
-- account available to own them. dealer_id is still set independently
-- per listing, resolved by dealer slug, exactly matching each demo
-- bike's original private/dealer attribution from lib/data.js — who
-- technically owns the row in the database is separate from which
-- dealer business (if any) it's displayed as being listed by.
--
-- Note: because this runs as a superuser migration in the SQL editor
-- (not through the app as an authenticated request), it bypasses the
-- listings RLS insert policy that normally requires a listing's
-- dealer_id to match the inserting user's own profile.dealer_id. That
-- policy still fully applies to every real insert/update/delete made
-- through the app — this is a one-time, admin-side bootstrap of demo
-- data, not a change to how the app itself behaves.
--
-- Photos are intentionally not seeded here: listing_photos.storage_path
-- expects a Supabase Storage object path, and the demo data's `photos`
-- values are raw external Wikimedia URLs — a separate decision for
-- whenever photo upload is wired up, not part of this migration.
--
-- Idempotent: listings.slug is already unique (see
-- 20260919120000_initial_schema.sql), so every insert below uses
-- `on conflict (slug) do nothing` — running this migration more than
-- once cannot create duplicate listings.

do $$
declare
  v_seller_id uuid;
begin
  select id into v_seller_id
  from public.profiles
  where display_name = 'Aaron Wright'
  limit 1;

  if v_seller_id is null then
    raise exception 'No profile found with display_name = ''Aaron Wright''. Update this migration with the correct seller_id before running.';
  end if;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'triumph-speed-twin-900-2021-belfast', v_seller_id, (select id from public.dealers where slug = 'lagan-motorcycles'), 'Triumph Speed Twin 900', 'Triumph', 'road', array['Classic', 'Naked'],
    6450, 2021, 8200, 'Belfast', '900cc parallel twin', 'Petrol', '6-speed', 2,
    'Valid until Apr 2027', 'RXI 4471', 'Well-kept commuter and weekend tourer. Full service history, new chain and sprockets fitted last month. Comes with a genuine Triumph rack and screen.',
    true, true, true, true, true
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'yamaha-yzf-r6-2018-lisburn', v_seller_id, null, 'Yamaha YZF-R6', 'Yamaha', 'race', array['Sportbikes'],
    5200, 2018, 14300, 'Lisburn', '599cc inline-four', 'Petrol', '6-speed', 3,
    'Not road registered', 'Track bike — no plate', 'Track-prepped R6 with quick-shifter and Akrapovic exhaust. Sold with spare bodywork and paddock stands. Not road registered.',
    true, true, false, false, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'ktm-250-sx-f-2022-antrim', v_seller_id, (select id from public.dealers where slug = 'antrim-off-road-centre'), 'KTM 250 SX-F', 'KTM', 'motocross', '{}',
    4800, 2022, 0, 'Antrim', '250cc single, 4-stroke', 'Petrol', '5-speed', 1,
    'Off-road only', 'Not road registered', 'Low hours, one owner, garage kept. Fresh top-end rebuild, new plastics and graphics fitted this season.',
    false, false, true, true, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'honda-crf450l-2020-newtownabbey', v_seller_id, null, 'Honda CRF450L', 'Honda', 'enduro', array['Adventure'],
    5900, 2020, 3100, 'Newtownabbey', '449cc single, 4-stroke', 'Petrol', '6-speed', 2,
    'Valid until Jun 2027', 'MEZ 8821', 'Road-registered enduro, MOT until next spring. Handguards, bash plate and rally roadbook holder included.',
    true, true, false, true, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'gas-gas-txt-300-2019-carrickfergus', v_seller_id, null, 'Gas Gas TXT 300', 'Gas Gas', 'trials', '{}',
    3600, 2019, 0, 'Carrickfergus', '300cc single, 2-stroke', 'Petrol', '5-speed', 2,
    'Off-road only', 'Not road registered', 'Club-level trials bike, recently rebuilt clutch. Light, agile, ready for the next event.',
    false, false, false, true, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'kawasaki-ninja-650-2022-belfast', v_seller_id, (select id from public.dealers where slug = 'belfast-motorcycle-centre'), 'Kawasaki Ninja 650', 'Kawasaki', 'road', array['Sportbikes'],
    5300, 2022, 4100, 'Belfast', '649cc parallel twin', 'Petrol', '6-speed', 1,
    'Valid until Feb 2027', 'OIB 2290', 'One owner from new, dealer serviced throughout. Perfect first big bike — light, torquey and easy to live with.',
    true, true, true, true, true
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'ducati-panigale-v2-2022-bangor', v_seller_id, (select id from public.dealers where slug = 'bangor-superbikes'), 'Ducati Panigale V2', 'Ducati', 'race', array['Sportbikes'],
    11900, 2022, 2400, 'Bangor', '955cc V-twin', 'Petrol', '6-speed', 1,
    'Valid until Sep 2027', 'DPV 955', 'Immaculate condition, quick-shifter, Termignoni exhaust. Track days only, never dropped.',
    true, true, true, true, true
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'bmw-r1250gs-2021-ballymena', v_seller_id, (select id from public.dealers where slug = 'ballymena-bmw-motorrad'), 'BMW R1250GS', 'BMW', 'road', array['Adventure'],
    12500, 2021, 11800, 'Ballymena', '1254cc boxer twin', 'Petrol', '6-speed', 1,
    'Valid until Nov 2026', 'BGS 1250', 'Full luggage set, heated grips, adaptive headlight. Serviced at BMW dealer throughout.',
    true, true, true, true, true
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'sherco-300-factory-2021-coleraine', v_seller_id, null, 'Sherco 300 Factory', 'Sherco', 'trials', '{}',
    4200, 2021, 0, 'Coleraine', '300cc single, 2-stroke', 'Petrol', '5-speed', 1,
    'Off-road only', 'Not road registered', 'Factory edition, carbon guards, barely marked. Selling due to injury, reluctant sale.',
    false, false, false, false, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'kawasaki-kx250-2021-derry', v_seller_id, null, 'Kawasaki KX250', 'Kawasaki', 'motocross', '{}',
    4100, 2021, 0, 'Derry', '249cc single, 4-stroke', 'Petrol', '5-speed', 1,
    'Off-road only', 'Not road registered', 'Fresh piston and rings, new chain and sprockets. Ready to race this weekend.',
    false, false, false, true, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'yamaha-mt-07-2021-newry', v_seller_id, null, 'Yamaha MT-07', 'Yamaha', 'road', array['Naked'],
    5650, 2021, 8000, 'Newry', '689cc parallel twin', 'Petrol', '6-speed', 1,
    'Valid until May 2027', 'YMT 689', 'Punchy, lightweight naked bike — brilliant first big bike or B-road weapon. Recent service, new tyres front and rear.',
    true, true, false, true, false
  )
  on conflict (slug) do nothing;

insert into public.listings (
    slug, seller_id, dealer_id, title, make, category_id, style_tags,
    price, year, mileage, location, engine, fuel, transmission, owners,
    mot_status, registration, description,
    checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi
  ) values (
    'husqvarna-fe-501-2022-omagh', v_seller_id, (select id from public.dealers where slug = 'omagh-trail-enduro'), 'Husqvarna FE 501', 'Husqvarna', 'enduro', array['Adventure'],
    6700, 2022, 1900, 'Omagh', '510cc single, 4-stroke', 'Petrol', '6-speed', 1,
    'Valid until Jul 2027', 'HFE 501', 'Road legal, recent service, Rekluse clutch fitted. Great all-round trail and green-lane bike.',
    true, true, true, true, true
  )
  on conflict (slug) do nothing;

end $$;
