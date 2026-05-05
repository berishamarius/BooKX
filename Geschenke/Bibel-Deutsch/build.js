'use strict';

/**
 * BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR
 * ─────────────────────────────────────────────────
 * Liest die gecachten JSON-Daten (aus fetch-texts.js)
 * und generiert für jede Sprache ein vollständiges HTML-eBook:
 *   • Cover-Seite  (cover.html)
 *   • Rückseite    (back-cover.html)
 *   • Hauptindex   (index.html)
 *   • Pro Sprache  Übersetzungen/{lang}/index.html
 *   • Pro Buch     Übersetzungen/{lang}/bücher/{nr}-{name}.html
 *
 * Ausführung: node build.js
 *
 * Hinweis: Alle verwendeten Texte sind gemeinfrei (Public Domain).
 * Bitte prüfen Sie die geltenden Urheberrechtsgesetze in Ihrem Land.
 */

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════
//  KONFIGURATION
// ═══════════════════════════════════════════════════════

const DATA_DIR = path.join(__dirname, 'data');
const OUT_DIR  = path.join(__dirname, 'Übersetzungen');

const TRANSLATIONS = [
  { code: 'kjv',        lang: 'en', name: 'Englisch',    native: 'English',     display: 'King James Version (1611)',          flag: '🇬🇧', country: 'Großbritannien · USA · Irland · Australien · Philippinen' },
  { code: 'german',     lang: 'de', name: 'Deutsch',     native: 'Deutsch',     display: 'Luther Bibel (1912)',                flag: '🇩🇪', country: 'Deutschland · Österreich · Schweiz'                    },
  { code: 'french',     lang: 'fr', name: 'Français',    native: 'Français',    display: 'Louis Segond (1910)',                flag: '🇫🇷', country: 'Frankreich · Belgien · Kanada'                        },
  { code: 'spanish',    lang: 'es', name: 'Español',     native: 'Español',     display: 'Reina-Valera (1909)',                flag: '🇪🇸', country: 'Spanien · Mexiko · Lateinamerika'                     },
  { code: 'italian',    lang: 'it', name: 'Italiano',    native: 'Italiano',    display: 'Giovanni Diodati',                   flag: '🇮🇹', country: 'Italien · Vatikanstadt'                               },
  { code: 'portuguese', lang: 'pt', name: 'Português',   native: 'Português',   display: 'Almeida Revista e Corrigida',        flag: '🇧🇷', country: 'Brasilien · Portugal'                                 },
  { code: 'polish',     lang: 'pl', name: 'Polski',      native: 'Polski',      display: 'Biblia Gdańska',                    flag: '🇵🇱', country: 'Polen'                                                },
  { code: 'romanian',   lang: 'ro', name: 'Română',      native: 'Română',      display: 'Cornilescu (1921)',                  flag: '🇷🇴', country: 'Rumänien'                                             },
  { code: 'russian',    lang: 'ru', name: 'Russisch',    native: 'Русский',     display: 'Синодальный перевод (1876)',         flag: '🇷🇺', country: 'Russland · Belarus'                                   },
  { code: 'croatian',   lang: 'hr', name: 'Hrvatski',    native: 'Hrvatski',    display: 'Hrvatska Biblija',                   flag: '🇭🇷', country: 'Kroatien · Bosnien'                                  },
  { code: 'dutch',      lang: 'nl', name: 'Nederlands',  native: 'Nederlands',  display: 'Statenvertaling (1637)',             flag: '🇳🇱', country: 'Niederlande · Belgien'                                },
  { code: 'hungarian',  lang: 'hu', name: 'Magyar',      native: 'Magyar',      display: 'Károli (1908)',                      flag: '🇭🇺', country: 'Ungarn'                                               },
  { code: 'czech',      lang: 'cs', name: 'Čeština',     native: 'Čeština',     display: 'Bible Kralická (1613)',              flag: '🇨🇿', country: 'Tschechien · Slowakei'                               },
  { code: 'swedish',    lang: 'sv', name: 'Svenska',     native: 'Svenska',     display: 'Svenska Bibeln',                    flag: '🇸🇪', country: 'Schweden · Norwegen · Dänemark'                       },
  { code: 'tagalog',    lang: 'tl', name: 'Filipino',    native: 'Filipino',    display: 'Ang Biblia (1905)',                  flag: '🇵🇭', country: 'Philippinen'                                         },
  { code: 'ukrainian',  lang: 'uk', name: 'Українська',  native: 'Українська',  display: 'Біблія Огієнка (1962)',             flag: '🇺🇦', country: 'Ukraine'                                             },
];

