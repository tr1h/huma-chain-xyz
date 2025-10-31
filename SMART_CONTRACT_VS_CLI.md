# 🤔 SMART CONTRACT VS CLI - КАК ЭТО РАБОТАЕТ?

## ❓ ВОПРОС: "Это будет через контракт или как?!"

**КОРОТКИЙ ОТВЕТ:**  
Сейчас используется **CLI (Command Line Interface)** через `spl-token` команду.  
Это **БЕЗ смарт-контракта**, но это **полностью легитимно** и **безопасно**!

---

## 🎯 ЧТО ПРОИСХОДИТ СЕЙЧАС?

### Текущая реализация: SPL Token CLI (БЕЗ контракта)

```python
# В bot.py
subprocess.run([
    'spl-token', 'transfer',
    'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY',  # TAMA mint
    '9500',                                          # Amount
    'USER_WALLET_ADDRESS',                           # Destination
    '--fee-payer', 'payer-keypair.json',
    '--owner', 'payer-keypair.json'
])
```

**Что это делает:**
1. Читает keypair с сервера (приватный ключ)
2. Создаёт и подписывает transaction
3. Отправляет на Solana RPC
4. Mint токены на кошелёк пользователя

**Плюсы:**
- ✅ Просто реализовать (уже работает!)
- ✅ Не нужно писать контракт
- ✅ Нет gas для контракта
- ✅ Быстро (15 секунд)

**Минусы:**
- ❌ Приватный ключ на сервере (риск взлома)
- ❌ Централизация (команда контролирует mint)
- ❌ Нет сложной логики (только transfer)

---

## 🔐 ПРОБЛЕМА БЕЗОПАСНОСТИ

### Текущая уязвимость:

```
┌─────────────────────────────────────────┐
│  СЕРВЕР (Heroku/VPS)                     │
│  ┌────────────────────────────────────┐ │
│  │  payer-keypair.json                 │ │
│  │  {                                  │ │
│  │    "privateKey": [123, 45, 67...]  │ │ ← ОПАСНО! 💀
│  │  }                                  │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Если сервер взломают:                  │
│  → Украдут keypair                      │
│  → Mint бесконечные TAMA                │
│  → Проект обнулится                     │
└─────────────────────────────────────────┘
```

**Как защититься (без контракта):**
1. Использовать **Hardware Security Module (HSM)**
2. Использовать **AWS KMS / Azure Key Vault**
3. Использовать **Multi-Sig** (несколько подписей)

---

## 💡 РЕШЕНИЕ 1: SMART CONTRACT (Solana Program)

### Вариант A: Custom Solana Program (Rust)

```rust
// programs/tama-withdrawal/src/lib.rs

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo};

declare_id!("YOUR_PROGRAM_ID");

#[program]
pub mod tama_withdrawal {
    use super::*;

    /// Withdraw TAMA with automatic fee distribution
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
    ) -> Result<()> {
        // 1. Проверить виртуальный баланс (off-chain oracle)
        let virtual_balance = ctx.accounts.user_data.tama_balance;
        require!(virtual_balance >= amount, ErrorCode::InsufficientBalance);

        // 2. Рассчитать fee (5%)
        let fee = amount.checked_mul(5).unwrap().checked_div(100).unwrap();
        let net_amount = amount.checked_sub(fee).unwrap();

        // 3. Распределить fee
        let burn_amount = fee.checked_mul(60).unwrap().checked_div(100).unwrap();
        let pool_amount = fee.checked_mul(30).unwrap().checked_div(100).unwrap();
        let team_amount = fee.checked_sub(burn_amount).unwrap().checked_sub(pool_amount).unwrap();

        // 4. Mint токены пользователю
        let cpi_accounts = MintTo {
            mint: ctx.accounts.tama_mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, net_amount)?;

        // 5. Burn токены
        let burn_accounts = token::Burn {
            mint: ctx.accounts.tama_mint.to_account_info(),
            from: ctx.accounts.burn_vault.to_account_info(),
            authority: ctx.accounts.burn_authority.to_account_info(),
        };
        let burn_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
        token::burn(burn_ctx, burn_amount)?;

        // 6. Перевести pool_amount в Daily Pool
        let pool_transfer = token::Transfer {
            from: ctx.accounts.fee_vault.to_account_info(),
            to: ctx.accounts.daily_pool.to_account_info(),
            authority: ctx.accounts.fee_authority.to_account_info(),
        };
        let pool_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), pool_transfer);
        token::transfer(pool_ctx, pool_amount)?;

        // 7. Перевести team_amount команде
        let team_transfer = token::Transfer {
            from: ctx.accounts.fee_vault.to_account_info(),
            to: ctx.accounts.team_wallet.to_account_info(),
            authority: ctx.accounts.fee_authority.to_account_info(),
        };
        let team_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), team_transfer);
        token::transfer(team_ctx, team_amount)?;

        // 8. Обновить виртуальный баланс (emit event для backend)
        emit!(WithdrawalEvent {
            user: ctx.accounts.user.key(),
            amount,
            net_amount,
            burn_amount,
            pool_amount,
            team_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub tama_mint: Account<'info, Mint>,
    
    /// CHECK: Mint authority (PDA)
    pub mint_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub burn_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub fee_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub daily_pool: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub team_wallet: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct WithdrawalEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub net_amount: u64,
    pub burn_amount: u64,
    pub pool_amount: u64,
    pub team_amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient virtual balance")]
    InsufficientBalance,
}
```

