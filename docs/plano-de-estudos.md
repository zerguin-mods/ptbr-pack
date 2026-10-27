# Plano de estudos — ler este projeto sem depender de ninguém

> Objetivo: em ~6 semanas (1–1,5 h/dia), você consegue abrir qualquer arquivo do build, ler a
> conversa da organização e o histórico de commits, e saber **o que** cada peça faz e **por
> quê**. O material de estudo é o próprio projeto: cada conceito aponta para arquivos reais
> que estão no seu disco agora.

## Como usar este plano

- Leia no editor (VS Code): abra `C:\Jogos\zerguin-mods\build`, use **Ctrl+Click** para seguir
  um import e **F12** para achar a definição. Ler código é seguir caminhos.
- Cada bloco tem: **tema → arquivo no projeto → exercício → recurso**. Faça o exercício; é
  ele que fixa.
- Se travar num bloco, não pule: os próximos assumem os anteriores.
- Horários são estimativas de alguém começando do zero em programação web. Se você já programa,
  use a tabela como checklist e pule o que domina.

## A foto de 30 segundos (memorize isto primeiro)

O jogo é um aplicativo **Electron** — três processos:

| Processo | O que é | No projeto |
| --- | --- | --- |
| **main** | Node.js: o único que toca disco, rede e janela | `src/main/` |
| **renderer** | React: tudo que aparece na tela | `src/renderer/` |
| **preload** | A ponte entre os dois, com um contrato tipado | `src/preload/api.d.ts` |

Eles conversam por **IPC** (canais nomeados, sempre respondendo `{ ok, data }` ou `{ ok: false, error }`).
O build comunitário adiciona o **sistema de mods** (switches + hooks) por cima. Nosso trabalho
aqui: um **mod** (prosa em PT via hooks), uma **camada i18n** (transform de build + catálogo +
leitura no boot) e um **catálogo** (este pack).

---

## Fase A — Ler TypeScript e React (o alfabeto, ~18 h)

### A1. JavaScript: módulos, import/export e ordem de avaliação (4 h)

O conceito mais importante de TODO o projeto: **um módulo é avaliado uma vez, na hora do
import**. Constantes no topo do arquivo "congelam" o que leram naquele momento. Isso explica
o bug das tabelas que o revisor apontou — e por que o `main.tsx` carrega o dicionário
**síncronamente** e importa o App depois.

- Ler no projeto: `src/renderer/main.tsx` (todo — 150 linhas, comentado)
- Exercício: explique em voz alta por que `import App from './App'` foi trocado por
  `void import('./App').then(...)`, e o que aconteceria se voltasse.
- Recurso: MDN em português — "Módulos JavaScript" e "Import dinâmico"
  (`developer.mozilla.org/pt-BR/`)

### A2. Síncrono vs assíncrono (3 h)

`Promise`, `async/await`, e por que quase todo IPC é assíncrono (`invoke`) — e por que existe
UMA exceção síncrona (`sendSync`) no boot.

- Ler: `src/main/ipc.ts`, o helper `handle()` (linha ~212) e o canal `lang:bootSync`
- Exercício: ache as duas diferenças entre `lang:read` e `lang:bootSync` (tipo de canal +
  quem pode jogar erro).
- Recurso: MDN PT — "Promise", "async/await"

### A3. TypeScript na dose do projeto (6 h)

O que o projeto usa o tempo todo: tipos simples, `interface`, `type`, uniões (`'a' | 'b'`),
genéricos de leitura (`Promise<Result<T>>`), imports de tipo (`import type`).

- Ler: `src/shared/langPack.ts` (37 linhas — o melhor primeiro arquivo do projeto) e
  `src/shared/i18n/t.ts` (25 linhas)
- Exercício: sem olhar a implementação, diga o que `isLanguageCode('../saves')` retorna e por
  quê importa para segurança (dica: o código vira nome de arquivo).
- Recurso: TypeScript Handbook — "The Basics", "Everyday Types", "Narrowing"
  (`typescriptlang.org/docs/handbook`)

### A4. React: componente, prop, estado, re-render e a mágica do `key` (5 h)

Por que trocar de idião **remonta** a tela: componente re-executa, e um `key` novo descarta a
árvore e desenha outra. É o truque do `langVersion` no `App.tsx`.

- Ler: `src/renderer/App.tsx` (só a função `App()` — as ~60 linhas do fim) e
  `src/renderer/stores/langStore.ts` (49 linhas)
- Exercício: troque `<Fragment key={langVersion}>` de volta para `<>`, rode `npm run dev`,
  troque o idioma no meio da sessão e descreva o que para de funcionar. Depois desfaça.
- Recurso: react.dev → "Learn" (Quickstart, Managing State, Rendering Lists — o trecho sobre
  `key`)

---

## Fase B — A arquitetura do jogo (~15 h)

### B1. Zustand: os stores (2 h)

