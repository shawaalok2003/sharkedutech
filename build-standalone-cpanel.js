const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DEPLOY_DIR = path.join(ROOT, 'cpanel_deploy_standalone');
const STANDALONE_DST = path.join(DEPLOY_DIR, 'standalone');
const ZIP_OUT = path.join(ROOT, 'deploy_standalone.zip');

console.log('=== Packaging Standalone Subdirectory Build for cPanel ===\n');

// 1. Run local Next.js build
console.log('Step 1: Running next build...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT });
  console.log('✅ Build succeeded.\n');
} catch (e) {
  console.error('❌ Build failed. Aborting.');
  process.exit(1);
}

const STANDALONE_SRC = path.join(ROOT, '.next', 'standalone');
if (!fs.existsSync(path.join(STANDALONE_SRC, 'server.js'))) {
  console.error('❌ Standalone server.js not found. Verify output:"standalone" is set in next.config.ts');
  process.exit(1);
}

// 2. Prepare directories
console.log('Step 2: Preparing clean deployment directories...');
if (fs.existsSync(DEPLOY_DIR)) {
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STANDALONE_DST, { recursive: true });

// 3. Copy standalone build contents -> cpanel_deploy_standalone/standalone/
console.log('Step 3: Copying standalone files...');
fs.cpSync(STANDALONE_SRC, STANDALONE_DST, { recursive: true });
console.log('✅ Standalone files copied.');

// 4. Copy static assets & public folder into standalone subdirectory
console.log('Step 4: Copying assets into standalone subdirectory...');
const staticSrc = path.join(ROOT, '.next', 'static');
const staticDst = path.join(STANDALONE_DST, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDst), { recursive: true });
  fs.cpSync(staticSrc, staticDst, { recursive: true });
  console.log('  ✅ .next/static copied.');
}

const publicSrc = path.join(ROOT, 'public');
const publicDst = path.join(STANDALONE_DST, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDst, { recursive: true });
  console.log('  ✅ public/ folder copied.');
}

// 5. Setup environment variables in standalone subdirectory
console.log('Step 5: Setting up environment variables...');
const envProd = path.join(ROOT, '.env.production');
const envStd  = path.join(ROOT, '.env');
const envDst  = path.join(STANDALONE_DST, '.env');
if (fs.existsSync(envProd)) {
  fs.copyFileSync(envProd, envDst);
  console.log('  ✅ Copied .env.production -> standalone/.env');
} else if (fs.existsSync(envStd)) {
  fs.copyFileSync(envStd, envDst);
  console.log('  ⚠️ Copied .env -> standalone/.env');
} else {
  console.log('  ⚠️ No .env file found.');
}

// 6. Write cPanel root bootstrapper app.js
console.log('Step 6: Writing root bootstrapper app.js...');
const appJsContent = `// app.js - cPanel Startup file
'use strict';
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'startup-error.log');
function log(msg, err) {
  const line = '[' + new Date().toISOString() + '] ' + msg +
    (err ? '\\n' + (err.stack || err.message || String(err)) : '') + '\\n';
  try { fs.appendFileSync(logPath, line); } catch(_) {}
  console.log(msg, err || '');
}

fs.writeFileSync(logPath, '=== STARTUP AT ' + new Date().toISOString() + ' ===\\n');
log('Node: ' + process.version + ' | PORT: ' + process.env.PORT + ' | ENV: ' + process.env.NODE_ENV);
log('CWD: ' + process.cwd());

try {
  log('Changing directory to standalone subdirectory...');
  process.chdir(path.join(__dirname, 'standalone'));
  log('New CWD: ' + process.cwd());

  log('Starting Next.js standalone server...');
  require('./server.js');
} catch(err) {
  log('FATAL: Failed to start standalone server', err);
  process.exit(1);
}
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'app.js'), appJsContent, 'utf-8');
console.log('  ✅ app.js written.');

// 7. Write cPanel dummy package.json
console.log('Step 7: Writing dummy package.json...');
const dummyPackage = {
  name: "sharkedutech",
  version: "1.0.0",
  private: true,
  scripts: {
    start: "node app.js"
  }
};
fs.writeFileSync(path.join(DEPLOY_DIR, 'package.json'), JSON.stringify(dummyPackage, null, 2), 'utf-8');
console.log('  ✅ package.json written.');

// 8. Compress the output to deploy_standalone.zip
console.log('Step 8: Creating zip archive...');
if (fs.existsSync(ZIP_OUT)) {
  fs.unlinkSync(ZIP_OUT);
}

try {
  console.log('  Trying tar to compress (better for long paths)...');
  execSync(`tar -a -c -f "${ZIP_OUT}" -C "${DEPLOY_DIR}" .`, { stdio: 'inherit' });
  console.log('  ✅ Zip created via tar.');
} catch (e) {
  console.log('  ⚠️ Tar failed, trying PowerShell...');
  try {
    const ps = `$ErrorActionPreference = 'Stop'; $src='${DEPLOY_DIR.replace(/'/g,"''")}'; $dst='${ZIP_OUT.replace(/'/g,"''")}'; Compress-Archive -Path "$src\\*" -DestinationPath $dst -Force`;
    execSync(`powershell -Command "${ps}"`, { stdio: 'inherit' });
    console.log('  ✅ Zip created via PowerShell.');
  } catch (tarErr) {
    console.error('  ❌ All zipping methods failed.');
    process.exit(1);
  }
}

const stats = fs.statSync(ZIP_OUT);
const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
console.log(`\n🎉 Success! Created: deploy_standalone.zip (${sizeMB} MB)`);
