/**
 * NFT Marketplace Integration
 * Поддержка продажи NFT на Magic Eden, Tensor, etc.
 */

// Marketplace URLs
const MARKETPLACES = {
    magicEden: (mintAddress) => `https://magiceden.io/item-details/${mintAddress}`,
    tensor: (mintAddress) => `https://www.tensor.trade/item/${mintAddress}`,
    solanart: (mintAddress) => `https://solanart.io/search/?token=${mintAddress}`,
    solscan: (mintAddress) => `https://solscan.io/token/${mintAddress}?cluster=devnet`
};

/**
 * Open marketplace for NFT
 */
function openMarketplace(mintAddress, marketplace = 'magicEden') {
    if (!mintAddress) {
        alert('❌ NFT mint address not found!');
        return;
    }
    
    const url = MARKETPLACES[marketplace]?.(mintAddress);
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('❌ Unknown marketplace!');
    }
}

/**
 * Show marketplace selection modal
 */
function showMarketplaceModal(mintAddress) {
    const modal = document.createElement('div');
    modal.className = 'marketplace-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>💰 Sell NFT on Marketplace</h2>
            <p>Choose marketplace to list your NFT:</p>
            <div class="marketplace-buttons">
                <button onclick="openMarketplace('${mintAddress}', 'magicEden'); closeModal();" class="marketplace-btn magic-eden">
                    🎴 Magic Eden
                </button>
                <button onclick="openMarketplace('${mintAddress}', 'tensor'); closeModal();" class="marketplace-btn tensor">
                    📊 Tensor
                </button>
                <button onclick="openMarketplace('${mintAddress}', 'solanart'); closeModal();" class="marketplace-btn solanart">
                    🎨 Solanart
                </button>
                <button onclick="openMarketplace('${mintAddress}', 'solscan'); closeModal();" class="marketplace-btn solscan">
                    🔍 View on Solscan
                </button>
            </div>
            <button onclick="closeModal()" class="close-btn">❌ Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    const modal = document.querySelector('.marketplace-modal');
    if (modal) modal.remove();
}

/**
 * Add marketplace button to NFT card
 */
function addMarketplaceButton(nftCard, mintAddress) {
    if (!mintAddress || mintAddress.startsWith('NFT_')) {
        // Off-chain NFT (placeholder) - не показываем кнопку
        return;
    }
    
    const sellBtn = document.createElement('button');
    sellBtn.className = 'sell-marketplace-btn';
    sellBtn.innerHTML = '💰 Sell on Marketplace';
    sellBtn.onclick = () => showMarketplaceModal(mintAddress);
    
    nftCard.appendChild(sellBtn);
}

// CSS для модального окна
const marketplaceStyles = `
    <style>
        .marketplace-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        
        .marketplace-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .marketplace-btn {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .marketplace-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .magic-eden { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; }
        .tensor { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; }
        .solanart { background: linear-gradient(135deg, #10B981, #059669); color: white; }
        .solscan { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; }
        
        .close-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }
        
        .sell-marketplace-btn {
            width: 100%;
            padding: 12px;
            margin-top: 10px;
            background: linear-gradient(135deg, #8AC926, #1D3557);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .sell-marketplace-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(138, 201, 38, 0.5);
        }
    </style>
`;

// Добавить стили в head
if (!document.querySelector('#marketplace-styles')) {
    const styleEl = document.createElement('div');
    styleEl.id = 'marketplace-styles';
    styleEl.innerHTML = marketplaceStyles;
    document.head.appendChild(styleEl);
}

// Export для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { openMarketplace, showMarketplaceModal, addMarketplaceButton };
}