Todo o estado do jogo vive em stores (`create(...)`); fora de componentes lê-se
`useStore.getState()`, dentro usa-se o hook `useStore((s) => ...)`.

- Ler: `src/renderer/stores/langStore.ts` inteiro (é o menor store do projeto) e depois
  `src/renderer/stores/modsStore.ts` (o mais relevante para o mod)
- Exercício: no `modsStore`, ache a linha que faz o seu mod ser "ligável" e a que repassa os
  switches para os hooks (`setHookRules`).
- Recurso: README do Zustand no GitHub (curto)

### B2. O sistema de mods (5 h)

**O documento central do projeto.** Leia `MODDING.md` na raiz do build — de novo, agora com
vocabulário. Depois o código que o implementa:

- Ler, nesta ordem: `src/shared/mods.ts` (as regras) → `src/renderer/mods/hooks.ts` (os
  pontos de extensão) → `src/renderer/modEntries/traducao-ptbr.ts` (**o nosso mod**)
- Exercício: no nosso entry, aponte qual linha registra cada hook e o que `requests.scene`
  recebe de argumento.
- Conceitos-chave: `ModDef`, escopo (`anytime`/`playthrough`), hooks que **somam** vs. o
  primeiro-que-responde-ganha

### B3. Como o jogo chama a LLM (4 h)

Um "request estruturado": `system` (persona/regras) + `user` (contexto + tarefa) + `schema`
(JSON que a resposta deve ter). `cacheKey` é dica de cache de prompt.

- Ler: `docs/diretiva-de-idioma.md` (neste pack — o mapeamento da diretiva) + o trecho de
  `src/renderer/prompts/textingPrompt.ts` das linhas 460–517 (monta um request inteiro)
- Exercício: ache onde `modRequest('dm', ...)` entrega o request pronto aos mods, e diga o
  que o nosso hook faz com `system`.
- Recurso: a documentação de "structured output"/JSON mode do seu provedor (ex.: Gemini)

### B4. O padrão de serviços do main (4 h)

`paths.ts` é o mapa de tudo que existe em disco; serviços leem/escrevem arquivos e respondem
`Result<T>`; erros são criados com `appError(código, mensagem, detalhe)`.

- Ler: `src/main/paths.ts` (só as funções `get*` — o índice do jogo) e
  `src/main/services/langService.ts` inteiro (é o serviço que escrevemos do zero)
- Exercício: siga o caminho completo de um pack: `getActiveLangPath` → `getLangPackPath` →
  `getShippedLangPackPath`. Quem vence?

---

## Fase C — O que construímos e o que disseram (~15 h)

### C1. Vite e o build (3 h)

Vite empacota o renderer; **plugins** podem transformar cada arquivo no caminho
(`transform(código, id)` → devolve código novo). O `electron-vite` orquestra main+preload+renderer.

- Ler: `electron.vite.config.ts` (53 linhas — veja os três blocos) e compare com
  `vite.web.config.ts`
- Exercício: comente o `i18nTransform()` do array de plugins, rode `npm run build`, e procure
  por `t("` no arquivo `out/renderer/assets/App-*.js` (não vai existir). Desfaça.
- Recurso: vite.dev → "Why Vite" + "Plugin API" (o começo basta)

### C2. AST: como o transform lê código (4 h)

Um **AST** é o código virado árvore de nós (`StringLiteral`, `ObjectProperty`,
`TemplateLiteral`…), cada nó com posição no texto. O transform caminha a árvore, escolhe os
nós que são "texto que o jogador lê" e reescreve o texto na posição — sem tocar o arquivo-fonte.

- Ferramenta (divirta-se): **astexplorer.net** → parser `@babel/parser`. Cole o fixture do
  `test/i18nTransform.test.ts` e clique nos nós. É literalmente o que o transform vê.
- Ler: `scripts/i18nTransform.ts` — na ordem: as listas de allowlist (topo) → `walk()` → as
  regras do `walk` interno → o "splice" final das edições. É o arquivo mais difícil do
  projeto; deixe por último e sem pressa.
- Exercício: o revisor disse que "encapsular por estrutura pode virar chave um valor que o
  código compara". Ache no `i18nTransform.ts` as três proteções contra isso (`literalEdit`,
  `isSentence`, allowlists) e explique cada uma.
- Recurso: babeljs.io → "Learn" (o básico de parser/AST)

### C3. O fluxo i18n ponta a ponta (3 h)

Conte a história inteira em voz alta, do boot ao clique:

1. boot: `main.tsx` → `lang.bootSync` (`sendSync`) → `readBootPack()` lê `data/lang/active`
   + o pack (`data/lang` vence `assets/lang`) → `setDictionary`
2. `import('./App')` → todas as constantes avaliam `t()` já com o dicionário
3. o mod liga: `applyUiLanguage()` → `lang.use` grava a escolha + `switchTo` aplica e sobe
   `version` → `App` remonta com `key`
