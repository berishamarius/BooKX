const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'dist-alquran', 'Übersetzungen');

// Language-specific nav labels for woerterbuch
const NAV = {
  Albanisch:   { back: '← Faqja e Surave', all: 'Të gjitha gjuhët →', entries: v => `${v} hyrje` },
  Bengalisch:  { back: '← সূরার তালিকা',   all: 'সকল ভাষা →',         entries: v => `${v} এন্ট্রি` },
  Bosnisch:    { back: '← Popis Sura',       all: 'Svi jezici →',       entries: v => `${v} unosa` },
  Chinesisch:  { back: '← 章节目录',          all: '所有语言 →',          entries: v => `${v} 条目` },
  Deutsch:     { back: '← Zur Sure-Übersicht', all: 'Alle Sprachen →', entries: v => `${v} Einträge` },
  Englisch:    { back: '← Surah Index',      all: 'All Languages →',    entries: v => `${v} Entries` },
  Hausa:       { back: '← Jerin Surori',     all: 'Duk Harsuna →',      entries: v => `${v} shigarwa` },
  Hindi:       { back: '← सूरह सूची',         all: 'सभी भाषाएं →',       entries: v => `${v} प्रविष्टियाँ` },
  Indonesisch: { back: '← Daftar Surah',     all: 'Semua Bahasa →',     entries: v => `${v} entri` },
  Persisch:    { back: '← فهرست سوره‌ها',    all: 'همه زبان‌ها →',      entries: v => `${v} ورودی` },
  Russisch:    { back: '← Список Сур',       all: 'Все языки →',        entries: v => `${v} записей` },
  Türkisch:    { back: '← Sure Listesi',     all: 'Tüm Diller →',       entries: v => `${v} Giriş` },
  Urdu:        { back: '← فہرست سورتیں',    all: 'تمام زبانیں →',      entries: v => `${v} اندراجات` },
  Uygurisch:   { back: '← سۈرە تىزىملىكى', all: 'بارلىق تىللار →',   entries: v => `${v} تىزىملىك` },
};

// Dict icon style + element to REMOVE from index/intro
const DICT_STYLE_RE = /<style id="dict-icon-style">[\s\S]*?<\/style>\s*/g;
const DICT_BTN_RE   = /<a id="dict-icon-btn"[\s\S]*?<\/a>\s*/g;

// Bottom nav pattern in woerterbuch — replace texts and fix hrefs
function fixWoerterbuchNav(html, lang) {
  const n = NAV[lang];
  if (!n) return html;

  // Replace bot-nav content wholesale (uses <nav class="bot-nav">)
  html = html.replace(
    /(<nav class="bot-nav">)[\s\S]*?(<\/nav>)/,
    `$1\n  <a class="bn" href="index.html">${n.back}</a>\n  <span class="count" id="cnt"></span>\n  <a class="bn" href="../../cover.html">${n.all}</a>\n$2`
  );
  return html;
}

let fixed = 0;

const langs = fs.readdirSync(BASE).filter(d => fs.statSync(path.join(BASE,d)).isDirectory());

for (const lang of langs) {
  const dir = path.join(BASE, lang);

  // 1. Remove dict-icon from index.html
  for (const fname of ['index.html', 'intro.html']) {
    const fp = path.join(dir, fname);
    if (!fs.existsSync(fp)) continue;
    let html = fs.readFileSync(fp, 'utf8');
    const before = html;
    html = html.replace(DICT_STYLE_RE, '');
    html = html.replace(DICT_BTN_RE, '');
    if (html !== before) {
      fs.writeFileSync(fp, html, 'utf8');
      console.log(`  Removed dict-icon from ${lang}/${fname}`);
      fixed++;
    }
  }

  // 2. Fix woerterbuch nav language
  const wfp = path.join(dir, 'woerterbuch.html');
  if (fs.existsSync(wfp)) {
    let html = fs.readFileSync(wfp, 'utf8');
    const before = html;
    html = fixWoerterbuchNav(html, lang);
    if (html !== before) {
      fs.writeFileSync(wfp, html, 'utf8');
      console.log(`  Fixed woerterbuch nav: ${lang}`);
      fixed++;
    }
  }
}

// 3. Fix cover.html: tile-dict from right:6px to left:6px
const coverPath = path.join(__dirname, '..', 'dist-alquran', 'cover.html');
let cover = fs.readFileSync(coverPath, 'utf8');
if (cover.includes('top:6px;right:6px')) {
  cover = cover.replace('top:6px;right:6px', 'top:6px;left:6px');
  fs.writeFileSync(coverPath, cover, 'utf8');
  console.log('  Fixed cover.html: tile-dict right→left');
  fixed++;
}

console.log(`\nDone. ${fixed} changes applied.`);
