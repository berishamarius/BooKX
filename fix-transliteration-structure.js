const fs = require('fs');
const path = require('path');

// TRANSLITERATION (lateinische Schrift) - DIESE kommen in .rs (groß)
const TRANSLIT = [
  'Al-Fatihah', 'Al-Baqarah', "Ali 'Imran", 'An-Nisa', "Al-Ma'idah", "Al-An'am", 
  "Al-A'raf", 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', "Ar-Ra'd", 'Ibrahim',
  'Al-Hijr', 'An-Nahl', "Al-Isra'", 'Al-Kahf', 'Maryam', 'Ta-Ha', "Al-Anbiya'",
  'Al-Hajj', "Al-Mu'minun", 'An-Nur', 'Al-Furqan', "Ash-Shu'ara'", 'An-Naml',
  'Al-Qasas', "Al-'Ankabut", 'Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab', "Saba'",
  'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir', 'Fussilat',
  'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah', 'Al-Ahqaf', 'Muhammad',
  'Al-Fath', 'Al-Hujurat', 'Qaf', 'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar',
  'Ar-Rahman', "Al-Waqi'ah", 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahanah',
  'As-Saff', "Al-Jumu'ah", 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq', 'At-Tahrim',
  'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', "Al-Ma'arij", 'Nuh', 'Al-Jinn', 'Al-Muzzammil',
  'Al-Muddaththir', 'Al-Qiyamah', 'Al-Insan', 'Al-Mursalat', "An-Naba'", "An-Nazi'at",
  "'Abasa", 'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', "Al-A'la", 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl',
  'Ad-Duha', 'Ash-Sharh', 'At-Tin', "Al-'Alaq", 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah',
  "Al-'Adiyat", "Al-Qari'ah", 'At-Takathur', "Al-'Asr", 'Al-Humazah', 'Al-Fil',
  'Quraysh', "Al-Ma'un", 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas',
  'Al-Falaq', 'An-Nas'
];

