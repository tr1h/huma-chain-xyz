import telebot
from telebot import types
import time
import schedule
import threading
import base64
import os
import io
import logging
import random
import json
from datetime import datetime, timedelta
from collections import defaultdict
from supabase import create_client, Client
from dotenv import load_dotenv
import qrcode
import requests
from flask import Flask, request

# Import gamification module
from gamification import (
    DailyRewards, MiniGames, RankSystem, BadgeSystem, QuestSystem,
    BADGES, RANKS, QUESTS, ACHIEVEMENTS
)

# Import NFT system
from nft_system import NFTSystem

# Import auto-posting system
from auto_posting import setup_auto_posting

# Import Twitter posting system (optional)
try:
    from twitter_posting import setup_twitter_posting
    TWITTER_ENABLED = True
except ImportError:
    TWITTER_ENABLED = False
    print("⚠️ Twitter posting disabled (tweepy not installed)")

# Load environment variables (optional .env)
import codecs
env_path = '../.env'
try:
    if os.path.exists(env_path):
        with codecs.open(env_path, 'r', encoding='utf-8-sig') as f:
            env_content = f.read()
            for line in env_content.strip().split('\n'):
                if '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
except Exception:
    # If .env is missing or unreadable, continue; rely on process ENV
    pass

# Bot token
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
BOT_USERNAME = os.getenv('BOT_USERNAME', 'GotchiGameBot')
bot = telebot.TeleBot(TOKEN)

# URLs
GAME_URL = os.getenv('GAME_URL', 'https://solanatamagotchi.com/tamagotchi-game.html?v=20251113')  # Telegram Mini App URL
MINT_URL = os.getenv('MINT_URL', 'https://solanatamagotchi.com/mint.html')  # Mint URL
CHANNEL_USERNAME = os.getenv('CHANNEL_USERNAME', '@GotchiGame')  # Channel username for posting

# Menu button text (bottom menu button label)
MENU_BUTTON_TEXT = os.getenv('MENU_BUTTON_TEXT', '🎮 Gotchi Game')

# Configure persistent menu button to open WebApp globally
try:
    bot.set_chat_menu_button(menu_button=types.MenuButtonWebApp(
        type="web_app",
        text=MENU_BUTTON_TEXT,
        web_app=types.WebAppInfo(url=GAME_URL)
    ))
    print(f"✅ Set global menu button to: {GAME_URL}")
except Exception as e:
    print(f"❌ Error setting global menu button: {e}")

# Group settings
GROUP_ID = int(os.getenv('GROUP_ID', '-1002938566588'))  # @gotchigamechat group ID

# Admin IDs (add your Telegram ID)
ADMIN_IDS = [int(x) for x in os.getenv('ADMIN_IDS', '7401131043').split(',') if x.strip()]

# Group IDs that are exempt from anti-spam
EXEMPT_GROUP_IDS = [int(x) for x in os.getenv('EXEMPT_GROUP_IDS', '-1002938566588').split(',') if x.strip()]  # @gotchigamechat group ID

# TAMA API Configuration (UPDATED TO CUSTOM DOMAIN)
TAMA_API_BASE = os.getenv('TAMA_API_BASE', "https://api.solanatamagotchi.com/api/tama")

def is_api_available():
    """Check if TAMA API is available"""
    try:
        # Try with shorter timeout first
        response = requests.get(f"{TAMA_API_BASE}/test", timeout=3)
        if response.status_code == 200:
            return True
        return False
    except requests.exceptions.Timeout:
        # If timeout, try once more with longer timeout
        try:
            response = requests.get(f"{TAMA_API_BASE}/test", timeout=10)
            return response.status_code == 200
        except:
            return False
    except requests.exceptions.RequestException as e:
        # Don't log every failed check to avoid spam
        return False
    except Exception as e:
        return False

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot_monitoring.log'),
        logging.StreamHandler()
    ]
)

# Monitoring counters
monitoring_stats = {
    'requests_per_minute': defaultdict(int),
    'suspicious_activities': 0,
    'errors_count': 0,
    'referrals_today': 0
}

# Supabase connection (with retry for network issues)
SUPABASE_URL = os.getenv('SUPABASE_URL', 'YOUR_SUPABASE_URL_HERE')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'YOUR_SUPABASE_KEY_HERE')

# Retry Supabase connection (Railway network may not be ready immediately)
supabase = None
max_retries = 5
for attempt in range(max_retries):
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"✅ Supabase connected (attempt {attempt + 1})")
        break
    except Exception as e:
        if attempt < max_retries - 1:
            wait_time = (attempt + 1) * 2
            print(f"⚠️ Supabase connection failed (attempt {attempt + 1}/{max_retries}): {e}")
            print(f"⏳ Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
        else:
            print(f"❌ Failed to connect to Supabase after {max_retries} attempts: {e}")
            raise

if supabase is None:
    raise RuntimeError("Failed to initialize Supabase client")

# Initialize gamification systems
daily_rewards = DailyRewards(supabase)
mini_games = MiniGames(supabase)
rank_system = RankSystem(supabase)
badge_system = BadgeSystem(supabase)
quest_system = QuestSystem(supabase)

# Initialize NFT system
nft_system = NFTSystem(supabase)

# Helper function for NFT rarity emojis
def get_rarity_emoji(rarity):
    """Return emoji for NFT rarity"""
    emojis = {
        'common': '🐾',
        'rare': '🦊',
        'epic': '🐾',
        'legendary': '🐉'
    }
    return emojis.get(rarity.lower(), '🐾')

# Anti-spam tracking
user_messages = defaultdict(list)
SPAM_LIMIT = 5  # messages
SPAM_WINDOW = 10  # seconds

# Banned words
BANNED_WORDS = ['spam', 'scam', 'http://', 'https://']  # Add more

# Muted users
muted_users = {}

# Helper function to escape Markdown characters
def escape_markdown(text):
    """Escape special Markdown characters for Telegram"""
    if not text:
        return ""
    # Escape all special characters for MarkdownV2
    return str(text).replace('\\', '\\\\').replace('_', '\\_').replace('*', '\\*').replace('[', '\\[').replace(']', '\\]').replace('(', '\\(').replace(')', '\\)').replace('~', '\\~').replace('`', '\\`').replace('>', '\\>').replace('#', '\\#').replace('+', '\\+').replace('-', '\\-').replace('=', '\\=').replace('|', '\\|').replace('{', '\\{').replace('}', '\\}').replace('.', '\\.').replace('!', '\\!')

# TAMA API Functions
def get_referral_settings():
    """Get referral settings from database (with caching)"""
    try:
        # Try to get from Supabase referral_settings table
        response = supabase.table('referral_settings').select('*').execute()
        
        if response.data:
            settings = {}
            for s in response.data:
                settings[s['setting_key']] = int(s['setting_value'])
            return settings
    except Exception as e:
        print(f"Error getting referral settings: {e}")
    
    # Fallback to defaults if DB not available
    return {
        'referral_reward': 1000,
        'milestone_1': 500,
        'milestone_3': 750,
        'milestone_5': 1000,
        'milestone_10': 3000,
        'milestone_15': 5000,
        'milestone_25': 10000,
        'milestone_50': 30000,
        'milestone_75': 50000,
        'milestone_100': 100000,
        'milestone_150': 150000,
        'milestone_250': 250000,
        'milestone_500': 500000,
        'milestone_1000': 1000000
    }

def get_tama_balance(telegram_id):
    """╨Я╨╛╨╗╤Г╤З╨╕╤В╤М ╨▒╨░╨╗╨░╨╜╤Б TAMA ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤П"""
    try:
        response = requests.get(f"{TAMA_API_BASE}/balance", params={
            "user_id": telegram_id,
            "user_type": "telegram"
        })
        result = response.json()
        if result.get("success"):
            return result.get("database_tama", 0)
        return 0
    except Exception as e:
        print(f"Error getting TAMA balance: {e}")
        return 0

def add_tama_reward(telegram_id, amount, source="game", apply_nft_multiplier=True):
    """╨Ф╨╛╨▒╨░╨▓╨╕╤В╤М TAMA ╨╜╨░╨│╤А╨░╨┤╤Г ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤О"""
    try:
        # Apply NFT multiplier if enabled
        original_amount = amount
        if apply_nft_multiplier:
            try:
                multiplier = nft_system.get_user_multiplier(telegram_id)
                if multiplier > 1.0:
                    amount = int(amount * multiplier)
                    print(f"🎁 NFT Boost applied: {original_amount} TAMA × {multiplier}x = {amount} TAMA")
            except Exception as e:
                print(f"Error applying NFT multiplier: {e}")
        
        response = requests.post(f"{TAMA_API_BASE}/add", json={
            "user_id": telegram_id,
            "user_type": "telegram",
            "amount": amount,
            "source": source
        })
        result = response.json()
        return result.get("success", False)
    except Exception as e:
        print(f"Error adding TAMA reward: {e}")
        return False

def spend_tama_tokens(telegram_id, amount, purpose="spend"):
    """╨Я╨╛╤В╤А╨░╤В╨╕╤В╤М TAMA ╤В╨╛╨║╨╡╨╜╤Л ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤П"""
    try:
        response = requests.post(f"{TAMA_API_BASE}/spend", json={
            "user_id": telegram_id,
            "user_type": "telegram",
            "amount": amount,
            "purpose": purpose
        })
        result = response.json()
        return result.get("success", False)
    except Exception as e:
        print(f"Error spending TAMA: {e}")
        return False

def format_tama_balance(balance):
    """╨д╨╛╤А╨╝╨░╤В╨╕╤А╨╛╨▓╨░╤В╤М ╨▒╨░╨╗╨░╨╜╤Б TAMA ╨┤╨╗╤П ╨╛╤В╨╛╨▒╤А╨░╨╢╨╡╨╜╨╕╤П"""
    if balance >= 1_000_000:
        return f"{balance / 1_000_000:.1f}M TAMA"
    elif balance >= 1_000:
        return f"{balance / 1_000:.1f}K TAMA"
    else:
        return f"{balance:,} TAMA"

def get_nft_costs():
    """╨Я╨╛╨╗╤Г╤З╨╕╤В╤М ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М NFT"""
    try:
        response = requests.get(f"{TAMA_API_BASE}/nft-costs", timeout=5)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                return result.get("costs", {})
        # Fallback to default costs if API fails
        return {
            'common': {'tama': 1000, 'sol': 0.01},
            'rare': {'tama': 5000, 'sol': 0.05},
            'epic': {'tama': 10000, 'sol': 0.1},
            'legendary': {'tama': 50000, 'sol': 0.5}
        }
    except Exception as e:
        print(f"Error getting NFT costs: {e}")
        # Return default costs as fallback
        return {
            'common': {'tama': 1000, 'sol': 0.01},
            'rare': {'tama': 5000, 'sol': 0.05},
            'epic': {'tama': 10000, 'sol': 0.1},
            'legendary': {'tama': 50000, 'sol': 0.5}
        }

def mint_nft(telegram_id, pet_name="", rarity="common"):
    """╨Ь╨╕╨╜╤В NFT ╨╖╨░ TAMA"""
    try:
        response = requests.post(f"{TAMA_API_BASE}/mint-nft", json={
            "user_id": telegram_id,
            "user_type": "telegram",
            "pet_name": pet_name,
            "rarity": rarity
        }, timeout=10)
        result = response.json()
        return result.get("success", False), result
    except requests.exceptions.RequestException as e:
        print(f"Error minting NFT (network): {e}")
        return False, {"error": "API unavailable"}
    except Exception as e:
        print(f"Error minting NFT: {e}")
        return False, {"error": str(e)}

def get_user_nfts(telegram_id):
    """╨Я╨╛╨╗╤Г╤З╨╕╤В╤М NFT ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤П"""
    try:
        response = requests.get(f"{TAMA_API_BASE}/nfts", params={
            "user_id": telegram_id,
            "user_type": "telegram"
        })
        result = response.json()
        if result.get("success"):
            return result.get("nfts", [])
        return []
    except Exception as e:
        print(f"Error getting user NFTs: {e}")
        return []

# Generate beautiful referral code
def generate_referral_code(telegram_id):
    """Generate a beautiful referral code from Telegram ID only - NO WALLET NEEDED!"""
    import hashlib
    import re
    
    # Validate telegram_id
    if not telegram_id or not str(telegram_id).isdigit():
        raise ValueError("Invalid Telegram ID")
    
    # Use SHA256 for better distribution (SAME as game)
    hash_bytes = hashlib.sha256(str(telegram_id).encode()).digest()
    # Take first 3 bytes and convert to base36 (SAME as game)
    hash_val = int.from_bytes(hash_bytes[:3], 'big')
    code_num = hash_val % (36 ** 6)
    
    # Convert to base36 (0-9, A-Z) - SAME as game
    def to_base36(num):
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        result = ''
        while num > 0:
            result = chars[num % 36] + result
            num //= 36
        return result.zfill(6)[:6]
    
    code_part = to_base36(code_num)
    return f"TAMA{code_part}"

# Validate referral code
def validate_referral_code(ref_code):
    """Validate referral code format"""
    import re
    if not ref_code or not isinstance(ref_code, str):
        return False
    # Check format: TAMA + 6 alphanumeric characters
    pattern = r'^TAMA[A-Z0-9]{6}$'
    return bool(re.match(pattern, ref_code))

# Find telegram_id by referral code (NO WALLET NEEDED!)
def find_telegram_by_referral_code(ref_code):
    """Find Telegram ID by referral code - NO WALLET NEEDED!"""
    try:
        # Validate referral code first
        if not validate_referral_code(ref_code):
            print(f"Invalid referral code format: {ref_code}")
            return None
        # Try to find by referral_code in leaderboard (fast lookup)
        response = supabase.table('leaderboard').select('telegram_id').eq('referral_code', ref_code).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]['telegram_id']
        
        # Fallback: Generate codes for all users and find match
        response = supabase.table('leaderboard').select('telegram_id').execute()
        
        for user in response.data:
            if user.get('telegram_id'):
                # Generate code for this user
                generated_code = generate_referral_code(user['telegram_id'])
                if generated_code == ref_code:
                    # Save the code for next time (optimization)
                    supabase.table('leaderboard').update({
                        'referral_code': ref_code
                    }).eq('telegram_id', user['telegram_id']).execute()
                    return user['telegram_id']
        
        return None
    except Exception as e:
        print(f"Error finding telegram_id by code: {e}")
        return None

# Get stats from MySQL
def get_stats():
    try:
        response = supabase.table('leaderboard').select('*', count='exact').execute()
        players = response.count or 0
        pets = players  # Same as players for now
        
        return {'players': players, 'pets': pets, 'price': '0.3 SOL'}
    except:
        return {'players': 0, 'pets': 0, 'price': '0.3 SOL'}

# Get wallet address by Telegram ID
def get_wallet_by_telegram(telegram_id):
    try:
        response = supabase.table('leaderboard').select('wallet_address').eq('telegram_id', telegram_id).single().execute()
        return response.data.get('wallet_address') if response.data else None
    except:
        return None

# Check if user is admin
def is_admin(user_id):
    return user_id in ADMIN_IDS or len(ADMIN_IDS) == 0

# Monitoring functions
def log_activity(user_id, action, details=""):
    """Log user activity"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logging.info(f"ACTIVITY: User {user_id} - {action} - {details}")
    
    # Track requests per minute
    current_minute = int(time.time() // 60)
    monitoring_stats['requests_per_minute'][current_minute] += 1

def send_admin_alert(message):
    """Send alert to admin"""
    try:
        for admin_id in ADMIN_IDS:
            bot.send_message(admin_id, f"⚠️ **MONITORING ALERT**\n\n{message}", parse_mode='Markdown')
        logging.warning(f"ADMIN ALERT SENT: {message}")
    except Exception as e:
        logging.error(f"Failed to send admin alert: {e}")

def check_suspicious_activity(user_id, action):
    """Check for suspicious activity patterns"""
    current_time = time.time()
    
    # Check for high request rate
    current_minute = int(current_time // 60)
    requests_this_minute = monitoring_stats['requests_per_minute'][current_minute]
    
    if requests_this_minute > 50:  # More than 50 requests per minute
        monitoring_stats['suspicious_activities'] += 1
        send_admin_alert(f"⚠️ **HIGH REQUEST RATE DETECTED**\n\nUser: {user_id}\nRequests this minute: {requests_this_minute}\nAction: {action}")
        return True
    
    # Check for rapid referral attempts
    if action == "referral_attempt":
        # This would need more sophisticated tracking
        pass
    
    return False

def safe_edit_message_text(text, chat_id, message_id, parse_mode=None, reply_markup=None):
    """Safely edit message text, ignoring 'message is not modified' errors"""
    try:
        bot.edit_message_text(text, chat_id, message_id, parse_mode=parse_mode, reply_markup=reply_markup)
    except Exception as e:
        error_msg = str(e)
        if "message is not modified" in error_msg.lower():
            # This is not a real error, just ignore it
            pass
        else:
            # Real error, log it
            print(f"Error editing message: {e}")

def log_error(error_type, details, user_id=None):
    """Log errors and send alerts for critical ones"""
    monitoring_stats['errors_count'] += 1
    error_msg = f"ERROR: {error_type} - {details}"
    if user_id:
        error_msg += f" - User: {user_id}"
    
    logging.error(error_msg)
    
    # Send alert for critical errors
    if error_type in ['database_error', 'security_violation', 'system_failure']:
        send_admin_alert(f"⚠️ **CRITICAL ERROR**\n\nType: {error_type}\nDetails: {details}\nUser: {user_id}")

# Check if user is muted
def is_muted(user_id, chat_id):
    key = f"{chat_id}_{user_id}"
    if key in muted_users:
        if time.time() < muted_users[key]:
            return True
        else:
            del muted_users[key]
    return False

# Anti-spam check
def check_spam(user_id):
    now = time.time()
    user_messages[user_id] = [msg_time for msg_time in user_messages[user_id] if now - msg_time < SPAM_WINDOW]
    user_messages[user_id].append(now)
    return len(user_messages[user_id]) > SPAM_LIMIT

# Filter banned words
def has_banned_words(text):
    text_lower = text.lower()
    for word in BANNED_WORDS:
        if word in text_lower:
            return True
    return False

# Middleware for group messages (NON-COMMAND messages only)
@bot.message_handler(func=lambda message: message.chat.type in ['group', 'supergroup'] and message.text and not message.text.startswith('/'))
def handle_group_message(message):
    user_id = message.from_user.id
    chat_id = message.chat.id
    
    # Debug: log group messages (safely handle unicode)
    try:
        print(f"Group message: {message.chat.title} (ID: {chat_id}) from {message.from_user.first_name}")
    except UnicodeEncodeError:
        print(f"Group message from user {user_id} in chat {chat_id}")
    
    # Skip if admin - no anti-spam for admins
    if is_admin(user_id):
        return
    
    # Skip if group is exempt from anti-spam
    if chat_id in EXEMPT_GROUP_IDS:
        return
    
    # Check mute
    if is_muted(user_id, chat_id):
        try:
            bot.delete_message(chat_id, message.message_id)
        except:
            pass
        return
    
    # Check spam
    if check_spam(user_id):
        try:
            bot.delete_message(chat_id, message.message_id)
            bot.send_message(chat_id, f"⚠️ {message.from_user.first_name}, slow down! Anti-spam protection.")
        except:
            pass
        return
    
    # Check banned words
    if message.text and has_banned_words(message.text):
        try:
            bot.delete_message(chat_id, message.message_id)
            bot.send_message(chat_id, f"⚠️ {message.from_user.first_name}, your message was removed (prohibited content).")
        except:
            pass
        return

# Handle referral links
@bot.message_handler(commands=['start'], func=lambda message: message.chat.type == 'private')
def handle_start(message):
    user_id = message.from_user.id
    log_activity(user_id, "start_command")
    
    # Check for suspicious activity
    if check_suspicious_activity(user_id, "start_command"):
        return
    
    # Check if it's a referral link
    if len(message.text.split()) > 1:
        ref_param = message.text.split()[1]
        if ref_param.startswith('ref'):
            # Extract referral code
            ref_code = ref_param[3:]  # Remove 'ref' prefix
            log_activity(user_id, "referral_click", f"code: {ref_code}")
            try:
                # Store referral info
                user_id = message.from_user.id
                username = message.from_user.username or message.from_user.first_name
                
                # Find referrer telegram_id by code (NO WALLET NEEDED!)
                try:
                    # Find by referral code directly
                    referrer_telegram_id = find_telegram_by_referral_code(ref_code)
                    
                    if referrer_telegram_id:
                        # Get username
                        referrer_response = supabase.table('leaderboard').select('telegram_username').eq('telegram_id', str(referrer_telegram_id)).execute()
                        referrer_username = referrer_response.data[0].get('telegram_username', 'Friend') if referrer_response.data else 'Friend'
                    else:
                        referrer_telegram_id = None
                        referrer_username = 'Friend'
                    
                    # Check self-referral
                    if referrer_telegram_id and str(referrer_telegram_id) == str(user_id):
                        bot.reply_to(message, "❌ You cannot refer yourself!")
                        return
                    
                    # Save pending referral to database
                    if referrer_telegram_id:
                        # Check if referral already exists
                        existing = supabase.table('pending_referrals').select('*').eq('referrer_telegram_id', str(referrer_telegram_id)).eq('referred_telegram_id', str(user_id)).execute()
                        
                        if not existing.data:
                            supabase.table('pending_referrals').insert({
                                'referrer_telegram_id': str(referrer_telegram_id),
                                'referred_telegram_id': str(user_id),
                                'referrer_username': referrer_username,
                                'referred_username': username,
                                'referral_code': ref_code,
                                'status': 'pending'
                            }).execute()
                            print(f"✅ Saved pending referral: {referrer_telegram_id} -> {user_id}")
                        else:
                            print(f"тЪая╕П Referral already exists: {referrer_telegram_id} -> {user_id}")
                        
                        # IMMEDIATE TAMA REWARD - ╨╜╨░╤З╨╕╤Б╨╗╤П╨╡╨╝ TAMA ╤Б╤А╨░╨╖╤Г! (NO WALLET NEEDED!)
                        # Only award if this is a NEW referral
                        if not existing.data:
                            try:
                                # ╨Э╨░╨╣╤В╨╕ ╨╕╨╗╨╕ ╤Б╨╛╨╖╨┤╨░╤В╤М ╤А╨╡╤Д╨╡╤А╨╡╤А╨░ ╨▓ leaderboard
                                referrer_data = supabase.table('leaderboard').select('*').eq('telegram_id', str(referrer_telegram_id)).execute()
                                
                                if referrer_data.data and len(referrer_data.data) > 0:
                                    referrer = referrer_data.data[0]
                                    current_tama = referrer.get('tama', 0) or 0
                                    
                                    # Get referral reward from settings (or default 1000)
                                    settings = get_referral_settings()
                                    referral_reward = settings.get('referral_reward', 1000)
                                    new_tama = current_tama + referral_reward
                                    
                                    # ╨Ю╨▒╨╜╨╛╨▓╨╕╤В╤М TAMA ╨▒╨░╨╗╨░╨╜╤Б
                                    supabase.table('leaderboard').update({
                                        'tama': new_tama
                                    }).eq('telegram_id', str(referrer_telegram_id)).execute()
                                    
                                    print(f"💰 Awarded {referral_reward} TAMA to {referrer_telegram_id} (new balance: {new_tama})")
                                    
                                    # 🔔 Notify admins about new referral
                                    try:
                                        referrer_username_display = referrer.get('telegram_username', 'Unknown')
                                        new_user_username = message.from_user.username or message.from_user.first_name or 'Unknown'
                                        admin_notification = f"""🎉 **NEW REFERRAL!**

