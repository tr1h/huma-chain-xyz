// ============================================
// TAMA WITHDRAWAL UI
// Interface for withdrawing TAMA to blockchain
// ============================================

const TAMAWithdrawUI = {
    // Create withdrawal modal
    createWithdrawModal() {
        const modal = document.createElement('div');
        modal.id = 'tama-withdraw-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>💎 Withdraw TAMA to Blockchain</h2>
                    <button class="close-btn" onclick="TAMAWithdrawUI.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="balance-info">
                        <p><strong>Database Balance:</strong> <span id="db-balance">Loading...</span> TAMA</p>
                        <p><strong>Blockchain Balance:</strong> <span id="blockchain-balance">Loading...</span> TAMA</p>
                    </div>
                    
                    <div class="withdraw-form">
                        <label for="recipient-address">Recipient Wallet Address:</label>
                        <input type="text" id="recipient-address" placeholder="Enter Solana wallet address">
                        
                        <label for="withdraw-amount">Amount to Withdraw:</label>
                        <input type="number" id="withdraw-amount" placeholder="Enter amount" min="1">
                        
                        <div class="withdraw-actions">
                            <button id="sync-balance-btn" class="btn btn-secondary">🔄 Sync Balance</button>
                            <button id="withdraw-btn" class="btn btn-primary">💎 Withdraw TAMA</button>
                        </div>
                    </div>
                    
                    <div id="withdraw-status" class="status-message"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.attachEventListeners();
        this.loadBalances();
    },

    // Attach event listeners
    attachEventListeners() {
        document.getElementById('sync-balance-btn').addEventListener('click', () => {
            this.syncBalance();
        });

        document.getElementById('withdraw-btn').addEventListener('click', () => {
            this.withdrawTAMA();
        });
    },

    // Load current balances
    async loadBalances() {
        try {
            // Get database balance
            const walletAddress = window.walletAddress;
            if (!walletAddress) {
                this.showStatus('❌ Wallet not connected', 'error');
                return;
            }

            const dbResponse = await fetch(`http://localhost:8002/api/tama/balance?user_id=${walletAddress}&user_type=wallet`);
            const dbResult = await dbResponse.json();
            
            document.getElementById('db-balance').textContent = dbResult.total_tama || 0;

            // Get blockchain balance
            if (window.TAMABlockchain) {
                const blockchainBalance = await window.TAMABlockchain.getBalance();
                document.getElementById('blockchain-balance').textContent = blockchainBalance;
            } else {
                document.getElementById('blockchain-balance').textContent = 'Not connected';
            }
        } catch (error) {
            console.error('❌ Failed to load balances:', error);
            this.showStatus('❌ Failed to load balances', 'error');
        }
    },

    // Sync balance between database and blockchain
    async syncBalance() {
        try {
            this.showStatus('🔄 Syncing balance...', 'info');
            
            if (!window.TAMABlockchain) {
                const connected = await window.TAMABlockchain.init();
                if (!connected) {
                    this.showStatus('❌ Failed to connect to blockchain', 'error');
                    return;
                }
            }

            const walletAddress = window.walletAddress;
            const blockchainBalance = await window.TAMABlockchain.getBalance();
            
            const response = await fetch('http://localhost:8002/api/tama/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    blockchain_balance: blockchainBalance
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showStatus('✅ Balance synced successfully!', 'success');
                this.loadBalances(); // Refresh balances
            } else {
                this.showStatus('❌ Sync failed: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('❌ Sync failed:', error);
            this.showStatus('❌ Sync failed: ' + error.message, 'error');
        }
    },

    // Withdraw TAMA to blockchain
    async withdrawTAMA() {
        try {
            const recipientAddress = document.getElementById('recipient-address').value.trim();
            const amount = parseFloat(document.getElementById('withdraw-amount').value);

            if (!recipientAddress) {
                this.showStatus('❌ Please enter recipient address', 'error');
                return;
            }

            if (!amount || amount <= 0) {
                this.showStatus('❌ Please enter valid amount', 'error');
                return;
            }

            this.showStatus('💎 Processing withdrawal...', 'info');

            // Initialize blockchain if needed
            if (!window.TAMABlockchain) {
                const connected = await window.TAMABlockchain.init();
                if (!connected) {
                    this.showStatus('❌ Failed to connect to blockchain', 'error');
                    return;
                }
            }

            // Perform withdrawal
            const result = await window.TAMABlockchain.withdraw(recipientAddress, amount);
            
            if (result.success) {
                this.showStatus(`✅ Withdrawal successful! Transaction: ${result.signature}`, 'success');
                this.loadBalances(); // Refresh balances
            } else {
                this.showStatus('❌ Withdrawal failed: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('❌ Withdrawal failed:', error);
            this.showStatus('❌ Withdrawal failed: ' + error.message, 'error');
        }
    },

    // Show status message
    showStatus(message, type) {
        const statusEl = document.getElementById('withdraw-status');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('tama-withdraw-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Make available globally
window.TAMAWithdrawUI = TAMAWithdrawUI;

