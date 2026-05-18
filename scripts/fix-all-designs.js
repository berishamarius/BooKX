'use strict';
/**
 * fix-all-designs.js
 * Rebuilds all non-German Quran and Bible pages with correct design.
 * Also fixes cover pages (English text, dict icon position).
 */
const fs   = require('fs');
const path = require('path');

const BASE  = path.resolve(__dirname, '..');
const QBASE = path.join(BASE, 'dist-alquran', '\xDCbersetzungen');   // dist-alquran/Übersetzungen
const BBASE = path.join(BASE, 'dist-diebibel');

// ============================================================
// QURAN LANGUAGE DATA
// ============================================================
const QURAN_LANGS = {
  Albanisch: {
    lang:'sq', dir:'ltr', native:'Shqip',
    navIntro:'← Hyrja', navBack:'Kapak →',
    forewordTitle:'Parathënie',
    forewordParagraphs:[
      'Kurani është shpallje, udhëzim dhe kujtesë për zemrën.',
      'Vargjet arabisht mbeten burimi. Përkthimi shqip shërben si ndihmë për të kuptuar, jo si zëvendësim.',
      'Lexo me qetësi, me respekt dhe me zemër të sinqertë. Allahu të udhëzoftë me qartësi, mëshirë dhe vendosmëri.'
    ],
    bismi:'Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit.',
    ctaText:'Lexo',
    dictSubtitle:'FJALOR · ARABISHTJA KURANORE',
    footnote:'Përkthim kuptimor — jo pasqyrim fjalë për fjalë i origjinalit arabisht.',
    introNavCover:'← Kopertina', introNavBack:'Kapak →'
  },
  Bengalisch: {
    lang:'bn', dir:'ltr', native:'বাংলা',
    navIntro:'← ভূমিকা', navBack:'পেছনের কভার →',
    forewordTitle:'ভূমিকা',
    forewordParagraphs:[
      'কুরআন হৃদয়ের জন্য ওহী, সৎপথের নির্দেশনা এবং স্মারক।',
      'আরবি আয়াতগুলো মূল উৎস। বাংলা অনুবাদ বোঝার সহায়ক, প্রতিস্থাপন নয়।',
      'শান্তভাবে, সম্মানের সাথে এবং সৎ হৃদয়ে পড়ুন। আল্লাহ আপনাকে স্পষ্টতা, রহমত ও অবিচলতায় পরিচালিত করুন।'
    ],
    bismi:'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে।',
    ctaText:'পড়ুন',
    dictSubtitle:'অভিধান · কুরআনিক আরবি',
    footnote:'অর্থগত অনুবাদ — আরবি মূলের শব্দানুযায়ী অনুবাদ নয়।',
    introNavCover:'← প্রচ্ছদ', introNavBack:'পেছনের কভার →'
  },
  Bosnisch: {
    lang:'bs', dir:'ltr', native:'Bosanski',
    navIntro:"← Predgovor", navBack:"Zadnja korica →",
    forewordTitle:"Predgovor",
    forewordParagraphs:[
      "Kur'an je objava, uputa i podsjetnik za srce.",
      "Arapski ajeti ostaju izvor. Bosanski prijevod služi kao pomoć za razumijevanje, ne kao zamjena.",
      "Čitaj s mirom, poštovanjem i iskrenošću. Neka te Allah vodi jasnoćom, milošću i ustrajnošću."
    ],
    bismi:"U ime Allaha, Milostivog, Samilosnog.",
    ctaText:"Čitaj",
    dictSubtitle:"RJEČNIK · KURANIČKI ARAPSKI",
    footnote:"Prijevod po smislu — nije doslovno preslikavanje arapskog originala.",
    introNavCover:"← Korica", introNavBack:"Zadnja korica →"
  },
  Chinesisch: {
    lang:'zh', dir:'ltr', native:'中文',
    navIntro:'← 前言', navBack:'封底 →',
    forewordTitle:'前言',
    forewordParagraphs:[
      '《古兰经》是启示、指引和心灵的提醒。',
      '阿拉伯文经文是原始来源。中文译文仅为理解辅助，并非替代。',
      '以平静、尊重和诚挚的心阅读。愿安拉以清明、慈悯和坚定引导你。'
    ],
    bismi:'奉至仁至慈的真主之名。',
    ctaText:'阅读',
    dictSubtitle:'词典 · 古兰经阿拉伯语',
    footnote:'意义翻译 — 并非阿拉伯原文的逐字对照。',
    introNavCover:'← 封面', introNavBack:'封底 →'
  },
  Englisch: {
    lang:'en', dir:'ltr', native:'English',
    navIntro:'← Foreword', navBack:'Back Cover →',
    forewordTitle:'Foreword',
    forewordParagraphs:[
      'The Quran is revelation, guidance, and a reminder for the heart.',
      'The Arabic verses remain the source. The English translation serves as an aid to understanding, not a replacement.',
      'Read with calmness, with respect, and with a sincere heart. May Allah guide you with clarity, mercy, and steadfastness.'
    ],
    bismi:'In the name of Allah, the Most Gracious, the Most Merciful.',
    ctaText:'Read',
    dictSubtitle:'DICTIONARY · QURANIC ARABIC',
    footnote:'A meaning-based translation — not a word-for-word rendition of the Arabic original.',
    introNavCover:'← Cover', introNavBack:'Back Cover →'
  },
  Hausa: {
    lang:'ha', dir:'ltr', native:'Hausa',
    navIntro:"← Gabatarwa", navBack:"Bayan Murfin →",
    forewordTitle:"Gabatarwa",
    forewordParagraphs:[
      "Al-Qur'ani shi ne wahayin Allah, jagora da tunawa ga zuciya.",
      "Ayoyin Larabci su ne asali. Fassarar Hausa tana taimaka wa fahimta, ba maye ba.",
      "Ka karanta da kwanciyar hankali, da girmamawa da zuciya mai gaskiya. Allah ya ba ka hanya mai haske, rahama da juriya."
    ],
    bismi:"Da sunan Allah, Mai rahama, Mai jin kai.",
    ctaText:"Karanta",
    dictSubtitle:"ƘAMUS · LARABCIN AL-QUR'ANI",
    footnote:"Fassara ta ma'ana — ba ita ce kalmomin asalin Larabci ba.",
    introNavCover:"← Murfin", introNavBack:"Bayan Murfin →"
  },
  Hindi: {
    lang:'hi', dir:'ltr', native:'हिन्दी',
    navIntro:'← प्रस्तावना', navBack:'बैक कवर →',
    forewordTitle:'प्रस्तावना',
    forewordParagraphs:[
      'क़ुरआन दिल के लिए वहीं, मार्गदर्शन और स्मरण है।',
      'अरबी आयतें ही मूल स्रोत हैं। हिंदी अनुवाद समझने में सहायक है, विकल्प नहीं।',
      'शांति, सम्मान और सच्चे दिल से पढ़ें। अल्लाह आपको स्पष्टता, दया और दृढ़ता से मार्गदर्शन करे।'
    ],
    bismi:'अल्लाह के नाम से, जो बड़ा मेहरबान, बहुत दयावान है।',
    ctaText:'पढ़ें',
    dictSubtitle:'शब्दकोश · कुरआनी अरबी',
    footnote:'अर्थपूर्ण अनुवाद — अरबी मूल का शब्दशः अनुवाद नहीं।',
    introNavCover:'← कवर', introNavBack:'बैक कवर →'
  },
  Indonesisch: {
    lang:'id', dir:'ltr', native:'Bahasa Indonesia',
    navIntro:"← Kata Pengantar", navBack:"Sampul Belakang →",
    forewordTitle:"Kata Pengantar",
    forewordParagraphs:[
      "Al-Qur'an adalah wahyu, petunjuk, dan pengingat bagi hati.",
      "Ayat-ayat Arab tetap menjadi sumber. Terjemahan Indonesia berfungsi sebagai alat bantu pemahaman, bukan pengganti.",
      "Bacalah dengan tenang, dengan hormat, dan dengan hati yang tulus. Semoga Allah membimbing Anda dengan kejernihan, kasih sayang, dan keteguhan."
    ],
    bismi:"Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
    ctaText:"Baca",
    dictSubtitle:"KAMUS · BAHASA ARAB AL-QUR'AN",
    footnote:"Terjemahan makna — bukan terjemahan kata per kata dari aslinya.",
    introNavCover:"← Sampul", introNavBack:"Sampul Belakang →"
  },
  Persisch: {
    lang:'fa', dir:'ltr', native:'فارسی',
    navIntro:'← پیش‌گفتار', navBack:'جلد پشت →',
    forewordTitle:'پیش‌گفتار',
    forewordParagraphs:[
      'قرآن وحی، هدایت و یادآوری برای دل است.',
      'آیات عربی منبع اصلی هستند. ترجمه فارسی برای کمک به درک است، نه جایگزینی.',
      'با آرامش، با احترام و با قلبی صادق بخوانید. باشد که الله شما را با وضوح، رحمت و استقامت هدایت کند.'
    ],
    bismi:'به نام خداوند بخشنده مهربان.',
    ctaText:'خواندن',
    dictSubtitle:'فرهنگ لغات · عربی قرآنی',
    footnote:'ترجمه معنایی — ترجمه کلمه به کلمه متن اصلی عربی نیست.',
    introNavCover:'← جلد', introNavBack:'جلد پشت →'
  },
  Russisch: {
    lang:'ru', dir:'ltr', native:'Русский',
    navIntro:'← Предисловие', navBack:'Задняя обложка →',
    forewordTitle:'Предисловие',
    forewordParagraphs:[
      'Коран — это откровение, руководство и напоминание для сердца.',
      'Арабские аяты остаются источником. Русский перевод служит помощью для понимания, а не заменой.',
      'Читайте с покоем, с уважением и с искренним сердцем. Пусть Аллах направит вас ясностью, милостью и стойкостью.'
    ],
    bismi:'Во имя Аллаха, Милостивого, Милосердного.',
    ctaText:'Читать',
    dictSubtitle:'СЛОВАРЬ · КОРАНИЧЕСКИЙ АРАБСКИЙ',
    footnote:'Смысловой перевод — не дословное воспроизведение арабского оригинала.',
    introNavCover:'← Обложка', introNavBack:'Задняя обложка →'
  },
  Türkisch: {
    lang:'tr', dir:'ltr', native:'Türkçe',
    navIntro:"← Önsöz", navBack:"Arka Kapak →",
    forewordTitle:"Önsöz",
    forewordParagraphs:[
      "Kur'an; kalp için vahiy, rehberlik ve hatırlatmadır.",
      "Arapça ayetler kaynaktır. Türkçe çeviri anlamayı kolaylaştırmak için bir araçtır, ikame değildir.",
      "Sakin, saygılı ve samimi bir kalple okuyun. Allah sizi açıklık, merhamet ve kararlılıkla yönlendirsin."
    ],
    bismi:"Rahman ve Rahim olan Allah'ın adıyla.",
    ctaText:"Oku",
    dictSubtitle:"SÖZLÜK · KUR'ANİ ARAPÇA",
    footnote:"Anlam çevirisi — Arapça orijinalin birebir çevirisi değildir.",
    introNavCover:"← Kapak", introNavBack:"Arka Kapak →"
  },
  Urdu: {
    lang:'ur', dir:'rtl', native:'اردو',
    navIntro:'← دیباچہ', navBack:'پچھلا سرورق →',
    forewordTitle:'دیباچہ',
    forewordParagraphs:[
      'قرآن دل کے لیے وحی، ہدایت اور یاددہانی ہے۔',
      'عربی آیات اصل ماخذ ہیں۔ اردو ترجمہ سمجھنے میں مدد کے لیے ہے، متبادل نہیں۔',
      'سکون، احترام اور سچے دل سے پڑھیں۔ اللہ آپ کو وضاحت، رحمت اور استقامت سے رہنمائی فرمائے۔'
    ],
    bismi:'اللہ کے نام سے جو رحمان و رحیم ہے۔',
    ctaText:'پڑھیں',
    dictSubtitle:'لغت · قرآنی عربی',
    footnote:'معنوی ترجمہ — عربی اصل کا لفظ بہ لفظ ترجمہ نہیں۔',
    introNavCover:'← سرورق', introNavBack:'پچھلا سرورق →'
  },
  Uygurisch: {
    lang:'ug', dir:'rtl', native:'ئۇيغۇرچە',
    navIntro:'← كىرىش سۆز', navBack:'ئارقا مۇقاۋا →',
    forewordTitle:'كىرىش سۆز',
    forewordParagraphs:[
      'قۇرئان قەلب ئۈچۈن ۋەھيى، يول كۆرسىتىش ۋە ئىلھام دەرۋازىسىدۇر.',
      'ئەرەبچە ئايەتلەر ئەسل مەنبەدۇر. ئۇيغۇرچە تەرجىمە چۈشىنىشكە يارداملىشىدۇ، ئورنى بولالمايدۇ.',
      'آرام، ھۆرمەت ۋە سادىق قەلب بىلەن ئوقۇڭ. ئاللاھ سىزنى روشەنلىك، مەرھەمەت ۋە چىڭلىق بىلەن يېتەكلىسۇن.'
    ],
    bismi:'رەھمان ۋە رەھىم بولغان ئاللاھنىڭ ئىسمى بىلەن.',
    ctaText:'ئوقۇش',
    dictSubtitle:'لۇغەت · قۇرئان ئەرەبچىسى',
    footnote:'مەنا تەرجىمىسى — ئەرەبچە ئەسلىنىڭ سۆزمۇسۆز تەرجىمىسى ئەمەس.',
    introNavCover:'← مۇقاۋا', introNavBack:'ئارقا مۇقاۋا →'
  }
};

