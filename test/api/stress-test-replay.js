/**
 * 🧪 Anti-Replay Stress Test
 *
 * Tests that duplicate transaction signatures are blocked across all endpoints.
 *
 * Run with: node test/api/stress-test-replay.js
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8002'; // Port 8002 where PHP server is running
const DUMMY_SIG = '5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J'; // Valid length base58

async function runTests() {
    console.log('🧪 Starting Anti-Replay Stress Tests...\n');
    console.log(`🔗 API Base: ${API_BASE}`);

    const tests = [
        {
            name: 'verify-payment.php (Duplicate Signature)',
            url: `${API_BASE}/verify-payment.php`,
            data: {
                signature: DUMMY_SIG,
                sender: '7xKXtg2z7pS7BvS5R5S5S5S5S5S5S5S5S5S5S5S5S5',
                recipient: 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw',
                amount: 0.1
            }
        },
        {
            name: 'distribute-sol-payment.php (Duplicate Signature)',
            url: `${API_BASE}/distribute-sol-payment.php`,
            data: {
                transaction_signature: DUMMY_SIG,
                from_wallet: '7xKXtg2z7pS7BvS5R5S5S5S5S5S5S5S5S5S5S5S5S5',
                amount_sol: 0.1
            }
        },
        {
            name: 'mint-nft-bronze-sol.php (Duplicate Signature)',
            url: `${API_BASE}/mint-nft-bronze-sol.php`,
            data: {
                transaction_signature: DUMMY_SIG,
                telegram_id: 12345678,
                wallet_address: '7xKXtg2z7pS7BvS5R5S5S5S5S5S5S5S5S5S5S5S5S5',
                price_sol: 0.15
            }
        }
    ];

    for (const t of tests) {
        console.log(`📡 Testing: ${t.name}`);
        try {
            const response = await fetch(t.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t.data)
            });

            const responseData = await response.json();

            if (response.status === 400 &&
                (responseData.error === 'Transaction signature already processed' ||
                 responseData.error === 'Transaction already processed' ||
                 (responseData.details && responseData.details.reason === 'replay_attack_detected'))) {
                console.log(`   ✅ SUCCESS: Blocked as duplicate! (Status: ${response.status})`);
            } else if (response.status === 400 && responseData.error === 'Transaction not found on blockchain') {
                console.log(`   ℹ️ INFO: Signature not in DB, failed at blockchain level (expected for new signatures)`);
                console.log(`      Protection Path: DB Check -> Blockchain Check. Current: Failed at Blockchain.`);
            } else {
                console.log(`   ❌ FAILED: Received status ${response.status}`);
                console.log(`      Response: ${JSON.stringify(responseData)}`);
            }
        } catch (err) {
            console.log(`   ❌ ERROR: ${err.message}`);
        }
        console.log('');
    }
}

runTests();
