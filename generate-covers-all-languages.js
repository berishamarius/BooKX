/**
 * GENERATE ALL 38 BOOK COVERS
 * Erstellt SVG-basierte Covers für alle 19 Quran + 19 Bible Übersetzungen
 * 
 * Design Pattern:
 * - Arabisch: Scheherazade Bold, 25px, Gold (#C9A84C)
 * - Englisch: Georgia, 15px, Cream (#F0E6C0)
 * - Hintergrund: Dunkelgrün (#0B2414)
 * - Abstand: 12pt (16px bei 96dpi)
 */

const fs = require('fs');
const path = require('path');

const LANGUAGES = {
  quran: [
    { lang: 'Deutsch', ar: 'العربية', translator: 'Bubenheim', hex: 'de' },
    { lang: 'Englisch', ar: 'English', translator: 'Saheeh Intl.', hex: 'en' },
    { lang: 'Albanisch', ar: 'Shqip', translator: 'Ahmeti', hex: 'sq' },
    { lang: 'Bengalisch', ar: 'বাংলা', translator: 'Tawheed', hex: 'bn' },
    { lang: 'Bosnisch', ar: 'Bosanski', translator: 'Mehanović', hex: 'bs' },
    { lang: 'Chinesisch', ar: '中文', translator: 'Ma Jian', hex: 'zh' },
    { lang: 'Französisch', ar: 'Français', translator: 'Montada', hex: 'fr' },
    { lang: 'Hausa', ar: 'Hausa', translator: 'Gumi', hex: 'ha' },
    { lang: 'Hindi', ar: 'हिन्दी', translator: 'al-Umari', hex: 'hi' },
    { lang: 'Indonesisch', ar: 'Bahasa Indonesia', translator: 'KFQC', hex: 'id' },
    { lang: 'Kasachisch', ar: 'Қазақ', translator: 'Altai', hex: 'kk' },
    { lang: 'Persisch', ar: 'فارسی', translator: 'IslamHouse', hex: 'fa' },
    { lang: 'Russisch', ar: 'Русский', translator: 'Abu Adel', hex: 'ru' },
    { lang: 'Spanisch', ar: 'Español', translator: 'Isa Garcia', hex: 'es' },
    { lang: 'Tagalog', ar: 'Tagalog', translator: 'Dar Al-Salam', hex: 'tl' },
    { lang: 'Thailändisch', ar: 'ไทย', translator: 'Zakaria', hex: 'th' },
    { lang: 'Türkisch', ar: 'Türkçe', translator: 'Diyanet', hex: 'tr' },
    { lang: 'Urdu', ar: 'اردو', translator: 'Maududi', hex: 'ur' },
    { lang: 'Uygurisch', ar: 'ئۇيغۇرچە', translator: 'Saleh', hex: 'ug' }
  ],
  bible: [
    { lang: 'English', ar: 'English', translator: 'KJV 1611', hex: 'en' },
    { lang: 'Deutsch', ar: 'Deutsch', translator: 'Textbibel 1899', hex: 'de' },
    { lang: 'Français', ar: 'Français', translator: 'Crampon 1923', hex: 'fr' },
    { lang: 'Español', ar: 'Español', translator: 'RV 1909', hex: 'es' },
    { lang: 'Português', ar: 'Português', translator: 'Bíblia Livre', hex: 'pt' },
    { lang: 'Polski', ar: 'Polski', translator: 'Gdańska 1632', hex: 'pl' },
    { lang: 'Русский', ar: 'Русский', translator: 'Synodal 1876', hex: 'ru' },
    { lang: 'Hrvatski', ar: 'Hrvatski', translator: 'Šarića', hex: 'hr' },
    { lang: 'Nederlands', ar: 'Nederlands', translator: 'SV 1637', hex: 'nl' },
    { lang: 'Magyar', ar: 'Magyar', translator: 'Károli 1590', hex: 'hu' },
    { lang: 'Čeština', ar: 'Čeština', translator: 'Kralická 1613', hex: 'cs' },
    { lang: 'Svenska', ar: 'Svenska', translator: 'Svenska Bibeln', hex: 'sv' },
    { lang: 'Tagalog', ar: 'Tagalog', translator: 'Ang Biblia', hex: 'tl' },
    { lang: 'Українська', ar: 'Українська', translator: 'Огієнко', hex: 'uk' },
    { lang: 'Shqip', ar: 'Shqip', translator: 'UFSHB', hex: 'sq' },
    { lang: 'Română', ar: 'Română', translator: 'Cornilescu', hex: 'ro' },
    { lang: 'Italiano', ar: 'Italiano', translator: 'Riveduta', hex: 'it' },
    { lang: 'ܣܘܪܝܬ', ar: 'ܣܘܪܝܬ', translator: 'Peshitta', hex: 'syr' },
    { lang: 'Հայերեն', ar: 'Հայերեն', translator: 'Eastern', hex: 'hy' }
  ]
};

