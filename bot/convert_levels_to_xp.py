#!/usr/bin/env python3
"""
Convert current levels to proper XP amounts
Keep players at their current level but with correct XP system
"""

from supabase import create_client, Client
import json
import math

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def calculate_xp_to_level(level):
    """Calculate XP needed for a specific level"""
    # Level 1: 100 XP
    # Level 2: 150 XP
    # Level 3: 225 XP
    # Each level requires 50% more than previous
    # Cap at reasonable level to avoid overflow
    if level > 100:
        # For very high levels, use simpler formula
        return 100000 + (level - 100) * 1000
    
    xp_to_level = 100
    for i in range(1, min(level, 100)):
        xp_to_level = math.floor(xp_to_level * 1.5)
    return xp_to_level

def convert_all_levels():
    """Convert all user levels to XP system"""
    print("=" * 80)
    print("CONVERTING LEVELS TO XP SYSTEM")
    print("=" * 80)
    print()
    
    # Get all users
    result = supabase.table('leaderboard').select('*').order('level', desc=True).execute()
    users = result.data
    
    print(f"Found {len(users)} users to convert\n")
    
    for i, user in enumerate(users, 1):
        telegram_id = user.get('telegram_id')
        current_level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        
        # Calculate proper XP for this level
        # Put them at 50% progress to next level
        # Use simple formula to avoid overflow
        if current_level <= 10:
            xp_to_level = calculate_xp_to_level(current_level + 1)
            current_xp = int(xp_to_level * 0.5)
        else:
            # For higher levels, use simpler progression
            xp_to_level = 1000 + (current_level * 100)
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
        print(f"   Level: {current_level}")
        print(f"   TAMA: {tama:,}")
        print(f"   XP: {current_xp}/{xp_to_level} (50% to Level {current_level + 1})")
        
        # Update database
        supabase.table('leaderboard').update({
            'xp': current_xp,
            'pet_data': json.dumps(pet_data)
        }).eq('telegram_id', telegram_id).execute()
        
        print(f"   STATUS: CONVERTED TO XP SYSTEM")
        print()
    
    print("=" * 80)
    print("SUMMARY:")
    print(f"  Total users converted: {len(users)}")
    print(f"  All users keep their current level")
    print(f"  XP system now active")
    print(f"  Players are at 50% progress to next level")
    print("=" * 80)
    print()
    print("How XP system works:")
    print("  - Each click gives 3-8 XP (base + combo bonus)")
    print("  - Level up when XP >= xpToLevel")
    print("  - xpToLevel increases by 50% each level")
    print("  - Level up gives: TAMA bonus + stat increases")
    print()
    print("Example progression:")
    for level in [1, 2, 3, 5, 10, 20, 50]:
        xp_needed = calculate_xp_to_level(level + 1)
        print(f"  Level {level} -> {level + 1}: need {xp_needed:,} XP")

if __name__ == "__main__":
    convert_all_levels()
    print("\nDone! Players should refresh their game.")

