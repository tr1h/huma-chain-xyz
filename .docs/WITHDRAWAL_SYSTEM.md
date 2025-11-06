# 💸 WITHDRAWAL SYSTEM - DEMO MODE

## 📋 Overview

Mock withdrawal system для хакатона. Симулирует вывод TAMA токенов на Solana кошелёк без реальных блокчейн транзакций.

## ✨ Features

- ✅ Баланс списывается из БД (реально)
- ✅ История транзакций сохраняется
- ✅ Комиссия 5% (как в проде)
- ✅ Минимум: 10,000 TAMA
- ✅ Генерируется demo transaction ID
- ✅ Красивый UI с подтверждением

## 🎮 How to Use

### В боте (@GotchiGameBot):

```
/withdraw
```

**Шаги:**
1. Команда `/withdraw` - показывает текущий баланс
2. Кнопка "💸 Start Withdrawal"
3. Введите сумму (например: `15000`)
4. Подтверждение + списание с баланса
5. Получаете demo transaction ID

## 💰 Example Flow

```
User Balance: 52,046 TAMA

/withdraw
→ "Your Balance: 52,046 TAMA"
→ Click "💸 Start Withdrawal"
→ Enter: 15000
→ Fee: 750 TAMA (5%)
→ Net: 14,250 TAMA
→ New Balance: 37,046 TAMA

✅ Transaction: DEMO1730345678740113
```

## 📊 Database Schema

### tama_transactions table:
```sql
{
  telegram_id: "7401131043",
  amount: -15000,
  balance_before: 52046,
  balance_after: 37046,
  type: "withdrawal",
  reason: "Withdrawal to wallet (demo)",
  wallet_address: "AX4vt...maDVi",
  created_at: "2025-10-30T..."
}
```

## 🔧 Technical Implementation

### Location:
`solana-tamagotchi/bot/bot.py`

### Functions:
- `handle_withdraw_command()` - Command handler for `/withdraw`
- `handle_start_withdrawal()` - Callback for "Start Withdrawal" button
- `process_withdrawal_amount()` - Process user input amount

### Mock Transaction ID Format:
```
DEMO{timestamp}{telegram_id_first_6_digits}
Example: DEMO1730345678740113
```

## ⚠️ Demo Mode Notes

**Это НЕ реальные блокчейн транзакции:**
- Токены НЕ отправляются на кошелёк
- Transaction ID - фейковый (для демо)
- Баланс списывается только в БД

**Для production:**
- Подключить Solana Web3.js
- Использовать P2E Pool wallet
- Реальные SPL token transfers
- Подтверждение транзакций

## 🚀 Production Implementation

```javascript
// Real withdrawal (для будущего)
const { Connection, PublicKey, Transaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function realWithdrawal(amount, userWallet) {
    const connection = new Connection(process.env.SOLANA_RPC_URL);
    const fromWallet = loadKeypair(process.env.P2E_POOL_KEYPAIR);
    
    // Transfer SPL tokens
    const tx = await transferTokens({
        from: fromWallet,
        to: new PublicKey(userWallet),
        mint: TAMA_MINT_ADDRESS,
        amount: amount * (10 ** 9)
    });
    
    return tx.signature;
}
```

## 📝 Environment Variables

Required for production:
```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PAYER_KEYPAIR_PATH=/path/to/payer-keypair.json
P2E_POOL_KEYPAIR_PATH=/path/to/p2e-pool-keypair.json
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

## 🎯 For Hackathon Demo

**Presenter Script:**

1. Show user with balance: `52,046 TAMA`
2. Run `/withdraw`
3. Enter amount: `15000`
4. Show success message with demo TX
5. Verify balance decreased: `37,046 TAMA`
6. Explain: "In production, tokens sent to Solana wallet"

## ✅ Ready for Demo!

Mock withdrawal система полностью работает и готова для демонстрации на хакатоне! 🚀

