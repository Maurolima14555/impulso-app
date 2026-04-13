# IMPULSO — Guia de Setup Completo

Este ficheiro explica o que ainda precisas de configurar manualmente para ter o IMPULSO 100% funcional.

---

## Estado actual

| Item | Estado |
|---|---|
| Código do app | ✅ Completo |
| Design system (tema, componentes) | ✅ Completo |
| Supabase URL + Key | ✅ Configurado (`.env`) |
| Tabelas Supabase (SQL) | ⚠️ Precisas de criar |
| RevenueCat (monetização) | ⚠️ Precisas de configurar |
| EAS login + build iOS | ⚠️ Precisas de fazer |
| App Store submission | ⚠️ Precisa de conta Apple Developer |

---

## 1. Supabase — Criar as tabelas

O Supabase está ligado. Falta criar as tabelas da base de dados.

1. Vai a [supabase.com](https://supabase.com) → entra no teu projecto
2. Clica em **SQL Editor** → **New query**
3. Cola e executa este SQL:

```sql
-- Users profile (extends Supabase auth.users)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text default 'free' check (plan in ('free', 'pro')),
  streak integer default 0,
  total_minutes integer default 0,
  updated_at timestamptz default now()
);

-- Completed activities
create table public.completed_activities (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  activity_id text not null,
  activity_title text not null,
  category text not null,
  duration integer not null,
  completed_at timestamptz not null
);

-- RLS policies
alter table public.user_profiles enable row level security;
alter table public.completed_activities enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users can read own activities"
  on public.completed_activities for select using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.completed_activities for insert with check (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.completed_activities for delete using (auth.uid() = user_id);

-- Indexes
create index idx_activities_user on public.completed_activities(user_id);
create index idx_activities_date on public.completed_activities(completed_at desc);
```

4. Vai a **Authentication → Email Templates** e personaliza o email de confirmação com a marca IMPULSO (opcional)

---

## 2. RevenueCat — Monetização

1. Vai a [revenuecat.com](https://www.revenuecat.com) → cria conta gratuita
2. Cria um novo **Project** chamado `impulso`
3. Adiciona a plataforma **iOS**:
   - Bundle ID: `com.menteprospera.impulso`
4. Adiciona a plataforma **Android**:
   - Package: `com.menteprospera.impulso`
5. Vai a **API Keys** → copia a chave iOS (`appl_...`) e Android (`goog_...`)
6. Mete as keys no `.env`:
```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_SUA_CHAVE_IOS
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_SUA_CHAVE_ANDROID
```
7. Cria os **Products** no RevenueCat:
   - `impulso_pro_monthly` — R$14,90/mês
   - `impulso_pro_yearly` — R$99,90/ano
8. Cria um **Entitlement** chamado exactamente `pro` e liga os dois produtos

> Nota: os produtos precisam de estar também configurados no App Store Connect e Google Play Console antes de aparecerem no RevenueCat.

---

## 3. EAS Build — Compilar para iPhone

### Pré-requisitos
- Conta em [expo.dev](https://expo.dev) (grátis)
- Conta Apple Developer (99 USD/ano) — necessária para distribuição real

### Comandos

```bash
cd "Mauro code/impulso"

# 1. Login na tua conta Expo
eas login

# 2. Liga ao projecto (faz uma vez)
eas init

# 3. Build para Simulator iOS (não precisa Apple Developer)
eas build --platform ios --profile development

# 4. Build para dispositivo físico (precisa Apple Developer)
eas build --platform ios --profile preview
```

O build corre nos servidores da Expo (~10-15 min). No fim recebes um link para instalar.

### Testar agora com Expo Go (sem build)
```bash
npx expo start
# Faz scan do QR code com o iPhone (app Expo Go)
```

---

## 4. App Store — Submissão

### Pré-requisitos
- Conta Apple Developer ($99/ano): [developer.apple.com](https://developer.apple.com)
- App criada no App Store Connect
- Screenshots do app (6.7" e 5.5" obrigatórios)
- Ícone 1024×1024 sem transparência

### Passos

1. Cria a app em [appstoreconnect.apple.com](https://appstoreconnect.apple.com):
   - Bundle ID: `com.menteprospera.impulso`
   - Nome: IMPULSO
   - Categoria: Health & Fitness
2. Preenche o `eas.json` com o teu Apple Team ID:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "O_TEU_APPLE_ID@email.com",
      "ascAppId": "ID_DA_APP_NO_APP_STORE_CONNECT",
      "appleTeamId": "O_TEU_TEAM_ID"
    }
  }
}
```
3. Build de produção + submit:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

## 5. Google Play — Submissão Android

1. Cria conta Google Play Developer ($25 uma vez): [play.google.com/console](https://play.google.com/console)
2. Cria a app com package `com.menteprospera.impulso`
3. Gera o service account key e guarda em `./google-service-account.json`
4. Build e submit:
```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## 6. Variáveis de ambiente — Referência completa

```bash
# .env (local, não entra no git)
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
```

Para builds EAS, as variáveis de ambiente têm de ser configuradas também no painel expo.dev:
- Vai a expo.dev → projecto impulso → **Environment Variables**
- Adiciona as mesmas 4 variáveis

---

## Contacto

Criado por [@menteprospera24](https://instagram.com/menteprospera24)
