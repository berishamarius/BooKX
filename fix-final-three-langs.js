const fs = require('fs');
const path = require('path');

// Complete surah names in German, Albanian, and Tagalog
const surahNames = {
  'Deutsch': {
    '001': 'Die Eröffnung', '002': 'Die Kuh', '003': 'Die Familie ʿImrān', '004': 'Die Frauen',
    '005': 'Der Tisch', '006': 'Das Vieh', '007': 'Die Höhen', '008': 'Die Beute',
    '009': 'Die Reue', '010': 'Yūnus', '011': 'Hūd', '012': 'Yūsuf',
    '013': 'Der Donner', '014': 'Abraham', '015': 'Der steinige Teil', '016': 'Die Biene',
    '017': 'Die Nachtreise', '018': 'Die Höhle', '019': 'Maria', '020': 'Tā-Hā',
    '021': 'Die Propheten', '022': 'Die Pilgerfahrt', '023': 'Die Gläubigen', '024': 'Das Licht',
    '025': 'Die Unterscheidung', '026': 'Die Dichter', '027': 'Die Ameisen', '028': 'Die Geschichte',
    '029': 'Die Spinne', '030': 'Die Römer', '031': 'Luqman', '032': 'Die Niederwerfung',
    '033': 'Die Verbündeten', '034': 'Saba', '035': 'Der Schöpfer', '036': 'Yā-Sīn',
    '037': 'Die sich Reihenden', '038': 'Ṣād', '039': 'Die Gruppen', '040': 'Der Vergebende',
    '041': 'Deutlich gemacht', '042': 'Die Beratung', '043': 'Der Goldschmuck', '044': 'Der Rauch',
    '045': 'Das Knien', '046': 'Die Sanddünen', '047': 'Muḥammad', '048': 'Der Sieg',
    '049': 'Die Gemächer', '050': 'Qāf', '051': 'Die Winde', '052': 'Der Berg',
    '053': 'Der Stern', '054': 'Der Mond', '055': 'Der Erbarmer', '056': 'Das Ereignis',
    '057': 'Das Eisen', '058': 'Die Streitende', '059': 'Die Versammlung', '060': 'Die Geprüfte',
    '061': 'Die Reihe', '062': 'Der Freitag', '063': 'Die Heuchler', '064': 'Die Übervorteilung',
    '065': 'Die Scheidung', '066': 'Das Verbot', '067': 'Die Herrschaft', '068': 'Der Stift',
    '069': 'Die stürmische', '070': 'Die Himmelsleiter', '071': 'Nūḥ', '072': 'Die Ǧinn',
    '073': 'Der sich Verhüllende', '074': 'Der sich Zudeckende', '075': 'Die Auferstehung', '076': 'Der Mensch',
    '077': 'Die Entsandten', '078': 'Die Kunde', '079': 'Die Entreißer', '080': 'Er runzelte die Stirn',
    '081': 'Das Einhüllen', '082': 'Die Spaltung', '083': 'Die das Maß Verkürzenden', '084': 'Das Zerbrechen',
    '085': 'Die Türme', '086': 'Der Nachtstern', '087': 'Der Höchste', '088': 'Die Bedeckende',
    '089': 'Die Morgendämmerung', '090': 'Die Stadt', '091': 'Die Sonne', '092': 'Die Nacht',
    '093': 'Der lichte Tag', '094': 'Die Weitung', '095': 'Die Feige', '096': 'Der Blutklumpen',
    '097': 'Die Bestimmung', '098': 'Der klare Beweis', '099': 'Das Erdbeben', '100': 'Die Rennenden',
    '101': 'Das Verhängnis', '102': 'Die Vermehrung', '103': 'Die Zeit', '104': 'Der Stichler',
    '105': 'Der Elefant', '106': 'Die Quraisch', '107': 'Die Hilfeleistung', '108': 'Der Überfluss',
    '109': 'Die Ungläubigen', '110': 'Die Hilfe', '111': 'Die Palmfasern', '112': 'Die Aufrichtigkeit',
    '113': 'Das Morgengrauen', '114': 'Die Menschen'
  },
  'Albanisch': {
    '001': 'Hapja', '002': 'Lopа', '003': 'Familja e Imranit', '004': 'Gratë',
    '005': 'Tryeza', '006': 'Bagëtitë', '007': 'Lartësitë', '008': 'Plaçka',
    '009': 'Pendimi', '010': 'Junusi', '011': 'Hudi', '012': 'Jusufi',
    '013': 'Bubullima', '014': 'Ibrahimi', '015': 'Hidzhri', '016': 'Bletët',
    '017': 'Udhëtimi Natës', '018': 'Shpella', '019': 'Merjemja', '020': 'Ta Ha',
    '021': 'Profetët', '022': 'Haxhi', '023': 'Besimtarët', '024': 'Drita',
    '025': 'Dallimi', '026': 'Poetët', '027': 'Milingona', '028': 'Tregimi',
    '029': 'Merimanga', '030': 'Romakët', '031': 'Lukmani', '032': 'Sexhdeja',
    '033': 'Koalicioni', '034': 'Sheba', '035': 'Krijuesi', '036': 'Ja Sin',
    '037': 'Radhët', '038': 'Sad', '039': 'Grupet', '040': 'Falja',
    '041': 'E Sqaruar', '042': 'Këshilla', '043': 'Stolisja', '044': 'Tymi',
    '045': 'Gjunjëzimi', '046': 'Dallgët e rërës', '047': 'Muhamedi', '048': 'Fitorja',
    '049': 'Dhomatë', '050': 'Qaf', '051': 'Erërat', '052': 'Mali',
    '053': 'Ylli', '054': 'Hëna', '055': 'Mëshiruesi', '056': 'Ngjarja',
    '057': 'Hekuri', '058': 'Gruaja që diskuton', '059': 'Bashkimi', '060': 'E Provuara',
    '061': 'Radha', '062': 'E Premtja', '063': 'Hipokritët', '064': 'Mashtrimi',
    '065': 'Divorci', '066': 'Ndalimi', '067': 'Mbretëria', '068': 'Pena',
    '069': 'Realiteti', '070': 'Shkallët', '071': 'Nuhu', '072': 'Xhinët',
    '073': 'I Mbështjelluri', '074': 'I Mbuluar', '075': 'Ringjallja', '076': 'Njeriu',
    '077': 'Ata që dërgohen', '078': 'Lajmi', '079': 'Ata që shkëpusin', '080': 'Ai u vrenjt',
    '081': 'Mbështjellja', '082': 'Çarja', '083': 'Mashtruesit', '084': 'Thyerja',
    '085': 'Kullat', '086': 'Ylli i Natës', '087': 'Më i Larti', '088': 'Mbulesa',
    '089': 'Agimi', '090': 'Qyteti', '091': 'Dielli', '092': 'Nata',
    '093': 'Drita e Mëngjesit', '094': 'Zgjerimi', '095': 'Fiku', '096': 'Gjaku i ngrirë',
    '097': 'Fati', '098': 'Provat e Qarta', '099': 'Tërmeti', '100': 'Vrapuesit',
    '101': 'Fatkeqësia', '102': 'Grumbullimi', '103': 'Koha', '104': 'Përfolësi',
    '105': 'Elefanti', '106': 'Kurejshët', '107': 'Ndihma e vogël', '108': 'Shumësia',
    '109': 'Mohuesit', '110': 'Ndihma', '111': 'Fibrat', '112': 'Sinqeriteti',
    '113': 'Agimi', '114': 'Njerëzit'
  },
  'Tagalog': {
    '001': 'Ang Pagbubukas', '002': 'Ang Baka', '003': 'Ang Pamilya ni Imran', '004': 'Ang mga Kababaihan',
    '005': 'Ang Hapag', '006': 'Ang mga Hayop', '007': 'Ang mga Mataas na Lugar', '008': 'Ang Samsam',
    '009': 'Ang Pagsisisi', '010': 'Si Jonas', '011': 'Si Hud', '012': 'Si Jose',
    '013': 'Ang Kulog', '014': 'Si Abraham', '015': 'Ang Batuhan', '016': 'Ang Bubuyog',
    '017': 'Ang Paglalakbay sa Gabi', '018': 'Ang Yungib', '019': 'Si Maria', '020': 'Ta-Ha',
    '021': 'Ang mga Propeta', '022': 'Ang Pagpeperegrino', '023': 'Ang mga Mananampalataya', '024': 'Ang Liwanag',
    '025': 'Ang Pamantayan', '026': 'Ang mga Makata', '027': 'Ang mga Langgam', '028': 'Ang Kasaysayan',
    '029': 'Ang Gagamba', '030': 'Ang mga Romano', '031': 'Si Luqman', '032': 'Ang Pagluhod',
    '033': 'Ang Koalisyon', '034': 'Si Sheba', '035': 'Ang Lumikha', '036': 'Ya-Sin',
    '037': 'Ang mga Nakapila', '038': 'Sad', '039': 'Ang mga Grupo', '040': 'Ang Nagpapatawad',
    '041': 'Malinaw na Ipinaliwanag', '042': 'Ang Konsultasyon', '043': 'Ang Palamuting Ginto', '044': 'Ang Usok',
    '045': 'Ang Pagluhod', '046': 'Ang mga Buhanginan', '047': 'Si Muhammad', '048': 'Ang Tagumpay',
    '049': 'Ang mga Silid', '050': 'Qaf', '051': 'Ang mga Hangin', '052': 'Ang Bundok',
    '053': 'Ang Bituin', '054': 'Ang Buwan', '055': 'Ang Mahabagin', '056': 'Ang Kaganapan',
    '057': 'Ang Bakal', '058': 'Ang Nakikipagdebate', '059': 'Ang Pagtitipon', '060': 'Ang Sinusubok',
    '061': 'Ang Hanay', '062': 'Ang Biyernes', '063': 'Ang mga Mapagkunwari', '064': 'Ang Pagtataksil',
    '065': 'Ang Diborsyo', '066': 'Ang Pagbabawal', '067': 'Ang Kaharian', '068': 'Ang Pluma',
    '069': 'Ang Katotohanan', '070': 'Ang mga Hagdan', '071': 'Si Noe', '072': 'Ang mga Jinn',
    '073': 'Ang Nakabalot', '074': 'Ang Natatakpan', '075': 'Ang Muling Pagkabuhay', '076': 'Ang Tao',
    '077': 'Ang mga Ipinadala', '078': 'Ang Balita', '079': 'Ang mga Bumabatak', '080': 'Kumunot ang noo',
    '081': 'Ang Pagbabalot', '082': 'Ang Pagbitak', '083': 'Ang mga Nandadaya', '084': 'Ang Pagbasag',
    '085': 'Ang mga Tore', '086': 'Ang Bituin ng Gabi', '087': 'Ang Kataas-taasan', '088': 'Ang Sumasaklaw',
    '089': 'Ang Bukang-liwayway', '090': 'Ang Lungsod', '091': 'Ang Araw', '092': 'Ang Gabi',
    '093': 'Ang Umaga', '094': 'Ang Pagpapalaki', '095': 'Ang Igos', '096': 'Ang Duguang Kulo',
    '097': 'Ang Kapalaran', '098': 'Ang Malinaw na Katibayan', '099': 'Ang Lindol', '100': 'Ang mga Tumatakbo',
    '101': 'Ang Trahedya', '102': 'Ang Pagdami', '103': 'Ang Panahon', '104': 'Ang Mapamahiya',
    '105': 'Ang Elepante', '106': 'Ang Quraish', '107': 'Ang Maliit na Kabutihan', '108': 'Ang Kasaganaan',
    '109': 'Ang mga Hindi Naniniwala', '110': 'Ang Tulong', '111': 'Ang mga Hibla', '112': 'Ang Katapatan',
    '113': 'Ang Pagsikat ng Araw', '114': 'Ang Sangkatauhan'
  }
};

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

