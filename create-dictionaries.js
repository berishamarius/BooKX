const fs = require('fs');
const path = require('path');

const wörterbücher = {
  'Französisch': {
    lang: 'fr',
    title: 'Dictionnaire · Français · القرآن الكريم',
    subtitle: 'DICTIONNAIRE · ARABE CORANIQUE',
    native: 'Français',
    placeholder: 'Arabe, translittération ou français …',
    categoryGod: 'Les plus beaux noms de Dieu',
    categoryFaith: 'Foi & Islam',
    translations: {
      'Allah / Gott': 'Allah / Dieu',
      'Der Allerbarmer': 'Le Tout Miséricordieux',
      'Der Barmherzige': 'Le Miséricordieux',
      'Herr': 'Seigneur',
      'Der König': 'Le Roi',
      'Der Mächtige': 'Le Puissant',
      'Der Weise': 'Le Sage',
      'Der Allvergebende': 'Le Pardonneur',
      'Der Allmächtige': 'Le Tout-Puissant',
      'Der Allhörende': 'L\'Audient',
      'Der Allsehende': 'Le Clairvoyant',
      'Der Allwissende': 'L\'Omniscient',
      'Islam / Hingabe an Gott': 'Islam / Soumission à Dieu',
      'Glaube': 'Foi'
    }
  },
  'Spanisch': {
    lang: 'es',
    title: 'Diccionario · Español · القرآن الكريم',
    subtitle: 'DICCIONARIO · ÁRABE CORÁNICO',
    native: 'Español',
    placeholder: 'Árabe, transliteración o español …',
    categoryGod: 'Los nombres más bellos de Dios',
    categoryFaith: 'Fe e Islam',
    translations: {
      'Allah / Gott': 'Allah / Dios',
      'Der Allerbarmer': 'El Clementísimo',
      'Der Barmherzige': 'El Misericordioso',
      'Herr': 'Señor',
      'Der König': 'El Rey',
      'Der Mächtige': 'El Poderoso',
      'Der Weise': 'El Sabio',
      'Der Allvergebende': 'El Perdonador',
      'Der Allmächtige': 'El Todopoderoso',
      'Der Allhörende': 'El Oyente',
      'Der Allsehende': 'El Vidente',
      'Der Allwissende': 'El Omnisciente',
      'Islam / Hingabe an Gott': 'Islam / Sumisión a Dios',
      'Glaube': 'Fe'
    }
  },
  'Kasachisch': {
    lang: 'kk',
    title: 'Сөздік · Қазақша · القرآن الكريم',
    subtitle: 'СӨЗДІК · ҚҰРАНДЫҚ АРАБ ТІЛІ',
    native: 'Қазақша',
    placeholder: 'Араб, транслитерация немесе қазақша …',
    categoryGod: 'Алланың ең әдемі есімдері',
    categoryFaith: 'Сенім және Ислам',
    translations: {
      'Allah / Gott': 'Аллаһ',
      'Der Allerbarmer': 'Ар-Рахман',
      'Der Barmherzige': 'Ар-Рахим',
      'Herr': 'Рабб',
      'Der König': 'Патша',
      'Der Mächtige': 'Құдіретті',
      'Der Weise': 'Дана',
      'Der Allvergebende': 'Кешіруші',
      'Der Allmächtige': 'Қадір',
      'Der Allhörende': 'Естуші',
      'Der Allsehende': 'Көруші',
      'Der Allwissende': 'Білгір',
      'Islam / Hingabe an Gott': 'Ислам',
      'Glaube': 'Иман'
    }
  },
  'Tagalog': {
    lang: 'tl',
    title: 'Diksyunaryo · Tagalog · القرآن الكريم',
    subtitle: 'DIKSYUNARYO · ARABIC NG QURAN',
    native: 'Tagalog',
    placeholder: 'Arabic, transliterasyon o Tagalog …',
    categoryGod: 'Ang mga pinakamahalagang pangalan ng Diyos',
    categoryFaith: 'Pananampalataya at Islam',
    translations: {
      'Allah / Gott': 'Allah / Diyos',
      'Der Allerbarmer': 'Ang Napakamaawain',
      'Der Barmherzige': 'Ang Maawain',
      'Herr': 'Panginoon',
      'Der König': 'Ang Hari',
      'Der Mächtige': 'Ang Makapangyarihan',
      'Der Weise': 'Ang Marunong',
      'Der Allvergebende': 'Ang Nagpapatawad',
      'Der Allmächtige': 'Ang Makapangyarihang-lubos',
      'Der Allhörende': 'Ang Nakaririnig',
      'Der Allsehende': 'Ang Nakakakita',
      'Der Allwissende': 'Ang Nakakaalam',
      'Islam / Hingabe an Gott': 'Islam / Pagsuko sa Diyos',
      'Glaube': 'Pananampalataya'
    }
  },
  'Thailändisch': {
    lang: 'th',
    title: 'พจนานุกรม · ภาษาไทย · القرآن الكريم',
    subtitle: 'พจนานุกรม · อาหรับอัลกุรอาน',
    native: 'ภาษาไทย',
    placeholder: 'อาหรับ, อักษรโรมัน หรือ ภาษาไทย …',
    categoryGod: 'พระนามที่สวยงามที่สุดของพระเจ้า',
    categoryFaith: 'ศรัทธาและอิสลาม',
    translations: {
      'Allah / Gott': 'อัลเลาะห์',
      'Der Allerbarmer': 'ผู้เมตตาที่สุด',
      'Der Barmherzige': 'ผู้เมตตา',
      'Herr': 'พระเจ้า',
      'Der König': 'พระราชา',
      'Der Mächtige': 'ผู้ทรงอำนาจ',
      'Der Weise': 'ผู้ทรงปัญญา',
      'Der Allvergebende': 'ผู้ให้อภัย',
      'Der Allmächtige': 'ผู้ทรงอำนาจสูงสุด',
      'Der Allhörende': 'ผู้ทรงสดับ',
      'Der Allsehende': 'ผู้ทรงประจักษ์',
      'Der Allwissende': 'ผู้ทรงรอบรู้',
      'Islam / Hingabe an Gott': 'อิสลาม',
      'Glaube': 'ศรัทธา'
    }
  }
};

