// update-bible-bookmark-messages.js
// Updates bookmark toast messages for Syriac and Armenian
const fs = require('fs');
const path = require('path');

const LANG_TOAST = {
  'syriac': '✦ \u0723\u071d\u0721\u072c\u0710 \u0722\u071b\u072a\u072c',
  'armenian': '✦ \u054d\u0565\u0572\u0574\u0561\u0563\u056b\u0580 \u057a\u0561\u0570\u057e\u0561\u056e'
};

const BASE = 'dist-diebibel';
let updated = 0;

for (const [lang, correctToast] of Object.entries(LANG_TOAST)) {
  const bucherDir = path.join(BASE, lang, 'bücher');
  if (!fs.existsSync(bucherDir)) {
    console.log(`⚠ ${lang} bücher nicht gefunden`);
    continue;
  }
  
  const files = fs.readdirSync(bucherDir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const fp = path.join(bucherDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    
    if (!html.includes('BM_KEY')) continue;
    
    // Replace the toast text if it's wrong
    const toastMatch = html.match(/showToast\('([^']+)'\)/);
    if (toastMatch && toastMatch[1] !== correctToast) {
      html = html.replace(
        /showToast\('.*?'\);/,
        `showToast('${correctToast}');`
      );
      fs.writeFileSync(fp, html, 'utf8');
      updated++;
    }
  }
}

console.log(`✓ Updated bookmark messages in ${updated} Bible files`);