// Bible languages to fix (non-German)
const BIBLE_LANGS = [
  'albanian','croatian','czech','dutch','french',
  'hungarian','italian','kjv','polish','portuguese',
  'romanian','russian','spanish','swedish','tagalog',
  'ukrainian','vulgate'
];

// ============================================================
// HELPERS
// ============================================================
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) {
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, c, 'utf8');
  console.log('  WROTE:', path.relative(BASE, p));
}

/** Extract surah rows from an existing Quran index.html */
function extractSurahRows(html) {
  // Try to grab the entire list-rows content
  const m = html.match(/<div[^>]*class="list-rows"[^>]*>([\s\S]*?)<\/div>\s*<\/main>/);
  if (m) return m[1].trim();
  // Fallback: grab all .row anchors
  const rows = [];
  const re = /<a[^>]+class="row"[^>]*>[\s\S]*?<\/a>/g;
  let match;
  while ((match = re.exec(html)) !== null) rows.push(match[0]);
  return rows.join('\n');
}

/** Extract the first <style>…</style> block from HTML */
function extractStyle(html) {
  const m = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  return m ? m[0] : '';
}

/** Replace every <style>…</style> block in <head> with replacementBlock */
function replaceHeadStyles(html, replacementBlock) {
  // Replace only the first style block (main CSS)
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/, replacementBlock);
}

