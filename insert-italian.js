// Insert Greek verses into ITALIAN structure (verse-block + latin + trans)
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX";
const LXX_DIR = path.join(BASE_DIR, "temp-septuagint");
const NT_DIR = path.join(BASE_DIR, "temp-sblgnt-verses");
const DIST_DIR = path.join(BASE_DIR, "dist-diebibel");

// ALL BOOKS: OT (1-39), NT (40-66), Deutero (67-79)
const BOOKS = [
    // OLD TESTAMENT
    ["001-gen", "lxx", "grcbrent_002_GEN"],
    ["002-exo", "lxx", "grcbrent_003_EXO"],
    ["003-lev", "lxx", "grcbrent_004_LEV"],
    ["004-num", "lxx", "grcbrent_005_NUM"],
    ["005-deu", "lxx", "grcbrent_006_DEU"],
    ["006-jos", "lxx", "grcbrent_007_JOS"],
    ["007-jdg", "lxx", "grcbrent_008_JDG"],
    ["008-rut", "lxx", "grcbrent_009_RUT"],
    ["009-1sa", "lxx", "grcbrent_010_1SA"],
    ["010-2sa", "lxx", "grcbrent_011_2SA"],
    ["011-1ki", "lxx", "grcbrent_012_1KI"],
    ["012-2ki", "lxx", "grcbrent_013_2KI"],
    ["013-1ch", "lxx", "grcbrent_014_1CH"],
    ["014-2ch", "lxx", "grcbrent_015_2CH"],
    ["015-ezr", "lxx", "grcbrent_016_EZR"],
    ["016-neh", "lxx", "grcbrent_017_NEH"],
    ["017-est", "lxx", "grcbrent_018_EST"],
    ["018-job", "lxx", "grcbrent_019_JOB"],
    ["019-psa", "lxx", "grcbrent_020_PSA"],
    ["020-pro", "lxx", "grcbrent_021_PRO"],
    ["021-ecc", "lxx", "grcbrent_022_ECC"],
    ["022-sng", "lxx", "grcbrent_023_SNG"],
    ["023-isa", "lxx", "grcbrent_024_ISA"],
    ["024-jer", "lxx", "grcbrent_025_JER"],
    ["025-lam", "lxx", "grcbrent_026_LAM"],
    ["026-eze", "lxx", "grcbrent_027_EZK"],
    ["027-dan", "lxx", "grcbrent_028_DAN"],
    ["028-hos", "lxx", "grcbrent_029_HOS"],
    ["029-joe", "lxx", "grcbrent_030_JOL"],
    ["030-amo", "lxx", "grcbrent_031_AMO"],
    ["031-oba", "lxx", "grcbrent_032_OBA"],
    ["032-jon", "lxx", "grcbrent_033_JON"],
    ["033-mic", "lxx", "grcbrent_034_MIC"],
    ["034-nah", "lxx", "grcbrent_035_NAM"],
    ["035-hab", "lxx", "grcbrent_036_HAB"],
    ["036-zep", "lxx", "grcbrent_037_ZEP"],
    ["037-hag", "lxx", "grcbrent_038_HAG"],
    ["038-zec", "lxx", "grcbrent_039_ZEC"],
    ["039-mal", "lxx", "grcbrent_040_MAL"],
    // NEW TESTAMENT
    ["040-mat", "nt", "MAT"],
    ["041-mrk", "nt", "MRK"],
    ["042-luk", "nt", "LUK"],
    ["043-joh", "nt", "JHN"],
    ["044-act", "nt", "ACT"],
    ["045-rom", "nt", "ROM"],
    ["046-1co", "nt", "1CO"],
    ["047-2co", "nt", "2CO"],
    ["048-gal", "nt", "GAL"],
    ["049-eph", "nt", "EPH"],
    ["050-php", "nt", "PHP"],
    ["051-col", "nt", "COL"],
    ["052-1th", "nt", "1TH"],
    ["053-2th", "nt", "2TH"],
    ["054-1ti", "nt", "1TI"],
    ["055-2ti", "nt", "2TI"],
    ["056-tit", "nt", "TIT"],
    ["057-phm", "nt", "PHM"],
    ["058-heb", "nt", "HEB"],
    ["059-jam", "nt", "JAS"],
    ["060-1pe", "nt", "1PE"],
    ["061-2pe", "nt", "2PE"],
    ["062-1jo", "nt", "1JN"],
    ["063-2jo", "nt", "2JN"],
    ["064-3jo", "nt", "3JN"],
    ["065-jud", "nt", "JUD"],
    ["066-rev", "nt", "REV"],
    // DEUTEROCANONICAL
    ["067-tob", "lxx", "grcbrent_041_TOB"],
    ["068-jdt", "lxx", "grcbrent_042_JDT"],
    ["071-wis", "lxx", "grcbrent_045_WIS"],
    ["072-sir", "lxx", "grcbrent_046_SIR"],
    ["073-bar", "lxx", "grcbrent_047_BAR"],
    ["078-sus", "lxx", "grcbrent_050_SUS"],
    ["079-bel", "lxx", "grcbrent_051_BEL"]
];

