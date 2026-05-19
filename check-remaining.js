// check-remaining.js — find files that still have the corruption
'use strict';
const fs = require('fs');
const path = require('path');

const TRIPLE_LOWER = '\u00EF\u00BF\u00BD';
const TRIPLE_UPPER = '\u00CF\u00BF\u00BD';

const langs = ['czech','french','spanish','portuguese'];
for (const lang of langs) {
  const buchDir = `dist-diebibel/${lang}/b\u00FCcher`;
  let files;
  try { files = fs.readdirSync(buchDir).filter(f => f.endsWith('.html')).sort(); }
  catch(e) { continue; }

  const remaining = [];
  for (const f of files) {
    const c = fs.readFileSync(path.join(buchDir, f), 'utf8');
    if (c.includes(TRIPLE_LOWER) || c.includes(TRIPLE_UPPER)) {
      remaining.push(f);
      // Show title
      const ti = c.indexOf('<title>');
      const te = c.indexOf('</title>');
      console.log(`  ${lang}/${f}: ${JSON.stringify(c.substring(ti, te+8))}`);
    }
  }
  if (remaining.length === 0) console.log(`${lang}: all clean ✓`);
  else console.log(`${lang}: ${remaining.length} remaining`);
}
