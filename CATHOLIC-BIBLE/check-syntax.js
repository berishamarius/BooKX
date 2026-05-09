const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('build4.js', 'utf8');

try {
  new vm.Script(src);
  console.log('OK - no syntax errors');
} catch(e) {
  console.log('Error:', e.message);
  // Find the problematic area
  // Try binary search
  let lo = 0, hi = src.length;
  while (hi - lo > 500) {
    const mid = Math.floor((lo + hi) / 2);
    try {
      new vm.Script(src.slice(0, mid));
      lo = mid;
    } catch(e2) {
      if (e2.message.includes('Unexpected end') || e2.message.includes('Unterminated')) {
        hi = mid;
      } else {
        // Syntax error in this chunk - go right to find the actual problem
        lo = mid;
      }
    }
  }
  const lines = src.slice(0, lo).split('\n');
  console.log('Issue around line', lines.length);
  console.log('Context:');
  const allLines = src.split('\n');
  for (let i = Math.max(0, lines.length - 3); i < Math.min(allLines.length, lines.length + 3); i++) {
    console.log(i+1, allLines[i]);
  }
}
