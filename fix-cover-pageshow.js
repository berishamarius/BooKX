// Adds pageshow bfcache fix to ALL Bible language covers AND Quran language covers
// When browser back-button restores a cached cover page, this forces a reload
// so the bookmark overlay check re-runs and the overlay appears correctly
const fs = require('fs');
const path = require('path');

const PAGESHOW_SCRIPT = '<script>window.addEventListener(\'pageshow\',function(e){if(e.persisted)location.reload();});</script>';

function fixCover(fp) {
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('pageshow')) return false; // already fixed
  // Insert before </body>
  if (!html.includes('</body>')) return false;
  html = html.replace('</body>', PAGESHOW_SCRIPT + '\n</body>');
  fs.writeFileSync(fp, html, 'utf8');
  return true;
}

let count = 0;

// Bible covers: dist-diebibel/{lang}/cover.html
const bibleBase = path.join(__dirname, 'dist-diebibel');
for (const lang of fs.readdirSync(bibleBase)) {
  const fp = path.join(bibleBase, lang, 'cover.html');
  if (fs.existsSync(fp) && fixCover(fp)) { console.log('Fixed: dist-diebibel/' + lang + '/cover.html'); count++; }
}

// Quran covers: dist-alquran/Übersetzungen/{lang}/cover.html
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    const fp = path.join(quranBase, lang, 'cover.html');
    if (fs.existsSync(fp) && fixCover(fp)) { console.log('Fixed: Übersetzungen/' + lang + '/cover.html'); count++; }
  }
}

console.log(`\nAdded pageshow fix to ${count} cover files.`);
