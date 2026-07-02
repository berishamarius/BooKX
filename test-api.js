const https = require('https');

// Test API call
https.get('https://api.quran.com/api/v4/chapters?language=de', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Full chapter 1 response:');
    console.log(JSON.stringify(json.chapters[0], null, 2));
  });
}).on('error', console.error);
