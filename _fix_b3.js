// Fix build3.js (restored clean from git):
// 1. Fix cross SVG proportions
// 2. Fix backcover: add corners, div→a, remove btn
// 3. Fix cover: div→a, remove btn (if needed)
// 4. Ensure OUT_DIR is UTF-8 'Übersetzungen'

const fs = require('fs');
let b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

console.log('b3 umlauts:', (b3.match(/[äöüÄÖÜß]/g)||[]).length, '(should be ~64)');
console.log('b3 bad chars:', (b3.match(/\uFFFD/g)||[]).length, '(should be 0)');

// ── 1. Fix cross SVG proportions ─────────────────────────────────────────
// Better viewBox + path: square cross, crossbar ~29% down
b3 = b3.replace(
  /\.b-wm path\{fill:none;stroke:rgba\([^)]+\);stroke-width:[^;]+;stroke-linecap:butt;\}/g,
  '.b-wm path{fill:none;stroke:rgba(90,32,0,.08);stroke-width:.6;stroke-linecap:square;}'
);
b3 = b3.replace(
  /<div class="b-wm"><svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 2 3"><path d="M1,0V3M0,\.9H2"\/><\/svg><\/div>/g,
  '<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>'
);
console.log('cross fixed:', b3.includes('viewBox="0 0 10 14"'));

// ── 2. Fix cover page: div→a, remove btn-wrap ────────────────────────────
// Check cover: should already link image, but verify btn-wrap
const coverBtnCount = (b3.match(/class="btn-wrap"/g)||[]).length;
console.log('btn-wrap in cover sections:', coverBtnCount);

// ── 3. Fix backcover ──────────────────────────────────────────────────────
// Remove .btn-wrap + .btn + .btn:hover CSS from BACKCOVER style block (last occurrence)
let lastBtnCss = -1, pos = 0;
while (true) {
  const found = b3.indexOf('\r\n.btn-wrap{', pos);
  if (found < 0) break;
  lastBtnCss = found;
  pos = found + 1;
}
if (lastBtnCss >= 0) {
  const btnHoverStart = b3.indexOf('\r\n.btn:hover{', lastBtnCss);
  if (btnHoverStart >= 0) {
    const btnHoverEnd = b3.indexOf('}', btnHoverStart + 13) + 1;
    b3 = b3.slice(0, lastBtnCss) + b3.slice(btnHoverEnd);
    console.log('b3 backcover btn CSS removed');
  }
}

// Add frame CSS to backcover if not there
if (!b3.includes('body::before{content:')) {
  // Find the backcover style block ending
  // Look for the last .copy{ class before </style> in backcover
  const lastCopy = b3.lastIndexOf('.copy{');
  const copyEnd = b3.indexOf('}', lastCopy) + 1;
  const frameCSS = '\r\nbody::before{content:\'\';position:fixed;inset:16px;border:1px solid rgba(90,32,0,.28);pointer-events:none;z-index:5;}\r\nbody::after{content:\'\';position:fixed;inset:28px;border:1px solid rgba(90,32,0,.11);pointer-events:none;z-index:5;}\r\n.corner{position:fixed;width:52px;height:52px;pointer-events:none;z-index:6;}\r\n.c-tl{top:14px;left:14px;border-top:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}\r\n.c-tr{top:14px;right:14px;border-top:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}\r\n.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}\r\n.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}';
  b3 = b3.slice(0, copyEnd) + frameCSS + b3.slice(copyEnd);
  console.log('b3 frame CSS added');
} else {
  console.log('b3 frame CSS already present');
}

// Fix <body><div class="book"> → <body><corners><a class="book">
let lastBodyDiv = -1;
pos = 0;
while (true) {
  const found = b3.indexOf('<body>\r\n<div class="book">', pos);
  if (found < 0) break;
  lastBodyDiv = found;
  pos = found + 1;
}
if (lastBodyDiv >= 0) {
  b3 = b3.slice(0, lastBodyDiv)
    + '<body>\r\n<div class="corner c-tl"></div><div class="corner c-tr"></div>\r\n<div class="corner c-bl"></div><div class="corner c-br"></div>\r\n<a class="book" href="cover.html">'
    + b3.slice(lastBodyDiv + '<body>\r\n<div class="book">'.length);
  console.log('b3 corners + div→a done');
} else {
  console.log('b3 <body><div class=book> not found');
}

// Remove btn-wrap HTML + change </div>→</a>
const b3BtnLink = b3.lastIndexOf('<a class="btn" href="cover.html">');
if (b3BtnLink >= 0) {
  const b3BtnWrapDiv = b3.lastIndexOf('\r\n<div class="btn-wrap">', b3BtnLink);
  const b3ClosingDiv = b3.lastIndexOf('\r\n</div>', b3BtnWrapDiv);
  const b3BodyEnd = b3.indexOf('\r\n</body>', b3BtnLink);
  if (b3ClosingDiv >= 0 && b3BodyEnd >= 0) {
    b3 = b3.slice(0, b3ClosingDiv) + '\r\n</a>' + b3.slice(b3BodyEnd);
    console.log('b3 btn-wrap HTML removed, </div>→</a>');
  }
} else {
  console.log('b3 btn-wrap HTML not found (already fixed?)');
}

// ── 4. Ensure OUT_DIR uses correct Ü ──────────────────────────────────────
b3 = b3.split('\uFFFDbersetzungen').join('Übersetzungen');
b3 = b3.split('\u00ef\u00bf\u00bdbersetzungen').join('Übersetzungen');

fs.writeFileSync('Geschenke/Bibel-Deutsch/build3.js', b3);
console.log('\nbuild3.js saved.');
console.log('btn-wrap total:', (b3.match(/btn-wrap/g)||[]).length);
console.log('cross 10 14:', b3.includes('viewBox="0 0 10 14"'));
console.log('<a class=book href=cover.html>:', b3.includes('<a class="book" href="cover.html">'));
console.log('corners HTML:', b3.includes('<div class="corner c-tl">'));
