const fs = require('fs');
const path = require('path');

const MICHELE_DIR = 'dist-micheles/german/bücher';
const ORIGINAL_BIBLE_DIR = 'dist-diebibel/german/bücher';

function transformColors(content) {
  let result = content;
  result = result.replace(/#f5f0e8/g, '#2C0810');
  result = result.replace(/#e8e0d0/g, '#2C0810');
  result = result.replace(/#5a1020/g, '#C8A030');
  result = result.replace(/#2a0008/g, '#EDD882');
  result = result.replace(/background:#f5f0e8;border-top:3px solid/g, 'background:#2C0810;border-top:3px solid');
  result = result.replace(/Die%20Heilige%20Bibel%20Michele%20Icon.png/g, 'Die%20Heilige%20Bibel%20rot%20Icon.png');
  result = result.replace(/content="#e8e0d0"/g, 'content="#2a0810"');
  return result;
}

const files = fs.readdirSync(MICHELE_DIR).filter(f => f.endsWith('.html'));
console.log(`Processing ${files.length} Bible book files...`);

files.forEach(file => {
  const michelePath = path.join(MICHELE_DIR, file);
  const biblePath = path.join(ORIGINAL_BIBLE_DIR, file);
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
