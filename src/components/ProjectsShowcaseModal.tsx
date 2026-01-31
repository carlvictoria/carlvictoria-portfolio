'use client';

import { useState } from 'react';
import Modal from './Modal';
import { PawPrint, Building2, DollarSign, Github, ExternalLink, X, ChevronRight, Code, Star } from 'lucide-react';

interface ProjectsShowcaseModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  technologies: string[];
  features: string[];
  githubUrl: string;
  liveUrl?: string;
  accentColor: { dark: string; light: string };
  status: 'completed' | 'in-progress' | 'beta';
}

const projects: Project[] = [
  {
    id: 'pawsense',
    name: 'PawSense',
    description: 'AI-Powered Pet Health Monitoring System',
    longDescription: 'PawSense is an intelligent pet health monitoring application that uses AI to track and analyze your pet\'s health patterns. It provides real-time health insights, vaccination reminders, and connects pet owners with veterinary services.',
    icon: PawPrint,
    technologies: ['React Native', 'TensorFlow', 'Node.js', 'MongoDB', 'Express'],
    features: [
      'AI-powered health analysis',
      'Vaccination tracking & reminders',
      'Pet profile management',
      'Symptom checker',
      'Vet appointment booking'
    ],
    githubUrl: 'https://github.com/carlvictoria/PawSense',
    accentColor: { dark: 'rgba(251, 146, 60, 1)', light: 'rgba(234, 88, 12, 1)' },
    status: 'completed'
  },
  {
    id: 'csuforum',
    name: 'CSUnite',
    description: 'University Community Forum Platform',
    longDescription: 'CSUnite is a comprehensive forum platform designed for university students to connect, share resources, and collaborate on academic projects. Features include discussion boards, file sharing, and real-time messaging.',
    icon: Building2,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Socket.io'],
    features: [
      'Real-time discussions',
      'Resource sharing',
      'Course-specific channels',
      'Student profiles',
      'Event announcements'
    ],
    githubUrl: 'https://github.com/carlvictoria/CSU_Forum',
    accentColor: { dark: 'rgba(59, 130, 246, 1)', light: 'rgba(37, 99, 235, 1)' },
    status: 'completed'
  },
  {
    id: 'utangph',
    name: 'utangPH',
    description: 'Personal Finance & Debt Tracking App',
    longDescription: 'utangPH is a personal finance application designed to help Filipinos track their debts, manage payments, and achieve financial freedom. It features intuitive debt tracking, payment reminders, and financial insights.',
    icon: DollarSign,
    technologies: ['React', 'Firebase', 'Tailwind CSS', 'Chart.js', 'PWA'],
    features: [
      'Debt tracking & management',
      'Payment reminders',
      'Financial analytics',
      'Multiple currency support',
      'Offline support (PWA)'
    ],
    githubUrl: 'https://github.com/carlvictoria/utangph',
    accentColor: { dark: 'rgba(34, 197, 94, 1)', light: 'rgba(22, 163, 74, 1)' },
    status: 'completed'
  }
];

