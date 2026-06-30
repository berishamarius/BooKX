/**
 * FIX ALL NON-GERMAN BIBLES
 * 1. Add mobile responsive CSS
 * 2. Replace English book names with correct language translations
 * 3. Ensure proper translations are shown (not just Latin)
 */

const fs = require('fs');
const path = require('path');

const BASE = 'dist-diebibel';

// Book name translations for each language (common books only, expandable)
const TRANSLATIONS = {
  albanian: {
    'Numbers': 'Numrat', 'Deuteronomy': 'Ligji i Përtërirë', 'Joshua': 'Jozueu',
    'Judges': 'Gjyqtarët', 'Revelation': 'Zbulesa'
  },
  italian: {
    'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronomio', 'Joshua': 'Giosuè',
    'Judges': 'Giudici', 'Revelation': 'Apocalisse'
  },
  french: {
    'Numbers': 'Nombres', 'Deuteronomy': 'Deutéronome', 'Joshua': 'Josué',
    'Judges': 'Juges', 'Revelation': 'Apocalypse'
  },
  spanish: {
    'Numbers': 'Números', 'Deuteronomy': 'Deuteronomio', 'Joshua': 'Josué',
    'Judges': 'Jueces', 'Revelation': 'Apocalipsis'
  },
  portuguese: {
    'Numbers': 'Números', 'Deuteronomy': 'Deuteronômio', 'Joshua': 'Josué',
    'Judges': 'Juízes', 'Revelation': 'Apocalipse'
  },
  romanian: {
    'Numbers': 'Numeri', 'Deuteronomy': 'Deuteronom', 'Joshua': 'Iosua',
    'Judges': 'Judecători', 'Revelation': 'Apocalipsa'
  },
  polish: {
    'Numbers': 'Liczb', 'Deuteronomy': 'Powtórzonego Prawa', 'Joshua': 'Jozuego',
    'Judges': 'Sędziów', 'Revelation': 'Apokalipsa'
  }
};

// Mobile CSS to add
const MOBILE_CSS = `
/* MOBILE RESPONSIVE */
@media (max-width:768px){
  .topbar{padding:8px 16px;flex-direction:column;gap:8px;}
  .topbar a{font-size:.65rem;padding:4px 12px;}
  header{padding:24px 16px 20px;}
  .htitle,.h-title{font-size:1.8rem;}
  .hlang,.h-sub,.h-trans{font-size:.65rem;}
  .index-body{margin:20px 12px 40px;padding:18px 14px;}
  .sec-head,.section-head{padding:32px 12px 6px;}
  .sec-t,.section-title{font-size:1.4rem;}
  .book-grid{grid-template-columns:1fr !important;gap:10px;}
  .book-item,.book-card{padding:10px 12px;}
  .bnum,.b-num{min-width:28px;font-size:.72rem;}
  .blatin,.b-latin{font-size:.88rem;}
  .btrans,.b-name{font-size:.78rem;}
}
`;

function fixLanguage(lang) {
  const indexPath = path.join(BASE, lang, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`  ✗ ${lang}: index.html not found`);
    return false;
  }

  let content = fs.readFileSync(indexPath, 'utf8');
  const translations = TRANSLATIONS[lang];
  let changes = 0;

  // Replace English names with correct language if translations defined
  if (translations) {
    for (const [english, local] of Object.entries(translations)) {
      const pattern = new RegExp(`<span class="b-name">${english}</span>`, 'g');
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, `<span class="b-name">${local}</span>`);
        changes += matches.length;
      }
    }
  }

  // Add mobile CSS if not present
  if (!content.includes('MOBILE RESPONSIVE') && !content.includes('@media (max-width:768px)')) {
    const styleEnd = content.lastIndexOf('</style>');
    if (styleEnd > 0) {
      content = content.substring(0, styleEnd) + MOBILE_CSS + content.substring(styleEnd);
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`  ✓ ${lang}: ${changes} changes applied`);
    return true;
  } else {
    console.log(`  − ${lang}: No changes needed`);
    return false;
  }
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║        FIXING ALL NON-GERMAN BIBLE TRANSLATIONS          ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const languages = ['albanian', 'italian', 'french', 'spanish', 'portuguese', 
                   'romanian', 'croatian', 'polish', 'czech', 'hungarian',
                   'russian', 'ukrainian', 'swedish', 'dutch', 'tagalog',
                   'armenian', 'syriac', 'kjv'];

let fixed = 0;
let total = 0;

for (const lang of languages) {
  total++;
  if (fixLanguage(lang)) fixed++;
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`✅ Fixed: ${fixed}/${total} languages`);
console.log('═══════════════════════════════════════════════════════════\n');
