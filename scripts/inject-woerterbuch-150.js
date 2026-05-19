'use strict';
const fs   = require('fs');
const path = require('path');
/**
 * inject-woerterbuch-150.js
 * Injects 150 new Quran-specific vocabulary entries into all 14
 * existing woerterbuch.html files (before </main>).
 * Words are taken directly from Quranic text — prophets, cosmic signs,
 * Quranic concepts, nature, society, virtues, holy places.
 */
const QURAN_OVER = path.resolve(__dirname, '..', 'dist-alquran', 'Übersetzungen');
const MARKER     = '<!-- wbm-150-inject -->';

/* ══════════════════════════════════════════════════════════════════
   NEW CATEGORY TITLES — in all 14 target languages
══════════════════════════════════════════════════════════════════ */
const CATS = {
  anbiya: {
    ar:'أنبياء القرآن',
    sq:'Profetët e Kur\'anit',     bn:'কুরআনের নবীগণ',
    bs:'Kur\'anski poslanici',     zh:'古兰经中的先知',
    de:'Propheten im Koran',       en:'Prophets of the Quran',
    ha:'Annabawan Alƙur\'ani',     hi:'क़ुरआन के नबी',
    id:'Nabi-Nabi dalam Al-Qur\'an', fa:'پیامبران قرآن',
    ru:'Пророки Корана',           tr:'Kur\'an\'daki Peygamberler',
    ur:'قرآن کے انبیاء',           ug:'قۇرئاندىكى پەيغەمبەرلەر',
  },
  quranConcepts: {
    ar:'مفاهيم قرآنية',
    sq:'Koncepte kur\'anore',      bn:'কুরআনিক ধারণাসমূহ',
    bs:'Kur\'anski pojmovi',       zh:'古兰经核心概念',
    de:'Koranische Begriffe',      en:'Quranic Concepts',
    ha:'Ra\'ayoyin Alƙur\'ani',    hi:'क़ुरआनी अवधारणाएँ',
    id:'Konsep-Konsep Al-Qur\'an', fa:'مفاهیم قرآنی',
    ru:'Коранические понятия',     tr:'Kur\'ani Kavramlar',
    ur:'قرآنی تصورات',             ug:'قۇرئانىي چۈشەنچىلەر',
  },
  nature: {
    ar:'الطبيعة في القرآن',
    sq:'Natyra në Kur\'an',        bn:'কুরআনে প্রকৃতি',
    bs:'Priroda u Kur\'anu',       zh:'古兰经中的自然',
    de:'Natur im Koran',           en:'Nature in the Quran',
    ha:'Yanayi a Alƙur\'ani',      hi:'क़ुरआन में प्रकृति',
    id:'Alam dalam Al-Qur\'an',    fa:'طبیعت در قرآن',
    ru:'Природа в Коране',         tr:'Kur\'an\'da Doğa',
    ur:'قرآن میں فطرت',            ug:'قۇرئاندىكى تەبىئەت',
  },
  society: {
    ar:'المجتمع في القرآن',
    sq:'Shoqëria në Kur\'an',      bn:'কুরআনে সমাজ',
    bs:'Društvo u Kur\'anu',       zh:'古兰经中的社会',
    de:'Gesellschaft im Koran',    en:'Society in the Quran',
    ha:'Al\'umma a Alƙur\'ani',    hi:'क़ुरआन में समाज',
    id:'Masyarakat dalam Al-Qur\'an', fa:'جامعه در قرآن',
    ru:'Общество в Коране',        tr:'Kur\'an\'da Toplum',
    ur:'قرآن میں معاشرہ',          ug:'قۇرئاندىكى جەمئىيەت',
  },
  cosmic: {
    ar:'آيات الكون',
    sq:'Shenjat kozmike',          bn:'মহাজাগতিক নিদর্শন',
    bs:'Kosmički znakovi',         zh:'宇宙的迹象',
    de:'Kosmische Zeichen',        en:'Cosmic Signs',
    ha:'Alamomin sararin samaniya', hi:'ब्रह्मांडीय निशानियाँ',
    id:'Tanda-Tanda Kosmik',       fa:'آیات کیهانی',
    ru:'Космические знамения',     tr:'Kozmik Ayetler',
    ur:'کائناتی نشانیاں',          ug:'كائىناتتىكى ئايەتلەر',
  },
  virtues: {
    ar:'الفضائل القرآنية',
    sq:'Virtytet kur\'anore',      bn:'কুরআনিক সদগুণ',
    bs:'Kur\'anske vrline',        zh:'古兰经中的美德',
    de:'Koranische Tugenden',      en:'Quranic Virtues',
    ha:'Kyawawan halaye na Alƙur\'ani', hi:'क़ुरआनी गुण',
    id:'Kebajikan dalam Al-Qur\'an', fa:'فضایل قرآنی',
    ru:'Коранические добродетели',  tr:'Kur\'ani Erdemler',
    ur:'قرآنی فضائل',              ug:'قۇرئانىي پەزىلەتلەر',
  },
  places: {
    ar:'الأماكن المقدسة',
    sq:'Vendet e shenjta',         bn:'পবিত্র স্থানসমূহ',
    bs:'Sveta mjesta',             zh:'圣地',
    de:'Heilige Stätten',          en:'Holy Places',
    ha:'Wuraren tsarkaka',         hi:'पवित्र स्थान',
    id:'Tempat-Tempat Suci',       fa:'اماکن مقدس',
    ru:'Святые места',             tr:'Kutsal Mekânlar',
    ur:'مقدس مقامات',              ug:'مۇقەددەس جايلار',
  },
};

