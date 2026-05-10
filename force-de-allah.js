'use strict';

const fs = require('fs');
const path = require('path');

const DE_SUREN_DIRS = [
  'AL-QURAN/Übersetzungen/Deutsch/suren',
  'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren',
  'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren',
];

const DE_CACHE_DIR = 'AL-QURAN/cache/de';

function toAllah(text) {
  return text
    .replace(/\bGottes\b/g, 'Allahs')
    .replace(/\bGott\b/g, 'Allah');
}

function patchCache() {
  if (!fs.existsSync(DE_CACHE_DIR)) return 0;
  let changed = 0;
  const files = fs.readdirSync(DE_CACHE_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const fp = path.join(DE_CACHE_DIR, f);
    const arr = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let dirty = false;
    for (const v of arr) {
      if (v.translations && v.translations[0] && typeof v.translations[0].text === 'string') {
        const old = v.translations[0].text;
        const neu = toAllah(old);
        if (old !== neu) {
          v.translations[0].text = neu;
          dirty = true;
        }
      }
    }
    if (dirty) {
      fs.writeFileSync(fp, JSON.stringify(arr), 'utf8');
      changed++;
    }
  }
  return changed;
}

function patchSuren() {
  let filesChanged = 0;
  for (const dir of DE_SUREN_DIRS) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    for (const f of files) {
      const fp = path.join(dir, f);
      const src = fs.readFileSync(fp, 'utf8');
      const out = src.replace(/<div class="tr">([\s\S]*?)<\/div>/g, (full, inner) => {
        const neu = toAllah(inner);
        return neu === inner ? full : `<div class="tr">${neu}</div>`;
      });
      if (out !== src) {
        fs.writeFileSync(fp, out, 'utf8');
        filesChanged++;
      }
    }
  }
  return filesChanged;
}

const cacheChanged = patchCache();
const surenChanged = patchSuren();
console.log('DE cache files changed:', cacheChanged);
console.log('DE sura files changed:', surenChanged);
