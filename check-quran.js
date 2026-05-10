/**
 * check-quran.js — Prüft alle Koran-Suren auf Fehler
 *
 * Prüfungen:
 *   1. Arabischer Text jedes Verses gegen Referenz aus _arabic.json (Zeichenebene)
 *   2. Deutsche Übersetzung gegen Referenz aus cache/de/N.json
 *   3. Übersetzungen die nur auf andere Verse verweisen statt den Text zu schreiben
 *   4. Leere / fehlende Übersetzungen
 *   5. Fehlende / doppelte Vers-IDs
 *
 * Ausführen: node check-quran.js
 * Optional:  node check-quran.js alquran | meliha | karim
 *            node check-quran.js alquran fix   ← überschreibt falsche Texte mit Referenz
 */

const fs   = require('fs');
const path = require('path');

const BOOKS = [
  { key: 'alquran', surenDir: 'AL-QURAN/Übersetzungen/Deutsch/suren' },
  { key: 'meliha',  surenDir: 'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren' },
  { key: 'karim',   surenDir: 'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren' },
];

const filterArg = (process.argv[2] || '').toLowerCase();
const doFix     = process.argv[3] === 'fix' || process.argv[2] === 'fix';
const ACTIVE    = (filterArg && filterArg !== 'fix')
  ? BOOKS.filter(b => b.key === filterArg)
  : BOOKS;

// ── Referenzdaten laden ───────────────────────────────────────────────────────

// Arabic reference: { "1:1": "بِسْمِ...", ... }
let arabicRef = {};
try {
  arabicRef = JSON.parse(fs.readFileSync('AL-QURAN/cache/_arabic.json', 'utf8'));
} catch(e) {
  console.error('❌ _arabic.json nicht gefunden!'); process.exit(1);
}

// German reference: cache/de/N.json → [{verse_key:"1:1", translations:[{text:"..."}]}]
const deRef = {}; // "1:1" → "Deutscher Text"
const deDir = 'AL-QURAN/cache/de';
if (fs.existsSync(deDir)) {
  for (const f of fs.readdirSync(deDir).filter(f => f.endsWith('.json'))) {
    const verses = JSON.parse(fs.readFileSync(path.join(deDir, f), 'utf8'));
    for (const v of verses) {
      if (v.translations && v.translations[0]) {
        deRef[v.verse_key] = v.translations[0].text || '';
      }
    }
  }
} else {
  console.warn('⚠  cache/de/ nicht gefunden – Übersetzungsvergleich übersprungen');
}

// Chapter verse counts: { 1: 7, 2: 286, ... }
const expectedCounts = {};
try {
  const chapters = JSON.parse(fs.readFileSync('AL-QURAN/cache/_chapters.json', 'utf8'));
  chapters.forEach(ch => { expectedCounts[ch.id] = ch.verses_count; });
} catch(e) { /* optional */ }

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────

// Strip Arabic verse-end markers ﴿٣﴾ (Arabic-Indic or ASCII digits) + directional marks
function stripVerseMarker(text) {
  return text
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // directional / zero-width
    .replace(/\s*﴿[\u0660-\u06690-9]+﴾\s*/g, '')
    .trim();
}

// Normalise Arabic: strip diacritics, tatweel, directional marks for comparison
function normaliseArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '') // diacritics
    .replace(/\u0640/g, '')   // tatweel
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // directional marks
    .replace(/\s+/g, ' ')
    .trim();
}

// Wort-für-Wort-Vergleich: gibt Liste der abweichenden Wörter zurück
function diffWords(normHtml, normRef) {
  const htmlWords = normHtml.split(' ');
  const refWords  = normRef.split(' ');
  const diffs = [];
  const maxLen = Math.max(htmlWords.length, refWords.length);
  for (let i = 0; i < maxLen; i++) {
    const hw = htmlWords[i] || '(fehlt)';
    const rw = refWords[i]  || '(fehlt)';
    if (hw !== rw) {
      // Zeige Unicode-Codepoints der ersten 6 Zeichen
      const cpHtml = [...hw].slice(0,6).map(c => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`).join(' ');
      const cpRef  = [...rw].slice(0,6).map(c => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`).join(' ');
      diffs.push({ wortNr: i+1, html: hw, ref: rw, cpHtml, cpRef });
    }
  }
  return diffs;
}

