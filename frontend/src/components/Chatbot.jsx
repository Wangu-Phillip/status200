import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, X, MessageSquare, Globe, ArrowRight, CornerDownRight, Sparkles, ChevronRight } from 'lucide-react';

const CHATBOT_KNOWLEDGE = {
  en: {
    welcome: "Hello! I'm Ruby, your BOCRA digital assistant. Which language would you prefer to communicate in?",
    placeholder: "Ask Ruby anything...",
    suggested: ["Spectrum License", "Domain Registration", "USF Projects", "Consumer Rights"],
    answers: {
      "spectrum": "Spectrum licensing covers radio frequencies. You need to fill out Form S-1 for terrestrial services or S-2 for satellite. Fees depend on the frequency band and bandwidth requested.",
      "domain": "BOCRA manages the .bw registry. To register a .bw domain, you should contact an accredited registrar. You can find the list on our main website under 'Public Registry'.",
      "usf": "The Universal Service Fund (USF) supports communication infrastructure in remote areas. Current projects include the 'Schools Connectivity' and 'Rural Telephony' expansions.",
      "rights": "As a consumer, you have the right to: 1. Accurate billing, 2. Quality of service, 3. Privacy of communications, and 4. A clear dispute resolution process from your ISP.",
      "internet": "If your internet is slow, first check with your service provider. If the issue persists and they don't help, you can file a complaint with BOCRA through this portal.",
      "type approval": "Mobile phones, routers, and any radio equipment must be Type Approved by BOCRA to ensure they meet technical standards and won't interfere with networks.",
      "fees": "Regulatory fees are due annually for most licenses. You can check your outstanding balance in the 'My Documents' section under 'Invoices'.",
      "cellular license": "For a cellular license, you typically need: 1. Completed application form, 2. Proof of technical competence, 3. Business plan, 4. Company registration docs, and 5. Proof of fee payment.",
      "type approval time": "Type approval usually takes 5-10 business days once all technical documentation and sample equipment (if required) are received.",
      "under review": " 'Under Review' means our case officers are currently evaluating your technical documents or compliance data. This is a standard step before approval.",
      "default": "I'm Ruby, and I'm still learning! Try asking about 'spectrum', 'domain registry', 'USF', or 'consumer rights'."
    }
  },
  tn: {
    welcome: "Dumela! Nna ke Ruby, mothusi wa gago wa BOCRA. O ka rata gore re bue ka puo efe?",
    placeholder: "Botsa Ruby sengwe le sengwe...",
    suggested: ["Dilaesense", "Dingongorego", "Domine ya .bw", "Ditshwanelo"],
    answers: {
      "dilaesense": "Go kopa laesense e ntšha, etela 'New Application' mo dashboard ya gago. O ka bona ditlhwatlhwa mo 'Documents'.",
      "domine": "BOCRA e tlhokometse .bw. O ka ikopanya le barulaganyi ba ba kwadisitsweng go tsenya domine ya gago.",
      "ditshwanelo": "O na le tshwanelo ya go amogela ditirelo tse di siameng le go sa tshwenngwe ke diphousara tse o sa di bantseng.",
      "dingongorego": "Fa o na le mathata le modiri wa ditirelo, o ka tsenya ngongorego ka 'File Complaint'. Re rarabolola mathata mo malatsing a le 14.",
      "maemo a kopo": "'Under Review' go raya gore re sa ntse re tlhotlhomisa dipampiri tsa gago tsa kopo.",
      "default": "Ke Ruby, ke sa ntse ke ithuta! Botsa ka dilaesense, dingongorego, kgotsa thomo ya BOCRA."
    }
  }
};

