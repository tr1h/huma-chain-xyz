// Transaction Logger for Tamagotchi Game
// Logs all TAMA transactions to Supabase

const TransactionLogger = {
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',

    // Generic log function
    async log(userId, username, type, amount, balanceBefore, balanceAfter, metadata = {}) {
        try {
            const response = await fetch(`${this.SUPABASE_URL}/rest/v1/transactions`, {
                method: 'POST',
                headers: {
                    'apikey': this.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    user_id: userId.toString(),
                    username: username,
                    type: type,
                    amount: Math.round(amount * 100) / 100, // Round to 2 decimals
                    balance_before: Math.round(balanceBefore * 100) / 100,
                    balance_after: Math.round(balanceAfter * 100) / 100,
                    metadata: metadata,
                    created_at: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log(`✅ Transaction logged: ${type} | ${amount} TAMA | User: ${userId}`);
                return true;
            } else {
                const errorText = await response.text();
                console.warn(`⚠️ Transaction log failed (${response.status}):`, errorText);
                return false;
            }
        } catch (error) {
            console.warn('⚠️ Transaction log error:', error.message);
            return false;
        }
    },

    // Earning transactions
    logEarn(userId, username, type, amount, balanceBefore, balanceAfter, metadata = {}) {
        return this.log(userId, username, `earn_${type}`, amount, balanceBefore, balanceAfter, metadata);
    },

    // Spending transactions
    logSpend(userId, username, type, amount, balanceBefore, balanceAfter, metadata = {}) {
        return this.log(userId, username, `spend_${type}`, amount, balanceBefore, balanceAfter, metadata);
    },

    // Level up bonus
    logLevelUp(userId, username, level, bonus, balanceBefore, balanceAfter) {
        return this.log(userId, username, 'level_up', bonus, balanceBefore, balanceAfter, { level });
    },

    // Quest completion
    logQuest(userId, username, questName, reward, balanceBefore, balanceAfter) {
        return this.log(userId, username, 'quest_complete', reward, balanceBefore, balanceAfter, { quest: questName });
    },

    // Referral bonus
    logReferral(userId, username, amount, balanceBefore, balanceAfter, referrerId) {
        return this.log(userId, username, 'referral_bonus', amount, balanceBefore, balanceAfter, { referrer_id: referrerId });
    }
};

// Export for use in game
window.TransactionLogger = TransactionLogger;
console.log('✅ Transaction Logger initialized');
