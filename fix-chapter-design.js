'use strict';
/**
 * fix-chapter-design.js
 * Apply dark red/gold CSS theme to Italian and Romanian Bible chapter pages.
 * These files use a different (navy/parchment) design and need a CSS override.
 * Also adds back-cover nav link to Italian and Romanian index.html.
 */
const fs   = require('fs');
const path = require('path');

const BIBLE_DIST = path.join(__dirname, 'dist-diebibel');

// CSS override injected just before </style>
const DARK_OVERRIDE = `
/* === Dark Red/Gold Theme Override === */
:root{
  --gold:#C8A030;--gold-light:#E8C547;--gold-dark:#B8962E;
  --navy:#1A0407;--navy-mid:#250A10;--navy-light:#3A0F17;
  --parchment:#2C0810;--parchment-d:#1A0407;--cream:#2C0810;
  --latin-color:#EDD882;--trans-color:#E8C547;
  --border:rgba(200,160,48,.35);
}
body{
  background:#2C0810 !important;
  background-image:radial-gradient(ellipse at 50% 20%,#4A1020 0%,#1A0407 100%) !important;
}
.book-header::before{display:none !important;}
`;

// Languages that need the chapter CSS override
const LANGS_TO_FIX = [
  { lang: 'italian',  bcLabel: 'Retro di Copertina' },
  { lang: 'romanian', bcLabel: 'Copertă Posterioară' },
];

let totalFixed = 0;

// [1] Fix chapter CSS: inject dark override into Italian/Romanian chapter files
console.log('\n[1] Applying dark CSS override to chapter files...');
for (const { lang } of LANGS_TO_FIX) {
  const bFolder = path.join(BIBLE_DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bFolder)) { console.log(`  \u26A0 No bücher folder: ${lang}`); continue; }

  const files = fs.readdirSync(bFolder).filter(f => f.endsWith('.html'));
  let count = 0;

  for (const file of files) {
    const fpath = path.join(bFolder, file);
    const orig = fs.readFileSync(fpath, 'utf8');

    // Skip if already dark (already has override)
    if (orig.includes('Dark Red/Gold Theme Override')) continue;

    // Inject override before </style>
    const fixed = orig.replace('</style>', DARK_OVERRIDE + '</style>');
    if (fixed !== orig) {
      fs.writeFileSync(fpath, fixed, 'utf8');
      count++;
    }
  }

  totalFixed += count;
  console.log(`  \u2713 ${lang}: ${count}/${files.length} files updated`);
}

// [2] Add back-cover link to Italian/Romanian index.html
console.log('\n[2] Adding back-cover nav links to Italian/Romanian index.html...');
for (const { lang, bcLabel } of LANGS_TO_FIX) {
  const idx = path.join(BIBLE_DIST, lang, 'index.html');
  if (!fs.existsSync(idx)) { console.log(`  \u26A0 No index.html: ${lang}`); continue; }

  let h = fs.readFileSync(idx, 'utf8');

  // Skip if already has back-cover link
  if (h.includes('back-cover.html')) { console.log(`  \u2014 ${lang}: already has back-cover link`); continue; }

  // Add back-cover link to existing top-nav
  const fixed = h.replace(
    /<nav class="top-nav">(<a [^>]+>[^<]*<\/a>)<\/nav>/,
    `<nav class="top-nav">$1<a href="back-cover.html" style="margin-left:auto">${bcLabel} \u2192</a></nav>`
  );

  if (fixed !== h) {
    fs.writeFileSync(idx, fixed, 'utf8');
    console.log(`  \u2713 ${lang}/index.html: back-cover link added`);
  } else {
    console.log(`  \u26A0 ${lang}/index.html: nav pattern not matched — check manually`);
  }
}

console.log(`\n\u2705 Done. Updated ${totalFixed} chapter files + nav links.\n`);
