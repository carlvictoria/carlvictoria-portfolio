import { User, Mail, Music, Gamepad2, Building2, Sun, Moon, Keyboard, Cloud, Pencil, DollarSign, Newspaper, Film, TrendingUp, Map, MessageCircle } from 'lucide-react';

export default function ContentBox() {
  return (
   <div className="mt-8 shadow-lg border border-black-600 rounded-lg w-[1200px] max-w-5xl min-h-[750px] overflow-hidden" style={{ backgroundColor: 'var(--cmd-background)'}}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
        <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-center flex-1">
          CMD
        </p>
        <div className="flex gap-1 items-center">
          <Sun size={18} color="white" />
          <Moon size={18} color="#FFC600" />
        </div>
      </div>
      <div className="p-8 break-words"> 
        <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-3xl font-bold mb-6">
          ~ $ls -la
        </p>
        
        <div className="space-y-6">
          {/* Info Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-base mb-3">
              → Info:
            </p>
            <div className="ml-6 space-y-2">
              <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg flex items-center gap-2">
                <User size={16} color="var(--cmd-title)" /> /About
              </p>
              <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg flex items-center gap-2">
                <Mail size={16} color="var(--cmd-title)" /> /Contact
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-base mb-3">
              → Projects:
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Gamepad2 size={16} color="var(--cmd-title)" /> /PawSense
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/pawsense →</span> <a href="https://github.com/Dubuu03/PawSense" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Dubuu03/PawSense</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Building2 size={16} color="var(--cmd-title)" /> /CSU_Forum
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/forum →</span> <a href="https://github.com/Dubuu03/CSU_Forum" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Dubuu03/CSU_Forum</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <DollarSign size={16} color="var(--cmd-title)" /> /utangPH
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-01-15 projects/utangph →</span> <a href="https://github.com/Dubuu03/utangph" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Dubuu03/utangph</a>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Features Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-base mb-3">
              → Interactive Features:
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Music size={16} color="var(--cmd-title)" /> /Music Player
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-12-10 features/music → API:</span> <span style={{color: '#FFC600'}}>Spotify Web API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Pencil size={16} color="var(--cmd-title)" /> /Drawing App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-12-08 features/drawing → API:</span> <span style={{color: '#FFC600'}}>HTML5 Canvas API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Keyboard size={16} color="var(--cmd-title)" /> /Typing Test
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-12-05 features/typing → API:</span> <span style={{color: '#FFC600'}}>Random Word API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Cloud size={16} color="var(--cmd-title)" /> /Weather App
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-12-03 features/weather → API:</span> <span style={{color: '#FFC600'}}>OpenWeatherMap API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Newspaper size={16} color="var(--cmd-title)" /> /News
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-11-28 features/news → API:</span> <span style={{color: '#FFC600'}}>NewsAPI</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Film size={16} color="var(--cmd-title)" /> /Movie Info
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-11-20 features/movies → API:</span> <span style={{color: '#FFC600'}}>TMDB API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <TrendingUp size={16} color="var(--cmd-title)" /> /Stock Prices
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-11-15 features/stocks → API:</span> <span style={{color: '#FFC600'}}>Alpha Vantage API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <Map size={16} color="var(--cmd-title)" /> /Maps
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-11-10 features/maps → API:</span> <span style={{color: '#FFC600'}}>Mapbox API</span>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-lg w-48 flex-shrink-0 flex items-center gap-2">
                  <MessageCircle size={16} color="var(--cmd-title)" /> /Chatbot
                </p>
                <p style={{fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  <span style={{color: 'var(--cmd-title)'}}>lrwxr-xr-x 1 carlvictoria admin 2025-11-05 features/chatbot → API:</span> <span style={{color: '#FFC600'}}>OpenAI API</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
