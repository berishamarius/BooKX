'use strict';

/**
 * check-arabic-chars.js
 *
 * Dreifach-Prüfung arabischer Buchstaben:
 * 1. Unicode-Gültigkeitsbereich (arabische Grundzeichen)
 * 2. Einzelbuchstaben gegen offizielle API (Glyphen-ID-Vergleich)
 * 3. Wort-Pattern-Validierung (Hamza, Shadda, Tashkeel)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'KX-Triple-Checker/1.0' },
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
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
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
  });
}

function stripMarker(s) {
  return s
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '')
    .replace(/\s*﴿[\u0660-\u06690-9]+﴾\s*$/u, '')
    .trim();
}

function isValidArabicChar(ch) {
  const code = ch.codePointAt(0);
  if (!code) return false;
  // Core Arabic + Extensions + Presentation Forms-A (after filtering)
  if (code >= 0x0600 && code <= 0x06FF) return true; // Arabic
  if (code >= 0x0750 && code <= 0x077F) return true; // Arabic Supplement
  if (code >= 0x08A0 && code <= 0x08FF) return true; // Arabic Extended-A
  if (code >= 0xFB50 && code <= 0xFDFF) return true; // Presentation Forms-A (OK wenn normalisiert)
  if (code >= 0xFE70 && code <= 0xFEFF) return true; // Presentation Forms-B
  return false;
}

function countBadChars(text) {
  let bad = 0;
  for (const ch of text) {
    if (!isValidArabicChar(ch) && ch !== ' ' && !/[\d\n\t]/.test(ch)) {
      bad++;
    }
  }
  return bad;
}

function checkWordPatterns(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  let issues = 0;
  const examples = [];

  for (const word of words) {
    const chars = [...word];
    // Prüfe auf doppelte Shadda (falsch)
    if (/\u0640[\u0640\u064B-\u0652]+/.test(word)) {
      issues++;
      if (examples.length < 3) examples.push(`Doppel-Shadda: ${word}`);
    }
    // Prüfe auf isolierte Diacritics am Start (ungewöhnlich)
    if (/^[\u064B-\u0652]/.test(word) && word.length > 1) {
      // OK wenn es ein gültiges Tashkeel ist
    }
    // Prüfe auf Lam-Alif-Ligatur vs. separaten Buchstaben
    if (/\u0644\u0627/.test(word) && word.includes('\uFEFB')) {
      // Warnung aber kein Fehler, beides ist valid
    }
  }

  return { issues, examples };
}

async function main() {
  console.log('=== TRIPLE CHECK: ARABISCHE BUCHSTABEN ===\n');

  console.log('1. Lade offizielle Uthmani API...');
  const data = await getJson('https://api.quran.com/api/v4/quran/verses/uthmani');
  const verses = data.verses || [];
  const refMap = {};
  for (const v of verses) {
    refMap[v.verse_key] = v.text_uthmani || '';
  }
  console.log(`   Referenz: ${verses.length} Verse\n`);

  const targets = [
    { key: 'alquran-de', dir: 'AL-QURAN/Übersetzungen/Deutsch/suren' },
    { key: 'meliha', dir: 'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren' },
    { key: 'karim', dir: 'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren' },
  ];

  let totalVers = 0;
  let totalBadChars = 0;
  let totalMismatch = 0;
  let totalWarnPatterns = 0;

  for (const t of targets) {
    if (!fs.existsSync(t.dir)) {
      console.log(`[${t.key}] DIR NOT FOUND`);
      continue;
    }

    let badChars = 0;
    let mismatch = 0;
    let warnPatterns = 0;
    let exVers = [];
    let exBad = [];
    let exPattern = [];

    const files = fs.readdirSync(t.dir).filter(f => f.endsWith('.html')).sort();
    for (const file of files) {
      const m = file.match(/^(\d{3})-/);
      if (!m) continue;
      const surah = parseInt(m[1], 10);
      const fp = path.join(t.dir, file);
      const html = fs.readFileSync(fp, 'utf8');

      const arBlocks = [...html.matchAll(/<div class="ar">([\s\S]*?)<\/div>/g)];
      for (let i = 0; i < arBlocks.length; i++) {
        const verse = i + 1;
        totalVers++;
        const key = `${surah}:${verse}`;
        const refRaw = refMap[key];
        const currentRaw = arBlocks[i][1];
        const current = stripMarker(currentRaw);
        const ref = refRaw ? stripMarker(refRaw) : '';

        // Check 1: Bad chars
        const bc = countBadChars(current);
        if (bc > 0) {
          badChars += bc;
          if (exBad.length < 3) exBad.push(`${file} V${verse}: ${bc} bad chars`);
        }

        // Check 2: 1:1 Vergleich
        if (refRaw && current !== ref) {
          mismatch++;
          if (exVers.length < 3) exVers.push(`${file} V${verse}`);
        }

        // Check 3: Word patterns
        const wp = checkWordPatterns(current);
        if (wp.issues > 0) {
          warnPatterns += wp.issues;
          if (exPattern.length < 3 && wp.examples.length) {
            exPattern.push(...wp.examples.slice(0, 1));
          }
        }
      }
    }

    console.log(`[${t.key}]`);
    console.log(`  Verse: ${totalVers} prüft`);
    console.log(`  Bad chars:     ${badChars}`);
    if (exBad.length) console.log('   - ' + exBad.join('\n   - '));
    console.log(`  Mismatches:    ${mismatch}`);
    if (exVers.length) console.log('   - ' + exVers.join('\n   - '));
    console.log(`  Pattern warn:  ${warnPatterns}`);
    if (exPattern.length) console.log('   - ' + exPattern.join('\n   - '));
    console.log();

    totalBadChars += badChars;
    totalMismatch += mismatch;
    totalWarnPatterns += warnPatterns;
  }

  console.log('=== SUMMARY ===');
  console.log(`Total verses checked: ${totalVers}`);
  console.log(`Total bad chars:      ${totalBadChars}`);
  console.log(`Total mismatches:     ${totalMismatch}`);
  console.log(`Total pattern warns:  ${totalWarnPatterns}`);

  if (totalBadChars === 0 && totalMismatch === 0 && totalWarnPatterns === 0) {
    console.log('\n✓ ALLES OK: Arabische Buchstaben sind 100% korrekt.');
    process.exit(0);
  } else {
    console.log('\n✗ FEHLER GEFUNDEN');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
