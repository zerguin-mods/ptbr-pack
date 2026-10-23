# Glossário pt-BR — Venus University

As decisões de tradução que mantêm as ~750 linhas do catálogo (`pt-BR.json`) consistentes.
Toda string nova entra aqui com a mesma voz.

## Regras gerais

- A chave do catálogo é **sempre o texto inglês original**; a tradução é o valor. Uma linha sem entrada mostra o inglês — o fallback é intencional.
- O jogador é **"você**" na interface; o protagonista da ficção é **"o leitor"** (nunca "you"/"the reader" em português).
- Semitons do jogo: coloquial mas limpo. "Topa?", "Deixa pra lá", "pelado" — sem medo de gíria, sem cafonice.
- As reticências e o travessão do original são preservados (…, —).

## Nomes próprios — ficam como estão

Venus University, Veridan, Kendall Library, Agora, Pino-Cola (Lounge/rec center), Thorne
(Auditorium, Philanthropies), Palaestra, Elysium Village, Lowrise, Concord Fountain,
Whitman, Green Hill (Park), Lotterdale, Reserve Bank Cafe, Bobby's Diner, SpringMart,
Fast Eats, Pier 44, Stanchion St, BTB Arcade, Stalestein, Hotel DREAMS, Pastel Palace,
CuteTea, Eastern Buffet, The Promenade, Riverside (Mall/Aquarium), Selkie Beach, Future
Cinema, Club Apogee, Lumiere Fusion, Veridan Museum, Freights, Bunnyboard, BunnyShop,
BunnyMap, ComfyUI, SillyTavern, Gemini, PARADISO.

## Vocabulário fixo

| Inglês | Português |
| --- | --- |
| Brain / Body / Heart (stats) | Mente / Corpo / Coração |
| Unremarkable / Godly (tiers) | Comum / Divino |
| Freshman / Sophomore / Junior / Senior | Calouro / Segundo-anista / Júnior / Senior |
| save / playthrough / replay | save / jogo / replay |
| shift / strike | turno / advertência |
| fired / quit (job) | demitido / pedir demissão |
| course / PE course / drop | disciplina / disciplina de EF / trancar |
| add/drop (period) | ajuste de matrícula |
| occasion | ocasião |
| hangout | encontro |
| credits | créditos |
| roster | elenco |
| disposition | disposição |
| milestone | marco |
| reasoning effort | esforço de raciocínio |
| seed | seed |
| prompt | prompt |
| endpoint | endpoint |
- Datas: "19 de janeiro", "segunda-feira" — sem ordinais; a ordem dia-mês vem do template
  `"{month} {day}"`, traduzido como `"{day} de {month}"`.
- CG no feminino: "a CG", "as CGs". NSFW, SFX, GPA e spoiler ficam como estão.

## Fila 4b — completa

Todas as superfícies jogador-visíveis traduzidas: 1.295 linhas no catálogo. O primeiro dia
inteiro (scroll de chegada + boas-vindas), a rolagem de formatura (com as duas variantes de
semestre e as duas de formando/espectador), as despedidas com seus três tons e o botão de
"Se despedir de {name}". Os textos LLM-facing (ORIENTATION_PREMISE, farewellAction, as
linhas NOW da despedida) permanecem em inglês por design — o modelo os lê e escreve a cena
em português.

Restam apenas:
1. Ternários JSX (`{busy ? 'Saving…' : 'Save'}`) — o transform não os envolve.
2. Mensagens Venus/BunnyBot e posts aleatórios do feed — volumosos e de menor frequência.
