'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  minWidth?: string;
  minHeight?: string;
  showTypingAnimation?: boolean;
  typingText?: string;
  minimizedIndex?: number;
}

export default function Modal({ 
  isDarkMode, 
  onClose, 
  title = 'Window',
  children,
  width = '1600px',
  minWidth = '1020px',
  minHeight = '800px',
  showTypingAnimation = false,
  typingText = 'text',
  minimizedIndex = 0
}: ModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Typing animation
  useEffect(() => {
    if (!showTypingAnimation) return;
    
    let currentIndex = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (currentIndex < typingText.length) {
          setTypedText(typingText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setTypedText(typingText.substring(0, currentIndex));
        } else {
          isDeleting = false;
        }
      }
    }, 150);

    return () => clearInterval(typeInterval);
  }, [showTypingAnimation, typingText]);

  // Cursor blink
  useEffect(() => {
    if (!showTypingAnimation) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showTypingAnimation]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    requestAnimationFrame(() => {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          border: '1px solid',
          borderColor: isDarkMode ? '#4b5563' : '#D4C5A9',
          left: `${16 + (minimizedIndex * 150)}px`
        }}
        onClick={() => setIsMinimized(false)}
      >
        <div 
          className="px-4 py-2 flex items-center gap-3"
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#E7DCC8',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem'
          }}
        >
          <div className="flex gap-2">
            <div 
              className="w-3 h-3 rounded-full cursor-pointer hover:opacity-80"
              style={{ backgroundColor: '#ef4444' }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
            <div 
              className="w-3 h-3 rounded-full cursor-pointer hover:opacity-80"
              style={{ backgroundColor: '#22c55e' }}
            />
          </div>
          <p 
            style={{
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
              fontFamily: 'var(--font-terminal)',
              fontSize: '0.875rem'
            }}
          >
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed" 
      style={{ 
        backgroundColor: 'transparent',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50
      }}
    >
      <div 
        className="animate-fade-in"
        style={{
          width,
          maxWidth: 'none',
          minWidth,
          minHeight,
          flexShrink: 0,
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease',
          position: 'relative',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
          willChange: isDragging ? 'transform' : 'auto',
          borderRadius: '0.5rem',
          border: '1px solid',
          borderColor: isDarkMode ? '#4b5563' : '#D4C5A9',
          overflow: 'hidden',
          pointerEvents: 'auto'
        }}
      >
        {/* Header with window controls */}
        <div 
          className="px-4 py-2 border-b flex items-center select-none"
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#E7DCC8',
            borderColor: isDarkMode ? '#4b5563' : '#D4C5A9',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex gap-2 mr-4">
            <div 
              className="w-3 h-3 rounded-full cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center group relative"
              style={{ backgroundColor: '#ef4444' }}
              onClick={onClose}
              title="Close"
            >
              <span className="hidden group-hover:block text-white text-[10px] font-bold absolute">×</span>
            </div>
            <div 
              className="w-3 h-3 rounded-full cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center group relative"
              style={{ backgroundColor: '#22c55e' }}
              onClick={() => setIsMinimized(true)}
              title="Minimize"
            >
              <span className="hidden group-hover:block text-white text-[10px] font-bold absolute">−</span>
            </div>
          </div>
          
          {/* Typing animation or title */}
          <div className="flex-1 flex items-center">
            {showTypingAnimation ? (
              <span 
                style={{
                  color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                  fontFamily: 'var(--font-terminal)',
                  fontSize: '0.875rem'
                }}
              >
                {typedText}
                <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
              </span>
            ) : (
              <span 
                style={{
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                  fontFamily: 'var(--font-terminal)',
                  fontSize: '0.875rem'
                }}
              >
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto h-[calc(100%-3rem)]" style={{ fontFamily: 'var(--font-terminal)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
