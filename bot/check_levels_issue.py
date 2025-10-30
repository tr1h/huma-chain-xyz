#!/usr/bin/env python3
"""
Check where levels come from and fix them
"""

from supabase import create_client, Client

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_user_levels():
    """Check user levels and their XP"""
    print("Checking user levels...")
    print("=" * 80)
    
    # Get all users
    result = supabase.table('leaderboard').select('*').order('tama', desc=True).execute()
    users = result.data
    
    print(f"Found {len(users)} users\n")
    
    for i, user in enumerate(users, 1):
        telegram_id = user.get('telegram_id')
        username = user.get('telegram_username', 'N/A')
        level = user.get('level', 1)
        tama = user.get('tama', 0) or 0
        xp = user.get('xp', 0) or 0
        
        # Check pet_data for XP info
        pet_data_str = user.get('pet_data', '{}')
        try:
            import json
            pet_data = json.loads(pet_data_str) if pet_data_str else {}
            xp_from_pet = pet_data.get('xp', 0)
            xp_to_level = pet_data.get('xpToLevel', 100)
        except:
            xp_from_pet = 0
            xp_to_level = 100
        
        # Calculate what level SHOULD be based on TAMA/100 (old formula)
        old_formula_level = max(1, int(tama / 100))
        
        print(f"{i}. User {telegram_id} (@{username})")
        print(f"   Current Level: {level}")
        print(f"   TAMA: {tama:,}")
        print(f"   XP (leaderboard): {xp}")
        print(f"   XP (pet_data): {xp_from_pet}")
        print(f"   XP to next level: {xp_to_level}")
        print(f"   Old formula (TAMA/100): {old_formula_level}")
        
        if level == old_formula_level:
            print(f"   STATUS: Using OLD FORMULA (TAMA/100)!")
        else:
            print(f"   STATUS: Custom level")
        
        print()

if __name__ == "__main__":
    check_user_levels()






