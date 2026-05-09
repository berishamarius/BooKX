const fs = require('fs');
const b3 = fs.readFileSync('Geschenke/Bibel-Deutsch/build3.js', 'utf8');

// Find all <div class="book"> occurrences
let p = 0;
while(true) {
  const i = b3.indexOf('<div class="book">', p);
  if (i < 0) break;
  const line = b3.slice(0, i).split('\n').length;
  console.log('DIV index:', i, 'line ~'+line, '|', JSON.stringify(b3.slice(i, i+50)));
  p = i + 1;
}

// Find all <a class="book" occurrences
p = 0;
while(true) {
  const i = b3.indexOf('<a class="book"', p);
  if (i < 0) break;
  const line = b3.slice(0, i).split('\n').length;
  console.log('A   index:', i, 'line ~'+line, '|', JSON.stringify(b3.slice(i, i+50)));
  p = i + 1;
}

// Find all buildBackCover function definitions
p = 0;
while(true) {
  const i = b3.indexOf('buildBackCover', p);
  if (i < 0) break;
  const line = b3.slice(0, i).split('\n').length;
  console.log('buildBackCover index:', i, 'line ~'+line);
  p = i + 1;
}
