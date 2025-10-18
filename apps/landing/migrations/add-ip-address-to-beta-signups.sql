-- Add ip_address column to beta_signups table for rate limiting
ALTER TABLE beta_signups
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Add index for faster rate limit queries
CREATE INDEX IF NOT EXISTS idx_beta_signups_ip_created
ON beta_signups(ip_address, created_at);

-- Optional: Add comment to explain the column
COMMENT ON COLUMN beta_signups.ip_address IS 'Client IP address for rate limiting and bot detection';
