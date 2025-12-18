"""
🔧 @Developer: Автоматическая система аналитики для Telegram бота

Собирает данные из Supabase и отправляет отчёты админу
Не нужно вручную заполнять SQL - всё автоматически!
"""

import os
from datetime import datetime, timedelta
from supabase import create_client, Client
from typing import Dict, List, Any, Optional
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalyticsCollector:
    """Собирает и анализирует данные из Supabase"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """Инициализация с подключением к Supabase"""
        try:
            self.supabase: Client = create_client(supabase_url, supabase_key)
            logger.info("✅ Analytics connected to Supabase")
        except Exception as e:
            logger.error(f"❌ Failed to connect to Supabase: {e}")
            raise
    
    # =====================================
    # PLAYER METRICS
    # =====================================
    
    def get_player_stats(self) -> Dict[str, Any]:
        """Получить статистику игроков"""
        try:
            # Всего игроков
            total = self.supabase.table('users').select('*', count='exact').execute()
            
            # Новых за 24 часа
            yesterday = (datetime.now() - timedelta(days=1)).isoformat()
            new_24h = self.supabase.table('users')\
                .select('*', count='exact')\
                .gte('created_at', yesterday)\
                .execute()
            
            # Новых за 7 дней
            week_ago = (datetime.now() - timedelta(days=7)).isoformat()
            new_7d = self.supabase.table('users')\
                .select('*', count='exact')\
                .gte('created_at', week_ago)\
                .execute()
            
            # Средний уровень
            users = self.supabase.table('users')\
                .select('level')\
                .execute()
            
            avg_level = 0
            max_level = 0
            if users.data:
                levels = [u['level'] for u in users.data if u.get('level')]
                avg_level = sum(levels) / len(levels) if levels else 0
                max_level = max(levels) if levels else 0
            
            return {
                'total': total.count,
                'new_24h': new_24h.count,
                'new_7d': new_7d.count,
                'avg_level': round(avg_level, 1),
                'max_level': max_level
            }
        except Exception as e:
            logger.error(f"❌ Error getting player stats: {e}")
            return {
                'total': 0,
                'new_24h': 0,
                'new_7d': 0,
                'avg_level': 0,
                'max_level': 0
            }
    
    def get_active_users(self) -> Dict[str, int]:
        """Получить количество активных пользователей"""
        try:
            # DAU (Daily Active Users)
            yesterday = (datetime.now() - timedelta(days=1)).isoformat()
            dau = self.supabase.table('transactions')\
                .select('user_id', count='exact')\
                .gte('created_at', yesterday)\
                .execute()
            
            # WAU (Weekly Active Users)
            week_ago = (datetime.now() - timedelta(days=7)).isoformat()
            wau = self.supabase.table('transactions')\
                .select('user_id', count='exact')\
                .gte('created_at', week_ago)\
                .execute()
            
            # MAU (Monthly Active Users)
            month_ago = (datetime.now() - timedelta(days=30)).isoformat()
            mau = self.supabase.table('transactions')\
                .select('user_id', count='exact')\
                .gte('created_at', month_ago)\
                .execute()
            
            return {
                'dau': len(set([t['user_id'] for t in dau.data])) if dau.data else 0,
                'wau': len(set([t['user_id'] for t in wau.data])) if wau.data else 0,
                'mau': len(set([t['user_id'] for t in mau.data])) if mau.data else 0
            }
        except Exception as e:
            logger.error(f"❌ Error getting active users: {e}")
            return {'dau': 0, 'wau': 0, 'mau': 0}
    
    # =====================================
    # ECONOMY METRICS
    # =====================================
    
    def get_tama_economy(self) -> Dict[str, Any]:
        """Получить статистику TAMA экономики"""
        try:
            # Получить все балансы
            users = self.supabase.table('users')\
                .select('tama_balance')\
                .execute()
            
            if not users.data:
                return {
                    'circulating': 0,
                    'avg_balance': 0,
                    'top10_percentage': 0
                }
            
            balances = [u['tama_balance'] for u in users.data if u.get('tama_balance')]
            
            # Циркулирующий supply
            circulating = sum(balances)
            
            # Средний баланс
            avg_balance = circulating / len(balances) if balances else 0
            
            # Концентрация top 10
            sorted_balances = sorted(balances, reverse=True)
            top10_sum = sum(sorted_balances[:10])
            top10_percentage = (top10_sum / circulating * 100) if circulating > 0 else 0
            
            return {
                'circulating': int(circulating),
                'avg_balance': int(avg_balance),
                'top10_percentage': round(top10_percentage, 1)
            }
        except Exception as e:
            logger.error(f"❌ Error getting TAMA economy: {e}")
            return {
                'circulating': 0,
                'avg_balance': 0,
                'top10_percentage': 0
            }
    
    def get_burn_mint_ratio(self, days: int = 7) -> Dict[str, Any]:
        """Получить Burn/Mint статистику"""
        try:
            start_date = (datetime.now() - timedelta(days=days)).isoformat()
            
            # Получить транзакции
            transactions = self.supabase.table('transactions')\
                .select('type, amount')\
                .gte('created_at', start_date)\
                .execute()
            
            if not transactions.data:
                return {
                    'burned': 0,
                    'minted': 0,
                    'ratio': 0,
                    'status': '🟡'
                }
            
            # Подсчитать burn и mint
            burned = sum([
                t['amount'] for t in transactions.data 
                if t.get('type') in ['burn', 'nft_burn', 'withdrawal_fee']
            ])
            
            minted = sum([
                t['amount'] for t in transactions.data 
                if t.get('type') in ['mint', 'reward', 'daily_nft_reward', 'referral_reward', 'quest_reward']
            ])
            
            # Посчитать ratio
            ratio = burned / minted if minted > 0 else 0
            
            # Определить статус
            if ratio > 0.8:
                status = '🟢'  # Healthy
            elif ratio > 0.5:
                status = '🟡'  # Warning
            else:
                status = '🔴'  # Critical
            
            return {
                'burned': int(burned),
                'minted': int(minted),
                'ratio': round(ratio, 2),
                'status': status
            }
        except Exception as e:
            logger.error(f"❌ Error getting burn/mint: {e}")
            return {
                'burned': 0,
                'minted': 0,
                'ratio': 0,
                'status': '🟡'
            }
    
    # =====================================
    # NFT & REVENUE METRICS
    # =====================================
    
    def get_nft_stats(self) -> Dict[str, Any]:
        """Получить статистику NFT"""
        try:
            # Всего NFT
            total = self.supabase.table('user_nfts')\
                .select('*', count='exact')\
                .eq('is_active', True)\
                .execute()
            
            # NFT за последние 7 дней
            week_ago = (datetime.now() - timedelta(days=7)).isoformat()
            this_week = self.supabase.table('user_nfts')\
                .select('*', count='exact')\
                .eq('is_active', True)\
                .gte('minted_at', week_ago)\
                .execute()
            
            # По тирам
            nfts = self.supabase.table('user_nfts')\
                .select('tier_name, payment_type, price')\
                .eq('is_active', True)\
                .execute()
            
            tier_counts = {}
            sol_revenue = 0
            
            if nfts.data:
                for nft in nfts.data:
                    tier = nft.get('tier_name', 'Unknown')
                    tier_counts[tier] = tier_counts.get(tier, 0) + 1
                    
                    # Посчитать SOL revenue
                    if nft.get('payment_type') == 'SOL':
                        sol_revenue += float(nft.get('price', 0))
            
            # Conversion rate (NFT/Players)
            player_stats = self.get_player_stats()
            conversion = (total.count / player_stats['total'] * 100) if player_stats['total'] > 0 else 0
            
            return {
                'total': total.count,
                'this_week': this_week.count,
                'by_tier': tier_counts,
                'sol_revenue': round(sol_revenue, 2),
                'conversion_rate': round(conversion, 1)
            }
        except Exception as e:
            logger.error(f"❌ Error getting NFT stats: {e}")
            return {
                'total': 0,
                'this_week': 0,
                'by_tier': {},
                'sol_revenue': 0,
                'conversion_rate': 0
            }
    
    # =====================================
    # RETENTION METRICS
    # =====================================
    
    def get_retention_stats(self) -> Dict[str, Any]:
        """Получить retention статистику (упрощённо)"""
        try:
            # Игроки зарегистрированные вчера
            yesterday_start = (datetime.now() - timedelta(days=1)).replace(hour=0, minute=0).isoformat()
            yesterday_end = (datetime.now() - timedelta(days=1)).replace(hour=23, minute=59).isoformat()
            
            yesterday_users = self.supabase.table('users')\
                .select('user_id')\
                .gte('created_at', yesterday_start)\
                .lte('created_at', yesterday_end)\
                .execute()
            
            if not yesterday_users.data:
                return {
                    'day1_retention': 0,
                    'status': '🟡'
                }
            
            yesterday_user_ids = [u['user_id'] for u in yesterday_users.data]
            
            # Кто из них был активен сегодня
            today_start = datetime.now().replace(hour=0, minute=0).isoformat()
            
            returned_today = self.supabase.table('transactions')\
                .select('user_id')\
                .in_('user_id', yesterday_user_ids)\
                .gte('created_at', today_start)\
                .execute()
            
            unique_returned = len(set([t['user_id'] for t in returned_today.data])) if returned_today.data else 0
            
            day1_retention = (unique_returned / len(yesterday_user_ids) * 100) if yesterday_user_ids else 0
            
            # Статус
            status = '🟢' if day1_retention > 40 else '🟡' if day1_retention > 25 else '🔴'
            
            return {
                'day1_retention': round(day1_retention, 1),
                'status': status
            }
        except Exception as e:
            logger.error(f"❌ Error getting retention: {e}")
            return {
                'day1_retention': 0,
                'status': '🟡'
            }
    
    # =====================================
    # TOP PLAYERS
    # =====================================
    
    def get_top_players(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Получить топ игроков по TAMA"""
        try:
            top_users = self.supabase.table('users')\
                .select('username, level, tama_balance')\
                .order('tama_balance', desc=True)\
                .limit(limit)\
                .execute()
            
            if not top_users.data:
                return []
            
            return top_users.data
        except Exception as e:
            logger.error(f"❌ Error getting top players: {e}")
            return []
    
    # =====================================
    # HEALTH CHECK
    # =====================================
    
    def get_health_score(self) -> Dict[str, Any]:
        """Получить общий health score системы"""
        try:
            # Собрать все метрики
            player_stats = self.get_player_stats()
            active_users = self.get_active_users()
            burn_mint = self.get_burn_mint_ratio()
            nft_stats = self.get_nft_stats()
            retention = self.get_retention_stats()
            
            # Посчитать score (0-100)
            score = 0
            alerts = []
            
            # 1. Player Growth (25 points)
            if player_stats['new_7d'] > 0:
                growth_score = min(25, player_stats['new_7d'])
                score += growth_score
            else:
                alerts.append("🔴 No new players this week!")
            
            # 2. Burn/Mint Ratio (25 points)
            ratio_score = min(25, burn_mint['ratio'] * 31.25)  # 0.8 ratio = 25 points
            score += ratio_score
            if burn_mint['ratio'] < 0.5:
                alerts.append(f"🔴 Burn/Mint ratio too low: {burn_mint['ratio']}")
            elif burn_mint['ratio'] < 0.8:
                alerts.append(f"🟡 Burn/Mint ratio warning: {burn_mint['ratio']}")
            
            # 3. Revenue (25 points)
            if nft_stats['sol_revenue'] > 0:
                revenue_score = min(25, nft_stats['this_week'] * 2.5)  # 10 NFTs/week = 25 points
                score += revenue_score
            else:
                alerts.append("🟡 No NFT sales this week")
            
            # 4. Retention (25 points)
            retention_score = min(25, retention['day1_retention'] * 0.625)  # 40% = 25 points
            score += retention_score
            if retention['day1_retention'] < 30:
                alerts.append(f"🔴 Low retention: {retention['day1_retention']}%")
            
            # Определить статус
            if score >= 80:
                status = '🟢 HEALTHY'
            elif score >= 60:
                status = '🟡 WARNING'
            else:
                status = '🔴 CRITICAL'
            
            return {
                'score': int(score),
                'status': status,
                'alerts': alerts,
                'metrics': {
                    'players': player_stats,
                    'active': active_users,
                    'burn_mint': burn_mint,
                    'nft': nft_stats,
                    'retention': retention
                }
            }
        except Exception as e:
            logger.error(f"❌ Error getting health score: {e}")
            return {
                'score': 0,
                'status': '🔴 ERROR',
                'alerts': [f"System error: {e}"],
                'metrics': {}
            }


