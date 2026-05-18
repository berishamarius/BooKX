/**
 * build-multilang.js
 * Copies all Quran/Bible language folders into their dist directories,
 * regenerates grid cover pages, generates Quranic dictionary pages,
 * and injects dictionary icons into all Quran sura files.
 */

const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const QURAN_SRC  = path.join(ROOT, 'AL-QURAN', 'Übersetzungen');
const QURAN_DIST = path.join(ROOT, 'dist-alquran', 'Übersetzungen');
const BIBLE_SRC  = path.join(ROOT, 'CATHOLIC-BIBLE', 'Übersetzungen');
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

// ─── helper: recursive copy ───────────────────────────────────────────────────
function copyRecursive(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dst, item);
    if (fs.statSync(s).isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ─── language definitions ─────────────────────────────────────────────────────
const QURAN_LANGS = [
  { de:'Albanisch',   native:'Shqip',             dir:'Albanisch',   lang:'sq', rtl:false },
  { de:'Bengalisch',  native:'বাংলা',              dir:'Bengalisch',  lang:'bn', rtl:false },
  { de:'Bosnisch',    native:'Bosanski',           dir:'Bosnisch',    lang:'bs', rtl:false },
  { de:'Chinesisch',  native:'中文',               dir:'Chinesisch',  lang:'zh', rtl:false },
  { de:'Deutsch',     native:'Deutsch',            dir:'Deutsch',     lang:'de', rtl:false },
  { de:'Englisch',    native:'English',            dir:'Englisch',    lang:'en', rtl:false },
  { de:'Hausa',       native:'Hausa',              dir:'Hausa',       lang:'ha', rtl:false },
  { de:'Hindi',       native:'हिन्दी',             dir:'Hindi',       lang:'hi', rtl:false },
  { de:'Indonesisch', native:'Bahasa Indonesia',   dir:'Indonesisch', lang:'id', rtl:false },
  { de:'Persisch',    native:'فارسی',              dir:'Persisch',    lang:'fa', rtl:true  },
  { de:'Russisch',    native:'Русский',            dir:'Russisch',    lang:'ru', rtl:false },
  { de:'Türkisch',    native:'Türkçe',             dir:'Türkisch',    lang:'tr', rtl:false },
  { de:'Urdu',        native:'اردو',               dir:'Urdu',        lang:'ur', rtl:true  },
  { de:'Uygurisch',   native:'ئۇيغۇرچە',           dir:'Uygurisch',   lang:'ug', rtl:true  },
];

const BIBLE_LANGS = [
  { de:'Albanisch',        native:'Shqip',          dir:'albanian',  lang:'sq', link:'albanian/index.html'  },
  { de:'Kroatisch',        native:'Hrvatski',       dir:'croatian',  lang:'hr', link:'croatian/index.html'  },
  { de:'Tschechisch',      native:'Čeština',        dir:'czech',     lang:'cs', link:'czech/index.html'     },
  { de:'Deutsch',          native:'Deutsch',        dir:'german',    lang:'de', link:'german/index.html'    },
  { de:'Niederländisch',   native:'Nederlands',     dir:'dutch',     lang:'nl', link:'dutch/index.html'     },
  { de:'Englisch (KJV)',   native:'English',        dir:'kjv',       lang:'en', link:'kjv/index.html'       },
  { de:'Französisch',      native:'Français',       dir:'french',    lang:'fr', link:'french/index.html'    },
  { de:'Ungarisch',        native:'Magyar',         dir:'hungarian', lang:'hu', link:'hungarian/index.html' },
  { de:'Italienisch',      native:'Italiano',       dir:'italian',   lang:'it', link:'italian/index.html'   },
  { de:'Polnisch',         native:'Polski',         dir:'polish',    lang:'pl', link:'polish/index.html'    },
  { de:'Portugiesisch',    native:'Português',      dir:'portuguese',lang:'pt', link:'portuguese/index.html'},
  { de:'Rumänisch',        native:'Română',         dir:'romanian',  lang:'ro', link:'romanian/index.html'  },
  { de:'Russisch',         native:'Русский',        dir:'russian',   lang:'ru', link:'russian/index.html'   },
  { de:'Spanisch',         native:'Español',        dir:'spanish',   lang:'es', link:'spanish/index.html'   },
  { de:'Schwedisch',       native:'Svenska',        dir:'swedish',   lang:'sv', link:'swedish/index.html'   },
  { de:'Tagalog',          native:'Filipino',       dir:'tagalog',   lang:'tl', link:'tagalog/index.html'   },
  { de:'Ukrainisch',       native:'Українська',     dir:'ukrainian', lang:'uk', link:'ukrainian/index.html' },
];

// ─── 1. COPY QURAN LANGUAGES ──────────────────────────────────────────────────
console.log('\n[1] Kopiere Quran-Sprachen in dist-alquran...');
for (const l of QURAN_LANGS) {
  const src = path.join(QURAN_SRC, l.dir);
  const dst = path.join(QURAN_DIST, l.dir);
  if (!fs.existsSync(src)) { console.log(`  ⚠ Nicht gefunden: ${l.dir}`); continue; }
  copyRecursive(src, dst);
  console.log(`  ✓ ${l.de}`);
}

// ─── 2. COPY BIBLE LANGUAGES ──────────────────────────────────────────────────
console.log('\n[2] Kopiere Bibel-Sprachen in dist-diebibel...');
for (const l of BIBLE_LANGS) {
  if (l.dir === 'german') { console.log(`  ↩ ${l.de} (bereits vorhanden)`); continue; }
  const src = path.join(BIBLE_SRC, l.dir);
  const dst = path.join(BIBLE_DIST, l.dir);
  if (!fs.existsSync(src)) { console.log(`  ⚠ Nicht gefunden: ${l.dir}`); continue; }
  copyRecursive(src, dst);
  console.log(`  ✓ ${l.de}`);
}

// ─── 3. QURAN GRID COVER ─────────────────────────────────────────────────────
console.log('\n[3] Erstelle Quran Grid-Cover...');
function buildQuranTile(l) {
  const nativeDir = l.rtl ? 'dir="rtl"' : '';
  return `    <a class="tile" href="Übersetzungen/${l.dir}/intro.html">
      <div class="cover-wrap">
        <img src="Cover.png" alt="${l.de}">
        <div class="tile-dict" title="Wörterbuch" onclick="event.preventDefault();event.stopPropagation();window.location='Übersetzungen/${l.dir}/woerterbuch.html'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/></svg>
        </div>
      </div>
      <span class="tile-native" ${nativeDir}>${l.native}</span>
      <span class="tile-de">${l.de}</span>
    </a>`;
}
const quranTiles = QURAN_LANGS.map(buildQuranTile).join('\n');
const quranCover = `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · Alle Sprachen</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='56' font-family='serif' fill='%238a5800'>&#x06DE;</text></svg>">
<meta name="theme-color" content="#0f2f1a">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100svh;background:#0b2414;color:#f0e6c0;font-family:'Noto Serif',Georgia,serif;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:12px;background:#0f3a26 url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PHBvbHlnb24gcG9pbnRzPSI3LjAwLDAuODQgNy45Niw0LjY3IDExLjM2LDIuNjQgOS4zMyw2LjA0IDEzLjE2LDcuMDAgOS4zMyw3Ljk2IDExLjM2LDExLjM2IDcuOTYsOS4zMyA3LjAwLDEzLjE2IDYuMDQsOS4zMyAyLjY0LDExLjM2IDQuNjcsNy45NiAwLjg0LDcuMDAgNC42Nyw2LjA0IDIuNjQsMi42NCA2LjA0LDQuNjciIGZpbGw9InJnYmEoMTkyLDE1NSw2MCwwLjQ4KSIvPjwvc3ZnPg==") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(201,168,76,.28);}
.frame-bot{bottom:0;border-top:1px solid rgba(201,168,76,.28);}
header{padding:48px 24px 28px;text-align:center;position:relative;z-index:1;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:3.2rem;color:#c9a84c;direction:rtl;display:block;line-height:1.3;}
.ttl-de{font-size:.75rem;letter-spacing:.22em;color:rgba(192,155,60,.55);text-transform:uppercase;display:block;margin-top:10px;}
.rule{width:120px;height:1px;background:linear-gradient(to right,transparent,rgba(192,155,60,.4),transparent);margin:18px auto 0;}
.grid{display:flex;flex-wrap:wrap;justify-content:center;gap:20px;padding:16px 28px 80px;max-width:1100px;margin:0 auto;position:relative;z-index:1;}
.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:130px;transition:transform .2s;}
.tile:hover{transform:translateY(-4px);}
.cover-wrap{position:relative;width:100%;border:1px solid rgba(192,155,60,.25);box-shadow:0 8px 20px rgba(0,0,0,.45);background:#0f2f1a;}
.cover-wrap img{width:100%;height:auto;display:block;}
.tile-dict{position:absolute;top:6px;right:6px;width:28px;height:28px;background:rgba(15,47,26,.88);border:1px solid rgba(192,155,60,.35);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#c9a84c;cursor:pointer;transition:background .2s,border-color .2s;z-index:5;}
.tile-dict:hover{background:rgba(192,155,60,.15);border-color:#c9a84c;}
.tile-dict svg{width:14px;height:14px;}
.tile-native{margin-top:8px;font-size:.85rem;color:#f0e6c0;text-align:center;line-height:1.4;}
.tile-de{font-size:.62rem;color:rgba(192,155,60,.55);text-align:center;margin-top:2px;letter-spacing:.06em;}
</style>
</head><body>
<div class="frame-top"></div>
<div class="frame-bot"></div>
<header>
  <span class="ttl-ar">القرآن الكريم</span>
  <span class="ttl-de">AL-QURAN · Alle Sprachen</span>
  <div class="rule"></div>
</header>
<div class="grid">
${quranTiles}
</div>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'dist-alquran', 'cover.html'), quranCover, 'utf8');
console.log('  ✓ dist-alquran/cover.html erstellt');

// ─── 4. BIBLE GRID COVER ─────────────────────────────────────────────────────
console.log('\n[4] Erstelle Bibel Grid-Cover...');
function buildBibleTile(l) {
  return `    <a class="tile" href="${l.link}">
      <div class="cover-wrap">
        <img src="Die%20Heilige%20Bibel%20-%20Rot.png" alt="${l.de}">
      </div>
      <span class="tile-native">${l.native}</span>
      <span class="tile-de">${l.de}</span>
    </a>`;
}
const bibleTiles = BIBLE_LANGS.map(buildBibleTile).join('\n');
const bibleCover = `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Holy Bible · All Languages</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M32,4V60M12,18H52' stroke='%23C8A030' stroke-width='8' fill='none' stroke-linecap='square'/></svg>">
<meta name="theme-color" content="#2a0810">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100svh;background:#1a0508;color:#f0dece;font-family:'EB Garamond',Georgia,serif;}
.corner{position:fixed;width:52px;height:52px;pointer-events:none;z-index:6;}
.c-tl{top:12px;left:12px;border-top:2px solid rgba(200,160,48,.45);border-left:2px solid rgba(200,160,48,.45);}
.c-tr{top:12px;right:12px;border-top:2px solid rgba(200,160,48,.45);border-right:2px solid rgba(200,160,48,.45);}
.c-bl{bottom:12px;left:12px;border-bottom:2px solid rgba(200,160,48,.45);border-left:2px solid rgba(200,160,48,.45);}
.c-br{bottom:12px;right:12px;border-bottom:2px solid rgba(200,160,48,.45);border-right:2px solid rgba(200,160,48,.45);}
header{padding:52px 24px 28px;text-align:center;position:relative;z-index:1;}
.ttl{font-family:'Cinzel',serif;font-size:1.9rem;font-weight:400;color:#C8A030;letter-spacing:.18em;display:block;}
.ttl-sub{font-size:.7rem;letter-spacing:.25em;color:rgba(200,160,48,.45);text-transform:uppercase;display:block;margin-top:10px;}
.rule{width:120px;height:1px;background:linear-gradient(to right,transparent,rgba(200,160,48,.4),transparent);margin:20px auto 0;}
.grid{display:flex;flex-wrap:wrap;justify-content:center;gap:20px;padding:16px 28px 80px;max-width:1100px;margin:0 auto;position:relative;z-index:1;}
.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:120px;transition:transform .2s;}
.tile:hover{transform:translateY(-4px);}
.cover-wrap{width:100%;border:1px solid rgba(200,160,48,.2);box-shadow:0 8px 20px rgba(0,0,0,.55);background:#2a0810;}
.cover-wrap img{width:100%;height:auto;display:block;}
.tile-native{margin-top:8px;font-size:.85rem;color:#f0dece;text-align:center;line-height:1.4;}
.tile-de{font-size:.62rem;color:rgba(200,160,48,.5);text-align:center;margin-top:2px;letter-spacing:.06em;}
</style>
</head><body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<header>
  <span class="ttl">The Holy Bible</span>
  <span class="ttl-sub">All Languages</span>
  <div class="rule"></div>
</header>
<div class="grid">
${bibleTiles}
</div>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'dist-diebibel', 'cover.html'), bibleCover, 'utf8');
console.log('  ✓ dist-diebibel/cover.html erstellt');

// ─── 5. QURAN WÖRTERBUCH PAGES ────────────────────────────────────────────────
console.log('\n[5] Erstelle Wörterbuch-Seiten...');

// Copyright-freie koranische Grundvokabeln
// Arabic words = Quran (kein Copyright), Übersetzungen = eigene/gemeinfreie religiöse Standardbegriffe
const WORDS = [
  // ar, trl, {sq,bn,bs,zh,de,en,ha,hi,id,fa,ru,tr,ur,ug}
  ['اللَّه','Allāh',{sq:'Allah/Zoti',bn:'আল্লাহ',bs:'Allah',zh:'安拉/真主',de:'Allah/Gott',en:'Allah/God',ha:'Allah',hi:'अल्लाह',id:'Allah',fa:'الله/خدا',ru:'Аллах',tr:'Allah',ur:'اللہ',ug:'ئاللاھ'}],
  ['رَبّ','Rabb',{sq:'Zot/Kujdestar',bn:'রব/প্রভু',bs:'Gospodar',zh:'主',de:'Herr/Erhalter',en:'Lord',ha:'Ubangiji',hi:'रब/प्रभु',id:'Tuhan/Rabb',fa:'پروردگار',ru:'Господь',tr:'Rab',ur:'رب',ug:'رەب'}],
  ['الرَّحْمَن','Ar-Raḥmān',{sq:'Mëshirëbëri',bn:'রহমান',bs:'Svemilosrdni',zh:'至仁者',de:'Der Allerbarmer',en:'The Most Merciful',ha:'Mai rahama',hi:'रहमान',id:'Yang Maha Pengasih',fa:'رحمان',ru:'Всемилостивый',tr:'Rahman',ur:'رحمٰن',ug:'رەھمان'}],
  ['الرَّحِيم','Ar-Raḥīm',{sq:'Mëshirësi',bn:'রহিম',bs:'Samilosrdni',zh:'至慈者',de:'Der Gnädige',en:'The Most Compassionate',ha:'Mai jin kai',hi:'रहीम',id:'Yang Maha Penyayang',fa:'رحیم',ru:'Милосердный',tr:'Rahim',ur:'رحیم',ug:'رەھىم'}],
  ['المَلِك','Al-Malik',{sq:'Mbreti',bn:'রাজাধিরাজ',bs:'Vladar',zh:'君主',de:'Der König',en:'The King/Sovereign',ha:'Sarki',hi:'राजाधिराज',id:'Maha Raja',fa:'مالک',ru:'Царь',tr:'Melik',ur:'مالک',ug:'مەلىك'}],
  ['القُدُّوس','Al-Quddūs',{sq:'I Shenjtë',bn:'পবিত্র',bs:'Presveti',zh:'至圣者',de:'Der Heilige',en:'The Most Holy',ha:'Mai tsarki',hi:'पवित्र',id:'Yang Maha Suci',fa:'قدوس',ru:'Пресвятой',tr:'Kuddüs',ur:'قدوس',ug:'قۇددۇس'}],
  ['السَّلَام','As-Salām',{sq:'Paqja',bn:'শান্তি',bs:'Mir',zh:'和平',de:'Frieden/Der Friedensstifter',en:'Peace/The Source of Peace',ha:'Salama',hi:'शांति',id:'Damai',fa:'سلام',ru:'Мир',tr:'Selam',ur:'سلام',ug:'سالام'}],
  ['المُؤْمِن','Al-Muʾmin',{sq:'Besimtari/Besëdhënësi',bn:'বিশ্বাসী',bs:'Darovatelj vjere',zh:'信者',de:'Der Schutzgewährer',en:'The Granter of Security',ha:'Mai imani',hi:'विश्वासी',id:'Pemberi Keamanan',fa:'مومن',ru:'Дарующий безопасность',tr:'Mü\'min',ur:'مومن',ug:'مۇمىن'}],
  ['العَزِيز','Al-ʿAzīz',{sq:'I Fuqishmi',bn:'পরাক্রমশালী',bs:'Svemogući',zh:'全能者',de:'Der Mächtige',en:'The Almighty',ha:'Mai iko',hi:'सर्वशक्तिमान',id:'Yang Maha Perkasa',fa:'عزیز',ru:'Всемогущий',tr:'Aziz',ur:'عزیز',ug:'ئەزىز'}],
  ['الحَكِيم','Al-Ḥakīm',{sq:'I Urti',bn:'প্রজ্ঞাবান',bs:'Svemudri',zh:'至睿者',de:'Der Allweise',en:'The All-Wise',ha:'Mai hikima',hi:'परम-ज्ञानी',id:'Yang Maha Bijaksana',fa:'حکیم',ru:'Всемудрый',tr:'Hakim',ur:'حکیم',ug:'ھەكىم'}],
  ['الغَفُور','Al-Ghafūr',{sq:'Falësi i madh',bn:'ক্ষমাশীল',bs:'Oprosnik',zh:'至恕者',de:'Der Allvergebende',en:'The Most Forgiving',ha:'Mai gafara',hi:'क्षमाशील',id:'Yang Maha Pengampun',fa:'غفور',ru:'Всепрощающий',tr:'Gafur',ur:'غفور',ug:'غەفۇر'}],
  ['الرَّحِيم','Ar-Raḥīm',{sq:'Mëshirësi',bn:'দয়ালু',bs:'Milosrdni',zh:'仁慈者',de:'Der Barmherzige',en:'The Compassionate',ha:'Mai rahama',hi:'दयालु',id:'Penyayang',fa:'رحیم',ru:'Милосердный',tr:'Rahim',ur:'رحیم',ug:'رەھىم'}],
  ['العَلِيم','Al-ʿAlīm',{sq:'Gjithëdijshmi',bn:'সর্বজ্ঞ',bs:'Sveznajući',zh:'全知者',de:'Der Allwissende',en:'The All-Knowing',ha:'Masani kome',hi:'सर्वज्ञ',id:'Yang Maha Mengetahui',fa:'علیم',ru:'Всезнающий',tr:'Alim',ur:'علیم',ug:'ئالىم'}],
  ['القَدِير','Al-Qadīr',{sq:'I Plotfuqishmi',bn:'সর্বশক্তিমান',bs:'Svemoćni',zh:'全能者',de:'Der Allvermögende',en:'The All-Powerful',ha:'Mai iko duka',hi:'सर्वशक्तिमान',id:'Yang Maha Kuasa',fa:'قدیر',ru:'Всесильный',tr:'Kadir',ur:'قدیر',ug:'قادىر'}],
  ['السَّمِيع','As-Samīʿ',{sq:'Gjithëdëgjuesi',bn:'সর্বশ্রোতা',bs:'Svečujući',zh:'全听者',de:'Der Allhörende',en:'The All-Hearing',ha:'Mai ji kome',hi:'सर्वश्रोता',id:'Yang Maha Mendengar',fa:'سمیع',ru:'Всеслышащий',tr:'Semi',ur:'سمیع',ug:'سەمىئ'}],
  ['البَصِير','Al-Baṣīr',{sq:'Gjithëshikuesi',bn:'সর্বদ্রষ্টা',bs:'Svevidni',zh:'全视者',de:'Der Allsehende',en:'The All-Seeing',ha:'Mai gani kome',hi:'सर्वदृष्टा',id:'Yang Maha Melihat',fa:'بصیر',ru:'Всевидящий',tr:'Basir',ur:'بصیر',ug:'بەسىر'}],
  ['اللَّطِيف','Al-Laṭīf',{sq:'I Butë',bn:'সূক্ষ্মজ্ঞ',bs:'Blagi',zh:'至善者',de:'Der Sanfte/Feinfühlige',en:'The Subtle',ha:'Mai laulayi',hi:'कृपालु',id:'Yang Maha Halus',fa:'لطیف',ru:'Тончайший',tr:'Latif',ur:'لطیف',ug:'لەتىپ'}],
  ['الخَبِير','Al-Khabīr',{sq:'I Njohuri i madh',bn:'সম্যকজ্ঞ',bs:'Svesvjesni',zh:'至悉者',de:'Der Allkundige',en:'The All-Aware',ha:'Mai sanin kome',hi:'सर्वज्ञाता',id:'Yang Maha Teliti',fa:'خبیر',ru:'Сведущий',tr:'Habir',ur:'خبیر',ug:'خەبىر'}],
  ['الحَلِيم','Al-Ḥalīm',{sq:'I Durimi',bn:'সহিষ্ণু',bs:'Blagonaklon',zh:'至宽者',de:'Der Geduldige',en:'The Most Gentle',ha:'Mai hauri',hi:'सहिष्णु',id:'Yang Maha Penyantun',fa:'حلیم',ru:'Кроткий',tr:'Halim',ur:'حلیم',ug:'ھەلىم'}],
  ['الغَنِي','Al-Ghanī',{sq:'I Pasuri',bn:'স্বয়ংসম্পূর্ণ',bs:'Samodovoljan',zh:'自足者',de:'Der Reiche/Selbstgenügsame',en:'The Self-Sufficient',ha:'Mai wadatarwa',hi:'आत्मनिर्भर',id:'Yang Maha Kaya',fa:'غنی',ru:'Самодостаточный',tr:'Gani',ur:'غنی',ug:'غەنى'}],
  ['الشَّكُور','Ash-Shakūr',{sq:'Falënderuesi',bn:'কৃতজ্ঞতাপ্রাপক',bs:'Zahvaljivač',zh:'感恩者',de:'Der Dankbare/Allschätzende',en:'The Most Appreciative',ha:'Mai godiya',hi:'कृतज्ञ',id:'Yang Maha Mensyukuri',fa:'شکور',ru:'Признательный',tr:'Şekur',ur:'شکور',ug:'شەكۇر'}],
  ['الوَدُود','Al-Wadūd',{sq:'Dashurësi',bn:'প্রেমময়',bs:'Ljubazni',zh:'慈爱者',de:'Der Liebende',en:'The Loving',ha:'Mai kauna',hi:'प्रेममय',id:'Yang Maha Mencintai',fa:'ودود',ru:'Любящий',tr:'Vedud',ur:'ودود',ug:'ۋەدۇد'}],
  ['الحَيّ','Al-Ḥayy',{sq:'I Gjalli',bn:'চিরজীবন্ত',bs:'Životni',zh:'永生者',de:'Der Lebendige',en:'The Ever-Living',ha:'Mai rai',hi:'चिरजीवी',id:'Yang Maha Hidup',fa:'حی',ru:'Живой',tr:'Hayy',ur:'حی',ug:'ھەي'}],
  ['القَيُّوم','Al-Qayyūm',{sq:'Mbajtësi',bn:'স্বনির্ভর',bs:'Samoodrživi',zh:'永存者',de:'Der Beständige',en:'The Self-Subsisting',ha:'Mai dawwama',hi:'स्वयंभू',id:'Yang Maha Mandiri',fa:'قیوم',ru:'Вечносущий',tr:'Kayyum',ur:'قیوم',ug:'قەييۇم'}],
  ['الأَحَد','Al-Aḥad',{sq:'I Vetmi',bn:'একক',bs:'Jedini',zh:'唯一者',de:'Der Einzige',en:'The One',ha:'Guda ɗaya',hi:'एकमात्र',id:'Yang Maha Esa',fa:'احد',ru:'Единственный',tr:'Ahad',ur:'احد',ug:'ئەھەد'}],
  ['الصَّمَد','Aṣ-Ṣamad',{sq:'I Pavarur',bn:'নির্ভরযোগ্য',bs:'Vječiti',zh:'永恒者',de:'Der Ewige',en:'The Eternal',ha:'Mai dawwama',hi:'शाश्वत',id:'Yang Maha Dibutuhkan',fa:'صمد',ru:'Вечный',tr:'Samed',ur:'صمد',ug:'سەمەد'}],
  ['الوَلِي','Al-Walī',{sq:'Mbrojtësi',bn:'অভিভাবক',bs:'Zaštitnik',zh:'守护者',de:'Der Schutzherr',en:'The Protector/Friend',ha:'Mai kula',hi:'संरक्षक',id:'Yang Maha Melindungi',fa:'ولی',ru:'Покровитель',tr:'Veli',ur:'ولی',ug:'ۋەلى'}],
  ['الحَمِيد','Al-Ḥamīd',{sq:'I Lavdëruari',bn:'প্রশংসনীয়',bs:'Hvale vrijedan',zh:'受赞颂者',de:'Der Lobenswerte',en:'The Praiseworthy',ha:'Wanda ya cancanci yabo',hi:'स्तुत्य',id:'Yang Maha Terpuji',fa:'حمید',ru:'Достохвальный',tr:'Hamid',ur:'حمید',ug:'ھامىد'}],
  ['الوَارِث','Al-Wārith',{sq:'Trashëgimtari',bn:'উত্তরাধিকারী',bs:'Nasljednik',zh:'继承者',de:'Der Erbe',en:'The Inheritor',ha:'Magaji',hi:'उत्तराधिकारी',id:'Yang Maha Mewarisi',fa:'وارث',ru:'Наследник',tr:'Varis',ur:'وارث',ug:'ۋارىس'}],
  ['النُّور','An-Nūr',{sq:'Drita',bn:'আলো',bs:'Svjetlost',zh:'光明',de:'Das Licht',en:'The Light',ha:'Haske',hi:'प्रकाश',id:'Cahaya',fa:'نور',ru:'Свет',tr:'Nur/Işık',ur:'نور',ug:'نۇر'}],
  ['الهَادِي','Al-Hādī',{sq:'Udhërrëfyesi',bn:'পথপ্রদর্শক',bs:'Vodič',zh:'引导者',de:'Der Rechtleiter',en:'The Guide',ha:'Mai jagoranci',hi:'मार्गदर्शक',id:'Yang Maha Memberi Petunjuk',fa:'هادی',ru:'Направляющий',tr:'Hadi',ur:'ہادی',ug:'ھادى'}],
  // ── Core Quranic Terms ──
  ['صَلَاة','Ṣalāh',{sq:'Namaz/Lutje',bn:'নামাজ',bs:'Namaz',zh:'礼拜/祈祷',de:'Gebet/Namaz',en:'Prayer',ha:'Sallah/Addu\'a',hi:'नमाज़',id:'Shalat',fa:'نماز',ru:'Намаз/Молитва',tr:'Namaz',ur:'نماز',ug:'نامىز'}],
  ['زَكَاة','Zakāh',{sq:'Zeqat',bn:'যাকাত',bs:'Zekat',zh:'天课',de:'Pflichtalmosen',en:'Almsgiving',ha:'Zakka',hi:'ज़कात',id:'Zakat',fa:'زکات',ru:'Закят',tr:'Zekat',ur:'زکوٰۃ',ug:'زەكات'}],
  ['صَوْم','Ṣawm',{sq:'Agjërim',bn:'রোজা/সিয়াম',bs:'Post',zh:'封斋',de:'Fasten',en:'Fasting',ha:'Azumi',hi:'रोज़ा',id:'Puasa',fa:'روزه',ru:'Пост',tr:'Oruç',ur:'روزہ',ug:'روزا'}],
  ['حَجّ','Ḥajj',{sq:'Haxh',bn:'হজ্জ',bs:'Hadž',zh:'朝觐',de:'Pilgerfahrt',en:'Pilgrimage',ha:'Aikin hajji',hi:'हज',id:'Haji',fa:'حج',ru:'Хадж',tr:'Hac',ur:'حج',ug:'ھەج'}],
  ['إِيمَان','Īmān',{sq:'Besim',bn:'ঈমান',bs:'Vjera',zh:'信仰',de:'Glaube',en:'Faith',ha:'Imani',hi:'ईमान/विश्वास',id:'Iman',fa:'ایمان',ru:'Вера',tr:'İman',ur:'ایمان',ug:'ئىمان'}],
  ['إِسْلَام','Islām',{sq:'Islam',bn:'ইসলাম',bs:'Islam',zh:'伊斯兰',de:'Islam/Hingabe',en:'Islam/Submission',ha:'Musulunci',hi:'इस्लाम',id:'Islam',fa:'اسلام',ru:'Ислам',tr:'İslam',ur:'اسلام',ug:'ئىسلام'}],
  ['قُرْآن','Qurʾān',{sq:'Kuran',bn:'কুরআন',bs:'Kur\'an',zh:'古兰经',de:'Koran',en:'Quran',ha:'Alƙur\'ani',hi:'क़ुरआन',id:'Al-Qur\'an',fa:'قرآن',ru:'Коран',tr:'Kur\'an',ur:'قرآن',ug:'قۇرئان'}],
  ['سُورَة','Sūrah',{sq:'Sure',bn:'সূরা',bs:'Sura',zh:'章',de:'Koransure',en:'Chapter',ha:'Suratu',hi:'सूरह',id:'Surah',fa:'سوره',ru:'Сура',tr:'Sure',ur:'سورۃ',ug:'سۈرە'}],
  ['آيَة','Āyah',{sq:'Ajet/Shenjë',bn:'আয়াত',bs:'Ajet',zh:'节',de:'Koranvers/Zeichen',en:'Verse/Sign',ha:'Aya',hi:'आयत',id:'Ayat',fa:'آیه',ru:'Аят',tr:'Ayet',ur:'آیت',ug:'ئايەت'}],
  ['نَبِي','Nabī',{sq:'Pejgamber',bn:'নবী',bs:'Vjerovjesnik',zh:'先知',de:'Prophet',en:'Prophet',ha:'Annabi',hi:'नबी',id:'Nabi',fa:'نبی',ru:'Пророк',tr:'Nebi',ur:'نبی',ug:'نەبى'}],
  ['رَسُول','Rasūl',{sq:'I dërguar',bn:'রাসূল',bs:'Poslanik',zh:'使者',de:'Gesandter/Bote',en:'Messenger',ha:'Manzo',hi:'रसूल',id:'Rasul',fa:'رسول',ru:'Посланник',tr:'Resul',ur:'رسول',ug:'رەسۇل'}],
  ['كِتَاب','Kitāb',{sq:'Libër',bn:'কিতাব',bs:'Knjiga',zh:'书',de:'Buch',en:'Book/Scripture',ha:'Littafi',hi:'किताब',id:'Kitab',fa:'کتاب',ru:'Книга',tr:'Kitap',ur:'کتاب',ug:'كىتاب'}],
  ['حِكْمَة','Ḥikmah',{sq:'Urtësi',bn:'হিকমাহ',bs:'Mudrost',zh:'智慧',de:'Weisheit',en:'Wisdom',ha:'Hikma',hi:'हिकमत',id:'Hikmah',fa:'حکمت',ru:'Мудрость',tr:'Hikmet',ur:'حکمت',ug:'ھىكمەت'}],
  ['جَنَّة','Jannah',{sq:'Xhennet/Parajsë',bn:'জান্নাত',bs:'Džennet',zh:'天堂',de:'Paradies',en:'Paradise/Garden',ha:'Aljanna',hi:'जन्नत',id:'Surga',fa:'بهشت',ru:'Рай',tr:'Cennet',ur:'جنت',ug:'جەننەت'}],
  ['نَار','Nār',{sq:'Zjarr/Xhehenem',bn:'নার/আগুন',bs:'Džehennem/Vatra',zh:'火/地狱',de:'Feuer/Hölle',en:'Fire/Hell',ha:'Wuta',hi:'नार/आग',id:'Neraka/Api',fa:'آتش/جهنم',ru:'Огонь/Ад',tr:'Ateş/Cehennem',ur:'نار/آگ',ug:'نار/ئوت'}],
  ['آخِرَة','Ākhirah',{sq:'Ahiret/Bota tjetër',bn:'আখিরাত',bs:'Ahiret',zh:'后世',de:'Jenseits',en:'Hereafter',ha:'Lahira',hi:'आखिरत',id:'Akhirat',fa:'آخرت',ru:'Потусторонний мир',tr:'Ahiret',ur:'آخرت',ug:'ئاخىرەت'}],
  ['دُنْيَا','Dunyā',{sq:'Dynja/Kjo botë',bn:'দুনিয়া',bs:'Ovaj svijet',zh:'今世',de:'Diesseits/Diese Welt',en:'This World',ha:'Duniya',hi:'दुनिया',id:'Dunia',fa:'دنیا',ru:'Ближний мир',tr:'Dünya',ur:'دنیا',ug:'دۇنيا'}],
  ['يَوْم القِيَامَة','Yawm al-Qiyāmah',{sq:'Dita e Kiametit',bn:'কিয়ামতের দিন',bs:'Dan Kijameta',zh:'复活日',de:'Tag der Auferstehung',en:'Day of Resurrection',ha:'Ranar tashin kiyama',hi:'क़यामत का दिन',id:'Hari Kiamat',fa:'روز قیامت',ru:'День Воскресения',tr:'Kıyamet günü',ur:'یوم القیامہ',ug:'قىيامەت كۈنى'}],
  ['تَقْوَى','Taqwā',{sq:'Devotshmëri',bn:'তাকওয়া',bs:'Bogobojaznost',zh:'虔诚/敬畏',de:'Gottesfurcht/Frömmigkeit',en:'God-consciousness/Piety',ha:'Tsoron Allah',hi:'तक़वा',id:'Takwa',fa:'تقوا',ru:'Богобоязненность',tr:'Takva',ur:'تقویٰ',ug:'تەقۋا'}],
  ['صَبْر','Ṣabr',{sq:'Durim/Sabër',bn:'সবর',bs:'Strpljivost/Sabur',zh:'忍耐/坚忍',de:'Geduld/Ausdauer',en:'Patience/Perseverance',ha:'Haƙuri',hi:'सब्र',id:'Sabar',fa:'صبر',ru:'Терпение',tr:'Sabır',ur:'صبر',ug:'سەۋر'}],
  ['شُكْر','Shukr',{sq:'Mirënjohje',bn:'শুকর',bs:'Zahvalnost',zh:'感恩',de:'Dankbarkeit',en:'Gratitude',ha:'Godiya',hi:'शुक्र',id:'Syukur',fa:'شکر',ru:'Благодарность',tr:'Şükür',ur:'شکر',ug:'شۈكۈر'}],
  ['ذِكْر','Dhikr',{sq:'Përmendja e Allahut',bn:'যিকর',bs:'Spomen Allaha',zh:'念诵',de:'Gottesgedenken',en:'Remembrance of God',ha:'Zikiri',hi:'ज़िक्र',id:'Dzikir',fa:'ذکر',ru:'Поминание Аллаха',tr:'Zikir',ur:'ذکر',ug:'زىكر'}],
  ['دُعَاء','Duʿāʾ',{sq:'Lutje/Dua',bn:'দুআ',bs:'Dova',zh:'祈祷',de:'Bittgebet/Fürbitte',en:'Supplication',ha:'Addu\'a',hi:'दुआ',id:'Doa',fa:'دعا',ru:'Мольба',tr:'Dua',ur:'دعا',ug:'دۇئا'}],
  ['تَوْبَة','Tawbah',{sq:'Pendim/Tövbe',bn:'তওবা',bs:'Pokajanje/Tevba',zh:'悔悟',de:'Reue/Umkehr',en:'Repentance',ha:'Tuba',hi:'तौबा',id:'Taubat',fa:'توبه',ru:'Покаяние',tr:'Tövbe',ur:'توبہ',ug:'تەۋبە'}],
  ['أُمَّة','Ummah',{sq:'Komunitet/Ummë',bn:'উম্মাহ',bs:'Ummet/Zajednica',zh:'共同体',de:'Gemeinschaft/Gemeinde',en:'Community/Nation',ha:'Al\'umma',hi:'उम्मा',id:'Umat',fa:'امت',ru:'Умма',tr:'Ümmet',ur:'امت',ug:'ئۇممەت'}],
  ['مَلَائِكَة','Malāʾikah',{sq:'Engjëj',bn:'ফেরেশতা',bs:'Meleki/Anđeli',zh:'天使',de:'Engel',en:'Angels',ha:'Mala\'iku',hi:'फ़रिश्ते',id:'Malaikat',fa:'ملائکه',ru:'Ангелы',tr:'Melekler',ur:'فرشتے',ug:'مەلەكلەر'}],
  ['شَيْطَان','Shayṭān',{sq:'Shejtani/Djalli',bn:'শয়তান',bs:'Šejtan',zh:'恶魔',de:'Teufel/Satan',en:'Devil/Satan',ha:'Shaidan',hi:'शैतान',id:'Setan',fa:'شیطان',ru:'Шайтан',tr:'Şeytan',ur:'شیطان',ug:'شەيتان'}],
  ['جِنّ','Jinn',{sq:'Xhinn',bn:'জিন',bs:'Džinn',zh:'精灵',de:'Dschinn',en:'Jinn',ha:'Aljanu',hi:'जिन्न',id:'Jin',fa:'جن',ru:'Джинны',tr:'Cin',ur:'جن',ug:'جىن'}],
  ['وَحْي','Waḥy',{sq:'Shpallje/Vahj',bn:'ওহী',bs:'Objava',zh:'启示',de:'Offenbarung',en:'Revelation',ha:'Wahayi',hi:'वह्य/ईश्वरीय संदेश',id:'Wahyu',fa:'وحی',ru:'Откровение',tr:'Vahiy',ur:'وحی',ug:'ۋەھى'}],
  ['حَلَال','Ḥalāl',{sq:'Hallall/E lejuar',bn:'হালাল',bs:'Halal',zh:'合法',de:'Erlaubt/Halal',en:'Permissible',ha:'Halal',hi:'हलाल',id:'Halal',fa:'حلال',ru:'Халяль',tr:'Helal',ur:'حلال',ug:'ھالال'}],
  ['حَرَام','Ḥarām',{sq:'Haram/E ndaluar',bn:'হারাম',bs:'Haram',zh:'禁止',de:'Verboten/Haram',en:'Forbidden',ha:'Haramun/Haram',hi:'हराम',id:'Haram',fa:'حرام',ru:'Харам',tr:'Haram',ur:'حرام',ug:'ھارام'}],
  ['فِرْعَون','Firʿawn',{sq:'Faraoni',bn:'ফেরাউন',bs:'Faraon',zh:'法老',de:'Pharao',en:'Pharaoh',ha:'Fir\'auna',hi:'फ़िरऔन',id:'Fir\'aun',fa:'فرعون',ru:'Фараон',tr:'Firavun',ur:'فرعون',ug:'فىرئەۋن'}],
  ['آدَم','Ādam',{sq:'Ademi',bn:'আদম',bs:'Adem',zh:'阿丹',de:'Adam',en:'Adam',ha:'Adamu',hi:'आदम',id:'Adam',fa:'آدم',ru:'Адам',tr:'Adem',ur:'آدم',ug:'ئادەم'}],
  ['إِبْرَاهِيم','Ibrāhīm',{sq:'Ibrahimi',bn:'ইব্রাহিম',bs:'Ibrahim',zh:'易卜拉辛',de:'Abraham/Ibrahim',en:'Abraham',ha:'Ibrahim',hi:'इब्राहीम',id:'Ibrahim',fa:'ابراهیم',ru:'Ибрагим',tr:'İbrahim',ur:'ابراہیم',ug:'ئىبراھىم'}],
  ['مُوسَى','Mūsā',{sq:'Musai',bn:'মুসা',bs:'Musa',zh:'穆萨',de:'Moses/Musa',en:'Moses',ha:'Musa',hi:'मूसा',id:'Musa',fa:'موسی',ru:'Муса',tr:'Musa',ur:'موسیٰ',ug:'موسا'}],
  ['عِيسَى','ʿĪsā',{sq:'Isai',bn:'ঈসা',bs:'Isa',zh:'尔撒',de:'Jesus/Isa',en:'Jesus',ha:'Isa',hi:'ईसा',id:'Isa',fa:'عیسی',ru:'Иса',tr:'İsa',ur:'عیسیٰ',ug:'ئىسا'}],
  ['مَرْيَم','Maryam',{sq:'Merjemja',bn:'মারিয়াম',bs:'Merjema',zh:'麦尔彦',de:'Maria/Maryam',en:'Mary',ha:'Maryamu',hi:'मरियम',id:'Maryam',fa:'مریم',ru:'Марьям',tr:'Meryem',ur:'مریم',ug:'مەريەم'}],
  ['مُحَمَّد','Muḥammad',{sq:'Muhamedi',bn:'মুহাম্মদ',bs:'Muhammed',zh:'穆罕默德',de:'Mohammed/Muhammad',en:'Muhammad',ha:'Muhammadu',hi:'मुहम्मद',id:'Muhammad',fa:'محمد',ru:'Мухаммад',tr:'Muhammed',ur:'محمد',ug:'مۇھەممەد'}],
  ['بِسْمِ اللَّه','Bismillāh',{sq:'Me emrin e Allahut',bn:'আল্লাহর নামে',bs:'U ime Allaha',zh:'奉真主之名',de:'Im Namen Allahs',en:'In the name of Allah',ha:'Da sunan Allah',hi:'बिस्मिल्लाह',id:'Dengan nama Allah',fa:'به نام خداوند',ru:'Во имя Аллаха',tr:'Allah\'ın adıyla',ur:'بسم اللہ',ug:'ئاللاھنىڭ ئىسمى بىلەن'}],
  ['الحَمْدُ لِلَّه','Al-Ḥamdu lillāh',{sq:'Lavdërim i qoftë Allahut',bn:'সমস্ত প্রশংসা আল্লাহর',bs:'Sva hvala pripada Allahu',zh:'一切赞美归于真主',de:'Gelobt sei Allah',en:'All praise is due to Allah',ha:'Godiya ta Allah',hi:'सब प्रशंसा अल्लाह के लिए',id:'Segala puji bagi Allah',fa:'ستایش خداوند را',ru:'Хвала Аллаху',tr:'Allah\'a hamd olsun',ur:'سب تعریف اللہ کے لیے',ug:'ئاللاھقا ھەمد بولسۇن'}],
  ['سُبْحَان اللَّه','Subḥāna llāh',{sq:'Lartë qoftë Allahu',bn:'আল্লাহ মহাপবিত্র',bs:'Slava Allahu',zh:'真主至高无上',de:'Allah ist erhaben',en:'Glory be to Allah',ha:'Allah shi ne mai tsarki',hi:'सुब्हानल्लाह',id:'Maha Suci Allah',fa:'خداوند منزه است',ru:'Пречист Аллах',tr:'Allah\'ı tenzih ederim',ur:'سبحان اللہ',ug:'ئاللاھ پاك'}],
  ['اللَّهُ أَكْبَر','Allāhu Akbar',{sq:'Allahu është më i madhi',bn:'আল্লাহু আকবার',bs:'Allah je najveći',zh:'真主至大',de:'Allah ist am größten',en:'Allah is the Greatest',ha:'Allah shi ne mafi girma',hi:'अल्लाहु अकबर',id:'Allah Maha Besar',fa:'الله اکبر',ru:'Аллах Велик',tr:'Allah en büyüktür',ur:'اللہ اکبر',ug:'ئاللاھ ئەڭ چوڭ'}],
  ['إِنَّ اللَّه مَعَنَا','Inna llāha maʿanā',{sq:'Allahu është me ne',bn:'নিশ্চয়ই আল্লাহ আমাদের সাথে',bs:'Zaista je Allah s nama',zh:'真主确实与我们同在',de:'Wahrlich, Allah ist mit uns',en:'Verily, Allah is with us',ha:'Lalle Allah yana tare da mu',hi:'बेशक अल्लाह हमारे साथ है',id:'Sesungguhnya Allah bersama kita',fa:'همانا خداوند با ماست',ru:'Воистину, Аллах с нами',tr:'Şüphesiz Allah bizimledir',ur:'بیشک اللہ ہمارے ساتھ ہے',ug:'ئاللاھ ھەققىقەتتە بىز بىلەن'}],
];

// dict title per language
const DICT_TITLE = {
  sq:'Fjalor Kuranor',bn:'কুরআনীয় অভিধান',bs:'Rječnik Kur\'ana',zh:'古兰经词典',
  de:'Koranisches Wörterbuch',en:'Quranic Dictionary',ha:'Kamus Al-Qur\'an',
  hi:'क़ुरआनी शब्दकोश',id:'Kamus Al-Qur\'an',fa:'فرهنگ لغت قرآنی',
  ru:'Словарь Корана',tr:'Kur\'an Sözlüğü',ur:'قرآنی لغت',ug:'قۇرئان لۇغىتى'
};

const DICT_COL_LABEL = {
  sq:'Shqip',bn:'বাংলা',bs:'Bosanski',zh:'中文',de:'Deutsch',en:'English',
  ha:'Hausa',hi:'हिन्दी',id:'Bahasa Indonesia',fa:'فارسی',ru:'Русский',
  tr:'Türkçe',ur:'اردو',ug:'ئۇيغۇرچە'
};

function buildDictPage(l) {
  const title  = DICT_TITLE[l.lang];
  const colLbl = DICT_COL_LABEL[l.lang];
  const isRtl  = l.rtl;
  const dir    = isRtl ? 'rtl' : 'ltr';
  const rows   = WORDS.map(([ar, trl, tr]) => {
    const trans = tr[l.lang] || '';
    const transDir = isRtl ? 'dir="rtl"' : '';
    return `<tr>
      <td class="ar-col" dir="rtl">${ar}</td>
      <td class="trl-col">${trl}</td>
      <td class="tr-col" ${transDir}>${trans}</td>
    </tr>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${l.lang}" dir="${dir}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · القرآن الكريم</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='56' font-family='serif' fill='%238a5800'>&#x06DE;</text></svg>">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100vh;background:#0f2f1a;color:#f0e6c0;font-family:'Noto Serif',Georgia,serif;}
nav{background:rgba(15,36,18,.94);height:46px;display:flex;align-items:center;padding:0 18px;gap:10px;border-bottom:2px solid rgba(140,102,14,.28);position:sticky;top:0;z-index:50;flex-shrink:0;}
nav a{color:rgba(192,155,60,.6);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;}
nav a:hover{color:rgba(192,155,60,.95);}
.nav-title{flex:1;text-align:center;font:.7rem sans-serif;letter-spacing:.12em;color:rgba(192,155,60,.55);}
.search-wrap{padding:18px 20px 12px;position:sticky;top:46px;background:#0f2f1a;z-index:40;border-bottom:1px solid rgba(192,155,60,.12);}
.search-wrap input{width:100%;max-width:480px;display:block;margin:0 auto;background:rgba(15,47,26,.7);border:1px solid rgba(192,155,60,.3);border-radius:8px;padding:9px 16px;color:#f0e6c0;font-size:.88rem;outline:none;font-family:'Noto Serif',Georgia,serif;}
.search-wrap input::placeholder{color:rgba(192,155,60,.35);}
.search-wrap input:focus{border-color:rgba(192,155,60,.7);}
main{max-width:820px;margin:0 auto;padding:16px 16px 60px;}
table{width:100%;border-collapse:collapse;}
thead th{background:rgba(192,155,60,.08);padding:10px 12px;font-size:.68rem;letter-spacing:.14em;color:rgba(192,155,60,.7);text-transform:uppercase;border-bottom:2px solid rgba(192,155,60,.2);font-weight:600;font-family:sans-serif;}
th.ar-h{text-align:right;font-family:'Scheherazade New',serif;font-size:1rem;letter-spacing:0;text-transform:none;}
tbody tr{border-bottom:1px solid rgba(192,155,60,.08);transition:background .15s;}
tbody tr:hover{background:rgba(192,155,60,.06);}
tbody tr.hidden{display:none;}
td{padding:10px 12px;vertical-align:middle;}
.ar-col{font-family:'Scheherazade New',serif;font-size:1.55rem;color:#c9a84c;direction:rtl;text-align:right;line-height:1.6;width:36%;}
.trl-col{font-size:.78rem;color:rgba(192,155,60,.6);font-style:italic;width:28%;}
.tr-col{font-size:.88rem;color:#f0e6c0;line-height:1.5;width:36%;}
footer{text-align:center;padding:20px;font-size:.58rem;color:rgba(192,155,60,.2);letter-spacing:.06em;}
</style>
</head><body>
<nav>
  <a href="index.html">← ${l.lang === 'de' ? 'Inhaltsverzeichnis' : 'Index'}</a>
  <span class="nav-title">${title}</span>
  <a href="../../..">&#x2302;</a>
</nav>
<div class="search-wrap">
  <input type="search" id="q" placeholder="&#x1F50D; ${l.lang === 'de' ? 'Suchen...' : l.lang === 'en' ? 'Search...' : l.lang === 'tr' ? 'Ara...' : l.lang === 'ru' ? 'Поиск...' : l.lang === 'ar' ? '...بحث' : 'Search...'}" oninput="filterTable(this.value)">
</div>
<main>
<table>
<thead><tr>
  <th class="ar-h" dir="rtl">عربي</th>
  <th>${l.lang === 'de' ? 'Transliteration' : 'Transliteration'}</th>
  <th>${colLbl}</th>
</tr></thead>
<tbody id="tbody">
${rows}
</tbody>
</table>
</main>
<footer>Koranische Grundvokabeln · Quelltexte: gemeinfreie Überlieferungen · ${title}</footer>
<script>
function filterTable(q){
  var rows=document.querySelectorAll('#tbody tr');
  var t=q.trim().toLowerCase();
  rows.forEach(function(r){
    r.classList.toggle('hidden', t.length > 0 && r.textContent.toLowerCase().indexOf(t) === -1);
  });
}
document.getElementById('q').addEventListener('keydown',function(e){if(e.key==='Escape')this.value='',filterTable('');});
</script>
</body></html>`;
}

for (const l of QURAN_LANGS) {
  const dictPath = path.join(QURAN_DIST, l.dir, 'woerterbuch.html');
  fs.writeFileSync(dictPath, buildDictPage(l), 'utf8');
  console.log(`  ✓ Wörterbuch ${l.de}`);
}

// ─── 6. INJECT DICTIONARY ICON INTO ALL QURAN SURA FILES ─────────────────────
console.log('\n[6] Injiziere Wörterbuch-Icon in Quran-Suren...');

const DICT_ICON_CSS = `
<style id="dict-icon-style">#dict-icon-btn{position:fixed;top:14px;left:14px;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;color:#d4a574;background:linear-gradient(155deg,rgba(16,10,6,.88),rgba(20,12,8,.92));border:2px solid #9b7d5c;border-radius:14px;backdrop-filter:blur(8px);z-index:40;box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.14);transition:transform .2s,border-color .2s,color .2s;}#dict-icon-btn:hover,#dict-icon-btn:focus-visible{transform:translateY(-1px) scale(1.04);border-color:#e8c8a0;color:#e8c8a0;}#dict-icon-btn svg{width:20px;height:20px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}@media(max-width:640px){#dict-icon-btn{top:10px;left:10px;width:40px;height:40px;}}</style>
`;

const DICT_ICON_HTML = `<a id="dict-icon-btn" href="../woerterbuch.html" title="Wörterbuch / Dictionary" aria-label="Wörterbuch öffnen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/></svg></a>
`;

let surenPatched = 0;
let surenSkipped = 0;

for (const l of QURAN_LANGS) {
  const surenDir = path.join(QURAN_DIST, l.dir, 'suren');
  if (!fs.existsSync(surenDir)) continue;
  for (const f of fs.readdirSync(surenDir)) {
    if (!f.endsWith('.html')) continue;
    const fp = path.join(surenDir, f);
    let html = fs.readFileSync(fp, 'utf8');
    if (html.includes('dict-icon-btn')) { surenSkipped++; continue; }
    // Inject CSS before </head>
    html = html.replace('</head>', DICT_ICON_CSS + '</head>');
    // Inject icon button after <body>
    html = html.replace(/<body([^>]*)>/, (m) => m + '\n' + DICT_ICON_HTML);
    fs.writeFileSync(fp, html, 'utf8');
    surenPatched++;
  }
}
console.log(`  ✓ ${surenPatched} Suren-Dateien gepacht, ${surenSkipped} übersprungen`);

// Also patch intro.html and index.html of each language
const DICT_ICON_HTML_INDEX = `<a id="dict-icon-btn" href="woerterbuch.html" title="Wörterbuch / Dictionary" aria-label="Wörterbuch öffnen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/></svg></a>
`;
let indexPatched = 0;
for (const l of QURAN_LANGS) {
  for (const fname of ['intro.html', 'index.html']) {
    const fp = path.join(QURAN_DIST, l.dir, fname);
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    if (html.includes('dict-icon-btn')) continue;
    html = html.replace('</head>', DICT_ICON_CSS + '</head>');
    html = html.replace(/<body([^>]*)>/, (m) => m + '\n' + DICT_ICON_HTML_INDEX);
    fs.writeFileSync(fp, html, 'utf8');
    indexPatched++;
  }
}
console.log(`  ✓ ${indexPatched} Index/Intro-Dateien gepacht`);

console.log('\n✅ Fertig! Alles bereit für Surge-Deploy.');
