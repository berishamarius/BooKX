'use strict';
const fs   = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'Geschenke');
const KORANS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];

let total = 0;

for (const k of KORANS) {
  const surenDir = path.join(BASE, k, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let src = fs.readFileSync(fp, 'utf8');

    // 1. .page-wrap: contain → 100% 100%, overflow-y:auto → overflow:hidden
    src = src.replace(
      /background:url\('\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/Suren%20Geschenke\.png'\) top center\/contain no-repeat/g,
      "background:url('../../../../../Suren%20Geschenke.png') top center/100% 100% no-repeat"
    );
    src = src.replace(
      /;overflow-y:auto;position:relative;z-index:1;\}/g,
      ';overflow:hidden;position:relative;z-index:1;}'
    );

    // 2. .verses: breiter, scrollbar hier, flex-fill
    src = src.replace(
      /\.verses\{width:min\(calc\(\(100vh - 310px\)\*0\.52\),82vw\);padding:4vh 0 60px;box-sizing:border-box;\}/g,
      '.verses{flex:1;min-height:0;overflow-y:auto;width:min(70vw,960px);padding:9vh 28px 9vh;box-sizing:border-box;}'
    );

    fs.writeFileSync(fp, src, 'utf8');
    total++;
  }
  console.log(`✓ ${k}: ${files.length} Suren aktualisiert`);
}
console.log(`\n✅ Gesamt: ${total} Dateien`);
