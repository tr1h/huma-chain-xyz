#!/usr/bin/env python3
"""
Reset all users to XP-based level system
Start everyone at Level 1 with proper XP progression
"""

from supabase import create_client, Client
import json

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def reset_all_to_xp_system():
    """Reset all users to start with XP system"""
    print("=" * 80)
    print("RESETTING ALL USERS TO XP SYSTEM")
    print("=" * 80)
    print()
    
    # Get all users
    result = supabase.table('leaderboard').select('*').execute()
    users = result.data
    
    print(f"Found {len(users)} users to reset\n")
    
    for i, user in enumerate(users, 1):
        telegram_id = user.get('telegram_id')
        old_level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        
        # Reset to Level 1 with XP system
        new_level = 1
        new_xp = 0
        new_xp_to_level = 100
        
        # Update pet_data to include XP info
        pet_data_str = user.get('pet_data', '{}')
        try:
            pet_data = json.loads(pet_data_str) if pet_data_str else {}
        except:
            pet_data = {}
        
        pet_data['xp'] = new_xp
        pet_data['xpToLevel'] = new_xp_to_level
        
        print(f"{i}. User {telegram_id}")
        print(f"   Old Level: {old_level}")
        print(f"   TAMA: {tama:,}")
        print(f"   New Level: {new_level}")
        print(f"   XP: {new_xp}/{new_xp_to_level}")
        
        # Update database
        supabase.table('leaderboard').update({
            'level': new_level,
            'xp': new_xp,
            'pet_data': json.dumps(pet_data)
        }).eq('telegram_id', telegram_id).execute()
        
        print(f"   STATUS: RESET TO XP SYSTEM")
        print()
    
    print("=" * 80)
    print("SUMMARY:")
    print(f"  Total users reset: {len(users)}")
    print(f"  All users now at Level 1")
    print(f"  XP system active")
    print("=" * 80)
    print()
    print("Players will now level up through XP:")
    print("  - Clicks give XP")
    print("  - Level up when XP >= xpToLevel")
    print("  - Each level requires 50% more XP")
    print("  - Level up gives TAMA bonus + stat increases")

if __name__ == "__main__":
    print("\nWARNING: This will reset ALL user levels to 1!")
    print("Their TAMA will remain, but levels will restart with XP system.")
    response = input("\nAre you sure? Type 'yes' to continue: ")
    
    if response.lower() == 'yes':
        reset_all_to_xp_system()
        print("\nDone! Players should refresh their game.")
    else:
        print("Cancelled.")