# =====================================
# REPORT FORMATTERS
# =====================================

def format_daily_report(health: Dict[str, Any]) -> str:
    """Форматировать ежедневный отчёт для Telegram"""
    
    metrics = health.get('metrics', {})
    players = metrics.get('players', {})
    active = metrics.get('active', {})
    burn_mint = metrics.get('burn_mint', {})
    nft = metrics.get('nft', {})
    retention = metrics.get('retention', {})
    
    report = f"""📊 **DAILY ANALYTICS REPORT**
📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}

🎯 **HEALTH SCORE: {health['score']}/100**
Status: {health['status']}

━━━━━━━━━━━━━━━━━━━

👥 **PLAYERS**
• Total: {players.get('total', 0):,}
• New (24h): +{players.get('new_24h', 0)}
• New (7d): +{players.get('new_7d', 0)}
• Avg Level: {players.get('avg_level', 0)}

📈 **ACTIVITY**
• DAU: {active.get('dau', 0)}
• WAU: {active.get('wau', 0)}
• MAU: {active.get('mau', 0)}

💰 **ECONOMY**
• Burn/Mint: {burn_mint.get('ratio', 0)} {burn_mint.get('status', '🟡')}
• Burned (7d): {burn_mint.get('burned', 0):,} TAMA
• Minted (7d): {burn_mint.get('minted', 0):,} TAMA

🎨 **NFT & REVENUE**
• Total NFTs: {nft.get('total', 0)}
• This Week: +{nft.get('this_week', 0)}
• SOL Revenue: {nft.get('sol_revenue', 0)} SOL
• Conversion: {nft.get('conversion_rate', 0)}%

📊 **RETENTION**
• Day 1: {retention.get('day1_retention', 0)}% {retention.get('status', '🟡')}

━━━━━━━━━━━━━━━━━━━
"""
    
    # Добавить алерты если есть
    if health.get('alerts'):
        report += "\n🚨 **ALERTS:**\n"
        for alert in health['alerts']:
            report += f"• {alert}\n"
    
    return report


