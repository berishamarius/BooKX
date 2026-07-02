const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

// Get all languages
const languages = fs.readdirSync(translationsDir).filter(f => {
  const stat = fs.statSync(path.join(translationsDir, f));
  return stat.isDirectory();
});

console.log(`Processing ${languages.length} languages...\n`);

// For each language, extract native translations from existing suren files
for (const lang of languages) {
  const langDir = path.join(translationsDir, lang);
  const surenDir = path.join(langDir, 'suren');
  const indexPath = path.join(langDir, 'index.html');

  if (!fs.existsSync(surenDir) || !fs.existsSync(indexPath)) {
    console.log(`⚠ ${lang}: Missing suren directory or index`);
    continue;
  }

  // Extract native names from suren files
  const nativeNames = {};
  const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));

  for (const file of surenFiles) {
    const surenPath = path.join(surenDir, file);
    const content = fs.readFileSync(surenPath, 'utf8');

    // Extract surah number
    const numMatch = file.match(/^(\d+)-/);
    if (!numMatch) continue;
    const num = numMatch[1].padStart(3, '0');

    // Try to find native translation in .tr elements
    const trRegex = /<div class="tr">([^<]+)/;
    const trMatch = content.match(trRegex);
    
    if (trMatch && trMatch[1].trim()) {
      // Found a translation - this language has native text
      // Now extract from sh-meta if it has native format
      const metaRegex = /<span class="sh-meta">([^<·]+)·\s*([^<]+)<\/span>/;
      const metaMatch = content.match(metaRegex);
      
      if (metaMatch) {
        const transliteration = metaMatch[1].trim();
        const meaning = metaMatch[2].trim();
        
        // If meaning is NOT English (simple check), use it
        if (meaning !== 'The Opener' && meaning !== 'The Cow' && meaning !== 'The Women') {
          nativeNames[num] = meaning;
        }
      }
    }
  }

  console.log(`${lang}: Extracted ${Object.keys(nativeNames).length} native translations`);

  // If we found native names, update index and all suren files
  if (Object.keys(nativeNames).length > 0) {
    // Update index
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let updated = 0;

    for (const [num, nativeName] of Object.entries(nativeNames)) {
      // Replace English with native in index
      const indexRegex = new RegExp(
        `(<a href="suren/${num}-[^"]+?"[^>]*class="row">\\s*<span class="rn">${num}</span>\\s*<span class="ra">[^<]+</span>\\s*<span class="ri"><span class="rs">[^<]+</span><span class="rt">)([^<]+)(</span></span>)`,
        'g'
      );
      
      if (indexRegex.test(indexContent)) {
        indexContent = indexContent.replace(indexRegex, `$1${nativeName}$3`);
        updated++;
      }
    }

    if (updated > 0) {
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(`  ✓ Updated ${updated} entries in index`);
    }

    // Update suren files
    let surenUpdated = 0;
    for (const [num, nativeName] of Object.entries(nativeNames)) {
      const surenFile = surenFiles.find(f => f.startsWith(num + '-'));
      if (!surenFile) continue;

      const surenPath = path.join(surenDir, surenFile);
      let surenContent = fs.readFileSync(surenPath, 'utf8');
      const original = surenContent;

      // Update sh-meta
      const metaRegex = /(<span class="sh-meta">[^<·]+·\s*)([^<]+)(<\/span>)/;
      surenContent = surenContent.replace(metaRegex, `$1${nativeName}$3`);

      if (surenContent !== original) {
        fs.writeFileSync(surenPath, surenContent, 'utf8');
        surenUpdated++;
      }
    }

    if (surenUpdated > 0) {
      console.log(`  ✓ Updated ${surenUpdated} suren files`);
    }
  }

  console.log('');
}

console.log('✅ All native translations extracted and applied!');
