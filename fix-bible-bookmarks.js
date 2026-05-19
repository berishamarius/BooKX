// fix-bible-bookmarks.js
// Adds bookmark JS to all non-German Bible chapter files
const fs=require('fs');
const path=require('path');

const TOAST={
  french:     '✦ Signet ajouté',
  italian:    '✦ Segnalibro salvato',
  romanian:   '✦ Semn de carte salvat',
  spanish:    '✦ Marcador guardado',
  portuguese: '✦ Marcador salvo',
  dutch:      '✦ Bladwijzer opgeslagen',
  czech:      '✦ Z\u00e1lo\u017eka ulo\u017eena',
  polish:     '✦ Zak\u0142adka zapisana',
  hungarian:  '✦ K\u00f6nyvjel\u017e\u0151 mentve',
  russian:    '✦ \u0417\u0430\u043a\u043b\u0430\u0434\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430',
  ukrainian:  '✦ \u0417\u0430\u043a\u043b\u0430\u0434\u043a\u0430 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043d\u0430',
  swedish:    '✦ Bokm\u00e4rke sparat',
  albanian:   '✦ Faqerojt\u00ebsi i ruajtur',
  croatian:   '✦ Oznaka sa\u010duvana',
  kjv:        '✦ Bookmark saved',
  tagalog:    '✦ Bookmark nai-save'
};

function makeBmScript(toastText){
  return `<script>
(function(){
  var BM_KEY = 'KX_bookmark';
  var toast, toastTimer;
  function showToast(txt) {
    if (!toast) {
      toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(86,24,31,.95);color:#f1d7c8;font-family:sans-serif;font-size:.78rem;letter-spacing:.08em;padding:9px 20px;border-radius:10px;border:1px solid #9c4a44;pointer-events:none;z-index:999;transition:opacity .3s,transform .3s;box-shadow:0 12px 24px rgba(0,0,0,.24)';
      document.body.appendChild(toast);
    }
    toast.textContent = txt;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(6px)'; }, 1800);
  }
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      if (el.matches && el.matches('.verse, .vb')) break;
      el = el.parentElement;
    }
    if (!el || el === document.body) return;
    if (e.target.tagName === 'A') return;
    var id = el.id;
    if (!id) return;
    var data = { url: location.pathname + '#' + id, title: document.title, id: id, ts: Date.now() };
    try { localStorage.setItem(BM_KEY, JSON.stringify(data)); } catch(_){}
    showToast('${toastText}');
  });
})();
</script>`;
}

const LANGS=fs.readdirSync('dist-diebibel').filter(l=>{
  const full='dist-diebibel/'+l;
  return fs.statSync(full).isDirectory() && l!=='german';
});

let total=0, skipped=0;

for(const lang of LANGS){
  const dir='dist-diebibel/'+lang+'/bücher';
  if(!fs.existsSync(dir)) continue;
  const toast=TOAST[lang]||'✦ Bookmark saved';
  const bmScript=makeBmScript(toast);
  const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));
  for(const f of files){
    const fp=path.join(dir,f);
    let html=fs.readFileSync(fp,'utf8');
    if(html.includes('BM_KEY')){
      skipped++;
      continue;
    }
    html=html.replace('</body>',bmScript+'\n</body>');
    fs.writeFileSync(fp,html,'utf8');
    total++;
  }
}
console.log('Bible bookmarks added to',total,'files,',skipped,'already had it');
