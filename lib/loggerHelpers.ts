import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export function logRequest(req: NextRequest) {
  const { method, url } = req;
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  logger.http(`${method} ${url}`, {
    method,
    url,
    userAgent,
  });
}

export function logResponse(req: NextRequest, res: NextResponse, duration: number) {
  const { method, url } = req;
  const status = res.status;
  
  logger.http(`${method} ${url} ${status} - ${duration}ms`, {
    method,
    url,
    status,
    duration,
  });
}

export function logError(error: Error, context?: Record<string, any>) {
  logger.error(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
}

export function logInfo(message: string, meta?: Record<string, any>) {
  logger.info(message, meta);
}

export function logWarn(message: string, meta?: Record<string, any>) {
  logger.warn(message, meta);
}

export function logDebug(message: string, meta?: Record<string, any>) {
  logger.debug(message, meta);
}
