import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/utils/logger';

export interface RequestWithId extends Request {
  id: string;
  startTime: number;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const reqWithId = req as RequestWithId;
  // Add unique request ID
  reqWithId.id = uuidv4();
  reqWithId.startTime = Date.now();

  // Extract useful request information
  const requestInfo = {
    id: reqWithId.id,
    method: reqWithId.method,
    url: reqWithId.url,
    ip: reqWithId.ip,
    userAgent: reqWithId.get('User-Agent'),
    sessionId: reqWithId.get('X-Session-ID'),
    contentType: reqWithId.get('Content-Type'),
    contentLength: reqWithId.get('Content-Length'),
  };

  logger.info('Incoming request', requestInfo);

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const responseTime = Date.now() - reqWithId.startTime;
    
    logger.info('Request completed', {
      id: reqWithId.id,
      method: reqWithId.method,
      url: reqWithId.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: JSON.stringify(body).length,
    });
    
    return originalJson.call(this, body);
  };

  // Handle response finish event for non-JSON responses
  res.on('finish', () => {
    if (!res.headersSent) return;
    
    const responseTime = Date.now() - reqWithId.startTime;
    
    logger.info('Request finished', {
      id: reqWithId.id,
      method: reqWithId.method,
      url: reqWithId.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  });

  next();
};