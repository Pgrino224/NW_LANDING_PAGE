import { useState, useEffect } from 'react';
import './BountyLeaderboard.css';

type TabType = 'score' | 'signups' | 'engagement' | 'posts';

interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  signups: number;
  communityJoins: number;
  posts: number;
  likes: number;
  retweets: number;
  replies: number;
  totalEngagement: number;
  score: number;
}

const BountyLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('score');
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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
          setLeaderboardData(data.leaderboard);
          setNoBountyActive(data.noBountyActive || false);
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

  // Reset to page 1 when tab changes or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Get sorted data based on active tab
  const getSortedData = () => {
    const data = [...leaderboardData];

    switch (activeTab) {
      case 'score':
        return data.sort((a, b) => b.score - a.score);
      case 'signups':
        return data.sort((a, b) => b.signups - a.signups);
      case 'engagement':
        return data.sort((a, b) => b.totalEngagement - a.totalEngagement);
      case 'posts':
        return data.sort((a, b) => b.posts - a.posts);
      default:
        return data;
    }
  };

  // Filter data based on search query
  const getFilteredData = (data: LeaderboardEntry[]) => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter(entry =>
      entry.name.toLowerCase().includes(query) ||
      entry.handle.toLowerCase().includes(query)
    );
  };

  const sortedData = getSortedData();
  const filteredData = getFilteredData(sortedData);
  const rankedData = filteredData.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
  const totalPages = Math.ceil(rankedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = rankedData.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
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
            <span className="bounty-update-info">Updating every hour</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bounty-tabs">
          <button
            className={`bounty-tab ${activeTab === 'score' ? 'active' : ''}`}
            onClick={() => setActiveTab('score')}
          >
            Score
          </button>
          <button
            className={`bounty-tab ${activeTab === 'signups' ? 'active' : ''}`}
            onClick={() => setActiveTab('signups')}
          >
            Signups
          </button>
          <button
            className={`bounty-tab ${activeTab === 'engagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('engagement')}
          >
            Engagement
          </button>
          <button
            className={`bounty-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
        </div>

        {/* Leaderboard Table */}
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
          ) : rankedData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No leaderboard data available yet.
            </div>
          ) : (
            <table className="bounty-table">
              <thead>
                <tr>
                  <th>Rank #</th>
                  <th>Name</th>
                  <th>Signups</th>
                  <th>Community Joins</th>
                  <th>Engagement</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry) => (
                  <tr key={entry.handle}>
                    <td>{entry.rank}</td>
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
                    <td>{entry.signups.toLocaleString()}</td>
                    <td>{entry.communityJoins.toLocaleString()}</td>
                    <td>{entry.totalEngagement.toLocaleString()}</td>
                    <td>{entry.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && !noBountyActive && rankedData.length > 0 && totalPages > 1 && (
          <div className="bounty-pagination">
            <button
              className="page-arrow"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={page}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ) : (
                <span key={`ellipsis-${index}`} className="page-ellipsis">{page}</span>
              )
            ))}
            <button
              className="page-arrow"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BountyLeaderboard;
