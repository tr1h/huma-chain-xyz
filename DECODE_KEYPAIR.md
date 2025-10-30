# 🔐 Как расшифровать tama-mint-keypair.json

## 📄 **Что это за файл?**

`tama-mint-keypair.json` содержит **приватный ключ** (secret key) для твоего TAMA токена в Solana.

Формат: массив из 64 чисел (байты)

---

## 🔓 **Способ 1: Использовать Solana CLI**

### **Установить Solana CLI:**
```bash
# Windows (PowerShell):
cmd /c "curl https://release.solana.com/v1.17.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"

# Mac/Linux:
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

### **Получить публичный адрес:**
```bash
solana-keygen pubkey tama-mint-keypair.json
```

**Вывод:**
```
8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi
```

### **Проверить баланс:**
```bash
solana balance 8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi --url devnet
```

---

## 💻 **Способ 2: Node.js скрипт**

### **Создай файл `decode-keypair.js`:**
```javascript
const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');

// Читаем файл
const keypairData = JSON.parse(fs.readFileSync('tama-mint-keypair.json', 'utf-8'));

// Создаём Keypair из массива байтов
const keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(keypairData));

console.log('🔑 Публичный адрес (Public Key):');
console.log(keypair.publicKey.toString());

console.log('\n🔐 Приватный ключ (Secret Key - base58):');
console.log(Buffer.from(keypair.secretKey).toString('base64'));

console.log('\n📊 Полная информация:');
console.log({
    publicKey: keypair.publicKey.toString(),
    secretKeyLength: keypair.secretKey.length,
    firstBytes: Array.from(keypair.secretKey.slice(0, 10))
});
```

### **Запустить:**
```bash
npm install @solana/web3.js
node decode-keypair.js
```

**Вывод:**
```
🔑 Публичный адрес (Public Key):
8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi

🔐 Приватный ключ (Secret Key - base58):
yuqmdfdofjdofj...base64...

📊 Полная информация:
{
  publicKey: '8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi',
  secretKeyLength: 64,
  firstBytes: [202, 234, 166, 117, 253, 97, 126, 78, 70, 53]
}
```

---

## 🌐 **Способ 3: Онлайн (НЕ РЕКОМЕНДУЕТСЯ для реальных ключей!)**

### **Только для DEVNET ключей!**

```javascript
// Скопируй в Browser Console (F12)

const keypairArray = [202,234,166,117,253,97,126,78,70,53,200,78,58,138,132,186,116,212,75,127,8,56,143,49,102,250,54,211,149,116,31,187,99,145,153,245,255,205,179,253,116,180,185,71,33,235,67,196,204,245,250,163,182,49,43,53,240,102,169,138,123,197,220,252];

// Первые 32 байта - приватный ключ
// Последние 32 байта - публичный ключ

const publicKeyBytes = keypairArray.slice(32);
console.log('Public Key bytes:', publicKeyBytes);

// Для получения адреса нужна библиотека @solana/web3.js
```

---

## 📊 **Структура файла:**

```json
[
  202, 234, 166, 117, 253, 97, 126, 78, 70, 53, 200, 78, 58, 138, 132, 186,
  116, 212, 75, 127, 8, 56, 143, 49, 102, 250, 54, 211, 149, 116, 31, 187,
  ↑ Первые 32 байта = Приватный ключ (seed)
  
  99, 145, 153, 245, 255, 205, 179, 253, 116, 180, 185, 71, 33, 235, 67, 196,
  204, 245, 250, 163, 182, 49, 43, 53, 240, 102, 169, 138, 123, 197, 220, 252
  ↑ Последние 32 байта = Публичный ключ (public key)
]
```

---

## 🔍 **Твой TAMA Token:**

### **Из файла `tama-token-info.json`:**
```json
{
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "mintAuthority": "8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi",
  "freezeAuthority": "8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi"
}
```

### **Расшифровка:**
- **Mint Address:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`  
  (Адрес самого токена TAMA)

- **Mint Authority:** `8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi`  
  (Публичный ключ из `tama-mint-keypair.json`)  
  (Может минтить новые токены)

---

## ⚠️ **ВАЖНО!**

### **❌ НИКОГДА НЕ ДЕЛИСЬ:**
- `tama-mint-keypair.json` (полный файл)
- Приватным ключом (первые 32 байта)
- Base58/Base64 представлением приватного ключа

### **✅ МОЖНО ДЕЛИТЬСЯ:**
- Публичным адресом: `8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi`
- Mint адресом токена: `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`

---

## 🔒 **Безопасность:**

### **Для Production:**
1. Храни `tama-mint-keypair.json` в `.env` файле
2. Добавь в `.gitignore`
3. НЕ коммить в GitHub!
4. Используй environment variables

### **Пример `.env`:**
```env
# НЕ КОММИТИТЬ В GIT!
TAMA_MINT_AUTHORITY=8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi
TAMA_MINT_SECRET=[202,234,166,...]
```

---

## 🎯 **Quick Commands:**

### **Получить публичный адрес:**
```bash
solana-keygen pubkey tama-mint-keypair.json
```

### **Проверить TAMA токен:**
```bash
spl-token display Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY --url devnet
```

### **Проверить баланс:**
```bash
solana balance 8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi --url devnet
```

---

## 📚 **Дополнительные ресурсы:**

- **Solana CLI:** https://docs.solana.com/cli/install-solana-cli-tools
- **SPL Token:** https://spl.solana.com/token
- **Keypair docs:** https://docs.solana.com/developing/clients/javascript-reference#keypair

---

**🔐 ХРАНИ ПРИВАТНЫЕ КЛЮЧИ В БЕЗОПАСНОСТИ!**

