# Fase 2 — Tradução da camada autoral (concluída em 2026-10-25)

A UI, a introdução e os posts de estranhos traduzidos por **um mecanismo só**: o framework
i18n adaptado do VenusTraining, modernizado e dividido em duas entregas — o framework
genérico para o `core`, o catálogo e o wiring no mod.

## As duas branches do build

| Branch | Commit | Conteúdo |
| --- | --- | --- |
| `framework/i18n` | `4e0a6ec` | O framework inerte: transform Vite (AST→`t()`), `t.ts`, `langPack.ts` (código genérico BCP 47, dois roots de leitura), `langService`, IPC `lang:read`, `langStore` (remount por versão), bridge web (sem packs), 21 testes |
| `mod/traducao-ptbr` | `8c03b1d` (merge) + `10d0169` | Merge do framework + `assets/lang/pt-BR.json` + wiring no entry: a escolha "Idioma" governa prosa **e** interface |

## O que o transform cobre (extensões sobre o VenusTraining)

- **Templates**: sem expressão = string (envolve inteiro); com expressão = envolve só as
  partes estáticas (a data da intro entra em inglês formatado, o resto traduz em volta) —
  a introdução **nunca** foi traduzida nem no VenusTraining; agora é
- **Conteúdo autoral**: `introScript.ts` (linhas do scroll + boas-vindas) e `feedRandoms.ts`
  (posts de estranhos + `strangersOnly(...)`) — com as guardas: `isSentence` para não pegar
  handles/`Set` de código, e os vizinhos que **alimentam o prompt** (`colds.ts`,
  `ORIENTATION_PREMISE`) ficam inglês por design
- **Extração**: `i18n-extracted.json` (gitignored) com as 1.075 chaves da 0.5.0

## O catálogo

- `lang/pt-BR.json`: **1.843 entradas** — as 1.676 do VenusTraining + 167 novas
- **1.005/1.075** chaves da extração cobertas; as 70 restantes são valores de código
  (cursors CSS, seletores, `image/png`, teclas, comandos do bot, nomes próprios) — vazio =
  pass-through em inglês, que é o valor que o código espera
- `lang/pt-BR.overlay.json`: o rascunho assistido desta rodada (167 entradas) — **pendente de
  revisão em jogo** pelo dono do projeto; UI nova (ComfyUI, tela de Mods, tags de
  relacionamento) + ~100 posts de estranhos com as referências preservadas
- `tools/delta.mjs`: novas/mortas/near-matches/colisões por caixa (22 pares legítimos:
  "DAY"/"Day" são strings de UI distintas)

## Decisões tomadas nesta fase

1. **Um switch só**: o grupo "Idioma" do mod governa prosa E interface (framework inerte no
   core; o mod liga) — recusa do core → fork-only, sem perda técnica.
2. **Código de idioma genérico** (padrão BCP 47), não a lista fixa do VenusTraining —
   qualquer idioma futuro pode ter pack; o padrão blinda path traversal.
3. **Dois roots**: `data/lang` (jogador/mod, vence) e `assets/lang` (o que o build traz).
4. **Valores de código não se traduzem** — melhor inglês a código quebrado.
5. Dependência nova do build: `@babel/parser` (a versão do VenusTraining, 7.29.9).

## Verificação executada

- `npm run typecheck` · `npm test` (137 arquivos, 1.791 testes) · `npm run build` — verdes nas
  duas branches
- 21 testes novos (transform × 9, langPack × 6, langService × 6)
- Pack lido sob as próprias regras do serviço: 1.843 linhas, todas string, nenhuma vazia
- **Pendente**: revisão em jogo das 167 entradas rascunhadas (abrir o jogo com o mod ligado e
  ler a UI/intro/posts) — é a aceitação da fase

## Próxima fase (Fase 3 — hooks novos no core) — PENDENTE DE AUTORIZAÇÃO

Cobrir as chamadas de LLM sem hook: text ledger (memórias de DM — os "resumos em inglês" do
teste de jogo), bunnybot, segredos, ocasiões, quizzes, fatos de aula, perfis, posts de
encerramento, graduação. PR próprio para o `core`, ao lado dos hooks existentes. Antes disso:
publicação (gh auth pendente desde a Fase 0) — `framework/i18n` para revisão primeiro, o PR
do mod depois.
