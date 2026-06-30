const fs = require('fs');
const path = require('path');

// Sprach-Konfiguration
const languages = {
  kjv: {
    lang: 'en',
    title: 'The Holy Bible',
    prayerLabel: '✦ &nbsp; The Lord\'s Prayer &nbsp; ✦',
    prayer: `Our Father who art in heaven,
     hallowed be thy name. Thy kingdom come.
     Thy will be done on earth as it is in heaven.
     Give us this day our daily bread.
     And forgive us our trespasses,
     as we forgive those who trespass against us.
     And lead us not into temptation, but deliver us from evil.
     Amen`,
    ref: 'Matthew 6:9-13 &nbsp;-&nbsp; Vulgate'
  },
  german: {
    lang: 'de',
    title: 'Die Heilige Bibel',
    prayerLabel: '✦ &nbsp; Vater unser &nbsp; ✦',
    prayer: `Vater unser im Himmel, 
     geheiligt werde dein Name. Dein Reich komme.
     Dein Wille geschehe, wie im Himmel so auf Erden.
     Unser tägliches Brot gib uns heute.
     Und vergib uns unsere Schuld, 
     wie auch wir vergeben unseren Schuldigern.
     Und führe uns nicht in Versuchung, sondern erlöse uns von dem Bösen. 
     Amen`,
    ref: 'Matthäus 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  french: {
    lang: 'fr',
    title: 'La Sainte Bible',
    prayerLabel: '✦ &nbsp; Notre Père &nbsp; ✦',
    prayer: `Notre Père qui es aux cieux,
     que ton nom soit sanctifié. Que ton règne vienne.
     Que ta volonté soit faite sur la terre comme au ciel.
     Donne-nous aujourd\'hui notre pain quotidien.
     Pardonne-nous nos offenses,
     comme nous pardonnons aussi à ceux qui nous ont offensés.
     Et ne nous soumets pas à la tentation, mais délivre-nous du mal.
     Amen`,
    ref: 'Matthieu 6,9-13 &nbsp;-&nbsp; Vulgate'
  },
  spanish: {
    lang: 'es',
    title: 'La Santa Biblia',
    prayerLabel: '✦ &nbsp; Padre Nuestro &nbsp; ✦',
    prayer: `Padre nuestro que estás en los cielos,
     santificado sea tu nombre. Venga tu reino.
     Hágase tu voluntad, como en el cielo, así también en la tierra.
     El pan nuestro de cada día, dánoslo hoy.
     Y perdónanos nuestras deudas,
     como también nosotros perdonamos a nuestros deudores.
     Y no nos metas en tentación, mas líbranos del mal.
     Amén`,
    ref: 'Mateo 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  portuguese: {
    lang: 'pt',
    title: 'A Bíblia Sagrada',
    prayerLabel: '✦ &nbsp; Pai Nosso &nbsp; ✦',
    prayer: `Pai nosso que estás nos céus,
     santificado seja o teu nome. Venha o teu reino.
     Seja feita a tua vontade, assim na terra como no céu.
     O pão nosso de cada dia nos dá hoje.
     E perdoa-nos as nossas dívidas,
     assim como nós perdoamos aos nossos devedores.
     E não nos deixes cair em tentação, mas livra-nos do mal.
     Amém`,
    ref: 'Mateus 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  polish: {
    lang: 'pl',
    title: 'Święta Biblia',
    prayerLabel: '✦ &nbsp; Ojcze Nasz &nbsp; ✦',
    prayer: `Ojcze nasz, któryś jest w niebie,
     święć się imię Twoje. Przyjdź królestwo Twoje.
     Bądź wola Twoja jako w niebie, tak i na ziemi.
     Chleba naszego powszedniego daj nam dzisiaj.
     I odpuść nam nasze winy,
     jako i my odpuszczamy naszym winowajcom.
     I nie wódź nas na pokuszenie, ale nas zbaw ode złego.
     Amen`,
    ref: 'Mateusz 6:9-13 &nbsp;-&nbsp; Wulgata'
  },
  russian: {
    lang: 'ru',
    title: 'Святая Библия',
    prayerLabel: '✦ &nbsp; Отче наш &nbsp; ✦',
    prayer: `Отче наш, сущий на небесах,
     да святится имя Твое. Да приидет Царствие Твое.
     Да будет воля Твоя и на земле, как на небе.
     Хлеб наш насущный дай нам на сей день.
     И прости нам долги наши,
     как и мы прощаем должникам нашим.
     И не введи нас в искушение, но избавь нас от лукавого.
     Аминь`,
    ref: 'Матфей 6:9-13 &nbsp;-&nbsp; Вульгата'
  },
  croatian: {
    lang: 'hr',
    title: 'Sveta Biblija',
    prayerLabel: '✦ &nbsp; Oče Naš &nbsp; ✦',
    prayer: `Oče naš, koji jesi na nebesima,
     sveti se ime tvoje. Dođi kraljevstvo tvoje.
     Budi volja tvoja i na zemlji kao na nebu.
     Kruh naš svagdanji daj nam danas.
     I otpusti nam duge naše,
     kako i mi otpuštamo dužnicima našim.
     I ne uvedi nas u napast, nego izbavi nas od zla.
     Amen`,
    ref: 'Matej 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  dutch: {
    lang: 'nl',
    title: 'De Heilige Bijbel',
    prayerLabel: '✦ &nbsp; Onze Vader &nbsp; ✦',
    prayer: `Onze Vader die in de hemelen zijt,
     Uw naam worde geheiligd. Uw Koninkrijk kome.
     Uw wil geschiede, gelijk in den hemel alzo ook op de aarde.
     Geef ons heden ons dagelijks brood.
     En vergeef ons onze schulden,
     gelijk ook wij vergeven onzen schuldenaren.
     En leid ons niet in verzoeking, maar verlos ons van den boze.
     Amen`,
    ref: 'Mattheüs 6:9-13 &nbsp;-&nbsp; Vulgaat'
  },
  hungarian: {
    lang: 'hu',
    title: 'A Szent Biblia',
    prayerLabel: '✦ &nbsp; Miatyánk &nbsp; ✦',
    prayer: `Mi Atyánk, aki a mennyekben vagy,
     szenteltessék meg a te neved. Jöjjön el a te országod.
     Legyen meg a te akaratod, amint a mennyben, úgy a földön is.
     A mi mindennapi kenyerünket add meg nekünk ma.
     És bocsásd meg vétkeinket,
     miképpen mi is megbocsátunk az ellenünk vétkezőknek.
     És ne vígy minket kísértésbe, de szabadíts meg a gonosztól.
     Ámen`,
    ref: 'Máté 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  czech: {
    lang: 'cs',
    title: 'Svatá Bible',
    prayerLabel: '✦ &nbsp; Otče Náš &nbsp; ✦',
    prayer: `Otče náš, jenž jsi na nebesích,
     posvěť se jméno tvé. Přijď království tvé.
     Buď vůle tvá jako v nebi, tak i na zemi.
     Chléb náš vezdejší dej nám dnes.
     A odpusť nám naše viny,
     jakož i my odpouštíme našim viníkům.
     A neuveď nás v pokušení, ale zbav nás od zlého.
     Amen`,
    ref: 'Matouš 6:9-13 &nbsp;-&nbsp; Vulgáta'
  },
  swedish: {
    lang: 'sv',
    title: 'Den Heliga Bibeln',
    prayerLabel: '✦ &nbsp; Fader Vår &nbsp; ✦',
    prayer: `Fader vår som är i himmelen,
     helgat varde ditt namn. Tillkomme ditt rike.
     Ske din vilja, såsom i himmelen så ock på jorden.
     Vårt dagliga bröd giv oss idag.
     Och förlåt oss våra skulder,
     såsom ock vi förlåta dem oss skyldiga äro.
     Och inled oss icke i frestelse, utan fräls oss ifrån ondo.
     Amen`,
    ref: 'Matteus 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  tagalog: {
    lang: 'tl',
    title: 'Ang Banal na Bibliya',
    prayerLabel: '✦ &nbsp; Ama Namin &nbsp; ✦',
    prayer: `Ama namin, sumasalangit ka,
     sambahin ang ngalan mo. Mapasaamin ang kaharian mo.
     Sundin ang loob mo, dito sa lupa para ring sa langit.
     Bigyan mo kami ngayon ng aming kakanin sa araw-araw.
     At patawarin mo kami sa aming mga sala,
     para ng pagpapatawad namin sa mga nagkakasala sa amin.
     At huwag mo kaming ipahintulot sa tukso, at iadya mo kami sa lahat ng masama.
     Amen`,
    ref: 'Mateo 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  ukrainian: {
    lang: 'uk',
    title: 'Свята Біблія',
    prayerLabel: '✦ &nbsp; Отче наш &nbsp; ✦',
    prayer: `Отче наш, що єси на небесах,
     нехай святиться ім\'я Твоє. Хай прийде Царство Твоє.
     Хай буде воля Твоя, як на небі, так і на землі.
     Хліб наш насущний дай нам сьогодні.
     І прости нам провини наші,
     як і ми прощаємо винуватцям нашим.
     І не введи нас у спокусу, але визволи нас від лукавого.
     Амінь`,
    ref: 'Матвій 6:9-13 &nbsp;-&nbsp; Вульґата'
  },
  albanian: {
    lang: 'sq',
    title: 'Bibla e Shenjtë',
    prayerLabel: '✦ &nbsp; Ati Ynë &nbsp; ✦',
    prayer: `Ati ynë që je në qiej,
     u shenjtëroftë emri yt. Ardhtë mbretëria jote.
     U bëftë vullneti yt, si në qiell ashtu edhe mbi dhe.
     Bukën tonë të përditshme jepna neve sot.
     Dhe na fal neve fajet tona,
     ashtu siç ua falim ne fajtorëve tanë.
     Dhe mos na shti në tundim, por na shpëto nga i ligu.
     Amen`,
    ref: 'Mateu 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  italian: {
    lang: 'it',
    title: 'La Sacra Bibbia',
    prayerLabel: '✦ &nbsp; Padre Nostro &nbsp; ✦',
    prayer: `Padre nostro che sei nei cieli,
     sia santificato il tuo nome. Venga il tuo regno.
     Sia fatta la tua volontà, come in cielo così in terra.
     Dacci oggi il nostro pane quotidiano.
     E rimetti a noi i nostri debiti,
     come anche noi li rimettiamo ai nostri debitori.
     E non ci indurre in tentazione, ma liberaci dal male.
     Amen`,
    ref: 'Matteo 6:9-13 &nbsp;-&nbsp; Vulgata'
  },
  armenian: {
    lang: 'hy',
    title: 'Սուրբ Գիրք',
    prayerLabel: '✦ &nbsp; Հայր Մեր &nbsp; ✦',
    prayer: `Հայր մեր, որ երկինս ես,
     սուրբ եղիցի անուն քո։ Եկեսցէ արքայութիւն քո։
     Եղիցին կամք քո որպէս յերկինս եւ յերկրի։
     Զհաց մեր հանապազորդ տուր մեզ այսօր։
     Եւ թող մեզ զպարտիս մեր,
     որպէս եւ մեք թողումք մերոց պարտապանաց։
     Եւ մի տանիր զմեզ ի փորձութիւն, այլ փրկեա զմեզ ի չարէ։
     Ամէն`,
    ref: 'Մատթէոս 6։9-13 &nbsp;-&nbsp; Վուլգատա'
  }
};

