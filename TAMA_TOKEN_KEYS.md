# 🔑 TAMA Token - Приватные ключи и конфигурация

## ⚠️ **ВАЖНО - БЕЗОПАСНОСТЬ:**
Этот файл содержит приватные ключи! **НЕ ПУБЛИКУЙ ЕГО В ОТКРЫТОМ РЕПО!**

---

## 📋 **Основная информация:**

### **TAMA Token (SPL Token):**
```json
{
  "name": "Solana Tamagotchi",
  "symbol": "TAMA",
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "decimals": 9,
  "supply": "1,000,000,000 TAMA",
  "network": "devnet"
}
```

**Explorer:** https://explorer.solana.com/address/Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY?cluster=devnet

---

## 🔐 **Приватные ключи:**

### **1. TAMA Mint Authority Keypair:**
- **Файл:** `tama-mint-keypair.json`
- **Публичный адрес:** `8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi`
- **Назначение:** Управление минтом TAMA токенов (создание новых токенов)
- **Права:** 
  - Mint Authority (может создавать новые TAMA)
  - Freeze Authority (может замораживать/размораживать токены)

**⚠️ Где хранится:**
```
C:\goooog\tama-mint-keypair.json
```

**Использование:**
```javascript
const fs = require('fs');
const keypair = JSON.parse(fs.readFileSync('tama-mint-keypair.json'));
const mintAuthority = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(keypair));
```

---

### **2. Payer Keypair:**
- **Файл:** `payer-keypair.json`
- **Публичный адрес:** (можно вычислить из keypair)
- **Назначение:** Оплата транзакций (gas fees) на Solana
- **Права:** Только оплата комиссий, не имеет прав на минт

**⚠️ Где хранится:**
```
C:\goooog\payer-keypair.json
```

**Использование:**
```javascript
const payerKeypair = JSON.parse(fs.readFileSync('payer-keypair.json'));
const payer = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(payerKeypair));
```

---

## 🛠️ **Как использовать ключи:**

### **Вариант 1: В Node.js (локальный сервер):**

```javascript
const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');

// Загрузить mint authority
const mintKeypair = JSON.parse(fs.readFileSync('./tama-mint-keypair.json'));
const mintAuthority = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(mintKeypair));

// Загрузить payer
const payerKeypair = JSON.parse(fs.readFileSync('./payer-keypair.json'));
const payer = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(payerKeypair));

// Подключение к Solana Devnet
const connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');

// Минт новых TAMA токенов
const { mintTo } = require('@solana/spl-token');
const mintAddress = new solanaWeb3.PublicKey('Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');

async function mintTAMA(toWallet, amount) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintAddress,
        toWallet
    );
    
    const signature = await mintTo(
        connection,
        payer,
        mintAddress,
        tokenAccount.address,
        mintAuthority,
        amount * 1e9 // 9 decimals
    );
    
    console.log('✅ Minted TAMA:', signature);
}
```

---

### **Вариант 2: В Railway API (production):**

**⚠️ НЕ ПУБЛИКУЙ КЛЮЧИ НАПРЯМУЮ!**

Используй **Environment Variables** в Railway:

1. В Railway Dashboard → Project → Variables
2. Добавь:
   ```
   TAMA_MINT_KEYPAIR=[202,234,166,117,253,97,126,78,70,53,200,78,58,138,132,186,116,212,75,127,8,56,143,49,102,250,54,211,149,116,31,187,99,145,153,245,255,205,179,253,116,180,185,71,33,235,67,196,204,245,250,163,182,49,43,53,240,102,169,138,123,197,220,252]
   
   PAYER_KEYPAIR=[132,174,181,187,188,192,53,70,122,249,71,160,37,20,151,37,170,82,176,155,105,125,90,188,242,41,14,51,174,216,202,38,116,216,231,253,22,229,159,76,176,93,181,187,1,186,6,106,214,28,246,88,142,42,28,91,206,159,15,23,217,18,54,153]
   ```

3. В коде API:
```javascript
const mintKeypair = JSON.parse(process.env.TAMA_MINT_KEYPAIR);
const mintAuthority = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(mintKeypair));
```

---

## 🎯 **Как получить публичный адрес из keypair:**

```javascript
const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');

const keypair = JSON.parse(fs.readFileSync('./tama-mint-keypair.json'));
const wallet = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(keypair));

console.log('Public Key:', wallet.publicKey.toString());
// Output: 8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi
```

---

## 🔒 **Безопасность - Checklist:**

- ✅ **НЕ коммитить** `tama-mint-keypair.json` и `payer-keypair.json` в Git
- ✅ Добавить в `.gitignore`:
  ```
  *-keypair.json
  *.json # (если не нужны другие .json)
  ```
- ✅ Использовать **Environment Variables** в production
- ✅ Хранить backup ключей в **безопасном месте** (например, password manager)
- ✅ **НЕ публиковать** этот файл в открытом репо!

---

## 📦 **Backup ключей:**

### **Где хранить backup:**
1. **Локально:** Защищённая папка на твоём ПК (с шифрованием)
2. **Cloud:** Google Drive / Dropbox в зашифрованном архиве
3. **Password Manager:** 1Password, LastPass, Bitwarden
4. **Hardware:** USB флешка (зашифрованная)

### **Создать backup:**
```bash
# Windows
copy tama-mint-keypair.json backup-tama-mint-keypair.json
copy payer-keypair.json backup-payer-keypair.json

# Зашифровать (например, 7-Zip с паролем)
7z a -p backup-keys.7z backup-*.json
```

---

## 🚨 **Если ключи скомпрометированы:**

1. **Немедленно создай новый токен**
2. **Обнови все ссылки на mint address**
3. **Оповести пользователей** о миграции
4. **Удали старые ключи** со всех серверов

---

## ✅ **Summary:**

| Файл | Публичный адрес | Назначение |
|------|----------------|------------|
| `tama-mint-keypair.json` | `8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi` | Mint Authority для TAMA |
| `payer-keypair.json` | (вычислить) | Оплата транзакций |

**TAMA Token Mint:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`

---

**🔐 Храни эти ключи в безопасности!**

