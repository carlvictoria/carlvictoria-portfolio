'use client';

import { Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from './Modal';

interface AboutModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

interface GitHubStats {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function AboutModal({ isDarkMode, onClose }: AboutModalProps) {
  const [gitStoryData, setGitStoryData] = useState<string>('');
  const [isLoadingGitStory, setIsLoadingGitStory] = useState(true);

  useEffect(() => {
    // Fetch GitStory SVG
    fetch('https://gitstory.pankajk.tech/carlvictoria')
      .then(res => res.text())
      .then(svg => {
        setGitStoryData(svg);
        setIsLoadingGitStory(false);
      })
      .catch(err => {
        console.error('Failed to fetch GitStory:', err);
        setIsLoadingGitStory(false);
      });
  }, []);

  // TODO: Replace with actual GitHub API call
  const githubStats: GitHubStats = {
    name: 'CarlVictoria',
    bio: 'Full-Stack Developer',
    public_repos: 24,
    followers: 48,
    following: 32
  };

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
    >
      {/* Content */}
      <>
        {/* Header: Name with Paint Splash */}
        <div className="mb-4">
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
              CarlVictoria_<span className="animate-pulse" style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}></span>
            </h1>
          </div>
          
          <p 
            style={{ 
              color: isDarkMode ? 'rgba(0, 255, 136, 0.7)' : 'rgba(0, 128, 68, 0.8)',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}
          >
            @carlvictoria · Full-Stack Developer
          </p>
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
            
            <div className="space-y-1.5" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <div className="flex justify-between">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>NAME:</span>
                <span style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }} className="font-bold">CarlVictoria</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>STATUS:</span>
                <span className="flex items-center gap-1" style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)' }}>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  [ AVAILABLE ]
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>FOCUS:</span>
                <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>Scalable apps</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>LANG:</span>
                <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>TS, Python, PHP</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>MODE:</span>
                <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>Full-Stack</span>
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
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-4">
              ~$ gh stats --user carlvictoria
            </p>
            
            <div className="space-y-3" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.75rem' }}>REPOS:</span>
                <p style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {githubStats.public_repos} <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>public</span>
                </p>
              </div>
              <div>
                <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: '0.75rem' }}>FOLLOWERS:</span>
                <p style={{ color: isDarkMode ? 'rgba(0, 217, 255, 1)' : 'rgba(0, 150, 200, 1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {githubStats.followers}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem' }}>Last pushed: 2h ago</span>
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
              ~$ gh story --user carlvictoria
            </p>
            
            {/* GitStory Visualization */}
            <div className="flex items-center justify-center overflow-hidden" style={{ height: '180px' }}>
              {isLoadingGitStory ? (
                <div style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  Loading GitStory...
                </div>
              ) : gitStoryData ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: gitStoryData }}
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              ) : (
                <div style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  Failed to load GitStory
                </div>
              )}
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
          <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.75rem', fontFamily: 'monospace' }} className="mb-4">
            ~$ cat about.txt
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p 
                className="leading-relaxed mb-3"
                style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.95rem', lineHeight: '1.6' }}
              >
                Developer with a focus on clean architecture and developer experience.
                Building tools that make workflows faster and code more maintainable.
              </p>
            </div>
            
            <div>
              <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.85rem', fontFamily: 'monospace' }} className="mb-2">
                // What I do:
              </p>
              <div className="space-y-1.5" style={{ fontSize: '0.9rem' }}>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>
                  <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)' }}>→</span> Full-stack web applications
                </p>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>
                  <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)' }}>→</span> CLI tools and automation
                </p>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>
                  <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)' }}>→</span> API design & integration
                </p>
                <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)' }}>
                  <span style={{ color: isDarkMode ? 'rgba(0, 255, 136, 1)' : 'rgba(0, 180, 90, 1)' }}>→</span> UI/UX prototyping
                </p>
              </div>
              <p 
                className="mt-3 italic"
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.85rem' }}
              >
                Currently exploring: GraphQL, Rust, and DevOps workflows.
              </p>
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
                  {[...techStackIcons.frontend.slice(0, 3), techStackIcons.backend[0]].map((tech) => (
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
              
              {/* TOOLS */}
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
                  TOOLS:
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStackIcons.tools.map((tech) => (
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