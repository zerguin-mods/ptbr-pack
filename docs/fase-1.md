# Fase 1 — Protótipo do mod (concluída em 2026-10-23)

O mod de tradução em si, criado na branch `mod/traducao-ptbr` do clone do build
(commit `6110c63`, sobre `core` `16da338`, jogo v0.5.0), com **zero edição em
arquivos do jogo**: o mod entra só pelos hooks verificados na Fase 0.

## O que foi criado (6 arquivos, 328 linhas)

| Arquivo | Papel |
| --- | --- |
| `build/src/shared/traducaoPtbr.ts` | A identidade do mod: `TRADUCAO_PTBR`, o grupo `idioma`, as opções `pt-br`/`en`, o tipo `GameLanguage`. Folha, sem imports |
| `build/src/shared/modEntries/traducao-ptbr.ts` | O `ModDef` — textos em PT-BR para o público do mod |
| `build/src/renderer/prompts/languageDirective.ts` | O wording preservado do VenusTraining + os wrappers `withProseLanguage`/`withLedgerLanguage` |
| `build/src/renderer/modEntries/traducao-ptbr.ts` | Os hooks: `requests.{scene,dm,slot-intro,ledger}` + `prompts.character` |
| `build/test/traducaoPtbr.test.ts` | 6 testes: forma registrada, defaults do grupo, wording exato, pass-through em inglês |
| `build/docs/mods/traducao-ptbr.md` | O guia do mod, no padrão de `docs/mods/` (em inglês, como o resto do repo) |

## Decisões tomadas nesta fase

1. **Posição do wording: fim do system, via `requests.*`** — o placement testado
   em jogo pelo VenusTraining, como a diretiva de idioma mapeava. Geração de
   personagem, que o build só entrega como linhas, leva o wording no user block
   (`prompts.character`), acima dos enums de pose/expressão que a linha segura
   em inglês.
2. **Escolha de idioma: option group `idioma`** (`pt-br` default, `en`), conforme
   a diretiva planejava. Inglês não envia linha alguma — request passa direto,
   como com o mod desligado.
3. **`scope: 'anytime'`, `defaultOn: false`** — um save não depende do idioma da
   prosa; e "off until the player turns it on, as every new mod in the build
   ships" (regra observada no `mini-games`).
4. **Textos do `ModDef` em português** — nome, blurb, offNote, labels e hints;
   o público do mod é quem o procura.
5. **Autoria/versão**: `Zerguin-Mods`, `0.1.0`.

## Restrição descoberta (importante para as próximas fases)

O módulo shared de um mod **não pode importar de volta de `mods.ts`**: o
`import.meta.glob` eager de `mods.ts` carrega o entry, e um import de volta
cria um ciclo que deixa o entry `undefined` na lista `MODS` (4 testes falharam
assim até o módulo virar folha). É o padrão da casa: `photoSwitches` recebe os
switches via setter; `story-memory` lê a opção inline no hook, no renderer —
que é o que o nosso entry faz (`optionOn(useModsStore.getState().switches, …)`).

## Verificação executada

- Wording **byte a byte idêntico** ao original preservado em
  `docs/fontes/venustraining-v0.4.0/languageDirective.ts` (comparação por
  script, as 4 linhas).
- `npm run typecheck` — limpo (node, web, test).
- `npm test` — **135 arquivos, 1770 testes passando** (1 skip pré-existente).
- `npm run build` — build de produção limpo (o glob do renderer resolve os
  entries).
- O que falta: leitura em jogo com modelo vivo (`npm run dev` + chave), lendo
  cena, DM, abertura de slot e memórias em PT com nomes/tags/charKeys em inglês.

## Lacunas conhecidas (documentadas no guia do mod)

O que o build não entrega a mods continua em inglês: text ledger (memórias de
texto), segredos, ocasiões, quizzes, fatos de aula, perfis, classificador de
meet-up, bunnybot, graduação, posts de encerramento. Cobri-los exige **hooks
novos no core** (PR próprio, ao lado dos antigos, como o MODDING.md manda).

## Próxima fase (Fase 2 — catálogo e UI) — PENDENTE DE AUTORIZAÇÃO

1. `lang/pt-BR.json` no pack: as 1.676 entradas do VenusTraining + delta da
   0.5.0 (a UI nova desde a v0.4.0).
2. Infra de i18n no fork do build: `i18nTransform.ts` (build-time), `t.ts`,
   `langPack`/`langService` — tradução da interface estática.
3. `tools/` do pack: validadores (colisão case-insensitive — já existe um caso
   real, `"Additional Negative Prompts"` duplicada no catálogo antigo;
   near-duplicates; chaves mortas contra a extração).
