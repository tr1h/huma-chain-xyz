"""
🔧 @Developer: Интеграция Analytics в Telegram бота

Этот файл добавляет команды аналитики в bot.py
Копируй и вставляй код блоками в bot.py!
"""

# ===================================================================
# ШАГ 1: ДОБАВИТЬ IMPORTS В НАЧАЛО bot.py (после других imports)
# ===================================================================

"""
# Import analytics system
try:
    from analytics import (
        init_analytics,
        format_daily_report,
        format_weekly_report,
        format_quick_health,
        check_critical_alerts
    )
    ANALYTICS_ENABLED = True
    print("✅ Analytics system enabled")
except Exception as e:
    ANALYTICS_ENABLED = False
    print(f"⚠️ Analytics system disabled: {e}")
"""

# ===================================================================
# ШАГ 2: ИНИЦИАЛИЗИРОВАТЬ ANALYTICS (после создания supabase client)
# ===================================================================

"""
# Initialize Analytics (after supabase client is created)
analytics_collector = None
if ANALYTICS_ENABLED:
    try:
        analytics_collector = init_analytics(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"⚠️ Failed to initialize analytics: {e}")
        ANALYTICS_ENABLED = False
"""

# ===================================================================
# ШАГ 3: ДОБАВИТЬ КОМАНДЫ В bot.py (в секцию ADMIN COMMANDS)
# ===================================================================

