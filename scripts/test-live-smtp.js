async function test() {
    console.log('Testing Send OTP to real email...');
    try {
        const sendRes = await fetch('http://localhost:3000/api/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'aalokshaw2003@gmail.com' }),
        });
        const sendData = await sendRes.json();
        console.log('Send Response:', sendData);

        if (sendRes.ok) {
            console.log('✅ Real Email Send Request successful. Check your inbox!');
        } else {
            console.log('❌ Real Email Send Request failed:', sendData.error);
        }
    } catch (err) {
        console.error('Error during test:', err);
    }
}

test();
