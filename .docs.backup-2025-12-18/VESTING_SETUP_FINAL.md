# 🔒 VESTING SETUP - ФИНАЛЬНАЯ НАСТРОЙКА

## ✅ РЕШЕНИЕ: Стандартный вариант

```
Срок: 4 года
Cliff: 6 месяцев
Unlock: Linear (постепенно)
Cancelable: false (нельзя отменить)
```

---

## 📊 ПАРАМЕТРЫ VESTING

### **Team Tokens (200M TAMA):**

```
Общий срок: 4 года (48 месяцев)
Cliff: 6 месяцев
Всего токенов: 200,000,000 TAMA

Расписание:
├─ Месяц 0-6:   0 TAMA ❌ (CLIFF - полная блокировка)
├─ Месяц 7-48:  200M TAMA ✅ (постепенная разблокировка)
│  ├─ Ежемесячно: ~4.76M TAMA
│  └─ Linear unlock (равномерно)
└─ Месяц 48:    200M TAMA ✅ (полностью разблокировано)
```

---

## 🚀 УСТАНОВКА STREAMFLOW

### **Шаг 1: Установить Streamflow CLI**

```bash
# Проверить что Node.js установлен
node --version

# Установить Streamflow CLI глобально
npm install -g @streamflow/cli

# Проверить установку
streamflow --version
```

---

## 🧪 ТЕСТИРОВАНИЕ НА DEVNET

### **Шаг 2: Создать vesting stream на DEVNET (тест)**

```bash
# Перейти в директорию проекта
cd C:\goooog

# Создать vesting stream на DEVNET
streamflow create-stream \
  --cluster devnet \
  --token Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --amount 200000000 \
  --recipient AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR \
  --start-time $(date +%s) \
  --end-time $(($(date +%s) + 126144000)) \
  --cliff-time $(($(date +%s) + 15552000)) \
  --cancelable false \
  --keypair C:\goooog\team-wallet-keypair.json

# Параметры:
# --cluster: devnet (для тестирования)
# --token: TAMA mint address (devnet)
# --amount: 200,000,000 TAMA
# --recipient: Team wallet address
# --start-time: Текущее время (Unix timestamp)
# --end-time: +126,144,000 сек = 4 года
# --cliff-time: +15,552,000 сек = 6 месяцев
# --cancelable: false (нельзя отменить!)
# --keypair: Путь к team wallet keypair
```

### **Шаг 3: Проверить stream на DEVNET**

```bash
# Список всех streams для team wallet
streamflow list-streams \
  --cluster devnet \
  --owner AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR

# Детали конкретного stream (замени STREAM_ID)
streamflow get-stream \
  --cluster devnet \
  --id STREAM_ID

# Проверить на Solana Explorer
# https://explorer.solana.com/address/STREAM_ID?cluster=devnet
```

---

## 🌐 MAINNET SETUP (когда готов)

### **Шаг 4: Создать vesting stream на MAINNET**

```bash
# ВАЖНО: Проверь все параметры перед mainnet!

# Создать vesting stream на MAINNET
streamflow create-stream \
  --cluster mainnet-beta \
  --token TAMA_MINT_ADDRESS_MAINNET \
  --amount 200000000 \
  --recipient TEAM_WALLET_ADDRESS_MAINNET \
  --start-time $(date +%s) \
  --end-time $(($(date +%s) + 126144000)) \
  --cliff-time $(($(date +%s) + 15552000)) \
  --cancelable false \
  --keypair C:\goooog\team-wallet-keypair.json

# Параметры (те же что на devnet):
# --cluster: mainnet-beta (для production)
# --token: TAMA mint address (mainnet)
# --amount: 200,000,000 TAMA
# --recipient: Team wallet address (mainnet)
# --start-time: Текущее время (Unix timestamp)
# --end-time: +126,144,000 сек = 4 года
# --cliff-time: +15,552,000 сек = 6 месяцев
# --cancelable: false (нельзя отменить!)
# --keypair: Путь к team wallet keypair
```

---

## 📋 ДЕТАЛЬНОЕ РАСПИСАНИЕ

### **Расписание разблокировки (200M TAMA):**

```
┌─────────────────────────────────────────────────┐
│ CLIFF PERIOD (Месяц 0-6)                        │
│ ├─ Разблокировано: 0 TAMA ❌                    │
│ ├─ Заблокировано: 200M TAMA                     │
│ └─ Статус: 🔒 ПОЛНАЯ БЛОКИРОВКА                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VESTING PERIOD (Месяц 7-48)                     │
│ ├─ Начало: Месяц 7                               │
│ ├─ Конец: Месяц 48                               │
│ ├─ Осталось: 42 месяца                          │
│ ├─ Ежемесячно: ~4.76M TAMA                      │
│ └─ Linear unlock (равномерно)                    │
└─────────────────────────────────────────────────┘

Детали по периодам:
├─ Месяц 0-6:   0 TAMA (cliff)
├─ Месяц 7:     ~4.76M TAMA ✅ (первая разблокировка!)
├─ Месяц 8:     ~9.52M TAMA ✅
├─ Месяц 9:     ~14.28M TAMA ✅
├─ Месяц 12:    ~23.81M TAMA ✅ (после 1 года)
├─ Месяц 18:    ~52.38M TAMA ✅ (после 1.5 лет)
├─ Месяц 24:    ~80.95M TAMA ✅ (после 2 лет)
├─ Месяц 30:    ~109.52M TAMA ✅ (после 2.5 лет)
├─ Месяц 36:    ~138.1M TAMA ✅ (после 3 лет)
├─ Месяц 42:    ~166.67M TAMA ✅ (после 3.5 лет)
└─ Месяц 48:    200M TAMA ✅ (полностью разблокировано)
```

