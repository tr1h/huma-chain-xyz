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

# Import gamification module
from gamification import (
    DailyRewards, MiniGames, RankSystem, BadgeSystem, QuestSystem,
    BADGES, RANKS, QUESTS, ACHIEVEMENTS
)

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
GAME_URL = os.getenv('GAME_URL', 'https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251030-v191')  # Telegram Mini App URL
MINT_URL = os.getenv('MINT_URL', 'https://tr1h.github.io/huma-chain-xyz/')  # Mint URL
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

# TAMA API Configuration
TAMA_API_BASE = "http://localhost:8002/api/tama"

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

# Supabase connection
SUPABASE_URL = os.getenv('SUPABASE_URL', 'YOUR_SUPABASE_URL_HERE')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'YOUR_SUPABASE_KEY_HERE')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize gamification systems
daily_rewards = DailyRewards(supabase)
mini_games = MiniGames(supabase)
rank_system = RankSystem(supabase)
badge_system = BadgeSystem(supabase)
quest_system = QuestSystem(supabase)

# Helper function for NFT rarity emojis
def get_rarity_emoji(rarity):
    """Return emoji for NFT rarity"""
    emojis = {
        'common': '💚',
        'rare': '💙',
        'epic': '💜',
        'legendary': '🧡'
    }
    return emojis.get(rarity.lower(), '💚')

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
def get_tama_balance(telegram_id):
    """Получить баланс TAMA пользователя"""
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

def add_tama_reward(telegram_id, amount, source="game"):
    """Добавить TAMA награду пользователю"""
    try:
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
    """Потратить TAMA токены пользователя"""
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
    """Форматировать баланс TAMA для отображения"""
    if balance >= 1_000_000:
        return f"{balance / 1_000_000:.1f}M TAMA"
    elif balance >= 1_000:
        return f"{balance / 1_000:.1f}K TAMA"
    else:
        return f"{balance:,} TAMA"

def get_nft_costs():
    """Получить стоимость NFT"""
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
    """Минт NFT за TAMA"""
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
    """Получить NFT пользователя"""
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
    
    # Use SHA256 for better distribution
    hash_bytes = hashlib.sha256(str(telegram_id).encode()).digest()
    # Take first 3 bytes and convert to base36
    hash_val = int.from_bytes(hash_bytes[:3], 'big')
    code_part = format(hash_val % (36 ** 6), 'X').zfill(6)[:6]
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
            bot.send_message(admin_id, f"🚨 **MONITORING ALERT**\n\n{message}", parse_mode='Markdown')
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
        send_admin_alert(f"🚨 **HIGH REQUEST RATE DETECTED**\n\nUser: {user_id}\nRequests this minute: {requests_this_minute}\nAction: {action}")
        return True
    
    # Check for rapid referral attempts
    if action == "referral_attempt":
        # This would need more sophisticated tracking
        pass
    
    return False

def log_error(error_type, details, user_id=None):
    """Log errors and send alerts for critical ones"""
    monitoring_stats['errors_count'] += 1
    error_msg = f"ERROR: {error_type} - {details}"
    if user_id:
        error_msg += f" - User: {user_id}"
    
    logging.error(error_msg)
    
    # Send alert for critical errors
    if error_type in ['database_error', 'security_violation', 'system_failure']:
        send_admin_alert(f"🚨 **CRITICAL ERROR**\n\nType: {error_type}\nDetails: {details}\nUser: {user_id}")

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
                            print(f"⚠️ Referral already exists: {referrer_telegram_id} -> {user_id}")
                        
                        # IMMEDIATE TAMA REWARD - начисляем TAMA сразу! (NO WALLET NEEDED!)
                        # Only award if this is a NEW referral
                        if not existing.data:
                            try:
                                # Найти или создать реферера в leaderboard
                                referrer_data = supabase.table('leaderboard').select('*').eq('telegram_id', str(referrer_telegram_id)).execute()
                                
                                if referrer_data.data and len(referrer_data.data) > 0:
                                    referrer = referrer_data.data[0]
                                    current_tama = referrer.get('tama', 0) or 0
                                    new_tama = current_tama + 1000  # 1,000 TAMA за реферала
                                    
                                    # Обновить TAMA баланс
                                    supabase.table('leaderboard').update({
                                        'tama': new_tama
                                    }).eq('telegram_id', str(referrer_telegram_id)).execute()
                                    
                                    print(f"💰 Awarded 1,000 TAMA to {referrer_telegram_id} (new balance: {new_tama})")
                                else:
                                    # Создать нового пользователя если его нет
                                    referrer_ref_code = generate_referral_code(referrer_telegram_id)
                                    supabase.table('leaderboard').insert({
                                        'telegram_id': str(referrer_telegram_id),
                                        'telegram_username': referrer_username,
                                        'wallet_address': f'telegram_{referrer_telegram_id}',  # Placeholder
                                        'tama': 1000,
                                        'referral_code': referrer_ref_code
                                    }).execute()
                                    print(f"💰 Created new user and awarded 1,000 TAMA to {referrer_telegram_id}")
                                
                                # Создать запись в referrals для отслеживания (NO WALLET!)
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
                                        'signup_reward': 1000,
                                        'status': 'completed',
                                        'reward_given': 1000
                                    }).execute()
                                    print(f"✅ Created referral record for {referrer_telegram_id} -> {user_id}")
                                    
                                    # 🎁 ПРОВЕРКА МИЛЕСТОУНОВ
                                    try:
                                        # Подсчитать общее количество рефералов
                                        total_refs_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', str(referrer_telegram_id)).execute()
                                        total_pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', str(referrer_telegram_id)).eq('status', 'pending').execute()
                                        
                                        total_referrals = (total_refs_response.count or 0) + (total_pending_response.count or 0)
                                        
                                        # Проверить милестоуны
                                        milestone_bonus = 0
                                        milestone_text = ""
                                        
                                        if total_referrals == 5:
                                            milestone_bonus = 1000
                                            milestone_text = "🎉 **MILESTONE ACHIEVED!**\n\n🏆 **5 Referrals → +1,000 TAMA Bonus!**"
                                        elif total_referrals == 10:
                                            milestone_bonus = 3000
                                            milestone_text = "🎉 **MILESTONE ACHIEVED!**\n\n🏆 **10 Referrals → +3,000 TAMA Bonus!**"
                                        elif total_referrals == 25:
                                            milestone_bonus = 10000
                                            milestone_text = "🎉 **MILESTONE ACHIEVED!**\n\n🏆 **25 Referrals → +10,000 TAMA Bonus!**"
                                        elif total_referrals == 50:
                                            milestone_bonus = 30000
                                            milestone_text = "🎉 **MILESTONE ACHIEVED!**\n\n🏆 **50 Referrals → +30,000 TAMA Bonus!**"
                                        elif total_referrals == 100:
                                            milestone_bonus = 100000
                                            milestone_text = "🎉 **LEGENDARY MILESTONE!**\n\n🏆 **100 Referrals → +100,000 TAMA + Legendary Badge!**"
                                        
                                        # Начислить милестоун бонус
                                        if milestone_bonus > 0:
                                            # Получить текущий баланс
                                            current_balance_response = supabase.table('leaderboard').select('tama').eq('telegram_id', str(referrer_telegram_id)).execute()
                                            current_balance = current_balance_response.data[0].get('tama', 0) if current_balance_response.data else 0
                                            new_balance = current_balance + milestone_bonus
                                            
                                            # Обновить баланс
                                            supabase.table('leaderboard').update({
                                                'tama': new_balance
                                            }).eq('telegram_id', str(referrer_telegram_id)).execute()
                                            
                                            print(f"🎁 Milestone bonus: {milestone_bonus} TAMA to {referrer_telegram_id} (new balance: {new_balance})")
                                            
                                            # Отправить уведомление о милестоуне
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
                                    
                                    # 🔔 УВЕДОМЛЕНИЕ РЕФЕРЕРУ О НОВОМ РЕФЕРАЛЕ
                                    try:
                                        notification_text = f"""
🎉 *New Referral!*

👤 *New user joined:* {username}
💰 *You earned:* 1,000 TAMA
📊 *Your total referrals:* {total_referrals + 1}

🔗 *Keep sharing your link to earn more!*
                                        """
                                        
                                        bot.send_message(
                                            int(referrer_telegram_id), 
                                            notification_text, 
                                            parse_mode='Markdown'
                                        )
                                        print(f"🔔 Sent notification to referrer {referrer_telegram_id}")
                                        
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
• Level 2 referrals = 500 TAMA each!
• Milestone bonuses up to 100,000 TAMA!

