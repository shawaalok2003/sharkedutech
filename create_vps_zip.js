const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const zipPath = path.join(rootDir, 'vps_deploy.zip');

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log('Creating lightweight vps_deploy.zip archive...');
try {
  const cmd = `tar -czf vps_deploy.zip --exclude="node_modules" --exclude=".next" --exclude=".git" --exclude="*.zip" --exclude="*.tar.gz" --exclude="cpanel_deploy*" .`;
  execSync(cmd, { cwd: rootDir, stdio: 'inherit' });
  console.log('Archive vps_deploy.zip created successfully!');
} catch (e) {
  console.error('Failed to create tar archive:', e);
  process.exit(1);
}
