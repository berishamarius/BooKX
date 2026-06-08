const fs = require('fs');
const path = require('path');

// === QURAN NAVIGATION ===
const QURAN_NAV = {
  'Spanisch': { back: 'Contraportada →', intro: '← Prefacio' },
  'Französisch': { back: 'Dos →', intro: '← Préface' },
  'Tagalog': { back: 'Likod →', intro: '← Pambungad' },
  'Thailändisch': { back: 'ปกหลัง →', intro: '← คำนำ' },
  'Kasachisch': { back: 'Артқы қаб →', intro: '← Кіріспе' }
};

// === BIBLE NAVIGATION ===
const BIBLE_NAV = {
  'syriac': { back: 'Back Cover →', intro: '← Preface' },
  'armenian': { back: 'Back Cover →', intro: '← Preface' }
};

console.log('🔧 Fixing Quran Navigation...');

// Fix Quran
for (const [lang, nav] of Object.entries(QURAN_NAV)) {
  const langPath = path.join('AL-QURAN', 'Übersetzungen', lang);
  
  const files = ['index.html', 'intro.html', 'back-cover.html'];
  
  for (const file of files) {
    const filePath = path.join(langPath, file);
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Replace back cover link
    html = html.replace(/Rückseite\s*&rarr;|Rückseite\s*→/g, nav.back);
    html = html.replace(/Rückseite\s*&#8594;/g, nav.back);
    
    // Replace preface link
    html = html.replace(/&larr;\s*Vorwort|←\s*Vorwort/g, nav.intro);
    html = html.replace(/&#8592;\s*Vorwort/g, nav.intro);
    
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ ${lang}/${file}`);
  }
}

console.log('🔧 Fixing Bible Navigation...');

// Fix Bible  
for (const [lang, nav] of Object.entries(BIBLE_NAV)) {
  const langPath = path.join('CATHOLIC-BIBLE', 'Übersetzungen', lang);
  
  const files = ['index.html', 'back-cover.html'];
  
  for (const file of files) {
    const filePath = path.join(langPath, file);
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Replace back cover link
    html = html.replace(/Rückseite\s*&rarr;|Rückseite\s*→/g, nav.back);
    html = html.replace(/Rückseite\s*&#8594;/g, nav.back);
    
    // Replace preface link
    html = html.replace(/&larr;\s*Vorwort|←\s*Vorwort/g, nav.intro);
    html = html.replace(/&#8592;\s*Vorwort/g, nav.intro);
    
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ ${lang}/${file}`);
  }
}

// Sync to dist using Node.js file copy
console.log('\n📦 Syncing to dist...');

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

copyRecursive('AL-QURAN/Übersetzungen', 'dist-alquran/Übersetzungen');
console.log('✓ Quran synced to dist-alquran');

copyRecursive('CATHOLIC-BIBLE/Übersetzungen/syriac', 'dist-diebibel/syriac');
console.log('✓ Syriac synced to dist-diebibel');

copyRecursive('CATHOLIC-BIBLE/Übersetzungen/armenian', 'dist-diebibel/armenian');
console.log('✓ Armenian synced to dist-diebibel');

console.log('\n✅ Navigation fixed everywhere!');
