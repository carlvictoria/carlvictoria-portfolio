'use client';

import { useState, useEffect } from 'react';
import ContentBox from './ContentBox';
import FloatingStars from './FloatingStars';
import SoundWave from './SoundWave';
import Footer from './Footer';

export default function GreetingAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [showFinal, setShowFinal] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [moveToLeft, setMoveToLeft] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(isDarkMode);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    setCurrentTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const greetings = [
      'Hello>', 'Hola>', 'Bonjour>', 'Ciao>', 'Hallo>', 
      'Olá>', 'Привет>', 'こんにちは>', '안녕하세요>',
      'Hej>', 'Namaste>', 'Sawubona>', 'Kamusta>'
    ];
    
    let index = 0;
    let cycles = 0;
    const maxCycles = 1;
    
    const interval = setInterval(() => {
      setDisplayText(greetings[index]);
      index++;
      
      if (index >= greetings.length) {
        index = 0;
        cycles++;
        
        if (cycles >= maxCycles) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFinal(true);
            // Start typing the final text letter by letter
            const finalText = 'C:\\Users\\CarlVictoria>';
            let charIndex = 0;
            const typingInterval = setInterval(() => {
              if (charIndex < finalText.length) {
                setTypedText(finalText.substring(0, charIndex + 1));
                charIndex++;
              } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                  setMoveToLeft(true);
                  setTimeout(() => {
                    setMoveToTop(true);
                    // Show footer after content appears
                    setTimeout(() => setShowFooter(true), 1500);
                  }, 1000);
                }, 100);
              }
            }, 100);
          }, 50);
        }
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <FloatingStars isDarkMode={currentTheme} />
      <SoundWave isDarkMode={currentTheme} isPlaying={isMusicPlaying} />
      <div 
        className="transition-all duration-[1000ms] ease-in-out flex flex-col items-center flex-1"
        style={{
          transform: moveToTop ? 'translateY(4rem)' : 'translateY(50vh)',
          position: 'relative',
          zIndex: 1,
        }}
      >
      <h1 
        className="text-5xl font-bold transition-all duration-[1500ms] ease-in-out flex items-center -mt-5"
        style={{
          color: currentTheme ? 'var(--title-color)' : 'var(--title-color-l)', 
          fontFamily: 'var(--font-terminal)',
          transform: moveToLeft ? 'translateX(-9.5vw)' : 'translateX(0)',
          transition: 'color 0.3s ease, transform 1500ms ease-in-out'
        }}
      >
        <span>{showFinal ? <>{typedText}</> : displayText}</span>
        {showFinal && typedText === 'C:\\Users\\CarlVictoria>' && <span className="blinking-cursor" style={{ color: currentTheme ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease' }}>_</span>}
      </h1>
      
      {showFinal && typedText === 'C:\\Users\\CarlVictoria>' && moveToTop && (
        <div className="animate-fade-in transition-opacity duration-1000">
          <ContentBox onThemeChange={setCurrentTheme} onMusicStateChange={setIsMusicPlaying} />
        </div>
      )}
      </div>
      
      {/* Footer - only visible after animation completes */}
      <Footer isDarkMode={currentTheme} visible={showFooter} />
    </div>
  );
}
