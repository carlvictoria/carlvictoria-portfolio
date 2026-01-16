'use client';

import { useState, useEffect } from 'react';
import ContentBox from './ContentBox';
import FloatingStars from './FloatingStars';
import Image from 'next/image';
import folderIcon from '@/assets/folder.png';

export default function GreetingAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [showFinal, setShowFinal] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showFolder, setShowFolder] = useState(false);
  const [moveToLeft, setMoveToLeft] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(isDarkMode);

  useEffect(() => {
    setCurrentTheme(isDarkMode);
  }, [isDarkMode]);

  const handleFolderClick = () => {
    setShowFolder(false);
    setMoveToLeft(true);
    setTimeout(() => setMoveToTop(true), 1000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setMoveToLeft(false);
    setTimeout(() => {
      setMoveToTop(false);
      setTimeout(() => {
        setIsClosing(false);
        setShowFolder(true);
      }, 100);
    }, 1600);
  };

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
                  setShowFolder(true);
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
        <span>{showFinal ? <>{typedText}</> : displayText}</span>
        {showFinal && typedText === 'C:\\Users\\CarlVictoria>' && <span className="blinking-cursor" style={{ color: currentTheme ? 'var(--title-color)' : 'var(--title-color-l)', transition: 'color 0.3s ease' }}>_</span>}
      </h1>
      
      {showFolder && !moveToTop && (
        <div className="flex flex-col items-center animate-fade-in">
          <div 
            className="mt-8 cursor-pointer transition-all duration-300 hover:scale-110"
            onClick={handleFolderClick}
          >
            <Image 
              src={folderIcon} 
              alt="Open Portfolio" 
              width={120} 
              height={120}
              className="drop-shadow-2xl"
            />
          </div>
          <p 
            className="mt-3 text-sm animate-pulse"
            style={{
              color: currentTheme ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
              fontFamily: 'var(--font-terminal)',
              opacity: 0.7
            }}
          >
            ↑ Click to open ↑
          </p>
        </div>
      )}
      
      {showFinal && typedText === 'C:\\Users\\CarlVictoria>' && moveToTop && (
        <div 
          className="animate-fade-in transition-opacity duration-1000"
          style={{ opacity: isClosing ? 0 : 1 }}
        >
          <ContentBox onThemeChange={setCurrentTheme} onClose={handleClose} />
        </div>
      )}
      </div>
    </>
  );
}
