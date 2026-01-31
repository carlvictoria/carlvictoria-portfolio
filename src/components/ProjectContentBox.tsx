'use client';

import { useState } from 'react';
import { ChevronRight, ExternalLink, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProjectFeature {
  label: string;
  description: string;
}

interface ProjectContentBoxProps {
  isDarkMode: boolean;
  title: string;
  description: string;
  icon: LucideIcon;
  technologies: string[];
  features: ProjectFeature[];
  accentColor: {
    dark: string;
    light: string;
  };
  onLaunch: () => void;
  onClose: () => void;
}

export default function ProjectContentBox({
  isDarkMode,
  title,
  description,
  icon: Icon,
  technologies,
  features,
  accentColor,
  onLaunch,
  onClose
}: ProjectContentBoxProps) {
  const [isHovering, setIsHovering] = useState(false);

  const accent = isDarkMode ? accentColor.dark : accentColor.light;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-fade-in"
        style={{
          backgroundColor: isDarkMode ? 'var(--cmd-background)' : 'var(--cmd-background-l)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          maxHeight: '70vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient accent */}
        <div 
          className="p-4 relative"
          style={{
            background: `linear-gradient(135deg, ${accent}15 0%, transparent 50%)`,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:opacity-80"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
            }}
          >
            <X size={16} />
          </button>

          {/* Terminal command */}
          <p 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontSize: '0.7rem', 
              fontFamily: 'monospace',
              marginBottom: '12px',
              opacity: 0.7
            }}
          >
            ~$ project --info "{title.toLowerCase().replace(/\s+/g, '-')}"
          </p>

          {/* Title with icon */}
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-lg"
              style={{
                background: `${accent}20`,
                color: accent
              }}
            >
              <Icon size={24} />
            </div>
            <div>
              <h2 
                style={{ 
                  color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                  fontFamily: 'monospace', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  letterSpacing: '-0.02em'
                }}
              >
                {title}
              </h2>
              <p 
                style={{ 
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem',
                  opacity: 0.8,
                  marginTop: '2px'
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div 
          className="p-4 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(70vh - 180px)' }}
        >
          {/* Technologies */}
          <div className="mb-4">
            <p 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'monospace', 
                fontSize: '0.7rem',
                marginBottom: '8px',
                opacity: 0.7
              }}
            >
              TECHNOLOGIES:
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span 
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    fontFamily: 'monospace',
                    border: `1px solid ${accent}30`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <p 
              style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'monospace', 
                fontSize: '0.7rem',
                marginBottom: '8px',
                opacity: 0.7
              }}
            >
              KEY FEATURES:
            </p>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg transition-all"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                  }}
                >
                  <div className="flex items-start gap-2">
                    <ChevronRight 
                      size={14} 
                      style={{ color: accent, marginTop: '2px', flexShrink: 0 }} 
                    />
                    <div>
                      <p 
                        style={{ 
                          color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                          fontFamily: 'monospace', 
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        {feature.label}
                      </p>
                      <p 
                        style={{ 
                          color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                          fontFamily: 'monospace', 
                          fontSize: '0.7rem',
                          opacity: 0.7,
                          marginTop: '2px'
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className="p-4"
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)'
          }}
        >
          <button
            onClick={onLaunch}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            style={{
              background: isHovering ? `${accent}30` : `${accent}20`,
              border: `1px solid ${accent}50`,
              color: accent,
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              fontWeight: '600',
              transform: isHovering ? 'translateY(-1px)' : 'none',
              boxShadow: isHovering ? `0 4px 12px ${accent}30` : 'none'
            }}
          >
            <ExternalLink size={16} />
            Launch Project
          </button>
        </div>
      </div>
    </div>
  );
}
