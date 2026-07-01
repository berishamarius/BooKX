// Insert Septuagint (Greek) verses into all verse files
const fs = require('fs');
const path = require('path');

const BASE_DIR = "C:\\Users\\beris_xrgc50t\\KX KroniX\\BooKX";
const LXX_DIR = path.join(BASE_DIR, "temp-septuagint");
const DIST_DIR = path.join(BASE_DIR, "dist-diebibel");

// ALL 79 BOOKS - OLD TESTAMENT, NEW TESTAMENT, DEUTEROCANONICAL
const BOOKS = [
    // OLD TESTAMENT (1-39) - SEPTUAGINT (LXX)
    ["001-gen", "grcbrent_002_GEN"],
    ["002-exo", "grcbrent_003_EXO"],
    ["003-lev", "grcbrent_004_LEV"],
    ["004-num", "grcbrent_005_NUM"],
    ["005-deu", "grcbrent_006_DEU"],
    ["006-jos", "grcbrent_007_JOS"],
    ["007-jdg", "grcbrent_008_JDG"],
    ["008-rut", "grcbrent_009_RUT"],
    ["009-1sa", "grcbrent_010_1SA"],
    ["010-2sa", "grcbrent_011_2SA"],
    ["011-1ki", "grcbrent_012_1KI"],
    ["012-2ki", "grcbrent_013_2KI"],
    ["013-1ch", "grcbrent_014_1CH"],
    ["014-2ch", "grcbrent_015_2CH"],
    ["015-ezr", "grcbrent_016_EZR"],
    ["016-neh", "grcbrent_017_NEH"],
    ["017-est", "grcbrent_018_EST"],
    ["018-job", "grcbrent_019_JOB"],
    ["019-psa", "grcbrent_020_PSA"],
    ["020-pro", "grcbrent_021_PRO"],
    ["021-ecc", "grcbrent_022_ECC"],
    ["022-sng", "grcbrent_023_SNG"],
    ["023-isa", "grcbrent_024_ISA"],
    ["024-jer", "grcbrent_025_JER"],
    ["025-lam", "grcbrent_026_LAM"],
    ["026-eze", "grcbrent_027_EZK"],
    ["027-dan", "grcbrent_028_DAN"],
    ["028-hos", "grcbrent_029_HOS"],
    ["029-joe", "grcbrent_030_JOL"],
    ["030-amo", "grcbrent_031_AMO"],
    ["031-oba", "grcbrent_032_OBA"],
    ["032-jon", "grcbrent_033_JON"],
    ["033-mic", "grcbrent_034_MIC"],
    ["034-nah", "grcbrent_035_NAM"],
    ["035-hab", "grcbrent_036_HAB"],
    ["036-zep", "grcbrent_037_ZEP"],
    ["037-hag", "grcbrent_038_HAG"],
    ["038-zec", "grcbrent_039_ZEC"],
    ["039-mal", "grcbrent_040_MAL"],
    
    // NEW TESTAMENT (40-66) - GREEK NT
    ["040-mat", "grcbrent_041_MAT"],
    ["041-mrk", "grcbrent_042_MRK"],
    ["042-luk", "grcbrent_043_LUK"],
    ["043-joh", "grcbrent_044_JHN"],
    ["044-act", "grcbrent_045_ACT"],
    ["045-rom", "grcbrent_046_ROM"],
    ["046-1co", "grcbrent_047_1CO"],
    ["047-2co", "grcbrent_048_2CO"],
    ["048-gal", "grcbrent_049_GAL"],
    ["049-eph", "grcbrent_050_EPH"],
    ["050-php", "grcbrent_051_PHP"],
    ["051-col", "grcbrent_052_COL"],
    ["052-1th", "grcbrent_053_1TH"],
    ["053-2th", "grcbrent_054_2TH"],
    ["054-1ti", "grcbrent_055_1TI"],
    ["055-2ti", "grcbrent_056_2TI"],
    ["056-tit", "grcbrent_057_TIT"],
    ["057-phm", "grcbrent_058_PHM"],
    ["058-heb", "grcbrent_059_HEB"],
    ["059-jam", "grcbrent_060_JAS"],
    ["060-1pe", "grcbrent_061_1PE"],
    ["061-2pe", "grcbrent_062_2PE"],
    ["062-1jo", "grcbrent_063_1JN"],
    ["063-2jo", "grcbrent_064_2JN"],
    ["064-3jo", "grcbrent_065_3JN"],
    ["065-jud", "grcbrent_066_JUD"],
    ["066-rev", "grcbrent_067_REV"],
    
    // DEUTEROCANONICAL (67-79) - SEPTUAGINT
    ["067-tob", "grcbrent_068_TOB"],
    ["068-jdt", "grcbrent_069_JDT"],
    ["069-1ma", "grcbrent_070_1MA"],
    ["070-2ma", "grcbrent_071_2MA"],
    ["071-wis", "grcbrent_072_WIS"],
    ["072-sir", "grcbrent_073_SIR"],
    ["073-bar", "grcbrent_074_BAR"],
    ["074-1es", "grcbrent_075_1ES"],
    ["075-2es", "grcbrent_076_2ES"],
    ["076-prm", "grcbrent_077_PRM"],
    ["077-pra", "grcbrent_078_PRA"],
    ["078-sus", "grcbrent_079_SUS"],
    ["079-bel", "grcbrent_080_BEL"]
];

