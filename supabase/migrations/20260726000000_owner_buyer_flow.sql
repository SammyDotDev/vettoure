-- Owner + buyer flow: properties, inspection requests, availability, video storage.

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  owner_name text not null default '',
  title text not null,
  area text not null,
  city text not null default 'Abuja',
  price numeric not null check (price >= 0),
  listing_type text not null check (listing_type in ('buy', 'rent')),
  status text not null default 'draft' check (status in ('draft', 'live')),
  beds int,
  baths int,
  size_sqm numeric,
  description text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_owner_id_idx on public.properties (owner_id);
create index properties_status_idx on public.properties (status);

alter table public.properties enable row level security;

create policy "Live properties are readable by everyone"
  on public.properties for select
  using (status = 'live' or owner_id = (select auth.uid()));

create policy "Owners can insert their own properties"
  on public.properties for insert
  with check (owner_id = (select auth.uid()));

create policy "Owners can update their own properties"
  on public.properties for update
  using (owner_id = (select auth.uid()));

create policy "Owners can delete their own properties"
  on public.properties for delete
  using (owner_id = (select auth.uid()));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- inspection_requests
-- buyer_name/buyer_phone are display snapshots taken at booking time, since
-- auth.users metadata is not readable through PostgREST by other users.
-- owner_id is denormalized from the property for cheap RLS checks.
-- ---------------------------------------------------------------------------
create table public.inspection_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  buyer_name text not null default '',
  buyer_phone text not null default '',
  preferred_at timestamptz,
  message text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

create index inspection_requests_owner_id_idx on public.inspection_requests (owner_id);
create index inspection_requests_buyer_id_idx on public.inspection_requests (buyer_id);
create index inspection_requests_property_id_idx on public.inspection_requests (property_id);

alter table public.inspection_requests enable row level security;

create policy "Participants can read their requests"
  on public.inspection_requests for select
  using (buyer_id = (select auth.uid()) or owner_id = (select auth.uid()));

create policy "Buyers can create requests for themselves"
  on public.inspection_requests for insert
  with check (
    buyer_id = (select auth.uid())
    and exists (
      select 1 from public.properties p
      where p.id = property_id
        and p.status = 'live'
        and p.owner_id = inspection_requests.owner_id
    )
  );

create policy "Owners can update requests on their properties"
  on public.inspection_requests for update
  using (owner_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- availability_slots: weekly recurring inspection windows per owner
-- ---------------------------------------------------------------------------
create table public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time),
  unique (owner_id, day_of_week, start_time)
);

create index availability_slots_owner_id_idx on public.availability_slots (owner_id);

alter table public.availability_slots enable row level security;

create policy "Availability is readable by everyone"
  on public.availability_slots for select
  using (true);

create policy "Owners can insert their own availability"
  on public.availability_slots for insert
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their own availability"
  on public.availability_slots for delete
  using (owner_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- table privileges: RLS is the gate, but the roles still need base grants
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.properties to anon, authenticated;
grant select, insert, update, delete on public.inspection_requests to anon, authenticated;
grant select, insert, update, delete on public.availability_slots to anon, authenticated;

-- ---------------------------------------------------------------------------
-- storage bucket for walkthrough videos (public read, owner-scoped writes)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('walkthroughs', 'walkthroughs', true)
on conflict (id) do nothing;

create policy "Walkthrough videos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'walkthroughs');

create policy "Users can upload to their own walkthrough folder"
  on storage.objects for insert
  with check (
    bucket_id = 'walkthroughs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own walkthrough videos"
  on storage.objects for delete
  using (
    bucket_id = 'walkthroughs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
