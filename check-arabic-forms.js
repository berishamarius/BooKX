'use strict';

const fs = require('fs');
const path = require('path');

const roots = [
  'AL-QURAN/Übersetzungen',
  'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren',
  'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren',
  'dist-alquran/Übersetzungen/Deutsch/suren',
  'dist-meliha/Übersetzungen/Deutsch/suren',
  'dist-karim/Übersetzungen/Deutsch/suren',
];

const arBlockRe = /<div class="ar">([\s\S]*?)<\/div>/g;
const presFormRe = /[\uFB50-\uFDFF\uFE70-\uFEFE]/u;

let totalBlocks = 0;
let badBlocks = 0;
let examples = 0;

function walk(p, out) {
  if (!fs.existsSync(p)) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(p)) walk(path.join(p, name), out);
    return;
  }
  if (p.endsWith('.html')) out.push(p);
}

for (const root of roots) {
  const files = [];
  walk(root, files);

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const blocks = [...text.matchAll(arBlockRe)];
    for (let i = 0; i < blocks.length; i++) {
      totalBlocks++;
      const ar = (blocks[i][1] || '')
        .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '')
        .replace(/\s*﴿[\u0660-\u06690-9]+﴾\s*$/u, '')
        .trim();
      if (presFormRe.test(ar)) {
        badBlocks++;
        if (examples < 10) {
          console.log(`BAD ${file} V${i + 1}`);
          examples++;
        }
      }
    }
  }
}

console.log(`Arabic blocks: ${totalBlocks}`);
console.log(`Blocks with presentation forms: ${badBlocks}`);
