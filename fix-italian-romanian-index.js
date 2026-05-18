// fix-italian-romanian-index.js
// Rebuilds Italian and Romanian index.html with correct HTML class names matching the CSS

const fs = require('fs');
const path = require('path');

// Read German index to get chapter counts per book
const deHtml = fs.readFileSync('dist-diebibel/german/index.html', 'utf8');
const chapCounts = {};
const chapRe = /href="b[^"]*\/(\d{3}-[a-z]+)\.html"[^>]*>[\s\S]*?tchap[^>]*>(\d+ Kap\.)/g;
let m;
while ((m = chapRe.exec(deHtml)) !== null) {
  chapCounts[m[1]] = m[2];
}

// Books: file -> [testament, numDK]
const DK_BOOKS = ['001-tob','002-jdt','006-1ma','007-2ma','007b-1es','008-wis','009-sir','012-bar'];

function buildIndex(lang, data) {
  const { langCode, title, langLabel, subtitle, books, vtCatholic, vtProtestant, ntCatholic, ntProtestant, secVTc, secVTp, secNTc, secNTp, backLabel, backUrl, parentLabel, parentUrl } = data;

  const bookRows = books.map(function(b) {
    const isDK = DK_BOOKS.some(function(dk) { return b.file.indexOf(dk) >= 0; });
    const chap = chapCounts[b.file] || '';
    const testament = b.testament;
    const dkAttr = isDK ? ' data-testament="DK"' : '';
    return '  <a href="b\u00FCcher/' + b.file + '.html" class="toc-item" data-testament="' + testament + '"' + dkAttr + '>\n' +
           '    <span class="tnr">' + b.num + '</span>\n' +
           '    <span class="tlat">' + b.latin + '</span>\n' +
           '    <span class="tname">' + b.name + '</span>\n' +
           '    <span class="tdots"></span>\n' +
           '    <span class="tchap">' + chap + '</span>\n' +
           '    <span class="tarr">\u203A</span>\n' +
           '  </a>';
  });

  const vtRows = bookRows.filter(function(_, i) { return books[i].testament === 'VT'; });
  const ntRows = bookRows.filter(function(_, i) { return books[i].testament === 'NT'; });

  return `<!DOCTYPE html>
<html lang="${langCode}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#2C0810;
  font-family:'EB Garamond',serif;color:#EDD882;
}
.topbar{
  background:#2C0810;
  border-bottom:1px solid rgba(140,100,20,.3);
  padding:10px 28px;
  display:flex;align-items:center;justify-content:space-between;
}
.topbar a{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:#E8C547;text-decoration:none;letter-spacing:.08em;
  border:1px solid rgba(200,160,48,.5);padding:5px 18px;border-radius:2px;
  display:inline-block;
  transition:color .15s,border-color .15s;
}
.topbar a:hover{color:#F0E68C;border-color:rgba(200,160,48,.8);}
header{
  background:#1A0407;
  border:1px solid rgba(200,160,48,.2);
  border-bottom:3px solid #B8962E;
  padding:36px 24px 28px;text-align:center;
  position:relative;overflow:hidden;
  margin:0;
}
.h-orn{
  font-size:.72rem;letter-spacing:.65em;
  color:rgba(200,160,48,.5);
  margin-bottom:20px;position:relative;
}
.h-cross-big{
  display:block;width:40px;height:56px;margin:0 auto 16px;
}
.htitle{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(2rem,6vw,3.2rem);
  color:#F0E68C;
  position:relative;line-height:1.2;
}
.h-rule-full{
  width:65%;height:1px;margin:16px auto;
  background:linear-gradient(to right,transparent,#B8962E 20%,#8B6400 50%,#B8962E 80%,transparent);
}
.hlang{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:#E8C547;letter-spacing:.25em;
  position:relative;margin-top:10px;
}
.h-sub{
  font-family:'Cinzel',serif;font-size:.6rem;
  letter-spacing:.44em;color:rgba(200,160,48,.6);
  position:relative;
}
.h-orn-bot{
  font-size:.65rem;letter-spacing:.8em;
  color:rgba(200,160,48,.3);
  margin-top:18px;position:relative;
}
.sec-head{text-align:center;padding:52px 0 8px;}
.sec-t{font-family:'UnifrakturMaguntia',cursive;font-size:2.4rem;color:#EDD882;display:none;margin-bottom:6px;}
body:not([data-conf]) .sec-t-c,body[data-conf="catholic"] .sec-t-c{display:block;}
body[data-conf="protestant"] .sec-t-p{display:block;}
.sec-rule{width:140px;height:1px;margin:10px auto;background:linear-gradient(to right,transparent,#B8962E 20%,#8B6400 50%,#B8962E 80%,transparent);}
.sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#E8C547;letter-spacing:.28em;margin-top:4px;display:none;margin-bottom:28px;}
body:not([data-conf]) .sec-s-c,body[data-conf="catholic"] .sec-s-c{display:block;}
body[data-conf="protestant"] .sec-s-p{display:block;}
.index-body{
  max-width:1000px;
  margin:36px auto 60px;
  padding:52px clamp(12px,5vw,72px) 80px;
  background:#1a0407;
  background-image:
    radial-gradient(ellipse at top left,rgba(200,160,48,.04) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(200,160,48,.03) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.75),inset 0 0 0 1px rgba(200,160,48,.15);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(200,160,48,.3);
  border-bottom:2px solid rgba(200,160,48,.3);
  position:relative;overflow:clip;
}
.sec-group{margin-bottom:0;text-align:center;}
.toc-item{
  display:flex;align-items:baseline;
  padding:14px 4px;
  border-bottom:1px solid rgba(200,160,48,.1);
  text-decoration:none;
  transition:background .15s;border-radius:2px;
}
.toc-item:hover{background:rgba(200,160,48,.05);}
.tnr{
  font-family:'Cinzel',serif;font-size:.72rem;
  color:#E8C547;
  min-width:50px;text-align:right;padding-right:20px;flex-shrink:0;
}
.tlat{
  font-family:'Cinzel Decorative',serif;font-size:1.25rem;
  color:#EDD882;flex-shrink:0;
}
.tname{
  font-family:'EB Garamond',serif;font-size:1rem;font-style:italic;
  color:#B8962E;
  margin-left:12px;flex-shrink:0;
}
.tdots{
  flex:1;height:1px;margin:0 18px;align-self:center;
  background:repeating-linear-gradient(to right,rgba(200,160,48,.15) 0,rgba(200,160,48,.15) 3px,transparent 3px,transparent 9px);
}
.tchap{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:#E8C547;flex-shrink:0;white-space:nowrap;
}
.tarr{color:rgba(200,160,48,.5);margin-left:14px;font-size:1rem;}
.conf-bar{
  display:flex;justify-content:center;gap:0;
  padding:18px 24px 0;
  font-family:'Cinzel',serif;
}
.conf-btn{
  padding:9px 24px;font-size:.65rem;letter-spacing:.16em;
  border:1px solid rgba(200,160,48,.4);background:transparent;
  color:rgba(200,160,48,.6);cursor:pointer;transition:all .18s;
  text-transform:uppercase;
}
.conf-btn:first-child{border-radius:2px 0 0 2px;}
.conf-btn:last-child{border-radius:0 2px 2px 0;}
.conf-btn:not(:first-child){border-left:none;}
.conf-btn.active{background:rgba(200,160,48,.15);color:#EDD882;border-color:rgba(200,160,48,.7);}
.conf-btn:hover:not(.active){background:rgba(200,160,48,.08);color:#C8A030;}
body[data-conf="protestant"] .toc-item[data-testament="DK"]{display:none;}
.conf-note{
  text-align:center;font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(200,160,48,.7);letter-spacing:.1em;padding:6px 24px 0;
}
@media(max-width:600px){
  .index-body{margin:12px 8px 40px;padding:28px 16px 40px;}
  .toc-item{padding:10px 2px;}
  .tlat{font-size:.95rem;}
  .tname{font-size:.85rem;margin-left:6px;}
  .tdots{display:none;}
  .tchap{display:none;}
  .tarr{margin-left:auto;}
  .topbar{padding:10px 12px;}
  .topbar a{padding:5px 10px;font-size:.62rem;}
}
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}
</style>
</head>
<body>

<nav class="topbar">
  <a href="${parentUrl}">\u2190 ${parentLabel}</a>
  <a href="${backUrl}" style="margin-left:auto">${backLabel} \u2192</a>
</nav>

<header>
  <div class="h-orn">\u2726 &nbsp; \u2726 &nbsp; \u2726</div>
  <svg class="h-cross-big" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10" fill="none" stroke="#C8A030" stroke-width="1.8" stroke-linecap="square"/></svg>
  <div class="htitle">${title.split('\u00B7')[0].trim()}</div>
  <div class="h-rule-full"></div>
  <div class="hlang">${langLabel}</div>
  <div class="h-sub">${subtitle}</div>
  <div class="h-orn-bot">\u2014\u2014 \u2726 \u2026 \u2726 \u2014\u2014</div>
</header>

<main class="index-body">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>

<div class="conf-bar">
  <button class="conf-btn" data-conf="catholic">\u271D&#xFE0E; Katholisch</button>
  <button class="conf-btn" data-conf="protestant">\u2629  Protestantisch</button>
</div>
<div class="conf-note" id="conf-note"></div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">${vtCatholic}</span>
  <span class="sec-t sec-t-p">${vtProtestant}</span>
  <div class="sec-rule"></div>
  <span class="sec-s sec-s-c">${secVTc}</span>
  <span class="sec-s sec-s-p">${secVTp}</span>
</div>
${vtRows.join('\n')}
</div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">${ntCatholic}</span>
  <span class="sec-t sec-t-p">${ntProtestant}</span>
  <div class="sec-rule"></div>
  <span class="sec-s sec-s-c">${secNTc}</span>
  <span class="sec-s sec-s-p">${secNTp}</span>
</div>
${ntRows.join('\n')}
</div>
</main>

<script>
(function(){
  var saved = localStorage.getItem('biblia_conf') || 'catholic';
  document.body.dataset.conf = saved;
  document.querySelectorAll('.conf-btn').forEach(function(btn){
    if(btn.dataset.conf===saved) btn.classList.add('active');
  });
  document.querySelectorAll('.conf-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var c=btn.dataset.conf;
      localStorage.setItem('biblia_conf',c);
      document.body.dataset.conf=c;
      document.querySelectorAll('.conf-btn').forEach(function(b){b.classList.toggle('active',b.dataset.conf===c);});
    });
  });
})();
</script>
</body>
</html>`;
}

