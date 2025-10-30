#!/usr/bin/env python3
"""
Fix user 7401131043 level
"""

from supabase import create_client, Client
import json

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get user
result = supabase.table('leaderboard').select('*').eq('telegram_id', '7401131043').execute()
user = result.data[0]

print("Current data:")
print(f"  Level: {user['level']}")
print(f"  TAMA: {user['tama']}")
print(f"  XP: {user['xp']}")

# Fix level: 553 -> 55
new_level = 55
new_xp = 3300
new_xp_to_level = 6600

# Update pet_data
pet_data = json.loads(user.get('pet_data', '{}'))
pet_data['xp'] = new_xp
pet_data['xpToLevel'] = new_xp_to_level

print("\nUpdating to:")
print(f"  Level: {new_level}")
print(f"  XP: {new_xp}/{new_xp_to_level}")

# Update
supabase.table('leaderboard').update({
    'level': new_level,
    'xp': new_xp,
    'pet_data': json.dumps(pet_data)
}).eq('telegram_id', '7401131043').execute()

print("\nDone! User 7401131043 fixed!")






