# 🚀 НАСТРОЙКА РЕАЛЬНОГО WITHDRAWAL

## ✅ ЧТО БЫЛО СДЕЛАНО:

Бот теперь поддерживает **РЕАЛЬНЫЕ выводы** TAMA токенов на Solana!

### Добавленные функции:
1. ✅ `/wallet` - команда для подключения Phantom кошелька
2. ✅ Валидация Solana адресов (base58, 32-44 символа)
3. ✅ Реальная отправка SPL токенов через `spl-token` CLI
4. ✅ Обработка ошибок и таймаутов
5. ✅ Transaction signature + ссылка на Solscan
6. ✅ Проверка подключения кошелька перед withdrawal

---

## 🔧 НАСТРОЙКА ENVIRONMENT VARIABLES

### 1. Необходимые переменные:

Добавь в PowerShell (или в `.env` файл):

```powershell
# TAMA Token Mint Address (из tama-token-info.json)
$env:TAMA_MINT_ADDRESS="YOUR_TAMA_MINT_ADDRESS_HERE"

# Solana RPC URL
$env:SOLANA_RPC_URL="https://api.devnet.solana.com"

# Пути к keypairs (Windows paths)
$env:SOLANA_PAYER_KEYPAIR_PATH="C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH="C:\goooog\tama-mint-keypair.json"

# Bot username
$env:BOT_USERNAME="GotchiGameBot"
```

### 2. Как узнать TAMA_MINT_ADDRESS:

```powershell
# Если у тебя есть tama-token-info.json:
cat C:\goooog\tama-token-info.json
# Найди поле "address" или "mint"

# ИЛИ создай новый токен:
cd C:\goooog
spl-token create-token --decimals 9 -- tama-mint-keypair.json
```

### 3. Проверь наличие `spl-token` CLI:

```powershell
spl-token --version
# Должно показать версию, например: spl-token-cli 3.x.x

# Если нет, установи:
cargo install spl-token-cli
```

---

## 📋 КАК РАБОТАЕТ СИСТЕМА:

### Шаг 1: Пользователь подключает кошелёк

```
User: /wallet

Bot: 🔗 CONNECT PHANTOM WALLET
     
     To withdraw TAMA tokens, you need to connect your Phantom wallet.
     
     📱 How to get your wallet address:
     1. Open Phantom app/extension
     2. Click on your wallet name (top)
     3. Tap "Copy Address"
     4. Send it here
     
User: [отправляет адрес, например: 8kXyZ3vN4m...abc123]

Bot: ✅ WALLET CONNECTED!
     Address: 8kXyZ3...abc123
     You can now withdraw TAMA tokens using /withdraw
```

### Шаг 2: Пользователь выводит токены

```
User: /withdraw

Bot: 💸 WITHDRAW TAMA TOKENS
     📊 Your Balance: 52,046 TAMA
     💳 Wallet: 8kXyZ3...abc123
     
     [Кнопка: 💸 Start Withdrawal]

User: [нажимает кнопку]
Bot: [просит ввести сумму]

User: 15000

Bot: ⏳ Processing withdrawal...
     • Validating wallet
     • Preparing transaction
     • Sending to Solana network
     Please wait ~30 seconds...

Bot: ✅ WITHDRAWAL SUCCESSFUL!
     💸 Transaction Details:
     • Amount: 15,000 TAMA
     • Fee: 750 TAMA (5%)
     • Net Sent: 14,250 TAMA
     
     📊 New Balance: 37,046 TAMA
     💳 Destination: 8kXyZ3...abc123
     
     🔐 Transaction Signature:
     5XyZ...abc (32 chars)
     
     🚀 Status: Confirmed on Solana Devnet!
     
     🔍 View on Explorer:
     [Solscan](https://solscan.io/tx/...)
```

---

## 🔒 БЕЗОПАСНОСТЬ:

### Важные моменты:

1. **Keypairs защищены**: `payer-keypair.json` и `tama-mint-keypair.json` НЕ коммитятся в Git (есть в `.gitignore`)

2. **Валидация адресов**: Бот проверяет что адрес:
   - От 32 до 44 символов
   - Использует base58 алфавит (без 0, O, I, l)
   - Не placeholder (`telegram_*`)

3. **Транзакции атомарные**: Баланс уменьшается ТОЛЬКО если транзакция успешна

4. **Логирование**: Все операции логируются:
   ```
   [OK] Withdrawal successful: 7401131043 -> 8kXyZ... | 14250 TAMA | Sig: 5XyZ...
   [ERROR] Withdrawal failed for 7401131043: insufficient funds
   ```

