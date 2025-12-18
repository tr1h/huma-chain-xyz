# 🎮 P2E Pool - Стратегия Пополнения

## 🔍 Текущая Ситуация

### **P2E Pool Wallet:**
```
Address: HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw
Current Balance: ~400M TAMA (реальные токены on-chain)
```

---

## 📉 Что Расходует P2E Pool?

### **1. Bronze NFT Mint (TAMA payment):**
```
Цена: 2,500 TAMA
Распределение:
  ├─ 1,000 TAMA (40%) → Burn (уничтожается)
  ├─ 750 TAMA (30%) → Treasury
  └─ 750 TAMA (30%) → P2E Pool (возвращается обратно)

Чистый расход: 2,500 - 750 = 1,750 TAMA
```

### **2. Withdrawals (будущее):**
```
Игрок выводит 10,000 TAMA:
  P2E Pool → Player: 9,500 TAMA (после 5% fee)
  5% (500 TAMA) → Treasury

Чистый расход: 9,500 TAMA
```

### **3. Расчет на 100 игроков:**
```
Сценарий: 100 игроков, каждый:
  • Минтит 1 Bronze NFT (2,500 TAMA)
  • Выводит 10,000 TAMA

Расходы:
  Bronze mints: 100 × 1,750 = 175,000 TAMA
  Withdrawals: 100 × 9,500 = 950,000 TAMA
  
  TOTAL: 1,125,000 TAMA (~0.28% от 400M)
```

---

## 📈 Что Пополняет P2E Pool? (Текущее Состояние)

### **Сейчас: НИЧЕГО АВТОМАТИЧЕСКИ!**

```
⚠️ P2E Pool пополняется ТОЛЬКО вручную:

1. Initial Mint (команда):
   spl-token mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
     400000000 \
     HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw
   
   P2E Pool: +400M TAMA

2. Manual Transfers (команда):
   spl-token transfer Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
     50000000 \
     HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
     --owner treasury-keypair.json
   
   P2E Pool: +50M TAMA
```

---

## 💡 Стратегии Автоматического Пополнения

### **1. Recycling (уже работает частично):**
```
Bronze NFT mint:
  30% (750 TAMA) → возвращается в P2E Pool ✅
  
  Это частично компенсирует расход!
```

### **2. Treasury Allocation (нужно реализовать):**
```
Периодически:
  Treasury → P2E Pool: X% от Treasury balance
  
  Например, раз в неделю:
    10% от Treasury → P2E Pool
```

### **3. Revenue Reinvestment (будущее):**
```
От SOL продаж NFTs:
  50% → Treasury Main
  30% → Treasury Liquidity
  20% → Treasury Team
  
  Можно добавить:
  10% от Treasury Main → P2E Pool (раз в месяц)
```

### **4. Token Sales (будущее):**
```
Продажа TAMA токенов:
  1 SOL = X TAMA (market price)
  
  Revenue:
    80% → P2E Pool (пополнение)
    20% → Treasury (profit)
```

### **5. DEX LP Fees (будущее):**
```
TAMA-SOL Liquidity Pool на Raydium:
  Trading fees → накапливаются в LP
  
  Периодически:
    Harvest fees → P2E Pool
```

---

## 🎯 Рекомендуемая Стратегия (сейчас)

### **Phase 1: Manual Management (текущий этап)**
```
1. Monitor P2E Pool balance:
   - Check daily on Solscan
   - Set alert если < 100M TAMA

2. Manual refills:
   - From Treasury когда нужно
   - Keep 200M+ TAMA в пуле

3. Track metrics:
   - Сколько Bronze mints в день
   - Сколько withdrawals (когда запустим)
   - Burn rate vs refill rate
```

### **Phase 2: Semi-Automatic (следующий этап)**
```
1. Weekly Treasury → P2E Pool transfer:
   - 10% от Treasury income
   - Automated script/cron job

2. Dashboard для мониторинга:
   - P2E Pool balance
   - Daily burn rate
   - Projected days until refill needed

3. Alerts:
   - Email/Telegram если balance < threshold
```

### **Phase 3: Fully Automatic (будущее)**
```
1. Smart contract автоматического пополнения:
   - Если P2E Pool < 100M → trigger refill
   - From Treasury or DEX LP

2. Dynamic percentages:
   - Больше игроков → больше процент возврата в P2E Pool
   - Меньше игроков → больше burn

3. Economic dashboard:
   - Real-time балансы
   - Predictions
   - Auto-adjustments
```

---

## 📊 Пример: 1 месяц работы (прогноз)

