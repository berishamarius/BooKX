const fs = require('fs');
const path = require('path');

/**
 * COMPREHENSIVE DICTIONARY LOCALIZATION SCRIPT
 * Localizes all Quranic Arabic dictionary entries from German to native languages
 * Languages: Spanish, French, Tagalog, Kazakh
 */

const translations = {
  'Spanisch': {
    // Prophets
    'Adam': 'Adán',
    'Idris / Henoch': 'Idris / Enoc',
    'Nuh / Noah': 'Noé',
    'Hud': 'Hud',
    'Salih': 'Salih',
    'Ibrahim / Abraham': 'Ibrahim / Abraham',
    'Lut / Lot': 'Lot',
    'Ismail / Ismael': 'Ismael',
    'Ishaq / Isaak': 'Isaac',
    'Yaqub / Jakob': 'Jacob',
    'Yusuf / Josef': 'José',
    'Ayyub / Hiob': 'Job',
    'Musa / Moses': 'Moisés',
    'Harun / Aaron': 'Aarón',
    'Dawud / David': 'David',
    'Sulayman / Salomon': 'Salomón',
    'Yunus / Jona': 'Jonás',
    'Zakariyya / Zacharias': 'Zacarías',
    'Yahya / Johannes': 'Juan',
    'Isa / Jesus': 'Jesús',
    'Muhammad': 'Muhammad',
    'Ilyas / Elias': 'Elías',
    'Al-Yasaʿ / Elisa': 'Eliseo',
    'Shuʿayb / Jethro': 'Jetro',
    'Dhul-Kifl / Ezechiel': 'Ezequiel',
    
    // Quran terminology
    'Der Koran': 'El Corán',
    'Die Sure': 'La Sura',
    'Der Vers / Das Zeichen': 'El Versículo / La Señal',
    'Die Rezitation': 'La Recitación',
    'Die Koranexegese': 'La Exégesis del Corán',
    'Die Memorierung': 'La Memorización',
    'Die Rezitationsregeln': 'Las Reglas de Recitación',
    'Der Koranband': 'El Volumen del Corán',
    
    // Islamic terms
    'Das Erlaubte': 'Lo Permitido',
    'Das Verbotene': 'Lo Prohibido',
    'Die Waschung': 'La Ablución',
    'Die rituelle Reinheit': 'La Pureza Ritual',
    'Die Gebetsrichtung': 'La Dirección de la Oración',
    'Das göttliche Gesetz': 'La Ley Divina',
    'Die Eröffnende Sure': 'La Sura Inaugural',
    
    // Nature
    'Die Sonne': 'El Sol',
    'Der Mond': 'La Luna',
    'Die Sterne': 'Las Estrellas',
    'Das Meer': 'El Mar',
    'Der Fluss': 'El Río',
    'Der Berg': 'La Montaña',
    'Der Baum': 'El Árbol',
    'Die Frucht': 'La Fruta',
    'Der Regen': 'La Lluvia',
    'Der Wind': 'El Viento',
    'Die Morgendämmerung': 'El Amanecer',
    'Die Nacht': 'La Noche',
    'Der Tag': 'El Día',
    
    // Objects
    'Das Schiff / Die Arche': 'El Barco / El Arca',
    'Das Erdbeben': 'El Terremoto',
    
    // Social roles
    'Die Gemeinschaft': 'La Comunidad',
    'Die Waise': 'El/La Huérfano/a',
    'Der Bedürftige': 'El Necesitado',
    'Der Märtyrer / Zeuge': 'El Mártir / Testigo',
    'Der Imam / Anführer': 'El Imam / Líder',
    'Die Beratung': 'La Consulta',
    'Der Gläubige': 'El Creyente',
    'Der Ungläubige': 'El Incrédulo',
    'Der Gelehrte': 'El Erudito',
    
    // Financial/Legal
    'Der Zins / Wucher': 'El Interés / La Usura',
    'Das Erbe': 'La Herencia',
    'Das Streben im Weg Gottes': 'El Esfuerzo en el Camino de Dios',
    'Die freiwillige Almose': 'La Limosna Voluntaria',
    'Der Bruder': 'El Hermano',
    'Die Ehe': 'El Matrimonio',
    
    // Metaphysical
    'Der Thron Gottes': 'El Trono de Dios',
    'Der Fußschemel / Sessel': 'El Escabel',
    'Die bewahrte Tafel': 'La Tabla Preservada',
    'Die Feder': 'La Pluma',
    'Das göttliche Schicksal': 'El Destino Divino',
    'Der Zwischenzustand': 'El Estado Intermedio',
    'Jibril / Gabriel': 'Yibril / Gabriel',
    'Die Nachtreise': 'El Viaje Nocturno',
    'Die Himmelfahrt': 'La Ascensión',
    'Der Überfluss / Fluss im Paradies': 'La Abundancia / Río en el Paraíso',
    'Die Brücke (über die Hölle)': 'El Puente (sobre el Infierno)',
    'Das Bündnis / Der Pakt': 'El Pacto',
    'Der Geist / Die Seele': 'El Espíritu / El Alma',
    'Der Lotosbaum der äußersten Grenze': 'El Loto del Límite Extremo',
    'Die bestimmte Frist': 'El Plazo Determinado',
    
    // Virtues
    'Das Vollkommene Guthandeln': 'La Perfección en las Buenas Acciones',
    'Die Rechtschaffenheit': 'La Rectitud',
    'Die Bescheidenheit': 'La Modestia',
    'Die Vergebung / Entschuldigung': 'El Perdón / La Disculpa',
    'Die Scham / Bescheidenheit': 'La Vergüenza / La Modestia',
    'Das Ausgeben auf dem Weg Allahs': 'El Gasto en el Camino de Allah',
    'Die Weltentsagung': 'La Renuncia Mundana',
    'Die Genügsamkeit': 'La Satisfacción',
    'Die Sanftheit': 'La Gentileza',
    'Die Treue': 'La Lealtad',
    'Die Langmut': 'La Paciencia',
    'Die Bruderschaft': 'La Fraternidad',
    'Die Wahrhaftigkeit': 'La Veracidad',
    'Die Geduld': 'La Paciencia',
    'Die Gerechtigkeit': 'La Justicia',
    
    // Places
    'Mekka': 'La Meca',
    'Medina': 'Medina',
    'Die Kaaba': 'La Kaaba',
    'Die Heilige Moschee': 'La Mezquita Sagrada',
    'Die Al-Aqsa-Moschee': 'La Mezquita de Al-Aqsa',
    'Das Zamzam-Wasser': 'El Agua de Zamzam',
    'Der Berg Arafat': 'El Monte Arafat',
    'Safa und Marwa': 'Safa y Marwa',
    'Das Umkreisen der Kaaba': 'La Circunvalación de la Kaaba',
    
    // Historical
    'Die Auswanderung': 'La Migración',
    'Die Schriftbesitzer': 'La Gente del Libro',
    'Die Eroberung / Der Sieg': 'La Conquista / La Victoria',
    'Der Heuchler': 'El Hipócrita',
    'Der/die Gläubige': 'El/La Creyente'
  },
  
  'Französisch': {
    // Prophets
    'Adam': 'Adam',
    'Idris / Henoch': 'Idris / Hénoch',
    'Nuh / Noah': 'Noé',
    'Hud': 'Hud',
    'Salih': 'Salih',
    'Ibrahim / Abraham': 'Ibrahim / Abraham',
    'Lut / Lot': 'Lot',
    'Ismail / Ismael': 'Ismaël',
    'Ishaq / Isaak': 'Isaac',
    'Yaqub / Jakob': 'Jacob',
    'Yusuf / Josef': 'Joseph',
    'Ayyub / Hiob': 'Job',
    'Musa / Moses': 'Moïse',
    'Harun / Aaron': 'Aaron',
    'Dawud / David': 'David',
    'Sulayman / Salomon': 'Salomon',
    'Yunus / Jona': 'Jonas',
    'Zakariyya / Zacharias': 'Zacharie',
    'Yahya / Johannes': 'Jean',
    'Isa / Jesus': 'Jésus',
    'Muhammad': 'Muhammad',
    'Ilyas / Elias': 'Élie',
    'Al-Yasaʿ / Elisa': 'Élisée',
    'Shuʿayb / Jethro': 'Jethro',
    'Dhul-Kifl / Ezechiel': 'Ézéchiel',
    
    // Quran terminology
    'Der Koran': 'Le Coran',
    'Die Sure': 'La Sourate',
    'Der Vers / Das Zeichen': 'Le Verset / Le Signe',
    'Die Rezitation': 'La Récitation',
    'Die Koranexegese': 'L\'Exégèse du Coran',
    'Die Memorierung': 'La Mémorisation',
    'Die Rezitationsregeln': 'Les Règles de Récitation',
    'Der Koranband': 'Le Volume du Coran',
    
    // Islamic terms
    'Das Erlaubte': 'Le Permis',
    'Das Verbotene': 'L\'Interdit',
    'Die Waschung': 'L\'Ablution',
    'Die rituelle Reinheit': 'La Pureté Rituelle',
    'Die Gebetsrichtung': 'La Direction de la Prière',
    'Das göttliche Gesetz': 'La Loi Divine',
    'Die Eröffnende Sure': 'La Sourate Inaugurale',
    
    // Nature
    'Die Sonne': 'Le Soleil',
    'Der Mond': 'La Lune',
    'Die Sterne': 'Les Étoiles',
    'Das Meer': 'La Mer',
    'Der Fluss': 'Le Fleuve',
    'Der Berg': 'La Montagne',
    'Der Baum': 'L\'Arbre',
    'Die Frucht': 'Le Fruit',
    'Der Regen': 'La Pluie',
    'Der Wind': 'Le Vent',
    'Die Morgendämmerung': 'L\'Aube',
    'Die Nacht': 'La Nuit',
    'Der Tag': 'Le Jour',
    
    // Objects
    'Das Schiff / Die Arche': 'Le Navire / L\'Arche',
    'Das Erdbeben': 'Le Tremblement de Terre',
    
    // Social roles
    'Die Gemeinschaft': 'La Communauté',
    'Die Waise': 'L\'Orphelin',
    'Der Bedürftige': 'Le Nécessiteux',
    'Der Märtyrer / Zeuge': 'Le Martyr / Témoin',
    'Der Imam / Anführer': 'L\'Imam / Chef',
    'Die Beratung': 'La Consultation',
    'Der Gläubige': 'Le Croyant',
    'Der Ungläubige': 'Le Mécréant',
    'Der Gelehrte': 'Le Savant',
    
    // Financial/Legal
    'Der Zins / Wucher': 'L\'Intérêt / L\'Usure',
    'Das Erbe': 'L\'Héritage',
    'Das Streben im Weg Gottes': 'L\'Effort sur le Chemin de Dieu',
    'Die freiwillige Almose': 'L\'Aumône Volontaire',
    'Der Bruder': 'Le Frère',
    'Die Ehe': 'Le Mariage',
    
    // Metaphysical
    'Der Thron Gottes': 'Le Trône de Dieu',
    'Der Fußschemel / Sessel': 'Le Repose-pied',
    'Die bewahrte Tafel': 'La Table Préservée',
    'Die Feder': 'La Plume',
    'Das göttliche Schicksal': 'Le Destin Divin',
    'Der Zwischenzustand': 'L\'État Intermédiaire',
    'Jibril / Gabriel': 'Jibril / Gabriel',
    'Die Nachtreise': 'Le Voyage Nocturne',
    'Die Himmelfahrt': 'L\'Ascension',
    'Der Überfluss / Fluss im Paradies': 'L\'Abondance / Rivière au Paradis',
    'Die Brücke (über die Hölle)': 'Le Pont (sur l\'Enfer)',
    'Das Bündnis / Der Pakt': 'Le Pacte',
    'Der Geist / Die Seele': 'L\'Esprit / L\'Âme',
    'Der Lotosbaum der äußersten Grenze': 'Le Jujubier de la Limite Extrême',
    'Die bestimmte Frist': 'Le Terme Fixé',
    
    // Virtues
    'Das Vollkommene Guthandeln': 'La Perfection dans les Bonnes Actions',
    'Die Rechtschaffenheit': 'La Droiture',
    'Die Bescheidenheit': 'La Modestie',
    'Die Vergebung / Entschuldigung': 'Le Pardon / L\'Excuse',
    'Die Scham / Bescheidenheit': 'La Pudeur / La Modestie',
    'Das Ausgeben auf dem Weg Allahs': 'La Dépense sur le Chemin d\'Allah',
    'Die Weltentsagung': 'Le Renoncement au Monde',
    'Die Genügsamkeit': 'La Satisfaction',
    'Die Sanftheit': 'La Douceur',
    'Die Treue': 'La Fidélité',
    'Die Langmut': 'La Longanimité',
    'Die Bruderschaft': 'La Fraternité',
    'Die Wahrhaftigkeit': 'La Véracité',
    'Die Geduld': 'La Patience',
    'Die Gerechtigkeit': 'La Justice',
    
    // Places
    'Mekka': 'La Mecque',
    'Medina': 'Médine',
    'Die Kaaba': 'La Kaaba',
    'Die Heilige Moschee': 'La Mosquée Sacrée',
    'Die Al-Aqsa-Moschee': 'La Mosquée Al-Aqsa',
    'Das Zamzam-Wasser': 'L\'Eau de Zamzam',
    'Der Berg Arafat': 'Le Mont Arafat',
    'Safa und Marwa': 'Safa et Marwa',
    'Das Umkreisen der Kaaba': 'La Circumambulation de la Kaaba',
    
    // Historical
    'Die Auswanderung': 'L\'Émigration',
    'Die Schriftbesitzer': 'Les Gens du Livre',
    'Die Eroberung / Der Sieg': 'La Conquête / La Victoire',
    'Der Heuchler': 'L\'Hypocrite',
    'Der/die Gläubige': 'Le/La Croyant(e)'
  },
  
  'Tagalog': {
    // Prophets
    'Adam': 'Adan',
    'Idris / Henoch': 'Idris / Enoc',
    'Nuh / Noah': 'Noe',
    'Hud': 'Hud',
    'Salih': 'Salih',
    'Ibrahim / Abraham': 'Ibrahim / Abraham',
    'Lut / Lot': 'Lot',
    'Ismail / Ismael': 'Ismael',
    'Ishaq / Isaak': 'Isaac',
    'Yaqub / Jakob': 'Jacob',
    'Yusuf / Josef': 'Jose',
    'Ayyub / Hiob': 'Job',
    'Musa / Moses': 'Moises',
    'Harun / Aaron': 'Aaron',
    'Dawud / David': 'David',
    'Sulayman / Salomon': 'Solomon',
    'Yunus / Jona': 'Jonas',
    'Zakariyya / Zacharias': 'Zacarias',
    'Yahya / Johannes': 'Juan',
    'Isa / Jesus': 'Hesus',
    'Muhammad': 'Muhammad',
    'Ilyas / Elias': 'Elias',
    'Al-Yasaʿ / Elisa': 'Eliseo',
    'Shuʿayb / Jethro': 'Jetro',
    'Dhul-Kifl / Ezechiel': 'Ezekiel',
    
    // Quran terminology
    'Der Koran': 'Ang Quran',
    'Die Sure': 'Ang Sura',
    'Der Vers / Das Zeichen': 'Ang Talata / Ang Tanda',
    'Die Rezitation': 'Ang Pagbigkas',
    'Die Koranexegese': 'Ang Paliwanag ng Quran',
    'Die Memorierung': 'Ang Pagkabisa',
    'Die Rezitationsregeln': 'Ang mga Patakaran ng Pagbigkas',
    'Der Koranband': 'Ang Tomo ng Quran',
    
    // Islamic terms
    'Das Erlaubte': 'Ang Pinahihintulutan',
    'Das Verbotene': 'Ang Ipinagbabawal',
    'Die Waschung': 'Ang Paglilinis',
    'Die rituelle Reinheit': 'Ang Ritwal na Kalinisan',
    'Die Gebetsrichtung': 'Ang Direksyon ng Panalangin',
    'Das göttliche Gesetz': 'Ang Banal na Batas',
    'Die Eröffnende Sure': 'Ang Pambungad na Sura',
    
    // Nature
    'Die Sonne': 'Ang Araw',
    'Der Mond': 'Ang Buwan',
    'Die Sterne': 'Ang mga Bituin',
    'Das Meer': 'Ang Dagat',
    'Der Fluss': 'Ang Ilog',
    'Der Berg': 'Ang Bundok',
    'Der Baum': 'Ang Puno',
    'Die Frucht': 'Ang Prutas',
    'Der Regen': 'Ang Ulan',
    'Der Wind': 'Ang Hangin',
    'Die Morgendämmerung': 'Ang Bukang-liwayway',
    'Die Nacht': 'Ang Gabi',
    'Der Tag': 'Ang Araw',
    
    // Objects
    'Das Schiff / Die Arche': 'Ang Barko / Ang Arka',
    'Das Erdbeben': 'Ang Lindol',
    
    // Social roles
    'Die Gemeinschaft': 'Ang Komunidad',
    'Die Waise': 'Ang Ulila',
    'Der Bedürftige': 'Ang Nangangailangan',
    'Der Märtyrer / Zeuge': 'Ang Martir / Saksi',
    'Der Imam / Anführer': 'Ang Imam / Pinuno',
    'Die Beratung': 'Ang Konsultasyon',
    'Der Gläubige': 'Ang Mananampalataya',
    'Der Ungläubige': 'Ang Hindi Naniniwala',
    'Der Gelehrte': 'Ang Iskolar',
    
    // Financial/Legal
    'Der Zins / Wucher': 'Ang Tubo / Usura',
    'Das Erbe': 'Ang Pamana',
    'Das Streben im Weg Gottes': 'Ang Pagsisikap sa Landas ng Diyos',
    'Die freiwillige Almose': 'Ang Kusang Limos',
    'Der Bruder': 'Ang Kapatid',
    'Die Ehe': 'Ang Kasal',
    
    // Metaphysical
    'Der Thron Gottes': 'Ang Trono ng Diyos',
    'Der Fußschemel / Sessel': 'Ang Tuntungan',
    'Die bewahrte Tafel': 'Ang Nakatagong Tabla',
    'Die Feder': 'Ang Pluma',
    'Das göttliche Schicksal': 'Ang Banal na Kapalaran',
    'Der Zwischenzustand': 'Ang Gitna ng Kalagayan',
    'Jibril / Gabriel': 'Jibril / Gabriel',
    'Die Nachtreise': 'Ang Paglalakbay sa Gabi',
    'Die Himmelfahrt': 'Ang Pag-akyat sa Langit',
    'Der Überfluss / Fluss im Paradies': 'Ang Kasaganaan / Ilog sa Paraiso',
    'Die Brücke (über die Hölle)': 'Ang Tulay (sa ibabaw ng Impiyerno)',
    'Das Bündnis / Der Pakt': 'Ang Kasunduan',
    'Der Geist / Die Seele': 'Ang Espiritu / Ang Kaluluwa',
    'Der Lotosbaum der äußersten Grenze': 'Ang Lote ng Pinakadulo',
    'Die bestimmte Frist': 'Ang Takdang Panahon',
    
    // Virtues
    'Das Vollkommene Guthandeln': 'Ang Perpektong Mabuting Gawa',
    'Die Rechtschaffenheit': 'Ang Katuwiran',
    'Die Bescheidenheit': 'Ang Kababaang-loob',
    'Die Vergebung / Entschuldigung': 'Ang Kapatawaran / Paghingi ng Paumanhin',
    'Die Scham / Bescheidenheit': 'Ang Hiya / Kababaang-loob',
    'Das Ausgeben auf dem Weg Allahs': 'Ang Paggasta sa Landas ni Allah',
    'Die Weltentsagung': 'Ang Pag-iwas sa Mundo',
    'Die Genügsamkeit': 'Ang Kasiyahan',
    'Die Sanftheit': 'Ang Kahinahunan',
    'Die Treue': 'Ang Katapatan',
    'Die Langmut': 'Ang Pagtitiis',
    'Die Bruderschaft': 'Ang Pagkakapatiran',
    'Die Wahrhaftigkeit': 'Ang Katotohanan',
    'Die Geduld': 'Ang Pasensya',
    'Die Gerechtigkeit': 'Ang Katarungan',
    
    // Places
    'Mekka': 'Mecca',
    'Medina': 'Medina',
    'Die Kaaba': 'Ang Kaaba',
    'Die Heilige Moschee': 'Ang Banal na Moske',
    'Die Al-Aqsa-Moschee': 'Ang Moske ng Al-Aqsa',
    'Das Zamzam-Wasser': 'Ang Tubig ng Zamzam',
    'Der Berg Arafat': 'Ang Bundok Arafat',
    'Safa und Marwa': 'Safa at Marwa',
    'Das Umkreisen der Kaaba': 'Ang Pag-ikot sa Kaaba',
    
    // Historical
    'Die Auswanderung': 'Ang Paglipat',
    'Die Schriftbesitzer': 'Ang mga Tao ng Aklat',
    'Die Eroberung / Der Sieg': 'Ang Pagsakop / Ang Tagumpay',
    'Der Heuchler': 'Ang Mapagkunwari',
    'Der/die Gläubige': 'Ang Mananampalataya'
  },
  
  'Kasachisch': {
    // Prophets
    'Adam': 'Адам',
    'Idris / Henoch': 'Идрис / Енох',
    'Nuh / Noah': 'Нұх / Ной',
    'Hud': 'Һұд',
    'Salih': 'Салих',
    'Ibrahim / Abraham': 'Ибраһим / Ибраһам',
    'Lut / Lot': 'Лұт / Лот',
    'Ismail / Ismael': 'Исмайыл / Исмаил',
    'Ishaq / Isaak': 'Исхақ / Исаак',
    'Yaqub / Jakob': 'Яқұб / Жақып',
    'Yusuf / Josef': 'Юсуф / Жүсіп',
    'Ayyub / Hiob': 'Айюб / Ияп',
    'Musa / Moses': 'Мұса / Мұса',
    'Harun / Aaron': 'Һарун / Һарон',
    'Dawud / David': 'Дауд / Дәуіт',
    'Sulayman / Salomon': 'Сулайман / Сүлеймен',
    'Yunus / Jona': 'Юнус / Жүніс',
    'Zakariyya / Zacharias': 'Закария / Захария',
    'Yahya / Johannes': 'Яхья / Жақия',
    'Isa / Jesus': 'Ғайса / Иса',
    'Muhammad': 'Мұхаммед',
    'Ilyas / Elias': 'Ильяс / Илия',
    'Al-Yasaʿ / Elisa': 'Әл-Ясағ / Елисей',
    'Shuʿayb / Jethro': 'Шуайб / Жетро',
    'Dhul-Kifl / Ezechiel': 'Зұл-Кіфл / Езекиел',
    
    // Quran terminology
    'Der Koran': 'Құран',
    'Die Sure': 'Сүре',
    'Der Vers / Das Zeichen': 'Аят / Белгі',
    'Die Rezitation': 'Оқу',
    'Die Koranexegese': 'Құранды түсіндіру',
    'Die Memorierung': 'Жаттау',
    'Die Rezitationsregeln': 'Оқу ережелері',
    'Der Koranband': 'Құран томы',
    
    // Islamic terms
    'Das Erlaubte': 'Рұқсат етілген',
    'Das Verbotene': 'Тыйым салынған',
    'Die Waschung': 'Тазару',
    'Die rituelle Reinheit': 'Ритуалдық тазалық',
    'Die Gebetsrichtung': 'Намаз бағыты',
    'Das göttliche Gesetz': 'Құдайдың заңы',
    'Die Eröffnende Sure': 'Ашушы сүре',
    
    // Nature
    'Die Sonne': 'Күн',
    'Der Mond': 'Ай',
    'Die Sterne': 'Жұлдыздар',
    'Das Meer': 'Теңіз',
    'Der Fluss': 'Өзен',
    'Der Berg': 'Тау',
    'Der Baum': 'Ағаш',
    'Die Frucht': 'Жеміс',
    'Der Regen': 'Жаңбыр',
    'Der Wind': 'Жел',
    'Die Morgendämmerung': 'Таң',
    'Die Nacht': 'Түн',
    'Der Tag': 'Күн',
    
    // Objects
    'Das Schiff / Die Arche': 'Кеме / Кемік',
    'Das Erdbeben': 'Жер сілкінісі',
    
    // Social roles
    'Die Gemeinschaft': 'Қауым',
    'Die Waise': 'Жетім',
    'Der Bedürftige': 'Мұқтаж',
    'Der Märtyrer / Zeuge': 'Шаһид / Куә',
    'Der Imam / Anführer': 'Имам / Көшбасшы',
    'Die Beratung': 'Кеңес',
    'Der Gläubige': 'Сенуші',
    'Der Ungläubige': 'Кәпір',
    'Der Gelehrte': 'Ғалым',
    
    // Financial/Legal
    'Der Zins / Wucher': 'Пайыз / Өсім',
    'Das Erbe': 'Мұра',
    'Das Streben im Weg Gottes': 'Алла жолындағы күрес',
    'Die freiwillige Almose': 'Ерікті садақа',
    'Der Bruder': 'Аға / Іні',
    'Die Ehe': 'Неке',
    
    // Metaphysical
    'Der Thron Gottes': 'Алла тағы',
    'Der Fußschemel / Sessel': 'Аяқ орны',
    'Die bewahrte Tafel': 'Сақталған тақта',
    'Die Feder': 'Қалам',
    'Das göttliche Schicksal': 'Құдайдың тағдыры',
    'Der Zwischenzustand': 'Аралық күй',
    'Jibril / Gabriel': 'Жәбірейіл / Габриел',
    'Die Nachtreise': 'Түнгі сапар',
    'Die Himmelfahrt': 'Көкке көтерілу',
    'Der Überfluss / Fluss im Paradies': 'Молшылық / Жәннаттағы өзен',
    'Die Brücke (über die Hölle)': 'Көпір (тозақ үстінде)',
    'Das Bündnis / Der Pakt': 'Келісім',
    'Der Geist / Die Seele': 'Рух / Жан',
    'Der Lotosbaum der äußersten Grenze': 'Соңғы шектегі қарағай',
    'Die bestimmte Frist': 'Белгіленген мерзім',
    
    // Virtues
    'Das Vollkommene Guthandeln': 'Кемел жақсы іс',
    'Die Rechtschaffenheit': 'Әділдік',
    'Die Bescheidenheit': 'Қарапайымдылық',
    'Die Vergebung / Entschuldigung': 'Кешірім / Ақталу',
    'Die Scham / Bescheidenheit': 'Ұят / Қарапайымдылық',
    'Das Ausgeben auf dem Weg Allahs': 'Алла жолында жұмсау',
    'Die Weltentsagung': 'Дүниеден бас тарту',
    'Die Genügsamkeit': 'Қанағат',
    'Die Sanftheit': 'Жұмсақтық',
    'Die Treue': 'Адалдық',
    'Die Langmut': 'Төзімділік',
    'Die Bruderschaft': 'Бауырластық',
    'Die Wahrhaftigkeit': 'Шындық',
    'Die Geduld': 'Сабырлық',
    'Die Gerechtigkeit': 'Әділеттілік',
    
    // Places
    'Mekka': 'Мекке',
    'Medina': 'Мәдина',
    'Die Kaaba': 'Кағба',
    'Die Heilige Moschee': 'Қасиетті мешіт',
    'Die Al-Aqsa-Moschee': 'Әл-Ақса мешіті',
    'Das Zamzam-Wasser': 'Зәмзәм суы',
    'Der Berg Arafat': 'Арафат тауы',
    'Safa und Marwa': 'Сафа мен Марва',
    'Das Umkreisen der Kaaba': 'Кағбаны айналу',
    
    // Historical
    'Die Auswanderung': 'Көші-қон',
    'Die Schriftbesitzer': 'Кітап адамдары',
    'Die Eroberung / Der Sieg': 'Жаулап алу / Жеңіс',
    'Der Heuchler': 'Екіжүзді',
    'Der/die Gläubige': 'Сенуші'
  }
};

