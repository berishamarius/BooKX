const fs = require('fs');
const b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

// Find all h-cross-big in HTML (not CSS)
let idx = 0;
while (true) {
  const i = b4.indexOf('h-cross-big', idx);
  if (i < 0) break;
  console.log('h-cross-big at', i, ':', JSON.stringify(b4.slice(i-5, i+60)));
  idx = i + 1;
}

// Find b-wm svg
let idx2 = 0;
while (true) {
  const i = b4.indexOf('b-wm', idx2);
  if (i < 0) break;
  console.log('b-wm at', i, ':', JSON.stringify(b4.slice(i, i+100)));
  idx2 = i + 1;
}
