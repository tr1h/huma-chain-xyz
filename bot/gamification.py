"""
Gamification system for Solana Tamagotchi Bot
Provides daily rewards, mini-games, ranks, badges, and quests
"""

from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional

# Constants
BADGES = {
    'early_bird': {'name': 'Early Bird', 'desc': 'One of first 100 users'},
    'week_warrior': {'name': 'Week Warrior', 'desc': '7 days streak'},
    'streak_master': {'name': 'Streak Master', 'desc': '30 days streak'},
    'referral_king': {'name': 'Referral King', 'desc': '50+ referrals'},
    'generous': {'name': 'Generous', 'desc': '100+ referrals'},
    'gamer': {'name': 'Gamer', 'desc': '100 mini-games'},
    'lucky': {'name': 'Lucky', 'desc': 'Wheel jackpot'}
}

RANKS = {
    'rookie': {'name': 'Rookie', 'emoji': '🌱', 'min_refs': 0},
    'bronze': {'name': 'Bronze', 'emoji': '🥉', 'min_refs': 5},
    'silver': {'name': 'Silver', 'emoji': '🥈', 'min_refs': 10},
    'gold': {'name': 'Gold', 'emoji': '🥇', 'min_refs': 25},
    'platinum': {'name': 'Platinum', 'emoji': '💎', 'min_refs': 50},
    'diamond': {'name': 'Diamond', 'emoji': '💠', 'min_refs': 100}
}

QUESTS = {
    'first_ref': {'name': 'First Friend', 'desc': 'Invite 1 friend', 'target': 1, 'reward': 1000},
    'five_refs': {'name': 'Social Butterfly', 'desc': 'Invite 5 friends', 'target': 5, 'reward': 5000},
    'ten_refs': {'name': 'Influencer', 'desc': 'Invite 10 friends', 'target': 10, 'reward': 15000},
    'twenty_five_refs': {'name': 'Community Builder', 'desc': 'Invite 25 friends', 'target': 25, 'reward': 50000},
    'fifty_refs': {'name': 'Network Master', 'desc': 'Invite 50 friends', 'target': 50, 'reward': 150000}
}

ACHIEVEMENTS = {
    'first_click': {'name': 'First Click', 'desc': 'Click your pet first time'},
    'level_10': {'name': 'Level 10', 'desc': 'Reach level 10'},
    'level_50': {'name': 'Level 50', 'desc': 'Reach level 50'},
    'million_tama': {'name': 'Millionaire', 'desc': 'Earn 1M TAMA'}
}