ADMIN_COMMANDS_CODE = """
# ===================================================================
# ANALYTICS COMMANDS (Admin only)
# ===================================================================

@bot.message_handler(commands=['analytics'], func=lambda message: message.chat.type == 'private')
def analytics_menu(message):
    \"\"\"Показать меню аналитики (только для админа)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics system not available")
        return
    
    menu_text = \"\"\"📊 **ANALYTICS MENU**

Available commands:

🎯 `/health` - Quick health check
📊 `/daily_report` - Full daily report
📅 `/weekly_report` - Weekly report + top players
💰 `/economy` - TAMA economy details
👥 `/players` - Player statistics
🎨 `/nfts` - NFT sales & revenue
🔥 `/burnmint` - Burn/Mint tracking

📈 Use any command to get detailed analytics!
\"\"\"
    
    bot.reply_to(message, menu_text, parse_mode='Markdown')


@bot.message_handler(commands=['health'], func=lambda message: message.chat.type == 'private')
def quick_health_check(message):
    \"\"\"Быстрый health check (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Получить health
        health = analytics_collector.get_health_score()
        report = format_quick_health(health)
        
        bot.reply_to(message, report, parse_mode='Markdown')
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {e}")
        logger.error(f"Health check error: {e}")


@bot.message_handler(commands=['daily_report'], func=lambda message: message.chat.type == 'private')
def send_daily_report(message):
    \"\"\"Отправить ежедневный отчёт (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Собрать данные
        health = analytics_collector.get_health_score()
        report = format_daily_report(health)
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
        # Отправить alerts отдельным сообщением если есть
        if health.get('alerts'):
            alerts_msg = "🚨 **CRITICAL ALERTS:**\\n\\n"
            alerts_msg += "\\n".join(health['alerts'])
            bot.send_message(message.chat.id, alerts_msg, parse_mode='Markdown')
            
    except Exception as e:
        bot.reply_to(message, f"❌ Error generating report: {e}")
        logger.error(f"Daily report error: {e}")


@bot.message_handler(commands=['weekly_report'], func=lambda message: message.chat.type == 'private')
def send_weekly_report(message):
    \"\"\"Отправить еженедельный отчёт (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Собрать данные
        health = analytics_collector.get_health_score()
        top_players = analytics_collector.get_top_players(limit=10)
        report = format_weekly_report(health, top_players)
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error generating report: {e}")
        logger.error(f"Weekly report error: {e}")


@bot.message_handler(commands=['economy'], func=lambda message: message.chat.type == 'private')
def show_economy_details(message):
    \"\"\"Показать детали TAMA экономики (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Получить данные
        economy = analytics_collector.get_tama_economy()
        burn_mint = analytics_collector.get_burn_mint_ratio(days=7)
        
        report = f\"\"\"💰 **TAMA ECONOMY**

📊 **Supply**
• Circulating: {economy['circulating']:,} TAMA
• Avg Balance: {economy['avg_balance']:,} TAMA
• Top 10 Hold: {economy['top10_percentage']}%

🔥 **Burn/Mint (7 days)**
• Burned: {burn_mint['burned']:,} TAMA
• Minted: {burn_mint['minted']:,} TAMA
• Ratio: {burn_mint['ratio']} {burn_mint['status']}

{burn_mint['status']} Status:
• 🟢 >0.8 = Healthy deflation
• 🟡 0.5-0.8 = Balanced
• 🔴 <0.5 = Inflation warning
\"\"\"
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {e}")
        logger.error(f"Economy details error: {e}")


@bot.message_handler(commands=['players'], func=lambda message: message.chat.type == 'private')
def show_player_stats(message):
    \"\"\"Показать статистику игроков (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Получить данные
        players = analytics_collector.get_player_stats()
        active = analytics_collector.get_active_users()
        retention = analytics_collector.get_retention_stats()
        
        report = f\"\"\"👥 **PLAYER STATISTICS**

📊 **Total Players**
• Total: {players['total']:,}
• New (24h): +{players['new_24h']}
• New (7d): +{players['new_7d']}

📈 **Activity**
• DAU: {active['dau']}
• WAU: {active['wau']}
• MAU: {active['mau']}
• Stickiness: {(active['dau']/active['mau']*100) if active['mau'] > 0 else 0:.1f}%

🎮 **Game Progress**
• Avg Level: {players['avg_level']}
• Max Level: {players['max_level']}

📊 **Retention**
• Day 1: {retention['day1_retention']}% {retention['status']}

Target benchmarks:
• Day 1 Retention: >40%
• DAU/MAU: >30%
\"\"\"
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {e}")
        logger.error(f"Player stats error: {e}")


@bot.message_handler(commands=['nfts'], func=lambda message: message.chat.type == 'private')
def show_nft_stats(message):
    \"\"\"Показать NFT статистику (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Получить данные
        nfts = analytics_collector.get_nft_stats()
        
        # Форматировать breakdown по тирам
        tier_text = ""
        for tier, count in nfts['by_tier'].items():
            tier_text += f"• {tier}: {count}\\n"
        
        report = f\"\"\"🎨 **NFT & REVENUE**

📊 **Sales**
• Total NFTs: {nfts['total']}
• This Week: +{nfts['this_week']}
• Conversion: {nfts['conversion_rate']}%

💰 **Revenue**
• SOL Earned: {nfts['sol_revenue']} SOL
• USD Equiv: ~${nfts['sol_revenue'] * 200:.0f}

📦 **By Tier**
{tier_text if tier_text else '• No data yet'}

🎯 **Targets**
• Conversion: >15%
• Weekly Sales: >10 NFTs
\"\"\"
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {e}")
        logger.error(f"NFT stats error: {e}")


@bot.message_handler(commands=['burnmint'], func=lambda message: message.chat.type == 'private')
def show_burn_mint_tracking(message):
    \"\"\"Показать Burn/Mint tracking (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # Получить данные за разные периоды
        day1 = analytics_collector.get_burn_mint_ratio(days=1)
        day7 = analytics_collector.get_burn_mint_ratio(days=7)
        day30 = analytics_collector.get_burn_mint_ratio(days=30)
        
        report = f\"\"\"🔥 **BURN/MINT TRACKING**

📊 **Last 24 Hours**
• Burned: {day1['burned']:,} TAMA
• Minted: {day1['minted']:,} TAMA
• Ratio: {day1['ratio']} {day1['status']}

📊 **Last 7 Days**
• Burned: {day7['burned']:,} TAMA
• Minted: {day7['minted']:,} TAMA
• Ratio: {day7['ratio']} {day7['status']}

📊 **Last 30 Days**
• Burned: {day30['burned']:,} TAMA
• Minted: {day30['minted']:,} TAMA
• Ratio: {day30['ratio']} {day30['status']}

━━━━━━━━━━━━━━━━━━

🎯 **Health Guidelines**
• 🟢 >0.8 = Strong deflation
• 🟡 0.5-0.8 = Balanced
• 🔴 <0.5 = Inflation concern

📝 **Burn Sources**
• NFT Mints (40%)
• Withdrawals (5%)
• Jackpot Pool (5%)

💰 **Mint Sources**
• Game Rewards
• Daily NFT Rewards
• Referrals
• Quests/Events
\"\"\"
        
        bot.reply_to(message, report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {e}")
        logger.error(f"Burn/mint tracking error: {e}")
"""

