# ADR-008: OpenTelemetry Observability Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: DevOps Team, Performance Team  

## Problem Statement

As we scale our frontend applications across multiple repositories and complex user workflows, we need comprehensive observability to:

1. **Monitor Performance**: Track application performance, loading times, and user experience metrics
2. **Debug Issues**: Quickly identify and resolve production problems with detailed tracing
3. **Understand Usage**: Gain insights into user behavior and feature adoption
4. **Optimize Resources**: Identify performance bottlenecks and optimization opportunities
5. **Ensure Reliability**: Proactively detect and prevent service degradation
6. **Compliance**: Meet observability requirements for enterprise clients
7. **Security**: Monitor for security-related events and anomalies

The decision point: How do we implement comprehensive observability that provides actionable insights without impacting application performance or user experience?

## Decision

**OpenTelemetry-First Observability**: Comprehensive instrumentation using OpenTelemetry standards with SigNoz as the primary backend, custom library for consistency, and strategic instrumentation across all application layers.

### Core Architecture
- **@zondax/otel-web**: Shared OpenTelemetry library for consistent instrumentation
- **SigNoz Cloud (EU)**: Primary observability backend for traces, metrics, and logs
- **Client-side instrumentation**: Browser performance, user interactions, API calls
- **Server-side instrumentation**: Next.js server tracing with Vercel OTel integration
- **Security-first approach**: Whitelist-based trace propagation and data protection

### Instrumentation Layers
```typescript
// Client-side: Browser performance and user interactions
OtelProvider -> Document Load + User Interaction + Fetch + Performance

// Server-side: API and server-side rendering
instrumentation.ts -> @vercel/otel -> SigNoz backend

// gRPC layer: Service-to-service communication (planned)
gRPC interceptors -> Custom spans -> Distributed tracing
```

## Alternatives Considered

### Option A: Multiple Vendor Solutions (DataDog, Sentry, New Relic)
**Pros**: Best-in-class features for specific use cases, mature ecosystems
**Cons**: High costs, vendor lock-in, complex integration, data fragmentation
**Verdict**: Rejected - prefer unified approach with OpenTelemetry standards

### Option B: Custom Logging + Analytics Solutions
**Pros**: Full control, lower costs, specific optimizations
**Cons**: Significant development overhead, maintenance burden, limited features
**Verdict**: Rejected - reinventing observability infrastructure is not core business

### Option C: Cloud Provider Solutions (AWS X-Ray, Google Cloud Trace)
**Pros**: Native integration, reasonable pricing, managed infrastructure
**Cons**: Vendor lock-in, limited customization, regional restrictions
**Verdict**: Rejected - prefer vendor-neutral OpenTelemetry approach

### Option D: No Formal Observability
**Pros**: No additional complexity, lower costs, maximum performance
**Cons**: Blind to production issues, difficult debugging, poor user experience insights
**Verdict**: Rejected - observability is essential for production applications

## Rationale

### Why OpenTelemetry + SigNoz?

**OpenTelemetry Benefits**:
- **Vendor Neutrality**: Avoid lock-in, can switch backends without code changes
- **Industry Standard**: Widely adopted, extensive ecosystem, future-proof
- **Comprehensive**: Traces, metrics, and logs in unified framework
- **Performance**: Optimized for production use with minimal overhead

**SigNoz Selection**:
- **Cost Effective**: Significantly lower costs than DataDog/New Relic
- **EU Data Residency**: GDPR compliance with European data storage
- **OpenTelemetry Native**: Built specifically for OpenTelemetry data
- **Developer Experience**: Excellent query interface and visualization

**Shared Library Strategy**:
- **Consistency**: Identical instrumentation across all applications
- **Maintenance**: Single point of configuration and updates
- **Security**: Centralized security policies and whitelist management
- **Performance**: Optimized configuration shared across repositories

### Architecture Benefits

**Developer Experience**: Rich debugging information and performance insights
**User Experience**: Proactive performance monitoring and optimization
**Operational Excellence**: Comprehensive visibility into application health
**Security**: Controlled data collection with privacy protection
**Scalability**: OpenTelemetry handles growth from startup to enterprise scale

## Consequences

### Positive
- **Faster Debugging**: Detailed traces accelerate problem resolution
- **Performance Optimization**: Data-driven performance improvements
- **User Insights**: Understanding user behavior and pain points
- **Proactive Monitoring**: Early detection of performance degradation
- **Cost Efficiency**: Lower observability costs compared to enterprise solutions
- **GDPR Compliance**: EU data residency meets regulatory requirements

### Negative
- **Initial Setup**: Requires upfront configuration and instrumentation
- **Performance Overhead**: Minimal but measurable impact on application performance
- **Data Volume**: Large applications generate significant telemetry data

### Risks
- **SigNoz Dependency**: Reliance on smaller vendor vs enterprise solutions
- **Privacy Concerns**: Telemetry data collection requires careful privacy handling
- **Cost Growth**: Telemetry volume may increase costs as applications scale

## Implementation Architecture

### 1. Shared Library Structure

