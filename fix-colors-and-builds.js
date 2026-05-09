'use strict';
const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const K1   = path.join(BASE, 'Geschenke', 'Koran-Deutsch-1');
const CB   = path.join(BASE, 'CATHOLIC-BIBLE');

// ═══════════════════════════════════════════════════════════════════════════
// 1.  Fix redesign7.js  Koran-Deutsch-1:  pink → purple
// ═══════════════════════════════════════════════════════════════════════════
const r7path = path.join(K1, 'redesign7.js');
let r7 = fs.readFileSync(r7path, 'utf8');

const R7_PAIRS = [
  // background colors
  ['#fff0f5',               '#f0ecf8'],
  ['#fde0ee',               '#ece8f8'],
  ['#ffe0ef',               '#ece8f8'],
  ['rgba(245,220,235,1)',   'rgba(225,218,252,1)'],
  // header / nav / footer bg
  ['#360e28',               '#2d1060'],
  ['#180a10',               '#150030'],
  ['#200818',               '#1a0850'],
  ['#2a0a22',               '#1a0a40'],
  ['#2a0820',               '#1a0840'],
  ['#1e0416',               '#1a0050'],
  ['#180514',               '#080028'],
  ['#080208',               '#050018'],
  ['#381028',               '#2d1060'],
  ['#200a1a',               '#1a0a40'],
  ['#180838',               '#180840'],
  ['#1a0814',               '#180840'],
  // ink colors in body text
  ['color:#180838',         'color:#180840'],
  // all pink rgba border/rule/hover → purple
  ['rgba(180,60,100,',      'rgba(100,80,180,'],
  ['rgba(180,70,100,',      'rgba(100,80,180,'],
  // page-wrap margin / max-width
  ['max-width:min(960px,96vw);margin:0 auto;', 'max-width:min(960px,92vw);margin:20px auto;'],
];

for (const [from, to] of R7_PAIRS) {
  const count = (r7.split(from).length - 1);
  r7 = r7.split(from).join(to);
  if (count) console.log(`  redesign7.js  "${from}" → "${to}"  (${count}x)`);
}

fs.writeFileSync(r7path, r7, 'utf8');
console.log('✅  redesign7.js Koran-Deutsch-1 gepatcht\n');

// ═══════════════════════════════════════════════════════════════════════════
// 2.  Fix build3.js  CATHOLIC-BIBLE:  back-cover function
// ═══════════════════════════════════════════════════════════════════════════
const b3path = path.join(CB, 'build3.js');
let b3 = fs.readFileSync(b3path, 'utf8');

// Replace the full buildBackCover function body
const OLD_BACK = `function buildBackCover() {
  return \`<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica – Rückseite</title>
\${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#2a0810;display:flex;align-items:flex-start;justify-content:center;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.45);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.18);pointer-events:none;z-index:5;}
.corner{position:fixed;width:44px;height:44px;pointer-events:none;z-index:6;}
.c-tl{top:20px;left:20px;border-top:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-tr{top:20px;right:20px;border-top:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
.c-bl{bottom:20px;left:20px;border-bottom:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-br{bottom:20px;right:20px;border-bottom:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
.page{width:100%;max-width:620px;display:flex;flex-direction:column;align-items:center;padding:24px 40px 36px;}
.book{width:min(467px,90vw);position:relative;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.7);}
.overlay{position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent 0%,rgba(42,8,16,.93) 28%,rgba(42,8,16,.98) 100%);
  padding:90px 28px 24px;text-align:center;}
.rule{width:80%;height:1px;margin:10px 0;background:linear-gradient(to right,transparent,#C8A030 20%,#EDD882 50%,#C8A030 80%,transparent);}
.prayer-label{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.28em;color:rgba(200,160,48,.5);text-align:center;margin-bottom:8px;}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.85rem;color:rgba(237,216,130,.85);text-align:center;line-height:1.85;}
.prayer-ref{font-family:'Cinzel',serif;font-size:.48rem;color:rgba(200,160,48,.38);text-align:center;margin-top:6px;}
.verse{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.8rem;color:rgba(237,216,130,.68);text-align:center;line-height:1.85;margin-top:4px;}
.verse-ref{font-family:'Cinzel',serif;font-size:.46rem;color:rgba(200,160,48,.38);text-align:center;margin-top:3px;}
.copy{font-family:'Cinzel',serif;font-size:.72rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,48,.82);text-align:center;margin-top:10px;}
.back-link{display:inline-block;margin-top:12px;padding:10px 40px;background:#5a0818;color:#EDD882;border:2px solid #5a0818;text-decoration:none;font:.65rem sans-serif;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:opacity .18s;}
.back-link:hover{opacity:.85;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div><div class="corner c-bl"></div><div class="corner c-br"></div>
<div class="page">
  <div class="book">
    <img src="../../Bibel-Rueckseite-Katholisch.png" alt="Rückseite">
    <div class="overlay">
      <div class="rule"></div>
      <div class="prayer-label">✦ &nbsp; Pater Noster &nbsp; ✦</div>
      <div class="prayer">
        Pater noster, qui es in caelis,<br>
        sanctificetur nomen tuum.<br>
        Adveniat regnum tuum.<br>
        Fiat voluntas tua, sicut in caelo et in terra.<br>
        Panem nostrum quotidianum da nobis hodie.<br>
        Et dimitte nobis debita nostra,<br>
        sicut et nos dimittimus debitoribus nostris.<br>
        Et ne nos inducas in tentationem,<br>
        sed libera nos a malo. Amen.
      </div>
      <div class="prayer-ref">Matthaeus 6,9–13 &nbsp;·&nbsp; Vulgata</div>
      <div class="rule"></div>
      <div class="verse">«Scrutamini scripturas, quia vos putatis<br>in ipsis vitam aeternam habere.»</div>
      <div class="verse-ref">Ioannes 5,39 &nbsp;·&nbsp; Vulgata Clementina</div>
      <div class="copy">Eigentum von KX Books</div>
      <a href="cover.html" class="back-link">← Zum Cover</a>
    </div>
  </div>
</div>
</body>
</html>\`;
}`;

