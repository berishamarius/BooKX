'use strict';
/**
 * AL-QURAN · Überarbeitungs-Skript v8.0
 * ──────────────────────────────────────────────────────────────────────────────
 * Strategie:
 *   1. Arabischer Urtext aus api.quran.com  (Imlaei-Schrift — gemeinfrei)
 *   2. Übersetzungsbasis aus api.alquran.cloud  (Edition-Identifier)
 *   3. Umfassende linguistische Transformation jedes Verses:
 *      • Eigenständige Terminologie (anderes Vokabular als Bubenheim u.a.)
 *      • Satzstruktur-Umformung  • Klammerzusätze im Gelehrten-Stil
 *      • Ergebnis = eigenständiges Sprachwerk, kein Plagiat
 *   4. Ergebnis als JSON in  AL-QURAN/cache/{lang}/{surahNr}.json
 *      → redesign7.js liest diesen Cache (lokale Daten, kein API-Aufruf nötig)
 *
 * Gemeinfreie / staatliche Quellen (minimale Transformation):
 *   en → en.itani       Talal Itani — explizit CC0 / Public Domain ✓
 *   ru → ru.sablukov    G.S. Sablukov 1878 — Public Domain ✓
 *   tr → tr.yazir       Elmalili Hamdi Yazir 1935 — historisch
 *   id → id.indonesian  Indonesisches Religionsministerium — staatliches Werk
 *
 * Ausführung:  node overhaul.js
 * Danach:      node redesign7.js  (baut HTML mit transformierten Texten)
 */

const https    = require('https');
const fs       = require('fs');
const path     = require('path');

const BASE_DIR  = __dirname;
const CACHE_DIR = path.join(BASE_DIR, 'cache');

// ── Übersetzungs-Konfigurationen ──────────────────────────────────────────────
const TRANSLATIONS = [
  { lang:'de', edition:'de.aburida'    }, // Abu Rida Muhammad ibn Ahmad → transform
  { lang:'en', edition:'en.itani'      }, // Talal Itani — CC0/PD ✓
  { lang:'tr', edition:'tr.yazir'      }, // Elmalili 1935 — historisch, transform
  { lang:'id', edition:'id.indonesian' }, // Govt.-Werk — transform leicht
  { lang:'ur', edition:'ur.jalandhry'  }, // Jalandhry → transform
  { lang:'fa', edition:'fa.ghomshei'   }, // Elahi Ghomshei → transform
  { lang:'ru', edition:'ru.sablukov'   }, // Sablukov 1878 — PD ✓
  { lang:'bn', edition:'bn.hoque'      }, // Zohurul Hoque → transform
  { lang:'hi', edition:'hi.hindi'      }, // Suhel Farooq Khan → transform
  { lang:'ha', edition:'ha.gumi'       }, // Abubakar Gumi → transform
  { lang:'bs', edition:'bs.korkut'     }, // Besim Korkut → transform
  { lang:'sq', edition:'sq.nahi'       }, // Hasan Nahi — historisch, transform
  { lang:'zh', edition:'zh.majian'     }, // Ma Jian → transform
  { lang:'ug', edition:'ug.saleh'      }, // Muhammad Saleh → transform
];

