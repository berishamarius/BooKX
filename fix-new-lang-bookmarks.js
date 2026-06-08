// fix-new-lang-bookmarks.js
// Updates bookmark toast messages for new Quran languages
const fs = require('fs');
const path = require('path');

const NEW_LANG_TOAST = {
  'Spanisch': '✦ Marcador guardado',
  'Französisch': '✦ Signet enregistr\u00e9',
  'Tagalog': '✦ Bookmark na-save',
  'Thailändisch': '✦ \u0e1a\u0e38\u0e4a\u0e01\u0e21\u0e32\u0e23\u0e4c\u0e01\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27',
  'Kasachisch': '✦ \u0411\u0435\u0442\u0431\u0435\u043b\u0433\u0456 \u0441\u0430\u049b\u0442\u0430\u043b\u0434\u044b'
};

const BASE = 'dist-alquran/Übersetzungen';
let updated = 0;

for (const [lang, toast] of Object.entries(NEW_LANG_TOAST)) {
  const dir = path.join(BASE, lang, 'suren');
  if (!fs.existsSync(dir)) {
    console.log(`⚠ ${lang} nicht gefunden`);
    continue;
  }
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');
    
    if (!html.includes('BM_KEY')) continue;
    
    // Replace the toast text
    const oldToast = html.match(/showToast\('([^']+)'\)/);
    if (oldToast && oldToast[1] !== toast) {
      html = html.replace(
        /showToast\('.*?'\)/,
        `showToast('${toast}')`
      );
      fs.writeFileSync(fp, html, 'utf8');
      updated++;
    }
  }
}

console.log(`✓ Updated bookmark messages in ${updated} files for new languages`);
