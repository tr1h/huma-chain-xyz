# -*- coding: utf-8 -*-
"""
🌍 Submenu Translations V2
Full translations for all submenus (11 languages)

Languages: EN, RU, ZH, ES, PT, JA, FR, HI, KO, TR, DE
"""

from full_localization import (
    BUTTONS, STATS, REFERRAL, BADGES, QUESTS, NFTS, 
    WITHDRAW, LEADERBOARD, HELP, ERRORS, DAILY,
    get_button, get_text
)


def get_stats_text(lang, total_tama, rank_data, total_refs, ref_count, pending_count, streak_days, badges_count):
    """Get translated stats text for all 11 languages"""
    
    # Get translated labels
    header = get_text('STATS', 'header', lang)
    balance = get_text('STATS', 'balance', lang, amount=f"{total_tama:,}")
    rank = get_text('STATS', 'rank', lang, rank=rank_data['name'])
    refs_header = get_text('STATS', 'referrals_header', lang)
    total_invited = get_text('STATS', 'total_invited', lang, count=total_refs)
    active = get_text('STATS', 'active', lang, count=ref_count)
    pending = get_text('STATS', 'pending', lang, count=pending_count)
    activity_header = get_text('STATS', 'activity_header', lang)
    login_streak = get_text('STATS', 'login_streak', lang, days=streak_days)
    badges_earned = get_text('STATS', 'badges_earned', lang, count=badges_count)
    keep_playing = get_text('STATS', 'keep_playing', lang)
    
    progress_bar = "▓" * min(total_refs % 10, 10) + "░" * max(10 - (total_refs % 10), 0)
    
    return f"""
{header}

{balance}
{rank_data['emoji']} {rank}

{refs_header}
{total_invited}
{active}
{pending}

{activity_header}
{login_streak}
{badges_earned}

📈 **Progress:**
{progress_bar}

{keep_playing}
    """


def get_referral_text(lang, ref_code, total_referrals, pending_count, total_earnings):
    """Get translated referral text for all 11 languages"""
    
    header = get_text('REFERRAL', 'header', lang)
    your_stats = get_text('REFERRAL', 'your_stats', lang)
    total_refs = get_text('REFERRAL', 'total_referrals', lang, count=total_referrals + pending_count)
    total_earned = get_text('REFERRAL', 'total_earned', lang, amount=f"{total_earnings:,}")
    earn_instantly = get_text('REFERRAL', 'earn_instantly', lang)
    per_friend = get_text('REFERRAL', 'per_friend', lang)
    just_share = get_text('REFERRAL', 'just_share', lang)
    accumulates = get_text('REFERRAL', 'accumulates', lang)
    
    return f"""
{header}

<code>{ref_code}</code>

{your_stats}
{total_refs}
{total_earned}

{earn_instantly}
{per_friend}
{just_share}
{accumulates}
"""


def get_badges_text(lang, badges_text_content):
    """Get translated badges text for all 11 languages"""
    
    header = get_text('BADGES', 'header', lang)
    how_to_earn = get_text('BADGES', 'how_to_earn', lang)
    early_bird = get_text('BADGES', 'early_bird', lang)
    streak_master = get_text('BADGES', 'streak_master', lang)
    referral_king = get_text('BADGES', 'referral_king', lang)
    
    return f"""
{header}

{badges_text_content}

{how_to_earn}
{early_bird}
{streak_master}
{referral_king}
• 💰 Generous - 100+ referrals
• 🎮 Gamer - 100 mini-games
• 🍀 Lucky - Wheel jackpot
    """


def get_button_text(lang, button_key):
    """Get translated button text for all 11 languages"""
    return get_button(button_key, lang)


def get_no_badges_text(lang):
    """Get 'no badges yet' text"""
    return get_text('BADGES', 'no_badges', lang)


