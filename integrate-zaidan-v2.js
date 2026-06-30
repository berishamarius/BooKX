/**
 * DOWNLOAD ZAIDAN FROM TANZIL & PARSE INTO HTML
 * Simpler approach: Download pre-built text file
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TANZIL_URL = 'https://tanzil.net/res/text/editions/de.zaidan.txt';
const QURAN_PATH = 'dist-alquran/Übersetzungen/Deutsch/suren';

async function downloadZaidan() {
  return new Promise((resolve, reject) => {
    console.log('Downloading Zaidan from Tanzil...\n');
    process.stdout.write('Downloading: ');
    
    https.get(TANZIL_URL, (res) => {
      let data = '';
      let size = 0;
      
      res.on('data', chunk => {
        data += chunk;
        size += chunk.length;
        process.stdout.write('.');
      });
      
      res.on('end', () => {
        console.log(` ✓ ${(size / 1024).toFixed(1)} KB\n`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

function parseZaidanText(text) {
  const verses = {};
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Format: chapter|aya|text
    const parts = line.split('|');
    if (parts.length >= 3) {
      const chapter = parseInt(parts[0]);
      const aya = parseInt(parts[1]);
      const text = parts.slice(2).join('|').trim();
      
      if (chapter && aya && text) {
        verses[`${chapter}:${aya}`] = text;
      }
    }
  }
  
  return verses;
}

function updateChapter(chapter, verses) {
  const files = fs.readdirSync(QURAN_PATH);
  const chapterPadded = String(chapter).padStart(3, '0');
  const file = files.find(f => f.startsWith(chapterPadded + '-'));
  
  if (!file) {
    return { success: false, msg: `File not found` };
  }

  const filePath = path.join(QURAN_PATH, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // Get all verses for this chapter
  const chapterVerses = Object.entries(verses).filter(([key]) => 
    key.startsWith(`${chapter}:`)
  );

  for (const [key, text] of chapterVerses) {
    const aya = key.split(':')[1];
    
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
    return { success: true, count };
  }
  
  return { success: false, msg: `No verses matched` };
}

async function main() {
  try {
    console.log('╔═════════════════════════════════════════════════════════════╗');
    console.log('║    INTEGRATING ZAIDAN TRANSLATION FROM TANZIL.NET          ║');
    console.log('║       German - Amir Zaidan (Public Domain Source)           ║');
    console.log('╚═════════════════════════════════════════════════════════════╝\n');

    // Download
    const zaidanText = await downloadZaidan();
    console.log('Parsing verses...');
    
    const verses = parseZaidanText(zaidanText);
    console.log(`Parsed: ${Object.keys(verses).length} verses\n`);

    // Update HTML files
    console.log('Updating HTML files:\n');
    let success = 0, failed = 0;

    for (let ch = 1; ch <= 114; ch++) {
      process.stdout.write(`Chapter ${String(ch).padStart(3, ' ')}: `);
      
      const result = updateChapter(ch, verses);

      if (result.success) {
        console.log(`✓ (${result.count} verses)`);
        success++;
      } else {
        console.log(`✗ ${result.msg}`);
        failed++;
      }
    }

    console.log('\n═════════════════════════════════════════════════════════════');
    console.log(`\n✅ Updated: ${success} chapters`);
    console.log(`❌ Failed: ${failed} chapters\n`);

  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();