const LANGUAGES = [
    "german", "italian", "french", "spanish", "portuguese", "dutch",
    "czech", "polish", "swedish", "russian", "ukrainian", "hungarian",
    "armenian", "albanian", "croatian", "tagalog", "kjv", "serbian", "greek"
];

const TEST_ONLY = process.argv.includes('--test');

function main() {
    console.log("=== SEPTUAGINT INSERTION ===\n");
    
    const booksToProcess = TEST_ONLY ? [BOOKS[0]] : BOOKS;
    const langsToProcess = TEST_ONLY ? ["german"] : LANGUAGES;
    
    if (TEST_ONLY) {
        console.log("TEST MODE: Genesis only\n");
    }
    
    let totalInserted = 0;
    
    for (const lang of langsToProcess) {
        console.log(`\n→ ${lang}`);
        
        for (const [bookFile, lxxPrefix] of booksToProcess) {
            const bookHtml = `${bookFile}.html`;
            const bookPath = path.join(DIST_DIR, lang, "bücher", bookHtml);
            
            if (!fs.existsSync(bookPath)) {
                console.log(`  ⚠ ${bookHtml} not found`);
                continue;
            }
            
            process.stdout.write(`  ${bookHtml}... `);
            
            // Read file
            let content = fs.readFileSync(bookPath, 'utf8');
            
            // Check if already has Greek
            if (content.includes('<p class="base base-o">')) {
                console.log("Already has Greek");
                continue;
            }
            
            // Find all LXX chapter files
            const lxxFiles = fs.readdirSync(LXX_DIR)
                .filter(f => f.startsWith(lxxPrefix) && f.endsWith('_read.txt'))
                .sort();
            
            if (lxxFiles.length === 0) {
                console.log("No LXX files");
                continue;
            }
            
            let versesInserted = 0;
            let modified = content;
            
            // Process each chapter
            for (const lxxFile of lxxFiles) {
                // Extract chapter number
                const match = lxxFile.match(/_(\d+)_read\.txt$/);
                if (!match) continue;
                const chNum = parseInt(match[1]);
                
                // Read verses (skip first 2 lines)
                const lxxPath = path.join(LXX_DIR, lxxFile);
                const lines = fs.readFileSync(lxxPath, 'utf8').split('\n');
                const verses = lines.slice(2).map(l => l.trim()).filter(l => l);
                
                if (verses.length === 0) continue;
                
                // Insert each verse
                for (let vNum = 1; vNum <= verses.length; vNum++) {
                    const greekText = verses[vNum - 1];
                    if (!greekText) continue;
                    
                    // Pattern: find verse block, then insert Greek before .tra
                    const versePattern = new RegExp(
                        `(id="v${chNum}-${vNum}"[\\s\\S]*?<p class="base base-p">.*?</p>\\s*)(<p class="tra">)`,
                        'm'
                    );
                    
                    const greekLine = `    <p class="base base-o">${greekText}</p>\n`;
                    const replacement = `$1${greekLine}$2`;
                    
                    const before = modified;
                    modified = modified.replace(versePattern, replacement);
                    
                    if (modified !== before) {
                        versesInserted++;
                    }
                }
            }
            
            if (versesInserted > 0) {
                fs.writeFileSync(bookPath, modified, 'utf8');
                console.log(`✓ ${versesInserted} verses`);
                totalInserted += versesInserted;
            } else {
                console.log("⚠ 0 verses");
            }
        }
    }
    
    console.log(`\n=== DONE ===`);
    console.log(`Total verses inserted: ${totalInserted}`);
    
    if (TEST_ONLY) {
        console.log("\nCheck dist-diebibel/german/bücher/001-gen.html");
        console.log("If OK, run without --test to process all books");
    }
}

main();
