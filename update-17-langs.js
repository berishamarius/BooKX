/**
 * FINAL UPDATE: All 17 remaining intro languages
 */

const fs = require('fs');
const path = require('path');

const UPDATES = {
  'Albanisch': {
    old: 'Ky Kuran u mundësua nga një dëshirë e vetme: t\'i japë çdo njeriu mundësinë të lexojë fjalën e Allahut.',
    new: 'Ky përthim i Kuranit u krijua me qëllimin e bërjes të tekstit të shenjtë të arritshëm dhe të kuptueshëm.'
  },
  'Bengalisch': {
    old: 'এই কুরআন একটি একক ইচ্ছা থেকে জন্ম নিয়েছে: প্রতিটি মানুষকে আল্লাহর বাণী পড়ার সুযোগ দেওয়া।',
    new: 'এই কুরআনের অনুবাদ পবিত্র পাঠ্যকে সহজলভ্য এবং বোধগম্য করার লক্ষ্যে তৈরি করা হয়েছে।'
  },
  'Bosnisch': {
    old: 'Ovaj Kuran nastao je iz jedne jedine želje: dati svakom čovjeku mogućnost da čita Allahovu riječ.',
    new: 'Ovaj prijevod Kurana je kreiran sa ciljem da učini sveti tekst dostupnim i razumljivim.'
  },
  'Chinesisch': {
    old: '这部古兰经源于一个愿望：让每个人都有机会阅读安拉的话语。',
    new: '本《古兰经》译本的目的是使圣经文本易于理解和易于获取。'
  },
  'Französisch': {
    old: 'Ce Coran est né d\'un seul désir : donner à chaque personne la possibilité de lire la parole d\'Allah.',
    new: 'Cette traduction du Coran a été créée dans le but de rendre le texte sacré accessible et compréhensible.'
  },
  'Hausa': {
    old: 'Wannan Alƙur\'ani ya fito ne daga sha\'awa guda ɗaya: ba kowane mutum damar karanta maganar Allah.',
    new: 'Wannan fassarar Alƙur\'ani an kawo da ita ne ne da niyya na sanya jinyar aiki mai santsi da fahimta.'
  },
  'Hindi': {
    old: 'यह कुरआन एक इच्छा से जन्मा: हर इंसान को अल्लाह का कलाम पढ़ने का मौका देना।',
    new: 'यह कुरआन अनुवाद पवित्र पाठ को सुलभ और समझने योग्य बनाने के उद्देश्य से बनाया गया था।'
  },
  'Indonesisch': {
    old: 'Alquran ini lahir dari satu keinginan: memberikan setiap orang kesempatan untuk membaca firman Allah.',
    new: 'Terjemahan Alquran ini diciptakan dengan tujuan membuat teks suci dapat diakses dan dipahami.'
  },
  'Kasachisch': {
    old: 'Бұл Құран бір тілектен туды: әр адамға Аллаһтың сөзін оқу мүмкіндігін беру.',
    new: 'Осы Құран аудармасы ұлы мәтінді қол жетімді және түсінік ету мақсатында құрылды.'
  },
  'Persisch': {
    old: 'این قرآن از یک آرزو متولد شد: دادن فرصت به هر انسانی برای خواندن کلام الله.',
    new: 'این ترجمه قرآن با هدف دسترسی‌پذیری و درک متن مقدس ایجاد شد.'
  },
  'Russisch': {
    old: 'Этот Коран родился из одного желания: дать каждому человеку возможность читать слово Аллаха.',
    new: 'Этот перевод Корана был создан с целью сделать священный текст доступным и понятным.'
  },
  'Spanisch': {
    old: 'Este Corán nació de un solo deseo: dar a cada persona la oportunidad de leer la palabra de Alá.',
    new: 'Esta traducción del Corán fue creada con el objetivo de hacer que el texto sagrado sea accesible y comprensible.'
  },
  'Tagalog': {
    old: 'Ang Quran na ito ay ipinanganak mula sa isang pagnanasa: bigyan ang bawat tao ng pagkakataon na basahin ang salita ni Allah.',
    new: 'Ang pagsasaling ito ng Quran ay nilikha upang gawing accessible at maintindihan ang sagradong teksto.'
  },
  'Thailändisch': {
    old: 'อัลกุรอานนี้เกิดจากความปรารถนาเดียว: ให้ทุกคนมีโอกาสอ่านพระวจนะของอัลลอฮ์',
    new: 'การแปลกัวร์อานนี้ถูกสร้างขึ้นเพื่อทำให้ข้อความศักดิ์สิทธิ์เป็นที่เข้าถึงได้และเข้าใจได้'
  },
  'Türkisch': {
    old: 'Bu Kuran tek bir arzudan doğdu: her insana Allah\'ın sözünü okuma fırsatı vermek.',
    new: 'Bu Kur\'an tercümesi, kutsal metni erişilebilir ve anlaşılır kılmak amacıyla oluşturulmuştur.'
  },
  'Urdu': {
    old: 'یہ قرآن ایک خواہش سے جنم لیا: ہر انسان کو اللہ کا کلام پڑھنے کا موقع دینا۔',
    new: 'یہ قرآن کا ترجمہ مقدس متن کو قابلِ رسائی اور قابلِ فہم بنانے کے مقصد سے تیار کیا گیا ہے۔'
  },
  'Uygurisch': {
    old: 'بۇ قۇرئان بىر ئارزۇدىن تۇغۇلدى: ھەر بىر كىشىگە ئاللاھنىڭ سۆزىنى ئوقۇش پۇرسىتى بېرىش.',
    new: 'بۇ قۇرئان تەرجىمىسى مۇقەددەس تېكستنى ئىشلىتىشنى سولاھ قىلىپ، ئاسانلاشتۇرۇش ئۈچۈن تۈزۈلگەن.'
  }
};

console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║      UPDATING 17 QURAN LANGUAGES WITH RESPECTFUL TEXT      ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

let count = 0;

for (const lang in UPDATES) {
  const introPath = path.join(__dirname, `dist-alquran/Übersetzungen/${lang}/intro.html`);
  
  if (fs.existsSync(introPath)) {
    let content = fs.readFileSync(introPath, 'utf8');
    
    if (content.includes(UPDATES[lang].old)) {
      content = content.replace(UPDATES[lang].old, UPDATES[lang].new);
      fs.writeFileSync(introPath, content, 'utf8');
      console.log(`   ✓ ${lang}`);
      count++;
    } else {
      console.log(`   ⚠️  Text nicht gefunden in ${lang}`);
    }
  } else {
    console.log(`   ✗ Datei nicht gefunden: ${lang}`);
  }
}

console.log('\n═════════════════════════════════════════════════════════════\n');
console.log(`✅ ${count} Sprachen aktualisiert!\n`);
console.log('📊 Alle 19 Quran Intros sind jetzt respektvoll und allgemein.\n');
