/**
 * Express server for on-chain NFT minting
 * Handles Metaplex SDK operations
 */

const express = require('express');
const cors = require('cors');
const { mintOnChainNFT } = require('./mint-nft-onchain');
const { updateNFTMetadata } = require('./update-nft-metadata');
const { executeTAMATransfer } = require('./tama-transfer');
const { executeWithdrawal } = require('./tama-withdrawal');
const { handleGetNFTMetadata } = require('./get-nft-metadata');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configuration
app.use(cors({
    origin: [
        'https://solanatamagotchi.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Increase timeout for Arweave uploads (3 minutes)
app.use((req, res, next) => {
    req.setTimeout(180000); // 3 minutes
    res.setTimeout(180000); // 3 minutes
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NFT On-Chain Minting API',
        timestamp: new Date().toISOString()
    });
});

// Mint on-chain NFT endpoint
app.post('/api/mint-nft-onchain', mintOnChainNFT);

// Update NFT metadata endpoint
app.post('/api/update-nft-metadata', updateNFTMetadata);

// Get NFT metadata endpoint (for fetching images from blockchain)
app.get('/api/get-nft-metadata', handleGetNFTMetadata);

// TAMA token distribution endpoint
app.post('/api/tama-transfer', executeTAMATransfer);

// TAMA withdrawal endpoint
app.post('/api/tama-withdrawal', executeWithdrawal);

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 NFT On-Chain Minting API running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - Mint: http://localhost:${PORT}/api/mint-nft-onchain`);
    console.log(`   - Update Metadata: http://localhost:${PORT}/api/update-nft-metadata`);
    console.log(`   - Get Metadata: http://localhost:${PORT}/api/get-nft-metadata?mint=<mint_address>`);
});

