// Custom hook for analytics tracking
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, parameters);
      }
    }
  };

  const trackCalculatorUsage = (calculatorName: string, inputs?: Record<string, any>) => {
    trackEvent('calculator_used', {
      calculator_name: calculatorName,
      event_category: 'Calculator',
      event_label: calculatorName,
      ...inputs
    });
  };

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  return {
    trackEvent,
    trackCalculatorUsage,
    trackPageView
  };
};
