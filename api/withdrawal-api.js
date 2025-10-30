/**
 * WITHDRAWAL API - Вывод TAMA из игры на реальный кошелёк
 * 
 * Endpoint: POST /api/tama/withdrawal/request
 * Body: { telegram_id, wallet_address, amount, pin }
 */

const express = require('express');
const fetch = require('node-fetch');
const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');

const router = express.Router();

// ==================== CONFIGURATION ====================

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const TAMA_MINT_ADDRESS = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';
const MIN_WITHDRAWAL = 1000; // Minimum 1,000 TAMA
const WITHDRAWAL_FEE = 0.05; // 5% fee
const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production

// Load P2E Pool keypair (источник TAMA для выплат)
let p2ePoolKeypair;
try {
    const keypairData = JSON.parse(fs.readFileSync('p2e-pool-keypair.json'));
    p2ePoolKeypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(keypairData));
    console.log('✅ P2E Pool loaded:', p2ePoolKeypair.publicKey.toString());
} catch (e) {
    console.error('❌ Failed to load P2E Pool keypair:', e.message);
}

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(NETWORK),
    'confirmed'
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Проверить баланс пользователя в игре
 */
async function getUserGameBalance(telegramId) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}&select=tama`,
        {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    const data = await response.json();
    if (data && data.length > 0) {
        return data[0].tama || 0;
    }
    return 0;
}

/**
 * Обновить баланс пользователя в игре
 */
async function updateUserGameBalance(telegramId, newBalance) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}`,
        {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ tama: newBalance })
        }
    );
    return response.ok;
}

/**
 * Сохранить запрос на вывод
 */
async function saveWithdrawalRequest(data) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/withdrawals`,
        {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

/**
 * Отправить TAMA на кошелёк пользователя
 */
async function sendTAMA(recipientAddress, amount) {
    try {
        const mintPublicKey = new solanaWeb3.PublicKey(TAMA_MINT_ADDRESS);
        const recipientPublicKey = new solanaWeb3.PublicKey(recipientAddress);

        // Получить или создать ATA для получателя
        const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            p2ePoolKeypair,
            mintPublicKey,
            recipientPublicKey
        );

        // Получить ATA отправителя (P2E Pool)
        const senderTokenAccount = await splToken.getAssociatedTokenAddress(
            mintPublicKey,
            p2ePoolKeypair.publicKey
        );

        // Отправить TAMA
        const signature = await splToken.transfer(
            connection,
            p2ePoolKeypair,
            senderTokenAccount,
            recipientTokenAccount.address,
            p2ePoolKeypair.publicKey,
            amount * Math.pow(10, 9) // Convert to lamports (9 decimals)
        );

        console.log('✅ TAMA sent! Signature:', signature);
        return signature;

    } catch (error) {
        console.error('❌ Error sending TAMA:', error);
        throw error;
    }
}

// ==================== API ENDPOINTS ====================

/**
 * POST /api/tama/withdrawal/request
 * Запрос на вывод TAMA
 */
router.post('/withdrawal/request', async (req, res) => {
    try {
        const { telegram_id, wallet_address, amount, pin } = req.body;

        console.log('💰 Withdrawal request:', { telegram_id, wallet_address, amount });

        // Validation
        if (!telegram_id || !wallet_address || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (amount < MIN_WITHDRAWAL) {
            return res.status(400).json({ 
                error: `Minimum withdrawal is ${MIN_WITHDRAWAL} TAMA` 
            });
        }

        // Проверить баланс пользователя
        const userBalance = await getUserGameBalance(telegram_id);
        if (userBalance < amount) {
            return res.status(400).json({ 
                error: 'Insufficient balance',
                current: userBalance,
                requested: amount
            });
        }

        // Рассчитать комиссию
        const fee = Math.floor(amount * WITHDRAWAL_FEE);
        const amountAfterFee = amount - fee;

        // Проверить валидность адреса кошелька
        try {
            new solanaWeb3.PublicKey(wallet_address);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid Solana wallet address' });
        }

        // Списать TAMA из игры
        const newBalance = userBalance - amount;
        const balanceUpdated = await updateUserGameBalance(telegram_id, newBalance);

        if (!balanceUpdated) {
            return res.status(500).json({ error: 'Failed to update game balance' });
        }

        // Отправить TAMA на кошелёк (если P2E Pool настроен)
        let txSignature = null;
        let status = 'pending';

        if (p2ePoolKeypair) {
            try {
                txSignature = await sendTAMA(wallet_address, amountAfterFee);
                status = 'completed';
            } catch (error) {
                console.error('❌ Failed to send TAMA:', error);
                status = 'failed';
                // Вернуть TAMA обратно в игру
                await updateUserGameBalance(telegram_id, userBalance);
                return res.status(500).json({ 
                    error: 'Failed to send TAMA',
                    details: error.message
                });
            }
        }

        // Сохранить в базу
        const withdrawalRecord = await saveWithdrawalRequest({
            telegram_id,
            wallet_address,
            amount_requested: amount,
            amount_sent: amountAfterFee,
            fee,
            status,
            transaction_signature: txSignature,
            created_at: new Date().toISOString()
        });

        // Логировать транзакцию
        await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                telegram_id,
                transaction_type: 'withdrawal',
                amount: -amount,
                balance_before: userBalance,
                balance_after: newBalance,
                details: `Withdrawal to ${wallet_address} (fee: ${fee} TAMA)`,
                created_at: new Date().toISOString()
            })
        });

        console.log('✅ Withdrawal completed:', { telegram_id, amount, fee, signature: txSignature });

        res.json({
            success: true,
            withdrawal: {
                amount_requested: amount,
                amount_sent: amountAfterFee,
                fee,
                new_balance: newBalance,
                transaction_signature: txSignature,
                explorer_url: txSignature 
                    ? `https://explorer.solana.com/tx/${txSignature}?cluster=${NETWORK}`
                    : null
            }
        });

    } catch (error) {
        console.error('❌ Withdrawal error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/tama/withdrawal/history
 * История выводов пользователя
 */
router.get('/withdrawal/history', async (req, res) => {
    try {
        const { telegram_id } = req.query;

        if (!telegram_id) {
            return res.status(400).json({ error: 'telegram_id required' });
        }

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/withdrawals?telegram_id=eq.${telegram_id}&order=created_at.desc&limit=50`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        const data = await response.json();
        res.json({ withdrawals: data });

    } catch (error) {
        console.error('❌ Error fetching withdrawal history:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/tama/withdrawal/limits
 * Получить лимиты и комиссии
 */
router.get('/withdrawal/limits', async (req, res) => {
    res.json({
        min_withdrawal: MIN_WITHDRAWAL,
        fee_percentage: WITHDRAWAL_FEE * 100,
        network: NETWORK,
        token: TAMA_MINT_ADDRESS
    });
});

module.exports = router;

