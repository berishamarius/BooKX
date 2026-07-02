const fs = require('fs');
const path = require('path');

// Languages with issues
const LANGS_TO_FIX = ['Tagalog', 'Kasachisch'];
const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

// Extract correct mapping from index.html
function getSurenMappingFromIndex(indexPath) {
  const content = fs.readFileSync(indexPath, 'utf8');
  const mapping = {};
  
  const rows = content.match(/<a href="suren\/([^"]+)"[^>]*class="row">[\s\S]*?<span class="ri"><span class="rs">([^<]+)<\/span><span class="rt">([^<]+)<\/span><\/span>/g) || [];
  
  rows.forEach(row => {
    const hrefMatch = row.match(/href="suren\/([^"]+)"/);
    const rsMatch = row.match(/<span class="rs">([^<]+)<\/span>/);
    const rtMatch = row.match(/<span class="rt">([^<]+)<\/span>/);
    
    if (hrefMatch && rsMatch && rtMatch) {
      const href = hrefMatch[1];
      // Remove .html to get file reference
      const fileRef = href.replace('.html', '');
      const transliteration = rsMatch[1];
      const translation = rtMatch[1];
      
      mapping[fileRef] = {
        transliteration,
        translation
      };
    }
  });
  
  console.log(`✓ Extracted ${Object.keys(mapping).length} surah mappings`);
  return mapping;
}

// Fix Tagalog and Kasachisch
for (const lang of LANGS_TO_FIX) {
  console.log(`\n=== Processing ${lang} ===`);
  
  const indexPath = path.join(translationsDir, lang, 'index.html');
  const surenDir = path.join(translationsDir, lang, 'suren');
  
  const mapping = getSurenMappingFromIndex(indexPath);
  
  // Get all surah files
  const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
  
  let fixedCount = 0;
  
  for (const file of surenFiles) {
    const filePath = path.join(surenDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Get file reference (e.g., "001-Al-Fatihah.html" -> "001-Al-Fatihah")
    const fileRef = file.replace('.html', '');
    let mapData = mapping[fileRef];
    
    // Try alternative matching if not found
    if (!mapData) {
      const matches = Object.keys(mapping).filter(key => 
        key.toLowerCase().replace(/[-_]/g, '') === fileRef.toLowerCase().replace(/[-_]/g, '')
      );
      if (matches.length > 0) {
        mapData = mapping[matches[0]];
      }
    }
    
    if (!mapData) {
      console.log(`⚠ ${file}: No mapping found (tried: ${fileRef})`);
      continue;
    }
    // Fix the sh-meta header
    const metaPattern = /<span class="sh-meta">([^<]*)<\/span>/;
    const newMeta = `<span class="sh-meta">${mapData.transliteration} · ${mapData.translation}</span>`;
    
    if (metaPattern.test(content)) {
      content = content.replace(metaPattern, newMeta);
      fixedCount++;
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  console.log(`✓ Fixed ${fixedCount}/${surenFiles.length} surah headers`);
}

console.log('\n✅ All Quran headers fixed!');
