// Changes default biblia_conf from 'catholic' to 'protestant' in ALL Bible chapters
// So without any localStorage setting, Luther German + local translation is shown
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist-diebibel');
let count = 0;

for (const lang of fs.readdirSync(DIST)) {
  const bücherDir = path.join(DIST, lang, 'bücher');
  if (!fs.existsSync(bücherDir)) continue;
  for (const f of fs.readdirSync(bücherDir)) {
    if (!f.endsWith('.html')) continue;
    const fp = path.join(bücherDir, f);
    let html = fs.readFileSync(fp, 'utf8');
    const old = `localStorage.getItem('biblia_conf') || 'catholic'`;
    if (!html.includes(old)) continue;
    html = html.replace(old, `localStorage.getItem('biblia_conf') || 'protestant'`);
    fs.writeFileSync(fp, html, 'utf8');
    count++;
  }
}

console.log(`Fixed default conf to protestant in ${count} files.`);
