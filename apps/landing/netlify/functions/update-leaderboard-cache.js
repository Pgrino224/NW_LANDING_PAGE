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
      'SELECT id, scoring_config, start_date, bounty_post_id FROM bounty_events WHERE is_active = true LIMIT 1'
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
    const bountyPostId = activeBounty.bounty_post_id;

    console.log('Processing bounty:', activeBounty.id);
    console.log('Scoring config:', scoringConfig);
    console.log('Bounty post ID:', bountyPostId || 'Not set');

    // Process comment mentions if bounty post ID is configured
    if (bountyPostId && scoringConfig.comment_mentions) {
      console.log('=== COMMENT MENTIONS PROCESSING START ===');
      console.log('Bounty Post ID:', bountyPostId);
      console.log('Scoring Config:', JSON.stringify(scoringConfig));
      await processMentions(client, activeBounty.id, bountyPostId);
      console.log('=== COMMENT MENTIONS PROCESSING END ===');
    } else {
      if (!bountyPostId) {
        console.log('⚠️ No bounty_post_id configured - skipping mention processing');
      }
      if (!scoringConfig.comment_mentions) {
        console.log('⚠️ comment_mentions not in scoring_config - skipping mention processing');
      }
    }

    // Get all unique referrer handles from various sources (normalized to lowercase with @ prefix)
    const referrersResult = await client.query(`
      SELECT DISTINCT
        CASE
          WHEN LOWER(referrer_x_handle) LIKE '@%' THEN LOWER(referrer_x_handle)
          ELSE CONCAT('@', LOWER(referrer_x_handle))
        END as referrer_x_handle
      FROM (
        SELECT referrer_x_handle FROM beta_signups WHERE referrer_x_handle IS NOT NULL
        UNION
        SELECT referrer_x_handle FROM community_joins WHERE referrer_x_handle IS NOT NULL
        UNION
        SELECT mentioned_handle as referrer_x_handle FROM processed_comments WHERE mentioned_handle IS NOT NULL
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
        referral_signups: 0,
        posts: 0,
        comment_mentions: 0
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

      // Community joins scoring removed - only counting signups now

      // Count unique comment mentions for this bounty (case-insensitive match)
      if (scoringConfig.comment_mentions) {
        const mentionsResult = await client.query(
          'SELECT COUNT(DISTINCT mentioner_handle) as count FROM processed_comments WHERE LOWER(mentioned_handle) = LOWER($1) AND bounty_event_id = $2',
          [referrerHandle, activeBounty.id]
        );
        breakdown.comment_mentions = parseInt(mentionsResult.rows[0].count);
        totalScore += breakdown.comment_mentions * scoringConfig.comment_mentions;
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

// Fetch all followers of @acepyr_ and cache them
async function fetchAcepyrFollowers() {
  const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

  try {
    // Get @acepyr_ user ID
    const acepyrResponse = await fetch('https://api.twitter.com/2/users/by/username/acepyr_', {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!acepyrResponse.ok) {
      console.error('Failed to fetch @acepyr_ user info');
      return new Set();
    }

    const acepyrData = await acepyrResponse.json();
    const acepyrUserId = acepyrData.data?.id;

    if (!acepyrUserId) {
      console.error('@acepyr_ user ID not found');
      return new Set();
    }

    // Fetch followers (first 1000 - adjust if needed)
    const followersResponse = await fetch(
      `https://api.twitter.com/2/users/${acepyrUserId}/followers?max_results=1000`,
      {
        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
      }
    );

    if (!followersResponse.ok) {
      console.error('Failed to fetch @acepyr_ followers');
      return new Set();
    }

    const followersData = await followersResponse.json();
    const followerIds = new Set();

    if (followersData.data) {
      for (const follower of followersData.data) {
        followerIds.add(follower.id);
      }
    }

    console.log(`Cached ${followerIds.size} followers of @acepyr_`);
    return followerIds;
  } catch (error) {
    console.error('Error fetching @acepyr_ followers:', error);
    return new Set();
  }
}

