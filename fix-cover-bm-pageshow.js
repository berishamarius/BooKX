// Replaces the bookmark FAB JS in all 31 covers with a pageshow+focus version
// so it re-checks localStorage every time the user arrives on the page (back button, focus, etc.)
const fs = require('fs');
const path = require('path');

const BIBLE_OLD = `<script>
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

const BIBLE_NEW = `<script>
(function(){
  function checkBm(){
    var fab=document.getElementById('bm-fab');if(!fab)return;
    var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
    var lang=location.pathname.split('/')[1]||'';
    var img=document.querySelector('.book img');
    if(bm&&bm.url&&lang&&bm.url.indexOf('/'+lang+'/')>=0){
      fab.setAttribute('href',bm.url);fab.classList.add('has-bm');
      if(img)img.style.boxShadow='0 20px 60px rgba(0,0,0,.7),0 0 70px rgba(200,160,48,.32),0 0 130px rgba(200,160,48,.1)';
    }else{
      fab.removeAttribute('href');fab.classList.remove('has-bm');
      if(img)img.style.boxShadow='';
    }
  }
  checkBm();
  window.addEventListener('pageshow',checkBm);
  window.addEventListener('focus',checkBm);
})();
</script>`;

const QURAN_OLD = `<script>
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

const QURAN_NEW = `<script>
(function(){
  function checkBm(){
    var fab=document.getElementById('bm-fab');if(!fab)return;
    var bm;try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(_){}
    var seg=location.pathname.split('/');
    var lang=seg[2]||seg[1]||'';
    var book=document.querySelector('.book');
    if(bm&&bm.url&&lang&&bm.url.indexOf('/'+lang+'/')>=0){
      fab.setAttribute('href',bm.url);fab.classList.add('has-bm');
      if(book)book.style.boxShadow='0 30px 80px rgba(0,0,0,.7),0 0 70px rgba(192,155,60,.32),0 0 130px rgba(192,155,60,.1)';
    }else{
      fab.removeAttribute('href');fab.classList.remove('has-bm');
      if(book)book.style.boxShadow='';
    }
  }
  checkBm();
  window.addEventListener('pageshow',checkBm);
  window.addEventListener('focus',checkBm);
})();
</script>`;

let bCount = 0, qCount = 0, skipped = 0;

// Bible covers
const bibleBase = path.join(__dirname, 'dist-diebibel');
for (const lang of fs.readdirSync(bibleBase)) {
  const fp = path.join(bibleBase, lang, 'cover.html');
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('bm-fab')) { skipped++; continue; }
  if (html.includes('pageshow')) { console.log('Bible already fixed: ' + lang); continue; }
  if (!html.includes(BIBLE_OLD.trim().slice(0, 60))) {
    // Try to find the script block another way - just replace the closing part
    console.log('Bible pattern mismatch: ' + lang + ' — forcing full replace');
    // Remove old script completely and re-add
    html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?fab=document\.getElementById\('bm-fab'\)[\s\S]*?\}\)\(\);\s*<\/script>/, BIBLE_NEW);
  } else {
    html = html.replace(BIBLE_OLD, BIBLE_NEW);
  }
  fs.writeFileSync(fp, html, 'utf8');
  console.log('Bible fixed: ' + lang);
  bCount++;
}

// Quran covers
const quranBase = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
if (fs.existsSync(quranBase)) {
  for (const lang of fs.readdirSync(quranBase)) {
    const fp = path.join(quranBase, lang, 'cover.html');
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    if (!html.includes('bm-fab')) { skipped++; continue; }
    if (html.includes('pageshow')) { console.log('Quran already fixed: ' + lang); continue; }
    if (!html.includes(QURAN_OLD.trim().slice(0, 60))) {
      console.log('Quran pattern mismatch: ' + lang + ' — forcing full replace');
      html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?fab=document\.getElementById\('bm-fab'\)[\s\S]*?\}\)\(\);\s*<\/script>/, QURAN_NEW);
    } else {
      html = html.replace(QURAN_OLD, QURAN_NEW);
    }
    fs.writeFileSync(fp, html, 'utf8');
    console.log('Quran fixed: ' + lang);
    qCount++;
  }
}

console.log(`\nDone. Bible: ${bCount}, Quran: ${qCount}, skipped: ${skipped}`);
