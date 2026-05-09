'use strict';
const fs = require('fs');
const path = require('path');

const GESCHENKE = path.join(__dirname, '..', 'Geschenke');

const KORAN_STYLE_BASE = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(201,168,76,.35);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(201,168,76,.15);pointer-events:none;z-index:5;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:14px;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(201,168,76,.22) 4px,rgba(201,168,76,.22) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(201,168,76,.22) 4px,rgba(201,168,76,.22) 5px);background-size:10px 14px;pointer-events:none;z-index:6;}
.frame-top{top:0;border-bottom:1px solid rgba(201,168,76,.3);}
.frame-bot{bottom:0;border-top:1px solid rgba(201,168,76,.3);}
.book{width:min(467px,90vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.7);}
.overlay{position:absolute;bottom:0;left:0;right:0;padding:90px 24px 24px;text-align:center;}
.orn{font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.6em;color:rgba(201,168,76,.5);margin:8px 0;}
.ttl{font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.2em;color:#c9a84c;margin-bottom:4px;font-weight:600;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:1.3rem;color:#c9a84c;direction:rtl;}
.rule{width:70%;height:1px;margin:10px auto;background:linear-gradient(to right,transparent,#c9a84c,transparent);}
.pl{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.2em;color:rgba(201,168,76,.7);margin-bottom:8px;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.1rem;color:rgba(201,168,76,.9);direction:rtl;text-align:center;line-height:2;}
.dua{font-style:italic;font-size:.78rem;color:rgba(201,168,76,.75);text-align:center;line-height:1.8;margin-top:8px;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;border:2px solid #c9a84c;background:#c9a84c;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:#ddb83a;border-color:#ddb83a;}
`;

const FATIHA_AR = `\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650<br>\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u0631\u064e\u0628\u0650\u0651 \u0627\u0644\u0652\u0639\u064e\u0627\u0644\u064e\u0645\u0650\u064a\u0646\u064e<br>\u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650<br>\u0645\u064e\u0627\u0644\u0650\u0643\u0650 \u064a\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u062f\u0651\u0650\u064a\u0646\u0650<br>\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0639\u0652\u0628\u064f\u062f\u064f \u0648\u064e\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0633\u0652\u062a\u064e\u0639\u0650\u064a\u0646\u064f<br>\u0627\u0647\u0652\u062f\u0650\u0646\u064e\u0627 \u0627\u0644\u0635\u0651\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0652\u0645\u064f\u0633\u0652\u062a\u064e\u0642\u0650\u064a\u0645\u064e<br>\u0635\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0623\u064e\u0646\u0652\u0639\u064e\u0645\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u063a\u064e\u064a\u0652\u0631\u0650 \u0627\u0644\u0652\u0645\u064e\u063a\u0652\u0636\u064f\u0648\u0628\u0650 \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u0648\u064e\u0644\u064e\u0627 \u0627\u0644\u0636\u0651\u064e\u0627\u0644\u0651\u0650\u064a\u0646\u064e`;

function koranBackcover({ bg, overlayBg, btnColor, png, titleAr, dua, outPath }) {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Der Heilige Koran - R\u00fcckseite</title>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri+Quran&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
<style>
${KORAN_STYLE_BASE}
html,body{background:${bg};}
.overlay{background:${overlayBg};}
.btn{color:${btnColor};}
</style>
</head>
<body>
<div class="frame-top"></div>
<div class="frame-bot"></div>
<div class="book">
  <img src="${png}" alt="R\u00fcckseite">
  <div class="overlay">
    <div class="orn">* * *</div>
    <div class="ttl">DER HEILIGE KORAN</div>
    <div class="ttl-ar">${titleAr}</div>
    <div class="rule"></div>
    <div class="pl">\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629 &ndash; Al-Fatiha &ndash; Die \u00d6ffnende</div>
    <div class="ar">${FATIHA_AR}</div>
    <div class="rule"></div>
    <div class="dua">${dua}</div>
  </div>
</div>
<div class="btn-wrap">
  <a href="cover.html" class="btn">&larr; Zum Cover</a>
</div>
</body>
</html>`;
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Written:', outPath);
}

// Meliha
koranBackcover({
  bg: '#2d1060',
  overlayBg: 'linear-gradient(transparent 0%,rgba(20,4,56,.93) 28%,rgba(15,3,48,.98) 100%)',
  btnColor: '#2d1060',
  png: '../../Koran-Rueckseite-Meliha.png',
  titleAr: '\u0647\u062f\u064a\u0629 \u0644\u0645\u0644\u064a\u0647\u0627',
  dua: 'M\u00f6ge Allah Meliha mit Seiner Barmherzigkeit umh\u00fcllen,<br>ihr Wissen und Iman st\u00e4rken<br>und sie in dieser Welt und im Jenseits segnen. Ameen.',
  outPath: path.join(GESCHENKE, 'Koran-Deutsch-1', 'back-cover.html'),
});

// Karim
koranBackcover({
  bg: '#003a1e',
  overlayBg: 'linear-gradient(transparent 0%,rgba(0,20,10,.93) 28%,rgba(0,15,8,.98) 100%)',
  btnColor: '#003a1e',
  png: '../../Koran-Rueckseite-Karim.png',
  titleAr: '\u0647\u062f\u064a\u0629 \u0644\u0643\u0631\u064a\u0645',
  dua: 'M\u00f6ge Allah Karim mit Seinem Licht erleuchten,<br>ihn auf dem geraden Weg f\u00fchren<br>und ihn und seine Familie segnen. Ameen.',
  outPath: path.join(GESCHENKE, 'Koran-Deutsch-2', 'back-cover.html'),
});

// Koran-Gruen (Original) - fix button outside book div
const gruenHtml = fs.readFileSync(path.join(GESCHENKE, 'Koran-Gruen', 'cover.html'), 'utf8');
// Move the .z-btn div outside .book — replace closing </div>\n</body> pattern
const gruenFixed = gruenHtml
  .replace(
    `  <div class="z-btn">
    <a onclick="history.back()" class="open-btn">
      <span class="btn-orn">\u06de</span>
      <span class="btn-txt">Zur\u00fcck</span>
      <span class="btn-orn">\u06de</span>
    </a>
  </div>
</div>
</body>`,
    `</div>
<div style="text-align:center;padding:16px 0;">
  <a onclick="history.back()" style="display:inline-block;padding:11px 50px;background:#c9a84c;color:#060e08;border:2px solid #c9a84c;text-decoration:none;font:.65rem sans-serif;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;cursor:pointer;">Z U R \u00dc C K</a>
</div>
</body>`
  );
if (gruenFixed !== gruenHtml) {
  fs.writeFileSync(path.join(GESCHENKE, 'Koran-Gruen', 'cover.html'), gruenFixed, 'utf8');
  console.log('Written: Koran-Gruen/cover.html');
} else {
  console.log('WARN: Koran-Gruen pattern not found, no change');
}

// Bibel-Rot - fix button outside .page div
const rotHtml = fs.readFileSync(path.join(GESCHENKE, 'Bibel-Rot', 'cover.html'), 'utf8');
const rotFixed = rotHtml
  .replace(
    `  <div class="btn-wrap">
    <a class="btn" href="javascript:void(0)" onclick="history.back()">Z U R \u00dc C K</a>
  </div>

</div>
</body>`,
    `</div>
<div style="text-align:center;padding:16px 0;">
  <a onclick="history.back()" style="display:inline-block;padding:11px 50px;background:rgba(74,16,32,.85);color:#EDD882;border:1px solid rgba(180,138,30,.7);text-decoration:none;font:.65rem sans-serif;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;cursor:pointer;">Z U R \u00dc C K</a>
</div>
</body>`
  );
if (rotFixed !== rotHtml) {
  fs.writeFileSync(path.join(GESCHENKE, 'Bibel-Rot', 'cover.html'), rotFixed, 'utf8');
  console.log('Written: Bibel-Rot/cover.html');
} else {
  console.log('WARN: Bibel-Rot pattern not found');
  // show what's near btn-wrap
  const idx = rotHtml.indexOf('btn-wrap');
  console.log('Context:', JSON.stringify(rotHtml.slice(Math.max(0,idx-20), idx+200)));
}

// Bibel-Deutsch back-cover — overlay on PNG
const bibelBackHtml = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Die Heilige Bibel - R\u00fcckseite - Michele</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#e8e0d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(90,32,0,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(90,32,0,.13);pointer-events:none;z-index:5;}
.corner{position:fixed;width:56px;height:56px;pointer-events:none;z-index:6;}
.c-tl{top:14px;left:14px;border-top:2px solid rgba(90,32,0,.45);border-left:2px solid rgba(90,32,0,.45);}
.c-tr{top:14px;right:14px;border-top:2px solid rgba(90,32,0,.45);border-right:2px solid rgba(90,32,0,.45);}
.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(90,32,0,.45);border-left:2px solid rgba(90,32,0,.45);}
.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(90,32,0,.45);border-right:2px solid rgba(90,32,0,.45);}
.book{width:min(500px,90vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.25);}
.overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent 0%,rgba(42,8,0,.88) 30%,rgba(35,5,0,.96) 100%);padding:80px 24px 22px;text-align:center;}
.pray-label{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.28em;color:rgba(240,220,180,.65);margin-bottom:8px;}
.rule{width:65%;height:1px;margin:8px auto;background:linear-gradient(to right,transparent,rgba(200,160,80,.6),transparent);}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.82rem;color:rgba(245,232,200,.85);line-height:1.85;}
.pray-ref{font-family:'Cinzel',serif;font-size:.42rem;color:rgba(200,160,80,.5);margin-top:5px;}
.verse{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.75rem;color:rgba(240,220,180,.75);line-height:1.8;margin-top:4px;}
.verse-ref{font-family:'Cinzel',serif;font-size:.4rem;color:rgba(200,160,80,.45);margin-top:3px;}
.dua{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.75rem;color:rgba(240,220,180,.8);line-height:1.8;margin-top:6px;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:13px 56px;color:#f0e8d0;text-decoration:none;font-family:'Cinzel',serif;font-size:.7rem;font-weight:600;letter-spacing:.28em;border:2px solid #5a2000;background:#5a2000;transition:all .22s;}
.btn:hover{background:#7a3010;border-color:#7a3010;}
</style>
</head>
<body>
<div class="corner c-tl"></div>
<div class="corner c-tr"></div>
<div class="corner c-bl"></div>
<div class="corner c-br"></div>
<div class="book">
  <img src="../../../Bibel-Rueckseite-Michele.png" alt="R\u00fcckseite">
  <div class="overlay">
    <div class="pray-label">\u2726 &nbsp; Das Vaterunser &nbsp; \u2726</div>
    <div class="prayer">
      Vater unser im Himmel,<br>
      geheiligt werde dein Name.<br>
      Dein Reich komme. Dein Wille geschehe,<br>
      wie im Himmel, so auf Erden.<br>
      Unser t\u00e4gliches Brot gib uns heute.<br>
      Vergib uns unsere Schuld,<br>
      wie auch wir vergeben unsern Schuldigern.<br>
      F\u00fchre uns nicht in Versuchung,<br>
      sondern erl\u00f6se uns von dem B\u00f6sen. Amen.
    </div>
    <div class="pray-ref">Matth\u00e4us 6,9\u201313</div>
    <div class="rule"></div>
    <div class="dua">M\u00f6ge Gott Michele in ihrer Trauer tragen,<br>ihr Trost schenken und ihr Herz heilen.<br>Sie ist nicht allein &mdash; Er ist bei ihr. Amen.</div>
    <div class="verse">\u00abKommt her zu mir alle, die ihr m\u00fchselig und beladen seid,<br>so will ich euch erquicken.\u00bb</div>
    <div class="verse-ref">Matth\u00e4us 11,28</div>
  </div>
</div>
<div class="btn-wrap">
  <a class="btn" href="cover.html">&larr; Zum Cover</a>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(GESCHENKE, 'Bibel-Deutsch', '\u00dcbersetzungen', 'back-cover.html'), bibelBackHtml, 'utf8');
console.log('Written: Bibel-Deutsch back-cover');
