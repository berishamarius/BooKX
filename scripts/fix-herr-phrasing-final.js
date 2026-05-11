const fs = require('fs');
const path = require('path');

const roots = [
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/dist-diebibel/german',
  'C:/Users/beris_xrgc50t/KX KroniX/BooKX/CATHOLIC-BIBLE/Übersetzungen/german'
];

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, out);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

const rules = [
  [/Und Herr redete/g, 'Und der Herr redete'],
  [/vor Herr,/g, 'vor dem Herrn,'],
  [/vor Herr\./g, 'vor dem Herrn.'],
  [/vor Herr;/g, 'vor dem Herrn;'],
  [/ vor Herr /g, ' vor dem Herrn '],
  [/ des Tempel des Herrn/g, ' des Tempels des Herrn'],
  [/ Tempel des Herrn\s+sa\./g, ' Tempel des Herrn saß.']
];

let filesChanged = 0;
let changes = 0;

for (const root of roots) {
  const files = walkHtml(root);
  for (const file of files) {
    let c = fs.readFileSync(file, 'utf8');
    const before = c;
    for (const [rx, rep] of rules) {
      const m = c.match(rx);
      if (m) {
        changes += m.length;
        c = c.replace(rx, rep);
      }
    }
    if (c !== before) {
      fs.writeFileSync(file, c, 'utf8');
      filesChanged++;
    }
  }
}

console.log(JSON.stringify({ filesChanged, changes }, null, 2));
