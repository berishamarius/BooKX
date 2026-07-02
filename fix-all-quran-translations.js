const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');
const languages = fs.readdirSync(translationsDir).filter(f => {
  const stat = fs.statSync(path.join(translationsDir, f));
  return stat.isDirectory();
});

console.log(`Processing ${languages.length} languages...\n`);

for (const lang of languages) {
  const indexPath = path.join(translationsDir, lang, 'index.html');
  const surenDir = path.join(translationsDir, lang, 'suren');
  
  if (!fs.existsSync(indexPath) || !fs.existsSync(surenDir)) {
    console.log(`⚠ ${lang}: Missing files`);
    continue;
  }

  // Extract translations from index
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const surenMappings = {};
  
  const indexRegex = /<a href="suren\/(\d+-[^"]+)"[^>]*class="row">[\s\S]*?<span class="ri"><span class="rs">([^<]+)<\/span><span class="rt">([^<]+)<\/span><\/span>/g;
  let match;
  while ((match = indexRegex.exec(indexContent)) !== null) {
    const href = match[1];
    const surenNum = href.match(/^(\d+)-/)[1].padStart(3, '0');
    const transliteration = match[2]; // Arabic transliteration like "Al-Fatihah"
    const translation = match[3];     // Native language like "Ашу құлышы" or "The Opener"
    
    surenMappings[surenNum] = {
      href,
      transliteration,
      translation: translation.trim()
    };
  }

  console.log(`${lang}: Extracted ${Object.keys(surenMappings).length} suren with translations`);

  // Update all suren files
  let updatedCount = 0;
  for (const [surenNum, mapping] of Object.entries(surenMappings)) {
    // href already includes .html extension
    const surenFile = path.join(surenDir, mapping.href);
    
    if (!fs.existsSync(surenFile)) {
      continue;
    }

    let content = fs.readFileSync(surenFile, 'utf8');
    const original = content;

    // Update <span class="sh-meta"> ONLY in HTML body, not in CSS
    // Match: <span class="sh-meta">ANY_CONTENT</span>
    const metaRegex = /<span class="sh-meta">([^<]*?)<\/span>/;
    const match = metaRegex.exec(content);
    
    if (match) {
      const newMeta = `<span class="sh-meta">${mapping.translation}</span>`;
      content = content.replace(metaRegex, newMeta);
      updatedCount++;
    }

    if (content !== original) {
      fs.writeFileSync(surenFile, content, 'utf8');
    }
  }

  console.log(`  ✓ Updated ${updatedCount} suren headers\n`);
}

console.log('✅ All Quran translations standardized!');
