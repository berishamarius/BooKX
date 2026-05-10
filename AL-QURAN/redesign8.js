'use strict';
/**
 * AL-QURAN · Redesign v7.0
 *
 * Fixes v6→v7:
 * ✓ Shamsa (Sonnen-Medaillon) — kreisförmig, KEINE Polygone/Sterne
 * ✓ Ecken-Ornamente entfernt von ALLEN Seiten
 * ✓ Top-Navigationsleiste auf Leseseiten entfernt
 * ✓ Sprach-Dropdown entfernt
 * ✓ Vor/Zurück-Buttons zentriert (kein 1fr-stretch)
 * ✓ Sprache im Center-Button der Lese-Navigation
 * ✓ © KX KroniX Urheberrechtsschutz auf allen Seiten (Meta + Footer)
 *
 * node redesign7.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const BASE_DIR = __dirname;
const OUT_DIR  = path.join(BASE_DIR, 'Übersetzungen');

const TRANSLATIONS = [
  { name:'Deutsch',     lang:'de', dir:'ltr', transId:27,  titleNative:'Deutsch',         readBtn:'Lesen',             introTitle:'Vorwort',     indexTitle:'Inhaltsverzeichnis' },
  { name:'Englisch',    lang:'en', dir:'ltr', transId:20,  titleNative:'English',          readBtn:'Read',              introTitle:'Foreword',    indexTitle:'Table of Contents'  },
  { name:'Türkisch',    lang:'tr', dir:'ltr', transId:77,  titleNative:'Türkçe',           readBtn:'Okumaya Başla',     introTitle:'Önsöz',       indexTitle:'İçindekiler'        },
  { name:'Indonesisch', lang:'id', dir:'ltr', transId:33,  titleNative:'Bahasa Indonesia', readBtn:'Mulai Membaca',     introTitle:'Pendahuluan', indexTitle:'Daftar Isi'         },
  { name:'Urdu',        lang:'ur', dir:'rtl', transId:97,  titleNative:'اردو',             readBtn:'پڑھنا شروع کریں',  introTitle:'دیباچہ',      indexTitle:'فہرست'              },
  { name:'Persisch',    lang:'fa', dir:'rtl', transId:135, titleNative:'فارسی',            readBtn:'شروع به خواندن',   introTitle:'مقدمه',       indexTitle:'فهرست مطالب'        },
  { name:'Russisch',    lang:'ru', dir:'ltr', transId:45,  titleNative:'Русский',          readBtn:'Начать чтение',     introTitle:'Предисловие', indexTitle:'Оглавление'         },
  { name:'Bengalisch',  lang:'bn', dir:'ltr', transId:161, titleNative:'বাংলা',            readBtn:'পড়া শুরু করুন',    introTitle:'ভূমিকা',      indexTitle:'বিষয়সূচি'           },
  { name:'Hindi',       lang:'hi', dir:'ltr', transId:122, titleNative:'हिन्दी',           readBtn:'पढ़ना शुरू करें',  introTitle:'प्रस्तावना', indexTitle:'विषय-सूची'          },
  { name:'Hausa',       lang:'ha', dir:'ltr', transId:32,  titleNative:'Hausa',            readBtn:'Fara Karanta',      introTitle:'Gabatarwa',   indexTitle:'Jerin Abubuwa'      },
  { name:'Bosnisch',    lang:'bs', dir:'ltr', transId:126, titleNative:'Bosanski',         readBtn:'Počni Čitati',      introTitle:'Predgovor',   indexTitle:'Sadržaj'            },
  { name:'Albanisch',   lang:'sq', dir:'ltr', transId:88,  titleNative:'Shqip',            readBtn:'Fillo Leximin',     introTitle:'Parathënie',  indexTitle:'Tabela e Permbajtjes'},
  { name:'Chinesisch',  lang:'zh', dir:'ltr', transId:56,  titleNative:'中文',              readBtn:'开始阅读',           introTitle:'序言',        indexTitle:'目录'                },
  { name:'Uygurisch',   lang:'ug', dir:'rtl', transId:76,  titleNative:'ئۇيغۇرچە',        readBtn:'ئوقۇشنى باشلاش',  introTitle:'مۇقەددىمە',  indexTitle:'مۇندەرىجە'          },
];

const DISC = {
  de:'Sinngemäße Übersetzung — kein wörtliches Abbild des arabischen Originals.',
  en:'Translation of meanings — not a word-for-word rendering of the original.',
  tr:"Anlamsal çeviri — kelimenin tam karşılığı değil.",
  id:"Terjemahan makna — bukan kata per kata dari teks aslinya.",
  ur:'معنوی ترجمہ — اصل کا لفظ بہ لفظ ترجمہ نہیں۔',
  fa:'ترجمه معنایی — نه کلمه‌به‌کلمه از متن اصلی.',
  ru:'Смысловой перевод — не дословный перевод оригинала.',
  bn:'অর্থগত অনুবাদ — মূল পাঠের শাব্দিক অনুবাদ নয়।',
  hi:'अर्थ का अनुवाद — मूल पाठ का शब्द-दर-शब्द नहीं।',
  ha:"Fassarar ma'ana — ba kalma-da-kalma ba.",
  bs:"Prijevod značenja — nije doslovan prijevod originala.",
  sq:'Përkthim kuptimor — jo fjalë për fjalë i origjinalit.',
  zh:'含义翻译——并非原文的逐字翻译。',
  ug:'مەنا تەرجىمەسى — ئەسلى مەتننىڭ سۆزمۇ-سۆز تەرجىمەسى ئەمەس.',
};

const BISMI_TR = {
  de:'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
  en:'In the name of Allah, the Most Gracious, the Most Merciful.',
  tr:'Rahmân ve Rahîm olan Allah\'ın adıyla.',
  id:'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
  ur:'اللہ کے نام سے جو بڑا مہربان، نہایت رحم والا ہے۔',
  fa:'به نام خداوند بخشنده مهربان.',
  ru:'Во имя Аллаха, Милостивого, Милосердного.',
  bn:'পরম করুণাময় ও অতি দয়ালু আল্লাহর নামে।',
  hi:'अल्लाह के नाम से, जो अत्यन्त कृपाशील, बड़ा दयावान है।',
  ha:'Da sunan Allah, Mai rahama, Mai jin ƙai.',
  bs:'U ime Allaha, Milostivog, Samilosnog.',
  sq:'Me emrin e Allahut, të Gjithëmëshirshmit, Mëshirëplotit.',
  zh:'奉最仁慈、特慈的安拉之名。',
  ug:'مەرھەمەتلىك ۋە شەپقەتلىك اللاھنىڭ ئىسمى بىلەن.',
};

const DISC_LONG = {
  de:'Dies ist eine <strong>sinngemäße Übersetzung</strong> des Heiligen Qurans ins Deutsche. Eine Übersetzung ist kein Quran — der einzig authentische Quran ist der arabische Urtext, der seit über 1.400 Jahren unverändert überliefert wird.',
  en:'This is a <strong>translation of meanings</strong> of the Holy Quran in English. A translation is not the Quran — the only authentic Quran is the original Arabic text, preserved unchanged for over 1,400 years.',
  tr:"Bu, Kutsal Kur'an'ın Türkçe <strong>anlamsal çevirisidir</strong>. Bir çeviri Kur'an değildir — tek gerçek Kur'an, 1.400 yılı aşkın süredir değişmeden korunan Arapça orijinal metindir.",
  id:"Ini adalah <strong>terjemahan makna</strong> Al-Qur'an dalam Bahasa Indonesia. Terjemahan bukan Al-Qur'an — Al-Qur'an yang autentik hanyalah teks Arab asli yang telah dipelihara tidak berubah selama lebih dari 1.400 tahun.",
  ur:'یہ قرآن کریم کا اردو میں <strong>معنوی ترجمہ</strong> ہے۔ ترجمہ قرآن نہیں — واحد مستند قرآن عربی اصل متن ہے جو 1400 سال سے زیادہ عرصے سے غیر تبدیل شدہ محفوظ ہے۔',
  fa:'این <strong>ترجمه معنایی</strong> قرآن کریم به فارسی است. ترجمه قرآن نیست — قرآن اصیل تنها متن عربی اصلی است که بیش از ۱۴۰۰ سال بدون تغییر حفظ شده است.',
  ru:'Это <strong>смысловой перевод</strong> Священного Корана на русский язык. Перевод — не Коран: единственный подлинный Коран — арабский оригинальный текст, сохранённый неизменным более 1.400 лет.',
  bn:'এটি পবিত্র কুরআনের বাংলায় <strong>অর্থগত অনুবাদ</strong>। অনুবাদ কুরআন নয় — একমাত্র খাঁটি কুরআন হল আরবি মূল পাঠ, যা ১৪০০ বছরেরও বেশি সময় ধরে অপরিবর্তিত সংরক্ষিত।',
  hi:'यह पवित्र क़ुरआन का हिन्दी में <strong>अर्थ का अनुवाद</strong> है। अनुवाद क़ुरआन नहीं है — एकमात्र प्रामाणिक क़ुरआन अरबी मूल पाठ है जो 1,400 वर्षों से अपरिवर्तित सुरक्षित है।',
  ha:"Wannan <strong>fassarar ma'ana</strong> ce ta Alƙur'ani Mai Tsarki cikin Hausa. Fassara ba Alƙur'ani ba ce — Alƙur'anin ainihi shi ne rubutun Larabci na asali wanda aka adana ba tare da canzawa ba tsawon shekaru 1.400.",
  bs:"Ovo je <strong>prijevod značenja</strong> Časnog Kur'ana na bosanski jezik. Prijevod nije Kur'an — jedini autentični Kur'an je originalni arapski tekst, sačuvan nepromijenjen više od 1.400 godina.",
  sq:'Ky është <strong>përkthim i kuptimeve</strong> të Kuranit të Shenjtë në gjuhën shqipe. Përkthimi nuk është Kurani — i vetmi Kuran autentik është teksti origjinal arabisht, i ruajtur i pandryshuar për mbi 1.400 vjet.',
  zh:'这是《古兰经》含义的<strong>中文翻译</strong>。翻译不是古兰经——唯一真实的古兰经是已保存超过1400年未曾改变的阿拉伯文原典。',
  ug:'بۇ مۇقەددەس قۇرئاننىڭ ئۇيغۇرچىگە <strong>مەنا تەرجىمەسى</strong>. تەرجىمە قۇرئان ئەمەس — بىردىنبىر ھەقىقىي قۇرئان 1400 يىلدىن ئارتۇق ئۆزگەرمەي ساقلىنىپ كەلگەن ئەرەبچە ئەسلى مەتن.',
};

const INTRO_BODY = {
  de:['Der Quran wurde dem Propheten Muhammad ﷺ über dreiundzwanzig Jahre herabgesandt. Er ist die Grundlage des islamischen Glaubens und des muslimischen Lebens.','Was hier vorliegt, ist eine sinngemäße Übersetzung ins Deutsche — kein Ersatz für das arabische Original. Jede Übersetzung nähert sich dem Sinn, ohne ihn vollständig zu fassen. Das Arabische ist der Quran; alles andere ist Annäherung.','Lies, was hier steht, als einen Hinweis. Wer den arabischen Urtext hören und lesen kann, geht den unmittelbaren Weg.','Das Design dieser Ausgabe ist eine bewusste Entscheidung: arabischer Text groß und im Vordergrund, die Übersetzung klein und zurückhaltend — um dem Original in Wort und Geist so nah wie möglich zu sein.'],
  en:['The Quran was revealed to the Prophet Muhammad ﷺ over twenty-three years. It is the foundation of Islamic belief and Muslim life.','What follows is a translation of its meanings into English — not a substitute for the Arabic original. Every translation approximates the sense without fully capturing it. The Arabic is the Quran; everything else is approximation.','Read what is here as a signpost. Those who can hear and read the Arabic original walk the direct path.','The design of this edition is a deliberate choice: Arabic text large and foremost, translation small and receding — to remain as close as possible to the original in word and spirit.'],
  tr:["Kur'an, Peygamber Muhammed ﷺ'e yirmi üç yıl boyunca vahyedildi. İslam inancının ve Müslüman hayatının temelidir.","Buradakiler, Kur'an'ın Türkçe anlamsal bir çevirisidir — Arapça orijinalin yerini tutmaz. Her çeviri, anlama yaklaşır; onu tam olarak aktaramaz. Kur'an Arapçadır; geri kalan her şey bir yaklaşımdır.",'Burada okuduklarını bir işaret olarak gör. Arapça orijinali duyup okuyabilen, doğrudan yolda yürür.',"Bu baskının tasarımı bilinçli bir karardır: Arapça metin büyük ve ön planda, çeviri küçük ve geri planda — özgüne söz ve ruhta mümkün olduğunca yakın kalmak için."],
  id:["Al-Qur'an diturunkan kepada Nabi Muhammad ﷺ selama dua puluh tiga tahun. Ia adalah landasan keyakinan Islam dan kehidupan Muslim.","Yang disajikan di sini adalah terjemahan makna dalam Bahasa Indonesia — bukan pengganti teks Arab aslinya. Setiap terjemahan mendekati maknanya tanpa bisa sepenuhnya menangkapnya. Al-Qur'an adalah bahasa Arabnya; yang lain hanyalah pendekatan.",'Bacalah ini sebagai petunjuk arah. Mereka yang dapat mendengar dan membaca teks Arab asli berjalan di jalan yang langsung.','Desain edisi ini adalah pilihan yang disengaja: teks Arab besar dan di depan, terjemahan kecil dan memudar — sedekat mungkin dengan aslinya dalam kata dan jiwa.'],
  ur:['قرآن نبی محمد ﷺ پر تئیس سال کے دوران نازل کیا گیا۔ یہ اسلامی ایمان اور مسلمانوں کی زندگی کی بنیاد ہے۔','یہاں جو ہے وہ اردو میں قرآن کے مفہوم کا ترجمہ ہے — عربی اصل کا متبادل نہیں۔ ہر ترجمہ مطلب کے قریب جاتا ہے، مگر پوری طرح پکڑ نہیں پاتا۔ قرآن عربی ہے؛ باقی سب قریبی کوشش ہے۔','یہاں جو پڑھو اسے ایک اشارہ سمجھو۔ جو عربی اصل سن اور پڑھ سکتا ہے، وہ سیدھے راستے پر ہے۔','اس ایڈیشن کا ڈیزائن ایک شعوری انتخاب ہے: عربی متن بڑا اور آگے، ترجمہ چھوٹا اور پیچھے — اصل سے لفظ اور روح میں زیادہ سے زیادہ قریب رہنے کے لیے۔'],
  fa:['قرآن در طول بیست و سه سال بر پیامبر محمد ﷺ نازل شد. پایه‌ی ایمان اسلامی و زندگی مسلمانان است.','آنچه اینجا آمده ترجمه‌ی معنایی به فارسی است — جایگزین متن عربی اصلی نمی‌شود. هر ترجمه‌ای به معنا نزدیک می‌شود، بی‌آنکه آن را به‌تمامی دربربگیرد. قرآن همان عربی است؛ بقیه تقریب است.','آنچه می‌خوانید را نشانه‌ای بدانید. کسی که متن عربی را بشنود و بخواند، راه مستقیم را رفته است.','طراحی این نسخه انتخابی آگاهانه است: متن عربی بزرگ و در پیش‌زمینه، ترجمه کوچک و کم‌رنگ — هرچه نزدیک‌تر به اصل در کلام و روح.'],
  ru:['Коран был ниспослан Пророку Мухаммаду ﷺ на протяжении двадцати трёх лет. Он является основой исламской веры и жизни мусульман.','Перед вами смысловой перевод на русский язык — не замена арабскому оригиналу. Любой перевод приближается к смыслу, не охватывая его целиком. Коран — это арабский текст; всё остальное — лишь приближение.','Читайте это как указатель. Тот, кто может слышать и читать арабский оригинал, идёт прямым путём.','Дизайн этого издания — осознанный выбор: арабский текст крупно и на первом плане, перевод мелко и в тени — чтобы оставаться как можно ближе к оригиналу в слове и духе.'],
  bn:['কুরআন নবী মুহাম্মদ ﷺ-এর উপর তেইশ বছর ধরে নাযিল হয়েছে। এটি ইসলামী বিশ্বাস ও মুসলিম জীবনের ভিত্তি।','এখানে যা উপস্থাপিত হয়েছে তা বাংলায় অর্থগত অনুবাদ — আরবি মূলের বিকল্প নয়। প্রতিটি অনুবাদ অর্থের কাছে যায়, কিন্তু তা পুরোপুরি ধারণ করতে পারে না। কুরআন হলো আরবি; বাকি সব আসন্নবর্তীতা।','এখানে যা পড়ছেন তাকে একটি পথনির্দেশ হিসেবে দেখুন। যারা আরবি মূল শুনতে ও পড়তে পারেন তারা সরাসরি পথে চলেন।','এই সংস্করণের ডিজাইন একটি সচেতন পছন্দ: আরবি পাঠ বড় এবং সামনে, অনুবাদ ছোট ও পেছনে — শব্দে ও আত্মায় মূলের যতটা সম্ভব কাছে থাকতে।'],
  hi:['क़ुरआन नबी मुहम्मद ﷺ पर तेईस वर्षों में अवतरित हुआ। यह इस्लामी विश्वास और मुस्लिम जीवन की नींव है।','यहाँ जो प्रस्तुत है वह हिंदी में अर्थ का अनुवाद है — अरबी मूल का विकल्प नहीं। हर अनुवाद अर्थ के निकट जाता है, किंतु उसे पूरी तरह नहीं पकड़ पाता। क़ुरआन अरबी है; बाकी सब निकटता मात्र है।','यहाँ जो पढ़ें उसे एक संकेत के रूप में समझें। जो अरबी मूल सुन और पढ़ सकते हैं वे सीधे मार्ग पर हैं।','इस संस्करण का डिज़ाइन एक सोची-समझी चुनाव है: अरबी पाठ बड़ा और आगे, अनुवाद छोटा और पीछे — मूल के शब्द और आत्मा में जितना संभव हो उतना निकट रहने के लिए।'],
  ha:["An saukar da Alƙur'ani zuwa ga Annabi Muhammad ﷺ a tsawon shekaru ashirin da uku. Shi ne ginshiƙin imani na Musulunci da rayuwar Musulmi.","Abin da ke nan fassara ce ta ma'ana zuwa Hausa — ba za ta maye gurbin rubutun Larabci na asali ba. Kowane fassara yana kusantar ma'ana ba tare da cika kaiwa ba. Alƙur'ani shi ne Larabci; sauran duka kusanci ne kawai.","Ka karanta abin da ke nan a matsayin alama. Wanda zai iya jin da karanta Larabci na asali ya bi tafarkin kai tsaye.","Tsarin wannan bugu zaɓi ne da gangan: Rubutun Larabci babba kuma a gaba, fassara ƙarama kuma a baya — don kasancewa kusa da asali gwargwado cikin kalma da ruhu."],
  bs:["Kur'an je objavljen Poslaniku Muhamedu ﷺ tokom dvadeset i tri godine. On je temelj islamskog vjerovanja i muslimanskog života.","Ono što slijedi je prijevod značenja na bosanski jezik — nije zamjena za arapski original. Svaki prijevod se približava smislu ne obuhvatajući ga potpuno. Kur'an je arapski; sve ostalo je samo pristup.","Čitajte ovo kao putokaz. Ko može čuti i čitati arapski original, taj je na direktnom putu.","Dizajn ovog izdanja je svjestan izbor: arapski tekst velik i naprijed, prijevod mali i u pozadini — da se ostane što bliže originalu u riječi i duhu."],
  sq:["Kurani iu shpall Profetit Muhamed ﷺ gjatë njëzet e tre vjetëve. Ai është themeli i besimit islam dhe i jetës së muslimanëve.","Ajo që vijon është një përkthim kuptimor në gjuhën shqipe — jo zëvendësim për origjinalin arabisht. Çdo përkthim i afrohet kuptimit pa e kapur plotësisht. Kurani është arabishtja; gjithçka tjetër është vetëm afrueshmëri.","Lexojeni këtë si një udhëtregues. Ai që mund të dëgjojë dhe lexojë arabishten origjinale ecën rrugës direkte.","Dizajni i kësaj botimi është një zgjedhje e qëllimshme: teksti arabisht i madh dhe në plan të parë, përkthimi i vogël dhe në sfond — sa më afër origjinalit në fjalë dhe shpirt."],
  zh:['古兰经在二十三年间逐渐降示给先知穆罕默德ﷺ。它是伊斯兰信仰与穆斯林生活的基础。','此处呈现的是古兰经含义的中文翻译——并非阿拉伯文原典的替代。每一种翻译都趋近于其含义，却无法完全承载。古兰经是阿拉伯文；其余一切皆为近似。','请将您在此读到的视为一个路标。能够聆听和阅读阿拉伯文原典的人，走的是直接之路。','这一版的设计是一个有意为之的选择：阿拉伯文大而居前，译文小而退后——在文字与精神上尽可能贴近原典。'],
  ug:['قۇرئان يىگىرمە ئۈچ يىل ئىچىدە پەيغەمبەر مۇھەممەد ﷺ غا نازىل قىلىنغان. ئۇ ئىسلام دىنىنىڭ ۋە مۇسۇلمانلار تۇرمۇشىنىڭ ئاساسى.','بۇيەردە كۆرسىتىلگەن ئۇيغۇرچىگە قىلىنغان مەنا تەرجىمەسى — ئەرەبچە ئەسلى مەتننىڭ ئورنىنى باسالمايدۇ. ھەر بىر تەرجىمە مەنىگە يېقىنلىشىدۇ، بىراق ئۇنى تولۇق ئۆز ئىچىگە ئالالمايدۇ. قۇرئان ئەرەبچە؛ قالغانلىرى ھەممىسى پەقەت يېقىنلىشىش.','بۇيەردىكىلەرنى بىر يۇلنامە دەپ قارىڭ. ئەرەبچە ئەسلىنى ئاڭلىيالايدىغان ۋە ئوقۇيالايدىغانلار راست يولدا يۈرىدۇ.','بۇ نەشىرنىڭ دىزايىنى ئاتايىلاپ ئوڭشالغان: ئەرەبچە مەتن چوڭ ۋە ئالدىدا، تەرجىمە كىچىك ۋە ئارقىدا — سۆز ۋە رۇھتا ئەسلىگە ئىمكانقەدەر يېقىن تۇرۇش ئۈچۈن.'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function apiGet(url) {
  return new Promise((resolve,reject) => {
    https.get(url,{headers:{Accept:'application/json','User-Agent':'AL-QURAN/7.0'}},res=>{
      let raw=''; res.on('data',c=>raw+=c); res.on('end',()=>{try{resolve(JSON.parse(raw))}catch(e){reject(e)}});
    }).on('error',reject);
  });
}
async function fetchRetry(url,n=4){
  for(let i=0;i<n;i++){try{return await apiGet(url)}catch(e){if(i===n-1)throw e;await new Promise(r=>setTimeout(r,1400));}}
}
function toArabicNum(n){return String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);}
function surahFile(c){return `${String(c.id).padStart(3,'0')}-${c.name_simple.replace(/[^a-zA-Z0-9]/g,'-')}.html`;}

// ── Google Fonts ─────────────────────────────────────────────────────────────
const FONT_LINKS = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">`;

const AR_FONT = `'Scheherazade New','Arabic Typesetting','Traditional Arabic',serif`;
const AR_DECO = `'Arabic Typesetting','Scheherazade New',serif`;

// Copyright-Metatag für alle Seiten (nur in HTML-Quelle, nicht sichtbar)
const COPYRIGHT_META = `  <meta name="author" content="KX KroniX Tech">
  <meta name="copyright" content="KX Books · AL-QURAN Digital Edition · KX KroniX Tech. Alle Rechte vorbehalten.">
  <meta name="generator" content="KX Books · AL-QURAN Digital Edition · KX KroniX Tech">  <meta name="publisher" content="KX Books by KX KroniX Tech">`;

// ── Zierband ──────────────────────────────────────────────────────────────────
const GEO = `
.gb{height:18px;
  background-image:
    repeating-linear-gradient(60deg,transparent,transparent 5px,rgba(192,155,60,.08) 5px,rgba(192,155,60,.08) 6px),
    repeating-linear-gradient(-60deg,transparent,transparent 5px,rgba(192,155,60,.08) 5px,rgba(192,155,60,.08) 6px);
  background-size:12px 18px;
  border-top:1px solid rgba(192,155,60,.35);
  border-bottom:1px solid rgba(192,155,60,.22);}`;

// ── Pergament-Hintergrund (entfernt — PNG wird auf .page-wrap gesetzt) ────────
const PAGE_BG = ``;

// ── Header-CSS für Intro/Index-Seiten ────────────────────────────────────────
function pageHeaderCSS(){return `
.ph{background:#122e16;border-bottom:2px solid rgba(140,102,14,.3);position:relative;overflow:hidden}
.ph-bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.ph-g1,.ph-g2{height:14px;background-image:
  repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.1) 4px,rgba(192,155,60,.1) 5px),
  repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.1) 4px,rgba(192,155,60,.1) 5px);
  background-size:10px 14px;}
.ph-g1{border-bottom:1px solid rgba(140,102,14,.22)}
.ph-g2{border-top:1px solid rgba(140,102,14,.22)}
.ph-in{padding:28px 24px 24px;text-align:center;position:relative;z-index:2}
.ph-rub{font-family:${AR_DECO};font-size:1.4rem;color:rgba(192,155,60,.55);direction:rtl;display:block;margin-bottom:8px}
.ph-ar{font-family:${AR_DECO};font-size:2rem;color:#c9a84c;direction:rtl;line-height:1.5;display:block}
.ph-hr{width:60px;height:1px;background:rgba(192,155,60,.28);margin:10px auto}
.ph-sub{font-family:${AR_DECO};font:.58rem/1 sans-serif;color:rgba(192,155,60,.32);letter-spacing:.22em;text-transform:uppercase;display:block}`;}

function pageHeader(arText, sub){
  const bgSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 260" class="ph-bg" aria-hidden="true">
<g fill="none" stroke="rgba(192,155,60,0.04)" stroke-width="0.7">
<ellipse cx="450" cy="130" rx="430" ry="118"/><ellipse cx="450" cy="130" rx="310" ry="82"/>
<ellipse cx="450" cy="130" rx="190" ry="50"/><ellipse cx="450" cy="130" rx="88" ry="24"/>
<line x1="450" y1="12" x2="450" y2="248"/><line x1="32" y1="130" x2="868" y2="130"/>
</g></svg>`;
  return `<div class="ph">
  ${bgSVG}
  <div class="ph-g1"></div>
  <div class="ph-in">
    <span class="ph-rub">۞</span>
    <span class="ph-ar">${arText}</span>
    <div class="ph-hr"></div>
    ${sub ? `<span class="ph-sub">${sub}</span>` : ''}
  </div>
  <div class="ph-g2"></div>
</div>`;}

// ── KX Books Footer-Zeile ───────────────────────────────────────────────────────
const KX_FOOTER = `<div class="kx-copy">KX Books · ein Produkt von KX KroniX Tech · Alle Rechte vorbehalten</div>`;
const KX_CSS = `.kx-copy{font:.42rem sans-serif;color:rgba(192,155,60,.12);text-align:center;padding:6px 20px;letter-spacing:.08em}`;

// ════════════════════════════════════════════════════
//  HAUPT-PORTAL-COVER
// ════════════════════════════════════════════════════
function mainCoverHTML(){
  const links = TRANSLATIONS.map(t=>
    `<a href="Übersetzungen/${t.name}/intro.html" class="li">${t.titleNative}</a>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="ar"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · AL-QURAN Digital Edition</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;}
body{background:#1a3a1e;}
a.cv{display:block;width:100%;height:100vh;}
a.cv img{width:100%;height:100%;object-fit:contain;display:block;}
</style></head><body>
<a class="cv" href="Übersetzungen/Deutsch/intro.html">
  <img src="../Cover.png" alt="Cover">
</a>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  RÜCKSEITE
// ════════════════════════════════════════════════════
function backCoverHTML(t){
  return `<!DOCTYPE html>
<html lang="${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rückseite · القرآن الكريم</title>
${COPYRIGHT_META}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;height:100%;}
body{background:#000;}
a.bc{display:block;width:100%;height:100vh;}
a.bc img{width:100%;height:100%;object-fit:contain;display:block;}
.nav-b{position:fixed;top:14px;left:18px;font:.6rem sans-serif;color:rgba(192,155,60,.45);text-decoration:none;letter-spacing:.06em;z-index:10;}
.nav-b:hover{color:#c9a84c;}
</style></head><body>
<a class="bc" href="intro.html">
  <img src="../../../Back.png" alt="Rückseite">
</a>
<a class="nav-b" href="intro.html">← Vorwort</a>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  VORWORT
// ════════════════════════════════════════════════════
function introHTML(t){
  const body = (INTRO_BODY[t.lang]||INTRO_BODY.de).map(p=>`<p>${p}</p>`).join('\n');
  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.introTitle} · القرآن الكريم</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a3a1e;color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}
nav{background:rgba(15,36,18,.92);height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.28);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.48);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.95)}
nav .orn{font-family:${AR_DECO};font-size:1rem;color:rgba(192,155,60,.28)}
nav .sp{flex:1}
main{flex:1;min-height:0;background:url('../../../Vorwort.png') top center/contain no-repeat;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.intro-c{width:min(calc((100vh - 130px)*0.64),90vw);padding:5vh 5% 40px;}
h2{font-size:.92rem;font-weight:600;color:#f0e6c0;padding-bottom:10px;border-bottom:1px solid rgba(192,155,60,.22)}
p{font-size:.82rem;font-weight:400;line-height:1.8;color:rgba(240,230,192,.9);margin:1em 0;hyphens:none;-webkit-hyphens:none}
.bismi-box{margin:52px 0 14px;border:1px solid rgba(130,92,8,.28);background:#e8dcc0;position:relative}
.bismi-in{border:1px solid rgba(130,92,8,.12);margin:5px;padding:0}
.bismi-geo{height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px);background-size:8px 10px;border-bottom:1px solid rgba(130,92,8,.16)}
.bismi-geo-b{height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px);background-size:8px 10px;border-top:1px solid rgba(130,92,8,.16)}
.bismi-txt{display:block;text-align:center;font-family:${AR_FONT};font-size:1.6rem;color:#c9a84c;direction:rtl;line-height:1.7;padding:16px 14px 8px}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.82rem;color:rgba(90,58,5,.62);padding:0 14px 20px;font-style:italic}
.cta{text-align:center;margin-top:16px}
.cta a{display:inline-flex;align-items:center;gap:14px;padding:16px 60px;background:#122e16;color:#c9a84c;font:.74rem sans-serif;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;border:1.5px solid rgba(130,92,8,.46);border-top:2px solid rgba(192,155,60,.4);transition:all .3s}
.cta a:hover{background:#1a3e1e;border-color:#c9a84c;letter-spacing:.36em}
.cta-orn{color:rgba(192,155,60,.4);font-size:.8rem;font-family:${AR_DECO}}
footer{background:#122e16;border-top:2px solid rgba(130,92,8,.2);padding:0}
.ft-geo{height:11px;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px);background-size:10px 11px;border-bottom:1px solid rgba(130,92,8,.18)}
.ft-in{padding:10px 22px;text-align:center}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.18);font-style:italic;display:block;margin-bottom:4px}
${KX_CSS}
</style></head><body>
<nav>
  <span class="orn">۞</span>
  <a href="../../cover.html">← Cover</a>
  <span class="sp"></span>
  <a href="back-cover.html">Rückseite →</a>
</nav>
<main>
<div class="intro-c">
  <h2>${t.introTitle}</h2>
  ${body}
  <div class="bismi-box">
    <div class="bismi-in">
      <span class="bismi-txt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>      <span class="bismi-tr">${BISMI_TR[t.lang]||BISMI_TR.de}</span>    </div>
  </div>
  <div class="cta">
    <a href="index.html">
      <span class="cta-orn">۞</span>${t.readBtn}<span class="cta-orn">۞</span>
    </a>
  </div>
</div>
</main>
<footer>
  <div class="ft-geo"></div>
  <div class="ft-in">
    <span class="ft-note">${DISC[t.lang]||DISC.de}</span>
    ${KX_FOOTER}
  </div>
</footer>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  INHALTSVERZEICHNIS
// ════════════════════════════════════════════════════
function indexHTML(t,chapters){
  const rows = chapters.map(c=>{
    const tn = c.translated_name?c.translated_name.name:'';
    return `<a href="suren/${surahFile(c)}" class="row">
  <span class="rn">${String(c.id).padStart(3,'0')}</span>
  <span class="ra">${c.name_arabic}</span>
  <span class="ri"><span class="rs">${c.name_simple}</span>${tn?`<span class="rt">${tn}</span>`:''}</span>
  <span class="rv">${c.verses_count}</span>
</a>`;
  }).join('\n');
  return `<!DOCTYPE html>
<html lang="${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.indexTitle} · القرآن الكريم</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a3a1e;color:#f0e6c0;font-family:'Noto Serif',serif;min-height:100vh;display:flex;flex-direction:column;}
nav{background:rgba(15,36,18,.92);height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.28);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.48);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.95)}
nav .orn{font-family:${AR_DECO};font-size:1rem;color:rgba(192,155,60,.28)}
nav .sp{flex:1}
.list{flex:1;min-height:0;background:url('../../../Inhalsangabe.png') top center/contain no-repeat;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{width:min(calc((100vh - 130px)*0.56),86vw);padding-top:13vh;}
.row{display:flex;align-items:center;gap:16px;padding:16px 12px;border-bottom:1px solid rgba(130,92,8,.12);text-decoration:none;color:#1a0c00;transition:background .18s}
.row:first-child{border-top:1px solid rgba(130,92,8,.12)}
.row:hover{background:rgba(130,92,8,.06)}
.rn{font:.7rem sans-serif;color:rgba(130,92,8,.55);min-width:28px;font-variant-numeric:tabular-nums}
.ra{font-family:${AR_FONT};font-size:2rem;color:#8a6a18;min-width:96px;text-align:right;direction:rtl}
.ri{flex:1}
.rs{display:block;font-size:1.05rem;color:#2a1200}
.rt{display:block;font-size:.84rem;color:#6a5010;margin-top:3px;font-weight:400}
.rv{font:.6rem sans-serif;color:rgba(130,92,8,.3);min-width:24px;text-align:right}
footer{background:#122e16;border-top:2px solid rgba(130,92,8,.2);padding:0}
.ft-geo{height:11px;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px);background-size:10px 11px;border-bottom:1px solid rgba(130,92,8,.18)}
.ft-in{padding:10px 22px;text-align:center}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.18);font-style:italic;display:block;margin-bottom:4px}
footer{flex-shrink:0}
${KX_CSS}
</style></head><body>
<nav>
  <span class="orn">۞</span>
  <a href="intro.html">← ${t.introTitle}</a>
  <span class="sp"></span>
  <a href="back-cover.html">Rückseite →</a>
</nav>
<main class="list"><div class="list-rows">${rows}</div></main>
<footer>
  <div class="ft-geo"></div>
  <div class="ft-in">
    <span class="ft-note">${DISC[t.lang]||DISC.de}</span>
    ${KX_FOOTER}
  </div>
</footer>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  SURA-SEITE
//  – KEIN top nav
//  – KEIN Sprach-Picker
//  – Zentrierte, kompakte Vor/Zurück-Navigation
//  – Sprache im Center-Button
// ════════════════════════════════════════════════════
function surahCSS(dir){
  const align = dir==='rtl'?'right':'left';
  return `
:root{--gold:#c9a84c;--ink:#f0e6c0;--tr:rgba(240,230,192,.85);--rule:rgba(201,168,76,.3)}
*{margin:0;padding:0;box-sizing:border-box}
body{color:var(--ink);background:#1a3a1e;min-height:100vh;overflow-x:hidden;display:flex;flex-direction:column;}

/* ── Sura-Header ── */
.sh{
  background:rgba(15,36,18,.55);
  border-bottom:2px solid rgba(130,92,8,.35);
  text-align:center;position:relative;
  flex-shrink:0;
}
.sh-g1,.sh-g2{height:12px;background-image:
  repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.18) 4px,rgba(192,155,60,.18) 5px),
  repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.18) 4px,rgba(192,155,60,.18) 5px);
  background-size:10px 12px;position:relative;z-index:3}
