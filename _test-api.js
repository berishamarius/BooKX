const https = require('https');

https.get('https://api.quran.com/api/v4/quran/translations/27?chapter_number=2', (r) => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const j = JSON.parse(d);
    console.log('API 2:8:', j.translations[7].text);
    console.log('API 2:19:', j.translations[18].text);
    console.log('API 2:30:', j.translations[29].text);
  });
});
