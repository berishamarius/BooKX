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

const replacements = [
  [/HerrJahwe/g, 'Herr'],
  [/Jahwetempel/g, 'Tempel des Herrn'],
  [/Jahwepriester/g, 'Priester des Herrn'],
  [/Jahwealtar/g, 'Altar des Herrn'],
  [/Jahwebund/g, 'Bund des Herrn'],
  [/Jahwethores/g, 'Tore des Herrn'],
  [/Jahwethor/g, 'Tor des Herrn'],
  [/Jahwelieder/g, 'Lieder des Herrn'],
  [/\bJahwe\b/g, 'Herr'],
  [/\bJahve\b/g, 'Herr'],
  [/\bJahwes\b/g, 'des Herrn'],
  [/\bJahves\b/g, 'des Herrn'],

  // Repair side effects from previous broad umlaut replacements.
  [/Fürühm/g, 'Frühm'],
  [/Fürüch/g, 'Früch'],
  [/Fürüh/g, 'Früh'],
  [/fürüh/g, 'früh'],
  [/fürüch/g, 'früch'],

  // Requested typo shape and safe normalizations.
  [/\bfr\b/g, 'für'],
  [/\bFr\b/g, 'Für']
];

let filesChanged = 0;
let replCount = 0;

for (const root of roots) {
  const files = walkHtml(root);
  for (const file of files) {
    let c = fs.readFileSync(file, 'utf8');
    const before = c;

    for (const [rx, to] of replacements) {
      const m = c.match(rx);
      if (m) {
        replCount += m.length;
        c = c.replace(rx, to);
      }
    }

    if (c !== before) {
      fs.writeFileSync(file, c, 'utf8');
      filesChanged++;
    }
  }
}

console.log(JSON.stringify({ filesChanged, replCount }, null, 2));
