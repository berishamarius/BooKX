/**
 * INSERT EXISTING TRANSLATIONS FROM JSON INTO HTML
 * Use data from CATHOLIC-BIBLE/data/{language}/*.json
 */

const fs = require('fs');
const path = require('path');

// Languages WITH data (excluding arabic, syriac, romanian)
const LANGUAGES = [
  { code: 'albanian', dataDir: 'albanian', distDir: 'albanian' },
  { code: 'croatian', dataDir: 'croatian', distDir: 'croatian' },
  { code: 'czech', dataDir: 'czech', distDir: 'czech' },
  { code: 'dutch', dataDir: 'dutch', distDir: 'dutch' },
  { code: 'french', dataDir: 'french', distDir: 'french' },
  { code: 'hungarian', dataDir: 'hungarian', distDir: 'hungarian' },
  { code: 'italian', dataDir: 'italian', distDir: 'italian' },
  { code: 'polish', dataDir: 'polish', distDir: 'polish' },
  { code: 'portuguese', dataDir: 'portuguese', distDir: 'portuguese' },
  { code: 'russian', dataDir: 'russian', distDir: 'russian' },
  { code: 'spanish', dataDir: 'spanish', distDir: 'spanish' },
  { code: 'swedish', dataDir: 'swedish', distDir: 'swedish' },
  { code: 'tagalog', dataDir: 'tagalog', distDir: 'tagalog' },
  { code: 'ukrainian', dataDir: 'ukrainian', distDir: 'ukrainian' },
];

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   INSERT TRANSLATIONS FROM JSON INTO HTML FILES         ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let totalBooks = 0, successBooks = 0, errorBooks = 0;

for (const lang of LANGUAGES) {
  const dataPath = path.join('CATHOLIC-BIBLE', 'data', lang.dataDir);
  const distPath = path.join('dist-diebibel', lang.distDir, 'bücher');
  
  process.stdout.write(`${lang.code.padEnd(15, ' ')}: `);
  
  if (!fs.existsSync(dataPath)) {
    console.log(`✗ No data folder`);
    continue;
  }
  
  if (!fs.existsSync(distPath)) {
    console.log(`✗ No dist folder`);
    continue;
  }
  
  const jsonFiles = fs.readdirSync(dataPath).filter(f => f.endsWith('.json'));
  let langSuccess = 0;
  
  for (const jsonFile of jsonFiles) {
    const bookNum = jsonFile.replace('.json', '');
    const htmlFile = fs.readdirSync(distPath).find(f => f.startsWith(bookNum + '-'));
    
    if (!htmlFile) continue;
    
    totalBooks++;
    
    try {
      // Read JSON data
      const jsonPath = path.join(dataPath, jsonFile);
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Read HTML file
      const htmlPath = path.join(distPath, htmlFile);
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      // Find and replace all verse translations
      // Pattern: <div class="trans">—</div> or <div class="trans">old text</div>
      let modified = false;
      
      for (const [chapter, verses] of Object.entries(data)) {
        if (typeof verses !== 'object') continue;
        
        for (const [verseNum, verseText] of Object.entries(verses)) {
          if (!verseText || verseText === '—') continue;
          
          // Find verse block with id="vCHAPTER-VERSE"
          const verseId = `id="v${chapter}-${verseNum}"`;
          const verseIdIndex = html.indexOf(verseId);
          
          if (verseIdIndex === -1) continue;
          
          // Find <div class="trans"> after this verse ID
          const searchStart = verseIdIndex;
          const transStartTag = '<div class="trans">';
          const transStart = html.indexOf(transStartTag, searchStart);
          
          if (transStart === -1 || transStart > verseIdIndex + 500) continue;
          
          const transContentStart = transStart + transStartTag.length;
          const transEnd = html.indexOf('</div>', transContentStart);
          
          if (transEnd === -1) continue;
          
          const oldContent = html.substring(transContentStart, transEnd);
          
          // Replace if it's "—" or empty
          if (oldContent.trim() === '—' || oldContent.trim() === '') {
            html = html.substring(0, transContentStart) + verseText + html.substring(transEnd);
            modified = true;
          }
        }
      }
      
      if (modified) {
        fs.writeFileSync(htmlPath, html, 'utf8');
        langSuccess++;
        successBooks++;
      }
      
    } catch (e) {
      errorBooks++;
    }
  }
  
  console.log(`✓ ${langSuccess}/${jsonFiles.length} books`);
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`Total: ${totalBooks} books`);
console.log(`✅ Success: ${successBooks}`);
console.log(`❌ Errors: ${errorBooks}`);
console.log('═══════════════════════════════════════════════════════════\n');
