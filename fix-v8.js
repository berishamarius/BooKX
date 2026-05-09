const fs = require('fs');
const path = require('path');

// ═══ Echtes islamisches 8-Zacken-Stern SVG als Base64 ═══
function starSVG(fill) {
  // 8-Zacken-Stern: äußerer r=5, innerer r=2, bei 12x12
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">` +
    `<polygon points="6,1 6.8,4.2 9.5,2.5 7.9,5.2 11,6 7.9,6.8 9.5,9.5 6.8,7.9 6,11 5.2,7.9 2.5,9.5 4.1,6.8 1,6 4.1,5.2 2.5,2.5 5.2,4.1" ` +
    `fill="${fill}"/></svg>`
  ).toString('base64');
}

const STAR_G  = `url("data:image/svg+xml;base64,${starSVG('rgba(192,155,60,0.32)') }")`;
const STAR_Q  = `url("data:image/svg+xml;base64,${starSVG('rgba(192,155,60,0.42)')}")`;

// Säulen-Gradient (KEIN Textur-Overlay – sauber)
const COL_G = `linear-gradient(to right,#c9a84c 0,#c9a84c 3px,#ddd5a8 3px,#ddd5a8 180px,transparent 180px,transparent calc(100% - 180px),#ddd5a8 calc(100% - 180px),#ddd5a8 calc(100% - 3px),#c9a84c calc(100% - 3px)) 0 0/100% 100% fixed`;
const COL_Q = `linear-gradient(to right,rgba(192,155,60,.7) 0,rgba(192,155,60,.7) 3px,#0e2614 3px,#0e2614 180px,transparent 180px,transparent calc(100% - 180px),#0e2614 calc(100% - 180px),#0e2614 calc(100% - 3px),rgba(192,155,60,.7) calc(100% - 3px)) 0 0/100% 100% fixed`;

// ════════════════════════════════════════════════════════
//  GESCHENKE – SUREN (tail nach @media)
// ════════════════════════════════════════════════════════
const G_SURA_TAIL = `@media(max-width:600px){.ar{font-size:2.1rem}.sh-name{font-size:3.2rem}.bn{font-size:.88rem;padding:13px 12px}.bn-c{min-width:90px;padding:10px 14px}}

/* ══ Säulen ══ */
body{background:${COL_G},#F5F0E3;color:#1A0A02;}
body::before,body::after{content:none;display:none;}

/* ══ Header ══ */
.sh{background:#F5F0E3;border-bottom:2px solid rgba(192,155,60,.22);text-align:center;position:relative;z-index:10;flex-shrink:0;}
.sh::before,.sh::after{content:'';display:block;height:12px;background:${STAR_G} 0 0/12px 12px;}
.sh::before{border-bottom:1px solid rgba(192,155,60,.2);}
.sh::after{border-top:1px solid rgba(192,155,60,.2);}
.sh-in{padding:20px 24px 18px;text-align:center;position:relative;z-index:2;}
.sh-rub{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:1.2rem;color:rgba(192,155,60,.5);direction:rtl;display:block;margin-bottom:6px;}
.sh-crtt{display:inline-block;position:relative;padding:10px 48px;border:1px solid rgba(192,155,60,.4);background:rgba(192,155,60,.03);}
.sh-name{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:4.6rem;color:#c9a84c;direction:rtl;line-height:1.2;display:block;}
.sh-meta{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:.84rem;color:rgba(26,10,2,.42);display:block;margin-top:10px;}

/* ══ Bismillah ══ */
.bismi-area{display:none;}

/* ══ Inhalt ══ */
.page-wrap{flex:1;min-height:0;background:transparent;display:flex;flex-direction:column;align-items:center;overflow-y:auto;position:relative;z-index:1;}
.verses{width:min(860px,72vw);padding:28px 28px 56px;box-sizing:border-box;scrollbar-width:none;}
.verses::-webkit-scrollbar{display:none;}
.ar{font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:3.4rem;line-height:2.8;color:#8a6010;direction:rtl;text-align:center;hyphens:none;-webkit-hyphens:none;}
.tr{font-family:'Noto Serif',Georgia,serif;font-size:1rem;font-weight:400;line-height:1.9;color:rgba(26,10,2,.85);direction:ltr;text-align:left;hyphens:none;-webkit-hyphens:none;padding:10px 20px;border-left:2px solid rgba(192,155,60,.28);margin-top:14px;}

/* ══ Navigation ══ */
.bot-nav{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.22);display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;min-height:60px;position:relative;z-index:10;}
.bn{padding:14px 22px;color:rgba(192,155,60,.7);text-decoration:none;font-family:'Scheherazade New',serif;font-size:1.05rem;display:flex;align-items:center;gap:8px;transition:color .2s,background .2s;overflow:hidden;hyphens:none;-webkit-hyphens:none;}
.bn:hover{color:#c9a84c;background:rgba(192,155,60,.07);}
.bn-p{justify-content:flex-end;border-right:1px solid rgba(192,155,60,.16);padding-right:24px;}
.bn-n{justify-content:flex-start;border-left:1px solid rgba(192,155,60,.16);padding-left:24px;}
.bn-ghost{display:block;}
.bn-c{padding:12px 24px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s;min-width:130px;}
.bn-c:hover{background:rgba(192,155,60,.07);}
.bn-ix{font:.56rem sans-serif;color:rgba(192,155,60,.45);letter-spacing:.22em;text-transform:uppercase;}`;

