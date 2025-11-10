-- ============================================
-- BRONZE SOL + PASSIVE INCOME SYSTEM
-- ============================================

-- 1. ОБНОВЛЯЕМ nft_bonding_state: добавляем Bronze SOL tier (ФИКС ЦЕНА 0.15 SOL!)
INSERT INTO nft_bonding_state (
    tier_name,
    payment_type,
    start_price,
    current_price,
    end_price,
    increment_per_mint,
    max_supply,
    minted_count,
    is_active
) VALUES (
    'Bronze_SOL',
    'SOL',
    0.15,  -- Фикс: 0.15 SOL ($24.60) - Express Mint!
    0.15,  -- Не меняется!
    0.15,  -- Остаётся 0.15
    0.0,   -- НЕТ инкремента (фикс цена!)
    4500,  -- Макс как у Bronze TAMA
    0,
    TRUE
) ON CONFLICT (tier_name) DO UPDATE SET
    start_price = EXCLUDED.start_price,
    current_price = EXCLUDED.current_price,
    end_price = EXCLUDED.end_price,
    increment_per_mint = EXCLUDED.increment_per_mint;

-- 2. СОЗДАЁМ ТАБЛИЦУ ДЛЯ ПАССИВНОГО ДОХОДА
CREATE TABLE IF NOT EXISTS nft_daily_rewards (
    id BIGSERIAL PRIMARY KEY,
    user_nft_id BIGINT NOT NULL REFERENCES user_nfts(id) ON DELETE CASCADE,
    telegram_id BIGINT NOT NULL,
    tier_name VARCHAR(20) NOT NULL,
    daily_tama_reward INTEGER NOT NULL,
    last_claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_claimed_tama BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_nft_id, last_claim_date)
);

CREATE INDEX IF NOT EXISTS idx_nft_daily_rewards_telegram ON nft_daily_rewards(telegram_id);
CREATE INDEX IF NOT EXISTS idx_nft_daily_rewards_claim_date ON nft_daily_rewards(last_claim_date);

-- 3. ФУНКЦИЯ ДЛЯ АВТОМАТИЧЕСКОЙ НАСТРОЙКИ DAILY REWARDS
CREATE OR REPLACE FUNCTION setup_nft_daily_rewards()
RETURNS TRIGGER AS $$
DECLARE
    daily_reward INTEGER;
