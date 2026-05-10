'use strict';

const fs = require('fs');
const path = require('path');

const DIRS = [
  { key: 'diebibel', dir: 'CATHOLIC-BIBLE/Übersetzungen/german/bücher' },
  { key: 'micheles', dir: 'Geschenke/Bibel-Deutsch/Übersetzungen/german/bücher' },
];

const XREF_RE = /(\bvgl\.|\bs\.?\s*v(?:ers)?\.?\s*\d+|\bsiehe\s+v(?:ers)?\.?\s*\d+|\bwie\s+vers\s*\d+|\bgleich\s+wie\s+v(?:ers)?\.?\s*\d+|\bidentisch\s+mit\s+v(?:ers)?\.?\s*\d+|→\s*v(?:ers)?\.?\s*\d+|=\s*v(?:ers)?\.?\s*\d+)/i;

for (const d of DIRS) {
  let hits = 0;
  let examples = 0;
  if (!fs.existsSync(d.dir)) {
    console.log(`${d.key}: dir not found`);
    continue;
  }

  for (const f of fs.readdirSync(d.dir).filter(x => x.endsWith('.html'))) {
    const fp = path.join(d.dir, f);
    const text = fs.readFileSync(fp, 'utf8');
    const trs = [...text.matchAll(/<p class="tra">([\s\S]*?)<\/p>/g)];
    trs.forEach((m, i) => {
      const t = (m[1] || '').replace(/\s+/g, ' ').trim();
      if (XREF_RE.test(t)) {
        hits++;
        if (examples < 8) {
          console.log(`${d.key} ${f} V${i + 1}: ${t.slice(0, 120)}`);
          examples++;
        }
      }
    });
  }

  console.log(`${d.key}: xref hits = ${hits}`);
}
