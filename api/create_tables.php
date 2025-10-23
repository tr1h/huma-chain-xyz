<?php
// ============================================
// CREATE MISSING TABLES
// ============================================

require_once 'config.php';

// Force create referrals table
$conn = getDBConnection();

// Create referrals table (updated for bot compatibility)
$sql = "CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_telegram_id VARCHAR(50),
    referred_telegram_id VARCHAR(50),
    referrer_address VARCHAR(100),
    referred_address VARCHAR(100),
    referral_code VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    signup_reward INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referrer_telegram (referrer_telegram_id),
    INDEX idx_referrer_address (referrer_address),
    INDEX idx_code (referral_code),
    UNIQUE KEY unique_referral (referrer_telegram_id, referred_telegram_id)
)";

if ($conn->query($sql) === TRUE) {
    echo "✅ Table 'referrals' created successfully!<br>";
} else {
    echo "❌ Error creating referrals table: " . $conn->error . "<br>";
}

// Create pending_referrals table
$sql = "CREATE TABLE IF NOT EXISTS pending_referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_telegram_id VARCHAR(50) NOT NULL,
    referred_telegram_id VARCHAR(50) NOT NULL,
    referrer_username VARCHAR(100),
    referred_username VARCHAR(100),
    referral_code VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referrer_telegram (referrer_telegram_id),
    INDEX idx_code (referral_code),
    INDEX idx_status (status)
)";

if ($conn->query($sql) === TRUE) {
    echo "✅ Table 'pending_referrals' created successfully!<br>";
} else {
    echo "❌ Error creating pending_referrals table: " . $conn->error . "<br>";
}

// Update leaderboard table to include Telegram fields
$sql = "ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(100),
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50),
ADD INDEX IF NOT EXISTS idx_telegram_id (telegram_id)";

if ($conn->query($sql) === TRUE) {
    echo "✅ Table 'leaderboard' updated with Telegram fields!<br>";
} else {
    echo "❌ Error updating leaderboard table: " . $conn->error . "<br>";
}

if ($conn->query($sql) === TRUE) {
    echo "✅ Table 'referrals' created successfully!";
} else {
    echo "❌ Error creating table: " . $conn->error;
}

$conn->close();
?>











