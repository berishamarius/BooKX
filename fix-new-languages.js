const fs = require('fs');
const path = require('path');

// Surah-Namen für die 5 NEUEN Sprachen
const SUREN = {
  es: ["La Apertura","La Vaca","La Familia de Imrán","Las Mujeres","La Mesa Servida","El Ganado","Los Muros","El Botín","El Arrepentimiento","Jonás","Hud","José","El Trueno","Abraham","La Roca","Las Abejas","El Viaje Nocturno","La Cueva","María","Ta-Ha","Los Profetas","La Peregrinación","Los Creyentes","La Luz","El Criterio","Los Poetas","Las Hormigas","Las Historias","La Araña","Los Romanos","Luqmán","La Postración","Los Confederados","Saba","El Originador","Ya-Sin","Los Ordenados en Filas","Sad","Los Grupos","El Perdonador","Expresado en Detalle","La Consulta","La Ornamentación de Oro","El Humo","Los que se Arrodillan","Las Arenas Movedizas","Muhammad","La Victoria","Las Habitaciones","Qaf","Los Que Esparcen","La Montaña","La Estrella","La Luna","El Clemente","Lo Ineludible","El Hierro","La Que Discute","El Destierro","La Que es Probada","Las Filas","El Viernes","Los Hipócritas","El Engaño Mutuo","El Divorcio","La Prohibición","La Soberanía","La Pluma","La Verdad Ineludible","Los Peldaños del Ascenso","Noé","Los Genios","El Envuelto","El Cubierto","La Resurrección","El Hombre","Los Enviados","La Noticia","Los Que Arrancan","Frunció el Ceño","El Enrollamiento","La Hendidura","El Defraudador","La Grieta","Las Constelaciones","La Estrella Nocturna","El Altísimo","La Abrumadora","El Alba","La Ciudad","El Sol","La Noche","La Mañana","La Apertura (del Pecho)","La Higuera","El Coágulo","El Poder","La Evidencia Clara","El Terremoto","Los Corredores","Los Que Desgarran","Los Que Corren Velozmente","Los Que Cargan","El Tiempo","La Calumnia","El Elefante","Los Quraysh","El Obsequio","Los Infieles","El Auxilio","La Unidad","El Alba Naciente","La Humanidad"],
  fr: ["L'Ouverture","La Vache","La Famille d'Imran","Les Femmes","La Table Servie","Les Bestiaux","Les Murs","Le Butin","Le Repentir","Jonas","Hud","Joseph","Le Tonnerre","Abraham","Le Rocher","Les Abeilles","Le Voyage Nocturne","La Caverne","Marie","Ta-Ha","Les Prophètes","Le Pèlerinage","Les Croyants","La Lumière","Le Discernement","Les Poètes","Les Fourmis","L'Histoire","L'Araignée","Les Romains","Luqman","La Prosternation","Les Coalisés","Saba","Le Créateur","Ya-Sin","Ceux qui rangent les rangs","Sad","Les Groupes","Celui qui pardonne","Exposé en détail","La Consultation","L'Ornement","La Fumée","S'agenouillant","Les Sables mouvants","Muhammad","La Victoire","Les Appartements","Qaf","Ceux qui dispersent","La Montagne","L'Étoile","La Lune","Le Miséricordieux","L'Événement Inévitable","Le Fer","Celle qui discute","L'Exode","Celle qui est éprouvée","Le Rang","Le Vendredi","Les Hypocrites","La Fraude mutuelle","Le Divorce","L'Interdiction","La Royauté","La Plume","L'Inévitable Vérité","Les Degrés","Noé","Les Jinn","Celui qui s'enveloppe","Celui qui se couvre","La Résurrection","L'Homme","Ceux que l'on envoie","La Nouvelle","Ceux qui arrachent","Il a froncé les sourcils","L'Enroulement","La Fissure","Le Fraudeur","La Fissure","Les Constellations","L'Étoile du Matin","Le Très Haut","Celle qui accable","L'Aube","La Cité","Le Soleil","La Nuit","La Clarté du Matin","L'Expansion","Le Figuier","L'Adhérence","La Puissance","La Preuve","Le Tremblement","Les Coureurs","Ceux qui arrachent","Ceux qui courent avec ardeur","Ceux qui transportent","Le Temps","La Médisance","L'Éléphant","Les Quraich","L'Oblation","Les Mécréants","Le Secours","La Sincérité","L'Aube Naissante","L'Humanité"],
  tl: ["Ang Pambukasla","Ang Baka","Pamilya ni Imran","Ang Kababaihan","Ang Hapagkainan","Ang Alahas","Ang Kalasag","Ang Bansa","Ang Pagsisisi","Yunus","Hud","Yusuf","Ang Kidlat","Ibrahim","Ang Batubatuon","Ang Bubuyog","Ang Gabi-gabing Paglalakbay","Ang Kuweba","Maria","Ta-Ha","Ang Profeta","Ang Hajj","Ang Mga Naniniwala","Ang Liwanag","Ang Pagkakahiwalay","Ang Mga Hain","Ang Langgam","Ang Mga Kuwento","Ang Araw-araw na Kuwento","Ang Tagumpay","Luqman","Ang Pagpapasuko","Ang Mga Kniping ng Umaabot","Saba","Ang Lumikha","Ya-Sin","Ang mga Nagkakahanay","Sad","Ang Mga Magkakaubay","Ang Nakapatanggap ng Pag-asa","Ang Detalyadong Pagsasalita","Ang Pakikipag-ugnayan","Ang Ganda ng Ginto","Ang Usok","Ang Nagtitiklo sa Tuhod","Ang Gumagalaw ng Buhangin","Muhammad","Ang Tagumpay","Ang Mga Kuwartong Minahan","Qaf","Ang Nagkalat","Ang Bundok","Ang Bituin","Ang Buwan","Ang Maaasahang","Ang Hindi Maiiwang Kaganapan","Ang Bakal","Ang Nangikipag-usap","Ang Sinusubukan","Ang Pila","Ang Biyernes","Ang Mga Mapagkukupihan","Ang Kapintasan ng Tiwala","Ang Paghihiwalay","Ang Ipinagbawal","Ang Kaharian","Ang Pluma","Ang Totoo","Ang Yugto","Noe","Ang Mga Djinn","Ang Nakabalot","Ang Nilagyan ng Belo","Ang Pagkakabuhay","Ang Tao","Ang Ipinapadala","Ang Balita","Ang Humihila","Ito ay Kumunot-noo","Ang Pagsusukatan","Ang Pagkabigay","Ang Manlalaglag","Ang Tunay na Kalamidad","Ang Mga Bituin","Ang Umaga ng Tala","Ang Pinakamataas","Ang Nakakasama","Ang Maaga Ng Umaga","Ang Siyudad","Ang Araw","Ang Gabi","Ang Liwanag ng Umaga","Ang Pagpapalawak","Ang Figo","Ang Latay","Ang Kapangyarihan","Ang Malinaw na Ebidensya","Ang Lindol","Ang Mabilis na Takbo","Ang Pumigil","Ang Mabilis na Lumipat","Ang Naghahatid","Ang Panahon","Ang Pagsasabing Masamang Salita","Ang Liyong","Ang Quraysh","Ang Alok","Ang mga Hindi Sumasakop","Ang Tulong","Ang Pagkakaisa","Ang Umaga ng Pagsikat","Ang Sangkatauhan"],
  th: ["การเปิด","วัว","ครอบครัวของอิหม่าม","ผู้หญิง","โต๊ะอาหาร","ปศุสัตว์","กำแพง","กำไร","การกลับใจ","โยนัส","ฮูด","ยูซุฟ","ฟ้าร้อง","อิบราฮีม","หิน","ผึ้ง","การเดินทางยามค่ำคืน","ถ้ำ","มารีย์ห","ตา-ฮา","ศาสดา","ฮัจญ์","ผู้เชื่อ","แสง","เกณฑ์","กวี","มด","เรื่องราว","แมงมุม","โรมัน","ลุกมาน","การประนม","พันธมิตร","สับบา","ผู้สร้าง","ยา-ซิน","ผู้ประจำแถว","ซาด","กลุ่ม","ผู้ให้อภัย","อธิบายโดยละเอียด","การปรึกษา","เครื่องประดับทอง","ควัน","ผู้ที่คุกเข่า","ทรายเคลื่อนไหว","มูฮัมมัด","ชัยชนะ","ห้องพัก","กาฟ","ผู้ที่กระจาย","ภูเขา","ดาว","ดวงจันทร์","ผู้เมตตา","เหตุการณ์ที่หลีกเลี่ยงไม่ได้","เหล็ก","ผู้ที่อภิปราย","การเนรเทศ","ผู้ที่ได้รับการทดสอบ","อันดับ","วันศุกร์","ผู้หลอกลวง","การหลอกลวงร่วมกัน","การหย่าร้าง","การห้าม","อาณาจักร","ปากกา","ความจริงที่หลีกเลี่ยงไม่ได้","ขั้นตอน","โนอาห์","จินนี","ผู้ที่ห่อหุ้ม","ผู้ที่ปกคลุม","การลุกขึ้นมาใหม่","มนุษย์","ผู้ถูกส่ง","ข่าวสาร","ผู้ที่ดึง","เขาขมวดคิ้ว","การจัด","ความเงี่ยง","ผู้หลอก","ความเงี่ยง","กลุ่มดาว","ดาวเจ้า","ผู้สูงสุด","ผู้บดบัง","รุ่งอรุณ","เมือง","ดวงอาทิตย์","คืน","แสงสาง","การขยาย","มะเดื่อ","บ่วงแหวน","อำนาจ","หลักฐานชัดเจน","แผ่นดินไหว","ผู้วิ่ง","ผู้ดึง","ผู้วิ่งอย่างรวดเร็ว","ผู้บรรทุก","เวลา","การกล่าวหาอย่างร้าย","ช้าง","คุเรช","เงิน","ผู้ปฏิเสธ","ความช่วยเหลือ","ตัวตน","รุ่งอรุณ","มนุษยชาติ"],
  kk: ["Ашу құлышы","Сиыр","Ағарым Ғашылыр","Әйелдер","Ішек іле","Малдар","Қалалар","Ғанаметі","Түбіндік","Юнус","Һүд","Юсуф","Күндіктің сәні","Ибрахим","Тау","Ара","Түнгі сапар","Ғара","Марям","Та-һа","Ғаддар","Қажысы","Ынанғандар","Нұр","Түйіндеме","Шайырлар","Өті","Әңгімелер","Өрмекші","Рим","Лоқман","Сәджде","Іліндіштеген","Сәбә","Пайдашы","Я-Сін","Қатарланғандар","Сәд","Топтар","Ластайтын","Ырқайта бұрындалы","Кеңес","Алтын өлтіре","Түтін","Теңіздіңдіктер","Қум","Мұхаммад","Жеңіс","Бөлме","Қаф","Тарағандар","Тау","Жұлдыз","Ай","Мәртеке","Міндетті оқиға","Темір","Айтқал","Еректіңеде","Сынақ","Сәф","Жұма","Мүнәфиқтер","Өзара Алдатыс","Талақ","Сарылау","Салтанат","Қалам","Міндетті ақиқат","Сатылар","Ноһ","Джинндер","Ораушы","Қапталас","Өндіктену","Адам","Жіберіліндіктер","Хабар","Тарағайтындар","Ноқап құрады","Жасытылу","Ығырылулар","Алдайтын","Ығырылулар","Т Жұлдыздар","Түнгі жұлдыз","Ең Жоғарысы","Немесе Мәркітщі","Таң","Қала","Күннің","Түндіктің","Таң жарығы","Өндіктену","Ынжырдан","Сынқан","Қуат","Түсінік","Жер сілкінудің","Жүргіндіктер","Сымдаушылар","Ым жүргіндіктер","Сөндіндіктер","Уақыт","Сондағы","Піл","Құрайш","Сыйлық","Сеніміндіктеуіш","Анықтағындақ","Ғайта ағымы","Бір кімге","Таңның жарығы","Адамзат"],
};

