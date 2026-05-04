'use strict';
/**
 * BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR v2
 * Komplettes Redesign: edles Bibeldesign, Cover, interlineares Layout
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUT_DIR  = path.join(__dirname, 'Übersetzungen');

// ═══════════════════════════════════════════════════════
//  ÜBERSETZUNGEN
// ═══════════════════════════════════════════════════════

const TRANSLATIONS = [
  { code: 'kjv',        lang: 'en', native: 'English',    display: 'King James Version (1611)',          flag: '🇬🇧' },
  { code: 'german',     lang: 'de', native: 'Deutsch',    display: 'Textbibel (1906)',                   flag: '🇩🇪' },
  { code: 'french',     lang: 'fr', native: 'Français',   display: 'Crampon (1923)',                     flag: '🇫🇷' },
  { code: 'spanish',    lang: 'es', native: 'Español',    display: 'Reina-Valera (1909)',                flag: '🇪🇸' },
  { code: 'portuguese', lang: 'pt', native: 'Português',  display: 'Bíblia Livre',                      flag: '🇧🇷' },
  { code: 'polish',     lang: 'pl', native: 'Polski',     display: 'Biblia Gdańska (1881)',             flag: '🇵🇱' },
  { code: 'russian',    lang: 'ru', native: 'Русский',    display: 'Синодальный (1876)',                 flag: '🇷🇺' },
  { code: 'croatian',   lang: 'hr', native: 'Hrvatski',   display: 'Hrvatska Biblija Šarića',           flag: '🇭🇷' },
  { code: 'dutch',      lang: 'nl', native: 'Nederlands', display: 'Statenvertaling (1637)',             flag: '🇳🇱' },
  { code: 'hungarian',  lang: 'hu', native: 'Magyar',     display: 'Károli (1908)',                      flag: '🇭🇺' },
  { code: 'czech',      lang: 'cs', native: 'Čeština',    display: 'Bible Kralická (1613)',              flag: '🇨🇿' },
  { code: 'swedish',    lang: 'sv', native: 'Svenska',    display: 'Svenska Bibeln (1917)',              flag: '🇸🇪' },
  { code: 'tagalog',    lang: 'tl', native: 'Filipino',   display: 'Ang Biblia (1905)',                  flag: '🇵🇭' },
  { code: 'ukrainian',  lang: 'uk', native: 'Українська', display: 'Біблія Огієнка (1962)',             flag: '🇺🇦' },
];

// ═══════════════════════════════════════════════════════
//  BÜCHERLISTE
// ═══════════════════════════════════════════════════════

const BOOKS = [
  { nr: 1,  abbrev:'gen', latin:'Genesis',               name:'Genesis',          testament:'VT' },
  { nr: 2,  abbrev:'exo', latin:'Exodus',                name:'Exodus',           testament:'VT' },
  { nr: 3,  abbrev:'lev', latin:'Leviticus',             name:'Leviticus',        testament:'VT' },
  { nr: 4,  abbrev:'num', latin:'Numeri',                name:'Numbers',          testament:'VT' },
  { nr: 5,  abbrev:'deu', latin:'Deuteronomium',         name:'Deuteronomy',      testament:'VT' },
  { nr: 6,  abbrev:'jos', latin:'Iosue',                 name:'Joshua',           testament:'VT' },
  { nr: 7,  abbrev:'jdg', latin:'Iudicum',               name:'Judges',           testament:'VT' },
  { nr: 8,  abbrev:'rut', latin:'Ruth',                  name:'Ruth',             testament:'VT' },
  { nr: 9,  abbrev:'1sa', latin:'I Regum',               name:'1 Samuel',         testament:'VT' },
  { nr:10,  abbrev:'2sa', latin:'II Regum',              name:'2 Samuel',         testament:'VT' },
  { nr:11,  abbrev:'1ki', latin:'III Regum',             name:'1 Kings',          testament:'VT' },
  { nr:12,  abbrev:'2ki', latin:'IV Regum',              name:'2 Kings',          testament:'VT' },
  { nr:13,  abbrev:'1ch', latin:'I Paralipomenon',       name:'1 Chronicles',     testament:'VT' },
  { nr:14,  abbrev:'2ch', latin:'II Paralipomenon',      name:'2 Chronicles',     testament:'VT' },
  { nr:15,  abbrev:'ezr', latin:'I Esdras',              name:'Ezra',             testament:'VT' },
  { nr:16,  abbrev:'neh', latin:'II Esdras',             name:'Nehemiah',         testament:'VT' },
  { nr:17,  abbrev:'est', latin:'Esther',                name:'Esther',           testament:'VT' },
  { nr:18,  abbrev:'job', latin:'Iob',                   name:'Job',              testament:'VT' },
  { nr:19,  abbrev:'psa', latin:'Psalmi',                name:'Psalms',           testament:'VT' },
  { nr:20,  abbrev:'pro', latin:'Proverbia',             name:'Proverbs',         testament:'VT' },
  { nr:21,  abbrev:'ecc', latin:'Ecclesiastes',          name:'Ecclesiastes',     testament:'VT' },
  { nr:22,  abbrev:'sng', latin:'Canticum Canticorum',   name:'Song of Solomon',  testament:'VT' },
  { nr:23,  abbrev:'isa', latin:'Isaias',                name:'Isaiah',           testament:'VT' },
  { nr:24,  abbrev:'jer', latin:'Ieremias',              name:'Jeremiah',         testament:'VT' },
  { nr:25,  abbrev:'lam', latin:'Threni',                name:'Lamentations',     testament:'VT' },
  { nr:26,  abbrev:'eze', latin:'Ezechiel',              name:'Ezekiel',          testament:'VT' },
  { nr:27,  abbrev:'dan', latin:'Daniel',                name:'Daniel',           testament:'VT' },
  { nr:28,  abbrev:'hos', latin:'Osee',                  name:'Hosea',            testament:'VT' },
  { nr:29,  abbrev:'joe', latin:'Ioel',                  name:'Joel',             testament:'VT' },
  { nr:30,  abbrev:'amo', latin:'Amos',                  name:'Amos',             testament:'VT' },
  { nr:31,  abbrev:'oba', latin:'Abdias',                name:'Obadiah',          testament:'VT' },
  { nr:32,  abbrev:'jon', latin:'Ionas',                 name:'Jonah',            testament:'VT' },
  { nr:33,  abbrev:'mic', latin:'Micheas',               name:'Micah',            testament:'VT' },
  { nr:34,  abbrev:'nah', latin:'Nahum',                 name:'Nahum',            testament:'VT' },
  { nr:35,  abbrev:'hab', latin:'Habacuc',               name:'Habakkuk',         testament:'VT' },
  { nr:36,  abbrev:'zep', latin:'Sophonias',             name:'Zephaniah',        testament:'VT' },
  { nr:37,  abbrev:'hag', latin:'Aggaeus',               name:'Haggai',           testament:'VT' },
  { nr:38,  abbrev:'zec', latin:'Zacharias',             name:'Zechariah',        testament:'VT' },
  { nr:39,  abbrev:'mal', latin:'Malachias',             name:'Malachi',          testament:'VT' },
  { nr:40,  abbrev:'mat', latin:'Matthaeus',             name:'Matthew',          testament:'NT' },
  { nr:41,  abbrev:'mrk', latin:'Marcus',                name:'Mark',             testament:'NT' },
  { nr:42,  abbrev:'luk', latin:'Lucas',                 name:'Luke',             testament:'NT' },
  { nr:43,  abbrev:'joh', latin:'Ioannes',               name:'John',             testament:'NT' },
  { nr:44,  abbrev:'act', latin:'Actus Apostolorum',     name:'Acts',             testament:'NT' },
  { nr:45,  abbrev:'rom', latin:'Ad Romanos',            name:'Romans',           testament:'NT' },
  { nr:46,  abbrev:'1co', latin:'I Ad Corinthios',       name:'1 Corinthians',    testament:'NT' },
  { nr:47,  abbrev:'2co', latin:'II Ad Corinthios',      name:'2 Corinthians',    testament:'NT' },
  { nr:48,  abbrev:'gal', latin:'Ad Galatas',            name:'Galatians',        testament:'NT' },
  { nr:49,  abbrev:'eph', latin:'Ad Ephesios',           name:'Ephesians',        testament:'NT' },
  { nr:50,  abbrev:'php', latin:'Ad Philippenses',       name:'Philippians',      testament:'NT' },
  { nr:51,  abbrev:'col', latin:'Ad Colossenses',        name:'Colossians',       testament:'NT' },
  { nr:52,  abbrev:'1th', latin:'I Thessalonicenses',    name:'1 Thessalonians',  testament:'NT' },
  { nr:53,  abbrev:'2th', latin:'II Thessalonicenses',   name:'2 Thessalonians',  testament:'NT' },
  { nr:54,  abbrev:'1ti', latin:'I Ad Timotheum',        name:'1 Timothy',        testament:'NT' },
  { nr:55,  abbrev:'2ti', latin:'II Ad Timotheum',       name:'2 Timothy',        testament:'NT' },
  { nr:56,  abbrev:'tit', latin:'Ad Titum',              name:'Titus',            testament:'NT' },
  { nr:57,  abbrev:'phm', latin:'Ad Philemonem',         name:'Philemon',         testament:'NT' },
  { nr:58,  abbrev:'heb', latin:'Ad Hebraeos',           name:'Hebrews',          testament:'NT' },
  { nr:59,  abbrev:'jam', latin:'Iacobi',                name:'James',            testament:'NT' },
  { nr:60,  abbrev:'1pe', latin:'I Petri',               name:'1 Peter',          testament:'NT' },
  { nr:61,  abbrev:'2pe', latin:'II Petri',              name:'2 Peter',          testament:'NT' },
  { nr:62,  abbrev:'1jo', latin:'I Ioannis',             name:'1 John',           testament:'NT' },
  { nr:63,  abbrev:'2jo', latin:'II Ioannis',            name:'2 John',           testament:'NT' },
  { nr:64,  abbrev:'3jo', latin:'III Ioannis',           name:'3 John',           testament:'NT' },
  { nr:65,  abbrev:'jud', latin:'Iudae',                 name:'Jude',             testament:'NT' },
  { nr:66,  abbrev:'rev', latin:'Apocalypsis',           name:'Revelation',       testament:'NT' },
  { nr:67,  abbrev:'tob', latin:'Tobias',                name:'Tobit',            testament:'DK' },
  { nr:68,  abbrev:'jdt', latin:'Iudith',                name:'Judith',           testament:'DK' },
  { nr:69,  abbrev:'1ma', latin:'I Machabaeorum',        name:'1 Maccabees',      testament:'DK' },
  { nr:70,  abbrev:'2ma', latin:'II Machabaeorum',       name:'2 Maccabees',      testament:'DK' },
  { nr:71,  abbrev:'wis', latin:'Sapientia',             name:'Wisdom',           testament:'DK' },
  { nr:72,  abbrev:'sir', latin:'Ecclesiasticus',        name:'Sirach',           testament:'DK' },
  { nr:73,  abbrev:'bar', latin:'Baruch',                name:'Baruch',           testament:'DK' },
];

// ═══════════════════════════════════════════════════════
//  HELFER
// ═══════════════════════════════════════════════════════

function mkDir(d)  { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function pad3(n)   { return String(n).padStart(3, '0'); }
function esc(s)    { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  for (let i = 0; i < vals.length; i++) while (n >= vals[i]) { r += syms[i]; n -= vals[i]; }
  return r;
}

function bookFile(book) { return `${pad3(book.nr)}-${book.abbrev}.html`; }

function loadBook(code, nr) {
  const f = path.join(DATA_DIR, code, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

function parseBook(data) {
  if (!data || !data.chapters) return null;
  return Object.keys(data.chapters).sort((a,b)=>+a-+b).map(ck => {
    const ch = data.chapters[ck];
    const verses = Object.keys(ch.verses||{}).sort((a,b)=>+a-+b).map(vk => ({
      nr: ch.verses[vk].verse, text: (ch.verses[vk].text||'').trim()
    }));
    return { nr: ch.chapter, verses };
  });
}

// ═══════════════════════════════════════════════════════
//  GEMEINSAMES CSS
// ═══════════════════════════════════════════════════════

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet">`;

// ═══════════════════════════════════════════════════════
//  COVER
// ═══════════════════════════════════════════════════════

function buildCover() {
  const flags = TRANSLATIONS.map(t => `<span class="fl">${t.flag}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica Interlinearis</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{background:#04060F;min-height:100%;}
body{
  background:radial-gradient(ellipse at 30% 40%,#12193A 0%,#04060F 65%);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:24px;font-family:'EB Garamond',Georgia,serif;
}

/* BUCHCOVER */
.cover{
  width:min(520px,95vw);
  aspect-ratio:3/4.6;
  position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:0;
  /* Bucheinband: tiefdunkles Bordeaux-Blau */
  background:
    linear-gradient(175deg, #0E1428 0%, #192045 40%, #0E1428 100%);
  /* Äußere Goldlinie */
  box-shadow:
    0 0 0 1px #7A5C1E,
    0 0 0 3px #0E1428,
    0 0 0 5px #C8A96E,
    0 0 0 7px #0E1428,
    0 0 0 9px #7A5C1E,
    0 40px 120px rgba(0,0,0,.95),
    inset 0 0 80px rgba(0,0,0,.4);
  border-radius:3px 8px 8px 3px;
  /* Buchbindung links */
  border-left:18px solid #0A0E1E;
  overflow:hidden;
}

/* Rückenstruktur */
.cover::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:18px;
  background:linear-gradient(to right,#050810,#1A2040);
  margin-left:-18px;
}

/* Goldenes Muster */
.cover::after{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(200,169,110,.025) 48px,rgba(200,169,110,.025) 49px),
    repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(200,169,110,.025) 48px,rgba(200,169,110,.025) 49px);
  pointer-events:none;
}

