import React, { useState, useEffect, useRef, Suspense, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, useTexture } from '@react-three/drei';
import { generateCV } from './utils/generateCV';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Code,
  BarChart3,
  Cpu,
  Award,
  BookOpen,
  Send,
  Download,
  Terminal,
  BrainCircuit,
  Database,
  Check,
  Copy,
  Loader2,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Bot,
  MessageSquare,
  Move3d,
  ImageOff,
  Scan,
  Zap,
  Upload
} from 'lucide-react';
import { SKILLS, PROJECTS, EXPERIENCES, ACHIEVEMENTS, CERTIFICATIONS } from './data';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

// --- Custom Icons for Platforms not in Lucide ---

const UpworkIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className}>
    <title>Upwork</title>
    <path d="M18.561 0.264c-2.333 0-4.04 1.765-4.48 4.298h-0.076c-0.654-2.73-2.613-4.298-5.325-4.298-3.051 0-5.216 2.45-5.216 5.869 0 3.255 2.155 5.673 5.086 5.673 1.956 0 3.515-1.042 4.318-2.69h0.066c0.076 0.273 0.163 0.522 0.272 0.773-2.645 1.545-4.545 4.19-4.545 7.747 0 2.928 1.481 4.704 3.65 4.704 1.939 0 3.039-1.393 3.517-3.693h-0.054c0.556 1.83 2.112 3.693 4.547 3.693 2.875 0 5.174-2.112 5.174-5.356v-10.907h-3.414v10.907c0 1.545-0.893 2.504-2.222 2.504-1.284 0-2.090-0.904-2.090-2.504v-10.907h-3.414v4.542c0 2.821 1.753 4.962 4.095 4.962 0.207 0 0.403-0.021 0.61-0.054 0.686-2.527 2.067-4.433 4.155-5.717v-1.122c0-3.232-2.122-5.617-5.018-5.617zM8.761 10.907c-1.36 0-2.188-1.176-2.188-2.843 0-1.742 0.904-2.843 2.188-2.843 1.252 0 2.155 1.111 2.155 2.843 0 1.699-0.849 2.843-2.155 2.843z" />
  </svg>
);

const FiverrIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className}>
    <title>Fiverr</title>
    <path d="M21.246 6.845h-2.909v-2.315c0-0.826 0.657-1.396 1.474-1.396h1.435v-3.134h-2.195c-2.85 0-4.391 1.498-4.391 4.228v2.617h-2.006v3.201h2.006v11.954h3.665v-11.954h2.51l0.399-3.201zM11.515 0c-1.267 0-2.301 1.054-2.301 2.342s1.034 2.364 2.301 2.364 2.301-1.076 2.301-2.364-1.034-2.342-2.301-2.342zM13.348 20.001v-13.156h-3.665v13.156h3.665zM6.924 9.878c-0.19-0.57-0.422-0.781-0.929-0.781-0.824 0-1.246 0.971-1.478 2.364h4.749v1.182c0 4.94-2.555 7.36-6.225 7.36-3.166 0-5.044-2.027-5.044-5.89 0-4.328 2.681-7.265 6.775-7.265 2.513 0 4.264 0.929 5.086 3.031l-2.934 0z" />
  </svg>
);

// --- Components ---

// Error Boundary for WebGL Context Loss
class WebGLBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fallback 3D Cube using User Images

