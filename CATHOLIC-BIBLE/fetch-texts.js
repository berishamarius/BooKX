'use strict';

/**
 * BIBLIA CATHOLICA INTERLINEARIS – TEXT DOWNLOADER v2
 * ─────────────────────────────────────────────────────
 * Lädt komplette Bibel-JSON-Dateien von GitHub
 * (scrollmapper/bible_databases, MIT-Lizenz)
 * und speichert sie als lokalen Cache.
 *
 * Alle verwendeten Texte sind gemeinfrei (Public Domain):
 *   - VulgClementine: Clementine Vulgate (Latein)
 *   - KJV:            King James Version (1611, Englisch)
 *   - GerTextbibel:   Textbibel (1906, Deutsch)
 *   - FreCrampon:     Crampon (1923, Französisch)
 *   - SpaRV:          Reina-Valera (1909, Spanisch)
 *   - PorBLivre:      Bíblia Livre (Portugiesisch)
 *   - PolGdanska:     Biblia Gdańska (1881, Polnisch)
 *   - RusSynodal:     Синодальный перевод (1876, Russisch)
 *   - CroSaric:       Hrvatska Biblija Šarića (Kroatisch)
 *   - DutSVV:         Statenvertaling (1637, Niederländisch)
 *   - HunKar:         Károli (1908, Ungarisch)
 *   - CzeBKR:         Bible Kralická (1613, Tschechisch)
 *   - Swe1917:        Svenska Bibeln (1917, Schwedisch)
 *   - TagAngBiblia:   Ang Biblia (1905, Filipino)
 *   - UkrOgienko:     Біблія Огієнка (1962, Ukrainisch)
 *
 * Ausführung: node fetch-texts.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ═══════════════════════════════════════════════════════
//  KONFIGURATION
// ═══════════════════════════════════════════════════════

const RAW_BASE     = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json';
const GETBIBLE_BASE = 'https://api.getbible.net/v2';
const DATA_DIR = path.join(__dirname, 'data');

// ═══════════════════════════════════════════════════════
//  ÜBERSETZUNGEN  (scrollmapper-Code → Projektcode)
// ═══════════════════════════════════════════════════════

const TRANSLATIONS = [
  { code: 'vulgate',    sc: 'VulgClementine', lang: 'la', name: 'Vulgata Clementina',       isBase: true },
  { code: 'kjv',        sc: 'KJV',            lang: 'en', name: 'King James Version (1611)',  deuteroSc: 'KJVA'         },
  { code: 'german',     sc: 'GerTextbibel',   lang: 'de', name: 'Textbibel (1906)',             deuteroSc: 'GerGruenewald'},
  { code: 'french',     sc: 'FreCrampon',     lang: 'fr', name: 'Crampon (1923)'                         },
  { code: 'spanish',    sc: 'SpaRV',          lang: 'es', name: 'Reina-Valera (1909)',          deuteroSc: 'SpaPlatense'  },
  { code: 'portuguese', sc: 'PorBLivre',      lang: 'pt', name: 'Bíblia Livre',                         deuteroSc: 'PorNVA'        },
  { code: 'polish',     sc: 'PolGdanska',     lang: 'pl', name: 'Biblia Gdańska (1881)'                 },
  { code: 'russian',    sc: 'RusSynodal',     lang: 'ru', name: 'Синодальный (1876)'                    },
  { code: 'croatian',   sc: 'CroSaric',       lang: 'hr', name: 'Hrvatska Biblija Šarića'               },
  { code: 'dutch',      sc: 'DutSVV',         lang: 'nl', name: 'Statenvertaling (1637)'                },
  { code: 'hungarian',  sc: 'HunKar',         lang: 'hu', name: 'Károli (1908)'                         },
  { code: 'czech',      sc: 'CzeBKR',         lang: 'cs', name: 'Bible Kralická (1613)',                deuteroSc: 'CzeCSP'        },
  { code: 'swedish',    sc: 'Swe1917',        lang: 'sv', name: 'Svenska Bibeln (1917)'                 },
  { code: 'tagalog',    sc: 'TagAngBiblia',   lang: 'tl', name: 'Ang Biblia (1905)'                     },
  { code: 'ukrainian',  sc: 'ukrogienko',    lang: 'uk', name: 'Біблія Огієнка (1930)',  api: 'getbible' },
  { code: 'albanian',   sc: 'alb',            lang: 'sq', name: 'Albanian Bible (PD)',    api: 'getbible' },
  { code: 'italian',    sc: 'giovanni',       lang: 'it', name: 'Giovanni Diodati (1649)',api: 'getbible' },
  { code: 'croatian',   sc: 'croatia',        lang: 'hr', name: 'Hrvatska Biblija (PD)', api: 'getbible' },
];

// ═══════════════════════════════════════════════════════
//  BÜCHERLISTE
// ═══════════════════════════════════════════════════════

const BOOKS = [
  {nr:1,  name:'Genesis'},        {nr:2,  name:'Exodus'},          {nr:3,  name:'Leviticus'},
  {nr:4,  name:'Numbers'},        {nr:5,  name:'Deuteronomy'},     {nr:6,  name:'Joshua'},
  {nr:7,  name:'Judges'},         {nr:8,  name:'Ruth'},            {nr:9,  name:'1 Samuel'},
  {nr:10, name:'2 Samuel'},       {nr:11, name:'1 Kings'},         {nr:12, name:'2 Kings'},
  {nr:13, name:'1 Chronicles'},   {nr:14, name:'2 Chronicles'},    {nr:15, name:'Ezra'},
  {nr:16, name:'Nehemiah'},       {nr:17, name:'Esther'},          {nr:18, name:'Job'},
  {nr:19, name:'Psalms'},         {nr:20, name:'Proverbs'},        {nr:21, name:'Ecclesiastes'},
  {nr:22, name:'Song of Solomon'},{nr:23, name:'Isaiah'},          {nr:24, name:'Jeremiah'},
  {nr:25, name:'Lamentations'},   {nr:26, name:'Ezekiel'},         {nr:27, name:'Daniel'},
  {nr:28, name:'Hosea'},          {nr:29, name:'Joel'},            {nr:30, name:'Amos'},
  {nr:31, name:'Obadiah'},        {nr:32, name:'Jonah'},           {nr:33, name:'Micah'},
  {nr:34, name:'Nahum'},          {nr:35, name:'Habakkuk'},        {nr:36, name:'Zephaniah'},
  {nr:37, name:'Haggai'},         {nr:38, name:'Zechariah'},       {nr:39, name:'Malachi'},
  {nr:40, name:'Matthew'},        {nr:41, name:'Mark'},            {nr:42, name:'Luke'},
  {nr:43, name:'John'},           {nr:44, name:'Acts'},            {nr:45, name:'Romans'},
  {nr:46, name:'1 Corinthians'},  {nr:47, name:'2 Corinthians'},   {nr:48, name:'Galatians'},
  {nr:49, name:'Ephesians'},      {nr:50, name:'Philippians'},     {nr:51, name:'Colossians'},
  {nr:52, name:'1 Thessalonians'},{nr:53, name:'2 Thessalonians'}, {nr:54, name:'1 Timothy'},
  {nr:55, name:'2 Timothy'},      {nr:56, name:'Titus'},           {nr:57, name:'Philemon'},
  {nr:58, name:'Hebrews'},        {nr:59, name:'James'},           {nr:60, name:'1 Peter'},
  {nr:61, name:'2 Peter'},        {nr:62, name:'1 John'},          {nr:63, name:'2 John'},
  {nr:64, name:'3 John'},         {nr:65, name:'Jude'},            {nr:66, name:'Revelation'},
  // Deuterokanonisch
  {nr:67, name:'Tobit'},          {nr:68, name:'Judith'},          {nr:69, name:'1 Maccabees'},
  {nr:70, name:'2 Maccabees'},    {nr:71, name:'Wisdom'},          {nr:72, name:'Sirach'},
  {nr:73, name:'Baruch'},
];

// Alias-Namen zum Buch-Matching (scrollmapper nutzt römische Zahlen)
const ALIASES = {
  '1samuel':        ['i samuel'],
  '2samuel':        ['ii samuel'],
  '1kings':         ['i kings'],
  '2kings':         ['ii kings'],
  '1chronicles':    ['i chronicles'],
  '2chronicles':    ['ii chronicles'],
  '1corinthians':   ['i corinthians'],
  '2corinthians':   ['ii corinthians'],
  '1thessalonians': ['i thessalonians'],
  '2thessalonians': ['ii thessalonians'],
  '1timothy':       ['i timothy'],
  '2timothy':       ['ii timothy'],
  '1peter':         ['i peter'],
  '2peter':         ['ii peter'],
  '1john':          ['i john'],
  '2john':          ['ii john'],
  '3john':          ['iii john'],
  '1maccabees':     ['i maccabees'],
  '2maccabees':     ['ii maccabees'],
  'songofsolomon':  ['song of songs','canticles','canticum'],
  'revelation':     ['revelation of john','apocalypse'],
  'acts':           ['acts of the apostles'],
  'sirach':         ['ecclesiasticus'],
  'wisdom':         ['book of wisdom','wisdom of solomon'],
};

// ═══════════════════════════════════════════════════════
//  HELFER
// ═══════════════════════════════════════════════════════

function download(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : require('http');
    const req = lib.get(url, { headers: { 'User-Agent': 'BibliaInterlinearis/2.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return resolve(download(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP_' + res.statusCode));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { reject(new Error('JSON_PARSE: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(90000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
  });
}

const mkDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const pad3  = n => String(n).padStart(3, '0');

/** getBible-API-Format → build.js-kompatibles Cache-Format */
function toBookCacheFromGetBible(bookData) {
  const chapters = {};
  for (const [chNum, chObj] of Object.entries(bookData.chapter || {})) {
    const verses = {};
    for (const [vNum, vObj] of Object.entries(chObj)) {
      verses[parseInt(vNum)] = { verse: parseInt(vNum), text: (vObj.text || '').trim() };
    }
    chapters[parseInt(chNum)] = { chapter: parseInt(chNum), name: '', verses };
  }
  return { chapters };
}

