#!/usr/bin/env python3
"""
Sync user levels based on TAMA balance
Formula: Level = TAMA / 1000
"""

import os
from supabase import create_client, Client

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def sync_all_levels():
    """Sync all user levels based on their TAMA balance"""
    print("Fetching all users from leaderboard...")
    
    # Get all users
    result = supabase.table('leaderboard').select('*').execute()
    users = result.data
    
    print(f"Found {len(users)} users")
    print("\nSyncing levels...")
    print("-" * 80)
    
    fixed_count = 0
    
    for user in users:
        telegram_id = user.get('telegram_id')
        current_level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        
        # Calculate correct level based on XP system (like in game)
        xp = user.get('xp', 0) or 0
        if xp == 0:
            # If no XP, estimate from TAMA
            xp = int(tama * 0.1)
        
        # Calculate level from XP progression
        correct_level = 1
        xp_needed = 100
        
        while xp >= xp_needed:
            xp -= xp_needed
            correct_level += 1
            xp_needed = int(xp_needed * 1.5)
        
        if current_level != correct_level:
            print(f"User {telegram_id}:")
            print(f"  TAMA: {tama:,}")
            print(f"  Level: {current_level} -> {correct_level}")
            
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
    print("\nDone!")

if __name__ == "__main__":
    sync_all_levels()

