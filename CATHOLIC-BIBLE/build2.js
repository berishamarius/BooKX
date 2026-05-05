'use strict';
/**
 * BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR v3
 * Kirchliches Redesign: illuminierte Bibel, Cover pro Sprache,
 * Übersetzung primär · Vulgata sekundär · gotische Kirchenkunst
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
  { code: 'albanian',   lang: 'sq', native: 'Shqip',      display: 'Bibla (UFSHB)',                     flag: '🇦🇱' },
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
//  NATIVE BIBEL-TITEL
// ═══════════════════════════════════════════════════════
const BIBLE_NAMES = {
  en: 'The Holy Bible',
  de: 'Die Heilige Bibel',
  fr: 'La Sainte Bible',
  es: 'La Santa Biblia',
  pt: 'A Bíblia Sagrada',
  pl: 'Pismo Święte',
  ru: 'Священное Писание',
  hr: 'Sveto Pismo',
  nl: 'De Heilige Bijbel',
  hu: 'A Szentírás',
  cs: 'Písmo Svaté',
  sv: 'Den Heliga Bibeln',
  tl: 'Ang Banal na Bibliya',
  uk: 'Священне Письмо',
  sq: 'Bibla e Shenjtë',
};

// SVG: Kirchenfenster-Rosette
const ROSE_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="rose">
  <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(200,169,110,.45)" stroke-width="1.5"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(200,169,110,.25)" stroke-width="1"/>
  <circle cx="100" cy="100" r="28" fill="none" stroke="rgba(200,169,110,.6)" stroke-width="1.5"/>
  ${[0,45,90,135,180,225,270,315].map(a=>{
    const r=a*Math.PI/180, x1=100+30*Math.sin(r), y1=100-30*Math.cos(r),
          x2=100+78*Math.sin(r), y2=100-78*Math.cos(r);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(200,169,110,.35)" stroke-width="1"/>`;
  }).join('')}
  ${[0,45,90,135,180,225,270,315].map(a=>{
    const r=a*Math.PI/180, x=100+54*Math.sin(r), y=100-54*Math.cos(r);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="none" stroke="rgba(200,169,110,.4)" stroke-width="1"/>`;
  }).join('')}
  <text x="100" y="108" text-anchor="middle" font-size="32" fill="rgba(200,169,110,.8)" font-family="serif">✝</text>
</svg>`;

// ═══════════════════════════════════════════════════════
//  COVER (Haupt)
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
.cover{
  width:min(520px,95vw);
  aspect-ratio:3/4.6;
  position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  background:linear-gradient(175deg,#0C1122 0%,#182040 40%,#0C1122 100%);
  box-shadow:
    0 0 0 1px #6B4E1A,
    0 0 0 3px #0C1122,
    0 0 0 5px #C8A96E,
    0 0 0 7px #0C1122,
    0 0 0 9px #6B4E1A,
    0 60px 160px rgba(0,0,0,.98),
    inset 4px 0 12px rgba(0,0,0,.5),
    inset 0 0 100px rgba(0,0,0,.3);
  border-radius:3px 8px 8px 3px;
  border-left:22px solid #070B18;
  overflow:hidden;
}
/* Textur: Ledermaserung */
.cover::before{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient(87deg,transparent,transparent 3px,rgba(0,0,0,.12) 3px,rgba(0,0,0,.12) 4px),
    repeating-linear-gradient(0deg,transparent,transparent 6px,rgba(200,169,110,.012) 6px,rgba(200,169,110,.012) 7px);
  pointer-events:none;
}
/* Goldgitter */
.cover::after{
  content:'';position:absolute;inset:0;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 55px,rgba(200,169,110,.022) 55px,rgba(200,169,110,.022) 56px),
    repeating-linear-gradient(90deg,transparent,transparent 55px,rgba(200,169,110,.022) 55px,rgba(200,169,110,.022) 56px);
  pointer-events:none;
}
.inner{
  position:relative;z-index:1;
  width:calc(100% - 48px);margin:24px;
  flex:1;
  border:1px solid rgba(200,169,110,.5);
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:28px 22px 24px;
}
/* Innerer Rahmen: Doppellinie */
.inner::before{
  content:'';position:absolute;inset:6px;
  border:1px solid rgba(200,169,110,.18);
  pointer-events:none;
}
/* Eckverzierungen */
.inner::after{
  content:'✦';
  position:absolute;top:11px;left:11px;
  color:rgba(200,169,110,.4);font-size:.65rem;
}
.corner-br,.corner-tr,.corner-bl{
  position:absolute;color:rgba(200,169,110,.4);font-size:.65rem;
}
.corner-tr{top:11px;right:11px;}
.corner-bl{bottom:11px;left:11px;}
.corner-br{bottom:11px;right:11px;}

/* ROSETTE */
.rose{width:110px;height:110px;margin-bottom:6px;filter:drop-shadow(0 0 12px rgba(200,169,110,.25));}

/* BOGENFENSTER-ORNAMENT */
.arch{
  width:100%;text-align:center;
  font-family:'Cinzel',serif;font-size:.75rem;
  color:rgba(200,169,110,.5);letter-spacing:.45em;
  margin:4px 0 10px;
}

