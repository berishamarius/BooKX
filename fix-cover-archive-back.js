// fix-cover-archive-back.js
// Changes back button on ALL cover overlays: ov.remove() → window.location.href='/'
// Also ensures Bible overlays have red colors and Quran overlays have green colors
const fs = require('fs');
const path = require('path');

// Bible: one level up  → dist-diebibel/cover.html (Bibel language selector)
// Quran: three levels up → dist-alquran/cover.html (Koran language selector)
const OLD_BACK_ORIG = "back.addEventListener('click', function(){ ov.remove(); });";
const OLD_BACK_ROOT = "back.addEventListener('click', function(){ window.location.href='/'; });";
const NEW_BACK_BIBLE = "back.addEventListener('click', function(){ window.location.href='../cover.html'; });";
const NEW_BACK_QURAN = "back.addEventListener('click', function(){ window.location.href='../../../cover.html'; });";

let updated = 0;

// ── Bible covers ──
const bibleBase = 'dist-diebibel';
const bibleLangs = fs.readdirSync(bibleBase).filter(d => {
  try { return fs.statSync(path.join(bibleBase, d)).isDirectory(); } catch(e) { return false; }
});

for (const lang of bibleLangs) {
  const coverPath = path.join(bibleBase, lang, 'cover.html');
  if (!fs.existsSync(coverPath)) continue;
  let html = fs.readFileSync(coverPath, 'utf8');
  let changed = false;
  if (html.includes(OLD_BACK_ORIG)) { html = html.replace(OLD_BACK_ORIG, NEW_BACK_BIBLE); changed = true; }
  if (html.includes(OLD_BACK_ROOT)) { html = html.replace(OLD_BACK_ROOT, NEW_BACK_BIBLE); changed = true; }
  if (changed) {
    fs.writeFileSync(coverPath, html, 'utf8');
    updated++;
    console.log('  bibel/' + lang);
  }
}

// ── Quran covers ──
const quranBase = path.join('dist-alquran', '\u00dcbersetzungen');
const quranLangs = fs.readdirSync(quranBase).filter(d => {
  try { return fs.statSync(path.join(quranBase, d)).isDirectory(); } catch(e) { return false; }
});

for (const lang of quranLangs) {
  const coverPath = path.join(quranBase, lang, 'cover.html');
  if (!fs.existsSync(coverPath)) continue;
  let html = fs.readFileSync(coverPath, 'utf8');
  let changed = false;
  if (html.includes(OLD_BACK_ORIG)) { html = html.replace(OLD_BACK_ORIG, NEW_BACK_QURAN); changed = true; }
  if (html.includes(OLD_BACK_ROOT)) { html = html.replace(OLD_BACK_ROOT, NEW_BACK_QURAN); changed = true; }
  if (changed) {
    fs.writeFileSync(coverPath, html, 'utf8');
    updated++;
    console.log('  quran/' + lang);
  }
}

console.log(`\n✓ ${updated} cover files updated — back button now goes to archive (/)`);