class DailyRewards:
    """Daily reward system with streak tracking"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def claim_reward(self, telegram_id: str) -> Tuple[bool, int, int]:
        """Claim daily reward. Returns (success, streak_days, reward_amount)"""
        try:
            # Check last claim - try with last_daily_claim, fallback to other columns
            try:
                response = self.supabase.table('leaderboard').select('last_daily_claim, daily_streak').eq('telegram_id', telegram_id).execute()
            except Exception as col_error:
                # If column doesn't exist, try without it
                print(f"Column last_daily_claim not found, using alternative method: {col_error}")
                response = self.supabase.table('leaderboard').select('daily_streak').eq('telegram_id', telegram_id).execute()
                if response.data:
                    # Column doesn't exist, just give reward without streak tracking
                    reward = 1000
                    try:
                        self.supabase.table('leaderboard').update({
                            'daily_streak': 1
                        }).eq('telegram_id', telegram_id).execute()
                    except:
                        pass  # Ignore update errors if column doesn't exist
                    return True, 1, reward
                else:
                    return False, 0, 0
            
            if response.data:
                last_claim = response.data[0].get('last_daily_claim')
                current_streak = response.data[0].get('daily_streak', 0)
                
                if last_claim:
                    last_date = datetime.fromisoformat(last_claim.replace('Z', '+00:00'))
                    now = datetime.now(last_date.tzinfo) if last_date.tzinfo else datetime.now()
                    
                    if (now - last_date).days < 1:
                        return False, current_streak, 0
                    
                    # Check if streak continues
                    if (now - last_date).days == 1:
                        new_streak = current_streak + 1
                    else:
                        new_streak = 1
                else:
                    new_streak = 1
            else:
                new_streak = 1
            
            # Calculate reward (1000 + streak * 100, max 10000)
            reward = min(1000 + (new_streak * 100), 10000)
            
            # 💰 UPDATE TAMA BALANCE (FIX: награда не начислялась!)
            try:
                # Get current balance
                balance_response = self.supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                
                if balance_response.data and len(balance_response.data) > 0:
                    current_tama = balance_response.data[0].get('tama', 0) or 0
                    new_tama = current_tama + reward
                    
                    # Update balance and streak in one query
                    try:
                        self.supabase.table('leaderboard').update({
                            'tama': new_tama,
                            'last_daily_claim': datetime.now().isoformat(),
                            'daily_streak': new_streak
                        }).eq('telegram_id', telegram_id).execute()
                        print(f"💰 Daily Reward: Awarded {reward} TAMA to {telegram_id} (new balance: {new_tama}, streak: {new_streak})")
                    except Exception as update_error:
                        # If last_daily_claim column doesn't exist, update only balance and streak
                        print(f"Could not update last_daily_claim, updating only tama and daily_streak: {update_error}")
                        try:
                            self.supabase.table('leaderboard').update({
                                'tama': new_tama,
                                'daily_streak': new_streak
                            }).eq('telegram_id', telegram_id).execute()
                            print(f"💰 Daily Reward: Awarded {reward} TAMA to {telegram_id} (new balance: {new_tama}, streak: {new_streak})")
                        except:
                            pass
                else:
                    # User doesn't exist in leaderboard, create entry
                    try:
                        self.supabase.table('leaderboard').insert({
                            'telegram_id': telegram_id,
                            'tama': reward,
                            'daily_streak': new_streak,
                            'last_daily_claim': datetime.now().isoformat(),
                            'wallet_address': f'telegram_{telegram_id}'
                        }).execute()
                        print(f"💰 Daily Reward: Created user and awarded {reward} TAMA to {telegram_id} (streak: {new_streak})")
                    except Exception as insert_error:
                        # If last_daily_claim column doesn't exist
                        try:
                            self.supabase.table('leaderboard').insert({
                                'telegram_id': telegram_id,
                                'tama': reward,
                                'daily_streak': new_streak,
                                'wallet_address': f'telegram_{telegram_id}'
                            }).execute()
                            print(f"💰 Daily Reward: Created user and awarded {reward} TAMA to {telegram_id} (streak: {new_streak})")
                        except:
                            pass
            except Exception as tama_error:
                print(f"Error updating TAMA balance for daily reward: {tama_error}")
            
            return True, new_streak, reward
        except Exception as e:
            print(f"Error in claim_reward: {e}")
            return False, 0, 0
    
    def can_claim(self, telegram_id: str) -> Tuple[bool, int]:
        """Check if user can claim. Returns (can_claim, current_streak)"""
        try:
            try:
                response = self.supabase.table('leaderboard').select('last_daily_claim, daily_streak').eq('telegram_id', telegram_id).execute()
            except Exception as col_error:
                # If column doesn't exist, try without it
                response = self.supabase.table('leaderboard').select('daily_streak').eq('telegram_id', telegram_id).execute()
                if not response.data:
                    return True, 0
                return True, response.data[0].get('daily_streak', 0)
            
            if not response.data:
                return True, 0
            
            last_claim = response.data[0].get('last_daily_claim')
            current_streak = response.data[0].get('daily_streak', 0)
            
            if not last_claim:
                return True, 0
            
            last_date = datetime.fromisoformat(last_claim.replace('Z', '+00:00'))
            now = datetime.now(last_date.tzinfo) if last_date.tzinfo else datetime.now()
            
            if (now - last_date).days < 1:
                return False, current_streak
            
            return True, current_streak
        except Exception:
            return True, 0
    
    def get_streak(self, telegram_id: str) -> int:
        """Get current streak"""
        try:
            response = self.supabase.table('leaderboard').select('daily_streak').eq('telegram_id', telegram_id).execute()
            if response.data:
                return response.data[0].get('daily_streak', 0)
            return 0
        except Exception:
            return 0


class MiniGames:
    """Mini-games system (3 games per day)"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def can_play(self, telegram_id: str) -> Tuple[bool, int]:
        """Check if user can play. Returns (can_play, games_played_today)"""
        try:
            today = datetime.now().date().isoformat()
            response = self.supabase.table('game_limits').select('games_played').eq('telegram_id', telegram_id).eq('date', today).execute()
            
            if response.data:
                games_played = response.data[0].get('games_played', 0)
                return games_played < 3, games_played
            return True, 0
        except Exception:
            return True, 0
    
    def play_guess_number(self, telegram_id: str, guess: int) -> Tuple[bool, int, str]:
        """Play guess number game. Returns (success, reward, message)"""
        can_play, games_played = self.can_play(telegram_id)
        if not can_play:
            return False, 0, "Daily game limit reached!"
        
        import random
        target = random.randint(1, 100)
        diff = abs(guess - target)
        
        if diff == 0:
            reward = 500
            msg = "🎯 Exact match! Amazing!"
        elif diff <= 5:
            reward = 200
            msg = f"🎯 Very close! Target was {target}"
        elif diff <= 10:
            reward = 100
            msg = f"🎯 Close! Target was {target}"
        elif diff <= 20:
            reward = 50
            msg = f"🎯 Not bad! Target was {target}"
        else:
            reward = 25
            msg = f"🎯 Target was {target}"
        
        # Record game
        self._record_game(telegram_id, 'guess_number', reward)
        return True, reward, msg
    
    def play_trivia(self, telegram_id: str, answer: str, correct: str) -> Tuple[bool, int, str]:
        """Play trivia game"""
        can_play, _ = self.can_play(telegram_id)
        if not can_play:
            return False, 0, "Daily game limit reached!"
        
        if answer == correct:
            reward = 100
            msg = "✅ Correct answer!"
        else:
            reward = 0
            msg = f"❌ Wrong! Correct answer: {correct}"
        
        self._record_game(telegram_id, 'trivia', reward)
        return True, reward, msg
    
    def spin_wheel(self, telegram_id: str) -> Tuple[bool, int, str]:
        """Spin fortune wheel"""
        can_play, _ = self.can_play(telegram_id)
        if not can_play:
            return False, 0, "Daily game limit reached!"
        
        import random
        rewards = [0, 50, 100, 200, 300, 500]
        reward = random.choice(rewards)
        
        if reward == 500:
            msg = "🎰 JACKPOT! 500 TAMA!"
        elif reward > 0:
            msg = f"🎰 You won {reward} TAMA!"
        else:
            msg = "🎰 Better luck next time!"
        
        self._record_game(telegram_id, 'wheel', reward)
        return True, reward, msg
    
    def _record_game(self, telegram_id: str, game_type: str, reward: int):
        """Record game play and update TAMA balance"""
        try:
            today = datetime.now().date().isoformat()
            # Update game limits
            self.supabase.table('game_limits').upsert({
                'telegram_id': telegram_id,
                'date': today,
                'games_played': 1  # Will be incremented
            }, on_conflict='telegram_id,date').execute()
            
            # 💰 UPDATE TAMA BALANCE (FIX: награда не начислялась!)
            if reward > 0:
                try:
                    # Get current balance
                    response = self.supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
                    
                    if response.data and len(response.data) > 0:
                        current_tama = response.data[0].get('tama', 0) or 0
                        new_tama = current_tama + reward
                        
                        # Update balance
                        self.supabase.table('leaderboard').update({
                            'tama': new_tama
                        }).eq('telegram_id', telegram_id).execute()
                        
                        print(f"💰 {game_type}: Awarded {reward} TAMA to {telegram_id} (new balance: {new_tama})")
                    else:
                        # User doesn't exist in leaderboard, create entry
                        self.supabase.table('leaderboard').insert({
                            'telegram_id': telegram_id,
                            'tama': reward,
                            'wallet_address': f'telegram_{telegram_id}'
                        }).execute()
                        print(f"💰 {game_type}: Created user and awarded {reward} TAMA to {telegram_id}")
                        
                except Exception as tama_error:
                    print(f"Error updating TAMA balance: {tama_error}")
                    
        except Exception as e:
            print(f"Error recording game: {e}")


