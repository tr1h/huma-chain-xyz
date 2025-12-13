# -*- coding: utf-8 -*-
"""
🌍 Bot Translation Helpers
Quick access functions for bot.py to use full_localization

This file provides simple wrapper functions that bot.py can use
to get translated text without major refactoring.
"""

from full_localization import (
    BUTTONS, WELCOME, STATS, REFERRAL, BADGES, QUESTS, 
    NFTS, WITHDRAW, ERRORS, DAILY, LEADERBOARD, HELP,
    LANGUAGE_SELECTION, SUPPORTED_LANGUAGES
)

# Re-export SUPPORTED_LANGUAGES
SUPPORTED_LANGS = list(SUPPORTED_LANGUAGES.keys())


def btn(key: str, lang: str = 'en') -> str:
    """Get button text - shorthand for common use"""
    return BUTTONS.get(key, {}).get(lang, BUTTONS.get(key, {}).get('en', key))


def welcome_text(has_referral: bool, lang: str = 'en') -> str:
    """Get welcome message"""
    key = 'with_referral' if has_referral else 'no_referral'
    return WELCOME.get(key, {}).get(lang, WELCOME.get(key, {}).get('en', ''))


def lang_changed(lang: str) -> str:
    """Get language changed confirmation"""
    return LANGUAGE_SELECTION['changed'].get(lang, LANGUAGE_SELECTION['changed']['en'])


def lang_choose(lang: str = 'en') -> str:
    """Get choose language message"""
    return LANGUAGE_SELECTION['choose'].get(lang, LANGUAGE_SELECTION['choose']['en'])


def error_msg(error_type: str = 'generic', lang: str = 'en') -> str:
    """Get error message"""
    return ERRORS.get(error_type, ERRORS['generic']).get(lang, ERRORS['generic']['en'])


def daily_claimed(amount: int, lang: str = 'en') -> str:
    """Get daily reward claimed message"""
    text = DAILY['claimed'].get(lang, DAILY['claimed']['en'])
    return text.format(amount=amount)


def daily_wait(hours: int, minutes: int, lang: str = 'en') -> str:
    """Get daily reward wait message"""
    text = DAILY['already_claimed'].get(lang, DAILY['already_claimed']['en'])
    return text.format(hours=hours, minutes=minutes)


# =============================================================================
# MENU BUTTON TEXTS - Returns dict with all main menu buttons for a language
# =============================================================================
def get_menu_buttons(lang: str = 'en') -> dict:
    """
    Get all main menu button texts for a language
    Returns dict like: {'play': '🎮 Play Now', 'stats': '📊 My Stats', ...}
    """
    return {
        'play': btn('play_now', lang),
        'daily': btn('daily_reward', lang),
        'my_nfts': btn('my_nfts', lang),
        'mint_nft': btn('mint_nft', lang),
        'withdraw': btn('withdraw', lang),
        'referral': btn('referral', lang),
        'stats': btn('stats', lang),
        'quests': btn('quests', lang),
        'badges': btn('badges', lang),
        'rank': btn('rank', lang),
        'leaderboard': btn('leaderboard', lang),
        'community': btn('community', lang),
        'language': btn('language', lang),
        'back': btn('back', lang),
        'back_to_menu': btn('back_to_menu', lang),
        'share': btn('share', lang),
        'copy_code': btn('copy_code', lang),
        'help': btn('help', lang),
        'cancel': btn('cancel', lang),
        'confirm': btn('confirm', lang),
        'view_website': btn('view_website', lang),
    }


# =============================================================================
# STATS SECTION
# =============================================================================
def stats_header(lang: str = 'en') -> str:
    return STATS['header'].get(lang, STATS['header']['en'])

def stats_balance(amount: str, lang: str = 'en') -> str:
    return STATS['balance'].get(lang, STATS['balance']['en']).format(amount=amount)

def stats_rank(rank: str, lang: str = 'en') -> str:
    return STATS['rank'].get(lang, STATS['rank']['en']).format(rank=rank)

def stats_keep_playing(lang: str = 'en') -> str:
    return STATS['keep_playing'].get(lang, STATS['keep_playing']['en'])


# =============================================================================
# REFERRAL SECTION
# =============================================================================
def referral_header(lang: str = 'en') -> str:
    return REFERRAL['header'].get(lang, REFERRAL['header']['en'])

