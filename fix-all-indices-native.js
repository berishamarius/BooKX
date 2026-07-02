const fs = require('fs');
const path = require('path');
const https = require('https');

// Language mapping: folder name -> Quran.com API language code
const LANG_MAP = {
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

// Fetch chapter names from Quran.com API
function fetchChapterNames(langCode) {
  return new Promise((resolve, reject) => {
    const url = `https://api.quran.com/api/v4/chapters?language=${langCode}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const names = {};
          if (json.chapters) {
            json.chapters.forEach(ch => {
              names[ch.id.toString().padStart(3, '0')] = ch.translated_name?.name || ch.name_simple;
            });
          }
          resolve(names);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fixAllIndices() {
  console.log('Fetching native chapter names from Quran.com API...\n');
  
  const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');
  
  for (const [langFolder, langCode] of Object.entries(LANG_MAP)) {
    const indexPath = path.join(translationsDir, langFolder, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.log(`⚠ ${langFolder}: index.html not found`);
      continue;
    }
    
    try {
      // Fetch native names from API
      console.log(`Fetching ${langFolder} (${langCode})...`);
      const nativeNames = await fetchChapterNames(langCode);
      await delay(200); // Rate limit
      
      if (Object.keys(nativeNames).length === 0) {
        console.log(`⚠ ${langFolder}: No translations found, skipping`);
        continue;
      }
      
      // Read index file
      let html = fs.readFileSync(indexPath, 'utf8');
      let changes = 0;
      
      // Replace each chapter's translated name
      for (const [num, nativeName] of Object.entries(nativeNames)) {
        // Match pattern: <span class="rt">ANYTHING</span>
        const pattern = new RegExp(
          `(<a href="suren/${num}-[^"]+\\.html" class="row">\\s*` +
          `<span class="rn">${num}</span>\\s*` +
          `<span class="ra">[^<]+</span>\\s*` +
          `<span class="ri"><span class="rs">[^<]+</span><span class="rt">)([^<]+)(</span></span>\\s*` +
          `<span class="rv">\\d+</span>)`,
          'g'
        );
        
        const oldHtml = html;
        html = html.replace(pattern, (match, before, oldName, after) => {
          if (oldName !== nativeName) {
            changes++;
            return before + nativeName + after;
          }
          return match;
        });
      }
      
      // Write back if changed
      if (changes > 0) {
        fs.writeFileSync(indexPath, html, 'utf8');
        console.log(`✓ ${langFolder}: Updated ${changes} chapter names\n`);
      } else {
        console.log(`✓ ${langFolder}: Already correct\n`);
      }
      
    } catch (error) {
      console.error(`✗ ${langFolder}: Error - ${error.message}\n`);
    }
  }
  
  console.log('✅ All indices updated with native translations!');
}

fixAllIndices();
