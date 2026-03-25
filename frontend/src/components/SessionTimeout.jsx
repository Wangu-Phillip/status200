import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes

const SessionTimeout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      // Only set timeout if user is logged in
      const user = localStorage.getItem('bocra_user');
      if (user) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          localStorage.removeItem('bocra_user');
          toast({
            title: 'Session Expired',
            description: 'Your logged-in session has automatically expired due to inactivity for security reasons.',
            variant: 'destructive',
          });
          navigate('/login');
        }, AUTO_LOGOUT_TIME);
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((name) => {
      document.addEventListener(name, resetTimer, true);
    });

    // Start timer on mount/route change
    resetTimer();

    return () => {
      events.forEach((name) => {
        document.removeEventListener(name, resetTimer, true);
      });
      clearTimeout(timeoutId);
    };
  }, [navigate, toast, location.pathname]);

  return null;
};

export default SessionTimeout;
