// ============================================
// TAMA BLOCKCHAIN INTEGRATION
// Real SPL Token operations on Devnet
// ============================================

const TAMABlockchain = {
    // Configuration
    CONFIG: {
        TOKEN_MINT: 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY',
        DECIMALS: 9,
        NETWORK: 'devnet',
        RPC_URL: 'https://api.devnet.solana.com'
    },

    // Initialize connection
    async init() {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                throw new Error('Phantom wallet not found');
            }

            // Connect to Phantom
            const response = await window.solana.connect();
            this.wallet = response.publicKey;
            
            // Initialize Solana connection
            this.connection = new solanaWeb3.Connection(this.CONFIG.RPC_URL);
            
            console.log('🔗 Connected to Devnet:', this.wallet.toString());
            return true;
        } catch (error) {
            console.error('❌ Blockchain init failed:', error);
            return false;
        }
    },

    // Get TAMA balance from blockchain
    async getBalance() {
        try {
            if (!this.wallet || !this.connection) {
                throw new Error('Wallet not connected');
            }

            // Get token accounts
            const tokenAccounts = await this.connection.getTokenAccountsByOwner(
                this.wallet,
                { mint: new solanaWeb3.PublicKey(this.CONFIG.TOKEN_MINT) }
            );

            if (tokenAccounts.value.length === 0) {
                return 0; // No token account
            }

            // Get account info
            const accountInfo = await this.connection.getTokenAccountBalance(
                tokenAccounts.value[0].pubkey
            );

            return accountInfo.value.uiAmount || 0;
        } catch (error) {
            console.error('❌ Failed to get balance:', error);
            return 0;
        }
    },

    // Transfer TAMA tokens
    async transfer(recipientAddress, amount) {
        try {
            if (!this.wallet || !this.connection) {
                throw new Error('Wallet not connected');
            }

            const recipient = new solanaWeb3.PublicKey(recipientAddress);
            const mint = new solanaWeb3.PublicKey(this.CONFIG.TOKEN_MINT);

            // Get or create token accounts
            const senderTokenAccount = await this.getOrCreateTokenAccount(this.wallet, mint);
            const recipientTokenAccount = await this.getOrCreateTokenAccount(recipient, mint);

            // Create transfer instruction
            const transferInstruction = solanaWeb3.Token.createTransferInstruction(
                solanaWeb3.TOKEN_PROGRAM_ID,
                senderTokenAccount,
                recipientTokenAccount,
                this.wallet,
                [],
                amount * Math.pow(10, this.CONFIG.DECIMALS)
            );

            // Create transaction
            const transaction = new solanaWeb3.Transaction().add(transferInstruction);

            // Send transaction
            const signature = await window.solana.sendAndConfirmTransaction(transaction);
            
            console.log('✅ Transfer successful:', signature);
            return { success: true, signature };
        } catch (error) {
            console.error('❌ Transfer failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Get or create token account
    async getOrCreateTokenAccount(owner, mint) {
        try {
            // Try to find existing account
            const tokenAccounts = await this.connection.getTokenAccountsByOwner(owner, { mint });
            
            if (tokenAccounts.value.length > 0) {
                return tokenAccounts.value[0].pubkey;
            }

            // Create new account
            const tokenAccount = solanaWeb3.Keypair.generate();
            const createAccountInstruction = solanaWeb3.SystemProgram.createAccount({
                fromPubkey: owner,
                newAccountPubkey: tokenAccount.publicKey,
                space: 165,
                lamports: await this.connection.getMinimumBalanceForRentExemption(165),
                programId: solanaWeb3.TOKEN_PROGRAM_ID
            });

            const initializeAccountInstruction = solanaWeb3.Token.createInitializeAccountInstruction(
                tokenAccount.publicKey,
                mint,
                owner
            );

            const transaction = new solanaWeb3.Transaction()
                .add(createAccountInstruction)
                .add(initializeAccountInstruction);

            await window.solana.sendAndConfirmTransaction(transaction, [tokenAccount]);
            
            return tokenAccount.publicKey;
        } catch (error) {
            console.error('❌ Failed to create token account:', error);
            throw error;
        }
    },

    // Sync database balance with blockchain
    async syncBalance() {
        try {
            const blockchainBalance = await this.getBalance();
            const walletAddress = this.wallet.toString();

            // Update database via API
            const response = await fetch('http://localhost:8002/api/tama/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    blockchain_balance: blockchainBalance
                })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Sync failed:', error);
            return false;
        }
    },

    // Withdraw TAMA to external wallet
    async withdraw(recipientAddress, amount) {
        try {
            // Check database balance first
            const walletAddress = this.wallet.toString();
            const dbBalance = await this.getDatabaseBalance(walletAddress);

            if (dbBalance < amount) {
                throw new Error('Insufficient TAMA balance');
            }

            // Transfer from blockchain
            const transferResult = await this.transfer(recipientAddress, amount);
            
            if (transferResult.success) {
                // Update database
                await this.updateDatabaseBalance(walletAddress, -amount, 'withdrawal');
                return { success: true, signature: transferResult.signature };
            } else {
                throw new Error(transferResult.error);
            }
        } catch (error) {
            console.error('❌ Withdrawal failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Get database balance
    async getDatabaseBalance(walletAddress) {
        try {
            const response = await fetch(`http://localhost:8002/api/tama/balance?user_id=${walletAddress}&user_type=wallet`);
            const result = await response.json();
            return result.total_tama || 0;
        } catch (error) {
            console.error('❌ Failed to get database balance:', error);
            return 0;
        }
    },

    // Update database balance
    async updateDatabaseBalance(walletAddress, amount, reason) {
        try {
            const response = await fetch('http://localhost:8002/api/tama/spend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: walletAddress,
                    user_type: 'wallet',
                    amount: Math.abs(amount),
                    purpose: reason
                })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('❌ Failed to update database:', error);
            return false;
        }
    }
};

// Make available globally
window.TAMABlockchain = TAMABlockchain;

