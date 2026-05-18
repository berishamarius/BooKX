/**
 * build-woerterbuch.js
 * ─────────────────────────────────────────────────────────────────
 * 1.  Generates woerterbuch.html for all 14 Quran languages
 *     Vocabulary: public-domain classical Arabic lexicography
 *     (Lane's Lexicon 1863 · Al-Mufradat fi Gharib al-Quran, Al-Raghib al-Isfahani)
 * 2.  Patches dist-alquran/cover.html  → 2-per-row archive grid
 * 3.  Patches dist-diebibel/cover.html → 2-per-row archive grid
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const BASE       = path.resolve(__dirname, '..');
const QURAN_OVER = path.join(BASE, 'dist-alquran', 'Übersetzungen');
const BIBLE_COV  = path.join(BASE, 'dist-diebibel', 'cover.html');
const QURAN_COV  = path.join(BASE, 'dist-alquran',  'cover.html');

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE DEFINITIONS
═══════════════════════════════════════════════════════════════ */
const LANGS = {
  Albanisch:   { code:'sq', native:'Shqip',            dir:'ltr', htmlLang:'sq' },
  Bengalisch:  { code:'bn', native:'বাংলা',             dir:'ltr', htmlLang:'bn' },
  Bosnisch:    { code:'bs', native:'Bosanski',          dir:'ltr', htmlLang:'bs' },
  Chinesisch:  { code:'zh', native:'中文',              dir:'ltr', htmlLang:'zh' },
  Deutsch:     { code:'de', native:'Deutsch',           dir:'ltr', htmlLang:'de' },
  Englisch:    { code:'en', native:'English',           dir:'ltr', htmlLang:'en' },
  Hausa:       { code:'ha', native:'Hausa',             dir:'ltr', htmlLang:'ha' },
  Hindi:       { code:'hi', native:'हिन्दी',             dir:'ltr', htmlLang:'hi' },
  Indonesisch: { code:'id', native:'Bahasa Indonesia',  dir:'ltr', htmlLang:'id' },
  Persisch:    { code:'fa', native:'فارسی',             dir:'rtl', htmlLang:'fa' },
  Russisch:    { code:'ru', native:'Русский',           dir:'ltr', htmlLang:'ru' },
  Türkisch:    { code:'tr', native:'Türkçe',            dir:'ltr', htmlLang:'tr' },
  Urdu:        { code:'ur', native:'اردو',              dir:'rtl', htmlLang:'ur' },
  Uygurisch:   { code:'ug', native:'ئۇيغۇرچە',          dir:'rtl', htmlLang:'ug' },
};

