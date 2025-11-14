/**
 * Express server for on-chain NFT minting
 * Handles Metaplex SDK operations
 */

const express = require('express');
const cors = require('cors');
const { mintOnChainNFT } = require('./mint-nft-onchain');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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
    console.log(`📡 Endpoint: http://localhost:${PORT}/api/mint-nft-onchain`);
});

