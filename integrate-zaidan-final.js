/**
 * INTEGRATE ZAIDAN TRANSLATION INTO ALL 114 SURAH FILES
 * Parse de.zaidan.txt and update HTML files
 */

const fs = require('fs');
const path = require('path');

const QURAN_PATH = 'dist-alquran/Übersetzungen/Deutsch/suren';
const ZAIDAN_FILE = 'de.zaidan.txt';

// Parse Zaidan file
function parseZaidan() {
  const content = fs.readFileSync(ZAIDAN_FILE, 'utf8');
  const lines = content.split('\n');
  
  const verses = {};
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (!line.trim() || line.startsWith('#')) continue;
    
    // Parse: chapter|verse|text
    const match = line.match(/^(\d+)\|(\d+)\|(.+)$/);
    if (match) {
      const [, chapter, verse, text] = match;
      const key = `${chapter}:${verse}`;
      verses[key] = text.trim();
    }
  }
  
  console.log(`✓ Parsed ${Object.keys(verses).length} verses from Zaidan`);
  return verses;
}

// Update single HTML file
function updateSurahFile(chapter, verses) {
  // Find HTML file for this chapter
  const files = fs.readdirSync(QURAN_PATH);
  const chapterPadded = String(chapter).padStart(3, '0');
  const htmlFile = files.find(f => f.startsWith(chapterPadded + '-'));
  
  if (!htmlFile) {
    return { success: false, msg: `File not found` };
  }

  const filePath = path.join(QURAN_PATH, htmlFile);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = 0;

  // Update each verse in this chapter
  // Look for: <div class="verse" id="v{N}">...<div class="tr">old text</div>
  for (let aya = 1; aya <= 300; aya++) {
    const verseKey = `${chapter}:${aya}`;
    if (!verses[verseKey]) break; // No more verses in this chapter

    const text = verses[verseKey];
    // Escape special regex characters in text
    const safeText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Find the verse pattern and replace translation div
    const pattern = new RegExp(
      `(<div class="verse" id="v${aya}">.*?<div class="tr">)[^<]+(</div>)`,
      's'
    );

    if (pattern.test(content)) {
      content = content.replace(pattern, `$1${text}$2`);
      updated++;
    }
  }

  if (updated > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, file: htmlFile, count: updated };
  }

  return { success: false, msg: `No verses updated` };
}

// Main
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║          INTEGRATING AMIR ZAIDAN TRANSLATION             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const verses = parseZaidan();
  console.log();

  let success = 0, failed = 0;

  for (let ch = 1; ch <= 114; ch++) {
    process.stdout.write(`  Surah ${String(ch).padStart(3, ' ')}: `);
    
    const result = updateSurahFile(ch, verses);
    
    if (result.success) {
      console.log(`✓ (${result.count} verses)`);
      success++;
    } else {
      console.log(`✗ ${result.msg}`);
      failed++;
    }
  }

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log(`  ✓ Updated: ${success}/114 Surahs`);
  console.log(`  ✗ Failed: ${failed}/114 Surahs`);
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  if (success === 114) {
    console.log('✅ ALL SURAHS SUCCESSFULLY UPDATED WITH ZAIDAN TRANSLATION\n');
  }
}

main().catch(console.error);
