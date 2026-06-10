const fs = require('fs');
const path = require('path');

let fixed = 0;
let alreadyFixed = 0;
let noBookmark = 0;

function fixBookmarkCode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Check if file has KX_bookmark
  if (!content.includes('KX_bookmark')) {
    noBookmark++;
    return false;
  }
  
  // Check if already has the new parameter check
  if (content.includes("params.get('bookmark')")) {
    alreadyFixed++;
    return false;
  }
  
  // Find the script block with KX_bookmark
  const scriptMatch = content.match(/<script>\s*\(function\(\)\{[\s\S]*?KX_bookmark[\s\S]*?\}\)\(\);\s*<\/script>/);
  
  if (!scriptMatch) {
    console.log(`⚠ No matching script in: ${filePath}`);
    return false;
  }
  
  const oldScript = scriptMatch[0];
  
  // Replace url saving - remove # from URL
  let newScript = oldScript.replace(
    /url:location\.pathname\+['"]#['"]\+id/g,
    'url:location.pathname'
  );
  
  // Add parameter check before addEventListener
  // Find the addEventListener line
  const addEventMatch = newScript.match(/(\s+)(document\.addEventListener\()/);
  
  if (addEventMatch) {
    const indent = addEventMatch[1];
    const paramCheck = `${indent}var params=new URLSearchParams(location.search);
${indent}if(params.get('bookmark')==='1'){
${indent}  var bm;try{bm=JSON.parse(localStorage.getItem(BM_KEY));}catch(_){}
${indent}  if(bm&&bm.id){setTimeout(function(){var el=document.getElementById(bm.id);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});showToast('Zu Lesezeichen gesprungen');}},200);}
${indent}}
${indent}`;
    
    newScript = newScript.replace(addEventMatch[0], paramCheck + addEventMatch[0]);
  } else {
    console.log(`⚠ No addEventListener found in: ${filePath}`);
    return false;
  }
  
  // Replace in content
  content = content.replace(oldScript, newScript);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixed++;
    return true;
  }
  
  return false;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  
  for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      walk(fullPath);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      // Only verse/chapter files
      if (/[\\/](suren|chapters|bücher|books)[\\/]/i.test(fullPath)) {
        fixBookmarkCode(fullPath);
      }
    }
  }
}

console.log('=== Fixing ALL Bookmark Files ===\n');
console.log('Processing...\n');

walk('dist-alquran');
walk('dist-diebibel');

console.log('\n=== ERGEBNIS ===');
console.log(`✓ Fixed: ${fixed} Dateien`);
console.log(`✓ Already OK: ${alreadyFixed} Dateien`);
console.log(`- No bookmark: ${noBookmark} Dateien`);
console.log(`\n✓ GESAMT: ${fixed + alreadyFixed} Dateien mit Bookmark-System`);