// LOKALE ÜBERSETZUNGEN - DIESE kommen in .rt (klein)
const LOCAL_NAMES = {
  'Spanisch': [
    'La Apertura', 'La Vaca', 'La Familia de Imrán', 'Las Mujeres', 'La Mesa Servida',
    'El Ganado', 'Los Muros', 'El Botín', 'El Arrepentimiento', 'Jonás', 'Hud', 'José',
    'El Trueno', 'Abraham', 'Al-Hijr', 'Las Abejas', 'El Viaje Nocturno', 'La Caverna',
    'María', 'Ta-Ha', 'Los Profetas', 'La Peregrinación', 'Los Creyentes', 'La Luz',
    'El Criterio', 'Los Poetas', 'Las Hormigas', 'La Narración', 'La Araña', 'Los Romanos',
    'Luqman', 'La Prosternación', 'Los Aliados', 'Saba', 'El Originador', 'Ya-Sin',
    'Los Alineados', 'Sad', 'Los Grupos', 'El Perdonador', 'Explicadas', 'La Consulta',
    'El Adorno', 'El Humo', 'La Arrodillada', 'Las Dunas', 'Muhammad', 'La Victoria',
    'Las Habitaciones', 'Qaf', 'Los Vientos', 'El Monte', 'La Estrella', 'La Luna',
    'El Misericordioso', 'El Acontecimiento', 'El Hierro', 'La Discusión', 'El Exilio',
    'La Examinada', 'La Fila', 'El Viernes', 'Los Hipócritas', 'El Engaño', 'El Divorcio',
    'La Prohibición', 'La Soberanía', 'La Pluma', 'La Realidad', 'Las Vías', 'Noé',
    'Los Genios', 'El Arropado', 'El Envuelto', 'La Resurrección', 'El Hombre',
    'Los Enviados', 'La Noticia', 'Los Arrancadores', 'Frunció', 'El Enrollamiento',
    'La Hendidura', 'Los Defraudadores', 'La Ruptura', 'Las Constelaciones', 'El Nocturno',
    'El Altísimo', 'La Abrumadora', 'El Alba', 'La Ciudad', 'El Sol', 'La Noche',
    'La Mañana', 'La Abertura', 'La Higuera', 'El Coágulo', 'El Decreto', 'La Evidencia',
    'El Terremoto', 'Los Corceles', 'La Calamidad', 'La Competencia', 'La Tarde',
    'El Difamador', 'El Elefante', 'Quraish', 'La Ayuda', 'La Abundancia', 'Los Incrédulos',
    'El Auxilio', 'Las Fibras', 'La Sinceridad', 'El Amanecer', 'La Humanidad'
  ],
  'Französisch': [
    "L'Ouverture", 'La Vache', "La Famille d'Imran", 'Les Femmes', 'La Table Servie',
    'Les Bestiaux', 'Les Murs', 'Le Butin', 'Le Repentir', 'Jonas', 'Hud', 'Joseph',
    'Le Tonnerre', 'Abraham', 'Al-Hijr', 'Les Abeilles', 'Le Voyage Nocturne', 'La Caverne',
    'Marie', 'Ta-Ha', 'Les Prophètes', 'Le Pèlerinage', 'Les Croyants', 'La Lumière',
    'Le Critère', 'Les Poètes', 'Les Fourmis', 'Le Récit', "L'Araignée", 'Les Romains',
    'Luqman', 'La Prosternation', 'Les Coalisés', 'Saba', 'Le Créateur', 'Ya-Sin',
    'Les Rangés', 'Sad', 'Les Groupes', 'Le Pardonneur', 'Les Versets Détaillés',
    'La Consultation', "L'Ornement", 'La Fumée', "L'Agenouillée", 'Les Dunes', 'Muhammad',
    'La Victoire', 'Les Appartements', 'Qaf', 'Qui Éparpillent', 'Le Mont', "L'Étoile",
    'La Lune', 'Le Miséricordieux', "L'Événement", 'Le Fer', 'La Discussion', "L'Exode",
    "L'Éprouvée", 'Le Rang', 'Le Vendredi', 'Les Hypocrites', 'La Grande Perte', 'Le Divorce',
    "L'Interdiction", 'La Royauté', 'La Plume', "L'Inévitable", 'Les Voies', 'Noé',
    'Les Djinns', "L'Enveloppé", 'Le Revêtu', 'La Résurrection', "L'Homme", 'Les Envoyés',
    'La Nouvelle', 'Les Arrachées', 'Il fronça', "L'Obscurcissement", 'La Rupture',
    'Les Fraudeurs', 'La Déchirure', 'Les Constellations', "L'Étoile du matin", 'Le Très-Haut',
    "L'Enveloppante", "L'Aube", 'La Cité', 'Le Soleil', 'La Nuit', 'Le Jour', "L'Ouverture",
    'Le Figuier', "L'Adhérence", 'La Destinée', 'La Preuve', 'Le Séisme', 'Les Coursiers',
    'Le Fracas', 'La Course', "L'Après-midi", 'Le Calomniateur', "L'Éléphant", 'Quraych',
    "L'Ustensile", "L'Abondance", 'Les Mécréants', 'Le Secours', 'Les Fibres', 'Le Monothéisme',
    "L'Aube Naissante", 'Les Hommes'
  ],
  'Tagalog': [
    'Ang Pagbubukas', 'Ang Baka', 'Ang Pamilya ni Imran', 'Ang mga Babae', 'Ang Mesa',
    'Ang mga Hayop', 'Ang mga Pader', 'Ang Nasamsam', 'Ang Pagsisisi', 'Jonas', 'Hud',
    'Jose', 'Ang Kulog', 'Abraham', 'Al-Hijr', 'Ang mga Bubuyog', 'Ang Paglalakbay sa Gabi',
    'Ang Kuweba', 'Maria', 'Ta-Ha', 'Ang mga Propeta', 'Ang Peregrinasyon', 'Ang mga Mananampalataya',
    'Ang Liwanag', 'Ang Pamantayan', 'Ang mga Makata', 'Ang mga Langgam', 'Ang Kuwento',
    'Ang Gagamba', 'Ang mga Romano', 'Luqman', 'Ang Pagpatirapa', 'Ang mga Alyado', 'Saba',
    'Ang Lumikha', 'Ya-Sin', 'Ang mga Nakahanay', 'Sad', 'Ang mga Pangkat', 'Ang Mapagpatawad',
    'Nilinaw', 'Ang Konsultasyon', 'Ang Palamuti', 'Ang Usok', 'Ang Lumuluhod', 'Ang mga Burol',
    'Muhammad', 'Ang Tagumpay', 'Ang mga Silid', 'Qaf', 'Ang Nagkakalat', 'Ang Bundok',
    'Ang Bituin', 'Ang Buwan', 'Ang Maawain', 'Ang Pangyayari', 'Ang Bakal', 'Ang Debate',
    'Ang Paglalayag', 'Ang Sinusubok', 'Ang Hanay', 'Ang Biyernes', 'Ang mga Mapagkunwari',
    'Ang Pandaraya', 'Ang Diborsyo', 'Ang Pagbabawal', 'Ang Kaharian', 'Ang Pluma',
    'Ang Katotohanan', 'Ang mga Landas', 'Noe', 'Ang mga Jinn', 'Ang Nakabalot', 'Ang Nakatakip',
    'Ang Pagkabuhay', 'Ang Tao', 'Ang mga Sinugo', 'Ang Balita', 'Ang mga Bumanat',
    'Sumimangot', 'Ang Pag-ikot', 'Ang Pagkabitak', 'Ang mga Mandadaya', 'Ang Pagkahati',
    'Ang mga Konstelasyon', 'Ang Bituin sa Umaga', 'Ang Kataas-taasan', 'Ang Nakasaklaw',
    'Ang Bukang-liwayway', 'Ang Lungsod', 'Ang Araw', 'Ang Gabi', 'Ang Umaga', 'Ang Pagbukas',
    'Ang Igos', 'Ang Dugo', 'Ang Kapangyarihan', 'Ang Patunay', 'Ang Lindol', 'Ang mga Kabayo',
    'Ang Kalamidad', 'Ang Kumpetensya', 'Ang Hapon', 'Ang Pamumuna', 'Ang Elepante',
    'Quraish', 'Ang Tulong', 'Ang Kasaganaan', 'Ang mga Di-Naniniwala', 'Ang Saklolo',
    'Ang mga Hibla', 'Ang Pagkakaisa', 'Ang Bukang-liwayway', 'Ang Sangkatauhan'
  ],
  'Thailändisch': [
    'การเปิด', 'วัว', 'ครอบครัวของอิมราน', 'ผู้หญิง', 'โต๊ะอาหาร', 'สัตว์เลี้ยง',
    'กำแพง', 'ของที่ริบได้', 'การกลับใจ', 'โยนาห์', 'ฮูด', 'โยเซฟ', 'ฟ้าร้อง', 'อับราฮัม',
    'อัล-ฮิจญ์ร์', 'ผึ้ง', 'การเดินทางกลางคืน', 'ถ้ำ', 'มารีย์ยัม', 'ฏอฮา', 'บรรดาศาสดา',
    'การแสวงบุญ', 'ผู้ศรัทธา', 'แสงสว่าง', 'เกณฑ์', 'บรรดากวี', 'มด', 'เรื่องเล่า',
    'แมงมุม', 'ชาวโรมัน', 'ลุกมาน', 'การกราบ', 'พันธมิตร', 'ซะบา', 'ผู้สร้าง', 'ยาซีน',
    'เรียงแถว', 'ศอด', 'กลุ่ม', 'ผู้อภัย', 'อธิบายแล้ว', 'การปรึกษา', 'เครื่องประดับ',
    'ควัน', 'คุกเข่า', 'เนินทราย', 'มุฮัมหมัด', 'ชัยชนะ', 'ห้องพัก', 'กอฟ', 'ลมที่พัดกระจาย',
    'ภูเขา', 'ดาว', 'ดวงจันทร์', 'ผู้เมตตา', 'เหตุการณ์', 'เหล็ก', 'การโต้แย้ง', 'การเนรเทศ',
    'ผู้ถูกทดสอบ', 'แถว', 'วันศุกร์', 'คนหน้าซื่อใจคด', 'การหลอกลวง', 'การหย่า',
    'การห้าม', 'อำนาจ', 'ปากกา', 'ความจริง', 'เส้นทาง', 'โนอาห์', 'ญิน', 'ผู้ห่มผ้า',
    'ผู้คลุม', 'การฟื้นคืน', 'มนุษย์', 'ผู้ถูกส่ง', 'ข่าว', 'ผู้ดึงออก', 'ขมวดคิ้ว',
    'การหมุน', 'การแตก', 'คนโกง', 'การแยก', 'กลุ่มดาว', 'ดาวยามเช้า', 'ผู้สูงสุด',
    'ผู้ครอบงำ', 'รุ่งอรุณ', 'เมือง', 'ดวงอาทิตย์', 'กลางคืน', 'เช้า', 'การเปิด',
    'มะเดื่อ', 'ลิ่มเลือด', 'พระประสงค์', 'หลักฐาน', 'แผ่นดินไหว', 'ม้า', 'หายนะ',
    'การแข่งขัน', 'บ่าย', 'ผู้นินทา', 'ช้าง', 'กุไรช์', 'ความช่วยเหลือ', 'ความอุดมสมบูรณ์',
    'ผู้ปฏิเสธ', 'การช่วยเหลือ', 'เส้นใย', 'ความบริสุทธิ์', 'รุ่งเช้า', 'มนุษยชาติ'
  ],
  'Kasachisch': [
    'Ашушы', 'Сиыр', 'Имран отбасы', 'Әйелдер', 'Дастархан', 'Мал', 'Қабырғалар',
    'Олжа', 'Тәубе', 'Жүніс', 'Һүд', 'Жүсіп', 'Күн күркіреуі', 'Ибраһим', 'Әл-Хиджр',
    'Ара', 'Түнгі сапар', 'Үңгір', 'Мәриям', 'Та-Ха', 'Пайғамбарлар', 'Қажылық',
    'Мүміндер', 'Жарық', 'Өлшем', 'Ақындар', 'Құмырсқалар', 'Хикая', 'Өрмекші',
    'Римдіктер', 'Лұқман', 'Сәжде', 'Одақтастар', 'Сәба', 'Жаратушы', 'Я-Син',
    'Тізілгендер', 'Сад', 'Топтар', 'Кешіруші', 'Түсіндірілген', 'Кеңес', 'Безендіру',
    'Түтін', 'Тізе бүкті', 'Құмтөбелер', 'Мұхаммед', 'Жеңіс', 'Бөлмелер', 'Қаф',
    'Шашыратушылар', 'Тау', 'Жұлдыз', 'Ай', 'Мейірімді', 'Оқиға', 'Темір', 'Дау',
    'Қоныс аудару', 'Сыналған', 'Қатар', 'Жұма', 'Екіжүзділер', 'Алдау', 'Ажырасу',
    'Тыйым', 'Билік', 'Қалам', 'Шындық', 'Жолдар', 'Нұх', 'Жындар', 'Оралған',
    'Жабылған', 'Қайта тірілу', 'Адам', 'Жіберілгендер', 'Хабар', 'Сұғушылар',
    'Қабақ түйді', 'Айналу', 'Жарылу', 'Алаяқтар', 'Бөліну', 'Шоқжұлдыздар',
    'Таң жұлдызы', 'Ең жоғары', 'Қоршаушы', 'Таң', 'Қала', 'Күн', 'Түн', 'Таң',
    'Ашу', 'Інжір', 'Қан ұйығы', 'Тағдыр', 'Дәлел', 'Жер сілкініс', 'Жылқылар',
    'Апат', 'Жарыс', 'Екінді', 'Жала жаушы', 'Піл', 'Құрайш', 'Көмек', 'Молшылық',
    'Кәпірлер', 'Жәрдем', 'Жіптер', 'Біртектілік', 'Таң', 'Адамзат'
  ]
};

