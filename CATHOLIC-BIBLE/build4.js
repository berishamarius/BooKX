'use strict';
/**
 * BIBLIA CATHOLICA INTERLINEARIS — HTML GENERATOR v3
 * Würdiges Design: Weinrot — Gold — Pergament — Reine CSS-Typografie
 * Kein SVG — Keine Rahmen-Tricks — Latein dominant
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const OUT_DIR  = path.join(__dirname, 'Übersetzungen');

// -------------------------------------------------------
//  ÜBERSETZUNGEN
// -------------------------------------------------------

const TRANSLATIONS = [
  { code: 'kjv',        lang: 'en', native: 'English',    display: 'King James Version (1611)',      flag: '????' },
  { code: 'german',     lang: 'de', native: 'Deutsch',    display: 'Textbibel (1906)',               flag: '????' },
  { code: 'french',     lang: 'fr', native: 'Français',   display: 'Crampon (1923)',                 flag: '????' },
  { code: 'spanish',    lang: 'es', native: 'Español',    display: 'Reina-Valera (1909)',            flag: '????' },
  { code: 'portuguese', lang: 'pt', native: 'Português',  display: 'Bíblia Livre',                  flag: '????' },
  { code: 'polish',     lang: 'pl', native: 'Polski',     display: 'Biblia Gdanska (1881)',          flag: '????' },
  { code: 'russian',    lang: 'ru', native: '???????',    display: '??????????? (1876)',             flag: '????' },
  { code: 'croatian',   lang: 'hr', native: 'Hrvatski',   display: 'Hrvatska Biblija Šarića',       flag: '????' },
  { code: 'dutch',      lang: 'nl', native: 'Nederlands', display: 'Statenvertaling (1637)',         flag: '????' },
  { code: 'hungarian',  lang: 'hu', native: 'Magyar',     display: 'Károli (1908)',                  flag: '????' },
  { code: 'czech',      lang: 'cs', native: 'Čeština',    display: 'Bible Králické (1613)',          flag: '????' },
  { code: 'swedish',    lang: 'sv', native: 'Svenska',    display: 'Svenska Bibeln (1917)',          flag: '????' },
  { code: 'tagalog',    lang: 'tl', native: 'Filipino',   display: 'Ang Biblia (1905)',              flag: '????' },
  { code: 'ukrainian',  lang: 'uk', native: '??????????', display: '?????? ??????? (1962)',         flag: '????' },
  { code: 'albanian',   lang: 'sq', native: 'Shqip',      display: 'Bibla (UFSHB)',                 flag: '????' },
  { code: 'syriac',     lang: 'syr', native: 'ܣܘܪܝܬ',    display: 'Peshitta (Ancient)',            flag: '????', dir: 'rtl' },
  { code: 'armenian',   lang: 'hy', native: 'Հայերեն',   display: 'Armenian Eastern',             flag: '????', dir: 'ltr' },
];

// -------------------------------------------------------
//  BÜCHERLISTE
// -------------------------------------------------------

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
];

const BIBLE_NAMES = {
  en: 'The Holy Bible',        de: 'Die Heilige Bibel',     fr: 'La Sainte Bible',
  es: 'La Santa Biblia',       pt: 'A Bíblia Sagrada',      pl: 'Pismo Swiete',
  ru: '????????? ???????',     hr: 'Sveto Pismo',           nl: 'De Heilige Bijbel',
  hu: 'A Szentï¿½rï¿½s',           cs: 'Pï¿½smo Svatï¿½',           sv: 'Den Heliga Bibeln',
  tl: 'Ang Banal na Bibliya',  uk: '???????? ??????',       sq: 'Bibla e Shenjtï¿½',
};

// Schaltflï¿½che "Lesen" pro Sprache
const READ_BTN = {
  en:'R E A D',      de:'L E S E N',    fr:'L I R E',
  es:'L E E R',      pt:'L E R',        pl:'C Z Y T A J',
  ru:'? ? ? ? ? ?', hr:'C I T A J',    nl:'L E Z E N',
  hu:'O L V A S S',  cs:'C ï¿½ S T',      sv:'L ï¿½ S A',
  tl:'B A S A H I N',uk:'? ? ? ? ? ?', sq:'L E X O',
};

// Buchbezeichnungen pro Sprache (Index = Buchnr - 1)
const BOOK_NAMES = {
  en:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','Tobit','Judith','1 Maccabees','2 Maccabees','Wisdom','Sirach','Baruch','1 Esdras','2 Esdras','Prayer of Manasseh','Prayer of Azariah','Susanna','Bel and the Dragon','Additions to Esther'],
  de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwörter','Kohelet','Hoheslied','Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabäer','2. Makkabäer','Weisheit','Sirach','Baruch','1. Esra (gr.)','2. Esra (gr.)','Gebet des Manasse','Gebet des Asarja','Susanna','Bel und der Drache','Zusätze zu Ester'],
  fr:['Genï¿½se','Exode','Lï¿½vitique','Nombres','Deutï¿½ronome','Josuï¿½','Juges','Ruth','1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Nï¿½hï¿½mie','Esther','Job','Psaumes','Proverbes','Ecclï¿½siaste','Cantique des Cantiques','Isaï¿½e','Jï¿½rï¿½mie','Lamentations','ï¿½zï¿½chiel','Daniel','Osï¿½e','Joï¿½l','Amos','Abdias','Jonas','Michï¿½e','Nahum','Habacuc','Sophonie','Aggï¿½e','Zacharie','Malachie','Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','ï¿½phï¿½siens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens','1 Timothï¿½e','2 Timothï¿½e','Tite','Philï¿½mon','Hï¿½breux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse','Tobie','Judith','1 Maccabï¿½es','2 Maccabï¿½es','Sagesse','Siracide','Baruch'],
  es:['Gï¿½nesis','ï¿½xodo','Levï¿½tico','Nï¿½meros','Deuteronomio','Josuï¿½','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crï¿½nicas','2 Crï¿½nicas','Esdras','Nehemï¿½as','Ester','Job','Salmos','Proverbios','Eclesiastï¿½s','Cantar de los Cantares','Isaï¿½as','Jeremï¿½as','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amï¿½s','Abdï¿½as','Jonï¿½s','Miqueas','Nahï¿½m','Habacuc','Sofonï¿½as','Ageo','Zacarï¿½as','Malaquï¿½as','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gï¿½latas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemï¿½n','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis','Tobï¿½as','Judit','1 Macabeos','2 Macabeos','Sabidurï¿½a','Eclesiï¿½stico','Baruc'],
  pt:['Gï¿½nesis','ï¿½xodo','Levï¿½tico','Nï¿½meros','Deuteronï¿½mio','Josuï¿½','Juï¿½zes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crï¿½nicas','2 Crï¿½nicas','Esdras','Neemias','Ester','Jï¿½','Salmos','Provï¿½rbios','Eclesiastes','Cï¿½ntico dos Cï¿½nticos','Isaï¿½as','Jeremias','Lamentaï¿½ï¿½es','Ezequiel','Daniel','Osï¿½ias','Joel','Amï¿½s','Obadias','Jonas','Miquï¿½ias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','Joï¿½o','Atos','Romanos','1 Corï¿½ntios','2 Corï¿½ntios','Gï¿½latas','Efï¿½sios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timï¿½teo','2 Timï¿½teo','Tito','Filï¿½mon','Hebreus','Tiago','1 Pedro','2 Pedro','1 Joï¿½o','2 Joï¿½o','3 Joï¿½o','Judas','Apocalipse','Tobias','Judite','1 Macabeus','2 Macabeus','Sabedoria','Eclesiï¿½stico','Baruc'],
  pl:['Rodzaju','Wyjscia','Kaplanska','Liczb','Powtï¿½rzonego Prawa','Jozuego','Sedziï¿½w','Rut','1 Samuela','2 Samuela','1 Krï¿½lewska','2 Krï¿½lewska','1 Kronik','2 Kronik','Ezdrasza','Nehemiasza','Estery','Hioba','Psalmy','Przyslï¿½w','Koheleta','Piesn nad Piesniami','Izajasza','Jeremiasza','Lamentacje','Ezechiela','Daniela','Ozeasza','Joela','Amosa','Abdiasza','Jonasza','Micheasza','Nahuma','Habakuka','Sofoniasza','Aggeusza','Zachariasza','Malachiasza','Mateusza','Marka','Lukasza','Jana','Dzieje Apostolskie','Rzymian','1 Koryntian','2 Koryntian','Galatï¿½w','Efezjan','Filipian','Kolosan','1 Tesaloniczan','2 Tesaloniczan','1 Tymoteusza','2 Tymoteusza','Tytusa','Filemona','Hebrajczykï¿½w','Jakuba','1 Piotra','2 Piotra','1 Jana','2 Jana','3 Jana','Judy','Objawienia','Tobiasza','Judyty','1 Machabejska','2 Machabejska','Madrosci','Syracha','Barucha'],
  ru:['?????','?????','?????','?????','????????????','?????? ??????','?????','????','1 ??????','2 ??????','3 ??????','4 ??????','1 ?????????????','2 ?????????????','?????','??????','??????','???','????????','??????','??????????','????? ??????','?????','???????','???? ???????','????????','??????','????','?????','????','?????','????','?????','????','???????','?????','?????','???????','???????','??????','????','????','?????','??????','????????','1 ??????????','2 ??????????','???????','????????','???????????','??????????','1 ???????????????','2 ???????????????','1 ???????','2 ???????','????','????????','??????','??????','1 ?????','2 ?????','1 ??????','2 ??????','3 ??????','????','??????????','?????','??????','1 ????????????','2 ????????????','??????????? ????????','?????','?????'],
  hr:['Postanak','Izlazak','Levitski zakonik','Brojevi','Ponovljeni zakon','Joï¿½ua','Suci','Ruta','1 Samuelova','2 Samuelova','1 Kraljevska','2 Kraljevska','1 Ljetopisa','2 Ljetopisa','Ezra','Nehemija','Estera','Job','Psalmi','Mudre izreke','Propovjednik','Pjesma nad pjesmama','Izaija','Jeremija','Tuï¿½aljke','Ezekiel','Daniel','Hoï¿½ea','Joel','Amos','Obadija','Jona','Mihej','Nahum','Habakuk','Sefanija','Hagaj','Zaharija','Malahija','Matej','Marko','Luka','Ivan','Djela apostolska','Rimljanima','1 Korincanima','2 Korincanima','Galacanima','Efeï¿½anima','Filipljanima','Koloï¿½anima','1 Solunjanima','2 Solunjanima','1 Timoteju','2 Timoteju','Titu','Filemonu','Hebrejima','Jakovljeva','1 Petrova','2 Petrova','1 Ivanova','2 Ivanova','3 Ivanova','Judina','Otkrivenje','Tobija','Judita','1 Makabejska','2 Makabejska','Mudrost','Sirah','Baruh'],
  nl:['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozua','Rechters','Ruth','1 Samuï¿½l','2 Samuï¿½l','1 Koningen','2 Koningen','1 Kronieken','2 Kronieken','Ezra','Nehemia','Ester','Job','Psalmen','Spreuken','Prediker','Hooglied','Jesaja','Jeremia','Klaagliederen','Ezechiï¿½l','Daniï¿½l','Hosea','Joï¿½l','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Sefanja','Haggai','Zacharia','Maleachi','Matteï¿½s','Marcus','Lucas','Johannes','Handelingen','Romeinen','1 Korintiï¿½rs','2 Korintiï¿½rs','Galaten','Efeziï¿½rs','Filippenzen','Kolossenzen','1 Tessalonicenzen','2 Tessalonicenzen','1 Timotheï¿½s','2 Timotheï¿½s','Titus','Filemon','Hebreeï¿½n','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Openbaring','Tobit','Judit','1 Makkabeeï¿½n','2 Makkabeeï¿½n','Wijsheid','Sirach','Baruch'],
  hu:['Teremtï¿½s','Kivonulï¿½s','Levitï¿½k kï¿½nyve','Szï¿½mok','Mï¿½sodik tï¿½rvï¿½nykï¿½nyv','Jï¿½zsue','Bï¿½rï¿½k','Rï¿½t','1 Sï¿½muel','2 Sï¿½muel','1 Kirï¿½lyok','2 Kirï¿½lyok','1 Krï¿½nikï¿½k','2 Krï¿½nikï¿½k','Ezdrï¿½s','Nehemiï¿½s','Eszter','Jï¿½b','Zsoltï¿½rok','Pï¿½ldabeszï¿½dek','Prï¿½dikï¿½tor','ï¿½nekek ï¿½neke','Izajï¿½s','Jeremiï¿½s','Siralmak','Ezekiel','Dï¿½niel','Ozeï¿½s','Joel','ï¿½mosz','Abdiï¿½s','Jï¿½nï¿½s','Mikeï¿½s','Nï¿½hum','Habakuk','Szofoniï¿½s','Aggeus','Zakariï¿½s','Malakiï¿½s','Mï¿½tï¿½','Mï¿½rk','Lukï¿½cs','Jï¿½nos','Apostolok cselekedetei','Rï¿½maiakhoz','1 Korintusiakhoz','2 Korintusiakhoz','Galatï¿½khoz','Efezusiakhoz','Filippiekhez','Kolosszeiekhez','1 Tesszalonikaiakhoz','2 Tesszalonikaiakhoz','1 Timï¿½teushoz','2 Timï¿½teushoz','Tituszhoz','Filemonhoz','Zsidï¿½khoz','Jakab','1 Pï¿½ter','2 Pï¿½ter','1 Jï¿½nos','2 Jï¿½nos','3 Jï¿½nos','Jï¿½dï¿½s','Jelenï¿½sek','Tï¿½bit','Judit','1 Makkabeusok','2 Makkabeusok','Bï¿½lcsessï¿½g','Sirï¿½k','Bï¿½ruk'],
  cs:['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozue','Soudcu','Rï¿½t','1 Samuelova','2 Samuelova','1 Krï¿½lovskï¿½','2 Krï¿½lovskï¿½','1 Paralipomenon','2 Paralipomenon','Ezdrï¿½','Nehemiï¿½','Ester','Jï¿½b','ï¿½almy','Prï¿½slovï¿½','Kazatel','Pï¿½sen pï¿½snï¿½','Izajï¿½','Jeremiï¿½','Plï¿½c','Ezechiel','Daniel','Ozeï¿½','Joel','ï¿½mos','Abdiï¿½','Jonï¿½','Micheï¿½','Nahum','Habakuk','Sofoniï¿½','Aggeus','Zachariï¿½','Malachiï¿½','Matouï¿½','Marek','Lukï¿½','Jan','Skutky','Rï¿½manum','1 Korintskï¿½m','2 Korintskï¿½m','Galatskï¿½m','Efezskï¿½m','Filipskï¿½m','Koloskï¿½m','1 Tesalonickï¿½m','2 Tesalonickï¿½m','1 Timoteovi','2 Timoteovi','Titovi','Filemonovi','ï¿½idum','Jakubuv','1 Petruv','2 Petruv','1 Januv','2 Januv','3 Januv','Juduv','Zjevenï¿½','Tobiï¿½','Judit','1 Makabejskï¿½','2 Makabejskï¿½','Moudrost','Sirachovec','Baruch'],
  sv:['Fï¿½rsta Mosebok','Andra Mosebok','Tredje Mosebok','Fjï¿½rde Mosebok','Femte Mosebok','Josua','Domarboken','Rut','Fï¿½rsta Samuelsboken','Andra Samuelsboken','Fï¿½rsta Kungaboken','Andra Kungaboken','Fï¿½rsta Krï¿½nikeboken','Andra Krï¿½nikeboken','Esra','Nehemja','Ester','Job','Psaltaren','Ordsprï¿½ksboken','Predikaren','Hï¿½ga visan','Jesaja','Jeremia','Klagovisorna','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Mika','Nahum','Habakuk','Sefanja','Haggai','Sakarja','Malaki','Matteus','Markus','Lukas','Johannes','Apostlagï¿½rningarna','Romarbrevet','1 Korintierbrevet','2 Korintierbrevet','Galaterbrevet','Efesierbrevet','Filipperbrevet','Kolosserbrevet','1 Thessalonikerbrevet','2 Thessalonikerbrevet','1 Timoteusbrevet','2 Timoteusbrevet','Titusbrevet','Filemonbrevet','Hebreerbrevet','Jakobsbrevet','1 Petrusbrevet','2 Petrusbrevet','1 Johannesbrevet','2 Johannesbrevet','3 Johannesbrevet','Judasbrevet','Uppenbarelseboken','Tobit','Judit','Fï¿½rsta Mackabï¿½erboken','Andra Mackabï¿½erboken','Visdomen','Syrak','Baruk'],
  tl:['Genesis','Exodo','Levitico','Mga Bilang','Deuteronomio','Josue','Mga Hukom','Rut','1 Samuel','2 Samuel','1 Hari','2 Hari','1 Cronica','2 Cronica','Esdras','Nehemias','Ester','Job','Mga Awit','Kawikaan','Mangangaral','Awit ng mga Awit','Isaias','Jeremias','Panaghoy','Ezekiel','Daniel','Oseas','Joel','Amos','Abdias','Jonas','Mikas','Nahum','Habakuk','Sofonias','Ageo','Zacarias','Malakias','Mateo','Marcos','Lucas','Juan','Mga Gawa','Roma','1 Corinto','2 Corinto','Galacia','Efeso','Filipos','Colosas','1 Tesalonica','2 Tesalonica','1 Timoteo','2 Timoteo','Tito','Filemon','Hebreo','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Pahayag','Tobit','Judit','1 Macabeo','2 Macabeo','Karunungan','Sirac','Baruc'],
  uk:['?????','?????','?????','?????','?????????? ??????','????? ??????','??????','???','1 ???????','2 ???????','1 ?????','2 ?????','1 ??????','2 ??????','?????','??????','?????','???','??????','??????????','?????????','????? ??????','????','??????','???? ??????','????????','???????','????','?????','?????','?????','????','?????','?????','???????','???????','????','???????','???????','??????','?????','????','??????','??????','??????','1 ????????','2 ????????','???????','??????','?????\'??','???????','1 ???????','2 ???????','1 ???????','2 ???????','????','????????','??????','?????','1 ?????','2 ?????','1 ??????','2 ??????','3 ??????','???','???????????','?????','????','1 ?????????','2 ?????????','???????????','?????','?????'],
  sq:['Zanafilla','Eksodi','Levitiku','Numrat','Ligji i Pï¿½rtï¿½rirï¿½','Jozueu','Gjyqtarï¿½t','Ruthi','1 Samueli','2 Samueli','1 Mbretï¿½rve','2 Mbretï¿½rve','1 Kronikave','2 Kronikave','Esdra','Nehemia','Estera','Jobi','Psalmet','Fjalï¿½t e urta','Predikuesi','Kï¿½nga e Kï¿½ngï¿½ve','Isaia','Jeremia','Vajtimet','Ezekieli','Danieli','Osea','Joeli','Amosi','Abdia','Jona','Mikea','Nahumi','Habakuku','Sefania','Ageui','Zakaria','Malakia','Mateu','Marku','Luka','Gjoni','Veprat','Romakï¿½ve','1 Korintasve','2 Korintasve','Galatasve','Efesianï¿½ve','Filipianï¿½ve','Kolosianï¿½ve','1 Selanikasve','2 Selanikasve','1 Timoteut','2 Timoteut','Titit','Filemonit','Hebrenjve','Jakobi','1 Pjetri','2 Pjetri','1 Gjoni','2 Gjoni','3 Gjoni','Juda','Zbulesa','Tobiti','Judita','1 Makabenjve','2 Makabenjve','Urtï¿½sia','Sirak','Baruku'],
};

// -------------------------------------------------------
//  HELFER
// -------------------------------------------------------

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

const LUTHER_DIR = path.join(__dirname, 'data-luther');

function loadLutherBook(nr) {
  const f = path.join(LUTHER_DIR, `${pad3(nr)}.json`);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) { return null; }
}

function loadBook(code, nr) {
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

// -------------------------------------------------------
//  SCHRIFTEN (Google Fonts CDN)
// -------------------------------------------------------

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">`;

// -------------------------------------------------------
//  COVER (Hauptcover - Sprachauswahl)
// -------------------------------------------------------

function buildCover() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Die Heilige Bibel</title>
${FONTS}
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#2a0810;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.12);pointer-events:none;z-index:5;}
.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.corner{position:fixed;width:56px;height:56px;pointer-events:none;z-index:6;}
.c-tl{top:14px;left:14px;border-top:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-tr{top:14px;right:14px;border-top:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
</style>
</head>
<body>
<a class="book" href="german/index.html">
  <img src="../../Die Heilige Bibel - Rot.png" alt="Die Heilige Bibel">
</a>
<div class="corner c-tl"></div>
<div class="corner c-tr"></div>
<div class="corner c-bl"></div>
<div class="corner c-br"></div>
</body>
</html>`;
}
// -------------------------------------------------------
//  RÜCKSEITE
// -------------------------------------------------------

function buildBackCover(trans) {
  // root: Übersetzungen/back-cover.html ? img ../../  cover cover.html
  // lang: Übersetzungen/german/back-cover.html ? img ../../../  cover cover.html
  const imgPath    = trans ? '../../../Bibel-Rueckseite-Katholisch.png' : '../../Bibel-Rueckseite-Katholisch.png';
  const coverLink  = 'cover.html';
  const htmlLang   = trans ? trans.lang : 'la';
  const pageTitle  = trans ? `${trans.native} ï¿½ Biblia Catholica ï¿½ Rückseite` : 'Biblia Catholica ï¿½ Rï¿½ckseite';
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#1a0005;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.35);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.15);pointer-events:none;z-index:5;}
.corner{position:fixed;width:44px;height:44px;pointer-events:none;z-index:6;}
.c-tl{top:20px;left:20px;border-top:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-tr{top:20px;right:20px;border-top:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.c-bl{bottom:20px;left:20px;border-bottom:2px solid rgba(200,160,48,.5);border-left:2px solid rgba(200,160,48,.5);}
.c-br{bottom:20px;right:20px;border-bottom:2px solid rgba(200,160,48,.5);border-right:2px solid rgba(200,160,48,.5);}
.book{width:min(467px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 28px 5%;text-align:center;}
.prayer-label{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.28em;color:rgba(200,160,48,.75);margin-bottom:8px;}
.rule{width:70%;height:1px;margin:7px auto;background:linear-gradient(to right,transparent,#C8A030,transparent);}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.9rem;color:rgba(237,216,130,.9);line-height:1.85;hyphens:none;-webkit-hyphens:none;}
.prayer-ref{font-family:'Cinzel',serif;font-size:.44rem;color:rgba(200,160,48,.65);margin-top:6px;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<a class="book" href="${coverLink}">
  <img src="${imgPath}" alt="Rückseite">
  <div class="overlay">
    <div class="prayer-label">✦ &nbsp; Vater unser &nbsp; ✦</div>
    <div class="prayer">
     Vater unser im Himmel, 
     geheiligt werde dein Name. Dein Reich komme.
     Dein Wille geschehe, wie im Himmel so auf Erden.
     Unser tägliches Brot gib uns heute.
     Und vergib uns unsere Schuld, 
     wie auch wir vergeben unseren Schuldigern.
     Und führe uns nicht in Versuchung, sondern erlöse uns von dem Bösen. 
     Amen
    </div>
    <div class="prayer-ref">Matthaeus 6,9-13 &nbsp;-&nbsp; Vulgata</div>
  </div>
</a>
</body>
</html>`;
}

// -------------------------------------------------------
//  HAUPTINDEX - Weiterleitung zum Cover
// -------------------------------------------------------

function buildMainIndex() {
  return `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=cover.html">
<title>Biblia Catholica Interlinearis</title>
</head>
<body></body>
</html>`;
}

// -------------------------------------------------------
//  SPRACHCOVER (pro Übersetzung) – PNG Cover
// -------------------------------------------------------

function buildLangCover(trans) {
  const bibName  = BIBLE_NAMES[trans.lang] || 'Holy Bible';
  const btnTxt   = READ_BTN[trans.lang] || 'R E A D';

  return `<!DOCTYPE html>
<html lang="${trans.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${bibName} &middot; Die Heilige Bibel</title>
${FONTS}
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#2a0810;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(200,160,48,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(200,160,48,.12);pointer-events:none;z-index:5;}
.book{width:min(500px,90vw);position:relative;z-index:1;display:block;text-decoration:none;cursor:pointer;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:13px 56px;color:#EDD882;text-decoration:none;font-family:'Cinzel',serif;font-size:.82rem;font-weight:600;letter-spacing:.28em;border:2px solid rgba(200,160,48,.8);background:#5a0818;transition:all .22s;}
.btn:hover{background:#7a1028;border-color:#EDD882;}
.corner{position:fixed;width:56px;height:56px;pointer-events:none;z-index:6;}
.c-tl{top:14px;left:14px;border-top:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-tr{top:14px;right:14px;border-top:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
.c-bl{bottom:14px;left:14px;border-bottom:2px solid rgba(200,160,48,.55);border-left:2px solid rgba(200,160,48,.55);}
.c-br{bottom:14px;right:14px;border-bottom:2px solid rgba(200,160,48,.55);border-right:2px solid rgba(200,160,48,.55);}
</style>
</head>
<body>
<a class="book" href="index.html">
  <img src="../../../Die Heilige Bibel - Rot.png" alt="${bibName}">
</a>
<div class="corner c-tl"></div>
<div class="corner c-tr"></div>
<div class="corner c-bl"></div>
<div class="corner c-br"></div>
</body>
</html>`; /* LANGCOVER_END */
}

