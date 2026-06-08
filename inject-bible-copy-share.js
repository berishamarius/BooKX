/**
 * BIBLE COPY/SHARE INJECTOR
 * ════════════════════════════════════════════════════════
 * Adds copy/share buttons to all Bible readers
 * Usage: node inject-bible-copy-share.js
 */

const fs = require('fs');
const path = require('path');

const COPY_SHARE_HTML = `
<style>
.verse-tools {
  display: inline-flex;
  gap: 6px;
  margin-left: 8px;
  font-size: 0.75rem;
}
.verse-copy-btn, .verse-share-btn {
  padding: 3px 8px;
  border: 1px solid #b8962e;
  background: rgba(184, 150, 46, 0.08);
  color: #b8962e;
  border-radius: 2px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.verse-copy-btn:hover, .verse-share-btn:hover {
  background: rgba(184, 150, 46, 0.2);
}
</style>

<script>
window.bibleTools = {
  getReference(el) {
    const verseEl = el.closest('[data-verse]') || el.closest('.verse') || el.parentElement;
    const ref = verseEl?.getAttribute('data-verse') || '';
    return ref;
  },
  
  copyVerse(el) {
    const verseEl = el.closest('[data-verse]') || el.closest('.verse') || el.parentElement;
    if (!verseEl) return alert('Vers nicht gefunden');
    const text = verseEl.textContent.trim();
    const reference = window.bibleTools.getReference(verseEl) || 'Bible Verse';
    const fullText = text + '\\n\\n— ' + reference + '\\n' + window.location.href;
    navigator.clipboard.writeText(fullText).then(() => {
      el.textContent = '✓ Copied';
      setTimeout(() => { el.textContent = '📋 Copy'; }, 2000);
    }).catch(e => alert('Error: ' + e.message));
  },
  
  shareVerse(el) {
    const verseEl = el.closest('[data-verse]') || el.closest('.verse') || el.parentElement;
    if (!verseEl) return alert('Vers nicht gefunden');
    const text = verseEl.textContent.trim();
    const reference = window.bibleTools.getReference(verseEl) || 'Bible';
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({ text: text, title: reference, url: url }).catch(e => {});
    } else {
      const subject = 'Bible - ' + reference;
      const body = encodeURIComponent(text + '\\n\\n— ' + reference + '\\n' + url);
      window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + body);
    }
  }
};

// Inject buttons into verses
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-verse], .verse, .vrs').forEach(v => {
    if (v.querySelector('.verse-tools')) return;
    const tools = document.createElement('span');
    tools.className = 'verse-tools';
    tools.innerHTML = '<button class="verse-copy-btn" onclick="window.bibleTools.copyVerse(this)">📋 Copy</button>' +
                      '<button class="verse-share-btn" onclick="window.bibleTools.shareVerse(this)">↗ Share</button>';
    v.appendChild(tools);
  });
});
</script>
`;

function injectBible() {
  const baseDir = path.join(__dirname, 'dist-diebibel');
  if (!fs.existsSync(baseDir)) return console.log('❌ dist-diebibel nicht found');
  
  let count = 0;
  fs.readdirSync(baseDir).forEach(lang => {
    const langDir = path.join(baseDir, lang);
    if (!fs.lstatSync(langDir).isDirectory()) return;
    
    // Inject into index.html and all files in root
    const rootFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
    rootFiles.forEach(file => {
      const filePath = path.join(langDir, file);
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('verse-tools')) return;
        
        const injectPoint = content.lastIndexOf('</body>');
        if (injectPoint !== -1) {
          const newContent = content.slice(0, injectPoint) + COPY_SHARE_HTML + content.slice(injectPoint);
          fs.writeFileSync(filePath, newContent, 'utf8');
          count++;
        }
      } catch (e) {
        console.error('Error in ' + file + ':', e.message);
      }
    });
    
    // Also inject into bücher/ directory files
    const bucherDir = path.join(langDir, 'bücher');
    if (fs.existsSync(bucherDir)) {
      const bucherFiles = fs.readdirSync(bucherDir).filter(f => f.endsWith('.html'));
      bucherFiles.forEach(file => {
        const filePath = path.join(bucherDir, file);
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('verse-tools')) return;
          
          const injectPoint = content.lastIndexOf('</body>');
          if (injectPoint !== -1) {
            const newContent = content.slice(0, injectPoint) + COPY_SHARE_HTML + content.slice(injectPoint);
            fs.writeFileSync(filePath, newContent, 'utf8');
            count++;
          }
        } catch (e) {
          console.error('Error in ' + file + ':', e.message);
        }
      });
    }
  });
  
  console.log(`✓ Bible: ${count} Seiten aktualisiert mit Copy/Share`);
}

injectBible();
