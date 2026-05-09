'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const KJVA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', '_KJVA.json'), 'utf8'));
const books = KJVA.books || [];

console.log('KJVA total books:', books.length);
for (let i = 39; i <= 53; i++) {
  const b = books[i];
  if (b) console.log(i, b.name, (b.chapters || []).length + 'ch');
}

// Convert scrollmapper book → our format
function toCache(bookData) {
  const chapters = {};
  for (const ch of (bookData.chapters || [])) {
    const verses = {};
    for (const v of (ch.verses || [])) verses[v.verse] = { verse: v.verse, text: (v.text || '').trim() };
    chapters[ch.chapter] = { chapter: ch.chapter, name: '', verses };
  }
  return { chapters };
}

// Our OX map: our nr → KJVA index
// From session summary: 39=1Esdras,40=2Esdras,43=AddEsther,47=PrayerAzariah,48=Susanna,49=BelDragon,50=PrayerManasses
const OX_MAP = {
  74: 39, // 1 Esdras
  75: 40, // 2 Esdras
  76: 50, // Prayer of Manasses
  77: 47, // Prayer of Azariah
  78: 48, // Susanna
  79: 49, // Bel and Dragon
  80: 43, // Additions to Esther
};

// Fix kjv/ and german/ files that have "…" placeholders or are missing
const pad3 = n => String(n).padStart(3, '0');
const ORTHO_DIR = path.join(ROOT, 'data-orthodox');

for (const [ourNr, kjvaIdx] of Object.entries(OX_MAP)) {
  const src = books[kjvaIdx];
  if (!src) { console.log('MISS kjva idx', kjvaIdx, 'for book', ourNr); continue; }
  const converted = toCache(src);
  const chCount = Object.keys(converted.chapters).length;
  const firstCh = converted.chapters[1];
  const firstV = firstCh ? firstCh.verses[1] : null;
  console.log('book', ourNr, '← kjva['+kjvaIdx+']', src.name, chCount+'ch', firstV ? firstV.text.substring(0,40)+'...' : '???');
  
  // Write to kjv/ 
  const kjvOut = path.join(ORTHO_DIR, 'kjv', pad3(ourNr) + '.json');
  fs.writeFileSync(kjvOut, JSON.stringify(converted));
  
  // Write to german/ (use KJV as fallback — will show English since no German exists)
  const deOut = path.join(ORTHO_DIR, 'german', pad3(ourNr) + '.json');
  fs.writeFileSync(deOut, JSON.stringify(converted));
  
  // Write to all other language dirs too
  const langs = fs.readdirSync(ORTHO_DIR).filter(d => {
    const full = path.join(ORTHO_DIR, d);
    return fs.statSync(full).isDirectory() && d !== 'kjv';
  });
  for (const lang of langs) {
    const langOut = path.join(ORTHO_DIR, lang, pad3(ourNr) + '.json');
    // Only write if it has placeholder "…" or KJV already exists there
    try {
      const existing = JSON.parse(fs.readFileSync(langOut, 'utf8'));
      const ch1 = existing.chapters && existing.chapters[1];
      const v1 = ch1 && ch1.verses && ch1.verses[1];
      if (v1 && v1.text && v1.text.includes('…')) {
        fs.writeFileSync(langOut, JSON.stringify(converted));
        console.log('  fixed placeholder in', lang + '/' + pad3(ourNr));
      }
    } catch(_) {
      // File doesn't exist, write it
      fs.writeFileSync(langOut, JSON.stringify(converted));
    }
  }
}

console.log('DONE');
