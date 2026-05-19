// Removes arc-back fixed button (CSS + HTML) from ALL Bible chapters and Quran suras
const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.html')) results.push(path.join(dir, f));
  }
  return results;
}

// Bible chapters: dist-diebibel/{lang}/bücher/*.html
const bibleBase = path.join(__dirname, 'dist-diebibel');
const bibleFiles = [];
for (const lang of fs.readdirSync(bibleBase)) {
  const bücherDir = path.join(bibleBase, lang, 'bücher');
  bibleFiles.push(...getHtmlFiles(bücherDir));
}

// Quran suras: dist-alquran/Übersetzungen/{lang}/suren/*.html
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
const quranFiles = [];
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    const surenDir = path.join(quranBase, lang, 'suren');
    quranFiles.push(...getHtmlFiles(surenDir));
  }
}

const allFiles = [...bibleFiles, ...quranFiles];
let count = 0;

for (const fp of allFiles) {
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('arc-back')) continue;

  // Remove arc-back CSS block (handles single-line or multi-line)
  html = html.replace(/\.arc-back\{[^}]+\}[\s\n]*\.arc-back:hover\{[^}]+\}[\s\n]*/g, '');

  // Remove arc-back HTML element
  html = html.replace(/<a class="arc-back"[^>]*>[\s\S]*?<\/a>/g, '');

  fs.writeFileSync(fp, html, 'utf8');
  count++;
}

console.log(`Removed arc-back from ${count} files.`);
