const fs = require('fs');
const path = require('path');

// Book 069 = 1 Maccabees (1MA), Book 070 = 2 Maccabees (2MA)
const BOOK_MAPPING = {
  '069': { prefix: 'grcbrent_052_1MA', chapters: 16 },
  '070': { prefix: 'grcbrent_053_2MA', chapters: 15 }
};

const LANGUAGES = [
  'german', 'italian', 'french', 'spanish', 'portuguese', 'dutch',
  'czech', 'polish', 'swedish', 'russian', 'ukrainian', 'hungarian',
  'albanian', 'croatian', 'tagalog', 'kjv'
];

const ORTHODOX_LANGUAGES = ['german', 'russian', 'ukrainian', 'croatian'];

console.log('📖 Inserting missing Greek texts into books 069 & 070...\n');

let totalInserted = 0;

for (const [bookNum, config] of Object.entries(BOOK_MAPPING)) {
  console.log(`\n=== Processing Book ${bookNum} (${config.prefix}) ===`);
  
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
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\d+):(\d+)\s+(.+)$/);
      if (match) {
        const [, chapter, verse, text] = match;
        const verseId = `${chapter}-${verse}`;
        greekVerses[verseId] = text.trim();
      }
    }
  }
  
  console.log(`✓ Loaded ${Object.keys(greekVerses).length} Greek verses for book ${bookNum}`);
  
  // Insert into all languages
  for (const lang of LANGUAGES) {
    // Skip non-Orthodox languages for books 069-070 (Maccabees are Catholic books)
    // Actually, Maccabees are Catholic, not Orthodox-only, so insert into ALL languages
    
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
      console.log(`  ${lang}: No insertions needed (already complete or no matching verses)`);
    }
  }
}

console.log(`\n✅ Total Greek verses inserted: ${totalInserted}`);
