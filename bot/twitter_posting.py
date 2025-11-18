"""
Автоматический постинг в Twitter (X)
Based on CONTENT_PLAN.md schedule
"""

import tweepy
import random
import logging
import os
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TwitterPoster:
    def __init__(self):
        """Initialize Twitter API client"""
        # Twitter API v2 credentials
        self.api_key = os.getenv('TWITTER_API_KEY')
        self.api_secret = os.getenv('TWITTER_API_SECRET')
        self.access_token = os.getenv('TWITTER_ACCESS_TOKEN')
        self.access_secret = os.getenv('TWITTER_ACCESS_SECRET')
        self.bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
        
        # Check if credentials are available
        if not all([self.api_key, self.api_secret, self.access_token, self.access_secret]):
            logger.warning("⚠️ Twitter API credentials not found. Auto-posting disabled.")
            self.client = None
            return
        
        # Initialize Twitter API v2 client
        try:
            self.client = tweepy.Client(
                bearer_token=self.bearer_token,
                consumer_key=self.api_key,
                consumer_secret=self.api_secret,
                access_token=self.access_token,
                access_token_secret=self.access_secret
            )
            logger.info("✅ Twitter API initialized")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Twitter API: {e}")
            self.client = None
    
    def post_tweet(self, text):
        """Post a tweet"""
        if not self.client:
            logger.warning("⚠️ Twitter client not initialized. Skipping post.")
            return False
        
        try:
            # Twitter has 280 character limit
            if len(text) > 280:
                logger.warning(f"⚠️ Tweet too long ({len(text)} chars). Truncating...")
                text = text[:277] + "..."
            
            response = self.client.create_tweet(text=text)
            logger.info(f"✅ Posted to Twitter: {response.data['id']}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to post to Twitter: {e}")
            return False
    
    def post_thread(self, tweets):
        """Post a thread of tweets"""
        if not self.client:
            logger.warning("⚠️ Twitter client not initialized. Skipping thread.")
            return False
        
        try:
            previous_tweet_id = None
            for tweet_text in tweets:
                if len(tweet_text) > 280:
                    tweet_text = tweet_text[:277] + "..."
                
                response = self.client.create_tweet(
                    text=tweet_text,
                    in_reply_to_tweet_id=previous_tweet_id
                )
                previous_tweet_id = response.data['id']
                logger.info(f"✅ Posted tweet in thread: {previous_tweet_id}")
            
            return True
        except Exception as e:
            logger.error(f"❌ Failed to post thread: {e}")
            return False
    
    # ==================== MONDAY - Motivation Monday ====================
    
    def post_monday_gm(self):
        """Утренний мотивационный пост (понедельник)"""
        posts = [
            "GM frens! 🌅\n\nSolana Tamagotchi is LIVE on Devnet! 🔗\n\n🔥 2,000 $TAMA burned every NFT mint\n💰 Real SPL token distribution\n🎨 Metaplex-powered NFTs\n\nWho's minting today? 👇\n\n#SolanaNFT #P2E #CryptoCommunity #SOL",
            
            "GM Solana fam! 🌞\n\nStart your week right! 🚀\n\n✨ Play Solana Tamagotchi\n✨ Earn real $TAMA tokens\n✨ Mint unique NFTs\n\nAll 100% on-chain! 🔗\n\nPlay: https://t.me/GotchiGameBot\n\n#Solana #Web3Gaming #P2E",
            
            "GM! Ready for a productive week? 💪\n\nSolana Tamagotchi:\n🎮 FREE to start\n💰 Earn $TAMA by playing\n🎨 Mint NFTs with TAMA\n🔥 Auto burn on every mint\n\nStart earning: https://t.me/GotchiGameBot\n\n#Solana #PlayToEarn"
        ]
        self.post_tweet(random.choice(posts))
    
    def post_monday_stats(self):
        """Еженедельная статистика (понедельник день)"""
        text = "📊 WEEKLY STATS 📈\n\n"
        text += "This week:\n"
        text += "🎨 NFTs Minted: 🔥\n"
        text += "🔥 TAMA Burned: 💎\n"
        text += "👥 New Players: 🚀\n"
        text += "💰 Total Volume: ✨\n\n"
        text += "All on-chain. All transparent. ✅\n\n"
        text += "#Stats #Solana #P2E"
        self.post_tweet(text)
    
    # ==================== TUESDAY - Tech Tuesday ====================
    
    def post_tuesday_tokenomics(self):
        """Объяснение токеномики (вторник)"""
        text = "💎 TOKENOMICS EXPLAINED 💎\n\n"
        text += "When you mint NFT with TAMA:\n\n"
        text += "🔥 40% → Burn (reduces supply)\n"
        text += "💰 30% → Treasury (development)\n"
        text += "🎮 30% → P2E Pool (rewards)\n\n"
        text += "Every mint increases value! 📈\n\n"
        text += "#Tokenomics #Transparency #Solana"
        self.post_tweet(text)
    
    def post_tuesday_onchain_proof(self):
        """On-chain доказательства (вторник день)"""
        text = "🔗 ON-CHAIN TRANSPARENCY ✅\n\n"
        text += "Every NFT mint is 100% on-chain:\n\n"
        text += "✅ TAMA transfers → Solana blockchain\n"
        text += "✅ NFT creation → Metaplex\n"
        text += "✅ All transactions → Public\n\n"
        text += "No trust needed. Just code. 💎\n\n"
        text += "#OnChain #Transparency #Solana"
        self.post_tweet(text)
    
    # ==================== WEDNESDAY - Community Wednesday ====================
    
    def post_wednesday_community(self):
        """Community highlight (среда)"""
        text = "👥 COMMUNITY SPOTLIGHT 🌟\n\n"
        text += "Shoutout to our amazing players! 🎉\n\n"
        text += "Top achievements this week:\n"
        text += "🎨 Most NFTs minted\n"
        text += "💰 Highest TAMA earned\n"
        text += "🔥 Most TAMA burned\n\n"
        text += "Join us: https://t.me/GotchiGameBot\n\n"
        text += "#Community #P2E #Solana"
        self.post_tweet(text)
    
    def post_wednesday_nft_showcase(self):
        """NFT витрина (среда день)"""
        text = "🎨 NFT SHOWCASE ✨\n\n"
        text += "Bronze NFT Collection\n"
        text += "Theme: Baby Creatures 🐾\n\n"
        text += "💰 Price: 5,000 TAMA\n"
        text += "🔥 40% burned\n"
        text += "💎 30% treasury\n"
        text += "🎮 30% P2E pool\n\n"
        text += "Mint: https://solanatamagotchi.com/mint.html\n\n"
        text += "#SolanaNFT #P2E"
        self.post_tweet(text)
    
    # ==================== THURSDAY - Throwback Thursday ====================
    
    def post_thursday_progress(self):
        """История и прогресс (четверг)"""
        text = "📸 PROJECT PROGRESS 🚀\n\n"
        text += "3 months of building! 💪\n\n"
        text += "✅ Full on-chain integration\n"
        text += "✅ Transparent tokenomics\n"
        text += "✅ Growing community\n\n"
        text += "Next: Mainnet Q1 2026 🎯\n\n"
        text += "Join: https://t.me/GotchiGameBot\n\n"
        text += "#Progress #Solana #Web3"
        self.post_tweet(text)
    
    # ==================== FRIDAY - Feature Friday ====================
    
    def post_friday_feature(self):
        """Новые фичи (пятница)"""
        features = [
            "🚀 NEW FEATURE! ✨\n\nJust added:\n✅ Treasury Monitor (real-time)\n✅ On-chain transaction history\n✅ Explorer links for all txs\n\nTry: https://solanatamagotchi.com/treasury-monitor.html\n\n#Solana #Web3 #Transparency",
            
            "✨ FEATURE UPDATE ✨\n\nNew:\n✅ Auto-link Phantom to Telegram\n✅ NFT collection by wallet\n✅ Enhanced tracking\n\nPlay: https://t.me/GotchiGameBot\n\n#Update #Solana #Gaming",
            
            "🎉 WHAT'S NEW 🎉\n\nLatest:\n✅ Real-time TAMA updates\n✅ Improved NFT minting\n✅ Better error handling\n\nStart: https://t.me/GotchiGameBot\n\n#NewFeatures #Solana #P2E"
        ]
        self.post_tweet(random.choice(features))
    
    # ==================== SATURDAY - Showcase Saturday ====================
    
    def post_saturday_showcase(self):
        """NFT showcase (суббота)"""
        text = "🎨 SATURDAY SHOWCASE 🎨\n\n"
        text += "Bronze NFTs:\n"
        text += "• Baby Creatures theme 🐾\n"
        text += "• ×2.0 TAMA boost\n"
        text += "• +50 TAMA/day passive\n"
        text += "• 100% on-chain 🔗\n\n"
        text += "Mint: https://solanatamagotchi.com/mint.html\n\n"
        text += "#NFT #Solana #Art"
        self.post_tweet(text)
    
    # ==================== SUNDAY - Sunday Stats ====================
    
    def post_sunday_weekly_report(self):
        """Недельный отчёт (воскресенье)"""
        text = "📊 WEEKLY REPORT 📊\n\n"
        text += "Another great week! 🎉\n\n"
        text += "🎮 Active Players: ⬆️\n"
        text += "🎨 NFTs Minted: ⬆️\n"
        text += "🔥 TAMA Burned: ⬆️\n"
        text += "💰 Treasury: Growing\n\n"
        text += "Next week: More features! ✨\n\n"
        text += "#WeeklyReport #Solana #P2E"
        self.post_tweet(text)
    
    # ==================== TUTORIAL THREAD ====================
    
    def post_tutorial_thread(self):
        """Обучающий тред (как играть)"""
        tweets = [
            "📚 HOW TO PLAY (Thread) 🧵\n\n1/5 Getting Started:\n\nOpen @GotchiGameBot in Telegram\nStart playing (FREE!)\nEarn TAMA by clicking, feeding, playing\n\n#Tutorial #P2E #Solana",
            
            "2/5 Earning TAMA:\n\n💰 Click your pet = +TAMA\n💰 Complete quests = +TAMA\n💰 Daily rewards = +TAMA\n\nNo investment needed!",
            
            "3/5 Minting NFT:\n\n🎨 Save 5,000 TAMA\n🎨 Go to mint page\n🎨 Choose Bronze NFT\n\nMint: https://solanatamagotchi.com/mint.html",
            
            "4/5 Tokenomics:\n\n🔥 40% → Burn (reduces supply)\n💰 30% → Treasury (dev)\n🎮 30% → P2E Pool (rewards)\n\nEvery mint helps everyone!",
            
            "5/5 Benefits:\n\n✅ ×2.0 earning boost\n✅ +50 TAMA/day passive\n✅ Real on-chain NFT\n\nStart now: https://t.me/GotchiGameBot\n\n#Solana #PlayToEarn 🚀"
        ]
        self.post_thread(tweets)
    
    # ==================== CALL TO ACTION ====================
    
    def post_call_to_action(self):
        """Призыв к действию"""
        ctas = [
            "🎮 Ready to start earning? 💰\n\nSolana Tamagotchi:\n✅ 100% Free to start\n✅ Play in Telegram\n✅ Earn real $TAMA\n✅ Mint unique NFTs\n\nStart: https://t.me/GotchiGameBot\n\n#Solana #P2E #Free",
            
            "💎 Why Solana Tamagotchi?\n\n✨ Nostalgic gameplay\n✨ Modern tokenomics\n✨ 100% on-chain\n✨ Real passive income\n\nJoin: https://t.me/GotchiGameBot\n\n#Web3Gaming #Solana",
            
            "🚀 Start Your P2E Journey!\n\nNo investment needed!\n\n1. Play 🎮\n2. Earn $TAMA 💰\n3. Mint NFTs 🎨\n4. Get passive income 💎\n\n100% on-chain!\n\nhttps://t.me/GotchiGameBot\n\n#PlayToEarn #Solana"
        ]
        self.post_tweet(random.choice(ctas))


