#!/usr/bin/env python3
"""
Supabase Analytics API
Handles referral click tracking and analytics
"""

import os
import json
from datetime import datetime
from supabase import create_client, Client
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Supabase connection
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/track_click', methods=['POST', 'OPTIONS'])
def track_click():
    """Track referral link click"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        referral_code = data.get('referral_code', '').strip()
        clicked_at = data.get('clicked_at', datetime.now().isoformat())
        user_agent = data.get('user_agent', '')
        referrer = data.get('referrer', '')
        ip_address = request.remote_addr or 'unknown'
        
        if not referral_code:
            return jsonify({'success': False, 'error': 'Missing referral code'}), 400
        
        # Insert click record
        click_data = {
            'referral_code': referral_code,
            'clicked_at': clicked_at,
            'user_agent': user_agent,
            'referrer_url': referrer,
            'ip_address': ip_address
        }
        
        result = supabase.table('referral_clicks').insert(click_data).execute()
        
        return jsonify({
            'success': True,
            'message': 'Click tracked successfully',
            'data': result.data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/get_analytics/<referral_code>', methods=['GET'])
def get_analytics(referral_code):
    """Get analytics for a referral code"""
    try:
        # Get click stats
        clicks_response = supabase.table('referral_clicks')\
            .select('*')\
            .eq('referral_code', referral_code)\
            .execute()
        
        clicks = clicks_response.data or []
        
        # Get referral stats
        referrals_response = supabase.table('referrals')\
            .select('*')\
            .eq('referral_code', referral_code)\
            .execute()
        
        referrals = referrals_response.data or []
        
        # Calculate stats
        total_clicks = len(clicks)
        unique_visitors = len(set(click['ip_address'] for click in clicks))
        total_referrals = len(referrals)
        total_earned = sum(r.get('signup_reward', 0) for r in referrals)
        
        last_click = max(clicks, key=lambda x: x['clicked_at'])['clicked_at'] if clicks else None
        first_click = min(clicks, key=lambda x: x['clicked_at'])['clicked_at'] if clicks else None
        
        return jsonify({
            'success': True,
            'data': {
                'referral_code': referral_code,
                'total_clicks': total_clicks,
                'unique_visitors': unique_visitors,
                'total_referrals': total_referrals,
                'total_earned': total_earned,
                'last_click': last_click,
                'first_click': first_click,
                'conversion_rate': (total_referrals / total_clicks * 100) if total_clicks > 0 else 0
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/get_user_analytics/<telegram_id>', methods=['GET'])
def get_user_analytics(telegram_id):
    """Get analytics for a specific user"""
    try:
        # Get user's referral codes
        user_response = supabase.table('leaderboard')\
            .select('referral_code')\
            .eq('telegram_id', telegram_id)\
            .execute()
        
        if not user_response.data:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        referral_code = user_response.data[0]['referral_code']
        
        # Get comprehensive analytics
        analytics_response = supabase.rpc('get_user_analytics', {
            'user_telegram_id': telegram_id
        }).execute()
        
        return jsonify({
            'success': True,
            'data': analytics_response.data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test Supabase connection
        supabase.table('leaderboard').select('id').limit(1).execute()
        return jsonify({
            'success': True,
            'message': 'API is healthy',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
