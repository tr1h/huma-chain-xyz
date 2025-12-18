# 🔧 Railway Env Vars Troubleshooting

## ❌ Проблема

```
⚠️ Environment variable not set: SOLANA_PAYER_KEYPAIR
⚠️ Environment variable not set: SOLANA_P2E_POOL_KEYPAIR
```

Но ты добавил их в Railway!

---

## 🔍 Возможные Причины

### **1. Переменные добавлены в неправильный Service** ⚠️

**Railway имеет:**
- Project-level variables (для всех services)
- Service-level variables (только для конкретного service)

**Проверь:**
1. Railway → huma-chain-xyz-production
2. Click на **service** (huma-chain-xyz)
3. Variables tab → должны быть там!

**НЕ в:**
- Project Settings → Variables (это для всех services)
- Другой service

---

### **2. Переменные добавлены, но сервис не перезапустился** ⚠️

**Решение:**
1. Railway → Service → Variables
2. Убедись что переменные есть
3. **Manually redeploy:**
   - Deployments tab
   - Click "Redeploy" на последнем deployment

---

### **3. Неправильное имя переменной** ⚠️

**Правильные имена (ТОЧНО!):**
```
SOLANA_PAYER_KEYPAIR
SOLANA_P2E_POOL_KEYPAIR
```

**НЕправильные (не работают):**
```
SOLANA_PAYER_KEYPAIR_PATH  ❌
SOLANA_P2E_POOL_KEYPAIR_PATH  ❌
PAYER_KEYPAIR  ❌
P2E_POOL_KEYPAIR  ❌
```

---

### **4. Значение пустое или неправильное** ⚠️

**Правильный формат:**
```
[132,174,181,187,188,192,53,70,...]
```

**НЕправильные:**
```
"[132,174,...]"  ❌ (с кавычками)
{132,174,...}  ❌ (фигурные скобки)
132,174,...  ❌ (без квадратных скобок)
```

---

## ✅ Пошаговая Проверка

### **Step 1: Проверь Service Variables**

1. Railway → huma-chain-xyz-production
2. Click на **service** (huma-chain-xyz)
3. **Variables** tab (НЕ Settings → Variables!)
4. Должны быть:
   - `SOLANA_PAYER_KEYPAIR`
   - `SOLANA_P2E_POOL_KEYPAIR`

**Если НЕТ:**
- Добавь их здесь (в service, не в project!)

---

### **Step 2: Проверь Имена**

**Должны быть ТОЧНО:**
```
SOLANA_PAYER_KEYPAIR
SOLANA_P2E_POOL_KEYPAIR
```

**Без:**
- `_PATH` в конце
- Пробелов
- Кавычек в имени

---

### **Step 3: Проверь Значения**

**Правильный формат:**
```
[132,174,181,187,188,192,53,70,122,249,71,160,37,20,151,37,170,82,176,155,105,125,90,188,242,41,14,51,174,216,202,38,116,216,231,253,22,229,159,76,176,93,181,187,1,186,6,106,214,28,246,88,142,42,28,91,206,159,15,23,217,18,54,153]
```

**Проверь:**
- Начинается с `[`
- Заканчивается на `]`
- Нет кавычек вокруг
- Нет пробелов между числами (кроме запятых)

---

### **Step 4: Redeploy Service**

**После добавления/изменения:**

1. Railway → Service → Deployments
2. Click **"Redeploy"** на последнем deployment
3. Или: Settings → Redeploy

**Подожди ~1-2 минуты** для перезапуска.

---

### **Step 5: Проверь Logs**

**После redeploy, проверь logs:**

**Должно быть:**
```
✅ Keypair loaded: /app/payer-keypair.json
✅ Keypair loaded: /app/p2e-pool-keypair.json
```

**Если все еще:**
```
⚠️ Environment variable not set: SOLANA_PAYER_KEYPAIR
```

→ Переменные все еще не видны. Проверь Step 1-3.

---

## 🎯 Quick Fix Checklist

- [ ] Variables добавлены в **Service** (не Project)
- [ ] Имена ТОЧНО: `SOLANA_PAYER_KEYPAIR` и `SOLANA_P2E_POOL_KEYPAIR`
- [ ] Значения начинаются с `[` и заканчиваются на `]`
- [ ] Нет кавычек вокруг значений
- [ ] Service redeployed после добавления
- [ ] Logs показывают "Keypair loaded" (не "not set")

---

## 📸 Визуальная Проверка

**Правильно:**
```
Railway Dashboard
  ↓
huma-chain-xyz-production (Project)
  ↓
huma-chain-xyz (Service) ← CLICK HERE!
  ↓
Variables Tab ← ADD HERE!
  ↓
SOLANA_PAYER_KEYPAIR = [132,174,...]
SOLANA_P2E_POOL_KEYPAIR = [16,135,...]
```

**НЕправильно:**
```
Railway Dashboard
  ↓
huma-chain-xyz-production (Project)
  ↓
Settings → Variables ← НЕ ЗДЕСЬ!
```

---

## 🔄 Если Все Еще Не Работает

### **Option 1: Удалить и Добавить Заново**

1. Railway → Service → Variables
2. Удали `SOLANA_PAYER_KEYPAIR` и `SOLANA_P2E_POOL_KEYPAIR`
3. Добавь их заново (скопируй значения точно)
4. Redeploy

### **Option 2: Проверь Railway Logs**

Railway → Service → Logs

Ищи:
- `Environment variable not set` → переменные не видны
- `Keypair loaded` → переменные видны!

### **Option 3: Test API**

```bash
curl https://huma-chain-xyz-production.up.railway.app/api/tama/stats
```

Если работает → service работает, но keypairs не загружены.

---

## ✅ Success Indicators

**В Railway Logs должно быть:**
```
✅ Keypair loaded: /app/payer-keypair.json
✅ Keypair loaded: /app/p2e-pool-keypair.json
```

**НЕ должно быть:**
```
⚠️ Environment variable not set: SOLANA_PAYER_KEYPAIR
⚠️ Environment variable not set: SOLANA_P2E_POOL_KEYPAIR
```

---

## 💡 Частая Ошибка

**Добавляют в Project Settings вместо Service Variables!**

**Правильно:**
- Service → Variables tab

**Неправильно:**
- Project Settings → Variables

---

**Проверь еще раз и скажи что видишь!** 🔍

