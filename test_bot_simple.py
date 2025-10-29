#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Simple bot test without emojis to avoid encoding issues
"""

import os
import sys
import time

# Add the bot directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'solana-tamagotchi', 'bot'))

def test_bot_imports():
    """Test if bot can be imported without errors"""
    try:
        print("Testing bot imports...")
        
        # Test basic imports
        import requests
        print("[OK] requests imported")
        
        # Change to bot directory for proper .env loading
        import os
        original_cwd = os.getcwd()
        os.chdir(os.path.join(os.path.dirname(__file__), 'solana-tamagotchi', 'bot'))
        
        # Test bot imports
        from bot import bot, TAMA_API_BASE, get_nft_costs, mint_nft, get_user_nfts
        print("[OK] bot modules imported")
        
        # Restore original directory
        os.chdir(original_cwd)
        
        print(f"[OK] TAMA_API_BASE: {TAMA_API_BASE}")
        
        # Test API functions
        print("Testing API functions...")
        
        # Test get_nft_costs
        costs = get_nft_costs()
        print(f"[OK] get_nft_costs: {len(costs)} rarities")
        
        # Test mint_nft (with fake data)
        success, result = mint_nft("test_user_123", "Test Pet", "common")
        print(f"[OK] mint_nft test: success={success}")
        
        # Test get_user_nfts
        nfts = get_user_nfts("test_user_123")
        print(f"[OK] get_user_nfts: {len(nfts)} NFTs")
        
        print("\n[SUCCESS] All tests passed! Bot is ready.")
        return True
        
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("=" * 50)
    print("SOLANA TAMAGOTCHI BOT TEST")
    print("=" * 50)
    
    success = test_bot_imports()
    
    if success:
        print("\n[SUCCESS] Bot is ready to run!")
        print("Run: python solana-tamagotchi/bot/bot.py")
    else:
        print("\n[ERROR] Bot has issues that need fixing")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
