const fs = require('fs');

// ============================================================
//  build4.js fixes  (index-based, no special-char matching)
// ============================================================
let b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

// 1. Remove .btn-wrap + .btn + .btn:hover from backcover CSS
const b4BtnCss = b4.indexOf('\r\n.btn-wrap{text-align:center;');
if (b4BtnCss >= 0) {
  const b4BtnHoverStart = b4.indexOf('\r\n.btn:hover{', b4BtnCss);
  if (b4BtnHoverStart >= 0) {
    const b4BtnHoverEnd = b4.indexOf('}', b4BtnHoverStart + 13) + 1;
    b4 = b4.slice(0, b4BtnCss) + b4.slice(b4BtnHoverEnd);
    console.log('b4 CSS btn removed');
  } else { console.log('b4 .btn:hover not found'); }
} else { console.log('b4 .btn-wrap CSS not found (already removed?)'); }

// 2. Fix HTML: <div class="book"> → <a class="book" href="${coverLink}">
const b4DivBook = b4.indexOf('<div class="book">\r\n  <img src="${imgPath}"');
if (b4DivBook >= 0) {
  b4 = b4.slice(0, b4DivBook)
    + '<a class="book" href="${coverLink}">'
    + b4.slice(b4DivBook + '<div class="book">'.length);
  console.log('b4 HTML div->a done');
} else { console.log('b4 <div class="book"> not found'); }

// 3. Remove btn-wrap block + change </div> to </a>
const b4BtnWrap = b4.indexOf('\r\n<div class="btn-wrap">\r\n  <a href="${coverLink}"');
if (b4BtnWrap >= 0) {
  const b4ClosingDiv = b4.lastIndexOf('\r\n</div>', b4BtnWrap);
  const b4BodyEnd = b4.indexOf('\r\n</body>', b4BtnWrap);
  if (b4ClosingDiv >= 0 && b4BodyEnd >= 0) {
    b4 = b4.slice(0, b4ClosingDiv) + '\r\n</a>' + b4.slice(b4BodyEnd);
    console.log('b4 btn-wrap removed, </div>-></a>');
  } else { console.log('b4 closing div or body not found', b4ClosingDiv, b4BodyEnd); }
} else { console.log('b4 btn-wrap HTML block not found'); }

fs.writeFileSync('CATHOLIC-BIBLE/build4.js', b4);
console.log('b4 result <a>:', b4.includes('class="book" href="${coverLink}"'));
console.log('b4 btn-wrap left:', (b4.match(/btn-wrap/g)||[]).length);

// ============================================================
//  build3.js fixes  (index-based, no special-char matching)
// ============================================================
let b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

// 1. Remove LAST .btn-wrap + .btn + .btn:hover CSS (backcover style block)
let lastBtnCss = -1, pos = 0;
while (true) {
  const found = b3.indexOf('\r\n.btn-wrap{', pos);
  if (found < 0) break;
  lastBtnCss = found;
  pos = found + 1;
}
console.log('\nb3 last .btn-wrap CSS at:', lastBtnCss);
if (lastBtnCss >= 0) {
  const b3BtnHoverStart = b3.indexOf('\r\n.btn:hover{', lastBtnCss);
  if (b3BtnHoverStart >= 0) {
    const b3BtnHoverEnd = b3.indexOf('}', b3BtnHoverStart + 13) + 1;
    b3 = b3.slice(0, lastBtnCss) + b3.slice(b3BtnHoverEnd);
    console.log('b3 CSS btn removed');
  } else { console.log('b3 .btn:hover not found'); }
} else { console.log('b3 .btn-wrap CSS not found'); }

// 2. Add corners + fix <div class="book"> → <a> in backcover <body>
//    Find last <body>\r\n<div class="book"> occurrence
let lastBodyDiv = -1, bodyPos = 0;
while (true) {
  const found = b3.indexOf('<body>\r\n<div class="book">', bodyPos);
  if (found < 0) break;
  lastBodyDiv = found;
  bodyPos = found + 1;
}
console.log('b3 last <body><div class=book> at:', lastBodyDiv);
if (lastBodyDiv >= 0) {
  b3 = b3.slice(0, lastBodyDiv)
    + '<body>\r\n<div class="corner c-tl"></div><div class="corner c-tr"></div>\r\n<div class="corner c-bl"></div><div class="corner c-br"></div>\r\n<a class="book" href="cover.html">'
    + b3.slice(lastBodyDiv + '<body>\r\n<div class="book">'.length);
  console.log('b3 corners + div->a done');
} else { console.log('b3 <body><div class=book> not found'); }

// 3. Remove btn-wrap block + change </div> to </a>
const b3BtnLink = b3.lastIndexOf('<a class="btn" href="cover.html">');
if (b3BtnLink >= 0) {
  const b3BtnWrapDiv = b3.lastIndexOf('\r\n<div class="btn-wrap">', b3BtnLink);
  const b3ClosingDiv = b3.lastIndexOf('\r\n</div>', b3BtnWrapDiv);
  const b3BodyEnd = b3.indexOf('\r\n</body>', b3BtnLink);
  console.log('b3 splice:', b3ClosingDiv, b3BtnWrapDiv, b3BodyEnd);
  if (b3ClosingDiv >= 0 && b3BodyEnd >= 0) {
    b3 = b3.slice(0, b3ClosingDiv) + '\r\n</a>' + b3.slice(b3BodyEnd);
    console.log('b3 btn-wrap removed, </div>-></a>');
  } else { console.log('b3 closing div or body not found'); }
} else { console.log('b3 btn link not found'); }

fs.writeFileSync('Geschenke/Bibel-Deutsch/build3.js', b3);
console.log('b3 result <a>:', b3.includes('class="book" href="cover.html"'));
console.log('b3 corners:', b3.includes('<div class="corner c-tl">'));
console.log('b3 btn-wrap left:', (b3.match(/btn-wrap/g)||[]).length);
