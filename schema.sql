create table if not exists linear_backups (
  email text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Estrutura local incluída no JSON de backup:
-- clients, products, quotes, contracts, transactions, projects, company, fiscal, pdf, finance
