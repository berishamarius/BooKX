'use strict';

/**
 * ÜBERSETZUNGS-ID FINDER
 * ──────────────────────
 * Zeigt alle verfügbaren Übersetzungen von quran.com API v4
 * und filtert die Sprachen heraus, die für den Builder benötigt werden.
 *
 * Ausführung: node fetch-translations.js
 *
 * Falls eine Sprache im Builder keine Verse zurückgibt:
 *   1. Dieses Script ausführen
 *   2. Die richtige ID für die Sprache suchen
 *   3. In build.js → TRANSLATIONS → id anpassen
 */

const https = require('https');

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'QuranTranslationFinder/1.0' },
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON-Fehler: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

// Ziel-Sprachen (Sprachname wie er in der API auftaucht)
const TARGET_LANGS = [
  'german', 'english', 'turkish', 'indonesian',
  'urdu', 'persian', 'russian', 'bengali', 'hindi', 'hausa',
];

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   QURAN.COM – VERFÜGBARE ÜBERSETZUNGEN  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const data = await apiGet('https://api.quran.com/api/v4/resources/translations?language=de');
  const all  = data.translations || [];

  // Nach Sprache gruppieren
  const byLang = {};
  for (const t of all) {
    const key = (t.language_name || 'unbekannt').toLowerCase();
    if (!byLang[key]) byLang[key] = [];
    byLang[key].push(t);
  }

  console.log('── BENÖTIGTE SPRACHEN ────────────────────────────────\n');
  for (const target of TARGET_LANGS) {
    const key     = Object.keys(byLang).find(k => k.includes(target)) || target;
    const entries = byLang[key] || [];
    console.log(`  ${target.toUpperCase()} (${entries.length} verfügbar):`);
    if (entries.length === 0) {
      console.log('    ⚠  Keine Übersetzung gefunden!');
    } else {
      for (const e of entries) {
        console.log(`    ID: ${String(e.id).padStart(4,' ')}  |  ${e.name}  |  Autor: ${e.author_name || '—'}`);
      }
    }
    console.log();
  }

  console.log('── ALLE VERFÜGBAREN SPRACHEN ──────────────────────────\n');
  const langKeys = Object.keys(byLang).sort();
  for (const k of langKeys) {
    console.log(`  ${k.padEnd(20,' ')} → ${byLang[k].length} Übersetzung(en)`);
  }

  console.log('\n── AKTUELLE IDs IN build.js ───────────────────────────\n');
  const current = [
    { name: 'Deutsch',     id: 27  },
    { name: 'Englisch',    id: 20  },  // Saheeh International
    { name: 'Türkisch',    id: 77  },  // Diyanet
    { name: 'Indonesisch', id: 33  },  // Islamic Affairs Ministry
    { name: 'Urdu',        id: 97  },  // Maududi
    { name: 'Persisch',    id: 135 },  // IslamHouse.com
    { name: 'Russisch',    id: 45  },  // Elmir Kuliev
    { name: 'Bengalisch',  id: 161 },  // Taisirul Quran
    { name: 'Hindi',       id: 122 },  // Maulana Azizul Haque al-Umari
    { name: 'Hausa',       id: 32  },  // Abubakar Mahmoud Gumi
  ];
  for (const c of current) {
    const found = all.find(t => t.id === c.id);
    const status = found ? `✅  "${found.name}" — ${found.author_name || ''}` : '❌  ID nicht gefunden → anpassen!';
    console.log(`  ${c.name.padEnd(14,' ')} ID ${c.id}  →  ${status}`);
  }
  console.log();
}

main().catch(err => {
  console.error('❌  Fehler:', err.message);
  process.exit(1);
});