// ════════════════════════════════════════════════════════
//  GESCHENKE – INDEX (komplett, kein altes CSS)
// ════════════════════════════════════════════════════════
const G_INDEX_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_G},#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;}
nav{background:#F5EDD8;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:1px solid rgba(192,155,60,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.6);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;}
nav a:hover{color:#c9a84c;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1rem;color:rgba(192,155,60,.38);}
nav .sp{flex:1;}
.list{flex:1;min-height:0;background:transparent;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{flex:1;min-height:0;overflow-y:auto;width:min(900px,74vw);padding:20px 0 32px;scrollbar-width:none;}
.list-rows::-webkit-scrollbar{display:none;}
.row{display:flex;align-items:center;gap:16px;padding:14px 12px;border-bottom:1px solid rgba(192,155,60,.16);text-decoration:none;color:#1A0A02;transition:background .18s;}
.row:first-child{border-top:1px solid rgba(192,155,60,.16);}
.row:hover{background:rgba(192,155,60,.06);}
.rn{font:.7rem sans-serif;color:rgba(192,155,60,.5);min-width:28px;font-variant-numeric:tabular-nums;}
.ra{font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:2rem;color:#c9a84c;min-width:96px;text-align:right;direction:rtl;}
.ri{flex:1;}
.rs{display:block;font-size:1.05rem;color:#1A0A02;hyphens:none;-webkit-hyphens:none;}
.rt{display:block;font-size:.84rem;color:rgba(26,10,2,.62);margin-top:3px;font-weight:400;hyphens:none;-webkit-hyphens:none;}
.rv{font:.6rem sans-serif;color:rgba(192,155,60,.32);min-width:24px;text-align:right;}
footer{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.18);padding:0;position:relative;z-index:10;}
.ft-geo{height:12px;background:${STAR_G} 0 0/12px 12px;border-bottom:1px solid rgba(192,155,60,.14);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.28);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.7rem sans-serif;color:rgba(192,155,60,.5);text-align:center;padding:6px 20px;letter-spacing:.08em;font-weight:600;}`;

// ════════════════════════════════════════════════════════
//  GESCHENKE – INTRO (komplett, kein altes CSS)
// ════════════════════════════════════════════════════════
const G_INTRO_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_G},#F5F0E3;color:#1A0A02;font-family:'Noto Serif',serif;}
nav{background:#F5EDD8;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:1px solid rgba(192,155,60,.2);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.6);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:#c9a84c;}
nav .orn{font-family:'Scheherazade New',serif;font-size:1rem;color:rgba(192,155,60,.38);}
nav .sp{flex:1;}
main{flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.intro-c{width:min(900px,74vw);padding:36px 6% 44px;}
h2{font-size:1.1rem;font-weight:600;color:#1A0A02;padding-bottom:12px;border-bottom:1px solid rgba(192,155,60,.22);margin-bottom:1.4em;hyphens:none;-webkit-hyphens:none;}
p{font-size:.98rem;font-weight:400;line-height:1.95;color:rgba(26,10,2,.85);margin:1em 0;hyphens:none;-webkit-hyphens:none;}
p.own{font-size:.82rem;color:rgba(192,155,60,.55);margin-top:32px;text-align:center;letter-spacing:.05em;}
.bismi-box{margin:44px 0 16px;border:1px solid rgba(192,155,60,.35);background:rgba(192,155,60,.03);position:relative;}
.bismi-box::before{content:'';position:absolute;inset:5px;border:1px solid rgba(192,155,60,.14);pointer-events:none;}
.bismi-in{border:none;margin:0;padding:0;position:relative;z-index:1;}
.bismi-geo{height:12px;background:${STAR_G} 0 0/12px 12px;border-bottom:1px solid rgba(192,155,60,.14);}
.bismi-geo-b{height:12px;background:${STAR_G} 0 0/12px 12px;border-top:1px solid rgba(192,155,60,.14);}
.bismi-txt{display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:1.8rem;color:#c9a84c;direction:rtl;line-height:1.7;padding:18px 14px 8px;}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.82rem;color:rgba(90,58,5,.6);padding:0 14px 18px;font-style:italic;hyphens:none;-webkit-hyphens:none;}
.cta{text-align:center;margin-top:24px;}
.cta a{display:inline-flex;align-items:center;gap:14px;padding:14px 56px;background:#c9a84c;color:#1A0A02;font:.74rem sans-serif;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;border:1.5px solid rgba(192,155,60,.5);transition:all .3s;}
.cta a:hover{background:#ddb83a;letter-spacing:.36em;}
.cta-orn{color:rgba(26,10,2,.4);font-size:.9rem;font-family:'Scheherazade New',serif;}
footer{flex-shrink:0;background:#F5EDD8;border-top:1px solid rgba(192,155,60,.18);padding:0;position:relative;z-index:10;}
.ft-geo{height:12px;background:${STAR_G} 0 0/12px 12px;border-bottom:1px solid rgba(192,155,60,.14);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.28);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.7rem sans-serif;color:rgba(192,155,60,.5);text-align:center;padding:6px 20px;letter-spacing:.08em;font-weight:600;}`;

// ════════════════════════════════════════════════════════
//  AL-QURAN – SUREN (tail nach @media)
// ════════════════════════════════════════════════════════
const Q_SURA_TAIL = `@media(max-width:600px){.ar{font-size:2.1rem}.sh-name{font-size:3.2rem}.bn{font-size:.88rem;padding:13px 12px}.bn-c{min-width:90px;padding:10px 14px}}

/* ══ Säulen ══ */
body{background:${COL_Q},#1a3a1e;}
body::before,body::after{content:none;display:none;}

/* ══ Header ══ */
.sh{background:#1a3a1e;border-bottom:2px solid rgba(130,92,8,.32);text-align:center;position:relative;z-index:10;flex-shrink:0;}
.sh-g1,.sh-g2{height:12px;background:${STAR_Q} 0 0/12px 12px;position:relative;z-index:3;}
.sh-g1{border-bottom:1px solid rgba(130,92,8,.38);}
.sh-g2{border-top:1px solid rgba(130,92,8,.38);}
.sh-in{padding:22px 24px 18px;position:relative;z-index:2;text-align:center;}
.sh-rub{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:1.8rem;color:rgba(192,155,60,.68);direction:rtl;display:block;margin-bottom:12px;}
.sh-crtt{display:inline-block;position:relative;padding:12px 48px;margin:0 auto;}
.sh-crtt::before{content:'';position:absolute;inset:0;border:1.5px solid rgba(192,155,60,.6);background:rgba(192,155,60,.03);}
.sh-crtt::after{content:'';position:absolute;inset:5px;border:0.5px solid rgba(192,155,60,.2);}
.sh-name{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:4.6rem;color:#c9a84c;direction:rtl;line-height:1.2;display:block;position:relative;z-index:3;}
.sh-meta{font-family:'Arabic Typesetting','Scheherazade New',serif;font-size:.84rem;color:rgba(192,155,60,.5);display:block;margin-top:16px;}

/* ══ Bismillah ══ */
.bismi-area{display:none;}

/* ══ Inhalt ══ */
.page-wrap{flex:1;min-height:0;background:transparent;display:flex;flex-direction:column;align-items:center;overflow-y:auto;position:relative;z-index:1;}
.verses{width:min(860px,72vw);padding:28px 28px 60px;box-sizing:border-box;scrollbar-width:none;}
.verses::-webkit-scrollbar{display:none;}
.ar{font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:3.4rem;line-height:2.8;color:#c9a84c;direction:rtl;text-align:center;hyphens:none;-webkit-hyphens:none;}
.tr{font-family:'Noto Serif',Georgia,serif;font-size:1rem;font-weight:400;line-height:1.9;color:rgba(240,230,192,.88);direction:ltr;text-align:left;hyphens:none;-webkit-hyphens:none;padding:10px 20px;border-left:2px solid rgba(130,92,8,.28);margin-top:14px;}

/* ══ Navigation ══ */
.bot-nav{flex-shrink:0;background:#122e16;border-top:2px solid rgba(130,92,8,.25);display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;min-height:64px;position:relative;z-index:10;}
.bn{padding:16px 22px;color:rgba(192,155,60,.55);text-decoration:none;font-family:'Scheherazade New',serif;font-size:1.05rem;display:flex;align-items:center;gap:8px;transition:color .25s,background .25s;overflow:hidden;hyphens:none;-webkit-hyphens:none;}
.bn:hover{color:#c9a84c;background:rgba(130,92,8,.1);}
.bn-p{justify-content:flex-end;border-right:1px solid rgba(130,92,8,.2);padding-right:28px;}
.bn-n{justify-content:flex-start;border-left:1px solid rgba(130,92,8,.2);padding-left:28px;}
.bn-ghost{display:block;background:#122e16;}
.bn-c{padding:14px 28px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .25s;border-left:1px solid rgba(130,92,8,.2);border-right:1px solid rgba(130,92,8,.2);min-width:130px;}
.bn-c:hover{background:rgba(130,92,8,.1);}
.bn-ix{font:.56rem sans-serif;color:rgba(192,155,60,.42);letter-spacing:.22em;text-transform:uppercase;}`;

// ════════════════════════════════════════════════════════
//  AL-QURAN – INDEX (komplett)
// ════════════════════════════════════════════════════════
const Q_INDEX_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_Q},#1a3a1e;color:#f0e6c0;font-family:'Noto Serif',serif;}
nav{background:#122e16;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.25);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.45);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;}
nav a:hover{color:rgba(192,155,60,.95);}
nav .orn{font-family:'Scheherazade New',serif;font-size:1rem;color:rgba(192,155,60,.26);}
nav .sp{flex:1;}
.list{flex:1;min-height:0;background:transparent;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0;}
.list-rows{flex:1;min-height:0;overflow-y:auto;width:min(900px,74vw);padding:20px 0 32px;scrollbar-width:none;}
.list-rows::-webkit-scrollbar{display:none;}
.row{display:flex;align-items:center;gap:16px;padding:14px 12px;border-bottom:1px solid rgba(130,92,8,.14);text-decoration:none;color:#f0e6c0;transition:background .18s;}
.row:first-child{border-top:1px solid rgba(130,92,8,.14);}
.row:hover{background:rgba(130,92,8,.07);}
.rn{font:.7rem sans-serif;color:rgba(130,92,8,.5);min-width:28px;font-variant-numeric:tabular-nums;}
.ra{font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:2rem;color:#c9a84c;min-width:96px;text-align:right;direction:rtl;}
.ri{flex:1;}
.rs{display:block;font-size:1.05rem;color:#e8ddb8;hyphens:none;-webkit-hyphens:none;}
.rt{display:block;font-size:.84rem;color:rgba(232,221,184,.58);margin-top:3px;font-weight:400;hyphens:none;-webkit-hyphens:none;}
.rv{font:.6rem sans-serif;color:rgba(130,92,8,.3);min-width:24px;text-align:right;}
footer{flex-shrink:0;background:#122e16;border-top:2px solid rgba(130,92,8,.18);padding:0;position:relative;z-index:10;}
.ft-geo{height:12px;background:${STAR_Q} 0 0/12px 12px;border-bottom:1px solid rgba(130,92,8,.18);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.18);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.42rem sans-serif;color:rgba(192,155,60,.18);text-align:center;padding:6px 20px;letter-spacing:.08em;}`;

// ════════════════════════════════════════════════════════
//  AL-QURAN – INTRO (komplett)
// ════════════════════════════════════════════════════════
const Q_INTRO_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{min-height:100vh;display:flex;flex-direction:column;background:${COL_Q},#1a3a1e;color:#f0e6c0;font-family:'Noto Serif',serif;}
nav{background:#122e16;height:46px;display:flex;align-items:center;padding:0 24px;gap:12px;border-bottom:2px solid rgba(140,102,14,.25);position:sticky;top:0;z-index:200;flex-shrink:0;}
nav a{color:rgba(192,155,60,.45);text-decoration:none;font:.66rem sans-serif;letter-spacing:.09em;transition:color .2s;hyphens:none;-webkit-hyphens:none;}
nav a:hover{color:rgba(192,155,60,.95);}
nav .orn{font-family:'Scheherazade New',serif;font-size:1rem;color:rgba(192,155,60,.26);}
nav .sp{flex:1;}
main{flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:0;}
.intro-c{width:min(900px,74vw);padding:36px 6% 44px;}
h2{font-size:.92rem;font-weight:600;color:#f0e6c0;padding-bottom:12px;border-bottom:1px solid rgba(192,155,60,.2);margin-bottom:1.4em;hyphens:none;-webkit-hyphens:none;}
p{font-size:.82rem;font-weight:400;line-height:1.85;color:rgba(240,230,192,.9);margin:1em 0;hyphens:none;-webkit-hyphens:none;}
.bismi-box{margin:40px 0 14px;border:1px solid rgba(130,92,8,.28);background:#e8dcc0;position:relative;}
.bismi-box::before{content:'';position:absolute;inset:5px;border:1px solid rgba(130,92,8,.12);pointer-events:none;}
.bismi-in{border:none;margin:0;padding:0;position:relative;z-index:1;}
.bismi-geo{height:12px;background:${STAR_Q} 0 0/12px 12px;border-bottom:1px solid rgba(130,92,8,.15);}
.bismi-geo-b{height:12px;background:${STAR_Q} 0 0/12px 12px;border-top:1px solid rgba(130,92,8,.15);}
.bismi-txt{display:block;text-align:center;font-family:'Amiri Quran','Scheherazade New','Arabic Typesetting','Traditional Arabic',serif;font-size:1.8rem;color:#c9a84c;direction:rtl;line-height:1.7;padding:18px 14px 8px;}
.bismi-tr{display:block;text-align:center;font-family:'Noto Serif',serif;font-size:.82rem;color:rgba(90,58,5,.65);padding:0 14px 18px;font-style:italic;hyphens:none;-webkit-hyphens:none;}
.cta{text-align:center;margin-top:16px;}
.cta a{display:inline-flex;align-items:center;gap:14px;padding:14px 56px;background:#122e16;color:#c9a84c;font:.74rem sans-serif;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;border:1.5px solid rgba(130,92,8,.44);transition:all .3s;}
.cta a:hover{background:#1a3e1e;border-color:#c9a84c;letter-spacing:.36em;}
.cta-orn{color:rgba(192,155,60,.38);font-size:.9rem;font-family:'Scheherazade New',serif;}
footer{flex-shrink:0;background:#122e16;border-top:2px solid rgba(130,92,8,.18);padding:0;position:relative;z-index:10;}
.ft-geo{height:12px;background:${STAR_Q} 0 0/12px 12px;border-bottom:1px solid rgba(130,92,8,.18);}
.ft-in{padding:10px 22px;text-align:center;}
.ft-note{font:.48rem sans-serif;color:rgba(192,155,60,.16);font-style:italic;display:block;margin-bottom:4px;}
.kx-copy{font:.42rem sans-serif;color:rgba(192,155,60,.14);text-align:center;padding:6px 20px;letter-spacing:.08em;}`;

// ════════════════════════════════════════════════════════
//  Hilfsfunktionen
// ════════════════════════════════════════════════════════

function cleanTail(html, tailCSS) {
  return html.replace(/@media\(max-width:600px\)[\s\S]*?<\/style>/, tailCSS + '\n</style>');
}

function replaceStyle(html, newCSS) {
  return html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${newCSS}\n</style>`);
}

let total = 0;

function processSuren(dir, tailCSS) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
    const fp = path.join(dir, f);
    const orig = fs.readFileSync(fp, 'utf8');
    const updated = cleanTail(orig, tailCSS);
    if (updated !== orig) { fs.writeFileSync(fp, updated, 'utf8'); n++; }
  }
  return n;
}

function processPage(fp, newCSS) {
  if (!fs.existsSync(fp)) return 0;
  const orig = fs.readFileSync(fp, 'utf8');
  const updated = replaceStyle(orig, newCSS);
  if (updated !== orig) { fs.writeFileSync(fp, updated, 'utf8'); return 1; }
  return 0;
}

// ════════════════════════════════════════════════════════
//  GESCHENKE
// ════════════════════════════════════════════════════════
for (const dir of ['Koran-Deutsch-1', 'Koran-Deutsch-2']) {
  const base = path.join(__dirname, 'Geschenke', dir, 'Übersetzungen', 'Deutsch');
  let n = 0;
  n += processSuren(path.join(base, 'suren'), G_SURA_TAIL);
  n += processPage(path.join(base, 'index.html'), G_INDEX_CSS);
  n += processPage(path.join(base, 'intro.html'), G_INTRO_CSS);
  console.log(`✓ Geschenke ${dir}: ${n}`);
  total += n;
}

// ════════════════════════════════════════════════════════
//  AL-QURAN
// ════════════════════════════════════════════════════════
const BASE_Q = path.join(__dirname, 'AL-QURAN', 'Übersetzungen');
for (const lang of fs.readdirSync(BASE_Q).filter(d => fs.statSync(path.join(BASE_Q, d)).isDirectory())) {
  const lp = path.join(BASE_Q, lang);
  let n = 0;
  n += processSuren(path.join(lp, 'suren'), Q_SURA_TAIL);
  n += processPage(path.join(lp, 'index.html'), Q_INDEX_CSS);
  n += processPage(path.join(lp, 'intro.html'), Q_INTRO_CSS);
  console.log(`✓ AL-QURAN ${lang}: ${n}`);
  total += n;
}

// ════════════════════════════════════════════════════════
//  RÜCKSEITEN – Hintergrundfarbe reparieren
// ════════════════════════════════════════════════════════
function fixBackCover(fp, oldBg, newBg) {
  if (!fs.existsSync(fp)) return 0;
  const orig = fs.readFileSync(fp, 'utf8');
  const updated = orig.replace(new RegExp(oldBg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newBg);
  if (updated !== orig) { fs.writeFileSync(fp, updated, 'utf8'); return 1; }
  return 0;
}

// AL-QURAN: fast schwarz → dunkelgrün
let r = 0;
r += fixBackCover(path.join(__dirname, 'AL-QURAN', 'back-cover.html'), '#060e08', '#1a3a1e');
// Geschenke K1: lila → warmes beige
r += fixBackCover(path.join(__dirname, 'Geschenke', 'Koran-Deutsch-1', 'back-cover.html'), '#410a9e', '#F5EDD8');
r += fixBackCover(path.join(__dirname, 'Geschenke', 'Koran-Deutsch-1', 'back-cover.html'), '#2d1060', '#1A0A02');
// Geschenke K2: schwarz → warmes beige
r += fixBackCover(path.join(__dirname, 'Geschenke', 'Koran-Deutsch-2', 'back-cover.html'), '#000', '#F5EDD8');
// Auch für Koran-Deutsch-2 Unterordner
r += fixBackCover(path.join(__dirname, 'Geschenke', 'Koran-Deutsch-2', 'Übersetzungen', 'Deutsch', 'back-cover.html'), '#000', '#F5EDD8');

console.log(`✓ Rückseiten: ${r}`);
total += r;

console.log(`\n🎉 Total: ${total} Dateien`);
