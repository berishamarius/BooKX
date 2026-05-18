'use strict';
/**
 * fix-remaining-de.js
 * Fixes:
 *  1. German NOTES subtitle in every Bible language's index.html JS block
 *  2. Missing cross favicon on all Bible pages
 *  3. Vater Unser (Lord's Prayer) localised in every back-cover.html
 *  4. cover.html per-language: title encoding + subtitle + frame design
 *  5. back-cover.html title encoding fix
 *  6. Bible grid-cover design: add top/bottom frame bars like Quran
 */
const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const BIBLE_DIST = path.join(ROOT, 'dist-diebibel');

// ─── LANGUAGE MAPPING ─────────────────────────────────────────────────────────
const BIBLE_LANG = {
  albanian:'sq', croatian:'hr', czech:'cs', dutch:'nl', french:'fr',
  german:'de', hungarian:'hu', italian:'it', kjv:'en', polish:'pl',
  portuguese:'pt', romanian:'ro', russian:'ru', spanish:'es',
  swedish:'sv', tagalog:'tl', ukrainian:'uk',
};

// ─── BIBLE TITLES ─────────────────────────────────────────────────────────────
const BIBLE_NAMES = {
  en:'The Holy Bible', de:'Die Heilige Bibel', fr:'La Sainte Bible',
  es:'La Santa Biblia', pt:'A Bíblia Sagrada', pl:'Pismo Święte',
  ru:'Священное Писание', hr:'Sveto Pismo', nl:'De Heilige Bijbel',
  hu:'A Szentírás', cs:'Písmo Svaté', sv:'Den Heliga Bibeln',
  tl:'Ang Banal na Bibliya', uk:'Свята Біблія', sq:'Bibla e Shenjtë',
  it:'La Sacra Bibbia', ro:'Sfânta Biblie',
};

// ─── NATIVE LANGUAGE NAMES ────────────────────────────────────────────────────
const NATIVE_NAME = {
  en:'English', de:'Deutsch', fr:'Français', es:'Español', pt:'Português',
  pl:'Polski', ru:'Русский', hr:'Hrvatski', nl:'Nederlands', hu:'Magyar',
  cs:'Čeština', sv:'Svenska', tl:'Filipino', uk:'Українська',
  sq:'Shqip', it:'Italiano', ro:'Română',
};

