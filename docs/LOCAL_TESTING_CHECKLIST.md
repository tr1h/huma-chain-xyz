# 🧪 LOCAL TESTING CHECKLIST

## Before EVERY push to GitHub, check:

### 1️⃣ Start Local Server
```powershell
cd C:\goooog
.\start-local-server.ps1
```

### 2️⃣ Open in Browser
- URL: http://localhost:8000/tamagotchi-game.html
- Use: Chrome/Edge with DevTools (F12)

### 3️⃣ Test These Things:

#### ✅ Visual Check:
- [ ] Page loads without errors
- [ ] CSS loads correctly (no unstyled content)
- [ ] All colors/themes work
- [ ] Tamagotchi pet displays correctly
- [ ] All buttons visible

#### ✅ Console Check (F12):
- [ ] NO JavaScript errors (red text)
- [ ] NO 404 errors (missing files)
- [ ] NO CORS errors

#### ✅ Functionality Check:
- [ ] Can click on pet
- [ ] Can feed/play/sleep
- [ ] Stats update correctly
- [ ] Language selector works (all 13 languages!)
- [ ] Wallet connect works

#### ✅ Network Check (DevTools → Network tab):
- [ ] All CSS files load (200 OK)
- [ ] All JS files load (200 OK)
- [ ] All images load (200 OK)
- [ ] i18n files load correctly

### 4️⃣ Test in Different Languages:
- [ ] English
- [ ] Russian (Русский)
- [ ] Chinese (中文)

### 5️⃣ Test Console Logs:
- [ ] Open Console (F12)
- [ ] Do some actions (click, feed, etc.)
- [ ] Check logs appear (for debugging)

---

## ⚠️ ONLY IF ALL CHECKS PASS:

```bash
git add .
git commit -m "Your message"
git push origin main
```

## ❌ IF ANYTHING FAILS:

**DO NOT PUSH!** Fix it first, test again!

---

## 🔧 Quick Commands:

### Start server:
```powershell
.\start-local-server.ps1
```

### Stop server:
```
Ctrl + C
```

### Check git status:
```bash
git status
```

### See what changed:
```bash
git diff
```

---

## 💡 Pro Tips:

1. **Test in Incognito mode** (Ctrl+Shift+N) to avoid cache issues
2. **Hard refresh** (Ctrl+F5) if something looks wrong
3. **Check mobile view** (DevTools → Device toolbar)
4. **Test with slow connection** (DevTools → Network → Throttling)

---

## 📱 Mobile Testing (Optional):

Open on phone:
1. Find your local IP: `ipconfig`
2. Open: http://YOUR_IP:8000/tamagotchi-game.html
3. Test touch controls

---

## 🎯 Golden Rule:

# "If it works locally → it works in production!"
# "If it fails locally → FIX IT FIRST!"

---

Created: 2025-12-16
Last Updated: 2025-12-16