BEGIN
    -- Определяем награду по тиру
    CASE NEW.tier_name
        WHEN 'Bronze' THEN daily_reward := 50;
        WHEN 'Silver' THEN daily_reward := 150;
        WHEN 'Gold' THEN daily_reward := 500;
        WHEN 'Platinum' THEN daily_reward := 2000;
        WHEN 'Diamond' THEN daily_reward := 10000;
        ELSE daily_reward := 0;
    END CASE;
    
    -- Создаём запись для daily rewards
    IF daily_reward > 0 THEN
        INSERT INTO nft_daily_rewards (
            user_nft_id,
            telegram_id,
            tier_name,
            daily_tama_reward,
            last_claim_date
        ) VALUES (
            NEW.id,
            NEW.telegram_id,
            NEW.tier_name,
            daily_reward,
            CURRENT_DATE - INTERVAL '1 day'  -- Можно клаймить сразу!
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. ТРИГГЕР: автоматически создаёт daily reward при минте NFT
DROP TRIGGER IF EXISTS trigger_setup_daily_rewards ON user_nfts;
CREATE TRIGGER trigger_setup_daily_rewards
    AFTER INSERT ON user_nfts
    FOR EACH ROW
    EXECUTE FUNCTION setup_nft_daily_rewards();

-- 5. ФУНКЦИЯ ДЛЯ КЛАЙМА DAILY REWARDS
CREATE OR REPLACE FUNCTION claim_daily_nft_rewards(
    p_telegram_id BIGINT
)
RETURNS TABLE(
    total_claimed INTEGER,
    nfts_claimed INTEGER,
    message TEXT
) AS $$
DECLARE
    v_total_tama INTEGER := 0;
    v_nft_count INTEGER := 0;
    v_reward_record RECORD;
BEGIN
    -- Проходим по всем NFT пользователя
    FOR v_reward_record IN
        SELECT 
            ndr.id,
            ndr.user_nft_id,
            ndr.daily_tama_reward,
            ndr.last_claim_date,
            un.tier_name
        FROM nft_daily_rewards ndr
        JOIN user_nfts un ON un.id = ndr.user_nft_id
        WHERE ndr.telegram_id = p_telegram_id
          AND ndr.last_claim_date < CURRENT_DATE
          AND un.is_active = TRUE
    LOOP
        -- Обновляем дату клайма
        UPDATE nft_daily_rewards
        SET 
            last_claim_date = CURRENT_DATE,
            total_claimed_tama = total_claimed_tama + v_reward_record.daily_tama_reward
        WHERE id = v_reward_record.id;
        
        -- Суммируем награду
        v_total_tama := v_total_tama + v_reward_record.daily_tama_reward;
        v_nft_count := v_nft_count + 1;
    END LOOP;
    
    -- Если есть награды - начисляем TAMA
    IF v_total_tama > 0 THEN
        UPDATE players
        SET tama_balance = tama_balance + v_total_tama
        WHERE telegram_id = p_telegram_id;
        
        RETURN QUERY SELECT 
            v_total_tama,
            v_nft_count,
            format('Claimed %s TAMA from %s NFTs!', v_total_tama, v_nft_count);
    ELSE
        RETURN QUERY SELECT 
            0,
            0,
            'No rewards available. Come back tomorrow!'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. ФУНКЦИЯ: проверка доступных наград
CREATE OR REPLACE FUNCTION get_available_daily_rewards(
    p_telegram_id BIGINT
)
RETURNS TABLE(
    tier_name VARCHAR(20),
    daily_reward INTEGER,
    days_since_claim INTEGER,
    total_pending INTEGER,
    can_claim BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ndr.tier_name,
        ndr.daily_tama_reward,
        (CURRENT_DATE - ndr.last_claim_date)::INTEGER as days_since,
        CASE 
            WHEN (CURRENT_DATE - ndr.last_claim_date) > 0 
            THEN ndr.daily_tama_reward 
            ELSE 0 
        END as pending,
        (CURRENT_DATE - ndr.last_claim_date) > 0 as can_claim
    FROM nft_daily_rewards ndr
    JOIN user_nfts un ON un.id = ndr.user_nft_id
    WHERE ndr.telegram_id = p_telegram_id
      AND un.is_active = TRUE
    ORDER BY ndr.daily_tama_reward DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. VIEW: статистика пассивного дохода
CREATE OR REPLACE VIEW nft_passive_income_stats AS
SELECT 
    ndr.telegram_id,
    COUNT(DISTINCT ndr.user_nft_id) as nft_count,
    SUM(ndr.daily_tama_reward) as daily_total_income,
    SUM(ndr.total_claimed_tama) as lifetime_claimed,
    MAX(ndr.last_claim_date) as last_claim_date,
    CASE 
        WHEN MAX(ndr.last_claim_date) < CURRENT_DATE 
        THEN SUM(ndr.daily_tama_reward)
        ELSE 0
    END as pending_rewards
FROM nft_daily_rewards ndr
JOIN user_nfts un ON un.id = ndr.user_nft_id
WHERE un.is_active = TRUE
GROUP BY ndr.telegram_id;

-- 8. КОММЕНТАРИИ
COMMENT ON TABLE nft_daily_rewards IS 'Пассивный доход от NFT - начисление TAMA каждый день';
COMMENT ON FUNCTION claim_daily_nft_rewards IS 'Клайм всех доступных daily rewards для пользователя';
COMMENT ON FUNCTION get_available_daily_rewards IS 'Проверка доступных наград для клайма';

-- ============================================
-- ГОТОВО! ✅
-- ============================================

-- Проверка:
SELECT * FROM nft_bonding_state WHERE tier_name LIKE 'Bronze%';
SELECT * FROM nft_daily_rewards LIMIT 5;

