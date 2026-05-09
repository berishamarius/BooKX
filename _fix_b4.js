// Fix build4.js:
// 1. Strip all translations except German + KJV (needed for structure)
// 2. Fix ï¿½ → correct chars in German book names + UI strings
// 3. Fix cross SVG (better proportions)
// 4. Fix backcover: div→a, remove button
// 5. Fix OUT_DIR encoding

const fs = require('fs');
let b4 = fs.readFileSync('CATHOLIC-BIBLE/build4.js', 'utf8');

// ── 1. Replace ï¿½ with correct chars in GERMAN DE array and UI text ──────
// German book names with corrupted chars:
// 'Kï¿½nige' → 'Könige'   (ï¿½ = ö)
// 'Sprichwï¿½rter' → 'Sprüchwörter' ... actually 'Sprichwörter' with ö
// Wait let me be precise from the de: array above:
// de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut',
//     '1. Samuel','2. Samuel','1. Kï¿½nige','2. Kï¿½nige','1. Chronik','2. Chronik',
//     'Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwï¿½rter','Kohelet','Hoheslied',
//     'Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos',
//     'Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi',
//     'Matthï¿½us','Markus','Lukas','Johannes','Apostelgeschichte','Rï¿½mer',
//     '1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser',
//     '1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus',
//     'Philemon','Hebrï¿½er','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes',
//     '3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabï¿½er','2. Makkabï¿½er',
//     'Weisheit','Sirach','Baruch','1. Esra (gr.)','2. Esra (gr.)','Gebet des Manasse',
//     'Gebet des Asarja','Susanna','Bel und der Drache','Zusï¿½tze zu Ester']

const corrections = [
  // German book names
  ["'1. K\u00ef\u00bf\u00bdnige'", "'1. Könige'"],
  ["'2. K\u00ef\u00bf\u00bdnige'", "'2. Könige'"],
  ["'Sprichw\u00ef\u00bf\u00bdrter'", "'Sprichwörter'"],
  ["'Matth\u00ef\u00bf\u00bdus'", "'Matthäus'"],
  ["'R\u00ef\u00bf\u00bdmer'", "'Römer'"],
  ["'Hebr\u00ef\u00bf\u00bder'", "'Hebräer'"],
  ["'1. Makkab\u00ef\u00bf\u00bder'", "'1. Makkabäer'"],
  ["'2. Makkab\u00ef\u00bf\u00bder'", "'2. Makkabäer'"],
  ["'Zus\u00ef\u00bf\u00bdtze zu Ester'", "'Zusätze zu Ester'"],
  // UI strings with Übersicht/Bücher etc
  ["B\u00ef\u00bf\u00bdCHERLISTE", 'BÜCHERLISTE'],
  ["\u00ef\u00bf\u00bdBERSETZUNGEN", 'ÜBERSETZUNGEN'],
  // OUT_DIR path
  ["\u00ef\u00bf\u00bdbersetzungen')", "Übersetzungen')"],
  // navigation / HTML template strings
  ["Zur \u00ef\u00bf\u00bdbersicht", 'Zur Übersicht'],
  ["R\u00ef\u00bf\u00bdckseite", 'Rückseite'],
  ["B\u00ef\u00bf\u00bdcher", 'Bücher'],
  ["W\u00ef\u00bf\u00brdiges", 'Würdiges'],
  // TRANSLATIONS display entries - keep corrupted ones, they'll be deleted
];

for (const [bad, good] of corrections) {
  b4 = b4.split(bad).join(good);
}

// ── 2. Strip all non-German non-KJV translations ─────────────────────────
// Keep only KJV + German in TRANSLATIONS array
b4 = b4.replace(
  /const TRANSLATIONS = \[[\s\S]*?\];/,
  `const TRANSLATIONS = [
  { code: 'german', lang: 'de', native: 'Deutsch', display: 'Textbibel (1906)', flag: '🇩🇪' },
];`
);