### **Scenario: 1,000 активных игроков**

```
Расходы:
  Bronze NFT mints: 1,000 × 1,750 = 1.75M TAMA
  Withdrawals: 500 × 9,500 = 4.75M TAMA (50% игроков)
  
  TOTAL OUTFLOW: 6.5M TAMA

Доходы:
  Bronze NFT recycling: 1,000 × 750 = 0.75M TAMA
  Manual Treasury refill: 10M TAMA (раз в месяц)
  
  TOTAL INFLOW: 10.75M TAMA

Net: +4.25M TAMA ✅
```

### **Scenario: 10,000 активных игроков**

```
Расходы:
  Bronze NFT mints: 10,000 × 1,750 = 17.5M TAMA
  Withdrawals: 5,000 × 9,500 = 47.5M TAMA (50% игроков)
  
  TOTAL OUTFLOW: 65M TAMA

Доходы:
  Bronze NFT recycling: 10,000 × 750 = 7.5M TAMA
  Manual Treasury refill: 50M TAMA (раз в месяц)
  
  TOTAL INFLOW: 57.5M TAMA

Net: -7.5M TAMA ⚠️
```

**⚠️ При 10,000+ игроков нужно:**
- Увеличить Treasury allocations
- Добавить automated refills
- Или увеличить recycling % (например, 40% вместо 30%)

---

## 🔧 Как Пополнить P2E Pool Вручную (сейчас)

### **Step 1: Check Balance**
```bash
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner p2e-pool-keypair.json \
  --url https://api.devnet.solana.com
```

### **Step 2: Transfer from Treasury**
```bash
# Предположим, нужно перевести 50M TAMA
spl-token transfer \
  Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  50000000 \
  HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --owner treasury-main-keypair.json \
  --url https://api.devnet.solana.com
```

### **Step 3: Verify**
```bash
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner p2e-pool-keypair.json \
  --url https://api.devnet.solana.com
```

### **Step 4: Log in Database (опционально)**
```sql
INSERT INTO transactions (
  user_id,
  username,
  type,
  amount,
  balance_before,
  balance_after,
  metadata
) VALUES (
  'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw',
  '🎮 P2E Pool Refill',
  'p2e_pool_refill',
  50000000,
  350000000, -- old balance
  400000000, -- new balance
  '{"source": "treasury_main", "reason": "monthly_allocation"}'
);
```

---

## 💰 P2E Pool vs Treasury Balances

### **P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw):**
```
Purpose: Operational wallet для игры
Use: NFT distributions, withdrawals
Target balance: 200M+ TAMA
Refill when: < 100M TAMA
```

### **Treasury Main (6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM):**
```
Purpose: Доход проекта
Income: SOL from NFTs, TAMA from distributions
Use: Развитие, маркетинг, team, P2E Pool refills
Target balance: Растет со временем
```

### **Treasury Liquidity (CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1):**
```
Purpose: DEX liquidity
Use: TAMA-SOL LP на Raydium
Target balance: Enough для healthy trading
```

### **Treasury Team (Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8):**
```
Purpose: Зарплаты команды
Use: Team payments, contractors
Target balance: 3-6 месяцев runway
```

---

## ✅ Action Items (сейчас)

### **Immediate (Phase 1):**
- [x] P2E Pool создан и имеет 400M TAMA
- [x] Bronze NFT mint recycling (30% back) работает
- [ ] Добавить мониторинг P2E Pool balance в admin panel
- [ ] Set up daily Telegram alerts для P2E Pool balance
- [ ] Create manual refill checklist/script

### **Short-term (Phase 2):**
- [ ] Weekly automated Treasury → P2E Pool transfer
- [ ] Dashboard с burn rate и projections
- [ ] Implement withdrawal system (будет расходовать P2E Pool)

### **Long-term (Phase 3):**
- [ ] Fully automated refill system
- [ ] DEX LP fees harvesting
- [ ] Token sale mechanism
- [ ] Dynamic percentage adjustments based on usage

---

## 📝 Summary

**Сейчас P2E Pool пополняется:**
1. ✅ Partial recycling (30% от Bronze NFT mints)
2. ✅ Manual transfers от команды (когда нужно)

**В будущем добавится:**
3. ⏳ Automated Treasury allocations
4. ⏳ DEX LP fees
5. ⏳ Token sales revenue

**Current status:**
- ✅ 400M TAMA в P2E Pool (достаточно на долго!)
- ✅ Recycling работает (30% возвращается)
- ⚠️ Нужно добавить мониторинг и alerts
- ⚠️ Нужно подготовить automated refills для масштабирования

