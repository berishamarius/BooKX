'use strict';
const fs   = require('fs');
const path = require('path');

const BASE   = path.join(__dirname, 'Geschenke');
const KORANS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];

let total = 0;

for (const k of KORANS) {
  const surenDir = path.join(BASE, k, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let src = fs.readFileSync(fp, 'utf8');

    // PNG: cover statt 100% 100% — erhält Proportionen, füllt Breite, kein Verzerren
    src = src.replace(
      /background:url\('\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/Suren%20Geschenke\.png'\)[^;]+;/g,
      "background:url('../../../../../Suren%20Geschenke.png') top center/cover no-repeat;"
    );

    // Sicherstellen: overflow:hidden + position:relative auf page-wrap
    src = src.replace(
      /overflow-y:auto;position:relative;z-index:1;\}/g,
      'overflow:hidden;position:relative;z-index:1;}'
    );
    src = src.replace(
      /overflow:hidden;position:relative;z-index:1;\}/g,
      'overflow:hidden;position:relative;z-index:1;}'
    );

    fs.writeFileSync(fp, src, 'utf8');
    total++;
  }
  console.log(`✓ ${k}: ${files.length} Suren`);
}
console.log(`\n✅ Gesamt: ${total}`);