// ── 3. Strip all non-de, non-en entries from BOOK_NAMES ──────────────────
// Keep only en + de (en needed as fallback)
// Find BOOK_NAMES object and replace
b4 = b4.replace(
  /const BOOK_NAMES = \{[\s\S]*?\};/,
  `const BOOK_NAMES = {
  en:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','Tobit','Judith','1 Maccabees','2 Maccabees','Wisdom','Sirach','Baruch','1 Esdras','2 Esdras','Prayer of Manasseh','Prayer of Azariah','Susanna','Bel and the Dragon','Additions to Esther'],
  de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwörter','Kohelet','Hoheslied','Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabäer','2. Makkabäer','Weisheit','Sirach','Baruch','1. Esra (gr.)','2. Esra (gr.)','Gebet des Manasse','Gebet des Asarja','Susanna','Bel und der Drache','Zusätze zu Ester'],
};`
);

// ── 4. Fix remaining ï¿½ (catch-all: replace with ? to avoid crashes) ────
const remaining = (b4.match(/\u00ef\u00bf\u00bd/g)||[]).length;
console.log('Remaining ï¿½ before catch-all:', remaining);
// Only replace in string literals / comments, not in logic
// For now replace all remaining with ? as placeholder
b4 = b4.split('\u00ef\u00bf\u00bd').join('?');
console.log('After catch-all:', (b4.match(/\u00ef\u00bf\u00bd/g)||[]).length);

// ── 5. Fix cross SVG: better proportions (square-ish cross, not thin) ────
// viewBox "0 0 2 3" with path "M1,0V3M0,.9H2" = vertical bar full height,
// horizontal bar at 30% = too high and arms too thin
// Better: viewBox "0 0 10 14", vertical bar M5,0 V14, horizontal M0,4 H10
// crossbar at ~29% height (4/14), centered. stroke-width increase too.
b4 = b4.replace(
  /\.b-wm path\{fill:none;stroke:rgba\([^)]+\);stroke-width:[^;]+;stroke-linecap:butt;\}/,
  '.b-wm path{fill:none;stroke:rgba(184,150,46,.09);stroke-width:.6;stroke-linecap:square;}'
);
b4 = b4.replace(
  /<div class="b-wm"><svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 2 3"><path d="M1,0V3M0,\.9H2"\/><\/svg><\/div>/g,
  '<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>'
);

// ── 6. Fix backcover: div→a + remove btn-wrap ─────────────────────────────
// Remove .btn-wrap + .btn CSS
const btnCssIdx = b4.indexOf('\r\n.btn-wrap{');
if (btnCssIdx >= 0) {
  const btnHoverEnd = b4.indexOf('}', b4.indexOf('\r\n.btn:hover{', btnCssIdx) + 13) + 1;
  b4 = b4.slice(0, btnCssIdx) + b4.slice(btnHoverEnd);
  console.log('b4 btn CSS removed');
}
// Change <div class="book"> → <a class="book" href="${coverLink}">
const divBook4 = b4.indexOf('<div class="book">\r\n  <img src="${imgPath}"');
if (divBook4 >= 0) {
  b4 = b4.slice(0, divBook4) + '<a class="book" href="${coverLink}">' + b4.slice(divBook4 + '<div class="book">'.length);
  console.log('b4 div→a done');
}
// Remove btn-wrap HTML block, change </div> → </a>
const bwi4 = b4.indexOf('\r\n<div class="btn-wrap">\r\n  <a href="${coverLink}"');
if (bwi4 >= 0) {
  const closingDiv = b4.lastIndexOf('\r\n</div>', bwi4);
  const bodyEnd = b4.indexOf('\r\n</body>', bwi4);
  if (closingDiv >= 0 && bodyEnd >= 0) {
    b4 = b4.slice(0, closingDiv) + '\r\n</a>' + b4.slice(bodyEnd);
    console.log('b4 btn-wrap HTML removed');
  }
}

fs.writeFileSync('CATHOLIC-BIBLE/build4.js', b4);
console.log('\nbuild4.js saved.');
console.log('Any ï¿½ left:', (b4.match(/\u00ef\u00bf\u00bd/g)||[]).length);
console.log('Könige present:', b4.includes('Könige'));
console.log('btn-wrap CSS count:', (b4.match(/btn-wrap/g)||[]).length);
console.log('cross viewBox 10 14:', b4.includes('viewBox="0 0 10 14"'));
