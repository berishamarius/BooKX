'use strict';

/**
 * AL-QURAN BOOK BUILDER
 * ─────────────────────
 * Lädt alle Verse vom quran.com API v4 und generiert ein
 * vollständiges HTML-Buch mit arabischem Text (oben, gold)
 * und den jeweiligen Übersetzungen (unten).
 *
 * Ausführung:  node build.js
 * oder:        run.bat  (Windows)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ════════════════════════════════════════════════════════════
//  KONFIGURATION
// ════════════════════════════════════════════════════════════

const BASE_DIR  = __dirname;
const OUT_DIR   = path.join(BASE_DIR, 'Übersetzungen');
const DELAY_MS  = 350;  // Pause zwischen API-Calls (rate-limit-freundlich)
const RETRY_MAX = 3;

/**
 * Übersetzungs-IDs von quran.com API v4.
 * Zum Prüfen / Anpassen: node fetch-translations.js
 *
 * Länder nach muslimischer Bevölkerungsgröße (Pew Research / Wikipedia):
 *   Indonesien ~250 Mio · Pakistan ~233 Mio · Indien ~200 Mio
 *   Bangladesch ~151 Mio · Nigeria ~96 Mio · Ägypten ~87 Mio (Arabisch)
 *   Iran ~86 Mio · Türkei ~80 Mio · + Russland · England
 */
const TRANSLATIONS = [
  { name: 'Deutsch',     id: 27,  lang: 'de', dir: 'ltr', flag: '🇩🇪', country: 'Deutschland' },
  { name: 'Englisch',    id: 20,  lang: 'en', dir: 'ltr', flag: '🇬🇧', country: 'England'      },  // Saheeh International
  { name: 'Türkisch',    id: 77,  lang: 'tr', dir: 'ltr', flag: '🇹🇷', country: 'Türkei'       },  // Diyanet
  { name: 'Indonesisch', id: 33,  lang: 'id', dir: 'ltr', flag: '🇮🇩', country: 'Indonesien'   },  // Islamic Affairs Ministry
  { name: 'Urdu',        id: 97,  lang: 'ur', dir: 'rtl', flag: '🇵🇰', country: 'Pakistan'     },  // Maududi
  { name: 'Persisch',    id: 135, lang: 'fa', dir: 'rtl', flag: '🇮🇷', country: 'Iran'         },  // IslamHouse.com
  { name: 'Russisch',    id: 45,  lang: 'ru', dir: 'ltr', flag: '🇷🇺', country: 'Russland'     },  // Elmir Kuliev
  { name: 'Bengalisch',  id: 161, lang: 'bn', dir: 'ltr', flag: '🇧🇩', country: 'Bangladesch'  },  // Taisirul Quran
  { name: 'Hindi',       id: 122, lang: 'hi', dir: 'ltr', flag: '🇮🇳', country: 'Indien'       },  // Maulana Azizul Haque al-Umari
  { name: 'Hausa',       id: 32,  lang: 'ha', dir: 'ltr', flag: '🇳🇬', country: 'Nigeria'      },  // Abubakar Mahmoud Gumi
];

// ════════════════════════════════════════════════════════════
//  API-HELFER
// ════════════════════════════════════════════════════════════

function apiGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'Accept':     'application/json',
        'User-Agent': 'AL-QURAN-BookBuilder/1.0',
      },
    }, (res) => {
      if (res.statusCode === 429) { reject(new Error('RATE_LIMIT'));            return; }
      if (res.statusCode !== 200)  { reject(new Error('HTTP_' + res.statusCode)); return; }
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON_PARSE: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
  });
}

async function apiGetRetry(url, attempt = 1) {
  try {
    return await apiGet(url);
  } catch (err) {
    if (attempt >= RETRY_MAX) throw err;
    const wait = err.message === 'RATE_LIMIT' ? 6000 : 1800;
    await delay(wait);
    return apiGetRetry(url, attempt + 1);
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));
const ensureDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

// ════════════════════════════════════════════════════════════
//  DATEN LADEN
// ════════════════════════════════════════════════════════════

async function fetchChapters() {
  console.log('📖  Lade Suren-Metadaten...');
  const d = await apiGetRetry('https://api.quran.com/api/v4/chapters?language=de');
  return d.chapters;
}

async function fetchAllArabicVerses() {
  console.log('🕌  Lade arabischen Text (alle Verse auf einmal)...');
  const d = await apiGetRetry('https://api.quran.com/api/v4/quran/verses/uthmani');
  const map = {};
  for (const v of d.verses) map[v.verse_key] = v.text_uthmani;
  return map;
}