// ============================================================
// DICT ICON BUTTON HTML (fixed, top-left)
// ============================================================
const DICT_ICON_BTN = `<a id="dict-icon-btn" href="woerterbuch.html" title="Dictionary" aria-label="Open Dictionary"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="12" y1="8" x2="16" y2="8"/><line x1="12" y1="12" x2="16" y2="12"/></svg></a>`;

// ============================================================
// STEP 1: Read German Quran templates
// ============================================================
console.log('\n=== Reading German Quran templates ===');
const deIndexPath = path.join(QBASE, 'Deutsch', 'index.html');
const deIntroPath = path.join(QBASE, 'Deutsch', 'intro.html');
const deWortPath  = path.join(QBASE, 'Deutsch', 'woerterbuch.html');
const deBibIndex  = path.join(BBASE, 'german', 'index.html');

const deIndexHtml = read(deIndexPath);
const deIntroHtml = read(deIntroPath);
const deWortHtml  = read(deWortPath);
const deBibHtml   = read(deBibIndex);

// Extract <head> sections (everything up to and including </head>)
function extractHead(html) {
  const i = html.indexOf('</head>');
  if (i < 0) return html.substring(0, html.indexOf('<body>'));
  return html.substring(0, i + '</head>'.length);
}

// Extract <footer> from German Quran index
function extractFooter(html) {
  const m = html.match(/<footer>[\s\S]*?<\/footer>/);
  return m ? m[0] : '<footer></footer>';
}