console.log('🔧 Fixing all back-covers and adding scroll overlays to cover...\n');

// 1. Fix back-cover.html für jede Sprache
Object.keys(languages).forEach(lang => {
  const config = languages[lang];
  const backCoverPath = path.join('dist-diebibel', lang, 'back-cover.html');
  
  if (!fs.existsSync(backCoverPath)) {
    console.log(`⚠️  ${lang}/back-cover.html does not exist, creating...`);
  }

  const backCoverHTML = `<!DOCTYPE html>
<html lang="${config.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${config.title} · Back Cover</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
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
<a class="book" href="index.html">
  <img src="Bibel-Rueckseite-Katholisch.png" alt="Back Cover">
  <div class="overlay">
    <div class="prayer-label">${config.prayerLabel}</div>
    <div class="prayer">
${config.prayer}
    </div>
    <div class="prayer-ref">${config.ref}</div>
  </div>
</a>




</body>
</html>`;

  fs.writeFileSync(backCoverPath, backCoverHTML, 'utf8');
  console.log(`✅ ${lang}/back-cover.html - "${config.title}"`);
});

// 2. Add scroll overlays to cover.html
console.log('\n📜 Adding scroll overlays to cover.html...');

const coverPath = path.join('dist-diebibel', 'cover.html');
let coverHTML = fs.readFileSync(coverPath, 'utf8');

