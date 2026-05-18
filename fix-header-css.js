// fix-header-css.js
// Bug: /*.bhead::before{ opens CSS comment that swallows .btestament, .blatin, .btrans, .bmeta
// Fix: remove the /* prefix from the bhead pseudo-element rules

const fs = require('fs');
const path = require('path');

const BIBLE_DIR = 'dist-diebibel';
const langs = fs.readdirSync(BIBLE_DIR).filter(function(x) {
  return fs.statSync(path.join(BIBLE_DIR, x)).isDirectory();
});

let fixed = 0;
let total = 0;

langs.forEach(function(lang) {
  const buecher = path.join(BIBLE_DIR, lang, 'b\u00FCcher');
  if (!fs.existsSync(buecher)) return;

  const files = fs.readdirSync(buecher).filter(function(f) { return f.endsWith('.html'); });

  files.forEach(function(f) {
    const file = path.join(buecher, f);
    let html = fs.readFileSync(file, 'utf8');
    total++;

    // The bug: /*.bhead::before opens a CSS comment
    // Fix: un-comment the pseudo-element rules
    const before = html;

    // Pattern 1: /*.bhead::before{ ... }
    html = html.replace(/\/\*\.bhead::before\{/g, '.bhead::before{');
    // Pattern 2: }/*.bhead::after{ (the second one)
    html = html.replace(/\}\/\*\.bhead::after\{/g, '}\n.bhead::after{');
    // Also handle if they appear separately
    html = html.replace(/\/\*\.bhead::after\{/g, '.bhead::after{');

    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      fixed++;
    }
  });
});

console.log('Fixed', fixed, '/', total, 'chapter files.');
console.log('Header CSS (btestament, blatin, btrans, bmeta) now active in all languages.');