async function fetchChapterTranslation(chapterId, translationId) {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapterId}` +
    `?translations=${translationId}&fields=text_uthmani&per_page=300&page=1`;
  const d = await apiGetRetry(url);
  return d.verses || [];
}

// ════════════════════════════════════════════════════════════
//  CSS (in jede HTML-Datei eingebettet – keine externen Dateien nötig)
// ════════════════════════════════════════════════════════════

function buildCSS(transDir) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Serif:wght@400;700&family=Noto+Sans:wght@400;700&display=swap');

:root {
  --gold:       #C9A84C;
  --gold-dark:  #8B6914;
  --gold-light: #F0D080;
  --gold-pale:  #FDF3D0;
  --green-deep: #0D2818;
  --green:      #1A472A;
  --green-mid:  #2D6A4F;
  --cream:      #FDF8EC;
  --parchment:  #F5EDD6;
  --text:       #1A0A00;
  --shadow:     rgba(139,105,20,0.3);
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { font-size:16px; scroll-behavior:smooth; }
body { background:var(--cream); color:var(--text); font-family:'Noto Serif',serif; min-height:100vh; }

/* ── NAVIGATION ── */
.nav-bar {
  background:var(--green); padding:10px 28px;
  display:flex; align-items:center; gap:14px;
  border-bottom:2px solid var(--gold);
  position:sticky; top:0; z-index:100;
  box-shadow:0 2px 10px rgba(0,0,0,0.45);
}
.nav-bar a { color:var(--gold); text-decoration:none; font-size:0.82rem; opacity:.85; transition:opacity .15s; }
.nav-bar a:hover { opacity:1; text-decoration:underline; }
.nav-bar .home { font-weight:700; font-size:.9rem; }
.nav-bar .spacer { flex:1; }
.nav-bar .pos { color:rgba(201,168,76,.5); font-size:.75rem; }

/* ── SUREN-KOPF ── */
.surah-header {
  background:linear-gradient(145deg,var(--green-deep) 0%,var(--green) 55%,var(--green-mid) 100%);
  padding:34px 40px 28px; text-align:center;
  border-bottom:4px solid var(--gold);
  position:relative; overflow:hidden;
}
.surah-header::before {
  content:''; position:absolute; inset:0;
  background-image:
    repeating-linear-gradient( 45deg,transparent,transparent 24px,rgba(201,168,76,.042) 24px,rgba(201,168,76,.042) 25px),
    repeating-linear-gradient(-45deg,transparent,transparent 24px,rgba(201,168,76,.042) 24px,rgba(201,168,76,.042) 25px);
  pointer-events:none;
}
.surah-header::after {
  content:'﴾ ❋ ❋ ❋ ﴿';
  position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
  color:rgba(201,168,76,.3); font-family:'Scheherazade New',serif;
  font-size:1rem; letter-spacing:.45em; white-space:nowrap;
}
.surah-name-ar {
  font-family:'Scheherazade New',serif;
  font-size:3.2rem; color:var(--gold-light); direction:rtl;
  line-height:1.45; text-shadow:0 3px 14px rgba(0,0,0,.5); position:relative;
}
.surah-name-latin { font-size:1rem; color:var(--gold); margin-top:7px; letter-spacing:.16em; text-transform:uppercase; position:relative; }
.surah-meta { font-size:.76rem; color:rgba(201,168,76,.58); margin-top:5px; position:relative; letter-spacing:.06em; }

/* ── BISMILLAH ── */
.bismillah-bar {
  background:var(--parchment);
  border-top:2px solid var(--gold); border-bottom:2px solid var(--gold);
  padding:24px 20px; text-align:center;
}
.bismillah-text {
  font-family:'Scheherazade New',serif;
  font-size:2.3rem; color:var(--gold-dark); direction:rtl; line-height:1.8;
}

/* ── ZIERLINIE ── */
.ornament { text-align:center; color:var(--gold); font-size:1.35rem; padding:14px 0 4px; letter-spacing:.65em; }

/* ── VERSE-CONTAINER ── */
.verses-container { max-width:940px; margin:0 auto; padding:10px 22px 90px; }

/* ── VERS-BLOCK ── */
.verse-block { border-bottom:1px solid rgba(201,168,76,.2); }
.verse-block:nth-child(odd)  { background:var(--cream); }
.verse-block:nth-child(even) { background:var(--parchment); }

/* ── ARABISCHER TEIL (oben – Golden) ── */
.arabic-part {
  padding:26px 26px 14px; direction:rtl; text-align:right;
  border-bottom:1px dashed rgba(201,168,76,.3);
  display:flex; align-items:flex-start; gap:14px;
}
.verse-badge {
  flex-shrink:0; order:2;
  width:40px; height:40px; border-radius:50%;
  background:var(--gold); color:var(--green-deep);
  font-size:.72rem; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 7px var(--shadow);
  font-family:'Noto Serif',serif;
}
.arabic-text {
  font-family:'Scheherazade New',serif;
  font-size:2.15rem; line-height:2.15;
  color:var(--gold-dark); flex:1; order:1;
}

/* ── ÜBERSETZUNGS-TEIL (unten) ── */
.translation-part {
  padding:16px 26px 24px;
  direction:${transDir};
  text-align:${transDir === 'rtl' ? 'right' : 'left'};
}
.trans-label {
  font-size:.67rem; letter-spacing:.15em; text-transform:uppercase;
  color:var(--gold-dark); margin-bottom:9px; font-weight:600; opacity:.72;
}
.trans-text {
  font-size:1.06rem; line-height:2; color:#2A1A00;
  font-family:'Noto Serif',serif;
}

/* ── FUßZEILE ── */
.page-footer {
  background:var(--green-deep); border-top:3px solid var(--gold);
  padding:16px 30px; display:flex; justify-content:space-between;
  align-items:center; color:var(--gold); font-size:.78rem;
}
.footer-glyph { font-family:'Scheherazade New',serif; font-size:1.4rem; }

/* ── DRUCK ── */
@media print {
  .nav-bar { display:none; }
  .surah-header, .bismillah-bar { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
}

/* ── MOBIL ── */
@media (max-width:620px) {
  .arabic-text { font-size:1.65rem; }
  .surah-name-ar { font-size:2.4rem; }
  .verses-container { padding:8px 12px 60px; }
}
`;
}

// ════════════════════════════════════════════════════════════
//  HTML-GENERATOREN
// ════════════════════════════════════════════════════════════

