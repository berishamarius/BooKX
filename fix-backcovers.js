'use strict';
const fs   = require('fs');
const path = require('path');
const ROOT = __dirname;

// ─── 1. FIX BIBLE BACK-COVER IMAGE PATHS ────────────────────────────────────
// Image lives at dist-diebibel/Bibel-Rueckseite-Katholisch.png
// Root back-cover:  dist-diebibel/back-cover.html   → "Bibel-Rueckseite-Katholisch.png"
// Lang back-covers: dist-diebibel/{lang}/back-cover.html → "../Bibel-Rueckseite-Katholisch.png"

const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');
const BIBLE_LANGS = ['albanian','croatian','czech','dutch','french','german',
                     'hungarian','italian','kjv','polish','portuguese','romanian',
                     'russian','spanish','swedish','tagalog','ukrainian'];

// Root back-cover image path
const rootBC = path.join(BIBLE_DIST, 'back-cover.html');
if (fs.existsSync(rootBC)) {
  let h = fs.readFileSync(rootBC, 'utf8');
  h = h.replace(/src="\.\.\/Bibel-Rueckseite-Katholisch\.png"/g,
                'src="Bibel-Rueckseite-Katholisch.png"');
  fs.writeFileSync(rootBC, h, 'utf8');
  console.log('✓ dist-diebibel/back-cover.html image path fixed');
}

// Language-specific back-covers
let bibleFixed = 0;
for (const lang of BIBLE_LANGS) {
  const bc = path.join(BIBLE_DIST, lang, 'back-cover.html');
  if (!fs.existsSync(bc)) continue;
  let h = fs.readFileSync(bc, 'utf8');
  // Fix any deep relative path to the correct one-level-up path
  h = h.replace(/src="(?:\.\.\/)*Bibel-Rueckseite-Katholisch\.png"/g,
                'src="../Bibel-Rueckseite-Katholisch.png"');
  fs.writeFileSync(bc, h, 'utf8');
  bibleFixed++;
}
console.log(`✓ ${bibleFixed} Bible language back-cover image paths fixed`);

// ─── 2. FIX QURAN BACK-COVERS (copy German design, localized) ────────────────
const QURAN_DIR = path.join(ROOT, 'dist-alquran', 'Übersetzungen');

// Arabic Al-Fatiha text (same for all)
const FATIHA_AR = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ<br>ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوۡمِ ٱلدِّينِ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ<br>ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ<br>صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ';

const LANG_DATA = {
  Albanisch:  { code:'sq', pl:'سورة الفاتحة · Al-Fatiha · Hapësuese',
    dua:'Allahu na udhëzoftë përmes Kuranit, na dhuroftë mëshirë dhe qëndresë. Amin.',
    nav:'← Hyrja', title:'Kapaku i pasëm · القرآن الكريم' },
  Bengalisch: { code:'bn', pl:'সূরা আল-ফাতিহা · Al-Fatiha · উদ্বোধনকারী',
    dua:'আল্লাহ আমাদের কুরআনের মাধ্যমে হিদায়াত, রহমত ও দৃঢ়তা দান করুন। আমিন।',
    nav:'← ভূমিকা', title:'পিছনের প্রচ্ছদ · القرآن الكريم' },
  Bosnisch:   { code:'bs', pl:'سورة الفاتحة · Al-Fatiha · Otvarač',
    dua:'Neka nas Allah vodi putem Kur\'ana, podari nam milost i postojanost. Amin.',
    nav:'← Uvod', title:'Stražnja korica · القرآن الكريم' },
  Chinesisch: { code:'zh', pl:'سورة الفاتحة · Al-Fatiha · 开端章',
    dua:'愿安拉通过古兰经赐予我们引导、仁慈与坚定。阿米尼。',
    nav:'← 序言', title:'封底 · القرآن الكريم' },
  Englisch:   { code:'en', pl:'سورة الفاتحة · Al-Fatiha · The Opening',
    dua:'May Allah guide us through the Quran, grant us mercy and steadfastness. Ameen.',
    nav:'← Introduction', title:'Back Cover · القرآن الكريم' },
  Hausa:      { code:'ha', pl:'سورة الفاتحة · Al-Fatiha · Mai Buɗewa',
    dua:'Allah Ya shirya mu ta hanyar Alƙur\'ani, Ya ba mu rahama da ƙarfin hali. Amin.',
    nav:'← Gabatarwa', title:'Bayan Murfin · القرآن الكريم' },
  Hindi:      { code:'hi', pl:'सूरह अल-फ़ातिहा · Al-Fatiha · आरम्भ',
    dua:'अल्लाह हमें क़ुरआन के माध्यम से हिदायत, रहमत और स्थिरता प्रदान करे। आमीन।',
    nav:'← परिचय', title:'पिछला आवरण · القرآن الكريم' },
  Indonesisch:{ code:'id', pl:'سورة الفاتحة · Al-Fatiha · Pembuka',
    dua:'Semoga Allah membimbing kita melalui Al-Quran, memberikan rahmat dan keteguhan. Amin.',
    nav:'← Pengantar', title:'Sampul Belakang · القرآن الكريم' },
  Persisch:   { code:'fa', pl:'سوره الفاتحه · Al-Fatiha · آغازگر',
    dua:'خداوند ما را از طریق قرآن هدایت فرماید، رحمت و استواری عنایت کند. آمین.',
    nav:'← مقدمه', title:'جلد پشتی · القرآن الكريم' },
  Russisch:   { code:'ru', pl:'سورة الفاتحة · Аль-Фатиха · Открывающая',
    dua:'Да направит нас Аллах через Коран, одарит нас милостью и стойкостью. Амин.',
    nav:'← Предисловие', title:'Задняя обложка · القرآن الكريم' },
  Türkisch:   { code:'tr', pl:'سورة الفاتحة · Al-Fatiha · Açış',
    dua:'Allah bizi Kur\'an aracılığıyla hidayete erdirsin, merhamet ve sebat ihsan etsin. Amin.',
    nav:'← Giriş', title:'Arka Kapak · القرآن الكريم' },
  Urdu:       { code:'ur', pl:'سورۃ الفاتحہ · الفاتحہ · کھولنے والی',
    dua:'اللہ ہمیں قرآن کے ذریعے ہدایت، رحمت اور استقامت عطا فرمائے۔ آمین۔',
    nav:'← تعارف', title:'پچھلا سرورق · القرآن الكريم' },
  Uygurisch:  { code:'ug', pl:'سورة الفاتحة · ئەل-ئاتىھە · ئاچىقلىغۇچ',
    dua:'اللە بىزنى قۇرئان ئارقىلىق ھىدايەت قىلسۇن، رەھمەت ۋە قەتئىيلىك بەرسۇن. ئامىن.',
    nav:'← كىرىش سۆز', title:'ئارقا مۇقاۋا · القرآن الكريم' },
};

