#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Economy Config Module
Handles loading and caching of economy configuration from Supabase
"""

import os
import sys
import json
from datetime import datetime, timedelta
from supabase import create_client, Client

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Initialize Supabase
SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cache for economy config
_economy_config_cache = None
_cache_timestamp = None
_cache_duration = timedelta(minutes=5)  # Cache for 5 minutes

# Default config (fallback)
DEFAULT_CONFIG = {
    'BASE_CLICK_REWARD': 1.0,
    'MIN_REWARD': 0.5,
    'MAX_COMBO_BONUS': 10,
    'COMBO_WINDOW': 2500,  # milliseconds
    'COMBO_COOLDOWN': 800,  # milliseconds
    'COMBO_BONUS_DIVIDER': 5,
    'SPAM_PENALTY': 0.5  # 50%
}

def get_economy_config(force_refresh=False):
    """
    Get economy configuration from database with caching
    
    Args:
        force_refresh: Force refresh from database, ignoring cache
        
    Returns:
        dict: Economy configuration
    """
    global _economy_config_cache, _cache_timestamp
    
    # Check if cache is valid
    if not force_refresh and _economy_config_cache and _cache_timestamp:
        if datetime.now() - _cache_timestamp < _cache_duration:
            return _economy_config_cache
    
    # Load from database
    try:
        result = supabase.table('economy_config').select('*').eq('is_active', True).execute()
        
        if result.data and len(result.data) > 0:
            config_data = result.data[0]
            
            # Convert to game config format
            config = {
                'BASE_CLICK_REWARD': float(config_data.get('base_click_reward', 1.0)),
                'MIN_REWARD': float(config_data.get('min_reward', 0.5)),
                'MAX_COMBO_BONUS': int(config_data.get('max_combo_bonus', 10)),
                'COMBO_WINDOW': int(config_data.get('combo_window', 2500)),
                'COMBO_COOLDOWN': int(config_data.get('combo_cooldown', 800)),
                'COMBO_BONUS_DIVIDER': int(config_data.get('combo_bonus_divider', 5)),
                'SPAM_PENALTY': float(config_data.get('spam_penalty', 0.5))
            }
            
            # Update cache
            _economy_config_cache = config
            _cache_timestamp = datetime.now()
            
            print(f"✅ Economy config loaded from database: {config_data.get('config_name')}")
            return config
        else:
            print("⚠️ No active economy config found in database, using default")
            return DEFAULT_CONFIG
            
    except Exception as e:
        print(f"❌ Error loading economy config from database: {e}")
        print("⚠️ Using default config")
        return DEFAULT_CONFIG

def clear_cache():
    """Clear the economy config cache"""
    global _economy_config_cache, _cache_timestamp
    _economy_config_cache = None
    _cache_timestamp = None
    print("🔄 Economy config cache cleared")

def get_config_info():
    """Get information about current config"""
    config = get_economy_config()
    
    print("\n" + "=" * 80)
    print("CURRENT ECONOMY CONFIG")
    print("=" * 80)
    print(f"Base Click Reward: {config['BASE_CLICK_REWARD']}")
    print(f"Min Reward: {config['MIN_REWARD']}")
    print(f"Max Combo Bonus: {config['MAX_COMBO_BONUS']}")
    print(f"Combo Window: {config['COMBO_WINDOW']}ms")
    print(f"Combo Cooldown: {config['COMBO_COOLDOWN']}ms")
    print(f"Combo Bonus Divider: {config['COMBO_BONUS_DIVIDER']}")
    print(f"Spam Penalty: {config['SPAM_PENALTY']} ({int(config['SPAM_PENALTY'] * 100)}%)")
    print("=" * 80)
    
    # Calculate some example values
    normal_click = config['BASE_CLICK_REWARD']
    spam_click = max(config['MIN_REWARD'], config['BASE_CLICK_REWARD'] * (1 - config['SPAM_PENALTY']))
    combo_10 = config['BASE_CLICK_REWARD'] + min(10 // config['COMBO_BONUS_DIVIDER'], config['MAX_COMBO_BONUS'])
    combo_50 = config['BASE_CLICK_REWARD'] + min(50 // config['COMBO_BONUS_DIVIDER'], config['MAX_COMBO_BONUS'])
    
    print("\nEXAMPLE REWARDS:")
    print(f"Normal Click: {normal_click} TAMA")
    print(f"Spam Click: {spam_click} TAMA")
    print(f"Combo x10: {combo_10} TAMA")
    print(f"Combo x50: {combo_50} TAMA")
    print("=" * 80)
    print()

if __name__ == "__main__":
    # Test the module
    print("Testing Economy Config Module...")
    print()
    
    # Get config
    config = get_economy_config()
    get_config_info()
    
    # Test cache
    print("Testing cache...")
    config2 = get_economy_config()
    print("✅ Cache working!" if config == config2 else "❌ Cache not working!")
    print()
    
    # Clear cache
    clear_cache()
    print("Cache cleared, loading again...")
    config3 = get_economy_config()
    print("✅ Config reloaded!")

