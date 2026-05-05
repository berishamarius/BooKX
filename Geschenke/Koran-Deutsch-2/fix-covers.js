'use strict';
/**
 * Patcht das Haupt-Cover (Badges + Buttons weg, sauber wie ein Buch)
 * und erstellt für jede Sprache ein eigenes Buchcover.
 *
 * node fix-covers.js
 */

const fs   = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const OUT_DIR  = path.join(BASE_DIR, 'Übersetzungen');

const TRANSLATIONS = [
  { name: 'Deutsch',     lang: 'de', dir: 'ltr', flag: '🇩🇪', country: 'Deutschland',  titleNative: 'Der edle Quran',             subtitle: 'Übersetzung von Frank Bubenheim & Nadeem' },
  { name: 'Englisch',    lang: 'en', dir: 'ltr', flag: '🇬🇧', country: 'England',       titleNative: 'The Noble Quran',             subtitle: 'Translation by Saheeh International' },
  { name: 'Türkisch',    lang: 'tr', dir: 'ltr', flag: '🇹🇷', country: 'Türkiye',       titleNative: 'Yüce Kur\'an',               subtitle: 'Çeviri: Diyanet İşleri Başkanlığı' },
  { name: 'Indonesisch', lang: 'id', dir: 'ltr', flag: '🇮🇩', country: 'Indonesia',     titleNative: 'Al-Quran Al-Karim',           subtitle: 'Terjemahan: Kementerian Agama RI' },
  { name: 'Urdu',        lang: 'ur', dir: 'rtl', flag: '🇵🇰', country: 'Pakistan',      titleNative: 'قرآن مجید',                  subtitle: 'ترجمہ: مولانا مودودی' },
  { name: 'Persisch',    lang: 'fa', dir: 'rtl', flag: '🇮🇷', country: 'Iran',          titleNative: 'قرآن کریم',                  subtitle: 'ترجمه: IslamHouse.com' },
  { name: 'Russisch',    lang: 'ru', dir: 'ltr', flag: '🇷🇺', country: 'Россия',        titleNative: 'Благородный Коран',           subtitle: 'Перевод: Эльмир Кулиев' },
  { name: 'Bengalisch',  lang: 'bn', dir: 'ltr', flag: '🇧🇩', country: 'বাংলাদেশ',    titleNative: 'আল-কুরআন আল-কারীম',         subtitle: 'অনুবাদ: Taisirul Quran' },
  { name: 'Hindi',       lang: 'hi', dir: 'ltr', flag: '🇮🇳', country: 'भारत',         titleNative: 'अल-क़ुरआन अल-करीम',         subtitle: 'अनुवाद: मौलाना अज़ीज़ुल हक़ उमरी' },
  { name: 'Hausa',       lang: 'ha', dir: 'ltr', flag: '🇳🇬', country: 'Nigeria',       titleNative: 'Al-Qur\'ani Mai Girma',       subtitle: 'Fassara: Abubakar Mahmoud Gumi' },
];

// ── HAUPT-COVER PATCHEN ─────────────────────────────────────

