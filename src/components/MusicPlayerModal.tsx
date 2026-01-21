'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2, Heart } from 'lucide-react';

interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl60: string;
  trackTimeMillis: number;
  previewUrl: string;
  collectionName: string;
}

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function MusicPlayerModal({ isOpen, onClose, isDarkMode }: MusicPlayerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 500);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Search for tracks using iTunes API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=song&limit=30`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search tracks');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get artwork URL with proper size (iTunes provides different sizes)
  const getArtworkUrl = (url: string, size: number = 500) => {
    if (!url) return 'https://via.placeholder.com/500x500/1a1f2e/FFC600?text=No+Image';
    // Replace the default 100x100 with desired size
    return url.replace('100x100', `${size}x${size}`);
  };

  // Play selected track
  const playTrack = async (track: Track) => {
    if (audioRef.current && track.previewUrl) {
      try {
        audioRef.current.src = track.previewUrl;
        await audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
        
        // Add to queue if not already there
        if (!queue.find(t => t.trackId === track.trackId)) {
          const newQueue = [...queue, track];
          setQueue(newQueue);
          setCurrentTrackIndex(newQueue.length - 1);
        } else {
          const index = queue.findIndex(t => t.trackId === track.trackId);
          setCurrentTrackIndex(index);
        }
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Next track
  const handleNext = () => {
    if (currentTrackIndex < queue.length - 1) {
      const nextTrack = queue[currentTrackIndex + 1];
      playTrack(nextTrack);
    }
  };

  // Previous track
  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      const prevTrack = queue[currentTrackIndex - 1];
      playTrack(prevTrack);
    }
  };

  // Seek to position
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  // Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDarkMode={isDarkMode} title="Music Player">
      <div 
        className="flex gap-6 relative overflow-hidden"
        style={{
          width: '1300px',
          maxWidth: '95vw',
          minWidth: '900px',
          minHeight: '700px',
          fontFamily: 'var(--font-terminal)',
        }}
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(255,198,0,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(39,139,210,0.15) 0%, transparent 70%)',
              top: '-10%',
              left: '-10%',
              animation: 'float 20s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(255,198,0,0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(39,139,210,0.1) 0%, transparent 70%)',
              bottom: '-10%',
              right: '-10%',
              animation: 'float 25s ease-in-out infinite reverse',
            }}
          />
        </div>

        {/* Left Panel - Music Player */}
        <div 
          className="w-96 p-6 rounded-3xl backdrop-blur-xl relative z-10 flex flex-col"
          style={{
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: isDarkMode 
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' 
              : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          {currentTrack ? (
            <>
              {/* Album Art */}
              <div className="flex justify-center mb-6">
                <div className="relative mb-6 group">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-60"
                    style={{
                      background: `url(${getArtworkUrl(currentTrack.artworkUrl100, 600)}) center/cover`,
                    }}
                  />
                  <img
                    src={getArtworkUrl(currentTrack.artworkUrl100, 600)}
                    alt={currentTrack.trackName}
                    className="relative w-56 h-56 rounded-2xl shadow-2xl object-cover"
                  />
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all hover:scale-110"
                    style={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(0, 0, 0, 0.3)' 
                        : 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                      style={{
                        color: isLiked ? '#ef4444' : (isDarkMode ? '#fff' : '#000'),
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Music2 className="w-4 h-4" style={{ color: isDarkMode ? '#FFC600' : '#278BD2' }} />
                  <h4 
                    className="text-lg font-bold truncate"
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontFamily: 'var(--font-terminal)',
                    }}
                  >
                    {currentTrack.trackName}
                  </h4>
                </div>
                <p 
                  className="text-sm opacity-70 truncate"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  {currentTrack.artistName}
                </p>
                <p 
                  className="text-xs opacity-50 mt-1"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  {currentTrack.collectionName}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  onClick={handleProgressClick}
                  className="h-2 rounded-full cursor-pointer mb-2"
                  style={{
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(currentTime / duration) * 100}%`,
                      background: isDarkMode 
                        ? 'linear-gradient(90deg, #FFC600 0%, #FF8C00 100%)'
                        : 'linear-gradient(90deg, #278BD2 0%, #1E5F8C 100%)',
                    }}
                  />
                </div>
                <div 
                  className="flex justify-between text-xs opacity-50"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentTrackIndex === 0}
                  className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <SkipBack className="w-5 h-5" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-4 rounded-full transition-all hover:scale-110"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #FFC600 0%, #FF8C00 100%)'
                      : 'linear-gradient(135deg, #278BD2 0%, #1E5F8C 100%)',
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" style={{ color: '#fff' }} />
                  ) : (
                    <Play className="w-6 h-6" style={{ color: '#fff' }} />
                  )}
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentTrackIndex === queue.length - 1}
                  className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <SkipForward className="w-5 h-5" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                  ) : (
                    <Volume2 className="w-5 h-5" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${isDarkMode ? '#FFC600' : '#278BD2'} 0%, ${isDarkMode ? '#FFC600' : '#278BD2'} ${(isMuted ? 0 : volume) * 100}%, ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} ${(isMuted ? 0 : volume) * 100}%, ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 100%)`,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Music2 
                  className="w-24 h-24 mx-auto mb-4 opacity-20"
                  style={{ color: isDarkMode ? '#fff' : '#000' }}
                />
                <p 
                  className="text-lg opacity-50"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  Search and play music
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Search & Results */}
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          {/* Search Bar */}
          <div className="relative">
            <div 
              className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl"
              style={{
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Search className="w-5 h-5 opacity-50" style={{ color: isDarkMode ? '#fff' : '#000' }} />
              <input
                type="text"
                placeholder="Search for songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="flex-1 bg-transparent outline-none"
                style={{
                  color: isDarkMode ? '#fff' : '#000',
                  fontFamily: 'var(--font-terminal)',
                }}
              />
              {isLoading && (
                <div 
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: isDarkMode ? '#FFC600' : '#278BD2',
                    borderTopColor: 'transparent',
                  }}
                />
              )}
            </div>
          </div>

          {/* Search Results */}
          <div 
            className="flex-1 p-4 rounded-2xl backdrop-blur-xl overflow-y-auto"
            style={{
              backgroundColor: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              maxHeight: 'calc(700px - 120px)',
            }}
          >
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((track) => (
                  <div
                    key={track.trackId}
                    onClick={() => playTrack(track)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: currentTrack?.trackId === track.trackId
                        ? isDarkMode 
                          ? 'rgba(255, 198, 0, 0.2)' 
                          : 'rgba(39, 139, 210, 0.2)'
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (currentTrack?.trackId !== track.trackId) {
                        e.currentTarget.style.backgroundColor = isDarkMode 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(0, 0, 0, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTrack?.trackId !== track.trackId) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } else {
                        e.currentTarget.style.backgroundColor = isDarkMode 
                          ? 'rgba(255, 198, 0, 0.2)' 
                          : 'rgba(39, 139, 210, 0.2)';
                      }
                    }}
                  >
                    <img
                      src={getArtworkUrl(track.artworkUrl100, 300)}
                      alt={track.trackName}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-medium truncate text-sm"
                        style={{
                          color: isDarkMode ? '#fff' : '#000',
                          fontFamily: 'var(--font-terminal)',
                        }}
                      >
                        {track.trackName}
                      </p>
                      <p 
                        className="text-xs truncate opacity-60"
                        style={{
                          color: isDarkMode ? '#fff' : '#000',
                          fontFamily: 'var(--font-terminal)',
                        }}
                      >
                        {track.artistName}
                      </p>
                    </div>
                    <span 
                      className="text-xs opacity-50 flex-shrink-0"
                      style={{
                        color: isDarkMode ? '#fff' : '#000',
                        fontFamily: 'var(--font-terminal)',
                      }}
                    >
                      {formatTime(track.trackTimeMillis / 1000)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p 
                  className="text-lg opacity-50"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  {searchQuery ? 'No results found' : 'Start searching for music'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -50px) rotate(120deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(240deg);
            }
          }
          
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${isDarkMode ? '#FFC600' : '#278BD2'};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${isDarkMode ? '#FFC600' : '#278BD2'};
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
    </Modal>
  );
}
