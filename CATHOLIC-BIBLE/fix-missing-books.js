'use strict';
/**
 * BIBLIA CATHOLICA · fix-missing-books.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Problem:  fetch-texts.js hat für Nicht-Latein-Übersetzungen nur Bücher 1–66
 *           heruntergeladen.  Die 7 deuterokanonischen Bücher (67–73) fehlen
 *           daher in den Sprachversionen.
 *
 * Lösung:   Für Übersetzungen, die diese Bücher enthalten
 *           (kath./orth. Quellen in scrollmapper), werden sie nachgeladen.
 *           Englisch (KJV-Apokryphen) als Fallback für alle.
 *
 * Katholisch-/Orthodox-kompatible scrollmapper-Quellen:
 *   GerTextbibel  (german)    → kath. DE 1906
 *   FreCrampon    (french)    → kath. FR 1923
 *   RusSynodal    (russian)   → orth. RU 1876
 *   CroSaric      (croatian)  → kath. HR
 *   UkrOgienko    (ukrainian) → orth. UK 1962
 *   KJVA          (english)   → KJV + Apocrypha (alle anderen EN-Übersetzungen)
 *
 * Ausführung:  node fix-missing-books.js
 * Danach:      node build3.js  (HTML neu bauen)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const RAW_BASE = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json';
const DATA_DIR = path.join(__dirname, 'data');

// ── Deuterokanonische Bücher (nr 67–73) ──────────────────────────────────────
const DK_BOOKS = [
  { nr:67, name:'Tobit',       aliases:['tobit','tobias','tob'] },
  { nr:68, name:'Judith',      aliases:['judith','jdt','jdth'] },
  { nr:69, name:'1 Maccabees', aliases:['i maccabees','1 maccabees','1maccabees'] },
  { nr:70, name:'2 Maccabees', aliases:['ii maccabees','2 maccabees','2maccabees'] },
  { nr:71, name:'Wisdom',      aliases:['wisdom','wisdom of solomon','book of wisdom'] },
  { nr:72, name:'Sirach',      aliases:['sirach','ecclesiasticus','ecclus'] },
  { nr:73, name:'Baruch',      aliases:['baruch','bar'] },
];

// ── Quellen-Konfiguration ────────────────────────────────────────────────────
// code = Projektcode in data/{code}/  |  sc = scrollmapper-Dateiname
const SOURCES = [
  { code:'german',    sc:'GerTextbibel',  hasDK: true,  fallback:'kjv' },
  { code:'french',    sc:'FreCrampon',    hasDK: true  },
  { code:'russian',   sc:'RusSynodal',    hasDK: true  },
  { code:'croatian',  sc:'CroSaric',      hasDK: true  },
  { code:'ukrainian', sc:'UkrOgienko',    hasDK: true  },
  // Alle anderen: KJVA als englische Apokryphen-Quelle
  { code:'kjv',       sc:'KJVA',          hasDK: true  },  // überschreibt KJV mit KJVA
  { code:'spanish',   sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'portuguese',sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'polish',    sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'dutch',     sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'hungarian', sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'czech',     sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'swedish',   sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'tagalog',   sc:'KJVA',          hasDK: false, fallback:'kjv' },
  { code:'albanian',  sc:'KJVA',          hasDK: false, fallback:'kjv' },
];

// ── Helfer ────────────────────────────────────────────────────────────────────
function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'BibliaFix/1.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return resolve(download(res.headers.location));
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
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
  });
}

const pad3  = n => String(n).padStart(3, '0');
const mkDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

/** scrollmapper-Format → build3.js-kompatibles Cache-Format */
function toCache(bookData) {
  const chapters = {};
  for (const ch of (bookData.chapters || [])) {
    const verses = {};
    for (const v of (ch.verses || [])) verses[v.verse] = { verse: v.verse, text: v.text || '' };
    chapters[ch.chapter] = { chapter: ch.chapter, name: '', verses };
  }
  return { chapters };
}

/** Findet ein Buch in der scrollmapper-Buchliste (tolerant gegenüber Varianten) */
function findBook(books, dkBook) {
  for (const b of (books || [])) {
    const n = (b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const alias of [dkBook.name.toLowerCase().replace(/[^a-z0-9]/g,''), ...dkBook.aliases]) {
      const a = alias.replace(/[^a-z0-9]/g, '');
      if (n === a) return b;
    }
  }
  return null;
}

// ── Globaler Cache der scrollmapper-Bibeln (vermeidet Mehrfach-Download) ──────
const bibleCache = {};

async function getBible(sc) {
  if (bibleCache[sc]) return bibleCache[sc];
  const cacheFile = path.join(DATA_DIR, `_${sc}.json`);
  if (fs.existsSync(cacheFile)) {
    bibleCache[sc] = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    return bibleCache[sc];
  }
  const url = `${RAW_BASE}/${sc}.json`;
  process.stdout.write(`\n     → lade ${sc}.json …`);
  const data = await download(url);
  fs.writeFileSync(cacheFile, JSON.stringify(data));
  process.stdout.write(' ✓');
  bibleCache[sc] = data;
  return data;
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA · Fix fehlender DK-Bücher (67–73)    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  mkDir(DATA_DIR);

  for (const src of SOURCES) {
    const dir = path.join(DATA_DIR, src.code);
    mkDir(dir);
    console.log(`\n  📖  [${src.code.padEnd(12)}]  ← ${src.sc}`);

    // Fallback-Quelle: wenn hasDK=false, kopieren wir aus dem KJV-Cache
    const sourceSC = (src.fallback && !src.hasDK) ? 'KJVA' : src.sc;
    let bible;
    try {
      bible = await getBible(sourceSC);
    } catch (e) {
      console.log(`     ✗ Download-Fehler: ${e.message}`);
      continue;
    }

    let saved = 0, skipped = 0, missing = 0;
    for (const dk of DK_BOOKS) {
      const outFile = path.join(dir, `${pad3(dk.nr)}.json`);

      if (fs.existsSync(outFile)) {
        skipped++;
        continue;
      }

      const bookData = findBook(bible.books, dk);
      if (!bookData) {
        console.log(`     ⚠  ${dk.name} nicht gefunden in ${sourceSC}`);
        missing++;
        continue;
      }

      fs.writeFileSync(outFile, JSON.stringify(toCache(bookData)));
      saved++;
      console.log(`     ✓  ${dk.name} → ${pad3(dk.nr)}.json  (${bookData.chapters?.length || 0} Kapitel)`);
    }

    const note = src.fallback ? ` [KJV-Apokryphen als EN-Fallback]` : '';
    console.log(`     → gespeichert: ${saved}, übersprungen: ${skipped}, fehlend: ${missing}${note}`);
  }

  console.log('\n\n  ✅  Alle deuterokanonischen Bücher nachgeladen.');
  console.log('  Jetzt:  node build3.js  (HTML neu generieren)\n');
}

main().catch(e => { console.error('\n  ✗ Fehler:', e.message); process.exit(1); });
