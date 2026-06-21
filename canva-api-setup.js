/**
 * CANVA API INTEGRATION - Quran Design Generator
 * 
 * Setup:
 * 1. https://www.canva.com/developers/
 * 2. Create App → OAuth 2.0
 * 3. Redirect URI: http://localhost:3000/callback
 * 4. Email: berishamarius179@gmail.com
 * 
 * Pattern Configuration:
 * - Arabic Font: Scheherazade (Bold, Size: 25px)
 * - English Font: Georgia (Size: 15px)
 * - Spacing: 12pt
 * - Colors: Gold (#C9A84C), Dark Green (#0B2414)
 */

const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

const CANVA_CONFIG = {
  clientId: 'YOUR_CANVA_CLIENT_ID',
  clientSecret: 'YOUR_CANVA_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/callback',
  apiBase: 'https://api.canva.com/rest/v1',
  email: 'berishamarius179@gmail.com'
};

// Design-Pattern für alle Sprachen
const DESIGN_PATTERN = {
  arabic: {
    fontFamily: 'Scheherazade',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#C9A84C'  // Gold
  },
  english: {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: 'normal',
    color: '#F0E6C0'  // Light cream
  },
  spacing: 12  // pt
};

// Alle 38 Sprachen die Cover brauchen
const LANGUAGES = [
  // QURAN (19)
  { lang: 'Deutsch', ar: 'اللغة الألمانية', folder: 'Deutsch', type: 'quran' },
  { lang: 'Englisch', ar: 'اللغة الإنجليزية', folder: 'Englisch', type: 'quran' },
  { lang: 'Albanisch', ar: 'اللغة الألبانية', folder: 'Albanisch', type: 'quran' },
  { lang: 'Bengalisch', ar: 'اللغة البنغالية', folder: 'Bengalisch', type: 'quran' },
  { lang: 'Bosnisch', ar: 'اللغة البوسنية', folder: 'Bosnisch', type: 'quran' },
  { lang: 'Chinesisch', ar: 'اللغة الصينية', folder: 'Chinesisch', type: 'quran' },
  { lang: 'Französisch', ar: 'اللغة الفرنسية', folder: 'Französisch', type: 'quran' },
  { lang: 'Hausa', ar: 'لغة الهاوسا', folder: 'Hausa', type: 'quran' },
  { lang: 'Hindi', ar: 'اللغة الهندية', folder: 'Hindi', type: 'quran' },
  { lang: 'Indonesisch', ar: 'اللغة الإندونيسية', folder: 'Indonesisch', type: 'quran' },
  { lang: 'Kasachisch', ar: 'اللغة الكازاخية', folder: 'Kasachisch', type: 'quran' },
  { lang: 'Persisch', ar: 'اللغة الفارسية', folder: 'Persisch', type: 'quran' },
  { lang: 'Russisch', ar: 'اللغة الروسية', folder: 'Russisch', type: 'quran' },
  { lang: 'Spanisch', ar: 'اللغة الإسبانية', folder: 'Spanisch', type: 'quran' },
  { lang: 'Tagalog', ar: 'لغة التاغالوج', folder: 'Tagalog', type: 'quran' },
  { lang: 'Thailändisch', ar: 'اللغة التايلاندية', folder: 'Thailändisch', type: 'quran' },
  { lang: 'Türkisch', ar: 'اللغة التركية', folder: 'Türkisch', type: 'quran' },
  { lang: 'Urdu', ar: 'اللغة الأردية', folder: 'Urdu', type: 'quran' },
  { lang: 'Uygurisch', ar: 'لغة الأويغور', folder: 'Uygurisch', type: 'quran' },
  
  // BIBLE (19)
  { lang: 'English (KJV)', ar: 'الإنجليزية', folder: 'kjv', type: 'bible' },
  { lang: 'Deutsch (Textbibel)', ar: 'الألمانية', folder: 'german', type: 'bible' },
  { lang: 'Français (Crampon)', ar: 'الفرنسية', folder: 'french', type: 'bible' },
  { lang: 'Español (RV)', ar: 'الإسبانية', folder: 'spanish', type: 'bible' },
  { lang: 'Português (Livre)', ar: 'البرتغالية', folder: 'portuguese', type: 'bible' },
  { lang: 'Polski (Gdańska)', ar: 'البولندية', folder: 'polish', type: 'bible' },
  { lang: 'Русский (Synodal)', ar: 'الروسية', folder: 'russian', type: 'bible' },
  { lang: 'Hrvatski (Šarića)', ar: 'الكرواتية', folder: 'croatian', type: 'bible' },
  { lang: 'Nederlands (SV)', ar: 'الهولندية', folder: 'dutch', type: 'bible' },
  { lang: 'Magyar (Károli)', ar: 'المجرية', folder: 'hungarian', type: 'bible' },
  { lang: 'Čeština (Kralická)', ar: 'التشيكية', folder: 'czech', type: 'bible' },
  { lang: 'Svenska', ar: 'السويدية', folder: 'swedish', type: 'bible' },
  { lang: 'Tagalog', ar: 'التاغالوج', folder: 'tagalog', type: 'bible' },
  { lang: 'Українська', ar: 'الأوكرانية', folder: 'ukrainian', type: 'bible' },
  { lang: 'Shqip (UFSHB)', ar: 'الألبانية', folder: 'albanian', type: 'bible' },
  { lang: 'Română (Cornilescu)', ar: 'الرومانية', folder: 'romanian', type: 'bible' },
  { lang: 'Italiano (Riveduta)', ar: 'الإيطالية', folder: 'italian', type: 'bible' },
  { lang: 'ܣܘܪܝܬ (Peshitta)', ar: 'السريانية', folder: 'syriac', type: 'bible' },
  { lang: 'Հայերեն (Eastern)', ar: 'الأرمينية', folder: 'armenian', type: 'bible' }
];

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║          CANVA API - QURAN COVER GENERATOR                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 SETUP ANLEITUNG:\n');
console.log('1. Gehe zu: https://www.canva.com/developers/');
console.log('2. Melde dich mit an: berishamarius179@gmail.com');
console.log('3. Erstelle eine neue App (OAuth 2.0)');
console.log('4. Setze Redirect URI: http://localhost:3000/callback');
console.log('5. Kopiere Client ID & Secret in .env\n');

