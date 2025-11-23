# 🔄 Синхронизация кабинетов и минтинг NFT за SOL в игре

## 📊 Текущая ситуация:

### ✅ Что уже работает:
1. **В игре:**
   - Подключение Phantom Wallet (`connectPhantomWallet`)
   - Автоматическое связывание кошелька с Telegram аккаунтом (`linkWalletToTelegramAccount`)
   - Сохранение `wallet_address` в таблицу `leaderboard`
   - Кнопка "Mint NFT" → перенаправляет на `mint.html`

2. **На сайте:**
   - Полный функционал минтинга NFT за SOL (`mint.html`)
   - Просмотр NFT по Telegram ID или Wallet Address (`my-nfts.html`)
   - Автоматическое связывание кошелька с Telegram аккаунтом

### ❌ Что не работает:
1. **Минтинг NFT за SOL в игре** - нет, только перенаправление на сайт
2. **Полная синхронизация данных** - частичная, нужно улучшить

---

## 🎯 Решение:

### 1. Добавить минтинг NFT за SOL в игру

**Где:** `tamagotchi-game.html` → NFT Modal

**Что добавить:**
- Кнопка "Mint with SOL" в NFT модалке
- Функция `mintNFTWithSOL(tier)` - аналогично `mint.html`
- Использовать те же API endpoints что и на сайте

**API endpoints:**
- Bronze: `/api/mint-nft-bronze-sol-rest.php`
- Silver/Gold/Platinum/Diamond: `/api/mint-nft-sol-rest.php`
- On-chain mint: `/api/mint-nft-onchain-wrapper.php`

### 2. Улучшить синхронизацию кабинетов

**Проблема:** Данные могут рассинхронизироваться между игрой и сайтом

**Решение:**
1. **При подключении кошелька в игре:**
   - Сохранить `wallet_address` в `leaderboard`
   - Найти все NFT с этим `wallet_address` но без `telegram_id`
   - Обновить их `telegram_id` (merge orphaned NFTs)

2. **При подключении кошелька на сайте:**
   - То же самое - найти и связать NFT

3. **При минтинге NFT:**
   - Если есть `telegram_id` - использовать его
   - Если нет - сохранить `wallet_address` и позже связать

---

## 🔧 План реализации:

### Шаг 1: Добавить минтинг NFT за SOL в игру

```javascript
// В tamagotchi-game.html, в NFT modal
async function mintNFTWithSOL(tier) {
    // 1. Проверить подключение кошелька
    if (!walletConnected || !walletAddress) {
        showMessage('❌ Please connect wallet first!', 'error');
        await connectPhantomWallet();
        return;
    }
    
    // 2. Получить цену NFT
    const price = await getNFTPrice(tier);
    
    // 3. Создать транзакцию (как в mint.html)
    const signature = await createAndSendDistributionTransaction(price);
    
    // 4. Вызвать API для минтинга
    const response = await fetch('https://api.solanatamagotchi.com/api/mint-nft-sol-rest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            telegram_id: window.TELEGRAM_USER_ID,
            wallet_address: walletAddress,
            tier_name: tier,
            price_sol: price,
            transaction_signature: signature
        })
    });
    
    // 5. Обработать результат
    const result = await response.json();
    if (result.success) {
        showMessage(`✅ ${tier} NFT minted!`, 'success');
        await loadNFTCollection(); // Обновить коллекцию
    }
}
```

### Шаг 2: Улучшить синхронизацию

```javascript
// В tamagotchi-game.html
async function syncAccountData() {
    const telegramId = window.TELEGRAM_USER_ID;
    const wallet = walletAddress;
    
    if (!telegramId || !wallet) return;
    
    // 1. Обновить wallet_address в leaderboard
    await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wallet_address: wallet })
    });
    
    // 2. Найти orphaned NFTs (с wallet_address но без telegram_id)
    const { data: orphanedNFTs } = await supabase
        .from('user_nfts')
        .select('*')
        .eq('wallet_address', wallet)
        .is('telegram_id', null);
    
    // 3. Обновить их telegram_id
    if (orphanedNFTs && orphanedNFTs.length > 0) {
        for (const nft of orphanedNFTs) {
            await supabase
                .from('user_nfts')
                .update({ telegram_id: telegramId })
                .eq('id', nft.id)
                .execute();
        }
        console.log(`✅ Linked ${orphanedNFTs.length} orphaned NFTs to Telegram account`);
    }
    
    // 4. Синхронизировать TAMA баланс
    await syncTAMABalance();
}

async function syncTAMABalance() {
    // Загрузить баланс из базы и обновить gameState
    const { data } = await supabase
        .from('leaderboard')
        .select('tama')
        .eq('telegram_id', window.TELEGRAM_USER_ID)
        .single();
    
    if (data && data.tama !== undefined) {
        gameState.tama = data.tama;
        updateUI();
    }
}
```

---

## 📝 Что нужно сделать:

1. ✅ Добавить функцию `mintNFTWithSOL()` в `tamagotchi-game.html`
2. ✅ Добавить кнопки минтинга в NFT modal
3. ✅ Улучшить функцию `linkWalletToTelegramAccount()` для полной синхронизации
4. ✅ Добавить автоматическую синхронизацию при загрузке игры
5. ✅ Добавить синхронизацию TAMA баланса

---

## 🚀 Преимущества:

1. **Удобство:** Пользователи могут минтить NFT прямо в игре
2. **Синхронизация:** Все данные всегда актуальны
3. **Единый аккаунт:** Игра и сайт используют одни и те же данные
4. **Автоматизация:** Не нужно вручную связывать кошельки

---

**Готов начать реализацию?**

