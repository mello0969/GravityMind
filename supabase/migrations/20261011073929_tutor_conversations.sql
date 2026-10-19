create table public.tutor_conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  titulo text not null,
  pasta text not null,
  mensagens text not null,
  versao integer not null default 0 check (versao >= 0),
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);
create index tutor_conversas_owner_date on public.tutor_conversas(user_id, atualizada_em desc);
alter table public.tutor_conversas enable row level security;
alter table public.tutor_conversas force row level security;
revoke all on public.tutor_conversas from public, anon, authenticated;
grant select, insert, update, delete on public.tutor_conversas to service_role;
alter table public.notas add column tutor_conversa_id uuid references public.tutor_conversas(id) on delete set null;
create index notas_tutor_conversa_idx on public.notas(tutor_conversa_id) where tutor_conversa_id is not null;
