const fs = require('fs');
const path = require('path');

// Copy Michele's index and covers
const files_to_copy = ['index.html', 'cover.html', 'back-cover.html', 'german/index.html', 'german/cover.html', 'german/vorwort.html'];

function transformColors(content) {
  let result = content;
  result = result.replace(/#f5f0e8/g, '#2C0810');
  result = result.replace(/#e8e0d0/g, '#2C0810');
  result = result.replace(/#5a1020/g, '#C8A030');
  result = result.replace(/#2a0008/g, '#EDD882');
  result = result.replace(/background:#f5f0e8;border-top:3px solid/g, 'background:#2C0810;border-top:3px solid');
  result = result.replace(/Die%20Heilige%20Bibel%20Michele%20Icon.png/g, 'Die%20Heilige%20Bibel%20rot%20Icon.png');
  result = result.replace(/Bibel-Rueckseite-Michele.png/g, 'Bibel-Rueckseite-Katholisch.png');
  result = result.replace(/Die%20Heilige%20Bibel%20-%20Weiss%20-%20Michele.png/g, 'Die%20Heilige%20Bibel%20-%20Rot.png');
  result = result.replace(/content="#e8e0d0"/g, 'content="#2a0810"');
  return result;
}

console.log('Copying Michele index and covers to original Bible...');
files_to_copy.forEach(file => {
  const michelePath = path.join('dist-micheles', file);
  const biblePath = path.join('dist-diebibel', file);
  
  if (!fs.existsSync(michelePath)) {
    console.log(`⊘ ${file} (Michele version not found)`);
    return;
  }
  
  try {
    let content = fs.readFileSync(michelePath, 'utf-8');
    content = transformColors(content);
    fs.writeFileSync(biblePath, content, 'utf-8');
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log('Done!');
