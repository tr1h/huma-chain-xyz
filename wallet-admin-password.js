// ============================================
// WALLET ADMIN PASSWORD CONFIGURATION
// ============================================
// 
// IMPORTANT: This file should NOT be in Git!
// Keep it locally and copy to other computers with wallet-admin.html
//
// ============================================

// OPTION 1: Simple password (less secure, but easier)
window.ADMIN_PASSWORD = 'W@ll3t_Adm!n_S3cur3_2025_T@m@'; // SET YOUR PASSWORD HERE
const ADMIN_PASSWORD = window.ADMIN_PASSWORD; // For compatibility

// OPTION 2: Password hash (more secure)
// Use SHA256 hash of your password
// Generate here: https://emn178.github.io/online-tools/sha256.html
// const ADMIN_PASSWORD_HASH = '';

// OPTION 3: If you want to use hash, comment out ADMIN_PASSWORD above
// and uncomment ADMIN_PASSWORD_HASH below, insert your hash:

// const ADMIN_PASSWORD_HASH = 'your_sha256_hash_here';

// ============================================
// INSTRUCTIONS:
// ============================================
// 1. Replace 'admin123' with your password
// 2. Save the file
// 3. Open wallet-admin.html in browser
// 4. Enter your password
//
// For use on another computer:
// - Copy BOTH files: wallet-admin.html AND wallet-admin-password.js
// - Put them in the same folder
// - Open wallet-admin.html
// ============================================
