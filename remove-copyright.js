'use strict';
const fs = require('fs');
const path = require('path');

// Directories to process
const DIRS = [
  'dist-alquran',
  'dist-karim',
  'dist-meliha',
  'dist-diebibel',
  'AL-QURAN',
  'Geschenke/Koran-Deutsch-1',
  'Geschenke/Koran-Deutsch-2'
];

function cleanFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch(e) { return false; }

  const original = content;

  // 1. Remove <span class="ft-note">...</span>
  content = content.replace(/<span\s+class="ft-note">[^<]*<\/span>\s*/gi, '');

  // 2. Remove <div class="kx-copy">...</div>
  content = content.replace(/<div\s+class="kx-copy">[^<]*<\/div>\s*/gi, '');

  // 3. Remove <p>© ...</p> in footer-bar (Bible covers)
  content = content.replace(/<p>\s*©[^<]*<\/p>\s*/gi, '');

  // 4. Remove <span class="lang-disc">Sinngemäße Übersetzung...</span>
  content = content.replace(/<span\s+class="lang-disc">Sinngemäße Übersetzung[^<]*<\/span>\s*/gi, '');

  // 5. Remove CSS for .ft-note and .kx-copy from <style> blocks
  content = content.replace(/\.ft-note\{[^}]*\}\s*/gi, '');
  content = content.replace(/\.kx-copy\{[^}]*\}\s*/gi, '');

  if (content !== original) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch(e) { return false; }
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      count += walkDir(full);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      if (cleanFile(full)) count++;
    }
  }
  return count;
}

console.log('Entferne Copyright aus allen Dateien...\n');
let total = 0;
for (const d of DIRS) {
  const n = walkDir(d);
  if (n > 0) { console.log(`  ${d}: ${n} Dateien`); total += n; }
}
console.log(`\nFertig: ${total} Dateien bereinigt.`);