👤 **Referrer:**
• ID: `{referrer_telegram_id}`
• Username: @{referrer_username_display}
• New Balance: {new_tama:,} TAMA

👥 **New User:**
• ID: `{user_id}`
• Username: @{new_user_username}
• Code: `{ref_code}`

💰 **Reward:**
• +{referral_reward:,} TAMA awarded
• Total Referrals: {total_referrals + 1}

⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"""
                                        for admin_id in ADMIN_IDS:
                                            try:
                                                bot.send_message(admin_id, admin_notification, parse_mode='Markdown')
                                            except Exception as admin_err:
                                                print(f"⚠️ Failed to notify admin {admin_id}: {admin_err}")
                                    except Exception as notify_err:
                                        print(f"⚠️ Error sending admin notification: {notify_err}")
                                else:
                                    # ╨б╨╛╨╖╨┤╨░╤В╤М ╨╜╨╛╨▓╨╛╨│╨╛ ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤П ╨╡╤Б╨╗╨╕ ╨╡╨│╨╛ ╨╜╨╡╤В
                                    referrer_ref_code = generate_referral_code(referrer_telegram_id)
                                    # Get referral reward from settings
                                    settings = get_referral_settings()
                                    referral_reward = settings.get('referral_reward', 1000)
                                    supabase.table('leaderboard').insert({
                                        'telegram_id': str(referrer_telegram_id),
                                        'telegram_username': referrer_username,
                                        'wallet_address': f'telegram_{referrer_telegram_id}',  # Placeholder
                                        'tama': referral_reward,
                                        'referral_code': referrer_ref_code
                                    }).execute()
                                    print(f"💰 Created new user and awarded {referral_reward} TAMA to {referrer_telegram_id}")
                                
                                # ╨б╨╛╨╖╨┤╨░╤В╤М ╨╖╨░╨┐╨╕╤Б╤М ╨▓ referrals ╨┤╨╗╤П ╨╛╤В╤Б╨╗╨╡╨╢╨╕╨▓╨░╨╜╨╕╤П (NO WALLET!)
                                # Check if referral record already exists
                                existing_ref = supabase.table('referrals').select('*').eq('referrer_telegram_id', str(referrer_telegram_id)).eq('referred_telegram_id', str(user_id)).execute()
                                
                                if not existing_ref.data:
                                    supabase.table('referrals').insert({
                                        'referrer_telegram_id': str(referrer_telegram_id),
                                        'referred_telegram_id': str(user_id),
                                        'referrer_address': f'telegram_{referrer_telegram_id}',
                                        'referred_address': f'telegram_{user_id}',
                                        'referral_code': ref_code,
                                        'level': 1,
                                        'signup_reward': get_referral_settings().get('referral_reward', 1000),
                                        'status': 'completed',
                                        'reward_given': get_referral_settings().get('referral_reward', 1000)
                                    }).execute()
                                    print(f"✅ Created referral record for {referrer_telegram_id} -> {user_id}")
                                    
                                    # 🎁 ╨Я╨а╨Ю╨Т╨Х╨а╨Ъ╨Р ╨Ь╨Ш╨Ы╨Х╨б╨в╨Ю╨г╨Э╨Ю╨Т
                                    try:
                                        # ╨Я╨╛╨┤╤Б╤З╨╕╤В╨░╤В╤М ╨╛╨▒╤Й╨╡╨╡ ╨║╨╛╨╗╨╕╤З╨╡╤Б╤В╨▓╨╛ ╤А╨╡╤Д╨╡╤А╨░╨╗╨╛╨▓
                                        total_refs_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', str(referrer_telegram_id)).execute()
                                        total_pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', str(referrer_telegram_id)).eq('status', 'pending').execute()
                                        
                                        total_referrals = (total_refs_response.count or 0) + (total_pending_response.count or 0)
                                        
                                        # ╨Я╤А╨╛╨▓╨╡╤А╨╕╤В╤М ╨╝╨╕╨╗╨╡╤Б╤В╨╛╤Г╨╜╤Л
                                        milestone_bonus = 0
                                        milestone_text = ""
                                        
                                        # Expanded milestone system (hybrid) - using settings from DB
                                        settings = get_referral_settings()
                                        
                                        milestone_map = {
                                            1: ('milestone_1', "🎉 **FIRST STEP!**\n\n🎯 **1 Referral → +{amount} TAMA Bonus!**"),
                                            3: ('milestone_3', "🎉 **GETTING STARTED!**\n\n🎯 **3 Referrals → +{amount} TAMA Bonus!**"),
                                            5: ('milestone_5', "🎉 **MILESTONE ACHIEVED!**\n\n🏅 **5 Referrals → +{amount} TAMA Bonus!**"),
                                            10: ('milestone_10', "🎉 **MILESTONE ACHIEVED!**\n\n🏅 **10 Referrals → +{amount} TAMA Bonus!**"),
                                            15: ('milestone_15', "🎉 **HALFWAY TO GOLD!**\n\n🏅 **15 Referrals → +{amount} TAMA Bonus!**"),
                                            25: ('milestone_25', "🎉 **MILESTONE ACHIEVED!**\n\n🏅 **25 Referrals → +{amount} TAMA Bonus!**"),
                                            50: ('milestone_50', "🎉 **MILESTONE ACHIEVED!**\n\n🏅 **50 Referrals → +{amount} TAMA Bonus!**"),
                                            75: ('milestone_75', "🎉 **PLATINUM PROGRESS!**\n\n🏅 **75 Referrals → +{amount} TAMA Bonus!**"),
                                            100: ('milestone_100', "🎉 **DIAMOND MILESTONE!**\n\n🏅 **100 Referrals → +{amount} TAMA + Legendary Badge!**"),
                                            150: ('milestone_150', "🎉 **DIAMOND PROGRESS!**\n\n🏅 **150 Referrals → +{amount} TAMA Bonus!**"),
                                            250: ('milestone_250', "🎉 **MASTER MILESTONE!**\n\n👑 **250 Referrals → +{amount} TAMA + Master Badge!**"),
                                            500: ('milestone_500', "🎉 **LEGENDARY MILESTONE!**\n\n🌟 **500 Referrals → +{amount} TAMA + Legend Badge!**"),
                                            1000: ('milestone_1000', "🎉 **MYTHIC MILESTONE!**\n\n⚡ **1,000 Referrals → +{amount} TAMA + Mythic Badge!**")
                                        }
                                        
                                        if total_referrals in milestone_map:
                                            setting_key, text_template = milestone_map[total_referrals]
                                            milestone_bonus = settings.get(setting_key, 0)
                                            milestone_text = text_template.format(amount=f"{milestone_bonus:,}")
                                        
                                        # ╨Э╨░╤З╨╕╤Б╨╗╨╕╤В╤М ╨╝╨╕╨╗╨╡╤Б╤В╨╛╤Г╨╜ ╨▒╨╛╨╜╤Г╤Б
                                        if milestone_bonus > 0:
                                            # ╨Я╨╛╨╗╤Г╤З╨╕╤В╤М ╤В╨╡╨║╤Г╤Й╨╕╨╣ ╨▒╨░╨╗╨░╨╜╤Б
                                            current_balance_response = supabase.table('leaderboard').select('tama').eq('telegram_id', str(referrer_telegram_id)).execute()
                                            current_balance = current_balance_response.data[0].get('tama', 0) if current_balance_response.data else 0
                                            new_balance = current_balance + milestone_bonus
                                            
                                            # ╨Ю╨▒╨╜╨╛╨▓╨╕╤В╤М ╨▒╨░╨╗╨░╨╜╤Б
                                            supabase.table('leaderboard').update({
                                                'tama': new_balance
                                            }).eq('telegram_id', str(referrer_telegram_id)).execute()
                                            
                                            print(f"🎁 Milestone bonus: {milestone_bonus} TAMA to {referrer_telegram_id} (new balance: {new_balance})")
                                            
                                            # ╨Ю╤В╨┐╤А╨░╨▓╨╕╤В╤М ╤Г╨▓╨╡╨┤╨╛╨╝╨╗╨╡╨╜╨╕╨╡ ╨╛ ╨╝╨╕╨╗╨╡╤Б╤В╨╛╤Г╨╜╨╡
                                            try:
                                                bot.send_message(
                                                    int(referrer_telegram_id), 
                                                    milestone_text, 
                                                    parse_mode='Markdown'
                                                )
                                                print(f"🎁 Sent milestone notification to {referrer_telegram_id}")
                                            except Exception as milestone_notify_error:
                                                print(f"Error sending milestone notification: {milestone_notify_error}")
                                                
                                    except Exception as milestone_error:
                                        print(f"Error processing milestone: {milestone_error}")
                                    
                                    # ЁЯФФ ╨г╨Т╨Х╨Ф╨Ю╨Ь╨Ы╨Х╨Э╨Ш╨Х ╨а╨Х╨д╨Х╨а╨Х╨а╨г ╨Ю ╨Э╨Ю╨Т╨Ю╨Ь ╨а╨Х╨д╨Х╨а╨Р╨Ы╨Х
                                    try:
                                        notification_text = f"""
🎉 *New Referral!*

🎊 *New user joined:* {username}
💰 *You earned:* 1,000 TAMA
📊 *Your total referrals:* {total_referrals + 1}

🔗 *Keep sharing your link to earn more!*
                                        """
                                        
                                        bot.send_message(
                                            int(referrer_telegram_id), 
                                            notification_text, 
                                            parse_mode='Markdown'
                                        )
                                        print(f"ЁЯФФ Sent notification to referrer {referrer_telegram_id}")
                                        
                                    except Exception as notify_error:
                                        print(f"Error sending notification: {notify_error}")
                                    
                            except Exception as tama_error:
                                print(f"Error awarding TAMA: {tama_error}")
                                log_error("tama_award_error", str(tama_error), user_id)
                except Exception as e:
                    print(f"Error saving pending referral: {e}")
                
                # Send welcome with referral info
                welcome_text = f"""
🎉 *Welcome to Solana Tamagotchi!*

You were invited by a friend! 🎁

🔗 *Start earning TAMA:*
• Get your referral link below
• Share with friends = 1,000 TAMA each!
• Milestone bonuses up to 100,000 TAMA!

🎮 *Game Features:*
• 🐾 Adopt & nurture NFT pets
• 🏅 Climb leaderboards
• 🎨 Mint unique pet NFTs
• 💰 Daily rewards & achievements

🚀 *Ready to start earning?*
                """
                
                keyboard = types.InlineKeyboardMarkup()
                keyboard.row(
                    types.InlineKeyboardButton("🔗 Get My Referral Link", callback_data="get_referral"),
                    types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats")
                )
                keyboard.row(
                    types.InlineKeyboardButton("🏅 Leaderboard", callback_data="leaderboard"),
                    types.InlineKeyboardButton("🎖️ Reviews & Feedback", url="https://t.me/gotchigamechat")
                )
                
                bot.reply_to(message, welcome_text, parse_mode='Markdown', reply_markup=keyboard)
                return
                
            except Exception as e:
                print(f"Error processing referral: {e}")
    
    # Regular start command
    send_welcome(message)

# Commands - Private chat only
@bot.message_handler(commands=['help'], func=lambda message: message.chat.type == 'private')
def send_welcome(message):
    # Get user stats
    telegram_id = str(message.from_user.id)
    streak_days = daily_rewards.get_streak(telegram_id)
    can_claim, _ = daily_rewards.can_claim(telegram_id)
    
    # ✅ FETCH FRESH TAMA BALANCE (in case user minted NFT on website)
    try:
        leaderboard_response = supabase.table('leaderboard').select('tama, level, xp').eq('telegram_id', telegram_id).execute()
        user_data = leaderboard_response.data[0] if leaderboard_response.data else {}
        tama_balance = user_data.get('tama', 0)
        level = user_data.get('level', 1)
        xp = user_data.get('xp', 0)
        
        # Show balance in welcome message
        balance_text = f"💰 *Your Balance:* {tama_balance:,} TAMA (Lvl {level})"
    except Exception as e:
        print(f"⚠️ Failed to fetch balance in send_welcome: {e}")
        balance_text = "💰 *Your Balance:* Loading..."
    
    welcome_text = f"""
🎮 *Welcome to Solana Tamagotchi!*

*The ultimate Play-to-Earn NFT pet game on Solana!*
🚀 *Currently in pre-launch phase - building our community!*

{balance_text}

⭐ *What you can do RIGHT NOW:*
• 🎁 **Daily Rewards** - Claim your daily TAMA! (Streak: {streak_days} days)
• 🎮 **Play Game** - Click pet and earn TAMA!
• 🔗 **Referral Program** - 1,000 TAMA per friend!
• 🏆 **Badges & Ranks** - Collect achievements!
• 📋 **Quests** - Complete challenges for bonuses!

💰 *Start earning TAMA today - no wallet needed!*

