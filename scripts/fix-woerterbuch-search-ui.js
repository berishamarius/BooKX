'use strict';
/**
 * fix-woerterbuch-search-ui.js
 * Patches the search placeholder and UI text in each woerterbuch.html
 * to match the target language (instead of always showing German).
 * Identifies language from <html lang="XX"> attribute.
 */
const fs   = require('fs');
const path = require('path');

const QURAN_OVER = path.resolve(__dirname, '..', 'dist-alquran', 'Übersetzungen');

/* ── UI text translations ────────────────────────────────────────────────── */
const UI = {
  sq: { placeholder:'Arabisht, transliterim ose Shqip …',   subtitle:'FJALOR · ARABISHT KURANORE', results:'rezultate', entries:'hyrje' },
  bn: { placeholder:'আরবি, প্রতিলিপি বা বাংলা …',          subtitle:'অভিধান · কুরআনিক আরবি',    results:'ফলাফল',  entries:'শব্দ' },
  bs: { placeholder:'Arapski, transliteracija ili Bosanski …', subtitle:'RJEČNIK · KURANSKOG ARAPSKOG', results:'rezultata', entries:'unosa' },
  zh: { placeholder:'阿拉伯语、转写或中文 …',                  subtitle:'词典 · 古兰经阿拉伯语',      results:'个结果', entries:'个词条' },
  de: { placeholder:'Arabisch, Umschrift oder Deutsch …',   subtitle:'WÖRTERBUCH · KORANISCHES ARABISCH', results:'Ergebnisse', entries:'Einträge' },
  en: { placeholder:'Arabic, transliteration or English …', subtitle:'DICTIONARY · QURANIC ARABIC',   results:'results',   entries:'entries' },
  ha: { placeholder:'Larabci, rubutun ko Hausa …',          subtitle:'ƘAMUS · LARABCIN ALƘUR\'ANI',  results:'sakamako',  entries:'ƙwararru' },
  hi: { placeholder:'अरबी, लिप्यंतरण या हिन्दी …',          subtitle:'शब्दकोश · क़ुरआनी अरबी',    results:'परिणाम',   entries:'शब्द' },
  id: { placeholder:'Arab, transliterasi atau Bahasa Indonesia …', subtitle:'KAMUS · BAHASA ARAB AL-QUR\'AN', results:'hasil', entries:'entri' },
  fa: { placeholder:'عربی، لاتین‌نویسی یا فارسی …',         subtitle:'واژه‌نامه · عربی قرآنی',     results:'نتیجه',    entries:'واژه' },
  ru: { placeholder:'Арабский, транслитерация или Русский …', subtitle:'СЛОВАРЬ · КОРАНИЧЕСКИЙ АРАБСКИЙ', results:'результатов', entries:'записей' },
  tr: { placeholder:'Arapça, okunuş veya Türkçe …',         subtitle:'SÖZLÜK · KURAN\'IN ARAPÇASI', results:'sonuç',     entries:'giriş' },
  ur: { placeholder:'عربی، حروف تہجی یا اردو …',            subtitle:'لغت · قرآنی عربی',           results:'نتائج',    entries:'الفاظ' },
  ug: { placeholder:'ئەرەبچە، ترانسلىتراتسىيە ياكى ئۇيغۇرچە …', subtitle:'لۇغەت · قۇرئانىي ئەرەبچە', results:'نەتىجە', entries:'تۈر' },
};

const MARKER = '<!-- wbm-search-ui -->';

let fixed = 0, skipped = 0;

const langDirs = fs.readdirSync(QURAN_OVER).filter(d =>
  fs.statSync(path.join(QURAN_OVER, d)).isDirectory()
);

for (const langDir of langDirs) {
  const file = path.join(QURAN_OVER, langDir, 'woerterbuch.html');
  if (!fs.existsSync(file)) { skipped++; continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) { console.log(`  – ${langDir}: already patched`); skipped++; continue; }

  const langMatch = html.match(/<html[^>]+lang="([^"]+)"/);
  if (!langMatch) { console.warn(`  ⚠ ${langDir}: no lang attribute`); skipped++; continue; }
  const code = langMatch[1];
  const ui = UI[code];
  if (!ui) { console.warn(`  ⚠ ${langDir}: no UI translations for lang "${code}"`); skipped++; continue; }

  let changed = false;

  // 1. Replace search placeholder
  const phBefore = html;
  html = html.replace(
    /(<input[^>]+class="search-inp"[^>]+placeholder=")[^"]*(")/,
    `$1${ui.placeholder}$2`
  );
  if (html !== phBefore) changed = true;

  // 2. Replace subtitle text (inside .sh-subtitle span)
  const subBefore = html;
  html = html.replace(
    /(<span class="sh-subtitle">)[^<]*(<\/span>)/,
    `$1${ui.subtitle}$2`
  );
  if (html !== subBefore) changed = true;

  // 3. Replace JS count strings: 'Ergebnisse' / 'Einträge'
  const jsBefore = html;
  html = html.replace(
    /\+ ' Ergebnisse'/g,
    `+ ' ${ui.results}'`
  ).replace(
    /\+ ' Einträge'/g,
    `+ ' ${ui.entries}'`
  );
  if (html !== jsBefore) changed = true;

  if (!changed) { console.log(`  – ${langDir}: nothing matched`); skipped++; continue; }

  html = html.replace('</head>', `${MARKER}\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`  ✓ ${langDir} [${code}] — search UI text updated`);
  fixed++;
}

console.log(`\n✅ Search UI: ${fixed} fixed, ${skipped} skipped.\n`);
