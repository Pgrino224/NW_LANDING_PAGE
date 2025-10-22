// Test script to debug X API comment fetching
// Run with: node apps/landing/test-x-api.js

const BEARER_TOKEN = process.env.X_BEARER_TOKEN;
const bountyPostId = '1979328445109661942';

async function testXAPI() {
  console.log('Testing X API comment fetching...\n');

  // Method 1: Try conversation_id search
  console.log('=== Method 1: conversation_id search ===');
  const searchQuery = `conversation_id:${bountyPostId}`;
  const url1 = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=10&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username,created_at`;

  console.log('URL:', url1);
  console.log('Query:', searchQuery);

  const response1 = await fetch(url1, {
    headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
  });

  console.log('Status:', response1.status);
  const data1 = await response1.json();
  console.log('Response:', JSON.stringify(data1, null, 2));

  // Method 2: Try fetching the tweet itself first
  console.log('\n=== Method 2: Fetch original tweet ===');
  const url2 = `https://api.twitter.com/2/tweets/${bountyPostId}?tweet.fields=conversation_id`;

  const response2 = await fetch(url2, {
    headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
  });

  console.log('Status:', response2.status);
  const data2 = await response2.json();
  console.log('Response:', JSON.stringify(data2, null, 2));

  // Method 3: Try different search query
  console.log('\n=== Method 3: Search with to: filter ===');
  const searchQuery3 = `to:acepyr_ conversation_id:${bountyPostId}`;
  const url3 = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery3)}&max_results=10&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username,created_at`;

  console.log('URL:', url3);
  console.log('Query:', searchQuery3);

  const response3 = await fetch(url3, {
    headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
  });

  console.log('Status:', response3.status);
  const data3 = await response3.json();
  console.log('Response:', JSON.stringify(data3, null, 2));
}

testXAPI().catch(console.error);
