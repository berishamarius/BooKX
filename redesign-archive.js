// redesign-archive.js — Rewrites root index.html as a proper Archive
// Two sections: Bible (red/cross) + Quran (green/crescent), no branding, no copyright
const fs = require('fs');

const bibleLangs = [
  {folder:'german',     native:'Deutsch',          sub:'Die Heilige Bibel'},
  {folder:'french',     native:'Français',          sub:'La Sainte Bible'},
  {folder:'italian',    native:'Italiano',          sub:'La Sacra Bibbia'},
  {folder:'spanish',    native:'Español',           sub:'La Santa Biblia'},
  {folder:'portuguese', native:'Português',         sub:'A Bíblia Sagrada'},
  {folder:'dutch',      native:'Nederlands',        sub:'De Heilige Bijbel'},
  {folder:'kjv',        native:'English',           sub:'The Holy Bible · KJV'},
  {folder:'czech',      native:'Čeština',           sub:'Biblí Svatá'},
  {folder:'polish',     native:'Polski',            sub:'Biblia Święta'},
  {folder:'hungarian',  native:'Magyar',            sub:'A Biblia'},
  {folder:'russian',    native:'Русский',           sub:'Библия'},
  {folder:'ukrainian',  native:'Українська',        sub:'Біблія'},
  {folder:'swedish',    native:'Svenska',           sub:'Bibeln'},
  {folder:'romanian',   native:'Română',            sub:'Biblia'},
  {folder:'albanian',   native:'Shqip',             sub:'Bibla'},
  {folder:'croatian',   native:'Hrvatski',          sub:'Biblija'},
  {folder:'tagalog',    native:'Tagalog',           sub:'Ang Biblia'},
];

const quranLangs = [
  {folder:'Deutsch',     native:'Deutsch',           rtl:false},
  {folder:'Englisch',    native:'English',           rtl:false},
  {folder:'Indonesisch', native:'Bahasa Indonesia',  rtl:false},
  {folder:'Türkisch',    native:'Türkçe',            rtl:false},
  {folder:'Russisch',    native:'Русский',           rtl:false},
  {folder:'Bosnisch',    native:'Bosanski',          rtl:false},
  {folder:'Albanisch',   native:'Shqip',             rtl:false},
  {folder:'Hausa',       native:'Hausa',             rtl:false},
  {folder:'Chinesisch',  native:'中文',               rtl:false},
  {folder:'Bengalisch',  native:'বাংলা',              rtl:false},
  {folder:'Hindi',       native:'हिन्दी',              rtl:false},
  {folder:'Persisch',    native:'فارسی',              rtl:true},
  {folder:'Urdu',        native:'اردو',               rtl:true},
  {folder:'Uygurisch',   native:'ئۇيغۇرچە',           rtl:true},
];

function bibleTile(lang) {
  return `  <a class="tile" href="/dist-diebibel/${lang.folder}/cover.html" data-blang="${lang.folder}">
    <span class="t-name">${lang.native}</span>
    <span class="t-sub">${lang.sub}</span>
  </a>`;
}

function quranTile(lang) {
  const dir = lang.rtl ? ' dir="rtl"' : '';
  return `  <a class="tile tile-q" href="/dist-alquran/%C3%9Cbersetzungen/${encodeURIComponent(lang.folder)}/cover.html" data-qlang="${lang.folder}"${dir}>
    <span class="t-name">${lang.native}</span>
  </a>`;
}

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Archiv · Heilige Schriften</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#080808;font-family:Cinzel,Georgia,serif;min-height:100vh;}

/* ── Bible Section ── */
.sec-bibel{
  background:linear-gradient(180deg,#110205 0%,#1a0408 60%,#0e0204 100%);
  border-bottom:1px solid rgba(180,40,40,.18);
  padding:64px 32px 80px;
  position:relative;
  overflow:hidden;
}
.sec-bibel::before{
  content:'';
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 0%,rgba(180,20,20,.08) 0%,transparent 70%);
  pointer-events:none;
}

/* ── Quran Section ── */
.sec-quran{
  background:linear-gradient(180deg,#030f05 0%,#051508 60%,#030a04 100%);
  padding:64px 32px 80px;
  position:relative;
  overflow:hidden;
}
.sec-quran::before{
  content:'';
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 0%,rgba(20,120,40,.08) 0%,transparent 70%);
  pointer-events:none;
}

