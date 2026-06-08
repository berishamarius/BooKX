const fs = require('fs');
const path = require('path');

// NAVIGATION TRANSLATIONS
const NAV = {
  'Spanisch': { 
    back: 'Contraportada →', 
    intro: '← Prefacio',
    backCoverText: 'Que Allah nos guíe por todos los caminos rectos y nos envuelva con Su misericordia. Amén.'
  },
  'Französisch': { 
    back: 'Dos →', 
    intro: '← Préface',
    backCoverText: 'Qu\'Allah nous guide sur tous les chemins droits et nous enveloppe de Sa miséricorde. Amen.'
  },
  'Tagalog': { 
    back: 'Likod →', 
    intro: '← Pambungad',
    backCoverText: 'Nawa\'y gabayan tayo ng Allah sa lahat ng matuwid na landas at balutin tayo ng Kanyang awa. Amen.'
  },
  'Thailändisch': { 
    back: 'ปกหลัง →', 
    intro: '← คำนำ',
    backCoverText: 'ขออัลลอฮ์ทรงนำทางเราในทุกทางที่ถูกต้องและโอบล้อมเราด้วยความเมตตาของพระองค์ อามีน'
  },
  'Kasachisch': { 
    back: 'Артқы қаб →', 
    intro: '← Кіріспе',
    backCoverText: 'Алла бізді барлық тура жолдарға бағыттап, Өзінің мейіріміне бөлесін. Әмин.'
  }
};

console.log('🔧 Removing English from new Quran languages...\n');

for (const [lang, translations] of Object.entries(NAV)) {
  const langPath = path.join('AL-QURAN', 'Übersetzungen', lang);
  
  // FIX INDEX.HTML - Remove all English .rt spans
  const indexPath = path.join(langPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Remove English from Surah names: <span class="rt">English text</span>
    html = html.replace(/<span class="rt">.*?<\/span>/g, '');
    
    // Fix navigation
    html = html.replace(/Rückseite\s*→|Rückseite\s*&rarr;|Rückseite\s*&#8594;/g, translations.back);
    html = html.replace(/←\s*Vorwort|&larr;\s*Vorwort|&#8592;\s*Vorwort/g, translations.intro);
    
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log(`✓ ${lang}/index.html - Englisch entfernt, Navigation lokalisiert`);
  }
  
  // FIX INTRO.HTML
  const introPath = path.join(langPath, 'intro.html');
  if (fs.existsSync(introPath)) {
    let html = fs.readFileSync(introPath, 'utf-8');
    
    html = html.replace(/Rückseite\s*→|Rückseite\s*&rarr;|Rückseite\s*&#8594;/g, translations.back);
    html = html.replace(/←\s*Vorwort|&larr;\s*Vorwort|&#8592;\s*Vorwort/g, translations.intro);
    
    fs.writeFileSync(introPath, html, 'utf-8');
    console.log(`✓ ${lang}/intro.html - Navigation lokalisiert`);
  }
  
  // FIX BACK-COVER.HTML
  const backPath = path.join(langPath, 'back-cover.html');
  if (fs.existsSync(backPath)) {
    let html = fs.readFileSync(backPath, 'utf-8');
    
    html = html.replace(/Rückseite\s*→|Rückseite\s*&rarr;|Rückseite\s*&#8594;/g, translations.back);
    html = html.replace(/←\s*Vorwort|&larr;\s*Vorwort|&#8592;\s*Vorwort/g, translations.intro);
    
    // Replace German back cover text
    html = html.replace(/Möge Allah uns allen den geraden Weg weisen[\s\S]*?Amen\./g, translations.backCoverText);
    
    fs.writeFileSync(backPath, html, 'utf-8');
    console.log(`✓ ${lang}/back-cover.html - Text & Navigation lokalisiert`);
  }
  
  // FIX ALL SURAH FILES - Remove English
  const surenPath = path.join(langPath, 'suren');
  if (fs.existsSync(surenPath)) {
    const surahFiles = fs.readdirSync(surenPath).filter(f => f.endsWith('.html'));
    for (const file of surahFiles) {
      const filePath = path.join(surenPath, file);
      let html = fs.readFileSync(filePath, 'utf-8');
      
      // Remove English surah subtitles
      html = html.replace(/<span class="rt">.*?<\/span>/g, '');
      
      // Fix navigation
      html = html.replace(/Rückseite\s*→|Rückseite\s*&rarr;|Rückseite\s*&#8594;/g, translations.back);
      html = html.replace(/←\s*Vorwort|&larr;\s*Vorwort|&#8592;\s*Vorwort/g, translations.intro);
      
      fs.writeFileSync(filePath, html, 'utf-8');
    }
    console.log(`✓ ${lang}/suren/*.html - ${surahFiles.length} Dateien bereinigt`);
  }
}

// SYNC TO DIST
console.log('\n📦 Syncing to dist-alquran...');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyRecursive(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

for (const lang of Object.keys(NAV)) {
  const src = path.join('AL-QURAN', 'Übersetzungen', lang);
  const dest = path.join('dist-alquran', 'Übersetzungen', lang);
  copyRecursive(src, dest);
  console.log(`✓ ${lang} → dist-alquran`);
}

console.log('\n✅ FERTIG! Englisch entfernt, alles lokalisiert!');