// ─── JS NOTES (Bible subtitle) ────────────────────────────────────────────────
const NOTE_CATHOLIC = {
  en:"73 Books \u2014 Vulgata Clementina \u00B7 Deuterocanonical",
  de:"73 B\u00FCcher \u2014 Vulgata Clementina + Deuterokanonisch",
  fr:"73 Livres \u2014 Vulgata Clementina \u00B7 Deut\u00E9rocanoniques",
  es:"73 Libros \u2014 Vulgata Clementina \u00B7 Deuterocan\u00F3nicos",
  pt:"73 Livros \u2014 Vulgata Clementina \u00B7 Deuterocan\u00F4nicos",
  pl:"73 Ksi\u0119gi \u2014 Vulgata Clementina \u00B7 Deuterokanoniczne",
  ru:"73 \u041A\u043D\u0438\u0433\u0438 \u2014 Vulgata Clementina \u00B7 \u0412\u0442\u043E\u0440\u043E\u043A\u0430\u043D\u043E\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0435",
  hr:"73 Knjige \u2014 Vulgata Clementina \u00B7 Deuterokanonske",
  nl:"73 Boeken \u2014 Vulgata Clementina \u00B7 Deuterocanoniek",
  hu:"73 K\u00F6nyv \u2014 Vulgata Clementina \u00B7 Deuterokanonikus",
  cs:"73 Knih \u2014 Vulgata Clementina \u00B7 Deuterokanonick\u00E9",
  sv:"73 B\u00F6cker \u2014 Vulgata Clementina \u00B7 Deuterokanoniska",
  tl:"73 Aklat \u2014 Vulgata Clementina \u00B7 Deuterocanonical",
  uk:"73 \u041A\u043D\u0438\u0433\u0438 \u2014 Vulgata Clementina \u00B7 \u0414\u0440\u0443\u0433\u043E\u043A\u0430\u043D\u043E\u043D\u0456\u0447\u043D\u0456",
  sq:"73 Libra \u2014 Vulgata Clementina \u00B7 Deuterokanonik\u00EB",
  it:"73 Libri \u2014 Vulgata Clementina \u00B7 Deuterocanonici",
  ro:"73 C\u0103r\u021Bi \u2014 Vulgata Clementina \u00B7 Deuterocanonice",
};
const NOTE_PROTESTANT = {
  en:"66 Books \u2014 Old & New Testament",
  de:"66 B\u00FCcher \u2014 Altes & Neues Testament",
  fr:"66 Livres \u2014 Ancien & Nouveau Testament",
  es:"66 Libros \u2014 Antiguo & Nuevo Testamento",
  pt:"66 Livros \u2014 Antigo & Novo Testamento",
  pl:"66 Ksi\u0105g \u2014 Stary & Nowy Testament",
  ru:"66 \u041A\u043D\u0438\u0433 \u2014 \u0412\u0435\u0442\u0445\u0438\u0439 & \u041D\u043E\u0432\u044B\u0439 \u0417\u0430\u0432\u0435\u0442",
  hr:"66 Knjiga \u2014 Stari & Novi Zavjet",
  nl:"66 Boeken \u2014 Oude & Nieuwe Testament",
  hu:"66 K\u00F6nyv \u2014 \u00D3sz\u00F6vets\u00E9g & \u00DAjsz\u00F6vets\u00E9g",
  cs:"66 Knih \u2014 Star\u00FD & Nov\u00FD z\u00E1kon",
  sv:"66 B\u00F6cker \u2014 Gamla & Nya Testamentet",
  tl:"66 Aklat \u2014 Lumang & Bagong Tipan",
  uk:"66 \u041A\u043D\u0438\u0433 \u2014 \u0421\u0442\u0430\u0440\u0438\u0439 & \u041D\u043E\u0432\u0438\u0439 \u0417\u0430\u0432\u0456\u0442",
  sq:"66 Libra \u2014 Dhiata e Vjet\u00EBr & Dhiata e Re",
  it:"66 Libri \u2014 Antico & Nuovo Testamento",
  ro:"66 C\u0103r\u021Bi \u2014 Vechiul & Noul Testament",
};

// ─── LORD'S PRAYER DATA ───────────────────────────────────────────────────────
const LORDS_PRAYER_LABEL = {
  en:"Our Father", de:"Vater unser", fr:"Notre P\u00E8re",
  es:"Padre Nuestro", pt:"Pai Nosso", pl:"Ojcze Nasz",
  ru:"\u041E\u0442\u0447\u0435 \u043D\u0430\u0448", hr:"O\u010De na\u0161",
  nl:"Onze Vader", hu:"Mi Aty\u00E1nk", cs:"Ot\u010De n\u00E1\u0161",
  sv:"Fader v\u00E5r", tl:"Ama Namin", uk:"\u041E\u0442\u0447\u0435 \u043D\u0430\u0448",
  sq:"Ati yn\u00EB", it:"Padre Nostro", ro:"Tat\u0103l Nostru",
};

