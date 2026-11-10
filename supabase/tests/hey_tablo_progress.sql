begin;
insert into auth.users(id) values('f342cae1-9d9e-4c3e-a484-387bcfd00701'),('f342cae1-9d9e-4c3e-a484-387bcfd00702');
set local role authenticated;
select set_config('request.jwt.claim.sub','f342cae1-9d9e-4c3e-a484-387bcfd00701',true);
do $$ begin
  if not (public.hey_tablo_save_progress('_c_2NsYL3ic','{"position":445}'::jsonb,0)->>'saved')::boolean then raise exception 'Initial insert failed'; end if;
  if (public.hey_tablo_save_progress('_c_2NsYL3ic','{"position":0}'::jsonb,0)->>'saved')::boolean then raise exception 'Stale write accepted'; end if;
  if not (public.hey_tablo_save_progress('_c_2NsYL3ic','{"position":450}'::jsonb,1)->>'saved')::boolean then raise exception 'Revision write failed'; end if;
end $$;
select set_config('request.jwt.claim.sub','f342cae1-9d9e-4c3e-a484-387bcfd00702',true);
do $$ begin
  if exists(select 1 from public.hey_tablo_progress where user_id='f342cae1-9d9e-4c3e-a484-387bcfd00701') then raise exception 'Other user readable'; end if;
  update public.hey_tablo_progress set state='{}' where user_id='f342cae1-9d9e-4c3e-a484-387bcfd00701';
  if found then raise exception 'Other user writable'; end if;
  begin
    insert into public.hey_tablo_progress(user_id,video_id,state) values('f342cae1-9d9e-4c3e-a484-387bcfd00701','7g6TpUhZQJ0','{}');
    raise exception 'Cross-user insert accepted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select 'PASS: own reads/writes, stale revision rejection, cross-user read/write/insert isolation' as result;
rollback;
