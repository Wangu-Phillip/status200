import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

// Initialize Gemini with the same API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCN0eZIKo_pw3504IiZmdaCKIxJYf76_cA');

const getSystemPrompt = (userName, context, language = 'English') => `You are Lesedi AI, the digital assistant for BOCRA (Botswana Communications Regulatory Authority). 
Your context: Help users with regulatory matters: Licensing, Spectrum, complaints, domains (.bw), and USF projects. 
Current User: ${userName}
Language Preference: ${language}
QoS Context: ${JSON.stringify(context)}
Crucial objective: If any application is 'Pending Documents' or 'Flagged', proactively mention it to the user.
Be helpful, brief, and concise. Speak in the language the user speaks (English or Setswana).
Do NOT use markdown headers or bolding. Keep to plain text paragraphs under 3 sentences.`;

const getModel = (userName, context, language) => genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: getSystemPrompt(userName, context, language)
});

export default function ChatBot({ isOpen: externalOpen, initialMessage }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      if (initialMessage) {
        setMessages([{ id: uuidv4(), role: 'assistant', content: initialMessage }]);
      }
    }
  }, [externalOpen, initialMessage]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [speedContext, setSpeedContext] = useState(null);
  const [userName, setUserName] = useState("Citizen");
  const [language, setLanguage] = useState(null); // 'English' | 'Setswana'
  const scrollRef = useRef(null);

  useEffect(() => {
    // Get user name from localStorage
    const userData = localStorage.getItem('bocra_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // Generate session ID on mount
    setSessionId(uuidv4());

    // Add initial welcome message
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: `Dumela! Hello ${userName}! I am Lesedi AI, your official BOCRA Assistant. Would you like to continue in English or Setswana?`
    }]);

    // Listen for chatbot open events
    const handleOpenChat = (e) => {
      setIsOpen(true);
      setIsMinimized(false);

      if (e.detail?.autoMessage && e.detail?.context) {
        setSpeedContext(e.detail.context);
        // Auto-send a message about the speed test
        setTimeout(() => {
          const percentage = e.detail.context.percentage_of_promised;
          const autoMessage = {
            id: uuidv4(),
            role: "assistant",
            content: `I noticed your speed test results. You're getting **${e.detail.context.download_speed_mbps} Mbps** which is only **${percentage}%** of the ${e.detail.context.promised_speed_mbps} Mbps promised by ${e.detail.context.isp_name}.\n\nThis is below acceptable standards. Would you like me to help you file an official complaint with this evidence?`
          };
          setMessages(prev => [...prev, autoMessage]);
        }, 500);
      }
    };

    window.addEventListener('openChatBot', handleOpenChat);
    const handleStorage = () => {
      const userData = localStorage.getItem('bocra_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user.name) {
            setUserName(user.name.split(' ')[0]);
          }
        } catch (e) { }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('openChatBot', handleOpenChat);
      window.removeEventListener('storage', handleStorage);
    };
  }, [userName]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Use Gemini directly
      const historyMsg = messages
        .filter(msg => msg.id !== "welcome")
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const chat = getModel(userName, speedContext, language || 'English').startChat({ history: historyMsg });
      const result = await chat.sendMessage(inputValue);
      let aiResponse = result.response.text();

      // Clean up response
      aiResponse = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '').trim();

      const assistantMessage = {
        id: uuidv4(),
        role: "assistant",
        content: aiResponse
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or you can file a complaint directly through our QoS dashboard."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileComplaint = () => {
    if (speedContext?.id) {
      navigate(`/complaint/${speedContext.id}`);
      setIsOpen(false);
    } else {
      navigate('/qos');
      setIsOpen(false);
    }
  };

  return (
    <div id="ruby-container" className={`fixed bottom-6 right-6 z-[200] flex flex-col items-start transition-all duration-500 ${isOpen ? 'w-[400px]' : 'w-12'}`}>
      {/* Mini Aura for Ruby eye */}
      {!isOpen && (
        <button
          id="chatbot-trigger"
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-[#003366] rounded-2xl shadow-2xl shadow-[#0099CC]/30 flex items-center justify-center text-white hover:scale-110 transition-transform group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0099CC] to-blue-600 opacity-20 animate-pulse"></div>
          <Sparkles className="w-6 h-6 relative animate-in zoom-in spin-in duration-700" />
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="w-full h-[600px] bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] shadow-2xl shadow-black flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="heritage-overlay basket-pattern text-slate-100 opacity-[0.05]"></div>

          {/* Header */}
          <div className="relative bg-[#111827] border-b border-[#1e293b] p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">Ruby</h3>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#6DC04B] rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Assistant</span>
                  <>
                    {/* Chat Toggle Button */}
                    <AnimatePresence>
                      {!isOpen && (
                        <motion.button
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsOpen(true)}
                          id="chatbot-trigger"
                          className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-[#0A192F] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
                          data-testid="chatbot-toggle-btn"
                        >
                          <MessageCircle className="w-6 h-6" />
                        </motion.button>
                      )}
                    </AnimatePresence>

                    {/* Chat Window */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "auto" : "550px"
                          }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                          className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                          data-testid="chatbot-window"
                        >
                          {/* Header */}
                          <div className="bg-[#0A192F] text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-heading font-bold text-sm">Lesedi AI Bocra Assistant</h3>
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                  <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Online</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
                                data-testid="chatbot-minimize-btn"
                              >
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
                                data-testid="chatbot-close-btn"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="relative flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                            {messages.map((m, i) => (
                              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-[#003366] text-white shadow-lg rounded-tr-none'
                                    : 'bg-[#1e293b] border border-[#334155] text-slate-200 rounded-tl-none'
                                  }`}>
                                  {m.content}
                                  {/* Speed Alert Banner */}
                                  {speedContext && speedContext.percentage_of_promised < 50 && !isMinimized && (
                                    <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-center gap-3">
                                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                      <div className="flex-1">
                                        <p className="text-xs text-amber-800 font-medium">
                                          Low speed detected: {speedContext.percentage_of_promised}% of promised
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleFileComplaint}
                                        className="text-[10px] h-7 px-2 rounded-sm border-amber-300 text-amber-700 hover:bg-amber-100 font-bold uppercase tracking-wider"
                                      >
                                        File Complaint
                                      </Button>
                                      <Button
                                        onClick={() => handleLanguageSelect('tn')}
                                        className="w-full bg-slate-800 border border-slate-700 hover:bg-[#003366] hover:border-[#0099CC] rounded-xl py-6 font-bold text-slate-200 transition-all"
                                      >
                                        🇧🇼 Setswana
                                      </Button>
                                    </div>
                                  )}
                                  {isTyping && (
                                    <div className="flex justify-start">
                                      <div className="bg-[#1e293b] px-5 py-3 rounded-2xl rounded-tl-none flex space-x-1">
                                        <span className="w-1.5 h-1.5 bg-[#0099CC]/50 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-[#0099CC]/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[#0099CC]/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Suggested */}
                                  {language && (
                                    <div className="relative px-6 pb-2 flex flex-wrap gap-2">
                                      {CHATBOT_KNOWLEDGE[language].suggested.map((s) => (
                                        <button
                                          key={s}
                                          onClick={() => handleSend(s)}
                                          className="px-3 py-1.5 bg-[#111827] border border-[#1e293b] rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#0099CC] hover:border-[#0099CC] transition-all flex items-center"
                                        >
                                          <CornerDownRight className="w-3 h-3 mr-1 opacity-50" />
                                          {s}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Input */}
                                  {language && (
                                    <div className="relative p-6">
                                      <div className="flex items-center space-x-2 bg-[#111827] border border-[#1e293b] rounded-2xl p-2 focus-within:ring-1 focus-within:ring-[#0099CC] transition-all">
                                        <input
                                          type="text"
                                          value={inputValue}
                                          onChange={(e) => setInputValue(e.target.value)}
                                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                          placeholder={CHATBOT_KNOWLEDGE[language].placeholder}
                                          className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2 text-white placeholder:text-slate-600"
                                        />
                                        <button
                                          onClick={() => handleSend()}
                                          disabled={!inputValue.trim()}
                                          className="w-11 h-11 bg-[#003366] disabled:opacity-50 rounded-xl flex items-center justify-center text-white"
                                        >
                                          <Send className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
      )}
                              </div>
                            );
};
                            {/* Messages */}
                            {!isMinimized && (
                              <>
                                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                                  <div className="space-y-4">
                                    {messages.map((message) => (
                                      <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                      >
                                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${message.role === "user" ? "bg-[#75B2DD]" : "bg-slate-100"
                                          }`}>
                                          {message.role === "user" ? (
                                            <User className="w-4 h-4 text-white" />
                                          ) : (
                                            <Bot className="w-4 h-4 text-[#0A192F]" />
                                          )}
                                        </div>
                                        <div className={`max-w-[85%] p-3 rounded-sm ${message.role === "user"
                                          ? "bg-[#0A192F] text-white"
                                          : "bg-slate-100 text-slate-700"
                                          } shadow-sm border border-slate-100`}>
                                          <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

                                          {message.id === "welcome" && !language && (
                                            <div className="flex gap-2 mt-4">
                                              <Button
                                                size="sm"
                                                className="bg-[#75B2DD] hover:bg-[#5a9ac9] text-white text-[10px] h-8 rounded-sm font-bold uppercase tracking-widest"
                                                onClick={() => {
                                                  setLanguage('English');
                                                  setMessages(prev => [...prev, {
                                                    id: uuidv4(),
                                                    role: "assistant",
                                                    content: `Great! How can I assist you with BOCRA matters today?`
                                                  }]);
                                                }}
                                              >
                                                English
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-[#75B2DD] text-[#75B2DD] hover:bg-[#75B2DD]/10 text-[10px] h-8 rounded-sm font-bold uppercase tracking-widest"
                                                onClick={() => {
                                                  setLanguage("Setswana");
                                                  setMessages(prev => [...prev, {
                                                    id: uuidv4(),
                                                    role: "assistant",
                                                    content: `Ke itumetse go go thusa! Nka go thusa jang ka dintlha tsa BOCRA gompieno?`
                                                  }]);
                                                }}
                                              >
                                                Setswana
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    ))}

                                    {isLoading && (
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3"
                                      >
                                        <div className="w-8 h-8 bg-slate-100 rounded-sm flex items-center justify-center">
                                          <Bot className="w-4 h-4 text-[#0A192F]" />
                                        </div>
                                        <div className="bg-slate-100 p-3 rounded-sm">
                                          <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </ScrollArea>

                                {/* Input */}
                                <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                                  <div className="flex gap-2">
                                    <Input
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      onKeyPress={handleKeyPress}
                                      placeholder="Ask BOCRA Assistant..."
                                      className="flex-1 rounded-sm border-slate-200 bg-white shadow-inner"
                                      disabled={isLoading}
                                    />
                                    <Button
                                      onClick={sendMessage}
                                      disabled={!inputValue.trim() || isLoading}
                                      className="bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm w-10 p-0"
                                    >
                                      <Send className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-2 text-center font-bold uppercase tracking-[0.2em]">
                                    Powered by Gemini AI
                                  </p>
                                </div>
                              </>
                            )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                  );
}
