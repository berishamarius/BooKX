/**
 * FIX ALL NON-GERMAN BIBLE TRANSLATIONS
 * 1. Remove German Luther text from non-German languages
 * 2. Fix encoding issues
 * 3. Add mobile CSS
 * 4. Keep only Latin + correct translation
 */

const fs = require('fs');
const path = require('path');

const baseDir = 'dist-diebibel';
const languages = [
  'albanian', 'armenian', 'croatian', 'czech', 'dutch',
  'french', 'hungarian', 'italian', 'kjv', 'polish',
  'portuguese', 'romanian', 'russian', 'spanish',
  'swedish', 'syriac', 'tagalog', 'ukrainian'
];

console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║   FIXING ALL NON-GERMAN BIBLE TRANSLATIONS                 ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

let totalFixed = 0;
let totalFailed = 0;

for (const lang of languages) {
  const langDir = path.join(baseDir, lang, 'bücher');
  
  if (!fs.existsSync(langDir)) {
    console.log(`${lang.padEnd(15, ' ')}: ❌ Verzeichnis fehlt`);
    continue;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
  let fixed = 0;
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Remove ALL German Luther text lines
    content = content.replace(/<p class="base base-p">.*?<\/p>\s*/g, '');
    
    // 2. Remove German chapter labels
    content = content.replace(/<span class="chlbl chlbl-p">Das \d+\. Capitel<\/span>/g, '');
    
    // 3. Add mobile-responsive CSS if missing
    if (!content.includes('@media(max-width:600px)') && !content.includes('@media (max-width: 600px)')) {
      const mobileCSS = `\n/* MOBILE RESPONSIVE */\n@media(max-width:600px){\n  .blatin{font-size:1.8rem !important;}\n  .base{font-size:1rem !important;}\n  .tra,.trans{font-size:.88rem !important;line-height:1.7 !important;}\n  .content{padding:16px 18px 60px !important;margin:0 !important;border-left:none !important;border-right:none !important;border-radius:0 !important;}\n  .chrom,.ch-roman{font-size:1.8rem !important;}\n  .bhead,.book-header{padding:24px 20px 20px !important;}\n  .bnav,.nav-bar{flex-wrap:wrap !important;padding:8px 12px !important;}\n  .bnav a,.nav-bar a{font-size:.65rem !important;padding:5px 10px !important;}\n  .book-name-latin{font-size:2rem !important;}\n  .chapter-marker{flex-direction:column !important;text-align:center !important;}\n  .verse-block{display:block !important;}\n  .verse-num-col{display:inline-block !important;margin-right:8px !important;}\n}\n`;
      
      // Insert before closing </style>
      content = content.replace('</style>', mobileCSS + '</style>');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    fixed++;
  }
  
  console.log(`${lang.padEnd(15, ' ')}: ✅ ${fixed} Dateien repariert`);
  totalFixed += fixed;
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n✅ Insgesamt: ${totalFixed} Dateien repariert\n`);
console.log('Was wurde gefixt:');
console.log('  1. ✅ Deutscher Luther-Text entfernt');
console.log('  2. ✅ Deutsche Kapitel-Labels entfernt');
console.log('  3. ✅ Mobile-Responsive CSS hinzugefügt\n');
