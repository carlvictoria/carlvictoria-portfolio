'use client';

import { Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import Modal from './Modal';

interface AboutModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface GitHubStats {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_forks: number;
  contributions_2025: number;
}

export default function AboutModal({ isDarkMode, onClose, minimizedIndex = 0 }: AboutModalProps) {
  // TODO: Replace with actual GitHub API call
  const githubStats: GitHubStats = {
    name: 'CarlVictoria',
    bio: 'Full-Stack Developer',
    public_repos: 24,
    followers: 48,
    following: 32,
    total_stars: 156,
    total_forks: 42,
    contributions_2025: 255
  };

  const techStackIcons = {
    frontend: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' }
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
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
      { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' }
    ]
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="About me"
      width="1200px"
      minWidth="1000px"
      minHeight="550px"
      showTypingAnimation={true}
      typingText="about me"
      minimizedIndex={minimizedIndex}
    >
      {/* Content */}
      <>
        {/* Header: Name with Paint Splash */}
        <div className="-mb-4">
          <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.875rem', fontFamily: 'monospace' }} className="mb-3">
            ~$ sys.profile --load
          </p>
          
          <div className="relative inline-block mb-2">
            {/* Paint Splash Effect */}
            <div 
              className="absolute inset-0 -left-4 -right-4 -top-2 -bottom-2"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 217, 255, 0.2) 50%, rgba(255, 0, 230, 0.15) 100%)',
                borderRadius: '30% 70% 60% 40% / 40% 50% 60% 50%',
                filter: 'blur(25px)',
                zIndex: 0,
                animation: 'paintPulse 4s ease-in-out infinite'
              }}
            />
            
            {/* Name */}
            <h1 
              className="text-4xl font-bold relative z-10"
              style={{ 
                color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                letterSpacing: '-0.02em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              C:\Users\CarlVictoria_<span className="animate-pulse" style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}></span>
            </h1>
          </div>
          
          <pre 
            style={{ 
              color: isDarkMode ? 'rgba(0, 255, 136, 0.7)' : 'rgba(0, 128, 68, 0.8)',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}
          >
            {'\n'}
          </pre>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Profile Panel */}
          <div 
            className="p-3 rounded-lg"
            style={{
              border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 128, 68, 0.3)'}`,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.7rem', fontFamily: 'monospace' }} className="mb-3">
              ~$ cat ~/.profile
            </p>
            
            <div className="space-y-2" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {/* Name with highlight */}
              <div className="mb-3">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>USER</span>
                <p style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '0.25rem' }}>CarlVictoria</p>
              </div>
              
              {/* Status with visual indicator */}
              <div className="flex items-center justify-between py-2 px-2 rounded" style={{ background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 180, 90, 0.1)' }}>
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', fontSize: '0.7rem' }}>STATUS</span>
                <span className="flex items-center gap-1.5" style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 4px rgba(0, 255, 136, 0.8)' }}></span>
                  AVAILABLE
                </span>
              </div>
              
              {/* Info Grid */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>ROLE:</span>
                  <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontWeight: 'bold' }}>Full-Stack Dev</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>FOCUS:</span>
                  <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>Web Apps</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>STACK:</span>
                  <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>TS, Python</span>
                </div>
              </div>
              
              {/* Location section */}
              <div className="pt-2 mt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <div className="flex justify-between mb-1">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>🌏 LOCATION:</span>
                  <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>Philippines</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>⏰ TIMEZONE:</span>
                  <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>UTC+8</span>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Stats Panel */}
          <div 
            className="p-3 rounded-lg"
            style={{
              border: `1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 108, 127, 0.3)'}`,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-3">
              ~$ gh stats --user carlvictoria
            </p>
            
            <div className="space-y-3" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>PUBLIC REPOS</span>
                  <p style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {githubStats.public_repos}
                  </p>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>repositories</span>
                </div>
                <div>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>FOLLOWERS</span>
                  <p style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {githubStats.followers}
                  </p>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>developers</span>
                </div>
              </div>
              
              {/* Activity Indicator */}
              <div className="pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>LAST ACTIVITY</span>
                  <span className="flex items-center gap-1" style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontSize: '0.7rem' }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    2h ago
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ background: isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 150, 200, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)' }}>
                    📦 Push
                  </div>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>to main branch</span>
                </div>
              </div>
              
              {/* Streak indicator */}
              <div className="pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>COMMIT STREAK</span>
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: '1rem' }}>🔥</span>
                    <span style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontWeight: 'bold', fontSize: '0.9rem' }}>12 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Contributions Panel */}
          <div 
            className="p-3 rounded-lg"
            style={{
              border: `1px solid ${isDarkMode ? 'rgba(255, 0, 230, 0.2)' : 'rgba(128, 0, 115, 0.3)'}`,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-3">
              ~$ gh activity --summary
            </p>
            
            {/* GitHub Activity Summary */}
            <div className="space-y-3" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>CONTRIBUTIONS</span>
                  <p style={{ color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(200, 0, 180, 1)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    {githubStats.contributions_2025}
                  </p>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>in 2025</span>
                </div>
                <div>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>FOLLOWING</span>
                  <p style={{ color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(200, 0, 180, 1)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    {githubStats.following}
                  </p>
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem' }}>developers</span>
                </div>
              </div>
              
              <div className="pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>TOTAL STARS:</span>
                  <span style={{ color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(200, 0, 180, 1)', fontWeight: 'bold' }}>⭐ {githubStats.total_stars}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem' }}>TOTAL FORKS:</span>
                  <span style={{ color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(200, 0, 180, 1)', fontWeight: 'bold' }}>🔱 {githubStats.total_forks}</span>
                </div>
              </div>
              
              <div className="pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>ACTIVITY SCORE</p>
                <div style={{ background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg, rgba(255, 0, 230, 1) 0%, rgba(0, 217, 255, 1) 100%)', height: '100%', width: '83%', borderRadius: '4px' }}></div>
                </div>
                <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.65rem', marginTop: '0.25rem' }}>83% active this year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section - Full Width */}
        <div 
          className="mb-3 py-3 px-3"
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-3">
            ~$ cat about.txt
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Bio Section */}
            <div className="space-y-3">
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: isDarkMode ? 'rgba(0, 255, 136, 0.05)' : 'rgba(0, 180, 90, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 180, 90, 0.2)'}`
                }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  <div>
                    <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.65rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                      PHILOSOPHY
                    </p>
                    <p 
                      className="leading-relaxed"
                      style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.85rem', lineHeight: '1.5' }}
                    >
                      Clean architecture meets developer experience. Building tools that make workflows faster and code more maintainable.
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: isDarkMode ? 'rgba(0, 217, 255, 0.05)' : 'rgba(0, 150, 200, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 150, 200, 0.2)'}`
                }}
              >
                <div className="flex items-start gap-2">
                  <span style={{ fontSize: '1.2rem' }}>🔬</span>
                  <div>
                    <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.65rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                      CURRENTLY EXPLORING
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span 
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ 
                          background: isDarkMode ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 150, 200, 0.2)',
                          color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        GraphQL
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ 
                          background: isDarkMode ? 'rgba(255, 136, 0, 0.2)' : 'rgba(200, 100, 0, 0.2)',
                          color: isDarkMode ? 'rgba(255, 170, 0, 1)' : 'rgba(200, 100, 0, 1)',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        Rust
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ 
                          background: isDarkMode ? 'rgba(255, 0, 230, 0.2)' : 'rgba(180, 0, 160, 0.2)',
                          color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(180, 0, 160, 1)',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        DevOps
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Services Grid */}
            <div className="flex flex-col h-full">
              <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.7rem', fontFamily: 'monospace', marginBottom: '0.5rem' }} className="mb-2">
                // SERVICES & EXPERTISE
              </p>
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div 
                  className="p-2.5 rounded"
                  style={{ 
                    background: isDarkMode ? 'rgba(0, 255, 136, 0.08)' : 'rgba(0, 180, 90, 0.08)',
                    border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 180, 90, 0.3)'}`
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ fontSize: '1rem' }}>🌐</span>
                    <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      WEB
                    </span>
                  </div>
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.7rem', lineHeight: '1.3' }}>
                    Full-stack applications
                  </p>
                </div>
                
                <div 
                  className="p-2.5 rounded"
                  style={{ 
                    background: isDarkMode ? 'rgba(0, 217, 255, 0.08)' : 'rgba(0, 150, 200, 0.08)',
                    border: `1px solid ${isDarkMode ? 'rgba(0, 217, 255, 0.3)' : 'rgba(0, 150, 200, 0.3)'}`
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ fontSize: '1rem' }}>⚙️</span>
                    <span style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      CLI
                    </span>
                  </div>
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.7rem', lineHeight: '1.3' }}>
                    Tools & automation
                  </p>
                </div>
                
                <div 
                  className="p-2.5 rounded"
                  style={{ 
                    background: isDarkMode ? 'rgba(255, 0, 230, 0.08)' : 'rgba(180, 0, 160, 0.08)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 0, 230, 0.3)' : 'rgba(180, 0, 160, 0.3)'}`
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ fontSize: '1rem' }}>🔌</span>
                    <span style={{ color: isDarkMode ? 'rgba(255, 0, 230, 1)' : 'rgba(180, 0, 160, 1)', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      API
                    </span>
                  </div>
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.7rem', lineHeight: '1.3' }}>
                    Design & integration
                  </p>
                </div>
                
                <div 
                  className="p-2.5 rounded"
                  style={{ 
                    background: isDarkMode ? 'rgba(255, 170, 0, 0.08)' : 'rgba(200, 100, 0, 0.08)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 170, 0, 0.3)' : 'rgba(200, 100, 0, 0.3)'}`
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span style={{ fontSize: '1rem' }}>🎨</span>
                    <span style={{ color: isDarkMode ? 'rgba(255, 170, 0, 1)' : 'rgba(200, 100, 0, 1)', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      UI/UX
                    </span>
                  </div>
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.7rem', lineHeight: '1.3' }}>
                    Prototyping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Tech Stack + Quick Links */}
        <div className="grid grid-cols-2 gap-2">
          {/* Tech Stack Panel */}
          <div 
            className="p-3 rounded-lg"
            style={{
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
              backgroundImage: isDarkMode ? 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)' : 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-4">
              ~$ ls ~/stack
            </p>
            
            <div className="space-y-4">
              {/* CORE */}
              <div>
                <p 
                  style={{ 
                    color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                    fontSize: '0.75rem', 
                    fontFamily: 'monospace',
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    paddingBottom: '0.25rem'
                  }} 
                  className="mb-2"
                >
                  CORE:
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStackIcons.frontend.map((tech) => (
                    <div
                      key={tech.name}
                      className="group cursor-pointer transition-all hover:-translate-y-1"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-7 h-7"
                        style={{ filter: !isDarkMode && tech.name === 'Next.js' ? 'invert(1)' : 'none' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* DB */}
              <div>
                <p 
                  style={{ 
                    color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                    fontSize: '0.75rem', 
                    fontFamily: 'monospace',
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    paddingBottom: '0.25rem'
                  }} 
                  className="mb-2"
                >
                  DB:
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStackIcons.database.map((tech) => (
                    <div
                      key={tech.name}
                      className="group cursor-pointer transition-all hover:-translate-y-1"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      title={tech.name}
                    >
                      <img 
                        src={tech.icon} 
                        alt={tech.name} 
                        className="w-7 h-7"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Panel */}
          <div 
            className="p-3 rounded-lg"
            style={{
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)'
            }}
          >
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-4">
              ~$ alias
            </p>
            
            <div className="space-y-3" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <a 
                href="https://github.com/carlvictoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 group transition-all"
              >
                <Github size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} />
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>github</span>
                <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 128, 68, 0.5)' }}>→</span>
                <span 
                  className="group-hover:underline"
                  style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)' }}
                >
                  github.com/carlvictoria
                </span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} />
              </a>
              
              <a 
                href="mailto:victoriacarlangelo@gmail.com"
                className="flex items-center gap-2 group transition-all"
              >
                <Mail size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} />
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>email</span>
                <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 128, 68, 0.5)' }}>→</span>
                <span 
                  className="group-hover:underline"
                  style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)' }}
                >
                  victoriacarlangelo@gmail.com
                </span>
              </a>
              
              <a 
                href="https://linkedin.com/in/carlvictoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 group transition-all"
              >
                <Linkedin size={16} color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} />
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>linkedin</span>
                <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 128, 68, 0.5)' }}>→</span>
                <span 
                  className="group-hover:underline"
                  style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)' }}
                >
                  linkedin.com/in/carlvictoria
                </span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" color={isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'} />
              </a>
              
              <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <button 
                  className="flex items-center gap-2 group w-full py-2 px-3 rounded transition-all"
                  style={{
                    background: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 128, 68, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 128, 68, 0.3)'}`,
                    color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 128, 68, 1)'
                  }}
                >
                  <Download size={16} />
                  <span>Download CV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}