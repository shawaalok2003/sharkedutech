const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'startup-error.log');
function log(msg, err) {
  const time = new Date().toISOString();
  let content = `[${time}] ${msg}\n`;
  if (err) content += `${err.stack || err.message || err}\n`;
  fs.appendFileSync(logFile, content);
  console.log(msg, err || '');
}

fs.writeFileSync(logFile, `=== STARTUP AT ${new Date().toISOString()} ===\n`);
log(`Node: ${process.version} | PORT: ${process.env.PORT} | NODE_ENV: ${process.env.NODE_ENV}`);
log(`Dir: ${__dirname}`);

// --- Standalone Mode (output: 'standalone') ---
const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
if (fs.existsSync(standaloneServer)) {
  log('Found standalone server — starting...');

  // Ensure static assets are accessible from standalone directory
  const staticSrc = path.join(__dirname, '.next', 'static');
  const staticDst = path.join(__dirname, '.next', 'standalone', '.next', 'static');
  const publicSrc = path.join(__dirname, 'public');
  const publicDst = path.join(__dirname, '.next', 'standalone', 'public');

  // The standalone server.js uses its own __dirname to find static files
  // Set working directory context for the standalone server
  process.chdir(path.join(__dirname, '.next', 'standalone'));
  log(`Changed cwd to: ${process.cwd()}`);

  require(standaloneServer);
  return;
}

// --- Fallback: legacy next start (requires node_modules) ---
log('Standalone server not found — trying next start...');
const { execSync } = require('child_process');
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
if (!fs.existsSync(nextBin)) {
  log('ERROR: node_modules not installed and no standalone server found!');
  log('Please run: npm install');
  process.exit(1);
}
try {
  execSync(`${nextBin} start -p ${process.env.PORT || 3000}`, {
    stdio: 'inherit',
    cwd: __dirname,
    env: process.env,
  });
} catch (err) {
  log('next start failed:', err);
  process.exit(1);
}
