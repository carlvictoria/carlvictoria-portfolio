'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface AboutModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export default function AboutModal({ isDarkMode, onClose }: AboutModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const aboutMeText = 'about me';

  // Typing animation
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (currentIndex < aboutMeText.length) {
          setTypedText(aboutMeText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setTypedText(aboutMeText.substring(0, currentIndex));
        } else {
          isDeleting = false;
        }
      }
    }, 150);

    return () => clearInterval(typeInterval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

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

  const techStackIcons = {
    frontend: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' }
    ],
    backend: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' }
    ],
    database: [
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' }
    ],
    tools: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }
    ]
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 left-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          border: '1px solid',
          borderColor: isDarkMode ? '#4b5563' : '#D4C5A9'
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
            About me
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
      style={{ backgroundColor: 'transparent' }}
    >
      <div 
        className="mt-8 shadow-4xl border border-black-600 rounded-lg w-[1200px] max-w-5xl min-h-[750px] overflow-hidden"
        style={{
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transition: 'background-color 0.3s ease',
          position: 'relative',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
          willChange: isDragging ? 'transform' : 'auto'
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
          
          {/* Typing animation on the left */}
          <div className="flex-1 flex items-center">
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
          </div>
          
          <p 
            style={{
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontFamily: 'var(--font-terminal)',
              transition: 'color 0.3s ease'
            }} 
            className="text-center"
          >
        
          </p>
          <div className="flex-1"></div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto h-[calc(100%-3rem)]" style={{ fontFamily: 'var(--font-terminal)' }}>
          {/* CLI Opening Animation */}
          <div className="mb-6">
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.875rem' }}>
              $ opening about.sh...
            </p>
            <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontSize: '0.875rem' }}>
              [OK] Profile loaded successfully
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
            >
              {'>'} whoami
            </h2>
            <p 
              className="text-lg leading-relaxed"
              style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}
            >
              Hi! I'm <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}>Carl Victoria</span>, 
              a passionate full-stack developer with a love for creating innovative and user-friendly applications. 
              I specialize in building modern web applications using cutting-edge technologies and best practices.
            </p>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
            >
              {'>'} experience.log
            </h2>
            <div className="space-y-4">
              <div>
                <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }} className="font-bold">
                  Full Stack Developer
                </p>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }} className="text-sm">
                  Developing end-to-end web applications with focus on performance and user experience
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stacks */}
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
            >
              {'>'} tech-stack --list
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                >
                  [Frontend]
                </h3>
                <div className="flex flex-wrap gap-4">
                  {techStackIcons.frontend.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group cursor-pointer transition-transform hover:scale-110"
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-10 h-10"
                        style={{ filter: !isDarkMode && tech.name === 'Next.js' ? 'invert(1)' : 'none' }}
                      />
                      <span 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap"
                        style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                      >
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                >
                  [Backend]
                </h3>
                <div className="flex flex-wrap gap-4">
                  {techStackIcons.backend.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group cursor-pointer transition-transform hover:scale-110"
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-10 h-10"
                        style={{ filter: !isDarkMode && tech.name === 'Express' ? 'invert(1)' : 'none' }}
                      />
                      <span 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap"
                        style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                      >
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                >
                  [Database]
                </h3>
                <div className="flex flex-wrap gap-4">
                  {techStackIcons.database.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group cursor-pointer transition-transform hover:scale-110"
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-10 h-10"
                      />
                      <span 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap"
                        style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                      >
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                >
                  [Tools]
                </h3>
                <div className="flex flex-wrap gap-4">
                  {techStackIcons.tools.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group cursor-pointer transition-transform hover:scale-110"
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-10 h-10"
                      />
                      <span 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap"
                        style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                      >
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
            >
              {'>'} contact --info
            </h2>
            <div className="flex gap-6">
              <a 
                href="https://github.com/carlvictoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                title="GitHub"
              >
                <Github 
                  size={32} 
                  color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} 
                />
              </a>
              <a 
                href="mailto:victoriacarlangelo@gmail.com"
                className="transition-transform hover:scale-110"
                title="Email"
              >
                <Mail 
                  size={32} 
                  color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} 
                />
              </a>
              <a 
                href="https://linkedin.com/in/carlvictoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin 
                  size={32} 
                  color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} 
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
