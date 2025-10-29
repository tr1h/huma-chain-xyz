/**
 * TAMA Token API - Supabase API Version (Node.js)
 * Использует Supabase API вместо прямого подключения к PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Настройки Supabase API
const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'; // Замени на свой anon key

// Константы TAMA токена
const TAMA_MINT_ADDRESS = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';

// NFT константы
const NFT_COSTS = {
    common: { tama: 1000, sol: 0.01 },
    rare: { tama: 5000, sol: 0.05 },
    epic: { tama: 10000, sol: 0.1 },
    legendary: { tama: 50000, sol: 0.5 }
};

/**
 * Выполнить запрос к Supabase API
 */
async function makeSupabaseRequest(endpoint, method = 'GET', data = null) {
    try {
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        };

        const options = {
            method,
            headers
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
        
        // Проверяем, есть ли контент для парсинга
        const contentType = response.headers.get('content-type');
        let responseData = null;
        
        if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            if (text.trim()) {
                try {
                    responseData = JSON.parse(text);
                } catch (e) {
                    console.log('⚠️ JSON parse error:', e.message, 'Text:', text);
                    responseData = { error: 'Invalid JSON response', raw: text };
                }
            }
        }

        return {
            data: responseData,
            status: response.status
        };
    } catch (error) {
        return {
            data: { error: error.message },
            status: 500
        };
    }
}

/**
 * Генерировать NFT данные
 */
function generateNFTData(customName = '', rarity = 'common') {
    const petTypes = [
        { name: 'cat', emoji: '🐱', weight: 30 },
        { name: 'dog', emoji: '🐶', weight: 25 },
        { name: 'rabbit', emoji: '🐰', weight: 20 },
        { name: 'hamster', emoji: '🐹', weight: 15 },
        { name: 'bird', emoji: '🐦', weight: 10 }
    ];
    
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const selectedRarity = rarities.includes(rarity) ? rarity : 'common';
    
    // Выбираем тип питомца на основе веса
    let random = Math.random() * 100;
    let selectedType = petTypes[0];
    
    for (const type of petTypes) {
        random -= type.weight;
        if (random <= 0) {
            selectedType = type;
            break;
        }
    }
    
    const petName = customName || `${selectedType.name.charAt(0).toUpperCase() + selectedType.name.slice(1)} #${Math.floor(Math.random() * 10000)}`;
    
    return {
        name: petName,
        symbol: 'TAMA',
        description: `A ${selectedRarity} ${selectedType.name} Tamagotchi NFT. Feed, play, and care for your virtual pet!`,
        image: `https://arweave.net/demo-${selectedType.name}-${selectedRarity}`,
        attributes: [
            { trait_type: 'Type', value: selectedType.name },
            { trait_type: 'Rarity', value: selectedRarity },
            { trait_type: 'Emoji', value: selectedType.emoji },
            { trait_type: 'Generation', value: '1' }
        ],
        rarity: selectedRarity,
        pet_type: selectedType.name,
        cost: NFT_COSTS[selectedRarity]
    };
}

/**
 * Создать NFT запись в базе данных
 */
async function createNFTRecord(userId, userType, nftData, mintAddress, transactionHash) {
    try {
        const whereField = userType === 'telegram' ? 'telegram_id' : 'wallet_address';
        const nftRecord = {
            [whereField]: userId,
            mint_address: mintAddress,
            pet_type: nftData.pet_type,
            rarity: nftData.rarity,
            cost_tama: nftData.cost.tama,
            cost_sol: nftData.cost.sol,
            transaction_hash: transactionHash,
            created_at: new Date().toISOString()
        };
        
        const result = await makeSupabaseRequest('user_nfts', 'POST', nftRecord);
        return result.status === 201;
    } catch (error) {
        console.error('Error creating NFT record:', error);
        return false;
    }
}

