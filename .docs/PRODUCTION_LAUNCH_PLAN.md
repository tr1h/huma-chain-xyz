# 🚀 PRODUCTION LAUNCH PLAN - TAMA TOKEN

## ✅ ХАКАТОН ОТПРАВЛЕН!

Теперь готовим **полноценный запуск**! 

---

## 📋 ПЛАН РЕАЛИЗАЦИИ (9 задач)

### ✅ ЗАДАЧА 1: Mint Page (mint.html)
- [x] Страница существует
- [ ] Проверить Phantom integration
- [ ] Настроить стоимость NFT (10K/50K/100K/500K TAMA)
- [ ] Проверить mint функционал

### ✅ ЗАДАЧА 2: Кнопка Withdrawal в игре
- [x] Кнопка "💸 Withdraw" существует
- [ ] Сделать её рабочей (открывает бот)
- [ ] Оптимизировать UI (убрать лишние кнопки)
- [ ] Адаптивный дизайн (mobile-first)

### ✅ ЗАДАЧА 3: Токеномика в админке
Добавить в `super-admin.html`:
```
📊 TOKENOMICS DASHBOARD
├─ Total Supply: 1,000,000,000 TAMA
├─ Circulating Supply: 0 TAMA (только выведенные)
├─ Burned: 0 TAMA
├─ Daily Pool: 2,222,222 TAMA/день
├─ Pool Remaining: 400,000,000 TAMA (Year 1 H1)
├─ Next Halving: 180 дней
└─ Total Withdrawn: 0 TAMA
```

### ✅ ЗАДАЧА 4: Улучшение админки
Добавить:
- 📊 Emission Monitor (сколько создано реальных токенов)
- 🔥 Burn Statistics (виртуальные vs реальные)
- ⏰ Halving Countdown (до следующего халвинга)
- 💸 Withdrawal Monitor (последние 50 выводов)
- 📈 Real-time charts (Chart.js)

### ✅ ЗАДАЧА 5: Распределение токенов
```bash
# Создать кошельки для проекта
1. Team Wallet: 50,000,000 TAMA (5%)
2. Liquidity Wallet: 30,000,000 TAMA (3%)
3. Marketing Wallet: 20,000,000 TAMA (2%)
4. Daily Pool Wallet: 800,000,000 TAMA (80%)
5. Minimum Reserve: 100,000,000 TAMA (10%)

# Mint токены на эти кошельки
$ spl-token mint Fuqw8Zg17... 50000000 TEAM_WALLET
$ spl-token mint Fuqw8Zg17... 30000000 LIQUIDITY_WALLET
$ spl-token mint Fuqw8Zg17... 20000000 MARKETING_WALLET
```

### ✅ ЗАДАЧА 6: Token Vesting (залочить токены)
```bash
# Использовать Streamflow или Bonfida Token Vesting
# Team tokens: 4 года vesting с 6-месячным cliff

1. Установить Streamflow CLI
2. Создать vesting contract
3. Lock 50M TAMA на 4 года
4. Linear unlock (12.5M/год)
```

### ✅ ЗАДАЧА 7: Проверка реферальной системы
- [ ] 2-level referral работает?
- [ ] Rewards начисляются? (10% L1, 5% L2)
- [ ] QR codes генерируются?
- [ ] Milestone bonuses?

### ✅ ЗАДАЧА 8: PHP API сервер
```bash
# Найти и запустить
cd C:\goooog
php -S localhost:8002

# Проверить endpoints:
curl http://localhost:8002/api/tama/test
curl http://localhost:8002/api/tama/stats
```

### ✅ ЗАДАЧА 9: Оптимизация Withdrawal
**ЭКОНОМИЯ ТОКЕНОВ:**
```python
# СЕЙЧАС (неэкономно):
# Mint 10,000 TAMA → burn 300 → recycle 150 → team 50
# = Создано 10,000 реальных

# ЭКОНОМНО (рекомендация):
# Mint ТОЛЬКО net amount: 9,500 TAMA
# Fee остаётся виртуальным
# = Создано 9,500 реальных ✅

def withdraw_economical(amount, user_wallet):
    # 1. Рассчитать net amount
    fee = amount * 0.05
    net_amount = amount - fee
    
    # 2. Mint ТОЛЬКО net amount
    spl-token mint TAMA_MINT net_amount user_wallet
    
    # 3. Fee остаётся виртуальным (счётчики в базе)
    update_stats(burned=fee*0.6, recycled=fee*0.3, team=fee*0.1)
    
    # ЭКОНОМИЯ: 500 токенов не создано!
```

