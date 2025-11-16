# ⚠️ Metaplex SDK CDN Issue

## Проблема

Metaplex JS SDK **НЕ РАБОТАЕТ** через CDN (unpkg/jsdelivr), потому что:
1. Требует ES modules или bundling
2. Имеет множество зависимостей
3. Не экспортируется как UMD bundle

## Решение

### Вариант 1: Использовать Backend API (РЕКОМЕНДУЕТСЯ)

Создать PHP/Node.js endpoint, который использует Metaplex SDK на сервере:

```php
// api/mint-nft-onchain.php
// Использовать Solana PHP SDK или вызывать Node.js скрипт
```

### Вариант 2: Использовать Bundler (Webpack/Vite)

```bash
npm install @metaplex-foundation/js @solana/web3.js
# Собрать bundle с webpack/vite
```

### Вариант 3: Использовать Metaplex API напрямую (ограниченно)

Можно использовать Metaplex RPC endpoints, но это сложнее.

---

## Текущее решение: Off-chain NFT + Backend Mint (позже)

**Сейчас:**
- ✅ NFT создаются в базе данных (off-chain)
- ✅ Работает earning boost
- ✅ Можно продать/передать через админку

**Позже (для on-chain):**
- Создать backend endpoint для минта
- Использовать Metaplex SDK на сервере
- Обновить `nft_mint_address` после минта





