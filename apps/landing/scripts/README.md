# Bounty Management Scripts

This directory contains scripts for managing bounty events and group assignments.

## 📋 Table of Contents

1. [Database Migrations](#database-migrations)
2. [Starting a New Bounty](#starting-a-new-bounty)
3. [Assigning Groups](#assigning-groups)
4. [Ending a Bounty](#ending-a-bounty)
5. [How the Auto-Update Works](#how-the-auto-update-works)

---

## 🗄️ Database Migrations

### Apply Group System Migration

First, ensure the group system tables are created:

```bash
# Run the migration SQL file in your database
psql $DATABASE_URL -f ../migrations/add-group-system.sql
```

This creates:
- `group_number` column in `beta_signups` (values: 1, 2, or 3)
- `group_config` column in `bounty_events`
- `daily_group_snapshots` table for tracking top performers

---

## 🚀 Starting a New Bounty

### Step 1: Edit the Bounty Details

Open `start-new-bounty.sql` and customize:

```sql
INSERT INTO bounty_events (
  name,
  start_date,
  end_date,
  is_active,
  scoring_config,
  group_config
) VALUES (
  'Your Bounty Name Here',                   -- ✏️ Change this
  NOW(),                                     -- Or set specific start date
  NOW() + INTERVAL '7 days',                 -- ✏️ Adjust duration
  true,
  '{"referral_signups": 1}'::jsonb,          -- Points per signup
  '{"enabled": false, "assignment_strategy": "snake_draft"}'::jsonb
);
```

### Step 2: Run the Script

```bash
# Connect to your database and run
psql $NETLIFY_DATABASE_URL -f scripts/start-new-bounty.sql
```

This will:
1. ✅ Deactivate all previous bounties
2. ✅ Create the new bounty
3. ✅ Display the new bounty details

---

## 👥 Assigning Groups

### When to Run This

Run group assignment **after participants have started signing up** but **before** you want the leaderboard to show groups.

### How It Works

The script uses a **snake draft algorithm** to ensure fair competition:

```
Round 1: Participant 1 → Group 1, Participant 2 → Group 2, Participant 3 → Group 3
Round 2: Participant 4 → Group 3, Participant 5 → Group 2, Participant 6 → Group 1
Round 3: Participant 7 → Group 1, Participant 8 → Group 2, Participant 9 → Group 3
...and so on
```

This ensures that top performers are **distributed evenly** across all groups, preventing any single group from being dominated by high-performers.

### Run the Assignment Script

```bash
# From the landing app directory
cd apps/landing

# Set your database URL
export NETLIFY_DATABASE_URL="your-database-url"

# Run the assignment script
node scripts/assign-groups.js
```

**Output:**
```
✅ Connected to database
📊 Active bounty: Bounty Week 1 (ID: 123)
👥 Found 42 participants to assign

  1. @topperformer      | 156 signups → Group 1
  2. @secondplace       |  89 signups → Group 2
  3. @thirdplace        |  67 signups → Group 3
  4. @fourthplace       |  54 signups → Group 3  ← Reverse order starts
  5. @fifthplace        |  48 signups → Group 2
  6. @sixthplace        |  42 signups → Group 1
  ...

✅ Successfully assigned 42 participants to groups
   Total signup records updated: 156

📊 Group Distribution:
   Group 1: 14 participants
   Group 2: 14 participants
   Group 3: 14 participants
```

---

## 🏁 Ending a Bounty

When a bounty period is over:

```bash
# Run the end bounty script
psql $NETLIFY_DATABASE_URL -f scripts/end-current-bounty.sql
```

This will:
1. ✅ Show the current active bounty
2. ✅ Set `is_active = false` for all bounties
3. ✅ Display confirmation

The leaderboard will automatically show **"NEXT BOUNTY COMING SOON"**.

---

## 🔄 How the Auto-Update Works

### Automatic Leaderboard Updates

The leaderboard **auto-updates every 5 minutes** in production via a Netlify scheduled function.

**Configuration:** `apps/landing/netlify.toml`
```toml
[functions."update-leaderboard-cache"]
  schedule = "*/5 * * * *"  # Every 5 minutes
```

### What Gets Updated

The scheduled function ([update-leaderboard-cache.js](../netlify/functions/update-leaderboard-cache.js)):
1. Fetches all participants from the active bounty
2. Counts verified signups for each participant
3. Updates the `leaderboard_cache` table
4. Includes group assignments when groups are enabled

### Manual Trigger (for testing)

```bash
# Trigger the update function manually (local dev or production)
curl https://your-site.netlify.app/.netlify/functions/update-leaderboard-cache
```

### Why You Had to Manually Update Before

❌ **Problem:** Scheduled functions only run in **production on Netlify**, not in local development.

✅ **Solution:** The function is now properly scheduled and will auto-update in production.

---

## 📊 Complete Workflow

### Starting a New Bounty with Groups

```bash
# 1. Start a new bounty
psql $NETLIFY_DATABASE_URL -f scripts/start-new-bounty.sql

# 2. Wait for participants to sign up (monitor signups)

# 3. Once you have enough participants, assign groups
node scripts/assign-groups.js

# 4. The leaderboard will automatically show the 3-group competition view!
```

### Daily Group Advancement (Optional)

If you want to snapshot the top 3 from each group daily:

```sql
-- Insert today's top 3 from each group
INSERT INTO daily_group_snapshots (bounty_event_id, snapshot_date, group_number, rank_in_group, referrer_handle, signups_count)
SELECT
  $BOUNTY_ID,
  CURRENT_DATE,
  bs.group_number,
  ROW_NUMBER() OVER (PARTITION BY bs.group_number ORDER BY COUNT(*) DESC) as rank_in_group,
  bs.referrer_x_handle,
  COUNT(*) as signups
FROM beta_signups bs
WHERE bs.bounty_event_id = $BOUNTY_ID
  AND bs.email_verified = true
  AND bs.group_number IS NOT NULL
GROUP BY bs.group_number, bs.referrer_x_handle
HAVING ROW_NUMBER() OVER (PARTITION BY bs.group_number ORDER BY COUNT(*) DESC) <= 3;
```

---

## 🎯 Key Features

### ✅ Fair Competition
- Snake draft ensures balanced groups
- No group dominated by top performers

### ✅ Auto-Updates
- Leaderboard refreshes every 5 minutes in production
- No manual intervention needed

### ✅ Signups Only
- Community joins removed from scoring
- Focus entirely on verified signups

### ✅ Visual Group Display
- 3-column grid layout
- Top 3 highlighted with gold trophy 🏆
- "Top 3 Advance" badge on each group

---

## 🔧 Troubleshooting

### Groups not showing on leaderboard?
1. Check that `group_config.enabled = true` in `bounty_events`
2. Verify participants have `group_number` values in `beta_signups`
3. Run the assign-groups script again

### Leaderboard not updating?
1. Verify the scheduled function is deployed to Netlify
2. Check Netlify function logs for errors
3. Manually trigger: `curl /.netlify/functions/update-leaderboard-cache`

### Uneven group distribution?
- This is normal if total participants isn't divisible by 3
- The snake draft ensures the most fair distribution possible

---

## 📞 Need Help?

Check the function logs in Netlify dashboard or run scripts with `--verbose` flag for debugging.
