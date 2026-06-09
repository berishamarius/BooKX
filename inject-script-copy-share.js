'use strict';
/**
 * UNIVERSAL COPY/SHARE FUNCTION INJECTOR
 * ──────────────────────────────────────────────────────────
 * Injects copy/share functionality to all Quran + Bible readers
 * Allows users to copy and share verses with attribution
 * 
 * Usage: node inject-script-copy-share.js
 */

const fs = require('fs');
const path = require('path');

// Copy/Share Script (Universal)
const COPY_SHARE_SCRIPT = `
<script>
// ── Universal Copy/Share Function ──────────────────────────────────────────
window.verseUtils = {
  async copyVerse() {
    const sel = window.getSelection();
    if (!sel.toString().trim()) {
      alert('Bitte einen Vers selektieren');
      return;
    }
    const verse = sel.toString();
    const url = window.location.href;
    const title = document.title;
    const text = verse + '\\n\\n— ' + title + '\\n' + url;
    try {
      await navigator.clipboard.writeText(text);
      alert('✓ Vers kopiert!');
    } catch (e) {
      console.error(e);
    }
  },
  
  shareVerse() {
    const sel = window.getSelection();
    if (!sel.toString().trim()) {
      alert('Bitte einen Vers selektieren');
      return;
    }
    const verse = sel.toString();
    const url = window.location.href;
    const title = document.title;
    const text = encodeURIComponent(verse + '\\n— ' + title);
    const shareUrl = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + text + '%0A' + url;
    
    if (navigator.share) {
      navigator.share({ text: verse, title: title, url: url }).catch(e => {});
    } else {
      window.location = shareUrl;
    }
  }
};

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'c' && window.getSelection().toString().length > 10) {
    // Let default copy work
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    window.verseUtils.shareVerse();
  }
});

// Optional: Add UI buttons to pages with verse containers
document.addEventListener('DOMContentLoaded', function() {
  // Find verse containers and add buttons
  const verses = document.querySelectorAll('[data-verse], [class*="verse"], [class*="ayat"]');
  verses.forEach(v => {
    if (v.querySelector('.verse-tools')) return; // Already added
    const tools = document.createElement('div');
    tools.className = 'verse-tools';
    tools.style.cssText = 'display:inline-block;margin-left:8px;font-size:0.75rem;';
    tools.innerHTML = '<button onclick="window.verseUtils.copyVerse()" style="padding:2px 6px;margin-right:4px;cursor:pointer;border:1px solid #999;background:#f0f0f0;border-radius:3px;">📋 Copy</button>' +
                      '<button onclick="window.verseUtils.shareVerse()" style="padding:2px 6px;cursor:pointer;border:1px solid #999;background:#f0f0f0;border-radius:3px;">↗ Share</button>';
    v.appendChild(tools);
  });
});
</script>
`;

// Inject into Quran pages
function injectQuranPages() {
  const baseDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
  const marker = '<!-- copy-share-injected -->';
  
  if (!fs.existsSync(baseDir)) {
    console.log('❌ dist-alquran/Übersetzungen nicht gefunden');
    return;
  }
  
  const langs = fs.readdirSync(baseDir);
  let count = 0;
  
  langs.forEach(lang => {
    const surahDir = path.join(baseDir, lang, 'suren');
    if (!fs.existsSync(surahDir)) return;
    
    fs.readdirSync(surahDir).forEach(file => {
      if (!file.endsWith('.html')) return;
      const filePath = path.join(surahDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes(marker)) return; // Already injected
      
      const injectPoint = content.lastIndexOf('</body>');
      if (injectPoint === -1) return;
      
      const newContent = content.slice(0, injectPoint) + marker + COPY_SHARE_SCRIPT + content.slice(injectPoint);
      fs.writeFileSync(filePath, newContent, 'utf8');
      count++;
    });
  });
  
  console.log(`✓ Quran: ${count} Seiten aktualisiert`);
}

// Inject into Bible pages
function injectBiblePages() {
  const baseDir = path.join(__dirname, 'dist-diebibel');
  const marker = '<!-- copy-share-injected -->';
  
  if (!fs.existsSync(baseDir)) {
    console.log('❌ dist-diebibel nicht gefunden');
    return;
  }
  
  const langs = fs.readdirSync(baseDir);
  let count = 0;
  
  langs.forEach(lang => {
    const langDir = path.join(baseDir, lang);
    if (!fs.existsSync(langDir)) return;
    
    // Index + reader pages
    ['index.html', 'reader.js'].forEach(file => {
      const filePath = path.join(langDir, file);
      if (!fs.existsSync(filePath)) return;
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes(marker)) return;
      
      const injectPoint = content.lastIndexOf('</body>');
      if (injectPoint === -1) return;
      
      const newContent = content.slice(0, injectPoint) + marker + COPY_SHARE_SCRIPT + content.slice(injectPoint);
      fs.writeFileSync(filePath, newContent, 'utf8');
      count++;
    });
  });
  
  console.log(`✓ Bibel: ${count} Seiten aktualisiert`);
}

// Main
console.log('📋 Copy/Share Funktion wird injiziert...');
injectQuranPages();
injectBiblePages();
console.log('✓ Fertig!');