def get_rank_text(lang, rank_emoji, rank_name, total_refs, next_rank_name, refs_needed):
    """Get translated rank text for all 11 languages"""
    
    rank_headers = {
        'en': f"{rank_emoji} **Your Rank: {rank_name}**",
        'ru': f"{rank_emoji} **Твой ранг: {rank_name}**",
        'zh': f"{rank_emoji} **您的等级: {rank_name}**",
        'es': f"{rank_emoji} **Tu rango: {rank_name}**",
        'pt': f"{rank_emoji} **Seu rank: {rank_name}**",
        'ja': f"{rank_emoji} **あなたのランク: {rank_name}**",
        'fr': f"{rank_emoji} **Ton rang : {rank_name}**",
        'hi': f"{rank_emoji} **आपका रैंक: {rank_name}**",
        'ko': f"{rank_emoji} **귀하의 랭크: {rank_name}**",
        'tr': f"{rank_emoji} **Rütbeniz: {rank_name}**",
        'de': f"{rank_emoji} **Dein Rang: {rank_name}**",
    }
    
    stats_labels = {
        'en': "📊 **Stats:**",
        'ru': "📊 **Статистика:**",
        'zh': "📊 **统计:**",
        'es': "📊 **Estadísticas:**",
        'pt': "📊 **Estatísticas:**",
        'ja': "📊 **統計:**",
        'fr': "📊 **Statistiques :**",
        'hi': "📊 **आँकड़े:**",
        'ko': "📊 **통계:**",
        'tr': "📊 **İstatistikler:**",
        'de': "📊 **Statistiken:**",
    }
    
    referrals_labels = {
        'en': f"• Referrals: {total_refs}",
        'ru': f"• Рефералов: {total_refs}",
        'zh': f"• 推荐数: {total_refs}",
        'es': f"• Referidos: {total_refs}",
        'pt': f"• Indicações: {total_refs}",
        'ja': f"• 紹介数: {total_refs}",
        'fr': f"• Parrainages : {total_refs}",
        'hi': f"• रेफरल: {total_refs}",
        'ko': f"• 추천수: {total_refs}",
        'tr': f"• Referanslar: {total_refs}",
        'de': f"• Empfehlungen: {total_refs}",
    }
    
    needed_labels = {
        'en': f"• Needed for {next_rank_name}: {refs_needed}",
        'ru': f"• Требуется для {next_rank_name}: {refs_needed}",
        'zh': f"• 达到 {next_rank_name} 需要: {refs_needed}",
        'es': f"• Necesarios para {next_rank_name}: {refs_needed}",
        'pt': f"• Necessários para {next_rank_name}: {refs_needed}",
        'ja': f"• {next_rank_name}まであと: {refs_needed}",
        'fr': f"• Requis pour {next_rank_name} : {refs_needed}",
        'hi': f"• {next_rank_name} के लिए आवश्यक: {refs_needed}",
        'ko': f"• {next_rank_name}까지 필요: {refs_needed}",
        'tr': f"• {next_rank_name} için gerekli: {refs_needed}",
        'de': f"• Benötigt für {next_rank_name}: {refs_needed}",
    }
    
    keep_inviting = {
        'en': "🎯 **Keep inviting friends!**",
        'ru': "🎯 **Продолжай приглашать друзей!**",
        'zh': "🎯 **继续邀请朋友!**",
        'es': "🎯 **¡Sigue invitando amigos!**",
        'pt': "🎯 **Continue convidando amigos!**",
        'ja': "🎯 **友達を招待し続けよう！**",
        'fr': "🎯 **Continue à inviter des amis !**",
        'hi': "🎯 **दोस्तों को आमंत्रित करते रहें!**",
        'ko': "🎯 **계속 친구를 초대하세요!**",
        'tr': "🎯 **Arkadaş davet etmeye devam et!**",
        'de': "🎯 **Lade weiter Freunde ein!**",
    }
    
    return f"""
{rank_headers.get(lang, rank_headers['en'])}

{stats_labels.get(lang, stats_labels['en'])}
{referrals_labels.get(lang, referrals_labels['en'])}
{needed_labels.get(lang, needed_labels['en'])}

{keep_inviting.get(lang, keep_inviting['en'])}
    """


def get_quests_header(lang):
    """Get quests header text"""
    return get_text('QUESTS', 'header', lang)


def get_quests_completed(lang):
    """Get completed quest label"""
    return get_text('QUESTS', 'completed', lang)