// --- Parse books from existing Italian index ---
function parseBooks(html) {
  const books = [];
  // Find all .book-card or .toc-item links
  const re = /href="b[^"]*\/(\d{3}[^"]*?)\.html"[\s\S]*?(?:b-latin|tlat)[^>]*>([^<]+)<[\s\S]*?(?:b-name|tname)[^>]*>([^<]+)</g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const file = m[1];
    const latin = m[2].trim();
    const name = m[3].trim();
    const num = file.substring(0, 3);
    // Determine testament: NT starts from Matthew (040-mat)
    const numInt = parseInt(num);
    const testament = numInt >= 40 ? 'NT' : 'VT';
    books.push({ file: file, num: num, latin: latin, name: name, testament: testament });
  }
  return books;
}

// --- ITALIAN ---
const itHtml = fs.readFileSync('dist-diebibel/italian/index.html', 'utf8');
const itBooks = parseBooks(itHtml);
console.log('Italian books found:', itBooks.length);

const itData = {
  langCode: 'it',
  title: 'La Sacra Bibbia \u00B7 Italiano',
  langLabel: 'ITALIANO',
  subtitle: 'Giovanni Diodati (1649)',
  books: itBooks,
  vtCatholic: 'Vetus Testamentum',
  vtProtestant: 'Antico Testamento',
  ntCatholic: 'Novum Testamentum',
  ntProtestant: 'Nuovo Testamento',
  secVTc: 'V E T E R I S \u00B7 T E S T A M E N T I \u00B7 39 \u00B7 L I B R I',
  secVTp: '39 \u00B7 L I B R I \u00B7 A N T I C O \u00B7 T E S T A M E N T O',
  secNTc: 'N O V I \u00B7 T E S T A M E N T I \u00B7 27 \u00B7 L I B R I',
  secNTp: '27 \u00B7 L I B R I \u00B7 N U O V O \u00B7 T E S T A M E N T O',
  backLabel: 'Retro di Copertina',
  backUrl: 'back-cover.html',
  parentLabel: 'La Sacra Bibbia \u00B7 Alle Sprachen',
  parentUrl: '../../index.html'
};

