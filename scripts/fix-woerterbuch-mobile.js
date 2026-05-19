'use strict';
/**
 * fix-woerterbuch-mobile.js
 * Injects responsive mobile CSS into all woerterbuch.html files.
 * Fixes:
 *  - 180px side stripes crushing content on narrow screens
 *  - 70px horizontal padding in .sh-in
 *  - Navigation overflow on small phones
 */
const fs   = require('fs');
const path = require('path');

const QURAN_OVER = path.resolve(__dirname, '..', 'dist-alquran', 'Übersetzungen');

const MOBILE_CSS = `
@media(max-width:540px){
  html,body{background:#0f2f1a !important;}
  .sh-in{padding:14px 16px 12px !important;}
  .sh-title-ar{font-size:1.7rem !important;}
  .sh-subtitle{letter-spacing:.12em !important;}
  .main{padding:14px 8px 76px !important;}
  .search-wrap{padding:8px 10px !important;}
  .cat-head{flex-wrap:wrap;gap:6px;padding:22px 0 8px !important;}
  .cat-ar{font-size:1.2rem !important;}
  .entry{padding:10px 8px !important;}
  .word-ar{font-size:1.45rem !important;}
  .entry-tr{font-size:.85rem !important;}
  .bot-nav{gap:6px;padding:8px 10px;flex-wrap:wrap;}
  .bn{padding:6px 12px;font-size:.82rem;}
}
@media(max-width:380px){
  .sh-in{padding:10px 12px 10px !important;}
  .sh-title-ar{font-size:1.45rem !important;}
  .sh-native{font-size:.8rem !important;}
  .word-ar{font-size:1.3rem !important;}
  .bn{padding:5px 10px;font-size:.78rem;}
}`;

const MARKER = '/* wbm-mobile-fix */';

let fixed = 0;
let skipped = 0;

const langDirs = fs.readdirSync(QURAN_OVER).filter(d =>
  fs.statSync(path.join(QURAN_OVER, d)).isDirectory()
);

for (const langDir of langDirs) {
  const file = path.join(QURAN_OVER, langDir, 'woerterbuch.html');
  if (!fs.existsSync(file)) { skipped++; continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) { console.log(`  – ${langDir}: already patched`); skipped++; continue; }

  // Inject before closing </style>
  const inject = `${MARKER}${MOBILE_CSS}\n</style>`;
  const patched = html.replace('</style>', inject);

  if (patched === html) { console.warn(`  ⚠ ${langDir}: no </style> found`); skipped++; continue; }

  fs.writeFileSync(file, patched, 'utf8');
  console.log(`  ✓ ${langDir}/woerterbuch.html — mobile CSS injected`);
  fixed++;
}

console.log(`\n✅ Mobile CSS: ${fixed} fixed, ${skipped} skipped.\n`);
