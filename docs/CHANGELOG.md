# Changelog — Gira.app

Todas as mudanças relevantes do projeto são registradas aqui.

---

## V1.0 — Primeira versão utilizável

> Data de lançamento: Junho de 2026  
> Status: Em teste externo 🟢

### Fundação visual e estrutura

- Paleta de cores definida (`#FFF8F0`, `#E07B54`, `#84A98C`, `#1C1917`)
- Layout inner-scroll mobile-first com `h-svh flex flex-col`
- Bottom navigation com 5 abas: Home, Explorar, Girar, Histórico, Configurações
- Navegação por estado (`AppView`) — sem React Router
- Componentes base: `Button`, `Card`, `Badge`, `EmptyState`, `PageHeader`
- TailwindCSS v4 configurado com `@theme {}` e `@tailwindcss/vite`

### Store e persistência

- Zustand 5 com `persist` middleware (`gira-app-storage` no LocalStorage)
- Estado global: `roulettes`, `history`, `dailyDestiny`, `preferences`
- Ações: criar, editar, excluir, fixar roleta; adicionar/limpar histórico; preferências; destino do dia
- `deleteRoulette` com limpeza de `lastActiveRouletteId`

### Roleta SVG funcional

- Geração de segmentos SVG com cores por opção
- Fix para roleta com 1 opção (círculo completo via dois semicírculos)
- Animação de giro com `Framer Motion` e duração parametrizada
- Resultado calculado com `weightedRandomPick` baseado em rotação final

### Editor de roletas

- Criar e editar roletas com nome, descrição, opções, personalidade e modo de jogo
- Validação com feedback inline (nome obrigatório, mínimo 2 opções)
- `OptionEditor` com Enter-navigation, drag de pesos (0.5× a 3×), cores automáticas
- `PersonalitySelector` e `GameModeSelector` com estados visuais claros
- **Zona de perigo:** exclusão com confirmação de dois passos (bloco 7.2)

### Templates

- 11 templates prontos nas categorias: dia a dia, casal, comida, entretenimento, trabalho, autocuidado, tarefas, amigos, desafios
- Cada template define opções, personalidade e modo recomendados
- Abertura no editor pré-preenchido; usuário pode editar antes de salvar

### Personalidades

- 8 personalidades: Dramática, Debochada, Fofa, Honesta, Vilã, Conselheira, Caótica, Profissional
- Cada uma com frases `before`, `during` e `after` para narrar o giro
- Selecionável por roleta; padrão configurável em Configurações

### Modos de jogo

- **Clássico:** gira uma vez, aceita o resultado
- **Melhor de 3:** 3 rodadas, vencedor por maioria; empate resolvido pela última rodada
- **Veto:** remove opções indesejadas antes do giro; aviso quando sobram < 2
- **Eliminação:** cada giro elimina a opção sorteada até restar 1 campeã
- Painéis contextuais: `compact` (mobile) e `card` (desktop) para cada modo
- Histórico salvo apenas no resultado final; intermediários não registrados

### Histórico

- Registro de até 100 giros com: opção sorteada, roleta, personalidade, modo, data e hora
- Cards com borda colorida (cor da opção), badge de modo (exceto Clássico)
- Limpeza com confirmação de dois passos

### Destino do Dia

- Uma roleta aleatória por dia via chave `YYYY-MM-DD` em horário local
- Banner na Home: disponível (laranja) ou concluído (verde)
- Estado persiste entre sessões; reseta automaticamente no novo dia
- Navegar para o banner concluído volta para a roleta usada

### Seletor de roleta

- Sheet animado na SpinPage para trocar de roleta sem sair da tela
- Lista todas as roletas; roleta ativa com check laranja
- "Criar nova roleta" no footer
- Troca reseta sessão do modo de jogo em andamento

### Layout responsivo

- Mobile: coluna única, bottom nav, painel de modo compacto
- Desktop (≥1024px): SpinPage em dois painéis, grids com mais colunas, sem bottom nav
- `useMediaQuery` hook para detecção JS-side

### Template especial: Casal à Distância

- 12 opções para encontros remotos entre casais
- Personalidade Conselheira + modo Melhor de 3
- Criado com carinho para usuárias em relacionamentos à distância

### Polimento V1 (bloco 7)

- Copy melhorado em todas as páginas
- HistoryPage: cards ricos com cor de acento, hora no timestamp, badge de modo
- SettingsPage: tom da personalidade exibido, seção "Dados" com limpeza
- ExplorePage: busca com botão X, empty state contextual, badges de modo nos templates
- EditorPage: placeholders mais descritivos, hints nas seções

### Testes automatizados

- Vitest 4 + jsdom + Testing Library configurados
- **199 testes** em 10 arquivos cobrindo: utils de data, editor, spin, modos de jogo, store, templates, personalidades, destino do dia, fluxo de editor, exclusão segura

### Deploy

- Vercel com deploy contínuo a partir da branch `main`
- Build de produção em ~500ms, bundle ~410kB (gzip ~126kB)

---

## Próxima versão planejada: V1.1

> Aguardando feedback do teste externo para priorizar

- [ ] PWA
- [ ] Compartilhar resultado
- [ ] Onboarding
- [ ] Estatísticas engraçadas
- [ ] Mais templates especiais
