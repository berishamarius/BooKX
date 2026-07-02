const fs = require('fs');
const path = require('path');
const https = require('https');

// Language mapping: folder name -> API language code
const LANGUAGE_MAP = {
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
async function fetchChapterNames(langCode) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.quran.com',
      path: `/api/v4/chapters?language=${langCode}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const chapters = {};
          json.chapters.forEach(ch => {
            chapters[ch.id] = {
              transliteration: ch.name_simple,
              translation: ch.translated_name.name,
              arabic: ch.name_arabic,
              verses: ch.verses_count
            };
          });
          resolve(chapters);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');
  
  console.log('🔄 Fetching native translations from Quran.com API...\n');

  for (const [langFolder, langCode] of Object.entries(LANGUAGE_MAP)) {
    try {
      console.log(`📥 ${langFolder} (${langCode})...`);
      
      const chapters = await fetchChapterNames(langCode);
      
      // DEBUG: Log first 3 chapters
      console.log(`  DEBUG Chapter 1: "${chapters[1].transliteration}" → "${chapters[1].translation}"`);
      
      const langDir = path.join(translationsDir, langFolder);
      
      if (!fs.existsSync(langDir)) {
        console.log(`  ⚠ Directory not found, skipping`);
        continue;
      }

      // 1. FIX INDEX
      const indexPath = path.join(langDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        let indexChanged = false;

        for (let i = 1; i <= 114; i++) {
          const ch = chapters[i];
          
          // Simple replace: find <span class="rt">ANYTHING</span> after the transliteration
          const rtPattern = new RegExp(
            `(<span class="rs">${ch.transliteration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span><span class="rt">)[^<]+(</span>)`,
            'g'
          );
          
          const before = indexHtml;
          indexHtml = indexHtml.replace(rtPattern, `$1${ch.translation}$2`);
          if (indexHtml !== before) indexChanged = true;
        }

        if (indexChanged) {
          fs.writeFileSync(indexPath, indexHtml, 'utf8');
          console.log(`  ✓ Index updated`);
        }
      }

      // 2. FIX ALL SUREN HEADERS
      const surenDir = path.join(langDir, 'suren');
      if (fs.existsSync(surenDir)) {
        const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
        let surenFixed = 0;

        for (const file of surenFiles) {
          const match = file.match(/^(\d+)-/);
          if (!match) continue;
          
          const chapterNum = parseInt(match[1]);
          const ch = chapters[chapterNum];
          if (!ch) continue;

          const surenPath = path.join(surenDir, file);
          let html = fs.readFileSync(surenPath, 'utf8');
          
          // Replace sh-meta content: "Transliteration · ANYTHING" -> "Transliteration · Native"
          const metaPattern = new RegExp(
            `(<span class="sh-meta">${ch.transliteration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} · )[^<]+(</span>)`,
            'g'
          );
          
          const before = html;
          html = html.replace(metaPattern, `$1${ch.translation}$2`);
          
          if (html !== before) {
            fs.writeFileSync(surenPath, html, 'utf8');
            surenFixed++;
          }
        }
        
        if (surenFixed > 0) {
          console.log(`  ✓ Fixed ${surenFixed} suren headers`);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n✅ All Quran files updated with native translations!');
}

main().catch(console.error);
