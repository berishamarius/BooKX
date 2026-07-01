// Fix Italian: Replace base-p with German, add base-o with Greek
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX\\dist-diebibel";
const LXX_DIR = path.join("C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX", "temp-septuagint");
const NT_DIR = path.join("C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX", "temp-sblgnt-verses");

// All 79 books
const BOOKS = [
    // OT (1-39)
    "001-gen", "002-exo", "003-lev", "004-num", "005-deu", "006-jos", "007-jdg", "008-rut",
    "009-1sa", "010-2sa", "011-1ki", "012-2ki", "013-1ch", "014-2ch", "015-ezr", "016-neh",
    "017-est", "018-job", "019-psa", "020-pro", "021-ecc", "022-sng", "023-isa", "024-jer",
    "025-lam", "026-eze", "027-dan", "028-hos", "029-joe", "030-amo", "031-oba", "032-jon",
    "033-mic", "034-nah", "035-hab", "036-zep", "037-hag", "038-zec", "039-mal",
    // NT (40-66)
    "040-mat", "041-mrk", "042-luk", "043-joh", "044-act", "045-rom", "046-1co", "047-2co",
    "048-gal", "049-eph", "050-php", "051-col", "052-1th", "053-2th", "054-1ti", "055-2ti",
    "056-tit", "057-phm", "058-heb", "059-jam", "060-1pe", "061-2pe", "062-1jo", "063-2jo",
    "064-3jo", "065-jud", "066-rev",
    // Deutero (67-79)
    "067-tob", "068-jdt", "069-1ma", "070-2ma", "071-wis", "072-sir", "073-bar", "074-1es",
    "075-2es", "076-prm", "077-pra", "078-sus", "079-bel"
];

const LXX_MAP = {
    "001-gen": "grcbrent_002_GEN", "002-exo": "grcbrent_003_EXO", "003-lev": "grcbrent_004_LEV",
    "004-num": "grcbrent_005_NUM", "005-deu": "grcbrent_006_DEU", "006-jos": "grcbrent_007_JOS",
    "007-jdg": "grcbrent_008_JDG", "008-rut": "grcbrent_009_RUT", "009-1sa": "grcbrent_010_1SA",
    "010-2sa": "grcbrent_011_2SA", "011-1ki": "grcbrent_012_1KI", "012-2ki": "grcbrent_013_2KI",
    "013-1ch": "grcbrent_014_1CH", "014-2ch": "grcbrent_015_2CH", "015-ezr": "grcbrent_016_EZR",
    "016-neh": "grcbrent_017_NEH", "017-est": "grcbrent_018_EST", "018-job": "grcbrent_019_JOB",
    "019-psa": "grcbrent_020_PSA", "020-pro": "grcbrent_021_PRO", "021-ecc": "grcbrent_022_ECC",
    "022-sng": "grcbrent_023_SNG", "023-isa": "grcbrent_024_ISA", "024-jer": "grcbrent_025_JER",
    "025-lam": "grcbrent_026_LAM", "026-eze": "grcbrent_027_EZK", "027-dan": "grcbrent_028_DAN",
    "028-hos": "grcbrent_029_HOS", "029-joe": "grcbrent_030_JOL", "030-amo": "grcbrent_031_AMO",
    "031-oba": "grcbrent_032_OBA", "032-jon": "grcbrent_033_JON", "033-mic": "grcbrent_034_MIC",
    "034-nah": "grcbrent_035_NAM", "035-hab": "grcbrent_036_HAB", "036-zep": "grcbrent_037_ZEP",
    "037-hag": "grcbrent_038_HAG", "038-zec": "grcbrent_039_ZEC", "039-mal": "grcbrent_040_MAL",
    "067-tob": "grcbrent_041_TOB", "068-jdt": "grcbrent_042_JDT", "071-wis": "grcbrent_045_WIS",
    "072-sir": "grcbrent_046_SIR", "073-bar": "grcbrent_047_BAR", "078-sus": "grcbrent_050_SUS",
    "079-bel": "grcbrent_051_BEL"
};

const NT_MAP = {
    "040-mat": "MAT", "041-mrk": "MRK", "042-luk": "LUK", "043-joh": "JHN", "044-act": "ACT",
    "045-rom": "ROM", "046-1co": "1CO", "047-2co": "2CO", "048-gal": "GAL", "049-eph": "EPH",
    "050-php": "PHP", "051-col": "COL", "052-1th": "1TH", "053-2th": "2TH", "054-1ti": "1TI",
    "055-2ti": "2TI", "056-tit": "TIT", "057-phm": "PHM", "058-heb": "HEB", "059-jam": "JAS",
    "060-1pe": "1PE", "061-2pe": "2PE", "062-1jo": "1JN", "063-2jo": "2JN", "064-3jo": "3JN",
    "065-jud": "JUD", "066-rev": "REV"
};