/* ══════════════════════════════════════════════════════════════════
   150 VOCABULARY ENTRIES
   Fields: cat (key into CATS), ar, ph, + one field per lang code
══════════════════════════════════════════════════════════════════ */
const VOCAB = [

  // ── أنبياء القرآن ── 25 prophets named in the Quran ──────────
  { cat:'anbiya',
    ar:'آدَم', ph:'Ādam',
    sq:'Adami', bn:'আদম', bs:'Adem', zh:'阿丹', de:'Adam', en:'Adam',
    ha:'Annabi Adam', hi:'आदम', id:'Adam', fa:'آدم', ru:'Адам', tr:'Hz. Âdem', ur:'آدم', ug:'ئادەم' },
  { ar:'إِدْرِيس', ph:'Idrīs',
    sq:'Idrisi', bn:'ইদ্রিস', bs:'Idris', zh:'易德里斯', de:'Idris / Henoch', en:'Idris / Enoch',
    ha:'Annabi Idris', hi:'इद्रीस', id:'Idris', fa:'ادریس', ru:'Идрис / Енох', tr:'Hz. İdris', ur:'ادریس', ug:'ئىدرىس' },
  { ar:'نُوح', ph:'Nūḥ',
    sq:'Nuhu', bn:'নূহ', bs:'Nuh', zh:'努哈', de:'Nuh / Noah', en:'Noah',
    ha:'Annabi Nuhu', hi:'नूह', id:'Nuh', fa:'نوح', ru:'Нух / Ной', tr:'Hz. Nuh', ur:'نوح', ug:'نۇھ' },
  { ar:'هُود', ph:'Hūd',
    sq:'Hudi', bn:'হূদ', bs:'Hud', zh:'胡德', de:'Hud', en:'Hud',
    ha:'Annabi Hud', hi:'हूद', id:'Hud', fa:'هود', ru:'Худ', tr:'Hz. Hud', ur:'ہود', ug:'ھۇد' },
  { ar:'صَالِح', ph:'Ṣāliḥ',
    sq:'Salihu', bn:'সালেহ', bs:'Salih', zh:'萨利赫', de:'Salih', en:'Salih',
    ha:'Annabi Saleh', hi:'सालेह', id:'Saleh', fa:'صالح', ru:'Салих', tr:'Hz. Salih', ur:'صالح', ug:'سالىھ' },
  { ar:'إِبْرَاهِيم', ph:'Ibrāhīm',
    sq:'Ibrahimi', bn:'ইব্রাহীম', bs:'Ibrahim', zh:'易卜拉欣', de:'Ibrahim / Abraham', en:'Abraham',
    ha:'Annabi Ibrahim', hi:'इब्राहीम', id:'Ibrahim', fa:'ابراهیم', ru:'Ибрахим / Авраам', tr:'Hz. İbrahim', ur:'ابراہیم', ug:'ئىبراھىم' },
  { ar:'لُوط', ph:'Lūṭ',
    sq:'Luti', bn:'লূত', bs:'Lut', zh:'鲁特', de:'Lut / Lot', en:'Lot',
    ha:'Annabi Lutu', hi:'लूत', id:'Lut', fa:'لوط', ru:'Лут / Лот', tr:'Hz. Lût', ur:'لوط', ug:'لۇت' },
  { ar:'إِسْمَاعِيل', ph:'Ismāʿīl',
    sq:'Ismaili', bn:'ইসমাঈল', bs:'Ismail', zh:'易斯马仪', de:'Ismail / Ismael', en:'Ishmael',
    ha:'Annabi Isma\'ila', hi:'इस्माईल', id:'Ismail', fa:'اسماعیل', ru:'Исмаил / Измаил', tr:'Hz. İsmail', ur:'اسماعیل', ug:'ئىسمائىل' },
  { ar:'إِسْحَاق', ph:'Isḥāq',
    sq:'Is\'haku', bn:'ইসহাক', bs:'Ishak', zh:'易斯哈格', de:'Ishaq / Isaak', en:'Isaac',
    ha:'Annabi Is\'hak', hi:'इस्हाक़', id:'Ishaq', fa:'اسحاق', ru:'Исхак / Исаак', tr:'Hz. İshak', ur:'اسحاق', ug:'ئىسھاق' },
  { ar:'يَعْقُوب', ph:'Yaʿqūb',
    sq:'Jakubi', bn:'ইয়াকুব', bs:'Jakub', zh:'叶尔孤白', de:'Yaqub / Jakob', en:'Jacob',
    ha:'Annabi Yakubu', hi:'याक़ूब', id:'Yakub', fa:'یعقوب', ru:'Якуб / Иаков', tr:'Hz. Yakub', ur:'یعقوب', ug:'يەقۇب' },
  { ar:'يُوسُف', ph:'Yūsuf',
    sq:'Jusufi', bn:'ইউসুফ', bs:'Jusuf', zh:'优素福', de:'Yusuf / Josef', en:'Joseph',
    ha:'Annabi Yusufu', hi:'यूसुफ', id:'Yusuf', fa:'یوسف', ru:'Юсуф / Иосиф', tr:'Hz. Yusuf', ur:'یوسف', ug:'يۇسۇپ' },
  { ar:'أَيُّوب', ph:'Ayyūb',
    sq:'Ejubi', bn:'আইয়ুব', bs:'Ejub', zh:'安优卜', de:'Ayyub / Hiob', en:'Job',
    ha:'Annabi Ayuba', hi:'अय्यूब', id:'Ayub', fa:'ایوب', ru:'Айюб / Иов', tr:'Hz. Eyyûb', ur:'ایوب', ug:'ئەييۇب' },
  { ar:'مُوسَى', ph:'Mūsā',
    sq:'Musai', bn:'মূসা', bs:'Musa', zh:'穆萨', de:'Musa / Moses', en:'Moses',
    ha:'Annabi Musa', hi:'मूसा', id:'Musa', fa:'موسی', ru:'Муса / Моисей', tr:'Hz. Musa', ur:'موسیٰ', ug:'مۇسا' },
  { ar:'هَارُون', ph:'Hārūn',
    sq:'Haruni', bn:'হারুন', bs:'Harun', zh:'哈伦', de:'Harun / Aaron', en:'Aaron',
    ha:'Annabi Haruna', hi:'हारून', id:'Harun', fa:'هارون', ru:'Харун / Аарон', tr:'Hz. Harun', ur:'ہارون', ug:'ھارۇن' },
  { ar:'دَاوُود', ph:'Dāwūd',
    sq:'Davudi', bn:'দাউদ', bs:'Davud', zh:'达伍德', de:'Dawud / David', en:'David',
    ha:'Annabi Dawuda', hi:'दाऊद', id:'Dawud', fa:'داوود', ru:'Дауд / Давид', tr:'Hz. Davud', ur:'داؤد', ug:'داۋۇت' },
  { ar:'سُلَيْمَان', ph:'Sulaymān',
    sq:'Sulejmani', bn:'সুলাইমান', bs:'Sulejman', zh:'苏莱曼', de:'Sulayman / Salomon', en:'Solomon',
    ha:'Annabi Sulaiman', hi:'सुलैमान', id:'Sulaiman', fa:'سلیمان', ru:'Сулейман / Соломон', tr:'Hz. Süleyman', ur:'سلیمان', ug:'سۇلايمان' },
  { ar:'يُونُس', ph:'Yūnus',
    sq:'Junusi', bn:'ইউনুস', bs:'Junus', zh:'尤努斯', de:'Yunus / Jona', en:'Jonah',
    ha:'Annabi Yunusa', hi:'यूनुस', id:'Yunus', fa:'یونس', ru:'Юнус / Иона', tr:'Hz. Yunus', ur:'یونس', ug:'يۇنۇس' },
  { ar:'زَكَرِيَّا', ph:'Zakariyyā',
    sq:'Zekerija', bn:'যাকারিয়া', bs:'Zekerija', zh:'宰凯里雅', de:'Zakariyya / Zacharias', en:'Zechariah',
    ha:'Annabi Zakariyya', hi:'ज़करिय्या', id:'Zakaria', fa:'زکریا', ru:'Закарийя / Захария', tr:'Hz. Zekeriyya', ur:'زکریا', ug:'زەكەرىيا' },
  { ar:'يَحْيَى', ph:'Yaḥyā',
    sq:'Jahjai', bn:'ইয়াহইয়া', bs:'Jahja', zh:'叶海雅', de:'Yahya / Johannes', en:'John the Baptist',
    ha:'Annabi Yahaya', hi:'यह्या', id:'Yahya', fa:'یحیی', ru:'Яхья / Иоанн', tr:'Hz. Yahya', ur:'یحییٰ', ug:'يەھيا' },
  { ar:'عِيسَى', ph:'ʿĪsā',
    sq:'Isai', bn:'ঈসা', bs:'Isa', zh:'尔撒', de:'Isa / Jesus', en:'Jesus',
    ha:'Annabi Isa', hi:'ईसा', id:'Isa', fa:'عیسی', ru:'Иса / Иисус', tr:'Hz. İsa', ur:'عیسیٰ', ug:'ئىسا' },
  { ar:'مُحَمَّد', ph:'Muḥammad',
    sq:'Muhamedi', bn:'মুহাম্মাদ', bs:'Muhammed', zh:'穆罕默德', de:'Muhammad', en:'Muhammad',
    ha:'Annabi Muhammad', hi:'मुहम्मद', id:'Muhammad', fa:'محمد', ru:'Мухаммад', tr:'Hz. Muhammed', ur:'محمد', ug:'مۇھەممەد' },
  { ar:'إِلْيَاس', ph:'Ilyās',
    sq:'Iliasi', bn:'ইলিয়াস', bs:'Ilijas', zh:'伊利亚斯', de:'Ilyas / Elias', en:'Elijah',
    ha:'Annabi Iliyasa', hi:'इल्यास', id:'Ilyas', fa:'الیاس', ru:'Ильяс / Илия', tr:'Hz. İlyas', ur:'الیاس', ug:'ئىليياس' },
  { ar:'الْيَسَع', ph:'Al-Yasaʿ',
    sq:'Elisha', bn:'আল-ইয়াসা', bs:'El-Jesa', zh:'艾勒亚萨', de:'Al-Yasaʿ / Elisa', en:'Elisha',
    ha:'Annabi Alyas\'a', hi:'अल-यसा', id:'Al-Yasaʿ', fa:'الیسع', ru:'Аль-Ясаʿ / Елисей', tr:'Hz. El-Yesa', ur:'الیسع', ug:'ئەلياسەئ' },
  { ar:'شُعَيْب', ph:'Shuʿayb',
    sq:'Shuajbi', bn:'শুআইব', bs:'Šuajb', zh:'舒阿依卜', de:'Shuʿayb / Jethro', en:'Jethro',
    ha:'Annabi Shu\'aibu', hi:'शुऐब', id:'Syuaib', fa:'شعیب', ru:'Шуайб / Иофор', tr:'Hz. Şuayb', ur:'شعیب', ug:'شۇئەيب' },
  { ar:'ذُو الْكِفْل', ph:'Dhū l-Kifl',
    sq:'Dhul-Kefli', bn:'যুল-কিফ্‌ল', bs:'Zul-Kifl', zh:'祖勒基弗勒', de:'Dhul-Kifl / Ezechiel', en:'Dhul-Kifl / Ezekiel',
    ha:'Annabi Zulkifli', hi:'ज़ुल-किफ्ल', id:'Dzulkifli', fa:'ذوالکفل', ru:'Зуль-Кифль', tr:'Hz. Zülkifl', ur:'ذوالکفل', ug:'زۇلكىپىل' },

  // ── مفاهيم قرآنية ── Quranic Concepts ──────────────────────
  { cat:'quranConcepts',
    ar:'الْقُرْآن', ph:'Al-Qurʾān',
    sq:'Kur\'ani', bn:'কুরআন', bs:'Kur\'an', zh:'古兰经', de:'Der Koran', en:'The Quran',
    ha:'Alƙur\'ani', hi:'क़ुरआन', id:'Al-Qur\'an', fa:'قرآن', ru:'Коран', tr:'Kur\'an-ı Kerim', ur:'قرآن', ug:'قۇرئان' },
  { ar:'السُّورَة', ph:'As-Sūrah',
    sq:'Surja', bn:'সূরা', bs:'Sura', zh:'章', de:'Die Sure', en:'Surah (Chapter)',
    ha:'Sura', hi:'सूरह', id:'Surah', fa:'سوره', ru:'Сура', tr:'Sure', ur:'سورہ', ug:'سۈرە' },
  { ar:'الْآيَة', ph:'Al-Āyah',
    sq:'Ajeti', bn:'আয়াত', bs:'Ajet', zh:'节 / 迹象', de:'Der Vers / Das Zeichen', en:'Verse / Sign',
    ha:'Aya', hi:'आयत', id:'Ayat', fa:'آیه', ru:'Аят', tr:'Ayet', ur:'آیت', ug:'ئايەت' },
  { ar:'التِّلَاوَة', ph:'At-Tilāwah',
    sq:'Leximi i Kur\'anit', bn:'তিলাওয়াত', bs:'Učenje Kur\'ana', zh:'诵读', de:'Die Rezitation', en:'Recitation',
    ha:'Karanta Alƙur\'ani', hi:'तिलावत', id:'Tilawah', fa:'تلاوت', ru:'Рецитация', tr:'Tilavet', ur:'تلاوت', ug:'تىلاۋەت' },
  { ar:'التَّفْسِير', ph:'At-Tafsīr',
    sq:'Komentimi i Kur\'anit', bn:'তাফসীর', bs:'Tefsir', zh:'古兰经注释', de:'Die Koranexegese', en:'Quranic Exegesis',
    ha:'Tafsiri', hi:'तफ़सीर', id:'Tafsir', fa:'تفسیر', ru:'Тафсир', tr:'Tefsir', ur:'تفسیر', ug:'تەپسىر' },
  { ar:'الْحِفْظ', ph:'Al-Ḥifẓ',
    sq:'Memorizimi', bn:'হিফজ', bs:'Hafizluk', zh:'背诵', de:'Die Memorierung', en:'Memorization (of Quran)',
    ha:'Haddace Alƙur\'ani', hi:'हिफ़्ज़', id:'Hafalan', fa:'حفظ', ru:'Заучивание наизусть', tr:'Hıfz', ur:'حفظ', ug:'ھىپىز' },
  { ar:'التَّجْوِيد', ph:'At-Tajwīd',
    sq:'Leximi i saktë', bn:'তাজবীদ', bs:'Tedžvid', zh:'诵读规则', de:'Die Rezitationsregeln', en:'Proper Recitation Rules',
    ha:'Karatun sahihi', hi:'तज्वीद', id:'Tajwid', fa:'تجوید', ru:'Таджвид', tr:'Tecvid', ur:'تجوید', ug:'تەجۋىت' },
  { ar:'الْمُصْحَف', ph:'Al-Muṣḥaf',
    sq:'Kopja e shkruar e Kur\'anit', bn:'মুসহাফ', bs:'Mushaf', zh:'古兰经手抄本', de:'Der Koranband', en:'The Written Quran',
    ha:'Littafin Alƙur\'ani', hi:'मुसहफ़', id:'Mushaf', fa:'مصحف', ru:'Мусхаф', tr:'Mushaf', ur:'مصحف', ug:'مۇسھەپ' },
  { ar:'الْحَلَال', ph:'Al-Ḥalāl',
    sq:'Hallalli', bn:'হালাল', bs:'Halal', zh:'合法', de:'Das Erlaubte', en:'Permissible',
    ha:'Halal', hi:'हलाल', id:'Halal', fa:'حلال', ru:'Халяль', tr:'Helal', ur:'حلال', ug:'ھالال' },
  { ar:'الْحَرَام', ph:'Al-Ḥarām',
    sq:'Harami', bn:'হারাম', bs:'Haram', zh:'禁止', de:'Das Verbotene', en:'Forbidden',
    ha:'Haram', hi:'हराम', id:'Haram', fa:'حرام', ru:'Харам', tr:'Haram', ur:'حرام', ug:'ھارام' },
  { ar:'الْوُضُوء', ph:'Al-Wuḍūʾ',
    sq:'Abdesi', bn:'ওযু', bs:'Abdest', zh:'小净', de:'Die Waschung', en:'Ritual Ablution',
    ha:'Alwalla', hi:'वुज़ू', id:'Wudu', fa:'وضو', ru:'Омовение', tr:'Abdest', ur:'وضو', ug:'ۋۇزۇ' },
  { ar:'الطَّهَارَة', ph:'Aṭ-Ṭahārah',
    sq:'Pastërtia rituale', bn:'পবিত্রতা', bs:'Čistoća', zh:'洁净', de:'Die rituelle Reinheit', en:'Ritual Purity',
    ha:'Tsarki', hi:'तहारत', id:'Thaharah', fa:'طهارت', ru:'Ритуальная чистота', tr:'Taharet', ur:'طہارت', ug:'تاھارەت' },
  { ar:'الْقِبْلَة', ph:'Al-Qiblah',
    sq:'Kibla', bn:'কিবলা', bs:'Kibla', zh:'朝拜方向', de:'Die Gebetsrichtung', en:'Direction of Prayer',
    ha:'Alkibla', hi:'क़िबला', id:'Kiblat', fa:'قبله', ru:'Кибла', tr:'Kıble', ur:'قبلہ', ug:'قىبلە' },
  { ar:'الشَّرِيعَة', ph:'Ash-Sharīʿah',
    sq:'Sheriati', bn:'শরিয়াহ', bs:'Šerijat', zh:'伊斯兰法', de:'Das göttliche Gesetz', en:'Divine Law',
    ha:'Shari\'a', hi:'शरीअत', id:'Syariah', fa:'شریعت', ru:'Шариат', tr:'Şeriat', ur:'شریعت', ug:'شەرىئەت' },
  { ar:'الْفَاتِحَة', ph:'Al-Fātiḥah',
    sq:'Fatiha (Çelësi)', bn:'সূরা আল-ফাতিহা', bs:'Fatiha (Otvaranje)', zh:'开端章', de:'Die Eröffnende Sure', en:'The Opening (Chapter 1)',
    ha:'Al-Fatiha (Buɗewa)', hi:'सूरह अल-फातिहा', id:'Al-Fatihah (Pembuka)', fa:'سوره فاتحه', ru:'Фатиха (Открывающая)', tr:'Fatiha Suresi', ur:'سورۃ الفاتحہ', ug:'فاتىھە سۈرىسى' },

  // ── الطبيعة في القرآن ── Nature in the Quran ────────────────
  { cat:'nature',
    ar:'الشَّمْس', ph:'Ash-Shams',
    sq:'Dielli', bn:'সূর্য', bs:'Sunce', zh:'太阳', de:'Die Sonne', en:'The Sun',
    ha:'Rana', hi:'सूरज', id:'Matahari', fa:'خورشید', ru:'Солнце', tr:'Güneş', ur:'سورج', ug:'قۇياش' },
  { ar:'الْقَمَر', ph:'Al-Qamar',
    sq:'Hëna', bn:'চাঁদ', bs:'Mjesec', zh:'月亮', de:'Der Mond', en:'The Moon',
    ha:'Wata', hi:'चाँद', id:'Bulan', fa:'ماه', ru:'Луна', tr:'Ay', ur:'چاند', ug:'ئاي' },
  { ar:'النُّجُوم', ph:'An-Nujūm',
    sq:'Yjet', bn:'তারকারাজি', bs:'Zvijezde', zh:'群星', de:'Die Sterne', en:'The Stars',
    ha:'Taurari', hi:'सितारे', id:'Bintang-Bintang', fa:'ستارگان', ru:'Звёзды', tr:'Yıldızlar', ur:'ستارے', ug:'يۇلتۇزلار' },
  { ar:'الْبَحْر', ph:'Al-Baḥr',
    sq:'Deti', bn:'সমুদ্র', bs:'More', zh:'大海', de:'Das Meer', en:'The Sea',
    ha:'Teku', hi:'समुद्र', id:'Laut', fa:'دریا', ru:'Море', tr:'Deniz', ur:'سمندر', ug:'دەڭىز' },
  { ar:'النَّهْر', ph:'An-Nahr',
    sq:'Lumi', bn:'নদী', bs:'Rijeka', zh:'河流', de:'Der Fluss', en:'The River',
    ha:'Kogi', hi:'नदी', id:'Sungai', fa:'رودخانه', ru:'Река', tr:'Nehir', ur:'دریا / نہر', ug:'دەريا' },
  { ar:'الْجَبَل', ph:'Al-Jabal',
    sq:'Mali', bn:'পর্বত', bs:'Planina', zh:'山', de:'Der Berg', en:'The Mountain',
    ha:'Dutse', hi:'पहाड़', id:'Gunung', fa:'کوه', ru:'Гора', tr:'Dağ', ur:'پہاڑ', ug:'تاغ' },
  { ar:'الشَّجَرَة', ph:'Ash-Shajarah',
    sq:'Pema', bn:'বৃক্ষ', bs:'Drvo', zh:'树', de:'Der Baum', en:'The Tree',
    ha:'Itace', hi:'पेड़', id:'Pohon', fa:'درخت', ru:'Дерево', tr:'Ağaç', ur:'درخت', ug:'دەرەخ' },
  { ar:'الثَّمَرَة', ph:'Ath-Thamarah',
    sq:'Frutat', bn:'ফল', bs:'Plod', zh:'果实', de:'Die Frucht', en:'The Fruit',
    ha:"'Ya'ya", hi:'फल', id:'Buah', fa:'میوه', ru:'Плод', tr:'Meyve', ur:'پھل', ug:'مىۋە' },
  { ar:'الْمَطَر', ph:'Al-Maṭar',
    sq:'Shiu', bn:'বৃষ্টি', bs:'Kiša', zh:'雨', de:'Der Regen', en:'The Rain',
    ha:'Ruwan sama', hi:'बारिश', id:'Hujan', fa:'باران', ru:'Дождь', tr:'Yağmur', ur:'بارش', ug:'يامغۇر' },
  { ar:'الرِّيح', ph:'Ar-Rīḥ',
    sq:'Era', bn:'বায়ু', bs:'Vjetar', zh:'风', de:'Der Wind', en:'The Wind',
    ha:'Iska', hi:'हवा', id:'Angin', fa:'باد', ru:'Ветер', tr:'Rüzgâr', ur:'ہوا', ug:'شامال' },
  { ar:'الْفَجْر', ph:'Al-Fajr',
    sq:'Agimi', bn:'ফজর / ভোর', bs:'Zora', zh:'黎明', de:'Die Morgendämmerung', en:'The Dawn',
    ha:'Alfijir', hi:'फ़ज्र / भोर', id:'Fajar', fa:'فجر', ru:'Рассвет', tr:'Fecr / Şafak', ur:'فجر', ug:'تاڭ' },
  { ar:'اللَّيْل', ph:'Al-Layl',
    sq:'Nata', bn:'রাত', bs:'Noć', zh:'夜晚', de:'Die Nacht', en:'The Night',
    ha:'Dare', hi:'रात', id:'Malam', fa:'شب', ru:'Ночь', tr:'Gece', ur:'رات', ug:'كېچە' },
  { ar:'النَّهَار', ph:'An-Nahār',
    sq:'Dita', bn:'দিন', bs:'Dan', zh:'白昼', de:'Der Tag', en:'The Day',
    ha:'Rana', hi:'दिन', id:'Siang', fa:'روز', ru:'День', tr:'Gündüz', ur:'دن', ug:'كۈندۈز' },
  { ar:'الْفُلْك', ph:'Al-Fulk',
    sq:'Anija / Arka', bn:'জাহাজ / নৌকা', bs:'Brod / Arka', zh:'船只 / 方舟', de:'Das Schiff / Die Arche', en:'The Ship / Ark',
    ha:'Jirgin ruwa', hi:'जहाज़ / नाव', id:'Kapal / Bahtera', fa:'کشتی', ru:'Корабль / Ковчег', tr:'Gemi / Ark', ur:'کشتی', ug:'كېمە' },
  { ar:'الزَّلْزَلَة', ph:'Az-Zalzalah',
    sq:'Tërmeti', bn:'ভূমিকম্প', bs:'Potres', zh:'地震', de:'Das Erdbeben', en:'The Earthquake',
    ha:'Girgizar kasa', hi:'भूकंप', id:'Gempa bumi', fa:'زلزله', ru:'Землетрясение', tr:'Deprem', ur:'زلزلہ', ug:'زەلزەلە' },

  // ── المجتمع في القرآن ── Society in the Quran ───────────────
  { cat:'society',
    ar:'الْأُمَّة', ph:'Al-Ummah',
    sq:'Komuniteti', bn:'উম্মাহ', bs:'Ummet', zh:'穆斯林社群', de:'Die Gemeinschaft', en:'The Community / Nation',
    ha:'Jama\'a', hi:'उम्मत', id:'Umat', fa:'امت', ru:'Умма', tr:'Ümmet', ur:'امت', ug:'ئۈممەت' },
  { ar:'الْيَتِيم', ph:'Al-Yatīm',
    sq:'Jetimi', bn:'ইয়াতীম', bs:'Siroče', zh:'孤儿', de:'Die Waise', en:'The Orphan',
    ha:'Marayu', hi:'यतीम', id:'Anak yatim', fa:'یتیم', ru:'Сирота', tr:'Yetim', ur:'یتیم', ug:'يېتىم' },
  { ar:'الْمِسْكِين', ph:'Al-Miskīn',
    sq:'I varfëri', bn:'মিসকীন', bs:'Siromah', zh:'贫困者', de:'Der Bedürftige', en:'The Destitute',
    ha:'Matalauci', hi:'मिस्कीन', id:'Orang miskin', fa:'مسکین', ru:'Бедняк', tr:'Miskîn', ur:'مسکین', ug:'مىسكىن' },
  { ar:'الشَّهِيد', ph:'Ash-Shahīd',
    sq:'Dëshmori / Dëshmuesi', bn:'শহীদ / সাক্ষী', bs:'Šehid / Svjedok', zh:'烈士 / 见证者', de:'Der Märtyrer / Zeuge', en:'The Martyr / Witness',
    ha:'Shahidi', hi:'शहीद / गवाह', id:'Syahid / Saksi', fa:'شهید', ru:'Шахид / Свидетель', tr:'Şehit / Şahit', ur:'شہید / گواہ', ug:'شەھىت / گۇۋاھ' },
  { ar:'الْإِمَام', ph:'Al-Imām',
    sq:'Imami', bn:'ইমাম', bs:'Imam', zh:'伊玛目', de:'Der Imam / Anführer', en:'The Imam / Leader',
    ha:'Limami', hi:'इमाम', id:'Imam', fa:'امام', ru:'Имам', tr:'İmam', ur:'امام', ug:'ئىمام' },
  { ar:'الشُّورَى', ph:'Ash-Shūrā',
    sq:'Konsultimi', bn:'পরামর্শ', bs:'Konsultacija', zh:'协商', de:'Die Beratung', en:'Consultation',
    ha:'Shawara', hi:'शूरा', id:'Musyawarah', fa:'شورا', ru:'Совещание', tr:'Şura', ur:'شوریٰ', ug:'شۇرا' },
  { ar:'الْمُؤْمِن', ph:'Al-Muʾmin',
    sq:'Besimtari', bn:'মুমিন', bs:'Vjernik', zh:'信士', de:'Der Gläubige', en:'The Believer',
    ha:'Mai imani', hi:'मुमिन', id:'Mukmin', fa:'مؤمن', ru:'Верующий', tr:'Mümin', ur:'مومن', ug:'مۇمىن' },
  { ar:'الْكَافِر', ph:'Al-Kāfir',
    sq:'Jobesimtari', bn:'কাফির', bs:'Nevjernik', zh:'不信者', de:'Der Ungläubige', en:'The Unbeliever',
    ha:'Kafiri', hi:'काफ़िर', id:'Orang kafir', fa:'کافر', ru:'Неверующий', tr:'Kâfir', ur:'کافر', ug:'كاپىر' },
  { ar:'الْعَالِم', ph:'Al-ʿĀlim',
    sq:'Dijetari', bn:'আলিম', bs:'Učenjak', zh:'学者', de:'Der Gelehrte', en:'The Scholar',
    ha:'Masanin addini', hi:'आलिम', id:'Ulama', fa:'عالم', ru:'Учёный', tr:'Âlim', ur:'عالم', ug:'ئالىم' },
  { ar:'الرِّبَا', ph:'Ar-Ribā',
    sq:'Kamatë', bn:'সুদ', bs:'Kamata / Riba', zh:'利息', de:'Der Zins / Wucher', en:'Usury / Interest',
    ha:'Riba', hi:'रिबा / सूद', id:'Riba', fa:'ربا', ru:'Ростовщичество / Риба', tr:'Riba / Faiz', ur:'ربا / سود', ug:'رىبا' },
  { ar:'الْمِيرَاث', ph:'Al-Mīrāth',
    sq:'Trashëgimia', bn:'মীরাস', bs:'Nasljedstvo', zh:'遗产', de:'Das Erbe', en:'Inheritance',
    ha:'Gado', hi:'विरासत', id:'Warisan', fa:'ارث', ru:'Наследство', tr:'Miras', ur:'میراث', ug:'مىراس' },
  { ar:'الْجِهَاد', ph:'Al-Jihād',
    sq:'Xhihadi', bn:'জিহাদ', bs:'Džihad', zh:'奋斗', de:'Das Streben im Weg Gottes', en:'Striving in God\'s Way',
    ha:'Jihadi', hi:'जिहाद', id:'Jihad', fa:'جهاد', ru:'Джихад', tr:'Cihad', ur:'جہاد', ug:'جىھاد' },
  { ar:'الصَّدَقَة', ph:'Aṣ-Ṣadaqah',
    sq:'Sadakaja', bn:'সদাকাহ', bs:'Sadaka', zh:'施舍', de:'Die freiwillige Almose', en:'Voluntary Charity',
    ha:'Sadaka', hi:'सदकाह', id:'Sedekah', fa:'صدقه', ru:'Садака', tr:'Sadaka', ur:'صدقہ', ug:'سەدقە' },
  { ar:'الْأَخ', ph:'Al-Akh',
    sq:'Vëllai', bn:'ভাই', bs:'Brat', zh:'兄弟', de:'Der Bruder', en:'The Brother',
    ha:"Ɗan'uwa", hi:'भाई', id:'Saudara laki-laki', fa:'برادر', ru:'Брат', tr:'Erkek kardeş', ur:'بھائی', ug:'ئاكا-ئىنى' },
  { ar:'الزَّوَاج', ph:'Az-Zawāj',
    sq:'Martesa', bn:'বিবাহ', bs:'Brak / Nikah', zh:'婚姻', de:'Die Ehe', en:'Marriage',
    ha:'Aure / Nikahi', hi:'निकाह / विवाह', id:'Pernikahan', fa:'ازدواج / نکاح', ru:'Брак / Никях', tr:'Nikâh / Evlilik', ur:'نکاح', ug:'نىكاھ' },

  // ── آيات الكون ── Cosmic Signs ─────────────────────────────
  { cat:'cosmic',
    ar:'الْعَرْش', ph:'Al-ʿArsh',
    sq:'Arshi i Allahut', bn:'আরশ', bs:'Allah\'ov prijestolje', zh:'宝座', de:'Der Thron Gottes', en:'The Throne of God',
    ha:'Kursiyyin Allah', hi:'अर्श', id:'Arsy', fa:'عرش', ru:'Трон Аллаха', tr:'Arş', ur:'عرش', ug:'ئەرش' },
  { ar:'الْكُرْسِي', ph:'Al-Kursī',
    sq:'Ndenjëset (Kursijja)', bn:'কুরসি', bs:'Kursijja', zh:'宝座·脚踏', de:'Der Fußschemel / Sessel', en:'The Footstool / Seat',
    ha:'Kursiyyin', hi:'कुर्सी', id:'Kursi', fa:'کرسی', ru:'Курсий', tr:'Kürsî', ur:'کرسی', ug:'كۈرسى' },
  { ar:'اللَّوْح الْمَحْفُوظ', ph:'Al-Lawḥ al-Maḥfūẓ',
    sq:'Tabela e ruajtur', bn:'লাওহুল মাহফূয', bs:'Čuvana ploča', zh:'受保护的石板', de:'Die bewahrte Tafel', en:'The Preserved Tablet',
    ha:'Alluhu mahfuz', hi:'लौह महफ़ूज़', id:'Lauh Mahfudz', fa:'لوح محفوظ', ru:'Хранимая скрижаль', tr:'Levh-i Mahfuz', ur:'لوح محفوظ', ug:'ساقلانغان لەۋھ' },
  { ar:'الْقَلَم', ph:'Al-Qalam',
    sq:'Kallami / Pena', bn:'কলম', bs:'Pero', zh:'笔', de:'Die Feder', en:'The Pen',
    ha:'Alkalami', hi:'क़लम', id:'Pena', fa:'قلم', ru:'Перо', tr:'Kalem', ur:'قلم', ug:'قەلەم' },
  { ar:'الْقَدَر', ph:'Al-Qadar',
    sq:'Kadri', bn:'কদর / ভাগ্য', bs:'Kader', zh:'天命', de:'Das göttliche Schicksal', en:'Divine Decree / Fate',
    ha:'Alkadari', hi:'क़दर', id:'Takdir', fa:'قدر', ru:'Предопределение', tr:'Kader', ur:'تقدیر', ug:'قەدەر' },
  { ar:'الْبَرْزَخ', ph:'Al-Barzakh',
    sq:'Berzahu', bn:'বারযাখ', bs:'Berzah', zh:'中阴界', de:'Der Zwischenzustand', en:'The Intermediate State',
    ha:'Barzahu', hi:'बरज़ख', id:'Barzakh', fa:'برزخ', ru:'Барзах', tr:'Berzah', ur:'برزخ', ug:'بەرزەخ' },
  { ar:'جِبْرِيل', ph:'Jibrīl',
    sq:'Xhebraili', bn:'জিব্রাঈল', bs:'Džibril', zh:'哲布拉伊勒', de:'Jibril / Gabriel', en:'Gabriel',
    ha:'Jibirilu', hi:'जिब्रील', id:'Jibril', fa:'جبرئیل', ru:'Джибриль / Гавриил', tr:'Cebrail', ur:'جبریل', ug:'جىبرائىل' },
  { ar:'الإِسْرَاء', ph:'Al-Isrāʾ',
    sq:'Isra (Udhëtimi Nate)', bn:'ইসরা (রাতের যাত্রা)', bs:'Isra (Noćno putovanje)', zh:'夜行', de:'Die Nachtreise', en:'The Night Journey',
    ha:'Isra\'i', hi:'इस्रा', id:'Isra', fa:'اسراء', ru:'Исра', tr:'İsrâ', ur:'اسراء', ug:'ئىسرا' },
  { ar:'الْمِعْرَاج', ph:'Al-Miʿrāj',
    sq:'Miraxhi (Ngjitja)', bn:'মিরাজ (ঊর্ধ্বগমন)', bs:'Miradž (Uzašašće)', zh:'登霄', de:'Die Himmelfahrt', en:'The Ascension',
    ha:'Miraj', hi:'मिराज', id:'Miraj', fa:'معراج', ru:'Мирадж', tr:'Mirac', ur:'معراج', ug:'مىئراج' },
  { ar:'الْكَوْثَر', ph:'Al-Kawthar',
    sq:'Kautherit (Bollëku)', bn:'কাউসার', bs:'El-Kevser (Obilje)', zh:'豁西', de:'Der Überfluss / Fluss im Paradies', en:'Abundance / River in Paradise',
    ha:'Kausar', hi:'कौसर', id:'Al-Kausar', fa:'کوثر', ru:'Каусар', tr:'Kevser', ur:'کوثر', ug:'كەۋسەر' },
  { ar:'الصِّرَاط', ph:'Aṣ-Ṣirāṭ',
    sq:'Ura e Siratit', bn:'পুলসিরাত', bs:'Most (Sirat)', zh:'天桥', de:'Die Brücke (über die Hölle)', en:'The Bridge (over Hellfire)',
    ha:'Gada (Sirat)', hi:'पुल सिरात', id:'Sirat', fa:'صراط', ru:'Мост Сырат', tr:'Sırat Köprüsü', ur:'پل صراط', ug:'سىرات كۆۋرۈكى' },
  { ar:'الْمِيثَاق', ph:'Al-Mīthāq',
    sq:'Pakti / Besëlidhja', bn:'মিসাক', bs:'Zavjet', zh:'盟约', de:'Das Bündnis / Der Pakt', en:'The Covenant',
    ha:'Alƙawali', hi:'मीसाक़', id:'Perjanjian', fa:'میثاق', ru:'Завет', tr:'Misak', ur:'میثاق', ug:'مىساق' },
  { ar:'الرُّوح', ph:'Ar-Rūḥ',
    sq:'Shpirti', bn:'রূহ', bs:'Ruh / Duh', zh:'灵魂 / 圣灵', de:'Der Geist / Die Seele', en:'The Spirit / Soul',
    ha:'Ruhi', hi:'रूह', id:'Ruh', fa:'روح', ru:'Дух / Душа', tr:'Ruh', ur:'روح', ug:'روھ' },
  { ar:'سِدْرَة الْمُنْتَهَى', ph:'Sidrat al-Muntahā',
    sq:'Pema Sidre e fundit', bn:'সিদরাতুল মুনতাহা', bs:'Lotosovo drvo krajnje granice', zh:'极境的莲树', de:'Der Lotosbaum der äußersten Grenze', en:'The Lote Tree of the Boundary',
    ha:'Sidratul-Muntaha', hi:'सिद्रतुल मुंतहा', id:'Sidratul Muntaha', fa:'سدرة المنتهی', ru:'Лотосовое дерево крайнего предела', tr:'Sidretü\'l Münteha', ur:'سدرۃ المنتہی', ug:'سىدرەتۇل مۇنتەھا' },
  { ar:'الْأَجَل', ph:'Al-Ajal',
    sq:'Afati i caktuar', bn:'আজল / নির্ধারিত সময়', bs:'Određeni rok', zh:'命中注定的期限', de:'Die bestimmte Frist', en:'The Appointed Term',
    ha:'Ajali', hi:'अजल', id:'Ajal', fa:'اجل', ru:'Предначертанный срок', tr:'Ecel', ur:'اجل', ug:'ئەجەل' },

  // ── الفضائل القرآنية ── Quranic Virtues ─────────────────────
  { cat:'virtues',
    ar:'الْإِحْسَان', ph:'Al-Iḥsān',
    sq:'Bamirësia', bn:'ইহসান', bs:'Ihsan', zh:'至善', de:'Das Vollkommene Guthandeln', en:'Excellence / Doing Good',
    ha:'Kyautatawa', hi:'इहसान', id:'Ihsan', fa:'احسان', ru:'Ихсан', tr:'İhsan', ur:'احسان', ug:'ئىھسان' },
  { ar:'الْبِرّ', ph:'Al-Birr',
    sq:'Drejtësia / Devotshmëria', bn:'বির্র / নেকী', bs:'Pobožnost', zh:'虔诚', de:'Die Rechtschaffenheit', en:'Righteousness / Piety',
    ha:'Kirki', hi:'बिर्र', id:'Kebajikan', fa:'نیکی', ru:'Праведность', tr:'Birr', ur:'بر / نیکی', ug:'بىر' },
  { ar:'التَّوَاضُع', ph:'At-Tawāḍuʿ',
    sq:'Modestia', bn:'বিনম্রতা', bs:'Poniznost', zh:'谦逊', de:'Die Bescheidenheit', en:'Humility',
    ha:'Tawali\'u', hi:'तवाज़ुअ', id:'Tawadhu', fa:'تواضع', ru:'Смирение', tr:'Tevazu', ur:'تواضع', ug:'تەۋازە' },
  { ar:'الْعَفْو', ph:'Al-ʿAfū',
    sq:'Falja', bn:'ক্ষমা', bs:'Oprost', zh:'宽恕', de:'Die Vergebung / Entschuldigung', en:'Pardon / Forgiveness',
    ha:'Gafarta', hi:'अफ़्व', id:'Pemaafan', fa:'عفو', ru:'Прощение', tr:'Affetme', ur:'عفو', ug:'ئەپۇ' },
  { ar:'الْحَيَاء', ph:'Al-Ḥayāʾ',
    sq:'Modestia / Turpi', bn:'লজ্জা / হায়া', bs:'Stid / Skromnost', zh:'廉耻', de:'Die Scham / Bescheidenheit', en:'Modesty / Shyness',
    ha:'Kunya', hi:'हया', id:'Rasa malu / Hayâ', fa:'حیا', ru:'Стыдливость', tr:'Haya', ur:'حیا', ug:'ھايا' },
  { ar:'الْإِنْفَاق', ph:'Al-Infāq',
    sq:'Shpenzimi për hir të Allahut', bn:'ইনফাক / আল্লাহর পথে ব্যয়', bs:'Potrošnja na Allahovom putu', zh:'施予', de:'Das Ausgeben auf dem Weg Allahs', en:'Spending in God\'s Way',
    ha:'Kashe kuɗi domin Allah', hi:'इन्फाक़', id:'Infak', fa:'انفاق', ru:'Пожертвование на пути Аллаха', tr:'İnfak', ur:'انفاق', ug:'ئىنپاق' },
  { ar:'الزُّهْد', ph:'Az-Zuhd',
    sq:'Asketizmi', bn:'যুহদ / দুনিয়াবিমুখতা', bs:'Asketizam', zh:'淡泊', de:'Die Weltentsagung', en:'Asceticism / Detachment from the World',
    ha:'Zuhudi', hi:'ज़ुह्द', id:'Zuhud', fa:'زهد', ru:'Аскетизм', tr:'Zühd', ur:'زہد', ug:'زۇھد' },
  { ar:'الْقَنَاعَة', ph:'Al-Qanāʿah',
    sq:'Kënaqësia', bn:'কানাআত', bs:'Zadovoljnost', zh:'知足', de:'Die Genügsamkeit', en:'Contentment',
    ha:'Gamsuwa', hi:'क़नाआत', id:'Qanaah', fa:'قناعت', ru:'Удовлетворённость', tr:'Kanaat', ur:'قناعت', ug:'قانائەت' },
  { ar:'الرِّفْق', ph:'Ar-Rifq',
    sq:'Butësia', bn:'নম্রতা', bs:'Blagost', zh:'温柔', de:'Die Sanftheit', en:'Gentleness / Kindness',
    ha:'Tausayi', hi:'रिफ़्क़', id:'Kelembutan', fa:'رفق', ru:'Мягкость', tr:'Rifk', ur:'رفق', ug:'رىپىق' },
  { ar:'الْوَفَاء', ph:'Al-Wafāʾ',
    sq:'Besnikëria / Sinqeriteti', bn:'ওয়াফা', bs:'Odanost', zh:'忠诚', de:'Die Treue', en:'Loyalty / Faithfulness',
    ha:'Aminci', hi:'वफ़ा', id:'Kesetiaan', fa:'وفا', ru:'Верность', tr:'Vefa', ur:'وفا', ug:'ۋەپا' },
  { ar:'الْحِلْم', ph:'Al-Ḥilm',
    sq:'Durimi', bn:'হিল্ম', bs:'Blagost / Strpljivost', zh:'宽容', de:'Die Langmut', en:'Forbearance',
    ha:'Hankuri', hi:'हिल्म', id:'Sifat lemah lembut', fa:'حلم', ru:'Кроткость', tr:'Hilm', ur:'حلم', ug:'ھىلىم' },
  { ar:'الْإِخَاء', ph:'Al-Ikhāʾ',
    sq:'Vëllazëria', bn:'ভ্রাতৃত্ব', bs:'Bratstvo', zh:'手足情谊', de:'Die Bruderschaft', en:'Brotherhood',
    ha:"Yan'uwanci", hi:'इख़ा', id:'Persaudaraan', fa:'برادری', ru:'Братство', tr:'Kardeşlik', ur:'اخوت', ug:'برادەرلىك' },
  { ar:'الصِّدْق', ph:'Aṣ-Ṣidq',
    sq:'E vërteta', bn:'সত্যবাদিতা', bs:'Istinitost', zh:'诚实', de:'Die Wahrhaftigkeit', en:'Truthfulness',
    ha:'Gaskiya', hi:'सिदक़', id:'Kejujuran', fa:'صدق', ru:'Правдивость', tr:'Sıdk', ur:'صدق', ug:'سىدىق' },
  { ar:'الصَّبْر', ph:'Aṣ-Ṣabr',
    sq:'Durimi', bn:'সবর', bs:'Strpljivost', zh:'忍耐', de:'Die Geduld', en:'Patience',
    ha:'Hakuri', hi:'सब्र', id:'Sabar', fa:'صبر', ru:'Терпение', tr:'Sabır', ur:'صبر', ug:'سەۋر' },
  { ar:'الْعَدْل', ph:'Al-ʿAdl',
    sq:'Drejtësia', bn:'আদল', bs:'Pravda', zh:'公正', de:'Die Gerechtigkeit', en:'Justice',
    ha:'Adalci', hi:'अदल', id:'Keadilan', fa:'عدل', ru:'Справедливость', tr:'Adalet', ur:'عدل', ug:'ئادالەت' },

  // ── الأماكن المقدسة ── Holy Places ──────────────────────────
  { cat:'places',
    ar:'مَكَّة', ph:'Makkah',
    sq:'Meka', bn:'মক্কা', bs:'Mekka', zh:'麦加', de:'Mekka', en:'Mecca',
    ha:'Makka', hi:'मक्का', id:'Mekah', fa:'مکه', ru:'Мекка', tr:'Mekke', ur:'مکہ', ug:'مەككە' },
  { ar:'الْمَدِينَة', ph:'Al-Madīnah',
    sq:'Medina', bn:'মদীনা', bs:'Medina', zh:'麦地那', de:'Medina', en:'Medina',
    ha:'Madina', hi:'मदीना', id:'Madinah', fa:'مدینه', ru:'Медина', tr:'Medine', ur:'مدینہ', ug:'مەدىنە' },
  { ar:'الْكَعْبَة', ph:'Al-Kaʿbah',
    sq:'Qabeja', bn:'কাবা', bs:'Ka\'ba', zh:'天房', de:'Die Kaaba', en:'The Kaaba',
    ha:'Ka\'aba', hi:'काबा', id:'Ka\'bah', fa:'کعبه', ru:'Кааба', tr:'Kâbe', ur:'کعبہ', ug:'كەئبە' },
  { ar:'الْمَسْجِد الْحَرَام', ph:'Al-Masjid al-Ḥarām',
    sq:'Xhamia e shenjtë', bn:'মসজিদুল হারাম', bs:'Sveta džamija', zh:'禁寺', de:'Die Heilige Moschee', en:'The Sacred Mosque',
    ha:'Masallacin da haramta', hi:'मस्जिद-उल-हराम', id:'Masjidil Haram', fa:'مسجدالحرام', ru:'Запретная мечеть', tr:'Mescid-i Haram', ur:'مسجد الحرام', ug:'مەسجىدۇل ھەرام' },
  { ar:'الْمَسْجِد الْأَقْصَى', ph:'Al-Masjid al-Aqṣā',
    sq:'Xhamia Al-Aksa', bn:'মসজিদুল আকসা', bs:'Daleka džamija', zh:'远寺', de:'Die Al-Aqsa-Moschee', en:'The Al-Aqsa Mosque',
    ha:'Masallacin Aqsa', hi:'मस्जिद-उल-अक्सा', id:'Masjidil Aqsa', fa:'مسجدالاقصی', ru:'Мечеть Аль-Акса', tr:'Mescid-i Aksa', ur:'مسجد الاقصیٰ', ug:'مەسجىدۇل ئەقسا' },
  { ar:'زَمْزَم', ph:'Zamzam',
    sq:'Zemzemi', bn:'জমজম', bs:'Zemzem', zh:'渗渗泉', de:'Das Zamzam-Wasser', en:'The Zamzam Well',
    ha:'Ruwan zamzam', hi:'ज़मज़म', id:'Zamzam', fa:'زمزم', ru:'Замзам', tr:'Zemzem', ur:'زمزم', ug:'زەمزەم' },
  { ar:'عَرَفَات', ph:'ʿArafāt',
    sq:'Arafati', bn:'আরাফাত', bs:'Arefat', zh:'阿拉法特山', de:'Der Berg Arafat', en:'Mount Arafat',
    ha:'Filin Arafat', hi:'अरफ़ात', id:'Arafat', fa:'عرفات', ru:'Арафат', tr:'Arafat', ur:'عرفات', ug:'ئەرەپات' },
  { ar:'الصَّفَا وَالْمَرْوَة', ph:'Aṣ-Ṣafā wa-l-Marwah',
    sq:'Safa dhe Merva', bn:'সাফা ও মারওয়া', bs:'Safa i Merva', zh:'萨法与麦尔卧', de:'Safa und Marwa', en:'Al-Safa and Al-Marwa',
    ha:'Safa da Marwa', hi:'सफ़ा और मरवा', id:'Shafa dan Marwah', fa:'صفا و مروه', ru:'Сафа и Марва', tr:'Safa ve Merve', ur:'صفا اور مروہ', ug:'سەپا ۋە مەرۋە' },
  { ar:'الطَّوَاف', ph:'Aṭ-Ṭawāf',
    sq:'Tavafi', bn:'তাওয়াফ', bs:'Tavaf', zh:'绕行', de:'Das Umkreisen der Kaaba', en:'Circumambulation of the Kaaba',
    ha:'Kewaya Ka\'aba', hi:'तवाफ़', id:'Tawaf', fa:'طواف', ru:'Таваф', tr:'Tavaf', ur:'طواف', ug:'تاۋاپ' },
  { ar:'الْهِجْرَة', ph:'Al-Hijrah',
    sq:'Hixhreti', bn:'হিজরাহ', bs:'Hidžra', zh:'迁徙', de:'Die Auswanderung', en:'The Migration',
    ha:'Hijirar', hi:'हिज्रत', id:'Hijrah', fa:'هجرت', ru:'Хиджра', tr:'Hicret', ur:'ہجرت', ug:'ھىجرەت' },
  { ar:'أَهْل الْكِتَاب', ph:'Ahl al-Kitāb',
    sq:'Ithtarët e librit', bn:'আহলে কিতাব', bs:'Sljedbenici Knjige', zh:'有经人', de:'Die Schriftbesitzer', en:'People of the Book',
    ha:'Mutanen Littafi', hi:'अहल-ए-किताब', id:'Ahli Kitab', fa:'اهل کتاب', ru:'Люди Писания', tr:'Ehl-i Kitap', ur:'اہل کتاب', ug:'ئەھلى كىتاب' },
  { ar:'الْفَتْح', ph:'Al-Fatḥ',
    sq:'Çlirimi', bn:'ফাতহ / বিজয়', bs:'Osvajanje / Pobjeda', zh:'征服', de:'Die Eroberung / Der Sieg', en:'The Conquest / Victory',
    ha:'Nasara', hi:'फ़तह', id:'Penaklukan / Kemenangan', fa:'فتح', ru:'Завоевание / Победа', tr:'Fetih', ur:'فتح', ug:'پەتھ' },
  { ar:'الْمُنَافِق', ph:'Al-Munāfiq',
    sq:'Hipokrit', bn:'মুনাফিক', bs:'Munafik', zh:'伪信者', de:'Der Heuchler', en:'The Hypocrite',
    ha:'Munafiki', hi:'मुनाफ़िक़', id:'Munafik', fa:'منافق', ru:'Лицемер', tr:'Münafık', ur:'منافق', ug:'مۇناپىق' },
];

