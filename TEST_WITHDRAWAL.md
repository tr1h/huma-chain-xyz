# 🧪 ТЕСТИРОВАНИЕ РЕАЛЬНОГО WITHDRAWAL

## ✅ ВСЁ НАСТРОЕНО!

### Конфигурация:
- ✅ **TAMA Token:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`
- ✅ **Network:** Solana Devnet
- ✅ **Mint Authority:** `8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi` (payer-keypair.json)
- ✅ **SOL Balance:** 0.49 SOL (достаточно для тестов)
- ✅ **Supply:** 1,000,000,000 TAMA
- ✅ **Бот запущен:** @GotchiGameBot

---

## 📋 ИНСТРУКЦИЯ ПО ТЕСТИРОВАНИЮ:

### Шаг 1: Подготовь тестовый Devnet кошелёк

**Вариант A: Создай новый (быстро):**
```powershell
# Создай новый тестовый кошелёк
solana-keygen new --outfile test-wallet.json

# Узнай адрес
solana-keygen pubkey test-wallet.json

# Этот адрес используй для теста
```

**Вариант B: Используй существующий Phantom на Devnet:**
1. Открой Phantom
2. Settings → Developer Settings → Change Network → **Devnet**
3. Скопируй адрес кошелька

---

### Шаг 2: Подключи кошелёк в боте

В Telegram отправь @GotchiGameBot:

```
/wallet
```

Бот попросит отправить адрес. Отправь адрес из Шага 1.

**Пример:**
```
HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH
```

Бот ответит:
```
✅ WALLET CONNECTED!
Address: HN7cAB...4YWrH
You can now withdraw TAMA tokens using /withdraw
```

---

### Шаг 3: Проверь свой баланс

```
/stats
```

Должно показать твой текущий баланс TAMA (например, 52,046 TAMA).

---

### Шаг 4: Попробуй вывод

```
/withdraw
```

Бот покажет:
```
💸 WITHDRAW TAMA TOKENS
📊 Your Balance: 52,046 TAMA
💳 Wallet: HN7cAB...4YWrH

[Кнопка: 💸 Start Withdrawal]
```

Нажми кнопку **"Start Withdrawal"**.

---

### Шаг 5: Введи сумму

Бот попросит:
```
💸 WITHDRAWAL REQUEST
Enter withdrawal amount: 10000
```

Введи тестовую сумму:
```
10000
```

(Минимум 10,000 TAMA)

---

### Шаг 6: Жди подтверждение

Бот покажет:
```
⏳ Processing withdrawal...
• Validating wallet
• Preparing transaction
• Sending to Solana network
Please wait ~30 seconds...
```

Через ~30 секунд:

**✅ УСПЕХ:**
```
✅ WITHDRAWAL SUCCESSFUL!

💸 Transaction Details:
• Amount: 10,000 TAMA
• Fee: 500 TAMA (5%)
• Net Sent: 9,500 TAMA

📊 New Balance: 42,046 TAMA
💳 Destination: HN7cAB...4YWrH

🔐 Transaction Signature:
5XyZ3vN4m...abc123

🚀 Status: Confirmed on Solana Devnet!

