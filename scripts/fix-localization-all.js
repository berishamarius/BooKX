#!/usr/bin/env node
// fix-localization-all.js
// Fixes:
// 1. Quran non-German indexes: surah .rt in native language, remove dict icon, fix nav
// 2. Bible non-German indexes: fix title, switcher labels, nav text
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QURAN_DIST = path.join(ROOT, 'dist-alquran', 'Übersetzungen');
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

// ── Quran surah meanings in native languages ──────────────────────────────
// Format: [transliteration, arabic, meaning_in_lang, verse_count, filename_slug]
const SURAHS = [
  [1,'الفاتحة','Al-Fatihah',7,'001-Al-Fatihah'],
  [2,'البقرة','Al-Baqarah',286,'002-Al-Baqarah'],
  [3,'آل عمران',"Ali 'Imran",200,'003-Ali--Imran'],
  [4,'النساء','An-Nisa',176,'004-An-Nisa'],
  [5,'المائدة',"Al-Ma'idah",120,'005-Al-Ma-idah'],
  [6,'الأنعام',"Al-An'am",165,'006-Al-An-am'],
  [7,'الأعراف',"Al-A'raf",206,'007-Al-A-raf'],
  [8,'الأنفال','Al-Anfal',75,'008-Al-Anfal'],
  [9,'التوبة','At-Tawbah',129,'009-At-Tawbah'],
  [10,'يونس','Yunus',109,'010-Yunus'],
  [11,'هود','Hud',123,'011-Hud'],
  [12,'يوسف','Yusuf',111,'012-Yusuf'],
  [13,'الرعد',"Ar-Ra'd",43,'013-Ar-Ra-d'],
  [14,'إبراهيم','Ibrahim',52,'014-Ibrahim'],
  [15,'الحجر','Al-Hijr',99,'015-Al-Hijr'],
  [16,'النحل','An-Nahl',128,'016-An-Nahl'],
  [17,'الإسراء',"Al-Isra'",111,'017-Al-Isra'],
  [18,'الكهف','Al-Kahf',110,'018-Al-Kahf'],
  [19,'مريم','Maryam',98,'019-Maryam'],
  [20,'طه',"Ta-Ha",135,'020-Ta-Ha'],
  [21,'الأنبياء',"Al-Anbiya'",112,'021-Al-Anbiya'],
  [22,'الحج','Al-Hajj',78,'022-Al-Hajj'],
  [23,'المؤمنون',"Al-Mu'minun",118,'023-Al-Mu-minun'],
  [24,'النور','An-Nur',64,'024-An-Nur'],
  [25,'الفرقان','Al-Furqan',77,'025-Al-Furqan'],
  [26,'الشعراء',"Ash-Shu'ara'",227,'026-Ash-Shu-ara'],
  [27,'النمل','An-Naml',93,'027-An-Naml'],
  [28,'القصص','Al-Qasas',88,'028-Al-Qasas'],
  [29,'العنكبوت',"Al-'Ankabut",69,'029-Al-Ankabut'],
  [30,'الروم','Ar-Rum',60,'030-Ar-Rum'],
  [31,'لقمان','Luqman',34,'031-Luqman'],
  [32,'السجدة','As-Sajdah',30,'032-As-Sajdah'],
  [33,'الأحزاب','Al-Ahzab',73,'033-Al-Ahzab'],
  [34,'سبإ',"Saba'",54,'034-Saba'],
  [35,'فاطر','Fatir',45,'035-Fatir'],
  [36,'يس',"Ya-Sin",83,'036-Ya-Sin'],
  [37,'الصافات','As-Saffat',182,'037-As-Saffat'],
  [38,'ص','Sad',88,'038-Sad'],
  [39,'الزمر','Az-Zumar',75,'039-Az-Zumar'],
  [40,'غافر','Ghafir',85,'040-Ghafir'],
  [41,'فصلت','Fussilat',54,'041-Fussilat'],
  [42,'الشورى','Ash-Shura',53,'042-Ash-Shura'],
  [43,'الزخرف','Az-Zukhruf',89,'043-Az-Zukhruf'],
  [44,'الدخان','Ad-Dukhan',59,'044-Ad-Dukhan'],
  [45,'الجاثية','Al-Jathiyah',37,'045-Al-Jathiyah'],
  [46,'الأحقاف',"Al-Ahqaf",35,'046-Al-Ahqaf'],
  [47,'محمد','Muhammad',38,'047-Muhammad'],
  [48,'الفتح',"Al-Fath",29,'048-Al-Fath'],
  [49,'الحجرات','Al-Hujurat',18,'049-Al-Hujurat'],
  [50,'ق','Qaf',45,'050-Qaf'],
  [51,'الذاريات','Adh-Dhariyat',60,'051-Adh-Dhariyat'],
  [52,'الطور','At-Tur',49,'052-At-Tur'],
  [53,'النجم','An-Najm',62,'053-An-Najm'],
  [54,'القمر','Al-Qamar',55,'054-Al-Qamar'],
  [55,'الرحمن','Ar-Rahman',78,'055-Ar-Rahman'],
  [56,'الواقعة',"Al-Waqi'ah",96,'056-Al-Waqi-ah'],
  [57,'الحديد','Al-Hadid',29,'057-Al-Hadid'],
  [58,'المجادلة','Al-Mujadila',22,'058-Al-Mujadila'],
  [59,'الحشر','Al-Hashr',24,'059-Al-Hashr'],
  [60,'الممتحنة','Al-Mumtahanah',13,'060-Al-Mumtahanah'],
  [61,'الصف','As-Saf',14,'061-As-Saf'],
  [62,'الجمعة',"Al-Jumu'ah",11,'062-Al-Jumu-ah'],
  [63,'المنافقون','Al-Munafiqun',11,'063-Al-Munafiqun'],
  [64,'التغابن','At-Taghabun',18,'064-At-Taghabun'],
  [65,'الطلاق','At-Talaq',12,'065-At-Talaq'],
  [66,'التحريم','At-Tahrim',12,'066-At-Tahrim'],
  [67,'الملك','Al-Mulk',30,'067-Al-Mulk'],
  [68,'القلم','Al-Qalam',52,'068-Al-Qalam'],
  [69,'الحاقة','Al-Haqqah',52,'069-Al-Haqqah'],
  [70,'المعارج',"Al-Ma'arij",44,'070-Al-Ma-arij'],
  [71,'نوح','Nuh',28,'071-Nuh'],
  [72,'الجن','Al-Jinn',28,'072-Al-Jinn'],
  [73,'المزمل','Al-Muzzammil',20,'073-Al-Muzzammil'],
  [74,'المدثر','Al-Muddaththir',56,'074-Al-Muddaththir'],
  [75,'القيامة','Al-Qiyamah',40,'075-Al-Qiyamah'],
  [76,'الإنسان',"Al-Insan",31,'076-Al-Insan'],
  [77,'المرسلات','Al-Mursalat',50,'077-Al-Mursalat'],
  [78,'النبإ',"An-Naba'",40,'078-An-Naba'],
  [79,'النازعات',"An-Nazi'at",46,'079-An-Nazi-at'],
  [80,'عبس',"'Abasa",42,'080-Abasa'],
  [81,'التكوير','At-Takwir',29,'081-At-Takwir'],
  [82,'الانفطار','Al-Infitar',19,'082-Al-Infitar'],
  [83,'المطففين','Al-Mutaffifin',36,'083-Al-Mutaffifin'],
  [84,'الانشقاق','Al-Inshiqaq',25,'084-Al-Inshiqaq'],
  [85,'البروج','Al-Buruj',22,'085-Al-Buruj'],
  [86,'الطارق','At-Tariq',17,'086-At-Tariq'],
  [87,'الأعلى',"Al-A'la",19,'087-Al-A-la'],
  [88,'الغاشية','Al-Ghashiyah',26,'088-Al-Ghashiyah'],
  [89,'الفجر','Al-Fajr',30,'089-Al-Fajr'],
  [90,'البلد','Al-Balad',20,'090-Al-Balad'],
  [91,'الشمس','Ash-Shams',15,'091-Ash-Shams'],
  [92,'الليل','Al-Layl',21,'092-Al-Layl'],
  [93,'الضحى','Ad-Duha',11,'093-Ad-Duha'],
  [94,'الشرح','Ash-Sharh',8,'094-Ash-Sharh'],
  [95,'التين','At-Tin',8,'095-At-Tin'],
  [96,'العلق',"Al-'Alaq",19,'096-Al-Alaq'],
  [97,'القدر','Al-Qadr',5,'097-Al-Qadr'],
  [98,'البينة','Al-Bayyinah',8,'098-Al-Bayyinah'],
  [99,'الزلزلة','Az-Zalzalah',8,'099-Az-Zalzalah'],
  [100,'العاديات',"Al-'Adiyat",11,'100-Al-Adiyat'],
  [101,'القارعة',"Al-Qari'ah",11,'101-Al-Qari-ah'],
  [102,'التكاثر','At-Takathur',8,'102-At-Takathur'],
  [103,'العصر',"Al-'Asr",3,'103-Al-Asr'],
  [104,'الهمزة','Al-Humazah',9,'104-Al-Humazah'],
  [105,'الفيل','Al-Fil',5,'105-Al-Fil'],
  [106,'قريش','Quraysh',4,'106-Quraysh'],
  [107,'الماعون',"Al-Ma'un",7,'107-Al-Ma-un'],
  [108,'الكوثر','Al-Kawthar',3,'108-Al-Kawthar'],
  [109,'الكافرون','Al-Kafirun',6,'109-Al-Kafirun'],
  [110,'النصر','An-Nasr',3,'110-An-Nasr'],
  [111,'المسد','Al-Masad',5,'111-Al-Masad'],
  [112,'الإخلاص',"Al-Ikhlas",4,'112-Al-Ikhlas'],
  [113,'الفلق','Al-Falaq',5,'113-Al-Falaq'],
  [114,'الناس','An-Nas',6,'114-An-Nas'],
];