// Check if scroll overlays already exist
if (!coverHTML.includes('scroll-overlay-top')) {
  // Add CSS for scroll overlays
  const scrollOverlayCSS = `
/* SCROLL OVERLAYS - hide content behind header/footer */
.scroll-overlay-top{position:sticky;top:0;height:0;z-index:98;pointer-events:none;}
.scroll-overlay-top::before{content:'';display:block;height:80px;background:linear-gradient(to bottom,#2a0810 0%,#2a0810 70%,transparent 100%);}
.scroll-overlay-bottom{position:sticky;bottom:0;height:0;z-index:98;pointer-events:none;}
.scroll-overlay-bottom::before{content:'';display:block;height:80px;margin-top:-80px;background:linear-gradient(to top,#2a0810 0%,#2a0810 70%,transparent 100%);}`;

  // Insert before closing </style>
  coverHTML = coverHTML.replace('</style>', scrollOverlayCSS + '\n</style>');

  // Add overlay divs after <header> and before <footer>
  coverHTML = coverHTML.replace('</header>', '</header>\n<div class="scroll-overlay-top"></div>');
  coverHTML = coverHTML.replace('<div class="footer-bar">', '<div class="scroll-overlay-bottom"></div>\n<div class="footer-bar">');

  fs.writeFileSync(coverPath, coverHTML, 'utf8');
  console.log('✅ Scroll overlays added to cover.html');
} else {
  console.log('ℹ️  Scroll overlays already exist in cover.html');
}

console.log('\n✨ All back-covers updated and scroll overlays added!');
