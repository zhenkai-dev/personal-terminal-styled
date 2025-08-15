import prisma from '@/utils/database';
import logger from '@/utils/logger';

export interface CommandExecutionData {
  userId: string;
  commandName: string;
  responseTimeMs: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  success: boolean;
  errorMessage?: string;
}

/**
 * Track command execution
 */
export const trackCommandExecution = async (executionData: CommandExecutionData): Promise<void> => {
  try {
    await prisma.commandExecution.create({
      data: executionData
    });
  } catch (error) {
    logger.error('Failed to track command execution:', error);
    // Don't throw error to avoid disrupting the main flow
  }
};

/**
 * Track file download
 */
export const trackFileDownload = async (downloadData: {
  userId: string;
  fileName: string;
  fileType: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  success: boolean;
}): Promise<void> => {
  try {
    await prisma.fileDownload.create({
      data: downloadData
    });
  } catch (error) {
    logger.error('Failed to track file download:', error);
  }
};

/**
 * Update daily analytics
 */
export const updateDailyAnalytics = async (date: Date): Promise<void> => {
  try {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get statistics for the day
    const [uniqueVisitors, totalCommands, totalDownloads] = await Promise.all([
      prisma.user.count({
        where: {
          lastVisitAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      prisma.commandExecution.count({
        where: {
          executionTime: {
            gte: startOfDay,
            lt: endOfDay
          },
          success: true
        }
      }),
      prisma.fileDownload.count({
        where: {
          downloadTime: {
            gte: startOfDay,
            lt: endOfDay
          },
          success: true
        }
      })
    ]);

    // Get most popular command
    const popularCommand = await prisma.commandExecution.groupBy({
      by: ['commandName'],
      where: {
        executionTime: {
          gte: startOfDay,
          lt: endOfDay
        },
        success: true
      },
      _count: { commandName: true },
      orderBy: { _count: { commandName: 'desc' } },
      take: 1
    });

    const mostPopularCommand = popularCommand.length > 0 ? popularCommand[0].commandName : null;

    // Update or create daily analytics record
    await prisma.analyticsDaily.upsert({
      where: { date: startOfDay },
      update: {
        uniqueVisitors,
        totalCommands,
        totalDownloads,
        mostPopularCommand,
        updatedAt: new Date()
      },
      create: {
        date: startOfDay,
        uniqueVisitors,
        totalCommands,
        totalDownloads,
        mostPopularCommand
      }
    });

    logger.info('Daily analytics updated', {
      date: startOfDay.toISOString(),
      uniqueVisitors,
      totalCommands,
      totalDownloads,
      mostPopularCommand
    });

  } catch (error) {
    logger.error('Failed to update daily analytics:', error);
  }
};

/**
 * Get command popularity rankings
 */
export const getCommandPopularity = async (days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return await prisma.commandExecution.groupBy({
    by: ['commandName'],
    where: {
      executionTime: { gte: startDate },
      success: true
    },
    _count: { commandName: true },
    _avg: { responseTimeMs: true },
    orderBy: { _count: { commandName: 'desc' } }
  });
};

/**
 * Get user engagement metrics
 */
export const getUserEngagementMetrics = async (days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    avgCommandsPerUser,
    userRetention
  ] = await Promise.all([
    // Total users
    prisma.user.count(),

    // Active users in period
    prisma.user.count({
      where: { lastVisitAt: { gte: startDate } }
    }),

    // Average commands per user
    prisma.user.aggregate({
      _avg: { totalCommands: true }
    }),

    // User retention (users who visited more than once)
    prisma.user.count({
      where: {
        totalCommands: { gt: 1 },
        lastVisitAt: { gte: startDate }
      }
    })
  ]);

  return {
    totalUsers,
    activeUsers,
    avgCommandsPerUser: Math.round(avgCommandsPerUser._avg.totalCommands || 0),
    userRetention: activeUsers > 0 ? ((userRetention / activeUsers) * 100).toFixed(1) : '0',
    engagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0'
  };
};