def setup_twitter_posting():
    """Настроить расписание автопостинга для Twitter"""
    import schedule
    
    poster = TwitterPoster()
    
    if not poster.client:
        logger.warning("⚠️ Twitter auto-posting disabled (no API credentials)")
        return None
    
    # ==================== MONDAY - Motivation Monday ====================
    schedule.every().monday.at("09:00").do(poster.post_monday_gm)
    schedule.every().monday.at("14:00").do(poster.post_monday_stats)
    
    # ==================== TUESDAY - Tech Tuesday ====================
    schedule.every().tuesday.at("09:00").do(poster.post_tuesday_tokenomics)
    schedule.every().tuesday.at("14:00").do(poster.post_tuesday_onchain_proof)
    schedule.every().tuesday.at("20:00").do(poster.post_call_to_action)
    
    # ==================== WEDNESDAY - Community Wednesday ====================
    schedule.every().wednesday.at("09:00").do(poster.post_wednesday_community)
    schedule.every().wednesday.at("14:00").do(poster.post_wednesday_nft_showcase)
    
    # ==================== THURSDAY - Throwback Thursday ====================
    schedule.every().thursday.at("09:00").do(poster.post_thursday_progress)
    schedule.every().thursday.at("20:00").do(poster.post_tutorial_thread)
    
    # ==================== FRIDAY - Feature Friday ====================
    schedule.every().friday.at("09:00").do(poster.post_friday_feature)
    schedule.every().friday.at("20:00").do(poster.post_call_to_action)
    
    # ==================== SATURDAY - Showcase Saturday ====================
    schedule.every().saturday.at("10:00").do(poster.post_saturday_showcase)
    
    # ==================== SUNDAY - Sunday Stats ====================
    schedule.every().sunday.at("10:00").do(poster.post_sunday_weekly_report)
    schedule.every().sunday.at("18:00").do(poster.post_call_to_action)
    
    logger.info("✅ Twitter auto-posting schedule configured")
    logger.info("📅 Tweets will be posted automatically")
    
    return poster

