"""
Автоматический постинг контента в Telegram канал
Based on CONTENT_PLAN.md schedule
"""

import random
from datetime import datetime
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutoPoster:
    def __init__(self, bot, channel_username):
        self.bot = bot
        self.channel = channel_username

    def post_to_channel(self, text, photo_url=None, parse_mode='Markdown'):
        """Опубликовать пост в канал"""
        try:
            if photo_url:
                self.bot.send_photo(
                    self.channel,
                    photo=photo_url,
                    caption=text,
                    parse_mode=parse_mode
                )
            else:
                self.bot.send_message(
                    self.channel,
                    text,
                    parse_mode=parse_mode,
                    disable_web_page_preview=False
                )
            logger.info(f"✅ Posted to {self.channel}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to post to {self.channel}: {e}")
            return False

    # ==================== MONDAY - Motivation Monday ====================

    def post_monday_gm(self):
        """Утренний мотивационный пост (понедельник)"""
        posts = [
            "🌅 GM Gotchi Fam!\n\n💰 **New week, new TAMA to earn!**\n\nThis week's highlights:\n• 🎰 Lucky Slots - Jackpot pool GROWING! Try x100 win!\n• 🎡 Lucky Wheel - Spin for massive multipliers!\n• 🎁 Daily rewards with streak bonuses\n• 🔗 Invite friends = 1,000 TAMA each\n• 🏆 Compete on leaderboards\n\n**Start playing NOW!** → @GotchiGameBot 🐾\n\n#GotchiGame #PlayToEarn #SolanaNFT #MondayMotivation",

            "GM Solana fam! 🌞\n\nStart your week with BIG WINS! 🚀\n\n✨ Lucky Slots - Shared Jackpot Pool!\n✨ Lucky Wheel - Up to 50x multiplier!\n✨ Provably Fair - Every spin verified!\n✨ Connect Wallet - Play with Solana!\n✨ FREE to play - No wallet needed!\n\nAll 100% transparent! 🔗\n\nPlay now: @GotchiGameBot\n\n#Solana #Web3Gaming #P2E #LuckySlots",

            "GM! Ready for a productive week? 💪\n\nSolana Tamagotchi offers:\n🎰 Lucky Slots with x100 Jackpot!\n🎡 Lucky Wheel with 50x multiplier!\n🎮 Tamagotchi clicker game\n💰 Earn real $TAMA tokens\n🎨 Mint NFTs for 2x-5x boost\n💳 Wallet support (Phantom/Solflare)\n🔥 Provably Fair system\n\nStart earning today! 👇\nhttps://t.me/GotchiGameBot\n\n#Solana #PlayToEarn #CryptoGaming"
        ]
        self.post_to_channel(random.choice(posts))

    def post_monday_stats(self):
        """Еженедельная статистика (понедельник день)"""
        text = "📊 WEEKLY STATS 📈\n\n"
        text += "This week:\n"
        text += "🎨 NFTs Minted: 🔥\n"
        text += "🔥 TAMA Burned: 💎\n"
        text += "👥 New Players: 🚀\n"
        text += "💰 Total Volume: ✨\n\n"
        text += "All on-chain. All transparent. ✅\n\n"
        text += "View live: https://solanatamagotchi.com/treasury-monitor.html\n\n"
        text += "#Stats #Solana #P2E"
        self.post_to_channel(text)

    def post_monday_sneak_peek(self):
        """Sneak peek новых фич (понедельник вечер)"""
        peeks = [
            "👀 SNEAK PEEK 👀\n\nSomething big is coming this week...\n\n🎨 New NFT designs?\n💰 Enhanced rewards?\n🚀 Mainnet prep?\n\nStay tuned! 👇\n\n#SneakPeek #Solana #ComingSoon",

            "🔮 THIS WEEK... 🔮\n\nWe're cooking something special! 🔥\n\nHint: It involves more ways to earn $TAMA 💰\n\nGuess what it is? 👇\n\n#Solana #P2E #Update",

            "⚡ WEEKLY ROADMAP ⚡\n\nThis week we're working on:\n✅ Bug fixes\n✅ Performance improvements\n✅ New features testing\n\nMore details coming soon! 🚀\n\n#Development #Solana #Transparent"
        ]
        self.post_to_channel(random.choice(peeks))

    # ==================== TUESDAY - Tech Tuesday ====================

    def post_tuesday_tokenomics(self):
        """Объяснение токеномики (вторник)"""
        text = "📊 **Tech Tuesday: TAMA Tokenomics**\n\n"
        text += "Understanding $TAMA token:\n\n"
        text += "💰 **How to earn TAMA:**\n"
        text += "• 🎰 Lucky Slots - Jackpot up to x100!\n"
        text += "• 🎡 Lucky Wheel - Spin for 50x multiplier!\n"
        text += "• 🐾 Tamagotchi - Click & earn daily!\n"
        text += "• 🔗 Referrals - 1,000 TAMA per friend!\n"
        text += "• 🎁 Daily Rewards - Streak bonuses!\n\n"
        text += "🔥 **Token utility:**\n"
        text += "• Play all games with TAMA\n"
        text += "• Mint NFT pets (boost earnings 2x-5x!)\n"
        text += "• 💳 Connect wallet - play with Solana!\n"
        text += "• Withdraw to wallet ✅\n\n"
        text += "**Start earning TODAY!** → @GotchiGameBot 🚀\n\n"
        text += "#Tokenomics #TAMA #GotchiGame #Solana"
        self.post_to_channel(text)

    def post_tuesday_onchain_proof(self):
        """On-chain доказательства (вторник день)"""
        text = "🔗 ON-CHAIN TRANSPARENCY ✅\n\n"
        text += "Every NFT mint is 100% on-chain:\n\n"
        text += "✅ TAMA transfers → Solana blockchain\n"
        text += "✅ NFT creation → Metaplex\n"
        text += "✅ Metadata storage → Arweave (not IPFS!)\n"
        text += "✅ Images verified → Solscan ✅\n"
        text += "✅ All transactions → Public explorer\n\n"
        text += "No trust needed. Just code. 💎\n\n"
        text += "View proof:\n"
        text += "https://solanatamagotchi.com/treasury-monitor.html\n\n"
        text += "#OnChain #Transparency #Solana #Arweave"
        self.post_to_channel(text)

    # ==================== WEDNESDAY - Community Wednesday ====================

    def post_wednesday_community(self):
        """Community highlight (среда)"""
        text = "👥 COMMUNITY SPOTLIGHT 🌟\n\n"
        text += "Shoutout to all our amazing players! 🎉\n\n"
        text += "This week's top achievements:\n"
        text += "🎨 Most NFTs minted\n"
        text += "💰 Highest TAMA earned\n"
        text += "🔥 Most TAMA burned\n\n"
        text += "Want to see your name here?\n"
        text += "Play now: https://t.me/GotchiGameBot\n\n"
        text += "#Community #P2E #Solana"
        self.post_to_channel(text)

    def post_wednesday_nft_showcase(self):
        """NFT витрина (среда день)"""
        text = "🎨 NFT SHOWCASE ✨\n\n"
        text += "Bronze NFT Collection\n"
        text += "Theme: Baby Creatures 🐾\n"
        text += "Rarity: Common - Legendary\n\n"
        text += "💰 Mint Price: 5,000 TAMA or 0.05 SOL\n"
        text += "🔥 Burn: 2,000 TAMA (40%)\n"
        text += "💎 Treasury: 1,500 TAMA (30%)\n"
        text += "🎮 P2E Pool: 1,500 TAMA (30%)\n\n"
        text += "🛒 Trade on Marketplace:\n"
        text += "Buy/Sell with TAMA OR SOL!\n\n"
        text += "Mint: https://solanatamagotchi.com/mint.html\n"
        text += "Marketplace: https://solanatamagotchi.com/marketplace.html\n\n"
        text += "#SolanaNFT #Tamagotchi #P2E #Marketplace"
        self.post_to_channel(text)

    # ==================== THURSDAY - Throwback Thursday ====================

    def post_thursday_progress(self):
        """История и прогресс (четверг)"""
        text = "📸 PROJECT PROGRESS 🚀\n\n"
        text += "We've come a long way! 💪\n\n"
        text += "✅ 3 months of development\n"
        text += "✅ Full on-chain integration\n"
        text += "✅ NFT Marketplace (dual payment!)\n"
        text += "✅ Zero wallet barrier\n"
        text += "✅ Arweave metadata storage\n"
        text += "✅ Solscan verification\n"
        text += "✅ Colosseum ETERNAL participation\n"
        text += "✅ Transparent tokenomics\n"
        text += "✅ Growing community\n\n"
        text += "What's next?\n"
        text += "🎯 Mainnet launch Q1 2026\n"
        text += "🎯 Enhanced marketplace\n"
        text += "🎯 More NFT tiers\n"
        text += "🎯 Partnerships\n\n"
        text += "Join the journey! 👇\n"
        text += "https://t.me/GotchiGameBot\n\n"
        text += "#Progress #Solana #Web3 #Colosseum"
        self.post_to_channel(text)

    # ==================== FRIDAY - Feature Friday ====================

    def post_friday_feature(self):
        """Новые фичи (пятница)"""
        features = [
            "🚀 NFT MARKETPLACE IS LIVE! ✨\n\nWe just launched:\n✅ Buy/Sell NFTs with TAMA OR SOL\n✅ First P2E game with dual payment!\n✅ Real on-chain transactions\n✅ Arweave metadata storage\n✅ Images verified on Solscan\n\nTry it now:\nhttps://solanatamagotchi.com/marketplace.html\n\n#Solana #Marketplace #P2E #DualPayment",

            "✨ ZERO WALLET BARRIER ✨\n\nRevolutionary feature:\n✅ Play INSTANTLY - no wallet needed!\n✅ Earn TAMA first\n✅ Connect wallet when ready\n✅ Seamless experience\n\nThis is mass adoption! 🚀\n\nPlay now: https://t.me/GotchiGameBot\n\n#ZeroWalletBarrier #MassAdoption #Solana",

            "🎉 COLOSSEUM ETERNAL 🎉\n\nWe're participating in Colosseum hackathon!\n✅ Building in public\n✅ Week 3 update coming\n✅ Real product, real traction\n\nWatch us build:\nhttps://arena.colosseum.org/projects/explore/solana-tamagotchi-ultimate-play-to-earn-nft-pet-game\n\n#Colosseum #Hackathon #Solana #BuildInPublic"
        ]
        self.post_to_channel(random.choice(features))

    # ==================== SATURDAY - Showcase Saturday ====================

    def post_saturday_showcase(self):
        """NFT showcase (суббота)"""
        text = "🎨 SATURDAY SHOWCASE 🎨\n\n"
        text += "Check out our NFT collection! ✨\n\n"
        text += "🟫 Bronze Tier: 5,000 TAMA\n"
        text += "  • Baby Creatures theme\n"
        text += "  • ×2.0 TAMA earning boost\n"
        text += "  • +50 TAMA/day passive income\n\n"
        text += "Every NFT is unique and 100% on-chain! 🔗\n\n"
        text += "Mint yours:\n"
        text += "https://solanatamagotchi.com/mint.html\n\n"
        text += "#NFT #Solana #Art"
        self.post_to_channel(text)

    # ==================== SUNDAY - Sunday Stats ====================

    def post_sunday_weekly_report(self):
        """Недельный отчёт (воскресенье)"""
        text = "📊 WEEKLY REPORT 📊\n\n"
        text += "Another great week! 🎉\n\n"
        text += "Highlights:\n"
        text += "🎮 Active Players: Growing!\n"
        text += "🎨 NFTs Minted: More every day\n"
        text += "🔥 TAMA Burned: Reducing supply\n"
        text += "💰 Treasury: Funding development\n\n"
        text += "Next week plans:\n"
        text += "✨ Continue development\n"
        text += "✨ Community events\n"
        text += "✨ New features\n\n"
        text += "View stats:\n"
        text += "https://solanatamagotchi.com/treasury-monitor.html\n\n"
        text += "#WeeklyReport #Solana #P2E"
        self.post_to_channel(text)

    # ==================== EVERGREEN POSTS ====================

    def post_tutorial_thread(self):
        """Как играть (обучающий пост)"""
        text = "📚 HOW TO PLAY 🎮\n\n"
        text += "Getting Started (ZERO WALLET BARRIER!):\n\n"
        text += "1️⃣ Open @GotchiGameBot in Telegram\n"
        text += "2️⃣ Start playing INSTANTLY (no wallet!)\n"
        text += "3️⃣ Earn TAMA by clicking, feeding, playing\n\n"
        text += "Earning TAMA:\n"
        text += "💰 Click your pet = +TAMA\n"
        text += "💰 Complete quests = +TAMA\n"
        text += "💰 Daily rewards = +TAMA\n\n"
        text += "Minting NFT:\n"
        text += "🎨 Save 5,000 TAMA (or use 0.05 SOL)\n"
        text += "🎨 Go to mint page\n"
        text += "🎨 Choose Bronze NFT\n\n"
        text += "Trading NFTs:\n"
        text += "🛒 Buy/Sell on Marketplace\n"
        text += "🛒 Use TAMA OR SOL\n"
        text += "🛒 First P2E game with dual payment!\n\n"
        text += "Benefits:\n"
        text += "✅ ×2.0 earning boost\n"
        text += "✅ +50 TAMA/day passive income\n"
        text += "✅ Real on-chain NFT (Arweave)\n"
        text += "✅ Verified on Solscan\n\n"
        text += "Start now: https://t.me/GotchiGameBot\n"
        text += "Marketplace: https://solanatamagotchi.com/marketplace.html\n\n"
        text += "#Tutorial #P2E #Solana #ZeroWalletBarrier"
        self.post_to_channel(text)

    def post_burn_report(self):
        """Отчёт о сожжённых токенах"""
        text = "📊 BURN REPORT 🔥\n\n"
        text += "This week we burned:\n"
        text += "🔥 TAMA tokens\n"
        text += "💰 Added to Treasury\n"
        text += "🎮 Added to P2E Pool\n\n"
        text += "Total burned to date: 🚀\n\n"
        text += "Every burn = less supply = more value 💎\n\n"
        text += "View on-chain:\n"
        text += "https://solanatamagotchi.com/treasury-monitor.html\n\n"
        text += "#TAMABurn #Tokenomics #Solana"
        self.post_to_channel(text)

    def post_call_to_action(self):
        """Призыв к действию"""
        ctas = [
            "🎮 Ready to start earning? 💰\n\nSolana Tamagotchi is:\n✅ 100% Free to start\n✅ ZERO wallet barrier - play instantly!\n✅ Play in Telegram\n✅ Earn real $TAMA tokens\n✅ Mint unique NFTs\n✅ Trade on Marketplace (TAMA + SOL)\n\nStart now: https://t.me/GotchiGameBot\nMarketplace: https://solanatamagotchi.com/marketplace.html\n\n#Solana #P2E #Free #ZeroWalletBarrier",

            "💎 Why Solana Tamagotchi? 💎\n\n✨ ZERO wallet barrier - play first!\n✨ NFT Marketplace with dual payment\n✨ Nostalgic Tamagotchi gameplay\n✨ Modern blockchain tokenomics\n✨ 100% on-chain (Arweave + Solscan)\n✨ Real passive income from NFTs\n\nJoin us: https://t.me/GotchiGameBot\n\n#Web3Gaming #Solana #Marketplace",

            "🚀 Start Your P2E Journey! 🚀\n\nNo investment needed! No wallet needed!\n\n1. Play the game 🎮 (instant start!)\n2. Earn $TAMA 💰\n3. Mint NFTs 🎨 (TAMA or SOL)\n4. Trade on Marketplace 🛒 (TAMA + SOL)\n5. Get passive income 💎\n\nAll 100% on-chain!\n\nhttps://t.me/GotchiGameBot\n\n#PlayToEarn #Solana #ZeroWalletBarrier"
        ]
        self.post_to_channel(random.choice(ctas))

    def post_transparency_reminder(self):
        """Напоминание о прозрачности"""
        text = "🔗 TRANSPARENCY MATTERS 🔗\n\n"
        text += "Everything in Solana Tamagotchi is on-chain:\n\n"
        text += "✅ Every TAMA transfer\n"
        text += "✅ Every NFT mint\n"
        text += "✅ Every burn transaction\n"
        text += "✅ Treasury balance\n"
        text += "✅ P2E Pool balance\n\n"
        text += "Don't trust. Verify! ✅\n\n"
        text += "View all transactions:\n"
        text += "https://solanatamagotchi.com/treasury-monitor.html\n\n"
        text += "#Transparency #OnChain #Solana"
        self.post_to_channel(text)