// -------------------------------------------------------
//  SPRACHINDEX (Bücherliste)
// -------------------------------------------------------

function buildLangIndex(trans, availBooks) {
  const byTest = g => availBooks.filter(b => b.testament === g);
  const booksVT = byTest('VT'), booksNT = byTest('NT'), booksDK = byTest('DK');

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
  <span class="sec-t sec-t-c">Libri Deuterocanonoci</span>
  <span class="sec-t sec-t-p">Deuterokanonische Bücher</span>
  <div class="sec-rule"></div>
  <span class="sec-s">L I B R I &nbsp; D E U T E R O C A N O N I C I &nbsp;–&nbsp; ${booksDK.length} &nbsp; L I B R I</span>
</div>
${bookList(booksDK)}
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
  display:flex;align-items:center;justify-content:space-between;
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
    linear-gradient(162deg,#1A0407 0%,#2C0810 18%,#4A1020 44%,#5C1828 56%,#2C0810 76%,#1A0407 100%);
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
  display:block;width:40px;height:56px;margin:0 auto 16px;
}
.htitle{
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(2rem,6vw,3.2rem);
  color:#EDD882;
  position:relative;line-height:1.2;
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
.sec-t{font-family:'UnifrakturMaguntia',cursive;font-size:2.4rem;color:#3A0A12;display:none;margin-bottom:6px;}
body:not([data-conf]) .sec-t-c,body[data-conf="catholic"] .sec-t-c{display:block;}
body[data-conf="protestant"] .sec-t-p{display:block;}
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
  box-shadow:inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;overflow:clip;
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

/* -- Konfessions-Switcher -- */
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
body[data-conf="protestant"] .sec-dk { display:none; }
body[data-conf="protestant"] .toc-item[data-testament="DK"] { display:none; }

.conf-note{
  text-align:center;font-family:'Cinzel',serif;font-size:.58rem;
  color:rgba(120,80,20,.8);letter-spacing:.1em;padding:6px 24px 0;
}
/* KREUZ-GRAVUR */
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}
</style>
</head>
<body>
<nav class="topbar">
  <a href="../index.html">&#8592; Zur Übersicht</a>
  <a href="../back-cover.html" style="margin-left:auto">Rückseite &#8594;</a>
</nav>

<header>
  <div class="h-orn">✦ &nbsp; ✦ &nbsp; ✦</div>
  <svg class="h-cross-big" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10" fill="none" stroke="#C8A030" stroke-width="1.8" stroke-linecap="square"/></svg>
  <div class="htitle">${BIBLE_NAMES[trans.lang] || trans.native}</div>
  <div class="h-rule-full"></div>
  <div class="hlang">${trans.native.toUpperCase()}</div>
  <div class="h-orn-bot">—— ✦ … ✦ ——</div>
</header>

<main class="index-body">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>

<!-- -- Konfessions-Switcher -- -->
<div class="conf-bar">
  <button class="conf-btn" data-conf="catholic">✝&#xFE0E; Katholisch</button>
  <button class="conf-btn" data-conf="protestant">☩ Protestantisch</button>
</div>
<div class="conf-note" id="conf-note"></div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">Vetus Testamentum</span>
  <span class="sec-t sec-t-p">Altes Testament</span>
  <div class="sec-rule"></div>
  <span class="sec-s">V E T E R I S &nbsp; T E S T A M E N T I &nbsp;-&nbsp; ${booksVT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksVT)}
</div>

<div class="sec-group">
<div class="sec-head">
  <span class="sec-t sec-t-c">Novum Testamentum</span>
  <span class="sec-t sec-t-p">Neues Testament</span>
  <div class="sec-rule"></div>
  <span class="sec-s">N O V I &nbsp; T E S T A M E N T I &nbsp;-&nbsp; ${booksNT.length} &nbsp; L I B R I</span>
</div>
${bookList(booksNT)}
</div>

${dkSec}

</main>

<footer style="text-align:center;padding:32px 24px 40px;font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.2em;color:rgba(200,160,48,.3);">
  KX Books &nbsp;&middot;&nbsp; Ein Zweig von KX KroniX Tech &nbsp;&middot;&nbsp; Alle Rechte vorbehalten
</footer>

<script>
(function(){
  var NOTES = {
    catholic:    '73 Bücher — Vulgata Clementina + Deuterokanonisch',
    protestant:  '66 Bücher — Altes & Neues Testament'
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

// -------------------------------------------------------
//  BUCHSEITE (Interlinear)
// -------------------------------------------------------

function buildBookPage(book, trans, vulgChaps, transChaps, lutherChaps) {
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

  const bookIdx = BOOKS.findIndex(b => b.nr === book.nr);
  const prev    = BOOKS[bookIdx - 1];
  const next    = BOOKS[bookIdx + 1];

  const testLabel = book.testament === 'NT' ? 'NOVUM TESTAMENTUM'
    : book.testament === 'DK' ? 'LIBRI DEUTEROCANONOCI'
    : 'VETUS TESTAMENTUM';

  const chCount = vulgChaps.length;
  const vCount  = vulgChaps.reduce((s, c) => s + c.verses.length, 0);

  const chapBlocks = vulgChaps.map(ch => {
    const verseBlocks = ch.verses.map((v, vi) => {
      const lat    = esc(v.text);
      const lut    = esc((lm[ch.nr] || {})[v.nr] || '');
      const tra    = esc((tm[ch.nr] || {})[v.nr] || '');
      const isFirst = vi === 0 ? ' first' : '';
      return `<div class="vb${isFirst}" id="v${ch.nr}-${v.nr}">
  <span class="vn">${v.nr}</span>
  <div class="vt">
    <p class="base base-c">${lat}</p>
    ${lut ? `<p class="base base-p">${lut}</p>` : '<p class="base base-p"></p>'}
    ${tra ? `<p class="tra">${tra}</p>` : ''}
  </div>
</div>`;
    }).join('\n');

    return `<section class="chap" id="c${ch.nr}">
  <div class="chhead">
    <span class="chrom">${toRoman(ch.nr)}</span>
    <span class="chlbl chlbl-c">Caput ${toRoman(ch.nr)}</span>
    <span class="chlbl chlbl-p">Das ${ch.nr}. Capitel</span>
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

/* ------------------------------------------
   BUCHKOPF
------------------------------------------ */
.bhead{
  background:
    repeating-linear-gradient( 45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    repeating-linear-gradient(-45deg,transparent,transparent 36px,rgba(200,160,48,.028) 36px,rgba(200,160,48,.028) 37px),
    linear-gradient(162deg,#1A0407 0%,#2C0810 45%,#4A1020 65%,#2C0810 85%,#1A0407 100%);
  padding:36px 28px 28px;
  text-align:center;
  border-bottom:4px solid #B8962E;
  position:relative;overflow:hidden;
}
/* Innerer Rahmen - äußerer Ring */
.bhead::before{
  content:'';position:absolute;inset:14px;
  border:1px solid rgba(200,160,48,.22);
  pointer-events:none;
}
/* Innerer Rahmen - innerer Ring */
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
  display:none;
  font-family:'UnifrakturMaguntia',cursive;
  font-size:clamp(1.9rem,7vw,3.4rem);
  color:#EDD882;
  text-shadow:0 3px 20px rgba(0,0,0,.55);
  letter-spacing:.04em;position:relative;
}
body:not([data-conf]) .blatin-c,
body[data-conf="catholic"] .blatin-c{display:block;}
body[data-conf="protestant"] .blatin-p{display:block;}
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

/* ------------------------------------------
   KAPITELINHALT
------------------------------------------ */
.content{
  max-width:960px;
  margin:36px auto 36px;
  padding:48px 72px 100px;
  background:#FAF5E8;
  background-image:
    radial-gradient(ellipse at top left,rgba(184,150,46,.06) 0%,transparent 55%),
    radial-gradient(ellipse at bottom right,rgba(184,150,46,.05) 0%,transparent 55%);
  box-shadow:inset 0 0 0 1px rgba(184,150,46,.18);
  border-left:4px solid #B8962E;
  border-right:4px solid #B8962E;
  border-top:2px solid rgba(184,150,46,.4);
  border-bottom:2px solid rgba(184,150,46,.4);
  position:relative;overflow:clip;
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
  display:none;margin-top:8px;
}
body:not([data-conf]) .chlbl-c
body[data-conf="catholic"] .chlbl-c{display:block;}
body[data-conf="protestant"] .chlbl-p{display:block;}

/* ------------------------------------------
   VERSE
------------------------------------------ */
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

/* BASIS-TEXT - wechselt je nach Konfession */
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

/* Drop-Cap: erster Vers eines Kapitels — nur Latein und Luther, nicht Griechisch */
.vb.first .base-c::first-letter,
.vb.first .base-p::first-letter{
  font-family:'Cinzel Decorative',serif;
  font-size:4em;
  float:left;
  line-height:.7;
  padding-right:.08em;
  margin-top:.07em;
  color:#B8962E;
  text-shadow:1px 2px 6px rgba(0,0,0,.12);
}

/* ------------------------------------------
   BUCH-NAVIGATION (unten)
------------------------------------------ */
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
/* KREUZ-GRAVUR */
.b-wm{position:sticky;top:calc(50vh - 37.5vmin);width:50vmin;height:75vmin;margin:0 auto -75vmin;display:block;pointer-events:none;z-index:0;user-select:none;}
.b-wm svg{width:100%;height:auto;display:block;}
.b-wm path{fill:none;stroke:rgba(184,150,46,.06);stroke-width:1.5;stroke-linecap:square;}
</style>
</head>
<body>
<header class="bhead">
  <div class="btestament">${testLabel}</div>
  <div class="blatin blatin-c">${book.latin.toUpperCase()}</div>
  <div class="blatin blatin-p">${((BOOK_NAMES[trans.lang]||BOOK_NAMES.de)[book.nr-1]||book.name).toUpperCase()}</div>
  <div class="btrans">${(BOOK_NAMES[trans.lang]||BOOK_NAMES.en)[book.nr-1]} &nbsp;&middot;&nbsp; <em>${trans.native}</em></div>
  <div class="bmeta">${chCount} Capita &nbsp;&middot;&nbsp; ${vCount} Versus</div>
</header>

<main class="content">
<div class="b-wm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M5,0V14M0,4H10"/></svg></div>
${chapBlocks}
</main>

<nav class="bnav">
  ${prevLink}
  <a href="../index.html" class="center">? &nbsp; Inhaltsverzeichnis</a>
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

// -------------------------------------------------------
//  HAUPTPROGRAMM
// -------------------------------------------------------

async function main() {
  console.log('\n+-------------------------------------------------------+');
  console.log('❖  BIBLIA CATHOLICA INTERLINEARIS ❖ BUILD v3           ❖');
  console.log('+-------------------------------------------------------+\n');

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

  // Vulgata laden (Bücher 1-73)
  const vulg = {};
  for (const book of BOOKS) {
    const raw = loadBook('vulgate', book.nr);
    if (raw) vulg[book.nr] = parseBook(raw);
  }
  console.log(`  ✓ Vulgata: ${Object.keys(vulg).length} Bücher`);

  // Pro Übersetzung
  for (const trans of TRANSLATIONS) {
    process.stdout.write(`\n  ??  ${trans.native} (${trans.code}) ...`);

    const tDir = path.join(OUT_DIR, trans.code);
    const bDir = path.join(tDir, 'bücher');
    mkDir(bDir);

    // Sprachcover + Rückseite
    fs.writeFileSync(path.join(tDir, 'cover.html'), buildLangCover(trans));
    fs.writeFileSync(path.join(tDir, 'back-cover.html'), buildBackCover(trans));

    const avail = [];
    for (const book of BOOKS) {
      // OX books need their own vulgate-equivalent from data-orthodox/
      const vulgData = vulg[book.nr];
      if (!vulgData) continue;
      const tRaw      = loadBook(trans.code, book.nr);
      const tChap     = tRaw ? parseBook(tRaw) : null;
      const lutherRaw = loadLutherBook(book.nr);
      const lutherChap = lutherRaw ? parseBook(lutherRaw) : null;
      fs.writeFileSync(path.join(bDir, bookFile(book)), buildBookPage(book, trans, vulgData, tChap, lutherChap));
      avail.push({...book, chapCount: vulgData.length});
    }
    fs.writeFileSync(path.join(tDir, 'index.html'), buildLangIndex(trans, avail));
    process.stdout.write(` ? (${avail.length} Bï¿½cher)\n`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildMainIndex());
  console.log('\n  ? index.html\n');
  console.log('?  Fertig! ï¿½ffne: Ãbersetzungen/german/cover.html\n');
}

main().catch(err => {
  console.error('\n?  Fehler:', err.message);
  process.exit(1);
});
