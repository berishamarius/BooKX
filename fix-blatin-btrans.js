/**
 * fix-blatin-btrans.js
 * Fix .blatin-p (copy Latin name from .blatin-c) and .btrans encoding.
 * The original files had garbled/? chars in blatin-p and btrans.
 * Solution: use the Latin book name + HTML-entity language name.
 */

const fs = require('fs');
const path = require('path');

const DIST = 'dist-diebibel';

// Language display names with HTML entities for non-ASCII chars
const LANG_DISPLAY = {
  albanian:   'Shqip',
  croatian:   'Hrvatski',
  czech:      '&#268;esky',         // Česky (Č = U+010C)
  dutch:      'Nederlands',
  french:     'Fran&ccedil;ais',    // Français
  hungarian:  'Magyar',
  italian:    'Italiano',
  kjv:        'King James Version',
  polish:     'Polski',
  portuguese: 'Portugu&ecirc;s',    // Português
  romanian:   'Rom&acirc;n&atilde;', // Română
  russian:    '&#1056;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081;', // Русский
  spanish:    'Espa&ntilde;ol',     // Español
  swedish:    'Svenska',
  tagalog:    'Tagalog',
  ukrainian:  '&#1059;&#1082;&#1088;&#1072;&#1111;&#1085;&#1089;&#1100;&#1082;&#1072;', // Українська
};

let totalFixed = 0;
let totalFiles = 0;

const langs = fs.readdirSync(DIST).filter(d => {
  const full = path.join(DIST, d);
  try {
    return fs.statSync(full).isDirectory() && d !== 'german' && d !== 'node_modules';
  } catch(e) { return false; }
});

console.log(`Processing ${langs.length} languages...`);

for (const lang of langs) {
  const bDir = path.join(DIST, lang, 'b\u00FCcher');
  if (!fs.existsSync(bDir)) continue;

  const langName = LANG_DISPLAY[lang] || lang;
  const files = fs.readdirSync(bDir).filter(f => f.endsWith('.html'));
  let langFixed = 0;

  for (const file of files) {
    const fp = path.join(bDir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let changed = false;

    // 1. Fix .blatin-p: copy Latin name from .blatin-c
    // .blatin-c contains the Latin book name (GENESIS, EXODUS, etc.) - always ASCII
    const blatinCMatch = html.match(/<div class="blatin blatin-c">([^<]*)<\/div>/);
    if (blatinCMatch) {
      const latinName = blatinCMatch[1]; // e.g. "GENESIS" - pure ASCII
      const blatinPMatch = html.match(/<div class="blatin blatin-p">([^<]*)<\/div>/);
      if (blatinPMatch) {
        const currentP = blatinPMatch[1];
        // Fix if: contains &Iuml; or &#191; or ? or is not clean
        if (currentP !== latinName && (
          currentP.includes('&Iuml;') || currentP.includes('&#191;') ||
          currentP.includes('&#189;') || currentP.includes('?') ||
          /&[a-z]+;|&#\d+;/.test(currentP) || /[^\x00-\x7E]/.test(currentP)
        )) {
          html = html.replace(
            `<div class="blatin blatin-p">${currentP}</div>`,
            `<div class="blatin blatin-p">${latinName}</div>`
          );
          changed = true;
        }
      }
    }

    // 2. Fix .btrans: use Latin book name + correct language name
    // Pattern: <div class="btrans">BookName &nbsp;&middot;&nbsp; <em>Language</em></div>
    // OR: <div class="btrans">BookName &nbsp;&middot;&nbsp; <em>Language</em></div>
    if (blatinCMatch) {
      const latinName = blatinCMatch[1];
      // Capitalize first letter, rest lowercase: GENESIS -> Genesis
      const displayName = latinName.charAt(0) + latinName.slice(1).toLowerCase();

      html = html.replace(
        /<div class="btrans">([^<]*?)(&nbsp;&middot;&nbsp;|·)\s*(<em>[^<]*<\/em>)<\/div>/,
        (m, bookPart, sep, emPart) => {
          // Fix the language in <em>
          const newEm = `<em>${langName}</em>`;
          // Fix the book part - use Latin displayName
          const newBook = displayName + ' ';
          const newBtrans = `<div class="btrans">${newBook}&nbsp;&middot;&nbsp; ${newEm}</div>`;
          if (newBtrans !== m) {
            changed = true;
            return newBtrans;
          }
          return m;
        }
      );
    }

    // 3. Fix <title> encoding: replace garbled language name
    html = html.replace(/<title>([^<]*)<\/title>/, (m, content) => {
      // Check for garbled content (contains &Iuml; or &#191; etc.)
      if (content.includes('&Iuml;') || content.includes('&#191;') || content.includes('?')) {
        // Extract parts: "BookName · Language · Biblia Catholica"
        // Rebuild using Latin book name + correct lang name
        const latinName = (blatinCMatch || [null,''])[1];
        if (latinName) {
          const displayName = latinName.charAt(0) + latinName.slice(1).toLowerCase();
          const newTitle = `<title>${displayName} &middot; ${langName} &middot; Biblia Catholica</title>`;
          if (newTitle !== m) {
            changed = true;
            return newTitle;
          }
        }
      }
      return m;
    });

    if (changed) {
      fs.writeFileSync(fp, html, 'utf8');
      langFixed++;
    }
  }

  if (langFixed > 0) {
    console.log(`  ${lang}: fixed ${langFixed}/${files.length} files`);
  }
  totalFixed += langFixed;
  totalFiles += files.length;
}

console.log(`\nDone: fixed ${totalFixed}/${totalFiles} chapter files`);
