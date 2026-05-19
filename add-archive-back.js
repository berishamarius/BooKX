// add-archive-back.js
// Adds a fixed top-left "← BOOKS" back link to every Bible chapter and Quran sura.
// Localized per language. Links to ../index.html (the book/sura list).
'use strict';
const fs = require('fs');
const path = require('path');

// Bible: lang folder → [archive label, CSS bg, CSS color, border]
const BIBLE = {
  albanian:   'LIBRAT',
  croatian:   'KNJIGE',
  czech:      'KNIHY',
  dutch:      'BOEKEN',
  french:     'LIVRES',
  german:     'BÜCHER',
  hungarian:  'KÖNYVEK',
  italian:    'LIBRI',
  kjv:        'BOOKS',
  polish:     'KSI\u0118GI',
  portuguese: 'LIVROS',
  romanian:   'C\u0102R\u021AI',
  russian:    '\u041A\u041D\u0418\u0413\u0418',
  spanish:    'LIBROS',
  swedish:    'B\u00D6CKER',
  tagalog:    'MGA LIBRO',
  ukrainian:  '\u041A\u041D\u0418\u0413\u0418',
};

// Quran: lang folder → sura list label
const QURAN = {
  'Albanisch':   'SURET',
  'Bengalisch':  '\u09B8\u09C2\u09B0\u09BE',
  'Bosnisch':    'SURE',
  'Chinesisch':  '\u7AE0\u8282',
  'Deutsch':     'SUREN',
  'Englisch':    'SURAHS',
  'Hausa':       'SURORI',
  'Hindi':       '\u0938\u0942\u0930\u0939',
  'Indonesisch': 'SURAH',
  'Persisch':    '\u0633\u0648\u0631\u0647\u200C\u0647\u0627',
  'Russisch':    '\u0421\u0423\u0420\u042B',
  'Türkisch':    'SURELER',
  'Urdu':        '\u0633\u0648\u0631\u062A\u06CC\u06BA',
  'Uygurisch':   '\u0633\u06C8\u0631\u06D5\u0644\u06D5\u0631',
};

// Bible chapter CSS (dark red theme)
const BIBLE_CSS = `
.arc-back{position:fixed;top:14px;left:16px;z-index:100;color:#EDD882;background:rgba(42,8,16,.82);font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.13em;text-decoration:none;padding:5px 11px;border-radius:4px;border:1px solid rgba(200,160,48,.3);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .2s;white-space:nowrap;}
.arc-back:hover{opacity:.7;}`;

// Quran sura CSS (dark green theme)
const QURAN_CSS = `
.arc-back{position:fixed;top:14px;left:16px;z-index:100;color:#d4a574;background:rgba(9,26,12,.82);font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.13em;text-decoration:none;padding:5px 11px;border-radius:4px;border:1px solid rgba(155,125,92,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .2s;white-space:nowrap;}
.arc-back:hover{opacity:.7;}`;

function processFiles(dir, label, css) {
  let files;
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.html')); }
  catch(e) { console.log(`  SKIP (no dir): ${dir}`); return 0; }

  let count = 0;
  for (const f of files) {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('arc-back')) continue; // already added

    // 1. Inject CSS before </style>
    const styleEnd = c.lastIndexOf('</style>');
    if (styleEnd >= 0) {
      c = c.slice(0, styleEnd) + css + '\n' + c.slice(styleEnd);
    }

    // 2. Inject HTML link after <body>
    const bodyTag = c.indexOf('<body>');
    if (bodyTag >= 0) {
      const insertAt = bodyTag + 6; // after '<body>'
      const link = `\n<a class="arc-back" href="../index.html">&#8592; ${label}</a>`;
      c = c.slice(0, insertAt) + link + c.slice(insertAt);
    }

    fs.writeFileSync(p, c, 'utf8');
    count++;
  }
  return count;
}

let total = 0;

console.log('=== Bible chapters ===');
for (const [lang, label] of Object.entries(BIBLE)) {
  const dir = `dist-diebibel/${lang}/b\u00FCcher`;
  const n = processFiles(dir, label, BIBLE_CSS);
  if (n > 0) console.log(`  [${lang}] ${n} files updated`);
}

console.log('=== Quran suras ===');
for (const [lang, label] of Object.entries(QURAN)) {
  const dir = `dist-alquran/\u00DCbersetzungen/${lang}/suren`;
  const n = processFiles(dir, label, QURAN_CSS);
  if (n > 0) console.log(`  [${lang}] ${n} files updated`);
  total += n;
}

// Verify
console.log('\n=== Verification ===');
const testFiles = [
  ['dist-diebibel/french/bücher/001-gen.html', 'LIVRES'],
  ['dist-diebibel/kjv/bücher/001-gen.html', 'BOOKS'],
  ['dist-diebibel/russian/bücher/001-gen.html', 'КНИГИ'],
];
testFiles.forEach(([p, expected]) => {
  try {
    const c = fs.readFileSync(p, 'utf8');
    const ok = c.includes('arc-back') && c.includes(expected);
    console.log(`  ${ok ? '✓' : '✗'} ${p.split('/').slice(-3).join('/')} (${expected})`);
  } catch(e) { console.log(`  ✗ ${p}: ${e.message}`); }
});
console.log('Done.');
