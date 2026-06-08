'use strict';
/**
 * EXTRAS GENERATOR – Vorwort & Inhaltsverzeichnis
 * ─────────────────────────────────────────────────
 * Generiert sofort (ohne alle Suren zu laden):
 *   • vorwort.html
 *   • inhaltsverzeichnis.html
 *   • Patcht cover.html + Übersetzungen/index.html mit neuen Links
 *
 * Ausführung: node extras.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const BASE_DIR = __dirname;
const OUT_DIR  = path.join(BASE_DIR, 'Übersetzungen');

const TRANSLATIONS = [
  { name: 'Deutsch',     id: 27,  flag: '🇩🇪', country: 'Deutschland', scholar: 'Frank Bubenheim &amp; Nadeem' },
  { name: 'Englisch',    id: 20,  flag: '🇬🇧', country: 'England',      scholar: 'Saheeh International' },
  { name: 'Türkisch',    id: 77,  flag: '🇹🇷', country: 'Türkei',       scholar: 'Diyanet İşleri Başkanlığı' },
  { name: 'Indonesisch', id: 33,  flag: '🇮🇩', country: 'Indonesien',   scholar: 'Kementerian Agama RI' },
  { name: 'Urdu',        id: 97,  flag: '🇵🇰', country: 'Pakistan',     scholar: 'Sayyid Abul Ala Maududi' },
  { name: 'Persisch',    id: 135, flag: '🇮🇷', country: 'Iran',         scholar: 'IslamHouse.com' },
  { name: 'Russisch',    id: 45,  flag: '🇷🇺', country: 'Russland',     scholar: 'Elmir Kuliev' },
  { name: 'Bengalisch',  id: 161, flag: '🇧🇩', country: 'Bangladesch',  scholar: 'Taisirul Quran (Tawheed Publication)' },
  { name: 'Hindi',       id: 122, flag: '🇮🇳', country: 'Indien',       scholar: 'Maulana Azizul Haque al-Umari' },
  { name: 'Hausa',       id: 32,  flag: '🇳🇬', country: 'Nigeria',      scholar: 'Abubakar Mahmoud Gumi' },
  { name: 'Spanisch',    id: 83,  flag: '🇪🇸', country: 'Spanien',      scholar: 'Sheikh Isa Garcia' },
  { name: 'Französisch', id: 31,  flag: '🇫🇷', country: 'Frankreich',   scholar: 'Muhammad Hamidullah' },
  { name: 'Tagalog',     id: 211, flag: '🇵🇭', country: 'Philippinen',  scholar: 'Dar Al-Salam Center' },
  { name: 'Chinesisch',  id: 56,  flag: '🇨🇳', country: 'China',        scholar: 'Ma Jian (Fahd Complex)' },
  { name: 'Thailändisch', id: 51, flag: '🇹🇭', country: 'Thailand',     scholar: 'King Fahad Quran Complex' },
  { name: 'Kasachisch',  id: 222, flag: '🇰🇿', country: 'Kasachstan',   scholar: 'Khalifa Altay' },
];

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'AL-QURAN-Extras/1.0' } }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

async function fetchChapters() {
  console.log('📖  Lade Suren-Metadaten...');
  const d = await apiGet('https://api.quran.com/api/v4/chapters?language=de');
  return d.chapters;
}

// ── CSS HELPER ──────────────────────────────────────────────
const CSS_VARS = `:root{--gold:#C9A84C;--gold-dark:#8B6914;--gold-light:#F0D080;--green-deep:#0D2818;--green:#1A472A;--green-mid:#2D6A4F;--cream:#FDF8EC;--parchment:#F5EDD6;--text:#1A0A00;}`;
const CSS_NAV  = `.nav-bar{background:var(--green);padding:10px 28px;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;gap:18px;align-items:center;flex-wrap:wrap;}.nav-bar a{color:var(--gold);text-decoration:none;font-size:.82rem;opacity:.85;transition:opacity .15s;}.nav-bar a:hover{opacity:1;text-decoration:underline;}.nav-bar .home{font-weight:700;}`;
const CSS_HDR  = `header{background:linear-gradient(145deg,var(--green-deep),var(--green));padding:52px 30px 38px;text-align:center;border-bottom:4px solid var(--gold);position:relative;overflow:hidden;}header::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px),repeating-linear-gradient(-45deg,transparent,transparent 24px,rgba(201,168,76,.04) 24px,rgba(201,168,76,.04) 25px);pointer-events:none;}`;
const CSS_FTR  = `footer{background:var(--green-deep);border-top:3px solid var(--gold);padding:22px 30px;text-align:center;color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.35rem;}footer .sm{font-family:'Noto Serif',serif;font-size:.72rem;color:rgba(201,168,76,.45);margin-top:7px;}`;

// ── VORWORT ─────────────────────────────────────────────────

function generateVorwort() {
  const langLinks = TRANSLATIONS.map(t =>
    `<a href="Übersetzungen/${t.name}/index.html" class="lang-item">` +
    `<span class="fl">${t.flag}</span>` +
    `<span><span class="ln">${t.name}</span><br><span class="lc">${t.country}</span></span></a>`
  ).join('\n        ');

  const scholarLines = TRANSLATIONS.map(t =>
    `<p class="sc-row">${t.flag} <strong>${t.name}</strong> — ${t.scholar}</p>`
  ).join('\n        ');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN – Vorwort</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    ${CSS_VARS}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;color:var(--text);}
    ${CSS_NAV}
    ${CSS_HDR}
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
    .fl{font-size:1.6rem;} .ln{font-size:.86rem;font-weight:700;color:var(--green);} .lc{font-size:.68rem;color:#888;margin-top:2px;}
    .scholars-box{background:white;border:1px solid rgba(201,168,76,.18);border-radius:4px;padding:26px 32px;box-shadow:0 2px 10px rgba(201,168,76,.06);}
    .scholars-box .intro{margin-bottom:16px;font-size:.95rem;line-height:1.9;}
    .sc-row{font-size:.88rem;line-height:1.9;padding:4px 0;border-bottom:1px solid rgba(201,168,76,.1);}
    .sc-row:last-child{border-bottom:none;}
    ${CSS_FTR}
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
        Der arabische Text liegt in der <strong>Uthmani-Schrift</strong> vor.
        Die Übersetzungen stammen von folgenden anerkannten Gelehrten:</p>
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

// ── INHALTSVERZEICHNIS ───────────────────────────────────────

function generateInhaltsverzeichnis(chapters) {
  const rows = chapters.map(c => {
    const tn = c.translated_name ? c.translated_name.name : '';
    const isMakki = c.revelation_place === 'makkah';
    return `      <tr>
        <td class="td-num">${c.id}</td>
        <td class="td-ar">${c.name_arabic}</td>
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
    ${CSS_VARS}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--cream);font-family:'Noto Serif',serif;color:var(--text);}
    ${CSS_NAV}
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
    .fl{font-size:1.5rem;} .ln{font-size:.86rem;font-weight:700;color:var(--green);} .lc{font-size:.68rem;color:#888;margin-top:2px;}
    .sura-table{width:100%;border-collapse:collapse;background:white;box-shadow:0 2px 12px rgba(201,168,76,.08);border-radius:4px;overflow:hidden;}
    .sura-table thead{background:var(--green);color:var(--gold);}
    .sura-table th{padding:10px 12px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;text-align:left;border-bottom:2px solid var(--gold);}
    .sura-table tbody tr{border-bottom:1px solid rgba(201,168,76,.12);}
    .sura-table tbody tr:nth-child(odd){background:var(--cream);}
    .sura-table tbody tr:nth-child(even){background:white;}
    .sura-table tbody tr:hover{background:var(--parchment);}
    .td-num{width:48px;font-size:.8rem;color:var(--gold-dark);font-weight:700;text-align:center;padding:8px 6px;}
    .td-ar{width:130px;padding:8px 10px;text-align:right;font-family:'Scheherazade New',serif;font-size:1.2rem;direction:rtl;}
    .td-name{padding:8px 12px;font-size:.88rem;}
    .td-name small{color:#888;font-size:.72rem;}
    .td-v{width:58px;padding:8px;text-align:center;font-size:.8rem;color:#555;}
    .td-r{width:72px;padding:6px 8px;text-align:center;font-size:.68rem;letter-spacing:.05em;font-weight:600;border-radius:3px;}
    .td-m{color:#7A4100;background:rgba(200,120,20,.1);}
    .td-med{color:#1A472A;background:rgba(26,71,42,.1);}
    ${CSS_FTR}
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

// ── COVER & INDEX PATCHEN ────────────────────────────────────

function patchCover() {
  const file = path.join(BASE_DIR, 'cover.html');
  if (!fs.existsSync(file)) { console.log('  ⚠  cover.html nicht gefunden – wird beim nächsten Build erstellt'); return; }
  let html = fs.readFileSync(file, 'utf8');
  // Nur patchen wenn noch nicht gepatcht
  if (html.includes('vorwort.html')) { console.log('  ⏭  cover.html bereits gepatcht'); return; }
  html = html.replace(
    '<a href="Übersetzungen/index.html" class="enter">Zum Inhalt ❯</a>',
    '<div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin-top:14px;">' +
    '<a href="vorwort.html" class="enter" style="font-size:.72rem;padding:7px 16px;margin-top:0;">📜 Vorwort</a>' +
    '<a href="inhaltsverzeichnis.html" class="enter" style="font-size:.72rem;padding:7px 16px;margin-top:0;">📋 Inhalt</a>' +
    '</div><a href="Übersetzungen/index.html" class="enter" style="margin-top:10px;">Zum Inhalt ❯</a>'
  );
  fs.writeFileSync(file, html, 'utf8');
  console.log('  ✅  cover.html gepatcht');
}

function patchMainIndex() {
  const file = path.join(OUT_DIR, 'index.html');
  if (!fs.existsSync(file)) { console.log('  ⚠  Übersetzungen/index.html nicht gefunden – wird beim nächsten Build erstellt'); return; }
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('vorwort.html')) { console.log('  ⏭  Übersetzungen/index.html bereits gepatcht'); return; }
  html = html.replace(
    '<a href="../cover.html">📖 Cover</a>\n      <a href="../back-cover.html">📕 Rückseite</a>',
    '<a href="../cover.html">📖 Cover</a>\n      <a href="../vorwort.html">📜 Vorwort</a>\n      <a href="../inhaltsverzeichnis.html">📋 Inhalt</a>\n      <a href="../back-cover.html">📕 Rückseite</a>'
  );
  fs.writeFileSync(file, html, 'utf8');
  console.log('  ✅  Übersetzungen/index.html gepatcht');
}

// ── MAIN ────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   EXTRAS: Vorwort & Inhaltsverzeichnis  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const chapters = await fetchChapters();
  console.log(`✅  ${chapters.length} Suren geladen\n`);

  console.log('📜  Generiere vorwort.html...');
  fs.writeFileSync(path.join(BASE_DIR, 'vorwort.html'), generateVorwort(), 'utf8');
  console.log('✅  vorwort.html erstellt\n');

  console.log('📋  Generiere inhaltsverzeichnis.html...');
  fs.writeFileSync(path.join(BASE_DIR, 'inhaltsverzeichnis.html'), generateInhaltsverzeichnis(chapters), 'utf8');
  console.log('✅  inhaltsverzeichnis.html erstellt\n');

  console.log('🔗  Patche bestehende Seiten...');
  patchCover();
  patchMainIndex();

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  ✅  FERTIG!                             ║');
  console.log('║                                          ║');
  console.log('║  Öffne: AL-QURAN\\vorwort.html           ║');
  console.log('║         AL-QURAN\\inhaltsverzeichnis.html║');
  console.log('╚══════════════════════════════════════════╝\n');
}

main().catch(err => { console.error('❌  Fehler:', err.message); process.exit(1); });
