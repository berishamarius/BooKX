/**
 * fix-revert-bible-bg.js
 * Entfernt den Kreuz-Hintergrund und body::after aus beiden Bibel-Büchern.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX';

function patchAllHtml(dir, patchFn, label) {
  if (!fs.existsSync(dir)) { console.log('SKIP:', dir); return 0; }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let n = 0;
  for (const f of files) {
    const fp = path.join(dir, f);
    const orig = fs.readFileSync(fp, 'utf8');
    const out = patchFn(orig);
    if (out !== orig) { fs.writeFileSync(fp, out, 'utf8'); n++; }
  }
  console.log(`[${label}] Patched ${n}/${files.length}`);
  return n;
}

function revertBibelDeutsch(html) {
  // Entferne background-image + background-size + body::after
  html = html.replace(
    /body\{\n  background:#e8e0d0;\n  background-image:\n    linear-gradient\(transparent 43%, rgba\(180,145,40,\.07\)[^\n]+\n    linear-gradient\(90deg,[^\n]+\n    radial-gradient\(circle,[^\n]+\n  background-size:[^\n]+\n  font-family:'EB Garamond',serif;\n  color:#1A0E06;\n  font-size:17px;\n\}\nbody::after\{[^\n]+\}/,
    `body{\n  background:#e8e0d0;\n  font-family:'EB Garamond',serif;\n  color:#1A0E06;\n  font-size:17px;\n}`
  );
  return html;
}

function revertCatholicBible(html) {
  html = html.replace(
    /body\{\n  background:#2C0810;\n  background-image:\n    linear-gradient\(transparent 42%,[^\n]+\n    linear-gradient\(90deg,[^\n]+\n    radial-gradient\(circle,[^\n]+\n    radial-gradient\(ellipse[^\n]+\n  background-size:[^\n]+\n  font-family:'EB Garamond',serif;\n  color:#1A0E06;\n  font-size:17px;\n\}\nbody::after\{[^\n]+\}/,
    `body{\n  background:#2C0810;\n  background-image:radial-gradient(ellipse at 50% 20%,#4A1020 0%,#1A0407 100%);\n  font-family:'EB Garamond',serif;\n  color:#1A0E06;\n  font-size:17px;\n}`
  );
  return html;
}

let total = 0;
total += patchAllHtml(
  path.join(BASE, 'Geschenke\\Bibel-Deutsch\\Übersetzungen\\german\\bücher'),
  revertBibelDeutsch, 'Bibel-Deutsch'
);
total += patchAllHtml(
  path.join(BASE, 'CATHOLIC-BIBLE\\Übersetzungen\\german\\bücher'),
  revertCatholicBible, 'CATHOLIC-BIBLE'
);

console.log(`\n✓ Total: ${total}`);
