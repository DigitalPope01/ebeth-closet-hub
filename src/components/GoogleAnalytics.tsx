import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    // Load GA script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [GA_TRACKING_ID]);

  useEffect(() => {
    if (!GA_TRACKING_ID || !window.gtag) return;

    // Track page views
    window.gtag('config', GA_TRACKING_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location, GA_TRACKING_ID]);

  return null;
};

export default GoogleAnalytics;
