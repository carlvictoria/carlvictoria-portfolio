'use client';

import { useState, useEffect } from 'react';
import ContentBox from './ContentBox';

export default function GreetingAnimation() {
  const [displayText, setDisplayText] = useState('');
  const [showFinal, setShowFinal] = useState(false);
  const [moveToLeft, setMoveToLeft] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);

  useEffect(() => {
    const greetings = [
      '>Hello', '>Hola', '>Bonjour', '>Ciao', '>Hallo', 
      '>Olá', '>Привет', '>こんにちは', '>안녕하세요', '>Merhaba',
      '>Hej', '>Namaste', '>Sawubona', '>Kamusta', '>Kumusta'
    ];
    
    let index = 0;
    let cycles = 0;
    const maxCycles = 2;
    
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
    <div 
      className="transition-all duration-[1000ms] ease-in-out flex flex-col items-center"
      style={{
        transform: moveToTop ? 'translateY(4rem)' : 'translateY(50vh)',
      }}
    >
      <h1 
        className="text-7xl font-bold transition-all duration-[1500ms] ease-in-out flex items-center"
        style={{
          color: 'var(--title-color)', 
          fontFamily: 'var(--font-terminal)',
          transform: moveToLeft ? 'translateX(-11vw)' : 'translateX(0)',
        }}
      >
        <span>{showFinal ? <>{'>'}Carl Victoria</> : displayText}</span>
        {showFinal && <span className="blinking-cursor">_</span>}
      </h1>
      {showFinal && (
        <div className="animate-fade-in">
          <ContentBox />
        </div>
      )}
    </div>
  );
}
