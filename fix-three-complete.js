const https = require('https');
const fs = require('fs');
const path = require('path');

// Map language names to API language codes
const langApiCodes = {
  'Deutsch': 'de',
  'Albanisch': 'sq',
  'Tagalog': 'en' // Tagalog not available, we'll use translation names from verses
};

const translationsDir = path.join(__dirname, 'dist-alquran/Übersetzungen');

// Fetch chapters with translated names
function fetchChapters(langCode) {
  return new Promise((resolve, reject) => {
    const url = `https://api.quran.com/api/v4/chapters?language=${langCode}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.chapters || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Manual Tagalog names (from Filipino translation)
const tagalogNames = {
  '001': 'Ang Pagbubukas', '002': 'Ang Baka', '003': 'Ang Pamilya ni Imran',
  '004': 'Ang mga Kababaihan', '005': 'Ang Hapag', '006': 'Ang Hayop',
  '007': 'Ang mga Kataasan', '008': 'Ang Samsam', '009': 'Ang Pagsisisi',
  '010': 'Jonas', '011': 'Hud', '012': 'Jose', '013': 'Ang Kulog',
  '014': 'Abraham', '015': 'Ang Kabundukan', '016': 'Ang Bubuyog',
  '017': 'Ang Paglalakbay sa Gabi', '018': 'Ang Yungib', '019': 'Maria',
  '020': 'Ta Ha', '021': 'Ang mga Propeta', '022': 'Ang Peregrinasyon',
  '023': 'Ang mga Mananampalataya', '024': 'Ang Liwanag', '025': 'Ang Pamantayan',
  '026': 'Ang mga Makata', '027': 'Ang Langgam', '028': 'Ang Salaysay',
  '029': 'Ang Gagamba', '030': 'Ang mga Romanyo', '031': 'Luqman',
  '032': 'Ang Pagsamba', '033': 'Ang mga Koalisyon', '034': 'Sheba',
  '035': 'Ang Lumikha', '036': 'Ya Sin', '037': 'Ang mga Nakahanay',
  '038': 'Sad', '039': 'Ang mga Grupo', '040': 'Ang Nagpapatawad',
  '041': 'Inilalarawan', '042': 'Ang Konsultasyon', '043': 'Ang Ginintuang Palamuti',
  '044': 'Ang Usok', '045': 'Ang Nakaluhod', '046': 'Ang Burol ng Buhangin',
  '047': 'Muhammad', '048': 'Ang Tagumpay', '049': 'Ang mga Silid',
  '050': 'Qaf', '051': 'Ang Umiihip', '052': 'Ang Bundok',
  '053': 'Ang Bituin', '054': 'Ang Buwan', '055': 'Ang Maawain',
  '056': 'Ang Pangyayari', '057': 'Ang Bakal', '058': 'Ang Debatante',
  '059': 'Ang Pagtitipon', '060': 'Ang Sinusubok', '061': 'Ang mga Hanay',
  '062': 'Biyernes', '063': 'Ang mga Mapagkunwari', '064': 'Ang Mutual na Pagkawala',
  '065': 'Ang Diborsyo', '066': 'Ang Pagbabawal', '067': 'Ang Soberanya',
  '068': 'Ang Pluma', '069': 'Ang Katotohanan', '070': 'Ang mga Hagdan ng Pag-akyat',
  '071': 'Noe', '072': 'Ang mga Jinn', '073': 'Ang Nakabalot',
  '074': 'Ang Natatakpan', '075': 'Ang Pagkabuhay', '076': 'Ang Tao',
  '077': 'Ang mga Ipinapadala', '078': 'Ang Balita', '079': 'Ang mga Bumabatak',
  '080': 'Sumimangot Siya', '081': 'Ang Pagtupi', '082': 'Ang Pagkasira',
  '083': 'Ang Pandaraya', '084': 'Ang Paghihiwalay', '085': 'Ang mga Bituin',
  '086': 'Ang Tagumpay sa Gabi', '087': 'Ang Kataas-taasan', '088': 'Ang Nakatatakot',
  '089': 'Ang Bukang-liwayway', '090': 'Ang Siyudad', '091': 'Ang Araw',
  '092': 'Ang Gabi', '093': 'Ang Umaga', '094': 'Ang Pagbubuksan',
  '095': 'Ang Puno', '096': 'Ang Dugo', '097': 'Ang Kaluwalhatian',
  '098': 'Ang Malinaw na Ebidensya', '099': 'Ang Lindol', '100': 'Ang mga Tumatakbong Kabayo',
  '101': 'Ang Sakuna', '102': 'Ang Kompetisyon', '103': 'Ang Panahon',
  '104': 'Ang Manlalait', '105': 'Ang Elepante', '106': 'Quraish',
  '107': 'Ang Maliit na Kabutihan', '108': 'Ang Kasaganaan', '109': 'Ang mga Hindi Mananampalataya',
  '110': 'Ang Tulong', '111': 'Ang mga Palma', '112': 'Ang Pagkakaisa',
  '113': 'Ang Bukang-liwayway', '114': 'Ang Sangkatauhan'
};

async function main() {
  console.log('Fetching chapter names from Quran.com API...\n');
  
  // Fetch for each language
  for (const [langName, apiCode] of Object.entries(langApiCodes)) {
    console.log(`Processing ${langName}...`);
    
    let chapters;
    if (langName === 'Tagalog') {
      // Use manual mapping
      chapters = Object.entries(tagalogNames).map(([num, name]) => ({
        id: parseInt(num),
        translated_name: { name }
      }));
    } else {
      // Fetch from API
      chapters = await fetchChapters(apiCode);
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
    }
    
    const langDir = path.join(translationsDir, langName);
    const indexPath = path.join(langDir, 'index.html');
    const surenDir = path.join(langDir, 'suren');
    
    if (!fs.existsSync(indexPath) || !fs.existsSync(surenDir)) {
      console.log(`  ⚠ Missing files\n`);
      continue;
    }
    
    // Build name mapping
    const nameMap = {};
    for (const ch of chapters) {
      const num = String(ch.id).padStart(3, '0');
      nameMap[num] = {
        transliteration: ch.name_simple || `Chapter ${ch.id}`,
        native: ch.translated_name?.name || ch.name_simple
      };
    }
    
    // Update index - simpler approach
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let indexUpdated = 0;
    
    // Split by rows and process each
    const rows = indexContent.split('</a>');
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Extract chapter number from this row
      const numMatch = row.match(/<span class="rn">(\d+)<\/span>/);
      if (!numMatch) continue;
      
      const num = numMatch[1].padStart(3, '0');
      const names = nameMap[num];
      if (!names) continue;
      
      // Replace the rt content
      const before = rows[i];
      rows[i] = rows[i].replace(
        /(<span class="rt">)[^<]+(<\/span><\/span>)/,
        `$1${names.native}$2`
      );
      
      if (rows[i] !== before) {
        indexUpdated++;
      }
    }
    
    indexContent = rows.join('</a>');
    
    if (indexUpdated > 0) {
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(`  ✓ Updated ${indexUpdated} index entries`);
    }
    
    // Update suren headers
    const surenFiles = fs.readdirSync(surenDir).filter(f => f.endsWith('.html'));
    let surenUpdated = 0;
    
    for (const file of surenFiles) {
      const numMatch = file.match(/^(\d+)-/);
      if (!numMatch) continue;
      
      const num = numMatch[1].padStart(3, '0');
      const names = nameMap[num];
      if (!names) continue;
      
      const surenPath = path.join(surenDir, file);
      let content = fs.readFileSync(surenPath, 'utf8');
      const original = content;
      
      // Replace sh-meta: "Al-Fatihah· The Opener" or "Al-Fatihah · The Opener" 
      // with "Al-Fatihah · Native Name"
      const metaPattern = /(<span class="sh-meta">)([^<·]+)(·?\s*)([^<]+)(<\/span>)/;
      
      content = content.replace(metaPattern, (match, p1, translit, sep, oldName, p5) => {
        return `${p1}${translit.trim()} · ${names.native}${p5}`;
      });
      
      if (content !== original) {
        fs.writeFileSync(surenPath, content, 'utf8');
        surenUpdated++;
      }
    }
    
    if (surenUpdated > 0) {
      console.log(`  ✓ Updated ${surenUpdated} suren headers`);
    }
    
    console.log('');
  }
  
  console.log('✅ Deutsch, Albanisch, and Tagalog fully fixed!');
}

main().catch(console.error);
