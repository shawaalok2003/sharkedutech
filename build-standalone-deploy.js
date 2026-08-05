const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, '.next', 'standalone');
const STATIC_SRC = path.join(ROOT, '.next', 'static');
const STATIC_DST = path.join(STANDALONE, '.next', 'static');
const PUBLIC_SRC = path.join(ROOT, 'public');
const PUBLIC_DST = path.join(STANDALONE, 'public');
const ZIP_OUT = path.join(ROOT, 'deploy_standalone.zip');

console.log('=== Building Standalone Deployment ===');

// 1. Check standalone build exists
if (!fs.existsSync(path.join(STANDALONE, 'server.js'))) {
  console.error('ERROR: Standalone server not found. Run npm run build first.');
  process.exit(1);
}
console.log('✓ Standalone server found');

// 2. Copy .next/static → standalone/.next/static
console.log('Copying .next/static to standalone...');
fs.mkdirSync(path.join(STANDALONE, '.next'), { recursive: true });
if (fs.existsSync(STATIC_SRC)) {
  execSync(`xcopy "${STATIC_SRC}" "${STATIC_DST}" /E /I /Y /Q`, { stdio: 'inherit', shell: 'cmd' });
  console.log('✓ Static files copied');
} else {
  console.log('⚠ No .next/static found');
}

// 3. Copy public → standalone/public
console.log('Copying public/ to standalone...');
if (fs.existsSync(PUBLIC_SRC)) {
  execSync(`xcopy "${PUBLIC_SRC}" "${PUBLIC_DST}" /E /I /Y /Q`, { stdio: 'inherit', shell: 'cmd' });
  console.log('✓ Public files copied');
} else {
  console.log('⚠ No public/ found');
}

// 4. Copy updated startup.js and package.json into standalone root
const filesToCopy = ['startup.js', 'package.json'];
for (const f of filesToCopy) {
  const src = path.join(ROOT, f);
  const dst = path.join(STANDALONE, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✓ Copied ${f}`);
  }
}

// 5. Create the zip from the standalone directory
console.log('\nCreating deployment zip...');
if (fs.existsSync(ZIP_OUT)) {
  fs.unlinkSync(ZIP_OUT);
  console.log('Removed old zip');
}

execSync(
  `tar -czf "${ZIP_OUT}" -C "${STANDALONE}" .`,
  { stdio: 'inherit', cwd: ROOT }
);

const stats = fs.statSync(ZIP_OUT);
const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Done! deploy_standalone.zip = ${sizeMB} MB`);
console.log('\nTo deploy:');
console.log('1. Upload deploy_standalone.zip to cPanel /home/sheduk/shark');
console.log('2. Extract it there');
console.log('3. Restart the Node.js app (NO npm install needed!)');