/* ══════════════════════════════════════════════════════════════════
   GENERATE HTML BLOCK
══════════════════════════════════════════════════════════════════ */
function buildHtml(langCode) {
  let html = `\n${MARKER}\n`;
  let currentCat = null;

  for (const v of VOCAB) {
    // New category header
    if (v.cat && v.cat !== currentCat) {
      currentCat = v.cat;
      const c = CATS[currentCat];
      const label = c[langCode] || c.en;
      html += `
  <div class="cat-head">
    <span class="cat-ar">${c.ar}</span>
    <span class="cat-de">${label}</span>
  </div>\n`;
    }

    const tr = v[langCode] || '—';
    html += `  <div class="entry">
    <div class="entry-ar">
      <span class="word-ar">${v.ar}</span>
      <span class="word-ph">${v.ph}</span>
    </div>
    <div class="entry-tr">${tr}</div>
  </div>\n`;
  }
  return html;
}

/* ══════════════════════════════════════════════════════════════════
   LANG CODE MAP  (folder name → ISO code)
══════════════════════════════════════════════════════════════════ */
const FOLDER_TO_CODE = {
  Albanisch:'sq', Bengalisch:'bn', Bosnisch:'bs', Chinesisch:'zh',
  Deutsch:'de',   Englisch:'en',   Hausa:'ha',    Hindi:'hi',
  Indonesisch:'id', Persisch:'fa', Russisch:'ru', Türkisch:'tr',
  Urdu:'ur',      Uygurisch:'ug',
};

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
let fixed = 0, skipped = 0;