console.log('📊 DESIGN PATTERN (Alle 38 Sprachen):\n');
console.log(`   Arabisch:  ${DESIGN_PATTERN.arabic.fontFamily} ${DESIGN_PATTERN.arabic.fontSize}px (${DESIGN_PATTERN.arabic.fontWeight})`);
console.log(`   Englisch:  ${DESIGN_PATTERN.english.fontFamily} ${DESIGN_PATTERN.english.fontSize}px`);
console.log(`   Abstand:   ${DESIGN_PATTERN.spacing}pt\n`);

console.log(`📖 SPRACHEN ZUM GENERIEREN:\n`);
console.log(`   Quran: ${LANGUAGES.filter(l => l.type === 'quran').length} Sprachen`);
console.log(`   Bible: ${LANGUAGES.filter(l => l.type === 'bible').length} Sprachen`);
console.log(`   Total: ${LANGUAGES.length} Designs\n`);

// Generiere lokale JSON-Config für spätere Canva-API Calls
const canvaDesignConfig = {
  languages: LANGUAGES,
  pattern: DESIGN_PATTERN,
  baseColors: {
    gold: '#C9A84C',
    darkGreen: '#0B2414',
    cream: '#F0E6C0'
  },
  fonts: {
    arabic: 'Scheherazade',
    latin: 'Georgia'
  },
  createdAt: new Date().toISOString(),
  email: CANVA_CONFIG.email
};

fs.writeFileSync('_canva-design-config.json', JSON.stringify(canvaDesignConfig, null, 2), 'utf8');

console.log('✅ Konfiguration gespeichert: _canva-design-config.json\n');

// OAuth Flow Setup
console.log('═════════════════════════════════════════════════════════════\n');
console.log('🔐 OAUTH SETUP:\n');

const authorizationUrl = `https://www.canva.com/api/oauth/authorize?` +
  `client_id=${CANVA_CONFIG.clientId}&` +
  `response_type=code&` +
  `scope=design:read design:write&` +
  `state=random_state_string&` +
  `redirect_uri=${encodeURIComponent(CANVA_CONFIG.redirectUri)}`;

console.log(`1. Öffne diese URL in deinem Browser:`);
console.log(`   ${authorizationUrl}\n`);

console.log('2. Nach Autorisierung erhältst du einen Code');
console.log('3. Speichere den Code in .env als CANVA_AUTH_CODE\n');

console.log('═════════════════════════════════════════════════════════════\n');

console.log('📝 NÄCHSTE SCHRITTE:\n');
console.log('1. OAuth konfigurieren (siehe oben)');
console.log('2. Auth-Token generieren');
console.log('3. Mit Canva API Designs für alle 38 Sprachen erstellen');
console.log('4. SVG/PNG Downloads für Koranseiten\n');

console.log('💾 Dateien erstellt:');
console.log('   ✓ _canva-design-config.json (Design-Konfiguration)');
console.log('   ✓ Bereit für Canva OAuth Integration\n');

console.log('═════════════════════════════════════════════════════════════');
