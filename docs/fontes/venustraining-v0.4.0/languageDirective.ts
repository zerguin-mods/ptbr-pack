import type { LanguageCode, StructuredRequest } from '@shared/types'

/**
 * The lines a call is told which language to write in, and the request wrappers that carry
 * them. English, the language the game itself is written in, is told nothing, and its
 * requests pass through untouched.
 *
 * A cloud model reads the lines wherever they stand; the local writer — a small model on the
 * managed llama.cpp server — reads them first, because what a small model reads first is
 * what it holds onto, and the language the prose must come out in is the one instruction a
 * drifted reply breaks outright. The `local` flag every wrapper takes moves them to the head
 * of the system, and the request builders pass it as they pass the language.
 */

const PT_LINES = [
  'You write in Brazilian Portuguese: every line of narration, dialogue, text, post and summary you write is natural, idiomatic Brazilian Portuguese, the way a native writer writes it.',
  'Where another instruction tells you to call him "the reader", call him "o leitor" instead. Every name, charKey, place, emotion and tag stays exactly as the prompt gives it, in English.'
]

/** The lines every prose-writing call carries. */
export function proseLanguageLines(language: LanguageCode): string[] {
  return language === 'en' ? [] : PT_LINES
}

/** The prose lines, with the shape a memory is kept in so the reader's voice can rewrite it. */
export function ledgerLanguageLines(language: LanguageCode): string[] {
  if (language === 'en') return []
  return [
    ...PT_LINES,
    'Every memory refers to the reader in the third person as "o leitor" — never "você" — and his things are "seu" and "sua".'
  ]
}

/** The prose lines, with what character generation keeps English for the renderer under it. */
export function characterLanguageLines(language: LanguageCode): string[] {
  if (language === 'en') return []
  return [
    ...PT_LINES,
    'The names are still names common in the USA, in plain Latin letters; the appearance and outfit fields are still danbooru tags in English; every enum value is still the exact token the schema shows.'
  ]
}

/** The prose lines, with the machine values the catalog one-shots keep as ASCII. */
export function catalogLanguageLines(language: LanguageCode): string[] {
  if (language === 'en') return []
  return [
    ...PT_LINES,
    'A class code and a handle are still plain lowercase ASCII letters, digits and underscores.'
  ]
}

/** A persona, then the language lines when there are any, as one system string. */
export function personaWithLanguage(persona: string, lines: readonly string[], local = false): string {
  if (lines.length === 0) return persona
  return local ? [...lines, '', persona].join('\n') : [persona, '', ...lines].join('\n')
}

/** The request a call sends, its system carrying `lines`; a language with none passes through. */
function withLines(
  request: StructuredRequest,
  lines: readonly string[],
  local: boolean
): StructuredRequest {
  if (lines.length === 0) return request
  return {
    ...request,
    system: local
      ? `${lines.join('\n')}\n\n${request.system}`
      : `${request.system}\n\n${lines.join('\n')}`
  }
}

/** A prose call's request, told to write in the player's language. */
export function withProseLanguage(
  request: StructuredRequest,
  language: LanguageCode,
  local = false
): StructuredRequest {
  return withLines(request, proseLanguageLines(language), local)
}

/** A ledger call's request, told the memory shape on top of the prose lines. */
export function withLedgerLanguage(
  request: StructuredRequest,
  language: LanguageCode,
  local = false
): StructuredRequest {
  return withLines(request, ledgerLanguageLines(language), local)
}

/** A character generation request, told what stays English beneath its prose. */
export function withCharacterLanguage(
  request: StructuredRequest,
  language: LanguageCode,
  local = false
): StructuredRequest {
  return withLines(request, characterLanguageLines(language), local)
}

/** A catalog one-shot's request, told what stays ASCII beneath its prose. */
export function withCatalogLanguage(
  request: StructuredRequest,
  language: LanguageCode,
  local = false
): StructuredRequest {
  return withLines(request, catalogLanguageLines(language), local)
}