**Плюсы:**
- ✅ Полная децентрализация
- ✅ Приватный ключ НЕ на сервере
- ✅ Автоматическое распределение fee (burn, pool, team)
- ✅ Immutable логика (никто не может изменить)
- ✅ Прозрачность (код на блокчейне)

**Минусы:**
- ❌ Сложно написать (Rust + Anchor)
- ❌ Дорого deploy (~1-5 SOL)
- ❌ Нужен audit (безопасность)
- ❌ Дольше разрабатывать (1-2 недели)

---

### Вариант B: Solana Program Library (готовые контракты)

Использовать существующие программы:
- **Token Program** (SPL Token)
- **Associated Token Account Program**
- **Multisig Program**

```javascript
// Вместо CLI, использовать @solana/web3.js
const { Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { createTransferInstruction } = require('@solana/spl-token');

async function withdrawTAMA(userWallet, amount) {
  const transaction = new Transaction();
  
  // 1. Mint токены пользователю (net amount)
  transaction.add(
    createMintToInstruction(
      tamaMint,
      userTokenAccount,
      mintAuthority,
      netAmount
    )
  );
  
  // 2. Burn fee
  transaction.add(
    createBurnInstruction(
      feeVault,
      tamaMint,
      burnAuthority,
      burnAmount
    )
  );
  
  // 3. Transfer pool amount
  transaction.add(
    createTransferInstruction(
      feeVault,
      dailyPoolAccount,
      feeAuthority,
      poolAmount
    )
  );
  
  // 4. Transfer team amount
  transaction.add(
    createTransferInstruction(
      feeVault,
      teamWallet,
      feeAuthority,
      teamAmount
    )
  );
  
  // Отправить всё одной транзакцией (атомарность!)
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payerKeypair, mintAuthority, burnAuthority, feeAuthority]
  );
  
  return signature;
}
```

**Плюсы:**
- ✅ Не нужен custom контракт
- ✅ Атомарность (всё в одной tx)
- ✅ Дешевле (только gas fee)

**Минусы:**
- ❌ Всё равно нужны keypairs на сервере
- ❌ Сложнее чем CLI

---

## 🔐 РЕШЕНИЕ 2: MULTI-SIG (без контракта)

### Схема Multi-Signature:

```
┌────────────────────────────────────────────────────────┐
│  MINT AUTHORITY = Multi-Sig Account (2-of-3)           │
│                                                        │
│  Required: 2 подписи из 3 возможных                   │
│  ├─ Key 1: Team Lead (холодный кошелёк)               │
│  ├─ Key 2: Backend Server (горячий кошелёк)           │
│  └─ Key 3: Security Officer (холодный кошелёк)        │
│                                                        │
│  Withdrawal процесс:                                   │
│  1. Пользователь запрашивает вывод → Backend (Key 2)  │
│  2. Backend создаёт transaction → ждёт подтверждения  │
│  3. Team Lead (Key 1) проверяет → подписывает         │
│  4. Transaction выполняется (2 из 3 подписей ✅)       │
└────────────────────────────────────────────────────────┘
```

