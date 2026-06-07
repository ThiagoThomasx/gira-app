# Plano de Teste Externo — Gira.app V1

Data: Junho de 2026  
Status: 🟢 Pronto para iniciar

---

## Objetivo

Validar se o Gira.app é **compreensível, divertido e útil** para usuários reais que nunca viram o produto antes, sem qualquer explicação prévia.

Não queremos testar desempenho técnico — queremos testar se a experiência faz sentido e entrega valor percebido.

---

## Perfil dos testers

| Perfil | Prioridade | Por quê |
|---|---|---|
| Amigos próximos do criador | Alta | Feedback honesto e rápido |
| Mulheres em relacionamentos | Alta | Caso de uso real (Casal à Distância) |
| Pessoas que usam app de decisão | Média | Comparação de expectativas |
| Pessoas não-técnicas | Alta | Valida clareza do produto |
| Devs / design | Baixa | Feedback técnico não é o foco agora |

**Meta:** 5–10 testers externos nessa rodada.

---

## O que observar

### Compreensão
- O usuário entende o que o app faz em < 60 segundos?
- A navegação (abas) é intuitiva?
- O conceito de "personalidade" faz sentido sem explicação?
- Os modos de jogo são auto-explicativos?

### Engajamento
- O usuário quis girar de novo?
- Achou graça em alguma frase da personalidade?
- Explorou mais de uma funcionalidade espontaneamente?
- Mencionou algum caso de uso próprio?

### Dificuldades
- Onde o usuário travou?
- Algum texto confundiu?
- Alguma ação não funcionou como esperado?
- O usuário precisou de ajuda para alguma etapa?

### Valor percebido
- O usuário viu utilidade real?
- Mencionou contexto em que usaria?
- Perguntou sobre features que não existem?

---

## Critérios de sucesso

A rodada de testes será considerada positiva se:

- [ ] **Compreensão imediata:** ≥ 70% dos testers entende o app sem explicação
- [ ] **Criação independente:** ≥ 70% consegue criar uma roleta sozinho
- [ ] **Giro compreendido:** 100% entende o resultado após girar
- [ ] **Template útil:** ≥ 1 template considerado relevante por cada tester
- [ ] **Sem bug crítico:** nenhum bug que impeça o uso básico em produção
- [ ] **Intenção de reuso:** ≥ 60% dos testers diz que usaria de novo em algum contexto

---

## Fluxos mínimos para testar

Cada tester deve completar pelo menos:

1. **Criar uma roleta do zero** → girar → aceitar resultado
2. **Usar um template** → girar
3. **Usar o Destino do Dia**
4. **Ver o histórico**

Fluxos opcionais (mas valiosos):
- Testar Melhor de 3 ou Eliminação
- Editar uma roleta
- Excluir uma roleta
- Usar o Casal à Distância

---

## Como registrar feedback

### Durante o teste (se observação direta)
- Anote em qual tela o usuário pausou ou expressou dúvida
- Registre a fala espontânea ("não entendi", "que legal", "isso aqui...")
- Não explique nada enquanto o usuário explora — deixe travar

### Após o teste
- Use as perguntas do `FEEDBACK_TESTERS.md`
- Pode ser via WhatsApp, formulário ou conversa
- Registro mínimo: 3 pontos positivos + 3 pontos negativos + nota de 1–10

### Planilha de acompanhamento (sugerida)
| Tester | Perfil | Nota | Criou roleta? | Bug? | Usaria de novo? | Top feedback |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |

---

## Próximas decisões após feedback

Com base nos resultados, decidir:

| Cenário | Ação |
|---|---|
| Usuários travam na criação de roleta | Criar onboarding ou simplificar editor |
| Personalidades não fazem sentido | Melhorar descrições no seletor |
| Modos de jogo confusos | Adicionar tooltip ou tela de ajuda |
| Bug crítico encontrado | Corrigir antes de ampliar base de testers |
| Pedido recorrente de feature | Adicionar ao topo do roadmap |
| Alta nota + pedido de reuso | Considerar PWA e compartilhamento |
| Template Casal à Distância positivo | Criar mais templates temáticos |

---

## Timeline sugerida

| Fase | Prazo |
|---|---|
| Envio para testers | Semana 1 |
| Coleta de feedback | Semana 1–2 |
| Análise e síntese | Semana 2 |
| Decisão sobre V1.1 | Semana 3 |
| Início do próximo ciclo | Semana 3–4 |

---

## Recursos

- **App:** [gira-app.vercel.app](https://gira-app.vercel.app)
- **Guia para testers:** `docs/FEEDBACK_TESTERS.md`
- **Mensagens prontas:** `docs/MESSAGE_TO_TESTERS.md`
- **QA técnico:** `docs/QA_V1.md`
- **Changelog:** `docs/CHANGELOG.md`
