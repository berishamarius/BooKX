/**
 * UPDATE ALL INTROS - Better approach
 * Liest aktuelle Texte und ersetzt sie respektvoll
 */

const fs = require('fs');
const path = require('path');

const langs = [
  'Deutsch',
  'Englisch',
  'Albanisch',
  'Bengalisch',
  'Bosnisch',
  'Chinesisch',
  'Französisch',
  'Hausa',
  'Hindi',
  'Indonesisch',
  'Kasachisch',
  'Persisch',
  'Russisch',
  'Spanisch',
  'Tagalog',
  'Thailändisch',
  'Türkisch',
  'Urdu',
  'Uygurisch'
];

const REPLACEMENTS = {
  'Deutsch': {
    old: 'Dieser Quran entstand aus einem einzigen Wunsch: jedem Menschen die Möglichkeit zu geben, das Wort Allahs zu lesen und zu verstehen.',
    new: 'Diese Übersetzung des Quran wurde mit dem Ziel erstellt, den heiligen Text zugänglich und verständlich zu machen.'
  },
  'Englisch': {
    old: 'This Quran was born from a single desire: to give every person the opportunity to read the word of Allah.',
    new: 'This Quran translation was created with the aim of making the holy text accessible and understandable.'
  },
  'Französisch': {
    old: 'Ce Coran est né d\'un seul désir : donner à chaque personne la possibilité de lire la parole d\'Allah.',
    new: 'Cette traduction du Coran a été créée dans le but de rendre le texte sacré accessible et compréhensible.'
  },
  'Spanisch': {
    old: 'Este Corán nació de un único deseo: dar a cada persona la oportunidad de leer la palabra de Alá.',
    new: 'Esta traducción del Corán fue creada con el objetivo de hacer que el texto sagrado sea accesible y comprensible.'
  }
};

// First, let's read the actual texts from existing files
console.log('📖 Reading current intro.html files to find exact texts...\n');

for (const lang of langs) {
  const introPath = path.join(__dirname, `dist-alquran/Übersetzungen/${lang}/intro.html`);
  if (fs.existsSync(introPath)) {
    const content = fs.readFileSync(introPath, 'utf8');
    // Extract <p> after h2
    const match = content.match(/<h2[^>]*>.*?<\/h2>\s*<p>(.*?)<\/p>/s);
    if (match) {
      console.log(`${lang}:`);
      console.log(`  "${match[1]}"\n`);
    }
  }
}
