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
            'copy': '📋 Copy Code',
            'mint': '🎨 Mint NFT',
            'view_website': '🌐 View on Website'
        },
        'ru': {
            'back': '🔙 Назад',
            'referral': '🔗 Реферальная',
            'share': '📤 Поделиться',
            'copy': '📋 Копировать код',
            'mint': '🎨 Минт NFT',
            'view_website': '🌐 Смотреть на сайте'
        },
        'zh': {
            'back': '🔙 返回',
            'referral': '🔗 推荐',
            'share': '📤 分享',
            'copy': '📋 复制代码',
            'mint': '🎨 铸造 NFT',
            'view_website': '🌐 在网站上查看'
        },
        'es': {
            'back': '🔙 Atrás',
            'referral': '🔗 Referidos',
            'share': '📤 Compartir',
            'copy': '📋 Copiar código',
            'mint': '🎨 Mintear NFT',
            'view_website': '🌐 Ver en sitio web'
        }
    }
    return buttons.get(lang, buttons['en']).get(button_key, button_key)


def get_no_badges_text(lang):
    """Get 'no badges yet' text"""
    texts = {
        'en': 'No badges yet. Play and invite friends!',
        'ru': 'Пока нет значков. Играй и приглашай друзей!',
        'zh': '还没有徽章。玩游戏和邀请朋友!',
        'es': '¡Aún no tienes insignias. Juega e invita amigos!'
    }
    return texts.get(lang, texts['en'])


def get_rank_text(lang, rank_emoji, rank_name, total_refs, next_rank_name, refs_needed):
    """Get translated rank text"""
    if lang == 'ru':
        return f"""
{rank_emoji} **Твой ранг: {rank_name}**

📊 **Статистика:**
• Рефералов: {total_refs}
• Требуется для {next_rank_name}: {refs_needed}

🎯 **Продолжай приглашать друзей!**
        """
    elif lang == 'zh':
        return f"""
{rank_emoji} **您的等级: {rank_name}**

📊 **统计:**
• 推荐数: {total_refs}
• 达到 {next_rank_name} 需要: {refs_needed}

🎯 **继续邀请朋友!**
        """
    elif lang == 'es':
        return f"""
{rank_emoji} **Tu rango: {rank_name}**

📊 **Estadísticas:**
• Referidos: {total_refs}
• Necesarios para {next_rank_name}: {refs_needed}

🎯 **¡Sigue invitando amigos!**
        """
    else:
        return f"""
{rank_emoji} **Your Rank: {rank_name}**

📊 **Stats:**
• Referrals: {total_refs}
• Needed for {next_rank_name}: {refs_needed}

🎯 **Keep inviting friends!**
        """


def get_quests_header(lang):
    """Get quests header text"""
    texts = {
        'en': '📋 **Referral Quests**\n\n',
        'ru': '📋 **Реферальные квесты**\n\n',
        'zh': '📋 **推荐任务**\n\n',
        'es': '📋 **Misiones de Referidos**\n\n'
    }
    return texts.get(lang, texts['en'])


def get_nfts_text(lang, nft_count, tama_balance, best_multiplier, nft_list, telegram_id, mint_url):
    """Get translated NFT collection text"""
    if nft_count > 0:
        if lang == 'ru':
            return f"""
🖼️ **ТВОЯ КОЛЛЕКЦИЯ NFT** 🖼️

📦 Всего NFT: **{nft_count}**
💰 Баланс TAMA: **{tama_balance:,}**
⚡ Активный буст: **{best_multiplier}x**

{nft_list}

🎮 *Преимущества NFT:*
• Твой лучший NFT даёт **{best_multiplier}x** буст к заработку!
• Все награды TAMA умножаются автоматически
• Смотри полную коллекцию на сайте!

🌐 [Смотреть на сайте]({mint_url}my-nfts.html?user_id={telegram_id})
            """
        elif lang == 'zh':
            return f"""
🖼️ **您的 NFT 收藏** 🖼️

📦 NFT 总数: **{nft_count}**
💰 TAMA 余额: **{tama_balance:,}**
⚡ 活跃加成: **{best_multiplier}x**

{nft_list}

🎮 *NFT 优势:*
• 您最好的 NFT 提供 **{best_multiplier}x** 收益加成!
• 所有 TAMA 奖励自动翻倍
• 在网站上查看完整收藏!

🌐 [在网站上查看]({mint_url}my-nfts.html?user_id={telegram_id})
            """
        else:
            return f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 Total NFTs: **{nft_count}**
💰 TAMA Balance: **{tama_balance:,}**
⚡ Active Boost: **{best_multiplier}x**

{nft_list}

🎮 *NFT Benefits:*
• Your best NFT gives you **{best_multiplier}x** earning boost!
• All TAMA rewards are multiplied automatically
• View full collection on website!

🌐 [View on Website]({mint_url}my-nfts.html?user_id={telegram_id})
            """
    else:
        if lang == 'ru':
            return f"""
🖼️ **ТВОЯ КОЛЛЕКЦИЯ NFT** 🖼️

📦 У тебя пока нет NFT!

💰 Твой баланс TAMA: **{tama_balance:,}**

💰 *Как получить NFT:*

**🥉 Бронзовый NFT** 💰
• Цена: 2,500 TAMA или 0.05 SOL
• Буст: 2-3x к заработку
• Редкость: Common/Rare

**🥈 Серебряный NFT** 💎
• Цена: 1 SOL
• Буст: 2.3x к заработку
• Редкость: Uncommon/Rare

**🥇 Золотой NFT** 🌟
• Цена: 3 SOL
• Буст: 2.7x к заработку
• Редкость: Rare/Epic

🎨 Нажми "Минт NFT" чтобы начать!
            """
        elif lang == 'zh':
            return f"""
🖼️ **您的 NFT 收藏** 🖼️

📦 您还没有任何 NFT!

💰 您的 TAMA 余额: **{tama_balance:,}**

💰 *如何获得 NFT:*

**🥉 青铜 NFT** 💰
• 价格: 2,500 TAMA 或 0.05 SOL
• 加成: 2-3x 收益
• 稀有度: Common/Rare

**🥈 白银 NFT** 💎
• 价格: 1 SOL
• 加成: 2.3x 收益
• 稀有度: Uncommon/Rare

**🥇 黄金 NFT** 🌟
• 价格: 3 SOL
• 加成: 2.7x 收益
• 稀有度: Rare/Epic

🎨 点击"铸造 NFT"开始!
            """
        else:
            return f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 You don't have any NFTs yet!

💰 Your TAMA Balance: **{tama_balance:,}**

💰 *How to get NFTs:*

**🥉 Bronze NFT** 💰
• Cost: 2,500 TAMA or 0.05 SOL
• Boost: 2-3x earning
• Rarity: Common/Rare

**🥈 Silver NFT** 💎
• Cost: 1 SOL
• Boost: 2.3x earning
• Rarity: Uncommon/Rare

**🥇 Gold NFT** 🌟
• Cost: 3 SOL
• Boost: 2.7x earning
• Rarity: Rare/Epic

🎨 Tap "Mint NFT" to start!
            """

