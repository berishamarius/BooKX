'use strict';
/**
 * Add cache-busting query parameters to all image references
 * v=2 forces browsers to reload new covers on mobile
 */

const fs = require('fs');
const path = require('path');

let filesUpdated = 0;

// Process all HTML files recursively
function processFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processFiles(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Add cache-busting to PNG references
      const imagePatterns = [
        { pattern: /src="Back\.png"(?!\?)/g, replacement: 'src="Back.png?v=2"' },
        { pattern: /src="Cover\.png"(?!\?)/g, replacement: 'src="Cover.png?v=2"' },
        { pattern: /src="Back Geschenke\.png"(?!\?)/g, replacement: 'src="Back Geschenke.png?v=2"' },
        { pattern: /src="Cover geschenke\.png"(?!\?)/g, replacement: 'src="Cover geschenke.png?v=2"' },
        { pattern: /src="\.\.\/Back\.png"(?!\?)/g, replacement: 'src="../Back.png?v=2"' },
        { pattern: /src="\.\.\/Cover\.png"(?!\?)/g, replacement: 'src="../Cover.png?v=2"' },
        { pattern: /src="\.\.\/Back Geschenke\.png"(?!\?)/g, replacement: 'src="../Back Geschenke.png?v=2"' },
        { pattern: /src="\.\.\/Cover geschenke\.png"(?!\?)/g, replacement: 'src="../Cover geschenke.png?v=2"' },
        { pattern: /src="\.\.\/\.\.\/Back\.png"(?!\?)/g, replacement: 'src="../../Back.png?v=2"' },
        { pattern: /src="\.\.\/\.\.\/Cover\.png"(?!\?)/g, replacement: 'src="../../Cover.png?v=2"' }
      ];
      
      imagePatterns.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        filesUpdated++;
        console.log(`✓ ${fullPath}`);
      }
    }
  });
}

console.log('🔄 Adding cache-busting to image references...\n');
processFiles('dist-alquran');
processFiles('dist-karim');
processFiles('dist-meliha');
processFiles('dist-diebibel');
processFiles('AL-QURAN');
console.log(`\n✅ Updated ${filesUpdated} files with cache-busting (v=2)`);
