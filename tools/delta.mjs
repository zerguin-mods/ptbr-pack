#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The catalog against a build's extraction. Run after a build whose renderer carried the
 * i18n transform:
 *
 *   node tools/delta.mjs [caminho-para-i18n-extracted.json]
 *
 * Reads `lang/pt-BR.json` (the canonical catalog: key = the English line, value = the
 * translation) and the extraction (every key the build wrapped), and reports:
 *
 *   - kept:      extraction keys the catalog already translates
 *   - new:       extraction keys with no translation yet — written, each with the near
 *                match of an old line where one exists, to `lang/pt-BR.worklist.json`
 *   - dead:     catalog keys this build no longer wraps — left in place: the catalog is a
 *                superset by design, a line without an entry reads English, and an entry
 *                without a line is ignored
 *   - colliding: keys that differ only by case — kept apart by JSON and by `t()`, but a
 *                translator can hardly tell them apart in a list, so they are named
 */

const HERE = dirname(fileURLToPath(import.meta.url))
const PACK = resolve(HERE, '..')
const CATALOG_PATH = resolve(PACK, 'lang', 'pt-BR.json')
const WORKLIST_PATH = resolve(PACK, 'lang', 'pt-BR.worklist.json')
const DEFAULT_EXTRACTION = resolve(PACK, '..', 'build', 'i18n-extracted.json')

const extractionPath = process.argv[2] ?? DEFAULT_EXTRACTION
const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
const extraction = JSON.parse(readFileSync(extractionPath, 'utf8'))

const normalize = (line) => line.trim().replace(/\s+/g, ' ').toLowerCase()

/** A pass over the catalog by normalized line, for the near match a new line may have. */
const byNormal = new Map()
for (const key of Object.keys(catalog)) {
  const normalized = normalize(key)
  if (!byNormal.has(normalized)) byNormal.set(normalized, key)
}

const catalogKeys = new Set(Object.keys(catalog))
const extractionKeys = Object.keys(extraction)

const kept = extractionKeys.filter((key) => catalogKeys.has(key))
const fresh = extractionKeys.filter((key) => !catalogKeys.has(key))

const worklist = {}
for (const key of fresh) {
  const near = byNormal.get(normalize(key))
  worklist[key] = near === undefined ? '' : `≈ ${near} → ${catalog[near]}`
}

const dead = catalogKeys.size - kept.length

/** Keys of one fold that another fold holds differing only by case from. */
const byFold = new Map()
const colliding = []
for (const key of extractionKeys) {
  const fold = key.toLowerCase()
  const held = byFold.get(fold)
  if (held !== undefined && held !== key) colliding.push([held, key])
  else if (held === undefined) byFold.set(fold, key)
}

writeFileSync(WORKLIST_PATH, `${JSON.stringify(worklist, null, 2)}\n`)

console.log(`catalog: ${catalogKeys.size} · extraction: ${extractionKeys.length}`)
console.log(`kept: ${kept.length} · new: ${fresh.length} · dead (kept in place): ${dead}`)
if (colliding.length > 0) {
  console.log(`colliding by case (${colliding.length}):`)
  for (const [a, b] of colliding) console.log(`  ${JSON.stringify(a)} / ${JSON.stringify(b)}`)
}
console.log(`worklist: ${WORKLIST_PATH}`)
