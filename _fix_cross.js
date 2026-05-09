const fs = require('fs');

// ── fix build4.js ──────────────────────────────────────────────────────────
let b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

// Fix ALL instances of watermark cross CSS (two template functions have it)
const oldCss = '.b-wm path{fill:none;stroke:rgba(184,150,46,.07);stroke-width:.018;stroke-linecap:butt;}';
const newCss = '.b-wm path{fill:none;stroke:rgba(184,150,46,.09);stroke-width:.6;stroke-linecap:square;}';
const cssBefore = b4.split(oldCss).length - 1;
b4 = b4.split(oldCss).join(newCss);
console.log('b4 b-wm CSS fixed:', cssBefore, 'instances');

// Fix ALL instances of watermark cross SVG
const oldSvg = 'viewBox="0 0 2 3"><path d="M1,0V3M0,.9H2"/>';
const newSvg = 'viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/>';
const svgBefore = b4.split(oldSvg).length - 1;
b4 = b4.split(oldSvg).join(newSvg);
console.log('b4 b-wm SVG fixed:', svgBefore, 'instances');

fs.writeFileSync('CATHOLIC-BIBLE/build4.js', b4, 'utf8');
console.log('b4 saved');

// ── fix build3.js ──────────────────────────────────────────────────────────
let b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

// Fix h-cross-big emoji if still present
const emojiBefore3 = b3.split('\u271d').length - 1;
if (emojiBefore3 > 0) {
  // Replace CSS
  b3 = b3.split('.h-cross-big{\r\n  font-size:3.8rem;color:#8B6400;\r\n  line-height:1;margin-bottom:16px;position:relative;\r\n}')
         .join('.h-cross-big{\r\n  display:block;width:40px;height:56px;margin:0 auto 16px;\r\n}');
  // Replace HTML
  b3 = b3.split('<div class="h-cross-big">\u271d</div>')
         .join('<svg class="h-cross-big" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10" fill="none" stroke="#8B6400" stroke-width="1.4" stroke-linecap="square"/></svg>');
  console.log('b3 emoji cross fixed:', emojiBefore3, 'instances');
} else {
  console.log('b3 emoji cross: already fixed (0 instances)');
}
fs.writeFileSync('Geschenke/Bibel-Deutsch/build3.js', b3, 'utf8');
console.log('b3 saved');

// ── fix build-surge.js favicon ─────────────────────────────────────────────
let bs = fs.readFileSync('build-surge.js', 'utf8');
// Replace text-based cross with path-based cross (no emoji rendering)
const oldFav = "<text y='54' font-size='52' font-family='serif' fill='%23C8A030'>&#x271D;</text>";
const newFav = "<path d='M32,4V60M12,18H52' stroke='%23C8A030' stroke-width='8' fill='none' stroke-linecap='square'/>";
if (bs.includes(oldFav)) {
  bs = bs.split(oldFav).join(newFav);
  console.log('favicon fixed');
} else {
  console.log('favicon: pattern not found, checking...');
  const fi = bs.indexOf('BIBLE_FAVICON');
  console.log(JSON.stringify(bs.slice(fi, fi + 250)));
}
fs.writeFileSync('build-surge.js', bs, 'utf8');
console.log('build-surge.js saved');
