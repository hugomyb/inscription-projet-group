const fs = require('fs');
const packageJson = require('./package.json');

const [major, minor, patch] = packageJson.version.split('.').map(Number);
packageJson.version = `${major}.${minor}.${patch + 1}`;

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
console.log(`New version: ${packageJson.version}`);
