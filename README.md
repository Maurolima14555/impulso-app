# IMPULSO

> "Não perdeste o dia. Ainda há tempo para crescer."

IMPULSO é uma app mobile que redireciona utilizadores das redes sociais para actividades de crescimento pessoal. Quando detecta tempo excessivo no Instagram, TikTok ou Twitter, envia uma notificação positiva e sugere uma actividade alternativa — leitura, meditação, exercício, journaling.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo SDK |
| Linguagem | TypeScript |
| Navegação | React Navigation v6 (Stack) |
| Backend / Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Notificações | expo-notifications |
| UI | StyleSheet nativo (sem UI lib) |

---

## Correr Localmente

**Pré-requisitos:** Node 18+, Expo CLI, iOS Simulator ou dispositivo físico.

```bash
# 1. Clonar o repositório
git clone https://github.com/Maurolima14555/impulso-app.git
cd impulso-app

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edita .env com as tuas credenciais Supabase

# 4. Correr
npx expo start
```

Abre o QR code com a app **Expo Go** no teu telemóvel, ou prime `i` para iOS Simulator.

---

## Estrutura do Projecto

```
impulso/
  src/
    screens/         # Ecrãs principais da app
    components/      # Componentes reutilizáveis
    hooks/           # Custom hooks
    lib/
      supabase.ts    # Cliente Supabase
    navigation/
      AppNavigator.tsx
    types/
      index.ts       # TypeScript types globais
  App.tsx            # Entry point
  .env.example       # Variáveis de ambiente (template)
```

---

## Roadmap MVP — 8 Semanas

### Semana 1–2: Fundação
- [x] Setup Expo + TypeScript + React Navigation
- [x] Ecrã de Onboarding
- [x] HomeScreen com identidade visual
- [x] Cliente Supabase configurado
- [ ] Autenticação (email/password via Supabase Auth)

### Semana 3–4: Core Feature
- [ ] Integração com Screen Time API (iOS) / Digital Wellbeing (Android)
- [ ] Sistema de notificações: detectar >30 min numa app social
- [ ] Biblioteca de actividades de crescimento
- [ ] Lógica de sugestão contextual (ex: "10 min de leitura?")

### Semana 5–6: Persistência e Progresso
- [ ] Registo de actividades completadas (Supabase)
- [ ] Dashboard com streak e minutos ganhos
- [ ] Perfil de utilizador

### Semana 7: Monetização
- [ ] Plano Free vs Pro
- [ ] Integração de pagamentos (RevenueCat)
- [ ] Paywall suave (actividades ilimitadas no Pro)

### Semana 8: Lançamento
- [ ] Testes em dispositivos reais
- [ ] Submissão à App Store e Google Play
- [ ] Campanha de lançamento via @menteprospera24

---

## Monetização

| Plano | Preço | Inclui |
|---|---|---|
| Free | Grátis | 3 actividades, notificações básicas |
| Pro Mensal | R$14,90/mês | Actividades ilimitadas, estatísticas, sem anúncios |
| Pro Anual | R$99,90/ano | Tudo do Pro + desconto de 44% |

---

## Go-to-Market

Distribuição inicial via **@menteprospera24** (Instagram, 15k+ seguidores) com foco em:
- Conteúdo orgânico sobre produtividade e crescimento pessoal
- Stories com before/after (tempo em redes sociais → actividades concluídas)
- Link na bio → landing page → download

---

## Contribuir

Pull requests são bem-vindos. Abre uma issue primeiro para discutir o que gostarias de mudar.

---

## Licença

MIT
