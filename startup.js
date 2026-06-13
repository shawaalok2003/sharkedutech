const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');
const buildIdFile = path.join(nextDir, 'BUILD_ID');

// Auto-build if .next folder doesn't exist or is incomplete
if (!fs.existsSync(buildIdFile)) {
  console.log('🔨 .next build not found — building Next.js app...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Build completed!');
  } catch (err) {
    console.error('❌ Build failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('✅ .next build found — skipping build step.');
}

// Start the Next.js server
console.log('🚀 Starting Next.js server...');
require('./server.js');
