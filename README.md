# ptbr-pack

O núcleo compartilhado das traduções PT-BR do **Zerguin-Mods** para o
[Venus University](https://venus-dev.itch.io/venus-university) e para o build comunitário
[Venus Extracurriculars](https://github.com/venus-extracurriculars/build).

Este repositório não contém código do jogo. Ele reúne tudo o que as traduções
compartilham entre os dois alvos:

| Item | Papel |
| --- | --- |
| `GLOSSARY.md` | As decisões de tradução: regras gerais, nomes próprios, vocabulário fixo |
| `docs/` | Documentos de referência e o registro das fases do projeto |
| `lang/` | O catálogo `pt-BR.json` — chave = linha inglesa, valor = tradução — e o rascunho da rodada corrente (`pt-BR.overlay.json`) |
| `tools/` | Validadores: `delta.mjs` compara o catálogo com a extração de um build (novas, mortas, near-matches, colisões por caixa) |

## Arquitetura dos alvos

```
Zerguin-Mods
├── ptbr-pack                 ← este repositório (compartilhado)
├── build                     ← fork de venus-extracurriculars/build
│     └── branch mod/traducao-ptbr, criada sobre core
└── venus-university          ← fork de venus-uni-dev/venus-university (fase 5)
      └── tradução do jogo oficial, distribuída como patch (asar swap)
```

- **Alvo A — Venus Extracurriculars**: a tradução de conteúdo gerado por IA entra pelos
  hooks do sistema de mods (`prompts.*` / `requests.*`); a tradução de interface usa o
  transform i18n build-time. A distribuição acontece dentro do build deles, via PR.
- **Alvo B — jogo oficial**: fork com o mesmo catálogo, distribuído como patcher que não
  embute nenhum arquivo de arte do jogo (modelo `patch.js` do projeto antigo).

O catálogo é **um só** para os dois alvos: a chave é sempre a linha inglesa original, e o
catálogo do build é superconjunto do do jogo base — chaves extras não fazem mal em alvo
que não as usa (linha sem entrada mostra o inglês; entrada sem linha é ignorada).

## Proveniência

Este pacote herda o trabalho do projeto **VenusTraining**
(`github.com/GuiKazuo1003/VenusTraining`, branch `ptbr-mod`, jogo v0.4.0), do qual vêm o
glossário, o wording da diretiva de idioma e o modelo do catálogo. Os documentos extraídos
registram a origem exata de cada peça em `docs/`.

## Licença

AGPL-3.0-only — a mesma do código dos dois upstreams (ver `LICENSE`), para que catálogo e
ferramentas possam ser distribuídos dentro dos forks sem incompatibilidade de licença.

## Status

**Fase 0 (setup) concluída** — ver `docs/fase-0.md`. **Fase 1 (protótipo do mod) concluída** —
ver `docs/fase-1.md`: o mod existe na branch `mod/traducao-ptbr` do clone do build. **Fase 2
(tradução da camada autoral) concluída** — ver `docs/fase-2.md`: o framework i18n está na
branch `framework/i18n`, o catálogo cobre a extração da 0.5.0 e a interface segue a prosa.
As fases seguintes estão descritas nos registros e dependem de autorização explícita por fase.
