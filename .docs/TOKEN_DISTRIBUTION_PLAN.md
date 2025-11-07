# 💰 ПЛАН РАСПРЕДЕЛЕНИЯ ТОКЕНОВ НА MAINNET

## 🎯 ЦЕЛЬ: Подготовка к mainnet запуску

---

## 📊 ТЕКУЩЕЕ РАСПРЕДЕЛЕНИЕ (Devnet)

```
TOTAL SUPPLY: 1,000,000,000 TAMA

РАСПРЕДЕЛЕНИЕ:
├─ 🎮 P2E Pool:        400,000,000 TAMA (40%)
├─ 👥 Team:            200,000,000 TAMA (20%)
├─ 📢 Marketing:       150,000,000 TAMA (15%)
├─ 💧 Liquidity:       100,000,000 TAMA (10%)
├─ 🎁 Community:       100,000,000 TAMA (10%)
└─ 🏦 Reserve:         50,000,000 TAMA (5%)
```

---

## 🔐 КЛЮЧИ И АДРЕСА

### Текущие keypair файлы:

```
✅ payer-keypair.json          → Payer & Mint Authority
✅ tama-mint-keypair.json      → Mint Authority
✅ p2e-pool-keypair.json       → P2E Pool (400M)
✅ team-wallet-keypair.json    → Team (200M)
✅ marketing-wallet-keypair.json → Marketing (150M)
✅ liquidity-pool-keypair.json → Liquidity (100M)
✅ community-wallet-keypair.json → Community (100M)
✅ reserve-wallet-keypair.json  → Reserve (50M)
```

### Адреса (из tokenomics.json):

```
TAMA Mint:     Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
P2E Pool:      HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw
Team:          AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR
Marketing:     2eryce7DH7mqDCPegTb696FjXReA5qmx9xfCKH5UneeF
Liquidity:     5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z
Community:     9X1DYKzHiYP4V2UuVNGbU42DQkd8ST1nPwbJDuFQY3T
Reserve:       8cDHbeHcuspjGKXofYzApCCBrAVenSHPy2UAPU1iCEj6
```

---

## 📋 ПЛАН РАСПРЕДЕЛЕНИЯ НА MAINNET

### ШАГ 1: Создать токен на Mainnet

```bash
# 1. Создать новый mint keypair для mainnet
solana-keygen new --outfile tama-mint-mainnet-keypair.json

# 2. Создать SPL токен
spl-token create-token \
  --decimals 9 \
  --mint-authority tama-mint-mainnet-keypair.json \
  --url https://api.mainnet-beta.solana.com

# 3. Сохранить mint address
# (будет новый адрес на mainnet)
```

### ШАГ 2: Создать все кошельки на Mainnet

```bash
# Создать keypairs для каждого кошелька
solana-keygen new --outfile p2e-pool-mainnet-keypair.json
solana-keygen new --outfile team-mainnet-keypair.json
solana-keygen new --outfile marketing-mainnet-keypair.json
solana-keygen new --outfile liquidity-mainnet-keypair.json
solana-keygen new --outfile community-mainnet-keypair.json
solana-keygen new --outfile reserve-mainnet-keypair.json
solana-keygen new --outfile payer-mainnet-keypair.json
```

### ШАГ 3: Распределить токены

```bash
# 1. Mint все токены на payer wallet
spl-token mint \
  <TAMA_MINT_ADDRESS> \
  1000000000 \
  <PAYER_MAINNET_ADDRESS> \
  --owner tama-mint-mainnet-keypair.json \
  --url https://api.mainnet-beta.solana.com

# 2. Распределить по кошелькам
spl-token transfer \
  <TAMA_MINT_ADDRESS> \
  400000000 \
  <P2E_POOL_MAINNET_ADDRESS> \
  --owner payer-mainnet-keypair.json \
  --url https://api.mainnet-beta.solana.com

spl-token transfer \
  <TAMA_MINT_ADDRESS> \
  200000000 \
  <TEAM_MAINNET_ADDRESS> \
  --owner payer-mainnet-keypair.json \
  --url https://api.mainnet-beta.solana.com

# ... и так далее для всех кошельков
```

### ШАГ 4: Настроить Vesting (Team)

```bash
# Использовать Streamflow или Bonfida для vesting
# Или создать свой timelock contract
```

---

## 🔒 БЕЗОПАСНОСТЬ КЛЮЧЕЙ

### ❌ НИКОГДА НЕ ДЕЛАТЬ:

```
❌ НЕ коммитить keypair файлы в Git
❌ НЕ хранить ключи на GitHub
❌ НЕ отправлять ключи по email/Telegram
❌ НЕ хранить ключи на публичных серверах
❌ НЕ использовать ключи в админ-панели на интернете
```

### ✅ ПРАВИЛЬНО:

```
✅ Хранить ключи локально (только на твоём компьютере)
✅ Использовать .gitignore для keypair файлов
✅ Шифровать ключи (password protection)
✅ Использовать hardware wallet для больших сумм
✅ Multi-sig для критических операций
✅ Локальная админ-панель (не на интернете)
```

---

## 🎯 РЕКОМЕНДУЕМАЯ СИСТЕМА

### 1. Локальная админ-панель (безопасно)

```
✅ Работает только на localhost
✅ Ключи НЕ отправляются в интернет
✅ Доступ только с твоего компьютера
✅ Можно использовать для управления
```

### 2. Шифрование ключей

```
✅ Хранить ключи в зашифрованном виде
✅ Использовать пароль для расшифровки
✅ Не хранить пароль в коде
```

### 3. Multi-sig для критических операций

```
✅ Для больших переводов использовать multi-sig
✅ Несколько подписей для безопасности
✅ Защита от компрометации одного ключа
```

---

## 📝 ЧЕКЛИСТ ПЕРЕД MAINNET

```
□ Создать все keypairs для mainnet
□ Сохранить ключи в безопасном месте (локально)
□ Создать токен на mainnet
□ Распределить токены по кошелькам
□ Настроить vesting для Team
□ Протестировать на devnet
□ Создать локальную админ-панель
□ Настроить мониторинг
□ Подготовить документацию
□ Создать backup ключей (зашифрованные)
```

---

**Готов к созданию безопасной системы управления!** ✅

