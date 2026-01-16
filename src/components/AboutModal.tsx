'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import Modal from './Modal';

interface AboutModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export default function AboutModal({ isDarkMode, onClose }: AboutModalProps) {

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
      width="1600px"
      minWidth="1020px"
      minHeight="800px"
      showTypingAnimation={true}
      typingText="about me"
    >
      {/* Content */}
      <>
        {/* CLI Opening Animation */}
          <div className="mb-6">
            <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontSize: '0.875rem' }}>
              ~$ opening about.sh...
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
      </>
    </Modal>
  );
}