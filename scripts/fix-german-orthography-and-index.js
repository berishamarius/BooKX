const fs = require('fs');
const path = require('path');

const root = 'C:/Users/beris_xrgc50t/KX KroniX/BooKX';

const indexFiles = [
  path.join(root, 'dist-diebibel/german/index.html'),
  path.join(root, 'CATHOLIC-BIBLE/Übersetzungen/german/index.html'),
  path.join(root, 'dist-micheles/german/index.html'),
];

const htmlRoots = [
  path.join(root, 'dist-diebibel/german'),
  path.join(root, 'CATHOLIC-BIBLE/Übersetzungen/german'),
  path.join(root, 'dist-micheles/german'),
];

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

function fixOrthography(content) {
  let c = content;

  // Ensure protestant terminology typo is corrected if present.
  c = c.replace(/protestntisch/gi, 'protestantisch');

  // Normalize Egypt words with missing umlaut in modern German segments.
  c = c.replace(/\bAgyptenland\b/g, 'Ägyptenland');
  c = c.replace(/\bAgypten\b/g, 'Ägypten');
  c = c.replace(/\bAgypter\b/g, 'Ägypter');
  c = c.replace(/\bAgyptern\b/g, 'Ägyptern');
  c = c.replace(/\bAgypters\b/g, 'Ägypters');
  c = c.replace(/\bagyptisch/g, 'ägyptisch');
  c = c.replace(/\bAgypt/g, 'Ägypt');
  c = c.replace(/\bagypt/g, 'ägypt');

  // Fix clipped variant seen by user screenshot.
  c = c.replace(/\bgypten\b/g, 'Ägypten');

  // Common OCR/encoding-like mistakes in German words.
  const replacements = new Map([
    ['abervor alien', 'aber vor allen'],
    ['voruber', 'vorüber'],
    ['urn ', 'um '],
    [' soil ', ' soll '],
    [' Oder ', ' oder '],
    [' Fuft ', ' Fuß '],
    [' lieft ', ' ließ '],
    [' Schenken und Backer ', ' Schenken und Bäcker '],
    [' Konigs ', ' Königs '],
    [' Konige ', ' Könige '],
    [' Sohnen', ' Söhnen'],
    [' Bruder', ' Brüder'],
    [' Brudern', ' Brüdern'],
    [' furchte', ' fürchte'],
    [' herauffuhren', ' heraufführen'],
    [' namlich', ' nämlich'],
    [' zweifaltig', ' zwiefältig'],
    [' dad ', ' daß '],
    [' weiftest', ' weißt'],
    [' tuchtig', ' tüchtig'],
    [' often', ' offen'],
    [' laft ', ' laßt '],
    [' uber ', ' über '],
  ]);

  for (const [bad, good] of replacements) {
    c = c.split(bad).join(good);
  }

  return c;
}

let indexUpdated = 0;
for (const file of indexFiles) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  const before = c;

  // Force chapter abbreviation to German in index display.
  c = c.replace(/\bCap\./g, 'Kap.');

  // Keep previously requested top-left labels stable.
  if (file.includes('dist-micheles')) {
    c = c.replace('<a href="../cover.html">&#8592; Zur Vorderseite</a>', '<a href="../vorwort.html">&#8592; Zum Vorwort</a>');
  } else {
    c = c.replace('<a href="../index.html">&#8592; Zur Übersicht</a>', '<a href="../cover.html">&#8592; Zur Vorderseite</a>');
  }

  // Ensure protestant mode does not show Latin names.
  if (!c.includes('body[data-conf="protestant"] .tlat{display:none;}')) {
    c = c.replace(
      '  margin-left:12px;flex-shrink:0;\n}\n.tdots{',
      '  margin-left:12px;flex-shrink:0;\n}\nbody[data-conf="protestant"] .tlat{display:none;}\nbody[data-conf="protestant"] .tname{margin-left:0;font-style:normal;}\n.tdots{'
    );
  }

  if (c !== before) {
    fs.writeFileSync(file, c, 'utf8');
    indexUpdated++;
  }
}

let scanned = 0;
let updated = 0;
for (const base of htmlRoots) {
  const files = walkHtml(base);
  for (const file of files) {
    scanned++;
    let c = fs.readFileSync(file, 'utf8');
    const fixed = fixOrthography(c);
    if (fixed !== c) {
      fs.writeFileSync(file, fixed, 'utf8');
      updated++;
    }
  }
}

console.log(JSON.stringify({ indexUpdated, scannedHtml: scanned, htmlUpdated: updated }, null, 2));
