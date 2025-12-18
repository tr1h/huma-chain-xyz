# 📊 РАСЧЕТЫ ТОКЕНОМИКИ - КАК ПРАВИЛЬНО?

## ❓ ВОПРОС: "От пула или от общего количества? Как правильно?"

**ОТВЕТ:** Расчеты должны быть от **P2E POOL**, а не от общего количества! ✅

---

## 🔍 ТЕКУЩИЕ РАСЧЕТЫ (ЧТО СЕЙЧАС)

### Проблемы в `admin-tokenomics.html`:

```javascript
// ❌ ПРОБЛЕМА 1: Daily Pool - статичное значение
<div class="big-number">2,222,222</div>  // ← Захардкожено!

// ❌ ПРОБЛЕМА 2: Circulating Supply - от всех выводов
const circulating = withdrawals.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
// ← Считает от всех выводов, а не от P2E Pool!

// ❌ ПРОБЛЕМА 3: Burned - неправильный расчет
const burned = Math.floor(circulating * 0.05 * 0.60);
// ← Считает от circulating, а должно быть от суммы всех fee!

// ❌ ПРОБЛЕМА 4: Halving - захардкоженная дата
const launchDate = new Date('2025-11-01');  // ← Статичная дата!
```

---

## ✅ ПРАВИЛЬНЫЕ РАСЧЕТЫ (КАК ДОЛЖНО БЫТЬ)

### 1. DAILY POOL (от P2E Pool периода)

```javascript
// ПРАВИЛЬНО: Рассчитать от текущего периода
function calculateDailyPool() {
    const launchDate = new Date('2025-11-01');  // Дата запуска
    const now = new Date();
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));
    
    // Определить текущий период
    let currentPeriod = null;
    let dailyPool = 0;
    
    if (daysSinceLaunch < 180) {
        // Year 1 H1 (первые 180 дней)
        currentPeriod = 'Year 1 H1';
        dailyPool = 400000000 / 180;  // 2,222,222 TAMA/день
    } else if (daysSinceLaunch < 360) {
        // Year 1 H2 (дни 181-360)
        currentPeriod = 'Year 1 H2';
        dailyPool = 200000000 / 180;  // 1,111,111 TAMA/день
    } else if (daysSinceLaunch < 540) {
        // Year 2 H1 (дни 361-540)
        currentPeriod = 'Year 2 H1';
        dailyPool = 100000000 / 180;  // 555,556 TAMA/день
    } else if (daysSinceLaunch < 720) {
        // Year 2 H2 (дни 541-720)
        currentPeriod = 'Year 2 H2';
        dailyPool = 50000000 / 180;   // 277,778 TAMA/день
    }
    // ... и так далее
    
    return {
        period: currentPeriod,
        dailyPool: Math.floor(dailyPool),
        daysInPeriod: daysSinceLaunch % 180,
        daysLeftInPeriod: 180 - (daysSinceLaunch % 180)
    };
}
```

### 2. P2E POOL REMAINING (остаток пула)

```javascript
// ПРАВИЛЬНО: Рассчитать остаток P2E Pool
async function calculateP2EPoolRemaining() {
    const launchDate = new Date('2025-11-01');
    const now = new Date();
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));
    
    // Начальный P2E Pool для периода
    let initialPool = 0;
    let dailyPool = 0;
    
    if (daysSinceLaunch < 180) {
        initialPool = 400000000;  // Year 1 H1
        dailyPool = 2222222;
    } else if (daysSinceLaunch < 360) {
        initialPool = 200000000;  // Year 1 H2
        dailyPool = 1111111;
    }
    // ... и так далее
    
    // Рассчитать сколько уже распределено
    const daysInPeriod = daysSinceLaunch % 180;
    const distributed = daysInPeriod * dailyPool;
    
    // Остаток пула
    const remaining = initialPool - distributed;
    
    return {
        initialPool: initialPool,
        distributed: distributed,
        remaining: Math.max(0, remaining),
        dailyPool: dailyPool
    };
}
```

### 3. CIRCULATING SUPPLY (от P2E Pool)

