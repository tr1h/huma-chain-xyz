#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import os

# Windows encoding fix
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ SUPABASE_URL or SUPABASE_KEY not found in .env")
    sys.exit(1)

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_user_data(telegram_id):
    """Check user data in leaderboard table"""
    try:
        # Get user data
        result = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
        
        if result.data:
            user = result.data[0]
            print(f"\n✅ User found: {telegram_id}")
            print(f"📊 TAMA: {user.get('tama', 0)}")
            print(f"📊 Level: {user.get('level', 1)}")
            print(f"📊 XP: {user.get('xp', 0)}")
            print(f"📊 Username: {user.get('username', 'N/A')}")
            print(f"📊 Last activity: {user.get('last_activity', 'N/A')}")
            
            # Check pet_data structure
            pet_data = user.get('pet_data')
            if pet_data:
                print(f"\n📦 Pet Data Type: {type(pet_data)}")
                print(f"📦 Pet Data: {pet_data}")
            
            return user
        else:
            print(f"\n❌ User not found: {telegram_id}")
            return None
            
    except Exception as e:
        print(f"\n❌ Error checking user data: {e}")
        return None

def test_update(telegram_id):
    """Test updating user data"""
    try:
        # Prepare test data
        test_data = {
            'tama': 56869,
            'level': 55,
            'pet_data': '{"hunger":100,"happiness":100,"health":100}',
            'last_activity': '2025-10-26T20:00:00Z'
        }
        
        print(f"\n🧪 Testing update with data:")
        print(test_data)
        
        # Try to update
        result = supabase.table('leaderboard').update(test_data).eq('telegram_id', telegram_id).execute()
        
        if result.data:
            print(f"\n✅ Update successful!")
            return True
        else:
            print(f"\n❌ Update failed - no data returned")
            return False
            
    except Exception as e:
        print(f"\n❌ Error updating: {e}")
        print(f"Error type: {type(e)}")
        return False

if __name__ == '__main__':
    telegram_id = 7401131043
    
    print("="*80)
    print("CHECKING USER DATA IN SUPABASE")
    print("="*80)
    
    # Check current data
    user = check_user_data(telegram_id)
    
    if user:
        # Test update
        print("\n" + "="*80)
        print("TESTING UPDATE")
        print("="*80)
        test_update(telegram_id)
        
        # Check again
        print("\n" + "="*80)
        print("CHECKING AFTER UPDATE")
        print("="*80)
        check_user_data(telegram_id)




