/**
 * fix-backcover-image.js
 * Copy Bibel-Rueckseite-Katholisch.png into each language subfolder
 * and update back-cover.html to use same-folder relative path (no leading slash).
 * Absolute /Bibel-... paths don't work on Vercel per-language deployments.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const BIBLE_DIR = 'dist-diebibel';
const IMAGE_NAME = 'Bibel-Rueckseite-Katholisch.png';
const SRC_IMAGE = path.join(BIBLE_DIR, IMAGE_NAME);

const langs = fs.readdirSync(BIBLE_DIR).filter(x =>
  fs.statSync(path.join(BIBLE_DIR, x)).isDirectory()
);

let copied = 0, updated = 0;

for (const lang of langs) {
  const langDir = path.join(BIBLE_DIR, lang);
  const destImage = path.join(langDir, IMAGE_NAME);
  const bcFile = path.join(langDir, 'back-cover.html');

  // Copy image into language folder
  if (!fs.existsSync(destImage)) {
    fs.copyFileSync(SRC_IMAGE, destImage);
    copied++;
    console.log(`  Copied image -> ${lang}/`);
  }

  // Update back-cover.html: change /Bibel-... or ../Bibel-... to just Bibel-...
  if (fs.existsSync(bcFile)) {
    let html = fs.readFileSync(bcFile, 'utf8');
    const fixed = html
      .replace(`src="/${IMAGE_NAME}"`, `src="${IMAGE_NAME}"`)
      .replace(`src="../${IMAGE_NAME}"`, `src="${IMAGE_NAME}"`);
    if (fixed !== html) {
      fs.writeFileSync(bcFile, fixed, 'utf8');
      updated++;
      console.log(`  Updated src in ${lang}/back-cover.html`);
    }
  }
}

console.log(`\nDone: ${copied} images copied, ${updated} back-cover.html files updated`);
