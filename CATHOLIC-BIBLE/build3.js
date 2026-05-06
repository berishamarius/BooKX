'use strict';
/**
 * BIBLIA CATHOLICA INTERLINEARIS – HTML GENERATOR v3
 * Würdiges Design: Weinrot · Gold · Pergament · Reine CSS-Typografie
 * Kein SVG · Keine Rahmen-Tricks · Latein dominant
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUT_DIR  = path.join(__dirname, 'Übersetzungen');

// ═══════════════════════════════════════════════════════
//  ÜBERSETZUNGEN
// ═══════════════════════════════════════════════════════

const TRANSLATIONS = [
  { code: 'kjv',        lang: 'en', native: 'English',    display: 'King James Version (1611)',      flag: '🇬🇧' },
  { code: 'german',     lang: 'de', native: 'Deutsch',    display: 'Textbibel (1906)',               flag: '🇩🇪' },
  { code: 'french',     lang: 'fr', native: 'Français',   display: 'Crampon (1923)',                 flag: '🇫🇷' },
  { code: 'spanish',    lang: 'es', native: 'Español',    display: 'Reina-Valera (1909)',            flag: '🇪🇸' },
  { code: 'portuguese', lang: 'pt', native: 'Português',  display: 'Bíblia Livre',                  flag: '🇧🇷' },
  { code: 'polish',     lang: 'pl', native: 'Polski',     display: 'Biblia Gdańska (1881)',          flag: '🇵🇱' },
  { code: 'russian',    lang: 'ru', native: 'Русский',    display: 'Синодальный (1876)',             flag: '🇷🇺' },
  { code: 'croatian',   lang: 'hr', native: 'Hrvatski',   display: 'Hrvatska Biblija Šarića',       flag: '🇭🇷' },
  { code: 'dutch',      lang: 'nl', native: 'Nederlands', display: 'Statenvertaling (1637)',         flag: '🇳🇱' },
  { code: 'hungarian',  lang: 'hu', native: 'Magyar',     display: 'Károli (1908)',                  flag: '🇭🇺' },
  { code: 'czech',      lang: 'cs', native: 'Čeština',    display: 'Bible Kralická (1613)',          flag: '🇨🇿' },
  { code: 'swedish',    lang: 'sv', native: 'Svenska',    display: 'Svenska Bibeln (1917)',          flag: '🇸🇪' },
  { code: 'tagalog',    lang: 'tl', native: 'Filipino',   display: 'Ang Biblia (1905)',              flag: '🇵🇭' },
  { code: 'ukrainian',  lang: 'uk', native: 'Українська', display: 'Біблія Огієнка (1962)',         flag: '🇺🇦' },
  { code: 'albanian',   lang: 'sq', native: 'Shqip',      display: 'Bibla (UFSHB)',                 flag: '🇦🇱' },
];

// ═══════════════════════════════════════════════════════
//  BÜCHERLISTE
// ═══════════════════════════════════════════════════════

const BOOKS = [
  { nr: 1,  abbrev:'gen', latin:'Genesis',               name:'Genesis',          testament:'VT' },
  { nr: 2,  abbrev:'exo', latin:'Exodus',                name:'Exodus',           testament:'VT' },
  { nr: 3,  abbrev:'lev', latin:'Leviticus',             name:'Leviticus',        testament:'VT' },
  { nr: 4,  abbrev:'num', latin:'Numeri',                name:'Numbers',          testament:'VT' },
  { nr: 5,  abbrev:'deu', latin:'Deuteronomium',         name:'Deuteronomy',      testament:'VT' },
  { nr: 6,  abbrev:'jos', latin:'Iosue',                 name:'Joshua',           testament:'VT' },
  { nr: 7,  abbrev:'jdg', latin:'Iudicum',               name:'Judges',           testament:'VT' },
  { nr: 8,  abbrev:'rut', latin:'Ruth',                  name:'Ruth',             testament:'VT' },
  { nr: 9,  abbrev:'1sa', latin:'I Regum',               name:'1 Samuel',         testament:'VT' },
  { nr:10,  abbrev:'2sa', latin:'II Regum',              name:'2 Samuel',         testament:'VT' },
  { nr:11,  abbrev:'1ki', latin:'III Regum',             name:'1 Kings',          testament:'VT' },
  { nr:12,  abbrev:'2ki', latin:'IV Regum',              name:'2 Kings',          testament:'VT' },
  { nr:13,  abbrev:'1ch', latin:'I Paralipomenon',       name:'1 Chronicles',     testament:'VT' },
  { nr:14,  abbrev:'2ch', latin:'II Paralipomenon',      name:'2 Chronicles',     testament:'VT' },
  { nr:15,  abbrev:'ezr', latin:'I Esdras',              name:'Ezra',             testament:'VT' },
  { nr:16,  abbrev:'neh', latin:'II Esdras',             name:'Nehemiah',         testament:'VT' },
  { nr:17,  abbrev:'est', latin:'Esther',                name:'Esther',           testament:'VT' },
  { nr:18,  abbrev:'job', latin:'Iob',                   name:'Job',              testament:'VT' },
  { nr:19,  abbrev:'psa', latin:'Psalmi',                name:'Psalms',           testament:'VT' },
  { nr:20,  abbrev:'pro', latin:'Proverbia',             name:'Proverbs',         testament:'VT' },
  { nr:21,  abbrev:'ecc', latin:'Ecclesiastes',          name:'Ecclesiastes',     testament:'VT' },
  { nr:22,  abbrev:'sng', latin:'Canticum Canticorum',   name:'Song of Solomon',  testament:'VT' },
  { nr:23,  abbrev:'isa', latin:'Isaias',                name:'Isaiah',           testament:'VT' },
  { nr:24,  abbrev:'jer', latin:'Ieremias',              name:'Jeremiah',         testament:'VT' },
  { nr:25,  abbrev:'lam', latin:'Threni',                name:'Lamentations',     testament:'VT' },
  { nr:26,  abbrev:'eze', latin:'Ezechiel',              name:'Ezekiel',          testament:'VT' },
  { nr:27,  abbrev:'dan', latin:'Daniel',                name:'Daniel',           testament:'VT' },
  { nr:28,  abbrev:'hos', latin:'Osee',                  name:'Hosea',            testament:'VT' },
  { nr:29,  abbrev:'joe', latin:'Ioel',                  name:'Joel',             testament:'VT' },
  { nr:30,  abbrev:'amo', latin:'Amos',                  name:'Amos',             testament:'VT' },
  { nr:31,  abbrev:'oba', latin:'Abdias',                name:'Obadiah',          testament:'VT' },
  { nr:32,  abbrev:'jon', latin:'Ionas',                 name:'Jonah',            testament:'VT' },
  { nr:33,  abbrev:'mic', latin:'Micheas',               name:'Micah',            testament:'VT' },
  { nr:34,  abbrev:'nah', latin:'Nahum',                 name:'Nahum',            testament:'VT' },
  { nr:35,  abbrev:'hab', latin:'Habacuc',               name:'Habakkuk',         testament:'VT' },
  { nr:36,  abbrev:'zep', latin:'Sophonias',             name:'Zephaniah',        testament:'VT' },
  { nr:37,  abbrev:'hag', latin:'Aggaeus',               name:'Haggai',           testament:'VT' },
  { nr:38,  abbrev:'zec', latin:'Zacharias',             name:'Zechariah',        testament:'VT' },
  { nr:39,  abbrev:'mal', latin:'Malachias',             name:'Malachi',          testament:'VT' },
  { nr:40,  abbrev:'mat', latin:'Matthaeus',             name:'Matthew',          testament:'NT' },
  { nr:41,  abbrev:'mrk', latin:'Marcus',                name:'Mark',             testament:'NT' },
  { nr:42,  abbrev:'luk', latin:'Lucas',                 name:'Luke',             testament:'NT' },
  { nr:43,  abbrev:'joh', latin:'Ioannes',               name:'John',             testament:'NT' },
  { nr:44,  abbrev:'act', latin:'Actus Apostolorum',     name:'Acts',             testament:'NT' },
  { nr:45,  abbrev:'rom', latin:'Ad Romanos',            name:'Romans',           testament:'NT' },
  { nr:46,  abbrev:'1co', latin:'I Ad Corinthios',       name:'1 Corinthians',    testament:'NT' },
  { nr:47,  abbrev:'2co', latin:'II Ad Corinthios',      name:'2 Corinthians',    testament:'NT' },
  { nr:48,  abbrev:'gal', latin:'Ad Galatas',            name:'Galatians',        testament:'NT' },
  { nr:49,  abbrev:'eph', latin:'Ad Ephesios',           name:'Ephesians',        testament:'NT' },
  { nr:50,  abbrev:'php', latin:'Ad Philippenses',       name:'Philippians',      testament:'NT' },
  { nr:51,  abbrev:'col', latin:'Ad Colossenses',        name:'Colossians',       testament:'NT' },
  { nr:52,  abbrev:'1th', latin:'I Thessalonicenses',    name:'1 Thessalonians',  testament:'NT' },
  { nr:53,  abbrev:'2th', latin:'II Thessalonicenses',   name:'2 Thessalonians',  testament:'NT' },
  { nr:54,  abbrev:'1ti', latin:'I Ad Timotheum',        name:'1 Timothy',        testament:'NT' },
  { nr:55,  abbrev:'2ti', latin:'II Ad Timotheum',       name:'2 Timothy',        testament:'NT' },
  { nr:56,  abbrev:'tit', latin:'Ad Titum',              name:'Titus',            testament:'NT' },
  { nr:57,  abbrev:'phm', latin:'Ad Philemonem',         name:'Philemon',         testament:'NT' },
  { nr:58,  abbrev:'heb', latin:'Ad Hebraeos',           name:'Hebrews',          testament:'NT' },
  { nr:59,  abbrev:'jam', latin:'Iacobi',                name:'James',            testament:'NT' },
  { nr:60,  abbrev:'1pe', latin:'I Petri',               name:'1 Peter',          testament:'NT' },
  { nr:61,  abbrev:'2pe', latin:'II Petri',              name:'2 Peter',          testament:'NT' },
  { nr:62,  abbrev:'1jo', latin:'I Ioannis',             name:'1 John',           testament:'NT' },
  { nr:63,  abbrev:'2jo', latin:'II Ioannis',            name:'2 John',           testament:'NT' },
  { nr:64,  abbrev:'3jo', latin:'III Ioannis',           name:'3 John',           testament:'NT' },
  { nr:65,  abbrev:'jud', latin:'Iudae',                 name:'Jude',             testament:'NT' },
  { nr:66,  abbrev:'rev', latin:'Apocalypsis',           name:'Revelation',       testament:'NT' },
  { nr:67,  abbrev:'tob', latin:'Tobias',                name:'Tobit',            testament:'DK' },
  { nr:68,  abbrev:'jdt', latin:'Iudith',                name:'Judith',           testament:'DK' },
  { nr:69,  abbrev:'1ma', latin:'I Machabaeorum',        name:'1 Maccabees',      testament:'DK' },
  { nr:70,  abbrev:'2ma', latin:'II Machabaeorum',       name:'2 Maccabees',      testament:'DK' },
  { nr:71,  abbrev:'wis', latin:'Sapientia',             name:'Wisdom',           testament:'DK' },
  { nr:72,  abbrev:'sir', latin:'Ecclesiasticus',        name:'Sirach',           testament:'DK' },
  { nr:73,  abbrev:'bar', latin:'Baruch',                name:'Baruch',           testament:'DK' },
  // Orthodoxe Zusatz-Bücher (nur angezeigt im Konfessions-Modus "orthodox")
  { nr:74,  abbrev:'1es', latin:'I Esdras',              name:'1 Esdras',         testament:'OX' },
  { nr:75,  abbrev:'2es', latin:'II Esdras',             name:'2 Esdras',         testament:'OX' },
  { nr:76,  abbrev:'prm', latin:'Oratio Manassis',       name:'Prayer of Manasseh', testament:'OX' },
  { nr:77,  abbrev:'pra', latin:'Azariae Oratio',        name:'Prayer of Azariah',  testament:'OX' },
  { nr:78,  abbrev:'sus', latin:'Susanna',               name:'Susanna',          testament:'OX' },
  { nr:79,  abbrev:'bel', latin:'Bel et Draco',          name:'Bel and the Dragon', testament:'OX' },
  { nr:80,  abbrev:'aes', latin:'Addita Esther',         name:'Additions to Esther',testament:'OX' },
];

const BIBLE_NAMES = {
  en: 'The Holy Bible',        de: 'Die Heilige Bibel',     fr: 'La Sainte Bible',
  es: 'La Santa Biblia',       pt: 'A Bíblia Sagrada',      pl: 'Pismo Święte',
  ru: 'Священное Писание',     hr: 'Sveto Pismo',           nl: 'De Heilige Bijbel',
  hu: 'A Szentírás',           cs: 'Písmo Svaté',           sv: 'Den Heliga Bibeln',
  tl: 'Ang Banal na Bibliya',  uk: 'Священне Письмо',       sq: 'Bibla e Shenjtë',
};

// Schaltfläche "Lesen" pro Sprache
const READ_BTN = {
  en:'R E A D',      de:'L E S E N',    fr:'L I R E',
  es:'L E E R',      pt:'L E R',        pl:'C Z Y T A J',
  ru:'Ч И Т А Т Ь', hr:'Č I T A J',    nl:'L E Z E N',
  hu:'O L V A S S',  cs:'Č Í S T',      sv:'L Ä S A',
  tl:'B A S A H I N',uk:'Ч И Т А Т И', sq:'L E X O',
};

// Buchbezeichnungen pro Sprache (Index = Buchnr - 1)
const BOOK_NAMES = {
  en:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','Tobit','Judith','1 Maccabees','2 Maccabees','Wisdom','Sirach','Baruch'],
  de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwörter','Kohelet','Hoheslied','Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabäer','2. Makkabäer','Weisheit','Sirach','Baruch'],
  fr:['Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth','1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Néhémie','Esther','Job','Psaumes','Proverbes','Ecclésiaste','Cantique des Cantiques','Isaïe','Jérémie','Lamentations','Ézéchiel','Daniel','Osée','Joël','Amos','Abdias','Jonas','Michée','Nahum','Habacuc','Sophonie','Aggée','Zacharie','Malachie','Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens','1 Timothée','2 Timothée','Tite','Philémon','Hébreux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse','Tobie','Judith','1 Maccabées','2 Maccabées','Sagesse','Siracide','Baruch'],
  es:['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantar de los Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Ageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis','Tobías','Judit','1 Macabeos','2 Macabeos','Sabiduría','Eclesiástico','Baruc'],
  pt:['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cântico dos Cânticos','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oséias','Joel','Amós','Obadias','Jonas','Miquéias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filêmon','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse','Tobias','Judite','1 Macabeus','2 Macabeus','Sabedoria','Eclesiástico','Baruc'],
  pl:['Rodzaju','Wyjścia','Kapłańska','Liczb','Powtórzonego Prawa','Jozuego','Sędziów','Rut','1 Samuela','2 Samuela','1 Królewska','2 Królewska','1 Kronik','2 Kronik','Ezdrasza','Nehemiasza','Estery','Hioba','Psalmy','Przysłów','Koheleta','Pieśń nad Pieśniami','Izajasza','Jeremiasza','Lamentacje','Ezechiela','Daniela','Ozeasza','Joela','Amosa','Abdiasza','Jonasza','Micheasza','Nahuma','Habakuka','Sofoniasza','Aggeusza','Zachariasza','Malachiasza','Mateusza','Marka','Łukasza','Jana','Dzieje Apostolskie','Rzymian','1 Koryntian','2 Koryntian','Galatów','Efezjan','Filipian','Kolosan','1 Tesaloniczan','2 Tesaloniczan','1 Tymoteusza','2 Tymoteusza','Tytusa','Filemona','Hebrajczyków','Jakuba','1 Piotra','2 Piotra','1 Jana','2 Jana','3 Jana','Judy','Objawienia','Tobiasza','Judyty','1 Machabejska','2 Machabejska','Mądrości','Syracha','Barucha'],
  ru:['Бытие','Исход','Левит','Числа','Второзаконие','Иисуса Навина','Судей','Руфь','1 Царств','2 Царств','3 Царств','4 Царств','1 Паралипоменон','2 Паралипоменон','Ездры','Неемии','Есфирь','Иов','Псалтирь','Притчи','Екклесиаст','Песня Песней','Исаия','Иеремия','Плач Иеремии','Иезекиль','Даниил','Осия','Иоиль','Амос','Авдий','Иона','Михей','Наум','Аввакум','София','Аггей','Захария','Малахия','Матфей','Марк','Лука','Иоанн','Деяния','Римлянам','1 Коринфянам','2 Коринфянам','Галатам','Ефесянам','Филиппийцам','Колоссянам','1 Фессалоникийцам','2 Фессалоникийцам','1 Тимофею','2 Тимофею','Титу','Филимону','Евреям','Иакова','1 Петра','2 Петра','1 Иоанна','2 Иоанна','3 Иоанна','Иуда','Откровение','Товит','Иудифь','1 Маккавейская','2 Маккавейская','Премудрость Соломона','Сирах','Варух'],
  hr:['Postanak','Izlazak','Levitski zakonik','Brojevi','Ponovljeni zakon','Jošua','Suci','Ruta','1 Samuelova','2 Samuelova','1 Kraljevska','2 Kraljevska','1 Ljetopisa','2 Ljetopisa','Ezra','Nehemija','Estera','Job','Psalmi','Mudre izreke','Propovjednik','Pjesma nad pjesmama','Izaija','Jeremija','Tužaljke','Ezekiel','Daniel','Hošea','Joel','Amos','Obadija','Jona','Mihej','Nahum','Habakuk','Sefanija','Hagaj','Zaharija','Malahija','Matej','Marko','Luka','Ivan','Djela apostolska','Rimljanima','1 Korinćanima','2 Korinćanima','Galaćanima','Efežanima','Filipljanima','Kološanima','1 Solunjanima','2 Solunjanima','1 Timoteju','2 Timoteju','Titu','Filemonu','Hebrejima','Jakovljeva','1 Petrova','2 Petrova','1 Ivanova','2 Ivanova','3 Ivanova','Judina','Otkrivenje','Tobija','Judita','1 Makabejska','2 Makabejska','Mudrost','Sirah','Baruh'],
  nl:['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozua','Rechters','Ruth','1 Samuël','2 Samuël','1 Koningen','2 Koningen','1 Kronieken','2 Kronieken','Ezra','Nehemia','Ester','Job','Psalmen','Spreuken','Prediker','Hooglied','Jesaja','Jeremia','Klaagliederen','Ezechiël','Daniël','Hosea','Joël','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Sefanja','Haggai','Zacharia','Maleachi','Matteüs','Marcus','Lucas','Johannes','Handelingen','Romeinen','1 Korintiërs','2 Korintiërs','Galaten','Efeziërs','Filippenzen','Kolossenzen','1 Tessalonicenzen','2 Tessalonicenzen','1 Timotheüs','2 Timotheüs','Titus','Filemon','Hebreeën','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Openbaring','Tobit','Judit','1 Makkabeeën','2 Makkabeeën','Wijsheid','Sirach','Baruch'],
  hu:['Teremtés','Kivonulás','Leviták könyve','Számok','Második törvénykönyv','Józsue','Bírák','Rút','1 Sámuel','2 Sámuel','1 Királyok','2 Királyok','1 Krónikák','2 Krónikák','Ezdrás','Nehemiás','Eszter','Jób','Zsoltárok','Példabeszédek','Prédikátor','Énekek éneke','Izajás','Jeremiás','Siralmak','Ezekiel','Dániel','Ozeás','Joel','Ámosz','Abdiás','Jónás','Mikeás','Náhum','Habakuk','Szofoniás','Aggeus','Zakariás','Malakiás','Máté','Márk','Lukács','János','Apostolok cselekedetei','Rómaiakhoz','1 Korintusiakhoz','2 Korintusiakhoz','Galatákhoz','Efezusiakhoz','Filippiekhez','Kolosszeiekhez','1 Tesszalonikaiakhoz','2 Tesszalonikaiakhoz','1 Timóteushoz','2 Timóteushoz','Tituszhoz','Filemonhoz','Zsidókhoz','Jakab','1 Péter','2 Péter','1 János','2 János','3 János','Júdás','Jelenések','Tóbit','Judit','1 Makkabeusok','2 Makkabeusok','Bölcsesség','Sirák','Báruk'],
  cs:['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozue','Soudců','Rút','1 Samuelova','2 Samuelova','1 Královská','2 Královská','1 Paralipomenon','2 Paralipomenon','Ezdráš','Nehemiáš','Ester','Jób','Žalmy','Přísloví','Kazatel','Píseň písní','Izajáš','Jeremiáš','Pláč','Ezechiel','Daniel','Ozeáš','Joel','Ámos','Abdiáš','Jonáš','Micheáš','Nahum','Habakuk','Sofoniáš','Aggeus','Zachariáš','Malachiáš','Matouš','Marek','Lukáš','Jan','Skutky','Římanům','1 Korintským','2 Korintským','Galatským','Efezským','Filipským','Koloským','1 Tesalonickým','2 Tesalonickým','1 Timoteovi','2 Timoteovi','Titovi','Filemonovi','Židům','Jakubův','1 Petrův','2 Petrův','1 Janův','2 Janův','3 Janův','Judův','Zjevení','Tobiáš','Judit','1 Makabejská','2 Makabejská','Moudrost','Sirachovec','Baruch'],
  sv:['Första Mosebok','Andra Mosebok','Tredje Mosebok','Fjärde Mosebok','Femte Mosebok','Josua','Domarboken','Rut','Första Samuelsboken','Andra Samuelsboken','Första Kungaboken','Andra Kungaboken','Första Krönikeboken','Andra Krönikeboken','Esra','Nehemja','Ester','Job','Psaltaren','Ordspråksboken','Predikaren','Höga visan','Jesaja','Jeremia','Klagovisorna','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Mika','Nahum','Habakuk','Sefanja','Haggai','Sakarja','Malaki','Matteus','Markus','Lukas','Johannes','Apostlagärningarna','Romarbrevet','1 Korintierbrevet','2 Korintierbrevet','Galaterbrevet','Efesierbrevet','Filipperbrevet','Kolosserbrevet','1 Thessalonikerbrevet','2 Thessalonikerbrevet','1 Timoteusbrevet','2 Timoteusbrevet','Titusbrevet','Filemonbrevet','Hebreerbrevet','Jakobsbrevet','1 Petrusbrevet','2 Petrusbrevet','1 Johannesbrevet','2 Johannesbrevet','3 Johannesbrevet','Judasbrevet','Uppenbarelseboken','Tobit','Judit','Första Mackabéerboken','Andra Mackabéerboken','Visdomen','Syrak','Baruk'],
  tl:['Genesis','Exodo','Levitico','Mga Bilang','Deuteronomio','Josue','Mga Hukom','Rut','1 Samuel','2 Samuel','1 Hari','2 Hari','1 Cronica','2 Cronica','Esdras','Nehemias','Ester','Job','Mga Awit','Kawikaan','Mangangaral','Awit ng mga Awit','Isaias','Jeremias','Panaghoy','Ezekiel','Daniel','Oseas','Joel','Amos','Abdias','Jonas','Mikas','Nahum','Habakuk','Sofonias','Ageo','Zacarias','Malakias','Mateo','Marcos','Lucas','Juan','Mga Gawa','Roma','1 Corinto','2 Corinto','Galacia','Efeso','Filipos','Colosas','1 Tesalonica','2 Tesalonica','1 Timoteo','2 Timoteo','Tito','Filemon','Hebreo','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Pahayag','Tobit','Judit','1 Macabeo','2 Macabeo','Karunungan','Sirac','Baruc'],
  uk:['Буття','Вихід','Левит','Числа','Повторення Закону','Ісуса Навина','Суддів','Рут','1 Самуїла','2 Самуїла','1 Царів','2 Царів','1 Хронік','2 Хронік','Ездри','Неємії','Естер','Йов','Псалми','Приповісті','Еклезіаст','Пісня пісень','Ісаї','Єремії','Плач Єремії','Єзекіїла','Даниїла','Осії','Йоїла','Амоса','Авдія','Йони','Михея','Наума','Авакума','Сефанії','Агея','Захарії','Малахії','Матвія','Марка','Луки','Іоанна','Діяння','Римлян','1 Коринтян','2 Коринтян','Галатів','Ефесян','Филип\'ян','Колосян','1 Солунян','2 Солунян','1 Тимофія','2 Тимофія','Тита','Филимона','Євреїв','Якова','1 Петра','2 Петра','1 Іоанна','2 Іоанна','3 Іоанна','Юди','Відкровення','Товит','Юдит','1 Маккавеїв','2 Маккавеїв','Премудрість','Сирах','Варух'],
  sq:['Zanafilla','Eksodi','Levitiku','Numrat','Ligji i Përtërirë','Jozueu','Gjyqtarët','Ruthi','1 Samueli','2 Samueli','1 Mbretërve','2 Mbretërve','1 Kronikave','2 Kronikave','Esdra','Nehemia','Estera','Jobi','Psalmet','Fjalët e urta','Predikuesi','Kënga e Këngëve','Isaia','Jeremia','Vajtimet','Ezekieli','Danieli','Osea','Joeli','Amosi','Abdia','Jona','Mikea','Nahumi','Habakuku','Sefania','Ageui','Zakaria','Malakia','Mateu','Marku','Luka','Gjoni','Veprat','Romakëve','1 Korintasve','2 Korintasve','Galatasve','Efesianëve','Filipianëve','Kolosianëve','1 Selanikasve','2 Selanikasve','1 Timoteut','2 Timoteut','Titit','Filemonit','Hebrenjve','Jakobi','1 Pjetri','2 Pjetri','1 Gjoni','2 Gjoni','3 Gjoni','Juda','Zbulesa','Tobiti','Judita','1 Makabenjve','2 Makabenjve','Urtësia','Sirak','Baruku'],
};

// ═══════════════════════════════════════════════════════
//  HELFER
// ═══════════════════════════════════════════════════════

function mkDir(d)  { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function pad3(n)   { return String(n).padStart(3, '0'); }
function esc(s)    { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  for (let i = 0; i < vals.length; i++) while (n >= vals[i]) { r += syms[i]; n -= vals[i]; }
  return r;
}

function bookFile(book) { return `${pad3(book.nr)}-${book.abbrev}.html`; }

const ORTHO_DIR  = path.join(__dirname, 'data-orthodox');
const LUTHER_DIR = path.join(__dirname, 'data-luther');
const GREEK_DIR  = path.join(__dirname, 'data-greek');

function loadLutherBook(nr) {
  const f = path.join(LUTHER_DIR, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

function loadGreekBook(nr) {
  const f = path.join(GREEK_DIR, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

function loadBook(code, nr) {
  // OX books (74-80) are in data-orthodox/
  if (nr >= 74) {
    const fo = path.join(ORTHO_DIR, code, `${pad3(nr)}.json`);
    if (fs.existsSync(fo)) try { return JSON.parse(fs.readFileSync(fo, 'utf8')); } catch (_) { return null; }
    // Fallback: try kjv as source for all langs
    const fe = path.join(ORTHO_DIR, 'kjv', `${pad3(nr)}.json`);
    if (fs.existsSync(fe)) try { return JSON.parse(fs.readFileSync(fe, 'utf8')); } catch (_) { return null; }
    return null;
  }
  const f = path.join(DATA_DIR, code, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

function parseBook(data) {
  if (!data || !data.chapters) return null;
  return Object.keys(data.chapters).sort((a,b)=>+a-+b).map(ck => {
    const ch = data.chapters[ck];
    const verses = Object.keys(ch.verses||{}).sort((a,b)=>+a-+b).map(vk => ({
      nr: ch.verses[vk].verse, text: (ch.verses[vk].text||'').trim()
    }));
    return { nr: ch.chapter, verses };
  });
}

// ═══════════════════════════════════════════════════════
//  SCHRIFTEN (Google Fonts CDN)
// ═══════════════════════════════════════════════════════

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet">`;

// ═══════════════════════════════════════════════════════
//  COVER (Hauptcover – Sprachauswahl)
// ═══════════════════════════════════════════════════════

function buildCover() {
  const langList = TRANSLATIONS.map(t =>
    `<a href="${t.code}/cover.html" class="lk">${t.native}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica Interlinearis</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{
  min-height:100%;
  font-family:'EB Garamond',Georgia,serif;
}
body{
  background:#3A0A12;
  color:#EDD882;
  display:flex;align-items:stretch;justify-content:center;
  min-height:100vh;
}

/* Seite */
.page{
  width:100%;max-width:680px;
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:60px 48px;
  position:relative;
  background:linear-gradient(180deg,#2C0810 0%,#4A1020 30%,#5C1828 55%,#4A1020 80%,#2C0810 100%);
}

/* Äußerer Goldrahmen */
.page::before{
  content:'';
  position:absolute;inset:20px;
  border:1px solid rgba(200,160,48,.45);
  pointer-events:none;
}
/* Innerer Goldrahmen */
.page::after{
  content:'';
  position:absolute;inset:28px;
  border:1px solid rgba(200,160,48,.18);
  pointer-events:none;
}

.inner{
  position:relative;z-index:1;
  display:flex;flex-direction:column;align-items:center;
  width:100%;
  gap:0;
}

/* Oberes Ornament */
.orn-top{
  font-size:.75rem;letter-spacing:.65em;
  color:rgba(200,160,48,.5);
  margin-bottom:24px;
}

/* Kreuz */
.cross{
  font-size:3.8rem;
  color:#C8A030;
  text-shadow:0 0 40px rgba(200,160,48,.35),0 0 80px rgba(200,160,48,.15);
  line-height:1;
  margin-bottom:20px;
}

/* Haupttitel */
.title{
  font-family:'Cinzel Decorative','Cinzel',serif;
  font-size:clamp(2.2rem,7vw,3.4rem);
  color:#EDD882;
  text-align:center;
  line-height:1.08;
  letter-spacing:.04em;
  text-shadow:0 2px 20px rgba(0,0,0,.5);
}

/* Gold-Trennlinie */
.rule{
  width:85%;
  height:1px;
  margin:20px 0;
  background:linear-gradient(to right,transparent,#C8A030 20%,#EDD882 50%,#C8A030 80%,transparent);
}
.rule-thin{
  width:50%;
  height:1px;
  margin:14px 0;
  background:linear-gradient(to right,transparent,rgba(200,160,48,.45),transparent);
}

/* Untertitel */
.subtitle{
  font-family:'Cinzel',serif;
  font-size:.72rem;
  letter-spacing:.48em;
  color:rgba(200,160,48,.7);
  text-align:center;
  margin-top:6px;
}

/* Beschreibung */
.desc{
  font-style:italic;
  font-size:1.05rem;
  color:rgba(237,216,130,.68);
  text-align:center;
  line-height:2;
  margin-top:4px;
}

/* Statistik */
.stats{
  font-family:'Cinzel',serif;
  font-size:.58rem;
  letter-spacing:.18em;
  color:rgba(200,160,48,.4);
  text-align:center;
  margin-top:10px;
}

/* Sprachliste */
.langs{
  display:flex;flex-wrap:wrap;gap:6px;justify-content:center;
  margin-top:4px;
}
.lk{
  font-family:'Cinzel',serif;
  font-size:.65rem;
  letter-spacing:.08em;
  color:rgba(200,160,48,.6);
  text-decoration:none;
  border:1px solid rgba(200,160,48,.22);
  padding:4px 12px;
  border-radius:2px;
  transition:all .18s;
}
.lk:hover{color:#EDD882;border-color:rgba(200,160,48,.55);background:rgba(200,160,48,.08);}

/* Hauptbutton */
.btn{
  display:inline-block;
  margin-top:18px;
  padding:13px 52px;
  border:1.5px solid rgba(200,160,48,.6);
  color:#C8A030;
  text-decoration:none;
  font-family:'Cinzel',serif;
  font-size:.85rem;
  letter-spacing:.26em;
  border-radius:2px;
  background:rgba(200,160,48,.06);
  transition:all .22s;
}
.btn:hover{background:rgba(200,160,48,.18);color:#EDD882;border-color:rgba(200,160,48,.8);}

/* Copyright */
.copy{
  font-family:'Cinzel',serif;
  font-size:.48rem;
  letter-spacing:.1em;
  color:rgba(200,160,48,.28);
  text-align:center;
  line-height:2;
  margin-top:20px;
}

/* Unteres Ornament */
.orn-bot{
  font-size:.75rem;letter-spacing:.65em;
  color:rgba(200,160,48,.5);
  margin-top:24px;
}
</style>
</head>
<body>
<div class="page">
  <div class="inner">
    <div class="orn-top">✦ &nbsp; ✦ &nbsp; ✦</div>

    <div class="cross">✝</div>

    <div class="title">BIBLIA<br>CATHOLICA</div>
    <div class="subtitle">I N T E R L I N E A R I S</div>

    <div class="rule"></div>

    <div class="desc">
      Vulgata Clementina<br>
      cum Translationibus Quindecim<br>
      Die Heilige Schrift in 15 Sprachen
    </div>
    <div class="stats">73 &thinsp;Libri &nbsp;·&nbsp; 31 102 &thinsp;Versus &nbsp;·&nbsp; 15 &thinsp;Linguae</div>

    <div class="rule-thin"></div>

    <div class="langs">${langList}</div>

    <a class="btn" href="index.html">LEGERE &nbsp;&#8250;</a>

    <div class="copy">
      KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
    </div>

    <div class="orn-bot">✦ &nbsp; ✦ &nbsp; ✦</div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  RÜCKSEITE
// ═══════════════════════════════════════════════════════

function buildBackCover() {
  const rows = TRANSLATIONS.map(t =>
    `<div class="row"><span class="rn">${t.native}</span><span class="rd">${t.display}</span></div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica – Rückseite</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100%;font-family:'EB Garamond',Georgia,serif;}
body{
  background:#3A0A12;
  display:flex;align-items:stretch;justify-content:center;
  min-height:100vh;
}
.page{
  width:100%;max-width:680px;min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:60px 48px;position:relative;
  background:linear-gradient(180deg,#2C0810 0%,#4A1020 35%,#5C1828 55%,#4A1020 80%,#2C0810 100%);
}
.page::before{content:'';position:absolute;inset:20px;border:1px solid rgba(200,160,48,.45);pointer-events:none;}
.page::after{content:'';position:absolute;inset:28px;border:1px solid rgba(200,160,48,.18);pointer-events:none;}
.inner{position:relative;z-index:1;width:100%;display:flex;flex-direction:column;align-items:center;gap:0;}
.orn{font-size:.75rem;letter-spacing:.65em;color:rgba(200,160,48,.5);margin:18px 0;}
.title{font-family:'Cinzel Decorative',serif;font-size:2rem;color:#EDD882;text-align:center;line-height:1.15;}
.rule{width:80%;height:1px;margin:16px 0;background:linear-gradient(to right,transparent,#C8A030 20%,#EDD882 50%,#C8A030 80%,transparent);}
.blurb{font-style:italic;font-size:1rem;color:rgba(237,216,130,.7);text-align:center;line-height:2;}
.sec-head{font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.28em;color:rgba(200,160,48,.5);text-align:center;margin:14px 0 10px;}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:5px;width:100%;}
.row{display:flex;flex-direction:column;padding:6px 10px;border:1px solid rgba(200,160,48,.14);border-radius:2px;background:rgba(0,0,0,.12);}
.rn{font-family:'Cinzel',serif;font-size:.72rem;color:rgba(237,216,130,.8);}
.rd{font-size:.62rem;color:rgba(200,160,48,.38);margin-top:2px;}
.verse{font-style:italic;font-size:.92rem;color:rgba(237,216,130,.62);text-align:center;line-height:2;}
.verse-ref{font-family:'Cinzel',serif;font-size:.55rem;color:rgba(200,160,48,.35);text-align:center;margin-top:4px;}
.copy{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.08em;color:rgba(200,160,48,.28);text-align:center;line-height:2;margin-top:8px;}
.back-link{display:inline-block;margin-top:14px;padding:8px 24px;border:1px solid rgba(200,160,48,.3);color:rgba(200,160,48,.55);text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:.1em;border-radius:2px;transition:all .18s;}
.back-link:hover{color:#C8A030;border-color:rgba(200,160,48,.6);}
</style>
</head>
<body>
<div class="page">
  <div class="inner">
    <div class="orn">✦ &nbsp; ✦ &nbsp; ✦</div>
    <div class="title">BIBLIA<br>CATHOLICA</div>
    <div class="rule"></div>
    <div class="blurb">
      Die Heilige Schrift im Wechselgespräch:<br>
      Vulgata Clementina als Urtext<br>
      und 15 gemeinfreie Übersetzungen<br>
      für die christliche Weltbevölkerung.
    </div>
    <div class="sec-head">✦ &nbsp; Enthaltene Übersetzungen &nbsp; ✦</div>
    <div class="rows">${rows}</div>
    <div class="rule"></div>
    <div class="verse">«Scrutamini scripturas, quia vos putatis<br>in ipsis vitam aeternam habere.»</div>
    <div class="verse-ref">Ioannes 5,39 &nbsp;·&nbsp; Vulgata Clementina</div>
    <div class="copy">
      KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
    </div>
    <a href="index.html" class="back-link">← Sprachauswahl</a>
    <div class="orn">✦ &nbsp; ✦ &nbsp; ✦</div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  HAUPTINDEX (Sprachauswahl)
// ═══════════════════════════════════════════════════════

function buildMainIndex() {
  const cards = TRANSLATIONS.map(t => `
  <a href="${t.code}/index.html" class="lc">
    <span class="ln">${t.native}</span>
  </a>`).join('');

  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica Interlinearis – Sprachauswahl</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:#F5EFE4;font-family:'EB Garamond',serif;color:#1A0E06;}

/* OBERE LEISTE */
.topbar{
  background:#2C0810;
  border-bottom:3px solid #B8962E;
  padding:11px 32px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
}
.topbar-brand{
  font-family:'Cinzel',serif;font-size:.78rem;
  color:#C8A030;letter-spacing:.1em;text-decoration:none;
}
.topbar-links{display:flex;gap:16px;}
.topbar-links a{
  font-family:'Cinzel',serif;font-size:.65rem;
  color:rgba(200,160,48,.6);text-decoration:none;letter-spacing:.06em;
  transition:color .15s;
}
.topbar-links a:hover{color:#C8A030;}

/* HEADER */
header{
  background:linear-gradient(165deg,#2C0810 0%,#4A1020 45%,#5C1828 65%,#4A1020 85%,#2C0810 100%);
  padding:64px 24px 52px;
  text-align:center;
  border-bottom:4px solid #B8962E;
}
.h-orn{font-size:.75rem;letter-spacing:.6em;color:rgba(200,160,48,.45);margin-bottom:18px;}
.h-cross{font-size:2.8rem;color:#C8A030;text-shadow:0 0 30px rgba(200,160,48,.3);margin-bottom:12px;}
.h-title{
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(1.8rem,5.5vw,3rem);
  color:#EDD882;
  line-height:1.1;
  text-shadow:0 3px 16px rgba(0,0,0,.45);
}
.h-sub{
  font-family:'Cinzel',serif;font-size:.8rem;
  color:#C8A030;margin-top:12px;letter-spacing:.22em;
}
.h-desc{
  font-style:italic;font-size:.95rem;
  color:rgba(237,216,130,.52);margin-top:6px;
}
.h-stats{
  font-family:'Cinzel',serif;font-size:.6rem;
  color:rgba(200,160,48,.35);letter-spacing:.14em;margin-top:10px;
}
.h-rule{
  width:180px;height:1px;margin:18px auto 0;
  background:linear-gradient(to right,transparent,#C8A030,transparent);
}

/* SEKTION */
.sec{
  max-width:1040px;margin:36px auto 0;padding:0 24px;
  text-align:center;
}
.sec-label{
  font-family:'Cinzel',serif;font-size:.68rem;
  letter-spacing:.28em;color:#8B6914;
  display:inline-block;
  border-bottom:1px solid rgba(184,150,46,.35);
  padding-bottom:6px;margin-bottom:22px;
}

/* SPRACHKARTEN */
.grid{
  max-width:1040px;margin:0 auto 72px;padding:0 24px;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
  gap:12px;
}
.lc{
  display:flex;flex-direction:column;
  padding:22px 18px 18px;
  background:#FEFAF2;
  border:1px solid rgba(184,150,46,.2);
  border-top:3px solid #B8962E;
  border-radius:3px;
  text-decoration:none;color:#1A0E06;
  transition:all .2s;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
}
.lc:hover{
  transform:translateY(-4px);
  box-shadow:0 8px 28px rgba(184,150,46,.18);
  background:#FDF6E3;border-top-color:#EDD882;
}
.ln{
  font-family:'Cinzel',serif;font-size:.9rem;
  font-weight:600;color:#2C0810;
}
.ld{font-size:.7rem;color:#8B7040;margin-top:5px;line-height:1.4;}

/* FOOTER */
footer{
  background:#2C0810;border-top:3px solid #B8962E;
  color:rgba(200,160,48,.38);text-align:center;
  padding:28px 20px;font-family:'Cinzel',serif;
  font-size:.62rem;letter-spacing:.1em;line-height:2.2;
}
</style>
</head>
<body>

<nav class="topbar">
  <span class="topbar-brand">✞ &nbsp; BIBLIA CATHOLICA INTERLINEARIS</span>
  <div class="topbar-links">
    <a href="cover.html">Cover</a>
    <a href="back-cover.html">Rückseite</a>
  </div>
</nav>

<header>
  <div class="h-orn">✦ &nbsp; ✦ &nbsp; ✦</div>
  <div class="h-cross">✝</div>
  <div class="h-title">BIBLIA CATHOLICA<br>INTERLINEARIS</div>
  <div class="h-sub">Vulgata Clementina</div>
  <div class="h-desc">Die Heilige Schrift · 15 Sprachen · 73 Bücher</div>
  <div class="h-stats">73 Libri &nbsp;·&nbsp; 31 102 Versus &nbsp;·&nbsp; 15 Linguae</div>
  <div class="h-rule"></div>
</header>

<div class="sec">
  <span class="sec-label">❧ &nbsp; Elige Linguam Tuam &nbsp; ❧</span>
</div>

<main class="grid">
${cards}
</main>

<footer>
  KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SPRACHCOVER (pro Übersetzung) — Kein SVG, reines CSS
// ═══════════════════════════════════════════════════════

function buildLangCover(trans) {
  const bibName = BIBLE_NAMES[trans.lang] || 'Holy Bible';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${bibName} &middot; Biblia Catholica</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;font-family:'EB Garamond',Georgia,serif;}
body{
  background:
    repeating-linear-gradient( 45deg,transparent,transparent 38px,rgba(200,160,48,.018) 38px,rgba(200,160,48,.018) 39px),
    repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(200,160,48,.018) 38px,rgba(200,160,48,.018) 39px),
    linear-gradient(170deg,#1A0407 0%,#2C0810 30%,#4A1020 55%,#2C0810 80%,#1A0407 100%);
  display:flex;align-items:center;justify-content:center;
  height:100vh;overflow:hidden;
  box-shadow:
    inset 0 0 0 3px rgba(200,160,48,.5),
    inset 0 0 0 7px rgba(200,160,48,.08),
    inset 0 0 0 10px rgba(200,160,48,.35);
}

.page{
  width:460px;
  max-width:calc(100vw - 2cm);
  height:calc(100vh - 2.5cm);
  max-height:680px;
  display:flex;flex-direction:column;align-items:center;
  justify-content:space-between;
  position:relative;
  background:linear-gradient(180deg,#2A0810 0%,#4A1220 35%,#5C1828 55%,#4A1220 75%,#2A0810 100%);
  /* Two clean gold borders, no shadow */
  border:2px solid #A07828;
  outline:1px solid rgba(180,138,44,.35);
  outline-offset:-12px;
}

/* Corner L-pieces — same size as outline inset */
.corner{position:absolute;width:26px;height:26px;pointer-events:none;}
.corner.tl{top:20px;left:20px;border-top:1.5px solid #A07828;border-left:1.5px solid #A07828;}
.corner.tr{top:20px;right:20px;border-top:1.5px solid #A07828;border-right:1.5px solid #A07828;}
.corner.bl{bottom:20px;left:20px;border-bottom:1.5px solid #A07828;border-left:1.5px solid #A07828;}
.corner.br{bottom:20px;right:20px;border-bottom:1.5px solid #A07828;border-right:1.5px solid #A07828;}

/* Top + bottom ornamental bands */
.top-band,.bot-band{
  width:100%;padding:18px 36px 14px;
  display:flex;flex-direction:column;align-items:center;gap:8px;
  position:relative;z-index:1;
}
.bot-band{padding:14px 36px 18px;}
.band-rule{
  width:80%;height:1px;
  background:linear-gradient(to right,transparent,#A07828 20%,#C8A030 50%,#A07828 80%,transparent);
}
.band-orn{display:block;width:55%;margin:0 auto;}

/* Center block */
.center-block{
  flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:0 48px;
  position:relative;z-index:1;gap:0;
}

/* Cross SVG */
.cross-svg{display:block;width:48px;margin:0 auto 18px;}

/* Separator rule */
.rule-sep{
  width:82%;height:1px;margin:0 0 18px;
  background:linear-gradient(to right,transparent,#A07828 15%,#C8A030 50%,#A07828 85%,transparent);
}

/* Main title */
.main-title{
  font-family:'Cinzel Decorative','Cinzel',serif;
  font-size:clamp(1.5rem,4.8vw,2.4rem);
  color:#D4A84A;
  text-align:center;line-height:1.22;letter-spacing:.06em;
}

/* Ornament panel */
.orn-panel{display:block;width:82%;margin:18px auto 0;}

/* Button block */
.bottom-block{
  display:flex;flex-direction:column;align-items:center;
  padding:0 48px;position:relative;z-index:1;margin-bottom:4px;
}
.btn{
  display:inline-block;padding:11px 52px;
  border:1.5px solid #A07828;
  color:#C8A030;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.76rem;letter-spacing:.35em;
  background:transparent;transition:background .2s,color .2s;
}
.btn:hover{background:rgba(160,120,40,.15);color:#D4A84A;}
</style>
</head>
<body>
<div class="page">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>

  <!-- TOP BAND: engraved floral border strip -->
  <div class="top-band">
    <div class="band-rule"></div>
    <svg class="band-orn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 22">
      <g stroke="#B8962E" fill="none" opacity="0.7" stroke-width="0.8">
        <!-- horizontal spine -->
        <line x1="0" y1="11" x2="200" y2="11"/>
        <!-- centre cross -->
        <line x1="100" y1="1" x2="100" y2="21" stroke-width="1.4"/>
        <line x1="91" y1="8" x2="109" y2="8" stroke-width="1.4"/>
        <!-- left acanthus scrolls -->
        <path d="M78,11 C72,11 68,5 62,7 C56,9 58,14 62,14 C66,14 64,8 70,10 C76,12 78,11 78,11"/>
        <path d="M50,11 C44,11 40,5 34,7 C28,9 30,14 34,14 C38,14 36,8 42,10 C48,12 50,11 50,11"/>
        <!-- right acanthus scrolls (mirrored) -->
        <path d="M122,11 C128,11 132,5 138,7 C144,9 142,14 138,14 C134,14 136,8 130,10 C124,12 122,11 122,11"/>
        <path d="M150,11 C156,11 160,5 166,7 C172,9 170,14 166,14 C162,14 164,8 158,10 C152,12 150,11 150,11"/>
        <!-- small diamonds at intervals -->
        <path d="M16,11 L19,8 L22,11 L19,14 Z" fill="#B8962E"/>
        <path d="M178,11 L181,8 L184,11 L181,14 Z" fill="#B8962E"/>
      </g>
    </svg>
    <div class="band-rule"></div>
  </div>

  <!-- CENTRE -->
  <div class="center-block">
    <!-- Latin cross, clean, no filters -->
    <svg class="cross-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 64">
      <g fill="#B8962E" opacity="0.85">
        <rect x="16" y="0" width="8" height="64"/>
        <rect x="4" y="14" width="32" height="8"/>
        <!-- serif caps -->
        <rect x="11" y="0" width="18" height="2"/>
        <rect x="11" y="62" width="18" height="2"/>
        <rect x="4" y="12" width="2" height="12"/>
        <rect x="34" y="12" width="2" height="12"/>
      </g>
    </svg>

    <div class="rule-sep"></div>
    <div class="main-title">${bibName}</div>

    <!-- Engraved ornamental medallion panel — no filters, crisp lines -->
    <svg class="orn-panel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 68">
      <g stroke="#A07828" fill="none" opacity="0.65">
        <!-- top + bottom bounding lines -->
        <line x1="0" y1="12" x2="260" y2="12" stroke-width="0.5"/>
        <line x1="0" y1="56" x2="260" y2="56" stroke-width="0.5"/>
        <!-- centre circle + cross -->
        <circle cx="130" cy="34" r="22" stroke-width="1"/>
        <circle cx="130" cy="34" r="14" stroke-width="0.5"/>
        <line x1="130" y1="12" x2="130" y2="56" stroke-width="1.2"/>
        <line x1="108" y1="34" x2="152" y2="34" stroke-width="1.2"/>
        <!-- diamond at centre -->
        <path d="M130,27 L136,34 L130,41 L124,34 Z" fill="#A07828" stroke="none" opacity="0.8"/>
        <!-- left scrollwork -->
        <path d="M106,34 C94,34 88,20 74,23 C60,26 64,36 70,36 C76,36 72,26 84,30 C96,34 106,34 106,34" stroke-width="0.9"/>
        <path d="M60,34 C48,34 42,20 28,23 C14,26 18,36 24,36 C30,36 26,26 38,30 C50,34 60,34 60,34" stroke-width="0.9"/>
        <!-- right scrollwork (mirrored) -->
        <path d="M154,34 C166,34 172,20 186,23 C200,26 196,36 190,36 C184,36 188,26 176,30 C164,34 154,34 154,34" stroke-width="0.9"/>
        <path d="M200,34 C212,34 218,20 232,23 C246,26 242,36 236,36 C230,36 234,26 222,30 C210,34 200,34 200,34" stroke-width="0.9"/>
        <!-- dot accents -->
        <circle cx="130" cy="16" r="2" fill="#A07828" stroke="none" opacity="0.7"/>
        <circle cx="130" cy="52" r="2" fill="#A07828" stroke="none" opacity="0.7"/>
        <circle cx="108" cy="34" r="1.5" fill="#A07828" stroke="none" opacity="0.7"/>
        <circle cx="152" cy="34" r="1.5" fill="#A07828" stroke="none" opacity="0.7"/>
        <circle cx="4"   cy="34" r="2.5" fill="#A07828" stroke="none" opacity="0.6"/>
        <circle cx="256" cy="34" r="2.5" fill="#A07828" stroke="none" opacity="0.6"/>
      </g>
    </svg>
  </div>

  <!-- BUTTON -->
  <div class="bottom-block">
    <a class="btn" href="index.html">${READ_BTN[trans.lang]||READ_BTN.en} &nbsp; ›</a>
  </div>

  <!-- BOTTOM BAND -->
  <div class="bot-band">
    <div class="band-rule"></div>
    <svg class="band-orn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 22">
      <g stroke="#B8962E" fill="none" opacity="0.7" stroke-width="0.8">
        <line x1="0" y1="11" x2="200" y2="11"/>
        <line x1="100" y1="1" x2="100" y2="21" stroke-width="1.4"/>
        <line x1="91" y1="8" x2="109" y2="8" stroke-width="1.4"/>
        <path d="M78,11 C72,11 68,5 62,7 C56,9 58,14 62,14 C66,14 64,8 70,10 C76,12 78,11 78,11"/>
        <path d="M50,11 C44,11 40,5 34,7 C28,9 30,14 34,14 C38,14 36,8 42,10 C48,12 50,11 50,11"/>
        <path d="M122,11 C128,11 132,5 138,7 C144,9 142,14 138,14 C134,14 136,8 130,10 C124,12 122,11 122,11"/>
        <path d="M150,11 C156,11 160,5 166,7 C172,9 170,14 166,14 C162,14 164,8 158,10 C152,12 150,11 150,11"/>
        <path d="M16,11 L19,8 L22,11 L19,14 Z" fill="#B8962E"/>
        <path d="M178,11 L181,8 L184,11 L181,14 Z" fill="#B8962E"/>
      </g>
    </svg>
    <div class="band-rule"></div>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  SPRACHINDEX (Bücherliste)
// ═══════════════════════════════════════════════════════

function buildLangIndex(trans, availBooks) {
  const byTest = g => availBooks.filter(b => b.testament === g);
  const booksVT = byTest('VT'), booksNT = byTest('NT'), booksDK = byTest('DK'), booksOX = byTest('OX');

  function bookList(books) {
    return books.map(b => `
  <a href="bücher/${bookFile(b)}" class="toc-item" data-testament="${b.testament}">
    <span class="tnr">${pad3(b.nr)}</span>
    <span class="tlat">${b.latin}</span>
    <span class="tname">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.en)[b.nr-1]||b.name}</span>
    <span class="tdots"></span>
    <span class="tchap">${b.chapCount ? b.chapCount + ' Cap.' : ''}</span>
    <span class="tarr">›</span>
  </a>`).join('');
  }

  const dkSec = booksDK.length ? `
<div class="sec-group sec-dk">
<div class="sec-head">
  <span class="sec-t">Libri Deuterocanonoci</span>
  <div class="sec-rule"></div>
  <span class="sec-s">L I B R I &nbsp; D E U T E R O C A N O N I C I &nbsp;·&nbsp; ${booksDK.length} &nbsp; L I B R I</span>
</div>
${bookList(booksDK)}
</div>` : '';

  const oxSec = booksOX.length ? `
<div class="sec-group sec-ox">
<div class="sec-head">
  <span class="sec-t">Libri Orthodoxi</span>
  <div class="sec-rule"></div>
  <span class="sec-s">L I B R I &nbsp; O R T H O D O X I &nbsp;·&nbsp; ${booksOX.length} &nbsp; L I B R I</span>
</div>
${bookList(booksOX)}
</div>` : '';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica &middot; ${trans.native}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#2C0810;
  background-image:radial-gradient(ellipse at 50% 20%,#4A1020 0%,#1A0407 100%);
  font-family:'EB Garamond',serif;color:#EDD882;
}

/* NAV */
.topbar{
  background:linear-gradient(to bottom,#2C0810,#1A0407);
  border-bottom:1px solid rgba(184,150,46,.3);
  padding:10px 28px;
}
.topbar a{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:rgba(200,160,48,.72);text-decoration:none;letter-spacing:.08em;
  border:1px solid rgba(200,160,48,.28);padding:5px 18px;border-radius:2px;
  display:inline-block;
  transition:color .15s,border-color .15s;
}
.topbar a:hover{color:#C8A030;border-color:rgba(200,160,48,.55);}

/* HEADER */
header{
  background:
    repeating-linear-gradient( 45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    repeating-linear-gradient(-45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    linear-gradient(162deg,#240608 0%,#3E0E1A 18%,#5C1828 44%,#62202E 56%,#4A1220 76%,#240608 100%);
  padding:36px 24px 28px;text-align:center;border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
header::before{
  content:'';
  position:absolute;inset:14px;
  border:1px solid rgba(200,160,48,.22);
  pointer-events:none;
}
header::after{
  content:'';
  position:absolute;inset:22px;
  border:1px solid rgba(200,160,48,.08);
  pointer-events:none;
}
.h-orn{
  font-size:.72rem;letter-spacing:.65em;
  color:rgba(200,160,48,.4);
  margin-bottom:20px;position:relative;
}
.h-cross-big{
  font-size:3.8rem;color:#C8A030;
  text-shadow:0 0 30px rgba(200,160,48,.5),0 0 70px rgba(200,160,48,.2);
  line-height:1;margin-bottom:16px;position:relative;
}
.htitle{
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(2rem,6vw,3.2rem);
  color:#EDD882;text-shadow:0 3px 20px rgba(0,0,0,.55);
  position:relative;line-height:1.1;
}
.h-rule-full{
  width:65%;height:1px;margin:16px auto;
  background:linear-gradient(to right,transparent,#B8962E 20%,#EDD882 50%,#B8962E 80%,transparent);
  position:relative;
}
.h-sub{
  font-family:'Cinzel',serif;font-size:.6rem;
  letter-spacing:.44em;color:rgba(200,160,48,.48);
  position:relative;
}
.hlang{
  font-family:'Cinzel',serif;font-size:.7rem;
  color:rgba(200,160,48,.65);letter-spacing:.25em;
  position:relative;margin-top:10px;
}
.h-orn-bot{
  font-size:.65rem;letter-spacing:.8em;
  color:rgba(200,160,48,.3);
  margin-top:18px;position:relative;
}
/* SEKTIONEN */
.sec-head{text-align:center;padding:52px 0 8px;}
.sec-t{font-family:'Cinzel Decorative',serif;font-size:2rem;color:#3A0A12;text-shadow:none;display:block;margin-bottom:6px;}
.sec-rule{width:140px;height:1px;margin:10px auto;background:linear-gradient(to right,transparent,#B8962E 20%,#EDD882 50%,#B8962E 80%,transparent);}
.sec-s{font-family:'Cinzel',serif;font-size:.58rem;color:#8B6914;letter-spacing:.28em;margin-top:4px;display:block;margin-bottom:28px;}

/* TOC PARCHMENT BLOCK */
.index-body{
  max-width:1000px;
  margin:36px auto 60px;
  padding:52px 72px 80px;
  background:#FAF5E8;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.55),0 2px 12px rgba(0,0,0,.35),inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;
}
.index-body::before{
  content:'';
  position:absolute;
  inset:12px;
  border:1px solid rgba(184,150,46,.08);
  pointer-events:none;
}
.sec-group{margin-bottom:0;text-align:center;}
.toc-item{
  display:flex;align-items:baseline;
  padding:14px 4px;
  border-bottom:1px solid rgba(184,150,46,.14);
  text-decoration:none;
  transition:background .15s;border-radius:2px;
}
.toc-item:hover{background:rgba(184,150,46,.06);}
.tnr{
  font-family:'Cinzel',serif;font-size:.72rem;
  color:#B8962E;
  min-width:50px;text-align:right;padding-right:20px;flex-shrink:0;
}
.tlat{
  font-family:'Cinzel Decorative',serif;font-size:1.25rem;
  color:#3A0A12;flex-shrink:0;
}
.tname{
  font-family:'EB Garamond',serif;font-size:1rem;font-style:italic;
  color:#6B5E40;
  margin-left:12px;flex-shrink:0;
}
.tdots{
  flex:1;height:1px;margin:0 18px;align-self:center;
  background:repeating-linear-gradient(to right,rgba(184,150,46,.2) 0,rgba(184,150,46,.2) 3px,transparent 3px,transparent 9px);
}
.tchap{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:#8B6914;flex-shrink:0;white-space:nowrap;
}
.tarr{color:rgba(184,150,46,.4);margin-left:14px;font-size:1rem;}

/* ── Konfessions-Switcher ── */
.conf-bar{
  display:flex;justify-content:center;gap:0;
  padding:18px 24px 0;
  font-family:'Cinzel',serif;
}
.conf-btn{
  padding:9px 24px;font-size:.65rem;letter-spacing:.16em;
  border:1px solid rgba(184,150,46,.35);background:transparent;
  color:rgba(184,150,46,.5);cursor:pointer;transition:all .18s;
  text-transform:uppercase;
}
.conf-btn:first-child{border-radius:2px 0 0 2px;}
.conf-btn:last-child{border-radius:0 2px 2px 0;}
.conf-btn:not(:first-child){border-left:none;}
.conf-btn.active{background:rgba(184,150,46,.14);color:#B8962E;border-color:rgba(184,150,46,.6);}
.conf-btn:hover:not(.active){background:rgba(184,150,46,.07);color:rgba(184,150,46,.8);}

/* Konfessions-spezifische Sichtbarkeit */
body[data-conf="protestant"] .sec-dk,
body[data-conf="protestant"] .sec-ox { display:none; }
body[data-conf="protestant"] .toc-item[data-testament="DK"],
body[data-conf="protestant"] .toc-item[data-testament="OX"] { display:none; }

body:not([data-conf="orthodox"]) .sec-ox { display:none; }
body[data-conf="orthodox"] .sec-ox { display:block; }

.conf-note{
  text-align:center;font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(184,150,46,.38);letter-spacing:.1em;padding:6px 24px 0;
}
</style>
</head>
<body>

<nav class="topbar">
  <a href="cover.html">&#8592; Cover</a>
</nav>

<header>
  <div class="h-orn">✦ &nbsp; ✦ &nbsp; ✦</div>
  <div class="h-cross-big">✝</div>
  <div class="htitle">${BIBLE_NAMES[trans.lang] || trans.native}</div>
  <div class="h-rule-full"></div>
  <div class="hlang">${trans.native.toUpperCase()}</div>
  <div class="h-orn-bot">—— ✦ … ✦ ——</div>
</header>

<main class="index-body">

<!-- ── Konfessions-Switcher ── -->
<div class="conf-bar">
  <button class="conf-btn" data-conf="catholic">✝ Katholisch</button>
  <button class="conf-btn" data-conf="protestant">☩ Protestantisch</button>
  <button class="conf-btn" data-conf="orthodox">☦ Orthodox</button>
</div>
<div class="conf-note" id="conf-note"></div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t">Vetus Testamentum</span>
  <div class="sec-rule"></div>
  <span class="sec-s">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;·&nbsp; ${booksVT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksVT)}
</div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t">Novum Testamentum</span>
  <div class="sec-rule"></div>
  <span class="sec-s">N O V I &nbsp; T E S T A M E N T I &nbsp;·&nbsp; ${booksNT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksNT)}
</div>

${dkSec}
${oxSec}

</main>

<footer style="text-align:center;padding:32px 24px 40px;font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.2em;color:rgba(200,160,48,.3);">
  KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
</footer>

<script>
(function(){
  var NOTES = {
    catholic:    '73 Bücher · Vulgata Clementina + Deuterokanonisch',
    protestant:  '66 Bücher · Altes & Neues Testament',
    orthodox:    '80 Bücher · inkl. 1 Esdras, Gebet des Manasse, Susanna u.a.'
  };
  var saved = localStorage.getItem('biblia_conf') || 'catholic';
  var btns  = document.querySelectorAll('.conf-btn');
  var note  = document.getElementById('conf-note');

  function setConf(c) {
    document.body.dataset.conf = c;
    localStorage.setItem('biblia_conf', c);
    btns.forEach(function(b){ b.classList.toggle('active', b.dataset.conf === c); });
    note.textContent = NOTES[c] || '';
  }

  setConf(saved);
  btns.forEach(function(b){
    b.addEventListener('click', function(){ setConf(b.dataset.conf); });
  });
})();
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  BUCHSEITE (Interlinear)
// ═══════════════════════════════════════════════════════

function buildBookPage(book, trans, vulgChaps, transChaps, lutherChaps, greekChaps) {
  // Vers-Map für Übersetzung
  const tm = {};
  if (transChaps) {
    for (const ch of transChaps) {
      tm[ch.nr] = {};
      for (const v of ch.verses) tm[ch.nr][v.nr] = v.text;
    }
  }
  // Luther-Map (Protestantisch)
  const lm = {};
  if (lutherChaps) {
    for (const ch of lutherChaps) {
      lm[ch.nr] = {};
      for (const v of ch.verses) lm[ch.nr][v.nr] = v.text;
    }
  }
  // Griechisch-Map (Orthodox)
  const gm = {};
  if (greekChaps) {
    for (const ch of greekChaps) {
      gm[ch.nr] = {};
      for (const v of ch.verses) gm[ch.nr][v.nr] = v.text;
    }
  }

  const bookIdx = BOOKS.findIndex(b => b.nr === book.nr);
  const prev    = BOOKS[bookIdx - 1];
  const next    = BOOKS[bookIdx + 1];

  const testLabel = book.testament === 'NT' ? 'NOVUM TESTAMENTUM'
    : book.testament === 'DK' ? 'LIBRI DEUTEROCANONOCI' : 'VETUS TESTAMENTUM';

  const chCount = vulgChaps.length;
  const vCount  = vulgChaps.reduce((s, c) => s + c.verses.length, 0);

  const chapBlocks = vulgChaps.map(ch => {
    const verseBlocks = ch.verses.map((v, vi) => {
      const lat    = esc(v.text);
      const lut    = esc((lm[ch.nr] || {})[v.nr] || '');
      const gre    = esc((gm[ch.nr] || {})[v.nr] || '');
      const tra    = esc((tm[ch.nr] || {})[v.nr] || '');
      const isFirst = vi === 0 ? ' first' : '';
      return `<div class="vb${isFirst}" id="v${ch.nr}-${v.nr}">
  <span class="vn">${v.nr}</span>
  <div class="vt">
    <p class="base base-c">${lat}</p>
    ${lut ? `<p class="base base-p">${lut}</p>` : '<p class="base base-p"></p>'}
    ${gre ? `<p class="base base-o">${gre}</p>` : '<p class="base base-o"></p>'}
    ${tra ? `<p class="tra">${tra}</p>` : ''}
  </div>
</div>`;
    }).join('\n');

    return `<section class="chap" id="c${ch.nr}">
  <div class="chhead">
    <span class="chrom">${toRoman(ch.nr)}</span>
    <span class="chlbl">Caput ${ch.nr}</span>
  </div>
${verseBlocks}
</section>`;
  }).join('\n\n');

  const prevLink = prev
    ? `<a href="${bookFile(prev)}">&#8592; ${prev.latin}</a>`
    : `<span></span>`;
  const nextLink = next
    ? `<a href="${bookFile(next)}">${next.latin} &#8594;</a>`
    : `<span></span>`;
  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${book.latin} &middot; ${trans.native} &middot; Biblia Catholica</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#2C0810;
  background-image:radial-gradient(ellipse at 50% 20%,#4A1020 0%,#1A0407 100%);
  font-family:'EB Garamond',serif;
  color:#1A0E06;
  font-size:17px;
}

/* ──────────────────────────────────────────
   BUCHKOPF
────────────────────────────────────────── */
.bhead{
  background:
    repeating-linear-gradient( 45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    repeating-linear-gradient(-45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    linear-gradient(162deg,#2C0810 0%,#4A1020 45%,#5C1828 65%,#4A1020 85%,#2C0810 100%);
  padding:36px 28px 28px;
  text-align:center;
  border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
/* Innerer Rahmen — äußerer Ring */
.bhead::before{
  content:'';position:absolute;inset:14px;
  border:1px solid rgba(200,160,48,.22);
  pointer-events:none;
}
/* Innerer Rahmen — innerer Ring */
.bhead::after{
  content:'';position:absolute;inset:22px;
  border:1px solid rgba(200,160,48,.08);
  pointer-events:none;
}
.btestament{
  display:inline-block;
  border:1px solid rgba(200,160,48,.32);
  color:rgba(200,160,48,.52);
  font-family:'Cinzel',serif;font-size:.55rem;
  letter-spacing:.3em;padding:4px 18px;
  border-radius:2px;margin-bottom:16px;
  position:relative;
}
.blatin{
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(1.9rem,7vw,3.4rem);
  color:#EDD882;
  text-shadow:0 3px 20px rgba(0,0,0,.55);
  letter-spacing:.06em;position:relative;
}
.btrans{
  font-family:'Cinzel',serif;
  font-size:.88rem;
  color:#C8A030;margin-top:10px;
  letter-spacing:.16em;position:relative;
}
.bmeta{
  font-family:'Cinzel',serif;font-size:.62rem;
  color:rgba(200,160,48,.4);margin-top:6px;
  letter-spacing:.08em;position:relative;
}

/* ──────────────────────────────────────────
   KAPITELINHALT
────────────────────────────────────────── */
.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#FAF5E8;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:0 8px 80px rgba(0,0,0,.55),0 2px 12px rgba(0,0,0,.35),inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;
}
.content::before{
  content:'';
  position:absolute;
  inset:12px;
  border:1px solid rgba(184,150,46,.08);
  pointer-events:none;
}

.chap{margin-top:0;}

.chhead{
  text-align:center;
  padding:40px 0 20px;
  margin-bottom:16px;
  position:relative;
}
.chhead::before{
  content:'——— ✦ ✦ ✦ ———';
  display:block;
  font-size:.7rem;
  color:rgba(184,150,46,.45);
  letter-spacing:.35em;
  margin-bottom:16px;
}
.chhead::after{
  content:'';
  display:block;
  width:200px;
  height:1px;
  margin:14px auto 0;
  background:linear-gradient(to right,transparent,#B8962E,transparent);
}
.chrom{
  font-family:'Cinzel Decorative',serif;
  font-size:4rem;color:#8B6914;
  display:block;
  text-shadow:0 2px 18px rgba(184,150,46,.2);
  line-height:1;
}
.chlbl{
  font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(184,150,46,.42);letter-spacing:.32em;
  display:block;margin-top:8px;
}

/* ──────────────────────────────────────────
   VERSE
────────────────────────────────────────── */
.vb{
  display:flex;
  padding:20px 6px;
  border-bottom:1px solid rgba(184,150,46,.12);
  background:none;
  border-radius:2px;
  transition:background .15s;
}
.vb:hover{
  background:rgba(184,150,46,.04);
}

/* Versnummer */
.vn{
  flex-shrink:0;
  width:38px;
  padding-top:4px;
  font-family:'Cinzel',serif;font-size:.56rem;
  color:rgba(184,150,46,.52);text-align:right;
  padding-right:12px;line-height:2.4;
}

.vt{
  flex:1;
  padding:0 20px 0 4px;
}

/* BASIS-TEXT — wechselt je nach Konfession */
.base{
  font-family:'EB Garamond',serif;
  font-size:1.2rem;
  font-weight:500;
  line-height:2.1;
  color:#3D1A08;
  display:none;
}
/* Standardmäßig (kein data-conf): katholisch = Latein */
body:not([data-conf]) .base-c,
body[data-conf="catholic"] .base-c { display:block; }
body[data-conf="protestant"] .base-p { display:block; }
body[data-conf="orthodox"] .base-o { display:block; }
/* Leere Basis-Paragraphen ausblenden */
.base:empty { display:none !important; }

/* ÜBERSETZUNG — SEKUNDÄR: kleiner, kursiv, unter dem Latein */
.tra{
  font-family:'EB Garamond',serif;
  font-size:.93rem;
  font-style:italic;
  line-height:1.95;
  color:#1E2848;
  margin-top:5px;
  padding-left:14px;
  border-left:2px solid rgba(90,110,170,.2);
}

/* Drop-Cap: erster Vers eines Kapitels */
.vb.first .base::first-letter{
  font-family:'Cinzel Decorative',serif;
  font-size:4em;
  float:left;
  line-height:.7;
  padding-right:.08em;
  margin-top:.07em;
  color:#B8962E;
  text-shadow:1px 2px 6px rgba(0,0,0,.12);
}

/* ──────────────────────────────────────────
   BUCH-NAVIGATION (unten)
────────────────────────────────────────── */
.bnav{
  display:flex;justify-content:space-between;align-items:center;
  background:#2C0810;border-top:3px solid #B8962E;
  padding:12px 24px;gap:12px;
}
.bnav a,.bnav .dim{
  color:#C8A030;text-decoration:none;
  font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.07em;
  padding:6px 16px;
  border:1px solid rgba(200,160,48,.28);
  border-radius:2px;transition:background .18s;
}
.bnav a:hover{background:rgba(200,160,48,.12);}
.bnav .dim{color:rgba(200,160,48,.2);border-color:rgba(200,160,48,.1);}
.bnav .center{
  font-family:'Cinzel',serif;font-size:.68rem;
  color:rgba(200,160,48,.65);text-align:center;
  letter-spacing:.06em;text-decoration:none;
  border:1px solid rgba(200,160,48,.28);border-radius:2px;
  padding:6px 20px;transition:background .18s;
}
.bnav .center:hover{background:rgba(200,160,48,.1);}

/* DRUCK */
@media print{
  .bnav{display:none;}
  .bhead{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .vb{break-inside:avoid;}
}

/* MOBIL */
@media(max-width:600px){
  .blatin{font-size:1.8rem;}
  .base{font-size:1rem;}
  .tra{font-size:.84rem;}
  .content{padding:16px 18px 60px;margin:0;border-left:none;border-right:none;border-radius:0;}
  .chrom{font-size:1.8rem;}
}
</style>
</head>
<body>

<header class="bhead">
  <div class="btestament">${testLabel}</div>
  <div class="blatin">${book.latin.toUpperCase()}</div>
  <div class="btrans">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.en)[book.nr-1]} &nbsp;&middot;&nbsp; <em>${trans.native}</em></div>
  <div class="bmeta">${chCount} Capita &nbsp;&middot;&nbsp; ${vCount} Versus</div>
</header>

<main class="content">
${chapBlocks}
</main>

<nav class="bnav">
  ${prevLink}
  <a href="../index.html" class="center">↑ &nbsp; Inhaltsverzeichnis</a>
  ${nextLink}
</nav>

<script>
(function(){
  var c = localStorage.getItem('biblia_conf') || 'catholic';
  document.body.dataset.conf = c;
})();
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║  BIBLIA CATHOLICA INTERLINEARIS – BUILD v3           ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌  Kein "data/"-Ordner. Bitte zuerst: node fetch-texts.js\n');
    process.exit(1);
  }

  mkDir(OUT_DIR);

  // Cover + Rückseite + Hauptindex
  fs.writeFileSync(path.join(OUT_DIR, 'cover.html'),      buildCover());
  console.log('  ✓ cover.html');
  fs.writeFileSync(path.join(OUT_DIR, 'back-cover.html'), buildBackCover());
  console.log('  ✓ back-cover.html');

  // Vulgata laden (Bücher 1-73; OX-Bücher 74-80 aus data-orthodox/kjv/)
  const vulg = {};
  for (const book of BOOKS) {
    if (book.testament === 'OX') {
      const raw = loadBook('kjv', book.nr);  // KJVA als Basis-Text für orthodoxe Bücher
      if (raw) vulg[book.nr] = parseBook(raw);
    } else {
      const raw = loadBook('vulgate', book.nr);
      if (raw) vulg[book.nr] = parseBook(raw);
    }
  }
  console.log(`  ✓ Vulgata + Orthodox: ${Object.keys(vulg).length} Bücher`);

  // Pro Übersetzung
  for (const trans of TRANSLATIONS) {
    process.stdout.write(`\n  📖  ${trans.native} (${trans.code}) ...`);

    const tDir = path.join(OUT_DIR, trans.code);
    const bDir = path.join(tDir, 'bücher');
    mkDir(bDir);

    // Sprachcover
    fs.writeFileSync(path.join(tDir, 'cover.html'), buildLangCover(trans));

    const avail = [];
    for (const book of BOOKS) {
      // OX books need their own vulgate-equivalent from data-orthodox/
      const vulgData = book.testament === 'OX'
        ? (vulg[book.nr] || parseBook(loadBook('kjv', book.nr)))
        : vulg[book.nr];
      if (!vulgData) continue;
      const tRaw      = loadBook(trans.code, book.nr);
      const tChap     = tRaw ? parseBook(tRaw) : null;
      const lutherRaw = loadLutherBook(book.nr);
      const lutherChap = lutherRaw ? parseBook(lutherRaw) : null;
      const greekRaw  = loadGreekBook(book.nr);
      const greekChap = greekRaw ? parseBook(greekRaw) : null;
      fs.writeFileSync(path.join(bDir, bookFile(book)), buildBookPage(book, trans, vulgData, tChap, lutherChap, greekChap));
      avail.push({...book, chapCount: vulgData.length});
    }
    fs.writeFileSync(path.join(tDir, 'index.html'), buildLangIndex(trans, avail));
    process.stdout.write(` ✓ (${avail.length} Bücher)\n`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildMainIndex());
  console.log('\n  ✓ index.html\n');
  console.log('✅  Fertig! Öffne: Übersetzungen/german/cover.html\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  process.exit(1);
});
