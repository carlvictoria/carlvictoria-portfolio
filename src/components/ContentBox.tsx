'use client';

import { User, Mail, Music, PawPrint, Building2, Sun, Moon, Keyboard, Cloud, Pencil, DollarSign, Newspaper, Film, TrendingUp, Map, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import AboutModal from './AboutModal';

export default function ContentBox({ onThemeChange }: { onThemeChange?: (isDarkMode: boolean) => void }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Moon is default (dark mode on)
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  const [loadingStates, setLoadingStates] = useState({
    music: true,
    weather: true,
    news: true,
    movie: true,
    stock: true,
    maps: true,
    chatbot: true
  });

  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    // Update body background color based on theme
    document.body.style.background = isDarkMode ? 'var(--background)' : 'var(--background-l)';
    document.body.style.transition = 'background 0.3s ease';
    
    // Notify parent component of theme change
    if (onThemeChange) {
      onThemeChange(isDarkMode);
    }
  }, [isDarkMode, onThemeChange]);

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);

    // Simulate API loading with random delays
    const timers = [
      setTimeout(() => setLoadingStates(prev => ({ ...prev, music: false })), 2500),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, weather: false })), 3000),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, news: false })), 2800),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, movie: false })), 3200),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, stock: false })), 2600),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, maps: false })), 2900),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, chatbot: false })), 3100),
    ];

    return () => {
      clearInterval(dotsInterval);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      <div 
        className="mt-8 shadow-4xl border border-black-600 rounded-lg w-[1200px] max-w-5xl min-h-[750px] overflow-hidden" 
        style={{ 
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div 
          className="px-4 py-2 border-b flex justify-between items-center"
        style={{
          backgroundColor: isDarkMode ? '#1f2937' : '#E7DCC8',
          borderColor: isDarkMode ? '#4b5563' : '#D4C5A9',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <p style={{
          color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
          fontFamily: 'var(--font-terminal)',
          transition: 'color 0.3s ease'
        }} className="text-center flex-1">
          CMD
        </p>
        <div 
          className="relative flex gap-0 items-center cursor-pointer rounded-full border border-gray-600 bg-gray-700"
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ transition: 'all 0.3s ease', padding: '2px' }}
        >
          <div 
            className="absolute w-6 h-6 bg-gray-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ 
              left: isDarkMode ? '24px' : '1px',
              transition: 'left 0.3s ease-in-out'
            }}
          />
          <Sun 
            size={18} 
            color={isDarkMode ? '#666' : 'var(--title-color-l)'} 
            className="relative z-10 transition-all duration-300"
            style={{ 
              transform: isDarkMode ? 'scale(1)' : 'scale(1.2) rotate(90deg)',
              transition: 'all 0.3s ease-in-out',
              margin: '2px'
            }}
          />
          <Moon 
            size={18} 
            color={isDarkMode ? 'var(--title-color)' : '#666'} 
            className="relative z-10 transition-all duration-300"
            style={{ 
              transform: isDarkMode ? 'scale(1.2) rotate(-20deg)' : 'scale(1)',
              transition: 'all 0.3s ease-in-out',
              margin: '2px'
            }}
          />
        </div>
      </div>
      <div className="p-8 break-words"> 
        <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-3xl font-bold mb-6 ml-10">
          ~$ ls -la
        </p>
        
        <div className="space-y-6">
          {/* Info Section */}
          <div>
            <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-base mb-3">
              [INFO]
            </p>
            <div className="ml-6 space-y-2">
              <p 
                style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                className="text-lg flex items-center gap-2 cursor-pointer hover:opacity-80"
                onClick={() => setShowAboutModal(true)}
              >
                <User size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /About
              </p>
              <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg flex items-center gap-2">
                <Mail size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Contact
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-base mb-3">
              [PROJECTS]
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <PawPrint size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /PawSense
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/pawsense →</span> <a href="https://github.com/Dubuu03/PawSense" style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}} className="hover:underline">https://github.com/Dubuu03/PawSense</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Building2 size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /CSU_Forum
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/forum →</span> <a href="https://github.com/Dubuu03/CSU_Forum" style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}} className="hover:underline">https://github.com/Dubuu03/CSU_Forum</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <DollarSign size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /utangPH
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/utangph →</span> <a href="https://github.com/Dubuu03/utangph" style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}} className="hover:underline">https://github.com/Dubuu03/utangph</a>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Features Section */}
          <div>
            <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-base mb-3">
              [FEATURES]
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Music size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Music Player
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.music ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Music API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-12-10 features/music → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Spotify Web API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Pencil size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Drawing App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-12-08 features/drawing → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>HTML5 Canvas API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Keyboard size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Typing Test
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-12-05 features/typing → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Random Word API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Cloud size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Weather App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.weather ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Weather API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-12-03 features/weather → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>OpenWeatherMap API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Newspaper size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /News
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.news ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading News API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-11-28 features/news → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>NewsAPI</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Film size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Movie Info
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.movie ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Movie API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-11-20 features/movies → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>TMDB API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <TrendingUp size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Stock Prices
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.stock ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Stock API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-11-15 features/stocks → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Alpha Vantage API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Map size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Maps
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.maps ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Maps API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-11-10 features/maps → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Mapbox API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <MessageCircle size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Chatbot
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.chatbot ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading AI Model{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>{'>'} lrwxr-xr-x 1 carlvictoria admin 2025-11-05 features/chatbot → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>OpenAI API</span></>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {showAboutModal && (
        <AboutModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowAboutModal(false)} 
        />
      )}
    </>
  );
}
