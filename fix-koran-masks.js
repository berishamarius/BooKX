'use strict';
const fs   = require('fs');
const path = require('path');

const BASE   = path.join(__dirname, 'Geschenke');
const KORANS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];

// Fade-Masken die oben/unten über den scrollenden Inhalt gelegt werden
const SUREN_MASK = `
.page-wrap::before{content:'';position:absolute;top:0;left:0;right:0;height:90px;background:linear-gradient(to bottom,#F5F0E3 0%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}
.page-wrap::after{content:'';position:absolute;bottom:0;left:0;right:0;height:90px;background:linear-gradient(to top,#F5F0E3 0%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}`;

const LIST_MASK = `
.list::before{content:'';position:absolute;top:0;left:0;right:0;height:90px;background:linear-gradient(to bottom,#F5F0E3 0%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}
.list::after{content:'';position:absolute;bottom:0;left:0;right:0;height:90px;background:linear-gradient(to top,#F5F0E3 0%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}`;

let total = 0;

for (const k of KORANS) {
  const surenDir = path.join(BASE, k, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let src = fs.readFileSync(fp, 'utf8');

    // Masken nach .page-wrap{} einfügen (nur einmal)
    if (!src.includes('page-wrap::before')) {
      src = src.replace(
        /(.page-wrap\{[^}]+\})/,
        (m) => m + SUREN_MASK
      );
    }

    // .verses Padding an Fade anpassen (Inhalt startet unterhalb des Verdecks)
    src = src.replace(
      /\.verses\{flex:1;min-height:0;overflow-y:auto;width:min\(70vw,960px\);padding:[^;]+;box-sizing:border-box;\}/g,
      '.verses{flex:1;min-height:0;overflow-y:auto;width:min(70vw,960px);padding:100px 28px 100px;box-sizing:border-box;}'
    );

    fs.writeFileSync(fp, src, 'utf8');
    total++;
  }
  console.log(`✓ ${k}: ${files.length} Suren`);
}
console.log(`\n✅ Gesamt: ${total} Suren-Dateien`);
