// Fix .tra color in all non-German Bible chapters: #1E2848 (dark navy) → #F5F2EA (cream)
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist-diebibel');
let count = 0;

for (const lang of fs.readdirSync(DIST)) {
  if (lang === 'german') continue; // German already has correct color
  const bücherDir = path.join(DIST, lang, 'bücher');
  if (!fs.existsSync(bücherDir)) continue;
  for (const f of fs.readdirSync(bücherDir)) {
    if (!f.endsWith('.html')) continue;
    const fp = path.join(bücherDir, f);
    let html = fs.readFileSync(fp, 'utf8');
    if (!html.includes('color:#1E2848')) continue;
    html = html.replace(/color:#1E2848/g, 'color:#F5F2EA');
    fs.writeFileSync(fp, html, 'utf8');
    count++;
  }
}

console.log(`Fixed .tra color in ${count} files.`);
