const { astro } = require('iztro');
const result = astro.bySolar('2000-01-01', 1, 'M', true);
console.log(JSON.stringify(result, null, 2));