def get_quests_in_progress(lang):
    """Get in progress quest label"""
    return get_text('QUESTS', 'in_progress', lang)


def get_quests_invite_tip(lang):
    """Get invite tip text"""
    return get_text('QUESTS', 'invite_tip', lang)


def get_nfts_text(lang, nft_count, tama_balance, best_multiplier, nft_list, telegram_id, mint_url):
    """Get translated NFT collection text for all 11 languages"""
    
    header = get_text('NFTS', 'collection_header', lang)
    total_nfts = get_text('NFTS', 'total_nfts', lang, count=nft_count)
    balance = get_text('STATS', 'balance', lang, amount=f"{tama_balance:,}")
    active_boost = get_text('NFTS', 'active_boost', lang, multiplier=best_multiplier)
    benefits = get_text('NFTS', 'benefits', lang, multiplier=best_multiplier)
    
    if nft_count > 0:
        view_labels = {
            'en': f"🌐 [View on Website]({mint_url}my-nfts.html?user_id={telegram_id})",
            'ru': f"🌐 [Смотреть на сайте]({mint_url}my-nfts.html?user_id={telegram_id})",
            'zh': f"🌐 [在网站上查看]({mint_url}my-nfts.html?user_id={telegram_id})",
            'es': f"🌐 [Ver en sitio web]({mint_url}my-nfts.html?user_id={telegram_id})",
            'pt': f"🌐 [Ver no site]({mint_url}my-nfts.html?user_id={telegram_id})",
            'ja': f"🌐 [ウェブサイトで見る]({mint_url}my-nfts.html?user_id={telegram_id})",
            'fr': f"🌐 [Voir sur le site]({mint_url}my-nfts.html?user_id={telegram_id})",
            'hi': f"🌐 [वेबसाइट पर देखें]({mint_url}my-nfts.html?user_id={telegram_id})",
            'ko': f"🌐 [웹사이트에서 보기]({mint_url}my-nfts.html?user_id={telegram_id})",
            'tr': f"🌐 [Web sitesinde gör]({mint_url}my-nfts.html?user_id={telegram_id})",
            'de': f"🌐 [Auf Website ansehen]({mint_url}my-nfts.html?user_id={telegram_id})",
        }
        
        return f"""
{header}

{total_nfts}
{balance}
{active_boost}

{nft_list}

{benefits}

{view_labels.get(lang, view_labels['en'])}
        """
    else:
        no_nfts = get_text('NFTS', 'no_nfts', lang)
        
        how_to_get = {
            'en': "💰 *How to get NFTs:*",
            'ru': "💰 *Как получить NFT:*",
            'zh': "💰 *如何获得 NFT:*",
            'es': "💰 *Cómo obtener NFTs:*",
            'pt': "💰 *Como obter NFTs:*",
            'ja': "💰 *NFTの入手方法:*",
            'fr': "💰 *Comment obtenir des NFT :*",
            'hi': "💰 *NFT कैसे प्राप्त करें:*",
            'ko': "💰 *NFT 획득 방법:*",
            'tr': "💰 *NFT nasıl alınır:*",
            'de': "💰 *Wie man NFTs bekommt:*",
        }
        
        mint_cta = {
            'en': "🎨 Tap \"Mint NFT\" to start!",
            'ru': "🎨 Нажми \"Минт NFT\" чтобы начать!",
            'zh': "🎨 点击\"铸造NFT\"开始！",
            'es': "🎨 ¡Toca \"Mintear NFT\" para empezar!",
            'pt': "🎨 Toque em \"Cunhar NFT\" para começar!",
            'ja': "🎨 「NFTミント」をタップして始めよう！",
            'fr': "🎨 Appuie sur \"Créer NFT\" pour commencer !",
            'hi': "🎨 शुरू करने के लिए \"NFT मिंट करें\" टैप करें!",
            'ko': "🎨 시작하려면 \"NFT 민팅\"을 탭하세요!",
            'tr': "🎨 Başlamak için \"NFT Bas\"a dokunun!",
            'de': "🎨 Tippe auf \"NFT Minten\" um zu starten!",
        }
        
        return f"""
{header}

{no_nfts}

{balance}

{how_to_get.get(lang, how_to_get['en'])}

**🥉 Bronze NFT** 💰
• Cost: 2,500 TAMA or 0.05 SOL
• Boost: 2-3x earning

**🥈 Silver NFT** 💎
• Cost: 1 SOL
• Boost: 2.3x earning

**🥇 Gold NFT** 🌟
• Cost: 3 SOL
• Boost: 2.7x earning

{mint_cta.get(lang, mint_cta['en'])}
        """