const langDirs = fs.readdirSync(QURAN_OVER).filter(d =>
  fs.statSync(path.join(QURAN_OVER, d)).isDirectory()
);

for (const langDir of langDirs) {
  const file = path.join(QURAN_OVER, langDir, 'woerterbuch.html');
  if (!fs.existsSync(file)) { skipped++; continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) {
    console.log(`  – ${langDir}: already injected`); skipped++; continue;
  }

  const code = FOLDER_TO_CODE[langDir];
  if (!code) { console.warn(`  ⚠ ${langDir}: unknown folder`); skipped++; continue; }

  // Inject new entries before </main>
  const newBlock = buildHtml(code);
  const patched  = html.replace('</main>', `${newBlock}</main>`);

  if (patched === html) {
    console.warn(`  ⚠ ${langDir}: </main> not found`); skipped++; continue;
  }

  fs.writeFileSync(file, patched, 'utf8');
  console.log(`  ✓ ${langDir} [${code}] — ${VOCAB.length} Wörter injiziert`);
  fixed++;
}

console.log(`\n✅ Inject-150: ${fixed} Dateien aktualisiert, ${skipped} übersprungen.`);
console.log(`   Wörter pro Sprache: ${VOCAB.length} (${Object.keys(CATS).length} neue Kategorien)\n`);
