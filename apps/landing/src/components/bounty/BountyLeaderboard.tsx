import { useState, useEffect } from 'react';
import './BountyLeaderboard.css';

interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  signups: number;
  mentions: number;
  posts: number;
  likes: number;
  retweets: number;
  replies: number;
  totalEngagement: number;
  score: number;
  groupNumber?: number;
}

interface GroupedLeaderboard {
  group1: LeaderboardEntry[];
  group2: LeaderboardEntry[];
  group3: LeaderboardEntry[];
}

const BountyLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedLeaderboard | null>(null);
  const [groupsEnabled, setGroupsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noBountyActive, setNoBountyActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 20;

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/.netlify/functions/leaderboard-v2?period=current`);

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();

        if (data.success) {
          setNoBountyActive(data.noBountyActive || false);

          if (data.groupsEnabled && data.groups) {
            setGroupsEnabled(true);
            setGroupedData(data.groups);
            setLeaderboardData([]);
          } else {
            setGroupsEnabled(false);
            setGroupedData(null);
            setLeaderboardData(data.leaderboard || []);
          }
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter data based on search query
  const getFilteredData = (data: LeaderboardEntry[]) => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter(entry =>
      entry.name.toLowerCase().includes(query) ||
      entry.handle.toLowerCase().includes(query)
    );
  };

  // Render a single group table
  const renderGroupTable = (groupData: LeaderboardEntry[], groupNumber: number) => {
    const filteredData = getFilteredData(groupData);
    const displayData = filteredData.slice(0, 20); // Show top 20

    return (
      <div className="group-container" key={groupNumber}>
        <h2 className="group-title">Group {groupNumber}</h2>
        <div className="group-info">
          <span className="advance-badge">Top 3 Advance</span>
        </div>
        <table className="bounty-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Signups</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((entry) => (
              <tr
                key={entry.handle}
                className={entry.rank <= 3 ? 'top-three' : ''}
              >
                <td>
                  {entry.rank <= 3 && <span className="medal">🏆</span>}
                  #{entry.rank}
                </td>
                <td className="name-cell">
                  <img
                    src={`https://unavatar.io/twitter/${entry.handle.replace('@', '')}`}
                    alt={entry.name}
                    className="avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logos/acepyr-logo-white.svg';
                    }}
                  />
                  <div className="name-info">
                    <span className="name">{entry.name}</span>
                    <span className="handle">{entry.handle}</span>
                  </div>
                </td>
                <td className="signups-count">{entry.signups.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="bounty-leaderboard">
      <div className="bounty-container">
        <h1 className="bounty-title">Bounty Leaderboard</h1>

        {/* Search Bar */}
        {!loading && !error && !noBountyActive && (
          <div className="bounty-search-container">
            <input
              type="text"
              placeholder="Search by name or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bounty-search-input"
            />
            <span className="bounty-update-info">Updating every 5 minutes</span>
          </div>
        )}

        {/* Competition Info Banner */}
        {!loading && !error && !noBountyActive && groupsEnabled && (
          <div className="competition-banner">
            <p className="banner-text">
              🏆 Top 3 from each group advance to the next stage daily!
            </p>
          </div>
        )}

        {/* Leaderboard Content */}
        <div className="bounty-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#FF8480' }}>
              Loading leaderboard data...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
              Error: {error}
            </div>
          ) : noBountyActive ? (
            <div style={{ textAlign: 'center', padding: '60px', fontSize: '24px', fontWeight: 'bold', color: '#FF8480' }}>
              NEXT BOUNTY COMING SOON
            </div>
          ) : groupsEnabled && groupedData ? (
            <div className="groups-grid">
              {renderGroupTable(groupedData.group1, 1)}
              {renderGroupTable(groupedData.group2, 2)}
              {renderGroupTable(groupedData.group3, 3)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No leaderboard data available yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BountyLeaderboard;
