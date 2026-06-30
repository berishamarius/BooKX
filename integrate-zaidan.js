/**
 * FETCH & INTEGRATE ZAIDAN GERMAN TRANSLATION FROM TANZIL
 * Download all 114 chapters and update HTML files
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TANZIL_BASE = 'https://tanzil.net/api/v1/';
const QURAN_PATH = 'dist-alquran/Übersetzungen/Deutsch/suren';

async function fetchChapter(chapter) {
  return new Promise((resolve, reject) => {
    // Tanzil API format: /ayat/{chapter}:{ayah}?edition=de.zaidan
    const url = `${TANZIL_BASE}ayat/${chapter}:1?edition=de.zaidan`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function getChapterVerses(chapter) {
  return new Promise((resolve) => {
    const verses = {};
    let completed = 0;

    // Get Quran metadata to know verse count per chapter
    https.get(`${TANZIL_BASE}chapters`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const chapters = JSON.parse(data);
          const chapterData = chapters.find(c => c.chapter_number === chapter);
          
          if (chapterData) {
            const verseCount = chapterData.verses_count;
            
            // Fetch all verses for this chapter
            for (let aya = 1; aya <= verseCount; aya++) {
              const url = `${TANZIL_BASE}ayat/${chapter}:${aya}?edition=de.zaidan`;
              
              https.get(url, (res2) => {
                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                  try {
                    const verse = JSON.parse(data2);
                    if (verse && verse.edition_text) {
                      verses[aya] = verse.edition_text;
                    }
                  } catch (e) {}
                  
                  completed++;
                  if (completed === verseCount) {
                    resolve(verses);
                  }
                });
              }).on('error', () => {
                completed++;
                if (completed === verseCount) {
                  resolve(verses);
                }
              });
            }
          } else {
            resolve(verses);
          }
        } catch (e) {
          resolve(verses);
        }
      });
    }).on('error', () => resolve(verses));
  });
}

async function updateChapter(chapter, verses) {
  if (!verses || Object.keys(verses).length === 0) {
    return { success: false, msg: `No verses fetched for chapter ${chapter}` };
  }

  const files = fs.readdirSync(QURAN_PATH);
  const chapterPadded = String(chapter).padStart(3, '0');
  const file = files.find(f => f.startsWith(chapterPadded + '-'));
  
  if (!file) {
    return { success: false, msg: `File not found for chapter ${chapter}` };
  }

  const filePath = path.join(QURAN_PATH, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // Replace each verse translation
  for (const [aya, text] of Object.entries(verses)) {
    const pattern = new RegExp(
      `(<div class="verse" id="v${aya}">.*?<div class="ar">.*?</div>.*?<div class="vd">.*?</div>\\s*<div class="tr">)([^<]+)(</div>)`,
      's'
    );

    if (pattern.test(content)) {
      content = content.replace(pattern, `$1${text}$3`);
      count++;
    }
  }

  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, file, count };
  }
  
  return { success: false, msg: `No verses updated in ${file}` };
}

async function main() {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║      INTEGRATING ZAIDAN TRANSLATION FROM TANZIL.NET         ║');
  console.log('║         (German, Public Domain, Open Source)                 ║');
  console.log('╚═════════════════════════════════════════════════════════════╝\n');

  let success = 0, failed = 0;

  console.log('Fetching from: https://tanzil.net/api/v1/\n');
  console.log('Translation: Amir Zaidan (de.zaidan)');
  console.log('License: Tanzil Terms of Use (non-commercial)\n');
  console.log('─────────────────────────────────────────────────────────────\n');

  for (let ch = 1; ch <= 114; ch++) {
    try {
      process.stdout.write(`Chapter ${String(ch).padStart(3, ' ')}: `);
      
      const verses = await getChapterVerses(ch);
      const result = await updateChapter(ch, verses);

      if (result.success) {
        console.log(`✓ (${result.count} verses)`);
        success++;
      } else {
        console.log(`✗ ${result.msg}`);
        failed++;
      }

      // Rate limiting - be respectful to API
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
      console.log(`✗ Error: ${e.message}`);
      failed++;
    }
  }

  console.log('\n═════════════════════════════════════════════════════════════\n');
  console.log(`✅ Updated: ${success} chapters`);
  console.log(`❌ Failed: ${failed} chapters\n`);
  
  if (success > 100) {
    console.log('🎉 SUCCESS! Zaidan translation integrated!');
    console.log('\nSource: https://tanzil.net/');
    console.log('Translator: Amir Zaidan');
    console.log('License: Non-commercial use (Tanzil Terms)');
  }
}

main().catch(console.error);