// Übersetzungen für Buttons/Navigation
const NAV_TRANS = {
  es: { intro: 'Prefacio', back: 'Rückseite →', forward: '← Prefacio' },
  fr: { intro: 'Préface', back: 'Rückseite →', forward: '← Préface' },
  tl: { intro: 'Pambungad', back: 'Rückseite →', forward: '← Pambungad' },
  th: { intro: 'คำนำ', back: 'Rückseite →', forward: '← คำนำ' },
  kk: { intro: 'Кіріспе', back: 'Rückseite →', forward: '← Кіріспе' },
};

// Neue Sprachen
const NEW_LANGS = {
  Spanisch: 'es',
  Französisch: 'fr',
  Tagalog: 'tl',
  Thailändisch: 'th',
  Kasachisch: 'kk',
};

let total = 0;

// 1. Fix Quran index.html (fix Surah names)
for (const [langName, langCode] of Object.entries(NEW_LANGS)) {
  const indexPath = `AL-QURAN/Übersetzungen/${langName}/index.html`;
  if (!fs.existsSync(indexPath)) continue;
  
  let html = fs.readFileSync(indexPath, 'utf8');
  const names = SUREN[langCode];
  
  // Remove meta copyright
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  
  // Remove footer completely
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  // Remove disclaimer paragraph
  html = html.replace(/<p class="disclaimer"[\s\S]*?<\/p>/g, '');
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  // Fix Surah names in .rs spans
  for (let i = 0; i < names.length; i++) {
    const oldEn = ["Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Ad-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadilah","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","'Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat","Al-Qari'ah","Al-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Maun","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"][i];
    if (oldEn) {
      html = html.replace(`<span class="rs">${oldEn}</span>`, `<span class="rs">${names[i]}</span>`);
    }
  }
  
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✓ ${langName} index.html fixed`);
  total++;
}

// 2. Fix intro.html - remove disclaimer + copyright
for (const [langName, langCode] of Object.entries(NEW_LANGS)) {
  const introPath = `AL-QURAN/Übersetzungen/${langName}/intro.html`;
  if (!fs.existsSync(introPath)) continue;
  
  let html = fs.readFileSync(introPath, 'utf8');
  
  // Remove meta copyright
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  
  // Remove footer completely
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  // Remove any copyright or disclaimer text
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  fs.writeFileSync(introPath, html, 'utf8');
  console.log(`✓ ${langName} intro.html cleaned`);
  total++;
}

// 3. Fix back-cover.html - remove disclaimer
for (const [langName, langCode] of Object.entries(NEW_LANGS)) {
  const bcPath = `AL-QURAN/Übersetzungen/${langName}/back-cover.html`;
  if (!fs.existsSync(bcPath)) continue;
  
  let html = fs.readFileSync(bcPath, 'utf8');
  
  // Remove meta copyright
  html = html.replace(/<meta name="copyright"[^>]*>/g, '');
  
  // Remove footer completely
  html = html.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  // Remove .pl disclaimer
  html = html.replace(/<div class="pl">[\s\S]*?<\/div>/g, '');
  
  // Remove any copyright or disclaimer text
  html = html.replace(/<p[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<div[^>]*>(?:Sinngemäße|Copyright|Translation|Disclaimer|©)[\s\S]*?<\/div>/gi, '');
  
  fs.writeFileSync(bcPath, html, 'utf8');
  console.log(`✓ ${langName} back-cover.html cleaned`);
  total++;
}

console.log(`\n✅ ${total} files fixed`);