const BOOKS = [
  // OT
  { nr:  1, abbrev: 'gen', name: 'Genesis',          latin: 'Genesis',               testament: 'VT' },
  { nr:  2, abbrev: 'exo', name: 'Exodus',           latin: 'Exodus',                testament: 'VT' },
  { nr:  3, abbrev: 'lev', name: 'Leviticus',        latin: 'Leviticus',             testament: 'VT' },
  { nr:  4, abbrev: 'num', name: 'Numbers',          latin: 'Numeri',                testament: 'VT' },
  { nr:  5, abbrev: 'deu', name: 'Deuteronomy',      latin: 'Deuteronomium',         testament: 'VT' },
  { nr:  6, abbrev: 'jos', name: 'Joshua',           latin: 'Iosue',                 testament: 'VT' },
  { nr:  7, abbrev: 'jdg', name: 'Judges',           latin: 'Iudicum',               testament: 'VT' },
  { nr:  8, abbrev: 'rut', name: 'Ruth',             latin: 'Ruth',                  testament: 'VT' },
  { nr:  9, abbrev: '1sa', name: '1 Samuel',         latin: 'I Regum',               testament: 'VT' },
  { nr: 10, abbrev: '2sa', name: '2 Samuel',         latin: 'II Regum',              testament: 'VT' },
  { nr: 11, abbrev: '1ki', name: '1 Kings',          latin: 'III Regum',             testament: 'VT' },
  { nr: 12, abbrev: '2ki', name: '2 Kings',          latin: 'IV Regum',              testament: 'VT' },
  { nr: 13, abbrev: '1ch', name: '1 Chronicles',     latin: 'I Paralipomenon',       testament: 'VT' },
  { nr: 14, abbrev: '2ch', name: '2 Chronicles',     latin: 'II Paralipomenon',      testament: 'VT' },
  { nr: 15, abbrev: 'ezr', name: 'Ezra',             latin: 'I Esdras',              testament: 'VT' },
  { nr: 16, abbrev: 'neh', name: 'Nehemiah',         latin: 'II Esdras',             testament: 'VT' },
  { nr: 17, abbrev: 'est', name: 'Esther',           latin: 'Esther',                testament: 'VT' },
  { nr: 18, abbrev: 'job', name: 'Job',              latin: 'Iob',                   testament: 'VT' },
  { nr: 19, abbrev: 'psa', name: 'Psalms',           latin: 'Psalmi',                testament: 'VT' },
  { nr: 20, abbrev: 'pro', name: 'Proverbs',         latin: 'Proverbia',             testament: 'VT' },
  { nr: 21, abbrev: 'ecc', name: 'Ecclesiastes',     latin: 'Ecclesiastes',          testament: 'VT' },
  { nr: 22, abbrev: 'sng', name: 'Song of Solomon',  latin: 'Canticum Canticorum',   testament: 'VT' },
  { nr: 23, abbrev: 'isa', name: 'Isaiah',           latin: 'Isaias',                testament: 'VT' },
  { nr: 24, abbrev: 'jer', name: 'Jeremiah',         latin: 'Ieremias',              testament: 'VT' },
  { nr: 25, abbrev: 'lam', name: 'Lamentations',     latin: 'Threni',                testament: 'VT' },
  { nr: 26, abbrev: 'eze', name: 'Ezekiel',          latin: 'Ezechiel',              testament: 'VT' },
  { nr: 27, abbrev: 'dan', name: 'Daniel',           latin: 'Daniel',                testament: 'VT' },
  { nr: 28, abbrev: 'hos', name: 'Hosea',            latin: 'Osee',                  testament: 'VT' },
  { nr: 29, abbrev: 'joe', name: 'Joel',             latin: 'Ioel',                  testament: 'VT' },
  { nr: 30, abbrev: 'amo', name: 'Amos',             latin: 'Amos',                  testament: 'VT' },
  { nr: 31, abbrev: 'oba', name: 'Obadiah',          latin: 'Abdias',                testament: 'VT' },
  { nr: 32, abbrev: 'jon', name: 'Jonah',            latin: 'Ionas',                 testament: 'VT' },
  { nr: 33, abbrev: 'mic', name: 'Micah',            latin: 'Micheas',               testament: 'VT' },
  { nr: 34, abbrev: 'nah', name: 'Nahum',            latin: 'Nahum',                 testament: 'VT' },
  { nr: 35, abbrev: 'hab', name: 'Habakkuk',         latin: 'Habacuc',               testament: 'VT' },
  { nr: 36, abbrev: 'zep', name: 'Zephaniah',        latin: 'Sophonias',             testament: 'VT' },
  { nr: 37, abbrev: 'hag', name: 'Haggai',           latin: 'Aggaeus',               testament: 'VT' },
  { nr: 38, abbrev: 'zec', name: 'Zechariah',        latin: 'Zacharias',             testament: 'VT' },
  { nr: 39, abbrev: 'mal', name: 'Malachi',          latin: 'Malachias',             testament: 'VT' },
  // NT
  { nr: 40, abbrev: 'mat', name: 'Matthew',          latin: 'Matthaeus',             testament: 'NT' },
  { nr: 41, abbrev: 'mrk', name: 'Mark',             latin: 'Marcus',                testament: 'NT' },
  { nr: 42, abbrev: 'luk', name: 'Luke',             latin: 'Lucas',                 testament: 'NT' },
  { nr: 43, abbrev: 'joh', name: 'John',             latin: 'Ioannes',               testament: 'NT' },
  { nr: 44, abbrev: 'act', name: 'Acts',             latin: 'Actus Apostolorum',     testament: 'NT' },
  { nr: 45, abbrev: 'rom', name: 'Romans',           latin: 'Ad Romanos',            testament: 'NT' },
  { nr: 46, abbrev: '1co', name: '1 Corinthians',    latin: 'I Ad Corinthios',       testament: 'NT' },
  { nr: 47, abbrev: '2co', name: '2 Corinthians',    latin: 'II Ad Corinthios',      testament: 'NT' },
  { nr: 48, abbrev: 'gal', name: 'Galatians',        latin: 'Ad Galatas',            testament: 'NT' },
  { nr: 49, abbrev: 'eph', name: 'Ephesians',        latin: 'Ad Ephesios',           testament: 'NT' },
  { nr: 50, abbrev: 'php', name: 'Philippians',      latin: 'Ad Philippenses',       testament: 'NT' },
  { nr: 51, abbrev: 'col', name: 'Colossians',       latin: 'Ad Colossenses',        testament: 'NT' },
  { nr: 52, abbrev: '1th', name: '1 Thessalonians',  latin: 'I Ad Thessalonicenses', testament: 'NT' },
  { nr: 53, abbrev: '2th', name: '2 Thessalonians',  latin: 'II Ad Thessalonicenses',testament: 'NT' },
  { nr: 54, abbrev: '1ti', name: '1 Timothy',        latin: 'I Ad Timotheum',        testament: 'NT' },
  { nr: 55, abbrev: '2ti', name: '2 Timothy',        latin: 'II Ad Timotheum',       testament: 'NT' },
  { nr: 56, abbrev: 'tit', name: 'Titus',            latin: 'Ad Titum',              testament: 'NT' },
  { nr: 57, abbrev: 'phm', name: 'Philemon',         latin: 'Ad Philemonem',         testament: 'NT' },
  { nr: 58, abbrev: 'heb', name: 'Hebrews',          latin: 'Ad Hebraeos',           testament: 'NT' },
  { nr: 59, abbrev: 'jam', name: 'James',            latin: 'Iacobi',                testament: 'NT' },
  { nr: 60, abbrev: '1pe', name: '1 Peter',          latin: 'I Petri',               testament: 'NT' },
  { nr: 61, abbrev: '2pe', name: '2 Peter',          latin: 'II Petri',              testament: 'NT' },
  { nr: 62, abbrev: '1jo', name: '1 John',           latin: 'I Ioannis',             testament: 'NT' },
  { nr: 63, abbrev: '2jo', name: '2 John',           latin: 'II Ioannis',            testament: 'NT' },
  { nr: 64, abbrev: '3jo', name: '3 John',           latin: 'III Ioannis',           testament: 'NT' },
  { nr: 65, abbrev: 'jud', name: 'Jude',             latin: 'Iudae',                 testament: 'NT' },
  { nr: 66, abbrev: 'rev', name: 'Revelation',       latin: 'Apocalypsis',           testament: 'NT' },
  // Deuterokanon
  { nr: 67, abbrev: 'tob', name: 'Tobit',            latin: 'Tobias',                testament: 'DK' },
  { nr: 68, abbrev: 'jdt', name: 'Judith',           latin: 'Iudith',                testament: 'DK' },
  { nr: 69, abbrev: '1ma', name: '1 Maccabees',      latin: 'I Machabaeorum',        testament: 'DK' },
  { nr: 70, abbrev: '2ma', name: '2 Maccabees',      latin: 'II Machabaeorum',       testament: 'DK' },
  { nr: 71, abbrev: 'wis', name: 'Wisdom',           latin: 'Sapientia',             testament: 'DK' },
  { nr: 72, abbrev: 'sir', name: 'Sirach',           latin: 'Ecclesiasticus',        testament: 'DK' },
  { nr: 73, abbrev: 'bar', name: 'Baruch',           latin: 'Baruch',                testament: 'DK' },
];

