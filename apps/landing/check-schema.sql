-- Check leaderboard_cache table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'leaderboard_cache'
ORDER BY ordinal_position;
