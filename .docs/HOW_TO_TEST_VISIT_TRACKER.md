# 🔍 Как проверить работу счетчика посещений

## 📋 Как работает система

### 1. **Отслеживание на сайте** (`index.html`)
- При загрузке страницы автоматически создается `session_id`
- Собираются данные: URL, referrer, браузер, OS, устройство
- Отправляется POST запрос на `https://api.solanatamagotchi.com/api/track-visit.php`

### 2. **API обработка** (`api/track-visit.php`)
- Получает данные о посещении
- Сохраняет в Supabase таблицу `site_visits`

### 3. **Отображение в админке** (`super-admin.html`)
- Загружает данные из Supabase
- Показывает: общее количество, сегодня, уникальные посетители

---

## ✅ Шаг 1: Проверить, создана ли таблица в Supabase

### Откройте Supabase Dashboard:
```
https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/editor
```

### Проверьте наличие таблицы `site_visits`:
1. В левом меню найдите **Table Editor**
2. Найдите таблицу `site_visits`
3. Если таблицы нет → нужно создать (см. Шаг 2)

---

## 🔧 Шаг 2: Создать таблицу (если не создана)

### Откройте SQL Editor:
```
https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/sql
```

### Скопируйте и выполните SQL:
Откройте файл `.docs/CREATE_SITE_VISITS_TABLE.sql` и выполните весь SQL код.

Или скопируйте отсюда:
```sql
CREATE TABLE IF NOT EXISTS site_visits (
    id BIGSERIAL PRIMARY KEY,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    session_id TEXT,
    is_unique BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_visits_date ON site_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_site_visits_time ON site_visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_site_visits_session ON site_visits(session_id);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON site_visits
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON site_visits
    FOR SELECT
    TO authenticated
    USING (true);

GRANT INSERT ON site_visits TO anon;
GRANT SELECT ON site_visits TO authenticated;
GRANT USAGE ON SEQUENCE site_visits_id_seq TO anon;
```

---

## 🧪 Шаг 3: Проверить работу отслеживания

### Вариант 1: Через консоль браузера

1. **Откройте сайт:**
   ```
   https://solanatamagotchi.com
   ```

2. **Откройте DevTools (F12)**

3. **Перейдите на вкладку Console**

4. **Проверьте сообщения:**
   - Должно быть: `✅ Visit tracked`
   - Если ошибка: `Visit tracking failed (non-critical): ...`

5. **Перейдите на вкладку Network**
   - Найдите запрос к `track-visit.php`
   - Проверьте статус: должен быть `200 OK`
   - Откройте Response: должно быть `{"success":true,"message":"Visit tracked successfully"}`

### Вариант 2: Проверить в Supabase

1. **Откройте Table Editor:**
   ```
   https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/editor/site_visits
   ```

2. **Обновите страницу** (F5)

3. **Проверьте данные:**
   - Должна появиться новая запись
   - Проверьте поля: `page_url`, `device_type`, `browser`, `os`, `session_id`

### Вариант 3: Тестовый запрос к API

**Откройте консоль браузера и выполните:**

```javascript
fetch('https://api.solanatamagotchi.com/api/track-visit.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        page_url: 'https://solanatamagotchi.com/test',
        referrer: 'https://google.com',
        user_agent: navigator.userAgent,
        session_id: 'test_' + Date.now(),
        device_type: 'desktop',
        browser: 'Chrome',
        os: 'Windows'
    })
})
.then(r => r.json())
.then(data => console.log('✅ API Response:', data))
.catch(err => console.error('❌ API Error:', err));
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Visit tracked successfully"
}
```

---

## 🔍 Шаг 4: Проверить отображение в админке

1. **Откройте супер-админку:**
   ```
   https://solanatamagotchi.com/super-admin.html
   ```

2. **Откройте DevTools (F12) → Console**

3. **Проверьте логи:**
   - Должно быть: `✅ Site visits loaded: {total: X, today: Y, ...}`

4. **Проверьте карточки:**
   - **Site Visits** должна показывать число > 0
   - **Unique Visitors** должна показывать число > 0

5. **Если показывает 0:**
   - Проверьте консоль на ошибки
   - Убедитесь, что таблица создана
   - Убедитесь, что есть данные в таблице

---

## 🐛 Возможные проблемы и решения

### Проблема 1: Показывает "0" в админке

**Причины:**
- Таблица `site_visits` не создана
- Нет данных в таблице
- Ошибка RLS (Row Level Security)

**Решение:**
1. Создайте таблицу (Шаг 2)
2. Посетите сайт несколько раз
3. Проверьте данные в Supabase Table Editor
4. Проверьте RLS policies в Supabase

### Проблема 2: Ошибка в консоли "Visit tracking failed"

**Причины:**
- API недоступен
- CORS ошибка
- Ошибка в Supabase

**Решение:**
1. Проверьте, что API доступен: `https://api.solanatamagotchi.com/api/track-visit.php`
2. Проверьте CORS настройки в `api/track-visit.php`
3. Проверьте логи на Render.com (если API там)

### Проблема 3: Данные не сохраняются в Supabase

**Причины:**
- Неправильные права доступа (RLS)
- Неправильный API ключ
- Ошибка в SQL запросе

**Решение:**
1. Проверьте RLS policies (должна быть policy для `anon` INSERT)
2. Проверьте API ключ в `api/track-visit.php`
3. Проверьте логи Supabase: Dashboard → Logs

---

## 📊 Проверка данных в Supabase

### SQL запрос для проверки:

```sql
-- Всего посещений
SELECT COUNT(*) as total_visits FROM site_visits;

-- Посещения сегодня
SELECT COUNT(*) as today_visits 
FROM site_visits 
WHERE visit_date = CURRENT_DATE;

-- Уникальные посетители (по session_id)
SELECT COUNT(DISTINCT session_id) as unique_visitors 
FROM site_visits;

-- Последние 10 посещений
SELECT * FROM site_visits 
ORDER BY visit_time DESC 
LIMIT 10;

-- Статистика по устройствам
SELECT device_type, COUNT(*) as count 
FROM site_visits 
GROUP BY device_type;

-- Статистика по браузерам
SELECT browser, COUNT(*) as count 
FROM site_visits 
GROUP BY browser;
```

---

## ✅ Чеклист проверки

- [ ] Таблица `site_visits` создана в Supabase
- [ ] RLS policies настроены правильно
- [ ] При загрузке `index.html` в консоли есть `✅ Visit tracked`
- [ ] В Network есть запрос к `track-visit.php` со статусом 200
- [ ] В Supabase Table Editor есть новые записи
- [ ] В админке отображаются числа > 0
- [ ] При обновлении админки числа обновляются

---

## 🎯 Быстрый тест

1. Откройте `https://solanatamagotchi.com` в новой вкладке
2. Откройте консоль (F12) → проверьте `✅ Visit tracked`
3. Откройте `https://solanatamagotchi.com/super-admin.html`
4. Нажмите кнопку "🔄 Refresh"
5. Проверьте карточки "Site Visits" и "Unique Visitors"

Если все работает, вы увидите числа > 0! 🎉

