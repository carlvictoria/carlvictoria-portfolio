'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music2, Heart, X } from 'lucide-react';

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
  onClose: () => void;
  isDarkMode: boolean;
  onMusicStateChange?: (isPlaying: boolean) => void;
}

export default function MusicPlayerModal({ onClose, isDarkMode, onMusicStateChange }: MusicPlayerModalProps) {
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

  // Notify parent about music playing state
  useEffect(() => {
    if (onMusicStateChange) {
      onMusicStateChange(isPlaying);
    }
  }, [isPlaying, onMusicStateChange]);

  // Clean up when component unmounts or closes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      // Reset music playing state when modal closes
      if (onMusicStateChange) {
        onMusicStateChange(false);
      }
    };
  }, [onMusicStateChange]);

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
    <Modal isDarkMode={isDarkMode} onClose={onClose} title="Music Player" width="750px" minWidth="700px" minHeight="400px" showTypingAnimation={true} typingText="musicplayer.exe">
      <div 
        className="flex gap-4 relative overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '500px',
          fontFamily: 'var(--font-terminal)',
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(255,198,0,0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(39,139,210,0.3) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              animation: 'float 25s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(255,100,100,0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(100,150,255,0.2) 0%, transparent 70%)',
              bottom: '10%',
              right: '15%',
              animation: 'float 30s ease-in-out infinite reverse',
            }}
          />
        </div>

        {/* Main Player Card */}
        <div className="w-80 flex-shrink-0 flex items-center justify-center relative z-10">
          <div 
            className="w-full h-full rounded-2xl backdrop-blur-2xl p-4 shadow-2xl flex flex-col"
            style={{
              backgroundColor: isDarkMode 
                ? 'rgba(20, 25, 35, 0.85)' 
                : 'rgba(255, 255, 255, 0.85)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            {currentTrack ? (
              <div className="flex flex-col h-full justify-center space-y-3">
                {/* Album Art */}
                <div className="relative group flex-shrink-0">
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl opacity-40 transition-opacity group-hover:opacity-60"
                    style={{
                      background: `url(${getArtworkUrl(currentTrack.artworkUrl100, 300)}) center/cover`,
                    }}
                  />
                  <img
                    src={getArtworkUrl(currentTrack.artworkUrl100, 300)}
                    alt={currentTrack.trackName}
                    className="relative w-full aspect-square rounded-xl shadow-xl object-cover max-h-48"
                  />
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-xl transition-all hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(0, 0, 0, 0.4)' 
                        : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`}
                      style={{
                        color: isLiked ? '#ef4444' : (isDarkMode ? '#fff' : '#000'),
                      }}
                    />
                  </button>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-1">
                  <h3 
                    className="text-base font-bold truncate px-2"
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontFamily: 'var(--font-terminal)',
                    }}
                  >
                    {currentTrack.trackName}
                  </h3>
                  <p 
                    className="text-sm opacity-60 truncate px-2"
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontFamily: 'var(--font-terminal)',
                    }}
                  >
                    {currentTrack.artistName}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="px-2">
                  <div 
                    onClick={handleProgressClick}
                    className="h-1.5 rounded-full cursor-pointer mb-2 relative overflow-hidden"
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
                    className="flex justify-between text-xs opacity-50 px-1"
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
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentTrackIndex === 0}
                    className="p-2 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <SkipBack className="w-4 h-4" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                  </button>
                  
                  <button
                    onClick={togglePlayPause}
                    className="p-3 rounded-full transition-all hover:scale-110 active:scale-95 shadow-xl"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #FFC600 0%, #FF8C00 100%)'
                        : 'linear-gradient(135deg, #278BD2 0%, #1E5F8C 100%)',
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" style={{ color: '#fff' }} />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" style={{ color: '#fff' }} />
                    )}
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={currentTrackIndex === queue.length - 1}
                    className="p-2 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <SkipForward className="w-4 h-4" style={{ color: isDarkMode ? '#fff' : '#000' }} />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 px-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.03)',
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
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${isDarkMode ? '#FFC600' : '#278BD2'} 0%, ${isDarkMode ? '#FFC600' : '#278BD2'} ${(isMuted ? 0 : volume) * 100}%, ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} ${(isMuted ? 0 : volume) * 100}%, ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 100%)`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Music2 
                  className="w-16 h-16 mb-2 opacity-20"
                  style={{ color: isDarkMode ? '#fff' : '#000' }}
                />
                <p 
                  className="text-sm opacity-50 text-center"
                  style={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontFamily: 'var(--font-terminal)',
                  }}
                >
                  Search for music
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search and Results Panel - Bento Box Style */}
        <div 
          className="flex flex-col gap-3 relative z-10 h-full flex-1 min-w-0"
        >
          {/* Search Bar */}
          <div className="flex-shrink-0">
            <div 
              className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-xl shadow-lg"
              style={{
                backgroundColor: isDarkMode 
                  ? 'rgba(20, 25, 35, 0.85)' 
                  : 'rgba(255, 255, 255, 0.85)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Search className="w-5 h-5 opacity-50" style={{ color: isDarkMode ? '#fff' : '#000' }} />
              <input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="flex-1 bg-transparent outline-none placeholder-opacity-50 min-w-0"
                style={{
                  color: isDarkMode ? '#fff' : '#000',
                  fontFamily: 'var(--font-terminal)',
                  maxWidth: '100%',
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
            className="flex-1 rounded-xl backdrop-blur-xl overflow-hidden shadow-lg min-h-0"
            style={{
              backgroundColor: isDarkMode 
                ? 'rgba(20, 25, 35, 0.85)' 
                : 'rgba(255, 255, 255, 0.85)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <div className="h-full overflow-y-auto p-2 space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((track) => (
                  <div
                    key={track.trackId}
                    onClick={() => playTrack(track)}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      backgroundColor: currentTrack?.trackId === track.trackId
                        ? isDarkMode 
                          ? 'rgba(255, 198, 0, 0.15)' 
                          : 'rgba(39, 139, 210, 0.15)'
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (currentTrack?.trackId !== track.trackId) {
                        e.currentTarget.style.backgroundColor = isDarkMode 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTrack?.trackId !== track.trackId) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } else {
                        e.currentTarget.style.backgroundColor = isDarkMode 
                          ? 'rgba(255, 198, 0, 0.15)' 
                          : 'rgba(39, 139, 210, 0.15)';
                      }
                    }}
                  >
                    <img
                      src={getArtworkUrl(track.artworkUrl100, 150)}
                      alt={track.trackName}
                      className="w-10 h-10 rounded-lg object-cover shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-semibold truncate text-sm"
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
                      className="text-xs opacity-40 flex-shrink-0 ml-1"
                      style={{
                        color: isDarkMode ? '#fff' : '#000',
                        fontFamily: 'var(--font-terminal)',
                      }}
                    >
                      {formatTime(track.trackTimeMillis / 1000)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Search 
                    className="w-12 h-12 mb-2 opacity-10"
                    style={{ color: isDarkMode ? '#fff' : '#000' }}
                  />
                  <p 
                    className="text-xs opacity-40 text-center px-4"
                    style={{
                      color: isDarkMode ? '#fff' : '#000',
                      fontFamily: 'var(--font-terminal)',
                    }}
                  >
                    {searchQuery ? 'No results found' : 'Start searching'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -30px) rotate(120deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(240deg);
            }
          }
          
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: ${isDarkMode ? '#FFC600' : '#278BD2'};
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: ${isDarkMode ? '#FFC600' : '#278BD2'};
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
          }
          
          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.2);
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? 'rgba(255, 198, 0, 0.3)' : 'rgba(39, 139, 210, 0.3)'};
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? 'rgba(255, 198, 0, 0.5)' : 'rgba(39, 139, 210, 0.5)'};
          }
        `}</style>
      </div>
    </Modal>
  );
}