📄 *Legal:* [Terms](https://solanatamagotchi.com/terms) • [Privacy](https://solanatamagotchi.com/privacy) • [Risk Warning](https://solanatamagotchi.com/disclaimer)
    """
    
    # Create inline keyboard with gamification
    keyboard = types.InlineKeyboardMarkup()
    
    # Get user's wallet for referral links
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name
    wallet_address = get_wallet_by_telegram(str(user_id))
    
    if wallet_address:
        # User has wallet - create referral links
        game_url = f"{GAME_URL}?ref={wallet_address}&tg_id={user_id}&tg_username={username}"
        mint_url = f"{MINT_URL}?ref={wallet_address}&tg_id={user_id}&tg_username={username}"
    else:
        # No wallet - use regular links
        game_url = GAME_URL
        mint_url = MINT_URL
    
    # Row 1: Daily Reward (highlight if available)
    daily_emoji = "🎁⭐" if can_claim else "🎁"
    keyboard.row(
        types.InlineKeyboardButton(f"{daily_emoji} Daily Reward", callback_data="daily_reward")
    )
    
    # Row 2: NFT Menu (NEW!)
    keyboard.row(
        types.InlineKeyboardButton("🖼️ My NFTs", callback_data="my_nfts"),
        types.InlineKeyboardButton("🎨 Mint NFT", callback_data="mint_nft")
    )
    
    # Row 3: Withdrawal Button (NEW!)
    keyboard.row(
        types.InlineKeyboardButton("💸 Withdraw TAMA", callback_data="withdraw_tama")
    )
    
    # Row 4: Referral (Mini-Games removed - available in main game)
    keyboard.row(
        types.InlineKeyboardButton("🔗 Referral", callback_data="get_referral")
    )
    
    # Row 5: Stats & Quests
    keyboard.row(
        types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats_detailed"),
        types.InlineKeyboardButton("📋 Quests", callback_data="view_quests")
    )
    
    # Row 6: Badges & Rank
    keyboard.row(
        types.InlineKeyboardButton("🏆 Badges", callback_data="view_badges"),
        types.InlineKeyboardButton("🎖️ My Rank", callback_data="view_rank")
    )
    
    # Row 7: Leaderboard only (Play Game moved to bottom menu)
    keyboard.row(
        types.InlineKeyboardButton("🏅 Leaderboard", callback_data="leaderboard")
    )
    
    # Row 8: Community
    keyboard.row(
        types.InlineKeyboardButton("👥 Community", url="https://t.me/gotchigamechat")
    )
    
    bot.reply_to(message, welcome_text, parse_mode='Markdown', reply_markup=keyboard)

    # Set persistent menu button for this user (replaces default menu)
    try:
        bot.set_chat_menu_button(
            chat_id=message.chat.id,
            menu_button=types.MenuButtonWebApp(
                type="web_app",
                text=MENU_BUTTON_TEXT,
                web_app=types.WebAppInfo(url=game_url)
            )
        )
        print(f"✅ Set menu button for user {message.chat.id}")
    except Exception as e:
        print(f"❌ Error setting menu button: {e}")

# Handle callback queries - REMOVED DUPLICATE

# Private commands (personal data)
@bot.message_handler(commands=['analytics'], func=lambda message: message.chat.type == 'private')
def send_analytics(message):
    """Show referral analytics"""
    telegram_id = str(message.from_user.id)
    
    try:
        # Get referral stats
        ref_response = supabase.table('referrals').select('*').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = len(ref_response.data or []) + len(pending_response.data or [])
        active_refs = len(ref_response.data or [])
        pending_refs = len(pending_response.data or [])
        
        # Get real TAMA balance from leaderboard
        leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
        total_earned = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
        
        # Get last 5 referrals
        recent = (ref_response.data or [])[:5]
        recent_text = "\n".join([f"• {r.get('created_at', 'N/A')[:10]} - {r.get('signup_reward', 0)} TAMA" for r in recent]) or "No referrals yet"
        
        text = f"""
📊 *Referral Analytics:*

🎯 *Overview:*
• Total Referrals: {total_refs}
• Active: {active_refs}
• Pending: {pending_refs}
• Total Earned: {total_earned} TAMA

📅 *Recent Referrals:*
{recent_text}

💰 *Tips:*
• Share your link in groups
• Use QR codes for offline
• Post on social media

Use /ref to get your link!
        """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error getting analytics: {e}")
        bot.reply_to(message, "❌ Error loading analytics")

@bot.message_handler(commands=['stats'], func=lambda message: message.chat.type == 'private')
def send_stats(message):
    telegram_id = str(message.from_user.id)
    username = message.from_user.username or message.from_user.first_name
    
    try:
        # Get player data from Supabase by telegram_id
        response = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
        
        if response.data:
            player = response.data[0]
            
            # Get referral stats (active referrals with wallets)
            ref_l1_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('level', 1).execute()
            ref_l2_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('level', 2).execute()
            
            level1_count = ref_l1_response.count or 0
            level2_count = ref_l2_response.count or 0
            
            # Get pending referrals (not connected wallet yet)
            pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
            pending_count = pending_response.count or 0
            
            # Calculate total earned from referrals (use real TAMA balance)
            level1_earned = sum([r.get('signup_reward', 0) for r in ref_l1_response.data]) if ref_l1_response.data else 0
            level2_earned = sum([r.get('signup_reward', 0) for r in ref_l2_response.data]) if ref_l2_response.data else 0
            
            total_referrals = level1_count + level2_count + pending_count
            total_earned = player.get('tama', 0)  # Use real TAMA balance from leaderboard
            
            text = f"""
📊 *Your Personal Stats:*

🐾 *Your Pet:*
• Name: {player.get('pet_name', 'No pet yet')}
• Type: {player.get('pet_type', 'N/A')}
• Rarity: {player.get('pet_rarity', 'N/A')}
• Level: {player.get('level', 1)}
• XP: {player.get('xp', 0)}

💰 *Your Balance:*
• TAMA Tokens: {player.get('tama', 0)}

🔗 *Your Referrals:*
• 👥 Total Referrals: {total_referrals}
• ✅ Earned from referrals: {level1_earned + (pending_count * 1000)} TAMA
• 💰 Total Earned: {total_earned} TAMA

💳 *Wallet:*
• `{player['wallet_address'][:8]}...{player['wallet_address'][-8:]}`

*Keep playing and referring friends to earn more!* 🚀
            """
        else:
            # No wallet linked yet - but show pending referrals!
            game_link = f"{GAME_URL}?tg_id={telegram_id}&tg_username={username}"
            
            # Get pending referrals even without wallet
            try:
                pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
                pending_count = pending_response.count or 0
            except:
                pending_count = 0
            
            text = f"""
📊 *Your Personal Stats:*

❌ *No wallet linked yet!*

🔗 *Your Referrals:*
• 👥 Total Referrals: {pending_count}
• 💰 Total Earned: {pending_count * 100} TAMA

To start playing and tracking your stats:
1я╕ПтГг Click the button below
2я╕ПтГг Connect your Phantom wallet
3я╕ПтГг Your progress will be automatically saved!
4я╕ПтГг All pending referrals will be activated!

🎮 *Ready to start?*
            """
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🎮 Start Playing", url=game_link),
                types.InlineKeyboardButton("🎨 Mint NFT", url=MINT_URL)
            )
            bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
            return
        
        # Add buttons
        keyboard = types.InlineKeyboardMarkup()
        game_link = f"{GAME_URL}?tg_id={telegram_id}&tg_username={username}"
        keyboard.row(
            types.InlineKeyboardButton("🔗 Share Referral", callback_data="get_referral")
        )
        
        bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        bot.reply_to(message, "❌ Error getting your stats. Please try again later.")

@bot.message_handler(commands=['wallet', 'link'], func=lambda message: message.chat.type == 'private')
def link_wallet(message):
    """Link wallet to Telegram account or show current wallet"""
    telegram_id = str(message.from_user.id)
    username = message.from_user.username or message.from_user.first_name
    
    try:
        response = supabase.table('leaderboard').select('wallet_address').eq('telegram_id', telegram_id).execute()
        
        if response.data and len(response.data) > 0:
            existing = response.data[0]
            wallet = existing.get('wallet_address', '')
            
            if wallet and wallet != 'placeholder' and len(wallet) > 10:
                text = f"""
✅ *Wallet Connected!*

💳 *Your Wallet:*
`{wallet[:8]}...{wallet[-8:]}`

You can now withdraw TAMA tokens using /withdraw

💡 To change wallet later, use /wallet again
                """
            else:
                text = f"""
🔗 *Link Your Wallet*

To link your wallet to this Telegram account:

1️⃣ Go to the game: [Play Game]({GAME_URL})
2️⃣ Connect your Phantom wallet
3️⃣ Copy your wallet address
4️⃣ Send it to me with: `/link YOUR_WALLET_ADDRESS`

*Example:* `/link DteCpGbnUjubW7EFUUexiHY8J1cTJmowFhFzK9jt6D2e`
                """
        else:
            text = f"""
🔗 *Link Your Wallet*

To link your wallet to this Telegram account:

1️⃣ Go to the game: [Play Game]({GAME_URL})
2️⃣ Connect your Phantom wallet
3️⃣ Copy your wallet address
4️⃣ Send it to me with: `/link YOUR_WALLET_ADDRESS`

*Example:* `/link DteCpGbnUjubW7EFUUexiHY8J1cTJmowFhFzK9jt6D2e`
            """
        
    except Exception as e:
        print(f"Error in link command: {e}")
        text = "❌ Error. Please try again later."
    
    bot.reply_to(message, text, parse_mode='Markdown')

# ==================== WITHDRAWAL MESSAGE HANDLERS ====================

# Temporary storage for withdrawal flow
withdrawal_sessions = {}

def process_wallet_address(message):
    """Process wallet address input for withdrawal"""
    telegram_id = str(message.from_user.id)
    wallet_address = message.text.strip()
    
    # Validate Solana address (basic validation: 32-44 chars, base58)
    import re
    if not re.match(r'^[1-9A-HJ-NP-Za-km-z]{32,44}$', wallet_address):
        text = """
❌ **Invalid wallet address!**

Please send a valid Solana wallet address.

**Format:** 32-44 characters, base58
**Example:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

Try again or /cancel to abort.
        """
        bot.send_message(message.chat.id, text, parse_mode='Markdown')
        bot.register_next_step_handler(message, process_wallet_address)
        return
    
    # Store wallet address in session
    withdrawal_sessions[telegram_id] = {'wallet_address': wallet_address}
    
    # Сохранить wallet address в базу данных для будущих использований
    try:
        supabase.table('leaderboard').update({
            'wallet_address': wallet_address
        }).eq('telegram_id', telegram_id).execute()
        print(f"✅ Saved wallet address for user {telegram_id}: {wallet_address[:8]}...{wallet_address[-8:]}")
    except Exception as e:
        print(f"⚠️ Error saving wallet address: {e}")
        # Продолжаем даже если сохранение не удалось
    
    # Ask for amount
    try:
        leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
        tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
        
        text = f"""
✅ **Wallet Address Confirmed!**
`{wallet_address}`

**Your Balance:** {tama_balance:,} TAMA

**How much TAMA do you want to withdraw?**

Enter amount (minimum 1,000 TAMA):
        """
        
        msg = bot.send_message(message.chat.id, text, parse_mode='Markdown')
        bot.register_next_step_handler(msg, process_withdrawal_amount)
    except Exception as e:
        print(f"Error in process_wallet_address: {e}")
        bot.send_message(message.chat.id, "❌ Error processing. Please try /withdraw again.")

def process_withdrawal_amount(message):
    """Process withdrawal amount input"""
    telegram_id = str(message.from_user.id)
    
    # Get amount
    try:
        amount = int(message.text.strip().replace(',', '').replace(' ', ''))
    except ValueError:
        bot.send_message(message.chat.id, "❌ Invalid amount! Please enter a number.", parse_mode='Markdown')
        bot.register_next_step_handler(message, process_withdrawal_amount)
        return
    
    if amount < 1000:
        bot.send_message(message.chat.id, "❌ Minimum withdrawal is 1,000 TAMA!", parse_mode='Markdown')
        bot.register_next_step_handler(message, process_withdrawal_amount)
        return
    
    # Get user balance
    try:
        leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
        tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
        
        if amount > tama_balance:
            shortage = amount - tama_balance
            text = f"""
❌ **Insufficient Balance!**

You have: **{tama_balance:,} TAMA**
You want: **{amount:,} TAMA**
Missing: **{shortage:,} TAMA**

Please enter a lower amount:
            """
            msg = bot.send_message(message.chat.id, text, parse_mode='Markdown')
            bot.register_next_step_handler(msg, process_withdrawal_amount)
            return
        
        # Calculate fee
        fee = int(amount * 0.05)
        amount_received = amount - fee
        
        # Store in session
        wallet_address = withdrawal_sessions.get(telegram_id, {}).get('wallet_address')
        withdrawal_sessions[telegram_id] = {
            'wallet_address': wallet_address,
            'amount': amount
        }
        
        # Confirm withdrawal
        text = f"""
ЁЯУЛ **WITHDRAWAL CONFIRMATION**

**From:** Your game balance
**To:** `{wallet_address[:8]}...{wallet_address[-8:]}`

**Amount:** {amount:,} TAMA
**Fee (5%):** -{fee:,} TAMA
**You receive:** **{amount_received:,} TAMA**

⚠️ **This action cannot be undone!**

Confirm withdrawal?
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("✅ Confirm", callback_data="confirm_withdrawal"),
            types.InlineKeyboardButton("❌ Cancel", callback_data="cancel_withdrawal")
        )
        
        bot.send_message(message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        
    except Exception as e:
        print(f"Error in process_withdrawal_amount: {e}")
        bot.send_message(message.chat.id, "❌ Error processing. Please try /withdraw again.")

# Handle wallet address linking
@bot.message_handler(func=lambda message: message.chat.type == 'private' and message.text and message.text.startswith('/link ') and len(message.text.split()) == 2)
def handle_wallet_link(message):
    """Handle wallet address linking"""
    telegram_id = str(message.from_user.id)
    username = message.from_user.username or message.from_user.first_name
    wallet_address = message.text.split()[1]
    
    try:
        response = supabase.table('leaderboard').select('*').eq('wallet_address', wallet_address).execute()
        
        if response.data and len(response.data) > 0:
            wallet_data = response.data[0]
            
            supabase.table('leaderboard').update({
                'telegram_id': telegram_id,
                'telegram_username': username
            }).eq('wallet_address', wallet_address).execute()
            
            text = f"""
✅ *Wallet Linked Successfully!*

💳 *Wallet:* `{wallet_address[:8]}...{wallet_address[-8:]}`
🐾 *Pet:* {wallet_data.get('pet_name') or 'No pet yet'}
💰 *TAMA:* {wallet_data.get('tama') or 0}
📊 *Level:* {wallet_data.get('level') or 1}

🎮 *Now you can:*
• Use /stats to see your progress
• Use /ref to get referral links
• Track your referrals perfectly!

*Your Telegram is now linked to this wallet!* 🚀
            """
        else:
            text = f"""
❌ *Wallet Not Found*

The wallet address `{wallet_address[:8]}...{wallet_address[-8:]}` is not in our database.

🎮 *To link your wallet:*
1. Go to the game: [Play Game]({GAME_URL})
2. Connect your Phantom wallet
3. Create your first pet
4. Then use /link with your wallet address

*Make sure you've played the game first!* 📋
            """
        
    except Exception as e:
        print(f"Error linking wallet: {e}")
        text = "❌ Error linking wallet. Please try again later."
    
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['save'], func=lambda message: message.chat.type == 'private')
def save_pet_progress(message):
    """Save pet progress to database"""
    parts = message.text.split(maxsplit=2)
    if len(parts) < 3:
        bot.reply_to(message, "Usage: /save WALLET_ADDRESS {pet_data_json}")
        return
    
    wallet_address = parts[1]
    try:
        pet_data_str = parts[2]
        
        supabase.table('leaderboard').update({
            'pet_data': pet_data_str
        }).eq('wallet_address', wallet_address).execute()
        
        bot.reply_to(message, "✅ Pet progress saved!")
        
    except Exception as e:
        print(f"Error saving pet: {e}")
        bot.reply_to(message, "❌ Error saving pet progress")

@bot.message_handler(commands=['ref', 'referral'], func=lambda message: message.chat.type == 'private')
def send_referral(message):
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name
    telegram_id = str(user_id)
    
    # Generate referral code from Telegram ID only (NO WALLET NEEDED!)
    ref_code = generate_referral_code(telegram_id)
    telegram_link = f"https://t.me/{BOT_USERNAME}?start=ref{ref_code}"
    game_link = f"{GAME_URL}?tg_id={user_id}&tg_username={username}"
    
    # Save referral code to database for fast lookup
    try:
        existing = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
        
        if existing.data:
            supabase.table('leaderboard').update({
                'referral_code': ref_code,
                'telegram_username': username
            }).eq('telegram_id', telegram_id).execute()
        else:
            supabase.table('leaderboard').insert({
                'telegram_id': telegram_id,
                'telegram_username': username,
                'wallet_address': f'telegram_{telegram_id}',
                'tama': 0,
                'referral_code': ref_code
            }).execute()
    except Exception as e:
        print(f"Error saving referral code: {e}")
    
    # Get referral stats
    try:
        response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        total_referrals = response.count or 0
        
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
        pending_count = pending_response.count or 0
        
        # Get TAMA balance from leaderboard (real balance)
        leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
        total_earnings = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
        
    except:
        total_referrals = 0
        total_earnings = 0
        pending_count = 0
    
    # Create super short beautiful referral link with preview (using query parameters for GitHub Pages)
    short_link = f"https://solanatamagotchi.com/s.html?ref={ref_code}&v=30"
    
    text = f"""
🔗 <b>Your Referral Code:</b>

<code>{ref_code}</code>

📊 <b>Your Stats:</b>
• 👥 Total Referrals: {total_referrals + pending_count}
• 💰 Total Earned: {total_earnings:,} TAMA

💰 <b>Earn instantly (NO WALLET NEEDED!):</b>
• 1,000 TAMA for each friend instantly!
• Just share your link and earn!
• TAMA accumulates in your account

🎁 <b>Milestone Bonuses:</b>
• 1 referral → +500 TAMA
• 3 referrals → +750 TAMA
• 5 referrals → +1,000 TAMA
• 10 referrals → +3,000 TAMA
• 15 referrals → +5,000 TAMA
• 25 referrals → +10,000 TAMA
• 50 referrals → +30,000 TAMA
• 75 referrals → +50,000 TAMA
• 100 referrals → +100,000 TAMA
• 150 referrals → +150,000 TAMA
• 250 referrals → +250,000 TAMA (Master!)
• 500 referrals → +500,000 TAMA (Legend!)
• 1,000 referrals → +1,000,000 TAMA (Mythic!)

📤 <b>Click "Share Link" to share with friends!</b>
    """
    
    # Share text with link for Telegram preview (text AFTER link!)
    share_text = f"""🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!

🐾 Play-to-earn game on Solana blockchain
💰 No wallet needed to start earning!

🎁 Get 1,000 TAMA instantly when you join!
🚀 Start playing and earning now!"""
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("📤 Share Link", url=f"https://t.me/share/url?url={short_link}&text={share_text.replace(chr(10), '%0A')}")
    )
    
    bot.reply_to(message, text, parse_mode='HTML', reply_markup=keyboard)

# Get referral code command
@bot.message_handler(commands=['code'], func=lambda message: message.chat.type == 'private')
def get_referral_code(message):
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name
    
    # Get wallet address from database
    telegram_id = str(user_id)
    wallet_address = get_wallet_by_telegram(telegram_id)
    
    if not wallet_address:
        bot.reply_to(message, """
❌ *No wallet linked yet!*

To get your referral code:
1. Connect your wallet in the game
2. Use /ref to get your code

Your code will be something like: `TAMA123ABC`
        """, parse_mode='Markdown')
        return
    
    # Generate beautiful code
    ref_code = generate_referral_code(wallet_address, user_id)
    
    text = f"""
📋 *Your Referral Code:*

`{ref_code}`

⭐ *How to use:*
• Share: `{ref_code}`
• Link: `https://tama.game/ref/{ref_code}`
• Telegram: `/start ref{ref_code}`

📤 *Easy to remember and share!*
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("📋 Copy Code", callback_data=f"copy_code_{ref_code}"),
        types.InlineKeyboardButton("🔗 Get Full Link", callback_data="get_full_link")
    )
    
    bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)

# Group commands (public)
@bot.message_handler(commands=['start'], func=lambda message: message.chat.type in ['group', 'supergroup'])
def send_group_welcome(message):
    text = f"""🐾 <b>Welcome to Solana Tamagotchi Community!</b>

🎮 <b>What's this about?</b>
<b>Play-to-Earn NFT pet game</b> on Solana blockchain <i>(Coming Soon!)</i>
<b>Mint unique pets</b> and earn TAMA tokens <i>(Pre-launch)</i>
<b>Referral system</b> (1,000 TAMA per friend + milestone bonuses!)
<b>Daily rewards & achievements</b> <i>(Coming Soon)</i>
<b>Community-driven gameplay</b>

🚀 <b>Get Started (Pre-Launch):</b>
<b>Get referral link:</b> Message @{BOT_USERNAME}
<b>Start earning TAMA:</b> Share your referral link now!
<b>Website:</b> <a href="https://solanatamagotchi.com">solanatamagotchi.com</a>
<b>Use /help</b> for bot commands

💰 <b>Earn TAMA Tokens:</b>
<b>1,000 TAMA</b> for each friend you refer instantly!
<b>Milestone bonuses</b> up to 100,000 TAMA!

📢 <b>Stay Updated:</b>
<b>Twitter:</b> @GotchiGame
<b>News:</b> @gotchigamechat  
<b>Bot:</b> @{BOT_USERNAME}
<b>Community:</b> This group!

📋 <b>Community Rules:</b>
✅ Share referral achievements & screenshots
✅ Ask questions & get help
✅ Discuss referral strategies & tips
❌ No spam or offensive content
❌ No fake giveaways or scams

🏅 <b>Pre-Launch Leaderboard:</b>
Use `/leaderboard` in the bot to see top referrers!

🚀 <b>Coming Soon:</b>
<b>Game Launch:</b> Coming Soon
<b>NFT Minting:</b> After game launch
<b>Full Play-to-Earn:</b> Coming soon!

---

<i>Let's build the biggest Tamagotchi community on Solana!</i> ⭐

<i>Start earning TAMA today - no wallet needed to begin!</i> 🚀"""
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Message Bot", url=f"https://t.me/{BOT_USERNAME}"),
            types.InlineKeyboardButton("🌐 Website", url="https://solanatamagotchi.com")
    )
    keyboard.row(
        types.InlineKeyboardButton("🏅 Leaderboard", callback_data="leaderboard"),
        types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats")
    )
    keyboard.row(
        types.InlineKeyboardButton("🔗 Get Referral Link", callback_data="get_referral")
    )
    
    bot.reply_to(message, text, parse_mode='HTML', reply_markup=keyboard)

@bot.message_handler(commands=['game'], func=lambda message: message.chat.type in ['group', 'supergroup'])
def send_game(message):
    text = """
🎮 *Game Coming Soon!*

🚀 *Pre-Launch Phase:*
• Game is currently in development
• Expected launch: Q4 2025
• Join waitlist to be notified when ready!

💰 *Start Earning Now:*
• Get your referral link from the bot
• Earn 1,000 TAMA for each friend
• Build your community before launch!

*Stay tuned for updates!* ⭐
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get Referral Link", url=f"https://t.me/{BOT_USERNAME}"),
            types.InlineKeyboardButton("🌐 Website", url="https://solanatamagotchi.com")
    )
    
    bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)

