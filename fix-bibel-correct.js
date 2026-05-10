const fs = require('fs');
const path = require('path');

function transformColors(content) {
  let result = content;
  result = result.replace(/#e8e0d0/g, '#2C0810');
  result = result.replace(/#5a1020/g, '#C8A030');
  result = result.replace(/#2a0008/g, '#EDD882');
  result = result.replace(/Die%20Heilige%20Bibel%20Michele%20Icon.png/g, 'Die%20Heilige%20Bibel%20rot%20Icon.png');
  result = result.replace(/content="#e8e0d0"/g, 'content="#2a0810"');
  return result;
}

console.log('Reverting back-cover and vorwort to original...');

// Restore original back-cover
let backcover = fs.readFileSync('CATHOLIC-BIBLE/Übersetzungen/german/back-cover.html', 'utf-8');
fs.writeFileSync('dist-diebibel/back-cover.html', backcover, 'utf-8');
console.log('✓ Restored dist-diebibel/back-cover.html to original');

// Restore original cover
let cover = fs.readFileSync('CATHOLIC-BIBLE/Übersetzungen/german/cover.html', 'utf-8');
fs.writeFileSync('dist-diebibel/cover.html', cover, 'utf-8');
console.log('✓ Restored dist-diebibel/cover.html to original');

// Delete vorwort (doesn''t exist in original)
if (fs.existsSync('dist-diebibel/german/vorwort.html')) {
  fs.unlinkSync('dist-diebibel/german/vorwort.html');
  console.log('✓ Removed dist-diebibel/german/vorwort.html (not in original)');
}

// Update german/index.html with Michele layout + red colors
console.log('\nApplying Michele layout to german/index.html...');
let micheleIndex = fs.readFileSync('dist-micheles/german/index.html', 'utf-8');
micheleIndex = transformColors(micheleIndex);
fs.writeFileSync('dist-diebibel/german/index.html', micheleIndex, 'utf-8');
console.log('✓ Updated dist-diebibel/german/index.html with Michele layout');

console.log('\nDone! Only index layout + verses updated, original back-cover/cover restored.');