# ===================================================================
# ШАГ 4: ДОБАВИТЬ SCHEDULED JOBS (перед bot.polling())
# ===================================================================

SCHEDULED_JOBS_CODE = """
# ===================================================================
# SCHEDULED ANALYTICS REPORTS
# ===================================================================

def send_daily_analytics():
    \"\"\"Отправить ежедневный отчёт всем админам (автоматически)\"\"\"
    if not ANALYTICS_ENABLED or not analytics_collector:
        return
    
    try:
        logger.info("📊 Generating scheduled daily analytics...")
        
        # Собрать данные
        health = analytics_collector.get_health_score()
        report = format_daily_report(health)
        
        # Отправить всем админам
        for admin_id in ADMIN_IDS:
            try:
                bot.send_message(admin_id, report, parse_mode='Markdown')
                
                # Если есть критические алерты - отправить отдельно
                if health.get('alerts'):
                    alerts_msg = "🚨 **CRITICAL ALERTS:**\\n\\n"
                    alerts_msg += "\\n".join(health['alerts'])
                    bot.send_message(admin_id, alerts_msg, parse_mode='Markdown')
                
                logger.info(f"✅ Daily report sent to admin {admin_id}")
            except Exception as e:
                logger.error(f"❌ Failed to send to admin {admin_id}: {e}")
    
    except Exception as e:
        logger.error(f"❌ Error in scheduled daily analytics: {e}")


def send_weekly_analytics():
    \"\"\"Отправить еженедельный отчёт (по понедельникам)\"\"\"
    if not ANALYTICS_ENABLED or not analytics_collector:
        return
    
    try:
        logger.info("📊 Generating scheduled weekly analytics...")
        
        # Собрать данные
        health = analytics_collector.get_health_score()
        top_players = analytics_collector.get_top_players(limit=10)
        report = format_weekly_report(health, top_players)
        
        # Отправить всем админам
        for admin_id in ADMIN_IDS:
            try:
                bot.send_message(admin_id, report, parse_mode='Markdown')
                logger.info(f"✅ Weekly report sent to admin {admin_id}")
            except Exception as e:
                logger.error(f"❌ Failed to send to admin {admin_id}: {e}")
    
    except Exception as e:
        logger.error(f"❌ Error in scheduled weekly analytics: {e}")


def check_and_alert():
    \"\"\"Проверить критические события и отправить алерты\"\"\"
    if not ANALYTICS_ENABLED or not analytics_collector:
        return
    
    try:
        # Проверить критические алерты
        alerts = check_critical_alerts(analytics_collector)
        
        if alerts:
            logger.warning(f"⚠️ Critical alerts detected: {len(alerts)}")
            
            # Отправить всем админам
            alert_msg = "🚨 **CRITICAL ALERT**\\n\\n"
            alert_msg += "\\n".join(alerts)
            
            for admin_id in ADMIN_IDS:
                try:
                    bot.send_message(admin_id, alert_msg, parse_mode='Markdown')
                except Exception as e:
                    logger.error(f"Failed to send alert to admin {admin_id}: {e}")
    
    except Exception as e:
        logger.error(f"Error in alert check: {e}")


# Schedule jobs
if ANALYTICS_ENABLED:
    # Ежедневный отчёт в 9:00
    schedule.every().day.at("09:00").do(send_daily_analytics)
    
    # Еженедельный отчёт по понедельникам в 10:00
    schedule.every().monday.at("10:00").do(send_weekly_analytics)
    
    # Проверка критических событий каждый час
    schedule.every().hour.do(check_and_alert)
    
    logger.info("✅ Analytics scheduled jobs configured")
"""

# ===================================================================
# ШАГ 5: MANUAL COMMAND FOR TESTING
# ===================================================================

