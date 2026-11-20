begin;
create table public.hey_tablo_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id text not null check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  state jsonb not null check (jsonb_typeof(state) = 'object' and octet_length(state::text) < 16384),
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.hey_tablo_progress enable row level security;
revoke all on public.hey_tablo_progress from anon, authenticated;
grant select, insert, update on public.hey_tablo_progress to authenticated;
create policy "Own reading progress" on public.hey_tablo_progress for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Invoker rights preserve RLS. Revision checking prevents an idle device from overwriting another device's progress.
create function public.hey_tablo_save_progress(p_video_id text, p_state jsonb, p_revision bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare saved public.hey_tablo_progress;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_revision = 0 then
    insert into public.hey_tablo_progress(user_id,video_id,state)
      values(auth.uid(),p_video_id,p_state) on conflict do nothing returning * into saved;
  else
    update public.hey_tablo_progress set state=p_state, revision=revision+1, updated_at=now()
      where user_id=auth.uid() and video_id=p_video_id and revision=p_revision returning * into saved;
  end if;
  if saved.user_id is not null then return jsonb_build_object('saved',true,'revision',saved.revision); end if;
  return jsonb_build_object('saved',false);
end;
$$;
revoke all on function public.hey_tablo_save_progress(text,jsonb,bigint) from public, anon;
grant execute on function public.hey_tablo_save_progress(text,jsonb,bigint) to authenticated;
commit;