/* ═══════════════════════════════════════════════════════════════
   VOCABULARY  (≈ 80 entries, 8 categories)
   Source: Lane's Arabic-English Lexicon (1863, public domain)
           Al-Mufradat fi Gharib al-Quran, Al-Raghib al-Isfahani (public domain)
═══════════════════════════════════════════════════════════════ */
const VOCAB = [

  // ─── Kategorie 1: Die Namen Gottes ───────────────────────────
  { cat:'أسماء الله الحسنى · Die schönsten Namen Gottes',
    ar:'الله',           ph:'Allāh',
    sq:'Allahu / Zoti', bn:'আল্লাহ', bs:'Allah', zh:'真主', de:'Allah / Gott', en:'Allah / God',
    ha:'Allah', hi:'अल्लाह', id:'Allah', fa:'الله / خدا', ru:'Аллах', tr:'Allah', ur:'اللہ', ug:'ئاللاھ' },
  { ar:'الرَّحْمَن',     ph:'Ar-Raḥmān',
    sq:'Gjithëmëshirësi', bn:'পরম দয়ালু', bs:'Milostivi', zh:'至仁', de:'Der Allerbarmer', en:'The Most Gracious',
    ha:'Mai rahama', hi:'अत्यन्त कृपालु', id:'Yang Maha Pengasih', fa:'رحمان', ru:'Милостивый', tr:'Rahmân', ur:'رحمٰن', ug:'رەھمان' },
  { ar:'الرَّحِيم',      ph:'Ar-Raḥīm',
    sq:'Mëshirëploti', bn:'পরম করুণাময়', bs:'Milosrdni', zh:'特慈', de:'Der Barmherzige', en:'The Most Merciful',
    ha:'Mai jin ƙai', hi:'कृपावान', id:'Yang Maha Penyayang', fa:'رحیم', ru:'Милосердный', tr:'Rahîm', ur:'رحیم', ug:'رەھىم' },
  { ar:'رَبّ',           ph:'Rabb',
    sq:'Zoti / Rabb', bn:'রব / প্রভু', bs:'Gospodar', zh:'主', de:'Herr', en:'Lord',
    ha:'Ubangiji', hi:'प्रभु / रब्', id:'Tuhan', fa:'پروردگار', ru:'Господь', tr:'Rab', ur:'رب', ug:'رەب' },
  { ar:'الْمَلِك',       ph:'Al-Malik',
    sq:'Mbreti', bn:'অধিপতি', bs:'Vladar', zh:'王', de:'Der König', en:'The King / Sovereign',
    ha:'Sarki', hi:'राजा', id:'Raja', fa:'ملک', ru:'Царь', tr:'Melik', ur:'بادشاہ', ug:'مەلىك' },
  { ar:'الْعَزِيز',      ph:'Al-ʿAzīz',
    sq:'I Plotfuqishmi', bn:'পরাক্রমশালী', bs:'Moćni', zh:'尊贵者', de:'Der Mächtige', en:'The All-Mighty',
    ha:'Mai iko', hi:'पराक्रमी', id:'Yang Maha Perkasa', fa:'عزیز', ru:'Великий', tr:'Aziz', ur:'عزیز', ug:'ئەزىز' },
  { ar:'الْحَكِيم',      ph:'Al-Ḥakīm',
    sq:'I Urti', bn:'প্রজ্ঞাময়', bs:'Mudri', zh:'至哲', de:'Der Weise', en:'The All-Wise',
    ha:'Mai hikima', hi:'सर्वज्ञ', id:'Yang Maha Bijaksana', fa:'حکیم', ru:'Мудрый', tr:'Hakîm', ur:'حکیم', ug:'ھەكىم' },
  { ar:'الْغَفُور',      ph:'Al-Ghafūr',
    sq:'Falësi', bn:'ক্ষমাশীল', bs:'Oprostnik', zh:'至赦', de:'Der Allvergebende', en:'The All-Forgiving',
    ha:'Mai gafara', hi:'क्षमाशील', id:'Yang Maha Pengampun', fa:'غفور', ru:'Прощающий', tr:'Ğafûr', ur:'غفور', ug:'غەفۇر' },
  { ar:'الْقَدِير',      ph:'Al-Qadīr',
    sq:'I Gjithëpushtetshmi', bn:'সর্বশক্তিমান', bs:'Svemoćni', zh:'全能', de:'Der Allmächtige', en:'The All-Powerful',
    ha:'Maruwaito', hi:'सर्वशक्तिमान', id:'Yang Maha Kuasa', fa:'قادر', ru:'Всемогущий', tr:'Kâdir', ur:'قادر', ug:'قادىر' },
  { ar:'السَّمِيع',      ph:'As-Samīʿ',
    sq:'Gjithëdëgjuesi', bn:'সর্বশ্রোতা', bs:'Koji sve čuje', zh:'全听', de:'Der Allhörende', en:'The All-Hearing',
    ha:'Mai ji kowane', hi:'सब-सुनने वाला', id:'Yang Maha Mendengar', fa:'سمیع', ru:'Всеслышащий', tr:'Semî', ur:'سمیع', ug:'سەمىئ' },
  { ar:'الْبَصِير',      ph:'Al-Baṣīr',
    sq:'Gjithëshikuesi', bn:'সর্বদ্রষ্টা', bs:'Koji sve vidi', zh:'全视', de:'Der Allsehende', en:'The All-Seeing',
    ha:'Mai gani kowane', hi:'सब-देखने वाला', id:'Yang Maha Melihat', fa:'بصیر', ru:'Всевидящий', tr:'Basîr', ur:'بصیر', ug:'بەسىر' },
  { ar:'الْعَلِيم',      ph:'Al-ʿAlīm',
    sq:'Gjithëdijëshmi', bn:'সর্বজ্ঞ', bs:'Sveznajući', zh:'全知', de:'Der Allwissende', en:'The All-Knowing',
    ha:'Mai sani kowane', hi:'सर्वज्ञ', id:'Yang Maha Mengetahui', fa:'علیم', ru:'Всезнающий', tr:'Alîm', ur:'علیم', ug:'ئەلىم' },

  // ─── Kategorie 2: Glaube & Islamische Grundbegriffe ──────────
  { cat:'الإيمان والإسلام · Glaube & Islam',
    ar:'إِسْلام',        ph:'Islām',
    sq:'Islam', bn:'ইসলাম', bs:'Islam', zh:'伊斯兰', de:'Islam / Hingabe an Gott', en:'Islam / Submission to God',
    ha:'Musulunci', hi:'इस्लाम', id:'Islam', fa:'اسلام', ru:'Ислам', tr:'İslam', ur:'اسلام', ug:'ئىسلام' },
  { ar:'إِيمَان',        ph:'Īmān',
    sq:'Besim', bn:'ঈমান', bs:'Vjera / Iman', zh:'信仰', de:'Glaube', en:'Faith / Belief',
    ha:'Imani', hi:'ईमान', id:'Iman', fa:'ایمان', ru:'Вера', tr:'İman', ur:'ایمان', ug:'ئىمان' },
  { ar:'تَوْحِيد',       ph:'Tawḥīd',
    sq:'Njësimi i Allahut', bn:'তাওহীদ', bs:'Jednoboštvo', zh:'独一', de:'Gotteseinheit / Monotheismus', en:'Oneness of God / Monotheism',
    ha:'Tauhidi', hi:'तौहीद', id:'Tauhid', fa:'توحید', ru:'Единобожие', tr:'Tevhid', ur:'توحید', ug:'تەۋھىد' },
  { ar:'شِرْك',          ph:'Shirk',
    sq:'Idhujtaria', bn:'শিরক', bs:'Mnogoboštvo', zh:'以物配主', de:'Beigesellung / Vielgötterei', en:'Polytheism / Associating partners with God',
    ha:'Shirki', hi:'शिर्क', id:'Syirik', fa:'شرک', ru:'Многобожие', tr:'Şirk', ur:'شرک', ug:'شىرك' },
  { ar:'كُفْر',          ph:'Kufr',
    sq:'Mosbesimi', bn:'কুফর', bs:'Nevjerstvo', zh:'不信', de:'Unglaube', en:'Disbelief',
    ha:'Kafirci', hi:'कुफ्र', id:'Kufur', fa:'کفر', ru:'Неверие', tr:'Küfür', ur:'کفر', ug:'كۇفر' },
  { ar:'تَقْوَى',        ph:'Taqwā',
    sq:'Devotshmëria', bn:'তাকওয়া', bs:'Bogobojaznost', zh:'敬畏', de:'Gottesfurcht / Frömmigkeit', en:'God-consciousness / Piety',
    ha:'Tsoron Allah', hi:'तक़वा', id:'Taqwa', fa:'تقوا', ru:'Богобоязненность', tr:'Takva', ur:'تقوٰی', ug:'تەقۋا' },
  { ar:'نِفَاق',         ph:'Nifāq',
    sq:'Hipokrizja', bn:'নিফাক', bs:'Licemjerstvo', zh:'伪信', de:'Heuchelei', en:'Hypocrisy',
    ha:'Munafunci', hi:'निफ़ाक़', id:'Kemunafikan', fa:'نفاق', ru:'Лицемерие', tr:'Nifak', ur:'نفاق', ug:'نىفاق' },

  // ─── Kategorie 3: Religiöse Praxis ───────────────────────────
  { cat:'العبادات · Religiöse Praxis',
    ar:'صَلَاة',         ph:'Ṣalāh',
    sq:'Namazi', bn:'সালাত/নামাজ', bs:'Namaz / Salat', zh:'礼拜', de:'Gebet', en:'Prayer / Salah',
    ha:'Sallah', hi:'नमाज़', id:'Shalat', fa:'نماز', ru:'Намаз', tr:'Namaz / Salât', ur:'نماز', ug:'نامaz' },
  { ar:'زَكَاة',         ph:'Zakāh',
    sq:'Zekati', bn:'যাকাত', bs:'Zekat', zh:'天课', de:'Pflichtabgabe / Almosensteuer', en:'Obligatory almsgiving / Zakat',
    ha:'Zakka', hi:'ज़कात', id:'Zakat', fa:'زکات', ru:'Закят', tr:'Zekât', ur:'زکاۃ', ug:'زاكات' },
  { ar:'صَوْم',          ph:'Ṣawm',
    sq:'Agjërim', bn:'সওম/রোজা', bs:'Post', zh:'封斋', de:'Fasten', en:'Fasting',
    ha:'Azumi', hi:'रोज़ा', id:'Puasa', fa:'روزه', ru:'Пост', tr:'Oruç / Savm', ur:'روزہ', ug:'روزا' },
  { ar:'حَجّ',           ph:'Ḥajj',
    sq:'Haxhi', bn:'হজ্জ', bs:'Hadžiluk', zh:'朝觐', de:'Pilgerfahrt nach Mekka', en:'Pilgrimage to Mecca',
    ha:'Haji', hi:'हज', id:'Haji', fa:'حج', ru:'Хадж', tr:'Hac', ur:'حج', ug:'ھەج' },
  { ar:'دُعَاء',         ph:'Duʿāʾ',
    sq:'Lutja', bn:'দুআ', bs:'Dova', zh:'祈祷', de:'Bittgebet / Flehen', en:'Supplication / Invocation',
    ha:'Addu\'a', hi:'दुआ', id:'Doa', fa:'دعا', ru:'Дуа / Мольба', tr:'Dua', ur:'دعا', ug:'دۇئا' },
  { ar:'ذِكْر',          ph:'Dhikr',
    sq:'Madhërim i Allahut', bn:'যিকর', bs:'Spomen Allaha', zh:'记念主', de:'Gottesgedenken', en:"Remembrance of God",
    ha:'Zikiri', hi:'ज़िक्र', id:'Zikir', fa:'ذکر', ru:'Поминание Аллаха', tr:'Zikir', ur:'ذکر', ug:'زىكىر' },
  { ar:'تَوْبَة',        ph:'Tawbah',
    sq:'Pendimi', bn:'তাওবা', bs:'Pokajanje', zh:'悔罪', de:'Reue / Umkehr zu Gott', en:'Repentance',
    ha:'Tuba', hi:'तौबा', id:'Tobat', fa:'توبه', ru:'Покаяние', tr:'Tövbe', ur:'توبہ', ug:'تەۋبە' },
  { ar:'إِخْلَاص',       ph:'Ikhlāṣ',
    sq:'Sinqeriteti', bn:'ইখলাস', bs:'Iskrenost', zh:'赤诚', de:'Aufrichtigkeit / Lauterkeit der Absicht', en:'Sincerity of intention',
    ha:'Xilas', hi:'इख़लास', id:'Ikhlas', fa:'اخلاص', ru:'Искренность', tr:'İhlâs', ur:'اخلاص', ug:'ئىخلاس' },
  { ar:'صَبْر',          ph:'Ṣabr',
    sq:'Durimi', bn:'সবর', bs:'Strpljivost', zh:'忍耐', de:'Geduld / Standhaftigkeit', en:'Patience / Steadfastness',
    ha:'Hakuri', hi:'सब्र', id:'Sabar', fa:'صبر', ru:'Терпение', tr:'Sabır', ur:'صبر', ug:'سەۋر' },
  { ar:'شُكْر',          ph:'Shukr',
    sq:'Falënderimi', bn:'শুকর', bs:'Zahvalnost', zh:'感恩', de:'Dankbarkeit', en:'Gratitude',
    ha:'Godiya', hi:'शुक्र', id:'Syukur', fa:'شکر', ru:'Благодарность', tr:'Şükür', ur:'شکر', ug:'شۈكۈر' },
  { ar:'تَوَكُّل',       ph:'Tawakkul',
    sq:'Mbështetja në Allah', bn:'তাওয়াক্কুল', bs:'Pouzdanje u Allaha', zh:'信靠主', de:'Gottvertrauen', en:'Trust and reliance on God',
    ha:'Dogaro ga Allah', hi:'तवक्कुल', id:'Tawakkal', fa:'توکل', ru:'Упование на Аллаха', tr:'Tevekkül', ur:'توکل', ug:'تەۋەككۈل' },
  { ar:'جِهَاد',         ph:'Jihād',
    sq:'Xhihadi', bn:'জিহাদ', bs:'Džihad / Nastojanje', zh:'奋斗', de:'Anstrengung / Bemühen im Weg Gottes', en:'Striving / Struggle in God\'s way',
    ha:'Jihadi', hi:'जिहाद', id:'Jihad', fa:'جهاد', ru:'Джихад', tr:'Cihad', ur:'جہاد', ug:'جىھاد' },

  // ─── Kategorie 4: Eschatologie ────────────────────────────────
  { cat:'الآخرة · Das Jenseits',
    ar:'الْآخِرَة',      ph:'Al-Ākhirah',
    sq:'Bota tjetër', bn:'আখিরাত', bs:'Ahiret', zh:'后世', de:'Das Jenseits / Nachleben', en:'The Hereafter',
    ha:'Lahira', hi:'आख़िरत', id:'Akhirat', fa:'آخرت', ru:'Загробная жизнь', tr:'Ahiret', ur:'آخرت', ug:'ئاخىرەت' },
  { ar:'يَوْمُ الْقِيَامَة', ph:'Yawm al-Qiyāmah',
    sq:'Dita e Kiametit', bn:'কিয়ামত দিবস', bs:'Sudnji dan', zh:'复活日', de:'Der Tag der Auferstehung', en:'The Day of Resurrection',
    ha:'Ranar Kiyama', hi:'क़यामत का दिन', id:'Hari Kiamat', fa:'روز قیامت', ru:'День воскресения', tr:'Kıyamet Günü', ur:'قیامت کا دن', ug:'قىيامەت كۈنى' },
  { ar:'الْجَنَّة',      ph:'Al-Jannah',
    sq:'Xheneti', bn:'জান্নাত', bs:'Džennet / Raj', zh:'天园', de:'Das Paradies', en:'Paradise / Heaven',
    ha:'Aljanna', hi:'जन्नत', id:'Surga / Jannah', fa:'بهشت', ru:'Рай / Джаннат', tr:'Cennet', ur:'جنت', ug:'جەننەت' },
  { ar:'النَّار',        ph:'An-Nār',
    sq:'Xhehenemi / Zjarri', bn:'জাহান্নাম / আগুন', bs:'Džehennem / Vatra', zh:'火狱', de:'Das Höllenfeuer', en:'Hellfire',
    ha:'Wuta', hi:'जहन्नम', id:'Neraka / Api', fa:'آتش دوزخ', ru:'Адский огонь', tr:'Cehennem Ateşi', ur:'جہنم', ug:'دوزاخ' },
  { ar:'الْحِسَاب',      ph:'Al-Ḥisāb',
    sq:'Llogaria', bn:'হিসাব', bs:'Polaganje računa', zh:'清算', de:'Die Abrechnung / Das Gericht', en:'The Reckoning / Judgment',
    ha:'Lissafi', hi:'हिसाब', id:'Hisab', fa:'حساب', ru:'Расчёт', tr:'Hesap', ur:'حساب', ug:'ھېساب' },
  { ar:'الْمِيزَان',     ph:'Al-Mīzān',
    sq:'Peshorja', bn:'মিযান', bs:'Vaga', zh:'天平', de:'Die Waage der Taten', en:'The Scale (of deeds)',
    ha:'Ma\'auni', hi:'मीज़ान', id:'Mizan / Timbangan', fa:'میزان', ru:'Весы деяний', tr:'Mizan', ur:'میزان', ug:'مىزان' },
  { ar:'الصِّرَاطُ الْمُسْتَقِيم', ph:'Aṣ-Ṣirāṭ al-Mustaqīm',
    sq:'Rruga e drejtë', bn:'সরল পথ', bs:'Pravi put', zh:'正路', de:'Der gerade Weg', en:'The Straight Path',
    ha:'Hanya madaidaiciya', hi:'सीधा रास्ता', id:'Jalan yang lurus', fa:'صراط مستقیم', ru:'Прямой путь', tr:'Sırat-ı Müstakim', ur:'صراط مستقیم', ug:'توغرا يول' },
  { ar:'الْبَعْث',       ph:'Al-Baʿth',
    sq:'Ringjallja', bn:'পুনরুত্থান', bs:'Uskrsnuće', zh:'复活', de:'Die Auferweckung', en:'Resurrection',
    ha:'Tashin matattu', hi:'पुनरुत्थान', id:'Kebangkitan', fa:'برانگیختگی', ru:'Воскресение', tr:'Ba\'s / Diriliş', ur:'بعث', ug:'قايتا تىرىلىش' },

  // ─── Kategorie 5: Prophetie & Offenbarung ────────────────────
  { cat:'النبوة والوحي · Prophetie & Offenbarung',
    ar:'الْوَحْي',       ph:'Al-Waḥy',
    sq:'Shpallja', bn:'ওহী', bs:'Objava / Vahj', zh:'启示', de:'Die Offenbarung', en:'Divine Revelation',
    ha:'Wahayi', hi:'वही', id:'Wahyu', fa:'وحی', ru:'Откровение', tr:'Vahiy', ur:'وحی', ug:'ۋەھي' },
  { ar:'نَبِيّ',         ph:'Nabī',
    sq:'Profet', bn:'নবী', bs:'Vjerovjesnik', zh:'先知', de:'Prophet', en:'Prophet',
    ha:'Annabi', hi:'नबी', id:'Nabi', fa:'نبی', ru:'Пророк', tr:'Nebi', ur:'نبی', ug:'نەبىي' },
  { ar:'رَسُول',         ph:'Rasūl',
    sq:'I dërguar', bn:'রাসূল', bs:'Poslanik', zh:'使者', de:'Gesandter', en:'Messenger',
    ha:'Manzon Allah', hi:'रसूल', id:'Rasul', fa:'رسول', ru:'Посланник', tr:'Resul', ur:'رسول', ug:'رەسۇل' },
  { ar:'كِتَاب',         ph:'Kitāb',
    sq:'Libri', bn:'কিতাব', bs:'Knjiga', zh:'天经', de:'Das Buch (Gottes)', en:'The Book',
    ha:'Littafi', hi:'किताब', id:'Kitab', fa:'کتاب', ru:'Книга', tr:'Kitap', ur:'کتاب', ug:'كىتاب' },
  { ar:'الْمَلَائِكَة',  ph:'Al-Malāʾikah',
    sq:'Engjëjt', bn:'ফেরেশতা', bs:'Meleki / Anđeli', zh:'天使', de:'Die Engel', en:'The Angels',
    ha:'Mala\'iku', hi:'फ़रिश्ते', id:'Malaikat', fa:'فرشتگان', ru:'Ангелы', tr:'Melekler', ur:'فرشتے', ug:'پەرىشتىلەر' },
  { ar:'الْجِنّ',        ph:'Al-Jinn',
    sq:'Xhinët', bn:'জিন', bs:'Džini', zh:'精灵', de:'Die Dschinn', en:'The Jinn',
    ha:'Aljanu', hi:'जिन्न', id:'Jin', fa:'جن', ru:'Джинны', tr:'Cinler', ur:'جن', ug:'جىن' },
  { ar:'الشَّيْطَان',    ph:'Ash-Shayṭān',
    sq:'Shejtani', bn:'শয়তান', bs:'Šejtan', zh:'恶魔', de:'Der Satan / Teufel', en:'Satan',
    ha:'Shaidanu', hi:'शैतान', id:'Setan', fa:'شیطان', ru:'Шайтан', tr:'Şeytan', ur:'شیطان', ug:'شەيتان' },
  { ar:'السُّنَّة',      ph:'As-Sunnah',
    sq:'Sunneti', bn:'সুন্নাহ', bs:'Sunnet', zh:'圣训', de:'Prophetentradition', en:"The Prophet's Tradition",
    ha:'Sunnah', hi:'सुन्नह', id:'Sunnah', fa:'سنت', ru:'Сунна', tr:'Sünnet', ur:'سنت', ug:'سۈننەت' },

  // ─── Kategorie 6: Ethik & Charakter ─────────────────────────
  { cat:'الأخلاق · Ethik & Charakter',
    ar:'عَدْل',          ph:'ʿAdl',
    sq:'Drejtësia', bn:'আদল/ন্যায়বিচার', bs:'Pravda', zh:'公正', de:'Gerechtigkeit', en:'Justice',
    ha:'Adalci', hi:'न्याय', id:'Keadilan', fa:'عدل', ru:'Справедливость', tr:'Adalet', ur:'عدل', ug:'ئادالەت' },
  { ar:'رَحْمَة',        ph:'Raḥmah',
    sq:'Mëshira', bn:'রহমত', bs:'Milost', zh:'慈悲', de:'Barmherzigkeit', en:'Mercy / Compassion',
    ha:'Rahama', hi:'रहमत', id:'Rahmat', fa:'رحمت', ru:'Милость', tr:'Rahmet', ur:'رحمت', ug:'رەھمەت' },
  { ar:'أَمَانَة',       ph:'Amānah',
    sq:'Besnikëria', bn:'আমানত', bs:'Povjerenje', zh:'信托', de:'Vertrauen / Treue', en:'Trust / Trustworthiness',
    ha:'Amana', hi:'अमानत', id:'Amanah', fa:'امانت', ru:'Доверие', tr:'Emanet', ur:'امانت', ug:'ئامانەت' },
  { ar:'صِدْق',          ph:'Ṣidq',
    sq:'Sinqeriteti', bn:'সত্যবাদিতা', bs:'Istinitost', zh:'诚实', de:'Wahrhaftigkeit', en:'Truthfulness / Honesty',
    ha:'Gaskiya', hi:'सच्चाई', id:'Kejujuran', fa:'صداقت', ru:'Правдивость', tr:'Doğruluk', ur:'صداقت', ug:'راستلىق' },
  { ar:'كَرَم',          ph:'Karam',
    sq:'Bujaria', bn:'উদারতা', bs:'Plemenitost', zh:'慷慨', de:'Großzügigkeit / Edelmut', en:'Generosity / Nobility',
    ha:'Karimci', hi:'करम', id:'Kemurahan hati', fa:'کرم', ru:'Щедрость', tr:'Cömertlik', ur:'کرم', ug:'كەرەم' },
  { ar:'حِكْمَة',        ph:'Ḥikmah',
    sq:'Urtësia', bn:'হিকমত', bs:'Mudrost', zh:'智慧', de:'Weisheit', en:'Wisdom',
    ha:'Hikima', hi:'हिकमत', id:'Hikmah', fa:'حکمت', ru:'Мудрость', tr:'Hikmet', ur:'حکمت', ug:'ھىكمەت' },
  { ar:'ظُلْم',          ph:'Ẓulm',
    sq:'Padrejtësia', bn:'জুলুম', bs:'Nepravda / Nasilje', zh:'压迫', de:'Ungerechtigkeit / Unterdrückung', en:'Injustice / Oppression',
    ha:'Zalunci', hi:'ज़ुल्म', id:'Kezaliman', fa:'ظلم', ru:'Несправедливость', tr:'Zulüm', ur:'ظلم', ug:'زۇلۇم' },

  // ─── Kategorie 7: Schöpfung & Natur ─────────────────────────
  { cat:'الخلق والطبيعة · Schöpfung & Natur',
    ar:'السَّمَاوَات وَالْأَرْض', ph:'As-Samāwāt wa-l-Arḍ',
    sq:'Qiejt dhe toka', bn:'আসমান ও জমিন', bs:'Nebesa i zemlja', zh:'诸天与大地', de:'Die Himmel und die Erde', en:'The heavens and the earth',
    ha:'Sammai da kasa', hi:'आसमान और ज़मीन', id:'Langit dan bumi', fa:'آسمان‌ها و زمین', ru:'Небеса и земля', tr:'Gökler ve yer', ur:'آسمان اور زمین', ug:'ئاسمان ۋە زېمىن' },
  { ar:'الْمَاء',        ph:'Al-Māʾ',
    sq:'Uji', bn:'পানি', bs:'Voda', zh:'水', de:'Das Wasser', en:'Water',
    ha:'Ruwa', hi:'पानी', id:'Air', fa:'آب', ru:'Вода', tr:'Su', ur:'پانی', ug:'سۇ' },
  { ar:'النُّور',        ph:'An-Nūr',
    sq:'Drita', bn:'নূর/আলো', bs:'Svjetlost', zh:'光明', de:'Das Licht', en:'Light',
    ha:'Haske', hi:'नूर/प्रकाश', id:'Cahaya / Nur', fa:'نور', ru:'Свет', tr:'Nur', ur:'نور', ug:'نۇر' },
  { ar:'الرُّوح',        ph:'Ar-Rūḥ',
    sq:'Shpirti', bn:'রূহ/আত্মা', bs:'Duh / Ruh', zh:'灵魂', de:'Der Geist / Die Seele', en:'The Spirit / Soul',
    ha:'Rai', hi:'रूह', id:'Ruh', fa:'روح', ru:'Дух / Душа', tr:'Ruh', ur:'روح', ug:'روھ' },
  { ar:'الرِّزْق',       ph:'Ar-Rizq',
    sq:'Furnizimi hyjnor', bn:'রিযক', bs:'Nafaka / Opskrba', zh:'天赐', de:'Der Lebensunterhalt (von Gott)', en:"God's provision / Sustenance",
    ha:'Arzikin Allah', hi:'रिज़्क़', id:'Rezeki', fa:'روزی', ru:'Удел / Пропитание', tr:'Rızık', ur:'رزق', ug:'رىزىق' },
  { ar:'الْمَوْت',       ph:'Al-Mawt',
    sq:'Vdekja', bn:'মৃত্যু', bs:'Smrt', zh:'死亡', de:'Der Tod', en:'Death',
    ha:'Mutuwa', hi:'मौत', id:'Kematian', fa:'مرگ', ru:'Смерть', tr:'Ölüm', ur:'موت', ug:'ئۆلۈم' },
  { ar:'الْحَيَاة',      ph:'Al-Ḥayāh',
    sq:'Jeta', bn:'জীবন', bs:'Život', zh:'生命', de:'Das Leben', en:'Life',
    ha:'Rayuwa', hi:'ज़िंदगी', id:'Kehidupan', fa:'زندگی', ru:'Жизнь', tr:'Yaşam / Hayat', ur:'زندگی', ug:'ھايات' },

  // ─── Kategorie 8: Schlüsselformeln ───────────────────────────
  { cat:'الأذكار · Schlüsselformeln',
    ar:'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيم', ph:'Bismi-llāhi r-Raḥmāni r-Raḥīm',
    sq:'Në emër të Allahut, të Gjithëmëshirshmit, Mëshirëplotit', bn:'আল্লাহর নামে যিনি পরম দয়ালু পরম করুণাময়', bs:'U ime Allaha, Milostivog, Samilosnog',
    zh:'奉至仁至慈的安拉之名', de:'Im Namen Allahs, des Allerbarmers, des Barmherzigen', en:'In the name of Allah, the Most Gracious, the Most Merciful',
    ha:'Da sunan Allah, Mai rahama, Mai jin ƙai', hi:'अल्लाह के नाम से जो बड़ा मेहरबान बेहद रहम वाला है', id:'Dengan nama Allah, Yang Maha Pengasih, Yang Maha Penyayang',
    fa:'به نام خداوند بخشنده مهربان', ru:'Во имя Аллаха, Милостивого, Милосердного', tr:"Rahman ve Rahim olan Allah'ın adıyla", ur:'اللہ کے نام سے جو نہایت مہربان رحم کرنے والا ہے', ug:'رەھمان رەھىم ئاللاھنىڭ ئىسمى بىلەن' },
  { ar:'الْحَمْدُ لِلّٰه', ph:'Al-Ḥamdu li-llāh',
    sq:'Lavdi i takon Allahut', bn:'সমস্ত প্রশংসা আল্লাহর', bs:'Hvala Allahu', zh:'赞颂真主', de:'Alles Lob gebührt Allah', en:'All praise is due to Allah',
    ha:'Godiya ta tabbata ga Allah', hi:'सारी तारीफ़ अल्लाह के लिए', id:'Segala puji bagi Allah', fa:'ستایش خدا را', ru:'Хвала Аллаху', tr:"Hamd Allah'a mahsustur", ur:'تمام تعریف اللہ کے لیے', ug:'ھەمدۇ سەنا ئاللاھقا' },
  { ar:'سُبْحَانَ الله',  ph:'Subḥāna-llāh',
    sq:'Lavdi Allahut (i pastër)', bn:'সুবহানাল্লাহ', bs:'Uzvišen neka je Allah', zh:'赞主清净', de:'Gepriesen sei Allah', en:'Glory be to Allah',
    ha:'Tsarki na Allah', hi:'सुभानल्लाह', id:'Maha Suci Allah', fa:'منزه است خدا', ru:'Слава Аллаху', tr:'Subhanallah', ur:'سبحان اللہ', ug:'سۇبھانئاللاھ' },
  { ar:'اللهُ أَكْبَر',  ph:'Allāhu Akbar',
    sq:'Allahu është më i Madhi', bn:'আল্লাহু আকবার', bs:'Allah je Najveći', zh:'主是最伟大的', de:'Allah ist der Größte', en:'Allah is the Greatest',
    ha:'Allah yana da girma', hi:'अल्लाह सबसे बड़ा है', id:'Allah Maha Besar', fa:'خدا بزرگتر است', ru:'Аллах Велик', tr:"Allah en büyüktür", ur:'اللہ سب سے بڑا ہے', ug:'ئاللاھ ئەڭ چوڭ' },
  { ar:'لَا إِلٰهَ إِلَّا اللّٰه', ph:'Lā ilāha illā-llāh',
    sq:'Nuk ka zot tjetër veç Allahut', bn:'আল্লাহ ছাড়া কোনো ইলাহ নেই', bs:'Nema boga osim Allaha', zh:'万物非主，唯有真主', de:'Es gibt keinen Gott außer Allah', en:'There is no god but Allah',
    ha:'Babu wani Allah sai Allah', hi:'अल्लाह के सिवा कोई माबूद नहीं', id:'Tidak ada Tuhan selain Allah', fa:'لا اله الا الله', ru:'Нет бога, кроме Аллаха', tr:"Allah'tan başka ilah yoktur", ur:'اللہ کے سوا کوئی معبود نہیں', ug:'ئاللاھتىن باشقا ئىلاھ يوق' },
  { ar:'الْهِدَايَة',    ph:'Al-Hidāyah',
    sq:'Udhëzimi', bn:'হেদায়েত', bs:'Uputa', zh:'引导', de:'Die Rechtleitung', en:'Guidance',
    ha:'Shiryayya', hi:'हिदायत', id:'Hidayah', fa:'هدایت', ru:'Наставление', tr:'Hidayet', ur:'ہدایت', ug:'ھىدايەت' },
  { ar:'الْمَغْفِرَة',   ph:'Al-Maghfirah',
    sq:'Falja', bn:'মাগফিরাত', bs:'Oprost', zh:'赦罪', de:'Die Vergebung', en:'Forgiveness',
    ha:'Gafara', hi:'मग़फ़िरत', id:'Pengampunan', fa:'مغفرت', ru:'Прощение', tr:'Mağfiret', ur:'مغفرت', ug:'مەغپىرەت' },
  { ar:'الْعِبَادَة',    ph:'Al-ʿIbādah',
    sq:'Adhurimi', bn:'ইবাদত', bs:'Ibadet', zh:'崇拜', de:'Die Anbetung', en:'Worship / Devotion',
    ha:'Bautar', hi:'इबादत', id:'Ibadah', fa:'عبادت', ru:'Поклонение', tr:'İbadet', ur:'عبادت', ug:'ئىبادەت' },
];