console.log('Applying native surah names to Deutsch, Albanisch, and Tagalog...\n');

for (const langName of ['Deutsch', 'Albanisch', 'Tagalog']) {
  const names = surahNames[langName];
  const langDir = path.join(translationsDir, langName);
  const indexPath = path.join(langDir, 'index.html');
  const surenDir = path.join(langDir, 'suren');
  
  if (!fs.existsSync(indexPath) || !fs.existsSync(surenDir)) {
    console.log(`⚠ ${langName}: Missing files`);
    continue;
  }

  // Read index
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  let indexUpdated = 0;
  
  // Update each entry in index
  for (const [num, nativeName] of Object.entries(names)) {
    const pattern = new RegExp(
      `(<a href="suren/${num}-[^"]+?"[^>]*class="row">\\s*<span class="rn">${num}</span>\\s*<span class="ra">[^<]+</span>\\s*<span class="ri"><span class="rs">[^<]+</span><span class="rt">)[^<]+(</span></span>\\s*<span class="rv">)`,
      'g'
    );
    
    if (pattern.test(indexContent)) {
      indexContent = indexContent.replace(pattern, `$1${nativeName}$2`);
      indexUpdated++;
    }
  }
  
  if (indexUpdated > 0) {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`✓ ${langName}: Updated ${indexUpdated} index entries`);
  }

  // Update suren headers
  const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
  let surenUpdated = 0;
  
  for (const file of surenFiles) {
    const numMatch = file.match(/^(\d+)-/);
    if (!numMatch) continue;
    
    const num = numMatch[1].padStart(3, '0');
    const nativeName = names[num];
    
    if (!nativeName) continue;
    
    const surenPath = path.join(surenDir, file);
    let content = fs.readFileSync(surenPath, 'utf8');
    const original = content;
    
    // Update sh-meta (the part after ·)
    const metaPattern = /(<span class="sh-meta">[^<]+?·\s*)[^<]+(<\/span>)/;
    content = content.replace(metaPattern, `$1${nativeName}$2`);
    
    if (content !== original) {
      fs.writeFileSync(surenPath, content, 'utf8');
      surenUpdated++;
    }
  }
  
  if (surenUpdated > 0) {
    console.log(`  ✓ Updated ${surenUpdated} suren headers`);
  }
  
  console.log('');
}

console.log('✅ All three languages fixed with native translations!');