/* INNERER RAHMEN */
.inner{
  position:relative;z-index:1;
  width:calc(100% - 44px);margin:22px 22px;
  flex:1;
  border:1px solid rgba(200,169,110,.55);
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:32px 24px 28px;
}
.inner::before{
  content:'';position:absolute;
  inset:7px;border:1px solid rgba(200,169,110,.2);
  pointer-events:none;
}

/* KREUZ */
.cross{position:relative;width:52px;height:68px;margin-bottom:4px;}
.cv{position:absolute;left:50%;top:0;width:8px;height:100%;transform:translateX(-50%);
  background:linear-gradient(to bottom,transparent,#C8A96E 15%,#C8A96E 85%,transparent);
  border-radius:4px;box-shadow:0 0 18px rgba(200,169,110,.5);}
.ch{position:absolute;top:28%;left:0;width:100%;height:8px;transform:translateY(-50%);
  background:linear-gradient(to right,transparent,#C8A96E 15%,#C8A96E 85%,transparent);
  border-radius:4px;box-shadow:0 0 18px rgba(200,169,110,.5);}
.cg{position:absolute;left:50%;top:28%;width:14px;height:14px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,#EDD58A,#C8A96E);
  box-shadow:0 0 20px rgba(200,169,110,.8);}

/* TITEL */
.orn{color:rgba(200,169,110,.6);font-size:.85rem;letter-spacing:.6em;margin:8px 0;}
.title{
  font-family:'Cinzel Decorative','Cinzel',serif;
  font-size:clamp(1.8rem,8vw,2.6rem);
  color:#EDD58A;
  text-align:center;line-height:1.1;
  text-shadow:0 4px 24px rgba(0,0,0,.7),0 0 60px rgba(200,169,110,.15);
  letter-spacing:.04em;
}
.title-sub{
  font-family:'Cinzel',serif;
  font-size:.75rem;letter-spacing:.38em;
  color:#C8A96E;margin-top:6px;text-transform:uppercase;
}
.divider{
  width:80%;height:1px;margin:16px auto;
  background:linear-gradient(to right,transparent,#C8A96E,transparent);
}
.desc{
  font-family:'EB Garamond',serif;font-style:italic;
  font-size:clamp(.82rem,2.8vw,1rem);
  color:rgba(237,213,138,.7);text-align:center;line-height:1.85;
}
.stats{
  font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.12em;
  color:rgba(200,169,110,.4);margin-top:8px;text-align:center;
}

/* SPRACH-FLAGS */
.flags{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:10px 0;}
.fl{font-size:1.3rem;}

/* BUTTON */
.btn{
  display:inline-block;margin-top:10px;
  padding:10px 34px;
  background:linear-gradient(135deg,rgba(200,169,110,.15),rgba(200,169,110,.08));
  border:1px solid rgba(200,169,110,.5);
  color:#C8A96E;text-decoration:none;border-radius:2px;
  font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.15em;
  transition:all .2s;
}
.btn:hover{background:rgba(200,169,110,.28);box-shadow:0 4px 18px rgba(200,169,110,.2);}
</style>
</head>
<body>
<div class="cover">
  <div class="inner">
    <div>
      <div class="orn">✦ ❧ ✦ ❧ ✦</div>
      <div class="cross"><div class="cv"></div><div class="ch"></div><div class="cg"></div></div>
      <div class="orn">✦ ❧ ✦ ❧ ✦</div>
    </div>

    <div>
      <div class="title">BIBLIA<br>CATHOLICA</div>
      <div class="title-sub">Interlinearis</div>
      <div class="divider"></div>
      <div class="desc">
        Vulgata Clementina<br>
        cum Translationibus XIV<br>
        <em>Die Heilige Schrift in 14 Sprachen</em>
      </div>
      <div class="stats">73 Libri &nbsp;·&nbsp; 31.102 Versus &nbsp;·&nbsp; 14 Linguae</div>
    </div>

    <div>
      <div class="flags">${flags}</div>
      <a class="btn" href="index.html">Lege Nunc &nbsp;❯</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  RÜCKSEITE
// ═══════════════════════════════════════════════════════

function buildBackCover() {
  const rows = TRANSLATIONS.map(t =>
    `<div class="row"><span class="rf">${t.flag}</span><span class="rn">${t.native}</span><span class="rd">${t.display}</span></div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica – Rückseite</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{background:#04060F;min-height:100%;}
body{
  background:radial-gradient(ellipse at 70% 40%,#12193A 0%,#04060F 65%);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:24px;font-family:'EB Garamond',Georgia,serif;
}
.cover{
  width:min(520px,95vw);aspect-ratio:3/4.6;
  background:linear-gradient(175deg,#0E1428 0%,#192045 40%,#0E1428 100%);
  box-shadow:0 0 0 1px #7A5C1E,0 0 0 3px #0E1428,0 0 0 5px #C8A96E,
             0 0 0 7px #0E1428,0 0 0 9px #7A5C1E,
             0 40px 120px rgba(0,0,0,.95);
  border-radius:8px 3px 3px 8px;
  border-right:18px solid #0A0E1E;
  overflow:hidden;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
}
.cover::after{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(200,169,110,.025) 48px,rgba(200,169,110,.025) 49px),
    repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(200,169,110,.025) 48px,rgba(200,169,110,.025) 49px);
  pointer-events:none;
}
.inner{
  position:relative;z-index:1;
  width:calc(100% - 44px);margin:22px;
  flex:1;border:1px solid rgba(200,169,110,.55);
  padding:24px 20px 20px;
  display:flex;flex-direction:column;justify-content:space-between;gap:12px;
}
.inner::before{content:'';position:absolute;inset:7px;border:1px solid rgba(200,169,110,.2);pointer-events:none;}

.back-title{font-family:'Cinzel Decorative',serif;font-size:1.8rem;color:#C8A96E;text-align:center;line-height:1.2;}
.divider{width:80%;height:1px;margin:12px auto;background:linear-gradient(to right,transparent,#C8A96E,transparent);}
.blurb{font-style:italic;font-size:.92rem;color:rgba(237,213,138,.7);text-align:center;line-height:1.85;}
.lang-head{font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.25em;color:rgba(200,169,110,.5);text-align:center;margin-bottom:8px;}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:4px;}
.row{display:flex;align-items:center;gap:6px;padding:4px 7px;background:rgba(200,169,110,.05);border:1px solid rgba(200,169,110,.1);border-radius:2px;}
.rf{font-size:.85rem;}
.rn{font-family:'Cinzel',serif;font-size:.67rem;color:rgba(237,213,138,.75);flex:1;}
.rd{font-size:.55rem;color:rgba(200,169,110,.3);}
.verse-q{font-style:italic;font-size:.9rem;color:rgba(237,213,138,.6);text-align:center;line-height:1.75;margin-top:4px;}
.verse-r{font-family:'Cinzel',serif;font-size:.58rem;color:rgba(200,169,110,.35);text-align:center;margin-top:3px;}
.pd{font-family:'Cinzel',serif;font-size:.55rem;color:rgba(200,169,110,.28);text-align:center;line-height:1.7;margin-top:6px;}
.back-link{display:block;text-align:center;margin-top:8px;color:rgba(200,169,110,.4);text-decoration:none;font-family:'Cinzel',serif;font-size:.62rem;border:1px solid rgba(200,169,110,.18);padding:5px 16px;border-radius:2px;transition:all .2s;}
.back-link:hover{color:#C8A96E;border-color:rgba(200,169,110,.4);}
</style>
</head>
<body>
<div class="cover">
  <div class="inner">
    <div>
      <div class="back-title">BIBLIA<br>CATHOLICA</div>
      <div class="divider"></div>
      <div class="blurb">Die Heilige Schrift im Wechselgespräch:<br>Vulgata Clementina als Urtext<br>und 14 gemeinfreie Übersetzungen<br>für die christliche Weltbevölkerung.</div>
    </div>
    <div>
      <div class="lang-head">✦ Enthaltene Übersetzungen ✦</div>
      <div class="rows">${rows}</div>
    </div>
    <div>
      <div class="divider"></div>
      <div class="verse-q">«Scrutamini scripturas, quia vos putatis<br>in ipsis vitam aeternam habere.»</div>
      <div class="verse-r">Ioannes 5,39 · Vulgata Clementina</div>
      <div class="pd">Alle enthaltenen Texte sind gemeinfrei (Public Domain).<br>Urheberrechte nach geltendem Recht des jeweiligen Landes prüfen.</div>
      <a href="index.html" class="back-link">← Sprachauswahl</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  HAUPTINDEX (Sprachauswahl)
// ═══════════════════════════════════════════════════════

function buildMainIndex() {
  const cards = TRANSLATIONS.map(t => `
  <a href="${t.code}/index.html" class="lc">
    <span class="lf">${t.flag}</span>
    <span class="ln">${t.native}</span>
    <span class="ld">${t.display}</span>
  </a>`).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica Interlinearis</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#F7F1E8;font-family:'EB Garamond',serif;color:#1C1008;}

/* NAV */
.topbar{
  background:#0D1525;border-bottom:3px solid #B8962E;
  padding:12px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;
}
.topbar-title{font-family:'Cinzel Decorative',serif;font-size:.85rem;color:#C8A96E;text-decoration:none;}
.topbar-links{display:flex;gap:14px;}
.topbar-links a{font-family:'Cinzel',serif;font-size:.68rem;color:rgba(200,169,110,.65);text-decoration:none;letter-spacing:.06em;}
.topbar-links a:hover{color:#C8A96E;}

/* HEADER */
header{
  background:linear-gradient(165deg,#0D1525 0%,#1A2A4A 55%,#0D1525 100%);
  padding:64px 24px 48px;text-align:center;
  border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
header::before{
  content:'✦ ❧ ✦ ❧ ✦ ❧ ✦';
  position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
  color:rgba(200,169,110,.25);font-size:.85rem;letter-spacing:.55em;white-space:nowrap;
}
.hcross{font-size:3rem;color:#C8A96E;text-shadow:0 0 30px rgba(200,169,110,.4);margin-bottom:6px;}
.htitle{
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(2rem,6vw,3.2rem);
  color:#EDD58A;
  text-shadow:0 4px 24px rgba(0,0,0,.6);
  line-height:1.15;
}
.hsub{font-family:'Cinzel',serif;font-size:.92rem;color:#C8A96E;margin-top:12px;letter-spacing:.2em;}
.hlat{font-style:italic;color:rgba(200,169,110,.55);font-size:.85rem;margin-top:4px;}
.hstats{font-family:'Cinzel',serif;font-size:.62rem;color:rgba(200,169,110,.38);letter-spacing:.12em;margin-top:8px;}
.hbtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px;}
.hbtn{
  color:#C8A96E;border:1px solid rgba(200,169,110,.35);padding:9px 24px;
  text-decoration:none;font-family:'Cinzel',serif;font-size:.73rem;letter-spacing:.09em;
  border-radius:2px;background:rgba(200,169,110,.07);transition:background .2s;
}
.hbtn:hover{background:rgba(200,169,110,.22);}

/* SPRACH-SEKTION */
.sec{
  max-width:1040px;margin:36px auto 0;padding:0 22px;
  font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.22em;
  text-transform:uppercase;color:#8B6914;text-align:center;
}
.sec::after{
  content:'';display:block;width:180px;height:1px;
  background:linear-gradient(to right,transparent,#B8962E,transparent);
  margin:10px auto 24px;
}

/* SPRACHKARTEN */
.grid{
  max-width:1040px;margin:0 auto 72px;padding:0 22px;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;
}
.lc{
  display:flex;flex-direction:column;align-items:center;
  padding:28px 14px 22px;
  background:#fff;
  border:1px solid rgba(184,150,46,.18);
  border-top:4px solid #B8962E;
  border-radius:4px;text-decoration:none;color:#0D1525;
  transition:all .22s;
  box-shadow:0 2px 10px rgba(0,0,0,.06);
  text-align:center;
}
.lc:hover{
  transform:translateY(-6px);
  box-shadow:0 10px 32px rgba(184,150,46,.22);
  background:#FDF7E8;border-top-color:#EDD58A;
}
.lf{font-size:2.8rem;margin-bottom:10px;line-height:1;}
.ln{font-family:'Cinzel',serif;font-size:.88rem;font-weight:600;color:#0D1525;}
.ld{font-size:.68rem;color:#8B7040;margin-top:4px;line-height:1.4;}

/* FOOTER */
footer{
  background:#0D1525;border-top:4px solid #B8962E;
  color:rgba(200,169,110,.38);text-align:center;
  padding:30px 20px;font-family:'Cinzel',serif;
  font-size:.65rem;letter-spacing:.1em;line-height:2.2;
}
</style>
</head>
<body>

<nav class="topbar">
  <span class="topbar-title">✞ BIBLIA CATHOLICA INTERLINEARIS</span>
  <div class="topbar-links">
    <a href="cover.html">📖 Cover</a>
    <a href="back-cover.html">📕 Rückseite</a>
  </div>
</nav>

<header>
  <div class="hcross">✞</div>
  <div class="htitle">BIBLIA<br>CATHOLICA</div>
  <div class="hsub">Interlinearis</div>
  <div class="hlat">Vulgata Clementina cum Translationibus XIV</div>
  <div class="hstats">73 Libri &nbsp;·&nbsp; 31.102 Versus &nbsp;·&nbsp; 14 Linguae</div>
  <div class="hbtns">
    <a class="hbtn" href="cover.html">📖 Buchcover</a>
    <a class="hbtn" href="back-cover.html">📕 Rückseite</a>
  </div>
</header>

<p class="sec">❧ &nbsp; Electe Linguam Tuam &nbsp; ❧</p>

<main class="grid">
${cards}
</main>

<footer>
  BIBLIA CATHOLICA INTERLINEARIS<br>
  Vulgata Clementina (Public Domain) &nbsp;·&nbsp; 14 moderne Übersetzungen (Public Domain)<br>
  Texte: scrollmapper/bible_databases (MIT) &nbsp;·&nbsp; Kein urheberrechtlich geschützter Text
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SPRACHINDEX (Bücherliste)
// ═══════════════════════════════════════════════════════

function buildLangIndex(trans, availBooks) {
  const byTest = g => availBooks.filter(b => b.testament === g);
  const booksVT = byTest('VT'), booksNT = byTest('NT'), booksDK = byTest('DK');

  function bookList(books) {
    return books.map(b => `
  <a href="bücher/${bookFile(b)}" class="bc">
    <span class="bnr">${pad3(b.nr)}</span>
    <span class="binfo">
      <span class="blat">${b.latin}</span>
      <span class="bname">${b.name}</span>
    </span>
    <span class="barr">›</span>
  </a>`).join('');
  }

  const dkSec = booksDK.length ? `
<div class="sec-head">
  <span class="sec-t">Libri Deuterocanonoci</span>
  <span class="sec-s">Deuterokanonische Bücher · ${booksDK.length} Bücher</span>
</div>
<div class="blist">${bookList(booksDK)}</div>` : '';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica · ${trans.native}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#F7F1E8;font-family:'EB Garamond',serif;color:#1C1008;}

.topbar{background:#0D1525;border-bottom:3px solid #B8962E;padding:11px 28px;
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.topbar a{font-family:'Cinzel',serif;font-size:.72rem;color:rgba(200,169,110,.7);
  text-decoration:none;letter-spacing:.05em;}
.topbar a:hover{color:#C8A96E;}
.topbar .sep{color:rgba(200,169,110,.3);}

header{
  background:linear-gradient(160deg,#0D1525,#1A2A4A 50%,#0D1525);
  padding:48px 24px 36px;text-align:center;border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
header::before{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient(45deg,transparent,transparent 32px,rgba(200,169,110,.035) 32px,rgba(200,169,110,.035) 33px),
    repeating-linear-gradient(-45deg,transparent,transparent 32px,rgba(200,169,110,.035) 32px,rgba(200,169,110,.035) 33px);
  pointer-events:none;
}
.hflag{font-size:3.5rem;margin-bottom:10px;position:relative;}
.htitle{font-family:'Cinzel Decorative',serif;font-size:clamp(1.6rem,5vw,2.2rem);
  color:#EDD58A;text-shadow:0 3px 16px rgba(0,0,0,.5);position:relative;}
.hlang{font-family:'Cinzel',serif;font-size:.82rem;color:#C8A96E;margin-top:6px;
  letter-spacing:.15em;position:relative;}
.htrans{font-family:'Cinzel',serif;font-size:.68rem;color:rgba(200,169,110,.5);
  margin-top:4px;position:relative;}

.sec-head{
  max-width:860px;margin:26px auto 0;padding:0 20px;
  display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;
}
.sec-t{font-family:'Cinzel Decorative',serif;font-size:1rem;color:#0D1525;}
.sec-s{font-family:'Cinzel',serif;font-size:.65rem;color:#8B6914;letter-spacing:.08em;}
.sec-head::after{content:'';display:block;width:100%;height:1px;
  background:linear-gradient(to right,#B8962E,transparent);margin-top:5px;}

.blist{max-width:860px;margin:8px auto;padding:0 20px;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px;}
.bc{
  display:flex;align-items:center;gap:10px;padding:11px 13px;
  background:#fff;border:1px solid rgba(184,150,46,.18);border-left:4px solid #B8962E;
  border-radius:3px;text-decoration:none;color:#0D1525;
  transition:all .18s;box-shadow:0 1px 4px rgba(0,0,0,.05);
}
.bc:hover{background:#FDF7E8;box-shadow:0 4px 16px rgba(184,150,46,.22);transform:translateX(4px);}
.bnr{font-family:'Cinzel',serif;font-size:.58rem;color:#8B6914;min-width:28px;}
.binfo{display:flex;flex-direction:column;flex:1;}
.blat{font-family:'Cinzel',serif;font-size:.8rem;font-weight:600;color:#5A1010;}
.bname{font-size:.72rem;color:#556;margin-top:1px;}
.barr{color:rgba(184,150,46,.45);font-size:1rem;}

footer{
  background:#0D1525;border-top:3px solid #B8962E;
  color:rgba(200,169,110,.38);text-align:center;
  padding:22px 20px;font-family:'Cinzel',serif;
  font-size:.63rem;letter-spacing:.1em;line-height:2;margin-top:48px;
}
</style>
</head>
<body>

<nav class="topbar">
  <a href="../../index.html">✞ Biblia Catholica</a>
  <span class="sep">›</span>
  <span style="color:#C8A96E;font-family:'Cinzel',serif;font-size:.72rem;">${trans.flag} ${trans.native}</span>
</nav>

<header>
  <div class="hflag">${trans.flag}</div>
  <div class="htitle">BIBLIA CATHOLICA</div>
  <div class="hlang">${trans.native}</div>
  <div class="htrans">${trans.display}</div>
</header>

<div class="sec-head">
  <span class="sec-t">Vetus Testamentum</span>
  <span class="sec-s">Altes Testament · ${booksVT.length} Bücher</span>
</div>
<div class="blist">${bookList(booksVT)}</div>

<div class="sec-head">
  <span class="sec-t">Novum Testamentum</span>
  <span class="sec-s">Neues Testament · ${booksNT.length} Bücher</span>
</div>
<div class="blist">${bookList(booksNT)}</div>

${dkSec}

<footer>
  BIBLIA CATHOLICA INTERLINEARIS &nbsp;·&nbsp; Vulgata Clementina &amp; ${trans.display}
  &nbsp;·&nbsp; ${availBooks.length} Bücher &nbsp;·&nbsp; Public Domain
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  BUCHSEITE (Interlinear)
// ═══════════════════════════════════════════════════════

function buildBookPage(book, trans, vulgChaps, transChaps) {
  // Vers-Map für Übersetzung
  const tm = {};
  if (transChaps) {
    for (const ch of transChaps) {
      tm[ch.nr] = {};
      for (const v of ch.verses) tm[ch.nr][v.nr] = v.text;
    }
  }

  const bookIdx = BOOKS.findIndex(b => b.nr === book.nr);
  const prev    = BOOKS[bookIdx - 1];
  const next    = BOOKS[bookIdx + 1];

  const testLabel = book.testament === 'NT' ? 'NOVUM TESTAMENTUM'
    : book.testament === 'DK' ? 'LIBRI DEUTEROCANONOCI' : 'VETUS TESTAMENTUM';

  const chCount = vulgChaps.length;
  const vCount  = vulgChaps.reduce((s, c) => s + c.verses.length, 0);

  const chapBlocks = vulgChaps.map(ch => {
    const verseBlocks = ch.verses.map((v, vi) => {
      const lat  = esc(v.text);
      const tra  = esc((tm[ch.nr] || {})[v.nr] || '');
      const dropcap = vi === 0 ? ' first' : '';
      return `<div class="vb${dropcap}" id="v${ch.nr}-${v.nr}">
  <span class="vn">${v.nr}</span>
  <div class="vt">
    <p class="lat">${lat}</p>${tra ? `\n    <p class="tra">${tra}</p>` : ''}
  </div>
</div>`;
    }).join('\n');

    return `<section class="chap" id="c${ch.nr}">
  <div class="chhead">
    <span class="chrom">${toRoman(ch.nr)}</span>
    <span class="chlbl">Caput ${ch.nr}</span>
  </div>
${verseBlocks}
</section>`;
  }).join('\n\n');

  const prevLink = prev
    ? `<a href="${bookFile(prev)}">← ${prev.latin}</a>`
    : `<span class="dim">◀</span>`;
  const nextLink = next
    ? `<a href="${bookFile(next)}">${next.latin} →</a>`
    : `<span class="dim">▶</span>`;

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${book.latin} · ${trans.native} · Biblia Catholica</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#F7F1E8;font-family:'EB Garamond',serif;color:#1C1008;font-size:17px;}

/* STICKY NAV */
.nav{
  background:#0D1525;padding:9px 28px;
  display:flex;align-items:center;gap:10px;flex-wrap:wrap;
  border-bottom:2px solid #B8962E;
  position:sticky;top:0;z-index:100;
  box-shadow:0 3px 14px rgba(0,0,0,.45);
}
.nav a{color:rgba(200,169,110,.75);text-decoration:none;
  font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.05em;}
.nav a:hover{color:#C8A96E;}
.nav .home{color:#C8A96E;font-weight:600;font-size:.78rem;}
.nav .sep{color:rgba(200,169,110,.28);}
.nav .spacer{flex:1;}
.nav .pos{color:rgba(200,169,110,.35);font-family:'Cinzel',serif;font-size:.65rem;}

/* BUCHKOPF */
.bhead{
  background:linear-gradient(162deg,#0D1525 0%,#1A2A4A 55%,#0D1525 100%);
  padding:52px 28px 38px;text-align:center;border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
.bhead::before{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient( 45deg,transparent,transparent 32px,rgba(200,169,110,.032) 32px,rgba(200,169,110,.032) 33px),
    repeating-linear-gradient(-45deg,transparent,transparent 32px,rgba(200,169,110,.032) 32px,rgba(200,169,110,.032) 33px);
  pointer-events:none;
}
.bhead::after{
  content:'✦ ❧ ✦ ❧ ✦';position:absolute;bottom:12px;left:50%;
  transform:translateX(-50%);color:rgba(200,169,110,.25);
  font-size:.8rem;letter-spacing:.55em;white-space:nowrap;
}
.btestament{
  display:inline-block;border:1px solid rgba(200,169,110,.35);
  color:rgba(200,169,110,.55);font-family:'Cinzel',serif;
  font-size:.58rem;letter-spacing:.28em;padding:4px 16px;
  border-radius:2px;margin-bottom:14px;position:relative;
}
.blatin{
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(2rem,7vw,3.4rem);
  color:#EDD58A;
  text-shadow:0 4px 20px rgba(0,0,0,.6);
  letter-spacing:.06em;position:relative;
}
.btrans{font-family:'Cinzel',serif;font-size:1rem;color:#C8A96E;
  margin-top:8px;letter-spacing:.14em;position:relative;}
.bmeta{font-size:.7rem;color:rgba(200,169,110,.42);margin-top:6px;
  font-family:'Cinzel',serif;letter-spacing:.07em;position:relative;}

/* INHALT */
.content{max-width:900px;margin:0 auto;padding:8px 24px 80px;}

/* KAPITEL */
.chap{margin-top:8px;}
.chhead{
  display:flex;align-items:center;gap:16px;
  padding:30px 0 14px;
  border-bottom:2px solid rgba(184,150,46,.3);
  margin-bottom:2px;
}
.chrom{
  font-family:'Cinzel Decorative',serif;
  font-size:2.2rem;color:#B8962E;
  min-width:50px;text-align:center;flex-shrink:0;
  text-shadow:0 1px 10px rgba(184,150,46,.25);
}
.chlbl{
  font-family:'Cinzel',serif;font-size:.65rem;
  color:rgba(184,150,46,.55);letter-spacing:.22em;text-transform:uppercase;
}

/* VERS */
.vb{
  display:flex;gap:0;
  padding:13px 0;
  border-bottom:1px solid rgba(184,150,46,.13);
}
.vb:nth-child(even){background:rgba(255,255,255,.55);}
.vb:nth-child(odd){background:rgba(247,241,232,.6);}

.vn{
  flex-shrink:0;width:36px;padding-top:2px;
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(184,150,46,.6);text-align:right;
  padding-right:10px;line-height:1.9;
}

.vt{padding:0 18px 0 6px;flex:1;}

/* Lateinischer Text */
.lat{
  font-family:'EB Garamond',serif;
  font-size:1.1rem;font-weight:500;line-height:1.9;
  color:#4A1010;
  border-left:3px solid #B8962E;
  padding-left:12px;
  margin-bottom:6px;
}

/* Übersetzung */
.tra{
  font-family:'EB Garamond',serif;
  font-size:1rem;font-style:italic;line-height:1.85;
  color:#1C2840;
  padding-left:15px;
}

/* Drop-Cap erstes Kapitel-Wort */
.vb.first .lat::first-letter{
  font-size:4em;float:left;line-height:.72;
  padding-right:.08em;margin-top:.05em;
  font-family:'Cinzel Decorative',serif;color:#B8962E;
}

/* BUCH-NAVIGATION */
.bnav{
  display:flex;justify-content:space-between;align-items:center;
  background:#0D1525;border-top:3px solid #B8962E;
  padding:12px 24px;gap:12px;
}
.bnav a,.bnav .dim{
  color:#C8A96E;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.07em;
  padding:6px 16px;border:1px solid rgba(200,169,110,.28);border-radius:2px;
  transition:background .18s;
}
.bnav a:hover{background:rgba(200,169,110,.15);}
.bnav .dim{color:rgba(200,169,110,.2);border-color:rgba(200,169,110,.1);}
.bnav .center{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:rgba(200,169,110,.45);text-align:center;
}

/* FUßZEILE */
.foot{
  background:#0D1525;border-top:2px solid rgba(184,150,46,.3);
  padding:16px 24px;text-align:center;
  color:rgba(200,169,110,.35);font-family:'Cinzel',serif;
  font-size:.62rem;letter-spacing:.1em;
}

/* DRUCK */
@media print{
  .nav,.bnav{display:none;}
  .bhead{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .vb{break-inside:avoid;}
}

/* MOBIL */
@media(max-width:600px){
  .blatin{font-size:2rem;}
  .lat{font-size:1rem;}
  .tra{font-size:.94rem;}
  .content{padding:4px 12px 60px;}
  .chrom{font-size:1.7rem;}
}
</style>
</head>
<body>

<nav class="nav">
  <a class="home" href="../../../index.html">✞ Biblia Catholica</a>
  <span class="sep">›</span>
  <a href="../index.html">${trans.flag} ${trans.native}</a>
  <span class="sep">›</span>
  <span style="color:#C8A96E;font-family:'Cinzel',serif;font-size:.7rem;">${book.latin}</span>
  <span class="spacer"></span>
  <span class="pos">${pad3(book.nr)} / 073</span>
</nav>

<header class="bhead">
  <div class="btestament">${testLabel}</div>
  <div class="blatin">${book.latin.toUpperCase()}</div>
  <div class="btrans">${book.name}</div>
  <div class="bmeta">Vulgata Clementina &nbsp;·&nbsp; ${trans.display} &nbsp;·&nbsp; ${chCount} Capita &nbsp;·&nbsp; ${vCount} Versus</div>
</header>

<main class="content">
${chapBlocks}
</main>

<nav class="bnav">
  ${prevLink}
  <span class="center">${book.latin}<br>${trans.native}</span>
  ${nextLink}
</nav>

<footer class="foot">
  BIBLIA CATHOLICA INTERLINEARIS &nbsp;·&nbsp; Vulgata Clementina &amp; ${trans.display}
  &nbsp;·&nbsp; Public Domain
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA INTERLINEARIS – REDESIGN v2        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌  Kein "data/"-Ordner. Bitte zuerst: node fetch-texts.js\n');
    process.exit(1);
  }

  mkDir(OUT_DIR);

  // Cover + Rückseite + Hauptindex
  fs.writeFileSync(path.join(OUT_DIR, 'cover.html'),      buildCover());       console.log('  ✓ cover.html');
  fs.writeFileSync(path.join(OUT_DIR, 'back-cover.html'), buildBackCover());   console.log('  ✓ back-cover.html');

  // Vulgata laden
  const vulg = {};
  for (const book of BOOKS) {
    const raw = loadBook('vulgate', book.nr);
    if (raw) vulg[book.nr] = parseBook(raw);
  }
  console.log(`  ✓ Vulgata: ${Object.keys(vulg).length} Bücher`);

  // Pro Übersetzung
  for (const trans of TRANSLATIONS) {
    process.stdout.write(`\n  📖  ${trans.flag} ${trans.native} (${trans.code}) ...`);

    const tDir  = path.join(OUT_DIR, trans.code);
    const bDir  = path.join(tDir, 'bücher');
    mkDir(bDir);

    const avail = [];
    for (const book of BOOKS) {
      if (!vulg[book.nr]) continue;
      const tRaw = loadBook(trans.code, book.nr);
      const tChap = tRaw ? parseBook(tRaw) : null;
      fs.writeFileSync(path.join(bDir, bookFile(book)), buildBookPage(book, trans, vulg[book.nr], tChap));
      avail.push(book);
    }
    fs.writeFileSync(path.join(tDir, 'index.html'), buildLangIndex(trans, avail));
    process.stdout.write(` ✓ (${avail.length} Bücher)\n`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildMainIndex());
  console.log('\n  ✓ index.html\n');

  console.log('✅  Fertig! Öffne: Übersetzungen/cover.html\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  process.exit(1);
});
