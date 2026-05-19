'use strict';
/**
 * fix-woerterbuch-lang-headers.js
 * Replaces the German category labels (.cat-de spans) in each
 * woerterbuch.html with the correct target-language translation.
 * Identifies language from <html lang="XX"> attribute.
 * Identifies category from the Arabic <span class="cat-ar"> that precedes it.
 */
const fs   = require('fs');
const path = require('path');

const QURAN_OVER = path.resolve(__dirname, '..', 'dist-alquran', 'Übersetzungen');

/* ── Category translations keyed by Arabic text ─────────────────────────── */
const CAT = {
  'أسماء الله الحسنى': {
    sq:'Emrat e bukur të Allahut', bn:'আল্লাহর সুন্দর নামসমূহ',
    bs:'Allahova najljepša imena',  zh:'真主的美名',
    de:'Die schönsten Namen Gottes', en:'The Most Beautiful Names of God',
    ha:'Sunaye mafi kyau na Allah', hi:'अल्लाह के सुंदर नाम',
    id:'Nama-Nama Indah Allah',    fa:'نام‌های نیکوی خداوند',
    ru:'Прекрасные имена Аллаха',  tr:'Allah\'ın Güzel İsimleri',
    ur:'اللہ کے خوبصورت نام',      ug:'ئاللاھنىڭ گۈزەل ئىسىملىرى',
  },
  'الإيمان والإسلام': {
    sq:'Besimi & Islami',           bn:'বিশ্বাস ও ইসলাম',
    bs:'Vjera & Islam',             zh:'信仰与伊斯兰',
    de:'Glaube & Islam',            en:'Faith & Islam',
    ha:'Imani & Musulunci',         hi:'ईमान और इस्लाम',
    id:'Iman & Islam',              fa:'ایمان و اسلام',
    ru:'Вера & Ислам',              tr:'İman & İslam',
    ur:'ایمان اور اسلام',           ug:'ئىمان ۋە ئىسلام',
  },
  'العبادات': {
    sq:'Adhurimet',                 bn:'ইবাদত',
    bs:'Ibadeti',                   zh:'功修',
    de:'Religiöse Praxis',          en:'Acts of Worship',
    ha:'Ibada',                     hi:'इबादत',
    id:'Ibadah',                    fa:'عبادات',
    ru:'Поклонение',                tr:'İbadetler',
    ur:'عبادات',                    ug:'ئىبادەتلەر',
  },
  'الآخرة': {
    sq:'Bota tjetër',               bn:'আখিরাত',
    bs:'Ahiret',                    zh:'后世',
    de:'Das Jenseits',              en:'The Hereafter',
    ha:'Lahira',                    hi:'आख़िरत',
    id:'Akhirat',                   fa:'آخرت',
    ru:'Загробная жизнь',           tr:'Ahiret',
    ur:'آخرت',                      ug:'ئاخىرەت',
  },
  'النبوة والوحي': {
    sq:'Profecia & Shpallja',       bn:'নবুওয়াত ও ওহী',
    bs:'Poslanstvo & Objava',       zh:'先知与启示',
    de:'Prophetie & Offenbarung',   en:'Prophethood & Revelation',
    ha:'Annabci & Wahayi',          hi:'नबुव्वत और वही',
    id:'Kenabian & Wahyu',          fa:'نبوت و وحی',
    ru:'Пророчество и Откровение',  tr:'Nübüvvet & Vahiy',
    ur:'نبوت اور وحی',              ug:'پەيغەمبەرلىك ۋە ۋەھي',
  },
  'الأخلاق': {
    sq:'Etika & Karakteri',         bn:'নৈতিকতা ও চরিত্র',
    bs:'Etika & Karakter',          zh:'品德',
    de:'Ethik & Charakter',         en:'Ethics & Character',
    ha:'Ɗabi\'a',                   hi:'नैतिकता और चरित्र',
    id:'Etika & Karakter',          fa:'اخلاق',
    ru:'Этика и характер',          tr:'Ahlak & Karakter',
    ur:'اخلاق اور کردار',           ug:'ئەخلاق ۋە خاراكتېر',
  },
  'الخلق والطبيعة': {
    sq:'Krijimi & Natyra',          bn:'সৃষ্টি ও প্রকৃতি',
    bs:'Stvaranje & Priroda',       zh:'创造与自然',
    de:'Schöpfung & Natur',         en:'Creation & Nature',
    ha:'Halitta & Yanayi',          hi:'सृष्टि और प्रकृति',
    id:'Penciptaan & Alam',         fa:'آفرینش و طبیعت',
    ru:'Творение и природа',        tr:'Yaratılış & Doğa',
    ur:'تخلیق اور فطرت',            ug:'يارىتىلىش ۋە تەبىئەت',
  },
  'الأذكار': {
    sq:'Shprehjet kur\'anore',      bn:'কুরআনিক বাক্যাংশ',
    bs:'Kur\'anske formule',        zh:'古兰经关键短语',
    de:'Schlüsselformeln',          en:'Quranic Key Phrases',
    ha:'Kalmomi na Alƙur\'ani',     hi:'क़ुरआनी मुख्य वाक्यांश',
    id:'Frasa Kunci Al-Qur\'an',    fa:'عبارات کلیدی قرآن',
    ru:'Ключевые фразы Корана',     tr:'Kur\'an\'ın Temel İfadeleri',
    ur:'قرآنی کلیدی جملے',          ug:'قۇرئاننىڭ ئاچار ئىبارىلىرى',
  },
};

const MARKER = '<!-- wbm-lang-headers -->';

let fixed = 0, skipped = 0;

const langDirs = fs.readdirSync(QURAN_OVER).filter(d =>
  fs.statSync(path.join(QURAN_OVER, d)).isDirectory()
);

for (const langDir of langDirs) {
  const file = path.join(QURAN_OVER, langDir, 'woerterbuch.html');
  if (!fs.existsSync(file)) { skipped++; continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) { console.log(`  – ${langDir}: already patched`); skipped++; continue; }

  // Extract lang code from <html lang="XX"
  const langMatch = html.match(/<html[^>]+lang="([^"]+)"/);
  if (!langMatch) { console.warn(`  ⚠ ${langDir}: no lang attribute found`); skipped++; continue; }
  const code = langMatch[1]; // e.g. "de", "en", "tr" …

  let changed = false;
  // For each known Arabic category, replace the German .cat-de content
  for (const [arText, translations] of Object.entries(CAT)) {
    const tr = translations[code];
    if (!tr) continue;

    // Match: <span class="cat-ar">ARABIC</span>  then  <span class="cat-de">ANYTHING</span>
    const re = new RegExp(
      `(<span class="cat-ar">${escapeRe(arText)}<\\/span>\\s*<span class="cat-de">)[^<]*(<\\/span>)`,
      'g'
    );
    const before = html;
    html = html.replace(re, `$1${tr}$2`);
    if (html !== before) changed = true;
  }

  if (!changed) { console.log(`  – ${langDir}: no cat-de spans matched`); skipped++; continue; }

  // Mark as done
  html = html.replace('</head>', `${MARKER}\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`  ✓ ${langDir} [${code}] — category headers updated`);
  fixed++;
}

console.log(`\n✅ Lang headers: ${fixed} fixed, ${skipped} skipped.\n`);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
