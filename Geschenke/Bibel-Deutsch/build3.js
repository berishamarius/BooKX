'use strict';
/**
 * BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR v3
 * Würdiges Design: Weinrot – Gold – Pergament – Reine CSS-Typografie
 * Kein SVG – Keine Rahmen-Tricks – Latein dominant
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUT_DIR  = path.join(__dirname, 'Übersetzungen');

// -------------------------------------------------------
//  ÜBERSETZUNGEN
// -------------------------------------------------------

const TRANSLATIONS = [
  { code: 'german', lang: 'de', native: 'Deutsch', display: 'Textbibel (1906)', flag: '????' },
];

// -------------------------------------------------------
//  BÜCHERLISTE
// -------------------------------------------------------

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

const BIBLE_NAMES = {
  en: 'The Holy Bible',        de: 'Die Heilige Bibel',     fr: 'La Sainte Bible',
  es: 'La Santa Biblia',       pt: 'A Bíblia Sagrada',      pl: 'Pismo Święte',
  ru: '????????? ???????',     hr: 'Sveto Pismo',           nl: 'De Heilige Bijbel',
  hu: 'A Szentírás',           cs: 'Písmo Svaté',           sv: 'Den Heliga Bibeln',
  tl: 'Ang Banal na Bibliya',  uk: '???????? ??????',       sq: 'Bibla e Shenjtë',
};

// Schaltfläche "Lesen" pro Sprache
const READ_BTN = {
  en:'R E A D',      de:'L E S E N',    fr:'L I R E',
  es:'L E E R',      pt:'L E R',        pl:'C Z Y T A J',
  ru:'? ? ? ? ? ?', hr:'C I T A J',    nl:'L E Z E N',
  hu:'O L V A S S',  cs:'C Ř S T',      sv:'L Ä S A',
  tl:'B A S A H I N',uk:'? ? ? ? ? ?', sq:'L E X O',
};

// Buchbezeichnungen pro Sprache (Index = Buchnr - 1)
const BOOK_NAMES = {
  en:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','Tobit','Judith','1 Maccabees','2 Maccabees','Wisdom','Sirach','Baruch'],
  de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwörter','Kohelet','Hoheslied','Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabäer','2. Makkabäer','Weisheit','Sirach','Baruch','1. Esra (gr.)','2. Esra (gr.)','Gebet des Manasse','Gebet des Asarja','Susanna','Bel und der Drache','Zusätze zu Ester'],
  
};

// -------------------------------------------------------
//  HELFER
// -------------------------------------------------------

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

// Lutherbibel liegt im CATHOLIC-BIBLE-Ordner (gemeinsame Daten)
const CATHOLIC_DIR = path.join(__dirname, '..', '..', 'CATHOLIC-BIBLE');
const LUTHER_DIR   = path.join(CATHOLIC_DIR, 'data-luther');

function loadLutherBook(nr) {
  const f = path.join(LUTHER_DIR, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

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

// -------------------------------------------------------
//  SCHRIFTEN (Google Fonts CDN)
// -------------------------------------------------------

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">`;

// -------------------------------------------------------
//  COVER (Hauptcover - Sprachauswahl)
// -------------------------------------------------------

function buildCover() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Die Heilige Bibel</title>
${FONTS}
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#e8e0d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(90,32,0,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(90,32,0,.13);pointer-events:none;z-index:5;}
.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.25);}
.btn-wrap{text-align:center;position:relative;z-index:1;display:flex;gap:16px;justify-content:center;align-items:center;flex-wrap:wrap;}
.btn{display:inline-block;padding:13px 56px;color:#f0e8d0;text-decoration:none;font-family:'Cinzel',serif;font-size:.82rem;font-weight:600;letter-spacing:.28em;border:2px solid #5a2000;background:#5a2000;transition:all .22s;}
.btn:hover{background:#7a3010;border-color:#7a3010;}
.btn-sec{display:inline-block;padding:10px 28px;color:rgba(90,32,0,.55);text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.18em;border:1px solid rgba(90,32,0,.35);background:transparent;transition:all .22s;}
.btn-sec:hover{color:#5a2000;border-color:rgba(90,32,0,.6);}
.corner{position:fixed;width:56px;height:56px;pointer-events:none;z-index:6;}
.c-tl{top:14px;left:14px;border-top:2px solid rgba(90,32,0,.45);border-left:2px solid rgba(90,32,0,.45);}
.c-tr{top:14px;right:14px;border-top:2px solid rgba(90,32,0,.45);border-right:2px solid rgba(90,32,0,.45);}
.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(90,32,0,.45);border-left:2px solid rgba(90,32,0,.45);}
.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(90,32,0,.45);border-right:2px solid rgba(90,32,0,.45);}
</style>
</head>
<body>
<div class="corner c-tl"></div>
<div class="corner c-tr"></div>
<div class="corner c-bl"></div>
<div class="corner c-br"></div>
<a class="book" href="german/vorwort.html">
  <img src="../../../Die Heilige Bibel - Weiss - Michele.png" alt="Die Heilige Bibel">
</a>
</body>
</html>`;
}

// -------------------------------------------------------
//  VORWORT
// -------------------------------------------------------

function buildVorwort(trans) {
  const bibName = BIBLE_NAMES[trans.lang] || 'Die Heilige Bibel';
  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vorwort &middot; ${bibName}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#e8e0d0;font-family:'EB Garamond',serif;color:#2a0008;}
.topbar{
  background:#f5f0e8;border-bottom:1px solid rgba(140,100,20,.3);
  padding:10px 28px;
}
.topbar a{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:rgba(42,0,8,.6);text-decoration:none;letter-spacing:.08em;
  border:1px solid rgba(100,60,20,.35);padding:5px 18px;border-radius:2px;
  display:inline-block;transition:color .15s,border-color .15s;
}
.topbar a:hover{color:#5a1020;border-color:rgba(100,60,20,.7);}
.page{
  max-width:720px;
  margin:48px auto 60px;
  padding:60px 72px 80px;
  background:#f5f0e8;
  box-shadow:0 4px 40px rgba(0,0,0,.12),inset 0 0 0 1px rgba(140,100,20,.15);
  border-left:3px solid #B8962E;
  border-right:3px solid #B8962E;
  border-top:1px solid rgba(140,100,20,.3);
  border-bottom:1px solid rgba(140,100,20,.3);
  position:relative;
}
.page::before{
  content:'';position:absolute;inset:14px;
  border:1px solid rgba(140,100,20,.08);pointer-events:none;
}
.orn{
  text-align:center;font-size:.72rem;letter-spacing:.65em;
  color:rgba(42,0,8,.3);margin-bottom:32px;
}
.v-title{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:2.8rem;color:#2a0008;
  text-align:center;margin-bottom:8px;line-height:1.2;
}
.rule{
  width:70%;height:1px;margin:20px auto;
  background:linear-gradient(to right,transparent,#B8962E 20%,#8B6400 50%,#B8962E 80%,transparent);
}
.sub{
  font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.35em;
  color:rgba(42,0,8,.4);text-align:center;margin-bottom:36px;
}
.v-body{font-size:1.12rem;line-height:2.1;color:#2a0008;}
.v-body p{margin-bottom:1.4em;}
.v-body p:first-child::first-letter{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:4em;float:left;line-height:.72;
  padding-right:.08em;margin-top:.05em;color:#8B6400;
}
.sign{
  margin-top:40px;text-align:right;
  font-style:italic;font-size:1rem;color:rgba(42,0,8,.55);
}
.btn-wrap{text-align:center;margin-top:40px;}
.btn{
  display:inline-block;padding:11px 52px;
  color:#2a0008;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.22em;
  border:1px solid rgba(100,60,20,.6);
  background:rgba(255,255,255,.55);
  transition:color .22s,border-color .22s,background .22s;
}
.btn:hover{color:#5a1020;border-color:rgba(100,60,20,.9);background:rgba(240,230,210,.85);}
@media(max-width:600px){.page{padding:24px 20px 40px;margin:0;border-left:none;border-right:none;}}
</style>
</head>
<body>
<nav class="topbar">
  <a href="index.html">&#8592; Bücherliste</a>
</nav>
<div class="page">
  <div class="orn">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>
  <div class="v-title">Vorwort</div>
  <div class="rule"></div>
  <div class="sub">Z U R &nbsp; V O R L I E G E N D E N &nbsp; A U S G A B E</div>
  <div class="v-body">
    <p>Liebe Michele,</p>
    <p>dieses Bibel gehört dir, nicht wegen der Worte darin, sondern wegen des Menschen, der es in den Händen hält.</p>
    <p>Du hast jemanden verloren, der dein Leben geprägt hat. Solche Menschen verschwinden nicht wirklich. Sie leben weiter, in einem Lachen, das du plötzlich wiedererkennst, in einem Duft, der eine ganze Welt aufmacht, in stillen Momenten, in denen du spürst: dieser Mensch hat mich zu dem gemacht, was ich bin. Das bleibt. Das kann niemand nehmen.</p>
    <p>Trauer ist keine Schwäche. Sie ist der Beweis dafür, wie sehr dir dieser Mensch bedeutet hat. Und diese Liebe kennt kein Ende.</p>
    <p>Ich wünsche dir Momente der Stille, in denen der Schmerz Platz lässt für Erinnerungen, die warm und hell sind. Ich wünsche dir Tage, an denen du lachst ohne schlechtes Gewissen. Und ich wünsche dir Menschen um dich herum, die dich tragen, wenn du es gerade nicht alleine kannst.</p>
    <p>Du bist nicht allein.</p>
  </div>
  <div class="sign">Mayo</div>
  <div class="btn-wrap">
    <a class="btn" href="index.html">Z U R &nbsp; B &Uuml; C H E R L I S T E &nbsp; &#8250;</a>
  </div>
  <div class="orn" style="margin-top:40px;margin-bottom:0;">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>
</div>
</body>
</html>`;
}

// -------------------------------------------------------
//  RüCKSEITE
// -------------------------------------------------------

function buildBackCover() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Die Heilige Bibel - Rückseite</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#e8e0d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(90,32,0,.28);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(90,32,0,.11);pointer-events:none;z-index:5;}
.corner{position:fixed;width:52px;height:52px;pointer-events:none;z-index:6;}
.c-tl{top:14px;left:14px;border-top:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}
.c-tr{top:14px;right:14px;border-top:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}
.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(90,32,0,.4);border-left:2px solid rgba(90,32,0,.4);}
.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(90,32,0,.4);border-right:2px solid rgba(90,32,0,.4);}
.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.25);}
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 2.2rem;text-align:center;}
.loss{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.98rem;color:#1a0a04;line-height:1.75;margin-bottom:1.1rem;}
.rule{width:50%;height:1px;margin:0 auto .9rem;background:linear-gradient(to right,transparent,rgba(90,40,0,.4),transparent);}
.verse{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:1.02rem;color:#1a0a04;line-height:1.8;}
.verse-ref{font-family:'Cinzel',serif;font-size:.5rem;color:rgba(90,40,0,.7);letter-spacing:.15em;margin-top:5px;}
.copy{font-family:'Cinzel',serif;font-size:.72rem;font-weight:700;color:rgba(240,200,130,.8);margin-top:1rem;letter-spacing:.12em;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<a class="book" href="cover.html">
  <img src="../../../Bibel-Rueckseite-Michele.png" alt="Rückseite">
  <div class="overlay">
    <div class="loss">Du hast jemanden verloren, der dein Herz geformt hat.<br>Solche Menschen gehen nicht wirklich.<br>Sie leben weiter in dem, was du bist.</div>
    <div class="rule"></div>
    <div class="verse">„Kommet her zu mir alle, die ihr mühselig<br>und beladen seid, so will ich euch erquicken.“</div>
    <div class="verse-ref">Matthäus 11,28</div>

  </div>
</a>
</body>
</html>`;
}

// -------------------------------------------------------
//  HAUPTINDEX (Sprachauswahl)
// -------------------------------------------------------

function buildMainIndex() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=cover.html">
<title>Die Heilige Bibel</title>
</head>
<body></body>
</html>`;
}
function buildLangCover(trans) {
  const bibName = BIBLE_NAMES[trans.lang] || 'Die Heilige Bibel';
  const btnTxt  = READ_BTN[trans.lang] || 'L E S E N';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${bibName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=UnifrakturMaguntia&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{
  height:100%;
  background:#e8e0d0;
  display:flex;align-items:center;justify-content:center;
}
.page{
  width:500px;
  max-width:calc(100vw - 1.2cm);
  height:min(calc(100vh - 1.2cm), 680px);
  position:relative;
  background:#f5f0e8;
  overflow:hidden;
}
.frame{position:absolute;inset:0;z-index:2;pointer-events:none;}
.title-block{
  position:absolute;z-index:3;
  top:9%;left:0;right:0;
  text-align:center;width:100%;
}
.heilige{
  font-family:'Cinzel',serif;
  font-size:1.1rem;letter-spacing:.5em;
  color:#2a0008;display:block;margin-bottom:12px;
  text-shadow:0 1px 3px rgba(255,255,255,.9);
}
.bibel{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(2.2rem,6vw,3rem);
  line-height:1.15;
  color:#2a0008;
  display:block;
}
.lang-sub{
  font-family:'Cinzel',serif;
  font-size:.65rem;letter-spacing:.35em;
  color:rgba(42,0,8,.5);
  display:block;margin-top:10px;
}
.back-link{
  position:absolute;bottom:5%;left:0;right:0;text-align:center;z-index:3;
  font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.12em;
  color:rgba(42,0,8,.35);text-decoration:none;
}
.back-link:hover{color:rgba(42,0,8,.65);}
PLACEHOLDER_BODY_CONTINUE
</style>
</head>
<body>
<div class="page">

  <!-- SVG-RAHMEN (gold, wie Original-Michele-Cover) -->
  <svg class="frame" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 100 100" preserveAspectRatio="none"
       style="width:100%;height:100%;position:absolute;top:0;left:0;">
    <rect x="2.5" y="2.5" width="95" height="95"
          fill="none" stroke="#C8A030" stroke-width="0.85"/>
    <rect x="5" y="5" width="90" height="90"
          fill="none" stroke="#C8A030" stroke-width="0.3" opacity="0.6"/>
    <rect x="8" y="8" width="84" height="84"
          fill="none" stroke="#9A7020" stroke-width="0.18" opacity="0.45"/>
    <g stroke="#C8A030" stroke-width="0.55" opacity="0.9">
      <line x1="5" y1="5"  x2="18" y2="5"/>  <line x1="5" y1="5"  x2="5"  y2="18"/>
      <line x1="95" y1="5"  x2="82" y2="5"/> <line x1="95" y1="5"  x2="95" y2="18"/>
      <line x1="5" y1="95" x2="18" y2="95"/> <line x1="5" y1="95" x2="5"  y2="82"/>
      <line x1="95" y1="95" x2="82" y2="95"/><line x1="95" y1="95" x2="95" y2="82"/>
    </g>
  </svg>

  <!-- Titel-Block -->
  <div class="title-block">
    <span class="heilige">D I E &nbsp; H E I L I G E</span>
    <span class="bibel">${bibName}</span>
    <span class="lang-sub">${trans.native ? trans.native.toUpperCase() : ''}</span>
  </div>

  <!-- LESEN Button -->
  <div class="btn-wrap">
    <a class="btn" href="vorwort.html">${btnTxt}</a>
  </div>

  <a class="back-link" href="../cover.html">&#8617; Zur&#252;ck zur &#220;bersicht</a>

</div>
</body>
</html>`;
}

// -------------------------------------------------------
//  SPRACHINDEX (Bücherliste)
// -------------------------------------------------------

function buildLangIndex(trans, availBooks) {
  const byTest = g => availBooks.filter(b => b.testament === g);
  const booksVT = byTest('VT'), booksNT = byTest('NT'), booksDK = byTest('DK');

  function bookList(books) {
    return books.map(b => `
  <a href="bücher/${bookFile(b)}" class="toc-item" data-testament="${b.testament}">
    <span class="tnr">${pad3(b.nr)}</span>
    <span class="tlat">${b.latin}</span>
    <span class="tname">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.en)[b.nr-1]||b.name}</span>
    <span class="tdots"></span>
    <span class="tchap">${b.chapCount ? b.chapCount + ' Cap.' : ''}</span>
    <span class="tarr">›</span>
  </a>`).join('');
  }

  const dkSec = booksDK.length ? `
<div class="sec-group sec-dk">
<div class="sec-head">
  <span class="sec-t sec-t-c">Libri Deuterocanonoci</span>
  <span class="sec-t sec-t-p">Deuterokanonische Bücher</span>
  <div class="sec-rule"></div>
  <span class="sec-s">L I B R I &nbsp; D E U T E R O C A N O N I C I &nbsp;–&nbsp; ${booksDK.length} &nbsp; L I B R I</span>
</div>
${bookList(booksDK)}
</div>` : '';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${BIBLE_NAMES[trans.lang]||'Die Heilige Bibel'} &middot; ${trans.native}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#e8e0d0;
  font-family:'EB Garamond',serif;color:#2a0008;
}

/* NAV */
.topbar{
  background:#e8e0d0;
  border-bottom:1px solid rgba(140,100,20,.3);
  padding:10px 28px;
  display:flex;align-items:center;justify-content:space-between;
}
.topbar a{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:rgba(42,0,8,.6);text-decoration:none;letter-spacing:.08em;
  border:1px solid rgba(100,60,20,.35);padding:5px 18px;border-radius:2px;
  display:inline-block;
  transition:color .15s,border-color .15s;
}
.topbar a:hover{color:#5a1020;border-color:rgba(100,60,20,.7);}

/* HEADER */
header{
  background:#f5f0e8;
  border:1px solid rgba(140,100,20,.35);
  border-bottom:3px solid #B8962E;
  padding:36px 24px 28px;text-align:center;
  position:relative;overflow:hidden;
  margin:0;
}
header::before{
  content:'';
  position:absolute;inset:12px;
  border:1px solid rgba(140,100,20,.18);
  pointer-events:none;
}
header::after{
  content:'';
  position:absolute;inset:20px;
  border:0.5px solid rgba(140,100,20,.08);
  pointer-events:none;
}
.h-orn{
  font-size:.72rem;letter-spacing:.65em;
  color:rgba(42,0,8,.3);
  margin-bottom:20px;position:relative;
}
.h-cross-big{
  display:block;width:40px;height:56px;margin:0 auto 16px;
}
.htitle{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(2rem,6vw,3.2rem);
  color:#2a0008;
  position:relative;line-height:1.2;
}
.h-rule-full{
  width:65%;height:1px;margin:16px auto;
  background:linear-gradient(to right,transparent,#B8962E 20%,#8B6400 50%,#B8962E 80%,transparent);
  position:relative;
}
.h-sub{
  font-family:'Cinzel',serif;font-size:.6rem;
  letter-spacing:.44em;color:rgba(42,0,8,.4);
  position:relative;
}
.hlang{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:rgba(42,0,8,.55);letter-spacing:.25em;
  position:relative;margin-top:10px;
}
.h-orn-bot{
  font-size:.65rem;letter-spacing:.8em;
  color:rgba(42,0,8,.25);
  margin-top:18px;position:relative;
}
/* SEKTIONEN */
.sec-head{text-align:center;padding:52px 0 8px;}
.sec-t{font-family:'UnifrakturMaguntia',cursive;font-size:2.4rem;color:#2a0008;text-shadow:none;display:none;margin-bottom:6px;}
body:not([data-conf]) .sec-t-c,body[data-conf="catholic"] .sec-t-c{display:block;}
body[data-conf="protestant"] .sec-t-p{display:block;}
.sec-rule{width:140px;height:1px;margin:10px auto;background:linear-gradient(to right,transparent,#B8962E 20%,#8B6400 50%,#B8962E 80%,transparent);}
.sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#7a5800;letter-spacing:.28em;margin-top:4px;display:block;margin-bottom:28px;}

/* TOC PARCHMENT BLOCK */
.index-body{
  max-width:1000px;
  margin:36px auto 60px;
  padding:52px 72px 80px;
  background:#FAF5E8;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.55),0 2px 12px rgba(0,0,0,.35),inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;overflow:clip;
}
.index-body::before{
  content:'';
  position:absolute;
  inset:12px;
  border:1px solid rgba(184,150,46,.08);
  pointer-events:none;
}
.sec-group{margin-bottom:0;text-align:center;}
.toc-item{
  display:flex;align-items:baseline;
  padding:14px 4px;
  border-bottom:1px solid rgba(184,150,46,.14);
  text-decoration:none;
  transition:background .15s;border-radius:2px;
}
.toc-item:hover{background:rgba(184,150,46,.06);}
.tnr{
  font-family:'Cinzel',serif;font-size:.72rem;
  color:#B8962E;
  min-width:50px;text-align:right;padding-right:20px;flex-shrink:0;
}
.tlat{
  font-family:'Cinzel Decorative',serif;font-size:1.25rem;
  color:#3A0A12;flex-shrink:0;
}
.tname{
  font-family:'EB Garamond',serif;font-size:1rem;font-style:italic;
  color:#6B5E40;
  margin-left:12px;flex-shrink:0;
}
.tdots{
  flex:1;height:1px;margin:0 18px;align-self:center;
  background:repeating-linear-gradient(to right,rgba(184,150,46,.2) 0,rgba(184,150,46,.2) 3px,transparent 3px,transparent 9px);
}
.tchap{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:#8B6914;flex-shrink:0;white-space:nowrap;
}
.tarr{color:rgba(184,150,46,.4);margin-left:14px;font-size:1rem;}

/* -- Konfessions-Switcher -- */
.conf-bar{
  display:flex;justify-content:center;gap:0;
  padding:18px 24px 0;
  font-family:'Cinzel',serif;
}
.conf-btn{
  padding:9px 24px;font-size:.65rem;letter-spacing:.16em;
  border:1px solid rgba(100,60,20,.3);background:transparent;
  color:rgba(42,0,8,.45);cursor:pointer;transition:all .18s;
  text-transform:uppercase;
}
.conf-btn:first-child{border-radius:2px 0 0 2px;}
.conf-btn:last-child{border-radius:0 2px 2px 0;}
.conf-btn:not(:first-child){border-left:none;}
.conf-btn.active{background:rgba(140,100,20,.12);color:#5a1020;border-color:rgba(100,60,20,.6);}
.conf-btn:hover:not(.active){background:rgba(140,100,20,.06);color:rgba(42,0,8,.7);}

body[data-conf="protestant"] .sec-dk { display:none; }
body[data-conf="protestant"] .toc-item[data-testament="DK"] { display:none; }

.conf-note{
  text-align:center;font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(120,80,20,.8);letter-spacing:.1em;padding:6px 24px 0;
}
@media(max-width:600px){
  .index-body{margin:12px 8px 40px;padding:28px 16px 40px;}
  .toc-item{padding:10px 2px;}
  .tlat{font-size:.95rem;}
  .tname{font-size:.85rem;margin-left:6px;}
  .tdots{display:none;}
  .tchap{display:none;}
  .tarr{margin-left:auto;}
  .conf-bar{flex-direction:column;align-items:center;gap:6px;padding:14px 16px 0;}
  .conf-btn{width:100%;max-width:260px;text-align:center;border-radius:2px!important;border-left:1px solid rgba(100,60,20,.3)!important;}
  .h-cross-big{font-size:2.8rem;}
  .h-orn,.h-orn-bot{letter-spacing:.25em;}
  .sec-head{padding:30px 0 8px;}
  .sec-t{font-size:1.8rem;}
  .topbar{padding:10px 12px;}
  .topbar a{padding:5px 10px;font-size:.62rem;}
}
/* KREUZ-GRAVUR */
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}
</style>
</head>
<body>

<nav class="topbar">
  <a href="../index.html">&#8592; Zur Übersicht</a>
  <a href="../back-cover.html" style="margin-left:auto">Rückseite &#8594;</a>
</nav>

<header>
  <div class="h-orn">✦ &nbsp; ✦ &nbsp; ✦</div>
  <svg class="h-cross-big" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10" fill="none" stroke="#C8A030" stroke-width="1.8" stroke-linecap="square"/></svg>
  <div class="htitle">${BIBLE_NAMES[trans.lang] || trans.native}</div>
  <div class="h-rule-full"></div>
  <div class="hlang">${trans.native.toUpperCase()}</div>
  <div class="h-orn-bot">—— ✦ … ✦ ——</div>
</header>

<main class="index-body">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>

<!-- -- Konfessions-Switcher -- -->
<div class="conf-bar">
  <button class="conf-btn" data-conf="catholic">✝&#xFE0E; Katholisch</button>
  <button class="conf-btn" data-conf="protestant">☩  Protestantisch</button>
</div>
<div class="conf-note" id="conf-note"></div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">Vetus Testamentum</span>
  <span class="sec-t sec-t-p">Altes Testament</span>
  <div class="sec-rule"></div>
  <span class="sec-s">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; ${booksVT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksVT)}
</div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">Novum Testamentum</span>
  <span class="sec-t sec-t-p">Neues Testament</span>
  <div class="sec-rule"></div>
  <span class="sec-s">N O V I &nbsp; T E S T A M E N T I &nbsp;·&nbsp; ${booksNT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksNT)}
</div>

${dkSec}

</main>

<footer style="text-align:center;padding:32px 24px 40px;font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.2em;color:rgba(200,160,48,.3);">
  KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
</footer>

<script>
(function(){
  var NOTES = {
    catholic:    '73 Bücher · Vulgata Clementina + Deuterokanonisch',
    protestant:  '66 Bücher · Altes & Neues Testament'
  };
  var saved = localStorage.getItem('biblia_conf') || 'catholic';
  var btns  = document.querySelectorAll('.conf-btn');
  var note  = document.getElementById('conf-note');
  function setConf(c) {
    document.body.dataset.conf = c;
    localStorage.setItem('biblia_conf', c);
    btns.forEach(function(b){ b.classList.toggle('active', b.dataset.conf === c); });
    note.textContent = NOTES[c] || '';
  }
  setConf(saved);
  btns.forEach(function(b){
    b.addEventListener('click', function(){ setConf(b.dataset.conf); });
  });
})();
</script>
</body>
</html>`;
}

// -------------------------------------------------------
//  BUCHSEITE (Interlinear)
// -------------------------------------------------------

function buildBookPage(book, trans, vulgChaps, transChaps, lutherChaps) {
  // Vers-Map für Übersetzung
  const tm = {};
  if (transChaps) {
    for (const ch of transChaps) {
      tm[ch.nr] = {};
      for (const v of ch.verses) tm[ch.nr][v.nr] = v.text;
    }
  }
  // Luther-Map (Protestantisch)
  const lm = {};
  if (lutherChaps) {
    for (const ch of lutherChaps) {
      lm[ch.nr] = {};
      for (const v of ch.verses) lm[ch.nr][v.nr] = v.text;
    }
  }

  const bookIdx = BOOKS.findIndex(b => b.nr === book.nr);
  const prev    = BOOKS[bookIdx - 1];
  const next    = BOOKS[bookIdx + 1];

  const testLabel = book.testament === 'NT' ? 'NOVUM TESTAMENTUM'
    : book.testament === 'DK' ? 'LIBRI DEUTEROCANONICI'
    : 'VETUS TESTAMENTUM';

  const chCount = vulgChaps.length;
  const vCount  = vulgChaps.reduce((s, c) => s + c.verses.length, 0);

  const chapBlocks = vulgChaps.map(ch => {
    const verseBlocks = ch.verses.map((v, vi) => {
      const lat    = esc(v.text);
      const lut    = esc((lm[ch.nr] || {})[v.nr] || '');
      const tra    = esc((tm[ch.nr] || {})[v.nr] || '');
      const isFirst = vi === 0 ? ' first' : '';
      return `<div class="vb${isFirst}" id="v${ch.nr}-${v.nr}">
  <span class="vn">${v.nr}</span>
  <div class="vt">
    <p class="base base-c">${lat}</p>
    ${lut ? `<p class="base base-p">${lut}</p>` : '<p class="base base-p"></p>'}
    ${tra ? `<p class="tra">${tra}</p>` : ''}
  </div>
</div>`;
    }).join('\n');

    return `<section class="chap" id="c${ch.nr}">
  <div class="chhead">
    <span class="chrom">${toRoman(ch.nr)}</span>
    <span class="chlbl chlbl-c">Caput ${toRoman(ch.nr)}</span>
    <span class="chlbl chlbl-p">Das ${ch.nr}. Capitel</span>
  </div>
${verseBlocks}
</section>`;
  }).join('\n\n');

  const prevLink = prev
    ? `<a href="${bookFile(prev)}">&#8592; ${prev.latin}</a>`
    : `<span></span>`;
  const nextLink = next
    ? `<a href="${bookFile(next)}">${next.latin} &#8594;</a>`
    : `<span></span>`;
  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${book.latin} &middot; ${trans.native} &middot; Biblia Catholica</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#e8e0d0;
  font-family:'EB Garamond',serif;
  color:#1A0E06;
  font-size:17px;
}

/* ------------------------------------------
   BUCHKOPF
------------------------------------------ */
.bhead{
  background:#f5f0e8;
  padding:36px 28px 28px;
  text-align:center;
  border-bottom:3px solid #B8962E;
  position:relative;overflow:hidden;
}
/* Innerer Rahmen */
.bhead::before{
  content:'';position:absolute;inset:14px;
  border:1px solid rgba(140,100,20,.2);
  pointer-events:none;
}
.bhead::after{
  content:'';position:absolute;inset:22px;
  border:0.5px solid rgba(140,100,20,.08);
  pointer-events:none;
}
.btestament{
  display:inline-block;
  border:1px solid rgba(100,60,20,.28);
  color:rgba(42,0,8,.45);
  font-family:'Cinzel',serif;font-size:.55rem;
  letter-spacing:.3em;padding:4px 18px;
  border-radius:2px;margin-bottom:16px;
  position:relative;
}
.blatin{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(1.9rem,7vw,3.4rem);
  color:#2a0008;
  letter-spacing:.02em;position:relative;
  display:none;
}
body:not([data-conf]) .blatin-c,body[data-conf="catholic"] .blatin-c{display:block;}
body[data-conf="protestant"] .blatin-p{display:block;}
.btrans{
  font-family:'Cinzel',serif;
  font-size:.88rem;
  color:#5a1020;margin-top:10px;
  letter-spacing:.16em;position:relative;
}
.bmeta{
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(42,0,8,.35);margin-top:6px;
  letter-spacing:.08em;position:relative;
}

/* ------------------------------------------
   KAPITELINHALT
------------------------------------------ */
.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#FAF5E8;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.55),0 2px 12px rgba(0,0,0,.35),inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;
}
.content::before{
  content:'';
  position:absolute;
  inset:12px;
  border:1px solid rgba(184,150,46,.08);
  pointer-events:none;
}

.chap{margin-top:0;}

.chhead{
  text-align:center;
  padding:40px 0 20px;
  margin-bottom:16px;
  position:relative;
}
.chhead::before{
  content:'——— ✦ ✦ ✦ ———';
  display:block;
  font-size:.7rem;
  color:rgba(184,150,46,.45);
  letter-spacing:.35em;
  margin-bottom:16px;
}
.chhead::after{
  content:'';
  display:block;
  width:200px;
  height:1px;
  margin:14px auto 0;
  background:linear-gradient(to right,transparent,#B8962E,transparent);
}
.chrom{
  font-family:'Cinzel Decorative',serif;
  font-size:4rem;color:#8B6914;
  display:block;
  text-shadow:0 2px 18px rgba(184,150,46,.2);
  line-height:1;
}
.chlbl{
  font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(184,150,46,.42);letter-spacing:.32em;
  display:none;margin-top:8px;
}
body:not([data-conf]) .chlbl-c,body[data-conf="catholic"] .chlbl-c{display:block;}
body[data-conf="protestant"] .chlbl-p{display:block;}

/* ------------------------------------------
   VERSE
------------------------------------------ */
.vb{
  display:flex;
  padding:20px 6px;
  border-bottom:1px solid rgba(184,150,46,.12);
  background:none;
  border-radius:2px;
  transition:background .15s;
}
.vb:hover{
  background:rgba(184,150,46,.04);
}

/* Versnummer */
.vn{
  flex-shrink:0;
  width:38px;
  padding-top:4px;
  font-family:'Cinzel',serif;font-size:.56rem;
  color:rgba(184,150,46,.52);text-align:right;
  padding-right:12px;line-height:2.4;
}

.vt{
  flex:1;
  padding:0 20px 0 4px;
}

/* BASIS-TEXT — wechselt je nach Konfession */
.base{
  font-family:'EB Garamond',serif;
  font-size:1.2rem;
  font-weight:500;
  line-height:2.1;
  color:#3D1A08;
  display:none;
}
body:not([data-conf]) .base-c,
body[data-conf="catholic"] .base-c { display:block; }
body[data-conf="protestant"] .base-p { display:block; }
.base:empty { display:none !important; }

/* ÜBERSETZUNG — SEKUNDÄR: kleiner, kursiv, unter dem Latein */
.tra{
  font-family:'EB Garamond',serif;
  font-size:.93rem;
  font-style:italic;
  line-height:1.95;
  color:#1E2848;
  margin-top:5px;
  padding-left:14px;
  border-left:2px solid rgba(90,110,170,.2);
}

/* Drop-Cap: erster Vers – nur Latein und Luther */
.vb.first .base-c::first-letter,
.vb.first .base-p::first-letter{
  font-family:'Cinzel Decorative',serif;
  font-size:4em;
  float:left;
  line-height:.7;
  padding-right:.08em;
  margin-top:.07em;
  color:#B8962E;
  text-shadow:1px 2px 6px rgba(0,0,0,.12);
}

/* ------------------------------------------
   BUCH-NAVIGATION (unten)
------------------------------------------ */
.bnav{
  display:flex;justify-content:space-between;align-items:center;
  background:#f5f0e8;border-top:3px solid #B8962E;
  padding:12px 24px;gap:12px;
}
.bnav a,.bnav .dim{
  color:#5a1020;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.07em;
  padding:6px 16px;
  border:1px solid rgba(100,60,20,.28);
  border-radius:2px;transition:background .18s;
}
.bnav a:hover{background:rgba(100,60,20,.08);}
.bnav .dim{color:rgba(42,0,8,.2);border-color:rgba(42,0,8,.1);}
.bnav .center{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:rgba(42,0,8,.55);text-align:center;
  letter-spacing:.06em;text-decoration:none;
  border:1px solid rgba(100,60,20,.28);border-radius:2px;
  padding:6px 20px;transition:background .18s;
}
.bnav .center:hover{background:rgba(100,60,20,.08);}

/* Protestant: Luther-Text in Altdeutsch */
body[data-conf="protestant"] .base-p{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:1.08rem;
  letter-spacing:.01em;
}

/* DRUCK */
@media print{
  .bnav{display:none;}
  .bhead{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .vb{break-inside:avoid;}
}

/* MOBIL */
@media(max-width:600px){
  .blatin{font-size:1.8rem;}
  .base{font-size:1rem;}
  .tra{font-size:.84rem;}
  .content{padding:16px 18px 60px;margin:0;border-left:none;border-right:none;border-radius:0;}
  .chrom{font-size:1.8rem;}
}
/* KREUZ-GRAVUR */
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}
</style>
</head>
<body>
<header class="bhead">
  <div class="btestament">${testLabel}</div>
  <div class="blatin blatin-c">${book.latin.toUpperCase()}</div>
  <div class="blatin blatin-p">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.de)[book.nr-1]||book.name}</div>
  <div class="btrans">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.en)[book.nr-1]} &nbsp;&middot;&nbsp; <em>${trans.native}</em></div>
  <div class="bmeta">${chCount} Capita &nbsp;&middot;&nbsp; ${vCount} Versus</div>
