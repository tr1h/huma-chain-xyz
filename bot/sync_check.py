#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from supabase import create_client, Client
from datetime import datetime

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zfrazyupameidxpjihrh.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_sync_issues():
    """Проверяет проблемы синхронизации между таблицами"""
    print('Checking database synchronization...')
    print('=' * 50)
    
    try:
        # Получаем всех пользователей из leaderboard
        leaderboard_result = supabase.table('leaderboard').select('telegram_id').execute()
        leaderboard_users = set(user['telegram_id'] for user in leaderboard_result.data)
        print(f'Leaderboard users: {len(leaderboard_users)}')
        
        # Получаем всех пользователей из transactions
        transactions_result = supabase.table('transactions').select('user_id').execute()
        transaction_users = set(tx['user_id'] for tx in transactions_result.data)
        print(f'Transaction users: {len(transaction_users)}')
        
        # Находим пользователей в transactions, но не в leaderboard
        missing_in_leaderboard = transaction_users - leaderboard_users
        missing_in_transactions = leaderboard_users - transaction_users
        
        print(f'Users in transactions but NOT in leaderboard: {len(missing_in_leaderboard)}')
        if missing_in_leaderboard:
            print('Missing users:', list(missing_in_leaderboard)[:5])  # Показываем первые 5
        
        print(f'Users in leaderboard but NOT in transactions: {len(missing_in_transactions)}')
        if missing_in_transactions:
            print('Missing users:', list(missing_in_transactions)[:5])  # Показываем первые 5
        
        # Проверяем общее количество
        total_unique_users = len(leaderboard_users | transaction_users)
        print(f'Total unique users: {total_unique_users}')
        
        # Статус синхронизации
        if len(missing_in_leaderboard) == 0 and len(missing_in_transactions) == 0:
            print('OK: Database is fully synchronized!')
            return True
        else:
            print('WARNING: Database synchronization issues detected!')
            return False
            
    except Exception as e:
        print(f'ERROR: Error checking synchronization: {e}')
        return False

def auto_fix_missing_users():
    """Автоматически добавляет пользователей из transactions в leaderboard"""
    print('\nAuto-fixing missing users...')
    print('=' * 50)
    
    try:
        # Получаем пользователей в transactions, но не в leaderboard
        leaderboard_result = supabase.table('leaderboard').select('telegram_id').execute()
        leaderboard_users = set(user['telegram_id'] for user in leaderboard_result.data)
        
        transactions_result = supabase.table('transactions').select('user_id').execute()
        transaction_users = set(tx['user_id'] for tx in transactions_result.data)
        
        missing_users = transaction_users - leaderboard_users
        
        if not missing_users:
            print('OK: No missing users to fix!')
            return
        
        print(f'Found {len(missing_users)} missing users, fixing...')
        
        fixed_count = 0
        for user_id in missing_users:
            try:
                # Получаем последнюю транзакцию пользователя
                latest_tx = supabase.table('transactions').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(1).execute()
                
                if latest_tx.data:
                    tx = latest_tx.data[0]
                    current_balance = int(tx.get('balance_after', 0))
                    
                    # Добавляем пользователя в leaderboard
                    user_data = {
                        'telegram_id': user_id,
                        'tama': current_balance,
                        'level': 1,
                        'wallet_address': 'Not connected',
                        'created_at': datetime.now().isoformat(),
                        'last_activity': datetime.now().isoformat()
                    }
                    
                    supabase.table('leaderboard').insert(user_data).execute()
                    fixed_count += 1
                    print(f'  OK: Fixed user {user_id} with {current_balance} TAMA')
                    
            except Exception as e:
                print(f'  ERROR: Error fixing user {user_id}: {e}')
        
        print(f'OK: Fixed {fixed_count} users!')
        
    except Exception as e:
        print(f'ERROR: Error in auto-fix: {e}')

if __name__ == '__main__':
    # Проверяем синхронизацию
    is_synced = check_sync_issues()
    
    # Если есть проблемы - исправляем автоматически
    if not is_synced:
        auto_fix_missing_users()
        
        # Проверяем еще раз
        print('\nRe-checking after fix...')
        check_sync_issues()
    
    print('\nSync check completed!')
