const fs = require('fs');

// ── Fix b3 ──────────────────────────────────────────────────────────────
let b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

// 1) Watermark CSS: old thin brown → same as b4 (gold, 1.5, square)
const oldWm3 = 'stroke:rgba(90,32,0,.06);stroke-width:.018;stroke-linecap:butt';
const newWm3 = 'stroke:rgba(184,150,46,.13);stroke-width:1.5;stroke-linecap:square';
let n = b3.split(oldWm3).length - 1;
console.log('b3 watermark instances:', n);
b3 = b3.split(oldWm3).join(newWm3);

// 2) h-cross-big: old brown + 1.4 → gold + 1.8 (wider)
const oldCross3 = 'stroke="#8B6400" stroke-width="1.4"';
const newCross3 = 'stroke="#C8A030" stroke-width="1.8"';
n = b3.split(oldCross3).length - 1;
console.log('b3 h-cross-big instances:', n);
b3 = b3.split(oldCross3).join(newCross3);

fs.writeFileSync('Geschenke/Bibel-Deutsch/build3.js', b3, 'utf8');
console.log('b3 saved');

// ── Fix b4: only widen h-cross-big (1.4 → 1.8) ──────────────────────────
let b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

const oldCross4 = 'stroke="#C8A030" stroke-width="1.4"';
const newCross4 = 'stroke="#C8A030" stroke-width="1.8"';
n = b4.split(oldCross4).length - 1;
console.log('b4 h-cross-big instances:', n);
b4 = b4.split(oldCross4).join(newCross4);

fs.writeFileSync('CATHOLIC-BIBLE/build4.js', b4, 'utf8');
console.log('b4 saved');
