const fs = require('fs');
const path = require('path');

// Sync Bible files from dist-diebibel back to source
const DIST_DIR = 'dist-diebibel/german/bücher';
const SOURCE_DIR = 'CATHOLIC-BIBLE/Übersetzungen/Deutsch/bücher';

// Create source directory if it doesn't exist
if (!fs.existsSync(SOURCE_DIR)) {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
  console.log(`Created ${SOURCE_DIR}`);
}

const files = fs.readdirSync(DIST_DIR).filter(f => f.endsWith('.html'));
console.log(`Syncing ${files.length} Bible book files from dist to source...`);

files.forEach(file => {
  const distPath = path.join(DIST_DIR, file);
  const sourcePath = path.join(SOURCE_DIR, file);
  
  try {
    let content = fs.readFileSync(distPath, 'utf-8');
    fs.writeFileSync(sourcePath, content, 'utf-8');
    console.log(`✓ ${file}`);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log('Done!');