**Реализация:**

```bash
# Создать multi-sig аккаунт (один раз)
$ spl-token create-multisig \
  KEY1_ADDRESS \
  KEY2_ADDRESS \
  KEY3_ADDRESS \
  --threshold 2

# Output:
Creating multisig account: ABC123...xyz

# Установить multi-sig как mint authority
$ spl-token authorize \
  Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  mint \
  ABC123...xyz

# Теперь для mint нужно 2 подписи!
```

**Withdrawal с multi-sig:**

```python
# В bot.py
def process_withdrawal(user_wallet, amount):
    # 1. Создать transaction (первая подпись - Backend)
    result = subprocess.run([
        'spl-token', 'transfer',
        TAMA_MINT,
        str(amount),
        user_wallet,
        '--multisig-signer', 'backend-keypair.json',
        '--multisig-signer', 'WAITING_FOR_APPROVAL',  # Ждём вторую подпись
        '--fee-payer', 'backend-keypair.json'
    ], capture_output=True)
    
    tx_id = result.stdout.strip()
    
    # 2. Отправить уведомление Team Lead
    notify_team_lead(tx_id, user_wallet, amount)
    
    # 3. Team Lead проверяет и подписывает (вручную или через dashboard)
    # После второй подписи → transaction выполняется
    
    return tx_id
```

**Плюсы:**
- ✅ Не нужен контракт
- ✅ Защита от взлома (нужно украсть 2 ключа)
- ✅ Можно automated для маленьких сумм, manual для больших

**Минусы:**
- ❌ Медленнее (ждать вторую подпись)
- ❌ Нужен человек для подтверждения
- ❌ Всё равно есть hot wallet на сервере

---

## 🎯 СРАВНЕНИЕ ВСЕХ ВАРИАНТОВ

| Метод | Сложность | Безопасность | Скорость | Стоимость | Децентрализация |
|-------|-----------|--------------|----------|-----------|-----------------|
| **CLI (сейчас)** | ⭐ Легко | ⚠️ Средняя | ⚡ 15 сек | 💰 $0 | ❌ Нет |
| **Smart Contract** | ⭐⭐⭐⭐⭐ Сложно | ✅ Высокая | ⚡ 5-10 сек | 💰💰 $50-500 | ✅ Да |
| **Multi-Sig** | ⭐⭐⭐ Средне | ✅ Высокая | 🐌 1-10 мин | 💰 $0 | ⚠️ Частично |
| **Web3.js** | ⭐⭐⭐ Средне | ⚠️ Средняя | ⚡ 10 сек | 💰 $0 | ❌ Нет |
| **HSM/KMS** | ⭐⭐⭐⭐ Сложно | ✅ Высокая | ⚡ 15 сек | 💰💰💰 $100/мес | ❌ Нет |

---

## 🚀 РЕКОМЕНДАЦИЯ ДЛЯ ТВОЕГО ПРОЕКТА

### СЕЙЧАС (Hackathon):
**Оставить CLI** ✅
- Быстро
- Работает
- Достаточно для demo

### ПОСЛЕ HACKATHON (Mainnet):
**Использовать Multi-Sig** 🔐
- Просто добавить (1 день работы)
- Защита от взлома
- Не нужен контракт

### ДОЛГОСРОЧНО (Scale):
**Написать Smart Contract** 🏗️
- Полная децентрализация
- Автоматическое распределение fee
- Trust от community

---

## 📝 ПЛАН МИГРАЦИИ

### Phase 1: Сейчас → Hackathon (CLI)
```bash
# Уже работает!
✅ spl-token CLI
✅ payer-keypair.json на сервере
✅ Withdrawal за 15 секунд
```

### Phase 2: Post-Hackathon → Mainnet (Multi-Sig)
```bash
# Шаг 1: Создать multi-sig (1 час)
$ spl-token create-multisig KEY1 KEY2 KEY3 --threshold 2

# Шаг 2: Перенести mint authority (10 минут)
$ spl-token authorize TAMA_MINT mint MULTISIG_ADDRESS

# Шаг 3: Обновить bot.py (2 часа)
- Добавить multi-sig logic
- Добавить approval dashboard

# Шаг 4: Тест (1 день)
- Протестировать withdrawal
- Убедиться что 2 подписи работают

ИТОГО: ~2 дня работы
```

