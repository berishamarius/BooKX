'use strict';
/**
 * inject-sw.js
 * Injects Service Worker registration into index.html and cover.html
 * of both dist-alquran and dist-diebibel.
 * Uses marker <!-- sw-reg --> to prevent double-injection.
 */
const fs   = require('fs');
const path = require('path');

const MARKER = '<!-- sw-reg -->';

const SW_SNIPPET = `${MARKER}
<script>if('serviceWorker'in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}</script>`;

const TARGETS = [
  path.resolve(__dirname, '..', 'dist-alquran',  'index.html'),
  path.resolve(__dirname, '..', 'dist-alquran',  'cover.html'),
  path.resolve(__dirname, '..', 'dist-diebibel', 'index.html'),
  path.resolve(__dirname, '..', 'dist-diebibel', 'cover.html'),
];

let updated = 0;
let skipped = 0;

for (const file of TARGETS) {
  let html = fs.readFileSync(file, 'utf8');

  if (html.includes(MARKER)) {
    console.log(`  ⏭ skipped (already patched): ${path.relative(process.cwd(), file)}`);
    skipped++;
    continue;
  }

  // Inject right before </body>
  if (!html.includes('</body>')) {
    console.warn(`  ⚠ no </body> found in: ${file}`);
    continue;
  }

  html = html.replace('</body>', `${SW_SNIPPET}\n</body>`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`  ✓ patched: ${path.relative(process.cwd(), file)}`);
  updated++;
}

console.log(`\n✅ SW-Inject: ${updated} Dateien aktualisiert, ${skipped} übersprungen.`);
