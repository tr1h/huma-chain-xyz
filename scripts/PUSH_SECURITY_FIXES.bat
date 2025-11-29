@echo off
echo ================================================
echo 🛡️ SECURITY FIXES - QUICK PUSH
echo ================================================
echo.

git add api/verify-payment.php api/mint-nft-sol-verified.php api/withdrawal-secure.php supabase/withdraw_tama_atomic.sql SECURITY_FIXES_IMPLEMENTATION.md SECURITY_REVIEW_REPORT.md SECURITY_TESTING_GUIDE.md SOLANA_GRANT_APPLICATION.md DEPLOY_SECURITY_FIXES.bat README.md

git commit -m "🛡️ Security Score: 6.3→8.5! NFT verification + Atomic withdrawals + TX order fix"

git push origin main

echo.
echo ✅ PUSHED!
echo.
pause