🎮 *Game Features:*
• 🐾 Adopt & nurture NFT pets
• 🏆 Climb leaderboards
• 🎨 Mint unique pet NFTs
• 💎 Daily rewards & achievements

🚀 *Ready to start earning?*
                """
                
                keyboard = types.InlineKeyboardMarkup()
                keyboard.row(
                    types.InlineKeyboardButton("🔗 Get My Referral Link", callback_data="get_referral"),
                    types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats")
                )
                keyboard.row(
                    types.InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard"),
                    types.InlineKeyboardButton("⭐ Reviews & Feedback", url="https://t.me/gotchigamechat")
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
    
    welcome_text = f"""
🎮 *Welcome to Solana Tamagotchi!*

*The ultimate Play-to-Earn NFT pet game on Solana!*
🚀 *Currently in pre-launch phase - building our community!*

✨ *What you can do RIGHT NOW:*
• 🎁 **Daily Rewards** - Claim your daily TAMA! (Streak: {streak_days} days)
• 🎮 **Mini-Games** - Play and earn TAMA tokens!
• 🔗 **Referral Program** - 1,000 TAMA per friend!
• 🏅 **Badges & Ranks** - Collect achievements!
• 🎯 **Quests** - Complete challenges for bonuses!

💡 *Start earning TAMA today - no wallet needed!*
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
    daily_emoji = "🎁✨" if can_claim else "🎁"
    keyboard.row(
        types.InlineKeyboardButton(f"{daily_emoji} Daily Reward", callback_data="daily_reward")
    )
    
    # Row 2: NFT Menu (NEW!)
    keyboard.row(
        types.InlineKeyboardButton("🖼️ My NFTs", callback_data="my_nfts"),
        types.InlineKeyboardButton("🛒 Mint NFT", callback_data="mint_nft")
    )
    
    # Row 3: Withdrawal Button (NEW!)
    keyboard.row(
        types.InlineKeyboardButton("💰 Withdraw TAMA", callback_data="withdraw_tama")
    )
    
    # Row 4: Games & Referral
    keyboard.row(
        types.InlineKeyboardButton("🎮 Mini-Games", callback_data="mini_games"),
        types.InlineKeyboardButton("🔗 Referral", callback_data="get_referral")
    )
    
    # Row 5: Stats & Quests
    keyboard.row(
        types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats_detailed"),
        types.InlineKeyboardButton("🎯 Quests", callback_data="view_quests")
    )
    
    # Row 6: Badges & Rank
    keyboard.row(
        types.InlineKeyboardButton("🏅 Badges", callback_data="view_badges"),
        types.InlineKeyboardButton("⭐ My Rank", callback_data="view_rank")
    )
    
    # Row 7: Leaderboard only (Play Game moved to bottom menu)
    keyboard.row(
        types.InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard")
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

📈 *Overview:*
• Total Referrals: {total_refs}
• Active: {active_refs}
• Pending: {pending_refs}
• Total Earned: {total_earned} TAMA

📅 *Recent Referrals:*
{recent_text}

💡 *Tips:*
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
• ✅ Level 1 Direct: {level1_count + pending_count} ({level1_earned + (pending_count * 100)} TAMA)
• ✅ Level 2 Indirect: {level2_count} ({level2_earned} TAMA)
• 💰 Total Earned: {total_earned} TAMA

👛 *Wallet:*
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
1️⃣ Click the button below
2️⃣ Connect your Phantom wallet
3️⃣ Your progress will be automatically saved!
4️⃣ All pending referrals will be activated!

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

@bot.message_handler(commands=['link'], func=lambda message: message.chat.type == 'private')
def link_wallet(message):
    """Link wallet to Telegram account"""
    telegram_id = str(message.from_user.id)
    username = message.from_user.username or message.from_user.first_name
    
    try:
        response = supabase.table('leaderboard').select('wallet_address').eq('telegram_id', telegram_id).execute()
        
        if response.data and len(response.data) > 0:
            existing = response.data[0]
            text = f"""
✅ *Already Linked!*

👛 *Your Wallet:*
`{existing['wallet_address'][:8]}...{existing['wallet_address'][-8:]}`

🎮 *To link a different wallet:*
1. Go to the game
2. Connect your new wallet
3. Use /link again
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
📋 **WITHDRAWAL CONFIRMATION**

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

👛 *Wallet:* `{wallet_address[:8]}...{wallet_address[-8:]}`
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

*Make sure you've played the game first!* 🎯
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
    short_link = f"https://tr1h.github.io/solana-tamagotchi/s.html?ref={ref_code}&v=30"
    
    text = f"""
🔗 <b>Your Personal Referral Link:</b>

<code>{short_link}</code>

📊 <b>Your Stats:</b>
• 👥 Total Referrals: {total_referrals + pending_count}
• 💰 Total Earned: {total_earnings} TAMA

💰 <b>Earn instantly (NO WALLET NEEDED!):</b>
• 1,000 TAMA for each friend instantly!
• Just share your link and earn!
• TAMA accumulates in your account

🎁 <b>Milestone Bonuses:</b>
• 5 referrals → +1,000 TAMA
• 10 referrals → +3,000 TAMA
• 25 referrals → +10,000 TAMA
• 50 referrals → +30,000 TAMA
• 100 referrals → +100,000 TAMA + Legendary Badge!

📤 <b>Share with friends and start earning!</b>
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🎮 Visit Site", url=game_link),
        types.InlineKeyboardButton("📤 Share Link", url=f"https://t.me/share/url?url={short_link}&text=🎮 Join me in Solana Tamagotchi! Get 1,000 TAMA bonus! No wallet needed!")
    )
    keyboard.row(
        types.InlineKeyboardButton("📱 Get QR Code", callback_data=f"qr_{ref_code}")
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
🎯 *Your Referral Code:*

`{ref_code}`

✨ *How to use:*
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
<b>Multi-level referral system</b> (1,000+500 TAMA per friend!)
<b>Daily rewards & achievements</b> <i>(Coming Soon)</i>
<b>Community-driven gameplay</b>

🚀 <b>Get Started (Pre-Launch):</b>
<b>Get referral link:</b> Message @{BOT_USERNAME}
<b>Start earning TAMA:</b> Share your referral link now!
<b>Join waitlist:</b> <a href="https://tr1h.github.io/solana-tamagotchi/?v=6">Landing Page</a>
<b>Use /help</b> for bot commands

💰 <b>Earn TAMA Tokens:</b>
<b>1,000 TAMA</b> for each friend you refer
<b>500 TAMA</b> for Level 2 referrals
<b>Milestone bonuses</b> up to 100,000 TAMA!

📢 <b>Stay Updated:</b>
<b>Twitter:</b> @GotchiGame
<b>News:</b> @gotchigamechat  
<b>Bot:</b> @{BOT_USERNAME}
<b>Community:</b> This group!

🎯 <b>Community Rules:</b>
✅ Share referral achievements & screenshots
✅ Ask questions & get help
✅ Discuss referral strategies & tips
❌ No spam or offensive content
❌ No fake giveaways or scams

🏆 <b>Pre-Launch Leaderboard:</b>
Use `/leaderboard` in the bot to see top referrers!

🚀 <b>Coming Soon:</b>
<b>Game Launch:</b> Coming Soon
<b>NFT Minting:</b> After game launch
<b>Full Play-to-Earn:</b> Coming soon!

---

<i>Let's build the biggest Tamagotchi community on Solana!</i> ✨

<i>Start earning TAMA today - no wallet needed to begin!</i> 🚀"""
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Message Bot", url=f"https://t.me/{BOT_USERNAME}"),
        types.InlineKeyboardButton("📋 Join Waitlist", url="https://tr1h.github.io/solana-tamagotchi/?v=6")
    )
    keyboard.row(
        types.InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard"),
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

*Stay tuned for updates!* ✨
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get Referral Link", url=f"https://t.me/{BOT_USERNAME}"),
        types.InlineKeyboardButton("📋 Join Waitlist", url="https://tr1h.github.io/solana-tamagotchi/?v=6")
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

*Stay tuned for updates!* ✨
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get Referral Link", url=f"https://t.me/{BOT_USERNAME}"),
        types.InlineKeyboardButton("📋 Join Waitlist", url="https://tr1h.github.io/solana-tamagotchi/?v=6")
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
• Level 2 referrals: 500 TAMA each
• Milestone bonuses up to 100,000 TAMA\\!
• Daily rewards & achievements

*Start earning today\\!* 🚀"""
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("🤖 Get My Link", url=f"https://t.me/{BOT_USERNAME}"),
        types.InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard")
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
🏆 <b>Referral Leaderboard:</b>

<b>Top Referrers:</b>
{referral_text}

💡 <b>How to earn:</b>
• Share your referral link
• Get 1,000 TAMA per friend
• Milestone bonuses available!

🎯 <b>Get your link:</b> /ref
        """
        
        # Add interactive buttons
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔗 Get My Link", callback_data="get_referral")
        )
        
    except Exception as e:
        print(f"Error getting referral leaderboard: {e}")
        text = """
🏆 <b>Referral Leaderboard:</b>

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
            bot.reply_to(message, "🏆 No players yet! Be the first to play!\n\n🎮 Start playing: /game")
            return
        
        text = "🏆 <b>Top Players:</b>\n\n"
        
        for i, player in enumerate(response.data, 1):
            medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
            name = player.get('pet_name') or player.get('telegram_username') or f"Player #{player.get('telegram_id')}"
            level = player.get('level', 1)
            tama = player.get('tama', 0)
            
            text += f"{medal} {name} - Level {level} ({tama:,} TAMA)\n"
        
        text += "\n💡 <b>Play more to climb the leaderboard!</b>"
        
        # Add interactive buttons
        keyboard = types.InlineKeyboardMarkup()
        if message.chat.type in ['group', 'supergroup']:
            # In groups: deep link to private chat + fallback web URL
            keyboard.row(
                types.InlineKeyboardButton("🧩 Open in Telegram", url=f"https://t.me/{BOT_USERNAME}?start=play")
            )
            keyboard.row(
                types.InlineKeyboardButton("🌐 Open Web", url="https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html")
            )
        else:
            # In private: WebApp + web URL
            # Play Game shown via bottom menu button; omit duplicate inline button
            keyboard.row(
                types.InlineKeyboardButton("🌐 Open Web", url="https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html")
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

🎯 *How to Play:*
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
    bot.reply_to(message, f"🐾 **Total Pets Created:** {stats['pets']}\n\n✨ Mint yours: /mint", parse_mode='Markdown')

# TAMA Commands
@bot.message_handler(commands=['tama', 'balance'])
def show_tama_balance(message):
    """Показать баланс TAMA"""
    telegram_id = str(message.from_user.id)
    
    try:
        balance = get_tama_balance(telegram_id)
        
        text = f"""
💰 **TAMA Balance**

💎 **Your TAMA:** {format_tama_balance(balance)}

🎮 **Earn TAMA by:**
• Playing games (/games)
• Daily rewards (/daily)
• Referring friends (/ref)
• Completing quests (/quests)

💡 **Spend TAMA on:**
• NFT minting (/mint)
• Game upgrades
• Special items
        """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['earn'])
def earn_tama_info(message):
    """Показать способы заработка TAMA"""
    text = """
💰 **How to Earn TAMA**

🎮 **Games & Activities:**
• /daily - Daily rewards (up to 10,000 TAMA)
• /games - Mini-games (up to 1,500 TAMA/day)
• /quests - Complete quests for rewards

👥 **Referrals:**
• /ref - Get your referral code
• Invite friends to earn 1,000 TAMA each
• Earn bonuses for milestones

🏆 **Achievements:**
• Level up your pet
• Complete challenges
• Unlock special rewards

💡 **Pro tip:** Check /tama to see your current balance!
    """
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['spend'])
def spend_tama_info(message):
    """Показать способы траты TAMA"""
    text = """
💸 **How to Spend TAMA**

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

💡 **Check /tama to see your balance!**
    """
    bot.reply_to(message, text, parse_mode='Markdown')

