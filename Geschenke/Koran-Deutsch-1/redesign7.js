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

const AR_FONT = `'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif`;
const AR_DECO = `'Arabic Typesetting','Scheherazade New',serif`;

// Copyright-Metatag für alle Seiten (nur in HTML-Quelle, nicht sichtbar)
const COPYRIGHT_META = `  <meta name="author" content="KX KroniX Tech">
  <meta name="copyright" content="KX Books · AL-QURAN Digital Edition · KX KroniX Tech. Alle Rechte vorbehalten.">
  <meta name="generator" content="KX Books · AL-QURAN Digital Edition · KX KroniX Tech">  <meta name="publisher" content="KX Books by KX KroniX Tech">`;

// ════════════════════════════════════════════════════
//  SHAMSA — islamisches Sonnen-Medaillon
//  Rein kreisförmig: Ringe + Strahlen + Punkte
//  KEINE Polygone → kein Stern, kein Hexagramm
// ════════════════════════════════════════════════════
function shamsaSVG(a=0.18){
  const g  = v=>`rgba(192,155,60,${(a*v).toFixed(3)})`;
  const gf = v=>`rgba(192,155,60,${(a*v*0.38).toFixed(3)})`;

  // 24 Strahlen à 15°
  const rays=[];
  for(let i=0;i<24;i++){
    const ang=i*Math.PI/12;
    rays.push(`<line x1="${(28*Math.cos(ang)).toFixed(1)}" y1="${(28*Math.sin(ang)).toFixed(1)}" x2="${(137*Math.cos(ang)).toFixed(1)}" y2="${(137*Math.sin(ang)).toFixed(1)}"/>`);
  }

  // 8 Blüten-Kreise bei r=107 (N/S/E/W + Diagonalen)
  const petals=[];
  for(let i=0;i<8;i++){
    const ang=i*Math.PI/4;
    petals.push(`<circle cx="${(107*Math.cos(ang)).toFixed(1)}" cy="${(107*Math.sin(ang)).toFixed(1)}" r="12" fill="${gf(1.8)}" stroke="${g(0.7)}" stroke-width="0.7"/>`);
  }

  // 16 kleine Punkte bei r=151
  const dots16=[];
  for(let i=0;i<16;i++){
    const ang=i*Math.PI/8;
    dots16.push(`<circle cx="${(151*Math.cos(ang)).toFixed(1)}" cy="${(151*Math.sin(ang)).toFixed(1)}" r="3" fill="${g(0.55)}" stroke="none"/>`);
  }

  // 8 mittlere Punkte bei r=168, zwischen den Hauptachsen
  const dots8=[];
  for(let i=0;i<8;i++){
    const ang=i*Math.PI/4+Math.PI/8;
    dots8.push(`<circle cx="${(168*Math.cos(ang)).toFixed(1)}" cy="${(168*Math.sin(ang)).toFixed(1)}" r="4.5" fill="${g(0.38)}" stroke="none"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" class="shamsa" aria-hidden="true">
<g fill="none">
  <!-- Äußere Ringrahmen -->
  <circle r="190" stroke="${g(1)}"    stroke-width="1.5"/>
  <circle r="177" stroke="${g(0.18)}" stroke-width="0.32" stroke-dasharray="2,9"/>
  <circle r="162" stroke="${g(0.65)}" stroke-width="0.88"/>
  <circle r="144" stroke="${g(0.18)}" stroke-width="0.28" stroke-dasharray="1,5"/>
  <circle r="126" stroke="${g(0.58)}" stroke-width="0.78"/>
  <!-- Mittlere Ringe -->
  <circle r="70"  stroke="${g(0.52)}" stroke-width="0.75"/>
  <circle r="50"  stroke="${g(0.28)}" stroke-width="0.42" stroke-dasharray="1,4"/>
  <circle r="33"  stroke="${g(0.52)}" stroke-width="0.7"/>
  <circle r="20"  stroke="${g(0.6)}"  stroke-width="0.88" fill="${gf(0.7)}"/>
  <!-- 24 Strahlen -->
  <g stroke="${g(0.28)}" stroke-width="0.38">${rays.join('')}</g>
  <!-- 8 Blüten -->
  ${petals.join('')}
  <!-- 16 kleine Punkte -->
  ${dots16.join('')}
  <!-- 8 mittlere Punkte -->
  ${dots8.join('')}
  <!-- Zentrum -->
  <circle r="9"  fill="${g(1)}" stroke="${g(1)}" stroke-width="1.2"/>
  <circle r="3.5" fill="${gf(3.5)}" stroke="none"/>
</g>
</svg>`;
}

// ── Zierband ──────────────────────────────────────────────────────────────────
const GEO = `
.gb{height:18px;
  background-image:
    repeating-linear-gradient(60deg,transparent,transparent 5px,rgba(192,155,60,.08) 5px,rgba(192,155,60,.08) 6px),
    repeating-linear-gradient(-60deg,transparent,transparent 5px,rgba(192,155,60,.08) 5px,rgba(192,155,60,.08) 6px);
  background-size:12px 18px;
  border-top:1px solid rgba(192,155,60,.35);
  border-bottom:1px solid rgba(192,155,60,.22);}`;

// ── Pergament-Hintergrund (ohne Ecken-CSS) ────────────────────────────────────
const PAGE_BG = `
body{
  background-color:#f3ecca;
  background-image:
    repeating-linear-gradient(45deg,rgba(160,122,34,.03) 0,rgba(160,122,34,.03) 1px,transparent 0,transparent 50%),
    repeating-linear-gradient(-45deg,rgba(160,122,34,.03) 0,rgba(160,122,34,.03) 1px,transparent 0,transparent 50%);
  background-size:24px 24px;}`;

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
    `<a href="Übersetzungen/${t.name}/cover.html" class="li">${t.titleNative}</a>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="ar"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · AL-QURAN Digital Edition</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;min-height:100vh;background:#091a0c;display:flex;align-items:center;justify-content:center;overflow:hidden}
.book{
  height:min(700px,88vh);width:min(467px,calc(min(700px,88vh)*2/3),90vw);
  background:radial-gradient(ellipse 90% 75% at 50% 38%,#183618 0%,#0e2010 50%,#060c07 100%);
  position:relative;overflow:hidden;z-index:1;
  border:2px solid rgba(192,155,60,.8);
  box-shadow:0 30px 80px rgba(0,0,0,.7);
}
.book::before{content:'';position:absolute;inset:10px;border:1px solid rgba(192,155,60,.28);pointer-events:none;z-index:8}
.book::after{content:'';position:absolute;inset:16px;border:0.5px solid rgba(192,155,60,.12);pointer-events:none;z-index:8}
.shamsa{position:absolute;width:92%;height:92%;left:50%;top:44%;transform:translate(-50%,-50%);z-index:1}
.cnt{
  position:absolute;top:46px;left:12px;right:12px;bottom:48px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  z-index:4;text-align:center;
}
.bsm{font-family:${AR_DECO};font-size:.88rem;color:rgba(192,155,60,.26);direction:rtl;display:block;margin-bottom:6px}
.div{color:rgba(192,155,60,.22);font-size:.5rem;letter-spacing:6px;margin:6px 0;display:block}
.ttl{font-family:${AR_DECO};font-size:clamp(3rem,14vw,5.5rem);color:#c9a84c;direction:rtl;line-height:1.2;display:block;text-shadow:0 2px 40px rgba(192,155,60,.12)}
.lbl{font:.48rem/1 sans-serif;color:rgba(192,155,60,.2);letter-spacing:.3em;text-transform:uppercase;margin:12px 0 8px;display:block}
.langs{display:flex;flex-wrap:wrap;justify-content:center;gap:3px 10px;max-width:90%}
.li{color:rgba(192,155,60,.3);text-decoration:none;font:.52rem sans-serif;padding:2px 5px;transition:color .2s}
.li:hover{color:rgba(192,155,60,.88)}
</style></head><body>
<div class="book">
  <div class="cnt">
    <span class="bsm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
    <span class="div">─ ۞ ─</span>
    <span class="ttl">القرآن<br>الكريم</span>
    <span class="div">─ ۞ ─</span>
    <span class="lbl">Sprache wählen</span>
    <div class="langs">${links}</div>
  </div>
</div>
</body></html>`;
}

// ════════════════════════════════════════════════════
//  SPRACH-COVER
// ════════════════════════════════════════════════════
function langCoverHTML(t){
  return `<!DOCTYPE html>
<html lang="${t.lang}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>القرآن الكريم · ${t.titleNative}</title>
${COPYRIGHT_META}
${FONT_LINKS}
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;min-height:100vh;background:#091a0c;display:flex;align-items:center;justify-content:center;overflow:hidden}

.book{
  height:min(700px,88vh);width:min(467px,calc(min(700px,88vh)*2/3),90vw);
  position:relative;overflow:hidden;z-index:1;
  border:2px solid rgba(192,155,60,.8);
  box-shadow:0 30px 80px rgba(0,0,0,.7);
}
.book-bg{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 95% 80% at 50% 35%,#1d4020 0%,#112615 38%,#0a1a0c 68%,#060d07 100%);
  z-index:0;
}
.book::before{content:'';position:absolute;inset:10px;border:1px solid rgba(192,155,60,.28);pointer-events:none;z-index:8}
.book::after{content:'';position:absolute;inset:15px;border:1px solid rgba(192,155,60,.14);pointer-events:none;z-index:8}

/* Shamsa füllt den ganzen Buchdeckel */
.shamsa{position:absolute;width:88%;height:88%;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1}
.cover-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:8}

/* Zone 1: Bismillah */
.z-bismi{position:absolute;top:50px;left:20px;right:20px;text-align:center;z-index:6}
.bismi-line{font-family:${AR_DECO};font-size:.95rem;color:rgba(192,155,60,.32);direction:rtl;display:block;margin-bottom:6px}
.bismi-rule{display:flex;align-items:center;justify-content:center;gap:8px;color:rgba(192,155,60,.18);font-size:.48rem;letter-spacing:4px}
.bismi-rule::before,.bismi-rule::after{content:'──';letter-spacing:1px}

/* Zone 2: Titel */
.z-title{position:absolute;left:12px;right:12px;top:50%;transform:translateY(-58%);text-align:center;z-index:6}
.ttl{font-family:${AR_DECO};font-size:clamp(3.2rem,15vw,5.8rem);color:#c9a84c;direction:rtl;line-height:1.22;display:block;text-shadow:0 0 60px rgba(192,155,60,.08),0 2px 0 rgba(0,0,0,.35)}
.div-orn{color:rgba(192,155,60,.28);font-size:.55rem;letter-spacing:7px;display:block;margin:10px 0}

/* Zone 3: Sprach-Panel */
.z-lang{
  position:absolute;bottom:72px;left:20px;right:20px;z-index:6;
  border-top:1px solid rgba(192,155,60,.2);border-bottom:1px solid rgba(192,155,60,.15);
  padding:10px 14px;background:rgba(0,0,0,.18);
}
.lang-name{display:block;text-align:center;font:.72rem/1 sans-serif;color:rgba(192,155,60,.5);letter-spacing:.32em;text-transform:uppercase;margin-bottom:6px}
.lang-disc{display:block;text-align:center;font:.45rem/1.7 sans-serif;color:rgba(192,155,60,.2);font-style:italic}

/* Zone 4: Öffnen-Button */
.z-btn{position:absolute;bottom:0;left:0;right:0;z-index:9}
.open-btn{
  display:flex;align-items:center;justify-content:center;gap:14px;padding:17px 0;
  background:#0d2810;border-top:2px solid rgba(192,155,60,.55);
  color:#c9a84c;text-decoration:none;transition:all .3s;
}
.btn-orn{font-size:.85rem;color:rgba(192,155,60,.38);transition:color .3s;font-family:${AR_DECO}}
.btn-txt{font:.72rem sans-serif;letter-spacing:.36em;text-transform:uppercase}
.open-btn:hover{background:#173d1b;border-top-color:rgba(192,155,60,.9)}
.open-btn:hover .btn-orn{color:rgba(192,155,60,.8)}


.back{position:absolute;top:4px;left:50%;transform:translateX(-50%);font:.38rem sans-serif;color:rgba(192,155,60,.07);text-decoration:none;z-index:10;white-space:nowrap;transition:color .2s;letter-spacing:.08em}
.back:hover{color:rgba(192,155,60,.4)}
</style></head><body>
<div class="book">
  <div class="book-bg"></div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" class="cover-frame" aria-hidden="true" preserveAspectRatio="none">
    <g fill="none" stroke="rgba(192,155,60,0.5)" stroke-width="0.7">
      <rect x="8" y="8" width="184" height="284"/>
      <rect x="14" y="14" width="172" height="272"/>
      <path d="M8,30 L8,8 L30,8" stroke-width="1.4"/>
      <path d="M170,8 L192,8 L192,30" stroke-width="1.4"/>
      <path d="M8,270 L8,292 L30,292" stroke-width="1.4"/>
      <path d="M170,292 L192,292 L192,270" stroke-width="1.4"/>
      <path d="M14,36 L14,14 L36,14" stroke-width="0.6"/>
      <path d="M164,14 L186,14 L186,36" stroke-width="0.6"/>
      <path d="M14,264 L14,286 L36,286" stroke-width="0.6"/>
      <path d="M164,286 L186,286 L186,264" stroke-width="0.6"/>
      <line x1="100" y1="8" x2="100" y2="14"/>
      <line x1="100" y1="286" x2="100" y2="292"/>
      <line x1="8" y1="150" x2="14" y2="150"/>
      <line x1="186" y1="150" x2="192" y2="150"/>
    </g>
    <g fill="rgba(192,155,60,0.65)" stroke="none">
      <circle cx="8" cy="8" r="3"/><circle cx="192" cy="8" r="3"/>
      <circle cx="8" cy="292" r="3"/><circle cx="192" cy="292" r="3"/>
      <polygon points="100,4 103,8 100,12 97,8"/>
      <polygon points="100,288 103,292 100,296 97,292"/>
      <polygon points="4,150 8,147 12,150 8,153"/>
      <polygon points="188,150 192,147 196,150 192,153"/>
    </g>
  </svg>

  <div class="z-bismi">
    <span class="bismi-line">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
    <span class="bismi-rule">۞</span>
  </div>

  <div class="z-title">
    <span class="ttl">القرآن<br>الكريم</span>
    <span class="div-orn">─ ─ ۞ ─ ─</span>
  </div>

  <div class="z-lang">
    <span class="lang-name">${t.titleNative}</span>
    <span class="lang-disc">${DISC[t.lang]||DISC.de}</span>
  </div>

  <div class="z-btn">
    <a href="intro.html" class="open-btn">
      <span class="btn-orn">۞</span>
      <span class="btn-txt">${t.introTitle}</span>
      <span class="btn-orn">۞</span>
    </a>
  </div>
  <a href="../../cover.html" class="back">← alle Sprachen</a>
</div>
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
${PAGE_BG}
body{color:#1a0c00;font-family:'Noto Serif',serif;min-height:100vh}
nav{background:#122e16;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.28);position:sticky;top:0;z-index:200}
nav a{color:rgba(192,155,60,.48);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.95)}
nav .orn{font-family:${AR_DECO};font-size:1rem;color:rgba(192,155,60,.28)}
nav .sp{flex:1}
${pageHeaderCSS()}
.disc-banner{background:rgba(130,92,8,.05);border-top:1px solid rgba(130,92,8,.16);border-bottom:1px solid rgba(130,92,8,.14);padding:18px 30px;text-align:center;font:.8rem/1.95 sans-serif;color:rgba(88,50,5,.72);font-style:italic}
.disc-banner strong{color:rgba(105,62,7,.92);font-style:normal}
main{max-width:min(740px,96vw);margin:72px auto 110px;padding:0 44px}
h2{font-size:1.18rem;font-weight:400;color:#3a1e00;padding-bottom:14px;border-bottom:1px solid rgba(130,92,8,.22)}
p{font-size:.96rem;font-weight:300;line-height:2.2;color:#2a1200;margin:1.7em 0}
.bismi-box{margin:52px 0 14px;border:1px solid rgba(130,92,8,.28);background:#e8dcc0;position:relative}
.bismi-in{border:1px solid rgba(130,92,8,.12);margin:5px;padding:0}
.bismi-geo{height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px);background-size:8px 10px;border-bottom:1px solid rgba(130,92,8,.16)}
.bismi-geo-b{height:10px;background-image:repeating-linear-gradient(60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px),repeating-linear-gradient(-60deg,transparent,transparent 3px,rgba(130,92,8,.07) 3px,rgba(130,92,8,.07) 4px);background-size:8px 10px;border-top:1px solid rgba(130,92,8,.16)}
.bismi-txt{display:block;text-align:center;font-family:${AR_FONT};font-size:2.4rem;color:#5a3e00;direction:rtl;line-height:1.9;padding:26px 14px 12px}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.82rem;color:rgba(90,58,5,.62);padding:0 14px 20px;font-style:italic}
.cta{text-align:center;margin-top:44px}
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
  <a href="cover.html">← ${t.titleNative}</a>
  <span class="sp"></span>
</nav>
${pageHeader('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', `${t.titleNative} · القرآن الكريم`)}
<div class="disc-banner">${DISC_LONG[t.lang]||DISC_LONG.de}</div>
<main>
  <h2>${t.introTitle}</h2>
  ${body}
  <div class="bismi-box">
    <div class="bismi-in">
      <div class="bismi-geo"></div>
      <span class="bismi-txt">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>      <span class="bismi-tr">${BISMI_TR[t.lang]||BISMI_TR.de}</span>      <div class="bismi-geo-b"></div>
    </div>
  </div>
  <div class="cta">
    <a href="index.html">
      <span class="cta-orn">۞</span>${t.readBtn}<span class="cta-orn">۞</span>
    </a>
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
${PAGE_BG}
body{color:#1a0c00;font-family:'Noto Serif',serif}
nav{background:#122e16;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.28);position:sticky;top:0;z-index:200}
nav a{color:rgba(192,155,60,.48);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s}
nav a:hover{color:rgba(192,155,60,.95)}
nav .orn{font-family:${AR_DECO};font-size:1rem;color:rgba(192,155,60,.28)}
nav .sp{flex:1}
${pageHeaderCSS()}
.list{max-width:800px;margin:24px auto 90px;padding:0 24px}
.row{display:flex;align-items:center;gap:16px;padding:16px 12px;border-bottom:1px solid rgba(130,92,8,.12);text-decoration:none;color:#1a0c00;transition:background .18s}
.row:first-child{border-top:1px solid rgba(130,92,8,.12)}
.row:hover{background:rgba(130,92,8,.06)}
.rn{font:.6rem sans-serif;color:rgba(130,92,8,.42);min-width:28px;font-variant-numeric:tabular-nums}
.ra{font-family:${AR_FONT};font-size:1.85rem;color:#8a6a18;min-width:96px;text-align:right;direction:rtl}
.ri{flex:1}
.rs{display:block;font-size:.9rem;color:#2a1200}
.rt{display:block;font-size:.7rem;color:#8a7030;margin-top:3px;font-weight:300}
.rv{font:.6rem sans-serif;color:rgba(130,92,8,.3);min-width:24px;text-align:right}
footer{background:#122e16;border-top:2px solid rgba(130,92,8,.2);padding:0}
.ft-geo{height:11px;background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px),repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.07) 4px,rgba(192,155,60,.07) 5px);background-size:10px 11px;border-bottom:1px solid rgba(130,92,8,.18)}
.ft-in{padding:10px 22px;text-align:center}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.18);font-style:italic;display:block;margin-bottom:4px}
${KX_CSS}
</style></head><body>
<nav>
  <span class="orn">۞</span>
  <a href="intro.html">← ${t.introTitle}</a>
  <span class="sp"></span>
  <a href="cover.html">${t.titleNative}</a>
</nav>
${pageHeader('القرآن الكريم', `${t.titleNative} · 114 سورة`)}
<main class="list">${rows}</main>
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
:root{--gold:#7a5800;--ink:#1a0e00;--tr:rgba(35,16,0,.82);--rule:rgba(130,92,8,.13)}
*{margin:0;padding:0;box-sizing:border-box}
${PAGE_BG}
body{color:var(--ink);min-height:100vh;overflow-x:hidden}

/* ── Sura-Header: Dunkelgrün mit Ornament-Hintergrund ── */
.sh{
  background:linear-gradient(180deg,#1c3d20 0%,#0f2412 100%);
  border-bottom:2px solid rgba(130,92,8,.35);
  text-align:center;position:relative;overflow:hidden;
}
.sh-bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.45}
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

/* ── Seiten-Rahmen: ornamentaler Rahmen um Versbereich ── */
.page-wrap{
  max-width:min(960px,96vw);margin:0 auto;
  position:relative;
  border:2px solid rgba(130,92,8,.45);
  box-shadow:0 0 0 5px rgba(243,236,202,1),0 0 0 7px rgba(130,92,8,.3),0 0 0 12px rgba(243,236,202,1),0 0 0 13px rgba(130,92,8,.15);
  margin-left:auto;margin-right:auto;
}
.pf-top,.pf-bot{
  height:13px;
  background-image:
    repeating-linear-gradient(90deg,rgba(130,92,8,.18) 0,rgba(130,92,8,.18) 1px,transparent 1px,transparent 8px),
    repeating-linear-gradient(0deg,rgba(130,92,8,.08) 0,rgba(130,92,8,.08) 1px,transparent 1px,transparent 8px);
  background-size:8px 13px;
}
.pf-top{border-bottom:1px solid rgba(130,92,8,.28)}
.pf-bot{border-top:1px solid rgba(130,92,8,.28)}
.corn{
  position:absolute;width:26px;height:26px;
  display:flex;align-items:center;justify-content:center;
  font-family:${AR_DECO};font-size:1.1rem;
  color:rgba(130,92,8,.7);background:#f3ecca;
  z-index:10;line-height:1;
}
.corn-tl{top:-13px;left:-13px}.corn-tr{top:-13px;right:-13px}
.corn-bl{bottom:-13px;left:-13px}.corn-br{bottom:-13px;right:-13px}
.verses{padding:32px 80px 110px}
.verse{padding:64px 0 50px;border-bottom:1px solid var(--rule)}
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
  font-size:.86rem;font-weight:300;line-height:1.95;
  color:rgba(35,16,0,.5);direction:${dir};text-align:${align};
  padding:8px 20px;
  border-${dir==='rtl'?'right':'left'}:2px solid rgba(130,92,8,.22);
  margin-top:4px;
}

/* ═══ UNTERE NAVIGATION: Grün, grid 1fr auto 1fr ═══ */
.bot-nav{
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" class="sh-bg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g fill="none">
      <ellipse cx="600" cy="160" rx="560" ry="148" stroke="rgba(192,155,60,0.09)" stroke-width="1"/>
      <ellipse cx="600" cy="160" rx="440" ry="110" stroke="rgba(192,155,60,0.07)" stroke-width="0.8"/>
      <ellipse cx="600" cy="160" rx="300" ry="72" stroke="rgba(192,155,60,0.06)" stroke-width="0.6"/>
      <ellipse cx="600" cy="160" rx="160" ry="38" stroke="rgba(192,155,60,0.06)" stroke-width="0.5"/>
      <line x1="600" y1="10" x2="600" y2="310" stroke="rgba(192,155,60,0.05)" stroke-width="0.6"/>
      <line x1="30" y1="160" x2="1170" y2="160" stroke="rgba(192,155,60,0.05)" stroke-width="0.6"/>
      <line x1="30" y1="10" x2="1170" y2="310" stroke="rgba(192,155,60,0.03)" stroke-width="0.5"/>
      <line x1="1170" y1="10" x2="30" y2="310" stroke="rgba(192,155,60,0.03)" stroke-width="0.5"/>
    </g>
  </svg>
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
  <span class="corn corn-tl">✦</span>
  <span class="corn corn-tr">✦</span>
  <div class="pf-top"></div>
<main class="verses">
${verseBlocks}
</main>
  <div class="pf-bot"></div>
  <span class="corn corn-bl">✦</span>
  <span class="corn corn-br">✦</span>
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
//  MAIN
// ════════════════════════════════════════════════════
async function main(){
  console.log('\n  ╔══════════════════════════════════╗');
  console.log('  ║   AL-QURAN · Redesign  v 7 . 0   ║');
  console.log('  ╚══════════════════════════════════╝\n');

  process.stdout.write('  Kapitel-Metadaten … ');
  const ch = await fetchRetry('https://api.quran.com/api/v4/chapters?language=de');
  const chapters = ch.chapters;
  console.log(`${chapters.length} ✓`);

  process.stdout.write('  Arabischer Text (Imlaei) … ');
  const ar = await fetchRetry('https://api.quran.com/api/v4/quran/verses/imlaei');
  const arabicMap = {};
  for(const v of ar.verses) arabicMap[v.verse_key]=v.text_imlaei;
  console.log(`${Object.keys(arabicMap).length} Verse ✓\n`);

  fs.writeFileSync(path.join(BASE_DIR,'cover.html'), mainCoverHTML(), 'utf8');
  console.log('  cover.html ✓\n');

  for(const t of TRANSLATIONS){
    const tDir     = path.join(OUT_DIR,t.name);
    const surenDir = path.join(tDir,'suren');
    if(!fs.existsSync(tDir))      fs.mkdirSync(tDir,     {recursive:true});
    if(!fs.existsSync(surenDir))  fs.mkdirSync(surenDir,  {recursive:true});
    fs.writeFileSync(path.join(tDir,'cover.html'), langCoverHTML(t),      'utf8');
    fs.writeFileSync(path.join(tDir,'intro.html'), introHTML(t),          'utf8');
    fs.writeFileSync(path.join(tDir,'index.html'), indexHTML(t,chapters), 'utf8');
    process.stdout.write(`  ${t.name}: cover+intro+index ✓   Suren … `);
    let n=0;
    for(const c of chapters){
      const url  = `https://api.quran.com/api/v4/verses/by_chapter/${c.id}?translations=${t.transId}&per_page=300&fields=verse_key`;
      const data = await fetchRetry(url);
      const html = surahHTML(c,data.verses||[],arabicMap,t,chapters);
      fs.writeFileSync(path.join(surenDir,surahFile(c)),html,'utf8');
      n++;
      if(n%25===0) process.stdout.write('.');
    }
    console.log(` ${n} ✓`);
  }
  console.log('\n  ✅  Redesign v7.0 abgeschlossen\n');
}

main().catch(e=>{console.error('\n  ✗',e.message);process.exit(1);});
