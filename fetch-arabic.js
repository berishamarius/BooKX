'use strict';
/**
 * fetch-arabic.js
 * ───────────────────────────────────────────────────────────────
 * Holt den arabischen Urtext (Uthmani-Schrift) 1:1 von der
 * offiziellen Quran-API  (api.quran.com/api/v4)
 * und schreibt ihn direkt in alle Koran-Bücher.
 *
 * API-Endpunkt:
 *   GET https://api.quran.com/api/v4/quran/verses/uthmani
 *   → field: text_uthmani  (vollständige Uthmani-Schrift mit allen Diakritika)
 *
 * Was passiert:
 *   1. Alle 6.236 Verse werden von der API geladen
 *   2. Gespeichert in  AL-QURAN/cache/_arabic.json  (Schlüssel "1:1" … "114:6")
 *   3. In alle 3 Bücher injiziert (Vers-Marker ﴿N﴾ bleiben erhalten):
 *        • AL-QURAN/Übersetzungen/Deutsch/suren/
 *        • Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren/
 *        • Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren/
 *
 * Ausführen:
 *   node fetch-arabic.js           ← holt von API + injiziert alles
 *   node fetch-arabic.js --only-cache  ← nur Cache aktualisieren, kein Inject
 *   node fetch-arabic.js --only-inject ← nur Inject aus vorhandenem Cache
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const CACHE_FILE = 'AL-QURAN/cache/_arabic.json';

const BOOKS = [
  { key: 'alquran', dir: 'AL-QURAN/Übersetzungen/Deutsch/suren' },
  { key: 'meliha',  dir: 'Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/suren' },
  { key: 'karim',   dir: 'Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/suren' },
];

const ONLY_CACHE  = process.argv.includes('--only-cache');
const ONLY_INJECT = process.argv.includes('--only-inject');

// ── API-Helfer ────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KX-BooKX-ArabicFetcher/1.0',
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} für ${url}`));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(raw));
        }
        catch (e) { reject(new Error('JSON-Fehler: ' + e.message + '\nURL: ' + url)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout: ' + url)); });
  });
}

async function fetchRetry(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try { return await get(url); }
    catch (e) {
      if (i === tries) throw e;
      process.stdout.write(` [Versuch ${i+1}]`);
      await new Promise(r => setTimeout(r, 2000 * i));
    }
  }
}

// ── Schritt 1: Arabischen Text von API holen ──────────────────────────────────

async function fetchArabic() {
  process.stdout.write('⬇  Lade Uthmani-Text von api.quran.com … ');

  const data = await fetchRetry(
    'https://api.quran.com/api/v4/quran/verses/uthmani'
  );

  const verses = data.verses;
  if (!Array.isArray(verses) || verses.length < 6200) {
    throw new Error(`Zu wenige Verse in API-Antwort: ${verses ? verses.length : 0}`);
  }

  // Validierung: alle Verse müssen arabischen Text haben
  const arabicMap = {};
  let bad = 0;
  for (const v of verses) {
    const key  = v.verse_key;          // "1:1"
    const text = v.text_uthmani || '';
    if (!text.trim()) { bad++; continue; }
    // Prüfen: enthält mindestens ein arabisches Zeichen (U+0600–U+06FF)
    if (!/[\u0600-\u06FF]/.test(text)) { bad++; continue; }
    arabicMap[key] = text;
  }

  if (bad > 0) {
    console.log(`\n⚠  ${bad} Verse ohne gültigen arabischen Text in API-Antwort!`);
  }

  const count = Object.keys(arabicMap).length;
  console.log(`${count} Verse ✓`);
  if (count < 6200) throw new Error(`Zu wenige valide Verse: ${count} (erwartet ≥6200)`);

  // Cache speichern
  fs.writeFileSync(CACHE_FILE, JSON.stringify(arabicMap, null, 0), 'utf8');
  console.log(`💾 Gespeichert → ${CACHE_FILE}`);

  return arabicMap;
}

// ── Schritt 2: In alle HTML-Bücher injizieren ─────────────────────────────────

function injectBook(arabicMap, book) {
  if (!fs.existsSync(book.dir)) {
    console.log(`   ⚠  Verzeichnis nicht gefunden: ${book.dir}`);
    return { fixed: 0, total: 0, errors: 0 };
  }

  const files = fs.readdirSync(book.dir).filter(f => f.endsWith('.html')).sort();
  let fixed = 0, total = 0, errors = 0;

  for (const file of files) {
    const surahNum = parseInt(file.substring(0, 3), 10);
    if (isNaN(surahNum)) continue;

    const fp = path.join(book.dir, file);
    let content = fs.readFileSync(fp, 'utf8');
    let changed = false;

    // Alle <div class="ar">…</div> finden und ersetzen
    const arRe = /<div class="ar">([\s\S]*?)<\/div>/g;
    let verseIdx = 0;
    let newContent = content.replace(arRe, (match, inner) => {
      verseIdx++;
      const key = `${surahNum}:${verseIdx}`;
      const refText = arabicMap[key];
      total++;

      if (!refText) {
        console.log(`      ⚠  Kein API-Text für ${key}`);
        errors++;
        return match; // unverändert lassen
      }

      // Vers-Marker am Ende extrahieren und erhalten: ﴿٣﴾
      const markerMatch = inner.match(/(\s*﴿[\u0660-\u06690-9]+﴾\s*)$/);
      const marker = markerMatch ? markerMatch[0] : '';

      const newInner = refText + marker;

      // Nur ändern wenn tatsächlich anders
      if (inner.trim() === newInner.trim()) return match;

      changed = true;
      return `<div class="ar">${newInner}</div>`;
    });

    if (changed) {
      fs.writeFileSync(fp, newContent, 'utf8');
      fixed++;
    }
  }

  return { fixed, total, errors };
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n┌────────────────────────────────────────────────────────┐');
  console.log('│   KORAN ARABISCHER TEXT — OFFIZIELLER API-IMPORT       │');
  console.log('│   Quelle: api.quran.com/api/v4 (Uthmani-Schrift)       │');
  console.log('└────────────────────────────────────────────────────────┘\n');

  let arabicMap;

  if (ONLY_INJECT) {
    // Nur aus Cache laden
    if (!fs.existsSync(CACHE_FILE)) {
      console.error('❌ Cache-Datei nicht gefunden: ' + CACHE_FILE);
      process.exit(1);
    }
    arabicMap = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    console.log(`📂 Cache geladen: ${Object.keys(arabicMap).length} Verse`);
  } else {
    arabicMap = await fetchArabic();
  }

  if (ONLY_CACHE) {
    console.log('\n✅ Fertig (nur Cache aktualisiert).');
    return;
  }

  // Inject in alle Bücher
  console.log('\n📝 Injiziere in HTML-Dateien …\n');
  let totalFixed = 0, totalVerses = 0;

  for (const book of BOOKS) {
    process.stdout.write(`   📖 ${book.key} … `);
    const r = injectBook(arabicMap, book);
    totalFixed  += r.fixed;
    totalVerses += r.total;
    if (r.fixed === 0) {
      console.log(`bereits korrekt (${r.total} Verse geprüft)`);
    } else {
      console.log(`${r.fixed} Suren aktualisiert (${r.total} Verse gesamt)`);
    }
    if (r.errors > 0) console.log(`      ⚠  ${r.errors} Verse ohne API-Referenz`);
  }

  console.log(`\n✅ Fertig!`);
  console.log(`   ${totalVerses} Verse geprüft | ${totalFixed} Suren aktualisiert`);
  console.log('\n→  Jetzt "node build-surge.js" ausführen um zu deployen!\n');
}

main().catch(e => {
  console.error('\n❌ Fehler:', e.message);
  process.exit(1);
});
