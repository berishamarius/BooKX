// fix-chapter-titles.js
// Fixes corrupted language names in <title> tags of chapter files
// Pattern: U+00CF U+00BF U+00BD ("Ï¿½") replaces diacritic characters
'use strict';
const fs = require('fs');
const path = require('path');

const TRIPLE = '\u00EF\u00BF\u00BD'; // ï¿½ — actual corruption pattern in chapter files

// Map of languages to their correct <title> language name
// The broken pattern in <title>: "Ce" + TRIPLE + "tina" instead of "Čeština"
const LANG_TITLE_FIXES = {
  czech:      [['Ce'       + TRIPLE + 'tina', '\u010Ce\u0161tina']],  // Čeština
  french:     [['Fran'     + TRIPLE + 'ais',  'Fran\u00E7ais']],      // français
  spanish:    [['Espa'     + TRIPLE + 'ol',   'Espa\u00F1ol']],       // español
  portuguese: [['Portugu'  + TRIPLE + 's',    'Portugu\u00EAs']],     // português
};

// Also fix the CSS comment that contains corrupted chars (same pattern)
// /* Innerer Rahmen Ï¿½ Ï¿½uÏ¿½erer Ring */ → just remove the comment or fix
// Actually the CSS comment corruption just needs to be cleaned:
// "Innerer Rahmen Ï¿½ Ï¿½uÏ¿½erer Ring" should be a decorative ring description
// Since these are just CSS comments, we can just remove the broken chars from comments only
const CSS_COMMENT_FIX = [
  ['Innerer Rahmen ' + TRIPLE + ' ' + TRIPLE + 'u' + TRIPLE + 'erer Ring',
   'Innerer Rahmen \u00B7 \u00E4u\u00DFerer Ring'],
];

let totalFixed = 0;
let totalFiles = 0;

function fixFile(filePath, allFixes) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch(e) { return; }

  let updated = content;
  for (const [from, to] of allFixes) {
    if (updated.includes(from)) {
      updated = updated.split(from).join(to);
    }
  }

  totalFiles++;
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    totalFixed++;
    return true;
  }
  return false;
}

// Fix bücher directories for each language
const langs = Object.keys(LANG_TITLE_FIXES);
for (const lang of langs) {
  const buchDir = `dist-diebibel/${lang}/b\u00FCcher`;
  let files;
  try { files = fs.readdirSync(buchDir).filter(f => f.endsWith('.html')); }
  catch(e) { console.log(`  SKIP ${lang}: ${e.message}`); continue; }

  const fixes = [...LANG_TITLE_FIXES[lang], ...CSS_COMMENT_FIX];
  let langFixed = 0;
  for (const f of files) {
    if (fixFile(path.join(buchDir, f), fixes)) langFixed++;
  }
  console.log(`${lang}: fixed ${langFixed}/${files.length} files`);
}

// Also scan ALL other languages for any remaining TRIPLE in bücher chapters
const allLangs = ['albanian','croatian','dutch','hungarian','italian','kjv','polish','romanian','russian','swedish','tagalog','ukrainian'];
console.log('\nScanning other languages for TRIPLE...');
for (const lang of allLangs) {
  const buchDir = `dist-diebibel/${lang}/b\u00FCcher`;
  let files;
  try { files = fs.readdirSync(buchDir).filter(f => f.endsWith('.html')); }
  catch(e) { continue; }

  let found = false;
  for (const f of files) {
    try {
      const c = fs.readFileSync(path.join(buchDir, f), 'utf8');
      if (c.includes(TRIPLE)) {
        if (!found) { console.log(`  ${lang} has TRIPLE in chapter files!`); found = true; }
        // find context
        const idx = c.indexOf(TRIPLE);
        console.log(`    ${f}: ${JSON.stringify(c.substring(Math.max(0,idx-20),idx+21))}`);
        break; // just show first occurrence
      }
    } catch(e) {}
  }
}

console.log(`\n✓ Done. Fixed ${totalFixed}/${totalFiles} chapter files.`);