const COLORS = {
  darkGreen: '#0B2414',
  gold: '#C9A84C',
  cream: '#F0E6C0',
  white: '#FFFFFF'
};

const FONTS = {
  arabic: 'Scheherazade',
  latin: 'Georgia',
  fallback: 'serif'
};

/**
 * Erstellt SVG Cover für eine Sprache
 */
function generateCoverSVG(type, language) {
  const width = 1200;
  const height = 1600;
  const padding = 80;
  const spacing = 16; // 12pt ≈ 16px
  
  const isRTL = ['العربية', 'فارسی', 'اردو', 'ئۇيغۇرچە', 'ܣܘܪܝܬ'].includes(language.ar);
  
  // SVG Header
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Scheherazade:wght@400;700&family=Georgia&display=swap');
      
      .bg { fill: ${COLORS.darkGreen}; }
      .arabic-title { font-family: '${FONTS.arabic}', ${FONTS.fallback}; font-size: 25px; font-weight: bold; fill: ${COLORS.gold}; text-anchor: ${isRTL ? 'end' : 'start'}; }
      .translator { font-family: '${FONTS.latin}', ${FONTS.fallback}; font-size: 15px; fill: ${COLORS.cream}; text-anchor: ${isRTL ? 'end' : 'start'}; }
      .divider { stroke: ${COLORS.gold}; stroke-width: 2; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect class="bg" width="${width}" height="${height}"/>
  
  <!-- Decorative Top Line -->
  <line class="divider" x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}"/>
  
  <!-- Arabic Title (Center Top) -->
  <text class="arabic-title" x="${isRTL ? width - padding : padding}" y="${padding + 100}" text-anchor="${isRTL ? 'end' : 'start'}">
    ${language.ar}
  </text>
  
  <!-- Spacing Line -->
  <line class="divider" x1="${padding}" y1="${padding + 140}" x2="${width - padding}" y2="${padding + 140}"/>
  
  <!-- Translator Name (Center) -->
  <text class="translator" x="${isRTL ? width - padding : padding}" y="${height / 2}" text-anchor="${isRTL ? 'end' : 'start'}">
    ${language.translator}
  </text>
  
  <!-- Language Name (Bottom) -->
  <text class="translator" x="${isRTL ? width - padding : padding}" y="${height - padding - 60}" text-anchor="${isRTL ? 'end' : 'start'}">
    ${language.lang}
  </text>
  
  <!-- Decorative Bottom Line -->
  <line class="divider" x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}"/>
  
  <!-- Copyright -->
  <text style="font-family: ${FONTS.latin}, ${FONTS.fallback}; font-size: 10px; fill: ${COLORS.cream}; opacity: 0.6;" x="${width / 2}" y="${height - 20}" text-anchor="middle">
    © 2026 BooKX - ${type === 'quran' ? 'Al-Quran' : 'Bible'} Translations
  </text>
</svg>`;

  return svg;
}

/**
 * Erstellt HTML Cover für eine Sprache (alternative Variante)
 */
function generateCoverHTML(type, language) {
  const isRTL = ['العربية', 'فارسی', 'اردو', 'ئۇيغۇرچە', 'ܣܘܪܝܬ'].includes(language.ar);
  
  return `<!DOCTYPE html>