@bot.message_handler(commands=['mint'], func=lambda message: message.chat.type in ['group', 'supergroup'])
def send_mint(message):
    text = """
🚀 *NFT Minting Coming Soon!*

🎮 *Pre-Launch Phase:*
• NFT minting will be available after game launch
• Currently in development phase
• Join waitlist to be notified when ready!

💰 *Start Earning Now:*
• Get your referral link from the bot
• Earn 1,000 TAMA for each friend
• Build your community before launch!

*Stay tuned for updates!* ⭐
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get Referral Link", url=f"https://t.me/{BOT_USERNAME}"),
            types.InlineKeyboardButton("🌐 Website", url="https://solanatamagotchi.com")
    )
    
    bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)

@bot.message_handler(commands=['referral', 'ref'], func=lambda message: message.chat.type in ['group', 'supergroup'])
def send_group_referral_info(message):
    text = """💰 *Earn 1,000 TAMA per Friend\\!*

🔗 *How it works:*
• Message @solana\\_tamagotchi\\_v3\\_bot
• Get your personal referral link
• Share with friends
• Earn 1,000 TAMA for each friend\\!

🎁 *Bonus Rewards:*
• Milestone bonuses up to 100,000 TAMA\\!
• Daily rewards & achievements

*Start earning today\\!* 🚀"""
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get My Link", url=f"https://t.me/{BOT_USERNAME}"),
        types.InlineKeyboardButton("🏅 Leaderboard", callback_data="leaderboard")
    )
    
    bot.reply_to(message, text, parse_mode='MarkdownV2', reply_markup=keyboard)

@bot.message_handler(commands=['leaderboard'], func=lambda message: message.chat.type in ['group', 'supergroup', 'private'])
def send_leaderboard(message):
    try:
        # Get referral leaderboard - top referrers by total referrals
        referral_stats = []
        
        # Get all users with their referral counts
        users_response = supabase.table('leaderboard').select('pet_name, telegram_username, telegram_id, wallet_address').execute()
        
        for user in users_response.data:
            wallet_address = user.get('wallet_address')
            telegram_id = user.get('telegram_id')
            
            if wallet_address and telegram_id:
                # Count active referrals (with wallets)
                active_refs = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', str(telegram_id)).execute()
                active_count = active_refs.count or 0
                
                # Count pending referrals (without wallets yet)
                pending_refs = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', str(telegram_id)).eq('status', 'pending').execute()
                pending_count = pending_refs.count or 0
                
                # Only count active referrals for leaderboard (no pending)
                total_referrals = active_count
                
                if total_referrals > 0:  # Only show users with referrals
                    # Get TAMA balance
                    tama_response = supabase.table('leaderboard').select('tama').eq('telegram_id', str(telegram_id)).execute()
                    tama_balance = tama_response.data[0].get('tama', 0) if tama_response.data else 0
                    
                    referral_stats.append({
                        'name': user.get('pet_name', user.get('telegram_username', 'Anonymous')) or 'Anonymous',
                        'active': active_count,
                        'pending': pending_count,
                        'total': total_referrals,
                        'tama': tama_balance
                    })
        
        # Sort by total referrals
        referral_stats.sort(key=lambda x: x['total'], reverse=True)
        
        # Build referral leaderboard
        referral_text = ""
        if referral_stats:
            # Show more users in private chats
            max_users = 10 if message.chat.type == 'private' else 5
            for i, user in enumerate(referral_stats[:max_users], 1):
                medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
                name = user['name']
                total = user['total']
                active = user['active']
                pending = user['pending']
                tama_balance = user['tama']
                
                referral_text += f"{medal} {name} - {active} referrals ({tama_balance:,} TAMA)\n"
        else:
            referral_text = "No referrals yet!\n\n🔗 Start referring friends!"
        
        text = f"""
🏅 <b>Referral Leaderboard:</b>

<b>Top Referrers:</b>
{referral_text}

💰 <b>How to earn:</b>
• Share your referral link
• Get 1,000 TAMA per friend
• Milestone bonuses available!

📋 <b>Get your link:</b> /ref
        """
        
        # Add interactive buttons
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔗 Get My Link", callback_data="get_referral")
        )
        
    except Exception as e:
        print(f"Error getting referral leaderboard: {e}")
        text = """
🏅 <b>Referral Leaderboard:</b>

❌ <b>Error loading leaderboard</b>

Please try again later!
        """
        keyboard = None
    
    if keyboard:
        bot.reply_to(message, text, parse_mode='HTML', reply_markup=keyboard)
    else:
        bot.reply_to(message, text, parse_mode='HTML')

@bot.message_handler(commands=['top'], func=lambda message: message.chat.type in ['group', 'supergroup', 'private'])
def send_top_players(message):
    try:
        print(f"Fetching top players for chat {message.chat.id}")
        # Get top players by level and TAMA
        response = supabase.table('leaderboard').select('pet_name, telegram_username, telegram_id, level, tama').order('level', desc=True).order('tama', desc=True).limit(10).execute()
        print(f"Supabase response: {response.data}")
        
        if not response.data:
            print("No players found in leaderboard table")
            bot.reply_to(message, "🏅 No players yet! Be the first to play!\n\n🎮 Start playing: /game")
            return
        
        text = "🏅 <b>Top Players:</b>\n\n"
        
        for i, player in enumerate(response.data, 1):
            medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
            name = player.get('pet_name') or player.get('telegram_username') or f"Player #{player.get('telegram_id')}"
            level = player.get('level', 1)
            tama = player.get('tama', 0)
            
            text += f"{medal} {name} - Level {level} ({tama:,} TAMA)\n"
        
        text += "\n💰 <b>Play more to climb the leaderboard!</b>"
        
        # Add interactive buttons
        keyboard = types.InlineKeyboardMarkup()
        if message.chat.type in ['group', 'supergroup']:
            # In groups: deep link to private chat + fallback web URL
            keyboard.row(
                types.InlineKeyboardButton("📲 Open in Telegram", url=f"https://t.me/{BOT_USERNAME}?start=play")
            )
            keyboard.row(
                types.InlineKeyboardButton("🌐 Open Web", url="https://solanatamagotchi.com/tamagotchi-game.html")
            )
        else:
            # In private: WebApp + web URL
            # Play Game shown via bottom menu button; omit duplicate inline button
            keyboard.row(
                types.InlineKeyboardButton("🌐 Open Web", url="https://solanatamagotchi.com/tamagotchi-game.html")
            )
        
        bot.reply_to(message, text, parse_mode='HTML', reply_markup=keyboard)
        
    except Exception as e:
        print(f"Error getting top players: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        bot.reply_to(message, f"❌ Error loading top players: {str(e)}")

@bot.message_handler(commands=['info'], func=lambda message: message.chat.type in ['group', 'supergroup'])
def send_info(message):
    stats = get_stats()
    text = f"""
🎮 *Solana Tamagotchi Info:*

📊 *Statistics:*
• Total Players: {stats['players']}
• Total Pets: {stats['pets']}
• NFT Price: {stats['price']}

📋 *How to Play:*
• Mint NFT pet: [Mint Page]({MINT_URL})
• Play game: [Game]({GAME_URL})
• Earn TAMA tokens
• Refer friends for rewards

🤖 *Bot Commands:*
• /game - Play the game
• /mint - Mint NFT pet
• /leaderboard - Top referrers
• /top - Top players by level
• /info - This message

*For personal stats, message the bot privately!* 🚀
    """
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['price'])
def send_price(message):
    stats = get_stats()
    price_text = f"""
💰 *NFT Pet Price:*

Current: {stats['price']}

✅ 10 unique pet types
✅ Evolution system
✅ Play-to-Earn TAMA tokens
✅ Multi-level referrals

Mint now: /mint
    """
    bot.reply_to(message, price_text, parse_mode='Markdown')

@bot.message_handler(commands=['players'])
def send_players(message):
    stats = get_stats()
    bot.reply_to(message, f"👥 **Total Players:** {stats['players']}\n\n🚀 Join the community!", parse_mode='Markdown')

@bot.message_handler(commands=['pets'])
def send_pets(message):
    stats = get_stats()
    bot.reply_to(message, f"🐾 **Total Pets Created:** {stats['pets']}\n\n⭐ Mint yours: /mint", parse_mode='Markdown')

# TAMA Commands
@bot.message_handler(commands=['tama', 'balance'])
def show_tama_balance(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М ╨▒╨░╨╗╨░╨╜╤Б TAMA"""
    telegram_id = str(message.from_user.id)
    
    try:
        balance = get_tama_balance(telegram_id)
        
        text = f"""
💰 **TAMA Balance**

💰 **Your TAMA:** {format_tama_balance(balance)}

🎮 **Earn TAMA by:**
• Playing games (in main game)
• Daily rewards (/daily)
• Referring friends (/ref)
• Completing quests (/quests)

💰 **Spend TAMA on:**
• NFT minting (/mint)
• Game upgrades
• Special items
        """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['earn'])
def earn_tama_info(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М ╤Б╨┐╨╛╤Б╨╛╨▒╤Л ╨╖╨░╤А╨░╨▒╨╛╤В╨║╨░ TAMA"""
    text = """
💰 **How to Earn TAMA**

🎮 **Games & Activities:**
• /daily - Daily rewards (up to 10,000 TAMA)
• /quests - Complete quests for rewards

👥 **Referrals:**
• /ref - Get your referral code
• Invite friends to earn 1,000 TAMA each
• Earn bonuses for milestones

🏅 **Achievements:**
• Level up your pet
• Complete challenges
• Unlock special rewards

💰 **Pro tip:** Check /tama to see your current balance!
    """
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['spend'])
def spend_tama_info(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М ╤Б╨┐╨╛╤Б╨╛╨▒╤Л ╤В╤А╨░╤В╤Л TAMA"""
    text = """
💰 **How to Spend TAMA**

🎨 **NFT Minting:**
• /mint - Create unique NFTs
• Cost: 1,000+ TAMA per NFT
• Rare NFTs cost more TAMA

🎮 **Game Upgrades:**
• Pet customization
• Special abilities
• Premium features

🎁 **Special Items:**
• Exclusive accessories
• Limited edition items
• Power-ups and boosts

💰 **Check /tama to see your balance!**
    """
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['tama_leaderboard'])
def show_tama_leaderboard(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М ╨╗╨╕╨┤╨╡╤А╨▒╨╛╤А╨┤ ╨┐╨╛ TAMA"""
    try:
        response = supabase.table('leaderboard').select('telegram_id, telegram_username, tama').order('tama', desc=True).limit(10).execute()
        
        if response.data:
            text = "🏅 **TAMA Leaderboard**\n\n"
            
            for i, player in enumerate(response.data, 1):
                username = player.get('telegram_username', 'Unknown')
                tama_balance = player.get('tama', 0)
                
                if i == 1:
                    text += f"🥇 **#{i}** @{username} - {format_tama_balance(tama_balance)}\n"
                elif i == 2:
                    text += f"🥈 **#{i}** @{username} - {format_tama_balance(tama_balance)}\n"
                elif i == 3:
                    text += f"🥉 **#{i}** @{username} - {format_tama_balance(tama_balance)}\n"
                else:
                    text += f"**#{i}** @{username} - {format_tama_balance(tama_balance)}\n"
            
            text += "\n💰 **Earn more TAMA with /earn!**"
        else:
            text = "❌ **No players found**\n\n💰 **Be the first to earn TAMA!**"
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['tama_test'])
def test_tama_api(message):
    """╨в╨╡╤Б╤В╨╕╤А╨╛╨▓╨░╤В╤М TAMA API (╤В╨╛╨╗╤М╨║╨╛ ╨┤╨╗╤П ╨░╨┤╨╝╨╕╨╜╨╛╨▓)"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        response = requests.get(f"{TAMA_API_BASE}/test")
        result = response.json()
        
        if result.get("success"):
            text = f"""
✅ **TAMA API Test Successful**

🔗 **Status:** Connected
📊 **Response:** {result.get('message', 'OK')}

💰 **API is working correctly!**
            """
        else:
            text = f"""
❌ **TAMA API Test Failed**

🔗 **Status:** Disconnected
❌ **Error:** {result.get('error', 'Unknown error')}

💰 **Check API server status**
            """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Test error: {str(e)}")

# NFT Commands
@bot.message_handler(commands=['mint', 'nft'])
def mint_nft_command(message):
    """╨Ь╨╕╨╜╤В NFT ╨╖╨░ TAMA"""
    telegram_id = str(message.from_user.id)
    
    try:
        # ╨Я╨╛╨╗╤Г╤З╨░╨╡╨╝ ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М NFT
        costs = get_nft_costs()
        if not costs:
            bot.reply_to(message, "❌ ╨Э╨╡ ╤Г╨┤╨░╨╗╨╛╤Б╤М ╨┐╨╛╨╗╤Г╤З╨╕╤В╤М ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М NFT")
            return
        
        # ╨б╨╛╨╖╨┤╨░╨╡╨╝ ╨║╨╗╨░╨▓╨╕╨░╤В╤Г╤А╤Г ╤Б ╨▓╤Л╨▒╨╛╤А╨╛╨╝ ╤А╨╡╨┤╨║╨╛╤Б╤В╨╕
        markup = types.InlineKeyboardMarkup()
        for rarity, cost in costs.items():
            rarity_emoji = {
                'common': 'тЪк',
                'rare': 'ЁЯФ╡', 
                'epic': 'ЁЯЯг',
                'legendary': 'ЁЯЯб'
            }.get(rarity, 'тЪк')
            
            markup.add(types.InlineKeyboardButton(
                f"{rarity_emoji} {rarity.title()} - {cost['tama']:,} TAMA",
                callback_data=f"mint_nft_{rarity}"
            ))
        
        common_cost = costs.get('common', {}).get('tama', 0)
        rare_cost = costs.get('rare', {}).get('tama', 0)
        epic_cost = costs.get('epic', {}).get('tama', 0)
        legendary_cost = costs.get('legendary', {}).get('tama', 0)
        
        text = f"""🎨 Mint NFT with TAMA

💰 Available NFTs:
• Common: {common_cost:,} TAMA
• Rare: {rare_cost:,} TAMA  
• Epic: {epic_cost:,} TAMA
• Legendary: {legendary_cost:,} TAMA

💰 Choose rarity to mint:"""
        
        bot.reply_to(message, text, reply_markup=markup)
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['my_nfts', 'nfts'])
def show_user_nfts(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М NFT ╨┐╨╛╨╗╤М╨╖╨╛╨▓╨░╤В╨╡╨╗╤П"""
    telegram_id = str(message.from_user.id)
    
    try:
        nfts = get_user_nfts(telegram_id)
        
        if not nfts:
            text = """🖼️ Your NFT Collection

🎨 No NFTs found

💰 Mint your first NFT with /mint!"""
        else:
            text = f"""🖼️ Your NFT Collection

🎨 Total NFTs: {len(nfts)}

"""
            
            for i, nft in enumerate(nfts[:10], 1):  # ╨Я╨╛╨║╨░╨╖╤Л╨▓╨░╨╡╨╝ ╨┐╨╡╤А╨▓╤Л╨╡ 10
                rarity_emoji = {
                    'common': 'тЪк',
                    'rare': 'ЁЯФ╡',
                    'epic': 'ЁЯЯг', 
                    'legendary': 'ЁЯЯб'
                }.get(nft.get('rarity', 'common'), 'тЪк')
                
                pet_type = nft.get('pet_type', 'Unknown').title()
                rarity = nft.get('rarity', 'common').title()
                created_at = nft.get('created_at', 'Unknown')[:10]
                
                cost_tama = nft.get('cost_tama', 0)
                text += f"""#{i} {rarity_emoji} {pet_type}
• Rarity: {rarity}
• Cost: {cost_tama:,} TAMA
• Created: {created_at}

"""
                
            if len(nfts) > 10:
                text += f"\n... and {len(nfts) - 10} more NFTs!"
        
        bot.reply_to(message, text)
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['nft_costs'])
def show_nft_costs(message):
    """╨Я╨╛╨║╨░╨╖╨░╤В╤М ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М NFT"""
    try:
        costs = get_nft_costs()
        if not costs:
            bot.reply_to(message, "❌ ╨Э╨╡ ╤Г╨┤╨░╨╗╨╛╤Б╤М ╨┐╨╛╨╗╤Г╤З╨╕╤В╤М ╤Б╤В╨╛╨╕╨╝╨╛╤Б╤В╤М NFT")
            return
        
        text = """💰 NFT Minting Costs

"""
        
        for rarity, cost in costs.items():
            rarity_emoji = {
                'common': 'тЪк',
                'rare': 'ЁЯФ╡',
                'epic': 'ЁЯЯг',
                'legendary': 'ЁЯЯб'
            }.get(rarity, 'тЪк')
            
            rarity_name = rarity.title()
            
            cost_tama = cost.get('tama', 0)
            cost_sol = cost.get('sol', 0)
            text += f"""{rarity_emoji} {rarity_name}
• TAMA: {cost_tama:,}
• SOL: {cost_sol}

"""
        
        text += "\n💰 Use /mint to create your NFT!"
        
        bot.reply_to(message, text)
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['stats'])
def send_user_stats(message):
    user_id = message.from_user.id
    telegram_id = str(user_id)
    
    try:
        # Get player data from Supabase
        response = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
        
        if response.data:
            player = response.data[0]
            
            # Get referral stats
            ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
            pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
            
            total_referrals = ref_response.count or 0
            pending_count = pending_response.count or 0
            # Get TAMA balance from API
            tama_balance = get_tama_balance(telegram_id)
            base_tama = player.get('tama', 0)
            total_earned = base_tama
            
            stats_text = f"""
📊 **Your Statistics:**

💰 **TAMA Balance:** {format_tama_balance(tama_balance)}
👥 **Total Referrals:** {total_referrals + pending_count}
🔗 **Referral Code:** {player.get('referral_code', 'Generate with /ref')}
🏅 **Level:** {player.get('level', 1)}
🎯 **XP:** {player.get('xp', 0):,}

💰 **Earn more TAMA with /earn!**
            """
        else:
            stats_text = """
📊 **Your Statistics:**

👥 Referrals: 0
💰 TAMA Earned: 0

Start inviting friends with /ref to earn rewards! 🚀
            """
    except Exception as e:
        print(f"Error getting stats: {e}")
        stats_text = """
📊 **Your Statistics:**

👥 Referrals: 0
💰 TAMA Earned: 0

Start inviting friends with /ref to earn rewards! 🚀
        """
    
    bot.reply_to(message, stats_text, parse_mode='Markdown')

# ADMIN COMMANDS
@bot.message_handler(commands=['mute'])
def mute_user(message):
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        args = message.text.split()
        
        if message.reply_to_message:
            # Mute by reply
            user_id = message.reply_to_message.from_user.id
            username = message.reply_to_message.from_user.first_name
            duration = int(args[1]) if len(args) > 1 else 60
        else:
            # Mute by username
            if len(args) < 2:
                bot.reply_to(message, "❌ Usage: /mute [username] [minutes] or reply to message")
                return
            
            username = args[1].replace('@', '')
            duration = int(args[2]) if len(args) > 2 else 60
            
            # Find user by username (this is simplified - in real implementation you'd need to store usernames)
            bot.reply_to(message, f"❌ Please reply to user's message to mute them")
            return
        
        chat_id = message.chat.id
        key = f"{chat_id}_{user_id}"
        
        muted_users[key] = time.time() + (duration * 60)
        
        bot.reply_to(message, f"✅ {username} muted for {duration} minutes")
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['unmute'])
def unmute_user(message):
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not message.reply_to_message:
        bot.reply_to(message, "❌ Reply to a message to unmute user")
        return
    
    user_id = message.reply_to_message.from_user.id
    chat_id = message.chat.id
    key = f"{chat_id}_{user_id}"
    
    if key in muted_users:
        del muted_users[key]
        bot.reply_to(message, "✅ User unmuted")
    else:
        bot.reply_to(message, "❌ User is not muted")

@bot.message_handler(commands=['ban'])
def ban_user(message):
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not message.reply_to_message:
        bot.reply_to(message, "❌ Reply to a message to ban user")
        return
    
    try:
        user_id = message.reply_to_message.from_user.id
        chat_id = message.chat.id
        
        bot.ban_chat_member(chat_id, user_id)
        bot.reply_to(message, "✅ User banned")
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['kick'])
def kick_user(message):
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    if not message.reply_to_message:
        bot.reply_to(message, "❌ Reply to a message to kick user")
        return
    
    try:
        user_id = message.reply_to_message.from_user.id
        chat_id = message.chat.id
        
        bot.ban_chat_member(chat_id, user_id)
        bot.unban_chat_member(chat_id, user_id)
        bot.reply_to(message, "✅ User kicked")
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['delete_user', 'deluser'])
def delete_user_for_testing(message):
    """Delete user and all their referrals for testing purposes - Admin only"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        # Parse command: /delete_user TELEGRAM_ID or reply to message
        if message.reply_to_message:
            user_id = str(message.reply_to_message.from_user.id)
        else:
            parts = message.text.split()
            if len(parts) < 2:
                bot.reply_to(message, "❌ Usage: /delete_user TELEGRAM_ID\nOr reply to a user's message")
                return
            user_id = parts[1]
        
        telegram_id = str(user_id)
        
        # Get user info before deletion
        user_data = supabase.table('leaderboard').select('telegram_username, tama, referral_code').eq('telegram_id', telegram_id).execute()
        username = user_data.data[0].get('telegram_username', 'Unknown') if user_data.data else 'Unknown'
        tama_balance = user_data.data[0].get('tama', 0) if user_data.data else 0
        
        # Count referrals before deletion
        referrals_count = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        total_referrals = referrals_count.count or 0
        
        # Count referred users (users who were referred by this user)
        referred_count = supabase.table('referrals').select('*', count='exact').eq('referred_telegram_id', telegram_id).execute()
        total_referred = referred_count.count or 0
        
        # Delete all referrals where this user is the referrer
        supabase.table('referrals').delete().eq('referrer_telegram_id', telegram_id).execute()
        
        # Delete all referrals where this user was referred
        supabase.table('referrals').delete().eq('referred_telegram_id', telegram_id).execute()
        
        # Delete pending referrals
        supabase.table('pending_referrals').delete().eq('referrer_telegram_id', telegram_id).execute()
        supabase.table('pending_referrals').delete().eq('referred_telegram_id', telegram_id).execute()
        
        # Delete user from leaderboard
        supabase.table('leaderboard').delete().eq('telegram_id', telegram_id).execute()
        
        # Delete from other tables if they exist
        try:
            supabase.table('user_nfts').delete().eq('telegram_id', telegram_id).execute()
        except:
            pass
        
        try:
            supabase.table('tama_economy').delete().eq('telegram_id', telegram_id).execute()
        except:
            pass
        
        result_text = f"""✅ **User Deleted for Testing**

👤 **User Info:**
• ID: `{telegram_id}`
• Username: @{username}
• Balance: {tama_balance:,} TAMA (deleted)

📊 **Deleted Data:**
• Referrals made: {total_referrals}
• Was referred by: {total_referred}
• All referral records deleted
• Leaderboard entry deleted

🔄 **Now you can:**
• Invite this user again as a new referral
• Test the referral system from scratch
• User will be treated as completely new

⚠️ **Note:** This is for testing only!"""
        
        bot.reply_to(message, result_text, parse_mode='Markdown')
        
        # Log the deletion
        print(f"🗑️ Admin {message.from_user.id} deleted user {telegram_id} for testing")
        
    except Exception as e:
        error_msg = str(e)
        bot.reply_to(message, f"❌ Error deleting user: {error_msg}")
        print(f"❌ Error in delete_user: {error_msg}")

@bot.message_handler(commands=['broadcast'])
def broadcast_message(message):
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        text = message.text.replace('/broadcast ', '', 1)
        
        # Send to channel
        bot.send_message(CHANNEL_USERNAME, f"📢 **Announcement:**\n\n{text}", parse_mode='Markdown')
        
        bot.reply_to(message, "✅ Message sent to channel!")
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['testpost'])
def test_post(message):
    """Test auto-posting system - Admin only"""
    if message.from_user.id not in ADMIN_IDS:
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        from auto_posting import AutoPoster
        poster = AutoPoster(bot, CHANNEL_USERNAME)
        poster.post_monday_gm()
        bot.reply_to(message, "✅ Test post sent to channel!")
    except Exception as e:
        bot.reply_to(message, f"❌ Error sending test post: {str(e)}")