// Process mentions from bounty post comments
async function processMentions(client, bountyEventId, bountyPostId) {
  const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

  try {
    console.log('📝 Fetching @acepyr_ followers...');
    // Fetch @acepyr_ followers once at the beginning
    const acepyrFollowers = await fetchAcepyrFollowers();

    if (acepyrFollowers.size === 0) {
      console.log('⚠️ No followers found for @acepyr_, skipping follower validation');
    } else {
      console.log(`✅ Cached ${acepyrFollowers.size} @acepyr_ followers`);
    }

    // Fetch conversation thread (all replies to the bounty post)
    // X API Basic tier limitation: conversation_id operator might not be available
    // Alternative: Search for replies to @acepyr_ mentioning the post

    // First, try to get the original tweet to confirm it exists
    console.log('🔍 Step 1: Fetching original tweet...');
    const tweetUrl = `https://api.twitter.com/2/tweets/${bountyPostId}?tweet.fields=created_at,conversation_id,author_id`;

    const tweetResponse = await fetch(tweetUrl, {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!tweetResponse.ok) {
      const errorText = await tweetResponse.text();
      console.error('❌ Failed to fetch original tweet');
      console.error('Status:', tweetResponse.status);
      console.error('Response:', errorText);
      return;
    }

    const tweetData = await tweetResponse.json();
    console.log('✅ Original tweet found:', JSON.stringify(tweetData, null, 2));

    // Now fetch replies using search API with to:acepyr_
    // This searches for tweets mentioning @acepyr_ which are more likely to be replies
    console.log('🔍 Step 2: Searching for replies to @acepyr_...');
    const searchQuery = `to:acepyr_`;
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=100&tweet.fields=created_at,author_id,referenced_tweets,in_reply_to_user_id&expansions=author_id,referenced_tweets.id&user.fields=username,created_at`;

    console.log('Search query:', searchQuery);
    console.log('URL:', url);

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch replies');
      console.error('Status:', response.status);
      console.error('Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('📊 Search API Response (first 5 tweets):', JSON.stringify({
      meta: data.meta,
      data: data.data?.slice(0, 5),
      includes: data.includes
    }, null, 2));

    if (!data.data || data.data.length === 0) {
      console.log('⚠️ No replies found to @acepyr_');
      return;
    }

    // Filter to only include tweets that are DIRECT replies to the specific bounty post
    // NOT replies to other people's comments in the thread
    const relevantReplies = data.data.filter(tweet => {
      // Check if this tweet is a DIRECT reply to our bounty post
      if (tweet.referenced_tweets && tweet.referenced_tweets.length > 0) {
        // The first referenced tweet should be the direct reply
        const directReply = tweet.referenced_tweets[0];
        // MUST be a direct reply (not quote) AND MUST be to the bounty post
        return directReply.type === 'replied_to' && directReply.id === bountyPostId;
      }
      return false;
    });

    console.log(`✅ Found ${data.data.length} total replies to @acepyr_, ${relevantReplies.length} are DIRECT replies to bounty post ${bountyPostId}`);

    if (relevantReplies.length === 0) {
      console.log('⚠️ No comments found specifically for bounty post');
      return;
    }

    // Use the filtered replies instead of all data
    data.data = relevantReplies;

    // Create a map of author_id to user info
    const userMap = {};
    if (data.includes && data.includes.users) {
      for (const user of data.includes.users) {
        userMap[user.id] = user;
      }
    }

    let processedCount = 0;
    let skippedCount = 0;

    // Process each comment
    for (const tweet of data.data) {
      const commentId = tweet.id;
      const authorId = tweet.author_id;
      const commentText = tweet.text;

      // Check if already processed
      const existingCheck = await client.query(
        'SELECT id FROM processed_comments WHERE comment_id = $1',
        [commentId]
      );

      if (existingCheck.rows.length > 0) {
        skippedCount++;
        continue;
      }

      // Get author info
      const author = userMap[authorId];
      if (!author) {
        console.log(`Author info not found for comment ${commentId}`);
        continue;
      }

      const mentionerHandle = `@${author.username.toLowerCase()}`;
      const mentionerId = author.id;

      // Check account age (must be >3 days old)
      const accountCreatedAt = new Date(author.created_at);
      const accountAgeDays = Math.floor((Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24));

      if (accountAgeDays < 3) {
        console.log(`Skipping ${mentionerHandle} - account too young (${accountAgeDays} days)`);
        skippedCount++;
        continue;
      }

      // Check if user follows @acepyr_ (using cached follower set)
      if (acepyrFollowers.size > 0 && !acepyrFollowers.has(mentionerId)) {
        console.log(`Skipping ${mentionerHandle} - not following @acepyr_`);
        skippedCount++;
        continue;
      }

      // Extract @mentions from comment text
      // IMPORTANT: Exclude the reply-to mention (@acepyr_)
      // When someone replies to @acepyr_, the first @acepyr_ is automatic (the reply target)
      // Only count @mentions that appear AFTER the reply-to mention

      const mentionRegex = /@(\w+)/g;
      const allMentions = [];
      let match;

      while ((match = mentionRegex.exec(commentText)) !== null) {
        allMentions.push(`@${match[1].toLowerCase()}`);
      }

      // Remove the first @acepyr_ mention (the reply-to target)
      const mentions = [];
      let acepyrSkipped = false;

      for (const mentionedHandle of allMentions) {
        // Skip the first @acepyr_ (reply-to target)
        if (mentionedHandle === '@acepyr_' && !acepyrSkipped) {
          acepyrSkipped = true;
          continue;
        }

        // Don't count self-mentions
        if (mentionedHandle !== mentionerHandle) {
          mentions.push(mentionedHandle);
        }
      }

      // Store each unique mention
      for (const mentionedHandle of [...new Set(mentions)]) {
        try {
          await client.query(
            'INSERT INTO processed_comments (comment_id, bounty_event_id, mentioner_handle, mentioned_handle, account_age_days, comment_text, processed_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [commentId, bountyEventId, mentionerHandle, mentionedHandle, accountAgeDays, commentText, new Date().toISOString()]
          );
          processedCount++;
        } catch (error) {
          if (error.code === '23505') {
            // Duplicate entry, skip
            skippedCount++;
          } else {
            console.error(`Error storing mention ${mentionerHandle} -> ${mentionedHandle}:`, error.message);
          }
        }
      }
    }

    console.log(`✅ Processed ${processedCount} new mentions, skipped ${skippedCount}`);
  } catch (error) {
    console.error('❌ Error processing mentions:', error);
    console.error('Error stack:', error.stack);
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