@bot.message_handler(commands=['tama_leaderboard'])
def show_tama_leaderboard(message):
    """Показать лидерборд по TAMA"""
    try:
        response = supabase.table('leaderboard').select('telegram_id, telegram_username, tama').order('tama', desc=True).limit(10).execute()
        
        if response.data:
            text = "🏆 **TAMA Leaderboard**\n\n"
            
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
            
            text += "\n💡 **Earn more TAMA with /earn!**"
        else:
            text = "❌ **No players found**\n\n💡 **Be the first to earn TAMA!**"
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['tama_test'])
def test_tama_api(message):
    """Тестировать TAMA API (только для админов)"""
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

💡 **API is working correctly!**
            """
        else:
            text = f"""
❌ **TAMA API Test Failed**

🔗 **Status:** Disconnected
❌ **Error:** {result.get('error', 'Unknown error')}

💡 **Check API server status**
            """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        bot.reply_to(message, f"❌ Test error: {str(e)}")

# NFT Commands
@bot.message_handler(commands=['mint', 'nft'])
def mint_nft_command(message):
    """Минт NFT за TAMA"""
    telegram_id = str(message.from_user.id)
    
    try:
        # Получаем стоимость NFT
        costs = get_nft_costs()
        if not costs:
            bot.reply_to(message, "❌ Не удалось получить стоимость NFT")
            return
        
        # Создаем клавиатуру с выбором редкости
        markup = types.InlineKeyboardMarkup()
        for rarity, cost in costs.items():
            rarity_emoji = {
                'common': '⚪',
                'rare': '🔵', 
                'epic': '🟣',
                'legendary': '🟡'
            }.get(rarity, '⚪')
            
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

💡 Choose rarity to mint:"""
        
        bot.reply_to(message, text, reply_markup=markup)
        
    except Exception as e:
        bot.reply_to(message, f"❌ Error: {str(e)}")