@bot.message_handler(commands=['tournament'])
def start_tournament(message):
    """Start weekly tournament - Admin only"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        tournament_text = """🏅 WEEKLY TOURNAMENT: Top 10 Tamagotchi Masters!

🎮 Tournament Rules:
• Compete for the highest TAMA score
• Tournament runs for 7 days
• Top 10 players win prizes!

🏅 PRIZES:
🥇 1st place: 10,000 TAMA + Legendary Pet
🥈 2nd place: 5,000 TAMA + Epic Pet  
🥉 3rd place: 3,000 TAMA + Rare Pet
4-10 places: 1,000 TAMA each

⏰ Tournament ends in 7 days!
📋 Start playing now: @{BOT_USERNAME}

#Tournament #GameFi #Solana"""
        
        # Send to group and channel
        try:
            bot.send_message(GROUP_ID, tournament_text)
            bot.send_message(message.chat.id, "✅ Tournament announced in group!")
        except Exception as group_error:
            bot.send_message(message.chat.id, f"❌ Group error: {str(group_error)}")
        
        try:
            bot.send_message(CHANNEL_USERNAME, tournament_text)
            bot.send_message(message.chat.id, "✅ Tournament announced in channel!")
        except Exception as channel_error:
            bot.send_message(message.chat.id, f"❌ Channel error: {str(channel_error)}")
            
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['testpost'])
def test_promo_post(message):
    """Test the daily promo post - Admin only"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        # Get the promo post
        promo_posts = [
            # Post 1: General intro (Day 1, 5, 9...)
            f"""🐾 SOLANA TAMAGOTCHI - YOUR VIRTUAL PET! 🐾

🎮 What is it?
• Virtual pet in Telegram
• Earn TAMA tokens
• Play games and adventures (in main game)
• Evolution and customization

💰 Earning:
• Clicks = TAMA tokens
• Playing games = bonuses (in main game)
• Referrals = 1,000 TAMA per friend!
• Daily rewards

🏅 Features:
• 5 pet types
• 5 games (in main game)
• Achievement system
• Leaderboard

🚀 START PLAYING RIGHT NOW!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Solana #GameFi #Tamagotchi #Crypto #PlayToEarn""",

            # Post 2: Focus on earning (Day 2, 6, 10...)
            f"""💰 EARN TAMA TOKENS WHILE PLAYING! 💰

📋 How to Earn:
• Click your pet = Instant TAMA!
• Play games in main game = Up to 500 TAMA!
• Daily rewards = Streak bonuses!
• Refer friends = 1,000 TAMA per friend!
• Complete quests = Extra bonuses!

📊 Referral Program:
• 1,000 TAMA for each friend instantly!
• Milestone bonuses up to 500,000 TAMA!

🎮 5 Games Available (in main game):
• Guess Number • Trivia Quiz
• Fortune Wheel • And more!

💰 Start earning NOW - no wallet needed!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#PlayToEarn #CryptoGame #TAMA #Solana""",

            # Post 3: Focus on referrals (Day 3, 7, 11...)
            f"""🔗 INVITE FRIENDS = EARN BIG! 🔗

🎁 Referral Rewards:
• 1,000 TAMA for each friend
• Unlimited earning potential!

🏅 Milestone Bonuses:
• 1 ref = +500 TAMA | 3 refs = +750 TAMA
• 5 refs = +1,000 TAMA | 10 refs = +3,000 TAMA
• 15 refs = +5,000 TAMA | 25 refs = +10,000 TAMA
• 50 refs = +30,000 TAMA | 75 refs = +50,000 TAMA
• 100 refs = +100,000 TAMA | 150 refs = +150,000 TAMA
• 250 refs = +250,000 TAMA (Master!) | 500 refs = +500,000 TAMA (Legend!)

💰 Why Friends Love It:
✅ Free to start - no investment
✅ Fun pet game in Telegram
✅ Real earning opportunities
✅ Daily rewards & games (in main game)

🎯 Top referrers earning 100,000+ TAMA!

🚀 Get your referral link now:
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Referral #Crypto #PassiveIncome #Solana""",

            # Post 4: Focus on gameplay (Day 4, 8, 12...)
            f"""🎮 CHILDHOOD MEMORIES + CRYPTO = FUN! 🎮

🐾 Remember Tamagotchi? Now with earnings!

⭐ Game Features:
• 5 Unique Pets - Cat, Dog, Dragon, Phoenix, Unicorn
• Pet Evolution - 10 stages from Baby to Legendary
• Vector Graphics - Beautiful animations
• Combo System - Click fast for bonuses!
• Emotions - Happy, Sad, Hungry, Angry, Surprised

📋 Games (in main game):
• 🎯 Guess Number
• ❓ Solana Quiz
• 🎰 Fortune Wheel
• 🏁 Pet Race
• 📋 Darts

🏅 Progression:
• Level up your pet
• Unlock achievements
• Climb the leaderboard
• Earn badges & ranks

💰 Everything earns you TAMA tokens!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Gaming #NFT #Tamagotchi #Blockchain #Fun"""
        ]
        
        day_of_year = datetime.now().timetuple().tm_yday
        post_index = day_of_year % len(promo_posts)
        promo_text = promo_posts[post_index]
        
        # Send to YOU first to preview (without Markdown to avoid parsing errors)
        bot.send_message(message.chat.id, promo_text)
        bot.reply_to(message, f"ЁЯУЭ This is promo post #{post_index + 1} (today's post)\n\n✅ Copy and paste it to your group manually!")
        
        # Also try to send to group and channel
        results = []
        
        # Send to group
        try:
            bot.send_message(GROUP_ID, promo_text)
            results.append("✅ Sent to group @gotchigamechat")
        except Exception as group_error:
            results.append(f"❌ Group error: {str(group_error)}")
        
        # Send to channel
        try:
            bot.send_message(CHANNEL_USERNAME, promo_text)
            results.append("✅ Sent to channel @GotchiGame")
        except Exception as channel_error:
            results.append(f"❌ Channel error: {str(channel_error)}")
        
        # Show results
        bot.send_message(message.chat.id, "\n".join(results))
            
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['monitor'], func=lambda message: message.chat.type == 'private')
def show_monitoring_stats(message):
    """Show monitoring statistics for admin"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        current_minute = int(time.time() // 60)
        requests_this_minute = monitoring_stats['requests_per_minute'][current_minute]
        
        stats_text = f"""
📊 **MONITORING STATISTICS**

⚠️ **Security:**
• Suspicious Activities: {monitoring_stats['suspicious_activities']}
• Errors Count: {monitoring_stats['errors_count']}
• Requests This Minute: {requests_this_minute}

🎯 **Activity:**
• Referrals Today: {monitoring_stats['referrals_today']}

ЁЯХР **Last Updated:** {datetime.now().strftime("%H:%M:%S")}

💰 **Alerts:** Active monitoring enabled
        """
        
        bot.reply_to(message, stats_text, parse_mode='Markdown')
        
    except Exception as e:
        log_error("monitoring_error", str(e), message.from_user.id)
        bot.reply_to(message, f"❌ Error getting stats: {str(e)}")

# ==================== GAMIFICATION COMMANDS ====================

@bot.message_handler(commands=['daily'], func=lambda message: message.chat.type == 'private')
def claim_daily_reward(message):
    """Claim daily reward"""
    telegram_id = str(message.from_user.id)
    
    try:
        success, streak_days, reward_amount = daily_rewards.claim_reward(telegram_id)
        
        if success:
            # 💰 TAMA balance is already updated in claim_reward() function
            # No need to call add_tama_reward() separately - it's handled in gamification.py
            
            # Check for streak milestones
            milestone_text = ""
            if streak_days == 7:
                milestone_text = "\n\n🎉 **WEEK MILESTONE!** 7 days in a row!"
            elif streak_days == 14:
                milestone_text = "\n\n🔥 **2 WEEKS!** Incredible streak!"
            elif streak_days == 30:
                milestone_text = "\n\n👑 **MONTH!** You're a legend!"
            
            text = f"""
✅ **Daily Reward Claimed!**

💰 **Reward:** +{reward_amount:,} TAMA
🔥 **Streak:** {streak_days} days in a row
📅 **Next:** in 24 hours{milestone_text}

💰 **╨Т╨╛╨╖╨▓╤А╨░╤Й╨░╨╣╤Б╤П ╨║╨░╨╢╨┤╤Л╨╣ ╨┤╨╡╨╜╤М ╨┤╨╗╤П ╨▒╨╛╨╗╤М╤И╨╕╤Е ╨╜╨░╨│╤А╨░╨┤!**
            """
            
            # Award streak badges
            if streak_days == 7:
                badge_system.award_badge(telegram_id, 'week_warrior')
            elif streak_days == 30:
                badge_system.award_badge(telegram_id, 'streak_master')
        else:
            # Calculate time until next claim
            can_claim, current_streak = daily_rewards.can_claim(telegram_id)
            text = f"""
⏰ **Already Claimed Today!**

🔥 **Current Streak:** {current_streak} days
📅 **Come back tomorrow** for next reward!

💰 **Don't miss a day to keep your streak!**
            """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error claiming daily reward: {e}")
        bot.reply_to(message, "❌ ╨Ю╤И╨╕╨▒╨║╨░ ╨┐╤А╨╕ ╨┐╨╛╨╗╤Г╤З╨╡╨╜╨╕╨╕ ╨╜╨░╨│╤А╨░╨┤╤Л. ╨Я╨╛╨┐╤А╨╛╨▒╤Г╨╣ ╨┐╨╛╨╖╨╢╨╡.")

# Mini-games removed - available in main game only
# @bot.message_handler(commands=['games'], func=lambda message: message.chat.type == 'private')
# def show_games_menu(message):
#     """Show mini-games menu"""
#     telegram_id = str(message.from_user.id)
#     
#     try:
#         can_play, games_played = mini_games.can_play(telegram_id)
#         games_left = 3 - games_played
#         
#         text = f"""
# 🎮 **╨Ь╨╕╨╜╨╕-╨Ш╨│╤А╤Л**
# 
# 💰 **╨Ш╨│╤А╨░╨╣ ╨╕ ╨╖╨░╤А╨░╨▒╨░╤В╤Л╨▓╨░╨╣ TAMA!**
# 
# 📋 **╨Ф╨╛╤Б╤В╤Г╨┐╨╜╤Л╨╡ ╨╕╨│╤А╤Л:**
# • ╨г╨│╨░╨┤╨░╨╣ ╨з╨╕╤Б╨╗╨╛ (1-100) - ╨┤╨╛ 500 TAMA
# • Solana ╨Т╨╕╨║╤В╨╛╤А╨╕╨╜╨░ - 100 TAMA
# • ╨Ъ╨╛╨╗╨╡╤Б╨╛ ╨д╨╛╤А╤В╤Г╨╜╤Л - ╨┤╨╛ 500 TAMA
# 
# 📊 **╨Ы╨╕╨╝╨╕╤В:** {games_left}/3 ╨╕╨│╤А ╨╛╤Б╤В╨░╨╗╨╛╤Б╤М ╤Б╨╡╨│╨╛╨┤╨╜╤П
# 
# 💰 **╨Т╤Л╨▒╨╡╤А╨╕ ╨╕╨│╤А╤Г:**
#         """
#         
#         keyboard = types.InlineKeyboardMarkup()
#         if can_play:
#             keyboard.row(
#                 types.InlineKeyboardButton("📋 ╨г╨│╨░╨┤╨░╨╣ ╨з╨╕╤Б╨╗╨╛", callback_data="game_guess"),
#                 types.InlineKeyboardButton("❓ ╨Т╨╕╨║╤В╨╛╤А╨╕╨╜╨░", callback_data="game_trivia")
#             )
#             keyboard.row(
#                 types.InlineKeyboardButton("🎰 ╨Ъ╨╛╨╗╨╡╤Б╨╛ ╨д╨╛╤А╤В╤Г╨╜╤Л", callback_data="game_wheel")
#             )
#         keyboard.row(
#             types.InlineKeyboardButton("🔙 ╨Э╨░╨╖╨░╨┤", callback_data="back_to_menu")
#         )
#         
#         bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
#         
#     except Exception as e:
#         print(f"Error showing games: {e}")
#         bot.reply_to(message, "❌ ╨Ю╤И╨╕╨▒╨║╨░ ╨╖╨░╨│╤А╤Г╨╖╨║╨╕ ╨╕╨│╤А")

@bot.message_handler(commands=['badges'], func=lambda message: message.chat.type == 'private')
def show_user_badges(message):
    """Show user badges"""
    telegram_id = str(message.from_user.id)
    
    try:
        user_badges = badge_system.get_user_badges(telegram_id)
        
        if user_badges:
            badges_text = "\n".join([f"{b['name']} - {b['desc']}" for b in user_badges])
        else:
            badges_text = "No badges yet. Play and invite friends!"
        
        text = f"""
🏆 **Your Badges**

{badges_text}

💰 **How to earn more:**
• ЁЯРж Early Bird - Be in first 100 users
• 🔥 Streak Master - 30 days streak
• 👑 Referral King - 50+ referrals
• 💰 Generous - 100+ referrals
• 🎮 Gamer - 100 mini-games
• 🍀 Lucky - Wheel jackpot
        """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error showing badges: {e}")
        bot.reply_to(message, "❌ Error loading badges")

@bot.message_handler(commands=['rank'], func=lambda message: message.chat.type == 'private')
def show_user_rank(message):
    """Show user rank"""
    telegram_id = str(message.from_user.id)
    
    try:
        # Get referral count
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        
        # Update and get rank
        rank_changed, rank_id, rank_data = rank_system.update_rank(telegram_id, total_refs)
        
        # Get next rank
        next_rank = None
        for r_id, r_data in RANKS.items():
            if r_data['min_refs'] > total_refs:
                next_rank = (r_id, r_data)
                break
        
        # Progress bar with proper emoji
        filled = "▓" * (total_refs % 5)
        empty = "░" * (5 - (total_refs % 5))
        progress_bar = filled + empty
        
        text = f"""
{rank_data['emoji']} **Your Rank: {rank_data['name']}**

📊 **Stats:**
• Referrals: {total_refs}
• Progress: {progress_bar}
        """
        
        if next_rank:
            refs_needed = next_rank[1]['min_refs'] - total_refs
            text += f"""

📋 **Next rank:** {next_rank[1]['name']}
🎯 **Needed:** {refs_needed} referrals
        """
        else:
            text += "\n\n🏆 **Maximum rank achieved!**"
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error showing rank: {e}")
        bot.reply_to(message, "❌ Error loading rank")

@bot.message_handler(commands=['quests'], func=lambda message: message.chat.type == 'private')
def show_quests(message):
    """Show quests"""
    telegram_id = str(message.from_user.id)
    
    try:
        # Get referral count
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        
        # Check quests
        completed_quests = quest_system.check_quests(telegram_id, total_refs)
        
        text = "📋 **Referral Quests**\n\n"
        
        for quest_id, quest_data in QUESTS.items():
            progress = min(total_refs, quest_data['target'])
            percentage = int((progress / quest_data['target']) * 100)
            
            if total_refs >= quest_data['target']:
                status = "✅"
            else:
                status = f"{progress}/{quest_data['target']}"
            
            text += f"{status} **{quest_data['name']}**\n"
            text += f"   {quest_data['desc']}\n"
            text += f"   Reward: {quest_data['reward']:,} TAMA\n\n"
        
        text += "💰 **Invite friends to complete quests!**"
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error showing quests: {e}")
        bot.reply_to(message, "❌ Error loading quests")