---

## 🧪 ТЕСТИРОВАНИЕ:

### Тест 1: Подключение кошелька

```powershell
# Запусти бота
cd C:\goooog\solana-tamagotchi\bot
python bot.py

# В Telegram:
/wallet
[отправь тестовый адрес Devnet кошелька]
```

### Тест 2: Вывод малой суммы (10,000 TAMA)

```
# Убедись что у тебя есть баланс:
/stats

# Попробуй вывести минимум:
/withdraw
[нажми Start Withdrawal]
10000
```

### Тест 3: Проверка токенов в Phantom

1. Открой Phantom wallet
2. Переключись на Devnet (Settings → Developer Settings → Change Network → Devnet)
3. Проверь баланс TAMA токенов
4. Должен увидеть новые токены (~1-2 минуты)

---

## 🐛 TROUBLESHOOTING:

### Ошибка: "TAMA_MINT_ADDRESS not set"

**Решение**: Установи environment variable:
```powershell
$env:TAMA_MINT_ADDRESS="YOUR_ACTUAL_MINT_ADDRESS"
```

### Ошибка: "spl-token: command not found"

**Решение**: Установи Solana CLI tools:
```powershell
# Windows:
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Потом установи spl-token-cli:
cargo install spl-token-cli
```

### Ошибка: "insufficient funds"

**Решение**: У `payer-keypair.json` должен быть SOL для gas fees:
```powershell
# Airdrop SOL на Devnet:
solana airdrop 2 <PAYER_PUBLIC_KEY> --url https://api.devnet.solana.com
```

### Ошибка: "Transaction timeout"

**Решение**: 
- Проверь интернет соединение
- Используй другой RPC endpoint:
```powershell
$env:SOLANA_RPC_URL="https://api.devnet.solana.com"
# ИЛИ
$env:SOLANA_RPC_URL="https://rpc.ankr.com/solana_devnet"
```

---

## 📊 ARCHITECTURE:

```
┌─────────────────────────────────────────────────────────────┐
│  ПОЛЬЗОВАТЕЛЬ (Telegram)                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  BOT (bot.py)                                                │
│                                                               │
│  1. /wallet command                                          │
│     → validate_solana_address()                              │
│     → save to Supabase                                       │
│                                                               │
│  2. /withdraw command                                        │
│     → check wallet connected                                 │
│     → check balance >= 10,000                               │
│     → ask amount                                             │
│                                                               │
│  3. process_withdrawal_amount()                              │
│     → calculate fee (5%)                                     │
│     → call spl-token CLI ─────────────┐                     │
│     → wait for result                  │                     │
│     → update balance if success        │                     │
│     → save transaction record          │                     │
└────────────────────────────────────────┼────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────┐
│  SOLANA BLOCKCHAIN (Devnet)                                  │
│                                                               │
│  spl-token transfer:                                         │
│    --owner tama-mint-keypair.json                            │
│    --fee-payer payer-keypair.json                            │
│    --fund-recipient (create ATA if needed)                   │
│    TAMA_MINT → USER_WALLET                                   │
│                                                               │
│  Returns: Transaction Signature                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHANTOM WALLET                                              │
│  → User sees TAMA tokens                                     │
│  → Balance updated                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ:

### Для тестирования:

1. ✅ Установи TAMA_MINT_ADDRESS
2. ✅ Убедись что spl-token CLI установлен
3. ✅ Проверь что payer-keypair.json имеет SOL
4. ✅ Запусти бота
5. ✅ Протестируй /wallet
6. ✅ Протестируй /withdraw с малой суммой

### Для продакшена:

1. ⏳ Мигрировать на Mainnet (изменить RPC URL)
2. ⏳ Добавить rate limiting (макс 1 withdrawal в 24 часа)
3. ⏳ Добавить минимальный холдинг период
4. ⏳ Настроить мониторинг транзакций
5. ⏳ Добавить multi-sig для mint authority

---

## 📝 CHANGELOG:

### v1.9.2 (31 октября 2025)
- ✅ Добавлена команда `/wallet`
- ✅ Валидация Solana адресов
- ✅ Реальный withdrawal через spl-token CLI
- ✅ Обработка ошибок и таймаутов
- ✅ Integration с Solscan explorer
- ✅ Обновлён `/help` с информацией о `/wallet`

---

**Готово к тестированию!** 🚀

Настрой environment variables и запусти бота для тестирования реальных withdrawal операций.

