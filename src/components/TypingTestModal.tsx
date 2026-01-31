'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

interface TypingTestModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface TopScore {
  _id: string;
  name: string;
  wpm: number;
  accuracy: number;
  score: number;
  timestamp: string;
}

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
  const [playerName, setPlayerName] = useState('');
  const [canStart, setCanStart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [topScores, setTopScores] = useState<TopScore[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate 2 random sentences on mount
    const shuffled = [...sentences].sort(() => Math.random() - 0.5);
    const selectedSentences = shuffled.slice(0, 2);
    setCurrentSentence(selectedSentences.join(' '));
    
    // Load top scores
    loadTopScores();
    
    // Focus on name input initially
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const loadTopScores = async () => {
    setIsLoadingScores(true);
    try {
      const response = await fetch('/api/typing-scores');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.topScores)) {
        setTopScores(data.topScores);
      } else if (Array.isArray(data.topScores)) {
        setTopScores(data.topScores);
      } else {
        console.warn('Unexpected API response format:', data);
        setTopScores([]);
      }
    } catch (error) {
      console.error('Failed to load top scores:', error);
      setTopScores([]);
    } finally {
      setIsLoadingScores(false);
    }
  };

  useEffect(() => {
    // Check if name is entered to enable the test
    setCanStart(playerName.trim().length > 0);
  }, [playerName]);

  useEffect(() => {
    // Auto-focus input when test can start
    if (inputRef.current && canStart && !isComplete) {
      inputRef.current.focus();
    }
  }, [canStart, isComplete]);

  useEffect(() => {
    // Check if test is complete
    if (userInput.length === currentSentence.length && currentSentence.length > 0 && canStart) {
      setIsComplete(true);
      calculateResults();
    }
  }, [userInput, currentSentence, canStart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canStart) return; // Prevent typing if name not entered
    
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

  const calculateResults = async () => {
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
      
      // Auto-submit score
      await submitScore(calculatedWpm, calculatedAccuracy);
    }
  };

  const submitScore = async (finalWpm: number, finalAccuracy: number) => {
    if (!playerName.trim()) return;
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const response = await fetch('/api/typing-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          wpm: finalWpm,
          accuracy: finalAccuracy
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.madeLeaderboard) {
          setSubmitResult(`🎉 Congratulations! You made it to the top 5 with a score of ${data.newScore.score}!`);
        } else {
          setSubmitResult(`Score submitted: ${data.newScore.score}. Need ${data.minimumScoreNeeded}+ to make top 5.`);
        }
        // Always update scores if available
        if (Array.isArray(data.topScores)) {
          setTopScores(data.topScores);
        } else {
          // Fallback: refresh scores from API
          await loadTopScores();
        }
      } else {
        setSubmitResult('Failed to submit score. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setSubmitResult('Error submitting score. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetTest = () => {
    // Generate 2 random sentences
    const shuffled = [...sentences].sort(() => Math.random() - 0.5);
    const selectedSentences = shuffled.slice(0, 2);
    setCurrentSentence(selectedSentences.join(' '));
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    setIsSubmitting(false);
    setSubmitResult(null);
    if (canStart && inputRef.current) {
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
      minHeight="500px"
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

        {/* Name Input */}
        <div className="mb-6">
          <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '8px' }}>
            Enter your name to start:
          </p>
          <input
            ref={nameInputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={isComplete}
            className="w-full max-w-md p-3 rounded-lg outline-none"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
              border: `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`,
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
              fontFamily: 'monospace',
              fontSize: '1rem'
            }}
            placeholder="Your name..."
            autoComplete="off"
            spellCheck="false"
            maxLength={50}
          />
          {!canStart && (
            <p style={{ color: 'rgba(255, 204, 0, 0.8)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '4px' }}>
              ⚠ Name required to start typing test
            </p>
          )}
        </div>

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
          <div>
            <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem', fontFamily: 'monospace' }}>
              SCORE
            </p>
            <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {Math.round(wpm * (accuracy / 100))}
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
          disabled={isComplete || !canStart}
          className="w-full p-3 rounded-lg mb-6 outline-none"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            border: `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`,
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
            fontFamily: 'monospace',
            fontSize: '1rem',
            opacity: canStart ? 1 : 0.5
          }}
          placeholder={canStart ? "Start typing..." : "Enter your name first..."}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Controls */}
        <div className="flex gap-3 mb-4">
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
          
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="px-4 py-2 rounded transition-all"
            style={{
              background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
              color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {showLeaderboard ? '✕ Hide Leaderboard' : '🏆 Top 5'}
          </button>
        </div>

        {/* Leaderboard */}
        {showLeaderboard && (
          <div 
            className="mb-4 p-4 rounded-lg"
            style={{
              background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 style={{ color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)', fontFamily: 'monospace', fontSize: '1rem' }}>
                🏆 Top 5 Leaderboard
              </h3>
              <button
                onClick={loadTopScores}
                disabled={isLoadingScores}
                className="px-2 py-1 rounded transition-all text-xs hover:opacity-80"
                style={{
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)'}`,
                  color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)',
                  fontFamily: 'monospace'
                }}
              >
                {isLoadingScores ? '...' : '↻ Refresh'}
              </button>
            </div>
            {isLoadingScores ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)' }}></div>
              </div>
            ) : topScores.length > 0 ? (
              <div className="space-y-2">
                {topScores.map((score, index) => (
                  <div key={score._id} className="flex justify-between items-center">
                    <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {index + 1}. {score.name}
                    </span>
                    <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {score.wpm} WPM • {score.accuracy}% • Score: {score.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                No scores yet. Be the first!
              </p>
            )}
          </div>
        )}

        {/* Submit Result */}
        {isSubmitting && (
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{
              background: isDarkMode ? 'rgba(255, 204, 0, 0.1)' : 'rgba(255, 204, 0, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 204, 0, 0.3)'}`,
            }}
          >
            <p style={{ color: isDarkMode ? 'rgba(255, 204, 0, 1)' : 'rgba(255, 204, 0, 1)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              ⏳ Submitting your score...
            </p>
          </div>
        )}

        {submitResult && (
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{
              background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 180, 90, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 180, 90, 0.3)'}`,
            }}
          >
            <p style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {submitResult}
            </p>
          </div>
        )}

        {isComplete && (
          <div 
            className="p-4 rounded-lg animate-fade-in"
            style={{
              background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 180, 90, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 180, 90, 0.3)'}`,
            }}
          >
            <p style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              ✓ Test completed! {playerName} typed {currentSentence.split(' ').length} words at {wpm} WPM with {accuracy}% accuracy.
            </p>
            <p style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontFamily: 'monospace', fontSize: '0.875rem', marginTop: '4px' }}>
              Your score: {Math.round(wpm * (accuracy / 100))} points
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
