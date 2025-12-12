"""
Language selector helper for Telegram Bot
Выбор языка для бота
"""

from telebot import types
from localization import t

def create_language_keyboard() -> types.InlineKeyboardMarkup:
    """
    Create inline keyboard with language selection buttons

    Returns:
        InlineKeyboardMarkup with language buttons (EN, RU, ZH, ES)
    """
    keyboard = types.InlineKeyboardMarkup(row_width=2)

    # Language buttons
    btn_en = types.InlineKeyboardButton(
        text="🇬🇧 English",
        callback_data="lang_en"
    )
    btn_ru = types.InlineKeyboardButton(
        text="🇷🇺 Русский",
        callback_data="lang_ru"
    )
    btn_zh = types.InlineKeyboardButton(
        text="🇨🇳 中文",
        callback_data="lang_zh"
    )
    btn_es = types.InlineKeyboardButton(
        text="🇪🇸 Español",
        callback_data="lang_es"
    )

    keyboard.add(btn_en, btn_ru)
    keyboard.add(btn_zh, btn_es)

    return keyboard


def get_language_selection_message(current_lang: str = 'en') -> str:
    """
    Get message text for language selection

    Args:
        current_lang: Current user language

    Returns:
        Formatted message text
    """
    return t('choose_language', current_lang)


def handle_language_callback(callback_data: str) -> str:
    """
    Extract language code from callback data

    Args:
        callback_data: Callback data from button (e.g., "lang_en", "lang_ru", "lang_zh", "lang_es")

    Returns:
        Language code ('en', 'ru', 'zh', or 'es')
    """
    if callback_data.startswith('lang_'):
        lang_code = callback_data.replace('lang_', '')
        # Validate language code
        if lang_code in ['en', 'ru', 'zh', 'es']:
            return lang_code
    return 'en'


def get_language_changed_message(lang: str) -> str:
    """
    Get confirmation message after language change

    Args:
        lang: New language code

    Returns:
        Formatted confirmation message
    """
    return t('language_changed', lang)


# Testing
if __name__ == '__main__':
    print("🧪 Testing language selector...\n")

    # Test keyboard creation
    keyboard = create_language_keyboard()
    print(f"Keyboard created with {len(keyboard.keyboard)} rows")

    # Test message
    print("\n=== EN MESSAGE ===")
    print(get_language_selection_message('en'))

    print("\n=== RU MESSAGE ===")
    print(get_language_selection_message('ru'))

    # Test callback handling
    print("\n=== CALLBACK HANDLING ===")
    print(f"'lang_en' -> {handle_language_callback('lang_en')}")
    print(f"'lang_ru' -> {handle_language_callback('lang_ru')}")

    # Test confirmation messages
    print("\n=== CONFIRMATION ===")
    print(f"EN: {get_language_changed_message('en')}")
    print(f"RU: {get_language_changed_message('ru')}")

