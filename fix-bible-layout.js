'use strict';
/**
 * fix-bible-layout.js
 * 1. Copy German dark-design CSS to ALL other Bible language chapter pages
 * 2. Fix Bible back-cover image paths
 * 3. Fix Bible index.html back-cover nav links
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

const LANGS = ['albanian','croatian','czech','dutch','french',
               'hungarian','italian','kjv','polish','portuguese',
               'romanian','russian','spanish','swedish','tagalog','ukrainian'];

let totalFiles = 0;

function fixChapterCSS(html) {
  let h = html;

  // 1. body text colour: dark brown -> golden
  h = h.replace(/(body\s*\{[^}]*?color\s*:)\s*#1A0E06\s*;/, '$1#E8C547;');

  // 2. bhead: remove diagonal-stripe background, use simple dark
  h = h.replace(
    /\.bhead\{[\s\S]*?border-bottom:4px solid #B8962E;/,
    '.bhead{\n  background:#1A0407;\n  padding:36px 28px 28px;\n  text-align:center;\n  border-bottom:4px solid #B8962E;'
  );

  // 3. bhead::before - remove border
  h = h.replace(/(\/* [^*]*\*\/\s*)?\.bhead::before\{[^}]*\}/, 
    ".bhead::before{\n  content:'';position:absolute;inset:14px;\n  border:none;\n  pointer-events:none;\n}");

  // 4. bhead::after - remove border
  h = h.replace(/(\/* [^*]*\*\/\s*)?\.bhead::after\{[^}]*\}/,
    ".bhead::after{\n  content:'';position:absolute;inset:22px;\n  border:none;\n  pointer-events:none;\n}");

  // 5. content background: cream/parchment -> dark
  h = h.replace(/background:#FAF5E8;/, 'background:#1a0407;');

  // 6. chhead ornament: stars+dashes -> simple dots
  h = h.replace(/content:'——— ✦ ✦ ✦ ———';/, "content:'* * *';");

  // 7. .base text colour -> golden
  h = h.replace(/(\.base\{[\s\S]*?color\s*:)\s*#(?!E8C547)[0-9A-Fa-f]{3,6}\s*;/, '$1#E8C547;');

  return h;
}

// [1] Fix chapter pages
console.log('\n[1] Fixing Bible chapter/verse designs...');
for (const lang of LANGS) {
  const bFolder = path.join(BIBLE_DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bFolder)) { console.log('  \u26A0 No folder: ' + lang); continue; }
  const files = fs.readdirSync(bFolder).filter(f => f.endsWith('.html'));
  let count = 0;
  for (const file of files) {
    const fpath = path.join(bFolder, file);
    const orig = fs.readFileSync(fpath, 'utf8');
    const fixed = fixChapterCSS(orig);
    if (fixed !== orig) { fs.writeFileSync(fpath, fixed, 'utf8'); count++; }
  }
  totalFiles += count;
  console.log('  \u2713 ' + lang + ': ' + count + '/' + files.length + ' files fixed');
}

// [2] Fix back-cover image paths
console.log('\n[2] Fixing back-cover image paths...');

// Root back-cover: ../Bibel-Rueckseite... -> Bibel-Rueckseite...
const rootBC = path.join(BIBLE_DIST, 'back-cover.html');
if (fs.existsSync(rootBC)) {
  let h = fs.readFileSync(rootBC, 'utf8');
  const f = h.replace(/src="\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, 'src="Bibel-Rueckseite-Katholisch.png"');
  if (f !== h) { fs.writeFileSync(rootBC, f, 'utf8'); console.log('  \u2713 root back-cover fixed'); }
}

// Language back-covers: ../../.. -> ..
for (const lang of [...LANGS, 'german']) {
  const bc = path.join(BIBLE_DIST, lang, 'back-cover.html');
  if (!fs.existsSync(bc)) continue;
  let h = fs.readFileSync(bc, 'utf8');
  const f = h
    .replace(/src="\.\.\/\.\.\/\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, 'src="../Bibel-Rueckseite-Katholisch.png"')
    .replace(/src="\.\.\/\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, 'src="../Bibel-Rueckseite-Katholisch.png"');
  if (f !== h) { fs.writeFileSync(bc, f, 'utf8'); console.log('  \u2713 ' + lang + '/back-cover image fixed'); }
}

// [3] Fix index.html back-cover nav links: ../back-cover.html -> back-cover.html
console.log('\n[3] Fixing index.html back-cover nav links...');
for (const lang of LANGS) {
  const idx = path.join(BIBLE_DIST, lang, 'index.html');
  if (!fs.existsSync(idx)) continue;
  let h = fs.readFileSync(idx, 'utf8');
  const f = h.replace(/href="\.\.\/back-cover\.html"/g, 'href="back-cover.html"');
  if (f !== h) { fs.writeFileSync(idx, f, 'utf8'); console.log('  \u2713 ' + lang + '/index.html nav fixed'); }
}

console.log('\n\u2705 Done. Fixed ' + totalFiles + ' chapter files + back-covers + nav links.\n');
