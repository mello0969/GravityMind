begin;
set local role service_role;
do $$
declare
  owner_id uuid := gen_random_uuid();
  other_id uuid := gen_random_uuid();
  event_id uuid := gen_random_uuid();
  note_id text := gen_random_uuid()::text;
  failed_note text := gen_random_uuid()::text;
  empty_data jsonb := '{"notas":[],"respostasQuestoes":[],"respostasCalculo":[],"progressoLicoes":[],"dificuldadeAdaptativa":[],"quizResultados":[]}';
  note jsonb;
  result record;
  i integer;
begin
  insert into public.users(id,nome,email,senha_hash,senha_salt) values
    (owner_id,'Teste SQL',owner_id::text||'@example.test','fixture','fixture'),
    (other_id,'Teste SQL',other_id::text||'@example.test','fixture','fixture');
  note := jsonb_build_object('id',note_id,'titulo','original','conteudo','encrypted-fixture',
    'assunto','geral','criadaEm',now(),'atualizadaEm',now());
  perform public.gm_sync(owner_id,empty_data||jsonb_build_object('notas',jsonb_build_array(note)));
  perform public.gm_sync(other_id,empty_data||jsonb_build_object('notas',jsonb_build_array(
    note||jsonb_build_object('titulo','must-not-overwrite','atualizadaEm',now()+interval '1 minute'))));
  if not exists(select 1 from public.notas where id=note_id and user_id=owner_id and titulo='original') then
    raise exception 'note ownership failed';
  end if;
  perform public.gm_record_activity(owner_id,event_id,true,false);
  perform public.gm_record_activity(owner_id,event_id,true,false);
  select * into result from public.gm_read_profile(owner_id);
  if result.total_xp<>8 or result.respostas_hoje<>1 then raise exception 'duplicate XP'; end if;
  perform public.gm_record_activity(owner_id,gen_random_uuid(),false,true);
  select * into result from public.gm_read_profile(owner_id);
  if result.total_xp<>15 or result.respostas_hoje<>2 or result.sequencia_acertos<>0 then
    raise exception 'incorrect reward accounting';
  end if;
  select * into result from public.gm_read_profile(other_id);
  if result.total_xp<>0 then raise exception 'profile leaked between users'; end if;
  begin
    perform public.gm_sync(owner_id,empty_data||jsonb_build_object(
      'notas',jsonb_build_array(note||jsonb_build_object('id',failed_note)),
      'dificuldadeAdaptativa','[{"assunto":"lei-1","nivel":"INVALID"}]'::jsonb));
    raise exception 'invalid difficulty accepted';
  exception when check_violation then null;
  end;
  if exists(select 1 from public.notas where id=failed_note) then raise exception 'partial upload persisted'; end if;
  for i in 1..7 loop
    perform public.gm_create_session(owner_id,lpad(i::text,64,'0'),now()+interval '1 day');
  end loop;
  if (select count(*) from public.sessoes where user_id=owner_id)<>5 then raise exception 'session limit failed'; end if;
  if public.gm_rate_limit(repeat('a',64),date_trunc('day',now()),now()+interval '1 day')<1 then
    raise exception 'rate counter failed';
  end if;
end $$;
rollback;
select 'transactions, note ownership, sessions and rewards verified; test rows rolled back' as verification;
select p.proname,p.prosecdef,
  has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') as auth_execute
from pg_proc p where p.pronamespace='public'::regnamespace and p.proname like 'gm_%';
