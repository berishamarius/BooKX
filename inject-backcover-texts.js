/**
 * INJECT BACKCOVER VERSE TRANSLATIONS
 * ════════════════════════════════════════════════════════════
 * Adds translated Sura al-Fatiha to Quran backcovers
 * Adds Our Father prayer to Bible backcovers
 * Usage: node inject-backcover-texts.js
 */

const fs = require('fs');
const path = require('path');

// QURAN BACKCOVER - Sura al-Fatiha translations
const QURAN_BACKCOVERS = {
  'Spanisch': {
    suraName: 'Sura al-Fatiha – The Opening',
    verses: [
      'En el nombre de Al·lah, el Clemente, el Misericordioso.',
      'La alabanza pertenece a Al·lah, Señor de los mundos,',
      'el Clemente, el Misericordioso,',
      'Dueño del Día del Juicio.',
      'A Ti solo te adoramos y a Ti solo te pedimos ayuda.',
      'Guíanos por la senda recta,',
      'la senda de los que has favorecido, no la de los que incurren en Tu ira ni la de los extraviados.'
    ]
  },
  'Französisch': {
    suraName: 'Sourate al-Fatiha – L\'Ouverture',
    verses: [
      'Au nom d\'Allah, le Clément, le Miséricordieux.',
      'Louange à Allah, Seigneur de l\'univers,',
      'le Clément, le Miséricordieux,',
      'Maître du Jour de la rétribution.',
      'C\'est Toi que nous adorons et c\'est Toi que nous implorons pour l\'aide.',
      'Guide-nous dans le sentier droit,',
      'le sentier de ceux à qui Tu as fait grâce, non celui de ceux qui ont encourru Ta colère, ni celui des égarés.'
    ]
  },
  'Tagalog': {
    suraName: 'Sura al-Fatiha – Ang Pagbubukas',
    verses: [
      'Sa Ngalan ng Allah, ang Maaasahang, ang Mapagkamalayang-pusong.',
      'Ang papuri ay pang-Allah, ang Panginoon ng mga sansinukuban,',
      'ang Maaasahang, ang Mapagkamalayang-pusong,',
      'ang Hari ng Araw ng Paghahatol.',
      'Ikaw lang ang aming inaabot-kamay at ikaw lang ang aming hinihiling tulong.',
      'Gabayan kami sa tuwid na landas,',
      'ang landas ng mga sinagot mo ng biyaya, hindi ng mga nakakuha ng galit, at hindi ng mga nabigo.'
    ]
  },
  'Thailändisch': {
    suraName: 'สูระห์อัลฟาติหะห์ – การเปิด',
    verses: [
      'บิสมิ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'ในนามของอัลลอฮ์ ผู้คุณเมตตามากที่สุด ผู้เมตตายิ่ง',
      'คำสรรเสริญทั้งสิ้นแด่อัลลอฮ์ ผู้เป็นพระเจ้าแห่งสิ่งมีชีวิตทั้งปวง',
      'ผู้คุณเมตตามากที่สุด ผู้เมตตายิ่ง',
      'ผู้เป็นเจ้าของวันแห่งการพิพากษา',
      'เพียงพระองค์เท่านั้นที่เราปกครองและเพียงพระองค์เท่านั้นที่เราขอความช่วยเหลือ',
      'โปรดชี้นำเราให้เดินในทางที่ถูกต้อง',
      'ในทางของผู้ที่พระองค์ได้ประทานพระกรุณา มิใช่ทางของผู้ที่ได้รับพระพิโรธ และไม่ใช่ทางของผู้ที่หลงทาง'
    ]
  },
  'Kasachisch': {
    suraName: 'Сұра әл-Фатиха – Ашылым',
    verses: [
      'Рахмалы, ірімді Алла атымен бастаймын.',
      'Барлық хвала әлемнің Құдайы Алла еніне тән.',
      'Рахмалы, ірімді Құдай,',
      'Сот күнінің иесі.',
      'Тек Сены ғана табынамыз және тек Сенден ғана көмек сұраймыз.',
      'Бізді тура жолға өңгектеңіз,',
      'сенің рахметін табушылардың жолына, ғашым ашылғандармың емес және адасқандармың да емес.'
    ]
  }
};