// Meanings per language (native language translation of surah meaning)
const MEANINGS = {
  Albanisch: ['Hapja','Lopa','Familja e Imranit','Gratë','Sofra e ushqimit','Bagëtia','Vendet e larta','Plaçka e luftës','Pendesa','Junusi','Hudi','Jusufi','Bubullima','Ibrahimi','Shkëmbi','Bletët','Udhëtimi Nakturnë','Shpella','Merjemja','Ta-Ha','Profetët','Haxhi','Besimtarët','Drita','Dalluesi','Poetët','Milingona','Historia','Merimanga','Romakët','Llukmaani','Sexhda','Grupet','Sabeja','Krijuesi','Ja-Sin','Të Radhiturit','Sad','Grupet','Faluesi','I Sqaruari','Këshillimi','Zbukurimet','Duhani','Të Gjunjëzuarit','Rërat e Ahkâfit','Muhamedi','Çlirimi','Dhomat','Kaf','Shpërndarësit','Kodi i Turit','Ylli','Hëna','Mëshirëploti','Ngjarja','Hekuri','Debatuesja','Grumbullimi','Provuesja','Radhët','E Xhumaja','Hipokritët','Humbja dhe Fitimi','Divorci','Ndalimi','Sundimi','Lapsi','E Sigurtë','Shkallët','Nuhu','Xhinët','I Mbështjelluri','I Mbuluar','Ringjallja','Njeriu','Të Dërguarit','Lajmi i Madh','Shpirtmarrësit','Vrenjtur','Mbështjellja','Plasja','Keqmatësit','Çarje','Yjet','Rrufeja','Lartësuari','Mbuluesja','Agimi','Qyteti','Dielli','Nata','Paradita','Zgjerimi','Fiku','Gjaku i Ngjizur','Nata e Kadrit','Dëshmi e Qartë','Tërmeti','Kalorësit','Çarëse','Grumbullimi i Pasurisë','Koha','Fëlliqësuesi','Elefanti','Kurejshët','Ndihma e vogël','Lumi i Bollëkut','Mohuesit','Ndihma','Flamuri','Sinqeriteti','Agimi i Natës','Njerëzit'],
  Bosnisch: ['Otvaranje','Krava','Imranova porodica','Žene','Trpeza','Stoka','Bedemi','Ratni plijen','Pokajanje','Junus','Hud','Jusuf','Grom','Ibrahim','Al-Hidžr','Pčele','Noćno putovanje','Pećina','Merjem','Ta-Ha','Vjerovjesnici','Hadž','Vjernici','Svjetlost','Furkan','Pjesnici','Mravi','Kazivanje','Pauk','Rimljani','Lukman','Prostiranje','Saveznici','Seba','Fatir','Ja-Sin','Oni u redovima','Sad','Grupe','Oprosnik','Pojašnjeno','Dogovaranje','Ukrasi','Dim','Kleknuti','Al-Ahkaf','Muhammed','Pobjeda','Sobe','Kaf','Vjetrovi','Brdo Tur','Zvijezda','Mjesec','Milostivi','Događaj','Gvožđe','Prepirka','Izgnanstvo','Ispitivana','Borbeni red','Džuma','Licemjeri','Uzajamno varanje','Razvod','Zabrana','Vlast','Pero','Istinita','Stepeni','Nuh','Džini','Umotani','Pokriveni','Kijametski dan','Čovjek','Vjetrovi','Vijest','Oni koji čupaju','Namrštio se','Smotavanje','Rascjep','Kradomjeričari','Rascjep','Zvijezde','Munja','Uzvišeni','Zastrašujuća','Zora','Grad','Sunce','Noć','Jutro','Proširenje','Smokva','Ugrušak','Noć Kadr','Jasan dokaz','Potres','Konji','Razbijaćica','Gomilanje','Vjek','Klevetnič','Slon','Kurejši','Sitna pomoć','Obilje','Nevjernici','Pomoć','Palmina vlakna','Iskrenost','Zora','Ljudi'],
  Chinesisch: ['开端','牛','伊姆兰家族','妇女','筵席','牲畜','高处','战利品','悔罪','优努斯','胡德','优素福','雷霆','易卜拉欣','石谷','蜜蜂','夜行','山洞','麦尔彦','塔哈','众先知','朝觐','信士','光明','准则','诗人','蚂蚁','故事','蜘蛛','罗马人','鲁格曼','叩头','盟军','赛白','创造者','雅辛','列班','萨德','队伍','宽恕者','详释','协商','装饰','烟雾','跪伏','沙丘','穆罕默德','胜利','内室','戛夫','播撒者','山岳','星辰','月亮','至仁主','大事','铁','辩讼者','聚合','受考验者','行列','聚礼','伪信者','相欺','离婚','禁止','国权','笔','真实','云路','努哈','精灵','蒙衣者','披袍者','复活','人类','差遣者','喜讯','摄魂者','皱眉','遮蔽','破裂','亏折者','裂缝','星丛','雷霆','至高','笼罩者','黎明','城市','太阳','夜晚','晨光','宽舒','无花果','血凝块','高贵之夜','明证','地震','奔驰者','叩击者','积累','时代','诽谤者','大象','古莱氏','小惠','充裕','不信道者','援助','棕榈丝','诚实','黎明','众人'],
  Englisch: ['The Opening','The Cow','Family of Imran','The Women','The Table Spread','The Cattle','The Heights','The Spoils of War','The Repentance','Jonah','Hud','Joseph','The Thunder','Abraham','The Rocky Tract','The Bee','The Night Journey','The Cave','Mary','Ta-Ha','The Prophets','The Pilgrimage','The Believers','The Light','The Criterion','The Poets','The Ant','The Stories','The Spider','The Romans','Luqman','The Prostration','The Combined Forces','Sheba','The Originator','Ya-Sin','Those Lined Up','Sad','The Groups','The Forgiver','Explained in Detail','Consultation','The Ornaments','The Smoke','The Crouching','The Wind-Curved Sandhills','Muhammad','The Conquest','The Chambers','Qaf','The Winnowing Winds','The Mount','The Star','The Moon','The Most Merciful','The Inevitable','The Iron','The Pleading Woman','The Exile','She That is to be Examined','The Ranks','The Congregation','The Hypocrites','Mutual Disillusion','Divorce','The Prohibition','The Sovereignty','The Pen','The Reality','The Ascending Stairways','Noah','The Jinn','The Enshrouded One','The Cloaked One','The Resurrection','Man','The Emissaries','The Announcement','Those who drag forth','He Frowned','The Overthrowing','The Cleaving','Defrauding','The Splitting Open','The Galaxies','The Morning Star','The Most High','The Overwhelming','The Dawn','The City','The Sun','The Night','The Morning Hours','The Relief','The Fig','The Clot','The Power','The Clear Proof','The Earthquake','The Chargers','The Calamity','Rivalry in Worldly Increase','The Declining Day','The Traducer','The Elephant','Quraysh','The Small Kindnesses','Abundance','The Disbelievers','The Help','The Palm Fiber','Sincerity','The Daybreak','Mankind'],
  Hausa: ['Buɗewa','Saniya','Iyalan Imran','Mata','Tebur','Dabbobi','Tsaunuka','Ganima','Tuba','Yunus','Hud','Yusuf','Tsawa','Ibrahim','Dutse','Kudan Zuma','Tafiya Da Dare','Kogon Duwatsu','Maryama','Ta-Ha','Annabawa','Hajji','Muminai','Haske','Fasali','Mawaƙa','Tururuwa','Labari','Gizo-gizo','Romawa','Luqman','Sujjada','Kawance','Saba','Mahalicci','Yasin','Layuka','Sad','Rukunoni','Mai Gafara','Bayani','Shawara','Adon Duniya','Hayaƙi','Mai Durƙusawa','Tsaunukan Yashi','Muhammadu','Nasara','Ɗakuna','Kaf','Iskoki','Dutsen Tur','Tauraro','Wata','Mai Rahama','Babban Taron','Baƙin Ƙarfe','Mai Jayayya','Ƙorewa','Mace Mai Gwaji','Layuka','Juma\'a','Munafukai','Rashi','Saki','Hani','Mulki','Alƙalami','Gaskiya','Hanyoyin Sama','Nuhu','Aljannu','Mai Riƙa Riga','Mai Mayafi','Tashin Ƙiyama','Mutum','Manzanni','Labari','Mala\'iku','Yau-Mutum','Ɓoyawa','Ɓarkewar Sama','Masu Ƙarya','Ɓarkewar Wata','Tarayyar Taurari','Tauraro','Mai Ɗaukaka','Mai Ɓarewa','Alfijir','Gari','Rana','Dare','Sassafe','Faɗi','Ɗure','Gudan Jini','Dare Mai Ɗaukaka','Shaida Clear','Girgizar Ƙasa','Dawakan Yaƙi','Mai Ɓarewa','Tara Dukiya','Zamanin','Mai Raɗa','Giwa','Ƙuraishi','Ƙaramin Taimako','Yawa','Kafirai','Taimako','Reshen Dabino','Ɗari','Alfijir','Mutane'],
  Hindi: ['खोलना','गाय','इमरान का परिवार','महिलाएँ','मेज़','पशु','ऊँचाइयाँ','युद्ध का माल','प्रायश्चित','यूनुस','हूद','युसुफ','गर्जन','इब्राहिम','पत्थर की घाटी','मधुमक्खी','रात की यात्रा','गुफा','मरयम','ता-हा','पैगम्बर','हज','विश्वासी','प्रकाश','कसौटी','कवि','चींटी','कहानी','मकड़ी','रोमन','लुकमान','साष्टांग','संयुक्त बल','सबा','सृष्टिकर्ता','या-सीन','पंक्तिबद्ध','साद','समूह','क्षमाकर्ता','विस्तृत','परामर्श','आभूषण','धुआँ','घुटने टेकना','रेत के टीले','मुहम्मद','विजय','कमरे','काफ','हवाएँ','पर्वत','तारा','चाँद','दयालु','महाघटना','लोहा','विवाद करनेवाली','निर्वासन','परीक्षित महिला','पंक्तियाँ','शुक्रवार','पाखंडी','पारस्परिक धोखा','तलाक','निषेध','संप्रभुता','कलम','सच्चाई','चढ़ने की सीढ़ियाँ','नूह','जिन्न','लिपटा हुआ','चादर ओढ़े हुए','पुनरुत्थान','मानव','दूत','समाचार','आत्मा खींचनेवाले','भौंचक्का हुआ','लपेटना','फटना','तोलमोल','फटना','आकाशगंगा','भोर का तारा','सर्वोच्च','भारी','प्रभात','शहर','सूर्य','रात','प्रातःकाल','राहत','अंजीर','रक्त का थक्का','शक्ति की रात','स्पष्ट प्रमाण','भूकंप','तेज़ दौड़नेवाले','चोट करनेवाला','संपत्ति का लालच','युग','निंदक','हाथी','कुरैश','छोटी सहायता','बाहुल्य','काफिर','सहायता','खजूर के रेशे','निष्ठा','प्रभात','मानवजाति'],
  Indonesisch: ['Pembuka','Sapi Betina','Keluarga Imran','Wanita','Hidangan','Binatang Ternak','Tempat Tertinggi','Rampasan Perang','Pengampunan','Yunus','Hud','Yusuf','Petir','Ibrahim','Batu Besar','Lebah','Perjalanan Malam','Gua','Maryam','Ta Ha','Para Nabi','Haji','Orang-orang Beriman','Cahaya','Pembeda','Para Penyair','Semut','Kisah','Laba-laba','Bangsa Romawi','Lukman','Sujud','Golongan Bersekutu','Saba','Pencipta','Ya Sin','Orang-orang Berbaris','Sad','Rombongan','Orang yang Maha Pengampun','Diperinci','Musyawarah','Perhiasan','Asap','Yang Berlutut','Bukit Pasir','Muhammad','Kemenangan','Kamar-kamar','Qaf','Angin yang Menerbangkan','Bukit Sinai','Bintang','Bulan','Yang Maha Pengasih','Hari Kiamat','Besi','Wanita yang Membantah','Pengusiran','Wanita yang Diuji','Barisan','Jumat','Orang-orang Munafik','Saling Menipu','Talak','Pengharaman','Kerajaan','Pena','Hari Kiamat','Jalan Naik','Nuh','Jin','Yang Berselimut','Yang Berkemul','Hari Kebangkitan','Manusia','Para Malaikat','Berita','Yang Mencabut','Ia Bermuka Masam','Menggulung','Terbelah','Orang yang Curang','Terbelahnya Langit','Gugusan Bintang','Bintang Malam','Yang Paling Tinggi','Yang Menyelimuti','Fajar','Kota','Matahari','Malam','Waktu Dhuha','Kelapangan','Buah Tin','Segumpal Darah','Malam Kemuliaan','Bukti Nyata','Keguncangan','Kuda Perang','Hari Malapetaka','Bermegah-megahan','Masa','Pengumpat','Gajah','Suku Quraisy','Barang yang Berguna','Nikmat yang Berlimpah','Orang-orang Kafir','Pertolongan','Sabut','Keikhlasan','Waktu Fajar','Manusia'],
  Persisch: ['گشاینده','گاو','خاندان عمران','زنان','سفره','دام','اعراف','غنایم جنگی','توبه','یونس','هود','یوسف','رعد','ابراهیم','سنگلاخ','زنبور عسل','شب‌روی','غار','مریم','طاها','پیامبران','حج','مؤمنان','نور','فرقان','شاعران','مورچه','داستان','عنکبوت','رومیان','لقمان','سجده','احزاب','سبا','فاطر','یاسین','صف‌بستگان','صاد','گروه‌ها','آمرزنده','تفصیل','شورا','زینت‌ها','دود','زانوزنندگان','احقاف','محمد','پیروزی','اتاق‌ها','قاف','پراکنندگان','طور','ستاره','ماه','رحمان','واقعه','آهن','جدال‌کننده','تبعید','آزمایش‌شده','صفوف','جمعه','منافقان','تغابن','طلاق','تحریم','ملک','قلم','حاقه','معارج','نوح','جن','جامه‌پوشیده','ردا پوشیده','رستاخیز','انسان','فرستادگان','خبر','کشندگان','اخم کرد','تاریکی','شکافتن','کم‌فروشان','انشقاق','کهکشان','ستاره شب','اعلی','غاشیه','سپیده‌دم','شهر','خورشید','شب','چاشتگاه','گشایش','انجیر','خون بسته','شب قدر','دلیل روشن','زلزله','اسبان دونده','کوبنده','تفاخر','عصر','عیب‌جو','فیل','قریش','کمک جزئی','فراوانی','کافران','یاری','لیف خرما','اخلاص','سپیده‌دم','مردم'],
  Russisch: ['Открывающая','Корова','Семейство Имрана','Женщины','Трапеза','Скот','Преграды','Добыча','Покаяние','Юнус','Худ','Юсуф','Гром','Ибрахим','Каменистое ущелье','Пчёлы','Ночное путешествие','Пещера','Марьям','Та-Ха','Пророки','Паломничество','Верующие','Свет','Различение','Поэты','Муравей','Рассказ','Паук','Румы','Лукман','Земной поклон','Союзники','Саба','Творец','Йа-Син','Стоящие в ряд','Сад','Толпы','Прощающий','Разъяснены','Совет','Украшения','Дым','Коленопреклонённые','Ахкаф','Мухаммад','Победа','Комнаты','Каф','Рассеивающие','Гора','Звезда','Луна','Милосердный','Событие','Железо','Препирающаяся','Изгнание','Испытуемая','Ряды','Пятница','Лицемеры','Взаимный обман','Развод','Запрет','Власть','Перо','Неизбежное','Ступени','Нух','Джинны','Завернувшийся','Закутавшийся','Воскресение','Человек','Посылаемые','Весть','Исторгающие','Нахмурился','Скручивание','Раскалывание','Обмеривающие','Разрыв','Созвездия','Ночной путник','Высочайший','Покрывающее','Заря','Город','Солнце','Ночь','Утро','Расширение','Смоква','Сгусток крови','Ночь могущества','Ясное знамение','Землетрясение','Мчащиеся','Сокрушительная','Умножение','Время','Хулитель','Слон','Курайш','Мелкие услуги','Изобилие','Неверующие','Помощь','Пальмовые волокна','Искренность','Заря','Люди'],
  Türkisch: ['Açılış','İnek','Âl-i İmran','Kadınlar','Sofra','En\'am','A\'raf','Ganimet','Tevbe','Yunus','Hûd','Yusuf','Gök Gürültüsü','İbrahim','Hicr','Arı','Gece Yolculuğu','Mağara','Meryem','Tâ-Hâ','Enbiyâ','Hac','Müminûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm','Lokman','Secde','Ahzâb','Sebe\'','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Mümin','Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf','Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücadele','Haşr','Mümtehine','Saf','Cuma','Münâfikûn','Tegâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric','Nûh','Cin','Müzzemmil','Müddessir','Kıyâmet','İnsân','Mürselât','Nebe','Nâziât','Abese','Tekvîr','İnfitâr','Mutaffifîn','İnşikâk','Burûc','Târık','A\'lâ','Gâşiye','Fecr','Beled','Şems','Leyl','Duhâ','İnşirah','Tîn','Alak','Kadir','Beyyine','Zilzâl','Âdiyât','Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr','Tebbet','İhlâs','Felak','Nâs'],
  Urdu: ['افتتاح','گائے','آل عمران','خواتین','دسترخوان','مویشی','اعراف','مال غنیمت','توبہ','یونس','ہود','یوسف','گرج','ابراہیم','پتھریلی وادی','شہد کی مکھی','رات کا سفر','غار','مریم','طٰہٰ','انبیاء','حج','مومنین','نور','فرقان','شعراء','چیونٹی','کہانیاں','مکڑی','رومن','لقمان','سجدہ','اتحادی قوتیں','سبا','خالق','یٰسین','قطار میں کھڑے','صاد','گروہ','بخشنے والا','تفصیل سے','مشورہ','زیورات','دھواں','گھٹنے ٹیکنا','ریت کے ٹیلے','محمد','فتح','کمرے','قاف','ہوائیں','پہاڑ','ستارہ','چاند','رحمٰن','بڑا واقعہ','لوہا','بحث کرنے والی','جلاوطنی','آزمائش میں عورت','صفیں','جمعہ','منافقین','باہمی دھوکا','طلاق','ممانعت','بادشاہت','قلم','حقیقت','چڑھنے کی سیڑھیاں','نوح','جن','لپیٹا ہوا','چادر اوڑھے','قیامت','انسان','فرستادے','خبر','روح کھینچنے والے','اخم کیا','لپیٹنا','پھٹنا','ناپ میں کمی','پھٹنا','کہکشاں','صبح کا ستارہ','سب سے اعلیٰ','ڈھکنے والی','فجر','شہر','سورج','رات','صبح','کشادگی','انجیر','خون کا لوتھڑا','شب قدر','واضح ثبوت','زلزلہ','تیز دوڑنے والے','کٹھور','مال کا فخر','زمانہ','طعنہ دینے والا','ہاتھی','قریش','معمولی مدد','کثرت','کافر','مدد','کھجور کا ریشہ','خلوص','فجر','انسانیت'],
  Uygurisch: ['ئاچقۇچ','سىيىر','ئىمران ئائىلىسى','ئاياللار','دەسترەخان','چارپايلار','ئېگىزلىكلەر','ئۇرۇش غەنىيمەتلىرى','تەۋبە','يۇنۇس','ھۇد','يۈسۈپ','گۈلدۈرمە','ئىبراھىم','تاش يار','ئارى ھەشىرەت','تۈنلۈك سەپەر','ئۆڭكۈر','مەريەم','تاھا','پەيغەمبەرلەر','ھەج','مۆمىنلەر','نۇر','فۇرقان','شائىرلار','چۈمۈلى','قىسسىلار','ئۆمۈرچى','رومليقلار','لۇقمان','سەجدە','ئىتتىپاقچىلار','سەبە','يارىتقۇچى','ياسىن','قاتار تۇرغانلار','ساد','توپلار','كەچۈرۈمچى','تەپسىلاتلىق','كېڭەشمە','زىنەتلەر','تۈتۈن','تىز چۆككەنلەر','قۇم دوپپانلار','مۇھەممەد','غەلىبە','ئۆي ئىچلىرى','قاپ','يەل','تۇر تاغ','يۇلتۇز','ئاي','رەھمان','ئۇلۇغ ۋەقە','تۆمۈر','تالاشقۇچى ئايال','سۈرگۈنلۈك','سىناق ئايال','قاتارلار','جۈمە','مۇناپىقلار','ئۆز-ئارا ئالدام','تالاق','چەكلەش','پادىشاھلىق','قەلەم','ھەقىقەت','كۆتۈرۈلۈش باسقۇچلىرى','نۇھ','جىنلار','يورۇنغان','يۆرگەنگەن','قىيامەت','ئىنسان','ئەلچىلەر','خەۋەر','روھ تارتقۇچى','ئاچىغلانغان','ئوراش','يىرىلىش','ئازائەلدەۋ','يىرتىلىش','كۆك يۈزى','تاڭ يۇلتۇزى','ئەڭ ئۇلۇغ','قاپلاش','تاڭ','شەھەر','قۇياش','كىچە','سەھەر','كەڭلىك','ئەنجۈر','قان پىختىسى','قەدر كىچىسى','ئوچۇق دەلىل','زىلزىلە','چابقۇر ئاتلار','ئۇرۇش','دۇنيا مالى','زامان','غىيبەتچى','پىل','قۇرەيش','كىچىك ياردەم','مول نىمەت','كاپىرلار','ياردەم','خۇرما تالى','ئىخلاس','تاڭ','ئىنسانلار'],
};