/* ═══════════════════════════════════════════════════════════════
   BUILD: WÖRTERBUCH HTML
═══════════════════════════════════════════════════════════════ */
function buildDict(langName, lang) {
  const { code, native, dir, htmlLang } = lang;
  const isRtl = dir === 'rtl';

  // render entries
  let entriesHtml = '';
  let currentCat  = null;
  for (const v of VOCAB) {
    if (v.cat && v.cat !== currentCat) {
      currentCat = v.cat;
      const [ar, de] = v.cat.split(' · ');
      entriesHtml += `
  <div class="cat-head">
    <span class="cat-ar">${ar}</span>
    <span class="cat-de">${de}</span>
  </div>`;
    }
    const translation = v[code] || '—';
    entriesHtml += `
  <div class="entry">
    <div class="entry-ar">
      <span class="word-ar">${v.ar}</span>
      <span class="word-ph">${v.ph}</span>
    </div>
    <div class="entry-tr" lang="${htmlLang}" dir="${dir}">${translation}</div>
  </div>`;
  }

  return `<!DOCTYPE html>
<html lang="${htmlLang}" dir="ltr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wörterbuch · ${langName} · القرآن الكريم</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Noto+Serif:ital,wght@0,300;0,400;1,300&family=Noto+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='56' font-family='serif' fill='%238a5800'>&#x06DE;</text></svg>">
<meta name="theme-color" content="#0f2f1a">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100svh;background:linear-gradient(to right,#1d5a34 0,#1d5a34 3px,#2f7047 3px,#2f7047 180px,transparent 180px,transparent calc(100% - 180px),#2f7047 calc(100% - 180px),#2f7047 calc(100% - 3px),#1d5a34 calc(100% - 3px)) 0 0/100% 100% fixed,#0f2f1a;color:#f2eddc;font-family:'Noto Serif',Georgia,serif;}
.sh{background:#0f2f1a;border-bottom:2px solid rgba(201,168,76,.24);text-align:center;position:relative;z-index:10;flex-shrink:0;padding:0;}
.sh::before,.sh::after{content:'';display:block;height:10px;width:100%;background:#0f3a26 url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PHBvbHlnb24gcG9pbnRzPSI3LjAwLDAuODQgNy45Niw0LjY3IDExLjM2LDIuNjQgOS4zMyw2LjA0IDEzLjE2LDcuMDAgOS4zMyw3Ljk2IDExLjM2LDExLjM2IDcuOTYsOS4zMyA3LjAwLDEzLjE2IDYuMDQsOS4zMyAyLjY0LDExLjM2IDQuNjcsNy45NiAwLjg0LDcuMDAgNC42Nyw2LjA0IDIuNjQsMi42NCA2LjA0LDQuNjciIGZpbGw9InJnYmEoMjAyLDE2OCw3NiwwLjQ4KSIvPjwvc3ZnPg==") 0 0/14px 14px;}
.sh::before{border-bottom:1px solid rgba(201,168,76,.2);}
.sh::after{border-top:1px solid rgba(201,168,76,.2);}
.sh-in{padding:20px 70px 16px;position:relative;z-index:2;}
.sh-title-ar{font-family:'Scheherazade New',serif;font-size:2.2rem;color:#d4a574;direction:rtl;display:block;line-height:1.3;}
.sh-subtitle{font-size:.62rem;letter-spacing:.22em;color:rgba(212,165,116,.5);text-transform:uppercase;display:block;margin-top:6px;}
.sh-native{font-size:.9rem;color:rgba(212,165,116,.75);display:block;margin-top:4px;}
.rule{width:80px;height:1px;background:linear-gradient(to right,transparent,rgba(212,165,116,.4),transparent);margin:14px auto 0;}
/* search */
.search-wrap{position:sticky;top:0;z-index:20;background:#0c2918;border-bottom:1px solid rgba(201,168,76,.18);padding:10px 20px;}
.search-inner{max-width:860px;margin:0 auto;position:relative;}
.search-inp{width:100%;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.28);border-radius:8px;padding:10px 16px 10px 40px;color:#f2eddc;font-family:'Noto Serif',Georgia,serif;font-size:.9rem;outline:none;transition:border-color .2s;}
.search-inp:focus{border-color:rgba(201,168,76,.6);}
.search-inp::placeholder{color:rgba(201,168,76,.35);}
.search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:rgba(201,168,76,.4);pointer-events:none;}
.search-ico svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;}
/* layout */
.main{max-width:960px;margin:0 auto;padding:24px 20px 80px;}
.cat-head{display:flex;align-items:baseline;gap:14px;padding:32px 0 10px;border-bottom:1px solid rgba(201,168,76,.22);margin-bottom:4px;}
.cat-ar{font-family:'Scheherazade New',serif;font-size:1.4rem;color:#d4a574;direction:rtl;}
.cat-de{font-size:.62rem;letter-spacing:.16em;color:rgba(201,168,76,.5);text-transform:uppercase;}
.entries-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
.entry{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid rgba(201,168,76,.1);transition:background .15s;}
.entry:hover{background:rgba(201,168,76,.06);}
.entry.hidden{display:none;}
.entry-ar{display:flex;flex-direction:column;gap:3px;}
.word-ar{font-family:'Scheherazade New',serif;font-size:1.9rem;color:#d4a574;direction:rtl;line-height:1.3;}
.word-ph{font-size:.72rem;color:rgba(201,168,76,.55);letter-spacing:.04em;font-style:italic;}
.entry-tr{font-size:.92rem;line-height:1.6;color:rgba(242,237,220,.88);${isRtl ? 'direction:rtl;text-align:right;' : ''}}
/* navigation */
.bot-nav{position:fixed;bottom:0;left:0;right:0;background:#0f2f1a;border-top:1px solid rgba(201,168,76,.18);display:flex;align-items:center;justify-content:center;gap:20px;padding:12px 24px;z-index:30;}
.bn{padding:8px 22px;color:rgba(212,165,116,.72);text-decoration:none;font-family:'Scheherazade New',serif;font-size:.95rem;border:1px solid rgba(201,168,76,.22);border-radius:6px;transition:color .2s,background .2s,border-color .2s;}
.bn:hover{color:#e5c791;background:rgba(201,168,76,.08);border-color:rgba(201,168,76,.5);}
.count{font-size:.7rem;color:rgba(201,168,76,.4);letter-spacing:.1em;}
@media(max-width:660px){.entry{grid-template-columns:1fr;gap:6px;}.word-ar{font-size:1.5rem;}}
</style>
</head><body>
<div class="sh">
  <div class="sh-in">
    <span class="sh-title-ar">معجم القرآن</span>
    <span class="sh-subtitle">WÖRTERBUCH · KORANISCHES ARABISCH</span>
    <span class="sh-native">${native}</span>
    <div class="rule"></div>
  </div>
</div>
<div class="search-wrap">
  <div class="search-inner">
    <div class="search-ico"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
    <input class="search-inp" id="q" type="search" placeholder="Arabisch, Umschrift oder ${native} …" autocomplete="off">
  </div>
</div>
<main class="main" id="main">
${entriesHtml}
</main>
<nav class="bot-nav">
  <a class="bn" href="../intro.html">&#8592; Zur Sure-Übersicht</a>
  <span class="count" id="cnt"></span>
  <a class="bn" href="../../../../cover.html">Alle Sprachen &#8594;</a>
</nav>
<script>
(function(){
  var inp = document.getElementById('q');
  var cnt = document.getElementById('cnt');
  var entries = document.querySelectorAll('.entry');
  var catHeads = document.querySelectorAll('.cat-head');
  function update(){
    var q = inp.value.trim().toLowerCase();
    var vis = 0;
    entries.forEach(function(e){
      var t = e.textContent.toLowerCase();
      if(!q || t.includes(q)){ e.classList.remove('hidden'); vis++; }
      else { e.classList.add('hidden'); }
    });
    catHeads.forEach(function(c){
      var next = c.nextElementSibling;
      var show = false;
      while(next && !next.classList.contains('cat-head')){
        if(!next.classList.contains('hidden')){ show = true; break; }
        next = next.nextElementSibling;
      }
      c.style.display = show || !q ? '' : 'none';
    });
    cnt.textContent = q ? vis + ' Ergebnisse' : entries.length + ' Einträge';
  }
  inp.addEventListener('input', update);
  update();
})();
</script>
</body></html>`;
}