🔍 View on Explorer:
[Solscan]
```

**❌ ОШИБКА (если что-то не так):**
```
❌ WITHDRAWAL FAILED
Transaction could not be completed.
Error: [детали]
Your balance was not deducted.
```

---

### Шаг 7: Проверь токены в кошельке

**Вариант A: Через Phantom (Devnet):**
1. Открой Phantom на Devnet
2. Посмотри список токенов
3. Должен появиться TAMA (9,500 токенов)

**Вариант B: Через Solscan:**
1. Открой https://solscan.io/?cluster=devnet
2. Вставь свой адрес кошелька
3. Перейди во вкладку "Tokens"
4. Должен показать TAMA баланс

**Вариант C: Через CLI:**
```powershell
spl-token accounts --owner <ТВОЙ_АДРЕС> --url https://api.devnet.solana.com
```

---

## 🐛 TROUBLESHOOTING:

### Ошибка: "TAMA_MINT_ADDRESS not set"
**Решение:** Environment variable не установлена, перезапусти бот с переменными:
```powershell
$env:TAMA_MINT_ADDRESS="Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
cd C:\goooog\solana-tamagotchi\bot
python bot.py
```

### Ошибка: "insufficient funds"
**Решение:** У payer-keypair недостаточно SOL для gas:
```powershell
solana airdrop 1 8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi --url https://api.devnet.solana.com
```

### Ошибка: "Transaction timeout"
**Решение:** RPC перегружен, попробуй другой:
```powershell
$env:SOLANA_RPC_URL="https://rpc.ankr.com/solana_devnet"
```

### Ошибка: "Invalid wallet address"
**Решение:** Адрес должен быть:
- От 32 до 44 символов
- Base58 (без 0, O, I, l)
- Валидный Solana адрес

### Токены не появились в Phantom
**Причины:**
1. Phantom на **Mainnet** вместо **Devnet** (переключи в настройках)
2. Нужно подождать 1-2 минуты для синхронизации
3. Нужно добавить TAMA токен вручную (Add Token → вставь mint address)

---

## 📊 ТЕСТОВЫЕ СЦЕНАРИИ:

### ✅ Тест 1: Минимальный вывод
```
Сумма: 10,000 TAMA
Ожидается: 9,500 TAMA на кошельке (после 5% fee)
```

### ✅ Тест 2: Средний вывод
```
Сумма: 25,000 TAMA
Ожидается: 23,750 TAMA на кошельке
```

### ✅ Тест 3: Большой вывод
```
Сумма: 50,000 TAMA
Ожидается: 47,500 TAMA на кошельке
```

### ❌ Тест 4: Недостаточный баланс
```
Сумма: 100,000 TAMA (если баланс меньше)
Ожидается: Ошибка "Insufficient balance"
```

### ❌ Тест 5: Меньше минимума
```
Сумма: 5,000 TAMA
Ожидается: Ошибка "Minimum withdrawal: 10,000 TAMA"
```

### ❌ Тест 6: Без кошелька
```
Попытка /withdraw без /wallet
Ожидается: "Connect wallet first! Use /wallet"
```

---

## 🔍 КАК ПРОВЕРИТЬ ЧТО ВСЁ РАБОТАЕТ:

### 1. Баланс уменьшился в боте:
```
До вывода: 52,046 TAMA
После вывода 10,000: 42,046 TAMA
```

### 2. Токены на кошельке:
```
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY --owner <АДРЕС> --url https://api.devnet.solana.com

Результат: 9500 TAMA (с учётом decimals 9)
```

### 3. Transaction на Solscan:
```
https://solscan.io/tx/<SIGNATURE>?cluster=devnet

Должны показать:
- Status: Success ✅
- From: Mint Authority
- To: Твой адрес
- Amount: 9,500 TAMA
- Program: Token Program
```

---

## 📝 ЛОГИ БОТА:

При успешном выводе в консоли должно быть:
```
[OK] Withdrawal successful: 7401131043 -> HN7cAB...4YWrH | 9500 TAMA | Sig: 5XyZ...
```

При ошибке:
```
[ERROR] Withdrawal failed for 7401131043: [причина]
```

---

## ✅ ЧЕКЛИСТ ПЕРЕД ТЕСТОМ:

- [ ] Environment variables установлены
- [ ] Бот запущен (@GotchiGameBot)
- [ ] spl-token CLI установлен (версия 3.4.1+)
- [ ] У payer-keypair есть SOL (>0.1 SOL)
- [ ] Тестовый кошелёк создан (или Phantom на Devnet)
- [ ] Баланс в боте >10,000 TAMA

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ ПОСЛЕ ТЕСТА:

### Если всё работает ✅:
1. Коммит изменения в Git
2. Обнови документацию
3. Протестируй ещё раз с другим адресом
4. Можешь показать жюри что withdrawal реально работает!

### Если есть ошибки ❌:
1. Проверь логи бота
2. Проверь transaction на Solscan
3. Проверь баланс SOL для gas
4. Напиши мне - разберёмся!

---

## 🚀 ГОТОВ К ТЕСТУ!

**Текущая конфигурация:**
```
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
PAYER (Mint Authority)=8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi
SOL Balance=0.49 SOL ✅
Bot=@GotchiGameBot ✅
```

**Просто открой Telegram и начни с `/wallet`!** 🎮

---

**Последнее обновление:** 31 октября 2025, 20:30  
**Статус:** ✅ Готов к тестированию

