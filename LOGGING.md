# Winston Logger Documentation

## Overview

This project uses Winston for comprehensive logging and instrumentation. Logs are written to both the console (in development) and rotating log files.

## Setup

Winston is already configured and ready to use. The logger is set up in `lib/logger.ts`.

## Log Levels

The following log levels are available (from highest to lowest priority):

- **error**: Error events that might still allow the application to continue running
- **warn**: Warning messages for potentially harmful situations
- **info**: Informational messages that highlight the progress of the application
- **http**: HTTP request/response logging
- **debug**: Detailed information for debugging purposes

## Log Files

Logs are stored in the `logs/` directory:

- `error-YYYY-MM-DD.log`: Contains only error-level logs
- `combined-YYYY-MM-DD.log`: Contains all logs

Log files:
- Rotate daily
- Are kept for 14 days
- Have a maximum size of 20MB per file

## Usage

### Basic Logging

```typescript
import logger from '@/lib/logger';

// Error logging
logger.error('Something went wrong', { userId: 123, action: 'login' });

// Warning logging
logger.warn('Deprecated API used', { endpoint: '/api/old' });

// Info logging
logger.info('User registered successfully', { userId: 456 });

// HTTP logging (usually handled by middleware)
logger.http('GET /api/rooms 200 - 45ms');

// Debug logging (only in development)
logger.debug('Variable value:', { myVar: someValue });
```

### Using Helper Functions

```typescript
import { logError, logInfo, logWarn, logDebug } from '@/lib/loggerHelpers';

// Log an error
try {
} catch (error) {
  logError(error as Error, { context: 'user-registration', userId: 123 });
}

// Log info
logInfo('Room created successfully', { roomId: 'abc123', creatorId: 456 });

// Log warning
logWarn('Rate limit approaching', { userId: 789, requestCount: 95 });

// Log debug info
logDebug('Processing room data', { roomData: data });
```

### In API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    logger.info('Processing request', { 
      endpoint: '/api/rooms',
      method: 'POST',
      data: { name: data.name }
    });

    // ... your logic

    logger.info('Request completed successfully', { roomId: room.id });
    return NextResponse.json(room);
    
  } catch (error) {
    logger.error('Request failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### In React Components (Client-Side)

For client-side logging, you can create a wrapper that sends logs to an API endpoint:

```typescript
// Client-side logger
export const clientLogger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(message, meta);
    // Optionally send to an API endpoint
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ level: 'info', message, meta }),
    });
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(message, meta);
    fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ level: 'error', message, meta }),
    });
  },
};
```

## Middleware

The `middleware.ts` file automatically logs all HTTP requests and responses. It logs:
- Request method and path
- Query parameters
- User agent
- Response status
- Response time

## Configuration

### Environment Variables

Set in `.env`:

```env
# Log level (error, warn, info, http, debug)
LOG_LEVEL=debug

# Environment (affects log format and transports)
NODE_ENV=development
```

### Log Levels by Environment

- **Development**: `debug` level, colorized console output
- **Production**: `info` level, JSON format

## Best Practices

1. **Use Appropriate Levels**
   - `error`: Failures that need immediate attention
   - `warn`: Things that should be looked at but aren't critical
   - `info`: Important business events (user actions, significant state changes)
   - `http`: Request/response logging (handled by middleware)
   - `debug`: Detailed diagnostic information

2. **Include Context**
   Always include relevant metadata:
   ```typescript
   logger.info('User action', {
     userId: user.id,
     action: 'room-created',
     roomId: room.id,
     timestamp: new Date().toISOString(),
   });
   ```

3. **Structured Logging**
   Use objects for metadata rather than string concatenation:
   ```typescript
   // ✅ Good
   logger.info('Room created', { roomId: 123, name: 'Dungeon' });
   
   // ❌ Avoid
   logger.info(`Room created: ${roomId}, name: ${name}`);
   ```

4. **Error Logging**
   Always include the full error object:
   ```typescript
   catch (error) {
     logger.error('Operation failed', {
       error: error instanceof Error ? error.message : String(error),
       stack: error instanceof Error ? error.stack : undefined,
       context: { operation: 'room-creation', data },
     });
   }
   ```

5. **Sensitive Data**
   Never log sensitive information:
   ```typescript
   // ❌ Never log passwords, tokens, etc.
   logger.info('User logged in', { password: user.password }); // BAD!
   
   // ✅ Log only safe data
   logger.info('User logged in', { userId: user.id, email: user.email });
   ```

## Monitoring Logs

### View Logs in Docker

```bash
# View real-time logs
docker-compose logs -f web

# View last 100 lines
docker-compose logs --tail 100 web

# View logs from a specific time
docker-compose logs --since 30m web
```

### View Log Files

```bash
# View error logs
cat logs/error-2025-10-16.log

# Follow combined logs
tail -f logs/combined-2025-10-16.log

# Search logs
grep "error" logs/combined-2025-10-16.log
```

## Example: Complete API Route with Logging

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const data = await req.json();
    
    logger.info('Creating new room', {
      action: 'room-create',
      data: { name: data.name, theme: data.theme },
    });

    // Validation
    if (!data.name || !data.theme) {
      logger.warn('Invalid room data', { data });
      return NextResponse.json(
        { error: 'Name and theme are required' },
        { status: 400 }
      );
    }

    const room = await prisma.escapeRoom.create({
      data: {
        name: data.name,
        description: data.description,
        theme: data.theme,
        timer: data.timer,
        createdById: data.createdById,
      },
    });

    const duration = Date.now() - startTime;
    logger.info('Room created successfully', {
      roomId: room.id,
      duration,
    });

    return NextResponse.json(room);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to create room', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    });

    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
```

## Troubleshooting

### Logs Not Appearing

1. Check log level in `.env`: `LOG_LEVEL=debug`
2. Ensure `logs/` directory exists (created automatically)
3. Check file permissions on `logs/` directory

### Too Many Logs

Increase log level to reduce verbosity:
```env
LOG_LEVEL=info  # or 'warn' or 'error'
```

### Log Files Growing Too Large

Adjust retention in `lib/logger.ts`:
```typescript
maxFiles: '7d',  // Keep for 7 days instead of 14
maxSize: '10m',  // Reduce max file size to 10MB
```
