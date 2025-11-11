# 💎 NFT Mint & SOL Distribution Integration

## ✅ Что сделано

### 1. Интеграция распределения в API минтинга

**Файлы обновлены:**
- `api/mint-nft-sol.php` - для Silver, Gold, Platinum, Diamond
- `api/mint-nft-bronze-sol.php` - для Bronze Express (SOL)

**Как работает:**

1. После успешного минтинга NFT, API проверяет наличие `transaction_signature` в запросе
2. Если сигнатура есть, автоматически логируется распределение SOL:
   - 50% → Treasury Main
   - 30% → Treasury Liquidity  
   - 20% → Treasury Team
3. Распределение записывается в таблицу `sol_distributions` (если существует)
4. Ошибки распределения не блокируют минтинг NFT

### 2. Распределение средств

**Процентное распределение (фиксированное):**
```
Total SOL Payment = 100%
├─ 50% → Treasury Main (операционные расходы)
├─ 30% → Treasury Liquidity (для DEX пула)
└─ 20% → Treasury Team (для команды)
```

**Кошельки (Devnet):**
- Treasury Main: `6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM`
- Treasury Liquidity: `CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1`
- Treasury Team: `Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8`

## 📋 Что нужно сделать дальше

### Вариант 1: Фронтенд отправляет transaction_signature (Рекомендуется)

**Текущая ситуация:**
- Фронтенд вызывает API минтинга без `transaction_signature`
- Распределение не логируется автоматически

**Что нужно:**
1. Фронтенд создает транзакцию распределения на Solana
2. Пользователь подписывает транзакцию через Phantom
3. После подтверждения транзакции, фронтенд отправляет сигнатуру в API:

```javascript
// Пример для mintSOL()
async function mintSOL(tierName) {
    // ... существующий код получения цены ...
    
    // 1. Создать транзакцию распределения
    const { Transaction, SystemProgram, PublicKey } = solanaWeb3;
    const connection = new Connection('https://api.devnet.solana.com');
    
    const TREASURY_MAIN = new PublicKey('6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM');
    const TREASURY_LIQUIDITY = new PublicKey('CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1');
    const TREASURY_TEAM = new PublicKey('Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8');
    
    const transaction = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: walletAddress,
                toPubkey: TREASURY_MAIN,
                lamports: Math.floor(price * 1e9 * 0.50)
            })
        )
        .add(
            SystemProgram.transfer({
                fromPubkey: walletAddress,
                toPubkey: TREASURY_LIQUIDITY,
                lamports: Math.floor(price * 1e9 * 0.30)
            })
        )
        .add(
            SystemProgram.transfer({
                fromPubkey: walletAddress,
                toPubkey: TREASURY_TEAM,
                lamports: Math.floor(price * 1e9 * 0.20)
            })
        );
    
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletAddress;
    
    // 2. Подписать и отправить транзакцию
    const signed = await window.solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signed, 'confirmed');
    
    // 3. Отправить сигнатуру в API минтинга
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            telegram_id: TELEGRAM_USER_ID,
            wallet_address: walletAddress,
            tier: tierName,
            price_sol: price,
            transaction_signature: signed // ✅ Добавить сигнатуру!
        })
    });
    
    // ... остальной код ...
}
```

### Вариант 2: Бэкенд автоматически распределяет средства

**Требуется:**
- Настроить Solana keypair на бэкенде
- Создать функцию автоматического распределения
- Верифицировать платеж пользователя перед распределением

**Преимущества:**
- Пользователь делает только одну транзакцию (оплата)
- Распределение происходит автоматически
- Полный контроль на бэкенде

**Недостатки:**
- Требует настройки ключей на сервере
- Более сложная архитектура
- Нужна верификация платежа

## 🔍 Проверка работы

### 1. Проверить логи распределения

После минтинга NFT с `transaction_signature`, проверьте логи:
```
💰 SOL Distribution for Silver NFT:
  🏦 Treasury Main: 0.5 SOL (50%)
  💧 Treasury Liquidity: 0.3 SOL (30%)
  👥 Treasury Team: 0.2 SOL (20%)
✅ SOL distribution logged successfully
```

### 2. Проверить базу данных

```sql
SELECT * FROM sol_distributions 
WHERE transaction_signature = 'YOUR_TX_SIGNATURE'
ORDER BY created_at DESC;
```

Должно быть 3 записи (main, liquidity, team).

### 3. Проверить ответ API

API возвращает:
```json
{
  "success": true,
  "tier": "Silver",
  "distribution_logged": true,
  "transaction_signature": "YOUR_TX_SIGNATURE",
  ...
}
```

## 📝 Примечания

1. **Распределение опционально**: Если `transaction_signature` не предоставлен, минтинг все равно работает, но распределение не логируется.

2. **Таблица sol_distributions**: Если таблица не существует, распределение просто не логируется, но не вызывает ошибку.

3. **Транзакции в одной базе**: Распределение логируется в той же транзакции базы данных, что и минтинг NFT, обеспечивая консистентность.

4. **Статус 'pending'**: Все распределения логируются со статусом 'pending'. В будущем можно добавить автоматическое обновление статуса после верификации транзакции на блокчейне.

## 🚀 Следующие шаги

1. ✅ Интеграция распределения в API - **ГОТОВО**
2. ⏳ Обновить фронтенд для отправки transaction_signature
3. ⏳ Добавить верификацию транзакций на блокчейне
4. ⏳ Создать админ-панель для просмотра распределений
5. ⏳ Добавить автоматическое обновление статуса распределений

