#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup economy_config table in Supabase
"""

import os
import sys
from supabase import create_client, Client

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def setup_economy_config():
    """Setup economy config table with default values"""
    print("=" * 80)
    print("SETTING UP ECONOMY CONFIG TABLE")
    print("=" * 80)
    print()
    
    # Check if table exists by trying to query it
    try:
        result = supabase.table('economy_config').select('*').execute()
        print("✅ Table 'economy_config' already exists!")
        print(f"   Found {len(result.data)} configs")
        
        # Show existing configs
        for config in result.data:
            active = "✅ ACTIVE" if config.get('is_active') else "⏸️  Inactive"
            print(f"\n   {active} - {config.get('config_name')}")
            print(f"      Base Reward: {config.get('base_click_reward')}")
            print(f"      Min Reward: {config.get('min_reward')}")
            print(f"      Max Combo: {config.get('max_combo_bonus')}")
            print(f"      Spam Penalty: {config.get('spam_penalty')}")
        
    except Exception as e:
        print(f"❌ Table doesn't exist or error: {e}")
        print("\n📝 Please create the table manually in Supabase SQL Editor:")
        print("   1. Go to Supabase Dashboard")
        print("   2. Open SQL Editor")
        print("   3. Run the SQL from 'create_economy_table.sql'")
        return
    
    print()
    print("=" * 80)
    print("SETUP COMPLETE!")
    print("=" * 80)
    print()
    print("Next steps:")
    print("1. Update economy-admin.html to connect to Supabase")
    print("2. Update bot.py to read config from database")
    print("3. Test the admin panel")

def get_active_config():
    """Get the active economy config"""
    try:
        result = supabase.table('economy_config').select('*').eq('is_active', True).execute()
        if result.data:
            config = result.data[0]
            print("\n✅ Active Config:")
            print(f"   Name: {config.get('config_name')}")
            print(f"   Base Reward: {config.get('base_click_reward')}")
            print(f"   Min Reward: {config.get('min_reward')}")
            print(f"   Max Combo: {config.get('max_combo_bonus')}")
            print(f"   Combo Window: {config.get('combo_window')}ms")
            print(f"   Combo Cooldown: {config.get('combo_cooldown')}ms")
            print(f"   Combo Divider: {config.get('combo_bonus_divider')}")
            print(f"   Spam Penalty: {config.get('spam_penalty')}")
            return config
        else:
            print("❌ No active config found!")
            return None
    except Exception as e:
        print(f"❌ Error getting active config: {e}")
        return None

def set_active_config(config_name):
    """Set a config as active"""
    try:
        # Deactivate all configs
        supabase.table('economy_config').update({'is_active': False}).neq('id', 0).execute()
        
        # Activate selected config
        result = supabase.table('economy_config').update({'is_active': True}).eq('config_name', config_name).execute()
        
        if result.data:
            print(f"✅ Config '{config_name}' is now active!")
            return True
        else:
            print(f"❌ Config '{config_name}' not found!")
            return False
    except Exception as e:
        print(f"❌ Error setting active config: {e}")
        return False

if __name__ == "__main__":
    setup_economy_config()
    print()
    get_active_config()