const deIndexHead   = extractHead(deIndexHtml);
const deIntroHead   = extractHead(deIntroHtml);
const deWortHead    = extractHead(deWortHtml);
const deIndexFooter = extractFooter(deIndexHtml);
const deIntroFooter = extractFooter(deIntroHtml);

// German Bible main style block (for non-German Bible replacement)
const deBibStyleBlock = extractStyle(deBibHtml);

console.log('  German Quran index head:', deIndexHead.length, 'chars');
console.log('  German Bible style block:', deBibStyleBlock.length, 'chars');

// ============================================================
// STEP 2: Rebuild non-German Quran index.html
// ============================================================
console.log('\n=== Rebuilding Quran index.html for 13 languages ===');
for (const [langFolder, data] of Object.entries(QURAN_LANGS)) {
  const existingPath = path.join(QBASE, langFolder, 'index.html');
  if (!fs.existsSync(existingPath)) {
    console.log('  SKIP (not found):', existingPath);
    continue;
  }
  const existingHtml = read(existingPath);
  const surahRows = extractSurahRows(existingHtml);
  if (!surahRows) {
    console.log('  WARN: no surah rows found in', langFolder);
    continue;
  }

  // Build head: take German head, update lang attribute
  let head = deIndexHead.replace(/lang="de"/, `lang="${data.lang}"`);

  const nav = `<nav>
  <span class="orn">۞</span>
  <a href="intro.html">${data.navIntro}</a>
  <span class="sp"></span>
  <a href="back-cover.html">${data.navBack}</a>
</nav>`;

  const footer = deIndexFooter;

  const newHtml = `${head}\n<body>\n${DICT_ICON_BTN}\n${nav}\n<main class="list"><div class="list-rows">\n${surahRows}\n</div></main>\n${footer}\n</body></html>`;
  write(existingPath, newHtml);
}