def setup_auto_posting(bot, channel_username):
    """Настроить расписание автопостинга"""
    import schedule

    poster = AutoPoster(bot, channel_username)

    # ==================== MONDAY - Motivation Monday ====================
    schedule.every().monday.at("09:00").do(poster.post_monday_gm)
    schedule.every().monday.at("14:00").do(poster.post_monday_stats)
    schedule.every().monday.at("20:00").do(poster.post_monday_sneak_peek)

    # ==================== TUESDAY - Tech Tuesday ====================
    schedule.every().tuesday.at("09:00").do(poster.post_tuesday_tokenomics)
    schedule.every().tuesday.at("14:00").do(poster.post_tuesday_onchain_proof)
    schedule.every().tuesday.at("20:00").do(poster.post_call_to_action)

    # ==================== WEDNESDAY - Community Wednesday ====================
    schedule.every().wednesday.at("09:00").do(poster.post_wednesday_community)
    schedule.every().wednesday.at("14:00").do(poster.post_wednesday_nft_showcase)
    schedule.every().wednesday.at("20:00").do(poster.post_transparency_reminder)

    # ==================== THURSDAY - Throwback Thursday ====================
    schedule.every().thursday.at("09:00").do(poster.post_thursday_progress)
    schedule.every().thursday.at("14:00").do(poster.post_call_to_action)
    schedule.every().thursday.at("20:00").do(poster.post_tutorial_thread)

    # ==================== FRIDAY - Feature Friday ====================
    schedule.every().friday.at("09:00").do(poster.post_friday_feature)
    schedule.every().friday.at("14:00").do(poster.post_burn_report)
    schedule.every().friday.at("20:00").do(poster.post_call_to_action)

    # ==================== SATURDAY - Showcase Saturday ====================
    schedule.every().saturday.at("10:00").do(poster.post_saturday_showcase)
    schedule.every().saturday.at("18:00").do(poster.post_transparency_reminder)

    # ==================== SUNDAY - Sunday Stats ====================
    schedule.every().sunday.at("10:00").do(poster.post_sunday_weekly_report)
    schedule.every().sunday.at("18:00").do(poster.post_call_to_action)

    logger.info("✅ Auto-posting schedule configured")
    logger.info("📅 Posts will be published automatically according to CONTENT_PLAN.md")

    return poster












