'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
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
  price_change_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
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
        price_change_24h: coinData.market_data?.price_change_24h?.usd || 0,
        market_cap: coinData.market_data?.market_cap?.usd || 0,
        market_cap_rank: coinData.market_cap_rank || 0,
        total_volume: coinData.market_data?.total_volume?.usd || 0,
        circulating_supply: coinData.market_data?.circulating_supply || 0,
        total_supply: coinData.market_data?.total_supply || 0,
        max_supply: coinData.market_data?.max_supply || 0,
        ath: coinData.market_data?.ath?.usd || 0,
        ath_change_percentage: coinData.market_data?.ath_change_percentage?.usd || 0,
        ath_date: coinData.market_data?.ath_date?.usd || '',
        atl: coinData.market_data?.atl?.usd || 0,
        atl_change_percentage: coinData.market_data?.atl_change_percentage?.usd || 0,
        atl_date: coinData.market_data?.atl_date?.usd || '',
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
    setShowSuggestions(false); // Close dropdown on Enter
    searchCrypto();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  const formatNumber = (num: number, isPrice: boolean = false) => {
    if (num === 0) return isPrice ? '$0.00' : '0';
    
    if (isPrice) {
      if (num < 0.000001) return `$${num.toExponential(2)}`;
      if (num < 0.01) return `$${num.toFixed(8)}`;
      if (num < 1) return `$${num.toFixed(6)}`;
      if (num < 100) return `$${num.toFixed(4)}`;
      return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // For other numbers (market cap, volume, etc.)
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number) => {
    if (num === 0 || num === null) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Prepare chart data with enhanced styling
  const chartData = cryptoData?.sparkline_in_7d?.price ? {
    labels: cryptoData.sparkline_in_7d.price.map((_, index) => {
      const now = new Date();
      const hoursAgo = (cryptoData.sparkline_in_7d.price.length - 1 - index) * (7 * 24 / cryptoData.sparkline_in_7d.price.length);
      const date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: cryptoData.price_change_percentage_24h >= 0
          ? (isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)')
          : (isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)'),
        pointHoverBorderColor: isDarkMode ? '#fff' : '#000',
        pointHoverBorderWidth: 2,
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
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            return context[0].label || '';
          },
          label: function(context: any) {
            return `Price: ${formatNumber(context.parsed.y, true)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
          maxTicksLimit: 7,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return formatNumber(value as number, true);
          },
          maxTicksLimit: 5,
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
                onKeyDown={handleKeyDown}
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
                      {formatNumber(cryptoData.current_price, true)}
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

              {/* Chart and Market Data */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '350px', maxHeight: '400px' }}>
                {/* Chart Section */}
                <div 
                  className="lg:col-span-2 p-4 rounded-lg flex flex-col"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  }}
                >
                  <div style={{ height: '280px', width: '100%' }}>
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

                {/* Market Data Cards */}
                <div className="space-y-3">
                  {/* Market Cap Card */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        MARKET CAP
                      </span>
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold' }}>
                      {cryptoData.market_cap ? formatNumber(cryptoData.market_cap) : 'N/A'}
                    </div>
                  </div>

                  {/* Trading Volume Card */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 size={16} style={{ color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        24H VOLUME
                      </span>
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold' }}>
                      {cryptoData.total_volume ? formatNumber(cryptoData.total_volume) : 'N/A'}
                    </div>
                  </div>

                  {/* Supply Information Card */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} style={{ color: isDarkMode ? 'rgba(168, 85, 247, 1)' : 'rgba(147, 51, 234, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        SUPPLY
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                          Circulating:
                        </span>
                        <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {cryptoData.circulating_supply ? formatSupply(cryptoData.circulating_supply) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                          Max:
                        </span>
                        <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {cryptoData.max_supply ? formatSupply(cryptoData.max_supply) : '∞'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ATH/ATL Card */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={16} style={{ color: isDarkMode ? 'rgba(251, 191, 36, 1)' : 'rgba(245, 158, 11, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        ALL-TIME
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                          ATH:
                        </span>
                        <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {cryptoData.ath ? formatNumber(cryptoData.ath, true) : 'N/A'}
                        </span>
                      </div>
                      {cryptoData.ath_change_percentage && (
                        <div className="flex justify-between">
                          <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.6 }}>
                            From ATH:
                          </span>
                          <span style={{ 
                            color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)', 
                            fontFamily: 'monospace', 
                            fontSize: '0.65rem'
                          }}>
                            {formatPercentage(cryptoData.ath_change_percentage)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}