/* ═══════════════════════════════════════════════════════════════
   BUILD: COVER GRID PATCH  (2 per row, archive style)
═══════════════════════════════════════════════════════════════ */
function patchGrid(html, tileW) {
  // Replace flex grid with 2-column CSS grid
  return html
    .replace(
      /\.grid\{[^}]+\}/,
      `.grid{display:grid;grid-template-columns:repeat(2,${tileW}px);justify-content:center;gap:28px;padding:24px 28px 80px;max-width:${tileW * 2 + 80}px;margin:0 auto;position:relative;z-index:1;}`
    )
    .replace(
      /\.tile\{[^}]+\}/,
      `.tile{display:flex;flex-direction:column;align-items:center;text-decoration:none;width:${tileW}px;transition:transform .2s;}`
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
let dictCreated = 0;
for (const [langName, lang] of Object.entries(LANGS)) {
  const langDir = path.join(QURAN_OVER, langName);
  if (!fs.existsSync(langDir)) { console.warn(`  ⚠ skip ${langName} (dir not found)`); continue; }
  const html = buildDict(langName, lang);
  const out  = path.join(langDir, 'woerterbuch.html');
  fs.writeFileSync(out, html, 'utf8');
  console.log(`  ✓ ${langName}/woerterbuch.html`);
  dictCreated++;
}
console.log(`\n  Wörterbücher erstellt: ${dictCreated}`);

// Patch Quran cover (tiles 220px wide)
let qcov = fs.readFileSync(QURAN_COV, 'utf8');
qcov = patchGrid(qcov, 220);
fs.writeFileSync(QURAN_COV, qcov, 'utf8');
console.log('  ✓ dist-alquran/cover.html → 2-per-row grid');

// Patch Bible cover (tiles 210px wide)
let bcov = fs.readFileSync(BIBLE_COV, 'utf8');
bcov = patchGrid(bcov, 210);
fs.writeFileSync(BIBLE_COV, bcov, 'utf8');
console.log('  ✓ dist-diebibel/cover.html → 2-per-row grid');

console.log('\n  Fertig. Commit & push folgt.');
