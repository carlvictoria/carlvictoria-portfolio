'use client';

import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { Mail, User, FileText, MessageSquare, Send, CheckCircle, AlertCircle, Briefcase, Palette, Users, HelpCircle } from 'lucide-react';

interface ContactModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

type ContactType = 'general' | 'commission' | 'collaboration' | 'job';

const contactTypes: { value: ContactType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'general', label: 'General Inquiry', icon: HelpCircle, description: 'Questions or feedback' },
  { value: 'commission', label: 'Commission', icon: Palette, description: 'Project or work request' },
  { value: 'collaboration', label: 'Collaboration', icon: Users, description: 'Partnership opportunities' },
  { value: 'job', label: 'Job Opportunity', icon: Briefcase, description: 'Employment or freelance' },
];

export default function ContactModal({ isDarkMode, onClose, minimizedIndex = 0 }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState<ContactType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [charCount, setCharCount] = useState(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const MAX_MESSAGE_LENGTH = 5000;

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setSubmitResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    if (message.length < 10) {
      setSubmitResult({ success: false, message: 'Message must be at least 10 characters' });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          type: contactType
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitResult({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
        // Reset form
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setContactType('general');
      } else {
        setSubmitResult({ success: false, message: data.error || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)',
    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
    fontFamily: 'var(--font-terminal)',
    fontSize: '0.9rem'
  };

  const labelStyle = {
    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
    fontFamily: 'var(--font-terminal)',
    fontSize: '0.8rem',
    opacity: 0.8
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="Contact"
      width="800px"
      minWidth="700px"
      minHeight="720px"
      showTypingAnimation={true}
      typingText="contact.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full p-4" style={{ overflow: 'visible' }}>
        {/* Command Header */}
        <p 
          style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontSize: '0.75rem', 
            fontFamily: 'monospace',
            marginBottom: '12px'
          }}
        >
          ~$ ./contact --send-message
        </p>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-2 rounded-lg"
              style={{
                background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
              }}
            >
              <Mail size={24} style={{ color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)' }} />
            </div>
            <div>
              <h1 style={{ 
                color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                fontFamily: 'var(--font-terminal)', 
                fontSize: '1.4rem', 
                fontWeight: 'bold' 
              }}>
                Get in Touch
              </h1>
              <p style={{ 
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                fontFamily: 'var(--font-terminal)', 
                fontSize: '0.8rem',
                opacity: 0.7
              }}>
                I'd love to hear from you! Send me a message.
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {submitResult && (
          <div 
            className="mb-4 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
            style={{
              background: submitResult.success 
                ? (isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)')
                : (isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.15)'),
              border: `1px solid ${submitResult.success 
                ? (isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)')
                : (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)')}`
            }}
          >
            {submitResult.success ? (
              <CheckCircle size={20} style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)' }} />
            )}
            <span style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontFamily: 'var(--font-terminal)',
              fontSize: '0.85rem'
            }}>
              {submitResult.message}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-3 px-1" style={{ overflow: 'visible' }}>
          {/* Contact Type Selection */}
          <div>
            <label style={labelStyle} className="block mb-1">
              <FileText size={14} className="inline mr-2" />
              Message Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {contactTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = contactType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setContactType(type.value)}
                    className="p-3 rounded-lg text-left transition-all"
                    style={{
                      background: isSelected 
                        ? (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)')
                        : (isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)'),
                      border: `1px solid ${isSelected 
                        ? (isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)')
                        : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')}`,
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        size={16} 
                        style={{ 
                          color: isSelected 
                            ? (isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)')
                            : (isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)')
                        }} 
                      />
                      <span style={{ 
                        color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                        fontFamily: 'var(--font-terminal)',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? '600' : '400'
                      }}>
                        {type.label}
                      </span>
                    </div>
                    <p style={{ 
                      color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                      fontFamily: 'var(--font-terminal)',
                      fontSize: '0.7rem',
                      opacity: 0.6,
                      marginTop: '4px',
                      marginLeft: '24px'
                    }}>
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle} className="block mb-1">
                <User size={14} className="inline mr-2" />
                Your Name
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-2.5 rounded-lg outline-none transition-all focus:ring-2"
                style={{
                  ...inputStyle,
                  '--tw-ring-color': isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)'
                } as React.CSSProperties}
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label style={labelStyle} className="block mb-1">
                <Mail size={14} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full p-2.5 rounded-lg outline-none transition-all focus:ring-2"
                style={inputStyle}
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label style={labelStyle} className="block mb-1">
              <FileText size={14} className="inline mr-2" />
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full p-2.5 rounded-lg outline-none transition-all focus:ring-2"
              style={inputStyle}
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div>
            <label style={labelStyle} className="flex justify-between mb-1">
              <span>
                <MessageSquare size={14} className="inline mr-2" />
                Message
              </span>
              <span style={{ opacity: 0.5 }}>
                {charCount}/{MAX_MESSAGE_LENGTH}
              </span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project, idea, or just say hello..."
              className="w-full p-2.5 rounded-lg outline-none transition-all focus:ring-2 resize-none"
              style={{
                ...inputStyle,
                minHeight: '100px'
              }}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !email.trim() || !subject.trim() || !message.trim()}
            className="w-full p-3 rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)'}`,
              color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
              fontFamily: 'var(--font-terminal)',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {isSubmitting ? (
              <>
                <div 
                  className="animate-spin rounded-full h-5 w-5 border-b-2" 
                  style={{ borderColor: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
          <p style={{ 
            color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
            fontFamily: 'var(--font-terminal)', 
            fontSize: '0.7rem',
            opacity: 0.5,
            textAlign: 'center'
          }}>
            ~$ echo "I typically respond within 24-48 hours" && notify-send "Message queued"
          </p>
        </div>
      </div>
    </Modal>
  );
}
