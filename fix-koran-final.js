'use strict';
const fs   = require('fs');
const path = require('path');

const BASE   = path.join(__dirname, 'Geschenke');
const KORANS = ['Koran-Deutsch-1', 'Koran-Deutsch-2'];

// Hintergrundfarbe der Seite = #F5F0E3 (Creme)
// PNG ratio 0.707 (1414x2000) → bei auto 100%: Breite = Höhe × 0.707
// Innerer Rahmenbereich ≈ 54% der Containerhöhe breit → min(54vh, 720px)

let total = 0;

for (const k of KORANS) {
  const surenDir = path.join(BASE, k, 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const fp = path.join(surenDir, file);
    let src = fs.readFileSync(fp, 'utf8');

    // 1. PNG: auto 100% → volle Höhe, korrekte Proportionen, kein Verzerren
    src = src.replace(
      /background:url\('\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/Suren%20Geschenke\.png'\)[^;]+;/g,
      "background:url('../../../../../Suren%20Geschenke.png') center/auto 100% no-repeat;"
    );

    // 2. .verses: Breite passend zum inneren Rahmenbereich + Scroll unsichtbar
    src = src.replace(
      /\.verses\{flex:1;min-height:0;overflow-y:auto;width:[^;]+;padding:[^;]+;box-sizing:border-box;\}/g,
      '.verses{flex:1;min-height:0;overflow-y:auto;width:min(54vh,720px);padding:110px 24px 110px;box-sizing:border-box;scrollbar-width:none;}'
    );

    // Webkit scrollbar ausblenden
    if (!src.includes('.verses::-webkit-scrollbar')) {
      src = src.replace(
        /\.verses\{flex:1;/,
        '.verses::-webkit-scrollbar{display:none;}\n.verses{flex:1;'
      );
    }

    // 3. Fade-Masken: sicherstellen dass sie da sind
    if (!src.includes('page-wrap::before')) {
      src = src.replace(
        /(\.page-wrap\{[^}]+\})/,
        '$1\n.page-wrap::before{content:\'\';position:absolute;top:0;left:0;right:0;height:120px;background:linear-gradient(to bottom,#F5F0E3 30%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}\n.page-wrap::after{content:\'\';position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(to top,#F5F0E3 30%,rgba(245,240,227,0) 100%);z-index:10;pointer-events:none;}'
      );
    } else {
      // Bestehende Masken auf 120px + 30% solid updaten
      src = src.replace(
        /height:90px;background:linear-gradient\(to bottom,#F5F0E3 0%,rgba\(245,240,227,0\) 100%\)/g,
        'height:120px;background:linear-gradient(to bottom,#F5F0E3 30%,rgba(245,240,227,0) 100%)'
      );
      src = src.replace(
        /height:90px;background:linear-gradient\(to top,#F5F0E3 0%,rgba\(245,240,227,0\) 100%\)/g,
        'height:120px;background:linear-gradient(to top,#F5F0E3 30%,rgba(245,240,227,0) 100%)'
      );
    }

    fs.writeFileSync(fp, src, 'utf8');
    total++;
  }
  console.log(`✓ ${k}: ${files.length} Suren`);
}
console.log(`\n✅ Gesamt: ${total}`);
