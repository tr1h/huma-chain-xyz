#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive script to fix ALL corrupted emoji in bot.py
"""

import re

# Extended mapping of ALL corrupted emoji patterns
FIXES = {
    # Basic emoji
    'ЁЯОо': '🎮',
    'ЁЯЪА': '🚀',
    'тЬи': '⭐',
    'тАВ': '•',
    'тЭМ': '❌',
    'тЬЕ': '✅',
    'ЁЯОБ': '🎁',
    'ЁЯФЧ': '🔗',
    'ЁЯПЕ': '🏆',
    'ЁЯОп': '📋',
    'ЁЯТб': '💰',
    'ЁЯЦЯ': '🖼️',
    'ЁЯУж': '📦',
    'ЁЯТ': '💰',
    'ЁЯТЬ': '🐾',
    'ЁЯУК': '📊',
    'ЁЯПЖ': '🏅',
    'ЁЯОП': '📋',
    'ЁЯФЩ': '🔙',
    'ЁЯТЪ': '🐾',
    'ЁЯТЩ': '🦊',
    'ЁЯзб': '🐉',
    'ЁЯЪи': '⚠️',
    'ЁЯО░': '🎰',
    'тЭУ': '❓',
    'ЁЯез': '🥇',
    'ЁЯеЗ': '🥇',
    'ЁЯеИ': '🥈',
    'ЁЯей': '🥉',
    'ЁЯеЙ': '🥉',
    'ЁЯСе': '👥',
    'ЁЯЫТ': '🎨',
    'ЁЯдЦ': '🤖',
    'ЁЯУв': '📢',
    'ЁЯТм': '💬',
    'ЁЯР╛': '🐾',
    'ЁЯТ░': '💰',
    'ЁЯУд': '📤',
    'ЁЯУ▒': '📱',
    'тнР': '🎖️',
    'ЁЯОБтьи': '🎁⭐',
    'ЁЯЦ╝я╕П': '🖼️',
    # Combined patterns
    '💰Ъ': '🐾',
    '💰Щ': '🦊',
    '💰Ь': '🐾',
    '💰░': '💰',
}

def fix_file(filepath):
    """Fix all corrupted emoji in file"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Replace all known corrupted patterns
    for corrupted, correct in FIXES.items():
        count = content.count(corrupted)
        if count > 0:
            content = content.replace(corrupted, correct)
            changes += count
            print(f"[FIX] Replaced {count}x pattern -> emoji")
    
    # Fix standalone bullet points
    content = re.sub(r'тАв\s+', '• ', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n[OK] Fixed {changes} emoji instances in {filepath}")
        return True
    else:
        print(f"[INFO] No changes needed")
        return False

if __name__ == '__main__':
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'bot.py'
    fix_file(filepath)

