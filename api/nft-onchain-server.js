/**
 * Express server for on-chain NFT minting
 * Can be run standalone or integrated with existing API
 */

const express = require('express');
const cors = require('cors');
const { mintOnChainNFT, healthCheck } = require('./mint-nft-onchain');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/mint-nft-onchain', mintOnChainNFT);
app.get('/api/mint-nft-onchain/health', healthCheck);

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 On-chain NFT minting API running on port ${PORT}`);
        console.log(`📡 POST /api/mint-nft-onchain`);
        console.log(`❤️  GET /api/mint-nft-onchain/health`);
    });
}

module.exports = app;

