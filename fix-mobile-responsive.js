// fix-mobile-responsive.js
// Fixes mobile display issues for Bible and Quran
const fs = require('fs');
const path = require('path');

const MOBILE_CSS_INJECTION = `
<style id="kx-mobile-fix">
/* === KX MOBILE RESPONSIVE FIX === */
@media (max-width: 768px) {
  /* Index pages */
  .index-body {
    margin: 16px auto !important;
    padding: 24px 16px 40px !important;
    max-width: 100% !important;
  }
  
  .toc-item {
    padding: 12px 8px !important;
    flex-wrap: wrap;
  }
  
  .tlat {
    font-size: 1rem !important;
  }
  
  .tname {
    font-size: 0.88rem !important;
  }
  
  .tdots {
    display: none !important;
  }
  
  .tchap {
    font-size: 0.65rem !important;
    margin-left: auto;
  }
  
  /* Book header */
  .bhead {
    padding: 24px 16px !important;
  }
  
  .blatin {
    font-size: 1.6rem !important;
  }
  
  /* Content area */
  .content {
    margin: 0 !important;
    padding: 24px 16px 60px !important;
    border-left: none !important;
    border-right: none !important;
    border-radius: 0 !important;
  }
  
  /* Verses */
  .vb, .verse {
    padding: 16px 4px !important;
  }
  
  .vnum {
    min-width: 32px !important;
    font-size: 0.7rem !important;
  }
  
  .base {
    font-size: 1rem !important;
    line-height: 1.7 !important;
  }
  
  .tra {
    font-size: 0.84rem !important;
  }
  
  /* Quran specific */
  .list-rows {
    width: 96vw !important;
    padding: 16px 8px 32px !important;
  }
  
  .ra {
    font-size: 1.5rem !important;
    min-width: 56px !important;
  }
  
  .rs {
    font-size: 0.9rem !important;
  }
  
  .rt {
    font-size: 0.75rem !important;
  }
  
  /* Navigation */
  .topbar, nav {
    padding: 8px 12px !important;
    flex-wrap: wrap;
  }
  
  .topbar a, nav a {
    font-size: 0.6rem !important;
    padding: 4px 12px !important;
  }
  
  /* Headers */
  header {
    padding: 24px 16px 20px !important;
  }
  
  .htitle {
    font-size: 1.8rem !important;
  }
  
  /* Confession switcher */
  .conf-bar {
    padding: 12px 8px 0 !important;
    gap: 0 !important;
  }
  
  .conf-btn {
    padding: 7px 12px !important;
    font-size: 0.58rem !important;
  }
  
  /* Section headers */
  .sec-head {
    padding: 32px 0 8px !important;
  }
  
  .sec-t {
    font-size: 1.6rem !important;
  }
  
  /* Copy/Share buttons */
  .verse-tools {
    gap: 4px !important;
    font-size: 0.65rem !important;
  }
  
  .verse-copy-btn, .verse-share-btn {
    padding: 3px 6px !important;
    font-size: 0.65rem !important;
  }
}

@media (max-width: 480px) {
  .toc-item {
    padding: 10px 6px !important;
  }
  
  .tnr {
    min-width: 40px !important;
    font-size: 0.65rem !important;
  }
  
  .tlat {
    font-size: 0.9rem !important;
  }
  
  .tname {
    font-size: 0.8rem !important;
    margin-left: 8px !important;
  }
  
  .content {
    padding: 16px 12px 40px !important;
  }
  
  .blatin {
    font-size: 1.4rem !important;
  }
  
  .htitle {
    font-size: 1.5rem !important;
  }
}
</style>
`;

function injectMobileCSS(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already injected
    if (content.includes('id="kx-mobile-fix"')) {
      return false;
    }
    
    // Inject before </head>
    const headCloseIndex = content.indexOf('</head>');
    if (headCloseIndex !== -1) {
      content = content.slice(0, headCloseIndex) + MOBILE_CSS_INJECTION + '\n' + content.slice(headCloseIndex);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (e) {
    console.error(`Error in ${filePath}:`, e.message);
    return false;
  }
}

function processDirectory(dir, filePattern = /\.html$/) {
  let count = 0;
  
  if (!fs.existsSync(dir)) {
    console.log(`⚠ ${dir} nicht gefunden`);
    return 0;
  }
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (filePattern.test(item)) {
        if (injectMobileCSS(fullPath)) {
          count++;
        }
      }
    }
  }
  
  walk(dir);
  return count;
}

console.log('🔧 Fixing mobile responsive issues...\n');

// Fix Bible
console.log('📖 Bible...');
const bibleCount = processDirectory('dist-diebibel');
console.log(`✓ ${bibleCount} Bible HTML files updated`);

// Fix Quran
console.log('\n📗 Quran...');
const quranCount = processDirectory('dist-alquran');
console.log(`✓ ${quranCount} Quran HTML files updated`);

// Fix Meliha
console.log('\n📘 Meliha Quran...');
const melihaCount = processDirectory('dist-meliha');
console.log(`✓ ${melihaCount} Meliha HTML files updated`);

// Fix Karim
console.log('\n📙 Karim Quran...');
const karimCount = processDirectory('dist-karim');
console.log(`✓ ${karimCount} Karim HTML files updated`);

const total = bibleCount + quranCount + melihaCount + karimCount;
console.log(`\n✅ Total: ${total} HTML files updated with mobile responsive CSS`);
