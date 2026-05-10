const fs = require('fs');
const path = require('path');

function transformColors(content) {
  let result = content;
  // Light background to dark red
  result = result.replace(/#e8e0d0/g, '#2C0810');
  // Light header background becomes dark with gradient
  result = result.replace(/#f5f0e8/g, '#2C0810');
  // Text colors
  result = result.replace(/#5a1020/g, '#C8A030');
  result = result.replace(/#2a0008/g, '#EDD882');
  // Icon references
  result = result.replace(/Die%20Heilige%20Bibel%20Michele%20Icon.png/g, 'Die%20Heilige%20Bibel%20rot%20Icon.png');
  result = result.replace(/Die%20Heilige%20Bibel%20-%20Weiss%20-%20Michele.png/g, 'Die%20Heilige%20Bibel%20-%20Rot.png');
  result = result.replace(/Bibel-Rueckseite-Michele.png/g, 'Bibel-Rueckseite-Katholisch.png');
  // Theme color
  result = result.replace(/content="#e8e0d0"/g, 'content="#2a0810"');
  return result;
}

const COPY_FILES = [
  ['dist-micheles/index.html', 'dist-diebibel/index.html'],
  ['dist-micheles/cover.html', 'dist-diebibel/cover.html'],
  ['dist-micheles/back-cover.html', 'dist-diebibel/back-cover.html'],
  ['dist-micheles/german/index.html', 'dist-diebibel/german/index.html'],
  ['dist-micheles/german/cover.html', 'dist-diebibel/german/cover.html'],
  ['dist-micheles/german/vorwort.html', 'dist-diebibel/german/vorwort.html'],
];

console.log('Syncing Michele template to dist-diebibel with red colors...');
COPY_FILES.forEach(([src, dst]) => {
  try {
    if (!fs.existsSync(src)) {
      console.log(`⊘ ${src} not found`);
      return;
    }
    let content = fs.readFileSync(src, 'utf-8');
    content = transformColors(content);
    fs.writeFileSync(dst, content, 'utf-8');
    console.log(`✓ ${dst}`);
  } catch (error) {
    console.error(`✗ ${dst}: ${error.message}`);
  }
});

console.log('\nAll files synced!');