// ── UI strings per language ───────────────────────────────────────────────
const QURAN_UI = {
  Albanisch:  { back:'Kapak →', forward:'← Hyrja', dict:'Fjalor', intro:'Hyrja', indexTitle:'Tabela e Permbajtjes', langName:'Shqip', htmlLang:'sq' },
  Bengalisch: { back:'প্রচ্ছদ →', forward:'← ভূমিকা', dict:'অভিধান', intro:'ভূমিকা', indexTitle:'বিষয়সূচি', langName:'বাংলা', htmlLang:'bn' },
  Bosnisch:   { back:'Zadnja strana →', forward:'← Predgovor', dict:'Rječnik', intro:'Predgovor', indexTitle:'Sadržaj', langName:'Bosanski', htmlLang:'bs' },
  Chinesisch: { back:'封底 →', forward:'← 前言', dict:'词典', intro:'前言', indexTitle:'目录', langName:'中文', htmlLang:'zh' },
  Englisch:   { back:'Back Cover →', forward:'← Foreword', dict:'Dictionary', intro:'Foreword', indexTitle:'Table of Contents', langName:'English', htmlLang:'en' },
  Hausa:      { back:'Bayan Murfin →', forward:'← Gabatarwa', dict:'Ƙamus', intro:'Gabatarwa', indexTitle:'Jerin Ababen Ciki', langName:'Hausa', htmlLang:'ha' },
  Hindi:      { back:'पिछला आवरण →', forward:'← प्रस्तावना', dict:'शब्दकोश', intro:'प्रस्तावना', indexTitle:'विषय-सूची', langName:'हिन्दी', htmlLang:'hi' },
  Indonesisch:{ back:'Sampul Belakang →', forward:'← Kata Pengantar', dict:'Kamus', intro:'Kata Pengantar', indexTitle:'Daftar Isi', langName:'Bahasa Indonesia', htmlLang:'id' },
  Persisch:   { back:'پشت جلد →', forward:'← مقدمه', dict:'فرهنگ لغت', intro:'مقدمه', indexTitle:'فهرست مطالب', langName:'فارسی', htmlLang:'fa' },
  Russisch:   { back:'Задняя обложка →', forward:'← Предисловие', dict:'Словарь', intro:'Предисловие', indexTitle:'Содержание', langName:'Русский', htmlLang:'ru' },
  Türkisch:   { back:'Arka Kapak →', forward:'← Önsöz', dict:'Sözlük', intro:'Önsöz', indexTitle:'İçindekiler', langName:'Türkçe', htmlLang:'tr' },
  Urdu:       { back:'پچھلا سرورق →', forward:'← دیباچہ', dict:'لغت', intro:'دیباچہ', indexTitle:'فہرست مضامین', langName:'اردو', htmlLang:'ur' },
  Uygurisch:  { back:'ئارقا مۇقاۋا →', forward:'← كىرىش سۆز', dict:'لۇغەت', intro:'كىرىش سۆز', indexTitle:'مۇندەرىجە', langName:'ئۇيغۇرچە', htmlLang:'ug' },
};