function getChapters(type, prefix) {
    const chapters = [];
    let chNum = 1;
    const baseDir = type === 'nt' ? NT_DIR : LXX_DIR;
    const filePattern = type === 'nt' ? `${prefix}_##.txt` : `${prefix}_##_read.txt`;
    
    while (true) {
        const chStr = String(chNum).padStart(2, '0');
        const fileName = filePattern.replace('##', chStr);
        const filePath = path.join(baseDir, fileName);
        if (!fs.existsSync(filePath)) break;
        chapters.push({ num: chNum, path: filePath });
        chNum++;
    }
    return chapters;
}

function parseVerses(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    return lines.slice(2).filter(line => line.trim().length > 0);
}

function insertVerse(html, chapterNum, verseNum, greekText) {
    // Italian structure: <div class="verse-block" id="v1-1">...<div class="trans">TEXT</div>
    // Insert Greek BEFORE the trans div
    const versePattern = new RegExp(
        `(<div class="verse-block"[^>]*id="v${chapterNum}-${verseNum}"[^>]*>[\\s\\S]*?)<div class="trans">`,
        'i'
    );
    
    const match = html.match(versePattern);
    if (!match) return { html, inserted: false };
    
    // Check if already has Greek
    if (match[1].includes('<div class="greek">')) {
        return { html, inserted: false, reason: 'has-greek' };
    }
    
    // Insert Greek div before trans
    const greekElement = `<div class="greek">${greekText}</div>\n        `;
    const newHtml = html.replace(versePattern, `${match[1]}${greekElement}<div class="trans">`);
    
    return { html: newHtml, inserted: true };
}

function processBook(bookCode, type, prefix) {
    const bookPath = path.join(DIST_DIR, "italian", "bücher", `${bookCode}.html`);
    
    if (!fs.existsSync(bookPath)) {
        return { status: 'not-found', verses: 0 };
    }
    
    const chapters = getChapters(type, prefix);
    if (chapters.length === 0) {
        return { status: 'no-source', verses: 0 };
    }
    
    let html = fs.readFileSync(bookPath, 'utf8');
    let insertedCount = 0;
    let hasGreek = false;
    
    for (const chapter of chapters) {
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
        // Add CSS for Greek if not present
        if (!html.includes('.greek {')) {
            const cssInsert = `
/* ── GRIECHISCHER TEXT (Orthodox) ─────────────────── */
.greek {
  font-family:var(--font-body); font-size:1.04rem; line-height:1.85;
  color:#1A4D2E; font-weight:500;
  border-left:3px solid #8B6914; padding-left:12px;
  margin-bottom:8px;
  display:none;
}
body[data-conf="orthodox"] .greek { display:block; }

</style>`;
            html = html.replace('</style>', cssInsert);
        }
        
        fs.writeFileSync(bookPath, html, 'utf8');
        return { status: 'inserted', verses: insertedCount };
    } else if (hasGreek) {
        return { status: 'has-greek', verses: 0 };
    } else {
        return { status: 'no-verses', verses: 0 };
    }
}

console.log("\n=== INSERTING GREEK VERSES INTO ITALIAN ===\n");

let totalInserted = 0;

for (const [bookCode, type, prefix] of BOOKS) {
    process.stdout.write(`  ${bookCode}.html... `);
    
    const result = processBook(bookCode, type, prefix);
    
    if (result.status === 'inserted') {
        console.log(`✓ ${result.verses} verses`);
        totalInserted += result.verses;
    } else if (result.status === 'has-greek') {
        console.log('Already has Greek');
    } else if (result.status === 'not-found') {
        console.log('⚠ not found');
    } else if (result.status === 'no-source') {
        console.log('No source files');
    } else {
        console.log('⚠ 0 verses');
    }
}

console.log("\n=== DONE ===");
console.log(`Total verses inserted: ${totalInserted}`);
