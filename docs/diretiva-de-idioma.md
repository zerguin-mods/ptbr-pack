# Diretiva de idioma — referência e proveniência

## Origem

| Item | Valor |
| --- | --- |
| **Repositório** | `github.com/GuiKazuo1003/VenusTraining` (projeto antigo, do mesmo autor) |
| **Branch local** | `ptbr-mod` |
| **Arquivo original** | `src/renderer/prompts/languageDirective.ts` |
| **Cópia preservada aqui** | `docs/fontes/venustraining-v0.4.0/languageDirective.ts` (byte a byte, hash `e48de58b`) |
| **Versão do jogo alvo** | Venus University **v0.4.0** (o jogo atual é v0.5.0 — o wording é reaproveitável, a mecânica de injeção não) |
| **Extração** | Fase 0 do Zerguin-Mods, 2026-10-23 |

## O que o arquivo original fazia (v0.4.0)

No jogo oficial **não existe sistema de mods** — o VenusTraining injetava a diretiva
**editando diretamente** 7 arquivos do jogo (`gameLoop.ts`, `textingLoop.ts`,
`characterStore.ts`, `newGame.ts`, `loop/endingPosts.ts`, `loop/exams.ts`,
`scenePrompt.ts`), envolvendo cada request com um wrapper (`withProseLanguage`,
`withLedgerLanguage`, `withCharacterLanguage`, `withCatalogLanguage`).

As linhas de diretiva em si (o wording) é a parte valiosa e testada em jogo:

- **`PT_LINES`** (base de todas): escreve toda prosa/diálogo/post/resumo em português
  brasileiro natural e idiomático; onde a instrução diz "the reader", usar **"o leitor"**;
  nomes, charKeys, lugares, emoções e tags ficam **exatamente como o prompt dá, em inglês**.
- **`ledgerLanguageLines`** (bookkeeping/memórias): memórias sempre em 3ª pessoa —
  **"o leitor"**, nunca "você"; possessivos **"seu"/"sua"**.
- **`characterLanguageLines`** (geração de personagem): nomes comuns dos EUA em letras
  latinas; campos de aparência/roupa continuam **tags danbooru em inglês**; enums são
  **o token exato do schema**.
- **`catalogLanguageLines`** (catálogos one-shot): código de disciplina e handle em
  **ASCII minúsculo** (letras, dígitos, underscore).
- **`local` flag**: colocava as linhas **no início do system** para o writer local
  (llama.cpp) — modelos pequenos seguram melhor a instrução se a lerem primeiro.
  Específico do VenusTraining; sem equivalente necessário no build.

## Mapeamento para o Venus Extracurriculars (alvo A)

No build, a injeção direta é substituída pelos **hooks do sistema de mods** — verificados
no `core` (branch base do nosso mod, commit `16da338`, jogo v0.5.0):

| Função original (v0.4.0) | Hook no build | Existe no core? |
| --- | --- | --- |
| `proseLanguageLines` (cenas) | `prompts.scene` (linhas no user block) | ✅ |
| `proseLanguageLines` (DMs) | `prompts.dm` | ✅ |
| `proseLanguageLines` (posts/reach-outs) | `prompts['slot-posts']`, `prompts['slot-reach-outs']` | ✅ |
| `ledgerLanguageLines` | `requests.ledger` (preserva os campos de outros mods) | ✅ |
| `characterLanguageLines` | `prompts.character` | ✅ |
| `withProseLanguage` nos wrappers de request | `requests.scene`, `requests.dm`, `requests['slot-intro']` (permitem tocar o system) | ✅ |
| `catalogLanguageLines` | **sem hook correspondente** (chamadas de catálogo não passam pelos spots) | ❌ |
| `personaWithLanguage` | sem equivalente — persona é do jogo/jogador; `requests.*` pode prefixar o system | ✅ via requests |

**Notas técnicas para o protótipo:**

1. As linhas via `prompts.*` entram no **user block**; as via `requests.*` podem editar o
   **system** (compondo depois dos outros mods, preservando o que eles adicionaram).
   O VenusTraining anexava ao final do system; no protótipo, as linhas de idioma podem
   seguir esse ponto (fim do system via `requests.*`) ou o user block (via `prompts.*`).
2. Chamadas **sem hook** no build (bunnybot, segredos, graduação, classificador de
   meet-up, ocasiões) continuam gerando em inglês — lacuna conhecida, mapeada no plano.
3. `LanguageCode` (v0.4.0) era um setting do jogo; no build a escolha de idioma será uma
   **option group do mod** (`optionGroups` do `ModDef`).

## Glossário relacionado

As decisões de vocabulário que acompanham estas diretivas estão em `../GLOSSARY.md`
(copiado do mesmo projeto, mesmo ponto da história).
