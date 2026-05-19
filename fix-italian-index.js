// fix-italian-index.js
// Fixes Italian Bible index: UI labels, book names, adds deuterocanonical section, fixes JS
const fs=require('fs');

const TNAME_MAP={
  'Genesis':'Genesi',
  'Exodus':'Esodo',
  'Leviticus':'Levitico',
  'Numbers':'Numeri',
  'Deuteronomy':'Deuteronomio',
  'Joshua':'Giosu\u00e8',
  'Judges':'Giudici',
  'Ruth':'Rut',
  '1 Samuel':'1 Samuele',
  '2 Samuel':'2 Samuele',
  '1 Kings':'1 Re',
  '2 Kings':'2 Re',
  '1 Chronicles':'1 Cronache',
  '2 Chronicles':'2 Cronache',
  'Ezra':'Esdra',
  'Nehemiah':'Neemia',
  'Esther':'Ester',
  'Job':'Giobbe',
  'Psalms':'Salmi',
  'Proverbs':'Proverbi',
  'Ecclesiastes':'Ecclesiaste',
  'Song of Solomon':'Cantico dei Cantici',
  'Isaiah':'Isaia',
  'Jeremiah':'Geremia',
  'Lamentations':'Lamentazioni',
  'Ezekiel':'Ezechiele',
  'Daniel':'Daniele',
  'Hosea':'Osea',
  'Joel':'Gioele',
  'Amos':'Amos',
  'Obadiah':'Abdia',
  'Jonah':'Giona',
  'Micah':'Michea',
  'Nahum':'Naum',
  'Habakkuk':'Abacuc',
  'Zephaniah':'Sofonia',
  'Haggai':'Aggeo',
  'Zechariah':'Zaccaria',
  'Malachi':'Malachia',
  'Matthew':'Matteo',
  'Mark':'Marco',
  'Luke':'Luca',
  'John':'Giovanni',
  'Acts':'Atti degli Apostoli',
  'Romans':'Romani',
  '1 Corinthians':'1 Corinzi',
  '2 Corinthians':'2 Corinzi',
  'Galatians':'Galati',
  'Ephesians':'Efesini',
  'Philippians':'Filippesi',
  'Colossians':'Colossesi',
  '1 Thessalonians':'1 Tessalonicesi',
  '2 Thessalonians':'2 Tessalonicesi',
  '1 Timothy':'1 Timoteo',
  '2 Timothy':'2 Timoteo',
  'Titus':'Tito',
  'Philemon':'Filemone',
  'Hebrews':'Ebrei',
  'James':'Giacomo',
  '1 Peter':'1 Pietro',
  '2 Peter':'2 Pietro',
  '1 John':'1 Giovanni',
  '2 John':'2 Giovanni',
  '3 John':'3 Giovanni',
  'Jude':'Giuda',
  'Revelation':'Apocalisse'
};

const DK_SECTION=`
<div class="sec-group sec-dk">
<div class="sec-head">
  <span class="sec-t sec-t-c">Libri Deuterocanonici</span>
  <span class="sec-t sec-t-p">Libri Deuterocanonici</span>
  <div class="sec-rule"></div>
  <span class="sec-s">L I B R I &nbsp; D E U T E R O C A N O N I C I &nbsp;\u2013&nbsp; 7 &nbsp; L I B R I</span>
</div>
  <a href="b\u00FCcher/067-tob.html" class="toc-item" data-testament="DK">
    <span class="tnr">067</span>
    <span class="tlat">Tobias</span>
    <span class="tname">Tobia</span>
    <span class="tdots"></span>
    <span class="tchap">14 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/068-jdt.html" class="toc-item" data-testament="DK">
    <span class="tnr">068</span>
    <span class="tlat">Iudith</span>
    <span class="tname">Giuditta</span>
    <span class="tdots"></span>
    <span class="tchap">16 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/069-1ma.html" class="toc-item" data-testament="DK">
    <span class="tnr">069</span>
    <span class="tlat">I Machabaeorum</span>
    <span class="tname">1 Maccabei</span>
    <span class="tdots"></span>
    <span class="tchap">16 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/070-2ma.html" class="toc-item" data-testament="DK">
    <span class="tnr">070</span>
    <span class="tlat">II Machabaeorum</span>
    <span class="tname">2 Maccabei</span>
    <span class="tdots"></span>
    <span class="tchap">15 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/071-wis.html" class="toc-item" data-testament="DK">
    <span class="tnr">071</span>
    <span class="tlat">Sapientia</span>
    <span class="tname">Sapienza</span>
    <span class="tdots"></span>
    <span class="tchap">19 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/072-sir.html" class="toc-item" data-testament="DK">
    <span class="tnr">072</span>
    <span class="tlat">Ecclesiasticus</span>
    <span class="tname">Siracide</span>
    <span class="tdots"></span>
    <span class="tchap">51 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
  <a href="b\u00FCcher/073-bar.html" class="toc-item" data-testament="DK">
    <span class="tnr">073</span>
    <span class="tlat">Baruch</span>
    <span class="tname">Baruc</span>
    <span class="tdots"></span>
    <span class="tchap">6 Cap.</span>
    <span class="tarr">\u203a</span>
  </a>
</div>`;