@bot.message_handler(commands=['my_nfts', 'nfts'])
def show_user_nfts(message):
    """Показать NFT пользователя"""
    telegram_id = str(message.from_user.id)
    
    try:
        nfts = get_user_nfts(telegram_id)
        
        if not nfts:
            text = """📋 Your NFT Collection

🎨 No NFTs found

💡 Mint your first NFT with /mint!"""
        else:
            text = f"""📋 Your NFT Collection

🎨 Total NFTs: {len(nfts)}

"""
            
            for i, nft in enumerate(nfts[:10], 1):  # Показываем первые 10
                rarity_emoji = {
                    'common': '⚪',
                    'rare': '🔵',
                    'epic': '🟣', 
                    'legendary': '🟡'
                }.get(nft.get('rarity', 'common'), '⚪')
                
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
    """Показать стоимость NFT"""
    try:
        costs = get_nft_costs()
        if not costs:
            bot.reply_to(message, "❌ Не удалось получить стоимость NFT")
            return
        
        text = """💰 NFT Minting Costs

"""
        
        for rarity, cost in costs.items():
            rarity_emoji = {
                'common': '⚪',
                'rare': '🔵',
                'epic': '🟣',
                'legendary': '🟡'
            }.get(rarity, '⚪')
            
            rarity_name = rarity.title()
            
            cost_tama = cost.get('tama', 0)
            cost_sol = cost.get('sol', 0)
            text += f"""{rarity_emoji} {rarity_name}
• TAMA: {cost_tama:,}
• SOL: {cost_sol}

"""
        
        text += "\n💡 Use /mint to create your NFT!"
        
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
🏆 **Level:** {player.get('level', 1)}
📈 **XP:** {player.get('xp', 0):,}

💡 **Earn more TAMA with /earn!**
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

@bot.message_handler(commands=['tournament'])
def start_tournament(message):
    """Start weekly tournament - Admin only"""
    if not is_admin(message.from_user.id):
        bot.reply_to(message, "❌ Admin only")
        return
    
    try:
        tournament_text = """🏆 WEEKLY TOURNAMENT: Top 10 Tamagotchi Masters!

🎮 Tournament Rules:
• Compete for the highest TAMA score
• Tournament runs for 7 days
• Top 10 players win prizes!

🏆 PRIZES:
🥇 1st place: 10,000 TAMA + Legendary Pet
🥈 2nd place: 5,000 TAMA + Epic Pet  
🥉 3rd place: 3,000 TAMA + Rare Pet
4-10 places: 1,000 TAMA each

⏰ Tournament ends in 7 days!
🎯 Start playing now: @{BOT_USERNAME}

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
            """🐾 SOLANA TAMAGOTCHI - YOUR VIRTUAL PET! 🐾

🎮 What is it?
• Virtual pet in Telegram
• Earn TAMA tokens
• Mini-games and adventures
• Evolution and customization

💰 Earning:
• Clicks = TAMA tokens
• Mini-games = bonuses
• Referrals = 10% of income
• Daily rewards

🏆 Features:
• 5 pet types
• 5 mini-games
• Achievement system
• Leaderboard

🚀 START PLAYING RIGHT NOW!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#Solana #GameFi #Tamagotchi #Crypto #PlayToEarn""",

            # Post 2: Focus on earning (Day 2, 6, 10...)
            """💰 EARN TAMA TOKENS WHILE PLAYING! 💰

🎯 How to Earn:
• Click your pet = Instant TAMA!
• Play mini-games = Up to 500 TAMA!
• Daily rewards = Streak bonuses!
• Refer friends = 1,000 TAMA per friend!
• Complete quests = Extra bonuses!

📊 Referral Program:
• Level 1: 1,000 TAMA per friend
• Level 2: 500 TAMA per sub-referral
• Milestone bonuses up to 100,000 TAMA!

🎮 5 Mini-Games Available:
• Guess Number • Trivia Quiz
• Fortune Wheel • And more!

💎 Start earning NOW - no wallet needed!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#PlayToEarn #CryptoGame #TAMA #Solana""",

            # Post 3: Focus on referrals (Day 3, 7, 11...)
            """🔗 INVITE FRIENDS = EARN BIG! 🔗

🎁 Referral Rewards:
• 1,000 TAMA for each friend
• 500 TAMA for Level 2 referrals
• Unlimited earning potential!

🏆 Milestone Bonuses:
• 5 refs = +1,000 TAMA bonus
• 10 refs = +3,000 TAMA bonus
• 25 refs = +10,000 TAMA bonus
• 50 refs = +30,000 TAMA bonus
• 100 refs = +100,000 TAMA + Badge!

💡 Why Friends Love It:
✅ Free to start - no investment
✅ Fun pet game in Telegram
✅ Real earning opportunities
✅ Daily rewards & mini-games

📈 Top referrers earning 100,000+ TAMA!

🚀 Get your referral link now:
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#Referral #Crypto #PassiveIncome #Solana""",

            # Post 4: Focus on gameplay (Day 4, 8, 12...)
            """🎮 CHILDHOOD MEMORIES + CRYPTO = FUN! 🎮

🐾 Remember Tamagotchi? Now with earnings!

✨ Game Features:
• 5 Unique Pets - Cat, Dog, Dragon, Phoenix, Unicorn
• Pet Evolution - 10 stages from Baby to Legendary
• Vector Graphics - Beautiful animations
• Combo System - Click fast for bonuses!
• Emotions - Happy, Sad, Hungry, Angry, Surprised

🎯 Mini-Games:
• 🎲 Guess Number
• ❓ Solana Quiz
• 🎰 Fortune Wheel
• 🏁 Pet Race
• 🎯 Darts

🏆 Progression:
• Level up your pet
• Unlock achievements
• Climb the leaderboard
• Earn badges & ranks

💰 Everything earns you TAMA tokens!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#Gaming #NFT #Tamagotchi #Blockchain #Fun"""
        ]
        
        day_of_year = datetime.now().timetuple().tm_yday
        post_index = day_of_year % len(promo_posts)
        promo_text = promo_posts[post_index]
        
        # Send to YOU first to preview (without Markdown to avoid parsing errors)
        bot.send_message(message.chat.id, promo_text)
        bot.reply_to(message, f"📝 This is promo post #{post_index + 1} (today's post)\n\n✅ Copy and paste it to your group manually!")
        
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

🚨 **Security:**
• Suspicious Activities: {monitoring_stats['suspicious_activities']}
• Errors Count: {monitoring_stats['errors_count']}
• Requests This Minute: {requests_this_minute}

📈 **Activity:**
• Referrals Today: {monitoring_stats['referrals_today']}

🕐 **Last Updated:** {datetime.now().strftime("%H:%M:%S")}

💡 **Alerts:** Active monitoring enabled
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
            # Add TAMA reward
            tama_reward = min(reward_amount, 10000)  # Max 10,000 TAMA
            add_tama_reward(telegram_id, tama_reward, "daily_reward")
            
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

💰 **Награда:** +{reward_amount:,} TAMA
🔥 **Стрик:** {streak_days} дней подряд
📅 **Следующая:** через 24 часа{milestone_text}

💡 **Возвращайся каждый день для больших наград!**
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

🔥 **Current Streak:** {current_streak} дней
📅 **Вернись завтра** для следующей награды!

💡 **Не пропусти день, чтобы не сбросить стрик!**
            """
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error claiming daily reward: {e}")
        bot.reply_to(message, "❌ Ошибка при получении награды. Попробуй позже.")

@bot.message_handler(commands=['games'], func=lambda message: message.chat.type == 'private')
def show_games_menu(message):
    """Show mini-games menu"""
    telegram_id = str(message.from_user.id)
    
    try:
        can_play, games_played = mini_games.can_play(telegram_id)
        games_left = 3 - games_played
        
        text = f"""
🎮 **Мини-Игры**

💰 **Играй и зарабатывай TAMA!**

🎯 **Доступные игры:**
• Угадай Число (1-100) - до 500 TAMA
• Solana Викторина - 100 TAMA
• Колесо Фортуны - до 500 TAMA

📊 **Лимит:** {games_left}/3 игр осталось сегодня

