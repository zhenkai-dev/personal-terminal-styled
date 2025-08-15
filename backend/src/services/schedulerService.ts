import cron from 'node-cron';
import logger from '@/utils/logger';
import { updateDailyAnalytics } from './analyticsService';
import prisma from '@/utils/database';

class SchedulerService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor() {
    this.initializeJobs();
  }

  private initializeJobs(): void {
    // Update daily analytics every hour
    this.scheduleJob('daily-analytics', '0 * * * *', async () => {
      await this.updateDailyAnalyticsJob();
    });


    // Clean up old logs every day at 2 AM
    this.scheduleJob('cleanup-logs', '0 2 * * *', async () => {
      await this.cleanupLogsJob();
    });

  }

  private scheduleJob(name: string, schedule: string, task: () => Promise<void>): void {
    try {
      const job = cron.schedule(schedule, async () => {
        const startTime = Date.now();
        logger.info(`Starting scheduled job: ${name}`);
        
        try {
          await task();
          const duration = Date.now() - startTime;
          logger.info(`Completed scheduled job: ${name} in ${duration}ms`);
        } catch (error) {
          logger.error(`Error in scheduled job: ${name}`, error);
        }
      }, {
        scheduled: true,
        timezone: 'UTC'
      });

      this.jobs.set(name, job);
      logger.info(`Scheduled job registered: ${name} with schedule: ${schedule}`);
    } catch (error) {
      logger.error(`Failed to schedule job: ${name}`, error);
    }
  }

  /**
   * Update daily analytics for yesterday and today
   */
  private async updateDailyAnalyticsJob(): Promise<void> {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Update analytics for yesterday (final) and today (current)
    await Promise.all([
      updateDailyAnalytics(yesterday),
      updateDailyAnalytics(today)
    ]);
  }


  /**
   * Clean up old analytics data
   */
  private async cleanupLogsJob(): Promise<void> {
    try {
      const retentionDays = parseInt(process.env.ANALYTICS_RETENTION_DAYS || '365');
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

      // Clean up old command executions (keep aggregated data)
      const deletedExecutions = await prisma.commandExecution.deleteMany({
        where: {
          executionTime: { lt: cutoffDate },
          success: false // Only delete failed executions, keep successful ones for analytics
        }
      });

      // Clean up old file downloads
      const deletedDownloads = await prisma.fileDownload.deleteMany({
        where: {
          downloadTime: { lt: cutoffDate },
          success: false // Only delete failed downloads
        }
      });

      logger.info('Cleanup completed', {
        deletedExecutions: deletedExecutions.count,
        deletedDownloads: deletedDownloads.count,
        cutoffDate
      });
    } catch (error) {
      logger.error('Failed to cleanup old data:', error);
    }
  }


  /**
   * Stop a specific job
   */
  public stopJob(name: string): boolean {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      logger.info(`Stopped scheduled job: ${name}`);
      return true;
    }
    return false;
  }

  /**
   * Stop all jobs
   */
  public stopAllJobs(): void {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped scheduled job: ${name}`);
    });
    this.jobs.clear();
  }

  /**
   * Get status of all jobs
   */
  public getJobsStatus(): Array<{ name: string; running: boolean }> {
    return Array.from(this.jobs.entries()).map(([name, job]) => ({
      name,
      running: (job as any).running || false
    }));
  }
}

// Export singleton instance
export const schedulerService = new SchedulerService();

// Graceful shutdown
process.on('SIGTERM', () => {
  schedulerService.stopAllJobs();
});

process.on('SIGINT', () => {
  schedulerService.stopAllJobs();
});