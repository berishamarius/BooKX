/**
 * CHECK WHICH BIBLE LANGUAGES NEED TRANSLATIONS
 */

const fs = require('fs');
const path = require('path');

const baseDir = 'dist-diebibel';
const languages = [
  'albanian', 'armenian', 'croatian', 'czech', 'dutch', 
  'french', 'hungarian', 'polish', 'portuguese', 
  'romanian', 'russian', 'spanish', 'swedish', 
  'syriac', 'tagalog', 'ukrainian', 'kjv'
];

console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║   CHECKING WHICH BIBLE LANGUAGES NEED TRANSLATIONS         ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

for (const lang of languages) {
  const filePath = path.join(baseDir, lang, 'bücher', '001-gen.html');
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has real translations or just placeholders
    const hasPlaceholder = content.includes('<div class="trans">—</div>');
    const hasRealTrans = /<div class="trans">[^—<][^<]{20,}/.test(content);
    
    const status = hasPlaceholder ? '❌ NUR PLATZHALTER' : 
                   hasRealTrans ? '✅ HAT ÜBERSETZUNG' :
                   '⚠️  UNBEKANNT';
    
    console.log(`${lang.padEnd(15, ' ')}: ${status}`);
  } else {
    console.log(`${lang.padEnd(15, ' ')}: ❓ DATEI FEHLT`);
  }
}

console.log('\n═══════════════════════════════════════════════════════════');
