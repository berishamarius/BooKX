// fix-cover-bookmarks.js
// Adds bookmark reading-mode overlay to all Bible and Quran language covers
const fs=require('fs');
const path=require('path');

// Bible language → continue button text
const BIBLE_BTN={
  german:     'WEITERLESEN',
  french:     'CONTINUER',
  italian:    'CONTINUA',
  romanian:   'CONTINU\u0102',
  spanish:    'CONTINUAR',
  portuguese: 'CONTINUAR',
  dutch:      'DOORGAAN',
  czech:      'POKRA\u010cOVAT',
  polish:     'CZYTAJ DALEJ',
  hungarian:  'TOV\u00c1BB',
  russian:    '\u041f\u0420\u041e\u0414\u041e\u041b\u0416\u0418\u0422\u042c',
  ukrainian:  '\u041f\u0420\u041e\u0414\u041e\u0412\u0416\u0418\u0422\u0418',
  swedish:    'FORTS\u00c4TT',
  albanian:   'VAZHDO',
  croatian:   'NASTAVI',
  kjv:        'CONTINUE',
  tagalog:    'MAGPATULOY'
};

// Quran language → continue button text
const QURAN_BTN={
  Albanisch:   'VAZHDO',
  Bengalisch:  '\u09aa\u09dc\u09a4\u09c7 \u09a5\u09be\u0995\u09c1\u09a8',
  Bosnisch:    'NASTAVI',
  Chinesisch:  '\u7ee7\u7eed\u9605\u8bfb',
  Deutsch:     'WEITERLESEN',
  Englisch:    'CONTINUE',
  Hausa:       'CIGABA',
  Hindi:       '\u092a\u095d\u0924\u0947 \u0930\u0939\u0947\u0902',
  Indonesisch: 'LANJUTKAN',
  Persisch:    '\u0627\u062f\u0627\u0645\u0647 \u062f\u0647\u06cc\u062f',
  Russisch:    '\u041f\u0420\u041e\u0414\u041e\u041b\u0416\u0418\u0422\u042c',
  Türkisch:    'DEVAM ET',
  Urdu:        '\u062c\u0627\u0631\u06cc \u0631\u06a9\u06be\u06cc\u06ba',
  Uygurisch:   '\u062f\u0627\u06cb\u0627\u0645\u0644\u0627\u0634\u062a\u06c7\u0631\u06c7\u0634'
};

function makeBmScript(langSeg, depthForLang, btnText, bgColor, accentColor, borderColor){
  // depthForLang: 1 for Bible (/italian/cover.html → seg[1])
  //               2 for Quran (/Übersetzungen/Deutsch/cover.html → seg[2])
  return `<script>
(function(){
  var bm;
  try { bm = JSON.parse(localStorage.getItem('KX_bookmark') || 'null'); } catch(_){}
  if (!bm || !bm.url) return;
  // Only show if bookmark belongs to this language
  var seg = location.pathname.split('/');
  var lang = seg[${depthForLang}] || '';
  if (!lang || bm.url.indexOf('/' + lang + '/') < 0) return;
  // Build reading-mode overlay
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:${bgColor};display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;font-family:Cinzel,serif;gap:24px;padding:40px 24px;';
  // Back icon top-left
  var back = document.createElement('button');
  back.textContent = '\u2190';
  back.title = 'Zur\u00fcck';
  back.style.cssText = 'position:absolute;top:18px;left:18px;background:none;border:none;color:${accentColor};font-size:1.6rem;cursor:pointer;opacity:.75;line-height:1;padding:4px 8px;';
  back.addEventListener('click', function(){ ov.remove(); });
  ov.appendChild(back);
  // Decorative ornament
  var orn = document.createElement('div');
  orn.textContent = '\u2756';
  orn.style.cssText = 'color:${accentColor};font-size:1.1rem;opacity:.6;';
  ov.appendChild(orn);
  // Title
  var title = document.createElement('div');
  title.textContent = bm.title || '';
  title.style.cssText = 'color:${accentColor};font-size:clamp(.85rem,3vw,1.1rem);letter-spacing:.1em;text-align:center;max-width:480px;line-height:1.5;';
  ov.appendChild(title);
  // Continue button
  var btn = document.createElement('a');
  btn.href = bm.url;
  btn.textContent = '${btnText}';
  btn.style.cssText = 'display:inline-block;padding:13px 48px;color:${accentColor};text-decoration:none;font-family:Cinzel,serif;font-size:.7rem;letter-spacing:.22em;border:1px solid ${borderColor};background:transparent;transition:opacity .2s;margin-top:8px;';
  btn.addEventListener('mouseenter', function(){ this.style.opacity='.75'; });
  btn.addEventListener('mouseleave', function(){ this.style.opacity='1'; });
  ov.appendChild(btn);
  document.body.appendChild(ov);
})();
</script>`;
}

let totalB=0, totalQ=0;

// Bible covers
const bibleDir='dist-diebibel';
const bibleLangs=fs.readdirSync(bibleDir).filter(l=>{
  return fs.statSync(bibleDir+'/'+l).isDirectory();
});
for(const lang of bibleLangs){
  const fp=bibleDir+'/'+lang+'/cover.html';
  if(!fs.existsSync(fp)) continue;
  let html=fs.readFileSync(fp,'utf8');
  if(html.includes('KX_bookmark')) continue; // already done
  const btnText=BIBLE_BTN[lang]||'CONTINUE';
  const script=makeBmScript(lang,1,btnText,'#2a0810','#EDD882','rgba(200,160,48,.55)');
  html=html.replace('</body>',script+'\n</body>');
  fs.writeFileSync(fp,html,'utf8');
  totalB++;
}

// Quran covers
const quranBase='dist-alquran/Übersetzungen';
const quranLangs=fs.readdirSync(quranBase).filter(l=>{
  return fs.statSync(quranBase+'/'+l).isDirectory();
});
for(const lang of quranLangs){
  const fp=quranBase+'/'+lang+'/cover.html';
  if(!fs.existsSync(fp)) continue;
  let html=fs.readFileSync(fp,'utf8');
  if(html.includes('KX_bookmark')) continue;
  const btnText=QURAN_BTN[lang]||'CONTINUE';
  const script=makeBmScript(lang,2,btnText,'#091a0c','#d4a574','rgba(155,125,92,.6)');
  html=html.replace('</body>',script+'\n</body>');
  fs.writeFileSync(fp,html,'utf8');
  totalQ++;
}

console.log('Cover bookmarks added: Bible',totalB,', Quran',totalQ);