function extractGermanVerses(bookCode) {
    const germanPath = path.join(BASE_DIR, "german", "bücher", `${bookCode}.html`);
    if (!fs.existsSync(germanPath)) return {};
    
    const html = fs.readFileSync(germanPath, 'utf8');
    const verses = {};
    
    // Extract base-p German texts (match only text content, no nested tags)
    const verseRegex = /<div class="vb" id="v(\d+)-(\d+)">[\s\S]*?<p class="base base-p">([^<]+)<\/p>/g;
    let match;
    while ((match = verseRegex.exec(html)) !== null) {
        const ch = match[1];
        const v = match[2];
        const text = match[3].trim();
        verses[`${ch}-${v}`] = text;
    }
    
    return verses;
}

function getGreekVersesLXX(lxxPrefix) {
    const verses = {};
    let chNum = 1;
    
    while (true) {
        const chStr = String(chNum).padStart(2, '0');
        const filePath = path.join(LXX_DIR, `${lxxPrefix}_${chStr}_read.txt`);
        if (!fs.existsSync(filePath)) break;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/).slice(2).filter(l => l.trim());
        
        lines.forEach((line, idx) => {
            const verseNum = idx + 1;
            verses[`${chNum}-${verseNum}`] = line.trim();
        });
        
        chNum++;
    }
    
    return verses;
}

function getGreekVersesNT(ntPrefix) {
    const verses = {};
    let chNum = 1;
    
    while (true) {
        const chStr = String(chNum).padStart(2, '0');
        const filePath = path.join(NT_DIR, `${ntPrefix}_${chStr}.txt`);
        if (!fs.existsSync(filePath)) break;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/).slice(2).filter(l => l.trim());
        
        lines.forEach((line, idx) => {
            const verseNum = idx + 1;
            verses[`${chNum}-${verseNum}`] = line.trim();
        });
        
        chNum++;
    }
    
    return verses;
}

function fixItalianBook(bookCode) {
    const italianPath = path.join(BASE_DIR, "italian", "bücher", `${bookCode}.html`);
    if (!fs.existsSync(italianPath)) {
        return { status: 'not-found' };
    }
    
    // Get German base-p texts
    const germanVerses = extractGermanVerses(bookCode);
    if (Object.keys(germanVerses).length === 0) {
        return { status: 'no-german' };
    }
    
    // Get Greek texts
    let greekVerses = {};
    if (LXX_MAP[bookCode]) {
        greekVerses = getGreekVersesLXX(LXX_MAP[bookCode]);
    } else if (NT_MAP[bookCode]) {
        greekVerses = getGreekVersesNT(NT_MAP[bookCode]);
    }
    
    let html = fs.readFileSync(italianPath, 'utf8');
    let replacedGerman = 0;
    let addedGreek = 0;
    
    // Replace base-p with German and add base-o with Greek
    const verseRegex = /<div class="vb" id="v(\d+)-(\d+)">([\s\S]*?)<\/div>/g;
    html = html.replace(verseRegex, (match, ch, v, content) => {
        const verseKey = `${ch}-${v}`;
        let newContent = content;
        
        // Replace base-p with German
        if (germanVerses[verseKey]) {
            const basePRegex = /(<p class="base base-p">)[\s\S]*?(<\/p>)/;
            if (basePRegex.test(newContent)) {
                newContent = newContent.replace(basePRegex, `$1${germanVerses[verseKey]}$2`);
                replacedGerman++;
            }
        }
        
        // Add base-o with Greek if not exists
        if (greekVerses[verseKey]) {
            if (!newContent.includes('class="base base-o"')) {
                // Insert before <p class="tra">
                const traRegex = /(\s*)(<p class="tra">)/;
                if (traRegex.test(newContent)) {
                    const greekElement = `$1<p class="base base-o">${greekVerses[verseKey]}</p>\n$1$2`;
                    newContent = newContent.replace(traRegex, greekElement);
                    addedGreek++;
                }
            }
        }
        
        return `<div class="vb" id="v${ch}-${v}">${newContent}</div>`;
    });
    
    if (replacedGerman > 0 || addedGreek > 0) {
        fs.writeFileSync(italianPath, html, 'utf8');
    }
    
    return { status: 'ok', german: replacedGerman, greek: addedGreek };
}

console.log("\n=== FIXING ITALIAN: German base-p + Greek base-o ===\n");

let totalGerman = 0;
let totalGreek = 0;

for (const book of BOOKS) {
    process.stdout.write(`  ${book}.html... `);
    const result = fixItalianBook(book);
    
    if (result.status === 'ok') {
        console.log(`✓ ${result.german} German, ${result.greek} Greek`);
        totalGerman += result.german;
        totalGreek += result.greek;
    } else if (result.status === 'not-found') {
        console.log('⚠ not found');
    } else if (result.status === 'no-german') {
        console.log('⚠ no German verses');
    }
}

console.log("\n=== DONE ===");
console.log(`Total: ${totalGerman} German verses, ${totalGreek} Greek verses`);
