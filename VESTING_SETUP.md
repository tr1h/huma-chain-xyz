# 🔒 VESTING SETUP - Как залочить токены команды

## ✅ СТАТУС: Токены распределены, vesting готов к настройке

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ✅ Распределено (Devnet):

```
Team Wallet:      AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR
Balance:          50,000,000 TAMA (5%)
Token Account:    HhaFKHPJj1k9cWTWMVuXLVPDPQ2AC3rQbFWrisn8rLVR

Liquidity Pool:   5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z
Balance:          30,000,000 TAMA (3%)
Token Account:    CMSPPVnFZqrkHBg8sM8zAWfETw1UDNeZ7s1i32pkSjju

Marketing:        2eryce7DH7mqDCPegTb696FjXReA5qmx9xfCKH5UneeF
Balance:          20,000,000 TAMA (2%)
Token Account:    DyvGQiuQAr9pfTHWMnLj64ZtEJPMiAScHhAvyqMiQBGK
```

**ВСЕГО РАСПРЕДЕЛЕНО:** 100,000,000 TAMA (10% от Total Supply)

---

## 🔐 VESTING - 3 ВАРИАНТА

### **ВАРИАНТ 1: Streamflow (Рекомендуется для MAINNET)**

#### A. Установка
```bash
npm install -g @streamflow/cli
```

#### B. Создание Vesting Stream для Team (50M TAMA)
```bash
streamflow create-stream \
  --cluster devnet \
  --token Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --amount 50000000 \
  --recipient AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR \
  --start-time $(date +%s) \
  --end-time $(($(date +%s) + 126144000)) \
  --cliff-time $(($(date +%s) + 15552000)) \
  --cancelable false \
  --keypair C:\goooog\team-wallet-keypair.json
```

**Параметры:**
- **Duration:** 126,144,000 секунд = **4 года**
- **Cliff:** 15,552,000 секунд = **6 месяцев** (токены залочены полностью)
- **Unlock:** Linear (постепенная разблокировка после cliff)
- **Cancelable:** false (нельзя отменить!)

#### C. Проверка Stream
```bash
streamflow list-streams --cluster devnet --owner AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR
```

---

### **ВАРИАНТ 2: Bonfida Token Vesting (Более простой)**

#### A. Установка Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

#### B. Клонирование Bonfida Token Vesting
```bash
git clone https://github.com/Bonfida/token-vesting.git
cd token-vesting
```

#### C. Создание Vesting Contract
```bash
# Деплой контракта (если ещё не задеплоен)
anchor build
anchor deploy --provider.cluster devnet

# Создание vesting schedule
anchor run create-vesting-schedule \
  --mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --destination AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR \
  --amount 50000000 \
  --cliff 15552000 \
  --duration 126144000
```

---

### **ВАРИАНТ 3: Manual Timelock (Для Devnet тестирования)**

Для **Devnet** можно просто **не трогать токены** на team wallet до момента launch!

#### Простая стратегия:
1. ✅ **50M TAMA на team-wallet** - НЕ ТРОГАТЬ 6 месяцев (cliff)
2. ✅ **30M TAMA на liquidity-pool** - использовать для DEX после листинга
3. ✅ **20M TAMA на marketing** - использовать для airdrops/campaigns

#### Для Mainnet:
- Обязательно использовать **Streamflow** или **Bonfida**!
- Vesting обеспечит доверие инвесторов!

---

## 📋 ROADMAP VESTING

### **СЕЙЧАС (Devnet):**
- ✅ Токены распределены
- ✅ Team wallet залочен вручную (не трогаем)
- ⏳ Manual timelock до запуска Mainnet

### **ПЕРЕД MAINNET:**
- ⬜ Установить Streamflow CLI
- ⬜ Создать vesting stream для 50M TAMA (team)
- ⬜ Проверить cliff и unlock schedule
- ⬜ Опубликовать vesting contract address

### **ПОСЛЕ MAINNET:**
- ⬜ Transparency dashboard (показывать vesting schedule)
- ⬜ Monthly reports (сколько токенов unlocked)
- ⬜ Community verification

---

## 🔍 ПРОВЕРКА БАЛАНСОВ

```bash
# Team
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR --url devnet

# Liquidity
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner 5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z --url devnet

# Marketing
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner 2eryce7DH7mqDCPegTb696FjXReA5qmx9xfCKH5UneeF --url devnet
```

---

## 🎯 РЕКОМЕНДАЦИЯ

**ДЛЯ DEVNET / ТЕСТИРОВАНИЯ:**
- Используй **Manual Timelock** (просто не трогай team wallet!)

**ДЛЯ MAINNET LAUNCH:**
- Обязательно используй **Streamflow** для vesting!
- Это повысит доверие сообщества!

---

## ✅ ИТОГ

### Текущий статус:
- ✅ **Team:** 50M TAMA залочены на wallet
- ✅ **Liquidity:** 30M TAMA готовы для DEX
- ✅ **Marketing:** 20M TAMA для промо
- ⏳ **Vesting:** Настроить Streamflow перед Mainnet

**ГОТОВО К ЗАПУСКУ!** 🚀

---

**Ссылки:**
- Streamflow: https://streamflow.finance
- Bonfida Vesting: https://github.com/Bonfida/token-vesting
- Solscan Team Wallet: https://solscan.io/account/AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR?cluster=devnet