💡 **Выбери игру:**
        """
        
        keyboard = types.InlineKeyboardMarkup()
        if can_play:
            keyboard.row(
                types.InlineKeyboardButton("🎯 Угадай Число", callback_data="game_guess"),
                types.InlineKeyboardButton("❓ Викторина", callback_data="game_trivia")
            )
            keyboard.row(
                types.InlineKeyboardButton("🎰 Колесо Фортуны", callback_data="game_wheel")
            )
        keyboard.row(
            types.InlineKeyboardButton("🔙 Назад", callback_data="back_to_menu")
        )
        
        bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
        
    except Exception as e:
        print(f"Error showing games: {e}")
        bot.reply_to(message, "❌ Ошибка загрузки игр")

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
🏅 **Your Badges**

{badges_text}

💡 **How to earn more:**
• 🐦 Early Bird - Be in first 100 users
• 🔥 Streak Master - 30 days streak
• 👑 Referral King - 50+ referrals
• 💎 Generous - 100+ referrals
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
        
        progress_bar = "▰" * (total_refs % 5) + "▱" * (5 - (total_refs % 5))
        
        text = f"""
{rank_data['emoji']} **Your Rank: {rank_data['name']}**

📊 **Stats:**
• Referrals: {total_refs}
• Progress: {progress_bar}
        """
        
        if next_rank:
            refs_needed = next_rank[1]['min_refs'] - total_refs
            text += f"""

🎯 **Next rank:** {next_rank[1]['name']}
📈 **Needed:** {refs_needed} referrals
        """
        else:
            text += "\n\n👑 **Maximum rank achieved!**"
        
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
        
        text = "🎯 **Referral Quests**\n\n"
        
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
        
        text += "💡 **Invite friends to complete quests!**"
        
        bot.reply_to(message, text, parse_mode='Markdown')
        
    except Exception as e:
        print(f"Error showing quests: {e}")
        bot.reply_to(message, "❌ Error loading quests")

# Welcome new members
@bot.message_handler(content_types=['new_chat_members'])
def welcome_new_member(message):
    for new_member in message.new_chat_members:
        welcome_text = f"""🎮 Welcome to Solana Tamagotchi Community, {new_member.first_name}!

🐾 What's this about?
<b>Play-to-Earn NFT pet game</b> on Solana blockchain <i>(Coming Soon!)</i>
<b>Mint unique pets</b> and earn TAMA tokens <i>(Pre-launch)</i>
<b>Multi-level referral system</b> (1,000+500 TAMA per friend!)
<b>Daily rewards & achievements</b> <i>(Coming Soon)</i>
<b>Community-driven gameplay</b>

🚀 Get Started (Pre-Launch):
<b>Get referral link:</b> Message @{BOT_USERNAME}
<b>Start earning TAMA:</b> Share your referral link now!
<b>Join waitlist:</b> <a href="https://tr1h.github.io/solana-tamagotchi/?v=6">Landing Page</a>
<b>Use /help</b> for bot commands

💰 Earn TAMA Tokens:
<b>1,000 TAMA</b> for each friend you refer
<b>500 TAMA</b> for Level 2 referrals
<b>Milestone bonuses</b> up to 100,000 TAMA!

📢 Stay Updated:
<b>Twitter:</b> @GotchiGame
<b>News:</b> @gotchigamechat
<b>Bot:</b> @{BOT_USERNAME}
<b>Community:</b> This group!

🚀 Coming Soon:
<b>Game Launch:</b> Coming Soon
<b>NFT Minting:</b> After game launch

Let's build the biggest Tamagotchi community on Solana! ✨

<i>Start earning TAMA today - no wallet needed to begin!</i> 🚀"""
        
        # Create welcome keyboard
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🤖 Message Bot", url=f"https://t.me/{BOT_USERNAME}"),
            types.InlineKeyboardButton("📋 Join Waitlist", url="https://tr1h.github.io/solana-tamagotchi/?v=6")
        )
        keyboard.row(
            types.InlineKeyboardButton("🏆 Leaderboard", callback_data="leaderboard"),
            types.InlineKeyboardButton("📊 My Stats", callback_data="my_stats")
        )
        keyboard.row(
            types.InlineKeyboardButton("🔗 Get Referral Link", callback_data="get_referral")
        )
        
        bot.send_message(message.chat.id, welcome_text, parse_mode='HTML', reply_markup=keyboard)

# Daily stats post
def post_daily_stats():
    try:
        stats = get_stats()
        stats_text = f"""📊 **Daily Statistics**

👥 Total Players: {stats['players']}
🐾 Total Pets: {stats['pets']}
💰 NFT Price: {stats['price']}

