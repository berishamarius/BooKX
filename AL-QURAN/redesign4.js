'use strict';
/**
 * AL-QURAN · Redesign v4.0
 *
 *  - Islamisches Ornamentdesign: Shamsa-Medaillon, Eck-Ornamente, geometrische Bänder
 *  - Amiri Quran Font → keine Fragezeichen mehr im arabischen Text
 *  - Großer, prominenter Öffnen-Button unten auf dem Cover
 *  - Vorwort erklärt die Designentscheidung (arabischer Text im Vordergrund)
 *  - Manuskript-Rahmen auf den Leseseiten
 *
 * node redesign4.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const BASE_DIR = __dirname;
const OUT_DIR  = path.join(BASE_DIR, 'Übersetzungen');

const TRANSLATIONS = [
  { name:'Deutsch',     lang:'de', dir:'ltr', flag:'🇩🇪', transId:27,  titleNative:'Deutsch',         readBtn:'Lesen',              introTitle:'Vorwort',     indexTitle:'Inhaltsverzeichnis' },
  { name:'Englisch',    lang:'en', dir:'ltr', flag:'🇬🇧', transId:20,  titleNative:'English',          readBtn:'Read',               introTitle:'Foreword',    indexTitle:'Table of Contents'  },
  { name:'Türkisch',    lang:'tr', dir:'ltr', flag:'🇹🇷', transId:77,  titleNative:'Türkçe',           readBtn:'Okumaya Başla',      introTitle:'Önsöz',       indexTitle:'İçindekiler'        },
  { name:'Indonesisch', lang:'id', dir:'ltr', flag:'🇮🇩', transId:33,  titleNative:'Bahasa Indonesia', readBtn:'Mulai Membaca',      introTitle:'Pendahuluan', indexTitle:'Daftar Isi'         },
  { name:'Urdu',        lang:'ur', dir:'rtl', flag:'🇵🇰', transId:97,  titleNative:'اردو',             readBtn:'پڑھنا شروع کریں',   introTitle:'دیباچہ',      indexTitle:'فہرست'              },
  { name:'Persisch',    lang:'fa', dir:'rtl', flag:'🇮🇷', transId:135, titleNative:'فارسی',            readBtn:'شروع به خواندن',    introTitle:'مقدمه',       indexTitle:'فهرست مطالب'        },
  { name:'Russisch',    lang:'ru', dir:'ltr', flag:'🇷🇺', transId:45,  titleNative:'Русский',          readBtn:'Начать чтение',      introTitle:'Предисловие', indexTitle:'Оглавление'         },
  { name:'Bengalisch',  lang:'bn', dir:'ltr', flag:'🇧🇩', transId:161, titleNative:'বাংলা',            readBtn:'পড়া শুরু করুন',     introTitle:'ভূমিকা',      indexTitle:'বিষয়সূচি'           },
  { name:'Hindi',       lang:'hi', dir:'ltr', flag:'🇮🇳', transId:122, titleNative:'हिन्दी',           readBtn:'पढ़ना शुरू करें',   introTitle:'प्रस्तावना', indexTitle:'विषय-सूची'          },
  { name:'Hausa',       lang:'ha', dir:'ltr', flag:'🇳🇬', transId:32,  titleNative:'Hausa',            readBtn:'Fara Karanta',       introTitle:'Gabatarwa',   indexTitle:'Jerin Abubuwa'      },
  { name:'Bosnisch',    lang:'bs', dir:'ltr', flag:'🇧🇦', transId:126, titleNative:'Bosanski',         readBtn:'Počni Čitati',       introTitle:'Predgovor',   indexTitle:'Sadržaj'            },
  { name:'Albanisch',   lang:'sq', dir:'ltr', flag:'🇦🇱', transId:88,  titleNative:'Shqip',            readBtn:'Fillo Leximin',      introTitle:'Parathënie',  indexTitle:'Tabela e Permbajtjes'},
  { name:'Chinesisch',  lang:'zh', dir:'ltr', flag:'🇨🇳', transId:56,  titleNative:'中文',              readBtn:'开始阅读',            introTitle:'序言',        indexTitle:'目录'                },
  { name:'Uygurisch',   lang:'ug', dir:'rtl', flag:'☪',  transId:76,  titleNative:'ئۇيغۇرچە',        readBtn:'ئوقۇشنى باشلاش',   introTitle:'مۇقەددىمە',  indexTitle:'مۇندەرىجە'          },
];

const DISC = {
  de: 'Sinngemäße Übersetzung — kein wörtliches Abbild des arabischen Originals.',
  en: 'Translation of meanings — not a word-for-word rendering of the original.',
  tr: 'Anlamsal çeviri — kelimenin tam karşılığı değil.',
  id: 'Terjemahan makna — bukan kata per kata dari teks aslinya.',
  ur: 'معنوی ترجمہ — اصل کا لفظ بہ لفظ ترجمہ نہیں۔',
  fa: 'ترجمه معنایی — نه کلمه‌به‌کلمه از متن اصلی.',
  ru: 'Смысловой перевод — не дословный перевод оригинала.',
  bn: 'অর্থগত অনুবাদ — মূল পাঠের শাব্দিক অনুবাদ নয়।',
  hi: 'अर्थ का अनुवाद — मूल पाठ का शब्द-दर-शब्द नहीं।',
  ha: "Fassarar ma'ana — ba kalma-da-kalma ba.",
  bs: 'Prijevod značenja — nije doslovan prijevod originala.',
  sq: 'Përkthim kuptimor — jo fjalë për fjalë i origjinalit.',
  zh: '含义翻译——并非原文的逐字翻译。',
  ug: 'مەنا تەرجىمەسى — ئەسلى مەتننىڭ سۆزمۇ-سۆز تەرجىمەسى ئەمەس.',
};

const DISC_LONG = {
  de: 'Dies ist eine <strong>sinngemäße Übersetzung</strong> des Heiligen Qurans. Eine Übersetzung ist kein Quran — der einzig authentische Quran ist der arabische Urtext, der seit über 1.400 Jahren unverändert überliefert wird.',
  en: 'This is a <strong>translation of meanings</strong> of the Holy Quran. A translation is not the Quran — the only authentic Quran is the original Arabic text, preserved unchanged for over 1,400 years.',
  tr: 'Bu, Kutsal Kur\'an\'ın <strong>anlamsal çevirisidir</strong>. Bir çeviri Kur\'an değildir — tek gerçek Kur\'an, 1.400 yılı aşkın süredir değişmeden korunan Arapça orijinal metindir.',
  id: 'Ini adalah <strong>terjemahan makna</strong> Al-Qur\'an yang Suci. Terjemahan bukan Al-Qur\'an — Al-Qur\'an yang autentik hanyalah teks Arab asli yang telah dipelihara tidak berubah selama lebih dari 1.400 tahun.',
  ur: 'یہ قرآن کریم کا <strong>معنوی ترجمہ</strong> ہے۔ ترجمہ قرآن نہیں — واحد مستند قرآن عربی اصل متن ہے جو 1400 سال سے زیادہ عرصے سے غیر تبدیل شدہ محفوظ ہے۔',
  fa: 'این <strong>ترجمه معنایی</strong> قرآن کریم است. ترجمه قرآن نیست — قرآن اصیل تنها متن عربی اصلی است که بیش از ۱۴۰۰ سال بدون تغییر حفظ شده است.',
  ru: 'Это <strong>смысловой перевод</strong> Священного Корана. Перевод — не Коран: единственный подлинный Коран — арабский оригинальный текст, сохранённый неизменным более 1.400 лет.',
  bn: 'এটি পবিত্র কুরআনের <strong>অর্থগত অনুবাদ</strong>। অনুবাদ কুরআন নয় — একমাত্র খাঁটি কুরআন হল আরবি মূল পাঠ, যা ১৪০০ বছরেরও বেশি সময় ধরে অপরিবর্তিত সংরক্ষিত।',
  hi: 'यह पवित्र क़ुरआन का <strong>अर्थ का अनुवाद</strong> है। अनुवाद क़ुरआन नहीं है — एकमात्र प्रामाणिक क़ुरआन अरबी मूल पाठ है जो 1,400 वर्षों से अपरिवर्तित सुरक्षित है।',
  ha: "Wannan <strong>fassarar ma'ana</strong> ce ta Alƙur'ani Mai Tsarki. Fassara ba Alƙur'ani ba ce — Alƙur'anin ainihi shi ne rubutun Larabci na asali wanda aka adana ba tare da canzawa ba tsawon shekaru 1.400.",
  bs: 'Ovo je <strong>prijevod značenja</strong> Časnog Kur\'ana. Prijevod nije Kur\'an — jedini autentični Kur\'an je originalni arapski tekst, sačuvan nepromijenjen više od 1.400 godina.',
  sq: 'Ky është <strong>përkthim i kuptimeve</strong> të Kuranit të Shenjtë. Përkthimi nuk është Kurani — i vetmi Kuran autentik është teksti origjinal arabisht, i ruajtur i pandryshuar për mbi 1.400 vjet.',
  zh: '这是《古兰经》含义的<strong>翻译</strong>。翻译不是古兰经——唯一真实的古兰经是已保存超过1400年未曾改变的阿拉伯文原典。',
  ug: 'بۇ مۇقەددەس قۇرئاننىڭ <strong>مەنا تەرجىمەسى</strong>. تەرجىمە قۇرئان ئەمەس — بىردىنبىر ھەقىقىي قۇرئان 1400 يىلدىن ئارتۇق ئۆزگەرمەي ساقلىنىپ كەلگەن ئەرەبچە ئەسلى مەتن.',
};

// Vorwort — ruhig, sachlich + Designhinweis am Ende
const INTRO_BODY = {
  de: [
    'Der Quran wurde dem Propheten Muhammad ﷺ über dreiundzwanzig Jahre herabgesandt. Er ist die Grundlage des islamischen Glaubens und des muslimischen Lebens.',
    'Was hier vorliegt, ist eine sinngemäße Übersetzung ins Deutsche — kein Ersatz für das arabische Original. Jede Übersetzung nähert sich dem Sinn, ohne ihn vollständig zu fassen. Das Arabische ist der Quran; alles andere ist Annäherung.',
    'Lies, was hier steht, als einen Hinweis. Wer den arabischen Urtext hören und lesen kann, geht den unmittelbaren Weg.',
    'Das Design dieser Ausgabe ist eine bewusste Entscheidung: arabischer Text groß und im Vordergrund, die Übersetzung klein und zurückhaltend. So nah wie möglich am Original — in Wort und Geist.',
  ],
  en: [
    'The Quran was revealed to the Prophet Muhammad ﷺ over twenty-three years. It is the foundation of Islamic belief and Muslim life.',
    'What follows is a translation of its meanings into English — not a substitute for the Arabic original. Every translation approximates the sense without fully capturing it. The Arabic is the Quran; everything else is approximation.',
    'Read what is here as a signpost. Those who can hear and read the Arabic original walk the direct path.',
    'The design of this edition is a deliberate choice: Arabic text large and foremost, translation small and receding. As close as possible to the original — in word and spirit.',
  ],
  tr: [
    'Kur\'an, Peygamber Muhammed ﷺ\'e yirmi üç yıl boyunca vahyedildi. İslam inancının ve Müslüman hayatının temelidir.',
    'Buradakiler, Kur\'an\'ın Türkçe anlamsal bir çevirisidir — Arapça orijinalin yerini tutmaz. Her çeviri, anlama yaklaşır; onu tam olarak aktaramaz. Kur\'an Arapçadır; geri kalan her şey bir yaklaşımdır.',
    'Burada okuduklarını bir işaret olarak gör. Arapça orijinali duyup okuyabilen, doğrudan yolda yürür.',
    'Bu baskının tasarımı bilinçli bir karardır: Arapça metin büyük ve ön planda, çeviri küçük ve geri planda. Mümkün olduğunca özgüne yakın — söz ve ruhta.',
  ],
  id: [
    'Al-Qur\'an diturunkan kepada Nabi Muhammad ﷺ selama dua puluh tiga tahun. Ia adalah landasan keyakinan Islam dan kehidupan Muslim.',
    'Yang disajikan di sini adalah terjemahan makna dalam Bahasa Indonesia — bukan pengganti teks Arab aslinya. Setiap terjemahan mendekati maknanya tanpa bisa sepenuhnya menangkapnya. Al-Qur\'an adalah bahasa Arabnya; yang lain hanyalah pendekatan.',
    'Bacalah ini sebagai petunjuk arah. Mereka yang dapat mendengar dan membaca teks Arab asli berjalan di jalan yang langsung.',
    'Desain edisi ini adalah pilihan yang disengaja: teks Arab besar dan di depan, terjemahan kecil dan memudar. Sedekat mungkin dengan aslinya — dalam kata dan jiwa.',
  ],
  ur: [
    'قرآن نبی محمد ﷺ پر تئیس سال کے دوران نازل کیا گیا۔ یہ اسلامی ایمان اور مسلمانوں کی زندگی کی بنیاد ہے۔',
    'یہاں جو ہے وہ اردو میں قرآن کے مفہوم کا ترجمہ ہے — عربی اصل کا متبادل نہیں۔ ہر ترجمہ مطلب کے قریب جاتا ہے، مگر پوری طرح پکڑ نہیں پاتا۔ قرآن عربی ہے؛ باقی سب قریبی کوشش ہے۔',
    'یہاں جو پڑھو اسے ایک اشارہ سمجھو۔ جو عربی اصل سن اور پڑھ سکتا ہے، وہ سیدھے راستے پر ہے۔',
    'اس ایڈیشن کا ڈیزائن ایک شعوری انتخاب ہے: عربی متن بڑا اور آگے، ترجمہ چھوٹا اور پیچھے۔ اصل سے زیادہ سے زیادہ قریب — لفظ اور روح میں۔',
  ],
  fa: [
    'قرآن در طول بیست و سه سال بر پیامبر محمد ﷺ نازل شد. پایه‌ی ایمان اسلامی و زندگی مسلمانان است.',
    'آنچه اینجا آمده ترجمه‌ی معنایی به فارسی است — جایگزین متن عربی اصلی نمی‌شود. هر ترجمه‌ای به معنا نزدیک می‌شود، بی‌آنکه آن را به‌تمامی دربربگیرد. قرآن همان عربی است؛ بقیه تقریب است.',
    'آنچه می‌خوانید را نشانه‌ای بدانید. کسی که متن عربی را بشنود و بخواند، راه مستقیم را رفته است.',
    'طراحی این نسخه انتخابی آگاهانه است: متن عربی بزرگ و در پیش‌زمینه، ترجمه کوچک و کم‌رنگ. هرچه نزدیک‌تر به اصل — در کلام و روح.',
  ],
  ru: [
    'Коран был ниспослан Пророку Мухаммаду ﷺ на протяжении двадцати трёх лет. Он является основой исламской веры и жизни мусульман.',
    'Перед вами смысловой перевод на русский язык — не замена арабскому оригиналу. Любой перевод приближается к смыслу, не охватывая его целиком. Коран — это арабский текст; всё остальное — лишь приближение.',
    'Читайте это как указатель. Тот, кто может слышать и читать арабский оригинал, идёт прямым путём.',
    'Дизайн этого издания — осознанный выбор: арабский текст крупно и на первом плане, перевод мелко и в тени. Как можно ближе к оригиналу — в слове и духе.',
  ],
  bn: [
    'কুরআন নবী মুহাম্মদ ﷺ-এর উপর তেইশ বছর ধরে নাযিল হয়েছে। এটি ইসলামী বিশ্বাস ও মুসলিম জীবনের ভিত্তি।',
    'এখানে যা উপস্থাপিত হয়েছে তা বাংলায় অর্থগত অনুবাদ — আরবি মূলের বিকল্প নয়। প্রতিটি অনুবাদ অর্থের কাছে যায়, কিন্তু তা পুরোপুরি ধারণ করতে পারে না। কুরআন হলো আরবি; বাকি সব আসন্নবর্তীতা।',
    'এখানে যা পড়ছেন তাকে একটি পথনির্দেশ হিসেবে দেখুন। যারা আরবি মূল শুনতে ও পড়তে পারেন তারা সরাসরি পথে চলেন।',
    'এই সংস্করণের ডিজাইন একটি সচেতন পছন্দ: আরবি পাঠ বড় এবং সামনে, অনুবাদ ছোট ও পেছনে। মূলের যতটা সম্ভব কাছে — শব্দে ও আত্মায়।',
  ],
  hi: [
    'क़ुरआन नबी मुहम्मद ﷺ पर तेईस वर्षों में अवतरित हुआ। यह इस्लामी विश्वास और मुस्लिम जीवन की नींव है।',
    'यहाँ जो प्रस्तुत है वह हिंदी में अर्थ का अनुवाद है — अरबी मूल का विकल्प नहीं। हर अनुवाद अर्थ के निकट जाता है, किंतु उसे पूरी तरह नहीं पकड़ पाता। क़ुरआन अरबी है; बाकी सब निकटता मात्र है।',
    'यहाँ जो पढ़ें उसे एक संकेत के रूप में समझें। जो अरबी मूल सुन और पढ़ सकते हैं वे सीधे मार्ग पर हैं।',
    'इस संस्करण का डिज़ाइन एक सोची-समझी चुनाव है: अरबी पाठ बड़ा और आगे, अनुवाद छोटा और पीछे। मूल के जितना संभव हो उतना निकट — शब्द और आत्मा में।',
  ],
  ha: [
    "An saukar da Alƙur'ani zuwa ga Annabi Muhammad ﷺ a tsawon shekaru ashirin da uku. Shi ne ginshiƙin imani na Musulunci da rayuwar Musulmi.",
    "Abin da ke nan fassara ce ta ma'ana zuwa Hausa — ba za ta maye gurbin rubutun Larabci na asali ba. Kowane fassara yana kusantar ma'ana ba tare da cika kaiwa ba. Alƙur'ani shi ne Larabci; sauran duka kusanci ne kawai.",
    "Ka karanta abin da ke nan a matsayin alama. Wanda zai iya jin da karanta Larabci na asali ya bi tafarkin kai tsaye.",
    "Tsarin wannan bugu zaɓi ne da gangan: Rubutun Larabci babba kuma a gaba, fassara ƙarama kuma a baya. Kusa da asali gwargwado — a kalma da ruhи.",
  ],
  bs: [
    "Kur'an je objavljen Poslaniku Muhamedu ﷺ tokom dvadeset i tri godine. On je temelj islamskog vjerovanja i muslimanskog života.",
    "Ono što slijedi je prijevod značenja na bosanski jezik — nije zamjena za arapski original. Svaki prijevod se približava smislu ne obuhvatajući ga potpuno. Kur'an je arapski; sve ostalo je samo pristup.",
    "Čitajte ovo kao putokaz. Ko može čuti i čitati arapski original, taj je na direktnom putu.",
    "Dizajn ovog izdanja je svjestan izbor: arapski tekst velik i naprijed, prijevod mali i u pozadini. Što bliže originalu — u riječi i duhu.",
  ],
  sq: [
    "Kurani iu shpall Profetit Muhamed ﷺ gjatë njëzet e tre vjetëve. Ai është themeli i besimit islam dhe i jetës së muslimanëve.",
    "Ajo që vijon është një përkthim kuptimor në gjuhën shqipe — jo zëvendësim për origjinalin arabisht. Çdo përkthim i afrohet kuptimit pa e kapur plotësisht. Kurani është arabishtja; gjithçka tjetër është vetëm afrueshmëri.",
    "Lexojeni këtë si një udhëtregues. Ai që mund të dëgjojë dhe lexojë arabishten origjinale ecën rrugës direkte.",
    "Dizajni i kësaj botimi është një zgjedhje e qëllimshme: teksti arabisht i madh dhe në plan të parë, përkthimi i vogël dhe në sfond. Sa më afër origjinalit — në fjalë dhe shpirt.",
  ],
  zh: [
    '古兰经在二十三年间逐渐降示给先知穆罕默德ﷺ。它是伊斯兰信仰与穆斯林生活的基础。',
    '此处呈现的是古兰经含义的中文翻译——并非阿拉伯文原典的替代。每一种翻译都趋近于其含义，却无法完全承载。古兰经是阿拉伯文；其余一切皆为近似。',
    '请将您在此读到的视为一个路标。能够聆听和阅读阿拉伯文原典的人，走的是直接之路。',
    '这一版的设计是一个有意为之的选择：阿拉伯文大而居前，译文小而退后。尽可能贴近原典——在文字与精神上。',
  ],
  ug: [
    'قۇرئان يىگىرمە ئۈچ يىل ئىچىدە پەيغەمبەر مۇھەممەد ﷺ غا نازىل قىلىنغان. ئۇ ئىسلام دىنىنىڭ ۋە مۇسۇلمانلار تۇرمۇشىنىڭ ئاساسى.',
    'بۇيەردە كۆرسىتىلگەن ئۇيغۇرچىگە قىلىنغان مەنا تەرجىمەسى — ئەرەبچە ئەسلى مەتننىڭ ئورنىنى باسالمايدۇ. ھەر بىر تەرجىمە مەنىگە يېقىنلىشىدۇ، بىراق ئۇنى تولۇق ئۆز ئىچىگە ئالالمايدۇ. قۇرئان ئەرەبچە؛ قالغانلىرى ھەممىسى پەقەت يېقىنلىشىش.',
    'بۇيەردىكىلەرنى بىر يۇلنامە دەپ قارىڭ. ئەرەبچە ئەسلىنى ئاڭلىيالايدىغان ۋە ئوقۇيالايدىغانلار راست يولدا يۈرىدۇ.',
    'بۇ نەشىرنىڭ دىزايىنى ئاتايىلاپ ئوڭشالغان: ئەرەبچە مەتن چوڭ ۋە ئالدىدا، تەرجىمە كىچىك ۋە ئارقىدا. ئەسلىگە ئىمكانقەدەر يېقىن — سۆز ۋە رۇھتا.',
  ],
};

// ── Hilfsfunktionen ──────────────────────────────────────────────────────────
function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Accept:'application/json', 'User-Agent':'AL-QURAN/4.0' } }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}
async function fetchRetry(url, n = 4) {
  for (let i = 0; i < n; i++) {
    try { return await apiGet(url); } catch(e) { if (i === n-1) throw e; await new Promise(r => setTimeout(r, 1200)); }
  }
}
function toArabicNum(n) { return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); }
function surahFile(c)   { return `${String(c.id).padStart(3,'0')}-${c.name_simple.replace(/[^a-zA-Z0-9]/g,'-')}.html`; }

// ── Shamsa-Medaillon (islamisches 8-Stern-SVG) ────────────────────────────────
function shamsaSVG(alpha = 0.07) {
  const s = `rgba(192,155,60,${alpha})`;
  const sl = `rgba(192,155,60,${(alpha*0.5).toFixed(2)})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="shamsa" aria-hidden="true">
<g transform="translate(200,200)" fill="none" stroke="${s}" stroke-width="0.8">
  <circle r="192"/><circle r="155"/><circle r="115"/><circle r="75"/><circle r="38"/>
  <path d="M0,-192 L46,-46 L192,0 L46,46 L0,192 L-46,46 L-192,0 L-46,-46Z"/>
  <path d="M0,-192 L46,-46 L192,0 L46,46 L0,192 L-46,46 L-192,0 L-46,-46Z" transform="rotate(22.5)"/>
  <g stroke="${sl}">
    <line x1="0" y1="-192" x2="0" y2="192"/>
    <line x1="-192" y1="0" x2="192" y2="0"/>
    <line x1="-136" y1="-136" x2="136" y2="136"/>
    <line x1="136" y1="-136" x2="-136" y2="136"/>
    <line x1="-72" y1="-186" x2="72" y2="186"/>
    <line x1="72" y1="-186" x2="-72" y2="186"/>
    <line x1="-186" y1="-72" x2="186" y2="72"/>
    <line x1="-186" y1="72" x2="186" y2="-72"/>
  </g>
  <circle r="192" stroke-dasharray="2,10" stroke="${sl}"/>
  <circle r="38" stroke-width="1.5"/>
</g></svg>`;
}

// ── Geometrisches Band (islamisches Rautenmuster) ─────────────────────────────
const GEO_CSS = `
.geo-band{
  height:16px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(192,155,60,.07) 3px,rgba(192,155,60,.07) 4px),
    repeating-linear-gradient( 45deg,transparent,transparent 3px,rgba(192,155,60,.07) 3px,rgba(192,155,60,.07) 4px);
  background-size:8px 8px;
  border-top:1px solid rgba(192,155,60,.28);
  border-bottom:1px solid rgba(192,155,60,.22);
}`;

// ══════════════════════════════════════════════════════
//  HAUPT-COVER  (Portal)
// ══════════════════════════════════════════════════════
function mainCoverHTML() {
  const langItems = TRANSLATIONS.map(t =>
    `<a href="Übersetzungen/${t.name}/cover.html" class="li">${t.flag} <span>${t.titleNative}</span></a>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="ar"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم</title>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#05090a;display:flex;align-items:center;justify-content:center;min-height:100vh}
.book{
  width:min(480px,88vw);aspect-ratio:2/3;
  background:radial-gradient(ellipse at 50% 35%,#15301a 0%,#0a1d0e 55%,#060c07 100%);
  position:relative;overflow:hidden;
  border:2px solid rgba(192,155,60,.72);
  box-shadow:0 0 0 7px #05090a,0 0 0 8px rgba(160,122,34,.18),0 0 0 13px #05090a,0 0 0 14px rgba(160,122,34,.07),0 50px 130px rgba(0,0,0,.98);
}
.book::before{content:'';position:absolute;inset:11px;border:1px solid rgba(192,155,60,.2);pointer-events:none;z-index:2}
.book::after{content:'';position:absolute;inset:16px;border:1px solid rgba(192,155,60,.08);pointer-events:none;z-index:2}
.shamsa{position:absolute;width:75%;height:75%;left:50%;top:48%;transform:translate(-50%,-50%);pointer-events:none}
.c{position:absolute;font-size:1.15rem;color:rgba(192,155,60,.42);z-index:3;line-height:1;user-select:none}
.c-tl{top:19px;left:19px}.c-tr{top:19px;right:19px}.c-bl{bottom:19px;left:19px}.c-br{bottom:19px;right:19px}
${GEO_CSS}
.geo-band{position:absolute;left:20px;right:20px;z-index:3}
.geo-t{top:30px}.geo-b{bottom:30px}
.content{position:absolute;inset:54px 18px 90px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:4;text-align:center}
.bsm{font-family:'Scheherazade New',serif;font-size:.9rem;color:rgba(192,155,60,.28);direction:rtl;display:block;margin-bottom:10px}
.div{color:rgba(192,155,60,.22);font-size:.55rem;letter-spacing:5px;display:block;margin:5px 0}
.title{font-family:'Scheherazade New',serif;font-size:clamp(2.8rem,13vw,5.2rem);color:#c9a84c;direction:rtl;line-height:1.22;text-shadow:0 0 80px rgba(201,168,76,.07);display:block;margin:4px 0}
.chooselabel{font:.52rem/1 sans-serif;color:rgba(192,155,60,.25);letter-spacing:.28em;text-transform:uppercase;display:block;margin:14px 0 10px}
.langs{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 12px;max-width:85%}
.li{color:rgba(192,155,60,.3);text-decoration:none;font:.54rem sans-serif;display:flex;align-items:center;gap:3px;padding:2px 4px;transition:color .2s;letter-spacing:.02em}
.li:hover{color:rgba(192,155,60,.8)}
.li span{font-size:.5rem}
</style></head><body>
<div class="book">
  ${shamsaSVG(0.065)}
  <span class="c c-tl">✸</span><span class="c c-tr">✸</span>
  <span class="c c-bl">✸</span><span class="c c-br">✸</span>
  <div class="geo-band geo-t"></div>
  <div class="geo-band geo-b"></div>
  <div class="content">
    <span class="bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
    <span class="div">─ ─ ✦ ─ ─</span>
    <span class="title">القرآن<br>الكريم</span>
    <span class="div">─ ─ ✦ ─ ─</span>
    <span class="chooselabel">Sprache wählen</span>
    <div class="langs">${langItems}</div>
  </div>
</div>
</body></html>`;
}

// ══════════════════════════════════════════════════════
//  SPRACH-COVER  (pro Sprache — Bucheinband)
// ══════════════════════════════════════════════════════
function langCoverHTML(t) {
  const disc = DISC[t.lang] || DISC.de;
  return `<!DOCTYPE html>
<html lang="${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · ${t.titleNative}</title>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#05090a;display:flex;align-items:center;justify-content:center;min-height:100vh}
.book{
  width:min(480px,88vw);aspect-ratio:2/3;
  background:radial-gradient(ellipse at 50% 32%,#16321c 0%,#0c1f10 55%,#07100a 100%);
  position:relative;overflow:hidden;
  border:2px solid rgba(192,155,60,.75);
  box-shadow:0 0 0 7px #05090a,0 0 0 8px rgba(160,122,34,.2),0 0 0 14px #05090a,0 0 0 15px rgba(160,122,34,.08),0 50px 140px rgba(0,0,0,.98);
}
/* Drei konzentrische Rahmenlinien */
.book::before{content:'';position:absolute;inset:11px;border:1px solid rgba(192,155,60,.25);pointer-events:none;z-index:2}
.book::after{content:'';position:absolute;inset:16px;border:1px solid rgba(192,155,60,.1);pointer-events:none;z-index:2}
.shamsa{position:absolute;width:78%;height:78%;left:50%;top:46%;transform:translate(-50%,-50%);pointer-events:none}
.c{position:absolute;font-size:1.2rem;color:rgba(192,155,60,.45);z-index:5;line-height:1;user-select:none}
.c-tl{top:19px;left:19px}.c-tr{top:19px;right:19px}.c-bl{bottom:19px;left:19px}.c-br{bottom:19px;right:19px}
${GEO_CSS}
.geo-band{position:absolute;left:20px;right:20px;z-index:3}
.geo-t{top:30px}.geo-b{bottom:76px}
/* Hauptinhalt (obere 4/5 des Covers) */
.content{
  position:absolute;top:50px;left:18px;right:18px;bottom:90px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  z-index:4;text-align:center;
}
.bsm{font-family:'Scheherazade New',serif;font-size:.95rem;color:rgba(192,155,60,.3);direction:rtl;display:block;margin-bottom:12px}
.div{color:rgba(192,155,60,.25);font-size:.58rem;letter-spacing:6px;display:block;margin:7px 0}
.title{
  font-family:'Scheherazade New',serif;
  font-size:clamp(3rem,14vw,5.4rem);
  color:#c9a84c;direction:rtl;line-height:1.22;
  text-shadow:0 0 80px rgba(201,168,76,.06);
  display:block;margin:4px 0;
}
.lang-row{display:flex;align-items:center;gap:8px;margin:12px 0 6px}
.flag{font-size:1.3rem;opacity:.7}
.lang-label{font:.65rem/1 sans-serif;color:rgba(192,155,60,.4);letter-spacing:.24em;text-transform:uppercase}
.disc-line{font:.48rem/1.7 sans-serif;color:rgba(192,155,60,.2);font-style:italic;max-width:73%;margin:4px auto 0}
/* PROMINENTER ÖFFNEN-BUTTON */
.btn-wrap{position:absolute;bottom:24px;left:22px;right:22px;z-index:6;text-align:center}
.open-btn{
  display:block;width:100%;padding:14px 0;
  border:1px solid rgba(192,155,60,.55);
  background:rgba(10,26,13,.7);
  color:#c9a84c;
  font:.72rem sans-serif;letter-spacing:.32em;text-transform:uppercase;
  text-decoration:none;transition:all .3s;position:relative;
}
.open-btn::before,.open-btn::after{content:'✸';position:absolute;top:50%;transform:translateY(-50%);font-size:.55rem;color:rgba(192,155,60,.4)}
.open-btn::before{left:14px}.open-btn::after{right:14px}
.open-btn:hover{background:rgba(18,42,22,.95);border-color:rgba(192,155,60,.9);color:#e8d070;letter-spacing:.38em}
/* Zurück-Link oben */
.back{position:absolute;top:6px;left:50%;transform:translateX(-50%);font:.4rem sans-serif;color:rgba(192,155,60,.1);text-decoration:none;z-index:7;letter-spacing:.1em;white-space:nowrap;transition:color .2s}
.back:hover{color:rgba(192,155,60,.35)}
</style></head><body>
<div class="book">
  ${shamsaSVG(0.07)}
  <span class="c c-tl">✸</span><span class="c c-tr">✸</span>
  <span class="c c-bl">✸</span><span class="c c-br">✸</span>
  <div class="geo-band geo-t"></div>
  <div class="geo-band geo-b"></div>
  <div class="content">
    <span class="bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
    <span class="div">─ ─ ✦ ─ ─</span>
    <span class="title">القرآن<br>الكريم</span>
    <span class="div">─ ─ ✦ ─ ─</span>
    <div class="lang-row">
      <span class="flag">${t.flag}</span>
      <span class="lang-label">${t.titleNative}</span>
    </div>
    <p class="disc-line">${disc}</p>
  </div>
  <div class="btn-wrap">
    <a href="intro.html" class="open-btn">${t.introTitle} &rarr;</a>
  </div>
  <a href="../../cover.html" class="back">← القرآن الكريم</a>
</div>
</body></html>`;
}

// ══════════════════════════════════════════════════════
//  VORWORT / EINLEITUNG
// ══════════════════════════════════════════════════════
function introHTML(t) {
  const body     = (INTRO_BODY[t.lang] || INTRO_BODY.de).map(p => `<p>${p}</p>`).join('\n');
  const discLong = DISC_LONG[t.lang] || DISC_LONG.de;
  const dir      = t.dir;
  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${dir}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.introTitle} · القرآن الكريم · ${t.titleNative}</title>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f7f2e6;color:#160a00;font-family:'Noto Serif',serif;min-height:100vh}

/* Manuskript-Rahmen — sichtbar auf großen Bildschirmen */
@media(min-width:900px){
  body::before{content:'';position:fixed;inset:10px;border:1px solid rgba(160,122,34,.14);pointer-events:none;z-index:100}
  body::after{content:'';position:fixed;inset:15px;border:1px solid rgba(160,122,34,.07);pointer-events:none;z-index:100}
}

/* Nav */
nav{background:#07100a;height:42px;display:flex;align-items:center;padding:0 24px;gap:14px;border-bottom:1px solid rgba(160,122,34,.2);position:sticky;top:0;z-index:200}
nav a{color:rgba(192,155,60,.42);text-decoration:none;font:.64rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.9)}
nav .sp{flex:1}

/* Ornamentaler Header */
.page-header{
  background:#07100a;
  text-align:center;
  padding:0;
  border-bottom:2px solid rgba(160,122,34,.22);
  position:relative;overflow:hidden;
}
.ph-shamsa{position:absolute;width:120%;height:120%;left:-10%;top:-10%;opacity:.6;pointer-events:none}
.ph-geo{height:14px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px),
  repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px);
  background-size:8px 8px;
  border-bottom:1px solid rgba(160,122,34,.2)}
.ph-inner{padding:50px 24px 44px;position:relative;z-index:2}
.ph-orn{font-family:'Scheherazade New',serif;font-size:1.3rem;color:rgba(192,155,60,.28);direction:rtl;display:block;margin-bottom:10px}
.ph-bismi{font-family:'Scheherazade New',serif;font-size:2.2rem;color:#c9a84c;direction:rtl;line-height:1.6;display:block}
.ph-sub{font:.57rem/1 sans-serif;color:rgba(192,155,60,.28);letter-spacing:.2em;text-transform:uppercase;display:block;margin-top:12px}
.ph-geo-b{height:14px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px),
  repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px);
  background-size:8px 8px;
  border-top:1px solid rgba(160,122,34,.2)}

/* Hinweis-Banner */
.disc-banner{
  background:rgba(160,122,34,.04);
  border-top:1px solid rgba(160,122,34,.14);
  border-bottom:1px solid rgba(160,122,34,.14);
  padding:14px 28px;text-align:center;
  font:.75rem/1.8 sans-serif;color:rgba(100,62,10,.68);font-style:italic;
}
.disc-banner strong{color:rgba(128,82,12,.88)}

/* Seite */
main{
  max-width:660px;margin:52px auto 100px;padding:0 28px;
  position:relative;
}
/* Seitliche Ornamentlinien */
main::before{content:'';position:absolute;top:0;bottom:0;left:4px;width:1px;background:linear-gradient(to bottom,transparent,rgba(160,122,34,.12) 15%,rgba(160,122,34,.12) 85%,transparent);pointer-events:none}
main::after{content:'';position:absolute;top:0;bottom:0;right:4px;width:1px;background:linear-gradient(to bottom,transparent,rgba(160,122,34,.12) 15%,rgba(160,122,34,.12) 85%,transparent);pointer-events:none}

/* Sektionsüberschrift */
.sec-orn{text-align:center;margin-bottom:28px}
.sec-ar{font-family:'Scheherazade New',serif;font-size:2rem;color:rgba(160,122,34,.7);direction:rtl;display:block}
.sec-div{display:block;color:rgba(160,122,34,.25);font-size:.55rem;letter-spacing:6px;margin:4px 0 8px}
h2{font-size:1.1rem;font-weight:400;color:#3a1e00;text-align:center;padding-bottom:12px;border-bottom:1px solid rgba(160,122,34,.18)}
p{font-size:.93rem;font-weight:300;line-height:2.05;color:#2c1400;margin:1.5em 0}
p em{font-style:italic;color:#7a4e18}

/* Bismillah-Kartousche */
.bismi-wrap{
  margin:40px 0 36px;
  border:1px solid rgba(160,122,34,.25);
  position:relative;
  background:#f0e8d4;
}
.bismi-wrap::before,.bismi-wrap::after{
  content:'✸';position:absolute;top:50%;transform:translateY(-50%);
  color:rgba(160,122,34,.35);font-size:1rem;
}
.bismi-wrap::before{left:-14px}.bismi-wrap::after{right:-14px}
.bismi-inner{
  border:1px solid rgba(160,122,34,.12);
  margin:5px;padding:28px 20px;
  text-align:center;
}
.bismi-geo{height:10px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px);
  background-size:6px 6px;
  border-bottom:1px solid rgba(160,122,34,.18);
}
.bismi-text{font-family:'Scheherazade New',serif;font-size:2.1rem;color:#a07a22;direction:rtl;line-height:1.8;display:block;padding:18px 10px}
.bismi-geo-b{height:10px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px);
  background-size:6px 6px;
  border-top:1px solid rgba(160,122,34,.18);
}

/* CTA */
.cta{text-align:center;margin-top:48px}
.cta a{
  display:inline-block;padding:13px 52px;
  background:#07100a;color:#c9a84c;
  font:.72rem sans-serif;letter-spacing:.28em;
  text-decoration:none;text-transform:uppercase;
  border:1px solid rgba(160,122,34,.45);
  transition:all .3s;position:relative;
}
.cta a::before,.cta a::after{content:'✸';position:absolute;top:50%;transform:translateY(-50%);font-size:.5rem;color:rgba(192,155,60,.4)}
.cta a::before{left:14px}.cta a::after{right:14px}
.cta a:hover{background:#0f2010;border-color:#c9a84c;letter-spacing:.34em}

footer{background:#07100a;border-top:2px solid rgba(160,122,34,.14);padding:18px 24px;text-align:center}
.ft-ar{font-family:'Scheherazade New',serif;font-size:1.15rem;color:rgba(160,122,34,.28);display:block}
.ft-geo{height:10px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.06) 2px,rgba(160,122,34,.06) 3px),
  repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.06) 2px,rgba(160,122,34,.06) 3px);
  background-size:6px 6px;border-bottom:1px solid rgba(160,122,34,.15);margin-bottom:14px}
</style></head><body>
<nav>
  <a href="cover.html">← ${t.titleNative}</a>
  <span class="sp"></span>
  <a href="index.html">${t.indexTitle}</a>
</nav>

<div class="page-header">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" class="ph-shamsa" aria-hidden="true">
    <g transform="translate(200,200)" fill="none" stroke="rgba(192,155,60,0.05)" stroke-width="0.8">
      <circle r="192"/><circle r="155"/><circle r="115"/><circle r="75"/>
      <path d="M0,-192 L46,-46 L192,0 L46,46 L0,192 L-46,46 L-192,0 L-46,-46Z"/>
      <path d="M0,-192 L46,-46 L192,0 L46,46 L0,192 L-46,46 L-192,0 L-46,-46Z" transform="rotate(22.5)"/>
      <line x1="0" y1="-192" x2="0" y2="192" stroke="rgba(192,155,60,0.03)"/>
      <line x1="-192" y1="0" x2="192" y2="0" stroke="rgba(192,155,60,0.03)"/>
    </g>
  </svg>
  <div class="ph-geo"></div>
  <div class="ph-inner">
    <span class="ph-orn">۞</span>
    <span class="ph-bismi">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
    <span class="ph-sub">${t.flag} ${t.titleNative} · القرآن الكريم</span>
  </div>
  <div class="ph-geo-b"></div>
</div>

<div class="disc-banner">${discLong}</div>

<main>
  <div class="sec-orn">
    <span class="sec-ar">القرآن الكريم</span>
    <span class="sec-div">─ ─ ✦ ─ ─</span>
    <h2>${t.introTitle}</h2>
  </div>
  ${body}
  <div class="bismi-wrap">
    <div class="bismi-inner">
      <div class="bismi-geo"></div>
      <span class="bismi-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
      <div class="bismi-geo-b"></div>
    </div>
  </div>
  <div class="cta"><a href="index.html">${t.readBtn}</a></div>
</main>

<footer>
  <div class="ft-geo"></div>
  <span class="ft-ar">القرآن الكريم · ${t.titleNative}</span>
</footer>
</body></html>`;
}