TEST_COMMAND_CODE = """
@bot.message_handler(commands=['test_analytics'])
def test_analytics_system(message):
    \"\"\"Тестовая команда для проверки analytics (админ)\"\"\"
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not ANALYTICS_ENABLED or not analytics_collector:
        bot.reply_to(message, "❌ Analytics system not available")
        return
    
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        bot.reply_to(message, "🔄 Testing analytics system...")
        
        # Test each component
        results = []
        
        # 1. Player stats
        try:
            players = analytics_collector.get_player_stats()
            results.append(f"✅ Player stats: {players['total']} users")
        except Exception as e:
            results.append(f"❌ Player stats failed: {e}")
        
        # 2. Active users
        try:
            active = analytics_collector.get_active_users()
            results.append(f"✅ Active users: DAU={active['dau']}")
        except Exception as e:
            results.append(f"❌ Active users failed: {e}")
        
        # 3. Economy
        try:
            economy = analytics_collector.get_tama_economy()
            results.append(f"✅ Economy: {economy['circulating']:,} TAMA")
        except Exception as e:
            results.append(f"❌ Economy failed: {e}")
        
        # 4. NFTs
        try:
            nfts = analytics_collector.get_nft_stats()
            results.append(f"✅ NFTs: {nfts['total']} sold")
        except Exception as e:
            results.append(f"❌ NFTs failed: {e}")
        
        # 5. Burn/Mint
        try:
            burn_mint = analytics_collector.get_burn_mint_ratio()
            results.append(f"✅ Burn/Mint: {burn_mint['ratio']} {burn_mint['status']}")
        except Exception as e:
            results.append(f"❌ Burn/Mint failed: {e}")
        
        # Send results
        test_report = "📊 **ANALYTICS TEST RESULTS**\\n\\n"
        test_report += "\\n".join(results)
        test_report += "\\n\\n✅ All tests completed!"
        
        bot.send_message(message.chat.id, test_report, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Test failed: {e}")
        logger.error(f"Analytics test error: {e}")
"""

# ===================================================================
# ИНСТРУКЦИЯ ПО ИНТЕГРАЦИИ
# ===================================================================

INTEGRATION_INSTRUCTIONS = """
# 📋 ИНСТРУКЦИЯ ПО ИНТЕГРАЦИИ ANALYTICS В BOT.PY

## Шаг 1: Установить зависимости (если нужно)

```bash
# Analytics уже использует supabase который есть в requirements.txt
# Ничего дополнительного ставить не нужно!
```

## Шаг 2: Скопировать код в bot.py

### 2.1 Добавить imports в начало файла (после других imports):

```python
# Import analytics system
try:
    from analytics import (
        init_analytics,
        format_daily_report,
        format_weekly_report,
        format_quick_health,
        check_critical_alerts
    )
    ANALYTICS_ENABLED = True
    print("✅ Analytics system enabled")
except Exception as e:
    ANALYTICS_ENABLED = False
    print(f"⚠️ Analytics system disabled: {e}")
```

### 2.2 Инициализировать analytics (найди где создаётся supabase client, добавь ПОСЛЕ):

```python
# Initialize Analytics
analytics_collector = None
if ANALYTICS_ENABLED:
    try:
        analytics_collector = init_analytics(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"⚠️ Failed to initialize analytics: {e}")
        ANALYTICS_ENABLED = False
```

### 2.3 Добавить команды (в секцию ADMIN COMMANDS):

Скопируй весь код из ADMIN_COMMANDS_CODE выше и вставь в bot.py
в секцию где уже есть @bot.message_handler(commands=['monitor']) и другие админ команды

### 2.4 Добавить scheduled jobs (ПЕРЕД bot.polling()):

Скопируй код из SCHEDULED_JOBS_CODE и вставь перед bot.polling()

### 2.5 Добавить тестовую команду (опционально):

Скопируй код из TEST_COMMAND_CODE

## Шаг 3: Перезапустить бота

```bash
python bot.py
```

## Шаг 4: Протестировать

В Telegram боте отправь админу:

```
/test_analytics  - Проверить что всё работает
/health          - Быстрый health check
/analytics       - Меню всех команд
/daily_report    - Полный ежедневный отчёт
```

## Шаг 5: Настроить расписание (опционально)

По умолчанию:
- ✅ Ежедневный отчёт в 9:00
- ✅ Еженедельный отчёт по понедельникам в 10:00
- ✅ Проверка критических событий каждый час

Можешь изменить время в scheduled jobs коде!

## Готово! 🎉

Теперь у тебя:
- ✅ 8 новых команд для аналитики
- ✅ Автоматические ежедневные отчёты
- ✅ Еженедельные отчёты с топ игроками
- ✅ Автоматические алерты при проблемах
- ✅ Никакого ручного заполнения SQL!

Всё работает автоматически! 🚀
"""

# Вывести инструкцию
if __name__ == "__main__":
    print(INTEGRATION_INSTRUCTIONS)
