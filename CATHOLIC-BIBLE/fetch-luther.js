'use strict';
/**
 * BIBLIA CATHOLICA → fetch-luther.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Lädt die altdeutsche Lutherbibel (GerBoLut) von scrollmapper.
 * Wird als Basis-Text für den Konfessions-Modus "Protestantisch" verwendet.
 *
 * Quelle: GerBoLut.json  (Lutherbibel, Public Domain)
 * Ziel:   data-luther/{pad3(nr)}.json  (Bücher 1–66, ohne Apokryphen)
 *
 * Ausführen: node fetch-luther.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const RAW_BASE   = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json';
const LUTHER_DIR = path.join(__dirname, 'data-luther');
const DATA_DIR   = path.join(__dirname, 'data');

// ── Helfer ────────────────────────────────────────────────────────────────────
function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'BibliaLuther/1.0' } }, res => {
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

// Versuche, Buch-Nr anhand Name/Abbrev zu finden
// GerBoLut-Bücher sind in canonischer Reihenfolge (1–66)
// Wir nutzen einfach den Index
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA · Lutherbibel (Protestant-Basis)    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  mkDir(LUTHER_DIR);

  // GerBoLut laden (Lutherbibel)
  const cacheFile = path.join(DATA_DIR, '_GerBoLut.json');
  let luther;
  if (fs.existsSync(cacheFile)) {
    console.log('  → GerBoLut.json aus lokalem Cache …');
    luther = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } else {
    process.stdout.write('  → lade GerBoLut.json (Lutherbibel) …');
    luther = await download(`${RAW_BASE}/GerBoLut.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(luther));
    process.stdout.write(' ✓\n');
  }

  const books = luther.books || [];
  console.log(`  → ${books.length} Bücher in GerBoLut\n`);

  let saved = 0, skip = 0;

  // GerBoLut hat Bücher in kanonischer Reihenfolge (1–66, nur NT+AT)
  // Buch-Nr entspricht Position + 1
  for (let i = 0; i < books.length && i < 66; i++) {
    const nr = i + 1;
    const outFile = path.join(LUTHER_DIR, `${pad3(nr)}.json`);
    if (fs.existsSync(outFile)) { skip++; continue; }
    fs.writeFileSync(outFile, JSON.stringify(toCache(books[i])));
    saved++;
    if (saved % 10 === 0) process.stdout.write(`  … ${saved} Bücher\n`);
  }

  console.log(`\n  ✅  ${saved} Luther-Bücher gespeichert (${skip} übersprungen)`);
  console.log('  → Jetzt: node fetch-greek.js && node build3.js\n');
}

main().catch(e => { console.error('\n  ✗', e.message); process.exit(1); });
