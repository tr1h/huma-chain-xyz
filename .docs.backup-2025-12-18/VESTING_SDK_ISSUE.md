# ⚠️ ПРОБЛЕМА С STREAMFLOW SDK

## ❌ Ошибка: InsufficientFunds

**Проблема:** SDK выдает ошибку `InsufficientFunds`, хотя баланс достаточен (0.3 SOL).

**Возможные причины:**
1. SDK неправильно рассчитывает необходимый баланс для rent exemption
2. Проблема с созданием escrow account
3. Ограничение SDK на devnet

---

## ✅ РЕШЕНИЕ: Использовать веб-интерфейс Streamflow

**Рекомендуется использовать веб-интерфейс вместо SDK:**

1. Открой: https://streamflow.finance
2. Подключи кошелек (Phantom/Solflare) с team wallet
3. Выбери "Create Stream"
4. Введи параметры:
   - **Token:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`
   - **Amount:** `200000000` (200M TAMA)
   - **Recipient:** `AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR`
   - **Start:** через 6 месяцев (2026-05-06)
   - **End:** через 4 года (2029-11-06)
   - **Cliff:** совпадает со start
   - **Cancelable:** false

---

## 📋 ПАРАМЕТРЫ ДЛЯ ВЕБ-ИНТЕРФЕЙСА

```
Cluster: Devnet
Token Address: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
Amount: 200,000,000 TAMA
Recipient: AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR
Start Time: 2026-05-06 (через 6 месяцев)
End Time: 2029-11-06 (через 4 года)
Cliff Time: 2026-05-06 (совпадает со start)
Cliff Amount: 0 TAMA
Period: 1 секунда (linear unlock)
Cancelable: false
```

---

**Веб-интерфейс проще и надежнее для создания vesting stream!** 🚀

