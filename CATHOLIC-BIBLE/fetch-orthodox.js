'use strict';
/**
 * BIBLIA CATHOLICA → fetch-orthodox.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Lädt die zusätzlichen Bücher des orthodoxen Kanons (Bücher 74–80),
 * die im katholischen Kanon fehlen:
 *
 *  Nr  Buch                       Quelle (scrollmapper)
 *  74  1 Esdras (Esdras A)        KJVA  "I Esdras"
 *  75  2 Esdras (Esdras B/4)      KJVA  "II Esdras"
 *  76  Gebet des Manasse           KJVA  "Prayer of Manasses"
 *  77  Gebet des Asarjas           KJVA  "Prayer of Azariah"
 *  78  Susanna                    KJVA  "Susanna"
 *  79  Bel und der Drache         KJVA  "Bel and the Dragon"
 *  80  Zusätze zu Esther          KJVA  "Additions to Esther"
 *
 * Englisch: KJVA (KJV + Apocrypha, Public Domain) ✓
 * Andere Sprachen: Englischer Text wird als Fallback gespeichert,
 *   da scrollmapper keine orthodoxen Vollbibeln in anderen Sprachen hat.
 *
 * Ausführung:  node fetch-orthodox.js
 * Danach:      node build3.js  (baut HTML mit conf-Switcher)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const RAW_BASE   = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json';
const DATA_DIR   = path.join(__dirname, 'data');
const ORTHO_DIR  = path.join(__dirname, 'data-orthodox');  // eigenes Verzeichnis

// ── Orthodoxe Zusatz-Bücher (über Nr. 73 hinaus) ─────────────────────────────
const ORTHO_BOOKS = [
  { nr:74, name:'1 Esdras',             kjvaName:'I Esdras',             latin:'I Esdras'         },
  { nr:75, name:'2 Esdras',             kjvaName:'II Esdras',            latin:'II Esdras'        },
  { nr:76, name:'Prayer of Manasses',   kjvaName:'Prayer of Manasses',   latin:'Oratio Manassis'  },
  { nr:77, name:'Prayer of Azariah',    kjvaName:'Prayer of Azariah',    latin:'Azariae Oratio'   },
  { nr:78, name:'Susanna',              kjvaName:'Susanna',              latin:'Susanna'          },
  { nr:79, name:'Bel and the Dragon',   kjvaName:'Bel and the Dragon',   latin:'Bel et Draco'     },
  { nr:80, name:'Additions to Esther',  kjvaName:'Additions to Esther',  latin:'Addita Esther'    },
];

// ── Alle Projekt-Übersetzungen ────────────────────────────────────────────────
// Für orthodoxe Bücher: Englisch aus KJVA, andere Sprachen als Fallback KJV
const TRANS_CODES = [
  'kjv','german','french','spanish','portuguese','polish',
  'russian','croatian','dutch','hungarian','czech','swedish',
  'tagalog','ukrainian','albanian',
];

// ── Helfer ────────────────────────────────────────────────────────────────────
function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'BibliaOrthodox/1.0' } }, res => {
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
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
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

function findBook(books, names) {
  for (const b of (books || [])) {
    const n = (b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const name of names) {
      if (n === name.toLowerCase().replace(/[^a-z0-9]/g, '')) return b;
    }
  }
  return null;
}

let kjvaBible = null;

async function getKJVA() {
  if (kjvaBible) return kjvaBible;
  const cacheFile = path.join(DATA_DIR, '_KJVA.json');
  if (fs.existsSync(cacheFile)) {
    kjvaBible = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    return kjvaBible;
  }
  process.stdout.write('\n  → lade KJVA.json (KJV + Apocrypha) …');
  kjvaBible = await download(`${RAW_BASE}/KJVA.json`);
  fs.writeFileSync(cacheFile, JSON.stringify(kjvaBible));
  process.stdout.write(' ✓\n');
  return kjvaBible;
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA · Orthodoxe Zusatz-Bücher (74–80)    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  mkDir(ORTHO_DIR);

  // KJVA laden
  const kjva = await getKJVA();

  let totalSaved = 0;

  // Für jede Übersetzung: orthodoxe Bücher aus KJVA speichern
  for (const code of TRANS_CODES) {
    const dir = path.join(ORTHO_DIR, code);
    mkDir(dir);
    let saved = 0, skip = 0;

    for (const ob of ORTHO_BOOKS) {
      const outFile = path.join(dir, `${pad3(ob.nr)}.json`);
      if (fs.existsSync(outFile)) { skip++; continue; }

      // Für alle Sprachen: KJVA als Quelle (einzige verfügbare PD-Vollbibel mit Apokryphen)
      // Russisch und Ukrainisch haben im scrollmapper keine orthodoxen Apokryphen-Versionen
      const bookData = findBook(kjva.books, [ob.kjvaName, ob.name]);
      if (!bookData) {
        console.log(`  ⚠  ${ob.name} nicht in KJVA gefunden`);
        continue;
      }

      fs.writeFileSync(outFile, JSON.stringify(toCache(bookData)));
      saved++;
    }

    totalSaved += saved;
    if (saved > 0) console.log(`  ✓  ${code.padEnd(12)} → ${saved} Bücher gespeichert`);
  }

  // Buch-Metadaten für build3.js speichern
  const metaFile = path.join(ORTHO_DIR, '_books.json');
  fs.writeFileSync(metaFile, JSON.stringify(ORTHO_BOOKS, null, 2));

  console.log(`\n  ✅  ${totalSaved} orthodoxe Buch-Einträge gespeichert → ${ORTHO_DIR}`);
  console.log('  Jetzt: node build3.js  (baut HTML mit Konfessions-Switcher)\n');
}

main().catch(e => { console.error('\n  ✗', e.message); process.exit(1); });
