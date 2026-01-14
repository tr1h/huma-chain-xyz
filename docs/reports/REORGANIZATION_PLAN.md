# 📁 Repository Reorganization Plan

## Current Problem
- 200+ files in root directory
- Duplicate/old HTML files
- Documentation scattered everywhere
- Hard to navigate and maintain

## New Structure

```
C:\goooog\
├── 📄 Core Files (Root)
│   ├── index.html
│   ├── tamagotchi-game.html
│   ├── slots.html
│   ├── wheel.html
│   ├── mint.html
│   ├── marketplace.html
│   ├── profile.html
│   ├── referral.html
│   ├── my-nfts.html
│   ├── whitepaper.html
│   ├── terms.html
│   ├── privacy.html
│   ├── disclaimer.html
│   ├── README.md
│   ├── LICENSE
│   ├── CNAME
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── package.json
│   ├── render.yaml
│   ├── Dockerfile
│   └── runtime.txt
│
├── 📁 api/                    # Backend API
│   ├── tama_supabase.php
│   ├── telegram_auth.php
│   ├── mint-nft-*.php
│   └── ...
│
├── 📁 bot/                    # Telegram Bot
│   ├── bot.py
│   ├── translations.py
│   ├── auto_posting.py
│   └── ...
│
├── 📁 admin/                  # Admin Panels
│   ├── super-admin.html
│   ├── transactions-admin.html
│   ├── treasury-monitor.html
│   ├── economy-admin.html
│   ├── slots-admin.html
│   └── ...
│
├── 📁 assets/                 # Static Assets
│   ├── logo.png
│   ├── poster.jpg
│   ├── favicon.ico
│   └── sounds/
│
├── 📁 css/                    # Stylesheets
├── 📁 js/                     # JavaScript
├── 📁 nft-assets/             # NFT Images
├── 📁 supabase/               # Database
│   └── migrations/
│
├── 📁 docs/                   # 📚 Documentation
│   ├── guides/                # Setup & How-to Guides
│   │   ├── QUICK_START_DEV.md
│   │   ├── SETUP_GAME_ALERTS.md
│   │   ├── DEV_MODE_SETUP.md
│   │   ├── SECURITY_SETUP.md
│   │   ├── GAME_INTEGRATION_GUIDE.md
│   │   └── STORAGE_EXPLAINED.md
│   │
│   ├── reports/               # Analysis & Reports
│   │   ├── ANALYTICS_REPORT.md
│   │   ├── TRANSACTION_AUDIT_REPORT.md
│   │   ├── TREASURY_MONITOR_REPORT.md
│   │   ├── BALANCE_SYNC.md
│   │   └── SLOTS_PROBABILITY_ANALYSIS.md
│   │
│   ├── admin/                 # Admin Documentation
│   │   ├── ADMIN_FINAL_SUMMARY.md
│   │   ├── ADMIN_PANELS_ANALYSIS.md
│   │   ├── ADMIN_PASSWORD_INFO.md
│   │   └── ADMIN_UPGRADE_GUIDE.md
│   │
│   ├── colosseum/             # Hackathon Materials
│   │   ├── COLOSSEUM_HACKATHON_SUBMISSION.md
│   │   ├── COLOSSEUM_PRESENTATION.md
│   │   ├── COLOSSEUM_2DAY_PLAN.md
│   │   └── COLOSSEUM_FORM_TEXTS.txt
│   │
│   ├── video/                 # Video Scripts
│   │   ├── VIDEO_RECORDING_SCENARIO.md
│   │   ├── VIDEO_SCRIPT_ENGLISH_VOICEOVER.txt
│   │   ├── VIDEO_SCRIPT_RUSSIAN_VOICEOVER.txt
│   │   └── FINAL_VIDEO_METRICS.txt
│   │
│   ├── sora2/                 # AI Video Prompts
│   │   ├── SORA2_PROMPT.md
│   │   ├── SORA2_SLOTS_ONLY.md
│   │   └── MIDJOURNEY_PROMPT_SHORT.md
│   │
│   └── features/              # Feature Docs
│       ├── JACKPOT_MECHANICS_EXPLAINED.md
│       ├── MULTIPLAYER_SLOTS_IDEAS.md
│       ├── MARKETPLACE_IMPROVEMENT_PLAN.md
│       └── WHEEL_IMPROVEMENTS.md
│
├── 📁 scripts/                # Utility Scripts
│   ├── PUSH_REORGANIZATION.bat
│   ├── FINISH_CLEANUP.bat
│   ├── install-extensions-simple.ps1
│   └── test-git-connection.ps1
│
├── 📁 archived/               # Old/Deprecated Files
│   ├── old-html/
│   ├── old-scripts/
│   └── old-docs/
│
└── 📁 backups/                # Backups (gitignored)
```

## Files to Move

