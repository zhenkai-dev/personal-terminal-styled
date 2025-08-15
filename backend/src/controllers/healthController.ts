import { Request, Response, NextFunction } from 'express';
import prisma from '@/utils/database';
import { env } from '@/config/environment';

/**
 * Health check endpoint
 */
export const getHealthStatus = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const startTime = Date.now();
    
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - startTime;
    
    // Get basic system info
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    // Calculate memory usage in MB
    const memoryInMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        human: formatUptime(uptime)
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: env.NODE_ENV,
      node: process.version,
      memory: memoryInMB,
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`
      }
    };

    res.json(health);

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      version: process.env.npm_package_version || '1.0.0',
      environment: env.NODE_ENV
    });
  }
};

/**
 * Format uptime in human readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}