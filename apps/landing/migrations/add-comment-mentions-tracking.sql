-- Add bounty_post_id to bounty_events table
ALTER TABLE bounty_events
ADD COLUMN IF NOT EXISTS bounty_post_id VARCHAR(255);

COMMENT ON COLUMN bounty_events.bounty_post_id IS 'X/Twitter post ID for the main bounty announcement post';

-- Create table to track processed comment mentions
CREATE TABLE IF NOT EXISTS processed_comments (
  id SERIAL PRIMARY KEY,
  comment_id VARCHAR(255) UNIQUE NOT NULL,
  bounty_event_id INTEGER REFERENCES bounty_events(id) ON DELETE CASCADE,
  mentioner_handle VARCHAR(255) NOT NULL,
  mentioned_handle VARCHAR(255) NOT NULL,
  account_age_days INTEGER,
  comment_text TEXT,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_processed_comments_bounty_event
ON processed_comments(bounty_event_id);

CREATE INDEX IF NOT EXISTS idx_processed_comments_mentioned_handle
ON processed_comments(mentioned_handle, bounty_event_id);

CREATE INDEX IF NOT EXISTS idx_processed_comments_mentioner_handle
ON processed_comments(mentioner_handle, mentioned_handle, bounty_event_id);

COMMENT ON TABLE processed_comments IS 'Tracks X/Twitter comment mentions for bounty scoring';
COMMENT ON COLUMN processed_comments.comment_id IS 'Unique X/Twitter comment/reply ID';
COMMENT ON COLUMN processed_comments.mentioner_handle IS 'X handle of the person who posted the comment (with @ prefix)';
COMMENT ON COLUMN processed_comments.mentioned_handle IS 'X handle mentioned in the comment (with @ prefix)';
COMMENT ON COLUMN processed_comments.account_age_days IS 'Age of mentioner account in days at time of processing';