const LORDS_PRAYER_TEXT = {
  en:`Our Father who art in heaven,\n     hallowed be thy name. Thy kingdom come.\n     Thy will be done, on earth as it is in heaven.\n     Give us this day our daily bread.\n     And forgive us our trespasses,\n     as we forgive those who trespass against us.\n     And lead us not into temptation,\n     but deliver us from evil.\n     Amen`,
  de:`Vater unser im Himmel,\n     geheiligt werde dein Name. Dein Reich komme.\n     Dein Wille geschehe, wie im Himmel so auf Erden.\n     Unser t\u00E4gliches Brot gib uns heute.\n     Und vergib uns unsere Schuld,\n     wie auch wir vergeben unseren Schuldigern.\n     Und f\u00FChre uns nicht in Versuchung,\n     sondern erl\u00F6se uns von dem B\u00F6sen.\n     Amen`,
  fr:`Notre P\u00E8re qui es aux cieux,\n     que ton nom soit sanctifi\u00E9. Que ton r\u00E8gne vienne.\n     Que ta volont\u00E9 soit faite sur la terre comme au ciel.\n     Donne-nous aujourd\u2019hui notre pain quotidien.\n     Et pardonne-nous nos offenses\n     comme nous pardonnons \u00E0 ceux qui nous ont offens\u00E9s.\n     Et ne nous laisse pas entrer en tentation,\n     mais d\u00E9livre-nous du malin.\n     Amen`,
  es:`Padre nuestro que est\u00E1s en los cielos,\n     santificado sea tu nombre. Venga tu reino.\n     H\u00E1gase tu voluntad, en la tierra como en el cielo.\n     Danos hoy nuestro pan de cada d\u00EDa.\n     Y perd\u00F3nanos nuestras deudas,\n     como tambi\u00E9n nosotros perdonamos a nuestros deudores.\n     Y no nos metas en tentaci\u00F3n,\n     mas l\u00EDbranos del mal.\n     Am\u00E9n`,
  pt:`Pai nosso que est\u00E1s nos c\u00E9us,\n     santificado seja o teu nome. Venha o teu reino.\n     Seja feita a tua vontade, assim na terra como no c\u00E9u.\n     O p\u00E3o nosso de cada dia nos d\u00E1 hoje.\n     E perdoa-nos as nossas d\u00EDvidas,\n     assim como n\u00F3s perdoamos os nossos devedores.\n     E n\u00E3o nos induza em tenta\u00E7\u00E3o,\n     mas livra-nos do mal.\n     Am\u00E9m`,
  pl:`Ojcze nasz, kt\u00F3ry jeste\u015B w niebie,\n     niech si\u0119 \u015Bwi\u0119ci imi\u0119 Twoje. Niech przyjdzie kr\u00F3lestwo Twoje.\n     Niech Twoja wola spe\u0142nia si\u0119 na ziemi, tak jak w niebie.\n     Chleba naszego powszedniego daj nam dzi\u015B.\n     I przebacz nam nasze winy,\n     jako i my przebaczamy tym, kt\u00F3rzy przeciw nam zawinili.\n     I nie w\u00F3d\u017A nas na pokuszenie,\n     ale nas zbaw ode z\u0142ego.\n     Amen`,
  ru:`\u041E\u0442\u0447\u0435 \u043D\u0430\u0448, \u0441\u0443\u0449\u0438\u0439 \u043D\u0430 \u043D\u0435\u0431\u0435\u0441\u0430\u0445!\n     \u0434\u0430 \u0441\u0432\u044F\u0442\u0438\u0442\u0441\u044F \u0438\u043C\u044F \u0422\u0432\u043E\u0451; \u0434\u0430 \u043F\u0440\u0438\u0438\u0434\u0435\u0442 \u0426\u0430\u0440\u0441\u0442\u0432\u0438\u0435 \u0422\u0432\u043E\u0451;\n     \u0434\u0430 \u0431\u0443\u0434\u0435\u0442 \u0432\u043E\u043B\u044F \u0422\u0432\u043E\u044F \u0438 \u043D\u0430 \u0437\u0435\u043C\u043B\u0435, \u043A\u0430\u043A \u043D\u0430 \u043D\u0435\u0431\u0435;\n     \u0445\u043B\u0435\u0431 \u043D\u0430\u0448 \u043D\u0430\u0441\u0443\u0449\u043D\u044B\u0439 \u0434\u0430\u0439 \u043D\u0430\u043C \u043D\u0430 \u0441\u0435\u0439 \u0434\u0435\u043D\u044C;\n     \u0438 \u043F\u0440\u043E\u0441\u0442\u0438 \u043D\u0430\u043C \u0434\u043E\u043B\u0433\u0438 \u043D\u0430\u0448\u0438,\n     \u043A\u0430\u043A \u0438 \u043C\u044B \u043F\u0440\u043E\u0449\u0430\u0435\u043C \u0434\u043E\u043B\u0436\u043D\u0438\u043A\u0430\u043C \u043D\u0430\u0448\u0438\u043C;\n     \u0438 \u043D\u0435 \u0432\u0432\u0435\u0434\u0438 \u043D\u0430\u0441 \u0432 \u0438\u0441\u043A\u0443\u0448\u0435\u043D\u0438\u0435,\n     \u043D\u043E \u0438\u0437\u0431\u0430\u0432\u044C \u043D\u0430\u0441 \u043E\u0442 \u043B\u0443\u043A\u0430\u0432\u043E\u0433\u043E.\n     \u0410\u043C\u0438\u043D\u044C`,
  hr:`O\u010De na\u0161 koji jesi na nebesima,\n     sveti se ime tvoje. Do\u0111i kraljevstvo tvoje.\n     Budi volja tvoja kako na nebu tako i na zemlji.\n     Kruh na\u0161 svagda\u0161nji daj nam danas.\n     I oprosti nam dugove na\u0161e\n     kao \u0161to i mi opra\u0161tamo du\u017Enicima na\u0161im.\n     I ne uvedi nas u napast,\n     nego izbavi nas od zla.\n     Amen`,
  nl:`Onze Vader die in de hemelen zijt,\n     uw naam worde geheiligd. Uw koninkrijk kome.\n     Uw wil geschiede, gelijk in de hemel zo ook op de aarde.\n     Geef ons heden ons dagelijks brood.\n     En vergeef ons onze schulden,\n     gelijk ook wij vergeven onze schuldenaren.\n     En leid ons niet in verzoeking,\n     maar verlos ons van de boze.\n     Amen`,
  hu:`Mi Aty\u00E1nk, aki a mennyekben vagy,\n     szenteltess\u00E9k meg a te neved. J\u00F6jj\u00F6n el a te orsz\u00E1god.\n     Legyen meg a te akaratod, am\u00EDnt a mennyben, \u00FAgy a f\u00F6ld\u00F6n is.\n     A mi mindennapi keny\u00E9r\u00FCnket add meg nek\u00FCnk ma.\n     \u00C9s bocs\u00E1sd meg a mi v\u00E9tke\u00FCnket,\n     mik\u00E9ppen mi is megbocs\u00E1tunk az ellen\u00FCnk v\u00E9tkez\u0151knek.\n     \u00C9s ne vigy min\u00FCnket k\u00EDs\u00E9rt\u00E9sbe,\n     de szabadíts meg a gonoszт\u00F3l.\n     \u00C1men`,
  cs:`Ot\u010De n\u00E1\u0161, jen\u017E jsi v nebes\u00EDch,\n     posv\u011B\u0165 se jm\u00E9no tv\u00E9. P\u0159ij\u010F kr\u00E1lovstv\u00ED tv\u00E9.\n     Bu\u010F v\u016Fle tv\u00E1 jako v nebi, tak i na zemi.\n     Chl\u00E9b n\u00E1\u0161 vezdej\u0161\u00ED dej n\u00E1m dnes.\n     A odpus\u0165 n\u00E1m na\u0161e viny,\n     jako\u017E i my odpou\u0161t\u00EDme na\u0161im vin\u00EDk\u016Fm.\n     A neuved\u2019 n\u00E1s v poku\u0161en\u00ED,\n     ale zbav n\u00E1s od zl\u00E9ho.\n     Amen`,
  sv:`Fader v\u00E5r som \u00E4r i himmelen,\n     helgat varde ditt namn. Tillkomme ditt rike.\n     Ske din vilja, s\u00E5som i himmelen, s\u00E5 ock p\u00E5 jorden.\n     V\u00E5rt dagliga br\u00F6d giv oss i dag.\n     Och f\u00F6rl\u00E5t oss v\u00E5ra skulder,\n     s\u00E5som ock vi f\u00F6rl\u00E5ta dem oss skyldiga \u00E4ro.\n     Och inled oss icke i frestelse,\n     utan fr\u00E4ls oss ifr\u00E5n ondo.\n     Amen`,
  tl:`Ama namin, na nasa langit ka,\n     sambahin ang iyong pangalan. Dumating ang iyong kaharian.\n     Sundin ang iyong kalooban, dito sa lupa tulad ng sa langit.\n     Ibigay mo sa amin ngayon ang aming kakanin sa araw-araw.\n     At patawarin mo kami sa aming mga kasalanan,\n     tulad nang pagpapatawad namin sa mga nagkakasala sa amin.\n     At huwag mo kaming iharap sa tukso,\n     kundi iligtas mo kami sa masama.\n     Amen`,
  uk:`\u041E\u0442\u0447\u0435 \u043D\u0430\u0448, \u0449\u043E \u043D\u0430 \u043D\u0435\u0431\u0435\u0441\u0430\u0445,\n     \u043D\u0435\u0445\u0430\u0439 \u0441\u0432\u044F\u0442\u0438\u0442\u044C\u0441\u044F \u0456\u043C\u2019\u044F \u0422\u0432\u043E\u0454. \u041D\u0435\u0445\u0430\u0439 \u043F\u0440\u0438\u0439\u0434\u0435 \u0446\u0430\u0440\u0441\u0442\u0432\u043E \u0422\u0432\u043E\u0454.\n     \u041D\u0435\u0445\u0430\u0439 \u0431\u0443\u0434\u0435 \u0432\u043E\u043B\u044F \u0422\u0432\u043E\u044F \u044F\u043A \u043D\u0430 \u043D\u0435\u0431\u0456, \u0442\u0430\u043A \u0456 \u043D\u0430 \u0437\u0435\u043C\u043B\u0456.\n     \u0425\u043B\u0456\u0431 \u043D\u0430\u0448 \u043D\u0430\u0441\u0443\u0449\u043D\u0438\u0439 \u0434\u0430\u0439 \u043D\u0430\u043C \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456.\n     \u0406 \u043F\u0440\u043E\u0441\u0442\u0438 \u043D\u0430\u043C \u043F\u0440\u043E\u0432\u0438\u043D\u0438 \u043D\u0430\u0448\u0456,\n     \u044F\u043A \u0456 \u043C\u0438 \u043F\u0440\u043E\u0449\u0430\u0454\u043C\u043E \u0442\u0438\u043C, \u0445\u0442\u043E \u043D\u0430\u0441 \u043F\u0440\u043E\u0432\u0438\u043D\u0438\u0432.\n     \u0406 \u043D\u0435 \u0432\u0432\u0435\u0434\u0438 \u043D\u0430\u0441 \u0443 \u0441\u043F\u043E\u043A\u0443\u0441\u0443,\n     \u0430\u043B\u0435 \u0432\u0438\u0437\u0432\u043E\u043B\u0438 \u043D\u0430\u0441 \u0432\u0456\u0434 \u043B\u0443\u043A\u0430\u0432\u043E\u0433\u043E.\n     \u0410\u043C\u0456\u043D\u044C`,
  sq:`Ati yn\u00EB q\u00EB je n\u00EB qiell,\n     u shenjt\u00EBrof\u0161\u00EB emri yt. Ardht\u00EB mb\u00E7ret\u00EBria jote.\n     U b\u00EBft\u00EB vullneti yt, si n\u00EB qiell ashtu edhe mbi tok\u00EB.\n     Buk\u00EBn ton\u00EB t\u00EB p\u00EBrditshme na e jep sot.\n     Fali borxhet tona\n     sikurse edhe ne ua falim borxhlinjve tan\u00EB.\n     Mos na \u00E7o n\u00EB ngasje,\n     por na shp\u00EBto nga i ligu.\n     Amen`,
  it:`Padre nostro che sei nei cieli,\n     sia santificato il tuo nome. Venga il tuo regno.\n     Sia fatta la tua volont\u00E0, come in cielo cos\u00EC in terra.\n     Dacci oggi il nostro pane quotidiano.\n     E rimetti a noi i nostri debiti\n     come noi li rimettiamo ai nostri debitori.\n     E non ci indurre in tentazione,\n     ma liberaci dal male.\n     Amen`,
  ro:`Tat\u0103l nostru care e\u0219ti \u00EEn ceruri,\n     sfin\u021Beasc\u0103-se numele T\u0103u. Vie \u00EEmp\u0103r\u0103\u021Bia Ta.\n     Fac\u0103-se voia Ta, precum \u00EEn cer, a\u0219a \u0219i pe p\u0103m\u00E2nt.\n     P\u00E2inea noastr\u0103 cea de toate zilele d\u0103-ne-o nou\u0103 ast\u0103zi.\n     \u0218i ne iart\u0103 nou\u0103 gre\u0219elile noastre\n     precum \u0219i noi iert\u0103m gre\u0219i\u021Bilor no\u0219tri.\n     \u0218i nu ne duce pe noi \u00EEn ispit\u0103,\n     ci ne izbave\u0219te de cel r\u0103u.\n     Amin`,
};