// Маршруты
app.get('/api/tama/test', async (req, res) => {
    try {
        const result = await makeSupabaseRequest('leaderboard?select=count');
        
        if (result.status === 200) {
            res.json({
                success: true,
                message: 'Supabase API connection successful',
                status: result.status
            });
        } else {
            res.json({
                success: false,
                error: 'Supabase API connection failed',
                status: result.status
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/tama/balance', async (req, res) => {
    try {
        const { user_id, user_type = 'wallet' } = req.query;
        
        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const where_field = user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
        const endpoint = `leaderboard?${where_field}=eq.${user_id}&select=tama,pet_name,pet_type,level,xp`;
        
        const result = await makeSupabaseRequest(endpoint);
        
        if (result.status === 200 && result.data && result.data.length > 0) {
            const balance = result.data[0];
            res.json({
                success: true,
                user_id,
                user_type,
                database_tama: parseInt(balance.tama || 0),
                total_tama: parseInt(balance.tama || 0),
                pet_name: balance.pet_name,
                pet_type: balance.pet_type,
                level: parseInt(balance.level || 1),
                xp: parseInt(balance.xp || 0)
            });
        } else {
            // Пользователь не найден, возвращаем нули
            res.json({
                success: true,
                user_id,
                user_type,
                database_tama: 0,
                total_tama: 0,
                pet_name: null,
                pet_type: null,
                level: 1,
                xp: 0
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tama/add', async (req, res) => {
    try {
        console.log('📥 Add TAMA request:', req.body);
        const { user_id, user_type = 'wallet', amount, source = 'game' } = req.body;
        
        if (!user_id || !amount) {
            console.log('❌ Missing user_id or amount');
            return res.status(400).json({ error: 'user_id and amount are required' });
        }
        
        if (amount <= 0) {
            console.log('❌ Invalid amount:', amount);
            return res.status(400).json({ error: 'amount must be positive' });
        }

        const where_field = user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
        console.log('🔍 Checking user with field:', where_field, 'value:', user_id);
        
        // Проверить существование пользователя
        const check_endpoint = `leaderboard?${where_field}=eq.${user_id}&select=id,tama`;
        console.log('🔗 Check endpoint:', check_endpoint);
        const check_result = await makeSupabaseRequest(check_endpoint);
        console.log('📊 Check result:', check_result);
        
        if (check_result.status === 200 && check_result.data && check_result.data.length > 0) {
            // Пользователь существует, обновить баланс
            const user = check_result.data[0];
            const new_balance = (user.tama || 0) + amount;
            console.log('👤 User exists, updating balance from', user.tama, 'to', new_balance);
            
            const update_data = {
                tama: new_balance,
                updated_at: new Date().toISOString()
            };
            
            const update_endpoint = `leaderboard?id=eq.${user.id}`;
            console.log('🔄 Update endpoint:', update_endpoint, 'data:', update_data);
            const update_result = await makeSupabaseRequest(update_endpoint, 'PATCH', update_data);
            console.log('📊 Update result:', update_result);
            
            if (update_result.status === 200 || update_result.status === 204) {
                console.log('✅ Balance updated successfully');
                res.json({
                    success: true,
                    message: 'TAMA added successfully',
                    new_balance
                });
            } else if (update_result.data && update_result.data.error) {
                console.log('❌ Supabase error:', update_result.data.error);
                res.status(500).json({ error: 'Supabase error: ' + update_result.data.error });
            } else {
                console.log('❌ Failed to update balance:', update_result);
                res.status(500).json({ error: 'Failed to update balance', details: update_result });
            }
        } else {
            // Пользователь не существует, создать нового
            console.log('👤 User not found, creating new user');
            const new_user_data = {
                [where_field]: user_id,
                tama: amount,
                level: 1,
                xp: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            console.log('🆕 New user data:', new_user_data);
            
            const create_result = await makeSupabaseRequest('leaderboard', 'POST', new_user_data);
            console.log('📊 Create result:', create_result);
            
            if (create_result.status === 201) {
                console.log('✅ User created successfully');
                res.json({
                    success: true,
                    message: 'TAMA added successfully',
                    new_balance: amount
                });
            } else {
                console.log('❌ Failed to create user:', create_result);
                res.status(500).json({ error: 'Failed to create user', details: create_result });
            }
        }
    } catch (error) {
        console.log('💥 Add TAMA error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.post('/api/tama/spend', async (req, res) => {
    try {
        console.log('💸 Spend TAMA request:', req.body);
        const { user_id, user_type = 'wallet', amount, purpose = 'spend' } = req.body;
        
        if (!user_id || !amount) {
            console.log('❌ Missing user_id or amount');
            return res.status(400).json({ error: 'user_id and amount are required' });
        }
        
        if (amount <= 0) {
            console.log('❌ Invalid amount:', amount);
            return res.status(400).json({ error: 'amount must be positive' });
        }

        const where_field = user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
        console.log('🔍 Checking user with field:', where_field, 'value:', user_id);
        
        // Получить текущий баланс
        const check_endpoint = `leaderboard?${where_field}=eq.${user_id}&select=id,tama`;
        console.log('🔗 Check endpoint:', check_endpoint);
        const check_result = await makeSupabaseRequest(check_endpoint);
        console.log('📊 Check result:', check_result);
        
        if (check_result.status === 200 && check_result.data && check_result.data.length > 0) {
            const user = check_result.data[0];
            const current_balance = user.tama || 0;
            console.log('👤 User found, current balance:', current_balance);
            
            if (current_balance < amount) {
                console.log('❌ Insufficient balance:', current_balance, '<', amount);
                return res.status(400).json({ error: 'Insufficient TAMA balance' });
            }
            
            const new_balance = current_balance - amount;
            console.log('💸 Spending', amount, 'TAMA, new balance:', new_balance);
            const update_data = {
                tama: new_balance,
                updated_at: new Date().toISOString()
            };
            
            const update_endpoint = `leaderboard?id=eq.${user.id}`;
            console.log('🔄 Update endpoint:', update_endpoint, 'data:', update_data);
            const update_result = await makeSupabaseRequest(update_endpoint, 'PATCH', update_data);
            console.log('📊 Update result:', update_result);
            
            if (update_result.status === 200 || update_result.status === 204) {
                console.log('✅ Balance updated successfully');
                res.json({
                    success: true,
                    message: 'TAMA spent successfully',
                    new_balance
                });
            } else if (update_result.data && update_result.data.error) {
                console.log('❌ Supabase error:', update_result.data.error);
                res.status(500).json({ error: 'Supabase error: ' + update_result.data.error });
            } else {
                console.log('❌ Failed to update balance:', update_result);
                res.status(500).json({ error: 'Failed to update balance', details: update_result });
            }
        } else {
            console.log('❌ User not found');
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('💥 Spend TAMA error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// NFT маршруты
app.post('/api/tama/mint-nft', async (req, res) => {
    try {
        console.log('🎨 Mint NFT request:', req.body);
        const { user_id, user_type = 'wallet', pet_name = '', rarity = 'common' } = req.body;

        if (!user_id) {
            console.log('❌ Missing user_id');
            return res.status(400).json({ error: 'user_id is required' });
        }

        // Генерируем NFT данные
        const nftData = generateNFTData(pet_name, rarity);
        console.log('🎨 Generated NFT data:', nftData);

        const whereField = user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
        console.log('🔍 Checking user with field:', whereField, 'value:', user_id);

        // Проверяем баланс пользователя
        const checkEndpoint = `leaderboard?${whereField}=eq.${user_id}&select=id,tama`;
        console.log('🔗 Check endpoint:', checkEndpoint);
        const checkResult = await makeSupabaseRequest(checkEndpoint);
        console.log('📊 Check result:', checkResult);

        if (checkResult.status === 200 && checkResult.data && checkResult.data.length > 0) {
            const user = checkResult.data[0];
            const currentBalance = user.tama || 0;
            const requiredTama = nftData.cost.tama;
            
            console.log('👤 User found, current balance:', currentBalance, 'required:', requiredTama);

            if (currentBalance < requiredTama) {
                console.log('❌ Insufficient TAMA balance:', currentBalance, '<', requiredTama);
                return res.status(400).json({ 
                    error: 'Insufficient TAMA balance',
                    current_balance: currentBalance,
                    required: requiredTama,
                    shortage: requiredTama - currentBalance
                });
            }

            // Списываем TAMA
            const newBalance = currentBalance - requiredTama;
            console.log('💸 Spending', requiredTama, 'TAMA, new balance:', newBalance);
            
            const updateData = {
                tama: newBalance,
                updated_at: new Date().toISOString()
            };

            const updateEndpoint = `leaderboard?id=eq.${user.id}`;
            console.log('🔄 Update endpoint:', updateEndpoint, 'data:', updateData);
            const updateResult = await makeSupabaseRequest(updateEndpoint, 'PATCH', updateData);
            console.log('📊 Update result:', updateResult);

            if (updateResult.status === 200 || updateResult.status === 204) {
                console.log('✅ TAMA spent successfully');
                
                // Генерируем mint address (в реальности это будет от Solana)
                const mintAddress = `TAMA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Создаем запись NFT в базе данных
                const nftRecordCreated = await createNFTRecord(user_id, user_type, nftData, mintAddress, transactionHash);
                
                if (nftRecordCreated) {
                    console.log('✅ NFT record created successfully');
                    res.json({
                        success: true,
                        message: 'NFT minted successfully',
                        nft: {
                            mint_address: mintAddress,
                            transaction_hash: transactionHash,
                            name: nftData.name,
                            rarity: nftData.rarity,
                            pet_type: nftData.pet_type,
                            cost_tama: nftData.cost.tama,
                            cost_sol: nftData.cost.sol,
                            metadata: {
                                name: nftData.name,
                                symbol: nftData.symbol,
                                description: nftData.description,
                                image: nftData.image,
                                attributes: nftData.attributes
                            }
                        },
                        new_balance: newBalance
                    });
                } else {
                    console.log('❌ Failed to create NFT record');
                    res.status(500).json({ error: 'Failed to create NFT record' });
                }
            } else if (updateResult.data && updateResult.data.error) {
                console.log('❌ Supabase error:', updateResult.data.error);
                res.status(500).json({ error: 'Supabase error: ' + updateResult.data.error });
            } else {
                console.log('❌ Failed to spend TAMA:', updateResult);
                res.status(500).json({ error: 'Failed to spend TAMA', details: updateResult });
            }
        } else {
            console.log('❌ User not found');
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('💥 Mint NFT error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.get('/api/tama/nfts', async (req, res) => {
    try {
        console.log('📋 Get NFTs request:', req.query);
        const { user_id, user_type = 'wallet' } = req.query;

        if (!user_id) {
            console.log('❌ Missing user_id');
            return res.status(400).json({ error: 'user_id is required' });
        }

        const whereField = user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
        const endpoint = `user_nfts?${whereField}=eq.${user_id}&select=*&order=created_at.desc`;
        
        console.log('🔗 NFTs endpoint:', endpoint);
        const result = await makeSupabaseRequest(endpoint);
        console.log('📊 NFTs result:', result);

        if (result.status === 200) {
            const nfts = result.data || [];
            console.log('✅ Found', nfts.length, 'NFTs');
            
            res.json({
                success: true,
                user_id,
                user_type,
                nfts: nfts.map(nft => ({
                    mint_address: nft.mint_address,
                    pet_type: nft.pet_type,
                    rarity: nft.rarity,
                    cost_tama: nft.cost_tama,
                    cost_sol: nft.cost_sol,
                    transaction_hash: nft.transaction_hash,
                    created_at: nft.created_at
                })),
                total: nfts.length
            });
        } else {
            console.log('❌ Failed to get NFTs:', result);
            res.status(500).json({ error: 'Failed to get NFTs', details: result });
        }
    } catch (error) {
        console.log('💥 Get NFTs error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.get('/api/tama/nft-costs', async (req, res) => {
    try {
        console.log('💰 Get NFT costs request');
        
        res.json({
            success: true,
            costs: NFT_COSTS,
            description: 'NFT minting costs in TAMA tokens and SOL'
        });
    } catch (error) {
        console.log('💥 Get NFT costs error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sync blockchain balance with database
app.post('/api/tama/sync', async (req, res) => {
    try {
        console.log('🔄 Sync balance request:', req.body);
        const { wallet_address, blockchain_balance } = req.body;

        if (!wallet_address || blockchain_balance === undefined) {
            return res.status(400).json({ error: 'wallet_address and blockchain_balance are required' });
        }

        // Get current database balance
        const checkEndpoint = `leaderboard?wallet_address=eq.${wallet_address}&select=id,tama`;
        const checkResult = await makeSupabaseRequest(checkEndpoint);

        if (checkResult.status === 200 && checkResult.data && checkResult.data.length > 0) {
            const user = checkResult.data[0];
            const dbBalance = user.tama || 0;
            const difference = blockchain_balance - dbBalance;

            if (Math.abs(difference) > 0.01) { // Only sync if difference is significant
                const newBalance = blockchain_balance;
                const updateData = {
                    tama: newBalance,
                    updated_at: new Date().toISOString()
                };

                const updateEndpoint = `leaderboard?id=eq.${user.id}`;
                const updateResult = await makeSupabaseRequest(updateEndpoint, 'PATCH', updateData);

                if (updateResult.status === 200 || updateResult.status === 204) {
                    console.log('✅ Balance synced:', { dbBalance, blockchain_balance, difference });
                    res.json({
                        success: true,
                        message: 'Balance synced successfully',
                        old_balance: dbBalance,
                        new_balance: blockchain_balance,
                        difference: difference
                    });
                } else {
                    res.status(500).json({ error: 'Failed to sync balance' });
                }
            } else {
                console.log('✅ Balance already in sync');
                res.json({
                    success: true,
                    message: 'Balance already in sync',
                    balance: dbBalance
                });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('💥 Sync error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 TAMA API Server running on http://localhost:${PORT}`);
    console.log(`📊 Supabase URL: ${SUPABASE_URL}`);
    console.log(`🔑 Supabase Key: ${SUPABASE_KEY.substring(0, 20)}...`);
    console.log(`💰 TAMA Mint: ${TAMA_MINT_ADDRESS}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log(`  GET  http://localhost:${PORT}/api/tama/test`);
    console.log(`  GET  http://localhost:${PORT}/api/tama/balance?user_id=test&user_type=wallet`);
    console.log(`  POST http://localhost:${PORT}/api/tama/add`);
    console.log(`  POST http://localhost:${PORT}/api/tama/spend`);
    console.log(`  POST http://localhost:${PORT}/api/tama/mint-nft`);
    console.log(`  GET  http://localhost:${PORT}/api/tama/nfts?user_id=test&user_type=wallet`);
    console.log(`  GET  http://localhost:${PORT}/api/tama/nft-costs`);
    console.log('');
    console.log('⚠️  Don\'t forget to replace YOUR_SUPABASE_ANON_KEY_HERE with your actual anon key!');
});
