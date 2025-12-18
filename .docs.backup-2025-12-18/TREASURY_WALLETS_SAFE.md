# 💰 Treasury Wallets - NFT Sales Revenue Distribution

## 🏦 Treasury Кошельки

### 1. **💰 Treasury Main** (Основная казна)
- **Address:** `AYXMfTR4A9SPdpXb4AynN5ybNPTts1BWQ8rzmkTezahf`
- **Keypair:** `treasury-main-keypair.json` (локально, не в GitHub)
- **Purpose:** Операционные расходы, маркетинг, развитие проекта
- **Receives:**
  - **Bronze NFT (TAMA):** 30% от цены (750 TAMA из 2,500)
  - **Silver NFT (SOL):** 50% от цены (0.05 SOL из 0.1 SOL)
  - **Gold NFT (SOL):** 50% от цены (0.1 SOL из 0.2 SOL)

### 2. **💧 Treasury Liquidity** (Ликвидность)
- **Address:** `G36RMLGLFZRsQUQvcNE3tr37vg9udRVtmJdh2NzK2CeS`
- **Keypair:** `treasury-liquidity-keypair.json` (локально, не в GitHub)
- **Purpose:** DEX liquidity pool (TAMA-SOL пара на Raydium/Orca)
- **Receives:**
  - **Silver NFT (SOL):** 30% от цены (0.03 SOL из 0.1 SOL)
  - **Gold NFT (SOL):** 30% от цены (0.06 SOL из 0.2 SOL)

### 3. **👥 Treasury Team** (Команда)
- **Address:** `AJfisG9epzDkcMi1zVD89xLoRT6eJAM1ZxEhtE2Wg31v`
- **Keypair:** `treasury-team-keypair.json` (локально, не в GitHub)
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

## 🔐 Безопасность

**⚠️ ВАЖНО:**
- Все keypair файлы хранятся **ЛОКАЛЬНО** в `C:\goooog\`
- Все `*-keypair.json` файлы добавлены в `.gitignore`
- **Seed phrases хранятся в безопасном месте (НЕ в проекте!)**
- **НИКОГДА** не коммитить seed phrases в GitHub
- Treasury кошельки видны в `wallet-admin.html` (только локально)

**Где хранить seed phrases:**
- 📝 Записать на бумаге, хранить в сейфе
- 🔐 Менеджер паролей (1Password, Bitwarden)
- 💾 Зашифрованный USB-флешка
- ❌ **НЕ в проекте, НЕ в GitHub, НЕ в облаке!**

---

## ⚙️ Реализация в Коде

### Bronze NFT (TAMA)
```javascript
// nft-mint.html - mint handler
const TREASURY_ADDRESSES = {
    main: 'AYXMfTR4A9SPdpXb4AynN5ybNPTts1BWQ8rzmkTezahf',
    liquidity: 'G36RMLGLFZRsQUQvcNE3tr37vg9udRVtmJdh2NzK2CeS',
    team: 'AJfisG9epzDkcMi1zVD89xLoRT6eJAM1ZxEhtE2Wg31v'
};

const tamaPurchase = {
    total: 2500,
    burn: 1000,           // 40% - уничтожается
    treasury: 750,        // 30% - на развитие
    p2e_pool: 750        // 30% - обратно в игру
};
```

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

## 🚨 SECURITY INCIDENT - Nov 7, 2025

**Что случилось:**
- Seed phrases были случайно закоммичены в `.docs/TREASURY_WALLETS.md`
- Файл был загружен в публичный GitHub репозиторий
- **Коммит:** `a0c95e0`

**Что сделано:**
- ❌ Файл удалён из репозитория
- ⚠️ **НО история Git сохраняется!** Seed phrases всё ещё видны в истории
- 🔄 **ТРЕБУЕТСЯ:** Создать новые treasury кошельки
- 🔄 **ТРЕБУЕТСЯ:** Очистить Git историю (git filter-branch)

**Статус кошельков:**
- 🔴 **Скомпрометированы!** Любой может увидеть seed phrases в истории Git
- ⚠️ **Не отправлять средства на эти адреса!**
- ✅ **Создать новые кошельки с новыми seed phrases**