const BIBLE_UI = {
  albanian:   { title:'Bibla e Shenjtë', catholic:'✝ Katolike', protestant:'☩ Protestante', front:'← Kapak', lang:'Shqip', htmlLang:'sq', kap:'Kr.' },
  croatian:   { title:'Sveto Pismo', catholic:'✝ Katoličko', protestant:'☩ Protestantsko', front:'← Naslovnica', lang:'Hrvatski', htmlLang:'hr', kap:'Pogl.' },
  czech:      { title:'Svatá Bible', catholic:'✝ Katolická', protestant:'☩ Protestantská', front:'← Titulní strana', lang:'Čeština', htmlLang:'cs', kap:'Kap.' },
  dutch:      { title:'De Heilige Bijbel', catholic:'✝ Katholiek', protestant:'☩ Protestants', front:'← Voorkant', lang:'Nederlands', htmlLang:'nl', kap:'Hfdst.' },
  french:     { title:'La Sainte Bible', catholic:'✝ Catholique', protestant:'☩ Protestant', front:'← Couverture', lang:'Français', htmlLang:'fr', kap:'Ch.' },
  hungarian:  { title:'Biblia', catholic:'✝ Katolikus', protestant:'☩ Protestáns', front:'← Borítólap', lang:'Magyar', htmlLang:'hu', kap:'Fej.' },
  italian:    { title:'La Sacra Bibbia', catholic:'✝ Cattolico', protestant:'☩ Protestante', front:'← Copertina', lang:'Italiano', htmlLang:'it', kap:'Cap.' },
  kjv:        { title:'The Holy Bible', catholic:'✝ Catholic', protestant:'☩ Protestant', front:'← Cover', lang:'English', htmlLang:'en', kap:'Ch.' },
  polish:     { title:'Pismo Święte', catholic:'✝ Katolickie', protestant:'☩ Protestanckie', front:'← Strona tytułowa', lang:'Polski', htmlLang:'pl', kap:'Rozdz.' },
  portuguese: { title:'A Bíblia Sagrada', catholic:'✝ Católica', protestant:'☩ Protestante', front:'← Capa', lang:'Português', htmlLang:'pt', kap:'Cap.' },
  romanian:   { title:'Biblia Sfântă', catholic:'✝ Catolică', protestant:'☩ Protestantă', front:'← Copertă', lang:'Română', htmlLang:'ro', kap:'Cap.' },
  russian:    { title:'Библия', catholic:'✝ Католическое', protestant:'☩ Протестантское', front:'← Обложка', lang:'Русский', htmlLang:'ru', kap:'Гл.' },
  spanish:    { title:'La Santa Biblia', catholic:'✝ Católica', protestant:'☩ Protestante', front:'← Portada', lang:'Español', htmlLang:'es', kap:'Cap.' },
  swedish:    { title:'Bibeln', catholic:'✝ Katolsk', protestant:'☩ Protestantisk', front:'← Omslag', lang:'Svenska', htmlLang:'sv', kap:'Kap.' },
  tagalog:    { title:'Ang Biblia', catholic:'✝ Katoliko', protestant:'☩ Protestante', front:'← Pabalat', lang:'Filipino', htmlLang:'tl', kap:'Kab.' },
  ukrainian:  { title:'Біблія', catholic:'✝ Католицька', protestant:'☩ Протестантська', front:'← Обкладинка', lang:'Українська', htmlLang:'uk', kap:'Розд.' },
};

