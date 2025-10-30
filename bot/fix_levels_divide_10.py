#!/usr/bin/env python3
"""
Fix user levels - divide by 10
Formula: Level = TAMA / 1000 (instead of TAMA / 100)
"""

import os
from supabase import create_client, Client

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fix_all_levels():
    """Fix all user levels - divide by 10"""
    print("=" * 80)
    print("FIXING LEVELS - DIVIDE BY 10")
    print("=" * 80)
    print()
    print("Fetching all users from leaderboard...")
    
    # Get all users
    result = supabase.table('leaderboard').select('*').execute()
    users = result.data
    
    print(f"Found {len(users)} users")
    print("\nFixing levels...")
    print("-" * 80)
    
    fixed_count = 0
    
    for user in users:
        telegram_id = user.get('telegram_id')
        current_level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        
        # Calculate correct level: Level = TAMA / 1000
        correct_level = max(1, int(tama / 1000))
        
        if current_level != correct_level:
            print(f"User {telegram_id}:")
            print(f"  TAMA: {tama:,}")
            print(f"  Level: {current_level} -> {correct_level} (/10)")
            
            # Update level
            supabase.table('leaderboard').update({
                'level': correct_level
            }).eq('telegram_id', telegram_id).execute()
            
            fixed_count += 1
            print(f"  Status: FIXED")
        else:
            print(f"User {telegram_id}: OK (Level {current_level}, TAMA {tama:,})")
    
    print("-" * 80)
    print(f"\nSummary:")
    print(f"  Total users: {len(users)}")
    print(f"  Fixed: {fixed_count}")
    print(f"  Already correct: {len(users) - fixed_count}")
    print()
    print("=" * 80)
    print("EXAMPLES:")
    print("  177,378 TAMA -> Level 177 (was 1773)")
    print("  79,444 TAMA -> Level 79 (was 794)")
    print("  55,318 TAMA -> Level 55 (was 553)")
    print("  10,151 TAMA -> Level 10 (was 101)")
    print("  4,275 TAMA -> Level 4 (was 42)")
    print("=" * 80)
    print("\nDone!")

if __name__ == "__main__":
    fix_all_levels()




