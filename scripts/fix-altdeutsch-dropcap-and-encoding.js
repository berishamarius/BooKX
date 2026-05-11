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

const dropcapPattern = /\/\* Drop-Cap:[\s\S]*?\.vb\.first \.base-c::first-letter,\s*\n\.vb\.first \.base-p::first-letter\{[\s\S]*?\n\}/g;

const dropcapReplacement = `/* Drop-Cap: erster Vers eines Kapitels */
.vb.first .base-c::first-letter{
  font-family:'Cinzel Decorative',serif;
  font-size:4em;
  float:left;
  line-height:.7;
  padding-right:.08em;
  margin-top:.07em;
  color:#B8962E;
  text-shadow:1px 2px 6px rgba(0,0,0,.12);
}
body[data-conf="protestant"] .vb.first .base-p::first-letter{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:4em;
  float:left;
  line-height:.7;
  padding-right:.08em;
  margin-top:.07em;
  color:#B8962E;
  text-shadow:1px 2px 6px rgba(0,0,0,.12);
}`;

// common mojibake/replacement cleanup map
const replacements = new Map([
  ['ï¿½', '·'],
  ['Rï¿½ckseite', 'Rückseite'],
  ['Standardm��ig', 'Standardmäßig'],
  ['S�hne', 'Söhne'],
  ['l��ten', 'luden'],
  ['f��r', 'für'],
  ['da��', 'daß'],
  ['da�', 'daß'],
  ['w��re', 'wäre'],
  ['m��chte', 'möchte'],
]);

let updatedFiles = 0;
let dropcapFixed = 0;
let encodingFixed = 0;

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const full = path.join(dir, file);
    let content = fs.readFileSync(full, 'utf8');
    let changed = false;

    if (dropcapPattern.test(content)) {
      content = content.replace(dropcapPattern, dropcapReplacement);
      dropcapFixed++;
      changed = true;
    }

    for (const [bad, good] of replacements) {
      if (content.includes(bad)) {
        content = content.split(bad).join(good);
        encodingFixed++;
        changed = true;
      }
    }

    // remove replacement chars if still present in css comments
    if (content.includes('�')) {
      content = content.replace(/�/g, '');
      encodingFixed++;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(full, content, 'utf8');
      updatedFiles++;
    }
  }
}

console.log('Book dirs:', dirs.length);
console.log('Files updated:', updatedFiles);
console.log('Dropcap blocks fixed:', dropcapFixed);
console.log('Encoding chunks fixed:', encodingFixed);
