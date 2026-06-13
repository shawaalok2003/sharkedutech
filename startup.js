const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

console.log('startup.js: Starting...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('__dirname:', __dirname);

const nextDir = path.join(__dirname, '.next');
const buildIdFile = path.join(nextDir, 'BUILD_ID');

// Auto-build if .next folder doesn't exist or is incomplete
if (!fs.existsSync(buildIdFile)) {
  console.log('.next build not found - building Next.js app...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('Build completed!');
  } catch (err) {
    console.error('Build failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('.next BUILD_ID found:', fs.readFileSync(buildIdFile, 'utf8').trim(), '- skipping build.');
}

// Start the Next.js server
console.log('Starting Next.js server...');
require('./server.js');

