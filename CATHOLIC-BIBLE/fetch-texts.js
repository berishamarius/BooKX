'use strict';

/**
 * BIBLIA CATHOLICA INTERLINEARIS – TEXT DOWNLOADER
 * ──────────────────────────────────────────────────
 * Lädt alle Bibelverse von der getbible.net API v2
 * und speichert sie als JSON-Cache lokal.
 *
 * Quellen (Public Domain / gemeinfreie Texte):
 *   - Vulgata Clementina (Latein) – vor 1887, gemeinfrei
 *   - King James Version 1611 (Englisch) – gemeinfrei
 *   - Luther Bibel 1912 (Deutsch) – gemeinfrei
 *   - Louis Segond 1910 (Französisch) – gemeinfrei
 *   - Reina-Valera 1909 (Spanisch) – gemeinfrei
 *   - Giovanni Diodati (Italienisch) – gemeinfrei
 *   - Almeida / Corrigida (Portugiesisch) – gemeinfrei
 *   - Biblia Gdańska (Polnisch) – gemeinfrei
 *   - Biblia Română Cornilescu 1921 (Rumänisch) – gemeinfrei
 *   - Synodalübersetzung 1876 (Russisch) – gemeinfrei
 *   - Kroatische Bibel (Kroatisch) – gemeinfrei
 *   - Statenvertaling 1637 (Niederländisch) – gemeinfrei
 *   - Károli 1908 (Ungarisch) – gemeinfrei
 *   - Bible Kralická 1613 (Tschechisch) – gemeinfrei
 *   - Svenska Bibeln (Schwedisch) – gemeinfrei
 *   - Ang Biblia 1905 (Filipino/Tagalog) – gemeinfrei
 *   - Bibelübersetzung Ohienko 1962 (Ukrainisch) – gemeinfrei
 *
 * Ausführung: node fetch-texts.js
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

// ═══════════════════════════════════════════════════════
//  KONFIGURATION
// ═══════════════════════════════════════════════════════

const BASE_URL  = 'https://getbible.net/v2';
const DATA_DIR  = path.join(__dirname, 'data');
const DELAY_MS  = 500;
const RETRY_MAX = 3;

// ═══════════════════════════════════════════════════════
//  ÜBERSETZUNGEN
// ═══════════════════════════════════════════════════════

const TRANSLATIONS = [
  { code: 'vulgate',    lang: 'la', name: 'Latin',       display: 'Vulgata Clementina',          isBase: true  },
  { code: 'kjv',        lang: 'en', name: 'Englisch',    display: 'King James Version (1611)'                  },
  { code: 'german',     lang: 'de', name: 'Deutsch',     display: 'Luther Bibel (1912)'                        },
  { code: 'french',     lang: 'fr', name: 'Français',    display: 'Louis Segond (1910)'                        },
  { code: 'spanish',    lang: 'es', name: 'Español',     display: 'Reina-Valera (1909)'                        },
  { code: 'italian',    lang: 'it', name: 'Italiano',    display: 'Giovanni Diodati'                           },
  { code: 'portuguese', lang: 'pt', name: 'Português',   display: 'Almeida Revista e Corrigida'                },
  { code: 'polish',     lang: 'pl', name: 'Polski',      display: 'Biblia Gdańska'                             },
  { code: 'romanian',   lang: 'ro', name: 'Română',      display: 'Cornilescu (1921)'                          },
  { code: 'russian',    lang: 'ru', name: 'Русский',     display: 'Синодальный перевод (1876)'                 },
  { code: 'croatian',   lang: 'hr', name: 'Hrvatski',    display: 'Hrvatska Biblija'                           },
  { code: 'dutch',      lang: 'nl', name: 'Nederlands',  display: 'Statenvertaling (1637)'                     },
  { code: 'hungarian',  lang: 'hu', name: 'Magyar',      display: 'Károli (1908)'                              },
  { code: 'czech',      lang: 'cs', name: 'Čeština',     display: 'Bible Kralická (1613)'                      },
  { code: 'swedish',    lang: 'sv', name: 'Svenska',     display: 'Svenska Bibeln'                             },
  { code: 'tagalog',    lang: 'tl', name: 'Filipino',    display: 'Ang Biblia (1905)'                          },
  { code: 'ukrainian',  lang: 'uk', name: 'Українська',  display: 'Біблія Огієнка (1962)'                     },
];

// ═══════════════════════════════════════════════════════
//  BÜCHER (66 Protestant + 7 Deuterokanonisch = 73 kath.)
// ═══════════════════════════════════════════════════════

const BOOKS_PROTESTANT = [
  // ── Altes Testament ──────────────────────────────────
  { nr:  1, abbrev: 'gen', name: 'Genesis',           latin: 'Genesis'              },
  { nr:  2, abbrev: 'exo', name: 'Exodus',            latin: 'Exodus'               },
  { nr:  3, abbrev: 'lev', name: 'Leviticus',         latin: 'Leviticus'            },
  { nr:  4, abbrev: 'num', name: 'Numbers',           latin: 'Numeri'               },
  { nr:  5, abbrev: 'deu', name: 'Deuteronomy',       latin: 'Deuteronomium'        },
  { nr:  6, abbrev: 'jos', name: 'Joshua',            latin: 'Iosue'                },
  { nr:  7, abbrev: 'jdg', name: 'Judges',            latin: 'Iudicum'              },
  { nr:  8, abbrev: 'rut', name: 'Ruth',              latin: 'Ruth'                 },
  { nr:  9, abbrev: '1sa', name: '1 Samuel',          latin: 'I Regum'              },
  { nr: 10, abbrev: '2sa', name: '2 Samuel',          latin: 'II Regum'             },
  { nr: 11, abbrev: '1ki', name: '1 Kings',           latin: 'III Regum'            },
  { nr: 12, abbrev: '2ki', name: '2 Kings',           latin: 'IV Regum'             },
  { nr: 13, abbrev: '1ch', name: '1 Chronicles',      latin: 'I Paralipomenon'      },
  { nr: 14, abbrev: '2ch', name: '2 Chronicles',      latin: 'II Paralipomenon'     },
  { nr: 15, abbrev: 'ezr', name: 'Ezra',              latin: 'I Esdras'             },
  { nr: 16, abbrev: 'neh', name: 'Nehemiah',          latin: 'II Esdras'            },
  { nr: 17, abbrev: 'est', name: 'Esther',            latin: 'Esther'               },
  { nr: 18, abbrev: 'job', name: 'Job',               latin: 'Iob'                  },
  { nr: 19, abbrev: 'psa', name: 'Psalms',            latin: 'Psalmi'               },
  { nr: 20, abbrev: 'pro', name: 'Proverbs',          latin: 'Proverbia'            },
  { nr: 21, abbrev: 'ecc', name: 'Ecclesiastes',      latin: 'Ecclesiastes'         },
  { nr: 22, abbrev: 'sng', name: 'Song of Solomon',   latin: 'Canticum Canticorum'  },
  { nr: 23, abbrev: 'isa', name: 'Isaiah',            latin: 'Isaias'               },
  { nr: 24, abbrev: 'jer', name: 'Jeremiah',          latin: 'Ieremias'             },
  { nr: 25, abbrev: 'lam', name: 'Lamentations',      latin: 'Threni'               },
  { nr: 26, abbrev: 'eze', name: 'Ezekiel',           latin: 'Ezechiel'             },
  { nr: 27, abbrev: 'dan', name: 'Daniel',            latin: 'Daniel'               },
  { nr: 28, abbrev: 'hos', name: 'Hosea',             latin: 'Osee'                 },
  { nr: 29, abbrev: 'joe', name: 'Joel',              latin: 'Ioel'                 },
  { nr: 30, abbrev: 'amo', name: 'Amos',              latin: 'Amos'                 },
  { nr: 31, abbrev: 'oba', name: 'Obadiah',           latin: 'Abdias'               },
  { nr: 32, abbrev: 'jon', name: 'Jonah',             latin: 'Ionas'                },
  { nr: 33, abbrev: 'mic', name: 'Micah',             latin: 'Micheas'              },
  { nr: 34, abbrev: 'nah', name: 'Nahum',             latin: 'Nahum'                },
  { nr: 35, abbrev: 'hab', name: 'Habakkuk',          latin: 'Habacuc'              },
  { nr: 36, abbrev: 'zep', name: 'Zephaniah',         latin: 'Sophonias'            },
  { nr: 37, abbrev: 'hag', name: 'Haggai',            latin: 'Aggaeus'              },
  { nr: 38, abbrev: 'zec', name: 'Zechariah',         latin: 'Zacharias'            },
  { nr: 39, abbrev: 'mal', name: 'Malachi',           latin: 'Malachias'            },
  // ── Neues Testament ──────────────────────────────────
  { nr: 40, abbrev: 'mat', name: 'Matthew',           latin: 'Matthaeus'            },
  { nr: 41, abbrev: 'mrk', name: 'Mark',              latin: 'Marcus'               },
  { nr: 42, abbrev: 'luk', name: 'Luke',              latin: 'Lucas'                },
  { nr: 43, abbrev: 'joh', name: 'John',              latin: 'Ioannes'              },
  { nr: 44, abbrev: 'act', name: 'Acts',              latin: 'Actus Apostolorum'    },
  { nr: 45, abbrev: 'rom', name: 'Romans',            latin: 'Ad Romanos'           },
  { nr: 46, abbrev: '1co', name: '1 Corinthians',     latin: 'I Ad Corinthios'      },
  { nr: 47, abbrev: '2co', name: '2 Corinthians',     latin: 'II Ad Corinthios'     },
  { nr: 48, abbrev: 'gal', name: 'Galatians',         latin: 'Ad Galatas'           },
  { nr: 49, abbrev: 'eph', name: 'Ephesians',         latin: 'Ad Ephesios'          },
  { nr: 50, abbrev: 'php', name: 'Philippians',       latin: 'Ad Philippenses'      },
  { nr: 51, abbrev: 'col', name: 'Colossians',        latin: 'Ad Colossenses'       },
  { nr: 52, abbrev: '1th', name: '1 Thessalonians',   latin: 'I Ad Thessalonicenses'},
  { nr: 53, abbrev: '2th', name: '2 Thessalonians',   latin: 'II Ad Thessalonicenses'},
  { nr: 54, abbrev: '1ti', name: '1 Timothy',         latin: 'I Ad Timotheum'       },
  { nr: 55, abbrev: '2ti', name: '2 Timothy',         latin: 'II Ad Timotheum'      },
  { nr: 56, abbrev: 'tit', name: 'Titus',             latin: 'Ad Titum'             },
  { nr: 57, abbrev: 'phm', name: 'Philemon',          latin: 'Ad Philemonem'        },
  { nr: 58, abbrev: 'heb', name: 'Hebrews',           latin: 'Ad Hebraeos'          },
  { nr: 59, abbrev: 'jam', name: 'James',             latin: 'Iacobi'               },
  { nr: 60, abbrev: '1pe', name: '1 Peter',           latin: 'I Petri'              },
  { nr: 61, abbrev: '2pe', name: '2 Peter',           latin: 'II Petri'             },
  { nr: 62, abbrev: '1jo', name: '1 John',            latin: 'I Ioannis'            },
  { nr: 63, abbrev: '2jo', name: '2 John',            latin: 'II Ioannis'           },
  { nr: 64, abbrev: '3jo', name: '3 John',            latin: 'III Ioannis'          },
  { nr: 65, abbrev: 'jud', name: 'Jude',              latin: 'Iudae'                },
  { nr: 66, abbrev: 'rev', name: 'Revelation',        latin: 'Apocalypsis'          },
];

// Deuterokanonische Bücher (nur Vulgata)
const BOOKS_DEUTEROCANON = [
  { nr: 67, abbrev: 'tob', name: 'Tobit',       latin: 'Tobias'         },
  { nr: 68, abbrev: 'jdt', name: 'Judith',      latin: 'Iudith'         },
  { nr: 69, abbrev: '1ma', name: '1 Maccabees', latin: 'I Machabaeorum' },
  { nr: 70, abbrev: '2ma', name: '2 Maccabees', latin: 'II Machabaeorum'},
  { nr: 71, abbrev: 'wis', name: 'Wisdom',      latin: 'Sapientia'      },
  { nr: 72, abbrev: 'sir', name: 'Sirach',      latin: 'Ecclesiasticus' },
  { nr: 73, abbrev: 'bar', name: 'Baruch',      latin: 'Baruch'         },
];

// ═══════════════════════════════════════════════════════
//  HELFER
// ═══════════════════════════════════════════════════════

function apiGet(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const req = lib.get(url, {
      headers: {
        'Accept':     'application/json',
        'User-Agent': 'BibliaInterlinearis/1.0 (BooKX eBook Project)',
      },
    }, (res) => {
      // Weiterleitungen (301, 302, 307, 308) folgen
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        res.resume();
        if (redirects >= 5) { reject(new Error('TOO_MANY_REDIRECTS')); return; }
        const loc = res.headers.location;
        if (!loc) { reject(new Error('REDIRECT_NO_LOCATION')); return; }
        const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
        resolve(apiGet(next, redirects + 1));
        return;
      }
      if (res.statusCode === 404) { reject(new Error('NOT_FOUND'));             return; }
      if (res.statusCode === 429) { reject(new Error('RATE_LIMIT'));            return; }
      if (res.statusCode !== 200) { reject(new Error('HTTP_' + res.statusCode)); return; }
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON_PARSE')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('TIMEOUT')); });
  });
}

async function apiGetRetry(url, attempt = 1) {
  try {
    return await apiGet(url);
  } catch (err) {
    if (err.message === 'NOT_FOUND') throw err;
    if (attempt >= RETRY_MAX) throw err;
    const wait = err.message === 'RATE_LIMIT' ? 10000 : 2500;
    await delay(wait);
    return apiGetRetry(url, attempt + 1);
  }
}

const delay   = ms => new Promise(r => setTimeout(r, ms));
const mkDir   = d  => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const pad3    = n  => String(n).padStart(3, '0');

// ═══════════════════════════════════════════════════════
//  HAUPTPROGRAMM
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   BIBLIA CATHOLICA INTERLINEARIS – TEXT DOWNLOADER    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log('  Quelle: getbible.net API v2  (Public Domain Texte)\n');

  mkDir(DATA_DIR);

  for (const t of TRANSLATIONS) {
    console.log(`\n📖  [${t.code.padEnd(10)}]  ${t.name} – ${t.display}`);
    const dir = path.join(DATA_DIR, t.code);
    mkDir(dir);

    const books = t.isBase
      ? [...BOOKS_PROTESTANT, ...BOOKS_DEUTEROCANON]
      : BOOKS_PROTESTANT;

    let fetched = 0, cached = 0, missing = 0;

    for (const book of books) {
      const file       = path.join(dir, `${pad3(book.nr)}.json`);
      const skipMarker = file + '.notfound';

      if (fs.existsSync(file))       { cached++;  continue; }
      if (fs.existsSync(skipMarker)) { missing++; continue; }

      const url = `${BASE_URL}/${t.code}/${book.nr}.json`;

      try {
        const data = await apiGetRetry(url);
        fs.writeFileSync(file, JSON.stringify(data));
        process.stdout.write(`  ✓ ${book.latin.padEnd(24)}`);
        fetched++;
        if (fetched % 4 === 0) process.stdout.write('\n');
        await delay(DELAY_MS);
      } catch (err) {
        if (err.message === 'NOT_FOUND') {
          fs.writeFileSync(skipMarker, '');
          missing++;
          if (t.isBase) {
            // Deuterokanon evtl. unter anderen Nummern – andere häufige Nummern prüfen
            const fallbackNrs = [book.nr + 10, book.nr + 20, book.nr - 10];
            for (const fnr of fallbackNrs) {
              const furl  = `${BASE_URL}/${t.code}/${fnr}.json`;
              const ffile = path.join(dir, `${pad3(book.nr)}.json`);
              try {
                const fdata = await apiGetRetry(furl);
                // Nur speichern wenn Buchtitel übereinstimmt
                const bname = (fdata.book_name || '').toLowerCase();
                if (bname.includes(book.name.split(' ').pop().toLowerCase()) ||
                    bname.includes(book.latin.split(' ').pop().toLowerCase())) {
                  fs.writeFileSync(ffile, JSON.stringify(fdata));
                  fs.unlinkSync(skipMarker);
                  fetched++; missing--;
                  process.stdout.write(`  ✓ ${book.latin.padEnd(24)}(@${fnr})`);
                  break;
                }
                await delay(300);
              } catch (_) { /* ignore */ }
            }
          }
        } else {
          console.error(`\n  ⚠  ${book.name}: ${err.message}`);
        }
      }
    }

    if (fetched % 4 !== 0) process.stdout.write('\n');
    console.log(`  ── ${fetched} heruntergeladen · ${cached} gecacht · ${missing} nicht verfügbar`);
  }

  console.log('\n✅  Alle Texte gespeichert unter: ' + DATA_DIR);
  console.log('\n  Nächster Schritt: node build.js\n');
}

main().catch(err => {
  console.error('\n❌  Fehler:', err.message);
  process.exit(1);
});
