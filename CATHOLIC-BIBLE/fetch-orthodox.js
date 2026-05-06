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

// ── Quellen pro Sprache für orthodoxe Bücher ─────────────────────────────────
// Natives scrollmapper-JSON verwenden wo verfügbar, KJVA als Fallback.
// RusSynodal hat Esdras A/B (als 3./4. Esra), GerTextbibel hat Susanna/Bel im
// Luther-Anhang nicht → KJVA als DE-Fallback für rein orthodox.
// VulgClementine hat Prayer of Manasses + I/II Esdras auf Latein.
const TRANS_MAP = [
  // code          scrollmapper-SC          Sprache
  { code:'kjv',      sc:'KJVA'                },  // KJV + Apocrypha PD ✓
  { code:'german',   sc:'KJVA'                },  // kein DE-Apokryphen in scrollmapper
  { code:'french',   sc:'KJVA'                },  // FreCrampon hat keine OX-Bücher
  { code:'spanish',  sc:'KJVA'                },
  { code:'portuguese',sc:'KJVA'               },
  { code:'polish',   sc:'KJVA'                },
  { code:'russian',  sc:'RusSynodal', hasOX:true }, // hat 3. + 4. Esra (Esdras A/B)
  { code:'croatian', sc:'KJVA'                },
  { code:'dutch',    sc:'KJVA'                },
  { code:'hungarian',sc:'KJVA'                },
  { code:'czech',    sc:'KJVA'                },
  { code:'swedish',  sc:'KJVA'                },
  { code:'tagalog',  sc:'KJVA'                },
  { code:'ukrainian',sc:'KJVA'                },
  { code:'albanian', sc:'KJVA'                },
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

// Globaler Bibel-Cache (kein Doppelt-Download)
const bibleCache = {};

async function getBible(sc) {
  if (bibleCache[sc]) return bibleCache[sc];
  const cacheFile = path.join(DATA_DIR, `_${sc}.json`);
  if (fs.existsSync(cacheFile)) {
    bibleCache[sc] = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    return bibleCache[sc];
  }
  process.stdout.write(`\n  → lade ${sc}.json …`);
  const data = await download(`${RAW_BASE}/${sc}.json`);
  fs.writeFileSync(cacheFile, JSON.stringify(data));
  process.stdout.write(' ✓\n');
  bibleCache[sc] = data;
  return data;
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA · Orthodoxe Zusatz-Bücher (74–80)    ║');
  console.log('║  Alle Sprachen · native Quellen wo verfügbar           ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  mkDir(ORTHO_DIR);

  let totalSaved = 0;

  for (const tr of TRANS_MAP) {
    const dir = path.join(ORTHO_DIR, tr.code);
    mkDir(dir);

    const bible = await getBible(tr.sc);

    let saved = 0;
    for (const ob of ORTHO_BOOKS) {
      const outFile = path.join(dir, `${pad3(ob.nr)}.json`);

      // Immer neu schreiben (überschreibt alten KJVA-only Stand)
      const searchNames = [ob.kjvaName, ob.name];
      // Russisch: RusSynodal-Bücher anders benannt
      if (tr.sc === 'RusSynodal') {
        if (ob.nr === 74) searchNames.push('III Esdras','3 Esdras','Третья Ездры');
        if (ob.nr === 75) searchNames.push('IV Esdras','4 Esdras','Четвёртая Ездры');
      }

      const bookData = findBook(bible.books, searchNames);
      if (!bookData) {
        // Fallback zu KJVA
        const kjva = await getBible('KJVA');
        const fb = findBook(kjva.books, [ob.kjvaName, ob.name]);
        if (fb) {
          fs.writeFileSync(outFile, JSON.stringify(toCache(fb)));
          saved++;
        } else {
          console.log(`  ⚠  ${ob.name} nicht in ${tr.sc} oder KJVA gefunden`);
        }
        continue;
      }

      fs.writeFileSync(outFile, JSON.stringify(toCache(bookData)));
      saved++;
    }

    totalSaved += saved;
    console.log(`  ✓  ${tr.code.padEnd(12)} ← ${tr.sc.padEnd(12)} → ${saved} Bücher gespeichert`);
  }

  // Buch-Metadaten
  const metaFile = path.join(ORTHO_DIR, '_books.json');
  fs.writeFileSync(metaFile, JSON.stringify(ORTHO_BOOKS, null, 2));

  console.log(`\n  ✅  ${totalSaved} orthodoxe Buch-Einträge gespeichert → ${ORTHO_DIR}`);
  console.log('  Jetzt: node build3.js  (baut HTML mit Konfessions-Switcher)\n');
}

main().catch(e => { console.error('\n  ✗', e.message); process.exit(1); });