</header>

<main class="content">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>
${chapBlocks}
</main>

<nav class="bnav">
  ${prevLink}
  <a href="../index.html" class="center">? &nbsp; Inhaltsverzeichnis</a>
  ${nextLink}
</nav>

<script>
(function(){
  var c = localStorage.getItem('biblia_conf') || 'catholic';
  document.body.dataset.conf = c;
})();
</script>
</body>
</html>`;
}

// -------------------------------------------------------
//  HAUPTPROGRAMM
// -------------------------------------------------------

async function main() {
  console.log('\n+-------------------------------------------------------+');
  console.log('�  BIBLIA CATHOLICA INTERLINEARIS - BUILD v3           �');
  console.log('+-------------------------------------------------------+\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌  Kein "data/"-Ordner. Bitte zuerst: node fetch-texts.js\n');
    process.exit(1);
  }

  mkDir(OUT_DIR);

  // Cover + Rückseite + Hauptindex
  fs.writeFileSync(path.join(OUT_DIR, 'cover.html'),      buildCover());
  console.log('  ✓ cover.html');
  fs.writeFileSync(path.join(OUT_DIR, 'back-cover.html'), buildBackCover());
  console.log('  ✓ back-cover.html');

  // Vulgata laden (Bücher 1–73)
  const vulg = {};
  for (const book of BOOKS) {
    const raw = loadBook('vulgate', book.nr);
    if (raw) vulg[book.nr] = parseBook(raw);
  }
  console.log(`  ✓ Vulgata: ${Object.keys(vulg).length} Bücher`);

  // Pro Übersetzung
  for (const trans of TRANSLATIONS) {
    process.stdout.write(`\n  📖  ${trans.native} (${trans.code}) ...`);

    const tDir = path.join(OUT_DIR, trans.code);
    const bDir = path.join(tDir, 'bücher');
    mkDir(bDir);

    // Sprachcover + Vorwort
    fs.writeFileSync(path.join(tDir, 'cover.html'),   buildLangCover(trans));
    fs.writeFileSync(path.join(tDir, 'vorwort.html'), buildVorwort(trans));

    const avail = [];
    for (const book of BOOKS) {
      const vulgData = vulg[book.nr];
      if (!vulgData) continue;
      const tRaw      = loadBook(trans.code, book.nr);
      const tChap     = tRaw ? parseBook(tRaw) : null;
      const lutherRaw = loadLutherBook(book.nr);
      const lutherChap = lutherRaw ? parseBook(lutherRaw) : null;
      fs.writeFileSync(path.join(bDir, bookFile(book)), buildBookPage(book, trans, vulgData, tChap, lutherChap));
      avail.push({...book, chapCount: vulgData.length});
    }
    fs.writeFileSync(path.join(tDir, 'index.html'), buildLangIndex(trans, avail));
    process.stdout.write(` ✓ (${avail.length} Bücher)\n`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildMainIndex());
  console.log('\n  ✓ index.html\n');
  console.log('✅  Fertig! Öffne: Übersetzungen/german/cover.html\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  process.exit(1);
});
