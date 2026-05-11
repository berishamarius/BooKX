const fs = require('fs');
const path = require('path');

const root = 'C:/Users/beris_xrgc50t/KX KroniX/BooKX';

function listBookDirs(base) {
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.toLowerCase().includes('cher'))
    .map(d => path.join(base, d.name));
}

const dirs = [
  ...listBookDirs(path.join(root, 'dist-diebibel/german')),
  ...listBookDirs(path.join(root, 'CATHOLIC-BIBLE/Übersetzungen/Deutsch')),
];

let total = 0;
let withReplacementChar = 0;
let missingProtestantDropcap = 0;

for (const dir of dirs) {
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
    total++;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    if (content.includes('�')) withReplacementChar++;
    if (!content.includes('body[data-conf="protestant"] .vb.first .base-p::first-letter')) {
      missingProtestantDropcap++;
    }
  }
}

console.log(JSON.stringify({ dirs: dirs.length, total, withReplacementChar, missingProtestantDropcap }, null, 2));
