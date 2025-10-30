#!/usr/bin/env python3
"""
Test database saving functionality
"""
import os
import sys

# Add parent directory to path
sys.path.append('..')

# Load environment variables
import codecs
with codecs.open('../.env', 'r', encoding='utf-8-sig') as f:
    env_content = f.read()
    for line in env_content.strip().split('\n'):
        if '=' in line and not line.startswith('#'):
            key, value = line.split('=', 1)
            os.environ[key.strip()] = value.strip()

from supabase import create_client, Client

def test_database_save():
    """Test if game data is being saved to database"""
    
    # Connect to Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Supabase credentials not found!")
        return
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("=== TESTING DATABASE SAVE ===")
    
    # Test user ID (Alex)
    test_user_id = "7401131043"
    
    # Simulate fresh game data
    test_data = {
        'level': 9,
        'tama': 3500,
        'hp': 100,
        'food': 90,
        'happy': 95,
        'totalClicks': 500
    }
    
    print(f"Testing save for user {test_user_id}")
    print(f"Game data: Level {test_data['level']}, TAMA {test_data['tama']:,}")
    
    try:
        # Get current data
        current = supabase.table('leaderboard').select('*').eq('telegram_id', test_user_id).execute()
        
        if current.data:
            current_user = current.data[0]
            current_tama = current_user.get('tama', 0)
            current_level = current_user.get('level', 1)
            game_tama = test_data.get('tama', 0)
            game_level = test_data.get('level', 1)
            
            print(f"Current database data:")
            print(f"  TAMA: {current_tama:,}")
            print(f"  Level: {current_level}")
            
            if game_tama > current_tama or game_level > current_level:
                # Update with new data
                result = supabase.table('leaderboard').update({
                    'tama': game_tama,
                    'level': game_level
                }).eq('telegram_id', test_user_id).execute()
                
                print(f"Database updated successfully!")
                print(f"  New TAMA: {game_tama:,}")
                print(f"  New Level: {game_level}")
                
                # Verify update
                verify = supabase.table('leaderboard').select('*').eq('telegram_id', test_user_id).execute()
                if verify.data:
                    updated_user = verify.data[0]
                    print(f"Verification:")
                    print(f"  TAMA: {updated_user.get('tama', 0):,}")
                    print(f"  Level: {updated_user.get('level', 1)}")
                
            else:
                print(f"No update needed (game data <= current)")
                
        else:
            print(f"User not found in database!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_database_save()
