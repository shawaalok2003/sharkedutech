// build-cpanel.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const deployDir = path.join(rootDir, 'cpanel_deploy');
const zipFile = path.join(rootDir, 'deploy_cpanel.zip');

console.log('=== Starting cPanel Build & Package Process ===');

// Step 1: Run Next.js Build
console.log('\nStep 1: Running next build...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Next.js build completed successfully.');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Step 2: Prepare cpanel_deploy directory
console.log('\nStep 2: Preparing clean cpanel_deploy folder...');
if (fs.existsSync(deployDir)) {
  console.log('Removing old cpanel_deploy directory...');
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Step 3: Copy necessary files and folders
console.log('\nStep 3: Copying files to deployment directory...');
const pathsToCopy = [
  '.next',
  'public',
  'node_modules',
  'prisma',
  'package.json',
  'server.js',
  'setup.js',
  'startup.js',
  'next.config.js',
  '.npmrc'
];

pathsToCopy.forEach((item) => {
  const src = path.join(rootDir, item);
  const dest = path.join(deployDir, item);

  if (fs.existsSync(src)) {
    console.log(`Copying ${item}...`);
    fs.cpSync(src, dest, { recursive: true });
  } else {
    console.log(`⚠️ Optional/missing item skipped: ${item}`);
  }
});

// Step 4: Handle environment variables (.env.production -> .env)
console.log('\nStep 4: Setting up environment variables...');
const envProdPath = path.join(rootDir, '.env.production');
const envDestPath = path.join(deployDir, '.env');

if (fs.existsSync(envProdPath)) {
  console.log('Copying .env.production to deploy/.env...');
  fs.copyFileSync(envProdPath, envDestPath);
} else {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    console.log('⚠️ .env.production not found, copying standard .env to deploy/.env...');
    fs.copyFileSync(envPath, envDestPath);
  } else {
    console.log('❌ Error: No .env or .env.production file found in the project root!');
    process.exit(1);
  }
}

// Step 4.5: Clean up build cache folders to save space
console.log('\nStep 4.5: Cleaning up build cache folders...');
const pathsToClean = [
  path.join(deployDir, '.next', 'cache'),
  path.join(deployDir, '.next', 'node_modules'),
  path.join(deployDir, '.next', 'dev'),
  path.join(deployDir, '.next', 'diagnostics'),
  path.join(deployDir, '.next', 'turbopack')
];

pathsToClean.forEach((p) => {
  if (fs.existsSync(p)) {
    console.log(`Cleaning up: ${path.relative(deployDir, p)}...`);
    fs.rmSync(p, { recursive: true, force: true });
  }
});

// Step 5: Compress into deploy_cpanel.zip
console.log('\nStep 5: Zipping deploy folder to deploy_cpanel.zip...');
if (fs.existsSync(zipFile)) {
  console.log('Removing old deploy_cpanel.zip...');
  fs.unlinkSync(zipFile);
}

try {
  console.log('Using tar to compress (much faster for node_modules)...');
  execSync(`tar -a -c -f "${zipFile}" -C "${deployDir}" .`, { stdio: 'inherit' });
  console.log(`\n🎉 Success! Created: ${zipFile}`);
} catch (error) {
  console.error('❌ Zipping failed with tar. Attempting PowerShell...', error);
  try {
    const psCommand = `Compress-Archive -Path "${deployDir}\\*" -DestinationPath "${zipFile}" -Force`;
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
    console.log(`\n🎉 Success! Created (using PowerShell): ${zipFile}`);
  } catch (psError) {
    console.error('❌ Fallback zipping also failed.', psError);
    process.exit(1);
  }
}

console.log('\n=== Process Finished Successfully ===');
