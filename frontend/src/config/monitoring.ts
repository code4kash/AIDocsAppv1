import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
export function initializeMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION,
      beforeSend(event) {
        // Filter out sensitive information
        if (event.request?.data) {
          delete event.request.data.password;
          delete event.request.data.token;
        }
        return event;
      }
    });
  }
}

// Performance monitoring
export const performanceMetrics = {
  startTime: Date.now(),
  pageLoadTime: 0,
  resourceLoadTime: 0,
  firstContentfulPaint: 0,
  largestContentfulPaint: 0,
  cumulativeLayoutShift: 0,
  firstInputDelay: 0
};

// Error boundary for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring hook
export function usePerformanceMetrics() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'navigation':
            performanceMetrics.pageLoadTime = entry.duration;
            break;
          case 'resource':
            performanceMetrics.resourceLoadTime = Math.max(
              performanceMetrics.resourceLoadTime,
              entry.duration
            );
            break;
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              performanceMetrics.firstContentfulPaint = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            performanceMetrics.largestContentfulPaint = entry.startTime;
            break;
          case 'layout-shift':
            performanceMetrics.cumulativeLayoutShift += entry.value;
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);
}

// User behavior analytics
export function trackUserBehavior(event: string, properties?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
    // Send to analytics service
    console.log('Tracking event:', event, properties);
  }
} 