// Read German template
const templatePath = path.join(__dirname, 'dist-alquran/Übersetzungen/Deutsch/woerterbuch.html');
const template = fs.readFileSync(templatePath, 'utf8');

for (const [langName, config] of Object.entries(wörterbücher)) {
  const langDir = path.join(__dirname, 'dist-alquran/Übersetzungen', langName);
  const outputPath = path.join(langDir, 'woerterbuch.html');
  
  if (fs.existsSync(outputPath)) {
    console.log(`✓ ${langName}: woerterbuch.html already exists, skipping`);
    continue;
  }

  let content = template;
  
  // Replace language code
  content = content.replace('<html lang="de"', `<html lang="${config.lang}"`);
  
  // Replace title
  content = content.replace(/<title>[^<]+<\/title>/, `<title>${config.title}</title>`);
  
  // Replace subtitle
  content = content.replace(/WÖRTERBUCH · KORANISCHES ARABISCH/, config.subtitle);
  
  // Replace native language name
  content = content.replace(/<span class="sh-native">Deutsch<\/span>/, `<span class="sh-native">${config.native}</span>`);
  
  // Replace placeholder
  content = content.replace(/placeholder="[^"]+?"/, `placeholder="${config.placeholder}"`);
  
  // Replace category headers
  content = content.replace(/Die schönsten Namen Gottes/, config.categoryGod);
  content = content.replace(/Glaube & Islam/, config.categoryFaith);
  
  // Replace translations
  for (const [german, native] of Object.entries(config.translations)) {
    const escapedGerman = german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(<div class="entry-tr"[^>]*>)${escapedGerman}(<\\/div>)`, 'g');
    content = content.replace(pattern, `$1${native}$2`);
  }
  
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ ${langName}: Created woerterbuch.html`);
}

console.log('\n✅ All dictionary files created!');
