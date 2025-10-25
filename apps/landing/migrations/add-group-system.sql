-- Add group system for bounty competitions
-- This enables fair competition by distributing top performers across groups

-- Add group_number to beta_signups to track which group each participant belongs to
ALTER TABLE beta_signups
ADD COLUMN IF NOT EXISTS group_number INTEGER CHECK (group_number IN (1, 2, 3));

CREATE INDEX IF NOT EXISTS idx_beta_signups_group_bounty
ON beta_signups(bounty_event_id, group_number, email_verified);

COMMENT ON COLUMN beta_signups.group_number IS 'Competition group assignment (1, 2, or 3) for fair distribution';

-- Add group_config to bounty_events to store group assignment metadata
ALTER TABLE bounty_events
ADD COLUMN IF NOT EXISTS group_config JSONB DEFAULT '{"enabled": false, "assignment_strategy": "snake_draft"}'::jsonb;

COMMENT ON COLUMN bounty_events.group_config IS 'Group competition configuration and assignment metadata';

-- Create table to track daily group snapshots (top 3 from each group)
CREATE TABLE IF NOT EXISTS daily_group_snapshots (
  id SERIAL PRIMARY KEY,
  bounty_event_id INTEGER REFERENCES bounty_events(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  group_number INTEGER NOT NULL CHECK (group_number IN (1, 2, 3)),
  rank_in_group INTEGER NOT NULL CHECK (rank_in_group BETWEEN 1 AND 3),
  referrer_handle VARCHAR(255) NOT NULL,
  signups_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bounty_event_id, snapshot_date, group_number, rank_in_group)
);

CREATE INDEX IF NOT EXISTS idx_daily_snapshots_bounty_date
ON daily_group_snapshots(bounty_event_id, snapshot_date, group_number);

COMMENT ON TABLE daily_group_snapshots IS 'Daily snapshots of top 3 performers in each group';
COMMENT ON COLUMN daily_group_snapshots.rank_in_group IS 'Rank within the group (1, 2, or 3) - top 3 advance';
