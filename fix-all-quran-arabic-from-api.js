'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOTS = [
  'AL-QURAN/Übersetzungen',
  'Geschenke/Koran-Deutsch-1/Übersetzungen',
  'Geschenke/Koran-Deutsch-2/Übersetzungen',
  'dist-alquran/Übersetzungen',
  'dist-meliha/Übersetzungen',
  'dist-karim/Übersetzungen',
];

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'KX-Quran-Uthmani-Fix/1.0',
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => { chunks.push(d); });
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

function getSurenDirs(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const lang of fs.readdirSync(root)) {
    const p = path.join(root, lang, 'suren');
    if (fs.existsSync(p)) out.push(p);
  }
  return out;
}

function surahNumFromFile(file) {
  const m = file.match(/^(\d{3})-/);
  return m ? parseInt(m[1], 10) : NaN;
}

function injectDir(dir, arabicMap) {
  let filesChanged = 0;
  let versesChanged = 0;
  let versesChecked = 0;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
  for (const file of files) {
    const surah = surahNumFromFile(file);
    if (Number.isNaN(surah)) continue;

    const fp = path.join(dir, file);
    const original = fs.readFileSync(fp, 'utf8');
    let i = 0;
    let changedInFile = 0;

    const updated = original.replace(/<div class="ar">([\s\S]*?)<\/div>/g, (full, inner) => {
      i += 1;
      versesChecked += 1;
      const key = `${surah}:${i}`;
      const ref = arabicMap[key];
      if (!ref) return full;

      const markerMatch = inner.match(/(\s*﴿[\u0660-\u06690-9]+﴾\s*)$/);
      const marker = markerMatch ? markerMatch[0] : '';
      const newInner = ref + marker;

      if (inner === newInner) return full;
      changedInFile += 1;
      versesChanged += 1;
      return `<div class="ar">${newInner}</div>`;
    });

    if (changedInFile > 0) {
      fs.writeFileSync(fp, updated, 'utf8');
      filesChanged += 1;
    }
  }

  return { filesChanged, versesChanged, versesChecked };
}

(async function main() {
  console.log('Lade offiziellen Uthmani-Text von api.quran.com ...');
  const data = await get('https://api.quran.com/api/v4/quran/verses/uthmani');
  const map = {};
  for (const v of data.verses || []) {
    map[v.verse_key] = v.text_uthmani || '';
  }

  const keys = Object.keys(map);
  if (keys.length < 6200) {
    throw new Error(`Zu wenige Verse aus API: ${keys.length}`);
  }

  // Cache überschreiben mit frischem API-Original
  fs.writeFileSync('AL-QURAN/cache/_arabic.json', JSON.stringify(map), 'utf8');
  console.log(`Cache aktualisiert: ${keys.length} Verse`);

  let totalDirs = 0;
  let totalFiles = 0;
  let totalVersesChanged = 0;
  let totalVersesChecked = 0;

  for (const root of ROOTS) {
    const dirs = getSurenDirs(root);
    for (const dir of dirs) {
      totalDirs += 1;
      const r = injectDir(dir, map);
      totalFiles += r.filesChanged;
      totalVersesChanged += r.versesChanged;
      totalVersesChecked += r.versesChecked;
      console.log(`${dir} -> Dateien geändert: ${r.filesChanged}, Verse geändert: ${r.versesChanged}`);
    }
  }

  console.log('\nFERTIG');
  console.log(`Suren-Ordner: ${totalDirs}`);
  console.log(`Dateien geändert: ${totalFiles}`);
  console.log(`Verse geprüft: ${totalVersesChecked}`);
  console.log(`Verse aktualisiert: ${totalVersesChanged}`);
})();
