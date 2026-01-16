'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

interface TypingTestModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "Practice makes perfect when you type every day",
  "Technology advances at an incredible pace today",
  "Coffee fuels the coding sessions late at night",
  "Debug your code before pushing to production",
  "Always write clean and maintainable code",
  "Learning new skills requires patience and practice",
  "The keyboard is a programmer's best friend",
  "Version control saves countless hours of work",
  "Documentation is as important as the code itself",
  "Building software is like constructing a complex puzzle where every piece must fit perfectly together to create something meaningful",
  "Developers spend more time reading code than writing it, which is why clarity and simplicity should always be prioritized over cleverness",
  "The best programmers are not those who write the most code, but those who solve problems with the least amount of code necessary",
  "Testing your application thoroughly before deployment can save you from embarrassing bugs and frustrated users down the line",
  "Open source software has revolutionized the way we build applications by allowing developers worldwide to collaborate and share knowledge",
  "Learning to code is not just about memorizing syntax, it's about developing problem-solving skills and logical thinking patterns",
  "Modern web development requires understanding of both frontend and backend technologies to create seamless user experiences",
  "Artificial intelligence and machine learning are transforming industries by automating complex tasks that once required human intervention",
  "Writing efficient algorithms can significantly improve application performance and provide better user experiences for everyone",
  "Continuous learning is essential in technology because new frameworks, languages, and tools emerge constantly in our rapidly evolving field"
];

export default function TypingTestModal({ isDarkMode, onClose, minimizedIndex = 0 }: TypingTestModalProps) {
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate random sentence on mount
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(randomSentence);
  }, []);

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Check if test is complete
    if (userInput.length === currentSentence.length && currentSentence.length > 0) {
      setIsComplete(true);
      calculateResults();
    }
  }, [userInput, currentSentence]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Start timer on first character
    if (value.length === 1 && startTime === null) {
      setStartTime(Date.now());
    }

    // Prevent typing beyond sentence length
    if (value.length <= currentSentence.length) {
      setUserInput(value);
    }
  };

  const calculateResults = () => {
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = currentSentence.split(' ').length;
      const calculatedWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(calculatedWpm);

      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < currentSentence.length; i++) {
        if (userInput[i] === currentSentence[i]) {
          correct++;
        }
      }
      const calculatedAccuracy = Math.round((correct / currentSentence.length) * 100);
      setAccuracy(calculatedAccuracy);
    }
  };

  const resetTest = () => {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(randomSentence);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getCharacterStyle = (index: number) => {
    if (index >= userInput.length) {
      // Not yet typed
      return {
        opacity: 0.5,
        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
      };
    } else if (userInput[index] === currentSentence[index]) {
      // Correct
      return {
        opacity: 1,
        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
      };
    } else {
      // Incorrect
      return {
        opacity: 1,
        color: '#ef4444'
      };
    }
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="Typing Test"
      width="900px"
      minWidth="800px"
      minHeight="400px"
      showTypingAnimation={true}
      typingText="typing-test.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full">
        <p 
          style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontSize: '0.75rem', 
            fontFamily: 'monospace' 
          }} 
          className="mb-6"
        >
          ~$ ./typing-test --mode=practice
        </p>

        {/* Stats Display */}
        <div className="flex gap-8 mb-8">
          <div>
            <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem', fontFamily: 'monospace' }}>
              WPM
            </p>
            <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {wpm}
            </p>
          </div>
          <div>
            <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem', fontFamily: 'monospace' }}>
              ACCURACY
            </p>
            <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {accuracy}%
            </p>
          </div>
        </div>

        {/* Typing Area */}
        <div 
          className="mb-6 p-6 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <p 
            style={{ 
              fontSize: '1.5rem', 
              lineHeight: '2.5rem',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}
          >
            {currentSentence.split('').map((char, index) => (
              <span
                key={index}
                style={getCharacterStyle(index)}
                className="transition-all duration-100"
              >
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isComplete}
          className="w-full p-3 rounded-lg mb-6 outline-none"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            border: `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`,
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
            fontFamily: 'monospace',
            fontSize: '1rem'
          }}
          placeholder="Start typing..."
          autoComplete="off"
          spellCheck="false"
        />

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={resetTest}
            className="px-4 py-2 rounded transition-all"
            style={{
              background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 128, 68, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 128, 68, 0.3)'}`,
              color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 128, 68, 1)',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {isComplete ? '↻ Try Again' : '↻ Reset'}
          </button>
        </div>

        {isComplete && (
          <div 
            className="mt-6 p-4 rounded-lg animate-fade-in"
            style={{
              background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 180, 90, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 180, 90, 0.3)'}`,
            }}
          >
            <p style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              ✓ Test completed! You typed {currentSentence.split(' ').length} words at {wpm} WPM with {accuracy}% accuracy.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
