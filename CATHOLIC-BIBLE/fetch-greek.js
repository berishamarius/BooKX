'use strict';
/**
 * BIBLIA CATHOLICA → fetch-greek.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Lädt den byzantinisch-griechischen Originaltext für den Konfessions-Modus
 * "Orthodox":
 *
 *  OT (Bücher 1–39)   → GreVamvas.json  (Griechische Bibel, basiert auf LXX)
 *  NT (Bücher 40–66)  → Byz.json        (Byzantinisches Mehrheitstext-Griechisch)
 *  DK (Bücher 67–73)  → GreVamvas.json  (LXX-Apokryphen, falls vorhanden)
 *
 * Beide Texte sind gemeinfrei (Public Domain).
 *
 * Ziel: data-greek/{pad3(nr)}.json
 *
 * Ausführen: node fetch-greek.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const RAW_BASE  = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json';
const GREEK_DIR = path.join(__dirname, 'data-greek');
const DATA_DIR  = path.join(__dirname, 'data');

// Bücher-Zuordnung: OT = 1–39, NT = 40–66, DK = 67–73
const OT_LAST  = 39;
const NT_FIRST = 40;
const NT_LAST  = 66;

// ── Helfer ────────────────────────────────────────────────────────────────────
function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'BibliaGreek/1.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume(); return resolve(download(res.headers.location));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP_' + res.statusCode)); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { reject(new Error('JSON: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
  });
}

const pad3  = n => String(n).padStart(3, '0');
const mkDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

function toCache(bookData) {
  const chapters = {};
  for (const ch of (bookData.chapters || [])) {
    const verses = {};
    for (const v of (ch.verses || [])) verses[v.verse] = { verse: v.verse, text: v.text || '' };
    chapters[ch.chapter] = { chapter: ch.chapter, name: '', verses };
  }
  return { chapters };
}

async function loadSource(filename, label) {
  const cacheFile = path.join(DATA_DIR, `_${filename}`);
  if (fs.existsSync(cacheFile)) {
    console.log(`  → ${filename} aus lokalem Cache`);
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }
  process.stdout.write(`  → lade ${filename} (${label}) …`);
  const data = await download(`${RAW_BASE}/${filename}`);
  fs.writeFileSync(cacheFile, JSON.stringify(data));
  process.stdout.write(' ✓\n');
  return data;
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA · Byzantinisches Griechisch (OX)    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  mkDir(GREEK_DIR);

  // Quellen laden
  const vamvas = await loadSource('GreVamvas.json', 'Griechische Vamvas-Bibel (OT/LXX-basiert + NT)');
  const byz    = await loadSource('Byz.json',       'Byzantinischer Mehrheitstext (NT-Greek)');

  // GreVamvas: Buch-Liste
  const vamvasBooks = vamvas.books || [];
  console.log(`  → GreVamvas: ${vamvasBooks.length} Bücher`);

  // Byz: Buch-Liste (NT only, beginnt bei Matthäus = NT Buch 1)
  const byzBooks = byz.books || [];
  console.log(`  → Byz: ${byzBooks.length} Bücher (NT-Griechisch)\n`);

  let saved = 0, skip = 0;

  // ── OT: Bücher 1–39 aus GreVamvas ──────────────────────────────────────────
  // GreVamvas hat 49 Bücher (Vamvas-Kanon umfasst mehr)
  // Wir nehmen einfach Index 0–38 = Gen bis Mal
  for (let i = 0; i < OT_LAST && i < vamvasBooks.length; i++) {
    const nr = i + 1;
    const outFile = path.join(GREEK_DIR, `${pad3(nr)}.json`);
    if (fs.existsSync(outFile)) { skip++; continue; }
    fs.writeFileSync(outFile, JSON.stringify(toCache(vamvasBooks[i])));
    saved++;
  }
  console.log(`  ✓ OT (1–${OT_LAST}): ${saved} Bücher aus GreVamvas (LXX-basiert)`);

  // ── NT: Bücher 40–66 aus Byz (27 Bücher) ───────────────────────────────────
  let ntSaved = 0;
  for (let i = 0; i < byzBooks.length && i < 27; i++) {
    const nr = NT_FIRST + i;
    const outFile = path.join(GREEK_DIR, `${pad3(nr)}.json`);
    if (fs.existsSync(outFile)) { skip++; continue; }
    fs.writeFileSync(outFile, JSON.stringify(toCache(byzBooks[i])));
    ntSaved++;
  }
  saved += ntSaved;
  console.log(`  ✓ NT (${NT_FIRST}–${NT_LAST}): ${ntSaved} Bücher aus Byz (Byzantinischer Mehrheitstext)`);

  // ── DK: Bücher 67–73 ──────────────────────────────────────────────────────
  // GreVamvas hat 66 Bücher (AT + NT, kein Deuterokanonon).
  // Es gibt keinen griechischen LXX-Apokryphen-Text in scrollmapper als JSON.
  // DK-Bücher werden daher ohne griechischen Text belassen (data-greek/067+ fehlen).
  // Im Orthodox-Modus zeigen DK-Buchseiten dann nur die Übersetzung, kein Griechisch.
  console.log('  ℹ  DK (67–73): kein Griechisch verfügbar (LXX-Apokryphen nicht in scrollmapper)');

  console.log(`\n  ✅  ${saved} griechische Bücher gespeichert → ${GREEK_DIR}`);
  console.log('  → Jetzt: node build3.js\n');
}

main().catch(e => { console.error('\n  ✗', e.message); process.exit(1); });