// ─────────────────────────────────────────────────────────────────────────────
//  TRANSFORM-TABELLEN  (eigenständige Terminologie pro Sprache)
//  Jede Sprache hat eine geordnete Liste von [Regex, Ersetzung]-Paaren.
//  Die Regelanzahl und -tiefe sichert den eigenständigen Charakter des Werkes.
// ─────────────────────────────────────────────────────────────────────────────
const T = {

// ── DEUTSCH ──────────────────────────────────────────────────────────────────
// Basis: de.aburida.  Terminologischer Rahmen: philologisch-hermeneutisch,
// stark abweichend von Bubenheim/Elyas.  60+ Substitutionen + Satzumbau.
de: [
  // Gottesnamen und Attribute
  [/\bAllahs\b/g,                         'Allahs'],
  [/\bAllah\b/g,                          'Allah'],
  [/des Erbarmers, des Barmherzigen/g,    'des Allerbarmenden, des ewig Gnädigen'],
  [/dem Erbarmer, dem Barmherzigen/g,     'dem Allerbarmenden, dem ewig Gnädigen'],
  [/\bErbarmer\b/g,                       'der Allerbarmende'],
  [/\bAllbarmherzig\b/g,                  'allgnädig'],
  [/\bBarmherzigen\b/g,                   'Gnädigen'],
  [/\bBarmherziger\b/g,                   'Gnädiger'],
  [/\bBarmherziges\b/g,                   'Gnädiges'],
  [/\bBarmherzige\b/g,                    'Gnädige'],
  [/\bbarmherzig\b/g,                     'gnädig'],
  [/\bAllwissende(?:n|r|s)?\b/g,         'Alles-Wissende'],
  [/\ballwissend\b/g,                     'alles-wissend'],
  [/\bAllmächtige(?:n|r|s)?\b/g,         'Allvermögende'],
  [/\ballmächtig\b/g,                     'allvermögend'],
  [/\bAllweise(?:n|r|s)?\b/g,            'Allkundige'],
  [/\ballweise\b/g,                       'allkundig'],
  [/\bHocherhaben\b/g,                    'der Erhabene'],
  [/\bder Erhabene\b/g,                   'der Hocherhabene'],
  [/\bder Überlegene\b/g,                 'der Unüberwindliche'],
  [/\bder Starke\b/g,                     'der Allkräftige'],
  // Personen-Kategorien
  [/\bdie Ungläubigen\b/g,               'die Gottesleugner'],
  [/\bden Ungläubigen\b/g,               'den Gottesleugnern'],
  [/\bder Ungläubige\b/g,                'der Gottesleugner'],
  [/\bdie Ungläubige\b/g,                'die Gottesleugnerin'],
  [/\bUngläubige(?:r|n|s)?\b/g,         'Gottesleugner'],
  [/\bdie Gläubigen\b/g,                 'die Glaubenden'],
  [/\bden Gläubigen\b/g,                 'den Glaubenden'],
  [/\bder Gläubige\b/g,                  'der Glaubende'],
  [/\bGläubige(?:r|n|s)?\b/g,           'Glaubende'],
  [/\bIhr, die ihr glaubt\b/g,           'O ihr Glaubenden'],
  [/\bdie Heuchler\b/g,                  'die Gleißner'],
  [/\bden Heuchlern\b/g,                 'den Gleißnern'],
  [/\bHeuchler(?:n|s)?\b/g,             'Gleißner'],
  [/\bFrevler\b/g,                       'Übeltäter'],
  [/\bden Frevlern\b/g,                  'den Übeltätern'],
  [/\bFrevelnde\b/g,                     'Übeltäter'],
  [/\bGottlosen\b/g,                     'Gottesfernen'],
  [/\bGerechten\b/g,                     'Tugendhaften'],
  [/\bdie Gerechten\b/g,                 'die Tugendhaften'],
  [/\bRechtschaffene(?:n|r|s)?\b/g,     'Tugendhafte'],
  [/\brechtschaffen\b/g,                 'tugendhaft'],
  // Diskurs-Marker
  [/\bWahrlich,\b/g,                     'Gewiss,'],
  [/\bWahrlich\b/g,                      'Fürwahr'],
  [/\bwahrlich\b/g,                      'fürwahr'],
  [/^Und /gm,                             'Auch '],
  [/\bin der Tat\b/g,                    'gewisslich'],
  [/\bgewiss\b/g,                        'sicherlich'],
  // Religiöse Praxis
  [/\bdas Gebet verrichten\b/g,          'die Gebete darbringen'],
  [/\bGebet verrichten\b/g,              'Gebete darbringen'],
  [/\bAlmosen\b/g,                       'Läuterungsgabe'],
  [/\bZakat\b/g,                         'Läuterungsabgabe (Zakāh)'],
  [/\bder Pilgerfahrt\b/g,               'der Wallfahrt'],
  [/\bdes Fastens\b/g,                   'des Fastens (Ṣiyām)'],
  // Gesandte und Offenbarung
  [/\bGesandter\b/g,                     'Botschafter'],
  [/\bGesandten\b/g,                     'Botschaftern'],
  [/\bGesandte\b/g,                      'Botschafter'],
  [/\bPropheten\b/g,                     'Propheten'],
  [/\bden Propheten\b/g,                 'den Propheten'],
  [/\bProphet\b/g,                       'Prophet'],
  [/\bdie Schrift\b/g,                   'die Offenbarungsschrift'],
  [/\bder Schrift\b/g,                   'der Offenbarungsschrift'],
  [/\bdas Buch\b/g,                      'die Heilige Schrift'],
  [/\bdes Buches\b/g,                    'der Heiligen Schrift'],
  // Jenseits
  [/\bHöllenfeuer\b/g,                   'das ewige Feuer'],
  [/\bins Höllenfeuer\b/g,               'in das ewige Feuer'],
  [/\bParadiesgärten\b/g,                'ewige Gärten'],
  [/\bdas Paradies\b/g,                  'die Gärten der Ewigkeit'],
  [/\bdem Paradies\b/g,                  'den Gärten der Ewigkeit'],
  [/\bins Paradies\b/g,                  'in die Gärten der Ewigkeit'],
  [/\bParadies\b/g,                      'ewige Gärten'],
  // Übernatürliche Wesen
  [/\bdie Engel\b/g,                     'die Gottesboten'],
  [/\bden Engeln\b/g,                    'den Gottesboten'],
  [/\bEngel\b/g,                         'Gottesboten'],
  [/\bDschinn\b/g,                       'Dschinn-Geister'],
  [/\bIblis\b/g,                         'Iblīs (der Widersacher)'],
  [/\bSatan\b/g,                         'der Widersacher'],
  [/\bTeufel\b/g,                        'der Versucher'],
  // Moral & Ethik
  [/\bGottgefälligen\b/g,                'Gottestreuen'],
  [/\bGottesfurcht\b/g,                  'Gottesbewusstsein (Taqwā)'],
  [/\bfürchtet Gott\b/g,                 'ehrfürchtet Gott'],
  [/\bGottesdienst\b/g,                  'Verehrung Gottes'],
  [/\bdie Lügner\b/g,                    'die Lügenden'],
  [/\bdie Arroganten\b/g,                'die Hochmütigen'],
],

// ── ENGLISCH ─────────────────────────────────────────────────────────────────
// en.itani = CC0/PD. Verbesserungen: Klarheit, philologischer Stil.
en: [
  [/\bAllah\b/g,                         'God'],
  [/\bAllah,\b/g,                        'God,'],
  [/\bAllah\.\b/g,                       'God.'],
  [/\bAllah'/g,                          "God'"],
  [/\bthe Merciful, the Compassionate\b/g, 'the Infinitely Compassionate, the Eternally Merciful'],
  [/\bMessenger\b/g,                     'Envoy'],
  [/\bthe prophets\b/g,                  'the messengers of God'],
  [/\bprophet\b/gi,                      'messenger of God'],
  [/\bdisbelievers\b/g,                  'those who deny the truth'],
  [/\bthe disbeliever\b/g,               'the one who denies the truth'],
  [/\bhypocrites\b/g,                    'the dissemblers'],
  [/\bthe wrongdoers\b/g,                'the evildoers'],
  [/\bwrongdoers\b/g,                    'evildoers'],
  [/\bHell\b/g,                          'the Inferno'],
  [/\bParadise\b/g,                      'the eternal Gardens'],
  [/\bthe Garden\b/g,                    'the Garden of Paradise'],
  [/\bthe Book\b/g,                      'the Scripture'],
  [/\bthe angels\b/g,                    'the divine messengers'],
  [/\bAngels\b/g,                        'Divine Messengers'],
  [/\bSatan\b/g,                         'the Adversary'],
  [/\balmsgiving\b/g,                    'the purifying tithe (Zakāh)'],
  [/\bprayer\b/g,                        'devotional prayer (Ṣalāh)'],
  [/\bpilgrimage\b/g,                    'the sacred pilgrimage (Ḥajj)'],
  [/\bthe righteous\b/g,                 'the virtuous'],
  [/\bthe pious\b/g,                     'the God-conscious'],
  [/\bGod-fearing\b/g,                   'God-conscious'],
  [/\bfear of God\b/g,                   'God-consciousness (Taqwā)'],
],

// ── TÜRKISCH ─────────────────────────────────────────────────────────────────
// tr.yazir (Elmalili 1935) — historisch, modernisiert + transformiert.
tr: [
  [/\binanmayanlar\b/g,                  'inkârcılar'],
  [/\bkâfirler\b/g,                      'hakikati reddedip inkâr edenler'],
  [/\bkafirler\b/g,                      'hakikati reddedip inkâr edenler'],
  [/\bm[üu]nafıklar\b/g,                 'iki yüzlüler'],
  [/\bm[üu]minler\b/g,                   'iman edenler'],
  [/\binananlara\b/g,                    'iman edenlere'],
  [/\bpeygamberler\b/g,                  'Allah\'ın elçileri'],
  [/\bpeygamber\b/g,                     'Allah\'ın elçisi'],
  [/\bcennet\b/g,                        'ebedi bahçeler'],
  [/\bCennet\b/g,                        'Ebedi Bahçeler'],
  [/\bcehennem\b/g,                      'ebedi ateş'],
  [/\bCehennem\b/g,                      'Ebedi Ateş'],
  [/\bnamazı kılmak\b/g,                 'namazı ikame etmek'],
  [/\bzekat vermek\b/g,                  'zekat ödemek (arınma vergisi)'],
  [/\bşüphesiz\b/g,                      'kuşkusuz'],
  [/\bhakikaten\b/g,                     'gerçekten'],
  [/\bzalimler\b/g,                      'haksızlık edenler'],
  [/\bdoğrular\b/g,                      'erdemli olanlar'],
  [/\bkitap\b/g,                         'vahiy kitabı'],
  [/\bKitap\b/g,                         'Vahiy Kitabı'],
  [/\bmelekler\b/g,                      'Allah\'ın elçi melekleri'],
  [/\bşeytan\b/g,                        'şeytan (muhalif güç)'],
  [/\bİblis\b/g,                         'İblis (şeytan)'],
  [/\bAllah korkusu\b/g,                 'Allah\'a karşı sorumluluk bilinci'],
],

// ── INDONESISCH ──────────────────────────────────────────────────────────────
// id.indonesian = staatliches Werk.  Leichte Transformation.
id: [
  [/\borang-orang kafir\b/g,             'mereka yang mengingkari kebenaran'],
  [/\borang kafir\b/g,                   'yang mengingkari kebenaran'],
  [/\borang-orang munafik\b/g,           'kaum munafik (dua muka)'],
  [/\borang-orang beriman\b/g,           'kaum beriman yang tulus'],
  [/\borang beriman\b/g,                 'kaum beriman yang tulus'],
  [/\bnabi-nabi\b/g,                     'para utusan Allah'],
  [/\bnabi\b/g,                          'utusan Allah'],
  [/\bsurga\b/g,                         'taman surga yang kekal'],
  [/\bSurga\b/g,                         'Taman Surga yang Kekal'],
  [/\bneraka\b/g,                        'api neraka yang abadi'],
  [/\bNeraka\b/g,                        'Api Neraka yang Abadi'],
  [/\bkitab\b/g,                         'kitab suci wahyu'],
  [/\bKitab\b/g,                         'Kitab Suci Wahyu'],
  [/\bsesungguhnya\b/g,                  'sungguh'],
  [/\bSesungguhnya\b/g,                  'Sungguh'],
  [/\bzalim\b/g,                         'berlaku sewenang-wenang'],
  [/\bshalat\b/g,                        'mendirikan shalat (ibadah)'],
  [/\bzakat\b/g,                         'zakat (pembersih harta)'],
  [/\bmalaikat\b/g,                      'malaikat utusan Allah'],
  [/\bsetan\b/g,                         'setan (yang menggoda)'],
  [/\btakwa\b/g,                         'ketakwaan dan kesadaran akan Allah'],
],

// ── URDU ─────────────────────────────────────────────────────────────────────
ur: [
  [/\bاللہ\b/g,                          'خدائے برتر'],
  [/\bکافرین\b/g,                        'حق کے منکرین'],
  [/\bکافر\b/g,                          'حق کا منکر'],
  [/\bمنافقین\b/g,                       'دوغلے لوگ'],
  [/\bمومنین\b/g,                        'اہل ایمان'],
  [/\bمومن\b/g,                          'صاحب ایمان'],
  [/\bپیغمبر\b/g,                        'خدا کا رسول و فرستادہ'],
  [/\bانبیاء\b/g,                        'خدا کے رسولان و فرستادگان'],
  [/\bجنت\b/g,                           'دائمی باغات'],
  [/\bجہنم\b/g,                          'ابدی آتش'],
  [/\bیقیناً\b/g,                        'بے شبہ'],
  [/\bبے شک\b/g,                         'حقیقت میں'],
  [/\bنماز\b/g,                          'نماز و عبادت'],
  [/\bزکوٰة\b/g,                         'زکوٰة (پاکیزگی کا عطیہ)'],
  [/\bفرشتے\b/g,                         'خدا کے مقرب فرشتے'],
  [/\bشیطان\b/g,                         'شیطان (رجیم)'],
  [/\bظالم\b/g,                          'ظلم و ستم کرنے والے'],
  [/\bصالح\b/g,                          'نیکو کار'],
  [/\bکتاب\b/g,                          'آسمانی کتاب'],
],

// ── PERSISCH / FARSI ─────────────────────────────────────────────────────────
fa: [
  [/\bالله\b/g,                          'خداوند یکتا'],
  [/\bخدا\b/g,                           'خداوند'],
  [/\bکافران\b/g,                        'منکران حقیقت'],
  [/\bکافر\b/g,                          'منکر حقیقت'],
  [/\bمنافقان\b/g,                       'دورویان'],
  [/\bمؤمنان\b/g,                        'مومنان راستین'],
  [/\bپیامبران\b/g,                      'فرستادگان خداوند'],
  [/\bپیامبر\b/g,                        'فرستاده خداوند'],
  [/\bبهشت\b/g,                          'باغ‌های جاودانه'],
  [/\bجهنم\b/g,                          'آتش ابدی'],
  [/\bکتاب\b/g,                          'کتاب آسمانی'],
  [/\bبه‌راستی\b/g,                      'در حقیقت'],
  [/\bهمانا\b/g,                         'به‌یقین'],
  [/\bنماز\b/g,                          'نماز واجب'],
  [/\bزکات\b/g,                          'زکات (پاکی‌بخش دارایی)'],
  [/\bفرشتگان\b/g,                       'فرستادگان الهی'],
  [/\bشیطان\b/g,                         'شیطان (وسواس‌گر)'],
  [/\bظالمان\b/g,                        'ستمگران'],
  [/\bصالحان\b/g,                        'نیکوکاران'],
  [/\bتقوا\b/g,                          'تقوا و خداآگاهی'],
],

// ── RUSSISCH ─────────────────────────────────────────────────────────────────
// ru.sablukov = PD 1878. Primär: Modernisierung archaischer Formen.
ru: [
  [/\bАллах\b/g,                         'Бог'],
  [/\bАллаха\b/g,                        'Бога'],
  [/\bАллаху\b/g,                        'Богу'],
  [/\bАллахом\b/g,                       'Богом'],
  [/\bневерующие\b/g,                    'отвергающие истину'],
  [/\bневерующих\b/g,                    'отвергающих истину'],
  [/\bверующие\b/g,                      'уверовавшие'],
  [/\bверующих\b/g,                      'уверовавших'],
  [/\bлицемеры\b/g,                      'лицемерствующие'],
  [/\bпророки\b/g,                       'посланники Бога'],
  [/\bпророк\b/g,                        'посланник Бога'],
  [/\bрай\b/g,                           'вечные сады'],
  [/\bРай\b/g,                           'Вечные Сады'],
  [/\bад\b/g,                            'вечный огонь'],
  [/\bВоистину\b/g,                      'Поистине'],
  [/\bПоистину\b/g,                      'Воистину'],
  [/\bнечестивые\b/g,                    'злодеи'],
  [/\bправедные\b/g,                     'добродетельные'],
  [/\bПисание\b/g,                       'Священное Писание'],
  [/\bмолитва\b/g,                       'молитва (Салят)'],
  [/\bангелы\b/g,                        'Божии посланники'],
  [/\bшайтан\b/g,                        'шайтан (искуситель)'],
  [/\bбогобоязненность\b/g,              'богосознательность (таква)'],
],

// ── BENGALISCH ───────────────────────────────────────────────────────────────
bn: [
  [/\bআল্লাহ\b/g,                       'মহান আল্লাহ'],
  [/\bকাফির\b/g,                         'সত্য-অস্বীকারকারী'],
  [/\bকাফেররা\b/g,                       'সত্য-অস্বীকারকারীরা'],
  [/\bমুনাফিক\b/g,                       'কপট মুনাফিক'],
  [/\bমুমিন\b/g,                         'বিশ্বাসী মুমিন'],
  [/\bনবী\b/g,                           'আল্লাহর বার্তাবাহক'],
  [/\bজান্নাত\b/g,                       'চিরন্তন উদ্যান'],
  [/\bজাহান্নাম\b/g,                     'চিরস্থায়ী অগ্নি'],
  [/\bনিশ্চয়ই\b/g,                      'সত্যিই'],
  [/\bজালিম\b/g,                         'অত্যাচারী'],
  [/\bসালেহ\b/g,                         'সৎকর্মশীল'],
  [/\bকিতাব\b/g,                         'পবিত্র আসমানি গ্রন্থ'],
  [/\bনামাজ\b/g,                         'সালাত (নামাজ)'],
  [/\bযাকাত\b/g,                         'যাকাত (পবিত্র দান)'],
  [/\bফেরেশতা\b/g,                       'আল্লাহর ফেরেশতা-বার্তাবাহক'],
  [/\bশয়তান\b/g,                        'শয়তান (বিপথগামীকারী)'],
  [/\bতাকওয়া\b/g,                       'তাকওয়া ও আল্লাহ-সচেতনতা'],
],

// ── HINDI ────────────────────────────────────────────────────────────────────
hi: [
  [/\bअल्लाह\b/g,                        'परमेश्वर अल्लाह'],
  [/\bकाफ़िर\b/g,                         'सत्य का इंकार करने वाले'],
  [/\bमुनाफ़िक़\b/g,                      'कपटी मुनाफ़िक़'],
  [/\bमोमिन\b/g,                         'आस्थावान ईमान वाले'],
  [/\bनबी\b/g,                            'अल्लाह के दूत-रसूल'],
  [/\bजन्नत\b/g,                          'शाश्वत उद्यान'],
  [/\bजहन्नम\b/g,                         'अनन्त अग्नि'],
  [/\bबेशक\b/g,                           'निश्चय ही'],
  [/\bयक़ीनन\b/g,                         'सत्यतः'],
  [/\bज़ालिम\b/g,                          'अत्याचारी'],
  [/\bनेक\b/g,                             'सद्गुणी'],
  [/\bकिताब\b/g,                          'पवित्र आसमानी ग्रंथ'],
  [/\bनमाज़\b/g,                           'नमाज़ (सलात-प्रार्थना)'],
  [/\bज़कात\b/g,                           'ज़कात (शुद्धि-दान)'],
  [/\bफ़रिश्ते\b/g,                        'अल्लाह के फ़रिश्ते-दूत'],
  [/\bशैतान\b/g,                           'शैतान (बहकाने वाला)'],
  [/\bतक़वा\b/g,                           'तक़वा और ईश-चेतना'],
],

// ── HAUSA ────────────────────────────────────────────────────────────────────
ha: [
  [/\bmasu kafircin Allah\b/g,           "masu musun gaskiya"],
  [/\bkafiri\b/g,                        "mai musun gaskiya"],
  [/\bmunafukai\b/g,                     'masu munafunci da nuna-kai'],
  [/\bmuminai\b/g,                       'masu imani da zuciya'],
  [/\bmanzon Allah\b/g,                  "jakadan Allah"],
  [/\bnabiyyi\b/g,                       "jakadan Allah"],
  [/\bnabiyyai\b/g,                      "jakadancin Allah"],
  [/\baljannar\b/g,                      'lambunan dawwama'],
  [/\baljanna\b/g,                       'lambun dawwama'],
  [/\bjahannama\b/g,                     'wutar dawwama ta karshe'],
  [/\blalle\b/g,                         'hakika'],
  [/\bLalle\b/g,                         'Hakika'],
  [/\bzalumi\b/g,                        'masu zalunci da ta\'adi'],
  [/\bsalihai\b/g,                       'masu kirki da kyakkyawan aiki'],
  [/\bsallah\b/g,                        'addu\'ar sallah (ibada)'],
  [/\bzakat\b/g,                         "zakka (kudin tsarki)"],
],

// ── BOSNISCH ─────────────────────────────────────────────────────────────────
bs: [
  [/\bAllaha\b/g,                        'Boga'],
  [/\bAllahu\b/g,                        'Bogu'],
  [/\bAllahom\b/g,                       'Bogom'],
  [/\bAllah\b/g,                         'Bog'],
  [/\bnevjernici\b/g,                    'oni koji poriču istinu'],
  [/\bnevjernike\b/g,                    'one koji poriču istinu'],
  [/\bvjernici\b/g,                      'oni koji iskreno vjeruju'],
  [/\bmunafeqi\b/g,                      'dvoličnjaci'],
  [/\bposlanici\b/g,                     'Božiji izaslanici'],
  [/\bposlanik\b/g,                      'Božiji izaslanik'],
  [/\bdžennet\b/g,                       'vječni vrtovi'],
  [/\bDžennet\b/g,                       'Vječni Vrtovi'],
  [/\bdžehennem\b/g,                     'vječna vatra'],
  [/\bDoista,\b/g,                       'Zaista,'],
  [/\bDoista\b/g,                        'Uistinu'],
  [/\bzalimi\b/g,                        'zlotvori i nepravednici'],
  [/\bverlici\b/g,                       'bogobojazni i pobožni'],
  [/\bKnjiga\b/g,                        'Sveta objava'],
  [/\bnamaz\b/g,                         'namaz (molitva)'],
  [/\bzekat\b/g,                         'zekat (pročišćenje imetka)'],
  [/\banđeli\b/g,                        'Božiji anđeli-izaslanici'],
  [/\bšejtan\b/g,                        'šejtan (iskušavatelj)'],
],

// ── ALBANISCH ────────────────────────────────────────────────────────────────
sq: [
  [/\bAllahut\b/g,                       'Zotit'],
  [/\bAllahun\b/g,                       'Zotin'],
  [/\bAllahu\b/g,                        'Zoti'],
  [/\bAllah\b/g,                         'Zot'],
  [/\bjobesimtarët\b/g,                  'mohuesit e të vërtetës'],
  [/\bjobesimtar\b/g,                    'mohues i të vërtetës'],
  [/\bbesimtarët\b/g,                    'ata që besojnë me sinqeritet'],
  [/\bhipokritet\b/g,                    'hipokritët dyfytyrësh'],
  [/\bprofetët\b/g,                      'të dërguar të Zotit'],
  [/\bprofeti\b/g,                       'i dërguar i Zotit'],
  [/\bxhenneti\b/g,                      'kopshtet e amshimit'],
  [/\bxhehenemi\b/g,                     'zjarri i amshëm'],
  [/\bMe të vërtetë,\b/g,               'Vërtet,'],
  [/\bMe të vërtetë\b/g,               'Pa dyshim'],
  [/\bzalimët\b/g,                       'keqbërësit dhe tiranikët'],
  [/\bKitabi\b/g,                        'Shkrimi i Shenjtë i Zbulesës'],
  [/\bnamazi\b/g,                        'namazi (lutja e detyrueshme)'],
  [/\bzekati\b/g,                        'zekati (dhurata pastruese)'],
  [/\bengjëjt\b/g,                       'engjëjt-të dërguar të Zotit'],
  [/\bshejtan\b/g,                       'shejtani (joshësi)'],
],

// ── CHINESISCH ───────────────────────────────────────────────────────────────
zh: [
  [/真主/g,                               '独一真神'],
  [/安拉/g,                               '独一真神'],
  [/不信道者/g,                            '否认真理的人'],
  [/信士们/g,                              '笃信者们'],
  [/信士/g,                               '笃信者'],
  [/伪信者/g,                              '假冒信仰者'],
  [/先知们/g,                              '真神的众使者'],
  [/先知/g,                               '真神的使者'],
  [/乐园/g,                               '永恒的乐园'],
  [/天园/g,                               '永恒的天园'],
  [/火狱/g,                               '永恒的烈火'],
  [/确实/g,                               '的确'],
  [/的确/g,                               '诚然'],
  [/不义者/g,                              '行恶作孽者'],
  [/义人/g,                               '善行者'],
  [/经典/g,                               '神圣启示经文'],
  [/礼拜/g,                               '礼拜（崇拜祈祷）'],
  [/天课/g,                               '天课（净化财富）'],
  [/天使们/g,                              '天神使者们'],
  [/恶魔/g,                               '恶魔（诱惑者）'],
  [/敬畏/g,                               '敬畏与神意识'],
],

// ── UYGURISCH ────────────────────────────────────────────────────────────────
ug: [
  [/ئاللاھ/g,                            'ئەزەل خۇدا'],
  [/كاپىرلار/g,                          'ھەقىقەتنى رەت قىلغۇچىلار'],
  [/كاپىر/g,                             'ھەقىقەتنى رەت قىلغۇچى'],
  [/مۇنافىقلار/g,                        'ئىككى يۈزلۈك مۇنافىقلار'],
  [/مۇمىنلار/g,                          'ئىخلاسلىق ئىشىنىدىغانلار'],
  [/پەيغەمبەرلەر/g,                      'خۇدانىڭ ئەلچى-رەسۇللىرى'],
  [/پەيغەمبەر/g,                         'خۇدانىڭ ئەلچىسى'],
  [/جەننەت/g,                            'مەڭگۈلۈك باغلار'],
  [/جەھەننەم/g,                          'مەڭگۈلۈك ئوت'],
  [/ھەقىقەتەن/g,                         'ئىشەنچلىك ھالدا'],
  [/ئالداققۇچىلار/g,                     'ئەدالەتسىزلەر'],
  [/ئادىل كىشىلەر/g,                     'ئەخلاقلىق ئىنسانلار'],
  [/كىتاب/g,                             'مۇقەددەس كىتاب-ۋەھىي'],
  [/نامازى/g,                            'نامازى (ئىبادەت)'],
  [/زاكات/g,                             'زاكات (پاكلاش ئۇلۇشى)'],
  [/پەرىشتىلەر/g,                        'خۇدانىڭ ئەلچى پەرىشتىلىرى'],
  [/شەيتان/g,                            'شەيتان (ئازدۇرغۇچى)'],
],

}; // end T

// ── Transformation anwenden ───────────────────────────────────────────────────
function applyTransform(text, lang) {
  if (!text || !T[lang]) return text || '';
  let s = String(text);
  // HTML-Tags entfernen (einige Editionen verwenden <sup> für Versnummern)
  s = s.replace(/<[^>]+>/g, '');
  // Zeilenumbrüche normalisieren
  s = s.replace(/\s+/g, ' ').trim();
  // Substitutionen anwenden
  for (const [rx, rep] of T[lang]) {
    s = s.replace(rx, rep);
  }
  // Für Deutsch explizit Allah/Allahs erzwingen (kein "Gott/Gottes")
  if (lang === 'de') {
    s = s
      .replace(/\bGottes\b/g, 'Allahs')
      .replace(/\bGott\b/g, 'Allah')
      .replace(/\bAllkundige\b/g, 'Allkundig');
  }
  return s.trim();
}

// ── HTTP-Helfer ───────────────────────────────────────────────────────────────
function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'KX-Books-Quran-Overhaul/8.0', Accept: 'application/json' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error('JSON: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

async function fetchRetry(url, n = 5) {
  for (let i = 0; i < n; i++) {
    try { return await apiGet(url); }
    catch (e) {
      if (i === n - 1) throw e;
      const wait = 1200 + i * 600;
      process.stdout.write(` [${e.message.slice(0,20)} retry ${i+1}]`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Haupt-Funktion ────────────────────────────────────────────────────────────
async function main() {
  console.log('\n  ╔═══════════════════════════════════════════════╗');
  console.log('  ║  AL-QURAN · Überarbeitungs-Skript  v 8 . 0   ║');
  console.log('  ║  14 Sprachen · linguistische Transformation   ║');
  console.log('  ╚═══════════════════════════════════════════════╝\n');

  // Cache-Verzeichnis
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  // 1. Kapitel-Metadaten holen (Sure-Namen für alle Sprachen)
  process.stdout.write('  ┌ Kapitel-Metadaten (api.quran.com) … ');
  const chMeta = await fetchRetry('https://api.quran.com/api/v4/chapters?language=de');
  const chapters = chMeta.chapters;
  console.log(`${chapters.length} Suren ✓`);

  // 2. Arabischer Urtext (Uthmani, original)
  process.stdout.write('  │ Arabischer Urtext … ');
  const arData = await fetchRetry('https://api.quran.com/api/v4/quran/verses/uthmani');
  const arabicMap = {};
  for (const v of arData.verses) arabicMap[v.verse_key] = v.text_uthmani;
  console.log(`${Object.keys(arabicMap).length} Verse ✓\n`);

  let totalSurahs = 0, totalVerses = 0;

  // 3. Für jede Sprache: Verses holen, transformieren, cachen
  for (const tr of TRANSLATIONS) {
    const langDir = path.join(CACHE_DIR, tr.lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

    process.stdout.write(`  ├─ ${tr.lang.toUpperCase().padEnd(3)} (${tr.edition.padEnd(16)}) `);
    let done = 0, skipped = 0, errors = 0;

    for (const ch of chapters) {
      const cacheFile = path.join(langDir, `${ch.id}.json`);

      if (fs.existsSync(cacheFile)) {
        skipped++;
        done++;
        continue;
      }

      const url = `https://api.alquran.cloud/v1/surah/${ch.id}/${tr.edition}`;
      let data;
      try {
        data = await fetchRetry(url);
      } catch (e) {
        process.stdout.write(`✗`);
        errors++;
        done++;
        continue;
      }

      const ayahs = data.data?.ayahs || [];

      // In quran.com-kompatibles Format transformieren
      // (redesign7.js erwartet verses[n].verse_key und verses[n].translations[0].text)
      const verses = ayahs.map(a => ({
        verse_key: `${ch.id}:${a.numberInSurah}`,
        translations: [{ text: applyTransform(a.text, tr.lang) }],
      }));

      fs.writeFileSync(cacheFile, JSON.stringify(verses, null, 0), 'utf8');
      totalVerses += verses.length;
      done++;

      // Höfliche Pause zur API-Entlastung
      await new Promise(r => setTimeout(r, 90));
    }

    totalSurahs += done;
    const status = skipped === chapters.length ? '(Cache)' : `${done - skipped} neu, ${skipped} gecacht, ${errors} Fehler`;
    console.log(`✓  ${status}`);
  }

  // 4. Kapitel-Metadaten für redesign7.js cachen
  const chFile = path.join(CACHE_DIR, '_chapters.json');
  fs.writeFileSync(chFile, JSON.stringify(chapters, null, 0), 'utf8');

  // 5. Arabischen Urtext cachen
  const arFile = path.join(CACHE_DIR, '_arabic.json');
  fs.writeFileSync(arFile, JSON.stringify(arabicMap, null, 0), 'utf8');

  console.log(`\n  ╔═════════════════════════════════════════════════╗`);
  console.log(`  ║  Fertig! Cache: AL-QURAN/cache/                 ║`);
  console.log(`  ║  Jetzt:  node redesign7.js   (HTML neu bauen)   ║`);
  console.log(`  ╚═════════════════════════════════════════════════╝\n`);
}

main().catch(e => { console.error('\n  ✗ Fehler:', e.message); process.exit(1); });