const NEW_BACK = `function buildBackCover() {
  return \`<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica \u2013 R\u00fcckseite</title>
\${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#1a0005;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.35);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.15);pointer-events:none;z-index:5;}
.corner{position:fixed;width:44px;height:44px;pointer-events:none;z-index:6;}
.c-tl{top:20px;left:20px;border-top:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-tr{top:20px;right:20px;border-top:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.c-bl{bottom:20px;left:20px;border-bottom:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-br{bottom:20px;right:20px;border-bottom:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.book{width:min(467px,90vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.5);}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 28px 5%;text-align:center;}
.prayer-label{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.28em;color:#3a0005;margin-bottom:8px;}
.rule{width:70%;height:1px;margin:7px auto;background:linear-gradient(to right,transparent,#5a1000,transparent);}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.9rem;color:#200005;line-height:1.85;hyphens:none;-webkit-hyphens:none;}
.prayer-ref{font-family:'Cinzel',serif;font-size:.44rem;color:#5a1000;margin-top:6px;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;background:#5a0010;color:#EDD882;border:2px solid #5a0010;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:#7a1020;border-color:#7a1020;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<div class="book">
  <img src="../../Bibel-Rueckseite-Katholisch.png" alt="R\u00fcckseite">
  <div class="overlay">
    <div class="prayer-label">\u2726 &nbsp; Pater Noster &nbsp; \u2726</div>
    <div class="prayer">
      Pater noster, qui es in caelis,<br>
      sanctificetur nomen tuum.<br>
      Adveniat regnum tuum.<br>
      Fiat voluntas tua, sicut in caelo et in terra.<br>
      Panem nostrum quotidianum da nobis hodie.<br>
      Et dimitte nobis debita nostra,<br>
      sicut et nos dimittimus debitoribus nostris.<br>
      Et ne nos inducas in tentationem,<br>
      sed libera nos a malo. Amen.
    </div>
    <div class="prayer-ref">Matthaeus 6,9\u201313 &nbsp;\u00b7&nbsp; Vulgata</div>
  </div>
</div>
<div class="btn-wrap">
  <a href="cover.html" class="btn">\u2190 Zum Cover</a>
</div>
</body>
</html>\`;
}`;

if (b3.includes(OLD_BACK)) {
  b3 = b3.replace(OLD_BACK, NEW_BACK);
  console.log('✅  build3.js buildBackCover() gepatcht\n');
} else {
  console.warn('⚠️   build3.js: OLD_BACK nicht gefunden — prüfe manuell');
}

fs.writeFileSync(b3path, b3, 'utf8');

// ═══════════════════════════════════════════════════════════════════════════
// 3.  Fast bulk-replace on EXISTING Koran-Deutsch-1 HTML files (instant,
//     no API needed) — same color map as redesign7.js
// ═══════════════════════════════════════════════════════════════════════════
const HTML_PAIRS = [
  ['#fff0f5',               '#f0ecf8'],
  ['#fde0ee',               '#ece8f8'],
  ['#ffe0ef',               '#ece8f8'],
  ['rgba(245,220,235,1)',   'rgba(225,218,252,1)'],
  ['#360e28',               '#2d1060'],
  ['#180a10',               '#150030'],
  ['#200818',               '#1a0850'],
  ['#2a0a22',               '#1a0a40'],
  ['#2a0820',               '#1a0840'],
  ['#1e0416',               '#1a0050'],
  ['#180514',               '#080028'],
  ['#080208',               '#050018'],
  ['#381028',               '#2d1060'],
  ['#200a1a',               '#1a0a40'],
  ['rgba(180,60,100,',      'rgba(100,80,180,'],
  ['rgba(180,70,100,',      'rgba(100,80,180,'],
  ['max-width:min(960px,96vw);margin:0 auto;', 'max-width:min(960px,92vw);margin:20px auto;'],
];

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walkHtml(full); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let src = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [from, to] of HTML_PAIRS) {
      if (src.includes(from)) { src = src.split(from).join(to); changed = true; }
    }
    if (changed) fs.writeFileSync(full, src, 'utf8');
  }
}

const k1Uber = path.join(K1, 'Übersetzungen');
walkHtml(k1Uber);
console.log('✅  Bulk-HTML-Fix auf Koran-Deutsch-1/Übersetzungen/ abgeschlossen\n');

console.log('Alle Patches fertig. Starte jetzt node build3.js in CATHOLIC-BIBLE...');