**@zondax/otel-web Package**:
```typescript
// Client-side exports
export { OtelProvider } from './client/OtelProvider'
export type { OtelConfig } from './client/types'

// Server-side exports  
export { register } from './server/instrumentation'

// Utilities
export { createPerformanceUtils } from './utils/performance'
```

**Configuration Interface**:
```typescript
interface OtelConfig {
  serviceName?: string              // Service identifier
  serviceVersion?: string           // Version for deployment tracking
  signozEndpoint?: string          // SigNoz ingestion endpoint
  signozApiKey?: string            // Authentication key
  allowedTraceDomains?: string[]   // Security whitelist for trace propagation
  enableConsoleLogging?: boolean   // Development debugging
  environment?: string             // Environment detection
}
```

### 2. Client-Side Instrumentation

**React Provider Integration**:
```typescript
// app/layout.tsx
import { OtelProvider } from '@zondax/otel-web'

const OTEL_CONFIG: OtelConfig = {
  serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME,
  serviceVersion: process.env.NEXT_PUBLIC_SERVICE_VERSION,
  signozEndpoint: process.env.NEXT_PUBLIC_SIGNOZ_ENDPOINT,
  signozApiKey: process.env.NEXT_PUBLIC_SIGNOZ_API_KEY,
  allowedTraceDomains: process.env.NEXT_PUBLIC_TRACE_DOMAINS?.split(','),
  enableConsoleLogging: process.env.NODE_ENV === 'development'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <OtelProvider config={OTEL_CONFIG}>
          {children}
        </OtelProvider>
      </body>
    </html>
  )
}
```

**Automatic Instrumentation**:
```typescript
// OtelProvider.tsx - Automatic browser instrumentation
const instrumentations = [
  new DocumentLoadInstrumentation(),           // Page load performance
  new UserInteractionInstrumentation(),       // Clicks, form submissions
  new FetchInstrumentation({                   // API calls with selective headers
    propagateTraceHeaderCorsUrls: allowedDomainMatchers,
    clearTimingResources: true
  }),
  new XMLHttpRequestInstrumentation({          // Legacy XHR support
    propagateTraceHeaderCorsUrls: allowedDomainMatchers
  })
]
```

### 3. Server-Side Instrumentation

**Next.js Integration**:
```typescript
// instrumentation.ts - Server-side tracing
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel')
    registerOTel({
      serviceName: process.env.OTEL_SERVICE_NAME || 'app-web-server',
      traceExporter: 'otlp',
      instrumentationConfig: {
        fetch: { requestHook: addCustomHeaders },
        fs: false, // Disable filesystem instrumentation
        dns: false // Disable DNS instrumentation
      }
    })
  }
}
```

### 4. Security and Privacy Implementation

**Domain Whitelist Strategy**:
```typescript
// Security: Only propagate trace headers to trusted domains
const createDomainMatchers = (domains: string[]) => {
  return domains.map(domain => {
    if (domain.startsWith('.')) {
      return new RegExp(`^https?:\\/\\/[^.]*\\${domain.replace('.', '\\.')}`)
    }
    return new RegExp(`^https?:\\/\\/${domain.replace('.', '\\.')}`)
  })
}

const allowedDomains = [
  'localhost',
  '127.0.0.1', 
  '.vercel.app',
  '.zondax.ch',
  // Exclude: clerk.dev, stripe.com, external APIs
]
```

**Data Protection**:
```typescript
// Sensitive data exclusion
const spanProcessor = new BatchSpanProcessor(traceExporter, {
  exportTimeout: 5000,
  scheduledDelay: 1000,
  maxExportBatchSize: 512,
  maxQueueSize: 2048
})

// Custom attribute processor to remove PII
const attributeProcessor = {
  process: (span: Span) => {
    // Remove sensitive attributes
    span.deleteAttribute('user.email')
    span.deleteAttribute('user.phone')
    return span
  }
}
```

### 5. Performance Monitoring

**Custom Performance Utilities**:
```typescript
// performance-utils.ts
export const createPerformanceUtils = () => ({
  measureRender: (componentName: string) => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      trace.getActiveSpan()?.setAttributes({
        'component.name': componentName,
        'component.render_duration': duration
      })
    }
  },

  trackUserFlow: (flowName: string, step: string) => {
    trace.getActiveSpan()?.setAttributes({
      'user_flow.name': flowName,
      'user_flow.step': step,
      'user_flow.timestamp': Date.now()
    })
  }
})
```

**Core Web Vitals Tracking**:
```typescript
// Automatic Core Web Vitals collection
const vitalsObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      trace.getActiveSpan()?.setAttributes({
        'web_vital.lcp': entry.startTime,
        'web_vital.type': 'largest-contentful-paint'
      })
    }
  })
})

vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
```

### 6. gRPC Integration (Planned Enhancement)

