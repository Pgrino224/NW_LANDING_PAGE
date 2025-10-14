import pkg from 'pg';
const { Client } = pkg;

// This function runs on a schedule to update the leaderboard cache
// Configure in netlify.toml: schedule = "0 */1 * * *" (every hour)

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();

    // Get active bounty event
    const bountyResult = await client.query(
      'SELECT id, scoring_config, start_date FROM bounty_events WHERE is_active = true LIMIT 1'
    );

    if (bountyResult.rows.length === 0) {
      console.log('No active bounty event');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No active bounty event' })
      };
    }

    const activeBounty = bountyResult.rows[0];
    const scoringConfig = activeBounty.scoring_config;
    const bountyStartDate = activeBounty.start_date;

    console.log('Processing bounty:', activeBounty.id);
    console.log('Scoring config:', scoringConfig);

    // Bounty post ID searching disabled for now
    // TODO: Re-enable when we need to track engagement on specific bounty posts
    const bountyPostId = null;
    console.log('Bounty post ID search disabled - processing signups and community joins only');

    // Get all unique referrer handles from various sources (normalized to lowercase)
    const referrersResult = await client.query(`
      SELECT DISTINCT LOWER(referrer_x_handle) as referrer_x_handle
      FROM (
        SELECT referrer_x_handle FROM beta_signups WHERE referrer_x_handle IS NOT NULL
        UNION
        SELECT referrer_x_handle FROM community_joins WHERE referrer_x_handle IS NOT NULL
      ) AS all_referrers
      WHERE referrer_x_handle != ''
    `);

    const referrers = referrersResult.rows.map(row => row.referrer_x_handle);
    console.log(`Found ${referrers.length} referrers`);

    // Clear existing cache for this bounty to remove duplicates from old capitalization
    await client.query(
      'DELETE FROM leaderboard_cache WHERE bounty_event_id = $1',
      [activeBounty.id]
    );
    console.log('Cleared existing cache for bounty');

    // Calculate scores for each referrer
    for (const referrerHandle of referrers) {
      const cleanHandle = referrerHandle.replace('@', '');
      let totalScore = 0;
      let userName = referrerHandle; // Default to handle
      const breakdown = {
        likes: 0,
        retweets: 0,
        comments: 0,
        community_joins: 0,
        referral_signups: 0,
        posts: 0
      };

      // Fetch display name from X API
      try {
        const userInfo = await fetchXUserInfo(cleanHandle);
        if (userInfo) {
          userName = userInfo.name;
        }
      } catch (error) {
        console.error(`Failed to fetch user info for ${cleanHandle}:`, error.message);
        // Continue with handle as userName
      }

      // Count referral signups for this bounty (case-insensitive match)
      if (scoringConfig.referral_signups) {
        const signupsResult = await client.query(
          'SELECT COUNT(*) as count FROM beta_signups WHERE LOWER(referrer_x_handle) = LOWER($1) AND bounty_event_id = $2 AND email_verified = true',
          [referrerHandle, activeBounty.id]
        );
        breakdown.referral_signups = parseInt(signupsResult.rows[0].count);
        totalScore += breakdown.referral_signups * scoringConfig.referral_signups;
      }

      // Count community joins for this bounty (case-insensitive match)
      if (scoringConfig.community_joins) {
        const joinsResult = await client.query(
          'SELECT COUNT(*) as count FROM community_joins WHERE LOWER(referrer_x_handle) = LOWER($1) AND bounty_event_id = $2',
          [referrerHandle, activeBounty.id]
        );
        breakdown.community_joins = parseInt(joinsResult.rows[0].count);
        totalScore += breakdown.community_joins * scoringConfig.community_joins;
      }

      // Fetch X engagement data if needed and bounty post exists
      // Currently disabled - bountyPostId is always null
      if (bountyPostId && (scoringConfig.likes || scoringConfig.retweets || scoringConfig.comments)) {
        const engagement = await getEngagementForReferrer(cleanHandle, bountyPostId, bountyStartDate);

        userName = engagement.userName;
        breakdown.posts = engagement.posts;

        if (scoringConfig.likes) {
          breakdown.likes = engagement.likes;
          totalScore += engagement.likes * scoringConfig.likes;
        }

        if (scoringConfig.retweets) {
          breakdown.retweets = engagement.retweets;
          totalScore += engagement.retweets * scoringConfig.retweets;
        }

        if (scoringConfig.comments) {
          breakdown.comments = engagement.comments;
          totalScore += engagement.comments * scoringConfig.comments;
        }
      }

      // Update or insert cache entry
      await client.query(`
        INSERT INTO leaderboard_cache (referrer_handle, bounty_event_id, total_score, breakdown, user_name, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (referrer_handle, bounty_event_id)
        DO UPDATE SET
          total_score = $3,
          breakdown = $4,
          user_name = $5,
          last_updated = $6
      `, [referrerHandle, activeBounty.id, totalScore, JSON.stringify(breakdown), userName, new Date().toISOString()]);

      console.log(`Updated cache for ${referrerHandle}: ${totalScore} points`);
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Updated leaderboard cache for ${referrers.length} referrers`
      })
    };
  } catch (error) {
    console.error('Error updating leaderboard cache:', error);

    try {
      await client.end();
    } catch (e) {
      // Already closed
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to update leaderboard cache',
        details: error.message
      })
    };
  }
}

// Fetch X user info (username and display name)
async function fetchXUserInfo(handle) {
  const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

  try {
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${handle}`, {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!response.ok) {
      console.error(`Failed to fetch user info for ${handle}`);
      return null;
    }

    const data = await response.json();
    return {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name
    };
  } catch (error) {
    console.error(`Error fetching user info for ${handle}:`, error);
    return null;
  }
}

