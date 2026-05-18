'use strict';
/**
 * fix-all-languages.js
 * Fixes encoding errors, German labels, and localization issues across
 * all Bible and Quran language files.
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');
const QURAN_DIST = path.join(ROOT, 'dist-alquran', 'Übersetzungen');
const BIBLE_SRC  = path.join(ROOT, 'CATHOLIC-BIBLE', 'Übersetzungen');

// ─── CORRECT BIBLE TITLES ─────────────────────────────────────────────────────
const BIBLE_NAMES = {
  en: 'The Holy Bible',
  de: 'Die Heilige Bibel',
  fr: 'La Sainte Bible',
  es: 'La Santa Biblia',
  pt: 'A Bíblia Sagrada',
  pl: 'Pismo Święte',
  ru: 'Священное Писание',
  hr: 'Sveto Pismo',
  nl: 'De Heilige Bijbel',
  hu: 'A Szentírás',
  cs: 'Písmo Svaté',
  sv: 'Den Heliga Bibeln',
  tl: 'Ang Banal na Bibliya',
  uk: 'Свята Біблія',
  sq: 'Bibla e Shenjtë',
  it: 'La Sacra Bibbia',
  ro: 'Sfânta Biblie',
};

// ─── CORRECT BOOK NAMES (73 books each) ──────────────────────────────────────
const BOOK_NAMES = {
  en: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','Tobit','Judith','1 Maccabees','2 Maccabees','Wisdom','Sirach','Baruch'],
  de: ['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1. Samuel','2. Samuel','1. Könige','2. Könige','1. Chronik','2. Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprichwörter','Kohelet','Hoheslied','Jesaja','Jeremia','Klagelieder','Ezechiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1. Korinther','2. Korinther','Galater','Epheser','Philipper','Kolosser','1. Thessalonicher','2. Thessalonicher','1. Timotheus','2. Timotheus','Titus','Philemon','Hebräer','Jakobus','1. Petrus','2. Petrus','1. Johannes','2. Johannes','3. Johannes','Judas','Offenbarung','Tobias','Judit','1. Makkabäer','2. Makkabäer','Weisheit','Sirach','Baruch'],
  fr: ['Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth','1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Néhémie','Esther','Job','Psaumes','Proverbes','Ecclésiaste','Cantique des Cantiques','Isaïe','Jérémie','Lamentations','Ézéchiel','Daniel','Osée','Joël','Amos','Abdias','Jonas','Michée','Nahum','Habacuc','Sophonie','Aggée','Zacharie','Malachie','Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens','1 Timothée','2 Timothée','Tite','Philémon','Hébreux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse','Tobie','Judith','1 Maccabées','2 Maccabées','Sagesse','Siracide','Baruch'],
  es: ['Génesis','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut','1 Samuel','2 Samuel','1 Reyes','2 Reyes','1 Crónicas','2 Crónicas','Esdras','Nehemías','Ester','Job','Salmos','Proverbios','Eclesiastés','Cantar de los Cantares','Isaías','Jeremías','Lamentaciones','Ezequiel','Daniel','Oseas','Joel','Amós','Abdías','Jonás','Miqueas','Nahúm','Habacuc','Sofonías','Ageo','Zacarías','Malaquías','Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis','Tobías','Judit','1 Macabeos','2 Macabeos','Sabiduría','Eclesiástico','Baruc'],
  pt: ['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cântico dos Cânticos','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oséias','Joel','Amós','Obadias','Jonas','Miquéias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filêmon','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse','Tobias','Judite','1 Macabeus','2 Macabeus','Sabedoria','Eclesiástico','Baruc'],
  pl: ['Rodzaju','Wyjścia','Kapłańska','Liczb','Powtórzonego Prawa','Jozuego','Sędziów','Rut','1 Samuela','2 Samuela','1 Królewska','2 Królewska','1 Kronik','2 Kronik','Ezdrasza','Nehemiasza','Estery','Hioba','Psalmy','Przysłów','Koheleta','Pieśń nad Pieśniami','Izajasza','Jeremiasza','Lamentacje','Ezechiela','Daniela','Ozeasza','Joela','Amosa','Abdiasza','Jonasza','Micheasza','Nahuma','Habakuka','Sofoniasza','Aggeusza','Zachariasza','Malachiasza','Mateusza','Marka','Łukasza','Jana','Dzieje Apostolskie','Rzymian','1 Koryntian','2 Koryntian','Galatów','Efezjan','Filipian','Kolosan','1 Tesaloniczan','2 Tesaloniczan','1 Tymoteusza','2 Tymoteusza','Tytusa','Filemona','Hebrajczyków','Jakuba','1 Piotra','2 Piotra','1 Jana','2 Jana','3 Jana','Judy','Objawienia','Tobiasza','Judyty','1 Machabejska','2 Machabejska','Mądrości','Syracha','Barucha'],
  ru: ['Бытие','Исход','Левит','Числа','Второзаконие','Иисус Навин','Судьи','Руфь','1 Царств','2 Царств','3 Царств','4 Царств','1 Паралипоменон','2 Паралипоменон','Ездра','Неемия','Есфирь','Иов','Псалтирь','Притчи','Екклесиаст','Песнь песней','Исаия','Иеремия','Плач Иеремии','Иезекииль','Даниил','Осия','Иоиль','Амос','Авдий','Иона','Михей','Наум','Аввакум','Софония','Аггей','Захария','Малахия','Матфей','Марк','Лука','Иоанн','Деяния','Римлянам','1 Коринфянам','2 Коринфянам','Галатам','Ефесянам','Филиппийцам','Колоссянам','1 Фессалоникийцам','2 Фессалоникийцам','1 Тимофею','2 Тимофею','Титу','Филимону','Евреям','Иаков','1 Петра','2 Петра','1 Иоанна','2 Иоанна','3 Иоанна','Иуда','Откровение','Товия','Иудифь','1 Маккавейская','2 Маккавейская','Премудрость','Сирах','Варух'],
  hr: ['Postanak','Izlazak','Levitski zakonik','Brojevi','Ponovljeni zakon','Jošua','Suci','Ruta','1 Samuelova','2 Samuelova','1 Kraljevska','2 Kraljevska','1 Ljetopisa','2 Ljetopisa','Ezra','Nehemija','Estera','Job','Psalmi','Mudre izreke','Propovjednik','Pjesma nad pjesmama','Izaija','Jeremija','Tužaljke','Ezekiel','Daniel','Hošea','Joel','Amos','Obadija','Jona','Mihej','Nahum','Habakuk','Sefanija','Hagaj','Zaharija','Malahija','Matej','Marko','Luka','Ivan','Djela apostolska','Rimljanima','1 Korinćanima','2 Korinćanima','Galaćanima','Efežanima','Filipljanima','Kološanima','1 Solunjanima','2 Solunjanima','1 Timoteju','2 Timoteju','Titu','Filemonu','Hebrejima','Jakovljeva','1 Petrova','2 Petrova','1 Ivanova','2 Ivanova','3 Ivanova','Judina','Otkrivenje','Tobija','Judita','1 Makabejska','2 Makabejska','Mudrost','Sirah','Baruh'],
  nl: ['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozua','Rechters','Ruth','1 Samuël','2 Samuël','1 Koningen','2 Koningen','1 Kronieken','2 Kronieken','Ezra','Nehemia','Ester','Job','Psalmen','Spreuken','Prediker','Hooglied','Jesaja','Jeremia','Klaagliederen','Ezechiël','Daniël','Hosea','Joël','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Sefanja','Haggai','Zacharia','Maleachi','Matteüs','Marcus','Lucas','Johannes','Handelingen','Romeinen','1 Korinthiërs','2 Korinthiërs','Galaten','Efeziërs','Filippenzen','Kolossenzen','1 Tessalonicenzen','2 Tessalonicenzen','1 Timotheüs','2 Timotheüs','Titus','Filemon','Hebreeën','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Openbaring','Tobit','Judit','1 Makkabeeën','2 Makkabeeën','Wijsheid','Sirach','Baruch'],
  hu: ['Teremtés','Kivonulás','Leviták könyve','Számok','Második törvénykönyv','Józsue','Bírák','Rút','1 Sámuel','2 Sámuel','1 Királyok','2 Királyok','1 Krónikák','2 Krónikák','Ezdrás','Nehemiás','Eszter','Jób','Zsoltárok','Példabeszédek','Prédikátor','Énekek éneke','Izajás','Jeremiás','Siralmak','Ezekiel','Dániel','Ozeás','Joel','Ámosz','Abdiás','Jónás','Mikeás','Náhum','Habakuk','Szofoniás','Aggeus','Zakariás','Malakiás','Máté','Márk','Lukács','János','Apostolok cselekedetei','Rómaiakhoz','1 Korintusiakhoz','2 Korintusiakhoz','Galatákhoz','Efezusiakhoz','Filippiekhez','Kolosszeiekhez','1 Tesszalonikaiakhoz','2 Tesszalonikaiakhoz','1 Timóteushoz','2 Timóteushoz','Tituszhoz','Filemonhoz','Zsidókhoz','Jakab','1 Péter','2 Péter','1 János','2 János','3 János','Júdás','Jelenések','Tóbit','Judit','1 Makkabeusok','2 Makkabeusok','Bölcsesség','Sirák','Báruk'],
  cs: ['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Jozue','Soudců','Rút','1 Samuelova','2 Samuelova','1 Královská','2 Královská','1 Paralipomenon','2 Paralipomenon','Ezdráš','Nehemiáš','Ester','Jób','Žalmy','Přísloví','Kazatel','Píseň písní','Izajáš','Jeremiáš','Pláč','Ezechiel','Daniel','Ozeáš','Joel','Ámos','Abdiáš','Jonáš','Micheáš','Nahum','Habakuk','Sofoniáš','Aggeus','Zachariáš','Malachiáš','Matouš','Marek','Lukáš','Jan','Skutky','Římanům','1 Korintským','2 Korintským','Galatským','Efezským','Filipským','Koloským','1 Tesalonickým','2 Tesalonickým','1 Timoteovi','2 Timoteovi','Titovi','Filemonovi','Židům','Jakubův','1 Petrův','2 Petrův','1 Janův','2 Janův','3 Janův','Judův','Zjevení','Tobiáš','Judit','1 Makabejská','2 Makabejská','Moudrost','Sirachovec','Baruch'],
  sv: ['Första Mosebok','Andra Mosebok','Tredje Mosebok','Fjärde Mosebok','Femte Mosebok','Josua','Domarboken','Rut','Första Samuelsboken','Andra Samuelsboken','Första Kungaboken','Andra Kungaboken','Första Krönikeboken','Andra Krönikeboken','Esra','Nehemja','Ester','Job','Psaltaren','Ordspråksboken','Predikaren','Höga visan','Jesaja','Jeremia','Klagovisorna','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Mika','Nahum','Habakuk','Sefanja','Haggai','Sakarja','Malaki','Matteus','Markus','Lukas','Johannes','Apostlagärningarna','Romarbrevet','1 Korintierbrevet','2 Korintierbrevet','Galaterbrevet','Efesierbrevet','Filipperbrevet','Kolosserbrevet','1 Thessalonikerbrevet','2 Thessalonikerbrevet','1 Timoteusbrevet','2 Timoteusbrevet','Titusbrevet','Filemonbrevet','Hebreerbrevet','Jakobsbrevet','1 Petrusbrevet','2 Petrusbrevet','1 Johannesbrevet','2 Johannesbrevet','3 Johannesbrevet','Judasbrevet','Uppenbarelseboken','Tobit','Judit','Första Mackabéerboken','Andra Mackabéerboken','Visdomen','Syrak','Baruk'],
  tl: ['Genesis','Exodo','Levitico','Mga Bilang','Deuteronomio','Josue','Mga Hukom','Rut','1 Samuel','2 Samuel','1 Hari','2 Hari','1 Cronica','2 Cronica','Esdras','Nehemias','Ester','Job','Mga Awit','Kawikaan','Mangangaral','Awit ng mga Awit','Isaias','Jeremias','Panaghoy','Ezekiel','Daniel','Oseas','Joel','Amos','Abdias','Jonas','Mikas','Nahum','Habakuk','Sofonias','Ageo','Zacarias','Malakias','Mateo','Marcos','Lucas','Juan','Mga Gawa','Roma','1 Corinto','2 Corinto','Galacia','Efeso','Filipos','Colosas','1 Tesalonica','2 Tesalonica','1 Timoteo','2 Timoteo','Tito','Filemon','Hebreo','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Pahayag','Tobit','Judit','1 Macabeo','2 Macabeo','Karunungan','Sirac','Baruc'],
  uk: ['Буття','Вихід','Левит','Числа','Повторення закону','Книга Ісуса Навина','Судді','Рут','1 Самуїла','2 Самуїла','1 Царів','2 Царів','1 Хроніки','2 Хроніки','Ездра','Неемія','Естер','Йов','Псалми','Приповісті','Екклезіаст','Пісня пісень','Ісаія','Єремія','Плач Єремії','Єзекіїль','Даниїл','Осія','Йоїл','Амос','Авдій','Йона','Михей','Наум','Авакум','Софонія','Огій','Захарія','Малахія','Матвій','Марко','Лука','Іван','Дії','Римляни','1 Коринтянам','2 Коринтянам','Галатам','Ефесянам','Филипянам','Колосянам','1 Солунянам','2 Солунянам','1 Тимотею','2 Тимотею','Титу','Филимону','Євреям','Яків','1 Петра','2 Петра','1 Іван','2 Іван','3 Іван','Юда','Одкровення','Товія','Юдита','1 Маккавейська','2 Маккавейська','Мудрість','Сирах','Варух'],
  sq: ['Zanafilla','Eksodi','Levitiku','Numrat','Ligji i Përtërirë','Jozueu','Gjyqtarët','Ruthi','1 Samueli','2 Samueli','1 Mbretërve','2 Mbretërve','1 Kronikave','2 Kronikave','Esdra','Nehemia','Estera','Jobi','Psalmet','Fjalët e urta','Predikuesi','Kënga e Këngëve','Isaia','Jeremia','Vajtimet','Ezekieli','Danieli','Osea','Joeli','Amosi','Abdia','Jona','Mikea','Nahumi','Habakuku','Sefania','Ageui','Zakaria','Malakia','Mateu','Marku','Luka','Gjoni','Veprat','Romakëve','1 Korintasve','2 Korintasve','Galatasve','Efesianëve','Filipianëve','Kolosianëve','1 Selanikasve','2 Selanikasve','1 Timoteut','2 Timoteut','Titit','Filemonit','Hebrenjve','Jakobi','1 Pjetri','2 Pjetri','1 Gjoni','2 Gjoni','3 Gjoni','Juda','Zbulesa','Tobiti','Judita','1 Makabenjve','2 Makabenjve','Urtësia','Sirak','Baruku'],
  it: ['Genesi','Esodo','Levitico','Numeri','Deuteronomio','Giosuè','Giudici','Rut','1 Samuele','2 Samuele','1 Re','2 Re','1 Cronache','2 Cronache','Esdra','Neemia','Ester','Giobbe','Salmi','Proverbi','Qoelet','Cantico dei Cantici','Isaia','Geremia','Lamentazioni','Ezechiele','Daniele','Osea','Gioele','Amos','Abdia','Giona','Michea','Naum','Abacuc','Sofonia','Aggeo','Zaccaria','Malachia','Matteo','Marco','Luca','Giovanni','Atti','Romani','1 Corinzi','2 Corinzi','Galati','Efesini','Filippesi','Colossesi','1 Tessalonicesi','2 Tessalonicesi','1 Timoteo','2 Timoteo','Tito','Filemone','Ebrei','Giacomo','1 Pietro','2 Pietro','1 Giovanni','2 Giovanni','3 Giovanni','Giuda','Apocalisse','Tobia','Giuditta','1 Maccabei','2 Maccabei','Sapienza','Siracide','Baruc'],
  ro: ['Geneza','Exodul','Leviticul','Numerele','Deuteronomul','Iosua','Judecători','Rut','1 Samuel','2 Samuel','1 Regi','2 Regi','1 Cronici','2 Cronici','Ezra','Neemia','Estera','Iov','Psalmi','Proverbe','Eclesiastul','Cântarea Cântărilor','Isaia','Ieremia','Plângerile lui Ieremia','Ezechiel','Daniel','Osea','Ioel','Amos','Obadia','Iona','Mica','Naum','Habacuc','Țefania','Hagai','Zaharia','Maleahi','Matei','Marcu','Luca','Ioan','Faptele Apostolilor','Romani','1 Corinteni','2 Corinteni','Galateni','Efeseni','Filipeni','Coloseni','1 Tesaloniceni','2 Tesaloniceni','1 Timotei','2 Timotei','Tit','Filimon','Evrei','Iacob','1 Petru','2 Petru','1 Ioan','2 Ioan','3 Ioan','Iuda','Apocalipsa','Tobit','Iudita','1 Macabei','2 Macabei','Înțelepciunea lui Solomon','Sirah','Baruh'],
};

// ─── NAV LABELS (Back / Back Cover) ──────────────────────────────────────────
const BACK_LABEL = {
  en:'Back', de:'Zur Übersicht', fr:'Vue d\'ensemble', es:'Inicio',
  pt:'Início', pl:'Przegląd', ru:'Обзор', hr:'Pregled',
  nl:'Overzicht', hu:'Áttekintés', cs:'Přehled', sv:'Översikt',
  tl:'Bumalik', uk:'Огляд', sq:'Kthehu', it:'Panoramica', ro:'Înapoi',
};
const BACKCOVER_LABEL = {
  en:'Back Cover', de:'Rückseite', fr:'4ème de couverture', es:'Contraportada',
  pt:'Contracapa', pl:'Okładka', ru:'Задняя обложка', hr:'Stražnja strana',
  nl:'Achterflap', hu:'Hátsó borító', cs:'Zadní obálka', sv:'Baksida',
  tl:'Takip', uk:'Задня обкладинка', sq:'Kapaku i pasëm', it:'Retro', ro:'Coperta',
};

// ─── CONFESSION BUTTON LABELS ────────────────────────────────────────────────
const CATHOLIC_BTN = {
  en:'Catholic', de:'Katholisch', fr:'Catholique', es:'Católico',
  pt:'Católico', pl:'Katolicki', ru:'Католический', hr:'Katolički',
  nl:'Katholiek', hu:'Katolikus', cs:'Katolický', sv:'Katolsk',
  tl:'Katoliko', uk:'Католицький', sq:'Katolike', it:'Cattolico', ro:'Catolic',
};
const PROTESTANT_BTN = {
  en:'Protestant', de:'Protestantisch', fr:'Protestant', es:'Protestante',
  pt:'Protestante', pl:'Protestancki', ru:'Протестантский', hr:'Protestantski',
  nl:'Protestant', hu:'Protestáns', cs:'Protestantský', sv:'Protestantisk',
  tl:'Protestante', uk:'Протестантський', sq:'Protestante', it:'Protestante', ro:'Protestant',
};

// ─── TESTAMENT LABELS (protestant view) ──────────────────────────────────────
const OT_LABEL = {
  en:'Old Testament', de:'Altes Testament', fr:'Ancien Testament', es:'Antiguo Testamento',
  pt:'Antigo Testamento', pl:'Stary Testament', ru:'Ветхий Завет', hr:'Stari Zavjet',
  nl:'Oude Testament', hu:'Ószövetség', cs:'Starý zákon', sv:'Gamla Testamentet',
  tl:'Lumang Tipan', uk:'Старий Завіт', sq:'Dhiata e Vjetër', it:'Antico Testamento', ro:'Vechiul Testament',
};
const NT_LABEL = {
  en:'New Testament', de:'Neues Testament', fr:'Nouveau Testament', es:'Nuevo Testamento',
  pt:'Novo Testamento', pl:'Nowy Testament', ru:'Новый Завет', hr:'Novi Zavjet',
  nl:'Nieuwe Testament', hu:'Újszövetség', cs:'Nový zákon', sv:'Nya Testamentet',
  tl:'Bagong Tipan', uk:'Новий Завіт', sq:'Dhiata e Re', it:'Nuovo Testamento', ro:'Noul Testament',
};
const DK_LABEL = {
  en:'Deuterocanonical Books', de:'Deuterokanonische Bücher', fr:'Livres deutérocanoniques', es:'Libros deuterocanónicos',
  pt:'Livros deuterocanônicos', pl:'Księgi deuterokanoniczne', ru:'Второканонические книги', hr:'Deuterokanonske knjige',
  nl:'Deuterocanonieke Boeken', hu:'Deuterokanonikus könyvek', cs:'Deuterokanonické knihy', sv:'Deuterokanoniska böcker',
  tl:'Deuterocanonical na Aklat', uk:'Девтероканонічні книги', sq:'Librat deuterokanonikë', it:'Libri deuterocanonici', ro:'Cărți deuterocanonice',
};

// ─── QURAN INDEX TITLE (Table of Contents) ───────────────────────────────────
const QURAN_TOC_TITLE = {
  sq:'Tabela e Permbajtjes', bn:'সূচিপত্র', bs:'Sadržaj', zh:'目录',
  de:'Inhaltsverzeichnis', en:'Table of Contents', ha:'Bayanan Abubuwa',
  hi:'सामग्री की सूची', id:'Daftar Isi', fa:'فهرست مطالب',
  ru:'Оглавление', tr:'İçindekiler', ur:'فہرست', ug:'مۇندەرىجە',
};

// ─── QURAN DICT TITLE ─────────────────────────────────────────────────────────
const QURAN_DICT_DE_TITLE = {
  sq:'Fjalor', bn:'অভিধান', bs:'Rječnik', zh:'词典',
  de:'Wörterbuch', en:'Dictionary', ha:'Ƙamus', hi:'शब्दकोश',
  id:'Kamus', fa:'واژه‌نامه', ru:'Словарь', tr:'Sözlük',
  ur:'لغت', ug:'لۇغەت',
};
const QURAN_LANG_NATIVE = {
  Albanisch:'Shqip', Bengalisch:'বাংলা', Bosnisch:'Bosanski', Chinesisch:'中文',
  Deutsch:'Deutsch', Englisch:'English', Hausa:'Hausa', Hindi:'हिन्दी',
  Indonesisch:'Bahasa Indonesia', Persisch:'فارسی', Russisch:'Русский',
  Türkisch:'Türkçe', Urdu:'اردو', Uygurisch:'ئۇيغۇرچە',
};
const QURAN_LANG_CODE = {
  Albanisch:'sq', Bengalisch:'bn', Bosnisch:'bs', Chinesisch:'zh',
  Deutsch:'de', Englisch:'en', Hausa:'ha', Hindi:'hi',
  Indonesisch:'id', Persisch:'fa', Russisch:'ru', Türkisch:'tr',
  Urdu:'ur', Uygurisch:'ug',
};

// ─── BIBLE LANG DIR → LANG CODE ──────────────────────────────────────────────
const BIBLE_LANG = {
  albanian:'sq', croatian:'hr', czech:'cs', dutch:'nl', french:'fr',
  german:'de', hungarian:'hu', italian:'it', kjv:'en', polish:'pl',
  portuguese:'pt', romanian:'ro', russian:'ru', spanish:'es',
  swedish:'sv', tagalog:'tl', ukrainian:'uk',
};

// ─── helper ───────────────────────────────────────────────────────────────────
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function fixBibleIndex(dir, lang) {
  const books = BOOK_NAMES[lang] || BOOK_NAMES.en;
  const title  = BIBLE_NAMES[lang] || BIBLE_NAMES.en;

  // Fix in both dist and source
  const paths = [
    path.join(BIBLE_DIST, dir, 'index.html'),
    path.join(BIBLE_SRC,  dir, 'index.html'),
  ];
  for (const fpath of paths) {
    if (!fs.existsSync(fpath)) continue;
    let html = fs.readFileSync(fpath, 'utf8');
    const originalLen = html.length;

    // 1. Fix htitle (Bible name)
    html = html.replace(/<div class="htitle">[^<]*<\/div>/, `<div class="htitle">${esc(title)}</div>`);

    // 2. Fix all .tname spans in document order (match book index)
    let bookIdx = 0;
    html = html.replace(/<span class="tname">[^<]*<\/span>/g, () => {
      const name = books[bookIdx] !== undefined ? books[bookIdx] : '';
      bookIdx++;
      return `<span class="tname">${esc(name)}</span>`;
    });

    // 3. Fix nav: "← Zur Übersicht"
    html = html.replace(/&#8592; Zur Übersicht/, `&#8592; ${esc(BACK_LABEL[lang] || 'Back')}`);

    // 4. Fix nav: "Rückseite →"
    html = html.replace(/Rückseite &#8594;/, `${esc(BACKCOVER_LABEL[lang] || 'Back Cover')} &#8594;`);

    // 5. Fix confession buttons (German)
    html = html.replace(/(✝&#xFE0E;?\s*)Katholisch/, `$1${esc(CATHOLIC_BTN[lang] || 'Catholic')}`);
    html = html.replace(/(☩\s*)Protestantisch/, `$1${esc(PROTESTANT_BTN[lang] || 'Protestant')}`);

    // 6. Fix protestant section labels
    html = html.replace(/<span class="sec-t sec-t-p">Altes Testament<\/span>/,
      `<span class="sec-t sec-t-p">${esc(OT_LABEL[lang] || 'Old Testament')}</span>`);
    html = html.replace(/<span class="sec-t sec-t-p">Neues Testament<\/span>/,
      `<span class="sec-t sec-t-p">${esc(NT_LABEL[lang] || 'New Testament')}</span>`);
    html = html.replace(/<span class="sec-t sec-t-p">Deuterokanonische Bücher<\/span>/,
      `<span class="sec-t sec-t-p">${esc(DK_LABEL[lang] || 'Deuterocanonical Books')}</span>`);

    // 7. Fix remaining ï¿½ replacement-character artifacts
    html = html.replace(/ï¿½/g, lang === 'sq' ? 'ë' : '?');

    if (html.length !== originalLen || html !== fs.readFileSync(fpath,'utf8')) {
      fs.writeFileSync(fpath, html, 'utf8');
    }
  }
}

// ─── 1. FIX BIBLE LANGUAGE INDICES ───────────────────────────────────────────
console.log('\n[1] Fixing Bible language indices...');
for (const [dir, lang] of Object.entries(BIBLE_LANG)) {
  const distPath = path.join(BIBLE_DIST, dir, 'index.html');
  if (!fs.existsSync(distPath)) { console.log(`  ⚠ Missing: ${dir}`); continue; }
  fixBibleIndex(dir, lang);
  console.log(`  ✓ ${dir} (${lang})`);
}

// ─── 2. FIX BIBLE MAIN COVER (grid cover showing all languages) ───────────────
console.log('\n[2] Fixing Bible main cover...');
const bibleCoverPath = path.join(BIBLE_DIST, 'cover.html');
if (fs.existsSync(bibleCoverPath)) {
  let html = fs.readFileSync(bibleCoverPath, 'utf8');
  html = html.replace(/<span class="ttl">Die Heilige Bibel<\/span>/,
    '<span class="ttl">The Holy Bible</span>');
  html = html.replace(/<title>Die Heilige Bibel[^<]*<\/title>/,
    '<title>The Holy Bible · All Languages</title>');
  html = html.replace(/<span class="ttl-sub">Alle Sprachen<\/span>/,
    '<span class="ttl-sub">All Languages</span>');
  fs.writeFileSync(bibleCoverPath, html, 'utf8');
  console.log('  ✓ dist-diebibel/cover.html');
}
// Also fix the build-multilang generated cover
const multiBibleCoverPath = path.join(ROOT, 'scripts', 'build-multilang.js');
// (leave build scripts as-is, just fix dist output)

// Fix the CATHOLIC-BIBLE/Übersetzungen/cover.html if it exists
const srcCoverPath = path.join(BIBLE_SRC, 'cover.html');
if (fs.existsSync(srcCoverPath)) {
  let html = fs.readFileSync(srcCoverPath, 'utf8');
  html = html.replace(/Die Heilige Bibel/g, 'The Holy Bible');
  fs.writeFileSync(srcCoverPath, html, 'utf8');
  console.log('  ✓ CATHOLIC-BIBLE/Übersetzungen/cover.html');
}

// Fix index.html redirect
const bibleMainIdx = path.join(BIBLE_DIST, 'index.html');
if (fs.existsSync(bibleMainIdx)) {
  let html = fs.readFileSync(bibleMainIdx, 'utf8');
  html = html.replace(/<title>Die Heilige Bibel<\/title>/, '<title>The Holy Bible</title>');
  fs.writeFileSync(bibleMainIdx, html, 'utf8');
  console.log('  ✓ dist-diebibel/index.html');
}

// ─── 3. FIX QURAN LANGUAGE INDICES ───────────────────────────────────────────
console.log('\n[3] Fixing Quran language indices...');
if (fs.existsSync(QURAN_DIST)) {
  for (const langDir of fs.readdirSync(QURAN_DIST)) {
    const code = QURAN_LANG_CODE[langDir];
    if (!code) continue;
    const tocTitle = QURAN_TOC_TITLE[code] || 'Table of Contents';
    const native = QURAN_LANG_NATIVE[langDir] || langDir;

    // Fix index.html title
    const idxPath = path.join(QURAN_DIST, langDir, 'index.html');
    if (fs.existsSync(idxPath)) {
      let html = fs.readFileSync(idxPath, 'utf8');
      // Fix page title
      html = html.replace(/<title>Inhaltsverzeichnis · القرآن الكريم<\/title>/,
        `<title>${tocTitle} · القرآن الكريم</title>`);
      // Fix bot-nav "Tabela e Permbajtjes" type strings that might still be German
      fs.writeFileSync(idxPath, html, 'utf8');
      console.log(`  ✓ ${langDir}/index.html`);
    }

    // Fix woerterbuch.html title
    const dictPath = path.join(QURAN_DIST, langDir, 'woerterbuch.html');
    if (fs.existsSync(dictPath)) {
      let html = fs.readFileSync(dictPath, 'utf8');
      const dictTitle = QURAN_DICT_DE_TITLE[code] || 'Dictionary';
      // Fix <title>Wörterbuch · [German name] · القرآن الكريم</title>
      html = html.replace(
        /<title>Wörterbuch · [^·]+ · القرآن الكريم<\/title>/,
        `<title>${dictTitle} · ${native} · القرآن الكريم</title>`
      );
      // Fix subtitle in sh-subtitle
      html = html.replace(
        /<span class="sh-subtitle">WÖRTERBUCH[^<]*<\/span>/i,
        `<span class="sh-subtitle">${dictTitle.toUpperCase()} · ${native.toUpperCase()}</span>`
      );
      fs.writeFileSync(dictPath, html, 'utf8');
      console.log(`  ✓ ${langDir}/woerterbuch.html`);
    }

    // Fix intro.html title ("Vorwort" → language-specific)
    const introPath = path.join(QURAN_DIST, langDir, 'intro.html');
    if (fs.existsSync(introPath)) {
      let html = fs.readFileSync(introPath, 'utf8');
      html = html.replace(/<title>Vorwort · القرآن الكريم<\/title>/,
        `<title>القرآن الكريم · ${native}</title>`);
      fs.writeFileSync(introPath, html, 'utf8');
      console.log(`  ✓ ${langDir}/intro.html`);
    }
  }
}

// Also fix AL-QURAN source intro/index files
const QURAN_SRC = path.join(ROOT, 'AL-QURAN', 'Übersetzungen');
if (fs.existsSync(QURAN_SRC)) {
  console.log('\n[3b] Fixing Quran source language files...');
  for (const langDir of fs.readdirSync(QURAN_SRC)) {
    const code = QURAN_LANG_CODE[langDir];
    if (!code) continue;
    const tocTitle = QURAN_TOC_TITLE[code] || 'Table of Contents';
    const native = QURAN_LANG_NATIVE[langDir] || langDir;

    const idxPath = path.join(QURAN_SRC, langDir, 'index.html');
    if (fs.existsSync(idxPath)) {
      let html = fs.readFileSync(idxPath, 'utf8');
      html = html.replace(/<title>Inhaltsverzeichnis · القرآن الكريم<\/title>/,
        `<title>${tocTitle} · القرآن الكريم</title>`);
      fs.writeFileSync(idxPath, html, 'utf8');
    }

    const dictPath = path.join(QURAN_SRC, langDir, 'woerterbuch.html');
    if (fs.existsSync(dictPath)) {
      let html = fs.readFileSync(dictPath, 'utf8');
      const dictTitle = QURAN_DICT_DE_TITLE[code] || 'Dictionary';
      html = html.replace(/<title>Wörterbuch · [^·]+ · القرآن الكريم<\/title>/,
        `<title>${dictTitle} · ${native} · القرآن الكريم</title>`);
      html = html.replace(/<span class="sh-subtitle">WÖRTERBUCH[^<]*<\/span>/i,
        `<span class="sh-subtitle">${dictTitle.toUpperCase()} · ${native.toUpperCase()}</span>`);
      fs.writeFileSync(dictPath, html, 'utf8');
    }

    const introPath = path.join(QURAN_SRC, langDir, 'intro.html');
    if (fs.existsSync(introPath)) {
      let html = fs.readFileSync(introPath, 'utf8');
      html = html.replace(/<title>Vorwort · القرآن الكريم<\/title>/,
        `<title>القرآن الكريم · ${native}</title>`);
      fs.writeFileSync(introPath, html, 'utf8');
    }
    console.log(`  ✓ ${langDir}`);
  }
}

// ─── 4. FIX BUILD-MULTILANG.JS BIBLE COVER TITLE ────────────────────────────
console.log('\n[4] Fixing build-multilang.js Bible cover title...');
const buildMultiPath = path.join(ROOT, 'scripts', 'build-multilang.js');
if (fs.existsSync(buildMultiPath)) {
  let src = fs.readFileSync(buildMultiPath, 'utf8');
  src = src.replace(/<span class="ttl">Die Heilige Bibel<\/span>/g,
    '<span class="ttl">The Holy Bible</span>');
  src = src.replace(/<title>Die Heilige Bibel · Alle Sprachen<\/title>/g,
    '<title>The Holy Bible · All Languages</title>');
  src = src.replace(/<span class="ttl-sub">Alle Sprachen<\/span>/g,
    '<span class="ttl-sub">All Languages</span>');
  fs.writeFileSync(buildMultiPath, src, 'utf8');
  console.log('  ✓ scripts/build-multilang.js');
}

console.log('\n✅ All fixes applied successfully.\n');
