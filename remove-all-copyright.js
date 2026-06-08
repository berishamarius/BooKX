const fs = require('fs');
const path = require('path');

console.log('🔧 REMOVING COPYRIGHT from ALL Quran + Bible languages\n');

const quranLangs = [
  'Albanisch', 'Bengalisch', 'Bosnisch', 'Chinesisch', 'Deutsch', 'Englisch',
  'Französisch', 'Hausa', 'Hindi', 'Indonesisch', 'Kasachisch', 'Persisch',
  'Russisch', 'Spanisch', 'Tagalog', 'Thailändisch', 'Türkisch', 'Urdu', 'Uygurisch'
];

const bibleLangs = [
  'kjv', 'german', 'french', 'spanish', 'portuguese', 'polish', 'russian',
  'croatian', 'dutch', 'hungarian', 'czech', 'swedish', 'tagalog', 'ukrainian',
  'albanian', 'romanian', 'italian', 'syriac', 'armenian'
];

function removeCopyrightFromFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let html = fs.readFileSync(filePath, 'utf-8');
  const original = html;
  
  // Remove all copyright meta tags
  html = html.replace(/<meta[^>]*copyright[^>]*>/gi, '');
  html = html.replace(/<meta[^>]*name="?author"?[^>]*>/gi, '');
  html = html.replace(/<meta[^>]*content="?[^"]*KX Books[^"]*"?[^>]*>/gi, '');
  
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf-8');
    return true;
  }
  return false;
}

// QURAN
let quranFixed = 0;
for (const lang of quranLangs) {
  const langPath = path.join('dist-alquran', 'Übersetzungen', lang);
  
  // Index
  if (removeCopyrightFromFile(path.join(langPath, 'index.html'))) quranFixed++;
  if (removeCopyrightFromFile(path.join(langPath, 'intro.html'))) quranFixed++;
  if (removeCopyrightFromFile(path.join(langPath, 'back-cover.html'))) quranFixed++;
  
  // All suren
  const surenPath = path.join(langPath, 'suren');
  if (fs.existsSync(surenPath)) {
    const files = fs.readdirSync(surenPath).filter(f => f.endsWith('.html'));
    for (const file of files) {
      if (removeCopyrightFromFile(path.join(surenPath, file))) quranFixed++;
    }
  }
}

console.log(`✅ Quran: ${quranFixed} Dateien bereinigt`);

// BIBLE
let bibleFixed = 0;
for (const lang of bibleLangs) {
  const langPath = path.join('dist-diebibel', lang);
  
  if (removeCopyrightFromFile(path.join(langPath, 'index.html'))) bibleFixed++;
  if (removeCopyrightFromFile(path.join(langPath, 'back-cover.html'))) bibleFixed++;
  
  // All books
  const booksPath = path.join(langPath, 'bücher');
  if (fs.existsSync(booksPath)) {
    const files = fs.readdirSync(booksPath).filter(f => f.endsWith('.html'));
    for (const file of files) {
      if (removeCopyrightFromFile(path.join(booksPath, file))) bibleFixed++;
    }
  }
}

console.log(`✅ Bible: ${bibleFixed} Dateien bereinigt`);
console.log(`\n✅ TOTAL: ${quranFixed + bibleFixed} Dateien ohne Copyright!`);
