'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function copyFile(src, dst) {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
  return true;
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return false;
  ensureDir(dst);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      ensureDir(path.dirname(d));
      fs.copyFileSync(s, d);
    }
  }
  return true;
}

function syncSet(label, ops) {
  console.log(`\n=== ${label} ===`);
  let changed = 0;
  for (const op of ops) {
    const src = path.join(ROOT, op.src);
    const dst = path.join(ROOT, op.dst);

    if (op.type === 'dir') {
      rmIfExists(dst);
      const ok = copyDir(src, dst);
      console.log(`${ok ? 'OK ' : 'SKIP'} dir  ${op.src} -> ${op.dst}`);
      if (ok) changed++;
    }

    if (op.type === 'file') {
      const ok = copyFile(src, dst);
      console.log(`${ok ? 'OK ' : 'SKIP'} file ${op.src} -> ${op.dst}`);
      if (ok) changed++;
    }
  }
  console.log(`changed=${changed}`);
}

// build3 -> Geschenke/Bibel-Deutsch
syncSet('build3 (Geschenke/Bibel-Deutsch) <= dist-micheles', [
  { type: 'file', src: 'dist-micheles/index.html',      dst: 'Geschenke/Bibel-Deutsch/Übersetzungen/index.html' },
  { type: 'file', src: 'dist-micheles/cover.html',      dst: 'Geschenke/Bibel-Deutsch/Übersetzungen/cover.html' },
  { type: 'file', src: 'dist-micheles/back-cover.html', dst: 'Geschenke/Bibel-Deutsch/Übersetzungen/back-cover.html' },
  { type: 'dir',  src: 'dist-micheles/german',          dst: 'Geschenke/Bibel-Deutsch/Übersetzungen/german' },
]);

// build4 -> CATHOLIC-BIBLE
syncSet('build4 (CATHOLIC-BIBLE) <= dist-diebibel', [
  { type: 'file', src: 'dist-diebibel/index.html',      dst: 'CATHOLIC-BIBLE/Übersetzungen/index.html' },
  { type: 'file', src: 'dist-diebibel/cover.html',      dst: 'CATHOLIC-BIBLE/Übersetzungen/cover.html' },
  { type: 'file', src: 'dist-diebibel/back-cover.html', dst: 'CATHOLIC-BIBLE/Übersetzungen/back-cover.html' },
  { type: 'dir',  src: 'dist-diebibel/german',          dst: 'CATHOLIC-BIBLE/Übersetzungen/german' },
]);

// version7 -> Geschenke Koran 1 + 2
syncSet('version7 (Koran-Geschenke) <= dist-meliha/dist-karim', [
  { type: 'file', src: 'dist-meliha/index.html',               dst: 'Geschenke/Koran-Deutsch-1/Übersetzungen/index.html' },
  { type: 'dir',  src: 'dist-meliha/Übersetzungen/Deutsch',    dst: 'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch' },
  { type: 'file', src: 'dist-karim/index.html',                dst: 'Geschenke/Koran-Deutsch-2/Übersetzungen/index.html' },
  { type: 'dir',  src: 'dist-karim/Übersetzungen/Deutsch',     dst: 'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch' },
]);

// version8 -> AL-QURAN
syncSet('version8 (AL-QURAN) <= dist-alquran', [
  { type: 'file', src: 'dist-alquran/index.html',              dst: 'AL-QURAN/Übersetzungen/index.html' },
  { type: 'dir',  src: 'dist-alquran/Übersetzungen/Deutsch',   dst: 'AL-QURAN/Übersetzungen/Deutsch' },
]);

console.log('\nDONE: Dist -> Build-Quellen synchronisiert.');
