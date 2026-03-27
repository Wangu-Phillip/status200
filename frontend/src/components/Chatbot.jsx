import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot, 
  Maximize2, 
  Minimize2, 
  Paperclip, 
  MoreHorizontal,
  ChevronRight,
  Globe,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState(null); // 'set' or 'eng'
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  // SYSTEM INSTRUCTIONS: Name the Bot "Lesedi AI Bocra Assistant"
  const SYSTEM_INSTRUCTION = `
    You are Lesedi AI, the official digital assistant for the Botswana Communications Regulatory Authority (BOCRA).
    Your purpose is to provide professional, accurate, and helpful information about BOCRA services, regulations, 
    spectrum management, type approval, careers, tenders, and internet speed test (QoS) interpretations.
    
    TONE: Professional, patriotic, efficient, and welcoming.
    
    CORE PRIORITIES:
    1. Explain BOCRA's mandate: Regulating communications (Telecoms, Radio, Postal, etc).
    2. Guide users to Type Approval, License applications, and Tenders.
    3. Help citizens understand their rights as consumers of communications services.
    4. Provide support for the Careers portal.
    
    PERSONALIZATION:
    - If you know the user's name, use it naturally in conversation.
    - If the user selected Setswana, provide responses that are accessible and culturally resonant (though core technical info is often English-primary in regulation).
    
    MODEL: You are powered by Gemini 2.5-flash for real-time intelligence.
  `;

  useEffect(() => {
    // Check for logged in user to get their name
    const storedUser = localStorage.getItem('bocra_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setUserName(parsed.name);
      } catch (e) {}
    }

    // Listen for name updates in real-time
    const handleStorageChange = () => {
       const user = localStorage.getItem('bocra_user');
       if (user) {
          const parsed = JSON.parse(user);
          if (parsed.name) setUserName(parsed.name);
       }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial state is just asking for language
      setMessages([
        { 
          id: 1, 
          text: userName 
            ? `Dumela/Hello ${userName}! Welcome to BOCRA. Please select your preferred language to begin.` 
            : "Dumela/Hello! Welcome to BOCRA. I am Lesedi AI, your digital assistant. Please select your preferred language to begin.", 
          sender: 'bot', 
          isSystem: true 
        }
      ]);
    }
  }, [isOpen, userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageSelect = (lang) => {
     setLanguage(lang);
     const welcomeText = lang === 'set' 
        ? `Ke a leboga. Ke Lesedi AI, ke ka go thusa ka eng gompieno ${userName ? userName : ''}?`
        : `Thank you. I am Lesedi AI. How can I assist you today ${userName ? userName : 'with BOCRA services'}?`;
     
     setMessages(prev => [...prev, { id: Date.now(), text: welcomeText, sender: 'bot' }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !language) return;

    const currentInput = input;
    const userMessage = { id: Date.now(), text: currentInput, sender: 'user' };
    
    // Save current history BEFORE adding new message
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const history = currentHistory
        .filter(m => !m.isSystem)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));
      
      // GEMINI REQUIREMENT:
      // 1. History must start with 'user'
      // 2. Roles must alternate (user, model, user, model...)
      
      let validHistory = [];
      let nextRole = 'user';
      
      for (const msg of history) {
        if (msg.role === nextRole) {
          validHistory.push(msg);
          nextRole = nextRole === 'user' ? 'model' : 'user';
        }
      }

      const chat = model.startChat({
        history: validHistory,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await chat.sendMessage(currentInput);
      const response = await result.response;
      const botMessage = { id: Date.now(), text: response.text(), sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: "I'm experiencing a technical glitch. How else can I help you?", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden mb-6 flex flex-col transition-all duration-300 pointer-events-auto ${isExpanded ? 'w-[450px] h-[700px]' : 'w-[380px] h-[580px]'} rounded-[2.5rem]`}
          >
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r from-[#0A192F] to-[#01142F] text-white flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-10 h-10 rounded bg-[#75B2DD]/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#75B2DD]" />
                   </div>
                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A192F] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-[#75B2DD]">Lesedi AI</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">BOCRA Official Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#0A192F] text-white rounded-tr-none' 
                      : msg.isSystem 
                         ? 'bg-white border border-[#75B2DD]/20 text-[#0A192F] rounded-tl-none font-medium'
                         : 'bg-white border border-slate-100 text-[#0A192F] rounded-tl-none'
                  }`}>
                    <p className={`text-sm leading-relaxed ${msg.isSystem ? 'text-[13px]' : ''}`}>{msg.text}</p>
                    
                    {msg.isSystem && !language && (
                       <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handleLanguageSelect('eng')}
                            className="bg-[#0A192F] hover:bg-[#0A192F]/90 text-white text-[10px] font-bold h-9 px-4 rounded-sm uppercase tracking-widest"
                          >
                             English
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleLanguageSelect('set')}
                            className="border-slate-200 text-[#0A192F] text-[10px] font-bold h-9 px-4 rounded-sm uppercase tracking-widest"
                          >
                             Setswana
                          </Button>
                       </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-sm rounded-tl-none shadow-sm min-w-[60px]">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-[#75B2DD] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#75B2DD] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#75B2DD] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 relative">
               {!language && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Select Language Above</p>
                  </div>
               )}
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'set' ? "Kwala botshwa..." : "Type your message..."}
                  className="flex-1 bg-slate-50 border-none h-14 rounded-sm px-4 pr-12 text-sm text-[#0A192F] placeholder:text-slate-300 focus:bg-white transition-all ring-0 outline-none shadow-inner"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isTyping || !language}
                  className="absolute right-1 top-1 w-12 h-12 rounded-sm bg-[#0A192F] text-white hover:bg-[#01142F] p-0 shadow-lg transition-transform active:scale-90"
                >
                  <Send size={18} />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                 <div className="flex items-center gap-3">
                    <button type="button" className="text-slate-300 hover:text-[#75B2DD] transition-colors"><Paperclip size={16} /></button>
                    <button type="button" className="text-slate-300 hover:text-[#75B2DD] transition-colors"><Globe size={16} /></button>
                 </div>
                 <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={10} className="text-[#75B2DD]" /> Powered by Gemini
                 </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-[#0A192F] shadow-2xl flex items-center justify-center rounded-full group relative pointer-events-auto"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#75B2DD] to-[#0A192F] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        {isOpen ? <X className="text-[#75B2DD] z-10" /> : <MessageCircle className="text-[#75B2DD] z-10" />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75B2DD] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#75B2DD]"></span>
           </span>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
