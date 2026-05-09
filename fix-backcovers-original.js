'use strict';
const fs = require('fs');
const path = require('path');

const BASE = __dirname;

// ── AL-QURAN back-cover ──────────────────────────────────────────────────────
const FATIHA = [
  '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650',
  '\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0651\u064e\u0647\u0650 \u0631\u064e\u0628\u0650\u0651 \u0627\u0644\u0652\u0639\u064e\u0627\u0644\u064e\u0645\u0650\u064a\u0646\u064e',
  '\u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650',
  '\u0645\u064e\u0627\u0644\u0650\u0643\u0650 \u064a\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u062f\u0651\u0650\u064a\u0646\u0650',
  '\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0639\u0652\u0628\u064f\u062f\u064f \u0648\u064e\u0625\u0650\u064a\u0651\u064e\u0627\u0643\u064e \u0646\u064e\u0633\u0652\u062a\u064e\u0639\u0650\u064a\u0646\u064f',
  '\u0627\u0647\u0652\u062f\u0650\u0646\u064e\u0627 \u0627\u0644\u0635\u0651\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0652\u0645\u064f\u0633\u0652\u062a\u064e\u0642\u0650\u064a\u0645\u064e',
  '\u0635\u0650\u0631\u064e\u0627\u0637\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0623\u064e\u0646\u0652\u0639\u064e\u0645\u0652\u062a\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u063a\u064e\u064a\u0652\u0631\u0650 \u0627\u0644\u0652\u0645\u064e\u063a\u0652\u0636\u064f\u0648\u0628\u0650 \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u0648\u064e\u0644\u064e\u0627 \u0627\u0644\u0636\u0651\u064e\u0627\u0644\u0651\u0650\u064a\u0646\u064e'
].join('<br>');

const quranBack = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Al-Quran Al-Karim \u2013 R\u00fcckseite</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Cinzel:wght@400;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;background:#060e08;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px 0;}
body::before{content:'';position:fixed;inset:16px;border:1px solid rgba(192,155,60,.35);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:28px;border:1px solid rgba(192,155,60,.15);pointer-events:none;z-index:5;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:14px;
  background-image:repeating-linear-gradient(60deg,transparent,transparent 4px,rgba(192,155,60,.2) 4px,rgba(192,155,60,.2) 5px),
  repeating-linear-gradient(-60deg,transparent,transparent 4px,rgba(192,155,60,.2) 4px,rgba(192,155,60,.2) 5px);
  background-size:10px 14px;pointer-events:none;z-index:6;}
.frame-top{top:0;border-bottom:1px solid rgba(192,155,60,.3);}
.frame-bot{bottom:0;border-top:1px solid rgba(192,155,60,.3);}
.book{width:min(467px,90vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.7);}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 24px 5%;text-align:center;}
.orn{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.6em;color:rgba(0,40,15,.45);margin:3px 0;}
.ttl{font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.2em;color:#002a10;margin-bottom:3px;font-weight:600;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:1.25rem;color:#002a10;direction:rtl;}
.rule{width:70%;height:1px;margin:5px auto;background:linear-gradient(to right,transparent,#003a1e,transparent);}
.pl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.2em;color:rgba(0,40,15,.6);margin-bottom:5px;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.05rem;color:#001e0a;direction:rtl;text-align:center;line-height:1.7;}
.dua{font-style:italic;font-size:.72rem;color:#002a10;text-align:center;line-height:1.6;margin-top:6px;hyphens:none;-webkit-hyphens:none;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;border:2px solid #c9a84c;background:#c9a84c;color:#060e08;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:#ddb83a;border-color:#ddb83a;}
</style>
</head>
<body>
<div class="frame-top"></div>
<div class="frame-bot"></div>
<div class="book">
  <img src="../Koran-Rueckseite-Original.png" alt="R\u00fcckseite">
  <div class="overlay">
    <div class="ttl">AL-QURAN AL-KARIM</div>
    <div class="ttl-ar">\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064a\u0645</div>
    <div class="rule"></div>
    <div class="pl">\u0633\u0648\u0631\u0629 \u0627\u0644\u0641\u0627\u062a\u062d\u0629 \u2013 Al-Fatiha \u2013 Die \u00d6ffnende</div>
    <div class="ar">${FATIHA}</div>
    <div class="rule"></div>
    <div class="dua">M\u00f6ge Allah uns allen den geraden Weg weisen<br>und uns mit Seiner Barmherzigkeit umh\u00fcllen. Ameen.</div>
  </div>
</div>
<div class="btn-wrap">
  <a href="cover.html" class="btn">\u2190 Zum Cover</a>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(BASE, 'AL-QURAN', 'back-cover.html'), quranBack, 'utf8');
console.log('Written: AL-QURAN/back-cover.html');

// ── CATHOLIC-BIBLE back-cover ────────────────────────────────────────────────
const bibleBack = `<!DOCTYPE html>
<html lang="la">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Biblia Catholica \u2013 R\u00fcckseite</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
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
.book{width:min(467px,90vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:0 20px 60px rgba(0,0,0,.5);}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 28px 5%;text-align:center;}
.prayer-label{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.28em;color:#3a0005;margin-bottom:8px;}
.rule{width:70%;height:1px;margin:7px auto;background:linear-gradient(to right,transparent,#5a1000,transparent);}
.prayer{font-family:'EB Garamond',Georgia,serif;font-style:italic;font-size:.9rem;color:#200005;line-height:1.85;hyphens:none;-webkit-hyphens:none;}
.prayer-ref{font-family:'Cinzel',serif;font-size:.44rem;color:#5a1000;margin-top:6px;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;background:#5a0010;color:#EDD882;border:2px solid #5a0010;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:#7a1020;border-color:#7a1020;}
</style>
</head>
<body>
<div class="corner c-tl"></div><div class="corner c-tr"></div>
<div class="corner c-bl"></div><div class="corner c-br"></div>
<div class="book">
  <img src="../../Bibel-Rueckseite-Katholisch.png" alt="R\u00fcckseite">
  <div class="overlay">
    <div class="prayer-label">\u2726 &nbsp; Pater Noster &nbsp; \u2726</div>
    <div class="prayer">
      Pater noster, qui es in caelis,<br>
      sanctificetur nomen tuum.<br>
      Adveniat regnum tuum.<br>
      Fiat voluntas tua, sicut in caelo et in terra.<br>
      Panem nostrum quotidianum da nobis hodie.<br>
      Et dimitte nobis debita nostra,<br>
      sicut et nos dimittimus debitoribus nostris.<br>
      Et ne nos inducas in tentationem,<br>
      sed libera nos a malo. Amen.
    </div>
    <div class="prayer-ref">Matthaeus 6,9\u201313 &nbsp;\u00b7&nbsp; Vulgata</div>
  </div>
</div>
<div class="btn-wrap">
  <a href="cover.html" class="btn">\u2190 Zum Cover</a>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(BASE, 'CATHOLIC-BIBLE', 'Übersetzungen', 'back-cover.html'), bibleBack, 'utf8');
console.log('Written: CATHOLIC-BIBLE/Übersetzungen/back-cover.html');
