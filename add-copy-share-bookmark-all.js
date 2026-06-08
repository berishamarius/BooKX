const fs = require('fs');
const path = require('path');

// LOKALISIERTE TEXTE
const TRANSLATIONS = {
  // Quran
  'Albanisch': { copy: 'Kopjo', share: 'Shpërnda', copied: 'Kopjuar!', bookmark: 'Shenjë e vendosur', bookmarkRemoved: 'Shenjë e hequr' },
  'Bengalisch': { copy: 'অনুলিপি', share: 'শেয়ার', copied: 'অনুলিপি করা হয়েছে!', bookmark: 'বুকমার্ক সেট', bookmarkRemoved: 'বুকমার্ক সরানো' },
  'Bosnisch': { copy: 'Kopiraj', share: 'Podijeli', copied: 'Kopirano!', bookmark: 'Marker postavljen', bookmarkRemoved: 'Marker uklonjen' },
  'Chinesisch': { copy: '复制', share: '分享', copied: '已复制！', bookmark: '已设置书签', bookmarkRemoved: '已移除书签' },
  'Deutsch': { copy: 'Kopieren', share: 'Teilen', copied: 'Kopiert!', bookmark: 'Lesezeichen gesetzt', bookmarkRemoved: 'Lesezeichen entfernt' },
  'Englisch': { copy: 'Copy', share: 'Share', copied: 'Copied!', bookmark: 'Bookmark set', bookmarkRemoved: 'Bookmark removed' },
  'Französisch': { copy: 'Copier', share: 'Partager', copied: 'Copié!', bookmark: 'Signet défini', bookmarkRemoved: 'Signet supprimé' },
  'Hausa': { copy: 'Kwafi', share: 'Raba', copied: 'An kwafi!', bookmark: 'An saita alama', bookmarkRemoved: 'An cire alama' },
  'Hindi': { copy: 'कॉपी', share: 'शेयर', copied: 'कॉपी किया गया!', bookmark: 'बुकमार्क सेट', bookmarkRemoved: 'बुकमार्क हटाया' },
  'Indonesisch': { copy: 'Salin', share: 'Bagikan', copied: 'Disalin!', bookmark: 'Penanda dipasang', bookmarkRemoved: 'Penanda dihapus' },
  'Kasachisch': { copy: 'Көшіру', share: 'Бөлісу', copied: 'Көшірілді!', bookmark: 'Бетбелгі қойылды', bookmarkRemoved: 'Бетбелгі жойылды' },
  'Persisch': { copy: 'کپی', share: 'اشتراک', copied: 'کپی شد!', bookmark: 'نشانک تنظیم شد', bookmarkRemoved: 'نشانک حذف شد' },
  'Russisch': { copy: 'Копировать', share: 'Поделиться', copied: 'Скопировано!', bookmark: 'Закладка установлена', bookmarkRemoved: 'Закладка удалена' },
  'Spanisch': { copy: 'Copiar', share: 'Compartir', copied: '¡Copiado!', bookmark: 'Marcador establecido', bookmarkRemoved: 'Marcador eliminado' },
  'Tagalog': { copy: 'Kopyahin', share: 'Ibahagi', copied: 'Nakopya!', bookmark: 'Bookmark na-set', bookmarkRemoved: 'Bookmark tinanggal' },
  'Thailändisch': { copy: 'คัดลอก', share: 'แชร์', copied: 'คัดลอกแล้ว!', bookmark: 'ตั้งบุ๊กมาร์กแล้ว', bookmarkRemoved: 'ลบบุ๊กมาร์กแล้ว' },
  'Türkisch': { copy: 'Kopyala', share: 'Paylaş', copied: 'Kopyalandı!', bookmark: 'Yer imi eklendi', bookmarkRemoved: 'Yer imi kaldırıldı' },
  'Urdu': { copy: 'کاپی', share: 'شیئر', copied: 'کاپی ہو گیا!', bookmark: 'بُک مارک سیٹ', bookmarkRemoved: 'بُک مارک ہٹایا' },
  'Uygurisch': { copy: 'كۆچۈر', share: 'ھەمبەھىر', copied: 'كۆچۈرۈلدى!', bookmark: 'خەتكۈچ قويۇلدى', bookmarkRemoved: 'خەتكۈچ ئۆچۈرۈلدى' },
  // Bible
  'kjv': { copy: 'Copy', share: 'Share', copied: 'Copied!', bookmark: 'Bookmark set', bookmarkRemoved: 'Bookmark removed' },
  'german': { copy: 'Kopieren', share: 'Teilen', copied: 'Kopiert!', bookmark: 'Lesezeichen gesetzt', bookmarkRemoved: 'Lesezeichen entfernt' },
  'french': { copy: 'Copier', share: 'Partager', copied: 'Copié!', bookmark: 'Signet défini', bookmarkRemoved: 'Signet supprimé' },
  'spanish': { copy: 'Copiar', share: 'Compartir', copied: '¡Copiado!', bookmark: 'Marcador establecido', bookmarkRemoved: 'Marcador eliminado' },
  'portuguese': { copy: 'Copiar', share: 'Compartilhar', copied: 'Copiado!', bookmark: 'Marcador definido', bookmarkRemoved: 'Marcador removido' },
  'polish': { copy: 'Kopiuj', share: 'Udostępnij', copied: 'Skopiowano!', bookmark: 'Zakładka ustawiona', bookmarkRemoved: 'Zakładka usunięta' },
  'russian': { copy: 'Копировать', share: 'Поделиться', copied: 'Скопировано!', bookmark: 'Закладка установлена', bookmarkRemoved: 'Закладка удалена' },
  'croatian': { copy: 'Kopiraj', share: 'Podijeli', copied: 'Kopirano!', bookmark: 'Oznaka postavljena', bookmarkRemoved: 'Oznaka uklonjena' },
  'dutch': { copy: 'Kopiëren', share: 'Delen', copied: 'Gekopieerd!', bookmark: 'Bladwijzer ingesteld', bookmarkRemoved: 'Bladwijzer verwijderd' },
  'hungarian': { copy: 'Másol', share: 'Megoszt', copied: 'Másolva!', bookmark: 'Könyvjelző beállítva', bookmarkRemoved: 'Könyvjelző törölve' },
  'czech': { copy: 'Kopírovat', share: 'Sdílet', copied: 'Zkopírováno!', bookmark: 'Záložka nastavena', bookmarkRemoved: 'Záložka odstraněna' },
  'swedish': { copy: 'Kopiera', share: 'Dela', copied: 'Kopierat!', bookmark: 'Bokmärke satt', bookmarkRemoved: 'Bokmärke borttaget' },
  'tagalog': { copy: 'Kopyahin', share: 'Ibahagi', copied: 'Nakopya!', bookmark: 'Bookmark na-set', bookmarkRemoved: 'Bookmark tinanggal' },
  'ukrainian': { copy: 'Копіювати', share: 'Поділитися', copied: 'Скопійовано!', bookmark: 'Закладку встановлено', bookmarkRemoved: 'Закладку видалено' },
  'albanian': { copy: 'Kopjo', share: 'Ndaj', copied: 'Kopjuar!', bookmark: 'Shenjë vendosur', bookmarkRemoved: 'Shenjë hequr' },
  'romanian': { copy: 'Copiază', share: 'Distribuie', copied: 'Copiat!', bookmark: 'Marcaj setat', bookmarkRemoved: 'Marcaj eliminat' },
  'italian': { copy: 'Copia', share: 'Condividi', copied: 'Copiato!', bookmark: 'Segnalibro impostato', bookmarkRemoved: 'Segnalibro rimosso' },
  'syriac': { copy: 'ܢܣܚ', share: 'ܫܘܬܦ', copied: 'ܢܣܝܚܐ!', bookmark: 'ܣܝܡܬܐ ܕܪܫܡܐ', bookmarkRemoved: 'ܪܫܡܐ ܫܩܝܠܐ' },
  'armenian': { copy: 'Պատճենել', share: 'Կիսվել', copied: 'Պատճենված է!', bookmark: 'Էջանիշ դրված', bookmarkRemoved: 'Էջանիշ հեռացված' }
};

