// build-cloudlinux-cpanel.js
// ==========================================================================
// FIX v3: PATCH server.js to use explicit _vendor paths
//
// The problem: CloudLinux's node_modules symlink contains a broken/incomplete
// "next" package. Node.js checks node_modules BEFORE NODE_PATH, so even
// setting NODE_PATH=_vendor doesn't work — Node finds the broken one first.
//
// The solution: We PATCH server.js to replace:
//   require('next')  →  require('./_vendor/next')
//   require('next/dist/...')  →  require('./_vendor/next/dist/...')
//
// This way, server.js ALWAYS uses the correct standalone-bundled modules.
// ==========================================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, '.next', 'standalone');
const DEPLOY_DIR = path.join(ROOT, 'cpanel_cloudlinux');
const ZIP_OUT = path.join(ROOT, 'deploy_cloudlinux.zip');

console.log('=== CloudLinux cPanel Deployment Packager (v3 — patched server.js) ===\n');

// ── Step 1: Build ──────────────────────────────────────────────────────────
console.log('Step 1: Running Next.js production build...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT });
  console.log('✅ Build succeeded.\n');
} catch (e) {
  console.error('❌ Build failed. Aborting.'); process.exit(1);
}

// ── Step 2: Verify standalone output ──────────────────────────────────────
if (!fs.existsSync(path.join(STANDALONE, 'server.js'))) {
  console.error('❌ Standalone server.js not found. Make sure next.config has output:"standalone"');
  process.exit(1);
}
console.log('✅ Standalone build found.\n');

// ── Step 3: Clean and recreate deploy dir ─────────────────────────────────
console.log('Step 3: Preparing clean deploy directory...');
if (fs.existsSync(DEPLOY_DIR)) fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// ── Step 4: Copy standalone files, node_modules → _vendor ─────────────────
console.log('Step 4: Copying standalone files...');
const standaloneItems = fs.readdirSync(STANDALONE);
for (const item of standaloneItems) {
  const src = path.join(STANDALONE, item);
  if (item === 'node_modules') {
    const dst = path.join(DEPLOY_DIR, '_vendor');
    console.log('  📦 Copying node_modules → _vendor...');
    fs.cpSync(src, dst, { recursive: true });
    console.log('  ✅ _vendor created.');
  } else {
    const dst = path.join(DEPLOY_DIR, item);
    fs.cpSync(src, dst, { recursive: true });
    console.log(`  ✅ Copied: ${item}`);
  }
}

// ── Step 5: Patching is no longer done via string replacements (it breaks destructuring) ──
console.log('\nStep 5: Skipping server.js patch. Interception is handled in app.js.');

// ── Step 6: Copy .next/static ────────────────────────────────────────────
console.log('\nStep 6: Copying .next/static assets...');
const staticSrc = path.join(ROOT, '.next', 'static');
const staticDst = path.join(DEPLOY_DIR, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDst, { recursive: true });
  console.log('  ✅ Static assets copied.');
}

// ── Step 7: Copy public folder ────────────────────────────────────────────
console.log('\nStep 7: Copying public/ folder...');
const publicSrc = path.join(ROOT, 'public');
const publicDst = path.join(DEPLOY_DIR, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDst, { recursive: true });
  console.log('  ✅ Public folder copied.');
}

// ── Step 8: Copy prisma folder ───────────────────────────────────────────
console.log('\nStep 8: Copying prisma folder...');
const prismaSrc = path.join(ROOT, 'prisma');
const prismaDst = path.join(DEPLOY_DIR, 'prisma');
if (fs.existsSync(prismaSrc)) {
  fs.cpSync(prismaSrc, prismaDst, { recursive: true });
  console.log('  ✅ Prisma folder copied.');
}

// ── Step 9: Write .env ───────────────────────────────────────────────────
console.log('\nStep 9: Setting up .env...');
const envProd = path.join(ROOT, '.env.production');
const envStd  = path.join(ROOT, '.env');
const envDst  = path.join(DEPLOY_DIR, '.env');
if (fs.existsSync(envProd)) {
  fs.copyFileSync(envProd, envDst);
  console.log('  ✅ Copied .env.production → .env');
} else if (fs.existsSync(envStd)) {
  fs.copyFileSync(envStd, envDst);
  console.log('  ⚠️  Copied .env (no .env.production found)');
} else {
  console.error('  ❌ No .env file found!'); process.exit(1);
}

// ── Step 10: Write minimal package.json ───────────────────────────────────
console.log('\nStep 10: Writing minimal package.json...');
const prodPackageJson = {
  "name": "sharkedutech",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=18.0.0" },
  "scripts": { "start": "node app.js" },
  "dependencies": {}
};
fs.writeFileSync(
  path.join(DEPLOY_DIR, 'package.json'),
  JSON.stringify(prodPackageJson, null, 2),
  'utf-8'
);
console.log('  ✅ package.json written (NO dependencies).');

