'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Search, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CryptoModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface SearchSuggestion {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export default function CryptoModal({ isDarkMode, onClose, minimizedIndex = 0 }: CryptoModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const searchCrypto = async (coinId?: string, queryOverride?: string) => {
    const query = queryOverride || searchQuery;
    if (!query.trim() && !coinId) {
      setError('Please enter a cryptocurrency name or symbol');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setShowSuggestions(false);

    try {
      let targetCoinId = coinId;
      
      if (!targetCoinId) {
        // First, search for the coin ID using the search query
        const searchResponse = await fetch(`https://api.coingecko.com/api/v3/search?query=${query.trim()}`);
        
        if (searchResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please wait a moment and try again.');
        }
        
        if (!searchResponse.ok) {
          throw new Error('Failed to search for cryptocurrency');
        }

        const searchData = await searchResponse.json();
        
        if (!searchData.coins || searchData.coins.length === 0) {
          throw new Error(`No cryptocurrency found matching "${query}"`);
        }

        // Get the first matching coin
        targetCoinId = searchData.coins[0].id;
      }

      // Fetch detailed data for the coin
      const dataResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${targetCoinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );

      if (dataResponse.status === 429) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
      }

      if (!dataResponse.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }

      const coinData = await dataResponse.json();

      setCryptoData({
        id: coinData.id,
        symbol: coinData.symbol?.toUpperCase() || '',
        name: coinData.name,
        current_price: coinData.market_data?.current_price?.usd || 0,
        price_change_percentage_24h: coinData.market_data?.price_change_percentage_24h || 0,
        sparkline_in_7d: {
          price: coinData.market_data?.sparkline_7d?.price || []
        }
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      setCryptoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) { // Increased minimum length to reduce API calls
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (rateLimited) {
      // If we're rate limited, show some popular default suggestions
      const popularCoins = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: '' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: '' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: '' },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', thumb: '' },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', thumb: '' }
      ].filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(popularCoins);
      setShowSuggestions(popularCoins.length > 0);
      return;
    }

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
      
      if (response.status === 429) {
        // Rate limited - switch to offline mode
        setRateLimited(true);
        setShowSuggestions(false);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        const topSuggestions = data.coins.slice(0, 5).map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          thumb: coin.thumb
        }));
        setSuggestions(topSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      // Silently fail for suggestions and disable them temporarily
      setRateLimited(true);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new debounce timer - wait 800ms before making API call
    const newTimer = setTimeout(() => {
      fetchSuggestions(value);
    }, 800);
    
    setDebounceTimer(newTimer);
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    searchCrypto(suggestion.id, suggestion.name);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCrypto();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.00';
    
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Prepare chart data
  const chartData = cryptoData?.sparkline_in_7d?.price ? {
    labels: cryptoData.sparkline_in_7d.price.map((_, index) => {
      const hoursAgo = cryptoData.sparkline_in_7d.price.length - 1 - index;
      return `${hoursAgo}h ago`;
    }),
    datasets: [
      {
        label: `${cryptoData.name} Price (USD)`,
        data: cryptoData.sparkline_in_7d.price,
        borderColor: cryptoData.price_change_percentage_24h >= 0 
          ? (isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)')
          : (isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)'),
        backgroundColor: cryptoData.price_change_percentage_24h >= 0
          ? (isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)')
          : (isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'),
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: cryptoData.price_change_percentage_24h >= 0
          ? (isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)')
          : (isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)'),
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toFixed(cryptoData?.current_price && cryptoData.current_price < 1 ? 4 : 2)}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="Crypto Tracker"
      width="900px"
      minWidth="800px"
      minHeight="500px"
      showTypingAnimation={true}
      typingText="crypto-tracker.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full">
        <p 
          style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontSize: '0.75rem', 
            fontFamily: 'monospace' 
          }} 
          className="mb-6"
        >
          ~$ ./crypto-tracker --market=live
        </p>

        {/* Search Section */}
        <form onSubmit={handleSearch} className="mb-8 relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full p-3 rounded-lg outline-none"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                  border: `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`,
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}
                placeholder="Enter crypto name or symbol (min. 3 chars for suggestions)..."
                disabled={isLoading}
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg border z-10"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {rateLimited && (
                    <div 
                      className="p-2 text-center"
                      style={{
                        background: isDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(255, 204, 0, 0.1)',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        color: isDarkMode ? 'rgba(255, 204, 0, 1)' : 'rgba(255, 204, 0, 1)',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem'
                      }}
                    >
                      ⚠ API limit reached - showing popular coins
                    </div>
                  )}
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => selectSuggestion(suggestion)}
                      className="flex items-center gap-3 p-3 cursor-pointer transition-all hover:opacity-80"
                      style={{
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                      }}
                    >
                      {suggestion.thumb ? (
                        <img src={suggestion.thumb} alt={suggestion.symbol} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                          <DollarSign size={12} style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold' }}>
                          {suggestion.symbol}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginLeft: '8px', opacity: 0.7 }}>
                          {suggestion.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              style={{
                background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
                color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <Search size={16} />
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Main Content Area */}
        <div 
          className="flex-1"
          style={{ 
            minHeight: '400px' // Fixed minimum height to match when content is present
          }}
        >
          {!hasSearched ? (
            <div 
              className="flex flex-col items-center justify-center h-full"
              style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '8px',
                minHeight: '400px' // Same minimum height as content
              }}
            >
              <DollarSign size={48} style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', opacity: 0.5, marginBottom: '16px' }} />
              <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '1.1rem', opacity: 0.7 }}>
                Search for a crypto to view its trend
              </p>
              <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.875rem', opacity: 0.5, marginTop: '8px' }}>
                Try: bitcoin, ethereum, solana, dogecoin...
              </p>
            </div>
          ) : error ? (
            <div 
              className="flex flex-col items-center justify-center h-full"
              style={{
                background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                borderRadius: '8px',
                minHeight: '400px'
              }}
            >
              <TrendingDown size={48} style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)', marginBottom: '16px' }} />
              <p style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)', fontFamily: 'monospace', fontSize: '1rem' }}>
                {error}
              </p>
            </div>
          ) : isLoading ? (
            <div 
              className="flex flex-col items-center justify-center h-full"
              style={{
                background: isDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(255, 204, 0, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 204, 0, 0.3)'}`,
                borderRadius: '8px',
                minHeight: '400px'
              }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: isDarkMode ? 'rgba(255, 204, 0, 1)' : 'rgba(255, 204, 0, 1)' }}></div>
              <p style={{ color: isDarkMode ? 'rgba(255, 204, 0, 1)' : 'rgba(255, 204, 0, 1)', fontFamily: 'monospace', fontSize: '1rem' }}>
                Fetching crypto data...
              </p>
            </div>
          ) : cryptoData && (
            <div className="h-full flex flex-col" style={{ minHeight: '400px' }}>
              {/* Crypto Info Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    {cryptoData.name} ({cryptoData.symbol})
                  </h2>
                  <div className="flex items-center gap-4">
                    <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 'bold' }}>
                      {formatPrice(cryptoData.current_price)}
                    </span>
                    <div className="flex items-center gap-1">
                      {cryptoData.price_change_percentage_24h >= 0 ? (
                        <TrendingUp size={16} style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }} />
                      ) : (
                        <TrendingDown size={16} style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)' }} />
                      )}
                      <span 
                        style={{ 
                          color: cryptoData.price_change_percentage_24h >= 0 
                            ? (isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)')
                            : (isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)'),
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {formatPercentage(cryptoData.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div 
                className="flex-1 p-4 rounded-lg"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  minHeight: '300px' // Ensure consistent chart height
                }}
              >
                <div className="h-full">
                  {chartData ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', opacity: 0.6 }}>
                        No chart data available
                      </p>
                    </div>
                  )}
                </div>
                
                <p 
                  style={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
                    fontFamily: 'monospace', 
                    fontSize: '0.75rem', 
                    textAlign: 'center',
                    marginTop: '8px'
                  }}
                >
                  7-day price trend • Data from CoinGecko
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}