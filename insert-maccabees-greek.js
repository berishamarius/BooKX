const fs = require('fs');
const path = require('path');

const BOOK_MAPPING = {
  '069': { prefix: 'grcbrent_052_1MA', chapters: 16, name: '1 Maccabees' },
  '070': { prefix: 'grcbrent_053_2MA', chapters: 15, name: '2 Maccabees' }
};

const LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

console.log('📖 Inserting Greek texts into 1 Maccabees & 2 Maccabees...\n');

let totalInserted = 0;

for (const [bookNum, config] of Object.entries(BOOK_MAPPING)) {
  console.log(`\n=== Processing Book ${bookNum} (${config.name}) ===`);
  
  const greekVerses = {};
  
  // Read all chapters from Septuagint
  for (let ch = 1; ch <= config.chapters; ch++) {
    const chapterStr = ch.toString().padStart(2, '0');
    const filePath = path.join('temp-septuagint', `${config.prefix}_${chapterStr}_read.txt`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Missing: ${filePath}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const allLines = content.split('\n');
    
    // Parse format: Title, Chapter number, then verses (each line = 1 verse)
    let verseNum = 1;
    let inVerses = false;
    
    for (const line of allLines) {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) continue;
      
      // Skip title line (contains Greek letters like Αʹ or Βʹ)
      if (trimmed.match(/ΜΑΚΚΑΒΑΙΩΝ/)) continue;
      
      // Skip chapter number line (just a number followed by period)
      if (trimmed.match(/^\d+\.$/)) {
        inVerses = true;
        continue;
      }
      
      // If we're in verses section, add to map
      if (inVerses && trimmed) {
        const verseId = `${ch}-${verseNum}`;
        greekVerses[verseId] = trimmed;
        verseNum++;
      }
    }
  }
  
  console.log(`✓ Loaded ${Object.keys(greekVerses).length} Greek verses for book ${bookNum}`);
  
  // Insert into all languages
  for (const lang of LANGUAGES) {
    const bookFile = fs.readdirSync(path.join('dist-diebibel', lang, 'bücher'))
      .find(f => f.startsWith(bookNum + '-'));
    
    if (!bookFile) {
      console.log(`⚠️  ${lang}: Book file for ${bookNum} not found`);
      continue;
    }
    
    const filePath = path.join('dist-diebibel', lang, 'bücher', bookFile);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let insertCount = 0;
    
    // Find all verse containers and insert Greek before .tra
    const verseRegex = /<div class="vb" id="v(\d+)-(\d+)">([\s\S]*?)<\/div>/g;
    
    html = html.replace(verseRegex, (match, chapter, verse, content) => {
      const verseId = `${chapter}-${verse}`;
      
      // Check if Greek already exists
      if (content.includes('class="base base-o"')) {
        return match;
      }
      
      const greekText = greekVerses[verseId];
      if (!greekText) {
        return match;
      }
      
      // Insert Greek before <p class="tra">
      const greekLine = `                    <p class="base base-o">${greekText}</p>\n`;
      const newContent = content.replace(
        /(\s+)<p class="tra">/,
        `${greekLine}$1<p class="tra">`
      );
      
      insertCount++;
      return `<div class="vb" id="v${chapter}-${verse}">${newContent}</div>`;
    });
    
    if (insertCount > 0) {
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`✓ ${lang}: Inserted ${insertCount} Greek verses into book ${bookNum}`);
      totalInserted += insertCount;
    } else {
      console.log(`  ${lang}: No insertions (already complete or no matching verses)`);
    }
  }
}

console.log(`\n✅ Total Greek verses inserted: ${totalInserted}`);