const Ruby = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(null); // Null until chosen
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tourStep, setTourStep] = useState(-1);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (userData) {
      const user = JSON.parse(userData);
      const name = user.name ? user.name.split(' ')[0] : 'Citizen';
      setUserName(name);
    }

    const hasSeenTour = localStorage.getItem('bocra_tour_seen');
    const isDashboard = window.location.pathname.includes('dashboard');
    
    if (!hasSeenTour && isDashboard) {
      setTimeout(() => {
        setIsOpen(true);
        startTour();
      }, 1500);
    }
  }, []);

  useEffect(() => {
    // Initial greeting if no messages
    if (messages.length === 0 && !isTyping) {
      setMessages([
        { role: 'assistant', content: `Hello ${userName}! I'm Ruby, your BOCRA digital assistant. Before we begin, please select your preferred language:` }
      ]);
    }
  }, [userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setMessages(prev => [
      ...prev,
      { role: 'user', content: lang === 'en' ? 'English' : 'Setswana' },
      { role: 'assistant', content: CHATBOT_KNOWLEDGE[lang].welcome }
    ]);
  };

  const startTour = () => {
    setTourStep(0);
    setMessages([
      { role: 'assistant', content: `Hi ${userName}! 👋🏽 Welcome to your BOCRA portal. I'm Ruby, your digital assistant. Let's start with a quick tour!` }
    ]);
  };

  const nextTourStep = () => {
    const steps = [
      { content: "These 4 cards at the top show your application summary at a glance", target: 'stats-section' },
      { content: "This alert banner tells you when something needs your attention", target: 'alert-banner' },
      { content: "Use the sidebar to navigate between your applications, complaints, and documents", target: 'sidebar-nav' },
      { content: "And I'm always here bottom right if you have any questions!", target: 'ruby-container' }
    ];

    if (tourStep < steps.length - 1) {
      const next = tourStep + 1;
      setTourStep(next);
      setMessages(prev => [...prev, { role: 'assistant', content: steps[next].content }]);
      
      const el = document.getElementById(steps[next].target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-teal-500', 'ring-offset-4', 'ring-offset-[#020617]', 'transition-all', 'duration-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-teal-500', 'ring-offset-4'), 3000);
      }
    } else {
      setTourStep(-1);
      localStorage.setItem('bocra_tour_seen', 'true');
      setMessages(prev => [...prev, { role: 'assistant', content: "Great! Now, please select your language so I can help you better." }]);
    }
  };

  const handleSend = (text = inputValue) => {
    if (!text.trim() || !language) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const query = text.toLowerCase();
      let response = CHATBOT_KNOWLEDGE[language].answers.default;

      // Smarter query matching
      Object.entries(CHATBOT_KNOWLEDGE[language].answers).forEach(([key, value]) => {
        if (query.includes(key.toLowerCase())) response = value;
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div id="ruby-container" className={`fixed bottom-6 left-6 z-[200] flex flex-col items-start transition-all duration-500 ${isOpen ? 'w-[400px]' : 'w-16'}`}>
      {/* Mini Aura for Ruby eye */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-teal-600 rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 opacity-20 animate-pulse"></div>
          <Sparkles className="w-8 h-8 relative animate-in zoom-in spin-in duration-700" />
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="w-full h-[600px] bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] shadow-2xl shadow-black flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="heritage-overlay basket-pattern text-slate-100 opacity-[0.05]"></div>
          
          {/* Header */}
          <div className="relative bg-[#111827] border-b border-[#1e293b] p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">Ruby</h3>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Assistant</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(l => l === 'en' ? 'tn' : 'en')}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 hover:text-white"
              >
                {language === 'en' ? 'EN' : 'TN'}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-teal-600 text-white shadow-lg rounded-tr-none' 
                    : 'bg-[#1e293b] border border-[#334155] text-slate-200 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {!language && tourStep === -1 && (
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  onClick={() => handleLanguageSelect('en')} 
                  className="w-full bg-slate-800 border border-slate-700 hover:bg-teal-600 hover:border-teal-500 rounded-xl py-6 font-bold text-slate-200 transition-all"
                >
                  🇬🇧 English
                </Button>
                <Button 
                  onClick={() => handleLanguageSelect('tn')} 
                  className="w-full bg-slate-800 border border-slate-700 hover:bg-teal-600 hover:border-teal-500 rounded-xl py-6 font-bold text-slate-200 transition-all"
                >
                  🇧🇼 Setswana
                </Button>
              </div>
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1e293b] px-5 py-3 rounded-2xl rounded-tl-none flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-teal-500/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tour Controls */}
          {tourStep !== -1 && (
            <div className="px-6 pb-2">
              <Button 
                onClick={nextTourStep} 
                className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20"
              >
                {tourStep === 3 ? "Finish Tour" : "Next Tip"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Suggested */}
          {language && tourStep === -1 && (
            <div className="relative px-6 pb-2 flex flex-wrap gap-2">
              {CHATBOT_KNOWLEDGE[language].suggested.map((s) => (
                <button 
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 bg-[#111827] border border-[#1e293b] rounded-xl text-[10px] font-bold text-slate-400 hover:text-teal-400 hover:border-teal-400 transition-all flex items-center"
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
              <div className="flex items-center space-x-2 bg-[#111827] border border-[#1e293b] rounded-2xl p-2 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
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
                  className="w-11 h-11 bg-teal-600 disabled:opacity-50 rounded-xl flex items-center justify-center text-white"
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

export default Ruby;