---

## 🎯 ЭТАПЫ РАСПРЕДЕЛЕНИЯ ТОКЕНОВ

### ЭТАП 1: INITIAL SETUP (сейчас, Devnet)
```
Total Supply: 1B TAMA
Minted: 0 TAMA
Circulating: 0 TAMA

Все токены создаются ПО ТРЕБОВАНИЮ (on-demand mint)
```

### ЭТАП 2: PRE-LAUNCH (за неделю до Mainnet)
```bash
# Создать проектные кошельки на Mainnet
$ solana-keygen new -o team-wallet.json
$ solana-keygen new -o liquidity-wallet.json
$ solana-keygen new -o marketing-wallet.json

# Mint токены
$ spl-token mint TAMA_MINT 50000000 TEAM_WALLET --url mainnet
$ spl-token mint TAMA_MINT 30000000 LIQUIDITY_WALLET --url mainnet
$ spl-token mint TAMA_MINT 20000000 MARKETING_WALLET --url mainnet

Total Minted: 100,000,000 TAMA (10%)
Locked: 50,000,000 TAMA (Team, vesting)
Liquid: 50,000,000 TAMA (Liquidity + Marketing)
```

### ЭТАП 3: LAUNCH DAY (День запуска)
```bash
# 1. Создать Liquidity Pool на Raydium
$ raydium create-pool \
  --token-a TAMA_MINT \
  --token-b SOL \
  --amount-a 30000000 \
  --amount-b 150 \
  --price 0.000005

# Initial Price: $0.000005/TAMA
# Market Cap: $5,000 (fully diluted $5M)

# 2. Lock Liquidity (6 месяцев)
$ raydium lock-liquidity --duration 180days

# 3. Announce Launch
- Twitter/X announcement
- Telegram announcement
- Discord announcement
```

### ЭТАП 4: GROWTH PHASE (Месяц 1-6)
```
Daily Pool Distribution: 2.2M TAMA/день
Players earn → withdraw → real tokens created
Total Created (6 months): ~400M TAMA (если все выведут)

Marketing spend: 20M TAMA (airdrops, campaigns)
```

### ЭТАП 5: HALVING (Месяц 6)
```
Daily Pool: 2.2M → 1.1M TAMA/день
Supply inflation замедляется
Price should increase (дефляция)
```

---

## 🔐 КАК ЗАЛОЧИТЬ ТОКЕНЫ?

### ВАРИАНТ 1: Streamflow (рекомендую) ✅

```bash
# 1. Установить Streamflow CLI
$ npm install -g @streamflow/cli

# 2. Создать vesting stream
$ streamflow create-stream \
  --token TAMA_MINT \
  --amount 50000000 \
  --recipient TEAM_WALLET \
  --start-time $(date +%s) \
  --duration 126144000 \  # 4 года в секундах
  --cliff 15552000 \      # 6 месяцев cliff
  --cancelable false

# Результат:
Stream ID: ABC123...xyz
Vesting: 50M TAMA over 4 years
Unlock: 12.5M TAMA/год (linear)
Cliff: 6 месяцев (ничего нельзя вывести)
```

**Плюсы Streamflow:**
- ✅ Trusted (используют многие проекты)
- ✅ UI для просмотра vesting
- ✅ Non-cancelable (нельзя отменить)
- ✅ Linear unlock (по секундам)

**Стоимость:** ~0.1 SOL (создание stream)

---

### ВАРИАНТ 2: Bonfida Token Vesting

```bash
# 1. Использовать Bonfida UI
https://vesting.bonfida.org/#/

# 2. Создать vesting contract
- Token: TAMA
- Amount: 50M
- Recipient: Team wallet
- Duration: 4 years
- Cliff: 6 months

# 3. Deploy contract (via UI)
```