🎮 Play: Coming Soon!
✨ Mint: Coming Soon!

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
            """🐾 SOLANA TAMAGOTCHI - YOUR VIRTUAL PET! 🐾

🎮 What is it?
• Virtual pet in Telegram
• Earn TAMA tokens
• Mini-games and adventures
• Evolution and customization

💰 Earning:
• Clicks = TAMA tokens
• Mini-games = bonuses
• Referrals = 10% of income
• Daily rewards

🏆 Features:
• 5 pet types
• 5 mini-games
• Achievement system
• Leaderboard

🚀 START PLAYING RIGHT NOW!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#Solana #GameFi #Tamagotchi #Crypto #PlayToEarn""",

            # Post 2: Focus on earning (Day 2, 6, 10...)
            """💰 EARN TAMA TOKENS WHILE PLAYING! 💰

🎯 How to Earn:
• Click your pet = Instant TAMA!
• Play mini-games = Up to 500 TAMA!
• Daily rewards = Streak bonuses!
• Refer friends = 1,000 TAMA per friend!
• Complete quests = Extra bonuses!

📊 Referral Program:
• Level 1: 1,000 TAMA per friend
• Level 2: 500 TAMA per sub-referral
• Milestone bonuses up to 100,000 TAMA!

🎮 5 Mini-Games Available:
• Guess Number • Trivia Quiz
• Fortune Wheel • And more!

💎 Start earning NOW - no wallet needed!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#PlayToEarn #CryptoGame #TAMA #Solana""",

            # Post 3: Focus on referrals (Day 3, 7, 11...)
            """🔗 INVITE FRIENDS = EARN BIG! 🔗

🎁 Referral Rewards:
• 1,000 TAMA for each friend
• 500 TAMA for Level 2 referrals
• Unlimited earning potential!

🏆 Milestone Bonuses:
• 5 refs = +1,000 TAMA bonus
• 10 refs = +3,000 TAMA bonus
• 25 refs = +10,000 TAMA bonus
• 50 refs = +30,000 TAMA bonus
• 100 refs = +100,000 TAMA + Badge!

💡 Why Friends Love It:
✅ Free to start - no investment
✅ Fun pet game in Telegram
✅ Real earning opportunities
✅ Daily rewards & mini-games

📈 Top referrers earning 100,000+ TAMA!

🚀 Get your referral link now:
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

#Referral #Crypto #PassiveIncome #Solana""",

            # Post 4: Focus on gameplay (Day 4, 8, 12...)
            """🎮 CHILDHOOD MEMORIES + CRYPTO = FUN! 🎮

🐾 Remember Tamagotchi? Now with earnings!

✨ Game Features:
• 5 Unique Pets - Cat, Dog, Dragon, Phoenix, Unicorn
• Pet Evolution - 10 stages from Baby to Legendary
• Vector Graphics - Beautiful animations
• Combo System - Click fast for bonuses!
• Emotions - Happy, Sad, Hungry, Angry, Surprised

🎯 Mini-Games:
• 🎲 Guess Number
• ❓ Solana Quiz
• 🎰 Fortune Wheel
• 🏁 Pet Race
• 🎯 Darts

🏆 Progression:
• Level up your pet
• Unlock achievements
• Climb the leaderboard
• Earn badges & ranks

💰 Everything earns you TAMA tokens!
🤖 Bot: @{BOT_USERNAME}
📢 Channel: @GotchiGame
💬 Chat: @gotchigamechat

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
    schedule.every().day.at("12:00").do(post_daily_stats)
    schedule.every().day.at("14:00").do(post_daily_promo)  # Promo post at 2 PM
    
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
                current_tama = leaderboard.data[0].get('tama', 0)
                game_tama = game_data.get('tama', 0)
                
                # Calculate new TAMA (don't overwrite, add difference)
                if game_tama > current_tama:
                    tama_earned = game_tama - current_tama
                    
                    supabase.table('leaderboard').update({
                        'tama': game_tama,
                        'level': game_data.get('level', 1)
                    }).eq('telegram_id', telegram_id).execute()
                    
                    # Only show message for manual save (not auto-save)
                    if data.get('action') == 'save_game_state':
                        bot.reply_to(message, f"💾 Game saved!\n💰 Total TAMA: {game_tama:,}\n⭐ Level: {game_data.get('level', 1)}\n🎮 Total Clicks: {game_data.get('totalClicks', 0)}")
                else:
                    if data.get('action') == 'save_game_state':
                        bot.reply_to(message, f"💾 Progress saved!\n💰 TAMA: {current_tama:,}\n⭐ Level: {game_data.get('level', 1)}")
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
                    bot.reply_to(message, f"🎉 First save!\n💰 TAMA: {game_data.get('tama', 0):,}\n⭐ Level: {game_data.get('level', 1)}")
        
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
@bot.message_handler(func=lambda message: message.chat.type == 'private')
def echo_message(message):
    bot.reply_to(message, "Use /help to see available commands! 🚀")

# Callback handlers
@bot.callback_query_handler(func=lambda call: True)
def handle_callback(call):
    if call.data.startswith('mint_nft_'):
        # Обработка минта NFT
        try:
            rarity = call.data.replace('mint_nft_', '')
            telegram_id = str(call.from_user.id)
            
            # Проверяем баланс
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
            
            # Минтим NFT
            success, result = mint_nft(telegram_id, "", rarity)
            
            if success:
                nft_data = result.get('nft', {})
                new_balance = result.get('new_balance', balance)
                
                # Обновляем сообщение
                rarity_emoji = {
                    'common': '⚪',
                    'rare': '🔵',
                    'epic': '🟣',
                    'legendary': '🟡'
                }.get(rarity, '⚪')
                
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

💡 Check /my_nfts to see your collection!"""
                
                bot.edit_message_text(
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
        short_link = f"https://tr1h.github.io/solana-tamagotchi/s.html?ref={ref_code}&v=30"
        
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
🔗 <b>Your Personal Referral Link:</b>

<code>{short_link}</code>

📊 <b>Your Stats:</b>
• 👥 Total Referrals: {total_referrals + pending_count}
• 💰 Total Earned: {total_earnings} TAMA

💰 <b>Earn instantly (NO WALLET NEEDED!):</b>
• 1,000 TAMA for each friend instantly!
• Just share your link and earn!
• TAMA accumulates in your account

🎁 <b>Milestone Bonuses:</b>
• 5 referrals → +1,000 TAMA
• 10 referrals → +3,000 TAMA
• 25 referrals → +10,000 TAMA
• 50 referrals → +30,000 TAMA
• 100 referrals → +100,000 TAMA + Legendary Badge!

📤 <b>Share with friends and start earning!</b>
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🎮 Visit Site", url=short_link),
            types.InlineKeyboardButton("📤 Share Link", url=f"https://t.me/share/url?url={short_link}&text=🎮 Join me in Solana Tamagotchi! Get 1,000 TAMA bonus! No wallet needed!")
        )
        keyboard.row(
            types.InlineKeyboardButton("📱 Get QR Code", callback_data=f"qr_{ref_code}")
        )
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
        )
        
        try:
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='HTML', reply_markup=keyboard)
        except Exception as e:
            print(f"Error editing message: {e}")
            # Send new message if edit fails
            bot.send_message(call.message.chat.id, text, parse_mode='HTML', reply_markup=keyboard)
    
    elif call.data == "my_nfts":
        # Show user's NFT collection
        telegram_id = str(call.from_user.id)
        
        try:
            # Get user's NFTs from database
            response = supabase.table('user_nfts').select('*').eq('telegram_id', telegram_id).order('created_at', desc=True).execute()
            
            if response.data and len(response.data) > 0:
                nfts = response.data
                nft_list = "\n\n".join([
                    f"{i+1}. **{nft['pet_type'].upper()}** {get_rarity_emoji(nft['rarity'])}\n"
                    f"   • Rarity: {nft['rarity'].upper()}\n"
                    f"   • Earned: {nft.get('cost_tama', 0):,} TAMA"
                    for i, nft in enumerate(nfts[:10])  # Show max 10
                ])
                
                # Get user's TAMA balance
                leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
                
                text = f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 Total NFTs: **{len(nfts)}**
💰 TAMA Balance: **{tama_balance:,}**

{nft_list}

🎮 *NFT Benefits:*
• 💚 Common: +25% TAMA earning
• 💙 Rare: +50% TAMA earning
• 💜 Epic: +75% TAMA earning
• 🧡 Legendary: +100% TAMA earning

*Play the game to earn more with your NFTs!*
                """
            else:
                # No NFTs yet
                leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
                
                text = f"""
🖼️ **YOUR NFT COLLECTION** 🖼️

📦 You don't have any NFTs yet!

💰 Your TAMA Balance: **{tama_balance:,}**

💡 *How to get NFTs:*

**Option 1: TAMA MINT** 💰
• Cost: 5,000 TAMA
• Get: Common (70%) or Rare (30%)
• Bonus: +500 TAMA after mint

**Option 2: PREMIUM MINT** ✨
• Cost: 0.1 SOL
• Get: Epic (60%) or Legendary (40%)
• Bonus: +10,000 TAMA after mint

🎮 *Play the game to earn TAMA and mint your first NFT!*
                """
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🛒 Mint NFT", callback_data="mint_nft")
            )
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
            
            try:
                bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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
            # Get user's TAMA balance
            leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
            tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
            
            min_withdrawal = 1000
            fee_percent = 5
            can_withdraw = tama_balance >= min_withdrawal
            
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
🎯 Complete quests
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
                bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing withdrawal options: {e}")
            bot.answer_callback_query(call.id, "❌ Error loading withdrawal page")
    
    elif call.data == "enter_wallet":
        # Prompt user to enter wallet address
        text = """
💳 **ENTER YOUR SOLANA WALLET ADDRESS**

Please send your Solana wallet address (e.g., from Phantom).

**Format:** 44 characters, base58
**Example:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

⚠️ **Double-check your address!**
Wrong address = lost TAMA!

