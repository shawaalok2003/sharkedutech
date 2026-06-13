// setup.js - Run this via cPanel Node.js > "Run JS Script" button
// This installs dependencies without triggering problematic install scripts
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const appDir = __dirname;

console.log('=== SETUP SCRIPT START ===');
console.log('App directory:', appDir);
console.log('Node version:', process.version);

try {
  console.log('\n--- Running npm install --ignore-scripts ---');
  const result = spawnSync('npm', ['install', '--ignore-scripts'], {
    cwd: appDir,
    env: { ...process.env, HOME: '/home/sheduk', PATH: process.env.PATH },
    stdio: 'pipe',
    encoding: 'utf8'
  });
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.log('STDERR:', result.stderr);
  console.log('Exit code:', result.status);
} catch (e) {
  console.error('Error:', e.message);
}

console.log('=== SETUP SCRIPT DONE ===');
