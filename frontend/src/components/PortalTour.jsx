import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from './ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const PortalTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      targetId: 'stats-section',
      content: "These show your application summary at a glance",
      title: "Stat Overview"
    },
    {
      targetId: 'sidebar-nav',
      content: "Navigate between your applications, complaints and documents here",
      title: "Navigation"
    },
    {
      targetId: 'alert-banner',
      content: "This tells you when something urgently needs your attention",
      title: "Action Center"
    },
    {
      targetId: 'new-app-button',
      content: "Start a new licence application here",
      title: "New Application"
    },
    {
      targetId: 'chatbot-trigger',
      content: "And I'm always here if you have any questions!",
      title: "Meet Ruby"
    }
  ];

  useLayoutEffect(() => {
    const updateTarget = () => {
      const element = document.getElementById(steps[currentStep].targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
        setIsVisible(true);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setIsVisible(false);
      }
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    return () => window.removeEventListener('resize', updateTarget);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('bocra_tour_seen', 'true');
      onComplete();
    }
  };

  if (!targetRect || !isVisible) return null;

  const { top, left, width, height } = targetRect;
  const padding = 8;

  // Tooltip position logic
  const tooltipTop = top + height + 20;
  const tooltipLeft = Math.max(20, Math.min(window.innerWidth - 320, left + width / 2 - 150));

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      {/* Dimmed Overlay with Hole */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px] pointer-events-auto transition-all duration-500"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 
            ${left - padding}px 100%, 
            ${left - padding}px ${top - padding}px, 
            ${left + width + padding}px ${top - padding}px, 
            ${left + width + padding}px ${top + height + padding}px, 
            ${left - padding}px ${top + height + padding}px, 
            ${left - padding}px 100%, 
            100% 100%, 100% 0%
          )`
        }}
      />

      {/* Pulsing Highlight */}
      <div 
        className="absolute transition-all duration-500 rounded-2xl pointer-events-none"
        style={{
          top: top - padding,
          left: left - padding,
          width: width + padding * 2,
          height: height + padding * 2,
          boxShadow: '0 0 0 4px rgba(20, 184, 166, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)',
        }}
      >
        <div className="absolute inset-0 rounded-2xl animate-ping border-2 border-teal-500 opacity-50"></div>
      </div>

      {/* Tooltip */}
      <div 
        className="absolute w-[300px] bg-[#0a0f1e] border border-[#1e293b] rounded-[1.5rem] p-6 shadow-2xl pointer-events-auto transition-all duration-500 animate-in fade-in zoom-in duration-300"
        style={{ 
          top: tooltipTop > window.innerHeight - 250 ? top - 220 : tooltipTop,
          left: tooltipLeft
        }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-black text-xs uppercase tracking-widest text-[#E8F0F9]">{steps[currentStep].title}</h4>
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
          {steps[currentStep].content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? 'w-4 bg-teal-500' : 'bg-slate-700'}`}
              />
            ))}
          </div>
          <Button 
            onClick={handleNext}
            className="bg-teal-600 hover:bg-teal-700 h-10 px-6 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 group"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalTour;
