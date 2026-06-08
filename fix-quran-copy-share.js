// fix-quran-copy-share.js
// Fixes copy/share functionality in all Quran pages
// Problem: getSuraVerse looks for data-verse-id but verses only have id="v1" etc.
const fs = require('fs');
const path = require('path');

let fileCount = 0;

function fixQuranFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // FIX 1: Update getSuraVerse to use id attribute (id="v1" etc.) instead of data-verse-id
  const getSuraVersePattern = /getSuraVerse\(el\) \{[\s\S]*?const verseNum = el\.getAttribute\('data-verse-id'\).*?;/;
  
  if (getSuraVersePattern.test(content)) {
    content = content.replace(
      /const verseNum = el\.getAttribute\('data-verse-id'\) \|\| el\.closest\('\[data-verse-id\]'\)\?\.getAttribute\('data-verse-id'\) \|\| 'X';/,
      `const verseEl = el.closest('.verse') || el.closest('[data-verse-id]') || el;
    const verseNum = verseEl.id?.replace('v', '') || verseEl.getAttribute('data-verse-id') || 'X';`
    );
    modified = true;
  }
  
  // FIX 2: Ensure copyVerse and shareVerse can find .verse elements properly
  // (Already has .closest('.verse') so should be OK, but let's verify the order)
  const verseElPatternOld = /const verseEl = el\.closest\('\[data-verse-id\]'\) \|\| el\.closest\('\.verse'\)/g;
  if (verseElPatternOld.test(content)) {
    content = content.replace(
      verseElPatternOld,
      "const verseEl = el.closest('.verse') || el.closest('[data-verse-id]')"
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    fileCount++;
    return true;
  }
  
  return false;
}

function processQuranDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processQuranDirectory(filePath);
    } else if (file.endsWith('.html')) {
      fixQuranFile(filePath);
    }
  }
}

console.log('🔧 Fixing Quran copy/share functionality...\n');

// Process main Quran
console.log('📗 AL-QURAN...');
processQuranDirectory('dist-alquran');

// Process Meliha edition
console.log('📘 Meliha Edition...');
processQuranDirectory('dist-meliha');

// Process Karim edition
console.log('📙 Karim Edition...');
processQuranDirectory('dist-karim');

console.log(`\n✅ Fixed ${fileCount} Quran HTML files`);
console.log('   • getSuraVerse: Now uses id="vX" instead of data-verse-id');
console.log('   • copyVerse/shareVerse: Prioritizes .verse selector');