function patchMainCover() {
  const file = path.join(BASE_DIR, 'cover.html');
  if (!fs.existsSync(file)) { console.log('  ⚠  cover.html nicht gefunden'); return; }

  // Neu schreiben – komplett sauber, kein Badge-Müll
  const html = `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN AL-KARIM</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;min-height:100%;}
    body{background:#060f0a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Noto Serif',serif;}

    .cover{
      width:min(560px,92vw);
      aspect-ratio:2/3;
      background:linear-gradient(175deg,#0A1F12 0%,#1A472A 45%,#0D2818 100%);
      border:6px solid #C9A84C;
      outline:2px solid #8B6914;
      outline-offset:-13px;
      position:relative;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      overflow:hidden;
      box-shadow:0 0 0 12px #060f0a,0 0 0 15px #C9A84C,0 30px 80px rgba(0,0,0,.85);
    }
    .cover::before{
      content:'';position:absolute;inset:0;
      background-image:
        repeating-linear-gradient(0deg,  transparent,transparent 34px,rgba(201,168,76,.042) 34px,rgba(201,168,76,.042) 35px),
        repeating-linear-gradient(90deg, transparent,transparent 34px,rgba(201,168,76,.042) 34px,rgba(201,168,76,.042) 35px),
        repeating-linear-gradient(45deg, transparent,transparent 48px,rgba(201,168,76,.026) 48px,rgba(201,168,76,.026) 49px),
        repeating-linear-gradient(-45deg,transparent,transparent 48px,rgba(201,168,76,.026) 48px,rgba(201,168,76,.026) 49px);
      pointer-events:none;
    }
    .orn{position:absolute;left:50%;transform:translateX(-50%);color:rgba(201,168,76,.45);font-family:'Scheherazade New',serif;font-size:1.25rem;letter-spacing:.5em;white-space:nowrap;}
    .orn-t{top:22px;} .orn-b{bottom:22px;}

    .inner{
      border:1.5px solid rgba(201,168,76,.32);
      padding:42px 28px;
      width:78%;
      text-align:center;
      position:relative;
    }
    .inner::before{content:'';position:absolute;top:-9px;left:-9px;right:-9px;bottom:-9px;border:1px solid rgba(201,168,76,.13);}

    .deco{color:#C9A84C;font-size:1.1rem;letter-spacing:.55em;margin-bottom:20px;font-family:'Scheherazade New',serif;}
    .bismi{font-family:'Scheherazade New',serif;font-size:1.55rem;color:#F0D080;direction:rtl;line-height:1.9;margin-bottom:30px;text-shadow:0 2px 12px rgba(0,0,0,.6);}
    .title-ar{font-family:'Scheherazade New',serif;font-size:4.4rem;color:#C9A84C;direction:rtl;line-height:1.22;text-shadow:0 4px 20px rgba(0,0,0,.55),0 0 50px rgba(201,168,76,.2);}
    .divider{width:60%;height:1px;background:linear-gradient(to right,transparent,#C9A84C,transparent);margin:22px auto;}
    .title-latin{color:#F0D080;font-size:.95rem;letter-spacing:.3em;text-transform:uppercase;}
    .stats{color:rgba(201,168,76,.45);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;}
    .btn{
      display:inline-block;margin-top:26px;
      padding:12px 36px;
      background:rgba(201,168,76,.1);
      border:1px solid rgba(201,168,76,.5);
      color:#C9A84C;text-decoration:none;
      border-radius:3px;font-size:.84rem;letter-spacing:.12em;
      transition:background .2s,box-shadow .2s;
    }
    .btn:hover{background:rgba(201,168,76,.26);box-shadow:0 0 18px rgba(201,168,76,.18);}
  </style>
</head>
<body>
  <div class="cover">
    <div class="orn orn-t">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="orn orn-b">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="inner">
      <div class="deco">❧ ✦ ❧</div>
      <div class="bismi">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
      <div class="title-ar">القرآن<br>الكريم</div>
      <div class="divider"></div>
      <div class="title-latin">Al-Quran Al-Karim</div>
      <div class="stats">114 Suren · 6.236 Verse · 10 Sprachen</div>
      <a href="Übersetzungen/index.html" class="btn">Zur Sprachauswahl ❯</a>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(file, html, 'utf8');
  console.log('  ✅  cover.html → sauber (keine Badges, keine Buttons)');
}

// ── SPRACH-COVER ────────────────────────────────────────────

function generateLangCover(t) {
  const isRtl = t.dir === 'rtl';
  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AL-QURAN · ${t.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@400;700&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:100%;min-height:100%;}
    body{background:#060f0a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Noto Serif',serif;}

    .cover{
      width:min(560px,92vw);aspect-ratio:2/3;
      background:linear-gradient(175deg,#0A1F12 0%,#1A472A 45%,#0D2818 100%);
      border:6px solid #C9A84C;outline:2px solid #8B6914;outline-offset:-13px;
      position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
      overflow:hidden;
      box-shadow:0 0 0 12px #060f0a,0 0 0 15px #C9A84C,0 30px 80px rgba(0,0,0,.85);
    }
    .cover::before{content:'';position:absolute;inset:0;
      background-image:
        repeating-linear-gradient(0deg,  transparent,transparent 34px,rgba(201,168,76,.04) 34px,rgba(201,168,76,.04) 35px),
        repeating-linear-gradient(90deg, transparent,transparent 34px,rgba(201,168,76,.04) 34px,rgba(201,168,76,.04) 35px),
        repeating-linear-gradient(45deg, transparent,transparent 48px,rgba(201,168,76,.025) 48px,rgba(201,168,76,.025) 49px),
        repeating-linear-gradient(-45deg,transparent,transparent 48px,rgba(201,168,76,.025) 48px,rgba(201,168,76,.025) 49px);
      pointer-events:none;}
    .orn{position:absolute;left:50%;transform:translateX(-50%);color:rgba(201,168,76,.42);font-family:'Scheherazade New',serif;font-size:1.2rem;letter-spacing:.5em;white-space:nowrap;}
    .orn-t{top:22px;} .orn-b{bottom:22px;}

    .inner{border:1.5px solid rgba(201,168,76,.32);padding:36px 28px;width:78%;text-align:center;position:relative;}
    .inner::before{content:'';position:absolute;top:-9px;left:-9px;right:-9px;bottom:-9px;border:1px solid rgba(201,168,76,.13);}

    .flag{font-size:2.6rem;margin-bottom:14px;display:block;}
    .ar-title{font-family:'Scheherazade New',serif;font-size:3.8rem;color:#C9A84C;direction:rtl;line-height:1.25;text-shadow:0 4px 20px rgba(0,0,0,.55),0 0 45px rgba(201,168,76,.2);margin-bottom:6px;}
    .bismi{font-family:'Scheherazade New',serif;font-size:1.25rem;color:rgba(240,208,128,.7);direction:rtl;line-height:1.9;margin-bottom:20px;}
    .divider{width:60%;height:1px;background:linear-gradient(to right,transparent,#C9A84C,transparent);margin:16px auto;}
    .lang-name{font-size:1.6rem;font-weight:700;color:#F0D080;letter-spacing:.08em;font-family:'Noto Sans',sans-serif;}
    .native-title{font-size:${isRtl ? '1.15rem' : '.95rem'};color:#C9A84C;margin-top:8px;direction:${t.dir};font-family:'Noto Sans',sans-serif;}
    .scholar{font-size:.68rem;color:rgba(201,168,76,.48);margin-top:7px;letter-spacing:.04em;direction:ltr;}
    .stats{color:rgba(201,168,76,.35);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;margin-top:6px;}
    .btn{display:inline-block;margin-top:22px;padding:11px 32px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.48);color:#C9A84C;text-decoration:none;border-radius:3px;font-size:.82rem;letter-spacing:.1em;transition:background .2s;}
    .btn:hover{background:rgba(201,168,76,.25);}
    .nav-back{position:absolute;bottom:52px;font-size:.65rem;color:rgba(201,168,76,.38);text-decoration:none;letter-spacing:.08em;transition:color .2s;}
    .nav-back:hover{color:rgba(201,168,76,.7);}
  </style>
</head>
<body>
  <div class="cover">
    <div class="orn orn-t">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="orn orn-b">﴾ ❋ ❋ ❋ ﴿</div>
    <div class="inner">
      <span class="flag">${t.flag}</span>
      <div class="bismi">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
      <div class="ar-title">القرآن<br>الكريم</div>
      <div class="divider"></div>
      <div class="lang-name">${t.name}</div>
      <div class="native-title">${t.titleNative}</div>
      <div class="scholar">${t.subtitle}</div>
      <div class="stats">114 Suren · 6.236 Verse</div>
      <a href="index.html" class="btn">Zu den Suren ❯</a>
    </div>
    <a href="../../cover.html" class="nav-back">← AL-QURAN Hauptseite</a>
  </div>
</body>
</html>`;
}

