const fs = require('fs');
const path = require('path');

// Fix verse files: only jump to bookmark if ?bookmark=1 parameter
function updateVerseFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Skip if already fixed or doesn't have old code
  if (!content.includes("pathname+'#'") || content.includes('?bookmark=')) {
    return false;
  }
  
  // 1. Remove # from saved URL
  content = content.replace("url:location.pathname+'#'+id", 'url:location.pathname');
  
  // 2. Add parameter check before addEventListener
  const oldCode = '  document.addEventListener(';
  const newCode = `  var params=new URLSearchParams(location.search);
  if(params.get('bookmark')==='1'){
    var bm;try{bm=JSON.parse(localStorage.getItem(BM_KEY));}catch(_){}
    if(bm&&bm.id){setTimeout(function(){var el=document.getElementById(bm.id);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});showToast('Zu Lesezeichen gesprungen');}},200);}
  }
  document.addEventListener(`;
  
  content = content.replace(oldCode, newCode);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  
  for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      count += walk(fullPath);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      // Only process verse/chapter files
      if (/[\\/](suren|chapters|bücher|books)[\\/]/i.test(fullPath)) {
        if (updateVerseFile(fullPath)) {
          count++;
        }
      }
    }
  }
  return count;
}

console.log('=== Fixing Bookmark System ===\n');
const quranFixed = walk('dist-alquran');
const bibleFixed = walk('dist-diebibel');
const total = quranFixed + bibleFixed;
console.log(`\nFixed ${quranFixed} Quran + ${bibleFixed} Bible = ${total} total files`);
console.log('\n✓ Bookmark system fixed! Now only jumps with ?bookmark=1 parameter');
