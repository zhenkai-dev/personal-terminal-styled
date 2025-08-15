import { Request, Response, NextFunction } from 'express';
import prisma from '@/utils/database';

/**
 * Get dashboard statistics overview
 */
export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalUsers,
      totalCommands,
      totalDownloads,
      todayUsers,
      todayCommands,
      weeklyUsers,
      monthlyUsers
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.commandExecution.count(),
      prisma.fileDownload.count(),
      
      // Today's stats
      prisma.user.count({
        where: { lastVisitAt: { gte: today } }
      }),
      prisma.commandExecution.count({
        where: { executionTime: { gte: today } }
      }),
      
      // Weekly active users
      prisma.user.count({
        where: { lastVisitAt: { gte: weekAgo } }
      }),
      
      // Monthly active users
      prisma.user.count({
        where: { lastVisitAt: { gte: monthAgo } }
      })
    ]);

    // Get most popular commands (last 7 days)
    const popularCommands = await prisma.commandExecution.groupBy({
      by: ['commandName'],
      where: { 
        executionTime: { gte: weekAgo },
        success: true
      },
      _count: { commandName: true },
      orderBy: { _count: { commandName: 'desc' } },
      take: 5
    });

    // Get recent activity (last 24 hours)
    const recentActivity = await prisma.commandExecution.findMany({
      where: { executionTime: { gte: yesterday } },
      include: { user: { select: { nickname: true, country: true } } },
      orderBy: { executionTime: 'desc' },
      take: 10
    });

    // Calculate growth rates
    const yesterdayUsers = await prisma.user.count({
      where: { 
        lastVisitAt: { 
          gte: yesterday,
          lt: today 
        }
      }
    });

    const userGrowthRate = yesterdayUsers > 0 
      ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100).toFixed(1)
      : '0';

    res.json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          totalCommands,
          totalDownloads,
          todayUsers,
          todayCommands,
          weeklyActiveUsers: weeklyUsers,
          monthlyActiveUsers: monthlyUsers,
          userGrowthRate: `${userGrowthRate}%`
        },
        popularCommands: popularCommands.map(cmd => ({
          command: cmd.commandName,
          executions: cmd._count.commandName
        })),
        recentActivity: recentActivity.map(activity => ({
          id: activity.id,
          command: activity.commandName,
          executionTime: activity.executionTime,
          user: {
            nickname: activity.user?.nickname || 'Anonymous',
            country: activity.user?.country
          },
          responseTime: activity.responseTimeMs,
          success: activity.success
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics summary with optional date range
 */
export const getAnalyticsSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;
    
    let start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let end = endDate ? new Date(endDate as string) : new Date();

    // Get command executions in date range
    const commandExecutions = await prisma.commandExecution.findMany({
      where: {
        executionTime: { gte: start, lte: end },
        success: true
      },
      select: {
        executionTime: true,
        commandName: true,
        responseTimeMs: true
      }
    });

    // Get unique users in date range
    const uniqueUsers = await prisma.user.count({
      where: { lastVisitAt: { gte: start, lte: end } }
    });

    // Get file downloads in date range
    const fileDownloads = await prisma.fileDownload.count({
      where: { downloadTime: { gte: start, lte: end } }
    });

    // Group by time period
    const groupedData = groupByPeriod(commandExecutions, period as string);

    // Calculate average response time
    const avgResponseTime = commandExecutions.length > 0
      ? Math.round(commandExecutions.reduce((sum, cmd) => sum + (cmd.responseTimeMs || 0), 0) / commandExecutions.length)
      : 0;

    res.json({
      status: 'success',
      data: {
        summary: {
          totalCommands: commandExecutions.length,
          uniqueUsers,
          fileDownloads,
          avgResponseTime,
          period,
          dateRange: { start, end }
        },
        timeline: groupedData
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get command execution analytics
 */
export const getCommandAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    let start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let end = endDate ? new Date(endDate as string) : new Date();

    // Get command execution statistics
    const commandStats = await prisma.commandExecution.groupBy({
      by: ['commandName'],
      where: {
        executionTime: { gte: start, lte: end }
      },
      _count: { commandName: true },
      _avg: { responseTimeMs: true },
      _sum: { responseTimeMs: true },
      orderBy: { _count: { commandName: 'desc' } },
      take: parseInt(limit as string)
    });

    // Get success rates
    const successRates = await prisma.commandExecution.groupBy({
      by: ['commandName', 'success'],
      where: {
        executionTime: { gte: start, lte: end }
      },
      _count: { commandName: true }
    });

    // Calculate success rates for each command
    const commandAnalytics = commandStats.map(stat => {
      const totalExecutions = stat._count.commandName;
      const successfulExecutions = successRates
        .filter(sr => sr.commandName === stat.commandName && sr.success)
        .reduce((sum, sr) => sum + sr._count.commandName, 0);
      
      const successRate = totalExecutions > 0 
        ? ((successfulExecutions / totalExecutions) * 100).toFixed(1)
        : '0';

      return {
        command: stat.commandName,
        executions: totalExecutions,
        avgResponseTime: Math.round(stat._avg.responseTimeMs || 0),
        totalResponseTime: stat._sum.responseTimeMs || 0,
        successRate: `${successRate}%`
      };
    });

    res.json({
      status: 'success',
      data: {
        commands: commandAnalytics,
        dateRange: { start, end }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user behavior analytics
 */
export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let end = endDate ? new Date(endDate as string) : new Date();

    // Get active users in date range
    const users = await prisma.user.findMany({
      where: { lastVisitAt: { gte: start, lte: end } },
      include: {
        _count: {
          select: {
            commandExecutions: {
              where: { executionTime: { gte: start, lte: end } }
            },
            fileDownloads: {
              where: { downloadTime: { gte: start, lte: end } }
            }
          }
        }
      },
      orderBy: { totalCommands: 'desc' },
      take: parseInt(limit as string)
    });

    // Get geographic distribution
    const geoDistribution = await prisma.user.groupBy({
      by: ['country'],
      where: { 
        lastVisitAt: { gte: start, lte: end },
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } }
    });

    // Get timezone distribution
    const timezoneDistribution = await prisma.user.groupBy({
      by: ['timezone'],
      where: { 
        lastVisitAt: { gte: start, lte: end },
        timezone: { not: null }
      },
      _count: { timezone: true },
      orderBy: { _count: { timezone: 'desc' } }
    });

    const userAnalytics = users.map(user => ({
      id: user.id,
      nickname: user.nickname || 'Anonymous',
      totalCommands: user.totalCommands,
      commandsInPeriod: user._count.commandExecutions,
      downloadsInPeriod: user._count.fileDownloads,
      firstVisit: user.firstVisitAt,
      lastVisit: user.lastVisitAt,
      country: user.country,
      timezone: user.timezone
    }));

    res.json({
      status: 'success',
      data: {
        users: userAnalytics,
        geoDistribution: geoDistribution.map(geo => ({
          country: geo.country,
          userCount: geo._count.country
        })),
        timezoneDistribution: timezoneDistribution.map(tz => ({
          timezone: tz.timezone,
          userCount: tz._count.timezone
        })),
        dateRange: { start, end }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to group data by time period
 */
function groupByPeriod(executions: any[], period: string) {
  const groupedData: Record<string, number> = {};

  executions.forEach(execution => {
    let key: string;
    const date = new Date(execution.executionTime);

    switch (period) {
      case 'hourly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${(weekStart.getMonth() + 1).toString().padStart(2, '0')}-${weekStart.getDate().toString().padStart(2, '0')}`;
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'daily':
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        break;
    }

    groupedData[key] = (groupedData[key] || 0) + 1;
  });

  return Object.entries(groupedData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}