const LORDS_PRAYER_REF = {
  en:"Matthew 6:9-13 \u00B7 KJV",
  de:"Matth\u00E4us 6,9-13 \u00B7 Lutherbibel",
  fr:"Matthieu 6,9-13 \u00B7 La Bible",
  es:"Mateo 6,9-13 \u00B7 Biblia",
  pt:"Mateus 6,9-13 \u00B7 B\u00EDblia",
  pl:"Mateusz 6,9-13 \u00B7 Biblia",
  ru:"\u041C\u0430\u0442\u0444\u0435\u044F 6,9-13 \u00B7 \u0411\u0438\u0431\u043B\u0438\u044F",
  hr:"Matej 6,9-13 \u00B7 Biblija",
  nl:"Matте\u00FC\u0073 6,9-13 \u00B7 Bijbel",
  hu:"M\u00E1t\u00E9 6,9-13 \u00B7 Biblia",
  cs:"Matou\u0161 6,9-13 \u00B7 Bible",
  sv:"Matteus 6:9-13 \u00B7 Bibeln",
  tl:"Mateo 6:9-13 \u00B7 Bibliya",
  uk:"\u041C\u0430\u0442\u0432\u0456\u0439 6,9-13 \u00B7 \u0411\u0456\u0431\u043B\u0456\u044F",
  sq:"Mateu 6,9-13 \u00B7 Bibla",
  it:"Matteo 6,9-13 \u00B7 Bibbia",
  ro:"Matei 6,9-13 \u00B7 Biblie",
};