// Find the bounty post from @lui5lee
async function findBountyPost() {
  const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

  try {
    // Get @lui5lee's user ID
    const userResponse = await fetch('https://api.twitter.com/2/users/by/username/lui5lee', {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch @lui5lee user');
      return null;
    }

    const userData = await userResponse.json();
    const lui5leeId = userData.data.id;

    // Get @lui5lee's recent tweets with referenced tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${lui5leeId}/tweets?max_results=100&tweet.fields=created_at,referenced_tweets&expansions=referenced_tweets.id,referenced_tweets.id.author_id&user.fields=username`,
      {
        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
      }
    );

    if (!tweetsResponse.ok) {
      console.error('Failed to fetch @lui5lee tweets');
      return null;
    }

    const tweetsData = await tweetsResponse.json();

    // Find the most recent tweet with "BOUNTY ON" that quotes @acepyr_
    for (const tweet of tweetsData.data || []) {
      const text = tweet.text.toUpperCase();

      if (text.includes('BOUNTY ON') && tweet.referenced_tweets) {
        const quoteTweet = tweet.referenced_tweets.find(ref => ref.type === 'quoted');

        if (quoteTweet) {
          // Get the quoted tweet author
          const quotedTweet = tweetsData.includes?.tweets?.find(t => t.id === quoteTweet.id);
          const author = tweetsData.includes?.users?.find(u => u.id === quotedTweet?.author_id);

          if (author && author.username === 'acepyr_') {
            return quoteTweet.id; // Return the @acepyr_ post ID
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding bounty post:', error);
    return null;
  }
}

// Fetch engagement data from X API for a referrer's quote tweets of the bounty post
async function getEngagementForReferrer(handle, bountyPostId, startDate) {
  const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

  try {
    // Get user ID
    const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${handle}`, {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!userResponse.ok) {
      console.error(`Failed to fetch user ${handle}`);
      return { likes: 0, retweets: 0, comments: 0, posts: 0, userName: handle };
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;
    const userName = userData.data.name;

    // Get user's tweets since bounty start with referenced tweets
    let url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics,referenced_tweets`;

    if (startDate) {
      url += `&start_time=${new Date(startDate).toISOString()}`;
    }

    const tweetsResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!tweetsResponse.ok) {
      console.error(`Failed to fetch tweets for ${handle}`);
      return { likes: 0, retweets: 0, comments: 0, posts: 0, userName };
    }

    const tweetsData = await tweetsResponse.json();

    // Sum up engagement ONLY for quote tweets of the bounty post
    let totalLikes = 0;
    let totalRetweets = 0;
    let totalComments = 0;
    let postCount = 0;

    for (const tweet of tweetsData.data || []) {
      // Check if this tweet quotes the bounty post
      if (tweet.referenced_tweets) {
        const quoteTweet = tweet.referenced_tweets.find(
          ref => ref.type === 'quoted' && ref.id === bountyPostId
        );

        if (quoteTweet) {
          // This is a quote tweet of the bounty post - count its engagement
          postCount++;
          totalLikes += tweet.public_metrics.like_count || 0;
          totalRetweets += tweet.public_metrics.retweet_count || 0;
          totalComments += tweet.public_metrics.reply_count || 0;
        }
      }
    }

    return {
      likes: totalLikes,
      retweets: totalRetweets,
      comments: totalComments,
      posts: postCount,
      userName
    };
  } catch (error) {
    console.error(`Error fetching engagement for ${handle}:`, error);
    return { likes: 0, retweets: 0, comments: 0, posts: 0, userName: handle };
  }
}
