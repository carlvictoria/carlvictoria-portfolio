# News Component Setup Guide

## ✅ Component Created
The `NewsModal` component has been created at:
- `src/components/NewsModal.tsx`

## 📋 Quick Integration

### 1. Get Your Free GNews API Key
1. Visit: https://gnews.io/
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_GNEWS_API_KEY=your_actual_api_key_here
   ```

### 2. Add to Your HomePage

```tsx
import NewsModal from "@/components/NewsModal";

// In your component:
const [showNews, setShowNews] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(true);

// Add the modal (conditionally rendered):
{showNews && (
  <NewsModal 
    isDarkMode={isDarkMode} 
    onClose={() => setShowNews(false)} 
  />
)}

// Trigger it with a button:
<button onClick={() => setShowNews(true)}>
  Latest News
</button>
```

### 3. Example Usage in ContentBox

```tsx
<ContentBox 
  title="📰 News" 
  onClick={() => setShowNews(true)}
>
  Stay updated with latest headlines
</ContentBox>
```

## 🎨 Features

✅ **Fully Clickable News Items** - Each article opens in a new tab
✅ **Modern Desktop Window UI** - Matches your portfolio aesthetic
✅ **Loading Skeletons** - Professional loading state
✅ **Error Handling** - Graceful error UI with retry button
✅ **Auto-Refresh** - Updates every 10 minutes
✅ **Dark Mode** - Fully styled for dark theme
✅ **Responsive** - Works on all screen sizes
✅ **Image Fallbacks** - Handles missing thumbnails gracefully
✅ **Relative Timestamps** - "2h ago", "3d ago" format
✅ **External Link Icons** - Visual indicator for external links

## 🔧 API Configuration

**GNews API (Recommended)**
- Free tier: 100 requests/day
- No credit card required
- Production-friendly

**Alternative: NewsAPI**
If you prefer NewsAPI instead, modify the fetch call in `NewsModal.tsx`:

```typescript
const response = await fetch(
  `https://newsapi.org/v2/top-headlines?country=us&pageSize=8&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
);
```

## 🎯 Customization Options

### Change Number of Articles
```typescript
// In fetchNews function, change max parameter:
max=10  // Shows 10 articles instead of 8
```

### Change Language
```typescript
lang=en  // Change to: es, fr, de, etc.
```

### Change Category
```typescript
// Add category parameter:
&category=technology  // Options: general, business, technology, sports, etc.
```

### Change Auto-Refresh Interval
```typescript
// In useEffect, change interval (currently 10 minutes):
const interval = setInterval(fetchNews, 5 * 60 * 1000); // 5 minutes
```

## 🚀 Production Ready
- ✅ TypeScript interfaces
- ✅ Error boundaries
- ✅ Loading states
- ✅ Accessibility attributes
- ✅ SEO-friendly external links
- ✅ Performance optimized