// ═══════════════════════════════════════════════════════
//  HELFER
// ═══════════════════════════════════════════════════════

function mkDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function pad3(n)  { return String(n).padStart(3, '0'); }
function esc(s)   { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { r += syms[i]; n -= vals[i]; }
  }
  return r;
}

function bookFileName(book) {
  return `${pad3(book.nr)}-${book.abbrev}.html`;
}

/** Gibt Kapitel+Verse-Map aus dem getbible.net JSON zurück */
function parseBook(data) {
  if (!data || !data.chapters) return null;
  const rawChaps = data.chapters;
  const keys = Object.keys(rawChaps).sort((a, b) => Number(a) - Number(b));
  return keys.map(ck => {
    const chap = rawChaps[ck];
    const rawVs = chap.verses;
    const vkeys = Object.keys(rawVs).sort((a, b) => Number(a) - Number(b));
    const verses = vkeys.map(vk => ({
      nr:   rawVs[vk].verse,
      text: (rawVs[vk].text || '').trim(),
    }));
    return { nr: chap.chapter, name: chap.name || '', verses };
  });
}

function loadBook(translationCode, bookNr) {
  const file = path.join(DATA_DIR, translationCode, `${pad3(bookNr)}.json`);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { return null; }
}

// ═══════════════════════════════════════════════════════
//  CSS (Interlinear-Seiten)
// ═══════════════════════════════════════════════════════

function buildPageCSS() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

:root {
  --gold:        #C8A96E;
  --gold-light:  #EDD58A;
  --gold-dark:   #8B6914;
  --navy:        #1A1F3A;
  --navy-mid:    #252B4A;
  --navy-light:  #2E3560;
  --parchment:   #F5E9CC;
  --parchment-d: #EDD9A3;
  --cream:       #FDF6E3;
  --latin-color: #6B1E0E;
  --trans-color: #0F1D2E;
  --border:      rgba(200,169,110,.35);
  --font-title:  'Cinzel Decorative', 'Cinzel', Georgia, serif;
  --font-sub:    'Cinzel', Georgia, serif;
  --font-body:   'EB Garamond', Georgia, serif;
}

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html { font-size:16px; scroll-behavior:smooth; }
body { background:var(--cream); color:var(--trans-color); font-family:var(--font-body); }

/* ── NAV ─────────────────────────────────────────────── */
.nav-bar {
  background:var(--navy); padding:10px 28px;
  display:flex; align-items:center; gap:14px; flex-wrap:wrap;
  border-bottom:2px solid var(--gold);
  position:sticky; top:0; z-index:100;
  box-shadow:0 3px 12px rgba(0,0,0,.45);
}
.nav-bar a {
  color:var(--gold); text-decoration:none;
  font-family:var(--font-sub); font-size:.75rem; letter-spacing:.05em;
  transition:color .15s;
}
.nav-bar a:hover { color:var(--gold-light); }
.nav-bar .home { font-weight:700; font-size:.82rem; }
.nav-bar .spacer { flex:1; }
.nav-bar .pos { color:rgba(200,169,110,.45); font-size:.7rem; font-family:var(--font-sub); }

/* ── BUCHKOPF ────────────────────────────────────────── */
.book-header {
  background:linear-gradient(160deg,var(--navy) 0%,var(--navy-mid) 55%,var(--navy-light) 100%);
  padding:44px 36px 34px; text-align:center;
  border-bottom:4px solid var(--gold);
  position:relative; overflow:hidden;
}
.book-header::before {
  content:'';
  position:absolute; inset:0;
  background-image:
    repeating-linear-gradient( 45deg,transparent,transparent 30px,rgba(200,169,110,.038) 30px,rgba(200,169,110,.038) 31px),
    repeating-linear-gradient(-45deg,transparent,transparent 30px,rgba(200,169,110,.038) 30px,rgba(200,169,110,.038) 31px);
  pointer-events:none;
}
.testament-badge {
  display:inline-block;
  border:1px solid rgba(200,169,110,.4); color:rgba(200,169,110,.65);
  font-family:var(--font-sub); font-size:.62rem; letter-spacing:.25em;
  padding:4px 14px; border-radius:2px; margin-bottom:14px; position:relative;
}
.book-name-latin {
  font-family:var(--font-title); font-size:3rem; color:var(--gold-light);
  text-shadow:0 3px 18px rgba(0,0,0,.55); letter-spacing:.08em; position:relative;
}
.book-name-trans {
  font-family:var(--font-sub); font-size:1.1rem; color:var(--gold);
  margin-top:8px; letter-spacing:.12em; position:relative;
}
.book-meta {
  font-size:.74rem; color:rgba(200,169,110,.5); margin-top:7px;
  font-family:var(--font-sub); letter-spacing:.07em; position:relative;
}

/* ── ORNAMENT-TRENNLINIE ─────────────────────────────── */
.ornament-bar {
  text-align:center; padding:16px 0 4px;
  color:var(--gold); font-size:1.1rem; letter-spacing:.7em;
}

/* ── HAUPT-CONTAINER ─────────────────────────────────── */
.content { max-width:960px; margin:0 auto; padding:0 24px 80px; }

