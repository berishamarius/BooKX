'use strict';
const fs = require('fs');
const path = require('path');

const DIRS = [
  'dist-alquran',
  'dist-karim',
  'dist-meliha',
  'dist-diebibel',
  'AL-QURAN',
  'Geschenke/Koran-Deutsch-1',
  'Geschenke/Koran-Deutsch-2'
];

// Markers that identify copy/paste script blocks
const BAD_MARKERS = [
  'window.verseTools',
  'window.verseUtils',
  'copyVerse',
  'shareVerse',
  'copy-share-injected',
  'navigator.clipboard',
  'verse-copy-btn',
  'verse-share-btn',
  'verse-tools'
];

function removeScriptBlocks(content) {
  // Find and remove every <script>...</script> block that contains bad markers
  let result = '';
  let pos = 0;
  let removed = 0;

  while (pos < content.length) {
    const scriptStart = content.indexOf('<script', pos);
    if (scriptStart === -1) {
      // No more script tags — append rest and done
      result += content.slice(pos);
      break;
    }

    // Find end of this script tag
    const scriptEnd = content.indexOf('</script>', scriptStart);
    if (scriptEnd === -1) {
      result += content.slice(pos);
      break;
    }

    const fullBlock = content.slice(scriptStart, scriptEnd + 9); // 9 = '</script>'.length

    // Check if this script block contains any bad marker
    const isBad = BAD_MARKERS.some(marker => fullBlock.includes(marker));

    if (isBad) {
      // Append everything before this script block
      result += content.slice(pos, scriptStart);
      removed++;
      // Skip past this script block
      pos = scriptEnd + 9;
    } else {
      // Keep this script block
      result += content.slice(pos, scriptEnd + 9);
      pos = scriptEnd + 9;
    }
  }

  return { content: result, removed };
}

function removeStyleBlocks(content) {
  // Remove <style> blocks that contain verse-copy-btn or verse-tools CSS
  let result = '';
  let pos = 0;
  let removed = 0;

  while (pos < content.length) {
    const styleStart = content.indexOf('<style', pos);
    if (styleStart === -1) {
      result += content.slice(pos);
      break;
    }

    const styleEnd = content.indexOf('</style>', styleStart);
    if (styleEnd === -1) {
      result += content.slice(pos);
      break;
    }

    const fullBlock = content.slice(styleStart, styleEnd + 8);
    const isBad = fullBlock.includes('verse-copy-btn') ||
                  fullBlock.includes('verse-share-btn') ||
                  (fullBlock.includes('verse-tools') && fullBlock.includes('cursor:pointer'));

    if (isBad) {
      result += content.slice(pos, styleStart);
      removed++;
      pos = styleEnd + 8;
    } else {
      result += content.slice(pos, styleEnd + 8);
      pos = styleEnd + 8;
    }
  }

  return { content: result, removed };
}

function cleanFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch(e) { return false; }

  const original = content;

  // Remove bad script blocks
  const s = removeScriptBlocks(content);
  content = s.content;

  // Remove bad style blocks
  const st = removeStyleBlocks(content);
  content = st.content;

  // Remove <!-- copy-share-injected --> comment
  content = content.replace(/<!--\s*copy-share-injected\s*-->\s*/g, '');

  // Clean up multiple blank lines left behind
  content = content.replace(/\n{4,}/g, '\n\n');

  if (content !== original) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch(e) {
      // Try with explicit encoding for paths with special chars
      return false;
    }
  }
  return false;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch(e) { return 0; }
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      count += walkDir(full);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      if (cleanFile(full)) count++;
    }
  }
  return count;
}

console.log('Entferne Copy/Share Code aus allen HTML-Dateien...\n');
let total = 0;
for (const d of DIRS) {
  const n = walkDir(d);
  if (n > 0) { console.log(`  ${d}: ${n} Dateien`); total += n; }
}
console.log(`\nFertig: ${total} Dateien bereinigt.`);
