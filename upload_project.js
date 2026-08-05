const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const conn = new Client();

const config = {
  host: '129.121.116.252',
  port: 22,
  username: 'root',
  password: 'Gims@@2026'
};

const localZipPath = path.join(__dirname, 'vps_deploy.zip');
const remoteZipPath = '/var/www/project.zip';

// Read production .env content from file
const envFileToRead = fs.existsSync(path.join(__dirname, '.env.production')) 
  ? path.join(__dirname, '.env.production') 
  : path.join(__dirname, '.env');
const envContent = fs.readFileSync(envFileToRead, 'utf8');


const escapeShell = (str) => {
  return str.replace(/'/g, "'\\''");
};

conn.on('ready', () => {
  console.log('SSH Connection Established for File Upload & Deployment.');

  // Step 1: Install unzip on the remote server and prepare directory
  const prepCmd = 'mkdir -p /var/www && apt-get install unzip -y';
  console.log(`Executing preparation: ${prepCmd}`);
  
  conn.exec(prepCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log(`Preparation finished with code ${code}`);
      if (code !== 0) {
        console.error('Failed to prepare VPS. Aborting.');
        conn.end();
        return;
      }
      
      console.log('Preparation complete. Uploading fresh project archive to VPS...');
      uploadArchive();
    }).on('data', (data) => process.stdout.write(data.toString()));
  });
});

function uploadArchive() {
  console.log('\n--- UPLOADING PROJECT ARCHIVE (270MB) ---');
  console.log('This may take 1-2 minutes depending on your internet upload speed...');
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP connection failed:', err);
      conn.end();
      return;
    }
    
    const stats = fs.statSync(localZipPath);
    const fileSize = stats.size;
    let uploadedBytes = 0;
    
    const readStream = fs.createReadStream(localZipPath);
    const writeStream = sftp.createWriteStream(remoteZipPath);
    
    readStream.on('data', (chunk) => {
      uploadedBytes += chunk.length;
      const pct = ((uploadedBytes / fileSize) * 100).toFixed(1);
      process.stdout.write(`\rProgress: ${pct}% (${(uploadedBytes / 1024 / 1024).toFixed(1)} MB / ${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
    });
    
    writeStream.on('close', () => {
      console.log('\nUpload completed successfully.');
      extractAndBuild();
    });
    
    writeStream.on('error', (err) => {
      console.error('\nSFTP upload error:', err);
      conn.end();
    });
    
    readStream.pipe(writeStream);
  });
}

function extractAndBuild() {
  console.log('\n--- EXTRACTING AND BUILDING ON VPS ---');
  
  const deployCmds = [
    // Extract archive
    `rm -rf /var/www/sharkedutech && mkdir -p /var/www/sharkedutech`,
    `unzip -o /var/www/project.zip -d /var/www/sharkedutech || [ $? -eq 1 ]`,
    `rm -f /var/www/project.zip`,
    
    // Write env file
    `echo '${escapeShell(envContent)}' > /var/www/sharkedutech/.env`,
    
    // Install, Generate Prisma client and build
    `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && cd /var/www/sharkedutech && npm install && npx prisma generate && npm run build`,
    
    // Setup PM2 process
    `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && cd /var/www/sharkedutech && pm2 delete shark-edu-tech || true && pm2 start npm --name "shark-edu-tech" -- start -- -p 3000 && pm2 save`
  ];

  let idx = 0;
  function runDeployCmd() {
    if (idx >= deployCmds.length) {
      console.log('\n=== DEPLOYMENT SUCCESSFULLY COMPLETED ===');
      console.log('Your website is now running locally on port 3000.');
      console.log('You can visit http://129.121.116.252:3000 to verify.');
      conn.end();
      return;
    }
    
    const cmd = deployCmds[idx];
    console.log(`\nExecuting: [${idx + 1}/${deployCmds.length}]`);
    if (idx === 3) {
      console.log('[Writing .env config...]');
    } else if (idx === 1) {
      console.log('[Extracting files...]');
    } else {
      console.log(cmd);
    }
    
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error('Command execution failed:', err);
        conn.end();
        return;
      }
      stream.on('close', (code) => {
        console.log(`Exit code: ${code}`);
        if (code !== 0) {
          console.error('Deployment failed during command execution.');
          conn.end();
          return;
        }
        idx++;
        runDeployCmd();
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  }

  runDeployCmd();
}

conn.connect(config);