const itOut = buildIndex('italian', itData);
fs.writeFileSync('dist-diebibel/italian/index.html', itOut, 'utf8');
console.log('Italian index rebuilt.');

// --- ROMANIAN ---
const roHtml = fs.readFileSync('dist-diebibel/romanian/index.html', 'utf8');
const roBooks = parseBooks(roHtml);
console.log('Romanian books found:', roBooks.length);

const roData = {
  langCode: 'ro',
  title: 'Biblia \u00B7 Rom\u00E2n\u0103',
  langLabel: 'ROM\u00C2N\u0102',
  subtitle: 'Biblia Ortodox\u0103',
  books: roBooks,
  vtCatholic: 'Vetus Testamentum',
  vtProtestant: 'Vechiul Testament',
  ntCatholic: 'Novum Testamentum',
  ntProtestant: 'Noul Testament',
  secVTc: 'V E T E R I S \u00B7 T E S T A M E N T I \u00B7 39 \u00B7 L I B R I',
  secVTp: '39 \u00B7 C \u0102 R \u021A I \u00B7 V E C H I U L \u00B7 T E S T A M E N T',
  secNTc: 'N O V I \u00B7 T E S T A M E N T I \u00B7 27 \u00B7 L I B R I',
  secNTp: '27 \u00B7 C \u0102 R \u021A I \u00B7 N O U L \u00B7 T E S T A M E N T',
  backLabel: 'Copert\u0103 Posterioar\u0103',
  backUrl: 'back-cover.html',
  parentLabel: 'Biblia \u00B7 Alle Sprachen',
  parentUrl: '../../index.html'
};

const roOut = buildIndex('romanian', roData);
fs.writeFileSync('dist-diebibel/romanian/index.html', roOut, 'utf8');
console.log('Romanian index rebuilt.');