const NEW_JS=`<script>
(function(){
  var NOTES = {
    catholic:   '73 Libri \u2014 Vulgata Clementina \u00b7 Deuterocanonici',
    protestant: '66 Libri \u2014 Antico &amp; Nuovo Testamento'
  };
  var saved = localStorage.getItem('biblia_conf') || 'catholic';
  var btns  = document.querySelectorAll('.conf-btn');
  var note  = document.getElementById('conf-note');
  function setConf(c) {
    document.body.dataset.conf = c;
    localStorage.setItem('biblia_conf', c);
    btns.forEach(function(b){ b.classList.toggle('active', b.dataset.conf === c); });
    if (note) note.textContent = NOTES[c] || '';
    document.querySelectorAll('.toc-item').forEach(function(item){
      var lat = item.querySelector('.tlat');
      var it  = item.querySelector('.tname');
      if (!lat || !it) return;
      if (!lat.dataset.latin) lat.dataset.latin = (lat.textContent || '').trim();
      lat.textContent = c === 'protestant' ? (it.textContent || '').trim() : lat.dataset.latin;
    });
    document.querySelectorAll('.tchap').forEach(function(el){
      var m = (el.textContent || '').match(/\\d+/);
      if (m) el.textContent = m[0] + ' Cap.';
    });
  }
  setConf(saved);
  btns.forEach(function(b){
    b.addEventListener('click', function(){ setConf(b.dataset.conf); });
  });
})();
</script>`;

const fp='dist-diebibel/italian/index.html';
let html=fs.readFileSync(fp,'utf8');

// 1. Fix topbar link (../../index.html → ../index.html and text)
html=html.replace(
  /href="\.\.\/\.\.\/index\.html">.*?La Sacra Bibbia.*?<\/a>/,
  'href="../index.html">\u2190 La Sacra Bibbia \u00b7 Tutte le lingue</a>'
);

// 2. Fix button labels
html=html.replace('>✝&#xFE0E; Katholisch<','>\u271d&#xFE0E; Cattolico<');
html=html.replace('>☩  Protestantisch<','>&#x2629;  Protestante<');

// 3. Fix all tname values
for(const [en,it] of Object.entries(TNAME_MAP)){
  html=html.replace(
    '<span class="tname">'+en+'</span>',
    '<span class="tname">'+it+'</span>'
  );
}

// 4. Fix all "Kap." → "Cap." (in tchap spans and elsewhere)
html=html.replace(/<span class="tchap">(\d+) Kap\.<\/span>/g,
  '<span class="tchap">$1 Cap.</span>');

// 5. Add deuterocanonical section before </main>
html=html.replace('</main>',DK_SECTION+'\n</main>');

// 6. Replace JS block
const scriptStart=html.lastIndexOf('<script>');
const scriptEnd=html.indexOf('</script>',scriptStart)+9;
html=html.slice(0,scriptStart)+NEW_JS+html.slice(scriptEnd);

fs.writeFileSync(fp,html,'utf8');
console.log('Italian index fixed');