<html lang="${language.hex}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${language.lang} - ${type === 'quran' ? 'Al-Quran' : 'Bible'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade:wght@400;700&family=Georgia&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #0B2414 0%, #0f2f1a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Georgia, serif;
      color: #F0E6C0;
      padding: 80px;
      direction: ${isRTL ? 'rtl' : 'ltr'};
    }
    
    .cover {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      text-align: center;
    }
    
    .header {
      border-top: 2px solid #C9A84C;
      padding-top: 16px;
      width: 100%;
    }
    
    .arabic-title {
      font-family: Scheherazade, serif;
      font-size: 25px;
      font-weight: bold;
      color: #C9A84C;
      margin-bottom: 16px;
    }
    
    .divider {
      width: 100%;
      height: 2px;
      background: #C9A84C;
      margin: 16px 0;
    }
    
    .middle {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    
    .translator {
      font-size: 15px;
      color: #F0E6C0;
      margin-bottom: 12pt;
      letter-spacing: 0.5px;
    }
    
    .language {
      font-size: 12px;
      color: #F0E6C0;
      opacity: 0.8;
    }
    
    .footer {
      border-bottom: 2px solid #C9A84C;
      padding-bottom: 16px;
      width: 100%;
      font-size: 10px;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="header">
      <div class="arabic-title">${language.ar}</div>
    </div>
    
    <div class="middle">
      <div class="translator">${language.translator}</div>
    </div>
    
    <div class="footer">
      <div class="language">${language.lang}</div>
      <div style="margin-top: 12pt;">© 2026 BooKX - ${type === 'quran' ? 'Al-Quran' : 'Bible'} Translations</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generiert alle Covers
 */
async function generateAllCovers() {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║      GENERATING ALL 38 BOOK COVERS                         ║');
  console.log('║      Quran (19) + Bible (19)                               ║');
  console.log('╚═════════════════════════════════════════════════════════════╝\n');

  let count = 0;

  // Quran Covers
  console.log('📖 QURAN COVERS (19 Sprachen):\n');
  for (const lang of LANGUAGES.quran) {
    const dir = path.join(__dirname, 'dist-alquran', 'Übersetzungen', lang.lang.charAt(0).toUpperCase() + lang.lang.slice(1));
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // SVG Version
    const svgPath = path.join(dir, 'cover-template.svg');
    const svgContent = generateCoverSVG('quran', lang);
    fs.writeFileSync(svgPath, svgContent);

    // HTML Version
    const htmlPath = path.join(dir, 'cover-design.html');
    const htmlContent = generateCoverHTML('quran', lang);
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`   ✓ ${lang.lang.padEnd(18)} (${lang.translator})`);
    count++;
  }

  // Bible Covers
  console.log('\n📖 BIBLE COVERS (19 Sprachen):\n');
  for (const lang of LANGUAGES.bible) {
    const dir = path.join(__dirname, 'dist-diebibel', lang.lang);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // SVG Version
    const svgPath = path.join(dir, 'cover-template.svg');
    const svgContent = generateCoverSVG('bible', lang);
    fs.writeFileSync(svgPath, svgContent);

    // HTML Version
    const htmlPath = path.join(dir, 'cover-design.html');
    const htmlContent = generateCoverHTML('bible', lang);
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`   ✓ ${lang.lang.padEnd(25)} (${lang.translator})`);
    count++;
  }

  console.log('\n═════════════════════════════════════════════════════════════\n');
  console.log(`✅ ${count} COVERS GENERATED!\n`);
  console.log('📁 Ausgabe:');
  console.log('   • dist-alquran/Übersetzungen/[SPRACHE]/cover-template.svg');
  console.log('   • dist-alquran/Übersetzungen/[SPRACHE]/cover-design.html');
  console.log('   • dist-diebibel/[SPRACHE]/cover-template.svg');
  console.log('   • dist-diebibel/[SPRACHE]/cover-design.html\n');
  
  console.log('📊 DESIGN PATTERN VERWENDET:\n');
  console.log('   • Arabisch: Scheherazade Bold, 25px, Gold (#C9A84C)');
  console.log('   • Englisch: Georgia, 15px, Cream (#F0E6C0)');
  console.log('   • Spacing: 12pt (16px)');
  console.log('   • Hintergrund: Dunkelgrün (#0B2414)\n');

  console.log('═════════════════════════════════════════════════════════════\n');
  console.log('🎨 Alle Templates sind ready zum Anpassen für Koranseiten!\n');
}

// Ausführen
generateAllCovers().catch(console.error);