let fixed = 0;

// ── FIX QURAN INDEXES ─────────────────────────────────────────────────────
for (const [lang, ui] of Object.entries(QURAN_UI)) {
  const indexPath = path.join(QURAN_DIST, lang, 'index.html');
  if (!fs.existsSync(indexPath)) { console.log(`SKIP Quran ${lang}: no index`); continue; }

  const meanings = MEANINGS[lang] || [];
  let html = fs.readFileSync(indexPath, 'utf8');

  // Fix html lang attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${ui.htmlLang}"`);

  // Fix page title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${ui.indexTitle} · القرآن الكريم</title>`);

  // Fix meta tags - remove KX KroniX
  html = html.replace(/content="KX KroniX Tech[^"]*"/g, 'content=""');
  html = html.replace(/content="KX Books[^"]*"/g, 'content=""');

  // Remove dict icon block entirely from index
  html = html.replace(/<style id="dict-icon-style">[\s\S]*?<\/style>\s*/g, '');
  html = html.replace(/<a id="dict-icon-btn"[\s\S]*?<\/a>\s*/g, '');

  // Fix nav: replace German nav links with localized ones
  // Pattern: nav with back/forward links
  html = html.replace(
    /<nav[^>]*>[\s\S]*?<\/nav>/,
    `<nav>
  <span class="orn">۞</span>
  <a href="intro.html">${ui.forward}</a>
  <span class="sp"></span>
  <a href="woerterbuch.html">${ui.dict}</a>
  <span class="sp"></span>
  <a href="back-cover.html">${ui.back}</a>
</nav>`
  );

  // Fix surah rows: replace English .rt with native language meaning
  if (meanings.length === 114) {
    SURAHS.forEach(([id, arabic, trans, verses, slug], idx) => {
      const meaning = meanings[idx] || trans;
      // Replace .rt content for this surah
      const rtRegex = new RegExp(
        `(href="suren/${slug}\\.html"[\\s\\S]*?<span class="rt">)[^<]*(</span>)`,
        'g'
      );
      html = html.replace(rtRegex, `$1${meaning}$2`);
    });
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✅ Quran index fixed: ${lang}`);
  fixed++;
}

// ── FIX BIBLE INDEXES ─────────────────────────────────────────────────────
for (const [lang, ui] of Object.entries(BIBLE_UI)) {
  const indexPath = path.join(BIBLE_DIST, lang, 'index.html');
  if (!fs.existsSync(indexPath)) { console.log(`SKIP Bible ${lang}: no index`); continue; }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Fix html lang
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${ui.htmlLang}"`);

  // Fix title - both "Biblia Catholica" and "Die Heilige Bibel"
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${ui.title} · ${ui.lang}</title>`);

  // Fix h1/display title in header
  html = html.replace(/Biblia Catholica/g, ui.title);
  html = html.replace(/Die Heilige Bibel(?!\s*·\s*Alle)/g, ui.title);

  // Fix switcher buttons
  html = html.replace(/✝&#xFE0E;\s*Katholisch/g, ui.catholic);
  html = html.replace(/☩\s*Protestantisch/g, ui.protestant);
  html = html.replace(/✝\s*Katholisch/g, ui.catholic);

  // Fix topbar/nav front link text
  html = html.replace(/←\s*Zur Vorderseite/g, ui.front);
  html = html.replace(/←\s*Zur Übersicht/g, ui.front);
  html = html.replace(/Zur Vorderseite/g, ui.front.replace('← ',''));

  // Fix "Kap." chapter abbreviation in book entries
  if (ui.kap !== 'Kap.') {
    html = html.replace(/(\d+)\s*Kap\./g, `$1 ${ui.kap}`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✅ Bible index fixed: ${lang}`);
  fixed++;
}

console.log(`\nDone: ${fixed} files fixed.`);