**Плюсы Bonfida:**
- ✅ Проверенный (used by Solana Foundation)
- ✅ Simple UI
- ✅ Transparent

**Стоимость:** ~0.05 SOL

---

### ВАРИАНТ 3: Timelock (простой)

```bash
# Создать timelock account
$ spl-token create-account TAMA_MINT \
  --owner TIMELOCK_PROGRAM

# Transfer токены
$ spl-token transfer TAMA_MINT 50000000 TIMELOCK_ACCOUNT

# Set unlock date (4 года)
$ solana program timelock set \
  --account TIMELOCK_ACCOUNT \
  --unlock-date 2029-11-01
```

**Минусы:**
- ❌ Не linear (unlock всё сразу)
- ❌ Менее гибкий

---

## 📊 ADMIN DASHBOARD UPDATES

### Новые секции в super-admin.html:

```html
<!-- TOKENOMICS SECTION -->
<section id="tokenomics-dashboard">
  <h2>💰 TOKENOMICS</h2>
  
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Total Supply</h3>
      <p class="big-number">1,000,000,000 TAMA</p>
      <small>Fixed maximum</small>
    </div>
    
    <div class="stat-card">
      <h3>Circulating Supply</h3>
      <p class="big-number" id="circulating-supply">0 TAMA</p>
      <small>Actually withdrawn</small>
    </div>
    
    <div class="stat-card">
      <h3>Burned (Virtual)</h3>
      <p class="big-number" id="burned-virtual">0 TAMA</p>
      <small>From withdrawal fees</small>
    </div>
    
    <div class="stat-card">
      <h3>Daily Pool</h3>
      <p class="big-number">2,222,222 TAMA</p>
      <small>Year 1 H1</small>
    </div>
  </div>
  
  <div class="halving-countdown">
    <h3>⏰ Next Halving</h3>
    <p id="halving-countdown">In 180 days</p>
    <div class="progress-bar">
      <div class="progress" style="width: 0%"></div>
    </div>
  </div>
</section>

<!-- WITHDRAWAL MONITOR -->
<section id="withdrawal-monitor">
  <h2>💸 Recent Withdrawals</h2>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>User</th>
        <th>Amount</th>
        <th>Fee</th>
        <th>Net</th>
        <th>Signature</th>
      </tr>
    </thead>
    <tbody id="withdrawal-list">
      <!-- Populated via JS -->
    </tbody>
  </table>
</section>

<!-- EMISSION CHART -->
<section id="emission-chart">
  <h2>📈 Token Emission</h2>
  <canvas id="emission-canvas"></canvas>
</section>
```

---

## 🔥 ЭКОНОМИЯ ТОКЕНОВ (ВАЖНО!)

### ПРОБЛЕМА:
```python
# Текущая реализация (неэкономная):
withdrawal 10,000 TAMA:
├─ Mint 10,000 TAMA
├─ Transfer 9,500 user
├─ Burn 300
├─ Transfer 150 pool
└─ Transfer 50 team

Total Created: 10,000 TAMA
Total Burned: 300 TAMA
Net Inflation: +9,700 TAMA
```

### РЕШЕНИЕ (ЭКОНОМИЯ):
```python
# Оптимизированная реализация:
withdrawal 10,000 TAMA:
├─ Mint ТОЛЬКО 9,500 TAMA
└─ Transfer 9,500 user

Fee (500 TAMA):
├─ Виртуально "burned": 300 (счётчик в базе)
├─ Виртуально "recycled": 150 (счётчик в базе)
└─ Виртуально "team": 50 (счётчик в базе)

Total Created: 9,500 TAMA ✅
Total Burned: 0 (виртуально 300)
Net Inflation: +9,500 TAMA

ЭКОНОМИЯ: 500 токенов на каждый withdrawal!
```

### КОД (bot.py):

