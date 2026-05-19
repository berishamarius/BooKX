// check-bytes.js — read actual bytes from Czech chapter title
'use strict';
const fs = require('fs');
const buf = fs.readFileSync('dist-diebibel/czech/b\u00FCcher/001-gen.html');
const str = buf.toString('utf8');
const ti = str.indexOf('<title>');
const te = str.indexOf('</title>');
const title = str.substring(ti, te + 8);
console.log('Title as utf8:', JSON.stringify(title));
console.log('Title length:', title.length);

// Find "tina" position
const idx = str.indexOf('tina');
console.log('"tina" at pos:', idx);
const bytes = buf.slice(idx - 5, idx + 10);
console.log('Bytes before "tina":', bytes.toString('hex'));
console.log('As chars:', Array.from(bytes).map(b => `${b}(${String.fromCharCode(b)})`).join(' '));

// Check what characters are around position of potential corruption
const TRIPLE = '\u00CF\u00BF\u00BD';
console.log('Has TRIPLE (0xCF 0xBF 0xBD):', str.includes(TRIPLE));
const FFFD = '\uFFFD';
console.log('Has FFFD:', str.includes(FFFD));

// Find all non-ASCII around "tina"
let ci = str.indexOf('tina');
console.log('\nContext as codepoints:');
for (let i = Math.max(0, ci-5); i < Math.min(str.length, ci+10); i++) {
  const cp = str.charCodeAt(i);
  console.log(`  [${i}] U+${cp.toString(16).toUpperCase().padStart(4,'0')} '${str[i]}'`);
}
