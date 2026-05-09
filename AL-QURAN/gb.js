const fs=require('fs'),path=require('path');
const BASE='C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX';
const FONTS='<link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri+Quran&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">';
const FA=[
  '\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650',
  '\u0671\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u0631\u064e\u0628\u0651\u0650 \u0671\u0644\u0652\u0639\u064e\u070f\u0644\u064e\u0645\u0650\u064a\u0646\u064e',
  '\u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650',
  '\u0645\u064e\u0670\u0644\u0650\u0643\u0650 \u064a\u064e\u0648\u0652\u0645\u0650 \u0671\u0644\u0652\u062f\u0651\u0650\u064a\u0646\u0650',
  '\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0639\u0652\u0628\u064f\u062f\u064f \u0648\u064e\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0633\u0652\u062a\u064e\u0639\u0650\u064a\u0646\u064f',
  '\u0671\u0647\u0652\u062f\u0650\u0646\u064e\u0627 \u0671\u0644\u0635\u0651\u0650\u0631\u064e\u0670\u0637\u064e \u0671\u0644\u0652\u0645\u064f\u0633\u0652\u062a\u064e\u0642\u0650\u064a\u0645\u064e',
  '\u0635\u0650\u0631\u064e\u0670\u0637\u064e \u0671\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0623\u064e\u0646\u0652\u0639\u064e\u0645\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652',
  '\u063a\u064e\u064a\u0652\u0631\u0650 \u0671\u0644\u0652\u0645\u064e\u063a\u0652\u0636\u064f\u0648\u0628\u0650 \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u0648\u064e\u0644\u064e\u0627 \u0671\u0644\u0636\u0651\u064e\u0670\u0644\u0651\u0650\u064a\u0646\u064e'
].join('\n');

function koran(outFile,imgSrc,bgMain,bgDark,bgLight,gold,btnBg,btnColor,titleDe,titleAr,dua,copy,coverHref){
  const goldRgb=parseInt(gold.replace('#',''),16),r=(goldRgb>>16)&255,g=(goldRgb>>8)&255,b=goldRgb&255;
  const ga=a=>`rgba(${r},${g},${b},${a})`;
  const darkRgb=parseInt(bgDark.replace('#',''),16),dr=(darkRgb>>16)&255,dg=(darkRgb>>8)&255,db=darkRgb&255;
  const da=a=>`rgba(${dr},${dg},${db},${a})`;
  const html=`<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titleDe} - Rueckseite</title>
${FONTS}
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:${bgMain};display:flex;align-items:flex-start;justify-content:center;}
body::before{content:'';position:fixed;inset:16px;border:1px solid ${ga(.35)};pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid ${ga(.15)};pointer-events:none;z-index:5;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:14px;
  background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,${ga(.22)} 4px,${ga(.22)} 5px),
  repeating-linear-gradient(-60deg,transparent,transparent 4px,${ga(.22)} 4px,${ga(.22)} 5px);
  background-size:10px 14px;pointer-events:none;z-index:6;}
.frame-top{top:0;border-bottom:1px solid ${ga(.3)};}
.frame-bot{bottom:0;border-top:1px solid ${ga(.3)};}
.page{width:100%;max-width:620px;display:flex;flex-direction:column;align-items:center;padding:24px 36px 36px;
  background:linear-gradient(180deg,${bgDark} 0%,${bgMain} 40%,${bgLight} 70%,${bgMain} 100%);}
.book{width:min(467px,90vw);position:relative;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.7);}
.overlay{position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(transparent 0%,${da(.93)} 28%,${da(.98)} 100%);
  padding:90px 24px 24px;text-align:center;}
.orn{font-family:'Cinzel',serif;font-size:.55rem;letter-spacing:.6em;color:${ga(.5)};margin:8px 0;text-align:center;}
.ttl{font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.2em;color:${gold};text-align:center;margin-bottom:4px;font-weight:600;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:1.3rem;color:${gold};text-align:center;direction:rtl;}
.rule{width:70%;height:1px;margin:10px auto;background:linear-gradient(to right,transparent,${gold},transparent);}
.pl{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.2em;color:${ga(.7)};text-align:center;margin-bottom:8px;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.1rem;color:${ga(.9)};direction:rtl;text-align:center;line-height:2;white-space:pre-line;}
.dua{font-style:italic;font-size:.78rem;color:${ga(.75)};text-align:center;line-height:1.8;margin-top:8px;}
.copy{font-family:'Cinzel',serif;font-size:.68rem;font-weight:700;color:${ga(.85)};text-align:center;margin-top:10px;letter-spacing:.1em;}
.bl{display:inline-block;margin-top:12px;padding:10px 40px;background:${btnBg};color:${btnColor};border:2px solid ${btnBg};text-decoration:none;font:.65rem sans-serif;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:opacity .18s;}
.bl:hover{opacity:.85;}
</style>
</head>
<body>
<div class="frame-top"></div>
<div class="frame-bot"></div>
<div class="page">
  <div class="book">
    <img src="${imgSrc}" alt="Rueckseite">
    <div class="overlay">
      <div class="orn">* * *</div>
      <div class="ttl">${titleDe.toUpperCase()}</div>
      <div class="ttl-ar">${titleAr}</div>
      <div class="rule"></div>
      <div class="pl">\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629 \u2013 Al-Fatiha \u2013 Die \u00d6ffnende</div>
      <div class="ar">${FA}</div>
      <div class="rule"></div>
      <div class="dua">${dua}</div>
      <div class="copy">${copy}</div>
      <a href="${coverHref}" class="bl">\u2190 Zum Cover</a>
    </div>
  </div>
</div>
</body></html>`;
  fs.writeFileSync(outFile,html,'utf8');
  console.log('OK:',path.basename(path.dirname(outFile)));
}

koran(
  path.join(BASE,'AL-QURAN','back-cover.html'),
  '../Koran-Rueckseite-Original.png',
  '#0a1f0e','#051009','#122e16','#b89032','#b89032','#0a1f0e',
  'Al-Quran Al-Karim','\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064a\u0645',
  'M\u00f6ge Allah uns allen den geraden Weg weisen<br>und uns mit Seiner Barmherzigkeit umh\u00fcllen. Ameen.',
  'Eigentum von KX Books','cover.html'
);
koran(
  path.join(BASE,'Geschenke','Koran-Deutsch-1','back-cover.html'),
  '../../Koran-Rueckseite-Meliha.png',
  '#2d1060','#1a0840','#3e1878','#c9a84c','#c9a84c','#2d1060',
  'Der Heilige Koran','\u0647\u062f\u064a\u0629 \u0644\u0645\u0644\u064a\u0647\u0627',
  'M\u00f6ge Allah Meliha mit Seiner Barmherzigkeit umh\u00fcllen,<br>ihr Wissen und Iman st\u00e4rken<br>und sie in dieser Welt und im Jenseits segnen. Ameen.',
  'Eigentum von Meliha','cover.html'
);
koran(
  path.join(BASE,'Geschenke','Koran-Deutsch-2','back-cover.html'),
  '../../Koran-Rueckseite-Karim.png',
  '#003a1e','#001a0e','#005228','#c9a84c','#ce1126','#ffffff',
  'Der Heilige Koran','\u0647\u062f\u064a\u0629 \u0644\u0643\u0631\u064a\u0645',
  'M\u00f6ge Allah Karim mit Seinem Licht erleuchten,<br>ihn auf dem geraden Weg f\u00fchren<br>und ihn und seine Familie segnen. Ameen.',
  'Eigentum von Karim','cover.html'
);
