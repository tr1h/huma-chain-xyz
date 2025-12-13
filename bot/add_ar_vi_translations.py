# -*- coding: utf-8 -*-
"""
Script to add Arabic (AR) and Vietnamese (VI) translations
to full_localization.py
"""

# Arabic and Vietnamese translations for all buttons and texts
AR_VI_TRANSLATIONS = {
    # BUTTONS
    'daily_reward': {'ar': '🎁 المكافأة اليومية', 'vi': '🎁 Phần Thưởng Hàng Ngày'},
    'my_nfts': {'ar': '🖼️ NFT الخاصة بي', 'vi': '🖼️ NFT Của Tôi'},
    'mint_nft': {'ar': '🎨 سك NFT', 'vi': '🎨 Đúc NFT'},
    'withdraw': {'ar': '💸 سحب TAMA', 'vi': '💸 Rút TAMA'},
    'referral': {'ar': '🔗 رابط الإحالة', 'vi': '🔗 Liên Kết Giới Thiệu'},
    'stats': {'ar': '📊 إحصائياتي', 'vi': '📊 Thống Kê'},
    'quests': {'ar': '📋 المهام', 'vi': '📋 Nhiệm Vụ'},
    'badges': {'ar': '🏆 الشارات', 'vi': '🏆 Huy Hiệu'},
    'rank': {'ar': '🎖️ رتبتي', 'vi': '🎖️ Hạng Của Tôi'},
    'leaderboard': {'ar': '🏅 لوحة المتصدرين', 'vi': '🏅 Bảng Xếp Hạng'},
    'community': {'ar': '👥 المجتمع', 'vi': '👥 Cộng Đồng'},
    'language': {'ar': '🌍 اللغة', 'vi': '🌍 Ngôn Ngữ'},
    'back': {'ar': '🔙 رجوع', 'vi': '🔙 Quay Lại'},
    'back_to_menu': {'ar': '🔙 العودة للقائمة', 'vi': '🔙 Quay Lại Menu'},
    'share': {'ar': '📤 مشاركة', 'vi': '📤 Chia Sẻ'},
    'copy_code': {'ar': '📋 نسخ الكود', 'vi': '📋 Sao Chép Mã'},
    'help': {'ar': '❓ مساعدة', 'vi': '❓ Trợ Giúp'},
    'cancel': {'ar': '❌ إلغاء', 'vi': '❌ Hủy'},
    'confirm': {'ar': '✅ تأكيد', 'vi': '✅ Xác Nhận'},
    'view_website': {'ar': '🌐 عرض على الموقع', 'vi': '🌐 Xem Trên Web'},
}

# Welcome messages
WELCOME_AR = """🎉 **مرحباً بك في Solana Tamagotchi!**

تمت دعوتك من قبل صديق! 🎁

🔗 **ابدأ في كسب TAMA:**
• احصل على رابط الإحالة الخاص بك أدناه
• شارك مع الأصدقاء = 1,000 TAMA لكل واحد!
• مكافآت تصل إلى 100,000 TAMA!

🎮 **مميزات اللعبة:**
• 🐾 تبنَّ وربِّ حيوانات NFT
• 🎰 العب Lucky Slots و Lucky Wheel
• 💰 اكسب عملات TAMA
• 🏆 تنافس في لوحات المتصدرين
• 🎁 أكمل المهام للحصول على مكافآت

🚀 انقر على "🎮 العب الآن" للبدء!"""

WELCOME_VI = """🎉 **Chào mừng đến với Solana Tamagotchi!**

Bạn được mời bởi một người bạn! 🎁

🔗 **Bắt đầu kiếm TAMA:**
• Nhận liên kết giới thiệu của bạn bên dưới
• Chia sẻ với bạn bè = 1,000 TAMA mỗi người!
• Phần thưởng cột mốc lên đến 100,000 TAMA!

🎮 **Tính năng trò chơi:**
• 🐾 Nhận nuôi và nuôi dưỡng thú cưng NFT
• 🎰 Chơi Lucky Slots & Lucky Wheel
• 💰 Kiếm token TAMA
• 🏆 Cạnh tranh trên bảng xếp hạng
• 🎁 Hoàn thành nhiệm vụ để nhận thưởng

🚀 Nhấn "🎮 Chơi Ngay" để bắt đầu!"""

WELCOME_NO_REF_AR = """🎉 **مرحباً بك في Solana Tamagotchi!**

أفضل لعبة NFT للحيوانات الأليفة على Solana! 🐾

🎮 **مميزات اللعبة:**
• 🐾 تبنَّ وربِّ حيوانات NFT فريدة
• 🎰 العب Lucky Slots و Lucky Wheel
• 💰 اكسب عملات TAMA
• 🏆 تنافس في التصنيفات العالمية
• 🎁 أكمل المهام اليومية
• 🤝 ادعُ أصدقاء، اكسب 1,000 TAMA لكل إحالة!

🚀 انقر على "🎮 العب الآن" لبدء مغامرتك!

💎 **نصيحة:** شارك رابط الإحالة لكسب TAMA إضافي!"""

