// Test which languages have which structure
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX";
const DIST_DIR = path.join(BASE_DIR, "dist-diebibel");

const LANGUAGES = [
    "italian", "portuguese", "dutch", "czech", "polish", 
    "ukrainian", "hungarian", "armenian", "albanian", "tagalog"
];

console.log("\n=== TESTING VERSE STRUCTURES ===\n");

for (const lang of LANGUAGES) {
    const testFile = path.join(DIST_DIR, lang, "bücher", "001-gen.html");
    
    if (!fs.existsSync(testFile)) {
        console.log(`${lang}: FILE NOT FOUND`);
        continue;
    }
    
    const content = fs.readFileSync(testFile, 'utf8');
    
    const hasVb = content.includes('class="vb"');
    const hasVerseBlock = content.includes('class="verse-block"');
    const hasBaseC = content.includes('class="base base-c"');
    const hasBaseP = content.includes('class="base base-p"');
    const hasLatin = content.includes('class="latin"');
    const hasTrans = content.includes('class="trans"');
    const hasTra = content.includes('class="tra"');
    
    let structure = "UNKNOWN";
    
    if (hasVerseBlock && hasLatin && hasTrans) {
        structure = "ITALIAN (verse-block + latin + trans)";
    } else if (hasVb && hasBaseC && hasBaseP && hasTra) {
        structure = "STANDARD (vb + base-c + base-p + tra)";
    } else if (hasVb && hasTra && !hasBaseC && !hasBaseP) {
        structure = "MINIMALIST (vb + tra only)";
    }
    
    console.log(`${lang}: ${structure}`);
}

console.log("\n=== DONE ===");
