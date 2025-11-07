# 🔧 ПОДГОТОВКА К VESTING - Инструкция

## ❌ Ошибка: AccountNotFound

**Причина:** Team wallet не готов для создания vesting stream.

---

## ✅ ЧТО НУЖНО СДЕЛАТЬ ПЕРЕД СОЗДАНИЕМ VESTING

### **1. Создать Token Account для Team Wallet**

```bash
# Получить адрес team wallet
solana address -k C:\goooog\team-wallet-keypair.json

# Создать token account для TAMA
spl-token create-account Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner C:\goooog\team-wallet-keypair.json \
  --url devnet
```

### **2. Пополнить Team Wallet SOL**

```bash
# Проверить баланс SOL
solana balance -k C:\goooog\team-wallet-keypair.json --url devnet

# Если баланс < 0.1 SOL, пополнить через faucet:
# https://faucet.solana.com/
# Или перевести с payer-keypair.json
```

### **3. Перевести TAMA токены на Team Wallet**

```bash
# Перевести 200M TAMA на team wallet
spl-token transfer Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY 200000000 \
  TEAM_WALLET_ADDRESS \
  --owner C:\goooog\payer-keypair.json \
  --fee-payer C:\goooog\payer-keypair.json \
  --url devnet \
  --allow-unfunded-recipient
```

**Замени `TEAM_WALLET_ADDRESS` на адрес team wallet!**

---

## 📋 ПОЛНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ ДЕЙСТВИЙ

### **Шаг 1: Получить адрес Team Wallet**

```bash
solana address -k C:\goooog\team-wallet-keypair.json --url devnet
```

**Сохрани адрес!** (Например: `AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR`)

### **Шаг 2: Создать Token Account**

```bash
spl-token create-account Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner C:\goooog\team-wallet-keypair.json \
  --url devnet
```

### **Шаг 3: Пополнить SOL (если нужно)**

```bash
# Проверить баланс
solana balance -k C:\goooog\team-wallet-keypair.json --url devnet

# Если < 0.1 SOL, использовать faucet:
# https://faucet.solana.com/
# Вставить адрес team wallet
```

### **Шаг 4: Перевести TAMA токены**

```bash
# Замени TEAM_WALLET_ADDRESS на адрес из шага 1!
spl-token transfer Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY 200000000 \
  TEAM_WALLET_ADDRESS \
  --owner C:\goooog\payer-keypair.json \
  --fee-payer C:\goooog\payer-keypair.json \
  --url devnet \
  --allow-unfunded-recipient
```

### **Шаг 5: Проверить баланс**

```bash
# Проверить TAMA баланс team wallet
spl-token accounts -k C:\goooog\team-wallet-keypair.json --url devnet
```

### **Шаг 6: Создать Vesting Stream**

```bash
node create_vesting_stream.js
```

---

## ⚠️ ВАЖНО

1. **Все команды для DEVNET!** Для mainnet убери `--url devnet`
2. **Проверь адреса** перед переводом токенов
3. **Убедись что payer-keypair имеет TAMA токены** для перевода
4. **Минимум 0.1 SOL** на team wallet для транзакций

---

## ✅ ПРОВЕРКА ГОТОВНОСТИ

Перед запуском `create_vesting_stream.js` убедись:

```
✅ Team wallet имеет token account для TAMA
✅ Team wallet имеет минимум 0.1 SOL
✅ Team wallet имеет 200M TAMA токенов
✅ Все адреса корректны
```

---

**Готово! После выполнения всех шагов можно создавать vesting stream!** 🚀