```javascript
// ПРАВИЛЬНО: Считать от P2E Pool, а не от всех выводов
async function calculateCirculatingSupply() {
    // Вариант 1: От P2E Pool (правильно)
    const p2ePoolRemaining = await calculateP2EPoolRemaining();
    const circulating = p2ePoolRemaining.initialPool - p2ePoolRemaining.remaining;
    
    // ИЛИ Вариант 2: От суммы всех выводов (если есть таблица)
    const withdrawals = await getWithdrawals();
    const circulating = withdrawals.reduce((sum, tx) => sum + (tx.amount_sent || 0), 0);
    
    return circulating;
}
```

### 4. BURNED (от суммы всех fee)

```javascript
// ПРАВИЛЬНО: Считать от суммы всех fee, а не от circulating
async function calculateBurned() {
    // Получить все withdrawals с fee
    const withdrawals = await getWithdrawals();
    
    // Сумма всех fee
    const totalFees = withdrawals.reduce((sum, tx) => {
        const fee = tx.fee || Math.floor((tx.amount || 0) * 0.05);
        return sum + fee;
    }, 0);
    
    // 60% от fee сжигается
    const burned = Math.floor(totalFees * 0.60);
    
    return burned;
}
```

### 5. HALVING COUNTDOWN (динамический расчет)

```javascript
// ПРАВИЛЬНО: Рассчитать от текущего периода
function calculateHalvingCountdown() {
    const launchDate = new Date('2025-11-01');
    const now = new Date();
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));
    
    // Определить текущий период и следующий халвинг
    const daysInPeriod = daysSinceLaunch % 180;
    const daysLeftInPeriod = 180 - daysInPeriod;
    
    // Определить период
    const periodNumber = Math.floor(daysSinceLaunch / 180);
    const currentPeriod = getPeriodName(periodNumber);
    const nextPeriod = getPeriodName(periodNumber + 1);
    
    return {
        daysLeft: daysLeftInPeriod,
        currentPeriod: currentPeriod,
        nextPeriod: nextPeriod,
        progress: (daysInPeriod / 180) * 100
    };
}

function getPeriodName(periodNumber) {
    const periods = [
        'Year 1 H1', 'Year 1 H2',
        'Year 2 H1', 'Year 2 H2',
        'Year 3 H1', 'Year 3 H2',
        'Year 4 H1', 'Year 4 H2'
    ];
    return periods[periodNumber] || 'End';
}
```

---

## 📊 ПРАВИЛЬНАЯ СХЕМА РАСЧЕТОВ

### От чего считать:

```
┌─────────────────────────────────────────┐
│  P2E POOL (400M для Year 1 H1)           │
├─────────────────────────────────────────┤
│  Начальный пул: 400,000,000 TAMA        │
│  Daily Pool: 2,222,222 TAMA/день        │
│  Дней прошло: 10 дней                   │
│  Распределено: 22,222,220 TAMA          │
│  Остаток: 377,777,780 TAMA              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  ВЫВОДЫ ИГРОКОВ                          │
├─────────────────────────────────────────┤
│  Всего выведено: 10,000,000 TAMA        │
│  (из распределённых 22,222,220)         │
│                                          │
│  Fee (5%): 500,000 TAMA                 │
│  ├─ Burned (60%): 300,000 TAMA          │
│  ├─ Pool Recycling (30%): 150,000 TAMA  │
│  └─ Team (10%): 50,000 TAMA             │
└─────────────────────────────────────────┘
```

### Расчеты:

```
CIRCULATING SUPPLY:
├─ От P2E Pool: 400M - 377.78M = 22.22M (распределено)
├─ ИЛИ от выводов: 10M (реально выведено)
└─ Используем: 10M (реально выведено) ✅

BURNED:
├─ От суммы всех fee: 500,000 TAMA
├─ 60% burned: 300,000 TAMA
└─ Используем: 300,000 TAMA ✅

DAILY POOL:
├─ От текущего периода: Year 1 H1
├─ Daily Pool: 2,222,222 TAMA/день
└─ Используем: 2,222,222 TAMA/день ✅

HALVING:
├─ От текущего периода: Day 10 из 180
├─ Дней до халвинга: 170 дней
└─ Используем: 170 дней ✅
```

---

## 🔧 ИСПРАВЛЕНИЯ ДЛЯ admin-tokenomics.html

