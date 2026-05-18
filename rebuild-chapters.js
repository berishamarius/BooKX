'use strict';
/**
 * rebuild-chapters.js
 * Completely rebuilds Italian and Romanian Bible chapter files
 * to match the exact German/Albanian design (bhead, blatin, bnav structure).
 * 
 * Also fixes the cross emoji (✞) in ALL chapter files by replacing it with an SVG.
 */
const fs   = require('fs');
const path = require('path');

const BIBLE_DIST = path.join(__dirname, 'dist-diebibel');

// SVG cross (same as German b-wm watermark, but sized for nav)
const SVG_CROSS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14" width="13" height="18" style="vertical-align:middle;stroke:currentColor;stroke-width:1.8;fill:none;stroke-linecap:square"><path d="M5,0V14M0,4H10"/></svg>';

// ── German CSS (exact copy from German chapter) ───────────────────────────────
const CHAPTER_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#2C0810;
  background-image:radial-gradient(ellipse at 50% 20%,#4A1020 0%,#1A0407 100%);
  font-family:'EB Garamond',serif;
  color:#E8C547;
  font-size:17px;
}
.bhead{
  background:#1A0407;
  padding:36px 28px 28px;
  text-align:center;
  border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
.bhead::before{content:'';position:absolute;inset:14px;border:none;pointer-events:none;}
.bhead::after{content:'';position:absolute;inset:22px;border:none;pointer-events:none;}
.btestament{
  display:inline-block;
  border:1px solid rgba(200,160,48,.32);
  color:rgba(200,160,48,.52);
  font-family:'Cinzel',serif;font-size:.55rem;
  letter-spacing:.3em;padding:4px 18px;
  border-radius:2px;margin-bottom:16px;
  position:relative;
}
.blatin{
  display:none;
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(1.9rem,7vw,3.4rem);
  color:#EDD882;
  text-shadow:0 3px 20px rgba(0,0,0,.55);
  letter-spacing:.04em;position:relative;
}
body:not([data-conf]) .blatin-c,
body[data-conf="catholic"] .blatin-c{display:block;}
body[data-conf="protestant"] .blatin-p{display:block;}
.btrans{
  font-family:'Cinzel',serif;
  font-size:.88rem;
  color:#C8A030;margin-top:10px;
  letter-spacing:.16em;position:relative;
}
.bmeta{
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(200,160,48,.4);margin-top:6px;
  letter-spacing:.08em;position:relative;
}
.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#1a0407;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.55),0 2px 12px rgba(0,0,0,.35),inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;overflow:clip;
}
.content::before{
  content:'';position:absolute;inset:12px;
  border:1px solid rgba(184,150,46,.08);
  pointer-events:none;
}
.chap{margin-top:0;}
.chhead{
  text-align:center;padding:40px 0 20px;margin-bottom:16px;position:relative;
}
.chhead::before{
  content:'* * *';display:block;font-size:.7rem;
  color:rgba(184,150,46,.45);letter-spacing:.35em;margin-bottom:16px;
}
.chhead::after{
  content:'';display:block;width:200px;height:1px;margin:14px auto 0;
  background:linear-gradient(to right,transparent,#B8962E,transparent);
}
.chrom{
  font-family:'Cinzel Decorative',serif;font-size:4rem;color:#8B6914;
  display:block;text-shadow:0 2px 18px rgba(184,150,46,.2);line-height:1;
}
.chlbl{
  font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(184,150,46,.42);letter-spacing:.32em;
  display:none;margin-top:8px;
}
body:not([data-conf]) .chlbl-c,
body[data-conf="catholic"] .chlbl-c{display:block;}
body[data-conf="protestant"] .chlbl-p{display:block;}
.vb{
  display:flex;padding:20px 6px;
  border-bottom:1px solid rgba(184,150,46,.12);
  background:none;border-radius:2px;transition:background .15s;
}
.vb:hover{background:rgba(184,150,46,.04);}
.vn{
  flex-shrink:0;width:38px;padding-top:4px;
  font-family:'Cinzel',serif;font-size:.56rem;
  color:rgba(184,150,46,.52);text-align:right;
  padding-right:12px;line-height:2.4;
}
.vt{flex:1;padding:0 20px 0 4px;}
.base{
  font-family:'EB Garamond',serif;font-size:1.2rem;font-weight:500;
  line-height:2.1;color:#E8C547;display:none;
}
body:not([data-conf]) .base-c,
body[data-conf="catholic"] .base-c{display:block;}
body[data-conf="protestant"] .base-p{display:block;}
.tra{
  font-family:'EB Garamond',serif;font-style:italic;
  font-size:.93rem;color:rgba(232,197,71,.55);line-height:1.82;
  margin-top:6px;display:block;
}
.vb.first .base-c::first-letter,
.vb.first .base-p::first-letter{
  font-family:'Cinzel Decorative',serif;font-size:4em;
  float:left;line-height:.7;padding-right:.08em;margin-top:.07em;
  color:#B8962E;text-shadow:1px 2px 6px rgba(0,0,0,.12);
}
body[data-conf="protestant"] .vb.first .base-p::first-letter{
  font-family:'UnifrakturMaguntia',cursive;font-size:4em;
  float:left;line-height:.7;padding-right:.08em;margin-top:.07em;
  color:#B8962E;text-shadow:1px 2px 6px rgba(0,0,0,.12);
}
.bnav{
  display:flex;justify-content:space-between;align-items:center;
  background:#2C0810;border-top:3px solid #B8962E;
  padding:12px 24px;gap:12px;
}
.bnav a,.bnav .dim{
  color:#C8A030;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.07em;
  padding:6px 16px;
  border:1px solid rgba(200,160,48,.28);
  border-radius:2px;transition:background .18s;
}
.bnav a:hover{background:rgba(200,160,48,.12);}
.bnav .dim{color:rgba(200,160,48,.2);border-color:rgba(200,160,48,.1);}
.bnav .center{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:rgba(200,160,48,.65);text-align:center;
  letter-spacing:.06em;text-decoration:none;
  border:1px solid rgba(200,160,48,.28);border-radius:2px;
  padding:6px 20px;transition:background .18s;
}
.bnav .center:hover{background:rgba(200,160,48,.1);}
body[data-conf="protestant"] .base-p{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:1.08rem;letter-spacing:.01em;
}
@media print{
  .bnav{display:none;}
  .bhead{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .vb{break-inside:avoid;}
}
@media(max-width:600px){
  .blatin{font-size:1.8rem;}
  .base{font-size:1rem;}
  .tra{font-size:.84rem;}
  .content{width:100%;max-width:none;padding:14px 12px 44px;margin:0;border-left:none;border-right:none;border-top:none;border-bottom:none;border-radius:0;box-shadow:none;overflow:visible;}
  .chrom{font-size:1.8rem;}
  .content::before{display:none;}
  .vb{padding:16px 2px;}
  .vn{width:28px;padding-right:8px;}
}
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}`;

// ── Reader scripts ────────────────────────────────────────────────────────────
const CONF_SCRIPT = `<script>
(function(){
  var c = localStorage.getItem('biblia_conf') || 'catholic';
  document.body.dataset.conf = c;
})();
</script>`;

const BOOKMARK_SCRIPT = `<script>
(function(){
  var BM_KEY = 'KX_bookmark';
  var toast, toastTimer;
  function showToast(txt) {
    if (!toast) {
      toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(86,24,31,.95);color:#f1d7c8;font-family:sans-serif;font-size:.78rem;letter-spacing:.08em;padding:9px 20px;border-radius:10px;border:1px solid #9c4a44;pointer-events:none;z-index:999;transition:opacity .3s,transform .3s;box-shadow:0 12px 24px rgba(0,0,0,.24)';
      document.body.appendChild(toast);
    }
    toast.textContent = txt;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(6px)'; }, 1800);
  }
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.matches && el.matches('.verse, .vb')) break;
      el = el.parentElement;
    }
    if (!el || el === document.body) return;
    if (e.target.tagName === 'A') return;
    var id = el.id;
    if (!id) return;
    var data = { url: location.pathname + '#' + id, title: document.title, id: id, ts: Date.now() };
    try { localStorage.setItem(BM_KEY, JSON.stringify(data)); } catch(_){}
    showToast('\\u2746 Lesezeichen gesetzt');
  });
})();
</script>`;

// ── Helper: parse inner text from simple HTML tag ────────────────────────────
function extractTag(html, className) {
  const re = new RegExp(`class="${className}"[^>]*>([^<]*)<`);
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

// ── Helper: extract by tag and class pattern ─────────────────────────────────
function extractClass(html, cls) {
  const re = new RegExp(`class="${cls}"[^>]*>([\\s\\S]*?)</div>`);
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

// ── Arabic numeral to Roman ──────────────────────────────────────────────────
function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  for (let i=0; i<vals.length; i++) { while(n>=vals[i]){r+=syms[i];n-=vals[i];} }
  return r;
}

// ── Rebuild one Italian/Romanian chapter file ────────────────────────────────
function rebuildFile(html, lang, confessionType) {
  // 1. Extract metadata
  const langAttr = (html.match(/html lang="([^"]*)"/) || ['',''])[1];
  const titleM = html.match(/<title>([^<]*)<\/title>/);
  const titleText = titleM ? titleM[1] : '';
  
  const testamentBadge = extractTag(html, 'testament-badge') || extractClass(html, 'testament-badge');
  const bookLatin   = extractTag(html, 'book-name-latin')   || extractClass(html, 'book-name-latin');
  const bookTrans   = extractTag(html, 'book-name-trans')   || extractClass(html, 'book-name-trans');
  const bookMeta    = extractTag(html, 'book-meta')         || extractClass(html, 'book-meta');

  // Build btrans: "BookTrans · Language"
  // Try to extract language label from book-meta or nav
  const navCenter = (html.match(/class="center">([^<]*)<\/span>/) || ['',''])[1];
  // navCenter is like "Genesis · Italiano"
  let langLabel = lang.charAt(0).toUpperCase() + lang.slice(1);
  const navM = navCenter.match(/·\s*(.+)$/);
  if (navM) langLabel = navM[1].trim();
  
  const btrans = bookTrans + ' \u00a0\u00b7\u00a0 ' + langLabel;
  
  // bmeta: just keep as-is from book-meta but format it
  // Remove translation-title and vita info, keep: "Translation · X Capita · Y Versus"
  const metaM = bookMeta.match(/(\d+)\s*Capita[^·]*·[^·]*(\d+)\s*Versus/);
  let bmeta = bookMeta;
  if (metaM) bmeta = bookMeta;

  // 2. Extract bottom nav links
  const navHtml = html.match(/<nav class="book-nav">([\s\S]*?)<\/nav>/);
  let prevLink = '<span class="dim">\u25c4</span>';
  let nextLink = '<span class="dim">\u25ba</span>';
  if (navHtml) {
    const prevM = navHtml[1].match(/<a href="([^"]+)">←\s*([^<]+)<\/a>/);
    const nextM = navHtml[1].match(/<a href="([^"]+)">([^<]+?)\s*→<\/a>/);
    if (prevM) prevLink = `<a href="${prevM[1]}">\u2190 ${prevM[2].trim()}</a>`;
    if (nextM) nextLink = `<a href="${nextM[1]}">${nextM[2].trim()} \u2192</a>`;
  }

  // 3. Extract and convert chapters
  const chapRegex = /<section class="chapter" id="ch(\d+)">([\s\S]*?)<\/section>/g;
  let chapMatch;
  let chapHtml = '';
  let chapCount = 0;

  while ((chapMatch = chapRegex.exec(html)) !== null) {
    chapCount++;
    const chapNum = parseInt(chapMatch[1]);
    const chapBody = chapMatch[2];

    // Extract chapter marker
    const romanM = chapBody.match(/class="ch-roman">([^<]*)</);
    const labelM = chapBody.match(/class="ch-label">([^<]*)</);
    const chRoman = romanM ? romanM[1].trim() : toRoman(chapNum);
    const chLabel = labelM ? labelM[1].trim() : ('Caput ' + chapNum);
    // Convert "Caput 1" to "Caput I" for chlbl-c
    const chLabelC = chLabel.replace(/\b(\d+)$/, (m, d) => toRoman(parseInt(d)));
    const chLabelP = 'Das ' + chapNum + '. Capitel';

    // Extract verses
    const verseRegex = /<div class="verse-block(?:\s+[^"]*)?"\s+id="(v\d+-\d+)">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    let verseMatch;
    let versesHtml = '';
    let isFirst = (chapNum === 1);

    while ((verseMatch = verseRegex.exec(chapBody)) !== null) {
      const vid = verseMatch[1];
      const vBody = verseMatch[2];

      // verse number
      const vnM = vBody.match(/class="verse-num">(\d+)</);
      const vn = vnM ? vnM[1] : '';

      // Latin text
      const latM = vBody.match(/class="latin">([\s\S]*?)<\/div>/);
      const latText = latM ? latM[1].trim() : '';

      // Translation text
      const traM = vBody.match(/class="trans">([\s\S]*?)<\/div>/);
      const traText = traM ? traM[1].trim() : '';

      const firstClass = isFirst ? ' first' : '';
      isFirst = false;

      versesHtml += `<div class="vb${firstClass}" id="${vid}">\n  <span class="vn">${vn}</span>\n  <div class="vt">\n    <p class="base base-c">${latText}</p>\n    <p class="base base-p">${traText}</p>\n  </div>\n</div>\n`;
    }

    chapHtml += `\n<section class="chap" id="c${chapNum}">\n  <div class="chhead">\n    <span class="chrom">${chRoman}</span>\n    <span class="chlbl chlbl-c">${chLabelC}</span>\n    <span class="chlbl chlbl-p">${chLabelP}</span>\n  </div>\n${versesHtml}</section>\n`;
  }

  if (!chapHtml) return null; // Failed to parse chapters

  // 4. Build the apple-touch-icon path
  // Italian/Romanian are at dist-diebibel/{lang}/bücher/{file}.html
  // → ../../Die Heilige Bibel rot Icon.png
  const appleIcon = '../../Die%20Heilige%20Bibel%20rot%20Icon.png';

  // 5. Build complete HTML
  const out = `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titleText}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