class RankSystem:
    """Rank system based on referrals"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def update_rank(self, telegram_id: str, total_refs: int) -> Tuple[bool, str, Dict]:
        """Update user rank. Returns (changed, rank_id, rank_data)"""
        try:
            current_rank = self.get_user_rank(telegram_id)[0]
            new_rank = self._calculate_rank(total_refs)
            
            if new_rank != current_rank:
                self.supabase.table('user_ranks').upsert({
                    'telegram_id': telegram_id,
                    'rank_id': new_rank,
                    'updated_at': datetime.now().isoformat()
                }, on_conflict='telegram_id').execute()
                return True, new_rank, RANKS[new_rank]
            return False, current_rank, RANKS[current_rank]
        except Exception:
            return False, 'rookie', RANKS['rookie']
    
    def get_user_rank(self, telegram_id: str) -> Tuple[str, Dict]:
        """Get user rank"""
        try:
            response = self.supabase.table('user_ranks').select('rank_id').eq('telegram_id', telegram_id).execute()
            if response.data:
                rank_id = response.data[0].get('rank_id', 'rookie')
                return rank_id, RANKS.get(rank_id, RANKS['rookie'])
            return 'rookie', RANKS['rookie']
        except Exception:
            return 'rookie', RANKS['rookie']
    
    def _calculate_rank(self, refs: int) -> str:
        """Calculate rank based on referrals"""
        if refs >= 100:
            return 'diamond'
        elif refs >= 50:
            return 'platinum'
        elif refs >= 25:
            return 'gold'
        elif refs >= 10:
            return 'silver'
        elif refs >= 5:
            return 'bronze'
        return 'rookie'


class BadgeSystem:
    """Badge system for achievements"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def award_badge(self, telegram_id: str, badge_id: str):
        """Award a badge to user"""
        try:
            self.supabase.table('user_badges').upsert({
                'telegram_id': telegram_id,
                'badge_id': badge_id,
                'earned_at': datetime.now().isoformat()
            }, on_conflict='telegram_id,badge_id').execute()
        except Exception as e:
            print(f"Error awarding badge: {e}")
    
    def get_user_badges(self, telegram_id: str) -> List[Dict]:
        """Get user badges"""
        try:
            response = self.supabase.table('user_badges').select('badge_id').eq('telegram_id', telegram_id).execute()
            badges = []
            for item in response.data:
                badge_id = item.get('badge_id')
                if badge_id in BADGES:
                    badges.append(BADGES[badge_id])
            return badges
        except Exception:
            return []


class QuestSystem:
    """Quest system"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def check_quests(self, telegram_id: str, total_refs: int):
        """Check and complete quests"""
        try:
            for quest_id, quest_data in QUESTS.items():
                if total_refs >= quest_data['target']:
                    # Check if already completed
                    response = self.supabase.table('user_quests').select('completed').eq('telegram_id', telegram_id).eq('quest_id', quest_id).execute()
                    if not response.data or not response.data[0].get('completed'):
                        # Mark as completed
                        self.supabase.table('user_quests').upsert({
                            'telegram_id': telegram_id,
                            'quest_id': quest_id,
                            'completed': True,
                            'completed_at': datetime.now().isoformat()
                        }, on_conflict='telegram_id,quest_id').execute()
        except Exception as e:
            print(f"Error checking quests: {e}")


