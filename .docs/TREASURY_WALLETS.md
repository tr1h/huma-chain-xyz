# 💰 Treasury Wallets - NFT Sales Revenue Distribution

## 🏦 Treasury Кошельки

### 1. **💰 Treasury Main** (Основная казна)
- **Address:** `AYXMfTR4A9SPdpXb4AynN5ybNPTts1BWQ8rzmkTezahf`
- **Keypair:** `treasury-main-keypair.json`
- **Purpose:** Операционные расходы, маркетинг, развитие проекта
- **Receives:**
  - **Bronze NFT (TAMA):** 30% от цены (750 TAMA из 2,500)
  - **Silver NFT (SOL):** 50% от цены (0.05 SOL из 0.1 SOL)
  - **Gold NFT (SOL):** 50% от цены (0.1 SOL из 0.2 SOL)

### 2. **💧 Treasury Liquidity** (Ликвидность)
- **Address:** `G36RMLGLFZRsQUQvcNE3tr37vg9udRVtmJdh2NzK2CeS`
- **Keypair:** `treasury-liquidity-keypair.json`
- **Purpose:** DEX liquidity pool (TAMA-SOL пара на Raydium/Orca)
- **Receives:**
  - **Silver NFT (SOL):** 30% от цены (0.03 SOL из 0.1 SOL)
  - **Gold NFT (SOL):** 30% от цены (0.06 SOL из 0.2 SOL)

### 3. **👥 Treasury Team** (Команда)
- **Address:** `AJfisG9epzDkcMi1zVD89xLoRT6eJAM1ZxEhtE2Wg31v`
- **Keypair:** `treasury-team-keypair.json`
- **Purpose:** Зарплаты, бонусы, операционные расходы команды
- **Receives:**
  - **Silver NFT (SOL):** 20% от цены (0.02 SOL из 0.1 SOL)
  - **Gold NFT (SOL):** 20% от цены (0.04 SOL из 0.2 SOL)

---

## 📊 Распределение NFT Revenue

### 🥉 **Bronze NFT** (2,500 TAMA)
| Destination | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| 🔥 BURN | 1,000 TAMA | 40% | Дефляция (уничтожение токенов) |
| 💰 Treasury Main | 750 TAMA | 30% | Развитие проекта |
| 🎮 P2E Pool | 750 TAMA | 30% | Возврат в игровую экономику |
| **TOTAL** | **2,500 TAMA** | **100%** | |

### 🥈 **Silver NFT** (0.1 SOL)
| Destination | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| 💰 Treasury Main | 0.05 SOL | 50% | Развитие проекта |
| 💧 Treasury Liquidity | 0.03 SOL | 30% | DEX liquidity pool |
| 👥 Treasury Team | 0.02 SOL | 20% | Команда |
| **TOTAL** | **0.1 SOL** | **100%** | |

### 🥇 **Gold NFT** (0.2 SOL)
| Destination | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| 💰 Treasury Main | 0.1 SOL | 50% | Развитие проекта |
| 💧 Treasury Liquidity | 0.06 SOL | 30% | DEX liquidity pool |
| 👥 Treasury Team | 0.04 SOL | 20% | Команда |
| **TOTAL** | **0.2 SOL** | **100%** | |

---

## 🎯 Как Используют Другие Проекты

### **STEPN** (Move-to-Earn)
- 30% → Treasury (развитие)
- 30% → Liquidity (поддержка цены)
- 20% → Burn (дефляция)
- 20% → Team (операции)

### **Axie Infinity** (Play-to-Earn)
- 50% → Treasury (игровая экономика)
- 30% → Staking Rewards (награды холдерам)
- 20% → Team (операционные расходы)

### **Wolf Game** (GameFi)
- 40% → Liquidity Pool
- 35% → Staking Rewards
- 25% → Team/Marketing

---

## ⚙️ Реализация в Коде

### Bronze NFT (TAMA)
```javascript
// nft-mint.html - mint handler
const tamaPurchase = {
    total: 2500,
    burn: 1000,           // 40% - уничтожается
    treasury: 750,        // 30% - на развитие
    p2e_pool: 750        // 30% - обратно в игру
};
```

### Silver/Gold NFT (SOL)
```javascript
// Будет реализовано через Metaplex + Anchor
const solPurchase = {
    silver: {
        total: 0.1,
        treasuryMain: 0.05,      // 50%
        treasuryLiquidity: 0.03, // 30%
        treasuryTeam: 0.02       // 20%
    },
    gold: {
        total: 0.2,
        treasuryMain: 0.10,      // 50%
        treasuryLiquidity: 0.06, // 30%
        treasuryTeam: 0.04       // 20%
    }
};
```

---

## 🔐 Безопасность

**⚠️ ВАЖНО:**
- Все keypair файлы добавлены в `.gitignore`
- **НИКОГДА** не коммитить `*-keypair.json` файлы в GitHub
- Хранить seed phrases в безопасном месте (не в проекте!)
- Treasury кошельки видны в `wallet-admin.html` (локально)

**Seed Phrases (сохрани в безопасном месте!):**
- **Treasury Main:** `call minimum foam during parent curtain defy rookie planet upset panic fence`
- **Treasury Liquidity:** `bitter wrong liberty virtual fall base noble fragile current omit turn liar`
- **Treasury Team:** `ship lamp pistol shy disorder two situate garlic stem order patrol dawn`

---

## 📈 Roadmap

### ✅ Phase 1 (DONE)
- Создать treasury кошельки
- Добавить в wallet-admin.html
- Документировать распределение

### 🔄 Phase 2 (IN PROGRESS)
- Реализовать Bronze TAMA mint с распределением
- Добавить burn механизм для TAMA
- Отправка 30% в Treasury Main
- Отправка 30% обратно в P2E Pool

### 📅 Phase 3 (NEXT)
- Реализовать Silver/Gold SOL mint
- Настроить Metaplex Candy Machine
- Автоматическое распределение SOL по кошелькам
- Интеграция с DEX для liquidity

---

## 📞 Contact

Если есть вопросы по treasury кошелькам или распределению - пиши в Telegram!

