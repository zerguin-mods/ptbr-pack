# Fase 0 — Setup (concluída em 2026-10-23)

Preparação do ambiente dos projetos Zerguin-Mods, sem tocar em código do jogo e sem
implementar o mod de tradução (Fase 1, pendente de autorização).

## Caminhos estabelecidos

| Caminho | Papel |
| --- | --- |
| `C:\Jogos\zerguin-mods\` | Base dos projetos Zerguin-Mods |
| `C:\Jogos\zerguin-mods\ptbr-pack\` | Núcleo compartilhado da tradução (repo git local, branch `main`) |
| `C:\Jogos\zerguin-mods\build\` | Clone de `venus-extracurriculars/build` (fork a criar) |
| `C:\Jogos\build-main\build-main\` | Referência (zip do `main`, sem git) — **intocada**, só leitura |
| `C:\Jogos\VenusDevDev\venus-university-ptbr\` | VenusTraining v0.4.0 (origem do reaproveitamento) — intocada |
| `C:\Jogos\Venus\venus-university-windows\` | Jogo oficial instalado, v0.5.0 — intocado |

## Repositório `build` (clone)

- Origem: `https://github.com/venus-extracurriculars/build.git` (clone completo, 2,33 GiB).
- Branches locais: `main` (`baca60f`), `core` (`16da338`), **`mod/traducao-ptbr`** (criada
  a partir de `core`, é a branch atual de trabalho).
- Verificações executadas:
  - Hash do `MODDING.md` da referência (`49420143…`) **idêntico** ao do `main` do clone
    → a análise anterior foi feita exatamente sobre este `main`.
  - `core` = jogo **v0.5.0** (package.json), `modEntries/` vazio ("the frame alone"),
    BUILD 0.1.0 (o `main` é BUILD 0.3.1).
  - Hooks disponíveis no `core` (verificado em `src/renderer/mods/hooks.ts`):
    `prompts.*` (scene, dm, slot-posts, slot-reach-outs, character), `requests.*`
    (scene, dm, ledger, slot-intro), além de afterDmReply, slotSettled, bunnyboardPage
    etc. — **suficientes para o protótipo de tradução de IA**.
  - Hooks que **só existem no `main`** (adicionados durante integrações): `modDetail`,
    `scenePlay`, `afterSceneReply`. O protótipo não pode usá-los direto do `core`.
  - Builders com integração de mods presentes no `core`: `scenePrompt.ts`,
    `textingPrompt.ts`, `slotIntroPrompt.ts`, `characterPrompt.ts`.

## Repositório `ptbr-pack` (novo, local)

- `git init` branch `main`; identidade local do repo: `Zerguin-Mods
  <zerguin-mods@users.noreply.github.com>` (noreply do GitHub da conta).
- Conteúdo preparado nesta fase:
  - `README.md` — propósito, arquitetura dos 3 repos, proveniência, licença, status.
  - `GLOSSARY.md` — cópia byte a byte do VenusTraining v0.4.0 (hash conferido com o
    original antes da cópia).
  - `LICENSE` — AGPL-3.0-only, cópia do texto do upstream (mesma licença dos dois jogos).
  - `docs/diretiva-de-idioma.md` — análise e mapeamento da diretiva para os hooks.
  - `docs/fontes/venustraining-v0.4.0/languageDirective.ts` — o arquivo original
    preservado byte a byte (hash `e48de58b`, conferido idêntico ao original).
  - `.gitignore`, `docs/fase-0.md` (este registro).

## Reaproveitamento do VenusTraining (v0.4.0) — inventário

| Peça | Destino | Estado |
| --- | --- | --- |
| Wording da diretiva de idioma | Protótipo (Fase 1) | ✅ Preservado e mapeado |
| GLOSSARY.md | Pack (vivo) | ✅ Copiado |
| Catálogo `lang/pt-BR.json` (1.676 entradas) | Pack, `lang/` (Fase 2) | ⏳ Pendente — precisa de delta p/ 0.5.0 |
| `i18nTransform.ts` + `t.ts` + `langPack`/`langService` | Fork do build (Fase 2) | ⏳ Pendente |
| `patch.js`/`packMod.mjs`/`syncLang.mjs` | Fork do jogo oficial (Fase 5) | ⏳ Pendente |
| `llamaService.ts` (writer local) | Fora do escopo de tradução | ➖ Não reaproveitar |

## Impedimentos e pendências remotas

1. **GitHub CLI sem autenticação** (`gh auth login` pendente). Consequências:
   - Não foi possível criar `Zerguin-Mods/ptbr-pack` no GitHub.
   - Não foi possível criar o fork `Zerguin-Mods/build`.
   - Os repos locais estão prontos para receber os remotes e publicar em minutos.
2. A conta **`zerguin-mods` existe** no GitHub (criada 2026-10-23, sem repositórios). As
   credenciais do Windows guardam acesso apenas para `GuiKazuo1003`; criar repos sob
   `Zerguin-Mods` exige login **como essa conta** — o `gh auth login` é interativo e
   precisa ser feito pelo dono da conta.
3. Passos remotos após a autenticação (nenhum executado, como combinado):
   - `gh repo create Zerguin-Mods/ptbr-pack` + push do local.
   - Fork de `venus-extracurriculars/build` para `Zerguin-Mods/build` + push da
     `mod/traducao-ptbr` e configuração dos remotes (origin → fork, upstream → original).

## Decisões tomadas nesta fase (reversíveis)

- Licença do pack: **AGPL-3.0-only** (mesma dos upstreams, para o catálogo poder ser
  distribuído dentro dos forks).
- Autoria dos commits do pack: `Zerguin-Mods <zerguin-mods@users.noreply.github.com>`.
- O clone do build aponta `origin` para o upstream original até o fork existir; após o
  fork, `origin` vira o fork e o upstream vira `upstream`.

## Próxima fase (Fase 1 — protótipo do mod) — PENDENTE DE AUTORIZAÇÃO

Criar em `mod/traducao-ptbr` (zero edição em arquivos do jogo):
`src/shared/modEntries/traducao-ptbr.ts` + `src/renderer/modEntries/traducao-ptbr.ts`,
usando os hooks verificados no core e o wording da diretiva preservada aqui.
