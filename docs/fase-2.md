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

## Desdobramento — o PR #116 e a resposta da organização (2026-10-26)

O PR do framework foi **encerrado pela org com revisão respeitosa** — recusa de direção,
não de qualidade ("o trabalho foi feito com cuidado, e li tudo"). Os pontos, e o que
significam para este projeto:

1. **"Core é apenas o sistema de mods"** — a tradução da interface é conversa **com a Venus
   Dev e com a org antes de PR**; o canal é o Discord de modding (#mod-development), onde
   fomos convidados.
2. **A org está removendo os mods do repositório** para distribuí-los via **kit publicado** —
   o que torna obsoleta toda a rota "PR do mod → main": no mundo novo, o mod vira um kit.
   E o transform build-time não alcançaria as telas de mods; a tradução de UI, se a org a
   quiser, deveria vir por `t()` dentro do próprio kit.
3. **Encapsulamento por estrutura é arriscado** (um valor comparado pode virar chave) —
   ponto legítimo; nosso pack mitiga deixando as ~70 chaves de código sem tradução.
4. **Tabelas de label avaliam `t()` no import, antes do pack** — **bug real, e nosso**;
   corrigido no fork (commit `e1319d1`): leitura síncrona no boot via `lang:bootSync`,
   idioma lembrado em `data/lang/active`, App importado dinamicamente depois do dicionário.
5. O bump do Electron, em PR separado — anotado para qualquer futuro retorno ao upstream.

**Estratégia a partir daqui**: distribuição **fork-only** (o fork funciona e foi testado em
jogo); a metade prosa do mod segue valendo e, no mundo do kit, vira kit também; a conversa
de UI vai pro Discord #mod-development e, no horizonte do jogo oficial, pra Venus Dev —
i18n nativo no jogo seria o melhor lar do catálogo.

## Próxima fase — PENDENTE DE AUTORIZAÇÃO

Sem PRs ao upstream até a conversa do Discord acontecer. Candidatos, em ordem:
1. **Discord #mod-development** (o usuário leva os rascunhos prontos: resposta ao PR e post
   de abertura)
2. **Manutenção do fork**: revisão das 167 entradas rascunhadas em jogo; correções no
   catálogo e ressincronização em `assets/lang/pt-BR.json`
3. **Fase 3** (hooks no core para text ledger, bunnybot, segredos etc.) — ganha nova
   relevância com o kit: hooks que o kit expõe definirão o que um mod alcança
4. **Fase 5** (patcher do jogo oficial) — inalterada pelo desdobramento; o catálogo é o
   mesmo para os dois alvos