```python
def process_withdrawal_economical(telegram_id, amount, wallet_address):
    """Экономный withdrawal - создаём только net amount"""
    
    # 1. Проверки
    user = get_user_data(telegram_id)
    balance = user['tama']
    
    if balance < amount:
        return {'error': 'Insufficient balance'}
    
    # 2. Рассчитать fee
    fee = int(amount * 0.05)
    net_amount = amount - fee
    
    # Распределение fee (ВИРТУАЛЬНО!)
    burn_amount = int(fee * 0.60)   # 300
    pool_amount = int(fee * 0.30)   # 150
    team_amount = fee - burn_amount - pool_amount  # 50
    
    # 3. Mint ТОЛЬКО net amount (ЭКОНОМИЯ!)
    result = subprocess.run([
        'spl-token', 'transfer',
        TAMA_MINT,
        str(net_amount),  # ← ТОЛЬКО 9,500!
        wallet_address,
        '--fee-payer', PAYER_KEYPAIR,
        '--owner', PAYER_KEYPAIR,
        '--output', 'json'
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        return {'error': result.stderr}
    
    tx_data = json.loads(result.stdout)
    signature = tx_data.get('signature')
    
    # 4. Обновить базу (списать ВСЮ сумму)
    supabase.table('leaderboard').update({
        'tama': balance - amount,  # ← Списать 10,000
        'total_withdrawn': user.get('total_withdrawn', 0) + net_amount
    }).eq('telegram_id', telegram_id).execute()
    
    # 5. Записать транзакцию
    supabase.table('tama_economy').insert({
        'telegram_id': telegram_id,
        'transaction_type': 'withdrawal',
        'amount': -amount,
        'net_amount': net_amount,
        'fee': fee,
        'burn_amount': burn_amount,  # ← Виртуально!
        'pool_amount': pool_amount,  # ← Виртуально!
        'team_amount': team_amount,  # ← Виртуально!
        'signature': signature,
        'wallet_address': wallet_address,
        'status': 'completed'
    }).execute()
    
    # 6. Обновить глобальную статистику (ВИРТУАЛЬНО!)
    supabase.rpc('update_burn_stats', {
        'burned': burn_amount,
        'recycled': pool_amount
    }).execute()
    
    return {
        'success': True,
        'net_amount': net_amount,
        'signature': signature,
        'burn_amount': burn_amount,
        'pool_amount': pool_amount,
        'team_amount': team_amount
    }
```

---

## 📊 СРАВНЕНИЕ (ЭКОНОМИЯ):

```
SCENARIO: 1000 withdrawals по 10,000 TAMA

БЕЗ ЭКОНОМИИ:
├─ Created: 10,000,000 TAMA
├─ Burned: 300,000 TAMA (реально)
├─ Net: 9,700,000 TAMA
└─ Circulating: 9,700,000 TAMA

СО ЭКОНОМИЕЙ: ✅
├─ Created: 9,500,000 TAMA
├─ Burned: 300,000 TAMA (виртуально)
├─ Net: 9,500,000 TAMA
└─ Circulating: 9,500,000 TAMA

ЭКОНОМИЯ: 500,000 TAMA! (5%)
```

**Почему это важно:**
1. ✅ Меньше токенов создано = меньше инфляция
2. ✅ Circulating supply точнее
3. ✅ Дефляция эффективнее
4. ✅ Цена растёт быстрее

---

## ✅ ГОТОВО К ЗАПУСКУ КОГДА:

- [ ] 1. Mint page работает
- [ ] 2. Withdrawal кнопка в игре
- [ ] 3. Админка с токеномикой
- [ ] 4. Токены распределены
- [ ] 5. Team tokens залочены (vesting)
- [ ] 6. Referral система проверена
- [ ] 7. PHP API запущен (опционально)
- [ ] 8. Withdrawal оптимизирован (экономия)
- [ ] 9. Документация финализирована

---

## 🚀 TIMELINE:

```
СЕЙЧАС → 3 дня:
├─ Доработка frontend (кнопки, UI)
├─ Админка (токеномика, charts)
└─ Тестирование всех функций

День 4-5:
├─ Создать Mainnet кошельки
├─ Mint проектные токены
└─ Setup vesting (Streamflow)

День 6:
├─ Создать Liquidity Pool (Raydium)
├─ Lock liquidity
└─ Запуск!

День 7+:
├─ Маркетинг
├─ Community building
└─ Мониторинг

```

---

**НАЧИНАЕМ!** 🔥

