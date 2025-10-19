# Winston Logger - Quick Reference

## Import Logger

```typescript
import logger from '@/lib/logger';
```

## Basic Usage

```typescript
// Error
logger.error('Error message', { context: 'value' });

// Warning
logger.warn('Warning message', { userId: 123 });

// Info
logger.info('Info message', { action: 'created' });

// HTTP (usually via middleware)
logger.http('GET /api/rooms 200 - 45ms');

// Debug (development only)
logger.debug('Debug info', { data: someData });
```

## In API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    logger.info('Processing request', { endpoint: '/api/example' });
    
    // Your logic here
    
    logger.info('Request completed');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    logger.error('Request failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## Helper Functions

```typescript
import { logError, logInfo, logWarn } from '@/lib/loggerHelpers';

logInfo('User logged in', { userId: 123 });
logWarn('Rate limit approaching', { count: 95 });
logError(error as Error, { context: 'payment' });
```

## View Logs

```bash
# Docker logs (console output)
docker-compose logs -f web

# Log files
tail -f logs/combined-2025-10-16.log
tail -f logs/error-2025-10-16.log
```

## Configuration

In `.env`:
```env
LOG_LEVEL=debug  # error, warn, info, http, debug
NODE_ENV=development
```

## Log Files Location

- `logs/error-YYYY-MM-DD.log` - Errors only
- `logs/combined-YYYY-MM-DD.log` - All logs
- Rotates daily, kept for 14 days

## Best Practices

✅ **DO:**
- Include context metadata
- Log important business events
- Use appropriate log levels
- Structure logs as objects

❌ **DON'T:**
- Log passwords or tokens
- Log excessive debug info in production
- Use string concatenation for metadata
