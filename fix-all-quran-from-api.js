const fs = require('fs');
const path = require('path');
const https = require('https');

// Language code mapping
const langMap = {
  'Deutsch': 'de',
  'Albanisch': 'sq',
  'Tagalog': 'tl',
  'Französisch': 'fr',
  'Spanisch': 'es',
  'Türkisch': 'tr',
  'Indonesisch': 'id',
  'Russisch': 'ru',
  'Persisch': 'fa',
  'Urdu': 'ur',
  'Bengali': 'bn',
  'Hindi': 'hi',
  'Chinesisch': 'zh',
  'Bosnisch': 'bs',
  'Uygurisch': 'ug',
  'Hausa': 'ha',
  'Thailändisch': 'th',
  'Kasachisch': 'kk',
  'Englisch': 'en'
};

// Fetch chapter info from Quran.com API
async function fetchChapterInfo(chapterNum, langCode) {
  return new Promise((resolve, reject) => {
    const url = `https://api.quran.com/api/v4/chapters/${chapterNum}?language=${langCode}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.chapter);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');
  const languages = Object.keys(langMap);

  console.log('Fetching native chapter names from Quran.com API...\n');

  for (const lang of languages) {
    const langCode = langMap[lang];
    const langDir = path.join(translationsDir, lang);
    
    if (!fs.existsSync(langDir)) {
      console.log(`⚠ ${lang}: Directory not found`);
      continue;
    }

    console.log(`Processing ${lang} (${langCode})...`);

    const chapterNames = {};
    
    // Fetch all 114 chapters
    for (let i = 1; i <= 114; i++) {
      try {
        const chapter = await fetchChapterInfo(i, langCode);
        chapterNames[String(i).padStart(3, '0')] = {
          transliteration: chapter.name_simple,
          translated_name: chapter.translated_name ? chapter.translated_name.name : chapter.name_simple
        };
        
        if (i % 10 === 0) process.stdout.write('.');
      } catch (e) {
        console.error(`\n  ⚠ Error fetching chapter ${i}:`, e.message);
      }
    }

    console.log(` ✓ Fetched ${Object.keys(chapterNames).length} chapters`);

    // Update index.html
    const indexPath = path.join(langDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      for (const [num, data] of Object.entries(chapterNames)) {
        const regex = new RegExp(
          `(<span class="ri"><span class="rs">${data.transliteration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span><span class="rt">)[^<]+(</span></span>)`,
          'g'
        );
        indexContent = indexContent.replace(regex, `$1${data.translated_name}$2`);
      }
      
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(`  ✓ Updated index.html`);
    }

    // Update all suren files
    const surenDir = path.join(langDir, 'suren');
    if (fs.existsSync(surenDir)) {
      const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
      let updated = 0;
      
      for (const file of surenFiles) {
        const numMatch = file.match(/^(\d+)-/);
        if (!numMatch) continue;
        
        const num = numMatch[1].padStart(3, '0');
        const data = chapterNames[num];
        if (!data) continue;
        
        const surenPath = path.join(surenDir, file);
        let content = fs.readFileSync(surenPath, 'utf8');
        const original = content;
        
        // Update sh-meta
        const metaRegex = /(<span class="sh-meta">)([^<·]+)(·\s*)([^<]+)(<\/span>)/;
        content = content.replace(metaRegex, `$1${data.transliteration}$3${data.translated_name}$5`);
        
        if (content !== original) {
          fs.writeFileSync(surenPath, content, 'utf8');
          updated++;
        }
      }
      
      console.log(`  ✓ Updated ${updated} suren files`);
    }

    console.log('');
  }

  console.log('✅ All Quran indices and chapter headers fixed with native translations!');
}

main().catch(console.error);
