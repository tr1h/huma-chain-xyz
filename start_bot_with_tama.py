#!/usr/bin/env python3
"""
Start Solana Tamagotchi Bot with TAMA Integration
Запуск бота с интеграцией TAMA токенов
"""

import os
import sys
import subprocess
import time

def check_api_server():
    """Проверить, запущен ли TAMA API сервер"""
    try:
        import requests
        response = requests.get("http://localhost:8002/api/tama/test", timeout=5)
        if response.status_code == 200:
            result = response.json()
            return result.get("success", False)
    except:
        pass
    return False

def start_api_server():
    """Запустить TAMA API сервер"""
    print("Starting TAMA API Server...")
    
    # Check if Node.js is available
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
    except:
        print("Node.js not found! Please install Node.js first.")
        return False
    
    # Start API server in background
    try:
        process = subprocess.Popen(
            ["node", "api/tama_supabase_api.js"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for server to start
        time.sleep(3)
        
        # Check if server is running
        if check_api_server():
            print("✅ TAMA API Server started successfully!")
            return True
        else:
            print("❌ Failed to start TAMA API Server")
            return False
            
    except Exception as e:
        print(f"❌ Error starting API server: {e}")
        return False

def start_bot():
    """Запустить Telegram бота"""
    print("🤖 Starting Telegram Bot...")
    
    # Change to bot directory
    bot_dir = "solana-tamagotchi/bot"
    if not os.path.exists(bot_dir):
        print(f"❌ Bot directory not found: {bot_dir}")
        return False
    
    try:
        # Start bot
        os.chdir(bot_dir)
        subprocess.run([sys.executable, "bot.py"])
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    except Exception as e:
        print(f"❌ Error starting bot: {e}")
    finally:
        os.chdir("../..")

def main():
    """Основная функция"""
    print("Solana Tamagotchi Bot with TAMA Integration")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("api/tama_supabase_api.js"):
        print("❌ Please run this script from the project root directory")
        return
    
    # Check if API server is already running
    if check_api_server():
        print("✅ TAMA API Server is already running!")
    else:
        # Start API server
        if not start_api_server():
            print("❌ Cannot start without TAMA API Server")
            return
    
    print("\n🎯 Starting Telegram Bot...")
    print("💡 Bot commands available:")
    print("   /tama - Check TAMA balance")
    print("   /earn - How to earn TAMA")
    print("   /spend - How to spend TAMA")
    print("   /daily - Daily rewards")
    print("   /stats - User statistics")
    print("   /tama_leaderboard - TAMA leaderboard")
    print("   /tama_test - Test TAMA API (admin only)")
    print("\n🚀 Bot is starting...")
    
    # Start bot
    start_bot()

if __name__ == "__main__":
    main()
