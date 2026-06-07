# QA Manual — Gira.app V1

Checklist de testes manuais antes da primeira rodada com usuários reais.  
Executar em **mobile (375px)** e **desktop (1280px)**.

---

## 1. Onboarding / Primeiro acesso

- [ ] App abre em tela em branco sem erros no console
- [ ] HomePage exibe header "Gira.app" + banner "Destino do dia"
- [ ] Seção "Minhas Roletas" exibe estado vazio com botão "Criar minha primeira roleta"
- [ ] Templates em destaque aparecem em scroll horizontal (mobile) / grid (desktop)

---

## 2. Criar roleta

- [ ] Botão "Nova" / "Criar minha primeira roleta" abre EditorPage
- [ ] Campo nome exibe placeholder "Ex: O que comer hoje? 🍕"
- [ ] Campo descrição exibe placeholder correto
- [ ] Salvar sem nome exibe erro "Nome da roleta é obrigatório."
- [ ] Salvar com menos de 2 opções exibe erro "Adicione pelo menos 2 opções com nome."
- [ ] Adicionar opção via botão "+ Adicionar" funciona
- [ ] Pressionar Enter em um campo de opção avança pro próximo
- [ ] Remover opção está desabilitado quando só há 2 (ícone com tooltip)
- [ ] Slider de peso funciona (0.5× a 3×)
- [ ] Selector de personalidade funciona
- [ ] Selector de modo de jogo funciona (todos os 4 modos selecionáveis)
- [ ] "Salvar e girar" redireciona para SpinPage com a roleta criada

---

## 3. Editar roleta

- [ ] Botão "Editar" na lista abre EditorPage com dados preenchidos
- [ ] Todas as alterações (nome, opções, personalidade, modo) são salvas
- [ ] "Salvar" (modo edição) redireciona para SpinPage
- [ ] Botão voltar (←) cancela sem salvar

---

## 4. Girar — Modo Clássico

- [ ] SpinPage abre com a roleta correta selecionada
- [ ] Roda SVG exibe todas as opções com cores distintas
- [ ] Botão "Girar" inicia animação de spin
- [ ] Após spin: card de resultado aparece com nome da opção
- [ ] Frase da personalidade aparece corretamente
- [ ] "Aceitar" registra no histórico e volta ao estado inicial
- [ ] "Girar de novo" reinicia sem salvar no histórico

---

## 5. Girar — Modo Melhor de 3

- [ ] Painel de rodadas aparece (compact mobile / card desktop)
- [ ] Após 3 rodadas, o vencedor por maioria é exibido
- [ ] Empate 1-1-1 é resolvido pela última rodada
- [ ] Resultado final exibe "🏆" e botão "Aceitar campeã"
- [ ] Aceitar registra no histórico

---

## 6. Girar — Modo Veto

- [ ] Chips de opções aparecem; cada chip tem botão "Vetar"
- [ ] Opção vetada fica riscada / acinzentada
- [ ] Quando restam menos de 2 disponíveis, aviso aparece
- [ ] "Girar" funciona apenas com ≥ 2 disponíveis
- [ ] Resultado sai somente entre as não-vetadas
- [ ] "Retomar" remove o veto de uma opção

---

## 7. Girar — Modo Eliminação

- [ ] Painel "Na arena" / "Eliminadas" aparece
- [ ] A cada giro, a opção sorteada é eliminada (vai para "Eliminadas")
- [ ] Quando sobra 1, exibe resultado final com "👑"
- [ ] Aceitar registra no histórico

---

## 8. Destino do dia

- [ ] Banner "Destino do dia" aparece em HomePage
- [ ] Clicar escolhe uma roleta aleatória e navega para SpinPage
- [ ] Após primeiro giro, banner muda para "Destino de hoje decidido ✓" (verde)
- [ ] No dia seguinte, banner volta ao estado disponível (testar trocando a data do sistema)
- [ ] Clicar no banner concluído volta para a roleta usada

---

## 9. Seletor de Roleta (SpinPage)

- [ ] Ícone de troca exibe RouletteSelector (sheet animado)
- [ ] Lista todas as roletas criadas
- [ ] Roleta ativa tem check laranja
- [ ] Selecionar outra roleta troca a roda e reseta qualquer sessão em andamento
- [ ] "Criar nova roleta" no footer abre EditorPage

---

## 10. Histórico

- [ ] Giros aparecem com: cor de acento, emoji de personalidade, nome da opção, roleta, data+hora
- [ ] Modo de jogo aparece como badge (exceto Clássico)
- [ ] Estado vazio exibe copy correto + botão "Ir girar agora"
- [ ] Botão "Limpar" pede confirmação antes de apagar
- [ ] "Cancelar" aborta a limpeza

---

## 11. Explorar

- [ ] Todos os templates aparecem em grid
- [ ] Busca filtra por nome e descrição
- [ ] Campo busca tem botão X para limpar
- [ ] Estado vazio com busca sem resultado exibe link "veja todos"
- [ ] Botão "Usar" abre EditorPage com o template preenchido
- [ ] Badge de modo aparece nos templates com modo ≠ Clássico

---

## 12. Configurações

- [ ] Stats: número correto de roletas e giros
- [ ] Personalidade padrão: exibe nome + tom (ex: "Irônica e sem filtro")
- [ ] Selecionar personalidade salva e persiste ao reabrir
- [ ] Seção "Dados": exibe contagem de giros
- [ ] "Limpar histórico" pede confirmação
- [ ] After clear: contador de giros vai a 0
- [ ] Versão exibida no card "Sobre"

---

## 13. Responsividade

- [ ] Mobile (375px): bottom nav visível, SpinPage coluna única, roleta centralizada
- [ ] Tablet (768px): layout transicional sem quebra
- [ ] Desktop (1280px): SpinPage em dois painéis, grids com mais colunas, sem bottom nav
- [ ] EditorPage: max-width 672px centralizado no desktop

---

## 14. Persistência

- [ ] Recarregar a página mantém: roletas, histórico, personalidade padrão
- [ ] Destino do dia persiste entre recarregamentos (no mesmo dia)
- [ ] Última roleta ativa lembrada ao voltar para SpinPage

---

## 15. Edge cases

- [ ] Roleta com 1 opção: roda SVG renderiza círculo completo (sem crash)
- [ ] Roleta com muitas opções (10+): roda ainda renderiza
- [ ] Nome de opção muito longo: trunca com "..." nos chips/cards
- [ ] Sem roletas: SpinPage exibe estado vazio com CTA para criar
- [ ] Deletar roleta que estava ativa: SpinPage deve degradar graciosamente

---

## 16. Performance e build

- [ ] `npm run build` completa sem erros
- [ ] `npm run test` — todos os testes passam (179+)
- [ ] Nenhum erro ou warning de console na navegação normal
- [ ] Animações suaves (sem jank) em mobile

---

*Atualizado: Bloco 7 — Polimento V1*