### Phase 3: Месяц 3-6 (Smart Contract)
```bash
# Шаг 1: Написать контракт на Rust (1 неделя)
- Withdrawal logic
- Fee distribution
- Events для backend

# Шаг 2: Тестирование (1 неделя)
- Unit tests
- Integration tests
- Devnet testing

# Шаг 3: Audit (2-4 недели)
- Нанять аудитора ($5K-$20K)
- Исправить уязвимости

# Шаг 4: Deploy на Mainnet (1 день)
- Deploy контракта (~1-5 SOL)
- Обновить frontend/backend

# Шаг 5: Миграция пользователей (1 неделя)
- Уведомить community
- Перенести mint authority на контракт
- Мониторинг

ИТОГО: 2-3 месяца + $5K-$20K
```

---

## 🔥 МОЯ РЕКОМЕНДАЦИЯ

```
┌─────────────────────────────────────────────┐
│  СТРАТЕГИЯ ДЛЯ TAMA:                         │
├─────────────────────────────────────────────┤
│                                             │
│  1. HACKATHON (сейчас)                      │
│     → Оставить CLI                          │
│     → Фокус на demo & pitch                 │
│                                             │
│  2. MAINNET LAUNCH (через 1-2 недели)       │
│     → Добавить Multi-Sig (2-3 дня)          │
│     → Minimal viable security               │
│                                             │
│  3. GROWTH PHASE (через 1-3 месяца)         │
│     → Написать Smart Contract               │
│     → Audit & Deploy                        │
│     → Full decentralization                 │
│                                             │
│  4. SCALE PHASE (через 6+ месяцев)          │
│     → DAO governance                        │
│     → Community контролирует всё            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ❓ FAQ

### Q: "Нужен ли контракт для хакатона?"
**A:** НЕТ! CLI достаточно для demo. Судьи оценят идею, не код контракта.

### Q: "Безопасно ли без контракта?"
**A:** На Devnet - ДА (это тестовые токены). На Mainnet - лучше добавить Multi-Sig.

### Q: "Сколько стоит написать контракт?"
**A:** 
- Своими силами (Rust знание): 2-4 недели
- Нанять разработчика: $5K-$15K
- Audit: $5K-$20K
- **ИТОГО: $10K-$35K**

### Q: "Можно ли добавить контракт потом?"
**A:** ДА! Легко мигрировать: просто перенести mint authority с keypair на контракт.

### Q: "Что делают другие GameFi проекты?"
**A:** 
- **Axie Infinity**: Smart contract (Ronin chain)
- **StepN**: Smart contract (Solana)
- **Splinterlands**: Centralized backend → потом контракт
- **Most new projects**: Начинают с CLI/Backend → потом контракт

---

## ✅ ИТОГО

```
ТЕКУЩАЯ РЕАЛИЗАЦИЯ:
├─ SPL Token CLI ✅
├─ Keypair на сервере (риск, но управляемый)
├─ 15 секунд на withdrawal
└─ $0 дополнительных затрат

БЕЗОПАСНОСТЬ ДЛЯ СЕЙЧАС:
├─ Хранить keypair в environment variables (не в git)
├─ Ограничить withdrawal (1M TAMA/день)
├─ Мониторинг подозрительных транзакций
└─ Backup keypair в холодном хранилище

ПЛАН НА БУДУЩЕЕ:
├─ Месяц 1: Multi-Sig (защита от взлома)
├─ Месяц 3-6: Smart Contract (полная децентрализация)
└─ Месяц 12+: DAO (community управление)
```

---

**ГЛАВНОЕ:** 
🎯 Для hackathon - **CLI ОК!**  
🔐 Для mainnet - **Multi-Sig минимум**  
🚀 Для scale - **Smart Contract обязательно**

**Ты на правильном пути! Продолжай!** 💪

---

**Документ создан:** 31 октября 2025  
**Версия:** 1.0  
**Автор:** TAMA Team

