// fix-bible-issues.js
// Fixes 2 critical issues in all Bibles:
// 1. Cross icon showing as Apple emoji → add text presentation selector
// 2. Copy/Share buttons not working → fix selector to include .vb class
const fs = require('fs');
const path = require('path');

const LANGS = [
  'albanian', 'croatian', 'czech', 'dutch', 'french', 'german', 'hungarian',
  'italian', 'kjv', 'polish', 'portuguese', 'romanian', 'russian',
  'spanish', 'swedish', 'tagalog', 'ukrainian', 'syriac', 'armenian'
];

const CONF_LABELS = {
  albanian: { catholic: '✝&#xFE0E; Katolik', protestant: '☩&#xFE0E; Protestant' },
  croatian: { catholic: '✝&#xFE0E; Katolički', protestant: '☩&#xFE0E; Protestantski' },
  czech: { catholic: '✝&#xFE0E; Katolický', protestant: '☩&#xFE0E; Protestantský' },
  dutch: { catholic: '✝&#xFE0E; Katholiek', protestant: '☩&#xFE0E; Protestant' },
  french: { catholic: '✝&#xFE0E; Catholique', protestant: '☩&#xFE0E; Protestant' },
  german: { catholic: '✝&#xFE0E; Katholisch', protestant: '☩&#xFE0E; Protestantisch' },
  hungarian: { catholic: '✝&#xFE0E; Katolikus', protestant: '☩&#xFE0E; Protestáns' },
  italian: { catholic: '✝&#xFE0E; Cattolico', protestant: '☩&#xFE0E; Protestante' },
  kjv: { catholic: '✝&#xFE0E; Catholic', protestant: '☩&#xFE0E; Protestant' },
  polish: { catholic: '✝&#xFE0E; Katolicki', protestant: '☩&#xFE0E; Protestancki' },
  portuguese: { catholic: '✝&#xFE0E; Católico', protestant: '☩&#xFE0E; Protestante' },
  romanian: { catholic: '✝&#xFE0E; Catolic', protestant: '☩&#xFE0E; Protestant' },
  russian: { catholic: '✝&#xFE0E; Католический', protestant: '☩&#xFE0E; Протестантский' },
  spanish: { catholic: '✝&#xFE0E; Católico', protestant: '☩&#xFE0E; Protestante' },
  swedish: { catholic: '✝&#xFE0E; Katolsk', protestant: '☩&#xFE0E; Protestantisk' },
  tagalog: { catholic: '✝&#xFE0E; Katoliko', protestant: '☩&#xFE0E; Protestante' },
  ukrainian: { catholic: '✝&#xFE0E; Католицький', protestant: '☩&#xFE0E; Протестантський' },
  syriac: { catholic: '✝&#xFE0E; ܩܬܘܠܝܩܝܐ', protestant: '☩&#xFE0E; ܦܪܘܬܣܬܐܢܬ' },
  armenian: { catholic: '✝&#xFE0E; Կաթոլիկ', protestant: '☩&#xFE0E; Պրոտեստանտ' }
};

let fileCount = 0;

function fixFile(filePath, lang) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // FIX 1: Update confession button labels with proper cross icons
  if (CONF_LABELS[lang]) {
    const cathPattern = /<button class="conf-btn" data-conf="catholic">.*?<\/button>/;
    const protPattern = /<button class="conf-btn" data-conf="protestant">.*?<\/button>/;
    
    if (cathPattern.test(content)) {
      content = content.replace(
        cathPattern,
        `<button class="conf-btn" data-conf="catholic">${CONF_LABELS[lang].catholic}</button>`
      );
      modified = true;
    }
    
    if (protPattern.test(content)) {
      content = content.replace(
        protPattern,
        `<button class="conf-btn" data-conf="protestant">${CONF_LABELS[lang].protestant}</button>`
      );
      modified = true;
    }
  }
  
  // FIX 2: Fix copy/share button selector to include .vb class
  const selectorPattern = /document\.querySelectorAll\('\[data-verse\], \.verse, \.vrs'\)/g;
  if (selectorPattern.test(content)) {
    content = content.replace(
      selectorPattern,
      "document.querySelectorAll('[data-verse], .verse, .vrs, .vb')"
    );
    modified = true;
  }
  
  // FIX 3: Also fix getReference to handle .vb elements
  const getRefPattern = /getReference\(el\) \{[\s\S]*?const verseEl = el\.closest\('\[data-verse\]'\) \|\| el\.closest\('\.verse'\) \|\| el\.parentElement;/;
  if (getRefPattern.test(content)) {
    content = content.replace(
      getRefPattern,
      `getReference(el) {
    const verseEl = el.closest('[data-verse]') || el.closest('.verse') || el.closest('.vb') || el.parentElement;`
    );
    modified = true;
  }
  
  // Also fix in copyVerse and shareVerse functions
  const verseElPattern = /const verseEl = el\.closest\('\[data-verse\]'\) \|\| el\.closest\('\.verse'\) \|\| el\.parentElement;/g;
  content = content.replace(
    verseElPattern,
    "const verseEl = el.closest('[data-verse]') || el.closest('.verse') || el.closest('.vb') || el.parentElement;"
  );
  
  if (modified || verseElPattern.test(fs.readFileSync(filePath, 'utf8'))) {
    fs.writeFileSync(filePath, content, 'utf8');
    fileCount++;
    return true;
  }
  
  return false;
}

function processDirectory(dir, lang) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath, lang);
    } else if (file.endsWith('.html')) {
      fixFile(filePath, lang);
    }
  }
}

console.log('🔧 Fixing Bible cross icons and copy/share buttons...\n');

for (const lang of LANGS) {
  const langDir = path.join('dist-diebibel', lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠ ${lang} directory not found`);
    continue;
  }
  
  console.log(`📖 ${lang}...`);
  processDirectory(langDir, lang);
}

console.log(`\n✅ Fixed ${fileCount} HTML files`);
console.log('   • Cross icons: ✝ → ✝&#xFE0E; (text presentation)');
console.log('   • Copy/Share: Added .vb to selector');
console.log('   • Confession buttons: Translated per language');
