"""
Language selector helper for Telegram Bot
Выбор языка для бота

Supported Languages:
- EN (English) 🇬🇧
- RU (Russian) 🇷🇺
- ZH (Chinese) 🇨🇳
- ES (Spanish) 🇪🇸
- PT (Portuguese) 🇧🇷
- JA (Japanese) 🇯🇵
- FR (French) 🇫🇷
- HI (Hindi) 🇮🇳
- KO (Korean) 🇰🇷
- TR (Turkish) 🇹🇷
- DE (German) 🇩🇪
"""

from telebot import types

# Supported languages configuration
SUPPORTED_LANGUAGES = {
    'en': {'name': 'English', 'flag': '🇬🇧', 'native': 'English'},
    'ru': {'name': 'Russian', 'flag': '🇷🇺', 'native': 'Русский'},
    'zh': {'name': 'Chinese', 'flag': '🇨🇳', 'native': '中文'},
    'es': {'name': 'Spanish', 'flag': '🇪🇸', 'native': 'Español'},
    'pt': {'name': 'Portuguese', 'flag': '🇧🇷', 'native': 'Português'},
    'ja': {'name': 'Japanese', 'flag': '🇯🇵', 'native': '日本語'},
    'fr': {'name': 'French', 'flag': '🇫🇷', 'native': 'Français'},
    'hi': {'name': 'Hindi', 'flag': '🇮🇳', 'native': 'हिन्दी'},
    'ko': {'name': 'Korean', 'flag': '🇰🇷', 'native': '한국어'},
    'tr': {'name': 'Turkish', 'flag': '🇹🇷', 'native': 'Türkçe'},
    'de': {'name': 'German', 'flag': '🇩🇪', 'native': 'Deutsch'},
}

# Language changed messages
LANGUAGE_CHANGED_MESSAGES = {
    'en': '✅ Language changed to English!',
    'ru': '✅ Язык изменён на русский!',
    'zh': '✅ 语言已更改为中文！',
    'es': '✅ ¡Idioma cambiado a Español!',
    'pt': '✅ Idioma alterado para Português!',
    'ja': '✅ 言語を日本語に変更しました！',
    'fr': '✅ Langue changée en Français !',
    'hi': '✅ भाषा हिंदी में बदल दी गई!',
    'ko': '✅ 언어가 한국어로 변경되었습니다!',
    'tr': '✅ Dil Türkçe olarak değiştirildi!',
    'de': '✅ Sprache auf Deutsch geändert!',
}

# Choose language messages
CHOOSE_LANGUAGE_MESSAGES = {
    'en': '🌍 **Choose Your Language**\n\nSelect your preferred language:',
    'ru': '🌍 **Выберите язык**\n\nВыберите предпочитаемый язык:',
    'zh': '🌍 **选择语言**\n\n选择您的首选语言：',
    'es': '🌍 **Elige tu idioma**\n\nSelecciona tu idioma preferido:',
    'pt': '🌍 **Escolha seu idioma**\n\nSelecione seu idioma preferido:',
    'ja': '🌍 **言語を選択**\n\nご希望の言語を選択してください：',
    'fr': '🌍 **Choisissez votre langue**\n\nSélectionnez votre langue préférée :',
    'hi': '🌍 **अपनी भाषा चुनें**\n\nअपनी पसंदीदा भाषा चुनें:',
    'ko': '🌍 **언어 선택**\n\n원하는 언어를 선택하세요:',
    'tr': '🌍 **Dilinizi Seçin**\n\nTercih ettiğiniz dili seçin:',
    'de': '🌍 **Wähle deine Sprache**\n\nWähle deine bevorzugte Sprache:',
}


def create_language_keyboard() -> types.InlineKeyboardMarkup:
    """
    Create inline keyboard with language selection buttons (11 languages)
    
    Returns:
        InlineKeyboardMarkup with language buttons
    """
    keyboard = types.InlineKeyboardMarkup(row_width=2)
    
    # Row 1: English, Russian
    keyboard.add(
        types.InlineKeyboardButton("🇬🇧 English", callback_data="lang_en"),
        types.InlineKeyboardButton("🇷🇺 Русский", callback_data="lang_ru")
    )
    
    # Row 2: Chinese, Japanese
    keyboard.add(
        types.InlineKeyboardButton("🇨🇳 中文", callback_data="lang_zh"),
        types.InlineKeyboardButton("🇯🇵 日本語", callback_data="lang_ja")
    )
    
    # Row 3: Korean, Hindi
    keyboard.add(
        types.InlineKeyboardButton("🇰🇷 한국어", callback_data="lang_ko"),
        types.InlineKeyboardButton("🇮🇳 हिन्दी", callback_data="lang_hi")
    )
    
    # Row 4: Spanish, Portuguese
    keyboard.add(
        types.InlineKeyboardButton("🇪🇸 Español", callback_data="lang_es"),
        types.InlineKeyboardButton("🇧🇷 Português", callback_data="lang_pt")
    )
    
    # Row 5: French, German
    keyboard.add(
        types.InlineKeyboardButton("🇫🇷 Français", callback_data="lang_fr"),
        types.InlineKeyboardButton("🇩🇪 Deutsch", callback_data="lang_de")
    )
    
    # Row 6: Turkish
    keyboard.add(
        types.InlineKeyboardButton("🇹🇷 Türkçe", callback_data="lang_tr")
    )
    
    return keyboard


def get_language_selection_message(current_lang: str = 'en') -> str:
    """
    Get message text for language selection
    
    Args:
        current_lang: Current user language
    
    Returns:
        Formatted message text
    """
    return CHOOSE_LANGUAGE_MESSAGES.get(current_lang, CHOOSE_LANGUAGE_MESSAGES['en'])


def handle_language_callback(callback_data: str) -> str:
    """
    Extract language code from callback data
    
    Args:
        callback_data: Callback data from button (e.g., "lang_en", "lang_ru")
    
    Returns:
        Language code (defaults to 'en' if invalid)
    """
    if callback_data.startswith('lang_'):
        lang_code = callback_data.replace('lang_', '')
        if lang_code in SUPPORTED_LANGUAGES:
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
    return LANGUAGE_CHANGED_MESSAGES.get(lang, LANGUAGE_CHANGED_MESSAGES['en'])


def get_supported_languages() -> dict:
    """Get all supported languages with their info"""
    return SUPPORTED_LANGUAGES


def is_supported_language(lang_code: str) -> bool:
    """Check if a language code is supported"""
    return lang_code in SUPPORTED_LANGUAGES


def get_language_info(lang_code: str) -> dict:
    """Get info about a specific language"""
    return SUPPORTED_LANGUAGES.get(lang_code, SUPPORTED_LANGUAGES['en'])


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