def get_withdraw_text(lang, tama_balance):
    """Get translated withdraw text"""
    
    header = get_text('WITHDRAW', 'header', lang)
    mainnet = get_text('WITHDRAW', 'mainnet_launch', lang)
    what_to_know = get_text('WITHDRAW', 'what_to_know', lang)
    tama_safe = get_text('WITHDRAW', 'tama_safe', lang)
    balance = get_text('STATS', 'balance', lang, amount=f"{tama_balance:,}")
    
    status_labels = {
        'en': "**Current Status:**\n• Devnet: ✅ Active (testing)\n• Mainnet: 🔄 Coming Q1 2026",
        'ru': "**Текущий статус:**\n• Devnet: ✅ Активен (тестирование)\n• Mainnet: 🔄 Запуск Q1 2026",
        'zh': "**当前状态:**\n• Devnet: ✅ 活跃 (测试中)\n• Mainnet: 🔄 2026年Q1上线",
        'es': "**Estado actual:**\n• Devnet: ✅ Activo (pruebas)\n• Mainnet: 🔄 Próximamente Q1 2026",
        'pt': "**Status atual:**\n• Devnet: ✅ Ativo (teste)\n• Mainnet: 🔄 Em breve Q1 2026",
        'ja': "**現在の状況:**\n• Devnet: ✅ 稼働中 (テスト)\n• Mainnet: 🔄 2026年Q1開始",
        'fr': "**Statut actuel :**\n• Devnet : ✅ Actif (test)\n• Mainnet : 🔄 Bientôt Q1 2026",
        'hi': "**वर्तमान स्थिति:**\n• Devnet: ✅ सक्रिय (परीक्षण)\n• Mainnet: 🔄 Q1 2026 में आ रहा है",
        'ko': "**현재 상태:**\n• Devnet: ✅ 활성 (테스트)\n• Mainnet: 🔄 2026년 1분기 예정",
        'tr': "**Mevcut Durum:**\n• Devnet: ✅ Aktif (test)\n• Mainnet: 🔄 Q1 2026'da geliyor",
        'de': "**Aktueller Status:**\n• Devnet: ✅ Aktiv (Test)\n• Mainnet: 🔄 Kommt Q1 2026",
    }
    
    return f"""
{header}

{mainnet}

{what_to_know}

{status_labels.get(lang, status_labels['en'])}

{balance}

{tama_safe}

📊 Track: https://solanatamagotchi.com/treasury-monitor.html
    """


def get_leaderboard_header(lang):
    """Get leaderboard header"""
    return get_text('LEADERBOARD', 'header', lang)


def get_leaderboard_no_players(lang):
    """Get no players text"""
    return get_text('LEADERBOARD', 'no_players', lang)


def get_daily_claimed_text(lang, amount):
    """Get daily reward claimed text"""
    return get_text('DAILY', 'claimed', lang, amount=amount)


def get_daily_already_claimed_text(lang, hours, minutes):
    """Get daily already claimed text"""
    return get_text('DAILY', 'already_claimed', lang, hours=hours, minutes=minutes)


def get_help_text(lang):
    """Get full help text"""
    header = get_text('HELP', 'header', lang)
    game_commands = get_text('HELP', 'game_commands', lang)
    social_commands = get_text('HELP', 'social_commands', lang)
    need_help = get_text('HELP', 'need_help', lang)
    
    return f"""
{header}

{game_commands}

{social_commands}

{need_help}
    """


def get_error_text(lang, error_type='generic'):
    """Get error message"""
    return get_text('ERRORS', error_type, lang)