// ============================================================
// STEP 3: Rebuild non-German Quran intro.html
// ============================================================
console.log('\n=== Rebuilding Quran intro.html for 13 languages ===');
for (const [langFolder, data] of Object.entries(QURAN_LANGS)) {
  const introPath = path.join(QBASE, langFolder, 'intro.html');

  // Build head: take German intro head, update lang attribute
  let head = deIntroHead.replace(/lang="de"/, `lang="${data.lang}"`);

  const nav = `<nav>
  <span class="orn">۞</span>
  <a href="${'../../'}cover.html">${data.introNavCover}</a>
  <span class="sp"></span>
  <a href="back-cover.html">${data.introNavBack}</a>
</nav>`;

  const paragraphs = data.forewordParagraphs.map(p => `<p>${p}</p>`).join('\n  ');

  const main = `<main>
<div class="intro-c">
  <h2>${data.forewordTitle}</h2>
  ${paragraphs}
  <div class="bismi-box">
    <div class="bismi-in">
      <span class="bismi-txt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
      <span class="bismi-tr">${data.bismi}</span>
    </div>
  </div>
  <div class="cta">
    <a href="index.html">
      <span class="cta-orn">۞</span>${data.ctaText}<span class="cta-orn">۞</span>
    </a>
  </div>
</div>
</main>`;

  const footer = deIntroFooter;

  const newHtml = `${head}\n<body>\n${DICT_ICON_BTN}\n${nav}\n${main}\n${footer}\n</body></html>`;
  write(introPath, newHtml);
}

// ============================================================
// STEP 4: Fix non-German Quran woerterbuch.html (CSS + subtitle)
// ============================================================
console.log('\n=== Fixing Quran woerterbuch.html for 13 languages ===');
// Extract just the CSS content from German woerterbuch (the main style block)
const deWortStyleBlock = extractStyle(deWortHtml);

for (const [langFolder, data] of Object.entries(QURAN_LANGS)) {
  const wortPath = path.join(QBASE, langFolder, 'woerterbuch.html');
  if (!fs.existsSync(wortPath)) {
    console.log('  SKIP (not found):', langFolder, 'woerterbuch.html');
    continue;
  }
  let html = read(wortPath);

  // Replace main style block with German woerterbuch CSS
  html = replaceHeadStyles(html, deWortStyleBlock);

  // Fix html lang attribute
  html = html.replace(/(<html[^>]+lang=")[^"]*(")/,
    (m, a, b) => a + data.lang + b);

  // Fix .sh-native text (language name)
  html = html.replace(
    /(<span class="sh-native">)[^<]*(<\/span>)/,
    `$1${data.native}$2`
  );

  // Fix .sh-subtitle text
  html = html.replace(
    /(<span class="sh-subtitle">)[^<]*(<\/span>)/,
    `$1${data.dictSubtitle}$2`
  );

  // Fix search placeholder to match language
  html = html.replace(
    /placeholder="[^"]*"/,
    `placeholder="Arabic, transliteration or ${data.native} …"`
  );

  write(wortPath, html);
}