// SVG cross favicon for Bible
const CROSS_FAVICON = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M32,4V60M12,18H52' stroke='%23C8A030' stroke-width='8' fill='none' stroke-linecap='square'/></svg>">`;

// Frame bars CSS (like Quran cover top/bottom bar)
const FRAME_CSS = `
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:10px;background:#2a0810 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpolygon points='7,1 8,5 12,3 10,6.5 13.5,7 10,7.5 12,11 8,9 7,13 6,9 2,11 4,7.5 0.5,7 4,6.5 2,3 6,5' fill='rgba(200,160,48,0.35)'/%3E%3C/svg%3E") 0 0/14px 14px;pointer-events:none;z-index:10;}
.frame-top{top:0;border-bottom:1px solid rgba(200,160,48,.28);}
.frame-bot{bottom:0;border-top:1px solid rgba(200,160,48,.28);}`;

const FRAME_HTML = `<div class="frame-top"></div>\n<div class="frame-bot"></div>`;

// ─── helper to write only if changed ─────────────────────────────────────────
function writeIfChanged(fpath, html) {
  const old = fs.readFileSync(fpath, 'utf8');
  if (old !== html) fs.writeFileSync(fpath, html, 'utf8');
}

// ─── 1. FIX BIBLE LANGUAGE index.html ────────────────────────────────────────
console.log('\n[1] Fixing Bible language index.html — subtitle notes & favicon...');
for (const [dir, lang] of Object.entries(BIBLE_LANG)) {
  const fpath = path.join(BIBLE_DIST, dir, 'index.html');
  if (!fs.existsSync(fpath)) { console.log(`  ⚠ Missing: ${dir}`); continue; }
  let html = fs.readFileSync(fpath, 'utf8');

  // Add cross favicon if missing
  if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', `${CROSS_FAVICON}\n</head>`);
  }

  // Fix NOTES JS object
  const nc = NOTE_CATHOLIC[lang] || NOTE_CATHOLIC.en;
  const np = NOTE_PROTESTANT[lang] || NOTE_PROTESTANT.en;
  html = html.replace(
    /var NOTES\s*=\s*\{[^}]+\}/,
    `var NOTES = {\n    catholic:    '${nc}',\n    protestant:  '${np}'\n  }`
  );

  writeIfChanged(fpath, html);
  console.log(`  ✓ ${dir}/index.html`);
}