// ══════════════════════════════════════════════════════
//  SUREN-INDEX
// ══════════════════════════════════════════════════════
function indexHTML(t, chapters) {
  const rows = chapters.map(c => {
    const tn = c.translated_name ? c.translated_name.name : '';
    return `<a href="suren/${surahFile(c)}" class="row">
  <span class="rn">${String(c.id).padStart(3,'0')}</span>
  <span class="ra">${c.name_arabic}</span>
  <span class="ri">
    <span class="rs">${c.name_simple}</span>
    ${tn ? `<span class="rt">${tn}</span>` : ''}
  </span>
  <span class="rv">${c.verses_count}</span>
</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · ${t.titleNative}</title>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:wght@300;400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f7f2e6;color:#160a00;font-family:'Noto Serif',serif}
@media(min-width:900px){
  body::before{content:'';position:fixed;inset:10px;border:1px solid rgba(160,122,34,.13);pointer-events:none;z-index:100}
}
nav{background:#07100a;height:42px;display:flex;align-items:center;padding:0 24px;gap:14px;border-bottom:1px solid rgba(160,122,34,.2);position:sticky;top:0;z-index:200}
nav a{color:rgba(192,155,60,.42);text-decoration:none;font:.64rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.9)}
nav .sp{flex:1}
.page-header{background:#07100a;text-align:center;padding:0;border-bottom:2px solid rgba(160,122,34,.22);overflow:hidden;position:relative}
.ph-geo{height:14px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px),
  repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px);
  background-size:8px 8px;border-bottom:1px solid rgba(160,122,34,.2)}
.ph-inner{padding:46px 24px 38px;position:relative;z-index:2}
.ph-orn{font-family:'Scheherazade New',serif;font-size:1.3rem;color:rgba(192,155,60,.28);direction:rtl;display:block;margin-bottom:8px}
.ph-ar{font-family:'Scheherazade New',serif;font-size:3rem;color:#c9a84c;direction:rtl}
.ph-sub{font:.57rem/1 sans-serif;color:rgba(192,155,60,.28);letter-spacing:.2em;text-transform:uppercase;display:block;margin-top:10px}
.ph-geo-b{height:14px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px),
  repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(192,155,60,.08) 3px,rgba(192,155,60,.08) 4px);
  background-size:8px 8px;border-top:1px solid rgba(160,122,34,.2)}
.list{max-width:740px;margin:20px auto 70px;padding:0 20px}
.row{display:flex;align-items:center;gap:12px;padding:13px 10px;border-bottom:1px solid rgba(160,122,34,.1);text-decoration:none;color:#160a00;transition:background .15s,border-color .15s}
.row:first-child{border-top:1px solid rgba(160,122,34,.1)}
.row:hover{background:rgba(160,122,34,.05);border-color:rgba(160,122,34,.2)}
.rn{font:.6rem sans-serif;color:rgba(160,122,34,.45);min-width:28px;font-variant-numeric:tabular-nums}
.ra{font-family:'Scheherazade New',serif;font-size:1.6rem;color:#a07a22;min-width:82px;text-align:right;direction:rtl}
.ri{flex:1}
.rs{display:block;font-size:.86rem;color:#2a1200}
.rt{display:block;font-size:.68rem;color:#9a7840;margin-top:2px;font-weight:300}
.rv{font:.6rem sans-serif;color:rgba(160,122,34,.32);min-width:26px;text-align:right}
footer{background:#07100a;border-top:2px solid rgba(160,122,34,.14);padding:18px 24px;text-align:center}
.ft-geo{height:10px;background-image:
  repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.06) 2px,rgba(160,122,34,.06) 3px),
  repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.06) 2px,rgba(160,122,34,.06) 3px);
  background-size:6px 6px;border-bottom:1px solid rgba(160,122,34,.15);margin-bottom:14px}
.ft-ar{font-family:'Scheherazade New',serif;font-size:1.1rem;color:rgba(160,122,34,.28);display:block}
</style></head><body>
<nav>
  <a href="intro.html">← ${t.introTitle}</a>
  <span class="sp"></span>
  <a href="cover.html">${t.titleNative}</a>
</nav>
<div class="page-header">
  <div class="ph-geo"></div>
  <div class="ph-inner">
    <span class="ph-orn">۞</span>
    <div class="ph-ar">القرآن الكريم</div>
    <span class="ph-sub">${t.flag} ${t.titleNative} · 114 سورة</span>
  </div>
  <div class="ph-geo-b"></div>
</div>
<main class="list">
${rows}
</main>
<footer>
  <div class="ft-geo"></div>
  <span class="ft-ar">القرآن الكريم</span>
</footer>
</body></html>`;
}

// ══════════════════════════════════════════════════════
//  SURA-SEITE  (Amiri Quran Font — löst Fragezeichen)
// ══════════════════════════════════════════════════════
function surahCSS(dir) {
  const align = dir === 'rtl' ? 'right' : 'left';
  return `
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&display=swap');

:root{--gold:#b8922a;--gold-d:rgba(160,122,34,.22);--bg:#f7f2e6;--bg2:#ede5d2;--ink:#160a00;--tr:rgba(70,40,5,.55);--rule:rgba(160,122,34,.14)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--ink);min-height:100vh}

/* Manuskript-Randlinien */
@media(min-width:900px){
  body::before{content:'';position:fixed;inset:10px;border:1px solid rgba(160,122,34,.12);pointer-events:none;z-index:100}
  body::after{content:'';position:fixed;inset:15px;border:1px solid rgba(160,122,34,.06);pointer-events:none;z-index:100}
}

/* Nav */
nav{background:#07100a;height:42px;display:flex;align-items:center;padding:0 20px;gap:12px;border-bottom:1px solid rgba(160,122,34,.2);position:sticky;top:0;z-index:200;font-family:sans-serif}
nav a{color:rgba(192,155,60,.42);text-decoration:none;font-size:.63rem;letter-spacing:.08em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.9)}
nav .ar-t{font-family:'Scheherazade New',serif;font-size:.95rem;color:rgba(192,155,60,.35);direction:rtl}
nav .sp{flex:1}
nav .pos{color:rgba(192,155,60,.2);font-size:.57rem}

/* Sprach-Switcher */
.sw{position:relative}
.sw-btn{background:none;border:1px solid rgba(160,122,34,.22);cursor:pointer;color:rgba(192,155,60,.38);font-size:.6rem;font-family:sans-serif;padding:3px 10px;transition:all .2s}
.sw-btn:hover{border-color:rgba(160,122,34,.5);color:rgba(192,155,60,.75)}
.sw-panel{display:none;position:absolute;top:calc(100% + 6px);right:0;background:#07100a;border:1px solid rgba(160,122,34,.22);min-width:175px;box-shadow:0 8px 28px rgba(0,0,0,.75);z-index:300}
.sw:hover .sw-panel,.sw-panel:hover{display:block}
.sw-panel a{display:flex;align-items:center;gap:7px;padding:7px 14px;color:rgba(192,155,60,.48);text-decoration:none;font:.63rem sans-serif;transition:background .15s}
.sw-panel a:hover{background:rgba(160,122,34,.06);color:rgba(192,155,60,.95)}
.sw-panel a.cur{color:rgba(192,155,60,.9);pointer-events:none}

/* Sura-Header — ornamentale Rahmung */
.sh{background:#07100a;text-align:center;padding:0;border-bottom:2px solid rgba(160,122,34,.22);position:relative;overflow:hidden}
.sh-shamsa{position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none}
.sh-geo{height:12px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(192,155,60,.08) 2px,rgba(192,155,60,.08) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(192,155,60,.08) 2px,rgba(192,155,60,.08) 3px);
  background-size:6px 6px;
  border-bottom:1px solid rgba(160,122,34,.2)}
.sh-inner{padding:52px 24px 44px;position:relative;z-index:2}
.sh-orn{font-family:'Scheherazade New',serif;font-size:1.2rem;color:rgba(192,155,60,.25);direction:rtl;display:block;margin-bottom:10px}
/* Sura-Name in Kartousche */
.sh-cartouche{
  display:inline-block;position:relative;
  padding:8px 44px;
  border-top:1px solid rgba(192,155,60,.3);
  border-bottom:1px solid rgba(192,155,60,.3);
}
.sh-cartouche::before,.sh-cartouche::after{
  content:'✸';position:absolute;top:50%;transform:translateY(-50%);
  color:rgba(192,155,60,.4);font-size:.9rem;
}
.sh-cartouche::before{left:12px}.sh-cartouche::after{right:12px}
.sh-name{font-family:'Scheherazade New',serif;font-size:4rem;color:#c9a84c;direction:rtl;line-height:1.3;display:block}
.sh-meta{font:.56rem/1 sans-serif;color:rgba(192,155,60,.27);letter-spacing:.22em;text-transform:uppercase;display:block;margin-top:14px}
.sh-geo-b{height:12px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(192,155,60,.08) 2px,rgba(192,155,60,.08) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(192,155,60,.08) 2px,rgba(192,155,60,.08) 3px);
  background-size:6px 6px;
  border-top:1px solid rgba(160,122,34,.2)}

/* Bismillah — Kartousche */
.bismi{
  background:var(--bg2);
  padding:0;
  border-bottom:1px solid var(--rule);
  position:relative;
}
.bismi-geo{height:10px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px);
  background-size:6px 6px;border-bottom:1px solid rgba(160,122,34,.15)}
.bismi-text{
  text-align:center;padding:28px 20px;
  font-family:'Amiri Quran',serif;
  font-size:2.1rem;color:var(--gold);
  direction:rtl;line-height:1.8;
  display:block;
}
.bismi-geo-b{height:10px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(160,122,34,.07) 2px,rgba(160,122,34,.07) 3px);
  background-size:6px 6px;border-top:1px solid rgba(160,122,34,.15)}

/* Verse */
.verses{max-width:860px;margin:0 auto;padding:0 28px 100px}
.verse{padding:46px 0 38px;border-bottom:1px solid var(--rule);position:relative}
.verse:last-child{border-bottom:none}

/* Arabischer Vers — Amiri Quran (KEIN Fragezeichen) */
.ar{
  font-family:'Amiri Quran',serif;
  font-size:2.55rem;
  line-height:2.4;
  color:var(--ink);
  direction:rtl;
  text-align:center;
}

/* Ornamentaler Verstrennstrich */
.vr{
  display:flex;align-items:center;justify-content:center;
  gap:6px;margin:18px auto 16px;
  color:rgba(160,122,34,.3);font-size:.5rem;letter-spacing:4px;
  user-select:none;
}
.vr::before,.vr::after{content:'─ ─';color:rgba(160,122,34,.22);letter-spacing:2px}

/* Übersetzung */
.tr{
  font-family:'Noto Serif',serif;
  font-size:.87rem;font-weight:300;
  line-height:2;
  color:var(--tr);
  direction:${dir};text-align:${align};
  font-style:italic;
}

/* Footer */
footer{
  background:#07100a;
  border-top:2px solid rgba(160,122,34,.16);
  padding:0;
}
.ft-geo{height:10px;
  background-image:
    repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(192,155,60,.07) 2px,rgba(192,155,60,.07) 3px),
    repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(192,155,60,.07) 2px,rgba(192,155,60,.07) 3px);
  background-size:6px 6px;border-bottom:1px solid rgba(160,122,34,.15)}
.ft-inner{display:flex;justify-content:space-between;align-items:center;padding:12px 22px}
.ft-ar{font-family:'Scheherazade New',serif;font-size:1.05rem;color:rgba(192,155,60,.25)}
.ft-note{font:.46rem sans-serif;color:rgba(160,122,34,.14);font-style:italic;max-width:34%;text-align:center}
.ft-info{font:.56rem sans-serif;color:rgba(192,155,60,.18);letter-spacing:.07em}

@media(max-width:600px){.ar{font-size:2rem}.sh-name{font-size:3rem}.verses{padding:0 14px 60px}}
@media print{nav,footer{display:none}.sh,.bismi{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;
}

function surahHTML(chapter, verses, arabicMap, t, chapters) {
  const hasBismi = chapter.id !== 1 && chapter.id !== 9;
  const bismi = hasBismi ? `<div class="bismi">
  <div class="bismi-geo"></div>
  <span class="bismi-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
  <div class="bismi-geo-b"></div>
</div>` : '';

  const prev = chapters.find(c => c.id === chapter.id - 1) || null;
  const next = chapters.find(c => c.id === chapter.id + 1) || null;
  const sf   = surahFile(chapter);

  const switchLinks = TRANSLATIONS.map(lt => {
    const isCur = lt.name === t.name;
    return `<a href="../../${lt.name}/suren/${sf}"${isCur ? ' class="cur"' : ''}>${lt.flag} ${lt.titleNative}</a>`;
  }).join('');

  const verseBlocks = verses.map(v => {
    const num    = v.verse_key.split(':')[1];
    const arNum  = toArabicNum(num);
    const arText = arabicMap[v.verse_key] || '';
    const raw    = (v.translations && v.translations[0]) ? v.translations[0].text : '';
    const trans  = raw.replace(/<sup[^>]*>.*?<\/sup>/gi,'').replace(/<[^>]+>/g,'').trim() || '—';
    return `<div class="verse" id="v${num}">
  <div class="ar">${arText} ﴿${arNum}﴾</div>
  <div class="vr">✦</div>
  <div class="tr">${trans}</div>
</div>`;
  }).join('\n');

  const rev = chapter.revelation_place === 'makkah' ? 'مَكِّيَّة' : 'مَدَنِيَّة';

  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="ltr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${chapter.name_arabic} · ${chapter.name_simple} · ${t.titleNative}</title>
<style>${surahCSS(t.dir)}</style>
</head><body>

<nav>
  <span class="ar-t">القرآن الكريم</span>
  <span class="sp"></span>
  ${prev ? `<a href="${surahFile(prev)}">← ${prev.name_arabic}</a>` : '<span></span>'}
  <span class="pos">${chapter.id} / 114</span>
  ${next ? `<a href="${surahFile(next)}">${next.name_arabic} →</a>` : '<span></span>'}
  <span class="sp"></span>
  <div class="sw">
    <button class="sw-btn">🌐 ${t.flag}</button>
    <div class="sw-panel">${switchLinks}</div>
  </div>
</nav>

<div class="sh">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" class="sh-shamsa" aria-hidden="true">
    <g fill="none" stroke="rgba(192,155,60,0.05)" stroke-width="0.7">
      <ellipse cx="400" cy="100" rx="390" ry="95"/>
      <ellipse cx="400" cy="100" rx="300" ry="70"/>
      <ellipse cx="400" cy="100" rx="200" ry="45"/>
      <line x1="10" y1="100" x2="790" y2="100"/>
      <line x1="400" y1="5" x2="400" y2="195"/>
      <line x1="124" y1="22" x2="676" y2="178"/>
      <line x1="676" y1="22" x2="124" y2="178"/>
    </g>
  </svg>
  <div class="sh-geo"></div>
  <div class="sh-inner">
    <span class="sh-orn">۞</span>
    <div class="sh-cartouche">
      <span class="sh-name">${chapter.name_arabic}</span>
    </div>
    <span class="sh-meta">${chapter.name_simple} · ${chapter.verses_count} آية · ${rev}</span>
  </div>
  <div class="sh-geo-b"></div>
</div>

${bismi}

<main class="verses">
${verseBlocks}
</main>

<footer>
  <div class="ft-geo"></div>
  <div class="ft-inner">
    <span class="ft-ar">القرآن الكريم</span>
    <span class="ft-note">${DISC[t.lang] || DISC.de}</span>
    <span class="ft-info">${t.flag} ${t.titleNative} · ${chapter.name_simple}</span>
  </div>
</footer>

</body></html>`;
}

// ══════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════
async function main() {
  console.log('\n  ╔══════════════════════════════════╗');
  console.log('  ║   AL-QURAN · Redesign  v 4 . 0   ║');
  console.log('  ╚══════════════════════════════════╝\n');

  process.stdout.write('  Kapitel-Metadaten … ');
  const ch = await fetchRetry('https://api.quran.com/api/v4/chapters?language=de');
  const chapters = ch.chapters;
  console.log(`${chapters.length} ✓`);

  process.stdout.write('  Arabischer Text (Amiri Quran) … ');
  const ar = await fetchRetry('https://api.quran.com/api/v4/quran/verses/uthmani');
  const arabicMap = {};
  for (const v of ar.verses) arabicMap[v.verse_key] = v.text_uthmani;
  console.log(`${Object.keys(arabicMap).length} Verse ✓\n`);

  fs.writeFileSync(path.join(BASE_DIR, 'cover.html'), mainCoverHTML(), 'utf8');
  console.log('  cover.html ✓\n');

  for (const t of TRANSLATIONS) {
    const tDir    = path.join(OUT_DIR, t.name);
    const surenDir = path.join(tDir, 'suren');
    if (!fs.existsSync(tDir))     fs.mkdirSync(tDir,    { recursive: true });
    if (!fs.existsSync(surenDir)) fs.mkdirSync(surenDir, { recursive: true });

    fs.writeFileSync(path.join(tDir, 'cover.html'), langCoverHTML(t),       'utf8');
    fs.writeFileSync(path.join(tDir, 'intro.html'), introHTML(t),           'utf8');
    fs.writeFileSync(path.join(tDir, 'index.html'), indexHTML(t, chapters), 'utf8');
    process.stdout.write(`  ${t.flag} ${t.name}: cover + vorwort + index ✓  Suren … `);

    let n = 0;
    for (const c of chapters) {
      const url  = `https://api.quran.com/api/v4/verses/by_chapter/${c.id}?translations=${t.transId}&per_page=300&fields=verse_key`;
      const data = await fetchRetry(url);
      const html = surahHTML(c, data.verses || [], arabicMap, t, chapters);
      fs.writeFileSync(path.join(surenDir, surahFile(c)), html, 'utf8');
      n++;
      if (n % 25 === 0) process.stdout.write('.');
    }
    console.log(` ${n} ✓`);
  }

  console.log('\n  ✅  Redesign v4.0 abgeschlossen\n');
}

main().catch(e => { console.error('\n  ✗', e.message); process.exit(1); });