const baseDir = path.join(__dirname, 'dist-alquran', 'Übersetzungen');

console.log('═══════════════════════════════════════════════════════');
console.log('  COMPREHENSIVE DICTIONARY LOCALIZATION');
console.log('  Localizing Quranic Arabic dictionaries');
console.log('═══════════════════════════════════════════════════════\n');

let totalUpdates = 0;

for (const [language, termMap] of Object.entries(translations)) {
  const dictPath = path.join(baseDir, language, 'woerterbuch.html');
  
  if (!fs.existsSync(dictPath)) {
    console.log(`⚠️  ${language}: Dictionary file not found`);
    continue;
  }

  let content = fs.readFileSync(dictPath, 'utf8');
  let languageUpdates = 0;

  // Replace each German term with its localized version
  for (const [germanTerm, localizedTerm] of Object.entries(termMap)) {
    // Escape special regex characters in the German term
    const escapedGerman = germanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Pattern: <div class="entry-tr">German Term</div>
    const pattern = new RegExp(
      `(<div class="entry-tr"[^>]*>)${escapedGerman}(<\\/div>)`,
      'g'
    );
    
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, `$1${localizedTerm}$2`);
      languageUpdates += matches.length;
    }
  }

  if (languageUpdates > 0) {
    fs.writeFileSync(dictPath, content, 'utf8');
    console.log(`✅ ${language.padEnd(15)} → ${languageUpdates} entries localized`);
    totalUpdates += languageUpdates;
  } else {
    console.log(`ℹ️  ${language.padEnd(15)} → Already localized`);
  }
}

console.log('\n═══════════════════════════════════════════════════════');
console.log(`✅ COMPLETED: ${totalUpdates} total entries localized`);
console.log('═══════════════════════════════════════════════════════\n');
