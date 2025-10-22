SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('bounty_events', 'community_joins', 'leaderboard_cache', 'beta_signups')
ORDER BY table_name, ordinal_position;