export default function ProjectsShowcaseModal({ isDarkMode, onClose, minimizedIndex = 0 }: ProjectsShowcaseModalProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusBadge = (status: Project['status']) => {
    const styles = {
      completed: { bg: 'rgba(34, 197, 94, 0.2)', color: 'rgba(34, 197, 94, 1)', text: 'Completed' },
      'in-progress': { bg: 'rgba(251, 146, 60, 0.2)', color: 'rgba(251, 146, 60, 1)', text: 'In Progress' },
      beta: { bg: 'rgba(139, 92, 246, 0.2)', color: 'rgba(139, 92, 246, 1)', text: 'Beta' }
    };
    return styles[status];
  };

  return (
    <Modal 
      onClose={onClose} 
      isDarkMode={isDarkMode} 
      title="Projects"
      width="950px"
      minWidth="750px"
      minHeight="600px"
      minimizedIndex={minimizedIndex}
    >
      <div className="p-6 h-full flex flex-col" style={{ maxHeight: '75vh' }}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Code size={20} style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }} />
            <h1 style={{ 
              color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
              fontFamily: 'var(--font-terminal)', 
              fontSize: '1.5rem', 
              fontWeight: 'bold' 
            }}>
              Featured Projects
            </h1>
          </div>
          <p style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontFamily: 'var(--font-terminal)', 
            fontSize: '0.875rem', 
            opacity: 0.8 
          }}>
            ~$ ls -la ~/projects/ | grep -v "node_modules"
          </p>
        </div>

        {/* Projects Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? 'rgba(255,255,255,0.2) transparent' : 'rgba(0,0,0,0.2) transparent'
        }}>
          <div className="grid gap-4">
            {projects.map((project) => {
              const Icon = project.icon;
              const statusStyle = getStatusBadge(project.status);
              
              return (
                <div
                  key={project.id}
                  className="rounded-lg p-5 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    boxShadow: selectedProject?.id === project.id 
                      ? `0 0 0 2px ${isDarkMode ? project.accentColor.dark : project.accentColor.light}` 
                      : 'none'
                  }}
                  onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                >
                  <div className="flex items-start gap-4">
                    {/* Project Icon */}
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{
                        background: `${isDarkMode ? project.accentColor.dark : project.accentColor.light}20`,
                        border: `1px solid ${isDarkMode ? project.accentColor.dark : project.accentColor.light}40`
                      }}
                    >
                      <Icon size={28} style={{ color: isDarkMode ? project.accentColor.dark : project.accentColor.light }} />
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 style={{ 
                          color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                          fontFamily: 'var(--font-terminal)', 
                          fontSize: '1.1rem', 
                          fontWeight: 'bold' 
                        }}>
                          {project.name}
                        </h3>
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ 
                            background: statusStyle.bg, 
                            color: statusStyle.color,
                            fontFamily: 'var(--font-terminal)'
                          }}
                        >
                          {statusStyle.text}
                        </span>
                      </div>
                      
                      <p style={{ 
                        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                        fontFamily: 'var(--font-terminal)', 
                        fontSize: '0.875rem',
                        marginBottom: '12px'
                      }}>
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                              fontFamily: 'var(--font-terminal)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span 
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                              fontFamily: 'var(--font-terminal)'
                            }}
                          >
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Placeholder Image */}
                      <div 
                        className="rounded-lg overflow-hidden mb-3"
                        style={{
                          background: isDarkMode 
                            ? `linear-gradient(135deg, ${project.accentColor.dark}15 0%, ${project.accentColor.dark}05 100%)`
                            : `linear-gradient(135deg, ${project.accentColor.light}20 0%, ${project.accentColor.light}05 100%)`,
                          border: `1px dashed ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
                          height: '120px'
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Icon 
                              size={32} 
                              style={{ 
                                color: isDarkMode ? project.accentColor.dark : project.accentColor.light, 
                                opacity: 0.3,
                                margin: '0 auto 8px'
                              }} 
                            />
                            <p style={{ 
                              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                              fontFamily: 'var(--font-terminal)', 
                              fontSize: '0.7rem',
                              opacity: 0.5
                            }}>
                              // Screenshot placeholder
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {selectedProject?.id === project.id && (
                        <div className="mt-4 pt-4 animate-fade-in" style={{ 
                          borderTop: `1px dashed ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` 
                        }}>
                          <p style={{ 
                            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                            fontFamily: 'var(--font-terminal)', 
                            fontSize: '0.85rem',
                            lineHeight: '1.6',
                            marginBottom: '16px'
                          }}>
                            {project.longDescription}
                          </p>
                          
                          <div className="mb-4">
                            <p style={{ 
                              color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                              fontFamily: 'var(--font-terminal)', 
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              marginBottom: '8px'
                            }}>
                              Key Features:
                            </p>
                            <ul className="space-y-1">
                              {project.features.map((feature, idx) => (
                                <li 
                                  key={idx}
                                  className="flex items-center gap-2"
                                  style={{ 
                                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                                    fontFamily: 'var(--font-terminal)', 
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  <ChevronRight size={12} style={{ color: isDarkMode ? project.accentColor.dark : project.accentColor.light }} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{
                            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                            fontFamily: 'var(--font-terminal)',
                            fontSize: '0.8rem'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} />
                          View Source
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: `${isDarkMode ? project.accentColor.dark : project.accentColor.light}20`,
                              border: `1px solid ${isDarkMode ? project.accentColor.dark : project.accentColor.light}40`,
                              color: isDarkMode ? project.accentColor.dark : project.accentColor.light,
                              fontFamily: 'var(--font-terminal)',
                              fontSize: '0.8rem'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            Live Demo
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(selectedProject?.id === project.id ? null : project);
                          }}
                          className="ml-auto flex items-center gap-1 px-2 py-1 rounded transition-all hover:opacity-80"
                          style={{
                            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                            fontFamily: 'var(--font-terminal)',
                            fontSize: '0.75rem',
                            opacity: 0.7
                          }}
                        >
                          {selectedProject?.id === project.id ? 'Show Less' : 'Show More'}
                          <ChevronRight 
                            size={14} 
                            style={{ 
                              transform: selectedProject?.id === project.id ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
          <p style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontFamily: 'var(--font-terminal)', 
            fontSize: '0.75rem',
            opacity: 0.6,
            textAlign: 'center'
          }}>
            ~$ echo "More projects coming soon..." && git push origin main
          </p>
        </div>
      </div>
    </Modal>
  );
}