/* TITEL */
.title{
  font-family:'Cinzel Decorative','Cinzel',serif;
  font-size:clamp(1.9rem,8.5vw,2.7rem);
  color:#EDD58A;
  text-align:center;line-height:1.05;
  text-shadow:0 4px 28px rgba(0,0,0,.75),0 0 80px rgba(200,169,110,.12);
  letter-spacing:.05em;
}
.title-sub{
  font-family:'Cinzel',serif;
  font-size:.7rem;letter-spacing:.42em;
  color:#C8A96E;margin-top:7px;text-transform:uppercase;
}
.divider{
  width:85%;height:1px;margin:14px auto;
  background:linear-gradient(to right,transparent,#C8A96E 20%,#EDD58A 50%,#C8A96E 80%,transparent);
}
.desc{
  font-family:'EB Garamond',serif;font-style:italic;
  font-size:clamp(.82rem,2.8vw,.98rem);
  color:rgba(237,213,138,.65);text-align:center;line-height:2;
}
.stats{
  font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.12em;
  color:rgba(200,169,110,.38);margin-top:8px;text-align:center;
}

/* SPRACH-FLAGS */
.flags{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:10px 0;}
.fl{font-size:1.2rem;}

/* BUTTON */
.btn{
  display:inline-block;margin-top:10px;
  padding:10px 36px;
  background:linear-gradient(135deg,rgba(200,169,110,.12),rgba(200,169,110,.06));
  border:1px solid rgba(200,169,110,.45);
  color:#C8A96E;text-decoration:none;border-radius:2px;
  font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.18em;
  transition:all .2s;
}
.btn:hover{background:rgba(200,169,110,.25);box-shadow:0 6px 22px rgba(200,169,110,.18);}
</style>
</head>
<body>
<div class="cover">
  <div class="inner">
    <span class="corner-tr">✦</span>
    <span class="corner-bl">✦</span>
    <span class="corner-br">✦</span>
    <div>
      <div style="text-align:center">${ROSE_SVG}</div>
      <div class="arch">✦ ❦ ✦ ❦ ✦</div>
    </div>
    <div>
      <div class="title">BIBLIA<br>CATHOLICA</div>
      <div class="title-sub">Interlinearis</div>
      <div class="divider"></div>
      <div class="desc">
        Vulgata Clementina<br>
        cum Translationibus Quindecim<br>
        <em>Die Heilige Schrift in 15 Sprachen</em>
      </div>
      <div class="stats">73 Libri &nbsp;·&nbsp; 31.102 Versus &nbsp;·&nbsp; 15 Linguae</div>
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
//  SPRACHCOVER (pro Übersetzung)
// ═══════════════════════════════════════════════════════

function buildLangCover(trans) {
  const bibName = BIBLE_NAMES[trans.lang] || 'Holy Bible';

  // Gotisches Kirchenfenster mit Engeln, Rosette und Lichtbrechung als SVG
  const WINDOW_SVG = `<svg viewBox="0 0 400 580" xmlns="http://www.w3.org/2000/svg" class="church-window" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#FFE8A0" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#7B1C2A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rosGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD070" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#C8A030" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <!-- Licht-Hintergrund -->
  <ellipse cx="200" cy="160" rx="180" ry="240" fill="url(#glow)"/>

  <!-- GOTISCHER SPITZBOGEN – Außen -->
  <path d="M 30 560 L 30 200 Q 30 20 200 20 Q 370 20 370 200 L 370 560 Z"
    fill="none" stroke="rgba(200,160,50,.55)" stroke-width="2.5"/>
  <!-- Innenrahmen Bogen -->
  <path d="M 50 555 L 50 205 Q 50 45 200 45 Q 350 45 350 205 L 350 555 Z"
    fill="none" stroke="rgba(200,160,50,.28)" stroke-width="1.2"/>

  <!-- MASSWERK: Drei Lanzetten unten -->
  <path d="M 65 555 L 65 320 Q 65 240 130 240 Q 195 240 195 320 L 195 555 Z"
    fill="none" stroke="rgba(200,160,50,.35)" stroke-width="1.2"/>
  <path d="M 205 555 L 205 320 Q 205 240 270 240 Q 335 240 335 320 L 335 555 Z"
    fill="none" stroke="rgba(200,160,50,.35)" stroke-width="1.2"/>
  <!-- Mittlere große Lanzette -->
  <path d="M 120 555 L 120 280 Q 120 170 200 170 Q 280 170 280 280 L 280 555 Z"
    fill="none" stroke="rgba(200,160,50,.45)" stroke-width="1.5"/>

  <!-- ROSETTE oben im Bogen -->
  <circle cx="200" cy="110" r="68" fill="none" stroke="rgba(200,160,50,.5)" stroke-width="1.8"/>
  <circle cx="200" cy="110" r="52" fill="none" stroke="rgba(200,160,50,.3)" stroke-width="1"/>
  <circle cx="200" cy="110" r="22" fill="rgba(200,160,50,.07)" stroke="rgba(200,160,50,.55)" stroke-width="1.5"/>
  <!-- Rosetten-Speichen -->
  ${[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
    const rad=a*Math.PI/180, x1=200+24*Math.sin(rad), y1=110-24*Math.cos(rad),
          x2=200+50*Math.sin(rad), y2=110-50*Math.cos(rad);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(200,160,50,.38)" stroke-width="1"/>`;
  }).join('')}
  <!-- Rosetten-Blätter -->
  ${[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
    const rad=a*Math.PI/180, x=200+36*Math.sin(rad), y=110-36*Math.cos(rad);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="none" stroke="rgba(200,160,50,.42)" stroke-width="1"/>`;
  }).join('')}
  <!-- Kreuz in Rosette -->
  <line x1="200" y1="92" x2="200" y2="128" stroke="rgba(220,180,60,.8)" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="183" y1="107" x2="217" y2="107" stroke="rgba(220,180,60,.8)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="200" cy="107" r="4" fill="rgba(255,210,80,.6)"/>

  <!-- ENGEL LINKS (stilisiert, gotisch) -->
  <!-- Kopf -->
  <circle cx="105" cy="355" r="14" fill="none" stroke="rgba(200,160,50,.32)" stroke-width="1.2"/>
  <!-- Heiligenschein -->
  <circle cx="105" cy="349" r="19" fill="none" stroke="rgba(200,160,50,.22)" stroke-width=".8" stroke-dasharray="3 2"/>
  <!-- Körper/Gewand -->
  <path d="M 90 370 Q 88 420 82 460 Q 100 468 105 468 Q 110 468 128 460 Q 122 420 120 370 Z"
    fill="none" stroke="rgba(200,160,50,.28)" stroke-width="1.2"/>
  <!-- Gewandfalten -->
  <line x1="98" y1="375" x2="94" y2="455" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <line x1="105" y1="373" x2="105" y2="458" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <line x1="112" y1="375" x2="116" y2="455" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <!-- Flügel links oben -->
  <path d="M 90 380 Q 55 340 50 290 Q 60 310 75 340 Q 82 360 88 375 Z"
    fill="rgba(200,160,50,.06)" stroke="rgba(200,160,50,.3)" stroke-width="1"/>
  <path d="M 90 388 Q 48 370 38 320 Q 52 345 70 365 Q 80 375 87 388 Z"
    fill="rgba(200,160,50,.04)" stroke="rgba(200,160,50,.22)" stroke-width=".8"/>
  <!-- Arme/Hände betend -->
  <path d="M 100 400 Q 90 415 88 430" fill="none" stroke="rgba(200,160,50,.25)" stroke-width="1.2"/>
  <path d="M 110 400 Q 120 415 112 430" fill="none" stroke="rgba(200,160,50,.25)" stroke-width="1.2"/>
  <ellipse cx="100" cy="433" rx="8" ry="5" fill="none" stroke="rgba(200,160,50,.2)" stroke-width="1"/>

  <!-- ENGEL RECHTS (stilisiert, gotisch) -->
  <circle cx="295" cy="355" r="14" fill="none" stroke="rgba(200,160,50,.32)" stroke-width="1.2"/>
  <circle cx="295" cy="349" r="19" fill="none" stroke="rgba(200,160,50,.22)" stroke-width=".8" stroke-dasharray="3 2"/>
  <path d="M 280 370 Q 278 420 272 460 Q 290 468 295 468 Q 300 468 318 460 Q 312 420 310 370 Z"
    fill="none" stroke="rgba(200,160,50,.28)" stroke-width="1.2"/>
  <line x1="288" y1="375" x2="284" y2="455" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <line x1="295" y1="373" x2="295" y2="458" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <line x1="302" y1="375" x2="306" y2="455" stroke="rgba(200,160,50,.18)" stroke-width=".8"/>
  <!-- Flügel rechts oben -->
  <path d="M 310 380 Q 345 340 350 290 Q 340 310 325 340 Q 318 360 312 375 Z"
    fill="rgba(200,160,50,.06)" stroke="rgba(200,160,50,.3)" stroke-width="1"/>
  <path d="M 310 388 Q 352 370 362 320 Q 348 345 330 365 Q 320 375 313 388 Z"
    fill="rgba(200,160,50,.04)" stroke="rgba(200,160,50,.22)" stroke-width=".8"/>
  <path d="M 300 400 Q 290 415 288 430" fill="none" stroke="rgba(200,160,50,.25)" stroke-width="1.2"/>
  <path d="M 290 400 Q 300 415 302 430" fill="none" stroke="rgba(200,160,50,.25)" stroke-width="1.2"/>
  <ellipse cx="295" cy="433" rx="8" ry="5" fill="none" stroke="rgba(200,160,50,.2)" stroke-width="1"/>

  <!-- Licht-Glow Rosette -->
  <circle cx="200" cy="110" r="55" fill="url(#rosGlow)" filter="url(#blur2)"/>

  <!-- Horizontale Trennlinien -->
  <line x1="55" y1="240" x2="345" y2="240" stroke="rgba(200,160,50,.3)" stroke-width=".8"/>
  <line x1="70" y1="248" x2="330" y2="248" stroke="rgba(200,160,50,.15)" stroke-width=".5"/>

  <!-- Sterne / Punkte Deko -->
  ${[60,100,140,180,220,260,300,340].map((x,i)=>`<circle cx="${x}" cy="268" r="1.5" fill="rgba(200,160,50,.${3+i%3})"/>`).join('')}
</svg>`;

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${bibName} · ${trans.native}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{background:#1A0508;min-height:100%;}
body{
  background:radial-gradient(ellipse at 40% 30%,#3D0C14 0%,#1A0508 55%,#0D0206 100%);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:24px;font-family:'EB Garamond',Georgia,serif;
}

/* BUCHKÖRPER */
.cover{
  width:min(600px,96vw);
  aspect-ratio:3/4.5;
  position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  /* Weinrot-Einband mit Tiefe */
  background:
    linear-gradient(175deg,#2A0810 0%,#4A1020 30%,#6B1830 50%,#4A1020 70%,#2A0810 100%);
  box-shadow:
    0 0 0 1px #8B3A1A,
    0 0 0 3px #2A0810,
    0 0 0 5px #C8882E,
    0 0 0 8px #2A0810,
    0 0 0 10px #8B3A1A,
    0 0 0 12px #2A0810,
    0 70px 200px rgba(0,0,0,.99),
    inset 6px 0 18px rgba(0,0,0,.65),
    inset 0 0 120px rgba(80,10,20,.35);
  border-radius:3px 10px 10px 3px;
  border-left:26px solid #180408;
  overflow:hidden;
}
/* Ledertextur */
.cover::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    repeating-linear-gradient(89deg,transparent,transparent 2px,rgba(0,0,0,.18) 2px,rgba(0,0,0,.18) 3px),
    repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(120,30,20,.08) 4px,rgba(120,30,20,.08) 5px);
}
/* Goldgitter */
.cover::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(200,140,46,.018) 60px,rgba(200,140,46,.018) 61px),
    repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(200,140,46,.018) 60px,rgba(200,140,46,.018) 61px);
}