4. sem entrada no catálogo, `t()` devolve a própria chave → inglês. **Nada quebra.**

- Exercício: o teste de compreensão é o `test/langService.test.ts` — leia cada `it(...)` como
  uma regra do contrato e explique por que existe.

### C4. Git e GitHub de verdade (5 h)

Você já usou na prática; agora a teoria que faltou: fork vs upstream, branch vs merge, por
que PR de fork pode abrir no repo errado, credential helpers (o episódio do GCM!).

- Recurso: **Pro Git, tradução oficial em português** — `git-scm.com/book/pt-br/v2`.
  Capítulos: 1, 2, 3 (ramos!) — o resto por consulta.
- Ler o histórico como lição: `git log --stat` na `mod/traducao-ptbr` — cada commit nosso tem
  uma mensagem longa explicando o porquê. Comece pelo mais antigo (`6110c63`).
- Exercício: explique por que `origin` e `upstream` existem no clone do build, e o que o
  `git ls-remote --heads origin` mostrou quando conferimos sua publicação.

---

## Trilha de leitura pelos arquivos (ordem exata, ~2.400 linhas no total)

| # | Arquivo | Por quê |
| --- | --- | --- |
| 1 | `src/shared/i18n/t.ts` | 25 linhas; o coração de tudo, sem depender de nada |
| 2 | `src/shared/langPack.ts` | 37 linhas; contratos, validação e segurança em miniatura |
| 3 | `src/renderer/stores/langStore.ts` | 49 linhas; stores + remount |
| 4 | `src/main/services/langService.ts` | ~140 linhas; um serviço inteiro, legível |
| 5 | `src/shared/mods.ts` | as regras do sistema de mods |
| 6 | `src/renderer/mods/hooks.ts` | os pontos de extensão (leia só os tipos/interfaces) |
| 7 | `src/renderer/modEntries/traducao-ptbr.ts` | o nosso mod, completo |
| 8 | `MODDING.md` + `docs/diretiva-de-idioma.md` | o "porquê" em prosa |
| 9 | `src/main/ipc.ts` (só o topo + `handle()`) | como os canais nascem |
| 10 | `scripts/i18nTransform.ts` | o Everest — depois de C2 |

## Exercícios de mão na massa (todos seguros, todos no seu fork)

1. `npm run dev` → ligue o mod → abra `data/mods.json` e veja o switch mudar.
2. Edite à mão `data/lang/active` (escreva `pt-BR`, depois `lixo`, depois apague) e veja o boot
   de cada jeito — e o `data/app.log` no caso ruim.
3. Troque uma tradução em `build/assets/lang/pt-BR.json` (ex.: "Novo Jogo" → outra coisa),
   rode, veja, e desfaça com `git checkout -- assets/lang/pt-BR.json`.
4. Comente a linha `setDictionary(...)` do `main.tsx`, rode, veja as tabelas em inglês — o
   bug real do review, reproduzido por você. Desfaça.
5. No [astexplorer.net](https://astexplorer.net), cole o primeiro fixture de
   `test/i18nTransform.test.ts` e ache o nó `title="Save the game"`.
6. `git log --stat main..mod/traducao-ptbr` — leia as mensagens; são as aulas do projeto.
7. Reler o texto do review do PR #116 e sublinhar cada frase que ainda não fizer sentido.
   Após a Fase C, reler: a lista deve estar vazia.

## Vocabulário das conversas (o que eles disseram → onde você aprende)

| Termo/frase da conversa | O que é | Bloco |
| --- | --- | --- |
| "core", "main", "fork", "upstream" | branches/repos e papéis de cada um | C4 |
| "build-time" vs "runtime" | transform na compilação vs código rodando | C1 |
| "AST", "parse", "nó", "span" | código como árvore; posição no texto | C2 |
| "constante de módulo", "avalia no import" | avaliação única na importação | A1 |
| `t()` executar "antes do pack existir" | ordem boot vs módulos | C3 |
| "síncrono/assíncrono", `sendSync`, `invoke` | tipos de IPC | A2, B4 |
| "hooks", "escopo anytime/playthrough" | sistema de mods | B2 |
| "system"/"user"/"schema", cache | request estruturado pra LLM | B3 |
| "PR", "review", "merge", "draft" | fluxo GitHub | C4 |
| "transform", "plugin Vite", "allowlist" | a peça de build do i18n | C1, C2 |

## Quando terminar

- Você deve conseguir: ler o `docs/mods/*.md` do repo deles com olhos críticos, entender
  qualquer commit nosso sem ajuda, e discutir no Discord com termos precisos.
- Próxima leitura (mais difícil, opcional): `src/renderer/prompts/scenePrompt.ts` inteiro
  (2.200 linhas — o coração criativo do jogo) e `test/mods.test.ts` (regras virando testes).