/* ── KAPITEL-MARKER ──────────────────────────────────── */
.chapter-marker {
  display:flex; align-items:center; gap:16px;
  padding:28px 6px 12px; margin-bottom:4px;
  border-bottom:2px solid var(--border);
}
.ch-roman {
  font-family:var(--font-title); font-size:2.2rem; color:var(--gold);
  min-width:56px; text-align:center; flex-shrink:0;
  text-shadow:0 1px 8px rgba(200,169,110,.3);
}
.ch-label {
  font-family:var(--font-sub); font-size:.72rem; color:rgba(200,169,110,.6);
  letter-spacing:.22em; text-transform:uppercase;
}

/* ── VERS-BLOCK ──────────────────────────────────────── */
.verse-block {
  display:flex; gap:0; border-bottom:1px solid rgba(200,169,110,.15);
}
.verse-block:nth-child(odd)  { background:var(--cream); }
.verse-block:nth-child(even) { background:var(--parchment); }

.verse-num-col {
  flex-shrink:0; width:42px; padding:16px 6px 16px 0; text-align:right;
}
.verse-num {
  display:inline-block; width:28px; height:28px; border-radius:50%;
  background:var(--gold-dark); color:var(--cream);
  font-family:var(--font-sub); font-size:.64rem; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 1px 5px rgba(0,0,0,.25);
}

.verse-texts { flex:1; padding:16px 16px 18px 8px; }

/* ── LATEINISCHER TEXT (oben / primär) ───────────────── */
.latin {
  font-family:var(--font-body); font-size:1.12rem; line-height:1.9;
  color:var(--latin-color); font-weight:500;
  border-left:3px solid var(--gold); padding-left:12px;
  margin-bottom:8px;
}

/* ── ÜBERSETZUNGS-TEXT (unten / sekundär) ────────────── */
.trans-label {
  font-family:var(--font-sub); font-size:.6rem; letter-spacing:.17em;
  text-transform:uppercase; color:var(--gold-dark); margin-bottom:5px; opacity:.78;
}
.trans {
  font-family:var(--font-body); font-size:1.04rem; line-height:1.85;
  color:var(--trans-color); font-style:italic;
  padding-left:15px;
}

/* Erste Vers jedes Kapitels: Drop-Cap */
.verse-block:first-of-type .latin::first-letter {
  font-size:4.2em; float:left; line-height:.72;
  padding-right:.08em; margin-top:.06em;
  font-family:var(--font-title); color:var(--gold);
}

/* ── NAVIGATION ZWISCHEN BÜCHERN ─────────────────────── */
.book-nav {
  display:flex; justify-content:space-between; align-items:center;
  background:var(--navy); border-top:3px solid var(--gold);
  padding:12px 26px; gap:12px;
}
.book-nav a {
  color:var(--gold); text-decoration:none;
  font-family:var(--font-sub); font-size:.78rem; letter-spacing:.07em;
  padding:6px 14px; border:1px solid rgba(200,169,110,.3); border-radius:3px;
  transition:background .18s;
}
.book-nav a:hover { background:rgba(200,169,110,.15); }
.book-nav .center {
  font-family:var(--font-sub); font-size:.7rem; color:rgba(200,169,110,.55);
  letter-spacing:.1em; text-align:center;
}

/* ── FUßZEILE ────────────────────────────────────────── */
.page-footer {
  background:var(--navy); border-top:2px solid rgba(200,169,110,.3);
  padding:18px 28px; text-align:center;
  color:rgba(200,169,110,.45); font-family:var(--font-sub);
  font-size:.68rem; letter-spacing:.1em;
}

