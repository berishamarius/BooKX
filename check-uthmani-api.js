'use strict';

/**
 * check-uthmani-api.js
 *
 * Vergleicht den arabischen Text in den HTML-Suren strikt 1:1
 * mit dem offiziellen Uthmani-Text von api.quran.com.
 *
 * Nutzung:
 *   node check-uthmani-api.js
 *   node check-uthmani-api.js --include-dist
 *   node check-uthmani-api.js --book alquran|meliha|karim
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const argBook = (() => {
  const idx = process.argv.indexOf('--book');
  if (idx >= 0 && process.argv[idx + 1]) return String(process.argv[idx + 1]).toLowerCase();
  return '';
})();
const includeDist = process.argv.includes('--include-dist');

const TARGETS = [
  { key: 'alquran', type: 'multi-lang', root: 'AL-QURAN/Übersetzungen' },
  { key: 'meliha',  type: 'single', dir: 'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren' },
  { key: 'karim',   type: 'single', dir: 'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren' },
];

if (includeDist) {
  TARGETS.push(
    { key: 'dist-alquran', type: 'single', dir: 'dist-alquran/Übersetzungen/Deutsch/suren' },
    { key: 'dist-meliha',  type: 'single', dir: 'dist-meliha/Übersetzungen/Deutsch/suren' },
    { key: 'dist-karim',   type: 'single', dir: 'dist-karim/Übersetzungen/Deutsch/suren' },
  );
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'KX-Uthmani-Strict-Checker/1.0',
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`JSON parse failed: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('request timeout')));
  });
}

function stripVerseMarker(s) {
  return s
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '')
    .replace(/\s*﴿[\u0660-\u06690-9]+﴾\s*$/u, '')
    .trim();
}

function cp(ch) {
  return `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
}

function firstDiffDetail(a, b) {
  const aa = [...a];
  const bb = [...b];
  let i = 0;
  while (i < aa.length && i < bb.length && aa[i] === bb[i]) i++;
  const ach = aa[i] || '(EOF)';
  const bch = bb[i] || '(EOF)';
  return {
    pos: i + 1,
    htmlCh: ach,
    refCh: bch,
    htmlCp: ach === '(EOF)' ? '-' : cp(ach),
    refCp: bch === '(EOF)' ? '-' : cp(bch),
  };
}

function getSurenDirs(target) {
  if (target.type === 'single') {
    return fs.existsSync(target.dir) ? [target.dir] : [];
  }
  const out = [];
  if (!fs.existsSync(target.root)) return out;
  for (const lang of fs.readdirSync(target.root)) {
    const dir = path.join(target.root, lang, 'suren');
    if (fs.existsSync(dir)) out.push({ lang, dir });
  }
  return out;
}

function checkDir(label, dir, refMap) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
  let mismatches = 0;
  let qmarks = 0;
  let repChars = 0;
  const examples = [];

  for (const file of files) {
    const m = file.match(/^(\d{3})-/);
    if (!m) continue;
    const surah = parseInt(m[1], 10);
    const fp = path.join(dir, file);
    const html = fs.readFileSync(fp, 'utf8');

    const arBlocks = [...html.matchAll(/<div class="ar">([\s\S]*?)<\/div>/g)];
    for (let i = 0; i < arBlocks.length; i++) {
      const verse = i + 1;
      const key = `${surah}:${verse}`;
      const refRaw = refMap[key];
      const currentRaw = arBlocks[i][1];
      const current = stripVerseMarker(currentRaw);
      const ref = typeof refRaw === 'string' ? refRaw.trim() : '';

      for (const ch of currentRaw) {
        if (ch === '?') qmarks++;
        if (ch === '�') repChars++;
      }

      if (!refRaw) continue;
      if (current !== ref) {
        mismatches++;
        if (examples.length < 12) {
          const d = firstDiffDetail(current, ref);
          examples.push(
            `${file} V${verse}: Pos ${d.pos} HTML='${d.htmlCh}'(${d.htmlCp}) REF='${d.refCh}'(${d.refCp})`
          );
        }
      }
    }
  }

  console.log(`\n[${label}]`);
  console.log(`  Mismatches: ${mismatches}`);
  console.log(`  '?' chars : ${qmarks}`);
  console.log(`  '�' chars : ${repChars}`);
  if (examples.length) {
    console.log('  Beispiele:');
    examples.forEach(e => console.log('   - ' + e));
  }

  return { mismatches, qmarks, repChars };
}

async function main() {
  console.log('Lade offiziellen Uthmani-Text von api.quran.com ...');
  const data = await getJson('https://api.quran.com/api/v4/quran/verses/uthmani');
  const verses = data.verses || [];
  if (!Array.isArray(verses) || verses.length < 6200) {
    throw new Error(`Unerwartete API-Antwort, Verse: ${verses.length}`);
  }

  const refMap = {};
  for (const v of verses) {
    refMap[v.verse_key] = v.text_uthmani || '';
  }
  console.log(`Referenz geladen: ${Object.keys(refMap).length} Verse`);

  let totalMismatch = 0;
  let totalQ = 0;
  let totalRep = 0;

  const active = argBook ? TARGETS.filter(t => t.key === argBook) : TARGETS;
  if (argBook && active.length === 0) {
    throw new Error(`Unbekannter --book Wert: ${argBook}`);
  }

  for (const t of active) {
    if (t.type === 'single') {
      if (!fs.existsSync(t.dir)) {
        console.log(`\n[${t.key}] SKIP: ${t.dir} nicht gefunden`);
        continue;
      }
      const r = checkDir(t.key, t.dir, refMap);
      totalMismatch += r.mismatches;
      totalQ += r.qmarks;
      totalRep += r.repChars;
      continue;
    }

    const dirs = getSurenDirs(t);
    if (!dirs.length) {
      console.log(`\n[${t.key}] SKIP: keine Suren-Verzeichnisse gefunden`);
      continue;
    }

    for (const entry of dirs) {
      const label = `${t.key}/${entry.lang}`;
      const r = checkDir(label, entry.dir, refMap);
      totalMismatch += r.mismatches;
      totalQ += r.qmarks;
      totalRep += r.repChars;
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Mismatches gesamt: ${totalMismatch}`);
  console.log(`'?' gesamt       : ${totalQ}`);
  console.log(`'�' gesamt       : ${totalRep}`);

  if (totalMismatch === 0 && totalQ === 0 && totalRep === 0) {
    console.log('OK: Alles 1:1 Uthmani korrekt.');
    process.exit(0);
  }

  console.log('FEHLER: Unterschiede zum offiziellen Uthmani-Text gefunden.');
  process.exit(2);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