/** scrollmapper-Format → build.js-kompatibles Cache-Format */
function toBookCache(bookData) {
  const chapters = {};
  for (const ch of (bookData.chapters || [])) {
    const verses = {};
    for (const v of (ch.verses || [])) verses[v.verse] = { verse: v.verse, text: v.text || '' };
    chapters[ch.chapter] = { chapter: ch.chapter, name: '', verses };
  }
  return { chapters };
}

/** Baut eine Map normalisierter Name → Buchobjekt */
function buildNameMap(booksArr) {
  const map = {};
  for (const b of (booksArr || [])) {
    const key = (b.name || '').toLowerCase().replace(/\s+/g, '');
    map[key] = b;
    map[(b.name || '').toLowerCase()] = b;
  }
  return map;
}

function findBook(nameMap, bookName) {
  const key = bookName.toLowerCase().replace(/\s+/g, '');
  if (nameMap[key]) return nameMap[key];
  if (nameMap[bookName.toLowerCase()]) return nameMap[bookName.toLowerCase()];
  // Aliases
  for (const [canonical, alts] of Object.entries(ALIASES)) {
    if (key === canonical || alts.map(a => a.replace(/\s+/g,'')).includes(key)) {
      for (const k of [canonical, ...alts]) {
        const mk = k.replace(/\s+/g,'');
        if (nameMap[mk]) return nameMap[mk];
        if (nameMap[k])  return nameMap[k];
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   BIBLIA CATHOLICA INTERLINEARIS – TEXT DOWNLOADER    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log('  Quelle: github.com/scrollmapper/bible_databases (MIT)\n');

  mkDir(DATA_DIR);

  for (const t of TRANSLATIONS) {
    const dir       = path.join(DATA_DIR, t.code);
    const cacheFile = path.join(DATA_DIR, `_${t.sc}.json`);
    mkDir(dir);

    console.log(`\n📖  [${t.sc.padEnd(16)}]  ${t.name}`);

    // Komplette Bibel-Datei herunterladen (gecacht als _Code.json)
    let bible;
    if (fs.existsSync(cacheFile)) {
      console.log('     → gecacht, überspringe Download');
      bible = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } else {
      const url = t.api === 'getbible'
        ? `${GETBIBLE_BASE}/${t.sc}.json`
        : `${RAW_BASE}/${t.sc}.json`;
      process.stdout.write(`     → lade ${t.sc}.json …`);
      try {
        bible = await download(url);
        fs.writeFileSync(cacheFile, JSON.stringify(bible));
        process.stdout.write(' ✓\n');
      } catch (err) {
        process.stdout.write(` ✗ ${err.message}\n`);
        continue;
      }
    }

    if (t.api === 'getbible') {
      // getBible-Format ist identisch mit scrollmapper: { books: [ { nr, name, chapters } ] }
      const nameMap = buildNameMap(bible.books);
      // Auch nr-basiert suchen (Fallback für Revelation of John etc.)
      const nrMap = {};
      for (const b of (bible.books || [])) {
        if (b.nr) nrMap[b.nr] = b;
      }
      const books = BOOKS;
      let saved = 0, missing = 0;
      for (const book of books) {
        const file = path.join(dir, `${pad3(book.nr)}.json`);
        if (fs.existsSync(file)) { saved++; continue; }
        const raw = findBook(nameMap, book.name) || nrMap[book.nr] || null;
        if (raw) {
          fs.writeFileSync(file, JSON.stringify(toBookCache(raw)));
          saved++;
        } else {
          missing++;
          if (missing <= 3) process.stdout.write(`  ⚠ nicht gefunden: ${book.name} (#${book.nr})\n`);
        }
      }
      console.log(`     ✓ ${saved} Bücher gespeichert · ${missing} nicht gefunden`);
    } else {
      // scrollmapper-Format: { books: [ { name, chapters } ] }
      const nameMap = buildNameMap(bible.books);
      const books   = BOOKS;

      let saved = 0, missing = 0;
      for (const book of books) {
        const file = path.join(dir, `${pad3(book.nr)}.json`);
        if (fs.existsSync(file)) { saved++; continue; }

        const raw = findBook(nameMap, book.name);
        if (raw) {
          fs.writeFileSync(file, JSON.stringify(toBookCache(raw)));
          saved++;
        } else {
          missing++;
          if (missing <= 3) process.stdout.write(`  ⚠ nicht gefunden: ${book.name}\n`);
        }
      }
      console.log(`     ✓ ${saved} Bücher gespeichert · ${missing} nicht gefunden`);
    }

    // ─── DEUTEROKANONISCHER FALLBACK ───────────────────────────────
    if (t.deuteroSc) {
      const deuteroBooks = BOOKS.filter(b => b.nr >= 67);
      const missingDeutero = deuteroBooks.filter(b => !fs.existsSync(path.join(dir, `${pad3(b.nr)}.json`)));
      if (missingDeutero.length > 0) {
        const dCacheFile = path.join(DATA_DIR, `_${t.deuteroSc}.json`);
        let dBible;
        if (fs.existsSync(dCacheFile)) {
          dBible = JSON.parse(fs.readFileSync(dCacheFile, 'utf8'));
        } else {
          const url = `${RAW_BASE}/${t.deuteroSc}.json`;
          process.stdout.write(`     → deutero: ${t.deuteroSc}.json …`);
          try {
            dBible = await download(url);
            fs.writeFileSync(dCacheFile, JSON.stringify(dBible));
            process.stdout.write(' ✓\n');
          } catch(err) {
            process.stdout.write(` ✗ ${err.message}\n`);
          }
        }
        if (dBible) {
          const dMap = buildNameMap(dBible.books);
          for (const book of missingDeutero) {
            const raw = findBook(dMap, book.name);
            if (raw) {
              fs.writeFileSync(path.join(dir, `${pad3(book.nr)}.json`), JSON.stringify(toBookCache(raw)));
              process.stdout.write(`     ✓ ${book.name} (${t.deuteroSc})\n`);
            } else {
              process.stdout.write(`     ⚠ ${book.name} nicht in ${t.deuteroSc}\n`);
            }
          }
        }
      }
    }
  }

  console.log('\n✅  Fertig! Daten unter: ' + DATA_DIR);
  console.log('\n  Nächster Schritt: node build.js\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  process.exit(1);
});

