'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Search, MapPin, Navigation, Layers, ZoomIn, ZoomOut, Compass, Globe, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false, loading: () => <MapLoadingPlaceholder /> }
);
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// MapController imported with proper typing
const MapController = dynamic<{ center: [number, number]; zoom: number }>(
  () => import('./MapController').then(mod => mod.default as any),
  { ssr: false }
);

// Loading placeholder for map
function MapLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-900/50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--title-color)' }} />
        <span style={{ fontFamily: 'monospace', color: 'var(--cmd-title)' }}>Loading map...</span>
      </div>
    </div>
  );
}

// Fix Leaflet marker icons - must be done client-side
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
};

interface MapsModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface MarkedLocation {
  lat: number;
  lon: number;
  name: string;
}

export default function MapsModal({ isDarkMode, onClose, minimizedIndex = 0 }: MapsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.5995, 120.9842]); // Default to Manila
  const [mapZoom, setMapZoom] = useState(12);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [markedLocation, setMarkedLocation] = useState<MarkedLocation | null>(null);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Fix Leaflet icons on mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    // Delay map rendering for smooth animation
    const timer = setTimeout(() => setIsMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        fetchLocationSuggestions(searchQuery);
      }, 400);
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
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const locations = await response.json();
        setSuggestions(locations);
        setShowSuggestions(locations.length > 0);
      }
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      selectLocation(suggestions[0]);
    } else if (searchQuery.trim()) {
      // If no suggestions but query exists, do a direct search
      fetchLocationSuggestions(searchQuery).then(() => {
        if (suggestions.length > 0) {
          selectLocation(suggestions[0]);
        }
      });
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e as unknown as React.FormEvent);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    setMapCenter([lat, lon]);
    setMapZoom(14);
    setMarkedLocation({
      lat,
      lon,
      name: location.display_name
    });
    setLocationInfo(location.display_name);
    setSearchQuery(location.display_name.split(',')[0]);
    setShowSuggestions(false);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 2));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
          setMarkedLocation({
            lat: latitude,
            lon: longitude,
            name: 'Your Location'
          });
          setLocationInfo('Your current location');
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        }
      );
    }
  };

  const getMapTileUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return isDarkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="Interactive Maps"
      width="1100px"
      minWidth="900px"
      minHeight="650px"
      showTypingAnimation={true}
      typingText="maps-explorer.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <p 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontSize: '0.75rem', 
              fontFamily: 'monospace' 
            }}
          >
            ~$ ./maps-explorer --mode=interactive
          </p>
        </div>

        {/* Project Info Card */}
        <div 
          className="mb-4 p-4 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <h2 
            style={{ 
              color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
              fontFamily: 'monospace', 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
          >
            Interactive Maps Explorer
          </h2>
          <p 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontFamily: 'monospace', 
              fontSize: '0.875rem',
              opacity: 0.8
            }}
          >
            Explore locations worldwide with real-time search, multiple map styles, and geolocation support.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Leaflet', 'OpenStreetMap', 'Nominatim API', 'Geolocation'].map((tech) => (
              <span 
                key={tech}
                className="px-2 py-1 rounded text-xs"
                style={{
                  background: isDarkMode ? 'rgba(255, 198, 0, 0.15)' : 'rgba(39, 139, 210, 0.15)',
                  color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                  fontFamily: 'monospace'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-4 space-y-3">
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
                  placeholder="Search any location (e.g., Tokyo, Paris, New York...)"
                  className="w-full pl-12 pr-4 py-3 rounded-lg transition-all"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border max-h-60 overflow-y-auto z-50"
                    style={{
                      background: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                      backdropFilter: 'blur(10px)'
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
                        <MapPin size={16} style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} className="truncate">
                          {location.display_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 rounded-lg transition-all flex items-center gap-2"
                style={{
                  background: isDarkMode ? 'rgba(255, 198, 0, 0.1)' : 'rgba(39, 139, 210, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 198, 0, 0.3)' : 'rgba(39, 139, 210, 0.3)'}`,
                  color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}></div>
                ) : (
                  <Search size={16} />
                )}
                Search
              </button>
            </div>
          </form>

          {/* Map Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Map Style Selector */}
            <div className="flex gap-2">
              {[
                { id: 'standard', label: 'Standard', icon: Globe },
                { id: 'satellite', label: 'Satellite', icon: Layers },
                { id: 'terrain', label: 'Terrain', icon: Compass }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMapStyle(id as 'standard' | 'satellite' | 'terrain')}
                  className="px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                  style={{
                    background: mapStyle === id 
                      ? (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                      : (isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'),
                    border: `1px solid ${mapStyle === id 
                      ? (isDarkMode ? 'rgba(255, 198, 0, 0.5)' : 'rgba(39, 139, 210, 0.5)')
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')}`,
                    color: mapStyle === id 
                      ? (isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)')
                      : (isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'),
                    fontFamily: 'monospace',
                    fontSize: '0.75rem'
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Zoom & Location Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                }}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                }}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={handleGetCurrentLocation}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
                  color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)'
                }}
                title="Get Current Location"
              >
                <Navigation size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div 
          className="flex-1 rounded-lg overflow-hidden relative"
          style={{
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            minHeight: '350px'
          }}
        >
          {!isMapReady && <MapLoadingPlaceholder />}
          {isMapReady && (
            <MapContainer
              key={`${mapStyle}-${isDarkMode}`}
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                key={`tile-${mapStyle}-${isDarkMode}`}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={getMapTileUrl()}
              />
              {markedLocation && (
                <Marker position={[markedLocation.lat, markedLocation.lon]}>
                  <Popup>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {markedLocation.name}
                    </span>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}

          {/* Location Info Overlay */}
          {locationInfo && (
            <div 
              className="absolute bottom-4 left-4 right-4 p-3 rounded-lg z-[1000]"
              style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', flexShrink: 0 }} />
                <span 
                  style={{ 
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                    fontFamily: 'monospace', 
                    fontSize: '0.875rem' 
                  }}
                  className="truncate"
                >
                  {locationInfo}
                </span>
              </div>
              <div 
                className="mt-2 text-xs"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  fontFamily: 'monospace'
                }}
              >
                Lat: {markedLocation?.lat.toFixed(4)} | Lon: {markedLocation?.lon.toFixed(4)}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
