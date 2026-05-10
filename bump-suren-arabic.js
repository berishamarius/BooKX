const fs = require('fs');
const path = require('path');

const root = 'c:/Users/beris_xrgc50t/KX KroniX/BooKX';
const dirs = [
  'dist-alquran/Übersetzungen/Deutsch/suren',
  'dist-karim/Übersetzungen/Deutsch/suren',
  'dist-meliha/Übersetzungen/Deutsch/suren',
];

const forceFrom = 'div.ar,span.ar,p.ar{font-weight:700 !important;font-size:1.72em !important;letter-spacing:.03em;line-height:2.28 !important;word-spacing:.1em;}';
const forceTo = 'div.ar,span.ar,p.ar{font-weight:700 !important;font-size:1.80em !important;letter-spacing:.03em;line-height:2.34 !important;word-spacing:.1em;}';

const mobileFrom = '@media(max-width:700px){.verse .ar{font-size:1.44em !important;line-height:1.90 !important;}.sh-name{font-size:2.8rem !important;}}';
const mobileTo = '@media(max-width:700px){.verse .ar{font-size:1.52em !important;line-height:1.96 !important;}.sh-name{font-size:2.8rem !important;}}';

for (const rel of dirs) {
  const abs = path.join(root, rel);
  const files = fs.readdirSync(abs).filter((f) => f.endsWith('.html'));
  let changed = 0;
  let forceCount = 0;
  let mobileCount = 0;

  for (const file of files) {
    const full = path.join(abs, file);
    const original = fs.readFileSync(full, 'utf8');
    let next = original;

    if (next.includes(forceFrom)) {
      next = next.replaceAll(forceFrom, forceTo);
      forceCount += 1;
    }
    if (next.includes(mobileFrom)) {
      next = next.replaceAll(mobileFrom, mobileTo);
      mobileCount += 1;
    }

    if (next !== original) {
      fs.writeFileSync(full, next, 'utf8');
      changed += 1;
    }
  }

  console.log(`${rel}: total=${files.length} changed=${changed} forceUpdated=${forceCount} mobileUpdated=${mobileCount}`);
}
