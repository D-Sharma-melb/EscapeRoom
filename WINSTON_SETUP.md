# Winston Logger Setup - Summary

## ✅ What's Been Installed

1. **Winston packages**:
   - `winston` - Core logging library
   - `winston-daily-rotate-file` - Automatic log rotation

2. **Configuration files**:
   - `lib/logger.ts` - Main logger configuration
   - `lib/loggerHelpers.ts` - Helper functions for logging
   - `middleware.ts` - Automatic HTTP request/response logging

3. **Documentation**:
   - `LOGGING.md` - Complete documentation
   - `LOGGING_QUICK_REF.md` - Quick reference guide

4. **Example implementation**:
   - Updated `app/api/rooms/route.ts` with Winston logging

## 📁 Files Created/Modified

### New Files
- ✅ `lib/logger.ts`
- ✅ `lib/loggerHelpers.ts`
- ✅ `middleware.ts`
- ✅ `LOGGING.md`
- ✅ `LOGGING_QUICK_REF.md`

### Modified Files
- ✅ `app/api/rooms/route.ts` (example with Winston)
- ✅ `.env` (added LOG_LEVEL)
- ✅ `.gitignore` (ignore logs/)
- ✅ `.dockerignore` (exclude logs from builds)
- ✅ `Dockerfile` (create logs directory)
- ✅ `package.json` (Winston dependencies)

## 🚀 Quick Start

### 1. Rebuild Docker Container

Since we added new npm packages, rebuild:

```bash
docker-compose up -d --build web
```

### 2. Use Logger in Your Code

```typescript
import logger from '@/lib/logger';

logger.info('Application started');
logger.error('Something went wrong', { error: err.message });
```

### 3. View Logs

**Console logs (in Docker):**
```bash
docker-compose logs -f web
```

**Log files:**
```bash
# Combined logs
tail -f logs/combined-2025-10-16.log

# Error logs only
tail -f logs/error-2025-10-16.log
```

## 📊 Log Levels

- `error` - Errors that need attention
- `warn` - Warnings
- `info` - Important events (default in production)
- `http` - HTTP requests/responses
- `debug` - Detailed debugging (default in development)

## 🎯 Features

✅ **Automatic HTTP logging** via middleware
✅ **Daily log rotation** (14-day retention)
✅ **Colored console output** in development
✅ **JSON format** in production
✅ **Separate error logs** for easy monitoring
✅ **Context metadata** support
✅ **TypeScript support**

## 📝 Common Usage Patterns

### In API Routes

```typescript
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    logger.info('Creating resource', { userId: data.userId });
    // ... logic
    logger.info('Resource created', { id: resource.id });
    return NextResponse.json(resource);
  } catch (error) {
    logger.error('Failed to create resource', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Using Helpers

```typescript
import { logInfo, logError } from '@/lib/loggerHelpers';

logInfo('User action', { userId: 123, action: 'login' });
logError(error as Error, { context: 'payment-processing' });
```

## 🔧 Configuration

Edit `.env` to change log level:

```env
LOG_LEVEL=debug  # Change to: error, warn, info, http, or debug
```

## 📚 Next Steps

1. **Update other API routes** to use Winston instead of `console.log`
2. **Add business event logging** (user actions, important state changes)
3. **Set up log monitoring** in production (optional)
4. **Review logs regularly** to catch issues early

## 🔍 Monitoring

### During Development
- Watch Docker logs: `docker-compose logs -f web`
- Colored output shows log levels clearly

### In Production
- Check error logs: `logs/error-*.log`
- Monitor combined logs: `logs/combined-*.log`
- Set up alerts for error patterns (optional)

## 📖 Full Documentation

See `LOGGING.md` for complete documentation including:
- Detailed usage examples
- Best practices
- Troubleshooting
- Advanced configuration

## 🎉 You're Ready!

Winston logging is now fully set up and ready to use. Start using it in your API routes and components to track application behavior and debug issues more effectively!