function surahFileName(chapter) {
  return `${String(chapter.id).padStart(3, '0')}-${chapter.name_simple.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
}

function generateSurahPage(chapter, verses, arabicMap, translation) {
  const hasBismillah = chapter.id !== 1 && chapter.id !== 9;
  const revDE = chapter.revelation_place === 'makkah' ? 'Mekkanisch' : 'Medinensisch';
  const transName = chapter.translated_name ? chapter.translated_name.name : '';

  const bismillah = hasBismillah ? `
  <div class="bismillah-bar">
    <div class="bismillah-text">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
  </div>` : '';

  const verseBlocks = verses.map(v => {
    const [, verseNum] = v.verse_key.split(':');
    const arabic = arabicMap[v.verse_key] || '';
    const raw    = (v.translations && v.translations[0]) ? v.translations[0].text : '—';
    const trans  = raw.replace(/<sup[^>]*>.*?<\/sup>/gi, '').replace(/<[^>]+>/g, '').trim();

    return `
  <div class="verse-block" id="v${verseNum}">
    <div class="arabic-part">
      <div class="arabic-text">${arabic}</div>
      <div class="verse-badge">${verseNum}</div>
    </div>
    <div class="translation-part">
      <div class="trans-label">${translation.flag} ${translation.name} · ${translation.country}</div>
      <div class="trans-text">${trans}</div>
    </div>
  </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${translation.lang}" dir="${translation.dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sure ${chapter.id} · ${chapter.name_arabic} · ${translation.name}</title>
  <style>${buildCSS(translation.dir)}</style>
</head>
<body>

  <nav class="nav-bar">
    <a class="home" href="../../index.html">🏠 AL-QURAN</a>
    <a href="../index.html">${translation.flag} ${translation.name}</a>
    <span class="spacer"></span>
    <span class="pos">Sure ${chapter.id} / 114</span>
  </nav>

  <header class="surah-header">
    <div class="surah-name-ar">${chapter.name_arabic}</div>
    <div class="surah-name-latin">${chapter.name_simple}${transName ? ' — ' + transName : ''}</div>
    <div class="surah-meta">Sure ${chapter.id} &nbsp;·&nbsp; ${chapter.verses_count} Verse &nbsp;·&nbsp; ${revDE}</div>
  </header>

  ${bismillah}

  <div class="ornament">❧ ✦ ❧</div>

  <main class="verses-container">
    ${verseBlocks}
  </main>

  <footer class="page-footer">
    <span class="footer-glyph">﴾</span>
    <span>AL-QURAN AL-KARIM &nbsp;·&nbsp; Sure ${chapter.id} &nbsp;·&nbsp; ${translation.name}</span>
    <span class="footer-glyph">﴿</span>
  </footer>

</body>
</html>`;
}

function generateTranslationIndex(translation, chapters) {
  const links = chapters.map(c => {
    const file = surahFileName(c);
    const tn   = c.translated_name ? c.translated_name.name : '';
    return `    <a href="suren/${file}" class="surah-card">
      <div class="s-num">${c.id}</div>
      <div class="s-ar">${c.name_arabic}</div>
      <div class="s-info">
        <span class="s-name">${c.name_simple}</span>
        <span class="s-sub">${tn}</span>
      </div>
      <div class="s-count">${c.verses_count}<br><small>Verse</small></div>
    </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${translation.lang}" dir="${translation.dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN · ${translation.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root { --gold:#C9A84C; --gold-dark:#8B6914; --gold-light:#F0D080; --green-deep:#0D2818; --green:#1A472A; --cream:#FDF8EC; --parchment:#F5EDD6; }
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;}

    .top-nav{background:var(--green);padding:10px 28px;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:50;box-shadow:0 2px 8px rgba(0,0,0,0.4);}
    .top-nav a{color:var(--gold);text-decoration:none;font-size:.85rem;}
    .top-nav a:hover{text-decoration:underline;}

    header{background:linear-gradient(140deg,var(--green-deep),var(--green));padding:46px 30px 32px;text-align:center;border-bottom:4px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px),repeating-linear-gradient(-45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px);pointer-events:none;}
    .h-ar{font-family:'Scheherazade New',serif;font-size:3.6rem;color:var(--gold-light);direction:rtl;text-shadow:0 3px 14px rgba(0,0,0,.5);position:relative;}
    .h-latin{font-size:1.1rem;color:var(--gold);margin-top:8px;letter-spacing:.2em;text-transform:uppercase;position:relative;}
    .h-flag{font-size:2.5rem;margin-top:12px;position:relative;}
    .h-sub{color:rgba(240,208,128,.65);font-size:.82rem;margin-top:6px;position:relative;}

    .grid{max-width:960px;margin:26px auto 60px;padding:0 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(288px,1fr));gap:10px;}
    .surah-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:white;border:1px solid rgba(201,168,76,.25);border-right:4px solid var(--gold);border-radius:6px;text-decoration:none;color:#1A0A00;transition:all .2s;box-shadow:0 1px 4px rgba(201,168,76,.1);}
    .surah-card:hover{background:var(--parchment);box-shadow:0 4px 16px rgba(201,168,76,.28);transform:translateX(-3px);}
    .s-num{min-width:36px;height:36px;border-radius:50%;background:var(--gold);color:var(--green-deep);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;}
    .s-ar{font-family:'Scheherazade New',serif;font-size:1.5rem;color:var(--gold-dark);direction:rtl;min-width:70px;text-align:right;}
    .s-info{flex:1;}
    .s-name{display:block;font-size:.88rem;font-weight:600;color:#222;}
    .s-sub{display:block;font-size:.72rem;color:#777;margin-top:2px;}
    .s-count{font-size:.72rem;color:var(--gold-dark);text-align:center;line-height:1.4;}

    footer{background:var(--green-deep);border-top:3px solid var(--gold);color:var(--gold);text-align:center;padding:24px 20px;font-family:'Scheherazade New',serif;font-size:1.35rem;line-height:2.1;}
    footer .small{font-family:'Noto Serif',serif;font-size:.74rem;color:rgba(201,168,76,.55);margin-top:6px;}
  </style>
</head>
<body>
  <nav class="top-nav"><a href="../index.html">← AL-QURAN · Alle Übersetzungen</a></nav>

  <header>
    <div class="h-ar">القرآن الكريم</div>
    <div class="h-latin">Al-Quran Al-Karim</div>
    <div class="h-flag">${translation.flag}</div>
    <div class="h-sub">${translation.name} · ${translation.country}</div>
  </header>

  <main class="grid">
${links}
  </main>

  <footer>
    القرآن الكريم
    <div class="small">114 Suren · 6.236 Verse · ${translation.name}</div>
  </footer>
</body>
</html>`;
}

function generateMainIndex() {
  const cards = TRANSLATIONS.map(t =>
    `    <a href="${t.name}/index.html" class="lang-card">
      <div class="flag">${t.flag}</div>
      <div class="lang-name">${t.name}</div>
      <div class="country">${t.country}</div>
    </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN AL-KARIM – Alle Übersetzungen</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#C9A84C;--gold-dark:#8B6914;--gold-light:#F0D080;--green-deep:#0D2818;--green:#1A472A;--green-mid:#2D6A4F;--cream:#FDF8EC;--parchment:#F5EDD6;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;}

    header{background:linear-gradient(160deg,var(--green-deep) 0%,var(--green) 55%,var(--green-mid) 100%);padding:68px 30px 46px;text-align:center;border-bottom:5px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 50%,rgba(201,168,76,.09) 0%,transparent 45%),radial-gradient(circle at 82% 50%,rgba(201,168,76,.09) 0%,transparent 45%),repeating-linear-gradient(45deg,transparent,transparent 28px,rgba(201,168,76,.034) 28px,rgba(201,168,76,.034) 29px),repeating-linear-gradient(-45deg,transparent,transparent 28px,rgba(201,168,76,.034) 28px,rgba(201,168,76,.034) 29px);pointer-events:none;}
    header::after{content:'﴾ ❋ ❋ ❋ ﴿';position:absolute;bottom:12px;left:50%;transform:translateX(-50%);color:rgba(201,168,76,.28);font-family:'Scheherazade New',serif;font-size:1.2rem;letter-spacing:.5em;white-space:nowrap;}

    .main-ar{font-family:'Scheherazade New',serif;font-size:5rem;color:var(--gold-light);direction:rtl;text-shadow:0 4px 20px rgba(0,0,0,.55);position:relative;}
    .main-latin{font-size:1.25rem;color:var(--gold);letter-spacing:.25em;text-transform:uppercase;margin-top:13px;position:relative;}
    .bismillah-h{font-family:'Scheherazade New',serif;font-size:2rem;color:rgba(240,208,128,.72);direction:rtl;margin-top:18px;position:relative;}
    .stats{color:rgba(240,208,128,.5);font-size:.8rem;margin-top:8px;position:relative;letter-spacing:.1em;}
    .cover-btns{display:flex;gap:14px;justify-content:center;margin-top:24px;position:relative;}
    .cover-btns a{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.42);color:var(--gold);padding:9px 24px;border-radius:4px;text-decoration:none;font-size:.82rem;letter-spacing:.06em;transition:background .2s;}
    .cover-btns a:hover{background:rgba(201,168,76,.28);}

    .section-label{text-align:center;padding:28px 20px 8px;font-size:.82rem;color:var(--gold-dark);letter-spacing:.18em;text-transform:uppercase;}

    .lang-grid{max-width:860px;margin:16px auto 68px;padding:0 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:14px;}
    .lang-card{display:flex;flex-direction:column;align-items:center;padding:28px 14px;background:white;border:1px solid rgba(201,168,76,.2);border-top:4px solid var(--gold);border-radius:8px;text-decoration:none;color:#1A0A00;transition:all .22s;box-shadow:0 2px 8px rgba(201,168,76,.08);text-align:center;}
    .lang-card:hover{background:var(--parchment);box-shadow:0 7px 24px rgba(201,168,76,.3);transform:translateY(-5px);}
    .flag{font-size:2.9rem;margin-bottom:10px;}
    .lang-name{font-size:.94rem;font-weight:700;color:var(--green);}
    .country{font-size:.7rem;color:#666;margin-top:4px;}

    footer{background:var(--green-deep);border-top:4px solid var(--gold);color:var(--gold);text-align:center;padding:34px 20px;font-family:'Scheherazade New',serif;font-size:1.5rem;line-height:2.3;}
    footer .small{font-family:'Noto Serif',serif;font-size:.76rem;color:rgba(201,168,76,.52);margin-top:8px;}
  </style>
</head>
<body>
  <header>
    <div class="main-ar">القرآن الكريم</div>
    <div class="main-latin">Al-Quran Al-Karim</div>
    <div class="bismillah-h">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
    <div class="stats">114 Suren · 6.236 Verse · 10 Übersetzungen</div>
    <div class="cover-btns">
      <a href="../cover.html">📖 Cover</a>
      <a href="../vorwort.html">📜 Vorwort</a>
      <a href="../inhaltsverzeichnis.html">📋 Inhalt</a>
      <a href="../back-cover.html">📕 Rückseite</a>
    </div>
  </header>

  <p class="section-label">❧ Wähle eine Übersetzung ❧</p>

  <main class="lang-grid">
${cards}
  </main>

  <footer>
    القرآن الكريم
    <div class="small">Al-Quran Al-Karim — Das edle Buch des Islam<br>Arabischer Text: Uthmani-Schrift · Quelle: quran.com API v4</div>
  </footer>
</body>
</html>`;
}

function generateCover() {
  const badges = TRANSLATIONS.map(t => `<span class="badge">${t.flag} ${t.name}</span>`).join(' ');
  return `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN AL-KARIM – Cover</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;height:100%;}
    body{background:#060f0a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Noto Serif',serif;}

    .cover{width:min(580px,94vw);aspect-ratio:2/3;background:linear-gradient(175deg,#0A1F12 0%,#1A472A 45%,#0D2818 100%);border:7px solid #C9A84C;outline:2px solid #8B6914;outline-offset:-14px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 0 13px #060f0a,0 0 0 16px #C9A84C,0 30px 80px rgba(0,0,0,.8);}
    .cover::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 34px,rgba(201,168,76,.044) 34px,rgba(201,168,76,.044) 35px),repeating-linear-gradient(90deg,transparent,transparent 34px,rgba(201,168,76,.044) 34px,rgba(201,168,76,.044) 35px),repeating-linear-gradient(45deg,transparent,transparent 48px,rgba(201,168,76,.028) 48px,rgba(201,168,76,.028) 49px),repeating-linear-gradient(-45deg,transparent,transparent 48px,rgba(201,168,76,.028) 48px,rgba(201,168,76,.028) 49px);pointer-events:none;}
    .top-orn{position:absolute;top:20px;left:50%;transform:translateX(-50%);color:rgba(201,168,76,.48);font-family:'Scheherazade New',serif;font-size:1.4rem;letter-spacing:.5em;white-space:nowrap;}
    .bot-orn{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(201,168,76,.48);font-family:'Scheherazade New',serif;font-size:1.4rem;letter-spacing:.5em;white-space:nowrap;}

    .inner{border:1.5px solid rgba(201,168,76,.33);padding:38px 26px;width:80%;text-align:center;position:relative;}
    .inner::before{content:'';position:absolute;top:-9px;left:-9px;right:-9px;bottom:-9px;border:1px solid rgba(201,168,76,.14);}

    .top-deco{color:#C9A84C;font-size:1.15rem;letter-spacing:.55em;margin-bottom:18px;font-family:'Scheherazade New',serif;}
    .bismillah{font-family:'Scheherazade New',serif;font-size:1.6rem;color:#F0D080;direction:rtl;line-height:1.9;margin-bottom:28px;text-shadow:0 2px 12px rgba(0,0,0,.6);}
    .title-ar{font-family:'Scheherazade New',serif;font-size:4.3rem;color:#C9A84C;direction:rtl;line-height:1.25;text-shadow:0 4px 20px rgba(0,0,0,.55),0 0 45px rgba(201,168,76,.22);}
    .divider{width:65%;height:1px;background:linear-gradient(to right,transparent,#C9A84C,transparent);margin:20px auto;}
    .title-latin{color:#F0D080;font-size:1.05rem;letter-spacing:.28em;text-transform:uppercase;}
    .stats{color:rgba(201,168,76,.52);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;}
    .badges{margin-top:16px;display:flex;flex-wrap:wrap;gap:5px;justify-content:center;}
    .badge{font-size:.6rem;padding:3px 7px;border:1px solid rgba(201,168,76,.23);color:rgba(240,208,128,.68);border-radius:3px;letter-spacing:.04em;}
    .enter{display:inline-block;margin-top:20px;padding:10px 28px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.44);color:#C9A84C;text-decoration:none;border-radius:3px;font-size:.82rem;letter-spacing:.1em;transition:background .2s;}
    .enter:hover{background:rgba(201,168,76,.28);}
  </style>
</head>
<body>
  <div class="cover">
    <div class="top-orn">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="bot-orn">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="inner">
      <div class="top-deco">❧ ✦ ❧</div>
      <div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
      <div class="title-ar">القرآن<br>الكريم</div>
      <div class="divider"></div>
      <div class="title-latin">Al-Quran Al-Karim</div>
      <div class="stats">114 Suren · 6.236 Verse · 10 Sprachen</div>
      <div class="badges">${badges}</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin-top:14px;">
        <a href="vorwort.html" class="enter" style="font-size:.72rem;padding:7px 16px;margin-top:0;">📜 Vorwort</a>
        <a href="inhaltsverzeichnis.html" class="enter" style="font-size:.72rem;padding:7px 16px;margin-top:0;">📋 Inhalt</a>
      </div>
      <a href="Übersetzungen/index.html" class="enter" style="margin-top:10px;">Zum Inhalt ❯</a>
    </div>
  </div>
</body>
</html>`;
}

function generateBackCover() {
  const langList = TRANSLATIONS.map(t => `
        <div class="lang-row">
          <span class="flag">${t.flag}</span>
          <span class="name">${t.name}</span>
          <span class="country">${t.country}</span>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN AL-KARIM – Rückseite</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;height:100%;}
    body{background:#060f0a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Noto Serif',serif;}

    .back{width:min(580px,94vw);aspect-ratio:2/3;background:linear-gradient(175deg,#0A1F12 0%,#1A472A 45%,#0D2818 100%);border:7px solid #C9A84C;outline:2px solid #8B6914;outline-offset:-14px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;overflow:hidden;padding:48px 34px 32px;box-shadow:0 0 0 13px #060f0a,0 0 0 16px #C9A84C,0 30px 80px rgba(0,0,0,.8);}
    .back::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 34px,rgba(201,168,76,.04) 34px,rgba(201,168,76,.04) 35px),repeating-linear-gradient(90deg,transparent,transparent 34px,rgba(201,168,76,.04) 34px,rgba(201,168,76,.04) 35px);pointer-events:none;}

    .top{text-align:center;width:100%;position:relative;}
    .back-ar{font-family:'Scheherazade New',serif;font-size:2.6rem;color:#C9A84C;direction:rtl;text-shadow:0 3px 12px rgba(0,0,0,.5);}
    .divider{width:75%;height:1px;background:linear-gradient(to right,transparent,#C9A84C,transparent);margin:16px auto;}
    .desc{color:rgba(240,208,128,.76);font-size:.8rem;line-height:1.95;text-align:center;}

    .mid{width:100%;position:relative;}
    .lang-title{font-size:.64rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,.62);text-align:center;margin-bottom:12px;}
    .lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;}
    .lang-row{display:flex;align-items:center;gap:8px;padding:5px 9px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.13);border-radius:3px;}
    .flag{font-size:.95rem;}
    .name{color:rgba(240,208,128,.83);font-size:.75rem;}
    .country{margin-left:auto;color:rgba(201,168,76,.38);font-size:.63rem;}

    .bot{text-align:center;width:100%;position:relative;}
    .closing{font-family:'Scheherazade New',serif;font-size:1.4rem;color:#F0D080;direction:rtl;margin-bottom:5px;}
    .closing-ref{font-size:.67rem;color:rgba(201,168,76,.42);}
    .back-link{display:inline-block;margin-top:12px;color:rgba(201,168,76,.53);text-decoration:none;font-size:.7rem;border:1px solid rgba(201,168,76,.18);padding:5px 16px;border-radius:3px;transition:all .2s;}
    .back-link:hover{color:#C9A84C;border-color:rgba(201,168,76,.44);}
  </style>
</head>
<body>
  <div class="back">
    <div class="top">
      <div class="back-ar">القرآن الكريم</div>
      <div class="divider"></div>
      <div class="desc">Das edle Buch des Islam in 10 Weltsprachen.<br>Arabischer Originaltext in Uthmani-Schrift<br>mit Übersetzungen der größten muslimischen<br>Bevölkerungen weltweit.</div>
    </div>
    <div class="mid">
      <div class="lang-title">❧ Enthaltene Übersetzungen ❧</div>
      <div class="lang-grid">${langList}</div>
    </div>
    <div class="bot">
      <div class="divider"></div>
      <div class="closing">إِنَّهُۥ لَقُرْءَانٌ كَرِيمٌ</div>
      <div class="closing-ref">Wahrlich, es ist ein edler Quran. (56:77)</div>
      <a href="cover.html" class="back-link">← Zum Cover</a>
    </div>
  </div>
</body>
</html>`;
}

// ════════════════════════════════════════════════════════════
//  VORWORT
// ════════════════════════════════════════════════════════════

function generateVorwort() {
  const langLinks = TRANSLATIONS.map(t =>
    `        <a href="Übersetzungen/${t.name}/index.html" class="lang-item">` +
    `<span class="fl">${t.flag}</span>` +
    `<span><span class="ln">${t.name}</span><br><span class="lc">${t.country}</span></span></a>`
  ).join('\n');

  const scholarMap = {27:'Frank Bubenheim &amp; Nadeem',20:'Saheeh International',77:'Diyanet İşleri Başkanlığı',33:'Kementerian Agama RI',97:'Sayyid Abul Ala Maududi',135:'IslamHouse.com',45:'Elmir Kuliev',161:'Taisirul Quran (Tawheed Publication)',122:'Maulana Azizul Haque al-Umari',32:'Abubakar Mahmoud Gumi'};
  const scholarLines = TRANSLATIONS.map(t =>
    `        <p class="sc-row">${t.flag} <strong>${t.name}</strong> — ${scholarMap[t.id] || '—'}</p>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN – Vorwort</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#C9A84C;--gold-dark:#8B6914;--gold-light:#F0D080;--green-deep:#0D2818;--green:#1A472A;--green-mid:#2D6A4F;--cream:#FDF8EC;--parchment:#F5EDD6;--text:#1A0A00;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;color:var(--text);}

    .nav-bar{background:var(--green);padding:10px 28px;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;gap:18px;align-items:center;flex-wrap:wrap;}
    .nav-bar a{color:var(--gold);text-decoration:none;font-size:.82rem;opacity:.85;transition:opacity .15s;}
    .nav-bar a:hover{opacity:1;text-decoration:underline;}
    .nav-bar .home{font-weight:700;}

    header{background:linear-gradient(145deg,var(--green-deep),var(--green));padding:52px 30px 38px;text-align:center;border-bottom:4px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px),repeating-linear-gradient(-45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px);pointer-events:none;}
    .bismi{font-family:'Scheherazade New',serif;font-size:2.4rem;color:var(--gold-light);direction:rtl;margin-bottom:20px;text-shadow:0 3px 14px rgba(0,0,0,.5);position:relative;}
    .h-title{font-size:1.9rem;color:var(--gold);letter-spacing:.12em;text-transform:uppercase;position:relative;}
    .h-sub{color:rgba(240,208,128,.6);font-size:.82rem;margin-top:8px;letter-spacing:.08em;position:relative;}
    .h-orn{color:rgba(201,168,76,.35);font-family:'Scheherazade New',serif;font-size:1.1rem;letter-spacing:.5em;margin-top:14px;position:relative;}

    .content{max-width:780px;margin:0 auto;padding:50px 30px 90px;}
    .section{margin-bottom:44px;}
    .sec-title{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-dark);margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid rgba(201,168,76,.25);}

    .letter{background:white;border:1px solid rgba(201,168,76,.2);border-left:5px solid var(--gold);border-radius:4px;padding:36px 40px;line-height:2.1;font-size:1.02rem;box-shadow:0 2px 12px rgba(201,168,76,.07);}
    .letter p{margin-bottom:1.5em;}
    .letter p:last-child{margin-bottom:0;}
    .letter em{color:var(--green);font-style:normal;font-weight:600;}
    .letter .arabic-q{font-family:'Scheherazade New',serif;font-size:1.85rem;color:var(--gold-dark);direction:rtl;text-align:right;display:block;margin:16px 0 4px;line-height:1.9;}
    .letter .q-ref{font-size:.72rem;color:#888;text-align:right;display:block;margin-bottom:22px;}
    .letter .signature{margin-top:30px;padding-top:22px;border-top:1px solid rgba(201,168,76,.2);font-size:.88rem;color:#555;font-style:italic;line-height:2;}

    .langs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px;}
    .lang-item{background:white;border:1px solid rgba(201,168,76,.18);border-top:3px solid var(--gold);border-radius:5px;padding:14px 16px;display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);transition:all .2s;}
    .lang-item:hover{background:var(--parchment);box-shadow:0 4px 14px rgba(201,168,76,.2);transform:translateY(-2px);}
    .fl{font-size:1.6rem;}
    .ln{font-size:.86rem;font-weight:700;color:var(--green);}
    .lc{font-size:.68rem;color:#888;margin-top:2px;}

    .scholars-box{background:white;border:1px solid rgba(201,168,76,.18);border-radius:4px;padding:26px 32px;box-shadow:0 2px 10px rgba(201,168,76,.06);}
    .scholars-box .intro{margin-bottom:16px;font-size:.95rem;line-height:1.9;}
    .sc-row{font-size:.88rem;line-height:1.9;padding:4px 0;border-bottom:1px solid rgba(201,168,76,.1);}
    .sc-row:last-child{border-bottom:none;}

    footer{background:var(--green-deep);border-top:3px solid var(--gold);padding:22px 30px;text-align:center;color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.35rem;}
    footer .sm{font-family:'Noto Serif',serif;font-size:.72rem;color:rgba(201,168,76,.45);margin-top:7px;}
  </style>
</head>
<body>

  <nav class="nav-bar">
    <a class="home" href="cover.html">🏠 AL-QURAN</a>
    <a href="inhaltsverzeichnis.html">📋 Inhaltsverzeichnis</a>
    <a href="Übersetzungen/index.html">🌍 Übersetzungen</a>
    <a href="back-cover.html">📕 Rückseite</a>
  </nav>

  <header>
    <div class="bismi">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
    <div class="h-title">Vorwort</div>
    <div class="h-sub">Warum dieses Werk entstand</div>
    <div class="h-orn">﴾ ❋ ❋ ❋ ﴿</div>
  </header>

  <main class="content">

    <div class="section">
      <div class="sec-title">❧ Das Anliegen</div>
      <div class="letter">
        <p>Dieses Werk entstand aus einem tiefen, aufrichtigen Wunsch heraus:
        <em>jedem Menschen die Möglichkeit zu geben, den Quran zu lesen, zu verstehen und zu erleben</em> —
        unabhängig von Sprache, Herkunft oder Vorwissen.</p>
        <p>Viele Muslime sind mit dem Islam aufgewachsen. Sie kennen die Gebete, feiern die Feste,
        lieben ihre Religion — haben den Quran aber nie vollständig in ihrer eigenen Muttersprache
        gelesen. Nicht weil sie es nicht wollten, sondern weil der Zugang oft schwer war:
        zu akademisch, zu altmodisch, zu verstreut über viele verschiedene Quellen.</p>
        <p>Dieses Projekt soll das ändern. <em>Klar. Offen. Kostenlos. Für jeden.</em></p>
        <span class="arabic-q">وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ</span>
        <span class="q-ref">»Und Wir haben den Quran leicht gemacht zum Gedenken — gibt es jemanden, der sich erinnert?« (54:17)</span>
        <p>Der arabische Originaltext steht immer oben — das unveränderliche, direkte Wort
        Allahs (ﷻ) in der Uthmani-Schrift, so wie er seit über 1.400 Jahren überliefert wird.
        Darunter folgt die Übersetzung aus dem Werk eines anerkannten islamischen Gelehrten —
        nicht von einer Maschine, sondern von Menschen, die ihr Leben dem
        Verständnis dieses Buches gewidmet haben.</p>
        <p>Das Ziel ist nicht, den Quran zu erklären oder zu kommentieren.
        Das Ziel ist es, den <em>direkten Zugang</em> zu ermöglichen —
        damit du selbst lesen, nachdenken und fühlen kannst.
        Damit du <em>näher an den Ursprung und die Wurzeln deiner Religion</em> kommst.</p>
        <p>Dieses Werk ist für <em>alle</em>: für Muslime, die ihren Quran tiefer verstehen wollen,
        für Menschen anderer Glaubensrichtungen, die neugierig sind,
        und für jeden, der sucht.</p>
        <div class="signature">
          Möge Allah (ﷻ) dieses Werk als aufrichtige Tat annehmen.<br>
          Möge es jedem nützen, der liest.<br>
          Möge es ein Licht sein für alle, die die Wahrheit suchen.<br>
          <br>
          — BooKX · KroniX
        </div>
      </div>
    </div>

    <div class="section">
      <div class="sec-title">❧ 10 Verfügbare Sprachen</div>
      <div class="langs-grid">
${langLinks}
      </div>
    </div>

    <div class="section">
      <div class="sec-title">❧ Über die Quellen &amp; Gelehrten</div>
      <div class="scholars-box">
        <p class="intro">Alle Texte stammen aus der <strong>quran.com API v4</strong> — einer der
        vertrauenswürdigsten digitalen Quran-Datenbanken der Welt.
        Der arabische Text liegt in der <strong>Uthmani-Schrift</strong> vor, der offiziellen
        Schreibweise des Qurans. Die Übersetzungen stammen von folgenden anerkannten Gelehrten:</p>
${scholarLines}
      </div>
    </div>

  </main>

  <footer>
    القرآن الكريم
    <div class="sm">AL-QURAN AL-KARIM · BooKX · KroniX</div>
  </footer>

</body>
</html>`;
}

// ════════════════════════════════════════════════════════════
//  INHALTSVERZEICHNIS
// ════════════════════════════════════════════════════════════

function generateInhaltsverzeichnis(chapters) {
  const rows = chapters.map(c => {
    const tn  = c.translated_name ? c.translated_name.name : '';
    const isMakki = c.revelation_place === 'makkah';
    return `      <tr>
        <td class="td-num">${c.id}</td>
        <td class="td-ar"><span dir="rtl">${c.name_arabic}</span></td>
        <td class="td-name">${c.name_simple}${tn ? '<br><small>' + tn + '</small>' : ''}</td>
        <td class="td-v">${c.verses_count}</td>
        <td class="td-r ${isMakki ? 'td-m' : 'td-med'}">${isMakki ? 'Mekk.' : 'Med.'}</td>
      </tr>`;
  }).join('\n');

  const langCards = TRANSLATIONS.map(t =>
    `        <a href="Übersetzungen/${t.name}/index.html" class="lang-card">` +
    `<span class="fl">${t.flag}</span>` +
    `<span><div class="ln">${t.name}</div><div class="lc">${t.country}</div></span></a>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN – Inhaltsverzeichnis</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#C9A84C;--gold-dark:#8B6914;--gold-light:#F0D080;--green-deep:#0D2818;--green:#1A472A;--cream:#FDF8EC;--parchment:#F5EDD6;--text:#1A0A00;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;color:var(--text);}

    .nav-bar{background:var(--green);padding:10px 28px;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;gap:18px;align-items:center;flex-wrap:wrap;}
    .nav-bar a{color:var(--gold);text-decoration:none;font-size:.82rem;opacity:.85;transition:opacity .15s;}
    .nav-bar a:hover{opacity:1;text-decoration:underline;}
    .nav-bar .home{font-weight:700;}

    header{background:linear-gradient(145deg,var(--green-deep),var(--green));padding:46px 30px 34px;text-align:center;border-bottom:4px solid var(--gold);position:relative;overflow:hidden;}
    header::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px),repeating-linear-gradient(-45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px);pointer-events:none;}
    .h-ar{font-family:'Scheherazade New',serif;font-size:3rem;color:var(--gold-light);direction:rtl;text-shadow:0 3px 14px rgba(0,0,0,.5);position:relative;}
    .h-title{font-size:1.4rem;color:var(--gold);letter-spacing:.15em;text-transform:uppercase;margin-top:10px;position:relative;}
    .h-orn{color:rgba(201,168,76,.35);font-family:'Scheherazade New',serif;font-size:1rem;letter-spacing:.5em;margin-top:12px;position:relative;}

    .content{max-width:960px;margin:0 auto;padding:40px 24px 80px;}
    .section{margin-bottom:44px;}
    .sec-title{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-dark);margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid rgba(201,168,76,.25);}

    .quick-nav{display:flex;gap:10px;flex-wrap:wrap;}
    .quick-nav a{padding:9px 20px;background:white;border:1px solid rgba(201,168,76,.22);border-radius:4px;color:var(--text);text-decoration:none;font-size:.84rem;transition:all .18s;box-shadow:0 1px 4px rgba(201,168,76,.07);}
    .quick-nav a:hover{background:var(--parchment);box-shadow:0 3px 12px rgba(201,168,76,.2);}

    .langs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:10px;}
    .lang-card{display:flex;align-items:center;gap:10px;padding:13px 15px;background:white;border:1px solid rgba(201,168,76,.18);border-left:4px solid var(--gold);border-radius:4px;text-decoration:none;color:var(--text);transition:all .2s;}
    .lang-card:hover{background:var(--parchment);box-shadow:0 4px 14px rgba(201,168,76,.2);}
    .fl{font-size:1.5rem;}
    .ln{font-size:.86rem;font-weight:700;color:var(--green);}
    .lc{font-size:.68rem;color:#888;margin-top:2px;}

    .sura-table{width:100%;border-collapse:collapse;background:white;box-shadow:0 2px 12px rgba(201,168,76,.08);border-radius:4px;overflow:hidden;}
    .sura-table thead{background:var(--green);color:var(--gold);}
    .sura-table th{padding:10px 12px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;text-align:left;border-bottom:2px solid var(--gold);}
    .sura-table tbody tr{border-bottom:1px solid rgba(201,168,76,.12);}
    .sura-table tbody tr:nth-child(odd){background:var(--cream);}
    .sura-table tbody tr:nth-child(even){background:white;}
    .sura-table tbody tr:hover{background:var(--parchment);}
    .td-num{width:48px;font-size:.8rem;color:var(--gold-dark);font-weight:700;text-align:center;padding:8px 6px;}
    .td-ar{width:130px;padding:8px 10px;text-align:right;font-family:'Scheherazade New',serif;font-size:1.2rem;}
    .td-name{padding:8px 12px;font-size:.88rem;}
    .td-name small{color:#888;font-size:.72rem;}
    .td-v{width:58px;padding:8px;text-align:center;font-size:.8rem;color:#555;}
    .td-r{width:75px;padding:6px 8px;text-align:center;font-size:.68rem;letter-spacing:.05em;border-radius:3px;font-weight:600;}
    .td-m{color:#7A4100;background:rgba(200,120,20,.1);}
    .td-med{color:#1A472A;background:rgba(26,71,42,.1);}

    footer{background:var(--green-deep);border-top:3px solid var(--gold);padding:22px;text-align:center;color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.3rem;}
    footer .sm{font-family:'Noto Serif',serif;font-size:.7rem;color:rgba(201,168,76,.45);margin-top:6px;}
  </style>
</head>
<body>

  <nav class="nav-bar">
    <a class="home" href="cover.html">🏠 AL-QURAN</a>
    <a href="vorwort.html">📜 Vorwort</a>
    <a href="Übersetzungen/index.html">🌍 Übersetzungen</a>
    <a href="back-cover.html">📕 Rückseite</a>
  </nav>

  <header>
    <div class="h-ar">القرآن الكريم</div>
    <div class="h-title">Inhaltsverzeichnis</div>
    <div class="h-orn">﴾ ❋ ❋ ❋ ﴿</div>
  </header>

  <main class="content">

    <div class="section">
      <div class="sec-title">❧ Schnellnavigation</div>
      <div class="quick-nav">
        <a href="cover.html">📖 Cover</a>
        <a href="vorwort.html">📜 Vorwort</a>
        <a href="Übersetzungen/index.html">🌍 Alle Übersetzungen</a>
        <a href="back-cover.html">📕 Rückseite</a>
      </div>
    </div>

    <div class="section">
      <div class="sec-title">❧ 10 Übersetzungen</div>
      <div class="langs-grid">
${langCards}
      </div>
    </div>

    <div class="section">
      <div class="sec-title">❧ Die 114 Suren des Qurans</div>
      <table class="sura-table">
        <thead>
          <tr>
            <th style="text-align:center">#</th>
            <th style="text-align:right">Arabisch</th>
            <th>Name</th>
            <th style="text-align:center">Verse</th>
            <th style="text-align:center">Offenbarung</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>

  </main>

  <footer>
    القرآن الكريم
    <div class="sm">114 Suren · 6.236 Verse · 10 Sprachen · AL-QURAN AL-KARIM</div>
  </footer>

</body>
</html>`;
}

// ════════════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ════════════════════════════════════════════════════════════

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║    AL-QURAN AL-KARIM – BOOK BUILDER     ║');
  console.log('║  Quelle: quran.com API v4 (kostenlos)   ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const chapters  = await fetchChapters();
  console.log(`✅  ${chapters.length} Suren-Metadaten geladen\n`);

  const arabicMap = await fetchAllArabicVerses();
  console.log(`✅  ${Object.keys(arabicMap).length} arabische Verse geladen\n`);

  ensureDir(OUT_DIR);

  console.log('🎨  Generiere Cover, Rückseite, Vorwort & Inhaltsverzeichnis...');
  fs.writeFileSync(path.join(BASE_DIR, 'cover.html'),              generateCover(),                       'utf8');
  fs.writeFileSync(path.join(BASE_DIR, 'back-cover.html'),         generateBackCover(),                   'utf8');
  fs.writeFileSync(path.join(BASE_DIR, 'vorwort.html'),            generateVorwort(),                     'utf8');
  fs.writeFileSync(path.join(BASE_DIR, 'inhaltsverzeichnis.html'), generateInhaltsverzeichnis(chapters),  'utf8');
  console.log('✅  cover.html, back-cover.html, vorwort.html, inhaltsverzeichnis.html erstellt\n');

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), generateMainIndex(), 'utf8');
  console.log('✅  Übersetzungen/index.html erstellt\n');

  for (const translation of TRANSLATIONS) {
    const transDir = path.join(OUT_DIR, translation.name);
    const surenDir = path.join(transDir, 'suren');
    ensureDir(surenDir);

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`${translation.flag}  ${translation.name} (API-ID: ${translation.id}) · ${translation.country}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    fs.writeFileSync(
      path.join(transDir, 'index.html'),
      generateTranslationIndex(translation, chapters),
      'utf8'
    );

    let ok = 0, skip = 0, fail = 0;
    for (const chapter of chapters) {
      const file    = surahFileName(chapter);
      const outPath = path.join(surenDir, file);

      // Resume: bereits vorhandene Dateien überspringen
      if (fs.existsSync(outPath)) {
        process.stdout.write(`  [SKIP] ${String(chapter.id).padStart(3,' ')}/114 ${chapter.name_simple}\n`);
        skip++; continue;
      }

      process.stdout.write(`  [    ] ${String(chapter.id).padStart(3,' ')}/114 ${chapter.name_simple}... `);
      try {
        const verses = await fetchChapterTranslation(chapter.id, translation.id);
        if (!verses.length) {
          process.stdout.write(`⚠  Leer (Übersetzungs-ID prüfen → node fetch-translations.js)\n`);
          fail++;
        } else {
          const html = generateSurahPage(chapter, verses, arabicMap, translation);
          fs.writeFileSync(outPath, html, 'utf8');
          process.stdout.write(`\r  [ ✅ ] ${String(chapter.id).padStart(3,' ')}/114 ${chapter.name_simple} · ${verses.length} Verse\n`);
          ok++;
        }
      } catch (err) {
        process.stdout.write(`\r  [ ❌ ] ${String(chapter.id).padStart(3,' ')}/114 ${chapter.name_simple} → ${err.message}\n`);
        fail++;
      }
      await delay(DELAY_MS);
    }
    console.log(`\n  Fertig: ✅ ${ok}  ⏭ ${skip} übersprungen  ${fail ? '❌ ' + fail + ' Fehler' : ''}`);
  }

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  ✅  AL-QURAN VOLLSTÄNDIG GENERIERT!    ║');
  console.log('║                                          ║');
  console.log('║  Öffne: AL-QURAN/cover.html             ║');
  console.log('╚══════════════════════════════════════════╝\n');
}

main().catch(err => {
  console.error('\n❌  Kritischer Fehler:', err.message);
  process.exit(1);
});