### → docs/guides/
- QUICK_START_DEV.md
- SETUP_GAME_ALERTS.md
- DEV_MODE_SETUP.md
- SECURITY_SETUP.md
- GAME_INTEGRATION_GUIDE.md
- STORAGE_EXPLAINED.md
- CREATE_GITHUB_TOKEN_GUIDE.md
- CURSOR_EXTENSIONS_GUIDE.md
- SETUP_GIT_FOR_AI.md
- TELEGRAM_WALLET_LINKING_EXPLAINED.md
- ACCOUNT_LINKING_PLAN.md
- LEGAL_CONSIDERATIONS.md

### → docs/reports/
- ANALYTICS_REPORT.md
- TRANSACTION_AUDIT_REPORT.md
- TREASURY_MONITOR_REPORT.md
- BALANCE_SYNC.md
- SLOTS_PROBABILITY_ANALYSIS.md
- FINAL_ONCHAIN_REPORT.md
- SESSION_COMPLETE_SUMMARY.md

### → docs/admin/
- ADMIN_FINAL_SUMMARY.md
- ADMIN_PANELS_ANALYSIS.md
- ADMIN_PASSWORD_INFO.md
- ADMIN_UPGRADE_GUIDE.md
- admin-tokenomics-notes.md

### → docs/colosseum/
- COLOSSEUM_HACKATHON_SUBMISSION.md
- COLOSSEUM_PRESENTATION.md
- COLOSSEUM_2DAY_PLAN.md
- COLOSSEUM_FORM_TEXTS.txt
- COLOSSEUM_VIDEO_SCRIPT.md

### → docs/video/
- VIDEO_RECORDING_SCENARIO.md
- VIDEO_SCRIPT_ENGLISH_VOICEOVER.txt
- VIDEO_SCRIPT_RUSSIAN_VOICEOVER.txt
- VIDEO_SCRIPT_SIMPLE.txt
- VIDEO_SCRIPTS_FULL_BOTH.txt
- FINAL_VIDEO_METRICS.txt

### → docs/sora2/
- SORA2_PROMPT.md
- SORA2_PROMPTS.md
- SORA2_SLOTS_ONLY.md
- MIDJOURNEY_PROMPT_SHORT.md

### → docs/features/
- JACKPOT_MECHANICS_EXPLAINED.md
- JACKPOT_ALERTS_SETUP.md
- JACKPOT_TROUBLESHOOTING.md
- MULTIPLAYER_SLOTS_IDEAS.md
- MARKETPLACE_IMPROVEMENT_PLAN.md
- WHEEL_IMPROVEMENTS.md
- SLOTS_*.md
- SKIN_CONCEPTS.md
- SKINS_*.md
- ONCHAIN_INTEGRATION_IMPROVEMENTS.md
- QUICK_FIX_BALANCE.md
- FIX_BALANCE_SYNC.sql
- TWITTER_POSTS_READY.md
- X_POST.md
- NEW_CHAT_PROMPT.md

### → admin/
- super-admin.html
- transactions-admin.html
- treasury-monitor.html
- economy-admin.html
- slots-admin.html
- admin-dashboard.html
- admin-auth.html
- admin-nft-tiers.html
- admin-referrals.html
- admin-skins-manager.html
- admin-table.html
- admin-tokenomics.html
- blog-admin.html

### → archived/old-html/
- super-admin-backup-OLD.html
- super-admin-enhanced-sections.html
- super-admin-improved.html
- treasury-monitor-backup-OLD.html
- profile-old-backup.html
- profile-enhanced.html
- nft-mint.html (if replaced by nft-mint-5tiers.html)
- skins-improved-xmas.html
- skins-visual-demo.html
- skin-preview.html
- daily-rewards.html
- test-api.html
- api-demo.html
- s.html
- colosseum-presentation.html

### → archived/old-scripts/
- MOVE_DOCS_TO_FOLDERS.bat
- CHECK_GIT_CONFIG.bat
- FINISH_CLEANUP.bat
- Finish-Cleanup.ps1
- Get-GitInfo.ps1
- install-extra-extensions.ps1
- INSTALL_EXTENSIONS.ps1

### → scripts/ (keep active)
- PUSH_REORGANIZATION.bat
- install-extensions-simple.ps1
- test-git-connection.ps1

### → Delete (not needed)
- GIT_COMMANDS_TO_COPY.txt
- GENPLAN_ANDREEVSKOE.md (unrelated)
- googleddd39499a3bd424b.html
- test-api.http
- wallets.csv (sensitive, should be in .gitignore)
- audit-output.txt
- audit-report.json
- _config.yml (Jekyll, not used)

## Implementation Steps

1. ✅ Create new folder structure
2. ✅ Update .gitignore
3. Move documentation files
4. Move admin panels
5. Archive old files
6. Update README.md with new structure
7. Test all links
8. Commit changes

## Benefits

✅ **Cleaner root directory** (only 20-30 core files)
✅ **Organized documentation** (easy to find)
✅ **Separated concerns** (frontend, backend, admin, docs)
✅ **Better maintainability**
✅ **Professional structure**

