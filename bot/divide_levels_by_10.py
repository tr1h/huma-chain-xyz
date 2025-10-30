#!/usr/bin/env python3
"""
Divide all user levels by 10 to make them more reasonable
"""

from supabase import create_client, Client
import json
import math

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def calculate_xp_for_level(level):
    """Calculate XP needed for a level"""
    if level <= 1:
        return 100
    if level <= 10:
        xp = 100
        for i in range(1, level):
            xp = math.floor(xp * 1.5)
        return xp
    else:
        return 1000 + (level * 100)

def divide_all_levels():
    """Divide all user levels by 10"""
    print("=" * 80)
    print("DIVIDING ALL LEVELS BY 10")
    print("=" * 80)
    print()
    
    # Get all users
    result = supabase.table('leaderboard').select('*').order('level', desc=True).execute()
    users = result.data
    
    print(f"Found {len(users)} users to update\n")
    
    for i, user in enumerate(users, 1):
        telegram_id = user.get('telegram_id')
        old_level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        
        # Divide level by 10 (minimum 1)
        new_level = max(1, old_level // 10)
        
        # Calculate XP for new level (50% progress)
        xp_to_level = calculate_xp_for_level(new_level + 1)
        current_xp = int(xp_to_level * 0.5)
        
        # Update pet_data
        pet_data_str = user.get('pet_data', '{}')
        try:
            pet_data = json.loads(pet_data_str) if pet_data_str else {}
        except:
            pet_data = {}
        
        pet_data['xp'] = current_xp
        pet_data['xpToLevel'] = xp_to_level
        
        print(f"{i}. User {telegram_id}")
        print(f"   Old Level: {old_level}")
        print(f"   New Level: {new_level} (/10)")
        print(f"   TAMA: {tama:,}")
        print(f"   XP: {current_xp}/{xp_to_level}")
        
        # Update database
        supabase.table('leaderboard').update({
            'level': new_level,
            'xp': current_xp,
            'pet_data': json.dumps(pet_data)
        }).eq('telegram_id', telegram_id).execute()
        
        print(f"   STATUS: UPDATED")
        print()
    
    print("=" * 80)
    print("SUMMARY:")
    print(f"  Total users updated: {len(users)}")
    print(f"  All levels divided by 10")
    print(f"  XP system active")
    print("=" * 80)
    print()
    print("Examples:")
    print("  Level 1773 -> Level 177")
    print("  Level 794 -> Level 79")
    print("  Level 553 -> Level 55")
    print("  Level 178 -> Level 17")
    print("  Level 80 -> Level 8")
    print("  Level 56 -> Level 5")

if __name__ == "__main__":
    divide_all_levels()
    print("\nDone! Players should refresh their game.")

