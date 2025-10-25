-- End Current Bounty
-- This script deactivates the currently active bounty

BEGIN;

-- Show current active bounty before deactivating
SELECT
  id,
  name,
  start_date,
  end_date,
  is_active,
  scoring_config
FROM bounty_events
WHERE is_active = true;

-- Deactivate all active bounties
UPDATE bounty_events
SET is_active = false
WHERE is_active = true;

-- Verify all bounties are now inactive
SELECT
  id,
  name,
  is_active
FROM bounty_events
ORDER BY id DESC
LIMIT 5;

COMMIT;

-- The leaderboard will now show "NEXT BOUNTY COMING SOON"
