-- ✅ Wheel Jackpot Table Already Exists - Just Initialize Data

-- Check if row exists, if not insert, if yes update
INSERT INTO wheel_jackpot (id, amount, updated_at)
VALUES (1, 5000, NOW())
ON CONFLICT (id)
DO UPDATE SET
    updated_at = NOW();

-- Verify the data
SELECT * FROM wheel_jackpot WHERE id = 1;

-- If you want to reset jackpot to 5000:
-- UPDATE wheel_jackpot SET amount = 5000, updated_at = NOW() WHERE id = 1;