// ── SPRACH-INDEX: Vorwort/Inhalt-Buttons entfernen ───────────
// (Navigationsleiste der index.html bleibt, aber keine extra Buttons auf Cover)

// ── HAUPT-ÜBERSETZUNGSINDEX PATCHEN ─────────────────────────
function patchMainIndex() {
  const file = path.join(OUT_DIR, 'index.html');
  if (!fs.existsSync(file)) { console.log('  ⚠  index.html nicht gefunden'); return; }
  let html = fs.readFileSync(file, 'utf8');

  // Sprach-Karten so patchen, dass sie auf den neuen cover.html verlinken
  // cover.html ist jetzt in jedem Sprachordner
  TRANSLATIONS.forEach(t => {
    const oldHref = `href="${t.name}/index.html"`;
    const newHref = `href="${t.name}/cover.html"`;
    if (html.includes(oldHref)) {
      html = html.replaceAll(oldHref, newHref);
    }
  });

  // Vorwort/Inhalt-Links aus den cover-btns entfernen
  html = html.replace(
    /<a href="\.\.\/vorwort\.html">.*?<\/a>\s*/g, ''
  ).replace(
    /<a href="\.\.\/inhaltsverzeichnis\.html">.*?<\/a>\s*/g, ''
  );

  fs.writeFileSync(file, html, 'utf8');
  console.log('  ✅  Übersetzungen/index.html → Karten verlinken auf Sprach-Cover');
}

// ── MAIN ────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   COVER-FIX: Sauber wie echte Bücher   ║');
  console.log('╚══════════════════════════════════════════╝\n');

  console.log('📖  Haupt-Cover bereinigen...');
  patchMainCover();

  console.log('\n🌍  Sprach-Cover generieren...');
  let ok = 0;
  for (const t of TRANSLATIONS) {
    const dir  = path.join(OUT_DIR, t.name);
    const file = path.join(dir, 'cover.html');
    if (!fs.existsSync(dir)) {
      console.log(`  ⚠  ${t.name}: Ordner fehlt (Build noch nicht fertig?)`);
      continue;
    }
    fs.writeFileSync(file, generateLangCover(t), 'utf8');
    console.log(`  ✅  ${t.flag} ${t.name}/cover.html`);
    ok++;
  }

  console.log('\n🔗  Übersetzungsindex patchen...');
  patchMainIndex();

  console.log('\n╔══════════════════════════════════════════╗');
  console.log(`║  ✅  ${ok}/10 Sprach-Cover erstellt         ║`);
  console.log('║  Öffne: AL-QURAN\\cover.html             ║');
  console.log('╚══════════════════════════════════════════╝\n');
}

main();
