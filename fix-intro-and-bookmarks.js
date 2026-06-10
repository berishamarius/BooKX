'use strict';
const fs = require('fs');
const path = require('path');

// ══════════════════════════════════════════════════════
// TASK 1: Fix intro.html - remove long paragraphs + dashes
// Short, clean, no em-dashes
// ══════════════════════════════════════════════════════

// The correct, short paragraph block (no em-dashes, no long text)
// We replace ALL <p>...</p> blocks inside .intro-c
const SHORT_PARAGRAPHS = {
  'Albanisch':    '<p>Ky Kuran u mundësua nga një dëshirë e vetme: t\'i japë çdo njeriu mundësinë të lexojë fjalën e Allahut.</p>',
  'Bengalisch':   '<p>এই কুরআন একটি একক ইচ্ছা থেকে জন্ম নিয়েছে: প্রতিটি মানুষকে আল্লাহর বাণী পড়ার সুযোগ দেওয়া।</p>',
  'Bosnisch':     '<p>Ovaj Kuran nastao je iz jedne jedine želje: dati svakom čovjeku mogućnost da čita Allahovu riječ.</p>',
  'Chinesisch':   '<p>这部古兰经源于一个愿望：让每个人都有机会阅读安拉的话语。</p>',
  'Deutsch':      '<p>Dieser Quran entstand aus einem einzigen Wunsch: jedem Menschen die Möglichkeit zu geben, das Wort Allahs zu lesen und zu verstehen.</p>',
  'Englisch':     '<p>This Quran was born from a single desire: to give every person the opportunity to read the word of Allah.</p>',
  'Französisch':  '<p>Ce Coran est né d\'un seul désir : donner à chaque personne la possibilité de lire la parole d\'Allah.</p>',
  'Hausa':        '<p>Wannan Alƙur\'ani ya fito ne daga sha\'awa guda ɗaya: ba kowane mutum damar karanta maganar Allah.</p>',
  'Hindi':        '<p>यह कुरआन एक इच्छा से जन्मा: हर इंसान को अल्लाह का कलाम पढ़ने का मौका देना।</p>',
  'Indonesisch':  '<p>Alquran ini lahir dari satu keinginan: memberikan setiap orang kesempatan untuk membaca firman Allah.</p>',
  'Kasachisch':   '<p>Бұл Құран бір тілектен туды: әр адамға Аллаһтың сөзін оқу мүмкіндігін беру.</p>',
  'Persisch':     '<p>این قرآن از یک آرزو متولد شد: دادن فرصت به هر انسانی برای خواندن کلام الله.</p>',
  'Russisch':     '<p>Этот Коран родился из одного желания: дать каждому человеку возможность читать слово Аллаха.</p>',
  'Spanisch':     '<p>Este Corán nació de un solo deseo: dar a cada persona la oportunidad de leer la palabra de Alá.</p>',
  'Tagalog':      '<p>Ang Quran na ito ay ipinanganak mula sa isang pagnanasa: bigyan ang bawat tao ng pagkakataon na basahin ang salita ni Allah.</p>',
  'Thailändisch': '<p>อัลกุรอานนี้เกิดจากความปรารถนาเดียว: ให้ทุกคนมีโอกาสอ่านพระวจนะของอัลลอฮ์</p>',
  'Türkisch':     '<p>Bu Kuran tek bir arzudan doğdu: her insana Allah\'ın sözünü okuma fırsatı vermek.</p>',
  'Urdu':         '<p>یہ قرآن ایک خواہش سے جنم لیا: ہر انسان کو اللہ کا کلام پڑھنے کا موقع دینا۔</p>',
  'Uygurisch':    '<p>بۇ قۇرئان بىر ئارزۇدىن تۇغۇلدى: ھەر بىر كىشىگە ئاللاھنىڭ سۆزىنى ئوقۇش پۇرسىتى بېرىش.</p>',
};

function fixIntro(filePath, lang) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch(e) { return false; }
  const original = content;

  const newParagraph = SHORT_PARAGRAPHS[lang] || SHORT_PARAGRAPHS['Deutsch'];

  // Replace all <p>...</p> blocks between <h2> and <div class="bismi-box"> with single short paragraph
  // Match: one or more <p>...</p> blocks (multiline)
  content = content.replace(/(<h2>[^<]*<\/h2>\s*)((?:<p>[\s\S]*?<\/p>\s*)+)(<div class="bismi-box">)/,
    (_, h2, _ps, bismi) => h2 + '\n  ' + newParagraph + '\n  ' + bismi
  );

  if (content !== original) {
    try { fs.writeFileSync(filePath, content, 'utf8'); return true; } catch(e) { return false; }
  }
  return false;
}

// ══════════════════════════════════════════════════════
// TASK 2: Add bookmark script to ALL verse files
// ══════════════════════════════════════════════════════

// Colors per dir
function getColors(filePath) {
  const fp = filePath.toLowerCase();
  if (fp.includes('dist-alquran') || fp.includes('dist-karim') || fp.includes('dist-meliha') || fp.includes('al-quran') || fp.includes('koran')) {
    return { bg: 'rgba(16,10,6,.88)', color: '#d4a574', border: '#9b7d5c' };
  }
  return { bg: 'rgba(20,8,8,.90)', color: '#d4a59e', border: '#a86b65' };
}