After sending your address, I'll ask for the amount.
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Cancel", callback_data="withdraw_tama")
        )
        
        try:
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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
            # Fetch from API
            response = requests.get(f"{TAMA_API_BASE}/withdrawal/history?telegram_id={telegram_id}")
            
            if response.status_code == 200:
                data = response.json()
                withdrawals = data.get('withdrawals', [])
                
                if not withdrawals:
                    text = """
📜 **WITHDRAWAL HISTORY** 📜

No withdrawals yet.

Make your first withdrawal to see history here!
                    """
                else:
                    text = "📜 **WITHDRAWAL HISTORY** 📜\n\n"
                    
                    for i, w in enumerate(withdrawals[:10], 1):
                        amount = w.get('amount_sent', 0)
                        fee = w.get('fee', 0)
                        status_emoji = "✅" if w.get('status') == 'completed' else "⏳"
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
                bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                    parse_mode='Markdown', reply_markup=keyboard)
            except:
                bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
        except Exception as e:
            print(f"Error showing withdrawal history: {e}")
            bot.answer_callback_query(call.id, "❌ Error loading history")
    
    elif call.data == "mint_nft":
        # Show mint options
        telegram_id = str(call.from_user.id)
        username = call.from_user.username or call.from_user.first_name
        
        try:
            # Get user's TAMA balance
            leaderboard_response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
            tama_balance = leaderboard_response.data[0].get('tama', 0) if leaderboard_response.data else 0
            
            tama_cost = 5000
            can_afford_tama = tama_balance >= tama_cost
            
            text = f"""
🛒 **MINT YOUR NFT PET** 🛒

Choose your mint type:

**💰 TAMA MINT**
• Cost: **5,000 TAMA**
• Your balance: **{tama_balance:,} TAMA**
• Get: Common (70%) / Rare (30%)
• Bonus: +500 TAMA after mint
{'' if can_afford_tama else '❌ *Not enough TAMA!*'}

**✨ PREMIUM SOL MINT**
• Cost: **0.1 SOL** (~$15-20)
• Get: Epic (60%) / Legendary (40%)  
• Bonus: +10,000 TAMA after mint
• VIP status: x2 TAMA earning

🎮 *NFT Benefits:*
All NFTs give you earning bonuses when playing!

💡 *Click the button below to mint!*
            """
            
            # Create mint URL with user data
            mint_url = f"https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id={telegram_id}&tama={tama_balance}"
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🎨 Open Mint Page", url=mint_url)
            )
            keyboard.row(
                types.InlineKeyboardButton("🖼️ My NFTs", callback_data="my_nfts"),
                types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
            )
            
            try:
                bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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
            # Call withdrawal API
            response = requests.post(f"{TAMA_API_BASE}/withdrawal/request", json={
                'telegram_id': telegram_id,
                'wallet_address': wallet_address,
                'amount': amount
            })
            
            if response.status_code == 200:
                data = response.json()
                withdrawal = data.get('withdrawal', {})
                
                amount_sent = withdrawal.get('amount_sent', 0)
                fee = withdrawal.get('fee', 0)
                tx_signature = withdrawal.get('transaction_signature')
                explorer_url = withdrawal.get('explorer_url')
                new_balance = withdrawal.get('new_balance', 0)
                
                text = f"""
✅ **WITHDRAWAL SUCCESSFUL!** ✅

💸 **Sent:** {amount_sent:,} TAMA
💰 **Fee:** {fee:,} TAMA
📊 **New Balance:** {new_balance:,} TAMA

🔗 **Transaction:**
[View on Explorer]({explorer_url})

⏱️ **Status:** Completed
✨ **TAMA is now in your wallet!**

Thank you for playing! 🎮
                """
                
                keyboard = types.InlineKeyboardMarkup()
                if explorer_url:
                    keyboard.row(
                        types.InlineKeyboardButton("🔍 View Transaction", url=explorer_url)
                    )
                keyboard.row(
                    types.InlineKeyboardButton("💰 Withdraw More", callback_data="withdraw_tama"),
                    types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
                )
                
                # Clear session
                del withdrawal_sessions[telegram_id]
                
                try:
                    bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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
                    bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                        parse_mode='Markdown', reply_markup=keyboard)
                except:
                    bot.send_message(call.message.chat.id, text, parse_mode='Markdown', reply_markup=keyboard)
                
        except Exception as e:
            print(f"Error processing withdrawal: {e}")
            bot.answer_callback_query(call.id, "❌ Error processing withdrawal")
    
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
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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

👛 <b>Wallet:</b>
• <code>{player['wallet_address'][:8]}...{player['wallet_address'][-8:]}</code>

🎯 <b>Your Referral Code:</b>
• <code>{player.get('referral_code', 'Generate with /ref')}</code>

<i>Keep playing and referring friends to earn more!</i> 🚀
                """
            else:
                # No wallet linked yet
                text = f"""
📊 <b>Your Personal Stats:</b>

❌ <b>No wallet linked yet!</b>

To start playing and tracking your stats:
1️⃣ Use /ref to get your personal link
2️⃣ Connect your Phantom wallet
3️⃣ Your progress will be automatically saved!

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
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
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
                    display_tama = tama_balance
                    referral_text += f"{medal} {name} - {total} referrals ({display_tama:,} TAMA)\n"
            else:
                referral_text = "No referrals yet!\n\n🔗 Start referring friends to climb the ranks!"
            
            text = f"""
🏆 <b>Referral Leaderboard:</b>

<b>Top Referrers:</b>
{referral_text}

💡 <b>How to earn:</b>
• Share your referral link
• Get 1,000 TAMA per friend
• Milestone bonuses available!

🎯 <b>Get your link:</b> /ref
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
🏆 <b>Referral Leaderboard:</b>

❌ <b>Error loading leaderboard</b>

Please try again later!
            """
            
            # Add back button
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
            )
        
        try:
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                                parse_mode='HTML', reply_markup=keyboard)
        except Exception as e:
            print(f"Error editing message: {e}")
            bot.send_message(call.message.chat.id, text, parse_mode='HTML', reply_markup=keyboard)
    
    elif call.data == "rules":
        text = """
📋 *Community Rules:*

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

🚫 *Violations result in:*
• Warning → Mute → Ban
• Severe violations = instant ban

💡 *Tips for better experience:*
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
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                            reply_markup=keyboard)
    
    elif call.data.startswith("qr_"):
        ref_code = call.data[3:]
        short_link = f"https://tr1h.github.io/solana-tamagotchi/s.html?ref={ref_code}&v=30"
        
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

💡 **Come back every day for bigger rewards!**
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

💡 **Don't miss a day to keep your streak!**
            """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "mini_games":
        # Show games menu
        telegram_id = str(call.from_user.id)
        can_play, games_played = mini_games.can_play(telegram_id)
        games_left = 3 - games_played
        
        text = f"""
🎮 **Mini-Games**

💰 **Play and earn TAMA!**

🎯 **Available games:**
• Guess Number (1-100) - up to 500 TAMA
• Solana Quiz - 100 TAMA
• Fortune Wheel - up to 500 TAMA

📊 **Limit:** {games_left}/3 games left today

💡 **Choose a game:**
        """
        
        keyboard = types.InlineKeyboardMarkup()
        if can_play:
            keyboard.row(
                types.InlineKeyboardButton("🎯 Guess Number", callback_data="game_guess"),
                types.InlineKeyboardButton("❓ Quiz", callback_data="game_trivia")
            )
            keyboard.row(
                types.InlineKeyboardButton("🎰 Fortune Wheel", callback_data="game_wheel")
            )
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "view_badges":
        # Show badges
        telegram_id = str(call.from_user.id)
        user_badges = badge_system.get_user_badges(telegram_id)
        
        if user_badges:
            badges_text = "\n".join([f"• {b['name']} - {b['desc']}" for b in user_badges])
        else:
            badges_text = "No badges yet. Play and invite friends!"
        
        text = f"""
🏅 **Your Badges**

{badges_text}

💡 **How to earn more:**
• 🐦 Early Bird - Be in first 100 users
• 🔥 Streak Master - 30 days streak
• 👑 Referral King - 50+ referrals
• 💎 Generous - 100+ referrals
• 🎮 Gamer - 100 mini-games
• 🍀 Lucky - Wheel jackpot
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
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
        
        progress_bar = "▰" * min(total_refs % 5, 5) + "▱" * max(5 - (total_refs % 5), 0)
        
        text = f"""
{rank_data['emoji']} **Your Rank: {rank_data['name']}**

