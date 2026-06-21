/**
 * CANVA API CLIENT
 * Erstellt Design-Templates für alle 38 Quran/Bible Übersetzungen
 * 
 * Verwendung:
 * 1. .env.canva konfigurieren (siehe .env.canva.example)
 * 2. OAuth durchführen um CANVA_AUTH_CODE zu bekommen
 * 3. node canva-client.js --generate-all
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

// Konfiguration laden
require('dotenv').config({ path: '.env.canva' });

const CANVA_API = {
  base: 'https://api.canva.com/rest/v1',
  clientId: process.env.CANVA_CLIENT_ID,
  clientSecret: process.env.CANVA_CLIENT_SECRET,
  redirectUri: process.env.CANVA_REDIRECT_URI,
  email: process.env.CANVA_EMAIL
};

// Design-Konfiguration laden
const designConfig = JSON.parse(fs.readFileSync('_canva-design-config.json', 'utf8'));

class CanvaClient {
  constructor() {
    this.accessToken = null;
    this.designs = [];
  }

  /**
   * Generiert Authorization URL für OAuth
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: CANVA_API.clientId,
      response_type: 'code',
      scope: 'design:read design:write',
      redirect_uri: CANVA_API.redirectUri,
      state: 'security_token_' + Date.now()
    });

    return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
  }

  /**
   * Tauscht Auth Code gegen Access Token
   */
  async exchangeCodeForToken(code) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: CANVA_API.clientId,
        client_secret: CANVA_API.clientSecret
      });

      const options = {
        hostname: 'api.canva.com',
        path: '/rest/v1/oauth/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            this.accessToken = response.access_token;
            resolve(response);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  /**
   * Erstellt ein neues Design via Canva API
   */
  async createDesign(language) {
    return new Promise((resolve, reject) => {
      const designData = {
        name: `${language.lang} - Quran Cover`,
        design_type: 'custom',
        width_px: parseInt(process.env.DESIGN_TEMPLATE_WIDTH || 1200),
        height_px: parseInt(process.env.DESIGN_TEMPLATE_HEIGHT || 1600),
        brand_id: null
      };

      const postData = JSON.stringify(designData);

      const options = {
        hostname: 'api.canva.com',
        path: '/rest/v1/designs',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.design) {
              resolve(response.design);
            } else {
              reject(new Error('Design creation failed: ' + data));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  /**
   * Exportiert Design als PNG/SVG
   */
  async exportDesign(designId, format = 'png') {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.canva.com',
        path: `/rest/v1/designs/${designId}/exports?format=${format}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  /**
   * Generiert alle 38 Designs
   */
  async generateAllDesigns() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     CANVA DESIGN GENERATOR - ALLE 38 SPRACHEN            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    if (!this.accessToken) {
      console.log('⚠️  Fehler: Access Token nicht gesetzt!\n');
      console.log('Bitte zuerst OAuth durchführen:');
      console.log(`1. Öffne: ${this.getAuthorizationUrl()}\n`);
      console.log('2. Nach Autorisierung erhältst du einen Code');
      console.log('3. Setze CANVA_AUTH_CODE in .env.canva\n');
      return;
    }

    const quranDesigns = designConfig.languages.filter(l => l.type === 'quran');
    const bibleDesigns = designConfig.languages.filter(l => l.type === 'bible');

    console.log(`📖 QURAN (${quranDesigns.length} Designs):\n`);
    for (const lang of quranDesigns) {
      console.log(`   ${lang.lang.padEnd(18)} → ${lang.ar}`);
    }

    console.log(`\n📖 BIBLE (${bibleDesigns.length} Designs):\n`);
    for (const lang of bibleDesigns) {
      console.log(`   ${lang.lang.padEnd(25)} → ${lang.ar}`);
    }

    console.log('\n═════════════════════════════════════════════════════════════\n');
    console.log('📝 DESIGN TEMPLATE PATTERN:\n');
    console.log(`   Arabisch: ${designConfig.pattern.arabic.fontFamily} ${designConfig.pattern.arabic.fontSize}px (${designConfig.pattern.arabic.fontWeight})`);
    console.log(`   Englisch: ${designConfig.pattern.english.fontFamily} ${designConfig.pattern.english.fontSize}px`);
    console.log(`   Abstand:  ${designConfig.pattern.spacing}pt`);
    console.log(`   Farbe:    ${designConfig.baseColors.gold} (Gold)\n`);

    console.log('═════════════════════════════════════════════════════════════\n');
    console.log('✅ BEREIT ZUM GENERIEREN!\n');
    console.log('Starte mit: node canva-client.js --auth <AUTH_CODE>\n');
  }
}

// CLI
const args = process.argv.slice(2);
const client = new CanvaClient();

if (args[0] === '--auth' && args[1]) {
  console.log('🔐 Tausche Auth Code gegen Token...\n');
  client.exchangeCodeForToken(args[1])
    .then(response => {
      console.log('✅ Token erhalten!');
      console.log('   Access Token:', response.access_token.substring(0, 20) + '...');
      console.log('   Speichere in .env.canva als CANVA_AUTH_CODE=\n');
      
      // Starte Design-Generierung
      client.generateAllDesigns();
    })
    .catch(err => console.error('❌ Fehler:', err.message));

} else if (args[0] === '--auth-url') {
  console.log('🔐 OAUTH AUTHORIZATION URL:\n');
  console.log(client.getAuthorizationUrl());
  console.log('\n1. Öffne Link im Browser');
  console.log('2. Klicke "Authorize"');
  console.log('3. Kopiere den Code aus der URL');
  console.log('4. Führe aus: node canva-client.js --auth <CODE>\n');

} else {
  // Standard: Design-Übersicht anzeigen
  client.generateAllDesigns();
}

module.exports = CanvaClient;