/* ── Section headers ── */
.sec-head{
  text-align:center;
  margin-bottom:48px;
  position:relative;
  z-index:1;
}
.sec-symbol{
  display:block;
  margin:0 auto 20px;
  opacity:.65;
}
.sec-title{
  font-size:clamp(1rem,3vw,1.5rem);
  letter-spacing:.25em;
  font-weight:400;
  text-transform:uppercase;
  margin-bottom:6px;
}
.sec-bibel .sec-title{color:#c8a030;}
.sec-quran .sec-title{color:#a0c870;}
.sec-bibel .sec-title-ar{display:none;}
.sec-count{
  font-size:.58rem;
  letter-spacing:.2em;
  opacity:.4;
  margin-top:4px;
}
.sec-bibel .sec-count{color:#c8a030;}
.sec-quran .sec-count{color:#a0c870;}
.sec-rule{
  width:120px;height:1px;
  margin:20px auto 0;
}
.sec-bibel .sec-rule{background:linear-gradient(to right,transparent,rgba(200,160,48,.4),transparent);}
.sec-quran .sec-rule{background:linear-gradient(to right,transparent,rgba(100,180,60,.4),transparent);}

/* ── Tile grid ── */
.tile-grid{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  justify-content:center;
  max-width:860px;
  margin:0 auto;
  position:relative;
  z-index:1;
}
.tile{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
  padding:18px 24px;
  text-decoration:none;
  border-radius:2px;
  border:1px solid transparent;
  transition:border-color .2s,background .2s,transform .2s;
  min-width:130px;
}
.sec-bibel .tile{
  background:rgba(80,10,14,.35);
  border-color:rgba(200,160,48,.12);
}
.sec-bibel .tile:hover{
  background:rgba(110,14,20,.55);
  border-color:rgba(200,160,48,.4);
  transform:translateY(-3px);
}
.sec-quran .tile{
  background:rgba(8,50,12,.35);
  border-color:rgba(100,180,60,.12);
}
.sec-quran .tile:hover{
  background:rgba(10,70,16,.55);
  border-color:rgba(100,180,60,.4);
  transform:translateY(-3px);
}
.t-name{
  font-size:.72rem;
  letter-spacing:.12em;
  text-transform:uppercase;
}
.sec-bibel .t-name{color:#ddc060;}
.sec-quran .t-name{color:#90d850;}
.t-sub{
  font-size:.48rem;
  letter-spacing:.08em;
  opacity:.4;
  text-align:center;
}
.sec-bibel .t-sub{color:#c8a030;}
.sec-quran .t-sub{color:#80c840;}

/* ── Active bookmark highlight ── */
.tile.has-bookmark{
  border-color:rgba(237,216,130,.55) !important;
  background:rgba(140,100,20,.25) !important;
}
.tile.has-bookmark::after{
  content:'✦';
  font-size:.5rem;
  opacity:.7;
  margin-top:4px;
  display:block;
}
.sec-quran .tile.has-bookmark{
  border-color:rgba(100,210,60,.55) !important;
  background:rgba(20,90,20,.25) !important;
}

@media(max-width:600px){
  .sec-bibel,.sec-quran{padding:48px 20px 64px;}
  .tile{min-width:100px;padding:14px 16px;}
  .t-name{font-size:.65rem;}
}
</style>
</head>
<body>

<!-- ═══════════════ BIBEL ═══════════════ -->
<section class="sec-bibel">
  <div class="sec-head">
    <svg class="sec-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60" width="36" height="54" fill="none" stroke="#c8a030" stroke-width="2.2" stroke-linecap="square">
      <line x1="20" y1="0" x2="20" y2="60"/>
      <line x1="4" y1="18" x2="36" y2="18"/>
    </svg>
    <div class="sec-title">Die Heilige Bibel</div>
    <div class="sec-count">17 SPRACHEN · 73 BÜCHER</div>
    <div class="sec-rule"></div>
  </div>
  <div class="tile-grid" id="bible-grid">
${bibleLangs.map(bibleTile).join('\n')}
  </div>
</section>

<!-- ═══════════════ KORAN ═══════════════ -->
<section class="sec-quran">
  <div class="sec-head">
    <svg class="sec-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="48" height="48" fill="none">
      <!-- Crescent -->
      <path d="M38,10 A22,22 0 1 0 38,50 A16,16 0 1 1 38,10Z" fill="#6ab030" opacity=".7"/>
      <!-- Star -->
      <polygon points="48,30 50.5,37 58,37 52,41.5 54.5,48.5 48,44 41.5,48.5 44,41.5 38,37 45.5,37" fill="#6ab030" opacity=".7"/>
    </svg>
    <div class="sec-title" style="font-family:'Scheherazade New',serif;font-size:clamp(1.1rem,3vw,1.7rem);letter-spacing:.1em;">القرآن الكريم</div>
    <div class="sec-title" style="margin-top:4px;">Al-Quran</div>
    <div class="sec-count">14 SPRACHEN · 114 SUREN</div>
    <div class="sec-rule"></div>
  </div>
  <div class="tile-grid" id="quran-grid">
${quranLangs.map(quranTile).join('\n')}
  </div>
</section>

<script>
(function(){
  var bm=null;
  try{bm=JSON.parse(localStorage.getItem('KX_bookmark')||'null');}catch(e){}
  if(!bm||!bm.url) return;
  var url=bm.url;
  // Highlight matching Bible language tile
  document.querySelectorAll('[data-blang]').forEach(function(el){
    var lang=el.getAttribute('data-blang');
    if(url.indexOf('/dist-diebibel/'+lang+'/')>=0) el.classList.add('has-bookmark');
  });
  // Highlight matching Quran language tile
  document.querySelectorAll('[data-qlang]').forEach(function(el){
    var lang=el.getAttribute('data-qlang');
    if(url.indexOf('/'+encodeURIComponent(lang)+'/')>=0||url.indexOf('/'+lang+'/')>=0)
      el.classList.add('has-bookmark');
  });
})();
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html redesigned as archive');
