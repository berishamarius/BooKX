/**
 * QURAN COPY/SHARE INJECTOR
 * ════════════════════════════════════════════════════════
 * Adds copy/share buttons to all Quran verse readers
 * Usage: node inject-quran-copy-share.js
 */

const fs = require('fs');
const path = require('path');

const COPY_SHARE_HTML = `
<style>
.verse-tools {
  display: inline-flex;
  gap: 6px;
  margin-left: 8px;
  font-size: 0.8rem;
}
.verse-copy-btn, .verse-share-btn {
  padding: 4px 10px;
  border: 1px solid #b8962e;
  background: rgba(184, 150, 46, 0.08);
  color: #b8962e;
  border-radius: 3px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.verse-copy-btn:hover, .verse-share-btn:hover {
  background: rgba(184, 150, 46, 0.2);
}
</style>

<script>
window.verseTools = {
  getSuraVerse(el) {
    const suraName = document.querySelector('h1, h2, .sura-title')?.textContent || 'Chapter';
    const verseNum = el.getAttribute('data-verse-id') || el.closest('[data-verse-id]')?.getAttribute('data-verse-id') || 'X';
    return { suraName, verseNum };
  },
  
  copyVerse(el) {
    const verseEl = el.closest('[data-verse-id]') || el.closest('.verse') || el.parentElement;
    if (!verseEl) return alert('Vers nicht gefunden');
    const text = verseEl.textContent.trim();
    const { suraName, verseNum } = window.verseTools.getSuraVerse(verseEl);
    const fullText = text + '\\n\\n— ' + suraName + ':' + verseNum + '\\n' + window.location.href;
    navigator.clipboard.writeText(fullText).then(() => {
      el.textContent = '✓ Kopiert!';
      setTimeout(() => { el.textContent = '📋 Copy'; }, 2000);
    }).catch(e => alert('Fehler: ' + e.message));
  },
  
  shareVerse(el) {
    const verseEl = el.closest('[data-verse-id]') || el.closest('.verse') || el.parentElement;
    if (!verseEl) return alert('Vers nicht gefunden');
    const text = verseEl.textContent.trim();
    const { suraName, verseNum } = window.verseTools.getSuraVerse(verseEl);
    const reference = suraName + ':' + verseNum;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({ text: text, title: reference, url: url }).catch(e => {});
    } else {
      const subject = 'Qur\'an - ' + reference;
      const body = encodeURIComponent(text + '\\n\\n— ' + reference + '\\n' + url);
      window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + body);
    }
  }
};

// Inject buttons into all verses
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-verse-id], .verse, .ayat, .vers').forEach(v => {
    if (v.querySelector('.verse-tools')) return;
    const tools = document.createElement('span');
    tools.className = 'verse-tools';
    tools.innerHTML = '<button class="verse-copy-btn" onclick="window.verseTools.copyVerse(this)">📋 Copy</button>' +
                      '<button class="verse-share-btn" onclick="window.verseTools.shareVerse(this)">↗ Share</button>';
    v.appendChild(tools);
  });
});
</script>
`;

function injectQuran() {
  const baseDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
  if (!fs.existsSync(baseDir)) return console.log('❌ dist-alquran/Übersetzungen nicht found');
  
  let count = 0;
  fs.readdirSync(baseDir).forEach(lang => {
    const surahDir = path.join(baseDir, lang, 'suren');
    if (!fs.existsSync(surahDir)) return;
    
    fs.readdirSync(surahDir).forEach(file => {
      if (!file.endsWith('.html')) return;
      const filePath = path.join(surahDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('verse-tools')) return; // Already injected
      
      const injectPoint = content.lastIndexOf('</body>');
      if (injectPoint !== -1) {
        const newContent = content.slice(0, injectPoint) + COPY_SHARE_HTML + content.slice(injectPoint);
        fs.writeFileSync(filePath, newContent, 'utf8');
        count++;
      }
    });
  });
  
  console.log(`✓ Quran: ${count} Verse aktualisiert mit Copy/Share`);
}

injectQuran();