.sh-g1{border-bottom:1px solid rgba(130,92,8,.4)}
.sh-g2{border-top:1px solid rgba(130,92,8,.4)}
.sh-in{padding:24px 24px 20px;position:relative;z-index:2;text-align:center}
.sh-rub{font-family:${AR_DECO};font-size:1.8rem;color:rgba(192,155,60,.72);direction:rtl;display:block;margin-bottom:12px}
/* Cartouche: sauberer Rahmen um Suren-Name, vollständig im Header */
.sh-crtt{
  display:inline-block;position:relative;
  padding:12px 48px;margin:0 auto;
}
.sh-crtt::before{
  content:'';position:absolute;inset:0;
  border:1.5px solid rgba(192,155,60,.65);
  background:rgba(192,155,60,.04);
}
.sh-crtt::after{
  content:'';position:absolute;inset:5px;
  border:0.5px solid rgba(192,155,60,.22);
}
.sh-name{font-family:${AR_DECO};font-size:4.6rem;color:#c9a84c;direction:rtl;line-height:1.2;display:block;text-shadow:0 2px 40px rgba(192,155,60,.2);position:relative;z-index:3}
.sh-meta{font-family:${AR_DECO};font-size:.84rem;color:rgba(192,155,60,.52);display:block;margin-top:16px}

/* ── Bismillah ── */
.bismi-area{background:#e8dcc0;border-bottom:1px solid rgba(130,92,8,.18)}
.bismi-geo,.bismi-geo-b{height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px);background-size:8px 10px}
.bismi-geo{border-bottom:1px solid rgba(130,92,8,.16)}
.bismi-geo-b{border-top:1px solid rgba(130,92,8,.16)}
.bismi-txt{
  display:block;text-align:center;padding:32px 24px;
  font-family:${AR_FONT};
  font-size:2.4rem;color:#5a3e00;direction:rtl;line-height:2;
}

/* ── Seiten-Inhalt ── */
.page-wrap{
  flex:1;
  background:url('../../../../Suren.png') top center/contain no-repeat;
  display:flex;flex-direction:column;align-items:center;
  overflow-y:auto;
  min-height:0;
  position:relative;
}
.verses{width:min(calc((100vh - 270px)*0.52),82vw);padding:4vh 0 60px;box-sizing:border-box;}
.verse{padding:28px 0 22px;border-bottom:1px solid var(--rule)}
.verse:last-child{border-bottom:none}

/* ── Arabischer Vers ── */
.ar{
  font-family:${AR_FONT};
  font-size:3.4rem;line-height:2.8;
  color:#b8922a;direction:rtl;text-align:center;
}

/* ── Vers-Trennzeichen ── */
.vd{
  display:flex;align-items:center;justify-content:center;gap:0;
  margin:36px 0 28px;
  user-select:none;
}
.vd::before,.vd::after{
  content:'';display:block;width:80px;height:1px;
  background:linear-gradient(to right,transparent,rgba(130,92,8,.22));
}
.vd::after{background:linear-gradient(to left,transparent,rgba(130,92,8,.22))}
.vd span{display:block;width:6px;height:6px;border-radius:50%;background:rgba(130,92,8,.22);margin:0 14px}

/* ── Übersetzung ── */
.tr{
  font-family:'Noto Serif',Georgia,serif;
  font-size:1rem;font-weight:400;line-height:1.9;
  color:rgba(35,16,0,.85);direction:${dir};text-align:${align};
  hyphens:none;-webkit-hyphens:none;
  padding:10px 20px;
  border-${dir==='rtl'?'right':'left'}:2px solid rgba(130,92,8,.28);
  margin-top:6px;
}

/* ═══ UNTERE NAVIGATION: Grün, grid 1fr auto 1fr ═══ */
.bot-nav{
  flex-shrink:0;
  background:#122e16;
  border-top:2px solid rgba(130,92,8,.28);
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:stretch;
  min-height:64px;
}
.bn{
  padding:16px 22px;
  color:rgba(192,155,60,.58);
  text-decoration:none;
  font-family:${AR_DECO};
  font-size:1.05rem;
  display:flex;align-items:center;gap:8px;
  transition:color .25s,background .25s;
  overflow:hidden;
}
.bn:hover{color:#c9a84c;background:rgba(130,92,8,.12)}
.bn-p{justify-content:flex-end;border-right:1px solid rgba(130,92,8,.22);padding-right:28px}
.bn-n{justify-content:flex-start;border-left:1px solid rgba(130,92,8,.22);padding-left:28px}
.bn-ghost{display:block;background:#122e16}
.bn-c{
  padding:14px 28px;
  display:flex;align-items:center;justify-content:center;
  text-decoration:none;transition:background .25s;
  border-left:1px solid rgba(130,92,8,.22);
  border-right:1px solid rgba(130,92,8,.22);
  min-width:130px;
}
.bn-c:hover{background:rgba(130,92,8,.12)}
.bn-ix{font:.56rem sans-serif;color:rgba(192,155,60,.45);letter-spacing:.22em;text-transform:uppercase}

@media(max-width:600px){.ar{font-size:2.1rem}.sh-name{font-size:3.2rem}.verses{padding:10px 20px 70px}.bn{font-size:.88rem;padding:13px 12px}.bn-c{min-width:90px;padding:10px 14px}}
`;}

function surahHTML(chapter, verses, arabicMap, t, chapters){
  const hasBismi = chapter.id!==1 && chapter.id!==9;
  const bismi = hasBismi?`<div class="bismi-area">
  <div class="bismi-geo"></div>
  <span class="bismi-txt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
  <div class="bismi-geo-b"></div>
</div>`:'';

  const prev = chapters.find(c=>c.id===chapter.id-1)||null;
  const next = chapters.find(c=>c.id===chapter.id+1)||null;

  const verseBlocks = verses.map(v=>{
    const num   = v.verse_key.split(':')[1];
    const arNum = toArabicNum(num);
    const arTxt = arabicMap[v.verse_key]||'';
    const raw   = (v.translations&&v.translations[0])?v.translations[0].text:'';
    const trans = raw.replace(/<sup[^>]*>.*?<\/sup>/gi,'').replace(/<[^>]+>/g,'').trim()||'—';
    return `<div class="verse" id="v${num}">
  <div class="ar">${arTxt} ﴿${arNum}﴾</div>
  <div class="vd"><span></span></div>
  <div class="tr">${trans}</div>
</div>`;
  }).join('\n');

  const cntAr  = toArabicNum(chapter.verses_count);

  // ── Navigation ──
  const prevBtn = prev
    ? `<a href="${surahFile(prev)}" class="bn bn-p">← ${prev.name_arabic}</a>`
    : `<span class="bn-ghost"></span>`;

  const nextBtn = next
    ? `<a href="${surahFile(next)}" class="bn bn-n">${next.name_arabic} →</a>`
    : `<span class="bn-ghost"></span>`;

  // ── Sura-Header ──
  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="ltr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${chapter.name_arabic} · ${chapter.name_simple} · ${t.titleNative}</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>${surahCSS(t.dir)}</style>
</head><body>
<div class="sh">
  <div class="sh-g1"></div>
  <div class="sh-in">
    <span class="sh-rub">۞</span>
    <div class="sh-crtt">
      <span class="sh-name">${chapter.name_arabic}</span>
    </div>
    <span class="sh-meta">${chapter.name_simple}${chapter.translated_name ? ' · ' + chapter.translated_name.name : ''}</span>
  </div>
  <div class="sh-g2"></div>
</div>
${bismi}
<div class="page-wrap">
<main class="verses">
${verseBlocks}
</main>
</div>
<div class="bot-nav">
  ${prevBtn}
  <a href="../index.html" class="bn-c">
    <span class="bn-ix">${t.indexTitle}</span>
  </a>
  ${nextBtn}
</div>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  MAIN  (v7.1 — liest Cache aus overhaul.js wenn vorhanden)
// ════════════════════════════════════════════════════
const CACHE_DIR = path.join(BASE_DIR, 'cache');

function loadFromCache(lang, surahId) {
  const f = path.join(CACHE_DIR, lang, `${surahId}.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  return null;
}

async function main(){
  const hasCacheMeta = fs.existsSync(path.join(CACHE_DIR,'_chapters.json'));
  const hasCacheAr   = fs.existsSync(path.join(CACHE_DIR,'_arabic.json'));

  console.log('\n  ╔══════════════════════════════════════════╗');
  console.log('  ║   AL-QURAN · Redesign  v 7 . 1           ║');
  console.log(hasCacheMeta
    ? '  ║   Modus: lokaler Cache (overhaul.js)     ║'
    : '  ║   Modus: Live-API (api.quran.com)        ║');
  console.log('  ╚══════════════════════════════════════════╝\n');

  process.stdout.write('  Kapitel-Metadaten … ');
  let chapters;
  if (hasCacheMeta) {
    chapters = JSON.parse(fs.readFileSync(path.join(CACHE_DIR,'_chapters.json'),'utf8'));
  } else {
    const ch = await fetchRetry('https://api.quran.com/api/v4/chapters?language=de');
    chapters = ch.chapters;
  }
  console.log(`${chapters.length} ✓`);

  process.stdout.write('  Arabischer Text (Uthmani) … ');
  let arabicMap = {};
  if (hasCacheAr) {
    arabicMap = JSON.parse(fs.readFileSync(path.join(CACHE_DIR,'_arabic.json'),'utf8'));
  } else {
    const ar = await fetchRetry('https://api.quran.com/api/v4/quran/verses/uthmani');
    for(const v of ar.verses) arabicMap[v.verse_key]=v.text_uthmani;
  }
  console.log(`${Object.keys(arabicMap).length} Verse ✓\n`);

  fs.writeFileSync(path.join(BASE_DIR,'cover.html'), mainCoverHTML(), 'utf8');
  console.log('  cover.html ✓\n');

  for(const t of TRANSLATIONS){
    const tDir     = path.join(OUT_DIR,t.name);
    const surenDir = path.join(tDir,'suren');
    if(!fs.existsSync(tDir))      fs.mkdirSync(tDir,     {recursive:true});
    if(!fs.existsSync(surenDir))  fs.mkdirSync(surenDir,  {recursive:true});
    fs.writeFileSync(path.join(tDir,'back-cover.html'), backCoverHTML(t), 'utf8');
    fs.writeFileSync(path.join(tDir,'intro.html'), introHTML(t),          'utf8');
    fs.writeFileSync(path.join(tDir,'index.html'), indexHTML(t,chapters), 'utf8');
    process.stdout.write(`  ${t.name}: intro+index ✓   Suren … `);
    let n=0;
    for(const c of chapters){
      // Cache bevorzugen (aus overhaul.js), sonst Live-API
      const cached = loadFromCache(t.lang, c.id);
      let verses;
      if (cached) {
        verses = cached;
      } else {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${c.id}?translations=${t.transId}&per_page=300&fields=verse_key`;
        const data = await fetchRetry(url);
        verses = data.verses || [];
      }
      const html = surahHTML(c, verses, arabicMap, t, chapters);
      fs.writeFileSync(path.join(surenDir,surahFile(c)),html,'utf8');
      n++;
      if(n%25===0) process.stdout.write('.');
    }
    console.log(` ${n} ✓`);
  }
  console.log('\n  ✅  Redesign v7.1 abgeschlossen\n');
}

main().catch(e=>{console.error('\n  ✗',e.message);process.exit(1);});
