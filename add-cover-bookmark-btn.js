// Adds a bookmark FAB button (top-right) to ALL Bible and Quran cover pages
// When a bookmark exists for that language: button glows gold + book cover glows + links to chapter
// When no bookmark: button dimmed
const fs = require('fs');
const path = require('path');

const BIBLE_CSS = `
<style id="bm-fab-style">
.bm-fab{position:fixed;top:22px;right:20px;z-index:200;width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid rgba(200,160,48,.2);background:rgba(42,8,16,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:default;opacity:.28;transition:all .35s;pointer-events:none;}
.bm-fab.has-bm{opacity:1;border-color:rgba(200,160,48,.75);box-shadow:0 0 22px rgba(200,160,48,.3),0 0 44px rgba(200,160,48,.12);cursor:pointer;pointer-events:auto;text-decoration:none;}
.bm-fab svg{width:19px;height:23px;display:block;}
.bm-fab path{fill:rgba(200,160,48,.5);transition:fill .35s;}
.bm-fab.has-bm path{fill:#EDD882;}
</style>`;

const BIBLE_ELEM = `<a class="bm-fab" id="bm-fab" aria-label="Lesezeichen">
<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 0h8a2 2 0 0 1 2 2v13l-6-4-6 4V2a2 2 0 0 1 2-2z"/></svg>
</a>`;

const BIBLE_JS = `<script>
(function(){
  var fab=document.getElementById('bm-fab');
  var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
  var lang=location.pathname.split('/')[1]||'';
  if(bm&&bm.url&&lang&&bm.url.indexOf('/'+lang+'/')>=0){
    fab.setAttribute('href',bm.url);
    fab.classList.add('has-bm');
    var img=document.querySelector('.book img');
    if(img)img.style.boxShadow='0 20px 60px rgba(0,0,0,.7),0 0 70px rgba(200,160,48,.32),0 0 130px rgba(200,160,48,.1)';
  }
})();
</script>`;

const QURAN_CSS = `
<style id="bm-fab-style">
.bm-fab{position:fixed;top:22px;right:20px;z-index:200;width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid rgba(192,155,60,.2);background:rgba(9,26,12,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:default;opacity:.28;transition:all .35s;pointer-events:none;}
.bm-fab.has-bm{opacity:1;border-color:rgba(192,155,60,.75);box-shadow:0 0 22px rgba(192,155,60,.3),0 0 44px rgba(192,155,60,.12);cursor:pointer;pointer-events:auto;text-decoration:none;}
.bm-fab svg{width:19px;height:23px;display:block;}
.bm-fab path{fill:rgba(192,155,60,.5);transition:fill .35s;}
.bm-fab.has-bm path{fill:#d4a574;}
</style>`;

const QURAN_ELEM = `<a class="bm-fab" id="bm-fab" aria-label="Lesezeichen">
<svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 0h8a2 2 0 0 1 2 2v13l-6-4-6 4V2a2 2 0 0 1 2-2z"/></svg>
</a>`;

const QURAN_JS = `<script>
(function(){
  var fab=document.getElementById('bm-fab');
  var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
  var seg=location.pathname.split('/');
  var lang=seg[2]||seg[1]||'';
  if(bm&&bm.url&&lang&&bm.url.indexOf('/'+lang+'/')>=0){
    fab.setAttribute('href',bm.url);
    fab.classList.add('has-bm');
    var book=document.querySelector('.book');
    if(book)book.style.boxShadow='0 30px 80px rgba(0,0,0,.7),0 0 70px rgba(192,155,60,.32),0 0 130px rgba(192,155,60,.1)';
  }
})();
</script>`;

function injectBible(fp) {
  if (!fs.existsSync(fp)) return false;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('bm-fab-style')) return false; // already done
  // Inject CSS in <head> before </head>
  html = html.replace('</head>', BIBLE_CSS + '</head>');
  // Inject element + script before </body>
  html = html.replace('</body>', BIBLE_ELEM + '\n' + BIBLE_JS + '\n</body>');
  fs.writeFileSync(fp, html, 'utf8');
  return true;
}

function injectQuran(fp) {
  if (!fs.existsSync(fp)) return false;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('bm-fab-style')) return false;
  html = html.replace('</head>', QURAN_CSS + '</head>');
  html = html.replace('</body>', QURAN_ELEM + '\n' + QURAN_JS + '\n</body>');
  fs.writeFileSync(fp, html, 'utf8');
  return true;
}

let bCount = 0, qCount = 0;

// Bible covers
const bibleBase = path.join(__dirname, 'dist-diebibel');
for (const lang of fs.readdirSync(bibleBase)) {
  const fp = path.join(bibleBase, lang, 'cover.html');
  if (injectBible(fp)) { console.log('Bible: ' + lang); bCount++; }
}

// Quran covers
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    const fp = path.join(quranBase, lang, 'cover.html');
    if (injectQuran(fp)) { console.log('Quran: ' + lang); qCount++; }
  }
}

console.log(`\nDone. Bible: ${bCount} covers, Quran: ${qCount} covers.`);