📊 **Stats:**
• Referrals: {total_refs}
• Progress: {progress_bar}
        """
        
        if next_rank:
            refs_needed = next_rank[1]['min_refs'] - total_refs
            text += f"""

🎯 **Next rank:** {next_rank[1]['name']}
📈 **Needed:** {refs_needed} referrals
        """
        else:
            text += "\n\n👑 **Maximum rank achieved!**"
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data == "view_quests":
        # Show quests
        telegram_id = str(call.from_user.id)
        
        ref_response = supabase.table('referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        pending_response = supabase.table('pending_referrals').select('*', count='exact').eq('referrer_telegram_id', telegram_id).execute()
        
        total_refs = (ref_response.count or 0) + (pending_response.count or 0)
        quest_system.check_quests(telegram_id, total_refs)
        
        text = "🎯 **Referral Quests**\n\n"
        
        for quest_id, quest_data in QUESTS.items():
            progress = min(total_refs, quest_data['target'])
            
            if total_refs >= quest_data['target']:
                status = "✅"
            else:
                status = f"{progress}/{quest_data['target']}"
            
            text += f"{status} **{quest_data['name']}**\n"
            text += f"   {quest_data['desc']}\n"
            text += f"   Reward: {quest_data['reward']:,} TAMA\n\n"
        
        text += "💡 **Invite friends to complete quests!**"
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
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
{"▰" * min(total_refs % 10, 10)}{"▱" * max(10 - (total_refs % 10), 0)}

💡 **Keep playing and inviting friends!**
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔗 Referral", callback_data="get_referral"),
            types.InlineKeyboardButton("🎮 Games", callback_data="mini_games")
        )
        keyboard.row(types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu"))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    # ==================== GAME CALLBACKS ====================
    
    elif call.data == "game_guess":
        # Guess the number game
        telegram_id = str(call.from_user.id)
        can_play, games_played = mini_games.can_play(telegram_id)
        
        if not can_play:
            bot.answer_callback_query(call.id, "Daily game limit reached!")
            return
        
        text = """
🎯 **Guess Number (1-100)**

💰 **Rewards:**
• Exact match: 500 TAMA
• ±5: 200 TAMA  
• ±10: 100 TAMA
• ±20: 50 TAMA
• Other: 25 TAMA

**Enter number from 1 to 100:**
        """
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
        )
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
        
        # Set waiting state for number input
        bot.register_next_step_handler(call.message, process_guess_number)
    
    elif call.data == "game_trivia":
        # Trivia game
        telegram_id = str(call.from_user.id)
        can_play, games_played = mini_games.can_play(telegram_id)
        
        if not can_play:
            bot.answer_callback_query(call.id, "Daily game limit reached!")
            return
        
        # Random trivia question
        questions = [
            {
                "q": "What language is used for Solana smart contracts?",
                "options": ["Rust", "Python", "JavaScript", "Solidity"],
                "correct": "Rust"
            },
            {
                "q": "How many TPS can Solana handle?",
                "options": ["1,000", "10,000", "50,000+", "100"],
                "correct": "50,000+"
            },
            {
                "q": "Who is the creator of Solana?",
                "options": ["Anatoly Yakovenko", "Vitalik Buterin", "Changpeng Zhao", "Sam Bankman-Fried"],
                "correct": "Anatoly Yakovenko"
            },
            {
                "q": "What consensus does Solana use?",
                "options": ["Proof of Work", "Proof of Stake", "Proof of History + PoS", "Delegated PoS"],
                "correct": "Proof of History + PoS"
            },
        ]
        
        question = random.choice(questions)
        
        text = f"""
❓ **Solana Quiz**

**{question['q']}**

💰 **Reward:** 100 TAMA for correct answer
        """
        
        keyboard = types.InlineKeyboardMarkup()
        for option in question['options']:
            keyboard.row(
                types.InlineKeyboardButton(option, callback_data=f"trivia_{option}_{question['correct']}")
            )
        keyboard.row(
            types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
        )
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                            parse_mode='Markdown', reply_markup=keyboard)
    
    elif call.data.startswith("trivia_"):
        # Process trivia answer
        telegram_id = str(call.from_user.id)
        parts = call.data.split('_', 2)
        answer = parts[1]
        correct = parts[2] if len(parts) > 2 else ""
        
        success, reward, result_text = mini_games.play_trivia(telegram_id, answer, correct)
        
        if success:
            text = f"""
{result_text}

💰 **Earned:** +{reward} TAMA

Play again tomorrow! 🎮
            """
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
            )
            
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                                parse_mode='Markdown', reply_markup=keyboard)
        else:
            bot.answer_callback_query(call.id, result_text)
    
    elif call.data == "game_wheel":
        # Spin the wheel
        telegram_id = str(call.from_user.id)
        
        success, reward, result_text = mini_games.spin_wheel(telegram_id)
        
        if success:
            text = f"""
🎰 **Fortune Wheel**

{result_text}

💰 **Earned:** +{reward} TAMA

🎮 **Come back tomorrow for new games!**
            """
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔄 Spin Again", callback_data="game_wheel"),
                types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
            )
            
            bot.edit_message_text(text, call.message.chat.id, call.message.message_id,
                                parse_mode='Markdown', reply_markup=keyboard)
        else:
            bot.answer_callback_query(call.id, result_text)
    
    elif call.data == "back_to_menu":
        # Return to main menu
        send_welcome(call.message)

# Handler for guess number game
def process_guess_number(message):
    """Process guess number game input"""
    telegram_id = str(message.from_user.id)
    
    try:
        guess = int(message.text)
        if guess < 1 or guess > 100:
            bot.reply_to(message, "❌ Number must be from 1 to 100!")
            return
        
        success, reward, result_text = mini_games.play_guess_number(telegram_id, guess)
        
        if success:
            text = f"""
{result_text}

💰 **Earned:** +{reward} TAMA

🎮 **Come back tomorrow for new games!**
            """
            
            keyboard = types.InlineKeyboardMarkup()
            keyboard.row(
                types.InlineKeyboardButton("🔙 Menu", callback_data="back_to_menu")
            )
            
            bot.reply_to(message, text, parse_mode='Markdown', reply_markup=keyboard)
        else:
            bot.reply_to(message, f"❌ {result_text}")
            
    except ValueError:
        bot.reply_to(message, "❌ Enter number from 1 to 100!")

# Start bot
# Handler for WebApp data (game autosave)
@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    """Handle data sent from Telegram WebApp (game autosave)"""
    try:
        telegram_id = str(message.from_user.id)
        data = json.loads(message.web_app_data.data)
        
        logging.info(f"📥 Received WebApp data from user {telegram_id}: {data.get('action')}")
        
        if data.get('action') == 'auto_save':
            game_data = data.get('data', {})
            
            # Extract game state
            level = game_data.get('level', 1)
            tama = game_data.get('tama', 0)
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
            
            # Update in Supabase
            response = supabase.table('leaderboard').update({
                'tama': tama,
                'level': level,
                'pet_data': json.dumps(pet_data),
                'last_active': datetime.now().isoformat()
            }).eq('telegram_id', telegram_id).execute()
            
            logging.info(f"✅ Saved game data for user {telegram_id}: Level={level}, TAMA={tama}")
            
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

    # Infinite restart loop
    while True:
        try:
            # Skip webhook operations on PythonAnywhere (causes proxy errors)
            print("Starting polling (webhook disabled for PythonAnywhere)...")
            bot.infinity_polling(none_stop=True, interval=2, timeout=60)
        except KeyboardInterrupt:
            print("\nBot stopped by user")
            break
        except Exception as e:
            print(f"Bot error: {e}")
            print("Auto-restarting in 10 seconds...")
            time.sleep(10)
            print("Restarting now...")
