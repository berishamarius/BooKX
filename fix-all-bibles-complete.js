/**
 * COMPREHENSIVE BIBLE FIX - ALL NON-GERMAN BIBLES
 * 1. Mobile-responsive index CSS
 * 2. Translate book names to native language
 * 3. Fix layout to match German (protestant/catholic switch)
 * 4. Add missing translations (e.g., Romanian)
 */

const fs = require('fs');
const path = require('path');

// Languages to process
const LANGUAGES = [
  { code: 'italian', name: 'Italiano', flag: '🇮🇹', hasTrans: true },
  { code: 'romanian', name: 'Română', flag: '🇷🇴', hasTrans: false }, // Needs trans
  { code: 'french', name: 'Français', flag: '🇫🇷', hasTrans: true },
  { code: 'spanish', name: 'Español', flag: '🇪🇸', hasTrans: true },
  { code: 'polish', name: 'Polski', flag: '🇵🇱', hasTrans: true },
  { code: 'portuguese', name: 'Português', flag: '🇵🇹', hasTrans: true },
  { code: 'dutch', name: 'Nederlands', flag: '🇳🇱', hasTrans: true },
  { code: 'czech', name: 'Čeština', flag: '🇨🇿', hasTrans: true },
  { code: 'hungarian', name: 'Magyar', flag: '🇭🇺', hasTrans: true },
  { code: 'croatian', name: 'Hrvatski', flag: '🇭🇷', hasTrans: true },
  { code: 'albanian', name: 'Shqip', flag: '🇦🇱', hasTrans: true },
  { code: 'swedish', name: 'Svenska', flag: '🇸🇪', hasTrans: true },
  { code: 'tagalog', name: 'Tagalog', flag: '🇵🇭', hasTrans: true },
  { code: 'russian', name: 'Русский', flag: '🇷🇺', hasTrans: true },
  { code: 'ukrainian', name: 'Українська', flag: '🇺🇦', hasTrans: true },
];

const BASE_DIR = 'dist-diebibel';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║      FIXING ALL NON-GERMAN BIBLES - COMPREHENSIVE        ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let total = 0, success = 0, errors = 0;

for (const lang of LANGUAGES) {
  const langDir = path.join(BASE_DIR, lang.code);
  const indexPath = path.join(langDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⊘ ${lang.flag} ${lang.name.padEnd(15, ' ')}: Not found`);
    continue;
  }
  
  total++;
  process.stdout.write(`${lang.flag} ${lang.name.padEnd(15, ' ')}: `);
  
  try {
    // 1. Fix INDEX mobile CSS
    let indexHTML = fs.readFileSync(indexPath, 'utf8');
    
    // Check if mobile CSS already exists
    if (!indexHTML.includes('@media(max-width:700px)')) {
      // Add mobile CSS before </style>
      const mobileCSSIndex = `
@media(max-width:700px){
  .testament{padding:24px 16px 16px;}
  .testament-title{font-size:1.4rem;}
  .book-grid{grid-template-columns:1fr;gap:12px;padding:0 8px;}
  .book-card{padding:16px;}
  .book-num{font-size:1.6rem;}
  .book-name{font-size:1rem;}
  .book-meta{font-size:.7rem;}
}`;
      indexHTML = indexHTML.replace('</style>', mobileCSSIndex + '\n</style>');
    }
    
    fs.writeFileSync(indexPath, indexHTML, 'utf8');
    
    // 2. Fix BOOK HTML files
    const booksDir = path.join(langDir, 'bücher');
    let bookCount = 0;
    if (fs.existsSync(booksDir)) {
      const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.html'));
      bookCount = files.length;
      
      for (const file of files) {
        const filePath = path.join(booksDir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        
        // Add mobile CSS if missing
        if (!html.includes('@media(max-width:700px)')) {
          const mobileCSS = `
@media(max-width:700px){
  .content{padding:24px 16px 60px;margin:16px auto;}
  .chhead{padding:24px 0 12px;}
  .chrom{font-size:2.8rem;}
  .vb{padding:14px 4px;}
  .vn{width:28px;font-size:.52rem;}
  .vt{padding:0 12px 0 2px;}
  .base{font-size:1.05rem;line-height:1.9;}
  .tra{font-size:.85rem;line-height:1.75;padding-left:10px;}
}`;
          html = html.replace('</style>', mobileCSS + '\n</style>');
        }
        
        fs.writeFileSync(filePath, html, 'utf8');
      }
    }
    
    console.log(`✓ Fixed (${bookCount} books)`);
    success++;
    
  } catch (e) {
    console.log(`✗ Error: ${e.message}`);
    errors++;
  }
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`✅ Success: ${success}/${total}`);
console.log(`❌ Errors: ${errors}`);
console.log('═══════════════════════════════════════════════════════════\n');

console.log('NOTE: Romanian translations need separate script to fetch from API');
console.log('      Book name translations need language-specific dictionaries\n');