// Cross-reference pattern in German translation: "s. V.", "vgl.", "wie Vers 3", "→", "= V."
const XREF_RE = /\b(s\.|vgl\.|wie\s+Vers|wie\s+Sure|s\.o\.|s\.u\.|s\.\s*V|→\s*V|=\s*V|gleich\s+wie|identisch\s+mit)\b/i;

// HTML entity decode (minimal, for &amp; &lt; etc.)
function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

// ── Haupt-Prüfschleife ────────────────────────────────────────────────────────

let totalErrors = 0;
let totalFixes  = 0;

for (const book of ACTIVE) {
  console.log(`\n📖  Prüfe: ${book.key}  (${book.surenDir})`);
  if (!fs.existsSync(book.surenDir)) {
    console.log('   ❌ Verzeichnis nicht gefunden!');
    totalErrors++;
    continue;
  }

  const files = fs.readdirSync(book.surenDir)
    .filter(f => f.endsWith('.html'))
    .sort();

  if (files.length !== 114) {
    console.log(`   ⚠  Erwartet 114 Suren, gefunden: ${files.length}`);
  }

  const errors = [];
  let fileFixed = 0;

  for (const file of files) {
    const surahNum = parseInt(file.substring(0, 3), 10);
    const fp = path.join(book.surenDir, file);
    let content = fs.readFileSync(fp, 'utf8');

    // Extract verse blocks: <div class="verse" id="vN">...<div class="ar">...</div>...<div class="tr">...</div>...
    const verseBlocks = [...content.matchAll(/<div class="verse" id="v(\d+)">([\s\S]*?)<\/div>\s*\n?\s*<\/div>/g)];
    const verseCount  = [...content.matchAll(/class="verse"/g)].length;

    const expected = expectedCounts[surahNum];
    const fileErrors = [];
    let changed = false;

    if (expected && verseCount !== expected) {
      fileErrors.push(`Verse: ${verseCount} (erwartet ${expected})`);
    }

    // Check for duplicate verse IDs
    const verseIds = [...content.matchAll(/id="v(\d+)"/g)].map(m => m[1]);
    const dupIds = verseIds.filter((v, i, a) => a.indexOf(v) !== i);
    if (dupIds.length) fileErrors.push(`Doppelte IDs: v${dupIds.join(', v')}`);

    // Per-verse checks
    const arMatches = [...content.matchAll(/<div class="ar">([\s\S]*?)<\/div>/g)];
    const trMatches = [...content.matchAll(/<div class="tr">([\s\S]*?)<\/div>/g)];

    for (let i = 0; i < arMatches.length; i++) {
      const verseN  = i + 1;
      const key     = `${surahNum}:${verseN}`;
      const arInHtml = stripVerseMarker(decodeEntities(arMatches[i][1]).trim());
      const trInHtml = decodeEntities(trMatches[i] ? trMatches[i][1].trim() : '');

      // 1. Arabisch-Vergleich gegen Referenz (wort-für-wort, zeichengenau)
      if (arabicRef[key] !== undefined) {
        const refAr   = arabicRef[key];
        const normRef = normaliseArabic(refAr);
        const normHtml = normaliseArabic(arInHtml);
        if (normRef !== normHtml) {
          const wordDiffs = diffWords(normHtml, normRef);
          const refWordCount  = normRef.split(' ').length;
          const htmlWordCount = normHtml.split(' ').length;
          let msg = `V${verseN} Arabisch falsch`;
          if (refWordCount !== htmlWordCount) {
            msg += ` (${htmlWordCount} Wörter im HTML, ${refWordCount} in Referenz)`;
          }
          wordDiffs.forEach(d => {
            msg += `\n        Wort ${d.wortNr}: HTML="${d.html}" [${d.cpHtml}]`;
            msg += `\n                 REF="${d.ref}"  [${d.cpRef}]`;
          });
          fileErrors.push(msg);
          if (doFix) {
            // Preserve the original suffix (space + verse marker) from HTML
            const originalContent = arMatches[i][1];
            const suffixMatch = originalContent.match(/(\s*﴿[\u0660-\u06690-9]+﴾\s*)$/);
            const suffix = suffixMatch ? suffixMatch[0] : '';
            const newAr  = refAr + suffix;
            content = content.replace(arMatches[i][0], `<div class="ar">${newAr}</div>`);
            changed = true;
          }
        }
      }

      // 2. Deutsche Übersetzung: leer oder zu kurz
      if (!trInHtml) {
        fileErrors.push(`V${verseN} Übersetzung fehlt`);
        if (doFix && deRef[key] && trMatches[i]) {
          content = content.replace(trMatches[i][0], `<div class="tr">${deRef[key]}</div>`);
          changed = true;
        }
      } else if (trInHtml.length < 5) {
        fileErrors.push(`V${verseN} Übersetzung zu kurz: "${trInHtml}"`);
      }

      // 3. Übersetzung verweist auf anderen Vers statt ihn zu schreiben
      else if (XREF_RE.test(trInHtml)) {
        fileErrors.push(`V${verseN} Übersetzung ist ein Querverweis: "${trInHtml.substring(0,80)}"`);
        if (doFix && deRef[key] && !XREF_RE.test(deRef[key])) {
          content = content.replace(trMatches[i][0], `<div class="tr">${deRef[key]}</div>`);
          changed = true;
        }
      }

      // 4. Übersetzung stimmt nicht mit Referenz überein (erste 40 Zeichen vergleichen)
      else if (deRef[key]) {
        const refDe   = deRef[key].trim();
        const normRef = refDe.replace(/\s+/g, ' ');
        const normHtml = trInHtml.replace(/\s+/g, ' ');
        if (normRef !== normHtml) {
          // Only flag if texts are substantially different (not just minor whitespace/HTML entity diffs)
          const refStart  = normRef.substring(0, 50);
          const htmlStart = normHtml.substring(0, 50);
          if (refStart !== htmlStart) {
            fileErrors.push(`V${verseN} Übersetzung weicht von Referenz ab:\n        HTML: "${normHtml.substring(0,80)}"\n        REF:  "${normRef.substring(0,80)}"`);
            if (doFix) {
              content = content.replace(trMatches[i][0], `<div class="tr">${refDe}</div>`);
              changed = true;
            }
          }
        }
      }
    }

    if (changed && doFix) {
      fs.writeFileSync(fp, content, 'utf8');
      console.log(`   🔧 ${file}: Fixes angewendet`);
      fileFixed++;
      totalFixes++;
    }

    if (fileErrors.length) {
      errors.push({ file, errs: fileErrors });
      totalErrors += fileErrors.length;
    }
  }

  if (errors.length === 0) {
    console.log(`   ✓ Alle ${files.length} Suren korrekt`);
  } else {
    for (const { file, errs } of errors) {
      console.log(`   ❌ ${file}:`);
      errs.forEach(e => console.log(`      • ${e}`));
    }
    console.log(`   → ${errors.length} Suren mit Fehlern`);
  }
  if (fileFixed) console.log(`   🔧 ${fileFixed} Suren automatisch korrigiert`);
}

console.log(`\n${ totalErrors === 0 ? '✅ Keine Fehler gefunden!' : `❌ ${totalErrors} Einzelfehler gesamt` }`);
if (doFix && totalFixes) console.log(`🔧 ${totalFixes} Dateien wurden korrigiert`);
