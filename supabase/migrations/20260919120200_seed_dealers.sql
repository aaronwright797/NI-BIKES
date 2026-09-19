-- NI Bikes — seed the 6 real dealer businesses from lib/data.js's
-- DEALER_META so the `dealers` table matches the current frontend.
-- Listings aren't seeded here: every listing needs a real
-- seller_id (profiles.id -> auth.users.id), so listing seeding
-- follows once Supabase Auth is wired up and there are real
-- accounts to own them.

insert into dealers (slug, name, town, address, phone, email, hours, bio, rating, verified) values
  (
    'lagan-motorcycles', 'Lagan Motorcycles', 'Belfast', '142 Boucher Road, Belfast, BT12 6RE',
    '028 9024 1187', 'sales@laganmotorcycles.co.uk', 'Mon–Fri 9am–5:30pm, Sat 9am–1pm',
    'Official Triumph dealer serving Belfast and the wider Lagan Valley since 2008. Full workshop, finance, and part-exchange on site.',
    4.9, true
  ),
  (
    'antrim-off-road-centre', 'Antrim Off-Road Centre', 'Antrim', '18 Dunadry Road, Antrim, BT41 2QN',
    '028 9446 5523', 'info@antrimoffroad.co.uk', 'Mon–Fri 9am–5pm, Sat 9am–4pm',
    'Motocross and enduro specialists — KTM, Husqvarna and GasGas stock, plus servicing, tyres and race-day support.',
    4.7, true
  ),
  (
    'belfast-motorcycle-centre', 'Belfast Motorcycle Centre', 'Belfast', '76 Donegall Road, Belfast, BT12 5JN',
    '028 9032 8814', 'hello@belfastmotorcyclecentre.co.uk', 'Mon–Sat 9am–5:30pm',
    'Multi-franchise dealer covering Kawasaki and Suzuki, with a strong range of learner-legal and A2-licence bikes.',
    4.8, true
  ),
  (
    'bangor-superbikes', 'Bangor Superbikes', 'Bangor', '9 Central Avenue, Bangor, BT20 5HS',
    '028 9127 3390', 'sales@bangorsuperbikes.co.uk', 'Tue–Sat 9.30am–5.30pm',
    'Performance and sportsbike specialists — Ducati and Aprilia agents, with in-house finance and PX on all trade-ins.',
    5.0, true
  ),
  (
    'ballymena-bmw-motorrad', 'Ballymena BMW Motorrad', 'Ballymena', '212 Galgorm Road, Ballymena, BT42 1AB',
    '028 2565 2201', 'motorrad@ballymenabmw.co.uk', 'Mon–Fri 9am–6pm, Sat 9am–5pm',
    'Northern Ireland''s official BMW Motorrad dealer — new and approved-used GS, R and S ranges, servicing and genuine parts.',
    4.9, true
  ),
  (
    'omagh-trail-enduro', 'Omagh Trail & Enduro', 'Omagh', '5 Dromore Road, Omagh, BT78 1QG',
    '028 8224 6675', 'info@omaghtrailenduro.co.uk', 'Mon–Fri 9am–5pm, Sat 10am–2pm',
    'Family-run trail and enduro specialists covering the west of the province — Husqvarna and Beta, plus green-lane advice and trailer hire.',
    4.6, true
  );
