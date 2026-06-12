const fs = require('fs');
const path = require('path');
const https = require('https');

// Bubenheim & Elyas translation ID auf quran.com API
const TRANSLATION_ID = 27;
const API_BASE = 'https://api.quran.com/api/v4';

async function fetchTranslations() {
  console.log('Hole Bubenheim-Übersetzung von API...');
  
  const translations = {};
  let totalVerses = 0;
  
  // Sure-Vers-Anzahl für jede Sure
  const verseCounts = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
  
  // Hole alle 114 Suren
  for (let surah = 1; surah <= 114; surah++) {
    process.stdout.write(`\rSure ${surah}/114...`);
    
    const url = `${API_BASE}/quran/translations/${TRANSLATION_ID}?chapter_number=${surah}`;
    const data = await fetchURL(url);
    
    if (data && data.translations) {
      for (let i = 0; i < data.translations.length; i++) {
        const verse = data.translations[i];
        const verseNum = i + 1;
        const key = `${surah}:${verseNum}`;
        
        // Dekodiere HTML entities
        const text = verse.text
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        
        translations[key] = text;
        totalVerses++;
      }
    }
    
    // Rate limiting
    await sleep(80);
  }
  
  console.log(`\n✓ ${totalVerses} Verse geladen`);
  return translations;
}

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateHTMLFile(filePath, translations) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Extrahiere Suren-Nummer aus Dateiname z.B. "001-Al-Fatihah.html" -> "1"
  const match = path.basename(filePath).match(/^(\d+)-/);
  if (!match) return false;
  
  const surahNum = parseInt(match[1], 10);
  
  // Finde alle <div class="verse" id="vX"> Blöcke und ersetze den Übersetzungstext
  const verseRegex = /<div class="verse" id="v(\d+)">([\s\S]*?)<\/div>\s*(?=<div class="verse"|<\/main>)/g;
  
  content = content.replace(verseRegex, (fullMatch, verseNum, verseContent) => {
    const key = `${surahNum}:${verseNum}`;
    const originalTranslation = translations[key];
    
    if (!originalTranslation) {
      return fullMatch;
    }
    
    // Ersetze den Text innerhalb von <div class="tr">...</div>
    const trRegex = /<div class="tr">([^<]+)<\/div>/;
    const newVerseContent = verseContent.replace(trRegex, (trMatch, oldText) => {
      const cleanOld = oldText.trim();
      const cleanNew = originalTranslation.trim();
      
      if (cleanOld !== cleanNew) {
        changed = true;
        return `<div class="tr">${originalTranslation}</div>`;
      }
      return trMatch;
    });
    
    return `<div class="verse" id="v${verseNum}">${newVerseContent}</div>\n`;
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  console.log('=== RESTORE ORIGINAL BUBENHEIM TRANSLATION ===\n');
  
  // 1. API-Daten holen
  const translations = await fetchTranslations();
  
  // 2. Deutsche HTML-Dateien updaten
  console.log('\nUpdate deutsche Verse-Dateien...');
  
  const germanDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen', 'Deutsch', 'suren');
  const files = fs.readdirSync(germanDir).filter(f => f.endsWith('.html'));
  
  let updated = 0;
  let alreadyOk = 0;
  
  for (const file of files) {
    const filePath = path.join(germanDir, file);
    if (updateHTMLFile(filePath, translations)) {
      updated++;
    } else {
      alreadyOk++;
    }
  }
  
  console.log(`\n✓ ${updated} Dateien aktualisiert`);
  console.log(`✓ ${alreadyOk} Dateien bereits korrekt`);
  console.log(`✓ GESAMT: ${files.length} Dateien`);
  
  // 3. Overhaul-Skript löschen
  const overhaulScript = path.join(__dirname, 'AL-QURAN', 'overhaul.js');
  if (fs.existsSync(overhaulScript)) {
    fs.unlinkSync(overhaulScript);
    console.log('\n✓ overhaul.js gelöscht');
  }
  
  console.log('\n=== FERTIG ===');
}

main().catch(err => {
  console.error('FEHLER:', err);
  process.exit(1);
});
