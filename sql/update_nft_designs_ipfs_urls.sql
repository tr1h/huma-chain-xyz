-- ============================================
-- Update nft_designs.image_url with IPFS URLs
-- ============================================
-- This script updates unminted NFT designs with IPFS URLs from Lighthouse Storage
-- Note: Since rarity is assigned randomly at mint time, we'll set a default URL
-- The actual URL will be determined by tier+rarity in the API code

-- IPFS URLs from Lighthouse Storage (uploaded 2025-11-21)
-- We'll use the most common rarity for each tier as default

-- Bronze: Common (most common)
UPDATE nft_designs 
SET image_url = 'https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i'
WHERE tier_name = 'Bronze' 
  AND is_minted = false
  AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%');

-- Silver: Uncommon (most common)
UPDATE nft_designs 
SET image_url = 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a'
WHERE tier_name = 'Silver' 
  AND is_minted = false
  AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%');

-- Gold: Common (most common)
UPDATE nft_designs 
SET image_url = 'https://gateway.lighthouse.storage/ipfs/bafkreicywzvyse3immuhakmd4dvv22gxsikmzhn4q7cjkmzjpp7253ftse'
WHERE tier_name = 'Gold' 
  AND is_minted = false
  AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%');

-- Platinum: Rare (most common)
UPDATE nft_designs 
SET image_url = 'https://gateway.lighthouse.storage/ipfs/bafkreib72mfqqs5qa3g7asjy4jtoiorxpok3bniknisqznf572haifakcq'
WHERE tier_name = 'Platinum' 
  AND is_minted = false
  AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%');

-- Diamond: Rare (most common)
UPDATE nft_designs 
SET image_url = 'https://gateway.lighthouse.storage/ipfs/bafkreigflr4x4xczfyl7gavdmaos7uupi73xm2yainwl2tlfn3nabqpsly'
WHERE tier_name = 'Diamond' 
  AND is_minted = false
  AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%');

-- Show summary
SELECT 
    tier_name,
    COUNT(*) as total_unminted,
    COUNT(CASE WHEN image_url LIKE '%lighthouse.storage%' THEN 1 END) as with_ipfs_url
FROM nft_designs
WHERE is_minted = false
GROUP BY tier_name
ORDER BY tier_name;

