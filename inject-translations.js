const fs = require('fs');
const path = require('path');

const NEW_LANGS = {
  Spanisch: 'es',
  Französisch: 'fr',
  Tagalog: 'tl',
  Thailändisch: 'th',
  Kasachisch: 'kk',
};

// Lese Cache für jede Sprache (von overhaul.js generiert)
function readCache(langCode) {
  const cacheDir = `AL-QURAN/cache`;
  const cache = {};
  
  // Lese alle 114 Suren-Cache-Dateien
  for (let i = 1; i <= 114; i++) {
    const num = String(i).padStart(3, '0');
    const cacheFile = path.join(cacheDir, `${langCode}_${num}.json`);
    
    if (fs.existsSync(cacheFile)) {
      try {
        const data = fs.readFileSync(cacheFile, 'utf8');
        const json = JSON.parse(data);
        cache[i] = json;
      } catch (e) {
        console.log(`⚠ Cache not found: ${cacheFile}`);
      }
    }
  }
  
  return cache;
}

// Ersetze .tr divs mit Übersetzungen
function updateVerseTranslations(htmlContent, surahNum, translations) {
  if (!translations || !translations.verses) return htmlContent;
  
  let updated = htmlContent;
  
  // Für jeden Vers
  for (let i = 0; i < translations.verses.length; i++) {
    const verseNum = i + 1;
    const verseId = `id="v${verseNum}"`;
    
    if (updated.includes(verseId)) {
      const translatedText = translations.verses[i]?.text || '';
      
      if (translatedText) {
        // Pattern: <div class="tr">...</div> nach dem arabischen Text
        const pattern = new RegExp(
          `(<div class="verse"[^>]*id="v${verseNum}"[^>]*>\\s*<div class="ar">[^<]*<\\/div>\\s*<div class="vd"><span><\\/span><\\/div>\\s*)<div class="tr">[^<]*<\\/div>`,
          'g'
        );
        
        updated = updated.replace(pattern, `$1<div class="tr">${translatedText}</div>`);
      }
    }
  }
  
  return updated;
}

let total = 0;

// Für jede neue Sprache
for (const [langName, langCode] of Object.entries(NEW_LANGS)) {
  console.log(`\n📖 ${langName} (${langCode})...`);
  
  // Lade den Cache für diese Sprache
  const cache = readCache(langCode);
  
  if (Object.keys(cache).length === 0) {
    console.log(`⚠ No cache found for ${langCode}! Skipping...`);
    continue;
  }
  
  // Für alle 114 Suren
  for (let surah = 1; surah <= 114; surah++) {
    const surahNum = String(surah).padStart(3, '0');
    const surahFile = `AL-QURAN/Übersetzungen/${langName}/suren/${surahNum}-*.html`;
    
    // Finde die tatsächliche Datei (Namen variieren)
    const surenDir = path.join(`AL-QURAN/Übersetzungen`, langName, 'suren');
    const files = fs.readdirSync(surenDir).filter(f => f.startsWith(surahNum));
    
    if (files.length === 0) {
      console.log(`  ⚠ Surah ${surahNum} not found`);
      continue;
    }
    
    const surenPath = path.join(surenDir, files[0]);
    
    try {
      let html = fs.readFileSync(surenPath, 'utf8');
      const translations = cache[surah];
      
      if (translations) {
        html = updateVerseTranslations(html, surah, translations);
        fs.writeFileSync(surenPath, html, 'utf8');
        console.log(`  ✓ Surah ${surahNum}`);
        total++;
      }
    } catch (e) {
      console.log(`  ✗ Error in Surah ${surahNum}: ${e.message}`);
    }
  }
}

console.log(`\n✅ ${total} Surah files updated with correct translations`);
