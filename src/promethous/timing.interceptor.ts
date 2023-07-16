import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { register, Counter, Histogram } from 'prom-client';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly counter: Counter;
  private readonly histogram: Histogram;

  constructor() {
    this.counter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['route'],
    });

    this.histogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['route'],
    });

    register.registerMetric(this.counter);
    register.registerMetric(this.histogram);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        const duration = (end - start) / 1000; // Duration in seconds
        const route = request.route.path;

        this.counter.labels(route).inc();
        this.histogram.labels(route).observe(duration);
      }),
    );
  }
}