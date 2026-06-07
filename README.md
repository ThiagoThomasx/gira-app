# 🎯 Gira.app

> Uma roleta de decisão com personalidade para transformar pequenas escolhas em momentos leves, divertidos e memoráveis.

**[→ Abrir o app](https://gira-app.vercel.app)**

---

## O problema que resolve

"O que a gente faz hoje?" — essa pergunta custa tempo, energia e às vezes termina em briga. O Gira.app transforma indecisões em momentos de diversão. Em vez de ficar em loop, você gira a roleta e aceita o destino.

Funciona para decidir o jantar, escolher uma atividade para o casal, distribuir tarefas, ou simplesmente deixar o universo escolher por você.

---

## Funcionalidades da V1

| Funcionalidade | Descrição |
|---|---|
| 🎲 Criar roletas | Crie com nome, opções, pesos e personalidade |
| ✏️ Editar roletas | Modifique qualquer roleta existente |
| 🗑️ Excluir roletas | Exclusão com confirmação para evitar acidentes |
| 📋 Templates | 11 templates prontos para usar em segundos |
| ⚖️ Pesos por opção | Favoreça opções que aparecem com mais frequência |
| 🎭 Personalidades | 8 tons diferentes de narração durante o giro |
| 🎮 Modos de jogo | 4 modos: Clássico, Melhor de 3, Veto, Eliminação |
| 📜 Histórico | Registro dos giros com personalidade, modo e horário |
| 🌟 Destino do Dia | Uma decisão especial por dia com roleta aleatória |
| 💾 Persistência | Tudo salvo em LocalStorage — sem login, sem servidor |
| 📱 Responsivo | Mobile-first com layout adaptado para desktop |

---

## Modos de jogo

### 🎯 Clássico
Gira uma vez e aceita o destino. Simples, direto.

### 🏆 Melhor de 3
Três rodadas. A opção mais sorteada vence. Em caso de empate, a última rodada decide.

### 🚫 Veto
Antes de girar, escolha quais opções eliminar. O destino age sobre o que sobrar.

### ⚡ Eliminação
A cada giro, uma opção cai fora. O processo continua até restar apenas uma campeã.

---

## Templates disponíveis

| Template | Categoria | Modo recomendado |
|---|---|---|
| O Que Fazer Agora | Dia a dia | Clássico |
| Noite de Casal | Casal | Melhor de 3 |
| **Casal à Distância** ✨ | Casal | Melhor de 3 |
| O Que Comer? | Comida | Veto |
| Filme ou Série? | Entretenimento | Eliminação |
| Qual Tarefa Primeiro? | Trabalho | Clássico |
| Pausa no Trabalho | Trabalho | Clássico |
| Autocuidado de Hoje | Autocuidado | Clássico |
| Tarefas Domésticas | Tarefas | Clássico |
| Rolê com Amigos | Amigos | Melhor de 3 |
| Desafio Rápido | Desafios | Clássico |

---

## ✨ Destaque: Template "Casal à Distância"

Um template especial para casais que estão longe fisicamente mas querem dividir tempo, presença e pequenos rituais.

**12 opções pensadas para encontros remotos:**
- Assistir um filme juntos em chamada
- Noite de mistério ou detetive
- Ler o mesmo capítulo e comentar depois
- Jantar por chamada de vídeo
- Escolher fotos antigas e relembrar histórias
- Fazer uma playlist um para o outro
- Jogar algo online simples
- Responder perguntas de casal
- Planejar o próximo encontro
- Ver um episódio de série juntos
- Fazer uma chamada sem fazer nada, só companhia
- Cada um escolhe uma música e explica o motivo

Personalidade recomendada: **Conselheira** 🧘 — tom calmo e cuidadoso.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Bundler | Vite 8 |
| UI | React 19 + TypeScript 6 |
| Estilo | TailwindCSS v4 (sem config, via `@theme {}`) |
| Animações | Framer Motion 12 |
| Estado | Zustand 5 com `persist` middleware |
| Persistência | LocalStorage (`gira-app-storage`) |
| Testes | Vitest 4 + Testing Library + jsdom |
| Deploy | Vercel |

---

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/gira-app.git
cd gira-app

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## Scripts disponíveis

```bash
npm run dev           # Servidor de desenvolvimento com HMR
npm run build         # Build de produção (TypeScript + Vite)
npm run test          # Roda todos os testes uma vez
npm run test:watch    # Roda testes em modo watch
npm run test:coverage # Relatório de cobertura de testes
npm run preview       # Pré-visualiza o build de produção
```

---

## Testes

O projeto conta com **199 testes automatizados** em 10 arquivos:

```
src/test/
├── data/
│   ├── personalities.test.ts    (7 testes)
│   └── templates.test.ts       (16 testes)
├── store/
│   ├── useAppStore.test.ts     (18 testes)
│   ├── daily-destiny.test.ts   (14 testes)
│   ├── editor-flow.test.ts     (16 testes)
│   └── delete-roulette.test.ts (12 testes)
└── utils/
    ├── date.test.ts            (16 testes)
    ├── editor.test.ts          (29 testes)
    ├── gameModes.test.ts       (44 testes)
    └── spin.test.ts            (27 testes)
```

```bash
npm run test
# → 10 arquivos, 199 testes, ~2s
```

---

## Deploy

O app está publicado na Vercel com deploy contínuo a partir da branch `main`.

**[→ gira-app.vercel.app](https://gira-app.vercel.app)**

---

## Roadmap

### Próximas features planejadas
- [ ] PWA (instalar no celular)
- [ ] Compartilhar resultado como imagem/card
- [ ] Onboarding para novos usuários
- [ ] Estatísticas engraçadas ("você já girou 42 vezes sem aceitar pizza")
- [ ] Mais frases por personalidade
- [ ] Mais templates especiais (viagem, treino, filmes específicos)
- [ ] Exportar roleta para compartilhar com amigos

### Decisões após teste externo
- Ajustar copy baseado em confusão dos usuários
- Priorizar feature mais pedida
- Avaliar necessidade de onboarding

---

## Status do projeto

```
🟢 V1.0 — Em teste externo
```

- 199 testes passando
- Build de produção limpo
- Deploy ativo na Vercel
- Documentação completa

---

## Licença

MIT — livre para uso, estudo e inspiração.
