'use strict';
/**
 * make-german-dk.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Erstellt die 7 deuterokanonischen Bücher (67–73) für data/german/
 * Sucht automatisch nach einer deutschen Bibelquelle mit DK-Büchern:
 *   1. Scrollmapper GitHub → alle Ger*.json-Dateien checken
 *   2. getbible.net → deutsche Übersetzungen mit Apokryphen testen
 *
 * Ausführung: node make-german-dk.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DATA_DE  = path.join(__dirname, 'data', 'german');
const DATA_KJV = path.join(__dirname, 'data', 'kjv');
const CACHE    = path.join(__dirname, 'data');

const DK = [
  { nr:67, name:'Tobit',       aliases:['tobit','tobias','tob','1.tobias'] },
  { nr:68, name:'Judith',      aliases:['judith','jdt','judit'] },
  { nr:69, name:'1 Maccabees', aliases:['i maccabees','1 maccabees','1maccabees','1makk','i makk','1. makkabäer','i. makkabäer'] },
  { nr:70, name:'2 Maccabees', aliases:['ii maccabees','2 maccabees','2maccabees','2makk','ii makk','2. makkabäer','ii. makkabäer'] },
  { nr:71, name:'Wisdom',      aliases:['wisdom','sapientia','weisheit','weish','weish salomo'] },
  { nr:72, name:'Sirach',      aliases:['sirach','ecclesiasticus','ecclus','sir','ben sira','jesus sirach'] },
  { nr:73, name:'Baruch',      aliases:['baruch','bar'] },
];

const pad3 = n => String(n).padStart(3,'0');

// ── HTTP-Helfer ──────────────────────────────────────────────────────────────
function get(url, raw=false) {
  return new Promise((resolve,reject) => {
    const u = new URL(url);
    const mod = https;
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'BooKX-DK-Fetch/1.0',
        'Accept': 'application/json',
      },
      timeout: 90000,
    };
    const req = mod.get(opts, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return resolve(get(res.headers.location, raw));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (raw) return resolve(buf.toString('utf8'));
        try { resolve(JSON.parse(buf.toString('utf8'))); }
        catch(e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('TIMEOUT: ' + url)); });
  });
}

// ── scrollmapper-Format → build3-kompatibel ──────────────────────────────────
function smToCache(bookObj) {
  const chapters = {};
  for (const ch of (bookObj.chapters || [])) {
    const verses = {};
    for (const v of (ch.verses || [])) {
      verses[v.verse] = { verse: v.verse, text: (v.text || '').trim() };
    }
    chapters[ch.chapter] = { chapter: ch.chapter, name: '', verses };
  }
  return { chapters };
}

// ── getbible.net-Format → build3-kompatibel ──────────────────────────────────
function gbToCache(gbData) {
  const chapters = {};
  for (const [chNum, chObj] of Object.entries(gbData.chapter || {})) {
    const verses = {};
    for (const [vNum, vObj] of Object.entries(chObj)) {
      verses[vNum] = { verse: parseInt(vNum), text: (vObj.verse || '').trim() };
    }
    chapters[chNum] = { chapter: parseInt(chNum), name: '', verses };
  }
  return { chapters };
}

// ── Buch in Scrollmapper-Bibliste finden ─────────────────────────────────────
function findBook(books, dk) {
  for (const b of (books || [])) {
    const n = (b.name || '').toLowerCase().replace(/[äöüß\s\.\-]/g,'').replace(/[^a-z0-9]/g,'');
    const targets = [dk.name, ...dk.aliases].map(a =>
      a.toLowerCase().replace(/[äöüß\s\.\-]/g,'').replace(/[^a-z0-9]/g,'')
    );
    for (const t of targets) {
      if (n === t || n.includes(t) || t.includes(n)) return b;
    }
  }
  return null;
}

// ── Strategie 1: Scrollmapper GitHub-Dateiliste ──────────────────────────────
async function tryScrollmapper() {
  console.log('\n📂 Strategie 1: Scrollmapper GitHub-Liste');
  let files;
  try {
    files = await get('https://api.github.com/repos/scrollmapper/bible_databases/contents/formats/json');
  } catch(e) {
    console.log('   ✗ GitHub API nicht erreichbar:', e.message);
    return null;
  }

  const gerFiles = files.filter(f => f.name.match(/^Ger/i) && f.name.endsWith('.json'));
  console.log(`   Gefunden: ${gerFiles.length} deutsche Dateien:`, gerFiles.map(f=>f.name).join(', '));

  // Bereits geprüfte überspringen
  const known66 = ['_GerBoLut.json','_GerGruenewald.json','_GerTextbibel.json'];

  for (const file of gerFiles) {
    const cacheFile = path.join(CACHE, `_${file.name}`);
    if (known66.includes(`_${file.name}`)) {
      console.log(`   ⊘ ${file.name} (bekannt: nur 66 Bücher)`);
      continue;
    }
    process.stdout.write(`   → prüfe ${file.name} … `);
    let data;
    try {
      if (fs.existsSync(cacheFile)) {
        data = JSON.parse(fs.readFileSync(cacheFile,'utf8'));
      } else {
        data = await get(file.download_url);
        fs.writeFileSync(cacheFile, JSON.stringify(data));
      }
      const count = data.books?.length || 0;
      console.log(`${count} Bücher`);
      if (count > 66) {
        console.log(`   ✓ ${file.name} hat ${count} Bücher!`);
        return data;
      }
    } catch(e) {
      console.log('Fehler:', e.message);
    }
  }
  return null;
}

// ── Strategie 2: getbible.net ─────────────────────────────────────────────────
// Versucht verschiedene deutsche Übersetzungs-Codes mit DK-Büchern
async function tryGetbible() {
  console.log('\n📡 Strategie 2: getbible.net');

  // Codes, die möglicherweise DK-Bücher enthalten
  const candidates = [
    'luther_1912',        // Luther 1912 (manche Versionen mit Apokryphen)
    'german_luther1912',
    'elberfelder_1871',   // Elberfelder Urmutter-Übersetzung
    'schlachter_1951',
    'einheitsuebers',     // Einheitsübersetzung (kathol.)
    'einheits',
    'zurich',
    'zuercher',
    'menge',
  ];

  // DK-Bücher in getbible.net sind in der Regel Bücher 67–73 (falls vorhanden)
  // oder haben eigene Nummerierung; wir prüfen Buch 67
  for (const code of candidates) {
    process.stdout.write(`   → ${code}/67 … `);
    try {
      const url = `https://api.getbible.net/v2/${code}/67.json`;
      const d = await get(url);
      if (d && d.chapter && Object.keys(d.chapter).length > 0) {
        console.log(`✓ hat Buch 67!`);
        return { code, type: 'getbible' };
      } else {
        console.log('leer');
      }
    } catch(e) {
      console.log('nicht gefunden');
    }
  }
  return null;
}

// ── Strategie 3: Vulgate-Mapping (Latein + KJV-Referenz) ─────────────────────
// Nur wenn gar nichts anderes funktioniert: nimmt KJV-Text und markiert ihn
// als "[KJV]" bis eine bessere Quelle verfügbar ist
async function useFallbackKJV() {
  console.log('\n⚠️  Strategie 3: KJV-Referenztext (Notlösung)');
  return { type: 'kjv' };
}

// ── Buch aus scrollmapper extrahieren und speichern ──────────────────────────
async function saveDKFromScrollmapper(smData) {
  let saved = 0;
  for (const dk of DK) {
    const outFile = path.join(DATA_DE, `${pad3(dk.nr)}.json`);
    if (fs.existsSync(outFile)) {
      console.log(`   ⊘ ${pad3(dk.nr)}.json existiert bereits`);
      saved++;
      continue;
    }
    const book = findBook(smData.books, dk);
    if (!book) {
      console.log(`   ✗ ${dk.name} nicht in Quelle gefunden`);
      continue;
    }
    const cache = smToCache(book);
    fs.writeFileSync(outFile, JSON.stringify(cache));
    const chs = Object.keys(cache.chapters).length;
    let vs = 0; Object.values(cache.chapters).forEach(c=>vs+=Object.keys(c.verses).length);
    console.log(`   ✓ ${pad3(dk.nr)}.json  ${dk.name}  ${chs} Kap. ${vs} Verse`);
    saved++;
  }
  return saved;
}

// ── Buch von getbible.net holen und speichern ────────────────────────────────
async function saveDKFromGetbible(code) {
  let saved = 0;
  for (let i = 0; i < DK.length; i++) {
    const dk = DK[i];
    const bookNum = 67 + i;  // 67, 68, ... 73
    const outFile = path.join(DATA_DE, `${pad3(dk.nr)}.json`);
    if (fs.existsSync(outFile)) {
      console.log(`   ⊘ ${pad3(dk.nr)}.json existiert bereits`);
      saved++;
      continue;
    }
    process.stdout.write(`   → ${dk.name} (Buch ${bookNum}) … `);
    try {
      const d = await get(`https://api.getbible.net/v2/${code}/${bookNum}.json`);
      if (!d || !d.chapter || Object.keys(d.chapter).length === 0) {
        console.log('leer');
        continue;
      }
      const cache = gbToCache(d);
      fs.writeFileSync(outFile, JSON.stringify(cache));
      const chs = Object.keys(cache.chapters).length;
      let vs = 0; Object.values(cache.chapters).forEach(c=>vs+=Object.keys(c.verses).length);
      console.log(`✓  ${chs} Kap. ${vs} Verse`);
      saved++;
    } catch(e) {
      console.log('Fehler:', e.message);
    }
  }
  return saved;
}

// ── KJV-Referenz als Notlösung ───────────────────────────────────────────────
function saveDKFromKJV() {
  let saved = 0;
  for (const dk of DK) {
    const outFile = path.join(DATA_DE, `${pad3(dk.nr)}.json`);
    if (fs.existsSync(outFile)) { saved++; continue; }
    const kjvFile = path.join(DATA_KJV, `${pad3(dk.nr)}.json`);
    if (!fs.existsSync(kjvFile)) { console.log(`   ✗ KJV ${pad3(dk.nr)} fehlt`); continue; }
    const d = JSON.parse(fs.readFileSync(kjvFile, 'utf8'));
    fs.writeFileSync(outFile, JSON.stringify(d));
    console.log(`   ⚠ ${pad3(dk.nr)}.json  ${dk.name}  [KJV-Kopie — später ersetzen]`);
    saved++;
  }
  return saved;
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────────
async function main() {
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│  BIBLIA CATHOLICA · Deutsche DK-Bücher (67–73)      │');
  console.log('└─────────────────────────────────────────────────────┘');

  // Sicherstellen, dass data/german/ existiert
  if (!fs.existsSync(DATA_DE)) fs.mkdirSync(DATA_DE, { recursive: true });

  let saved = 0;

  // ── Strategie 1: Scrollmapper
  const smData = await tryScrollmapper();
  if (smData) {
    console.log('\n💾 Speichere aus Scrollmapper …');
    saved = await saveDKFromScrollmapper(smData);
    if (saved === DK.length) {
      console.log(`\n✅ Fertig! ${saved}/7 Bücher in data/german/ gespeichert.`);
      console.log('   → Jetzt: node build3.js');
      return;
    }
  }

  // ── Strategie 2: getbible.net
  const gbResult = await tryGetbible();
  if (gbResult && gbResult.type === 'getbible') {
    console.log(`\n💾 Speichere von getbible.net (${gbResult.code}) …`);
    saved = await saveDKFromGetbible(gbResult.code);
    if (saved === DK.length) {
      console.log(`\n✅ Fertig! ${saved}/7 Bücher in data/german/ gespeichert.`);
      console.log('   → Jetzt: node build3.js');
      return;
    }
  }

  // ── Strategie 3: KJV-Referenz (Notlösung)
  console.log('\n💾 Speichere KJV-Referenztext …');
  saved = saveDKFromKJV();
  if (saved === DK.length) {
    console.log(`\n⚠️  ${saved}/7 Bücher gespeichert (KJV-Englisch).`);
    console.log('   Bitte ersetze den Text später durch eine deutsche Übersetzung.');
    console.log('   → Jetzt: node build3.js');
  } else {
    console.log(`\n❌ Nur ${saved}/7 Bücher gespeichert. Bitte manuell prüfen.`);
  }
}

main().catch(e => { console.error('❌ Unerwarteter Fehler:', e.message); process.exit(1); });