const FEATURE_CODE = (lang) => `
<style id="bookmark-glow-style">
.verse-actions{display:inline-flex;gap:4px;margin-left:8px;opacity:0;transition:opacity .2s;}
.tr:hover .verse-actions,.verse-actions.show{opacity:1;}
.v-btn{background:rgba(200,160,48,.12);border:1px solid rgba(200,160,48,.28);border-radius:3px;padding:2px 8px;font-size:.7rem;color:rgba(200,160,48,.72);cursor:pointer;transition:all .15s;font-family:'Cinzel',serif;}
.v-btn:hover{background:rgba(200,160,48,.22);border-color:rgba(200,160,48,.55);color:#EDD882;}
.bookmarked{background:linear-gradient(135deg,rgba(255,215,0,.18),rgba(255,165,0,.15));box-shadow:0 0 12px rgba(255,215,0,.35),inset 0 0 8px rgba(255,215,0,.2);animation:glowPulse 2s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{box-shadow:0 0 12px rgba(255,215,0,.35),inset 0 0 8px rgba(255,215,0,.2);}50%{box-shadow:0 0 18px rgba(255,215,0,.5),inset 0 0 12px rgba(255,215,0,.3);}}
</style>
<script>
(function(){
const lang='${lang}';
const t=${JSON.stringify(TRANSLATIONS[lang] || TRANSLATIONS['Deutsch'])};
function addVerseActions(){
document.querySelectorAll('.tr, .v').forEach(v=>{
if(v.querySelector('.verse-actions'))return;
const id=v.id||v.getAttribute('data-v');
if(!id)return;
const acts=document.createElement('span');
acts.className='verse-actions';
acts.innerHTML=\`<button class="v-btn v-copy" data-id="\${id}">\${t.copy}</button><button class="v-btn v-share" data-id="\${id}">\${t.share}</button><button class="v-btn v-bookmark" data-id="\${id}">🔖</button>\`;
v.appendChild(acts);
});
document.querySelectorAll('.v-copy').forEach(b=>b.onclick=function(){
const txt=document.querySelector('#'+this.dataset.id+' .tx, #'+this.dataset.id).textContent;
navigator.clipboard.writeText(txt).then(()=>{const o=this.textContent;this.textContent=t.copied;setTimeout(()=>this.textContent=o,1500);});
});
document.querySelectorAll('.v-share').forEach(b=>b.onclick=function(){
const txt=document.querySelector('#'+this.dataset.id+' .tx, #'+this.dataset.id).textContent;
if(navigator.share)navigator.share({text:txt}).catch(()=>{});
});
document.querySelectorAll('.v-bookmark').forEach(b=>b.onclick=function(){
const id=this.dataset.id;
const key='bookmarks_'+location.pathname;
let bm=JSON.parse(localStorage.getItem(key)||'[]');
const v=document.getElementById(id)||document.querySelector('[data-v="'+id+'"]');
if(bm.includes(id)){bm=bm.filter(x=>x!==id);v.classList.remove('bookmarked');this.textContent='🔖';alert(t.bookmarkRemoved);}
else{bm.push(id);v.classList.add('bookmarked');this.textContent='🔖';alert(t.bookmark);}
localStorage.setItem(key,JSON.stringify(bm));
});
}
function restoreBookmarks(){
const key='bookmarks_'+location.pathname;
const bm=JSON.parse(localStorage.getItem(key)||'[]');
bm.forEach(id=>{
const v=document.getElementById(id)||document.querySelector('[data-v="'+id+'"]');
if(v)v.classList.add('bookmarked');
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{addVerseActions();restoreBookmarks();});
else{addVerseActions();restoreBookmarks();}
})();
</script>
`;

