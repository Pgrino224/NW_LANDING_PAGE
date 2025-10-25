-- Start a New Bounty
-- This script creates a new bounty event and deactivates all previous bounties

BEGIN;

-- Step 1: Deactivate all existing bounties
UPDATE bounty_events SET is_active = false WHERE is_active = true;

-- Step 2: Create new bounty event
-- CUSTOMIZE THE VALUES BELOW:
INSERT INTO bounty_events (
  name,
  start_date,
  end_date,
  is_active,
  scoring_config,
  group_config
) VALUES (
  'Bounty Week 1',                           -- Bounty name
  NOW(),                                     -- Start date (now)
  NOW() + INTERVAL '7 days',                 -- End date (7 days from now)
  true,                                      -- Is active
  '{"referral_signups": 1}'::jsonb,          -- Scoring: 1 point per signup
  '{"enabled": false, "assignment_strategy": "snake_draft"}'::jsonb  -- Groups disabled initially
);

-- Step 3: Verify the new bounty was created
SELECT
  id,
  name,
  start_date,
  end_date,
  is_active,
  scoring_config,
  group_config
FROM bounty_events
ORDER BY id DESC
LIMIT 1;

COMMIT;

-- Next Steps:
-- 1. Wait for participants to sign up
-- 2. Run the group assignment script: node scripts/assign-groups.js
-- 3. The leaderboard will automatically show groups after assignment