// Localized toast text per path
function getToastText(filePath) {
  const map = {
    'Albanisch': 'Faqerojtësi u ruajt', 'Bengalisch': 'বুকমার্ক সংরক্ষিত',
    'Bosnisch': 'Oznaka sačuvana', 'Chinesisch': '书签已保存',
    'Deutsch': 'Lesezeichen gesetzt', 'Englisch': 'Bookmark saved',
    'Französisch': 'Signet enregistré', 'Hausa': 'An adana alamar',
    'Hindi': 'बुकमार्क सहेजा गया', 'Indonesisch': 'Penanda disimpan',
    'Kasachisch': 'Бетбелгі сақталды', 'Persisch': 'نشانک ذخیره شد',
    'Russisch': 'Закладка сохранена', 'Spanisch': 'Marcador guardado',
    'Tagalog': 'Na-save ang bookmark', 'Thailändisch': 'บันทึกที่คั่นหน้าแล้ว',
    'Türkisch': 'Yer işareti kaydedildi', 'Urdu': 'بک مارک محفوظ ہوگیا',
    'Uygurisch': 'خەتكۈش ساقلاندى',
    // Bible languages
    'german': 'Lesezeichen gesetzt', 'kjv': 'Bookmark saved',
    'italian': 'Segnalibro salvato', 'romanian': 'Semn de carte salvat',
    'french': 'Signet enregistré', 'spanish': 'Marcador guardado',
    'dutch': 'Bladwijzer opgeslagen', 'polish': 'Zakładka zapisana',
    'czech': 'Záložka uložena', 'croatian': 'Knjižna oznaka spremljena',
    'hungarian': 'Könyvjelző mentve', 'albanian': 'Shenjëzimi u ruajt',
    'russian': 'Закладка сохранена', 'ukrainian': 'Закладку збережено',
    'swedish': 'Bokmärke sparat', 'portuguese': 'Marcador salvo',
    'tagalog': 'Na-save ang bookmark', 'armenian': 'Էջանիշը պահպանված է',
    'syriac': 'ܢܝܫܐ ܢܛܪ',
  };
  for (const [key, val] of Object.entries(map)) {
    if (filePath.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'Lesezeichen gesetzt';
}

function makeBookmarkScript(filePath) {
  const c = getColors(filePath);
  const txt = getToastText(filePath);
  return `<script>
(function(){
  var BM_KEY='KX_bookmark';
  var toast,toastTimer;
  function showToast(txt){
    if(!toast){toast=document.createElement('div');toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${c.bg};color:${c.color};font-family:sans-serif;font-size:.78rem;letter-spacing:.08em;padding:9px 20px;border-radius:10px;border:1px solid ${c.border};pointer-events:none;z-index:999;transition:opacity .3s,transform .3s;box-shadow:0 12px 24px rgba(0,0,0,.24)';document.body.appendChild(toast);}
    toast.textContent=txt;toast.style.opacity='1';toast.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.style.opacity='0';toast.style.transform='translateX(-50%) translateY(6px)';},1800);
  }
  document.addEventListener('click',function(e){
    var el=e.target;
    while(el&&el!==document.body){if(el.matches&&el.matches('.verse,.vb'))break;el=el.parentElement;}
    if(!el||el===document.body)return;
    if(e.target.tagName==='A')return;
    var id=el.id;if(!id)return;
    var data={url:location.pathname+'#'+id,title:document.title,id:id,ts:Date.now()};
    try{localStorage.setItem(BM_KEY,JSON.stringify(data));}catch(_){}
    showToast('${txt}');
  });
})();
</script>`;
}

function addBookmarkToVerseFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch(e) { return false; }
  if (content.includes('KX_bookmark')) return false; // already there
  if (!content.includes('</body>')) return false;
  content = content.replace('</body>', makeBookmarkScript(filePath) + '\n</body>');
  try { fs.writeFileSync(filePath, content, 'utf8'); return true; } catch(e) { return false; }
}

// ══════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════

const QURAN_DIRS = ['dist-alquran','dist-karim','dist-meliha','AL-QURAN','Geschenke/Koran-Deutsch-1','Geschenke/Koran-Deutsch-2'];
const BIBLE_DIRS = ['dist-diebibel'];
const QURAN_LANGS = ['Albanisch','Bengalisch','Bosnisch','Chinesisch','Deutsch','Englisch','Französisch','Hausa','Hindi','Indonesisch','Kasachisch','Persisch','Russisch','Spanisch','Tagalog','Thailändisch','Türkisch','Urdu','Uygurisch'];

// Fix intros
console.log('1) Fixing intro.html pages (short text, no dashes)...\n');
let introFixed = 0;
for (const baseDir of ['dist-alquran','dist-karim','dist-meliha']) {
  if (!fs.existsSync(baseDir)) continue;
  for (const lang of QURAN_LANGS) {
    const p = path.join(baseDir, 'Übersetzungen', lang, 'intro.html');
    if (fs.existsSync(p) && fixIntro(p, lang)) {
      introFixed++;
    }
  }
}
console.log(`   Fixed: ${introFixed} intro files\n`);

// Add bookmarks to verse/chapter files
console.log('2) Adding bookmark script to all verse files...\n');

function walkAndAddBookmark(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  let items;
  try { items = fs.readdirSync(dir, {withFileTypes: true}); } catch(e) { return 0; }
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) count += walkAndAddBookmark(full);
    else if (item.isFile() && item.name.endsWith('.html')) {
      // Only verse/chapter files, not index/cover/intro
      const base = item.name;
      if (base === 'index.html' || base === 'cover.html' || base === 'back-cover.html' ||
          base === 'intro.html' || base === 'vorwort.html' || base === 'woerterbuch.html' ||
          base === '200.html') continue;
      if (addBookmarkToVerseFile(full)) count++;
    }
  }
  return count;
}

let bmTotal = 0;
for (const d of [...QURAN_DIRS, ...BIBLE_DIRS]) {
  const n = walkAndAddBookmark(d);
  if (n > 0) { console.log(`   ${d}: ${n} files`); bmTotal += n; }
}
console.log(`\n   Total bookmark: ${bmTotal} files\n`);
console.log('Done.');