# Welcome new members
@bot.message_handler(content_types=['new_chat_members'])
def welcome_new_member(message):
    """Welcome new members to the group"""
    try:
        # Skip if it's not a group/supergroup
        if message.chat.type not in ['group', 'supergroup']:
            return
        
        # Log group info for debugging
        print(f"📥 New member(s) joined group: {message.chat.id} ({message.chat.title})")
        
        # Skip if bot itself joined
        for new_member in message.new_chat_members:
            if new_member.id == bot.get_me().id:
                print(f"✅ Bot joined group {message.chat.id}")
                continue
            
            # Get user's first name (escape for HTML)
            first_name = new_member.first_name or "Friend"
            username = f"@{new_member.username}" if new_member.username else first_name
            
            welcome_text = f"""🎉 <b>Welcome to Solana Tamagotchi Community, {first_name}!</b> 👋

🐾 <b>What is Solana Tamagotchi?</b>
A <b>Play-to-Earn NFT pet game</b> on Solana blockchain where you can:
• 🎮 Care for virtual pets and earn real TAMA tokens
• 🎨 Mint unique NFT pets (5 tiers: Bronze → Diamond)
• 💰 Get 2x to 5x earning multipliers with NFTs
• 🎁 Earn 1,000 TAMA per friend you invite
• 🆓 <b>100% Free to Play</b> - No investment needed!

🚀 <b>Quick Start (3 steps):</b>
1️⃣ Open <b>@{BOT_USERNAME}</b> and send <b>/start</b>
2️⃣ Start playing and earn TAMA tokens
3️⃣ Mint NFT pets to boost earnings (2-5x!)

💰 <b>How to Earn TAMA:</b>
• Daily Login: +25 TAMA
• Feed/Play/Train: +5-15 TAMA each
• Level Up: +50 TAMA bonus
• Referrals: +1,000 TAMA per friend
• NFT Boost: 2x-5x multiplier!

🎨 <b>NFT Tiers:</b>
🥉 Bronze: 5,000 TAMA → 2.0x boost
🥈 Silver: 1 SOL → 2.3x boost
🥇 Gold: 3 SOL → 2.7x boost
💎 Platinum: 10 SOL → 3.5x boost
🔷 Diamond: 50 SOL → 5.0x boost

📢 <b>Links:</b>
🌐 <a href="https://solanatamagotchi.com">Website</a> | 🐦 <a href="https://twitter.com/GotchiGame">Twitter</a> | 🤖 <a href="https://t.me/{BOT_USERNAME}">Bot</a>

💡 <b>Pro Tip:</b> Play daily and invite friends to maximize earnings!

<i>Let's build the biggest Tamagotchi community on Solana! ⭐</i>"""
            
            # Create welcome keyboard
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🎮 Play Game", url=f"https://t.me/{BOT_USERNAME}?start=play"),
                types.InlineKeyboardButton("💎 Mint NFT", url="https://solanatamagotchi.com/mint.html")
            )
            keyboard.row(
                types.InlineKeyboardButton("🌐 Website", url="https://solanatamagotchi.com"),
                types.InlineKeyboardButton("📚 Blog", url="https://solanatamagotchi.com/blog/")
            )
            keyboard.row(
                types.InlineKeyboardButton("🤖 Message Bot", url=f"https://t.me/{BOT_USERNAME}")
            )
            
            # Send welcome message
            try:
                sent_message = bot.send_message(
                    message.chat.id, 
                    welcome_text, 
                    parse_mode='HTML', 
                    reply_markup=keyboard,
                    disable_web_page_preview=False
                )
                print(f"✅ Welcomed new member: {first_name} ({new_member.id}) in group {message.chat.id}")
            except Exception as send_error:
                error_msg = str(send_error)
                if "not enough rights" in error_msg.lower() or "chat not found" in error_msg.lower():
                    print(f"⚠️ Bot doesn't have permission to send messages in group {message.chat.id}")
                    print(f"   Error: {error_msg}")
                    print(f"   Please make bot an admin with 'Send Messages' permission")
                else:
                    print(f"❌ Failed to send welcome message: {error_msg}")
                raise  # Re-raise to be caught by outer exception handler
            
    except Exception as e:
        print(f"❌ Error welcoming new member: {e}")
        logging.error(f"Error in welcome_new_member: {e}", exc_info=True)

# Daily stats post
def post_daily_stats():
    try:
        stats = get_stats()
        stats_text = f"""📊 **Daily Statistics**

👥 Total Players: {stats['players']}
🐾 Total Pets: {stats['pets']}
💰 NFT Price: {stats['price']}

🎮 Play: Coming Soon!
⭐ Mint: Coming Soon!

🚀 Join the community!"""
        
        # Post to group instead of channel
        bot.send_message(GROUP_ID, stats_text, parse_mode='Markdown')
    except Exception as e:
        print(f"Error posting daily stats: {e}")

# Daily promo post with rotation
def post_daily_promo():
    try:
        # Different promo posts
        promo_posts = [
            # Post 1: General intro (Day 1, 5, 9...)
            f"""🐾 SOLANA TAMAGOTCHI - YOUR VIRTUAL PET! 🐾

🎮 What is it?
• Virtual pet in Telegram
• Earn TAMA tokens
• Play games and adventures (in main game)
• Evolution and customization

💰 Earning:
• Clicks = TAMA tokens
• Playing games = bonuses (in main game)
• Referrals = 1,000 TAMA per friend!
• Daily rewards

🏅 Features:
• 5 pet types
• 5 games (in main game)
• Achievement system
• Leaderboard

🚀 START PLAYING RIGHT NOW!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Solana #GameFi #Tamagotchi #Crypto #PlayToEarn""",

            # Post 2: Focus on earning (Day 2, 6, 10...)
            f"""💰 EARN TAMA TOKENS WHILE PLAYING! 💰

📋 How to Earn:
• Click your pet = Instant TAMA!
• Play games in main game = Up to 500 TAMA!
• Daily rewards = Streak bonuses!
• Refer friends = 1,000 TAMA per friend!
• Complete quests = Extra bonuses!

📊 Referral Program:
• 1,000 TAMA for each friend instantly!
• Milestone bonuses up to 500,000 TAMA!

🎮 5 Games Available (in main game):
• Guess Number • Trivia Quiz
• Fortune Wheel • And more!

💰 Start earning NOW - no wallet needed!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#PlayToEarn #CryptoGame #TAMA #Solana""",

            # Post 3: Focus on referrals (Day 3, 7, 11...)
            f"""🔗 INVITE FRIENDS = EARN BIG! 🔗

🎁 Referral Rewards:
• 1,000 TAMA for each friend
• Unlimited earning potential!

🏅 Milestone Bonuses:
• 1 ref = +500 TAMA | 3 refs = +750 TAMA
• 5 refs = +1,000 TAMA | 10 refs = +3,000 TAMA
• 15 refs = +5,000 TAMA | 25 refs = +10,000 TAMA
• 50 refs = +30,000 TAMA | 75 refs = +50,000 TAMA
• 100 refs = +100,000 TAMA | 150 refs = +150,000 TAMA
• 250 refs = +250,000 TAMA (Master!) | 500 refs = +500,000 TAMA (Legend!)

💰 Why Friends Love It:
✅ Free to start - no investment
✅ Fun pet game in Telegram
✅ Real earning opportunities
✅ Daily rewards & games (in main game)

🎯 Top referrers earning 100,000+ TAMA!

🚀 Get your referral link now:
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Referral #Crypto #PassiveIncome #Solana""",

            # Post 4: Focus on gameplay (Day 4, 8, 12...)
            f"""🎮 CHILDHOOD MEMORIES + CRYPTO = FUN! 🎮

🐾 Remember Tamagotchi? Now with earnings!

⭐ Game Features:
• 5 Unique Pets - Cat, Dog, Dragon, Phoenix, Unicorn
• Pet Evolution - 10 stages from Baby to Legendary
• Vector Graphics - Beautiful animations
• Combo System - Click fast for bonuses!
• Emotions - Happy, Sad, Hungry, Angry, Surprised

📋 Games (in main game):
• 🎯 Guess Number
• ❓ Solana Quiz
• 🎰 Fortune Wheel
• 🏁 Pet Race
• 📋 Darts

🏅 Progression:
• Level up your pet
• Unlock achievements
• Climb the leaderboard
• Earn badges & ranks

💰 Everything earns you TAMA tokens!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💰 Chat: @gotchigamechat

#Gaming #NFT #Tamagotchi #Blockchain #Fun"""
        ]
        
        # Rotate posts based on day of year
        day_of_year = datetime.now().timetuple().tm_yday
        post_index = day_of_year % len(promo_posts)
        promo_text = promo_posts[post_index]
        
        # Post to group (without Markdown to avoid parsing errors)
        try:
            bot.send_message(GROUP_ID, promo_text)
            print(f"✅ Daily promo post #{post_index + 1} sent to group @gotchigamechat")
        except Exception as group_error:
            print(f"❌ Error posting to group: {group_error}")
        
        # Also post to channel
        try:
            bot.send_message(CHANNEL_USERNAME, promo_text)
            print(f"✅ Daily promo post #{post_index + 1} sent to channel @GotchiGame")
        except Exception as channel_error:
            print(f"❌ Error posting to channel: {channel_error}")
            
    except Exception as e:
        print(f"Error in daily promo: {e}")

# Schedule daily posts
def run_schedule():
    # Legacy daily posts (keep for compatibility)
    schedule.every().day.at("12:00").do(post_daily_stats)
    schedule.every().day.at("14:00").do(post_daily_promo)  # Promo post at 2 PM
    
    # Setup auto-posting system based on CONTENT_PLAN.md
    print("📅 Setting up auto-posting schedule...")
    setup_auto_posting(bot, CHANNEL_USERNAME)
    print("✅ Telegram auto-posting configured!")
    
    # Setup Twitter auto-posting (if enabled)
    if TWITTER_ENABLED:
        print("🐦 Setting up Twitter auto-posting...")
        twitter_poster = setup_twitter_posting()
        if twitter_poster:
            print("✅ Twitter auto-posting configured!")
        else:
            print("⚠️ Twitter auto-posting disabled (no API credentials)")
    
    print("✅ All auto-posting systems ready!")
    
    while True:
        schedule.run_pending()
        time.sleep(60)

# Handle Mini App data
@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    """Handle data from Telegram Mini App"""
    try:
        data = json.loads(message.web_app_data.data)
        telegram_id = str(message.from_user.id)
        
        print(f"📱 Received Mini App data from {telegram_id}: {data}")
        
        if data.get('action') == 'save_game_state' or data.get('action') == 'auto_save':
            # Save game state to database
            game_data = data.get('data', {})
            
            # Get current stats from leaderboard
            leaderboard = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
            
            if leaderboard.data:
                # User exists - update TAMA
                current_tama = leaderboard.data[0].get('tama', 0) or 0
                game_tama = game_data.get('tama', 0) or 0
                
                # 🛡️ PROTECTION: Never decrease balance from game saves!
                # Only update if game_tama is greater than current (earned in game)
                # If current_tama is greater (from daily rewards, referrals, etc.), keep it!
                if game_tama > current_tama:
                    # Game earned more TAMA - update balance
                    tama_earned = game_tama - current_tama
                    
                    supabase.table('leaderboard').update({
                        'tama': game_tama,
                        'level': game_data.get('level', 1)
                    }).eq('telegram_id', telegram_id).execute()
                    
                    print(f"💰 Game save: Updated TAMA from {current_tama} to {game_tama} (+{tama_earned})")
                    
                    # Only show message for manual save (not auto-save)
                    if data.get('action') == 'save_game_state':
                        bot.reply_to(message, f"✅ Game saved!\n💰 Total TAMA: {game_tama:,}\n🎖️ Level: {game_data.get('level', 1)}\n🎮 Total Clicks: {game_data.get('totalClicks', 0)}")
                else:
                    # Current balance is higher (from daily rewards, referrals, etc.)
                    # Keep current balance, only update level and other game data
                    update_data = {
                        'level': game_data.get('level', 1)
                    }
                    
                    # Only update TAMA if game has more (shouldn't happen, but safety check)
                    if game_tama > current_tama:
                        update_data['tama'] = game_tama
                    
                    supabase.table('leaderboard').update(update_data).eq('telegram_id', telegram_id).execute()
                    
                    print(f"💰 Game save: Kept current TAMA {current_tama} (game had {game_tama}) - protected from decrease!")
                    
                    if data.get('action') == 'save_game_state':
                        bot.reply_to(message, f"✅ Progress saved!\n💰 TAMA: {current_tama:,}\n🎖️ Level: {game_data.get('level', 1)}")
            else:
                # Create new user entry
                supabase.table('leaderboard').insert({
                    'telegram_id': telegram_id,
                    'wallet_address': f'telegram_{telegram_id}',
                    'tama': game_data.get('tama', 0),
                    'level': game_data.get('level', 1),
                    'referral_code': None
                }).execute()
                
                if data.get('action') == 'save_game_state':
                    bot.reply_to(message, f"🎉 First save!\n💰 TAMA: {game_data.get('tama', 0):,}\n🎖️ Level: {game_data.get('level', 1)}")
        
        elif data.get('action') == 'level_up':
            level = data.get('level', 1)
            bot.reply_to(message, f"🎉 Congratulations! Your pet reached level {level}!")
            
            # Award bonus TAMA for level up
            bonus_tama = level * 10
            leaderboard = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
            current_tama = leaderboard.data[0].get('tama', 0) if leaderboard.data else 0
            
            supabase.table('leaderboard').update({
                'tama': current_tama + bonus_tama
            }).eq('telegram_id', telegram_id).execute()
            
            bot.send_message(message.chat.id, f"🎁 Level up bonus: +{bonus_tama} TAMA!")
        
        else:
            bot.reply_to(message, "🎮 Game data received! Keep playing to earn more TAMA!")
            
    except Exception as e:
        print(f"❌ Error handling Mini App data: {e}")
        bot.reply_to(message, "❌ Error processing game data. Please try again.")

# Handle unknown commands in private chat only
@bot.message_handler(func=lambda message: message.chat.type == 'private' and message.text and message.text.startswith('/'))
def echo_message(message):
    bot.reply_to(message, "Use /help to see available commands! 🚀")

# Callback handlers
@bot.callback_query_handler(func=lambda call: True)
def handle_callback(call):
    if call.data.startswith('mint_nft_'):
        # ╨Ю╨▒╤А╨░╨▒╨╛╤В╨║╨░ ╨╝╨╕╨╜╤В╨░ NFT
        try:
            rarity = call.data.replace('mint_nft_', '')
            telegram_id = str(call.from_user.id)
            
            # ╨Я╤А╨╛╨▓╨╡╤А╤П╨╡╨╝ ╨▒╨░╨╗╨░╨╜╤Б
            balance = get_tama_balance(telegram_id)
            costs = get_nft_costs()
            required_tama = costs.get(rarity, {}).get('tama', 0)
            
            if balance < required_tama:
                shortage = required_tama - balance
                bot.answer_callback_query(
                    call.id, 
                    f"❌ Insufficient TAMA! Need {shortage:,} more TAMA"
                )
                return
            
            # ╨Ь╨╕╨╜╤В╨╕╨╝ NFT
            success, result = mint_nft(telegram_id, "", rarity)
            
            if success:
                nft_data = result.get('nft', {})
                new_balance = result.get('new_balance', balance)
                
                # ╨Ю╨▒╨╜╨╛╨▓╨╗╤П╨╡╨╝ ╤Б╨╛╨╛╨▒╤Й╨╡╨╜╨╕╨╡
                rarity_emoji = {
                    'common': 'тЪк',
                    'rare': 'ЁЯФ╡',
                    'epic': 'ЁЯЯг',
                    'legendary': 'ЁЯЯб'
                }.get(rarity, 'тЪк')
                
                pet_name = nft_data.get('name', 'Unknown')
                pet_type = nft_data.get('pet_type', 'Unknown').title()
                rarity_title = rarity.title()
                
                cost_tama = nft_data.get('cost_tama', 0)
                updated_text = f"""🎨 NFT Minted Successfully!

{rarity_emoji} {pet_name}
• Rarity: {rarity_title}
• Type: {pet_type}
• Cost: {cost_tama:,} TAMA

💰 New Balance: {new_balance:,} TAMA

💰 Check /my_nfts to see your collection!"""
                
                safe_edit_message_text(
                    updated_text,
                    call.message.chat.id,
                    call.message.message_id,
                    disable_web_page_preview=True
                )
                
                bot.answer_callback_query(call.id, f"✅ {rarity.title()} NFT minted!")
            else:
                error_msg = result.get('error', 'Unknown error')
                bot.answer_callback_query(call.id, f"❌ Mint failed: {error_msg}")
                
        except Exception as e:
            print(f"Error handling mint NFT callback: {e}")
            bot.answer_callback_query(call.id, "❌ Error occurred")
    
    elif call.data == "get_referral":
        # Generate referral link
        user_id = call.from_user.id
        username = call.from_user.username or call.from_user.first_name
        telegram_id = str(user_id)
        
        # Generate referral code
        ref_code = generate_referral_code(telegram_id)
        short_link = f"https://solanatamagotchi.com/s.html?ref={ref_code}&v=30"
        
        # Get referral stats
        try:
            response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
            total_referrals = response.count or 0
            
            pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
            pending_count = pending_response.count or 0
            
            # Get TAMA balance
            leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
            total_earnings = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
            
        except:
            total_referrals = 0
            pending_count = 0
            total_earnings = 0
        
        text = f"""
🔗 <b>Your Referral Code:</b>

<code>{ref_code}</code>

📊 <b>Your Stats:</b>
• 👥 Total Referrals: {total_referrals + pending_count}
• 💰 Total Earned: {total_earnings:,} TAMA

💰 <b>Earn instantly (NO WALLET NEEDED!):</b>
• 1,000 TAMA for each friend instantly!
• Just share your link and earn!
• TAMA accumulates in your account

🎁 <b>Milestone Bonuses:</b>
• 1 referral → +500 TAMA
• 3 referrals → +750 TAMA
• 5 referrals → +1,000 TAMA
• 10 referrals → +3,000 TAMA
• 15 referrals → +5,000 TAMA
• 25 referrals → +10,000 TAMA
• 50 referrals → +30,000 TAMA
• 75 referrals → +50,000 TAMA
• 100 referrals → +100,000 TAMA
• 150 referrals → +150,000 TAMA
• 250 referrals → +250,000 TAMA (Master!)
• 500 referrals → +500,000 TAMA (Legend!)
• 1,000 referrals → +1,000,000 TAMA (Mythic!)

📤 <b>Share with friends and start earning!</b>
        """
        
        # Share text with link for Telegram preview (text AFTER link!)
        share_text = f"""🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!

🐾 Play-to-earn game on Solana blockchain
💰 No wallet needed to start earning!

🎁 Get 1,000 TAMA instantly when you join!
🚀 Start playing and earning now!"""
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("📤 Share Link", url=f"https://t.me/share/url?url={short_link}&text={share_text.replace(chr(10), '%0A')}")
        )
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
        )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='HTML', reply_markup=keyboard)
        except Exception as e:
            print(f"Error editing message: {e}")
            # Send new message if edit fails
            bot.send_message(call.message.chat.id, text, parse_mode='HTML', reply_markup=keyboard)
    
    elif call.data == "my_nfts":
        # Show user's NFT collection
        telegram_id = str(call.from_user.id)
        
        try:
            # Get user's NFTs from database (new structure: tier_name, rarity, earning_multiplier)
            response = supabase.table('user_nfts').select('*').eq('telegram_id', telegram_id).eq('is_active', True).order('minted_at', desc=True).execute()
            
            if response.data and len(response.data) > 0:
                nfts = response.data
                
                # Helper function for rarity emoji
                def get_rarity_emoji(rarity):
                    emoji_map = {
                        'Common': '⚪',
                        'Uncommon': '🟢',
                        'Rare': '🔵',
                        'Epic': '🟣',
                        'Legendary': '🟠'
                    }
                    return emoji_map.get(rarity, '⚪')
                
                # Helper function for tier emoji
                def get_tier_emoji(tier):
                    emoji_map = {
                        'Bronze': '🥉',
                        'Silver': '🥈',
                        'Gold': '🥇'
                    }
                    return emoji_map.get(tier, '🎨')
                
                nft_list = "\n\n".join([
                    f"{i+1}. {get_tier_emoji(nft.get('tier_name', 'Unknown'))} **{nft.get('tier_name', 'Unknown')}** {get_rarity_emoji(nft.get('rarity', 'Common'))}\n"
                    f"   • Rarity: {nft.get('rarity', 'Common')}\n"
                    f"   • Boost: {nft.get('earning_multiplier', 1.0)}x earning\n"
                    f"   • Minted: {nft.get('minted_at', 'Unknown')[:10] if nft.get('minted_at') else 'Unknown'}"
                    for i, nft in enumerate(nfts[:10])  # Show max 10
                ])
                
                # Get user's TAMA balance
                leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
                
                # Calculate total multiplier (best NFT)
                best_multiplier = max([float(nft.get('earning_multiplier', 1.0)) for nft in nfts])
                
                text = f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 Total NFTs: **{len(nfts)}**
