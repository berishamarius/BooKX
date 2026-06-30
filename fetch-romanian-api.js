/**
 * FETCH ROMANIAN CORNILESCU (1921) TRANSLATION
 * Use Bolls Life API for Romanian Bible
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Bolls Life API - has Romanian Cornilescu
const API_BASE = 'https://bolls.life/get-paralel-multiple/';

// Bible books mapping (1-66 for now, catholic books later)
const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

async function fetchBook(bookIndex) {
  return new Promise((resolve, reject) => {
    // Bolls API format: /book/chapter/translations
    // We need to fetch chapter by chapter
    const url = `${API_BASE}${BOOKS[bookIndex]}/1/RO-CORNILESCU/`;
    
    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error('Parse error'));
          }
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    }).on('timeout', () => {
      reject(new Error('Timeout'));
    }).on('error', reject);
  });
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║      FETCH ROMANIAN CORNILESCU FROM BOLLS LIFE API       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  console.log('Testing API with Genesis chapter 1...\n');
  
  try {
    const gen1 = await fetchBook(0); // Genesis
    console.log('✓ API Response received');
    console.log('Sample:', JSON.stringify(gen1).substring(0, 300));
  } catch (e) {
    console.log(`✗ API Error: ${e.message}`);
    console.log('\nTrying alternative: Bible API (bible-api.com)...\n');
    
    // Try bible-api.com alternative
    const altUrl = 'https://bible-api.com/genesis+1?translation=ro-cornilescu';
    https.get(altUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data.substring(0, 500));
      });
    }).on('error', (e) => console.log('Error:', e.message));
  }
}

main();
