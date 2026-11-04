-- Cloud Invaders - Top Pilots leaderboard (EAASI Partners Summit 2026)
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Safe to re-run: it drops and recreates the function and policy, not the table.

create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  name       text        not null check (name ~ '^[A-Z0-9 .&-]{2,14}$'),
  score      integer     not null check (score between 1 and 500000),
  wave       integer     not null check (wave between 1 and 99),
  plane      text        not null check (plane in ('p68', 'da62', 'c421', 'b350')),
  created_at timestamptz not null default now(),
  -- Highest score the game can award by the time it reaches wave n
  -- (clouds 720 + 2 jammers 600 + clear bonus 100*k + lives bonus 200, per wave k <= n).
  constraint plausible_score check (score <= 1520 * wave + 50 * wave * (wave + 1))
);

create index if not exists scores_rank_idx on public.scores (score desc, created_at asc);

-- Anyone can read the board; nobody can write to the table directly.
alter table public.scores enable row level security;
drop policy if exists "public read" on public.scores;
create policy "public read" on public.scores for select to anon, authenticated using (true);
revoke insert, update, delete on public.scores from anon, authenticated;

-- The game submits scores only through this function, which validates them
-- and applies a simple global rate limit.
create or replace function public.submit_score(p_name text, p_score integer, p_wave integer, p_plane text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id bigint;
  recent integer;
begin
  select count(*) into recent from public.scores where created_at > now() - interval '1 minute';
  if recent >= 60 then
    raise exception 'Too many scores right now, try again in a minute';
  end if;

  insert into public.scores (name, score, wave, plane)
  values (upper(btrim(p_name)), p_score, p_wave, p_plane)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_score(text, integer, integer, text) from public;
grant execute on function public.submit_score(text, integer, integer, text) to anon, authenticated;

-- Useful during the event (run by hand when needed):
--   delete from public.scores where id = 123;      -- remove one entry
--   truncate table public.scores restart identity; -- reset the board before the Summit
