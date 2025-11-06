#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to fix all corrupted emoji in bot.py
"""

import re

# Mapping of corrupted emoji to correct ones
EMOJI_FIXES = {
    # Common emoji
    'ЁЯОо': '🎮',  # Game controller
    'ЁЯЪА': '🚀',  # Rocket
    'тЬи': '⭐',   # Star
    'тАВ': '•',   # Bullet point
    'тЭМ': '❌',  # Cross mark
    'тЬЕ': '✅',  # Check mark
    'ЁЯОБ': '🎁',  # Gift
    'ЁЯФЧ': '🔗',  # Link
    'ЁЯПЕ': '🏆',  # Trophy
    'ЁЯОп': '📋',  # Clipboard
    'ЁЯТб': '💰',  # Money bag
    'ЁЯЦЯ': '🖼️',  # Picture frame
    'ЁЯУж': '📦',  # Package
    'ЁЯТ': '💰',   # Money bag (short)
    'ЁЯТЬ': '🐾',  # Paw prints
    'ЁЯУК': '📊',  # Bar chart
    'ЁЯПЖ': '🏅',  # Medal
    'ЁЯОП': '📋',  # Clipboard
    'ЁЯФЩ': '🔙',  # Back arrow
    'ЁЯТЪ': '🐾',  # Paw prints
    'ЁЯТЩ': '🦊',  # Fox
    'ЁЯзб': '🐉',  # Dragon
    'ЁЯЪи': '⚠️',  # Warning
    'ЁЯО░': '🎰',  # Slot machine
    'тЭУ': '❓',   # Question mark
    'ЁЯез': '🥇',  # Gold medal
    'ЁЯеИ': '🥈',  # Silver medal
    'ЁЯей': '🥉',  # Bronze medal
    'ЁЯСе': '👥',  # People
    'ЁЯЫТ': '🎨',  # Artist palette
    'ЁЯдЦ': '🤖',  # Robot
    'ЁЯУв': '📢',  # Megaphone
    'ЁЯТм': '💬',  # Speech balloon
    'ЁЯР╛': '🐾',  # Paw prints
    'ЁЯТ░': '💰',  # Money bag
    'ЁЯУд': '📤',  # Outbox tray
    'ЁЯУ▒': '📱',  # Mobile phone
    'тнР': '🎖️',  # Military medal
    'ЁЯОБтьи': '🎁⭐',  # Gift + Star
    'ЁЯЦ╝я╕П': '🖼️',  # Picture frame
}

def fix_emoji_in_file(filepath):
    """Fix all corrupted emoji in a file"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original_content = content
    
    # Replace all corrupted emoji
    for corrupted, correct in EMOJI_FIXES.items():
        content = content.replace(corrupted, correct)
    
    # Also fix common patterns
    # Fix "тАв" (bullet) that appears alone
    content = re.sub(r'тАв\s+', '• ', content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] Fixed emoji in {filepath}")
        changes = len([c for c in EMOJI_FIXES.keys() if c in original_content])
        print(f"[INFO] Replaced {changes} different emoji patterns")
        return True
    else:
        print(f"[INFO] No changes needed in {filepath}")
        return False

if __name__ == '__main__':
    import sys
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'bot.py'
    fix_emoji_in_file(filepath)

