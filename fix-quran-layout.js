'use strict';
/**
 * fix-quran-layout.js
 * 1. Copy German Quran sura CSS to ALL other language sura pages
 * 2. Fix Bible back-cover image paths (broken ../../../ references)
 * 3. Fix Bible index.html back-cover nav links (../back-cover.html → back-cover.html)
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const QURAN_DIST = path.join(ROOT, 'dist-alquran', 'Übersetzungen');
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

// ─── 1. QURAN SURA CSS ─────────────────────────────────────────────────────────
// Read the German sura to extract the correct CSS
const DE_SURA = path.join(QURAN_DIST, 'Deutsch', 'suren', '001-Al-Fatihah.html');
const deHtml  = fs.readFileSync(DE_SURA, 'utf8');

// Extract base <style> block (first one, no id)
const baseMatch = deHtml.match(/<style>[\s\S]*?<\/style>/);
const baseStyle = baseMatch ? baseMatch[0] : '';

// Extract <style id="original-green-override"> block
const overrideMatch = deHtml.match(/<style id="original-green-override">[\s\S]*?<\/style>/);
const overrideStyle = overrideMatch ? overrideMatch[0] : '';

if (!baseStyle) { console.error('Could not extract German base CSS'); process.exit(1); }
if (!overrideStyle) { console.error('Could not extract German override CSS'); process.exit(1); }

console.log('[1] Fixing Quran sura CSS for all non-German languages...');

const quranLangs = fs.readdirSync(QURAN_DIST).filter(l => l !== 'Deutsch');

let totalSuras = 0;
for (const lang of quranLangs) {
  const surenDir = path.join(QURAN_DIST, lang, 'suren');
  if (!fs.existsSync(surenDir)) continue;

  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
  let count = 0;

  for (const file of files) {
    const fpath = path.join(surenDir, file);
    let html = fs.readFileSync(fpath, 'utf8');

    // Replace the first <style>...</style> block with the German base CSS
    html = html.replace(/<style>[\s\S]*?<\/style>/, baseStyle);

    // Remove any existing original-green-override so we don't double-inject
    html = html.replace(/<style id="original-green-override">[\s\S]*?<\/style>/, '');

    // Remove any broken Suren.png or background image references in .page-wrap
    html = html.replace(/url\(['"]?[^'"()]*Suren\.png['"']?\)/g, 'none');

    // Inject the green override right before </head>
    html = html.replace('</head>', overrideStyle + '\n</head>');

    fs.writeFileSync(fpath, html, 'utf8');
    count++;
  }

  console.log(`  ✓ ${lang}: ${count} suras`);
  totalSuras += count;
}
console.log(`  → ${totalSuras} sura files updated\n`);

// ─── 2. BIBLE BACK-COVER IMAGE PATHS ─────────────────────────────────────────
console.log('[2] Fixing Bible back-cover image paths...');

// Root dist-diebibel/back-cover.html: uses ../Bibel-Rueckseite... (wrong, image is IN dist-diebibel)
const rootBC = path.join(BIBLE_DIST, 'back-cover.html');
if (fs.existsSync(rootBC)) {
  let html = fs.readFileSync(rootBC, 'utf8');
  // ../Bibel-Rueckseite-Katholisch.png → Bibel-Rueckseite-Katholisch.png
  const fixed = html.replace(/"\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, '"Bibel-Rueckseite-Katholisch.png"');
  if (fixed !== html) { fs.writeFileSync(rootBC, fixed, 'utf8'); console.log('  ✓ dist-diebibel/back-cover.html'); }
}

// Language back-covers: dist-diebibel/{lang}/back-cover.html
// Image is at dist-diebibel/Bibel-Rueckseite-Katholisch.png → relative path = ../
const BIBLE_LANGS = ['albanian','croatian','czech','dutch','french','german',
                     'hungarian','italian','kjv','polish','portuguese','romanian',
                     'russian','spanish','swedish','tagalog','ukrainian'];

for (const lang of BIBLE_LANGS) {
  const bc = path.join(BIBLE_DIST, lang, 'back-cover.html');
  if (!fs.existsSync(bc)) continue;
  let html = fs.readFileSync(bc, 'utf8');
  // Fix any path going up too many levels (../../.. or ../..)
  const fixed = html
    .replace(/"\.\.\/\.\.\/\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, '"../Bibel-Rueckseite-Katholisch.png"')
    .replace(/"\.\.\/\.\.\/Bibel-Rueckseite-Katholisch\.png"/g, '"../Bibel-Rueckseite-Katholisch.png"');
  if (fixed !== html) { fs.writeFileSync(bc, fixed, 'utf8'); console.log(`  ✓ ${lang}/back-cover.html`); }
  else { console.log(`  · ${lang}/back-cover.html (already correct)`); }
}

// ─── 3. BIBLE NAV LINKS: ../back-cover.html → back-cover.html ────────────────
console.log('\n[3] Fixing Bible index.html back-cover nav links...');

for (const lang of BIBLE_LANGS) {
  const idx = path.join(BIBLE_DIST, lang, 'index.html');
  if (!fs.existsSync(idx)) continue;
  let html = fs.readFileSync(idx, 'utf8');
  // Change href="../back-cover.html" to href="back-cover.html"
  // so each language links to its OWN back-cover, not the German root one
  const fixed = html.replace(/href="\.\.\/back-cover\.html"/g, 'href="back-cover.html"');
  if (fixed !== html) { fs.writeFileSync(idx, fixed, 'utf8'); console.log(`  ✓ ${lang}/index.html nav fixed`); }
  else { console.log(`  · ${lang}/index.html (already correct)`); }
}

console.log('\n✅ Done.\n');
