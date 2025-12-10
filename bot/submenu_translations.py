# -*- coding: utf-8 -*-
"""
🌍 Submenu Translations
Переводы для всех подменю бота
"""

def get_stats_text(lang, total_tama, rank_data, total_refs, ref_count, pending_count, streak_days, badges_count):
    """Get translated stats text"""
    if lang == 'ru':
        return f"""
📊 **Полная статистика**

💰 **Баланс TAMA:** {total_tama:,}
{rank_data['emoji']} **Ранг:** {rank_data['name']}

👥 **Рефералы:**
• Приглашено: {total_refs}
• Активных: {ref_count}
• Ожидают: {pending_count}

🔥 **Активность:**
• Серия входов: {streak_days} дн.
• Получено значков: {badges_count}

📈 **Прогресс:**
{"▓" * min(total_refs % 10, 10)}{"░" * max(10 - (total_refs % 10), 0)}

💰 **Продолжай играть и приглашать друзей!**
        """
    elif lang == 'zh':
        return f"""
📊 **完整统计**

💰 **TAMA 余额:** {total_tama:,}
{rank_data['emoji']} **等级:** {rank_data['name']}

👥 **推荐:**
• 邀请总数: {total_refs}
• 活跃: {ref_count}
• 待定: {pending_count}

🔥 **活动:**
• 连续登录: {streak_days} 天
• 获得徽章: {badges_count}

📈 **进度:**
{"▓" * min(total_refs % 10, 10)}{"░" * max(10 - (total_refs % 10), 0)}

💰 **继续玩游戏和邀请朋友!**
        """
    else:
        return f"""
📊 **Your Full Stats**

💰 **TAMA Balance:** {total_tama:,}
{rank_data['emoji']} **Rank:** {rank_data['name']}

👥 **Referrals:**
• Total invited: {total_refs}
• Active: {ref_count}
• Pending: {pending_count}

🔥 **Activity:**
• Login streak: {streak_days} days
• Badges earned: {badges_count}

📈 **Progress:**
{"▓" * min(total_refs % 10, 10)}{"░" * max(10 - (total_refs % 10), 0)}

💰 **Keep playing and inviting friends!**
        """


def get_referral_text(lang, ref_code, total_referrals, pending_count, total_earnings):
    """Get translated referral text"""
    if lang == 'ru':
        return f"""
🔗 <b>Твой реферальный код:</b>

<code>{ref_code}</code>

📊 <b>Твоя статистика:</b>
• 👥 Всего рефералов: {total_referrals + pending_count}
• 💰 Заработано: {total_earnings:,} TAMA

💰 <b>Зарабатывай мгновенно (БЕЗ КОШЕЛЬКА!):</b>
• 1,000 TAMA за каждого друга мгновенно!
• Просто делись ссылкой и зарабатывай!
• TAMA копятся на твоём аккаунте
"""
    elif lang == 'zh':
        return f"""
🔗 <b>您的推荐代码:</b>

<code>{ref_code}</code>

📊 <b>您的统计:</b>
• 👥 推荐总数: {total_referrals + pending_count}
• 💰 总收入: {total_earnings:,} TAMA

💰 <b>即时赚取 (无需钱包!):</b>
• 每位朋友立即获得 1,000 TAMA!
• 只需分享链接即可赚取!
• TAMA 累积在您的账户中
"""
    else:
        return f"""
🔗 <b>Your Referral Code:</b>

<code>{ref_code}</code>

📊 <b>Your Stats:</b>
• 👥 Total Referrals: {total_referrals + pending_count}
• 💰 Total Earned: {total_earnings:,} TAMA

💰 <b>Earn instantly (NO WALLET NEEDED!):</b>
• 1,000 TAMA for each friend instantly!
• Just share your link and earn!
• TAMA accumulates in your account
"""


def get_badges_text(lang, badges_text_content):
    """Get translated badges text"""
    if lang == 'ru':
        return f"""
🏆 **Твои значки**

{badges_text_content}

💰 **Как получить больше:**
• 🌟 Ранняя пташка - В первых 100 пользователей
• 🔥 Мастер серий - 30 дней подряд
• 👑 Король рефералов - 50+ рефералов
• 💰 Щедрый - 100+ рефералов
• 🎮 Геймер - 100 мини-игр
• 🍀 Удачливый - Джекпот колеса
        """
    elif lang == 'zh':
        return f"""
🏆 **您的徽章**

{badges_text_content}

💰 **如何获得更多:**
• 🌟 早起鸟 - 前 100 位用户
• 🔥 连胜大师 - 连续 30 天
• 👑 推荐之王 - 50+ 推荐
• 💰 慷慨 - 100+ 推荐
• 🎮 游戏玩家 - 100 个小游戏
• 🍀 幸运 - 轮盘大奖
        """
    else:
        return f"""
🏆 **Your Badges**

{badges_text_content}

💰 **How to earn more:**
• 🌟 Early Bird - Be in first 100 users
• 🔥 Streak Master - 30 days streak
• 👑 Referral King - 50+ referrals
• 💰 Generous - 100+ referrals
• 🎮 Gamer - 100 mini-games
• 🍀 Lucky - Wheel jackpot
        """


def get_button_text(lang, button_key):
    """Get translated button text"""
    buttons = {
        'en': {
            'back': '🔙 Back',
            'referral': '🔗 Referral',
            'share': '📤 Share',
            'copy': '📋 Copy Code'
        },
        'ru': {
            'back': '🔙 Назад',
            'referral': '🔗 Реферальная',
            'share': '📤 Поделиться',
            'copy': '📋 Копировать код'
        },
        'zh': {
            'back': '🔙 返回',
            'referral': '🔗 推荐',
            'share': '📤 分享',
            'copy': '📋 复制代码'
        }
    }
    return buttons.get(lang, buttons['en']).get(button_key, button_key)