// ============================================================
// STEP 5: Fix non-German Bible index.html (CSS replacement)
// ============================================================
console.log('\n=== Fixing Bible index.html for non-German languages ===');
for (const lang of BIBLE_LANGS) {
  const indexPath = path.join(BBASE, lang, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('  SKIP (not found):', lang);
    continue;
  }
  let html = read(indexPath);

  // Replace main CSS style block with German Bible CSS
  const oldStyleMatch = html.match(/<style[^>]*>[\s\S]*?<\/style>/);
  if (oldStyleMatch) {
    html = html.replace(oldStyleMatch[0], deBibStyleBlock);
  }

  write(indexPath, html);
}

// ============================================================
// STEP 6: Fix cover pages
// ============================================================
console.log('\n=== Fixing cover pages ===');

// ----- dist-alquran/cover.html -----
const qCoverPath = path.join(BASE, 'dist-alquran', 'cover.html');
if (fs.existsSync(qCoverPath)) {
  let html = read(qCoverPath);

  // Fix title to English
  html = html.replace(/<title>[^<]*<\/title>/, '<title>AL-QURAN · All Languages</title>');

  // Fix .ttl-de text
  html = html.replace(
    /(<span class="ttl-de">)[^<]*(<\/span>)/,
    '$1AL-QURAN · All Languages$2'
  );

  // Fix "Spenden" → "Donate" everywhere
  html = html.replace(/Spenden/g, 'Donate');
  html = html.replace(/spenden/g, 'donate');

  // Fix German "Alle Sprachen" → "All Languages"
  html = html.replace(/Alle Sprachen/g, 'All Languages');

  // Fix PayPal button text (in case it has German label)
  html = html.replace(/value="Spende leisten"/g, 'value="Donate"');
  html = html.replace(/>Spende leisten</g, '>Donate<');
  html = html.replace(/title="Spenden"/g, 'title="Donate"');

  // Remove .tile-dict from cover tiles (dict icon should only be on index/intro pages)
  // The tile-dict div wraps a dict link icon on the tile — remove it
  html = html.replace(/<div class="tile-dict">[\s\S]*?<\/div>\s*/g, '');

  // Fix "Später verfügbar" → "Coming soon"
  html = html.replace(/Später verfügbar/g, 'Coming soon');

  write(qCoverPath, html);
}

// ----- dist-diebibel/cover.html -----
const bCoverPath = path.join(BASE, 'dist-diebibel', 'cover.html');
if (fs.existsSync(bCoverPath)) {
  let html = read(bCoverPath);

  // Fix title to English
  html = html.replace(/<title>[^<]*<\/title>/, '<title>The Holy Bible · All Languages</title>');

  // Fix headline text
  html = html.replace(/Alle Sprachen/g, 'All Languages');
  html = html.replace(/Die Heilige Bibel · Alle Sprachen/g, 'The Holy Bible · All Languages');
  html = html.replace(/THE HOLY BIBLE · ALLE SPRACHEN/g, 'THE HOLY BIBLE · ALL LANGUAGES');

  // Fix "Spenden" → "Donate"
  html = html.replace(/Spenden/g, 'Donate');
  html = html.replace(/spenden/g, 'donate');
  html = html.replace(/value="Spende leisten"/g, 'value="Donate"');
  html = html.replace(/>Spende leisten</g, '>Donate<');
  html = html.replace(/title="Spenden"/g, 'title="Donate"');

  // Fix "Später verfügbar" → "Coming soon"
  html = html.replace(/Später verfügbar/g, 'Coming soon');

  write(bCoverPath, html);
}

// Also fix dist-alquran/index.html if it exists (the top-level index)
const qMainIndex = path.join(BASE, 'dist-alquran', 'index.html');
if (fs.existsSync(qMainIndex)) {
  let html = read(qMainIndex);
  html = html.replace(/Spenden/g, 'Donate');
  html = html.replace(/Alle Sprachen/g, 'All Languages');
  write(qMainIndex, html);
}

console.log('\n✓ All done. Review the output above for any SKIPs or WARNings.');
console.log('\nNext steps:');
console.log('  cd "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX"');
console.log('  git add -A');
console.log('  git commit -m "Rebuild all non-German Quran/Bible pages with correct design; English cover text"');
console.log('  git push origin main');
