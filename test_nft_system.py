"""
Test NFT System - Проверка работы NFT множителей
"""
import os
import sys
import time
from supabase import create_client

# Supabase config
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://bvyigfxoaahwvfcdfhsr.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eWlnZnhvYWFod3ZmY2RmaHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNjU0MTEsImV4cCI6MjA0NTY0MTQxMX0.O3vR5rGj7VEYnz48HfAKNaFuZsL8tXGrXFNiU7m5G-8')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Import NFT system
sys.path.append('bot')
from nft_system import NFTSystem

nft_system = NFTSystem(supabase)

def test_database_tables():
    """Проверка наличия таблиц"""
    print("=" * 60)
    print("TEST 1: Проверка таблиц в базе данных")
    print("=" * 60)
    
    try:
        # Проверка nft_tiers
        result = supabase.table('nft_tiers').select('*').limit(1).execute()
        if result.data:
            print("[OK] Таблица 'nft_tiers' существует")
            tiers = supabase.table('nft_tiers').select('*').execute()
            print(f"   Найдено тиров: {len(tiers.data)}")
            for tier in tiers.data:
                print(f"   - {tier['tier_name']}: {tier['tama_price']} TAMA / {tier['sol_price']} SOL")
        else:
            print("[ERROR] Таблица 'nft_tiers' пуста или не существует")
            print("   -> Запусти create_nft_tiers_table.sql в Supabase!")
            return False
    except Exception as e:
        print(f"[ERROR] Ошибка проверки nft_tiers: {e}")
        print("   -> Запусти create_nft_tiers_table.sql в Supabase!")
        return False
    
    try:
        # Проверка user_nfts
        result = supabase.table('user_nfts').select('*').limit(1).execute()
        print("[OK] Таблица 'user_nfts' существует")
        return True
    except Exception as e:
        print(f"❌ Ошибка проверки user_nfts: {e}")
        print("   → Запусти create_nft_tiers_table.sql в Supabase!")
        return False

def test_nft_multiplier():
    """Проверка NFT множителя"""
    print("\n" + "=" * 60)
    print("TEST 2: Проверка NFT множителя")
    print("=" * 60)
    
    test_user_id = "7401131043"  # Твой Telegram ID
    
    # Тест 1: Пользователь без NFT
    multiplier = nft_system.get_user_multiplier(test_user_id)
    print(f"\n1. Пользователь БЕЗ NFT:")
    print(f"   Множитель: {multiplier}x")
    if multiplier == 1.0:
        print("   [OK] Правильно! Без NFT = 1.0x (обычный заработок)")
    else:
        print(f"   [WARN] Ожидалось 1.0x, получено {multiplier}x")
    
    # Тест 2: Добавление тестового NFT
    print(f"\n2. Добавление тестового NFT (Bronze Common):")
    try:
        success, msg, mult = nft_system.register_nft_mint(
            telegram_id=test_user_id,
            nft_mint_address="TEST_NFT_" + str(int(time.time())),
            tier_name="Bronze",
            rarity="Common"
        )
        if success:
            print(f"   [OK] NFT зарегистрирован!")
            print(f"   Сообщение: {msg}")
            print(f"   Множитель: {mult}x")
            
            # Проверка множителя после регистрации
            new_multiplier = nft_system.get_user_multiplier(test_user_id)
            print(f"\n3. Проверка множителя ПОСЛЕ регистрации NFT:")
            print(f"   Множитель: {new_multiplier}x")
            if new_multiplier == 2.0:
                print("   [OK] Правильно! Bronze Common = 2.0x")
            else:
                print(f"   [WARN] Ожидалось 2.0x, получено {new_multiplier}x")
        else:
            print(f"   [ERROR] Ошибка: {msg}")
    except Exception as e:
        print(f"   [ERROR] Ошибка регистрации NFT: {e}")

def test_tier_prices():
    """Проверка цен тиров"""
    print("\n" + "=" * 60)
    print("TEST 3: Проверка цен тиров")
    print("=" * 60)
    
    prices = nft_system.get_tier_prices()
    for tier_name, tier_data in prices.items():
        print(f"\n{tier_name}:")
        print(f"   TAMA: {tier_data['tama']:,}")
        print(f"   SOL: {tier_data['sol']}")
        print(f"   Base Multiplier: {tier_data['multiplier']}x")

def test_rarity_assignment():
    """Проверка случайной редкости"""
    print("\n" + "=" * 60)
    print("TEST 4: Проверка случайной редкости")
    print("=" * 60)
    
    tiers = ['Bronze', 'Silver', 'Gold']
    for tier in tiers:
        print(f"\n{tier} Tier:")
        results = {'Common': 0, 'Uncommon': 0, 'Rare': 0, 'Epic': 0, 'Legendary': 0}
        
        # 1000 попыток для статистики
        for _ in range(1000):
            rarity = nft_system.assign_random_rarity(tier)
            results[rarity] = results.get(rarity, 0) + 1
        
        print("   Распределение (1000 попыток):")
        for rarity, count in results.items():
            percentage = (count / 1000) * 100
            print(f"   {rarity}: {count} ({percentage:.1f}%)")

def test_sql_function():
    """Проверка SQL функции"""
    print("\n" + "=" * 60)
    print("TEST 5: Проверка SQL функции get_user_nft_multiplier()")
    print("=" * 60)
    
    test_user_id = "7401131043"
    
    try:
        result = supabase.rpc('get_user_nft_multiplier', {
            'user_telegram_id': test_user_id
        }).execute()
        
        if result.data is not None:
            multiplier = float(result.data)
            print(f"   [OK] SQL функция работает!")
            print(f"   Множитель для {test_user_id}: {multiplier}x")
        else:
            print("   [WARN] SQL функция вернула NULL (пользователь без NFT)")
    except Exception as e:
        print(f"   [ERROR] Ошибка SQL функции: {e}")
        print("   -> Убедись, что функция создана в Supabase!")

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("NFT SYSTEM TEST SUITE")
    print("=" * 60 + "\n")
    
    # Запуск тестов
    if test_database_tables():
        test_nft_multiplier()
        test_tier_prices()
        test_rarity_assignment()
        test_sql_function()
    
    print("\n" + "=" * 60)
    print("[OK] ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")
    print("=" * 60)
    print("\nСледующие шаги:")
    print("1. Если таблицы не созданы -> запусти create_nft_tiers_table.sql")
    print("2. Если SQL функция не работает -> проверь создание функции")
    print("3. Проверь бота: при награде должно быть 'NFT Boost applied'")
    print("\n")