/* INNERER RAHMEN */
.inner{
  position:relative;z-index:2;
  width:calc(100% - 50px);margin:25px;
  flex:1;
  border:1.5px solid rgba(200,140,46,.6);
  display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:26px 20px 28px;
}
.inner::before{content:'';position:absolute;inset:7px;border:1px solid rgba(200,140,46,.2);pointer-events:none;}
/* Ecken */
.ec{position:absolute;color:rgba(200,140,46,.5);font-size:.7rem;line-height:1;}
.ec-tl{top:12px;left:12px;} .ec-tr{top:12px;right:12px;}
.ec-bl{bottom:12px;left:12px;} .ec-br{bottom:12px;right:12px;}

/* KIRCHENFENSTER SVG */
.church-window{
  position:absolute;inset:0;width:100%;height:100%;
  opacity:.85;pointer-events:none;
}

/* INHALT über SVG */
.content{
  position:relative;z-index:3;
  width:100%;display:flex;flex-direction:column;align-items:center;
  gap:0;
}

/* BIBELNAMEN (Latein) */
.lat-title{
  font-family:'Cinzel Decorative','Cinzel',serif;
  font-size:clamp(2rem,9vw,3rem);
  color:#EDD58A;
  text-align:center;line-height:1.05;
  text-shadow:
    0 0 60px rgba(200,140,46,.6),
    0 4px 32px rgba(0,0,0,.85),
    0 0 120px rgba(200,140,46,.2);
  letter-spacing:.06em;
  margin-bottom:4px;
}
.lat-sub{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:rgba(200,140,46,.7);letter-spacing:.5em;
  text-align:center;margin-bottom:12px;
}