<style>
${CHAPTER_CSS}
</style>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M32,4V60M12,18H52' stroke='%23C8A030' stroke-width='8' fill='none' stroke-linecap='square'/></svg>">
<link rel="apple-touch-icon" sizes="180x180" href="${appleIcon}">
<meta name="theme-color" content="#2a0810">
</head>
<body>
<header class="bhead">
  <div class="btestament">${testamentBadge}</div>
  <div class="blatin blatin-c">${bookLatin}</div>
  <div class="blatin blatin-p">${bookTrans || bookLatin}</div>
  <div class="btrans">${btrans}</div>
  <div class="bmeta">${bmeta}</div>
</header>

<main class="content">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>
${chapHtml}
</main>

<nav class="bnav">
  ${prevLink}
  <a href="../index.html" class="center">${SVG_CROSS} &nbsp; Inhaltsverzeichnis</a>
  ${nextLink}
</nav>

${CONF_SCRIPT}
${BOOKMARK_SCRIPT}
</body>
</html>`;

  return out;
}

// ── Process languages ─────────────────────────────────────────────────────────
const REBUILD_LANGS = [
  { lang: 'italian',  conf: 'protestant' },
  { lang: 'romanian', conf: 'protestant' },
];

let totalRebuilt = 0;
let totalFailed = 0;

console.log('\n[1] Rebuilding Italian + Romanian chapter files with German design...');
for (const { lang, conf } of REBUILD_LANGS) {
  const bFolder = path.join(BIBLE_DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bFolder)) { console.log(`  \u26A0 No folder: ${lang}`); continue; }
  
  const files = fs.readdirSync(bFolder).filter(f => f.endsWith('.html'));
  let rebuilt = 0, failed = 0;
  
  for (const file of files) {
    const fpath = path.join(bFolder, file);
    const orig = fs.readFileSync(fpath, 'utf8');
    
    // Skip if already rebuilt (has German structure)
    if (orig.includes('class="bhead"') && !orig.includes('class="nav-bar"') && !orig.includes('Dark Red/Gold Theme Override')) {
      rebuilt++;
      continue;
    }
    
    const newHtml = rebuildFile(orig, lang, conf);
    if (newHtml && newHtml.includes('class="chap"')) {
      fs.writeFileSync(fpath, newHtml, 'utf8');
      rebuilt++;
    } else {
      console.log(`    \u26A0 Failed: ${file}`);
      failed++;
    }
  }
  
  totalRebuilt += rebuilt;
  totalFailed += failed;
  console.log(`  \u2713 ${lang}: ${rebuilt}/${files.length} rebuilt${failed ? ', ' + failed + ' failed' : ''}`);
}

// ── [2] Fix cross emoji in ALL chapter files ──────────────────────────────────
console.log('\n[2] Replacing cross emoji with SVG in ALL chapter nav links...');
const ALL_LANGS = ['albanian','croatian','czech','dutch','french','hungarian',
                   'italian','kjv','polish','portuguese','romanian','russian',
                   'spanish','swedish','tagalog','ukrainian','german'];

let crossFixed = 0;
for (const lang of ALL_LANGS) {
  const bFolder = path.join(BIBLE_DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bFolder)) continue;
  const files = fs.readdirSync(bFolder).filter(f => f.endsWith('.html'));
  let langFixed = 0;
  for (const file of files) {
    const fpath = path.join(bFolder, file);
    const orig = fs.readFileSync(fpath, 'utf8');
    // Replace ✞ character (U+271E) with SVG cross in bnav/nav links only
    if (orig.includes('\u271E')) {
      const fixed = orig.replace(/\u271E/g, SVG_CROSS);
      fs.writeFileSync(fpath, fixed, 'utf8');
      langFixed++;
    }
  }
  if (langFixed > 0) {
    console.log(`  \u2713 ${lang}: ${langFixed} files fixed`);
    crossFixed += langFixed;
  }
}
console.log(`  Total cross emoji fixed: ${crossFixed} files`);

// ── [3] Fix back cover text sizes ────────────────────────────────────────────
console.log('\n[3] Fixing Bible back-cover text sizes to match German...');

// German back-cover font sizes (from the CSS)
// .prayer-label: font-size:.52rem → bump to .85rem
// .prayer: font-size:1.16rem → bump to 1.45rem  
// .prayer-ref: font-size:.44rem → bump to .72rem
// .rule: keep same

const BC_OVERRIDE = `
/* === Text size fix === */
.prayer-label{font-size:.82rem !important;}
.prayer{font-size:1.42rem !important;line-height:1.9 !important;}
.prayer-ref{font-size:.68rem !important;}`;

// Check root back-cover
const rootBC = path.join(BIBLE_DIST, 'back-cover.html');
if (fs.existsSync(rootBC)) {
  let h = fs.readFileSync(rootBC, 'utf8');
  if (!h.includes('Text size fix')) {
    h = h.replace('</style>', BC_OVERRIDE + '\n</style>');
    fs.writeFileSync(rootBC, h, 'utf8');
    console.log('  \u2713 root back-cover text size fixed');
  }
}

// Language back-covers
for (const lang of [...ALL_LANGS, 'german']) {
  const bc = path.join(BIBLE_DIST, lang, 'back-cover.html');
  if (!fs.existsSync(bc)) continue;
  let h = fs.readFileSync(bc, 'utf8');
  if (!h.includes('Text size fix')) {
    h = h.replace('</style>', BC_OVERRIDE + '\n</style>');
    fs.writeFileSync(bc, h, 'utf8');
    console.log(`  \u2713 ${lang}/back-cover text size fixed`);
  }
}

// ── [4] Fix Quran back-cover text sizes ──────────────────────────────────────
console.log('\n[4] Fixing Quran back-cover text sizes...');
const QURAN_DIST = path.join(__dirname, 'dist-alquran');

// German Quran back-cover sizes:
// .pl: font-size:.62rem → 1.05rem
// .ar: font-size:.58rem → handled by .overlay .ar override (1.10rem)
// .dua: font-size:.78rem → 1.28rem

const QURAN_BC_OVERRIDE = `
/* === Text size fix === */
.pl{font-size:1.05rem !important;letter-spacing:.08em !important;}
.dua{font-size:1.22rem !important;line-height:1.72 !important;}
.overlay .ar{font-size:1.30rem !important;line-height:1.72 !important;}`;

const quranLangs = fs.readdirSync(path.join(QURAN_DIST, '\u00DCbersetzungen'));
let quranFixed = 0;
for (const ql of quranLangs) {
  const bc = path.join(QURAN_DIST, '\u00DCbersetzungen', ql, 'back-cover.html');
  if (!fs.existsSync(bc)) continue;
  let h = fs.readFileSync(bc, 'utf8');
  if (!h.includes('Text size fix')) {
    h = h.replace('</style>', QURAN_BC_OVERRIDE + '\n</style>');
    fs.writeFileSync(bc, h, 'utf8');
    quranFixed++;
  }
}
console.log(`  \u2713 ${quranFixed} Quran back-covers text size fixed`);

console.log(`\n\u2705 Done! Rebuilt: ${totalRebuilt} chapter files | Cross fixed: ${crossFixed} files | Back-covers fixed.\n`);
