'use strict';
const fs = require('fs');
const path = require('path');

// OLD color → NEW color (from cover.html)
const COLOR_MAP = [
  ['#1a3a1e', '#0b2414'],  // body bg (suren)
  ['#1e3d22', '#0b2414'],  // body bg mobile/fallback
  ['#142e18', '#0b2414'],  // body gradient dark strips
  ['#163020', '#0f2f1a'],  // nav, sh-header, bot-nav, footer
  ['#122e16', '#0f2f1a'],  // bismi area / bn-ghost
];

const DIRS = [
  'dist-alquran',
  'dist-karim',
  'dist-meliha',
];

function updateColors(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch(e) { return false; }
  const original = content;

  for (const [oldColor, newColor] of COLOR_MAP) {
    // Case-insensitive replacement
    const re = new RegExp(oldColor.replace('#', '#'), 'gi');
    content = content.replace(re, newColor);
  }

  if (content !== original) {
    try { fs.writeFileSync(filePath, content, 'utf8'); return true; } catch(e) { return false; }
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch(e) { return 0; }
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) count += walkDir(full);
    else if (item.isFile() && item.name.endsWith('.html')) {
      if (updateColors(full)) count++;
    }
  }
  return count;
}

console.log('Updating colors to match new cover design...\n');
console.log('  #1a3a1e → #0b2414 (body bg)');
console.log('  #1e3d22 → #0b2414 (mobile/fallback bg)');
console.log('  #142e18 → #0b2414 (gradient strips)');
console.log('  #163020 → #0f2f1a (nav/header/footer)');
console.log('  #122e16 → #0f2f1a (bismi area)\n');

let total = 0;
for (const d of DIRS) {
  const n = walkDir(d);
  if (n > 0) { console.log(`  ${d}: ${n} files`); total += n; }
}
console.log(`\nDone: ${total} files updated.`);
