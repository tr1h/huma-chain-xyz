"""
Admin Whitelist System
Phrases and patterns that are whitelisted for admins

@Developer - FIX #3: Created for bot spam protection improvements
"""

# Whitelist phrases that admins can use without triggering spam detection
ADMIN_WHITELIST_PHRASES = [
    'partnership',
    'ama',
    'announcement',
    'update',
    'maintenance',
    'airdrop',
    'giveaway',
    'contest',
    'tournament',
    'daily report',
    'weekly report',
    'analytics',
    'monitoring',
    'alert',
    'http://',
    'https://',
    'bit.ly',
    'tinyurl',
]

# Whitelist for official links (allowed for everyone)
WHITELISTED_LINKS = [
    'solanatamagotchi.com',
    't.me/gotchigamebot',
    't.me/gotchigamechat',
    '@gotchigamebot',
    '@gotchigame',
    'github.com/tr1h',
    'twitter.com/gotchigame',
    'x.com/gotchigame',
]


def is_admin_whitelisted(text: str, user_id: int, admin_ids: list) -> bool:
    """
    Check if message should be whitelisted for admin
    
    Args:
        text: Message text
        user_id: User's Telegram ID
        admin_ids: List of admin IDs
    
    Returns:
        True if admin and should bypass all checks
        False otherwise
    """
    # If not admin - not whitelisted
    if user_id not in admin_ids:
        return False
    
    # Admin - automatically whitelisted for ALL phrases
    return True


def contains_whitelisted_link(text: str) -> bool:
    """
    Check if message contains official whitelisted link
    
    Args:
        text: Message text
    
    Returns:
        True if contains whitelisted link
        False otherwise
    """
    if not text:
        return False
    
    text_lower = text.lower()
    
    for link in WHITELISTED_LINKS:
        if link.lower() in text_lower:
            return True
    
    return False


def should_allow_link(text: str, user_id: int, admin_ids: list) -> bool:
    """
    Check if link in message should be allowed
    
    Args:
        text: Message text
        user_id: User's Telegram ID
        admin_ids: List of admin IDs
    
    Returns:
        True if link should be allowed
        False if link should be blocked
    """
    # Admins can post any links
    if user_id in admin_ids:
        return True
    
    # Check if it's official whitelisted link
    if contains_whitelisted_link(text):
        return True
    
    # Otherwise block
    return False
