const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

console.log('🔧 Fixing picker crosses to HTML entities...\n');

let fixedCount = 0;

for (const lang of LANGUAGES) {
  const indexPath = path.join('dist-diebibel', lang, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  ${lang}: index.html not found`);
    continue;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  let changed = false;
  
  // Replace cross Unicode symbols with HTML entities
  // ✝ (Latin Cross) → &#10013;
  if (html.includes('✝')) {
    html = html.replace(/✝/g, '&#10013;');
    changed = true;
  }
  
  // ☩ (Cross of Jerusalem) → &#9769;
  if (html.includes('☩')) {
    html = html.replace(/☩/g, '&#9769;');
    changed = true;
  }
  
  // ☦ (Orthodox Cross) → &#9766; (should not exist, but check)
  if (html.includes('☦')) {
    html = html.replace(/☦/g, '&#9766;');
    changed = true;
  }
  
  // † (Dagger) → &dagger;
  if (html.includes('†')) {
    html = html.replace(/†/g, '&dagger;');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`✓ ${lang}: Fixed cross symbols`);
    fixedCount++;
  } else {
    console.log(`  ${lang}: No changes needed`);
  }
}

console.log(`\n✅ Fixed ${fixedCount}/${LANGUAGES.length} index files!`);
