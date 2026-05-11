const fs = require('fs');
const path = require('path');

const roots = [
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-diebibel/german',
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/CATHOLIC-BIBLE/Übersetzungen/german'
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const rules = [
  [/\bbevor Herr\b/g, 'bevor der Herr'],
  [/\bVor Herr\b(?!schaften)/g, 'Vor dem Herrn'],
  [/\bvor Herr\b(?!schaften)/g, 'vor dem Herrn']
];

let filesChanged = 0;
let changes = 0;
for (const r of roots) {
  for (const f of walk(r)) {
    let c = fs.readFileSync(f, 'utf8');
    const before = c;
    for (const [rx, rep] of rules) {
      const m = c.match(rx);
      if (m) {
        changes += m.length;
        c = c.replace(rx, rep);
      }
    }
    if (c !== before) {
      fs.writeFileSync(f, c, 'utf8');
      filesChanged++;
    }
  }
}
console.log(JSON.stringify({ filesChanged, changes }, null, 2));
