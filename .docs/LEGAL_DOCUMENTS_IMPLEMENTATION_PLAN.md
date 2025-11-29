# 📋 План внедрения юридических документов

## ✅ ЧТО УЖЕ СДЕЛАНО

1. ✅ Документы созданы (terms.html, privacy.html, disclaimer.html)
2. ✅ Footer на index.html
3. ✅ Footer на whitepaper.html

---

## 🔴 ЧТО НУЖНО СДЕЛАТЬ

### 1. Обновить Telegram бот ⚠️

**Файл:** `bot/bot.py`
**Функция:** `send_welcome()` (строка ~790)

**Добавить в конец welcome_text:**
```python
📄 *Legal Documents:*
• Terms: https://solanatamagotchi.com/terms
• Privacy: https://solanatamagotchi.com/privacy
• Risk Warning: https://solanatamagotchi.com/disclaimer
```

---

### 2. Обновить footer на других страницах ⚠️

**Страницы:**
- [ ] `mint.html` - добавить footer с ссылками
- [ ] `profile.html` - добавить footer с ссылками
- [ ] `tamagotchi-game.html` - добавить footer с ссылками
- [ ] `referral.html` - добавить footer с ссылками

**Шаблон footer:**
```html
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 0.9em;">
    <p>
        <a href="/terms" style="color: #9945FF; text-decoration: none; margin: 0 10px;">Terms</a> |
        <a href="/privacy" style="color: #9945FF; text-decoration: none; margin: 0 10px;">Privacy</a> |
        <a href="/disclaimer" style="color: #9945FF; text-decoration: none; margin: 0 10px;">Risk Warning</a>
    </p>
    <p style="margin-top: 10px; font-size: 0.85em;">© 2024-2025 Solana Tamagotchi. All rights reserved.</p>
</div>
```

---

### 3. Опционально: Модальное окно согласия 💡

**Когда показывать:**
- При первом запуске игры (tamagotchi-game.html)
- При первом подключении кошелька
- При первом выводе токенов

**Где добавить:**
- `tamagotchi-game.html` - в начале страницы
- `mint.html` - перед минтингом NFT

---

## 📊 СТАТУС

### Готово: 2/6
- [x] Документы созданы
- [x] Footer на index.html
- [x] Footer на whitepaper.html
- [ ] Ссылки в Telegram боте
- [ ] Footer на mint.html
- [ ] Footer на profile.html
- [ ] Footer на tamagotchi-game.html
- [ ] Footer на referral.html

---

## 🎯 ПРИОРИТЕТЫ

### 🔴 КРИТИЧНО (сделать СЕЙЧАС):
1. **Telegram бот** - пользователи видят при /start
2. **Footer на mint.html** - важная страница (NFT минтинг)

### 🟡 ВАЖНО:
3. **Footer на других страницах** - profile, game, referral

### 🟢 ОПЦИОНАЛЬНО:
4. **Модальное окно** - дополнительная защита

---

## 🚀 ГОТОВ НАЧАТЬ?

Могу обновить:
1. ✅ Telegram бот (добавить ссылки в welcome)
2. ✅ Footer на всех страницах
3. ✅ Опционально: модальное окно

**Начинаем?** 🎯

