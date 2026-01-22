"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface NewsModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

const NewsModal: React.FC<NewsModalProps> = ({ isDarkMode, onClose, minimizedIndex = 0 }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }

      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?lang=en&max=8&token=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal 
      isDarkMode={isDarkMode} 
      onClose={onClose}
      title="Latest News"
      width="1000px"
      minWidth="900px"
      minHeight="400px"
      showTypingAnimation={true}
      typingText="news-reader.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Content Area */}
        <div 
          className="flex-1 space-y-4 scrollbar-hide" 
          style={{ 
            maxHeight: '650px',
            overflowY: 'scroll',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none'  /* Internet Explorer 10+ */
          }}
        >
          {loading && (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/30 rounded-xl p-3 animate-pulse border border-slate-700/30"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                    borderColor: isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)'
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <div 
                      className="w-full h-20 rounded-lg"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
                      }}
                    ></div>
                    <div className="space-y-2">
                      <div 
                        className="h-4 rounded w-full"
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
                        }}
                      ></div>
                      <div 
                        className="h-3 rounded w-3/4"
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div 
              className="border rounded-xl p-6 text-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(153, 27, 27, 0.2)' : 'rgba(254, 226, 226, 0.8)',
                borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(248, 113, 113, 0.5)'
              }}
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h3 
                className="font-semibold mb-2"
                style={{ color: isDarkMode ? 'rgb(248 113 113)' : 'rgb(185 28 28)' }}
              >
                Failed to Load News
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: isDarkMode ? 'rgb(148 163 184)' : 'rgb(100 116 139)' }}
              >
                {error}
              </p>
              <button
                onClick={fetchNews}
                className="px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(254, 226, 226, 0.8)',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(248, 113, 113, 0.5)',
                  color: isDarkMode ? 'rgb(252 165 165)' : 'rgb(185 28 28)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(254, 202, 202, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(254, 226, 226, 0.8)';
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div 
              className="rounded-xl p-8 text-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                border: `1px solid ${isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)'}`
              }}
            >
              <div className="text-4xl mb-3">📰</div>
              <h3 
                className="font-semibold mb-2"
                style={{ color: isDarkMode ? 'rgb(148 163 184)' : 'rgb(71 85 105)' }}
              >
                No News Available
              </h3>
              <p 
                className="text-sm"
                style={{ color: isDarkMode ? 'rgb(100 116 139)' : 'rgb(100 116 139)' }}
              >
                Check back later for the latest headlines
              </p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className="group cursor-pointer transition-all duration-200 rounded-xl p-3 border"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                    borderColor: isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)',
                    fontFamily: 'var(--font-terminal)'
                  }}
                  onClick={() => window.open(article.url, '_blank')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 8px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
                      : '0 8px 20px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(248, 250, 252, 0.8)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {article.image && (
                      <div className="w-full">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-24 object-cover rounded-lg border"
                          style={{
                            borderColor: isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 group-hover:underline text-sm leading-tight"
                        style={{ 
                          color: isDarkMode ? 'rgb(248 250 252)' : 'rgb(15 23 42)'
                        }}
                      >
                        {article.title}
                      </h3>
                      {article.description && (
                        <p 
                          className="text-xs mb-2 line-clamp-2"
                          style={{ color: isDarkMode ? 'rgb(148 163 184)' : 'rgb(100 116 139)' }}
                        >
                          {article.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span 
                          className="font-medium truncate"
                          style={{ color: isDarkMode ? 'rgb(94 234 212)' : 'rgb(20 184 166)' }}
                        >
                          {article.source.name}
                        </span>
                        <span 
                          className="ml-2 flex-shrink-0"
                          style={{ color: isDarkMode ? 'rgb(100 116 139)' : 'rgb(148 163 184)' }}
                        >
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer with refresh info */}
        <div 
          className="border-t p-4 flex items-center justify-between text-xs"
          style={{
            borderColor: isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)',
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.8)',
            color: isDarkMode ? 'rgb(100 116 139)' : 'rgb(148 163 184)',
            fontFamily: 'var(--font-terminal)'
          }}
        >
          <span>Auto-refreshes every 10 minutes</span>
          <button
            onClick={fetchNews}
            className="px-3 py-1 rounded border transition-colors text-xs"
            style={{
              borderColor: isDarkMode ? 'rgba(14, 165, 233, 0.5)' : 'rgba(59, 130, 246, 0.5)',
              color: isDarkMode ? 'rgb(125 211 252)' : 'rgb(37 99 235)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewsModal;
