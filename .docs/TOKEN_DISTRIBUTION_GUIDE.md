# 🪙 РУКОВОДСТВО ПО РАСПРЕДЕЛЕНИЮ ТОКЕНОВ

## 📋 ЗАДАЧИ 5-6: Распределение и Vesting

---

## ШАГ 1: Создание кошельков проекта

```bash
# Team Wallet (50M TAMA, 5%)
solana-keygen new --outfile team-wallet.json
# Сохрани публичный адрес!

# Liquidity Wallet (30M TAMA, 3%)
solana-keygen new --outfile liquidity-wallet.json

# Marketing Wallet (20M TAMA, 2%)
solana-keygen new --outfile marketing-wallet.json
```

**ВАЖНО:** Сохрани все `.json` файлы в безопасном месте!

---

## ШАГ 2: Mint токены на кошельки (DEVNET тест)

```bash
# Установи переменные
export TAMA_MINT="Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
export PAYER="C:\goooog\payer-keypair.json"

# Team (50M)
spl-token mint $TAMA_MINT 50000000 TEAM_WALLET_ADDRESS \
  --url devnet \
  --fee-payer $PAYER \
  --owner $PAYER

# Liquidity (30M)
spl-token mint $TAMA_MINT 30000000 LIQUIDITY_WALLET_ADDRESS \
  --url devnet \
  --fee-payer $PAYER \
  --owner $PAYER

# Marketing (20M)
spl-token mint $TAMA_MINT 20000000 MARKETING_WALLET_ADDRESS \
  --url devnet \
  --fee-payer $PAYER \
  --owner $PAYER
```

---

## ШАГ 3: Token Vesting (Streamflow)

### A. Установка Streamflow CLI

```bash
npm install -g @streamflow/cli
```

### B. Создание vesting stream для Team

```bash
streamflow create-stream \
  --cluster devnet \
  --token $TAMA_MINT \
  --amount 50000000 \
  --recipient TEAM_WALLET_ADDRESS \
  --start-time $(date +%s) \
  --end-time $(($(date +%s) + 126144000)) \
  --cliff-time $(($(date +%s) + 15552000)) \
  --cancelable false \
  --keypair team-wallet.json
```

**Параметры:**
- Duration: 126144000 секунд = 4 года
- Cliff: 15552000 секунд = 6 месяцев
- Unlock: Linear (по секундам)

---

## ШАГ 4: Проверка

```bash
# Проверить баланс Team wallet
spl-token balance $TAMA_MINT --owner TEAM_WALLET_ADDRESS

# Проверить vesting stream
streamflow list-streams --cluster devnet
```

---

## 📊 ИТОГОВОЕ РАСПРЕДЕЛЕНИЕ

```
TOTAL: 1,000,000,000 TAMA

├─ 800,000,000 (80%) - Players
│  └─ Emission через 8 лет (halving)
│
├─ 100,000,000 (10%) - Minimum Reserve
│  └─ Нетронутый до конца эмиссии
│
├─ 50,000,000 (5%) - Team
│  └─ Vesting 4 года (cliff 6 мес)
│
├─ 30,000,000 (3%) - Liquidity
│  └─ Для DEX pools (Raydium)
│
└─ 20,000,000 (2%) - Marketing
   └─ Airdrops, campaigns
```

---

## ✅ ЧЕКЛИСТ

- [ ] Создал team-wallet.json
- [ ] Создал liquidity-wallet.json
- [ ] Создал marketing-wallet.json
- [ ] Mint 50M на team wallet
- [ ] Mint 30M на liquidity wallet
- [ ] Mint 20M на marketing wallet
- [ ] Создал vesting stream (Streamflow)
- [ ] Проверил все балансы
- [ ] Сохранил все keypairs в безопасности

---

**ГОТОВО!** 🎉