**gRPC Interceptor Pattern**:
```typescript
// Future: gRPC telemetry integration
const createTracingInterceptor = (): grpc.Interceptor => {
  return (options, nextCall) => {
    const tracer = trace.getTracer('grpc-client')
    
    return tracer.startActiveSpan(`grpc.${options.method_definition.path}`, (span) => {
      span.setAttributes({
        'rpc.system': 'grpc',
        'rpc.method': options.method_definition.path,
        'rpc.service': options.method_definition.service
      })

      const call = nextCall(options)
      
      call.on('status', (status) => {
        span.setStatus({ code: status.code, message: status.details })
        span.end()
      })

      return call
    })
  }
}
```

### 7. Environment Configuration

**Development Environment**:
```bash
# Development settings - local debugging
NEXT_PUBLIC_SERVICE_NAME=app-web-client-dev
NEXT_PUBLIC_SIGNOZ_ENDPOINT=http://localhost:3301/v1/traces
NEXT_PUBLIC_OTEL_CONSOLE_LOGGING=true
NEXT_PUBLIC_TRACE_DOMAINS=localhost,127.0.0.1
```

**Production Environment**:
```bash
# Production settings - SigNoz cloud
NEXT_PUBLIC_SERVICE_NAME=app-web-client
NEXT_PUBLIC_SERVICE_VERSION=${VERCEL_GIT_COMMIT_SHA}
NEXT_PUBLIC_SIGNOZ_ENDPOINT=https://ingest.eu.signoz.cloud/v1/traces
NEXT_PUBLIC_SIGNOZ_API_KEY=${SIGNOZ_API_KEY}
NEXT_PUBLIC_TRACE_DOMAINS=.vercel.app,.zondax.ch
NEXT_PUBLIC_OTEL_CONSOLE_LOGGING=false
```

### 8. Multi-Repository Consistency

**Template-Derivative Pattern**:
```typescript
// Each app has custom configuration while sharing core library
// ks-frontend/app/layout.tsx
const KS_OTEL_CONFIG = {
  serviceName: 'ks-frontend',
  allowedTraceDomains: ['ks.zondax.ch', '.vercel.app']
}

// prio-frontend/app/layout.tsx  
const PRIO_OTEL_CONFIG = {
  serviceName: 'prio-frontend',
  allowedTraceDomains: ['prio.zondax.ch', '.vercel.app']
}
```

**Shared Library Updates**:
- Single source of truth for instrumentation logic
- Consistent security policies across all applications
- Synchronized updates and improvements
- Unified debugging and troubleshooting

### 9. Monitoring and Alerting

**SigNoz Dashboard Configuration**:
```typescript
// Custom dashboards for key metrics
const dashboards = {
  performance: {
    metrics: ['page_load_time', 'time_to_interactive', 'largest_contentful_paint'],
    alerts: { page_load_time: { threshold: '3s', severity: 'warning' } }
  },
  errors: {
    metrics: ['error_rate', 'error_count', 'unhandled_exceptions'],
    alerts: { error_rate: { threshold: '5%', severity: 'critical' } }
  },
  user_experience: {
    metrics: ['user_interactions', 'bounce_rate', 'session_duration'],
    alerts: { bounce_rate: { threshold: '80%', severity: 'warning' } }
  }
}
```

### 10. Testing and Quality Assurance

**Telemetry Testing**:
```typescript
// test/otel.test.ts
describe('OpenTelemetry Integration', () => {
  it('creates spans for user interactions', async () => {
    const spans = captureSpans()
    
    await userEvent.click(screen.getByRole('button'))
    
    expect(spans).toContainEqual(
      expect.objectContaining({
        name: 'click',
        attributes: expect.objectContaining({
          'event_type': 'click',
          'target_element': 'button'
        })
      })
    )
  })

  it('excludes sensitive data from traces', () => {
    const span = createTestSpan({ 'user.email': 'test@example.com' })
    
    processSpan(span)
    
    expect(span.attributes).not.toHaveProperty('user.email')
  })
})
```

## Future Enhancements

### Planned Features
- **Custom Metrics**: Business-specific metrics (user engagement, feature adoption)
- **Log Correlation**: Structured logging with trace correlation
- **Real User Monitoring**: Enhanced user experience tracking
- **Error Tracking**: Comprehensive error monitoring and alerting
- **Performance Budgets**: Automated performance regression detection

### Advanced Instrumentation
- **gRPC Tracing**: Distributed tracing across service boundaries
- **Database Queries**: Query performance and optimization insights
- **Cache Operations**: Cache hit rates and performance tracking
- **Custom Spans**: Manual instrumentation for business logic

### Analytics Integration
- **User Journey Analysis**: Complete user flow tracking
- **A/B Test Correlation**: Experiment performance impact analysis
- **Business Metrics**: Revenue and conversion tracking
- **Predictive Analytics**: Performance trend analysis and forecasting

## Related Decisions

- **ADR-005**: StoreBuilder architecture benefits from gRPC tracing integration
- **ADR-007**: Testing standards include telemetry testing patterns
- **ADR-001**: Chat components require performance monitoring for large datasets
- **ADR-006**: VCommon virtualization performance needs detailed instrumentation

---

*This OpenTelemetry architecture provides comprehensive observability for all Zondax applications while maintaining performance, security, and cost efficiency. The vendor-neutral approach ensures long-term flexibility and scalability.*