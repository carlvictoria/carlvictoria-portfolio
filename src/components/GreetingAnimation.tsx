'use client';

import { useState, useEffect } from 'react';
import ContentBox from './ContentBox';
import FloatingStars from './FloatingStars';

export default function GreetingAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [showFinal, setShowFinal] = useState(false);
  const [moveToLeft, setMoveToLeft] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(isDarkMode);

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
            setTimeout(() => {
              setMoveToLeft(true);
              setTimeout(() => setMoveToTop(true), 1000);
            }, 100);
          }, 100);
        }
      }
    }, 80);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FloatingStars isDarkMode={currentTheme} />
      <div 
        className="transition-all duration-[1000ms] ease-in-out flex flex-col items-center"
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
        <span>{showFinal ? <>C:\Users\CarlVictoria{'>'}</> : displayText}</span>
        {showFinal && <span className="blinking-cursor" style={{ color: currentTheme ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease' }}>_</span>}
      </h1>
      {showFinal && (
        <div className="animate-fade-in">
          <ContentBox onThemeChange={setCurrentTheme} />
        </div>
      )}
      </div>
    </>
  );
}