// Error Boundary specifically for Model Loading
class ModelLoaderBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("Model Load Error:", error); }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Pre-load the GLB model
const GLBModel = () => {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}3d_hologram/model.glb`);
  return <primitive object={scene} scale={1.8} position={[0, 0.3, 0]} />;
};

const ThreeDProfile = () => {
  const fallbackUI = (
    <div className="w-full h-full flex items-center justify-center relative">
      <img src={`${import.meta.env.BASE_URL}hologram/front.png`} alt="Hologram Fallback" className="w-64 h-64 object-cover opacity-80 mix-blend-screen animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-red-500/30 backdrop-blur-md text-center">
          <div className="text-red-400 font-bold mb-1">Model Error</div>
          <div className="text-slate-400 text-xs text-nowrap">Please provide .glb format</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center">
      {/* Holographic Container Glow */}
      <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <WebGLBoundary fallback={fallbackUI}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

          <Suspense fallback={null}>
            <ModelLoaderBoundary fallback={null}>
              <GLBModel />
            </ModelLoaderBoundary>
            <Environment preset="city" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} width={10} height={10} color="#000000" />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={true}
            autoRotateSpeed={2}
          />
        </Canvas>
      </WebGLBoundary>

      {/* Fallback Image Layer - Visible if model fails to load (Canvas transparent) */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-50">
        <img src={`${import.meta.env.BASE_URL}hologram/front.png`} className="h-full object-contain blur-sm mix-blend-screen" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-red-500/30 backdrop-blur-md text-center shadow-2xl">
            <div className="text-red-400 font-bold mb-1">Model Error</div>
            <div className="text-slate-400 text-xs text-nowrap">Please provide .glb format</div>
          </div>
        </div>
      </div>

      {/* Holographic Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient(circle, transparent 50%, rgba(15, 23, 42, 0.4) 100%)"></div>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-indigo-500/20 flex items-center gap-2 backdrop-blur-md z-20 pointer-events-none whitespace-nowrap bg-slate-900/40">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
        <div className="text-indigo-200 text-[10px] uppercase tracking-widest font-mono">Interactive Hologram</div>
      </div>
    </div>
  );
};

// Helper for smooth scrolling with offset
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  } else if (id === 'hero') {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">{subtitle}</p>}
    <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mt-4 rounded-full"></div>
  </div>
);

// Styled Social Link Button
const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string; highlight?: boolean }> = ({ href, icon, label, highlight }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all group active:scale-95 ${highlight
      ? 'bg-white text-slate-950 border-slate-200 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-500/10'
      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-600'
      }`}
  >
    <span className={`${highlight ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400'} group-hover:text-indigo-600 transition-colors`}>
      {icon}
    </span>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </a>
);

