const fs = require('fs');
const path = require('path');

// Language code mapping
const langCodeMap = {
  'Albanisch': 'sq',
  'Bengalisch': 'bn',
  'Bosnisch': 'bs',
  'Chinesisch': 'zh',
  'Deutsch': 'de',
  'Englisch': 'en',
  'Französisch': 'fr',
  'Hausa': 'ha',
  'Hindi': 'hi',
  'Indonesisch': 'id',
  'Kasachisch': 'kk',
  'Persisch': 'fa',
  'Russisch': 'ru',
  'Spanisch': 'es',
  'Tagalog': 'tl',
  'Thailändisch': 'th',
  'Türkisch': 'tr',
  'Urdu': 'ur',
  'Uygurisch': 'ug'
};

const cacheDir = path.join(__dirname, 'AL-QURAN/cache');
const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

console.log('Reading cache files for all languages...\n');

// For each language, extract native surah names from cache
const languageNames = {};

for (const [langName, langCode] of Object.entries(langCodeMap)) {
  const langCacheDir = path.join(cacheDir, langCode);
  
  if (!fs.existsSync(langCacheDir)) {
    console.log(`⚠ ${langName} (${langCode}): No cache directory`);
    continue;
  }

  languageNames[langName] = {};
  
  // Read all JSON cache files
  const cacheFiles = fs.readdirSync(langCacheDir).filter(f => f.endsWith('.json'));
  
  for (const file of cacheFiles) {
    try {
      const cachePath = path.join(langCacheDir, file);
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      
      if (data.data && data.data.surahs) {
        for (const surah of data.data.surahs) {
          const num = String(surah.number).padStart(3, '0');
          const transliteration = surah.englishName || surah.name;
          const nativeName = surah.name;
          
          languageNames[langName][num] = {
            transliteration: transliteration,
            native: nativeName
          };
        }
      }
    } catch (e) {
      // Skip invalid files
    }
  }
  
  console.log(`✓ ${langName}: Extracted ${Object.keys(languageNames[langName]).length} surah names`);
}

console.log('\nApplying native names to indices and suren...\n');

// Now apply to each language
for (const [langName, names] of Object.entries(languageNames)) {
  if (Object.keys(names).length === 0) continue;
  
  const langDir = path.join(translationsDir, langName);
  const indexPath = path.join(langDir, 'index.html');
  const surenDir = path.join(langDir, 'suren');
  
  if (!fs.existsSync(indexPath) || !fs.existsSync(surenDir)) {
    console.log(`⚠ ${langName}: Missing files`);
    continue;
  }

  // Update index
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  let indexUpdated = 0;
  
  for (const [num, info] of Object.entries(names)) {
    const oldPattern = new RegExp(
      `(<span class="ri"><span class="rs">${info.transliteration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span><span class="rt">)[^<]+(</span></span>\\s*<span class="rv">)`,
      'g'
    );
    
    const replacement = `$1${info.native}$2`;
    
    if (oldPattern.test(indexContent)) {
      indexContent = indexContent.replace(oldPattern, replacement);
      indexUpdated++;
    }
  }
  
  if (indexUpdated > 0) {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`✓ ${langName}: Updated ${indexUpdated} index entries`);
  }

  // Update suren headers
  const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
  let surenUpdated = 0;
  
  for (const file of surenFiles) {
    const numMatch = file.match(/^(\d+)-/);
    if (!numMatch) continue;
    
    const num = numMatch[1].padStart(3, '0');
    const info = names[num];
    
    if (!info) continue;
    
    const surenPath = path.join(surenDir, file);
    let content = fs.readFileSync(surenPath, 'utf8');
    const original = content;
    
    // Update sh-meta
    const metaPattern = new RegExp(
      `(<span class="sh-meta">${info.transliteration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}·\\s*)[^<]+(</span>)`
    );
    
    content = content.replace(metaPattern, `$1${info.native}$2`);
    
    if (content !== original) {
      fs.writeFileSync(surenPath, content, 'utf8');
      surenUpdated++;
    }
  }
  
  if (surenUpdated > 0) {
    console.log(`  ✓ Updated ${surenUpdated} suren headers`);
  }
}

console.log('\n✅ All languages fixed with native translations from cache!');