/* ── DRUCK ───────────────────────────────────────────── */
@media print {
  .nav-bar, .book-nav { display:none; }
  .verse-block { break-inside:avoid; }
  .book-header { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
}

/* ── MOBIL ───────────────────────────────────────────── */
@media (max-width:640px) {
  .book-name-latin { font-size:2.1rem; }
  .ch-roman { font-size:1.6rem; }
  .latin { font-size:.98rem; }
  .trans { font-size:.93rem; }
  .content { padding:0 12px 60px; }
}
`;
}

// ═══════════════════════════════════════════════════════
//  SEITEN-GENERATOR: INTERLINEAR-BUCHSEITE
// ═══════════════════════════════════════════════════════

function buildBookPage(book, trans, vulgChapters, transChapters) {
  const transNativeName = trans.native || trans.name;

  // Vers-Map für Translation (chapter -> verse -> text)
  const transMap = {};
  if (transChapters) {
    for (const ch of transChapters) {
      transMap[ch.nr] = {};
      for (const v of ch.verses) transMap[ch.nr][v.nr] = v.text;
    }
  }

  const chapBlocks = vulgChapters.map((ch, chIdx) => {
    const verseBlocks = ch.verses.map((v, vIdx) => {
      const latinText = esc(v.text);
      const transText = esc((transMap[ch.nr] || {})[v.nr] || '—');
      const isFirst   = vIdx === 0;

      return `
    <div class="verse-block${isFirst ? ' chapter-first-verse' : ''}" id="v${ch.nr}-${v.nr}">
      <div class="verse-num-col"><div class="verse-num">${v.nr}</div></div>
      <div class="verse-texts">
        <div class="latin">${latinText}</div>
        <div class="trans-label">✦ ${transNativeName}</div>
        <div class="trans">${transText}</div>
      </div>
    </div>`;
    }).join('');

    return `
  <section class="chapter" id="ch${ch.nr}">
    <div class="chapter-marker">
      <span class="ch-roman">${toRoman(ch.nr)}</span>
      <span class="ch-label">Caput ${ch.nr}</span>
    </div>
    ${verseBlocks}
  </section>`;
  }).join('\n');

  // Prev/Next navigation
  const bookIdx  = BOOKS.findIndex(b => b.nr === book.nr);
  const prevBook = BOOKS[bookIdx - 1];
  const nextBook = BOOKS[bookIdx + 1];
  const prevLink = prevBook
    ? `<a href="${bookFileName(prevBook)}">← ${prevBook.latin}</a>`
    : `<span style="opacity:.3">◀</span>`;
  const nextLink = nextBook
    ? `<a href="${bookFileName(nextBook)}">${nextBook.latin} →</a>`
    : `<span style="opacity:.3">▶</span>`;

  const testamentLabel = book.testament === 'NT'
    ? 'NOVUM TESTAMENTUM'
    : book.testament === 'DK'
    ? 'LIBRI DEUTEROCANONOCI'
    : 'VETUS TESTAMENTUM';

  const chapterCount = vulgChapters.length;
  const verseCount   = vulgChapters.reduce((s, c) => s + c.verses.length, 0);

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${book.latin} · ${transNativeName} · Biblia Catholica</title>
  <style>${buildPageCSS()}</style>
</head>
<body>

  <nav class="nav-bar">
    <a class="home" href="../../../index.html">✞ BIBLIA CATHOLICA</a>
    <a href="../index.html">${trans.flag} ${transNativeName}</a>
    <span class="spacer"></span>
    <span class="pos">${pad3(book.nr)} / 066</span>
  </nav>

  <header class="book-header">
    <div class="testament-badge">${testamentLabel}</div>
    <div class="book-name-latin">${book.latin.toUpperCase()}</div>
    <div class="book-name-trans">${book.name}</div>
    <div class="book-meta">Vulgata Clementina · ${trans.display} · ${chapterCount} Capita · ${verseCount} Versus</div>
  </header>

  <div class="ornament-bar">❧ ✦ ❧ ✦ ❧</div>

  <main class="content">
${chapBlocks}
  </main>

  <nav class="book-nav">
    ${prevLink}
    <span class="center">${book.latin} · ${transNativeName}</span>
    ${nextLink}
  </nav>

  <footer class="page-footer">
    BIBLIA CATHOLICA INTERLINEARIS &nbsp;·&nbsp; Vulgata Clementina &amp; ${trans.display}
    &nbsp;·&nbsp; Gemeinfreie Texte / Public Domain
  </footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SEITEN-GENERATOR: SPRACHINDEX (Bücherliste)
// ═══════════════════════════════════════════════════════

function buildTranslationIndex(trans, availableBooks) {
  const otBooks = availableBooks.filter(b => b.testament === 'VT');
  const ntBooks = availableBooks.filter(b => b.testament === 'NT');
  const dkBooks = availableBooks.filter(b => b.testament === 'DK');

  function bookCards(books) {
    return books.map(b => `
    <a href="bücher/${bookFileName(b)}" class="book-card">
      <div class="b-num">${pad3(b.nr)}</div>
      <div class="b-info">
        <span class="b-latin">${b.latin}</span>
        <span class="b-name">${b.name}</span>
      </div>
    </a>`).join('');
  }

  const dkSection = dkBooks.length ? `
  <div class="section-head">
    <span class="section-title">Libri Deuterocanonoci</span>
    <span class="section-sub">Deuterokanonische Bücher</span>
  </div>
  <div class="book-grid">${bookCards(dkBooks)}</div>` : '';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Biblia Catholica · ${trans.native}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#C8A96E;--gold-light:#EDD58A;--gold-dark:#8B6914;--navy:#1A1F3A;--navy-mid:#252B4A;--parchment:#F5E9CC;--cream:#FDF6E3;--latin:#6B1E0E;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'EB Garamond',serif;}

    .top-nav{background:var(--navy);padding:10px 28px;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:50;box-shadow:0 2px 8px rgba(0,0,0,.4);}
    .top-nav a{color:var(--gold);text-decoration:none;font-family:'Cinzel',serif;font-size:.78rem;}
    .top-nav a:hover{text-decoration:underline;}

    header{background:linear-gradient(160deg,var(--navy),var(--navy-mid));padding:48px 30px 34px;text-align:center;border-bottom:4px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(200,169,110,.04) 30px,rgba(200,169,110,.04) 31px),repeating-linear-gradient(-45deg,transparent,transparent 30px,rgba(200,169,110,.04) 30px,rgba(200,169,110,.04) 31px);pointer-events:none;}
    .h-flag{font-size:3rem;margin-bottom:10px;position:relative;}
    .h-title{font-family:'Cinzel Decorative',serif;font-size:2rem;color:var(--gold-light);text-shadow:0 3px 14px rgba(0,0,0,.5);position:relative;}
    .h-sub{font-family:'Cinzel',serif;font-size:.88rem;color:var(--gold);margin-top:8px;letter-spacing:.12em;position:relative;}
    .h-trans{font-family:'Cinzel',serif;font-size:.72rem;color:rgba(200,169,110,.55);margin-top:5px;letter-spacing:.08em;position:relative;}

    .section-head{max-width:960px;margin:28px auto 6px;padding:0 22px;display:flex;align-items:baseline;gap:14px;}
    .section-title{font-family:'Cinzel Decorative',serif;font-size:1.05rem;color:var(--navy);letter-spacing:.06em;}
    .section-sub{font-family:'Cinzel',serif;font-size:.7rem;color:var(--gold-dark);letter-spacing:.1em;}

    .book-grid{max-width:960px;margin:0 auto 10px;padding:0 22px;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:8px;}
    .book-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid rgba(200,169,110,.22);border-left:4px solid var(--gold);border-radius:4px;text-decoration:none;color:var(--navy);transition:all .18s;box-shadow:0 1px 4px rgba(200,169,110,.09);}
    .book-card:hover{background:var(--parchment);box-shadow:0 4px 14px rgba(200,169,110,.26);transform:translateX(3px);}
    .b-num{font-family:'Cinzel',serif;font-size:.65rem;color:var(--gold-dark);min-width:30px;text-align:center;}
    .b-info{display:flex;flex-direction:column;}
    .b-latin{font-family:'Cinzel',serif;font-size:.85rem;font-weight:600;color:var(--latin);}
    .b-name{font-size:.76rem;color:#556;margin-top:1px;}

    footer{background:var(--navy);border-top:3px solid var(--gold);color:rgba(200,169,110,.48);text-align:center;padding:22px 20px;font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.1em;}
  </style>
</head>
<body>
  <nav class="top-nav"><a href="../../index.html">← Biblia Catholica · Alle Sprachen</a></nav>

  <header>
    <div class="h-flag">${trans.flag}</div>
    <div class="h-title">BIBLIA CATHOLICA</div>
    <div class="h-sub">${trans.native} · ${trans.country.split('·')[0].trim()}</div>
    <div class="h-trans">${trans.display}</div>
  </header>

  <div class="section-head">
    <span class="section-title">Vetus Testamentum</span>
    <span class="section-sub">Altes Testament — 39 Bücher</span>
  </div>
  <div class="book-grid">${bookCards(otBooks)}</div>

  <div class="section-head">
    <span class="section-title">Novum Testamentum</span>
    <span class="section-sub">Neues Testament — 27 Bücher</span>
  </div>
  <div class="book-grid">${bookCards(ntBooks)}</div>

  ${dkSection}

  <footer>
    BIBLIA CATHOLICA INTERLINEARIS · Vulgata Clementina &amp; ${trans.display}
    · ${availableBooks.length} Bücher · Gemeinfreie Texte
  </footer>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SEITEN-GENERATOR: HAUPTINDEX (Sprachauswahl)
// ═══════════════════════════════════════════════════════

function buildMainIndex() {
  const cards = TRANSLATIONS.map(t => `
    <a href="${t.code}/index.html" class="lang-card">
      <div class="flag">${t.flag}</div>
      <div class="lang-name">${t.native}</div>
      <div class="country">${t.country.split('·')[0].trim()}</div>
    </a>`).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Biblia Catholica Interlinearis – Alle Sprachen</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#C8A96E;--gold-light:#EDD58A;--gold-dark:#8B6914;--navy:#1A1F3A;--navy-mid:#252B4A;--parchment:#F5E9CC;--cream:#FDF6E3;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'EB Garamond',serif;}

    header{background:linear-gradient(165deg,var(--navy) 0%,var(--navy-mid) 55%,#2E3560 100%);padding:68px 30px 48px;text-align:center;border-bottom:5px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 20% 50%,rgba(200,169,110,.08) 0%,transparent 40%),radial-gradient(circle at 80% 50%,rgba(200,169,110,.08) 0%,transparent 40%),repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(200,169,110,.032) 30px,rgba(200,169,110,.032) 31px),repeating-linear-gradient(-45deg,transparent,transparent 30px,rgba(200,169,110,.032) 30px,rgba(200,169,110,.032) 31px);pointer-events:none;}
    header::after{content:'✦ ❧ ✦ ❧ ✦';position:absolute;bottom:14px;left:50%;transform:translateX(-50%);color:rgba(200,169,110,.28);font-size:1rem;letter-spacing:.6em;white-space:nowrap;}

    .h-cross{font-size:4rem;margin-bottom:8px;position:relative;color:var(--gold);text-shadow:0 0 30px rgba(200,169,110,.4);}
    .h-title{font-family:'Cinzel Decorative',serif;font-size:3.2rem;color:var(--gold-light);text-shadow:0 4px 20px rgba(0,0,0,.55);line-height:1.2;position:relative;}
    .h-sub{font-family:'Cinzel',serif;font-size:1rem;color:var(--gold);margin-top:14px;letter-spacing:.22em;text-transform:uppercase;position:relative;}
    .h-lat{font-family:'EB Garamond',serif;font-style:italic;font-size:.9rem;color:rgba(200,169,110,.65);margin-top:6px;position:relative;}
    .h-stats{color:rgba(200,169,110,.42);font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.12em;margin-top:8px;position:relative;}
    .h-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px;position:relative;}
    .h-btn{color:var(--gold);border:1px solid rgba(200,169,110,.38);padding:8px 22px;text-decoration:none;font-family:'Cinzel',serif;font-size:.74rem;letter-spacing:.08em;border-radius:3px;background:rgba(200,169,110,.07);transition:background .18s;}
    .h-btn:hover{background:rgba(200,169,110,.22);}

    .sec-label{text-align:center;padding:28px 20px 8px;font-family:'Cinzel',serif;font-size:.72rem;color:var(--gold-dark);letter-spacing:.22em;text-transform:uppercase;}

    .lang-grid{max-width:900px;margin:12px auto 72px;padding:0 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:14px;}
    .lang-card{display:flex;flex-direction:column;align-items:center;padding:28px 14px 22px;background:#fff;border:1px solid rgba(200,169,110,.18);border-top:4px solid var(--gold);border-radius:6px;text-decoration:none;color:var(--navy);transition:all .2s;box-shadow:0 2px 8px rgba(200,169,110,.07);text-align:center;}
    .lang-card:hover{background:var(--parchment);box-shadow:0 7px 24px rgba(200,169,110,.28);transform:translateY(-5px);}
    .flag{font-size:2.7rem;margin-bottom:10px;}
    .lang-name{font-family:'Cinzel',serif;font-size:.9rem;font-weight:700;color:var(--navy);}
    .country{font-size:.7rem;color:#778;margin-top:4px;}

    footer{background:var(--navy);border-top:4px solid var(--gold);color:rgba(200,169,110,.42);text-align:center;padding:30px 20px;font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.1em;line-height:2;}
  </style>
</head>
<body>
  <header>
    <div class="h-cross">✞</div>
    <div class="h-title">BIBLIA<br>CATHOLICA</div>
    <div class="h-sub">Interlinearis</div>
    <div class="h-lat">Vulgata Clementina cum Translationibus</div>
    <div class="h-stats">73 Libri · 31.102 Versus · 16 Linguis</div>
    <div class="h-btns">
      <a class="h-btn" href="cover.html">📖 Cover</a>
      <a class="h-btn" href="back-cover.html">📕 Rückseite</a>
    </div>
  </header>

  <p class="sec-label">❧ Electe Linguam Tuam ❧</p>

  <main class="lang-grid">
${cards}
  </main>

  <footer>
    BIBLIA CATHOLICA INTERLINEARIS<br>
    Vulgata Clementina (gemeinfreier Text) · 16 moderne Übersetzungen (Public Domain)<br>
    Texte: getbible.net API v2 · Kein Plagiatstext · Alle verwendeten Übersetzungen sind gemeinfrei
  </footer>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  COVER-SEITE
// ═══════════════════════════════════════════════════════

function buildCover() {
  const langBadges = TRANSLATIONS.map(t =>
    `<span class="badge">${t.flag} ${t.native}</span>`
  ).join(' ');

  return `<!DOCTYPE html>
<html lang="la">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Biblia Catholica Interlinearis – Cover</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;min-height:100%;background:#06091A;}
    body{display:flex;align-items:center;justify-content:center;padding:28px 0;font-family:'EB Garamond',serif;}

    .cover{
      width:min(580px,94vw); aspect-ratio:2/3;
      background:linear-gradient(175deg,#0C1030 0%,#1A2356 45%,#0C1030 100%);
      border:8px solid #C8A96E;
      outline:2px solid #8B6914; outline-offset:-17px;
      position:relative; display:flex; flex-direction:column;
      align-items:center; justify-content:space-between;
      padding:50px 36px 36px; overflow:hidden;
      box-shadow:0 0 0 15px #06091A, 0 0 0 18px #C8A96E, 0 32px 90px rgba(0,0,0,.9);
    }
    .cover::before{
      content:''; position:absolute; inset:0;
      background-image:
        repeating-linear-gradient( 0deg,transparent,transparent 40px,rgba(200,169,110,.03) 40px,rgba(200,169,110,.03) 41px),
        repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(200,169,110,.03) 40px,rgba(200,169,110,.03) 41px),
        repeating-linear-gradient(45deg,transparent,transparent 56px,rgba(200,169,110,.022) 56px,rgba(200,169,110,.022) 57px),
        repeating-linear-gradient(-45deg,transparent,transparent 56px,rgba(200,169,110,.022) 56px,rgba(200,169,110,.022) 57px);
      pointer-events:none;
    }
    .top-orn{position:absolute;top:22px;left:50%;transform:translateX(-50%);
      color:rgba(200,169,110,.45);font-size:.95rem;letter-spacing:.6em;white-space:nowrap;}
    .bot-orn{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);
      color:rgba(200,169,110,.45);font-size:.95rem;letter-spacing:.6em;white-space:nowrap;}

    .cross-wrap{position:relative;width:70px;height:90px;flex-shrink:0;}
    .cross-v{position:absolute;left:50%;top:0;width:10px;height:100%;
      background:linear-gradient(to bottom,transparent 0%,#C8A96E 15%,#C8A96E 85%,transparent 100%);
      transform:translateX(-50%);border-radius:5px;
      box-shadow:0 0 14px rgba(200,169,110,.45);}
    .cross-h{position:absolute;left:0;top:27%;width:100%;height:10px;
      background:linear-gradient(to right,transparent 0%,#C8A96E 15%,#C8A96E 85%,transparent 100%);
      transform:translateY(-50%);border-radius:5px;
      box-shadow:0 0 14px rgba(200,169,110,.45);}
    .cross-gem{position:absolute;left:50%;top:27%;width:18px;height:18px;
      background:#C8A96E;border-radius:50%;transform:translate(-50%,-50%);
      box-shadow:0 0 18px rgba(200,169,110,.7);}

    .inner-frame{
      border:1.5px solid rgba(200,169,110,.3);
      padding:30px 24px; width:88%; text-align:center; position:relative;
    }
    .inner-frame::before{content:'';position:absolute;
      top:-8px;left:-8px;right:-8px;bottom:-8px;
      border:1px solid rgba(200,169,110,.13);}

    .top-deco{color:var(--gold,#C8A96E);font-size:1rem;letter-spacing:.6em;margin-bottom:14px;}
    .title-main{font-family:'Cinzel Decorative',serif;font-size:2.9rem;color:#EDD58A;
      line-height:1.1;text-shadow:0 4px 20px rgba(0,0,0,.55),0 0 50px rgba(200,169,110,.18);
      letter-spacing:.06em;}
    .title-sub{font-family:'Cinzel',serif;font-size:.78rem;color:#C8A96E;
      letter-spacing:.32em;text-transform:uppercase;margin-top:6px;}
    .divider-gold{width:70%;height:1px;
      background:linear-gradient(to right,transparent,#C8A96E,transparent);
      margin:18px auto;}
    .desc{font-family:'EB Garamond',serif;font-style:italic;
      color:rgba(237,213,138,.72);font-size:.93rem;line-height:1.75;}
    .stats{font-family:'Cinzel',serif;font-size:.62rem;
      color:rgba(200,169,110,.48);letter-spacing:.1em;margin-top:10px;}
    .badges{margin-top:14px;display:flex;flex-wrap:wrap;gap:5px;justify-content:center;}
    .badge{font-size:.58rem;padding:3px 7px;border:1px solid rgba(200,169,110,.2);
      color:rgba(237,213,138,.62);border-radius:2px;letter-spacing:.03em;}
    .enter-btn{
      display:inline-block;margin-top:18px;
      padding:10px 30px;background:rgba(200,169,110,.1);
      border:1px solid rgba(200,169,110,.42);color:#C8A96E;
      text-decoration:none;border-radius:3px;
      font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.1em;
      transition:background .18s;
    }
    .enter-btn:hover{background:rgba(200,169,110,.26);}
  </style>
</head>
<body>
  <div class="cover">
    <div class="top-orn">✦ ❧ ✦ ❧ ✦</div>
    <div class="bot-orn">✦ ❧ ✦ ❧ ✦</div>

    <div class="cross-wrap">
      <div class="cross-v"></div>
      <div class="cross-h"></div>
      <div class="cross-gem"></div>
    </div>

    <div class="inner-frame">
      <div class="top-deco">✦ ✦ ✦</div>
      <div class="title-main">BIBLIA<br>CATHOLICA</div>
      <div class="title-sub">Interlinearis</div>
      <div class="divider-gold"></div>
      <div class="desc">Vulgata Clementina<br>cum Translationibus XVI</div>
      <div class="stats">73 Libri · 31.102 Versus · 16 Linguae</div>
      <div class="badges">${langBadges}</div>
      <a class="enter-btn" href="index.html">Intra ❯</a>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  RÜCKSEITE
// ═══════════════════════════════════════════════════════

function buildBackCover() {
  const langRows = TRANSLATIONS.map(t => `
        <div class="lang-row">
          <span class="flag">${t.flag}</span>
          <span class="lname">${t.native}</span>
          <span class="ldisp">${t.display}</span>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Biblia Catholica Interlinearis – Rückseite</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;min-height:100%;background:#06091A;}
    body{display:flex;align-items:center;justify-content:center;padding:28px 0;font-family:'EB Garamond',serif;}

    .back{
      width:min(580px,94vw); aspect-ratio:2/3;
      background:linear-gradient(175deg,#0C1030 0%,#1A2356 45%,#0C1030 100%);
      border:8px solid #C8A96E; outline:2px solid #8B6914; outline-offset:-17px;
      position:relative; display:flex; flex-direction:column;
      align-items:center; justify-content:space-between;
      padding:44px 32px 30px; overflow:hidden;
      box-shadow:0 0 0 15px #06091A, 0 0 0 18px #C8A96E, 0 32px 90px rgba(0,0,0,.9);
    }
    .back::before{content:'';position:absolute;inset:0;
      background-image:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(200,169,110,.03) 40px,rgba(200,169,110,.03) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(200,169,110,.03) 40px,rgba(200,169,110,.03) 41px);
      pointer-events:none;}
    .top-orn{position:absolute;top:22px;left:50%;transform:translateX(-50%);
      color:rgba(200,169,110,.4);font-size:.88rem;letter-spacing:.55em;white-space:nowrap;}

    .top{width:100%;text-align:center;position:relative;}
    .back-title{font-family:'Cinzel Decorative',serif;font-size:2rem;color:#C8A96E;
      text-shadow:0 3px 12px rgba(0,0,0,.5);}
    .divider-g{width:72%;height:1px;background:linear-gradient(to right,transparent,#C8A96E,transparent);margin:14px auto;}
    .desc{font-family:'EB Garamond',serif;font-style:italic;
      color:rgba(237,213,138,.72);font-size:.9rem;line-height:1.9;text-align:center;}

    .mid{width:100%;position:relative;}
    .lang-title{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.22em;
      text-transform:uppercase;color:rgba(200,169,110,.55);text-align:center;margin-bottom:10px;}
    .lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
    .lang-row{display:flex;align-items:center;gap:7px;padding:5px 9px;
      background:rgba(200,169,110,.05);border:1px solid rgba(200,169,110,.12);border-radius:2px;}
    .flag{font-size:.88rem;}
    .lname{font-family:'Cinzel',serif;font-size:.7rem;color:rgba(237,213,138,.78);}
    .ldisp{margin-left:auto;font-size:.58rem;color:rgba(200,169,110,.32);}

    .bot{text-align:center;width:100%;position:relative;}
    .bot-verse{font-family:'EB Garamond',serif;font-style:italic;
      font-size:.9rem;color:rgba(237,213,138,.65);line-height:1.75;margin-bottom:6px;}
    .bot-ref{font-family:'Cinzel',serif;font-size:.6rem;color:rgba(200,169,110,.38);letter-spacing:.1em;}
    .pd-note{font-family:'Cinzel',serif;font-size:.58rem;color:rgba(200,169,110,.3);
      letter-spacing:.07em;margin-top:10px;line-height:1.65;}
    .back-link{display:inline-block;margin-top:10px;color:rgba(200,169,110,.48);
      text-decoration:none;font-family:'Cinzel',serif;font-size:.66rem;
      border:1px solid rgba(200,169,110,.18);padding:5px 14px;border-radius:3px;
      transition:all .18s;}
    .back-link:hover{color:#C8A96E;border-color:rgba(200,169,110,.42);}
  </style>
</head>
<body>
  <div class="back">
    <div class="top-orn">✦ ❧ ✦ ❧ ✦</div>

    <div class="top">
      <div class="back-title">BIBLIA<br>CATHOLICA</div>
      <div class="divider-g"></div>
      <div class="desc">
        Die Heilige Schrift im Wechselgespräch:<br>
        Vulgata Clementina (Latein) als Urtext<br>
        und 16 gemeinfreie Übersetzungen<br>
        für die christliche Weltbevölkerung.
      </div>
    </div>

    <div class="mid">
      <div class="lang-title">✦ Enthaltene Übersetzungen ✦</div>
      <div class="lang-grid">${langRows}</div>
    </div>

    <div class="bot">
      <div class="divider-g"></div>
      <div class="bot-verse">
        «Scrutamini scripturas, quia vos putatis<br>
        in ipsis vitam aeternam habere.»
      </div>
      <div class="bot-ref">Ioannes 5,39 · Vulgata Clementina</div>
      <div class="pd-note">
        Alle Texte sind gemeinfreie Werke (Public Domain).<br>
        Urheberrechte ggf. nach Landesrecht prüfen.
      </div>
      <a href="index.html" class="back-link">← Zur Sprachauswahl</a>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Prüfen ob Daten vorhanden
  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌  Kein "data/"-Ordner gefunden.\n   Bitte zuerst ausführen: node fetch-texts.js\n');
    process.exit(1);
  }

  mkDir(OUT_DIR);

  // ── Cover + Rückseite + Hauptindex ───────────────────
  fs.writeFileSync(path.join(OUT_DIR, 'cover.html'),      buildCover());
  fs.writeFileSync(path.join(OUT_DIR, 'back-cover.html'), buildBackCover());
  console.log('  ✓ cover.html');
  console.log('  ✓ back-cover.html');

  // Vulgata laden (Basis)
  const vulgataData = {};
  for (const book of BOOKS) {
    const raw = loadBook('vulgate', book.nr);
    if (raw) vulgataData[book.nr] = parseBook(raw);
  }
  console.log(`  ✓ Vulgata: ${Object.keys(vulgataData).length} Bücher geladen`);

  // ── Sprachindex + Buchseiten ──────────────────────────
  const indexBooks = [];

  for (const trans of TRANSLATIONS) {
    console.log(`\n📖  ${trans.flag} ${trans.name} (${trans.code})...`);

    const transDir  = path.join(OUT_DIR, trans.code);
    const booksDir  = path.join(transDir, 'bücher');
    mkDir(booksDir);

    const available = [];

    for (const book of BOOKS) {
      if (!vulgataData[book.nr]) continue;

      const transRaw  = loadBook(trans.code, book.nr);
      const transChap = transRaw ? parseBook(transRaw) : null;
      const vulgChap  = vulgataData[book.nr];

      const html = buildBookPage(book, trans, vulgChap, transChap);
      fs.writeFileSync(path.join(booksDir, bookFileName(book)), html);
      available.push(book);

      process.stdout.write('.');
    }
    process.stdout.write('\n');

    // Sprachindex
    fs.writeFileSync(path.join(transDir, 'index.html'),
      buildTranslationIndex(trans, available));
    console.log(`  ✓ ${trans.code}/index.html (${available.length} Bücher)`);

    if (!indexBooks.length) indexBooks.push(...available);
  }

  // ── Haupt-Index ───────────────────────────────────────
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildMainIndex());
  console.log('\n  ✓ index.html (Sprachauswahl)');

  console.log('\n✅  Fertig! eBook unter:');
  console.log('   ' + OUT_DIR);
  console.log('\n  Startseite: Übersetzungen/cover.html\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  console.error(err.stack);
  process.exit(1);
});
