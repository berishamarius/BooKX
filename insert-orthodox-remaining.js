const fs = require('fs');
const path = require('path');

const ORTHODOX_LANGUAGES = ['german', 'russian', 'ukrainian', 'croatian'];

const BOOK_MAPPING = {
  '074': { prefix: 'grcbrent_054_1ES', chapters: 9, name: '1 Esdras' },
  '076': { prefix: 'grcbrent_055_MAN', chapters: 1, name: 'Prayer of Manasseh' },
  '078': { prefix: 'grcbrent_050_SUS', chapters: 1, name: 'Susanna' },
  '079': { prefix: 'grcbrent_051_BEL', chapters: 1, name: 'Bel and Dragon' }
};

console.log('📖 Inserting Greek texts into Orthodox books 074, 076, 078-079...\n');

let totalInserted = 0;

for (const [bookNum, config] of Object.entries(BOOK_MAPPING)) {
  console.log(`\n=== Processing Book ${bookNum} (${config.name}) ===`);
  
  const greekVerses = {};
  
  for (let ch = 1; ch <= config.chapters; ch++) {
    const chapterStr = ch.toString().padStart(2, '0');
    const filePath = path.join('temp-septuagint', `${config.prefix}_${chapterStr}_read.txt`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Missing: ${filePath}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const allLines = content.split('\n');
    
    let verseNum = 1;
    let inVerses = false;
    
    for (const line of allLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Skip title/header lines
      if (trimmed.match(/^[Α-Ω\s\.ʹ]+$/)) continue;
      if (trimmed.match(/^\d+\.$/)) {
        inVerses = true;
        continue;
      }
      
      if (inVerses && trimmed) {
        const verseId = `${ch}-${verseNum}`;
        greekVerses[verseId] = trimmed;
        verseNum++;
      }
    }
  }
  
  console.log(`✓ Loaded ${Object.keys(greekVerses).length} Greek verses for book ${bookNum}`);
  
  for (const lang of ORTHODOX_LANGUAGES) {
    const bookFile = fs.readdirSync(path.join('dist-diebibel', lang, 'bücher'))
      .find(f => f.startsWith(bookNum + '-'));
    
    if (!bookFile) {
      console.log(`⚠️  ${lang}: Book ${bookNum} not found`);
      continue;
    }
    
    const filePath = path.join('dist-diebibel', lang, 'bücher', bookFile);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let insertCount = 0;
    const verseRegex = /<div class="vb" id="v(\d+)-(\d+)">([\s\S]*?)<\/div>/g;
    
    html = html.replace(verseRegex, (match, chapter, verse, content) => {
      const verseId = `${chapter}-${verse}`;
      
      if (content.includes('class="base base-o"')) {
        return match;
      }
      
      const greekText = greekVerses[verseId];
      if (!greekText) {
        return match;
      }
      
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
    }
  }
}

console.log(`\n✅ Total: ${totalInserted} Greek verses inserted!`);
