# 🔌 API ДЛЯ РЕФЕРАЛЬНЫХ НАСТРОЕК

## ✅ СТАТУС: API РАБОТАЕТ!

---

## 📡 ENDPOINT:

### **URL:** `https://api.solanatamagotchi.com/api/referral-settings.php`

---

## 🔧 МЕТОДЫ:

### **1. GET - Получить настройки**

```bash
GET /api/referral-settings.php

Response:
{
  "success": true,
  "settings": {
    "referral_reward": {
      "value": "1000",
      "description": "TAMA reward for each referral (Level 1 only)",
      "updated_at": "2025-11-29T21:00:00Z"
    },
    "milestone_1": {
      "value": "500",
      "description": "TAMA bonus for 1 referral",
      "updated_at": "2025-11-29T21:00:00Z"
    },
    "milestone_3": {
      "value": "750",
      "description": "TAMA bonus for 3 referrals",
      "updated_at": "2025-11-29T21:00:00Z"
    },
    ...
  }
}
```

**Используется:**
- ✅ Админка (`admin-referrals.html`) для загрузки настроек
- ✅ Бот (`bot.py`) через функцию `get_referral_settings()`

---

### **2. POST - Обновить настройки**

```bash
POST /api/referral-settings.php
Content-Type: application/json

{
  "settings": {
    "referral_reward": "1500",
    "milestone_1": "600",
    "milestone_3": "800",
    "milestone_5": "1200",
    "milestone_10": "3500",
    "milestone_15": "6000",
    "milestone_25": "12000",
    "milestone_50": "35000",
    "milestone_75": "60000",
    "milestone_100": "120000",
    "milestone_150": "180000",
    "milestone_250": "300000",
    "milestone_500": "600000",
    "milestone_1000": "1200000"
  },
  "updated_by": "admin"
}

Response:
{
  "success": true,
  "message": "Settings updated successfully",
  "updated": [
    "referral_reward",
    "milestone_1",
    "milestone_3",
    ...
  ]
}
```

**Используется:**
- ✅ Админка (`admin-referrals.html`) для сохранения настроек

---

## 🗄️ БАЗА ДАННЫХ:

### **Таблица:** `referral_settings`

```sql
CREATE TABLE referral_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

### **Записи:**
- `referral_reward` - TAMA за каждого реферала (Level 1)
- `milestone_1` - бонус за 1 реферала
- `milestone_3` - бонус за 3 реферала
- `milestone_5` - бонус за 5 рефералов
- ... и так далее для всех 13 милстоунов

---

## 🔄 КАК РАБОТАЕТ:

### **1. Админка сохраняет настройки:**
```javascript
// admin-referrals.html
async function saveSettings() {
    const settings = {
        referral_reward: document.getElementById('setting-referral_reward').value,
        milestone_1: document.getElementById('setting-milestone_1').value,
        ...
    };
    
    const response = await fetch('https://api.solanatamagotchi.com/api/referral-settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, updated_by: 'admin' })
    });
}
```

### **2. API сохраняет в БД:**
```php
// api/referral-settings.php
$stmt = $pdo->prepare("
    INSERT INTO referral_settings (setting_key, setting_value, description, updated_by, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
        setting_value = EXCLUDED.setting_value,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP
");
```

### **3. Бот читает из БД:**
```python
# bot/bot.py
def get_referral_settings():
    response = supabase.table('referral_settings').select('*').execute()
    settings = {}
    for s in response.data:
        settings[s['setting_key']] = int(s['setting_value'])
    return settings
```

---

## ✅ ПОДТВЕРЖДЕНИЕ:

**ДА, API РАБОТАЕТ:**
- ✅ Админка может читать настройки через GET
- ✅ Админка может сохранять настройки через POST
- ✅ Бот читает настройки из БД
- ✅ Все значения настраиваемые через админку
- ✅ Изменения применяются сразу (бот читает при каждом начислении)

---

## 🎯 ИТОГО:

**Полный цикл:**
1. Админ меняет настройки в админке
2. Админка отправляет POST запрос в API
3. API сохраняет в таблицу `referral_settings`
4. Бот читает настройки при начислении наград
5. Новые значения применяются автоматически

**Все работает через API! ✅**

