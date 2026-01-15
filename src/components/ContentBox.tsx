import { User, Mail, Music, Gamepad2, Diamond, Building2, Image, Target, Link, Globe, BarChart3, Zap, UserCircle, Home, Palette } from 'lucide-react';

export default function ContentBox() {
  return (
   <div className="mt-8 border border-black-600 rounded-lg w-[1200px] max-w-5xl min-h-[750px] overflow-hidden" style={{ backgroundColor: 'var(--cmd-background)'}}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
        <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-center flex-1">
          CMD
        </p>
        <div className="flex gap-2">
          <span className="text-white text-xl">☀️</span>
          <span className="text-yellow-400 text-xl">🌙</span>
        </div>
      </div>
      <div className="p-8 break-words">
        <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-2xl font-bold mb-6">
          ~ $ls -la
        </p>
        
        <div className="space-y-6">
          {/* Info Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-sm mb-3">
              → Info:
            </p>
            <div className="ml-6 space-y-2">
              <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base flex items-center gap-2">
                <User size={16} color="var(--cmd-title)" /> /About
              </p>
              <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base flex items-center gap-2">
                <Mail size={16} color="var(--cmd-title)" /> /Contact
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-sm mb-3">
              → Projects:
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Music size={16} color="var(--cmd-title)" /> /Spottedify
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2024-09-25 projects/spottedify → <a href="https://github.com/Kielx/Spottedify" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/Spottedify</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Gamepad2 size={16} color="var(--cmd-title)" /> /Super Arkanoid
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2024-09-25 projects/arkanoid → <a href="https://github.com/Kielx/Arkanoid" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/Arkanoid</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Diamond size={16} color="var(--cmd-title)" /> /AnyGrabber
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2023-07-14 projects/anygrabber → <a href="https://github.com/Kielx/AnyGrabber" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/AnyGrabber</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Building2 size={16} color="var(--cmd-title)" /> /Insurance-DB
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2023-01-14 → <a href="https://github.com/Kielx/Insurance-company-database" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/Insurance-company-database</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Image size={16} color="var(--cmd-title)" /> /My-Unsplash
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-10-01 projects/my-unsplash → <a href="https://github.com/Kielx/my-unsplash" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/my-unsplash</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Target size={16} color="var(--cmd-title)" /> /IP Tracker
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-24 projects/ip-tracker → <a href="https://github.com/Kielx/ip-tracker" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/ip-tracker</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Link size={16} color="var(--cmd-title)" /> /Shortly
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-08 projects/shortly → <a href="https://github.com/Kielx/url-shortener" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/url-shortener</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Globe size={16} color="var(--cmd-title)" /> /Country Quiz
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-07 projects/country-quiz → <a href="https://github.com/Kielx/country-quiz" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/country-quiz</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <BarChart3 size={16} color="var(--cmd-title)" /> /Expenses Analyzer
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-05 projects/expenses-analyzer → <a href="https://github.com/Kielx/expenses-analyzer" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/expenses-analyzer</a>
                </p>
              </div>
            </div>
          </div>

          {/* Mini-Projects Section */}
          <div>
            <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-sm mb-3">
              → Mini-Projects:
            </p>
            <div className="ml-6 space-y-2">
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Zap size={16} color="var(--cmd-title)" /> /Arduino Knight Rider
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2023-01-09 projects/arduino-knight-rider → <a href="https://github.com/Kielx/arduino-knight-rider" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/arduino-knight-rider</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <UserCircle size={16} color="var(--cmd-title)" /> /2-Input Perceptron
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2022-05-05 projects/perceptron → <a href="https://github.com/Kielx/2-Input-Single-Layer-Perceptron" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/2-Input-Single-Layer-Perceptron</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Home size={16} color="var(--cmd-title)" /> /Sunnyside-Agency
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-02 projects/sunnyside → <a href="https://github.com/Kielx/Sunnyside" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/Sunnyside</a>
                </p>
              </div>
              <div className="flex gap-4">
                <p style={{color: '#FFC600', fontFamily: 'var(--font-terminal)'}} className="text-base w-48 flex-shrink-0 flex items-center gap-2">
                  <Palette size={16} color="var(--cmd-title)" /> /Etch-a-sketch
                </p>
                <p style={{color: '#888', fontFamily: 'var(--font-terminal)'}} className="text-xs">
                  lrwxr-xr-x 1 kielx admin 2021-08-01 projects/etch-a-sketch → <a href="https://github.com/Kielx/etch-a-sketch" style={{color: '#FFC600'}} className="hover:underline">https://github.com/Kielx/etch-a-sketch</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
