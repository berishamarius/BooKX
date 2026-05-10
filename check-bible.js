/**
 * check-bible.js — Prüft alle Bibel-Bücher auf Fehler
 * Ausführen: node check-bible.js
 * Optional: node check-bible.js micheles | diebibel  (nur ein Buch)
 */

const fs   = require('fs');
const path = require('path');

const BOOKS = [
  { key: 'diebibel', buecherDir: 'CATHOLIC-BIBLE/Übersetzungen/german/bücher' },
  { key: 'micheles', buecherDir: 'Geschenke/Bibel-Deutsch/Übersetzungen/german/bücher' },
];

const filter = (process.argv[2] || '').toLowerCase();
const ACTIVE = filter ? BOOKS.filter(b => b.key === filter) : BOOKS;

// Books that don't exist in the Luther Bible (deuterocanonical / apocrypha)
// → no Luther verse expected for these
const DEUTEROCANON = new Set([
  '017-est', // Greek additions to Esther
  '067-tob', // Tobit
  '068-jdt', // Judith
  '069-1ma', // 1 Maccabees
  '070-2ma', // 2 Maccabees
  '071-wis', // Wisdom of Solomon
  '072-sir', // Sirach / Ecclesiasticus
  '073-bar', // Baruch
  '074-1es', // 1 Esdras (extra apocrypha)
  '075-2es', // 2 Esdras (extra apocrypha)
  '076-prm', // Prayer of Manasseh
  '077-ps2', // Psalm 151
  '078-sus', // Susanna
  '079-bel', // Bel and the Dragon
  '080-aes', // Additions to Esther (Greek)
]);

let totalErrors = 0;

for (const book of ACTIVE) {
  console.log(`\n📖  Prüfe: ${book.key}  (${book.buecherDir})`);
  if (!fs.existsSync(book.buecherDir)) {
    console.log('   ❌ Verzeichnis nicht gefunden!');
    totalErrors++;
    continue;
  }

  const files = fs.readdirSync(book.buecherDir)
    .filter(f => f.endsWith('.html'))
    .sort();

  console.log(`   📚 ${files.length} Bücher gefunden`);
  const errors = [];

  for (const file of files) {
    const fp  = path.join(book.buecherDir, file);
    const content = fs.readFileSync(fp, 'utf8');

    // Extract book title from HTML
    const titleMatch = content.match(/<div class="blatin[^"]*"[^>]*>(.*?)<\/div>/);
    const bookName = titleMatch ? titleMatch[1].trim() : file;

    // Count verse blocks
    const vbCount = [...content.matchAll(/class="vb"/g)].length;

    // Count empty translations (.tra)
    const traMatches = [...content.matchAll(/<p class="tra">([\s\S]*?)<\/p>/g)];
    const emptyTra   = traMatches.filter(m => !m[1].trim()).length;
    const shortTra   = traMatches.filter(m => m[1].trim().length > 0 && m[1].trim().length < 8).length;
    const totalTra   = traMatches.length;

    // Count empty Latin base (.base-c)
    const baseCMatches = [...content.matchAll(/<p class="base base-c">([\s\S]*?)<\/p>/g)];
    const emptyBaseC   = baseCMatches.filter(m => !m[1].trim()).length;
    const totalBaseC   = baseCMatches.length;

    // Count empty Protestant base (.base-p)
    const basePMatches = [...content.matchAll(/<p class="base base-p">([\s\S]*?)<\/p>/g)];
    const emptyBaseP   = basePMatches.filter(m => !m[1].trim()).length;

    const fileErrors = [];
    const bookKey = file.replace('.html', '');
    const isDeuterocanon = DEUTEROCANON.has(bookKey);

    if (vbCount === 0)       fileErrors.push('Keine Verse gefunden!');
    if (emptyTra > 0)        fileErrors.push(`${emptyTra}/${totalTra} leere Übersetzungen (.tra)`);
    if (shortTra > 0)        fileErrors.push(`${shortTra} sehr kurze Übersetzungen (<8 Zeichen)`);
    if (emptyBaseC > 0 && totalBaseC > 0) fileErrors.push(`${emptyBaseC}/${totalBaseC} leere Latein-Verse`);
    // Only flag missing Luther if book exists in Protestant Bible
    if (!isDeuterocanon && emptyBaseP > 0) fileErrors.push(`${emptyBaseP} leere Luther-Verse (Protestant)`);

    if (fileErrors.length) {
      errors.push(`   ❌ ${file} (${bookName}): ${fileErrors.join(' | ')}`);
      totalErrors++;
    }
  }

  if (errors.length === 0) {
    console.log(`   ✓ Alle ${files.length} Bücher korrekt`);
  } else {
    errors.forEach(e => console.log(e));
    console.log(`   → ${errors.length} Bücher mit Fehlern`);
  }
}

console.log(`\n${ totalErrors === 0 ? '✅ Keine Fehler gefunden!' : `❌ ${totalErrors} Fehler gesamt` }`);
