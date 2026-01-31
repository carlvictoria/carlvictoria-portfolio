'use client';

import { User, Mail, Music, PawPrint, Building2, Sun, Moon, Keyboard, 
        Cloud, Pencil, DollarSign, Newspaper, Film, TrendingUp, Map, MessageCircle, FolderOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import AboutModal from './AboutModal';
import TypingTestModal from './TypingTestModal';
import MusicPlayerModal from './MusicPlayerModal';
import CryptoModal from './CryptoModal';
import WeatherModal from './WeatherModal';
import NewsModal from './NewsModal';
import MapsModal from './MapsModal';
import ChatbotModal from './ChatbotModal';
import DrawingModal from './DrawingModal';
import ProjectContentBox from './ProjectContentBox';
import ProjectsShowcaseModal from './ProjectsShowcaseModal';
import ContactModal from './ContactModal';

export default function ContentBox({ onThemeChange, onClose, onMusicStateChange }: { onThemeChange?: (isDarkMode: boolean) => void; onClose?: () => void; onMusicStateChange?: (isPlaying: boolean) => void }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Moon is default (dark mode on)
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTypingTest, setShowTypingTest] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Project content boxes state
  const [showMapsProject, setShowMapsProject] = useState(false);
  const [showChatbotProject, setShowChatbotProject] = useState(false);
  const [showDrawingProject, setShowDrawingProject] = useState(false);
  const [showProjectsShowcase, setShowProjectsShowcase] = useState(false);
  
  const [loadingStates, setLoadingStates] = useState({
    music: true,
    weather: true,
    news: true,
    movie: true,
    crypto: true,
    maps: true,
    chatbot: true,
    drawing: true
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
      setTimeout(() => setLoadingStates(prev => ({ ...prev, crypto: false })), 2900),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, maps: false })), 2700),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, chatbot: false })), 3100),
      setTimeout(() => setLoadingStates(prev => ({ ...prev, drawing: false })), 2950),
    ];

    return () => {
      clearInterval(dotsInterval);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      <div 
        className="mt-8 shadow-4xl border border-black-600 rounded-lg w-[1200px] max-w-5xl overflow-hidden" 
        style={{ 
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease',
          maxHeight: '85vh'
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
        {/* Theme Toggle on Left */}
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
        
        {/* Title */}
        <p style={{
          color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
          fontFamily: 'var(--font-terminal)',
          transition: 'color 0.3s ease'
        }} className="text-center flex-1">
          CMD
        </p>
      </div>
      <div className="p-8 break-words overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(85vh - 50px)' }}> 
        <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-3xl font-bold mb-6 ml-10">
          ~$ ls -la
        </p>
        
        <div className="space-y-6">
          {/* Info Section */}
          <div className="flex justify-between items-start">
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
                <p 
                  style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                  className="text-lg flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => setShowContactModal(true)}
                >
                  <Mail size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Contact
                </p>
              </div>
            </div>
            
            <pre style={{
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              lineHeight: '1.1',
              transition: 'color 0.3s ease',
              marginRight: '2rem',
              fontWeight: 'bold'
            }}>
{` ____   __   ____  ____  ____  __   __    __   __  
(  _ \\ /  \\ (  _ \\(_  _)(  __)/  \\ (  )  (  ) /  \\ 
 ) __/(  O ) )   /  )(   ) _)(  O )/ (_/\\ )( (  O )
(__)   \\__/ (__\\_) (__) (__)  \\__/ \\____/(__) \\__/`}
            </pre>
          </div>

          {/* Projects Section */}
          <div>
            <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-base mb-3">
              [PROJECTS]
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p 
                  onClick={() => setShowProjectsShowcase(true)}
                  style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                  className="text-lg w-64 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                  <FolderOpen size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /View All Projects
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ drwxr-xr-x 3 carlvictoria admin 2025-01-15 projects/</span> <span style={{color: isDarkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(22, 163, 74, 0.8)', fontSize: '0.6rem'}}>[CLICK TO OPEN]</span>
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
                <p 
                  style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                  className="text-lg w-64 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => setShowMusicPlayer(true)}
                >
                  <Music size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Music Player
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.music ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Music API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-12-10 features/music → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Spotify Web API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowWeatherModal(true)}>
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Cloud size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Weather App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.weather ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Weather API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-12-03 features/weather → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>OpenWeatherMap API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowNewsModal(true)}>
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Newspaper size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /News
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.news ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading News API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-11-28 features/news → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>NewsAPI</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <p 
                  style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                  className="text-lg w-64 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => setShowCrypto(true)}
                >
                  <DollarSign size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Crypto Tracker
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.crypto ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Crypto API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-01-21 features/crypto → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>CoinGecko API</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowMapsModal(true)}>
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Map size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Maps
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.maps ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading Maps API{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-11-10 features/maps → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Leaflet + OSM</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowChatbotModal(true)}>
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <MessageCircle size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Chatbot
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  {loadingStates.chatbot ? (
                    <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>[Downloading AI Model{loadingDots}]</span>
                  ) : (
                    <><span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-11-05 features/chatbot → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Rule-based AI</span></>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Playground Section */}
          <div>
            <p style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-base mb-3">
              [PLAYGROUND]
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p 
                  style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} 
                  className="text-lg w-64 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80"
                  onClick={() => setShowTypingTest(true)}
                >
                  <Keyboard size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Typing Test
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-12-05 playground/typing → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>Random Word API</span>
                </p>
              </div>
              <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowDrawingModal(true)}>
                <p style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'var(--font-terminal)', transition: 'color 0.3s ease'}} className="text-lg w-64 flex-shrink-0 flex items-center gap-2">
                  <Pencil size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} /> /Drawing App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)', fontSize: '0.65rem'}}>
                  <span style={{color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', transition: 'color 0.3s ease'}}>~$ lrwxr-xr-x 1 carlvictoria admin 2025-12-08 playground/drawing → API:</span> <span style={{color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease'}}>HTML5 Canvas API</span>
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
          minimizedIndex={0}
        />
      )}
      
      {showTypingTest && (
        <TypingTestModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowTypingTest(false)}
          minimizedIndex={showAboutModal ? 1 : 0}
        />
      )}
      
      {showMusicPlayer && (
        <MusicPlayerModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowMusicPlayer(false)}
          onMusicStateChange={onMusicStateChange}
        />
      )}
      
      {showCrypto && (
        <CryptoModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowCrypto(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0)}
        />
      )}
      
      {showWeatherModal && (
        <WeatherModal 
          onClose={() => setShowWeatherModal(false)}
          isDarkMode={isDarkMode}
          showTypingAnimation={true}
        />
      )}
      
      {showNewsModal && (
        <NewsModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowNewsModal(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0)}
        />
      )}
      
      {showMapsModal && (
        <MapsModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowMapsModal(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0) + (showNewsModal ? 1 : 0)}
        />
      )}
      
      {showChatbotModal && (
        <ChatbotModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowChatbotModal(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0) + (showNewsModal ? 1 : 0) + (showMapsModal ? 1 : 0)}
        />
      )}
      
      {showDrawingModal && (
        <DrawingModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowDrawingModal(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0) + (showNewsModal ? 1 : 0) + (showMapsModal ? 1 : 0) + (showChatbotModal ? 1 : 0)}
        />
      )}
      
      {/* Project Content Boxes */}
      {showMapsProject && (
        <ProjectContentBox
          isDarkMode={isDarkMode}
          title="Maps Explorer"
          description="Interactive location search & mapping application"
          icon={Map}
          technologies={['Leaflet.js', 'OpenStreetMap', 'Nominatim API', 'Geolocation API']}
          features={[
            { label: 'Location Search', description: 'Search for any location worldwide with autocomplete suggestions' },
            { label: 'Multiple Map Styles', description: 'Switch between Standard, Satellite, and Terrain views' },
            { label: 'Geolocation', description: 'Get your current location with one click' },
            { label: 'Interactive Controls', description: 'Zoom, pan, and explore with intuitive map controls' }
          ]}
          accentColor={{ dark: 'rgba(34, 197, 94, 1)', light: 'rgba(22, 163, 74, 1)' }}
          onLaunch={() => { setShowMapsProject(false); setShowMapsModal(true); }}
          onClose={() => setShowMapsProject(false)}
        />
      )}
      
      {showChatbotProject && (
        <ProjectContentBox
          isDarkMode={isDarkMode}
          title="AI Chatbot"
          description="Portfolio AI assistant with natural conversation"
          icon={MessageCircle}
          technologies={['Rule-based AI', 'Pattern Matching', 'React Hooks', 'TypeScript']}
          features={[
            { label: 'Natural Conversation', description: 'Chat naturally about Carl\'s skills, projects, and experience' },
            { label: 'Portfolio Knowledge', description: 'Knows all about the portfolio features and how to use them' },
            { label: 'Quick Actions', description: 'One-click shortcuts for common questions' },
            { label: 'Real-time Responses', description: 'Instant, context-aware answers to your queries' }
          ]}
          accentColor={{ dark: 'rgba(139, 92, 246, 1)', light: 'rgba(124, 58, 237, 1)' }}
          onLaunch={() => { setShowChatbotProject(false); setShowChatbotModal(true); }}
          onClose={() => setShowChatbotProject(false)}
        />
      )}
      
      {showDrawingProject && (
        <ProjectContentBox
          isDarkMode={isDarkMode}
          title="Drawing Canvas"
          description="Creative canvas with community gallery"
          icon={Pencil}
          technologies={['HTML5 Canvas', 'Touch Support', 'MongoDB', 'REST API']}
          features={[
            { label: 'Creative Tools', description: 'Multiple brush sizes, colors, and an eraser tool' },
            { label: 'Save to Gallery', description: 'Save your artwork with your name to the community gallery' },
            { label: 'Community Gallery', description: 'View all submissions from other visitors' },
            { label: 'Download', description: 'Download your artwork as a PNG image' }
          ]}
          accentColor={{ dark: 'rgba(236, 72, 153, 1)', light: 'rgba(219, 39, 119, 1)' }}
          onLaunch={() => { setShowDrawingProject(false); setShowDrawingModal(true); }}
          onClose={() => setShowDrawingProject(false)}
        />
      )}
      
      {showProjectsShowcase && (
        <ProjectsShowcaseModal
          isDarkMode={isDarkMode}
          onClose={() => setShowProjectsShowcase(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0) + (showNewsModal ? 1 : 0) + (showMapsModal ? 1 : 0) + (showChatbotModal ? 1 : 0) + (showDrawingModal ? 1 : 0)}
        />
      )}
      
      {showContactModal && (
        <ContactModal
          isDarkMode={isDarkMode}
          onClose={() => setShowContactModal(false)}
          minimizedIndex={(showAboutModal ? 1 : 0) + (showTypingTest ? 1 : 0) + (showMusicPlayer ? 1 : 0) + (showCrypto ? 1 : 0) + (showWeatherModal ? 1 : 0) + (showNewsModal ? 1 : 0) + (showMapsModal ? 1 : 0) + (showChatbotModal ? 1 : 0) + (showDrawingModal ? 1 : 0) + (showProjectsShowcase ? 1 : 0)}
        />
      )}
    </>
  );
}
