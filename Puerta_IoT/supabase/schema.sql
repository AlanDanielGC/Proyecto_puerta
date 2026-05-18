create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  numero_control text not null,
  rfid text not null unique,
  permiso text not null check (permiso in ('permanente', 'temporal')),
  contador_entradas integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  rfid text,
  event_type text not null default 'manual',
  description text not null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists usuarios_set_updated_at on public.usuarios;
create trigger usuarios_set_updated_at
before update on public.usuarios
for each row
execute function public.set_updated_at();

alter table public.usuarios enable row level security;
alter table public.access_logs enable row level security;

drop policy if exists "Public read usuarios" on public.usuarios;
drop policy if exists "Public insert usuarios" on public.usuarios;
drop policy if exists "Public update usuarios" on public.usuarios;
drop policy if exists "Public delete usuarios" on public.usuarios;

create policy "Public read usuarios"
on public.usuarios
for select
using (true);

create policy "Public insert usuarios"
on public.usuarios
for insert
with check (true);

create policy "Public update usuarios"
on public.usuarios
for update
using (true)
with check (true);

create policy "Public delete usuarios"
on public.usuarios
for delete
using (true);

drop policy if exists "Public read access logs" on public.access_logs;
drop policy if exists "Public insert access logs" on public.access_logs;

create policy "Public read access logs"
on public.access_logs
for select
using (true);

create policy "Public insert access logs"
on public.access_logs
for insert
with check (true);