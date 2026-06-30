const fs = require('fs');
const path = require('path');

const prayers = {
  kjv: {
    lang: 'en',
    flag: '🇬🇧',
    title: 'The Lord\'s Prayer',
    text: `Our Father who art in heaven,
     hallowed be thy name. Thy kingdom come.
     Thy will be done on earth as it is in heaven.
     Give us this day our daily bread.
     And forgive us our trespasses,
     as we forgive those who trespass against us.
     And lead us not into temptation, but deliver us from evil.
     Amen`,
    ref: 'Matthew 6:9-13 &nbsp;-&nbsp; King James Version'
  },
  german: {
    lang: 'de',
    flag: '🇩🇪',
    title: 'Vater unser',
    text: `Vater unser im Himmel, 
     geheiligt werde dein Name. Dein Reich komme.
     Dein Wille geschehe, wie im Himmel so auf Erden.
     Unser tägliches Brot gib uns heute.
     Und vergib uns unsere Schuld, 
     wie auch wir vergeben unseren Schuldigern.
     Und führe uns nicht in Versuchung, sondern erlöse uns von dem Bösen. 
     Amen`,
    ref: 'Matthaeus 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  french: {
    lang: 'fr',
    flag: '🇫🇷',
    title: 'Notre Père',
    text: `Notre Père qui es aux cieux,
     que ton nom soit sanctifié. Que ton règne vienne.
     Que ta volonté soit faite sur la terre comme au ciel.
     Donne-nous aujourd'hui notre pain quotidien.
     Pardonne-nous nos offenses,
     comme nous pardonnons aussi à ceux qui nous ont offensés.
     Et ne nous soumets pas à la tentation, mais délivre-nous du mal.
     Amen`,
    ref: 'Matthieu 6,9-13 &nbsp;-&nbsp; Vulgate'
  },
  spanish: {
    lang: 'es',
    flag: '🇪🇸',
    title: 'Padre Nuestro',
    text: `Padre nuestro que estás en los cielos,
     santificado sea tu nombre. Venga tu reino.
     Hágase tu voluntad, así en la tierra como en el cielo.
     El pan nuestro de cada día, dánoslo hoy.
     Y perdónanos nuestras deudas,
     como también nosotros perdonamos a nuestros deudores.
     Y no nos metas en tentación, mas líbranos del mal.
     Amén`,
    ref: 'Mateo 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  portuguese: {
    lang: 'pt',
    flag: '🇵🇹',
    title: 'Pai Nosso',
    text: `Pai nosso que estais nos céus,
     santificado seja o vosso nome. Venha o vosso reino.
     Seja feita a vossa vontade, assim na terra como no céu.
     O pão nosso de cada dia nos dai hoje.
     Perdoai-nos as nossas dívidas,
     assim como nós perdoamos aos nossos devedores.
     E não nos deixeis cair em tentação, mas livrai-nos do mal.
     Amém`,
    ref: 'Mateus 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  polish: {
    lang: 'pl',
    flag: '🇵🇱',
    title: 'Ojcze nasz',
    text: `Ojcze nasz, któryś jest w niebie,
     święć się imię Twoje. Przyjdź królestwo Twoje.
     Bądź wola Twoja jako w niebie, tak i na ziemi.
     Chleba naszego powszedniego daj nam dzisiaj.
     I odpuść nam nasze winy,
     jako i my odpuszczamy naszym winowajcom.
     I nie wódź nas na pokuszenie, ale nas zbaw ode złego.
     Amen`,
    ref: 'Mateusza 6,9-13 &nbsp;-&nbsp; Wulgata'
  },
  russian: {
    lang: 'ru',
    flag: '🇷🇺',
    title: 'Отче наш',
    text: `Отче наш, сущий на небесах!
     Да святится имя Твое. Да приидет Царствие Твое.
     Да будет воля Твоя и на земле, как на небе.
     Хлеб наш насущный дай нам на сей день.
     И прости нам долги наши,
     как и мы прощаем должникам нашим.
     И не введи нас в искушение, но избавь нас от лукавого.
     Аминь`,
    ref: 'Матфея 6,9-13 &nbsp;-&nbsp; Вульгата'
  },
  croatian: {
    lang: 'hr',
    flag: '🇭🇷',
    title: 'Oče naš',
    text: `Oče naš koji jesi na nebesima,
     sveti se ime tvoje. Dođi kraljevstvo tvoje.
     Budi volja tvoja i na zemlji kao na nebu.
     Kruh naš svagdanji daj nam danas.
     I otpusti nam duge naše,
     kao što i mi otpuštamo dužnicima svojim.
     I ne uvedi nas u napast, nego izbavi nas od zla.
     Amen`,
    ref: 'Matej 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  dutch: {
    lang: 'nl',
    flag: '🇳🇱',
    title: 'Onze Vader',
    text: `Onze Vader die in de hemelen zijt,
     Uw naam worde geheiligd. Uw Koninkrijk kome.
     Uw wil geschiede, gelijk in den hemel alzo ook op de aarde.
     Geef ons heden ons dagelijks brood.
     En vergeef ons onze schulden,
     gelijk ook wij vergeven onzen schuldenaren.
     En leid ons niet in verzoeking, maar verlos ons van den booze.
     Amen`,
    ref: 'Mattheüs 6,9-13 &nbsp;-&nbsp; Vulgaat'
  },
  hungarian: {
    lang: 'hu',
    flag: '🇭🇺',
    title: 'Mi Atyánk',
    text: `Mi Atyánk, aki a mennyekben vagy,
     szenteltessék meg a te neved. Jöjjön el a te országod.
     Legyen meg a te akaratod, mint a mennyben, úgy a földön is.
     A mi mindennapi kenyerünket add meg nékünk ma.
     És bocsásd meg a mi vétkeinket,
     miképpen mi is megbocsátunk az ellenünk vétkezőknek.
     És ne vígy minket kísértésbe, de szabadíts meg a gonosztól.
     Ámen`,
    ref: 'Máté 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  czech: {
    lang: 'cs',
    flag: '🇨🇿',
    title: 'Otče náš',
    text: `Otče náš, jenž jsi na nebesích,
     posvěť se jméno tvé. Přijď království tvé.
     Buď vůle tvá jako v nebi, tak i na zemi.
     Chléb náš vezdejší dej nám dnes.
     A odpusť nám naše viny,
     jakož i my odpouštíme našim viníkům.
     A neuveď nás v pokušení, ale zbav nás od zlého.
     Amen`,
    ref: 'Matouš 6,9-13 &nbsp;-&nbsp; Vulgáta'
  },
  swedish: {
    lang: 'sv',
    flag: '🇸🇪',
    title: 'Fader vår',
    text: `Fader vår som är i himmelen,
     helgat varde ditt namn. Tillkomme ditt rike.
     Ske din vilja såsom i himmelen så ock på jorden.
     Vårt dagliga bröd giv oss i dag.
     Och förlåt oss våra skulder,
     såsom ock vi förlåta dem oss skyldiga äro.
     Och inled oss icke i frestelse, utan fräls oss ifrån ondo.
     Amen`,
    ref: 'Matteus 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  tagalog: {
    lang: 'tl',
    flag: '🇵🇭',
    title: 'Ama Namin',
    text: `Ama namin, sumasalangit Ka,
     sambahin ang ngalan Mo. Mapasaamin ang kaharian Mo.
     Sundin ang loob Mo dito sa lupa para nang sa langit.
     Bigyan Mo kami ngayon ng aming kakanin sa araw-araw.
     At patawarin Mo kami sa aming mga sala,
     para nang pagpapatawad namin sa mga nagkakasala sa amin.
     At huwag Mo kaming ipahintulot sa tukso, at iadya Mo kami sa lahat ng masama.
     Amen`,
    ref: 'Mateo 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  ukrainian: {
    lang: 'uk',
    flag: '🇺🇦',
    title: 'Отче наш',
    text: `Отче наш, що єси на небесах!
     Нехай святиться ім'я Твоє. Нехай прийде Царство Твоє.
     Нехай буде воля Твоя, як на небі, так і на землі.
     Хліб наш насущний дай нам сьогодні.
     І прости нам провини наші,
     як і ми прощаємо винуватцям нашим.
     І не введи нас у спокусу, але визволи нас від лукавого.
     Амінь`,
    ref: 'Матвія 6,9-13 &nbsp;-&nbsp; Вульгата'
  },
  albanian: {
    lang: 'sq',
    flag: '🇦🇱',
    title: 'Ati ynë',
    text: `Ati ynë, që je në qiejt,
     u shenjtëroftë emri yt. Ardhtë mbretëria jote.
     U bëftë vullneti yt, si në qiell ashtu edhe mbi tokë.
     Bukën tonë të përditshme jepna neve sot.
     Dhe na fali ne fajet tona,
     sikurse edhe ne u falim fajtorëve tanë.
     Dhe mos na shpjerë në tundim, por na shpëtoje nga i ligu.
     Amen`,
    ref: 'Mateu 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  italian: {
    lang: 'it',
    flag: '🇮🇹',
    title: 'Padre Nostro',
    text: `Padre nostro che sei nei cieli,
     sia santificato il tuo nome. Venga il tuo regno.
     Sia fatta la tua volontà, come in cielo così in terra.
     Dacci oggi il nostro pane quotidiano.
     E rimetti a noi i nostri debiti,
     come anche noi li rimettiamo ai nostri debitori.
     E non ci indurre in tentazione, ma liberaci dal male.
     Amen`,
    ref: 'Matteo 6,9-13 &nbsp;-&nbsp; Vulgata'
  },
  armenian: {
    lang: 'hy',
    flag: '🇦🇲',
    title: 'Հայր մեր',
    text: `Հայր մեր, որ երկնքում ես,
     սուրբ եղիցի անուն քո։ Եկեսցե արքայություն քո։
     Եղիցին կամք քո, որպես յերկինս եվ յերկրի։
     Զհաց մեր հանապազորդ տուր մեզ այսօր։
     Եվ թող մեզ զպարտիս մեր,
     որպես եվ մեք թողումք մերոց պարտապանաց։
     Եվ մի տանիր զմեզ ի փորձութիւն, այլ փրկեա զմեզ ի չարէ։
     Ամեն`,
    ref: 'Մատթեոս 6,9-13 &nbsp;-&nbsp; Վուլգատա'
  }
};

const template = (prayer, langCode) => `<!DOCTYPE html>
<html lang="${langCode}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica · Back Cover</title>
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
    <div class="prayer-label">✦ &nbsp; ${prayer.title} &nbsp; ✦</div>
    <div class="prayer">
${prayer.text}
    </div>
    <div class="prayer-ref">${prayer.ref}</div>
  </div>
</a>




</body>
</html>`;

const languages = Object.keys(prayers);

console.log('🔨 Creating back-cover.html for all languages...\n');

let count = 0;
for (const lang of languages) {
  const prayer = prayers[lang];
  const dirPath = path.join(__dirname, 'dist-diebibel', lang);
  const filePath = path.join(dirPath, 'back-cover.html');
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Skipping ${lang} - directory not found`);
    continue;
  }
  
  const html = template(prayer, prayer.lang);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${lang}/back-cover.html`);
  count++;
}

console.log(`\n✨ Done! Created ${count} back-cover files with native prayers.`);