/* DIVIDER */
.div-main{
  width:90%;margin:8px auto;
  height:1px;
  background:linear-gradient(to right,transparent,#C8882E 15%,#EDD58A 50%,#C8882E 85%,transparent);
  box-shadow:0 0 8px rgba(200,140,46,.3);
}
.div-thin{
  width:60%;margin:6px auto;
  height:1px;
  background:linear-gradient(to right,transparent,rgba(200,140,46,.4),transparent);
}

/* FLAGGE */
.flag{font-size:2.6rem;margin:10px 0 2px;filter:drop-shadow(0 3px 10px rgba(0,0,0,.7));}

/* NATIVE TITEL (Übersetzungssprache) */
.nat-title{
  font-family:'Cinzel','EB Garamond',serif;
  font-size:clamp(1.1rem,4.5vw,1.5rem);
  color:rgba(237,213,138,.78);
  text-align:center;line-height:1.2;
  text-shadow:0 2px 18px rgba(0,0,0,.7);
  letter-spacing:.12em;
  margin-bottom:2px;
}
.nat-lang{
  font-family:'Cinzel',serif;font-size:.6rem;
  color:rgba(200,140,46,.5);letter-spacing:.3em;text-align:center;
}

/* VERS-ZITAT */
.quote-block{
  margin:10px 0 4px;
  border-left:2px solid rgba(200,140,46,.4);
  border-right:2px solid rgba(200,140,46,.4);
  padding:8px 16px;
  text-align:center;
}
.quote-lat{
  font-family:'EB Garamond',serif;font-style:italic;
  font-size:clamp(.82rem,2.8vw,1rem);
  color:rgba(237,213,138,.72);line-height:2;
}
.quote-ref{
  font-family:'Cinzel',serif;font-size:.54rem;
  color:rgba(200,140,46,.4);letter-spacing:.1em;margin-top:4px;
}

/* EDITIONS-INFO */
.edition{
  font-family:'Cinzel',serif;font-size:.55rem;
  color:rgba(200,140,46,.35);letter-spacing:.12em;
  text-align:center;margin-top:6px;
}

/* BUTTON */
.btn{
  display:inline-block;margin-top:14px;
  padding:12px 44px;
  background:linear-gradient(135deg,rgba(200,140,46,.18),rgba(200,140,46,.08));
  border:1.5px solid rgba(200,140,46,.55);
  color:#C8882E;text-decoration:none;border-radius:2px;
  font-family:'Cinzel',serif;font-size:.8rem;letter-spacing:.22em;
  transition:all .25s;
  text-shadow:0 1px 8px rgba(0,0,0,.5);
  box-shadow:0 2px 16px rgba(0,0,0,.4);
}
.btn:hover{
  background:rgba(200,140,46,.3);
  box-shadow:0 6px 28px rgba(200,140,46,.22);
  color:#EDD58A;
}
</style>
</head>
<body>
<div class="cover">
  <!-- Kirchenfenster-Hintergrund -->
  ${WINDOW_SVG}

  <div class="inner">
    <span class="ec ec-tl">✦</span><span class="ec ec-tr">✦</span>
    <span class="ec ec-bl">✦</span><span class="ec ec-br">✦</span>

    <!-- Platz für Rosette oben -->
    <div style="height:130px;"></div>

    <div class="content">
      <!-- LATEIN DOMINANT -->
      <div class="lat-title">BIBLIA<br>CATHOLICA</div>
      <div class="lat-sub">VULGATA CLEMENTINA</div>

      <div class="div-main"></div>

      <!-- FLAGGE + NATIVE TITEL -->
      <div class="flag">${trans.flag}</div>
      <div class="nat-title">${bibName}</div>
      <div class="nat-lang">${trans.native.toUpperCase()} &nbsp;·&nbsp; ${trans.display}</div>

      <div class="div-thin"></div>

      <!-- ZITAT -->
      <div class="quote-block">
        <div class="quote-lat">«In principio erat Verbum,<br>et Verbum erat apud Deum,<br>et Deus erat Verbum.»</div>
        <div class="quote-ref">Ioannes I,1 · Vulgata Clementina</div>
      </div>

      <div class="edition">73 Libri &nbsp;·&nbsp; 15 Linguae &nbsp;·&nbsp; Public Domain</div>

      <a class="btn" href="index.html">Legere &nbsp;❯</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SPRACHCOVER v2 – Echtes Buntglas, weinrot, kirchlich
// ═══════════════════════════════════════════════════════

function buildLangCover2(trans) {
  const bibName = BIBLE_NAMES[trans.lang] || 'Holy Bible';
  const RX = 200, RY = 108;
  let petals = '', spokes = '';
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180;
    const px = (RX + 40*Math.sin(a)).toFixed(1), py = (RY - 40*Math.cos(a)).toFixed(1);
    const l1x = (RX + 25*Math.sin(a)).toFixed(1), l1y = (RY - 25*Math.cos(a)).toFixed(1);
    const l2x = (RX + 55*Math.sin(a)).toFixed(1), l2y = (RY - 55*Math.cos(a)).toFixed(1);
    const col = i % 2 === 0 ? 'rgba(18,42,145,.75)' : 'rgba(148,10,18,.75)';
    petals += `<circle cx="${px}" cy="${py}" r="12" fill="${col}" stroke="#160702" stroke-width="1.8"/>`;
    spokes += `<line x1="${l1x}" y1="${l1y}" x2="${l2x}" y2="${l2y}" stroke="#160702" stroke-width="2"/>`;
  }
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5 * Math.PI / 180;
    const rx2 = (200 + 68*Math.sin(a)).toFixed(1), ry2 = (405 - 68*Math.cos(a)).toFixed(1);
    rays += `<line x1="200" y1="405" x2="${rx2}" y2="${ry2}" stroke="rgba(220,175,40,.06)" stroke-width="2"/>`;
  }
  const svg = `<svg viewBox="0 0 400 580" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;" aria-hidden="true"><defs><radialGradient id="gT" cx="50%" cy="19%" r="55%"><stop offset="0%" stop-color="#FFE080" stop-opacity=".55"/><stop offset="75%" stop-color="#7B0C14" stop-opacity="0"/></radialGradient><radialGradient id="gC" cx="50%" cy="70%" r="38%"><stop offset="0%" stop-color="#FFD060" stop-opacity=".28"/><stop offset="100%" stop-color="#0A1535" stop-opacity="0"/></radialGradient><filter id="fg"><feGaussianBlur stdDeviation="5"/></filter></defs>
<path d="M20 578 L20 192 Q20 16 200 16 Q380 16 380 192 L380 578 Z" fill="rgba(8,20,78,.58)" stroke="#160702" stroke-width="3.5"/>
<path d="M36 574 L36 198 Q36 36 200 36 Q364 36 364 198 L364 574 Z" fill="none" stroke="rgba(196,136,26,.52)" stroke-width="1.3"/>
<path d="M42 572 L42 200 Q42 42 200 42 Q358 42 358 200 L358 572 Z" fill="none" stroke="rgba(196,136,26,.22)" stroke-width=".7"/>
<ellipse cx="200" cy="108" rx="145" ry="190" fill="url(#gT)"/>
<circle cx="${RX}" cy="${RY}" r="74" fill="rgba(10,78,30,.5)" stroke="#160702" stroke-width="2.8"/>
<circle cx="${RX}" cy="${RY}" r="58" fill="rgba(155,98,8,.4)" stroke="#160702" stroke-width="2"/>${petals}\n${spokes}
<circle cx="${RX}" cy="${RY}" r="22" fill="url(#gT)" filter="url(#fg)" opacity=".8"/>
<circle cx="${RX}" cy="${RY}" r="22" fill="rgba(198,138,16,.8)" stroke="#160702" stroke-width="2.2"/>
<line x1="${RX}" y1="${RY-17}" x2="${RX}" y2="${RY+17}" stroke="#160702" stroke-width="3.2" stroke-linecap="round"/>
<line x1="${RX-17}" y1="${RY-4}" x2="${RX+17}" y2="${RY-4}" stroke="#160702" stroke-width="3.2" stroke-linecap="round"/>
<line x1="${RX}" y1="${RY-17}" x2="${RX}" y2="${RY+17}" stroke="rgba(255,224,78,.92)" stroke-width="1.5" stroke-linecap="round"/>
<line x1="${RX-17}" y1="${RY-4}" x2="${RX+17}" y2="${RY-4}" stroke="rgba(255,224,78,.92)" stroke-width="1.5" stroke-linecap="round"/>
<rect x="24" y="240" width="352" height="5.5" fill="#160702"/><rect x="26" y="243" width="348" height="1.5" fill="rgba(196,136,26,.32)"/>
<path d="M25 574 L25 258 Q25 244 87 244 Q149 244 149 258 L149 574 Z" fill="rgba(138,10,16,.65)" stroke="none"/>
<path d="M26 258 Q26 244 87 244 Q148 244 148 258 Q128 276 87 279 Q46 276 26 258Z" fill="rgba(16,38,138,.65)" stroke="none"/>
<path d="M153 574 L153 252 Q153 234 200 234 Q247 234 247 252 L247 574 Z" fill="rgba(12,28,112,.68)" stroke="none"/>
<path d="M154 252 Q154 235 200 235 Q246 235 246 252 Q226 271 200 274 Q174 271 154 252Z" fill="rgba(158,108,10,.55)" stroke="none"/>
<path d="M251 574 L251 258 Q251 244 313 244 Q375 244 375 258 L375 574 Z" fill="rgba(138,10,16,.65)" stroke="none"/>
<path d="M252 258 Q252 244 313 244 Q374 244 374 258 Q354 276 313 279 Q272 276 252 258Z" fill="rgba(16,38,138,.65)" stroke="none"/>
<rect x="148" y="241" width="6" fill="#160702" height="334"/>
<rect x="250" y="241" width="6" fill="#160702" height="334"/>
<line x1="24" y1="244" x2="376" y2="244" stroke="#160702" stroke-width="5.5"/>
<circle cx="87" cy="300" r="24" fill="rgba(220,170,30,.1)" filter="url(#fg)"/>
<circle cx="87" cy="305" r="14" fill="rgba(198,138,16,.25)" stroke="rgba(218,168,36,.65)" stroke-width="1.5"/>
<circle cx="87" cy="299" r="19" fill="none" stroke="rgba(218,168,36,.42)" stroke-width="1" stroke-dasharray="3.5 2.5"/>
<path d="M72 322 Q40 276 36 226 Q50 254 64 282 Q70 306 72 320Z" fill="rgba(218,175,36,.13)" stroke="rgba(218,168,36,.5)" stroke-width="1.3"/>
<path d="M72 338 Q34 316 28 262 Q44 290 60 314 Q66 328 72 338Z" fill="rgba(218,175,36,.08)" stroke="rgba(218,168,36,.3)" stroke-width=".9"/>
<path d="M72 323 Q68 368 62 415 Q74 422 87 422 Q100 422 112 415 Q106 368 102 323Z" fill="rgba(178,118,12,.3)" stroke="rgba(218,168,36,.52)" stroke-width="1.3"/>
<line x1="81" y1="328" x2="76" y2="410" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<line x1="87" y1="325" x2="87" y2="412" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<line x1="93" y1="328" x2="98" y2="410" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<path d="M79 388 Q72 400 70 413" fill="none" stroke="rgba(218,168,36,.48)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M95 388 Q102 400 104 413" fill="none" stroke="rgba(218,168,36,.48)" stroke-width="1.5" stroke-linecap="round"/>
${rays}
<line x1="200" y1="332" x2="200" y2="490" stroke="rgba(255,224,78,.38)" stroke-width="14" stroke-linecap="round" filter="url(#fg)"/>
<line x1="162" y1="378" x2="238" y2="378" stroke="rgba(255,224,78,.38)" stroke-width="14" stroke-linecap="round" filter="url(#fg)"/>
<line x1="200" y1="332" x2="200" y2="490" stroke="#160702" stroke-width="4.5" stroke-linecap="round"/>
<line x1="162" y1="378" x2="238" y2="378" stroke="#160702" stroke-width="4.5" stroke-linecap="round"/>
<line x1="200" y1="332" x2="200" y2="490" stroke="rgba(255,224,78,.88)" stroke-width="2" stroke-linecap="round"/>
<line x1="162" y1="378" x2="238" y2="378" stroke="rgba(255,224,78,.88)" stroke-width="2" stroke-linecap="round"/>
<circle cx="200" cy="378" r="20" fill="rgba(198,138,16,.22)" stroke="rgba(218,168,36,.55)" stroke-width="2"/>
<circle cx="200" cy="378" r="7" fill="rgba(220,178,38,.5)" stroke="rgba(255,224,78,.75)" stroke-width="1.5"/>
<ellipse cx="200" cy="405" rx="80" ry="100" fill="url(#gC)" opacity=".8"/>
<circle cx="313" cy="300" r="24" fill="rgba(220,170,30,.1)" filter="url(#fg)"/>
<circle cx="313" cy="305" r="14" fill="rgba(198,138,16,.25)" stroke="rgba(218,168,36,.65)" stroke-width="1.5"/>
<circle cx="313" cy="299" r="19" fill="none" stroke="rgba(218,168,36,.42)" stroke-width="1" stroke-dasharray="3.5 2.5"/>
<path d="M328 322 Q360 276 364 226 Q350 254 336 282 Q330 306 328 320Z" fill="rgba(218,175,36,.13)" stroke="rgba(218,168,36,.5)" stroke-width="1.3"/>
<path d="M328 338 Q366 316 372 262 Q356 290 340 314 Q334 328 328 338Z" fill="rgba(218,175,36,.08)" stroke="rgba(218,168,36,.3)" stroke-width=".9"/>
<path d="M298 323 Q294 368 288 415 Q300 422 313 422 Q326 422 338 415 Q332 368 328 323Z" fill="rgba(178,118,12,.3)" stroke="rgba(218,168,36,.52)" stroke-width="1.3"/>
<line x1="307" y1="328" x2="302" y2="410" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<line x1="313" y1="325" x2="313" y2="412" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<line x1="319" y1="328" x2="324" y2="410" stroke="rgba(218,168,36,.22)" stroke-width=".9"/>
<path d="M305 388 Q298 400 296 413" fill="none" stroke="rgba(218,168,36,.48)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M321 388 Q328 400 330 413" fill="none" stroke="rgba(218,168,36,.48)" stroke-width="1.5" stroke-linecap="round"/>
<polygon points="87,522 97,534 87,546 77,534" fill="rgba(178,108,8,.38)" stroke="rgba(218,168,36,.42)" stroke-width="1.1"/>
<polygon points="200,522 210,534 200,546 190,534" fill="rgba(178,108,8,.38)" stroke="rgba(218,168,36,.42)" stroke-width="1.1"/>
<polygon points="313,522 323,534 313,546 303,534" fill="rgba(178,108,8,.38)" stroke="rgba(218,168,36,.42)" stroke-width="1.1"/>
<line x1="30" y1="514" x2="370" y2="514" stroke="rgba(196,136,26,.35)" stroke-width="1"/></svg>`;

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${bibName} &middot; Biblia Catholica</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}html,body{min-height:100%;background:radial-gradient(ellipse at 40% 30%,#3A0810 0%,#160308 55%,#0A0106 100%);display:flex;align-items:center;justify-content:center;padding:28px;font-family:'EB Garamond',Georgia,serif;}
.book{width:min(580px,96vw);aspect-ratio:3/4.5;position:relative;background:linear-gradient(175deg,#280710 0%,#480E1C 28%,#6A1628 50%,#480E1C 72%,#280710 100%);box-shadow:0 0 0 1px #8A3418,0 0 0 3px #200508,0 0 0 5px #C88020,0 0 0 8px #200508,0 0 0 10px #8A3418,0 0 0 13px #200508,0 80px 220px rgba(0,0,0,.99),inset 7px 0 20px rgba(0,0,0,.7),inset 0 0 140px rgba(70,5,14,.4);border-radius:3px 10px 10px 3px;border-left:28px solid #14030A;overflow:hidden;}
.book::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:1;background-image:repeating-linear-gradient(89deg,transparent 0,transparent 2px,rgba(0,0,0,.2) 2px,rgba(0,0,0,.2) 3px),repeating-linear-gradient(0deg,transparent 0,transparent 4px,rgba(100,15,20,.07) 4px,rgba(100,15,20,.07) 5px);}
.frame{position:absolute;inset:24px;z-index:3;border:1.5px solid rgba(198,126,22,.62);display:flex;flex-direction:column;align-items:center;padding:20px 18px 24px;}
.frame::before{content:'';position:absolute;inset:6px;border:1px solid rgba(198,126,22,.2);pointer-events:none;}
.ec{position:absolute;font-size:.65rem;color:rgba(198,126,22,.55);line-height:1;}.ec-tl{top:12px;left:12px;}.ec-tr{top:12px;right:12px;}.ec-bl{bottom:12px;left:12px;}.ec-br{bottom:12px;right:12px;}
.spacer-top{flex:0 0 124px;}
.lat-main{font-family:'Cinzel Decorative','Cinzel',serif;font-size:clamp(2.2rem,9.5vw,3.3rem);color:#EDD882;text-align:center;line-height:1.0;letter-spacing:.06em;text-shadow:0 0 80px rgba(198,126,22,.55),0 5px 36px rgba(0,0,0,.9);}
.lat-sub{font-family:'Cinzel',serif;font-size:.64rem;color:rgba(198,160,50,.65);letter-spacing:.5em;text-align:center;margin-top:8px;}
.div-gold{width:90%;height:1px;margin:13px auto;background:linear-gradient(to right,transparent,#C88020 15%,#EDD882 50%,#C88020 85%,transparent);box-shadow:0 0 8px rgba(198,126,22,.28);}
.div-thin{width:55%;height:1px;margin:9px auto;background:linear-gradient(to right,transparent,rgba(198,126,22,.4),transparent);}
.nat-title{font-family:'Cinzel',serif;font-size:clamp(1rem,4.2vw,1.38rem);color:rgba(237,216,130,.72);text-align:center;line-height:1.2;letter-spacing:.1em;text-shadow:0 2px 16px rgba(0,0,0,.75);margin-top:8px;}
.nat-lang{font-family:'Cinzel',serif;font-size:.57rem;color:rgba(198,126,22,.45);letter-spacing:.28em;text-align:center;margin-top:4px;}
.quote{margin:9px 4px 0;border-left:2px solid rgba(198,126,22,.38);border-right:2px solid rgba(198,126,22,.38);padding:7px 14px;text-align:center;}
.quote-text{font-family:'EB Garamond',serif;font-style:italic;font-size:clamp(.78rem,2.5vw,.93rem);color:rgba(237,216,130,.64);line-height:2;}
.quote-ref{font-family:'Cinzel',serif;font-size:.51rem;color:rgba(198,126,22,.38);letter-spacing:.1em;margin-top:4px;}
.copyright{font-family:'Cinzel',serif;font-size:.44rem;color:rgba(198,126,22,.26);letter-spacing:.06em;text-align:center;line-height:2;margin-top:7px;}
.btn{display:inline-block;margin-top:13px;padding:11px 44px;background:linear-gradient(135deg,rgba(198,126,22,.18),rgba(198,126,22,.08));border:1.5px solid rgba(198,126,22,.55);color:#C88020;text-decoration:none;border-radius:2px;font-family:'Cinzel',serif;font-size:.8rem;letter-spacing:.22em;transition:all .25s;text-shadow:0 1px 6px rgba(0,0,0,.6);box-shadow:0 2px 18px rgba(0,0,0,.5);}
.btn:hover{background:rgba(198,126,22,.32);box-shadow:0 6px 28px rgba(198,126,22,.2);color:#EDD882;}
</style></head><body>
<div class="book">
  ${svg}
  <div class="frame">
    <span class="ec ec-tl">&#10022;</span><span class="ec ec-tr">&#10022;</span>
    <span class="ec ec-bl">&#10022;</span><span class="ec ec-br">&#10022;</span>
    <div class="spacer-top"></div>
    <div class="lat-main">BIBLIA<br>CATHOLICA</div>
    <div class="lat-sub">VULGATA CLEMENTINA</div>
    <div class="div-gold"></div>
    <div class="nat-title">${bibName}</div>
    <div class="nat-lang">${trans.native.toUpperCase()} &nbsp;&middot;&nbsp; ${trans.display}</div>
    <div class="div-thin"></div>
    <div class="quote">
      <div class="quote-text">&#171;In principio erat Verbum,<br>et Verbum erat apud Deum,<br>et Deus erat Verbum.&#187;</div>
      <div class="quote-ref">Ioannes I,1 &nbsp;&middot;&nbsp; Vulgata Clementina</div>
    </div>
    <div class="copyright">&copy; Public Domain &middot; Vulgata Clementina (Sixto-Clementina, 1592)<br>${trans.display} &middot; Alle Rechte erloschen &middot; Gemeinfrei</div>
    <a class="btn" href="index.html">LEGERE &nbsp;&#10095;</a>
  </div>
</div>
</body></html>`;
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
  <span style="color:#C8A96E;font-family:'Cinzel',serif;font-size:.72rem;">${trans.native}</span>
</nav>

<header>
  <div class="hflag">${trans.flag}</div>
  <div class="htitle">${BIBLE_NAMES[trans.lang] || trans.native}</div>
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
      // Übersetzung primär, Latein sekundär
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
  border-bottom:1px solid rgba(184,150,46,.12);
}
.vb:nth-child(even){background:rgba(255,255,255,.55);}
.vb:nth-child(odd){background:rgba(247,241,232,.6);}

.vn{
  flex-shrink:0;width:36px;padding-top:3px;
  font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(184,150,46,.55);text-align:right;
  padding-right:10px;line-height:2;
}

.vt{padding:0 18px 0 6px;flex:1;}

/* LATEIN – PRIMÄR (groß, golden-warm, der Originaltext) */
.lat{
  font-family:'EB Garamond',serif;
  font-size:1.12rem;font-weight:500;line-height:1.95;
  color:#6B3E10;
  border-left:3px solid #B8962E;
  padding-left:12px;
  margin-bottom:5px;
}

/* ÜBERSETZUNG – SEKUNDÄR (kleiner, kursiv, Referenz) */
.tra{
  font-family:'EB Garamond',serif;
  font-size:.9rem;font-style:italic;line-height:1.8;
  color:#2A3050;
  padding-left:15px;
  border-left:2px solid rgba(100,120,160,.2);
}

/* Drop-Cap: erster Vers jedes Kapitels – auf dem Latein */
.vb.first .lat::first-letter{
  font-size:3.8em;float:left;line-height:.72;
  padding-right:.07em;margin-top:.06em;
  font-family:'Cinzel Decorative',serif;color:#B8962E;
  text-shadow:1px 1px 4px rgba(0,0,0,.15);
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
  <div class="btrans">${book.name} &nbsp;·&nbsp; <em>${trans.native}</em></div>
  <div class="bmeta">${trans.display} &nbsp;·&nbsp; ${chCount} Capita &nbsp;·&nbsp; ${vCount} Versus</div>
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

    // Sprachcover
    fs.writeFileSync(path.join(tDir, 'cover.html'), buildLangCover2(trans));

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
