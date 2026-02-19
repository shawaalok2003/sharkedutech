async function testSignup() {
    console.log('--- Testing Integrated Signup Flow ---');
    const testEmail = 'aalokshaw2003@gmail.com';
    const testPassword = 'Password123!';
    const testName = 'New User ' + Date.now();

    try {
        // 1. Send OTP
        console.log('1. Sending OTP to:', testEmail);
        const sendRes = await fetch('http://localhost:3000/api/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail }),
        });
        const sendData = await sendRes.json();
        console.log('Send Response:', sendData);

        if (!sendRes.ok) throw new Error('Send OTP failed');

        // 2. In this test, we need to know the OTP. Since we can't easily read logs here, 
        // and we know it's logged to console, we'll assume the test is manually verified 
        // or we use a "trick" if available. 
        // Actually, let's just test if the signup API handles the case where user doesn't exist yet but OTP is verified.

        console.log('Note: To finish this test, the OTP must be retrieved from logs.');
        console.log('Skipping verification/creation for now, will do it via sequential commands.');

    } catch (err) {
        console.error('Error during test:', err);
    }
}

testSignup();
