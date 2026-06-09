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

// Copy/Share Script (Localized for all languages - Bible & Quran)
const COPY_SHARE_SCRIPT = `
<style>
.verse-toast-container { position:fixed; bottom:24px; right:24px; z-index:10000; }
.verse-toast { padding:12px 18px; background:#2a2a2a; color:#d0d0d0; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.4); font-size:0.9rem; margin-bottom:8px; animation:slideIn 0.3s ease-out; }
@keyframes slideIn { from { transform:translateX(400px); opacity:0; } to { transform:translateX(0); opacity:1; } }
.verse-tools { display:flex; gap:6px; margin-top:6px; }
.verse-copy-btn, .verse-share-btn { padding:6px 12px; background:#3d3d3d; color:#b0b0b0; border:1px solid #555; border-radius:3px; cursor:pointer; font-size:0.85rem; font-family:inherit; transition:all 0.2s; }
.verse-copy-btn:hover, .verse-share-btn:hover { background:#4d4d4d; color:#d0d0d0; border-color:#777; }
</style>
<script>
// Detect language from document or page path
function detectLanguage() {
  const lang = document.documentElement.lang || 
               document.documentElement.getAttribute('data-lang') ||
               window.location.pathname.split('/')[3] ||
               'de';
  return lang.split('-')[0].toLowerCase();
}

// Detect if Quran or Bible
function isQuran() {
  return window.location.pathname.includes('alquran') || 
         document.title.toLowerCase().includes('quran') ||
         document.title.includes('القرآن');
}

const STRINGS = {
  de: { copy: 'Kopieren', share: 'Teilen', copied: 'Vers kopiert', shared: 'Geteilt', error: 'Fehler' },
  en: { copy: 'Copy', share: 'Share', copied: 'Verse copied', shared: 'Shared', error: 'Error' },
  ar: { copy: 'نسخ', share: 'مشاركة', copied: 'تم النسخ', shared: 'تم المشاركة', error: 'خطأ' },
  fr: { copy: 'Copier', share: 'Partager', copied: 'Verset copié', shared: 'Partagé', error: 'Erreur' },
  es: { copy: 'Copiar', share: 'Compartir', copied: 'Verso copiado', shared: 'Compartido', error: 'Error' },
  it: { copy: 'Copia', share: 'Condividi', copied: 'Versetto copiato', shared: 'Condiviso', error: 'Errore' },
  pt: { copy: 'Copiar', share: 'Compartilhar', copied: 'Verso copiado', shared: 'Compartilhado', error: 'Erro' },
  ru: { copy: 'Копировать', share: 'Поделиться', copied: 'Стих скопирован', shared: 'Поделено', error: 'Ошибка' },
  tr: { copy: 'Kopyala', share: 'Paylaş', copied: 'Ayet kopyalandı', shared: 'Paylaşıldı', error: 'Hata' },
  id: { copy: 'Salin', share: 'Bagikan', copied: 'Ayat disalin', shared: 'Dibagikan', error: 'Kesalahan' },
  ur: { copy: 'نقل کریں', share: 'شیئر کریں', copied: 'آیت نقل ہوگئی', shared: 'شیئر ہوگیا', error: 'خرابی' },
  fa: { copy: 'کپی', share: 'اشتراک', copied: 'کپی شد', shared: 'اشتراک شد', error: 'خطا' },
  bn: { copy: 'অনুলিপি', share: 'শেয়ার', copied: 'আয়াত অনুলিপি করা হয়েছে', shared: 'শেয়ার করা হয়েছে', error: 'ত্রুটি' },
  hi: { copy: 'कॉपी करें', share: 'साझा करें', copied: 'श्लोक कॉपी किया गया', shared: 'साझा किया गया', error: 'त्रुटि' },
  ha: { copy: 'Juyya', share: 'Raba', copied: 'Aaya jiyan', shared: 'Raba', error: 'Kuskure' },
  bs: { copy: 'Kopirati', share: 'Podijeliti', copied: 'Ajet kopiran', shared: 'Podijeljeno', error: 'Greška' },
  sq: { copy: 'Kopjo', share: 'Ndaj', copied: 'Ajeti u kopjua', shared: 'Ndarë', error: 'Gabim' },
  zh: { copy: '复制', share: '分享', copied: '经文已复制', shared: '已分享', error: '错误' },
  ug: { copy: 'كۆپىيىلاش', share: 'ھەمبەھىرلەش', copied: 'ئايەت كۆپىيىلاندى', shared: 'ھەمبەھىرلەندى', error: 'خاتالىق' },
  th: { copy: 'คัดลอก', share: 'แชร์', copied: 'คัดลอกแล้ว', shared: 'แชร์แล้ว', error: 'ข้อผิดพลาด' },
  kk: { copy: 'Көшіру', share: 'Бөлісу', copied: 'Аяты көшірілді', shared: 'Бөлінді', error: 'Қате' }
};

function getString(key) {
  const lang = detectLanguage();
  return (STRINGS[lang] || STRINGS.en)[key] || STRINGS.en[key];
}

function showNotification(msg) {
  const container = document.getElementById('verse-toast-container') || (() => {
    const div = document.createElement('div');
    div.id = 'verse-toast-container';
    div.className = 'verse-toast-container';
    document.body.appendChild(div);
    return div;
  })();
  
  const toast = document.createElement('div');
  toast.className = 'verse-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

window.verseUtils = {
  extractArabicAndTranslation() {
    const sel = window.getSelection();
    const text = sel.toString().trim();
    
    if (!text || text.length < 3) {
      showNotification(getString('error'));
      return null;
    }
    
    return { arabic: text, translation: '', combined: text };
  },
  
  async copyVerse() {
    const data = window.verseUtils.extractArabicAndTranslation();
    if (!data) return;
    
    const url = window.location.href;
    const title = document.title;
    const fullText = data.combined + '\\n\\n— ' + title + '\\n' + url;
    
    try {
      await navigator.clipboard.writeText(fullText);
      showNotification(getString('copied'));
    } catch (e) {
      console.error('Copy error:', e);
      showNotification(getString('error'));
    }
  },
  
  shareVerse() {
    const data = window.verseUtils.extractArabicAndTranslation();
    if (!data) return;
    
    const url = window.location.href;
    const title = document.title;
    const subject = 'Aus: ' + title;
    const body = encodeURIComponent(data.combined + '\\n\\n' + url);
    
    if (navigator.share) {
      navigator.share({ 
        text: data.combined, 
        title: title, 
        url: url 
      }).then(() => {
        showNotification(getString('shared'));
      }).catch(e => {
        if (e.name !== 'AbortError') console.error('Share:', e);
      });
    } else {
      const mailUrl = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + body;
      window.location.href = mailUrl;
      showNotification(getString('shared'));
    }
  }
};

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.altKey && e.key === 'c') {
    e.preventDefault();
    window.verseUtils.copyVerse();
  }
  if (e.ctrlKey && e.altKey && e.key === 's') {
    e.preventDefault();
    window.verseUtils.shareVerse();
  }
});

// Auto-add buttons to verses
document.addEventListener('DOMContentLoaded', () => {
  const verses = document.querySelectorAll('[data-verse], .verse, .vrs, .vb, [class*="ayat"]');
  verses.forEach(v => {
    if (v.querySelector('.verse-tools')) return;
    const tools = document.createElement('div');
    tools.className = 'verse-tools';
    tools.innerHTML = '<button class="verse-copy-btn" onclick="window.verseUtils.copyVerse()" title="' + getString('copy') + '">' + getString('copy') + '</button>' +
                      '<button class="verse-share-btn" onclick="window.verseUtils.shareVerse()" title="' + getString('share') + '">' + getString('share') + '</button>';
    v.appendChild(tools);
  });
}, { once: true });
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