💰 TAMA Balance: **{tama_balance:,}**
⚡ Active Boost: **{best_multiplier}x**

{nft_list}

🎮 *NFT Benefits:*
• Your best NFT gives you **{best_multiplier}x** earning boost!
• All TAMA rewards are multiplied automatically
• View full collection on website!

🌐 [View on Website]({MINT_URL}my-nfts.html?user_id={telegram_id})
                """
            else:
                # No NFTs yet
                leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
                
                text = f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 You don't have any NFTs yet!

💰 Your TAMA Balance: **{tama_balance:,}**

💰 *How to get NFTs:*

**🥉 Bronze NFT** 💰
• Cost: 2,500 TAMA or 0.05 SOL
• Boost: 2-3x earning
• Random rarity (Common to Legendary)

**🥈 Silver NFT** 💎
• Cost: 0.1 SOL (SOL only)
• Boost: 2.5-3.5x earning
• Better rarity chances!

**🥇 Gold NFT** 💎
• Cost: 0.2 SOL (SOL only)
• Boost: 3-4x earning
• Best rarity chances!

🌐 [Mint NFT Now]({MINT_URL}nft-mint-5tiers.html?user_id={telegram_id})
                """
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🎨 Mint NFT", callback_data="mint_nft")
            )
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
            
            try:
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing NFTs: {e}")
            bot.answer_callback_query(call.id, "❌ Error loading NFTs")
    
    elif call.data == "withdraw_tama":
        # Show withdrawal options
        telegram_id = str(call.from_user.id)
        
        try:
            # Get user's TAMA balance and wallet address
            leaderboard_response = supabase.table('leaderboard').select('tama,wallet_address').eq('telegram_id', telegram_id).execute()
            tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
            saved_wallet = leaderboard_response.data[0].get('wallet_address') if leaderboard_response.data else None
            
            min_withdrawal = 1000
            fee_percent = 5
            can_withdraw = tama_balance >= min_withdrawal
            
            # Проверяем, есть ли сохраненный адрес (не placeholder)
            if can_withdraw and saved_wallet and not saved_wallet.startswith('telegram_') and len(saved_wallet) >= 32:
                # У пользователя уже есть сохраненный адрес - используем его
                withdrawal_sessions[telegram_id] = {'wallet_address': saved_wallet}
                
                # Сразу спрашиваем сумму
                text = f"""
✅ **Using Saved Wallet Address**
`{saved_wallet[:8]}...{saved_wallet[-8:]}`

**Your Balance:** {tama_balance:,} TAMA

**How much TAMA do you want to withdraw?**

Enter amount (minimum 1,000 TAMA):
                """
                
                keyboard = types.InlineKeyboardMarkup()
                keyboard.row(
                    types.InlineKeyboardButton("🔙 Change Address", callback_data="change_wallet_address"),
                    types.InlineKeyboardButton("❌ Cancel", callback_data="back_to_menu")
                )
                
                try:
                    safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                        parse_mode='Markdown', reply_markup=keyboard)
                    bot.register_next_step_handler(call.message, process_withdrawal_amount)
                except:
                    msg = bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
                    bot.register_next_step_handler(msg, process_withdrawal_amount)
                return
            
            if can_withdraw:
                example_amount = 10000
                example_fee = int(example_amount * 0.05)
                example_received = example_amount - example_fee
                
                text = f"""
💰 **WITHDRAW TAMA TO WALLET** 💰

**Your Balance:** {tama_balance:,} TAMA

**Withdrawal Info:**
• Minimum: {min_withdrawal:,} TAMA
• Fee: {fee_percent}%
• Network: Solana (Devnet)

**Example:**
Withdraw: {example_amount:,} TAMA
Fee: -{example_fee:,} TAMA ({fee_percent}%)
You receive: **{example_received:,} TAMA**

**⚠️ Important:**
1. You need a Solana wallet (Phantom recommended)
2. Withdrawal is instant on devnet
3. Transaction fee paid from P2E Pool

**Ready to withdraw?**
                """
            else:
                shortage = min_withdrawal - tama_balance
                text = f"""
💰 **WITHDRAW TAMA TO WALLET** 💰

**Your Balance:** {tama_balance:,} TAMA

❌ **Insufficient Balance**

You need at least **{min_withdrawal:,} TAMA** to withdraw.
You need **{shortage:,} more TAMA**.

**How to earn more TAMA:**
🎮 Play the game (click pet)
📋 Complete quests
🎁 Claim daily rewards
🔗 Refer friends (+1,000 TAMA each)
                """
            
            keyboard = types.InlineKeyboardMarkup()
            if can_withdraw:
                # Add "Enter Wallet Address" button (will prompt user to send wallet)
                keyboard.row(
                    types.InlineKeyboardButton("💳 Enter Wallet Address", callback_data="enter_wallet")
                )
            keyboard.row(
                types.InlineKeyboardButton("📜 Withdrawal History", callback_data="withdrawal_history")
            )
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
            
            try:
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing withdrawal options: {e}")
            bot.answer_callback_query(call.id, "❌ Error loading withdrawal page")
    
    elif call.data == "enter_wallet":
        # Prompt user to enter wallet address
        text = """
💰│ **ENTER YOUR SOLANA WALLET ADDRESS**

Please send your Solana wallet address (e.g., from Phantom).

**Format:** 32-44 characters, base58
**Example:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

⚠️ **Double-check your address!**
Wrong address = lost TAMA!

💾 **Note:** Your address will be saved for future withdrawals.

After sending your address, I'll ask for the amount.
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Cancel", callback_data="withdraw_tama")
        )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='Markdown', reply_markup=keyboard)
            # Set user state to expect wallet address
            bot.register_next_step_handler(call.message, process_wallet_address)
        except:
            msg = bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
            bot.register_next_step_handler(msg, process_wallet_address)
    
    elif call.data == "withdrawal_history":
        # Show withdrawal history
        telegram_id = str(call.from_user.id)
        
        try:
            # Check if API is available
            if not is_api_available():
                text = """
❌ **API Server Not Available**

The withdrawal history feature requires the API server to be running.

**To enable:**
1. Start the PHP API server (see PHP_API_SETUP.md)
2. Or use direct Supabase queries

**Current API:** `localhost:8002`
                """
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, parse_mode='Markdown')
                return
            
            # Fetch from API
            response = requests.get(f"{TAMA_API_BASE}/withdrawal/history?telegram_id={telegram_id}", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                withdrawals = data.get('withdrawals', [])
                
                if not withdrawals:
                    text = """
ЁЯУЬ **WITHDRAWAL HISTORY** ЁЯУЬ

No withdrawals yet.

Make your first withdrawal to see history here!
                    """
                else:
                    text = "ЁЯУЬ **WITHDRAWAL HISTORY** ЁЯУЬ\n\n"
                    
                    for i, w in enumerate(withdrawals[:10], 1):
                        amount = w.get('amount_sent', 0)
                        fee = w.get('fee', 0)
                        status_emoji = "✅" if w.get('status') == 'completed' else "тП│"
                        created_at = w.get('created_at', '')[:10]
                        
                        text += f"{i}. {status_emoji} **{amount:,} TAMA**\n"
                        text += f"   Fee: {fee:,} TAMA | {created_at}\n\n"
                    
                    if len(withdrawals) > 10:
                        text += f"... and {len(withdrawals) - 10} more"
            else:
                text = "❌ Error loading withdrawal history"
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back", callback_data="withdraw_tama")
            )
            
            try:
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing withdrawal history: {e}")
            text = f"""
❌ **Error loading withdrawal history**

API server is not available or returned an error.

**Error:** {str(e)}

Please check if the API server is running on `localhost:8002`
            """
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, parse_mode='Markdown')
            bot.answer_callback_query(call.id, "❌ Error loading history")
    
    elif call.data == "mint_nft":
        # Show mint options
        telegram_id = str(call.from_user.id)
        username = call.from_user.username or call.from_user.first_name
        
        try:
            # Get user's TAMA balance, level, and XP (all at once for efficiency)
            leaderboard_response = supabase.table('leaderboard').select('tama, level, xp').eq('telegram_id', telegram_id).execute()
            user_data = leaderboard_response.data[0] if leaderboard_response.data else {}
            tama_balance = user_data.get('tama', 0)
            level = user_data.get('level', 1)
            xp = user_data.get('xp', 0)
            
            tama_cost = 5000
            can_afford_tama = tama_balance >= tama_cost
            
            text = f"""
🎨 **MINT YOUR NFT PET** 🎨

Choose your mint type:

**💰 TAMA MINT**
• Cost: **5,000 TAMA**
• Your balance: **{tama_balance:,} TAMA**
• Get: Common (70%) / Rare (30%)
• Bonus: +500 TAMA after mint
{'' if can_afford_tama else '❌ *Not enough TAMA!*'}

**⭐ PREMIUM SOL MINT**
• Cost: **0.1 SOL** (~$15-20)
• Get: Epic (60%) / Legendary (40%)  
• Bonus: +10,000 TAMA after mint
• VIP status: x2 TAMA earning

🎮 *NFT Benefits:*
All NFTs give you earning bonuses when playing!

💰 *Click the button below to mint!*
            """
            
            # Create mint URL with FRESH user data (tama, level, xp)
            # ✅ Now passes actual TAMA balance to website!
            mint_url = f"{MINT_URL}?user_id={telegram_id}&tama={tama_balance}&level={level}&xp={xp}"
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🎨 Open Mint Page", url=mint_url)
            )
            keyboard.row(
                types.InlineKeyboardButton("🖼️ My NFTs", callback_data="my_nfts"),
                types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
            )
            
            try:
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing mint options: {e}")
            bot.answer_callback_query(call.id, "❌ Error loading mint page")
    
    elif call.data == "confirm_withdrawal":
        # Execute withdrawal via API
        telegram_id = str(call.from_user.id)
        
        # Get withdrawal data from session
        withdrawal_data = withdrawal_sessions.get(telegram_id)
        if not withdrawal_data:
            bot.answer_callback_query(call.id, "❌ Session expired. Please start again.")
            return
        
        wallet_address = withdrawal_data.get('wallet_address')
        amount = withdrawal_data.get('amount')
        
        try:
            # Check if API is available
            if not is_api_available():
                text = """
❌ **API Server Not Available**

The withdrawal feature requires the API server to be running.

**To enable:**
1. Start the PHP API server (see PHP_API_SETUP.md)
2. Or configure withdrawal to work directly with Supabase

**Current API:** `localhost:8002`
                """
                safe_edit_message_text(text, call.message.chat.id, call.message.message_id, parse_mode='Markdown')
                return
            
            # Call withdrawal API
            # Увеличен таймаут до 60 секунд, так как spl-token transfer может выполняться долго
            response = requests.post(f"{TAMA_API_BASE}/withdrawal/request", json={
                'telegram_id': telegram_id,
                'wallet_address': wallet_address,
                'amount': amount
            }, timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                withdrawal = data.get('withdrawal', {})
                
                amount_sent = withdrawal.get('amount_sent', 0)
                fee = withdrawal.get('fee', 0)
                tx_signature = withdrawal.get('transaction_signature')
                explorer_url = withdrawal.get('explorer_url')
                new_balance = withdrawal.get('new_balance', 0)
                
                # Calculate total withdrawn (approximate)
                total_withdrawn = amount_sent + fee
                
                text = f"""
🎉 **WITHDRAWAL SUCCESSFUL!** 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💸 **Amount Sent:** `{amount_sent:,} TAMA`
💰 **Network Fee:** `{fee:,} TAMA` (5%)
📦 **Total Deducted:** `{total_withdrawn:,} TAMA`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 **Your Wallet Balance:** `{new_balance:,} TAMA`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 **Blockchain Transaction:**
[🔍 View on Solscan Explorer]({explorer_url})

✅ **Status:** `Completed & Confirmed`
⛓️ **Network:** Solana Devnet
🎯 **Source:** P2E Pool

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ **Your TAMA tokens are now in your wallet!**

💡 **Tip:** You can use these tokens to mint NFTs or trade on DEX!

Thank you for playing! 🎮✨
                """
                
                keyboard = types.InlineKeyboardMarkup()
                if explorer_url:
                    keyboard.row(
                        types.InlineKeyboardButton("🔍 View on Solscan", url=explorer_url)
                    )
                keyboard.row(
                    types.InlineKeyboardButton("💰 Withdraw More", callback_data="withdraw_tama"),
                    types.InlineKeyboardButton("🎨 Mint NFT", callback_data="mint_nft"),
                    types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
                )
                
                # Clear session
                del withdrawal_sessions[telegram_id]
                
                try:
                    safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                        parse_mode='Markdown', reply_markup=keyboard)
                except:
                    bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
            else:
                error_data = response.json()
                error_msg = error_data.get('error', 'Unknown error')
                
                text = f"""
❌ **WITHDRAWAL FAILED**

**Error:** {error_msg}

Please try again or contact support.
                """
                
                keyboard = types.InlineKeyboardMarkup()
                keyboard.row(
                    types.InlineKeyboardButton("🔄 Try Again", callback_data="withdraw_tama"),
                    types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
                )
                
                try:
                    safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                        parse_mode='Markdown', reply_markup=keyboard)
                except:
                    bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
                
        except Exception as e:
            print(f"Error processing withdrawal: {e}")
            text = f"""
❌ **Error processing withdrawal**

API server is not available or returned an error.

**Error:** {str(e)}

Please check if the API server is running on `localhost:8002`
            """
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, parse_mode='Markdown')
            bot.answer_callback_query(call.id, "❌ Error processing withdrawal")
    
    elif call.data == "change_wallet_address":
        # Change wallet address
        text = """
💰│ **ENTER YOUR SOLANA WALLET ADDRESS**

Please send your new Solana wallet address (e.g., from Phantom).

**Format:** 32-44 characters, base58
**Example:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

⚠️ **Double-check your address!**
Wrong address = lost TAMA!

💾 **Note:** Your address will be saved for future withdrawals.

After sending your address, I'll ask for the amount.
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Cancel", callback_data="withdraw_tama")
        )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='Markdown', reply_markup=keyboard)
            bot.register_next_step_handler(call.message, process_wallet_address)
        except:
            msg = bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
            bot.register_next_step_handler(msg, process_wallet_address)
    
    elif call.data == "cancel_withdrawal":
        # Cancel withdrawal
        telegram_id = str(call.from_user.id)
        
        # Clear session
        if telegram_id in withdrawal_sessions:
            del withdrawal_sessions[telegram_id]
        
        text = """
❌ **Withdrawal Cancelled**

No TAMA was deducted from your balance.

You can try again anytime!
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("💰 Withdraw", callback_data="withdraw_tama"),
            types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
        )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='Markdown', reply_markup=keyboard)
        except:
            bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "my_stats":
        # Create stats with back button for callback
        telegram_id = str(call.from_user.id)
        username = call.from_user.username or call.from_user.first_name
        
        try:
            # Get player data from Supabase by telegram_id
            response = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
            
            if response.data:
                player = response.data[0]
                
                # Get referral stats
                ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
                pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).eq('status', 'pending').execute()
                
                total_referrals = ref_response.count or 0
                pending_count = pending_response.count or 0
                # Show correct TAMA balance (use actual balance from database)
                base_tama = player.get('tama', 0)
                total_earned = base_tama
                
                text = f"""
📊 <b>Your Personal Stats:</b>

🐾 <b>Your Pet:</b>
• Name: {player.get('pet_name', 'No pet yet')}
• Type: {player.get('pet_type', 'N/A')}
• Rarity: {player.get('pet_rarity', 'N/A')}
• Level: {player.get('level', 1)}
• XP: {player.get('xp', 0)}

💰 <b>Your Balance:</b>
• TAMA Tokens: {total_earned:,}

🔗 <b>Your Referrals:</b>
• Level 1 Direct: {total_referrals + pending_count}
• Pending (no wallet): {pending_count}
• Total Referrals: {total_referrals + pending_count}
• Total Earned: {total_earned:,} TAMA

ЁЯСЫ <b>Wallet:</b>
• <code>{player['wallet_address'][:8]}...{player['wallet_address'][-8:]}</code>

📋 <b>Your Referral Code:</b>
• <code>{player.get('referral_code', 'Generate with /ref')}</code>

<i>Keep playing and referring friends to earn more!</i> 🚀
                """
            else:
                # No wallet linked yet
                text = f"""
📊 <b>Your Personal Stats:</b>

❌ <b>No wallet linked yet!</b>

To start playing and tracking your stats:
1я╕ПтГг Use /ref to get your personal link
2я╕ПтГг Connect your Phantom wallet
3я╕ПтГг Your progress will be automatically saved!

🎮 <b>Ready to start?</b>
                """
            
        except Exception as e:
            print(f"Error getting stats: {e}")
            text = "❌ Error getting your stats. Please try again later."
        
        # Add back button
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
        )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='HTML', reply_markup=keyboard)
        except Exception as e:
            print(f"Error editing message: {e}")
            bot.send_message(call.message.chat.id, text, parse_mode='HTML', reply_markup=keyboard)
    
    elif call.data == "leaderboard":
        try:
            # Get referral leaderboard - top referrers by total referrals
            referral_stats = []
            
            # Get all users with their referral counts
            users_response = supabase.table('leaderboard').select('pet_name, telegram_username, telegram_id, wallet_address').execute()
            
            for user in users_response.data:
                wallet_address = user.get('wallet_address')
                telegram_id = user.get('telegram_id')
                
                if wallet_address and telegram_id:
                    # Count active referrals (with wallets)
                    active_refs = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', str(telegram_id)).execute()
                    active_count = active_refs.count or 0
                    
                    # Count pending referrals (without wallets yet)
                    pending_refs = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', str(telegram_id)).eq('status', 'pending').execute()
                    pending_count = pending_refs.count or 0
                    
                    total_referrals = active_count + pending_count
                    
                    if total_referrals > 0:  # Only show users with referrals
                        # Get TAMA balance
                        tama_response = supabase.table('leaderboard').select('tama').eq('telegram_id', str(telegram_id)).execute()
                        tama_balance = tama_response.data[0].get('tama', 0) if tama_response.data else 0
                        
                        # Get better name
                        name = user.get('pet_name')
                        if not name:
                            name = user.get('telegram_username')
                        if not name:
                            name = f"User {user.get('telegram_id', 'Unknown')}"
                        
                        referral_stats.append({
                            'name': name,
                            'active': active_count,
                            'pending': pending_count,
                            'total': total_referrals,
                            'tama': tama_balance
                        })
            
            # Sort by total referrals
            referral_stats.sort(key=lambda x: x['total'], reverse=True)
            
            # Build referral leaderboard
            referral_text = ""
            if referral_stats:
                for i, user in enumerate(referral_stats[:10], 1):  # Top 10
                    medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
                    name = user['name']
                    total = user['total']
                    active = user['active']
                    pending = user['pending']
                    
                    # Show actual TAMA balance from database
                    display_tama = user['tama']  # ✅ FIX: use user['tama'] instead of undefined tama_balance
                    referral_text += f"{medal} {name} - {total} referrals ({display_tama:,} TAMA)\n"
            else:
                referral_text = "No referrals yet!\n\n🔗 Start referring friends to climb the ranks!"
            
            text = f"""
