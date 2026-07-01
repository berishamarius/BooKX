// Insert Deuterocanonical Greek verses from eBible.org Brenton's LXX
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX";
const LXX_DIR = path.join(BASE_DIR, "temp-septuagint");
const DIST_DIR = path.join(BASE_DIR, "dist-diebibel");

// DEUTEROCANONICAL BOOKS - ACTUAL FILES THAT EXIST IN temp-septuagint
const BOOKS = [
    ["067-tob", "grcbrent_041_TOB"],  // Tobit
    ["068-jdt", "grcbrent_042_JDT"],  // Judith
    // 069-1ma = 1 Maccabees - NO FILES
    // 070-2ma = 2 Maccabees - NO FILES
    ["071-wis", "grcbrent_045_WIS"],  // Wisdom of Solomon
    ["072-sir", "grcbrent_046_SIR"],  // Sirach/Ecclesiasticus
    ["073-bar", "grcbrent_047_BAR"],  // Baruch
    // 074-1es = 1 Esdras - ALREADY HAS GREEK
    // 075-2es = 2 Esdras - ALREADY HAS GREEK
    // 076-prm = Prayer of Manasseh - grcbrent_055_MAN?
    // 077-pra = Prayer of Azariah - NO FILES
    ["078-sus", "grcbrent_050_SUS"],  // Susanna
    ["079-bel", "grcbrent_051_BEL"]   // Bel and the Dragon
];

const LANGUAGES = [
    "german", "italian", "french", "spanish", "portuguese", "dutch",
    "czech", "polish", "swedish", "russian", "ukrainian", "hungarian",
    "armenian", "albanian", "croatian", "tagalog", "kjv"
];

let totalInserted = 0;

function getLXXChapters(lxxPrefix) {
    const chapters = [];
    let chNum = 1;
    while (true) {
        const chStr = String(chNum).padStart(2, '0');
        const filePath = path.join(LXX_DIR, `${lxxPrefix}_${chStr}_read.txt`);
        if (!fs.existsSync(filePath)) break;
        chapters.push({ num: chNum, path: filePath });
        chNum++;
    }
    return chapters;
}

function parseVerses(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    // Skip first 2 lines (book name, chapter number), rest are verses
    return lines.slice(2).filter(line => line.trim().length > 0);
}

function insertVerse(html, chapterNum, verseNum, greekText) {
    // Find the verse container by id="v{ch}-{v}"
    const verseIdPattern = new RegExp(`id="v${chapterNum}-${verseNum}"[^>]*>([\\s\\S]*?)<p class="tra">`, 'i');
    const match = html.match(verseIdPattern);
    
    if (!match) return { html, inserted: false };
    
    // Check if already has Greek
    if (match[1].includes('<p class="base base-o">')) {
        return { html, inserted: false, reason: 'has-greek' };
    }
    
    // Insert before <p class="tra">
    const greekElement = `\n                    <p class="base base-o">${greekText}</p>`;
    const newHtml = html.replace(verseIdPattern, `id="v${chapterNum}-${verseNum}"$1${greekElement}\n                    <p class="tra">`);
    
    return { html: newHtml, inserted: true };
}

function processBook(lang, bookCode, lxxPrefix) {
    const bookPath = path.join(DIST_DIR, lang, "bücher", `${bookCode}.html`);
    
    if (!fs.existsSync(bookPath)) {
        return { status: 'not-found', verses: 0 };
    }
    
    const lxxChapters = getLXXChapters(lxxPrefix);
    if (lxxChapters.length === 0) {
        return { status: 'no-lxx', verses: 0 };
    }
    
    let html = fs.readFileSync(bookPath, 'utf8');
    let insertedCount = 0;
    let hasGreek = false;
    
    for (const chapter of lxxChapters) {
        const verses = parseVerses(chapter.path);
        
        for (let i = 0; i < verses.length; i++) {
            const verseNum = i + 1;
            const greekText = verses[i].trim();
            
            if (!greekText) continue;
            
            const result = insertVerse(html, chapter.num, verseNum, greekText);
            html = result.html;
            
            if (result.inserted) {
                insertedCount++;
            } else if (result.reason === 'has-greek') {
                hasGreek = true;
            }
        }
    }
    
    if (insertedCount > 0) {
        fs.writeFileSync(bookPath, html, 'utf8');
        return { status: 'inserted', verses: insertedCount };
    } else if (hasGreek) {
        return { status: 'has-greek', verses: 0 };
    } else {
        return { status: 'no-verses', verses: 0 };
    }
}

console.log("\n=== INSERTING DEUTEROCANONICAL GREEK VERSES ===\n");

for (const lang of LANGUAGES) {
    console.log(`→ ${lang}`);
    
    for (const [bookCode, lxxPrefix] of BOOKS) {
        process.stdout.write(`  ${bookCode}.html... `);
        
        const result = processBook(lang, bookCode, lxxPrefix);
        
        if (result.status === 'inserted') {
            console.log(`✓ ${result.verses} verses`);
            totalInserted += result.verses;
        } else if (result.status === 'has-greek') {
            console.log('Already has Greek');
        } else if (result.status === 'not-found') {
            console.log('⚠ not found');
        } else if (result.status === 'no-lxx') {
            console.log('No LXX files');
        } else {
            console.log('⚠ 0 verses');
        }
    }
    
    console.log();
}

console.log("=== DONE ===");
console.log(`Total verses inserted: ${totalInserted}`);