// ─── 2. FIX BACK-COVER.HTML (Lord's Prayer localisation) ─────────────────────
console.log('\n[2] Fixing back-cover.html — Lord\'s Prayer & title...');
for (const [dir, lang] of Object.entries(BIBLE_LANG)) {
  const fpath = path.join(BIBLE_DIST, dir, 'back-cover.html');
  if (!fs.existsSync(fpath)) { console.log(`  ⚠ Missing: ${dir}`); continue; }
  let html = fs.readFileSync(fpath, 'utf8');

  // Fix title encoding + "Rückseite"
  const bibleTitle = BIBLE_NAMES[lang] || '';
  const native = NATIVE_NAME[lang] || '';
  html = html.replace(/<title>[^<]*<\/title>/,
    `<title>${bibleTitle} \u00B7 ${native} \u00B7 R\u00FCckseite</title>`);

  // Add favicon if missing
  if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', `${CROSS_FAVICON}\n</head>`);
  }

  // Add top/bottom frame CSS if not present
  if (!html.includes('frame-top')) {
    html = html.replace('</style>\n</head>', `${FRAME_CSS}\n</style>\n</head>`);
    html = html.replace('<body>', `<body>\n${FRAME_HTML}`);
  }

  // Fix prayer label
  const label = LORDS_PRAYER_LABEL[lang] || 'Our Father';
  html = html.replace(
    /<div class="prayer-label">[\s\S]*?<\/div>/,
    `<div class="prayer-label">\u2726 &nbsp; ${label} &nbsp; \u2726</div>`
  );

  // Fix prayer text
  const prayer = LORDS_PRAYER_TEXT[lang] || LORDS_PRAYER_TEXT.en;
  html = html.replace(
    /<div class="prayer">[\s\S]*?<\/div>/,
    `<div class="prayer">\n     ${prayer}\n    </div>`
  );

  // Fix prayer reference
  const ref = LORDS_PRAYER_REF[lang] || 'Matthew 6:9-13';
  html = html.replace(
    /<div class="prayer-ref">[\s\S]*?<\/div>/,
    `<div class="prayer-ref">${ref}</div>`
  );

  writeIfChanged(fpath, html);
  console.log(`  ✓ ${dir}/back-cover.html`);
}