// Navigation
const Navbar: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNavClick = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-4 shadow-xl shadow-slate-200/50 dark:shadow-indigo-500/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 group cursor-pointer border-none bg-transparent" aria-label="Home">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
            T
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">TahirHussain</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer">About</button>
          <button onClick={() => scrollToSection('projects')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer">Projects</button>
          <button onClick={() => scrollToSection('skills')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer">Stack</button>
          <button onClick={() => scrollToSection('experience')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer">Experience</button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2"></div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all cursor-pointer border-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button onClick={() => scrollToSection('contact')} className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-slate-900/10 dark:shadow-white/10 cursor-pointer border-none font-bold">Hire Me</button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer border-none"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            className="text-slate-900 dark:text-slate-300 bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5 duration-200 bg-white/90 dark:bg-slate-950/90">
          <button onClick={() => handleMobileNavClick('about')} className="text-left text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 bg-transparent border-none cursor-pointer">About</button>
          <button onClick={() => handleMobileNavClick('projects')} className="text-left text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 bg-transparent border-none cursor-pointer">Projects</button>
          <button onClick={() => handleMobileNavClick('skills')} className="text-left text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 bg-transparent border-none cursor-pointer">Stack</button>
          <button onClick={() => handleMobileNavClick('experience')} className="text-left text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 bg-transparent border-none cursor-pointer">Experience</button>
          <button onClick={() => handleMobileNavClick('contact')} className="mt-2 w-full py-3 rounded-xl bg-indigo-600 dark:bg-white text-white dark:text-slate-950 font-bold hover:bg-indigo-700 dark:hover:bg-indigo-50 text-center border-none cursor-pointer shadow-lg shadow-indigo-500/20">Hire Me</button>
        </div>
      )}
    </nav>
  );
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Tahir's AI assistant. Ask me anything about his projects, skills, or experience." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    // Optimistic Update
    const newMessages = [...messages, { role: 'user', text: userMessage } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      // Construct context from data files
      const context = `
        You are an AI Assistant for Tahir Hussain's portfolio website. 
        Your goal is to answer questions about Tahir professionally and concisely using ONLY the following data.
        
        SKILLS: ${JSON.stringify(SKILLS)}
        PROJECTS: ${JSON.stringify(PROJECTS)}
        EXPERIENCE: ${JSON.stringify(EXPERIENCES)}
        ACHIEVEMENTS: ${JSON.stringify(ACHIEVEMENTS)}
        CERTIFICATIONS: ${JSON.stringify(CERTIFICATIONS)}

        Instructions:
        1. Keep answers brief (under 100 words) unless asked for detail.
        2. Be enthusiastic but professional.
        3. If asked about something not in the data, say "I don't have that information, but you can contact Tahir directly."
        4. If the user asks for contact info, provide his email: tahir.hussain66678@gmail.com
        5. Format your response using Markdown. Use bolding (**text**) for important terms and bullet points for lists. Structure the response clearly.
      `;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: context,
      });

      // Construct context from data files (already done above in context variable)
      // ...

      // Filter out client-side initial greeting if it exists to adhere to API strictness (User first)
      const history = newMessages
        .filter((_, index) => index > 0 || newMessages[0].role !== 'model')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      // If history is empty (i.e. first message was model greeting and we just added user message),
      // ensure we have the user message.
      if (history.length === 0) {
        history.push({ role: 'user', parts: [{ text: userMessage }] });
      }

      const result = await model.generateContent({
        contents: history,
      });

      const response = await result.response;
      const text = response.text();
      setMessages(prev => [...prev, { role: 'model', text: text || "I'm having trouble connecting right now." }]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMessage = "Sorry, I can't access the AI brain right now. Please try again later.";

      if (error.message?.includes('429') || error.message?.includes('Resource has been exhausted') || error.toString().includes('429')) {
        errorMessage = "⚠️ **System Update:** The AI is currently experiencing high traffic (Quota Limit Reached). Please try again in about a minute.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 border-none cursor-pointer flex items-center justify-center ${isOpen
          ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-white rotate-90'
          : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-110 animate-bounce-subtle'
          }`}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-96 h-[500px] glass bg-white/95 dark:bg-slate-950/95 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Tahir's AI Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                    }`}
                >
                  {msg.role === 'model' ? (
                    <ReactMarkdown className="markdown-content">{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about skills, projects..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white text-sm transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-[10px] text-center text-slate-400 mt-2">
              AI can make mistakes. Check important info.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState<'All' | 'AI' | 'Data' | 'Dev'>('All');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Radar Chart Data for Skills
  const skillData = [
    { subject: 'Data Science', A: 95, fullMark: 100 },
    { subject: 'ML', A: 85, fullMark: 100 },
    { subject: 'SQL', A: 90, fullMark: 100 },
    { subject: 'Dev', A: 80, fullMark: 100 },
    { subject: 'Visuals', A: 95, fullMark: 100 },
    { subject: 'NLP', A: 75, fullMark: 100 },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const subject = `Portfolio Inquiry from ${data.name}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;

    // Construct mailto link
    const mailtoLink = `mailto:tahir.hussain66678@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = mailtoLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFormStatus('success');
    const form = e.target as HTMLFormElement;
    form.reset();
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const handleDownloadCV = () => {
    generateCV();
  };

  const filteredProjects = PROJECTS.filter(p => activeTab === 'All' || p.category === activeTab);

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 selection:text-white">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[128px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[128px] -z-10 animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping"></span>
              Available for Freelance & Career Opportunities
            </div>
            <h1 className="text-6xl lg:text-8xl font-black leading-tight text-slate-900 dark:text-white">
              Tahir <span className="gradient-text">Hussain</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Data Analyst | AI Developer bridging the gap between <span className="text-slate-900 dark:text-white font-medium">raw data</span> and <span className="text-slate-900 dark:text-white font-medium">strategic action</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 transition-all group active:scale-95 shadow-xl shadow-indigo-600/20 border-none cursor-pointer"
              >
                Let's Work Together
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3">
                <a href="https://github.com/Tahir0763" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-none" title="GitHub Profile">
                  <Github size={24} />
                </a>
                <a href="https://linkedin.com/in/tahir-hussain-a2488430a" target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-none" title="LinkedIn Profile">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">Winner</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest">AI Hackathon</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">BS CS</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest">FAST-NUCES</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">Upwork/Fiverr</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest">Freelancer</div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-auto lg:block perspective-container">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-3xl -z-10"></div>
            {/* Replaced static image with 3D Profile Component */}
            <ThreeDProfile />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section id="about" className="py-24 px-6 bg-slate-100 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Professional Summary"
            subtitle="Bridging software engineering and advanced analytics."
            icon={<Cpu size={24} />}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                I am a highly motivated Computer Science student at <span className="text-slate-900 dark:text-white font-semibold">FAST-NUCES</span> with a deep passion for Data Science and AI Engineering. My journey is defined by a proven track record in building data-driven software solutions.
              </p>
              <p>
                From satellite-integrated agricultural diagnostics to AI-powered meeting analytics, I excel at utilizing <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Python, SQL, and Tableau</span> to extract actionable insights from complex datasets. My goal is to deliver scalable predictive models that bridge the gap between raw data and strategic decision-making.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 bg-white dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                Education
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold">2024–Present</div>
                  <div className="text-slate-800 dark:text-white font-semibold">BS Computer Science</div>
                  <div className="text-slate-500 text-sm">FAST-NUCES, Pakistan</div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Core Coursework</div>
                  <div className="flex flex-wrap gap-2">
                    {["Data Analysis", "Stats", "AI", "Algorithms", "ML"].map(c => (
                      <span key={c} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Technical Arsenal"
            subtitle="The technologies and methodologies I master to build intelligent solutions."
            icon={<Terminal size={24} />}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SKILLS.map((cat, i) => (
              <div key={i} className="group glass rounded-2xl p-8 bg-white dark:bg-slate-900/20 hover:border-indigo-500/30 transition-all hover:-translate-y-2">
                <div className="mb-6">
                  {cat.category === "Data Science" && <BrainCircuit className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />}
                  {cat.category === "Visualization" && <BarChart3 className="text-purple-600 dark:text-purple-400 mb-4" size={32} />}
                  {cat.category === "Development" && <Code className="text-emerald-600 dark:text-emerald-400 mb-4" size={32} />}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{cat.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, j) => (
                    <span key={j} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6 bg-slate-100 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Featured Work"
            subtitle="Impactful projects ranging from Computer Vision to NLP."
            icon={<Database size={24} />}
          />

          <div className="flex flex-wrap items-center gap-4 mb-12">
            {(['All', 'AI', 'Data', 'Dev'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
              >
                {tab === 'Dev' ? 'Software Dev' : tab === 'Data' ? 'Data Analytics' : tab === 'AI' ? 'AI / ML' : tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group glass rounded-3xl overflow-hidden bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col h-full shadow-sm dark:shadow-none">
                <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass border border-white/20 text-xs font-bold text-white">
                    {project.year}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500 text-white shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{project.title}</h3>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <ul className="space-y-4 mb-8 flex-grow">
                    {project.description.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={project.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white dark:hover:text-slate-950 font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    View Project <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500">
                No projects found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Career Path"
            subtitle="My professional evolution in analysis and software development."
            icon={<ChevronRight size={24} />}
          />
          <div className="space-y-12">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="relative pl-12 border-l-2 border-slate-200 dark:border-slate-800 group hover:border-indigo-500 transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-950 group-hover:bg-indigo-500 transition-all group-hover:scale-125"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-2">
                      {exp.company} <span className="text-slate-400 dark:text-slate-600">•</span> {exp.location}
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-mono">
                    {exp.period}
                  </div>
                </div>
                <ul className="space-y-3">
                  {exp.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <div className="rounded-3xl bg-indigo-600 p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Need the full story?</h3>
                  <p className="text-indigo-100 max-w-xl text-lg">
                    Download my complete professional CV in PDF format for all technical details and contact information.
                  </p>
                </div>
                <button
                  onClick={handleDownloadCV}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Download CV <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Credentials */}
      <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionHeader title="Achievements" icon={<Award size={24} />} />
            <div className="space-y-6">
              {ACHIEVEMENTS.map((ach, i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-2xl glass bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 transition-all">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{ach.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400">{ach.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Credentials" icon={<BookOpen size={24} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} className="p-4 rounded-xl glass bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {cert}
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden group shadow-xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform">
                <Download size={120} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Need the full story?</h3>
              <p className="text-indigo-100 mb-6 max-w-xs">Download my complete professional CV in PDF format for all technical details and contact information.</p>
              <button
                onClick={handleDownloadCV}
                className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 active:scale-95 shadow-lg shadow-white/10 border-none cursor-pointer"
                aria-label="Download CV"
              >
                Download CV <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 relative overflow-hidden bg-white/50 dark:bg-slate-900/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Let's build the <span className="gradient-text">future</span> of data together.</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-md">Whether it's a complex dataset that needs decoding or a new AI feature, I'm ready to bring your vision to life.</p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <button
                      onClick={() => handleCopy('tahir.hussain66678@gmail.com', 'email')}
                      className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all relative cursor-pointer border-none"
                      aria-label="Copy Email"
                    >
                      {copyStatus === 'email' ? <Check size={20} /> : <Mail size={20} />}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</span>
                      <span className="text-slate-900 dark:text-slate-300 font-medium">tahir.hussain66678@gmail.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <button
                      onClick={() => handleCopy('+923027999986', 'phone')}
                      className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all cursor-pointer border-none"
                      aria-label="Copy Phone Number"
                    >
                      {copyStatus === 'phone' ? <Check size={20} /> : <Phone size={20} />}
                    </button>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Phone</span>
                      <span className="text-slate-900 dark:text-slate-300 font-medium">+92 302 7999986</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-12">
                  <SocialLink href="https://github.com/Tahir0763" icon={<Github size={20} />} label="GitHub" />
                  <SocialLink href="https://linkedin.com/in/tahir-hussain-a2488430a" icon={<Linkedin size={20} />} label="LinkedIn" highlight />
                  <SocialLink href="https://www.upwork.com/freelancers/~01d689e0e9fa8a932b?mp_source=share" icon={<UpworkIcon size={20} />} label="Upwork" />
                  <SocialLink href="https://www.fiverr.com/users/tahirhussain474/seller_dashboard" icon={<FiverrIcon size={24} />} label="Fiverr" />
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-1">Name</label>
                    <input id="name" name="name" required type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-1">Email</label>
                    <input id="email" name="email" required type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-1">Project Brief</label>
                  <textarea id="message" name="message" required rows={5} placeholder="Tell me about your project or job perspective..." className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-colors resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"></textarea>
                </div>

                <button
                  disabled={formStatus !== 'idle'}
                  className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group active:scale-[0.98] border-none cursor-pointer ${formStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-50 shadow-xl shadow-slate-900/10 dark:shadow-white/5'
                    }`}
                >
                  {formStatus === 'idle' && (
                    <>Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                  {formStatus === 'loading' && (
                    <><Loader2 size={20} className="animate-spin" /> Sending...</>
                  )}
                  {formStatus === 'success' && (
                    <><Check size={20} /> Sent Successfully!</>
                  )}
                </button>
                {formStatus === 'success' && (
                  <p className="text-center text-sm text-emerald-500 animate-pulse">Thanks! I'll get back to you shortly.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-slate-900 dark:text-slate-100">Tahir Hussain</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Tahir Hussain. Built for high performance and deep analytics.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
      <ChatInterface />
    </div>
  );
}
