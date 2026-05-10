'use strict';

/**
 * prepare-hidden-originals.js
 *
 * Erstellt unsichtbare interne Datensätze (nicht im UI verlinkt):
 * - Quran: offizieller Uthmani-Originaltext + vorhandene Cache-Übersetzungen
 * - Bible: Latein-Basistext + vorhandene Sprachdaten aus CATHOLIC-BIBLE/data/*
 *
 * Ausgabe:
 *   .hidden-data/originals/quran-originals.json
 *   .hidden-data/originals/bible-originals.json
 *
 * Nutzung:
 *   node prepare-hidden-originals.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_DIR = '.hidden-data/originals';

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'KX-Hidden-Originals/1.0',
      },
    }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

function readJsonSafe(fp) {
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (_) {
    return null;
  }
}

async function buildQuranBundle() {
  const uth = await getJson('https://api.quran.com/api/v4/quran/verses/uthmani');
  const verses = uth.verses || [];

  const out = {
    source: 'api.quran.com/api/v4/quran/verses/uthmani',
    generatedAt: new Date().toISOString(),
    verseCount: verses.length,
    verses: {},
    translations: {},
  };

  for (const v of verses) {
    out.verses[v.verse_key] = v.text_uthmani || '';
  }

  const cacheRoot = 'AL-QURAN/cache';
  if (fs.existsSync(cacheRoot)) {
    const langs = fs.readdirSync(cacheRoot, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .filter(n => !n.startsWith('_'));

    for (const lang of langs) {
      const langDir = path.join(cacheRoot, lang);
      const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
      const map = {};
      for (const f of files) {
        const arr = readJsonSafe(path.join(langDir, f));
        if (!Array.isArray(arr)) continue;
        for (const row of arr) {
          const key = row.verse_key;
          const txt = row?.translations?.[0]?.text || '';
          if (key) map[key] = txt;
        }
      }
      out.translations[lang] = map;
    }
  }

  return out;
}

function parseBibleBook(json) {
  if (!json || !json.chapters) return [];
  const rows = [];
  const chapterKeys = Object.keys(json.chapters).sort((a, b) => Number(a) - Number(b));
  for (const ck of chapterKeys) {
    const ch = json.chapters[ck];
    const verseKeys = Object.keys(ch.verses || {}).sort((a, b) => Number(a) - Number(b));
    for (const vk of verseKeys) {
      const v = ch.verses[vk];
      rows.push({
        chapter: Number(ch.chapter),
        verse: Number(v.verse),
        text: String(v.text || ''),
      });
    }
  }
  return rows;
}

function buildBibleBundle() {
  const dataRoot = 'CATHOLIC-BIBLE/data';
  const out = {
    source: 'CATHOLIC-BIBLE/data/*',
    generatedAt: new Date().toISOString(),
    languages: {},
  };

  if (!fs.existsSync(dataRoot)) return out;

  const dirs = fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(n => !n.startsWith('_'));

  for (const lang of dirs) {
    const langDir = path.join(dataRoot, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json')).sort();
    const books = {};

    for (const f of files) {
      const bookId = path.basename(f, '.json');
      const json = readJsonSafe(path.join(langDir, f));
      if (!json) continue;
      books[bookId] = {
        name: json.name || '',
        chapters: parseBibleBook(json),
      };
    }

    out.languages[lang] = books;
  }

  return out;
}

async function main() {
  ensureDir(OUT_DIR);

  const quran = await buildQuranBundle();
  fs.writeFileSync(path.join(OUT_DIR, 'quran-originals.json'), JSON.stringify(quran), 'utf8');

  const bible = buildBibleBundle();
  fs.writeFileSync(path.join(OUT_DIR, 'bible-originals.json'), JSON.stringify(bible), 'utf8');

  console.log('Hidden originals written to ' + OUT_DIR);
  console.log('Quran verses: ' + quran.verseCount);
  console.log('Bible languages: ' + Object.keys(bible.languages).length);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
