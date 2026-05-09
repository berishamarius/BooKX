'use strict';
const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const K1   = path.join(BASE, 'Geschenke', 'Koran-Deutsch-1');
const K2   = path.join(BASE, 'Geschenke', 'Koran-Deutsch-2');

// ── Meliha color fixes ────────────────────────────────────────────────────
// nav + header bg: #1a0a40, #150030 → #2d1060 (match cover)
// ph header bg: #150030 → #2d1060
// footer bg: #150030 → #2d1060
// disc-banner: rgba(100,80,180,.05) border → rgba(149,117,205,.15) (lighter purple)
// h2 color: #3a0a28 → #2d1060
// body color: #180838 → #180840
const K1_HTML = [
  ['background:#1a0a40;',  'background:#2d1060;'],
  ['background:#150030;',  'background:#2d1060;'],
  // surah page nav/footer already uses same values
  ['background:#1a0840;',  'background:#2d1060;'],
  ['background:#080028;',  'background:#2d1060;'],
  ['background:#050018;',  'background:#2d1060;'],
  ['background:#1a0050;',  'background:#2d1060;'],
  // header gradient in suren
  ['background:linear-gradient(180deg,#1a0850 0%,#150030 100%)',
   'background:linear-gradient(180deg,#3d1a80 0%,#2d1060 100%)'],
  // nav border
  ['border-bottom:2px solid rgba(100,80,180,.28)',
   'border-bottom:2px solid rgba(149,117,205,.35)'],
  // row hover in index
  ['background:rgba(100,80,180,.06)',
   'background:rgba(149,117,205,.08)'],
  // h2 border color
  ['border-bottom:1px solid rgba(100,80,180,.22)',
   'border-bottom:1px solid rgba(149,117,205,.28)'],
  // disc-banner
  ['background:rgba(100,80,180,.05);border-top:1px solid rgba(100,80,180,.16);border-bottom:1px solid rgba(100,80,180,.14)',
   'background:rgba(149,117,205,.05);border-top:1px solid rgba(149,117,205,.2);border-bottom:1px solid rgba(149,117,205,.18)'],
];

// ── Karim CTA color fix ───────────────────────────────────────────────────
// bright red #ce1126 → dark forest green matching cover
const K2_HTML = [
  ['background:#ce1126;color:#fff;', 'background:#003a1e;color:#c9a84c;'],
  ['background:#b00d20;border-color:#ce1126', 'background:#004d28;border-color:#003a1e'],
  // hover state in redesign7
  ['background:#b00d20',  'background:#004d28'],
  ['color:#fff;font:.74rem', 'color:#c9a84c;font:.74rem'],
];

function patchDir(dir, pairs) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const fp  = path.join(dir, entry.name);
    let src   = fs.readFileSync(fp, 'utf8');
    let changed = false;
    for (const [from, to] of pairs) {
      if (src.includes(from)) { src = src.split(from).join(to); changed = true; total++; }
    }
    if (changed) fs.writeFileSync(fp, src, 'utf8');
  }
  return total;
}

function patchSuren(surenDir, pairs) {
  if (!fs.existsSync(surenDir)) return 0;
  let total = 0;
  for (const f of fs.readdirSync(surenDir)) {
    if (!f.endsWith('.html')) continue;
    const fp  = path.join(surenDir, f);
    let src   = fs.readFileSync(fp, 'utf8');
    let changed = false;
    for (const [from, to] of pairs) {
      if (src.includes(from)) { src = src.split(from).join(to); changed = true; total++; }
    }
    if (changed) fs.writeFileSync(fp, src, 'utf8');
  }
  return total;
}

// Meliha — fix main files + suren
let n = patchDir(path.join(K1, 'Übersetzungen', 'Deutsch'), K1_HTML);
n += patchSuren(path.join(K1, 'Übersetzungen', 'Deutsch', 'suren'), K1_HTML);
console.log(`✅  Meliha HTML: ${n} Ersetzungen`);

// Karim — fix main files + suren
let m = patchDir(path.join(K2, 'Übersetzungen', 'Deutsch'), K2_HTML);
m += patchSuren(path.join(K2, 'Übersetzungen', 'Deutsch', 'suren'), K2_HTML);
console.log(`✅  Karim HTML: ${m} Ersetzungen`);

// ── Also patch redesign7.js in both ──────────────────────────────────────
function patchFile(fp, pairs) {
  let src = fs.readFileSync(fp, 'utf8');
  let n = 0;
  for (const [from, to] of pairs) {
    if (src.includes(from)) { src = src.split(from).join(to); n++; }
  }
  fs.writeFileSync(fp, src, 'utf8');
  return n;
}

const k1r7 = path.join(K1, 'redesign7.js');
const k2r7 = path.join(K2, 'redesign7.js');

const k1r7n = patchFile(k1r7, K1_HTML);
console.log(`✅  Meliha redesign7.js: ${k1r7n} Ersetzungen`);

const k2r7n = patchFile(k2r7, K2_HTML);
console.log(`✅  Karim redesign7.js: ${k2r7n} Ersetzungen`);
