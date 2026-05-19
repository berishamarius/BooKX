/**
 * fix-it-ro-final.js
 * Final correct fix:
 * - Italian: re-read old git file as UTF-8 (was read as latin1 = double-encode bug)
 *   Re-inject all verse texts with correct encoding. HTML-encode special chars properly.
 * - Romanian: clear garbled content from base-p and remove spurious .tra elements
 *   (Romanian never had real text, just — placeholders)
 */

'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST = 'dist-diebibel';
const GIT_COMMIT = '86492d74';

// HTML-escape only the 5 special chars; Unicode can stay as-is in UTF-8 HTML
function htmlEscape(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Extract verse ID → native text map from old-design HTML (UTF-8).
 * Sequential scan handles both chapter-first-verse and normal verse-block classes.
 */
function extractOldVerses(oldHtml) {
  const verses = {};
  let pos = 0;
  while (true) {
    const vbIdx = oldHtml.indexOf('<div class="verse-block', pos);
    if (vbIdx === -1) break;
    const tagEnd = oldHtml.indexOf('>', vbIdx);
    if (tagEnd === -1) break;
    const openTag = oldHtml.substring(vbIdx, tagEnd + 1);
    const idMatch = openTag.match(/id="(v\d+-\d+)"/);
    if (!idMatch) { pos = tagEnd + 1; continue; }
    const vid = idMatch[1];

    // Block content goes until next verse-block or </section>
    const nextVb = oldHtml.indexOf('<div class="verse-block', tagEnd + 1);
    const nextSec = oldHtml.indexOf('</section>', tagEnd + 1);
    const blockEnd = Math.min(
      nextVb === -1 ? Infinity : nextVb,
      nextSec === -1 ? Infinity : nextSec
    );
    if (blockEnd === Infinity) { pos = tagEnd + 1; continue; }

    const blockContent = oldHtml.substring(tagEnd + 1, blockEnd);
    const transNeedle = '<div class="trans">';
    const transStart = blockContent.indexOf(transNeedle);
    if (transStart !== -1) {
      const textStart = transStart + transNeedle.length;
      const textEnd = blockContent.indexOf('</div>', textStart);
      if (textEnd !== -1) {
        verses[vid] = blockContent.substring(textStart, textEnd).trim();
      }
    }
    pos = blockEnd;
  }
  return verses;
}

function readOldFile(lang, file) {
  const gitPath = `dist-diebibel/${lang}/b\u00FCcher/${file}`;
  try {
    // Read as UTF-8 — the old files ARE UTF-8 encoded
    return execSync(`git show "${GIT_COMMIT}:${gitPath}"`, { encoding: 'utf8' });
  } catch (e) {
    return null;
  }
}

// ─── ITALIAN: re-inject verse text with correct UTF-8 reading ────────────────
const itDir = path.join(DIST, 'italian', 'b\u00FCcher');
const itFiles = fs.readdirSync(itDir).filter(f => f.endsWith('.html'));
let itFixed = 0, itVerses = 0;

console.log('=== Processing Italian ===');
for (const file of itFiles) {
  const fp = path.join(itDir, file);
  let html = fs.readFileSync(fp, 'utf8');

  const oldHtml = readOldFile('italian', file);
  if (!oldHtml) { console.log(`  SKIP ${file}`); continue; }

  const oldVerses = extractOldVerses(oldHtml);
  if (Object.keys(oldVerses).length === 0) { console.log(`  WARN ${file}: no verses`); continue; }

  let versesSet = 0;
  let changed = false;

  // Replace every verse block: overwrite base-p and .tra with correct text
  html = html.replace(
    /(<div class="vb[^"]*" id="(v\d+-\d+)">)([\s\S]*?)(<\/div>\s*<\/div>)/g,
    (match, openDiv, vid, inner, closeDiv) => {
      const native = oldVerses[vid];
      if (native === undefined) return match;

      // Skip if text is a dash placeholder
      const trimmed = native.trim();
      if (trimmed === '—' || trimmed === '-' || trimmed === '') return match;

      const encoded = htmlEscape(trimmed);

      // Replace base-p (and existing .tra if present) with correct text
      const newInner = inner.replace(
        /<p class="base base-p">[\s\S]*?<\/p>(\s*<p class="tra">[\s\S]*?<\/p>)?/,
        `<p class="base base-p">${encoded}</p>\n    <p class="tra">${encoded}</p>`
      );

      if (newInner !== inner) {
        changed = true;
        versesSet++;
        return openDiv + newInner + closeDiv;
      }
      return match;
    }
  );

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    itFixed++;
    itVerses += versesSet;
  }
}
console.log(`Italian: ${itFixed} files updated, ${itVerses} verses re-encoded`);

// ─── ROMANIAN: clear garbled dash content, leave clean empty base-p ──────────
const roDir = path.join(DIST, 'romanian', 'b\u00FCcher');
const roFiles = fs.readdirSync(roDir).filter(f => f.endsWith('.html'));
let roFixed = 0, roCleared = 0;

console.log('\n=== Processing Romanian (clearing garbled content) ===');
for (const file of roFiles) {
  const fp = path.join(roDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Remove .tra elements entirely (garbled dashes or empty)
  // Replace base-p with garbled content → clean empty
  // Also remove any spurious .tra paragraph that was added
  const newHtml = html.replace(
    /<p class="base base-p">[^<]*<\/p>(\s*<p class="tra">[^<]*<\/p>)?/g,
    () => {
      changed = true;
      roCleared++;
      return '<p class="base base-p"></p>';
    }
  );

  if (changed) {
    fs.writeFileSync(fp, newHtml, 'utf8');
    roFixed++;
  }
}
console.log(`Romanian: ${roFixed} files cleaned, ${roCleared} base-p elements cleared`);
