const fs = require('fs');
const path = require('path');

// Lokalisierte Inhalte für jede Sprache
const localizedContent = {
  'Deutsch': {
    title: 'Rückseite · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Die Öffnende',
    dua: 'Möge Allah uns allen den geraden Weg weisen<br>und uns mit Seiner Barmherzigkeit umhüllen. Ameen.',
    navLink: '← Vorwort'
  },
  'Englisch': {
    title: 'Back Cover · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · The Opening',
    dua: 'May Allah guide us all on the straight path<br>and envelope us in His mercy. Ameen.',
    navLink: '← Introduction'
  },
  'Französisch': {
    title: 'Dos de couverture · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · L\'Ouverture',
    dua: 'Qu\'Allah nous guide tous sur le droit chemin<br>et nous enveloppe de Sa miséricorde. Amine.',
    navLink: '← Préface'
  },
  'Spanisch': {
    title: 'Contraportada · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · La Apertura',
    dua: 'Que Allah nos guíe a todos por el camino recto<br>y nos envuelva en Su misericordia. Amín.',
    navLink: '← Introducción'
  },
  'Türkisch': {
    title: 'Arka Kapak · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Açılış',
    dua: 'Allah hepimizi doğru yola iletsin<br>ve rahmetiyle kuşatsın. Amin.',
    navLink: '← Giriş'
  },
  'Russisch': {
    title: 'Задняя обложка · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Открывающая',
    dua: 'Да направит нас Аллах на прямой путь<br>и окружит Своей милостью. Аминь.',
    navLink: '← Введение'
  },
  'Persisch': {
    title: 'پشت جلد · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · گشایش',
    dua: 'خداوند همه ما را به راه راست هدایت کند<br>و در رحمت خود فرو گیرد. آمین.',
    navLink: '→ مقدمه'
  },
  'Urdu': {
    title: 'پیچھا احاطہ · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · فاتحہ',
    dua: 'اللہ ہم سب کو سیدھے راستے پر چلائے<br>اور اپنی رحمت میں لپیٹ لے۔ آمین۔',
    navLink: '→ تمہید'
  },
  'Indonesisch': {
    title: 'Sampul Belakang · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Pembukaan',
    dua: 'Semoga Allah membimbing kita semua ke jalan yang lurus<br>dan meliputi kita dengan rahmat-Nya. Amin.',
    navLink: '← Kata Pengantar'
  },
  'Bosnisch': {
    title: 'Zadnja korica · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Otvaranje',
    dua: 'Neka nas Allah vodi pravim putem<br>i obaspe Svojom milošću. Amin.',
    navLink: '← Uvod'
  },
  'Albanisch': {
    title: 'Mbështetje · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Hapja',
    dua: 'Le të na udhëzojë Allahu në rrugën e drejtë<br>dhe të na mbulojë me mëshirën e Tij. Amin.',
    navLink: '← Hyrje'
  },
  'Bengalisch': {
    title: 'পেছনের কভার · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · উদ্বোধন',
    dua: 'আল্লাহ আমাদের সবাইকে সরল পথে পরিচালিত করুন<br>এবং তাঁর রহমতে আবৃত করুন। আমীন।',
    navLink: '← ভূমিকা'
  },
  'Hindi': {
    title: 'पिछला कवर · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · प्रारंभिक',
    dua: 'अल्लाह हम सभी को सीधे रास्ते पर चलाए<br>और अपनी दया से घेर ले। आमीन।',
    navLink: '← प्रस्तावना'
  },
  'Chinesisch': {
    title: '封底 · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · 开端',
    dua: '愿真主引导我们走正道<br>并以祂的慈悯包围我们。阿敏。',
    navLink: '← 前言'
  },
  'Tagalog': {
    title: 'Likod ng Pabalat · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Pagbubukas',
    dua: 'Nawa\'y gabayan tayo ni Allah sa tuwid na landas<br>at balutin ng Kanyang awa. Amen.',
    navLink: '← Panimula'
  },
  'Hausa': {
    title: 'Bayan Murfin · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Buɗewa',
    dua: 'Bari Allah ya jagorance mu duka kan madaidaicin hanya<br>kuma ya lulluɓe mu da rahamarsa. Ameen.',
    navLink: '← Gabatarwa'
  },
  'Kasachisch': {
    title: 'Артқы мұқаба · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · Ашылу',
    dua: 'Алла барлығымызды тура жолға бағыттасын<br>және рақымымен қоршасын. Омин.',
    navLink: '← Кіріспе'
  },
  'Thailändisch': {
    title: 'ปกหลัง · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · การเปิด',
    dua: 'ขออัลลอฮฺทรงนำพาเราทุกคนไปสู่ทางที่ถูกต้อง<br>และโอบล้อมเราด้วยความเมตตาของพระองค์ อามีน',
    navLink: '← คำนำ'
  },
  'Uygurisch': {
    title: 'ئارقا مۇقاۋا · القرآن الكريم',
    pl: 'سورة الفاتحة · Al-Fatiha · ئېچىلىش',
    dua: 'ئاﷲ ھەممىمىزنى توغرا يولغا باشلىسۇن<br>ۋە رەھىمى بىلەن ئورىۋالسۇن. ئامىن.',
    navLink: '→ مۇقەددىمە'
  }
};

const baseDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen');

let fixed = 0;
let errors = [];

for (const [lang, content] of Object.entries(localizedContent)) {
  const backCoverPath = path.join(baseDir, lang, 'back-cover.html');
  
  if (!fs.existsSync(backCoverPath)) {
    console.log(`⚠️  ${lang}: back-cover.html nicht gefunden`);
    continue;
  }
  
  try {
    let html = fs.readFileSync(backCoverPath, 'utf-8');
    
    // 1. Titel korrigieren
    html = html.replace(/<title>[^<]+<\/title>/, `<title>${content.title}</title>`);
    
    // 2. Farben korrigieren: rgba(201,168,76,...) → rgba(192,155,60,...)
    html = html.replace(/rgba\(201,168,76,/g, 'rgba(192,155,60,');
    
    // 3. Prüfen ob .pl existiert, sonst hinzufügen
    if (!html.includes('class="pl"')) {
      // Füge .pl vor .ar ein
      html = html.replace(
        /(<div class="overlay">)\s*(<div class="ar")/,
        `$1\n    <div class="pl">${content.pl}</div>\n    $2`
      );
    } else {
      // .pl existiert, ersetze Inhalt
      html = html.replace(
        /<div class="pl"[^>]*>.*?<\/div>/s,
        `<div class="pl">${content.pl}</div>`
      );
    }
    
    // 4. Dua korrigieren
    html = html.replace(
      /<div class="dua"[^>]*>.*?<\/div>/s,
      `<div class="dua">${content.dua}</div>`
    );
    
    // 5. Nav-Link korrigieren
    html = html.replace(
      /<a class="nav-b"[^>]*>.*?<\/a>/s,
      `<a class="nav-b" href="intro.html">${content.navLink}</a>`
    );
    
    fs.writeFileSync(backCoverPath, html, 'utf-8');
    fixed++;
    console.log(`✅ ${lang} korrigiert`);
    
  } catch (err) {
    errors.push(`${lang}: ${err.message}`);
    console.log(`❌ ${lang}: ${err.message}`);
  }
}

console.log(`\n✅ ${fixed} Back-Cover korrigiert`);
if (errors.length > 0) {
  console.log(`\n❌ Fehler bei: ${errors.join(', ')}`);
}