WELCOME_NO_REF_VI = """🎉 **Chào mừng đến với Solana Tamagotchi!**

Trò chơi NFT thú cưng Play-to-Earn tuyệt vời nhất trên Solana! 🐾

🎮 **Tính năng trò chơi:**
• 🐾 Nhận nuôi và nuôi dưỡng thú cưng NFT độc đáo
• 🎰 Chơi Lucky Slots & Lucky Wheel
• 💰 Kiếm token TAMA
• 🏆 Cạnh tranh trên bảng xếp hạng toàn cầu
• 🎁 Hoàn thành nhiệm vụ hàng ngày
• 🤝 Mời bạn bè, kiếm 1,000 TAMA mỗi lượt giới thiệu!

🚀 Nhấn "🎮 Chơi Ngay" để bắt đầu cuộc phiêu lưu!

💎 **Mẹo Pro:** Chia sẻ liên kết giới thiệu để kiếm thêm TAMA!"""

# Language selection
LANG_CHANGED_AR = '✅ تم تغيير اللغة إلى العربية!'
LANG_CHANGED_VI = '✅ Đã đổi ngôn ngữ sang Tiếng Việt!'
LANG_CHOOSE_AR = '🌍 **اختر لغتك**\n\nاختر لغتك المفضلة:'
LANG_CHOOSE_VI = '🌍 **Chọn Ngôn Ngữ**\n\nChọn ngôn ngữ ưa thích của bạn:'

# Stats
STATS_AR = {
    'header': '📊 **إحصائياتك الكاملة**',
    'balance': '💰 **رصيد TAMA:** {amount}',
    'rank': '🎖️ **الرتبة:** {rank}',
    'referrals_header': '👥 **الإحالات:**',
    'total_invited': '• إجمالي المدعوين: {count}',
    'active': '• النشطين: {count}',
    'pending': '• قيد الانتظار: {count}',
    'activity_header': '🔥 **النشاط:**',
    'login_streak': '• سلسلة تسجيل الدخول: {days} يوم',
    'badges_earned': '• الشارات المكتسبة: {count}',
    'keep_playing': '💰 **استمر في اللعب ودعوة الأصدقاء!**',
}

STATS_VI = {
    'header': '📊 **Thống Kê Đầy Đủ**',
    'balance': '💰 **Số dư TAMA:** {amount}',
    'rank': '🎖️ **Hạng:** {rank}',
    'referrals_header': '👥 **Giới thiệu:**',
    'total_invited': '• Tổng đã mời: {count}',
    'active': '• Hoạt động: {count}',
    'pending': '• Đang chờ: {count}',
    'activity_header': '🔥 **Hoạt động:**',
    'login_streak': '• Chuỗi đăng nhập: {days} ngày',
    'badges_earned': '• Huy hiệu đã kiếm: {count}',
    'keep_playing': '💰 **Tiếp tục chơi và mời bạn bè!**',
}

# Referral
REFERRAL_AR = {
    'header': '🔗 **كود الإحالة الخاص بك:**',
    'your_stats': '📊 **إحصائياتك:**',
    'total_referrals': '• 👥 إجمالي الإحالات: {count}',
    'total_earned': '• 💰 إجمالي الأرباح: {amount} TAMA',
    'earn_instantly': '💰 **اكسب فوراً (بدون محفظة!):**',
    'per_friend': '• 1,000 TAMA لكل صديق فوراً!',
    'just_share': '• فقط شارك رابطك واكسب!',
    'accumulates': '• TAMA يتراكم في حسابك',
}

REFERRAL_VI = {
    'header': '🔗 **Mã Giới Thiệu Của Bạn:**',
    'your_stats': '📊 **Thống kê của bạn:**',
    'total_referrals': '• 👥 Tổng giới thiệu: {count}',
    'total_earned': '• 💰 Tổng kiếm được: {amount} TAMA',
    'earn_instantly': '💰 **Kiếm ngay (KHÔNG CẦN VÍ!):**',
    'per_friend': '• 1,000 TAMA cho mỗi bạn bè ngay lập tức!',
    'just_share': '• Chỉ cần chia sẻ liên kết và kiếm!',
    'accumulates': '• TAMA tích lũy trong tài khoản của bạn',
}

# Daily
DAILY_AR = {
    'claimed': '🎁 تم استلام المكافأة اليومية: +{amount} TAMA!\n\nعد غداً للمزيد!',
    'already_claimed': '⏰ لقد استلمت مكافأتك اليومية بالفعل!\n\nعد بعد {hours}س {minutes}د',
}

DAILY_VI = {
    'claimed': '🎁 Đã nhận phần thưởng hàng ngày: +{amount} TAMA!\n\nQuay lại ngày mai để nhận thêm!',
    'already_claimed': '⏰ Bạn đã nhận phần thưởng hàng ngày!\n\nQuay lại sau {hours}g {minutes}p',
}