🏅 <b>Referral Leaderboard:</b>

<b>Top Referrers:</b>
{referral_text}

💰 <b>How to earn:</b>
• Share your referral link
• Get 1,000 TAMA per friend
• Milestone bonuses available!

📋 <b>Get your link:</b> /ref
            """
            
            # Add interactive buttons
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔗 Get My Link", callback_data="get_referral"),
                types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats")
            )
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
            
        except Exception as e:
            print(f"Error getting referral leaderboard: {e}")
            text = """
🏅 <b>Referral Leaderboard:</b>

❌ <b>Error loading leaderboard</b>

Please try again later!
            """
            
            # Add back button
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
        
        try:
            safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='HTML', reply_markup=keyboard)
        except Exception as e:
            print(f"Error editing message: {e}")
            bot.send_message(call.message.chat.id, text, parse_mode='HTML', reply_markup=keyboard)
    
    elif call.data == "rules":
        text = """
ЁЯУЛ *Community Rules:*

✅ *Allowed:*
• Game discussions & strategies
• Sharing achievements & screenshots
• Referral links & codes
• Help requests & questions
• Trading & marketplace discussions
• Pet evolution tips
• TAMA earning strategies

❌ *Not Allowed:*
• Spam, flooding or repetitive messages
• Offensive language or harassment
• Scam links or fake giveaways
• NSFW content or inappropriate media
• Impersonation or fake accounts
• Price manipulation discussions
• Off-topic political/religious content

ЁЯЪл *Violations result in:*
• Warning тЖТ Mute тЖТ Ban
• Severe violations = instant ban

💰 *Tips for better experience:*
• Use English for global communication
• Be respectful to all community members
• Report suspicious activity to admins
• Follow Discord/Telegram ToS

🎮 *Let's keep it fun and friendly\\!*
        """
        
        # Add back button
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
        )
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id, 
                            reply_markup=keyboard)
    
    elif call.data.startswith("qr_"):
        ref_code = call.data[3:]
        short_link = f"https://solanatamagotchi.com/s.html?ref={ref_code}&v=30"
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(short_link)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to bytes
        bio = io.BytesIO()
        img.save(bio, 'PNG')
        bio.seek(0)
        
        # Add back button to QR code
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back to Referral", callback_data="get_referral")
        )
        
        bot.send_photo(call.message.chat.id, bio, 
                      caption=f"📱 *Your Referral QR Code*\n\n`{short_link}`\n\nScan to join!", 
                      parse_mode='Markdown', reply_markup=keyboard)
    
    # ==================== NEW MENU CALLBACKS ====================
    
    elif call.data == "daily_reward":
        # Handle daily reward from button
        telegram_id = str(call.from_user.id)
        
        success, streak_days, reward_amount = daily_rewards.claim_reward(telegram_id)
        
        if success:
            # 💰 TAMA balance is already updated in claim_reward() function
            # No need to call add_tama_reward() separately
            
            milestone_text = ""
            if streak_days == 7:
                milestone_text = "\n\n🎉 **WEEK MILESTONE!** 7 days in a row!"
            elif streak_days == 14:
                milestone_text = "\n\n🔥 **2 WEEKS!** Incredible streak!"
            elif streak_days == 30:
                milestone_text = "\n\n👑 **MONTH!** You're a legend!"
            
            text = f"""
✅ **Daily Reward Claimed!**

💰 **Reward:** +{reward_amount:,} TAMA
🔥 **Streak:** {streak_days} days in a row
📅 **Next:** in 24 hours{milestone_text}

💰 **Come back every day for bigger rewards!**
            """
            
            if streak_days == 7:
                badge_system.award_badge(telegram_id, 'week_warrior')
            elif streak_days == 30:
                badge_system.award_badge(telegram_id, 'streak_master')
        else:
            can_claim, current_streak = daily_rewards.can_claim(telegram_id)
            text = f"""
⏰ **Already Claimed Today!**

🔥 **Current Streak:** {current_streak} days
📅 **Come back tomorrow** for next reward!

💰 **Don't miss a day to keep your streak!**
            """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    # Mini-games removed - available in main game only
    # elif call.data == "mini_games":
    #     # Show games menu
    #     telegram_id = str(call.from_user.id)
    #     can_play, games_played = mini_games.can_play(telegram_id)
    #     games_left = 3 - games_played
    #     
    #     text = f"""
    # 🎮 **Mini-Games**
    # 
    # 💰 **Play and earn TAMA!**
    # 
    # 📋 **Available games:**
    # • Guess Number (1-100) - up to 500 TAMA
    # • Solana Quiz - 100 TAMA
    # • Fortune Wheel - up to 500 TAMA
    # 
    # 📊 **Limit:** {games_left}/3 games left today
    # 
    # 💰 **Choose a game:**
    #         """
    #     
    #     keyboard = types.InlineKeyboardMarkup()
    #     if can_play:
    #         keyboard.row(
    #             types.InlineKeyboardButton("📋 Guess Number", callback_data="game_guess"),
    #             types.InlineKeyboardButton("❓ Quiz", callback_data="game_trivia")
    #         )
    #         keyboard.row(
    #             types.InlineKeyboardButton("🎰 Fortune Wheel", callback_data="game_wheel")
    #         )
    #     keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
    #     
    #     safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
    #                         parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "view_badges":
        # Show badges
        telegram_id = str(call.from_user.id)
        user_badges = badge_system.get_user_badges(telegram_id)
        
        if user_badges:
            badges_text = "\n".join([f"• {b['name']} - {b['desc']}" for b in user_badges])
        else:
            badges_text = "No badges yet. Play and invite friends!"
        
        text = f"""
🏆 **Your Badges**

{badges_text}

💰 **How to earn more:**
• ЁЯРж Early Bird - Be in first 100 users
• 🔥 Streak Master - 30 days streak
• 👑 Referral King - 50+ referrals
• 💰 Generous - 100+ referrals
• 🎮 Gamer - 100 mini-games
• 🍀 Lucky - Wheel jackpot
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "view_rank":
        # Show rank
        telegram_id = str(call.from_user.id)
        
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        rank_changed, rank_id, rank_data = rank_system.update_rank(telegram_id, total_refs)
        
        next_rank = None
        for r_id, r_data in RANKS.items():
            if r_data['min_refs'] > total_refs:
                next_rank = (r_id, r_data)
                break
        
        # Progress bar with proper characters
        filled = "▓" * min(total_refs % 5, 5)
        empty = "░" * max(5 - (total_refs % 5), 0)
        progress_bar = filled + empty
        
        text = f"""
{rank_data['emoji']} **Your Rank: {rank_data['name']}**

📊 **Stats:**
• Referrals: {total_refs}
• Progress: {progress_bar}
        """
        
        if next_rank:
            refs_needed = next_rank[1]['min_refs'] - total_refs
            text += f"""

📋 **Next rank:** {next_rank[1]['name']}
🎯 **Needed:** {refs_needed} referrals
        """
        else:
            text += "\n\n🏆 **Maximum rank achieved!**"
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "view_quests":
        # Show quests
        telegram_id = str(call.from_user.id)
        
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        quest_system.check_quests(telegram_id, total_refs)
        
        text = "📋 **Referral Quests**\n\n"
        
        for quest_id, quest_data in QUESTS.items():
            progress = min(total_refs, quest_data['target'])
            
            if total_refs >= quest_data['target']:
                status = "✅"
            else:
                status = f"{progress}/{quest_data['target']}"
            
            text += f"{status} **{quest_data['name']}**\n"
            text += f"   {quest_data['desc']}\n"
            text += f"   Reward: {quest_data['reward']:,} TAMA\n\n"
        
        text += "💰 **Invite friends to complete quests!**"
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "my_stats_detailed":
        # Detailed stats with gamification
        telegram_id = str(call.from_user.id)
        
        # Get all stats
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        total_tama = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
        
        streak_days = daily_rewards.get_streak(telegram_id)
        rank_id, rank_data = rank_system.get_user_rank(telegram_id)
        user_badges = badge_system.get_user_badges(telegram_id)
        
        badges_count = len(user_badges)
        
        text = f"""
📊 **Your Full Stats**

💰 **TAMA Balance:** {total_tama:,}
{rank_data['emoji']} **Rank:** {rank_data['name']}

👥 **Referrals:**
• Total invited: {total_refs}
• Active: {ref_response.count or 0}
• Pending: {pending_response.count or 0}

🔥 **Activity:**
• Login streak: {streak_days} days
• Badges earned: {badges_count}

📈 **Progress:**
{"▓" * min(total_refs % 10, 10)}{"░" * max(10 - (total_refs % 10), 0)}

💰 **Keep playing and inviting friends!**
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔗 Referral", callback_data="get_referral")
        )
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    # ==================== GAME CALLBACKS ====================
    
    # Mini-games removed - available in main game only
    # elif call.data == "game_guess":
    #     # Guess the number game
    #     telegram_id = str(call.from_user.id)
    #     can_play, games_played = mini_games.can_play(telegram_id)
    #     
    #     if not can_play:
    #         bot.answer_callback_query(call.id, "Daily game limit reached!")
    #         return
    #     
    #     text = """
    # 📋 **Guess Number (1-100)**
    # 
    # 💰 **Rewards:**
    # • Exact match: 500 TAMA
    # • ┬▒5: 200 TAMA  
    # • ┬▒10: 100 TAMA
    # • ┬▒20: 50 TAMA
    # • Other: 25 TAMA
    # 
    # **Enter number from 1 to 100:**
    #         """
    #     
    #     keyboard = types.InlineKeyboardMarkup()
    #     keyboard.row(
    #         types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
    #     )
    #     
    #     safe_edit_message_text(text, call.message.chat.id, call.message.message_id,
    #                         parse_mode='Markdown', reply_markup=keyboard)
    #     
    #     # Set waiting state for number input
    #     bot.register_next_step_handler(call.message, process_guess_number)
    
    # Mini-games removed - available in main game only
    # elif call.data == "game_trivia":
    #     # Trivia game
    #     ...
    # elif call.data.startswith("trivia_"):
    #     # Process trivia answer
    #     ...
    # elif call.data == "game_wheel":
    #     # Spin the wheel
    #     ...
    
    elif call.data == "back_to_menu":
        # Return to main menu
        send_welcome(call.message)

# Mini-games removed - available in main game only
# Handler for guess number game
# def process_guess_number(message):
#     """Process guess number game input"""
#     telegram_id = str(message.from_user.id)
#     
#     try:
#         guess = int(message.text)
#         if guess < 1 or guess > 100:
#             bot.reply_to(message, "❌ Number must be from 1 to 100!")
#             return
#         
#         success, reward, result_text = mini_games.play_guess_number(telegram_id, guess)
#         
#         if success:
#             text = f"""
# {result_text}
# 
# 💰 **Earned:** +{reward} TAMA
# 
# 🎮 **Come back tomorrow for new games!**
#             """
#             
#             keyboard = types.InlineKeyboardMarkup()
#             keyboard.row(
#                 types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
#             )
#             
#             bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
#         else:
#             bot.reply_to(message, f"❌ {result_text}")
#             
#     except ValueError:
#         bot.reply_to(message, "❌ Enter number from 1 to 100!")

# Start bot
# Handler for WebApp data (game autosave)
@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    """Handle data sent from Telegram WebApp (game autosave)"""
    try:
        telegram_id = str(message.from_user.id)
        data = json.loads(message.web_app_data.data)
        
        logging.info(f"ЁЯУе Received WebApp data from user {telegram_id}: {data.get('action')}")
        
        if data.get('action') == 'auto_save':
            game_data = data.get('data', {})
            
            # Extract game state
            level = game_data.get('level', 1)
            game_tama = game_data.get('tama', 0) or 0
            hp = game_data.get('hp', 100)
            food = game_data.get('food', 100)
            happy = game_data.get('happy', 100)
            total_clicks = game_data.get('totalClicks', 0)
            max_combo = game_data.get('maxCombo', 0)
            
            # Prepare pet_data JSON
            pet_data = {
                'hp': hp,
                'food': food,
                'happy': happy,
                'totalClicks': total_clicks,
                'maxCombo': max_combo,
                'xp': game_data.get('xp', 0),
                'achievements': game_data.get('achievements', [])
            }
            
            # 🛡️ PROTECTION: Get current balance and never decrease it!
            # This prevents game autosave from overwriting daily rewards, referrals, etc.
            try:
                current_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                current_tama = current_response.data[0].get('tama', 0) or 0 if current_response.data else 0
                
                # Only update TAMA if game has more (earned in game)
                # If current balance is higher (from daily rewards, referrals), keep it!
                final_tama = max(current_tama, game_tama)
                
                if final_tama > current_tama:
                    logging.info(f"💰 Auto-save: Updated TAMA from {current_tama} to {final_tama} (+{final_tama - current_tama})")
                elif current_tama > game_tama:
                    logging.info(f"🛡️ Auto-save: Protected balance {current_tama} (game had {game_tama}) - prevented decrease!")
            except Exception as e:
                logging.error(f"Error getting current balance: {e}")
                final_tama = game_tama  # Fallback to game balance if error
            
            # Update in Supabase
            response = supabase.table('leaderboard').update({
                'tama': final_tama,  # Use protected balance
                'level': level,
                'pet_data': json.dumps(pet_data),
                'last_active': datetime.now().isoformat()
            }).eq('telegram_id', telegram_id).execute()
            
            logging.info(f"✅ Saved game data for user {telegram_id}: Level={level}, TAMA={final_tama}")
            
        elif data.get('action') == 'level_up':
            game_data = data.get('data', {})
            level = game_data.get('level', 1)
            
            logging.info(f"🎉 Level up for user {telegram_id}: Level {level}")
            
            # Send congratulations message
            bot.send_message(
                message.chat.id,
                f"🎉 Congratulations! Your pet reached Level {level}!\n\n"
                f"Keep playing to unlock more rewards! 🚀",
                parse_mode='Markdown'
            )
            
    except Exception as e:
        logging.error(f"❌ Error handling WebApp data: {e}")
        logging.error(f"Data: {message.web_app_data.data if message.web_app_data else 'None'}")

if __name__ == '__main__':
    print("Bot started!")
    
    # Start scheduler in background
    scheduler_thread = threading.Thread(target=run_schedule, daemon=True)
    scheduler_thread.start()
    
    # Setup group permissions to bypass anti-spam
    async def setup_group_permissions():
        try:
            # Set bot permissions in group
            await bot.set_chat_permissions(
                chat_id=GROUP_ID,
                permissions=types.ChatPermissions(
                    can_send_messages=True,
                    can_send_media_messages=True,
                    can_send_polls=True,
                    can_send_other_messages=True,
                    can_add_web_page_previews=True,
                    can_change_info=True,
                    can_invite_users=True,
                    can_pin_messages=True
                )
            )
            print(f"Group permissions set for {GROUP_ID}")
        except Exception as e:
            print(f"Error setting group permissions: {e}")

    # ========================================
    # WEBHOOK MODE (для Railway / Production)
    # ========================================
    
    # Create Flask app for webhook
    app = Flask(__name__)
    
    # Webhook endpoint (Telegram will POST updates here)
    @app.route(f'/{TOKEN}', methods=['POST'])
    def webhook():
        """Handle incoming updates from Telegram"""
        try:
            json_string = request.get_data().decode('utf-8')
            update = telebot.types.Update.de_json(json_string)
            bot.process_new_updates([update])
            return '', 200
        except Exception as e:
            print(f"❌ Webhook error: {e}")
            return '', 500
    
    # Health check endpoint (для Railway/Render)
    @app.route('/', methods=['GET'])
    def health():
        """Health check endpoint"""
        return {'status': 'ok', 'bot': 'running', 'timestamp': datetime.now().isoformat()}, 200
    
    # Keep-Alive function (prevents Render Free tier from sleeping)
    def keep_alive_ping():
        """Ping bot, API, and Node.js on-chain service every 5 minutes to prevent sleep"""
        while True:
            try:
                time.sleep(300)  # 5 minutes
                
                # Ping bot health endpoint
                WEBHOOK_HOST = os.getenv('RAILWAY_PUBLIC_DOMAIN') or os.getenv('RENDER_EXTERNAL_HOSTNAME')
                if WEBHOOK_HOST:
                    bot_url = f"https://{WEBHOOK_HOST}/"
                    try:
                        response = requests.get(bot_url, timeout=10)
                        if response.status_code == 200:
                            print(f"✅ Keep-Alive: Bot pinged successfully")
                        else:
                            print(f"⚠️ Keep-Alive: Bot ping returned {response.status_code}")
                    except Exception as e:
                        print(f"❌ Keep-Alive: Bot ping failed: {e}")
                
                # Ping API health endpoint
                try:
                    api_response = requests.get(f"{TAMA_API_BASE}/test", timeout=10)
                    if api_response.status_code == 200:
                        print(f"✅ Keep-Alive: API pinged successfully")
                    else:
                        print(f"⚠️ Keep-Alive: API ping returned {api_response.status_code}")
                except Exception as e:
                    print(f"❌ Keep-Alive: API ping failed: {e}")
                
                # Ping Node.js on-chain minting service health endpoint
                try:
                    onchain_url = "https://solanatamagotchi-onchain.onrender.com/health"
                    onchain_response = requests.get(onchain_url, timeout=10)
                    if onchain_response.status_code == 200:
                        print(f"✅ Keep-Alive: On-Chain Service pinged successfully")
                    else:
                        print(f"⚠️ Keep-Alive: On-Chain Service ping returned {onchain_response.status_code}")
                except Exception as e:
                    print(f"❌ Keep-Alive: On-Chain Service ping failed: {e}")
                    
            except Exception as e:
                print(f"❌ Keep-Alive thread error: {e}")
    
    # Start Keep-Alive in background thread (only on Render)
    if os.getenv('RENDER'):
        keep_alive_thread = threading.Thread(target=keep_alive_ping, daemon=True)
        keep_alive_thread.start()
        print("🔄 Keep-Alive started (5 min interval)")
    
    # Set webhook URL (if not set already)
    try:
        # Get Railway/Render public URL from environment
        WEBHOOK_HOST = os.getenv('RAILWAY_PUBLIC_DOMAIN') or os.getenv('RENDER_EXTERNAL_HOSTNAME')
        
        if WEBHOOK_HOST:
            WEBHOOK_URL = f"https://{WEBHOOK_HOST}/{TOKEN}"
            webhook_info = bot.get_webhook_info()
            
            if webhook_info.url != WEBHOOK_URL:
                print(f"🔗 Setting webhook to: {WEBHOOK_URL}")
                bot.remove_webhook()
                time.sleep(1)
                bot.set_webhook(url=WEBHOOK_URL)
                print("✅ Webhook set successfully!")
            else:
                print(f"✅ Webhook already set: {webhook_info.url}")
        else:
            print("⚠️ No WEBHOOK_HOST found - webhook not set (use RAILWAY_PUBLIC_DOMAIN or RENDER_EXTERNAL_HOSTNAME)")
            
    except Exception as e:
        print(f"❌ Error setting webhook: {e}")
    
    # Run Flask app (Railway/Render will provide PORT)
    PORT = int(os.getenv('PORT', 8080))
    print(f"🚀 Starting webhook server on port {PORT}...")
    print(f"📡 Bot is ready to receive updates!")
    
    # Use gunicorn in production, Flask dev server for local
    # SECURITY: Never enable debug mode in production!
    # Use FLASK_DEBUG environment variable for local development only
    DEBUG_MODE = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    if os.getenv('RAILWAY_ENVIRONMENT') or os.getenv('RENDER'):
        # Production: use gunicorn (installed in requirements.txt)
        # Railway/Render will run: gunicorn bot:app
        # But we can also run Flask directly (Railway handles it)
        app.run(host='0.0.0.0', port=PORT, debug=False)
    else:
        # Local development: use Flask dev server
        if DEBUG_MODE:
            print("🔧 Running in development mode (Flask dev server with debug)")
        else:
            print("🔧 Running in local mode (Flask dev server, debug disabled for security)")
        app.run(host='0.0.0.0', port=PORT, debug=DEBUG_MODE)
