// fix-encoding-errors.js
// Fixes encoding corruption in dist-diebibel:
//   1. Four language index hlang divs with Ï¿½ (U+00CF U+00BF U+00BD) corruption
//   2. Italian cover: "Bibbia"→"Biblia", remove "Giovanni Diodati" subtitle
'use strict';
const fs = require('fs');
const path = require('path');

// The actual corruption in the files: 3 chars U+00CF U+00BF U+00BD ("Ï¿½")
// This happened when U+FFFD (0xEF 0xBF 0xBD) was re-encoded through Latin-1→UTF-8
const TRIPLE = '\u00CF\u00BF\u00BD';

let changed = 0;

function fixAndSave(filePath, transforms) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch(e) { console.log(`  SKIP (not found): ${filePath}`); return; }

  let updated = content;
  for (const [from, to] of transforms) {
    if (updated.includes(from)) {
      updated = updated.split(from).join(to);
      console.log(`  FIXED: "${from}" \u2192 "${to}"  (${path.basename(filePath)})`);
    }
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    changed++;
  } else {
    console.log(`  OK (no match): ${path.basename(filePath)}`);
  }
}

// ── 1. Language index hlang div encoding fixes ────────────────────────────────
console.log('\n=== 1. Language index hlang encoding ===');

fixAndSave('dist-diebibel/french/index.html',     [['FRAN\u00CF\u00BF\u00BDAIS',  'FRAN\u00C7AIS']]);
fixAndSave('dist-diebibel/czech/index.html',      [['CE\u00CF\u00BF\u00BDTINA',   '\u010CE\u0160TINA']]);
fixAndSave('dist-diebibel/portuguese/index.html', [['PORTUGU\u00CF\u00BF\u00BDS', 'PORTUGU\u00CAS']]);
fixAndSave('dist-diebibel/spanish/index.html',    [['ESPA\u00CF\u00BF\u00BDOL',   'ESPA\u00D1OL']]);

// ── 2. Italian cover: title + remove Giovanni Diodati ────────────────────────
console.log('\n=== 2. Italian cover text ===');
(function() {
  const p = 'dist-diebibel/italian/cover.html';
  let c;
  try { c = fs.readFileSync(p, 'utf8'); }
  catch(e) { console.log('  SKIP italian cover:', e.message); return; }
  const original = c;
  c = c.split('La Sacra Bibbia').join('La Biblia');
  c = c.replace(/<div class="h-sub">[^<]*Giovanni[^<]*<\/div>/gi, '');
  c = c.replace(/<div class='h-sub'>[^<]*Giovanni[^<]*<\/div>/gi, '');
  if (c !== original) {
    fs.writeFileSync(p, c, 'utf8');
    changed++;
    console.log('  FIXED italian/cover.html');
  } else {
    // Show current htitle/h-sub so we can see what needs manual fix
    const ti = c.indexOf('htitle'); const si = c.indexOf('h-sub');
    if (ti >= 0) console.log('  htitle now:', JSON.stringify(c.substring(ti, ti+60)));
    if (si >= 0) console.log('  h-sub now:', JSON.stringify(c.substring(si, si+80)));
  }
})();

// ── 3. Italian index title fix ───────────────────────────────────────────────
console.log('\n=== 3. Italian index text ===');
fixAndSave('dist-diebibel/italian/index.html', [['La Sacra Bibbia', 'La Biblia']]);

// ── 4. Verify no remaining TRIPLE in any index file ──────────────────────────
console.log('\n=== 4. Verification ===');
const langs = ['albanian','croatian','czech','dutch','french','hungarian','italian','kjv','polish','portuguese','romanian','russian','spanish','swedish','tagalog','ukrainian'];
let bad = 0;
langs.forEach(lang => {
  try {
    const c = fs.readFileSync(`dist-diebibel/${lang}/index.html`, 'utf8');
    if (c.includes(TRIPLE)) { console.log(`  STILL BROKEN: ${lang}/index.html`); bad++; }
  } catch(e) {}
});
if (bad === 0) console.log('  All index files clean \u2713');

console.log(`\n\u2713 Done. ${changed} file(s) updated.`);

