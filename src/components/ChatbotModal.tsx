'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Send, Bot, User, Sparkles, MessageCircle, Trash2 } from 'lucide-react';

interface ChatbotModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  minimizedIndex?: number;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Rule-based chatbot responses - Enhanced with Carl's background and personality
const botResponses: { patterns: RegExp[]; responses: string[]; followUp?: string }[] = [
  // Greetings - Warm and welcoming
  {
    patterns: [/^(hello|hi|hey|greetings|good morning|good afternoon|good evening|sup|yo|hiya|howdy)!?$/i, /^(hello|hi|hey)/i],
    responses: [
      "Hello! 👋 Welcome to Carl's portfolio! I'm here to help you navigate around. What catches your interest - his projects, skills, or maybe the interactive features?",
      "Hey there! Great to have you here. Carl built this portfolio to showcase his work as a Full-Stack Developer. Feel free to ask me anything!",
      "Hi! I'm your friendly guide to Carl Victoria's portfolio. 🚀 Looking for something specific, or shall I give you a quick tour?",
      "Welcome! 👋 I'm Carl's AI assistant. He's a developer from the Philippines who loves building cool stuff. What would you like to explore?"
    ]
  },
  // Who is Carl - Personal background
  {
    patterns: [/who (are you|is carl)|about (you|carl)|tell me about (yourself|carl|him)|introduce|background/i],
    responses: [
      "Carl Victoria is a passionate Full-Stack Developer from the Philippines 🇵🇭! He specializes in building modern web applications with React, Next.js, and TypeScript. He's currently focused on creating user-friendly, interactive experiences - like this portfolio you're exploring right now!\n\nHe's always learning new technologies and loves turning ideas into reality through code.",
      "Let me tell you about Carl! 👨‍💻\n\nHe's a Full-Stack Developer based in the Philippines (UTC+8). His focus areas include:\n• Frontend: React, Next.js, TypeScript\n• Backend: Node.js, Express, MongoDB\n• UI/UX: Tailwind CSS, responsive design\n\nHe's known for building clean, interactive applications and has a keen eye for detail. This portfolio itself showcases his approach to development!",
      "Carl is a developer who believes code should be both functional AND beautiful. 🎨\n\nBased in the Philippines, he works as a Full-Stack Developer with expertise in modern JavaScript frameworks. What makes him stand out? His attention to user experience and love for building interactive features - just look at all the cool stuff in this portfolio!"
    ]
  },
  // Skills & Technologies - Comprehensive
  {
    patterns: [/skills|technologies|tech stack|what (can|do) (you|carl) (know|use)|programming|languages|frameworks|expertise|capable/i],
    responses: [
      "Carl has a solid tech stack! Here's what he works with:\n\n🔹 **Frontend**\nReact, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, JavaScript, Vue.js\n\n🔹 **Backend**\nNode.js, Express, Python, PHP\n\n🔹 **Databases**\nMongoDB, MySQL, PostgreSQL, Redis, SQLite\n\n🔹 **Tools**\nGit, VS Code, Docker, REST APIs, GraphQL\n\nHe's always expanding his knowledge!",
      "Carl's expertise spans the full stack! 💪\n\n**Frontend Favorites:**\n• React & Next.js for building UIs\n• TypeScript for type-safe code\n• Tailwind CSS for styling\n\n**Backend Skills:**\n• Node.js & Express servers\n• MongoDB & SQL databases\n• Python for scripting\n\nHe built this entire portfolio from scratch using Next.js, TypeScript, and Tailwind CSS!",
      "Here's a quick look at Carl's tech arsenal:\n\n⚛️ React/Next.js - His go-to for web apps\n📘 TypeScript - For safer, cleaner code  \n🎨 Tailwind CSS - Rapid styling\n🗄️ MongoDB - Flexible data storage\n🟢 Node.js - Server-side JavaScript\n🐍 Python - Automation & scripts\n\nFun fact: This chatbot you're using demonstrates his pattern-matching skills! 🤖"
    ]
  },
  // Projects - Detailed
  {
    patterns: [/projects|portfolio|work|what (have|has) (you|carl) (built|made|created)|show me|github|repos/i],
    responses: [
      "Carl has worked on some exciting projects! 🚀\n\n🐾 **PawSense**\nA pet care application helping pet owners track and manage their fur babies' health.\n\n🏛️ **CSU Forum**\nA university forum platform for student discussions and community building.\n\n💰 **utangPH**\nA debt tracking app to help manage personal finances.\n\n**Plus interactive demos on this site:**\n• Maps Explorer - Location search with Leaflet\n• AI Chatbot - That's me! 😄\n• Drawing Canvas - Community art gallery\n\nClick on any project in the Projects section to learn more!",
      "Here's what Carl's been building:\n\n**Main Projects:**\n1. PawSense 🐕 - Pet health tracking\n2. CSU Forum 💬 - University community platform\n3. utangPH 💵 - Debt management tool\n\n**Interactive Portfolio Features:**\n• Weather App with forecasts\n• Crypto price tracker\n• Typing speed test\n• Maps explorer\n• Drawing canvas with gallery\n• This chatbot!\n\nEach project demonstrates different aspects of his skills. Check out his GitHub for the source code!"
    ]
  },
  // Contact - Professional
  {
    patterns: [/contact|email|reach|hire|connect|get in touch|message|linkedin|socials/i],
    responses: [
      "Want to connect with Carl? Here's how! 📬\n\n🐱 **GitHub:** github.com/carlvictoria\nCheck out his code and projects\n\n💼 **LinkedIn:** Available in the portfolio\nProfessional networking\n\n📧 **Email:** Via the Contact section\nFor inquiries and opportunities\n\nHe's always open to:\n• New opportunities\n• Collaborations\n• Tech discussions\n• Feedback on his work\n\nDon't be shy - reach out!",
      "Carl would love to hear from you! 🤝\n\nBest ways to connect:\n• **GitHub** - See his open source work\n• **LinkedIn** - Professional connections\n• **Email** - Direct communication\n\nHe's particularly interested in:\n✅ Full-stack development roles\n✅ Collaborative projects\n✅ Tech community discussions\n\nHe typically responds within 24-48 hours!"
    ]
  },
  // Portfolio Features - Detailed guide
  {
    patterns: [/features|what can this (do|portfolio)|interactive|demo|try|explore/i],
    responses: [
      "This portfolio is packed with interactive features! 🎮\n\n**API Integrations:**\n🎵 Music Player - Spotify Web API\n🌤️ Weather App - OpenWeatherMap\n📰 News Reader - NewsAPI\n💹 Crypto Tracker - CoinGecko\n\n**Interactive Projects:**\n⌨️ Typing Test - With leaderboard!\n🗺️ Maps Explorer - Leaflet + OSM\n🎨 Drawing App - Save to gallery\n💬 Chatbot - That's me!\n\nEach feature showcases different skills - from API integration to real-time data handling. Try them all!",
      "Carl built this portfolio to be more than just a resume - it's a playground! 🎪\n\n**Real-Time Data:**\n• Weather forecasts\n• Crypto prices\n• News headlines\n\n**Creative Tools:**\n• Drawing canvas with community gallery\n• Typing speed tester\n\n**Exploration:**\n• Interactive world maps\n• AI chat assistant\n\nEvery feature was built from scratch to demonstrate full-stack capabilities!"
    ]
  },
  // Weather Feature
  {
    patterns: [/weather/i],
    responses: [
      "The Weather App is a full-featured weather dashboard! 🌤️\n\n**What it offers:**\n• Current conditions anywhere in the world\n• Hourly forecasts\n• 7-day predictions\n• Interactive weather map\n• Beautiful visualizations\n\n**Tech used:**\n• OpenWeatherMap API\n• Chart.js for graphs\n• Leaflet for maps\n\nTry searching for your city in the [FEATURES] section!",
      "Check out the Weather feature! 🌦️ It pulls real-time data from OpenWeatherMap API and displays:\n• Temperature & conditions\n• Wind speed & humidity\n• Forecast charts\n• Location on a map\n\nIt's a great example of API integration and data visualization!"
    ]
  },
  // Music Feature
  {
    patterns: [/music|spotify|song|playlist|audio/i],
    responses: [
      "The Music Player connects to Spotify! 🎵\n\n**Features:**\n• Browse playlists\n• Control playback\n• See what's playing\n• Album artwork display\n\n**Note:** You'll need a Spotify account to use the full features. It demonstrates OAuth integration and real-time music control!\n\nPerfect for background tunes while exploring the portfolio!",
      "Love music? 🎶 The Music Player feature showcases Spotify Web API integration!\n\nYou can:\n• Browse music\n• Control playback\n• View current track info\n\nIt's a fun demonstration of third-party API authentication and real-time controls!"
    ]
  },
  // Crypto Feature
  {
    patterns: [/crypto|bitcoin|ethereum|coin|blockchain|trading|price/i],
    responses: [
      "The Crypto Tracker is for all the crypto enthusiasts! 📈\n\n**Features:**\n• Search any cryptocurrency\n• Real-time price data\n• Market cap information\n• 7-day price charts\n• Price change indicators\n\n**Powered by:** CoinGecko API\n\nTry searching for Bitcoin, Ethereum, or any altcoin you're curious about!",
      "Interested in crypto? 💰 The Crypto Tracker lets you:\n\n• Look up any coin (BTC, ETH, etc.)\n• See live prices\n• View historical charts\n• Track market movements\n\nIt pulls data from CoinGecko API - one of the best sources for crypto data. Try it out in the Features section!"
    ]
  },
  // Typing Test Feature
  {
    patterns: [/typing|test|speed|wpm|keyboard|fast/i],
    responses: [
      "Think you're a fast typer? ⌨️ Test your skills!\n\n**The Typing Test features:**\n• Random text generation\n• Real-time WPM calculation\n• Accuracy tracking\n• Top 5 leaderboard (saved in MongoDB!)\n\n**Pro tip:** Focus on accuracy first - speed comes with practice!\n\nCan you make it to the top 5? 🏆",
      "The Typing Test is a fun challenge! 🎯\n\n• Type the displayed text as fast as you can\n• Your WPM and accuracy are calculated\n• Submit your score to the leaderboard\n• Compete with other visitors!\n\nIt uses Random Word API for text generation and MongoDB to store high scores. Try to beat the top players!"
    ]
  },
  // Maps Feature
  {
    patterns: [/map|location|explore|leaflet|geography|travel/i],
    responses: [
      "Explore the world with the Maps feature! 🗺️\n\n**Capabilities:**\n• Search any location globally\n• Autocomplete suggestions\n• Multiple map styles (Standard, Satellite, Terrain)\n• Geolocation support\n• Coordinates display\n\n**Built with:**\n• Leaflet.js\n• OpenStreetMap tiles\n• Nominatim geocoding API\n\nTry searching for your hometown or dream travel destination!",
      "The Maps Explorer is an interactive mapping tool! 🌍\n\n**Features:**\n• Search worldwide locations\n• Switch between map styles\n• Use your current location\n• Zoom and pan freely\n\nIt demonstrates Leaflet.js integration with geocoding APIs. Pretty cool for a portfolio feature, right?"
    ]
  },
  // Drawing Feature
  {
    patterns: [/draw|drawing|art|canvas|paint|creative|brush|sketch/i],
    responses: [
      "Feeling creative? 🎨 Try the Drawing App!\n\n**Features:**\n• Multiple brush colors\n• Adjustable brush sizes\n• Eraser tool\n• Clear canvas\n• Save to community gallery\n• Download your artwork\n\n**Bonus:** Enter your name to save drawings to MongoDB and see what others have created!\n\nIt's built with HTML5 Canvas API - pure creativity meets code!",
      "The Drawing Canvas is where creativity meets code! 🖌️\n\n• Pick colors from the palette\n• Choose your brush size\n• Create your masterpiece\n• Save it to the gallery!\n\n**Tech stack:**\n• HTML5 Canvas API\n• Touch support for mobile\n• MongoDB for gallery storage\n\nYour artwork joins a community gallery - see what other visitors have created!"
    ]
  },
  // This chatbot
  {
    patterns: [/chatbot|you|this chat|assistant|ai|bot|who made you/i],
    responses: [
      "That's me! 🤖 I'm Carl's portfolio assistant.\n\n**How I work:**\n• Pattern matching for understanding\n• Rule-based responses\n• Context-aware replies\n• Quick action shortcuts\n\n**What I can help with:**\n• Portfolio navigation\n• Information about Carl\n• Feature explanations\n• General questions\n\nI'm not GPT or anything fancy - just good old pattern matching with lots of personality!",
      "I'm your AI guide to this portfolio! 💬\n\n**About me:**\n• Built with React + TypeScript\n• Rule-based intelligence\n• Pattern matching engine\n• Contextual responses\n\nCarl created me to help visitors navigate his work. I know all about his projects, skills, and the features here. Ask me anything!\n\n(Fun fact: I have over 50 response patterns! 🎯)"
    ]
  },
  // Education/Experience
  {
    patterns: [/education|study|university|college|degree|learning|experience|work history|career/i],
    responses: [
      "Carl's journey in tech! 📚\n\n**Education:**\nCurrently pursuing his studies while actively building real-world projects. He believes in learning by doing!\n\n**Experience:**\n• Full-Stack Development\n• API Integration\n• Database Management\n• UI/UX Design\n\n**Philosophy:**\n\"The best way to learn is to build things that solve real problems.\"\n\nCheck out his GitHub to see his growth as a developer!",
      "Carl is a self-driven developer! 🎓\n\nHe combines formal education with extensive self-learning:\n• Online courses & tutorials\n• Open source contributions\n• Personal projects (like this portfolio!)\n• Tech community involvement\n\nHis hands-on approach means every project teaches him something new. The projects section shows his learning journey!"
    ]
  },
  // Thank you responses
  {
    patterns: [/thank|thanks|appreciate|helpful|great|awesome|nice|cool|good job/i],
    responses: [
      "You're welcome! 😊 Happy to help you explore Carl's work. Is there anything else you'd like to know?",
      "Glad I could help! 🌟 Feel free to ask more questions or try out the interactive features!",
      "Thanks for the kind words! 💙 If you have any more questions, I'm here. Enjoy the portfolio!",
      "My pleasure! 🎉 Don't forget to check out the projects and features - there's lots to explore!"
    ]
  },
  // Goodbye
  {
    patterns: [/bye|goodbye|see you|exit|quit|leave|ciao|later|peace/i],
    responses: [
      "Goodbye! 👋 Thanks for chatting with me. Hope you enjoyed exploring Carl's portfolio!",
      "See you around! 🌟 Feel free to come back anytime. Take care!",
      "Bye! 💙 Thanks for visiting. If you want to connect with Carl, check the contact section!",
      "Later! 🚀 Hope you found what you were looking for. Don't be a stranger!"
    ]
  },
  // Programming jokes
  {
    patterns: [/joke|funny|humor|laugh|entertain/i],
    responses: [
      "Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛😄",
      "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I join you?' 😂",
      "Why did the developer go broke?\nBecause he used up all his cache! 💸",
      "!false - It's funny because it's true. 🤓",
      "There are only 10 types of people in the world:\nThose who understand binary and those who don't! 😄",
      "Why do Java developers wear glasses?\nBecause they can't C#! 👓"
    ]
  },
  // How are you
  {
    patterns: [/how are you|how('s| is) it going|what's up|hows life/i],
    responses: [
      "I'm running at optimal efficiency! 🤖 All systems operational. How can I help you today?",
      "Doing great! Ready to chat about Carl's awesome work. What interests you?",
      "Living my best bot life! 💫 What would you like to explore in the portfolio?",
      "Fantastic! Been helping visitors all day. What can I do for you?"
    ]
  },
  // Philippines/Location specific
  {
    patterns: [/philippines|manila|filipino|ph|timezone|where.*from|located/i],
    responses: [
      "Carl is based in the Philippines! 🇵🇭\n\n**Timezone:** UTC+8 (Philippine Standard Time)\n\nThe Philippines has a growing tech scene, and Carl is proud to be part of it. He's available for both local and remote opportunities!\n\nFun fact: 'Kamusta' (hello in Filipino) is one of the greetings in the opening animation!",
      "Yes! Carl's from the Philippines 🇵🇭\n\n• Timezone: UTC+8 (PHT)\n• Available for remote work globally\n• Active in the local tech community\n\nThe 'Kamusta>' in the greeting animation is Tagalog for 'Hello' - a nice touch of Filipino culture!"
    ]
  },
  // Availability/Hiring
  {
    patterns: [/available|hire|hiring|open to|freelance|job|position|opportunity|remote|work/i],
    responses: [
      "Great question! 💼\n\nCarl is open to:\n✅ Full-time positions\n✅ Remote opportunities\n✅ Freelance projects\n✅ Collaborations\n\nHe's particularly interested in roles involving:\n• React/Next.js development\n• Full-stack projects\n• Innovative web applications\n\nReach out through the Contact section or LinkedIn!",
      "Carl is actively looking for opportunities! 🚀\n\n**Interests:**\n• Full-stack development roles\n• Remote or hybrid positions\n• Startup environments\n• Interesting projects\n\n**What he brings:**\n• Strong React/Next.js skills\n• Full-stack capabilities\n• Eye for design\n• Passion for clean code\n\nDon't hesitate to reach out!"
    ]
  },
  // Help/Commands
  {
    patterns: [/help|what can (you|i) (do|ask)|commands|options|menu/i],
    responses: [
      "Here's what I can help you with! 📋\n\n**About Carl:**\n• Who is Carl?\n• His skills & tech stack\n• Projects he's built\n• How to contact him\n\n**Portfolio Features:**\n• Weather App\n• Music Player\n• Crypto Tracker\n• Typing Test\n• Maps Explorer\n• Drawing Canvas\n\n**Quick Actions:**\nUse the buttons above to ask common questions!\n\nOr just chat naturally - I understand a lot! 😊"
    ]
  },
  // Favorite things
  {
    patterns: [/favorite|hobby|hobbies|interest|free time|like to do|passion/i],
    responses: [
      "Beyond coding, here's what drives Carl! 🌟\n\n**Passions:**\n• Building interactive UIs\n• Learning new technologies\n• Creating useful applications\n• Clean, maintainable code\n\n**Interests:**\n• Tech & innovation\n• Problem-solving\n• Community building\n• Continuous learning\n\nThis portfolio itself shows his passion for creating engaging experiences!"
    ]
  },
  // Why this portfolio
  {
    patterns: [/why.*portfolio|purpose|goal|built this|reason/i],
    responses: [
      "Why did Carl build this? 🤔\n\n**Goals:**\n• Showcase skills beyond a resume\n• Demonstrate full-stack abilities\n• Create something interactive\n• Stand out to recruiters\n\n**Philosophy:**\nInstead of just listing skills, Carl wanted to SHOW them. Every feature here - from the Weather App to this chatbot - demonstrates real development capabilities.\n\nIt's not just a portfolio, it's a playground! 🎮"
    ]
  },
  // Positive feedback
  {
    patterns: [/impressive|amazing|love it|beautiful|gorgeous|stunning|fantastic/i],
    responses: [
      "Thanks for the kind words! 💖 Carl put a lot of effort into making this portfolio both functional and visually appealing. If you're impressed, imagine what he could build for your project!",
      "That's so nice to hear! 🙏 Carl really cares about the details. Feel free to explore more features or reach out if you'd like to work with him!"
    ]
  },
  // Random/Gibberish
  {
    patterns: [/asdf|qwerty|test|testing|123|abc/i],
    responses: [
      "Testing 1, 2, 3... 🎤 Everything's working! Try asking me something about Carl's work or the portfolio features.",
      "I see you're testing the waters! 😄 I'm fully operational. Ask me about projects, skills, or features!",
      "Keyboard check passed! ⌨️ Now, what would you actually like to know about Carl's portfolio?"
    ]
  },
  // Empty/Short messages
  {
    patterns: [/^.{1,2}$/],
    responses: [
      "Hmm, could you elaborate? I'd love to help you explore Carl's portfolio!",
      "I need a bit more to work with! Try asking about skills, projects, or features.",
      "That's... brief! 😄 Feel free to ask me anything about the portfolio."
    ]
  }
];

// Default response when no pattern matches - More helpful
const defaultResponses = [
  "Interesting question! 🤔 I'm not sure about that specific topic, but I know lots about Carl! Try asking about:\n• His skills and technologies\n• Projects he's built\n• How to contact him\n• Portfolio features",
  "Hmm, that's outside my expertise! I'm specialized in Carl's portfolio. Try asking:\n• \"What skills does Carl have?\"\n• \"Show me the projects\"\n• \"What features are available?\"",
  "I'm not quite sure about that, but here's what I can help with:\n🔹 Carl's background & skills\n🔹 His projects & experience\n🔹 Portfolio features\n🔹 Contact information\n\nWhat interests you?",
  "That's a creative question! 😅 While I might not have the perfect answer, I can definitely tell you about Carl's development work. What aspect interests you most?"
];

function getBotResponse(message: string): string {
  const trimmedMessage = message.trim().toLowerCase();
  
  for (const { patterns, responses } of botResponses) {
    for (const pattern of patterns) {
      if (pattern.test(trimmedMessage)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default function ChatbotModal({ isDarkMode, onClose, minimizedIndex = 0 }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! 👋 I'm Carl's portfolio assistant. I know all about his skills, projects, and the cool features here.\n\n**Quick tips:**\n• Try the buttons above for common questions\n• Or just chat naturally!\n\nWhat would you like to explore?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for more natural feel
    const typingDelay = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'bot',
        content: "Chat cleared! How can I help you?",
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { label: "👨‍💻 About Carl", message: "Who is Carl?" },
    { label: "💻 Skills", message: "What technologies does Carl know?" },
    { label: "🚀 Projects", message: "Tell me about Carl's projects" },
    { label: "✨ Features", message: "What interactive features are available?" },
    { label: "📬 Contact", message: "How can I reach Carl?" },
    { label: "💼 Hiring", message: "Is Carl available for work?" }
  ];

  return (
    <Modal
      isDarkMode={isDarkMode}
      onClose={onClose}
      title="AI Chatbot"
      width="800px"
      minWidth="600px"
      minHeight="600px"
      showTypingAnimation={true}
      typingText="chatbot.exe"
      minimizedIndex={minimizedIndex}
    >
      <div className="flex flex-col h-full" style={{ maxHeight: '560px' }}>
        {/* Header */}
        <div className="mb-4">
          <p 
            style={{ 
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
              fontSize: '0.75rem', 
              fontFamily: 'monospace' 
            }}
          >
            ~$ ./chatbot --mode=interactive
          </p>
        </div>

        {/* Project Info Card */}
        <div 
          className="mb-4 p-4 rounded-lg"
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
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}
                className="flex items-center gap-2"
              >
                <Sparkles size={20} />
                Portfolio AI Assistant
              </h2>
              <p 
                style={{ 
                  color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}
              >
                Ask me anything about Carl's work, skills, or portfolio features!
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                color: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)'
              }}
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Rule-based AI', 'Pattern Matching', 'Context-Aware', 'Interactive'].map((tech) => (
              <span 
                key={tech}
                className="px-2 py-1 rounded text-xs"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                  color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)',
                  fontFamily: 'monospace'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map(({ label, message }) => (
            <button
              key={label}
              onClick={() => {
                setInputValue(message);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                fontFamily: 'monospace',
                fontSize: '0.75rem'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div 
          className="flex-1 overflow-y-auto p-4 rounded-lg mb-4 scrollbar-hide"
          style={{
            background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            maxHeight: '280px'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: message.role === 'bot' 
                    ? (isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.2)')
                    : (isDarkMode ? 'rgba(255, 198, 0, 0.2)' : 'rgba(39, 139, 210, 0.2)')
                }}
              >
                {message.role === 'bot' ? (
                  <Bot size={16} style={{ color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)' }} />
                ) : (
                  <User size={16} style={{ color: isDarkMode ? 'var(--title-color)' : 'var(--title-color-l)' }} />
                )}
              </div>

              {/* Message Bubble */}
              <div 
                className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                style={{
                  background: message.role === 'bot'
                    ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)')
                    : (isDarkMode ? 'rgba(255, 198, 0, 0.1)' : 'rgba(39, 139, 210, 0.1)'),
                  border: `1px solid ${message.role === 'bot'
                    ? (isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)')
                    : (isDarkMode ? 'rgba(255, 198, 0, 0.3)' : 'rgba(39, 139, 210, 0.3)')}`
                }}
              >
                <p 
                  style={{ 
                    color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                  }}
                >
                  {message.content}
                </p>
                <p 
                  style={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    fontFamily: 'monospace',
                    fontSize: '0.65rem',
                    marginTop: '4px'
                  }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.2)'
                }}
              >
                <Bot size={16} style={{ color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)' }} />
              </div>
              <div 
                className="p-3 rounded-lg rounded-tl-none"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`
                }}
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms', color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)' }}></span>
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms', color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)' }}></span>
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms', color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-lg transition-all"
            style={{
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              color: isDarkMode ? 'var(--cmd-title)' : 'var(--cmd-title-l)',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-5 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            style={{
              background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
              color: isDarkMode ? 'rgba(167, 139, 250, 1)' : 'rgba(124, 58, 237, 1)',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            <Send size={16} />
            Send
          </button>
        </form>
      </div>
    </Modal>
  );
}