const STARS_B64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PHBvbHlnb24gcG9pbnRzPSI3LjAwLDAuODQgNy45Niw0LjY3IDExLjM2LDIuNjQgOS4zMyw2LjA0IDEzLjE2LDcuMDAgOS4zMyw3Ljk2IDExLjM2LDExLjM2IDcuOTYsOS4zMyA3LjAwLDEzLjE2IDYuMDQsOS4zMyAyLjY0LDExLjM2IDQuNjcsNy45NiAwLjg0LDcuMDAgNC42Nyw2LjA0IDIuNjQsMi42NCA2LjA0LDQuNjciIGZpbGw9InJnYmEoMjAxLDE2OCw3NiwwLjQwKSIvPjwvc3ZnPg==';

function makeQuranBackCover(langDir, d) {
  const rtl = ['ar','fa','ur','ug'].includes(d.code);
  return `<!DOCTYPE html>
<html lang="${d.code}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#0f2f1a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:14px;background:url("data:image/svg+xml;base64,${STARS_B64}") 0 0/14px 14px;border-bottom:1px solid rgba(201,168,76,.22);z-index:5;pointer-events:none;}
body::after{content:'';position:fixed;bottom:0;left:0;right:0;height:14px;background:url("data:image/svg+xml;base64,${STARS_B64}") 0 0/14px 14px;border-top:1px solid rgba(201,168,76,.22);z-index:5;pointer-events:none;}
a.bc{display:block;width:min(490px,92vw);position:relative;z-index:1;}
a.bc img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5% 24px 4%;text-align:center;pointer-events:none;}
.rule{width:70%;height:1px;margin:6px auto;background:linear-gradient(to right,transparent,rgba(212,165,116,.55),transparent);}
.pl{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.12em;color:rgba(212,165,116,.78);margin-bottom:10px;hyphens:none;-webkit-hyphens:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:.58rem;color:rgba(212,165,116,.94);direction:rtl;text-align:center;line-height:1.35;hyphens:none;-webkit-hyphens:none;}
.dua{font-style:italic;font-size:.78rem;color:rgba(230,214,178,.82);text-align:center;line-height:1.62;margin-top:10px;max-width:86%;hyphens:none;-webkit-hyphens:none;${rtl ? 'direction:rtl;' : ''}}
.nav-b{position:fixed;top:14px;left:18px;padding:8px 22px;border:none;background:transparent;color:rgba(212,165,116,.78);text-decoration:none;font-family:'Cinzel',serif;font-size:.6rem;font-weight:600;letter-spacing:.2em;transition:all .22s;z-index:10;}
.nav-b:hover{color:#e5c791;}
</style>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Amiri+Quran&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='56' font-family='serif' fill='%238a5800'>&#x06DE;</text></svg>">
<style>.overlay .ar{font-size:1.10rem !important;line-height:1.68 !important;}</style>
</head><body>
<a class="bc" href="intro.html">
  <img src="../../Back.png" alt="${d.title.split('·')[0].trim()}">
  <div class="overlay">
    <div class="pl">${d.pl}</div>
    <div class="ar">${FATIHA_AR}</div>
    <div class="rule"></div>
    <div class="dua">${d.dua}</div>
  </div>
</a>
<a class="nav-b" href="intro.html">${d.nav}</a>
</body></html>`;
}

let quranFixed = 0;
for (const [langDir, d] of Object.entries(LANG_DATA)) {
  const bcPath = path.join(QURAN_DIR, langDir, 'back-cover.html');
  if (!fs.existsSync(path.join(QURAN_DIR, langDir))) continue;
  const html = makeQuranBackCover(langDir, d);
  fs.writeFileSync(bcPath, html, 'utf8');
  quranFixed++;
  console.log(`✓ Quran ${langDir}/back-cover.html`);
}
console.log(`\n✅ Done: ${bibleFixed + 1} Bible + ${quranFixed} Quran back-covers fixed.\n`);
