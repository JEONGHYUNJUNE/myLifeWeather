begin;
create table if not exists public.english_notes_items (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  item_key text not null check (length(item_key) between 1 and 500),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) < 16384 and payload->>'kind' in ('word','expression') and length(payload->>'term') between 1 and 300),
  created_at timestamptz not null default now(),
  primary key (user_id, item_key)
);
alter table public.english_notes_items enable row level security;
revoke all on public.english_notes_items from anon, authenticated;
grant select,insert,delete on public.english_notes_items to authenticated;
create policy "Read own English notes" on public.english_notes_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save own English notes" on public.english_notes_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Delete own English notes" on public.english_notes_items for delete to authenticated using ((select auth.uid()) = user_id);
commit;
