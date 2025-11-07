"""
NFT System for Solana Tamagotchi Bot
Handles NFT ownership verification and earning multipliers
"""

from typing import Tuple, Optional, Dict
import random

# Rarity multipliers for each tier
RARITY_MULTIPLIERS = {
    'Bronze': {
        'Common': 2.0,
        'Uncommon': 2.2,
        'Rare': 2.5,
        'Epic': 2.8,
        'Legendary': 3.0
    },
    'Silver': {
        'Common': 2.5,
        'Uncommon': 2.7,
        'Rare': 3.0,
        'Epic': 3.3,
        'Legendary': 3.5
    },
    'Gold': {
        'Common': 3.0,
        'Uncommon': 3.2,
        'Rare': 3.5,
        'Epic': 3.8,
        'Legendary': 4.0
    }
}

class NFTSystem:
    """NFT ownership and multiplier system"""
    
    def __init__(self, supabase):
        self.supabase = supabase
    
    def get_user_multiplier(self, telegram_id: str) -> float:
        """
        Get user's active NFT earning multiplier
        Returns 1.0 if no NFT, otherwise 2.0-4.0x based on tier and rarity
        """
        try:
            # Use SQL function for performance
            response = self.supabase.rpc('get_user_nft_multiplier', {
                'user_telegram_id': telegram_id
            }).execute()
            
            if response.data:
                multiplier = float(response.data)
                return multiplier
            
            # Fallback: query directly
            response = self.supabase.table('user_nfts').select('earning_multiplier').eq('telegram_id', telegram_id).eq('is_active', True).order('earning_multiplier', desc=True).limit(1).execute()
            
            if response.data and len(response.data) > 0:
                return float(response.data[0]['earning_multiplier'])
            
            return 1.0  # No NFT = 1x (normal earning)
            
        except Exception as e:
            print(f"Error getting NFT multiplier for {telegram_id}: {e}")
            return 1.0  # Default to 1x on error
    
    def register_nft_mint(self, telegram_id: str, nft_mint_address: str, tier_name: str, rarity: str) -> Tuple[bool, str, float]:
        """
        Register a new NFT mint for a user
        Returns (success, message, multiplier)
        """
        try:
            # Get multiplier for this tier+rarity
            multiplier = RARITY_MULTIPLIERS.get(tier_name, {}).get(rarity, 2.0)
            
            # Insert NFT record
            response = self.supabase.table('user_nfts').insert({
                'telegram_id': telegram_id,
                'nft_mint_address': nft_mint_address,
                'tier_name': tier_name,
                'rarity': rarity,
                'earning_multiplier': multiplier,
                'is_active': True
            }).execute()
            
            if response.data:
                rarity_emoji = self._get_rarity_emoji(rarity)
                tier_emoji = self._get_tier_emoji(tier_name)
                return True, f"✅ NFT Registered!\n\n{tier_emoji} Tier: {tier_name}\n{rarity_emoji} Rarity: {rarity}\n💰 Earning Boost: {multiplier}x\n\nYour earnings are now {multiplier}x higher!", multiplier
            else:
                return False, "❌ Error registering NFT", 1.0
                
        except Exception as e:
            error_msg = str(e)
            if 'duplicate key' in error_msg.lower():
                return False, "❌ This NFT is already registered!", 1.0
            print(f"Error registering NFT mint: {e}")
            return False, f"❌ Error: {error_msg}", 1.0
    
    def get_user_nfts(self, telegram_id: str) -> list:
        """Get all user's NFTs"""
        try:
            response = self.supabase.table('user_nfts').select('*').eq('telegram_id', telegram_id).eq('is_active', True).order('earning_multiplier', desc=True).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error getting user NFTs: {e}")
            return []
    
    def assign_random_rarity(self, tier_name: str) -> str:
        """
        Assign random rarity based on tier's probability distribution
        """
        try:
            # Get rarity chances from database
            response = self.supabase.table('nft_tiers').select('rarity_chances').eq('tier_name', tier_name).execute()
            
            if response.data and len(response.data) > 0:
                chances = response.data[0]['rarity_chances']
                
                # Create weighted list
                rarities = []
                for rarity, weight in chances.items():
                    rarities.extend([rarity] * int(weight))
                
                return random.choice(rarities)
            
        except Exception as e:
            print(f"Error assigning rarity: {e}")
        
        # Fallback to Bronze chances
        rarities = ['Common'] * 50 + ['Uncommon'] * 30 + ['Rare'] * 15 + ['Epic'] * 4 + ['Legendary'] * 1
        return random.choice(rarities)
    
    def get_tier_prices(self) -> Dict:
        """Get current tier prices"""
        try:
            response = self.supabase.table('nft_tiers').select('*').execute()
            if response.data:
                prices = {}
                for tier in response.data:
                    prices[tier['tier_name']] = {
                        'tama': tier['tama_price'],
                        'sol': tier['sol_price'],
                        'multiplier': tier['base_multiplier']
                    }
                return prices
        except Exception as e:
            print(f"Error getting tier prices: {e}")
        
        # Fallback defaults
        return {
            'Bronze': {'tama': 2500, 'sol': 0.05, 'multiplier': 2.0},
            'Silver': {'tama': 5000, 'sol': 0.1, 'multiplier': 2.5},
            'Gold': {'tama': 10000, 'sol': 0.2, 'multiplier': 3.0}
        }
    
    def _get_rarity_emoji(self, rarity: str) -> str:
        """Get emoji for rarity"""
        emojis = {
            'Common': '⚪',
            'Uncommon': '🟢',
            'Rare': '🔵',
            'Epic': '🟣',
            'Legendary': '🟠'
        }
        return emojis.get(rarity, '⚪')
    
    def _get_tier_emoji(self, tier: str) -> str:
        """Get emoji for tier"""
        emojis = {
            'Bronze': '🥉',
            'Silver': '🥈',
            'Gold': '🥇'
        }
        return emojis.get(tier, '🎁')
    
    def format_nft_display(self, nft_data: dict) -> str:
        """Format NFT for display"""
        tier_emoji = self._get_tier_emoji(nft_data['tier_name'])
        rarity_emoji = self._get_rarity_emoji(nft_data['rarity'])
        
        return f"{tier_emoji} **{nft_data['tier_name']}** {rarity_emoji} {nft_data['rarity']} ({nft_data['earning_multiplier']}x)"

