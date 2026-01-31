'use client';

import { Github, Linkedin, Mail, Heart, Code } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  visible: boolean;
}

export default function Footer({ isDarkMode, visible }: FooterProps) {
  if (!visible) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full py-4 px-6 transition-all duration-500 animate-fade-in"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
          : 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.08) 100%)',
        marginTop: 'auto',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingLeft: 'calc(50vw - 50% + 1.5rem)',
        paddingRight: 'calc(50vw - 50% + 1.5rem)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div 
          className="w-full h-px mb-4"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(90deg, transparent 0%, rgba(255, 198, 0, 0.3) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(39, 139, 210, 0.3) 50%, transparent 100%)'
          }}
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Credits */}
          <div className="flex items-center gap-2">
            <Code 
              size={14} 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                opacity: 0.6
              }} 
            />
            <span 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                opacity: 0.6
              }}
            >
              Designed & Built by
            </span>
            <span 
              style={{ 
                color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}
            >
              CarlVictoria
            </span>
          </div>

          {/* Center: Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/carlvictoria"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:opacity-80 hover:scale-110"
              style={{
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
              }}
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/carl-victoria"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all hover:opacity-80 hover:scale-110"
              style={{
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
              }}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:contact@carlvictoria.dev"
              className="p-2 rounded-lg transition-all hover:opacity-80 hover:scale-110"
              style={{
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
              }}
              title="Email"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Right: Copyright */}
          <div className="flex items-center gap-1.5">
            <span 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                opacity: 0.5
              }}
            >
              © {currentYear} • Made with
            </span>
            <Heart 
              size={12} 
              className="animate-pulse"
              style={{ 
                color: isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.8)',
                fill: isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.8)'
              }}
            />
            <span 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                opacity: 0.5
              }}
            >
              in Philippines
            </span>
          </div>
        </div>

        {/* Terminal-style footer text */}
        <div className="mt-3 text-center">
          <span 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              opacity: 0.4
            }}
          >
            ~$ echo "Thanks for visiting!" &amp;&amp; exit 0
          </span>
        </div>
      </div>
    </footer>
  );
}