console.log('🔧 RESTRUCTURING: Transliteration groß, Lokal klein\n');

for (const [lang, localNames] of Object.entries(LOCAL_NAMES)) {
  const langPath = path.join('AL-QURAN', 'Übersetzungen', lang);
  
  // FIX INDEX.HTML
  const indexPath = path.join(langPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Replace each Surah name
    for (let i = 0; i < TRANSLIT.length; i++) {
      const translit = TRANSLIT[i];
      const localName = localNames[i];
      
      // Old structure: <span class="rs">Local Name</span>
      // New structure: <span class="rs">Transliteration</span><span class="rt">Local Name</span>
      const oldPattern = `<span class="rs">${localName}</span>`;
      const newPattern = `<span class="rs">${translit}</span><span class="rt">${localName}</span>`;
      
      html = html.split(oldPattern).join(newPattern);
    }
    
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log(`✓ ${lang}/index.html - Translit groß, lokal klein`);
  }
  
  // FIX ALL SURAH FILES
  const surenPath = path.join(langPath, 'suren');
  if (fs.existsSync(surenPath)) {
    const surahFiles = fs.readdirSync(surenPath).filter(f => f.endsWith('.html'));
    for (let i = 0; i < surahFiles.length; i++) {
      const file = surahFiles[i];
      const filePath = path.join(surenPath, file);
      let html = fs.readFileSync(filePath, 'utf-8');
      
      // Remove COPYRIGHT
      html = html.replace(/<meta[^>]*copyright[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*name="?author"?[^>]*>/gi, '');
      
      // Fix Surah title structure in header
      const translit = TRANSLIT[i];
      const localName = localNames[i];
      
      const oldPattern = `<span class="rs">${localName}</span>`;
      const newPattern = `<span class="rs">${translit}</span><span class="rt">${localName}</span>`;
      
      html = html.split(oldPattern).join(newPattern);
      
      fs.writeFileSync(filePath, html, 'utf-8');
    }
    console.log(`✓ ${lang}/suren/*.html - ${surahFiles.length} Suren fixed`);
  }
}

// SYNC TO DIST
console.log('\n📦 Syncing to dist...');

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyRecursive(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

for (const lang of Object.keys(LOCAL_NAMES)) {
  const src = path.join('AL-QURAN', 'Übersetzungen', lang);
  const dest = path.join('dist-alquran', 'Übersetzungen', lang);
  copyRecursive(src, dest);
  console.log(`✓ ${lang} → dist-alquran`);
}

console.log('\n✅ FERTIG! Struktur wie Deutsch!');
