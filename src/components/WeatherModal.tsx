'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Search, MapPin, Cloud, CloudRain, Thermometer, Wind, Eye, Droplets } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

// Dynamic import for Map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });

interface WeatherModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  showTypingAnimation: boolean;
}

interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  };
}

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function WeatherModal({ onClose, isDarkMode, showTypingAnimation }: WeatherModalProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(10);
  const [weatherLayer, setWeatherLayer] = useState<'clouds' | 'precipitation' | 'temp'>('clouds');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [forecastList, setForecastList] = useState<any[]>([]);
  const [dailyForecasts, setDailyForecasts] = useState<any[]>([]);

  // OpenWeather API key - you'll need to get one from https://openweathermap.org/api
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'your_api_key_here';

  useEffect(() => {
    if (searchQuery.length > 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        fetchLocationSuggestions(searchQuery);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (response.ok) {
        const locations = await response.json();
        setSuggestions(locations);
        setShowSuggestions(locations.length > 0);
      }
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, locationName?: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      setWeatherData({
        location: {
          name: locationName || data.name,
          country: data.sys.country,
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
        current: {
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          visibility: data.visibility / 1000, // Convert to km
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg || 0,
          weather: data.weather,
        },
      });

      setMapCenter([lat, lon]);
      setMapZoom(10);
      setHasSearched(true);
      // fetch forecast (5 day / 3 hour)
      fetchForecastData(lat, lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      if (!res.ok) return;
      const data = await res.json();
      const list = data.list || [];
      setForecastList(list);

      // compute daily summaries for next 7 days (fill missing days if necessary)
      const groups: Record<string, any[]> = {};
      list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
      });

      const next7: any[] = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;

        if (groups[key] && groups[key].length > 0) {
          const items = groups[key];
          const temps = items.map((i: any) => i.main.temp);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const midday = items[Math.floor(items.length / 2)];
          next7.push({ date: key, min, max, description: midday.weather[0].description, icon: midday.weather[0].icon });
        } else {
          // fallback: use nearest forecast item if available, otherwise placeholders
          const fallback = list.find((it: any) => {
            const d2 = new Date(it.dt * 1000);
            return d2.getDate() === d.getDate() && d2.getMonth() === d.getMonth();
          }) || list[0];

          if (fallback) {
            next7.push({ date: key, min: Math.round(fallback.main.temp), max: Math.round(fallback.main.temp), description: fallback.weather[0].description, icon: fallback.weather[0].icon });
          } else {
            next7.push({ date: key, min: 0, max: 0, description: 'No data', icon: '01d' });
          }
        }
      }

      setDailyForecasts(next7);
    } catch (err) {
      console.error('Forecast fetch failed', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false); // Always close suggestions on Enter
    
    if (suggestions.length > 0) {
      const location = suggestions[0];
      selectLocation(location);
    } else if (searchQuery.trim().length > 0) {
      // If no suggestions but there's a query, fetch suggestions first then select
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery.trim())}&limit=1&appid=${API_KEY}`
        );
        
        if (response.ok) {
          const locations = await response.json();
          if (locations.length > 0) {
            const location = locations[0];
            const displayName = location.state 
              ? `${location.name}, ${location.state}, ${location.country}`
              : `${location.name}, ${location.country}`;
            fetchWeatherData(location.lat, location.lon, location.name);
          }
        }
      } catch (err) {
        console.error('Error searching location:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    const displayName = location.state 
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;
    
    setSearchQuery(displayName);
    setShowSuggestions(false);
    fetchWeatherData(location.lat, location.lon, location.name);
  };

  const formatTemp = (temp: number) => `${Math.round(temp)}°C`;
  const formatWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const getWeatherLayerUrl = () => {
    const layerMap = {
      clouds: 'clouds_new',
      precipitation: 'precipitation_new',
      temp: 'temp_new'
    };
    
    return `https://tile.openweathermap.org/map/${layerMap[weatherLayer]}/{z}/{x}/{y}.png?appid=${API_KEY}`;
  };

  // Check whether weather tile overlays are available for this API key/plan
  const [overlayAvailable, setOverlayAvailable] = useState(true);

  useEffect(() => {
    const layerMap = {
      clouds: 'clouds_new',
      precipitation: 'precipitation_new',
      temp: 'temp_new'
    };

    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setOverlayAvailable(false);
      return;
    }

    const testUrl = `https://tile.openweathermap.org/map/${layerMap[weatherLayer]}/0/0/0.png?appid=${API_KEY}`;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(testUrl, { method: 'GET' });
        if (!cancelled) setOverlayAvailable(res.ok);
      } catch (err) {
        if (!cancelled) setOverlayAvailable(false);
      }
    })();

    return () => { cancelled = true; };
  }, [weatherLayer, API_KEY]);

  // Prepare hourly chart data from forecastList (next 24 hours)
  const hourly = forecastList.slice(0, 8); // 8 * 3h = 24h
  const hourlyLabels = hourly.map(i => new Date(i.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }));
  const hourlyTemps = hourly.map(i => i.main.temp);

  const chartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyTemps,
        borderColor: isDarkMode ? 'rgba(34,197,94,1)' : 'rgba(22,163,74,1)',
        backgroundColor: isDarkMode ? 'rgba(34,197,94,0.12)' : 'rgba(22,163,74,0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' } },
      y: { ticks: { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <Modal onClose={onClose} isDarkMode={isDarkMode} showTypingAnimation={showTypingAnimation} title="Weather App" typingText="weather" width="1100px" minWidth="900px" minHeight="600px">
      <div className="p-6 h-full flex flex-col">
        {/* Command Header */}
        <p 
          style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontSize: '0.75rem', 
            fontFamily: 'monospace',
            marginBottom: '16px'
          }}
        >
          ~$ ./weather-app --mode=interactive
        </p>
        
        {/* Header */}
        <div className="mb-6">
          <h1 style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Weather Map
          </h1>
          <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.875rem', opacity: 0.8 }}>
            Interactive weather visualization with live data layers
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-4 space-y-4">
          {/* Location Search */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' 
                  }} 
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search location (e.g., New York, London, Tokyo...)"
                  className="w-full pl-12 pr-4 py-3 rounded-lg transition-all"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  disabled={isLoading}
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border max-h-60 overflow-y-auto"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                      backdropFilter: 'blur(10px)',
                      zIndex: 9999
                    }}
                  >
                    {suggestions.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => selectLocation(location)}
                        className="flex items-center gap-3 p-3 cursor-pointer transition-all hover:opacity-80"
                        style={{
                          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                        }}
                      >
                        <MapPin size={16} style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }} />
                        <div className="flex-1">
                          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {location.name}
                          </span>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginLeft: '8px', opacity: 0.7 }}>
                            {location.state ? `${location.state}, ${location.country}` : location.country}
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
                  fontSize: '0.875rem'
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }}></div>
                ) : (
                  <Search size={16} />
                )}
                Search
              </button>
            </div>
          </form>

          {/* Layers removed per layout request */}
        </div>

        {/* Main Content: left (1/3) and right (2/3) columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ maxHeight: '720px' }}>
          {/* Left Column: header + bento cards (1/3) */}
          <div
            className="rounded-lg overflow-hidden p-4 lg:col-span-1"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`
            }}
          >
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <MapPin size={48} style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', opacity: 0.5, marginBottom: '16px' }} />
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '1.1rem', opacity: 0.7 }}>
                  Search for a location to view weather dashboard
                </p>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.875rem', opacity: 0.5, marginTop: '8px' }}>
                  Try: New York, London, Tokyo, Paris...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Cloud size={48} style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)', marginBottom: '16px' }} />
                <p style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)', fontFamily: 'monospace', fontSize: '1rem' }}>
                  {error}
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }}></div>
                <p style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)', fontFamily: 'monospace', fontSize: '1rem' }}>
                  Loading weather dashboard...
                </p>
              </div>
            ) : (
              <div style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
                {/* Dashboard header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '2.2rem', fontWeight: '700', color: '#ffffff' }}>
                        {weatherData ? formatTemp(weatherData.current.temp) : '--'}
                      </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', marginTop: 6 }}>
                      {weatherData ? `${weatherData.location.name}, ${weatherData.location.country}` : ''}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', marginTop: 8 }}>
                      {weatherData ? weatherData.current.weather[0].description : ''}
                    </div>
                  </div>
                </div>

                {/* Bento / Info Cards stacked in left column (equal heights) */}
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg h-full" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={16} style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        CURRENT
                      </span>
                    </div>
                    <div style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: '700' }}>
                      {formatTemp(weatherData.current.temp)}
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                      Feels like {formatTemp(weatherData.current.feels_like)}
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7, marginTop: '8px' }}>
                      {weatherData.current.weather[0].description}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg h-full" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wind size={16} style={{ color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)' }} />
                      <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.8 }}>
                        WIND
                      </span>
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: '700' }}>
                      {Math.round(weatherData.current.wind_speed)} m/s
                    </div>
                    <div style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                      {formatWindDirection(weatherData.current.wind_deg)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg h-full" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Droplets size={14} style={{ color: isDarkMode ? 'rgba(168, 85, 247, 1)' : 'rgba(147, 51, 234, 1)' }} />
                        <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          Humidity: {weatherData.current.humidity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} style={{ color: isDarkMode ? 'rgba(251, 191, 36, 1)' : 'rgba(245, 158, 11, 1)' }} />
                        <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          Visibility: {weatherData.current.visibility}km
                        </span>
                      </div>
                      <div style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        Pressure: {weatherData.current.pressure} hPa
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Graph and forecast (2/3) */}
          <div
            className="rounded-lg overflow-hidden p-4 lg:col-span-2"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`
            }}
          >
            {/* Chart label */}
            <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>
              Hourly Temperature
            </div>
            {/* Hourly chart (increased height) */}
            <div style={{ height: 260 }}>
              {forecastList.length > 0 ? (
                <Line data={chartData} options={chartOptions as any} />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', opacity: 0.6 }}>No hourly data available</p>
                </div>
              )}
            </div>

            {/* Forecast cards - make them consistent height and avoid empty space below */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 12, alignItems: 'start', overflowX: 'hidden', paddingBottom: 0 }}>
              {dailyForecasts.length > 0 ? dailyForecasts.map(d => (
                <div key={d.date} className="p-3 rounded-lg" style={{ background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontFamily: 'monospace', textAlign: 'center', minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ fontSize: '0.8rem', color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', marginBottom: 6 }}>{new Date(d.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <img src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`} alt="icon" style={{ width: 48, height: 48, margin: '0 auto' }} />
                  <div style={{ fontWeight: 700, marginTop: 6, color: '#ffffff' }}>{Math.round(d.max)}° / {Math.round(d.min)}°</div>
                  <div style={{ fontSize: '0.75rem', color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', marginTop: 6 }}>{d.description}</div>
                </div>
              )) : (
                <div className="flex items-center justify-center text-center" style={{ gridColumn: '1 / -1', minHeight: '100px', fontFamily: 'monospace', color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', opacity: 0.6 }}>No forecast data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}