### 1. Динамический Daily Pool:

```javascript
// ЗАМЕНИТЬ:
<div class="big-number">2,222,222</div>  // ← Статичное

// НА:
<div class="big-number" id="daily-pool">2,222,222</div>
<small id="daily-pool-period">Year 1 H1 (400M / 180 days)</small>

// И добавить функцию:
async function updateDailyPool() {
    const poolInfo = calculateP2EPoolRemaining();
    document.getElementById('daily-pool').textContent = poolInfo.dailyPool.toLocaleString();
    document.getElementById('daily-pool-period').textContent = 
        `${poolInfo.period} (${poolInfo.remaining.toLocaleString()} TAMA remaining)`;
}
```

### 2. Правильный Circulating Supply:

```javascript
// ЗАМЕНИТЬ:
const circulating = withdrawals.reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
// ← Считает от всех amount (неправильно!)

// НА:
const circulating = withdrawals.reduce((sum, tx) => sum + (tx.amount_sent || tx.net_amount || 0), 0);
// ← Считает от amount_sent (правильно!)
```

### 3. Правильный Burned:

```javascript
// ЗАМЕНИТЬ:
const burned = Math.floor(circulating * 0.05 * 0.60);
// ← Неправильно! Считает от circulating

// НА:
const totalFees = withdrawals.reduce((sum, tx) => {
    const fee = tx.fee || Math.floor((tx.amount || 0) * 0.05);
    return sum + fee;
}, 0);
const burned = Math.floor(totalFees * 0.60);
// ← Правильно! Считает от суммы всех fee
```

### 4. Динамический Halving:

```javascript
// ЗАМЕНИТЬ:
const launchDate = new Date('2025-11-01');  // ← Статичная дата
const halvingDate = new Date(launchDate);
halvingDate.setDate(halvingDate.getDate() + 180);

// НА:
function calculateHalvingCountdown() {
    const launchDate = new Date('2025-11-01');
    const now = new Date();
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));
    
    const daysInPeriod = daysSinceLaunch % 180;
    const daysLeft = 180 - daysInPeriod;
    const progress = (daysInPeriod / 180) * 100;
    
    // Определить период
    const periodNumber = Math.floor(daysSinceLaunch / 180);
    const periods = ['Year 1 H1', 'Year 1 H2', 'Year 2 H1', 'Year 2 H2', ...];
    const currentPeriod = periods[periodNumber] || 'End';
    const nextPeriod = periods[periodNumber + 1] || 'End';
    
    return {
        daysLeft: daysLeft,
        currentPeriod: currentPeriod,
        nextPeriod: nextPeriod,
        progress: progress
    };
}
```

---

## 📋 ИТОГОВАЯ ТАБЛИЦА РАСЧЕТОВ

| Метрика | Откуда считать | Формула |
|---------|----------------|---------|
| **Daily Pool** | От текущего периода P2E Pool | `Period Pool / 180 дней` |
| **P2E Pool Remaining** | От начального пула периода | `Initial Pool - (Days × Daily Pool)` |
| **Circulating Supply** | От суммы всех выводов | `SUM(amount_sent)` из withdrawals |
| **Burned** | От суммы всех fee | `SUM(fee) × 0.60` |
| **Halving Countdown** | От текущего периода | `180 - (daysSinceLaunch % 180)` |

---

## ✅ ПРАВИЛЬНЫЕ РАСЧЕТЫ

### Все расчеты должны быть от P2E Pool периода:

```
Year 1 H1 (дни 0-180):
├─ Initial Pool: 400,000,000 TAMA
├─ Daily Pool: 2,222,222 TAMA/день
├─ Day 10: Distributed = 22,222,220 TAMA
├─ Remaining = 377,777,780 TAMA
└─ Halving через: 170 дней

Year 1 H2 (дни 181-360):
├─ Initial Pool: 200,000,000 TAMA (ХАЛВИНГ!)
├─ Daily Pool: 1,111,111 TAMA/день
├─ Day 190: Distributed = 11,111,110 TAMA
├─ Remaining = 188,888,890 TAMA
└─ Halving через: 170 дней
```

---

**Все расчеты должны быть от P2E Pool, а не от общего количества!** ✅