def format_weekly_report(health: Dict[str, Any], top_players: List[Dict]) -> str:
    """Форматировать еженедельный отчёт"""
    
    daily = format_daily_report(health)
    
    # Добавить топ игроков
    top_section = "\n\n🏆 **TOP 10 PLAYERS**\n"
    for i, player in enumerate(top_players[:10], 1):
        username = player.get('username', 'Unknown')
        level = player.get('level', 0)
        balance = player.get('tama_balance', 0)
        top_section += f"{i}. {username} - Lvl {level} - {balance:,} TAMA\n"
    
    return daily + top_section


def format_quick_health(health: Dict[str, Any]) -> str:
    """Быстрый health check (короткий формат)"""
    
    return f"""🎯 **QUICK HEALTH CHECK**
Score: {health['score']}/100 {health['status']}

{chr(10).join(health.get('alerts', [])) if health.get('alerts') else '✅ All systems operational!'}

Use /analytics for full report"""


# =====================================
# INIT FUNCTION
# =====================================

def init_analytics(supabase_url: str, supabase_key: str) -> Optional[AnalyticsCollector]:
    """Инициализировать analytics систему"""
    try:
        collector = AnalyticsCollector(supabase_url, supabase_key)
        logger.info("✅ Analytics system initialized")
        return collector
    except Exception as e:
        logger.error(f"❌ Failed to initialize analytics: {e}")
        return None


# =====================================
# AUTO-ALERTS (для critical events)
# =====================================

def check_critical_alerts(collector: AnalyticsCollector) -> List[str]:
    """Проверить критические события и вернуть алерты"""
    alerts = []
    
    try:
        # Проверить burn/mint
        burn_mint = collector.get_burn_mint_ratio(days=1)
        if burn_mint['ratio'] < 0.3:
            alerts.append(f"🚨 CRITICAL: Burn/Mint ratio extremely low: {burn_mint['ratio']}")
        
        # Проверить retention
        retention = collector.get_retention_stats()
        if retention['day1_retention'] < 20:
            alerts.append(f"🚨 CRITICAL: Day 1 retention very low: {retention['day1_retention']}%")
        
        # Проверить новых игроков
        players = collector.get_player_stats()
        if players['new_24h'] == 0:
            alerts.append("⚠️ WARNING: No new players in last 24 hours")
        
    except Exception as e:
        logger.error(f"Error checking alerts: {e}")
    
    return alerts
