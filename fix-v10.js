const fs = require('fs');
const path = require('path');

// ═══ 8-Zacken-Stern (kein Gitter – nur Rahmen-Streifen) ═══
function makeStar(fill, size) {
  const c = size / 2, r = size * 0.44, ri = size * 0.18;
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI / 8) - Math.PI / 2;
    const rad = (i % 2 === 0) ? r : ri;
    pts.push(`${(c + rad * Math.cos(a)).toFixed(2)},${(c + rad * Math.sin(a)).toFixed(2)}`);
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><polygon points="${pts.join(' ')}" fill="${fill}"/></svg>`).toString('base64');
}

const STAR_G = `url("data:image/svg+xml;base64,${makeStar('rgba(192,155,60,0.40)', 14)}")`;
const STAR_Q = `url("data:image/svg+xml;base64,${makeStar('rgba(192,155,60,0.48)', 14)}")`;

// Säulen (KEIN Gitter mehr auf body)
const COL_G = `linear-gradient(to right,#c9a84c 0,#c9a84c 3px,#ddd5a8 3px,#ddd5a8 180px,transparent 180px,transparent calc(100% - 180px),#ddd5a8 calc(100% - 180px),#ddd5a8 calc(100% - 3px),#c9a84c calc(100% - 3px)) 0 0/100% 100% fixed`;
const COL_Q = `linear-gradient(to right,rgba(192,155,60,.65) 0,rgba(192,155,60,.65) 3px,#142e18 3px,#142e18 180px,transparent 180px,transparent calc(100% - 180px),#142e18 calc(100% - 180px),#142e18 calc(100% - 3px),rgba(192,155,60,.65) calc(100% - 3px)) 0 0/100% 100% fixed`;

// ═══════════════════════════════════════════════════════════════════════════
//  COVER CSS – Mit Sternrahmen oben/unten (body::before/::after)
// ═══════════════════════════════════════════════════════════════════════════
const COVER_Q_CSS = `*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#1e3d22;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:14px;background:#163020 ${STAR_Q} 0 0/14px 14px;border-bottom:1px solid rgba(192,155,60,.3);z-index:5;pointer-events:none;}
body::after{content:'';position:fixed;bottom:0;left:0;right:0;height:14px;background:#163020 ${STAR_Q} 0 0/14px 14px;border-top:1px solid rgba(192,155,60,.3);z-index:5;pointer-events:none;}
a.cv{display:block;width:min(490px,92vw);position:relative;z-index:1;}
a.cv img{width:100%;height:auto;display:block;box-shadow:none;}`;

const COVER_G_CSS = `*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#F5EDD8;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:14px;background:${STAR_G} 0 0/14px 14px;border-bottom:1px solid rgba(192,155,60,.25);z-index:5;pointer-events:none;}
body::after{content:'';position:fixed;bottom:0;left:0;right:0;height:14px;background:${STAR_G} 0 0/14px 14px;border-top:1px solid rgba(192,155,60,.25);z-index:5;pointer-events:none;}
a.cv{display:block;width:min(490px,92vw);position:relative;z-index:1;}
a.cv img{width:100%;height:auto;display:block;box-shadow:none;}`;

// ═══════════════════════════════════════════════════════════════════════════
//  BACK-COVER äußere – AL-QURAN (mit PNG-Overlay)
// ═══════════════════════════════════════════════════════════════════════════
const BACK_Q_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#1e3d22;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:0;}
body::before{content:'';position:fixed;inset:14px;border:1px solid rgba(192,155,60,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:27px;border:1px solid rgba(192,155,60,.12);pointer-events:none;z-index:5;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:14px;background:#163020 ${STAR_Q} 0 0/14px 14px;pointer-events:none;z-index:6;}
.frame-top{top:0;border-bottom:1px solid rgba(192,155,60,.28);}
.frame-bot{bottom:0;border-top:1px solid rgba(192,155,60,.28);}
.book{width:min(490px,92vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8% 30% 5%;text-align:center;}
.ttl{font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.2em;color:#c9a84c;margin-bottom:3px;font-weight:600;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:1.4rem;color:#c9a84c;direction:rtl;}
.rule{width:70%;height:1px;margin:6px auto;background:linear-gradient(to right,transparent,#c9a84c,transparent);}
.pl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.18em;color:rgba(201,168,76,.65);margin-bottom:6px;hyphens:none;-webkit-hyphens:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.18rem;color:rgba(201,168,76,.92);direction:rtl;text-align:center;line-height:1.72;hyphens:none;-webkit-hyphens:none;}
.dua{font-style:italic;font-size:.82rem;color:rgba(201,168,76,.82);text-align:center;line-height:1.65;margin-top:7px;hyphens:none;-webkit-hyphens:none;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;border:1px solid rgba(192,155,60,.6);background:transparent;color:#c9a84c;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:rgba(192,155,60,.1);border-color:#c9a84c;}`;

// ═══════════════════════════════════════════════════════════════════════════
//  BACK-COVER äußere – GESCHENKE (Meliha – mit PNG-Overlay)
// ═══════════════════════════════════════════════════════════════════════════
const BACK_G_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#F5EDD8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:0;}
body::before{content:'';position:fixed;inset:14px;border:1px solid rgba(192,155,60,.3);pointer-events:none;z-index:5;}
body::after{content:'';position:fixed;inset:27px;border:1px solid rgba(192,155,60,.12);pointer-events:none;z-index:5;}
.frame-top,.frame-bot{position:fixed;left:0;right:0;height:14px;background:${STAR_G} 0 0/14px 14px;pointer-events:none;z-index:6;}
.frame-top{top:0;border-bottom:1px solid rgba(192,155,60,.22);}
.frame-bot{bottom:0;border-top:1px solid rgba(192,155,60,.22);}
.book{width:min(490px,92vw);position:relative;z-index:1;}
.book img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3% 24px 8%;text-align:center;}
.orn{font-family:'Scheherazade New',serif;font-size:1rem;color:rgba(138,95,10,.5);margin:4px 0;}
.ttl{font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.2em;color:#8a5800;margin-bottom:3px;font-weight:600;}
.ttl-ar{font-family:'Scheherazade New',serif;font-size:1.4rem;color:#8a5800;direction:rtl;}
.rule{width:70%;height:1px;margin:6px auto;background:linear-gradient(to right,transparent,rgba(192,155,60,.6),transparent);}
.pl{font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.18em;color:rgba(138,95,10,.58);margin-bottom:6px;hyphens:none;-webkit-hyphens:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.1rem;color:rgba(138,95,10,.9);direction:rtl;text-align:center;line-height:1.72;hyphens:none;-webkit-hyphens:none;}
.dua{font-style:italic;font-size:.76rem;color:rgba(138,95,10,.76);text-align:center;line-height:1.68;margin-top:7px;hyphens:none;-webkit-hyphens:none;}
.btn-wrap{text-align:center;position:relative;z-index:1;}
.btn{display:inline-block;padding:11px 50px;border:1px solid rgba(138,95,10,.5);background:transparent;color:#8a5800;text-decoration:none;font-family:'Cinzel',serif;font-size:.65rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;transition:all .22s;}
.btn:hover{background:rgba(192,155,60,.08);border-color:#8a5800;}`;

// ═══════════════════════════════════════════════════════════════════════════
//  BACK-COVER innere (nur Bild, kein Overlay)
// ═══════════════════════════════════════════════════════════════════════════
const BACK_INNER_G_CSS = `*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#F5EDD8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:14px;background:${STAR_G} 0 0/14px 14px;border-bottom:1px solid rgba(192,155,60,.22);z-index:5;pointer-events:none;}
body::after{content:'';position:fixed;bottom:0;left:0;right:0;height:14px;background:${STAR_G} 0 0/14px 14px;border-top:1px solid rgba(192,155,60,.22);z-index:5;pointer-events:none;}
a.bc{display:block;width:min(490px,92vw);position:relative;z-index:1;}
a.bc img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5% 24px 4%;text-align:center;pointer-events:none;}
.rule{width:70%;height:1px;margin:6px auto;background:linear-gradient(to right,transparent,rgba(138,95,10,.5),transparent);}
.pl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.18em;color:rgba(138,95,10,.6);margin-bottom:6px;hyphens:none;-webkit-hyphens:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1.06rem;color:rgba(138,95,10,.88);direction:rtl;text-align:center;line-height:1.72;hyphens:none;-webkit-hyphens:none;}
.dua{font-style:italic;font-size:.74rem;color:rgba(138,95,10,.72);text-align:center;line-height:1.65;margin-top:7px;hyphens:none;-webkit-hyphens:none;}
.nav-b{position:fixed;top:14px;left:18px;padding:8px 22px;border:none;background:transparent;color:#8a5800;text-decoration:none;font-family:'Cinzel',serif;font-size:.6rem;font-weight:600;letter-spacing:.2em;transition:all .22s;z-index:10;}
.nav-b:hover{color:#5a3400;}`;

const BACK_INNER_Q_CSS = `*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100vh;overflow:hidden;background:#1e3d22;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0;}
body::before{content:'';position:fixed;top:0;left:0;right:0;height:14px;background:#163020 ${STAR_Q} 0 0/14px 14px;border-bottom:1px solid rgba(192,155,60,.28);z-index:5;pointer-events:none;}
body::after{content:'';position:fixed;bottom:0;left:0;right:0;height:14px;background:#163020 ${STAR_Q} 0 0/14px 14px;border-top:1px solid rgba(192,155,60,.28);z-index:5;pointer-events:none;}
a.bc{display:block;width:min(490px,92vw);position:relative;z-index:1;}
a.bc img{width:100%;height:auto;display:block;box-shadow:none;}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5% 26% 4%;text-align:center;pointer-events:none;}
.rule{width:70%;height:1px;margin:6px auto;background:linear-gradient(to right,transparent,#c9a84c,transparent);}
.pl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.18em;color:rgba(201,168,76,.65);margin-bottom:6px;hyphens:none;-webkit-hyphens:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:1rem;color:rgba(201,168,76,.92);direction:rtl;text-align:center;line-height:1.72;hyphens:none;-webkit-hyphens:none;}
.dua{font-style:italic;font-size:.74rem;color:rgba(201,168,76,.82);text-align:center;line-height:1.65;margin-top:7px;hyphens:none;-webkit-hyphens:none;}
.nav-b{display:none;}`;

const INNER_OVERLAY_Q = `
  <div class="overlay">
    <div class="pl">سورة الفاتحة · Al-Fatiha · Die Öffnende</div>
    <div class="ar">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ<br>ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوۡمِ ٱلدِّينِ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ<br>ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ<br>صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ</div>
    <div class="rule"></div>
    <div class="dua">Möge Allah uns allen den geraden Weg weisen<br>und uns mit Seiner Barmherzigkeit umhüllen. Ameen.</div>
  </div>`;

const INNER_OVERLAY_G_1 = `
  <div class="overlay">
    <div class="pl">سورة الفاتحة · Al-Fatiha · Die Öffnende</div>
    <div class="ar">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ<br>ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوۡمِ ٱلدِّينِ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ<br>ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ<br>صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ</div>
    <div class="rule"></div>
    <div class="dua">Möge Allah Meliha mit Seiner Barmherzigkeit umhüllen<br>und ihr den geraden Weg weisen. Ameen.</div>
  </div>`;

const INNER_OVERLAY_G_2 = `
  <div class="overlay">
    <div class="pl">سورة الفاتحة · Al-Fatiha · Die Öffnende</div>
    <div class="ar">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ<br>ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ مَٰلِكِ يَوۡمِ ٱلدِّينِ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ<br>ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ<br>صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ</div>
    <div class="rule"></div>
    <div class="dua">Möge Allah Karim mit Seiner Barmherzigkeit umhüllen<br>und ihm den geraden Weg weisen. Ameen.</div>
  </div>`;

// ═══════════════════════════════════════════════════════════════════════════
//  GESCHENKE – SUREN (kein Gitter im body)
// ═══════════════════════════════════════════════════════════════════════════
const G_SURA_TAIL = `@media(max-width:600px){.ar{font-size:2.1rem}.sh-name{font-size:3.2rem}.bn{font-size:.88rem;padding:13px 12px}.bn-c{min-width:90px;padding:10px 14px}.verses{width:96vw;padding:16px 12px 40px}}

body{background:${COL_G},#F5F0E3;color:#1A0A02;}
body::before{content:'\uFDF2';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Amiri Quran','Scheherazade New',serif;font-size:22rem;color:rgba(192,155,60,.04);direction:rtl;pointer-events:none;z-index:0;line-height:1;}
body::after{content:none;display:none;}
.sh{background:#F5EDD8;border-bottom:2px solid rgba(192,155,60,.24);text-align:center;position:relative;z-index:10;flex-shrink:0;padding:0;}
.sh::before,.sh::after{content:'';display:block;height:10px;width:100%;background:${STAR_G} 0 0/14px 14px;}
.sh::before{border-bottom:1px solid rgba(192,155,60,.2);}
.sh::after{border-top:1px solid rgba(192,155,60,.2);}
.sh-in{padding:22px 24px 18px;text-align:center;position:relative;z-index:2;}
.sh-rub{font-family:'Scheherazade New',serif;font-size:1.6rem;color:rgba(192,155,60,.5);direction:rtl;display:block;margin-bottom:6px;}
.sh-in::before{content:none;display:none;}
.sh-crtt{display:inline-block;position:relative;padding:12px 52px;}
.sh-crtt::before{content:'';position:absolute;inset:0;border:1px solid rgba(192,155,60,.42);background:rgba(192,155,60,.03);}
.sh-crtt::after{content:'';position:absolute;inset:5px;border:1px solid rgba(192,155,60,.14);}
.sh-name{font-family:'Scheherazade New',serif;font-size:4.8rem;color:#8a5800;direction:rtl;line-height:1.2;display:block;position:relative;z-index:3;}
.sh-meta{font-family:'Scheherazade New',serif;font-size:.85rem;color:rgba(26,10,2,.38);display:block;margin-top:20px;}
.bismi-area{display:none;}
.page-wrap{flex:1;min-height:0;background:transparent;display:flex;flex-direction:column;align-items:center;overflow-y:auto;position:relative;z-index:1;}
.verses{width:min(860px,72vw);padding:32px 28px 60px;box-sizing:border-box;scrollbar-width:none;}
.verses::-webkit-scrollbar{display:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:3.4rem;line-height:2.8;color:#8a5800;direction:rtl;text-align:center;hyphens:none;-webkit-hyphens:none;}
.tr{font-family:'Noto Serif',Georgia,serif;font-size:1rem;line-height:1.92;color:rgba(26,10,2,.82);direction:ltr;text-align:left;hyphens:none;-webkit-hyphens:none;padding:10px 22px;border-left:2px solid rgba(192,155,60,.26);margin-top:14px;}
.verse{padding:28px 0 22px;border-bottom:1px solid rgba(192,155,60,.13);}
.verse:last-child{border-bottom:none;}
.vd{display:flex;align-items:center;justify-content:center;margin:30px 0 24px;user-select:none;}
.vd::before,.vd::after{content:'';flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(192,155,60,.22));}
.vd::after{background:linear-gradient(to left,transparent,rgba(192,155,60,.22));}
.vd span{font-family:'Scheherazade New',serif;font-size:.7rem;color:rgba(192,155,60,.5);margin:0 12px;}
.bot-nav{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.2);display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;min-height:60px;position:relative;z-index:10;}
.bn{padding:14px 22px;color:rgba(138,95,10,.68);text-decoration:none;font-family:'Scheherazade New',serif;font-size:1.05rem;display:flex;align-items:center;gap:8px;transition:color .2s,background .2s;overflow:hidden;hyphens:none;-webkit-hyphens:none;}
.bn:hover{color:#8a5800;background:rgba(192,155,60,.06);}
.bn-p{justify-content:flex-end;border-right:1px solid rgba(192,155,60,.15);padding-right:24px;}
.bn-n{justify-content:flex-start;border-left:1px solid rgba(192,155,60,.15);padding-left:24px;}
.bn-ghost{display:block;}
.bn-c{padding:12px 24px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s;min-width:130px;}
.bn-c:hover{background:rgba(192,155,60,.06);}
.bn-ix{font:.56rem sans-serif;color:rgba(192,155,60,.55);letter-spacing:.22em;text-transform:uppercase;}
@media(max-width:700px){body{background:#F5EDD8;}.verses{width:96vw;padding:16px 10px 48px;}.ar{font-size:2.2rem;}.sh-name{font-size:3rem;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  GESCHENKE – INDEX (Zahlen dunkel, nur Arabisch gold)
// ═══════════════════════════════════════════════════════════════════════════
const G_INDEX_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_G},#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;}
body::before{content:'\uFDF2';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Amiri Quran','Scheherazade New',serif;font-size:22rem;color:rgba(192,155,60,.04);direction:rtl;pointer-events:none;z-index:0;line-height:1;}
nav{background:#F5EDD8;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:1px solid rgba(192,155,60,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(138,95,10,.62);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:#8a5800;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1.1rem;color:rgba(192,155,60,.38);}
nav .sp{flex:1;}
.list{flex:1;min-height:0;background:transparent;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{flex:1;min-height:0;overflow-y:auto;width:min(900px,74vw);padding:20px 0 32px;scrollbar-width:none;}
.list-rows::-webkit-scrollbar{display:none;}
.row{display:flex;align-items:center;gap:16px;padding:14px 12px;border-bottom:1px solid rgba(192,155,60,.14);text-decoration:none;color:#1A0A02;transition:background .18s;}
.row:first-child{border-top:1px solid rgba(192,155,60,.14);}
.row:hover{background:rgba(192,155,60,.06);}
.rn{font:.7rem sans-serif;color:rgba(26,10,2,.5);min-width:28px;font-variant-numeric:tabular-nums;}
.ra{font-family:'Amiri Quran','Scheherazade New',serif;font-size:2.1rem;color:#8a5800;min-width:96px;text-align:right;direction:rtl;}
.ri{flex:1;}
.rs{display:block;font-size:1rem;color:rgba(26,10,2,.85);hyphens:none;-webkit-hyphens:none;}
.rt{display:block;font-size:.84rem;color:rgba(26,10,2,.5);margin-top:3px;hyphens:none;-webkit-hyphens:none;}
.rv{font:.6rem sans-serif;color:rgba(26,10,2,.3);min-width:24px;text-align:right;}
footer{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.18);z-index:10;position:relative;}
.ft-geo{height:13px;background:${STAR_G} 0 0/14px 13px;border-bottom:1px solid rgba(192,155,60,.13);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.28);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.7rem sans-serif;color:rgba(192,155,60,.5);text-align:center;padding:6px 20px;letter-spacing:.08em;font-weight:600;}
@media(max-width:700px){body{background:#F5F0E3;}.list-rows{width:96vw;padding:16px 8px 32px;}.ra{font-size:1.5rem;min-width:56px;}.rs{font-size:.9rem;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  GESCHENKE – INTRO (mit Rahmen um Inhalt + ﷲ über Überschrift)
// ═══════════════════════════════════════════════════════════════════════════
const G_INTRO_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_G},#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;}
nav{background:#F5EDD8;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:1px solid rgba(192,155,60,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(138,95,10,.62);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:#8a5800;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1.1rem;color:rgba(192,155,60,.38);}
nav .sp{flex:1;}
main{flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:32px 0 40px;}
.intro-c{width:min(820px,70vw);padding:36px 7% 40px;position:relative;border:1px solid rgba(192,155,60,.36);background:rgba(253,248,238,.72);display:flex;flex-direction:column;}
.intro-c::before{content:'';position:absolute;inset:6px;border:1px solid rgba(192,155,60,.16);pointer-events:none;}
.intro-c>*{position:relative;z-index:1;}
h2{font-size:1.1rem;font-weight:700;color:#3a1e00;padding-bottom:12px;margin-bottom:1.5em;border-bottom:1px solid rgba(192,155,60,.2);hyphens:none;-webkit-hyphens:none;order:-2;}
h2::before{content:'\uFDF2';display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New',serif;font-size:2.2rem;color:rgba(192,155,60,.38);direction:rtl;margin-bottom:10px;font-weight:400;}
p{font-size:1rem;font-weight:400;line-height:2;color:rgba(26,10,2,.86);margin:1.1em 0;hyphens:none;-webkit-hyphens:none;}
.bismi-box{order:-1;margin:0 0 32px;border:1px solid rgba(192,155,60,.36);background:rgba(253,248,236,.9);position:relative;}
.bismi-box::before{content:'';position:absolute;inset:5px;border:1px solid rgba(192,155,60,.15);pointer-events:none;}
.bismi-in{border:none;margin:0;padding:0;position:relative;z-index:1;}
.bismi-geo{height:13px;background:${STAR_G} 0 0/14px 13px;border-bottom:1px solid rgba(192,155,60,.14);}
.bismi-geo-b{height:13px;background:${STAR_G} 0 0/14px 13px;border-top:1px solid rgba(192,155,60,.14);}
.bismi-txt{display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New',serif;font-size:2rem;color:#8a5800;direction:rtl;line-height:1.7;padding:20px 14px 8px;}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.85rem;color:rgba(90,58,5,.6);padding:10px 14px 24px;font-style:italic;hyphens:none;-webkit-hyphens:none;}
.cta{text-align:center;margin-top:28px;}
.cta a{display:inline-flex;align-items:center;gap:16px;padding:15px 60px;background:#c9a84c;color:#1A0A02;font:.78rem sans-serif;font-weight:700;letter-spacing:.35em;text-transform:uppercase;text-decoration:none;border:2px solid rgba(138,95,10,.36);transition:all .3s;}
.cta a:hover{background:#ddb83a;letter-spacing:.42em;}
.cta-orn{color:rgba(26,10,2,.55);font-size:1rem;font-family:'Scheherazade New',serif;}
.cta-b{text-align:center;margin-top:14px;}
.cta-b a{display:inline-block;padding:8px 28px;border:1px solid rgba(138,95,10,.3);color:rgba(138,95,10,.62);font:.64rem sans-serif;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:all .2s;}
.cta-b a:hover{border-color:#8a5800;color:#8a5800;background:rgba(192,155,60,.06);}
footer{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.18);z-index:10;position:relative;}
.ft-geo{height:13px;background:${STAR_G} 0 0/14px 13px;border-bottom:1px solid rgba(192,155,60,.13);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.28);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.7rem sans-serif;color:rgba(192,155,60,.5);text-align:center;padding:6px 20px;letter-spacing:.08em;font-weight:600;}
@media(max-width:700px){body{background:#F5F0E3;}.intro-c{width:96vw;padding:24px 4% 32px;}.bismi-txt{font-size:1.6rem;}.cta a{padding:13px 28px;letter-spacing:.2em;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  AL-QURAN – SUREN (kein Gitter)
// ═══════════════════════════════════════════════════════════════════════════
const Q_SURA_TAIL = `@media(max-width:600px){.ar{font-size:2.1rem}.sh-name{font-size:3.2rem}.bn{font-size:.88rem;padding:13px 12px}.bn-c{min-width:90px;padding:10px 14px}.verses{width:96vw;padding:16px 12px 40px}}

body{background:${COL_Q},#1e3d22;}
body::before{content:'\uFDF2';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Amiri Quran','Scheherazade New',serif;font-size:22rem;color:rgba(192,155,60,.05);direction:rtl;pointer-events:none;z-index:0;line-height:1;}
body::after{content:none;display:none;}
nav{background:#163020!important;border-bottom:2px solid rgba(138,95,10,.2)!important;}
nav a{color:rgba(192,155,60,.65);}
nav a:hover{color:#c9a84c;}
nav .orn{color:rgba(192,155,60,.55);font-family:'Scheherazade New',serif;}
.sh-g1,.sh-g2{display:none!important;}
.sh{background:#163020!important;border-bottom:2px solid rgba(138,95,10,.28);text-align:center;position:relative;z-index:10;flex-shrink:0;padding:0;}
.sh::before,.sh::after{content:'';display:block;height:10px;width:100%;background:${STAR_Q} 0 0/14px 14px;position:relative;z-index:3;}
.sh::before{border-bottom:1px solid rgba(138,95,10,.34);}
.sh::after{border-top:1px solid rgba(138,95,10,.34);}
.sh-in{padding:24px 24px 20px;position:relative;z-index:2;text-align:center;}
.sh-rub{font-family:'Scheherazade New',serif;font-size:1.6rem;color:rgba(192,155,60,.55);direction:rtl;display:block;margin-bottom:6px;}
.sh-in::before{content:none;display:none;}
.sh-crtt{display:inline-block;position:relative;padding:14px 52px;margin:0 auto;}
.sh-crtt::before{content:'';position:absolute;inset:0;border:1.5px solid rgba(192,155,60,.52);background:rgba(192,155,60,.03);}
.sh-crtt::after{content:'';position:absolute;inset:6px;border:1px solid rgba(192,155,60,.16);}
.sh-name{font-family:'Scheherazade New',serif;font-size:4.8rem;color:#c9a84c;direction:rtl;line-height:1.2;display:block;position:relative;z-index:3;}
.sh-meta{font-family:'Scheherazade New',serif;font-size:.85rem;color:rgba(192,155,60,.46);display:block;margin-top:20px;}
.bismi-area{display:none;}
.page-wrap{flex:1;min-height:0;background:transparent;display:flex;flex-direction:column;align-items:center;overflow-y:auto;position:relative;z-index:1;}
.verses{width:min(860px,72vw);padding:32px 28px 60px;box-sizing:border-box;scrollbar-width:none;}
.verses::-webkit-scrollbar{display:none;}
.ar{font-family:'Amiri Quran','Scheherazade New',serif;font-size:3.4rem;line-height:2.8;color:#c9a84c;direction:rtl;text-align:center;hyphens:none;-webkit-hyphens:none;}
.tr{font-family:'Noto Serif',Georgia,serif;font-size:1rem;line-height:1.92;color:rgba(240,230,190,.88);direction:ltr;text-align:left;hyphens:none;-webkit-hyphens:none;padding:10px 22px;border-left:2px solid rgba(138,95,10,.24);margin-top:14px;}
.verse{padding:28px 0 22px;border-bottom:1px solid rgba(192,155,60,.09);}
.verse:last-child{border-bottom:none;}
.vd{display:flex;align-items:center;justify-content:center;margin:30px 0 24px;user-select:none;}
.vd::before,.vd::after{content:'';flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(192,155,60,.18));}
.vd::after{background:linear-gradient(to left,transparent,rgba(192,155,60,.18));}
.vd span{font-family:'Scheherazade New',serif;font-size:.7rem;color:rgba(192,155,60,.42);margin:0 12px;}
.bot-nav{flex-shrink:0;background:#163020;border-top:2px solid rgba(138,95,10,.2);display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;min-height:64px;position:relative;z-index:10;}
.bn{padding:16px 22px;color:rgba(192,155,60,.68);text-decoration:none;font-family:'Scheherazade New',serif;font-size:1.05rem;display:flex;align-items:center;gap:8px;transition:color .25s,background .25s;overflow:hidden;hyphens:none;-webkit-hyphens:none;}
.bn:hover{color:#c9a84c;background:rgba(138,95,10,.09);}
.bn-p{justify-content:flex-end;border-right:1px solid rgba(138,95,10,.16);padding-right:28px;}
.bn-n{justify-content:flex-start;border-left:1px solid rgba(138,95,10,.16);padding-left:28px;}
.bn-ghost{display:block;background:#163020;}
.bn-c{padding:14px 28px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .25s;border-left:1px solid rgba(138,95,10,.16);border-right:1px solid rgba(138,95,10,.16);min-width:130px;}
.bn-c:hover{background:rgba(138,95,10,.09);}
.bn-ix{font:.56rem sans-serif;color:rgba(192,155,60,.55);letter-spacing:.22em;text-transform:uppercase;}
@media(max-width:700px){body{background:#1e3d22;}.verses{width:96vw;padding:16px 10px 48px;}.ar{font-size:2.2rem;}.sh-name{font-size:3rem;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  AL-QURAN – INDEX (Zahlen gedeckt, nur Arabisch gold)
// ═══════════════════════════════════════════════════════════════════════════
const Q_INDEX_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_Q},#1e3d22;color:#f0e6c0;font-family:'Noto Serif',serif;}
body::before{content:'\uFDF2';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Amiri Quran','Scheherazade New',serif;font-size:22rem;color:rgba(192,155,60,.05);direction:rtl;pointer-events:none;z-index:0;line-height:1;}
nav{background:#163020;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(138,95,10,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.65);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:#c9a84c;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1.1rem;color:rgba(192,155,60,.55);}
nav .sp{flex:1;}
.list{flex:1;min-height:0;background:transparent;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{flex:1;min-height:0;overflow-y:auto;width:min(900px,74vw);padding:20px 0 32px;scrollbar-width:none;}
.list-rows::-webkit-scrollbar{display:none;}
.row{display:flex;align-items:center;gap:16px;padding:14px 12px;border-bottom:1px solid rgba(138,95,10,.11);text-decoration:none;color:#f0e6c0;transition:background .18s;}
.row:first-child{border-top:1px solid rgba(138,95,10,.11);}
.row:hover{background:rgba(138,95,10,.07);}
.rn{font:.7rem sans-serif;color:rgba(240,230,192,.32);min-width:28px;font-variant-numeric:tabular-nums;}
.ra{font-family:'Amiri Quran','Scheherazade New',serif;font-size:2.1rem;color:#c9a84c;min-width:96px;text-align:right;direction:rtl;}
.ri{flex:1;}
.rs{display:block;font-size:1rem;color:rgba(240,230,192,.88);hyphens:none;-webkit-hyphens:none;}
.rt{display:block;font-size:.84rem;color:rgba(240,230,192,.48);margin-top:3px;hyphens:none;-webkit-hyphens:none;}
.rv{font:.6rem sans-serif;color:rgba(240,230,192,.22);min-width:24px;text-align:right;}
footer{flex-shrink:0;background:#163020;border-top:2px solid rgba(138,95,10,.14);z-index:10;position:relative;}
.ft-geo{height:13px;background:${STAR_Q} 0 0/14px 13px;border-bottom:1px solid rgba(138,95,10,.14);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.28);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.42rem sans-serif;color:rgba(192,155,60,.14);text-align:center;padding:6px 20px;letter-spacing:.08em;}
@media(max-width:700px){body{background:#1e3d22;}.list-rows{width:96vw;padding:16px 8px 32px;}.ra{font-size:1.5rem;min-width:56px;}.rs{font-size:.9rem;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  AL-QURAN – INTRO (Rahmen + ﷲ über Überschrift)
// ═══════════════════════════════════════════════════════════════════════════
const Q_INTRO_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_Q},#1e3d22;color:#f0e6c0;font-family:'Noto Serif',serif;}
nav{background:#163020;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(138,95,10,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.65);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:#c9a84c;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1.1rem;color:rgba(192,155,60,.55);}
nav .sp{flex:1;}
main{flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:32px 0 40px;}
.intro-c{width:min(820px,70vw);padding:36px 7% 40px;position:relative;border:1px solid rgba(192,155,60,.28);background:rgba(22,48,32,.7);display:flex;flex-direction:column;}
.intro-c::before{content:'';position:absolute;inset:6px;border:1px solid rgba(192,155,60,.12);pointer-events:none;}
.intro-c>*{position:relative;z-index:1;}
h2{font-size:.95rem;font-weight:600;color:#f0e6c0;padding-bottom:12px;margin-bottom:1.5em;border-bottom:1px solid rgba(192,155,60,.18);hyphens:none;-webkit-hyphens:none;order:-2;}
h2::before{content:'\uFDF2';display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New',serif;font-size:2.2rem;color:rgba(192,155,60,.5);direction:rtl;margin-bottom:10px;font-weight:400;}
p{font-size:.84rem;font-weight:400;line-height:1.88;color:rgba(240,230,192,.9);margin:1.1em 0;hyphens:none;-webkit-hyphens:none;}
.bismi-box{order:-1;margin:0 0 32px;border:1px solid rgba(138,95,10,.3);background:#dfd3a8;position:relative;}
.bismi-box::before{content:'';position:absolute;inset:5px;border:1px solid rgba(138,95,10,.13);pointer-events:none;}
.bismi-in{border:none;margin:0;padding:0;position:relative;z-index:1;}
.bismi-geo{height:13px;background:${STAR_Q} 0 0/14px 13px;border-bottom:1px solid rgba(138,95,10,.13);}
.bismi-geo-b{height:13px;background:${STAR_Q} 0 0/14px 13px;border-top:1px solid rgba(138,95,10,.13);}
.bismi-txt{display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New',serif;font-size:2rem;color:#8a5800;direction:rtl;line-height:1.7;padding:20px 14px 8px;}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.85rem;color:rgba(90,58,5,.7);padding:10px 14px 24px;font-style:italic;hyphens:none;-webkit-hyphens:none;}
.cta{text-align:center;margin-top:28px;}
.cta a{display:inline-flex;align-items:center;gap:16px;padding:15px 60px;background:#c9a84c;color:#1e3d22;font:.78rem sans-serif;font-weight:700;letter-spacing:.35em;text-transform:uppercase;text-decoration:none;border:2px solid rgba(192,155,60,.5);transition:all .3s;}
.cta a:hover{background:#ddb83a;letter-spacing:.42em;}
.cta-orn{color:rgba(192,155,60,.65);font-size:1rem;font-family:'Scheherazade New',serif;}
.cta-b{text-align:center;margin-top:14px;}
.cta-b a{display:inline-block;padding:8px 28px;border:1px solid rgba(192,155,60,.28);color:rgba(192,155,60,.65);font:.64rem sans-serif;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:all .2s;}
.cta-b a:hover{border-color:#c9a84c;color:#c9a84c;background:rgba(192,155,60,.05);}
footer{flex-shrink:0;background:#163020;border-top:2px solid rgba(138,95,10,.14);z-index:10;position:relative;}
.ft-geo{height:13px;background:${STAR_Q} 0 0/14px 13px;border-bottom:1px solid rgba(138,95,10,.14);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.14);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.7rem sans-serif;color:rgba(192,155,60,.5);text-align:center;padding:6px 20px;letter-spacing:.08em;font-weight:600;}
@media(max-width:700px){body{background:#1e3d22;}.intro-c{width:96vw;padding:24px 4% 32px;}.bismi-txt{font-size:1.6rem;}.cta a{padding:13px 28px;letter-spacing:.2em;}}`;

// ═══════════════════════════════════════════════════════════════════════════
//  Helpers
// ═══════════════════════════════════════════════════════════════════════════
function cleanTail(html, tailCSS) {
  return html.replace(/@media\(max-width:600px\)[\s\S]*?<\/style>/, tailCSS + '\n</style>');
}
function replaceStyle(html, newCSS) {
  return html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${newCSS}\n</style>`);
}
function read(fp) { return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null; }
function write(fp, html) { fs.writeFileSync(fp, html, 'utf8'); }

let total = 0;

// ═══════════════════════════════════════════════════════════════════════════
//  1. COVER
// ═══════════════════════════════════════════════════════════════════════════
for (const [fp, css] of [
  ['AL-QURAN/cover.html', COVER_Q_CSS],
  ['Geschenke/Koran-Deutsch-1/cover.html', COVER_G_CSS],
  ['Geschenke/Koran-Deutsch-2/cover.html', COVER_G_CSS],
]) {
  const h = read(fp);
  if (h) { write(fp, replaceStyle(h, css)); total++; }
}

// ═══════════════════════════════════════════════════════════════════════════
//  2. BACK-COVER äußere (mit Overlay + Frame-Divs im HTML)
// ═══════════════════════════════════════════════════════════════════════════
{
  let h = read('AL-QURAN/back-cover.html');
  if (h) {
    h = replaceStyle(h, BACK_Q_CSS);
    h = h.replace(/src="[^"]*"(?=[^>]*alt="R)/, 'src="../Back.png"');
    write('AL-QURAN/back-cover.html', h); total++;
  }
  h = read('Geschenke/Koran-Deutsch-1/back-cover.html');
  if (h) {
    h = replaceStyle(h, BACK_G_CSS);
    h = h.replace(/src="[^"]*"(?=[^>]*alt="R)/, 'src="../../Back%20Geschenke.png"');
    write('Geschenke/Koran-Deutsch-1/back-cover.html', h); total++;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  3. BACK-COVER innere (Overlay mit Gebet)
// ═══════════════════════════════════════════════════════════════════════════
function processInnerBackCover(fp, css, overlayHtml) {
  let h = read(fp);
  if (!h) return 0;
  // Inject Google Fonts link if missing
  if (!h.includes('fonts.googleapis.com')) {
    h = h.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Amiri+Quran&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">\n</head>');
  }
  h = replaceStyle(h, css);
  // Inject overlay into a.bc if not already present
  if (!h.includes('class="overlay"')) {
    h = h.replace(/(<a class="bc"[^>]*>)([\s\S]*?)(<\/a>)/, (m, open, inner, close) => {
      return open + inner.trimEnd() + '\n' + overlayHtml + '\n' + close;
    });
  }
  // Do not add nav-b button (clicking the book image goes to intro.html already)
  write(fp, h);
  return 1;
}

for (const [fp, overlay] of [
  ['Geschenke/Koran-Deutsch-1/Übersetzungen/Deutsch/back-cover.html', INNER_OVERLAY_G_1],
  ['Geschenke/Koran-Deutsch-2/Übersetzungen/Deutsch/back-cover.html', INNER_OVERLAY_G_2],
]) {
  total += processInnerBackCover(fp, BACK_INNER_G_CSS, overlay);
}
const BASE_Q = 'AL-QURAN/Übersetzungen';
for (const lang of fs.readdirSync(BASE_Q).filter(d => fs.statSync(path.join(BASE_Q, d)).isDirectory())) {
  const fp = path.join(BASE_Q, lang, 'back-cover.html');
  total += processInnerBackCover(fp, BACK_INNER_Q_CSS, INNER_OVERLAY_Q);
}
console.log(`✓ Cover + Rückseiten: ${total}`);

// ═══════════════════════════════════════════════════════════════════════════
//  4. SUREN, INDIZES, INTROS
// ═══════════════════════════════════════════════════════════════════════════
function processSuren(dir, tailCSS) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    const fp = path.join(dir, f);
    const orig = fs.readFileSync(fp, 'utf8');
    let updated = cleanTail(orig, tailCSS);
    if (updated === orig) updated = orig.replace('</style>', tailCSS + '\n</style>');
    if (updated !== orig) { fs.writeFileSync(fp, updated, 'utf8'); n++; }
  }
  return n;
}
function processPage(fp, css) {
  const h = read(fp);
  if (!h) return 0;
  const updated = replaceStyle(h, css);
  if (updated !== h) { write(fp, updated); return 1; }
  return 0;
}
function processIntro(fp, css) {
  const h = read(fp);
  if (!h) return 0;
  let updated = replaceStyle(h, css);
  // Remove cta-b div
  updated = updated.replace(/<div class="cta-b">[\s\S]*?<\/div>/g, '');
  // Remove Rückseite nav link (any nav <a> containing "ckseite")
  updated = updated.replace(/<a[^>]*>[^<]*ckseite[^<]*<\/a>/g, '');
  if (updated !== h) { write(fp, updated); return 1; }
  return 0;
}

let st = total;
// Deutsche Suren-Namen (Index .rt und Suren .sh-meta)
const DE_NAMES = {"1":"Die Eröffnende","2":"Die Kuh","3":"Die Familie Imrans","4":"Die Frauen","5":"Der gedeckte Tisch","6":"Das Vieh","7":"Die Höhen","8":"Die Kriegsbeute","9":"Die Reue","10":"Jona","11":"Hud","12":"Josef","13":"Der Donner","14":"Abraham","15":"Der Fels","16":"Die Biene","17":"Die Nachtreise","18":"Die Höhle","19":"Maria","20":"Ta-Ha","21":"Die Propheten","22":"Die Pilgerfahrt","23":"Die Gläubigen","24":"Das Licht","25":"Die Unterscheidung","26":"Die Dichter","27":"Die Ameise","28":"Die Geschichten","29":"Die Spinne","30":"Die Römer","31":"Luqman","32":"Die Niederwerfung","33":"Die Verbündeten","34":"Saba","35":"Der Schöpfer","36":"Ya-Sin","37":"Die Aufgestellten","38":"Sad","39":"Die Scharen","40":"Der Vergebende","41":"Ausführlich erklärt","42":"Die Beratung","43":"Der goldene Schmuck","44":"Der Rauch","45":"Die Knienden","46":"Die Sanddünen","47":"Muhammad","48":"Der Sieg","49":"Die Gemächer","50":"Qaf","51":"Die Verstreuenden","52":"Der Berg","53":"Der Stern","54":"Der Mond","55":"Der Erbarmer","56":"Das Unvermeidliche","57":"Das Eisen","58":"Die Bittende","59":"Die Vertreibung","60":"Die zu Prüfende","61":"Die Reihen","62":"Das Freitagsgebet","63":"Die Heuchler","64":"Das gegenseitige Täuschen","65":"Die Scheidung","66":"Das Verbot","67":"Die Herrschaft","68":"Der Griffel","69":"Das Unweigerliche","70":"Die Aufstiege","71":"Nuh","72":"Die Dschinn","73":"Der Eingehüllte","74":"Der Zugedeckte","75":"Die Auferstehung","76":"Der Mensch","77":"Die Gesandten","78":"Die Nachricht","79":"Die Herausreißenden","80":"Er runzelte die Stirn","81":"Das Verhüllen","82":"Das Aufreißen","83":"Die Betrüger","84":"Das Zerspalten","85":"Die Sternbilder","86":"Der Nachtstern","87":"Der Allerhöchste","88":"Die Überwältigende","89":"Die Morgendämmerung","90":"Die Stadt","91":"Die Sonne","92":"Die Nacht","93":"Der helle Vormittag","94":"Die Weitung","95":"Die Feige","96":"Der Blutklumpen","97":"Die Macht","98":"Der Klare Beweis","99":"Das Erdbeben","100":"Die Rennenden","101":"Das Unheil","102":"Die Wetteifer","103":"Die Zeit","104":"Der Verleumder","105":"Der Elefant","106":"Die Quraisch","107":"Die kleinen Freundlichkeiten","108":"Der Überfluss","109":"Die Ungläubigen","110":"Die Göttliche Hilfe","111":"Die Palmfaser","112":"Der aufrichtige Glaube","113":"Der Tagesanbruch","114":"Die Menschen"};

// .rt in Index-HTML auf Deutsch setzen
function fixIndexTranslations(fp) {
  let h = read(fp);
  if (!h) return 0;
  let changed = false;
  h = h.replace(/<span class="rt">([^<]*)<\/span>/g, (m, txt) => {
    // find which sura this belongs to by looking at .rn just before
    return m; // placeholder – we do it below with full context
  });
  // Better: replace each <span class="rt">...</span> using sura id from .rn
  const rows = [...h.matchAll(/<span class="rn">(\d+)<\/span>[\s\S]*?<span class="rt">([^<]*)<\/span>/g)];
  for (const [full, num, eng] of rows) {
    const de = DE_NAMES[String(parseInt(num))];
    if (de && eng !== de) {
      h = h.replace(`<span class="rt">${eng}</span>`, `<span class="rt">${de}</span>`);
      changed = true;
    }
  }
  if (changed) { write(fp, h); return 1; }
  return 0;
}

// .sh-meta in Suren auf Deutsch setzen (nur Deutsch-Ordner)
function fixSurenMeta(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    const fp = path.join(dir, f);
    let h = fs.readFileSync(fp, 'utf8');
    // Extract sura number from filename
    const m = f.match(/^(\d+)/);
    if (!m) continue;
    const de = DE_NAMES[String(parseInt(m[1]))];
    if (!de) continue;
    // Replace .sh-meta content: "Name · The XYZ" -> "Name · DE_NAME"
    const updated = h.replace(/(<span class="sh-meta">[^·<]*· )([^<]+)(<\/span>)/, `$1${de}$3`);
    if (updated !== h) { fs.writeFileSync(fp, updated, 'utf8'); n++; }
  }
  return n;
}

for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const base = path.join('Geschenke', dir, 'Übersetzungen', 'Deutsch');
  let n = processSuren(path.join(base, 'suren'), G_SURA_TAIL);
  n += processPage(path.join(base, 'index.html'), G_INDEX_CSS);
  n += fixIndexTranslations(path.join(base, 'index.html'));
  n += fixSurenMeta(path.join(base, 'suren'));
  n += processIntro(path.join(base, 'intro.html'), G_INTRO_CSS);
  console.log(`✓ Geschenke ${dir}: ${n}`); total += n;
}
for (const lang of fs.readdirSync(BASE_Q).filter(d => fs.statSync(path.join(BASE_Q, d)).isDirectory())) {
  const lp = path.join(BASE_Q, lang);
  let n = processSuren(path.join(lp, 'suren'), Q_SURA_TAIL);
  n += processPage(path.join(lp, 'index.html'), Q_INDEX_CSS);
  // Only fix index translations for Deutsch folder
  if (lang === 'Deutsch') {
    n += fixIndexTranslations(path.join(lp, 'index.html'));
    n += fixSurenMeta(path.join(lp, 'suren'));
  }
  n += processIntro(path.join(lp, 'intro.html'), Q_INTRO_CSS);
  console.log(`✓ AL-QURAN ${lang}: ${n}`); total += n;
}

console.log(`\n🎉 Gesamt: ${total} Dateien`);

