# 🔑 Setup Payer Keypair for On-Chain Minting

## 📋 Overview

Payer keypair нужен для оплаты транзакций при минте NFT (Arweave storage, Solana fees).

---

## 🔧 Вариант 1: Использовать существующий keypair

### Если у вас есть `payer-keypair.json`:

```bash
# Установить bs58 (если еще не установлен)
npm install bs58

# Получить base58 private key
node -e "const fs=require('fs'); const keypair=JSON.parse(fs.readFileSync('payer-keypair.json')); console.log(require('bs58').encode(keypair.secretKey))"
```

Скопируйте вывод и используйте как `SOLANA_PAYER_KEYPAIR` в environment variables.

---

## 🔧 Вариант 2: Создать новый keypair (Devnet)

### Шаг 1: Создать keypair

```bash
node -e "const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const kp=Keypair.generate(); console.log('Public:', kp.publicKey.toString()); console.log('Private (base58):', bs58.encode(kp.secretKey));"
```

### Шаг 2: Получить SOL из faucet

1. Скопируйте **Public Key** из вывода
2. Перейдите: https://faucet.solana.com/
3. Вставьте Public Key
4. Получите SOL (бесплатно для Devnet)

### Шаг 3: Сохранить в environment variables

Используйте **Private Key (base58)** как `SOLANA_PAYER_KEYPAIR`

---

## 🔧 Вариант 3: Использовать существующий wallet

Если у вас уже есть wallet с SOL:

```bash
# Экспортировать private key из Phantom
# Settings → Security & Privacy → Export Private Key
# Конвертировать в base58 (если нужно)
```

---

## 📝 Environment Variables

### Локально (.env файл):

```bash
SOLANA_NETWORK=devnet
SOLANA_PAYER_KEYPAIR=your_base58_private_key_here
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_supabase_key
PORT=3001
```

### На Render.com:

Добавьте в Environment Variables:
- `SOLANA_NETWORK` = `devnet`
- `SOLANA_PAYER_KEYPAIR` = `your_base58_private_key`
- `SUPABASE_URL` = `https://zfrazyupameidxpjihrh.supabase.co`
- `SUPABASE_KEY` = `your_key`
- `PORT` = `10000` (или оставьте пустым)

---

## ✅ Проверка

После настройки проверьте:

```bash
# Запустить сервер
npm run start:onchain

# В другом терминале проверить health
curl http://localhost:3001/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "service": "NFT On-Chain Minting API",
  "timestamp": "..."
}
```

---

## ⚠️ Важно

1. **Не коммитьте private key в Git!**
   - Используйте `.env` файл (добавлен в `.gitignore`)
   - Или environment variables на Render.com

2. **SOL Balance:**
   - Devnet: Получите из faucet (бесплатно)
   - Mainnet: Пополните реальными SOL

3. **Безопасность:**
   - Храните private key в секрете
   - Не делитесь им публично
   - Используйте разные keypairs для devnet и mainnet

---

## 🚀 Готово!

После настройки payer keypair:
1. ✅ Запустите сервер: `npm run start:onchain`
2. ✅ Проверьте health endpoint
3. ✅ Попробуйте заминтить NFT на `mint.html`
4. ✅ NFT появится на Solana blockchain!

