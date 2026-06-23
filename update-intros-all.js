/**
 * UPDATE INTRODUCTIONS - All 19 Quran Languages
 * Respektvolle, allgemeine Formulierungen
 */

const fs = require('fs');
const path = require('path');

const INTRO_REPLACEMENTS = {
  'Deutsch': {
    old: 'Dieser Quran entstand aus einem einzigen Wunsch: jedem Menschen die Möglichkeit zu geben, das Wort Allahs zu lesen und zu verstehen.',
    new: 'Diese Übersetzung des Quran wurde mit dem Ziel erstellt, den heiligen Text zugänglich und verständlich zu machen.'
  },
  'Englisch': {
    old: 'This Quran was born from a single desire: to give every person the opportunity to read the word of Allah.',
    new: 'This Quran translation was created with the aim of making the holy text accessible and understandable.'
  },
  'Albanisch': {
    old: /Ky Kuran lindur nga një dëshirë e vetme:.*?\./, // Will search for similar pattern
    new: 'Kjo përkthim i Kuranit u krijua me qëllimin e bërjes të tekstit të shenjtë të arritshëm dhe të kuptueshëm.'
  },
  'Bengalisch': {
    old: /এই কুরআন জন্মেছে একটি একক ইচ্ছা থেকে:.*?\./, // Similar pattern
    new: 'এই কুরআনের অনুবাদ পবিত্র পাঠ্যকে সহজলভ্য এবং বোধগম্য করার লক্ষ্যে তৈরি করা হয়েছে।'
  },
  'Bosnisch': {
    old: /Ovaj Kuran je roñen iz jedne jedine želje:.*?\./, // Similar pattern
    new: 'Ovaj prijevod Kurana je kreiran sa ciljem da učini sveti tekst pristupačnim i razumljivim.'
  },
  'Chinesisch': {
    old: /这部古兰经源于一个单一的愿望:.*?\./, // Similar pattern
    new: '本《古兰经》译本的目的是使圣经文本易于理解和易于获取。'
  },
  'Französisch': {
    old: 'Ce Coran est né d\'un seul désir : donner à chaque personne la possibilité de lire et de comprendre la parole d\'Allah.',
    new: 'Cette traduction du Coran a été créée dans le but de rendre le texte sacré accessible et compréhensible.'
  },
  'Hausa': {
    old: /Wannan Qur\'anu ya samo asali daga burin daya kawai:.*?\./, // Similar pattern
    new: 'Wannan fassarar Qur\'anu an kawo da ita da niyya na sanya jinyar aiki mai santsi da fahimta.'
  },
  'Hindi': {
    old: /यह कुरान एक ही इच्छा से पैदा हुआ था:.*?\./, // Similar pattern
    new: 'यह कुरान अनुवाद पवित्र पाठ को सुलभ और समझने योग्य बनाने के उद्देश्य से बनाया गया था।'
  },
  'Indonesisch': {
    old: /Al-Qur\'an ini lahir dari satu keinginan saja:.*?\./, // Similar pattern
    new: 'Terjemahan Al-Qur\'an ini diciptakan dengan tujuan membuat teks suci dapat diakses dan dipahami.'
  },
  'Kasachisch': {
    old: /Бұл Құран бір ғана тілегінен туды:.*?\./, // Similar pattern
    new: 'Осы Құран аудармасы ұлы мәтінді қол жетімді және түсінік ету мақсатында құрылды.'
  },
  'Persisch': {
    old: /این قرآن از یک تنها آرزو متولد شد:.*?\./, // Similar pattern
    new: 'این ترجمه قرآن با هدف دسترسی‌پذیری و درک متن مقدس ایجاد شد.'
  },
  'Russisch': {
    old: /Этот Коран родился из одного единственного желания:.*?\./, // Similar pattern
    new: 'Этот перевод Корана был создан с целью сделать священный текст доступным и понятным.'
  },
  'Spanisch': {
    old: 'Este Corán nació de un único deseo: dar a cada persona la oportunidad de leer la palabra de Alá.',
    new: 'Esta traducción del Corán fue creada con el objetivo de hacer que el texto sagrado sea accesible y comprensible.'
  },
  'Tagalog': {
    old: /Ang Quraning ito ay ipinanganak mula sa isang nais lamang:.*?\./, // Similar pattern
    new: 'Ang pagsasaling ito ng Quran ay nilikha upang gawing accessible at maintindihan ang sagradong teksto.'
  },
  'Thailändisch': {
    old: /กัวร์อานนี้เกิดมาจากความปรารถนาเพียงประการเดียว:.*?\./, // Similar pattern
    new: 'การแปลกัวร์อานนี้ถูกสร้างขึ้นเพื่อทำให้ข้อความศักดิ์สิทธิ์เป็นที่เข้าถึงได้และเข้าใจได้'
  },
  'Türkisch': {
    old: /Bu Kuran tek bir istekten doğdu:.*?\./, // Similar pattern
    new: 'Bu Kur\'an tercümesi, kutsal metni erişilebilir ve anlaşılır kılmak amacıyla oluşturulmuştur.'
  },
  'Urdu': {
    old: /یہ قرآن ایک ہی خواہش سے پیدا ہوا:.*?\./, // Similar pattern
    new: 'یہ قرآن کا ترجمہ مقدس متن کو قابلِ رسائی اور قابلِ فہم بنانے کے مقصد سے تیار کیا گیا ہے۔'
  },
  'Uygurisch': {
    old: /بۇ قۇرئان تەنھا بىر تىلەك خالىسىدىن تۇغدى:.*?\./, // Similar pattern
    new: 'بۇ قۇرئان تەرجىمىسى مۇقەددەس تېكستنى ئىشلىتىشنى سولاھ قىلىپ، ئاسانلاشتۇرۇش ئۈچۈن تۈزۈلگەن.'
  }
};

const QURAN_PATH = 'dist-alquran/Übersetzungen';
const BIBLE_PATH = 'dist-diebibel';

function updateIntro(filePath, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (replacement.old instanceof RegExp) {
    // Regex pattern match
    if (replacement.old.test(content)) {
      content = content.replace(replacement.old, replacement.new);
    } else {
      console.log(`   ⚠️  Pattern nicht gefunden in ${path.basename(filePath)}`);
      return false;
    }
  } else {
    // Exact string match
    if (content.includes(replacement.old)) {
      content = content.replace(replacement.old, replacement.new);
    } else {
      console.log(`   ⚠️  Text nicht gefunden in ${filePath}`);
      return false;
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Update all Quran intro files
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║      UPDATE ALL INTRO TEXTS - 19 QURAN LANGUAGES           ║');
console.log('╚═════════════════════════════════════════════════════════════╝\n');

console.log('📖 QURAN INTROS:\n');

for (const lang in INTRO_REPLACEMENTS) {
  const introPath = path.join(QURAN_PATH, lang, 'intro.html');
  
  if (fs.existsSync(introPath)) {
    if (updateIntro(introPath, INTRO_REPLACEMENTS[lang])) {
      console.log(`   ✓ ${lang.padEnd(18)}`);
    }
  } else {
    console.log(`   ✗ ${lang.padEnd(18)} - Datei nicht gefunden`);
  }
}

console.log('\n═════════════════════════════════════════════════════════════\n');
console.log('✅ Alle Intro-Texte aktualisiert!\n');