console.log('🔧 Adding Copy/Share/Bookmark to ALL languages\n');

// QURAN
const quranLangs = Object.keys(TRANSLATIONS).filter(k => !['kjv','german','french','spanish','portuguese','polish','russian','croatian','dutch','hungarian','czech','swedish','tagalog','ukrainian','albanian','romanian','italian','syriac','armenian'].includes(k));

for (const lang of quranLangs) {
  const langPath = path.join('dist-alquran', 'Übersetzungen', lang, 'suren');
  if (!fs.existsSync(langPath)) continue;
  
  const files = fs.readdirSync(langPath).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(langPath, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Remove old scripts
    html = html.replace(/<style id="bookmark-glow-style">[\s\S]*?<\/style>/g, '');
    html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?\}\)\(\);\s*<\/script>/g, '');
    
    // Insert before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', FEATURE_CODE(lang) + '</body>');
      fs.writeFileSync(filePath, html, 'utf-8');
    }
  }
  console.log(`✓ Quran ${lang} - ${files.length} Suren`);
}

// BIBLE
const bibleLangs = ['kjv','german','french','spanish','portuguese','polish','russian','croatian','dutch','hungarian','czech','swedish','tagalog','ukrainian','albanian','romanian','italian','syriac','armenian'];

for (const lang of bibleLangs) {
  const booksPath = path.join('dist-diebibel', lang, 'bücher');
  if (!fs.existsSync(booksPath)) continue;
  
  const files = fs.readdirSync(booksPath).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(booksPath, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Remove old
    html = html.replace(/<style id="bookmark-glow-style">[\s\S]*?<\/style>/g, '');
    html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?\}\)\(\);\s*<\/script>/g, '');
    
    // Insert
    if (html.includes('</body>')) {
      html = html.replace('</body>', FEATURE_CODE(lang) + '</body>');
      fs.writeFileSync(filePath, html, 'utf-8');
    }
  }
  console.log(`✓ Bible ${lang} - ${files.length} Books`);
}

console.log('\n✅ DONE! Copy/Share/Bookmark added to ALL!');