// ─── 3. FIX COVER.HTML per language (title + design) ─────────────────────────
console.log('\n[3] Fixing per-language cover.html — title + frame design...');
for (const [dir, lang] of Object.entries(BIBLE_LANG)) {
  const fpath = path.join(BIBLE_DIST, dir, 'cover.html');
  if (!fs.existsSync(fpath)) { console.log(`  ⚠ Missing: ${dir}`); continue; }
  let html = fs.readFileSync(fpath, 'utf8');

  const bibleTitle = BIBLE_NAMES[lang] || '';
  const native = NATIVE_NAME[lang] || '';

  // Fix title (remove encoding errors + "Die Heilige Bibel")
  html = html.replace(/<title>[^<]*<\/title>/,
    `<title>${bibleTitle} \u00B7 ${native}</title>`);

  // Fix alt text encoding errors
  html = html.replace(/alt="[^"]*ï¿½[^"]*"/, `alt="${bibleTitle}"`);
  html = html.replace(/ï¿½/g, '');

  // Add favicon if missing
  if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', `${CROSS_FAVICON}\n</head>`);
  }

  // Add top/bottom frame CSS if not present
  if (!html.includes('frame-top')) {
    html = html.replace('</style>\n</head>', `${FRAME_CSS}\n</style>\n</head>`);
    html = html.replace('<body>', `<body>\n${FRAME_HTML}`);
  }

  writeIfChanged(fpath, html);
  console.log(`  ✓ ${dir}/cover.html`);
}

// ─── 4. FIX BIBLE GRID COVER (dist-diebibel/cover.html) ─────────────────────
console.log('\n[4] Fixing Bible grid cover design...');
const gridCoverPath = path.join(BIBLE_DIST, 'cover.html');
if (fs.existsSync(gridCoverPath)) {
  let html = fs.readFileSync(gridCoverPath, 'utf8');
  if (!html.includes('frame-top')) {
    // Add frame CSS
    html = html.replace('</style>\n</head>', `${FRAME_CSS}\n</style>\n</head>`);
    // Add after <body> (or after the paypal-bar opening)
    html = html.replace('<body>', `<body>\n${FRAME_HTML}`);
    writeIfChanged(gridCoverPath, html);
    console.log('  ✓ dist-diebibel/cover.html (frame bars added)');
  } else {
    console.log('  · dist-diebibel/cover.html already has frame');
  }
}

// ─── 5. ADD FAVICON TO MAIN BIBLE GRID INDEX ─────────────────────────────────
console.log('\n[5] Fixing Bible main index.html favicon...');
const mainIdxPath = path.join(BIBLE_DIST, 'index.html');
if (fs.existsSync(mainIdxPath)) {
  let html = fs.readFileSync(mainIdxPath, 'utf8');
  if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', `${CROSS_FAVICON}\n</head>`);
    writeIfChanged(mainIdxPath, html);
    console.log('  ✓ dist-diebibel/index.html');
  } else {
    console.log('  · already has favicon');
  }
}

console.log('\n✅ All remaining German issues fixed.\n');
