// 1. Adds bookmark glow + badge to tiles on the MAIN all-languages cover pages
//    (dist-diebibel/cover.html and dist-alquran/cover.html)
// 2. Removes the FAB button from all individual cover.html pages (wrong place)
const fs = require('fs');
const path = require('path');

// ── BIBLE MAIN COVER ────────────────────────────────────────────────────
const bibleMain = path.join(__dirname, 'dist-diebibel', 'cover.html');
let bHtml = fs.readFileSync(bibleMain, 'utf8');

// Remove old bm injection if any
bHtml = bHtml.replace(/<style id="bm-main-style">[\s\S]*?<\/style>\s*/g, '');
bHtml = bHtml.replace(/<script id="bm-main-script">[\s\S]*?<\/script>\s*/g, '');

const BIBLE_MAIN_INJECT = `<style id="bm-main-style">
.cover-wrap{position:relative!important;}
.bm-badge{position:absolute;top:8px;right:8px;width:30px;height:30px;background:rgba(200,160,48,.95);border-radius:5px;display:flex;align-items:center;justify-content:center;z-index:5;pointer-events:none;box-shadow:0 2px 10px rgba(200,160,48,.5);}
.tile.has-bm .cover-wrap{box-shadow:0 8px 20px rgba(0,0,0,.55),0 0 28px rgba(200,160,48,.55),0 0 55px rgba(200,160,48,.22)!important;border-color:rgba(200,160,48,.85)!important;}
</style>
<script id="bm-main-script">
(function(){
  function checkBm(){
    var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
    document.querySelectorAll('.tile').forEach(function(tile){
      var href=tile.getAttribute('data-orig-href')||tile.getAttribute('href')||'';
      var lang=href.split('/')[0];
      if(!lang)return;
      var old=tile.querySelector('.bm-badge');if(old)old.remove();
      tile.classList.remove('has-bm');
      if(!tile.getAttribute('data-orig-href'))tile.setAttribute('data-orig-href',tile.getAttribute('href'));
      if(bm&&bm.url&&bm.url.indexOf('/'+lang+'/')>=0){
        tile.classList.add('has-bm');
        tile.href=bm.url;
        var badge=document.createElement('div');
        badge.className='bm-badge';
        badge.innerHTML='<svg viewBox="0 0 12 16" width="14" height="18"><path d="M2 0h8a2 2 0 0 1 2 2v13l-6-4-6 4V2a2 2 0 0 1 2-2z" fill="#2a0810"/></svg>';
        var wrap=tile.querySelector('.cover-wrap');if(wrap)wrap.appendChild(badge);
      }else{
        tile.href=tile.getAttribute('data-orig-href');
      }
    });
  }
  checkBm();
  window.addEventListener('pageshow',checkBm);
  window.addEventListener('focus',checkBm);
})();
</script>
`;

bHtml = bHtml.replace('</body>', BIBLE_MAIN_INJECT + '</body>');
fs.writeFileSync(bibleMain, bHtml, 'utf8');
console.log('✓ Bible main cover.html updated');

// ── QURAN MAIN COVER ────────────────────────────────────────────────────
const quranMain = path.join(__dirname, 'dist-alquran', 'cover.html');
let qHtml = fs.readFileSync(quranMain, 'utf8');

qHtml = qHtml.replace(/<style id="bm-main-style">[\s\S]*?<\/style>\s*/g, '');
qHtml = qHtml.replace(/<script id="bm-main-script">[\s\S]*?<\/script>\s*/g, '');

const QURAN_MAIN_INJECT = `<style id="bm-main-style">
.bm-badge{position:absolute;top:8px;right:8px;width:30px;height:30px;background:rgba(192,155,60,.95);border-radius:5px;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 10px rgba(192,155,60,.5);}
.tile.has-bm .cover-wrap{box-shadow:0 8px 20px rgba(0,0,0,.55),0 0 28px rgba(192,155,60,.55),0 0 55px rgba(192,155,60,.22)!important;border-color:rgba(192,155,60,.85)!important;}
</style>
<script id="bm-main-script">
(function(){
  function checkBm(){
    var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
    document.querySelectorAll('.tile').forEach(function(tile){
      var href=tile.getAttribute('data-orig-href')||tile.getAttribute('href')||'';
      // lang = segment after Übersetzungen/, e.g. "Albanisch"
      var parts=href.split('/');
      var lang=parts[1]||parts[0]||'';
      if(!lang)return;
      var old=tile.querySelector('.bm-badge');if(old)old.remove();
      tile.classList.remove('has-bm');
      if(!tile.getAttribute('data-orig-href'))tile.setAttribute('data-orig-href',tile.getAttribute('href'));
      if(bm&&bm.url&&bm.url.indexOf('/'+lang+'/')>=0){
        tile.classList.add('has-bm');
        tile.href=bm.url;
        var badge=document.createElement('div');
        badge.className='bm-badge';
        badge.innerHTML='<svg viewBox="0 0 12 16" width="14" height="18"><path d="M2 0h8a2 2 0 0 1 2 2v13l-6-4-6 4V2a2 2 0 0 1 2-2z" fill="#0f2f1a"/></svg>';
        var wrap=tile.querySelector('.cover-wrap');if(wrap)wrap.appendChild(badge);
      }else{
        tile.href=tile.getAttribute('data-orig-href');
      }
    });
  }
  checkBm();
  window.addEventListener('pageshow',checkBm);
  window.addEventListener('focus',checkBm);
})();
</script>
`;

qHtml = qHtml.replace('</body>', QURAN_MAIN_INJECT + '</body>');
fs.writeFileSync(quranMain, qHtml, 'utf8');
console.log('✓ Quran main cover.html updated');

// ── REMOVE FAB FROM INDIVIDUAL LANGUAGE COVERS ──────────────────────────
// Bible individual covers
let removedBible = 0;
const bibleBase = path.join(__dirname, 'dist-diebibel');
for (const lang of fs.readdirSync(bibleBase)) {
  const fp = path.join(bibleBase, lang, 'cover.html');
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('bm-fab-style')) continue;
  // Remove style
  html = html.replace(/<style id="bm-fab-style">[\s\S]*?<\/style>/g, '');
  // Remove element
  html = html.replace(/<a class="bm-fab"[\s\S]*?<\/a>/g, '');
  // Remove script
  html = html.replace(/<script>\s*\(function\(\)\{\s*function checkBm[\s\S]*?\}\)\(\);\s*<\/script>/g, '');
  fs.writeFileSync(fp, html, 'utf8');
  removedBible++;
}
console.log(`✓ Removed FAB from ${removedBible} Bible individual covers`);

// Quran individual covers
let removedQuran = 0;
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    const fp = path.join(quranBase, lang, 'cover.html');
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    if (!html.includes('bm-fab-style')) continue;
    html = html.replace(/<style id="bm-fab-style">[\s\S]*?<\/style>/g, '');
    html = html.replace(/<a class="bm-fab"[\s\S]*?<\/a>/g, '');
    html = html.replace(/<script>\s*\(function\(\)\{\s*function checkBm[\s\S]*?\}\)\(\);\s*<\/script>/g, '');
    fs.writeFileSync(fp, html, 'utf8');
    removedQuran++;
  }
}
console.log(`✓ Removed FAB from ${removedQuran} Quran individual covers`);
console.log('\nDone.');
