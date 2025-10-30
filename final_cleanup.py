#!/usr/bin/env python3
"""
Final Project Cleanup
Финальная очистка проекта - удаление всех ненужных файлов
"""

import os
import shutil
from pathlib import Path

def final_cleanup():
    """Финальная очистка проекта"""
    print("Final Project Cleanup - Removing Unnecessary Files...")
    print("=" * 60)
    
    # Files to remove (all unnecessary files)
    files_to_remove = [
        # Old bot files
        "bot_tama_integration.py",
        
        # Old test files
        "test_db_connection.php",
        "test_existing.html",
        "test_mock.html",
        "test_simple.html",
        "test_supabase.html",
        "test_tama_api.html",
        "test_final.html",
        
        # Old SQL files
        "tama_database_ultra_simple.sql",
        "tama_integration_existing.sql",
        "tama_safe_integration.sql",
        "check_all_columns.sql",
        "check_existing_database.sql",
        "check_leaderboard_structure.sql",
        
        # Old referral files
        "COMPLETE_REFERRAL_CLEANUP.sql",
        "DIAGNOSE_REFERRAL_DUPLICATION.sql",
        "QUICK_FIX_REFERRAL_CONSTRAINT.sql",
        "REFERRAL_ANALYSIS_SQL.sql",
        "REFERRAL_DEBUG_SCRIPT.js",
        "REFERRAL_DOUBLE_REWARDS_POST.md",
        "REFERRAL_DUPLICATION_FIX_REPORT.md",
        "REFERRAL_ISSUES_FIX_REPORT.md",
        "REFERRAL_OPTIMIZATION_IMPLEMENTATION_REPORT.md",
        "REFERRAL_SYSTEM_CLEANUP.sql",
        "REFERRAL_SYSTEM_FIX.sql",
        "REFERRAL_SYSTEM_UPDATE_POST.md",
        "REFERRAL_TRACKING_FIX_REPORT.md",
        "REFERRAL_UPDATE_THREAD.md",
        "REFERRAL_UPDATE_X_POST.md",
        
        # Old documentation files
        "BUTTON_TYPE_INVALID_FIX_REPORT.md",
        "CLEAN_README_FOR_HACKATHON.md",
        "CLEAN_README_PUBLIC_REPO.md",
        "FINAL_ACTION_PLAN.md",
        "FINAL_PROJECT_REPORT.md",
        "GROUP_COMMANDS_FIX_REPORT.md",
        "HACKATHON_CHECKLIST.md",
        "HACKATHON_PITCH_SCRIPT.md",
        "HACKATHON_SUBMISSION.md",
        "LOGO_DESIGN_BRIEF.md",
        "NFT_МОДЕЛИ_СРАВНЕНИЕ.md",
        "POSTS_WITH_HASHTAGS.txt",
        "QUICK_IMPLEMENTATION_GUIDE.md",
        "README_РУССКИЙ.md",
        "TAMA_TOKEN_IMPLEMENTATION.md",
        "TAMA_ПРИМЕР_КОДА.md",
        "TAMA_СХЕМА.md",
        "TAMA_ТОКЕНЫ_ПОДРОБНО.md",
        "АРХИТЕКТУРА_СИСТЕМЫ.md",
        "ЧЕКЛИСТ_ХАКАТОН.md",
        
        # Old SORA files
        "SORA_2_REFERRAL_BOMB_PROMPT.md",
        "SORA_2_TIKTOK_VIRAL_BOMB.md",
        "SORA_2_ULTIMATE_VIRAL_BOMB.md",
        
        # Old X posts
        "X_POST_QUICK.md",
        "X_POST_RECENT_UPDATES.md",
        "X_POST_SHORT.md",
        "X_POST_THREAD.md",
        
        # Old admin files
        "super-admin-tama.html",
        
        # Old cleanup script
        "cleanup_project.py",
        
        # Old project structure files
        "PROJECT_STRUCTURE.md",
        "PROJECT_SUMMARY.md",
    ]
    
    # Directories to remove (if empty)
    dirs_to_remove = [
        "solana-tamagotchi-public",  # Keep only main project
    ]
    
    print("Removing unnecessary files...")
    
    removed_count = 0
    for file_path in files_to_remove:
        if os.path.exists(file_path):
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"Removed file: {file_path}")
                    removed_count += 1
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                    print(f"Removed directory: {file_path}")
                    removed_count += 1
            except Exception as e:
                print(f"Failed to remove {file_path}: {e}")
        else:
            print(f"Not found: {file_path}")
    
    print(f"\nRemoved {removed_count} files/directories")
    
    # Remove empty directories
    print("\nRemoving empty directories...")
    for dir_path in dirs_to_remove:
        if os.path.exists(dir_path) and os.path.isdir(dir_path):
            try:
                if not os.listdir(dir_path):  # Check if directory is empty
                    os.rmdir(dir_path)
                    print(f"Removed empty directory: {dir_path}")
                else:
                    print(f"Directory not empty, keeping: {dir_path}")
            except Exception as e:
                print(f"Failed to remove directory {dir_path}: {e}")
    
    print("\nCreating final project structure...")
    
    # Create final README
    final_readme = """# 🎮 Solana Tamagotchi - Hackathon Project

**Telegram-first play-to-earn pet game on Solana blockchain with TAMA token economy**

## 🚀 Quick Start

### 1. Start TAMA API Server:
```bash
node api/tama_supabase_api.js
```

### 2. Start Telegram Bot:
```bash
python start_bot_with_tama.py
```

### 3. Access Web App:
- Open `solana-tamagotchi/index.html`
- Connect Phantom wallet
- Start playing!

### 4. Admin Dashboard:
- Open `super-admin-tama-stats.html`
- Monitor TAMA economy

## 📁 Project Structure

```
C:\goooog\
├── solana-tamagotchi/          # Main game project
│   ├── bot/                    # Telegram bot
│   ├── css/, js/              # Frontend assets
│   ├── nft-assets/            # NFT resources
│   └── *.html                 # Game pages
├── api/                        # TAMA API server
├── tools/                      # Utilities
├── super-admin-tama-stats.html # Admin dashboard
├── start_bot_with_tama.py     # Bot launcher
└── README_FINAL.md            # Full documentation
```

## 🎯 Ready for Hackathon!

- ✅ TAMA Token Economy
- ✅ Telegram Bot Integration
- ✅ Web App with NFT Minting
- ✅ Admin Dashboard
- ✅ Real-time Database Sync

**Built for Solana Cypherpunk Hackathon 2025** 🚀
"""
    
    with open("README.md", "w", encoding="utf-8") as f:
        f.write(final_readme)
    
    print("Created README.md")
    
    print("\n" + "=" * 60)
    print("Final cleanup completed!")
    print("\nProject is now clean and ready for hackathon!")
    print("\nEssential files remaining:")
    print("- solana-tamagotchi/ (main project)")
    print("- api/ (TAMA API server)")
    print("- tools/ (utilities)")
    print("- super-admin-tama-stats.html (admin)")
    print("- start_bot_with_tama.py (launcher)")
    print("- README.md (quick start)")
    print("- README_FINAL.md (full docs)")
    print("- HACKATHON_FINAL_CHECKLIST.md (checklist)")

if __name__ == "__main__":
    final_cleanup()