---

## 🔍 ПРОВЕРКА И МОНИТОРИНГ

### **Как проверить что stream создан:**

```bash
# 1. Список streams
streamflow list-streams \
  --cluster devnet \
  --owner AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR

# 2. Детали stream
streamflow get-stream \
  --cluster devnet \
  --id STREAM_ID

# 3. Проверить на Explorer
# https://explorer.solana.com/address/STREAM_ID?cluster=devnet
```

### **Что проверить:**

```
✅ Stream создан успешно
✅ Amount: 200,000,000 TAMA
✅ Start time: Текущее время
✅ End time: +4 года
✅ Cliff time: +6 месяцев
✅ Cancelable: false
✅ Recipient: Team wallet address
```

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

### **Перед созданием stream:**

```
1. ✅ Убедись что team wallet имеет достаточно SOL для транзакции
2. ✅ Проверь что token account существует
3. ✅ Проверь все адреса (mint, recipient)
4. ✅ Убедись что cancelable: false (нельзя отменить!)
5. ✅ Проверь даты (start, end, cliff)
```

### **После создания stream:**

```
1. ✅ Сохрани STREAM_ID
2. ✅ Проверь на Explorer
3. ✅ Опубликуй адрес stream для прозрачности
4. ✅ Добавь в документацию
5. ✅ Сообщи сообществу
```

---

## 📊 СРАВНЕНИЕ С ДРУГИМИ ПРОЕКТАМИ

| Параметр | Jupiter | Mango | **Наш проект** |
|----------|---------|-------|----------------|
| **Срок** | 4 года | 4 года | **4 года** ✅ |
| **Cliff** | 6 мес | 6 мес | **6 мес** ✅ |
| **Unlock** | Linear | Linear | **Linear** ✅ |
| **Cancelable** | false | false | **false** ✅ |

**Вывод:** Наш вариант полностью соответствует лучшим практикам! ✅

---

## 🎯 ПЛАН ДЕЙСТВИЙ

### **СЕЙЧАС (Devnet):**

```
1. ⬜ Установить Streamflow CLI
2. ⬜ Создать test stream на devnet
3. ⬜ Проверить что всё работает
4. ⬜ Понять как работает разблокировка
5. ⬜ Показать сообществу (прозрачность)
```

### **ПЕРЕД MAINNET:**

```
1. ⬜ Подготовить mainnet адреса
2. ⬜ Проверить все параметры
3. ⬜ Создать stream на mainnet
4. ⬜ Опубликовать stream address
5. ⬜ Добавить в документацию
```

---

## 💡 КОМАНДЫ ДЛЯ КОПИРОВАНИЯ

### **Windows PowerShell (для devnet):**

```powershell
# Установить Streamflow CLI
npm install -g @streamflow/cli

# Создать vesting stream на DEVNET
$startTime = [int][double]::Parse((Get-Date -UFormat %s))
$endTime = $startTime + 126144000  # +4 года
$cliffTime = $startTime + 15552000  # +6 месяцев

streamflow create-stream `
  --cluster devnet `
  --token Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY `
  --amount 200000000 `
  --recipient AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR `
  --start-time $startTime `
  --end-time $endTime `
  --cliff-time $cliffTime `
  --cancelable false `
  --keypair C:\goooog\team-wallet-keypair.json
```

### **Linux/Mac (для devnet):**

```bash
# Установить Streamflow CLI
npm install -g @streamflow/cli

# Создать vesting stream на DEVNET
streamflow create-stream \
  --cluster devnet \
  --token Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --amount 200000000 \
  --recipient AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR \
  --start-time $(date +%s) \
  --end-time $(($(date +%s) + 126144000)) \
  --cliff-time $(($(date +%s) + 15552000)) \
  --cancelable false \
  --keypair ~/goooog/team-wallet-keypair.json
```

---

## ✅ ИТОГО

### **Финальная конфигурация:**

```
✅ Срок: 4 года
✅ Cliff: 6 месяцев
✅ Unlock: Linear
✅ Cancelable: false
✅ Метод: Streamflow
✅ Тестирование: Devnet
✅ Production: Mainnet (когда готов)
```

### **Следующие шаги:**

```
1. Установить Streamflow CLI
2. Протестировать на devnet
3. Проверить что всё работает
4. Применить на mainnet перед запуском
```

---

**Готово! Стандартный вариант настроен!** 🚀