# Badges
BADGES_AR = {
    'header': '🏆 **شاراتك**',
    'no_badges': 'لا توجد شارات بعد. العب وادعُ أصدقاء!',
    'how_to_earn': '💰 **كيف تكسب المزيد:**',
    'early_bird': '• 🌟 الطائر المبكر - كن من أول 100 مستخدم',
    'streak_master': '• 🔥 سيد السلسلة - 30 يوم متتالي',
    'referral_king': '• 👑 ملك الإحالات - 50+ إحالة',
}

BADGES_VI = {
    'header': '🏆 **Huy Hiệu Của Bạn**',
    'no_badges': 'Chưa có huy hiệu. Chơi và mời bạn bè!',
    'how_to_earn': '💰 **Cách kiếm thêm:**',
    'early_bird': '• 🌟 Chim sớm - Nằm trong 100 người dùng đầu tiên',
    'streak_master': '• 🔥 Bậc thầy chuỗi - 30 ngày liên tiếp',
    'referral_king': '• 👑 Vua giới thiệu - 50+ giới thiệu',
}

# Quests
QUESTS_AR = {
    'header': '📋 **مهام الإحالة**',
    'completed': '✅ مكتمل',
    'in_progress': '🔄 قيد التنفيذ',
    'invite_tip': '💡 ادعُ أصدقاء لإكمال المزيد من المهام!',
}

QUESTS_VI = {
    'header': '📋 **Nhiệm Vụ Giới Thiệu**',
    'completed': '✅ Hoàn thành',
    'in_progress': '🔄 Đang tiến hành',
    'invite_tip': '💡 Mời bạn bè để hoàn thành nhiều nhiệm vụ hơn!',
}

# NFTs
NFTS_AR = {
    'collection_header': '🖼️ **مجموعة NFT الخاصة بك** 🖼️',
    'total_nfts': '📦 إجمالي NFT: **{count}**',
    'active_boost': '⚡ التعزيز النشط: **{multiplier}x**',
    'no_nfts': '📦 ليس لديك أي NFT بعد!',
}

NFTS_VI = {
    'collection_header': '🖼️ **BỘ SƯU TẬP NFT** 🖼️',
    'total_nfts': '📦 Tổng NFT: **{count}**',
    'active_boost': '⚡ Boost hoạt động: **{multiplier}x**',
    'no_nfts': '📦 Bạn chưa có NFT nào!',
}

# Withdraw
WITHDRAW_AR = {
    'header': '💸 **سحب TAMA**',
    'mainnet_launch': '🚀 **إطلاق Mainnet:** الربع الأول 2026',
    'tama_safe': 'TAMA الخاص بك آمن! استمر في الكسب! 💰',
}

WITHDRAW_VI = {
    'header': '💸 **Rút TAMA**',
    'mainnet_launch': '🚀 **Ra mắt Mainnet:** Q1 2026',
    'tama_safe': 'TAMA của bạn an toàn! Tiếp tục kiếm! 💰',
}

# Leaderboard
LEADERBOARD_AR = {
    'header': '🏅 **أفضل 10 لاعبين**',
    'no_players': 'لا يوجد لاعبون بعد. كن الأول!',
}

LEADERBOARD_VI = {
    'header': '🏅 **Top 10 Người Chơi**',
    'no_players': 'Chưa có người chơi. Hãy là người đầu tiên!',
}

# Errors
ERRORS_AR = {
    'generic': '❌ حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    'no_data': '⚠️ لم يتم العثور على بيانات. ابدأ اللعب أولاً!',
    'api_error': '❌ خطأ في API. يرجى المحاولة لاحقاً.',
}

ERRORS_VI = {
    'generic': '❌ Đã xảy ra lỗi. Vui lòng thử lại.',
    'no_data': '⚠️ Không tìm thấy dữ liệu. Hãy bắt đầu chơi trước!',
    'api_error': '❌ Lỗi API. Vui lòng thử lại sau.',
}

# Help
HELP_AR = {
    'header': '📚 **أوامر Solana Tamagotchi**',
    'game_commands': '**أوامر اللعبة:**\n/start - بدء اللعب\n/stats - عرض إحصائياتك\n/daily - استلام المكافأة اليومية',
    'social_commands': '**الأوامر الاجتماعية:**\n/invite - الحصول على رابط الإحالة\n/leaderboard - أفضل اللاعبين\n/community - انضم لمجتمعنا',
    'need_help': '**تحتاج مساعدة؟** انضم @gotchigamechat',
}

HELP_VI = {
    'header': '📚 **Lệnh Solana Tamagotchi**',
    'game_commands': '**Lệnh trò chơi:**\n/start - Bắt đầu chơi\n/stats - Xem thống kê\n/daily - Nhận thưởng hàng ngày',
    'social_commands': '**Lệnh xã hội:**\n/invite - Lấy liên kết giới thiệu\n/leaderboard - Người chơi hàng đầu\n/community - Tham gia cộng đồng',
    'need_help': '**Cần trợ giúp?** Tham gia @gotchigamechat',
}

if __name__ == '__main__':
    print("AR/VI translations ready to be added to full_localization.py")
    print(f"Buttons: {len(AR_VI_TRANSLATIONS)}")
