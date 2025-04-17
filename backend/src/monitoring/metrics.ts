interface RequestMetric {
  count: number;
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  statusCodes: { [key: number]: number };
}

interface Metrics {
  requests: { [key: string]: RequestMetric };
  errors: number;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
}

export class MetricsCollector {
  private metrics: Metrics;
  private startTime: number;

  constructor() {
    this.metrics = {
      requests: {},
      errors: 0,
      uptime: 0,
      memoryUsage: process.memoryUsage()
    };
    this.startTime = Date.now();
    
    // Update metrics every minute
    setInterval(() => this.updateMetrics(), 60000);
  }

  private updateMetrics() {
    this.metrics.uptime = (Date.now() - this.startTime) / 1000;
    this.metrics.memoryUsage = process.memoryUsage();
  }

  public recordRequest(method: string, url: string, statusCode: number, duration: number) {
    const key = `${method}:${url}`;
    
    if (!this.metrics.requests[key]) {
      this.metrics.requests[key] = {
        count: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        statusCodes: {}
      };
    }
    
    const metric = this.metrics.requests[key];
    metric.count++;
    metric.totalDuration += duration;
    metric.minDuration = Math.min(metric.minDuration, duration);
    metric.maxDuration = Math.max(metric.maxDuration, duration);
    
    if (!metric.statusCodes[statusCode]) {
      metric.statusCodes[statusCode] = 0;
    }
    metric.statusCodes[statusCode]++;
    
    if (statusCode >= 500) {
      this.metrics.errors++;
    }
  }

  public getMetrics(): Metrics {
    this.updateMetrics();
    return this.metrics;
  }

  public resetMetrics() {
    this.metrics = {
      requests: {},
      errors: 0,
      uptime: (Date.now() - this.startTime) / 1000,
      memoryUsage: process.memoryUsage()
    };
  }
} 