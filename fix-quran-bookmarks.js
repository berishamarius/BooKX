// fix-quran-bookmarks.js
// Adds bookmark JS to all non-German Quran sura files
const fs=require('fs');
const path=require('path');

const TOAST={
  Albanisch:     '✦ Faqerojt\u00ebsi u ruajt',
  Bengalisch:    '✦ \u09ac\u09c1\u0995\u09ae\u09be\u09b0\u09cd\u0995 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09bf\u09a4',
  Bosnisch:      '✦ Oznaka sa\u010duvana',
  Chinesisch:    '✦ \u4e66\u7b7e\u5df2\u4fdd\u5b58',
  Englisch:      '✦ Bookmark saved',
  Französisch:   '✦ Signet enregistr\u00e9',
  Hausa:         '✦ Alamar an ajiye',
  Hindi:         '✦ \u092c\u0941\u0915\u092e\u093e\u0930\u094d\u0915 \u0938\u0939\u0947\u091c\u093e',
  Indonesisch:   '✦ Bookmark tersimpan',
  Kasachisch:    '✦ \u0411\u0435\u0442\u0431\u0435\u043b\u0433\u0456 \u0441\u0430\u049b\u0442\u0430\u043b\u0434\u044b',
  Persisch:      '✦ \u0646\u0634\u0627\u0646\u06a9 \u0630\u062e\u06cc\u0631\u0647 \u0634\u062f',
  Russisch:      '✦ \u0417\u0430\u043a\u043b\u0430\u0434\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430',
  Spanisch:      '✦ Marcador guardado',
  Tagalog:       '✦ Bookmark na-save',
  Thailändisch:  '✦ \u0e1a\u0e38\u0e4a\u0e01\u0e21\u0e32\u0e23\u0e4c\u0e01\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27',
  Türkisch:      '✦ Yer imi kaydedildi',
  Urdu:          '✦ \u0628\u06a9 \u0645\u0627\u0631\u06a9 \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648\u0627',
  Uygurisch:     '✦ \u0628\u06d5\u062a\u0643\u06c8\u0686 \u0633\u0627\u0642\u0644\u0627\u0646\u062f\u0649'
};

function makeBmScript(toastText){
  return `<script>
(function(){
  var BM_KEY = 'KX_bookmark';
  var toast, toastTimer;
  function showToast(txt) {
    if (!toast) {
      toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(16,10,6,.88);color:#d4a574;font-family:sans-serif;font-size:.78rem;letter-spacing:.08em;padding:9px 20px;border-radius:10px;border:1px solid #9b7d5c;pointer-events:none;z-index:999;transition:opacity .3s,transform .3s;box-shadow:0 12px 24px rgba(0,0,0,.24)';
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

const BASE='dist-alquran/Übersetzungen';
const LANGS=fs.readdirSync(BASE).filter(l=>{
  return fs.statSync(BASE+'/'+l).isDirectory() && l!=='Deutsch';
});

let total=0, skipped=0;

for(const lang of LANGS){
  const dir=BASE+'/'+lang+'/suren';
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
console.log('Quran bookmarks added to',total,'files,',skipped,'already had it');