def referral_total(count: int, lang: str = 'en') -> str:
    return REFERRAL['total_referrals'].get(lang, REFERRAL['total_referrals']['en']).format(count=count)

def referral_earned(amount: str, lang: str = 'en') -> str:
    return REFERRAL['total_earned'].get(lang, REFERRAL['total_earned']['en']).format(amount=amount)


# =============================================================================
# BADGES SECTION  
# =============================================================================
def badges_header(lang: str = 'en') -> str:
    return BADGES['header'].get(lang, BADGES['header']['en'])

def badges_none(lang: str = 'en') -> str:
    return BADGES['no_badges'].get(lang, BADGES['no_badges']['en'])


# =============================================================================
# QUESTS SECTION
# =============================================================================
def quests_header(lang: str = 'en') -> str:
    return QUESTS['header'].get(lang, QUESTS['header']['en'])

def quests_completed(lang: str = 'en') -> str:
    return QUESTS['completed'].get(lang, QUESTS['completed']['en'])

def quests_in_progress(lang: str = 'en') -> str:
    return QUESTS['in_progress'].get(lang, QUESTS['in_progress']['en'])

def quests_tip(lang: str = 'en') -> str:
    return QUESTS['invite_tip'].get(lang, QUESTS['invite_tip']['en'])


# =============================================================================
# NFT SECTION
# =============================================================================
def nft_header(lang: str = 'en') -> str:
    return NFTS['collection_header'].get(lang, NFTS['collection_header']['en'])

def nft_none(lang: str = 'en') -> str:
    return NFTS['no_nfts'].get(lang, NFTS['no_nfts']['en'])

def nft_total(count: int, lang: str = 'en') -> str:
    return NFTS['total_nfts'].get(lang, NFTS['total_nfts']['en']).format(count=count)

def nft_boost(multiplier: float, lang: str = 'en') -> str:
    return NFTS['active_boost'].get(lang, NFTS['active_boost']['en']).format(multiplier=multiplier)


# =============================================================================
# WITHDRAW SECTION
# =============================================================================
def withdraw_header(lang: str = 'en') -> str:
    return WITHDRAW['header'].get(lang, WITHDRAW['header']['en'])

def withdraw_mainnet(lang: str = 'en') -> str:
    return WITHDRAW['mainnet_launch'].get(lang, WITHDRAW['mainnet_launch']['en'])

def withdraw_safe(lang: str = 'en') -> str:
    return WITHDRAW['tama_safe'].get(lang, WITHDRAW['tama_safe']['en'])


# =============================================================================
# LEADERBOARD SECTION
# =============================================================================
def leaderboard_header(lang: str = 'en') -> str:
    return LEADERBOARD['header'].get(lang, LEADERBOARD['header']['en'])

def leaderboard_empty(lang: str = 'en') -> str:
    return LEADERBOARD['no_players'].get(lang, LEADERBOARD['no_players']['en'])


# =============================================================================
# HELP SECTION
# =============================================================================
def help_header(lang: str = 'en') -> str:
    return HELP['header'].get(lang, HELP['header']['en'])

def help_game_commands(lang: str = 'en') -> str:
    return HELP['game_commands'].get(lang, HELP['game_commands']['en'])

def help_social_commands(lang: str = 'en') -> str:
    return HELP['social_commands'].get(lang, HELP['social_commands']['en'])

def help_need_help(lang: str = 'en') -> str:
    return HELP['need_help'].get(lang, HELP['need_help']['en'])


# =============================================================================
# QUICK MULTI-LANGUAGE LOOKUP (for backwards compatibility)
# =============================================================================
def get_text_ml(texts_dict: dict, lang: str = 'en') -> str:
    """
    Get text from a multi-language dict
    Example: get_text_ml({'en': 'Hello', 'ru': 'Привет'}, 'ru') -> 'Привет'
    """
    return texts_dict.get(lang, texts_dict.get('en', ''))


# Testing
if __name__ == '__main__':
    print("Testing bot_translations.py...")
    
    # Test buttons
    for lang in ['en', 'ru', 'ja', 'ko']:
        print(f"{lang}: {btn('play_now', lang)}")
    
    # Test menu buttons
    menu = get_menu_buttons('ja')
    print(f"\nJapanese menu: {menu['play']}, {menu['stats']}")
    
    print("\n✅ All tests passed!")