// BIBLE BACKCOVER - Our Father prayer translations
const BIBLE_BACKCOVERS = {
  'syriac': {
    title: 'ܨܠܘܬܐ ܡܪܝܐ (The Lord\'s Prayer)',
    verses: [
      'ܐܒܘܢ ܕܒܫܡܝܐ',
      'ܐܝܬܘܗܝ ܫܡܟ ܩܕܝܫܐ',
      'ܬܐܬܐ ܡܠܟܘܬܟ',
      'ܢܗܘܐ ܨܒܝܢܟ ܐܝܟܢܐ ܒܫܡܝܐ ܐܦ ܒܐܪܥܐ',
      'ܠܚܡܢ ܕܠܡܬܪܐ ܗܒ ܠܢ ܝܘܡܢܐ',
      'ܘܫܒܘܩ ܠܢ ܚܘܒܝܢ ܐܝܟܢܐ ܕܐܦ ܚܢܢ ܫܒܩܢ ܠܡܢ ܕܚܐܒ ܠܢ',
      'ܘܠܐ ܬܛܝܒܢ ܠܢܣܝܘܢܐ ܐܠܐ ܡܨܠܝܢ ܠܢ ܡܢ ܒܝܫܐ'
    ]
  },
  'armenian': {
    title: 'Տեր Մեր Աղոթք (The Lord\'s Prayer)',
    verses: [
      'Հայր մեր, որ ես երկինքում,',
      'Մեծանա քո անունը։',
      'Գա քո թագավորությունը։',
      'Թող լինի քո կամքը ինչպես երկինքում, այնպես էլ երկրի վրա։',
      'Այսօ մեր կամ ճաշակ տուր մեզ։',
      'Եւ թողիր մեզ մեր պարտքերը, ինչպես որ մենք թողել ենք մեր պարտապաններին։',
      'Եւ մեզ մի բերեր փորձության մեջ, այլ ազատիր մեզ չարից։'
    ]
  }
};

function injectQuranBackcovers() {
  const baseDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen');
  let count = 0;
  
  for (const [langDir, data] of Object.entries(QURAN_BACKCOVERS)) {
    const backCoverPath = path.join(baseDir, langDir, 'back-cover.html');
    if (!fs.existsSync(backCoverPath)) {
      console.log(`⚠ ${langDir}/back-cover.html nicht gefunden`);
      continue;
    }
    
    let html = fs.readFileSync(backCoverPath, 'utf8');
    
    // Replace verse content
    const verseHtml = data.verses.map(v => `<div>${v}</div>`).join('<br>');
    html = html.replace(/<div class="ar">[\s\S]*?<\/div>/, 
      `<div class="ar">${verseHtml}</div>`);
    
    // Replace sura name
    html = html.replace(/<div class="pl">[\s\S]*?<\/div>/, 
      `<div class="pl">${data.suraName}</div>`);
    
    fs.writeFileSync(backCoverPath, html, 'utf8');
    console.log(`✓ ${langDir} backcover updated`);
    count++;
  }
  
  console.log(`✓ Quran: ${count} backcovers injiziert`);
}

function injectBibleBackcovers() {
  const baseDir = path.join(__dirname, 'dist-diebibel');
  let count = 0;
  
  for (const [langCode, data] of Object.entries(BIBLE_BACKCOVERS)) {
    const backCoverPath = path.join(baseDir, langCode, 'back-cover.html');
    if (!fs.existsSync(backCoverPath)) {
      console.log(`⚠ ${langCode}/back-cover.html nicht gefunden`);
      continue;
    }
    
    let html = fs.readFileSync(backCoverPath, 'utf8');
    const verseHtml = data.verses.join('<br>');
    html = html.replace(/<div class="ar">[\s\S]*?<\/div>/, 
      `<div class="ar">${verseHtml}</div>`);
    
    fs.writeFileSync(backCoverPath, html, 'utf8');
    console.log(`✓ ${langCode} backcover updated`);
    count++;
  }
  
  console.log(`✓ Bible: ${count} backcovers injiziert`);
}

console.log('📚 Backcover-Texte werden injiziert...\n');
injectQuranBackcovers();
console.log();
injectBibleBackcovers();
console.log('\n✓ Fertig!');
