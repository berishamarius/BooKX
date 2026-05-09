'use strict';
// Fix build4.js: all index-based (CRLF-safe), no template-string comparisons
const fs = require('fs');
const path = require('path');
const IP = '\u00ef\u00bf\u00bd'; // the 3-byte ï¿½ sequence

const B4 = path.join(__dirname, 'CATHOLIC-BIBLE', 'build4.js');
let s = fs.readFileSync(B4, 'utf8');

function cutAndReplace(label, startMark, endMark, newContent) {
  const si = s.indexOf(startMark);
  if (si < 0) { console.error('NOT FOUND startMark for: ' + label + ' => ' + startMark.slice(0,60)); process.exit(1); }
  const ei = s.indexOf(endMark, si + startMark.length);
  if (ei < 0) { console.error('NOT FOUND endMark for: ' + label); process.exit(1); }
  s = s.slice(0, si) + newContent + s.slice(ei + endMark.length);
  console.log('OK ' + label);
}

// 1. Fix OUT_DIR  (byte 0xDC stored as U+00DC in the JS string)
cutAndReplace('OUT_DIR',
  "path.join(__dirname, '\u00dc",   // Ü stored as single char U+00DC
  "')",                              // closes quote+paren
  "path.join(__dirname, '\u00dcbersetzungen')"
);

// 2. Strip TRANSLATIONS to German only
cutAndReplace('TRANSLATIONS',
  'const TRANSLATIONS = [',
  '];',
  `const TRANSLATIONS = [
  { code: 'german', lang: 'de', native: 'Deutsch', display: 'Textbibel (1906)', flag: '\ud83c\udde9\ud83c\uddea' },
];`
);

// 3. Strip BIBLE_NAMES to de+en
cutAndReplace('BIBLE_NAMES',
  'const BIBLE_NAMES = {',
  '\n};',
  `const BIBLE_NAMES = {
  en: 'The Holy Bible',
  de: 'Die Heilige Bibel',
}`
);

// 4. Strip READ_BTN to de+en  (find label comment + block)
cutAndReplace('READ_BTN comment',
  '// Schaltfl' + IP + 'che "Lesen" pro Sprache',
  '\n};',
  `// Schaltfl\u00e4che "Lesen" pro Sprache
const READ_BTN = {
  en: 'R E A D',
  de: 'L E S E N',
}`
);

// 5. Strip BOOK_NAMES to de+en + fix German umlauts
{
  const bmHdr = '// Buchbezeichnungen pro Sprache (Index = Buchnr - 1)';
  const si = s.indexOf(bmHdr);
  if (si < 0) { console.error('BOOK_NAMES header not found'); process.exit(1); }
  // Find closing }; by brace counting from opening {
  const openBrace = s.indexOf('{', si);
  let depth = 0, bnEnd = -1;
  for (let i = openBrace; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') { depth--; if (depth === 0) { bnEnd = i + 1; break; } }
  }
  if (s[bnEnd] === ';') bnEnd++;
  const block = s.slice(si, bnEnd);
  const bLines = block.split('\n');
  const enLine = bLines.find(l => l.trimStart().startsWith('en:'));
  let deLine   = bLines.find(l => l.trimStart().startsWith('de:'));
  if (!enLine || !deLine) { console.error('BOOK_NAMES en/de not found'); process.exit(1); }
  deLine = deLine
    .split('K' + IP + 'nige').join('K\u00f6nige')
    .split('Sprichw' + IP + 'rter').join('Sprichw\u00f6rter')
    .split('Matth' + IP + 'us').join('Matth\u00e4us')
    .split('R' + IP + 'mer').join('R\u00f6mer')
    .split('Hebr' + IP + 'er').join('Hebr\u00e4er')
    .split('Makkab' + IP + 'er').join('Makkab\u00e4er')
    .split('Zus' + IP + 'tze').join('Zus\u00e4tze');
  const newBlock = `${bmHdr}
const BOOK_NAMES = {
${enLine.replace(/\r$/, '')},
${deLine.replace(/\r$/, '')}
};`;
  s = s.slice(0, si) + newBlock + s.slice(bnEnd);
  console.log('OK BOOK_NAMES stripped+fixed');
}

// 6. Fix bücher paths
s = s.split('b' + IP + 'cher/').join('b\u00fccher/');
s = s.split('"b' + IP + 'cher"').join('"b\u00fccher"');
s = s.split("'b" + IP + "cher'").join("'b\u00fccher'");
console.log('OK buecher path');

// 7. Fix section separators and labels
s = s.split('&nbsp;' + IP + '&nbsp;').join('&nbsp;\u00b7&nbsp;');
s = s.split('"tarr">' + IP + '</span>').join('"tarr">\u203a</span>');
s = s.split('Deuterokanonische B' + IP + 'cher').join('Deuterokanonische B\u00fccher');
s = s.split('} B' + IP + 'cher)').join('} B\u00fccher)');
console.log('OK labels');

// 8. Fix cross CSS
{
  const old = '.b-wm path{fill:none;stroke:rgba(184,150,46,.07);stroke-width:.018;stroke-linecap:butt;}';
  const neu = '.b-wm path{fill:none;stroke:rgba(184,150,46,.09);stroke-width:.6;stroke-linecap:square;}';
  if (s.includes(old)) { s = s.replace(old, neu); console.log('OK cross CSS'); }
  else console.error('SKIP cross CSS not found');
}

// 9. Fix cross SVG
{
  const old = 'viewBox="0 0 2 3"><path d="M1,0V3M0,.9H2"/>';
  const neu = 'viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/>';
  if (s.includes(old)) { s = s.replace(old, neu); console.log('OK cross SVG'); }
  else console.error('SKIP cross SVG not found');
}

// 10. Write
fs.writeFileSync(B4, s, 'utf8');
const remaining = (s.match(new RegExp(IP, 'g')) || []).length;
console.log('\nDONE build4.js — remaining IP: ' + remaining);
s.split('\n').forEach((l, i) => { if (l.includes(IP)) console.log('  L'+(i+1)+': '+l.trim().slice(0,110)); });


