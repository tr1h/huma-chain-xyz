<?php
/**
 * 💾 DATABASE BACKUP EXPORT
 * Exports all Supabase tables to JSON files
 * 
 * Usage: php export-database.php
 * Output: backup/ folder with JSON files
 */

// Supabase settings
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseKey) {
    die("❌ SUPABASE_KEY not found in environment!\n");
}

// Create backup folder
$backupDir = __DIR__ . '/../backup_db_' . date('Y_m_d_H_i_s');
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0755, true);
}

echo "💾 DATABASE BACKUP STARTED\n";
echo "======================================\n";
echo "Backup folder: $backupDir\n\n";

// Helper function
function exportTable($url, $key, $tableName) {
    global $backupDir;
    
    $apiUrl = $url . '/rest/v1/' . $tableName . '?select=*&limit=10000';
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $count = count($data);
        
        // Save to JSON file
        $filename = $backupDir . '/' . $tableName . '.json';
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        echo "✅ $tableName: $count records exported\n";
        return $count;
    } else {
        echo "⚠️ $tableName: Failed (HTTP $httpCode)\n";
        return 0;
    }
}

// Export all tables
$tables = [
    'leaderboard',
    'transactions',
    'user_nfts',
    'nft_designs',
    'nft_bonding_state'
];

$totalRecords = 0;

foreach ($tables as $table) {
    $totalRecords += exportTable($supabaseUrl, $supabaseKey, $table);
}

// Export database schema
$schemaFile = $backupDir . '/database_schema.sql';
$schema = <<<SQL
-- Database Schema Backup
-- Date: {date('Y-m-d H:i:s')}

-- This is a reference schema
-- For actual restore, use Supabase Dashboard → Database → Restore

-- Tables exported:
-- 1. leaderboard (players and balances)
-- 2. transactions (transaction history)
-- 3. user_nfts (NFT ownership)
-- 4. nft_designs (NFT metadata)
-- 5. nft_bonding_state (NFT pricing)

-- Important Functions:
-- 1. withdraw_tama_atomic() - See supabase/withdraw_tama_atomic.sql

SQL;

file_put_contents($schemaFile, $schema);

echo "\n======================================\n";
echo "✅ BACKUP COMPLETE!\n";
echo "======================================\n";
echo "Total records: $totalRecords\n";
echo "Location: $backupDir\n";
echo "\nFiles created:\n";
foreach ($tables as $table) {
    echo "  - $table.json\n";
}
echo "  - database_schema.sql\n";
echo "\n✅ Database backup ready!\n";
?>

