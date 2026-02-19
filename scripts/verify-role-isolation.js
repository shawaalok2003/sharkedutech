const http = require('http');

async function testRoleIsolation() {
    const email = 'aalokshaw2003@gmail.com'; // Existing CANDIDATE
    const PORT = 3000;

    console.log('--- Testing Role Isolation (Port 3000) ---');
    console.log(`Checking email: ${email} (should be CANDIDATE)`);

    async function makeRequest(path, body) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(body);
            const options = {
                hostname: 'localhost',
                port: PORT,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, body: JSON.parse(body) });
                    } catch (e) {
                        resolve({ status: res.statusCode, body: body });
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(data);
            req.end();
        });
    }

    try {
        // Try to login as EMPLOYER with CANDIDATE email
        console.log('\n1. Attempting to send OTP as EMPLOYER...');
        const res1 = await makeRequest('/api/auth/otp/send', { email, role: 'EMPLOYER' });
        console.log('Status:', res1.status);
        console.log('Response:', res1.body);

        // Try to login as CANDIDATE with CANDIDATE email
        console.log('\n2. Attempting to send OTP as CANDIDATE...');
        const res2 = await makeRequest('/api/auth/otp/send', { email, role: 'CANDIDATE' });
        console.log('Status:', res2.status);
        console.log('Response:', res2.body);

    } catch (err) {
        console.error('Request failed:', err.message);
    }

    process.exit(0);
}

testRoleIsolation().catch(err => {
    console.error(err);
    process.exit(1);
});
