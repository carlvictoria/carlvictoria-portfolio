'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from './Modal';
import { Pencil, Eraser, Trash2, Save, Download, Palette, Image, ChevronLeft, ChevronRight, X, User, Calendar } from 'lucide-react';

interface DrawingModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface SavedDrawing {
  _id: string;
  name: string;
  imageData: string;
  timestamp: string;
}

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#FF6B00', '#FFD700', '#00FF00', 
  '#00FFFF', '#0066FF', '#8B00FF', '#FF00FF', '#FF69B4', '#8B4513'
];

const BRUSH_SIZES = [2, 4, 8, 12, 20, 32];

export default function DrawingModal({ isDarkMode, onClose, minimizedIndex = 0 }: DrawingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [playerName, setPlayerName] = useState('');
  const [canDraw, setCanDraw] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryDrawings, setGalleryDrawings] = useState<SavedDrawing[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<SavedDrawing | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Focus name input on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Check if name is entered
  useEffect(() => {
    setCanDraw(playerName.trim().length > 0);
  }, [playerName]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canDraw) return;
    
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    lastPos.current = coords;
    
    // Draw a dot for single clicks
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.fill();
      setHasDrawn(true);
    }
  }, [canDraw, brushSize, color, tool, getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canDraw) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPos.current) return;

    const coords = getCanvasCoords(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    lastPos.current = coords;
    setHasDrawn(true);
  }, [isDrawing, canDraw, color, brushSize, tool, getCanvasCoords]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSaveResult(null);
  };

  const saveDrawing = async () => {
    if (!canDraw || !hasDrawn) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsSaving(true);
    setSaveResult(null);
    
    try {
      const imageData = canvas.toDataURL('image/png');
      
      const response = await fetch('/api/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          imageData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveResult('🎨 Drawing saved successfully! Check the gallery to see it.');
        // Refresh gallery if it's open
        if (showGallery) {
          loadGallery();
        }
      } else {
        setSaveResult('Failed to save drawing. Please try again.');
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      setSaveResult('Error saving drawing. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `drawing-${playerName || 'anonymous'}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const loadGallery = async () => {
    setIsLoadingGallery(true);
    
    try {
      const response = await fetch('/api/drawings');
      if (response.ok) {
        const data = await response.json();
        setGalleryDrawings(data.drawings || []);
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const toggleGallery = () => {
    if (!showGallery) {
      loadGallery();
    }
    setShowGallery(!showGallery);
    setSelectedDrawing(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="Drawing App"
      width="1000px"
      minWidth="800px"
      minHeight="800px"
      showTypingAnimation={true}
      typingText="drawing-canvas.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full" style={{ maxHeight: '750px' }}>
        {/* Header */}
        <div className="mb-3">
          <p 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontSize: '0.75rem', 
              fontFamily: 'monospace' 
            }}
          >
            ~$ ./drawing-canvas --mode=creative
          </p>
        </div>

        {/* Project Info Card */}
        <div 
          className="mb-3 p-3 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 
                style={{ 
                  color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)', 
                  fontFamily: 'monospace', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  marginBottom: '2px'
                }}
                className="flex items-center gap-2"
              >
                <Palette size={18} />
                Creative Drawing Canvas
              </h2>
              <p 
                style={{ 
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                  fontFamily: 'monospace', 
                  fontSize: '0.7rem',
                  opacity: 0.8
                }}
              >
                Create art, save to gallery, and view community submissions!
              </p>
            </div>
            <button
              onClick={toggleGallery}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              style={{
                background: showGallery 
                  ? (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                  : (isDarkMode ? 'rgba(255, 198, 0, 0.1)' : 'rgba(39, 139, 210, 0.1)'),
                border: `1px solid ${isDarkMode ? 'rgba(255, 198, 0, 0.3)' : 'rgba(39, 139, 210, 0.3)'}`,
                color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
              }}
            >
              <Image size={16} />
              {showGallery ? 'Hide Gallery' : 'View Gallery'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {['HTML5 Canvas', 'Touch Support', 'MongoDB Storage', 'Gallery View'].map((tech) => (
              <span 
                key={tech}
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: isDarkMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(219, 39, 119, 0.15)',
                  color: isDarkMode ? 'rgba(244, 114, 182, 1)' : 'rgba(219, 39, 119, 1)',
                  fontFamily: 'monospace'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery View */}
        {showGallery ? (
          <div className="flex-1 overflow-hidden">
            {selectedDrawing ? (
              /* Single Drawing View */
              <div className="h-full flex flex-col">
                <button
                  onClick={() => setSelectedDrawing(null)}
                  className="mb-3 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 self-start"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem'
                  }}
                >
                  <ChevronLeft size={14} />
                  Back to Gallery
                </button>
                <div 
                  className="flex-1 p-4 rounded-lg flex flex-col items-center"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}
                >
                  <img 
                    src={selectedDrawing.imageData} 
                    alt={`Drawing by ${selectedDrawing.name}`}
                    className="max-w-full max-h-[300px] rounded-lg border"
                    style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }}
                  />
                  <div className="mt-4 text-center">
                    <p 
                      style={{ 
                        color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <User size={16} />
                      {selectedDrawing.name}
                    </p>
                    <p 
                      style={{ 
                        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        opacity: 0.7
                      }}
                      className="flex items-center justify-center gap-2 mt-1"
                    >
                      <Calendar size={12} />
                      {formatDate(selectedDrawing.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Gallery Grid */
              <div 
                className="h-full overflow-y-auto p-4 rounded-lg scrollbar-hide"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  maxHeight: '380px'
                }}
              >
                {isLoadingGallery ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }}></div>
                  </div>
                ) : galleryDrawings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image size={48} style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', opacity: 0.5, marginBottom: '16px' }} />
                    <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', opacity: 0.7 }}>
                      No drawings yet. Be the first to create one!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {galleryDrawings.map((drawing) => (
                      <div
                        key={drawing._id}
                        onClick={() => setSelectedDrawing(drawing)}
                        className="cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105"
                        style={{
                          background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                        }}
                      >
                        <img 
                          src={drawing.imageData} 
                          alt={`Drawing by ${drawing.name}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <p 
                            style={{ 
                              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                            className="truncate"
                          >
                            {drawing.name}
                          </p>
                          <p 
                            style={{ 
                              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                              fontFamily: 'monospace',
                              fontSize: '0.65rem',
                              opacity: 0.6
                            }}
                          >
                            {formatDate(drawing.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Drawing Canvas View */
          <>
            {/* Name Input */}
            <div className="mb-3">
              <div className="flex items-center gap-3">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 max-w-xs px-3 py-2 rounded-lg outline-none"
                  style={{
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                    border: `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`,
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter your name to start drawing..."
                  maxLength={50}
                />
                {!canDraw && (
                  <span style={{ color: 'rgba(255, 204, 0, 0.8)', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                    ⚠ Name required
                  </span>
                )}
              </div>
            </div>

            {/* Tools & Canvas Container */}
            <div className="flex gap-4 flex-1">
              {/* Left Toolbar */}
              <div 
                className="flex flex-col gap-3 p-3 rounded-lg"
                style={{
                  background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                }}
              >
                {/* Tool Selection */}
                <div className="space-y-2">
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.7 }}>
                    TOOLS
                  </p>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setTool('brush')}
                      className="p-2 rounded transition-all"
                      style={{
                        background: tool === 'brush' 
                          ? (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                          : 'transparent',
                        border: `1px solid ${tool === 'brush'
                          ? (isDarkMode ? 'rgba(255, 198, 0, 0.5)' : 'rgba(39, 139, 210, 0.5)')
                          : 'transparent'}`,
                        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                      }}
                      title="Brush"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className="p-2 rounded transition-all"
                      style={{
                        background: tool === 'eraser' 
                          ? (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                          : 'transparent',
                        border: `1px solid ${tool === 'eraser'
                          ? (isDarkMode ? 'rgba(255, 198, 0, 0.5)' : 'rgba(39, 139, 210, 0.5)')
                          : 'transparent'}`,
                        color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                      }}
                      title="Eraser"
                    >
                      <Eraser size={18} />
                    </button>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.7 }}>
                    COLORS
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setTool('brush');
                        }}
                        className="w-6 h-6 rounded transition-all"
                        style={{
                          backgroundColor: c,
                          border: color === c && tool === 'brush'
                            ? `2px solid ${isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)'}`
                            : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                          transform: color === c && tool === 'brush' ? 'scale(1.1)' : 'scale(1)'
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Brush Size */}
                <div className="space-y-2">
                  <p style={{ color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.7 }}>
                    SIZE
                  </p>
                  <div className="flex flex-col gap-1">
                    {BRUSH_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setBrushSize(size)}
                        className="flex items-center justify-center p-1 rounded transition-all"
                        style={{
                          background: brushSize === size 
                            ? (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                            : 'transparent',
                          border: `1px solid ${brushSize === size
                            ? (isDarkMode ? 'rgba(255, 198, 0, 0.5)' : 'rgba(39, 139, 210, 0.5)')
                            : 'transparent'}`
                        }}
                        title={`${size}px`}
                      >
                        <div
                          className="rounded-full"
                          style={{
                            width: `${Math.min(size, 20)}px`,
                            height: `${Math.min(size, 20)}px`,
                            backgroundColor: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-auto">
                  <button
                    onClick={clearCanvas}
                    className="w-full p-2 rounded transition-all flex items-center justify-center gap-1"
                    style={{
                      background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                      border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                      color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem'
                    }}
                    title="Clear canvas"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={downloadDrawing}
                    disabled={!hasDrawn}
                    className="w-full p-2 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    style={{
                      background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                      color: isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem'
                    }}
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={saveDrawing}
                    disabled={!canDraw || !hasDrawn || isSaving}
                    className="w-full p-2 rounded transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    style={{
                      background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                      border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
                      color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem'
                    }}
                    title="Save to gallery"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2" style={{ borderColor: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)' }}></div>
                    ) : (
                      <Save size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex flex-col">
                <div 
                  className="flex-1 rounded-lg overflow-hidden"
                  style={{
                    border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                    opacity: canDraw ? 1 : 0.5
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={350}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      touchAction: 'none'
                    }}
                  />
                </div>

                {/* Save Result Message */}
                {saveResult && (
                  <div 
                    className="mt-2 p-2 rounded-lg"
                    style={{
                      background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                      border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`,
                    }}
                  >
                    <p style={{ color: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(22, 163, 74, 1)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {saveResult}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