// ── Step 11: Write app.js & startup.js ────────────────────────────────────
console.log('\nStep 11: Writing app.js and startup.js...');
const appJsContent = `// app.js — CloudLinux cPanel startup file (v3)
// server.js has been patched to use ./_vendor/next instead of bare 'next'
// so it no longer depends on CloudLinux's broken node_modules/next

'use strict';
const fs = require('fs');
const path = require('path');

// ── Logging ───────────────────────────────────────────────────────────────
const logPath = path.join(__dirname, 'startup-error.log');
function log(msg, err) {
  const line = '[' + new Date().toISOString() + '] ' + msg +
    (err ? '\\n' + (err.stack || err.message || String(err)) : '') + '\\n';
  try { fs.appendFileSync(logPath, line); } catch(_) {}
  console.log(msg, err || '');
}
fs.writeFileSync(logPath, '=== STARTUP v3 AT ' + new Date().toISOString() + ' ===\\n');
log('Node: ' + process.version + ' | PORT: ' + process.env.PORT + ' | ENV: ' + process.env.NODE_ENV);
log('Dir: ' + __dirname);

// ── Set NODE_PATH to _vendor (backup for any other requires) ──────────────
const vendorPath = path.join(__dirname, '_vendor');
process.env.NODE_PATH = vendorPath;
require('module').Module._initPaths();
log('NODE_PATH set to: ' + vendorPath);

// ── Intercept module resolution (Redirect next imports to _vendor/next) ───
const Module = require('module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain) {
  if (request === 'next') {
    return path.join(vendorPath, 'next', 'dist', 'server', 'next.js');
  }
  if (request.startsWith('next/')) {
    return path.join(vendorPath, 'next', request.substring(5));
  }
  return originalResolve.apply(this, arguments);
};
log('Module resolution hook installed for "next" redirection.');

// ── Restore File Permissions (Avoid EACCES on extracted zip) ─────────────
try {
  const { execSync } = require('child_process');
  execSync('chmod -R 755 ' + vendorPath);
  log('Restored file permissions recursively to 755 for _vendor');
} catch (chmodErr) {
  log('Warning: chmod failed', chmodErr);
}

// ── Check _vendor exists ──────────────────────────────────────────────────
if (!fs.existsSync(vendorPath)) {
  log('FATAL: _vendor directory not found at ' + vendorPath);
  process.exit(1);
}
const vendorNext = path.join(vendorPath, 'next');
if (!fs.existsSync(vendorNext)) {
  log('FATAL: _vendor/next not found at ' + vendorNext);
  process.exit(1);
}
log('_vendor/next exists: OK');

// ── Set NODE_ENV ──────────────────────────────────────────────────────────
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// ── Load .env ─────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath) && !process.env.DATABASE_URL) {
  fs.readFileSync(envPath, 'utf-8').split('\\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.substring(0, eqIndex).trim();
    const val = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) {
      process.env[key] = val;
    }
  });
  log('Loaded .env file');
}

// ── Start server.js (patched to use _vendor) ──────────────────────────────
log('Starting server.js (patched with _vendor paths)...');
try {
  require('./server.js');
} catch(err) {
  log('FATAL: Failed to start server.js', err);
  process.exit(1);
}
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'app.js'), appJsContent, 'utf-8');
fs.writeFileSync(path.join(DEPLOY_DIR, 'startup.js'), appJsContent, 'utf-8');
console.log('  ✅ app.js and startup.js written.');

// ── Step 12: Zip ─────────────────────────────────────────────────────────
console.log('\nStep 12: Creating deploy_cloudlinux.zip...');
try {
  if (fs.existsSync(ZIP_OUT)) { fs.unlinkSync(ZIP_OUT); console.log('  Removed old zip.'); }
} catch (e) {
  console.log('  ⚠️ Failed to remove old zip (busy/locked). Will overwrite.');
}

try {
  const ps = `$src='${DEPLOY_DIR.replace(/'/g,"''")}'; $dst='${ZIP_OUT.replace(/'/g,"''")}'; Compress-Archive -Path "$src\\*" -DestinationPath $dst -Force`;
  execSync(`powershell -Command "${ps}"`, { stdio: 'inherit' });
  console.log('  ✅ Zip created via PowerShell.');
} catch (psErr) {
  console.log('  ⚠️  PowerShell failed, trying tar...');
  try {
    execSync(`tar -a -c -f "${ZIP_OUT}" -C "${DEPLOY_DIR}" .`, { stdio: 'inherit' });
    console.log('  ✅ Zip created via tar.');
  } catch (tarErr) {
    console.error('  ❌ All zipping methods failed.'); process.exit(1);
  }
}

const sizeMB = (fs.statSync(ZIP_OUT).size / 1024 / 1024).toFixed(1);
console.log(`\n🎉 Success! deploy_cloudlinux.zip = ${sizeMB} MB`);
console.log('\n══════════════════════════════════════════════════════════════');
console.log('DEPLOYMENT STEPS FOR CLOUDLINUX CPANEL:');
console.log('══════════════════════════════════════════════════════════════');
console.log('1. In cPanel → File Manager → /home/sheduk/shark:');
console.log('   • DELETE everything EXCEPT node_modules');
console.log('   • Upload deploy_cloudlinux.zip');
console.log('   • Extract it');
console.log('   • Delete deploy_cloudlinux.zip after extraction');
console.log('');
console.log('2. In cPanel → Setup Node.js App:');
console.log('   • Startup file: app.js');
console.log('   • Click "Restart"');
console.log('');
console.log('   NOTE: Do NOT click "Run NPM Install" — not needed!');
console.log('   Just click Restart directly.');
console.log('');
console.log('3. Visit https://sharkedutech.com — site should load!');
console.log('══════════════════════════════════════════════════════════════');
